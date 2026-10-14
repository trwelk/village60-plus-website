'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { SanityImage, type CmsImage } from './SanityImage';

export type GalleryImage = CmsImage & { _key?: string | null };

type UsableImage = GalleryImage & { alt: string };

const CHIP_WINDOW = 8;

function usable(images: Array<GalleryImage | null> | null | undefined): UsableImage[] {
  return (images ?? []).filter((image): image is UsableImage => Boolean(image?.asset?.url && image.alt?.trim()));
}

const CHIP_TRAIL = new Set(['a', 'an', 'the', 'and', 'or', 'with', 'to', 'of', 'in', 'on', 'for', 'from', 'among', 'into', 'over', 'leading', 'open']);

function chipText(image: UsableImage): string {
  const source = (image.caption?.trim() || image.alt.trim()).replace(/\s+/g, ' ');
  if (source.length <= 28) return source;
  const words = source.split(' ');
  const kept = [words[0] ?? source];
  for (let i = 1; i < words.length; i += 1) {
    const next = [...kept, words[i]].join(' ');
    if (next.length > 24) break;
    kept.push(words[i]);
  }
  while (kept.length > 1 && CHIP_TRAIL.has(kept[kept.length - 1].toLowerCase())) kept.pop();
  return kept.join(' ');
}

/** How many steps either side of the active photo stay fully visible. */
const VISIBLE_DEPTH = 2;
/** Neighbour clicks and arrow steps within this distance slide. Further jumps cut. */
const GLIDE_LIMIT = 2;
/** One spare photo beyond a glide, so the next card is already mounted and can slide in. */
const REACH = VISIBLE_DEPTH + GLIDE_LIMIT;
const GLIDE_MS = 560;
const GLIDE_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

function mod(value: number, count: number): number {
  return ((value % count) + count) % count;
}

function shortestDelta(from: number, to: number, count: number): number {
  let delta = to - from;
  delta -= count * Math.round(delta / count);
  return delta;
}

function offsetFor(index: number, position: number, count: number): number {
  const raw = index - position;
  return raw - count * Math.round(raw / count);
}

function scaleFor(offset: number): number {
  const depth = Math.min(Math.abs(offset), VISIBLE_DEPTH);
  if (depth === 0) return 1;
  if (depth === 1) return 0.9;
  return 0.82;
}

type Slot = { offset: number; index: number; key: string };

function slotsFor(count: number, position: number): Slot[] {
  const slots: Slot[] = [];
  for (let index = 0; index < count; index += 1) {
    const offset = offsetFor(index, position, count);
    if (Math.abs(offset) > REACH) continue;
    slots.push({ offset, index, key: String(index) });
  }
  return slots.sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset) || a.index - b.index);
}

