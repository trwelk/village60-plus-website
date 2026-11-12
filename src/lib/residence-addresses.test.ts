import { describe, expect, it } from 'vitest';
import { verifiedResidenceAddress } from './residence-addresses';

describe('verifiedResidenceAddress', () => {
  it('replaces placeholder CMS lines with verified street addresses', () => {
    expect(verifiedResidenceAddress('serenity', { line1: 'Railway Avenue', country: 'Sri Lanka' })).toMatchObject({
      line1: '32/10, Railway Avenue',
      city: 'Nugegoda',
    });
    expect(verifiedResidenceAddress('house-on-the-hill', { line1: 'Kirulapone, Colombo', city: 'Colombo' })).toMatchObject({
      line1: '235/15, Wijaya Kumaratunga Mawatha',
      line2: 'Polhengoda',
      city: 'Kirulapone',
    });
    expect(verifiedResidenceAddress('enchanted-fields', { line1: 'Homagama' })).toMatchObject({
      line1: '7th Lane, Kulasiri Kumarage Mawatha',
      city: 'Homagama',
    });
  });

  it('keeps CMS visiting notes when present', () => {
    expect(
      verifiedResidenceAddress('serenity', {
        line1: 'Railway Avenue',
        visitingNotes: 'Ring the bell first.',
      })?.visitingNotes,
    ).toBe('Ring the bell first.');
  });
});
