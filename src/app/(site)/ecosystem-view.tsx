import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { provisionLabel, type CapabilityItem } from '@/components/content/CapabilityList';
import { ContactActions } from '@/components/site/ContactActions';
import { FaqList, type FaqItem } from '@/components/content/FaqList';
import { PageHero } from '@/components/content/PageHero';
import { SectionList, type ContentSectionData } from '@/components/content/SectionList';
import { StepList, type StepItem } from '@/components/content/StepList';
import type { CmsImage } from '@/components/media/SanityImage';
import { Chip } from '@/components/ui/Chip';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { SiteContact } from '@/lib/contact';
import { cn } from '@/lib/cn';
import { isContentStatus, isFuture, isOperating } from '@/lib/content-status';
import type { OfferingSlug } from '@/lib/routes';
import type { OFFERING_QUERY_RESULT } from '@/sanity/types';

const TITLES: Record<OfferingSlug, string> = {
  'silver-roots': 'Silver Roots',
  'destination-retirement': 'Destination Retirement',
  sage: 'SAGE',
};

export type OfferingContent = {
  name: string;
  slug: OfferingSlug;
  status?: string | null;
  tagline?: string | null;
  distinction?: string | null;
  summary?: string | null;
  heroImage?: CmsImage | null;
  currentCapabilities?: Array<CapabilityItem | null> | null;
  plannedCapabilities?: Array<CapabilityItem | null> | null;
  howItWorks?: Array<StepItem | null> | null;
  benefitGroups?: Array<{ _key: string; audience?: string | null; points?: Array<string | null> | null } | null> | null;
  sections?: Array<ContentSectionData | null> | null;
  faqs?: Array<FaqItem | null> | null;
};

export function toOffering(doc: OFFERING_QUERY_RESULT | null): OfferingContent | null {
  if (!doc?.name || (doc.slug !== 'silver-roots' && doc.slug !== 'destination-retirement' && doc.slug !== 'sage')) return null;
  return doc as OfferingContent;
}

function labelPlanned(items: OfferingContent['plannedCapabilities']) {
  return (items ?? []).map((item) => (item && !isContentStatus(item.status) ? { ...item, status: 'planned' } : item));
}

function titledCapabilities(items: Array<CapabilityItem | null> | null | undefined) {
  return (items ?? []).filter((item): item is CapabilityItem & { title: string } => Boolean(item?.title));
}

function showProvisionLabel(item: CapabilityItem, suppressProvision: boolean) {
  const provision = provisionLabel(item.provision);
  const future = isContentStatus(item.status) && isFuture(item.status);
  if (suppressProvision || !provision || (provision === 'Included' && future)) return null;
  return provision;
}

/** A provision shared by every card is stated once, beside the heading. */
function sharedProvision(rows: Array<CapabilityItem & { title: string }>) {
  if (rows.length < 2) return null;
  const labels = rows.map((item) => provisionLabel(item.provision));
  if (labels.some((label) => !label)) return null;
  const [first] = labels;
  if (!labels.every((label) => label === first)) return null;
  const future = rows.every((item) => isContentStatus(item.status) && isFuture(item.status));
  if (first === 'Included' && future) return null;
  return first;
}

function CapabilityMeta({ item, suppressProvision }: { item: CapabilityItem & { title: string }; suppressProvision: boolean }) {
  const provision = showProvisionLabel(item, suppressProvision);
  const status = isContentStatus(item.status) ? item.status : null;
  if (!status && !provision) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {status ? <StatusBadge status={status} /> : null}
      {provision ? <Chip>{provision}</Chip> : null}
    </div>
  );
}

