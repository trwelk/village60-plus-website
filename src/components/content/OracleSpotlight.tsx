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
    <section aria-labelledby="home-oracle" className="bg-paper text-charcoal">
      <div className="gutter mx-auto grid max-w-[1120px] items-center gap-y-14 py-16 sm:py-20 md:grid-cols-[minmax(0,1.08fr)_minmax(240px,0.92fr)] md:gap-x-12 md:py-24 lg:gap-x-16 lg:py-28">
        <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0">
          {primary ? (
            <div className={secondary ? 'relative z-0 w-[64%]' : 'relative z-0 w-[72%]'}>
              <div className="relative aspect-[3/4] bg-sand">
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
              <div className="relative aspect-[4/5] bg-sand">
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
            className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.95] font-normal tracking-[-0.03em] text-charcoal"
          >
            {title}
          </h2>
          <p className="mt-8 max-w-[36ch] font-display text-[17px] leading-[1.7] text-[#5c5852]">{summary}</p>
          <Link
            href="/oracle"
            className="mt-10 inline-flex items-center gap-2.5 text-[15px] text-[#5c654c] no-underline transition-colors duration-(--duration-fast) hover:text-green"
          >
            Learn More
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
