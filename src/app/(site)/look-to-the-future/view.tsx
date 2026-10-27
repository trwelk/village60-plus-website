import Link from 'next/link';
import type { ReactNode } from 'react';

const goldButton =
  'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-pale-gold px-5 text-[12px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold';
const ghostButton =
  'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] border border-ivory/80 px-5 text-[12px] font-semibold tracking-[0.14em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-white/10';

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return <p className={light ? 'text-[12px] font-semibold tracking-[0.22em] text-pale-gold uppercase' : 'text-[12px] font-semibold tracking-[0.22em] text-bronze uppercase'}>{children}</p>;
}

function Headline({ id, as: Tag, children }: { id: string; as: 'h1' | 'h2'; children: ReactNode }) {
  return (
    <Tag id={id} className="font-display text-[clamp(2.45rem,4vw,4rem)] leading-[1.02] font-medium tracking-[-0.02em] text-green">
      {children}
    </Tag>
  );
}

export function LookToTheFutureView() {
  return (
    <main id="main" className="bg-ivory text-charcoal">
      <section data-future-section="hero" aria-labelledby="page-title" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
        <img
          src="/look-to-the-future/heritage.jpg"
          alt="The Heritage estate in Matara, a colonial bungalow and gardens above the coast at sunset"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[78%_center]"
        />
        <div className="pointer-events-none absolute inset-0 bg-night/45 lg:hidden" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/78 via-night/32 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-night/60 lg:from-night/35 lg:to-night/45" />
        <div className="relative z-10 w-full pt-32 pb-16">
          <div className="mx-auto w-full max-w-[1520px] gutter">
            <div className="max-w-[40rem]">
              <Eyebrow light>Look to the future</Eyebrow>
              <h1 id="page-title" className="mt-4 font-display text-[clamp(2.6rem,4.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.02em] text-ivory">
                Two Residences.
                <span className="block">Still Ahead.</span>
              </h1>
              <p className="mt-6 max-w-[36rem] text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">
                The Heritage opens in 2027 on the Keunaman Bungalow Estate in Matara. The Grove is taking shape in Kottawa — the same personal care Village 60 Plus has offered since 2008.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/look-to-the-future/heritage" className={goldButton}>
                  The Heritage
                  <Arrow />
                </Link>
                <Link href="#grove" className={ghostButton}>
                  The Grove
                  <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="heritage" data-future-section="heritage" aria-labelledby="heritage-title" className="scroll-mt-8 lg:grid lg:grid-cols-2">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:order-2 lg:py-24 lg:pr-[max(2rem,calc((100vw-1520px)/2+2rem))] lg:pl-14">
          <div className="max-w-[36rem]">
            <Eyebrow>Coming 2027</Eyebrow>
            <Headline id="heritage-title" as="h2">
              The Heritage.
              <span className="block">Matara.</span>
            </Headline>
            <p className="mt-6 text-[16px] leading-relaxed md:text-[17px]">
              A heritage estate on the historic Keunaman Bungalow Estate. The Heritage by Village 60 Plus is a luxury retirement and wellness destination above the southern coast — gardens, the old bungalow, and a new chapter opening in 2027.
            </p>
            <Link href="/look-to-the-future/heritage" className={`${goldButton} mt-8`}>
              Discover The Heritage
              <Arrow />
            </Link>
          </div>
        </div>
        <figure className="relative min-h-[70vw] lg:order-1 lg:min-h-[640px]">
          <img
            src="/look-to-the-future/heritage-house.jpg"
            alt="The Keunaman bungalow at The Heritage, a colonial house with a red-tiled roof and a long verandah"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/75 via-night/20 to-transparent" />
          <figcaption className="absolute right-5 bottom-5 text-right font-display text-[clamp(1.7rem,2.3vw,2.25rem)] leading-[1.05] font-medium text-ivory italic [text-shadow:0_2px_16px_rgba(0,0,0,0.4)] sm:right-8 sm:bottom-7">
            Historic Charm.
            <span className="block">Modern Comfort.</span>
          </figcaption>
        </figure>
      </section>

      <section id="grove" data-future-section="grove" aria-labelledby="grove-title" className="scroll-mt-8 lg:grid lg:grid-cols-2">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-24 lg:pr-14 lg:pl-[max(2rem,calc((100vw-1520px)/2+2rem))]">
          <div className="max-w-[34rem]">
            <Eyebrow>Kottawa</Eyebrow>
            <Headline id="grove-title" as="h2">
              The Grove.
              <span className="block">A Warm Welcome.</span>
            </Headline>
            <p className="mt-6 text-[16px] leading-relaxed md:text-[17px]">
              Our next residence is taking shape in Kottawa. Forty private rooms in two buildings, a gated entrance, and the same personal care Village 60 Plus has offered since 2008. Spacious rooms, shared spaces, and a welcome that starts at the gate.
            </p>
            <Link href="/look-to-the-future/grove" className={`${goldButton} mt-8`}>
              Discover The Grove
              <Arrow />
            </Link>
          </div>
        </div>
        <div className="relative min-h-[70vw] lg:min-h-[640px]">
          <img
            src="/look-to-the-future/grove-aerial.jpg"
            alt="Aerial view of The Grove in Kottawa, two long buildings set in a landscaped garden"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}
