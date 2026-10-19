import Link from 'next/link';
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';

const goldButton =
  'inline-flex min-h-11 w-fit items-center gap-2.5 rounded-full bg-pale-gold px-6 text-[12px] font-semibold tracking-[0.16em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold';
const outlineButton =
  'inline-flex min-h-12 w-fit items-center gap-2.5 rounded-full border border-ivory/75 px-6 text-[12px] font-semibold tracking-[0.16em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-white/10';
const scriptFace = '[font-family:var(--font-grove-script,cursive)]';

const ENTRANCE = '/look-to-the-future/grove.jpg';
const AERIAL = '/look-to-the-future/grove-aerial.jpg';

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
      <p className={`text-center font-display font-medium whitespace-nowrap text-ivory uppercase ${compact ? 'text-[1.15rem] tracking-[0.14em]' : 'text-[clamp(1.2rem,2.4vw,2.05rem)] tracking-[0.16em]'}`}>The Grove</p>
      <p className={`mt-1 text-center text-ivory/90 ${compact ? 'text-[13px]' : 'text-[14px]'}`}>by Village 60 Plus</p>
      {place ? <p className="mt-2 text-center text-[11px] font-semibold tracking-[0.28em] text-pale-gold uppercase">Kottawa • Sri Lanka</p> : null}
    </div>
  );
}

