import { Button } from '@/components/ui/Button';
import { telHref, whatsappHref, type SiteContact } from '@/lib/contact';

export function ContactActions({
  contact,
  context,
  onDark = false,
  size = 'md',
  showNumber = true,
  className,
}: {
  contact: SiteContact;
  context: string;
  onDark?: boolean;
  size?: 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}) {
  return (
    <div className={className ?? 'flex flex-wrap gap-3'}>
      <Button href={telHref(contact.phone)} variant="primary" size={size} onDark={onDark} data-track="call_click">
        {showNumber ? `Call ${contact.phoneDisplay}` : 'Call'}
      </Button>
      <Button href={whatsappHref(contact.whatsapp, context)} variant="secondary" size={size} onDark={onDark} data-track="whatsapp_click" target="_blank" rel="noopener noreferrer">
        WhatsApp
      </Button>
    </div>
  );
}
