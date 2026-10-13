import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy, securityHeaders } from './security-headers';

function header(gaId: string | null, key: string): string {
  const found = securityHeaders(gaId).find((item) => item.key === key);
  if (!found) throw new Error(`missing ${key}`);
  return found.value;
}

describe('security headers', () => {
  it('sets the static headers from spec §15', () => {
    expect(header(null, 'Strict-Transport-Security')).toBe('max-age=63072000; includeSubDomains; preload');
    expect(header(null, 'X-Content-Type-Options')).toBe('nosniff');
    expect(header(null, 'Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(header(null, 'X-Frame-Options')).toBe('SAMEORIGIN');
    expect(header(null, 'Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()');
  });

  it('allows the site, Sanity images and Google map images, and omits GA when no id is set', () => {
    const csp = contentSecurityPolicy(null);
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain('https://cdn.sanity.io');
    expect(csp).toContain('https://maps.googleapis.com');
    expect(csp).not.toContain('googletagmanager');
    expect(csp).not.toContain('google-analytics');
    expect(header(null, 'Content-Security-Policy')).toBe(csp);
  });

  it('adds GA hosts only when a measurement id is part of the build', () => {
    const csp = contentSecurityPolicy('G-TEST');
    expect(csp).toContain('https://www.googletagmanager.com');
    expect(csp).toContain('https://www.google-analytics.com');
    expect(csp).toContain('https://*.google-analytics.com');
  });
});
