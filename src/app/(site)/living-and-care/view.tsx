import { PageHero } from '@/components/content/PageHero';
import { SectionList, type ContentSectionData } from '@/components/content/SectionList';
import type { CmsImage } from '@/components/media/SanityImage';
import { CareServiceCard, type CareServiceCardData } from '@/components/content/CareServiceCard';
import { ContactActions } from '@/components/site/ContactActions';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';
import { CARE_SERVICE_SLUGS, type CareServiceSlug } from '@/lib/routes';

const HOME_CARE_SLUGS: CareServiceSlug[] = ['residential-care', 'independent-living'];
const STAY_CARE_SLUGS: CareServiceSlug[] = ['respite-care', 'recovery', 'rehabilitation'];

function lightSections(sections: Array<ContentSectionData | null> | null | undefined) {
  return (sections ?? []).map((section) =>
    section && (section.tone === 'night' || section.tone === 'green') ? { ...section, tone: 'ivory' } : section,
  );
}

export function LivingCareView({
  title,
  intro,
  image,
  services,
  sections,
  contact,
}: {
  title: string;
  intro?: string | null;
  image?: CmsImage | null;
  services: CareServiceCardData[];
  sections: Array<ContentSectionData | null> | null;
  contact: SiteContact;
}) {
  const bySlug = (order: readonly CareServiceSlug[]) =>
    order
      .map((slug) => services.find((service) => service.slug === slug))
      .filter((service): service is CareServiceCardData => Boolean(service?.name && service?.slug));
  const homeCare = bySlug(HOME_CARE_SLUGS);
  const stayCare = bySlug(STAY_CARE_SLUGS);
  const extra = services.filter(
    (service) =>
      service.slug &&
      !HOME_CARE_SLUGS.includes(service.slug as CareServiceSlug) &&
      !STAY_CARE_SLUGS.includes(service.slug as CareServiceSlug),
  );
  const rank = (slug: string | null | undefined) => {
    const index = CARE_SERVICE_SLUGS.findIndex((item) => item === slug);
    return index === -1 ? CARE_SERVICE_SLUGS.length : index;
  };
  const orderedExtra = [...extra].sort((a, b) => rank(a.slug) - rank(b.slug));
  return (
    <main id="main">
      <PageHero layout="overlay" title={title} intro={intro} image={image} tone="night">
        <ContactActions contact={contact} context="Living & Care" onDark />
      </PageHero>
      {homeCare.length ? (
        <Section tone="sand" labelledBy="care-at-home">
          <Heading as="h2" id="care-at-home">A home</Heading>
          <p className="mt-3 max-w-prose-site text-charcoal/85">A longer stay — a room that becomes yours, with support nearby when you need it.</p>
          <ul className="mt-8 grid gap-8 md:grid-cols-2">
            {homeCare.map((service) => (
              <li key={service._id}><CareServiceCard service={service} /></li>
            ))}
          </ul>
        </Section>
      ) : null}
      <Section tone="green" labelledBy="care-decision">
        <Heading as="h2" id="care-decision" eyebrow="Before you choose" onDark>
          You do not need to know which type before you call
        </Heading>
        <p className="mt-4 max-w-prose-site text-ivory/90">
          Describe the situation. The team will explain the options in plain language. This website is not a medical assessment.
        </p>
      </Section>
      {stayCare.length ? (
        <Section tone="paper" labelledBy="care-for-a-while">
          <Heading as="h2" id="care-for-a-while">A while</Heading>
          <p className="mt-3 max-w-prose-site text-charcoal/85">A stay with an end date — the length and goal are what set these apart.</p>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stayCare.map((service) => (
              <li key={service._id}><CareServiceCard service={service} /></li>
            ))}
          </ul>
        </Section>
      ) : null}
      {orderedExtra.length ? (
        <Section tone="sand">
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {orderedExtra.map((service) => (
              <li key={service._id}><CareServiceCard service={service} /></li>
            ))}
          </ul>
        </Section>
      ) : null}
      <SectionList sections={lightSections(sections)} layout="split" />
      <Section tone="sand" labelledBy="not-the-right-fit">
        <Heading as="h2" id="not-the-right-fit">When Village 60 Plus is not the right fit</Heading>
        <p className="mt-4 max-w-prose-site">The team will say so. These pages are other places to start a conversation.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/silver-roots" variant="secondary">Silver Roots</Button>
          <Button href="/find-the-right-care">Find the Right Care</Button>
        </div>
      </Section>
    </main>
  );
}
