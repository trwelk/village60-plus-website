/** Attach an uploaded Sanity asset to each mediaImage and drop the seed-only key. */
export function attachAssets<T>(value: T, assets: Map<string, string>): T {
  if (Array.isArray(value)) return value.map((item) => attachAssets(item, assets)) as T;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const next: Record<string, unknown> = {};
    for (const [field, fieldValue] of Object.entries(record)) {
      if (fieldValue !== undefined && field !== 'seedPhoto') next[field] = attachAssets(fieldValue, assets);
    }
    if (record._type === 'mediaImage') {
      const photoKey = record.seedPhoto;
      if (typeof photoKey !== 'string' || !assets.has(photoKey)) {
        throw new Error(`No uploaded asset for image "${String(photoKey)}"`);
      }
      next.asset = { _type: 'reference', _ref: assets.get(photoKey) };
    }
    return next as T;
  }
  return value;
}
