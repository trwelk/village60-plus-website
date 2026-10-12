import { describe, expect, it } from 'vitest';
import { CONTENT_STATUSES } from '../../lib/content-status';
import { statusField } from './fields';

describe('statusField', () => {
  it('offers exactly the six spec labels, in spec order, with no default', () => {
    const field = statusField();
    expect(field.name).toBe('status');
    expect(field.options?.list).toEqual(CONTENT_STATUSES.map((s) => ({ title: s.label, value: s.value })));
    expect((field as { initialValue?: unknown }).initialValue).toBeUndefined();
  });

  it('can be made optional for secondary content blocks', () => {
    expect(statusField({ required: false }).validation).toBeUndefined();
  });
});
