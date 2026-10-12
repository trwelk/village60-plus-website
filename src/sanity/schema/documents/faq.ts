import { defineField, defineType } from 'sanity';
import { FAQ_PAGE_KEYS } from '../../../lib/routes';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required().max(160) }),
    defineField({ name: 'answer', title: 'Answer', type: 'blockContent', validation: (Rule) => Rule.required() }),
    defineField({ name: 'pages', title: 'Applicable pages', type: 'array', of: [{ type: 'string' }], options: { list: [...FAQ_PAGE_KEYS] } }),
    defineField({ name: 'reviewDate', title: 'Next review date', type: 'date' }),
  ],
  preview: { select: { title: 'question' } },
});
