import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { resolvePreviewRequest } from '@/lib/preview';

export async function GET(request: NextRequest) {
  const result = resolvePreviewRequest(request.nextUrl, process.env.SANITY_PREVIEW_SECRET);
  if (!result.ok) {
    return new Response(result.status === 401 ? 'Invalid preview secret' : 'Invalid slug', { status: result.status });
  }
  (await draftMode()).enable();
  redirect(result.redirectTo);
}
