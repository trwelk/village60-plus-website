import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PageHero } from '@/components/content/PageHero';
import { ContactActions } from '@/components/site/ContactActions';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';

export function pathwayDefaults(value: string | undefined): Record<string, string> {
  if (value === 'parent') return { whoFor: 'parent' };
  if (value === 'myself') return { whoFor: 'myself' };
  if (value === 'after-hospital') return { helpType: 'recovery' };
  return {};
}

export function FindCareView({
  title,
  intro,
  contact,
  defaults,
}: {
  title: string;
  intro?: string | null;
  contact: SiteContact;
  defaults: Record<string, string>;
}) {
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory" />
      <Section tone="paper">
        <p className="max-w-prose-site">This form is not a medical assessment.</p>
        <div className="mt-8 max-w-prose-site">
          <EnquiryForm kind="find-care" context="Find the Right Care" defaults={defaults} />
        </div>
        <div className="mt-8">
          <ContactActions contact={contact} context="Find the Right Care" />
        </div>
      </Section>
    </main>
  );
}
