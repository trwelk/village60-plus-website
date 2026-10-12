import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'description', title: 'Meta description', type: 'text', rows: 3, validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'canonical', title: 'Canonical URL override', type: 'url' }),
    defineField({ name: 'image', title: 'Social image', type: 'mediaImage' }),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
  ],
});
