import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { careServicePath } from '@/lib/routes';
import { PEOPLE_PHOTOS } from '@/lib/site-photos';
import { cn } from '@/lib/cn';

const HERO_TITLE = 'Support That Changes With You.';
const HERO_INTRO =
  'Different people. Different needs. The same purpose, to help you live well, with the right level of support around you.';

type IconName =
  | 'home'
  | 'building'
  | 'clock'
  | 'bed'
  | 'walk'
  | 'meal'
  | 'linen'
  | 'heart'
  | 'people'
  | 'car'
  | 'sprout'
  | 'shield'
  | 'bell'
  | 'lotus'
  | 'pin'
  | 'diamond';

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
    src: '/homes/serenity/serenity-bedroom.jpg',
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

const PROVIDES: Array<{ label: string; icon: IconName; href?: string }> = [
  { label: 'Meals & Dining', icon: 'meal', href: '#good-food' },
  { label: 'Housekeeping & Laundry', icon: 'linen' },
  { label: 'Health & Wellbeing', icon: 'heart', href: '#health' },
  { label: 'Staying Active', icon: 'walk', href: '#staying-active' },
  { label: 'Family Connection', icon: 'people', href: '#beyond' },
  { label: 'Transport & Appointments', icon: 'car', href: '#health' },
  { label: 'Platinum 60 Concierge', icon: 'bell', href: '#private-concierge' },
  { label: 'Personal Services via Silver Roots', icon: 'sprout', href: '/silver-roots' },
  { label: 'Technology & Safety', icon: 'shield' },
];

const MEALS = [
  'Breakfast, lunch and dinner',
  'Tea and refreshments',
  'Special dietary requirements',
  'Meal assistance if required',
  'Guest meals and celebrations',
  'A sociable dining experience',
];

const HEALTH = [
  'Doctor and hospital appointments',
  'Prescription collection/delivery',
  'Medication support',
  'Transport to appointments',
  'Professional nursing support',
  'Discreet personal assistance',
  'Physiotherapy, spa, fitness and relaxation',
  'Beauty and grooming',
  'Health assessments',
  'Wellbeing checks',
  'Family updates',
];

const ACTIVE = [
  'Gentle exercise and walking',
  'Gardening and outdoor areas',
  'Games, music, movies and entertainment',
  'Cultural and spiritual activities',
  'Excursions and social occasions',
  'Choice and flexibility',
];

const EXPERIENCE: Array<{
  id: string;
  title: string;
  body: string;
  icon: IconName;
  links?: Array<{ href: string; label: string }>;
}> = [
  {
    id: 'elegant-living',
    title: 'Elegant Living',
    body: 'Private residences, beautifully furnished accommodation, inviting surroundings and the freedom to live on your own terms.',
    icon: 'home',
    links: [{ href: '/homes', label: 'Our homes' }],
  },
  {
    id: 'exceptional-care',
    title: 'Exceptional Care',
    body: 'Discreet personal assistance, professional nursing support, health coordination and individually tailored care.',
    icon: 'heart',
    links: [{ href: '#residential-care', label: 'Residential care' }],
  },
  {
    id: 'fine-living',
    title: 'Fine Living & Dining',
    body: 'Thoughtfully curated menus, personalised dining preferences, daily comforts and attentive hospitality.',
    icon: 'meal',
    links: [{ href: '#good-food', label: 'Meals and dining' }],
  },
  {
    id: 'wellness',
    title: 'Wellness & Rejuvenation',
    body: 'Spa experiences, physiotherapy, fitness, relaxation, beauty and wellness services designed for your wellbeing.',
    icon: 'lotus',
    links: [{ href: '#health', label: 'Health and wellbeing' }],
  },
  {
    id: 'leisure',
    title: 'Leisure & Experiences',
    body: 'Social occasions, entertainment, cultural experiences, excursions and opportunities to discover something new.',
    icon: 'people',
    links: [{ href: '#staying-active', label: 'Activities' }],
  },
  {
    id: 'private-concierge',
    title: 'Private Concierge',
    body: 'From personal shopping and grooming to chauffeur arrangements, appointments and travel, our Platinum 60 concierge services attend to the finer details.',
    icon: 'bell',
    links: [{ href: '/contact', label: 'Enquire' }],
  },
  {
    id: 'recovery-respite',
    title: 'Recovery & Respite',
    body: 'Comfortable short-term stays, rehabilitation assistance and personalised support during recovery.',
    icon: 'bed',
    links: [{ href: '#respite-care', label: 'Short stays' }],
  },
  {
    id: 'beyond-residences',
    title: 'Living Beyond Our Residences',
    body: 'Enjoy the Village 60 Plus standard of service in your own home or through our Destination Retirement experiences.',
    icon: 'pin',
    links: [
      { href: '/silver-roots', label: 'Care at home' },
      { href: '/destination-retirement', label: 'Destination Retirement' },
    ],
  },
];

