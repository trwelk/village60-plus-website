import { expect, test } from '@playwright/test';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const seeded = projectId !== '' && projectId !== 'testproject';

test('seeded home labels The Grove as coming soon', async ({ page }) => {
  test.skip(!seeded, 'needs a Sanity dataset other than the testproject placeholder');
  await page.goto('/');
  const grove = page.getByRole('heading', { name: 'The Grove' });
  await expect(grove).toBeVisible();
  await expect(grove.locator('xpath=ancestor::article[1]')).toContainText('Coming soon');
});
