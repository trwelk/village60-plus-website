import type { MetadataRoute } from 'next';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { sitemapEntries, type SitemapGroups } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { SITEMAP_QUERY } from '@/sanity/queries';

const emptySitemapData: SitemapGroups = {};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  if (!isSanityProjectConfigured(sanityProjectId)) {
    return sitemapEntries(siteUrl, emptySitemapData);
  }
  try {
    const data = await fetchPublished(SITEMAP_QUERY, {}, ['sitemap']);
    return sitemapEntries(siteUrl, data);
  } catch {
    return sitemapEntries(siteUrl, emptySitemapData);
  }
}
