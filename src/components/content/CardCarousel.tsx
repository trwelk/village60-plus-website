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
  const scroller = useRef<HTMLUListElement>(null);
  const count = Children.count(children);
  const [edges, setEdges] = useState({ prev: false, next: true });
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
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

  function advance(direction: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
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
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        {heading}
        {controls ? (
          <div className="ml-auto flex gap-2">
            <Button
              variant="secondary"
              onDark={onDark}
              aria-label={`Previous ${label}`}
              onClick={() => advance(-1)}
              disabled={moving || !edges.prev}
              className="disabled:opacity-40"
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onDark={onDark}
              aria-label={`Next ${label}`}
              onClick={() => advance(1)}
              disabled={moving || !edges.next}
              className="disabled:opacity-40"
            >
              Next
            </Button>
            {reduced ? null : (
              <Button
                variant="secondary"
                onDark={onDark}
                aria-label={playing ? 'Pause automatic movement' : 'Play automatic movement'}
                aria-pressed={!playing}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? 'Pause' : 'Play'}
              </Button>
            )}
          </div>
        ) : null}
      </div>
      {count === 0 ? (
        <div className="mt-4">{empty}</div>
      ) : moving ? (
        <div className="mt-8 overflow-hidden">
          <ul
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
          className="mt-8 flex snap-x snap-mandatory items-stretch gap-8 overflow-x-auto overscroll-x-contain pt-2 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards(false)}
        </ul>
      )}
    </div>
  );
}
