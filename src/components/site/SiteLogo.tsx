import { cn } from '@/lib/cn';

export const SITE_LOGO = {
  src: '/brand/logo.jpg',
  alt: 'Village 60 Plus',
  width: 828,
  height: 304,
} as const;

export function SiteLogo({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <img
      src={SITE_LOGO.src}
      alt={decorative ? '' : SITE_LOGO.alt}
      width={SITE_LOGO.width}
      height={SITE_LOGO.height}
      className={cn('h-10 w-auto max-w-[min(100%,13.5rem)] object-contain object-left sm:h-11', className)}
      decoding="async"
    />
  );
}