function Chevron({ direction }: { direction: -1 | 1 }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d={direction === 1 ? 'M7.5 4.5 13 10l-5.5 5.5' : 'M12.5 4.5 7 10l5.5 5.5'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepButton({ direction, onClick }: { direction: -1 | 1; onClick: () => void }) {
  const next = direction === 1;
  return (
    <button
      type="button"
      aria-label={next ? 'Next photograph' : 'Previous photograph'}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-charcoal/70 text-charcoal transition-colors duration-(--duration-fast) hover:border-green hover:text-green"
    >
      <Chevron direction={direction} />
    </button>
  );
}

export function Gallery({
  images,
  label,
  title,
  titleId,
  intro,
}: {
  images: Array<GalleryImage | null> | null | undefined;
  label: string;
  title?: string;
  titleId?: string;
  intro?: string;
}) {
  const items = usable(images);
  const [position, setPosition] = useState(0);
  const [snap, setSnap] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const positionRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const previous = useRef<{ position: number; offsets: Map<string, number> }>({ position: 0, offsets: new Map() });
  const activeChip = useRef<HTMLButtonElement>(null);

  const count = items.length;
  const currentIndex = count === 0 ? 0 : mod(position, count);
  const current = items[currentIndex];
  const many = count > 1;
  const slots = many ? slotsFor(count, position) : [{ offset: 0, index: 0, key: 'only' }];

  useEffect(() => {
    if (!snap) return;
    const id = requestAnimationFrame(() => setSnap(false));
    return () => cancelAnimationFrame(id);
  }, [snap, position]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const cards = [...stage.querySelectorAll<HTMLElement>('[data-gallery-card]')];
    const delta = position - previous.current.position;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
    if (!snap && !reduced && delta !== 0 && Math.abs(delta) <= GLIDE_LIMIT) {
      const shift = Number.parseFloat(cards[0] ? getComputedStyle(cards[0]).getPropertyValue('--shift') : '') || 70;
      const translateFor = (offset: number) => `${-50 + offset * shift}% -50%`;
      for (const card of cards) {
        const next = Number(card.dataset.offset);
        const prevOffset = previous.current.offsets.get(card.dataset.galleryCard ?? '');
        if (prevOffset === undefined || prevOffset === next || typeof card.animate !== 'function') continue;
        // A photo that wrapped the long way should enter from the near edge, not cross the stage.
        const from = Math.abs(next - prevOffset) > Math.abs(delta) ? next + delta : prevOffset;
        card.getAnimations().forEach((animation) => animation.cancel());
        card.animate([{ translate: translateFor(from) }, { translate: translateFor(next) }], { duration: GLIDE_MS, easing: GLIDE_EASE });
        const frame = card.querySelector<HTMLElement>('.gallery-card');
        if (frame && typeof frame.animate === 'function') {
          frame.getAnimations().forEach((animation) => animation.cancel());
          frame.animate([{ scale: String(scaleFor(from)) }, { scale: String(scaleFor(next)) }], { duration: GLIDE_MS, easing: GLIDE_EASE });
        }
        const fromFar = Math.abs(from) > VISIBLE_DEPTH;
        const toFar = Math.abs(next) > VISIBLE_DEPTH;
        if (fromFar !== toFar) {
          card.animate([{ opacity: fromFar ? 0 : 1 }, { opacity: toFar ? 0 : 1 }], { duration: GLIDE_MS, easing: GLIDE_EASE });
        }
      }
    }
    const offsets = new Map<string, number>();
    for (const card of cards) offsets.set(card.dataset.galleryCard ?? '', Number(card.dataset.offset));
    previous.current = { position, offsets };
  }, [position, snap]);

  const windowStart = !expanded && count > CHIP_WINDOW ? Math.min(Math.max(0, currentIndex - 3), count - CHIP_WINDOW) : 0;
  const windowEnd = expanded || count <= CHIP_WINDOW ? count : windowStart + CHIP_WINDOW;
  const chips = items.slice(windowStart, windowEnd);

  useEffect(() => {
    activeChip.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }, [currentIndex, expanded]);

  if (!current) return null;

  function commit(next: number) {
    const delta = next - positionRef.current;
    if (delta === 0) return;
    positionRef.current = next;
    setSnap(Math.abs(delta) > GLIDE_LIMIT);
    setPosition(next);
  }

  function go(direction: -1 | 1) {
    commit(positionRef.current + direction);
  }

  function show(imageIndex: number) {
    commit(positionRef.current + shortestDelta(mod(positionRef.current, count), imageIndex, count));
  }

  function onBrowseKey(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  }

  const caption = current.caption?.trim() || '';

  return (
    <section aria-label={label} className="flex flex-col items-center gap-8" onKeyDown={many ? onBrowseKey : undefined}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[13px] font-semibold tracking-[0.18em] text-bronze uppercase">Gallery</p>
        {title ? (
          <h2 id={titleId} className="mt-3 text-[clamp(34px,4vw,52px)] leading-[1.08]">
            {title}
          </h2>
        ) : null}
        {intro ? <p className="mx-auto mt-3 max-w-[22rem] text-[17px] leading-snug text-green/80">{intro}</p> : null}
      </div>

      <p className="visually-hidden" aria-live="polite">
        Photograph {currentIndex + 1} of {count}
        {caption ? `, ${caption}` : ''}
      </p>

      {many ? (
        <div className="flex w-full justify-center">
          <ul className="flex max-w-full flex-wrap items-center justify-center gap-2">
            {chips.map((image, chipIndex) => {
              const i = windowStart + chipIndex;
              const selected = i === currentIndex;
              return (
                <li key={image._key ?? `${image.alt}-${i}`} className="shrink-0">
                  <button
                    type="button"
                    ref={selected ? activeChip : undefined}
                    aria-current={selected ? 'true' : undefined}
                    aria-label={`Show ${image.alt}`}
                    onClick={() => show(i)}
                    className={cn(
                      'inline-flex items-center rounded-full border px-4 py-2 text-[15px] leading-none font-medium transition-colors duration-(--duration-fast)',
                      selected ? 'border-green bg-green text-ivory' : 'border-charcoal/55 bg-paper text-charcoal hover:border-green hover:text-green',
                    )}
                  >
                    {chipText(image)}
                  </button>
                </li>
              );
            })}
            {count > CHIP_WINDOW ? (
              <li className="shrink-0">
                <button
                  type="button"
                  onClick={() => setExpanded((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-full border border-charcoal/55 bg-paper px-4 py-2 text-[15px] leading-none font-medium text-charcoal transition-colors duration-(--duration-fast) hover:border-green hover:text-green"
                >
                  {expanded ? 'Show less' : 'View more'}
                  {expanded ? null : (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M4 10h12M11.5 5.5 16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      <div ref={stageRef} className="gallery-stage relative h-[clamp(250px,72vw,340px)] w-screen overflow-hidden md:h-[500px]">
        {slots.map((slot) => {
          const image = items[slot.index];
          if (!image) return null;
          const active = slot.offset === 0;
          return (
            <div
              key={slot.key}
              data-gallery-card={slot.key}
              data-offset={slot.offset}
              data-far={Math.abs(slot.offset) > VISIBLE_DEPTH ? '' : undefined}
              className="gallery-mover"
              style={{ '--offset': slot.offset, zIndex: 30 - Math.min(Math.abs(slot.offset), VISIBLE_DEPTH) * 10 } as CSSProperties}
            >
              <div
                aria-hidden={active ? undefined : true}
                onClick={active ? undefined : () => show(slot.index)}
                className={cn(
                  'gallery-card bg-mist',
                  active ? 'shadow-[0_22px_50px_rgba(32,33,31,0.18)]' : 'cursor-pointer shadow-[0_12px_30px_rgba(32,33,31,0.12)]',
                )}
                style={{ '--scale': scaleFor(slot.offset) } as CSSProperties}
              >
                <SanityImage
                  image={image}
                  width={840}
                  height={840}
                  sizes="(min-width: 900px) 420px, 70vw"
                  cover
                  decorative={!active}
                  className="absolute inset-0"
                />
              </div>
            </div>
          );
        })}
      </div>

      {caption ? <p className="max-w-prose-site text-center font-display text-[18px] leading-snug md:text-[20px]">{caption}</p> : null}

      {many ? (
        <div className="flex items-center gap-3">
          <StepButton direction={-1} onClick={() => go(-1)} />
          <StepButton direction={1} onClick={() => go(1)} />
        </div>
      ) : null}
    </section>
  );
}
