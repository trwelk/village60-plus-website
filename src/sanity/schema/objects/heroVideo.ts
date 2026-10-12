import { defineField, defineType } from 'sanity';

export const heroVideo = defineType({
  name: 'heroVideo',
  title: 'Hero video',
  type: 'object',
  description: 'Muted, under 4 MB, with a poster image. Not shown to reduced-motion or data-saver visitors (spec §18).',
  fields: [
    defineField({ name: 'video', title: 'MP4 file (max 4 MB)', type: 'file', options: { accept: 'video/mp4' } }),
    defineField({ name: 'poster', title: 'Poster image', type: 'mediaImage', validation: (Rule) => Rule.required() }),
    defineField({ name: 'captions', title: 'Captions (.vtt, required if the video contains speech)', type: 'file', options: { accept: 'text/vtt' } }),
    defineField({
      name: 'description',
      title: 'Accessible description',
      type: 'string',
      description: 'One sentence describing what the video shows.',
      validation: (Rule) => Rule.required(),
    }),
  ],
});
