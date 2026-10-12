import { defineField, defineType } from 'sanity';
import { statusField } from '../fields';

export const SECTION_TONES = ['ivory', 'sand', 'paper', 'mist', 'green', 'night'];

export const contentSection = defineType({
  name: 'contentSection',
  title: 'Content section',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
    defineField({ name: 'image', title: 'Image', type: 'mediaImage' }),
    defineField({
      name: 'tone',
      title: 'Background',
      type: 'string',
      options: { list: SECTION_TONES },
      initialValue: 'ivory',
      description: 'Dark tones (green, night) are reserved for Oracle, the SAGE hero, the footer and one story quote band.',
    }),
    defineField({ name: 'cta', title: 'Call to action', type: 'link' }),
    statusField({ required: false, description: 'Optional. Set when this section describes something not yet live.' }),
  ],
  preview: { select: { title: 'heading', subtitle: 'eyebrow' } },
});
