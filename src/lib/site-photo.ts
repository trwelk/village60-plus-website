import type { CmsImage } from '@/components/media/SanityImage';

export function sitePhoto(src: string, alt: string): CmsImage {
  return {
    alt,
    asset: {
      url: src,
      metadata: { dimensions: { aspectRatio: 4 / 3, width: 1600, height: 1200 } },
    },
  };
}