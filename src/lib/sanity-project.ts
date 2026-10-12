/** Matches `.env.example` — no real project id at build time (CI / local template). */
export function isSanityProjectConfigured(projectId: string): boolean {
  const id = projectId.trim();
  return id.length > 0 && id !== 'placeholder';
}
