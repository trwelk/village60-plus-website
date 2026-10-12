import { describe, expect, it } from 'vitest';
import { CARE_SERVICE_SLUGS, LEGAL_SLUGS, PAGE_SLUGS, RESIDENCE_SLUGS, residencePath } from './routes';

describe('routes', () => {
  it('lists the six residences from the spec sitemap', () => {
    expect([...RESIDENCE_SLUGS]).toEqual(['tranquility', 'serenity', 'house-on-the-hill', 'enchanted-fields', 'oracle', 'the-grove']);
  });
  it('gives Oracle its single canonical URL and other homes a /homes/ URL', () => {
    expect(residencePath('oracle')).toBe('/oracle');
    expect(residencePath('the-grove')).toBe('/homes/the-grove');
  });
  it('lists five care services and three legal pages', () => {
    expect(CARE_SERVICE_SLUGS).toHaveLength(5);
    expect([...LEGAL_SLUGS]).toEqual(['privacy', 'terms', 'accessibility']);
    expect(PAGE_SLUGS).toEqual(expect.arrayContaining([...LEGAL_SLUGS, 'home', 'contact']));
  });
});
