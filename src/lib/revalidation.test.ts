import { describe, expect, it } from 'vitest';
import { docTag, tagsForWebhook } from './revalidation';

describe('cache tags', () => {
  it('formats list and detail tags', () => {
    expect(docTag('residence')).toBe('residence');
    expect(docTag('residence', 'serenity')).toBe('residence:serenity');
  });
  it('maps a residence webhook to its list, detail and sitemap tags', () => {
    expect(tagsForWebhook({ _type: 'residence', slug: { current: 'serenity' } })).toEqual(
      expect.arrayContaining(['residence', 'residence:serenity', 'sitemap', 'careService']),
    );
  });
  it('maps site settings to a single tag', () => {
    expect(tagsForWebhook({ _type: 'siteSettings' })).toEqual(['siteSettings']);
  });
  it('fans referenced documents out to everything that embeds them', () => {
    expect(tagsForWebhook({ _type: 'faq' })).toEqual(expect.arrayContaining(['faq', 'residence', 'careService', 'ecosystemOffering', 'page']));
  });
  it('returns nothing for an unknown payload', () => {
    expect(tagsForWebhook({})).toEqual([]);
  });
});
