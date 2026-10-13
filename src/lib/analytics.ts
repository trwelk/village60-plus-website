export const CONSENT_COOKIE = 'v60-consent';

export const TRACK_EVENTS = [
  'call_click',
  'whatsapp_click',
  'enquiry_open',
  'enquiry_submit',
  'directions_click',
  'form_error',
] as const;

export type TrackEvent = (typeof TRACK_EVENTS)[number];

export const TRACK_EVENT_NAME = 'v60-track';

export function parseConsent(cookie: string): 'accepted' | 'rejected' | null {
  const pair = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  if (!pair) return null;
  const value = pair.slice(CONSENT_COOKIE.length + 1);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

/** 180 days. Counsel still has to approve the cookie notice (spec §19). */
export function consentCookie(choice: 'accepted' | 'rejected', secure: boolean): string {
  const parts = [`${CONSENT_COOKIE}=${choice}`, 'Path=/', 'Max-Age=15552000', 'SameSite=Lax'];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function trackName(value: unknown): TrackEvent | null {
  return typeof value === 'string' && (TRACK_EVENTS as readonly string[]).includes(value) ? (value as TrackEvent) : null;
}

export function dispatchTrack(name: TrackEvent): void {
  if (typeof document === 'undefined') return;
  document.dispatchEvent(new CustomEvent(TRACK_EVENT_NAME, { detail: name }));
}
