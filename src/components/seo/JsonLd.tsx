import { serializeJsonLd, type JsonLd as JsonLdData } from '@/lib/seo';

export function JsonLd({ data }: { data: Array<JsonLdData | null | undefined> | JsonLdData }) {
  const items = (Array.isArray(data) ? data : [data]).filter((item): item is JsonLdData => Boolean(item));
  if (items.length === 0) return null;
  return (
    <>
      {items.map((item) => (
        <script key={serializeJsonLd(item)} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }} />
      ))}
    </>
  );
}
