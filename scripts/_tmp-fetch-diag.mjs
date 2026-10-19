import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development';
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-02-01',
  useCdn: true,
  perspective: 'published',
});
const started = Date.now();
console.log('start', JSON.stringify({ node: process.version, execArgv: process.execArgv, projectSet: Boolean(projectId), dataset }));
try {
  const data = await client.fetch('*[_type=="siteSettings"][0]{_id}');
  console.log('ok', JSON.stringify({ ms: Date.now() - started, id: data && data._id ? 'set' : 'empty' }));
} catch (error) {
  const cause = error instanceof Error ? error.cause : undefined;
  console.log(
    'fail',
    JSON.stringify({
      name: error instanceof Error ? error.name : 'Error',
      message: error instanceof Error ? error.message : String(error),
      code: cause && typeof cause === 'object' && 'code' in cause ? cause.code : undefined,
      cause: cause instanceof Error ? cause.message : undefined,
      ms: Date.now() - started,
    }),
  );
}
