import Link from 'next/link';
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';

const goldButton =
  'inline-flex min-h-11 w-fit items-center gap-2.5 rounded-full bg-pale-gold px-6 text-[12px] font-semibold tracking-[0.16em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold';
const outlineButton =
  'inline-flex min-h-12 w-fit items-center gap-2.5 rounded-full border border-ivory/75 px-6 text-[12px] font-semibold tracking-[0.16em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-white/10';
const scriptFace = '[font-family:var(--font-heritage-script,cursive)]';

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Line({ children, className = 'size-8' }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 36" className={className} aria-hidden>
      <path d="M40 33V7" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path
        fill="currentColor"
        d="M40 27c-8-1.2-15-7-19-14 8 1.4 14 6 19 14zM40 27c8-1.2 15-7 19-14-8 1.4-14 6-19 14zM40 18c-6.5-2-12-7.2-14.5-13 6.4 1.6 11 6 14.5 13zM40 18c6.5-2 12-7.2 14.5-13-6.4 1.6-11 6-14.5 13zM40 12.5C37.2 9.4 35.2 5.6 34.6 2.2 37.6 4.4 39.4 8.2 40 12.5zM40 12.5c2.8-3.1 4.8-6.9 5.4-10.3C42.4 4.4 40.6 8.2 40 12.5z"
      />
    </svg>
  );
}

function Botanical() {
  return (
    <svg viewBox="0 0 80 280" className="pointer-events-none absolute top-8 -left-3 hidden h-80 w-20 text-gold/55 lg:block" fill="none" stroke="currentColor" strokeWidth="1.15" aria-hidden>
      <path d="M42 268C40 200 44 120 36 18" strokeLinecap="round" />
      <path d="M40 214c-16-12-28-32-30-52 16 8 26 26 30 52z" />
      <path d="M40 176c16-14 30-34 30-54-16 8-26 28-30 54z" />
      <path d="M38 128c-16-14-26-34-24-54 14 8 22 28 24 54z" />
      <path d="M38 86c14-14 28-30 26-48-14 8-22 26-26 48z" />
    </svg>
  );
}

function Wordmark({ place = true, compact = false }: { place?: boolean; compact?: boolean }) {
  return (
    <div>
      <Leaf className={compact ? 'mx-auto mb-1 h-7 w-14 text-pale-gold' : 'mx-auto mb-2 h-9 w-16 text-pale-gold'} />
      <p className={`text-center font-display font-medium whitespace-nowrap text-ivory uppercase ${compact ? 'text-[1.15rem] tracking-[0.14em]' : 'text-[clamp(1.2rem,2.4vw,2.05rem)] tracking-[0.16em]'}`}>The Heritage</p>
      <p className={`mt-1 text-center text-ivory/90 ${compact ? 'text-[13px]' : 'text-[14px]'}`}>by Village 60 Plus</p>
      {place ? <p className="mt-2 text-center text-[11px] font-semibold tracking-[0.28em] text-pale-gold uppercase">Matara • Sri Lanka</p> : null}
    </div>
  );
}

function Amenity({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <li className="flex flex-col items-center gap-2.5 text-center">
      <Line className="size-8 text-gold">{icon}</Line>
      <span className="max-w-[7.5rem] text-[13px] leading-snug">{label}</span>
    </li>
  );
}

function Service({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold">
        <Line className="size-5">{icon}</Line>
      </span>
      <span className="text-[15px] leading-snug">{label}</span>
    </li>
  );
}

