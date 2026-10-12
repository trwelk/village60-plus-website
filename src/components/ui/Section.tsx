import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './Container';

export type SectionTone = 'ivory' | 'sand' | 'paper' | 'mist' | 'green' | 'night';

const tones: Record<SectionTone, string> = {
  ivory: 'bg-ivory text-charcoal',
  sand: 'bg-sand text-charcoal',
  paper: 'bg-paper text-charcoal',
  mist: 'bg-mist text-charcoal',
  green: 'bg-green text-ivory on-dark',
  night: 'bg-night text-ivory on-dark',
};

export function isDarkTone(tone: SectionTone): boolean {
  return tone === 'green' || tone === 'night';
}

export function Section({
  children,
  tone = 'ivory',
  id,
  labelledBy,
  className,
}: {
  children: ReactNode;
  tone?: SectionTone;
  id?: string;
  labelledBy?: string;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('section-space', tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}
