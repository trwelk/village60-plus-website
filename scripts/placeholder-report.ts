/**
 * Pre-launch report of mediaImage objects with placeholder == true (spec §12).
 * Writes reports/placeholders.md. Does not publish or edit content.
 * Usage: npm run report:placeholders
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@sanity/client';
import { requireEnv } from '@/lib/env';

export const PLACEHOLDER_QUERY = /* groq */ `
  *[_type in ["page", "residence", "careService", "ecosystemOffering", "teamMember", "siteSettings"]]
`;

export type PlaceholderHit = {
  documentTitle: string;
  documentType: string;
  alt: string;
  source: string;
  license: string;
  replaceBy: string;
};

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function walk(value: unknown, visit: (node: Record<string, unknown>) => void) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (!value || typeof value !== 'object') return;
  const node = value as Record<string, unknown>;
  visit(node);
  for (const child of Object.values(node)) walk(child, visit);
}

export function collectPlaceholders(documents: ReadonlyArray<Record<string, unknown>>): PlaceholderHit[] {
  const hits: PlaceholderHit[] = [];
  for (const doc of documents) {
    const documentTitle = text(doc.name) || text(doc.title) || text(doc.legalName) || text(doc._id) || 'Untitled';
    const documentType = text(doc._type) || 'document';
    walk(doc, (node) => {
      if (node._type !== 'mediaImage' || node.placeholder !== true) return;
      hits.push({
        documentTitle,
        documentType,
        alt: text(node.alt),
        source: text(node.source),
        license: text(node.license),
        replaceBy: text(node.replaceBy),
      });
    });
  }
  return hits;
}

function cell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export function renderPlaceholderReport(hits: PlaceholderHit[], generatedOn: string): string {
  const lines = [
    '# Placeholder images',
    '',
    `Generated ${generatedOn}. Each row is a mediaImage with placeholder set. Replace it before launch. This file does not confirm consent or ownership.`,
    '',
  ];
  if (hits.length === 0) {
    lines.push('No placeholder images.', '');
    return lines.join('\n');
  }
  lines.push('| Document | Type | Alt | Source | License | Replace by |', '| --- | --- | --- | --- | --- | --- |');
  for (const hit of hits) {
    lines.push(`| ${cell(hit.documentTitle)} | ${cell(hit.documentType)} | ${cell(hit.alt)} | ${cell(hit.source)} | ${cell(hit.license)} | ${cell(hit.replaceBy)} |`);
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const client = createClient({
    projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: requireEnv('NEXT_PUBLIC_SANITY_DATASET'),
    token: requireEnv('SANITY_API_READ_TOKEN'),
    apiVersion: '2026-02-01',
    useCdn: false,
  });
  const documents = await client.fetch<Array<Record<string, unknown>>>(PLACEHOLDER_QUERY, {}, { perspective: 'published' });
  const hits = collectPlaceholders(documents ?? []);
  const generatedOn = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' });
  mkdirSync('reports', { recursive: true });
  writeFileSync('reports/placeholders.md', renderPlaceholderReport(hits, generatedOn), 'utf8');
  console.log(`Wrote reports/placeholders.md (${hits.length} placeholder image${hits.length === 1 ? '' : 's'}).`);
}

const isDirectRun = process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/placeholder-report.ts');
if (isDirectRun) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Placeholder report failed');
    process.exit(1);
  });
}
