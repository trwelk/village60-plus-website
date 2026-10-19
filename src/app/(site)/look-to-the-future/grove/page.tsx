import type { Metadata } from 'next';
import { Great_Vibes } from 'next/font/google';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { GroveView } from './view';

const script = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-grove-script',
});

const PATH = '/look-to-the-future/grove';
const TITLE = 'The Grove';
const INTRO =
  'The Grove by Village 60 Plus is a purpose-built home in Kottawa: two buildings, forty private rooms, and a connected community set in landscaped surroundings.';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl } = getPublicEnv();
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: TITLE,
    fallbackDescription: INTRO,
  });
}

export default async function GrovePage() {
  const { siteUrl } = getPublicEnv();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(siteUrl, [
          { label: 'Home', href: '/' },
          { label: 'Look to the Future', href: '/look-to-the-future' },
          { label: TITLE, href: PATH },
        ])}
      />
      <GroveView scriptFontClassName={script.variable} />
    </>
  );
}
