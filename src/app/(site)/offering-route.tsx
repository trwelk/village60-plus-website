import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { offeringPath, type OfferingSlug } from '@/lib/routes';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { OFFERING_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { EcosystemView, toOffering } from './ecosystem-view';

const COPY: Record<OfferingSlug, { title: string; description: string }> = {
  'silver-roots': {
    title: 'Silver Roots',
    description: 'Support beyond the residences. Capabilities are labelled by what exists today.',
  },
  'destination-retirement': {
    title: 'Destination Retirement',
    description: 'A stay concept for Sri Lanka. Nothing on this page is a confirmed package.',
  },
  sage: {
    title: 'SAGE',
    description: 'Technology that supports the Village 60 Plus team. Capabilities are labelled by status.',
  },
};

export async function offeringMetadata(slug: OfferingSlug): Promise<Metadata> {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(OFFERING_QUERY, { slug }, [docTag('ecosystemOffering', slug), 'ecosystemOffering']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: offeringPath(slug),
    fallbackTitle: COPY[slug].title,
    fallbackDescription: doc?.summary || COPY[slug].description,
    seo: doc?.seo,
  });
}

export async function OfferingRoute({ slug }: { slug: OfferingSlug }) {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof OFFERING_QUERY>>> | null = null;
  let settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      [doc, settings] = await Promise.all([
        fetchPublished(OFFERING_QUERY, { slug }, [docTag('ecosystemOffering', slug), 'ecosystemOffering']),
        fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
      ]);
    } catch {
      doc = null;
      settings = null;
    }
  }
  const offering = toOffering(doc);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(siteUrl, [
          { label: 'Home', href: '/' },
          { label: offering?.name || COPY[slug].title, href: offeringPath(slug) },
        ])}
      />
      <EcosystemView slug={slug} offering={offering} contact={contactFromSettings(settings)} />
    </>
  );
}
