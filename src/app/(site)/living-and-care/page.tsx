import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY } from '@/sanity/queries';
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
    fallbackDescription: 'Different people. Different needs. Support that changes with you, from independent living and residential care to short stays, recovery and rehabilitation.',
    seo: doc?.seo,
  });
}

export default async function LivingCarePage() {
  const { siteUrl } = getPublicEnv();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Living & Care', href: PATH }])} />
      <LivingCareView />
    </>
  );
}
