import { SkipLink } from '@/components/site/SkipLink';
import { Header } from '@/components/site/Header';
import { MobileActionBar } from '@/components/site/MobileActionBar';
import { Footer } from '@/components/site/Footer';
import { EnquiryButton, EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { getSiteChrome } from '@/lib/site-chrome';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const chrome = await getSiteChrome();
  return (
    <EnquiryProvider contact={chrome.contact}>
      <SkipLink />
      <Header contact={chrome.contact} enquiryTrigger={<EnquiryButton kind="general" context="Village 60 Plus">Enquire</EnquiryButton>} />
      <div className="pb-20 md:pb-0">{children}</div>
      <Footer
        contact={chrome.contact}
        legalName={chrome.legalName}
        address={chrome.address}
        foundedYear={chrome.foundedYear}
        openingHours={chrome.openingHours}
      />
      <MobileActionBar contact={chrome.contact} context="Village 60 Plus" />
    </EnquiryProvider>
  );
}
