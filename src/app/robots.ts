import type { MetadataRoute } from 'next';
import { getPublicEnv } from '@/lib/env';
import { robotsConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return robotsConfig(getPublicEnv().siteUrl);
}
