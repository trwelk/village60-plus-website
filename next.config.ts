import type { NextConfig } from 'next';
import { ORACLE_HOMES_REDIRECT } from './src/lib/routes';
import { securityHeaders } from './src/lib/security-headers';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async redirects() {
    return [ORACLE_HOMES_REDIRECT];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders(process.env.NEXT_PUBLIC_GA_ID) }];
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
