import { expect, test } from '@playwright/test';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const seeded = projectId !== '' && projectId !== 'testproject';

test('seeded home shows The Heritage, not The Grove, as the next residence', async ({ page }) => {
  test.skip(!seeded, 'needs a Sanity dataset other than the testproject placeholder');
  await page.goto('/');
  const heritage = page.getByRole('heading', { name: 'The Heritage' });
  await expect(heritage).toBeVisible();
  await expect(heritage.locator('xpath=ancestor::article[1]')).toContainText('Coming soon');
  await expect(page.getByRole('heading', { name: 'The Grove' })).toHaveCount(0);
});
