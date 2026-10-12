import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (Rule) => Rule.required().max(400) }),
    defineField({ name: 'displayName', title: 'Display name (first name or approved name)', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'relationship', title: 'Relationship', type: 'string', description: 'e.g. "Daughter of a resident"', validation: (Rule) => Rule.required() }),
    defineField({ name: 'residence', title: 'Residence', type: 'reference', to: [{ type: 'residence' }] }),
    defineField({ name: 'consentRecord', title: 'Consent record reference', type: 'string', description: 'Where the signed consent is filed.', validation: (Rule) => Rule.required() }),
    defineField({ name: 'consentDate', title: 'Consent date', type: 'date', validation: (Rule) => Rule.required() }),
    defineField({ name: 'approved', title: 'Approved for publication', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'displayName', subtitle: 'relationship' } },
});
