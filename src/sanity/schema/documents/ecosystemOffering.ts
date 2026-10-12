import { defineArrayMember, defineField, defineType } from 'sanity';
import { FORM_KINDS } from '../../../lib/forms/kinds';
import { OFFERING_SLUGS } from '../../../lib/routes';
import { DOCUMENT_GROUPS, editorialField, seoField, slugField, statusField } from '../fields';

export const ecosystemOffering = defineType({
  name: 'ecosystemOffering',
  title: 'Ecosystem offering',
  type: 'document',
  groups: DOCUMENT_GROUPS,
  description: 'Silver Roots, Destination Retirement and SAGE. Oracle and The Grove are residences.',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    {
      ...slugField('name'),
      group: 'content',
      validation: (Rule) =>
        Rule.required().custom((slug: { current?: string } | undefined) =>
          (OFFERING_SLUGS as readonly string[]).includes(slug?.current ?? '') ? true : `Slug must be one of: ${OFFERING_SLUGS.join(', ')}`,
        ),
    },
    { ...statusField(), group: 'content' },
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'content' }),
    defineField({ name: 'distinction', title: 'One-sentence distinction from Village 60 Plus', type: 'string', group: 'content', validation: (Rule) => Rule.required().max(200) }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.required().max(300) }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'mediaImage', group: 'content' }),
    defineField({ name: 'heroTone', title: 'Hero background', type: 'string', group: 'content', options: { list: ['ivory', 'night'], layout: 'radio' }, initialValue: 'ivory', description: 'Only SAGE may use the dark hero.' }),
    defineField({ name: 'currentCapabilities', title: 'Approved capabilities (live now)', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })] }),
    defineField({ name: 'plannedCapabilities', title: 'Planned capabilities', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })], description: 'Each item must carry Pilot / Coming soon / In development / Planned.' }),
    defineField({ name: 'howItWorks', title: 'How it works', type: 'array', group: 'content', of: [defineArrayMember({ type: 'step' })], validation: (Rule) => Rule.max(3) }),
    defineField({
      name: 'benefitGroups',
      title: 'Benefits by audience',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'benefitGroup',
          fields: [
            defineField({ name: 'audience', title: 'Audience', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'points', title: 'Points', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.required().min(1) }),
          ],
          preview: { select: { title: 'audience' } },
        }),
      ],
    }),
    defineField({ name: 'sections', title: 'Additional sections', type: 'array', group: 'content', of: [defineArrayMember({ type: 'contentSection' })] }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({ name: 'formKind', title: 'Enquiry form used on this page', type: 'string', group: 'content', options: { list: FORM_KINDS.map((k) => ({ title: k.label, value: k.value })) }, initialValue: 'general', validation: (Rule) => Rule.required() }),
    defineField({ name: 'ctaLabel', title: 'Primary call-to-action label', type: 'string', group: 'content', initialValue: 'Enquire' }),
    seoField(),
    editorialField(),
  ],
  preview: { select: { title: 'name', subtitle: 'status', media: 'heroImage' } },
});
