'use client';

import { useMemo, useState } from 'react';
import { ResidenceCard, type ResidenceCardData } from '@/components/content/ResidenceCard';
import { CONTENT_STATUSES } from '@/lib/content-status';

export function HomeFilter({ residences }: { residences: ResidenceCardData[] }) {
  const [location, setLocation] = useState('');
  const [care, setCare] = useState('');
  const [status, setStatus] = useState('');

  const careOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const residence of residences) {
      for (const item of residence.careTypes ?? []) {
        if (item?.slug && item.name) seen.set(item.slug, item.name);
      }
    }
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
  }, [residences]);

  const shown = residences.filter((residence) => {
    const query = location.trim().toLowerCase();
    if (query && !(residence.shortLocation ?? '').toLowerCase().includes(query)) return false;
    if (care && !(residence.careTypes ?? []).some((item) => item?.slug === care)) return false;
    if (status && residence.status !== status) return false;
    return true;
  });

  return (
    <div>
      <form className="grid gap-4 md:grid-cols-3" aria-label="Filter homes">
        <label className="flex flex-col gap-1.5 font-semibold">
          Location
          <input value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-input border border-stone bg-paper px-3 py-2.5 font-normal" />
        </label>
        <label className="flex flex-col gap-1.5 font-semibold">
          Care type
          <select value={care} onChange={(event) => setCare(event.target.value)} className="min-h-11 rounded-input border border-stone bg-paper px-3 py-2.5 font-normal">
            <option value="">Any care type</option>
            {careOptions.map((option) => (
              <option key={option.slug} value={option.slug}>{option.name}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 font-semibold">
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 rounded-input border border-stone bg-paper px-3 py-2.5 font-normal">
            <option value="">Any status</option>
            {CONTENT_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </form>
      {shown.length === 0 ? (
        <p className="mt-8">No homes match those filters.</p>
      ) : (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((residence) => (
            <li key={residence._id}><ResidenceCard residence={residence} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
