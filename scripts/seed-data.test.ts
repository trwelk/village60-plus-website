import { describe, expect, it } from 'vitest';
import { CONTENT_STATUSES } from '@/lib/content-status';
import { CARE_SERVICE_SLUGS, OFFERING_SLUGS, PAGE_SLUGS, RESIDENCE_SLUGS } from '@/lib/routes';
import { seedDocuments } from './seed-data';
import { CLIENT_PHOTOS } from './client-photos';
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

  it('pins the four published care homes and leaves Oracle and The Grove unpinned', () => {
    const pinned = ['tranquility', 'serenity', 'house-on-the-hill', 'enchanted-fields'];
    for (const slug of pinned) {
      const home = ofType('residence').find((d) => (d.slug as { current: string }).current === slug);
      const location = (home?.address as { location?: { lat?: number; lng?: number } } | undefined)?.location;
      expect(location?.lat, slug).toEqual(expect.any(Number));
      expect(location?.lng, slug).toEqual(expect.any(Number));
    }
    for (const slug of ['oracle', 'the-grove']) {
      const home = ofType('residence').find((d) => (d.slug as { current: string }).current === slug);
      expect((home?.address as { location?: unknown } | undefined)?.location, slug).toBeUndefined();
    }
  });

  it('includes retirement villas copy on Enchanted Fields', () => {
    const home = ofType('residence').find((d) => (d.slug as { current: string }).current === 'enchanted-fields');
    const text = JSON.stringify(home);
    expect(text).toContain('Retirement chalet');
    expect(text).toContain('Ayurvedic spa treatments');
    expect(text).toContain('Community lounge');
    expect(text).toContain('retirement chalet village in Kottawa');
    expect(text).toContain('New friendships and connections');
  });

  it('leads every open home gallery with the client photographs and keeps the stand-ins', () => {
    for (const home of ofType('residence')) {
      const slug = (home.slug as { current: string }).current;
      const gallery = home.gallery as Array<{ seedPhoto?: string; placeholder?: boolean }> | undefined;
      if (slug === 'the-grove') {
        expect(gallery, slug).toBeUndefined();
        continue;
      }
      expect(gallery, slug).toBeDefined();
      const real = gallery!.filter((image) => image.placeholder === false);
      expect(real, slug).toHaveLength(Object.keys(CLIENT_PHOTOS).length);
      expect(gallery!.length, slug).toBeGreaterThanOrEqual(11);
      expect(gallery!.slice(0, real.length).every((image) => image.placeholder === false), slug).toBe(true);
    }
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

  it('records rights on every image, and keeps stand-ins marked for replacement', () => {
    let images = 0;
    const used = new Set<string>();
    walk(docs, (node) => {
      if (node._type === 'mediaImage') {
        images += 1;
        const seedPhoto = String(node.seedPhoto);
        used.add(seedPhoto);
        const stock = STOCK_PHOTOS[seedPhoto as keyof typeof STOCK_PHOTOS];
        const client = CLIENT_PHOTOS[seedPhoto as keyof typeof CLIENT_PHOTOS];
        expect(stock ?? client, seedPhoto).toBeTruthy();
        expect(node.alt).toBe((stock ?? client)!.alt);
        if (client) {
          expect(node.placeholder, seedPhoto).toBe(false);
          expect(node.replaceBy, seedPhoto).toBeUndefined();
          expect(node.license, seedPhoto).toBe('client-owned');
          expect(node.source, seedPhoto).toContain('Village 60 Plus');
          expect(node.consent, seedPhoto).toBe(client.people ? 'obtained' : 'not-required');
          if (client.people) expect(node.consentRecord, seedPhoto).toBeTruthy();
          return;
        }
        expect(node.placeholder, seedPhoto).toBe(true);
        expect(node.replaceBy, seedPhoto).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(node.source, seedPhoto).toContain('Unsplash');
        expect(node.license, seedPhoto).toBe('other');
        expect(node.consent, seedPhoto).toBe(stock!.people ? 'obtained' : 'not-required');
        if (stock!.people) expect(node.consentRecord, seedPhoto).toBeTruthy();
      }
    });
    expect(images).toBeGreaterThan(0);
    expect(used.size).toBe(Object.keys(STOCK_PHOTOS).length + Object.keys(CLIENT_PHOTOS).length);
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
