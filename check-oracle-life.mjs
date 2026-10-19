import { chromium } from 'playwright';

const out = 'C:/Users/trwelk/.cursor/projects/c-personal-dev-village60-new-website/assets';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/oracle', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(1500);
const ready = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector('h1')?.textContent ?? null,
  hasLife: Boolean(document.getElementById('oracle-life')),
  href: document.querySelector('a[href="#oracle-life"]')?.textContent ?? null,
}));
console.log('ready', JSON.stringify(ready));
if (!ready.hasLife) {
  await page.screenshot({ path: `${out}/oracle-life-missing.png`, fullPage: false });
  await browser.close();
  process.exit(2);
}
const before = await page.evaluate(() => Math.round(document.getElementById('oracle-life').getBoundingClientRect().top));
await page.getByRole('link', { name: 'Discover life at Oracle' }).click();
await page.waitForTimeout(1500);
const after = await page.evaluate(() => {
  const life = document.getElementById('oracle-life').getBoundingClientRect();
  const visit = document.getElementById('oracle-visit').getBoundingClientRect();
  return {
    lifeTop: Math.round(life.top),
    visitTop: Math.round(visit.top),
    lifeBeforeVisit: life.bottom <= visit.top + 2,
  };
});
await page.locator('#oracle-life').screenshot({ path: `${out}/oracle-life-desktop.png` });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto('http://localhost:3000/oracle', { waitUntil: 'domcontentloaded', timeout: 90000 });
await mobile.getByRole('link', { name: 'Discover life at Oracle' }).click();
await mobile.waitForTimeout(1500);
const mobileTop = await mobile.evaluate(() => Math.round(document.getElementById('oracle-life').getBoundingClientRect().top));
await mobile.locator('#oracle-life').screenshot({ path: `${out}/oracle-life-mobile.png` });
console.log(JSON.stringify({ before, after, mobileTop }));
await browser.close();
