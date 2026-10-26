import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { VideoHero, type HeroVideo } from '@/components/media/VideoHero';
import Link from 'next/link';

const HERO_PHOTO = {
  src: '/home/hero.jpg',
  alt: 'A white residence with a clay-tile roof and verandah draped in pink and purple bougainvillea in the golden-hour light',
};

export function HomeHero({ video }: { video?: HeroVideo | null }) {
  return (
    <section aria-labelledby="page-title" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
      <div className="absolute inset-0">
        {/* Client photograph is the designed still. A video, when published, plays over it. */}
        <img src={HERO_PHOTO.src} alt={HERO_PHOTO.alt} className="h-full w-full object-cover object-[42%_center]" />
        {video ? <VideoHero video={video} fill appearance="watch" /> : null}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/80 via-night/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/55 via-transparent to-night/45" />
      <div className="relative z-10 w-full pt-28 pb-32">
        <div className="mx-auto w-full max-w-[1520px] gutter">
          <div className="max-w-[46rem]">
            <h1 id="page-title" className="font-display text-[clamp(2.35rem,4.5vw,4.65rem)] leading-[0.95] font-medium tracking-[-0.02em] text-ivory uppercase">
              <span className="block">Live well.</span> <span className="block sm:whitespace-nowrap">Age exceptionally.</span>
            </h1>
            <div className="mt-6 h-px w-16 bg-pale-gold" />
            <p className="mt-6 max-w-[36rem] font-display text-[clamp(1.15rem,1.5vw,1.45rem)] leading-snug text-ivory">
              More than care. A better way to live after 60.
            </p>
            <p className="mt-5 max-w-[26rem] text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">
              Beautiful places to live.
              <br />
              Thoughtful support when you need it.
              <br />
              And the freedom to keep living life your way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/homes"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-pale-gold px-5 text-[13px] font-semibold tracking-[0.12em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold"
              >
                Explore Village 60 Plus
                <Arrow />
              </Link>
              <EnquiryButton kind="oracle-visit" context="Home" tone="hero">
                Arrange a private visit
              </EnquiryButton>
            </div>
            <p className="mt-8 text-[12px] tracking-[0.16em] text-ivory/85 uppercase">Established 2008 · Sri Lanka</p>
          </div>
        </div>
      </div>
      <a
        href="#home-story"
        className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 text-ivory/90 md:bottom-7"
        aria-label="A more meaningful tomorrow"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M6 9.5 12 15.5 18 9.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
