import { statusLabel, type ContentStatus } from '@/lib/content-status';
import { cn } from '@/lib/cn';

export function StatusBadge({ status, tone = 'light', className }: { status: ContentStatus; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-input border px-2.5 py-1 text-[14px] font-semibold leading-none',
        tone === 'light' ? 'border-stone bg-paper text-bronze' : 'border-pale-gold/40 bg-white/5 text-pale-gold',
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
