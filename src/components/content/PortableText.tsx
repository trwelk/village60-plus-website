import { PortableText as Base, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

const ALLOWED = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/** Accepts a site path or an http(s)/mailto/tel URL. Everything else, including javascript: and //host, is dropped. */
export function safeHref(href: unknown): string | null {
  if (typeof href !== 'string' || href.length === 0) return null;
  if (href.startsWith('/') && !href.startsWith('//')) return href;
  try {
    const url = new URL(href);
    return ALLOWED.has(url.protocol) ? href : null;
  } catch {
    return null;
  }
}

function componentsFor(onDark: boolean): PortableTextComponents {
  const linkClass = cn('underline underline-offset-4', onDark ? 'decoration-pale-gold' : 'decoration-gold hover:decoration-green');
  return {
    block: {
      normal: ({ children }) => <p className="max-w-prose-site">{children}</p>,
      h2: ({ children }) => <h2 className="mt-8 max-w-prose-site">{children}</h2>,
      h3: ({ children }) => <h3 className="mt-6 max-w-prose-site">{children}</h3>,
      blockquote: ({ children }) => (
        <blockquote className="max-w-prose-site border-l-2 border-gold py-1 pl-6 font-display text-[22px] leading-snug">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="max-w-prose-site list-disc space-y-2 pl-6">{children}</ul>,
      number: ({ children }) => <ol className="max-w-prose-site list-decimal space-y-2 pl-6">{children}</ol>,
    },
    marks: {
      link: ({ children, value }) => {
        const href = safeHref(value?.href);
        if (!href) return <>{children}</>;
        if (href.startsWith('/')) {
          return (
            <Link href={href} className={linkClass}>
              {children}
            </Link>
          );
        }
        const external = href.startsWith('http');
        return (
          <a href={href} className={linkClass} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {children}
          </a>
        );
      },
    },
  };
}

export function PortableText({
  value,
  onDark = false,
}: {
  value: PortableTextBlock[] | null | undefined;
  onDark?: boolean;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <Base value={value} components={componentsFor(onDark)} />
    </div>
  );
}
