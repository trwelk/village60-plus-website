import '@testing-library/jest-dom/vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend(axeMatchers);
afterEach(() => cleanup());

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= 'testproject';
process.env.NEXT_PUBLIC_SANITY_DATASET ??= 'test';

if (typeof HTMLElement.prototype.scrollBy !== 'function') {
  HTMLElement.prototype.scrollBy = () => {};
}
