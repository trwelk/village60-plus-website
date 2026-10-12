import 'server-only';
import type { SiteContact } from '@/lib/contact';
import { formatAddress, toSiteContact } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';

export type SiteChrome = {
  contact: SiteContact;
  legalName: string;
  address: string;
  foundedYear: number | null;
  openingHours: string | null;
};

const emptyContact: SiteContact = {
  phone: '',
  phoneDisplay: '',
  whatsapp: '',
  email: '',
  responseTime: 'as soon as we can',
};

export async function getSiteChrome(): Promise<SiteChrome> {
  const settings = await fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']);
  const contact =
    settings?.phone && settings.phoneDisplay && settings.whatsapp && settings.email && settings.responseTime
      ? toSiteContact(settings)
      : emptyContact;
  return {
    contact,
    legalName: settings?.legalName ?? 'Village 60 Plus',
    address: formatAddress(settings?.headOffice) || 'Colombo, Sri Lanka',
    foundedYear: settings?.foundedYear ?? null,
    openingHours: settings?.openingHours ?? null,
  };
}
