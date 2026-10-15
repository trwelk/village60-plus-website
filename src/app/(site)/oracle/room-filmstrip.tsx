'use client';

import { useRef } from 'react';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';

export type FilmstripRoom = {
  key: string;
  name: string;
  facts: string[];
  image?: CmsImage | null;
};

function scrollStep(direction: -1 | 1, scroller: HTMLUListElement) {
  const card = scroller.querySelector('li');
  const gap = 12;
  const amount = (card?.getBoundingClientRect().width ?? 220) + gap;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scroller.scrollBy({ left: direction * amount, behavior: reduce ? 'auto' : 'smooth' });
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: -1 | 1;
  onClick: () => void;
}) {
  const previous = direction < 0;
  return (
    <button
      type="button"
      aria-label={previous ? 'Previous rooms' : 'Next rooms'}
      onClick={onClick}
      className="relative top-[-0.85rem] inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-stone bg-paper text-charcoal transition-colors duration-(--duration-fast) hover:border-charcoal"
    >
      <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d={previous ? 'M12 4 6 10l6 6' : 'M8 4l6 6-6 6'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function RoomFilmstrip({ rooms }: { rooms: FilmstripRoom[] }) {
  const scroller = useRef<HTMLUListElement>(null);
  if (rooms.length === 0) return null;
  const moving = rooms.length > 1;

  return (
    <div id="oracle-room-strip" className="flex items-center gap-3 sm:gap-4">
      {moving ? <ArrowButton direction={-1} onClick={() => scroller.current && scrollStep(-1, scroller.current)} /> : null}
      <ul
        ref={scroller}
        aria-label="Rooms"
        className="flex min-w-0 flex-1 gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {rooms.map((room) => (
          <li key={room.key} className="w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-[calc((100%-3rem)/5)]">
            <div className="relative aspect-[16/10] bg-sand">
              {room.image ? (
                <SanityImage image={room.image} width={480} height={300} sizes="(min-width: 1200px) 18vw, 70vw" cover className="absolute inset-0" />
              ) : null}
            </div>
            <p className="mt-3 text-center text-[11px] font-semibold tracking-[0.2em] text-charcoal uppercase">{room.name}</p>
            {room.facts.length > 0 ? <p className="mt-1 text-center text-[13px] leading-snug text-bronze">{room.facts.join(' · ')}</p> : null}
          </li>
        ))}
      </ul>
      {moving ? <ArrowButton direction={1} onClick={() => scroller.current && scrollStep(1, scroller.current)} /> : null}
    </div>
  );
}
