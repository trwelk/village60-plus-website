import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1).trim()];
    }),
);

const query = `*[_type=="residence" && slug.current=="oracle"][0]{
  name, summary, shortLocation, status,
  "heroAlt": heroImage.alt,
  "hero": heroImage.asset->url,
  "gallery": gallery[]{alt, "url": asset->url},
  "rooms": rooms[]{name, "alt": image.alt, "url": image.asset->url}
}`;

const url = `https://${env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2026-02-01/data/query/${env.NEXT_PUBLIC_SANITY_DATASET}?query=${encodeURIComponent(query)}`;
const response = await fetch(url, { headers: { Authorization: `Bearer ${env.SANITY_API_READ_TOKEN}` } });
const json = await response.json();
const data = json.result;
console.log(JSON.stringify({
  name: data?.name,
  summary: data?.summary,
  shortLocation: data?.shortLocation,
  status: data?.status,
  heroAlt: data?.heroAlt,
  hero: data?.hero,
  gallery: data?.gallery ?? [],
  rooms: data?.rooms ?? [],
}, null, 2));
