/**
 * Environment access. Public values are read with literal `process.env.NEXT_PUBLIC_*`
 * references so Next.js can inline them; server values are lazy getters so importing
 * this module (e.g. in Vitest) never throws — only reading a missing secret does.
 */
export function requireEnv(name: string, value: string | undefined = process.env[name]): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getPublicEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    sanityProjectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
    sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
    gaId: process.env.NEXT_PUBLIC_GA_ID || null,
    mapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || null,
  };
}

export function getServerEnv() {
  return {
    get sanityReadToken() {
      return requireEnv('SANITY_API_READ_TOKEN');
    },
    get previewSecret() {
      return requireEnv('SANITY_PREVIEW_SECRET');
    },
    get revalidateSecret() {
      return requireEnv('SANITY_REVALIDATE_SECRET');
    },
    get resendApiKey() {
      return requireEnv('RESEND_API_KEY');
    },
    get emailFrom() {
      return requireEnv('EMAIL_FROM');
    },
    get fallbackRecipient() {
      return requireEnv('FORM_FALLBACK_RECIPIENT');
    },
    get upstashUrl() {
      return process.env.UPSTASH_REDIS_REST_URL || null;
    },
    get upstashToken() {
      return process.env.UPSTASH_REDIS_REST_TOKEN || null;
    },
  };
}
