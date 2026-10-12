import { timingSafeEqual } from 'node:crypto';

export type PreviewResolution = { ok: true; redirectTo: string } | { ok: false; status: 400 | 401 };

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Validates `/api/draft-mode/enable?secret=…&slug=/path`. Pure, so the route stays a two-liner. */
export function resolvePreviewRequest(url: URL, expectedSecret: string | undefined): PreviewResolution {
  const provided = url.searchParams.get('secret');
  if (!expectedSecret || !provided || !secretsMatch(provided, expectedSecret)) return { ok: false, status: 401 };
  const slug = url.searchParams.get('slug') ?? '/';
  if (!slug.startsWith('/') || slug.startsWith('//')) return { ok: false, status: 400 };
  return { ok: true, redirectTo: slug };
}
