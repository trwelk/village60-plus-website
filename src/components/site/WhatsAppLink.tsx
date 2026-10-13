'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { whatsappHref, type SiteContact } from '@/lib/contact';
import { contextForPath } from '@/lib/routes';

export function WhatsAppLink({ contact, className, children }: { contact: SiteContact; className?: string; children: ReactNode }) {
  const pathname = usePathname() || '/';
  return (
    <a
      href={whatsappHref(contact.whatsapp, contextForPath(pathname))}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
    >
      {children}
    </a>
  );
}
