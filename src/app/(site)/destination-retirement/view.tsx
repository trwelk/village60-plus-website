import Link from 'next/link';
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';

const goldButton =
  'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-pale-gold px-5 text-[12px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold';
const ghostButton =
  'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] border border-ivory/80 px-5 text-[12px] font-semibold tracking-[0.14em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-white/10';
const textLink =
  'inline-flex min-h-11 items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-bronze uppercase no-underline transition-colors duration-(--duration-fast) hover:text-green';

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

function Headline({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-display text-[clamp(2.45rem,4vw,4rem)] leading-[1.02] font-medium tracking-[-0.02em] text-green">
      {children}
    </h2>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className="size-8 text-bronze" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
      {children}
    </svg>
  );
}

const stroke = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function Feature({ icon, label, href }: { icon: ReactNode; label: string; href?: string }) {
  const body = (
    <>
      <Icon>{icon}</Icon>
      <span className="max-w-[11rem] text-[15px] leading-snug">{label}</span>
    </>
  );
  if (!href) {
    return <li className="flex flex-col items-center gap-3 px-3 py-8 text-center">{body}</li>;
  }
  return (
    <li>
      <Link href={href} className="flex h-full flex-col items-center gap-3 px-3 py-8 text-center text-charcoal no-underline hover:text-green">
        {body}
      </Link>
    </li>
  );
}

