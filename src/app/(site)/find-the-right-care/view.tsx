import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PageHero } from '@/components/content/PageHero';
import type { CmsImage } from '@/components/media/SanityImage';
import { ContactActions } from '@/components/site/ContactActions';
import type { SiteContact } from '@/lib/contact';
import { CareConversation } from './conversation-path';

export function pathwayDefaults(value: string | undefined): Record<string, string> {
  if (value === 'parent') return { whoFor: 'parent' };
  if (value === 'myself') return { whoFor: 'myself' };
  if (value === 'after-hospital') return { helpType: 'recovery' };
  return {};
}

export function FindCareView({
  title,
  intro,
  image,
  contact,
  defaults,
}: {
  title: string;
  intro?: string | null;
  image?: CmsImage | null;
  contact: SiteContact;
  defaults: Record<string, string>;
}) {
  return (
    <main id="main">
      <PageHero layout="overlay" title={title} intro={intro} image={image} tone="night" />
      <CareConversation defaults={defaults}>
        <div id="care-enquiry" className="scroll-mt-8 rounded-panel border border-stone bg-paper p-6 shadow-panel md:p-8">
          <p className="border-t-2 border-gold pt-4">This form is not a medical assessment.</p>
          <div className="mt-6">
            <EnquiryForm kind="find-care" context="Find the Right Care" defaults={defaults} headingId="care-enquiry-title" />
          </div>
          <div className="mt-8 border-t border-stone pt-6">
            <p className="mb-3 text-[15px] text-bronze">Prefer to talk now</p>
            <ContactActions contact={contact} context="Find the Right Care" />
          </div>
        </div>
      </CareConversation>
    </main>
  );
}
