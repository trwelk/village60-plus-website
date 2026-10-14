/**
 * Upload the client photographs and attach them on the current dataset.
 * Updates hero images and residence galleries only. Does not rewrite copy.
 *
 * Usage: npx tsx --env-file=.env.local scripts/publish-client-photos.ts
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { requireEnv } from '@/lib/env';
import { CLIENT_PHOTOS, type ClientPhotoKey } from './client-photos';
import { seedDocuments } from './seed-data';
import { attachAssets } from './seed-assets';
import { STOCK_PHOTOS, type StockPhotoKey } from './stock-photos';

const dataset = requireEnv('NEXT_PUBLIC_SANITY_DATASET');
const client = createClient({
  projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset,
  token: requireEnv('SANITY_API_WRITE_TOKEN'),
  apiVersion: '2026-02-01',
  useCdn: false,
});

async function uploadClientPhoto(key: ClientPhotoKey): Promise<string> {
  const filename = `${key}.jpg`;
  const existing = await client.fetch<string | null>(`*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`, { filename });
  if (existing) return existing;
  const file = path.join(process.cwd(), 'scripts', 'client-photos', CLIENT_PHOTOS[key].file);
  const info = await stat(file);
  if (info.size < 10_000) throw new Error(`${file} is missing or too small`);
  const asset = await client.assets.upload('image', createReadStream(file), { filename, contentType: 'image/jpeg' });
  return asset._id;
}

async function main() {
  console.log(`Publishing client photographs to ${dataset} …`);
  const assets = new Map<string, string>();

  const stock = await client.fetch<Array<{ _id: string; originalFilename: string | null }>>(
    `*[_type == "sanity.imageAsset" && defined(originalFilename)]{ _id, originalFilename }`,
  );
  for (const asset of stock) {
    if (!asset.originalFilename) continue;
    const key = asset.originalFilename.replace(/\.jpe?g$/, '');
    if (key in STOCK_PHOTOS && !assets.has(key)) assets.set(key, asset._id);
  }
  for (const key of Object.keys(STOCK_PHOTOS) as StockPhotoKey[]) {
    if (!assets.has(key)) throw new Error(`Stand-in photograph ${key}.jpg is not uploaded yet`);
  }
  for (const key of Object.keys(CLIENT_PHOTOS) as ClientPhotoKey[]) {
    const assetId = await uploadClientPhoto(key);
    assets.set(key, assetId);
    console.log(`  ${key}: ${assetId}`);
  }

  let patched = 0;
  for (const doc of seedDocuments) {
    const record = doc as { _id: string; _type: string; heroImage?: { seedPhoto?: string }; gallery?: unknown };
    const set: Record<string, unknown> = {};
    if (record.gallery) set.gallery = attachAssets(record.gallery, assets);
    if (record.heroImage && typeof record.heroImage.seedPhoto === 'string' && record.heroImage.seedPhoto in CLIENT_PHOTOS) {
      set.heroImage = attachAssets(record.heroImage, assets);
    }
    if (Object.keys(set).length === 0) continue;
    await client.patch(record._id).set(set).commit();
    patched += 1;
    console.log(`  updated ${record._id}`);
  }
  console.log(`Updated ${patched} documents.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
