'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { addressLines, directionsHref, embedMapUrl, mapPoint, pinEmbedUrl, staticMapUrl, type MapAddress } from '@/lib/maps';

export function StaticMap({
  address,
  mapsKey,
  label,
  directionsLabel = 'Get directions',
  expand = false,
  layout = 'split',
  title,
  titleHref,
  className,
}: {
  address: MapAddress | null | undefined;
  mapsKey: string | null;
  label: string;
  directionsLabel?: string;
  /** Let the address card use the full content width when there is no map. */
  expand?: boolean;
  /** `place` is a stacked card: landscape map, then the address. Use it in a grid. */
  layout?: 'split' | 'place';
  title?: string;
  titleHref?: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const lines = addressLines(address);
  const directions = directionsHref(address);
  const point = mapPoint(address);
  const landmarks = (address?.landmarks ?? []).filter((item): item is string => Boolean(item));
  if (lines.length === 0 && !directions) return null;

  const canMap = Boolean(point);
  const embedSrc = point ? (mapsKey ? embedMapUrl(point, mapsKey) : pinEmbedUrl(point)) : null;
  const showStatic = Boolean(canMap && point && mapsKey && !active);
  const showEmbed = Boolean(canMap && embedSrc && (active || !mapsKey));
  const place = layout === 'place';

  const frameClass = cn('overflow-hidden bg-sand', place ? 'absolute inset-0 size-full' : 'relative aspect-[8/5] w-full rounded-panel');

  const map = showStatic && point && mapsKey ? (
    <button type="button" className={cn(frameClass, 'block text-left outline-offset-[-6px]')} onClick={() => setActive(true)}>
      <img
        src={staticMapUrl(point, { width: 640, height: 400, key: mapsKey })}
        alt=""
        width={640}
        height={400}
        className="absolute inset-0 size-full object-cover"
      />
      <span className="absolute top-3 left-3 inline-flex min-h-11 items-center rounded-full bg-paper px-4 font-semibold text-green shadow-panel">
        Load interactive map
      </span>
    </button>
  ) : null;

  const embed = showEmbed && embedSrc ? (
    <div className={frameClass}>
      <iframe
        title={`Map of ${label}`}
        src={embedSrc}
        width={640}
        height={400}
        loading="lazy"
        className="absolute inset-0 size-full border-0"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  ) : null;

  const media = map ?? embed;

  const directionsLink = directions ? (
    <Button
      href={directions}
      variant="secondary"
      className={cn('shrink-0', place ? 'self-start sm:self-center' : 'self-start', !place && canMap && 'mt-auto')}
      target="_blank"
      rel="noopener noreferrer"
      data-track="directions_click"
      aria-label={place ? directionsLabel : undefined}
    >
      {place ? 'Directions' : directionsLabel}
    </Button>
  ) : null;

  const notes = address?.visitingNotes ? (
    <p className={expand || place ? 'border-l-2 border-gold pl-4 text-[16px] leading-relaxed' : undefined}>{address.visitingNotes}</p>
  ) : null;

  const addressCopy = (
    <>
      {lines.length > 0 && <address className="whitespace-pre-line not-italic text-[18px] leading-relaxed">{lines.join('\n')}</address>}
      {landmarks.length > 0 && <p>Nearby: {landmarks.join(', ')}</p>}
      {notes}
    </>
  );

  if (place) {
    return (
      <div className={cn('flex h-full flex-col', media && 'sm:grid sm:grid-cols-[minmax(15rem,22rem)_minmax(0,1fr)]', className)}>
        {media ? <div className="relative aspect-[8/5] sm:aspect-auto sm:min-h-60">{media}</div> : null}
        <div className="flex flex-1 flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-10 sm:px-8 sm:py-8">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {title ? (
              <h3>
                {titleHref ? (
                  <Link href={titleHref} className="text-charcoal underline decoration-gold underline-offset-4 hover:decoration-green">
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </h3>
            ) : null}
            {addressCopy}
          </div>
          {directionsLink}
        </div>
      </div>
    );
  }

  const spread = expand && !canMap;

  return (
    <div className={cn(canMap ? 'grid items-start gap-6 lg:grid-cols-2 lg:gap-10' : spread ? '' : 'max-w-xl', className)}>
      <div className={cn('flex h-full flex-col gap-5 rounded-panel border border-stone bg-paper p-6 md:p-8', spread && 'md:flex-row md:items-center md:justify-between md:gap-10')}>
        <div className="flex max-w-prose-site flex-col gap-4">{addressCopy}</div>
        {directionsLink}
      </div>
      {media}
    </div>
  );
}
