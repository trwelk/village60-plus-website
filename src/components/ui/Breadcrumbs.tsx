import Link from 'next/link';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, tone = 'light' }: { items: Crumb[]; tone?: 'light' | 'dark' }) {
  if (items.length === 0) return null;
  const onDark = tone === 'dark';
  return (
    <nav aria-label="Breadcrumb" className={onDark ? undefined : 'clear-header-bar gutter mx-auto w-full max-w-site pb-4'}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className={onDark ? 'text-ivory underline decoration-ivory/40 underline-offset-4' : 'text-green underline underline-offset-4'}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              )}
              {!last && (
                <span aria-hidden="true" className={onDark ? 'text-ivory/50' : 'text-bronze'}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
