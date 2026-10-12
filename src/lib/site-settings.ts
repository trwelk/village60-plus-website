import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity/types';
import type { SiteContact } from './contact';
import type { FormKind } from './forms/kinds';

export type SiteSettings = NonNullable<SITE_SETTINGS_QUERY_RESULT>;
export type SiteAddress = SiteSettings['headOffice'];

export function toSiteContact(settings: Pick<SiteSettings, 'phone' | 'phoneDisplay' | 'whatsapp' | 'email' | 'responseTime'>): SiteContact {
  return {
    phone: settings.phone,
    phoneDisplay: settings.phoneDisplay,
    whatsapp: settings.whatsapp,
    email: settings.email,
    responseTime: settings.responseTime,
  };
}

/** Recipients for a form kind: its own row → the "general" row → the env fallback. Never returns an empty list. */
export function recipientsFor(settings: Pick<SiteSettings, 'formRecipients'>, kind: FormKind, fallback: string): string[] {
  const rows = settings.formRecipients ?? [];
  const clean = (to: Array<string | null> | null | undefined) => (to ?? []).filter((e): e is string => Boolean(e));
  const own = clean(rows.find((r) => r.kind === kind)?.to);
  if (own.length) return own;
  const general = clean(rows.find((r) => r.kind === 'general')?.to);
  return general.length ? general : [fallback];
}

export function formatAddress(address: SiteAddress | null | undefined): string {
  if (!address) return '';
  return [address.line1, address.line2, address.city, address.postcode, address.country].filter(Boolean).join('\n');
}
