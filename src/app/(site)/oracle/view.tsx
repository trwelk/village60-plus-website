import type { ReactNode } from 'react';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { provisionLabel, type CapabilityItem } from '@/components/content/CapabilityList';
import { PageHero } from '@/components/content/PageHero';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { StaticMap } from '@/components/media/StaticMap';
import { Chip } from '@/components/ui/Chip';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/cn';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture } from '@/lib/content-status';
import type { ResidenceContent } from '../homes/[slug]/view';
import { RoomFilmstrip, type FilmstripRoom } from './room-filmstrip';

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-oracle-section={name}>{children}</div>;
}

type Room = NonNullable<NonNullable<ResidenceContent['rooms']>[number]> & { name: string };

function hasPhoto(image: CmsImage | null | undefined): image is CmsImage {
  return Boolean(image?.asset?.url && image.alt?.trim());
}

function roomsCopy(count: number): { heading: string; body: string } {
  if (count === 10) {
    return {
      heading: 'Ten Rooms. Ten Identities.',
      body: 'Oracle is intentionally small. Just ten individually designed private rooms, each with its own name, character and carefully considered details.',
    };
  }
  const label = count === 1 ? 'One room' : `${count} rooms`;
  return {
    heading: count === 1 ? 'One Room.' : `${count} Rooms.`,
    body: `Oracle is intentionally small. Just ${label} individually designed private rooms, each with its own name, character and carefully considered details.`,
  };
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cta({
  href,
  children,
  tone,
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  tone: 'solid' | 'ghost' | 'line' | 'pill';
  arrow?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex min-h-11 items-center no-underline transition-colors duration-(--duration-fast)',
        tone === 'pill' ? 'gap-2 rounded-full bg-gold px-6 text-[13px] font-semibold tracking-[0.14em] text-night uppercase hover:bg-bronze hover:text-ivory' : 'gap-2.5',
        tone === 'line' && 'text-[12px] font-semibold tracking-[0.16em] text-[#6d6844] uppercase hover:text-green',
        (tone === 'solid' || tone === 'ghost') && 'rounded-[2px] px-5 text-[11px] font-semibold tracking-[0.16em] uppercase',
        tone === 'solid' && 'bg-gold text-night hover:bg-pale-gold',
        tone === 'ghost' && 'border border-ivory/80 text-ivory hover:bg-white/10',
      )}
    >
      {children}
      {arrow ? <Arrow /> : null}
    </a>
  );
}

function Rule({ onDark = false }: { onDark?: boolean }) {
  return <span className={cn('mt-3 block h-px w-10', onDark ? 'bg-pale-gold' : 'bg-gold')} aria-hidden="true" />;
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" />
      <path d="M6.5 10.2 8.8 12.5 13.5 7.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const HIGHLIGHTS: Array<{ label: string; icon: 'house' | 'leaf' | 'cup' | 'lotus' | 'people' }> = [
  { label: 'Beautiful Private Rooms', icon: 'house' },
  { label: 'Elegant Shared Spaces', icon: 'leaf' },
  { label: 'Thoughtful Dining', icon: 'cup' },
  { label: 'Lifestyle and Wellbeing', icon: 'lotus' },
  { label: 'A True Sense of Home', icon: 'people' },
];

type EverydayIconName = 'meal' | 'linen' | 'laundry' | 'home' | 'people' | 'shield' | 'lounge' | 'sprout';

const EVERYDAY: Array<{ label: string; icon: EverydayIconName; href?: string }> = [
  { label: 'Dining & Meals', icon: 'meal' },
  { label: 'Housekeeping', icon: 'linen' },
  { label: 'Laundry Support', icon: 'laundry' },
  { label: 'Home Maintenance', icon: 'home' },
  { label: 'Everyday Assistance', icon: 'people' },
  { label: 'Security & Reassurance', icon: 'shield' },
  { label: 'Facilities & Entertainment', icon: 'lounge' },
  { label: 'Personal Services via Silver Roots', icon: 'sprout', href: '/silver-roots' },
];

