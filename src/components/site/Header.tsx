'use client';

import Link from 'next/link';
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { MORE_NAV, PRIMARY_NAV } from '@/lib/navigation';
import { telHref, type SiteContact } from '@/lib/contact';
import { WhatsAppLink } from '@/components/site/WhatsAppLink';

function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest('details')?.removeAttribute('open');
}

export function Header({ contact, enquiryTrigger }: { contact: SiteContact; enquiryTrigger?: ReactNode }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const overlay = pathname === '/' || pathname === '/oracle' || pathname === '/sage';

  useEffect(() => {
    headerRef.current?.querySelectorAll('details[open]').forEach((menu) => menu.removeAttribute('open'));
  }, [pathname]);

  const navLink = overlay
    ? 'whitespace-nowrap py-2 text-[16px] font-semibold leading-none text-ivory no-underline hover:text-pale-gold'
    : 'whitespace-nowrap py-2 text-[16px] font-semibold leading-none text-charcoal no-underline hover:text-green';
  const enquiry = overlay ? (
    <EnquiryButton kind="general" context="Village 60 Plus" tone="overlay">
      Enquire
    </EnquiryButton>
  ) : (
    enquiryTrigger
  );

  return (
    <header ref={headerRef} className={`absolute inset-x-0 top-0 z-40${overlay ? ' on-dark' : ''}`}>
      <div className="mx-auto flex w-full max-w-[1520px] min-h-[72px] items-center gap-x-4 gutter py-4 lg:gap-x-6">
        <Link
          href="/"
          className={
            overlay
              ? 'shrink-0 whitespace-nowrap font-display text-[22px] font-semibold leading-none text-ivory no-underline'
              : 'shrink-0 whitespace-nowrap font-display text-[22px] font-semibold leading-none text-green no-underline'
          }
        >
          Village 60 Plus
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-x-4 lg:flex xl:gap-x-6">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={navLink}>
              {item.label}
            </Link>
          ))}
          <details className="relative">
            <summary className={`list-none cursor-pointer ${navLink} [&::-webkit-details-marker]:hidden`}>More</summary>
            <ul className="absolute right-0 top-full z-20 mt-2 min-w-56 rounded-card border border-stone bg-paper p-2 shadow-panel transition-opacity duration-(--duration-menu)">
              {MORE_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={closeMenu} className="block whitespace-nowrap rounded-input px-3 py-2.5 text-charcoal no-underline hover:bg-mist">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-2.5 xl:gap-3">
          {contact.phone ? (
            <a
              href={telHref(contact.phone)}
              className={
                overlay
                  ? 'hidden whitespace-nowrap text-[16px] font-semibold leading-none text-ivory no-underline md:inline-flex'
                  : 'hidden whitespace-nowrap text-[16px] font-semibold leading-none text-green no-underline md:inline-flex'
              }
              data-track="call_click"
            >
              Call {contact.phoneDisplay}
            </a>
          ) : null}
          {contact.whatsapp ? (
            <WhatsAppLink
              contact={contact}
              className={
                overlay
                  ? 'hidden items-center whitespace-nowrap rounded-full border border-ivory px-4 py-2 text-[16px] font-semibold leading-none text-ivory no-underline hover:bg-white/10 md:inline-flex'
                  : 'hidden items-center whitespace-nowrap rounded-full border border-green px-4 py-2 text-[16px] font-semibold leading-none text-green no-underline hover:bg-mist md:inline-flex'
              }
            >
              WhatsApp
            </WhatsAppLink>
          ) : null}
          {enquiry}
          <details className="lg:hidden">
            <summary
              className={
                overlay
                  ? 'list-none cursor-pointer whitespace-nowrap rounded-input border border-ivory/70 px-3 py-2 font-semibold text-ivory [&::-webkit-details-marker]:hidden'
                  : 'list-none cursor-pointer whitespace-nowrap rounded-input border border-stone px-3 py-2 font-semibold [&::-webkit-details-marker]:hidden'
              }
            >
              Menu
            </summary>
            <nav aria-label="Mobile" className="absolute inset-x-0 top-full z-20 border-b border-stone bg-paper p-4">
              <ul className="flex flex-col gap-1">
                {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={closeMenu} className="block whitespace-nowrap rounded-input px-3 py-3 text-charcoal no-underline hover:bg-mist">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
