import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

test.describe('empty-state smoke', () => {
  for (const path of ['/', '/contact']) {
    test(`${path} responds with skip link, header, main and footer`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeAttached();
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.locator('main#main')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    });

    test(`${path} has no axe violations for the WCAG 2.2 AA tags`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test('home sections are in the approved order', async ({ page }) => {
    await page.goto('/');
    const sections = await page.locator('[data-home-section]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-home-section')));
    expect(sections).toEqual(['hero', 'story', 'oracle', 'homes', 'care', 'silver-roots', 'ecosystem', 'trust']);
    const story = page.getByRole('heading', { name: /A More Meaningful Tomorrow/ });
    const oracle = page.getByRole('heading', { name: 'Oracle' }).first();
    const storyBox = await story.boundingBox();
    const oracleBox = await oracle.boundingBox();
    expect(storyBox && oracleBox && storyBox.y < oracleBox.y).toBeTruthy();
    await expect(page.getByRole('heading', { name: 'Find the Right Care' })).toHaveCount(0);
  });

  test('keyboard opens the enquiry dialog', async ({ page }) => {
    await page.goto('/');
    const enquire = page.getByRole('button', { name: 'Enquire' });
    await enquire.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Talk to the team' })).toBeVisible();
  });

  test('reduced motion does not start a hero video', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('main#main')).toBeVisible();
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined)))));
    await expect(page.locator('video[autoplay]')).toHaveCount(0);
  });
});
