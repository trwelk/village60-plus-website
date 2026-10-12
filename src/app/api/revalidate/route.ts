import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/env';
import { tagsForWebhook, type WebhookBody } from '@/lib/revalidation';

export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(request, getServerEnv().revalidateSecret);
    if (!isValidSignature) return new NextResponse('Invalid signature', { status: 401 });
    if (!body?._type) return new NextResponse('Bad request', { status: 400 });

    const tags = tagsForWebhook(body);
    for (const tag of tags) revalidateTag(tag, 'max');
    return NextResponse.json({ revalidated: true, tags });
  } catch (error) {
    // Non-sensitive: the payload is never logged.
    console.error('revalidate webhook failed:', error instanceof Error ? error.message : 'unknown error');
    return new NextResponse('Revalidation failed', { status: 500 });
  }
}
