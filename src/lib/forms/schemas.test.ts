import { describe, expect, it } from 'vitest';
import { FORM_KINDS, type FormKind } from './kinds';
import { formDefinition, summaryLines, VISIT_TIMES } from './definitions';
import { parseEnquiry, valuesFromRaw } from './schemas';

const TODAY = '2026-10-12';

function raw(fields: Record<string, string>): Record<string, string> {
  return fields;
}

describe('form definitions', () => {
  it('defines every form kind', () => {
    for (const kind of FORM_KINDS) {
      const def = formDefinition(kind.value);
      expect(def.kind).toBe(kind.value);
      expect(def.fields.some((field) => field.name === 'privacy' && field.required)).toBe(true);
      expect(def.fields.filter((field) => field.name !== 'privacy').length).toBeLessThanOrEqual(kind.value === 'general' ? 5 : 8);
    }
  });

  it('offers Oracle visits as 30-minute windows from 9:00 AM to 5:00 PM', () => {
    const times = formDefinition('oracle-visit').fields.find((field) => field.name === 'preferredTime')?.options;
    expect(times).toBe(VISIT_TIMES);
    expect(times?.map((option) => option.label)).toEqual([
      '9:00 AM – 9:30 AM',
      '9:30 AM – 10:00 AM',
      '10:00 AM – 10:30 AM',
      '10:30 AM – 11:00 AM',
      '11:00 AM – 11:30 AM',
      '11:30 AM – 12:00 PM',
      '12:00 PM – 12:30 PM',
      '12:30 PM – 1:00 PM',
      '1:00 PM – 1:30 PM',
      '1:30 PM – 2:00 PM',
      '2:00 PM – 2:30 PM',
      '2:30 PM – 3:00 PM',
      '3:00 PM – 3:30 PM',
      '3:30 PM – 4:00 PM',
      '4:00 PM – 4:30 PM',
      '4:30 PM – 5:00 PM',
    ]);
  });

  it('keeps the general panel to five primary fields', () => {
    const names = formDefinition('general').fields.map((field) => field.name);
    expect(names).toEqual(['name', 'phone', 'topic', 'whoFor', 'message', 'privacy']);
  });

  it('does not ask Find the Right Care for a diagnosis', () => {
    const names = formDefinition('find-care').fields.map((field) => field.name);
    expect(names).toEqual(['whoFor', 'helpType', 'residencePreference', 'name', 'phone', 'privacy']);
    expect(names).not.toContain('message');
  });

  it('summarises submitted values with option labels', () => {
    expect(summaryLines('general', { name: 'Nimal Perera', phone: '+94771234567', topic: 'oracle', whoFor: 'parent', message: 'Please call after 6pm.', privacy: 'on' })).toEqual([
      'Your name: Nimal Perera',
      'Phone or WhatsApp: +94771234567',
      'I am enquiring about: Oracle',
      'Who is this for?: A parent',
      'Message: Please call after 6pm.',
    ]);
  });
});

describe('parseEnquiry', () => {
  it('accepts a complete general enquiry and trims text', () => {
    const result = parseEnquiry(
      'general',
      raw({
        name: '  Nimal Perera  ',
        phone: '+94 77 123 4567',
        topic: 'oracle',
        whoFor: 'parent',
        message: 'We would like to visit.',
        privacy: 'on',
        company: '',
      }),
      { today: TODAY },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toMatchObject({ name: 'Nimal Perera', topic: 'oracle', whoFor: 'parent' });
      expect(result.data).not.toHaveProperty('company');
    }
  });

  it('reports one message per invalid field and a summary', () => {
    const result = parseEnquiry('general', raw({ name: 'A', phone: '12', topic: '', whoFor: 'nope' }), { today: TODAY });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.name).toMatch(/name/i);
      expect(result.fieldErrors.phone).toBeTruthy();
      expect(result.fieldErrors.topic).toBeTruthy();
      expect(result.fieldErrors.whoFor).toBeTruthy();
      expect(result.fieldErrors.privacy).toMatch(/privacy/i);
      expect(result.formErrors[0]).toMatch(/check the highlighted fields/i);
    }
  });

  it('allows Find the Right Care without a residence preference', () => {
    const result = parseEnquiry(
      'find-care',
      raw({ whoFor: 'myself', helpType: 'not-sure', residencePreference: '', name: 'Anjali Fernando', phone: '0771234567', privacy: 'on' }),
      { today: TODAY },
    );
    expect(result.ok).toBe(true);
  });

  it('rejects an Oracle visit date in the past', () => {
    const result = parseEnquiry(
      'oracle-visit',
      raw({
        name: 'Anjali Fernando',
        phone: '+94771234567',
        preferredDate: '2026-10-01',
        preferredTime: '09:00-09:30',
        visitors: '2',
        privacy: 'on',
      }),
      { today: TODAY },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.preferredDate).toMatch(/today or a later date/i);
  });

  it('accepts feedback without an email and rejects a blank message', () => {
    const result = parseEnquiry(
      'feedback',
      raw({
        name: 'Nimal Perera',
        phone: '+94771234567',
        email: '',
        nature: 'complaint',
        about: 'Serenity',
        message: 'The evening meal arrived cold.',
        privacy: 'on',
      }),
      { today: TODAY },
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toMatchObject({ nature: 'complaint', about: 'Serenity', email: undefined });

    const blank = parseEnquiry(
      'feedback',
      raw({ name: 'Nimal Perera', phone: '+94771234567', email: 'not-an-email', nature: 'complaint', message: ' ', privacy: 'on' }),
      { today: TODAY },
    );
    expect(blank.ok).toBe(false);
    if (!blank.ok) {
      expect(blank.fieldErrors.email).toMatch(/email/i);
      expect(blank.fieldErrors.message).toMatch(/know/i);
    }
  });

  it('requires an email for partner interest and not for the other forms', () => {
    const missingEmail = parseEnquiry(
      'silver-roots-partner',
      raw({ organisation: 'Care Co', name: 'Ravi Silva', phone: '+94771234567', email: '', privacy: 'on' }),
      { today: TODAY },
    );
    expect(missingEmail.ok).toBe(false);
    const kindsWithoutEmail: FormKind[] = ['general', 'find-care', 'oracle-visit', 'grove-interest', 'destination-retirement'];
    for (const kind of kindsWithoutEmail) {
      expect(formDefinition(kind).fields.some((field) => field.name === 'email')).toBe(false);
    }
  });
});

describe('valuesFromRaw', () => {
  it('keeps what the visitor typed and drops routing and honeypot fields', () => {
    expect(valuesFromRaw({ kind: 'general', context: 'Home', company: 'spam', name: 'Nimal', phone: '077' })).toEqual({
      name: 'Nimal',
      phone: '077',
    });
  });
});
