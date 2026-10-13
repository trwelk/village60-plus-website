import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PageHero } from '@/components/content/PageHero';
import { StaticMap } from '@/components/media/StaticMap';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { mailtoHref, telHref, whatsappHref, type SiteContact } from '@/lib/contact';
import { directionsHref, type MapAddress } from '@/lib/maps';
import { formatAddress, type SiteAddress } from '@/lib/site-settings';

export function ContactView({
  title,
  intro,
  contact,
  openingHours,
  emergencyNotice,
  headOffice,
  residences,
  mapsKey,
}: {
  title: string;
  intro?: string | null;
  contact: SiteContact;
  openingHours?: string | null;
  emergencyNotice?: string | null;
  headOffice?: MapAddress | null;
  residences: Array<{ name: string; address: MapAddress | null }>;
  mapsKey: string | null;
}) {
  const office = formatAddress(headOffice as SiteAddress | null | undefined);
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory" />
      <Section tone="paper">
        <ul className="flex flex-col gap-3">
          {contact.phone ? <li><a href={telHref(contact.phone)} data-track="call_click">{contact.phoneDisplay}</a></li> : null}
          {contact.whatsapp ? <li><a href={whatsappHref(contact.whatsapp, 'Contact')} data-track="whatsapp_click" target="_blank" rel="noopener noreferrer">WhatsApp</a></li> : null}
          {contact.email ? <li><a href={mailtoHref(contact.email)}>{contact.email}</a></li> : null}
        </ul>
        {openingHours ? <p className="mt-4">{openingHours}</p> : null}
        <p className="mt-2">{contact.responseTime}</p>
        {office ? <p className="mt-4 whitespace-pre-line">{office}</p> : null}
        {emergencyNotice?.trim() ? <p role="note" className="mt-6 max-w-prose-site font-semibold">{emergencyNotice}</p> : null}
      </Section>
      <Section tone="ivory" labelledBy="residence-addresses">
        <Heading as="h2" id="residence-addresses">Residences</Heading>
        <ul className="mt-8 flex flex-col gap-10">
          {residences.map((residence) => {
            const directions = directionsHref(residence.address);
            return (
              <li key={residence.name}>
                <h3>{residence.name}</h3>
                <StaticMap address={residence.address} mapsKey={mapsKey} label={`Map of ${residence.name}`} />
                {directions ? <Button href={directions} variant="text" target="_blank" rel="noopener noreferrer" data-track="directions_click">Directions to {residence.name}</Button> : null}
              </li>
            );
          })}
        </ul>
      </Section>
      <Section tone="sand">
        <div className="max-w-prose-site">
          <EnquiryForm kind="general" context="Contact" />
        </div>
      </Section>
    </main>
  );
}
