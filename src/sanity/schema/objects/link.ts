import { defineField, defineType } from 'sanity';

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
    }),
  ],
});
