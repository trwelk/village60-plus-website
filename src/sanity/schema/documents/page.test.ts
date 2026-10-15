import { describe, expect, it } from 'vitest';
import { hidePageField } from './page';

const doc = (slug?: string) => (slug ? { slug: { current: slug } } : undefined);

describe('hidePageField', () => {
  it('keeps Our homes on the fields that page actually stores', () => {
    const homes = doc('homes');
    expect(hidePageField('heroVideo', homes)).toBe(true);
    expect(hidePageField('sections', homes)).toBe(true);
    expect(hidePageField('body', homes)).toBe(true);
    expect(hidePageField('lastReviewed', homes)).toBe(true);
  });

  it('shows sections on the two pages that render them', () => {
    expect(hidePageField('sections', doc('living-and-care'))).toBe(false);
    expect(hidePageField('sections', doc('our-story'))).toBe(false);
    expect(hidePageField('sections', doc('contact'))).toBe(true);
  });

  it('shows body and last reviewed only where that copy is published', () => {
    expect(hidePageField('body', doc('privacy'))).toBe(false);
    expect(hidePageField('body', doc('our-story'))).toBe(false);
    expect(hidePageField('body', doc('homes'))).toBe(true);
    expect(hidePageField('lastReviewed', doc('terms'))).toBe(false);
    expect(hidePageField('lastReviewed', doc('our-story'))).toBe(true);
  });

  it('shows the home video only on the home page, and every field until a slug exists', () => {
    expect(hidePageField('heroVideo', doc('home'))).toBe(false);
    expect(hidePageField('heroVideo', doc('homes'))).toBe(true);
    expect(hidePageField('sections', undefined)).toBe(false);
    expect(hidePageField('body', doc())).toBe(false);
  });
});