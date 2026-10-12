import { describe, expect, it } from 'vitest';
import { mailtoHref, telHref, waMeNumber, whatsappHref, whatsappMessage } from './contact';

describe('contact helpers', () => {
  it('builds tel: links from display-formatted numbers', () => {
    expect(telHref('+94 11 250 4838')).toBe('tel:+94112504838');
  });
  it('normalises WhatsApp numbers to digits without + or leading zeros', () => {
    expect(waMeNumber('+94 74 100 3994')).toBe('94741003994');
    expect(waMeNumber('0094741003994')).toBe('94741003994');
  });
  it('prefills a page-specific message', () => {
    expect(whatsappMessage('Oracle')).toBe("Hello Village 60 Plus, I'm enquiring about Oracle.");
  });
  it('builds an official wa.me link with URL-encoded text', () => {
    expect(whatsappHref('+94 74 100 3994', 'Serenity')).toBe(
      "https://wa.me/94741003994?text=Hello%20Village%2060%20Plus%2C%20I'm%20enquiring%20about%20Serenity.",
    );
  });
  it('builds mailto links', () => {
    expect(mailtoHref('hello@village60plus.lk')).toBe('mailto:hello@village60plus.lk');
  });
});
