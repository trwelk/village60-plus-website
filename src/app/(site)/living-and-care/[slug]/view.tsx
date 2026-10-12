import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { CapabilityList, type CapabilityItem } from '@/components/content/CapabilityList';
import { FaqList, type FaqItem } from '@/components/content/FaqList';
import { PageHero } from '@/components/content/PageHero';
import { StepList, type StepItem } from '@/components/content/StepList';
import { ContactActions } from '@/components/site/ContactActions';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture } from '@/lib/content-status';
import { asFormKind } from '@/lib/forms/kinds';
import { residencePath } from '@/lib/routes';

export type CareDetail = {
  name: string;
  slug: string;
  status?: string | null;
  summary?: string | null;
  whoItSuits?: Array<string | null> | null;
  typicalDuration?: string | null;
  included?: Array<CapabilityItem | null> | null;
  process?: Array<StepItem | null> | null;
  notRightFit?: string | null;
  faqs?: Array<FaqItem | null> | null;
  formKind?: string | null;
  residences?: Array<{ _id: string; name?: string | null; slug?: string | null; status?: string | null; shortLocation?: string | null } | null> | null;
};

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-care-section={name}>{children}</div>;
}

export function CareDetailView({ service, contact }: { service: CareDetail | null; contact: SiteContact }) {
  if (!service) {
    return (
      <main id="main">
        <PageHero title="This service" intro="Details will appear here once they are published." tone="ivory" />
      </main>
    );
  }

  const homes = (service.residences ?? []).filter((item): item is NonNullable<typeof item> & { name: string; slug: string } => Boolean(item?.name && item.slug));

  return (
    <main id="main">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Living & Care', href: '/living-and-care' }, { label: service.name }]} />
      <Region name="hero">
        <PageHero title={service.name} intro={service.summary} status={service.status} tone="ivory" />
      </Region>
      <Region name="suits">
        <Section tone="sand" labelledBy="who-it-suits">
          <Heading as="h2" id="who-it-suits">Who it suits</Heading>
          <ul className="mt-4 list-disc pl-6">
            {(service.whoItSuits ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Section>
      </Region>
      <Region name="duration">
        <Section tone="ivory" labelledBy="duration">
          <Heading as="h2" id="duration">Typical duration</Heading>
          {service.typicalDuration ? <p className="mt-4">{service.typicalDuration}</p> : <p className="mt-4">The team will talk through timing with you.</p>}
        </Section>
      </Region>
      <Region name="included">
        <Section tone="paper" labelledBy="included">
          <Heading as="h2" id="included">What is included</Heading>
          <div className="mt-4"><CapabilityList items={service.included} /></div>
        </Section>
      </Region>
      <Region name="residences">
        <Section tone="mist" labelledBy="residences">
          <Heading as="h2" id="residences">Residences that offer this</Heading>
          <ul className="mt-4 flex flex-col gap-3">
            {homes.map((home) => (
              <li key={home._id} className="flex flex-wrap items-center gap-3">
                <Button href={residencePath(home.slug)} variant="text">{home.name}</Button>
                {home.shortLocation ? <span>{home.shortLocation}</span> : null}
                {isContentStatus(home.status) && isFuture(home.status) ? <StatusBadge status={home.status} /> : null}
              </li>
            ))}
          </ul>
        </Section>
      </Region>
      <Region name="process">
        <Section tone="ivory" labelledBy="process">
          <Heading as="h2" id="process">Enquiry and assessment</Heading>
          <div className="mt-4"><StepList items={service.process} /></div>
        </Section>
      </Region>
      <Region name="fit">
        <Section tone="sand" labelledBy="fit">
          <Heading as="h2" id="fit">If this is not the right fit</Heading>
          {service.notRightFit ? <p className="mt-4 max-w-prose-site">{service.notRightFit}</p> : null}
        </Section>
      </Region>
      <Region name="faqs">
        <Section tone="paper">
          <FaqList items={service.faqs} />
        </Section>
      </Region>
      <Region name="enquiry">
        <Section tone="ivory">
          <EnquiryButton kind={asFormKind(service.formKind)} context={service.name}>Enquire</EnquiryButton>
          <div className="mt-4">
            <ContactActions contact={contact} context={service.name} />
          </div>
        </Section>
      </Region>
    </main>
  );
}
