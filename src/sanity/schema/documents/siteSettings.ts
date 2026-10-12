import { defineArrayMember, defineField, defineType } from 'sanity';
import { FORM_KINDS } from '../../../lib/forms/kinds';

const E164 = /^\+\d{9,15}$/;

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'forms', title: 'Form routing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'brandName', title: 'Brand name', type: 'string', group: 'brand', initialValue: 'Village 60 Plus', validation: (Rule) => Rule.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'brand', initialValue: 'Live well. Age exceptionally.' }),
    defineField({ name: 'legalName', title: 'Legal organisation name', type: 'string', group: 'brand', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'foundedYear',
      title: 'Founding year',
      type: 'number',
      group: 'brand',
      description: 'Leave empty until the client confirms 2008 vs 2009 (spec §20). Empty hides "Established …" everywhere.',
      validation: (Rule) => Rule.integer().min(1990).max(new Date().getFullYear()),
    }),
    defineField({ name: 'phone', title: 'Primary phone (E.164, e.g. +94112504838)', type: 'string', group: 'contact', validation: (Rule) => Rule.required().regex(E164, { name: 'E.164 number' }) }),
    defineField({ name: 'phoneDisplay', title: 'Phone as displayed', type: 'string', group: 'contact', validation: (Rule) => Rule.required() }),
    defineField({ name: 'whatsapp', title: 'WhatsApp number (E.164)', type: 'string', group: 'contact', validation: (Rule) => Rule.required().regex(E164, { name: 'E.164 number' }) }),
    defineField({ name: 'email', title: 'Public email', type: 'string', group: 'contact', validation: (Rule) => Rule.required().email() }),
    defineField({ name: 'openingHours', title: 'Contact hours', type: 'string', group: 'contact', description: 'e.g. "Monday to Saturday, 9am–6pm"' }),
    defineField({ name: 'responseTime', title: 'Expected response time', type: 'string', group: 'contact', initialValue: 'within one working day', validation: (Rule) => Rule.required() }),
    defineField({ name: 'headOffice', title: 'Head office', type: 'address', group: 'contact' }),
    defineField({ name: 'emergencyNotice', title: 'Emergency disclaimer', type: 'text', rows: 2, group: 'contact', description: 'Wording must be approved by the client and counsel (spec §19).' }),
    defineField({ name: 'socialLinks', title: 'Social links', type: 'array', group: 'contact', of: [defineArrayMember({ type: 'link' })] }),
    defineField({
      name: 'formRecipients',
      title: 'Form recipients',
      type: 'array',
      group: 'forms',
      description: 'Which inbox receives each form. "General enquiry" is the fallback for any kind without its own row.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'formRecipient',
          fields: [
            defineField({ name: 'kind', title: 'Form', type: 'string', options: { list: FORM_KINDS.map((k) => ({ title: k.label, value: k.value })) }, validation: (Rule) => Rule.required() }),
            defineField({ name: 'to', title: 'Recipient emails', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.required().min(1) }),
          ],
          preview: { select: { title: 'kind', to: 'to' }, prepare: ({ title, to }) => ({ title, subtitle: (to as string[] | undefined)?.join(', ') }) },
        }),
      ],
    }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
