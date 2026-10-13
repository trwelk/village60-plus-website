import Link from 'next/link';
import type { ReactNode } from 'react';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { cn } from '@/lib/cn';

const surfaces = {
  paper: 'bg-paper',
  ivory: 'bg-ivory',
} as const;

export type PreviewCardSurface = keyof typeof surfaces;

/** Image-led card: inset photo, caption, lift on hover. `overlay` fades onto the photo. */
export function PreviewCard({
  href,
  title,
  eyebrow,
  description,
  image,
  overlay,
  surface = 'paper',
  fill = 'bg-green',
  children,
}: {
  href?: string;
  title: string;
  eyebrow?: string | null;
  description?: string | null;
  image?: CmsImage | null;
  /** Extra line shown on the photo while the card is hovered or focused. */
  overlay?: string | null;
  surface?: PreviewCardSurface;
  /** Colour of the photo well when there is no image. */
  fill?: string;
  children?: ReactNode;
}) {
  const body = (
    <>
      <div className={cn('relative aspect-[4/5] overflow-hidden rounded-[14px]', fill)}>
        <SanityImage
          image={image}
          width={640}
          height={800}
          sizes="(min-width: 1200px) 400px, 100vw"
          cover
          className="absolute inset-0"
        />
        {overlay ? (
          <p
            aria-hidden
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/95 via-night/70 to-transparent px-5 pt-16 pb-5 text-[15px] leading-snug text-ivory opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            {overlay}
          </p>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-2 pt-4 pb-2">
        {eyebrow ? <p className="text-[14px] text-bronze">{eyebrow}</p> : null}
        <h3 className="text-[22px] leading-tight text-green">{title}</h3>
        {description ? <p className="text-[15px] leading-snug text-charcoal/80">{description}</p> : null}
        {children ? <div className="mt-auto flex flex-col gap-2 pt-2">{children}</div> : null}
      </div>
    </>
  );

  const className = cn(
    'group flex h-full min-w-0 flex-col rounded-panel p-3 text-charcoal no-underline transition-[transform,box-shadow] duration-(--duration-fast)',
    'motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-panel motion-safe:focus-visible:-translate-y-2 motion-safe:focus-visible:shadow-panel',
    surfaces[surface],
  );

  if (!href) return <article className={className}>{body}</article>;

  return (
    <article className="h-full">
      <Link href={href} className={className}>
        {body}
      </Link>
    </article>
  );
}
