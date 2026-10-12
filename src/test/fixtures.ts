import type { SiteSettings } from '@/lib/site-settings';

export function imageFixture(alt: string, placeholder = true) {
  return {
    _type: 'mediaImage' as const,
    alt,
    caption: null,
    source: 'Test fixture',
    license: 'other',
    licenseNotes: null,
    consent: 'not-required',
    consentRecord: null,
    placeholder,
    replaceBy: placeholder ? '2027-01-31' : null,
    hotspot: null,
    crop: null,
    asset: {
      _id: 'image-abc123-1600x1000-svg',
      url: 'https://cdn.sanity.io/images/testproject/test/abc123-1600x1000.svg',
      metadata: { lqip: null, dimensions: { width: 1600, height: 1000, aspectRatio: 1.6 } },
    },
  };
}

export const siteSettingsFixture: SiteSettings = {
  brandName: 'Village 60 Plus',
  tagline: 'Live well. Age exceptionally.',
  legalName: 'Village 60 Plus (Pvt) Ltd',
  foundedYear: null,
  phone: '+94112504838',
  phoneDisplay: '+94 11 250 4838',
  whatsapp: '+94741003994',
  email: 'hello@example.com',
  openingHours: 'Monday to Saturday, 9am–6pm',
  responseTime: 'within one working day',
  emergencyNotice: null,
  headOffice: {
    _type: 'address',
    line1: '133/19 Nawala Road',
    line2: 'Narahenpita',
    city: 'Colombo 05',
    country: 'Sri Lanka',
  },
  socialLinks: null,
  formRecipients: [
    { _key: 'a', _type: 'formRecipient', kind: 'general', to: ['hello@example.com'] },
    { _key: 'b', _type: 'formRecipient', kind: 'oracle-visit', to: ['oracle@example.com'] },
  ],
  defaultSeo: null,
};
