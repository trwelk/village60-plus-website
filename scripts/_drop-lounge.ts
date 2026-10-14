/**
 * One-off: stop publishing the lounge photograph on the current dataset.
 * Replaces the two heroes that use it and removes it from residence galleries.
 */
import { createClient } from '@sanity/client';
import { requireEnv } from '@/lib/env';
import { clientImage, stockImage } from './seed-data';
import { attachAssets } from './seed-assets';

const client = createClient({
  projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: requireEnv('NEXT_PUBLIC_SANITY_DATASET'),
  token: requireEnv('SANITY_API_WRITE_TOKEN'),
  apiVersion: '2026-02-01',
  useCdn: false,
});

async function assetId(filename: string): Promise<string> {
  const id = await client.fetch<string | null>(`*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`, { filename });
  if (!id) throw new Error(`Missing uploaded image ${filename}`);
  return id;
}

async function main() {
  const loungeId = await assetId('lounge-care.jpg');
  const courtyardId = await assetId('courtyard.jpg');
  const gardenId = await assetId('garden-trees.jpg');

  const residentialHero = attachAssets(stockImage('courtyard', 'residential-care'), new Map([['courtyard', courtyardId]]));
  await client.patch('careService.residential-care').set({ heroImage: residentialHero }).commit();
  console.log('updated careService.residential-care');

  const pageHero = attachAssets(clientImage('garden-trees', 'living-and-care'), new Map([['garden-trees', gardenId]]));
  await client.patch('page.living-and-care').set({ heroImage: pageHero }).commit();
  console.log('updated page.living-and-care');

  const homes = await client.fetch<Array<{ _id: string; keys: string[] }>>(
    `*[_type == "residence" && references($id)]{ _id, "keys": gallery[asset._ref == $id]._key }`,
    { id: loungeId },
  );
  for (const home of homes) {
    if (!home.keys?.length) continue;
    let patch = client.patch(home._id);
    for (const key of home.keys) patch = patch.unset([`gallery[_key=="${key}"]`]);
    await patch.commit();
    console.log(`removed lounge photo from ${home._id}`);
  }

  const left = await client.fetch<string[]>(`*[references($id)]._id`, { id: loungeId });
  if (left.length) throw new Error(`Still referenced by ${left.join(', ')}`);
  await client.delete(loungeId);
  console.log('deleted lounge-care asset');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
