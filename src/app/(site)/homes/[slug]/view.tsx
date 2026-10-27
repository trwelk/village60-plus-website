import type { PortableTextBlock } from '@portabletext/react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { provisionLabel, type CapabilityItem } from '@/components/content/CapabilityList';
import { FaqList, type FaqItem } from '@/components/content/FaqList';
import { PageHero } from '@/components/content/PageHero';
import { PortableText } from '@/components/content/PortableText';
import { Gallery, type GalleryImage } from '@/components/media/Gallery';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { StaticMap } from '@/components/media/StaticMap';
import { ContactActions } from '@/components/site/ContactActions';
import type { Crumb } from '@/components/ui/Breadcrumbs';
import { Chip } from '@/components/ui/Chip';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/cn';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture } from '@/lib/content-status';
import { asFormKind } from '@/lib/forms/kinds';
import type { MapAddress } from '@/lib/maps';

export type ResidenceContent = {
  name: string;
  slug: string;
  status?: string | null;
  shortLocation?: string | null;
  summary?: string | null;
  heroImage?: CmsImage | null;
  description?: PortableTextBlock[] | null;
  careTypes?: Array<{ _id: string; name?: string | null; slug?: string | null } | null> | null;
  audienceFit?: Array<string | null> | null;
  atmosphere?: PortableTextBlock[] | null;
  sharedSpaces?: Array<string | null> | null;
  rooms?: Array<{ _key: string; name?: string | null; house?: string | null; summary?: string | null; facts?: Array<string | null> | null; image?: CmsImage | null } | null> | null;
  careAndSupport?: Array<CapabilityItem | null> | null;
  everydayLife?: Array<CapabilityItem | null> | null;
  gallery?: Array<GalleryImage | null> | null;
  team?: Array<{ _id: string; name?: string | null; role?: string | null; credentials?: Array<string | null> | null; image?: CmsImage | null } | null> | null;
  address?: MapAddress | null;
  faqs?: Array<FaqItem | null> | null;
  formKind?: string | null;
  comingSoonNote?: string | null;
};

type Room = NonNullable<NonNullable<ResidenceContent['rooms']>[number]> & { name: string };
type Person = NonNullable<NonNullable<ResidenceContent['team']>[number]> & { name: string };

function Region({ name, className, children }: { name: string; className?: string; children: ReactNode }) {
  return (
    <div data-residence-section={name} className={className}>
      {children}
    </div>
  );
}

