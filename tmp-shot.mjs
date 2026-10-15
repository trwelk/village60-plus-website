import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });
await page.goto('http://localhost:3000/our-story', { waitUntil: 'networkidle' });
const reject = page.getByRole('button', { name: 'Reject' });
if (await reject.count()) await reject.click();
await page.setViewportSize({ width: 1440, height: 1800 });
const scrolled = await page.evaluate(() => {
  const el = [...document.querySelectorAll('time')].find((t) => t.textContent.trim() === '2026');
  const y = el.getBoundingClientRect().top + window.scrollY;
  const before = window.scrollY;
  window.scrollTo({ top: y - 280, behavior: 'instant' });
  return { target: y - 280, before, after: window.scrollY, doc: document.documentElement.scrollHeight, inner: window.innerHeight };
});
console.log('scroll', scrolled);
await page.waitForTimeout(300);
const metrics = await page.evaluate(() => {
  const svg = document.querySelector('svg[viewBox="0 0 1200 220"]');
  const cards = [...document.querySelectorAll('section[aria-label="Where the story leads"] article')];
  const node = [...document.querySelectorAll('time')].find((t) => t.textContent.trim() === '2026');
  const sr = svg.getBoundingClientRect();
  const nr = node.getBoundingClientRect();
  return {
    svg: { x: Math.round(sr.x), y: Math.round(sr.y), w: Math.round(sr.width), h: Math.round(sr.height) },
    node: { x: Math.round(nr.x), y: Math.round(nr.y), w: Math.round(nr.width), h: Math.round(nr.height) },
    cards: cards.map((c) => {
      const r = c.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    }),
  };
});
const overlap = await page.evaluate(() => {
  const heading = [...document.querySelectorAll('h3')].find((h) => h.textContent.includes('The Next Generation'));
  const block = heading.parentElement;
  const last = block.querySelector('p:last-of-type');
  const style = getComputedStyle(block.parentElement);
  const br = block.getBoundingClientRect();
  const lr = last.getBoundingClientRect();
  return {
    pad: style.paddingBottom,
    align: style.alignSelf,
    blockBottom: Math.round(br.bottom),
    lastTop: Math.round(lr.top),
    lastBottom: Math.round(lr.bottom),
  };
});
console.log('overlap', overlap);
console.log(JSON.stringify(metrics, null, 2));
await page.screenshot({
  path: 'tmp-branches-desktop.png',
  clip: { x: 40, y: 0, width: 1360, height: 1050 },
});
await browser.close();
