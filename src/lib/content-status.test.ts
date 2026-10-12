import { describe, expect, it } from 'vitest';
import { CONTENT_STATUSES, isContentStatus, isFuture, isOperating, statusLabel } from './content-status';

describe('content status', () => {
  it('exposes the six spec labels verbatim', () => {
    expect(CONTENT_STATUSES.map((s) => s.label)).toEqual([
      'Available now',
      'Limited availability',
      'Pilot',
      'Coming soon',
      'In development',
      'Planned',
    ]);
  });
  it('maps values to labels', () => {
    expect(statusLabel('coming-soon')).toBe('Coming soon');
  });
  it('recognises only the six spec values', () => {
    expect(isContentStatus('coming-soon')).toBe(true);
    expect(isContentStatus('open')).toBe(false);
    expect(isContentStatus(null)).toBe(false);
  });
  it('classifies operating vs future statuses', () => {
    expect(isOperating('available')).toBe(true);
    expect(isOperating('limited')).toBe(true);
    expect(isOperating('pilot')).toBe(false);
    expect(isFuture('coming-soon')).toBe(true);
    expect(isFuture('in-development')).toBe(true);
    expect(isFuture('planned')).toBe(true);
    expect(isFuture('available')).toBe(false);
  });
});