export function DestinationRetirementView() {
  return (
    <main id="main" className="bg-ivory text-charcoal">
      <section data-dr-section="hero" aria-labelledby="page-title" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
        <img src="/destination-retirement/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/78 via-night/32 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/35 via-transparent to-night/45" />
        <div className="relative z-10 w-full pt-32 pb-16">
          <div className="mx-auto w-full max-w-[1520px] gutter">
            <div className="max-w-[40rem]">
              <Eyebrow light>Destination Retirement</Eyebrow>
              <h1 id="page-title" className="mt-4 max-w-[48rem] font-display text-[clamp(2.6rem,4.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.02em] text-ivory">
                Your Next Chapter
                <span className="block md:whitespace-nowrap">Could Be Somewhere</span>
                Extraordinary.
              </h1>
              <p className="mt-6 max-w-[36rem] text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">
                Retirement can be more than staying where you&apos;ve always been. Discover beautiful places to stay, new experiences and a different way to enjoy later life with the reassurance of Village 60 Plus behind you.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ivory md:text-[17px]">Stay for a while. Stay for longer. Make yourself at home.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#destinations" className={goldButton}>
                  Explore destinations
                  <Arrow />
                </Link>
                <EnquiryButton kind="destination-retirement" context="Destination Retirement" className={ghostButton}>
                  Plan your stay
                  <Arrow />
                </EnquiryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-dr-section="destinations" aria-labelledby="destinations-title" id="destinations" className="scroll-mt-8">
        <div className="mx-auto w-full max-w-[1520px] gutter py-16 lg:py-24">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div>
              <Eyebrow>Our destinations</Eyebrow>
              <Headline id="destinations-title">
                Beautiful Places.
                <span className="block">Brighter Days.</span>
              </Headline>
            </div>
            <div className="max-w-[36rem] lg:justify-self-end">
              <p className="text-[16px] leading-relaxed md:text-[17px]">
                From the tropical beauty of Sri Lanka to handpicked international destinations, we create retirement experiences in places where life feels a little easier and a lot more enjoyable.
              </p>
              <Link href="#destination-list" className={`${textLink} mt-5`}>
                Explore all destinations
                <Arrow />
              </Link>
            </div>
          </div>
          <ul id="destination-list" className="mt-12 grid list-none gap-5 p-0 md:grid-cols-2">
            <DestinationCard
              image="/destination-retirement/sri-lanka.jpg"
              imageAlt="Palm trees along a pale tropical beach"
              title="Sri Lanka"
              text="Beaches, culture, nature and a warmer way of life."
              context="Destination Retirement, Sri Lanka"
            />
          </ul>
        </div>
      </section>

      <section data-dr-section="promises" aria-label="What a stay includes" className="border-y border-stone">
        <ul className="mx-auto grid w-full max-w-[1520px] list-none grid-cols-2 p-0 sm:grid-cols-3 lg:grid-cols-5">
          <Feature icon={<House />} label="Beautiful Accommodation" />
          <Feature icon={<Lotus />} label="Wellness & Spa Experiences" />
          <Feature icon={<Car />} label="Transport & Concierge" />
          <Feature icon={<Heart />} label="Health & Wellbeing Support" />
          <Feature icon={<Nodes />} label="Connected Services via Silver Roots" href="/silver-roots" />
        </ul>
      </section>

      <section data-dr-section="lifestyle" id="lifestyle" aria-labelledby="lifestyle-title" className="scroll-mt-8 lg:grid lg:grid-cols-2">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-24 lg:pr-14 lg:pl-[max(2rem,calc((100vw-1520px)/2+2rem))]">
          <div className="max-w-[34rem]">
            <Eyebrow>A different way to retire</Eyebrow>
            <Headline id="lifestyle-title">
              Don&apos;t Just Retire.
              <span className="block">Go Somewhere.</span>
            </Headline>
            <p className="mt-6 text-[16px] leading-relaxed md:text-[17px]">
              You&apos;ve spent years working, building a life and looking after responsibilities. This chapter can be different. Spend a few weeks somewhere beautiful, escape the winter, or discover a place that feels like a second home.
            </p>
            <Link href="#places" className={`${goldButton} mt-8`}>
              Discover the lifestyle
              <Arrow />
            </Link>
          </div>
        </div>
        <div className="relative min-h-[70vw] lg:min-h-[640px]">
          <img src="/destination-retirement/beach.jpg" alt="A quiet beach at sunset" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </section>

      <section data-dr-section="places" id="places" aria-labelledby="places-title" className="scroll-mt-8 lg:grid lg:grid-cols-2">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:order-2 lg:py-24 lg:pr-[max(2rem,calc((100vw-1520px)/2+2rem))] lg:pl-14">
          <div className="max-w-[36rem]">
            <Eyebrow>Places to stay</Eyebrow>
            <Headline id="places-title">Find Your Kind of Place.</Headline>
            <p className="mt-6 text-[16px] leading-relaxed md:text-[17px]">
              Villas, apartments, resorts, boutique properties and serviced residences, all carefully selected for longer, more comfortable stays.
            </p>
            <ul className="mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
              <PlaceThumb src="/destination-retirement/villa.jpg" label="Villas" />
              <PlaceThumb src="/destination-retirement/resort.jpg" label="Resorts" />
              <PlaceThumb src="/destination-retirement/serviced.jpg" label="Serviced Residences" />
              <PlaceThumb src="/destination-retirement/partner.jpg" label="Partner Properties" />
            </ul>
            <EnquiryButton kind="destination-retirement" context="Destination Retirement, places to stay" className={`${textLink} mt-6`}>
              Explore places to stay
              <Arrow />
            </EnquiryButton>
          </div>
        </div>
        <div className="relative min-h-[70vw] lg:order-1 lg:min-h-[680px]">
          <img src="/destination-retirement/bedroom.jpg" alt="A bright bedroom opening onto a tropical garden" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </section>

      <section data-dr-section="wellness" id="wellness" aria-labelledby="wellness-title" className="scroll-mt-8 lg:grid lg:grid-cols-2">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-24 lg:pr-14 lg:pl-[max(2rem,calc((100vw-1520px)/2+2rem))]">
          <div className="max-w-[34rem]">
            <Eyebrow>Wellness & experiences</Eyebrow>
            <Headline id="wellness-title">Time to Actually Relax.</Headline>
            <p className="mt-6 text-[16px] leading-relaxed md:text-[17px]">
              From wellness retreats and spa days to Ayurveda therapies, fish therapy, yoga and personalised experiences, we connect you with the best of relaxation and wellbeing.
            </p>
            <EnquiryButton kind="destination-retirement" context="Destination Retirement, wellness" className={`${textLink} mt-6`}>
              Explore wellness experiences
              <Arrow />
            </EnquiryButton>
          </div>
        </div>
        <div className="relative min-h-[70vw] lg:min-h-[620px]">
          <img src="/destination-retirement/spa.jpg" alt="A spa treatment in a quiet treatment room" className="absolute inset-0 h-full w-full object-cover object-[center_30%]" />
        </div>
      </section>

      <section data-dr-section="support" id="support" aria-labelledby="support-title" className="scroll-mt-8 border-t border-stone">
        <div className="mx-auto grid w-full max-w-[1520px] items-center gap-12 gutter py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-24">
          <div>
            <Eyebrow>Seamless support</Eyebrow>
            <Headline id="support-title">Everything Around You.</Headline>
            <p className="mt-6 max-w-[34rem] text-[16px] leading-relaxed md:text-[17px]">
              From airport arrivals and drivers to meals, shopping, appointments and personalised assistance, we help organise the details so you can simply enjoy your stay.
            </p>
            <Link href="/silver-roots" className={`${textLink} mt-6`}>
              Explore our services
              <Arrow />
            </Link>
          </div>
          <ul className="grid list-none grid-cols-2 gap-x-4 gap-y-9 p-0 sm:grid-cols-3 lg:grid-cols-5">
            <Feature icon={<Plane />} label="Airport Transfers" />
            <Feature icon={<Car />} label="Private Transport" />
            <Feature icon={<Dining />} label="Meals & Dining" />
            <Feature icon={<Bag />} label="Shopping & Errands" />
            <Feature icon={<Lotus />} label="Spa & Wellness" />
            <Feature icon={<Laundry />} label="Housekeeping & Laundry" />
            <Feature icon={<Calendar />} label="Appointments & Escorts" />
            <Feature icon={<Pulse />} label="Health Support" />
            <Feature icon={<Bell />} label="Concierge Services" />
            <Feature icon={<Compass />} label="Tours & Excursions" />
          </ul>
        </div>
      </section>

      <section data-dr-section="trial" aria-labelledby="trial-title" className="relative flex min-h-[78svh] items-end overflow-hidden bg-night text-ivory on-dark">
        <img src="/people/courtyard.jpg" alt="A caregiver walking with a resident across the courtyard" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/80 via-night/25 to-night/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/70 via-night/25 to-transparent" />
        <div className="relative z-10 w-full py-16 lg:py-20">
          <div className="mx-auto w-full max-w-[1520px] gutter">
            <div className="max-w-[36rem]">
              <Eyebrow light>Try before you decide</Eyebrow>
              <h2 id="trial-title" className="mt-3 font-display text-[clamp(2.45rem,4vw,4rem)] leading-[1.02] font-medium tracking-[-0.02em] text-ivory">
                Start With a Stay.
              </h2>
              <p className="mt-5 max-w-[34rem] text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">
                Come for a few weeks, experience the destination, try the services and see how it feels. Stay longer, come back next year or explore somewhere else.
              </p>
              <EnquiryButton kind="destination-retirement" context="Destination Retirement, trial stay" className={`${goldButton} mt-8`}>
                Plan a trial stay
                <Arrow />
              </EnquiryButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function DestinationCard({ image, imageAlt, title, text, context }: { image: string; imageAlt: string; title: string; text: string; context: string }) {
  return (
    <li className="relative min-h-[320px] overflow-hidden sm:min-h-[420px]">
      <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/80 via-night/15 to-transparent" />
      <div className="relative flex h-full min-h-[320px] flex-col justify-end p-6 pr-20 text-ivory sm:min-h-[420px] sm:p-8 sm:pr-24">
        <h3 className="font-display text-[28px] tracking-[0.04em] text-ivory uppercase md:text-[32px]">{title}</h3>
        <p className="mt-2 max-w-[24rem] text-[15px] leading-snug text-ivory/95 md:text-[16px]">{text}</p>
      </div>
      <EnquiryButton
        kind="destination-retirement"
        context={context}
        className="absolute right-5 bottom-5 inline-flex size-11 items-center justify-center rounded-full bg-night/50 text-ivory backdrop-blur-sm transition-colors duration-(--duration-fast) hover:bg-night/70"
      >
        <span className="visually-hidden">Enquire about {title}</span>
        <Arrow />
      </EnquiryButton>
    </li>
  );
}

function PlaceThumb({ src, label }: { src: string; label: string }) {
  return (
    <li>
      <figure>
        <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
        <figcaption className="mt-2 text-center text-[12px] leading-snug font-medium">{label}</figcaption>
      </figure>
    </li>
  );
}

function House() {
  return <path {...stroke} d="M6 14.5 16 6l10 8.5M8 13.5V26h6v-6h4v6h6V13.5" />;
}
function Lotus() {
  return (
    <>
      <circle cx="16" cy="16" r="2" />
      <path {...stroke} d="M16 13.5c1.6-1.8 1.6-4 0-6.2-1.6 2.2-1.6 4.4 0 6.2zM16 18.5c1.6 1.8 1.6 4 0 6.2-1.6-2.2-1.6-4.4 0-6.2zM13.5 16c-1.8-1.6-4-1.6-6.2 0 2.2 1.6 4.4 1.6 6.2 0zM18.5 16c1.8-1.6 4-1.6 6.2 0-2.2 1.6-4.4 1.6-6.2 0z" />
    </>
  );
}
function Car() {
  return (
    <>
      <path {...stroke} d="M4 19h24M7.5 19 10 13h12l2.5 6M6 19v3M26 19v3" />
      <circle cx="10.5" cy="22" r="1.7" />
      <circle cx="21.5" cy="22" r="1.7" />
    </>
  );
}
function Heart() {
  return <path {...stroke} d="M16 26s-8-5-8-11a4.5 4.5 0 0 1 8-2.2A4.5 4.5 0 0 1 24 15c0 6-8 11-8 11z" />;
}
function Nodes() {
  return (
    <>
      <circle cx="10" cy="16" r="4" />
      <circle cx="22" cy="16" r="4" />
      <path {...stroke} d="M14 16h4" />
    </>
  );
}
function Plane() {
  return <path {...stroke} d="M4 16 28 7l-8 17-3-7z" />;
}
function Dining() {
  return <path {...stroke} d="M8 6v8a3 3 0 0 0 6 0V6M11 14v12M20 6v20M20 10h4a3 3 0 0 1 0 6h-4" />;
}
function Bag() {
  return <path {...stroke} d="M9 11h14l-1 15H10L9 11zM13 11V9a3 3 0 0 1 6 0v2" />;
}
function Laundry() {
  return <path {...stroke} d="M8 8h16v16H8zM8 13h16M16 19.5a3 3 0 1 0 0.01 0" />;
}
function Calendar() {
  return <path {...stroke} d="M8 8h16v16H8zM8 13h16M12 6v4M20 6v4" />;
}
function Pulse() {
  return <path {...stroke} d="M4 16h6l2-5 4 10 2-5h10" />;
}
function Bell() {
  return <path {...stroke} d="M8 22h16M16 6a6 6 0 0 0-6 6v6l-2 3h16l-2-3v-6a6 6 0 0 0-6-6zM14 25a2 2 0 0 0 4 0" />;
}
function Compass() {
  return (
    <>
      <circle cx="16" cy="16" r="10" />
      <path {...stroke} d="m13 19 2-6 6-2-2 6z" />
    </>
  );
}
