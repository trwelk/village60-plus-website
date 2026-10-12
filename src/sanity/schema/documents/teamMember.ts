import { defineField, defineType } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'credentials', title: 'Credentials', type: 'array', of: [{ type: 'string' }], description: 'Verified qualifications and registrations only.' }),
    defineField({ name: 'bio', title: 'Biography', type: 'blockContent' }),
    defineField({ name: 'image', title: 'Photo', type: 'mediaImage' }),
    defineField({ name: 'approvedForPublication', title: 'Approved for publication (consent on file)', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});
