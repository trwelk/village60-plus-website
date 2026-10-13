import { describe, expect, it } from 'vitest';
import { CONTENT_STATUSES } from '@/lib/content-status';
import { CARE_SERVICE_SLUGS, OFFERING_SLUGS, PAGE_SLUGS, RESIDENCE_SLUGS } from '@/lib/routes';
import { seedDocuments } from './seed-data';
import { STOCK_PHOTOS } from './stock-photos';

type Doc = { _id: string; _type: string; [key: string]: unknown };
const docs = seedDocuments as Doc[];
const ofType = (type: string) => docs.filter((d) => d._type === type);
const slugsOf = (type: string) => ofType(type).map((d) => (d.slug as { current: string }).current).sort();

function walk(value: unknown, visit: (node: Record<string, unknown>) => void) {
  if (Array.isArray(value)) value.forEach((v) => walk(v, visit));
  else if (value && typeof value === 'object') {
    visit(value as Record<string, unknown>);
    Object.values(value).forEach((v) => walk(v, visit));
  }
}

describe('seed data', () => {
  it('uses deterministic, unique ids', () => {
    const ids = docs.map((d) => d._id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-zA-Z0-9.-]+$/.test(id))).toBe(true);
  });

  it('covers every sitemap residence once, with Oracle as flagship and The Grove coming soon', () => {
    expect(slugsOf('residence')).toEqual([...RESIDENCE_SLUGS].sort());
    const oracle = ofType('residence').find((d) => (d.slug as { current: string }).current === 'oracle');
    const grove = ofType('residence').find((d) => (d.slug as { current: string }).current === 'the-grove');
    expect(oracle?.isFlagship).toBe(true);
    expect(grove?.status).toBe('coming-soon');
    expect(grove?.comingSoonNote).toBeTruthy();
    expect(grove?.formKind).toBe('grove-interest');
    expect(oracle?.formKind).toBe('oracle-visit');
  });

  it('covers the five care services, three offerings and every page', () => {
    expect(slugsOf('careService')).toEqual([...CARE_SERVICE_SLUGS].sort());
    expect(slugsOf('ecosystemOffering')).toEqual([...OFFERING_SLUGS].sort());
    expect(slugsOf('page')).toEqual([...PAGE_SLUGS].sort());
    expect(ofType('siteSettings').map((d) => d._id)).toEqual(['siteSettings']);
  });

  it('only uses the six spec statuses', () => {
    const valid = new Set<unknown>(CONTENT_STATUSES.map((s) => s.value));
    walk(docs, (node) => {
      if ('status' in node && node.status !== undefined) expect(valid.has(node.status), JSON.stringify(node)).toBe(true);
    });
  });

  it('marks every image as a placeholder with rights metadata and a replacement deadline', () => {
    let images = 0;
    const used = new Set<string>();
    walk(docs, (node) => {
      if (node._type === 'mediaImage') {
        images += 1;
        const photo = STOCK_PHOTOS[node.seedPhoto as keyof typeof STOCK_PHOTOS];
        expect(photo, String(node.seedPhoto)).toBeTruthy();
        used.add(String(node.seedPhoto));
        expect(node.placeholder).toBe(true);
        expect(node.replaceBy).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(node.alt).toBe(photo.alt);
        expect(node.source).toContain('Unsplash');
        expect(node.license).toBe('other');
        expect(node.consent).toBe(photo.people ? 'obtained' : 'not-required');
        if (photo.people) expect(node.consentRecord).toBeTruthy();
      }
    });
    expect(images).toBeGreaterThan(0);
    expect(used.size).toBe(Object.keys(STOCK_PHOTOS).length);
  });

  it('flags every public document for compliance review before publication', () => {
    for (const doc of docs.filter((d) => ['residence', 'careService', 'ecosystemOffering', 'page'].includes(d._type))) {
      expect(doc.editorial, doc._id).toMatchObject({ reviewStatus: 'draft', requiresComplianceReview: true });
    }
  });

  it('contains no prohibited claims or pricing', () => {
    const text = JSON.stringify(docs);
    expect(text).not.toMatch(/\b(best|number one|no\.\s?1|the only|international standard|guaranteed?|award-winning|leading provider)\b/i);
    expect(text).not.toMatch(/(\bRs\.?|\bLKR|\bUSD|\$)\s?\d/);
    expect(text).not.toMatch(/\b(cure|treat(ment)?s? for|diagnos)/i);
  });

  it('references only documents that exist in the seed', () => {
    const ids = new Set(docs.map((d) => d._id));
    walk(docs, (node) => {
      if (node._type === 'reference') expect(ids.has(node._ref as string), String(node._ref)).toBe(true);
    });
  });
});
