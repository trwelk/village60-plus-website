import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { docTag } from '@/lib/revalidation';
import { RESIDENCE_SLUGS } from '@/lib/routes';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY, RESIDENCE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { ContactView } from './view';

const PATH = '/contact';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl, sanityProjectId } = getPublicEnv();
  const doc = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(PAGE_QUERY, { slug: 'contact' }, [docTag('page', 'contact'), 'page']).catch(() => null)
    : null;
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: 'Contact us',
    fallbackDescription: doc?.intro || 'Call, WhatsApp or send a note to Village 60 Plus.',
    seo: doc?.seo,
  });
}

export default async function ContactPage() {
  const { siteUrl, sanityProjectId, mapsKey } = getPublicEnv();
  let doc: Awaited<ReturnType<typeof fetchPublished<typeof PAGE_QUERY>>> | null = null;
  let settings: Awaited<ReturnType<typeof fetchPublished<typeof SITE_SETTINGS_QUERY>>> | null = null;
  let residences: Array<Awaited<ReturnType<typeof fetchPublished<typeof RESIDENCE_QUERY>>>> = [];
  if (isSanityProjectConfigured(sanityProjectId)) {
    try {
      doc = await fetchPublished(PAGE_QUERY, { slug: 'contact' }, [docTag('page', 'contact'), 'page']);
      settings = await fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']);
      residences = await Promise.all(
        RESIDENCE_SLUGS.map((slug) => fetchPublished(RESIDENCE_QUERY, { slug }, [docTag('residence', slug), 'residence'])),
      );
    } catch {
      doc = null;
      settings = null;
      residences = [];
    }
  }
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Contact', href: PATH }])} />
      <ContactView
        title={doc?.title || 'Contact us'}
        intro={doc?.intro}
        contact={contactFromSettings(settings)}
        openingHours={settings?.openingHours}
        emergencyNotice={settings?.emergencyNotice}
        headOffice={settings?.headOffice}
        mapsKey={mapsKey}
        residences={residences.flatMap((residence) => (residence?.name ? [{ name: residence.name, address: residence.address ?? null }] : []))}
      />
    </>
  );
}
