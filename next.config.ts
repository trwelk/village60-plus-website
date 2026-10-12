import type { NextConfig } from "next";
import { ORACLE_HOMES_REDIRECT } from './src/lib/routes';

const nextConfig: NextConfig = {
  async redirects() {
    return [ORACLE_HOMES_REDIRECT];
  },
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
