import Link from 'next/link';
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';

const filled =
  'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[4px] bg-green px-5 text-[12px] font-semibold tracking-[0.14em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-night';
const heroGold =
  'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-pale-gold px-5 text-[12px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold';
const heroGhost =
  'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] border border-ivory/80 px-5 text-[12px] font-semibold tracking-[0.14em] text-ivory uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-white/10';

const pathCard =
  'flex h-full flex-col rounded-2xl border border-stone bg-paper p-6 text-left text-charcoal no-underline shadow-[0_10px_28px_rgba(32,33,31,0.05)] transition-colors duration-(--duration-fast) hover:border-green/40';

type IconName =
  | 'home'
  | 'heart'
  | 'people'
  | 'grid'
  | 'shield'
  | 'pin'
  | 'screen'
  | 'search'
  | 'clipboard'
  | 'calendar'
  | 'card'
  | 'chat'
  | 'family';

const ICON: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M6 14.5 16 6l10 8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13.2V25h14V13.2" strokeLinejoin="round" />
      <path d="M14 25v-5.5h4V25" strokeLinejoin="round" />
    </>
  ),
  heart: <path d="M16 26s-7.2-4.4-7.2-9.4a4 4 0 0 1 7.2-2.4 4 4 0 0 1 7.2 2.4C23.2 21.6 16 26 16 26z" strokeLinejoin="round" />,
  people: (
    <>
      <circle cx="12" cy="11" r="2.4" />
      <circle cx="20.5" cy="12" r="2" />
      <path d="M6.5 23.5v-1.2c0-2.4 2.2-4.2 5.5-4.2s5.5 1.8 5.5 4.2v1.2" strokeLinecap="round" />
      <path d="M17.5 18.4c1.8-.4 3.8.1 5 1.6 1 1.2 1.4 2.4 1.4 3.5v1" strokeLinecap="round" />
    </>
  ),
  grid: (
    <>
      <rect x="6" y="6" width="8" height="8" rx="1.5" />
      <rect x="18" y="6" width="8" height="8" rx="1.5" />
      <rect x="6" y="18" width="8" height="8" rx="1.5" />
      <rect x="18" y="18" width="8" height="8" rx="1.5" />
    </>
  ),
  shield: (
    <>
      <path d="M16 5.5 25 9v7.2c0 5.2-3.6 8.6-9 10.3-5.4-1.7-9-5.1-9-10.3V9l9-3.5z" strokeLinejoin="round" />
      <path d="M12.2 16.2 14.8 18.8 20 13.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  pin: (
    <>
      <path d="M16 27s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" strokeLinejoin="round" />
      <circle cx="16" cy="15" r="2.2" />
    </>
  ),
  screen: (
    <>
      <rect x="6" y="7" width="20" height="14" rx="2" />
      <path d="M12 25h8M16 21v4" strokeLinecap="round" />
    </>
  ),
  search: (
    <>
      <circle cx="14" cy="14" r="6" />
      <path d="M18.5 18.5 24 24" strokeLinecap="round" />
    </>
  ),
  clipboard: (
    <>
      <rect x="8" y="7" width="16" height="19" rx="2" />
      <path d="M13 7.2h6V6a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 13 6v1.2z" />
      <path d="M12 15h8M12 19h6" strokeLinecap="round" />
    </>
  ),
  calendar: (
    <>
      <rect x="6" y="8" width="20" height="17" rx="2" />
      <path d="M6 13h20M11 5.5V9M21 5.5V9" strokeLinecap="round" />
    </>
  ),
  card: (
    <>
      <rect x="5" y="9" width="22" height="15" rx="2" />
      <path d="M5 14h22" />
    </>
  ),
  chat: <path d="M8 8h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H14l-5 4v-4H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" strokeLinejoin="round" />,
  family: (
    <>
      <circle cx="16" cy="10" r="2.3" />
      <circle cx="9" cy="12.5" r="1.8" />
      <circle cx="23" cy="12.5" r="1.8" />
      <path d="M11.2 23.5v-1c0-2.1 2-3.6 4.8-3.6s4.8 1.5 4.8 3.6v1" strokeLinecap="round" />
      <path d="M6 23.5v-.6c0-1.6 1.2-2.8 3-3.1" strokeLinecap="round" />
      <path d="M26 23.5v-.6c0-1.6-1.2-2.8-3-3.1" strokeLinecap="round" />
    </>
  ),
};

