'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { SanityImage, type CmsImage } from './SanityImage';

export type GalleryImage = CmsImage & { _key?: string | null };

function usable(images: Array<GalleryImage | null> | null | undefined): GalleryImage[] {
  return (images ?? []).filter((image): image is GalleryImage => Boolean(image?.asset?.url && image.alt?.trim()));
}

function slideWidth(count: number): string {
  if (count === 1) return 'w-full max-w-3xl';
  if (count === 2) return 'w-[85%] sm:w-[calc(50%-0.5rem)]';
  return 'w-[85%] sm:w-[48%] lg:w-[32%]';
}

export function Gallery({
  images,
  label,
  title,
  titleId,
}: {
  images: Array<GalleryImage | null> | null | undefined;
  label: string;
  title?: string;
  titleId?: string;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const items = usable(images);
  if (items.length === 0) return null;

  function move(direction: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const item = el.querySelector('li');
    const delta = (item?.clientWidth || el.clientWidth) + 16;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    el.scrollBy({ left: direction * delta, behavior: reduce ? 'auto' : 'smooth' });
  }

  const controls = items.length > 1;

  return (
    <section aria-label={label} className="flex flex-col gap-6">
      {title || controls ? (
        <div className="flex flex-wrap items-end justify-between gap-4">
          {title ? (
            <h2 id={titleId} className="max-w-prose-site">
              {title}
            </h2>
          ) : null}
          {controls ? (
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" aria-label="Previous photograph" onClick={() => move(-1)}>
                Previous
              </Button>
              <Button variant="secondary" aria-label="Next photograph" onClick={() => move(1)}>
                Next
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      <ul ref={scroller} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1">
        {items.map((image, index) => (
          <li key={image._key ?? `${image.alt}-${index}`} className={cn('shrink-0 snap-start', slideWidth(items.length))}>
            <figure className="flex flex-col gap-2">
              <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-sand">
                <SanityImage image={image} width={960} height={640} sizes="(min-width: 1200px) 420px, 85vw" cover className="absolute inset-0" />
              </div>
              {image.caption ? <figcaption className="text-[14px] leading-snug text-bronze">{image.caption}</figcaption> : null}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
