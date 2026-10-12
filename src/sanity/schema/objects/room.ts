import { defineField, defineType } from 'sanity';

export const room = defineType({
  name: 'room',
  title: 'Room',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'house', title: 'House / wing', type: 'string' }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 2 }),
    defineField({
      name: 'facts',
      title: 'Verified facts',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Only facts confirmed by the client (size, aspect, bathroom). No pricing.',
    }),
    defineField({ name: 'image', title: 'Image', type: 'mediaImage' }),
  ],
  preview: { select: { title: 'name', subtitle: 'house', media: 'image' } },
});
