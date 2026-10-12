import { describe, expect, it } from 'vitest';
import { createMemoryLimiter } from './rate-limit';

describe('createMemoryLimiter', () => {
  it('allows up to the limit inside the window and then blocks', async () => {
    let now = 1_000;
    const limiter = createMemoryLimiter(2, 10_000, () => now);
    expect((await limiter.limit('1.2.3.4')).success).toBe(true);
    expect((await limiter.limit('1.2.3.4')).success).toBe(true);
    expect((await limiter.limit('1.2.3.4')).success).toBe(false);
    now += 10_001;
    expect((await limiter.limit('1.2.3.4')).success).toBe(true);
  });

  it('counts identifiers separately', async () => {
    const limiter = createMemoryLimiter(1, 10_000, () => 0);
    expect((await limiter.limit('a')).success).toBe(true);
    expect((await limiter.limit('b')).success).toBe(true);
    expect((await limiter.limit('a')).success).toBe(false);
  });
});
