import { createClient } from 'next-sanity';
import { getPublicEnv } from '@/lib/env';

export const apiVersion = '2026-02-01';

const { sanityProjectId, sanityDataset } = getPublicEnv();

const token = process.env.SANITY_API_READ_TOKEN;

export const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion,
  useCdn: !token,
  perspective: 'published',
  token,
});
