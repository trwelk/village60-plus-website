import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY } from '@/sanity/queries';
import { OurStoryView } from './view';

const PATH = '/our-story';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(PAGE_QUERY, { slug: 'our-story' }, [docTag('page', 'our-story'), 'page']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: 'From care home to care ecosystem',
    fallbackDescription: 'Village 60 Plus began with a care home in 2008. One purpose, many branches, and a journey that is still growing.',
    seo: doc?.seo,
  });
}

export default async function OurStoryPage() {
  const { siteUrl } = getPublicEnv();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Our story', href: PATH }])} />
      <OurStoryView />
    </>
  );
}
