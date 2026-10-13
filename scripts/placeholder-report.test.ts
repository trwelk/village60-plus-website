import { describe, expect, it } from 'vitest';
import { collectPlaceholders, renderPlaceholderReport } from './placeholder-report';

const documents = [
  {
    _id: 'residence.serenity',
    _type: 'residence',
    name: 'Serenity',
    heroImage: {
      _type: 'mediaImage',
      alt: 'Serenity verandah',
      source: 'Client — Serenity, unconfirmed',
      license: 'client-owned',
      placeholder: true,
      replaceBy: '2027-01-31',
    },
    gallery: [
      { _type: 'mediaImage', alt: 'Garden', source: 'Licensed stock', license: 'licensed-stock', placeholder: false, replaceBy: null },
    ],
  },
  {
    _id: 'team.one',
    _type: 'teamMember',
    name: 'A staff member',
    image: { _type: 'mediaImage', alt: 'Portrait', source: '', license: '', placeholder: true, replaceBy: '' },
  },
];

describe('placeholder report', () => {
  it('collects nested placeholder images and skips published-ready ones', () => {
    const hits = collectPlaceholders(documents);
    expect(hits).toEqual([
      {
        documentTitle: 'Serenity',
        documentType: 'residence',
        alt: 'Serenity verandah',
        source: 'Client — Serenity, unconfirmed',
        license: 'client-owned',
        replaceBy: '2027-01-31',
      },
      {
        documentTitle: 'A staff member',
        documentType: 'teamMember',
        alt: 'Portrait',
        source: '',
        license: '',
        replaceBy: '',
      },
    ]);
  });

  it('writes a markdown table with source, license and replacement deadline', () => {
    const markdown = renderPlaceholderReport(collectPlaceholders(documents), '2026-10-12');
    expect(markdown).toContain('# Placeholder images');
    expect(markdown).toContain('Generated 2026-10-12');
    expect(markdown).toContain('| Serenity | residence | Serenity verandah | Client — Serenity, unconfirmed | client-owned | 2027-01-31 |');
    expect(markdown).toContain('| A staff member | teamMember | Portrait |  |  |  |');
    expect(markdown).not.toContain('Garden');
  });

  it('says there are none when the list is empty', () => {
    expect(renderPlaceholderReport([], '2026-10-12')).toContain('No placeholder images.');
  });
});
