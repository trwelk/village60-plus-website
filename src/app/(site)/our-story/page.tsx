import type { PortableTextBlock } from '@portabletext/react';
import type { Metadata } from 'next';
import type { ContentSectionData } from '@/components/content/SectionList';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY, SITE_SETTINGS_QUERY, TEAM_QUERY } from '@/sanity/queries';
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
    fallbackTitle: 'Our story',
    fallbackDescription: doc?.intro || 'The story of Village 60 Plus.',
    seo: doc?.seo,
  });
}

export default async function OurStoryPage() {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof PAGE_QUERY>>> | null = null;
  let settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null = null;
  let team: Awaited<ReturnType<typeof fetchPublished<typeof TEAM_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      [doc, settings, team] = await Promise.all([
        fetchPublished(PAGE_QUERY, { slug: 'our-story' }, [docTag('page', 'our-story'), 'page']),
        fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
        fetchPublished(TEAM_QUERY, {}, ['teamMember']),
      ]);
    } catch {
      doc = null;
      settings = null;
      team = null;
    }
  }
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Our story', href: PATH }])} />
      <OurStoryView
        title={doc?.title || 'Our story'}
        intro={doc?.intro}
        body={doc?.body as PortableTextBlock[] | null | undefined}
        sections={(doc?.sections ?? []) as ContentSectionData[]}
        foundedYear={settings?.foundedYear ?? null}
        heroImage={doc?.heroImage}
        team={(team ?? []).flatMap((person) =>
          person?._id
            ? [{ _id: person._id, name: person.name, role: person.role, credentials: person.credentials, bio: person.bio as PortableTextBlock[] | null, image: person.image }]
            : [],
        )}
      />
    </>
  );
}
