import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY, RESIDENCES_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { toResidenceCards } from '../home-view';
import { HomesView } from './view';

const PATH = '/homes';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(PAGE_QUERY, { slug: 'homes' }, [docTag('page', 'homes'), 'page']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: 'Our homes',
    fallbackDescription: 'Compare Village 60 Plus residences by location, care and status.',
    seo: doc?.seo,
  });
}

export default async function HomesPage() {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof PAGE_QUERY>>> | null = null;
  let residences: Awaited<ReturnType<typeof fetchPublished<typeof RESIDENCES_QUERY>>> | null = null;
  let settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      [doc, residences, settings] = await Promise.all([
        fetchPublished(PAGE_QUERY, { slug: 'homes' }, [docTag('page', 'homes'), 'page']),
        fetchPublished(RESIDENCES_QUERY, {}, ['residence']),
        fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
      ]);
    } catch {
      doc = null;
      residences = null;
      settings = null;
    }
  }
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Our homes', href: PATH }])} />
      <HomesView title={doc?.title || 'Our homes'} intro={doc?.intro} residences={toResidenceCards(residences)} contact={contactFromSettings(settings)} />
    </>
  );
}
