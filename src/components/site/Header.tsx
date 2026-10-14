'use client';

import Link from 'next/link';
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { MORE_NAV, PRIMARY_NAV, overlayHeader } from '@/lib/navigation';
import { telHref, type SiteContact } from '@/lib/contact';
import { cn } from '@/lib/cn';
import { WhatsAppLink } from '@/components/site/WhatsAppLink';

function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest('details')?.removeAttribute('open');
}

function navActive(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

export function Header({ contact, enquiryTrigger }: { contact: SiteContact; enquiryTrigger?: ReactNode }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const overlay = overlayHeader(pathname);

  useEffect(() => {
    headerRef.current?.querySelectorAll('details[open]').forEach((menu) => menu.removeAttribute('open'));
  }, [pathname]);

  const navLinkBase =
    'inline-flex items-center whitespace-nowrap rounded-input px-2 py-2 text-[15px] font-semibold leading-snug no-underline transition-colors duration-(--duration-fast) xl:text-[16px]';
  const navLink = overlay
    ? `${navLinkBase} text-ivory hover:text-pale-gold`
    : `${navLinkBase} text-charcoal hover:text-green`;
  const navLinkActive = overlay ? 'text-pale-gold' : 'text-green';
  const enquiry = overlay ? (
    <EnquiryButton kind="general" context="Village 60 Plus" tone="overlay">
      Enquire
    </EnquiryButton>
  ) : (
    enquiryTrigger
  );

  return (
    <header ref={headerRef} className={cn('absolute inset-x-0 top-0 z-40', overlay && 'on-dark')}>
      {overlay ? (
        <div
          className="pointer-events-none absolute inset-0 border-b border-white/10 bg-gradient-to-b from-night/92 via-night/60 to-transparent supports-[backdrop-filter]:backdrop-blur-[6px]"
          aria-hidden
        />
      ) : null}
      <div className="relative mx-auto grid w-full max-w-[1520px] min-h-[76px] grid-cols-[1fr_auto] items-center gap-x-4 gutter py-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-8 lg:py-4">
        <Link
          href="/"
          className={
            overlay
              ? 'col-start-1 shrink-0 whitespace-nowrap font-display text-[22px] font-semibold leading-none tracking-tight text-ivory no-underline lg:text-[24px]'
              : 'col-start-1 shrink-0 whitespace-nowrap font-display text-[22px] font-semibold leading-none tracking-tight text-green no-underline lg:text-[24px]'
          }
        >
          Village 60 Plus
        </Link>

        <nav
          aria-label="Primary"
          className="col-span-2 col-start-1 hidden items-center justify-center gap-x-2 lg:col-span-1 lg:col-start-2 lg:flex lg:gap-x-3 xl:gap-x-4"
        >
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(navLink, navActive(pathname, item.href) && navLinkActive)}
              aria-current={navActive(pathname, item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <details className="relative">
            <summary className={cn('list-none cursor-pointer [&::-webkit-details-marker]:hidden', navLink)}>More</summary>
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

        <div className="col-start-2 flex shrink-0 items-center justify-end gap-2 lg:col-start-3 lg:gap-2.5 xl:gap-3">
          {contact.phone ? (
            <a
              href={telHref(contact.phone)}
              className={
                overlay
                  ? 'hidden min-h-11 items-center whitespace-nowrap text-[15px] font-semibold leading-none text-ivory/95 no-underline transition-colors duration-(--duration-fast) hover:text-pale-gold md:inline-flex xl:text-[16px]'
                  : 'hidden min-h-11 items-center whitespace-nowrap text-[15px] font-semibold leading-none text-green no-underline transition-colors duration-(--duration-fast) hover:text-night md:inline-flex xl:text-[16px]'
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
                  ? 'hidden min-h-11 items-center whitespace-nowrap rounded-full border border-ivory/80 px-4 py-2 text-[15px] font-semibold leading-none text-ivory no-underline transition-colors duration-(--duration-fast) hover:border-ivory hover:bg-white/10 md:inline-flex xl:text-[16px]'
                  : 'hidden min-h-11 items-center whitespace-nowrap rounded-full border border-green px-4 py-2 text-[15px] font-semibold leading-none text-green no-underline transition-colors duration-(--duration-fast) hover:bg-mist md:inline-flex xl:text-[16px]'
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
                  ? 'inline-flex min-h-11 list-none cursor-pointer items-center whitespace-nowrap rounded-input border border-ivory/70 px-3 py-2 font-semibold text-ivory [&::-webkit-details-marker]:hidden'
                  : 'inline-flex min-h-11 list-none cursor-pointer items-center whitespace-nowrap rounded-input border border-stone px-3 py-2 font-semibold [&::-webkit-details-marker]:hidden'
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
