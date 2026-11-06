import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type SplitImage = {
  src: string;
  alt: string;
  webp?: string;
  /** Focal point for the cover crop. */
  position?: string;
};

export function SplitFeature({
  id,
  headingId,
  eyebrow,
  title,
  image,
  imageSide,
  action,
  children,
}: {
  id?: string;
  headingId: string;
  eyebrow: string;
  title: ReactNode;
  image: SplitImage;
  imageSide: 'left' | 'right';
  action?: ReactNode;
  children: ReactNode;
}) {
  const imageLeft = imageSide === 'left';

  return (
    <section id={id} aria-labelledby={headingId} className="bg-paper text-charcoal">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 gutter py-14 sm:gap-10 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20 xl:gap-20">
        <div className={cn('flex max-w-[34rem] flex-col justify-center lg:py-4', imageLeft ? 'lg:order-2' : 'lg:order-1')}>
          <p className="font-sans text-[15px] font-semibold text-gold">{eyebrow}</p>
          <h2
            id={headingId}
            className="mt-3 font-display text-[clamp(2.35rem,3.4vw,3.35rem)] leading-[1.08] font-medium tracking-[-0.02em] text-charcoal"
          >
            {title}
          </h2>
          <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-charcoal/75 md:text-[17px]">{children}</div>
          {action ? <div className="mt-8">{action}</div> : null}
        </div>
        <div
          className={cn(
            'relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-sand',
            imageLeft ? 'lg:order-1' : 'lg:order-2',
          )}
        >
          <picture className="absolute inset-0">
            {image.webp ? <source srcSet={image.webp} type="image/webp" /> : null}
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1200px) 36rem, 100vw"
              className="h-full w-full object-cover"
              style={image.position ? { objectPosition: image.position } : undefined}
            />
          </picture>
        </div>
      </div>
    </section>
  );
}

export function SplitAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center gap-3 rounded-full bg-gold py-1.5 pr-6 pl-1.5 text-[15px] font-semibold text-night no-underline transition-colors duration-(--duration-fast) hover:bg-bronze hover:text-ivory"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ivory text-gold" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </Link>
  );
}
