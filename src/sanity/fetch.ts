import type { ClientReturn, QueryParams } from 'next-sanity';
import { draftMode } from 'next/headers';
import { getServerEnv } from '@/lib/env';
import { client } from './client';

export const DEFAULT_REVALIDATE = 3600;

type FetchOptions = {
  params?: QueryParams;
  /** Cache tags — see `docTag()` in `src/lib/revalidation.ts` for the convention. */
  tags?: string[];
  revalidate?: number | false;
};

/**
 * Request-scoped fetch for pages, layouts and generateMetadata. When Next.js draft mode
 * is on (via /api/draft-mode/enable) it reads drafts with the server read token and bypasses
 * the cache; otherwise it reads published content through the CDN with ISR tags.
 * Must not be called from generateStaticParams or sitemap.ts — use fetchPublished there.
 */
export async function sanityFetch<const Q extends string>(
  query: Q,
  { params = {}, tags = [], revalidate = DEFAULT_REVALIDATE }: FetchOptions = {},
): Promise<ClientReturn<Q>> {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return client.fetch(query, params, {
      perspective: 'drafts',
      useCdn: false,
      token: getServerEnv().sanityReadToken,
      next: { revalidate: 0 },
    });
  }
  return client.fetch(query, params, { perspective: 'published', useCdn: true, next: { revalidate, tags } });
}

/** Published content only; safe outside a request scope. A failed request renders the empty state instead of throwing. */
export async function fetchPublished<const Q extends string>(query: Q, params: QueryParams = {}, tags: string[] = []): Promise<ClientReturn<Q> | null> {
  try {
    return await client.fetch(query, params, { perspective: 'published', useCdn: true, next: { revalidate: DEFAULT_REVALIDATE, tags } });
  } catch (error: unknown) {
    console.error('Published Sanity fetch failed', error instanceof Error ? error.name : 'Error');
    return null;
  }
}
