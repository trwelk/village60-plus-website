import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  localBusinessJsonLd,
  organizationJsonLd,
  pageMetadata,
  robotsConfig,
  serviceJsonLd,
  sitemapEntries,
  websiteJsonLd,
} from './seo';

const SITE = 'https://www.village60plus.lk';

function types(value: unknown): string[] {
  const found: string[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) {
        if (key === '@type' && typeof child === 'string') found.push(child);
        walk(child);
      }
    }
  };
  walk(value);
  return found;
}

describe('absoluteUrl', () => {
  it('joins the site origin and a path once', () => {
    expect(absoluteUrl(SITE, '/')).toBe('https://www.village60plus.lk/');
    expect(absoluteUrl(`${SITE}/`, '/homes/serenity')).toBe('https://www.village60plus.lk/homes/serenity');
  });
});

describe('pageMetadata', () => {
  it('uses the CMS title absolutely, canonicalises the path, and indexes by default', () => {
    const meta = pageMetadata({
      siteUrl: SITE,
      path: '/homes/serenity',
      fallbackTitle: 'Serenity',
      fallbackDescription: 'A home in Colombo.',
      seo: { title: 'Serenity | Village 60 Plus', description: 'Visit Serenity.', canonical: null, noIndex: false },
    });
    expect(meta.title).toEqual({ absolute: 'Serenity | Village 60 Plus' });
    expect(meta.description).toBe('Visit Serenity.');
    expect(meta.alternates).toEqual({ canonical: 'https://www.village60plus.lk/homes/serenity' });
    expect(meta.robots).toEqual({ index: true, follow: true });
  });

  it('falls back when SEO fields are empty and honours noIndex', () => {
    const meta = pageMetadata({
      siteUrl: SITE,
      path: '/sage',
      fallbackTitle: 'SAGE',
      fallbackDescription: 'Tools for the care team.',
      seo: { title: null, description: '  ', canonical: 'javascript:alert(1)', noIndex: true },
    });
    expect(meta.title).toEqual({ absolute: 'SAGE' });
    expect(meta.description).toBe('Tools for the care team.');
    expect(meta.alternates).toEqual({ canonical: 'https://www.village60plus.lk/sage' });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it('adds an Open Graph image from the CMS image', () => {
    const meta = pageMetadata({
      siteUrl: SITE,
      path: '/',
      fallbackTitle: 'Village 60 Plus',
      fallbackDescription: 'Homes and care.',
      seo: { title: null, description: null, canonical: null, noIndex: false, image: imageFixture('The verandah') },
    });
    const images = meta.openGraph?.images;
    const image = Array.isArray(images) ? images[0] : undefined;
    expect(image).toMatchObject({ alt: 'The verandah', width: 1200, height: 750 });
    expect(typeof image === 'object' && image && 'url' in image && String(image.url)).toContain('auto=format');
  });
});

describe('structured data', () => {
  it('describes the organisation and the website without a search action', () => {
    expect(organizationJsonLd({ brandName: 'Village 60 Plus', legalName: 'Village 60 Plus (Pvt) Ltd', siteUrl: SITE, phone: '+94112504838', email: 'hello@example.com' })).toMatchObject({
      '@type': 'Organization',
      name: 'Village 60 Plus (Pvt) Ltd',
      url: SITE,
      telephone: '+94112504838',
    });
    const website = websiteJsonLd({ brandName: 'Village 60 Plus', siteUrl: SITE });
    expect(website['@type']).toBe('WebSite');
    expect(website).not.toHaveProperty('potentialAction');
  });

  it('emits LocalBusiness and Service only for operating statuses, and never prices, ratings or medical types', () => {
    const address = { line1: '133/19 Nawala Road', city: 'Colombo 05', country: 'Sri Lanka' };
    const live = localBusinessJsonLd({ name: 'Serenity', status: 'available', path: '/homes/serenity', siteUrl: SITE, phone: '+94112504838', address });
    expect(live).toMatchObject({ '@type': 'LocalBusiness', name: 'Serenity' });
    expect(localBusinessJsonLd({ name: 'The Grove', status: 'coming-soon', path: '/homes/the-grove', siteUrl: SITE, phone: '+94112504838', address })).toBeNull();
    expect(serviceJsonLd({ name: 'Respite care', status: 'available', path: '/living-and-care/respite-care', siteUrl: SITE, brandName: 'Village 60 Plus', description: 'A short stay.' })).toMatchObject({
      '@type': 'Service',
    });
    expect(serviceJsonLd({ name: 'Rehabilitation', status: 'planned', path: '/living-and-care/rehabilitation', siteUrl: SITE, brandName: 'Village 60 Plus' })).toBeNull();

    const forbidden = ['priceRange', 'aggregateRating', 'review', 'offers', 'MedicalBusiness', 'MedicalOrganization', 'NursingHome'];
    const blob = JSON.stringify([live, organizationJsonLd({ brandName: 'Village 60 Plus', legalName: null, siteUrl: SITE, phone: '+94112504838', email: 'hello@example.com' })]);
    for (const word of forbidden) expect(blob).not.toContain(word);
    expect(types(live)).toEqual(['LocalBusiness', 'PostalAddress']);
  });

  it('builds a breadcrumb list with absolute item URLs', () => {
    expect(
      breadcrumbJsonLd(SITE, [
        { label: 'Home', href: '/' },
        { label: 'Serenity', href: '/homes/serenity' },
      ]),
    ).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { position: 1, name: 'Home', item: 'https://www.village60plus.lk/' },
        { position: 2, name: 'Serenity', item: 'https://www.village60plus.lk/homes/serenity' },
      ],
    });
  });
});

describe('sitemap and robots', () => {
  it('lists indexable URLs once, with Oracle at /oracle, and skips noIndex pages', () => {
    const urls = sitemapEntries(SITE, {
      pages: [
        { slug: 'home', _updatedAt: '2026-10-01' },
        { slug: 'privacy', _updatedAt: '2026-10-02', noIndex: true },
      ],
      residences: [
        { slug: 'oracle', _updatedAt: '2026-10-03' },
        { slug: 'the-grove', _updatedAt: '2026-10-04' },
      ],
      careServices: [{ slug: 'respite-care', _updatedAt: '2026-10-05' }],
      offerings: [{ slug: 'sage', _updatedAt: '2026-10-06' }],
    }).map((entry) => entry.url);

    expect(urls).toEqual([
      'https://www.village60plus.lk/',
      'https://www.village60plus.lk/oracle',
      'https://www.village60plus.lk/homes/the-grove',
      'https://www.village60plus.lk/living-and-care/respite-care',
      'https://www.village60plus.lk/sage',
      'https://www.village60plus.lk/feedback',
    ]);
    expect(urls.some((url) => url.includes('/homes/oracle'))).toBe(false);
  });

  it('allows the site, blocks the studio and API, and points at the sitemap', () => {
    expect(robotsConfig(SITE)).toEqual({
      rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
      sitemap: 'https://www.village60plus.lk/sitemap.xml',
    });
  });
});
