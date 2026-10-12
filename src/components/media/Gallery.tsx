'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { SanityImage, type CmsImage } from './SanityImage';

export type GalleryImage = CmsImage & { _key?: string | null };

function usable(images: Array<GalleryImage | null> | null | undefined): GalleryImage[] {
  return (images ?? []).filter((image): image is GalleryImage => Boolean(image?.asset?.url && image.alt?.trim()));
}

export function Gallery({ images, label }: { images: Array<GalleryImage | null> | null | undefined; label: string }) {
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

  return (
    <section aria-label={label} className="flex flex-col gap-4">
      {items.length > 1 && (
        <div className="flex gap-2">
          <Button variant="secondary" aria-label="Previous photograph" onClick={() => move(-1)}>
            Previous
          </Button>
          <Button variant="secondary" aria-label="Next photograph" onClick={() => move(1)}>
            Next
          </Button>
        </div>
      )}
      <ul ref={scroller} className="flex snap-x snap-mandatory gap-4 overflow-x-auto">
        {items.map((image, index) => (
          <li key={image._key ?? `${image.alt}-${index}`} className="w-[85%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]">
            <SanityImage image={image} width={640} sizes="(min-width: 1200px) 400px, 85vw" showCaption />
          </li>
        ))}
      </ul>
    </section>
  );
}
