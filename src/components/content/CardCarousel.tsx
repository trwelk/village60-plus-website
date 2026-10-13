'use client';

import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

function slideWidth(count: number): string {
  if (count <= 1) return 'w-full max-w-xl';
  return 'w-[82%] sm:w-[calc((100%-2rem)/2.08)] lg:w-[30%]';
}

export function CardCarousel({
  heading,
  label,
  empty,
  children,
}: {
  heading: ReactNode;
  /** Singular noun for the control names, e.g. "home". */
  label: string;
  empty?: ReactNode;
  children: ReactNode;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const count = Children.count(children);
  const [edges, setEdges] = useState({ prev: false, next: true });

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
  }, [count]);

  function move(direction: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const item = el.querySelector('li');
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    const delta = (item?.clientWidth || el.clientWidth || 1) + gap;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
    el.scrollBy({ left: direction * delta, behavior: reduce ? 'auto' : 'smooth' });
  }

  const controls = count > 1;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        {heading}
        {controls ? (
          <div className="ml-auto flex gap-2">
            <Button
              variant="secondary"
              aria-label={`Previous ${label}`}
              onClick={() => move(-1)}
              disabled={!edges.prev}
              className="disabled:opacity-40"
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              aria-label={`Next ${label}`}
              onClick={() => move(1)}
              disabled={!edges.next}
              className="disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
      {count === 0 ? (
        <div className="mt-4">{empty}</div>
      ) : (
        <ul
          ref={scroller}
          className="mt-8 flex snap-x snap-mandatory items-stretch gap-8 overflow-x-auto overscroll-x-contain pt-2 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {Children.map(children, (child) => (
            <li className={cn('flex shrink-0 snap-start', slideWidth(count))}>{child}</li>
          ))}
        </ul>
      )}
    </>
  );
}
