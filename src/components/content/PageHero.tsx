import type { ReactNode } from 'react';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { Heading } from '@/components/ui/Heading';
import { Section, isDarkTone, type SectionTone } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/cn';
import { isContentStatus } from '@/lib/content-status';

export function pickHeroImage<T extends CmsImage>(...candidates: Array<T | null | undefined>): T | null {
  return candidates.find((image) => Boolean(image?.asset?.url && image.alt?.trim())) ?? null;
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  photo,
  status,
  tone = 'ivory',
  align = 'start',
  framed = false,
  layout = 'split',
  offset = true,
  crumbs,
  className,
  children,
}: {
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  image?: CmsImage | null;
  /** Static photograph when the page has no CMS image. */
  photo?: { src: string; alt: string } | null;
  status?: string | null;
  tone?: SectionTone;
  /** Vertical alignment of the text against a hero image. */
  align?: 'start' | 'center';
  /** Crop the photograph to a consistent 4:3 panel. */
  framed?: boolean;
  /** `overlay` places the title on a full-viewport photograph. */
  layout?: 'split' | 'overlay';
  /** Leave room for the overlaid header. Turn off when breadcrumbs already clear it. */
  offset?: boolean;
  /** Ancestor trail drawn on the photograph, above the title. */
  crumbs?: Crumb[];
  className?: string;
  children?: ReactNode;
}) {
  const onDark = isDarkTone(tone);
  const showImage = Boolean(image?.asset?.url && image?.alt?.trim());

  if (layout === 'overlay') {
    return (
      <section
        aria-labelledby="page-title"
        className={cn('relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark', className)}
      >
        {showImage ? (
          <div className="absolute inset-0">
            <SanityImage image={image} width={1920} height={1080} priority cover sizes="100vw" />
          </div>
        ) : photo ? (
          <img src={photo.src} alt={photo.alt} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/78 via-night/32 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/35 via-transparent to-night/45" />
        <div className="relative z-10 w-full pt-32 pb-16">
          <div className="mx-auto w-full max-w-[1520px] gutter">
            <div className="flex max-w-[40rem] flex-col items-start gap-5">
              {crumbs && crumbs.length > 0 ? <Breadcrumbs items={crumbs} tone="dark" /> : null}
              {(eyebrow || isContentStatus(status)) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {eyebrow ? <p className="text-[12px] font-semibold tracking-[0.22em] text-pale-gold uppercase">{eyebrow}</p> : null}
                  {isContentStatus(status) ? <StatusBadge status={status} tone="dark" /> : null}
                </div>
              )}
              <h1 id="page-title" className="font-display text-[clamp(2.6rem,4.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.02em] text-ivory">
                {title}
              </h1>
              {intro ? <p className="max-w-[36rem] text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">{intro}</p> : null}
              {children ? <div className="flex w-full flex-col items-start gap-5">{children}</div> : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const frame = showImage
    ? `grid items-start gap-8 lg:grid-cols-2 lg:gap-16 ${align === 'center' ? 'lg:items-center' : ''}`
    : 'max-w-prose-site';
  const kicker = eyebrow ? (
    <p className={cn('text-[14px] font-semibold uppercase tracking-[0.08em]', onDark ? 'text-pale-gold' : 'text-bronze')}>{eyebrow}</p>
  ) : null;
  const badge = isContentStatus(status) ? <StatusBadge status={status} tone={onDark ? 'dark' : 'light'} /> : null;
  return (
    <Section tone={tone} labelledBy="page-title" className={cn(offset && 'clear-header', className)}>
      <div className={frame}>
        <div className="flex min-w-0 flex-col items-start gap-4">
          <div className="flex flex-col gap-3">
            {kicker || badge ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {kicker}
                {badge}
              </div>
            ) : null}
            <Heading as="h1" id="page-title" onDark={onDark}>
              {title}
            </Heading>
          </div>
          {intro && <p className="max-w-prose-site">{intro}</p>}
          {children ? <div className="flex w-full flex-col items-start gap-5">{children}</div> : null}
        </div>
        {showImage && framed ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-panel bg-sand">
            <SanityImage image={image} width={960} height={720} priority sizes="(min-width: 1200px) 640px, 100vw" cover className="absolute inset-0" />
          </div>
        ) : null}
        {showImage && !framed ? <SanityImage image={image} width={800} height={500} priority sizes="(min-width: 1200px) 600px, 100vw" /> : null}
      </div>
    </Section>
  );
}
