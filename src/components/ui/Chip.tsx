import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Chip({ children, tone = 'light', className }: { children: ReactNode; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit shrink-0 items-center self-start rounded-input px-2.5 py-1 text-[14px] font-semibold leading-none',
        tone === 'light' ? 'border border-stone bg-paper text-green' : 'bg-white/10 text-ivory',
        className,
      )}
    >
      {children}
    </span>
  );
}
