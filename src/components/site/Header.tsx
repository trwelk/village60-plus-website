'use client';

import Link from 'next/link';
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { MORE_NAV, PRIMARY_NAV, overlayHeader } from '@/lib/navigation';
import { telHref, type SiteContact } from '@/lib/contact';
import { cn } from '@/lib/cn';
import { WhatsAppLink } from '@/components/site/WhatsAppLink';

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 48 48" className="size-9 shrink-0" aria-hidden>
        <path d="M24 44.5v-12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="24" cy="16" rx="6.2" ry="9" fill="currentColor" />
        <ellipse cx="15.2" cy="22.5" rx="6" ry="8" transform="rotate(-32 15.2 22.5)" fill="currentColor" />
        <ellipse cx="32.8" cy="22.5" rx="6" ry="8" transform="rotate(32 32.8 22.5)" fill="currentColor" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[12px] tracking-[0.22em] uppercase">Village</span>
        <span className="mt-1 font-display text-[15px] tracking-[0.16em] uppercase">60 Plus</span>
      </span>
    </span>
  );
}

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
    'inline-flex items-center whitespace-nowrap rounded-input px-1 py-2 text-[13px] font-medium leading-snug tracking-[0.01em] no-underline transition-colors duration-(--duration-fast) xl:px-1.5 xl:text-[14px]';
  const navLink = overlay
    ? `${navLinkBase} text-ivory hover:text-pale-gold`
    : `${navLinkBase} text-charcoal hover:text-green`;
  const navLinkActive = overlay ? 'text-ivory' : 'text-green';
  const enquiry = overlay ? (
    <EnquiryButton kind="general" context="Village 60 Plus" tone="overlay">
      Enquire
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </EnquiryButton>
  ) : (
    enquiryTrigger
  );

  return (
    <header ref={headerRef} className={cn('absolute inset-x-0 top-0 z-40', overlay ? 'on-dark' : 'bg-ivory')}>
      {overlay ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/55 via-night/20 to-transparent" aria-hidden />
      ) : null}
      <div className="relative mx-auto flex w-full max-w-[1520px] min-h-[72px] items-center gap-x-3 gutter py-3 lg:gap-x-5">
        <Link href="/" aria-label="Village 60 Plus" className={overlay ? 'shrink-0 text-pale-gold no-underline' : 'shrink-0 text-green no-underline'}>
          <BrandMark />
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 flex-1 items-center justify-center gap-x-2 lg:flex xl:gap-x-3">
          {PRIMARY_NAV.map((item) => {
            const active = navActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(navLink, 'relative', active && navLinkActive)}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
                {active ? <span aria-hidden className="absolute -bottom-1 left-1/2 h-px w-5 -translate-x-1/2 bg-pale-gold" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-2 lg:ml-0 lg:gap-2.5">
          {!overlay && contact.phone ? (
            <a
              href={telHref(contact.phone)}
              className="hidden min-h-10 items-center whitespace-nowrap text-[13px] font-medium leading-none text-charcoal no-underline transition-colors duration-(--duration-fast) hover:text-green xl:inline-flex"
              data-track="call_click"
            >
              Call {contact.phoneDisplay}
            </a>
          ) : null}
          {!overlay && contact.whatsapp ? (
            <WhatsAppLink
              contact={contact}
              className="hidden min-h-10 items-center whitespace-nowrap rounded-full border border-night/70 px-3.5 py-2 text-[13px] font-medium leading-none text-night no-underline transition-colors duration-(--duration-fast) hover:bg-sand lg:inline-flex"
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
