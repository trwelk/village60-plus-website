import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-02-01',
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
});

const query = `*[_type == "page" && slug.current == $slug][0]{_id, title, intro}`;
for (const slug of ['our-story', 'home', 'contact']) {
  const row = await client.fetch(query, { slug });
  console.log(slug, row?.title ?? null);
}
