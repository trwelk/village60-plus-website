'use client';

import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

function slideWidth(count: number): string {
  if (count <= 1) return 'w-full max-w-xl';
  return 'w-[min(82vw,20rem)] sm:w-[22rem] lg:w-[24rem]';
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
}

function SideControl({
  direction,
  label,
  onDark,
  disabled,
  onClick,
}: {
  direction: -1 | 1;
  label: string;
  onDark: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const previous = direction < 0;
  return (
    <div className={cn('absolute top-2 bottom-8 z-10 flex items-center', previous ? 'left-2' : 'right-2')}>
      <button
        type="button"
        aria-label={`${previous ? 'Previous' : 'Next'} ${label}`}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'inline-flex size-11 items-center justify-center rounded-full border shadow-panel transition-colors duration-(--duration-fast) focus-visible:outline-3 disabled:opacity-40',
          onDark ? 'border-ivory bg-green text-ivory hover:bg-night' : 'border-green bg-ivory text-green hover:bg-mist',
        )}
      >
        <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d={previous ? 'M12 4 6 10l6 6' : 'M8 4l6 6-6 6'} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/** Marquee shift, as a scroll offset within the first copy of the cards. */
function marqueeScrollLeft(el: HTMLElement): number {
  const transform = getComputedStyle(el).transform;
  if (!transform || transform === 'none' || typeof DOMMatrix === 'undefined') return 0;
  const shifted = -new DOMMatrix(transform).m41;
  const half = el.scrollWidth / 2;
  if (!Number.isFinite(shifted) || half <= 0) return 0;
  return ((shifted % half) + half) % half;
}

export function CardCarousel({
  heading,
  label,
  empty,
  reverse = false,
  onDark = false,
  children,
}: {
  heading: ReactNode;
  /** Singular noun for the control names, e.g. "home". */
  label: string;
  empty?: ReactNode;
  /** Drift the row the opposite way. */
  reverse?: boolean;
  onDark?: boolean;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const marquee = useRef<HTMLUListElement>(null);
  const scroller = useRef<HTMLUListElement>(null);
  const queued = useRef<{ direction: -1 | 1; scrollLeft: number; behavior: ScrollBehavior } | null>(null);
  const count = Children.count(children);
  const [edges, setEdges] = useState({ prev: false, next: true });
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [hovered, setHovered] = useState(false);
  const moving = count > 1 && playing && !reduced;

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener?.('change', apply);
    return () => query.removeEventListener?.('change', apply);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    function measure() {
      const node = scroller.current;
      if (!node || node.clientWidth === 0) return;
      const max = node.scrollWidth - node.clientWidth;
      setEdges({
        prev: node.scrollLeft > 8,
        next: node.scrollLeft < max - 8,
      });
    }

    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      observer?.disconnect();
    };
  }, [count, moving]);

  function advance(direction: -1 | 1, behavior: ScrollBehavior) {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (direction === 1 && el.clientWidth > 0 && el.scrollLeft >= max - 8) {
      el.scrollTo({ left: 0, behavior });
      return;
    }
    const item = el.querySelector('li');
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    const delta = (item?.clientWidth || el.clientWidth || 1) + gap;
    el.scrollBy({ left: direction * delta, behavior });
  }

  function requestMove(direction: -1 | 1, behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth') {
    if (count <= 1) return;
    if (moving) {
      const row = marquee.current;
      queued.current = { direction, scrollLeft: row ? marqueeScrollLeft(row) : 0, behavior };
      setPlaying(false);
      return;
    }
    if (direction < 0 && !edges.prev) return;
    if (direction > 0 && !edges.next) return;
    advance(direction, behavior);
  }

  const requestMoveRef = useRef(requestMove);
  requestMoveRef.current = requestMove;
  const hoveredRef = useRef(hovered);
  hoveredRef.current = hovered;

  useEffect(() => {
    if (moving || !queued.current || !scroller.current) return;
    const job = queued.current;
    queued.current = null;
    scroller.current.scrollLeft = job.scrollLeft;
    advance(job.direction, job.behavior);
  }, [moving]);

  useEffect(() => {
    if (count <= 1) return;
    function onKey(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const direction = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
      if (!direction) return;
      const node = root.current;
      if (!node) return;
      const active = document.activeElement;
      const typing =
        active instanceof HTMLElement &&
        (active.isContentEditable || active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
      if (typing && !node.contains(active)) return;
      const focusInside = active instanceof Node && node.contains(active);
      const focusInCarousel = active instanceof Element && active.closest('[data-card-carousel]');
      if (!focusInside && (focusInCarousel || !hoveredRef.current)) return;
      event.preventDefault();
      requestMoveRef.current(direction, 'auto');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count]);

  function cards(clone: boolean) {
    return Children.map(children, (child, index) => (
      <li
        key={clone ? `copy-${index}` : index}
        aria-hidden={clone || undefined}
        inert={clone || undefined}
        className={cn('flex shrink-0', clone && 'motion-reduce:hidden', slideWidth(count))}
      >
        {child}
      </li>
    ));
  }

  const controls = count > 1;

  return (
    <div ref={root} data-card-carousel="" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        {heading}
        {controls && !reduced ? (
          <Button
            variant="secondary"
            onDark={onDark}
            aria-label={playing ? 'Pause automatic movement' : 'Play automatic movement'}
            aria-pressed={!playing}
            onClick={() => setPlaying((value) => !value)}
            className="ml-auto"
          >
            {playing ? 'Pause' : 'Play'}
          </Button>
        ) : null}
      </div>
      {count === 0 ? (
        <div className="mt-4">{empty}</div>
      ) : (
        <div className="relative mt-8">
          {controls ? (
            <>
              <SideControl direction={-1} label={label} onDark={onDark} disabled={!moving && !edges.prev} onClick={() => requestMove(-1)} />
              <SideControl direction={1} label={label} onDark={onDark} disabled={!moving && !edges.next} onClick={() => requestMove(1)} />
            </>
          ) : null}
          {moving ? (
            <div className="overflow-hidden">
              <ul
                ref={marquee}
                className="flex w-max gap-8 pt-2 pb-8 motion-safe:animate-room-marquee motion-safe:hover:[animation-play-state:paused]"
                style={{
                  animationDuration: `${count * 8}s`,
                  animationDirection: reverse ? 'reverse' : 'normal',
                }}
              >
                {cards(false)}
                {cards(true)}
              </ul>
            </div>
          ) : (
            <ul
              ref={scroller}
              className="flex snap-x snap-mandatory items-stretch gap-8 overflow-x-auto overscroll-x-contain pt-2 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {cards(false)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
