import Link from 'next/link';
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { careServicePath } from '@/lib/routes';
import { PEOPLE_PHOTOS } from '@/lib/site-photos';
import { cn } from '@/lib/cn';

const HERO_TITLE = 'Support That Changes With You.';
const HERO_INTRO =
  'Different people. Different needs. The same purpose, to help you live well, with the right level of support around you.';
const HERO_IMAGE = '/living-and-care/hero.jpg';

type IconName = 'home' | 'building' | 'clock' | 'bed' | 'walk' | 'sprout' | 'lotus' | 'pin' | 'diamond';

const PORTRAIT = PEOPLE_PHOTOS.hands.src;
const WALK = PEOPLE_PHOTOS.courtyard.src;

const SERVICES: Array<{
  slug: string;
  name: string;
  strip: string;
  blurb: string;
  icon: IconName;
  src: string;
}> = [
  {
    slug: 'independent-living',
    name: 'Independent Living',
    strip: 'Independent\nLiving',
    blurb: 'A comfortable, secure home with the freedom to live your life, your way.',
    icon: 'home',
    src: PEOPLE_PHOTOS.lounge.src,
  },
  {
    slug: 'residential-care',
    name: 'Residential Living & Care',
    strip: 'Residential\nCare',
    blurb: 'Everyday support around you, in a secure and welcoming home.',
    icon: 'building',
    src: PORTRAIT,
  },
  {
    slug: 'respite-care',
    name: 'Respite Care',
    strip: 'Respite\nCare',
    blurb: 'Short-term stays for family breaks, recovery or additional support.',
    icon: 'clock',
    src: '/homes/tranquility/ward.jpg',
  },
  {
    slug: 'recovery',
    name: 'Post-Hospital Recovery',
    strip: 'Post-Hospital\nRecovery',
    blurb: 'A supportive place to recover before returning home.',
    icon: 'bed',
    src: PEOPLE_PHOTOS.walker.src,
  },
  {
    slug: 'rehabilitation',
    name: 'Rehabilitation Support',
    strip: 'Rehabilitation\nSupport',
    blurb: 'Helping you regain confidence, mobility and independence.',
    icon: 'walk',
    src: WALK,
  },
];

type EverydaySection = {
  id: string;
  kicker: string;
  watermark: string;
  title: string;
  intro: string;
  items?: string[];
  note?: string;
  src: string;
  alt: string;
  ctaHref?: string;
  ctaLabel: string;
};

