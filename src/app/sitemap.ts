import type { MetadataRoute } from 'next';
import { getPublicEnv } from '@/lib/env';
import { sitemapEntries } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { SITEMAP_QUERY } from '@/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchPublished(SITEMAP_QUERY, {}, ['sitemap']);
  return sitemapEntries(
    getPublicEnv().siteUrl,
    data ?? { pages: [], residences: [], careServices: [], offerings: [] },
  );
}
