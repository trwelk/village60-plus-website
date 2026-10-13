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
  embedded = false,
}: {
  items: Array<FaqItem | null> | null | undefined;
  heading?: string;
  /** `full` lets a parent column set the measure. `prose` keeps the list to a reading width. */
  width?: 'prose' | 'full';
  /** Turn off when a parent section already provides the heading. */
  showHeading?: boolean;
  /** Drop the outer rules when the list sits inside a panel that already has a frame. */
  embedded?: boolean;
}) {
  const id = useId();
  const rows = (items ?? []).filter((item): item is FaqItem & { question: string } => Boolean(item?.question));
  if (rows.length === 0) return null;
  const list = (
    <div className={cn(!embedded && 'border-b border-stone', showHeading && 'mt-6', width === 'prose' && 'max-w-prose-site')}>
      {rows.map((item) => (
        <details key={item._id} className={cn('group border-stone', embedded ? 'border-b last:border-b-0' : 'border-t')}>
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-semibold leading-snug transition-colors hover:text-green [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 text-pretty">{item.question}</span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-stone bg-ivory text-green transition-colors group-hover:border-gold group-open:border-green group-open:bg-green group-open:text-ivory">
              <svg viewBox="0 0 20 20" className="size-4 transition-transform duration-(--duration-fast) group-open:rotate-180" aria-hidden="true">
                <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </summary>
          <div className="pb-6 pr-14">
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
