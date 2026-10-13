import { cn } from '@/lib/cn';

export type StepItem = { _key: string; title?: string | null; description?: string | null };

function StepMark({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-gold bg-ivory font-display text-[18px] leading-none text-green"
    >
      {String(n).padStart(2, '0')}
    </span>
  );
}

function StepCopy({ title, description, wideClass }: { title: string; description?: string | null; wideClass: string }) {
  return (
    <div className={wideClass}>
      <h3 className="text-[22px] leading-snug md:text-[24px]">{title}</h3>
      {description ? <p className="mt-1.5 text-pretty leading-relaxed">{description}</p> : null}
    </div>
  );
}

/**
 * Joined steps share one panel. The rail runs through the numeral centres:
 * inset by padding (2rem) plus half the 3rem mark, and stopping at the last column.
 */
function railClass(count: number) {
  if (count === 2) return 'absolute top-14 left-14 z-0 hidden h-px bg-gold right-[calc(50%-3.5rem)] sm:block';
  if (count === 3) return 'absolute top-14 left-14 z-0 hidden h-px bg-gold right-[calc(33.333%-3.5rem)] lg:block';
  return null;
}

export function StepList({ items }: { items: Array<StepItem | null> | null | undefined }) {
  const rows = (items ?? []).filter((item): item is StepItem & { title: string } => Boolean(item?.title));
  if (rows.length === 0) return null;

  if (rows.length >= 4) {
    return (
      <ol className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((item, index) => (
          <li key={item._key} className="flex h-full flex-col rounded-panel border border-stone bg-paper p-6">
            <StepMark n={index + 1} />
            <div className="mt-5">
              <h3 className="text-[22px] leading-snug">{item.title}</h3>
              {item.description ? <p className="mt-2 text-pretty leading-relaxed">{item.description}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const wide = rows.length === 2;
  const columns = wide ? 'sm:grid-cols-2' : rows.length === 3 ? 'lg:grid-cols-3' : '';
  const rail = railClass(rows.length);

  return (
    <div className={cn('relative mt-8 overflow-hidden rounded-panel border border-stone bg-paper', rows.length === 1 && 'max-w-xl')}>
      {rail ? <span aria-hidden="true" className={rail} /> : null}
      <ol className={cn('relative z-10 m-0 grid list-none bg-transparent p-0', columns)}>
        {rows.map((item, index) => {
          const last = index === rows.length - 1;
          return (
            <li
              key={item._key}
              className={cn(
                'grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-4 p-6',
                wide
                  ? 'sm:flex sm:h-full sm:flex-col sm:items-start sm:gap-0 sm:p-8'
                  : 'lg:flex lg:h-full lg:flex-col lg:items-start lg:gap-0 lg:p-8',
                !last && (wide ? 'border-b border-stone sm:border-r sm:border-b-0' : 'border-b border-stone lg:border-r lg:border-b-0'),
              )}
            >
              <StepMark n={index + 1} />
              <StepCopy
                title={item.title}
                description={item.description}
                wideClass={wide ? 'min-w-0 sm:mt-5' : 'min-w-0 lg:mt-5'}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
