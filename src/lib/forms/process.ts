import { whatsappHref, type SiteContact } from '@/lib/contact';
import { summaryLines } from './definitions';
import { FORM_KINDS, formKindLabel, type FormKind } from './kinds';
import type { LimitResult } from './rate-limit';
import { parseEnquiry, valuesFromRaw, type EnquiryData } from './schemas';

export type RecipientRow = { kind: string; to: string[] };

export type EnquiryState = {
  status: 'idle' | 'success' | 'error' | 'delivery-failed';
  fieldErrors: Record<string, string>;
  formErrors: string[];
  values: Record<string, string>;
  whatsappHref: string | null;
  responseTime: string | null;
};

export const initialEnquiryState: EnquiryState = {
  status: 'idle',
  fieldErrors: {},
  formErrors: [],
  values: {},
  whatsappHref: null,
  responseTime: null,
};

export type EnquiryDeps = {
  limit: (id: string) => Promise<LimitResult>;
  send: (email: { to: string[]; subject: string; text: string; replyTo?: string }) => Promise<{ ok: boolean }>;
  recipients: RecipientRow[];
  fallbackRecipient: string;
  contact: SiteContact;
  siteHost: string;
  requestHost: string | null;
  origin: string | null;
  clientIp: string;
  today: string;
};

function isFormKind(value: string): value is FormKind {
  return FORM_KINDS.some((kind) => kind.value === value);
}

function recipientsFor(kind: FormKind, rows: RecipientRow[], fallback: string): string[] {
  const row = rows.find((item) => item.kind === kind) ?? rows.find((item) => item.kind === 'general');
  const emails = (row?.to ?? []).map((email) => email.trim()).filter(Boolean);
  return emails.length > 0 ? emails : [fallback];
}

function emailText(kind: FormKind, context: string, data: EnquiryData): { subject: string; text: string } {
  const subject = FORM_KINDS.find((item) => item.value === kind)?.subject ?? 'Website enquiry';
  const text = `Form: ${formKindLabel(kind)}
Page: ${context}

${summaryLines(kind, data as Record<string, string>).join('\n')}`;
  return { subject, text };
}

function hostOf(origin: string | null): string | null {
  if (!origin) return null;
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

export async function processEnquiry(_prev: EnquiryState, formData: FormData, deps: EnquiryDeps): Promise<EnquiryState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = valuesFromRaw(raw);
  const kindValue = raw.kind ?? '';
  const context = (raw.context ?? 'Village 60 Plus').slice(0, 80);
  const handoff = whatsappHref(deps.contact.whatsapp, context);

  if (!isFormKind(kindValue)) {
    return { ...initialEnquiryState, status: 'error', values, formErrors: ['This form could not be recognised. Please call or WhatsApp us.'] };
  }

  const originHost = hostOf(deps.origin);
  if (!originHost || (originHost !== deps.siteHost && originHost !== deps.requestHost)) {
    return {
      ...initialEnquiryState,
      status: 'error',
      values,
      formErrors: ['This form can only be submitted from the Village 60 Plus website.'],
    };
  }

  if ((raw.company ?? '').trim() !== '') {
    return { ...initialEnquiryState, status: 'success', values, whatsappHref: handoff, responseTime: deps.contact.responseTime };
  }

  const parsed = parseEnquiry(kindValue, raw, { today: deps.today });
  if (!parsed.ok) {
    return { ...initialEnquiryState, status: 'error', values, fieldErrors: parsed.fieldErrors, formErrors: parsed.formErrors };
  }

  const limit = await deps.limit(deps.clientIp || 'unknown');
  if (!limit.success) {
    return {
      ...initialEnquiryState,
      status: 'error',
      values,
      whatsappHref: handoff,
      formErrors: ['Too many enquiries from this connection. Please call or WhatsApp us, or try again shortly.'],
    };
  }

  const email = emailText(kindValue, context, parsed.data);
  const sent = await deps.send({
    to: recipientsFor(kindValue, deps.recipients, deps.fallbackRecipient),
    subject: email.subject,
    text: email.text,
    replyTo: 'email' in parsed.data && parsed.data.email ? parsed.data.email : undefined,
  });

  if (!sent.ok) {
    console.error('enquiry email failed', { kind: kindValue });
    return {
      ...initialEnquiryState,
      status: 'delivery-failed',
      values,
      whatsappHref: handoff,
      formErrors: ['We could not send your enquiry just now. Please call or WhatsApp us and we will help straight away.'],
    };
  }

  return { ...initialEnquiryState, status: 'success', values, whatsappHref: handoff, responseTime: deps.contact.responseTime };
}
