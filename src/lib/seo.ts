import type { Metadata, MetadataRoute } from 'next';
import type { SanityImageSource } from '@sanity/image-url';
import type { CmsImage } from '@/components/media/SanityImage';
import { isContentStatus, isOperating } from '@/lib/content-status';
import type { MapAddress } from '@/lib/maps';
import { addressLines } from '@/lib/maps';
import { GROVE_SLUG, careServicePath, offeringPath, pagePath, residencePath } from '@/lib/routes';
import { urlFor } from '@/sanity/image';

export type JsonLd = Record<string, unknown>;

export type SeoInput = {
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  noIndex?: boolean | null;
  image?: CmsImage | null;
} | null;

export function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/$/, '');
  if (path === '/' || path === '') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function httpsOnSite(siteUrl: string, value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const site = new URL(siteUrl);
    return url.protocol === 'https:' && url.host === site.host ? url.toString() : null;
  } catch {
    return null;
  }
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function pageMetadata({
  siteUrl,
  path,
  fallbackTitle,
  fallbackDescription,
  seo,
}: {
  siteUrl: string;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  seo?: SeoInput;
}): Metadata {
  const title = text(seo?.title, fallbackTitle);
  const description = text(seo?.description, fallbackDescription);
  const canonical = httpsOnSite(siteUrl, seo?.canonical) ?? absoluteUrl(siteUrl, path);
  const index = seo?.noIndex !== true;
  const image = ogImage(seo?.image);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index, follow: index },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Village 60 Plus',
      locale: 'en_LK',
      type: 'website',
      images: image ? [image] : undefined,
    },
  };
}

function ogImage(image: CmsImage | null | undefined): { url: string; width: number; height: number; alt: string } | undefined {
  const alt = image?.alt?.trim();
  if (!image?.asset?.url || !alt) return undefined;
  const width = 1200;
  const ratio = image.asset.metadata?.dimensions?.aspectRatio;
  const height = Math.max(1, Math.round(width / (ratio && ratio > 0 ? ratio : 1.6)));
  return { url: urlFor(image as SanityImageSource).width(width).height(height).fit('crop').url(), width, height, alt };
}

export function organizationJsonLd(input: {
  brandName: string;
  legalName?: string | null;
  siteUrl: string;
  phone: string;
  email: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.legalName?.trim() || input.brandName,
    url: input.siteUrl.replace(/\/$/, ''),
    telephone: input.phone,
    email: input.email,
  };
}

export function websiteJsonLd(input: { brandName: string; siteUrl: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.brandName,
    url: input.siteUrl.replace(/\/$/, ''),
  };
}

export function breadcrumbJsonLd(siteUrl: string, items: Array<{ label: string; href?: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(siteUrl, item.href) } : {}),
    })),
  };
}

function operating(status: string | null | undefined): boolean {
  return isContentStatus(status) && isOperating(status);
}

export function localBusinessJsonLd(input: {
  name: string;
  status?: string | null;
  path: string;
  siteUrl: string;
  phone: string;
  description?: string | null;
  address?: MapAddress | null;
}): JsonLd | null {
  const lines = addressLines(input.address);
  if (!operating(input.status) || lines.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: input.name,
    url: absoluteUrl(input.siteUrl, input.path),
    telephone: input.phone,
    ...(input.description ? { description: input.description } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: [input.address?.line1, input.address?.line2].filter(Boolean).join(', '),
      addressLocality: input.address?.city ?? undefined,
      postalCode: input.address?.postcode ?? undefined,
      addressCountry: input.address?.country ?? undefined,
    },
  };
}

export function serviceJsonLd(input: {
  name: string;
  status?: string | null;
  path: string;
  siteUrl: string;
  brandName: string;
  description?: string | null;
}): JsonLd | null {
  if (!operating(input.status)) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    url: absoluteUrl(input.siteUrl, input.path),
    ...(input.description ? { description: input.description } : {}),
    provider: { '@type': 'Organization', name: input.brandName, url: input.siteUrl.replace(/\/$/, '') },
  };
}

export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export type SitemapGroups = {
  pages?: Array<{ slug?: string | null; _updatedAt?: string | null; noIndex?: boolean | null } | null> | null;
  residences?: Array<{ slug?: string | null; _updatedAt?: string | null } | null> | null;
  careServices?: Array<{ slug?: string | null; _updatedAt?: string | null } | null> | null;
  offerings?: Array<{ slug?: string | null; _updatedAt?: string | null } | null> | null;
};

export function sitemapEntries(siteUrl: string, data: SitemapGroups): Array<{ url: string; lastModified?: string }> {
  const entries: Array<{ url: string; lastModified?: string }> = [];
  const push = (path: string | null, updated?: string | null) => {
    if (!path) return;
    entries.push({ url: absoluteUrl(siteUrl, path), ...(updated ? { lastModified: updated } : {}) });
  };
  for (const page of data.pages ?? []) {
    if (!page?.slug || page.noIndex) continue;
    push(pagePath(page.slug), page._updatedAt);
  }
  for (const residence of data.residences ?? []) {
    if (!residence?.slug || residence.slug === GROVE_SLUG) continue;
    push(residencePath(residence.slug), residence._updatedAt);
  }
  for (const service of data.careServices ?? []) push(service?.slug ? careServicePath(service.slug) : null, service?._updatedAt);
  for (const offering of data.offerings ?? []) push(offering?.slug ? offeringPath(offering.slug) : null, offering?._updatedAt);
  push('/feedback');
  push('/look-to-the-future');
  push('/look-to-the-future/heritage');
  push('/look-to-the-future/grove');
  return entries;
}

export function robotsConfig(siteUrl: string): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
