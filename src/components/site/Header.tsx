import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { MORE_NAV, PRIMARY_NAV } from '@/lib/navigation';
import { telHref, type SiteContact } from '@/lib/contact';
import { WhatsAppLink } from '@/components/site/WhatsAppLink';

export function Header({ contact, enquiryTrigger }: { contact: SiteContact; enquiryTrigger?: ReactNode }) {
  return (
    <header className="border-b border-stone bg-ivory">
      <Container className="flex min-h-[72px] items-center justify-between gap-6 py-3">
        <Link href="/" className="font-display text-[22px] font-semibold text-green no-underline">
          Village 60 Plus
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="py-2 font-semibold text-charcoal no-underline hover:text-green">
              {item.label}
            </Link>
          ))}
          <details className="group relative">
            <summary className="list-none py-2 font-semibold text-charcoal hover:text-green [&::-webkit-details-marker]:hidden">
              More
            </summary>
            <ul className="absolute right-0 top-full z-20 mt-2 min-w-56 rounded-card border border-stone bg-paper p-2 shadow-panel transition-opacity duration-(--duration-menu)">
              {MORE_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block rounded-input px-3 py-2.5 text-charcoal no-underline hover:bg-mist">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>

        <div className="flex items-center gap-3">
          <a href={telHref(contact.phone)} className="hidden items-center font-semibold text-green no-underline md:inline-flex" data-track="call_click">
            Call {contact.phoneDisplay}
          </a>
          <WhatsAppLink
            contact={contact}
            className="hidden items-center rounded-full border border-green px-4 py-2 font-semibold text-green no-underline hover:bg-mist md:inline-flex"
          >
            WhatsApp
          </WhatsAppLink>
          {enquiryTrigger}
          <details className="lg:hidden">
            <summary className="list-none rounded-input border border-stone px-3 py-2 font-semibold [&::-webkit-details-marker]:hidden">Menu</summary>
            <nav aria-label="Mobile" className="absolute inset-x-0 top-[72px] z-20 border-b border-stone bg-paper p-4">
              <ul className="flex flex-col gap-1">
                {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-input px-3 py-3 text-charcoal no-underline hover:bg-mist">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
