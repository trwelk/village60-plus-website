import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { PALETTE } from './palette';

describe('Verandah palette contrast (WCAG 2.2 AA)', () => {
  it('body text on light surfaces is at least 4.5:1', () => {
    expect(contrastRatio(PALETTE.charcoal, PALETTE.ivory)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.charcoal, PALETTE.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.charcoal, PALETTE.sand)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.bronze, PALETTE.ivory)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.leaf, PALETTE.ivory)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.error, PALETTE.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it('text on dark surfaces is at least 4.5:1', () => {
    expect(contrastRatio(PALETTE.ivory, PALETTE.green)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.paleGold, PALETTE.green)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.ivory, PALETTE.night)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.paleGold, PALETTE.night)).toBeGreaterThanOrEqual(4.5);
  });

  it('documents why antique gold is decorative only', () => {
    // Spec rule: never gold body/small text on ivory. Bronze is the text-safe gold.
    expect(contrastRatio(PALETTE.gold, PALETTE.ivory)).toBeLessThan(4.5);
  });

  it('computes the canonical black/white ratio', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
  });
});
