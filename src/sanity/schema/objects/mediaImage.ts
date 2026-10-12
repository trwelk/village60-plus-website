import { defineField, defineType } from 'sanity';

export const LICENSES = [
  { title: 'Client-owned (written confirmation on file)', value: 'client-owned' },
  { title: 'Licensed stock (model release on file)', value: 'licensed-stock' },
  { title: 'Creative Commons', value: 'creative-commons' },
  { title: 'Public domain', value: 'public-domain' },
  { title: 'Other (explain in notes)', value: 'other' },
];

export const CONSENT_STATES = [
  { title: 'Not required (no identifiable people)', value: 'not-required' },
  { title: 'Obtained (record filed)', value: 'obtained' },
  { title: 'Pending — do not publish', value: 'pending' },
];

type MediaImageValue = { placeholder?: boolean; replaceBy?: string; consent?: string };

export const mediaImage = defineType({
  name: 'mediaImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe what the image shows for people who cannot see it. Required.',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Photographer, agency or "Client — <residence>, <date>".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'license',
      title: 'License',
      type: 'string',
      options: { list: LICENSES },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'licenseNotes', title: 'License notes / expiry', type: 'string' }),
    defineField({
      name: 'consent',
      title: 'Consent for identifiable people',
      type: 'string',
      options: { list: CONSENT_STATES, layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'consentRecord', title: 'Consent record reference', type: 'string' }),
    defineField({
      name: 'placeholder',
      title: 'Temporary placeholder',
      type: 'boolean',
      initialValue: false,
      description: 'Tick for any image that must be replaced before or after launch (spec §12).',
    }),
    defineField({
      name: 'replaceBy',
      title: 'Replace by',
      type: 'date',
      hidden: ({ parent }) => !(parent as MediaImageValue | undefined)?.placeholder,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: MediaImageValue | undefined) => {
      if (value?.placeholder && !value.replaceBy) return 'Placeholder images need a replacement deadline.';
      if (value?.consent === 'pending') return 'Consent is pending — this image cannot be published yet.';
      return true;
    }),
  preview: {
    select: { media: 'asset', title: 'alt', placeholder: 'placeholder' },
    prepare: ({ media, title, placeholder }) => ({ media, title, subtitle: placeholder ? 'PLACEHOLDER' : undefined }),
  },
});
