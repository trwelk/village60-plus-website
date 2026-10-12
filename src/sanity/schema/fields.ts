import { defineField } from 'sanity';
import { CONTENT_STATUSES } from '../../lib/content-status';

export const DOCUMENT_GROUPS = [
  { name: 'content', title: 'Content', default: true },
  { name: 'seo', title: 'SEO' },
  { name: 'editorial', title: 'Review' },
];

/** Spec §13 status labels. Deliberately no initialValue: editors must choose. */
export function statusField({ required = true, description }: { required?: boolean; description?: string } = {}) {
  return defineField({
    name: 'status',
    title: 'Status',
    type: 'string',
    description:
      description ??
      'Shown to visitors wherever this could be mistaken for a current offering. Pick the honest label; never leave a future service as "Available now".',
    options: {
      list: CONTENT_STATUSES.map((s) => ({ title: s.label, value: s.value })),
      layout: 'radio',
    },
    validation: required ? (Rule) => Rule.required() : undefined,
  });
}

export function slugField(source = 'name') {
  return defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    description: 'Part of the public URL. Change only with a redirect in place.',
    options: { source, maxLength: 64 },
    validation: (Rule) => Rule.required(),
  });
}

export const seoField = () => defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' });

export const editorialField = () =>
  defineField({ name: 'editorial', title: 'Editorial review', type: 'editorial', group: 'editorial' });
