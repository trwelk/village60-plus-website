import { describe, expect, it } from 'vitest';
import { CONTENT_STATUSES } from '../../lib/content-status';
import { schemaTypes } from './index';

type FieldLike = { name: string; options?: { list?: unknown } };
type TypeLike = { name: string; type: string; fields?: FieldLike[] };

describe('schema registry', () => {
  it('registers every content type from spec §14 plus shared objects', () => {
    const names = schemaTypes.map((t) => t.name).sort();
    expect(names).toEqual(
      [
        // documents
        'siteSettings',
        'residence',
        'careService',
        'ecosystemOffering',
        'teamMember',
        'testimonial',
        'faq',
        'page',
        // objects
        'blockContent',
        'mediaImage',
        'seo',
        'editorial',
        'address',
        'link',
        'capability',
        'step',
        'contentSection',
        'room',
        'heroVideo',
      ].sort(),
    );
  });

  it('uses the shared status list on every type that has a status field', () => {
    const expected = CONTENT_STATUSES.map((s) => ({ title: s.label, value: s.value }));
    const withStatus = (schemaTypes as TypeLike[]).filter((t) => t.fields?.some((f) => f.name === 'status'));
    expect(withStatus.map((t) => t.name).sort()).toEqual(['capability', 'careService', 'contentSection', 'ecosystemOffering', 'residence']);
    for (const type of withStatus) {
      expect(type.fields?.find((f) => f.name === 'status')?.options?.list).toEqual(expected);
    }
  });

  it('gives every public document SEO and editorial review fields', () => {
    for (const name of ['residence', 'careService', 'ecosystemOffering', 'page']) {
      const type = (schemaTypes as TypeLike[]).find((t) => t.name === name);
      const fieldNames = type?.fields?.map((f) => f.name) ?? [];
      expect(fieldNames, name).toEqual(expect.arrayContaining(['seo', 'editorial']));
    }
  });
});
