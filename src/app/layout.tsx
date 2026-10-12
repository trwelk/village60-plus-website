import type { Metadata } from 'next';
import { Fraunces, Source_Sans_3 } from 'next/font/google';
import { getPublicEnv } from '@/lib/env';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz'],
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
});

const { siteUrl, gscVerification } = getPublicEnv();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Village 60 Plus', template: '%s | Village 60 Plus' },
  description: 'Homes, care and support for later life in Sri Lanka.',
  verification: gscVerification ? { google: gscVerification } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-LK" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
