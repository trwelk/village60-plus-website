import fs from 'node:fs';
import path from 'node:path';

const dir = '.next/cache/fetch-cache';
const rows = [];
for (const file of fs.readdirSync(dir)) {
  const full = path.join(dir, file);
  const stat = fs.statSync(full);
  const raw = fs.readFileSync(full, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    continue;
  }
  const url = decodeURIComponent(String(parsed.data?.url || ''));
  if (rows.length < 2) console.log('SAMPLE', url.slice(0, 180));
  if (!url.includes('page')) continue;
  const body = Buffer.from(parsed.data?.body || '', 'base64').toString('utf8');
  const result = JSON.parse(body).result;
  rows.push({
    mtime: stat.mtime.toISOString(),
    dataset: url.includes('/production') ? 'production' : 'development',
    slug: result?.slug ?? 'none',
    title: result?.title ?? null,
  });
}
rows.sort((a, b) => a.mtime.localeCompare(b.mtime));
for (const row of rows) console.log(row.mtime, row.dataset, row.slug, row.title);
