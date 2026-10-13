import { describe, expect, it } from 'vitest';
import { CARE_SERVICE_SLUGS, LEGAL_SLUGS, ORACLE_HOMES_REDIRECT, PAGE_SLUGS, RESIDENCE_SLUGS, careStaticParams, contextForPath, isLegalSlug, residencePath, residenceStaticParams } from './routes';

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
  it('builds a static param for each care service', () => {
    expect(careStaticParams().map((item) => item.slug)).toEqual(['independent-living', 'residential-care', 'respite-care', 'recovery', 'rehabilitation']);
  });
  it('allow-lists the three legal pages', () => {
    expect(isLegalSlug('privacy')).toBe(true);
    expect(isLegalSlug('terms')).toBe(true);
    expect(isLegalSlug('accessibility')).toBe(true);
    expect(isLegalSlug('homes')).toBe(false);
  });
  it('builds page-specific WhatsApp context from the path', () => {
    expect(contextForPath('/')).toBe('Village 60 Plus');
    expect(contextForPath('/oracle')).toBe('Oracle');
    expect(contextForPath('/homes/serenity')).toBe('Serenity');
    expect(contextForPath('/homes/the-grove')).toBe('The Grove');
    expect(contextForPath('/living-and-care/respite-care')).toBe('Respite care');
    expect(contextForPath('/silver-roots')).toBe('Silver Roots');
    expect(contextForPath('/unknown')).toBe('Village 60 Plus');
  });
});
