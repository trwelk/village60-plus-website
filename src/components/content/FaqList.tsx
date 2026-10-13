import type { PortableTextBlock } from '@portabletext/react';
import { useId } from 'react';
import { cn } from '@/lib/cn';
import { PortableText } from './PortableText';

export type FaqItem = {
  _id: string;
  question?: string | null;
  answer?: PortableTextBlock[] | null;
};

export function FaqList({
  items,
  heading = 'Questions',
  width = 'prose',
  showHeading = true,
}: {
  items: Array<FaqItem | null> | null | undefined;
  heading?: string;
  /** `full` lets a parent column set the measure. `prose` keeps the list to a reading width. */
  width?: 'prose' | 'full';
  /** Turn off when a parent section already provides the heading. */
  showHeading?: boolean;
}) {
  const id = useId();
  const rows = (items ?? []).filter((item): item is FaqItem & { question: string } => Boolean(item?.question));
  if (rows.length === 0) return null;
  const list = (
    <div className={cn('border-b border-stone', showHeading && 'mt-6', width === 'prose' && 'max-w-prose-site')}>
      {rows.map((item) => (
        <details key={item._id} className="group border-t border-stone">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 font-semibold leading-snug [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-green transition-transform duration-(--duration-fast) group-open:rotate-180" aria-hidden="true">
              <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <div className="pb-5">
            <PortableText value={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
  if (!showHeading) return list;
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{heading}</h2>
      {list}
    </section>
  );
}
