import type { PortableTextBlock } from '@portabletext/react';
import { useId } from 'react';
import { PortableText } from './PortableText';

export type FaqItem = {
  _id: string;
  question?: string | null;
  answer?: PortableTextBlock[] | null;
};

export function FaqList({ items, heading = 'Questions' }: { items: Array<FaqItem | null> | null | undefined; heading?: string }) {
  const id = useId();
  const rows = (items ?? []).filter((item): item is FaqItem & { question: string } => Boolean(item?.question));
  if (rows.length === 0) return null;
  return (
    <section aria-labelledby={id} className="section-space">
      <div className="gutter mx-auto w-full max-w-site">
        <h2 id={id}>{heading}</h2>
        <div className="mt-8 max-w-prose-site border-b border-stone">
          {rows.map((item) => (
            <details key={item._id} className="group border-t border-stone">
              <summary className="min-h-11 py-3 font-semibold">{item.question}</summary>
              <div className="pb-4">
                <PortableText value={item.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
