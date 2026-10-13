import 'server-only';
import type { SiteContact } from '@/lib/contact';
import { getPublicEnv } from '@/lib/env';
import { isSanityProjectConfigured } from '@/lib/sanity-project';
import { contactFromSettings, formatAddress } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';

export type SiteChrome = {
  contact: SiteContact;
  legalName: string;
  address: string;
  foundedYear: number | null;
  openingHours: string | null;
};

export async function getSiteChrome(): Promise<SiteChrome> {
  const { sanityProjectId } = getPublicEnv();
  const settings = isSanityProjectConfigured(sanityProjectId)
    ? await fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']).catch(() => null)
    : null;
  return {
    contact: contactFromSettings(settings),
    legalName: settings?.legalName ?? 'Village 60 Plus',
    address: formatAddress(settings?.headOffice) || 'Colombo, Sri Lanka',
    foundedYear: settings?.foundedYear ?? null,
    openingHours: settings?.openingHours ?? null,
  };
}
