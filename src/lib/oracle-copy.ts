export const ORACLE_HOME_SUMMARY =
  'Ten individually designed rooms within a private residence for independent adults, with shared spaces and support quietly available.';

const STALE_EIGHT_HOME_SUMMARY = /^Eight individually designed rooms within a private residence/i;

/** Prefer CMS copy unless it still says eight rooms before Coral and Pearl were published. */
export function oracleHomeSummary(cmsSummary: string | null | undefined): string {
  const trimmed = cmsSummary?.trim();
  if (trimmed && !STALE_EIGHT_HOME_SUMMARY.test(trimmed)) return trimmed;
  return ORACLE_HOME_SUMMARY;
}
