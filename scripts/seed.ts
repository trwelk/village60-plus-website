/**
 * Seeds the development dataset. Idempotent (createOrReplace with deterministic _ids).
 * Usage: npm run seed     (reads .env.local; requires SANITY_API_WRITE_TOKEN)
 */
import { createClient } from '@sanity/client';
import { requireEnv } from '@/lib/env';
import { PLACEHOLDER_SVG, seedDocuments } from './seed-data';

const projectId = requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset = requireEnv('NEXT_PUBLIC_SANITY_DATASET');
const token = requireEnv('SANITY_API_WRITE_TOKEN');

if (dataset === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'yes') {
  throw new Error('Refusing to seed the production dataset. Seed content is unverified development filler (spec §20). Set ALLOW_PRODUCTION_SEED=yes only with client sign-off.');
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-02-01', useCdn: false });

/** Attach the uploaded placeholder asset to every mediaImage that has none. */
function attachAsset<T>(value: T, assetId: string): T {
  if (Array.isArray(value)) return value.map((v) => attachAsset(v, assetId)) as T;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(record)) {
      if (v !== undefined) next[k] = attachAsset(v, assetId);
    }
    if (record._type === 'mediaImage' && !record.asset) {
      next.asset = { _type: 'reference', _ref: assetId };
    }
    return next as T;
  }
  return value;
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset} …`);
  const asset = await client.assets.upload('image', Buffer.from(PLACEHOLDER_SVG), {
    filename: 'dev-placeholder.svg',
    contentType: 'image/svg+xml',
  });
  console.log(`Placeholder asset: ${asset._id}`);

  const transaction = client.transaction();
  for (const doc of seedDocuments) {
    transaction.createOrReplace(attachAsset(doc, asset._id) as Parameters<typeof transaction.createOrReplace>[0]);
  }
  const result = await transaction.commit();
  console.log(`Seeded ${result.results.length} documents.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
