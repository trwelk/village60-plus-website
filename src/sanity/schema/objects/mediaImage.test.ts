import { describe, expect, it } from 'vitest';
import { mediaImage } from './mediaImage';

describe('mediaImage', () => {
  it('is an image type carrying the rights fields required by spec §12', () => {
    expect(mediaImage.type).toBe('image');
    expect(mediaImage.options?.hotspot).toBe(true);
    const names = mediaImage.fields?.map((f) => f.name) ?? [];
    expect(names).toEqual(['alt', 'caption', 'source', 'license', 'licenseNotes', 'consent', 'consentRecord', 'placeholder', 'replaceBy']);
  });
});
