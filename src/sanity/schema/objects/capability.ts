import { defineField, defineType } from 'sanity';
import { statusField } from '../fields';

/** Spec §8.5: distinguish included services from paid or partner-arranged services. */
export const PROVISIONS = [
  { title: 'Included', value: 'included' },
  { title: 'Optional extra (quoted separately)', value: 'optional-extra' },
  { title: 'Arranged through a partner', value: 'partner-arranged' },
];

export const capability = defineType({
  name: 'capability',
  title: 'Service / capability',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'provision',
      title: 'How it is provided',
      type: 'string',
      options: { list: PROVISIONS, layout: 'radio' },
      initialValue: 'included',
      validation: (Rule) => Rule.required(),
    }),
    statusField({ description: 'Shown next to the item. Use Pilot / Planned / In development for anything not live.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
