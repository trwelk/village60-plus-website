import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Heading({
  as: Tag = 'h2',
  id,
  eyebrow,
  children,
  onDark = false,
  className,
  titleClassName,
}: {
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  onDark?: boolean;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn('max-w-prose-site', className)}>
      {eyebrow && (
        <p className={cn('mb-3 text-[14px] font-semibold uppercase tracking-[0.08em]', onDark ? 'text-pale-gold' : 'text-bronze')}>
          {eyebrow}
        </p>
      )}
      <Tag id={id} className={titleClassName}>{children}</Tag>
    </div>
  );
}
