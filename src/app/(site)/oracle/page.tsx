import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { ORACLE_SLUG } from '@/lib/routes';
import { breadcrumbJsonLd, localBusinessJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { RESIDENCE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { withResidencePhotos } from '@/lib/site-photos';
import type { ResidenceContent } from '../homes/[slug]/view';
import { OracleView } from './view';

const PATH = '/oracle';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(RESIDENCE_QUERY, { slug: ORACLE_SLUG }, [docTag('residence', ORACLE_SLUG), 'residence']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: 'Oracle',
    fallbackDescription: doc?.summary || 'Oracle, a Village 60 Plus residence.',
    seo: doc?.seo,
  });
}

export default async function OraclePage() {
  const { siteUrl, sanityProjectId, mapsKey } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof RESIDENCE_QUERY>>> | null = null;
  let settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null = null;
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      [doc, settings] = await Promise.all([
        fetchPublished(RESIDENCE_QUERY, { slug: ORACLE_SLUG }, [docTag('residence', ORACLE_SLUG), 'residence']),
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
          breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Oracle', href: PATH }]),
          residence
            ? localBusinessJsonLd({
                name: residence.name,
                status: residence.status,
                path: PATH,
                siteUrl,
                phone: contact.phone,
                description: residence.summary,
                address: residence.address,
              })
            : null,
        ]}
      />
      <OracleView residence={residence} contact={contact} mapsKey={mapsKey} />
    </>
  );
}
