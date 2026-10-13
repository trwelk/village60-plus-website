import type { PortableTextBlock } from '@portabletext/react';
import type { ReactNode } from 'react';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { Button } from '@/components/ui/Button';
import { CapabilityList } from '@/components/content/CapabilityList';
import { PageHero } from '@/components/content/PageHero';
import { PortableText } from '@/components/content/PortableText';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { StaticMap } from '@/components/media/StaticMap';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/cn';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture } from '@/lib/content-status';
import type { ResidenceContent } from '../homes/[slug]/view';

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-oracle-section={name}>{children}</div>;
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

/** Drops a leading paragraph that repeats the hero summary. */
function withoutRepeatedLead(
  value: PortableTextBlock[] | null | undefined,
  summary?: string | null,
): PortableTextBlock[] | null | undefined {
  if (!value?.length || !summary?.trim()) return value;
  if (blockPlainText(value[0]) !== summary.trim().replace(/\s+/g, ' ')) return value;
  return value.slice(1);
}

type Room = NonNullable<NonNullable<ResidenceContent['rooms']>[number]> & { name: string };

function sharedRoomSummary(rooms: Room[]): string | null {
  const summaries = rooms.map((room) => room.summary?.trim() || '');
  const filled = summaries.filter(Boolean);
  if (filled.length === 0 || filled.length !== rooms.length) return null;
  return new Set(filled).size === 1 ? filled[0] : null;
}

function roomsByHouse(rooms: Room[]): Array<[string, Room[]]> {
  const groups = new Map<string, Room[]>();
  for (const room of rooms) {
    const house = room.house?.trim() || '';
    const list = groups.get(house) ?? [];
    list.push(room);
    groups.set(house, list);
  }
  return [...groups.entries()];
}

function hasPhoto(image: CmsImage | null | undefined) {
  return Boolean(image?.asset?.url && image.alt?.trim());
}