function CapabilityCards({
  items,
  surface,
  actions,
}: {
  items: Array<CapabilityItem | null> | null | undefined;
  surface: 'paper' | 'ivory';
  actions?: ReactNode;
}) {
  const rows = titledCapabilities(items);
  if (rows.length === 0) return null;
  const repeated = sharedProvision(rows);
  if (rows.length === 1) {
    const item = rows[0];
    const body = (
      <>
        <CapabilityMeta item={item} suppressProvision={false} />
        <h3 className="text-[22px] leading-snug md:text-[24px]">{item.title}</h3>
        {item.description ? <p className="mt-2 max-w-prose-site">{item.description}</p> : null}
      </>
    );
    if (actions) {
      return (
        <div className="mt-8 overflow-hidden rounded-panel border border-stone bg-paper lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,20rem)]">
          <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">{body}</div>
          <div className="flex flex-col items-stretch justify-center gap-3 border-t border-stone bg-ivory p-6 md:p-8 lg:border-t-0 lg:border-l lg:p-10">{actions}</div>
        </div>
      );
    }
    return (
      <div className="mt-8 border-y border-stone py-6 md:grid md:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] md:items-end md:gap-x-12 md:py-8">
        <div>
          <CapabilityMeta item={item} suppressProvision={false} />
          <h3 className="text-[22px] leading-snug md:text-[24px]">{item.title}</h3>
        </div>
        {item.description ? <p className="mt-3 max-w-prose-site md:mt-0">{item.description}</p> : null}
      </div>
    );
  }
  const columns = rows.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2';
  return (
    <ul className={cn('m-0 mt-8 grid list-none gap-4 p-0', columns)}>
      {rows.map((item) => (
        <li key={item._key} className={cn('flex h-full flex-col rounded-panel border border-stone p-6 md:p-8', surface === 'paper' ? 'bg-paper' : 'bg-ivory')}>
          <CapabilityMeta item={item} suppressProvision={Boolean(repeated)} />
          <h3 className="text-[22px] leading-snug md:text-[24px]">{item.title}</h3>
          {item.description ? <p className="mt-2">{item.description}</p> : null}
        </li>
      ))}
    </ul>
  );
}

