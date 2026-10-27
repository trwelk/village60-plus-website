import { describe, expect, it, vi } from 'vitest';
import type { SiteContact } from '@/lib/contact';
import { initialEnquiryState, processEnquiry, type EnquiryDeps } from './process';

const contact: SiteContact = {
  phone: '+94112504838',
  phoneDisplay: '+94 11 250 4838',
  whatsapp: '+94741003994',
  email: 'hello@example.com',
  responseTime: 'within one working day',
};

function deps(over: Partial<EnquiryDeps> = {}): EnquiryDeps {
  return {
    limit: vi.fn<EnquiryDeps['limit']>(async () => ({ success: true, limit: 5, remaining: 4, reset: 0 })),
    send: vi.fn<EnquiryDeps['send']>(async () => ({ ok: true })),
    recipients: [{ kind: 'general', to: ['team@example.com'] }, { kind: 'oracle-visit', to: ['oracle@example.com'] }],
    fallbackRecipient: 'fallback@example.com',
    contact,
    siteHost: 'www.village60plus.lk',
    requestHost: 'www.village60plus.lk',
    origin: 'https://www.village60plus.lk',
    clientIp: '203.0.113.5',
    today: '2026-10-12',
    ...over,
  };
}

function data(fields: Record<string, string>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
}

const general = {
  kind: 'general',
  context: 'Home',
  name: 'Nimal Perera',
  phone: '+94771234567',
  topic: 'oracle',
  whoFor: 'parent',
  message: 'Please call after 6pm.',
  privacy: 'on',
  company: '',
};

describe('processEnquiry', () => {
  it('emails the inbox for that form and returns a WhatsApp link without the message', async () => {
    const send = vi.fn<EnquiryDeps['send']>(async () => ({ ok: true }));
    const state = await processEnquiry(initialEnquiryState, data(general), deps({ send }));
    expect(state.status).toBe('success');
    expect(send).toHaveBeenCalledOnce();
    const email = send.mock.calls[0][0];
    expect(email.to).toEqual(['team@example.com']);
    expect(email.subject).toBe('Website enquiry');
    expect(email.subject).not.toContain('Nimal');
    expect(email.text).toContain('Please call after 6pm.');
    expect(email.text).toContain('Who is this for?: A parent');
    expect(email.text).toContain('I am enquiring about: Oracle');
    expect(email.text).not.toContain('whoFor');
    expect(email.text).not.toMatch(/diagnos|medical history/i);
    expect(state.whatsappHref).toContain('https://wa.me/94741003994');
    expect(state.whatsappHref).not.toContain('Please');
    expect(state.responseTime).toBe('within one working day');
    expect(state.values.name).toBe('Nimal Perera');
  });

  it('routes Oracle visits to the Oracle inbox', async () => {
    const send = vi.fn<EnquiryDeps['send']>(async () => ({ ok: true }));
    await processEnquiry(
      initialEnquiryState,
      data({
        kind: 'oracle-visit',
        context: 'Oracle',
        name: 'Anjali Fernando',
        phone: '+94771234567',
        preferredDate: '2026-10-20',
        preferredTime: '09:00-09:30',
        visitors: '2',
        privacy: 'on',
      }),
      deps({ send }),
    );
    expect(send.mock.calls[0][0].to).toEqual(['oracle@example.com']);
    expect(send.mock.calls[0][0].subject).toBe('Oracle private visit request');
  });

  it('uses the fallback recipient when no row matches', async () => {
    const send = vi.fn<EnquiryDeps['send']>(async () => ({ ok: true }));
    await processEnquiry(initialEnquiryState, data(general), deps({ send, recipients: [] }));
    expect(send.mock.calls[0][0].to).toEqual(['fallback@example.com']);
  });

  it('keeps typed values and lists every field error', async () => {
    const send = vi.fn<EnquiryDeps['send']>(async () => ({ ok: true }));
    const state = await processEnquiry(initialEnquiryState, data({ kind: 'general', context: 'Home', name: 'Nimal' }), deps({ send }));
    expect(state.status).toBe('error');
    expect(state.fieldErrors.phone).toBeTruthy();
    expect(state.formErrors[0]).toMatch(/highlighted fields/i);
    expect(state.values.name).toBe('Nimal');
    expect(send).not.toHaveBeenCalled();
  });

  it('does not send when the honeypot is filled, and still looks successful', async () => {
    const send = vi.fn<EnquiryDeps['send']>(async () => ({ ok: true }));
    const state = await processEnquiry(initialEnquiryState, data({ ...general, company: 'https://spam.example' }), deps({ send }));
    expect(state.status).toBe('success');
    expect(send).not.toHaveBeenCalled();
  });

  it('blocks a post whose Origin is missing or not this site', async () => {
    const send = vi.fn<EnquiryDeps['send']>(async () => ({ ok: true }));
    for (const origin of [null, 'https://evil.example']) {
      const state = await processEnquiry(initialEnquiryState, data(general), deps({ send, origin, requestHost: 'www.village60plus.lk' }));
      expect(state.status).toBe('error');
      expect(state.formErrors[0]).toMatch(/Village 60 Plus website/i);
    }
    expect(send).not.toHaveBeenCalled();

    const allowed = await processEnquiry(
      initialEnquiryState,
      data(general),
      deps({ send, origin: 'https://preview.example', requestHost: 'preview.example', siteHost: 'www.village60plus.lk' }),
    );
    expect(allowed.status).toBe('success');
    expect(send).toHaveBeenCalledOnce();
  });

  it('rate-limits and still offers a WhatsApp link', async () => {
    const state = await processEnquiry(
      initialEnquiryState,
      data(general),
      deps({ limit: async () => ({ success: false, limit: 5, remaining: 0, reset: 0 }) }),
    );
    expect(state.status).toBe('error');
    expect(state.formErrors[0]).toMatch(/call or WhatsApp/i);
    expect(state.whatsappHref).toContain('wa.me');
  });

  it('on email failure keeps the values, offers call and WhatsApp, and logs only the form kind', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = await processEnquiry(initialEnquiryState, data(general), deps({ send: async () => ({ ok: false }) }));
    expect(state.status).toBe('delivery-failed');
    expect(state.formErrors[0]).toMatch(/call or WhatsApp/i);
    expect(state.whatsappHref).toContain('wa.me');
    expect(state.values.phone).toBe('+94771234567');
    expect(JSON.stringify(error.mock.calls)).not.toContain('Nimal');
    expect(JSON.stringify(error.mock.calls)).toContain('general');
    error.mockRestore();
  });
});
