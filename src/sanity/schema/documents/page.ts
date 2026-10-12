import { defineArrayMember, defineField, defineType } from 'sanity';
import { PAGE_SLUGS } from '../../../lib/routes';
import { DOCUMENT_GROUPS, editorialField, seoField, slugField } from '../fields';

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: DOCUMENT_GROUPS,
  description: 'Copy for fixed pages (home, hubs, story, contact, legal). Structure is code; words are here.',
  fields: [
    defineField({ name: 'title', title: 'Title (H1)', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    {
      ...slugField('title'),
      group: 'content',
      validation: (Rule) =>
        Rule.required().custom((slug: { current?: string } | undefined) =>
          (PAGE_SLUGS as readonly string[]).includes(slug?.current ?? '') ? true : `Slug must be one of: ${PAGE_SLUGS.join(', ')}`,
        ),
    },
    defineField({ name: 'intro', title: 'Intro sentence', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'mediaImage', group: 'content' }),
    defineField({ name: 'heroVideo', title: 'Hero video (home only)', type: 'heroVideo', group: 'content' }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', group: 'content', of: [defineArrayMember({ type: 'contentSection' })] }),
    defineField({ name: 'body', title: 'Body (legal pages)', type: 'blockContent', group: 'content' }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({ name: 'lastReviewed', title: 'Last reviewed (legal pages)', type: 'date', group: 'content' }),
    seoField(),
    editorialField(),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
