import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { breadcrumbJsonLd } from '@/lib/seo';
import { offeringMetadata } from '../offering-route';
import { SilverRootsView } from './view';

export function generateMetadata() {
  return offeringMetadata('silver-roots');
}

export default function SilverRootsPage() {
  const { siteUrl } = getPublicEnv();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(siteUrl, [
          { label: 'Home', href: '/' },
          { label: 'Silver Roots', href: '/silver-roots' },
        ])}
      />
      <SilverRootsView />
    </>
  );
}
