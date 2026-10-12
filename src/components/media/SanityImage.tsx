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
}) {
  const alt = image?.alt?.trim();
  if (!image?.asset?.url || !alt) return null;

  const w = width;
  const h = slotHeight(image, w, height);
  const build = (tw: number, th: number) => urlFor(image as SanityImageSource).width(tw).height(th).fit('crop').url();
  const src = build(w, h);
  const src2 = build(w * 2, h * 2);
  const img = (
    <img
      src={src}
      srcSet={`${src} ${w}w, ${src2} ${w * 2}w`}
      sizes={sizes ?? `(min-width: 1200px) ${w}px, 100vw`}
      alt={alt}
      width={w}
      height={h}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={cn('h-auto w-full rounded-card', className)}
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