function EverydayIcon({ name }: { name: EverydayIconName }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'meal' ? (
        <>
          <path d="M6 3v7a2 2 0 0 0 2 2V21" />
          <path d="M6 3v5M8 3v5M16 3v7c1.6 0 3-1.6 3-4.5S17.6 3 16 3z" />
          <path d="M16 10v11" />
        </>
      ) : null}
      {name === 'linen' ? (
        <>
          <path d="M12 3v11" />
          <path d="M8 14h8l-1.2 6H9.2L8 14z" />
          <path d="M9.2 17h5.6" />
        </>
      ) : null}
      {name === 'laundry' ? (
        <>
          <path d="M5 9h14l-1.4 10.2a1.5 1.5 0 0 1-1.5 1.3H7.9a1.5 1.5 0 0 1-1.5-1.3L5 9z" />
          <path d="M8.5 9V7.2A3.5 3.5 0 0 1 12 3.7 3.5 3.5 0 0 1 15.5 7.2V9" />
          <path d="M5 13.5h14" />
        </>
      ) : null}
      {name === 'home' ? <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1z" /> : null}
      {name === 'people' ? (
        <>
          <circle cx="9" cy="8" r="2.2" />
          <circle cx="16" cy="9" r="1.8" />
          <path d="M4.5 19c.4-2.6 2.3-4 4.5-4s4.1 1.4 4.5 4M14 15.2c1.4-.4 2.8.1 3.6 1.3.6.9.9 1.8 1 2.5" />
        </>
      ) : null}
      {name === 'shield' ? <path d="M12 3.5 19 6.5v5.2c0 4.2-2.8 7.2-7 8.8-4.2-1.6-7-4.6-7-8.8V6.5z" /> : null}
      {name === 'lounge' ? (
        <>
          <path d="M4 12V9.5A2.5 2.5 0 0 1 6.5 7h11A2.5 2.5 0 0 1 20 9.5V12" />
          <path d="M3 12h18v4.5A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5V12z" />
          <path d="M7 19v2M17 19v2" />
        </>
      ) : null}
      {name === 'sprout' ? <path d="M12 21V11M12 14c-3.5-.2-6-2.4-6-5.5 3.2 0 5.5 1.6 6 5.5zM12 12c3.2-.4 5.5-2.6 5.5-5.5-3 0-5.2 1.8-5.5 5.5z" /> : null}
    </svg>
  );
}

type SupportIconName = 'people' | 'pill' | 'calendar' | 'hands';

function supportIconName(title: string): SupportIconName {
  const text = title.toLowerCase();
  if (/medic|pill|dose|reminder/.test(text)) return 'pill';
  if (/appoint|transport|coord/.test(text)) return 'calendar';
  if (/team|assist|care|compan/.test(text)) return 'people';
  return 'hands';
}

function SupportIcon({ name }: { name: SupportIconName }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'people' ? (
        <>
          <circle cx="9" cy="8" r="2.2" />
          <circle cx="16" cy="9" r="1.8" />
          <path d="M4.5 19c.4-2.6 2.3-4 4.5-4s4.1 1.4 4.5 4M14 15.2c1.4-.4 2.8.1 3.6 1.3.6.9.9 1.8 1 2.5" />
        </>
      ) : null}
      {name === 'pill' ? (
        <>
          <path d="M8.2 15.8 15.8 8.2a3.4 3.4 0 0 1 4.8 4.8l-7.6 7.6a3.4 3.4 0 0 1-4.8-4.8Z" />
          <path d="m10.2 10.2 3.6 3.6" />
        </>
      ) : null}
      {name === 'calendar' ? (
        <>
          <rect x="4" y="5.5" width="16" height="14.5" rx="1.5" />
          <path d="M4 10h16M8 3.5v4M16 3.5v4" />
          <path d="m9 15.2 2 2 4-4.2" />
        </>
      ) : null}
      {name === 'hands' ? (
        <>
          <path d="M8 13.5V8.2a1.3 1.3 0 0 1 2.6 0V12" />
          <path d="M10.6 11.2V7.4a1.3 1.3 0 0 1 2.6 0V12" />
          <path d="M13.2 11.6V8.6a1.3 1.3 0 0 1 2.6 0v6.2c0 3.2-2 5.7-5.2 5.7-2.4 0-4-1.2-4.8-2.6L4.2 14a1.4 1.4 0 0 1 2.2-1.6L8 14.2" />
        </>
      ) : null}
    </svg>
  );
}

