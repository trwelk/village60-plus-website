import type { PortableTextBlock } from '@portabletext/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { isLegalSlug, LEGAL_SLUGS } from '@/lib/routes';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY } from '@/sanity/queries';
import { LegalView } from './view';

export function generateStaticParams() {
  return LEGAL_SLUGS.map((legalSlug) => ({ legalSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ legalSlug: string }> }): Promise<Metadata> {
  const { legalSlug } = await params;
  if (!isLegalSlug(legalSlug)) return {};
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(PAGE_QUERY, { slug: legalSlug }, [docTag('page', legalSlug), 'page']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: `/${legalSlug}`,
    fallbackTitle: doc?.title || 'Village 60 Plus',
    fallbackDescription: doc?.title || 'Village 60 Plus',
    seo: doc?.seo,
  });
}

export default async function LegalPage({ params }: { params: Promise<{ legalSlug: string }> }) {
  const { legalSlug } = await params;
  if (!isLegalSlug(legalSlug)) notFound();
  const { siteUrl, sanityProjectId } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof PAGE_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      doc = await fetchPublished(PAGE_QUERY, { slug: legalSlug }, [docTag('page', legalSlug), 'page']);
    } catch {
      doc = null;
    }
  }
  const title = doc?.title || legalSlug;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: title, href: `/${legalSlug}` }])} />
      <LegalView title={title} body={doc?.body as PortableTextBlock[] | null | undefined} lastReviewed={doc?.lastReviewed} />
    </>
  );
}
