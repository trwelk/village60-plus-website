import { PageHero } from '@/components/content/PageHero';
import { SectionList, type ContentSectionData } from '@/components/content/SectionList';
import { CareServiceCard, type CareServiceCardData } from '@/components/content/CareServiceCard';
import { ContactActions } from '@/components/site/ContactActions';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';
import { CARE_SERVICE_SLUGS } from '@/lib/routes';

function lightSections(sections: Array<ContentSectionData | null> | null | undefined) {
  return (sections ?? []).map((section) =>
    section && (section.tone === 'night' || section.tone === 'green') ? { ...section, tone: 'ivory' } : section,
  );
}

export function LivingCareView({
  title,
  intro,
  services,
  sections,
  contact,
}: {
  title: string;
  intro?: string | null;
  services: CareServiceCardData[];
  sections: Array<ContentSectionData | null> | null;
  contact: SiteContact;
}) {
  const rank = (slug: string | null | undefined) => {
    const index = CARE_SERVICE_SLUGS.findIndex((item) => item === slug);
    return index === -1 ? CARE_SERVICE_SLUGS.length : index;
  };
  const ordered = [...services].sort((a, b) => rank(a.slug) - rank(b.slug));
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory">
        <ContactActions contact={contact} context="Living & Care" />
      </PageHero>
      <Section tone="paper">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ordered.map((service) => (
            <li key={service._id}><CareServiceCard service={service} /></li>
          ))}
        </ul>
      </Section>
      <SectionList sections={lightSections(sections)} />
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