const PATHWAYS: Array<{ icon: IconName; title: string; detail?: string; href?: string }> = [
  { icon: 'lotus', title: 'The privilege of living well.' },
  { icon: 'home', title: 'Our Homes', detail: 'Inspired Living', href: '/homes' },
  { icon: 'diamond', title: 'Platinum 60', detail: 'Personal Concierge', href: '#private-concierge' },
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
    case 'meal':
      return (
        <>
          <path d="M6 3v7a2 2 0 0 0 2 2V21" />
          <path d="M6 3v5M8 3v5M16 3v7c1.6 0 3-1.6 3-4.5S17.6 3 16 3z" />
          <path d="M16 10v11" />
        </>
      );
    case 'linen':
      return <path d="M6 4h12l-1 16H7L6 4zm2 4h8M8.4 12h7.2" />;
    case 'heart':
      return <path d="M12 19s-7-4.4-7-9a3.8 3.8 0 0 1 7-2 3.8 3.8 0 0 1 7 2c0 4.6-7 9-7 9z" />;
    case 'people':
      return (
        <>
          <circle cx="9" cy="8" r="2.2" />
          <circle cx="16" cy="9" r="1.8" />
          <path d="M4.5 19c.4-2.6 2.3-4 4.5-4s4.1 1.4 4.5 4M14 15.2c1.4-.4 2.8.1 3.6 1.3.6.9.9 1.8 1 2.5" />
        </>
      );
    case 'car':
      return <path d="M4 15v2h2.2M18 17H20v-2M4 15l1.6-4.2A2 2 0 0 1 7.5 9.5h9a2 2 0 0 1 1.9 1.3L20 15M4 15h16M7 17.5a1.2 1.2 0 1 0 0 .1M17 17.5a1.2 1.2 0 1 0 0 .1" />;
    case 'sprout':
      return <path d="M12 21V11M12 14c-3.5-.2-6-2.4-6-5.5 3.2 0 5.5 1.6 6 5.5zM12 12c3.2-.4 5.5-2.6 5.5-5.5-3 0-5.2 1.8-5.5 5.5z" />;
    case 'shield':
      return <path d="M12 3.5 19 6.5v5.2c0 4.2-2.8 7.2-7 8.8-4.2-1.6-7-4.6-7-8.8V6.5z" />;
    case 'bell':
      return (
        <>
          <path d="M6.5 16h11" />
          <path d="M8 16V10.5a4 4 0 0 1 8 0V16" />
          <path d="M10 16a2 2 0 0 0 4 0" />
          <path d="M12 6.5V5" />
        </>
      );
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

function GoldLink({ href, children, down = false, bar = false }: { href: string; children: ReactNode; down?: boolean; bar?: boolean }) {
  return (
    <Link
      href={href}
      className={
        bar
          ? 'inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-pale-gold px-5 text-[12px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-gold'
          : 'inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 py-3 text-[13px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-bronze hover:text-ivory'
      }
    >
      {children}
      <Arrow down={down} />
    </Link>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" />
      <path d="M6.5 10.2 8.8 12.5 13.5 7.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Checklist({ items, onDark = false }: { items: string[]; onDark?: boolean }) {
  return (
    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className={cn('flex items-start gap-3 text-[16px] leading-snug', onDark ? 'text-ivory' : 'text-charcoal/90')}>
          <Check />
          <span>{item}</span>
        </li>
      ))}
    </ul>
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
    <div className={cn('relative overflow-hidden rounded-panel bg-sand', className)}>
      <Cover src={src} alt={alt} className={imageClassName} />
    </div>
  );
}