const PATHS: Array<{ title: string; body: string; icon: IconName; href?: string }> = [
  {
    title: 'Find Care',
    body: 'Explore care homes, independent living, respite and specialised care across Sri Lanka.',
    icon: 'home',
    href: '/find-the-right-care',
  },
  {
    title: 'Services at Home',
    body: 'Get support at home with nursing, physiotherapy, meals, transport, housekeeping and more.',
    icon: 'heart',
    href: '#services',
  },
  {
    title: 'For Providers',
    body: 'Join our network and connect with people looking for care and support services.',
    icon: 'people',
  },
];

const REASONS: Array<{ title: string; icon: IconName }> = [
  { title: 'Wide Range of Options', icon: 'grid' },
  { title: 'Trusted Providers', icon: 'shield' },
  { title: 'Services for Every Need', icon: 'heart' },
  { title: 'Across Sri Lanka', icon: 'pin' },
  { title: 'Easy to Use Platform', icon: 'screen' },
  { title: 'By Village 60 Plus With Experience', icon: 'people' },
];

const SERVICES: Array<{ title: string; body: string; href: string; src: string; alt: string }> = [
  {
    title: 'Care Homes',
    body: 'Independent living, residential care and specialised support.',
    href: '/homes',
    src: '/silver-roots/care-homes.jpg',
    alt: 'An illuminated residence with a planted entrance at dusk',
  },
  {
    title: 'Home Care',
    body: 'Nursing, personal care, meals, housekeeping and more.',
    href: '/living-and-care',
    src: '/silver-roots/home-care.jpg',
    alt: 'A caregiver sitting with an older woman at home',
  },
  {
    title: 'Health & Wellbeing',
    body: 'Acupuncture, physiotherapy, medicine delivery and wellness services.',
    href: '/living-and-care#health',
    src: '/silver-roots/wellbeing.jpg',
    alt: 'A physiotherapy session in a bright clinic',
  },
  {
    title: 'Transport & Appointments',
    body: 'Assistance for medical appointments, shopping, social outings and more.',
    href: '/living-and-care#health',
    src: '/silver-roots/transport.jpg',
    alt: 'A dark car parked on a drive beside a home',
  },
  {
    title: 'Everyday Services',
    body: 'Groceries, errands, deliveries, concierge and lifestyle support.',
    href: '/contact',
    src: '/silver-roots/everyday.jpg',
    alt: 'A calm spa treatment room with white linens and soft daylight',
  },
];

const APP_ROWS: Array<{ title: string; icon: IconName }> = [
  { title: 'Find Care', icon: 'home' },
  { title: 'Services', icon: 'heart' },
  { title: 'Appointments', icon: 'calendar' },
  { title: 'Messages', icon: 'chat' },
  { title: 'Payments', icon: 'card' },
];

const APP_FEATURES: Array<{ title: string; icon: IconName }> = [
  { title: 'Find care options', icon: 'search' },
  { title: 'Track visits', icon: 'clipboard' },
  { title: 'Manage appointments', icon: 'calendar' },
  { title: 'Secure payments', icon: 'card' },
  { title: 'Family access', icon: 'family' },
  { title: 'For providers', icon: 'people' },
];

function Icon({ name, className = 'size-6' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden="true">
      {ICON[name]}
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p className={onDark ? 'text-[12px] font-semibold tracking-[0.18em] text-ivory/80 uppercase' : 'text-[12px] font-semibold tracking-[0.18em] text-bronze uppercase'}>
      {children}
    </p>
  );
}

function IconMark({ name }: { name: IconName }) {
  return (
    <span className="inline-flex size-11 items-center justify-center rounded-full border border-stone text-green">
      <Icon name={name} className="size-5" />
    </span>
  );
}

