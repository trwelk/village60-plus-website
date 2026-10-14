import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { organizationJsonLd, pageMetadata, websiteJsonLd } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { imagesFromOracleFrames } from '@/components/content/OracleSpotlight';
import { CARE_SERVICES_QUERY, OFFERINGS_QUERY, ORACLE_FRAMES_QUERY, PAGE_QUERY, RESIDENCES_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { HomeView, toCareCards, toHomeOfferings, toResidenceCards } from './home-view';

type HomePageData = {
  home: Awaited<ReturnType<typeof fetchPublished<typeof PAGE_QUERY>>> | null;
  residences: Awaited<ReturnType<typeof fetchPublished<typeof RESIDENCES_QUERY>>> | null;
  careServices: Awaited<ReturnType<typeof fetchPublished<typeof CARE_SERVICES_QUERY>>> | null;
  offerings: Awaited<ReturnType<typeof fetchPublished<typeof OFFERINGS_QUERY>>> | null;
  settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null;
  oracleFrames: unknown;
};

const emptyHomeData: HomePageData = {
  home: null,
  residences: null,
  careServices: null,
  offerings: null,
  settings: null,
  oracleFrames: null,
};

async function loadHomePageData(): Promise<HomePageData> {
  const { sanityProjectId } = getPublicEnv();
  if (!isSanityProjectConfigured(sanityProjectId)) {
    return emptyHomeData;
  }
  try {
    const [home, residences, careServices, offerings, settings, oracleFrames] = await Promise.all([
      fetchPublished(PAGE_QUERY, { slug: 'home' }, [docTag('page', 'home'), 'page']),
      fetchPublished(RESIDENCES_QUERY, {}, ['residence']),
      fetchPublished(CARE_SERVICES_QUERY, {}, ['careService']),
      fetchPublished(OFFERINGS_QUERY, {}, ['ecosystemOffering']),
      fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
      fetchPublished(ORACLE_FRAMES_QUERY, {}, ['residence']),
    ]);
    return { home, residences, careServices, offerings, settings, oracleFrames };
  } catch {
    return emptyHomeData;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(PAGE_QUERY, { slug: 'home' }, [docTag('page', 'home'), 'page']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: '/',
    fallbackTitle: 'Village 60 Plus — homes, care and support for later life in Sri Lanka',
    fallbackDescription: 'Homes, care and practical support for later life in Sri Lanka.',
    seo: doc?.seo,
  });
}

export default async function HomePage() {
  const { home, residences, careServices, offerings, settings, oracleFrames } = await loadHomePageData();
  const contact = contactFromSettings(settings);
  const siteUrl = getPublicEnv().siteUrl;
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd({
            brandName: settings?.brandName ?? 'Village 60 Plus',
            legalName: settings?.legalName,
            siteUrl,
            phone: contact.phone,
            email: contact.email,
          }),
          websiteJsonLd({ brandName: settings?.brandName ?? 'Village 60 Plus', siteUrl }),
        ]}
      />
      <HomeView
        home={home ? { title: home.title, intro: home.intro, heroImage: home.heroImage, heroVideo: home.heroVideo } : null}
        residences={toResidenceCards(residences)}
        careServices={toCareCards(careServices)}
        offerings={toHomeOfferings(offerings)}
        oracleImages={imagesFromOracleFrames(oracleFrames)}
        contact={contact}
      />
    </>
  );
}
