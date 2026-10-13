'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { getPublicEnv, getServerEnv } from '@/lib/env';
import { getEnquiryLimiter } from './rate-limit';
import { processEnquiry, type EnquiryState, type RecipientRow } from './process';

function todayInColombo(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

async function loadRecipients(): Promise<{ rows: RecipientRow[]; contact: import('@/lib/contact').SiteContact } | null> {
  const { fetchPublished } = await import('@/sanity/fetch');
  const { SITE_SETTINGS_QUERY } = await import('@/sanity/queries');
  const settings = await fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']);
  if (!settings?.phone || !settings.whatsapp) return null;
  return {
    rows: (settings.formRecipients ?? []).flatMap((row) =>
      row.kind && row.to ? [{ kind: row.kind, to: row.to.filter((email): email is string => Boolean(email)) }] : [],
    ),
    contact: {
      phone: settings.phone,
      phoneDisplay: settings.phoneDisplay ?? settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email ?? '',
      responseTime: settings.responseTime ?? 'as soon as we can',
    },
  };
}

export async function submitEnquiry(prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const headerList = await headers();
  const server = getServerEnv();
  const site = getPublicEnv();
  let rows: RecipientRow[] = [];
  let contact = {
    phone: '',
    phoneDisplay: '',
    whatsapp: '',
    email: '',
    responseTime: 'as soon as we can',
  };
  try {
    const loaded = await loadRecipients();
    if (loaded) {
      rows = loaded.rows;
      contact = loaded.contact;
    }
  } catch (error) {
    console.error('enquiry settings unavailable', { message: error instanceof Error ? error.name : 'error' });
  }

  const resend = new Resend(server.resendApiKey);
  const forwarded = headerList.get('x-forwarded-for')?.split(',')[0]?.trim();

  return processEnquiry(prev, formData, {
    limit: (id) => getEnquiryLimiter().limit(id),
    send: async (email) => {
      const { error } = await resend.emails.send({
        from: server.emailFrom,
        to: email.to,
        replyTo: email.replyTo,
        subject: email.subject,
        text: email.text,
      });
      return { ok: !error };
    },
    recipients: rows,
    fallbackRecipient: server.fallbackRecipient,
    contact,
    siteHost: new URL(site.siteUrl).host,
    requestHost: headerList.get('x-forwarded-host') ?? headerList.get('host'),
    origin: headerList.get('origin'),
    clientIp: forwarded || 'unknown',
    today: todayInColombo(),
  });
}
