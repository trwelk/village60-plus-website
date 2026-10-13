/**
 * Static response headers (spec §15).
 *
 * Content-Security-Policy is static on purpose. A nonce (and the proxy.ts that would
 * attach it) makes Next.js render pages dynamically, which fights the static marketing
 * pages. 'unsafe-inline' is the trade-off that keeps pages static.
 *
 * Studio is served on this origin at /studio, so the policy allows the Sanity hosts and
 * 'unsafe-eval' the Studio bundle needs. X-Frame-Options stays SAMEORIGIN for that reason.
 *
 * img-src always allows https://cdn.sanity.io and https://maps.googleapis.com.
 * GA script and connect hosts are appended only when NEXT_PUBLIC_GA_ID is set at build.
 */

const BASE_SCRIPT = ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://core.sanity.io'];
const BASE_IMG = ["'self'", 'data:', 'blob:', 'https://cdn.sanity.io', 'https://maps.googleapis.com', 'https://maps.gstatic.com'];
const BASE_CONNECT = ["'self'", 'https://*.sanity.io', 'wss://*.sanity.io'];
const BASE_FRAME = ["'self'", 'https://www.google.com'];

export function contentSecurityPolicy(gaId: string | null | undefined): string {
  const script = [...BASE_SCRIPT];
  const img = [...BASE_IMG];
  const connect = [...BASE_CONNECT];
  if (gaId) {
    script.push('https://www.googletagmanager.com');
    img.push('https://www.google-analytics.com');
    connect.push(
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://www.googletagmanager.com',
    );
  }
  return [
    "default-src 'self'",
    `script-src ${script.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${img.join(' ')}`,
    "font-src 'self'",
    `connect-src ${connect.join(' ')}`,
    `frame-src ${BASE_FRAME.join(' ')}`,
    "media-src 'self' https://cdn.sanity.io",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; ');
}

export function securityHeaders(gaId: string | null | undefined): Array<{ key: string; value: string }> {
  return [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Content-Security-Policy', value: contentSecurityPolicy(gaId) },
  ];
}
