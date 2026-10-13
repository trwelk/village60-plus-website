import Link from 'next/link';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="clear-header-bar gutter mx-auto w-full max-w-site pb-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="text-green underline underline-offset-4">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-bronze">
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
