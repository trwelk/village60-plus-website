import type { StructureResolver } from 'sanity/structure';

export const SINGLETON_TYPES: string[] = ['siteSettings'];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('residence').title('Residences'),
      S.documentTypeListItem('careService').title('Living & care services'),
      S.documentTypeListItem('ecosystemOffering').title('Silver Roots, Destination Retirement, SAGE'),
      S.documentTypeListItem('page').title('Pages'),
      S.divider(),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('teamMember').title('Team'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
    ]);
