import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { LEGAL_NAV, MORE_NAV, PRIMARY_NAV } from '@/lib/navigation';
import { displayPhone, mailtoHref, telHref, type SiteContact } from '@/lib/contact';
import { SiteLogo } from '@/components/site/SiteLogo';
import { WhatsAppLink } from '@/components/site/WhatsAppLink';

export function Footer({
  contact,
  legalName,
  address,
  foundedYear,
  openingHours,
}: {
  contact: SiteContact;
  legalName: string;
  address: string;
  foundedYear?: number | null;
  openingHours?: string | null;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-green pb-24 text-ivory md:pb-0">
      <Container className="grid gap-10 py-16 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-sm bg-paper p-1.5">
            <SiteLogo className="h-11 max-w-[15rem]" decorative />
          </div>
          <p className="mt-2 text-ivory/80">Live well. Age exceptionally.</p>
          {foundedYear ? <p className="mt-4 text-[14px] text-pale-gold">Established {foundedYear} · Sri Lanka</p> : null}
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2">
            {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ivory/90 no-underline hover:text-pale-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <address className="not-italic">
          <p className="whitespace-pre-line">{address}</p>
          {contact.whatsapp ? (
            <p className="mt-3">
              <WhatsAppLink contact={contact} className="text-ivory no-underline hover:text-pale-gold">
                WhatsApp {displayPhone(contact.whatsapp)}
              </WhatsAppLink>
            </p>
          ) : null}
          {contact.phone ? (
            <p className={contact.whatsapp ? undefined : 'mt-3'}>
              <a href={telHref(contact.phone)} className="text-ivory no-underline hover:text-pale-gold" data-track="call_click">
                {contact.phoneDisplay}
              </a>
            </p>
          ) : null}
          {contact.email ? (
            <p>
              <a href={mailtoHref(contact.email)} className="text-ivory no-underline hover:text-pale-gold">
                {contact.email}
              </a>
            </p>
          ) : null}
          {openingHours ? <p className="mt-3 text-ivory/80">{openingHours}</p> : null}
          <p className="mt-1 text-ivory/80">We aim to respond {contact.responseTime}.</p>
        </address>
      </Container>
      <div className="border-t border-ivory/15">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-5 text-[14px] text-ivory/80">
          <p>
            © {year} {legalName}
          </p>
          <ul className="flex gap-5">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ivory/80 no-underline hover:text-pale-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
