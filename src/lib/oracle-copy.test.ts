import { describe, expect, it } from 'vitest';
import { ORACLE_HOME_SUMMARY, oracleHomeSummary } from './oracle-copy';

describe('oracleHomeSummary', () => {
  it('replaces the stale eight-room homepage line with ten', () => {
    expect(
      oracleHomeSummary(
        'Eight individually designed rooms within a private residence for independent adults, with shared spaces and support quietly available.',
      ),
    ).toBe(ORACLE_HOME_SUMMARY);
  });

  it('keeps an already-correct CMS summary', () => {
    const custom = 'Ten rooms for independent adults.';
    expect(oracleHomeSummary(custom)).toBe(custom);
  });
});
