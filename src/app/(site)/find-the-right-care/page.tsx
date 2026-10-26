import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { sitePhoto } from '@/lib/site-photos';
import { PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { FindCareView, pathwayDefaults } from './view';

const PATH = '/find-the-right-care';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(PAGE_QUERY, { slug: 'find-the-right-care' }, [docTag('page', 'find-the-right-care'), 'page']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: 'Find the right care',
    fallbackDescription: 'Tell us a little about what you are looking for. This is not a medical assessment.',
    seo: doc?.seo,
  });
}

export default async function FindCarePage({ searchParams }: { searchParams: Promise<{ for?: string }> }) {
  const { for: pathway } = await searchParams;
  const { siteUrl, sanityProjectId } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof PAGE_QUERY>>> | null = null;
  let settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      [doc, settings] = await Promise.all([
        fetchPublished(PAGE_QUERY, { slug: 'find-the-right-care' }, [docTag('page', 'find-the-right-care'), 'page']),
        fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
      ]);
    } catch {
      doc = null;
      settings = null;
    }
  }
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(siteUrl, [
          { label: 'Home', href: '/' },
          { label: 'Find the Right Care', href: PATH },
        ])}
      />
      <FindCareView
        title={doc?.title || 'Find the right care'}
        intro={doc?.intro}
        image={sitePhoto('/people/lounge.jpg', 'A nurse sitting with a resident in the lounge')}
        contact={contactFromSettings(settings)}
        defaults={pathwayDefaults(pathway)}
      />
    </>
  );
}