function SupportCards({ items }: { items: Array<CapabilityItem | null> | null | undefined }) {
  const rows = (items ?? []).filter((item): item is CapabilityItem & { title: string } => Boolean(item?.title));
  if (rows.length === 0) return null;
  return (
    <ul className={cn('mt-10 grid list-none gap-4 p-0', rows.length > 2 ? 'md:grid-cols-3' : 'sm:grid-cols-2')}>
      {rows.map((item) => {
        const provision = provisionLabel(item.provision);
        const status = isContentStatus(item.status) ? item.status : null;
        return (
          <li key={item._key} className="flex h-full flex-col rounded-panel border border-stone bg-paper px-6 py-7">
            <span className="inline-flex size-12 items-center justify-center rounded-full border border-stone bg-ivory text-gold">
              <SupportIcon name={supportIconName(item.title)} />
            </span>
            <h3 className="mt-5 text-[22px] leading-snug md:text-[24px]">{item.title}</h3>
            {item.description ? <p className="mt-3 text-[16px] leading-relaxed">{item.description}</p> : null}
            {status || provision ? (
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                {status ? <StatusBadge status={status} /> : null}
                {provision ? <Chip>{provision}</Chip> : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function HighlightIcon({ icon }: { icon: (typeof HIGHLIGHTS)[number]['icon'] }) {
  const common = { viewBox: '0 0 48 48', className: 'size-10 text-gold', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, 'aria-hidden': true as const };
  if (icon === 'house') {
    return (
      <svg {...common}>
        <path d="M8 22 24 8l16 14v18H8V22Z" strokeLinejoin="round" />
        <path d="M20 40V28h8v12" />
      </svg>
    );
  }
  if (icon === 'leaf') {
    return (
      <svg {...common}>
        <path d="M24 7c9 9 15 18 12 28-9 4-20-1-12-28Z" strokeLinejoin="round" />
        <path d="M24 35V14" strokeLinecap="round" />
        <path d="M24 26c-5-1-8-5-8-8M24 22c5-1 8-4 9-8" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === 'cup') {
    return (
      <svg {...common}>
        <path d="M15 16h16v11a8 8 0 0 1-16 0V16Z" />
        <path d="M31 19h3a4 4 0 0 1 0 8h-3" />
        <path d="M16 40h16" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === 'lotus') {
    return (
      <svg {...common}>
        <path d="M24 36V18" strokeLinecap="round" />
        <path d="M24 34c-7-1-12-8-9-15 5 3 8 8 9 15Z" />
        <path d="M24 34c7-1 12-8 9-15-5 3-8 8-9 15Z" />
        <path d="M24 34c-4-5-4-12 0-16 4 4 4 11 0 16Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="16" cy="14" r="4" />
      <circle cx="31" cy="16" r="3.25" />
      <path d="M6 39c.8-8 4.5-12 10-12s9.2 4 10 12" strokeLinecap="round" />
      <path d="M21 39c.8-7 4-10.5 8.5-10.5S37 32 38.5 39" strokeLinecap="round" />
    </svg>
  );
}

export function OracleView({
  residence,
  contact,
  mapsKey,
}: {
  residence: ResidenceContent | null;
  contact: SiteContact;
  mapsKey: string | null;
}) {
  if (!residence) {
    return (
      <main id="main">
        <PageHero layout="overlay" title="Oracle" intro="Details will appear here once they are published." tone="night" />
      </main>
    );
  }

  const future = isContentStatus(residence.status) && isFuture(residence.status);
  const rooms = (residence.rooms ?? []).filter((room): room is Room => Boolean(room?.name));
  const spaces = (residence.sharedSpaces ?? []).filter((space): space is string => Boolean(space));
  const fit = (residence.audienceFit ?? []).filter((item): item is string => Boolean(item));
  const optional = (residence.careAndSupport ?? []).filter((item) => item?.title && item.provision && item.provision !== 'included');
  const gallery = (residence.gallery ?? []).filter(hasPhoto);
  const feature = rooms.map((room) => room.image).find(hasPhoto) ?? gallery[0] ?? null;
  const lifeImage = gallery.find((image) => image.asset?.url !== feature?.asset?.url) ?? gallery[0] ?? rooms.map((room) => room.image).filter(hasPhoto).find((image) => image.asset?.url !== feature?.asset?.url) ?? null;
  const filmstrip: FilmstripRoom[] = rooms.map((room) => ({
    key: room._key,
    name: room.name,
    facts: (room.facts ?? []).filter((fact): fact is string => Boolean(fact)),
    image: hasPhoto(room.image) ? room.image : null,
  }));
  const roomCopy = roomsCopy(rooms.length);
  const status = isContentStatus(residence.status) ? residence.status : null;
  const careBackdrop =
    gallery.find((image) => image.asset?.url !== lifeImage?.asset?.url && image.asset?.url !== feature?.asset?.url) ??
    (hasPhoto(residence.heroImage) ? residence.heroImage : null);

  return (
    <main id="main">
      <Region name="hero">
        <section aria-labelledby="page-title" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory on-dark">
          {hasPhoto(residence.heroImage) ? (
            <div className="absolute inset-0">
              <SanityImage image={residence.heroImage} width={1920} height={1080} priority cover sizes="100vw" />
            </div>
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,31,27,0.88)_0%,rgba(15,31,27,0.62)_32%,rgba(15,31,27,0.18)_58%,transparent_78%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-night/60 to-transparent" />
          <div className="relative z-10 w-full pt-32 pb-16 md:pb-24">
            <div className="gutter mx-auto w-full max-w-[1400px]">
              <div className="flex max-w-xl flex-col items-start">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-[12px] font-semibold tracking-[0.28em] text-ivory/80 uppercase">Introducing</p>
                  {status && status !== 'available' ? <StatusBadge status={status} tone="dark" /> : null}
                </div>
                <h1 id="page-title" className="mt-4 font-display text-[clamp(4.5rem,8vw,7.25rem)] leading-[0.88] font-normal tracking-[-0.03em] text-ivory uppercase">
                  {residence.name}
                </h1>
                <span className="mt-5 block h-0.5 w-44 bg-gold" aria-hidden="true" />
                <p className="mt-4 text-[12px] font-semibold tracking-[0.22em] text-ivory/80 uppercase">By Village 60 Plus</p>
                <p className="mt-6 max-w-[12ch] font-display text-[clamp(1.7rem,2.8vw,2.35rem)] leading-[1.15] font-normal text-ivory">
                  A new standard of living.
                </p>
                <p className="mt-4 max-w-[36ch] text-[16px] leading-relaxed text-ivory/90">
                  A private residence for independent adults who value their privacy, freedom and way of life.
                </p>
                {future && residence.comingSoonNote ? <p className="mt-4 max-w-[36ch] text-[16px] leading-relaxed text-pale-gold">{residence.comingSoonNote}</p> : null}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Cta href="#oracle-visit" tone="solid">Arrange a private visit</Cta>
                  <Cta href="#oracle-rooms" tone="ghost" arrow={false}>Explore the rooms</Cta>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Region>

      {rooms.length > 0 ? (
        <Region name="rooms">
          <section aria-labelledby="oracle-rooms" className="scroll-mt-24 bg-ivory text-charcoal">
            <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 gutter py-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-24">
              <div className="max-w-md">
                <p className="text-[12px] font-semibold tracking-[0.22em] text-bronze uppercase">Your home</p>
                <Rule />
                <h2 id="oracle-rooms" className="mt-5 scroll-mt-28 font-display text-[clamp(2.7rem,4.4vw,3.75rem)] leading-[1.02] font-normal">
                  {roomCopy.heading}
                </h2>
                <p className="mt-5 max-w-[34ch] text-[16px] leading-relaxed">{roomCopy.body}</p>
                <div className="mt-8">
                  <Cta href="#oracle-room-strip" tone="line">Explore the rooms</Cta>
                </div>
              </div>
              {feature ? (
                <div className="relative aspect-[4/3] bg-sand">
                  <SanityImage image={feature} width={1200} height={900} sizes="(min-width: 1200px) 52vw, 100vw" cover decorative className="absolute inset-0" />
                </div>
              ) : null}
            </div>
            <div className="mx-auto w-full max-w-[1400px] gutter pb-10 lg:pb-14">
              <RoomFilmstrip rooms={filmstrip} />
            </div>
          </section>
        </Region>
      ) : null}

      <Region name="daily-life">
        <section aria-labelledby="oracle-day" className="grid scroll-mt-24 bg-night text-ivory on-dark lg:grid-cols-[minmax(20rem,0.78fr)_minmax(0,1.22fr)]">
          <div className="order-2 flex items-center px-6 py-14 sm:px-10 lg:order-1 lg:px-14 lg:py-20">
            <div className="max-w-md">
              <p className="text-[12px] font-semibold tracking-[0.22em] text-pale-gold uppercase">Life at Oracle</p>
              <Rule onDark />
              <h2 id="oracle-day" className="mt-5 scroll-mt-28 font-display text-[clamp(2.6rem,4vw,3.6rem)] leading-[1.02] font-normal text-ivory">
                Live Your Day, Your Way.
              </h2>
              <p className="mt-5 max-w-[38ch] text-[16px] leading-relaxed text-ivory/85">
                Beautiful spaces, good company and the freedom to enjoy the things you love. Whether it&apos;s a quiet morning in the garden, a shared meal, a movie in the lounge or time with family — Oracle gives you the lifestyle, with support close by when you need it.
              </p>
              <div className="mt-8">
                <Cta href="#oracle-spaces" tone="solid">Discover life at Oracle</Cta>
              </div>
            </div>
          </div>
          <div className="relative order-1 min-h-72 lg:order-2 lg:min-h-[36rem]">
            {lifeImage ? (
              <SanityImage image={lifeImage} width={1400} height={900} sizes="(min-width: 1200px) 58vw, 100vw" cover decorative className="absolute inset-0" />
            ) : null}
          </div>
        </section>
      </Region>

      <Region name="highlights">
        <section aria-label="Life at Oracle" className="border-y border-stone/70 bg-ivory">
          <ul className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gutter py-4 md:grid-cols-5 md:py-2">
            {HIGHLIGHTS.map((item) => (
              <li key={item.label} className="flex flex-col items-center px-3 py-8 text-center md:border-l md:border-stone/80 md:py-12 md:first:border-l-0">
                <HighlightIcon icon={item.icon} />
                <p className="mt-4 max-w-[11rem] font-display text-[17px] leading-snug">{item.label}</p>
              </li>
            ))}
          </ul>
        </section>
      </Region>

      {spaces.length > 0 ? (
        <Region name="spaces">
          <Section tone="sand" labelledBy="oracle-spaces">
            <Heading as="h2" id="oracle-spaces" eyebrow="Shared spaces" titleClassName="scroll-mt-28">More than your room.</Heading>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {spaces.map((space) => (
                <li key={space} className="rounded-panel border border-stone bg-paper px-6 py-7">
                  <span className="block h-0.5 w-8 bg-gold" aria-hidden="true" />
                  <h3 className="mt-5 text-[26px] leading-tight">{space}</h3>
                </li>
              ))}
            </ul>
          </Section>
        </Region>
      ) : null}

      <Region name="everyday">
        <section aria-labelledby="oracle-everyday" className="relative scroll-mt-24 overflow-hidden bg-green text-ivory on-dark section-space">
          {careBackdrop ? (
            <div className="absolute inset-0" aria-hidden="true">
              <SanityImage image={careBackdrop} width={1600} height={900} sizes="100vw" cover decorative className="absolute inset-0 opacity-40" />
            </div>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-green/92 via-green/86 to-night/80" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-[1400px] gutter">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-xl">
                <Heading as="h2" id="oracle-everyday" eyebrow="Everyday living" onDark titleClassName="scroll-mt-28 text-ivory">
                  We take care of the rest.
                </Heading>
                <p className="mt-4 text-ivory/90">
                  Living independently shouldn&apos;t mean having to manage everything yourself. At Oracle, the everyday things are taken care of so you can spend more time living.
                </p>
              </div>
              <Cta href="/silver-roots" tone="pill">Explore Silver Roots</Cta>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {EVERYDAY.map((item) => {
                const body = (
                  <>
                    <EverydayIcon name={item.icon} />
                    <span className="text-[15px] leading-snug font-medium text-ivory">{item.label}</span>
                  </>
                );
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a href={item.href} className="flex h-full min-h-24 flex-col items-start justify-center gap-3 rounded-card border border-ivory/15 bg-night/25 px-4 py-4 no-underline transition-colors hover:bg-night/40">
                        {body}
                      </a>
                    ) : (
                      <div className="flex h-full min-h-24 flex-col items-start justify-center gap-3 rounded-card border border-ivory/15 bg-night/25 px-4 py-4">
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </Region>

      <Region name="optional">
        <Section tone="mist" labelledBy="oracle-optional">
          <Heading as="h2" id="oracle-optional" eyebrow="Care and support">Support, when you want it.</Heading>
          <SupportCards items={residence.careAndSupport} />
          {optional.length > 0 ? (
            <p className="mt-6 max-w-prose-site text-[16px] leading-relaxed">Services arranged separately are agreed with you before they are booked.</p>
          ) : null}
        </Section>
      </Region>

      {fit.length > 0 ? (
        <Region name="independence">
          <section aria-labelledby="oracle-independence" className="relative scroll-mt-24 overflow-hidden bg-green text-ivory on-dark">
            <div className="absolute inset-0">
              <img src="/silver-roots/garden.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_42%]" loading="lazy" decoding="async" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/25 via-night/40 to-night/80" />
            <div className="relative mx-auto flex min-h-[34rem] w-full max-w-[1400px] items-center gutter py-16 lg:min-h-[40rem] lg:py-24">
              <div className="ml-auto w-full max-w-xl">
                <Heading as="h2" id="oracle-independence" eyebrow="Independent living" onDark titleClassName="scroll-mt-28 text-ivory" className="max-w-none">
                  Independence comes first.
                </Heading>
                <p className="mt-4 text-ivory/90">
                  A private home for people who want their own life, with company nearby and support that can grow when they need it.
                </p>
                <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {fit.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[16px] leading-snug text-ivory">
                      <Check />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Cta href="#oracle-visit" tone="pill">Arrange a private visit</Cta>
                </div>
              </div>
            </div>
          </section>
        </Region>
      ) : null}

      <Region name="map">
        <Section tone="sand" labelledBy="oracle-map">
          <Heading as="h2" id="oracle-map" eyebrow="Visit">Location</Heading>
          <div className="mt-8">
            <StaticMap address={residence.address} mapsKey={mapsKey} label="Map of Oracle" expand />
          </div>
        </Section>
      </Region>

      <Region name="visit">
        <Section tone="paper" labelledBy="oracle-visit">
          <EnquiryForm
            kind="oracle-visit"
            context="Oracle"
            headingId="oracle-visit"
            layout="aside"
            eyebrow="Private visit"
            note={contact.responseTime ? `A member of the team will contact you ${contact.responseTime}.` : undefined}
          />
        </Section>
      </Region>
    </main>
  );
}
