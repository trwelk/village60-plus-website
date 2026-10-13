import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { StaticMap } from '@/components/media/StaticMap';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/cn';
import { mailtoHref, telHref, whatsappHref, type SiteContact } from '@/lib/contact';
import { type MapAddress } from '@/lib/maps';
import { formatAddress, type SiteAddress } from '@/lib/site-settings';

const kicker = 'text-[14px] font-semibold uppercase tracking-[0.08em] text-bronze';

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
  const notice = emergencyNotice?.trim();
  const showReach = Boolean(contact.phone || contact.whatsapp || contact.email);

  return (
    <main id="main">
      <Section tone="ivory" labelledBy="page-title" className="clear-header">
        <Heading as="h1" id="page-title">{title}</Heading>
        {intro ? <p className="mt-4 max-w-prose-site">{intro}</p> : null}
        <div className="mt-10 rounded-panel border border-stone bg-paper p-6 shadow-panel md:p-8 lg:p-10">
          {showReach ? (
            <div>
              <p className={kicker}>Call or message</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {contact.phone ? (
                  <Button href={telHref(contact.phone)} className="w-full sm:w-auto" data-track="call_click">
                    Call {contact.phoneDisplay}
                  </Button>
                ) : null}
                {contact.whatsapp ? (
                  <Button href={whatsappHref(contact.whatsapp, 'Contact')} variant="secondary" className="w-full sm:w-auto" data-track="whatsapp_click" target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
          <dl className={cn('grid gap-x-10 gap-y-6 sm:grid-cols-2', showReach && 'mt-8 border-t border-stone pt-6')}>
            {contact.email ? (
              <div>
                <dt className={kicker}>Email</dt>
                <dd className="mt-1">
                  <a href={mailtoHref(contact.email)} className="inline-flex min-h-11 items-start break-words pt-0.5 font-semibold text-green underline decoration-gold underline-offset-4 hover:decoration-green">
                    {contact.email}
                  </a>
                </dd>
              </div>
            ) : null}
            {openingHours ? (
              <div>
                <dt className={kicker}>Hours</dt>
                <dd className="mt-1">{openingHours}</dd>
              </div>
            ) : null}
            <div>
              <dt className={kicker}>Reply time</dt>
              <dd className="mt-1">{contact.responseTime}</dd>
            </div>
            {office ? (
              <div>
                <dt className={kicker}>Head office</dt>
                <dd className="mt-1 whitespace-pre-line">{office}</dd>
              </div>
            ) : null}
          </dl>
          {notice ? <p role="note" className="mt-8 border-l-2 border-gold pl-4 text-[16px] leading-relaxed">{notice}</p> : null}
        </div>
      </Section>
      {residences.length > 0 ? (
        <Section tone="sand" labelledBy="residence-addresses">
          <Heading as="h2" id="residence-addresses">Residences</Heading>
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {residences.map((residence) => (
              <li key={residence.name} className="flex h-full flex-col rounded-panel border border-stone bg-paper p-6">
                <h3>{residence.name}</h3>
                <StaticMap
                  address={residence.address}
                  mapsKey={mapsKey}
                  label={`Map of ${residence.name}`}
                  directionsLabel={`Directions to ${residence.name}`}
                  className="mt-4 flex-1"
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      <Section tone="paper" labelledBy="contact-enquiry">
        <EnquiryForm kind="general" context="Contact" headingId="contact-enquiry" layout="aside" eyebrow="Enquiry" />
      </Section>
    </main>
  );
}
