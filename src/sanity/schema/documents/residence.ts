import { defineArrayMember, defineField, defineType } from 'sanity';
import { isFuture, type ContentStatus } from '../../../lib/content-status';
import { FORM_KINDS } from '../../../lib/forms/kinds';
import { RESIDENCE_SLUGS } from '../../../lib/routes';
import { DOCUMENT_GROUPS, editorialField, seoField, slugField, statusField } from '../fields';

export const residence = defineType({
  name: 'residence',
  title: 'Residence',
  type: 'document',
  groups: DOCUMENT_GROUPS,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    {
      ...slugField('name'),
      group: 'content',
      validation: (Rule) =>
        Rule.required().custom((slug: { current?: string } | undefined) =>
          (RESIDENCE_SLUGS as readonly string[]).includes(slug?.current ?? '') ? true : `Slug must be one of: ${RESIDENCE_SLUGS.join(', ')}`,
        ),
    },
    { ...statusField(), group: 'content' },
    defineField({ name: 'isFlagship', title: 'Flagship (Oracle)', type: 'boolean', group: 'content', initialValue: false, description: 'Uses the Oracle template at /oracle instead of the shared residence template.' }),
    defineField({ name: 'shortLocation', title: 'Short location', type: 'string', group: 'content', description: 'As shown on cards, e.g. "Narahenpita, Colombo 05". Verified locations only.', validation: (Rule) => Rule.required() }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.required().max(240) }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'mediaImage', group: 'content' }),
    defineField({ name: 'description', title: 'Introduction', type: 'blockContent', group: 'content' }),
    defineField({ name: 'careTypes', title: 'Care and living options offered here', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'careService' }] })] }),
    defineField({ name: 'audienceFit', title: 'Who this home suits', type: 'array', group: 'content', of: [{ type: 'string' }] }),
    defineField({ name: 'atmosphere', title: 'Atmosphere and daily life', type: 'blockContent', group: 'content' }),
    defineField({ name: 'rooms', title: 'Rooms', type: 'array', group: 'content', of: [defineArrayMember({ type: 'room' })] }),
    defineField({ name: 'sharedSpaces', title: 'Shared spaces', type: 'array', group: 'content', of: [{ type: 'string' }] }),
    defineField({ name: 'careAndSupport', title: 'Care and support at this location', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })] }),
    defineField({ name: 'everydayLife', title: 'Meals, housekeeping, activities and family visits', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })] }),
    defineField({ name: 'gallery', title: 'Gallery', type: 'array', group: 'content', of: [defineArrayMember({ type: 'mediaImage' })], description: 'Only images verified to show this residence.' }),
    defineField({ name: 'team', title: 'Team', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'teamMember' }] })] }),
    defineField({ name: 'address', title: 'Address and visiting', type: 'address', group: 'content' }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({
      name: 'formKind',
      title: 'Enquiry form used on this page',
      type: 'string',
      group: 'content',
      options: { list: FORM_KINDS.map((k) => ({ title: k.label, value: k.value })) },
      initialValue: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'comingSoonNote',
      title: 'Coming-soon note',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown instead of operational sections when the status is Coming soon / In development / Planned.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const status = (context.document as { status?: ContentStatus } | undefined)?.status;
          return status && isFuture(status) && !value ? 'Future residences need an honest coming-soon note.' : true;
        }),
    }),
    seoField(),
    editorialField(),
  ],
  preview: { select: { title: 'name', subtitle: 'shortLocation', media: 'heroImage' } },
  orderings: [{ title: 'Name', name: 'name', by: [{ field: 'name', direction: 'asc' }] }],
});
