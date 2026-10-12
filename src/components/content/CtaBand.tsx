import type { ReactNode } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Section, isDarkTone, type SectionTone } from '@/components/ui/Section';

export function CtaBand({
  heading,
  body,
  tone = 'sand',
  children,
}: {
  heading: string;
  body?: string | null;
  tone?: SectionTone;
  children?: ReactNode;
}) {
  return (
    <Section tone={tone}>
      <Heading as="h2" onDark={isDarkTone(tone)}>
        {heading}
      </Heading>
      {body && <p className="mt-4 max-w-prose-site">{body}</p>}
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
    </Section>
  );
}
