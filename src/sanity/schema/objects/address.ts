import { defineField, defineType } from 'sanity';

export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({ name: 'line1', title: 'Address line 1', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'line2', title: 'Address line 2', type: 'string' }),
    defineField({ name: 'city', title: 'City / town', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'district', title: 'District', type: 'string' }),
    defineField({ name: 'postcode', title: 'Postcode', type: 'string' }),
    defineField({ name: 'country', title: 'Country', type: 'string', initialValue: 'Sri Lanka' }),
    defineField({ name: 'landmarks', title: 'Nearby landmarks', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'location', title: 'Map location', type: 'geopoint' }),
    defineField({ name: 'directionsUrl', title: 'Directions link (Google Maps)', type: 'url' }),
    defineField({ name: 'visitingNotes', title: 'Visiting details', type: 'text', rows: 3 }),
  ],
});
