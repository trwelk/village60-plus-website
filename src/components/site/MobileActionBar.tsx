import { telHref, whatsappHref, type SiteContact } from '@/lib/contact';

export function MobileActionBar({ contact, context }: { contact: SiteContact; context: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-px border-t border-stone bg-stone md:hidden" role="region" aria-label="Quick contact">
      <a href={telHref(contact.phone)} className="flex min-h-14 items-center justify-center bg-green font-semibold text-ivory no-underline" data-track="call_click">
        Call
      </a>
      <a
        href={whatsappHref(contact.whatsapp, context)}
        className="flex min-h-14 items-center justify-center bg-paper font-semibold text-green no-underline"
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
      >
        WhatsApp
      </a>
    </div>
  );
}
