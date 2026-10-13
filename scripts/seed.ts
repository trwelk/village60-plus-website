/**
 * Seeds the development dataset. Idempotent (createOrReplace with deterministic _ids).
 * Usage: npm run seed     (reads .env.local; requires SANITY_API_WRITE_TOKEN)
 *
 * Photographs are downloaded from Unsplash into scripts/.stock-cache (gitignored)
 * and uploaded once per filename.
 */
import { createReadStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { requireEnv } from '@/lib/env';
import { seedDocuments } from './seed-data';
import { STOCK_PHOTOS, type StockPhotoKey } from './stock-photos';

const projectId = requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset = requireEnv('NEXT_PUBLIC_SANITY_DATASET');
const token = requireEnv('SANITY_API_WRITE_TOKEN');

if (dataset === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'yes') {
  throw new Error('Refusing to seed the production dataset. Seed content is unverified development filler (spec §20). Set ALLOW_PRODUCTION_SEED=yes only with client sign-off.');
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-02-01', useCdn: false });
const cacheDir = path.join(process.cwd(), 'scripts', '.stock-cache');

async function downloadPhoto(key: StockPhotoKey): Promise<string> {
  const photo = STOCK_PHOTOS[key];
  const file = path.join(cacheDir, `${key}.jpg`);
  try {
    const existing = await stat(file);
    if (existing.size > 20_000) return file;
  } catch {
    // Download below.
  }
  const url = `https://images.unsplash.com/${photo.imagePath}?w=2400&q=82&auto=format&fit=max`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download ${key} (${response.status})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error(`${key} did not download as a JPEG`);
  await writeFile(file, bytes);
  return file;
}

async function uploadPhoto(key: StockPhotoKey, file: string): Promise<string> {
  const filename = `${key}.jpg`;
  const existing = await client.fetch<string | null>(`*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`, { filename });
  if (existing) return existing;
  const asset = await client.assets.upload('image', createReadStream(file), { filename, contentType: 'image/jpeg' });
  return asset._id;
}

/** Attach the uploaded photograph for each mediaImage and drop the seed-only key. */
function attachAssets<T>(value: T, assets: Map<string, string>): T {
  if (Array.isArray(value)) return value.map((item) => attachAssets(item, assets)) as T;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const next: Record<string, unknown> = {};
    for (const [field, fieldValue] of Object.entries(record)) {
      if (fieldValue !== undefined && field !== 'seedPhoto') next[field] = attachAssets(fieldValue, assets);
    }
    if (record._type === 'mediaImage') {
      const photoKey = record.seedPhoto;
      if (typeof photoKey !== 'string' || !assets.has(photoKey)) {
        throw new Error(`No uploaded asset for image "${String(photoKey)}"`);
      }
      next.asset = { _type: 'reference', _ref: assets.get(photoKey) };
    }
    return next as T;
  }
  return value;
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset} …`);
  await mkdir(cacheDir, { recursive: true });
  const keys = Object.keys(STOCK_PHOTOS) as StockPhotoKey[];
  const assets = new Map<string, string>();
  for (const key of keys) {
    const file = await downloadPhoto(key);
    const assetId = await uploadPhoto(key, file);
    assets.set(key, assetId);
    console.log(`  ${key}: ${assetId}`);
  }

  const transaction = client.transaction();
  for (const doc of seedDocuments) {
    transaction.createOrReplace(attachAssets(doc, assets) as Parameters<typeof transaction.createOrReplace>[0]);
  }
  const result = await transaction.commit();
  console.log(`Seeded ${result.results.length} documents.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
