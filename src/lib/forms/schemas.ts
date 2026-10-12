import * as z from 'zod';
import type { FormKind } from './kinds';

const phone = z.string().trim().regex(/^\+?[0-9][0-9\s-]{6,18}$/, 'Enter a phone number we can call or message on WhatsApp.');
const personName = z.string().trim().min(2, 'Enter your name.').max(80, 'Name must be 80 characters or fewer.');
const privacy = z.literal('on', { error: 'Please confirm you have read the privacy notice.' });

function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max, `Keep this to ${max} characters or fewer.`)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : undefined));
}

function oneOf(values: string[], message: string) {
  return z.string().refine((value) => values.includes(value), message);
}

const schemas = {
  general: z.object({
    name: personName,
    phone,
    topic: oneOf(['oracle', 'home', 'living-and-care', 'recovery-respite', 'destination-retirement', 'silver-roots', 'other'], 'Choose what you are enquiring about.'),
    whoFor: oneOf(['myself', 'parent', 'relative', 'someone-else'], 'Choose who this enquiry is for.'),
    message: optionalText(1000),
    privacy,
  }),
  'find-care': z.object({
    whoFor: oneOf(['myself', 'parent', 'relative', 'someone-else'], 'Choose who this enquiry is for.'),
    helpType: oneOf(['independent-living', 'residential-care', 'respite', 'recovery', 'rehabilitation', 'not-sure'], 'Choose the kind of help you are considering.'),
    residencePreference: optionalText(120),
    name: personName,
    phone,
    privacy,
  }),
  'oracle-visit': z.object({
    name: personName,
    phone,
    preferredDate: z.iso.date('Choose a date.'),
    preferredTime: oneOf(['morning', 'afternoon', 'evening'], 'Choose a preferred time.'),
    visitors: oneOf(['1', '2', '3', '4-plus'], 'Choose the number of visitors.'),
    note: optionalText(1000),
    privacy,
  }),
  'grove-interest': z.object({
    name: personName,
    phone,
    message: optionalText(1000),
    privacy,
  }),
  'silver-roots-partner': z.object({
    organisation: z.string().trim().min(2, 'Enter the organisation name.').max(120),
    role: optionalText(80),
    name: personName,
    phone,
    email: z.email('Enter a valid email address.'),
    message: optionalText(1000),
    privacy,
  }),
  'destination-retirement': z.object({
    name: personName,
    phone,
    stayLength: oneOf(['few-weeks', 'few-months', 'not-sure'], 'Choose a rough length of stay.'),
    note: optionalText(1000),
    privacy,
  }),
} satisfies Record<FormKind, z.ZodType>;

export type EnquiryData = {
  [K in FormKind]: z.infer<(typeof schemas)[K]>;
}[FormKind];

const ROUTING_KEYS = new Set(['kind', 'context', 'company']);

export function valuesFromRaw(raw: Record<string, FormDataEntryValue | string | undefined>): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (ROUTING_KEYS.has(key) || typeof value !== 'string') continue;
    values[key] = value;
  }
  return values;
}

export function parseEnquiry(
  kind: FormKind,
  raw: Record<string, FormDataEntryValue | string | undefined>,
  options: { today: string },
): { ok: true; data: EnquiryData } | { ok: false; fieldErrors: Record<string, string>; formErrors: string[] } {
  const result = schemas[kind].safeParse(raw);
  if (!result.success) {
    const flat = z.flattenError(result.error as z.ZodError<Record<string, unknown>>);
    const fieldErrors: Record<string, string> = {};
    for (const [key, messages] of Object.entries(flat.fieldErrors)) {
      const message = messages?.[0];
      if (message) fieldErrors[key] = message;
    }
    for (const message of flat.formErrors) fieldErrors.form = message;
    return { ok: false, fieldErrors, formErrors: ['Please check the highlighted fields.'] };
  }

  if (kind === 'oracle-visit' && 'preferredDate' in result.data && result.data.preferredDate < options.today) {
    return {
      ok: false,
      fieldErrors: { preferredDate: 'Choose today or a later date.' },
      formErrors: ['Please check the highlighted fields.'],
    };
  }

  return { ok: true, data: result.data };
}
