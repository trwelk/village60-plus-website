import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type LimitResult = { success: boolean; limit: number; remaining: number; reset: number };

export function createMemoryLimiter(max: number, windowMs: number, now: () => number = Date.now) {
  const hits = new Map<string, number[]>();
  return {
    async limit(id: string): Promise<LimitResult> {
      const time = now();
      const recent = (hits.get(id) ?? []).filter((stamp) => time - stamp < windowMs);
      recent.push(time);
      hits.set(id, recent);
      return { success: recent.length <= max, limit: max, remaining: Math.max(0, max - recent.length), reset: time + windowMs };
    },
  };
}

const WINDOW = '10 m';
const MAX = 5;

let singleton: { limit: (id: string) => Promise<LimitResult> } | null = null;

/** 5 per 10 minutes. Upstash when configured; in-memory otherwise (single server only). */
export function getEnquiryLimiter(): { limit: (id: string) => Promise<LimitResult> } {
  if (singleton) return singleton;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    singleton = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX, WINDOW),
      analytics: false,
      prefix: 'village60:enquiry',
    });
  } else {
    singleton = createMemoryLimiter(MAX, 10 * 60 * 1000);
  }
  return singleton;
}
