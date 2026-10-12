export const CONTENT_STATUSES = [
  { value: 'available', label: 'Available now' },
  { value: 'limited', label: 'Limited availability' },
  { value: 'pilot', label: 'Pilot' },
  { value: 'coming-soon', label: 'Coming soon' },
  { value: 'in-development', label: 'In development' },
  { value: 'planned', label: 'Planned' },
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number]['value'];

export function statusLabel(status: ContentStatus): string {
  return CONTENT_STATUSES.find((s) => s.value === status)?.label ?? status;
}

/** Operating now — safe to describe in present tense and to mark up as LocalBusiness/Service. */
export function isOperating(status: ContentStatus): boolean {
  return status === 'available' || status === 'limited';
}

/** Future-facing — must always carry a visible status label. */
export function isFuture(status: ContentStatus): boolean {
  return status === 'coming-soon' || status === 'in-development' || status === 'planned';
}
