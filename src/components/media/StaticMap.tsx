'use client';

import { useState } from 'react';
import { addressLines, directionsHref, embedMapUrl, mapPoint, staticMapUrl, type MapAddress } from '@/lib/maps';

export function StaticMap({
  address,
  mapsKey,
  label,
}: {
  address: MapAddress | null | undefined;
  mapsKey: string | null;
  label: string;
}) {
  const [active, setActive] = useState(false);
  const lines = addressLines(address);
  const directions = directionsHref(address);
  const point = mapPoint(address);
  const landmarks = (address?.landmarks ?? []).filter((item): item is string => Boolean(item));
  if (lines.length === 0 && !directions) return null;

  const canMap = Boolean(point && mapsKey);

  return (
    <div className="flex flex-col gap-4">
      {lines.length > 0 && <p className="whitespace-pre-line">{lines.join('\n')}</p>}
      {landmarks.length > 0 && <p>Nearby: {landmarks.join(', ')}</p>}
      {address?.visitingNotes && <p className="max-w-prose-site">{address.visitingNotes}</p>}
      {directions && (
        <a href={directions} className="font-semibold text-green underline underline-offset-4" target="_blank" rel="noopener noreferrer">
          Get directions
        </a>
      )}
      {canMap && point && mapsKey && !active && (
        <button type="button" className="block max-w-full text-left" onClick={() => setActive(true)}>
          <img
            src={staticMapUrl(point, { width: 640, height: 400, key: mapsKey })}
            alt=""
            width={640}
            height={400}
            className="h-auto w-full rounded-card border border-stone"
          />
          <span className="mt-2 inline-flex min-h-11 items-center font-semibold text-green underline underline-offset-4">
            Load interactive map
          </span>
        </button>
      )}
      {canMap && point && mapsKey && active && (
        <iframe
          title={`Map of ${label}`}
          src={embedMapUrl(point, mapsKey)}
          width={640}
          height={400}
          loading="lazy"
          className="h-auto min-h-[400px] w-full rounded-card border border-stone"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
}
