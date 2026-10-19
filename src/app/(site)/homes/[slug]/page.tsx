import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, localBusinessJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { GROVE_PATH, GROVE_SLUG, ORACLE_SLUG, RESIDENCE_SLUGS, residencePath, residenceStaticParams } from '@/lib/routes';
import { fetchPublished } from '@/sanity/fetch';
import { RESIDENCE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { withResidencePhotos } from '@/lib/site-photos';
import { ResidenceView, type ResidenceContent } from './view';

export function generateStaticParams() {
  return residenceStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(RESIDENCE_QUERY, { slug }, [docTag('residence', slug), 'residence']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: residencePath(slug),
    fallbackTitle: doc?.name || 'Residence',
    fallbackDescription: doc?.summary || 'A Village 60 Plus residence.',
    seo: doc?.seo,
  });
}

export default async function ResidencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === ORACLE_SLUG) redirect('/oracle');
  if (slug === GROVE_SLUG) redirect(GROVE_PATH);
  if (!(RESIDENCE_SLUGS as readonly string[]).includes(slug)) notFound();

  const { siteUrl, sanityProjectId, mapsKey } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof RESIDENCE_QUERY>>> | null = null;
  let settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      [doc, settings] = await Promise.all([
        fetchPublished(RESIDENCE_QUERY, { slug }, [docTag('residence', slug), 'residence']),
        fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
      ]);
    } catch {
      doc = null;
      settings = null;
    }
  }
  const contact = contactFromSettings(settings);
  const residence: ResidenceContent | null = doc?.name && doc.slug ? withResidencePhotos({
    name: doc.name,
    slug: doc.slug,
    status: doc.status,
    shortLocation: doc.shortLocation,
    summary: doc.summary,
    heroImage: doc.heroImage,
    description: doc.description as ResidenceContent['description'],
    careTypes: doc.careTypes,
    audienceFit: doc.audienceFit,
    atmosphere: doc.atmosphere as ResidenceContent['atmosphere'],
    sharedSpaces: doc.sharedSpaces,
    rooms: doc.rooms,
    careAndSupport: doc.careAndSupport,
    everydayLife: doc.everydayLife,
    gallery: doc.gallery,
    team: doc.team,
    address: doc.address,
    faqs: doc.faqs as ResidenceContent['faqs'],
    formKind: doc.formKind,
    comingSoonNote: doc.comingSoonNote,
  }) : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(siteUrl, [
            { label: 'Home', href: '/' },
            { label: 'Our homes', href: '/homes' },
            { label: residence?.name || 'Residence', href: residencePath(slug) },
          ]),
          residence
            ? localBusinessJsonLd({
                name: residence.name,
                status: residence.status,
                path: residencePath(slug),
                siteUrl,
                phone: contact.phone,
                description: residence.summary,
                address: residence.address,
              })
            : null,
        ]}
      />
      <ResidenceView residence={residence} contact={contact} mapsKey={mapsKey} />
    </>
  );
}
