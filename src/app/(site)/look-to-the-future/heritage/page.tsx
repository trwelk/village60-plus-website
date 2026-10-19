import type { Metadata } from 'next';
import { Great_Vibes } from 'next/font/google';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { HeritageView } from './view';

const script = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heritage-script',
});

const PATH = '/look-to-the-future/heritage';
const TITLE = 'The Heritage';
const INTRO =
  'The Heritage by Village 60 Plus is a luxury retirement and wellness destination on the historic Keunaman Bungalow Estate in Matara, opening in 2027.';

export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl } = getPublicEnv();
  return pageMetadata({
    siteUrl,
    path: PATH,
    fallbackTitle: TITLE,
    fallbackDescription: INTRO,
  });
}

export default async function HeritagePage() {
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
      <HeritageView scriptFontClassName={script.variable} />
    </>
  );
}