const EVERYDAY: EverydaySection[] = [
  {
    id: 'everyday-living',
    kicker: 'Living & Care',
    watermark: 'Living',
    title: 'Everyday Living at Village 60 Plus',
    intro:
      'Life inside Village 60 Plus comes with a range of organised activities, social experiences, hospitality services and personal assistance designed to make everyday living enjoyable and convenient.',
    src: '/silver-roots/everyday.jpg',
    alt: 'A nurse sitting with a resident in the lounge',
    ctaLabel: 'Speak with our team',
  },
  {
    id: 'social-life',
    kicker: '01',
    watermark: 'Social',
    title: 'Social Life & Community Activities',
    intro: 'There is always an opportunity to meet, interact and enjoy time with others.',
    items: [
      'Weekly social gatherings and resident meet-ups',
      'Community lunches and group dining',
      'Afternoon tea parties',
      'Coffee mornings',
      'Movie afternoons',
      'Music, singing and entertainment',
      'Board games, cards and indoor recreation',
      'Reading circles and discussion groups',
      'Garden gatherings and outdoor activities',
      'Group outings and excursions',
    ],
    src: '/homes/tranquility/garden.jpg',
    alt: 'Two residents playing chess on the lawn',
    ctaLabel: 'Ask about community life',
  },
  {
    id: 'celebrations',
    kicker: '02',
    watermark: 'Events',
    title: 'Celebrations & Events Calendar',
    intro: "We organise occasions throughout the year to bring residents together and celebrate life's special moments.",
    items: [
      "International Day of Older Persons – Elders' Day",
      'Individual birthday celebrations',
      'Birthday parties and anniversary gatherings',
      'Sinhala and Tamil New Year celebrations',
      'Christmas celebrations',
      'New Year parties',
      'Vesak celebrations',
      "Valentine's Day gatherings",
      'Cultural and religious events',
      'Special themed lunches and dinners',
      'Family appreciation days',
    ],
    src: PEOPLE_PHOTOS.social.src,
    alt: PEOPLE_PHOTOS.social.alt,
    ctaLabel: 'Ask about celebrations',
  },
  {
    id: 'good-food',
    kicker: '03',
    watermark: 'Dining',
    title: 'Dining & Refreshments',
    intro: 'Dining is an important part of the Village 60 Plus experience.',
    items: [
      'Daily freshly prepared meals',
      'Breakfast, lunch and dinner',
      'Morning and afternoon refreshments',
      'Special community lunches',
      'Afternoon tea with refreshments and treats',
      'Birthday and celebration menus',
      'Special occasion dinners',
      'Individual dietary arrangements',
      'Family dining arrangements',
    ],
    src: '/home/living-room.jpg',
    alt: 'A dining table beside open doors to the garden',
    ctaLabel: 'Ask about dining',
  },
  {
    id: 'staying-active',
    kicker: '04',
    watermark: 'Active',
    title: 'Activities, Fitness & Recreation',
    intro: 'Residents can participate in activities according to their interests, preferences and abilities.',
    items: [
      'Gentle exercise sessions',
      'Stretching and mobility activities',
      'Yoga and relaxation',
      'Physiotherapy coordination',
      'Arts, painting and crafts',
      'Gardening and planting',
      'Music and singing sessions',
      'Dance and cultural activities',
      'Memory games and puzzles',
      'Educational workshops',
      'Indoor and outdoor recreational activities',
    ],
    src: '/homes/serenity/serenity-pool.jpg',
    alt: 'The swimming pool at Serenity, with clear blue water beside the white residence',
    ctaLabel: 'Ask about activities',
  },
  {
    id: 'personal-care',
    kicker: '05',
    watermark: 'Care',
    title: 'Personal Care & Grooming',
    intro: 'Assistance with everyday personal requirements can be arranged according to individual needs.',
    items: [
      'Haircuts and hairdressing appointments',
      'Personal grooming',
      'Barber services',
      'Nail care',
      'Laundry and clothing care',
      'Personal hygiene assistance',
      'Dressing assistance',
      'Individual care routines',
    ],
    src: PEOPLE_PHOTOS.lounge.src,
    alt: PEOPLE_PHOTOS.lounge.alt,
    ctaLabel: 'Ask about personal care',
  },
  {
    id: 'housekeeping',
    kicker: '06',
    watermark: 'Home',
    title: 'Hospitality & Housekeeping',
    intro: 'Our residential services include practical support to keep everyday living comfortable and organised.',
    items: [
      'Regular room cleaning',
      'Bed making and linen changes',
      'Laundry arrangements',
      'Fresh bedding and towels',
      'Room maintenance coordination',
      'Meal service',
      'Assistance with daily routines',
      'Personal belongings organisation',
    ],
    src: '/homes/serenity/serenity-bedroom.jpg',
    alt: 'A bright bedroom at Serenity with a wooden ceiling, terracotta floor tiles and white linens',
    ctaLabel: 'Ask about housekeeping',
  },
  {
    id: 'health',
    kicker: '07',
    watermark: 'Well',
    title: 'Medical & Wellness Coordination',
    intro: 'We help residents organise and access the healthcare support they require.',
    items: [
      'Medical appointment arrangements',
      'Doctor visits and consultations coordination',
      'Hospital appointment transportation',
      'Medication assistance and administration according to care plans',
      'Prescription collection coordination',
      'Physiotherapy arrangements',
      'Health monitoring according to individual care requirements',
      'Recovery and respite care arrangements',
      'Family communication regarding care',
    ],
    src: PEOPLE_PHOTOS.walker.src,
    alt: PEOPLE_PHOTOS.walker.alt,
    ctaLabel: 'Ask about medical support',
  },
  {
    id: 'transport',
    kicker: '08',
    watermark: 'Travel',
    title: 'Transport & Personal Concierge',
    intro: 'Residents can request assistance with everyday errands and arrangements.',
    items: [
      'Transportation for medical appointments',
      'Shopping trips',
      'Personal errands',
      'Salon and grooming appointments',
      'Family visits and outings',
      'Special occasion arrangements',
      'Assistance with external service bookings',
      'Personal requests and coordination',
    ],
    src: '/silver-roots/transport.jpg',
    alt: 'A caregiver walking a resident to a waiting car',
    ctaLabel: 'Ask about transport',
  },
  {
    id: 'family',
    kicker: '09',
    watermark: 'Family',
    title: 'Family & Special Arrangements',
    intro: "We recognise that family remains an important part of every resident's life.",
    items: [
      'Family visits and gatherings',
      'Special family lunches',
      'Birthday celebrations with loved ones',
      'Private dining arrangements',
      'Family updates and communication',
      'Assistance coordinating special occasions',
      'Arrangements for outings with family',
    ],
    src: '/story/verandah.jpg',
    alt: 'A residence verandah shaded by bougainvillea',
    ctaLabel: 'Plan a family visit',
  },
  {
    id: 'care-options',
    kicker: '10',
    watermark: 'Live',
    title: 'Our Residential & Care Options',
    intro: 'Village 60 Plus offers different residential arrangements to accommodate individual living and care requirements.',
    items: [
      'Permanent residential living',
      'Assisted living and daily personal assistance',
      'Short-term stays',
      'Respite accommodation',
      'Post-hospital recovery accommodation',
      'Individual care arrangements',
      'Couple accommodation, where available',
    ],
    note: 'Services and activities vary according to the residence, availability and individual care requirements.',
    src: '/homes/serenity/serenity-front.jpg',
    alt: 'Serenity residence front entrance with a terracotta roof and stone path through the garden',
    ctaHref: '#our-services',
    ctaLabel: 'See care options',
  },
];

