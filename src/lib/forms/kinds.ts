// Subjects contain no personal or health data.
export const FORM_KINDS = [
  { value: 'general', label: 'General enquiry', subject: 'Website enquiry' },
  { value: 'find-care', label: 'Find the Right Care', subject: 'Find the Right Care enquiry' },
  { value: 'oracle-visit', label: 'Oracle private visit', subject: 'Oracle private visit request' },
  { value: 'grove-interest', label: 'The Grove — register interest', subject: 'The Grove interest registration' },
  { value: 'silver-roots-partner', label: 'Silver Roots partner interest', subject: 'Silver Roots partner interest' },
  { value: 'destination-retirement', label: 'Destination Retirement enquiry', subject: 'Destination Retirement enquiry' },
  { value: 'feedback', label: 'Feedback or complaint', subject: 'Feedback or complaint' },
] as const;

export type FormKind = (typeof FORM_KINDS)[number]['value'];

export function formKindLabel(kind: FormKind): string {
  return FORM_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

export function asFormKind(value: string | null | undefined, fallback: FormKind = 'general'): FormKind {
  return FORM_KINDS.some((item) => item.value === value) ? (value as FormKind) : fallback;
}
