import { defineField, defineType } from 'sanity';

export const REVIEW_STATUSES = [
  { title: 'Draft', value: 'draft' },
  { title: 'Internal review', value: 'internal-review' },
  { title: 'Client / compliance review', value: 'client-review' },
  { title: 'Approved', value: 'approved' },
  { title: 'Archived', value: 'archived' },
];

type EditorialValue = { reviewStatus?: string; requiresComplianceReview?: boolean };

export const editorial = defineType({
  name: 'editorial',
  title: 'Editorial review',
  type: 'object',
  fields: [
    defineField({
      name: 'reviewStatus',
      title: 'Review status',
      type: 'string',
      options: { list: REVIEW_STATUSES, layout: 'radio' },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requiresComplianceReview',
      title: 'Contains clinical, privacy, licensing or future-product claims',
      type: 'boolean',
      initialValue: false,
      description: 'When ticked, this document cannot be published until the review status is Approved (spec §14).',
    }),
    defineField({ name: 'reviewNotes', title: 'Review notes', type: 'text', rows: 3 }),
    defineField({ name: 'verifiedOn', title: 'Facts verified on', type: 'date' }),
  ],
  validation: (Rule) =>
    Rule.custom((value: EditorialValue | undefined) =>
      value?.requiresComplianceReview && value.reviewStatus !== 'approved'
        ? 'Flagged for compliance review: set the review status to Approved before publishing.'
        : true,
    ),
});
