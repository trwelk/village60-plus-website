'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { addressLines, directionsHref, embedMapUrl, mapPoint, staticMapUrl, type MapAddress } from '@/lib/maps';

export function StaticMap({
  address,
  mapsKey,
  label,
  directionsLabel = 'Get directions',
  expand = false,
  className,
}: {
  address: MapAddress | null | undefined;
  mapsKey: string | null;
  label: string;
  directionsLabel?: string;
  /** Let the address card use the full content width when there is no map. */
  expand?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const lines = addressLines(address);
  const directions = directionsHref(address);
  const point = mapPoint(address);
  const landmarks = (address?.landmarks ?? []).filter((item): item is string => Boolean(item));
  if (lines.length === 0 && !directions) return null;

  const canMap = Boolean(point && mapsKey);

  const map = canMap && point && mapsKey && !active ? (
    <button type="button" className="block w-full text-left" onClick={() => setActive(true)}>
      <img
        src={staticMapUrl(point, { width: 640, height: 400, key: mapsKey })}
        alt=""
        width={640}
        height={400}
        className="h-auto w-full rounded-panel border border-stone"
      />
      <span className="mt-3 inline-flex min-h-11 items-center font-semibold text-green underline decoration-gold underline-offset-4 hover:decoration-green">
        Load interactive map
      </span>
    </button>
  ) : null;

  const embed = canMap && point && mapsKey && active ? (
    <iframe
      title={`Map of ${label}`}
      src={embedMapUrl(point, mapsKey)}
      width={640}
      height={400}
      loading="lazy"
      className="h-auto min-h-[400px] w-full rounded-panel border border-stone"
      referrerPolicy="no-referrer-when-downgrade"
    />
  ) : null;

  const spread = expand && !canMap;

  return (
    <div className={cn(canMap ? 'grid items-stretch gap-6 lg:grid-cols-2 lg:gap-10' : spread ? '' : 'max-w-xl', className)}>
      <div className={cn('flex h-full flex-col gap-5 rounded-panel border border-stone bg-paper p-6 md:p-8', spread && 'md:flex-row md:items-center md:justify-between md:gap-10')}>
        <div className="flex max-w-prose-site flex-col gap-4">
          {lines.length > 0 && <address className="whitespace-pre-line not-italic text-[18px] leading-relaxed">{lines.join('\n')}</address>}
          {landmarks.length > 0 && <p>Nearby: {landmarks.join(', ')}</p>}
          {address?.visitingNotes && <p className={expand ? 'border-l-2 border-gold pl-4' : undefined}>{address.visitingNotes}</p>}
        </div>
        {directions ? (
          <Button href={directions} variant="secondary" className={cn('shrink-0 self-start', canMap && 'mt-auto')} target="_blank" rel="noopener noreferrer" data-track="directions_click">
            {directionsLabel}
          </Button>
        ) : null}
      </div>
      {map}
      {embed}
    </div>
  );
}
