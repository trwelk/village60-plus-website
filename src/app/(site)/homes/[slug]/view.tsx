import type { PortableTextBlock } from '@portabletext/react';
import type { ReactNode } from 'react';
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
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
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

function columnCount(count: number) {
  if (count >= 4) return 'md:grid-cols-2 xl:grid-cols-4';
  if (count === 3) return 'md:grid-cols-3';
  if (count === 2) return 'md:grid-cols-2';
  return '';
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

function SupportGrid({ items, surface = 'paper' }: { items: Array<CapabilityItem | null> | null | undefined; surface?: 'paper' | 'ivory' }) {
  const rows = (items ?? []).filter((item): item is CapabilityItem & { title: string } => Boolean(item?.title));
  if (rows.length === 0) return null;
  return (
    <ul className={cn('m-0 mt-8 grid list-none gap-4 p-0', rows.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2')}>
      {rows.map((item) => {
        const provision = provisionLabel(item.provision);
        const status = notableStatus(item.status);
        return (
          <li key={item._key} className={cn('flex h-full flex-col rounded-panel border border-stone p-6', surface === 'paper' ? 'bg-paper' : 'bg-ivory')}>
            {provision || status ? (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {provision ? <Chip>{provision}</Chip> : null}
                {status ? <StatusBadge status={status} /> : null}
              </div>
            ) : null}
            <h3 className="text-[22px] leading-snug md:text-[24px]">{item.title}</h3>
            {item.description ? <p className="mt-2">{item.description}</p> : null}
          </li>
        );
      })}
    </ul>
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
        <PageHero title="This home" intro="Details will appear here once they are published." tone="ivory" />
      </main>
    );
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Our homes', href: '/homes' },
    { label: residence.name },
  ];
  const future = isContentStatus(residence.status) && isFuture(residence.status);
  const cares = (residence.careTypes ?? []).filter((item): item is { _id: string; name: string } => Boolean(item?.name));

  if (future) {
    return (
      <main id="main">
        <Breadcrumbs items={crumbs} />
        <Region name="hero">
          <PageHero
            eyebrow={residence.shortLocation}
            title={residence.name}
            intro={residence.comingSoonNote}
            image={residence.heroImage}
            status={residence.status}
            tone="ivory"
            framed
            align="center"
            offset={false}
            className="hero-to-band"
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
  const story = descriptionBeyondSummary(residence.description, residence.summary);
  const care = (residence.careAndSupport ?? []).filter((item) => Boolean(item?.title));
  const everyday = (residence.everydayLife ?? []).filter((item) => Boolean(item?.title));
  const atmosphere = residence.atmosphere ?? [];

  return (
    <main id="main">
      <Breadcrumbs items={crumbs} />
      <Region name="hero">
        <PageHero
          eyebrow={residence.shortLocation}
          title={residence.name}
          intro={residence.summary}
          image={residence.heroImage}
          status={residence.status}
          tone="ivory"
          framed
          align="center"
          offset={false}
          className="hero-to-band"
        >
          {story.length > 0 ? <PortableText value={story} /> : null}
          {cares.length > 0 ? (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {cares.map((careType) => (
                <li key={careType._id}>
                  <Chip>{careType.name}</Chip>
                </li>
              ))}
            </ul>
          ) : null}
          <EnquiryButton kind={asFormKind(residence.formKind)} context={residence.name}>
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
          <Section tone="sand" labelledBy="who-it-suits" className={photos.length > 0 ? undefined : 'band-from-hero'}>
            <Heading as="h2" id="who-it-suits">
              {residenceSectionLabel(residence.slug, 'audience', 'Who this home suits')}
            </Heading>
            <ul className={cn('m-0 mt-8 grid list-none gap-4 p-0', columnCount(suits.length))}>
              {suits.map((item, index) => (
                <li key={item} className="flex h-full flex-col rounded-panel border border-stone bg-paper p-6">
                  <span aria-hidden="true" className="grid size-10 place-items-center rounded-full border border-gold bg-ivory font-display text-[15px] leading-none text-green">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-4">{item}</p>
                </li>
              ))}
            </ul>
          </Section>
        </Region>
      ) : null}

      {atmosphere.length > 0 ? (
        <Region name="atmosphere">
          <Section tone="ivory" labelledBy="atmosphere">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:gap-16">
              <Heading as="h2" id="atmosphere">
                Atmosphere and daily life
              </Heading>
              <div className="border-l-2 border-gold pl-6 md:pl-8">
                <PortableText value={residence.atmosphere} />
              </div>
            </div>
          </Section>
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
          <Section tone="mist" labelledBy="care-here">
            <Heading as="h2" id="care-here">
              {residenceSectionLabel(residence.slug, 'care', 'Care and support at this home')}
            </Heading>
            <SupportGrid items={residence.careAndSupport} />
          </Section>
        </Region>
      ) : null}

      {everyday.length > 0 ? (
        <Region name="everyday">
          <Section tone="ivory" labelledBy="everyday">
            <Heading as="h2" id="everyday">
              {residenceSectionLabel(residence.slug, 'everyday', 'Meals, housekeeping and family visits')}
            </Heading>
            <SupportGrid items={residence.everydayLife} />
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