function Photo({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 size-full object-cover"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );
}

function AppPhone() {
  return (
    <div className="mx-auto w-[min(100%,250px)] rounded-[2.1rem] border border-stone bg-paper p-2.5 shadow-panel" aria-hidden="true">
      <div className="overflow-hidden rounded-[1.6rem] bg-green text-ivory">
        <div className="flex items-center justify-between px-4 pt-3 text-[10px] text-ivory/70">
          <span>9:41</span>
          <span className="h-4 w-14 rounded-full bg-night/50" />
          <span>LTE</span>
        </div>
        <p className="px-4 pt-5 text-center text-[11px] font-semibold tracking-[0.22em]">SILVER ROOTS</p>
        <ul className="mt-5 space-y-1.5 px-3 pb-6">
          {APP_ROWS.map((row) => (
            <li key={row.title} className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-[13px]">
              <Icon name={row.icon} className="size-4" />
              {row.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PathBody({ title, body, icon }: { title: string; body: string; icon: IconName }) {
  return (
    <>
      <IconMark name={icon} />
      <h3 className="mt-5 font-display text-[22px] leading-snug">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-charcoal/75">{body}</p>
    </>
  );
}

export function SilverRootsView() {
  return (
    <main id="main">
      <section aria-labelledby="page-title" data-silver-section="hero" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
        <img
          src="/silver-roots/hero.jpg"
          alt="An older man and a caregiver sharing tea in a bright living room"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/78 via-night/32 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/35 via-transparent to-night/45" />
        <div className="relative z-10 w-full pt-32 pb-16">
          <div className="mx-auto w-full max-w-[1520px] gutter">
            <div className="max-w-[40rem]">
              <p className="text-[12px] font-semibold tracking-[0.22em] text-pale-gold uppercase">Care. Services. Support.</p>
              <h1 id="page-title" className="mt-4 font-display text-[clamp(2.6rem,4.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.02em] text-ivory">
                Everything You Need to Live Well. In One Place.
              </h1>
              <p className="mt-6 max-w-[36rem] text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">
                Silver Roots connects older adults and families with care homes, home care, health and wellbeing services and trusted providers across Sri Lanka.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/find-the-right-care" className={heroGold}>
                  Find the right option
                  <Arrow />
                </Link>
                <a href="#services" className={heroGhost}>
                  Explore services
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Where to begin" className="bg-ivory" data-silver-section="paths">
        <ul className="mx-auto grid max-w-site gap-5 gutter pt-10 pb-6 md:grid-cols-3 lg:pt-14 lg:pb-10">
          {PATHS.map((path) => (
            <li key={path.title}>
              {path.href ? (
                <Link href={path.href} className={pathCard}>
                  <PathBody title={path.title} body={path.body} icon={path.icon} />
                </Link>
              ) : (
                <div className={`relative ${pathCard}`}>
                  <PathBody title={path.title} body={path.body} icon={path.icon} />
                  <EnquiryButton
                    kind="silver-roots-partner"
                    context="Silver Roots"
                    className="absolute inset-0 rounded-2xl bg-transparent"
                  >
                    <span className="visually-hidden">For Providers. Join our network and connect with people looking for care and support services.</span>
                  </EnquiryButton>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="why-title" className="bg-ivory" data-silver-section="why">
        <div className="mx-auto max-w-site gutter py-14 lg:py-20">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <Eyebrow>Why Silver Roots</Eyebrow>
              <h2 id="why-title" className="mt-3 font-display text-[clamp(36px,4.2vw,54px)] leading-[1.05] font-medium">
                A Simpler Way{' '}
                <br />
                to Find Support.
              </h2>
            </div>
            <p className="max-w-[48ch] text-[17px] leading-relaxed text-charcoal/80 lg:justify-self-end">
              Whether you&apos;re planning ahead, looking for care for someone you love, or simply need a little help at home, Silver Roots makes it easier to find the right options, all in one place.
            </p>
          </div>
          <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-6">
            {REASONS.map((reason) => (
              <li key={reason.title} className="text-center text-green">
                <Icon name={reason.icon} className="mx-auto size-8" />
                <p className="mx-auto mt-4 max-w-[9.5rem] text-[14px] leading-snug text-charcoal">{reason.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="chapter-title" className="bg-paper" data-silver-section="chapter">
        <div className="grid items-center lg:grid-cols-2">
          <div className="mx-auto w-full max-w-[40rem] gutter py-14 lg:ml-auto lg:py-20 lg:pr-16">
            <Eyebrow>Explore what&apos;s possible</Eyebrow>
            <h2 id="chapter-title" className="mt-3 font-display text-[clamp(36px,4.2vw,54px)] leading-[1.05] font-medium">
              Support for{' '}
              <br />
              Every Chapter.
            </h2>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-charcoal/80">
              From later-living residences to home care, health and wellbeing services and everyday assistance, Silver Roots brings trusted options together so you can choose what works for you.
            </p>
            <div className="mt-8">
              <a href="#services" className={filled}>
                Explore all services
                <Arrow />
              </a>
            </div>
          </div>
          <div className="px-5 pb-12 sm:px-6 lg:py-16 lg:pr-8 lg:pl-2">
            <div className="relative min-h-[22rem] overflow-hidden rounded-[20px] lg:min-h-[32rem]">
              <Photo src="/silver-roots/garden.jpg" alt="An older couple walking through a tropical garden" />
            </div>
          </div>
        </div>
      </section>

      <section id="services" aria-labelledby="services-title" className="scroll-mt-8 bg-ivory" data-silver-section="services">
        <div className="mx-auto max-w-[1440px] gutter py-14 lg:py-20">
          <h2 id="services-title" className="text-[12px] font-semibold tracking-[0.18em] text-bronze uppercase">
            Our services
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {SERVICES.map((service) => (
              <li key={service.title}>
                <Link href={service.href} className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone bg-paper text-charcoal no-underline transition-colors duration-(--duration-fast) hover:border-green/40">
                  <div className="relative aspect-[4/3] bg-sand">
                    <Photo src={service.src} alt={service.alt} />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display text-[22px] leading-tight">{service.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-charcoal/75">{service.body}</p>
                    <span className="mt-5 inline-flex size-9 items-center justify-center self-end rounded-full border border-stone text-green">
                      <Arrow />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="app-title" className="bg-paper" data-silver-section="app">
        <div className="mx-auto grid max-w-site items-center gap-10 gutter py-14 lg:grid-cols-[240px_minmax(0,1fr)_280px] lg:gap-12 lg:py-20">
          <AppPhone />
          <div>
            <Eyebrow>Coming soon</Eyebrow>
            <h2 id="app-title" className="mt-3 font-display text-[clamp(34px,3.8vw,50px)] leading-[1.05] font-medium">
              The Silver Roots App.{' '}
              <br />
              Care. Connected.
            </h2>
            <p className="mt-5 max-w-[40ch] text-[17px] leading-relaxed text-charcoal/80">
              Manage care, services, appointments and more, all in one place.
            </p>
            <div className="mt-8">
              <EnquiryButton kind="general" context="Silver Roots app" className={filled}>
                Learn more
                <Arrow />
              </EnquiryButton>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-8">
            {APP_FEATURES.map((feature) => (
              <li key={feature.title} className="text-center text-green">
                <Icon name={feature.icon} className="mx-auto size-7" />
                <p className="mt-3 text-[14px] leading-snug text-charcoal">{feature.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="get-started" aria-labelledby="tomorrow-title" className="relative min-h-[32rem] overflow-hidden text-ivory on-dark" data-silver-section="close">
        <Photo src="/silver-roots/sunset.jpg" alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/75 via-night/45 to-night/15" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[32rem] max-w-site items-center gutter py-16">
          <div className="max-w-[34rem]">
            <Eyebrow onDark>One place to start</Eyebrow>
            <h2 id="tomorrow-title" className="mt-3 font-display text-[clamp(36px,4.4vw,58px)] leading-[1.05] font-medium text-ivory">
              A Brighter,{' '}
              <br />
              More Comfortable Tomorrow.
            </h2>
            <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-ivory/90">
              Silver Roots, by Village 60 Plus. Care. Services. Support. Connected for a better tomorrow.
            </p>
            <div className="mt-8">
              <EnquiryButton kind="general" context="Silver Roots" className={filled}>
                Get started
                <Arrow />
              </EnquiryButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
