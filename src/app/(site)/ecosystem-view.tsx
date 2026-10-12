import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { CapabilityList, type CapabilityItem } from '@/components/content/CapabilityList';
import { FaqList, type FaqItem } from '@/components/content/FaqList';
import { PageHero } from '@/components/content/PageHero';
import { SectionList, type ContentSectionData } from '@/components/content/SectionList';
import { StepList, type StepItem } from '@/components/content/StepList';
import type { CmsImage } from '@/components/media/SanityImage';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isOperating } from '@/lib/content-status';
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

export function EcosystemView({
  slug,
  offering,
}: {
  slug: OfferingSlug;
  offering: OfferingContent | null;
  contact: SiteContact;
}) {
  const tone = slug === 'sage' ? 'night' : 'ivory';
  const title = offering?.name || TITLES[slug];
  const showStatus = offering?.status && isContentStatus(offering.status) && !isOperating(offering.status) ? offering.status : null;
  const steps = (offering?.howItWorks ?? []).filter((step) => step?.title);
  const groups = (offering?.benefitGroups ?? []).filter((group): group is NonNullable<typeof group> & { audience: string } => Boolean(group?.audience));
  const sections = (offering?.sections ?? []).map((section) =>
    section && (section.tone === 'night' || section.tone === 'green') ? { ...section, tone: 'ivory' } : section,
  );

  return (
    <main id="main">
      <PageHero title={title} eyebrow={offering?.tagline} intro={offering?.distinction || offering?.summary} image={offering?.heroImage} status={showStatus} tone={tone} />
      {offering?.summary ? (
        <Section tone="paper">
          <p className="max-w-prose-site">{offering.summary}</p>
        </Section>
      ) : null}
      <Section tone="ivory" labelledBy="offering-current">
        <Heading as="h2" id="offering-current">What exists today</Heading>
        <div className="mt-4"><CapabilityList items={offering?.currentCapabilities} /></div>
      </Section>
      <Section tone="sand" labelledBy="offering-planned">
        <Heading as="h2" id="offering-planned">Planned</Heading>
        <div className="mt-4"><CapabilityList items={labelPlanned(offering?.plannedCapabilities)} /></div>
      </Section>
      {steps.length > 0 ? (
        <Section tone="paper" labelledBy="offering-steps">
          <Heading as="h2" id="offering-steps">How it works</Heading>
          <div className="mt-4"><StepList items={offering?.howItWorks} /></div>
        </Section>
      ) : null}
      {groups.map((group) => (
        <Section key={group._key} tone="mist">
          <Heading as="h2">{group.audience}</Heading>
          <ul className="mt-4 list-disc pl-6">
            {(group.points ?? []).filter(Boolean).map((point) => <li key={point}>{point}</li>)}
          </ul>
        </Section>
      ))}
      <SectionList sections={sections} />
      <Section tone="paper">
        <FaqList items={offering?.faqs} />
      </Section>
      <Section tone="sand">
        {slug === 'silver-roots' ? (
          <div className="flex max-w-prose-site flex-col gap-10">
            <EnquiryForm kind="silver-roots-partner" context="Silver Roots" />
            <EnquiryButton kind="general" context="Silver Roots">Send a general enquiry</EnquiryButton>
          </div>
        ) : null}
        {slug === 'destination-retirement' ? (
          <div className="max-w-prose-site">
            <EnquiryForm kind="destination-retirement" context="Destination Retirement" />
          </div>
        ) : null}
        {slug === 'sage' ? <EnquiryButton kind="general" context="SAGE">Enquire</EnquiryButton> : null}
      </Section>
    </main>
  );
}
