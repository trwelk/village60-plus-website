'use client';

import { usePathname } from 'next/navigation';
import { telHref, whatsappHref, type SiteContact } from '@/lib/contact';
import { contextForPath } from '@/lib/routes';

export function MobileActionBar({ contact }: { contact: SiteContact }) {
  const context = contextForPath(usePathname() || '/');
  if (!contact.phone && !contact.whatsapp) return null;
  return (
    <div className={`fixed inset-x-0 bottom-0 z-30 grid gap-px border-t border-stone bg-stone md:hidden ${contact.phone && contact.whatsapp ? 'grid-cols-2' : 'grid-cols-1'}`} role="region" aria-label="Quick contact">
      {contact.phone ? (
        <a href={telHref(contact.phone)} className="flex min-h-14 items-center justify-center bg-green font-semibold text-ivory no-underline" data-track="call_click">
          Call
        </a>
      ) : null}
      {contact.whatsapp ? (
        <a
          href={whatsappHref(contact.whatsapp, context)}
          className="flex min-h-14 items-center justify-center bg-paper font-semibold text-green no-underline"
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp_click"
        >
          WhatsApp
        </a>
      ) : null}
    </div>
  );
}