function blockPlainText(block: PortableTextBlock): string {
  const children = (block as { children?: Array<{ text?: string }> }).children;
  if (!children) return '';
  return children
    .map((child) => child.text ?? '')
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Drops body paragraphs that repeat the hero summary word for word. */
function descriptionBeyondSummary(description: PortableTextBlock[] | null | undefined, summary: string | null | undefined) {
  const lead = summary?.trim().replace(/\s+/g, ' ');
  const blocks = description ?? [];
  if (!lead) return blocks;
  return blocks.filter((block) => blockPlainText(block) !== lead);
}

function notableStatus(status: string | null | undefined) {
  return isContentStatus(status) && status !== 'available' ? status : null;
}

function hasPhoto(image: CmsImage | null | undefined) {
  return Boolean(image?.asset?.url && image.alt?.trim());
}

function suitColumns(count: number) {
  if (count >= 5) return 'md:grid-cols-5';
  if (count === 4) return 'md:grid-cols-4';
  if (count === 3) return 'md:grid-cols-3';
  if (count === 2) return 'md:grid-cols-2';
  return '';
}

type SuitIconName = 'house' | 'leaf' | 'cup' | 'lotus' | 'people';

const SUIT_ICONS: SuitIconName[] = ['house', 'leaf', 'cup', 'lotus', 'people'];

function SuitIcon({ name }: { name: SuitIconName }) {
  const common = { viewBox: '0 0 48 48', className: 'size-10 text-gold', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, 'aria-hidden': true as const };
  if (name === 'house') {
    return (
      <svg {...common}>
        <path d="M8 22 24 8l16 14v18H8V22Z" strokeLinejoin="round" />
        <path d="M20 40V28h8v12" />
      </svg>
    );
  }
  if (name === 'leaf') {
    return (
      <svg {...common}>
        <path d="M24 7c9 9 15 18 12 28-9 4-20-1-12-28Z" strokeLinejoin="round" />
        <path d="M24 35V14" strokeLinecap="round" />
        <path d="M24 26c-5-1-8-5-8-8M24 22c5-1 8-4 9-8" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === 'cup') {
    return (
      <svg {...common}>
        <path d="M15 16h16v11a8 8 0 0 1-16 0V16Z" />
        <path d="M31 19h3a4 4 0 0 1 0 8h-3" />
        <path d="M16 40h16" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === 'lotus') {
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

const RESIDENCE_SECTION_LABELS: Partial<
  Record<
    string,
    {
      audience?: string;
      spaces?: string;
      sharedSpaces?: string;
      care?: string;
      everyday?: string;
    }
  >
> = {
  'enchanted-fields': {
    audience: 'What we offer in our communities',
    spaces: 'Amenities at the retirement chalets',
    sharedSpaces: 'Community facilities at Enchanted Fields Retirement Villas',
    care: 'Care at the retirement chalets',
    everyday: 'Activity programme',
  },
};

function residenceSectionLabel(slug: string, section: keyof NonNullable<(typeof RESIDENCE_SECTION_LABELS)[string]>, fallback: string) {
  return RESIDENCE_SECTION_LABELS[slug]?.[section] ?? fallback;
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" />
      <path d="M6.5 10.2 8.8 12.5 13.5 7.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type FeatureBandCopy = {
  intro: string;
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
  side: 'left' | 'right';
  ctaHref: string;
  ctaLabel: string;
};

const CARE_BAND: FeatureBandCopy = {
  intro: 'We support your wider health and wellbeing by coordinating appointments, medication and other healthcare services.',
  imageSrc: '/people/hands.jpg',
  imageAlt: 'A nurse holding hands with a resident',
  side: 'right',
  ctaHref: '/living-and-care#health',
  ctaLabel: 'Explore care & support',
};

const EVERYDAY_BAND: FeatureBandCopy = {
  intro:
    'Nutritious, home-cooked meals prepared fresh, with housekeeping looked after and family welcome. Enjoy meals in the dining spaces or in the comfort of your own room.',
  imageSrc: '/home/living-room.jpg',
  imageAlt: 'A dining table beside open doors to the garden',
  imageClassName: 'object-[78%_center]',
  side: 'left',
  ctaHref: '/living-and-care#good-food',
  ctaLabel: 'Explore meals & dining',
};

function FeatureBand({
  id,
  title,
  items,
  copy,
}: {
  id: string;
  title: string;
  items: Array<CapabilityItem | null> | null | undefined;
  copy: FeatureBandCopy;
}) {
  const rows = (items ?? []).filter((item): item is CapabilityItem & { title: string } => Boolean(item?.title));
  if (rows.length === 0) return null;
  const photo = (
    <div className={cn('relative aspect-[4/3] overflow-hidden rounded-panel bg-sand lg:aspect-[5/4]', copy.side === 'right' && 'lg:order-2')}>
      <img
        src={copy.imageSrc}
        alt={copy.imageAlt}
        className={cn('absolute inset-0 h-full w-full object-cover', copy.imageClassName)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
  const text = (
    <div className={copy.side === 'right' ? 'lg:order-1' : undefined}>
      <Heading as="h2" id={id} titleClassName="text-green" className="max-w-none">
        {title}
      </Heading>
      <p className="mt-4 max-w-prose-site text-charcoal/85">{copy.intro}</p>
      <ul className="m-0 mt-6 grid list-none gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
        {rows.map((item) => {
          const provision = item.provision && item.provision !== 'included' ? provisionLabel(item.provision) : null;
          const status = notableStatus(item.status);
          return (
            <li key={item._key} className="flex items-start gap-3 text-[16px] leading-snug text-charcoal/90">
              <Check />
              <div>
                <p>{item.title}</p>
                {item.description ? <p className="mt-1 text-[15px] leading-snug text-charcoal/70">{item.description}</p> : null}
                {provision || status ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {provision ? <Chip>{provision}</Chip> : null}
                    {status ? <StatusBadge status={status} /> : null}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8">
        <Link
          href={copy.ctaHref}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 py-3 text-[13px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-bronze hover:text-ivory"
        >
          {copy.ctaLabel}
          <Arrow />
        </Link>
      </div>
    </div>
  );
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {copy.side === 'left' ? photo : null}
      {text}
      {copy.side === 'right' ? photo : null}
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  const facts = (room.facts ?? []).filter((fact): fact is string => Boolean(fact));
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-panel border border-stone bg-ivory">
      {hasPhoto(room.image) ? (
        <div className="relative aspect-[3/2] bg-sand">
          <SanityImage image={room.image} width={800} height={533} sizes="(min-width: 1200px) 560px, 100vw" cover className="absolute inset-0" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {room.house ? <p className="text-[14px] font-semibold tracking-[0.08em] text-bronze uppercase">{room.house}</p> : null}
        <h3 className="text-[24px] leading-snug">{room.name}</h3>
        {room.summary ? <p>{room.summary}</p> : null}
        {facts.length > 0 ? (
          <ul className="mt-auto flex list-none flex-col gap-2 border-t border-stone pt-4 text-[15px] leading-snug">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function PersonCard({ person }: { person: Person }) {
  const credentials = (person.credentials ?? []).filter((item): item is string => Boolean(item));
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-panel border border-stone bg-paper">
      {hasPhoto(person.image) ? (
        <div className="relative aspect-square bg-sand">
          <SanityImage image={person.image} width={640} height={640} sizes="(min-width: 1200px) 380px, 100vw" cover className="absolute inset-0" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[24px] leading-snug">{person.name}</h3>
        {person.role ? <p className="mt-1 text-[15px] text-bronze">{person.role}</p> : null}
        {credentials.length > 0 ? (
          <ul className="mt-4 flex list-none flex-col gap-1 border-t border-stone pt-4 text-[15px] leading-snug">
            {credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function ResidenceView({
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
        <PageHero layout="overlay" title="This home" intro="Details will appear here once they are published." tone="night" />
      </main>
    );
  }

  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Our homes', href: '/homes' },
    { label: residence.name },
  ];
  const future = isContentStatus(residence.status) && isFuture(residence.status);
  const cares = (residence.careTypes ?? []).filter((item): item is { _id: string; name: string } => Boolean(item?.name));

  if (future) {
    return (
      <main id="main">
        <Region name="hero">
          <PageHero
            layout="overlay"
            eyebrow={residence.shortLocation}
            title={residence.name}
            intro={residence.comingSoonNote}
            image={residence.heroImage}
            status={residence.status}
            tone="night"
            crumbs={crumbs}
          />
        </Region>
        <Region name="coming-soon">
          <Section tone="paper" className="band-from-hero">
            <EnquiryForm kind="grove-interest" context={residence.name} layout="aside" />
          </Section>
        </Region>
      </main>
    );
  }

  const rooms = (residence.rooms ?? []).filter((room): room is Room => Boolean(room?.name));
  const spaces = (residence.sharedSpaces ?? []).filter((space): space is string => Boolean(space));
  const team = (residence.team ?? []).filter((person): person is Person => Boolean(person?.name));
  const photos = (residence.gallery ?? []).filter((image) => Boolean(image?.asset?.url && image.alt?.trim()));
  const faqs = (residence.faqs ?? []).filter((item) => Boolean(item?.question));
  const suits = (residence.audienceFit ?? []).filter((item): item is string => Boolean(item));
  const atmospherePhoto = photos.at(-1) ?? (hasPhoto(residence.heroImage) ? residence.heroImage : null);
  const story = descriptionBeyondSummary(residence.description, residence.summary);
  const care = (residence.careAndSupport ?? []).filter((item) => Boolean(item?.title));
  const everyday = (residence.everydayLife ?? []).filter((item) => Boolean(item?.title));
  const atmosphere = residence.atmosphere ?? [];

  return (
    <main id="main">
      <Region name="hero">
        <PageHero
          layout="overlay"
          eyebrow={residence.shortLocation}
          title={residence.name}
          intro={residence.summary}
          image={residence.heroImage}
          status={residence.status}
          tone="night"
          crumbs={crumbs}
        >
          {story.length > 0 ? <PortableText value={story} onDark /> : null}
          {cares.length > 0 ? (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {cares.map((careType) => (
                <li key={careType._id}>
                  <Chip tone="dark">{careType.name}</Chip>
                </li>
              ))}
            </ul>
          ) : null}
          <EnquiryButton
            kind={asFormKind(residence.formKind)}
            context={residence.name}
            className="inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-pale-gold px-5 text-[12px] font-semibold tracking-[0.14em] text-night uppercase transition-colors duration-(--duration-fast) hover:bg-gold"
          >
            Enquire
          </EnquiryButton>
        </PageHero>
      </Region>

      {photos.length > 0 ? (
        <Region name="gallery">
          <Section tone="paper" className="band-from-hero overflow-x-clip">
            <Gallery
              images={residence.gallery}
              label={`${residence.name} photographs`}
              title="A look through the house"
              titleId="photographs"
              intro="The house, in pictures"
            />
          </Section>
        </Region>
      ) : null}

      {suits.length > 0 ? (
        <Region name="audience">
          <section aria-labelledby="who-it-suits" className={cn('border-y border-stone/70 bg-ivory', photos.length > 0 ? undefined : 'band-from-hero')}>
            <h2 id="who-it-suits" className="visually-hidden">
              {residenceSectionLabel(residence.slug, 'audience', 'Who this home suits')}
            </h2>
            <ul className={cn('mx-auto grid w-full max-w-site list-none gutter md:py-2', suitColumns(suits.length))}>
              {suits.map((item, index) => (
                <li key={item} className="flex flex-col items-center border-stone/80 px-4 py-10 text-center max-md:border-t max-md:first:border-t-0 md:border-l md:py-12 md:first:border-l-0">
                  <SuitIcon name={SUIT_ICONS[index % SUIT_ICONS.length]} />
                  <p className="mt-4 max-w-[12rem] font-display text-[17px] leading-snug">{item}</p>
                </li>
              ))}
            </ul>
          </section>
        </Region>
      ) : null}

      {atmosphere.length > 0 ? (
        <Region name="atmosphere">
          <section aria-labelledby="atmosphere" className="relative flex min-h-[22rem] scroll-mt-24 items-center overflow-hidden bg-green text-ivory on-dark section-space md:min-h-[28rem] lg:min-h-[34rem]">
            {atmospherePhoto ? (
              <div className="absolute inset-0" aria-hidden="true">
                <SanityImage image={atmospherePhoto} width={1600} height={900} sizes="100vw" cover decorative className="absolute inset-0 opacity-40" />
              </div>
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-green/92 via-green/86 to-night/80" aria-hidden="true" />
            <div className="relative mx-auto flex w-full max-w-site flex-col items-start justify-between gap-8 gutter lg:flex-row lg:items-end">
              <div className="max-w-xl">
                <Heading as="h2" id="atmosphere" eyebrow="Daily life" onDark titleClassName="text-ivory">
                  Atmosphere and daily life
                </Heading>
                <div className="mt-4 text-ivory/90">
                  <PortableText value={residence.atmosphere} onDark />
                </div>
              </div>
              <Link
                href="/silver-roots"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-gold px-6 text-[13px] font-semibold tracking-[0.14em] text-night uppercase no-underline transition-colors duration-(--duration-fast) hover:bg-bronze hover:text-ivory"
              >
                Explore Silver Roots
                <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </section>
        </Region>
      ) : null}

      <Region name="spaces">
        <Section tone="paper" labelledBy="spaces">
          <Heading as="h2" id="spaces">
            {residenceSectionLabel(residence.slug, 'spaces', 'Rooms and shared spaces')}
          </Heading>
          {rooms.length > 0 ? (
            <ul className="m-0 mt-8 grid list-none gap-4 p-0 md:grid-cols-2">
              {rooms.map((room) => (
                <li key={room._key}>
                  <RoomCard room={room} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-prose-site">Room details and photographs are published once they are verified.</p>
          )}
          {spaces.length > 0 ? (
            <div className={rooms.length > 0 ? 'mt-12' : 'mt-10'}>
              <h3 className="text-[22px] leading-snug md:text-[24px]">
                {residenceSectionLabel(residence.slug, 'sharedSpaces', 'Shared spaces')}
              </h3>
              <ul className="m-0 mt-4 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {spaces.map((space) => (
                  <li key={space} className="rounded-panel border border-stone bg-sand px-5 py-4 font-display text-[20px] leading-snug">
                    {space}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      </Region>

      {care.length > 0 ? (
        <Region name="care">
          <Section tone="ivory" labelledBy="care-here">
            <FeatureBand
              id="care-here"
              title={residenceSectionLabel(residence.slug, 'care', 'Care and support at this home')}
              items={residence.careAndSupport}
              copy={
                residence.slug === 'serenity'
                  ? {
                      ...CARE_BAND,
                      imageSrc: '/homes/serenity/serenity-grounds.jpg',
                      imageAlt: 'The lawn and verandah at Serenity, with white buildings, green roofs and tropical planting',
                    }
                  : CARE_BAND
              }
            />
          </Section>
        </Region>
      ) : null}

      {everyday.length > 0 ? (
        <Region name="everyday">
          <Section tone="paper" labelledBy="everyday">
            <FeatureBand
              id="everyday"
              title={residenceSectionLabel(residence.slug, 'everyday', 'Meals, housekeeping and family visits')}
              items={residence.everydayLife}
              copy={EVERYDAY_BAND}
            />
          </Section>
        </Region>
      ) : null}

      {team.length > 0 ? (
        <Region name="team">
          <Section tone="sand" labelledBy="team">
            <Heading as="h2" id="team">
              The team
            </Heading>
            <ul className="m-0 mt-8 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
              {team.map((person) => (
                <li key={person._id}>
                  <PersonCard person={person} />
                </li>
              ))}
            </ul>
          </Section>
        </Region>
      ) : null}

      <Region name="map">
        <Section tone="mist" labelledBy="visit">
          <Heading as="h2" id="visit">
            Visit
          </Heading>
          <StaticMap address={residence.address} mapsKey={mapsKey} label={`Map of ${residence.name}`} expand className="mt-8" />
        </Section>
      </Region>

      <Section tone="sand">
        <div className={cn('grid items-start gap-10', faqs.length > 0 && 'lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-16')}>
          {faqs.length > 0 ? (
            <Region name="faqs">
              <FaqList items={residence.faqs} width="full" />
            </Region>
          ) : null}
          <Region name="enquiry" className={faqs.length > 0 ? undefined : 'max-w-xl'}>
            <div className="rounded-panel border border-stone bg-paper p-6 shadow-panel md:p-8 lg:sticky lg:top-8">
              <Heading as="h2" id="speak-with-the-team">
                Speak with the team
              </Heading>
              <p className="mt-4">Ask about {residence.name} by phone, WhatsApp, or a short note.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <EnquiryButton kind={asFormKind(residence.formKind)} context={residence.name}>
                  Enquire
                </EnquiryButton>
                <ContactActions contact={contact} context={residence.name} />
              </div>
            </div>
          </Region>
        </div>
      </Section>
    </main>
  );
}
