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

export function careStaticParams(): Array<{ slug: string }> {
  return CARE_SERVICE_SLUGS.map((slug) => ({ slug }));
}

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

export const ORACLE_HOMES_REDIRECT = { source: '/homes/oracle', destination: '/oracle', permanent: true } as const;

const RESIDENCE_CONTEXT: Record<string, string> = {
  tranquility: 'Tranquility',
  serenity: 'Serenity',
  'house-on-the-hill': 'House on the Hill',
  'enchanted-fields': 'Enchanted Fields',
  oracle: 'Oracle',
  'the-grove': 'The Grove',
};

const CARE_CONTEXT: Record<string, string> = {
  'independent-living': 'Independent living',
  'residential-care': 'Residential care',
  'respite-care': 'Respite care',
  recovery: 'Recovery',
  rehabilitation: 'Rehabilitation',
};

const PAGE_CONTEXT: Record<string, string> = {
  '/': 'Village 60 Plus',
  '/find-the-right-care': 'Find the Right Care',
  '/homes': 'Our homes',
  '/oracle': 'Oracle',
  '/living-and-care': 'Living & Care',
  '/silver-roots': 'Silver Roots',
  '/destination-retirement': 'Destination Retirement',
  '/sage': 'SAGE',
  '/our-story': 'Our story',
  '/contact': 'Contact',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
  '/accessibility': 'Accessibility',
};

export function contextForPath(pathname: string): string {
  const path = (pathname.split('?')[0] || '/').replace(/\/+$/, '') || '/';
  if (PAGE_CONTEXT[path]) return PAGE_CONTEXT[path];
  const residence = path.match(/^\/homes\/([^/]+)$/);
  if (residence) return RESIDENCE_CONTEXT[residence[1]] ?? 'Village 60 Plus';
  const care = path.match(/^\/living-and-care\/([^/]+)$/);
  if (care) return CARE_CONTEXT[care[1]] ?? 'Village 60 Plus';
  return 'Village 60 Plus';
}
