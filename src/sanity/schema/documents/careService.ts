import { defineArrayMember, defineField, defineType } from 'sanity';
import { FORM_KINDS } from '../../../lib/forms/kinds';
import { CARE_SERVICE_SLUGS } from '../../../lib/routes';
import { DOCUMENT_GROUPS, editorialField, seoField, slugField, statusField } from '../fields';

export const careService = defineType({
  name: 'careService',
  title: 'Care service',
  type: 'document',
  groups: DOCUMENT_GROUPS,
  description: 'Participating residences are derived from each residence\'s "Care and living options" field.',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    {
      ...slugField('name'),
      group: 'content',
      validation: (Rule) =>
        Rule.required().custom((slug: { current?: string } | undefined) =>
          (CARE_SERVICE_SLUGS as readonly string[]).includes(slug?.current ?? '') ? true : `Slug must be one of: ${CARE_SERVICE_SLUGS.join(', ')}`,
        ),
    },
    { ...statusField(), group: 'content' },
    defineField({ name: 'summary', title: 'Summary (plain language)', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.required().max(240) }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'mediaImage', group: 'content' }),
    defineField({ name: 'whoItSuits', title: 'Who this is for', type: 'array', group: 'content', of: [{ type: 'string' }] }),
    defineField({ name: 'typicalDuration', title: 'Typical duration', type: 'string', group: 'content', description: 'e.g. "Two to six weeks". Leave empty if not applicable.' }),
    defineField({ name: 'included', title: 'What is included', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })], description: 'Mark each item as included, optional extra or partner-arranged.' }),
    defineField({ name: 'process', title: 'Enquiry and assessment process', type: 'array', group: 'content', of: [defineArrayMember({ type: 'step' })] }),
    defineField({ name: 'notRightFit', title: 'If this is not the right fit', type: 'text', rows: 3, group: 'content', description: 'What the team does when Village 60 Plus cannot help (spec §8.6).' }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({ name: 'formKind', title: 'Enquiry form used on this page', type: 'string', group: 'content', options: { list: FORM_KINDS.map((k) => ({ title: k.label, value: k.value })) }, initialValue: 'general', validation: (Rule) => Rule.required() }),
    seoField(),
    editorialField(),
  ],
  preview: { select: { title: 'name', subtitle: 'status', media: 'heroImage' } },
});
