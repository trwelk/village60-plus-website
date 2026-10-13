import { describe, expect, it } from 'vitest';
import { consentCookie, parseConsent, trackName } from './analytics';

describe('analytics consent and event names', () => {
  it('reads only the v60-consent cookie', () => {
    expect(parseConsent('')).toBeNull();
    expect(parseConsent('other=accepted')).toBeNull();
    expect(parseConsent('v60-consent=accepted')).toBe('accepted');
    expect(parseConsent('theme=ivory; v60-consent=rejected')).toBe('rejected');
    expect(parseConsent('v60-consent=maybe')).toBeNull();
  });

  it('writes a Lax cookie and adds Secure only on https', () => {
    expect(consentCookie('accepted', false)).toBe('v60-consent=accepted; Path=/; Max-Age=15552000; SameSite=Lax');
    expect(consentCookie('rejected', true)).toBe('v60-consent=rejected; Path=/; Max-Age=15552000; SameSite=Lax; Secure');
  });

  it('accepts the six event names and rejects everything else', () => {
    expect(trackName('call_click')).toBe('call_click');
    expect(trackName('whatsapp_click')).toBe('whatsapp_click');
    expect(trackName('enquiry_open')).toBe('enquiry_open');
    expect(trackName('enquiry_submit')).toBe('enquiry_submit');
    expect(trackName('directions_click')).toBe('directions_click');
    expect(trackName('form_error')).toBe('form_error');
    expect(trackName('visitor@example.com')).toBeNull();
    expect(trackName('+94741003994')).toBeNull();
    expect(trackName('oracle-visit')).toBeNull();
    expect(trackName({ name: 'Jane' })).toBeNull();
    expect(trackName(null)).toBeNull();
  });
});
