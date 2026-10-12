import type { PortableTextBlock } from '@portabletext/react';
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { CapabilityList, type CapabilityItem } from '@/components/content/CapabilityList';
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

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-residence-section={name}>{children}</div>;
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
          <PageHero title={residence.name} intro={residence.shortLocation} image={residence.heroImage} status={residence.status} tone="ivory" />
        </Region>
        <Region name="coming-soon">
          <Section tone="paper">
            <p className="max-w-prose-site">{residence.comingSoonNote}</p>
            <div className="mt-8 max-w-prose-site">
              <EnquiryForm kind="grove-interest" context={residence.name} />
            </div>
          </Section>
        </Region>
      </main>
    );
  }

  const rooms = (residence.rooms ?? []).filter((room): room is NonNullable<typeof room> & { name: string } => Boolean(room?.name));
  const spaces = (residence.sharedSpaces ?? []).filter((space): space is string => Boolean(space));
  const team = (residence.team ?? []).filter((person): person is NonNullable<typeof person> & { name: string } => Boolean(person?.name));

  return (
    <main id="main">
      <Breadcrumbs items={crumbs} />
      <Region name="hero">
        <PageHero title={residence.name} intro={residence.summary} image={residence.heroImage} status={residence.status} tone="ivory">
          {residence.shortLocation ? <p>{residence.shortLocation}</p> : null}
          {cares.map((care) => <Chip key={care._id}>{care.name}</Chip>)}
        </PageHero>
        <div className="gutter mx-auto w-full max-w-site pb-8">
          <PortableText value={residence.description} />
        </div>
      </Region>
      <Region name="audience">
        <Section tone="sand" labelledBy="who-it-suits">
          <Heading as="h2" id="who-it-suits">Who this home suits</Heading>
          <ul className="mt-4 list-disc pl-6">
            {(residence.audienceFit ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Section>
      </Region>
      <Region name="atmosphere">
        <Section tone="ivory" labelledBy="atmosphere">
          <Heading as="h2" id="atmosphere">Atmosphere and daily life</Heading>
          <div className="mt-4"><PortableText value={residence.atmosphere} /></div>
        </Section>
      </Region>
      <Region name="spaces">
        <Section tone="paper" labelledBy="spaces">
          <Heading as="h2" id="spaces">Rooms and shared spaces</Heading>
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
          {spaces.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {spaces.map((space) => <li key={space}><Chip>{space}</Chip></li>)}
            </ul>
          ) : null}
        </Section>
      </Region>
      <Region name="care">
        <Section tone="mist" labelledBy="care-here">
          <Heading as="h2" id="care-here">Care and support at this home</Heading>
          <div className="mt-4"><CapabilityList items={residence.careAndSupport} /></div>
        </Section>
      </Region>
      <Region name="everyday">
        <Section tone="ivory" labelledBy="everyday">
          <Heading as="h2" id="everyday">Meals, housekeeping and family visits</Heading>
          <div className="mt-4"><CapabilityList items={residence.everydayLife} /></div>
        </Section>
      </Region>
      <Region name="gallery">
        <Section tone="paper">
          <Gallery images={residence.gallery} label={`${residence.name} photographs`} />
        </Section>
      </Region>
      <Region name="team">
        <Section tone="sand" labelledBy="team">
          <Heading as="h2" id="team">Team</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.map((person) => (
              <li key={person._id}>
                <SanityImage image={person.image} width={480} height={480} sizes="240px" />
                <h3 className="mt-3">{person.name}</h3>
                {person.role ? <p>{person.role}</p> : null}
                <ul>
                  {(person.credentials ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </Section>
      </Region>
      <Region name="map">
        <Section tone="ivory" labelledBy="visit">
          <Heading as="h2" id="visit">Visit</Heading>
          <div className="mt-4"><StaticMap address={residence.address} mapsKey={mapsKey} label={`Map of ${residence.name}`} /></div>
        </Section>
      </Region>
      <Region name="faqs">
        <Section tone="paper">
          <FaqList items={residence.faqs} />
        </Section>
      </Region>
      <Region name="enquiry">
        <Section tone="sand">
          <EnquiryButton kind={asFormKind(residence.formKind)} context={residence.name}>Enquire</EnquiryButton>
          <div className="mt-4">
            <ContactActions contact={contact} context={residence.name} />
          </div>
        </Section>
      </Region>
    </main>
  );
}
