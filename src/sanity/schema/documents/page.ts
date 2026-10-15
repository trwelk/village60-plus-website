import { defineArrayMember, defineField, defineType } from 'sanity';
import { LEGAL_SLUGS, PAGE_SLUGS } from '../../../lib/routes';
import { DOCUMENT_GROUPS, editorialField, seoField, slugField } from '../fields';

const SECTION_PAGES = new Set(['living-and-care', 'our-story']);
const BODY_PAGES = new Set<string>([...LEGAL_SLUGS, 'our-story']);

type PageDocument = { slug?: { current?: string } };

/** Hide fields the current page template does not render, so an empty editor is not mistaken for missing copy. */
export function hidePageField(field: 'heroVideo' | 'sections' | 'body' | 'lastReviewed', document: unknown): boolean {
  const slug = (document as PageDocument | undefined)?.slug?.current;
  if (!slug) return false;
  if (field === 'heroVideo') return slug !== 'home';
  if (field === 'sections') return !SECTION_PAGES.has(slug);
  if (field === 'body') return !BODY_PAGES.has(slug);
  return !(LEGAL_SLUGS as readonly string[]).includes(slug);
}

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: DOCUMENT_GROUPS,
  description: 'Heading, intro and hero for a fixed page. The homes list is edited under Residences. Sections are for Living and care and Our story. Body is for legal pages and Our story.',
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
    defineField({
      name: 'heroVideo',
      title: 'Hero video (home only)',
      type: 'heroVideo',
      group: 'content',
      hidden: ({ document }) => hidePageField('heroVideo', document),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'contentSection' })],
      description: 'Shown on Living and care and Our story.',
      hidden: ({ document }) => hidePageField('sections', document),
    }),
    defineField({
      name: 'body',
      title: 'Body (legal pages)',
      type: 'blockContent',
      group: 'content',
      description: 'Shown on the privacy, terms, accessibility and Our story pages.',
      hidden: ({ document }) => hidePageField('body', document),
    }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({
      name: 'lastReviewed',
      title: 'Last reviewed (legal pages)',
      type: 'date',
      group: 'content',
      hidden: ({ document }) => hidePageField('lastReviewed', document),
    }),
    seoField(),
    editorialField(),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
