import { describe, expect, it } from 'vitest';
import { siteSettingsFixture } from '@/test/fixtures';
import { formatAddress, recipientsFor, toSiteContact } from './site-settings';

describe('site settings helpers', () => {
  it('maps settings to the SiteContact shape used by the chrome', () => {
    expect(toSiteContact(siteSettingsFixture)).toEqual({
      phone: '+94112504838',
      phoneDisplay: '+94 11 250 4838',
      whatsapp: '+94741003994',
      email: 'hello@example.com',
      responseTime: 'within one working day',
    });
  });
  it('routes each form kind to its inbox, falling back to general, then to the env fallback', () => {
    expect(recipientsFor(siteSettingsFixture, 'oracle-visit', 'fallback@example.com')).toEqual(['oracle@example.com']);
    expect(recipientsFor(siteSettingsFixture, 'grove-interest', 'fallback@example.com')).toEqual(['hello@example.com']);
    expect(recipientsFor({ formRecipients: null }, 'general', 'fallback@example.com')).toEqual(['fallback@example.com']);
  });
  it('formats a postal address on separate lines without empty parts', () => {
    expect(formatAddress(siteSettingsFixture.headOffice)).toBe('133/19 Nawala Road\nNarahenpita\nColombo 05\nSri Lanka');
    expect(formatAddress(null)).toBe('');
  });
});
