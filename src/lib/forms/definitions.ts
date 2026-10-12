import type { FormKind } from './kinds';

export type FieldType = 'text' | 'tel' | 'email' | 'textarea' | 'select' | 'date' | 'checkbox';

export type FieldOption = { value: string; label: string };

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: FieldOption[];
  autocomplete?: string;
  maxLength?: number;
};

export type FormDefinition = {
  kind: FormKind;
  heading: string;
  intro: string;
  submitLabel: string;
  fields: FieldDef[];
};

export const WHO_FOR: FieldOption[] = [
  { value: 'myself', label: 'Myself' },
  { value: 'parent', label: 'A parent' },
  { value: 'relative', label: 'A relative' },
  { value: 'someone-else', label: 'Someone else' },
];

export const HELP_TYPES: FieldOption[] = [
  { value: 'independent-living', label: 'Independent living' },
  { value: 'residential-care', label: 'Residential care' },
  { value: 'respite', label: 'Respite' },
  { value: 'recovery', label: 'Recovery after hospital or surgery' },
  { value: 'rehabilitation', label: 'Rehabilitation' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const ENQUIRY_TOPICS: FieldOption[] = [
  { value: 'oracle', label: 'Oracle' },
  { value: 'home', label: 'A Village 60 Plus home' },
  { value: 'living-and-care', label: 'Living & Care' },
  { value: 'recovery-respite', label: 'Recovery and respite' },
  { value: 'destination-retirement', label: 'Destination Retirement' },
  { value: 'silver-roots', label: 'Silver Roots' },
  { value: 'other', label: 'Something else' },
];

export const VISIT_TIMES: FieldOption[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

export const VISITOR_COUNTS: FieldOption[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4-plus', label: '4 or more' },
];

export const STAY_LENGTHS: FieldOption[] = [
  { value: 'few-weeks', label: 'A few weeks' },
  { value: 'few-months', label: 'A few months' },
  { value: 'not-sure', label: 'Not sure yet' },
];

const privacy: FieldDef = {
  name: 'privacy',
  label: 'I have read the privacy notice and agree to be contacted about this enquiry.',
  type: 'checkbox',
  required: true,
};

const name: FieldDef = { name: 'name', label: 'Your name', type: 'text', required: true, autocomplete: 'name', maxLength: 80 };
const phone: FieldDef = { name: 'phone', label: 'Phone or WhatsApp', type: 'tel', required: true, autocomplete: 'tel', maxLength: 20 };

const DEFINITIONS: Record<FormKind, FormDefinition> = {
  general: {
    kind: 'general',
    heading: 'Talk to the team',
    intro: 'Tell us a little about what you are looking for. This is not an assessment.',
    submitLabel: 'Send enquiry',
    fields: [
      name,
      phone,
      { name: 'topic', label: 'I am enquiring about', type: 'select', required: true, options: ENQUIRY_TOPICS },
      { name: 'whoFor', label: 'Who is this for?', type: 'select', required: true, options: WHO_FOR },
      { name: 'message', label: 'Message', type: 'textarea', required: false, maxLength: 1000 },
      privacy,
    ],
  },
  'find-care': {
    kind: 'find-care',
    heading: 'Find the right care',
    intro: 'You do not need to know the care category. We will talk it through with you. This form is not a medical assessment.',
    submitLabel: 'Send to the team',
    fields: [
      { name: 'whoFor', label: 'Who is this for?', type: 'select', required: true, options: WHO_FOR },
      { name: 'helpType', label: 'What kind of help are you considering?', type: 'select', required: true, options: HELP_TYPES },
      { name: 'residencePreference', label: 'Preferred home or area (optional)', type: 'text', required: false, maxLength: 120 },
      name,
      phone,
      privacy,
    ],
  },
  'oracle-visit': {
    kind: 'oracle-visit',
    heading: 'Arrange a private visit',
    intro: 'Request a visit to Oracle. We will confirm by phone or WhatsApp — this is not an instant booking.',
    submitLabel: 'Request my visit',
    fields: [
      name,
      phone,
      { name: 'preferredDate', label: 'Preferred date', type: 'date', required: true },
      { name: 'preferredTime', label: 'Preferred time', type: 'select', required: true, options: VISIT_TIMES },
      { name: 'visitors', label: 'Number of visitors', type: 'select', required: true, options: VISITOR_COUNTS },
      { name: 'note', label: 'Anything you would like us to know (optional)', type: 'textarea', required: false, maxLength: 1000 },
      privacy,
    ],
  },
  'grove-interest': {
    kind: 'grove-interest',
    heading: 'Register your interest',
    intro: 'The Grove is not open yet. Leave your details and we will be in touch as plans firm up.',
    submitLabel: 'Register interest',
    fields: [name, phone, { name: 'message', label: 'Message (optional)', type: 'textarea', required: false, maxLength: 1000 }, privacy],
  },
  'silver-roots-partner': {
    kind: 'silver-roots-partner',
    heading: 'Partner with Silver Roots',
    intro: 'Tell us about your organisation. We will reply to discuss whether there is a fit.',
    submitLabel: 'Send partner enquiry',
    fields: [
      { name: 'organisation', label: 'Organisation', type: 'text', required: true, autocomplete: 'organization', maxLength: 120 },
      { name: 'role', label: 'Your role (optional)', type: 'text', required: false, maxLength: 80 },
      name,
      phone,
      { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxLength: 120 },
      { name: 'message', label: 'What would you like to offer? (optional)', type: 'textarea', required: false, maxLength: 1000 },
      privacy,
    ],
  },
  'destination-retirement': {
    kind: 'destination-retirement',
    heading: 'Plan a stay',
    intro: 'Tell us the kind of stay you have in mind. Nothing on this page is a confirmed package.',
    submitLabel: 'Send enquiry',
    fields: [
      name,
      phone,
      { name: 'stayLength', label: 'How long are you thinking of staying?', type: 'select', required: true, options: STAY_LENGTHS },
      { name: 'note', label: 'What kind of stay are you imagining? (optional)', type: 'textarea', required: false, maxLength: 1000 },
      privacy,
    ],
  },
};

export function formDefinition(kind: FormKind): FormDefinition {
  return DEFINITIONS[kind];
}

export function summaryLines(kind: FormKind, values: Record<string, string>): string[] {
  const lines: string[] = [];
  for (const field of formDefinition(kind).fields) {
    if (field.name === 'privacy') continue;
    const value = values[field.name];
    if (!value) continue;
    const display = field.options?.find((option) => option.value === value)?.label ?? value;
    const label = field.label.replace(/ \(optional\)$/, '');
    lines.push(`${label}: ${display}`);
  }
  return lines;
}