const PATHWAYS: Array<{ icon: IconName; title: string; detail?: string; href?: string }> = [
  { icon: 'lotus', title: 'The privilege of living well.' },
  { icon: 'home', title: 'Our Homes', detail: 'Inspired Living', href: '/homes' },
  { icon: 'diamond', title: 'Platinum 60', detail: 'Personal Concierge', href: '#transport' },
  { icon: 'sprout', title: 'Silver Roots', detail: 'Family Connection', href: '/silver-roots' },
  { icon: 'pin', title: 'Destination Retirement', detail: 'Explore More', href: '/destination-retirement' },
];

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('size-7', className)} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths(name)}
    </svg>
  );
}

function iconPaths(name: IconName): ReactNode {
  switch (name) {
    case 'home':
      return <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1z" />;
    case 'building':
      return (
        <>
          <path d="M5 21V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V21" />
          <path d="M15 10h2.5A1.5 1.5 0 0 1 19 11.5V21" />
          <path d="M3 21h18M8 8h2M8 12h2M8 16h2M16.5 14h.5M16.5 17h.5" />
        </>
      );
    case 'clock':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.5l3 2" />
        </>
      );
    case 'bed':
      return <path d="M3 18V8M3 14h18v4M7 14v-2.5A2.5 2.5 0 0 1 9.5 9H20v5" />;
    case 'walk':
      return (
        <>
          <circle cx="14" cy="5" r="1.4" />
          <path d="M8 21l2.2-5.2 2.3 1.6L14 21M10.2 15.8 8.5 12l-3 .8M10.2 15.8 13 13l3.2 1.2M13 13l.6-3.2-2.4-1.2" />
        </>
      );
    case 'sprout':
      return <path d="M12 21V11M12 14c-3.5-.2-6-2.4-6-5.5 3.2 0 5.5 1.6 6 5.5zM12 12c3.2-.4 5.5-2.6 5.5-5.5-3 0-5.2 1.8-5.5 5.5z" />;
    case 'lotus':
      return (
        <>
          <path d="M12 20c0-4 2.4-7 2.4-10.2C14.4 12.6 12 16 12 20z" />
          <path d="M12 20c0-4-2.4-7-2.4-10.2C9.6 12.6 12 16 12 20z" />
          <path d="M12 19.2c-3.8-.3-6.8-2.2-7.6-5.2 2.8.2 5.2.8 7.6 2.8 2.4-2 4.8-2.6 7.6-2.8-.8 3-3.8 4.9-7.6 5.2z" />
        </>
      );
    case 'pin':
      return (
        <>
          <path d="M12 21s5.5-4.8 5.5-9a5.5 5.5 0 1 0-11 0c0 4.2 5.5 9 5.5 9z" />
          <circle cx="12" cy="12" r="1.7" />
        </>
      );
    case 'diamond':
      return (
        <>
          <path d="M12 3.5 20 9.5 12 20.5 4 9.5z" />
          <path d="M4 9.5h16M8.4 9.5 12 20.5 15.6 9.5M8.4 9.5 12 3.5l3.6 6" />
        </>
      );
    default:
      return null;
  }
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      {down ? <path d="M8 3v10M4 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

const goldPill =
  'inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 py-3 text-[13px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-bronze hover:text-ivory';

function GoldLink({ href, children, down = false, bar = false }: { href: string; children: ReactNode; down?: boolean; bar?: boolean }) {
  const className = bar
    ? 'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-pale-gold px-5 text-[12px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold'
    : goldPill;
  const content = (
    <>
      {children}
      <Arrow down={down} />
    </>
  );
  // Same-page hashes need a native anchor. Next Link skips the scroll when html has smooth scrolling.
  if (href.startsWith('#')) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function Cover({ src, alt = '', className, priority = false }: { src: string; alt?: string; className?: string; priority?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}

function Photo({ src, alt, className, imageClassName }: { src: string; alt: string; className?: string; imageClassName?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-[1.75rem] bg-sand', className)}>
      <Cover src={src} alt={alt} className={imageClassName} />
    </div>
  );
}

function EverydayBand({ section, imageLeft }: { section: EverydaySection; imageLeft: boolean }) {
  const headingId = `${section.id}-title`;
  return (
    <section id={section.id} aria-labelledby={headingId} className={cn('section-space scroll-mt-8 overflow-hidden border-t border-stone/80', imageLeft ? 'bg-ivory' : 'bg-paper')}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div className={cn('relative', imageLeft && 'lg:order-2')}>
            <p aria-hidden="true" className="pointer-events-none absolute -top-2 left-0 font-display text-[clamp(4.5rem,8vw,7.25rem)] leading-none font-medium tracking-[-0.045em] text-charcoal/[0.06] select-none">
              {section.watermark}
            </p>
            <div className="relative pt-10 lg:pt-14">
              <p className="text-[13px] font-semibold tracking-[0.18em] text-bronze uppercase">{section.kicker}</p>
              <h2 id={headingId} className="mt-3 font-display text-[clamp(2.15rem,3.3vw,3.35rem)] leading-[1.02] font-medium tracking-[-0.025em] text-charcoal">
                {section.title}
              </h2>
              <p className="mt-4 max-w-[38rem] text-[17px] leading-relaxed text-charcoal/80">{section.intro}</p>
              {section.items ? (
                <ul className="mt-6 grid gap-2.5">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[16px] leading-snug text-charcoal/90">
                      <span aria-hidden="true" className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.note ? <p className="mt-5 max-w-[38rem] text-[15px] leading-snug text-charcoal/70">{section.note}</p> : null}
              <div className="mt-8">
                {section.ctaHref ? (
                  <GoldLink href={section.ctaHref}>{section.ctaLabel}</GoldLink>
                ) : (
                  <EnquiryButton kind="general" context={`Living & Care: ${section.title}`} className={goldPill}>
                    {section.ctaLabel}
                    <Arrow />
                  </EnquiryButton>
                )}
              </div>
            </div>
          </div>
          <Photo src={section.src} alt={section.alt} className={cn('aspect-[4/3] lg:aspect-[5/4]', imageLeft && 'lg:order-1')} />
        </div>
      </Container>
    </section>
  );
}

export function LivingCareView() {
  return (
    <main id="main">
      <section aria-labelledby="page-title" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
        <Cover src={HERO_IMAGE} alt="" priority />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/78 via-night/32 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/35 via-transparent to-night/45" />
        <div className="relative z-10 w-full pt-32 pb-16">
          <div className="mx-auto w-full max-w-[1520px] gutter">
            <div className="max-w-[40rem]">
              <p className="text-[12px] font-semibold tracking-[0.22em] text-pale-gold uppercase">Living & Care</p>
              <h1 id="page-title" className="mt-4 font-display text-[clamp(2.6rem,4.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.02em] text-ivory">
                {HERO_TITLE}
              </h1>
              <p className="mt-6 max-w-[36rem] text-[16px] leading-relaxed text-ivory/95 md:text-[17px]">{HERO_INTRO}</p>
              <div className="mt-8">
                <GoldLink href="#our-services" bar>
                  Explore our services
                </GoldLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Care types" className="border-b border-stone/80 bg-ivory">
        <ul className="grid grid-cols-2 lg:grid-cols-5">
          {SERVICES.map((service) => (
            <li
              key={service.slug}
              className="border-stone/80 max-lg:border-b max-lg:odd:border-r max-lg:last:col-span-2 max-lg:last:border-r-0! max-lg:last:border-b-0! lg:border-l lg:first:border-l-0"
            >
              <a
                href={`#${service.slug}`}
                className="flex h-full flex-col items-center px-4 py-10 text-center text-charcoal no-underline transition-colors duration-(--duration-fast) hover:text-bronze lg:py-14"
              >
                <Icon name={service.icon} className="size-8 text-gold" />
                <span className="mt-4 max-w-[11rem] font-display text-[17px] leading-snug whitespace-pre-line">{service.strip}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="our-services" aria-labelledby="our-services-title" className="section-space scroll-mt-8 bg-ivory">
        <Container>
          <Heading as="h2" id="our-services-title" eyebrow="Our services" titleClassName="text-green" className="max-w-3xl">
            Different Ways to Live. The Support You Need.
          </Heading>
          <p className="mt-4 max-w-3xl text-charcoal/85">
            From independent living to residential care, short-term stays to recovery and rehabilitation, Village 60 Plus offers a range of options designed around real people and real lives.
          </p>
          <p className="mt-3 max-w-3xl text-charcoal/85">
            You do not need to know which option before you call. If Village 60 Plus is not the right fit, the team will say so.{' '}
            <Link href="/find-the-right-care" className="font-semibold text-green underline decoration-gold underline-offset-4 hover:decoration-green">
              Find the right care
            </Link>
            .
          </p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map((service) => {
              return (
                <li key={service.slug} id={service.slug} className="scroll-mt-8">
                  <Link
                    href={careServicePath(service.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-card bg-paper text-charcoal no-underline shadow-panel transition-[transform,box-shadow] duration-(--duration-fast) motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-panel"
                  >
                    <div className="relative aspect-[4/3] bg-sand">
                      <Cover src={service.src} />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
                      <h3 className="font-display text-[22px] leading-tight text-green">{service.name}</h3>
                      <p className="text-[15px] leading-snug text-charcoal/80">{service.blurb}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[12px] font-semibold tracking-[0.12em] text-bronze uppercase">
                        Learn more
                        <Arrow />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {EVERYDAY.map((section, index) => (
        <EverydayBand key={section.id} section={section} imageLeft={index % 2 === 1} />
      ))}

      <section className="border-t border-stone/80 bg-ivory">
        <nav aria-label="Ways to live with Village 60 Plus">
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {PATHWAYS.map((item) => {
              const inner = (
                <>
                  <Icon name={item.icon} className="size-7 text-gold" />
                  <span className={cn('mt-3 block text-[12px] leading-snug font-semibold tracking-[0.14em] text-bronze uppercase', item.detail && 'text-[11px]')}>
                    {item.title}
                  </span>
                  {item.detail ? <span className="mt-1 block font-display text-[18px] leading-tight text-green">{` ${item.detail}`}</span> : null}
                </>
              );
              return (
                <li key={item.title} className="border-stone/80 max-lg:border-b max-lg:odd:border-r lg:border-l lg:first:border-l-0">
                  {item.href ? (
                    item.href.startsWith('#') ? (
                      <a href={item.href} className="flex h-full flex-col items-center px-4 py-8 text-center text-charcoal no-underline transition-colors hover:text-bronze lg:py-10">
                        {inner}
                      </a>
                    ) : (
                      <Link href={item.href} className="flex h-full flex-col items-center px-4 py-8 text-center text-charcoal no-underline transition-colors hover:text-bronze lg:py-10">
                        {inner}
                      </Link>
                    )
                  ) : (
                    <div className="flex h-full flex-col items-center px-4 py-8 text-center lg:py-10">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </section>
    </main>
  );
}
