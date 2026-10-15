import type { SanityImageSource } from '@sanity/image-url';
import { cn } from '@/lib/cn';
import { urlFor } from '@/sanity/image';

/** Shape of the shared `IMAGE` GROQ projection in `src/sanity/queries.ts`. Extra fields are ignored by `urlFor`. */
export type CmsImage = {
  alt?: string | null;
  caption?: string | null;
  hotspot?: { x?: number; y?: number; height?: number; width?: number } | null;
  crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
  asset?: {
    _id?: string | null;
    url?: string | null;
    metadata?: {
      lqip?: string | null;
      dimensions?: { width?: number | null; height?: number | null; aspectRatio?: number | null } | null;
    } | null;
  } | null;
};

const FALLBACK_ASPECT = 1.6;

function slotHeight(image: CmsImage, width: number, height?: number): number {
  if (height && height > 0) return height;
  const ratio = image.asset?.metadata?.dimensions?.aspectRatio;
  const aspect = ratio && ratio > 0 ? ratio : FALLBACK_ASPECT;
  return Math.max(1, Math.round(width / aspect));
}

export function SanityImage({
  image,
  width,
  height,
  sizes,
  priority = false,
  className,
  showCaption = false,
  cover = false,
  decorative = false,
}: {
  image: CmsImage | null | undefined;
  /** CSS-pixel width of the slot. Sent to the CDN and written as the width attribute. */
  width: number;
  /** CSS-pixel height. When omitted, derived from the asset aspect ratio. */
  height?: number;
  sizes?: string;
  /** Set on the LCP image only. */
  priority?: boolean;
  className?: string;
  showCaption?: boolean;
  /** Fill the positioned parent, cropped, with no card radius. */
  cover?: boolean;
  /** Keep the asset (alt is still required) but hide it from the accessibility tree. Use when a control beside it already names the photograph. */
  decorative?: boolean;
}) {
  const alt = image?.alt?.trim();
  const rawUrl = image?.asset?.url;
  if (!rawUrl || !alt) return null;

  const w = width;
  const h = slotHeight(image, w, height);
  const local = rawUrl.startsWith('/');
  const build = (tw: number, th: number) => urlFor(image as SanityImageSource).width(tw).height(th).fit('crop').url();
  const src = local ? rawUrl : build(w, h);
  const src2 = local ? rawUrl : build(w * 2, h * 2);
  const img = (
    <img
      src={src}
      srcSet={local ? undefined : `${src} ${w}w, ${src2} ${w * 2}w`}
      sizes={local ? undefined : (sizes ?? `(min-width: 1200px) ${w}px, 100vw`)}
      alt={decorative ? '' : alt}
      width={w}
      height={h}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={cn(cover ? 'h-full w-full object-cover' : 'h-auto w-full rounded-card', className)}
    />
  );

  if (!showCaption || !image.caption) return img;
  return (
    <figure>
      {img}
      <figcaption className="mt-2 text-[14px] text-bronze">{image.caption}</figcaption>
    </figure>
  );
}
