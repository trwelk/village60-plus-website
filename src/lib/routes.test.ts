import { describe, expect, it } from 'vitest';
import { CARE_SERVICE_SLUGS, LEGAL_SLUGS, ORACLE_HOMES_REDIRECT, PAGE_SLUGS, RESIDENCE_SLUGS, residencePath, residenceStaticParams } from './routes';

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
  it('builds residence params without Oracle and redirects /homes/oracle', () => {
    expect(residenceStaticParams().map((item) => item.slug)).toEqual(['tranquility', 'serenity', 'house-on-the-hill', 'enchanted-fields', 'the-grove']);
    expect(ORACLE_HOMES_REDIRECT).toEqual({ source: '/homes/oracle', destination: '/oracle', permanent: true });
  });
});
