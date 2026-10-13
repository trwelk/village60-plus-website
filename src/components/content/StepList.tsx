import { cn } from '@/lib/cn';

export type StepItem = { _key: string; title?: string | null; description?: string | null };

export function StepList({ items }: { items: Array<StepItem | null> | null | undefined }) {
  const rows = (items ?? []).filter((item): item is StepItem & { title: string } => Boolean(item?.title));
  if (rows.length === 0) return null;
  const columns =
    rows.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : rows.length === 3 ? 'md:grid-cols-3' : rows.length === 2 ? 'sm:grid-cols-2' : 'sm:max-w-md';
  return (
    <ol className={cn('m-0 mt-10 grid list-none gap-x-10 gap-y-10 p-0', columns)}>
      {rows.map((item, index) => (
        <li key={item._key} className="flex h-full flex-col">
          <span aria-hidden="true" className="font-display text-[32px] leading-none text-green">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span aria-hidden="true" className="mt-4 block h-px w-10 bg-gold" />
          <h3 className="mt-4 text-[22px] leading-snug md:text-[24px]">{item.title}</h3>
          {item.description ? <p className="mt-2">{item.description}</p> : null}
        </li>
      ))}
    </ol>
  );
}
