import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { CARE_SERVICE_SLUGS, careServicePath, careStaticParams } from '@/lib/routes';
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { CARE_SERVICE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { CareDetailView, type CareDetail } from './view';

export function generateStaticParams() {
  return careStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(CARE_SERVICE_QUERY, { slug }, [docTag('careService', slug), 'careService']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: careServicePath(slug),
    fallbackTitle: doc?.name || 'Living and care',
    fallbackDescription: doc?.summary || 'A Village 60 Plus care service.',
    seo: doc?.seo,
  });
}

export default async function CareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(CARE_SERVICE_SLUGS as readonly string[]).includes(slug)) notFound();

  const { siteUrl, sanityProjectId } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof CARE_SERVICE_QUERY>>> | null = null;
  let settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      [doc, settings] = await Promise.all([
        fetchPublished(CARE_SERVICE_QUERY, { slug }, [docTag('careService', slug), 'careService']),
        fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
      ]);
    } catch {
      doc = null;
      settings = null;
    }
  }
  const contact = contactFromSettings(settings);
  const service: CareDetail | null = doc?.name && doc.slug ? {
    name: doc.name,
    slug: doc.slug,
    status: doc.status,
    summary: doc.summary,
    heroImage: doc.heroImage,
    whoItSuits: doc.whoItSuits,
    typicalDuration: doc.typicalDuration,
    included: doc.included,
    process: doc.process,
    notRightFit: doc.notRightFit,
    faqs: doc.faqs as CareDetail['faqs'],
    formKind: doc.formKind,
    residences: doc.residences,
  } : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(siteUrl, [
            { label: 'Home', href: '/' },
            { label: 'Living & Care', href: '/living-and-care' },
            { label: service?.name || 'Service', href: careServicePath(slug) },
          ]),
          service
            ? serviceJsonLd({
                name: service.name,
                status: service.status,
                path: careServicePath(slug),
                siteUrl,
                brandName: settings?.brandName || 'Village 60 Plus',
                description: service.summary,
              })
            : null,
        ]}
      />
      <CareDetailView service={service} contact={contact} />
    </>
  );
}
