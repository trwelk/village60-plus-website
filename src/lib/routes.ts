// the spec §6 sitemap as data. Pure; safe to import from schema files (relative) and from Node scripts.
export const RESIDENCE_SLUGS = ['tranquility', 'serenity', 'house-on-the-hill', 'enchanted-fields', 'oracle', 'the-grove'] as const;
export type ResidenceSlug = (typeof RESIDENCE_SLUGS)[number];
export const ORACLE_SLUG: ResidenceSlug = 'oracle';

export const CARE_SERVICE_SLUGS = ['independent-living', 'residential-care', 'respite-care', 'recovery', 'rehabilitation'] as const;
export type CareServiceSlug = (typeof CARE_SERVICE_SLUGS)[number];

export const OFFERING_SLUGS = ['silver-roots', 'destination-retirement', 'sage'] as const;
export type OfferingSlug = (typeof OFFERING_SLUGS)[number];

export const LEGAL_SLUGS = ['privacy', 'terms', 'accessibility'] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

/** `page` documents: static pages whose copy is CMS-managed. */
export const PAGE_SLUGS = ['home', 'find-the-right-care', 'homes', 'living-and-care', 'our-story', 'contact', ...LEGAL_SLUGS] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];

/** Where an FAQ may appear (spec §14 "Applicable pages"). */
export const FAQ_PAGE_KEYS = [
  'home',
  'find-the-right-care',
  'homes',
  'oracle',
  'living-and-care',
  'silver-roots',
  'destination-retirement',
  'sage',
  'our-story',
  'contact',
] as const;

/** Oracle's only canonical URL is /oracle (spec §6). */
export function residencePath(slug: string): string {
  return slug === ORACLE_SLUG ? '/oracle' : `/homes/${slug}`;
}
export function careServicePath(slug: string): string {
  return `/living-and-care/${slug}`;
}
export function offeringPath(slug: string): string {
  return `/${slug}`;
}
export function pagePath(slug: string): string {
  return slug === 'home' ? '/' : `/${slug}`;
}

export function residenceStaticParams(): Array<{ slug: string }> {
  return RESIDENCE_SLUGS.filter((slug) => slug !== ORACLE_SLUG).map((slug) => ({ slug }));
}

export const ORACLE_HOMES_REDIRECT = { source: '/homes/oracle', destination: '/oracle', permanent: true } as const;
