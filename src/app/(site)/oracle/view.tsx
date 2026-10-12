import type { ReactNode } from 'react';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { CapabilityList } from '@/components/content/CapabilityList';
import { PageHero } from '@/components/content/PageHero';
import { PortableText } from '@/components/content/PortableText';
import { SanityImage } from '@/components/media/SanityImage';
import { StaticMap } from '@/components/media/StaticMap';
import { Chip } from '@/components/ui/Chip';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture } from '@/lib/content-status';
import type { ResidenceContent } from '../homes/[slug]/view';

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-oracle-section={name}>{children}</div>;
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
        <PageHero title="Oracle" intro="Details will appear here once they are published." tone="night" />
      </main>
    );
  }

  const future = isContentStatus(residence.status) && isFuture(residence.status);
  const rooms = (residence.rooms ?? []).filter((room): room is NonNullable<typeof room> & { name: string } => Boolean(room?.name));
  const spaces = (residence.sharedSpaces ?? []).filter((space): space is string => Boolean(space));
  const optional = (residence.careAndSupport ?? []).filter((item) => item?.title && item.provision && item.provision !== 'included');

  return (
    <main id="main">
      <Region name="hero">
        <PageHero title={residence.name} intro={residence.summary} image={residence.heroImage} status={residence.status} tone="night">
          {residence.shortLocation ? <p>{residence.shortLocation}</p> : null}
        </PageHero>
        <Section tone="ivory">
          {future && residence.comingSoonNote ? <p className="max-w-prose-site">{residence.comingSoonNote}</p> : null}
          <div className="mt-4"><PortableText value={residence.description} /></div>
          <div className="mt-8 max-w-prose-site">
            <EnquiryForm kind="oracle-visit" context="Oracle" />
          </div>
        </Section>
      </Region>
      <Region name="rooms">
        <Section tone="paper" labelledBy="oracle-rooms">
          <Heading as="h2" id="oracle-rooms">Rooms</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {rooms.map((room) => (
              <li key={room._key} className="rounded-panel border border-stone bg-ivory p-6">
                <SanityImage image={room.image} width={640} height={400} sizes="(min-width: 900px) 50vw, 100vw" />
                <h3 className="mt-4">{room.name}</h3>
                {room.house ? <p>{room.house}</p> : null}
                {room.summary ? <p className="mt-2">{room.summary}</p> : null}
                <ul className="mt-2 list-disc pl-6">
                  {(room.facts ?? []).filter(Boolean).map((fact) => <li key={fact}>{fact}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </Section>
      </Region>
      <Region name="spaces">
        <Section tone="sand" labelledBy="oracle-spaces">
          <Heading as="h2" id="oracle-spaces">Shared spaces</Heading>
          <ul className="mt-4 flex flex-wrap gap-2">
            {spaces.map((space) => <li key={space}><Chip>{space}</Chip></li>)}
          </ul>
        </Section>
      </Region>
      <Region name="daily-life">
        <Section tone="ivory" labelledBy="oracle-day">
          <Heading as="h2" id="oracle-day">Live your day, your way.</Heading>
          <div className="mt-4"><PortableText value={residence.atmosphere} /></div>
        </Section>
      </Region>
      <Region name="everyday">
        <Section tone="paper" labelledBy="oracle-everyday">
          <Heading as="h2" id="oracle-everyday">Everyday support</Heading>
          <div className="mt-4"><CapabilityList items={residence.everydayLife} /></div>
        </Section>
      </Region>
      <Region name="optional">
        <Section tone="mist" labelledBy="oracle-optional">
          <Heading as="h2" id="oracle-optional">Optional services</Heading>
          <div className="mt-4"><CapabilityList items={residence.careAndSupport} /></div>
          {optional.length > 0 ? <p className="mt-4 max-w-prose-site">These services are arranged separately.</p> : null}
        </Section>
      </Region>
      <Region name="independence">
        <Section tone="ivory" labelledBy="oracle-independence">
          <Heading as="h2" id="oracle-independence">Independence</Heading>
          <ul className="mt-4 list-disc pl-6">
            {(residence.audienceFit ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Section>
      </Region>
      <Region name="map">
        <Section tone="sand" labelledBy="oracle-map">
          <Heading as="h2" id="oracle-map">Location</Heading>
          <div className="mt-4"><StaticMap address={residence.address} mapsKey={mapsKey} label="Map of Oracle" /></div>
        </Section>
      </Region>
      <Region name="visit">
        <Section tone="paper" labelledBy="oracle-visit">
          <Heading as="h2" id="oracle-visit">Request a private visit</Heading>
          <div className="mt-8 max-w-prose-site">
            <EnquiryForm kind="oracle-visit" context="Oracle" />
          </div>
        </Section>
      </Region>
    </main>
  );
}
