import Link from 'next/link';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

function hasPhoto(image: CmsImage | null | undefined): image is CmsImage {
  return Boolean(image?.asset?.url && image.alt?.trim());
}

/** Prefer taller frames so the overlapping portraits stay portrait-shaped. */
export function oraclePortraits(images: Array<CmsImage | null | undefined> | null | undefined): CmsImage[] {
  const seen = new Set<string>();
  const usable = (images ?? []).filter(hasPhoto).filter((image) => {
    const url = image.asset?.url;
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
  const ratio = (image: CmsImage) => {
    const aspect = image.asset?.metadata?.dimensions?.aspectRatio;
    return aspect && aspect > 0 ? aspect : 1.6;
  };
  return [...usable].sort((a, b) => ratio(a) - ratio(b)).slice(0, 2);
}

export function imagesFromOracleFrames(value: unknown): CmsImage[] {
  if (!value || typeof value !== 'object') return [];
  const doc = value as { heroImage?: CmsImage | null; gallery?: Array<CmsImage | null> | null };
  const gallery = Array.isArray(doc.gallery) ? doc.gallery : [];
  return [doc.heroImage, ...gallery].filter((image): image is CmsImage => Boolean(image && typeof image === 'object'));
}

export function OracleSpotlight({
  name = 'Oracle',
  summary,
  images,
}: {
  name?: string | null;
  summary: string;
  images?: Array<CmsImage | null | undefined> | null;
}) {
  const title = name || 'Oracle';
  const [primary, secondary] = oraclePortraits(images);

  return (
    <section aria-labelledby="home-oracle" className="relative overflow-hidden bg-green text-ivory on-dark">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pale-gold/70 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pale-gold/50 to-transparent" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green via-green to-night/75"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/2 h-[min(85%,30rem)] w-[min(75%,36rem)] -translate-y-1/2 rounded-full bg-pale-gold/14 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative gutter mx-auto grid max-w-[1120px] items-center gap-y-14 py-16 sm:py-20 md:grid-cols-[minmax(0,1.08fr)_minmax(240px,0.92fr)] md:gap-x-12 md:py-24 lg:gap-x-16 lg:py-28">
        <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0">
          {primary ? (
            <div className={secondary ? 'relative z-0 w-[64%]' : 'relative z-0 w-[72%]'}>
              <div className="relative aspect-[3/4] bg-night/40 ring-1 ring-pale-gold/25">
                <SanityImage
                  image={primary}
                  width={720}
                  height={960}
                  sizes="(min-width: 1200px) 22rem, 64vw"
                  cover
                  className="absolute inset-0"
                />
              </div>
            </div>
          ) : null}
          {secondary ? (
            <div className="absolute top-[16%] right-0 z-10 w-[50%]">
              <div className="relative aspect-[4/5] bg-night/40 ring-1 ring-pale-gold/30 shadow-[0_12px_40px_rgba(15,31,27,0.45)]">
                <SanityImage
                  image={secondary}
                  width={560}
                  height={700}
                  sizes="(min-width: 1200px) 17rem, 46vw"
                  cover
                  className="absolute inset-0"
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="max-w-[34rem] lg:py-4">
          <h2
            id="home-oracle"
            className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.95] font-normal tracking-[-0.03em] text-pale-gold"
          >
            {title}
          </h2>
          <p className="mt-8 max-w-[36ch] font-display text-[17px] leading-[1.7] text-ivory/88">{summary}</p>
          <Link
            href="/oracle"
            className="mt-10 inline-flex items-center gap-2.5 text-[15px] text-pale-gold no-underline decoration-gold/60 underline-offset-[6px] transition-colors duration-(--duration-fast) hover:text-ivory hover:underline hover:decoration-pale-gold"
          >
            Learn More
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
