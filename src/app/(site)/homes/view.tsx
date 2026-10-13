import { HomeFilter } from './home-filter';
import { PageHero } from '@/components/content/PageHero';
import type { ResidenceCardData } from '@/components/content/ResidenceCard';
import { ContactActions } from '@/components/site/ContactActions';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';

export function HomesView({
  title,
  intro,
  residences,
  contact,
}: {
  title: string;
  intro?: string | null;
  residences: ResidenceCardData[];
  contact: SiteContact;
}) {
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory">
        <ContactActions contact={contact} context="Our homes" />
      </PageHero>
      <Section tone="sand">
        <HomeFilter residences={residences} />
      </Section>
      <Section tone="sand" labelledBy="which-home">
        <Heading as="h2" id="which-home">Which home may suit you?</Heading>
        <p className="mt-4 max-w-prose-site">If you are not sure, tell us a little about the person and the situation. This is not an assessment.</p>
        <div className="mt-6">
          <Button href="/find-the-right-care">Find the Right Care</Button>
        </div>
      </Section>
    </main>
  );
}