export function HeritageView({ scriptFontClassName = '' }: { scriptFontClassName?: string }) {
  return (
    <main id="main" className={`bg-ivory text-charcoal ${scriptFontClassName}`}>
      <section data-heritage-section="hero" aria-labelledby="page-title" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-night text-ivory on-dark">
        <img
          src="/look-to-the-future/heritage.jpg"
          alt="The Heritage estate in Matara, a colonial bungalow and gardens above the coast at sunset"
          className="absolute inset-0 h-full w-full object-cover object-[78%_center]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/72 via-night/28 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/45 via-transparent to-night/40" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1520px] flex-1 flex-col gutter pt-28 pb-28 md:pb-20 lg:pt-32">
          <div className="relative">
            <p className="mb-6 text-right text-[11px] font-semibold tracking-[0.22em] text-ivory uppercase sm:text-[12px] sm:tracking-[0.28em] lg:absolute lg:top-3 lg:right-0 lg:mb-0">Coming 2027</p>
            <div className="flex justify-center lg:justify-start">
              <Wordmark />
            </div>
          </div>
          <div className="mt-10 grid items-end gap-8 md:mt-auto md:gap-10 md:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-20">
            <div className="max-w-[38rem]">
              <h1 id="page-title" className="font-display text-[clamp(2.35rem,3.35vw,3.55rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ivory [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]">
                Where History Meets
                <span className="block md:whitespace-nowrap">a New Era of Retirement.</span>
              </h1>
              <p className="mt-5 max-w-[36rem] text-[11px] font-semibold tracking-[0.14em] text-ivory/95 uppercase sm:text-[12px] sm:tracking-[0.18em]">
                A heritage estate • Wellness • Lifestyle • Seamless care
              </p>
              <Link href="#estate" className={`${goldButton} mt-7`}>
                Discover the Heritage
                <Arrow />
              </Link>
            </div>
            <p className={`${scriptFace} hidden text-[clamp(1.85rem,3vw,2.7rem)] leading-[1.15] text-ivory [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] md:block lg:text-right`}>
              Destination Retirement
              <span className="block">by Village 60 Plus</span>
            </p>
          </div>
        </div>
      </section>

      <section data-heritage-section="estate" id="estate" aria-labelledby="estate-title" className="relative scroll-mt-8 overflow-hidden">
        <Botanical />
        <div className="mx-auto grid w-full max-w-[1520px] items-center gap-10 gutter py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-24">
          <div className="max-w-[36rem] lg:pl-8">
            <p className="text-[12px] font-semibold tracking-[0.22em] text-bronze uppercase">A place with history</p>
            <h2 id="estate-title" className="mt-3 font-display text-[clamp(2.15rem,3.4vw,3.35rem)] leading-[1.08] font-medium tracking-[-0.02em] text-green">
              The Keunaman Bungalow Estate
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed md:text-[17px]">
              Set on a rare seven-acre hilltop estate in Browns Hill, Matara, The Heritage is a historic property dating back to before 1937. Originally built and attributed to renowned Sri Lankan architect Bevis Bawa, the estate has hosted many of Sri Lanka&apos;s most influential figures, including former presidents, prime ministers and national leaders.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed md:text-[17px]">
              Now, this remarkable estate is being transformed into a luxury retirement and wellness destination — preserving its rich history while embracing a new future.
            </p>
          </div>
          <figure className="relative w-full">
            <img
              src="/look-to-the-future/heritage-house.jpg"
              alt="The Keunaman bungalow at The Heritage, a colonial house with a red-tiled roof and a long verandah"
              width={1280}
              height={720}
              className="h-auto w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/75 via-night/20 to-transparent" />
            <figcaption className="absolute right-5 bottom-5 text-right text-ivory sm:right-8 sm:bottom-7">
              <p className="font-display text-[clamp(1.7rem,2.4vw,2.35rem)] leading-tight font-medium italic">Historic Charm.</p>
              <p className={`${scriptFace} text-[clamp(1.85rem,2.6vw,2.5rem)] leading-none`}>Modern Comfort.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section data-heritage-section="matara" aria-labelledby="matara-title" className="relative flex min-h-[560px] items-center overflow-hidden bg-night text-ivory on-dark">
        <img src="/destination-retirement/beach.jpg" alt="A quiet beach at sunset" className="absolute inset-0 h-full w-full object-cover object-[center_60%]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/75 via-night/40 to-night/25" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1520px] items-center gap-10 gutter py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="max-w-[34rem]">
            <h2 id="matara-title" className="font-display text-[clamp(2.6rem,4.2vw,4rem)] leading-none font-medium text-ivory italic">
              Why Matara?
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">
              A fast-growing tourism region with stunning beaches, rich culture and improved connectivity. Experience the best of Sri Lanka&apos;s southern coast — with both sunrise and sunset from the same unique hilltop location.
            </p>
          </div>
          <aside className="w-full max-w-[26rem] justify-self-start rounded-2xl bg-[#0e2433]/82 p-7 backdrop-blur-md sm:p-8 lg:justify-self-end">
            <h3 className="flex items-center gap-2.5 font-display text-[1.7rem] font-medium text-ivory">
              <Line className="size-6 text-pale-gold">
                <path d="M16 27s6.5-6.4 6.5-11a6.5 6.5 0 1 0-13 0c0 4.6 6.5 11 6.5 11z" />
                <circle cx="16" cy="16" r="2" />
              </Line>
              Ideally Located
            </h3>
            <ul className="mt-5 list-disc space-y-2.5 pl-5 text-[15.5px] leading-snug marker:text-pale-gold">
              <li>Mirissa — whale watching</li>
              <li>Weligama — surfing</li>
              <li>Talalla Beach — wellness retreat</li>
              <li>Polhena Beach — snorkelling & sea turtles</li>
            </ul>
          </aside>
        </div>
      </section>

      <section data-heritage-section="wellness" aria-labelledby="wellness-title" className="lg:grid lg:grid-cols-2">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-20 lg:pr-10 lg:pl-[max(2rem,calc((100vw-1520px)/2+2rem))]">
          <div className="w-full max-w-[40rem]">
            <h2 id="wellness-title" className="font-display text-[clamp(2.05rem,3.2vw,3rem)] leading-[1.1] font-medium tracking-[-0.02em] text-green">
              Wellness, Recreation & Relaxation
            </h2>
            <p className="mt-4 max-w-[34rem] text-[16px] leading-relaxed md:text-[17px]">A comprehensive wellness destination designed for healthy ageing, relaxation and enjoyment.</p>
            <ul className="mt-10 grid list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:grid-cols-3 xl:grid-cols-5">
              <Amenity icon={<Spa />} label="Spa & Massage" />
              <Amenity icon={<Pool />} label="Swimming Pool" />
              <Amenity icon={<Tub />} label="Hot Tubs" />
              <Amenity icon={<Sauna />} label="Sauna & Steam Rooms" />
              <Amenity icon={<Yoga />} label="Yoga & Meditation" />
              <Amenity icon={<Weights />} label="Fitness Centre" />
              <Amenity icon={<Stretch />} label="Physiotherapy Studio" />
              <Amenity icon={<Fish />} label="Fish Therapy" />
              <Amenity icon={<Bloom />} label="Beauty & Grooming" />
              <Amenity icon={<Trail />} label="Walking Trails & Viewpoints" />
            </ul>
          </div>
        </div>
        <figure className="relative min-h-[420px] lg:min-h-full">
          <img src="/destination-retirement/bedroom.jpg" alt="A bright bedroom opening onto a tropical garden" className="absolute inset-0 h-full w-full object-cover object-[center_40%]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/75 via-night/20 to-night/10" />
          <figcaption className="absolute right-6 bottom-8 left-6 max-w-[22rem] text-ivory sm:left-8 sm:bottom-10">
            <p className="font-display text-[clamp(2rem,3vw,2.75rem)] leading-[1.05] font-medium">50 Private Chalets</p>
            <p className="mt-3 text-[16px] leading-relaxed text-ivory/95">Spacious, accessible and luxurious accommodation for your comfort and independence.</p>
          </figcaption>
        </figure>
      </section>

      <section data-heritage-section="ecosystem" aria-labelledby="ecosystem-title" className="lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <figure className="relative min-h-[420px] lg:min-h-[640px]">
          <img src="/destination-retirement/hero.jpg" alt="A cliffside pool looking out to the ocean" className="absolute inset-0 h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/75 via-night/15 to-transparent" />
          <figcaption className="absolute right-6 bottom-8 left-6 max-w-[18rem] font-display text-[clamp(1.85rem,2.6vw,2.45rem)] leading-[1.08] font-medium text-ivory italic sm:left-8 sm:bottom-10">
            More than a stay.
            <span className="block">It&apos;s a complete lifestyle.</span>
          </figcaption>
        </figure>
        <div className="grid items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:py-20 lg:pr-[max(2rem,calc((100vw-1520px)/2+2rem))] lg:pl-12">
          <div className="max-w-[24rem]">
            <h2 id="ecosystem-title" className="font-display text-[clamp(2rem,3vw,2.7rem)] leading-[1.08] font-medium tracking-[-0.02em] text-green">
              The Village 60 Plus Ecosystem
            </h2>
            <p className="mt-4 text-[16px] leading-snug font-semibold">One integrated platform. Every service.</p>
            <p className="mt-3 text-[16px] leading-relaxed">
              From healthcare coordination to lifestyle experiences, The Heritage connects with the wider Village 60 Plus network to bring you seamless care and personalised support.
            </p>
            <Link href="/living-and-care" className={`${goldButton} mt-6`}>
              Explore our services
              <Arrow />
            </Link>
          </div>
          <ul className="grid list-none gap-4 p-0">
            <Service icon={<House />} label="Retirement Accommodation" />
            <Service icon={<Care />} label="Healthcare Partners" />
            <Service icon={<Stretch />} label="Physiotherapy & Wellness" />
            <Service icon={<Car />} label="Transport Services" />
            <Service icon={<Bell />} label="Concierge & Lifestyle Management" />
            <Service icon={<Bed />} label="Respite Services" />
            <Service icon={<Sprout />} label="Digital Platform (Silver Roots)" />
            <Service icon={<Spark />} label="AI Support (SAGE)" />
            <Service icon={<Nodes />} label="Management System (ONE)" />
          </ul>
        </div>
      </section>

      <section data-heritage-section="launch" aria-labelledby="launch-title" className="relative overflow-hidden bg-green text-ivory on-dark">
        <svg viewBox="0 0 220 180" className="pointer-events-none absolute -bottom-8 -left-6 hidden h-52 w-64 text-pale-gold/25 lg:block" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
          <path d="M30 160c40-20 70-70 60-130" />
          <path d="M78 120c-28-6-48-28-54-52 24 6 42 24 54 52z" />
          <path d="M86 96c24-10 46-32 50-58-22 8-38 28-50 58z" />
          <path d="M70 78c-22-8-36-26-38-46 18 6 30 22 38 46z" />
        </svg>
        <div className="relative mx-auto grid w-full max-w-[1520px] items-center gap-10 gutter py-14 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-14 lg:py-16">
          <Wordmark place={false} compact />
          <div className="max-w-[34rem] lg:mx-auto lg:text-center">
            <h2 id="launch-title" className={`${scriptFace} text-[clamp(1.85rem,3vw,2.65rem)] leading-[1.2]`}>
              The Beginning of Destination Retirement
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ivory/92 md:text-[16px]">
              Join us in 2027 for the launch of The Heritage — the first destination under the Destination Retirement by Village 60 Plus.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <EnquiryButton kind="destination-retirement" context="The Heritage, Matara" className={outlineButton}>
              Register your interest
              <Arrow />
            </EnquiryButton>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-pale-gold uppercase">Matara • Sri Lanka</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Spa() {
  return (
    <>
      <circle cx="22" cy="9" r="2" />
      <path d="M18 13c2.2.8 4.4.8 6.4 0M7 23h16M9 23v-2.5A6 6 0 0 1 15 14.5h1" />
    </>
  );
}
function Pool() {
  return (
    <>
      <path d="M6 13h20v7H6z" />
      <path d="M6 16.5c2 .9 3.5.9 5.5 0s3.5-.9 5.5 0 3.5.9 5.5 0 3.5-.9 3.5 0" />
    </>
  );
}
function Tub() {
  return (
    <>
      <path d="M8 16h16v5a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5z" />
      <path d="M12 14c.2-2 .8-3.2.4-5M16.2 14c.2-2 .8-3.2.4-5M20.4 14c.2-2 .8-3.2.4-5" />
    </>
  );
}
function Sauna() {
  return (
    <>
      <path d="M12 7h9v18h-9z" />
      <path d="M17.5 16h1.6" />
      <path d="M8 11c-1.2 1.6-1.2 3 0 4.8M5.8 13c-1.2 1.6-1.2 3 0 4.8" />
    </>
  );
}
function Yoga() {
  return (
    <>
      <circle cx="16" cy="8" r="2" />
      <path d="M16 10.2V16M9.5 21.5c2.2-3.4 4.4-4.8 6.5-4.8s4.3 1.4 6.5 4.8M11.5 15.5C9 17.2 7 18.2 5.5 18.4M20.5 15.5c2.5 1.7 4.5 2.7 6 2.9" />
    </>
  );
}
function Weights() {
  return (
    <>
      <path d="M9 16h14" />
      <path d="M6.5 12.5v7M10 11v10M22 11v10M25.5 12.5v7" />
    </>
  );
}
function Stretch() {
  return (
    <>
      <circle cx="20" cy="8" r="2" />
      <path d="M19.5 10.2 16 18l-5 7M16 18l6 7M16 14.5h6" />
    </>
  );
}
function Fish() {
  return (
    <>
      <path d="M7 16c5.5-5.5 11-5.2 15-2.2-3.4 1.6-3.4 5 0 6.6C18 23.2 12.5 21.5 7 16z" />
      <path d="M22 14.2 27.5 10v12L22 17.8" />
      <circle cx="12" cy="15.4" r="0.7" fill="currentColor" stroke="none" />
    </>
  );
}
function Bloom() {
  return (
    <>
      <circle cx="16" cy="16" r="2" />
      <path d="M16 13.6c1.5-1.8 1.5-4 0-6.2-1.5 2.2-1.5 4.4 0 6.2zM16 18.4c1.5 1.8 1.5 4 0 6.2-1.5-2.2-1.5-4.4 0-6.2zM13.6 16c-1.8-1.5-4-1.5-6.2 0 2.2 1.5 4.4 1.5 6.2 0zM18.4 16c1.8-1.5 4-1.5 6.2 0-2.2 1.5-4.4 1.5-6.2 0z" />
    </>
  );
}
function Trail() {
  return (
    <>
      <path d="M4 24.5 11 14l5 6 4-5 8 9.5" />
      <circle cx="23" cy="9" r="2" />
    </>
  );
}
function House() {
  return (
    <>
      <path d="M6 14.5 16 6l10 8.5" />
      <path d="M9 13.8V26h14V13.8" />
    </>
  );
}
function Care() {
  return (
    <>
      <circle cx="11.5" cy="11" r="2.2" />
      <path d="M6.5 23.5c.7-3.4 2.6-5.2 5-5.2s4.3 1.8 5 5.2" />
      <path d="M22 12.5v8M18 16.5h8" />
    </>
  );
}
function Car() {
  return (
    <>
      <path d="M5 19h22M8 19l2.2-6h11.6L24 19" />
      <circle cx="10" cy="22.4" r="1.5" />
      <circle cx="22" cy="22.4" r="1.5" />
    </>
  );
}
function Bell() {
  return (
    <>
      <path d="M16 7a5 5 0 0 0-5 5v5l-1.6 2.6h13.2L21 17v-5a5 5 0 0 0-5-5z" />
      <path d="M10 22h12M14.4 24.2a1.6 1.6 0 0 0 3.2 0" />
    </>
  );
}
function Bed() {
  return (
    <>
      <path d="M6 25V13M6 19h18a3 3 0 0 1 3 3v3" />
      <circle cx="11" cy="16" r="1.6" />
    </>
  );
}
function Sprout() {
  return (
    <>
      <path d="M16 26V14" />
      <path d="M16 18c-4-.8-7-4-8-8 5 .2 8 3.2 8 8zM16 16c4-.8 7-4.8 7-8.8-5 .8-7 4-7 8.8z" />
    </>
  );
}
function Spark() {
  return (
    <>
      <path d="M16 5.5v4.2M16 22.3V26.5M5.5 16h4.2M22.3 16h4.2M8.8 8.8l3 3M20.2 20.2l3 3M23.2 8.8l-3 3M11.8 20.2l-3 3" />
      <circle cx="16" cy="16" r="2.1" />
    </>
  );
}
function Nodes() {
  return (
    <>
      <circle cx="10" cy="16" r="3" />
      <circle cx="22" cy="11" r="3" />
      <circle cx="22" cy="22" r="3" />
      <path d="M13 15.2 19 12.2M13 16.8 19 20.6" />
    </>
  );
}
