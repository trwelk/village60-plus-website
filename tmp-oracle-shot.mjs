import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
const section = page.locator('section[aria-labelledby="home-oracle"]');
await section.waitFor({ state: 'visible' });
await section.scrollIntoViewIfNeeded();
const alts = await section.locator('img').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('alt')));
console.log(JSON.stringify({ alts, text: await section.innerText() }, null, 2));
await page.waitForTimeout(1500);
await section.screenshot({ path: 'tmp-oracle-desktop.png' });

await page.setViewportSize({ width: 390, height: 900 });
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await section.screenshot({ path: 'tmp-oracle-mobile.png' });

await section.getByRole('link', { name: 'Learn More' }).click();
await page.waitForURL('**/oracle');
console.log('navigated', page.url());
await browser.close();
