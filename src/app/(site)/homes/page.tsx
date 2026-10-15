import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY, RESIDENCES_QUERY } from '@/sanity/queries';
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
    fallbackTitle: 'A place for every chapter',
    fallbackDescription:
      'Different homes and settings, with the same purpose: to help you live well, in comfort, with the right support around you.',
    seo: doc?.seo,
  });
}

export default async function HomesPage() {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  let residences: Awaited<ReturnType<typeof fetchPublished<typeof RESIDENCES_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      residences = await fetchPublished(RESIDENCES_QUERY, {}, ['residence']);
    } catch {
      residences = null;
    }
  }
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Our homes', href: PATH }])} />
      <HomesView residences={toResidenceCards(residences)} />
    </>
  );
}
