import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PageHero } from '@/components/content/PageHero';
import { StaticMap } from '@/components/media/StaticMap';
import type { CmsImage } from '@/components/media/SanityImage';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/cn';
import { mailtoHref, telHref, whatsappHref, type SiteContact } from '@/lib/contact';
import { type MapAddress } from '@/lib/maps';
import { residencePath } from '@/lib/routes';
import { formatAddress, type SiteAddress } from '@/lib/site-settings';

const kicker = 'text-[14px] font-semibold uppercase tracking-[0.08em] text-bronze';

export function ContactView({
  title,
  intro,
  image,
  contact,
  openingHours,
  emergencyNotice,
  headOffice,
  residences,
  mapsKey,
}: {
  title: string;
  intro?: string | null;
  image?: CmsImage | null;
  contact: SiteContact;
  openingHours?: string | null;
  emergencyNotice?: string | null;
  headOffice?: MapAddress | null;
  residences: Array<{ name: string; slug?: string | null; address: MapAddress | null }>;
  mapsKey: string | null;
}) {
  const office = formatAddress(headOffice as SiteAddress | null | undefined);
  const notice = emergencyNotice?.trim();
  const showReach = Boolean(contact.phone || contact.whatsapp || contact.email);

  return (
    <main id="main">
      <PageHero layout="overlay" title={title} intro={intro} image={image} tone="night" />
      <Section tone="ivory" className="band-from-hero">
        <div className="rounded-panel border border-stone bg-paper p-6 shadow-panel md:p-8 lg:p-10">
          <div className={cn(showReach && 'grid items-stretch gap-8 lg:grid-cols-[minmax(18rem,24rem)_minmax(0,1fr)] lg:gap-x-0')}>
            {showReach ? (
              <div className="flex flex-col lg:border-r lg:border-stone lg:pr-12">
                <p className={kicker}>Call or message</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
                {notice ? <p role="note" className="mt-6 border-l-2 border-gold pl-4 text-[16px] leading-relaxed">{notice}</p> : null}
              </div>
            ) : null}
            <dl className={cn('grid content-center gap-x-10 gap-y-7 sm:grid-cols-2', showReach && 'border-t border-stone pt-8 lg:border-t-0 lg:pt-0 lg:pl-12')}>
              {contact.email ? (
                <div>
                  <dt className={kicker}>Email</dt>
                  <dd className="mt-2">
                    <a href={mailtoHref(contact.email)} className="inline-flex min-h-11 items-start break-words pt-0.5 font-semibold text-green underline decoration-gold underline-offset-4 hover:decoration-green">
                      {contact.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {openingHours ? (
                <div>
                  <dt className={kicker}>Hours</dt>
                  <dd className="mt-2 text-[18px] leading-snug">{openingHours}</dd>
                </div>
              ) : null}
              <div>
                <dt className={kicker}>Reply time</dt>
                <dd className="mt-2 text-[18px] leading-snug">{contact.responseTime}</dd>
              </div>
              {office ? (
                <div>
                  <dt className={kicker}>Head office</dt>
                  <dd className="mt-2 whitespace-pre-line text-[18px] leading-snug">{office}</dd>
                </div>
              ) : null}
            </dl>
          </div>
          {!showReach && notice ? <p role="note" className="mt-8 max-w-prose-site border-l-2 border-gold pl-4 text-[16px] leading-relaxed">{notice}</p> : null}
        </div>
      </Section>
      {residences.length > 0 ? (
        <Section tone="sand" labelledBy="residence-addresses">
          <Heading as="h2" id="residence-addresses" eyebrow="Visit">
            Residences
          </Heading>
          <p className="mt-4 max-w-prose-site text-[18px] leading-relaxed">Each home has its own address. Call or send a WhatsApp message to arrange a time.</p>
          <ul className="m-0 mt-10 flex list-none flex-col gap-5 p-0">
            {residences.map((residence) => (
              <li key={residence.name} className="flex h-full flex-col overflow-hidden rounded-panel border border-stone bg-paper">
                <StaticMap
                  layout="place"
                  title={residence.name}
                  titleHref={residence.slug ? residencePath(residence.slug) : undefined}
                  address={residence.address}
                  mapsKey={mapsKey}
                  label={residence.name}
                  directionsLabel={`Directions to ${residence.name}`}
                  className="flex-1"
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