function Amenity({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <li className="flex flex-col items-center gap-2.5 text-center">
      <Line className="size-8 text-gold">{icon}</Line>
      <span className="max-w-[8.5rem] text-[13px] leading-snug">{label}</span>
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

export function GroveView({ scriptFontClassName = '' }: { scriptFontClassName?: string }) {
  return (
    <main id="main" className={`bg-ivory text-charcoal ${scriptFontClassName}`}>
      <section data-grove-section="hero" aria-labelledby="page-title" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-night text-ivory on-dark">
        <img
          src={ENTRANCE}
          alt="The Grove entrance at dusk, with timber gates and an illuminated sign on a stone wall"
          className="absolute inset-0 h-full w-full object-cover object-[18%_78%] md:object-[68%_center]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/72 via-night/28 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/75 via-night/25 to-night/40 md:from-night/45 md:via-transparent" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1520px] flex-1 flex-col gutter pt-28 pb-28 md:pb-20 lg:pt-32">
          <div className="relative">
            <p className="mb-6 text-right text-[11px] font-semibold tracking-[0.22em] text-ivory uppercase sm:text-[12px] sm:tracking-[0.28em] lg:absolute lg:top-3 lg:right-0 lg:mb-0">Kottawa</p>
            <div className="flex justify-center lg:justify-start">
              <Wordmark />
            </div>
          </div>
          <div className="mt-10 grid items-end gap-8 md:mt-auto md:gap-10 md:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-20">
            <div className="max-w-[38rem]">
              <h1 id="page-title" className="font-display text-[clamp(2.35rem,3.35vw,3.55rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ivory [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]">
                A New Chapter
                <span className="block">in Kottawa.</span>
              </h1>
              <p className="mt-5 max-w-[36rem] text-[11px] font-semibold tracking-[0.14em] text-ivory/95 uppercase sm:text-[12px] sm:tracking-[0.18em]">
                40 private rooms • Landscaped surroundings • A connected community
              </p>
              <Link href="#residence" className={`${goldButton} mt-7`}>
                Discover The Grove
                <Arrow />
              </Link>
            </div>
            <p className={`${scriptFace} hidden text-[clamp(1.85rem,3vw,2.7rem)] leading-[1.15] text-ivory [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] md:block lg:text-right`}>
              Purpose-Built Living.
              <span className="block">A Connected Community.</span>
            </p>
          </div>
        </div>
      </section>

      <section data-grove-section="residence" id="residence" aria-labelledby="residence-title" className="relative scroll-mt-8 overflow-hidden">
        <Botanical />
        <div className="mx-auto grid w-full max-w-[1520px] items-center gap-10 gutter py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-24">
          <div className="max-w-[36rem] lg:pl-8">
            <p className="text-[12px] font-semibold tracking-[0.22em] text-bronze uppercase">Kottawa</p>
            <h2 id="residence-title" className="mt-3 font-display text-[clamp(2.15rem,3.4vw,3.35rem)] leading-[1.08] font-medium tracking-[-0.02em] text-green">
              Two buildings. Forty rooms.
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed md:text-[17px]">
              Two elegant two-storey buildings with 40 rooms, set within landscaped surroundings. Building A holds 20 rooms across the ground and first floors. Building B holds 20 more, in the same arrangement.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed md:text-[17px]">
              Dining, lounges and a central garden sit between them, with a gated entrance, secure parking, and a safe, supportive setting for everyday life.
            </p>
          </div>
          <figure className="relative min-h-[320px] overflow-hidden sm:min-h-[420px] lg:min-h-[520px]">
            <img
              src={AERIAL}
              alt="Aerial view of The Grove in Kottawa, two long buildings set in a landscaped garden"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
            <figcaption className="absolute right-6 bottom-6 text-right text-ivory sm:right-8 sm:bottom-8">
              <p className="font-display text-[clamp(1.7rem,2.4vw,2.35rem)] leading-tight font-medium text-ivory italic">Purpose-Built Living.</p>
              <p className={`${scriptFace} text-[clamp(1.7rem,2.6vw,2.45rem)] leading-none`}>A Connected Community.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section data-grove-section="grounds" aria-labelledby="grounds-title" className="relative flex min-h-[560px] items-center overflow-hidden bg-night text-ivory on-dark">
        <img src={ENTRANCE} alt="Timber gates at The Grove, opening onto the garden" className="absolute inset-0 h-full w-full object-cover object-[8%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/80 via-night/45 to-transparent" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1520px] items-center gap-10 gutter py-16 lg:py-24">
          <div className="max-w-[34rem]">
            <h2 id="grounds-title" className="font-display text-[clamp(2.6rem,4.2vw,4rem)] leading-none font-medium text-ivory italic">
              A warm welcome every day.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">
              A gated entrance, a central garden, and a clubhouse among the landscaping. Green, open and peaceful — with room to relax, socialise and enjoy.
            </p>
            <aside className="mt-8 w-full max-w-[26rem] rounded-2xl bg-[#0e2433]/82 p-7 backdrop-blur-md sm:p-8">
              <h3 className="flex items-center gap-2.5 font-display text-[1.7rem] font-medium text-ivory">
                <Line className="size-6 text-pale-gold">
                  <path d="M16 27s6.5-6.4 6.5-11a6.5 6.5 0 1 0-13 0c0 4.6 6.5 11 6.5 11z" />
                  <circle cx="16" cy="16" r="2" />
                </Line>
                On the grounds
              </h3>
              <ul className="mt-5 list-disc space-y-2.5 pl-5 text-[15.5px] leading-snug marker:text-pale-gold">
                <li>Entrance & security — a warm welcome every day</li>
                <li>Central garden — green, open and peaceful</li>
                <li>Clubhouse & amenities — relax, socialise and enjoy</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section data-grove-section="features" aria-labelledby="features-title" className="lg:grid lg:grid-cols-2">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-20 lg:pr-10 lg:pl-[max(2rem,calc((100vw-1520px)/2+2rem))]">
          <div className="w-full max-w-[40rem]">
            <h2 id="features-title" className="font-display text-[clamp(2.05rem,3.2vw,3rem)] leading-[1.1] font-medium tracking-[-0.02em] text-green">
              Key features
            </h2>
            <p className="mt-4 max-w-[34rem] text-[16px] leading-relaxed md:text-[17px]">
              Forty private rooms, shared spaces, and the care of a landscaped, gated home.
            </p>
            <ul className="mt-10 grid list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:grid-cols-3">
              <Amenity icon={<Bed />} label="40 Private Rooms" />
              <Amenity icon={<Tree />} label="Landscaped Surroundings" />
              <Amenity icon={<Dining />} label="Dining & Social Spaces" />
              <Amenity icon={<Stretch />} label="Wellness & Recreation" />
              <Amenity icon={<Car />} label="Secure Parking" />
              <Amenity icon={<Shield />} label="Safe & Supportive Environment" />
            </ul>
          </div>
        </div>
        <figure className="relative min-h-[420px] lg:min-h-full">
          <img src={AERIAL} alt="The Grove from above, with the garden courts between the two buildings" className="absolute inset-0 h-full w-full object-cover object-[center_45%]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/75 via-night/20 to-night/10" />
          <figcaption className="absolute right-6 bottom-8 left-6 max-w-[22rem] text-ivory sm:left-8 sm:bottom-10">
            <p className="font-display text-[clamp(2rem,3vw,2.75rem)] leading-[1.05] font-medium">40 Private Rooms</p>
            <p className="mt-3 text-[16px] leading-relaxed text-ivory/95">20 rooms on the ground floor. 20 rooms on the first floor. Each one ensuite.</p>
          </figcaption>
        </figure>
      </section>

      <section data-grove-section="community" aria-labelledby="community-title" className="lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <figure className="relative min-h-[420px] lg:min-h-[640px]">
          <img src={ENTRANCE} alt="The illuminated Grove sign on the stone entrance wall" className="absolute inset-0 h-full w-full object-cover object-[78%_center]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/75 via-night/15 to-transparent" />
          <figcaption className="absolute right-6 bottom-8 left-6 max-w-[18rem] font-display text-[clamp(1.85rem,2.6vw,2.45rem)] leading-[1.08] font-medium text-ivory italic sm:left-8 sm:bottom-10">
            Purpose-built living.
            <span className="block">A connected community.</span>
          </figcaption>
        </figure>
        <div className="grid items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:py-20 lg:pr-[max(2rem,calc((100vw-1520px)/2+2rem))] lg:pl-12">
          <div className="max-w-[24rem]">
            <h2 id="community-title" className="font-display text-[clamp(2rem,3vw,2.7rem)] leading-[1.08] font-medium tracking-[-0.02em] text-green">
              Purpose-Built Living
            </h2>
            <p className="mt-4 text-[16px] leading-snug font-semibold">A connected community.</p>
            <p className="mt-3 text-[16px] leading-relaxed">
              Rooms, garden, dining and wellness in one gated setting, with staff and service spaces close by.
            </p>
            <Link href="/living-and-care" className={`${goldButton} mt-6`}>
              Explore living & care
              <Arrow />
            </Link>
          </div>
          <ul className="grid list-none gap-4 p-0">
            <Service icon={<Bed />} label="40 Ensuite Rooms (20 Down, 20 Up)" />
            <Service icon={<Tree />} label="Central Landscaped Garden" />
            <Service icon={<Dining />} label="Dining Area" />
            <Service icon={<Lounge />} label="Lounge & Activity Spaces" />
            <Service icon={<Stretch />} label="Wellness / Physiotherapy Room" />
            <Service icon={<Pool />} label="Swimming Pool" />
            <Service icon={<House />} label="Clubhouse / Multi-Purpose Area" />
            <Service icon={<Kitchen />} label="Kitchen & Service Areas" />
            <Service icon={<Care />} label="Staff Facilities" />
            <Service icon={<Car />} label="Secure Parking" />
            <Service icon={<Shield />} label="Gated Entrance" />
          </ul>
        </div>
      </section>

      <section data-grove-section="launch" aria-labelledby="launch-title" className="relative overflow-hidden bg-green text-ivory on-dark">
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
              A new chapter in Kottawa
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ivory/92 md:text-[16px]">
              Register your interest in The Grove — forty private rooms, landscaped surroundings, and a connected community.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <EnquiryButton kind="grove-interest" context="The Grove, Kottawa" className={outlineButton}>
              Register your interest
              <Arrow />
            </EnquiryButton>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-pale-gold uppercase">Kottawa • Sri Lanka</p>
          </div>
        </div>
      </section>
    </main>
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
function Tree() {
  return (
    <>
      <path d="M16 26V15" />
      <path d="M16 20c-6-.6-10-5-11-10 7 .6 10 5.2 11 10zM16 17.5c6-.6 10-5.4 10-10.4-7 .8-10 5.2-10 10.4z" />
    </>
  );
}
function Dining() {
  return (
    <>
      <path d="M9 7v8a3 3 0 0 0 3 3v7M12 7v5M15 7v5" />
      <path d="M21 7c1.6 3.2 1.6 6.4 0 11v7" />
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
function Car() {
  return (
    <>
      <path d="M5 19h22M8 19l2.2-6h11.6L24 19" />
      <circle cx="10" cy="22.4" r="1.5" />
      <circle cx="22" cy="22.4" r="1.5" />
    </>
  );
}
function Shield() {
  return <path d="M16 6 25 9.5v7.2c0 5.2-3.4 8.4-9 10.3-5.6-1.9-9-5.1-9-10.3V9.5z" />;
}
function Lounge() {
  return (
    <>
      <path d="M6 16v6h20v-6" />
      <path d="M8 16V12a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4" />
      <path d="M6 22v2M26 22v2" />
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
function House() {
  return (
    <>
      <path d="M6 14.5 16 6l10 8.5" />
      <path d="M9 13.8V26h14V13.8" />
    </>
  );
}
function Kitchen() {
  return (
    <>
      <path d="M8 14h16v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" />
      <path d="M12 14V9M16 14V8M20 14V9" />
    </>
  );
}
function Care() {
  return (
    <>
      <circle cx="16" cy="10" r="2.4" />
      <path d="M10 25c.8-4 2.8-6.2 6-6.2s5.2 2.2 6 6.2" />
    </>
  );
}
