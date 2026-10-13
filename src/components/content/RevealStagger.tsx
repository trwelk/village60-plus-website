'use client';

import { Children, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Phase = 'idle' | 'wait' | 'play';

/** Holds a list invisible, then rises each item in turn once the list enters view. */
export function RevealStagger({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
    if (reduce || typeof IntersectionObserver === 'undefined') return;

    setPhase('wait');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase('play');
        observer.disconnect();
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={ref} className={className}>
      {Children.map(children, (child, index) => (
        <li
          className={cn(phase === 'wait' && 'motion-safe:opacity-0', phase === 'play' && 'motion-safe:care-rise')}
          style={phase === 'play' ? { animationDelay: `${index * 110}ms` } : undefined}
        >
          {child}
        </li>
      ))}
    </ul>
  );
}
