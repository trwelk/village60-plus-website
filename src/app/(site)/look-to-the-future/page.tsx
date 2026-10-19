import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { LookToTheFutureView } from './view';

const PATH = '/look-to-the-future';
const TITLE = 'Look to the Future';
const INTRO = 'Two residences still ahead: The Grove in Kottawa, and The Heritage on the Keunaman Bungalow Estate in Matara, coming in 2027.';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl } = getPublicEnv();
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: TITLE,
    fallbackDescription: INTRO,
  });
}

export default async function LookToTheFuturePage() {
  const { siteUrl } = getPublicEnv();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: TITLE, href: PATH }])} />
      <LookToTheFutureView />
    </>
  );
}
