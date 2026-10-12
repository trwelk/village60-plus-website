import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import type { ContentSectionData } from '@/components/content/SectionList';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { CARE_SERVICES_QUERY, PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { toCareCards } from '../home-view';
import { LivingCareView } from './view';

const PATH = '/living-and-care';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(PAGE_QUERY, { slug: 'living-and-care' }, [docTag('page', 'living-and-care'), 'page']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: 'Living and care',
    fallbackDescription: 'Independent living, residential care, respite, recovery and rehabilitation.',
    seo: doc?.seo,
  });
}

export default async function LivingCarePage() {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof PAGE_QUERY>>> | null = null;
  let services: Awaited<ReturnType<typeof fetchPublished<typeof CARE_SERVICES_QUERY>>> | null = null;
  let settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      [doc, services, settings] = await Promise.all([
        fetchPublished(PAGE_QUERY, { slug: 'living-and-care' }, [docTag('page', 'living-and-care'), 'page']),
        fetchPublished(CARE_SERVICES_QUERY, {}, ['careService']),
        fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
      ]);
    } catch {
      doc = null;
      services = null;
      settings = null;
    }
  }
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Living & Care', href: PATH }])} />
      <LivingCareView
        title={doc?.title || 'Living and care'}
        intro={doc?.intro}
        services={toCareCards(services)}
        sections={(doc?.sections ?? []) as ContentSectionData[]}
        contact={contactFromSettings(settings)}
      />
    </>
  );
}