function RoomCard({ room, showSummary }: { room: Room; showSummary: boolean }) {
  const facts = (room.facts ?? []).filter((fact): fact is string => Boolean(fact));
  return (
    <article className="w-64 shrink-0 overflow-hidden rounded-panel border border-stone bg-ivory sm:w-72">
      <div className="relative aspect-[3/2] bg-sand">
        {hasPhoto(room.image) ? (
          <SanityImage image={room.image} width={576} height={384} sizes="288px" cover className="absolute inset-0" />
        ) : null}
      </div>
      <div className="px-5 py-4">
        <h3 className="text-[22px] leading-none">{room.name}</h3>
        {showSummary && room.summary ? <p className="mt-2 text-[15px] leading-snug">{room.summary}</p> : null}
        {facts.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1 text-[15px] leading-snug">
            {facts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function HouseRow({ house, rooms, showSummary, reverse }: { house: string; rooms: Room[]; showSummary: boolean; reverse: boolean }) {
  const moving = rooms.length > 1;
  return (
    <div className="min-w-0">
      {house ? <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-bronze">{house}</p> : null}
      <div className={cn('w-full overflow-hidden motion-reduce:overflow-x-auto', house && 'mt-4')}>
        <ul
          className={cn(
            'flex w-max gap-4',
            moving && 'motion-safe:animate-room-marquee motion-safe:hover:[animation-play-state:paused]',
          )}
          style={moving ? { animationDuration: `${rooms.length * 6}s`, animationDirection: reverse ? 'reverse' : 'normal' } : undefined}
        >
          {rooms.map((room) => (
            <li key={room._key}>
              <RoomCard room={room} showSummary={showSummary} />
            </li>
          ))}
          {moving
            ? rooms.map((room) => (
                <li key={`${room._key}-clone`} className="motion-reduce:hidden" aria-hidden="true">
                  <RoomCard room={room} showSummary={showSummary} />
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
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
  const lead = withoutRepeatedLead(residence.description, residence.summary);
  const showLead = Boolean((future && residence.comingSoonNote) || lead?.length);
  const roomNote = sharedRoomSummary(rooms);
  const houses = roomsByHouse(rooms);

  return (
    <main id="main">
      <Region name="hero">
        <PageHero
          layout="overlay"
          title={residence.name}
          intro={residence.summary}
          image={residence.heroImage}
          status={residence.status}
          eyebrow={residence.shortLocation}
          tone="night"
        >
          <Button href="#oracle-visit" onDark size="lg">Arrange a private visit</Button>
        </PageHero>
        {showLead ? (
          <Section tone="ivory" className="band-from-hero">
            <div className="flex max-w-prose-site flex-col gap-4 border-l-2 border-gold pl-6">
              {future && residence.comingSoonNote ? <p>{residence.comingSoonNote}</p> : null}
              <PortableText value={lead} />
            </div>
          </Section>
        ) : null}
      </Region>
      <Region name="rooms">
        <Section tone="paper" labelledBy="oracle-rooms">
          {roomNote ? (
            <div className="grid items-baseline gap-4 md:grid-cols-[auto_minmax(0,36rem)] md:justify-between md:gap-x-16">
              <Heading as="h2" id="oracle-rooms">Rooms</Heading>
              <p className="max-w-prose-site">{roomNote}</p>
            </div>
          ) : (
            <Heading as="h2" id="oracle-rooms">Rooms</Heading>
          )}
          <div className="mt-10 flex flex-col gap-10">
            {houses.map(([house, list], index) => (
              <HouseRow key={house || 'rooms'} house={house} rooms={list} showSummary={!roomNote} reverse={index % 2 === 1} />
            ))}
          </div>
        </Section>
      </Region>
      <Region name="spaces">
        <Section tone="sand" labelledBy="oracle-spaces">
          <Heading as="h2" id="oracle-spaces">Shared spaces</Heading>
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
      <Region name="daily-life">
        <Section tone="night" labelledBy="oracle-day">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-x-16">
            <Heading
              as="h2"
              id="oracle-day"
              onDark
              titleClassName="max-w-[9em] text-[clamp(36px,4.2vw,56px)] leading-[1.05]"
            >
              Live your day, your way.
            </Heading>
            <div className="border-l-2 border-pale-gold pl-6">
              <PortableText value={residence.atmosphere} onDark />
            </div>
          </div>
        </Section>
      </Region>
      <Region name="everyday">
        <Section tone="paper" labelledBy="oracle-everyday">
          <Heading as="h2" id="oracle-everyday">Everyday support</Heading>
          <div className="mt-8"><CapabilityList items={residence.everydayLife} /></div>
        </Section>
      </Region>
      <Region name="optional">
        <Section tone="mist" labelledBy="oracle-optional">
          <Heading as="h2" id="oracle-optional">Care and support</Heading>
          <div className="mt-8"><CapabilityList items={residence.careAndSupport} /></div>
          {optional.length > 0 ? (
            <p className="mt-6 max-w-prose-site text-[16px] leading-relaxed">Services arranged separately are agreed with you before they are booked.</p>
          ) : null}
        </Section>
      </Region>
      <Region name="independence">
        <Section tone="ivory" labelledBy="oracle-independence">
          <Heading as="h2" id="oracle-independence">Independence</Heading>
          <ul className={cn('mt-8 grid gap-4', fit.length > 2 ? 'md:grid-cols-3' : 'sm:grid-cols-2')}>
            {fit.map((item) => (
              <li key={item} className="rounded-panel border border-stone bg-paper px-6 py-7">
                <span className="block h-0.5 w-8 bg-gold" aria-hidden="true" />
                <p className="mt-5 font-display text-[22px] leading-snug md:text-[24px]">{item}</p>
              </li>
            ))}
          </ul>
        </Section>
      </Region>
      <Region name="map">
        <Section tone="sand" labelledBy="oracle-map">
          <Heading as="h2" id="oracle-map">Location</Heading>
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
