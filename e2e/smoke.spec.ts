import { test, expect } from '@playwright/test';

test('home responds and has a main landmark', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('main')).toBeVisible();
});