function SilverFamilyActions({ contact, stacked = false }: { contact: SiteContact; stacked?: boolean }) {
  return (
    <div className={stacked ? 'flex w-full flex-col gap-3' : undefined}>
      {stacked ? <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-bronze">Call or message</p> : null}
      <ContactActions contact={contact} context="Silver Roots" className={stacked ? 'flex w-full flex-col gap-3' : undefined} />
    </div>
  );
}

type BenefitGroup = NonNullable<NonNullable<OfferingContent['benefitGroups']>[number]> & { audience: string };

function PointList({ points }: { points: Array<string | null> | null | undefined }) {
  const rows = (points ?? []).filter((point): point is string => Boolean(point));
  if (rows.length === 0) return null;
  return (
    <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
      {rows.map((point) => (
        <li key={point} className="flex gap-3 leading-snug">
          <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-gold" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function AudienceBay({ group, className }: { group: BenefitGroup; className?: string }) {
  return (
    <li className={cn('flex h-full flex-col px-6 py-7 md:px-8 md:py-8', className)}>
      <h3 className="text-[22px] leading-snug md:text-[26px]">{group.audience}</h3>
      <div className="mt-5">
        <PointList points={group.points} />
      </div>
    </li>
  );
}

function AudienceBand({ groups }: { groups: BenefitGroup[] }) {
  if (groups.length === 1) {
    const group = groups[0];
    return (
      <div className="overflow-hidden rounded-panel border border-stone bg-paper lg:grid lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]">
        <div className="flex flex-col justify-center border-b border-stone px-6 py-8 md:px-8 lg:border-r lg:border-b-0 lg:py-10">
          <span aria-hidden="true" className="mb-4 block h-0.5 w-8 bg-gold" />
          <Heading as="h2" id="offering-audience">{group.audience}</Heading>
        </div>
        <div className="flex items-center px-6 py-7 md:px-8 md:py-8">
          <PointList points={group.points} />
        </div>
      </div>
    );
  }

  if (groups.length === 2) {
    return (
      <div className="overflow-hidden rounded-panel border border-stone bg-paper lg:grid lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex flex-col justify-center border-b border-stone px-6 py-8 md:px-8 lg:border-r lg:border-b-0 lg:px-10 lg:py-10">
          <span aria-hidden="true" className="mb-4 block h-0.5 w-8 bg-gold" />
          <Heading as="h2" id="offering-audiences" titleClassName="lg:whitespace-nowrap">Who it helps</Heading>
        </div>
        <ul className="m-0 grid list-none p-0 md:grid-cols-2">
          {groups.map((group, index) => (
            <AudienceBay
              key={group._key}
              group={group}
              className={index === 0 ? 'border-b border-stone md:border-r md:border-b-0' : undefined}
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-panel border border-stone bg-paper">
      <div className="border-b border-stone px-6 py-8 md:px-8">
        <span aria-hidden="true" className="mb-4 block h-0.5 w-8 bg-gold" />
        <Heading as="h2" id="offering-audiences">Who it helps</Heading>
      </div>
      <ul className="m-0 grid list-none p-0 lg:grid-cols-3">
        {groups.map((group, index) => (
          <AudienceBay
            key={group._key}
            group={group}
            className={index < groups.length - 1 ? 'border-b border-stone lg:border-r lg:border-b-0' : undefined}
          />
        ))}
      </ul>
    </div>
  );
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

const goldPill =
  'inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 py-3 text-[13px] font-semibold tracking-[0.14em] text-night uppercase transition-colors duration-(--duration-fast) hover:bg-bronze hover:text-ivory';

function SageEnquire() {
  return (
    <EnquiryButton kind="general" context="SAGE" className={goldPill}>
      Enquire
      <Arrow />
    </EnquiryButton>
  );
}

function SagePlannedSection({ items, lead }: { items: Array<CapabilityItem & { title: string }>; lead?: string | null }) {
  const repeated = sharedProvision(items);
  return (
    <section id="planned" aria-labelledby="offering-planned" className="section-space scroll-mt-8 bg-ivory">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Heading as="h2" id="offering-planned" titleClassName="text-green" className="max-w-none">
              Planned
            </Heading>
            {lead ? <p className="mt-4 max-w-prose-site text-charcoal/85">{lead}</p> : null}
            {repeated ? (
              <div className="mt-4">
                <Chip>{repeated}</Chip>
              </div>
            ) : null}
            <ul className="mt-6 grid list-none gap-x-8 gap-y-4 p-0 sm:grid-cols-2">
              {items.map((item) => {
                const provision = showProvisionLabel(item, Boolean(repeated));
                const status = isContentStatus(item.status) ? item.status : null;
                return (
                  <li key={item._key} className="flex items-start gap-3 text-[16px] leading-snug text-charcoal/90">
                    <Check />
                    <span>
                      <span className="block text-charcoal">{item.title}</span>
                      {item.description ? <span className="mt-1 block text-charcoal/75">{item.description}</span> : null}
                      {status || provision ? (
                        <span className="mt-2 flex flex-wrap items-center gap-2">
                          {status ? <StatusBadge status={status} /> : null}
                          {provision ? <Chip>{provision}</Chip> : null}
                        </span>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8">
              <SageEnquire />
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-sand lg:aspect-[5/4]">
            <img src="/people/hands.jpg" alt="A nurse holding hands with a resident" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function SageAudienceSection({ groups }: { groups: BenefitGroup[] }) {
  const heading = groups.length === 1 ? groups[0].audience : 'Who it helps';
  const headingId = groups.length === 1 ? 'offering-audience' : 'offering-audiences';
  return (
    <section id="who-it-helps" aria-labelledby={headingId} className="relative scroll-mt-8 overflow-hidden bg-green text-ivory on-dark">
      <div className="absolute inset-0">
        <img src="/people/courtyard.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/75 via-night/55 to-night/35 lg:bg-gradient-to-r lg:from-night/10 lg:via-night/35 lg:to-night/75" />
      <Container className="relative flex min-h-[34rem] items-center py-16 lg:min-h-[40rem] lg:py-24">
        <div className="ml-auto w-full max-w-xl">
          <Heading as="h2" id={headingId} onDark titleClassName="text-ivory" className="max-w-none">
            {heading}
          </Heading>
          <ul className="mt-6 grid list-none gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
            {groups.map((group) => {
              const points = (group.points ?? []).filter((point): point is string => Boolean(point));
              return (
                <li key={group._key} className="flex items-start gap-3 text-[16px] leading-snug text-ivory">
                  <Check />
                  <span>
                    {groups.length > 1 ? <span className="block text-ivory">{group.audience}</span> : null}
                    {points.map((point) => (
                      <span key={point} className="mt-1 block text-ivory/90">
                        {point}
                      </span>
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-8">
            <SageEnquire />
          </div>
        </div>
      </Container>
    </section>
  );
}

function SectionHeading({ id, title, meta }: { id: string; title: string; meta?: string | null }) {
  return (
    <div>
      <Heading as="h2" id={id}>{title}</Heading>
      {meta ? <div className="mt-4"><Chip>{meta}</Chip></div> : null}
    </div>
  );
}

export function EcosystemView({
  slug,
  offering,
  contact,
}: {
  slug: OfferingSlug;
  offering: OfferingContent | null;
  contact: SiteContact;
}) {
  const title = offering?.name || TITLES[slug];
  const showStatus = offering?.status && isContentStatus(offering.status) && !isOperating(offering.status) ? offering.status : null;
  const lead = offering?.distinction || offering?.summary;
  const note = offering?.summary && offering.summary !== lead ? offering.summary : null;
  const current = titledCapabilities(offering?.currentCapabilities);
  const planned = titledCapabilities(labelPlanned(offering?.plannedCapabilities));
  const steps = (offering?.howItWorks ?? []).filter((step) => step?.title);
  const groups = (offering?.benefitGroups ?? []).filter((group): group is BenefitGroup => Boolean(group?.audience));
  const sections = (offering?.sections ?? []).map((section) =>
    section && (section.tone === 'night' || section.tone === 'green') ? { ...section, tone: 'ivory' } : section,
  );

  return (
    <main id="main">
      <PageHero layout="overlay" title={title} eyebrow={offering?.tagline} intro={lead} image={offering?.heroImage} status={showStatus} tone="night">
        {note ? <p className="w-full max-w-prose-site border-t border-ivory/30 pt-5">{note}</p> : null}
      </PageHero>
      {current.length > 0 ? (
        <Section tone="sand" labelledBy="offering-current">
          <SectionHeading id="offering-current" title="What exists today" meta={sharedProvision(current)} />
          <CapabilityCards
            items={current}
            surface="paper"
            actions={slug === 'silver-roots' && current.length === 1 ? <SilverFamilyActions contact={contact} stacked /> : undefined}
          />
        </Section>
      ) : null}
      {planned.length > 0 ? (
        slug === 'sage' ? (
          <SagePlannedSection items={planned} lead={note} />
        ) : (
          <Section tone="paper" labelledBy="offering-planned">
            <SectionHeading id="offering-planned" title="Planned" meta={sharedProvision(planned)} />
            <CapabilityCards items={planned} surface="ivory" />
          </Section>
        )
      ) : null}
      {steps.length > 0 ? (
        <Section tone="sand" labelledBy="offering-steps">
          <Heading as="h2" id="offering-steps">How it works</Heading>
          <StepList items={offering?.howItWorks} />
        </Section>
      ) : null}
      {groups.length > 0 ? (
        slug === 'sage' ? (
          <SageAudienceSection groups={groups} />
        ) : (
          <Section tone="mist" labelledBy={groups.length === 1 ? 'offering-audience' : 'offering-audiences'}>
            <AudienceBand groups={groups} />
          </Section>
        )
      ) : null}
      <SectionList sections={sections} layout="split" />
      {(offering?.faqs ?? []).some((item) => item?.question) ? (
        <Section tone="ivory" labelledBy="offering-questions">
          <div className="overflow-hidden rounded-panel border border-stone bg-paper lg:grid lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]">
            <div className="flex flex-col justify-center border-b border-stone px-6 py-8 md:px-8 lg:justify-start lg:border-r lg:border-b-0 lg:px-10 lg:py-8">
              <span aria-hidden="true" className="mb-4 block h-0.5 w-8 bg-gold" />
              <Heading as="h2" id="offering-questions">Questions</Heading>
            </div>
            <div className="px-6 md:px-8 lg:px-10 lg:py-8">
              <div className="min-w-0 flex-1">
                <FaqList items={offering?.faqs} showHeading={false} width="full" embedded />
              </div>
            </div>
          </div>
        </Section>
      ) : null}
      {slug === 'destination-retirement' ? (
        <Section tone="paper" labelledBy="destination-enquiry">
          <EnquiryForm kind="destination-retirement" context="Destination Retirement" headingId="destination-enquiry" layout="aside" eyebrow="Enquiry" />
        </Section>
      ) : slug === 'silver-roots' ? (
        <Section tone="paper" labelledBy="partner-enquiry">
          {current.length !== 1 ? (
            <div className="mb-12 border-b border-stone pb-12">
              <SilverFamilyActions contact={contact} />
            </div>
          ) : null}
          <EnquiryForm
            kind="silver-roots-partner"
            context="Silver Roots"
            headingId="partner-enquiry"
            layout="aside"
            eyebrow="Partners"
            asideExtra={
              <div className="border-t border-stone pt-6">
                <p>Looking for care for a family member?</p>
                <div className="mt-3">
                  <EnquiryButton kind="general" context="Silver Roots" tone="text">
                    Send a general enquiry
                  </EnquiryButton>
                </div>
              </div>
            }
          />
        </Section>
      ) : slug === 'sage' && planned.length === 0 && groups.length === 0 ? (
        <Section tone="paper">
          <EnquiryButton kind="general" context="SAGE">Enquire</EnquiryButton>
        </Section>
      ) : null}
    </main>
  );
}
