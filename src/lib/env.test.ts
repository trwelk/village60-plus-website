import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublicEnv, getServerEnv, requireEnv } from './env';

describe('env', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('requireEnv throws an error that names the missing variable', () => {
    expect(() => requireEnv('MISSING_VAR', undefined)).toThrow('MISSING_VAR');
    expect(() => requireEnv('EMPTY_VAR', '')).toThrow('EMPTY_VAR');
  });

  it('requireEnv returns the value when present', () => {
    expect(requireEnv('X', 'abc')).toBe('abc');
  });

  it('getPublicEnv falls back to localhost for the site URL and development for the dataset', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '');
    const env = getPublicEnv();
    expect(env.siteUrl).toBe('http://localhost:3000');
    expect(env.sanityDataset).toBe('development');
    expect(env.sanityProjectId).toBe('testproject'); // set in vitest.setup.ts
  });

  it('Search Console verification is optional', () => {
    vi.stubEnv('NEXT_PUBLIC_GSC_VERIFICATION', '');
    expect(getPublicEnv().gscVerification).toBeNull();
    vi.stubEnv('NEXT_PUBLIC_GSC_VERIFICATION', 'abc123');
    expect(getPublicEnv().gscVerification).toBe('abc123');
  });

  it('getServerEnv is lazy: constructing it never throws, reading a missing secret does', () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const server = getServerEnv();
    expect(() => server.resendApiKey).toThrow('RESEND_API_KEY');
    expect(server.upstashUrl).toBeNull(); // optional, never throws
  });
});
