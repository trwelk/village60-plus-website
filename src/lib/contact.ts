export type SiteContact = {
  /** E.164 or display-formatted; normalised by helpers. */
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  /** Human sentence, e.g. "within one working day". */
  responseTime: string;
};

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return `tel:${digits.startsWith('+') ? digits : `+${digits}`}`;
}

/** Sri Lankan numbers read as +94 77 876 8901. Text that already has spaces is left as written. */
export function displayPhone(phone: string): string {
  const trimmed = phone.trim();
  if (/\s/.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('94') && digits.length === 11) {
    return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return trimmed;
}

export function waMeNumber(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^0+/, '');
}

export function whatsappMessage(context: string): string {
  return `Hello Village 60 Plus, I'm enquiring about ${context}.`;
}

export function whatsappHref(whatsapp: string, context: string): string {
  return `https://wa.me/${waMeNumber(whatsapp)}?text=${encodeURIComponent(whatsappMessage(context))}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email.trim()}`;
}