export function LivingCareView() {
  return (
    <main id="main">
      <section aria-labelledby="page-title" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
        <Cover src={PORTRAIT} alt="" priority className="object-[72%_center]" />
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
              <Link
                href={`#${service.slug}`}
                className="flex h-full flex-col items-center px-4 py-10 text-center text-charcoal no-underline transition-colors duration-(--duration-fast) hover:text-bronze lg:py-14"
              >
                <Icon name={service.icon} className="size-8 text-gold" />
                <span className="mt-4 max-w-[11rem] font-display text-[17px] leading-snug whitespace-pre-line">{service.strip}</span>
              </Link>
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

      <section id="experience" aria-labelledby="experience-title" className="section-space scroll-mt-8 bg-sand">
        <Container>
          <Heading as="h2" id="experience-title" eyebrow="The Village 60 Plus experience" titleClassName="text-green" className="max-w-3xl">
            A Distinguished Way of Life.
          </Heading>
          <div className="mt-4 max-w-3xl space-y-3 text-charcoal/85">
            <p>At Village 60 Plus, we believe retirement should be a celebration of life, not a compromise.</p>
            <p>Discover a world where refined living, personalised attention and exceptional hospitality come together.</p>
            <p>
              From beautifully appointed residences and thoughtfully prepared dining to dedicated care, wellness and lifestyle experiences, every detail is considered around you.
            </p>
          </div>
          <h3 className="mt-12 font-display text-[28px] leading-tight text-green">The Village 60 Plus Experience</h3>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {EXPERIENCE.map((item) => (
              <li key={item.id} id={item.id} className="scroll-mt-8">
                <article className="flex h-full flex-col rounded-card border border-stone/80 bg-paper p-5 shadow-panel">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-sand text-gold">
                    <Icon name={item.icon} className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-[22px] leading-tight text-green">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-snug text-charcoal/80">{item.body}</p>
                  {item.links?.length ? (
                    <p className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-4">
                      {item.links.map((link) => (
                        <Link key={link.href} href={link.href} className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.12em] text-bronze uppercase no-underline hover:text-green">
                          {link.label}
                          <Arrow />
                        </Link>
                      ))}
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="more-than-a-room" className="relative overflow-hidden bg-green text-ivory on-dark section-space">
        <div className="absolute inset-0" aria-hidden="true">
          <Cover src={WALK} className="opacity-40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-green/92 via-green/86 to-night/80" aria-hidden="true" />
        <Container className="relative">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <Heading as="h2" id="more-than-a-room" eyebrow="What we provide" onDark titleClassName="text-ivory">
                More Than a Room.
              </Heading>
              <p className="mt-4 text-ivory/90">
                Living well is about more than just accommodation. It&apos;s the everyday things that make life comfortable, safe and enjoyable.
              </p>
            </div>
            <GoldLink href="#our-services">View all services</GoldLink>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {PROVIDES.map((item) => {
              const body = (
                <>
                  <Icon name={item.icon} className="size-6 text-gold" />
                  <span className="text-[15px] leading-snug font-medium text-ivory">{item.label}</span>
                </>
              );
              return (
                <li key={item.label}>
                  {item.href ? (
                    <Link href={item.href} className="flex h-full min-h-24 flex-col items-start justify-center gap-3 rounded-card border border-ivory/15 bg-night/25 px-4 py-4 no-underline transition-colors hover:bg-night/40">
                      {body}
                    </Link>
                  ) : (
                    <div className="flex h-full min-h-24 flex-col items-start justify-center gap-3 rounded-card border border-ivory/15 bg-night/25 px-4 py-4">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section id="good-food" aria-labelledby="good-food-title" className="section-space scroll-mt-8 bg-paper">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Photo src="/home/living-room.jpg" alt="A dining table beside open doors to the garden" className="aspect-[4/3] lg:aspect-[5/4]" imageClassName="object-[78%_center]" />
            <div>
              <Heading as="h2" id="good-food-title" titleClassName="text-green" className="max-w-none">
                Good Food Is Part of Good Living.
              </Heading>
              <p className="mt-4 max-w-prose-site text-charcoal/85">
                Thoughtfully curated menus and nutritious, home-cooked meals prepared fresh, with personalised dining preferences and individual dietary requirements. Enjoy meals in our dining spaces or in the comfort of your own room, with attentive hospitality.
              </p>
              <div className="mt-6">
                <Checklist items={MEALS} />
              </div>
              <div className="mt-8">
                <GoldLink href="#good-food">Explore meals &amp; dining</GoldLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="health" aria-labelledby="health-title" className="section-space scroll-mt-8 bg-ivory">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="lg:order-1">
              <Heading as="h2" id="health-title" eyebrow="Health & wellbeing" titleClassName="text-green" className="max-w-none">
                Your Health Matters.
              </Heading>
              <p className="mt-4 max-w-prose-site text-charcoal/85">
                We support your wider health and wellbeing by coordinating appointments, medication and other healthcare services.
              </p>
              <div className="mt-6">
                <Checklist items={HEALTH} />
              </div>
            </div>
            <Photo src={PORTRAIT} alt={PEOPLE_PHOTOS.hands.alt} className="aspect-[4/3] lg:order-2 lg:aspect-[5/4]" />
          </div>
        </Container>
      </section>

      <section id="staying-active" aria-labelledby="staying-active-title" className="relative scroll-mt-8 overflow-hidden bg-green text-ivory on-dark">
        <div className="absolute inset-0">
          <Cover src={WALK} alt="" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/10 via-night/35 to-night/75" />
        <Container className="relative flex min-h-[34rem] items-center py-16 lg:min-h-[40rem] lg:py-24">
          <div className="ml-auto w-full max-w-xl">
            <Heading as="h2" id="staying-active-title" eyebrow="Staying active" onDark titleClassName="text-ivory" className="max-w-none">
              Live Well. Stay Active.
            </Heading>
            <p className="mt-4 text-ivory/90">
              From gentle exercise to social activities and outings, there are many ways to stay engaged, connected and active.
            </p>
            <div className="mt-6">
              <Checklist items={ACTIVE} onDark />
            </div>
            <div className="mt-8">
              <GoldLink href="#staying-active">Explore activities</GoldLink>
            </div>
          </div>
        </Container>
      </section>

      <section id="beyond" aria-labelledby="connected-title" className="section-space scroll-mt-8 bg-paper">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Photo src="/silver-roots/sunset.jpg" alt="Warm evening light across the garden" className="aspect-[4/3] lg:aspect-[5/4]" />
            <div>
              <Heading as="h2" id="connected-title" eyebrow="Silver Roots" titleClassName="text-green" className="max-w-none">
                Seamlessly Connected
              </Heading>
              <p className="mt-4 max-w-prose-site text-charcoal/85">
                Through Silver Roots and our integrated service network, your care, lifestyle arrangements and family communication come together effortlessly.
              </p>
              <p className="mt-3 max-w-prose-site text-charcoal/85">
                Living beyond our residences, the same standard of service can continue in your own home or through Destination Retirement.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <GoldLink href="/silver-roots">Silver Roots</GoldLink>
                <GoldLink href="/destination-retirement">Destination Retirement</GoldLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="without-compromise" className="border-t border-stone/80 bg-ivory">
        <Container className="section-space">
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h2" id="without-compromise" titleClassName="text-green" className="mx-auto max-w-3xl text-center">
              A Life Without Compromise.
            </Heading>
            <p className="mt-4 text-[18px] leading-snug text-charcoal">Your preferences. Your pace. Your way of life.</p>
            <p className="mx-auto mt-3 max-w-2xl text-charcoal/85">
              At Village 60 Plus, we take care of the details, so you can enjoy what matters most.
            </p>
          </div>
        </Container>
        <nav aria-label="Ways to live with Village 60 Plus" className="border-t border-stone/80">
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
                    <Link href={item.href} className="flex h-full flex-col items-center px-4 py-8 text-center text-charcoal no-underline transition-colors hover:text-bronze lg:py-10">
                      {inner}
                    </Link>
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
