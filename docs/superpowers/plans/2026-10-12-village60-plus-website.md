# Village 60 Plus Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** `docs/superpowers/specs/2026-10-12-village60-plus-website-design.md`
**Research reference (verified 12 Oct 2026):** `docs/superpowers/research/2026-10-12-sanity-nextjs-reference.md`

**Goal:** Build the Village 60 Plus marketing website — a Next.js App Router site with an embedded Sanity Studio, a shared enquiry-form system that emails the team and hands off to WhatsApp, and the "Verandah" visual system — covering every route in the spec sitemap, WCAG 2.2 AA, and accurate status labelling for future-facing services.

**Architecture:** One Next.js repo (`src/` layout). Marketing pages are React Server Components rendered statically/ISR from Sanity via a draft-aware `sanityFetch` wrapper; each `page.tsx` only fetches and delegates to a synchronous `*View` component so views are unit-testable in Vitest. Sanity Studio is embedded at `/studio`. Forms post to one Server Action (`submitEnquiry`) that validates with Zod, rate-limits, sends a text-only email through Resend, and returns a typed state consumed by one `EnquiryForm` client component. Styling is Tailwind CSS v4 with design tokens declared in `@theme`.

**Tech Stack:** Next.js 16.4 (App Router, TypeScript, RSC), React 19.3, Tailwind CSS 4.3, Sanity 6.18 + next-sanity 13.3 + @sanity/image-url 2.1, Zod 4.6, Resend 6.32, @upstash/ratelimit 2.2 (+ in-memory dev fallback), @next/third-parties 16.4 (GA4), Vitest 5 + Testing Library + vitest-axe, Playwright 1.64 + @axe-core/playwright, GitHub Actions, Vercel.

## Global Constraints

Copied from the spec. Every task implicitly includes these.

- Domain: `https://www.village60plus.lk`. `<html lang="en-LK">`. English only.
- Primary conversion is phone or WhatsApp. Call uses a `tel:` link; WhatsApp uses `https://wa.me/<digits>?text=<page-specific prefilled context>`. Call and WhatsApp reachable in one action on every page: desktop header shows phone number + WhatsApp; mobile shows a sticky Call + WhatsApp bar.
- No floating chatbot, no entry pop-up, no hero/testimonial sliders, no autoplay audio, no parallax, no animated counters, no countdowns, no urgency banners, no hidden phone numbers, no placeholder-only form labels.
- No public pricing. No unsupported medical, outcome, ranking, availability, "best/number one/only" or "international standard" claims. The site must not diagnose or recommend treatment. No page may imply guaranteed outcomes.
- Status labels (CMS-supported, exact strings): `Available now`, `Limited availability`, `Pilot`, `Coming soon`, `In development`, `Planned`. They must appear wherever a future-facing service could be mistaken for a current one.
- Oracle's only canonical URL is `/oracle`; `/homes/oracle` must not exist as a page (redirect to `/oracle`). The Grove is clearly labelled coming soon with a single register-interest action.
- Colors (hex exact): Warm Ivory `#F7F3EA` background; Deep Heritage Green `#18352D` primary actions/dark sections/footer; Antique Gold `#A88A42` decorative lines/large icons only; Charcoal `#20211F` text; Paper `#FFFDF8`; Sand `#EDE6D6`; Stone `#D9D1BF` borders; Bronze `#6F5A24` gold-family text on light; Pale Gold `#D4B86A` labels/focus/icons on dark; Oracle Night `#0F1F1B`; Mist `#E4EBE3`; Leaf `#3F6B4F` (Silver Roots accent); Error `#9B2C2C`. Never gold body/small text on ivory; never white text on gold; primary buttons = Heritage Green with Ivory text. Dark treatments only for Oracle, SAGE hero, footer, and one optional story quote band.
- Typography: Display **Fraunces** variable 500–600; Body/UI **Source Sans 3** variable 400–600; both self-hosted via `next/font`. Display ≤ 60px; H1 48/34px; H2 38/30px; body 18/17px, line-height 1.6; min 14px (captions only); prose max 68ch; no weight < 400; no justified text; no long all-caps.
- Layout: 12-column grid, max content width 1280px; gutters 32/24/20px; section spacing 128/96/64px; max three cards per desktop row. Radii: inputs/chips 6px, images/small cards 12px, large cards/panels 20px, buttons pill. Default border 1px Stone. Single approved shadow `0 8px 24px rgba(32, 33, 31, 0.08)` (panels only; resting cards use borders).
- Motion: 150ms hover/focus, 250ms menus/accordions, 400ms panels/lightboxes; small one-time reveal only; honour `prefers-reduced-motion`; no autoplay hero video for reduced-motion or data-saver users.
- Breakpoints: 360px minimum design width; 600, 900, 1200, 1440px.
- Accessibility: WCAG 2.2 AA; touch targets ≥ 44×44px; text contrast ≥ 4.5:1, large text and UI boundaries ≥ 3:1; visible focus; skip link and landmarks; one H1 per page; 200% zoom without horizontal scroll; visible pause control for hero video; sticky controls must not obscure focused elements; form labels, autocomplete, accessible errors, no time limits.
- Forms: client + server validation with a shared schema; preserve values after recoverable errors; per-field text error + top summary; focus moves to summary on failure; on email failure show Call and WhatsApp immediately and log a non-sensitive event; never expose internal errors; honeypot, server-side rate limiting, origin checks; no inaccessible CAPTCHA. No sensitive health information in email subjects. Collect only what is needed to respond; never ask for diagnoses, medical histories, ID numbers or payment info.
- Analytics: GA4 (or approved alternative) + Search Console. Never send names, phones, emails, messages or other personal data to analytics.
- Performance targets (p75): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. AVIF/WebP, explicit image dimensions, hero poster, video < 4MB, lazy-load below the fold, minimal client JS.
- Media rights: every image carries alt, source, license, consent, `placeholder` flag and replacement deadline in the CMS. No AI-generated people, no clinical stock, no medical-equipment hero imagery, no current-site YouTube sample video.
- Verification gates (spec §20): founding year, residence names/locations, Oracle status/rooms, Grove timeline, per-residence care types, direct vs partner services, Silver Roots/SAGE/Destination Retirement live features, contact details, photo consent are all **unconfirmed**. Seed data in this plan is development-only and must never be published to production without client confirmation.
- Non-goals (do not build): Silver Roots marketplace, live availability, online booking confirmation, payments, any accounts, care records, SAGE application UI, blog/news, live chat/chatbot, multi-language.

---

## Scope note

The spec describes a single website whose pages share one CMS, one visual system and one form system, so this is one plan. It is organised into six phases that each end with working, testable software. If you want to split work across sessions, cut at phase boundaries — each phase's tasks depend only on earlier phases.

## Conventions used throughout

- **Shell:** commands are PowerShell (Windows). Repo root is `C:\personal\dev\village60-new-website`. Package manager is `npm` (Node 22).
- **Tests:** unit/component tests live next to source as `*.test.ts(x)` and run with `npm test` (Vitest, jsdom). Browser/E2E/axe tests live in `e2e/*.spec.ts` and run with `npm run e2e` (Playwright). Async Server Components cannot be rendered by Vitest, so every route file `page.tsx` is a thin async fetcher that renders a synchronous `*View` component; views are what we unit test.
- **Commits:** one commit per task, conventional-commit style, after tests pass.
- **Imports:** `@/*` maps to `src/*`.
- **Next 16 specifics:** `params`, `searchParams`, `headers()`, `draftMode()` are Promises — always `await`. `revalidateTag(tag, 'max')` takes two arguments. Request middleware file is `proxy.ts` (not needed here; we use `next.config.ts` headers).
- **Zod 4 specifics:** import `* as z from 'zod'`; use `z.email()`, `z.iso.date()`, `z.flattenError(error)` (not `.flatten()`).

## File structure (locked in)

```
.
├── .env.example
├── .github/workflows/ci.yml
├── lighthouserc.json
├── next.config.ts
├── playwright.config.ts
├── vitest.config.mts
├── vitest.setup.ts
├── sanity.config.ts                  # Studio config (client component)
├── sanity.cli.ts                     # CLI + typegen config
├── schema.json                       # generated by `sanity schema extract` (gitignored)
├── scripts/
│   ├── seed.ts                       # dev dataset seed runner (uploads placeholder asset, commits transaction)
│   ├── seed-data.ts                  # dev dataset documents (deterministic _ids, pure, unit-tested)
│   └── placeholder-report.ts         # pre-launch media rights report
├── e2e/                              # Playwright specs
└── src/
    ├── app/
    │   ├── layout.tsx                # html lang + fonts only (shared by site and studio)
    │   ├── globals.css               # Tailwind v4 + @theme tokens + base styles
    │   ├── sitemap.ts, robots.ts
    │   ├── (site)/
    │   │   ├── layout.tsx            # chrome: SkipLink, Header, MobileActionBar, Footer, EnquiryPanel, Analytics
    │   │   ├── page.tsx, home-view.tsx            # Home
    │   │   ├── not-found.tsx, error.tsx
    │   │   ├── find-the-right-care/{page,view}.tsx
    │   │   ├── homes/{page,view}.tsx, homes/[slug]/{page,view}.tsx
    │   │   ├── oracle/{page,view}.tsx
    │   │   ├── living-and-care/{page,view}.tsx, living-and-care/[slug]/{page,view}.tsx
    │   │   ├── silver-roots/page.tsx, destination-retirement/page.tsx, sage/page.tsx, ecosystem-view.tsx
    │   │   ├── our-story/{page,view}.tsx, contact/{page,view}.tsx
    │   │   └── [legalSlug]/page.tsx  # privacy, terms, accessibility (allow-listed)
    │   ├── (studio)/
    │   │   ├── layout.tsx            # bare layout, no site chrome
    │   │   └── studio/[[...tool]]/page.tsx
    │   └── api/{draft-mode/enable,draft-mode/disable,revalidate}/route.ts
    ├── components/
    │   ├── ui/        Button, StatusBadge, Chip, Container, Section, Heading, Field, Breadcrumbs
    │   ├── site/      SkipLink, Header, MobileActionBar, Footer, ContactActions
    │   ├── media/     SanityImage, Gallery, VideoHero, StaticMap
    │   ├── content/   PortableText, FaqList, ResidenceCard, CareServiceCard, CapabilityList, StepList, SectionList, PageHero, CtaBand
    │   ├── forms/     EnquiryForm, EnquiryPanel, EnquiryProvider, EnquiryButton
    │   ├── seo/       JsonLd
    │   └── analytics/ Analytics
    ├── lib/
    │   ├── env.ts, contact.ts, content-status.ts, navigation.ts, routes.ts, site-settings.ts, seo.ts, maps.ts, analytics.ts
    │   ├── preview.ts, revalidation.ts   # pure helpers behind the draft-mode and webhook routes
    │   ├── design/palette.ts, design/contrast.ts
    │   └── forms/kinds.ts, definitions.ts, schemas.ts, state.ts, rate-limit.ts, email.ts, process.ts, submit.ts
    ├── sanity/
    │   ├── client.ts, fetch.ts, image.ts, queries.ts, structure.ts
    │   ├── types.ts                  # generated by `sanity typegen generate` (committed)
    │   └── schema/index.ts, schema/fields.ts, schema/objects/*.ts, schema/documents/*.ts
    └── test/fixtures.ts, test/contact-fixture.ts
```

**Content-model decisions (deviations from spec §14, deliberate):**
- Oracle and The Grove are `residence` documents (`isFlagship: true` for Oracle; `status: coming-soon` for Grove) because they have rooms, locations and galleries. `ecosystemOffering` therefore covers Silver Roots, Destination Retirement and SAGE only.
- Header/footer navigation is code-defined (`src/lib/navigation.ts`) because the route structure is code; contact details, hours, recipients, SEO defaults and all page copy are CMS-editable.
- "Media asset" is implemented as a reusable `mediaImage` object (Sanity image + rights fields) embedded wherever images appear, so rights travel with the image.

---

## Phase 0 — Foundations

### Task 1: Scaffold the Next.js app and test toolchain

**Files:**
- Create: Next.js scaffold via `create-next-app` (in repo root), `vitest.config.mts`, `vitest.setup.ts`, `playwright.config.ts`, `e2e/smoke.spec.ts`, `src/test/smoke.test.tsx`, `.env.example`
- Modify: `package.json` (scripts), `.gitignore`, `tsconfig.json` (include setup file)
- Move: `website.docx`, `website-extract.md` → `docs/source/`

**Interfaces:**
- Produces: working `npm run dev`, `npm test`, `npm run e2e`, `npm run typecheck`, `npm run lint` commands used by every later task.

- [ ] **Step 1: Move client source files out of the root (create-next-app requires an empty-ish directory)**

```powershell
cd C:\personal\dev\village60-new-website
New-Item -ItemType Directory -Force docs\source | Out-Null
Move-Item website.docx docs\source\website.docx
Move-Item website-extract.md docs\source\website-extract.md
```

- [ ] **Step 2: Scaffold Next.js in place**

```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes --disable-git
```

Expected: a `src/app` directory, `next.config.ts`, `package.json` with `next` `^16.4.x`. Open `next.config.ts`; if it contains `cacheComponents: true` or `reactCompiler: true`, delete those lines (we use classic static/ISR rendering).

- [ ] **Step 3: Initialise git and ignore heavy/generated files**

```powershell
git init -b main
Add-Content .gitignore "`n# project`n.env*.local`ndocs/source/*.docx`nschema.json`nreports/`nplaywright-report/`ntest-results/`n"
```

- [ ] **Step 4: Install test and tooling dependencies**

```powershell
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event vitest-axe vite-tsconfig-paths @playwright/test @axe-core/playwright
npx playwright install chromium
```

- [ ] **Step 5: Create `vitest.config.mts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
```

- [ ] **Step 6: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend(axeMatchers);
afterEach(() => cleanup());
```

Add `"vitest.setup.ts"` to the `include` array in `tsconfig.json`.

- [ ] **Step 7: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT ?? '3000';
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: process.env.CI ? 'npm run build && npm run start' : 'npm run dev',
    url: baseURL,
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
});
```

- [ ] **Step 8: Add scripts to `package.json`**

Replace the `"scripts"` block with:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "e2e": "playwright test",
  "typegen": "sanity schema extract --enforce-required-fields && sanity typegen generate",
  "seed": "tsx scripts/seed.ts",
  "report:placeholders": "tsx scripts/placeholder-report.ts"
}
```

(`sanity` and `tsx` are installed in Task 6; the scripts are declared now so the file is only touched once.)

- [ ] **Step 9: Write the toolchain smoke test `src/test/smoke.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

describe('test toolchain', () => {
  it('renders DOM, supports jest-dom and axe', async () => {
    const { container } = render(
      <main>
        <h1>Village 60 Plus</h1>
      </main>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Village 60 Plus');
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 10: Write `e2e/smoke.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('home responds and has a main landmark', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('main')).toBeVisible();
});
```

- [ ] **Step 11: Create `.env.example`**

```dotenv
# Public
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=

# Server only
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=            # seed script only, never on Vercel
SANITY_PREVIEW_SECRET=
SANITY_REVALIDATE_SECRET=
RESEND_API_KEY=
EMAIL_FROM="Village 60 Plus Website <website@village60plus.lk>"
FORM_FALLBACK_RECIPIENT=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 12: Run everything**

```powershell
npm run typecheck; npm run lint; npm test; npm run e2e
```

Expected: typecheck and lint clean; Vitest `1 passed`; Playwright `2 passed` (two projects).

- [ ] **Step 13: Commit**

```powershell
git add -A
git commit -m "chore: scaffold Next.js 16 app with Vitest, Playwright and axe toolchain"
```

---

### Task 2: Design tokens, fonts and base styles

**Files:**
- Create: `src/lib/design/palette.ts`, `src/lib/design/contrast.ts`, `src/lib/design/contrast.test.ts`
- Modify: `src/app/globals.css` (replace), `src/app/layout.tsx` (replace)

**Interfaces:**
- Produces: Tailwind utilities `bg-ivory text-charcoal bg-green text-pale-gold border-stone bg-sand bg-paper bg-night bg-mist text-bronze text-leaf text-error`, `font-display`, `font-sans`, `rounded-input rounded-card rounded-panel`, `shadow-panel`, breakpoints `sm md lg xl` = 600/900/1200/1440px, `max-w-site` (1280px), `max-w-prose-site` (68ch); CSS variables `--font-fraunces`, `--font-source-sans`; `PALETTE` constant; `contrastRatio(a, b)`.

- [ ] **Step 1: Write the failing palette test `src/lib/design/contrast.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { PALETTE } from './palette';

describe('Verandah palette contrast (WCAG 2.2 AA)', () => {
  it('body text on light surfaces is at least 4.5:1', () => {
    expect(contrastRatio(PALETTE.charcoal, PALETTE.ivory)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.charcoal, PALETTE.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.charcoal, PALETTE.sand)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.bronze, PALETTE.ivory)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.leaf, PALETTE.ivory)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.error, PALETTE.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it('text on dark surfaces is at least 4.5:1', () => {
    expect(contrastRatio(PALETTE.ivory, PALETTE.green)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.paleGold, PALETTE.green)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.ivory, PALETTE.night)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.paleGold, PALETTE.night)).toBeGreaterThanOrEqual(4.5);
  });

  it('documents why antique gold is decorative only', () => {
    // Spec rule: never gold body/small text on ivory. Bronze is the text-safe gold.
    expect(contrastRatio(PALETTE.gold, PALETTE.ivory)).toBeLessThan(4.5);
  });

  it('computes the canonical black/white ratio', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/lib/design
```

Expected: FAIL — cannot find module `./contrast` / `./palette`.

- [ ] **Step 3: Create `src/lib/design/palette.ts`**

```ts
/** Verandah palette — hex values are exact per spec §10. */
export const PALETTE = {
  ivory: '#F7F3EA',
  green: '#18352D',
  gold: '#A88A42',
  charcoal: '#20211F',
  paper: '#FFFDF8',
  sand: '#EDE6D6',
  stone: '#D9D1BF',
  bronze: '#6F5A24',
  paleGold: '#D4B86A',
  night: '#0F1F1B',
  mist: '#E4EBE3',
  leaf: '#3F6B4F',
  error: '#9B2C2C',
} as const;

export type PaletteKey = keyof typeof PALETTE;
```

- [ ] **Step 4: Create `src/lib/design/contrast.ts`**

```ts
function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.x contrast ratio between two hex colours (order-independent). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}
```

- [ ] **Step 5: Run the test**

```powershell
npx vitest run src/lib/design
```

Expected: PASS (4 tests).

- [ ] **Step 6: Replace `src/app/globals.css`**

```css
@import 'tailwindcss';

@theme {
  /* Colours — spec §10 */
  --color-ivory: #f7f3ea;
  --color-green: #18352d;
  --color-gold: #a88a42;
  --color-charcoal: #20211f;
  --color-paper: #fffdf8;
  --color-sand: #ede6d6;
  --color-stone: #d9d1bf;
  --color-bronze: #6f5a24;
  --color-pale-gold: #d4b86a;
  --color-night: #0f1f1b;
  --color-mist: #e4ebe3;
  --color-leaf: #3f6b4f;
  --color-error: #9b2c2c;

  /* Breakpoints — spec §11 (override Tailwind defaults) */
  --breakpoint-*: initial;
  --breakpoint-sm: 600px;
  --breakpoint-md: 900px;
  --breakpoint-lg: 1200px;
  --breakpoint-xl: 1440px;

  /* Layout */
  --container-site: 1280px;
  --container-prose-site: 68ch;

  /* Shape and elevation */
  --radius-input: 6px;
  --radius-card: 12px;
  --radius-panel: 20px;
  --shadow-panel: 0 8px 24px rgba(32, 33, 31, 0.08);

  /* Motion */
  --duration-fast: 150ms;
  --duration-menu: 250ms;
  --duration-panel: 400ms;
}

/* Fonts are injected as CSS variables on <html> by next/font, so they must be inline. */
@theme inline {
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-sans: var(--font-source-sans), system-ui, sans-serif;
}

@layer base {
  html {
    scroll-padding-bottom: 5rem; /* keep focused elements above the mobile action bar */
    scroll-behavior: smooth;
  }
  body {
    @apply bg-ivory text-charcoal font-sans antialiased;
    font-size: 17px;
    line-height: 1.6;
    text-wrap: pretty;
  }
  @media (min-width: 900px) {
    body {
      font-size: 18px;
    }
  }
  h1, h2, h3, h4 {
    @apply font-display;
    font-weight: 500;
    line-height: 1.15;
    text-wrap: balance;
  }
  h1 { font-size: 34px; }
  h2 { font-size: 30px; }
  h3 { font-size: 24px; }
  @media (min-width: 900px) {
    h1 { font-size: 48px; }
    h2 { font-size: 38px; }
    h3 { font-size: 28px; }
  }
  :focus-visible {
    outline: 3px solid var(--color-green);
    outline-offset: 3px;
  }
  .on-dark :focus-visible {
    outline-color: var(--color-pale-gold);
  }
  summary {
    cursor: pointer;
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@utility display-text {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(38px, 5vw, 60px);
  line-height: 1.05;
  text-wrap: balance;
}

@utility section-space {
  padding-block: 64px;
  @media (min-width: 600px) { padding-block: 96px; }
  @media (min-width: 1200px) { padding-block: 128px; }
}

@utility gutter {
  padding-inline: 20px;
  @media (min-width: 600px) { padding-inline: 24px; }
  @media (min-width: 1200px) { padding-inline: 32px; }
}

@utility visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 7: Replace `src/app/layout.tsx` (minimal; site chrome is added to `src/app/(site)/layout.tsx` in Phase 3, not here — the Studio shares this root layout)**

```tsx
import type { Metadata } from 'next';
import { Fraunces, Source_Sans_3 } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz'],
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
});

export const metadata: Metadata = {
  title: 'Village 60 Plus',
  description: 'Homes, care and support for later life in Sri Lanka.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-LK" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Delete `src/app/page.module.css` if present and replace `src/app/page.tsx` with a placeholder so the build passes:

```tsx
export default function HomePage() {
  return (
    <main className="gutter section-space">
      <h1>Village 60 Plus</h1>
    </main>
  );
}
```

- [ ] **Step 8: Verify build, tests and e2e**

```powershell
npm run build; npm test; npm run e2e
```

Expected: build succeeds (fonts download at build), all tests pass.

- [ ] **Step 9: Commit**

```powershell
git add -A
git commit -m "feat(design): add Verandah tokens, self-hosted fonts and base styles"
```

---

### Task 3: UI primitives — Button, StatusBadge, Chip, Container, Section, Heading

**Files:**
- Create: `src/lib/content-status.ts`, `src/lib/content-status.test.ts`, `src/components/ui/Button.tsx`, `src/components/ui/Button.test.tsx`, `src/components/ui/StatusBadge.tsx`, `src/components/ui/StatusBadge.test.tsx`, `src/components/ui/Chip.tsx`, `src/components/ui/Container.tsx`, `src/components/ui/Section.tsx`, `src/components/ui/Heading.tsx`, `src/lib/cn.ts`

**Interfaces:**
- Produces:
  - `CONTENT_STATUSES`, `type ContentStatus = 'available' | 'limited' | 'pilot' | 'coming-soon' | 'in-development' | 'planned'`, `statusLabel(s)`, `isOperating(s)`, `isFuture(s)`
  - `<Button variant="primary"|"secondary"|"text" size="md"|"lg" href?>` — renders `<a>` when `href` given, else `<button type="button">` unless `type` passed
  - `<StatusBadge status tone="light"|"dark" />`
  - `<Chip>` (small label), `<Container>` (max-w-site + gutter), `<Section tone="ivory"|"sand"|"paper"|"mist"|"green"|"night" id? aria-labelledby?>`, `<Heading as="h1"|"h2"|"h3" eyebrow?>`
  - `cn(...classes)` helper

- [ ] **Step 1: Write `src/lib/content-status.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { CONTENT_STATUSES, isFuture, isOperating, statusLabel } from './content-status';

describe('content status', () => {
  it('exposes the six spec labels verbatim', () => {
    expect(CONTENT_STATUSES.map((s) => s.label)).toEqual([
      'Available now',
      'Limited availability',
      'Pilot',
      'Coming soon',
      'In development',
      'Planned',
    ]);
  });
  it('maps values to labels', () => {
    expect(statusLabel('coming-soon')).toBe('Coming soon');
  });
  it('classifies operating vs future statuses', () => {
    expect(isOperating('available')).toBe(true);
    expect(isOperating('limited')).toBe(true);
    expect(isOperating('pilot')).toBe(false);
    expect(isFuture('coming-soon')).toBe(true);
    expect(isFuture('in-development')).toBe(true);
    expect(isFuture('planned')).toBe(true);
    expect(isFuture('available')).toBe(false);
  });
});
```

- [ ] **Step 2: Write `src/components/ui/Button.test.tsx` and `src/components/ui/StatusBadge.test.tsx`**

```tsx
// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a pill button with primary styling by default', () => {
    render(<Button>Call us</Button>);
    const button = screen.getByRole('button', { name: 'Call us' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toContain('rounded-full');
    expect(button.className).toContain('bg-green');
    expect(button.className).toContain('min-h-11'); // 44px touch target
  });

  it('renders an anchor when href is provided', () => {
    render(<Button href="tel:+94112504838" variant="secondary">Call</Button>);
    const link = screen.getByRole('link', { name: 'Call' });
    expect(link).toHaveAttribute('href', 'tel:+94112504838');
    expect(link.className).toContain('border-green');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Button variant="text">Learn more</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

```tsx
// src/components/ui/StatusBadge.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('shows the exact spec label', () => {
    render(<StatusBadge status="in-development" />);
    expect(screen.getByText('In development')).toBeInTheDocument();
  });
  it('uses text-safe colours on light and dark tones', () => {
    const { rerender } = render(<StatusBadge status="coming-soon" />);
    expect(screen.getByText('Coming soon').className).toContain('text-bronze');
    rerender(<StatusBadge status="coming-soon" tone="dark" />);
    expect(screen.getByText('Coming soon').className).toContain('text-pale-gold');
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```powershell
npx vitest run src/lib/content-status src/components/ui
```

Expected: FAIL — modules not found.

- [ ] **Step 4: Create `src/lib/cn.ts` and `src/lib/content-status.ts`**

```ts
// src/lib/cn.ts
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
```

```ts
// src/lib/content-status.ts
export const CONTENT_STATUSES = [
  { value: 'available', label: 'Available now' },
  { value: 'limited', label: 'Limited availability' },
  { value: 'pilot', label: 'Pilot' },
  { value: 'coming-soon', label: 'Coming soon' },
  { value: 'in-development', label: 'In development' },
  { value: 'planned', label: 'Planned' },
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number]['value'];

export function statusLabel(status: ContentStatus): string {
  return CONTENT_STATUSES.find((s) => s.value === status)?.label ?? status;
}

/** Operating now — safe to describe in present tense and to mark up as LocalBusiness/Service. */
export function isOperating(status: ContentStatus): boolean {
  return status === 'available' || status === 'limited';
}

/** Future-facing — must always carry a visible status label. */
export function isFuture(status: ContentStatus): boolean {
  return status === 'coming-soon' || status === 'in-development' || status === 'planned';
}
```

- [ ] **Step 5: Create the primitives**

```tsx
// src/components/ui/Button.tsx
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'text';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold no-underline transition-colors duration-(--duration-fast) min-h-11 focus-visible:outline-3';
const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-[17px]',
  lg: 'px-7 py-3.5 text-[18px]',
};
const variants: Record<Variant, string> = {
  primary: 'bg-green text-ivory hover:bg-night',
  secondary: 'border border-green text-green bg-transparent hover:bg-mist',
  text: 'text-green underline underline-offset-4 decoration-gold hover:decoration-green px-1',
};
/** Variants for use inside `.on-dark` sections. */
const darkVariants: Record<Variant, string> = {
  primary: 'bg-ivory text-green hover:bg-paper',
  secondary: 'border border-ivory text-ivory bg-transparent hover:bg-white/10',
  text: 'text-ivory underline underline-offset-4 decoration-pale-gold px-1',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  onDark?: boolean;
  className?: string;
  children: ReactNode;
};
type AnchorProps = CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>;
type ButtonProps = CommonProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = 'primary', size = 'md', onDark = false, className, children, ...rest } = props;
  const classes = cn(base, sizes[size], (onDark ? darkVariants : variants)[variant], className);

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, ...anchorRest } = rest as AnchorProps;
    const external = /^(https?:|tel:|mailto:)/.test(href);
    if (external) {
      return (
        <a href={href} className={classes} {...anchorRest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }
  const { type = 'button', ...buttonRest } = rest as ButtonProps;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
```

```tsx
// src/components/ui/StatusBadge.tsx
import { statusLabel, type ContentStatus } from '@/lib/content-status';
import { cn } from '@/lib/cn';

export function StatusBadge({ status, tone = 'light', className }: { status: ContentStatus; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-input border px-2.5 py-1 text-[14px] font-semibold leading-none',
        tone === 'light' ? 'border-stone bg-paper text-bronze' : 'border-pale-gold/40 bg-white/5 text-pale-gold',
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
```

```tsx
// src/components/ui/Chip.tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Chip({ children, tone = 'light', className }: { children: ReactNode; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-input px-2.5 py-1 text-[14px] font-semibold leading-none',
        tone === 'light' ? 'bg-mist text-green' : 'bg-white/10 text-ivory',
        className,
      )}
    >
      {children}
    </span>
  );
}
```

```tsx
// src/components/ui/Container.tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-site gutter', className)}>{children}</div>;
}
```

```tsx
// src/components/ui/Section.tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './Container';

export type SectionTone = 'ivory' | 'sand' | 'paper' | 'mist' | 'green' | 'night';

const tones: Record<SectionTone, string> = {
  ivory: 'bg-ivory text-charcoal',
  sand: 'bg-sand text-charcoal',
  paper: 'bg-paper text-charcoal',
  mist: 'bg-mist text-charcoal',
  green: 'bg-green text-ivory on-dark',
  night: 'bg-night text-ivory on-dark',
};

export function isDarkTone(tone: SectionTone): boolean {
  return tone === 'green' || tone === 'night';
}

export function Section({
  children,
  tone = 'ivory',
  id,
  labelledBy,
  className,
}: {
  children: ReactNode;
  tone?: SectionTone;
  id?: string;
  labelledBy?: string;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('section-space', tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}
```

```tsx
// src/components/ui/Heading.tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Heading({
  as: Tag = 'h2',
  id,
  eyebrow,
  children,
  onDark = false,
  className,
}: {
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('max-w-prose-site', className)}>
      {eyebrow && (
        <p className={cn('mb-3 text-[14px] font-semibold uppercase tracking-[0.08em]', onDark ? 'text-pale-gold' : 'text-bronze')}>
          {eyebrow}
        </p>
      )}
      <Tag id={id}>{children}</Tag>
    </div>
  );
}
```

- [ ] **Step 6: Run tests**

```powershell
npx vitest run src/lib/content-status src/components/ui
```

Expected: PASS (all tests).

- [ ] **Step 7: Commit**

```powershell
git add -A
git commit -m "feat(ui): add content status helpers and core primitives"
```

---

### Task 4: Contact helpers (tel / WhatsApp)

**Files:**
- Create: `src/lib/contact.ts`, `src/lib/contact.test.ts`

**Interfaces:**
- Produces:
  ```ts
  type SiteContact = { phone: string; phoneDisplay: string; whatsapp: string; email: string; responseTime: string };
  telHref(phone: string): string                 // 'tel:+94112504838'
  waMeNumber(phone: string): string              // '94741003994'
  whatsappMessage(context: string): string       // page-specific prefilled text
  whatsappHref(whatsapp: string, context: string): string
  mailtoHref(email: string): string
  ```

- [ ] **Step 1: Write `src/lib/contact.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { mailtoHref, telHref, waMeNumber, whatsappHref, whatsappMessage } from './contact';

describe('contact helpers', () => {
  it('builds tel: links from display-formatted numbers', () => {
    expect(telHref('+94 11 250 4838')).toBe('tel:+94112504838');
  });
  it('normalises WhatsApp numbers to digits without + or leading zeros', () => {
    expect(waMeNumber('+94 74 100 3994')).toBe('94741003994');
    expect(waMeNumber('0094741003994')).toBe('94741003994');
  });
  it('prefills a page-specific message', () => {
    expect(whatsappMessage('Oracle')).toBe("Hello Village 60 Plus, I'm enquiring about Oracle.");
  });
  it('builds an official wa.me link with URL-encoded text', () => {
    expect(whatsappHref('+94 74 100 3994', 'Serenity')).toBe(
      "https://wa.me/94741003994?text=Hello%20Village%2060%20Plus%2C%20I'm%20enquiring%20about%20Serenity.",
    );
  });
  it('builds mailto links', () => {
    expect(mailtoHref('hello@village60plus.lk')).toBe('mailto:hello@village60plus.lk');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/lib/contact
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/contact.ts`**

```ts
export type SiteContact = {
  /** E.164 or display-formatted; normalised by helpers. */
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  /** Human sentence, e.g. "within one working day". */
  responseTime: string;
};

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return `tel:${digits.startsWith('+') ? digits : `+${digits}`}`;
}

export function waMeNumber(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^0+/, '');
}

export function whatsappMessage(context: string): string {
  return `Hello Village 60 Plus, I'm enquiring about ${context}.`;
}

export function whatsappHref(whatsapp: string, context: string): string {
  return `https://wa.me/${waMeNumber(whatsapp)}?text=${encodeURIComponent(whatsappMessage(context))}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email.trim()}`;
}
```

- [ ] **Step 4: Run the test**

```powershell
npx vitest run src/lib/contact
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: add tel and WhatsApp contact helpers"
```

---

### Task 5: Site chrome — SkipLink, Header, MobileActionBar, Footer, ContactActions

**Files:**
- Create: `src/lib/navigation.ts`, `src/components/site/SkipLink.tsx`, `src/components/site/ContactActions.tsx`, `src/components/site/Header.tsx`, `src/components/site/Header.test.tsx`, `src/components/site/MobileActionBar.tsx`, `src/components/site/MobileActionBar.test.tsx`, `src/components/site/Footer.tsx`, `src/components/site/Footer.test.tsx`

**Interfaces:**
- Consumes: `SiteContact`, `telHref`, `whatsappHref` (Task 4); `Button`, `Container` (Task 3).
- Produces:
  - `PRIMARY_NAV`, `MORE_NAV`, `LEGAL_NAV: NavItem[]` with `type NavItem = { label: string; href: string }`
  - `<SkipLink />` → `<a href="#main">Skip to main content</a>`
  - `<ContactActions contact context size? onDark? />` → Call (`tel:`) + WhatsApp (`wa.me`) buttons with `data-track="call_click"|"whatsapp_click"`
  - `<Header contact />`, `<MobileActionBar contact context />`, `<Footer contact legalName foundedYear? address />`
  - Header renders a slot `enquiryTrigger?: ReactNode` so Task 19 can insert the Enquire button without changing Header tests.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/site/Header.test.tsx
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';
import { contactFixture } from '@/test/contact-fixture';

describe('Header', () => {
  it('shows primary navigation, a More menu, the phone number and WhatsApp', async () => {
    const { container } = render(<Header contact={contactFixture} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Find the Right Care' })).toHaveAttribute('href', '/find-the-right-care');
    expect(within(nav).getByRole('link', { name: 'Oracle' })).toHaveAttribute('href', '/oracle');
    expect(within(nav).getByText('More')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Call \+94 11 250 4838/ })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', expect.stringContaining('https://wa.me/94741003994'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

```tsx
// src/components/site/MobileActionBar.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MobileActionBar } from './MobileActionBar';
import { contactFixture } from '@/test/contact-fixture';

describe('MobileActionBar', () => {
  it('renders Call and WhatsApp with page context', () => {
    render(<MobileActionBar contact={contactFixture} context="Tranquility" />);
    expect(screen.getByRole('link', { name: 'Call' })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Tranquility'));
  });
});
```

```tsx
// src/components/site/Footer.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';
import { contactFixture } from '@/test/contact-fixture';

describe('Footer', () => {
  it('lists legal links, contact details and the legal name', () => {
    render(<Footer contact={contactFixture} legalName="Village 60 Plus (Pvt) Ltd" address="133/19 Nawala Road, Narahenpita, Colombo 05" />);
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
    expect(screen.getByText(/Village 60 Plus \(Pvt\) Ltd/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: contactFixture.email })).toHaveAttribute('href', `mailto:${contactFixture.email}`);
  });
  it('omits the founding year when unconfirmed', () => {
    render(<Footer contact={contactFixture} legalName="Village 60 Plus" address="Colombo" />);
    expect(screen.queryByText(/Established/)).not.toBeInTheDocument();
  });
});
```

Create the shared fixture `src/test/contact-fixture.ts`:

```ts
import type { SiteContact } from '@/lib/contact';

export const contactFixture: SiteContact = {
  phone: '+94112504838',
  phoneDisplay: '+94 11 250 4838',
  whatsapp: '+94741003994',
  email: 'hello@example.com',
  responseTime: 'within one working day',
};
```

- [ ] **Step 2: Run to verify failures**

```powershell
npx vitest run src/components/site
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create `src/lib/navigation.ts`**

```ts
export type NavItem = { label: string; href: string };

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Find the Right Care', href: '/find-the-right-care' },
  { label: 'Our Homes', href: '/homes' },
  { label: 'Living & Care', href: '/living-and-care' },
  { label: 'Oracle', href: '/oracle' },
  { label: 'Silver Roots', href: '/silver-roots' },
];

export const MORE_NAV: NavItem[] = [
  { label: 'Destination Retirement', href: '/destination-retirement' },
  { label: 'SAGE', href: '/sage' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Contact', href: '/contact' },
];

export const LEGAL_NAV: NavItem[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
];
```

- [ ] **Step 4: Create the components**

```tsx
// src/components/site/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main"
      className="visually-hidden focus:not-visually-hidden focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-input focus:bg-green focus:px-4 focus:py-3 focus:text-ivory"
    >
      Skip to main content
    </a>
  );
}
```

Add to `globals.css` (inside `@layer base` is fine, after `.visually-hidden`):

```css
@utility not-visually-hidden {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

```tsx
// src/components/site/ContactActions.tsx
import { Button } from '@/components/ui/Button';
import { telHref, whatsappHref, type SiteContact } from '@/lib/contact';

export function ContactActions({
  contact,
  context,
  onDark = false,
  size = 'md',
  showNumber = true,
  className,
}: {
  contact: SiteContact;
  context: string;
  onDark?: boolean;
  size?: 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}) {
  return (
    <div className={className ?? 'flex flex-wrap gap-3'}>
      <Button href={telHref(contact.phone)} variant="primary" size={size} onDark={onDark} data-track="call_click">
        {showNumber ? `Call ${contact.phoneDisplay}` : 'Call'}
      </Button>
      <Button href={whatsappHref(contact.whatsapp, context)} variant="secondary" size={size} onDark={onDark} data-track="whatsapp_click" target="_blank" rel="noopener noreferrer">
        WhatsApp
      </Button>
    </div>
  );
}
```

```tsx
// src/components/site/Header.tsx
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { MORE_NAV, PRIMARY_NAV } from '@/lib/navigation';
import { telHref, whatsappHref, type SiteContact } from '@/lib/contact';

export function Header({ contact, enquiryTrigger }: { contact: SiteContact; enquiryTrigger?: ReactNode }) {
  return (
    <header className="border-b border-stone bg-ivory">
      <Container className="flex min-h-[72px] items-center justify-between gap-6 py-3">
        <Link href="/" className="font-display text-[22px] font-semibold text-green no-underline">
          Village 60 Plus
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="py-2 font-semibold text-charcoal no-underline hover:text-green">
              {item.label}
            </Link>
          ))}
          <details className="group relative">
            <summary className="list-none py-2 font-semibold text-charcoal hover:text-green [&::-webkit-details-marker]:hidden">
              More
            </summary>
            <ul className="absolute right-0 top-full z-20 mt-2 min-w-56 rounded-card border border-stone bg-paper p-2 shadow-panel transition-opacity duration-(--duration-menu)">
              {MORE_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block rounded-input px-3 py-2.5 text-charcoal no-underline hover:bg-mist">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>

        <div className="flex items-center gap-3">
          <a href={telHref(contact.phone)} className="hidden items-center font-semibold text-green no-underline md:inline-flex" data-track="call_click">
            Call {contact.phoneDisplay}
          </a>
          <a
            href={whatsappHref(contact.whatsapp, 'Village 60 Plus')}
            className="hidden items-center rounded-full border border-green px-4 py-2 font-semibold text-green no-underline hover:bg-mist md:inline-flex"
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp_click"
          >
            WhatsApp
          </a>
          {enquiryTrigger}
          <details className="lg:hidden">
            <summary className="list-none rounded-input border border-stone px-3 py-2 font-semibold [&::-webkit-details-marker]:hidden">Menu</summary>
            <nav aria-label="Mobile" className="absolute inset-x-0 top-[72px] z-20 border-b border-stone bg-paper p-4">
              <ul className="flex flex-col gap-1">
                {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-input px-3 py-3 text-charcoal no-underline hover:bg-mist">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
```

```tsx
// src/components/site/MobileActionBar.tsx
import { telHref, whatsappHref, type SiteContact } from '@/lib/contact';

export function MobileActionBar({ contact, context }: { contact: SiteContact; context: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-px border-t border-stone bg-stone md:hidden" role="region" aria-label="Quick contact">
      <a href={telHref(contact.phone)} className="flex min-h-14 items-center justify-center bg-green font-semibold text-ivory no-underline" data-track="call_click">
        Call
      </a>
      <a
        href={whatsappHref(contact.whatsapp, context)}
        className="flex min-h-14 items-center justify-center bg-paper font-semibold text-green no-underline"
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
      >
        WhatsApp
      </a>
    </div>
  );
}
```

```tsx
// src/components/site/Footer.tsx
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { LEGAL_NAV, MORE_NAV, PRIMARY_NAV } from '@/lib/navigation';
import { mailtoHref, telHref, whatsappHref, type SiteContact } from '@/lib/contact';

export function Footer({
  contact,
  legalName,
  address,
  foundedYear,
  openingHours,
}: {
  contact: SiteContact;
  legalName: string;
  address: string;
  foundedYear?: number | null;
  openingHours?: string | null;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-green pb-24 text-ivory md:pb-0">
      <Container className="grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="font-display text-[24px] text-ivory">Village 60 Plus</p>
          <p className="mt-2 text-ivory/80">Live well. Age exceptionally.</p>
          {foundedYear ? <p className="mt-4 text-[14px] text-pale-gold">Established {foundedYear} · Sri Lanka</p> : null}
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2">
            {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ivory/90 no-underline hover:text-pale-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <address className="not-italic">
          <p className="whitespace-pre-line">{address}</p>
          <p className="mt-3">
            <a href={telHref(contact.phone)} className="text-ivory no-underline hover:text-pale-gold" data-track="call_click">
              {contact.phoneDisplay}
            </a>
          </p>
          <p>
            <a href={whatsappHref(contact.whatsapp, 'Village 60 Plus')} className="text-ivory no-underline hover:text-pale-gold" target="_blank" rel="noopener noreferrer" data-track="whatsapp_click">
              WhatsApp {contact.whatsapp}
            </a>
          </p>
          <p>
            <a href={mailtoHref(contact.email)} className="text-ivory no-underline hover:text-pale-gold">
              {contact.email}
            </a>
          </p>
          {openingHours ? <p className="mt-3 text-ivory/80">{openingHours}</p> : null}
          <p className="mt-1 text-ivory/80">We aim to respond {contact.responseTime}.</p>
        </address>
      </Container>
      <div className="border-t border-ivory/15">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-5 text-[14px] text-ivory/80">
          <p>
            © {year} {legalName}
          </p>
          <ul className="flex gap-5">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ivory/80 no-underline hover:text-pale-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Run tests**

```powershell
npx vitest run src/components/site
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add -A
git commit -m "feat(site): add skip link, header, mobile action bar and footer"
```

---

## Phase 1 — CMS: Sanity Studio, schema, data layer, dev seed

**Outcome:** an embedded Studio at `/studio` with the full content model from spec §14, generated TypeScript types for every GROQ query, a draft-aware `sanityFetch` wrapper, preview and revalidation routes, and a deterministic development dataset. Nothing in this phase renders marketing pages yet; Phase 2–4 consume the exports listed under each task's **Interfaces**.

**Phase 1 decisions (in addition to the content-model decisions above):**
- **Care service ↔ residence is one-directional.** `residence.careTypes` references `careService`; a care service's "participating residences" is derived in GROQ with `references(^._id)`. Editors maintain the relationship in one place.
- **Statuses are never defaulted.** `statusField()` has no `initialValue`, so an editor must choose a label; nothing silently becomes "Available now".
- **Compliance flag blocks publishing.** The `editorial` object fails validation when `requiresComplianceReview` is true and `reviewStatus` is not `approved`. Sanity blocks publish on validation errors, which implements spec §14 "explicit review flag before publication" without a workflow plugin.
- **Preview uses a shared secret, not the Presentation tool.** `/api/draft-mode/enable?secret=…&slug=/homes/serenity` turns on Next.js draft mode; `sanityFetch` then reads the `drafts` perspective with the read token. Visual editing/stega is deliberately not enabled (keeps client JS minimal; spec §18).
- **Cache tags convention:** list data is tagged with the document `_type` (`residence`), detail data with `type:slug` (`residence:serenity`), settings with `siteSettings`, sitemap data with `sitemap`. `tagsForWebhook()` maps a Sanity webhook payload onto these tags.
- **Seed is development-only.** `scripts/seed.ts` refuses to run against `production` unless `ALLOW_PRODUCTION_SEED=yes`. Every seeded document is flagged `requiresComplianceReview: true` with `reviewStatus: 'draft'`, so even if copied to production it cannot be re-published from the Studio without an explicit approval.

**Things to confirm during implementation (fallbacks are given inline):** Sanity CLI picking up `.env.local` for `schema extract`/`typegen`; typegen resolving nested `${FRAGMENT}` interpolations; the `SanityImageSource` type export path in `@sanity/image-url` v2; `tsx --env-file`.

### Task 6: Install Sanity, embed the Studio, add the env loader and route groups

**Files:**
- Create: `sanity.config.ts`, `sanity.cli.ts`, `src/sanity/schema/index.ts`, `src/sanity/structure.ts`, `src/app/(studio)/layout.tsx`, `src/app/(studio)/studio/[[...tool]]/page.tsx`, `src/app/(site)/layout.tsx`, `src/lib/env.ts`, `src/lib/env.test.ts`, `.env.local` (untracked)
- Move: `src/app/page.tsx` → `src/app/(site)/page.tsx`
- Modify: `vitest.setup.ts`, `eslint.config.mjs`, `.env.example`

**Interfaces:**
- Produces: `requireEnv(name, value?)`, `getPublicEnv()` → `{ siteUrl, sanityProjectId, sanityDataset, gaId, mapsKey }`, `getServerEnv()` → lazy getters `sanityReadToken, previewSecret, revalidateSecret, resendApiKey, emailFrom, fallbackRecipient, upstashUrl, upstashToken`; `SINGLETON_TYPES`; working `/studio`.

- [ ] **Step 1: Create the Sanity project (human step, one-time)**

Run interactively (it opens a browser login):

```powershell
npx sanity@latest init --bare
```

Choose **Create new project** → name `Village 60 Plus` → dataset name `development` (private). The command prints the project ID; nothing is written to the repo because of `--bare`. Then in [sanity.io/manage](https://www.sanity.io/manage) for that project:

1. **Datasets** → add `production` (private). Leave it empty for now.
2. **API → Tokens** → create `website-read` with role **Viewer** → this is `SANITY_API_READ_TOKEN`. Create `seed-write` with role **Editor** → this is `SANITY_API_WRITE_TOKEN` (local only; never added to Vercel).
3. **API → CORS origins** → add `http://localhost:3000` with *Allow credentials* ticked. (Add the Vercel preview and production origins when they exist.)

- [ ] **Step 2: Install Sanity packages**

```powershell
npm install sanity next-sanity @sanity/client @sanity/image-url @sanity/vision @portabletext/react styled-components
npm install -D tsx
```

Expected versions (verified 12 Oct 2026): `sanity` 6.18.x, `next-sanity` 13.3.x, `@sanity/client` 8.9.x, `@sanity/image-url` 2.1.x, `@sanity/vision` 6.18.x, `@portabletext/react` 8.0.x, `styled-components` 6.5.x (required peer of `sanity`).

- [ ] **Step 3: Create `.env.local` from the example and fill in Sanity values**

```powershell
Copy-Item .env.example .env.local
```

Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=development`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`. Generate the two secrets:

```powershell
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"   # SANITY_PREVIEW_SECRET
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"   # SANITY_REVALIDATE_SECRET
```

Append one line to `.env.example` under `# Server only` so the seed guard is documented:

```dotenv
ALLOW_PRODUCTION_SEED=            # must be literally "yes" to seed the production dataset
```

- [ ] **Step 4: Write the failing env test `src/lib/env.test.ts`**

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublicEnv, getServerEnv, requireEnv } from './env';

describe('env', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('requireEnv throws an error that names the missing variable', () => {
    expect(() => requireEnv('MISSING_VAR', undefined)).toThrow('MISSING_VAR');
    expect(() => requireEnv('EMPTY_VAR', '')).toThrow('EMPTY_VAR');
  });

  it('requireEnv returns the value when present', () => {
    expect(requireEnv('X', 'abc')).toBe('abc');
  });

  it('getPublicEnv falls back to localhost for the site URL and development for the dataset', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '');
    const env = getPublicEnv();
    expect(env.siteUrl).toBe('http://localhost:3000');
    expect(env.sanityDataset).toBe('development');
    expect(env.sanityProjectId).toBe('testproject'); // set in vitest.setup.ts
  });

  it('getServerEnv is lazy: constructing it never throws, reading a missing secret does', () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const server = getServerEnv();
    expect(() => server.resendApiKey).toThrow('RESEND_API_KEY');
    expect(server.upstashUrl).toBeNull(); // optional, never throws
  });
});
```

- [ ] **Step 5: Run to verify it fails**

```powershell
npx vitest run src/lib/env
```

Expected: FAIL — cannot find module `./env`.

- [ ] **Step 6: Create `src/lib/env.ts`**

```ts
/**
 * Environment access. Public values are read with literal `process.env.NEXT_PUBLIC_*`
 * references so Next.js can inline them; server values are lazy getters so importing
 * this module (e.g. in Vitest) never throws — only reading a missing secret does.
 */
export function requireEnv(name: string, value: string | undefined = process.env[name]): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getPublicEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    sanityProjectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
    sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
    gaId: process.env.NEXT_PUBLIC_GA_ID || null,
    mapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || null,
  };
}

export function getServerEnv() {
  return {
    get sanityReadToken() {
      return requireEnv('SANITY_API_READ_TOKEN');
    },
    get previewSecret() {
      return requireEnv('SANITY_PREVIEW_SECRET');
    },
    get revalidateSecret() {
      return requireEnv('SANITY_REVALIDATE_SECRET');
    },
    get resendApiKey() {
      return requireEnv('RESEND_API_KEY');
    },
    get emailFrom() {
      return requireEnv('EMAIL_FROM');
    },
    get fallbackRecipient() {
      return requireEnv('FORM_FALLBACK_RECIPIENT');
    },
    get upstashUrl() {
      return process.env.UPSTASH_REDIS_REST_URL || null;
    },
    get upstashToken() {
      return process.env.UPSTASH_REDIS_REST_TOKEN || null;
    },
  };
}
```

- [ ] **Step 7: Give tests a Sanity project id — append to `vitest.setup.ts`**

```ts
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= 'testproject';
process.env.NEXT_PUBLIC_SANITY_DATASET ??= 'test';
```

Run `npx vitest run src/lib/env` → PASS (4 tests).

- [ ] **Step 8: Create the Studio config, CLI config, schema index and structure placeholder**

```ts
// sanity.config.ts
'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schema';
import { SINGLETON_TYPES, structure } from './src/sanity/structure';

export const apiVersion = '2026-02-01';

export default defineConfig({
  name: 'village60plus',
  title: 'Village 60 Plus',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
  document: {
    // Singletons: hide from the global "create new" menu and remove destructive actions.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter((t) => !SINGLETON_TYPES.includes(t.templateId)) : prev,
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType)
        ? prev.filter(({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : prev,
  },
});
```

```ts
// sanity.cli.ts
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  },
  schemaExtraction: { enabled: true },
  typegen: {
    path: './src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: './src/sanity/types.ts',
    overloadClientMethods: true,
  },
});
```

```ts
// src/sanity/schema/index.ts  (objects and documents are added in Tasks 7 and 8)
import type { SchemaTypeDefinition } from 'sanity';

export const schemaTypes: SchemaTypeDefinition[] = [];
```

```ts
// src/sanity/structure.ts  (replaced with the full desk structure in Task 8)
import type { StructureResolver } from 'sanity/structure';

export const SINGLETON_TYPES: string[] = ['siteSettings'];

export const structure: StructureResolver = (S) => S.list().title('Content').items(S.documentTypeListItems());
```

- [ ] **Step 9: Create the route groups**

```powershell
New-Item -ItemType Directory -Force "src/app/(site)", "src/app/(studio)/studio/[[...tool]]" | Out-Null
Move-Item src/app/page.tsx "src/app/(site)/page.tsx"
```

```tsx
// src/app/(site)/layout.tsx  — site chrome (SkipLink, Header, MobileActionBar, Footer, EnquiryPanel) is wired in Phase 3
import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

```tsx
// src/app/(studio)/layout.tsx — intentionally bare: the Studio must not inherit site chrome
import type { ReactNode } from 'react';

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

```tsx
// src/app/(studio)/studio/[[...tool]]/page.tsx
import { NextStudio } from 'next-sanity/studio';
import config from '../../../../../sanity.config';

export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 10: Ignore the generated types file in ESLint**

In `eslint.config.mjs`, add `"src/sanity/types.ts"` to the existing `globalIgnores([...])` array (next to `.next/**`). The file does not exist yet; Task 8 generates it.

- [ ] **Step 11: Verify build, Studio and tests**

```powershell
npm run typecheck; npm run lint; npm test; npm run build
```

Expected: all clean; the build output lists `○ /studio/[[...tool]]` as static. Then:

```powershell
npm run dev
```

Open `http://localhost:3000/studio`, sign in with the account from Step 1. Expected: the Studio loads with an empty "Content" pane (no schema types yet) and no console errors. Open `http://localhost:3000/` — the Phase 0 placeholder still renders. Stop the dev server.

- [ ] **Step 12: Commit**

```powershell
git add -A
git commit -m "feat(cms): embed Sanity Studio, add env loader and site/studio route groups"
```

---

### Task 7: Schema objects — rich text, media rights, SEO, editorial review and content blocks

**Files:**
- Create: `src/sanity/schema/fields.ts`, `src/sanity/schema/fields.test.ts`, `src/sanity/schema/objects/blockContent.ts`, `objects/mediaImage.ts`, `objects/mediaImage.test.ts`, `objects/seo.ts`, `objects/editorial.ts`, `objects/address.ts`, `objects/link.ts`, `objects/capability.ts`, `objects/step.ts`, `objects/contentSection.ts`, `objects/room.ts`, `objects/heroVideo.ts`, `objects/index.ts`
- Modify: `src/sanity/schema/index.ts`

**Interfaces:**
- Produces: `statusField({ required?, description? })`, `slugField(source?)`, `seoField()`, `editorialField()`, `DOCUMENT_GROUPS`; object types `blockContent`, `mediaImage`, `seo`, `editorial`, `address`, `link`, `capability`, `step`, `contentSection`, `room`, `heroVideo`; `objectTypes`; constants `REVIEW_STATUSES`, `LICENSES`, `CONSENT_STATES`, `PROVISIONS`.
- Schema files use **relative imports** (`../../lib/...`), never `@/`, because the Sanity CLI bundles them without `tsconfig` paths.

- [ ] **Step 1: Write the failing tests**

```ts
// src/sanity/schema/fields.test.ts
import { describe, expect, it } from 'vitest';
import { CONTENT_STATUSES } from '../../lib/content-status';
import { statusField } from './fields';

describe('statusField', () => {
  it('offers exactly the six spec labels, in spec order, with no default', () => {
    const field = statusField();
    expect(field.name).toBe('status');
    expect(field.options?.list).toEqual(CONTENT_STATUSES.map((s) => ({ title: s.label, value: s.value })));
    expect(field.initialValue).toBeUndefined();
  });

  it('can be made optional for secondary content blocks', () => {
    expect(statusField({ required: false }).validation).toBeUndefined();
  });
});
```

```ts
// src/sanity/schema/objects/mediaImage.test.ts
import { describe, expect, it } from 'vitest';
import { mediaImage } from './mediaImage';

describe('mediaImage', () => {
  it('is an image type carrying the rights fields required by spec §12', () => {
    expect(mediaImage.type).toBe('image');
    expect(mediaImage.options?.hotspot).toBe(true);
    const names = mediaImage.fields?.map((f) => f.name) ?? [];
    expect(names).toEqual(['alt', 'caption', 'source', 'license', 'licenseNotes', 'consent', 'consentRecord', 'placeholder', 'replaceBy']);
  });
});
```

- [ ] **Step 2: Run to verify failures**

```powershell
npx vitest run src/sanity
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create `src/sanity/schema/fields.ts`**

```ts
import { defineField } from 'sanity';
import { CONTENT_STATUSES } from '../../lib/content-status';

export const DOCUMENT_GROUPS = [
  { name: 'content', title: 'Content', default: true },
  { name: 'seo', title: 'SEO' },
  { name: 'editorial', title: 'Review' },
];

/** Spec §13 status labels. Deliberately no initialValue: editors must choose. */
export function statusField({ required = true, description }: { required?: boolean; description?: string } = {}) {
  return defineField({
    name: 'status',
    title: 'Status',
    type: 'string',
    description:
      description ??
      'Shown to visitors wherever this could be mistaken for a current offering. Pick the honest label; never leave a future service as "Available now".',
    options: {
      list: CONTENT_STATUSES.map((s) => ({ title: s.label, value: s.value })),
      layout: 'radio',
    },
    validation: required ? (Rule) => Rule.required() : undefined,
  });
}

export function slugField(source = 'name') {
  return defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    description: 'Part of the public URL. Change only with a redirect in place.',
    options: { source, maxLength: 64 },
    validation: (Rule) => Rule.required(),
  });
}

export const seoField = () => defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' });

export const editorialField = () =>
  defineField({ name: 'editorial', title: 'Editorial review', type: 'editorial', group: 'editorial' });
```

- [ ] **Step 4: Create the object types**

```ts
// src/sanity/schema/objects/blockContent.ts
import { defineArrayMember, defineField, defineType } from 'sanity';

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) =>
                  Rule.required().uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
});
```

```ts
// src/sanity/schema/objects/mediaImage.ts
import { defineField, defineType } from 'sanity';

export const LICENSES = [
  { title: 'Client-owned (written confirmation on file)', value: 'client-owned' },
  { title: 'Licensed stock (model release on file)', value: 'licensed-stock' },
  { title: 'Creative Commons', value: 'creative-commons' },
  { title: 'Public domain', value: 'public-domain' },
  { title: 'Other (explain in notes)', value: 'other' },
];

export const CONSENT_STATES = [
  { title: 'Not required (no identifiable people)', value: 'not-required' },
  { title: 'Obtained (record filed)', value: 'obtained' },
  { title: 'Pending — do not publish', value: 'pending' },
];

type MediaImageValue = { placeholder?: boolean; replaceBy?: string; consent?: string };

export const mediaImage = defineType({
  name: 'mediaImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe what the image shows for people who cannot see it. Required.',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Photographer, agency or "Client — <residence>, <date>".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'license',
      title: 'License',
      type: 'string',
      options: { list: LICENSES },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'licenseNotes', title: 'License notes / expiry', type: 'string' }),
    defineField({
      name: 'consent',
      title: 'Consent for identifiable people',
      type: 'string',
      options: { list: CONSENT_STATES, layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'consentRecord', title: 'Consent record reference', type: 'string' }),
    defineField({
      name: 'placeholder',
      title: 'Temporary placeholder',
      type: 'boolean',
      initialValue: false,
      description: 'Tick for any image that must be replaced before or after launch (spec §12).',
    }),
    defineField({
      name: 'replaceBy',
      title: 'Replace by',
      type: 'date',
      hidden: ({ parent }) => !(parent as MediaImageValue | undefined)?.placeholder,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: MediaImageValue | undefined) => {
      if (value?.placeholder && !value.replaceBy) return 'Placeholder images need a replacement deadline.';
      if (value?.consent === 'pending') return 'Consent is pending — this image cannot be published yet.';
      return true;
    }),
  preview: {
    select: { media: 'asset', title: 'alt', placeholder: 'placeholder' },
    prepare: ({ media, title, placeholder }) => ({ media, title, subtitle: placeholder ? 'PLACEHOLDER' : undefined }),
  },
});
```

```ts
// src/sanity/schema/objects/seo.ts
import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'description', title: 'Meta description', type: 'text', rows: 3, validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'canonical', title: 'Canonical URL override', type: 'url' }),
    defineField({ name: 'image', title: 'Social image', type: 'mediaImage' }),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
  ],
});
```

```ts
// src/sanity/schema/objects/editorial.ts
import { defineField, defineType } from 'sanity';

export const REVIEW_STATUSES = [
  { title: 'Draft', value: 'draft' },
  { title: 'Internal review', value: 'internal-review' },
  { title: 'Client / compliance review', value: 'client-review' },
  { title: 'Approved', value: 'approved' },
  { title: 'Archived', value: 'archived' },
];

type EditorialValue = { reviewStatus?: string; requiresComplianceReview?: boolean };

export const editorial = defineType({
  name: 'editorial',
  title: 'Editorial review',
  type: 'object',
  fields: [
    defineField({
      name: 'reviewStatus',
      title: 'Review status',
      type: 'string',
      options: { list: REVIEW_STATUSES, layout: 'radio' },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requiresComplianceReview',
      title: 'Contains clinical, privacy, licensing or future-product claims',
      type: 'boolean',
      initialValue: false,
      description: 'When ticked, this document cannot be published until the review status is Approved (spec §14).',
    }),
    defineField({ name: 'reviewNotes', title: 'Review notes', type: 'text', rows: 3 }),
    defineField({ name: 'verifiedOn', title: 'Facts verified on', type: 'date' }),
  ],
  validation: (Rule) =>
    Rule.custom((value: EditorialValue | undefined) =>
      value?.requiresComplianceReview && value.reviewStatus !== 'approved'
        ? 'Flagged for compliance review: set the review status to Approved before publishing.'
        : true,
    ),
});
```

```ts
// src/sanity/schema/objects/address.ts
import { defineField, defineType } from 'sanity';

export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({ name: 'line1', title: 'Address line 1', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'line2', title: 'Address line 2', type: 'string' }),
    defineField({ name: 'city', title: 'City / town', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'district', title: 'District', type: 'string' }),
    defineField({ name: 'postcode', title: 'Postcode', type: 'string' }),
    defineField({ name: 'country', title: 'Country', type: 'string', initialValue: 'Sri Lanka' }),
    defineField({ name: 'landmarks', title: 'Nearby landmarks', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'location', title: 'Map location', type: 'geopoint' }),
    defineField({ name: 'directionsUrl', title: 'Directions link (Google Maps)', type: 'url' }),
    defineField({ name: 'visitingNotes', title: 'Visiting details', type: 'text', rows: 3 }),
  ],
});
```

```ts
// src/sanity/schema/objects/link.ts
import { defineField, defineType } from 'sanity';

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      validation: (Rule) => Rule.required().uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
    }),
  ],
});
```

```ts
// src/sanity/schema/objects/capability.ts
import { defineField, defineType } from 'sanity';
import { statusField } from '../fields';

/** Spec §8.5: distinguish included services from paid or partner-arranged services. */
export const PROVISIONS = [
  { title: 'Included', value: 'included' },
  { title: 'Optional extra (quoted separately)', value: 'optional-extra' },
  { title: 'Arranged through a partner', value: 'partner-arranged' },
];

export const capability = defineType({
  name: 'capability',
  title: 'Service / capability',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'provision',
      title: 'How it is provided',
      type: 'string',
      options: { list: PROVISIONS, layout: 'radio' },
      initialValue: 'included',
      validation: (Rule) => Rule.required(),
    }),
    statusField({ description: 'Shown next to the item. Use Pilot / Planned / In development for anything not live.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
```

```ts
// src/sanity/schema/objects/step.ts
import { defineField, defineType } from 'sanity';

export const step = defineType({
  name: 'step',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
  ],
});
```

```ts
// src/sanity/schema/objects/contentSection.ts
import { defineField, defineType } from 'sanity';
import { statusField } from '../fields';

export const SECTION_TONES = ['ivory', 'sand', 'paper', 'mist', 'green', 'night'];

export const contentSection = defineType({
  name: 'contentSection',
  title: 'Content section',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
    defineField({ name: 'image', title: 'Image', type: 'mediaImage' }),
    defineField({
      name: 'tone',
      title: 'Background',
      type: 'string',
      options: { list: SECTION_TONES },
      initialValue: 'ivory',
      description: 'Dark tones (green, night) are reserved for Oracle, the SAGE hero, the footer and one story quote band.',
    }),
    defineField({ name: 'cta', title: 'Call to action', type: 'link' }),
    statusField({ required: false, description: 'Optional. Set when this section describes something not yet live.' }),
  ],
  preview: { select: { title: 'heading', subtitle: 'eyebrow' } },
});
```

```ts
// src/sanity/schema/objects/room.ts
import { defineField, defineType } from 'sanity';

export const room = defineType({
  name: 'room',
  title: 'Room',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'house', title: 'House / wing', type: 'string' }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 2 }),
    defineField({
      name: 'facts',
      title: 'Verified facts',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Only facts confirmed by the client (size, aspect, bathroom). No pricing.',
    }),
    defineField({ name: 'image', title: 'Image', type: 'mediaImage' }),
  ],
  preview: { select: { title: 'name', subtitle: 'house', media: 'image' } },
});
```

```ts
// src/sanity/schema/objects/heroVideo.ts
import { defineField, defineType } from 'sanity';

export const heroVideo = defineType({
  name: 'heroVideo',
  title: 'Hero video',
  type: 'object',
  description: 'Muted, under 4 MB, with a poster image. Not shown to reduced-motion or data-saver visitors (spec §18).',
  fields: [
    defineField({ name: 'video', title: 'MP4 file (max 4 MB)', type: 'file', options: { accept: 'video/mp4' } }),
    defineField({ name: 'poster', title: 'Poster image', type: 'mediaImage', validation: (Rule) => Rule.required() }),
    defineField({ name: 'captions', title: 'Captions (.vtt, required if the video contains speech)', type: 'file', options: { accept: 'text/vtt' } }),
    defineField({
      name: 'description',
      title: 'Accessible description',
      type: 'string',
      description: 'One sentence describing what the video shows.',
      validation: (Rule) => Rule.required(),
    }),
  ],
});
```

```ts
// src/sanity/schema/objects/index.ts
import { address } from './address';
import { blockContent } from './blockContent';
import { capability } from './capability';
import { contentSection } from './contentSection';
import { editorial } from './editorial';
import { heroVideo } from './heroVideo';
import { link } from './link';
import { mediaImage } from './mediaImage';
import { room } from './room';
import { seo } from './seo';
import { step } from './step';

export const objectTypes = [blockContent, mediaImage, seo, editorial, address, link, capability, step, contentSection, room, heroVideo];
```

Update `src/sanity/schema/index.ts`:

```ts
import type { SchemaTypeDefinition } from 'sanity';
import { objectTypes } from './objects';

export const schemaTypes: SchemaTypeDefinition[] = [...objectTypes];
```

- [ ] **Step 5: Run tests and extract the schema**

```powershell
npx vitest run src/sanity
npx sanity schema extract --enforce-required-fields
```

Expected: Vitest PASS (3 tests); `schema.json` written at the repo root (gitignored). If the CLI reports a missing project id, it did not load `.env.local` — run with the variables in the shell instead: `$env:NEXT_PUBLIC_SANITY_PROJECT_ID='<id>'; $env:NEXT_PUBLIC_SANITY_DATASET='development'; npx sanity schema extract --enforce-required-fields`, and change the `typegen` script in `package.json` to `"npx --node-options=--env-file=.env.local sanity schema extract --enforce-required-fields && npx --node-options=--env-file=.env.local sanity typegen generate"`.

- [ ] **Step 6: Commit**

```powershell
git add -A
git commit -m "feat(cms): add shared schema objects with media rights and editorial review"
```

---

### Task 8: Document types, desk structure and TypeGen

**Files:**
- Create: `src/lib/routes.ts`, `src/lib/routes.test.ts`, `src/lib/forms/kinds.ts`, `src/sanity/schema/documents/siteSettings.ts`, `documents/residence.ts`, `documents/careService.ts`, `documents/ecosystemOffering.ts`, `documents/teamMember.ts`, `documents/testimonial.ts`, `documents/faq.ts`, `documents/page.ts`, `documents/index.ts`, `src/sanity/schema/index.test.ts`, `src/sanity/types.ts` (generated)
- Modify: `src/sanity/schema/index.ts`, `src/sanity/structure.ts`

**Interfaces:**
- Produces:
  - `RESIDENCE_SLUGS`, `ORACLE_SLUG`, `CARE_SERVICE_SLUGS`, `OFFERING_SLUGS`, `LEGAL_SLUGS`, `PAGE_SLUGS`, `FAQ_PAGE_KEYS`, `residencePath(slug)`, `careServicePath(slug)`, `offeringPath(slug)` (`src/lib/routes.ts`) — consumed by schema validation, seed tests, sitemap, `generateStaticParams` and the legal-page allow-list.
  - `FORM_KINDS`, `type FormKind`, `formKindLabel(kind)` (`src/lib/forms/kinds.ts`) — Phase 3 builds `definitions.ts` on this.
  - Document types `siteSettings`, `residence`, `careService`, `ecosystemOffering`, `teamMember`, `testimonial`, `faq`, `page`; `documentTypes`; full `structure`.
  - Generated `src/sanity/types.ts` (committed) — Task 9 queries get `<NAME>Result` types from it.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/routes.test.ts
import { describe, expect, it } from 'vitest';
import { CARE_SERVICE_SLUGS, LEGAL_SLUGS, PAGE_SLUGS, RESIDENCE_SLUGS, residencePath } from './routes';

describe('routes', () => {
  it('lists the six residences from the spec sitemap', () => {
    expect([...RESIDENCE_SLUGS]).toEqual(['tranquility', 'serenity', 'house-on-the-hill', 'enchanted-fields', 'oracle', 'the-grove']);
  });
  it('gives Oracle its single canonical URL and other homes a /homes/ URL', () => {
    expect(residencePath('oracle')).toBe('/oracle');
    expect(residencePath('the-grove')).toBe('/homes/the-grove');
  });
  it('lists five care services and three legal pages', () => {
    expect(CARE_SERVICE_SLUGS).toHaveLength(5);
    expect([...LEGAL_SLUGS]).toEqual(['privacy', 'terms', 'accessibility']);
    expect(PAGE_SLUGS).toEqual(expect.arrayContaining([...LEGAL_SLUGS, 'home', 'contact']));
  });
});
```

```ts
// src/sanity/schema/index.test.ts
import { describe, expect, it } from 'vitest';
import { CONTENT_STATUSES } from '../../lib/content-status';
import { schemaTypes } from './index';

type FieldLike = { name: string; options?: { list?: unknown } };
type TypeLike = { name: string; type: string; fields?: FieldLike[] };

describe('schema registry', () => {
  it('registers every content type from spec §14 plus shared objects', () => {
    const names = schemaTypes.map((t) => t.name).sort();
    expect(names).toEqual(
      [
        // documents
        'siteSettings', 'residence', 'careService', 'ecosystemOffering', 'teamMember', 'testimonial', 'faq', 'page',
        // objects
        'blockContent', 'mediaImage', 'seo', 'editorial', 'address', 'link', 'capability', 'step', 'contentSection', 'room', 'heroVideo',
      ].sort(),
    );
  });

  it('uses the shared status list on every type that has a status field', () => {
    const expected = CONTENT_STATUSES.map((s) => ({ title: s.label, value: s.value }));
    const withStatus = (schemaTypes as TypeLike[]).filter((t) => t.fields?.some((f) => f.name === 'status'));
    expect(withStatus.map((t) => t.name).sort()).toEqual(['capability', 'careService', 'contentSection', 'ecosystemOffering', 'residence']);
    for (const type of withStatus) {
      expect(type.fields?.find((f) => f.name === 'status')?.options?.list).toEqual(expected);
    }
  });

  it('gives every public document SEO and editorial review fields', () => {
    for (const name of ['residence', 'careService', 'ecosystemOffering', 'page']) {
      const type = (schemaTypes as TypeLike[]).find((t) => t.name === name);
      const fieldNames = type?.fields?.map((f) => f.name) ?? [];
      expect(fieldNames, name).toEqual(expect.arrayContaining(['seo', 'editorial']));
    }
  });
});
```

- [ ] **Step 2: Run to verify failures**

```powershell
npx vitest run src/lib/routes src/sanity/schema
```

Expected: FAIL.

- [ ] **Step 3: Create `src/lib/routes.ts` and `src/lib/forms/kinds.ts`**

```ts
// src/lib/routes.ts — the spec §6 sitemap as data. Pure; safe to import from schema files (relative) and from Node scripts.
export const RESIDENCE_SLUGS = ['tranquility', 'serenity', 'house-on-the-hill', 'enchanted-fields', 'oracle', 'the-grove'] as const;
export type ResidenceSlug = (typeof RESIDENCE_SLUGS)[number];
export const ORACLE_SLUG: ResidenceSlug = 'oracle';

export const CARE_SERVICE_SLUGS = ['independent-living', 'residential-care', 'respite-care', 'recovery', 'rehabilitation'] as const;
export type CareServiceSlug = (typeof CARE_SERVICE_SLUGS)[number];

export const OFFERING_SLUGS = ['silver-roots', 'destination-retirement', 'sage'] as const;
export type OfferingSlug = (typeof OFFERING_SLUGS)[number];

export const LEGAL_SLUGS = ['privacy', 'terms', 'accessibility'] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

/** `page` documents: static pages whose copy is CMS-managed. */
export const PAGE_SLUGS = ['home', 'find-the-right-care', 'homes', 'living-and-care', 'our-story', 'contact', ...LEGAL_SLUGS] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];

/** Where an FAQ may appear (spec §14 "Applicable pages"). */
export const FAQ_PAGE_KEYS = [
  'home', 'find-the-right-care', 'homes', 'oracle', 'living-and-care', 'silver-roots', 'destination-retirement', 'sage', 'our-story', 'contact',
] as const;

/** Oracle's only canonical URL is /oracle (spec §6). */
export function residencePath(slug: string): string {
  return slug === ORACLE_SLUG ? '/oracle' : `/homes/${slug}`;
}
export function careServicePath(slug: string): string {
  return `/living-and-care/${slug}`;
}
export function offeringPath(slug: string): string {
  return `/${slug}`;
}
export function pagePath(slug: string): string {
  return slug === 'home' ? '/' : `/${slug}`;
}
```

```ts
// src/lib/forms/kinds.ts — the six form contexts from spec §9. Subjects contain no personal or health data.
export const FORM_KINDS = [
  { value: 'general', label: 'General enquiry', subject: 'Website enquiry' },
  { value: 'find-care', label: 'Find the Right Care', subject: 'Find the Right Care enquiry' },
  { value: 'oracle-visit', label: 'Oracle private visit', subject: 'Oracle private visit request' },
  { value: 'grove-interest', label: 'The Grove — register interest', subject: 'The Grove interest registration' },
  { value: 'silver-roots-partner', label: 'Silver Roots partner interest', subject: 'Silver Roots partner interest' },
  { value: 'destination-retirement', label: 'Destination Retirement enquiry', subject: 'Destination Retirement enquiry' },
] as const;

export type FormKind = (typeof FORM_KINDS)[number]['value'];

export function formKindLabel(kind: FormKind): string {
  return FORM_KINDS.find((k) => k.value === kind)?.label ?? kind;
}
```

- [ ] **Step 4: Create the document types**

```ts
// src/sanity/schema/documents/siteSettings.ts
import { defineArrayMember, defineField, defineType } from 'sanity';
import { FORM_KINDS } from '../../../lib/forms/kinds';

const E164 = /^\+\d{9,15}$/;

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'forms', title: 'Form routing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'brandName', title: 'Brand name', type: 'string', group: 'brand', initialValue: 'Village 60 Plus', validation: (Rule) => Rule.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'brand', initialValue: 'Live well. Age exceptionally.' }),
    defineField({ name: 'legalName', title: 'Legal organisation name', type: 'string', group: 'brand', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'foundedYear',
      title: 'Founding year',
      type: 'number',
      group: 'brand',
      description: 'Leave empty until the client confirms 2008 vs 2009 (spec §20). Empty hides "Established …" everywhere.',
      validation: (Rule) => Rule.integer().min(1990).max(new Date().getFullYear()),
    }),
    defineField({ name: 'phone', title: 'Primary phone (E.164, e.g. +94112504838)', type: 'string', group: 'contact', validation: (Rule) => Rule.required().regex(E164, { name: 'E.164 number' }) }),
    defineField({ name: 'phoneDisplay', title: 'Phone as displayed', type: 'string', group: 'contact', validation: (Rule) => Rule.required() }),
    defineField({ name: 'whatsapp', title: 'WhatsApp number (E.164)', type: 'string', group: 'contact', validation: (Rule) => Rule.required().regex(E164, { name: 'E.164 number' }) }),
    defineField({ name: 'email', title: 'Public email', type: 'string', group: 'contact', validation: (Rule) => Rule.required().email() }),
    defineField({ name: 'openingHours', title: 'Contact hours', type: 'string', group: 'contact', description: 'e.g. "Monday to Saturday, 9am–6pm"' }),
    defineField({ name: 'responseTime', title: 'Expected response time', type: 'string', group: 'contact', initialValue: 'within one working day', validation: (Rule) => Rule.required() }),
    defineField({ name: 'headOffice', title: 'Head office', type: 'address', group: 'contact' }),
    defineField({ name: 'emergencyNotice', title: 'Emergency disclaimer', type: 'text', rows: 2, group: 'contact', description: 'Wording must be approved by the client and counsel (spec §19).' }),
    defineField({ name: 'socialLinks', title: 'Social links', type: 'array', group: 'contact', of: [defineArrayMember({ type: 'link' })] }),
    defineField({
      name: 'formRecipients',
      title: 'Form recipients',
      type: 'array',
      group: 'forms',
      description: 'Which inbox receives each form. "General enquiry" is the fallback for any kind without its own row.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'formRecipient',
          fields: [
            defineField({ name: 'kind', title: 'Form', type: 'string', options: { list: FORM_KINDS.map((k) => ({ title: k.label, value: k.value })) }, validation: (Rule) => Rule.required() }),
            defineField({ name: 'to', title: 'Recipient emails', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.required().min(1) }),
          ],
          preview: { select: { title: 'kind', to: 'to' }, prepare: ({ title, to }) => ({ title, subtitle: (to as string[] | undefined)?.join(', ') }) },
        }),
      ],
    }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
```

```ts
// src/sanity/schema/documents/residence.ts
import { defineArrayMember, defineField, defineType } from 'sanity';
import { isFuture, type ContentStatus } from '../../../lib/content-status';
import { FORM_KINDS } from '../../../lib/forms/kinds';
import { RESIDENCE_SLUGS } from '../../../lib/routes';
import { DOCUMENT_GROUPS, editorialField, seoField, slugField, statusField } from '../fields';

export const residence = defineType({
  name: 'residence',
  title: 'Residence',
  type: 'document',
  groups: DOCUMENT_GROUPS,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    {
      ...slugField('name'),
      group: 'content',
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          (RESIDENCE_SLUGS as readonly string[]).includes(slug?.current ?? '') ? true : `Slug must be one of: ${RESIDENCE_SLUGS.join(', ')}`,
        ),
    },
    { ...statusField(), group: 'content' },
    defineField({ name: 'isFlagship', title: 'Flagship (Oracle)', type: 'boolean', group: 'content', initialValue: false, description: 'Uses the Oracle template at /oracle instead of the shared residence template.' }),
    defineField({ name: 'shortLocation', title: 'Short location', type: 'string', group: 'content', description: 'As shown on cards, e.g. "Narahenpita, Colombo 05". Verified locations only.', validation: (Rule) => Rule.required() }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.required().max(240) }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'mediaImage', group: 'content' }),
    defineField({ name: 'description', title: 'Introduction', type: 'blockContent', group: 'content' }),
    defineField({ name: 'careTypes', title: 'Care and living options offered here', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'careService' }] })] }),
    defineField({ name: 'audienceFit', title: 'Who this home suits', type: 'array', group: 'content', of: [{ type: 'string' }] }),
    defineField({ name: 'atmosphere', title: 'Atmosphere and daily life', type: 'blockContent', group: 'content' }),
    defineField({ name: 'rooms', title: 'Rooms', type: 'array', group: 'content', of: [defineArrayMember({ type: 'room' })] }),
    defineField({ name: 'sharedSpaces', title: 'Shared spaces', type: 'array', group: 'content', of: [{ type: 'string' }] }),
    defineField({ name: 'careAndSupport', title: 'Care and support at this location', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })] }),
    defineField({ name: 'everydayLife', title: 'Meals, housekeeping, activities and family visits', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })] }),
    defineField({ name: 'gallery', title: 'Gallery', type: 'array', group: 'content', of: [defineArrayMember({ type: 'mediaImage' })], description: 'Only images verified to show this residence.' }),
    defineField({ name: 'team', title: 'Team', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'teamMember' }] })] }),
    defineField({ name: 'address', title: 'Address and visiting', type: 'address', group: 'content' }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({
      name: 'formKind',
      title: 'Enquiry form used on this page',
      type: 'string',
      group: 'content',
      options: { list: FORM_KINDS.map((k) => ({ title: k.label, value: k.value })) },
      initialValue: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'comingSoonNote',
      title: 'Coming-soon note',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown instead of operational sections when the status is Coming soon / In development / Planned.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const status = (context.document as { status?: ContentStatus } | undefined)?.status;
          return status && isFuture(status) && !value ? 'Future residences need an honest coming-soon note.' : true;
        }),
    }),
    seoField(),
    editorialField(),
  ],
  preview: { select: { title: 'name', subtitle: 'shortLocation', media: 'heroImage' } },
  orderings: [{ title: 'Name', name: 'name', by: [{ field: 'name', direction: 'asc' }] }],
});
```

```ts
// src/sanity/schema/documents/careService.ts
import { defineArrayMember, defineField, defineType } from 'sanity';
import { FORM_KINDS } from '../../../lib/forms/kinds';
import { CARE_SERVICE_SLUGS } from '../../../lib/routes';
import { DOCUMENT_GROUPS, editorialField, seoField, slugField, statusField } from '../fields';

export const careService = defineType({
  name: 'careService',
  title: 'Care service',
  type: 'document',
  groups: DOCUMENT_GROUPS,
  description: 'Participating residences are derived from each residence\'s "Care and living options" field.',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    {
      ...slugField('name'),
      group: 'content',
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          (CARE_SERVICE_SLUGS as readonly string[]).includes(slug?.current ?? '') ? true : `Slug must be one of: ${CARE_SERVICE_SLUGS.join(', ')}`,
        ),
    },
    { ...statusField(), group: 'content' },
    defineField({ name: 'summary', title: 'Summary (plain language)', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.required().max(240) }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'mediaImage', group: 'content' }),
    defineField({ name: 'whoItSuits', title: 'Who this is for', type: 'array', group: 'content', of: [{ type: 'string' }] }),
    defineField({ name: 'typicalDuration', title: 'Typical duration', type: 'string', group: 'content', description: 'e.g. "Two to six weeks". Leave empty if not applicable.' }),
    defineField({ name: 'included', title: 'What is included', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })], description: 'Mark each item as included, optional extra or partner-arranged.' }),
    defineField({ name: 'process', title: 'Enquiry and assessment process', type: 'array', group: 'content', of: [defineArrayMember({ type: 'step' })] }),
    defineField({ name: 'notRightFit', title: 'If this is not the right fit', type: 'text', rows: 3, group: 'content', description: 'What the team does when Village 60 Plus cannot help (spec §8.6).' }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({ name: 'formKind', title: 'Enquiry form used on this page', type: 'string', group: 'content', options: { list: FORM_KINDS.map((k) => ({ title: k.label, value: k.value })) }, initialValue: 'general', validation: (Rule) => Rule.required() }),
    seoField(),
    editorialField(),
  ],
  preview: { select: { title: 'name', subtitle: 'status', media: 'heroImage' } },
});
```

```ts
// src/sanity/schema/documents/ecosystemOffering.ts
import { defineArrayMember, defineField, defineType } from 'sanity';
import { FORM_KINDS } from '../../../lib/forms/kinds';
import { OFFERING_SLUGS } from '../../../lib/routes';
import { DOCUMENT_GROUPS, editorialField, seoField, slugField, statusField } from '../fields';

export const ecosystemOffering = defineType({
  name: 'ecosystemOffering',
  title: 'Ecosystem offering',
  type: 'document',
  groups: DOCUMENT_GROUPS,
  description: 'Silver Roots, Destination Retirement and SAGE. Oracle and The Grove are residences.',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    {
      ...slugField('name'),
      group: 'content',
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          (OFFERING_SLUGS as readonly string[]).includes(slug?.current ?? '') ? true : `Slug must be one of: ${OFFERING_SLUGS.join(', ')}`,
        ),
    },
    { ...statusField(), group: 'content' },
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'content' }),
    defineField({ name: 'distinction', title: 'One-sentence distinction from Village 60 Plus', type: 'string', group: 'content', validation: (Rule) => Rule.required().max(200) }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.required().max(300) }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'mediaImage', group: 'content' }),
    defineField({ name: 'heroTone', title: 'Hero background', type: 'string', group: 'content', options: { list: ['ivory', 'night'], layout: 'radio' }, initialValue: 'ivory', description: 'Only SAGE may use the dark hero.' }),
    defineField({ name: 'currentCapabilities', title: 'Approved capabilities (live now)', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })] }),
    defineField({ name: 'plannedCapabilities', title: 'Planned capabilities', type: 'array', group: 'content', of: [defineArrayMember({ type: 'capability' })], description: 'Each item must carry Pilot / Coming soon / In development / Planned.' }),
    defineField({ name: 'howItWorks', title: 'How it works', type: 'array', group: 'content', of: [defineArrayMember({ type: 'step' })], validation: (Rule) => Rule.max(3) }),
    defineField({
      name: 'benefitGroups',
      title: 'Benefits by audience',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'benefitGroup',
          fields: [
            defineField({ name: 'audience', title: 'Audience', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'points', title: 'Points', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.required().min(1) }),
          ],
          preview: { select: { title: 'audience' } },
        }),
      ],
    }),
    defineField({ name: 'sections', title: 'Additional sections', type: 'array', group: 'content', of: [defineArrayMember({ type: 'contentSection' })] }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({ name: 'formKind', title: 'Enquiry form used on this page', type: 'string', group: 'content', options: { list: FORM_KINDS.map((k) => ({ title: k.label, value: k.value })) }, initialValue: 'general', validation: (Rule) => Rule.required() }),
    defineField({ name: 'ctaLabel', title: 'Primary call-to-action label', type: 'string', group: 'content', initialValue: 'Enquire' }),
    seoField(),
    editorialField(),
  ],
  preview: { select: { title: 'name', subtitle: 'status', media: 'heroImage' } },
});
```

```ts
// src/sanity/schema/documents/teamMember.ts
import { defineField, defineType } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'credentials', title: 'Credentials', type: 'array', of: [{ type: 'string' }], description: 'Verified qualifications and registrations only.' }),
    defineField({ name: 'bio', title: 'Biography', type: 'blockContent' }),
    defineField({ name: 'image', title: 'Photo', type: 'mediaImage' }),
    defineField({ name: 'approvedForPublication', title: 'Approved for publication (consent on file)', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});
```

```ts
// src/sanity/schema/documents/testimonial.ts
import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (Rule) => Rule.required().max(400) }),
    defineField({ name: 'displayName', title: 'Display name (first name or approved name)', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'relationship', title: 'Relationship', type: 'string', description: 'e.g. "Daughter of a resident"', validation: (Rule) => Rule.required() }),
    defineField({ name: 'residence', title: 'Residence', type: 'reference', to: [{ type: 'residence' }] }),
    defineField({ name: 'consentRecord', title: 'Consent record reference', type: 'string', description: 'Where the signed consent is filed.', validation: (Rule) => Rule.required() }),
    defineField({ name: 'consentDate', title: 'Consent date', type: 'date', validation: (Rule) => Rule.required() }),
    defineField({ name: 'approved', title: 'Approved for publication', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'displayName', subtitle: 'relationship' } },
});
```

```ts
// src/sanity/schema/documents/faq.ts
import { defineField, defineType } from 'sanity';
import { FAQ_PAGE_KEYS } from '../../../lib/routes';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required().max(160) }),
    defineField({ name: 'answer', title: 'Answer', type: 'blockContent', validation: (Rule) => Rule.required() }),
    defineField({ name: 'pages', title: 'Applicable pages', type: 'array', of: [{ type: 'string' }], options: { list: [...FAQ_PAGE_KEYS] } }),
    defineField({ name: 'reviewDate', title: 'Next review date', type: 'date' }),
  ],
  preview: { select: { title: 'question' } },
});
```

```ts
// src/sanity/schema/documents/page.ts
import { defineArrayMember, defineField, defineType } from 'sanity';
import { PAGE_SLUGS } from '../../../lib/routes';
import { DOCUMENT_GROUPS, editorialField, seoField, slugField } from '../fields';

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: DOCUMENT_GROUPS,
  description: 'Copy for fixed pages (home, hubs, story, contact, legal). Structure is code; words are here.',
  fields: [
    defineField({ name: 'title', title: 'Title (H1)', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    {
      ...slugField('title'),
      group: 'content',
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          (PAGE_SLUGS as readonly string[]).includes(slug?.current ?? '') ? true : `Slug must be one of: ${PAGE_SLUGS.join(', ')}`,
        ),
    },
    defineField({ name: 'intro', title: 'Intro sentence', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'mediaImage', group: 'content' }),
    defineField({ name: 'heroVideo', title: 'Hero video (home only)', type: 'heroVideo', group: 'content' }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', group: 'content', of: [defineArrayMember({ type: 'contentSection' })] }),
    defineField({ name: 'body', title: 'Body (legal pages)', type: 'blockContent', group: 'content' }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', group: 'content', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })] }),
    defineField({ name: 'lastReviewed', title: 'Last reviewed (legal pages)', type: 'date', group: 'content' }),
    seoField(),
    editorialField(),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
```

```ts
// src/sanity/schema/documents/index.ts
import { careService } from './careService';
import { ecosystemOffering } from './ecosystemOffering';
import { faq } from './faq';
import { page } from './page';
import { residence } from './residence';
import { siteSettings } from './siteSettings';
import { teamMember } from './teamMember';
import { testimonial } from './testimonial';

export const documentTypes = [siteSettings, residence, careService, ecosystemOffering, teamMember, testimonial, faq, page];
```

Update `src/sanity/schema/index.ts`:

```ts
import type { SchemaTypeDefinition } from 'sanity';
import { documentTypes } from './documents';
import { objectTypes } from './objects';

export const schemaTypes: SchemaTypeDefinition[] = [...objectTypes, ...documentTypes];
```

- [ ] **Step 5: Replace `src/sanity/structure.ts` with the real desk structure**

```ts
import type { StructureResolver } from 'sanity/structure';

export const SINGLETON_TYPES: string[] = ['siteSettings'];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('residence').title('Residences'),
      S.documentTypeListItem('careService').title('Living & care services'),
      S.documentTypeListItem('ecosystemOffering').title('Silver Roots, Destination Retirement, SAGE'),
      S.documentTypeListItem('page').title('Pages'),
      S.divider(),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('teamMember').title('Team'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
    ]);
```

- [ ] **Step 6: Run tests, then generate types**

```powershell
npx vitest run src/lib/routes src/sanity/schema
npm run typegen
npm run typecheck
```

Expected: Vitest PASS (6 tests). `npm run typegen` writes `schema.json` and `src/sanity/types.ts` (it will say "0 queries" for now — queries arrive in Task 9). Typecheck clean. If `tsc` complains about the spread-with-override pattern on `slugField`/`statusField` (`{ ...slugField('name'), group, validation }`), wrap the object in `defineField({...})` to restore the typed `Rule` parameter.

- [ ] **Step 7: Check the Studio**

```powershell
npm run dev
```

Open `/studio`. Expected: left pane shows *Site settings*, then Residences, Living & care services, …; the global **+** (create) menu does **not** list Site settings; opening *Site settings* shows the Brand / Contact / Form routing / SEO tabs; creating a Residence shows the Content / SEO / Review tabs and the six status radios with none pre-selected. Stop the dev server.

- [ ] **Step 8: Commit**

```powershell
git add -A
git commit -m "feat(cms): add document types, desk structure and generated Sanity types"
```

---

### Task 9: Data layer — client, draft-aware fetch, image URLs, GROQ queries, preview and revalidation routes

**Files:**
- Create: `src/sanity/client.ts`, `src/sanity/fetch.ts`, `src/sanity/image.ts`, `src/sanity/image.test.ts`, `src/sanity/queries.ts`, `src/lib/site-settings.ts`, `src/lib/site-settings.test.ts`, `src/lib/preview.ts`, `src/lib/preview.test.ts`, `src/lib/revalidation.ts`, `src/lib/revalidation.test.ts`, `src/app/api/draft-mode/enable/route.ts`, `src/app/api/draft-mode/disable/route.ts`, `src/app/api/revalidate/route.ts`, `src/test/fixtures.ts`
- Modify: `src/sanity/types.ts` (regenerated)

**Interfaces:**
- Produces:
  - `client`, `apiVersion` (`src/sanity/client.ts`)
  - `sanityFetch(query, { params?, tags?, revalidate? })` — request-scoped, draft-aware; `fetchPublished(query, params?, tags?)` — for `generateStaticParams`/`sitemap.ts` (no request scope); `DEFAULT_REVALIDATE = 3600`
  - `urlFor(source)` → `@sanity/image-url` builder with `auto('format')` preset
  - Queries: `SITE_SETTINGS_QUERY`, `PAGE_QUERY($slug)`, `RESIDENCES_QUERY`, `RESIDENCE_QUERY($slug)`, `CARE_SERVICES_QUERY`, `CARE_SERVICE_QUERY($slug)`, `OFFERINGS_QUERY`, `OFFERING_QUERY($slug)`, `TEAM_QUERY`, `FAQS_FOR_PAGE_QUERY($page)`, `SITEMAP_QUERY`, `SLUGS_QUERY($type)`; result types `<NAME>Result` in `src/sanity/types.ts`
  - `type SiteSettings`, `toSiteContact(settings)`, `recipientsFor(settings, kind, fallback)`, `formatAddress(address)` (`src/lib/site-settings.ts`)
  - `resolvePreviewRequest(url, secret)`, `docTag(type, slug?)`, `tagsForWebhook(body)`
  - Fixtures: `siteSettingsFixture`, `imageFixture(alt)` (`src/test/fixtures.ts`)

- [ ] **Step 1: Write the failing tests**

```ts
// src/sanity/image.test.ts
import { describe, expect, it } from 'vitest';
import { urlFor } from './image';

describe('urlFor', () => {
  it('builds a Sanity CDN URL with auto format and the requested crop', () => {
    const url = urlFor({ _type: 'image', asset: { _type: 'reference', _ref: 'image-abc123-1200x800-jpg' } })
      .width(600)
      .height(400)
      .fit('crop')
      .url();
    expect(url).toContain('https://cdn.sanity.io/images/testproject/test/abc123-1200x800.jpg');
    expect(url).toContain('w=600');
    expect(url).toContain('h=400');
    expect(url).toContain('fit=crop');
    expect(url).toContain('auto=format');
  });
});
```

```ts
// src/lib/preview.test.ts
import { describe, expect, it } from 'vitest';
import { resolvePreviewRequest } from './preview';

const SECRET = 'correct-horse-battery-staple';

describe('resolvePreviewRequest', () => {
  it('rejects a missing or wrong secret with 401', () => {
    expect(resolvePreviewRequest(new URL('http://x/api/draft-mode/enable'), SECRET)).toEqual({ ok: false, status: 401 });
    expect(resolvePreviewRequest(new URL('http://x/api/draft-mode/enable?secret=nope'), SECRET)).toEqual({ ok: false, status: 401 });
  });
  it('rejects when the server has no secret configured', () => {
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}`), undefined)).toEqual({ ok: false, status: 401 });
  });
  it('only redirects to same-origin paths', () => {
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}&slug=https://evil.example`), SECRET)).toEqual({ ok: false, status: 400 });
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}&slug=//evil.example`), SECRET)).toEqual({ ok: false, status: 400 });
  });
  it('defaults to the home page and otherwise honours the slug', () => {
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}`), SECRET)).toEqual({ ok: true, redirectTo: '/' });
    expect(resolvePreviewRequest(new URL(`http://x/?secret=${SECRET}&slug=/homes/serenity`), SECRET)).toEqual({ ok: true, redirectTo: '/homes/serenity' });
  });
});
```

```ts
// src/lib/revalidation.test.ts
import { describe, expect, it } from 'vitest';
import { docTag, tagsForWebhook } from './revalidation';

describe('cache tags', () => {
  it('formats list and detail tags', () => {
    expect(docTag('residence')).toBe('residence');
    expect(docTag('residence', 'serenity')).toBe('residence:serenity');
  });
  it('maps a residence webhook to its list, detail and sitemap tags', () => {
    expect(tagsForWebhook({ _type: 'residence', slug: { current: 'serenity' } })).toEqual(
      expect.arrayContaining(['residence', 'residence:serenity', 'sitemap', 'careService']),
    );
  });
  it('maps site settings to a single tag', () => {
    expect(tagsForWebhook({ _type: 'siteSettings' })).toEqual(['siteSettings']);
  });
  it('fans referenced documents out to everything that embeds them', () => {
    expect(tagsForWebhook({ _type: 'faq' })).toEqual(expect.arrayContaining(['faq', 'residence', 'careService', 'ecosystemOffering', 'page']));
  });
  it('returns nothing for an unknown payload', () => {
    expect(tagsForWebhook({})).toEqual([]);
  });
});
```

```ts
// src/lib/site-settings.test.ts
import { describe, expect, it } from 'vitest';
import { siteSettingsFixture } from '@/test/fixtures';
import { formatAddress, recipientsFor, toSiteContact } from './site-settings';

describe('site settings helpers', () => {
  it('maps settings to the SiteContact shape used by the chrome', () => {
    expect(toSiteContact(siteSettingsFixture)).toEqual({
      phone: '+94112504838',
      phoneDisplay: '+94 11 250 4838',
      whatsapp: '+94741003994',
      email: 'hello@example.com',
      responseTime: 'within one working day',
    });
  });
  it('routes each form kind to its inbox, falling back to general, then to the env fallback', () => {
    expect(recipientsFor(siteSettingsFixture, 'oracle-visit', 'fallback@example.com')).toEqual(['oracle@example.com']);
    expect(recipientsFor(siteSettingsFixture, 'grove-interest', 'fallback@example.com')).toEqual(['hello@example.com']);
    expect(recipientsFor({ formRecipients: null }, 'general', 'fallback@example.com')).toEqual(['fallback@example.com']);
  });
  it('formats a postal address on separate lines without empty parts', () => {
    expect(formatAddress(siteSettingsFixture.headOffice)).toBe('133/19 Nawala Road\nNarahenpita\nColombo 05\nSri Lanka');
    expect(formatAddress(null)).toBe('');
  });
});
```

- [ ] **Step 2: Run to verify failures**

```powershell
npx vitest run src/sanity/image src/lib/preview src/lib/revalidation src/lib/site-settings
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create the client, image builder and fetch wrapper**

```ts
// src/sanity/client.ts
import { createClient } from 'next-sanity';
import { getPublicEnv } from '@/lib/env';

export const apiVersion = '2026-02-01';

const { sanityProjectId, sanityDataset } = getPublicEnv();

export const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});
```

```ts
// src/sanity/image.ts
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { client } from './client';

const builder = createImageUrlBuilder(client);

/** Always request modern formats; callers add width/height/fit. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format');
}
```

If `SanityImageSource` is not exported from the package root in the installed `@sanity/image-url` version, import it from `'@sanity/image-url/lib/types/types'` instead.

```ts
// src/sanity/fetch.ts
import type { ClientReturn, QueryParams } from 'next-sanity';
import { draftMode } from 'next/headers';
import { getServerEnv } from '@/lib/env';
import { client } from './client';

export const DEFAULT_REVALIDATE = 3600;

type FetchOptions = {
  params?: QueryParams;
  /** Cache tags — see `docTag()` in `src/lib/revalidation.ts` for the convention. */
  tags?: string[];
  revalidate?: number | false;
};

/**
 * Request-scoped fetch for pages, layouts and generateMetadata. When Next.js draft mode
 * is on (via /api/draft-mode/enable) it reads drafts with the server read token and bypasses
 * the cache; otherwise it reads published content through the CDN with ISR tags.
 * Must not be called from generateStaticParams or sitemap.ts — use fetchPublished there.
 */
export async function sanityFetch<const Q extends string>(
  query: Q,
  { params = {}, tags = [], revalidate = DEFAULT_REVALIDATE }: FetchOptions = {},
): Promise<ClientReturn<Q>> {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return client.fetch(query, params, {
      perspective: 'drafts',
      useCdn: false,
      token: getServerEnv().sanityReadToken,
      next: { revalidate: 0 },
    });
  }
  return client.fetch(query, params, { perspective: 'published', useCdn: true, next: { revalidate, tags } });
}

/** Published content only; safe outside a request scope. */
export function fetchPublished<const Q extends string>(query: Q, params: QueryParams = {}, tags: string[] = []): Promise<ClientReturn<Q>> {
  return client.fetch(query, params, { perspective: 'published', useCdn: true, next: { revalidate: DEFAULT_REVALIDATE, tags } });
}
```

(`ClientReturn<Q>` resolves to the typegen result type once `overloadClientMethods` has generated `SanityQueries`; until Step 5 runs it falls back to `any`.)

- [ ] **Step 4: Create `src/sanity/queries.ts`**

Fragments are plain `const` strings in the same file so `sanity typegen` can resolve `${…}` interpolations. If typegen reports an unresolvable interpolation, inline that fragment.

```ts
import { defineQuery } from 'next-sanity';

const IMAGE = /* groq */ `
  ...,
  asset->{ _id, url, metadata { lqip, dimensions { width, height, aspectRatio } } }
`;

const SEO = /* groq */ `seo{ ..., image{ ${IMAGE} } }`;

const FAQS = /* groq */ `faqs[]->{ _id, question, answer }`;

const CAPABILITY = /* groq */ `{ _key, title, description, provision, status }`;

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    brandName, tagline, legalName, foundedYear,
    phone, phoneDisplay, whatsapp, email, openingHours, responseTime, emergencyNotice,
    headOffice, socialLinks, formRecipients,
    defaultSeo{ ..., image{ ${IMAGE} } }
  }
`);

export const PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, intro, body, lastReviewed,
    heroImage{ ${IMAGE} },
    heroVideo{ description, poster{ ${IMAGE} }, "videoUrl": video.asset->url, "captionsUrl": captions.asset->url },
    sections[]{ _key, eyebrow, heading, body, tone, cta, status, image{ ${IMAGE} } },
    ${FAQS},
    ${SEO}
  }
`);

const RESIDENCE_CARD = /* groq */ `
  _id, name, "slug": slug.current, status, isFlagship, shortLocation, summary,
  heroImage{ ${IMAGE} },
  careTypes[]->{ _id, name, "slug": slug.current, status }
`;

export const RESIDENCES_QUERY = defineQuery(/* groq */ `
  *[_type == "residence"] | order(isFlagship desc, name asc){ ${RESIDENCE_CARD} }
`);

export const RESIDENCE_QUERY = defineQuery(/* groq */ `
  *[_type == "residence" && slug.current == $slug][0]{
    ${RESIDENCE_CARD},
    description, audienceFit, atmosphere, sharedSpaces, formKind, comingSoonNote,
    rooms[]{ _key, name, house, summary, facts, image{ ${IMAGE} } },
    careAndSupport[]${CAPABILITY},
    everydayLife[]${CAPABILITY},
    gallery[]{ ${IMAGE} },
    team[]->[approvedForPublication == true]{ _id, name, role, credentials, bio, image{ ${IMAGE} } },
    address,
    ${FAQS},
    ${SEO},
    "testimonials": *[_type == "testimonial" && approved == true && residence._ref == ^._id]{ _id, quote, displayName, relationship }
  }
`);

const CARE_SERVICE_CARD = /* groq */ `
  _id, name, "slug": slug.current, status, summary, typicalDuration,
  heroImage{ ${IMAGE} }
`;

export const CARE_SERVICES_QUERY = defineQuery(/* groq */ `
  *[_type == "careService"] | order(name asc){ ${CARE_SERVICE_CARD} }
`);

export const CARE_SERVICE_QUERY = defineQuery(/* groq */ `
  *[_type == "careService" && slug.current == $slug][0]{
    ${CARE_SERVICE_CARD},
    whoItSuits, notRightFit, formKind,
    included[]${CAPABILITY},
    process[]{ _key, title, description },
    ${FAQS},
    ${SEO},
    "residences": *[_type == "residence" && references(^._id)] | order(isFlagship desc, name asc){
      _id, name, "slug": slug.current, status, shortLocation
    }
  }
`);

const OFFERING_CARD = /* groq */ `
  _id, name, "slug": slug.current, status, tagline, distinction, summary, heroTone, ctaLabel, formKind,
  heroImage{ ${IMAGE} }
`;

export const OFFERINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "ecosystemOffering"] | order(name asc){ ${OFFERING_CARD} }
`);

export const OFFERING_QUERY = defineQuery(/* groq */ `
  *[_type == "ecosystemOffering" && slug.current == $slug][0]{
    ${OFFERING_CARD},
    currentCapabilities[]${CAPABILITY},
    plannedCapabilities[]${CAPABILITY},
    howItWorks[]{ _key, title, description },
    benefitGroups[]{ _key, audience, points },
    sections[]{ _key, eyebrow, heading, body, tone, cta, status, image{ ${IMAGE} } },
    ${FAQS},
    ${SEO}
  }
`);

export const TEAM_QUERY = defineQuery(/* groq */ `
  *[_type == "teamMember" && approvedForPublication == true] | order(order asc, name asc){
    _id, name, role, credentials, bio, image{ ${IMAGE} }
  }
`);

export const FAQS_FOR_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "faq" && $page in pages] | order(question asc){ _id, question, answer }
`);

export const SITEMAP_QUERY = defineQuery(/* groq */ `{
  "residences": *[_type == "residence" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "careServices": *[_type == "careService" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "offerings": *[_type == "ecosystemOffering" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "pages": *[_type == "page" && defined(slug.current)]{ "slug": slug.current, _updatedAt, "noIndex": seo.noIndex }
}`);

export const SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == $type && defined(slug.current)].slug.current
`);
```

- [ ] **Step 5: Regenerate types, then create the pure helpers and fixtures**

```powershell
npm run typegen
```

Expected: output mentions `12 queries` and `src/sanity/types.ts` now exports `SITE_SETTINGS_QUERYResult`, `RESIDENCE_QUERYResult`, etc.

```ts
// src/lib/site-settings.ts
import type { SITE_SETTINGS_QUERYResult } from '@/sanity/types';
import type { SiteContact } from './contact';
import type { FormKind } from './forms/kinds';

export type SiteSettings = NonNullable<SITE_SETTINGS_QUERYResult>;
export type SiteAddress = SiteSettings['headOffice'];

export function toSiteContact(settings: Pick<SiteSettings, 'phone' | 'phoneDisplay' | 'whatsapp' | 'email' | 'responseTime'>): SiteContact {
  return {
    phone: settings.phone,
    phoneDisplay: settings.phoneDisplay,
    whatsapp: settings.whatsapp,
    email: settings.email,
    responseTime: settings.responseTime,
  };
}

/** Recipients for a form kind: its own row → the "general" row → the env fallback. Never returns an empty list. */
export function recipientsFor(settings: Pick<SiteSettings, 'formRecipients'>, kind: FormKind, fallback: string): string[] {
  const rows = settings.formRecipients ?? [];
  const clean = (to: Array<string | null> | null | undefined) => (to ?? []).filter((e): e is string => Boolean(e));
  const own = clean(rows.find((r) => r.kind === kind)?.to);
  if (own.length) return own;
  const general = clean(rows.find((r) => r.kind === 'general')?.to);
  return general.length ? general : [fallback];
}

export function formatAddress(address: SiteAddress | null | undefined): string {
  if (!address) return '';
  return [address.line1, address.line2, address.city, address.postcode, address.country].filter(Boolean).join('\n');
}
```

```ts
// src/lib/preview.ts
import { timingSafeEqual } from 'node:crypto';

export type PreviewResolution = { ok: true; redirectTo: string } | { ok: false; status: 400 | 401 };

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Validates `/api/draft-mode/enable?secret=…&slug=/path`. Pure, so the route stays a two-liner. */
export function resolvePreviewRequest(url: URL, expectedSecret: string | undefined): PreviewResolution {
  const provided = url.searchParams.get('secret');
  if (!expectedSecret || !provided || !secretsMatch(provided, expectedSecret)) return { ok: false, status: 401 };
  const slug = url.searchParams.get('slug') ?? '/';
  if (!slug.startsWith('/') || slug.startsWith('//')) return { ok: false, status: 400 };
  return { ok: true, redirectTo: slug };
}
```

```ts
// src/lib/revalidation.ts
export function docTag(type: string, slug?: string | null): string {
  return slug ? `${type}:${slug}` : type;
}

export type WebhookBody = { _type?: string; slug?: { current?: string | null } | null };

/** Types whose content is embedded (via references) in other documents' queries. */
const EMBEDDED_IN: Record<string, string[]> = {
  faq: ['residence', 'careService', 'ecosystemOffering', 'page'],
  teamMember: ['residence', 'page'],
  testimonial: ['residence'],
  careService: ['residence'],
  residence: ['careService'],
};

export function tagsForWebhook(body: WebhookBody): string[] {
  const type = body._type;
  if (!type) return [];
  const tags = new Set<string>([type]);
  const slug = body.slug?.current;
  if (slug) tags.add(docTag(type, slug));
  for (const dependant of EMBEDDED_IN[type] ?? []) tags.add(dependant);
  if (type === 'residence' || type === 'careService' || type === 'ecosystemOffering' || type === 'page') tags.add('sitemap');
  return [...tags];
}
```

```ts
// src/test/fixtures.ts — typed against the generated query results; `npm run typecheck` is the arbiter of shape.
import type { SiteSettings } from '@/lib/site-settings';

export function imageFixture(alt: string, placeholder = true) {
  return {
    _type: 'mediaImage' as const,
    alt,
    caption: null,
    source: 'Test fixture',
    license: 'other',
    licenseNotes: null,
    consent: 'not-required',
    consentRecord: null,
    placeholder,
    replaceBy: placeholder ? '2027-01-31' : null,
    hotspot: null,
    crop: null,
    asset: {
      _id: 'image-abc123-1600x1000-svg',
      url: 'https://cdn.sanity.io/images/testproject/test/abc123-1600x1000.svg',
      metadata: { lqip: null, dimensions: { width: 1600, height: 1000, aspectRatio: 1.6 } },
    },
  };
}

export const siteSettingsFixture: SiteSettings = {
  brandName: 'Village 60 Plus',
  tagline: 'Live well. Age exceptionally.',
  legalName: 'Village 60 Plus (Pvt) Ltd',
  foundedYear: null,
  phone: '+94112504838',
  phoneDisplay: '+94 11 250 4838',
  whatsapp: '+94741003994',
  email: 'hello@example.com',
  openingHours: 'Monday to Saturday, 9am–6pm',
  responseTime: 'within one working day',
  emergencyNotice: null,
  headOffice: {
    _type: 'address',
    line1: '133/19 Nawala Road',
    line2: 'Narahenpita',
    city: 'Colombo 05',
    district: null,
    postcode: null,
    country: 'Sri Lanka',
    landmarks: null,
    location: null,
    directionsUrl: null,
    visitingNotes: null,
  },
  socialLinks: null,
  formRecipients: [
    { _key: 'a', _type: 'formRecipient', kind: 'general', to: ['hello@example.com'] },
    { _key: 'b', _type: 'formRecipient', kind: 'oracle-visit', to: ['oracle@example.com'] },
  ],
  defaultSeo: null,
};
```

If typecheck reports missing or extra keys on the fixtures, align the fixture with `src/sanity/types.ts` — the generated type is correct by definition; do not loosen it with casts.

- [ ] **Step 6: Create the routes**

```ts
// src/app/api/draft-mode/enable/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { resolvePreviewRequest } from '@/lib/preview';

export async function GET(request: NextRequest) {
  const result = resolvePreviewRequest(request.nextUrl, process.env.SANITY_PREVIEW_SECRET);
  if (!result.ok) {
    return new Response(result.status === 401 ? 'Invalid preview secret' : 'Invalid slug', { status: result.status });
  }
  (await draftMode()).enable();
  redirect(result.redirectTo);
}
```

```ts
// src/app/api/draft-mode/disable/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  (await draftMode()).disable();
  redirect('/');
}
```

```ts
// src/app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/env';
import { tagsForWebhook, type WebhookBody } from '@/lib/revalidation';

export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(request, getServerEnv().revalidateSecret);
    if (!isValidSignature) return new NextResponse('Invalid signature', { status: 401 });
    if (!body?._type) return new NextResponse('Bad request', { status: 400 });

    const tags = tagsForWebhook(body);
    for (const tag of tags) revalidateTag(tag, 'max');
    return NextResponse.json({ revalidated: true, tags });
  } catch (error) {
    // Non-sensitive: the payload is never logged.
    console.error('revalidate webhook failed:', error instanceof Error ? error.message : 'unknown error');
    return new NextResponse('Revalidation failed', { status: 500 });
  }
}
```

- [ ] **Step 7: Run tests, typecheck, build**

```powershell
npx vitest run src/sanity src/lib
npm run typecheck
npm run build
```

Expected: all PASS; build lists `ƒ /api/draft-mode/enable`, `ƒ /api/draft-mode/disable`, `ƒ /api/revalidate` as dynamic routes.

- [ ] **Step 8: Manual check of the routes**

```powershell
npm run dev
```

In a second terminal:

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" "http://localhost:3000/api/draft-mode/enable?secret=wrong"            # expect 401
curl.exe -s -o NUL -w "%{http_code}`n" -X POST "http://localhost:3000/api/revalidate" -d "{}"                # expect 401 (no signature)
curl.exe -s -o NUL -w "%{http_code}`n" -L "http://localhost:3000/api/draft-mode/enable?secret=<SANITY_PREVIEW_SECRET>&slug=/"   # expect 200 after redirect
```

Stop the dev server. Register the webhook later in **sanity.io/manage → API → Webhooks** once a deployment URL exists: URL `https://www.village60plus.lk/api/revalidate`, dataset `production`, trigger on create/update/delete, projection `{ _type, slug }`, secret = `SANITY_REVALIDATE_SECRET`. Record this in the README in Phase 5.

- [ ] **Step 9: Commit**

```powershell
git add -A
git commit -m "feat(cms): add Sanity client, draft-aware fetch, typed queries, preview and revalidation routes"
```

---

### Task 10: Development seed data and seed runner

**Files:**
- Create: `scripts/seed-data.ts`, `scripts/seed-data.test.ts`, `scripts/seed.ts`
- Modify: `package.json` (`seed` script)

**Interfaces:**
- Produces: `seedDocuments` (array of complete Sanity documents with deterministic `_id`s), `PLACEHOLDER_SVG`, `PLACEHOLDER_REPLACE_BY`, `placeholderImage(alt)`, `paragraphs(...text)`; `npm run seed` populates the `development` dataset idempotently (`createOrReplace`).
- Phase 2–4 view tests may import `seedDocuments` for realistic shapes, but must not depend on the seed copy.

**Content rules for this task:** every fact that spec §20 lists as unconfirmed is written cautiously ("Narahenpita, Colombo" not a street address; founding year omitted), every document carries `editorial: { reviewStatus: 'draft', requiresComplianceReview: true }`, no pricing, no superlatives, no outcome claims. Copy is adapted from `docs/source/website-extract.md` and shortened; it is development filler, not final copy.

- [ ] **Step 1: Write the failing test `scripts/seed-data.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { CONTENT_STATUSES } from '@/lib/content-status';
import { CARE_SERVICE_SLUGS, OFFERING_SLUGS, PAGE_SLUGS, RESIDENCE_SLUGS } from '@/lib/routes';
import { seedDocuments } from './seed-data';

type Doc = { _id: string; _type: string; [key: string]: unknown };
const docs = seedDocuments as Doc[];
const ofType = (type: string) => docs.filter((d) => d._type === type);
const slugsOf = (type: string) => ofType(type).map((d) => (d.slug as { current: string }).current).sort();

function walk(value: unknown, visit: (node: Record<string, unknown>) => void) {
  if (Array.isArray(value)) value.forEach((v) => walk(v, visit));
  else if (value && typeof value === 'object') {
    visit(value as Record<string, unknown>);
    Object.values(value).forEach((v) => walk(v, visit));
  }
}

describe('seed data', () => {
  it('uses deterministic, unique ids', () => {
    const ids = docs.map((d) => d._id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-zA-Z0-9.-]+$/.test(id))).toBe(true);
  });

  it('covers every sitemap residence once, with Oracle as flagship and The Grove coming soon', () => {
    expect(slugsOf('residence')).toEqual([...RESIDENCE_SLUGS].sort());
    const oracle = ofType('residence').find((d) => (d.slug as { current: string }).current === 'oracle');
    const grove = ofType('residence').find((d) => (d.slug as { current: string }).current === 'the-grove');
    expect(oracle?.isFlagship).toBe(true);
    expect(grove?.status).toBe('coming-soon');
    expect(grove?.comingSoonNote).toBeTruthy();
    expect(grove?.formKind).toBe('grove-interest');
    expect(oracle?.formKind).toBe('oracle-visit');
  });

  it('covers the five care services, three offerings and every page', () => {
    expect(slugsOf('careService')).toEqual([...CARE_SERVICE_SLUGS].sort());
    expect(slugsOf('ecosystemOffering')).toEqual([...OFFERING_SLUGS].sort());
    expect(slugsOf('page')).toEqual([...PAGE_SLUGS].sort());
    expect(ofType('siteSettings').map((d) => d._id)).toEqual(['siteSettings']);
  });

  it('only uses the six spec statuses', () => {
    const valid = new Set<unknown>(CONTENT_STATUSES.map((s) => s.value));
    walk(docs, (node) => {
      if ('status' in node && node.status !== undefined) expect(valid.has(node.status), JSON.stringify(node)).toBe(true);
    });
  });

  it('marks every image as a placeholder with rights metadata and a replacement deadline', () => {
    let images = 0;
    walk(docs, (node) => {
      if (node._type === 'mediaImage') {
        images += 1;
        expect(node.placeholder).toBe(true);
        expect(node.replaceBy).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(node.alt).toBeTruthy();
        expect(node.source).toBeTruthy();
        expect(node.license).toBeTruthy();
        expect(node.consent).toBe('not-required');
      }
    });
    expect(images).toBeGreaterThan(0);
  });

  it('flags every public document for compliance review before publication', () => {
    for (const doc of docs.filter((d) => ['residence', 'careService', 'ecosystemOffering', 'page'].includes(d._type))) {
      expect(doc.editorial, doc._id).toMatchObject({ reviewStatus: 'draft', requiresComplianceReview: true });
    }
  });

  it('contains no prohibited claims or pricing', () => {
    const text = JSON.stringify(docs);
    expect(text).not.toMatch(/\b(best|number one|no\.\s?1|the only|international standard|guaranteed?|award-winning|leading provider)\b/i);
    expect(text).not.toMatch(/(\bRs\.?|\bLKR|\bUSD|\$)\s?\d/);
    expect(text).not.toMatch(/\b(cure|treat(ment)?s? for|diagnos)/i);
  });

  it('references only documents that exist in the seed', () => {
    const ids = new Set(docs.map((d) => d._id));
    walk(docs, (node) => {
      if (node._type === 'reference') expect(ids.has(node._ref as string), String(node._ref)).toBe(true);
    });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run scripts
```

Expected: FAIL — cannot find module `./seed-data`.

- [ ] **Step 3: Create `scripts/seed-data.ts`**

```ts
/**
 * Development dataset. Deterministic _ids so `npm run seed` is idempotent.
 * All copy is unverified development filler adapted from docs/source/website-extract.md.
 * Nothing here may reach production without client confirmation (spec §20).
 */
import type { ContentStatus } from '@/lib/content-status';
import type { FormKind } from '@/lib/forms/kinds';
import { CARE_SERVICE_SLUGS, type CareServiceSlug, type OfferingSlug, type PageSlug, type ResidenceSlug } from '@/lib/routes';

export const PLACEHOLDER_REPLACE_BY = '2027-01-31';

export const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="#EDE6D6"/><rect x="24" y="24" width="1552" height="952" fill="none" stroke="#A88A42" stroke-width="4"/><text x="800" y="520" text-anchor="middle" font-family="Georgia, serif" font-size="56" fill="#6F5A24">Placeholder image</text></svg>`;

const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40);

const REVIEW = {
  _type: 'editorial',
  reviewStatus: 'draft',
  requiresComplianceReview: true,
  reviewNotes: 'Seeded development content. Verify every fact against spec §20 before approving.',
} as const;

/** mediaImage without an asset; scripts/seed.ts attaches the uploaded placeholder asset. */
export function placeholderImage(alt: string, caption?: string) {
  return {
    _type: 'mediaImage' as const,
    _key: key(alt),
    alt,
    caption,
    source: 'Generated placeholder (scripts/seed.ts)',
    license: 'other',
    licenseNotes: 'Development-only generated graphic; no rights required.',
    consent: 'not-required',
    placeholder: true,
    replaceBy: PLACEHOLDER_REPLACE_BY,
  };
}

export function paragraphs(...texts: string[]) {
  return texts.map((text, i) => ({
    _type: 'block',
    _key: `p${i}-${key(text)}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
  }));
}

const ref = (id: string) => ({ _type: 'reference' as const, _ref: id, _key: key(id) });
const capability = (title: string, description: string, status: ContentStatus = 'available', provision: 'included' | 'optional-extra' | 'partner-arranged' = 'included') => ({
  _type: 'capability' as const,
  _key: key(title),
  title,
  description,
  provision,
  status,
});
const step = (title: string, description: string) => ({ _type: 'step' as const, _key: key(title), title, description });
const strings = (...items: string[]) => items;

// ---------- site settings ----------

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  brandName: 'Village 60 Plus',
  tagline: 'Live well. Age exceptionally.',
  legalName: 'Village 60 Plus (Pvt) Ltd',
  // foundedYear deliberately omitted until 2008 vs 2009 is confirmed.
  phone: '+94112504838',
  phoneDisplay: '+94 11 250 4838',
  whatsapp: '+94741003994',
  email: 'village60plus@gmail.com',
  openingHours: 'Monday to Saturday, 9am to 6pm (to be confirmed)',
  responseTime: 'within one working day',
  headOffice: {
    _type: 'address',
    line1: '133/19 Nawala Road',
    line2: 'Narahenpita',
    city: 'Colombo 05',
    country: 'Sri Lanka',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=133%2F19+Nawala+Road+Narahenpita+Colombo',
  },
  emergencyNotice: 'This website cannot respond to emergencies. If someone is in immediate danger, call 1990 (Suwa Seriya ambulance) or go to the nearest hospital.',
  formRecipients: [
    { _key: 'general', _type: 'formRecipient', kind: 'general', to: ['village60plus@gmail.com'] },
  ],
  defaultSeo: {
    _type: 'seo',
    title: 'Village 60 Plus — homes, care and support for later life in Sri Lanka',
    description: 'Residential care, independent living, respite, recovery and rehabilitation across Colombo. Speak to a person by phone or WhatsApp.',
  },
};

// ---------- care services ----------

type CareSeed = { slug: CareServiceSlug; name: string; status: ContentStatus; summary: string; whoItSuits: string[]; typicalDuration?: string; included: ReturnType<typeof capability>[] };

const careSeeds: CareSeed[] = [
  {
    slug: 'independent-living',
    name: 'Independent Living',
    status: 'limited',
    summary: 'A private home of your own with shared spaces, everyday services and support quietly available when you want it.',
    whoItSuits: strings('Adults who manage their own day and want fewer chores', 'People who value privacy but not isolation', 'Those planning ahead for changing needs'),
    included: [
      capability('Private room', 'An individually designed room you can make your own.'),
      capability('Dining', 'Meals prepared on site, with flexible timing.'),
      capability('Housekeeping and laundry', 'Regular cleaning and laundry so your time is your own.'),
      capability('Everyday assistance', 'Help with errands, appointments and small tasks when asked.', 'available', 'optional-extra'),
    ],
  },
  {
    slug: 'residential-care',
    name: 'Residential Care',
    status: 'available',
    summary: 'A comfortable home with a care team on hand around the clock for personal support, meals and daily routines.',
    whoItSuits: strings('People who need help with washing, dressing or moving about', 'Families who want the reassurance of a team nearby day and night', 'Those for whom living alone has become difficult'),
    included: [
      capability('Personal care', 'Support with washing, dressing, mobility and medication reminders.'),
      capability('Meals and dining', 'Three meals a day with attention to dietary needs.'),
      capability('Housekeeping and laundry', 'Rooms and linen cared for by the team.'),
      capability('Health and appointment coordination', 'Help arranging and attending appointments with your own doctors.', 'available', 'partner-arranged'),
    ],
  },
  {
    slug: 'respite-care',
    name: 'Respite Care',
    status: 'available',
    summary: 'A short, planned stay that gives a family carer a break while the person they care for is looked after.',
    whoItSuits: strings('Family carers who need rest or time away', 'People whose usual support is temporarily unavailable', 'Anyone wanting to try a residence before deciding'),
    typicalDuration: 'One to four weeks',
    included: [
      capability('Short-stay room', 'A furnished room for the agreed period.'),
      capability('Personal care and meals', 'The same daily support and meals as longer-term residents.'),
    ],
  },
  {
    slug: 'recovery',
    name: 'Recovery',
    status: 'available',
    summary: 'Supported time to regain strength after a hospital stay, illness or surgery before returning home.',
    whoItSuits: strings('People leaving hospital who are not yet ready to be at home alone', 'Families coordinating care from overseas', 'Anyone whose doctor has advised a period of supported rest'),
    typicalDuration: 'Two to six weeks',
    included: [
      capability('24-hour support', 'A care team nearby day and night.'),
      capability('Nutrition', 'Meals planned around recovery and dietary advice.'),
      capability('Therapy sessions', 'Physiotherapy or other therapy arranged with external practitioners.', 'available', 'partner-arranged'),
    ],
  },
  {
    slug: 'rehabilitation',
    name: 'Rehabilitation',
    status: 'available',
    summary: 'A structured programme of therapy and support, coordinated with your own medical team, to rebuild confidence and mobility.',
    whoItSuits: strings('People recovering from a stroke, fall or operation', 'Those whose medical team has recommended rehabilitation', 'Families who want progress communicated clearly'),
    typicalDuration: 'Agreed with your medical team',
    included: [
      capability('Therapy coordination', 'Scheduling and transport for therapy delivered by external specialists.', 'available', 'partner-arranged'),
      capability('Daily support', 'Personal care, meals and encouragement between sessions.'),
    ],
  },
];

const careServices = careSeeds.map((c) => ({
  _id: `careService.${c.slug}`,
  _type: 'careService',
  name: c.name,
  slug: { _type: 'slug', current: c.slug },
  status: c.status,
  summary: c.summary,
  heroImage: placeholderImage(`${c.name} at Village 60 Plus`),
  whoItSuits: c.whoItSuits,
  typicalDuration: c.typicalDuration,
  included: c.included,
  process: [
    step('Tell us a little', 'Call, message or send the short form. You do not need to know the care category.'),
    step('A conversation', 'A team member calls back to understand the situation and answer questions.'),
    step('Visit and assessment', 'A visit to a residence and, where needed, an assessment with the care lead.'),
    step('A clear next step', 'A written summary of what is included and how to proceed. No obligation.'),
  ],
  notRightFit: 'If Village 60 Plus is not the right fit, the team will say so and, where possible, suggest other services through Silver Roots.',
  formKind: 'general' satisfies FormKind,
  editorial: REVIEW,
  seo: { _type: 'seo', title: `${c.name} in Sri Lanka | Village 60 Plus`, description: c.summary.slice(0, 160) },
}));

// ---------- residences ----------

type ResidenceSeed = {
  slug: ResidenceSlug;
  name: string;
  status: ContentStatus;
  isFlagship?: boolean;
  shortLocation: string;
  summary: string;
  careTypes: CareServiceSlug[];
  audienceFit: string[];
  formKind: FormKind;
  comingSoonNote?: string;
  rooms?: Array<{ name: string; house?: string }>;
};

const residenceSeeds: ResidenceSeed[] = [
  {
    slug: 'tranquility',
    name: 'Tranquility',
    status: 'available',
    shortLocation: 'Narahenpita, Colombo',
    summary: 'A welcoming residence in the city, where residents keep their own routines with everyday support close at hand.',
    careTypes: ['residential-care', 'respite-care', 'recovery'],
    audienceFit: strings('People who want to stay connected to central Colombo', 'Families who visit often', 'Those who need daily support in a familiar, home-like setting'),
    formKind: 'general',
  },
  {
    slug: 'serenity',
    name: 'Serenity',
    status: 'available',
    shortLocation: 'Railway Avenue (location to be confirmed)',
    summary: 'A smaller home built around comfort and familiarity, where people settle in, build relationships and feel known.',
    careTypes: ['residential-care', 'respite-care'],
    audienceFit: strings('People who prefer a small household', 'Those who value calm and routine', 'Families looking for a close-knit team'),
    formKind: 'general',
  },
  {
    slug: 'house-on-the-hill',
    name: 'House on the Hill',
    status: 'available',
    shortLocation: 'Kirulapone, Colombo',
    summary: 'A quieter residence with the warmth and character of a traditional home, set within a residential neighbourhood.',
    careTypes: ['residential-care', 'recovery', 'rehabilitation'],
    audienceFit: strings('People who want a home with character rather than a facility', 'Those recovering after hospital', 'Families seeking a quiet neighbourhood setting'),
    formKind: 'general',
  },
  {
    slug: 'enchanted-fields',
    name: 'Enchanted Fields',
    status: 'available',
    shortLocation: 'Homagama',
    summary: 'A greener, more open setting away from the pace of central Colombo, combining residential living with outdoor space.',
    careTypes: ['residential-care', 'respite-care', 'recovery'],
    audienceFit: strings('People who value gardens and open air', 'Those who prefer a slower rhythm of life', 'Families in or near Homagama'),
    formKind: 'general',
  },
  {
    slug: 'oracle',
    name: 'Oracle',
    status: 'limited',
    isFlagship: true,
    shortLocation: 'Pepiliyana',
    summary: 'Ten individually designed rooms within a private residence for independent adults, with shared spaces and support quietly available.',
    careTypes: ['independent-living'],
    audienceFit: strings('Independent adults who want privacy without isolation', 'People who would like everyday chores taken care of', 'Those planning ahead so support can grow with them'),
    formKind: 'oracle-visit',
    rooms: [
      { name: 'Jade', house: 'House 1' }, { name: 'Onyx', house: 'House 1' }, { name: 'Ruby', house: 'House 1' }, { name: 'Ivory', house: 'House 1' }, { name: 'Coral', house: 'House 1' },
      { name: 'Pearl', house: 'House 2' }, { name: 'Amber', house: 'House 2' }, { name: 'Sapphire', house: 'House 2' }, { name: 'Opal', house: 'House 2' }, { name: 'Emerald', house: 'House 2' },
    ],
  },
  {
    slug: 'the-grove',
    name: 'The Grove',
    status: 'coming-soon',
    shortLocation: 'Kottawa',
    summary: 'The next stage of the Village 60 Plus residential expansion. Details will be published as they are confirmed.',
    careTypes: [],
    audienceFit: strings('Families planning ahead', 'People interested in the newer generation of Village 60 Plus homes'),
    formKind: 'grove-interest',
    comingSoonNote: 'The Grove is not yet open. Room numbers, care options and opening dates will be confirmed before they are published here. Register your interest and the team will contact you when there is verified news.',
  },
];

const residences = residenceSeeds.map((r) => ({
  _id: `residence.${r.slug}`,
  _type: 'residence',
  name: r.name,
  slug: { _type: 'slug', current: r.slug },
  status: r.status,
  isFlagship: r.isFlagship ?? false,
  shortLocation: r.shortLocation,
  summary: r.summary,
  heroImage: placeholderImage(`${r.name} residence exterior`),
  description: paragraphs(r.summary, 'The right home depends on the person. This page describes who the home suits, what daily life is like and what support is available, so a family can decide whether to visit.'),
  careTypes: r.careTypes.map((slug) => ref(`careService.${slug}`)),
  audienceFit: r.audienceFit,
  atmosphere: r.status === 'coming-soon' ? undefined : paragraphs('Mornings start at your own pace. Meals are shared or taken in your room. Family are welcome to visit, and the team is nearby without hovering.'),
  rooms: r.rooms?.map((room) => ({
    _type: 'room',
    _key: key(room.name),
    name: room.name,
    house: room.house,
    summary: 'Room details and photography will be added once verified.',
    image: placeholderImage(`${room.name} room at ${r.name}`),
  })),
  sharedSpaces: r.status === 'coming-soon' ? undefined : strings('Living room', 'Dining room', 'Garden or terrace'),
  careAndSupport: r.status === 'coming-soon' ? undefined : [
    capability('Care team on site', r.isFlagship ? 'Everyday assistance on request, with care arranged as needs change.' : 'A care team on hand day and night.'),
    capability('Medication reminders', 'Prompts and support with medication the resident already takes, as agreed with their doctor.'),
    capability('Appointment coordination', 'Help arranging transport to and from appointments.', 'available', 'partner-arranged'),
  ],
  everydayLife: r.status === 'coming-soon' ? undefined : [
    capability('Meals', 'Home-cooked meals with attention to dietary needs.'),
    capability('Housekeeping and laundry', 'Rooms and clothing looked after.'),
    capability('Activities', 'Gentle, optional activities and outings.'),
    capability('Family visits', 'Visitors welcome during agreed hours.'),
  ],
  gallery: r.status === 'coming-soon' ? undefined : [placeholderImage(`${r.name} shared living room`), placeholderImage(`${r.name} garden`)],
  address: {
    _type: 'address',
    line1: 'Street address to be confirmed',
    city: r.shortLocation.replace(/ \(.*\)$/, ''),
    country: 'Sri Lanka',
    visitingNotes: 'Visits are by appointment. Call or WhatsApp to arrange a time.',
  },
  formKind: r.formKind,
  comingSoonNote: r.comingSoonNote,
  editorial: REVIEW,
  seo: { _type: 'seo', title: `${r.name} — ${r.shortLocation.replace(/ \(.*\)$/, '')} | Village 60 Plus`, description: r.summary.slice(0, 160) },
}));

// ---------- ecosystem offerings ----------

type OfferingSeed = { slug: OfferingSlug; name: string; status: ContentStatus; tagline: string; distinction: string; summary: string; heroTone: 'ivory' | 'night'; formKind: FormKind; current: ReturnType<typeof capability>[]; planned: ReturnType<typeof capability>[]; howItWorks: ReturnType<typeof step>[]; benefitGroups: Array<{ audience: string; points: string[] }> };

const offeringSeeds: OfferingSeed[] = [
  {
    slug: 'silver-roots',
    name: 'Silver Roots',
    status: 'in-development',
    tagline: 'Support that reaches beyond our residences.',
    distinction: 'Village 60 Plus runs homes; Silver Roots helps families find and coordinate care and everyday services wherever someone lives.',
    summary: 'A care-discovery and services platform in development. Today the team helps families by phone; the platform features below are labelled by status.',
    heroTone: 'ivory',
    formKind: 'silver-roots-partner',
    current: [capability('Help finding care by phone', 'Speak to the team about options inside and outside Village 60 Plus.', 'available')],
    planned: [
      capability('Support at home', 'Vetted carers and companions visiting at home.', 'planned', 'partner-arranged'),
      capability('Transport and appointment escorts', 'Someone to accompany appointments.', 'planned', 'partner-arranged'),
      capability('Everyday services', 'Meals, housekeeping and small repairs.', 'planned', 'partner-arranged'),
    ],
    howItWorks: [step('Tell us what is needed', 'A short conversation about the person and the situation.'), step('We suggest options', 'Services from Village 60 Plus or trusted partners.'), step('You choose', 'Nothing is arranged without the family agreeing.')],
    benefitGroups: [
      { audience: 'Families', points: strings('One place to ask about care', 'Options explained in plain language') },
      { audience: 'Providers', points: strings('Reach families who are actively looking', 'Clear referral expectations') },
    ],
  },
  {
    slug: 'destination-retirement',
    name: 'Destination Retirement',
    status: 'planned',
    tagline: 'Longer stays in Sri Lanka, not fast tourism.',
    distinction: 'Destination Retirement is a stay concept for people living abroad; it is not a residence and nothing is bookable yet.',
    summary: 'A planned concept for extended stays in Sri Lanka with practical support. Enquiries are welcome; no properties, packages, healthcare, visas or insurance are offered at this stage.',
    heroTone: 'ivory',
    formKind: 'destination-retirement',
    current: [],
    planned: [capability('Trial stays', 'A shorter first stay before committing to longer periods.', 'planned'), capability('Practical services', 'Transport, housekeeping and local orientation.', 'planned', 'partner-arranged')],
    howItWorks: [step('Register interest', 'Tell us roughly when and for how long.'), step('A conversation', 'The team explains what is realistic today.'), step('Updates', 'We contact you when something concrete exists.')],
    benefitGroups: [{ audience: 'Prospective guests', points: strings('Honest information before you plan', 'A named contact in Sri Lanka') }],
  },
  {
    slug: 'sage',
    name: 'SAGE',
    status: 'pilot',
    tagline: 'Technology in the background. Life in the foreground.',
    distinction: 'SAGE is the technology layer that supports Village 60 Plus teams; it is not a product families buy.',
    summary: 'Tools that help care teams communicate and keep records organised. Capabilities are labelled by status; nothing here replaces people.',
    heroTone: 'night',
    formKind: 'general',
    current: [capability('Team communication', 'Shift notes and handovers within the care team.', 'pilot')],
    planned: [capability('Family updates', 'Agreed, permission-based updates for families.', 'planned'), capability('Connection to Silver Roots', 'Coordinating partner services from the same tools.', 'planned')],
    howItWorks: [],
    benefitGroups: [
      { audience: 'Residents', points: strings('Preferences remembered by the whole team') },
      { audience: 'Families', points: strings('Clearer communication, with permission') },
      { audience: 'Care teams', points: strings('Less paperwork, more time with people') },
    ],
  },
];

const offerings = offeringSeeds.map((o) => ({
  _id: `ecosystemOffering.${o.slug}`,
  _type: 'ecosystemOffering',
  name: o.name,
  slug: { _type: 'slug', current: o.slug },
  status: o.status,
  tagline: o.tagline,
  distinction: o.distinction,
  summary: o.summary,
  heroImage: placeholderImage(`${o.name} illustration`),
  heroTone: o.heroTone,
  currentCapabilities: o.current,
  plannedCapabilities: o.planned,
  howItWorks: o.howItWorks,
  benefitGroups: o.benefitGroups.map((g) => ({ _type: 'benefitGroup', _key: key(g.audience), audience: g.audience, points: g.points })),
  sections: [
    { _type: 'contentSection', _key: 'privacy', eyebrow: 'Privacy', heading: 'Privacy and permissions', body: paragraphs('Personal information is shared only with the consent of the person it concerns, or their authorised representative.'), tone: 'sand' },
  ],
  formKind: o.formKind,
  ctaLabel: o.formKind === 'silver-roots-partner' ? 'Register partner interest' : 'Enquire',
  editorial: REVIEW,
  seo: { _type: 'seo', title: `${o.name} | Village 60 Plus`, description: o.summary.slice(0, 160) },
}));

// ---------- pages ----------

const pageSeeds: Array<{ slug: PageSlug; title: string; intro?: string; body?: ReturnType<typeof paragraphs>; sections?: Array<{ eyebrow?: string; heading: string; body: string; tone?: string }> }> = [
  { slug: 'home', title: 'Live well. Age exceptionally.', intro: 'Homes, care and practical support for later life in Sri Lanka, built around the person rather than the institution.' },
  { slug: 'find-the-right-care', title: 'Find the right care', intro: 'You do not need to know the name of the care you are looking for. Tell us a little and a person will call you back.' },
  { slug: 'homes', title: 'Our homes', intro: 'Different homes, one philosophy. Compare location, type of support and current status, then visit the one that feels right.' },
  { slug: 'living-and-care', title: 'Living and care', intro: 'Plain explanations of independent living, residential care, respite, recovery and rehabilitation, and how the team helps you choose.' },
  {
    slug: 'our-story',
    title: 'Our story',
    intro: 'We did not start with a vision of an ecosystem. We started with a home.',
    sections: [
      { eyebrow: 'Beginnings', heading: 'A home first', body: 'Village 60 Plus began with a single residence and a simple idea: people should grow older with dignity, feel safe, and continue to feel that their life belongs to them. The founding year will be confirmed with the client before publication.' },
      { eyebrow: 'Today', heading: 'Several homes, one philosophy', body: 'Tranquility, Serenity, House on the Hill and Enchanted Fields each offer a different setting and level of support.' },
      { eyebrow: 'Next', heading: 'The next chapter', body: 'Oracle, The Grove, Silver Roots, SAGE and Destination Retirement extend the same values. Each is labelled with its current status so families know what exists today.', tone: 'green' },
    ],
  },
  { slug: 'contact', title: 'Contact us', intro: 'Call, message on WhatsApp or send a short note. A person will reply, usually within one working day.' },
  { slug: 'privacy', title: 'Privacy notice', body: paragraphs('DRAFT — to be replaced with the notice approved by the client and Sri Lankan counsel.', 'We collect only the details needed to respond to your enquiry: your name, how to contact you and what you are asking about. We do not ask for medical histories or identification numbers on this website.') },
  { slug: 'terms', title: 'Terms of use', body: paragraphs('DRAFT — to be replaced with terms approved by the client and counsel.', 'Information on this website describes services as they stand on the date shown and is not an offer, a medical recommendation or a promise of availability.') },
  { slug: 'accessibility', title: 'Accessibility statement', body: paragraphs('Village 60 Plus wants everyone to be able to use this website. It is designed to meet WCAG 2.2 Level AA.', 'If something does not work for you, call us or email and we will help you another way and fix the problem.') },
];

const pages = pageSeeds.map((p) => ({
  _id: `page.${p.slug}`,
  _type: 'page',
  title: p.title,
  slug: { _type: 'slug', current: p.slug },
  intro: p.intro,
  heroImage: p.slug === 'home' || p.slug === 'our-story' ? placeholderImage(`${p.title} hero`) : undefined,
  sections: p.sections?.map((s) => ({ _type: 'contentSection', _key: key(s.heading), eyebrow: s.eyebrow, heading: s.heading, body: paragraphs(s.body), tone: s.tone ?? 'ivory' })),
  body: p.body,
  lastReviewed: p.body ? '2026-10-12' : undefined,
  editorial: REVIEW,
  seo: { _type: 'seo', title: p.slug === 'home' ? 'Village 60 Plus — homes, care and support for later life in Sri Lanka' : `${p.title} | Village 60 Plus`, description: (p.intro ?? p.title).slice(0, 160) },
}));

// ---------- FAQs ----------

const faqSeeds = [
  { q: 'Do I need to know which type of care my parent needs before I call?', a: 'No. Describe the situation and the team will explain the options in plain language. The website form is not a medical assessment.', pages: ['home', 'find-the-right-care', 'living-and-care'] },
  { q: 'Can we visit before deciding?', a: 'Yes. Visits are by appointment so that someone can show you around and answer questions. Call or WhatsApp to arrange a time.', pages: ['homes', 'contact'] },
  { q: 'Is Oracle open now?', a: 'Oracle has limited availability. Request a private visit and the team will confirm current room availability directly with you.', pages: ['oracle'] },
  { q: 'When will The Grove open?', a: 'The Grove is coming soon. Dates will be published only once confirmed. Register your interest to be contacted.', pages: ['homes'] },
  { q: 'Can Silver Roots arrange a carer at home today?', a: 'Not yet through the platform. The team can discuss options by phone while Silver Roots is in development.', pages: ['silver-roots'] },
];

const faqs = faqSeeds.map((f) => ({
  _id: `faq.${key(f.q)}`,
  _type: 'faq',
  question: f.q,
  answer: paragraphs(f.a),
  pages: f.pages,
  reviewDate: '2027-01-31',
}));

// Attach FAQs to the documents they belong to.
const faqId = (q: string) => `faq.${key(q)}`;
const withFaqs = <T extends { _id: string }>(doc: T, questions: string[]) => ({ ...doc, faqs: questions.map((q) => ref(faqId(q))) });

export const seedDocuments = [
  siteSettings,
  ...careServices,
  ...residences.map((r) =>
    r.slug.current === 'oracle' ? withFaqs(r, [faqSeeds[2].q]) : r.slug.current === 'the-grove' ? withFaqs(r, [faqSeeds[3].q]) : withFaqs(r, [faqSeeds[1].q]),
  ),
  ...offerings.map((o) => (o.slug.current === 'silver-roots' ? withFaqs(o, [faqSeeds[4].q]) : o)),
  ...pages.map((p) => (p.slug.current === 'find-the-right-care' ? withFaqs(p, [faqSeeds[0].q]) : p)),
  ...faqs,
];
```

The unused `CARE_SERVICE_SLUGS` import can be dropped if ESLint flags it; it is listed to make the dependency on `routes.ts` explicit.

- [ ] **Step 4: Run the seed-data test**

```powershell
npx vitest run scripts
```

Expected: PASS (8 tests). If "contains no prohibited claims" fails, fix the copy, not the test.

- [ ] **Step 5: Create `scripts/seed.ts`**

```ts
/**
 * Seeds the development dataset. Idempotent (createOrReplace with deterministic _ids).
 * Usage: npm run seed     (reads .env.local; requires SANITY_API_WRITE_TOKEN)
 */
import { createClient } from '@sanity/client';
import { requireEnv } from '@/lib/env';
import { PLACEHOLDER_SVG, seedDocuments } from './seed-data';

const projectId = requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset = requireEnv('NEXT_PUBLIC_SANITY_DATASET');
const token = requireEnv('SANITY_API_WRITE_TOKEN');

if (dataset === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'yes') {
  throw new Error('Refusing to seed the production dataset. Seed content is unverified development filler (spec §20). Set ALLOW_PRODUCTION_SEED=yes only with client sign-off.');
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-02-01', useCdn: false });

/** Attach the uploaded placeholder asset to every mediaImage that has none. */
function attachAsset<T>(value: T, assetId: string): T {
  if (Array.isArray(value)) return value.map((v) => attachAsset(v, assetId)) as T;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(record)) {
      if (v !== undefined) next[k] = attachAsset(v, assetId);
    }
    if (record._type === 'mediaImage' && !record.asset) {
      next.asset = { _type: 'reference', _ref: assetId };
    }
    return next as T;
  }
  return value;
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset} …`);
  const asset = await client.assets.upload('image', Buffer.from(PLACEHOLDER_SVG), {
    filename: 'dev-placeholder.svg',
    contentType: 'image/svg+xml',
  });
  console.log(`Placeholder asset: ${asset._id}`);

  const transaction = client.transaction();
  for (const doc of seedDocuments) {
    transaction.createOrReplace(attachAsset(doc, asset._id) as Parameters<typeof transaction.createOrReplace>[0]);
  }
  const result = await transaction.commit();
  console.log(`Seeded ${result.results.length} documents.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
```

Update the `seed` script in `package.json` so the runner reads `.env.local`:

```json
"seed": "tsx --env-file=.env.local scripts/seed.ts",
```

If the installed `tsx` does not accept `--env-file`, use `"node --env-file=.env.local --import tsx scripts/seed.ts"` instead.

- [ ] **Step 6: Run the seed and verify in the Studio and Vision**

```powershell
npm run seed
```

Expected: `Placeholder asset: image-…`, then `Seeded 29 documents.` (1 settings + 5 care services + 6 residences + 3 offerings + 9 pages + 5 FAQs). Run it a second time — same count, no duplicates.

```powershell
npm run dev
```

In `/studio`: *Site settings* shows the seeded contact details; *Residences* lists six, with The Grove's status *Coming soon* and Oracle's *Limited availability*; opening any residence shows a red validation message from the editorial object ("Flagged for compliance review…") — this is intended and confirms the publish gate works. In the **Vision** tool, paste the `RESIDENCE_QUERY` body with `{"slug": "oracle"}` as params: expected ten `rooms`, one `faqs` entry, `careTypes[0].slug == "independent-living"`, and `heroImage.asset.url` ending in `.svg`. Stop the dev server.

- [ ] **Step 7: Run the whole suite and commit**

```powershell
npm run typecheck; npm run lint; npm test; npm run build
git add -A
git commit -m "feat(cms): add deterministic development seed with placeholder media rights"
```

**Phase 1 exit criteria:** `/studio` edits all eight document types with the publish gate active; `npm run typegen` is clean with 12 typed queries; `npm test` passes; `npm run seed` is idempotent; `/api/draft-mode/enable` and `/api/revalidate` reject unauthenticated requests. Phase 2 (shared content and media components, SEO infrastructure) can start.

---

## Phase 2 — Shared media, content components and SEO

**Outcome:** the pieces every marketing page is built from. No page route is added in this phase except `sitemap.ts` and `robots.ts`. Phase 4 pages only fetch and compose these components.

**Phase 2 decisions:**
- **Images go through Sanity's CDN, not `next/image`.** `urlFor()` already requests AVIF/WebP via `auto=format` and a sized crop. A second optimizer would add a hop. Explicit `width` and `height` attributes keep CLS at 0. `SanityImage` renders nothing when the asset or alt text is missing — an image without alt is not published to the page.
- **Portable text never emits an H1.** The page hero owns the single H1. Schema styles are paragraph, h2, h3 and quote only.
- **Video never autoplays on the server render.** Prefers-reduced-motion and Save-Data are read after mount, so the poster is the first paint and there is no hydration mismatch (spec §11, §18).
- **Maps stay static until asked.** Address and a directions link are in the HTML; the interactive map loads on a button press (spec §15).

**Task map:** 11 SanityImage · 12 PortableText · 13 Gallery · 14 VideoHero · 15 StaticMap · 16 Cards and lists · 17 Page sections (hero, sections, CTA, FAQ, breadcrumbs) · 18 Metadata, JSON-LD, sitemap, robots.

### Task 11: SanityImage

**Files:**
- Create: `src/components/media/SanityImage.tsx`, `src/components/media/SanityImage.test.tsx`

**Interfaces:**
- Consumes: `urlFor(source)` (`src/sanity/image.ts`); `imageFixture(alt, placeholder?)` (`src/test/fixtures.ts`); `cn()`.
- Produces: `type CmsImage`; `SanityImage({ image, width, height?, sizes?, priority?, className?, showCaption? })` → `JSX.Element | null`. Later media and content components take `CmsImage` for every `mediaImage` projection (`heroImage`, `gallery[]`, `poster`, section images). `priority` means LCP: `loading="eager"` and `fetchpriority="high"`.

- [ ] **Step 1: Write the failing test `src/components/media/SanityImage.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { SanityImage } from './SanityImage';

describe('SanityImage', () => {
  it('renders alt text, explicit dimensions and a sized Sanity CDN URL', () => {
    render(<SanityImage image={imageFixture('Garden at Serenity')} width={800} />);
    const img = screen.getByRole('img', { name: 'Garden at Serenity' });
    expect(img).toHaveAttribute('width', '800');
    expect(img).toHaveAttribute('height', '500'); // 800 / aspect 1.6
    const src = img.getAttribute('src') ?? '';
    expect(src).toContain('cdn.sanity.io');
    expect(src).toContain('auto=format');
    expect(src).toContain('w=800');
    expect(src).toContain('h=500');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img.getAttribute('srcset')).toContain('1600w');
  });

  it('loads the priority image eagerly', () => {
    render(<SanityImage image={imageFixture('Hero')} width={1200} height={750} priority />);
    const img = screen.getByRole('img', { name: 'Hero' });
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).toHaveAttribute('height', '750');
  });

  it('renders nothing without an asset or without alt text', () => {
    const { container, rerender } = render(<SanityImage image={null} width={400} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<SanityImage image={{ ...imageFixture('x'), alt: '   ' }} width={400} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<SanityImage image={{ ...imageFixture('x'), asset: null }} width={400} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the caption in a figure when asked', () => {
    render(
      <SanityImage
        image={{ ...imageFixture('Courtyard'), caption: 'The courtyard in the morning' }}
        width={600}
        showCaption
      />,
    );
    expect(screen.getByText('The courtyard in the morning').tagName).toBe('FIGCAPTION');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/components/media/SanityImage.test.tsx
```

Expected: FAIL — cannot find module `./SanityImage`.

- [ ] **Step 3: Create `src/components/media/SanityImage.tsx`**

```tsx
import type { SanityImageSource } from '@sanity/image-url';
import { cn } from '@/lib/cn';
import { urlFor } from '@/sanity/image';

/** Shape of the shared `IMAGE` GROQ projection in `src/sanity/queries.ts`. Extra fields are ignored by `urlFor`. */
export type CmsImage = {
  alt?: string | null;
  caption?: string | null;
  hotspot?: { x?: number; y?: number; height?: number; width?: number } | null;
  crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
  asset?: {
    _id?: string | null;
    url?: string | null;
    metadata?: {
      lqip?: string | null;
      dimensions?: { width?: number | null; height?: number | null; aspectRatio?: number | null } | null;
    } | null;
  } | null;
};

const FALLBACK_ASPECT = 1.6;

function slotHeight(image: CmsImage, width: number, height?: number): number {
  if (height && height > 0) return height;
  const ratio = image.asset?.metadata?.dimensions?.aspectRatio;
  const aspect = ratio && ratio > 0 ? ratio : FALLBACK_ASPECT;
  return Math.max(1, Math.round(width / aspect));
}

export function SanityImage({
  image,
  width,
  height,
  sizes,
  priority = false,
  className,
  showCaption = false,
}: {
  image: CmsImage | null | undefined;
  /** CSS-pixel width of the slot. Sent to the CDN and written as the width attribute. */
  width: number;
  /** CSS-pixel height. When omitted, derived from the asset aspect ratio. */
  height?: number;
  sizes?: string;
  /** Set on the LCP image only. */
  priority?: boolean;
  className?: string;
  showCaption?: boolean;
}) {
  const alt = image?.alt?.trim();
  if (!image?.asset?.url || !alt) return null;

  const w = width;
  const h = slotHeight(image, w, height);
  const build = (tw: number, th: number) => urlFor(image as SanityImageSource).width(tw).height(th).fit('crop').url();
  const src = build(w, h);
  const src2 = build(w * 2, h * 2);
  const img = (
    <img
      src={src}
      srcSet={`${src} ${w}w, ${src2} ${w * 2}w`}
      sizes={sizes ?? `(min-width: 1200px) ${w}px, 100vw`}
      alt={alt}
      width={w}
      height={h}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={cn('h-auto w-full rounded-card', className)}
    />
  );

  if (!showCaption || !image.caption) return img;
  return (
    <figure>
      {img}
      <figcaption className="mt-2 text-[14px] text-bronze">{image.caption}</figcaption>
    </figure>
  );
}
```

If `SanityImageSource` is not exported from `@sanity/image-url`, import it from `@sanity/image-url/lib/types/types` (same fallback as Task 9).

- [ ] **Step 4: Run the test**

```powershell
npx vitest run src/components/media/SanityImage.test.tsx
```

Expected: PASS (4 tests). If the URL has no `cdn.sanity.io`, the builder did not read `asset._id` — the `imageFixture` asset id is `image-abc123-1600x1000-svg`, which `@sanity/image-url` accepts as `_id`. Do not switch this component to `next/image`.

- [ ] **Step 5: Commit**

```powershell
git add src/components/media/SanityImage.tsx src/components/media/SanityImage.test.tsx
git commit -m "feat(media): add SanityImage with explicit dimensions and required alt"
```

---

### Task 12: PortableText

**Files:**
- Create: `src/components/content/PortableText.tsx`, `src/components/content/PortableText.test.tsx`

**Interfaces:**
- Consumes: `@portabletext/react` (installed in Task 6). Block styles match `blockContent`: `normal`, `h2`, `h3`, `blockquote`; lists `bullet` and `number`; marks `strong`, `em`; annotation `link` with `href`.
- Produces: `safeHref(href)` → `string | null`; `PortableText({ value, onDark? })`. `value` is `PortableTextBlock[] | null | undefined` — the `body` / `answer` / section `body` arrays from the queries. Returns `null` for empty input. Never renders `h1`. Drops `javascript:` and protocol-relative links.

- [ ] **Step 1: Write the failing test `src/components/content/PortableText.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import type { PortableTextBlock } from '@portabletext/react';
import { describe, expect, it } from 'vitest';
import { PortableText, safeHref } from './PortableText';

function block(text: string, style = 'normal', marks: PortableTextBlock['markDefs'] = []): PortableTextBlock {
  return {
    _type: 'block',
    _key: style + text.slice(0, 6),
    style,
    markDefs: marks,
    children: [{ _type: 'span', _key: 's', text, marks: marks?.[0]?._key ? [marks[0]._key] : [] }],
  };
}

describe('safeHref', () => {
  it('allows site paths and ordinary URL schemes', () => {
    expect(safeHref('/homes/serenity')).toBe('/homes/serenity');
    expect(safeHref('https://example.com/a')).toBe('https://example.com/a');
    expect(safeHref('mailto:hello@example.com')).toBe('mailto:hello@example.com');
    expect(safeHref('tel:+94112504838')).toBe('tel:+94112504838');
  });
  it('rejects scripts, protocol-relative URLs and non-strings', () => {
    expect(safeHref('javascript:alert(1)')).toBeNull();
    expect(safeHref('//evil.example')).toBeNull();
    expect(safeHref('data:text/html,hi')).toBeNull();
    expect(safeHref(undefined)).toBeNull();
  });
});

describe('PortableText', () => {
  it('renders paragraphs, h2 and h3, and never an h1', () => {
    render(<PortableText value={[block('A paragraph.'), block('A heading', 'h2'), block('Smaller', 'h3')]} />);
    expect(screen.getByText('A paragraph.').tagName).toBe('P');
    expect(screen.getByRole('heading', { level: 2, name: 'A heading' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Smaller' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('renders a safe link and drops an unsafe one', () => {
    render(
      <PortableText
        value={[
          block('Visit', 'normal', [{ _key: 'ok', _type: 'link', href: '/contact' }]),
          block('Bad', 'normal', [{ _key: 'bad', _type: 'link', href: 'javascript:alert(1)' }]),
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Visit' })).toHaveAttribute('href', '/contact');
    expect(screen.getByText('Bad').closest('a')).toBeNull();
  });

  it('opens http links in a new tab', () => {
    render(<PortableText value={[block('Map', 'normal', [{ _key: 'm', _type: 'link', href: 'https://maps.example/x' }])]} />);
    const link = screen.getByRole('link', { name: 'Map' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders nothing for empty input', () => {
    const { container, rerender } = render(<PortableText value={null} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<PortableText value={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/components/content/PortableText.test.tsx
```

Expected: FAIL — cannot find module `./PortableText`.

- [ ] **Step 3: Create `src/components/content/PortableText.tsx`**

```tsx
import { PortableText as Base, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

const ALLOWED = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/** Accepts a site path or an http(s)/mailto/tel URL. Everything else, including javascript: and //host, is dropped. */
export function safeHref(href: unknown): string | null {
  if (typeof href !== 'string' || href.length === 0) return null;
  if (href.startsWith('/') && !href.startsWith('//')) return href;
  try {
    const url = new URL(href);
    return ALLOWED.has(url.protocol) ? href : null;
  } catch {
    return null;
  }
}

function componentsFor(onDark: boolean): PortableTextComponents {
  const linkClass = cn('underline underline-offset-4', onDark ? 'decoration-pale-gold' : 'decoration-gold hover:decoration-green');
  return {
    block: {
      normal: ({ children }) => <p className="max-w-prose-site">{children}</p>,
      h2: ({ children }) => <h2 className="mt-8 max-w-prose-site">{children}</h2>,
      h3: ({ children }) => <h3 className="mt-6 max-w-prose-site">{children}</h3>,
      blockquote: ({ children }) => (
        <blockquote className="max-w-prose-site border-l-2 border-gold py-1 pl-6 font-display text-[22px] leading-snug">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="max-w-prose-site list-disc space-y-2 pl-6">{children}</ul>,
      number: ({ children }) => <ol className="max-w-prose-site list-decimal space-y-2 pl-6">{children}</ol>,
    },
    marks: {
      link: ({ children, value }) => {
        const href = safeHref(value?.href);
        if (!href) return <>{children}</>;
        if (href.startsWith('/')) {
          return (
            <Link href={href} className={linkClass}>
              {children}
            </Link>
          );
        }
        const external = href.startsWith('http');
        return (
          <a href={href} className={linkClass} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {children}
          </a>
        );
      },
    },
  };
}

export function PortableText({
  value,
  onDark = false,
}: {
  value: PortableTextBlock[] | null | undefined;
  onDark?: boolean;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <Base value={value} components={componentsFor(onDark)} />
    </div>
  );
}
```

- [ ] **Step 4: Run the test**

```powershell
npx vitest run src/components/content/PortableText.test.tsx
```

Expected: PASS (6 tests). The link test's first block marks the span with `marks[0]._key`; both the safe and unsafe cases depend on that helper in the test, not on the component.

- [ ] **Step 5: Commit**

```powershell
git add src/components/content/PortableText.tsx src/components/content/PortableText.test.tsx
git commit -m "feat(content): render portable text without h1 or unsafe links"
```

---

### Task 13: Gallery

**Files:**
- Create: `src/components/media/Gallery.tsx`, `src/components/media/Gallery.test.tsx`

**Interfaces:**
- Consumes: `SanityImage`, `type CmsImage` (Task 11); `Button`.
- Produces: `Gallery({ images, label })`. `images` is the `gallery[]` projection (`CmsImage & { _key?: string }`, nulls allowed). `label` is the accessible name, e.g. `"Photographs of Serenity"`. Renders nothing when fewer than one usable image. Previous/Next buttons appear only when there are two or more, scroll the strip by one item, and do not depend on dragging. No timer, no autoplay.

- [ ] **Step 1: Write the failing test `src/components/media/Gallery.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { Gallery } from './Gallery';

const images = [imageFixture('Front garden'), imageFixture('Dining room'), imageFixture('Verandah')];

describe('Gallery', () => {
  it('renders each usable image inside a labelled region', () => {
    render(<Gallery images={images} label="Photographs of Serenity" />);
    expect(screen.getByRole('region', { name: 'Photographs of Serenity' })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'Front garden' })).toHaveAttribute('loading', 'lazy');
  });

  it('skips images with no alt and renders nothing when none remain', () => {
    render(<Gallery images={[{ ...imageFixture('x'), alt: '' }, null]} label="Photographs" />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('hides the controls when there is only one image', () => {
    render(<Gallery images={[images[0]]} label="Photographs of Serenity" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('scrolls the strip from the buttons and never starts a timer', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(HTMLElement.prototype, 'scrollBy').mockImplementation(() => {});
    render(<Gallery images={images} label="Photographs of Serenity" />);
    await user.click(screen.getByRole('button', { name: 'Next photograph' }));
    await user.click(screen.getByRole('button', { name: 'Previous photograph' }));
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0][0]).toMatchObject({ left: expect.any(Number) });
    expect((spy.mock.calls[0][0] as ScrollToOptions).left).toBeGreaterThan(0);
    expect((spy.mock.calls[1][0] as ScrollToOptions).left).toBeLessThan(0);
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/components/media/Gallery.test.tsx
```

Expected: FAIL — cannot find module `./Gallery`.

- [ ] **Step 3: Create `src/components/media/Gallery.tsx`**

```tsx
'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { SanityImage, type CmsImage } from './SanityImage';

export type GalleryImage = CmsImage & { _key?: string | null };

function usable(images: Array<GalleryImage | null> | null | undefined): GalleryImage[] {
  return (images ?? []).filter((image): image is GalleryImage => Boolean(image?.asset?.url && image.alt?.trim()));
}

export function Gallery({ images, label }: { images: Array<GalleryImage | null> | null | undefined; label: string }) {
  const scroller = useRef<HTMLUListElement>(null);
  const items = usable(images);
  if (items.length === 0) return null;

  function move(direction: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const item = el.querySelector('li');
    const delta = (item?.clientWidth || el.clientWidth) + 16;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    el.scrollBy({ left: direction * delta, behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <section aria-label={label} className="flex flex-col gap-4">
      {items.length > 1 && (
        <div className="flex gap-2">
          <Button variant="secondary" aria-label="Previous photograph" onClick={() => move(-1)}>
            Previous
          </Button>
          <Button variant="secondary" aria-label="Next photograph" onClick={() => move(1)}>
            Next
          </Button>
        </div>
      )}
      <ul ref={scroller} className="flex snap-x snap-mandatory gap-4 overflow-x-auto">
        {items.map((image, index) => (
          <li key={image._key ?? `${image.alt}-${index}`} className="w-[85%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]">
            <SanityImage image={image} width={640} sizes="(min-width: 1200px) 400px, 85vw" showCaption />
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the test**

```powershell
npx vitest run src/components/media/Gallery.test.tsx
```

Expected: PASS (4 tests). `clientWidth` is 0 in jsdom, so the scroll distance falls back to `0 + 16`; the assertions only check the sign.

- [ ] **Step 5: Commit**

```powershell
git add src/components/media/Gallery.tsx src/components/media/Gallery.test.tsx
git commit -m "feat(media): add a scroll-snap gallery with button controls"
```

---

### Task 14: VideoHero

**Files:**
- Create: `src/components/media/VideoHero.tsx`, `src/components/media/VideoHero.test.tsx`

**Interfaces:**
- Consumes: `SanityImage`, `type CmsImage`, `urlFor`.
- Produces: `shouldAutoplayVideo({ reducedMotion, saveData })` → `boolean`; `type HeroVideo` = `{ description, poster, videoUrl, captionsUrl }` (the `heroVideo` projection on `PAGE_QUERY`); `VideoHero({ video, width? })`.
- Behaviour locked for later pages: the poster is the server render and the first client paint. After mount, the muted video autoplays only when reduced-motion is off and Save-Data is off. Otherwise a "Play video" button starts it on a user gesture. A "Pause video" button is visible whenever the video is playing. A captions track is rendered when `captionsUrl` is set. No video element when `videoUrl` is missing.

- [ ] **Step 1: Write the failing test `src/components/media/VideoHero.test.tsx`**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { shouldAutoplayVideo, VideoHero, type HeroVideo } from './VideoHero';

const video: HeroVideo = {
  description: 'A quiet morning at the residence',
  poster: imageFixture('Morning light across the verandah'),
  videoUrl: 'https://cdn.sanity.io/files/test/hero.mp4',
  captionsUrl: 'https://cdn.sanity.io/files/test/hero.vtt',
};

function mockMedia({ matches, saveData = false }: { matches: boolean; saveData?: boolean }) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  })) as unknown as typeof window.matchMedia;
  Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData } });
}

describe('shouldAutoplayVideo', () => {
  it('autoplays only when the visitor has neither reduced motion nor data saver', () => {
    expect(shouldAutoplayVideo({ reducedMotion: false, saveData: false })).toBe(true);
    expect(shouldAutoplayVideo({ reducedMotion: true, saveData: false })).toBe(false);
    expect(shouldAutoplayVideo({ reducedMotion: false, saveData: true })).toBe(false);
  });
});

describe('VideoHero', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(navigator, 'connection');
  });

  it('shows the poster and a play button, and does not mount a video, when motion is reduced', async () => {
    mockMedia({ matches: true });
    const { container } = render(<VideoHero video={video} />);
    expect(screen.getByRole('img', { name: 'Morning light across the verandah' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play video' })).toBeInTheDocument();
    await waitFor(() => expect(container.querySelector('video')).toBeNull());
  });

  it('autoplays a muted video with captions when motion and data saver allow it', async () => {
    mockMedia({ matches: false });
    const { container } = render(<VideoHero video={video} />);
    await waitFor(() => expect(container.querySelector('video')).not.toBeNull());
    const el = container.querySelector('video') as HTMLVideoElement;
    expect(el.autoplay).toBe(true);
    expect(el.muted).toBe(true);
    expect(el.playsInline).toBe(true);
    expect(el).toHaveAttribute('aria-label', 'A quiet morning at the residence');
    const track = el.querySelector('track');
    expect(track).toHaveAttribute('kind', 'captions');
    expect(track).toHaveAttribute('src', video.captionsUrl);
    expect(track).toHaveAttribute('srclang', 'en');
    expect(screen.getByRole('button', { name: 'Pause video' })).toBeInTheDocument();
  });

  it('pauses from the button', async () => {
    mockMedia({ matches: false });
    const user = userEvent.setup();
    const { container } = render(<VideoHero video={video} />);
    await waitFor(() => expect(container.querySelector('video')).not.toBeNull());
    const el = container.querySelector('video') as HTMLVideoElement;
    const pause = vi.spyOn(el, 'pause').mockImplementation(() => {});
    await user.click(screen.getByRole('button', { name: 'Pause video' }));
    expect(pause).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Play video' })).toBeInTheDocument();
  });

  it('renders the poster only when there is no video file', () => {
    mockMedia({ matches: false });
    const { container } = render(<VideoHero video={{ ...video, videoUrl: null, captionsUrl: null }} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container.querySelector('video')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/components/media/VideoHero.test.tsx
```

Expected: FAIL — cannot find module `./VideoHero`.

- [ ] **Step 3: Create `src/components/media/VideoHero.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { SanityImageSource } from '@sanity/image-url';
import { Button } from '@/components/ui/Button';
import { urlFor } from '@/sanity/image';
import { SanityImage, type CmsImage } from './SanityImage';

export type HeroVideo = {
  description?: string | null;
  poster?: CmsImage | null;
  videoUrl?: string | null;
  captionsUrl?: string | null;
};

/** Spec §18: no autoplay for reduced-motion or data-saver visitors. */
export function shouldAutoplayVideo(prefs: { reducedMotion: boolean; saveData: boolean }): boolean {
  return !prefs.reducedMotion && !prefs.saveData;
}

function readPrefs(): { reducedMotion: boolean; saveData: boolean } {
  let reducedMotion = true;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    reducedMotion = true;
  }
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return { reducedMotion, saveData: connection?.saveData === true };
}

export function VideoHero({ video, width = 1280 }: { video: HeroVideo | null | undefined; width?: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!video?.videoUrl) return;
    if (shouldAutoplayVideo(readPrefs())) {
      setShowVideo(true);
      setPlaying(true);
    }
  }, [video?.videoUrl]);

  if (!video?.poster?.asset?.url && !video?.videoUrl) return null;

  function play() {
    setShowVideo(true);
    setPlaying(true);
    queueMicrotask(() => {
      void ref.current?.play();
    });
  }

  function pause() {
    ref.current?.pause();
    setPlaying(false);
  }

  const posterUrl =
    video.poster?.asset?.url && video.poster.alt?.trim()
      ? urlFor(video.poster as SanityImageSource)
          .width(width)
          .height(Math.round(width / (video.poster.asset.metadata?.dimensions?.aspectRatio || 1.6)))
          .fit('crop')
          .url()
      : undefined;

  return (
    <div className="relative">
      {showVideo && video.videoUrl ? (
        <video
          ref={ref}
          className="h-auto w-full rounded-card"
          autoPlay
          muted
          playsInline
          loop
          poster={posterUrl}
          aria-label={video.description ?? undefined}
        >
          <source src={video.videoUrl} type="video/mp4" />
          {video.captionsUrl ? <track kind="captions" src={video.captionsUrl} srcLang="en" label="English" default /> : null}
        </video>
      ) : (
        video.poster && <SanityImage image={video.poster} width={width} priority />
      )}
      {video.videoUrl && (
        <div className="mt-3">
          {playing ? (
            <Button variant="secondary" onClick={pause}>
              Pause video
            </Button>
          ) : (
            <Button variant="secondary" onClick={play}>
              Play video
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
```

The poster image is the server render. The `<video>` mounts only after mount (autoplay) or after a click, so React does not hydrate a mismatch. `queueMicrotask` lets the video element exist before `play()` on the click path; the autoplay path relies on the `autoPlay` attribute.

- [ ] **Step 4: Run the test**

```powershell
npx vitest run src/components/media/VideoHero.test.tsx
```

Expected: PASS (5 tests). If jsdom has no `HTMLMediaElement.prototype.pause`, the spy in the test still replaces it. If the reduced-motion test flakes because `waitFor` resolves too early, assert `container.querySelector('video')` is null both immediately and after `await act(async () => {})` — it must stay null.

- [ ] **Step 5: Commit**

```powershell
git add src/components/media/VideoHero.tsx src/components/media/VideoHero.test.tsx
git commit -m "feat(media): add a hero video that autoplays only when motion and data settings allow"
```

---

### Task 15: Static map

**Files:**
- Create: `src/lib/maps.ts`, `src/lib/maps.test.ts`, `src/components/media/StaticMap.tsx`, `src/components/media/StaticMap.test.tsx`

**Interfaces:**
- Consumes: address fields from the `address` object (`line1`, `line2`, `city`, `postcode`, `country`, `landmarks`, `location` geopoint, `directionsUrl`, `visitingNotes`). `getPublicEnv().mapsKey` is passed in by the page; this component does not read the environment itself.
- Produces:
  - `addressLines(address)` → `string[]`
  - `mapPoint(address)` → `{ lat: number; lng: number } | null`
  - `directionsHref(address)` → `string | null` (prefers an `https` `directionsUrl`, then coordinates, then the address text)
  - `staticMapUrl(point, { width, height, key })` → Google Static Maps URL
  - `StaticMap({ address, mapsKey, label })`
- The address and the directions link are in the HTML whether or not a map can load. The static image is a button; the Google embed iframe is inserted only after that button is pressed. No Maps JavaScript SDK. If `mapsKey` or coordinates are missing, the address and directions link still render and no map request is made.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/maps.test.ts
import { describe, expect, it } from 'vitest';
import { addressLines, directionsHref, mapPoint, staticMapUrl } from './maps';

const address = {
  line1: '133/19 Nawala Road',
  line2: 'Narahenpita',
  city: 'Colombo 05',
  postcode: null,
  country: 'Sri Lanka',
  location: { lat: 6.91, lng: 79.88 },
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Serenity',
  visitingNotes: null,
};

describe('map helpers', () => {
  it('lists the postal lines and skips blanks', () => {
    expect(addressLines(address)).toEqual(['133/19 Nawala Road', 'Narahenpita', 'Colombo 05', 'Sri Lanka']);
    expect(addressLines(null)).toEqual([]);
  });

  it('reads a geopoint only when both coordinates are numbers', () => {
    expect(mapPoint(address)).toEqual({ lat: 6.91, lng: 79.88 });
    expect(mapPoint({ ...address, location: { lat: 6.91, lng: null } })).toBeNull();
    expect(mapPoint({ ...address, location: null })).toBeNull();
  });

  it('prefers the CMS directions link, then coordinates, then the address', () => {
    expect(directionsHref(address)).toBe('https://www.google.com/maps/search/?api=1&query=Serenity');
    expect(directionsHref({ ...address, directionsUrl: 'javascript:alert(1)' })).toBe('https://www.google.com/maps/search/?api=1&query=6.91,79.88');
    expect(directionsHref({ line1: '133/19 Nawala Road', city: 'Colombo 05', country: 'Sri Lanka' })).toBe(
      'https://www.google.com/maps/search/?api=1&query=133%2F19%20Nawala%20Road%2C%20Colombo%2005%2C%20Sri%20Lanka',
    );
    expect(directionsHref(null)).toBeNull();
  });

  it('builds a static map URL with the heritage-green marker and the key', () => {
    const url = new URL(staticMapUrl({ lat: 6.91, lng: 79.88 }, { width: 640, height: 400, key: 'test-key' }));
    expect(url.origin + url.pathname).toBe('https://maps.googleapis.com/maps/api/staticmap');
    expect(url.searchParams.get('center')).toBe('6.91,79.88');
    expect(url.searchParams.get('size')).toBe('640x400');
    expect(url.searchParams.get('markers')).toBe('color:0x18352D|6.91,79.88');
    expect(url.searchParams.get('key')).toBe('test-key');
  });
});
```

```tsx
// src/components/media/StaticMap.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StaticMap } from './StaticMap';

const address = {
  line1: '133/19 Nawala Road',
  line2: null,
  city: 'Colombo 05',
  postcode: null,
  country: 'Sri Lanka',
  landmarks: ['Near the park'],
  location: { lat: 6.91, lng: 79.88 },
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Serenity',
  visitingNotes: 'Visits are by appointment.',
};

describe('StaticMap', () => {
  it('shows the address and directions before any map is loaded', () => {
    const { container } = render(<StaticMap address={address} mapsKey="test-key" label="Serenity" />);
    expect(screen.getByText(/133\/19 Nawala Road/)).toBeInTheDocument();
    expect(screen.getByText('Visits are by appointment.')).toBeInTheDocument();
    expect(screen.getByText('Nearby: Near the park')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get directions' })).toHaveAttribute('href', address.directionsUrl);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByRole('button', { name: 'Load interactive map' })).toBeInTheDocument();
  });

  it('inserts the embed only after the button is pressed', async () => {
    const user = userEvent.setup();
    const { container } = render(<StaticMap address={address} mapsKey="test-key" label="Serenity" />);
    await user.click(screen.getByRole('button', { name: 'Load interactive map' }));
    const frame = container.querySelector('iframe');
    expect(frame).toHaveAttribute('title', 'Map of Serenity');
    expect(frame?.getAttribute('src')).toContain('maps/embed');
    expect(frame?.getAttribute('src')).toContain('6.91');
    expect(screen.queryByRole('button', { name: 'Load interactive map' })).not.toBeInTheDocument();
  });

  it('keeps the address and directions when there is no key or no coordinates', () => {
    const { rerender, container } = render(<StaticMap address={address} mapsKey={null} label="Serenity" />);
    expect(screen.getByRole('link', { name: 'Get directions' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Load interactive map' })).not.toBeInTheDocument();
    rerender(<StaticMap address={{ ...address, location: null }} mapsKey="test-key" label="Serenity" />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get directions' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```powershell
npx vitest run src/lib/maps.test.ts src/components/media/StaticMap.test.tsx
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create `src/lib/maps.ts`**

```ts
export type MapAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  postcode?: string | null;
  country?: string | null;
  landmarks?: Array<string | null> | null;
  location?: { lat?: number | null; lng?: number | null } | null;
  directionsUrl?: string | null;
  visitingNotes?: string | null;
};

export function addressLines(address: MapAddress | null | undefined): string[] {
  if (!address) return [];
  return [address.line1, address.line2, address.city, address.postcode, address.country].filter((part): part is string => Boolean(part));
}

export function mapPoint(address: MapAddress | null | undefined): { lat: number; lng: number } | null {
  const lat = address?.location?.lat;
  const lng = address?.location?.lng;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  return { lat, lng };
}

function httpsUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).protocol === 'https:' ? value : null;
  } catch {
    return null;
  }
}

/** A directions link that works with no map loaded. Never returns a non-https CMS value. */
export function directionsHref(address: MapAddress | null | undefined): string | null {
  if (!address) return null;
  const given = httpsUrl(address.directionsUrl);
  if (given) return given;
  const point = mapPoint(address);
  if (point) return `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
  const query = addressLines(address).join(', ');
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
}

export function staticMapUrl(
  point: { lat: number; lng: number },
  { width, height, key }: { width: number; height: number; key: string },
): string {
  const params = new URLSearchParams({
    center: `${point.lat},${point.lng}`,
    zoom: '15',
    size: `${width}x${height}`,
    scale: '2',
    maptype: 'roadmap',
    markers: `color:0x18352D|${point.lat},${point.lng}`,
    key,
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
}

export function embedMapUrl(point: { lat: number; lng: number }, key: string): string {
  const params = new URLSearchParams({
    key,
    center: `${point.lat},${point.lng}`,
    zoom: '15',
  });
  return `https://www.google.com/maps/embed/v1/view?${params}`;
}
```

- [ ] **Step 4: Create `src/components/media/StaticMap.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { addressLines, directionsHref, embedMapUrl, mapPoint, staticMapUrl, type MapAddress } from '@/lib/maps';

export function StaticMap({
  address,
  mapsKey,
  label,
}: {
  address: MapAddress | null | undefined;
  mapsKey: string | null;
  label: string;
}) {
  const [active, setActive] = useState(false);
  const lines = addressLines(address);
  const directions = directionsHref(address);
  const point = mapPoint(address);
  const landmarks = (address?.landmarks ?? []).filter((item): item is string => Boolean(item));
  if (lines.length === 0 && !directions) return null;

  const canMap = Boolean(point && mapsKey);

  return (
    <div className="flex flex-col gap-4">
      {lines.length > 0 && <p className="whitespace-pre-line">{lines.join('\n')}</p>}
      {landmarks.length > 0 && <p>Nearby: {landmarks.join(', ')}</p>}
      {address?.visitingNotes && <p className="max-w-prose-site">{address.visitingNotes}</p>}
      {directions && (
        <a href={directions} className="font-semibold text-green underline underline-offset-4" target="_blank" rel="noopener noreferrer">
          Get directions
        </a>
      )}
      {canMap && point && mapsKey && !active && (
        <button type="button" className="block max-w-full text-left" onClick={() => setActive(true)}>
          <img
            src={staticMapUrl(point, { width: 640, height: 400, key: mapsKey })}
            alt=""
            width={640}
            height={400}
            className="h-auto w-full rounded-card border border-stone"
          />
          <span className="mt-2 inline-flex min-h-11 items-center font-semibold text-green underline underline-offset-4">
            Load interactive map
          </span>
        </button>
      )}
      {canMap && point && mapsKey && active && (
        <iframe
          title={`Map of ${label}`}
          src={embedMapUrl(point, mapsKey)}
          width={640}
          height={400}
          loading="lazy"
          className="h-auto min-h-[400px] w-full rounded-card border border-stone"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
}
```

The static image is `alt=""` because the address above it is the text alternative. The button's accessible name is "Load interactive map".

In Google Cloud, restrict `NEXT_PUBLIC_GOOGLE_MAPS_KEY` by HTTP referrer to `http://localhost:3000/*` and `https://www.village60plus.lk/*`, and enable only **Maps Static API** and **Maps Embed API**. Do not add the Maps JavaScript SDK.

- [ ] **Step 5: Run the tests**

```powershell
npx vitest run src/lib/maps.test.ts src/components/media/StaticMap.test.tsx
```

Expected: PASS (7 tests).

- [ ] **Step 6: Commit**

```powershell
git add src/lib/maps.ts src/lib/maps.test.ts src/components/media/StaticMap.tsx src/components/media/StaticMap.test.tsx
git commit -m "feat(media): show address and directions before an interactive map loads"
```

---

### Task 16: Cards and lists

**Files:**
- Create: `src/components/content/ResidenceCard.tsx`, `src/components/content/ResidenceCard.test.tsx`, `src/components/content/CareServiceCard.tsx`, `src/components/content/CareServiceCard.test.tsx`, `src/components/content/CapabilityList.tsx`, `src/components/content/CapabilityList.test.tsx`, `src/components/content/StepList.tsx`, `src/components/content/StepList.test.tsx`
- Modify: `src/lib/content-status.ts`, `src/lib/content-status.test.ts` (add `isContentStatus`)

**Interfaces:**
- Consumes: `SanityImage`, `CmsImage`, `StatusBadge`, `Chip`, `Button`, `residencePath`, `careServicePath`, `ContentStatus`.
- Produces:
  - `isContentStatus(value)` → type guard
  - `ResidenceCard({ residence })` — `RESIDENCE_CARD` query shape: `_id`, `name`, `slug`, `status`, `shortLocation`, `summary`, `heroImage`, `careTypes[]` of `{ _id, name, slug, status }`. Link goes through `residencePath` (`/oracle` or `/homes/<slug>`).
  - `CareServiceCard({ service })` — `CARE_SERVICE_CARD` shape: `_id`, `name`, `slug`, `status`, `summary`, `typicalDuration`, `heroImage`. Link is `careServicePath(slug)`.
  - `provisionLabel(value)` → `"Included"` | `"Quoted separately"` | `"Arranged through a partner"` | `null`
  - `CapabilityList({ items })` — `{ _key, title, description, provision, status }[]` from `careAndSupport`, `everydayLife`, `included`, `currentCapabilities`, `plannedCapabilities`
  - `StepList({ items })` — `{ _key, title, description }[]` from `process` and `howItWorks`, rendered as an ordered list
- Every card shows the image (when present), the location or category, the summary, a status badge, and a link whose text includes the item's name. A capability always shows its status and how it is provided. Unknown status or provision strings are omitted rather than printed raw.

- [ ] **Step 1: Extend the content-status test, then write the component tests**

Append to `src/lib/content-status.test.ts`, and import `isContentStatus`:

```ts
it('recognises only the six spec values', () => {
  expect(isContentStatus('coming-soon')).toBe(true);
  expect(isContentStatus('open')).toBe(false);
  expect(isContentStatus(null)).toBe(false);
});
```

```tsx
// src/components/content/ResidenceCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { ResidenceCard } from './ResidenceCard';

describe('ResidenceCard', () => {
  it('links Oracle to /oracle and shows status, location and care chips', () => {
    render(
      <ResidenceCard
        residence={{
          _id: 'residence.oracle',
          name: 'Oracle',
          slug: 'oracle',
          status: 'limited',
          shortLocation: 'Battaramulla',
          summary: 'A flagship residence with limited availability.',
          heroImage: imageFixture('Oracle residence'),
          careTypes: [{ _id: 'c1', name: 'Independent living', slug: 'independent-living', status: 'available' }],
        }}
      />,
    );
    expect(screen.getByRole('img', { name: 'Oracle residence' })).toBeInTheDocument();
    expect(screen.getByText('Limited availability')).toBeInTheDocument();
    expect(screen.getByText('Battaramulla')).toBeInTheDocument();
    expect(screen.getByText('Independent living')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Oracle' })).toHaveAttribute('href', '/oracle');
  });

  it('links other homes under /homes', () => {
    render(
      <ResidenceCard
        residence={{ _id: 'r', name: 'Serenity', slug: 'serenity', status: 'available', heroImage: null, careTypes: null }}
      />,
    );
    expect(screen.getByRole('link', { name: 'View Serenity' })).toHaveAttribute('href', '/homes/serenity');
  });
});
```

```tsx
// src/components/content/CareServiceCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CareServiceCard } from './CareServiceCard';

describe('CareServiceCard', () => {
  it('links to the care page and shows the status', () => {
    render(
      <CareServiceCard
        service={{
          _id: 'c',
          name: 'Respite care',
          slug: 'respite-care',
          status: 'available',
          summary: 'A short stay while the family is away.',
          typicalDuration: 'A few days to a few weeks',
        }}
      />,
    );
    expect(screen.getByText('Available now')).toBeInTheDocument();
    expect(screen.getByText('A few days to a few weeks')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read about Respite care' })).toHaveAttribute('href', '/living-and-care/respite-care');
  });
});
```

```tsx
// src/components/content/CapabilityList.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CapabilityList, provisionLabel } from './CapabilityList';

describe('CapabilityList', () => {
  it('names the three ways a service is provided', () => {
    expect(provisionLabel('included')).toBe('Included');
    expect(provisionLabel('optional-extra')).toBe('Quoted separately');
    expect(provisionLabel('partner-arranged')).toBe('Arranged through a partner');
    expect(provisionLabel('mystery')).toBeNull();
  });

  it('shows status and provision on every item and skips untitled ones', () => {
    render(
      <CapabilityList
        items={[
          { _key: 'a', title: 'Meals', description: 'Three meals a day.', provision: 'included', status: 'available' },
          { _key: 'b', title: 'Physiotherapy', description: null, provision: 'partner-arranged', status: 'pilot' },
          { _key: 'c', title: null, description: 'ignored', provision: 'included', status: 'available' },
        ]}
      />,
    );
    expect(screen.getByText('Meals')).toBeInTheDocument();
    expect(screen.getByText('Included')).toBeInTheDocument();
    expect(screen.getByText('Available now')).toBeInTheDocument();
    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('Arranged through a partner')).toBeInTheDocument();
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
  });

  it('renders nothing for an empty list', () => {
    const { container } = render(<CapabilityList items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

```tsx
// src/components/content/StepList.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StepList } from './StepList';

describe('StepList', () => {
  it('renders an ordered list and skips untitled steps', () => {
    render(
      <StepList
        items={[
          { _key: '1', title: 'Call or WhatsApp', description: 'Tell us what you need.' },
          { _key: '2', title: 'Visit', description: null },
          { _key: '3', title: null, description: 'skipped' },
        ]}
      />,
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('skipped')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```powershell
npx vitest run src/lib/content-status.test.ts src/components/content/ResidenceCard.test.tsx src/components/content/CareServiceCard.test.tsx src/components/content/CapabilityList.test.tsx src/components/content/StepList.test.tsx
```

Expected: FAIL — `isContentStatus` is not exported, and the component modules are missing. The three existing content-status tests still pass.

- [ ] **Step 3: Add `isContentStatus` to `src/lib/content-status.ts`**

```ts
export function isContentStatus(value: string | null | undefined): value is ContentStatus {
  return CONTENT_STATUSES.some((s) => s.value === value);
}
```

- [ ] **Step 4: Create the four components**

```tsx
// src/components/content/ResidenceCard.tsx
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';
import { residencePath } from '@/lib/routes';

export type ResidenceCardData = {
  _id: string;
  name: string | null;
  slug: string | null;
  status?: string | null;
  shortLocation?: string | null;
  summary?: string | null;
  heroImage?: CmsImage | null;
  careTypes?: Array<{ _id: string; name?: string | null; slug?: string | null; status?: string | null } | null> | null;
};

export function ResidenceCard({ residence }: { residence: ResidenceCardData }) {
  if (!residence.name || !residence.slug) return null;
  const cares = (residence.careTypes ?? []).filter((care): care is { _id: string; name: string } => Boolean(care?.name));
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-panel border border-stone bg-paper">
      <SanityImage image={residence.heroImage} width={640} height={400} sizes="(min-width: 1200px) 400px, 100vw" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        {isContentStatus(residence.status) && <StatusBadge status={residence.status} />}
        <h3>{residence.name}</h3>
        {residence.shortLocation && <p>{residence.shortLocation}</p>}
        {residence.summary && <p className="max-w-prose-site">{residence.summary}</p>}
        {cares.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {cares.map((care) => (
              <li key={care._id}>
                <Chip>{care.name}</Chip>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-2">
          <Button href={residencePath(residence.slug)} variant="text">
            View {residence.name}
          </Button>
        </div>
      </div>
    </article>
  );
}
```

```tsx
// src/components/content/CareServiceCard.tsx
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';
import { careServicePath } from '@/lib/routes';

export type CareServiceCardData = {
  _id: string;
  name: string | null;
  slug: string | null;
  status?: string | null;
  summary?: string | null;
  typicalDuration?: string | null;
  heroImage?: CmsImage | null;
};

export function CareServiceCard({ service }: { service: CareServiceCardData }) {
  if (!service.name || !service.slug) return null;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-panel border border-stone bg-paper">
      <SanityImage image={service.heroImage} width={640} height={400} sizes="(min-width: 1200px) 400px, 100vw" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        {isContentStatus(service.status) && <StatusBadge status={service.status} />}
        <h3>{service.name}</h3>
        {service.typicalDuration && <p className="text-bronze">{service.typicalDuration}</p>}
        {service.summary && <p className="max-w-prose-site">{service.summary}</p>}
        <div className="mt-auto pt-2">
          <Button href={careServicePath(service.slug)} variant="text">
            Read about {service.name}
          </Button>
        </div>
      </div>
    </article>
  );
}
```

```tsx
// src/components/content/CapabilityList.tsx
import { Chip } from '@/components/ui/Chip';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';

const PROVISION_LABEL = {
  included: 'Included',
  'optional-extra': 'Quoted separately',
  'partner-arranged': 'Arranged through a partner',
} as const;

export type CapabilityItem = {
  _key: string;
  title?: string | null;
  description?: string | null;
  provision?: string | null;
  status?: string | null;
};

export function provisionLabel(value: string | null | undefined): string | null {
  if (!value || !(value in PROVISION_LABEL)) return null;
  return PROVISION_LABEL[value as keyof typeof PROVISION_LABEL];
}

export function CapabilityList({ items }: { items: Array<CapabilityItem | null> | null | undefined }) {
  const rows = (items ?? []).filter((item): item is CapabilityItem & { title: string } => Boolean(item?.title));
  if (rows.length === 0) return null;
  return (
    <ul className="flex flex-col gap-6">
      {rows.map((item) => {
        const provision = provisionLabel(item.provision);
        return (
          <li key={item._key} className="border-t border-stone pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <h3>{item.title}</h3>
              {isContentStatus(item.status) && <StatusBadge status={item.status} />}
              {provision && <Chip>{provision}</Chip>}
            </div>
            {item.description && <p className="mt-2 max-w-prose-site">{item.description}</p>}
          </li>
        );
      })}
    </ul>
  );
}
```

```tsx
// src/components/content/StepList.tsx
export type StepItem = { _key: string; title?: string | null; description?: string | null };

export function StepList({ items }: { items: Array<StepItem | null> | null | undefined }) {
  const rows = (items ?? []).filter((item): item is StepItem & { title: string } => Boolean(item?.title));
  if (rows.length === 0) return null;
  return (
    <ol className="flex list-decimal flex-col gap-6 pl-6">
      {rows.map((item) => (
        <li key={item._key} className="max-w-prose-site">
          <h3 className="inline">{item.title}</h3>
          {item.description && <p className="mt-1">{item.description}</p>}
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 5: Run the tests**

```powershell
npx vitest run src/lib/content-status.test.ts src/components/content
```

Expected: PASS. `StepList` uses `list-decimal`, so the accessible list is still `OL` and the numbers are visible.

- [ ] **Step 6: Commit**

```powershell
git add src/lib/content-status.ts src/lib/content-status.test.ts src/components/content
git commit -m "feat(content): add residence and care cards plus capability and step lists"
```

---

### Task 17: Page sections — hero, sections, CTA, FAQ, breadcrumbs

**Files:**
- Create: `src/components/ui/Breadcrumbs.tsx`, `src/components/ui/Breadcrumbs.test.tsx`, `src/components/content/PageHero.tsx`, `src/components/content/PageHero.test.tsx`, `src/components/content/SectionList.tsx`, `src/components/content/SectionList.test.tsx`, `src/components/content/CtaBand.tsx`, `src/components/content/CtaBand.test.tsx`, `src/components/content/FaqList.tsx`, `src/components/content/FaqList.test.tsx`

**Interfaces:**
- Consumes: `Section`, `SectionTone`, `isDarkTone`, `Heading`, `Button`, `StatusBadge`, `SanityImage`, `PortableText`, `safeHref`, `isContentStatus`.
- Produces:
  - `Breadcrumbs({ items })` where `items` is `{ label: string; href?: string }[]`. The last item is the current page (`aria-current="page"`, not a link). Nav is labelled `Breadcrumb`.
  - `PageHero({ eyebrow?, title, intro?, image?, status?, tone?, children? })` — the only H1 on the page (`id="page-title"`). Render it once per page, because it always uses `id="page-title"` and is the only H1. `children` is the action row (Call, WhatsApp, enquiry) supplied by the page. `tone` `green` or `night` uses the dark badge and heading. `image` is the priority image.
  - `type ContentSectionData` and `SectionList({ sections })` — the `sections[]` projection (`_key`, `eyebrow`, `heading`, `body`, `tone`, `cta`, `status`, `image`). Unknown tones fall back to `ivory`. A CTA renders only when `safeHref` accepts it.
  - `CtaBand({ heading, body?, tone?, children? })` — closing band. Pages pass buttons as `children`; this component does not open a form.
  - `FaqList({ items, heading? })` — `{ _id, question, answer }[]` from `faqs[]` or `FAQS_FOR_PAGE_QUERY`. Native `<details>`, no client JavaScript. Returns null when empty. Default heading `"Questions"`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/ui/Breadcrumbs.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('links ancestors and marks the current page', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Our homes', href: '/homes' },
          { label: 'Serenity', href: '/homes/serenity' },
        ]}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Our homes' })).toHaveAttribute('href', '/homes');
    const current = screen.getByText('Serenity');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.closest('a')).toBeNull();
  });
});
```

```tsx
// src/components/content/PageHero.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { PageHero } from './PageHero';

describe('PageHero', () => {
  it('renders a single h1, the intro and a priority image', () => {
    render(
      <PageHero title="Our homes" intro="Different homes, one philosophy." image={imageFixture('A garden')} status="available">
        <a href="tel:+94112504838">Call</a>
      </PageHero>,
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Our homes' })).toHaveAttribute('id', 'page-title');
    expect(screen.getByText('Different homes, one philosophy.')).toBeInTheDocument();
    expect(screen.getByText('Available now')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'A garden' })).toHaveAttribute('fetchpriority', 'high');
    expect(screen.getByRole('link', { name: 'Call' })).toBeInTheDocument();
  });

  it('uses the dark badge on a night hero', () => {
    render(<PageHero title="Oracle" tone="night" status="limited" />);
    expect(screen.getByText('Limited availability').className).toContain('text-pale-gold');
  });
});
```

```tsx
// src/components/content/SectionList.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionList } from './SectionList';

const body = [
  {
    _type: 'block' as const,
    _key: 'b',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span' as const, _key: 's', text: 'People should grow older with dignity.', marks: [] }],
  },
];

describe('SectionList', () => {
  it('renders each section heading and drops an unsafe call to action', () => {
    render(
      <SectionList
        sections={[
          { _key: 'a', heading: 'A home first', body, tone: 'ivory', cta: { label: 'Read more', href: '/our-story' } },
          { _key: 'b', heading: 'The next chapter', body: null, tone: 'green', status: 'coming-soon', cta: { label: 'Bad', href: 'javascript:alert(1)' } },
          { _key: 'c', heading: null, body },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'A home first' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', '/our-story');
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Bad' })).not.toBeInTheDocument();
    expect(screen.queryByText('People should grow older with dignity.')).toBeInTheDocument();
  });
});
```

```tsx
// src/components/content/CtaBand.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CtaBand } from './CtaBand';

describe('CtaBand', () => {
  it('renders the heading and whatever actions the page passes', () => {
    render(
      <CtaBand heading="Talk to a person" body="Call, WhatsApp or send a short note.">
        <button type="button">Enquire</button>
      </CtaBand>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Talk to a person' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enquire' })).toBeInTheDocument();
  });
});
```

```tsx
// src/components/content/FaqList.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FaqList } from './FaqList';

const answer = [
  {
    _type: 'block' as const,
    _key: 'b',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span' as const, _key: 's', text: 'No. Describe the situation and the team will explain the options.', marks: [] }],
  },
];

describe('FaqList', () => {
  it('uses a disclosure for each question and skips blanks', () => {
    render(
      <FaqList
        items={[
          { _id: 'faq.1', question: 'Do I need to know which type of care?', answer },
          { _id: 'faq.2', question: null, answer },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Questions' })).toBeInTheDocument();
    const summary = screen.getByText('Do I need to know which type of care?');
    expect(summary.tagName).toBe('SUMMARY');
    expect(screen.getByText(/Describe the situation/)).toBeInTheDocument();
    expect(screen.getAllByText(/Describe the situation/)).toHaveLength(1);
  });

  it('renders nothing when there are no questions', () => {
    const { container } = render(<FaqList items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```powershell
npx vitest run src/components/ui/Breadcrumbs.test.tsx src/components/content/PageHero.test.tsx src/components/content/SectionList.test.tsx src/components/content/CtaBand.test.tsx src/components/content/FaqList.test.tsx
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create `src/components/ui/Breadcrumbs.tsx`**

```tsx
import Link from 'next/link';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="gutter mx-auto w-full max-w-site py-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="text-green underline underline-offset-4">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-bronze">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 4: Create the content sections**

```tsx
// src/components/content/PageHero.tsx
import type { ReactNode } from 'react';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Heading } from '@/components/ui/Heading';
import { Section, isDarkTone, type SectionTone } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  status,
  tone = 'ivory',
  children,
}: {
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  image?: CmsImage | null;
  status?: string | null;
  tone?: SectionTone;
  children?: ReactNode;
}) {
  const onDark = isDarkTone(tone);
  const showImage = Boolean(image?.asset?.url && image?.alt?.trim());
  return (
    <Section tone={tone} labelledBy="page-title">
      <div className={showImage ? 'grid items-center gap-8 lg:grid-cols-2' : 'max-w-prose-site'}>
        <div className="flex flex-col gap-4">
          {isContentStatus(status) && <StatusBadge status={status} tone={onDark ? 'dark' : 'light'} />}
          <Heading as="h1" id="page-title" eyebrow={eyebrow ?? undefined} onDark={onDark}>
            {title}
          </Heading>
          {intro && <p className="max-w-prose-site">{intro}</p>}
          {children && <div className="flex flex-wrap gap-3">{children}</div>}
        </div>
        {showImage && <SanityImage image={image} width={800} height={500} priority sizes="(min-width: 1200px) 600px, 100vw" />}
      </div>
    </Section>
  );
}
```

```tsx
// src/components/content/SectionList.tsx
import type { PortableTextBlock } from '@portabletext/react';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section, isDarkTone, type SectionTone } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { isContentStatus } from '@/lib/content-status';
import { PortableText, safeHref } from './PortableText';

const TONES: SectionTone[] = ['ivory', 'sand', 'paper', 'mist', 'green', 'night'];

function asTone(value: string | null | undefined): SectionTone {
  return TONES.includes(value as SectionTone) ? (value as SectionTone) : 'ivory';
}

export type ContentSectionData = {
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  body?: PortableTextBlock[] | null;
  tone?: string | null;
  status?: string | null;
  image?: CmsImage | null;
  cta?: { label?: string | null; href?: string | null } | null;
};

export function SectionList({ sections }: { sections: Array<ContentSectionData | null> | null | undefined }) {
  const rows = (sections ?? []).filter((section): section is ContentSectionData & { heading: string } => Boolean(section?.heading));
  return (
    <>
      {rows.map((section) => {
        const tone = asTone(section.tone);
        const onDark = isDarkTone(tone);
        const href = safeHref(section.cta?.href);
        const showImage = Boolean(section.image?.asset?.url && section.image?.alt?.trim());
        return (
          <Section key={section._key} tone={tone}>
            <div className="flex flex-col gap-4">
              {isContentStatus(section.status) && <StatusBadge status={section.status} tone={onDark ? 'dark' : 'light'} />}
              <Heading as="h2" eyebrow={section.eyebrow ?? undefined} onDark={onDark}>
                {section.heading}
              </Heading>
            </div>
            <div className={showImage ? 'mt-8 grid items-start gap-8 lg:grid-cols-2' : 'mt-8'}>
              <PortableText value={section.body} onDark={onDark} />
              {showImage && <SanityImage image={section.image} width={640} height={400} sizes="(min-width: 1200px) 560px, 100vw" />}
            </div>
            {section.cta?.label && href && (
              <div className="mt-6">
                <Button href={href} onDark={onDark}>
                  {section.cta.label}
                </Button>
              </div>
            )}
          </Section>
        );
      })}
    </>
  );
}
```

```tsx
// src/components/content/CtaBand.tsx
import type { ReactNode } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Section, isDarkTone, type SectionTone } from '@/components/ui/Section';

export function CtaBand({
  heading,
  body,
  tone = 'sand',
  children,
}: {
  heading: string;
  body?: string | null;
  tone?: SectionTone;
  children?: ReactNode;
}) {
  return (
    <Section tone={tone}>
      <Heading as="h2" onDark={isDarkTone(tone)}>
        {heading}
      </Heading>
      {body && <p className="mt-4 max-w-prose-site">{body}</p>}
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
    </Section>
  );
}
```

```tsx
// src/components/content/FaqList.tsx
import type { PortableTextBlock } from '@portabletext/react';
import { useId } from 'react';
import { PortableText } from './PortableText';

export type FaqItem = {
  _id: string;
  question?: string | null;
  answer?: PortableTextBlock[] | null;
};

export function FaqList({ items, heading = 'Questions' }: { items: Array<FaqItem | null> | null | undefined; heading?: string }) {
  const id = useId();
  const rows = (items ?? []).filter((item): item is FaqItem & { question: string } => Boolean(item?.question));
  if (rows.length === 0) return null;
  return (
    <section aria-labelledby={id} className="section-space">
      <div className="gutter mx-auto w-full max-w-site">
        <h2 id={id}>{heading}</h2>
        <div className="mt-8 max-w-prose-site border-b border-stone">
          {rows.map((item) => (
            <details key={item._id} className="group border-t border-stone">
              <summary className="min-h-11 py-3 font-semibold">{item.question}</summary>
              <div className="pb-4">
                <PortableText value={item.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`FaqList` is a server component. `<details>` opens without JavaScript. Do not replace it with a client accordion.

- [ ] **Step 5: Run the tests**

```powershell
npx vitest run src/components/ui/Breadcrumbs.test.tsx src/components/content
```

Expected: PASS. `PageHero` and `SectionList` each contribute one `h1` or `h2`; `FaqList`'s answer is in the DOM while the disclosure is closed, which is what native `<details>` does.

- [ ] **Step 6: Commit**

```powershell
git add src/components/ui/Breadcrumbs.tsx src/components/ui/Breadcrumbs.test.tsx src/components/content
git commit -m "feat(content): add page hero, sections, CTA band, FAQ and breadcrumbs"
```

---

### Task 18: Metadata, JSON-LD, sitemap and robots

**Files:**
- Create: `src/lib/seo.ts`, `src/lib/seo.test.ts`, `src/components/seo/JsonLd.tsx`, `src/components/seo/JsonLd.test.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: `src/lib/env.ts`, `src/lib/env.test.ts`, `.env.example`, `src/app/layout.tsx` (metadataBase and Search Console verification only)

**Interfaces:**
- Consumes: `getPublicEnv().siteUrl`, `isOperating`, `isContentStatus`, `pagePath`, `residencePath`, `careServicePath`, `offeringPath`, `urlFor`, `CmsImage`, `fetchPublished`, `SITEMAP_QUERY`, `type Crumb` (same `{ label, href? }` shape as `Breadcrumbs`).
- Produces:
  - `getPublicEnv().gscVerification: string | null` from `NEXT_PUBLIC_GSC_VERIFICATION` (optional)
  - `absoluteUrl(siteUrl, path)`, `pageMetadata({ siteUrl, path, fallbackTitle, fallbackDescription, seo? })` → Next `Metadata`
  - `organizationJsonLd`, `websiteJsonLd`, `breadcrumbJsonLd`, `localBusinessJsonLd`, `serviceJsonLd` → `JsonLd | null` where a builder returns null when the visible status is not operating
  - `serializeJsonLd(data)` and `JsonLd({ data })` — one `<script type="application/ld+json">` per object; `<` is escaped so a CMS string cannot close the script
  - `sitemapEntries(siteUrl, data)` used by `src/app/sitemap.ts`; `robotsConfig(siteUrl)` used by `src/app/robots.ts`
- Locked rules (spec §16): no `priceRange`, no `aggregateRating`, no `review`, no `Offer`, no medical `@type` (`MedicalBusiness`, `MedicalOrganization`, `Physician`, `NursingHome`). `LocalBusiness` and `Service` are emitted only for `available` and `limited`. Titles use `{ absolute }` so the root template cannot double the brand name. `noIndex` pages are left out of the sitemap. Oracle is listed at `/oracle` only.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/env.test.ts`:

```ts
it('Search Console verification is optional', () => {
  vi.stubEnv('NEXT_PUBLIC_GSC_VERIFICATION', '');
  expect(getPublicEnv().gscVerification).toBeNull();
  vi.stubEnv('NEXT_PUBLIC_GSC_VERIFICATION', 'abc123');
  expect(getPublicEnv().gscVerification).toBe('abc123');
});
```

```ts
// src/lib/seo.test.ts
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  localBusinessJsonLd,
  organizationJsonLd,
  pageMetadata,
  robotsConfig,
  serviceJsonLd,
  sitemapEntries,
  websiteJsonLd,
} from './seo';

const SITE = 'https://www.village60plus.lk';

function types(value: unknown): string[] {
  const found: string[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) {
        if (key === '@type' && typeof child === 'string') found.push(child);
        walk(child);
      }
    }
  };
  walk(value);
  return found;
}

describe('absoluteUrl', () => {
  it('joins the site origin and a path once', () => {
    expect(absoluteUrl(SITE, '/')).toBe('https://www.village60plus.lk/');
    expect(absoluteUrl(`${SITE}/`, '/homes/serenity')).toBe('https://www.village60plus.lk/homes/serenity');
  });
});

describe('pageMetadata', () => {
  it('uses the CMS title absolutely, canonicalises the path, and indexes by default', () => {
    const meta = pageMetadata({
      siteUrl: SITE,
      path: '/homes/serenity',
      fallbackTitle: 'Serenity',
      fallbackDescription: 'A home in Colombo.',
      seo: { title: 'Serenity | Village 60 Plus', description: 'Visit Serenity.', canonical: null, noIndex: false },
    });
    expect(meta.title).toEqual({ absolute: 'Serenity | Village 60 Plus' });
    expect(meta.description).toBe('Visit Serenity.');
    expect(meta.alternates).toEqual({ canonical: 'https://www.village60plus.lk/homes/serenity' });
    expect(meta.robots).toEqual({ index: true, follow: true });
  });

  it('falls back when SEO fields are empty and honours noIndex', () => {
    const meta = pageMetadata({
      siteUrl: SITE,
      path: '/sage',
      fallbackTitle: 'SAGE',
      fallbackDescription: 'Tools for the care team.',
      seo: { title: null, description: '  ', canonical: 'javascript:alert(1)', noIndex: true },
    });
    expect(meta.title).toEqual({ absolute: 'SAGE' });
    expect(meta.description).toBe('Tools for the care team.');
    expect(meta.alternates).toEqual({ canonical: 'https://www.village60plus.lk/sage' });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it('adds an Open Graph image from the CMS image', () => {
    const meta = pageMetadata({
      siteUrl: SITE,
      path: '/',
      fallbackTitle: 'Village 60 Plus',
      fallbackDescription: 'Homes and care.',
      seo: { title: null, description: null, canonical: null, noIndex: false, image: imageFixture('The verandah') },
    });
    const images = meta.openGraph?.images;
    const image = Array.isArray(images) ? images[0] : undefined;
    expect(image).toMatchObject({ alt: 'The verandah', width: 1200, height: 750 });
    expect(typeof image === 'object' && image && 'url' in image && String(image.url)).toContain('auto=format');
  });
});

describe('structured data', () => {
  it('describes the organisation and the website without a search action', () => {
    expect(organizationJsonLd({ brandName: 'Village 60 Plus', legalName: 'Village 60 Plus (Pvt) Ltd', siteUrl: SITE, phone: '+94112504838', email: 'hello@example.com' })).toMatchObject({
      '@type': 'Organization',
      name: 'Village 60 Plus (Pvt) Ltd',
      url: SITE,
      telephone: '+94112504838',
    });
    const website = websiteJsonLd({ brandName: 'Village 60 Plus', siteUrl: SITE });
    expect(website['@type']).toBe('WebSite');
    expect(website).not.toHaveProperty('potentialAction');
  });

  it('emits LocalBusiness and Service only for operating statuses, and never prices, ratings or medical types', () => {
    const address = { line1: '133/19 Nawala Road', city: 'Colombo 05', country: 'Sri Lanka' };
    const live = localBusinessJsonLd({ name: 'Serenity', status: 'available', path: '/homes/serenity', siteUrl: SITE, phone: '+94112504838', address });
    expect(live).toMatchObject({ '@type': 'LocalBusiness', name: 'Serenity' });
    expect(localBusinessJsonLd({ name: 'The Grove', status: 'coming-soon', path: '/homes/the-grove', siteUrl: SITE, phone: '+94112504838', address })).toBeNull();
    expect(serviceJsonLd({ name: 'Respite care', status: 'available', path: '/living-and-care/respite-care', siteUrl: SITE, brandName: 'Village 60 Plus', description: 'A short stay.' })).toMatchObject({
      '@type': 'Service',
    });
    expect(serviceJsonLd({ name: 'Rehabilitation', status: 'planned', path: '/living-and-care/rehabilitation', siteUrl: SITE, brandName: 'Village 60 Plus' })).toBeNull();

    const forbidden = ['priceRange', 'aggregateRating', 'review', 'offers', 'MedicalBusiness', 'MedicalOrganization', 'NursingHome'];
    const blob = JSON.stringify([live, organizationJsonLd({ brandName: 'Village 60 Plus', legalName: null, siteUrl: SITE, phone: '+94112504838', email: 'hello@example.com' })]);
    for (const word of forbidden) expect(blob).not.toContain(word);
    expect(types(live)).toEqual(['LocalBusiness', 'PostalAddress']);
  });

  it('builds a breadcrumb list with absolute item URLs', () => {
    expect(
      breadcrumbJsonLd(SITE, [
        { label: 'Home', href: '/' },
        { label: 'Serenity', href: '/homes/serenity' },
      ]),
    ).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { position: 1, name: 'Home', item: 'https://www.village60plus.lk/' },
        { position: 2, name: 'Serenity', item: 'https://www.village60plus.lk/homes/serenity' },
      ],
    });
  });
});

describe('sitemap and robots', () => {
  it('lists indexable URLs once, with Oracle at /oracle, and skips noIndex pages', () => {
    const urls = sitemapEntries(SITE, {
      pages: [
        { slug: 'home', _updatedAt: '2026-10-01' },
        { slug: 'privacy', _updatedAt: '2026-10-02', noIndex: true },
      ],
      residences: [
        { slug: 'oracle', _updatedAt: '2026-10-03' },
        { slug: 'the-grove', _updatedAt: '2026-10-04' },
      ],
      careServices: [{ slug: 'respite-care', _updatedAt: '2026-10-05' }],
      offerings: [{ slug: 'sage', _updatedAt: '2026-10-06' }],
    }).map((entry) => entry.url);

    expect(urls).toEqual([
      'https://www.village60plus.lk/',
      'https://www.village60plus.lk/oracle',
      'https://www.village60plus.lk/homes/the-grove',
      'https://www.village60plus.lk/living-and-care/respite-care',
      'https://www.village60plus.lk/sage',
    ]);
    expect(urls.some((url) => url.includes('/homes/oracle'))).toBe(false);
  });

  it('allows the site, blocks the studio and API, and points at the sitemap', () => {
    expect(robotsConfig(SITE)).toEqual({
      rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
      sitemap: 'https://www.village60plus.lk/sitemap.xml',
    });
  });
});
```

```tsx
// src/components/seo/JsonLd.test.tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JsonLd } from './JsonLd';
import { serializeJsonLd } from '@/lib/seo';

describe('JsonLd', () => {
  it('escapes < so a value cannot close the script', () => {
    const json = serializeJsonLd({ '@context': 'https://schema.org', name: '</script><script>alert(1)' });
    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toMatchObject({ name: '</script><script>alert(1)' });
  });

  it('renders one script per object and skips nulls', () => {
    const { container } = render(
      <JsonLd data={[{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Village 60 Plus' }, null]} />,
    );
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0]?.innerHTML).toContain('WebSite');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```powershell
npx vitest run src/lib/env.test.ts src/lib/seo.test.ts src/components/seo/JsonLd.test.tsx
```

Expected: FAIL — `gscVerification` is undefined and `./seo` / `./JsonLd` are missing. The four existing env tests still pass.

- [ ] **Step 3: Add the optional env and create `src/lib/seo.ts`**

In `getPublicEnv()` add:

```ts
gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || null,
```

Append to `.env.example` under the public block:

```dotenv
NEXT_PUBLIC_GSC_VERIFICATION=
```

```ts
// src/lib/seo.ts
import type { Metadata, MetadataRoute } from 'next';
import type { SanityImageSource } from '@sanity/image-url';
import type { CmsImage } from '@/components/media/SanityImage';
import { isContentStatus, isOperating } from '@/lib/content-status';
import type { MapAddress } from '@/lib/maps';
import { addressLines } from '@/lib/maps';
import { careServicePath, offeringPath, pagePath, residencePath } from '@/lib/routes';
import { urlFor } from '@/sanity/image';

export type JsonLd = Record<string, unknown>;

export type SeoInput = {
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  noIndex?: boolean | null;
  image?: CmsImage | null;
} | null;

export function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/$/, '');
  if (path === '/' || path === '') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function httpsOnSite(siteUrl: string, value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const site = new URL(siteUrl);
    return url.protocol === 'https:' && url.host === site.host ? url.toString() : null;
  } catch {
    return null;
  }
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function pageMetadata({
  siteUrl,
  path,
  fallbackTitle,
  fallbackDescription,
  seo,
}: {
  siteUrl: string;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  seo?: SeoInput;
}): Metadata {
  const title = text(seo?.title, fallbackTitle);
  const description = text(seo?.description, fallbackDescription);
  const canonical = httpsOnSite(siteUrl, seo?.canonical) ?? absoluteUrl(siteUrl, path);
  const index = seo?.noIndex !== true;
  const image = ogImage(seo?.image);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index, follow: index },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Village 60 Plus',
      locale: 'en_LK',
      type: 'website',
      images: image ? [image] : undefined,
    },
  };
}

function ogImage(image: CmsImage | null | undefined): { url: string; width: number; height: number; alt: string } | undefined {
  const alt = image?.alt?.trim();
  if (!image?.asset?.url || !alt) return undefined;
  const width = 1200;
  const ratio = image.asset.metadata?.dimensions?.aspectRatio;
  const height = Math.max(1, Math.round(width / (ratio && ratio > 0 ? ratio : 1.6)));
  return { url: urlFor(image as SanityImageSource).width(width).height(height).fit('crop').url(), width, height, alt };
}

export function organizationJsonLd(input: {
  brandName: string;
  legalName?: string | null;
  siteUrl: string;
  phone: string;
  email: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.legalName?.trim() || input.brandName,
    url: input.siteUrl.replace(/\/$/, ''),
    telephone: input.phone,
    email: input.email,
  };
}

export function websiteJsonLd(input: { brandName: string; siteUrl: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.brandName,
    url: input.siteUrl.replace(/\/$/, ''),
  };
}

export function breadcrumbJsonLd(siteUrl: string, items: Array<{ label: string; href?: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(siteUrl, item.href) } : {}),
    })),
  };
}

function operating(status: string | null | undefined): boolean {
  return isContentStatus(status) && isOperating(status);
}

export function localBusinessJsonLd(input: {
  name: string;
  status?: string | null;
  path: string;
  siteUrl: string;
  phone: string;
  description?: string | null;
  address?: MapAddress | null;
}): JsonLd | null {
  const lines = addressLines(input.address);
  if (!operating(input.status) || lines.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: input.name,
    url: absoluteUrl(input.siteUrl, input.path),
    telephone: input.phone,
    ...(input.description ? { description: input.description } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: [input.address?.line1, input.address?.line2].filter(Boolean).join(', '),
      addressLocality: input.address?.city ?? undefined,
      postalCode: input.address?.postcode ?? undefined,
      addressCountry: input.address?.country ?? undefined,
    },
  };
}

export function serviceJsonLd(input: {
  name: string;
  status?: string | null;
  path: string;
  siteUrl: string;
  brandName: string;
  description?: string | null;
}): JsonLd | null {
  if (!operating(input.status)) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    url: absoluteUrl(input.siteUrl, input.path),
    ...(input.description ? { description: input.description } : {}),
    provider: { '@type': 'Organization', name: input.brandName, url: input.siteUrl.replace(/\/$/, '') },
  };
}

export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export type SitemapGroups = {
  pages?: Array<{ slug?: string | null; _updatedAt?: string | null; noIndex?: boolean | null } | null> | null;
  residences?: Array<{ slug?: string | null; _updatedAt?: string | null } | null> | null;
  careServices?: Array<{ slug?: string | null; _updatedAt?: string | null } | null> | null;
  offerings?: Array<{ slug?: string | null; _updatedAt?: string | null } | null> | null;
};

export function sitemapEntries(siteUrl: string, data: SitemapGroups): Array<{ url: string; lastModified?: string }> {
  const entries: Array<{ url: string; lastModified?: string }> = [];
  const push = (path: string | null, updated?: string | null) => {
    if (!path) return;
    entries.push({ url: absoluteUrl(siteUrl, path), ...(updated ? { lastModified: updated } : {}) });
  };
  for (const page of data.pages ?? []) {
    if (!page?.slug || page.noIndex) continue;
    push(pagePath(page.slug), page._updatedAt);
  }
  for (const residence of data.residences ?? []) push(residence?.slug ? residencePath(residence.slug) : null, residence?._updatedAt);
  for (const service of data.careServices ?? []) push(service?.slug ? careServicePath(service.slug) : null, service?._updatedAt);
  for (const offering of data.offerings ?? []) push(offering?.slug ? offeringPath(offering.slug) : null, offering?._updatedAt);
  return entries;
}

export function robotsConfig(siteUrl: string): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
```

Do not add a `SearchAction`. Do not add `priceRange`, ratings, reviews, or a medical `@type` in any builder.

- [ ] **Step 4: Create the script component and the routes**

```tsx
// src/components/seo/JsonLd.tsx
import { serializeJsonLd, type JsonLd as JsonLdData } from '@/lib/seo';

export function JsonLd({ data }: { data: Array<JsonLdData | null | undefined> | JsonLdData }) {
  const items = (Array.isArray(data) ? data : [data]).filter((item): item is JsonLdData => Boolean(item));
  if (items.length === 0) return null;
  return (
    <>
      {items.map((item) => (
        <script key={serializeJsonLd(item)} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }} />
      ))}
    </>
  );
}
```

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getPublicEnv } from '@/lib/env';
import { sitemapEntries } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { SITEMAP_QUERY } from '@/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchPublished(SITEMAP_QUERY, {}, ['sitemap']);
  return sitemapEntries(getPublicEnv().siteUrl, data);
}
```

If `tsc` reports that the query result is not assignable to `SitemapGroups`, widen the matching field on `SitemapGroups`. Do not cast.

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next';
import { getPublicEnv } from '@/lib/env';
import { robotsConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return robotsConfig(getPublicEnv().siteUrl);
}
```

- [ ] **Step 5: Point the root metadata at the site URL**

In `src/app/layout.tsx`, replace the `metadata` export with:

```tsx
import { getPublicEnv } from '@/lib/env';

const { siteUrl, gscVerification } = getPublicEnv();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Village 60 Plus', template: '%s | Village 60 Plus' },
  description: 'Homes, care and support for later life in Sri Lanka.',
  verification: gscVerification ? { google: gscVerification } : undefined,
};
```

Page-level `pageMetadata()` sets `title: { absolute }`, so this template applies only when a page forgets to. Keep `lang="en-LK"` on `<html>`.

- [ ] **Step 6: Run tests, typecheck and build**

```powershell
npx vitest run src/lib/env.test.ts src/lib/seo.test.ts src/components/seo/JsonLd.test.tsx
npm run typecheck
npm run build
```

Expected: tests PASS (the seo file's cases plus the new env case). The build lists `○ /sitemap.xml` and `○ /robots.txt`. Open neither against production data; an empty dataset yields a sitemap with no URLs and that is fine.

- [ ] **Step 7: Commit**

```powershell
git add src/lib/seo.ts src/lib/seo.test.ts src/lib/env.ts src/lib/env.test.ts src/components/seo .env.example src/app/layout.tsx src/app/sitemap.ts src/app/robots.ts
git commit -m "feat(seo): add metadata, JSON-LD, sitemap and robots"
```

**Phase 2 exit criteria:** `SanityImage` drops images without alt; `VideoHero` does not autoplay on the server or when reduced-motion or Save-Data is set; `Gallery` moves only from buttons; `StaticMap` shows the address before any iframe; cards and capability lists show spec status labels; `FaqList` is native `<details>`; `localBusinessJsonLd` / `serviceJsonLd` return null for coming-soon, planned and in-development; the sitemap has `/oracle` and not `/homes/oracle`. `npm test` and `npm run build` pass. Phase 3 (enquiry forms, then wiring site chrome) can start.

---


## Phase 3 — Enquiry forms

**Outcome:** one Server Action handles every form in spec §9. It validates with the same Zod schema the UI describes, rate-limits, emails the inbox configured for that form, and returns a state the form can render without losing what was typed. WhatsApp continuation never puts the visitor's message, name or phone into the link.

**Decisions:**
- Six kinds already exist in `src/lib/forms/kinds.ts` (`general`, `find-care`, `oracle-visit`, `grove-interest`, `silver-roots-partner`, `destination-retirement`). This phase does not add kinds.
- The general panel has five primary fields (name, phone, topic, who for, message). The privacy acknowledgement is extra and required on every kind. Find the Right Care asks who, what help, an optional residence or location, name and phone — nothing clinical.
- `processEnquiry` in `src/lib/forms/process.ts` is the testable core. `submitEnquiry` in `src/lib/forms/submit.ts` only gathers env, headers and the Resend client, then calls it.
- A filled honeypot (`company`) returns the success state and sends nothing.
- Email subjects come only from `FORM_KINDS[].subject`. The body is plain text. No React Email.
- Recipients: the `siteSettings.formRecipients` row for that kind, else the `general` row, else `FORM_FALLBACK_RECIPIENT`.
- Rate limit is 5 submissions per 10 minutes per IP. Upstash when `UPSTASH_REDIS_REST_URL` is set; otherwise the in-memory limiter (fine for local dev and a single Node server, not shared across Vercel instances — production must set Upstash).
- Next.js already rejects cross-origin Server Action posts. `processEnquiry` also rejects a missing `Origin`, and an `Origin` whose host equals neither `siteHost` (`NEXT_PUBLIC_SITE_URL`) nor `requestHost` (the host that served the action, including a Vercel preview). The rejection sentence is "This form can only be submitted from the Village 60 Plus website."

### Task 19: Form definitions and shared Zod schemas

**Files:**
- Create: `src/lib/forms/definitions.ts`, `src/lib/forms/schemas.ts`, `src/lib/forms/schemas.test.ts`
- Modify: `package.json` is unchanged; Zod is installed here.

**Interfaces:**
- Consumes: `FormKind`, `FORM_KINDS` from `src/lib/forms/kinds.ts` (Task 8).
- Produces:
  - `formDefinition(kind)` → `{ kind, heading, intro, submitLabel, fields }` where each field is `{ name, label, type: 'text'|'tel'|'email'|'textarea'|'select'|'date'|'checkbox', required, options?, autocomplete?, maxLength? }`
  - Option lists `WHO_FOR`, `HELP_TYPES`, `ENQUIRY_TOPICS`, `VISIT_TIMES`, `VISITOR_COUNTS`, `STAY_LENGTHS` as `{ value, label }[]`
  - `parseEnquiry(kind, raw, options?)` → `{ ok: true, data: EnquiryData } | { ok: false, fieldErrors: Record<string, string>, formErrors: string[] }`
  - `EnquiryData` — the parsed fields for that kind (honeypot excluded)
  - `valuesFromRaw(raw)` → `Record<string, string>` of everything except `kind`, `context` and `company`, used to repopulate the form
  - `summaryLines(kind, values)` → `string[]`. For each field except `privacy`, when `values[field.name]` is non-empty, emit `` `${label}: ${display}` ``. `display` is the matching option label when the field has options, otherwise the raw value. Strip a trailing ` (optional)` from the label.

- [ ] **Step 1: Install Zod**

```powershell
npm install zod
```

Expected: `zod@4.x` in `package.json`.

- [ ] **Step 2: Write the failing test `src/lib/forms/schemas.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { FORM_KINDS, type FormKind } from './kinds';
import { formDefinition, summaryLines } from './definitions';
import { parseEnquiry, valuesFromRaw } from './schemas';

const TODAY = '2026-10-12';

function raw(fields: Record<string, string>): Record<string, string> {
  return fields;
}

describe('form definitions', () => {
  it('defines every form kind', () => {
    for (const kind of FORM_KINDS) {
      const def = formDefinition(kind.value);
      expect(def.kind).toBe(kind.value);
      expect(def.fields.some((field) => field.name === 'privacy' && field.required)).toBe(true);
      expect(def.fields.filter((field) => field.name !== 'privacy').length).toBeLessThanOrEqual(kind.value === 'general' ? 5 : 8);
    }
  });

  it('keeps the general panel to five primary fields', () => {
    const names = formDefinition('general').fields.map((field) => field.name);
    expect(names).toEqual(['name', 'phone', 'topic', 'whoFor', 'message', 'privacy']);
  });

  it('does not ask Find the Right Care for a diagnosis', () => {
    const names = formDefinition('find-care').fields.map((field) => field.name);
    expect(names).toEqual(['whoFor', 'helpType', 'residencePreference', 'name', 'phone', 'privacy']);
    expect(names).not.toContain('message');
  });

  it('summarises submitted values with option labels', () => {
    expect(summaryLines('general', { name: 'Nimal Perera', phone: '+94771234567', topic: 'oracle', whoFor: 'parent', message: 'Please call after 6pm.', privacy: 'on' })).toEqual([
      'Your name: Nimal Perera',
      'Phone or WhatsApp: +94771234567',
      'I am enquiring about: Oracle',
      'Who is this for?: A parent',
      'Message: Please call after 6pm.',
    ]);
  });
});

describe('parseEnquiry', () => {
  it('accepts a complete general enquiry and trims text', () => {
    const result = parseEnquiry(
      'general',
      raw({
        name: '  Nimal Perera  ',
        phone: '+94 77 123 4567',
        topic: 'oracle',
        whoFor: 'parent',
        message: 'We would like to visit.',
        privacy: 'on',
        company: '',
      }),
      { today: TODAY },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toMatchObject({ name: 'Nimal Perera', topic: 'oracle', whoFor: 'parent' });
      expect(result.data).not.toHaveProperty('company');
    }
  });

  it('reports one message per invalid field and a summary', () => {
    const result = parseEnquiry('general', raw({ name: 'A', phone: '12', topic: '', whoFor: 'nope' }), { today: TODAY });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.name).toMatch(/name/i);
      expect(result.fieldErrors.phone).toBeTruthy();
      expect(result.fieldErrors.topic).toBeTruthy();
      expect(result.fieldErrors.whoFor).toBeTruthy();
      expect(result.fieldErrors.privacy).toMatch(/privacy/i);
      expect(result.formErrors[0]).toMatch(/check the highlighted fields/i);
    }
  });

  it('allows Find the Right Care without a residence preference', () => {
    const result = parseEnquiry(
      'find-care',
      raw({ whoFor: 'myself', helpType: 'not-sure', residencePreference: '', name: 'Anjali Fernando', phone: '0771234567', privacy: 'on' }),
      { today: TODAY },
    );
    expect(result.ok).toBe(true);
  });

  it('rejects an Oracle visit date in the past', () => {
    const result = parseEnquiry(
      'oracle-visit',
      raw({
        name: 'Anjali Fernando',
        phone: '+94771234567',
        preferredDate: '2026-10-01',
        preferredTime: 'morning',
        visitors: '2',
        privacy: 'on',
      }),
      { today: TODAY },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.preferredDate).toMatch(/today or a later date/i);
  });

  it('requires an email for partner interest and not for the other forms', () => {
    const missingEmail = parseEnquiry(
      'silver-roots-partner',
      raw({ organisation: 'Care Co', name: 'Ravi Silva', phone: '+94771234567', email: '', privacy: 'on' }),
      { today: TODAY },
    );
    expect(missingEmail.ok).toBe(false);
    const kindsWithoutEmail: FormKind[] = ['general', 'find-care', 'oracle-visit', 'grove-interest', 'destination-retirement'];
    for (const kind of kindsWithoutEmail) {
      expect(formDefinition(kind).fields.some((field) => field.name === 'email')).toBe(false);
    }
  });
});

describe('valuesFromRaw', () => {
  it('keeps what the visitor typed and drops routing and honeypot fields', () => {
    expect(valuesFromRaw({ kind: 'general', context: 'Home', company: 'spam', name: 'Nimal', phone: '077' })).toEqual({
      name: 'Nimal',
      phone: '077',
    });
  });
});
```

- [ ] **Step 3: Run to verify it fails**

```powershell
npx vitest run src/lib/forms/schemas.test.ts
```

Expected: FAIL — cannot find `./definitions` or `./schemas`.

- [ ] **Step 4: Create `src/lib/forms/definitions.ts`**

```ts
import type { FormKind } from './kinds';

export type FieldType = 'text' | 'tel' | 'email' | 'textarea' | 'select' | 'date' | 'checkbox';

export type FieldOption = { value: string; label: string };

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: FieldOption[];
  autocomplete?: string;
  maxLength?: number;
};

export type FormDefinition = {
  kind: FormKind;
  heading: string;
  intro: string;
  submitLabel: string;
  fields: FieldDef[];
};

export const WHO_FOR: FieldOption[] = [
  { value: 'myself', label: 'Myself' },
  { value: 'parent', label: 'A parent' },
  { value: 'relative', label: 'A relative' },
  { value: 'someone-else', label: 'Someone else' },
];

export const HELP_TYPES: FieldOption[] = [
  { value: 'independent-living', label: 'Independent living' },
  { value: 'residential-care', label: 'Residential care' },
  { value: 'respite', label: 'Respite' },
  { value: 'recovery', label: 'Recovery after hospital or surgery' },
  { value: 'rehabilitation', label: 'Rehabilitation' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const ENQUIRY_TOPICS: FieldOption[] = [
  { value: 'oracle', label: 'Oracle' },
  { value: 'home', label: 'A Village 60 Plus home' },
  { value: 'living-and-care', label: 'Living & Care' },
  { value: 'recovery-respite', label: 'Recovery and respite' },
  { value: 'destination-retirement', label: 'Destination Retirement' },
  { value: 'silver-roots', label: 'Silver Roots' },
  { value: 'other', label: 'Something else' },
];

export const VISIT_TIMES: FieldOption[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

export const VISITOR_COUNTS: FieldOption[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4-plus', label: '4 or more' },
];

export const STAY_LENGTHS: FieldOption[] = [
  { value: 'few-weeks', label: 'A few weeks' },
  { value: 'few-months', label: 'A few months' },
  { value: 'not-sure', label: 'Not sure yet' },
];

const privacy: FieldDef = {
  name: 'privacy',
  label: 'I have read the privacy notice and agree to be contacted about this enquiry.',
  type: 'checkbox',
  required: true,
};

const name: FieldDef = { name: 'name', label: 'Your name', type: 'text', required: true, autocomplete: 'name', maxLength: 80 };
const phone: FieldDef = { name: 'phone', label: 'Phone or WhatsApp', type: 'tel', required: true, autocomplete: 'tel', maxLength: 20 };

const DEFINITIONS: Record<FormKind, FormDefinition> = {
  general: {
    kind: 'general',
    heading: 'Talk to the team',
    intro: 'Tell us a little about what you are looking for. This is not an assessment.',
    submitLabel: 'Send enquiry',
    fields: [
      name,
      phone,
      { name: 'topic', label: 'I am enquiring about', type: 'select', required: true, options: ENQUIRY_TOPICS },
      { name: 'whoFor', label: 'Who is this for?', type: 'select', required: true, options: WHO_FOR },
      { name: 'message', label: 'Message', type: 'textarea', required: false, maxLength: 1000 },
      privacy,
    ],
  },
  'find-care': {
    kind: 'find-care',
    heading: 'Find the right care',
    intro: 'You do not need to know the care category. We will talk it through with you. This form is not a medical assessment.',
    submitLabel: 'Send to the team',
    fields: [
      { name: 'whoFor', label: 'Who is this for?', type: 'select', required: true, options: WHO_FOR },
      { name: 'helpType', label: 'What kind of help are you considering?', type: 'select', required: true, options: HELP_TYPES },
      { name: 'residencePreference', label: 'Preferred home or area (optional)', type: 'text', required: false, maxLength: 120 },
      name,
      phone,
      privacy,
    ],
  },
  'oracle-visit': {
    kind: 'oracle-visit',
    heading: 'Arrange a private visit',
    intro: 'Request a visit to Oracle. We will confirm by phone or WhatsApp — this is not an instant booking.',
    submitLabel: 'Request my visit',
    fields: [
      name,
      phone,
      { name: 'preferredDate', label: 'Preferred date', type: 'date', required: true },
      { name: 'preferredTime', label: 'Preferred time', type: 'select', required: true, options: VISIT_TIMES },
      { name: 'visitors', label: 'Number of visitors', type: 'select', required: true, options: VISITOR_COUNTS },
      { name: 'note', label: 'Anything you would like us to know (optional)', type: 'textarea', required: false, maxLength: 1000 },
      privacy,
    ],
  },
  'grove-interest': {
    kind: 'grove-interest',
    heading: 'Register your interest',
    intro: 'The Grove is not open yet. Leave your details and we will be in touch as plans firm up.',
    submitLabel: 'Register interest',
    fields: [name, phone, { name: 'message', label: 'Message (optional)', type: 'textarea', required: false, maxLength: 1000 }, privacy],
  },
  'silver-roots-partner': {
    kind: 'silver-roots-partner',
    heading: 'Partner with Silver Roots',
    intro: 'Tell us about your organisation. We will reply to discuss whether there is a fit.',
    submitLabel: 'Send partner enquiry',
    fields: [
      { name: 'organisation', label: 'Organisation', type: 'text', required: true, autocomplete: 'organization', maxLength: 120 },
      { name: 'role', label: 'Your role (optional)', type: 'text', required: false, maxLength: 80 },
      name,
      phone,
      { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxLength: 120 },
      { name: 'message', label: 'What would you like to offer? (optional)', type: 'textarea', required: false, maxLength: 1000 },
      privacy,
    ],
  },
  'destination-retirement': {
    kind: 'destination-retirement',
    heading: 'Plan a stay',
    intro: 'Tell us the kind of stay you have in mind. Nothing on this page is a confirmed package.',
    submitLabel: 'Send enquiry',
    fields: [
      name,
      phone,
      { name: 'stayLength', label: 'How long are you thinking of staying?', type: 'select', required: true, options: STAY_LENGTHS },
      { name: 'note', label: 'What kind of stay are you imagining? (optional)', type: 'textarea', required: false, maxLength: 1000 },
      privacy,
    ],
  },
};

export function formDefinition(kind: FormKind): FormDefinition {
  return DEFINITIONS[kind];
}

export function summaryLines(kind: FormKind, values: Record<string, string>): string[] {
  const lines: string[] = [];
  for (const field of formDefinition(kind).fields) {
    if (field.name === 'privacy') continue;
    const value = values[field.name];
    if (!value) continue;
    const display = field.options?.find((option) => option.value === value)?.label ?? value;
    const label = field.label.replace(/ \(optional\)$/, '');
    lines.push(`${label}: ${display}`);
  }
  return lines;
}
```

- [ ] **Step 5: Create `src/lib/forms/schemas.ts`**

```ts
import * as z from 'zod';
import type { FormKind } from './kinds';

const phone = z.string().trim().regex(/^\+?[0-9][0-9\s-]{6,18}$/, 'Enter a phone number we can call or message on WhatsApp.');
const personName = z.string().trim().min(2, 'Enter your name.').max(80, 'Name must be 80 characters or fewer.');
const privacy = z.literal('on', { error: 'Please confirm you have read the privacy notice.' });

function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max, `Keep this to ${max} characters or fewer.`)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : undefined));
}

function oneOf(values: string[], message: string) {
  return z.string().refine((value) => values.includes(value), message);
}

const schemas = {
  general: z.object({
    name: personName,
    phone,
    topic: oneOf(['oracle', 'home', 'living-and-care', 'recovery-respite', 'destination-retirement', 'silver-roots', 'other'], 'Choose what you are enquiring about.'),
    whoFor: oneOf(['myself', 'parent', 'relative', 'someone-else'], 'Choose who this enquiry is for.'),
    message: optionalText(1000),
    privacy,
  }),
  'find-care': z.object({
    whoFor: oneOf(['myself', 'parent', 'relative', 'someone-else'], 'Choose who this enquiry is for.'),
    helpType: oneOf(['independent-living', 'residential-care', 'respite', 'recovery', 'rehabilitation', 'not-sure'], 'Choose the kind of help you are considering.'),
    residencePreference: optionalText(120),
    name: personName,
    phone,
    privacy,
  }),
  'oracle-visit': z.object({
    name: personName,
    phone,
    preferredDate: z.iso.date('Choose a date.'),
    preferredTime: oneOf(['morning', 'afternoon', 'evening'], 'Choose a preferred time.'),
    visitors: oneOf(['1', '2', '3', '4-plus'], 'Choose the number of visitors.'),
    note: optionalText(1000),
    privacy,
  }),
  'grove-interest': z.object({
    name: personName,
    phone,
    message: optionalText(1000),
    privacy,
  }),
  'silver-roots-partner': z.object({
    organisation: z.string().trim().min(2, 'Enter the organisation name.').max(120),
    role: optionalText(80),
    name: personName,
    phone,
    email: z.email('Enter a valid email address.'),
    message: optionalText(1000),
    privacy,
  }),
  'destination-retirement': z.object({
    name: personName,
    phone,
    stayLength: oneOf(['few-weeks', 'few-months', 'not-sure'], 'Choose a rough length of stay.'),
    note: optionalText(1000),
    privacy,
  }),
} satisfies Record<FormKind, z.ZodType>;

export type EnquiryData = {
  [K in FormKind]: z.infer<(typeof schemas)[K]>;
}[FormKind];

const ROUTING_KEYS = new Set(['kind', 'context', 'company']);

export function valuesFromRaw(raw: Record<string, FormDataEntryValue | string | undefined>): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (ROUTING_KEYS.has(key) || typeof value !== 'string') continue;
    values[key] = value;
  }
  return values;
}

export function parseEnquiry(
  kind: FormKind,
  raw: Record<string, FormDataEntryValue | string | undefined>,
  options: { today: string },
): { ok: true; data: EnquiryData } | { ok: false; fieldErrors: Record<string, string>; formErrors: string[] } {
  const result = schemas[kind].safeParse(raw);
  if (!result.success) {
    const flat = z.flattenError(result.error);
    const fieldErrors: Record<string, string> = {};
    for (const [key, messages] of Object.entries(flat.fieldErrors)) {
      const message = messages?.[0];
      if (message) fieldErrors[key] = message;
    }
    for (const message of flat.formErrors) fieldErrors.form = message;
    return { ok: false, fieldErrors, formErrors: ['Please check the highlighted fields.'] };
  }

  if (kind === 'oracle-visit' && 'preferredDate' in result.data && result.data.preferredDate < options.today) {
    return {
      ok: false,
      fieldErrors: { preferredDate: 'Choose today or a later date.' },
      formErrors: ['Please check the highlighted fields.'],
    };
  }

  return { ok: true, data: result.data };
}
```

If `z.flattenError` or `z.iso.date` or `z.email` fails to typecheck against the installed Zod 4, open the Zod 4 docs for the installed patch and use the current names. Do not fall back to Zod 3 `.flatten()` or `z.string().email()`.

- [ ] **Step 6: Run the tests**

```powershell
npx vitest run src/lib/forms/schemas.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add src/lib/forms/definitions.ts src/lib/forms/schemas.ts src/lib/forms/schemas.test.ts package.json package-lock.json
git commit -m "feat(forms): add enquiry definitions and shared Zod schemas"
```

---

### Task 20: Delivery — rate limit, email text, and the enquiry action

**Files:**
- Create: `src/lib/forms/rate-limit.ts`, `src/lib/forms/rate-limit.test.ts`, `src/lib/forms/process.ts`, `src/lib/forms/process.test.ts`, `src/lib/forms/submit.ts`
- Modify: `package.json` via the installs below

**Interfaces:**
- Consumes: `parseEnquiry`, `valuesFromRaw`, `EnquiryData`, `summaryLines` (Task 19); `FORM_KINDS`, `FormKind`, `formKindLabel`; `whatsappHref`, `SiteContact`; `getServerEnv`, `getPublicEnv`.
- Produces:
  - `createMemoryLimiter(max, windowMs, now?)` → `{ limit(id): Promise<{ success, limit, remaining, reset }> }`
  - `EnquiryState` and `initialEnquiryState`
  - `processEnquiry(prev, formData, deps)` → `EnquiryState`
  - `submitEnquiry(prev, formData)` — the Server Action pages will bind to forms
  - `RecipientRow = { kind: string; to: string[] }`

- [ ] **Step 1: Install Resend and Upstash**

```powershell
npm install resend @upstash/ratelimit @upstash/redis
```

- [ ] **Step 2: Write the failing rate-limit test `src/lib/forms/rate-limit.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { createMemoryLimiter } from './rate-limit';

describe('createMemoryLimiter', () => {
  it('allows up to the limit inside the window and then blocks', async () => {
    let now = 1_000;
    const limiter = createMemoryLimiter(2, 10_000, () => now);
    expect((await limiter.limit('1.2.3.4')).success).toBe(true);
    expect((await limiter.limit('1.2.3.4')).success).toBe(true);
    expect((await limiter.limit('1.2.3.4')).success).toBe(false);
    now += 10_001;
    expect((await limiter.limit('1.2.3.4')).success).toBe(true);
  });

  it('counts identifiers separately', async () => {
    const limiter = createMemoryLimiter(1, 10_000, () => 0);
    expect((await limiter.limit('a')).success).toBe(true);
    expect((await limiter.limit('b')).success).toBe(true);
    expect((await limiter.limit('a')).success).toBe(false);
  });
});
```

- [ ] **Step 3: Run to verify it fails**

```powershell
npx vitest run src/lib/forms/rate-limit.test.ts
```

Expected: FAIL — cannot find `./rate-limit`.

- [ ] **Step 4: Create `src/lib/forms/rate-limit.ts`**

```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type LimitResult = { success: boolean; limit: number; remaining: number; reset: number };

export function createMemoryLimiter(max: number, windowMs: number, now: () => number = Date.now) {
  const hits = new Map<string, number[]>();
  return {
    async limit(id: string): Promise<LimitResult> {
      const time = now();
      const recent = (hits.get(id) ?? []).filter((stamp) => time - stamp < windowMs);
      recent.push(time);
      hits.set(id, recent);
      return { success: recent.length <= max, limit: max, remaining: Math.max(0, max - recent.length), reset: time + windowMs };
    },
  };
}

const WINDOW = '10 m';
const MAX = 5;

let singleton: { limit: (id: string) => Promise<LimitResult> } | null = null;

/** 5 per 10 minutes. Upstash when configured; in-memory otherwise (single server only). */
export function getEnquiryLimiter(): { limit: (id: string) => Promise<LimitResult> } {
  if (singleton) return singleton;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    singleton = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX, WINDOW),
      analytics: false,
      prefix: 'village60:enquiry',
    });
  } else {
    singleton = createMemoryLimiter(MAX, 10 * 60 * 1000);
  }
  return singleton;
}
```

- [ ] **Step 5: Write the failing process test `src/lib/forms/process.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest';
import type { SiteContact } from '@/lib/contact';
import { initialEnquiryState, processEnquiry, type EnquiryDeps } from './process';

const contact: SiteContact = {
  phone: '+94112504838',
  phoneDisplay: '+94 11 250 4838',
  whatsapp: '+94741003994',
  email: 'hello@example.com',
  responseTime: 'within one working day',
};

function deps(over: Partial<EnquiryDeps> = {}): EnquiryDeps {
  return {
    limit: vi.fn(async () => ({ success: true, limit: 5, remaining: 4, reset: 0 })),
    send: vi.fn(async () => ({ ok: true })),
    recipients: [{ kind: 'general', to: ['team@example.com'] }, { kind: 'oracle-visit', to: ['oracle@example.com'] }],
    fallbackRecipient: 'fallback@example.com',
    contact,
    siteHost: 'www.village60plus.lk',
    requestHost: 'www.village60plus.lk',
    origin: 'https://www.village60plus.lk',
    clientIp: '203.0.113.5',
    today: '2026-10-12',
    ...over,
  };
}

function data(fields: Record<string, string>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
}

const general = {
  kind: 'general',
  context: 'Home',
  name: 'Nimal Perera',
  phone: '+94771234567',
  topic: 'oracle',
  whoFor: 'parent',
  message: 'Please call after 6pm.',
  privacy: 'on',
  company: '',
};

describe('processEnquiry', () => {
  it('emails the inbox for that form and returns a WhatsApp link without the message', async () => {
    const send = vi.fn(async () => ({ ok: true }));
    const state = await processEnquiry(initialEnquiryState, data(general), deps({ send }));
    expect(state.status).toBe('success');
    expect(send).toHaveBeenCalledOnce();
    const email = send.mock.calls[0][0];
    expect(email.to).toEqual(['team@example.com']);
    expect(email.subject).toBe('Website enquiry');
    expect(email.subject).not.toContain('Nimal');
    expect(email.text).toContain('Please call after 6pm.');
    expect(email.text).toContain('Who is this for?: A parent');
    expect(email.text).toContain('I am enquiring about: Oracle');
    expect(email.text).not.toContain('whoFor');
    expect(email.text).not.toMatch(/diagnos|medical history/i);
    expect(state.whatsappHref).toContain('https://wa.me/94741003994');
    expect(state.whatsappHref).not.toContain('Please');
    expect(state.responseTime).toBe('within one working day');
    expect(state.values.name).toBe('Nimal Perera');
  });

  it('routes Oracle visits to the Oracle inbox', async () => {
    const send = vi.fn(async () => ({ ok: true }));
    await processEnquiry(
      initialEnquiryState,
      data({
        kind: 'oracle-visit',
        context: 'Oracle',
        name: 'Anjali Fernando',
        phone: '+94771234567',
        preferredDate: '2026-10-20',
        preferredTime: 'morning',
        visitors: '2',
        privacy: 'on',
      }),
      deps({ send }),
    );
    expect(send.mock.calls[0][0].to).toEqual(['oracle@example.com']);
    expect(send.mock.calls[0][0].subject).toBe('Oracle private visit request');
  });

  it('uses the fallback recipient when no row matches', async () => {
    const send = vi.fn(async () => ({ ok: true }));
    await processEnquiry(initialEnquiryState, data(general), deps({ send, recipients: [] }));
    expect(send.mock.calls[0][0].to).toEqual(['fallback@example.com']);
  });

  it('keeps typed values and lists every field error', async () => {
    const send = vi.fn(async () => ({ ok: true }));
    const state = await processEnquiry(initialEnquiryState, data({ kind: 'general', context: 'Home', name: 'Nimal' }), deps({ send }));
    expect(state.status).toBe('error');
    expect(state.fieldErrors.phone).toBeTruthy();
    expect(state.formErrors[0]).toMatch(/highlighted fields/i);
    expect(state.values.name).toBe('Nimal');
    expect(send).not.toHaveBeenCalled();
  });

  it('does not send when the honeypot is filled, and still looks successful', async () => {
    const send = vi.fn(async () => ({ ok: true }));
    const state = await processEnquiry(initialEnquiryState, data({ ...general, company: 'https://spam.example' }), deps({ send }));
    expect(state.status).toBe('success');
    expect(send).not.toHaveBeenCalled();
  });

  it('blocks a post whose Origin is missing or not this site', async () => {
    const send = vi.fn(async () => ({ ok: true }));
    for (const origin of [null, 'https://evil.example']) {
      const state = await processEnquiry(initialEnquiryState, data(general), deps({ send, origin, requestHost: 'www.village60plus.lk' }));
      expect(state.status).toBe('error');
      expect(state.formErrors[0]).toMatch(/Village 60 Plus website/i);
    }
    expect(send).not.toHaveBeenCalled();

    const allowed = await processEnquiry(
      initialEnquiryState,
      data(general),
      deps({ send, origin: 'https://preview.example', requestHost: 'preview.example', siteHost: 'www.village60plus.lk' }),
    );
    expect(allowed.status).toBe('success');
    expect(send).toHaveBeenCalledOnce();
  });

  it('rate-limits and still offers a WhatsApp link', async () => {
    const state = await processEnquiry(
      initialEnquiryState,
      data(general),
      deps({ limit: async () => ({ success: false, limit: 5, remaining: 0, reset: 0 }) }),
    );
    expect(state.status).toBe('error');
    expect(state.formErrors[0]).toMatch(/call or WhatsApp/i);
    expect(state.whatsappHref).toContain('wa.me');
  });

  it('on email failure keeps the values, offers call and WhatsApp, and logs only the form kind', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = await processEnquiry(initialEnquiryState, data(general), deps({ send: async () => ({ ok: false }) }));
    expect(state.status).toBe('delivery-failed');
    expect(state.formErrors[0]).toMatch(/call or WhatsApp/i);
    expect(state.whatsappHref).toContain('wa.me');
    expect(state.values.phone).toBe('+94771234567');
    expect(JSON.stringify(error.mock.calls)).not.toContain('Nimal');
    expect(JSON.stringify(error.mock.calls)).toContain('general');
    error.mockRestore();
  });
});
```

- [ ] **Step 6: Run to verify it fails**

```powershell
npx vitest run src/lib/forms/process.test.ts
```

Expected: FAIL — cannot find `./process`.

- [ ] **Step 7: Create `src/lib/forms/process.ts`**

```ts
import { whatsappHref, type SiteContact } from '@/lib/contact';
import { summaryLines } from './definitions';
import { FORM_KINDS, formKindLabel, type FormKind } from './kinds';
import type { LimitResult } from './rate-limit';
import { parseEnquiry, valuesFromRaw, type EnquiryData } from './schemas';

export type RecipientRow = { kind: string; to: string[] };

export type EnquiryState = {
  status: 'idle' | 'success' | 'error' | 'delivery-failed';
  fieldErrors: Record<string, string>;
  formErrors: string[];
  values: Record<string, string>;
  whatsappHref: string | null;
  responseTime: string | null;
};

export const initialEnquiryState: EnquiryState = {
  status: 'idle',
  fieldErrors: {},
  formErrors: [],
  values: {},
  whatsappHref: null,
  responseTime: null,
};

export type EnquiryDeps = {
  limit: (id: string) => Promise<LimitResult>;
  send: (email: { to: string[]; subject: string; text: string; replyTo?: string }) => Promise<{ ok: boolean }>;
  recipients: RecipientRow[];
  fallbackRecipient: string;
  contact: SiteContact;
  siteHost: string;
  requestHost: string | null;
  origin: string | null;
  clientIp: string;
  today: string;
};

function isFormKind(value: string): value is FormKind {
  return FORM_KINDS.some((kind) => kind.value === value);
}

function recipientsFor(kind: FormKind, rows: RecipientRow[], fallback: string): string[] {
  const row = rows.find((item) => item.kind === kind) ?? rows.find((item) => item.kind === 'general');
  const emails = (row?.to ?? []).map((email) => email.trim()).filter(Boolean);
  return emails.length > 0 ? emails : [fallback];
}

function emailText(kind: FormKind, context: string, data: EnquiryData): { subject: string; text: string } {
  const subject = FORM_KINDS.find((item) => item.value === kind)?.subject ?? 'Website enquiry';
  const text = `Form: ${formKindLabel(kind)}
Page: ${context}

${summaryLines(kind, data as Record<string, string>).join('\n')}`;
  return { subject, text };
}

function hostOf(origin: string | null): string | null {
  if (!origin) return null;
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

export async function processEnquiry(_prev: EnquiryState, formData: FormData, deps: EnquiryDeps): Promise<EnquiryState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = valuesFromRaw(raw);
  const kindValue = raw.kind ?? '';
  const context = (raw.context ?? 'Village 60 Plus').slice(0, 80);
  const handoff = whatsappHref(deps.contact.whatsapp, context);

  if (!isFormKind(kindValue)) {
    return { ...initialEnquiryState, status: 'error', values, formErrors: ['This form could not be recognised. Please call or WhatsApp us.'] };
  }

  const originHost = hostOf(deps.origin);
  if (!originHost || (originHost !== deps.siteHost && originHost !== deps.requestHost)) {
    return {
      ...initialEnquiryState,
      status: 'error',
      values,
      formErrors: ['This form can only be submitted from the Village 60 Plus website.'],
    };
  }

  if ((raw.company ?? '').trim() !== '') {
    return { ...initialEnquiryState, status: 'success', values, whatsappHref: handoff, responseTime: deps.contact.responseTime };
  }

  const parsed = parseEnquiry(kindValue, raw, { today: deps.today });
  if (!parsed.ok) {
    return { ...initialEnquiryState, status: 'error', values, fieldErrors: parsed.fieldErrors, formErrors: parsed.formErrors };
  }

  const limit = await deps.limit(deps.clientIp || 'unknown');
  if (!limit.success) {
    return {
      ...initialEnquiryState,
      status: 'error',
      values,
      whatsappHref: handoff,
      formErrors: ['Too many enquiries from this connection. Please call or WhatsApp us, or try again shortly.'],
    };
  }

  const email = emailText(kindValue, context, parsed.data);
  const sent = await deps.send({
    to: recipientsFor(kindValue, deps.recipients, deps.fallbackRecipient),
    subject: email.subject,
    text: email.text,
    replyTo: 'email' in parsed.data && parsed.data.email ? parsed.data.email : undefined,
  });

  if (!sent.ok) {
    console.error('enquiry email failed', { kind: kindValue });
    return {
      ...initialEnquiryState,
      status: 'delivery-failed',
      values,
      whatsappHref: handoff,
      formErrors: ['We could not send your enquiry just now. Please call or WhatsApp us and we will help straight away.'],
    };
  }

  return { ...initialEnquiryState, status: 'success', values, whatsappHref: handoff, responseTime: deps.contact.responseTime };
}
```

- [ ] **Step 8: Run both test files**

```powershell
npx vitest run src/lib/forms/rate-limit.test.ts src/lib/forms/process.test.ts
```

Expected: PASS. If the honeypot test fails because `parseEnquiry` rejects before the honeypot check, keep the honeypot check where it is (before parse) — a bot does not need to fill a valid form.

- [ ] **Step 9: Create `src/lib/forms/submit.ts`**

```ts
'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { getPublicEnv, getServerEnv } from '@/lib/env';
import { getEnquiryLimiter } from './rate-limit';
import { initialEnquiryState, processEnquiry, type EnquiryState, type RecipientRow } from './process';

function todayInColombo(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

async function loadRecipients(): Promise<{ rows: RecipientRow[]; contact: import('@/lib/contact').SiteContact } | null> {
  const { fetchPublished } = await import('@/sanity/fetch');
  const { SITE_SETTINGS_QUERY } = await import('@/sanity/queries');
  const settings = await fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']);
  if (!settings?.phone || !settings.whatsapp) return null;
  return {
    rows: (settings.formRecipients ?? []).flatMap((row) =>
      row.kind && row.to ? [{ kind: row.kind, to: row.to.filter((email): email is string => Boolean(email)) }] : [],
    ),
    contact: {
      phone: settings.phone,
      phoneDisplay: settings.phoneDisplay ?? settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email ?? '',
      responseTime: settings.responseTime ?? 'as soon as we can',
    },
  };
}

export async function submitEnquiry(prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const headerList = await headers();
  const server = getServerEnv();
  const site = getPublicEnv();
  let rows: RecipientRow[] = [];
  let contact = {
    phone: '',
    phoneDisplay: '',
    whatsapp: '',
    email: '',
    responseTime: 'as soon as we can',
  };
  try {
    const loaded = await loadRecipients();
    if (loaded) {
      rows = loaded.rows;
      contact = loaded.contact;
    }
  } catch (error) {
    console.error('enquiry settings unavailable', { message: error instanceof Error ? error.name : 'error' });
  }

  const resend = new Resend(server.resendApiKey);
  const forwarded = headerList.get('x-forwarded-for')?.split(',')[0]?.trim();

  return processEnquiry(prev, formData, {
    limit: (id) => getEnquiryLimiter().limit(id),
    send: async (email) => {
      const { error } = await resend.emails.send({
        from: server.emailFrom,
        to: email.to,
        replyTo: email.replyTo,
        subject: email.subject,
        text: email.text,
      });
      return { ok: !error };
    },
    recipients: rows,
    fallbackRecipient: server.fallbackRecipient,
    contact,
    siteHost: new URL(site.siteUrl).host,
    requestHost: headerList.get('x-forwarded-host') ?? headerList.get('host'),
    origin: headerList.get('origin'),
    clientIp: forwarded || 'unknown',
    today: todayInColombo(),
  });
}

export { initialEnquiryState };
```

`en-CA` formats as YYYY-MM-DD, so `todayInColombo()` compares correctly with `z.iso.date` values. `SITE_SETTINGS_QUERY` is the site-settings query from Task 9 (`formRecipients` is already `{ kind, to }`). Do not put the read token, API key or recipient list in the returned state.

Confirm `resend@6` uses `replyTo` (camelCase). The research note from 12 Oct 2026 says it does.

- [ ] **Step 10: Typecheck**

```powershell
npm run typecheck
```

Expected: clean. Fix only type errors inside `src/lib/forms/`. `SITE_SETTINGS_QUERY` is already exported from `src/sanity/queries.ts`; do not rename it.

- [ ] **Step 11: Commit**

```powershell
git add src/lib/forms package.json package-lock.json
git commit -m "feat(forms): deliver enquiries by email with rate limiting and WhatsApp handoff"
```

---

### Task 21: EnquiryForm

**Files:**
- Create: `src/components/forms/Field.tsx`, `src/components/forms/EnquiryForm.tsx`, `src/components/forms/EnquiryForm.test.tsx`

**Interfaces:**
- Consumes: `formDefinition`, `summaryLines`, `FieldDef` (Task 19); `submitEnquiry`, `initialEnquiryState`, `EnquiryState` (Task 20); `Button`.
- Produces: `Field` takes `idPrefix` and sets `id={`${idPrefix}-${field.name}`}` with error id `` `${id}-error` ``. `<EnquiryForm kind context headingId?>` — a client form bound to `submitEnquiry`. `kind` and `context` are hidden inputs. `const formKey = useId()` is the `idPrefix` passed to each `Field`. Errors render in an element whose id is `` `${formKey}-errors` `` (`tabIndex={-1}`, `role="alert"`) and next to each field via `aria-describedby`. After a failed submit, focus moves to that summary. The heading id is `headingId ?? formKey`. Success lists `summaryLines(kind, state.values)` under the response-time paragraph. Delivery-failed states keep the summary and show Call/WhatsApp when `state.whatsappHref` is set.

- [ ] **Step 1: Write the failing test `src/components/forms/EnquiryForm.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryForm } from './EnquiryForm';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: {
    status: 'idle',
    fieldErrors: {},
    formErrors: [],
    values: {},
    whatsappHref: null,
    responseTime: null,
  },
}));

describe('EnquiryForm', () => {
  it('renders the general fields with visible labels and a honeypot', async () => {
    const { container } = render(<EnquiryForm kind="general" context="Home" />);
    expect(screen.getByRole('heading', { name: 'Talk to the team' })).toBeInTheDocument();
    expect(screen.getByLabelText('Your name')).toBeRequired();
    expect(screen.getByLabelText('Phone or WhatsApp')).toHaveAttribute('autocomplete', 'tel');
    expect(screen.getByLabelText('I am enquiring about')).toBeInTheDocument();
    expect(screen.getByLabelText(/privacy notice/i)).toHaveAttribute('type', 'checkbox');
    expect(screen.getByRole('link', { name: 'privacy notice' })).toHaveAttribute('href', '/privacy');
    const trap = container.querySelector('input[name="company"]');
    expect(trap).toHaveAttribute('tabindex', '-1');
    expect(trap).toHaveAttribute('autocomplete', 'off');
    expect(container.querySelector('input[name="kind"]')).toHaveValue('general');
    expect(container.querySelector('input[name="context"]')).toHaveValue('Home');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows the Oracle visit fields, including date and visitors', () => {
    render(<EnquiryForm kind="oracle-visit" context="Oracle" />);
    expect(screen.getByLabelText('Preferred date')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Number of visitors')).toBeInTheDocument();
    expect(screen.queryByLabelText('I am enquiring about')).not.toBeInTheDocument();
  });

  it('states that Find the Right Care is not a medical assessment', () => {
    render(<EnquiryForm kind="find-care" context="Find the Right Care" />);
    expect(screen.getByText(/not a medical assessment/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/diagnosis/i)).not.toBeInTheDocument();
  });
});

describe('EnquiryForm feedback', () => {
  it('moves focus to the error summary when the action returns field errors', async () => {
    const { submitEnquiry, initialEnquiryState } = await import('@/lib/forms/submit');
    vi.mocked(submitEnquiry).mockResolvedValue({
      ...initialEnquiryState,
      status: 'error',
      values: { name: 'Nimal' },
      fieldErrors: { phone: 'Enter a phone number we can call or message on WhatsApp.' },
      formErrors: ['Please check the highlighted fields.'],
    });
    render(<EnquiryForm kind="general" context="Home" />);
    await userEvent.type(screen.getByLabelText('Your name'), 'Nimal');
    await userEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
    const summary = await screen.findByRole('alert');
    expect(summary).toHaveFocus();
    expect(summary).toHaveTextContent('Please check the highlighted fields.');
    expect(screen.getByLabelText('Your name')).toHaveValue('Nimal');
    expect(screen.getByText('Enter a phone number we can call or message on WhatsApp.')).toBeInTheDocument();
  });

  it('shows what was submitted after a successful send', async () => {
    const { submitEnquiry, initialEnquiryState } = await import('@/lib/forms/submit');
    vi.mocked(submitEnquiry).mockResolvedValue({
      ...initialEnquiryState,
      status: 'success',
      values: { name: 'Nimal Perera', topic: 'oracle', whoFor: 'parent' },
      whatsappHref: 'https://wa.me/94741003994?text=Hello',
      responseTime: 'within one working day',
    });
    render(<EnquiryForm kind="general" context="Home" />);
    await userEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('Nimal Perera');
    expect(status).toHaveTextContent('Oracle');
  });
});
```

`useActionState` calls the action when the form is submitted. The mock must be a function so React can pass it to `useActionState`. If React 19's test renderer does not invoke the mocked action from `userEvent.click`, call the action prop by submitting the `<form>` (`fireEvent.submit`) and assert on the resulting alert. Do not weaken the assertion that the summary receives focus.

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/components/forms/EnquiryForm.test.tsx
```

Expected: FAIL — cannot find `./EnquiryForm`.

- [ ] **Step 3: Create `src/components/forms/Field.tsx`**

```tsx
import type { FieldDef } from '@/lib/forms/definitions';

export function Field({ field, error, defaultValue, idPrefix }: { field: FieldDef; error?: string; defaultValue?: string; idPrefix: string }) {
  const id = `${idPrefix}-${field.name}`;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = errorId;
  const common = {
    id,
    name: field.name,
    required: field.required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    defaultValue: field.type === 'checkbox' ? undefined : defaultValue,
    maxLength: field.maxLength,
    autoComplete: field.autocomplete,
    className:
      field.type === 'checkbox'
        ? 'mt-1 size-5'
        : 'w-full rounded-input border border-stone bg-paper px-3 py-2.5 text-charcoal',
  } as const;

  let control;
  if (field.type === 'textarea') {
    control = <textarea {...common} rows={4} />;
  } else if (field.type === 'select') {
    control = (
      <select {...common} defaultValue={defaultValue ?? ''}>
        <option value="">Choose one</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'checkbox') {
    control = <input {...common} type="checkbox" value="on" defaultChecked={defaultValue === 'on'} />;
  } else {
    control = <input {...common} type={field.type} />;
  }

  return (
    <div className={field.type === 'checkbox' ? 'flex items-start gap-3' : 'flex flex-col gap-1.5'}>
      {field.type === 'checkbox' ? control : null}
      <label htmlFor={id} className="font-semibold">
        {field.name === 'privacy' ? (
          <>
            I have read the <a href="/privacy">privacy notice</a> and agree to be contacted about this enquiry.
          </>
        ) : (
          field.label
        )}
      </label>
      {field.type === 'checkbox' ? null : control}
      {error ? (
        <p id={errorId} className="text-[15px] font-semibold text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
```

The privacy label in `definitions.ts` is the full sentence, and this component replaces it with a sentence that contains the link. The accessible name stays "I have read the privacy notice…" because the link text sits inside the label. Keep `htmlFor` pointed at the checkbox.

- [ ] **Step 4: Create `src/components/forms/EnquiryForm.tsx`**

```tsx
'use client';

import { useEffect, useId, useRef } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { formDefinition, summaryLines } from '@/lib/forms/definitions';
import type { FormKind } from '@/lib/forms/kinds';
import { initialEnquiryState, submitEnquiry } from '@/lib/forms/submit';
import { Field } from './Field';

export function EnquiryForm({ kind, context, headingId }: { kind: FormKind; context: string; headingId?: string }) {
  const definition = formDefinition(kind);
  const [state, action, pending] = useActionState(submitEnquiry, initialEnquiryState);
  const summaryRef = useRef<HTMLDivElement>(null);
  const formKey = useId();

  useEffect(() => {
    if (state.status === 'error' || state.status === 'delivery-failed') {
      summaryRef.current?.focus();
    }
  }, [state]);

  if (state.status === 'success') {
    return (
      <div role="status" className="flex flex-col gap-4">
        <h2 className="text-[28px]">Thank you. We will be in touch.</h2>
        <p>A member of the Village 60 Plus team will contact you {state.responseTime ?? 'as soon as we can'}.</p>
        <ul>
          {summaryLines(kind, state.values).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {state.whatsappHref ? (
          <Button href={state.whatsappHref} variant="secondary" target="_blank" rel="noopener noreferrer">
            Continue on WhatsApp
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <h2 id={headingId ?? formKey} className="text-[28px]">
        {definition.heading}
      </h2>
      <p className="max-w-prose-site">{definition.intro}</p>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="context" value={context} />
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.formErrors.length > 0 ? (
        <div ref={summaryRef} id={`${formKey}-errors`} tabIndex={-1} role="alert" className="rounded-input border border-error bg-paper p-4">
          <p className="font-semibold text-error">{state.formErrors[0]}</p>
          {state.status === 'delivery-failed' && state.whatsappHref ? (
            <p className="mt-3">
              <a href={state.whatsappHref}>Continue on WhatsApp</a>
            </p>
          ) : null}
        </div>
      ) : null}
      {definition.fields.map((field) => (
        <Field key={field.name} idPrefix={formKey} field={field} error={state.fieldErrors[field.name]} defaultValue={state.values[field.name]} />
      ))}
      <Button type="submit" disabled={pending}>
        {pending ? 'Sending…' : definition.submitLabel}
      </Button>
    </form>
  );
}
```

- [ ] **Step 5: Run the test**

```powershell
npx vitest run src/components/forms/EnquiryForm.test.tsx
```

Expected: PASS, including the axe run. jsdom does not compute colour contrast, so a pass here does not prove the error red; that was checked in Task 2.

- [ ] **Step 6: Commit**

```powershell
git add src/components/forms/Field.tsx src/components/forms/EnquiryForm.tsx src/components/forms/EnquiryForm.test.tsx
git commit -m "feat(forms): add the accessible enquiry form"
```

---

### Task 22: Enquiry panel and wiring it into the site chrome

**Files:**
- Create: `src/components/forms/EnquiryPanel.tsx`, `src/components/forms/EnquiryPanel.test.tsx`
- Modify: `src/app/(site)/layout.tsx` — render `Header`, `MobileActionBar`, `Footer`, `EnquiryPanel` around `{children}` once `getSiteChrome()` (below) can load settings. If Task 6 left this layout as a passthrough, replace that passthrough now.

**Interfaces:**
- Consumes: `EnquiryForm`, `Header`'s `enquiryTrigger` slot, `SiteContact`, `toSiteContact`, `formatAddress`, `SITE_SETTINGS_QUERY`.
- Produces:
  - `<EnquiryProvider contact>` with `useEnquiry().open(kind, context)` and `useEnquiry().close()`
  - `<EnquiryButton kind context>Enquire</EnquiryButton>` — opens the panel; this is what `Header` receives as `enquiryTrigger`
  - The panel is a `<dialog>`. On viewports below `md` it sits on the bottom edge; from `md` up it sits on the right. Escape and a Close button dismiss it. Opening moves focus into the dialog (native `showModal` does this).

- [ ] **Step 1: Write the failing test `src/components/forms/EnquiryPanel.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryButton, EnquiryProvider } from './EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

HTMLDialogElement.prototype.showModal = vi.fn(function show(this: HTMLDialogElement) {
  this.open = true;
});
HTMLDialogElement.prototype.close = vi.fn(function hide(this: HTMLDialogElement) {
  this.open = false;
});

describe('EnquiryPanel', () => {
  it('opens the general form from the trigger and closes from the Close button', async () => {
    render(
      <EnquiryProvider contact={contactFixture}>
        <EnquiryButton kind="general" context="Home">Enquire</EnquiryButton>
      </EnquiryProvider>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Enquire' }));
    expect(screen.getByRole('heading', { name: 'Talk to the team' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close enquiry form' }));
    expect(screen.queryByRole('heading', { name: 'Talk to the team' })).not.toBeInTheDocument();
  });

  it('opens the Oracle visit form when asked', async () => {
    render(
      <EnquiryProvider contact={contactFixture}>
        <EnquiryButton kind="oracle-visit" context="Oracle">Arrange a private visit</EnquiryButton>
      </EnquiryProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Arrange a private visit' }));
    expect(screen.getByRole('heading', { name: 'Arrange a private visit' })).toBeInTheDocument();
    expect(screen.getByLabelText('Preferred date')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/components/forms/EnquiryPanel.test.tsx
```

Expected: FAIL — cannot find `./EnquiryPanel`.

- [ ] **Step 3: Create `src/components/forms/EnquiryPanel.tsx`**

```tsx
'use client';

import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import type { SiteContact } from '@/lib/contact';
import type { FormKind } from '@/lib/forms/kinds';
import { EnquiryForm } from './EnquiryForm';

type EnquiryContextValue = {
  open: (kind: FormKind, context: string) => void;
  close: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiry(): EnquiryContextValue {
  const value = useContext(EnquiryContext);
  if (!value) throw new Error('useEnquiry must be used inside EnquiryProvider');
  return value;
}

export function EnquiryProvider({ contact, children }: { contact: SiteContact; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [request, setRequest] = useState<{ kind: FormKind; context: string } | null>(null);

  const api: EnquiryContextValue = {
    open: (kind, context) => {
      setRequest({ kind, context });
      dialogRef.current?.showModal();
    },
    close: () => dialogRef.current?.close(),
  };

  return (
    <EnquiryContext.Provider value={api}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="enquiry-panel-title"
        className="m-0 w-full max-w-none border-0 bg-paper p-0 text-charcoal shadow-panel open:flex md:fixed md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[440px]"
        style={{ marginTop: 'auto' }}
        onClose={() => setRequest(null)}
      >
        <div className="flex max-h-[85vh] w-full flex-col overflow-y-auto p-6 md:max-h-none md:h-full">
          <div className="mb-4 flex justify-end">
            <button type="button" className="min-h-11 px-3 font-semibold text-green" onClick={() => dialogRef.current?.close()}>
              Close enquiry form
            </button>
          </div>
          {request ? <EnquiryForm key={`${request.kind}:${request.context}`} kind={request.kind} context={request.context} headingId="enquiry-panel-title" /> : null}
          <p className="mt-6 text-[15px]">
            Or call <a href={`tel:${contact.phone}`}>{contact.phoneDisplay}</a>
          </p>
        </div>
      </dialog>
    </EnquiryContext.Provider>
  );
}

export function EnquiryButton({ kind, context, children }: { kind: FormKind; context: string; children: ReactNode }) {
  const { open } = useEnquiry();
  return (
    <button type="button" className="inline-flex min-h-11 items-center rounded-full bg-green px-5 font-semibold text-ivory" onClick={() => open(kind, context)}>
      {children}
    </button>
  );
}
```

Native `<dialog>` is not a `role="dialog"` in jsdom until `open` is set. The test's `showModal` stub sets `this.open = true`, which is what the assertion depends on. The `style.marginTop = 'auto'` pins the dialog to the bottom of the viewport on small screens; the `md:` classes pin it to the right edge from 900px. Do not add a second close control.

`EnquiryButton` is a `<button>`, not `Button`, because `Button` with no `href` does not forward `onClick` in a way that conflicts — actually `Button` does spread button props. Prefer `Button` if its types accept `onClick`. If they do, use `<Button type="button" onClick={() => open(kind, context)}>{children}</Button>` and update the test only if the accessible name changes. Do not change the accessible names in the test.

- [ ] **Step 4: Run the test**

```powershell
npx vitest run src/components/forms/EnquiryPanel.test.tsx src/components/forms/EnquiryForm.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Load chrome data in the site layout**

Add `src/lib/site-chrome.ts`:

```ts
import 'server-only';
import type { SiteContact } from '@/lib/contact';
import { formatAddress, toSiteContact } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';

export type SiteChrome = {
  contact: SiteContact;
  legalName: string;
  address: string;
  foundedYear: number | null;
  openingHours: string | null;
};

const emptyContact: SiteContact = {
  phone: '',
  phoneDisplay: '',
  whatsapp: '',
  email: '',
  responseTime: 'as soon as we can',
};

export async function getSiteChrome(): Promise<SiteChrome> {
  const settings = await fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']);
  const contact =
    settings?.phone && settings.phoneDisplay && settings.whatsapp && settings.email && settings.responseTime
      ? toSiteContact(settings)
      : emptyContact;
  return {
    contact,
    legalName: settings?.legalName ?? 'Village 60 Plus',
    address: formatAddress(settings?.headOffice) || 'Colombo, Sri Lanka',
    foundedYear: settings?.foundedYear ?? null,
    openingHours: settings?.openingHours ?? null,
  };
}
```

Install `server-only` if it is not already a dependency (`npm install server-only`). `fetchPublished` is the published-perspective helper from Task 9. `formatAddress` joins with newlines; that is the address the footer receives. Call `toSiteContact` only when phone, phoneDisplay, WhatsApp, email, and response time are all present.

Replace `src/app/(site)/layout.tsx` with:

```tsx
import { SkipLink } from '@/components/site/SkipLink';
import { Header } from '@/components/site/Header';
import { MobileActionBar } from '@/components/site/MobileActionBar';
import { Footer } from '@/components/site/Footer';
import { EnquiryButton, EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { getSiteChrome } from '@/lib/site-chrome';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const chrome = await getSiteChrome();
  return (
    <EnquiryProvider contact={chrome.contact}>
      <SkipLink />
      <Header contact={chrome.contact} enquiryTrigger={<EnquiryButton kind="general" context="Village 60 Plus">Enquire</EnquiryButton>} />
      <div className="pb-20 md:pb-0">{children}</div>
      <Footer
        contact={chrome.contact}
        legalName={chrome.legalName}
        address={chrome.address}
        foundedYear={chrome.foundedYear}
        openingHours={chrome.openingHours}
      />
      <MobileActionBar contact={chrome.contact} context="Village 60 Plus" />
    </EnquiryProvider>
  );
}
```

`MobileActionBar` context stays "Village 60 Plus" until Phase 4 passes a per-page context. Pages must render their own `<main id="main">` so the skip link has a target. The layout does not wrap children in `<main>`.

- [ ] **Step 6: Typecheck and run the form tests**

```powershell
npm run typecheck
npx vitest run src/lib/forms src/components/forms
```

Expected: typecheck clean, tests PASS. `npm run build` may still fail until a page renders `<main id="main">`; that is Phase 4, not a failure of this task. If the build fails only because `(site)/page.tsx` has no `<main id="main">`, add `id="main"` to its `<main>` and leave the rest of the placeholder.

- [ ] **Step 7: Commit**

```powershell
git add src/components/forms/EnquiryPanel.tsx src/components/forms/EnquiryPanel.test.tsx src/lib/site-chrome.ts src/app/(site)/layout.tsx package.json package-lock.json
git commit -m "feat(forms): add the enquiry panel and wire it into the site chrome"
```

**Phase 3 exit criteria:** `parseEnquiry` rejects a past Oracle date, a missing privacy tick, and a Find the Right Care submission that contains no clinical field. `processEnquiry` sends only `FORM_KINDS` subjects, drops honeypot posts, rate-limits, and on email failure returns `delivery-failed` plus a WhatsApp link without logging the visitor's name. `EnquiryForm` focuses the error summary. The header Enquire button opens the general form. `npm test` passes.

---

## Phase 4 — Pages

Each route file fetches with `fetchPublished` and renders a synchronous view inside `<main id="main">`. Vitest tests the view. `generateMetadata` uses `pageMetadata`. Dark `tone="night"` appears only on the homepage Oracle teaser, the Oracle page hero, and the SAGE hero. Do not render a second header, mobile bar, or footer.

### Task 23: Home

**Files:**
- Create: `src/app/(site)/home-view.tsx`, `src/app/(site)/home-view.test.tsx`
- Modify: `src/app/(site)/page.tsx` (replace the placeholder), `src/components/site/ContactActions.tsx`, `src/lib/site-settings.ts`

**Interfaces:**
- Consumes: `PageHero`, `Section`, `Heading`, `Button`, `StatusBadge`, `VideoHero`, `ResidenceCard`, `CareServiceCard`, `ContactActions`, `EnquiryButton`, `EnquiryProvider`, `isContentStatus`, `isFuture`, `isOperating`, `residencePath` (via `ResidenceCard`), `offeringPath`, `PAGE_QUERY`, `RESIDENCES_QUERY`, `CARE_SERVICES_QUERY`, `OFFERINGS_QUERY`, `SITE_SETTINGS_QUERY`, `fetchPublished`, `pageMetadata`, `organizationJsonLd`, `websiteJsonLd`, `JsonLd`, `docTag`, `getPublicEnv`, `contactFixture`.
- Produces:
  - `contactFromSettings(settings): SiteContact` in `src/lib/site-settings.ts`. Returns the empty contact (`responseTime: 'as soon as we can'`) when phone, display, WhatsApp, email, or response time is missing. Otherwise returns `toSiteContact`.
  - `ContactActions` gains `includeWhatsApp?: boolean` (default `true`). `false` renders Call only.
  - `HomeView({ home, residences, careServices, offerings, contact })` — eight `data-home-section` regions in order: `hero`, `pathways`, `oracle`, `homes`, `care`, `silver-roots`, `ecosystem`, `trust`.
  - `toResidenceCards`, `toCareCards`, `toHomeOfferings` — map query rows onto the view props. Drop rows with no `_id`.

- [ ] **Step 1: Write the failing test `src/app/(site)/home-view.test.tsx`**

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import { HomeView, type HomeOffering, type HomeViewProps } from './home-view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

const offerings: HomeOffering[] = [
  { slug: 'silver-roots', name: 'Silver Roots', summary: 'A services platform in development. The team helps by phone today.', status: 'in-development' },
  { slug: 'destination-retirement', name: 'Destination Retirement', summary: 'A planned stay concept. Nothing is bookable yet.', status: 'planned' },
  { slug: 'sage', name: 'SAGE', summary: 'Technology that stays in the background.', status: 'pilot' },
];

const props: HomeViewProps = {
  home: {
    title: 'Live well. Age exceptionally.',
    intro: 'Homes, care and practical support for later life in Sri Lanka.',
    heroImage: imageFixture('A verandah'),
    heroVideo: null,
  },
  residences: [
    { _id: 'residence.oracle', name: 'Oracle', slug: 'oracle', status: 'limited', shortLocation: 'Pepiliyana', summary: 'Ten rooms for independent adults.', heroImage: imageFixture('Oracle exterior'), careTypes: [] },
    { _id: 'residence.the-grove', name: 'The Grove', slug: 'the-grove', status: 'coming-soon', shortLocation: 'Kottawa', summary: 'Not open yet.', heroImage: imageFixture('The Grove'), careTypes: [] },
  ],
  careServices: [
    { _id: 'care.independent-living', name: 'Independent Living', slug: 'independent-living', status: 'available', summary: 'Your own routine.', heroImage: null },
  ],
  offerings,
  contact: contactFixture,
};

function renderHome(overrides: Partial<HomeViewProps> = {}) {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <HomeView {...props} {...overrides} />
    </EnquiryProvider>,
  );
}

describe('HomeView', () => {
  it('renders the eight sections in order, with Find the Right Care before Oracle', () => {
    const { container } = renderHome();
    expect([...container.querySelectorAll('[data-home-section]')].map((node) => node.getAttribute('data-home-section'))).toEqual([
      'hero',
      'pathways',
      'oracle',
      'homes',
      'care',
      'silver-roots',
      'ecosystem',
      'trust',
    ]);
    const find = screen.getAllByRole('link', { name: /Find the Right Care/i })[0];
    const oracle = screen.getAllByRole('heading', { name: 'Oracle' })[0];
    expect(find.compareDocumentPosition(oracle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Live well. Age exceptionally.');
  });

  it('links Oracle to /oracle and labels The Grove as coming soon', () => {
    renderHome();
    expect(screen.getByRole('link', { name: 'View Oracle' })).toHaveAttribute('href', '/oracle');
    const grove = screen.getByRole('heading', { name: 'The Grove' }).closest('article');
    expect(grove).not.toBeNull();
    expect(within(grove as HTMLElement).getByText('Coming soon')).toBeInTheDocument();
  });

  it('does not describe Silver Roots marketplace, payments, or accounts as live', () => {
    const { container } = renderHome();
    const silver = container.querySelector('[data-home-section="silver-roots"]');
    expect(silver?.textContent).toMatch(/In development/);
    expect(silver?.textContent).not.toMatch(/marketplace|payments|accounts/i);
    expect(screen.getByRole('link', { name: 'Destination Retirement' })).toHaveAttribute('href', '/destination-retirement');
    expect(screen.getByRole('link', { name: 'SAGE' })).toHaveAttribute('href', '/sage');
    expect(screen.getByText('Planned')).toBeInTheDocument();
    expect(screen.getByText('Pilot')).toBeInTheDocument();
  });

  it('sends the three pathways to Find the Right Care without a clinical field', () => {
    renderHome();
    expect(screen.getByRole('link', { name: /For a parent or relative/i })).toHaveAttribute('href', '/find-the-right-care?for=parent');
    expect(screen.getByRole('link', { name: /For myself/i })).toHaveAttribute('href', '/find-the-right-care?for=myself');
    expect(screen.getByRole('link', { name: /After hospital or surgery/i })).toHaveAttribute('href', '/find-the-right-care?for=after-hospital');
    expect(screen.queryByLabelText(/diagnosis/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/app/(site)/home-view.test.tsx
```

Expected: FAIL — cannot find `./home-view`.

- [ ] **Step 3: Add `includeWhatsApp` to `src/components/site/ContactActions.tsx`**

Replace the component with:

```tsx
import { Button } from '@/components/ui/Button';
import { telHref, whatsappHref, type SiteContact } from '@/lib/contact';

export function ContactActions({
  contact,
  context,
  onDark = false,
  size = 'md',
  showNumber = true,
  includeWhatsApp = true,
  className,
}: {
  contact: SiteContact;
  context: string;
  onDark?: boolean;
  size?: 'md' | 'lg';
  showNumber?: boolean;
  includeWhatsApp?: boolean;
  className?: string;
}) {
  return (
    <div className={className ?? 'flex flex-wrap gap-3'}>
      <Button href={telHref(contact.phone)} variant="primary" size={size} onDark={onDark} data-track="call_click">
        {showNumber ? `Call ${contact.phoneDisplay}` : 'Call'}
      </Button>
      {includeWhatsApp ? (
        <Button href={whatsappHref(contact.whatsapp, context)} variant="secondary" size={size} onDark={onDark} data-track="whatsapp_click" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </Button>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Add `contactFromSettings` to `src/lib/site-settings.ts`**

Append:

```ts
const EMPTY_CONTACT: SiteContact = {
  phone: '',
  phoneDisplay: '',
  whatsapp: '',
  email: '',
  responseTime: 'as soon as we can',
};

export function contactFromSettings(
  settings: Pick<SiteSettings, 'phone' | 'phoneDisplay' | 'whatsapp' | 'email' | 'responseTime'> | null | undefined,
): SiteContact {
  if (!settings?.phone || !settings.phoneDisplay || !settings.whatsapp || !settings.email || !settings.responseTime) {
    return EMPTY_CONTACT;
  }
  return toSiteContact({
    phone: settings.phone,
    phoneDisplay: settings.phoneDisplay,
    whatsapp: settings.whatsapp,
    email: settings.email,
    responseTime: settings.responseTime,
  });
}
```

`SiteContact` is already imported in this file. If generated fields are `string | null`, the guard narrows them. Do not cast.

- [ ] **Step 5: Create `src/app/(site)/home-view.tsx`**

```tsx
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { CareServiceCard, type CareServiceCardData } from '@/components/content/CareServiceCard';
import { ResidenceCard, type ResidenceCardData } from '@/components/content/ResidenceCard';
import { VideoHero, type HeroVideo } from '@/components/media/VideoHero';
import type { CmsImage } from '@/components/media/SanityImage';
import { ContactActions } from '@/components/site/ContactActions';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageHero } from '@/components/content/PageHero';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture, isOperating } from '@/lib/content-status';
import { offeringPath } from '@/lib/routes';

const PATHWAYS = [
  { title: 'For a parent or relative', body: 'You do not need to know the care category. Tell us who you are asking about.', href: '/find-the-right-care?for=parent' },
  { title: 'For myself', body: 'Start with the kind of day you want, and a person will talk it through with you.', href: '/find-the-right-care?for=myself' },
  { title: 'After hospital or surgery', body: 'If someone is leaving hospital, we can explain respite, recovery and rehabilitation in plain language.', href: '/find-the-right-care?for=after-hospital' },
] as const;

export type HomePageFields = {
  title?: string | null;
  intro?: string | null;
  heroImage?: CmsImage | null;
  heroVideo?: HeroVideo | null;
};

export type HomeOffering = {
  slug: string;
  name: string;
  summary?: string | null;
  status?: string | null;
};

export type HomeViewProps = {
  home: HomePageFields | null;
  residences: ResidenceCardData[];
  careServices: CareServiceCardData[];
  offerings: HomeOffering[];
  contact: SiteContact;
};

export function toResidenceCards(rows: Array<ResidenceCardData | null> | null | undefined): ResidenceCardData[] {
  return (rows ?? []).filter((row): row is ResidenceCardData => Boolean(row?._id));
}

export function toCareCards(rows: Array<CareServiceCardData | null> | null | undefined): CareServiceCardData[] {
  return (rows ?? []).filter((row): row is CareServiceCardData => Boolean(row?._id));
}

export function toHomeOfferings(rows: Array<{ slug?: string | null; name?: string | null; summary?: string | null; status?: string | null } | null> | null | undefined): HomeOffering[] {
  return (rows ?? []).flatMap((row) => (row?.slug && row.name ? [{ slug: row.slug, name: row.name, summary: row.summary ?? null, status: row.status ?? null }] : []));
}

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-home-section={name}>{children}</div>;
}

export function HomeView({ home, residences, careServices, offerings, contact }: HomeViewProps) {
  const video = home?.heroVideo?.videoUrl || home?.heroVideo?.poster?.asset?.url ? home.heroVideo : null;
  const oracle = residences.find((item) => item.slug === 'oracle');
  const silver = offerings.find((item) => item.slug === 'silver-roots');
  const secondary = offerings.filter((item) => item.slug === 'destination-retirement' || item.slug === 'sage');

  return (
    <main id="main">
      <Region name="hero">
        {video ? <VideoHero video={video} /> : null}
        <PageHero title="Live well. Age exceptionally." intro={home?.intro} image={video ? null : home?.heroImage} tone="ivory">
          <Button href="/find-the-right-care">Find the Right Care</Button>
          <ContactActions contact={contact} context="Village 60 Plus" showNumber={false} includeWhatsApp={false} />
        </PageHero>
      </Region>

      <Region name="pathways">
        <Section tone="sand" labelledBy="home-pathways">
          <Heading as="h2" id="home-pathways">Find the Right Care</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {PATHWAYS.map((path) => (
              <li key={path.href} className="rounded-panel border border-stone bg-paper p-6">
                <h3>{path.title}</h3>
                <p className="mt-2 max-w-prose-site">{path.body}</p>
                <div className="mt-4">
                  <Button href={path.href} variant="text">{path.title}</Button>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </Region>

      <Region name="oracle">
        <Section tone="night" labelledBy="home-oracle">
          {isContentStatus(oracle?.status) ? <StatusBadge status={oracle.status} tone="dark" /> : null}
          <Heading as="h2" id="home-oracle" onDark>Oracle</Heading>
          <p className="mt-4 max-w-prose-site">{oracle?.summary || 'Oracle is the flagship residence. The team confirms what is available today.'}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/oracle" onDark>Explore Oracle</Button>
            <EnquiryButton kind="oracle-visit" context="Oracle">Arrange a private visit</EnquiryButton>
          </div>
        </Section>
      </Region>

      <Region name="homes">
        <Section tone="ivory" labelledBy="home-homes">
          <Heading as="h2" id="home-homes">Our homes</Heading>
          {residences.length === 0 ? <p className="mt-4">Residence details will appear here once they are published.</p> : null}
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {residences.map((residence) => (
              <li key={residence._id}><ResidenceCard residence={residence} /></li>
            ))}
          </ul>
        </Section>
      </Region>

      <Region name="care">
        <Section tone="paper" labelledBy="home-care">
          <Heading as="h2" id="home-care">Living and care</Heading>
          {careServices.length === 0 ? <p className="mt-4">Care descriptions will appear here once they are published.</p> : null}
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {careServices.map((service) => (
              <li key={service._id}><CareServiceCard service={service} /></li>
            ))}
          </ul>
        </Section>
      </Region>

      <Region name="silver-roots">
        <Section tone="mist" labelledBy="home-silver">
          <Heading as="h2" id="home-silver">Silver Roots</Heading>
          {silver && isContentStatus(silver.status) && isFuture(silver.status) ? <StatusBadge status={silver.status} /> : null}
          <p className="mt-4 max-w-prose-site">{silver?.summary || 'Silver Roots extends support beyond the residences. What exists today is labelled on its page.'}</p>
          <div className="mt-6">
            <Button href="/silver-roots" variant="secondary">Read about Silver Roots</Button>
          </div>
        </Section>
      </Region>

      <Region name="ecosystem">
        <Section tone="sand" labelledBy="home-ecosystem">
          <Heading as="h2" id="home-ecosystem">Destination Retirement and SAGE</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {secondary.map((item) => (
              <li key={item.slug} className="rounded-panel border border-stone bg-paper p-6">
                {isContentStatus(item.status) && !isOperating(item.status) ? <StatusBadge status={item.status} /> : null}
                <h3 className="mt-2">{item.name}</h3>
                {item.summary ? <p className="mt-2 max-w-prose-site">{item.summary}</p> : null}
                <div className="mt-4">
                  <Button href={offeringPath(item.slug)} variant="text">{item.name}</Button>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </Region>

      <Region name="trust">
        <Section tone="ivory" labelledBy="home-trust">
          <Heading as="h2" id="home-trust">Talk with us</Heading>
          {home?.intro ? <p className="mt-4 max-w-prose-site">{home.intro}</p> : null}
          <div className="mt-6">
            <EnquiryButton kind="general" context="Home">Send an enquiry</EnquiryButton>
          </div>
        </Section>
      </Region>
    </main>
  );
}
```

The intro is both the hero supporting sentence and the closing trust line. The home document has one intro field. Do not add a footer. Do not pass `tone="night"` anywhere except the Oracle region. The fallback Oracle sentence must not say the residence is open.

- [ ] **Step 6: Run the view test**

```powershell
npx vitest run src/app/(site)/home-view.test.tsx
```

Expected: PASS. `EnquiryButton` throws if the test forgets `EnquiryProvider`. `VideoHero` stays unused in this fixture; a null `heroVideo` must still render the H1.

- [ ] **Step 7: Replace `src/app/(site)/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { organizationJsonLd, pageMetadata, websiteJsonLd } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { CARE_SERVICES_QUERY, OFFERINGS_QUERY, PAGE_QUERY, RESIDENCES_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { HomeView, toCareCards, toHomeOfferings, toResidenceCards } from './home-view';

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchPublished(PAGE_QUERY, { slug: 'home' }, [docTag('page', 'home'), 'page']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: '/',
    fallbackTitle: 'Village 60 Plus — homes, care and support for later life in Sri Lanka',
    fallbackDescription: 'Homes, care and practical support for later life in Sri Lanka.',
    seo: doc?.seo,
  });
}

export default async function HomePage() {
  const [home, residences, careServices, offerings, settings] = await Promise.all([
    fetchPublished(PAGE_QUERY, { slug: 'home' }, [docTag('page', 'home'), 'page']),
    fetchPublished(RESIDENCES_QUERY, {}, ['residence']),
    fetchPublished(CARE_SERVICES_QUERY, {}, ['careService']),
    fetchPublished(OFFERINGS_QUERY, {}, ['ecosystemOffering']),
    fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
  ]);
  const contact = contactFromSettings(settings);
  const siteUrl = getPublicEnv().siteUrl;
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd({
            brandName: settings?.brandName ?? 'Village 60 Plus',
            legalName: settings?.legalName,
            siteUrl,
            phone: contact.phone,
            email: contact.email,
          }),
          websiteJsonLd({ brandName: settings?.brandName ?? 'Village 60 Plus', siteUrl }),
        ]}
      />
      <HomeView
        home={home ? { title: home.title, intro: home.intro, heroImage: home.heroImage, heroVideo: home.heroVideo } : null}
        residences={toResidenceCards(residences)}
        careServices={toCareCards(careServices)}
        offerings={toHomeOfferings(offerings)}
        contact={contact}
      />
    </>
  );
}
```

If `tsc` says a query row is not a `ResidenceCardData`, map `_id`, `name`, `slug`, `status`, `shortLocation`, `summary`, `heroImage`, and `careTypes` explicitly inside `toResidenceCards`. Do not cast. `heroVideo` from `PAGE_QUERY` is `{ description, poster, videoUrl, captionsUrl }`, which matches `HeroVideo`.

- [ ] **Step 8: Typecheck**

```powershell
npm run typecheck
```

Expected: clean. Fix only errors in the files this task created or the two helpers it added.

- [ ] **Step 9: Commit**

```powershell
git add src/app/(site)/home-view.tsx src/app/(site)/home-view.test.tsx src/app/(site)/page.tsx src/components/site/ContactActions.tsx src/lib/site-settings.ts
git commit -m "feat(home): add the eight-section homepage"
```

---

### Task 24: Find the Right Care

**Files:**
- Create: `src/app/(site)/find-the-right-care/view.tsx`, `src/app/(site)/find-the-right-care/view.test.tsx`, `src/app/(site)/find-the-right-care/page.tsx`
- Modify: `src/components/forms/EnquiryForm.tsx` — accept optional `defaults`

**Interfaces:**
- Consumes: `PageHero`, `EnquiryForm`, `ContactActions`, `contactFromSettings`, `PAGE_QUERY`, `SITE_SETTINGS_QUERY`, `fetchPublished`, `pageMetadata`, `JsonLd`, `breadcrumbJsonLd`, `docTag`, `getPublicEnv`, `WHO_FOR` values `parent` and `myself`, `HELP_TYPES` value `recovery`.
- Produces:
  - `pathwayDefaults(value: string | undefined): Record<string, string>` — `parent` → `{ whoFor: 'parent' }`, `myself` → `{ whoFor: 'myself' }`, `after-hospital` → `{ helpType: 'recovery' }`, anything else → `{}`.
  - `FindCareView({ title, intro, contact, defaults })`.
  - `EnquiryForm` accepts `defaults?: Record<string, string>`. While `state.status === 'idle'`, a field with no returned value uses `defaults[field.name]`.

- [ ] **Step 1: Write the failing test `src/app/(site)/find-the-right-care/view.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { FindCareView, pathwayDefaults } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

describe('pathwayDefaults', () => {
  it('maps the homepage pathways onto whoFor or helpType', () => {
    expect(pathwayDefaults('parent')).toEqual({ whoFor: 'parent' });
    expect(pathwayDefaults('myself')).toEqual({ whoFor: 'myself' });
    expect(pathwayDefaults('after-hospital')).toEqual({ helpType: 'recovery' });
    expect(pathwayDefaults('diagnosis')).toEqual({});
    expect(pathwayDefaults(undefined)).toEqual({});
  });
});

describe('FindCareView', () => {
  it('states that the form is not a medical assessment and offers call and WhatsApp', () => {
    render(
      <FindCareView
        title="Find the right care"
        intro="You do not need to know the name of the care you are looking for."
        contact={contactFixture}
        defaults={{}}
      />,
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Find the right care' })).toHaveAttribute('id', 'page-title');
    expect(screen.getByText('You do not need to know the name of the care you are looking for.')).toBeInTheDocument();
    expect(screen.getByText('This form is not a medical assessment.')).toBeInTheDocument();
    expect(screen.queryByLabelText(/diagnosis/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Message')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'privacy notice' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /Call/ })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Find%20the%20Right%20Care'));
  });

  it('preselects who the enquiry is for from the homepage pathway', () => {
    render(
      <FindCareView title="Find the right care" intro="Tell us a little." contact={contactFixture} defaults={pathwayDefaults('parent')} />,
    );
    expect(screen.getByLabelText('Who is this for?')).toHaveValue('parent');
    expect(screen.getByLabelText('What kind of help are you considering?')).toHaveValue('');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/app/(site)/find-the-right-care/view.test.tsx
```

Expected: FAIL — cannot find `./view`.

- [ ] **Step 3: Pass `defaults` through `EnquiryForm`**

In `src/components/forms/EnquiryForm.tsx`, change the props and the field render to:

```tsx
export function EnquiryForm({
  kind,
  context,
  defaults,
}: {
  kind: FormKind;
  context: string;
  defaults?: Record<string, string>;
}) {
```

Keep the optional `headingId` prop from Task 21 on this signature.

Inside the `definition.fields.map` callback, replace the `defaultValue` prop:

```tsx
defaultValue={state.values[field.name] || (state.status === 'idle' ? defaults?.[field.name] : undefined)}
```

Leave every other line in `EnquiryForm.tsx` as it is. Do not add a wizard, a diagnosis field, or a message field to the find-care definition.

- [ ] **Step 4: Create `src/app/(site)/find-the-right-care/view.tsx`**

```tsx
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PageHero } from '@/components/content/PageHero';
import { ContactActions } from '@/components/site/ContactActions';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';

export function pathwayDefaults(value: string | undefined): Record<string, string> {
  if (value === 'parent') return { whoFor: 'parent' };
  if (value === 'myself') return { whoFor: 'myself' };
  if (value === 'after-hospital') return { helpType: 'recovery' };
  return {};
}

export function FindCareView({
  title,
  intro,
  contact,
  defaults,
}: {
  title: string;
  intro?: string | null;
  contact: SiteContact;
  defaults: Record<string, string>;
}) {
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory" />
      <Section tone="paper">
        <p className="max-w-prose-site">This form is not a medical assessment.</p>
        <div className="mt-8 max-w-prose-site">
          <EnquiryForm kind="find-care" context="Find the Right Care" defaults={defaults} />
        </div>
        <div className="mt-8">
          <ContactActions contact={contact} context="Find the Right Care" />
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 5: Run the view test and the form test**

```powershell
npx vitest run src/app/(site)/find-the-right-care/view.test.tsx src/components/forms/EnquiryForm.test.tsx
```

Expected: PASS. The select's value is the option value `parent`, not the label "A parent".

- [ ] **Step 6: Create `src/app/(site)/find-the-right-care/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { FindCareView, pathwayDefaults } from './view';

const PATH = '/find-the-right-care';

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchPublished(PAGE_QUERY, { slug: 'find-the-right-care' }, [docTag('page', 'find-the-right-care'), 'page']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: PATH,
    fallbackTitle: 'Find the right care',
    fallbackDescription: 'Tell us a little about what you are looking for. This is not a medical assessment.',
    seo: doc?.seo,
  });
}

export default async function FindCarePage({ searchParams }: { searchParams: Promise<{ for?: string }> }) {
  const [{ for: pathway }, doc, settings] = await Promise.all([
    searchParams,
    fetchPublished(PAGE_QUERY, { slug: 'find-the-right-care' }, [docTag('page', 'find-the-right-care'), 'page']),
    fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
  ]);
  const siteUrl = getPublicEnv().siteUrl;
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(siteUrl, [
          { label: 'Home', href: '/' },
          { label: 'Find the Right Care', href: PATH },
        ])}
      />
      <FindCareView
        title={doc?.title || 'Find the right care'}
        intro={doc?.intro}
        contact={contactFromSettings(settings)}
        defaults={pathwayDefaults(pathway)}
      />
    </>
  );
}
```

A missing page document still renders the fallback title and the assessment sentence. Do not throw.

- [ ] **Step 7: Typecheck**

```powershell
npm run typecheck
```

Expected: clean.

- [ ] **Step 8: Commit**

```powershell
git add src/app/(site)/find-the-right-care src/components/forms/EnquiryForm.tsx
git commit -m "feat(pages): add Find the Right Care"
```

---

### Task 25: Our Homes hub

**Files:**
- Create: `src/app/(site)/homes/home-filter.tsx`, `src/app/(site)/homes/view.tsx`, `src/app/(site)/homes/view.test.tsx`, `src/app/(site)/homes/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `Section`, `Heading`, `Button`, `ResidenceCard`, `ResidenceCardData`, `ContactActions`, `CONTENT_STATUSES`, `contactFromSettings`, `PAGE_QUERY` slug `homes`, `RESIDENCES_QUERY`, `SITE_SETTINGS_QUERY`, `fetchPublished`, `pageMetadata`, `breadcrumbJsonLd`, `JsonLd`, `docTag`, `getPublicEnv`, `toResidenceCards` (Task 23).
- Produces: `HomeFilter({ residences })` — client component. Filters the cards it receives by location text (case-insensitive substring of `shortLocation`), care-type slug, and status. Empty filters match everything. `HomesView({ title, intro, residences, contact })`.

- [ ] **Step 1: Write the failing test `src/app/(site)/homes/view.test.tsx`**

```tsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import type { ResidenceCardData } from '@/components/content/ResidenceCard';
import { HomesView } from './view';

const residences: ResidenceCardData[] = [
  {
    _id: 'residence.serenity',
    name: 'Serenity',
    slug: 'serenity',
    status: 'available',
    shortLocation: 'Colombo',
    summary: 'A smaller home.',
    heroImage: imageFixture('Serenity exterior'),
    careTypes: [{ _id: 'care.residential-care', name: 'Residential Care', slug: 'residential-care' }],
  },
  {
    _id: 'residence.the-grove',
    name: 'The Grove',
    slug: 'the-grove',
    status: 'coming-soon',
    shortLocation: 'Kottawa',
    summary: 'Not open yet.',
    heroImage: imageFixture('The Grove'),
    careTypes: [],
  },
];

describe('HomesView', () => {
  it('filters by location, care type and status, and keeps The Grove labelled', async () => {
    render(<HomesView title="Our homes" intro="Different homes, one philosophy." residences={residences} contact={contactFixture} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const grove = screen.getByRole('heading', { name: 'The Grove' }).closest('article');
    expect(within(grove as HTMLElement).getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Find the Right Care' })).toHaveAttribute('href', '/find-the-right-care');
    expect(screen.getByRole('heading', { name: 'Which home may suit you?' })).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Location'), 'kottawa');
    expect(screen.getByRole('heading', { name: 'The Grove' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Serenity' })).not.toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText('Location'));
    await userEvent.selectOptions(screen.getByLabelText('Care type'), 'residential-care');
    expect(screen.getByRole('heading', { name: 'Serenity' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'The Grove' })).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Care type'), '');
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'coming-soon');
    expect(screen.getByRole('heading', { name: 'The Grove' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Serenity' })).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Status'), '');
    await userEvent.type(screen.getByLabelText('Location'), 'zzzz');
    expect(screen.getByText('No homes match those filters.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/app/(site)/homes/view.test.tsx
```

Expected: FAIL — cannot find `./view`.

- [ ] **Step 3: Create `src/app/(site)/homes/home-filter.tsx`**

```tsx
'use client';

import { useMemo, useState } from 'react';
import { ResidenceCard, type ResidenceCardData } from '@/components/content/ResidenceCard';
import { CONTENT_STATUSES } from '@/lib/content-status';

export function HomeFilter({ residences }: { residences: ResidenceCardData[] }) {
  const [location, setLocation] = useState('');
  const [care, setCare] = useState('');
  const [status, setStatus] = useState('');

  const careOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const residence of residences) {
      for (const item of residence.careTypes ?? []) {
        if (item?.slug && item.name) seen.set(item.slug, item.name);
      }
    }
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
  }, [residences]);

  const shown = residences.filter((residence) => {
    const query = location.trim().toLowerCase();
    if (query && !(residence.shortLocation ?? '').toLowerCase().includes(query)) return false;
    if (care && !(residence.careTypes ?? []).some((item) => item?.slug === care)) return false;
    if (status && residence.status !== status) return false;
    return true;
  });

  return (
    <div>
      <form className="grid gap-4 md:grid-cols-3" aria-label="Filter homes">
        <label className="flex flex-col gap-1.5 font-semibold">
          Location
          <input value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-input border border-stone bg-paper px-3 py-2.5 font-normal" />
        </label>
        <label className="flex flex-col gap-1.5 font-semibold">
          Care type
          <select value={care} onChange={(event) => setCare(event.target.value)} className="min-h-11 rounded-input border border-stone bg-paper px-3 py-2.5 font-normal">
            <option value="">Any care type</option>
            {careOptions.map((option) => (
              <option key={option.slug} value={option.slug}>{option.name}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 font-semibold">
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 rounded-input border border-stone bg-paper px-3 py-2.5 font-normal">
            <option value="">Any status</option>
            {CONTENT_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </form>
      {shown.length === 0 ? (
        <p className="mt-8">No homes match those filters.</p>
      ) : (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((residence) => (
            <li key={residence._id}><ResidenceCard residence={residence} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

`ResidenceCard` imports `urlFor`, which uses the public Sanity client. That is safe in this client component. Do not fetch inside the filter. The list is the six residences already loaded by the page.

- [ ] **Step 4: Create `src/app/(site)/homes/view.tsx`**

```tsx
import { HomeFilter } from './home-filter';
import { PageHero } from '@/components/content/PageHero';
import type { ResidenceCardData } from '@/components/content/ResidenceCard';
import { ContactActions } from '@/components/site/ContactActions';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';

export function HomesView({
  title,
  intro,
  residences,
  contact,
}: {
  title: string;
  intro?: string | null;
  residences: ResidenceCardData[];
  contact: SiteContact;
}) {
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory">
        <ContactActions contact={contact} context="Our homes" />
      </PageHero>
      <Section tone="paper">
        <HomeFilter residences={residences} />
      </Section>
      <Section tone="sand" labelledBy="which-home">
        <Heading as="h2" id="which-home">Which home may suit you?</Heading>
        <p className="mt-4 max-w-prose-site">If you are not sure, tell us a little about the person and the situation. This is not an assessment.</p>
        <div className="mt-6">
          <Button href="/find-the-right-care">Find the Right Care</Button>
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 5: Run the test**

```powershell
npx vitest run src/app/(site)/homes/view.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Create `src/app/(site)/homes/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY, RESIDENCES_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { toResidenceCards } from '../home-view';
import { HomesView } from './view';

const PATH = '/homes';

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchPublished(PAGE_QUERY, { slug: 'homes' }, [docTag('page', 'homes'), 'page']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: PATH,
    fallbackTitle: 'Our homes',
    fallbackDescription: 'Compare Village 60 Plus residences by location, care and status.',
    seo: doc?.seo,
  });
}

export default async function HomesPage() {
  const [doc, residences, settings] = await Promise.all([
    fetchPublished(PAGE_QUERY, { slug: 'homes' }, [docTag('page', 'homes'), 'page']),
    fetchPublished(RESIDENCES_QUERY, {}, ['residence']),
    fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
  ]);
  const siteUrl = getPublicEnv().siteUrl;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Our homes', href: PATH }])} />
      <HomesView title={doc?.title || 'Our homes'} intro={doc?.intro} residences={toResidenceCards(residences)} contact={contactFromSettings(settings)} />
    </>
  );
}
```

- [ ] **Step 7: Typecheck and commit**

```powershell
npm run typecheck
npx vitest run src/app/(site)/homes/view.test.tsx
git add src/app/(site)/homes
git commit -m "feat(pages): add the Our Homes hub with client-side filters"
```

Expected: typecheck clean, test PASS.

---

### Task 26: Residence template and The Grove

**Files:**
- Create: `src/app/(site)/homes/[slug]/view.tsx`, `src/app/(site)/homes/[slug]/view.test.tsx`, `src/app/(site)/homes/[slug]/page.tsx`
- Modify: `src/lib/routes.ts`, `src/lib/routes.test.ts`, `src/lib/forms/kinds.ts`, `next.config.ts`

**Interfaces:**
- Consumes: `PageHero`, `Breadcrumbs`, `Section`, `Heading`, `PortableText`, `CapabilityList`, `Gallery`, `StaticMap`, `FaqList`, `SanityImage`, `EnquiryForm`, `EnquiryButton`, `EnquiryProvider`, `ContactActions`, `Chip`, `isContentStatus`, `isFuture`, `RESIDENCE_QUERY`, `SITE_SETTINGS_QUERY`, `fetchPublished`, `pageMetadata`, `breadcrumbJsonLd`, `localBusinessJsonLd`, `JsonLd`, `residencePath`, `docTag`, `getPublicEnv`, `contactFromSettings`, `FORM_KINDS`, `FormKind`.
- Produces:
  - `residenceStaticParams(): { slug: string }[]` — `RESIDENCE_SLUGS` except `oracle`.
  - `ORACLE_HOMES_REDIRECT` = `{ source: '/homes/oracle', destination: '/oracle', permanent: true }`.
  - `asFormKind(value, fallback = 'general'): FormKind`.
  - `ResidenceView({ residence, contact, mapsKey })`. `residence` null renders an empty state with one H1 and does not throw. When `isFuture(status)`, render breadcrumbs, hero, the coming-soon note, and `<EnquiryForm kind="grove-interest" />` only. Otherwise render the operating sections below, in order.

- [ ] **Step 1: Add the failing route tests to `src/lib/routes.test.ts`**

```ts
import { ORACLE_HOMES_REDIRECT, residenceStaticParams } from './routes';

it('builds residence params without Oracle and redirects /homes/oracle', () => {
  expect(residenceStaticParams().map((item) => item.slug)).toEqual(['tranquility', 'serenity', 'house-on-the-hill', 'enchanted-fields', 'the-grove']);
  expect(ORACLE_HOMES_REDIRECT).toEqual({ source: '/homes/oracle', destination: '/oracle', permanent: true });
});
```

Add the import next to the existing routes import. Keep the three tests already in the file.

- [ ] **Step 2: Write the failing view test `src/app/(site)/homes/[slug]/view.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import { ResidenceView, type ResidenceContent } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

const block = (text: string) => [
  { _type: 'block' as const, _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text, marks: [] }] },
];

const operating: ResidenceContent = {
  name: 'Serenity',
  slug: 'serenity',
  status: 'available',
  shortLocation: 'Colombo',
  summary: 'A smaller home.',
  heroImage: imageFixture('Serenity exterior'),
  description: block('Serenity is a small household.'),
  careTypes: [{ _id: 'care.residential-care', name: 'Residential Care', slug: 'residential-care' }],
  audienceFit: ['People who prefer a small household'],
  atmosphere: block('Mornings start at your own pace.'),
  sharedSpaces: ['Dining room'],
  rooms: [{ _key: 'room-1', name: 'Garden room', house: null, summary: 'A quiet room.', facts: ['Verified size is not published yet'], image: imageFixture('Garden room') }],
  careAndSupport: [{ _key: 'care-1', title: 'Care team on site', description: 'A team nearby.', provision: 'included', status: 'available' }],
  everydayLife: [{ _key: 'day-1', title: 'Meals', description: 'Home-cooked meals.', provision: 'included', status: 'available' }],
  gallery: [{ ...imageFixture('Serenity garden'), _key: 'g1' }],
  team: [
    { _id: 'team.amara', name: 'Amara Perera', role: 'Care lead', credentials: ['Registered nurse'], image: imageFixture('Amara Perera') },
    { _id: 'team.blank', name: 'No Photo', role: 'Coordinator', credentials: [], image: { ...imageFixture('hidden'), alt: ' ' } },
  ],
  address: { line1: '12 Example Lane', city: 'Colombo', country: 'Sri Lanka' },
  faqs: [{ _id: 'faq.visit', question: 'Can we visit before deciding?', answer: block('Yes. Visits are by appointment.') }],
  formKind: 'general',
  comingSoonNote: null,
};

const future: ResidenceContent = {
  ...operating,
  name: 'The Grove',
  slug: 'the-grove',
  status: 'coming-soon',
  comingSoonNote: 'The Grove is not yet open. Register your interest and the team will share verified news.',
  formKind: 'grove-interest',
};

function renderResidence(residence: ResidenceContent | null) {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <ResidenceView residence={residence} contact={contactFixture} mapsKey={null} />
    </EnquiryProvider>,
  );
}

describe('ResidenceView', () => {
  it('renders the operating sections in order and a single h1', () => {
    const { container } = renderResidence(operating);
    expect([...container.querySelectorAll('[data-residence-section]')].map((node) => node.getAttribute('data-residence-section'))).toEqual([
      'hero', 'audience', 'atmosphere', 'spaces', 'care', 'everyday', 'gallery', 'team', 'map', 'faqs', 'enquiry',
    ]);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Serenity' })).toHaveAttribute('id', 'page-title');
    expect(screen.getByText('People who prefer a small household')).toBeInTheDocument();
    expect(screen.getByText('Garden room')).toBeInTheDocument();
    expect(screen.getByText('Care team on site')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Amara Perera' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'hidden' })).not.toBeInTheDocument();
    expect(screen.getByText('Can we visit before deciding?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get directions' })).toHaveAttribute('href', expect.stringContaining('https://www.google.com/maps/search/'));
    expect(screen.getByText('Serenity', { selector: '[aria-current="page"]' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Register your interest' })).not.toBeInTheDocument();
  });

  it('replaces operational sections with the coming-soon note and one interest form', () => {
    const { container } = renderResidence(future);
    expect(container.querySelector('[data-residence-section="spaces"]')).toBeNull();
    expect(container.querySelector('[data-residence-section="gallery"]')).toBeNull();
    expect(container.querySelector('[data-residence-section="team"]')).toBeNull();
    expect(container.querySelector('[data-residence-section="map"]')).toBeNull();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText(/not yet open/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Register your interest' })).toBeInTheDocument();
    expect(screen.queryByText('Garden room')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('renders an empty state when the document is missing', () => {
    renderResidence(null);
    expect(screen.getByRole('heading', { level: 1, name: 'This home' })).toBeInTheDocument();
    expect(screen.getByText(/once they are published/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run to verify both fail**

```powershell
npx vitest run src/lib/routes.test.ts src/app/(site)/homes/[slug]/view.test.tsx
```

Expected: FAIL — `residenceStaticParams` is not exported, and `./view` cannot be found. In PowerShell, quote the slug path if the brackets are treated as wildcards:

```powershell
npx vitest run src/lib/routes.test.ts "src/app/(site)/homes/[slug]/view.test.tsx"
```

- [ ] **Step 4: Add the route helpers**

Append to `src/lib/routes.ts`:

```ts
export function residenceStaticParams(): Array<{ slug: string }> {
  return RESIDENCE_SLUGS.filter((slug) => slug !== ORACLE_SLUG).map((slug) => ({ slug }));
}

export const ORACLE_HOMES_REDIRECT = { source: '/homes/oracle', destination: '/oracle', permanent: true } as const;
```

Append to `src/lib/forms/kinds.ts`:

```ts
export function asFormKind(value: string | null | undefined, fallback: FormKind = 'general'): FormKind {
  return FORM_KINDS.some((item) => item.value === value) ? (value as FormKind) : fallback;
}
```

In `next.config.ts`, add `redirects` to the existing config object. Do not add other keys in this task.

```ts
import type { NextConfig } from 'next';
import { ORACLE_HOMES_REDIRECT } from './src/lib/routes';

const nextConfig: NextConfig = {
  async redirects() {
    return [ORACLE_HOMES_REDIRECT];
  },
};

export default nextConfig;
```

If `next.config.ts` already exports a config object, add only the import and the `redirects` method. Keep every other existing key.

- [ ] **Step 5: Create `src/app/(site)/homes/[slug]/view.tsx`**

```tsx
import type { PortableTextBlock } from '@portabletext/react';
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { CapabilityList, type CapabilityItem } from '@/components/content/CapabilityList';
import { FaqList, type FaqItem } from '@/components/content/FaqList';
import { PageHero } from '@/components/content/PageHero';
import { PortableText } from '@/components/content/PortableText';
import { Gallery, type GalleryImage } from '@/components/media/Gallery';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { StaticMap } from '@/components/media/StaticMap';
import { ContactActions } from '@/components/site/ContactActions';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Chip } from '@/components/ui/Chip';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture } from '@/lib/content-status';
import { asFormKind } from '@/lib/forms/kinds';
import type { MapAddress } from '@/lib/maps';

export type ResidenceContent = {
  name: string;
  slug: string;
  status?: string | null;
  shortLocation?: string | null;
  summary?: string | null;
  heroImage?: CmsImage | null;
  description?: PortableTextBlock[] | null;
  careTypes?: Array<{ _id: string; name?: string | null; slug?: string | null } | null> | null;
  audienceFit?: Array<string | null> | null;
  atmosphere?: PortableTextBlock[] | null;
  sharedSpaces?: Array<string | null> | null;
  rooms?: Array<{ _key: string; name?: string | null; house?: string | null; summary?: string | null; facts?: Array<string | null> | null; image?: CmsImage | null } | null> | null;
  careAndSupport?: Array<CapabilityItem | null> | null;
  everydayLife?: Array<CapabilityItem | null> | null;
  gallery?: Array<GalleryImage | null> | null;
  team?: Array<{ _id: string; name?: string | null; role?: string | null; credentials?: Array<string | null> | null; image?: CmsImage | null } | null> | null;
  address?: MapAddress | null;
  faqs?: Array<FaqItem | null> | null;
  formKind?: string | null;
  comingSoonNote?: string | null;
};

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-residence-section={name}>{children}</div>;
}

export function ResidenceView({
  residence,
  contact,
  mapsKey,
}: {
  residence: ResidenceContent | null;
  contact: SiteContact;
  mapsKey: string | null;
}) {
  if (!residence) {
    return (
      <main id="main">
        <PageHero title="This home" intro="Details will appear here once they are published." tone="ivory" />
      </main>
    );
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Our homes', href: '/homes' },
    { label: residence.name },
  ];
  const future = isContentStatus(residence.status) && isFuture(residence.status);
  const cares = (residence.careTypes ?? []).filter((item): item is { _id: string; name: string } => Boolean(item?.name));

  if (future) {
    return (
      <main id="main">
        <Breadcrumbs items={crumbs} />
        <Region name="hero">
          <PageHero title={residence.name} intro={residence.shortLocation} image={residence.heroImage} status={residence.status} tone="ivory" />
        </Region>
        <Region name="coming-soon">
          <Section tone="paper">
            <p className="max-w-prose-site">{residence.comingSoonNote}</p>
            <div className="mt-8 max-w-prose-site">
              <EnquiryForm kind="grove-interest" context={residence.name} />
            </div>
          </Section>
        </Region>
      </main>
    );
  }

  const rooms = (residence.rooms ?? []).filter((room): room is NonNullable<typeof room> & { name: string } => Boolean(room?.name));
  const spaces = (residence.sharedSpaces ?? []).filter((space): space is string => Boolean(space));
  const team = (residence.team ?? []).filter((person): person is NonNullable<typeof person> & { name: string } => Boolean(person?.name));

  return (
    <main id="main">
      <Breadcrumbs items={crumbs} />
      <Region name="hero">
        <PageHero title={residence.name} intro={residence.summary} image={residence.heroImage} status={residence.status} tone="ivory">
          {residence.shortLocation ? <p>{residence.shortLocation}</p> : null}
          {cares.map((care) => <Chip key={care._id}>{care.name}</Chip>)}
        </PageHero>
        <div className="gutter mx-auto w-full max-w-site pb-8">
          <PortableText value={residence.description} />
        </div>
      </Region>
      <Region name="audience">
        <Section tone="sand" labelledBy="who-it-suits">
          <Heading as="h2" id="who-it-suits">Who this home suits</Heading>
          <ul className="mt-4 list-disc pl-6">
            {(residence.audienceFit ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Section>
      </Region>
      <Region name="atmosphere">
        <Section tone="ivory" labelledBy="atmosphere">
          <Heading as="h2" id="atmosphere">Atmosphere and daily life</Heading>
          <div className="mt-4"><PortableText value={residence.atmosphere} /></div>
        </Section>
      </Region>
      <Region name="spaces">
        <Section tone="paper" labelledBy="spaces">
          <Heading as="h2" id="spaces">Rooms and shared spaces</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {rooms.map((room) => (
              <li key={room._key} className="rounded-panel border border-stone bg-ivory p-6">
                <SanityImage image={room.image} width={640} height={400} sizes="(min-width: 900px) 50vw, 100vw" />
                <h3 className="mt-4">{room.name}</h3>
                {room.house ? <p>{room.house}</p> : null}
                {room.summary ? <p className="mt-2">{room.summary}</p> : null}
                <ul className="mt-2 list-disc pl-6">
                  {(room.facts ?? []).filter(Boolean).map((fact) => <li key={fact}>{fact}</li>)}
                </ul>
              </li>
            ))}
          </ul>
          {spaces.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {spaces.map((space) => <li key={space}><Chip>{space}</Chip></li>)}
            </ul>
          ) : null}
        </Section>
      </Region>
      <Region name="care">
        <Section tone="mist" labelledBy="care-here">
          <Heading as="h2" id="care-here">Care and support at this home</Heading>
          <div className="mt-4"><CapabilityList items={residence.careAndSupport} /></div>
        </Section>
      </Region>
      <Region name="everyday">
        <Section tone="ivory" labelledBy="everyday">
          <Heading as="h2" id="everyday">Meals, housekeeping and family visits</Heading>
          <div className="mt-4"><CapabilityList items={residence.everydayLife} /></div>
        </Section>
      </Region>
      <Region name="gallery">
        <Section tone="paper">
          <Gallery images={residence.gallery} label={`${residence.name} photographs`} />
        </Section>
      </Region>
      <Region name="team">
        <Section tone="sand" labelledBy="team">
          <Heading as="h2" id="team">Team</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.map((person) => (
              <li key={person._id}>
                <SanityImage image={person.image} width={480} height={480} sizes="240px" />
                <h3 className="mt-3">{person.name}</h3>
                {person.role ? <p>{person.role}</p> : null}
                <ul>
                  {(person.credentials ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </Section>
      </Region>
      <Region name="map">
        <Section tone="ivory" labelledBy="visit">
          <Heading as="h2" id="visit">Visit</Heading>
          <div className="mt-4"><StaticMap address={residence.address} mapsKey={mapsKey} label={`Map of ${residence.name}`} /></div>
        </Section>
      </Region>
      <Region name="faqs">
        <Section tone="paper">
          <FaqList items={residence.faqs} />
        </Section>
      </Region>
      <Region name="enquiry">
        <Section tone="sand">
          <EnquiryButton kind={asFormKind(residence.formKind)} context={residence.name}>Enquire</EnquiryButton>
          <div className="mt-4">
            <ContactActions contact={contact} context={residence.name} />
          </div>
        </Section>
      </Region>
    </main>
  );
}
```

Also render `PortableText` for `residence.description` under the hero region, after `PageHero`, so the introduction is not dropped. Put it in the hero region:

```tsx
<div className="gutter mx-auto w-full max-w-site pb-8">
  <PortableText value={residence.description} />
</div>
```

The future branch does not render description, rooms, care, gallery, team, or the map. `SanityImage` already returns null when alt is blank, so the "No Photo" member shows a name and no image. The operating hero renders `description` once, under `PageHero`.

- [ ] **Step 6: Run the tests**

```powershell
npx vitest run src/lib/routes.test.ts "src/app/(site)/homes/[slug]/view.test.tsx"
```

Expected: PASS.

- [ ] **Step 7: Create `src/app/(site)/homes/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, localBusinessJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { ORACLE_SLUG, RESIDENCE_SLUGS, residencePath, residenceStaticParams } from '@/lib/routes';
import { fetchPublished } from '@/sanity/fetch';
import { RESIDENCE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { ResidenceView, type ResidenceContent } from './view';

export function generateStaticParams() {
  return residenceStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await fetchPublished(RESIDENCE_QUERY, { slug }, [docTag('residence', slug), 'residence']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: residencePath(slug),
    fallbackTitle: doc?.name || 'Residence',
    fallbackDescription: doc?.summary || 'A Village 60 Plus residence.',
    seo: doc?.seo,
  });
}

export default async function ResidencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === ORACLE_SLUG) redirect('/oracle');
  if (!(RESIDENCE_SLUGS as readonly string[]).includes(slug)) notFound();

  const [doc, settings] = await Promise.all([
    fetchPublished(RESIDENCE_QUERY, { slug }, [docTag('residence', slug), 'residence']),
    fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
  ]);
  const contact = contactFromSettings(settings);
  const siteUrl = getPublicEnv().siteUrl;
  const residence: ResidenceContent | null = doc?.name && doc.slug ? {
    name: doc.name,
    slug: doc.slug,
    status: doc.status,
    shortLocation: doc.shortLocation,
    summary: doc.summary,
    heroImage: doc.heroImage,
    description: doc.description,
    careTypes: doc.careTypes,
    audienceFit: doc.audienceFit,
    atmosphere: doc.atmosphere,
    sharedSpaces: doc.sharedSpaces,
    rooms: doc.rooms,
    careAndSupport: doc.careAndSupport,
    everydayLife: doc.everydayLife,
    gallery: doc.gallery,
    team: doc.team,
    address: doc.address,
    faqs: doc.faqs,
    formKind: doc.formKind,
    comingSoonNote: doc.comingSoonNote,
  } : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(siteUrl, [
            { label: 'Home', href: '/' },
            { label: 'Our homes', href: '/homes' },
            { label: residence?.name || 'Residence', href: residencePath(slug) },
          ]),
          residence
            ? localBusinessJsonLd({
                name: residence.name,
                status: residence.status,
                path: residencePath(slug),
                siteUrl,
                phone: contact.phone,
                description: residence.summary,
                address: residence.address,
              })
            : null,
        ]}
      />
      <ResidenceView residence={residence} contact={contact} mapsKey={getPublicEnv().mapsKey} />
    </>
  );
}
```

If a generated field name differs (`description` as portable text, `rooms[]._key`), map that field. Do not cast the whole document. A slug outside `RESIDENCE_SLUGS` calls `notFound()`. A slug in the list with no document renders the empty state. `localBusinessJsonLd` returns null unless the status is operating and the address has lines, so The Grove emits no LocalBusiness node.

- [ ] **Step 8: Typecheck and commit**

```powershell
npm run typecheck
npx vitest run src/lib/routes.test.ts "src/app/(site)/homes/[slug]/view.test.tsx"
git add src/lib/routes.ts src/lib/routes.test.ts src/lib/forms/kinds.ts next.config.ts "src/app/(site)/homes/[slug]"
git commit -m "feat(pages): add the residence template and the Grove interest form"
```

Expected: typecheck clean, tests PASS.

---

### Task 27: Oracle

**Files:**
- Create: `src/app/(site)/oracle/view.tsx`, `src/app/(site)/oracle/view.test.tsx`, `src/app/(site)/oracle/page.tsx`

**Interfaces:**
- Consumes: `ResidenceContent` (Task 26), `PageHero`, `Section`, `Heading`, `PortableText`, `CapabilityList`, `SanityImage`, `StaticMap`, `EnquiryForm`, `Chip`, `isContentStatus`, `isFuture`, `RESIDENCE_QUERY` with `{ slug: 'oracle' }`, `SITE_SETTINGS_QUERY`, `fetchPublished`, `pageMetadata`, `breadcrumbJsonLd`, `localBusinessJsonLd`, `JsonLd`, `docTag`, `getPublicEnv`, `contactFromSettings`.
- Produces: `OracleView({ residence, contact, mapsKey })`. Hero `tone="night"`. No other night section. Room names come from `rooms[].name`. Capabilities whose `provision` is not `included` are followed by the sentence "These services are arranged separately." Two `<EnquiryForm kind="oracle-visit" context="Oracle" />`. A future status shows `StatusBadge` and the coming-soon note, and the view's own copy does not say the residence is open.

- [ ] **Step 1: Write the failing test `src/app/(site)/oracle/view.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { imageFixture } from '@/test/fixtures';
import type { ResidenceContent } from '../homes/[slug]/view';
import { OracleView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

const block = (text: string) => [
  { _type: 'block' as const, _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text, marks: [] }] },
];

const oracle: ResidenceContent = {
  name: 'Oracle',
  slug: 'oracle',
  status: 'limited',
  shortLocation: 'Pepiliyana',
  summary: 'Ten rooms for independent adults, with support available when wanted.',
  heroImage: imageFixture('Oracle exterior'),
  description: block('A private residence for independent adults.'),
  careTypes: [{ _id: 'care.independent-living', name: 'Independent Living', slug: 'independent-living' }],
  audienceFit: ['Independent adults who want privacy without isolation'],
  atmosphere: block('The day follows the resident, not a timetable.'),
  sharedSpaces: ['Dining room', 'Garden'],
  rooms: [
    { _key: 'jade', name: 'Jade', house: 'House 1', summary: 'Room facts will be added once verified.', facts: [], image: imageFixture('Jade') },
    { _key: 'pearl', name: 'Pearl', house: 'House 2', summary: null, facts: ['Aspect to be confirmed'], image: imageFixture('Pearl') },
  ],
  careAndSupport: [
    { _key: 'assist', title: 'Everyday assistance', description: 'Help on request.', provision: 'included', status: 'available' },
    { _key: 'partner', title: 'Appointment transport', description: 'Arranged with a partner.', provision: 'partner-arranged', status: 'available' },
  ],
  everydayLife: [{ _key: 'meals', title: 'Dining', description: 'Meals in the shared dining room or in the room.', provision: 'included', status: 'available' }],
  gallery: [],
  team: [],
  address: { line1: 'Pepiliyana Road', city: 'Pepiliyana', country: 'Sri Lanka' },
  faqs: [],
  formKind: 'oracle-visit',
  comingSoonNote: null,
};

describe('OracleView', () => {
  it('lists the rooms it is given and repeats the visit form', () => {
    const { container } = render(<OracleView residence={oracle} contact={contactFixture} mapsKey={null} />);
    expect([...container.querySelectorAll('[data-oracle-section]')].map((node) => node.getAttribute('data-oracle-section'))).toEqual([
      'hero', 'rooms', 'spaces', 'daily-life', 'everyday', 'optional', 'independence', 'map', 'visit',
    ]);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Oracle' })).toHaveAttribute('id', 'page-title');
    expect(screen.getByText('Jade')).toBeInTheDocument();
    expect(screen.getByText('Pearl')).toBeInTheDocument();
    expect(screen.queryByText('Onyx')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Live your day, your way.' })).toBeInTheDocument();
    expect(screen.getByText(/arranged separately/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Arrange a private visit' })).toHaveLength(2);
    expect(screen.queryByText(/international standard/i)).not.toBeInTheDocument();
  });

  it('shows the coming-soon badge and does not describe a future Oracle as open', () => {
    render(
      <OracleView
        residence={{ ...oracle, status: 'coming-soon', comingSoonNote: 'Dates will be published only once confirmed.' }}
        contact={contactFixture}
        mapsKey={null}
      />,
    );
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText('Dates will be published only once confirmed.')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/now open|open now|is open/i);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run "src/app/(site)/oracle/view.test.tsx"
```

Expected: FAIL — cannot find `./view`.

- [ ] **Step 3: Create `src/app/(site)/oracle/view.tsx`**

```tsx
import type { ReactNode } from 'react';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { CapabilityList } from '@/components/content/CapabilityList';
import { PageHero } from '@/components/content/PageHero';
import { PortableText } from '@/components/content/PortableText';
import { SanityImage } from '@/components/media/SanityImage';
import { StaticMap } from '@/components/media/StaticMap';
import { Chip } from '@/components/ui/Chip';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture } from '@/lib/content-status';
import type { ResidenceContent } from '../homes/[slug]/view';

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-oracle-section={name}>{children}</div>;
}

export function OracleView({
  residence,
  contact,
  mapsKey,
}: {
  residence: ResidenceContent | null;
  contact: SiteContact;
  mapsKey: string | null;
}) {
  if (!residence) {
    return (
      <main id="main">
        <PageHero title="Oracle" intro="Details will appear here once they are published." tone="night" />
      </main>
    );
  }

  const future = isContentStatus(residence.status) && isFuture(residence.status);
  const rooms = (residence.rooms ?? []).filter((room): room is NonNullable<typeof room> & { name: string } => Boolean(room?.name));
  const spaces = (residence.sharedSpaces ?? []).filter((space): space is string => Boolean(space));
  const optional = (residence.careAndSupport ?? []).filter((item) => item?.title && item.provision && item.provision !== 'included');

  return (
    <main id="main">
      <Region name="hero">
        <PageHero title={residence.name} intro={residence.summary} image={residence.heroImage} status={residence.status} tone="night">
          {residence.shortLocation ? <p>{residence.shortLocation}</p> : null}
        </PageHero>
        <Section tone="ivory">
          {future && residence.comingSoonNote ? <p className="max-w-prose-site">{residence.comingSoonNote}</p> : null}
          <div className="mt-4"><PortableText value={residence.description} /></div>
          <div className="mt-8 max-w-prose-site">
            <EnquiryForm kind="oracle-visit" context="Oracle" />
          </div>
        </Section>
      </Region>
      <Region name="rooms">
        <Section tone="paper" labelledBy="oracle-rooms">
          <Heading as="h2" id="oracle-rooms">Rooms</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {rooms.map((room) => (
              <li key={room._key} className="rounded-panel border border-stone bg-ivory p-6">
                <SanityImage image={room.image} width={640} height={400} sizes="(min-width: 900px) 50vw, 100vw" />
                <h3 className="mt-4">{room.name}</h3>
                {room.house ? <p>{room.house}</p> : null}
                {room.summary ? <p className="mt-2">{room.summary}</p> : null}
                <ul className="mt-2 list-disc pl-6">
                  {(room.facts ?? []).filter(Boolean).map((fact) => <li key={fact}>{fact}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </Section>
      </Region>
      <Region name="spaces">
        <Section tone="sand" labelledBy="oracle-spaces">
          <Heading as="h2" id="oracle-spaces">Shared spaces</Heading>
          <ul className="mt-4 flex flex-wrap gap-2">
            {spaces.map((space) => <li key={space}><Chip>{space}</Chip></li>)}
          </ul>
        </Section>
      </Region>
      <Region name="daily-life">
        <Section tone="ivory" labelledBy="oracle-day">
          <Heading as="h2" id="oracle-day">Live your day, your way.</Heading>
          <div className="mt-4"><PortableText value={residence.atmosphere} /></div>
        </Section>
      </Region>
      <Region name="everyday">
        <Section tone="paper" labelledBy="oracle-everyday">
          <Heading as="h2" id="oracle-everyday">Everyday support</Heading>
          <div className="mt-4"><CapabilityList items={residence.everydayLife} /></div>
        </Section>
      </Region>
      <Region name="optional">
        <Section tone="mist" labelledBy="oracle-optional">
          <Heading as="h2" id="oracle-optional">Optional services</Heading>
          <div className="mt-4"><CapabilityList items={residence.careAndSupport} /></div>
          {optional.length > 0 ? <p className="mt-4 max-w-prose-site">These services are arranged separately.</p> : null}
        </Section>
      </Region>
      <Region name="independence">
        <Section tone="ivory" labelledBy="oracle-independence">
          <Heading as="h2" id="oracle-independence">Independence</Heading>
          <ul className="mt-4 list-disc pl-6">
            {(residence.audienceFit ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Section>
      </Region>
      <Region name="map">
        <Section tone="sand" labelledBy="oracle-map">
          <Heading as="h2" id="oracle-map">Location</Heading>
          <div className="mt-4"><StaticMap address={residence.address} mapsKey={mapsKey} label="Map of Oracle" /></div>
        </Section>
      </Region>
      <Region name="visit">
        <Section tone="paper" labelledBy="oracle-visit">
          <Heading as="h2" id="oracle-visit">Request a private visit</Heading>
          <div className="mt-8 max-w-prose-site">
            <EnquiryForm kind="oracle-visit" context="Oracle" />
          </div>
        </Section>
      </Region>
    </main>
  );
}
```

Do not hardcode the ten room names. Do not add the phrase "not an institution" or any regulatory claim in this file. The only night tone is the hero.

- [ ] **Step 4: Run the test**

```powershell
npx vitest run "src/app/(site)/oracle/view.test.tsx"
```

Expected: PASS. `PageHero` on `tone="night"` still exposes the H1 as "Oracle".

- [ ] **Step 5: Create `src/app/(site)/oracle/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { ORACLE_SLUG } from '@/lib/routes';
import { breadcrumbJsonLd, localBusinessJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { RESIDENCE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import type { ResidenceContent } from '../homes/[slug]/view';
import { OracleView } from './view';

const PATH = '/oracle';

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchPublished(RESIDENCE_QUERY, { slug: ORACLE_SLUG }, [docTag('residence', ORACLE_SLUG), 'residence']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: PATH,
    fallbackTitle: 'Oracle',
    fallbackDescription: doc?.summary || 'Oracle, a Village 60 Plus residence.',
    seo: doc?.seo,
  });
}

export default async function OraclePage() {
  const [doc, settings] = await Promise.all([
    fetchPublished(RESIDENCE_QUERY, { slug: ORACLE_SLUG }, [docTag('residence', ORACLE_SLUG), 'residence']),
    fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
  ]);
  const contact = contactFromSettings(settings);
  const siteUrl = getPublicEnv().siteUrl;
  const residence: ResidenceContent | null = doc?.name && doc.slug ? {
    name: doc.name,
    slug: doc.slug,
    status: doc.status,
    shortLocation: doc.shortLocation,
    summary: doc.summary,
    heroImage: doc.heroImage,
    description: doc.description,
    careTypes: doc.careTypes,
    audienceFit: doc.audienceFit,
    atmosphere: doc.atmosphere,
    sharedSpaces: doc.sharedSpaces,
    rooms: doc.rooms,
    careAndSupport: doc.careAndSupport,
    everydayLife: doc.everydayLife,
    gallery: doc.gallery,
    team: doc.team,
    address: doc.address,
    faqs: doc.faqs,
    formKind: doc.formKind,
    comingSoonNote: doc.comingSoonNote,
  } : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Oracle', href: PATH }]),
          residence
            ? localBusinessJsonLd({
                name: residence.name,
                status: residence.status,
                path: PATH,
                siteUrl,
                phone: contact.phone,
                description: residence.summary,
                address: residence.address,
              })
            : null,
        ]}
      />
      <OracleView residence={residence} contact={contact} mapsKey={getPublicEnv().mapsKey} />
    </>
  );
}
```

This page reads the `residence` document for slug `oracle`. It does not query `ecosystemOffering`. A missing document renders the empty hero and no LocalBusiness node.

- [ ] **Step 6: Typecheck and commit**

```powershell
npm run typecheck
npx vitest run "src/app/(site)/oracle/view.test.tsx"
git add "src/app/(site)/oracle"
git commit -m "feat(pages): add the Oracle residence page"
```

Expected: typecheck clean, test PASS.

---

### Task 28: Living and Care hub and detail

**Files:**
- Create: `src/app/(site)/living-and-care/view.tsx`, `src/app/(site)/living-and-care/view.test.tsx`, `src/app/(site)/living-and-care/page.tsx`, `src/app/(site)/living-and-care/[slug]/view.tsx`, `src/app/(site)/living-and-care/[slug]/view.test.tsx`, `src/app/(site)/living-and-care/[slug]/page.tsx`
- Modify: `src/lib/routes.ts`, `src/lib/routes.test.ts`

**Interfaces:**
- Consumes: `PageHero`, `SectionList`, `ContentSectionData`, `CareServiceCard`, `CareServiceCardData`, `CapabilityList`, `StepList`, `StepItem`, `FaqList`, `Breadcrumbs`, `ContactActions`, `EnquiryButton`, `EnquiryProvider`, `StatusBadge`, `asFormKind`, `residencePath`, `careServicePath`, `CARE_SERVICE_SLUGS`, `isContentStatus`, `isFuture`, `PAGE_QUERY` slug `living-and-care`, `CARE_SERVICES_QUERY`, `CARE_SERVICE_QUERY`, `serviceJsonLd`, `contactFromSettings`, `fetchPublished`, `pageMetadata`, `breadcrumbJsonLd`, `JsonLd`, `docTag`, `getPublicEnv`.
- Produces:
  - `careStaticParams(): { slug: string }[]` from `CARE_SERVICE_SLUGS`.
  - `LivingCareView({ title, intro, services, sections, contact })`. Cards render before `SectionList`. Night and green section tones are rewritten to `ivory` before `SectionList`.
  - `CareDetailView({ service, contact })`. Breadcrumbs are Home / Living & Care / name. `service` null renders one H1, "This service", and does not throw.

- [ ] **Step 1: Add the failing route test to `src/lib/routes.test.ts`**

```ts
import { careStaticParams } from './routes';

it('builds a static param for each care service', () => {
  expect(careStaticParams().map((item) => item.slug)).toEqual(['independent-living', 'residential-care', 'respite-care', 'recovery', 'rehabilitation']);
});
```

- [ ] **Step 2: Write the failing hub test `src/app/(site)/living-and-care/view.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { LivingCareView } from './view';

const body = [
  { _type: 'block' as const, _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text: 'Meals are discussed with the resident.', marks: [] }] },
];

describe('LivingCareView', () => {
  it('lists care cards before everyday sections and links the not-the-right-fit block', () => {
    render(
      <LivingCareView
        title="Living and care"
        intro="Plain explanations of the kinds of support."
        services={[
          { _id: 'care.rehabilitation', name: 'Rehabilitation', slug: 'rehabilitation', status: 'available', summary: 'A structured programme.', heroImage: null },
          { _id: 'care.independent-living', name: 'Independent Living', slug: 'independent-living', status: 'available', summary: 'Your own routine.', heroImage: null },
        ]}
        sections={[{ _key: 'meals', heading: 'Meals and dining', body, tone: 'night' }]}
        contact={contactFixture}
      />,
    );
    const independent = screen.getByRole('heading', { name: 'Independent Living' });
    const rehabilitation = screen.getByRole('heading', { name: 'Rehabilitation' });
    const meals = screen.getByRole('heading', { name: 'Meals and dining' });
    const unfit = screen.getByRole('heading', { name: 'When Village 60 Plus is not the right fit' });
    expect(independent.compareDocumentPosition(rehabilitation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(rehabilitation.compareDocumentPosition(meals) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(meals.compareDocumentPosition(unfit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Silver Roots' })).toHaveAttribute('href', '/silver-roots');
    expect(screen.getByRole('link', { name: 'Find the Right Care' })).toHaveAttribute('href', '/find-the-right-care');
    expect(document.body.textContent).not.toMatch(/guarantee|best|number one/i);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Write the failing detail test `src/app/(site)/living-and-care/[slug]/view.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { CareDetailView, type CareDetail } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

const answer = [
  { _type: 'block' as const, _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text: 'Visits are by appointment.', marks: [] }] },
];

const service: CareDetail = {
  name: 'Respite care',
  slug: 'respite-care',
  status: 'available',
  summary: 'A short stay while the usual carer rests.',
  whoItSuits: ['Families who need a planned break'],
  typicalDuration: 'A few days to a few weeks',
  included: [
    { _key: 'stay', title: 'A short stay', description: 'Room and meals for the agreed period.', provision: 'included', status: 'available' },
    { _key: 'therapy', title: 'External therapy', description: 'Booked with the person’s own practitioner.', provision: 'partner-arranged', status: 'available' },
  ],
  process: [{ _key: 'talk', title: 'A conversation', description: 'The team calls back to understand the dates.' }],
  notRightFit: 'If a short stay is not suitable, the team will say so.',
  faqs: [{ _id: 'faq.visit', question: 'Can we visit first?', answer }],
  formKind: 'general',
  residences: [
    { _id: 'residence.serenity', name: 'Serenity', slug: 'serenity', status: 'available', shortLocation: 'Colombo' },
    { _id: 'residence.the-grove', name: 'The Grove', slug: 'the-grove', status: 'coming-soon', shortLocation: 'Kottawa' },
  ],
};

describe('CareDetailView', () => {
  it('shows suitability, duration, provision, residences and one h1', () => {
    const { container } = render(
      <EnquiryProvider contact={contactFixture}>
        <CareDetailView service={service} contact={contactFixture} />
      </EnquiryProvider>,
    );
    expect([...container.querySelectorAll('[data-care-section]')].map((node) => node.getAttribute('data-care-section'))).toEqual([
      'hero', 'suits', 'duration', 'included', 'residences', 'process', 'fit', 'faqs', 'enquiry',
    ]);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText('Families who need a planned break')).toBeInTheDocument();
    expect(screen.getByText('A few days to a few weeks')).toBeInTheDocument();
    expect(screen.getByText('Arranged through a partner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Serenity' })).toHaveAttribute('href', '/homes/serenity');
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText('Can we visit first?')).toBeInTheDocument();
    expect(screen.getByText('Respite care', { selector: '[aria-current="page"]' })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/guarantee/i);
  });

  it('renders an empty state when the document is missing', () => {
    render(
      <EnquiryProvider contact={contactFixture}>
        <CareDetailView service={null} contact={contactFixture} />
      </EnquiryProvider>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'This service' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run to verify they fail**

```powershell
npx vitest run src/lib/routes.test.ts "src/app/(site)/living-and-care/view.test.tsx" "src/app/(site)/living-and-care/[slug]/view.test.tsx"
```

Expected: FAIL — `careStaticParams` is missing, and both view modules are missing.

- [ ] **Step 5: Append `careStaticParams` to `src/lib/routes.ts`**

```ts
export function careStaticParams(): Array<{ slug: string }> {
  return CARE_SERVICE_SLUGS.map((slug) => ({ slug }));
}
```

- [ ] **Step 6: Create `src/app/(site)/living-and-care/view.tsx`**

```tsx
import { PageHero } from '@/components/content/PageHero';
import { SectionList, type ContentSectionData } from '@/components/content/SectionList';
import { CareServiceCard, type CareServiceCardData } from '@/components/content/CareServiceCard';
import { ContactActions } from '@/components/site/ContactActions';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';
import { CARE_SERVICE_SLUGS } from '@/lib/routes';

function lightSections(sections: Array<ContentSectionData | null> | null | undefined) {
  return (sections ?? []).map((section) =>
    section && (section.tone === 'night' || section.tone === 'green') ? { ...section, tone: 'ivory' } : section,
  );
}

export function LivingCareView({
  title,
  intro,
  services,
  sections,
  contact,
}: {
  title: string;
  intro?: string | null;
  services: CareServiceCardData[];
  sections: Array<ContentSectionData | null> | null;
  contact: SiteContact;
}) {
  const rank = (slug: string | null | undefined) => {
    const index = CARE_SERVICE_SLUGS.findIndex((item) => item === slug);
    return index === -1 ? CARE_SERVICE_SLUGS.length : index;
  };
  const ordered = [...services].sort((a, b) => rank(a.slug) - rank(b.slug));
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory">
        <ContactActions contact={contact} context="Living & Care" />
      </PageHero>
      <Section tone="paper">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ordered.map((service) => (
            <li key={service._id}><CareServiceCard service={service} /></li>
          ))}
        </ul>
      </Section>
      <SectionList sections={lightSections(sections)} />
      <Section tone="sand" labelledBy="not-the-right-fit">
        <Heading as="h2" id="not-the-right-fit">When Village 60 Plus is not the right fit</Heading>
        <p className="mt-4 max-w-prose-site">The team will say so. These pages are other places to start a conversation.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/silver-roots" variant="secondary">Silver Roots</Button>
          <Button href="/find-the-right-care">Find the Right Care</Button>
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 7: Create `src/app/(site)/living-and-care/[slug]/view.tsx`**

```tsx
import type { ReactNode } from 'react';
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { CapabilityList, type CapabilityItem } from '@/components/content/CapabilityList';
import { FaqList, type FaqItem } from '@/components/content/FaqList';
import { PageHero } from '@/components/content/PageHero';
import { StepList, type StepItem } from '@/components/content/StepList';
import { ContactActions } from '@/components/site/ContactActions';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isFuture } from '@/lib/content-status';
import { asFormKind } from '@/lib/forms/kinds';
import { residencePath } from '@/lib/routes';

export type CareDetail = {
  name: string;
  slug: string;
  status?: string | null;
  summary?: string | null;
  whoItSuits?: Array<string | null> | null;
  typicalDuration?: string | null;
  included?: Array<CapabilityItem | null> | null;
  process?: Array<StepItem | null> | null;
  notRightFit?: string | null;
  faqs?: Array<FaqItem | null> | null;
  formKind?: string | null;
  residences?: Array<{ _id: string; name?: string | null; slug?: string | null; status?: string | null; shortLocation?: string | null } | null> | null;
};

function Region({ name, children }: { name: string; children: ReactNode }) {
  return <div data-care-section={name}>{children}</div>;
}

export function CareDetailView({ service, contact }: { service: CareDetail | null; contact: SiteContact }) {
  if (!service) {
    return (
      <main id="main">
        <PageHero title="This service" intro="Details will appear here once they are published." tone="ivory" />
      </main>
    );
  }

  const homes = (service.residences ?? []).filter((item): item is NonNullable<typeof item> & { name: string; slug: string } => Boolean(item?.name && item.slug));

  return (
    <main id="main">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Living & Care', href: '/living-and-care' }, { label: service.name }]} />
      <Region name="hero">
        <PageHero title={service.name} intro={service.summary} status={service.status} tone="ivory" />
      </Region>
      <Region name="suits">
        <Section tone="sand" labelledBy="who-it-suits">
          <Heading as="h2" id="who-it-suits">Who it suits</Heading>
          <ul className="mt-4 list-disc pl-6">
            {(service.whoItSuits ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Section>
      </Region>
      <Region name="duration">
        <Section tone="ivory" labelledBy="duration">
          <Heading as="h2" id="duration">Typical duration</Heading>
          {service.typicalDuration ? <p className="mt-4">{service.typicalDuration}</p> : <p className="mt-4">The team will talk through timing with you.</p>}
        </Section>
      </Region>
      <Region name="included">
        <Section tone="paper" labelledBy="included">
          <Heading as="h2" id="included">What is included</Heading>
          <div className="mt-4"><CapabilityList items={service.included} /></div>
        </Section>
      </Region>
      <Region name="residences">
        <Section tone="mist" labelledBy="residences">
          <Heading as="h2" id="residences">Residences that offer this</Heading>
          <ul className="mt-4 flex flex-col gap-3">
            {homes.map((home) => (
              <li key={home._id} className="flex flex-wrap items-center gap-3">
                <Button href={residencePath(home.slug)} variant="text">{home.name}</Button>
                {home.shortLocation ? <span>{home.shortLocation}</span> : null}
                {isContentStatus(home.status) && isFuture(home.status) ? <StatusBadge status={home.status} /> : null}
              </li>
            ))}
          </ul>
        </Section>
      </Region>
      <Region name="process">
        <Section tone="ivory" labelledBy="process">
          <Heading as="h2" id="process">Enquiry and assessment</Heading>
          <div className="mt-4"><StepList items={service.process} /></div>
        </Section>
      </Region>
      <Region name="fit">
        <Section tone="sand" labelledBy="fit">
          <Heading as="h2" id="fit">If this is not the right fit</Heading>
          {service.notRightFit ? <p className="mt-4 max-w-prose-site">{service.notRightFit}</p> : null}
        </Section>
      </Region>
      <Region name="faqs">
        <Section tone="paper">
          <FaqList items={service.faqs} />
        </Section>
      </Region>
      <Region name="enquiry">
        <Section tone="ivory">
          <EnquiryButton kind={asFormKind(service.formKind)} context={service.name}>Enquire</EnquiryButton>
          <div className="mt-4">
            <ContactActions contact={contact} context={service.name} />
          </div>
        </Section>
      </Region>
    </main>
  );
}
```

Do not write outcome claims in either view. Render only the CMS strings plus the headings above.

- [ ] **Step 8: Run the view tests**

```powershell
npx vitest run src/lib/routes.test.ts "src/app/(site)/living-and-care/view.test.tsx" "src/app/(site)/living-and-care/[slug]/view.test.tsx"
```

Expected: PASS. The hub test passes a `night` section and still must not render a dark hero; `lightSections` forces `ivory`, and `SectionList` will still show the heading "Meals and dining".

- [ ] **Step 9: Create the two page files**

```tsx
// src/app/(site)/living-and-care/page.tsx
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { CARE_SERVICES_QUERY, PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { toCareCards } from '../home-view';
import { LivingCareView } from './view';

const PATH = '/living-and-care';

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchPublished(PAGE_QUERY, { slug: 'living-and-care' }, [docTag('page', 'living-and-care'), 'page']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: PATH,
    fallbackTitle: 'Living and care',
    fallbackDescription: 'Independent living, residential care, respite, recovery and rehabilitation.',
    seo: doc?.seo,
  });
}

export default async function LivingCarePage() {
  const [doc, services, settings] = await Promise.all([
    fetchPublished(PAGE_QUERY, { slug: 'living-and-care' }, [docTag('page', 'living-and-care'), 'page']),
    fetchPublished(CARE_SERVICES_QUERY, {}, ['careService']),
    fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
  ]);
  const siteUrl = getPublicEnv().siteUrl;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Living & Care', href: PATH }])} />
      <LivingCareView
        title={doc?.title || 'Living and care'}
        intro={doc?.intro}
        services={toCareCards(services)}
        sections={doc?.sections ?? []}
        contact={contactFromSettings(settings)}
      />
    </>
  );
}
```

```tsx
// src/app/(site)/living-and-care/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { CARE_SERVICE_SLUGS, careServicePath, careStaticParams } from '@/lib/routes';
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { CARE_SERVICE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { CareDetailView, type CareDetail } from './view';

export function generateStaticParams() {
  return careStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await fetchPublished(CARE_SERVICE_QUERY, { slug }, [docTag('careService', slug), 'careService']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: careServicePath(slug),
    fallbackTitle: doc?.name || 'Living and care',
    fallbackDescription: doc?.summary || 'A Village 60 Plus care service.',
    seo: doc?.seo,
  });
}

export default async function CareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(CARE_SERVICE_SLUGS as readonly string[]).includes(slug)) notFound();
  const [doc, settings] = await Promise.all([
    fetchPublished(CARE_SERVICE_QUERY, { slug }, [docTag('careService', slug), 'careService']),
    fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
  ]);
  const contact = contactFromSettings(settings);
  const siteUrl = getPublicEnv().siteUrl;
  const service: CareDetail | null = doc?.name && doc.slug ? {
    name: doc.name,
    slug: doc.slug,
    status: doc.status,
    summary: doc.summary,
    whoItSuits: doc.whoItSuits,
    typicalDuration: doc.typicalDuration,
    included: doc.included,
    process: doc.process,
    notRightFit: doc.notRightFit,
    faqs: doc.faqs,
    formKind: doc.formKind,
    residences: doc.residences,
  } : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(siteUrl, [
            { label: 'Home', href: '/' },
            { label: 'Living & Care', href: '/living-and-care' },
            { label: service?.name || 'Service', href: careServicePath(slug) },
          ]),
          service
            ? serviceJsonLd({
                name: service.name,
                status: service.status,
                path: careServicePath(slug),
                siteUrl,
                brandName: settings?.brandName || 'Village 60 Plus',
                description: service.summary,
              })
            : null,
        ]}
      />
      <CareDetailView service={service} contact={contact} />
    </>
  );
}
```

`serviceJsonLd` returns null unless the status is operating. Do not call it for a missing document.

- [ ] **Step 10: Typecheck and commit**

```powershell
npm run typecheck
npx vitest run src/lib/routes.test.ts "src/app/(site)/living-and-care/view.test.tsx" "src/app/(site)/living-and-care/[slug]/view.test.tsx"
git add src/lib/routes.ts src/lib/routes.test.ts "src/app/(site)/living-and-care"
git commit -m "feat(pages): add Living and Care hub and detail pages"
```

Expected: typecheck clean, tests PASS.

---

### Task 29: Ecosystem pages

**Files:**
- Create: `src/app/(site)/ecosystem-view.tsx`, `src/app/(site)/ecosystem-view.test.tsx`, `src/app/(site)/offering-route.tsx`, `src/app/(site)/silver-roots/page.tsx`, `src/app/(site)/destination-retirement/page.tsx`, `src/app/(site)/sage/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `Section`, `Heading`, `CapabilityList`, `CapabilityItem`, `StepList`, `StepItem`, `SectionList`, `ContentSectionData`, `FaqList`, `FaqItem`, `EnquiryForm`, `EnquiryButton`, `EnquiryProvider`, `isContentStatus`, `isOperating`, `OFFERING_QUERY`, `SITE_SETTINGS_QUERY`, `fetchPublished`, `pageMetadata`, `breadcrumbJsonLd`, `JsonLd`, `offeringPath`, `OfferingSlug`, `docTag`, `getPublicEnv`, `contactFromSettings`, `CmsImage`.
- Produces: `EcosystemView({ slug, offering, contact })` and `toOffering(doc)`. `OfferingRoute` and `offeringMetadata(slug)` used by the three page files. SAGE hero is `night`. Silver Roots and Destination Retirement heroes are `ivory`, even if the CMS `heroTone` says otherwise. Planned rows with no status are given status `planned` before `CapabilityList`.

- [ ] **Step 1: Write the failing test `src/app/(site)/ecosystem-view.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { contactFixture } from '@/test/contact-fixture';
import { EcosystemView, type OfferingContent } from './ecosystem-view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

const silver: OfferingContent = {
  name: 'Silver Roots',
  slug: 'silver-roots',
  status: 'in-development',
  distinction: 'Village 60 Plus runs homes. Silver Roots helps people find support wherever they live.',
  summary: 'The team helps by phone today.',
  currentCapabilities: [{ _key: 'phone', title: 'Help by phone', description: 'A conversation with the team.', provision: 'included', status: 'available' }],
  plannedCapabilities: [{ _key: 'home', title: 'Support at home', description: 'Visits at home.', provision: 'partner-arranged', status: 'planned' }],
  howItWorks: [
    { _key: 's1', title: 'Tell us what is needed', description: 'A short conversation.' },
    { _key: 's2', title: 'You choose', description: 'Nothing is arranged without agreement.' },
  ],
  benefitGroups: [{ _key: 'families', audience: 'Families', points: ['One place to ask'] }],
  sections: [],
  faqs: [],
};

function renderOffering(slug: OfferingContent['slug'], offering: OfferingContent | null) {
  return render(
    <EnquiryProvider contact={contactFixture}>
      <EcosystemView slug={slug} offering={offering} contact={contactFixture} />
    </EnquiryProvider>,
  );
}

describe('EcosystemView', () => {
  it('keeps planned Silver Roots capabilities labelled and offers both enquiries', () => {
    renderOffering('silver-roots', silver);
    expect(screen.getByText('In development')).toBeInTheDocument();
    expect(screen.getByText('In development').className).not.toContain('text-pale-gold');
    expect(screen.getByText('Planned')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How it works' })).toBeInTheDocument();
    expect(screen.getByText('Tell us what is needed')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Partner with Silver Roots' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send a general enquiry' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('uses the destination form and no partner form', () => {
    renderOffering('destination-retirement', {
      ...silver,
      name: 'Destination Retirement',
      slug: 'destination-retirement',
      status: 'planned',
      howItWorks: [],
    });
    expect(screen.getByRole('heading', { name: 'Plan a stay' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Partner with Silver Roots' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'How it works' })).not.toBeInTheDocument();
  });

  it('gives SAGE a dark hero and no product interface', () => {
    renderOffering('sage', {
      name: 'SAGE',
      slug: 'sage',
      status: 'pilot',
      distinction: 'SAGE supports the care team. It is not a product families buy.',
      summary: 'Tools for the team, labelled by status.',
      currentCapabilities: [{ _key: 'notes', title: 'Team communication', description: 'Shift notes.', provision: 'included', status: 'pilot' }],
      plannedCapabilities: [{ _key: 'family', title: 'Family updates', description: 'Permission-based updates.', provision: 'included', status: 'in-development' }],
      howItWorks: [],
      benefitGroups: [{ _key: 'teams', audience: 'Care teams', points: ['Less paperwork'] }],
      sections: [],
      faqs: [],
    });
    expect(screen.getAllByText('Pilot')[0].className).toContain('text-pale-gold');
    expect(screen.getByText('In development')).toBeInTheDocument();
    expect(screen.queryByText('Available now')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Plan a stay' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enquire' })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/voice interface/i);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run "src/app/(site)/ecosystem-view.test.tsx"
```

Expected: FAIL — cannot find `./ecosystem-view`.

- [ ] **Step 3: Create `src/app/(site)/ecosystem-view.tsx`**

```tsx
import { EnquiryButton } from '@/components/forms/EnquiryPanel';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { CapabilityList, type CapabilityItem } from '@/components/content/CapabilityList';
import { FaqList, type FaqItem } from '@/components/content/FaqList';
import { PageHero } from '@/components/content/PageHero';
import { SectionList, type ContentSectionData } from '@/components/content/SectionList';
import { StepList, type StepItem } from '@/components/content/StepList';
import type { CmsImage } from '@/components/media/SanityImage';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import type { SiteContact } from '@/lib/contact';
import { isContentStatus, isOperating } from '@/lib/content-status';
import type { OfferingSlug } from '@/lib/routes';

const TITLES: Record<OfferingSlug, string> = {
  'silver-roots': 'Silver Roots',
  'destination-retirement': 'Destination Retirement',
  sage: 'SAGE',
};

export type OfferingContent = {
  name: string;
  slug: OfferingSlug;
  status?: string | null;
  tagline?: string | null;
  distinction?: string | null;
  summary?: string | null;
  heroImage?: CmsImage | null;
  currentCapabilities?: Array<CapabilityItem | null> | null;
  plannedCapabilities?: Array<CapabilityItem | null> | null;
  howItWorks?: Array<StepItem | null> | null;
  benefitGroups?: Array<{ _key: string; audience?: string | null; points?: Array<string | null> | null } | null> | null;
  sections?: Array<ContentSectionData | null> | null;
  faqs?: Array<FaqItem | null> | null;
};

export function toOffering(doc: {
  name?: string | null;
  slug?: string | null;
  status?: string | null;
  tagline?: string | null;
  distinction?: string | null;
  summary?: string | null;
  heroImage?: CmsImage | null;
  currentCapabilities?: OfferingContent['currentCapabilities'];
  plannedCapabilities?: OfferingContent['plannedCapabilities'];
  howItWorks?: OfferingContent['howItWorks'];
  benefitGroups?: OfferingContent['benefitGroups'];
  sections?: OfferingContent['sections'];
  faqs?: OfferingContent['faqs'];
} | null): OfferingContent | null {
  if (!doc?.name || (doc.slug !== 'silver-roots' && doc.slug !== 'destination-retirement' && doc.slug !== 'sage')) return null;
  return { ...doc, name: doc.name, slug: doc.slug };
}

function labelPlanned(items: OfferingContent['plannedCapabilities']) {
  return (items ?? []).map((item) => (item && !isContentStatus(item.status) ? { ...item, status: 'planned' } : item));
}

export function EcosystemView({
  slug,
  offering,
}: {
  slug: OfferingSlug;
  offering: OfferingContent | null;
  contact: SiteContact;
}) {
  const tone = slug === 'sage' ? 'night' : 'ivory';
  const title = offering?.name || TITLES[slug];
  const showStatus = offering?.status && isContentStatus(offering.status) && !isOperating(offering.status) ? offering.status : null;
  const steps = (offering?.howItWorks ?? []).filter((step) => step?.title);
  const groups = (offering?.benefitGroups ?? []).filter((group): group is NonNullable<typeof group> & { audience: string } => Boolean(group?.audience));
  const sections = (offering?.sections ?? []).map((section) =>
    section && (section.tone === 'night' || section.tone === 'green') ? { ...section, tone: 'ivory' } : section,
  );

  return (
    <main id="main">
      <PageHero title={title} eyebrow={offering?.tagline} intro={offering?.distinction || offering?.summary} image={offering?.heroImage} status={showStatus} tone={tone} />
      {offering?.summary ? (
        <Section tone="paper">
          <p className="max-w-prose-site">{offering.summary}</p>
        </Section>
      ) : null}
      <Section tone="ivory" labelledBy="offering-current">
        <Heading as="h2" id="offering-current">What exists today</Heading>
        <div className="mt-4"><CapabilityList items={offering?.currentCapabilities} /></div>
      </Section>
      <Section tone="sand" labelledBy="offering-planned">
        <Heading as="h2" id="offering-planned">Planned</Heading>
        <div className="mt-4"><CapabilityList items={labelPlanned(offering?.plannedCapabilities)} /></div>
      </Section>
      {steps.length > 0 ? (
        <Section tone="paper" labelledBy="offering-steps">
          <Heading as="h2" id="offering-steps">How it works</Heading>
          <div className="mt-4"><StepList items={offering?.howItWorks} /></div>
        </Section>
      ) : null}
      {groups.map((group) => (
        <Section key={group._key} tone="mist">
          <Heading as="h2">{group.audience}</Heading>
          <ul className="mt-4 list-disc pl-6">
            {(group.points ?? []).filter(Boolean).map((point) => <li key={point}>{point}</li>)}
          </ul>
        </Section>
      ))}
      <SectionList sections={sections} />
      <Section tone="paper">
        <FaqList items={offering?.faqs} />
      </Section>
      <Section tone="sand">
        {slug === 'silver-roots' ? (
          <div className="flex max-w-prose-site flex-col gap-10">
            <EnquiryForm kind="silver-roots-partner" context="Silver Roots" />
            <EnquiryButton kind="general" context="Silver Roots">Send a general enquiry</EnquiryButton>
          </div>
        ) : null}
        {slug === 'destination-retirement' ? (
          <div className="max-w-prose-site">
            <EnquiryForm kind="destination-retirement" context="Destination Retirement" />
          </div>
        ) : null}
        {slug === 'sage' ? <EnquiryButton kind="general" context="SAGE">Enquire</EnquiryButton> : null}
      </Section>
    </main>
  );
}
```

- [ ] **Step 4: Run the test**

```powershell
npx vitest run "src/app/(site)/ecosystem-view.test.tsx"
```

Expected: PASS. `FaqList` renders nothing when `faqs` is empty, so it does not add a second H1.

- [ ] **Step 5: Create `src/app/(site)/offering-route.tsx` and the three pages**

```tsx
// src/app/(site)/offering-route.tsx
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { offeringPath, type OfferingSlug } from '@/lib/routes';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { OFFERING_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { EcosystemView, toOffering } from './ecosystem-view';

const COPY: Record<OfferingSlug, { title: string; description: string }> = {
  'silver-roots': {
    title: 'Silver Roots',
    description: 'Support beyond the residences. Capabilities are labelled by what exists today.',
  },
  'destination-retirement': {
    title: 'Destination Retirement',
    description: 'A stay concept for Sri Lanka. Nothing on this page is a confirmed package.',
  },
  sage: {
    title: 'SAGE',
    description: 'Technology that supports the Village 60 Plus team. Capabilities are labelled by status.',
  },
};

export async function offeringMetadata(slug: OfferingSlug): Promise<Metadata> {
  const doc = await fetchPublished(OFFERING_QUERY, { slug }, [docTag('ecosystemOffering', slug), 'ecosystemOffering']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: offeringPath(slug),
    fallbackTitle: COPY[slug].title,
    fallbackDescription: doc?.summary || COPY[slug].description,
    seo: doc?.seo,
  });
}

export async function OfferingRoute({ slug }: { slug: OfferingSlug }) {
  const [doc, settings] = await Promise.all([
    fetchPublished(OFFERING_QUERY, { slug }, [docTag('ecosystemOffering', slug), 'ecosystemOffering']),
    fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
  ]);
  const siteUrl = getPublicEnv().siteUrl;
  const offering = toOffering(doc);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(siteUrl, [
          { label: 'Home', href: '/' },
          { label: offering?.name || COPY[slug].title, href: offeringPath(slug) },
        ])}
      />
      <EcosystemView slug={slug} offering={offering} contact={contactFromSettings(settings)} />
    </>
  );
}
```

```tsx
// src/app/(site)/silver-roots/page.tsx
import { OfferingRoute, offeringMetadata } from '../offering-route';

export function generateMetadata() {
  return offeringMetadata('silver-roots');
}

export default function SilverRootsPage() {
  return <OfferingRoute slug="silver-roots" />;
}
```

```tsx
// src/app/(site)/destination-retirement/page.tsx
import { OfferingRoute, offeringMetadata } from '../offering-route';

export function generateMetadata() {
  return offeringMetadata('destination-retirement');
}

export default function DestinationRetirementPage() {
  return <OfferingRoute slug="destination-retirement" />;
}
```

```tsx
// src/app/(site)/sage/page.tsx
import { OfferingRoute, offeringMetadata } from '../offering-route';

export function generateMetadata() {
  return offeringMetadata('sage');
}

export default function SagePage() {
  return <OfferingRoute slug="sage" />;
}
```

- [ ] **Step 6: Typecheck and commit**

```powershell
npm run typecheck
npx vitest run "src/app/(site)/ecosystem-view.test.tsx"
git add "src/app/(site)/ecosystem-view.tsx" "src/app/(site)/ecosystem-view.test.tsx" "src/app/(site)/offering-route.tsx" "src/app/(site)/silver-roots" "src/app/(site)/destination-retirement" "src/app/(site)/sage"
git commit -m "feat(pages): add Silver Roots, Destination Retirement and SAGE"
```

Expected: typecheck clean, test PASS.

---

### Task 30: Our Story, Contact, legal pages, not-found and error

**Files:**
- Create: `src/app/(site)/our-story/view.tsx`, `src/app/(site)/our-story/view.test.tsx`, `src/app/(site)/our-story/page.tsx`, `src/app/(site)/contact/view.tsx`, `src/app/(site)/contact/view.test.tsx`, `src/app/(site)/contact/page.tsx`, `src/app/(site)/[legalSlug]/view.tsx`, `src/app/(site)/[legalSlug]/view.test.tsx`, `src/app/(site)/[legalSlug]/page.tsx`, `src/app/(site)/not-found.tsx`, `src/app/(site)/not-found.test.tsx`, `src/app/(site)/error.tsx`, `src/app/(site)/error.test.tsx`
- Modify: `src/lib/routes.ts`, `src/lib/routes.test.ts`

**Interfaces:**
- Consumes: `PageHero`, `PortableText`, `SectionList`, `ContentSectionData`, `SanityImage`, `StaticMap`, `EnquiryForm`, `Breadcrumbs` (not required on these pages), `formatAddress`, `mailtoHref`, `telHref`, `whatsappHref`, `PAGE_QUERY`, `TEAM_QUERY`, `RESIDENCE_QUERY`, `RESIDENCE_SLUGS`, `LEGAL_SLUGS`, `SITE_SETTINGS_QUERY`, `fetchPublished`, `pageMetadata`, `breadcrumbJsonLd`, `JsonLd`, `docTag`, `getPublicEnv`, `contactFromSettings`, `MapAddress`, `CmsImage`.
- Produces:
  - `isLegalSlug(value: string): value is LegalSlug`
  - `OurStoryView({ title, intro, body, sections, foundedYear, team })`. At most one section keeps `tone="green"`. `night` becomes `ivory`. `foundedYear` null omits the established line. Team photos go through `SanityImage`.
  - `ContactView({ title, intro, contact, openingHours, emergencyNotice, headOffice, residences, mapsKey })`. Emergency copy renders only when `emergencyNotice` is a non-empty string.
  - `LegalView({ title, body, lastReviewed })`.
  - `(site)/not-found.tsx` and `(site)/error.tsx`. The error view links to `/contact` and includes the sentence "Please call or WhatsApp us". It does not render `error.message`.

- [ ] **Step 1: Add the failing route test to `src/lib/routes.test.ts`**

```ts
import { isLegalSlug } from './routes';

it('allow-lists the three legal pages', () => {
  expect(isLegalSlug('privacy')).toBe(true);
  expect(isLegalSlug('terms')).toBe(true);
  expect(isLegalSlug('accessibility')).toBe(true);
  expect(isLegalSlug('homes')).toBe(false);
});
```

- [ ] **Step 2: Write the failing view tests**

```tsx
// src/app/(site)/our-story/view.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { imageFixture } from '@/test/fixtures';
import { OurStoryView } from './view';

const block = (text: string) => [
  { _type: 'block' as const, _key: text, style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text, marks: [] }] },
];

describe('OurStoryView', () => {
  it('shows one green band, omits an unconfirmed founding year, and skips a blank portrait', () => {
    const { container } = render(
      <OurStoryView
        title="Our story"
        intro="We started with a home."
        body={block('People should grow older with dignity.')}
        foundedYear={null}
        sections={[
          { _key: 'a', heading: 'A home first', body: block('A single residence.'), tone: 'ivory' },
          { _key: 'b', heading: 'The next chapter', body: block('Each new service is labelled.'), tone: 'green' },
          { _key: 'c', heading: 'Another quote', body: block('This second dark band must not stay dark.'), tone: 'green' },
          { _key: 'd', heading: 'Night', body: block('No night band on this page.'), tone: 'night' },
        ]}
        team={[
          { _id: 'team.amara', name: 'Amara Perera', role: 'Care lead', credentials: ['Registered nurse'], image: imageFixture('Amara Perera') },
          { _id: 'team.blank', name: 'No Photo', role: 'Coordinator', credentials: [], image: { ...imageFixture('hidden'), alt: ' ' } },
        ]}
      />,
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText('People should grow older with dignity.')).toBeInTheDocument();
    expect(screen.queryByText(/Established/)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.bg-green')).toHaveLength(1);
    expect(container.querySelector('.bg-night')).toBeNull();
    expect(screen.getByRole('img', { name: 'Amara Perera' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'hidden' })).not.toBeInTheDocument();
    expect(screen.getByText('Registered nurse')).toBeInTheDocument();
  });

  it('prints the founding year only when settings provide one', () => {
    render(<OurStoryView title="Our story" intro={null} body={null} foundedYear={2008} sections={[]} team={[]} />);
    expect(screen.getByText('Established 2008')).toBeInTheDocument();
  });
});
```

```tsx
// src/app/(site)/contact/view.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { contactFixture } from '@/test/contact-fixture';
import { ContactView } from './view';

vi.mock('@/lib/forms/submit', () => ({
  submitEnquiry: vi.fn(),
  initialEnquiryState: { status: 'idle', fieldErrors: {}, formErrors: [], values: {}, whatsappHref: null, responseTime: null },
}));

const office = { line1: '133/19 Nawala Road', line2: 'Narahenpita', city: 'Colombo 05', country: 'Sri Lanka' };

describe('ContactView', () => {
  it('shows the office, a residence directions link and the general form', () => {
    render(
      <ContactView
        title="Contact us"
        intro="A person will reply."
        contact={contactFixture}
        openingHours="Monday to Saturday, 9am–6pm"
        emergencyNotice={null}
        headOffice={office}
        mapsKey={null}
        residences={[{ name: 'Serenity', address: { line1: '12 Example Lane', city: 'Colombo', country: 'Sri Lanka' } }]}
      />,
    );
    expect(screen.getByRole('link', { name: contactFixture.phoneDisplay })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Contact'));
    expect(screen.getByRole('link', { name: contactFixture.email })).toHaveAttribute('href', 'mailto:hello@example.com');
    expect(screen.getByText(/133\/19 Nawala Road/)).toBeInTheDocument();
    expect(screen.getByText('Monday to Saturday, 9am–6pm')).toBeInTheDocument();
    expect(screen.getByText(contactFixture.responseTime)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Directions to Serenity' })).toHaveAttribute('href', expect.stringContaining('https://www.google.com/maps/search/'));
    expect(screen.getByRole('heading', { name: 'Talk to the team' })).toBeInTheDocument();
    expect(screen.queryByText(/ambulance/)).not.toBeInTheDocument();
  });

  it('shows the emergency notice only when the CMS field is set', () => {
    render(
      <ContactView
        title="Contact us"
        intro={null}
        contact={contactFixture}
        openingHours={null}
        emergencyNotice="This website is not an emergency service. Call 1990 for an ambulance."
        headOffice={office}
        mapsKey={null}
        residences={[]}
      />,
    );
    expect(screen.getByText(/Call 1990 for an ambulance/)).toBeInTheDocument();
  });
});
```

```tsx
// src/app/(site)/[legalSlug]/view.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LegalView } from './view';

const body = [
  { _type: 'block' as const, _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span' as const, _key: 's', text: 'Draft notice for counsel review.', marks: [] }] },
];

describe('LegalView', () => {
  it('renders one h1, the body and the review date', () => {
    render(<LegalView title="Privacy notice" body={body} lastReviewed="2026-10-12" />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('id', 'page-title');
    expect(screen.getByText('Draft notice for counsel review.')).toBeInTheDocument();
    expect(screen.getByText('Last reviewed 2026-10-12')).toBeInTheDocument();
  });
});
```

```tsx
// src/app/(site)/not-found.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from './not-found';

describe('NotFound', () => {
  it('offers home and contact without a stack trace', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the home page' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
  });
});
```

```tsx
// src/app/(site)/error.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SiteError from './error';

describe('SiteError', () => {
  it('points to contact and hides the exception text', () => {
    render(<SiteError error={new Error('secret stack')} reset={() => undefined} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText('Please call or WhatsApp us.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    expect(screen.queryByText(/secret stack/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run to verify they fail**

```powershell
npx vitest run src/lib/routes.test.ts "src/app/(site)/our-story/view.test.tsx" "src/app/(site)/contact/view.test.tsx" "src/app/(site)/[legalSlug]/view.test.tsx" "src/app/(site)/not-found.test.tsx" "src/app/(site)/error.test.tsx"
```

Expected: FAIL — `isLegalSlug` is missing and the view modules are missing.

- [ ] **Step 4: Append `isLegalSlug` to `src/lib/routes.ts`**

```ts
export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}
```

- [ ] **Step 5: Create the Our Story view and page**

```tsx
// src/app/(site)/our-story/view.tsx
import type { PortableTextBlock } from '@portabletext/react';
import { PageHero } from '@/components/content/PageHero';
import { PortableText } from '@/components/content/PortableText';
import { SectionList, type ContentSectionData } from '@/components/content/SectionList';
import { SanityImage, type CmsImage } from '@/components/media/SanityImage';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';

export type StoryPerson = {
  _id: string;
  name?: string | null;
  role?: string | null;
  credentials?: Array<string | null> | null;
  image?: CmsImage | null;
};

function storySections(sections: Array<ContentSectionData | null> | null | undefined) {
  let greenUsed = false;
  return (sections ?? []).map((section) => {
    if (!section) return section;
    if (section.tone === 'night') return { ...section, tone: 'ivory' };
    if (section.tone !== 'green') return section;
    if (greenUsed) return { ...section, tone: 'ivory' };
    greenUsed = true;
    return section;
  });
}

export function OurStoryView({
  title,
  intro,
  body,
  sections,
  foundedYear,
  team,
}: {
  title: string;
  intro?: string | null;
  body?: PortableTextBlock[] | null;
  sections?: Array<ContentSectionData | null> | null;
  foundedYear?: number | null;
  team: StoryPerson[];
}) {
  const people = team.filter((person): person is StoryPerson & { name: string } => Boolean(person.name));
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory" />
      {foundedYear != null ? (
        <Section tone="paper">
          <p>Established {foundedYear}</p>
        </Section>
      ) : null}
      <Section tone="ivory">
        <PortableText value={body} />
      </Section>
      <SectionList sections={storySections(sections)} />
      {people.length > 0 ? (
        <Section tone="sand" labelledBy="leadership">
          <Heading as="h2" id="leadership">Leadership</Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <li key={person._id}>
                <SanityImage image={person.image} width={480} height={480} sizes="240px" />
                <h3 className="mt-3">{person.name}</h3>
                {person.role ? <p>{person.role}</p> : null}
                <ul>
                  {(person.credentials ?? []).filter(Boolean).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </main>
  );
}
```

```tsx
// src/app/(site)/our-story/page.tsx
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY, SITE_SETTINGS_QUERY, TEAM_QUERY } from '@/sanity/queries';
import { OurStoryView } from './view';

const PATH = '/our-story';

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchPublished(PAGE_QUERY, { slug: 'our-story' }, [docTag('page', 'our-story'), 'page']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: PATH,
    fallbackTitle: 'Our story',
    fallbackDescription: doc?.intro || 'The story of Village 60 Plus.',
    seo: doc?.seo,
  });
}

export default async function OurStoryPage() {
  const [doc, settings, team] = await Promise.all([
    fetchPublished(PAGE_QUERY, { slug: 'our-story' }, [docTag('page', 'our-story'), 'page']),
    fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']),
    fetchPublished(TEAM_QUERY, {}, ['teamMember']),
  ]);
  const siteUrl = getPublicEnv().siteUrl;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Our story', href: PATH }])} />
      <OurStoryView
        title={doc?.title || 'Our story'}
        intro={doc?.intro}
        body={doc?.body}
        sections={doc?.sections ?? []}
        foundedYear={settings?.foundedYear ?? null}
        team={(team ?? []).flatMap((person) => (person?._id ? [{ _id: person._id, name: person.name, role: person.role, credentials: person.credentials, image: person.image }] : []))}
      />
    </>
  );
}
```

- [ ] **Step 6: Create the Contact view and page**

```tsx
// src/app/(site)/contact/view.tsx
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PageHero } from '@/components/content/PageHero';
import { StaticMap } from '@/components/media/StaticMap';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { mailtoHref, telHref, whatsappHref, type SiteContact } from '@/lib/contact';
import { directionsHref, type MapAddress } from '@/lib/maps';
import { formatAddress } from '@/lib/site-settings';

export function ContactView({
  title,
  intro,
  contact,
  openingHours,
  emergencyNotice,
  headOffice,
  residences,
  mapsKey,
}: {
  title: string;
  intro?: string | null;
  contact: SiteContact;
  openingHours?: string | null;
  emergencyNotice?: string | null;
  headOffice?: MapAddress | null;
  residences: Array<{ name: string; address: MapAddress | null }>;
  mapsKey: string | null;
}) {
  const office = formatAddress(headOffice);
  return (
    <main id="main">
      <PageHero title={title} intro={intro} tone="ivory" />
      <Section tone="paper">
        <ul className="flex flex-col gap-3">
          {contact.phone ? <li><a href={telHref(contact.phone)}>{contact.phoneDisplay}</a></li> : null}
          {contact.whatsapp ? <li><a href={whatsappHref(contact.whatsapp, 'Contact')}>WhatsApp</a></li> : null}
          {contact.email ? <li><a href={mailtoHref(contact.email)}>{contact.email}</a></li> : null}
        </ul>
        {openingHours ? <p className="mt-4">{openingHours}</p> : null}
        <p className="mt-2">{contact.responseTime}</p>
        {office ? <p className="mt-4 whitespace-pre-line">{office}</p> : null}
        {emergencyNotice?.trim() ? <p role="note" className="mt-6 max-w-prose-site font-semibold">{emergencyNotice}</p> : null}
      </Section>
      <Section tone="ivory" labelledBy="residence-addresses">
        <Heading as="h2" id="residence-addresses">Residences</Heading>
        <ul className="mt-8 flex flex-col gap-10">
          {residences.map((residence) => {
            const directions = directionsHref(residence.address);
            return (
              <li key={residence.name}>
                <h3>{residence.name}</h3>
                <StaticMap address={residence.address} mapsKey={mapsKey} label={`Map of ${residence.name}`} />
                {directions ? <Button href={directions} variant="text" target="_blank" rel="noopener noreferrer">Directions to {residence.name}</Button> : null}
              </li>
            );
          })}
        </ul>
      </Section>
      <Section tone="sand">
        <div className="max-w-prose-site">
          <EnquiryForm kind="general" context="Contact" />
        </div>
      </Section>
    </main>
  );
}
```

`StaticMap` already prints "Get directions" when it can. The extra button is the named control the test looks for. Both may point at the same URL.

```tsx
// src/app/(site)/contact/page.tsx
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { RESIDENCE_SLUGS } from '@/lib/routes';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { contactFromSettings } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY, RESIDENCE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { ContactView } from './view';

const PATH = '/contact';

export async function generateMetadata(): Promise<Metadata> {
  const doc = await fetchPublished(PAGE_QUERY, { slug: 'contact' }, [docTag('page', 'contact'), 'page']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: PATH,
    fallbackTitle: 'Contact us',
    fallbackDescription: doc?.intro || 'Call, WhatsApp or send a note to Village 60 Plus.',
    seo: doc?.seo,
  });
}

export default async function ContactPage() {
  const doc = await fetchPublished(PAGE_QUERY, { slug: 'contact' }, [docTag('page', 'contact'), 'page']);
  const settings = await fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']);
  const residences = await Promise.all(
    RESIDENCE_SLUGS.map((slug) => fetchPublished(RESIDENCE_QUERY, { slug }, [docTag('residence', slug), 'residence'])),
  );
  const siteUrl = getPublicEnv().siteUrl;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: 'Contact', href: PATH }])} />
      <ContactView
        title={doc?.title || 'Contact us'}
        intro={doc?.intro}
        contact={contactFromSettings(settings)}
        openingHours={settings?.openingHours}
        emergencyNotice={settings?.emergencyNotice}
        headOffice={settings?.headOffice}
        mapsKey={getPublicEnv().mapsKey}
        residences={residences.flatMap((residence) => (residence?.name ? [{ name: residence.name, address: residence.address ?? null }] : []))}
      />
    </>
  );
}
```

`RESIDENCES_QUERY` does not include `address`. This page calls `RESIDENCE_QUERY` once per `RESIDENCE_SLUGS` entry. Do not add a new GROQ query.

- [ ] **Step 7: Create the legal view, the legal route, not-found and error**

```tsx
// src/app/(site)/[legalSlug]/view.tsx
import type { PortableTextBlock } from '@portabletext/react';
import { PageHero } from '@/components/content/PageHero';
import { PortableText } from '@/components/content/PortableText';
import { Section } from '@/components/ui/Section';

export function LegalView({
  title,
  body,
  lastReviewed,
}: {
  title: string;
  body?: PortableTextBlock[] | null;
  lastReviewed?: string | null;
}) {
  return (
    <main id="main">
      <PageHero title={title} tone="ivory" />
      <Section tone="paper">
        <PortableText value={body} />
        {lastReviewed ? <p className="mt-8">Last reviewed {lastReviewed}</p> : null}
      </Section>
    </main>
  );
}
```

```tsx
// src/app/(site)/[legalSlug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicEnv } from '@/lib/env';
import { docTag } from '@/lib/revalidation';
import { isLegalSlug, LEGAL_SLUGS } from '@/lib/routes';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { fetchPublished } from '@/sanity/fetch';
import { PAGE_QUERY } from '@/sanity/queries';
import { LegalView } from './view';

export function generateStaticParams() {
  return LEGAL_SLUGS.map((legalSlug) => ({ legalSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ legalSlug: string }> }): Promise<Metadata> {
  const { legalSlug } = await params;
  if (!isLegalSlug(legalSlug)) return {};
  const doc = await fetchPublished(PAGE_QUERY, { slug: legalSlug }, [docTag('page', legalSlug), 'page']);
  return pageMetadata({
    siteUrl: getPublicEnv().siteUrl,
    path: `/${legalSlug}`,
    fallbackTitle: doc?.title || 'Village 60 Plus',
    fallbackDescription: doc?.title || 'Village 60 Plus',
    seo: doc?.seo,
  });
}

export default async function LegalPage({ params }: { params: Promise<{ legalSlug: string }> }) {
  const { legalSlug } = await params;
  if (!isLegalSlug(legalSlug)) notFound();
  const doc = await fetchPublished(PAGE_QUERY, { slug: legalSlug }, [docTag('page', legalSlug), 'page']);
  const siteUrl = getPublicEnv().siteUrl;
  const title = doc?.title || legalSlug;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(siteUrl, [{ label: 'Home', href: '/' }, { label: title, href: `/${legalSlug}` }])} />
      <LegalView title={title} body={doc?.body} lastReviewed={doc?.lastReviewed} />
    </>
  );
}
```

`pageMetadata` already sets `robots.index` false when `seo.noIndex` is true. Do not duplicate that logic.

```tsx
// src/app/(site)/not-found.tsx
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export default function NotFound() {
  return (
    <main id="main">
      <Section tone="ivory">
        <h1 id="page-title">Page not found</h1>
        <p className="mt-4 max-w-prose-site">That page is not on the Village 60 Plus site.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/">Back to the home page</Button>
          <Button href="/contact" variant="secondary">Contact</Button>
        </div>
      </Section>
    </main>
  );
}
```

```tsx
// src/app/(site)/error.tsx
'use client';

import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main">
      <Section tone="ivory">
        <h1 id="page-title">Something went wrong</h1>
        <p className="mt-4">Please call or WhatsApp us.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/contact">Contact</Button>
          <button type="button" className="inline-flex min-h-11 items-center font-semibold text-green underline" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </Section>
    </main>
  );
}
```

Do not read `error.message`, `error.stack`, or `error.digest` into the render. The argument stays in the type so Next.js can pass it.

- [ ] **Step 8: Run the tests**

```powershell
npx vitest run src/lib/routes.test.ts "src/app/(site)/our-story/view.test.tsx" "src/app/(site)/contact/view.test.tsx" "src/app/(site)/[legalSlug]/view.test.tsx" "src/app/(site)/not-found.test.tsx" "src/app/(site)/error.test.tsx"
```

Expected: PASS. The contact response time is its own paragraph, so `getByText('within one working day')` matches it. StaticMap also renders "Get directions"; the test looks for "Directions to Serenity".

- [ ] **Step 9: Typecheck and commit**

```powershell
npm run typecheck
git add src/lib/routes.ts src/lib/routes.test.ts "src/app/(site)/our-story" "src/app/(site)/contact" "src/app/(site)/[legalSlug]" "src/app/(site)/not-found.tsx" "src/app/(site)/not-found.test.tsx" "src/app/(site)/error.tsx" "src/app/(site)/error.test.tsx"
git commit -m "feat(pages): add Our Story, Contact, legal pages and error states"
```

Expected: typecheck clean.

---

### Task 31: Per-page WhatsApp context

**Files:**
- Create: `src/components/site/WhatsAppLink.tsx`
- Modify: `src/lib/routes.ts`, `src/lib/routes.test.ts`, `src/components/site/Header.tsx`, `src/components/site/Header.test.tsx`, `src/components/site/MobileActionBar.tsx`, `src/components/site/MobileActionBar.test.tsx`, `src/components/site/Footer.tsx`, `src/components/site/Footer.test.tsx`, `src/app/(site)/layout.tsx`, `src/lib/site-chrome.ts`

**Interfaces:**
- Consumes: `whatsappHref`, `SiteContact`, `usePathname`, `contactFromSettings`, `formatAddress`, `fetchPublished`, `SITE_SETTINGS_QUERY`.
- Produces: `contextForPath(pathname: string): string`. `WhatsAppLink` reads the pathname itself. `MobileActionBar` no longer takes `context`. Call links stay as they are.

- [ ] **Step 1: Add the failing tests to `src/lib/routes.test.ts`**

```ts
import { contextForPath } from './routes';

it('builds page-specific WhatsApp context from the path', () => {
  expect(contextForPath('/')).toBe('Village 60 Plus');
  expect(contextForPath('/oracle')).toBe('Oracle');
  expect(contextForPath('/homes/serenity')).toBe('Serenity');
  expect(contextForPath('/homes/the-grove')).toBe('The Grove');
  expect(contextForPath('/living-and-care/respite-care')).toBe('Respite care');
  expect(contextForPath('/silver-roots')).toBe('Silver Roots');
  expect(contextForPath('/unknown')).toBe('Village 60 Plus');
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/lib/routes.test.ts
```

Expected: FAIL — `contextForPath` is not exported.

- [ ] **Step 3: Append `contextForPath` to `src/lib/routes.ts`**

```ts
const RESIDENCE_CONTEXT: Record<string, string> = {
  tranquility: 'Tranquility',
  serenity: 'Serenity',
  'house-on-the-hill': 'House on the Hill',
  'enchanted-fields': 'Enchanted Fields',
  oracle: 'Oracle',
  'the-grove': 'The Grove',
};

const CARE_CONTEXT: Record<string, string> = {
  'independent-living': 'Independent living',
  'residential-care': 'Residential care',
  'respite-care': 'Respite care',
  recovery: 'Recovery',
  rehabilitation: 'Rehabilitation',
};

const PAGE_CONTEXT: Record<string, string> = {
  '/': 'Village 60 Plus',
  '/find-the-right-care': 'Find the Right Care',
  '/homes': 'Our homes',
  '/oracle': 'Oracle',
  '/living-and-care': 'Living & Care',
  '/silver-roots': 'Silver Roots',
  '/destination-retirement': 'Destination Retirement',
  '/sage': 'SAGE',
  '/our-story': 'Our story',
  '/contact': 'Contact',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
  '/accessibility': 'Accessibility',
};

export function contextForPath(pathname: string): string {
  const path = (pathname.split('?')[0] || '/').replace(/\/+$/, '') || '/';
  if (PAGE_CONTEXT[path]) return PAGE_CONTEXT[path];
  const residence = path.match(/^\/homes\/([^/]+)$/);
  if (residence) return RESIDENCE_CONTEXT[residence[1]] ?? 'Village 60 Plus';
  const care = path.match(/^\/living-and-care\/([^/]+)$/);
  if (care) return CARE_CONTEXT[care[1]] ?? 'Village 60 Plus';
  return 'Village 60 Plus';
}
```

- [ ] **Step 4: Run the route test**

```powershell
npx vitest run src/lib/routes.test.ts
```

Expected: PASS.

- [ ] **Step 5: Update the chrome tests so they fail for the right reason**

Add this mock at the top of `src/components/site/Header.test.tsx`, `MobileActionBar.test.tsx`, and `Footer.test.tsx`, after the imports:

```tsx
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/homes/serenity',
}));
```

`Footer.test.tsx` should mock `'/'` instead, so its existing assertions stay about the footer and not about Serenity:

```tsx
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));
```

In `Header.test.tsx`, replace the WhatsApp assertion with:

```tsx
expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Serenity'));
```

Replace `src/components/site/MobileActionBar.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MobileActionBar } from './MobileActionBar';
import { contactFixture } from '@/test/contact-fixture';

vi.mock('next/navigation', () => ({
  usePathname: () => '/homes/tranquility',
}));

describe('MobileActionBar', () => {
  it('builds WhatsApp context from the path and leaves Call unchanged', () => {
    render(<MobileActionBar contact={contactFixture} />);
    expect(screen.getByRole('link', { name: 'Call' })).toHaveAttribute('href', 'tel:+94112504838');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', expect.stringContaining('Tranquility'));
  });
});
```

- [ ] **Step 6: Run to verify the chrome tests fail**

```powershell
npx vitest run src/components/site/Header.test.tsx src/components/site/MobileActionBar.test.tsx src/components/site/Footer.test.tsx
```

Expected: FAIL — Header's WhatsApp href still contains `Village%2060%20Plus` rather than `Serenity`, and `MobileActionBar` still requires `context`. Footer fails if `usePathname` is called before `WhatsAppLink` exists; that is fixed in the next step. If Footer already passes because it does not call `usePathname` yet, leave it. Do not weaken the Serenity and Tranquility assertions.

- [ ] **Step 7: Create `src/components/site/WhatsAppLink.tsx`**

```tsx
'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { whatsappHref, type SiteContact } from '@/lib/contact';
import { contextForPath } from '@/lib/routes';

export function WhatsAppLink({ contact, className, children }: { contact: SiteContact; className?: string; children: ReactNode }) {
  const pathname = usePathname() || '/';
  return (
    <a
      href={whatsappHref(contact.whatsapp, contextForPath(pathname))}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
    >
      {children}
    </a>
  );
}
```

Replace `src/components/site/MobileActionBar.tsx` with:

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { telHref, whatsappHref, type SiteContact } from '@/lib/contact';
import { contextForPath } from '@/lib/routes';

export function MobileActionBar({ contact }: { contact: SiteContact }) {
  const context = contextForPath(usePathname() || '/');
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-px border-t border-stone bg-stone md:hidden" role="region" aria-label="Quick contact">
      <a href={telHref(contact.phone)} className="flex min-h-14 items-center justify-center bg-green font-semibold text-ivory no-underline" data-track="call_click">
        Call
      </a>
      <a
        href={whatsappHref(contact.whatsapp, context)}
        className="flex min-h-14 items-center justify-center bg-paper font-semibold text-green no-underline"
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
      >
        WhatsApp
      </a>
    </div>
  );
}
```

In `src/components/site/Header.tsx`, import `WhatsAppLink` and replace the WhatsApp `<a>` (the one whose href is `whatsappHref(contact.whatsapp, 'Village 60 Plus')`) with:

```tsx
<WhatsAppLink
  contact={contact}
  className="hidden items-center rounded-full border border-green px-4 py-2 font-semibold text-green no-underline hover:bg-mist md:inline-flex"
>
  WhatsApp
</WhatsAppLink>
```

Leave the Call `<a href={telHref(contact.phone)}` as it is. `whatsappHref` can be removed from the Header import if nothing else in the file uses it.

In `src/components/site/Footer.tsx`, import `WhatsAppLink` and replace the WhatsApp `<a>` with:

```tsx
<WhatsAppLink contact={contact} className="text-ivory no-underline hover:text-pale-gold">
  WhatsApp {contact.whatsapp}
</WhatsAppLink>
```

Leave the Call and email anchors. Remove `whatsappHref` from the Footer import if it is unused.

In `src/app/(site)/layout.tsx`, change the mobile bar to:

```tsx
<MobileActionBar contact={chrome.contact} />
```

Replace `src/lib/site-chrome.ts` with:

```ts
import 'server-only';
import type { SiteContact } from '@/lib/contact';
import { contactFromSettings, formatAddress } from '@/lib/site-settings';
import { fetchPublished } from '@/sanity/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';

export type SiteChrome = {
  contact: SiteContact;
  legalName: string;
  address: string;
  foundedYear: number | null;
  openingHours: string | null;
};

export async function getSiteChrome(): Promise<SiteChrome> {
  const settings = await fetchPublished(SITE_SETTINGS_QUERY, {}, ['siteSettings']);
  return {
    contact: contactFromSettings(settings),
    legalName: settings?.legalName ?? 'Village 60 Plus',
    address: formatAddress(settings?.headOffice) || 'Colombo, Sri Lanka',
    foundedYear: settings?.foundedYear ?? null,
    openingHours: settings?.openingHours ?? null,
  };
}
```

`formatAddress` joins with newlines. The footer already renders `address` with `whitespace-pre-line`.

- [ ] **Step 8: Run the chrome tests and typecheck**

```powershell
npx vitest run src/lib/routes.test.ts src/components/site
npm run typecheck
```

Expected: PASS and a clean typecheck. Header Call still uses `tel:`. WhatsApp hrefs contain the path context and not the visitor's typed message. `whatsappHref` already encodes `whatsappMessage(context)` only.

- [ ] **Step 9: Commit**

```powershell
git add src/lib/routes.ts src/lib/routes.test.ts src/components/site/WhatsAppLink.tsx src/components/site/Header.tsx src/components/site/Header.test.tsx src/components/site/MobileActionBar.tsx src/components/site/MobileActionBar.test.tsx src/components/site/Footer.tsx src/components/site/Footer.test.tsx src/app/(site)/layout.tsx src/lib/site-chrome.ts
git commit -m "feat(chrome): prefill WhatsApp with the current page"
```

**Phase 4 exit criteria:** `/` renders eight sections in order, with the Oracle card linking to `/oracle` and The Grove labelled Coming soon. `/homes/oracle` redirects to `/oracle`. A future residence shows the interest form and hides rooms, gallery, team and map. Oracle lists CMS room names and two visit forms. Living & Care cards precede the CMS sections. Silver Roots, Destination Retirement and SAGE label planned capabilities and do not render a dashboard. Our Story prints a founding year only when settings have one, and keeps a single green band. Contact hides an empty emergency notice. `/privacy`, `/terms` and `/accessibility` are the only slugs served by `[legalSlug]`. The error page does not show exception text. WhatsApp context follows the pathname. `npm test` and `npm run typecheck` pass.

---

## Phase 5 — Security, analytics, reports, browser tests, CI

No nonce, no `proxy.ts`. Marketing pages stay static. Analytics stays off until the visitor accepts, and events carry an allow-listed name with no field values.

### Task 32: Security headers and image remote patterns

**Files:**
- Create: `src/lib/security-headers.ts`, `src/lib/security-headers.test.ts`
- Modify: `next.config.ts` (replace)

**Interfaces:**
- Consumes: `ORACLE_HOMES_REDIRECT` from `src/lib/routes.ts` (`{ source: '/homes/oracle', destination: '/oracle', permanent: true }`).
- Produces:
  - `contentSecurityPolicy(gaId: string | null | undefined): string`
  - `securityHeaders(gaId: string | null | undefined): Array<{ key: string; value: string }>`
  - `next.config.ts` applies those headers on `/:path*` and allows `images.remotePatterns` for `cdn.sanity.io` only.

- [ ] **Step 1: Write the failing test `src/lib/security-headers.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy, securityHeaders } from './security-headers';

function header(gaId: string | null, key: string): string {
  const found = securityHeaders(gaId).find((item) => item.key === key);
  if (!found) throw new Error(`missing ${key}`);
  return found.value;
}

describe('security headers', () => {
  it('sets the static headers from spec §15', () => {
    expect(header(null, 'Strict-Transport-Security')).toBe('max-age=63072000; includeSubDomains; preload');
    expect(header(null, 'X-Content-Type-Options')).toBe('nosniff');
    expect(header(null, 'Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(header(null, 'X-Frame-Options')).toBe('SAMEORIGIN');
    expect(header(null, 'Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()');
  });

  it('allows the site, Sanity images and Google map images, and omits GA when no id is set', () => {
    const csp = contentSecurityPolicy(null);
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain('https://cdn.sanity.io');
    expect(csp).toContain('https://maps.googleapis.com');
    expect(csp).not.toContain('googletagmanager');
    expect(csp).not.toContain('google-analytics');
    expect(header(null, 'Content-Security-Policy')).toBe(csp);
  });

  it('adds GA hosts only when a measurement id is part of the build', () => {
    const csp = contentSecurityPolicy('G-TEST');
    expect(csp).toContain('https://www.googletagmanager.com');
    expect(csp).toContain('https://www.google-analytics.com');
    expect(csp).toContain('https://*.google-analytics.com');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run src/lib/security-headers.test.ts
```

Expected: FAIL — cannot find `./security-headers`.

- [ ] **Step 3: Create `src/lib/security-headers.ts`**

```ts
/**
 * Static response headers (spec §15).
 *
 * Content-Security-Policy is static on purpose. A nonce (and the proxy.ts that would
 * attach it) makes Next.js render pages dynamically, which fights the static marketing
 * pages. 'unsafe-inline' is the trade-off that keeps pages static.
 *
 * Studio is served on this origin at /studio, so the policy allows the Sanity hosts and
 * 'unsafe-eval' the Studio bundle needs. X-Frame-Options stays SAMEORIGIN for that reason.
 *
 * img-src always allows https://cdn.sanity.io and https://maps.googleapis.com.
 * GA script and connect hosts are appended only when NEXT_PUBLIC_GA_ID is set at build.
 */

const BASE_SCRIPT = ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://core.sanity.io'];
const BASE_IMG = ["'self'", 'data:', 'blob:', 'https://cdn.sanity.io', 'https://maps.googleapis.com', 'https://maps.gstatic.com'];
const BASE_CONNECT = ["'self'", 'https://*.sanity.io', 'wss://*.sanity.io'];
const BASE_FRAME = ["'self'", 'https://www.google.com'];

export function contentSecurityPolicy(gaId: string | null | undefined): string {
  const script = [...BASE_SCRIPT];
  const img = [...BASE_IMG];
  const connect = [...BASE_CONNECT];
  if (gaId) {
    script.push('https://www.googletagmanager.com');
    img.push('https://www.google-analytics.com');
    connect.push(
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://www.googletagmanager.com',
    );
  }
  return [
    "default-src 'self'",
    `script-src ${script.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${img.join(' ')}`,
    "font-src 'self'",
    `connect-src ${connect.join(' ')}`,
    `frame-src ${BASE_FRAME.join(' ')}`,
    "media-src 'self' https://cdn.sanity.io",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; ');
}

export function securityHeaders(gaId: string | null | undefined): Array<{ key: string; value: string }> {
  return [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Content-Security-Policy', value: contentSecurityPolicy(gaId) },
  ];
}
```

- [ ] **Step 4: Run the test**

```powershell
npx vitest run src/lib/security-headers.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Replace `next.config.ts`**

```ts
import type { NextConfig } from 'next';
import { ORACLE_HOMES_REDIRECT } from './src/lib/routes';
import { securityHeaders } from './src/lib/security-headers';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async redirects() {
    return [ORACLE_HOMES_REDIRECT];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders(process.env.NEXT_PUBLIC_GA_ID) }];
  },
};

export default nextConfig;
```

Keep the Oracle redirect. Add no other remote image host. Do not add `proxy.ts`.

- [ ] **Step 6: Typecheck and commit**

```powershell
npm run typecheck
git add src/lib/security-headers.ts src/lib/security-headers.test.ts next.config.ts
git commit -m "feat(security): add static security headers and a Sanity image host"
```

Expected: typecheck clean.

---

### Task 33: Analytics consent and allow-listed events

**Files:**
- Create: `src/lib/analytics.ts`, `src/lib/analytics.test.ts`, `src/components/analytics/Analytics.tsx`, `src/components/analytics/Analytics.test.tsx`
- Modify: `src/components/forms/EnquiryPanel.tsx`, `src/components/forms/EnquiryForm.tsx`, `src/components/media/StaticMap.tsx`, `src/app/(site)/contact/view.tsx`, `src/app/(site)/layout.tsx`, `package.json`, `package-lock.json`

**Interfaces:**
- Consumes: `getPublicEnv().gaId` (`string | null`), `EnquiryButton`, `EnquiryForm`, `StaticMap`, `ContactView`. `ContactActions`, the header Call link, `WhatsAppLink` and `MobileActionBar` already set `data-track="call_click"` and `data-track="whatsapp_click"`.
- Produces:
  - `CONSENT_COOKIE = 'v60-consent'`
  - `TRACK_EVENTS` = `'call_click' | 'whatsapp_click' | 'enquiry_open' | 'enquiry_submit' | 'directions_click' | 'form_error'`
  - `parseConsent(cookie: string): 'accepted' | 'rejected' | null`
  - `consentCookie(choice: 'accepted' | 'rejected', secure: boolean): string`
  - `trackName(value: unknown): TrackEvent | null` — anything else, including an email or a field value, is `null`
  - `dispatchTrack(name: TrackEvent): void` — fires `CustomEvent` `TRACK_EVENT_NAME` (`'v60-track'`) whose `detail` is that name and nothing else
  - `<Analytics gaId={string | null} />` — client component. Mounts `GoogleAnalytics` only when `gaId` is set and the cookie is `accepted`.

Event mapping (spec §17). The event name is only the allow-listed string. GA4 attaches the page path itself; do not add the form kind, the page name, or any field as an event parameter.

| Spec signal | How it is recorded |
|---|---|
| Call click | `data-track="call_click"` |
| WhatsApp click | `data-track="whatsapp_click"` |
| Enquiry open / Find the Right Care start | Button click `enquiry_open`, or the first focus inside an inline form that is not inside a `<dialog>` |
| Submission (general, Oracle visit, Grove interest, Silver Roots partner, Destination Retirement, Find the Right Care completion) | `dispatchTrack('enquiry_submit')` when `state.status === 'success'`. The page path distinguishes which form. |
| Directions click | `data-track="directions_click"` |
| Form error | `dispatchTrack('form_error')` when status is `error` or `delivery-failed`. The summary text is not sent. |
| Residence page view | `GoogleAnalytics` automatic `page_view` for that URL. No custom event. |

- [ ] **Step 1: Install the GA package**

```powershell
npm install @next/third-parties@16
```

Expected: `@next/third-parties` `16.4.x` in `package.json`, the same major as `next`.

- [ ] **Step 2: Write the failing unit test `src/lib/analytics.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { consentCookie, parseConsent, trackName } from './analytics';

describe('analytics consent and event names', () => {
  it('reads only the v60-consent cookie', () => {
    expect(parseConsent('')).toBeNull();
    expect(parseConsent('other=accepted')).toBeNull();
    expect(parseConsent('v60-consent=accepted')).toBe('accepted');
    expect(parseConsent('theme=ivory; v60-consent=rejected')).toBe('rejected');
    expect(parseConsent('v60-consent=maybe')).toBeNull();
  });

  it('writes a Lax cookie and adds Secure only on https', () => {
    expect(consentCookie('accepted', false)).toBe('v60-consent=accepted; Path=/; Max-Age=15552000; SameSite=Lax');
    expect(consentCookie('rejected', true)).toBe('v60-consent=rejected; Path=/; Max-Age=15552000; SameSite=Lax; Secure');
  });

  it('accepts the six event names and rejects everything else', () => {
    expect(trackName('call_click')).toBe('call_click');
    expect(trackName('whatsapp_click')).toBe('whatsapp_click');
    expect(trackName('enquiry_open')).toBe('enquiry_open');
    expect(trackName('enquiry_submit')).toBe('enquiry_submit');
    expect(trackName('directions_click')).toBe('directions_click');
    expect(trackName('form_error')).toBe('form_error');
    expect(trackName('visitor@example.com')).toBeNull();
    expect(trackName('+94741003994')).toBeNull();
    expect(trackName('oracle-visit')).toBeNull();
    expect(trackName({ name: 'Jane' })).toBeNull();
    expect(trackName(null)).toBeNull();
  });
});
```

- [ ] **Step 3: Run to verify it fails**

```powershell
npx vitest run src/lib/analytics.test.ts
```

Expected: FAIL — cannot find `./analytics`.

- [ ] **Step 4: Create `src/lib/analytics.ts`**

```ts
export const CONSENT_COOKIE = 'v60-consent';

export const TRACK_EVENTS = [
  'call_click',
  'whatsapp_click',
  'enquiry_open',
  'enquiry_submit',
  'directions_click',
  'form_error',
] as const;

export type TrackEvent = (typeof TRACK_EVENTS)[number];

export const TRACK_EVENT_NAME = 'v60-track';

export function parseConsent(cookie: string): 'accepted' | 'rejected' | null {
  const pair = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  if (!pair) return null;
  const value = pair.slice(CONSENT_COOKIE.length + 1);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

/** 180 days. Counsel still has to approve the cookie notice (spec §19). */
export function consentCookie(choice: 'accepted' | 'rejected', secure: boolean): string {
  const parts = [`${CONSENT_COOKIE}=${choice}`, 'Path=/', 'Max-Age=15552000', 'SameSite=Lax'];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function trackName(value: unknown): TrackEvent | null {
  return typeof value === 'string' && (TRACK_EVENTS as readonly string[]).includes(value) ? (value as TrackEvent) : null;
}

export function dispatchTrack(name: TrackEvent): void {
  if (typeof document === 'undefined') return;
  document.dispatchEvent(new CustomEvent(TRACK_EVENT_NAME, { detail: name }));
}
```

- [ ] **Step 5: Run the unit test**

```powershell
npx vitest run src/lib/analytics.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 6: Write the failing component test `src/components/analytics/Analytics.test.tsx`**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchTrack } from '@/lib/analytics';
import { Analytics } from './Analytics';

vi.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => <div data-testid="ga">{gaId}</div>,
  sendGAEvent: vi.fn(),
}));

import { sendGAEvent } from '@next/third-parties/google';

describe('Analytics', () => {
  beforeEach(() => {
    vi.mocked(sendGAEvent).mockClear();
    document.cookie = 'v60-consent=; Path=/; Max-Age=0';
  });

  it('shows Accept and Reject and does not load GA before a choice', async () => {
    render(<Analytics gaId="G-TEST" />);
    expect(await screen.findByRole('button', { name: 'Accept' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument();
    expect(screen.queryByTestId('ga')).not.toBeInTheDocument();
  });

  it('loads GA after Accept and sends only the event name', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Analytics gaId="G-TEST" />
        <a href="tel:+94112504838" data-track="call_click">
          Call
        </a>
      </>,
    );
    await user.click(await screen.findByRole('button', { name: 'Accept' }));
    expect(await screen.findByTestId('ga')).toHaveTextContent('G-TEST');
    expect(document.cookie).toContain('v60-consent=accepted');
    await user.click(screen.getByRole('link', { name: 'Call' }));
    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'call_click');
    expect(vi.mocked(sendGAEvent).mock.calls[0]).toHaveLength(2);
  });

  it('leaves GA unloaded after Reject', async () => {
    const user = userEvent.setup();
    render(<Analytics gaId="G-TEST" />);
    await user.click(await screen.findByRole('button', { name: 'Reject' }));
    await waitFor(() => expect(document.cookie).toContain('v60-consent=rejected'));
    expect(screen.queryByTestId('ga')).not.toBeInTheDocument();
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it('ignores a data-track value that is not an allow-listed event', async () => {
    document.cookie = 'v60-consent=accepted';
    const user = userEvent.setup();
    render(
      <>
        <Analytics gaId="G-TEST" />
        <button type="button" data-track="visitor@example.com">
          Bad
        </button>
      </>,
    );
    await screen.findByTestId('ga');
    await user.click(screen.getByRole('button', { name: 'Bad' }));
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it('forwards form_error from dispatchTrack and not the message', async () => {
    document.cookie = 'v60-consent=accepted';
    render(<Analytics gaId="G-TEST" />);
    await screen.findByTestId('ga');
    dispatchTrack('form_error');
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'form_error');
    expect(vi.mocked(sendGAEvent).mock.calls[0]).toHaveLength(2);
  });
});
```

- [ ] **Step 7: Run to verify it fails**

```powershell
npx vitest run src/components/analytics/Analytics.test.tsx
```

Expected: FAIL — cannot find `./Analytics`.

- [ ] **Step 8: Create `src/components/analytics/Analytics.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics, sendGAEvent } from '@next/third-parties/google';
import { consentCookie, parseConsent, TRACK_EVENT_NAME, trackName } from '@/lib/analytics';

function remember(choice: 'accepted' | 'rejected') {
  const secure = window.location.protocol === 'https:';
  document.cookie = consentCookie(choice, secure);
}

export function Analytics({ gaId }: { gaId: string | null }) {
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(parseConsent(document.cookie));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!gaId || consent !== 'accepted') return;

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const name = trackName(target.closest('[data-track]')?.getAttribute('data-track'));
      if (name) sendGAEvent('event', name);
    }

    function onTrack(event: Event) {
      const name = trackName((event as CustomEvent<unknown>).detail);
      if (name) sendGAEvent('event', name);
    }

    document.addEventListener('click', onClick);
    document.addEventListener(TRACK_EVENT_NAME, onTrack);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener(TRACK_EVENT_NAME, onTrack);
    };
  }, [gaId, consent]);

  const loadGa = Boolean(gaId) && consent === 'accepted';

  return (
    <>
      {loadGa && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      {ready && consent === null ? (
        <div
          role="region"
          aria-label="Analytics cookies"
          className="fixed inset-x-0 bottom-16 z-40 border-t border-stone bg-paper px-4 py-3 text-charcoal md:bottom-0"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <p className="max-w-prose-site text-[16px]">Analytics cookies stay off until you accept. We do not send your name, phone, email or message.</p>
            <div className="flex gap-3">
              <button type="button" className="inline-flex min-h-11 items-center rounded-full bg-green px-5 font-semibold text-ivory" onClick={() => { remember('accepted'); setConsent('accepted'); }}>
                Accept
              </button>
              <button type="button" className="inline-flex min-h-11 items-center rounded-full border border-green px-5 font-semibold text-green" onClick={() => { remember('rejected'); setConsent('rejected'); }}>
                Reject
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
```

The banner is a region, not a dialog and not an entry pop-up. It sits above the mobile Call / WhatsApp bar. Reject is a 44px button, same row as Accept. Residence page views are the automatic GA4 `page_view` from `GoogleAnalytics`; do not send a second event.

- [ ] **Step 9: Run the component test**

```powershell
npx vitest run src/components/analytics/Analytics.test.tsx
```

Expected: PASS (5 tests). If jsdom refuses `document.cookie` after `Max-Age=0`, clear it with `document.cookie = 'v60-consent=accepted; Max-Age=0'` and assert `not.toContain('v60-consent=accepted')` only in the Reject test by checking the string that was written... The Reject test already waits for `v60-consent=rejected`. Keep that assertion.

- [ ] **Step 10: Put the event names on the controls that do not have them yet**

In `EnquiryButton` in `src/components/forms/EnquiryPanel.tsx`, add `data-track="enquiry_open"` to the `<button>`:

```tsx
export function EnquiryButton({ kind, context, children }: { kind: FormKind; context: string; children: ReactNode }) {
  const { open } = useEnquiry();
  return (
    <button type="button" className="inline-flex min-h-11 items-center rounded-full bg-green px-5 font-semibold text-ivory" data-track="enquiry_open" onClick={() => open(kind, context)}>
      {children}
    </button>
  );
}
```

In `src/components/forms/EnquiryForm.tsx`, import `dispatchTrack` and `useRef` is already imported. Add a ref and a focus handler, and extend the existing effect. Leave the success and error markup as it is.

```tsx
import { dispatchTrack } from '@/lib/analytics';
```

Inside the component, next to `summaryRef`:

```tsx
const started = useRef(false);

function onFocusCapture(event: React.FocusEvent<HTMLFormElement>) {
  if (started.current) return;
  if (event.currentTarget.closest('dialog')) return;
  started.current = true;
  dispatchTrack('enquiry_open');
}
```

Replace the effect:

```tsx
useEffect(() => {
  if (state.status === 'error' || state.status === 'delivery-failed') {
    summaryRef.current?.focus();
    dispatchTrack('form_error');
  }
  if (state.status === 'success') {
    dispatchTrack('enquiry_submit');
  }
}, [state]);
```

Add `onFocusCapture={onFocusCapture}` to the `<form>`. Do not put `data-track` on the form or the error summary: a click inside the form would then send a second event, and the error text must not become an event parameter. `dispatchTrack` sends the name only.

`useRef` is already imported from React. Add `type React` only if `React.FocusEvent` is not in scope — import `type FocusEvent` from `react` and use `FocusEvent<HTMLFormElement>` if the project has the React namespace disabled.

In `src/components/media/StaticMap.tsx`, add `data-track="directions_click"` to the "Get directions" anchor:

```tsx
<a href={directions} className="font-semibold text-green underline underline-offset-4" target="_blank" rel="noopener noreferrer" data-track="directions_click">
  Get directions
</a>
```

In `src/app/(site)/contact/view.tsx`, add the attributes on the three contact controls that are not already tracked:

```tsx
{contact.phone ? <li><a href={telHref(contact.phone)} data-track="call_click">{contact.phoneDisplay}</a></li> : null}
{contact.whatsapp ? <li><a href={whatsappHref(contact.whatsapp, 'Contact')} data-track="whatsapp_click" target="_blank" rel="noopener noreferrer">WhatsApp</a></li> : null}
```

And on the directions button:

```tsx
{directions ? <Button href={directions} variant="text" target="_blank" rel="noopener noreferrer" data-track="directions_click">Directions to {residence.name}</Button> : null}
```

Leave the email link without `data-track`. Email clicks are not in the allow-list.

- [ ] **Step 11: Mount Analytics in `src/app/(site)/layout.tsx`**

```tsx
import { Analytics } from '@/components/analytics/Analytics';
import { EnquiryButton, EnquiryProvider } from '@/components/forms/EnquiryPanel';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { MobileActionBar } from '@/components/site/MobileActionBar';
import { SkipLink } from '@/components/site/SkipLink';
import { getPublicEnv } from '@/lib/env';
import { getSiteChrome } from '@/lib/site-chrome';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const chrome = await getSiteChrome();
  return (
    <EnquiryProvider contact={chrome.contact}>
      <SkipLink />
      <Header contact={chrome.contact} enquiryTrigger={<EnquiryButton kind="general" context="Village 60 Plus">Enquire</EnquiryButton>} />
      <div className="pb-20 md:pb-0">{children}</div>
      <Footer
        contact={chrome.contact}
        legalName={chrome.legalName}
        address={chrome.address}
        foundedYear={chrome.foundedYear}
        openingHours={chrome.openingHours}
      />
      <MobileActionBar contact={chrome.contact} />
      <Analytics gaId={getPublicEnv().gaId} />
    </EnquiryProvider>
  );
}
```

`MobileActionBar` takes no `context` (Task 31). Do not pass one back.

- [ ] **Step 12: Run the form, map, analytics and typecheck commands**

```powershell
npx vitest run src/lib/analytics.test.ts src/components/analytics/Analytics.test.tsx src/components/forms/EnquiryForm.test.tsx src/components/forms/EnquiryPanel.test.tsx src/components/media/StaticMap.test.tsx
npm run typecheck
```

Expected: PASS and a clean typecheck. The enquiry panel test still opens "Arrange a private visit". StaticMap still shows "Get directions" before a map loads.

- [ ] **Step 13: Commit**

```powershell
git add package.json package-lock.json src/lib/analytics.ts src/lib/analytics.test.ts src/components/analytics/Analytics.tsx src/components/analytics/Analytics.test.tsx src/components/forms/EnquiryPanel.tsx src/components/forms/EnquiryForm.tsx src/components/media/StaticMap.tsx src/app/(site)/contact/view.tsx src/app/(site)/layout.tsx
git commit -m "feat(analytics): load GA4 only after consent and send allow-listed events"
```

---

### Task 34: Placeholder media report

**Files:**
- Create: `scripts/placeholder-report.ts`, `scripts/placeholder-report.test.ts`
- Modify: `package.json` (the `report:placeholders` script)

**Interfaces:**
- Consumes: `requireEnv` from `src/lib/env.ts`. A `mediaImage` object has `_type: 'mediaImage'`, `placeholder`, `alt`, `source`, `license`, `replaceBy`. Documents that embed images: `page`, `residence` (`heroImage`, `gallery[]`, `rooms[].image`), `careService`, `ecosystemOffering`, `teamMember` (`image`), `siteSettings` (`defaultSeo.image`), plus `contentSection.image`, `heroVideo.poster` and `seo.image`.
- Produces:
  - `PLACEHOLDER_QUERY` — published documents of those six types
  - `collectPlaceholders(documents: ReadonlyArray<Record<string, unknown>>): PlaceholderHit[]`
  - `renderPlaceholderReport(hits: PlaceholderHit[], generatedOn: string): string`
  - `PlaceholderHit = { documentTitle: string; documentType: string; alt: string; source: string; license: string; replaceBy: string }`
  - `npm run report:placeholders` writes `reports/placeholders.md` (already gitignored)

- [ ] **Step 1: Write the failing test `scripts/placeholder-report.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { collectPlaceholders, renderPlaceholderReport } from './placeholder-report';

const documents = [
  {
    _id: 'residence.serenity',
    _type: 'residence',
    name: 'Serenity',
    heroImage: {
      _type: 'mediaImage',
      alt: 'Serenity verandah',
      source: 'Client — Serenity, unconfirmed',
      license: 'client-owned',
      placeholder: true,
      replaceBy: '2027-01-31',
    },
    gallery: [
      { _type: 'mediaImage', alt: 'Garden', source: 'Licensed stock', license: 'licensed-stock', placeholder: false, replaceBy: null },
    ],
  },
  {
    _id: 'team.one',
    _type: 'teamMember',
    name: 'A staff member',
    image: { _type: 'mediaImage', alt: 'Portrait', source: '', license: '', placeholder: true, replaceBy: '' },
  },
];

describe('placeholder report', () => {
  it('collects nested placeholder images and skips published-ready ones', () => {
    const hits = collectPlaceholders(documents);
    expect(hits).toEqual([
      {
        documentTitle: 'Serenity',
        documentType: 'residence',
        alt: 'Serenity verandah',
        source: 'Client — Serenity, unconfirmed',
        license: 'client-owned',
        replaceBy: '2027-01-31',
      },
      {
        documentTitle: 'A staff member',
        documentType: 'teamMember',
        alt: 'Portrait',
        source: '',
        license: '',
        replaceBy: '',
      },
    ]);
  });

  it('writes a markdown table with source, license and replacement deadline', () => {
    const markdown = renderPlaceholderReport(collectPlaceholders(documents), '2026-10-12');
    expect(markdown).toContain('# Placeholder images');
    expect(markdown).toContain('Generated 2026-10-12');
    expect(markdown).toContain('| Serenity | residence | Serenity verandah | Client — Serenity, unconfirmed | client-owned | 2027-01-31 |');
    expect(markdown).toContain('| A staff member | teamMember | Portrait |  |  |  |');
    expect(markdown).not.toContain('Garden');
  });

  it('says there are none when the list is empty', () => {
    expect(renderPlaceholderReport([], '2026-10-12')).toContain('No placeholder images.');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```powershell
npx vitest run scripts/placeholder-report.test.ts
```

Expected: FAIL — cannot find `./placeholder-report`.

- [ ] **Step 3: Create `scripts/placeholder-report.ts`**

```ts
/**
 * Pre-launch report of mediaImage objects with placeholder == true (spec §12).
 * Writes reports/placeholders.md. Does not publish or edit content.
 * Usage: npm run report:placeholders
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@sanity/client';
import { requireEnv } from '@/lib/env';

export const PLACEHOLDER_QUERY = /* groq */ `
  *[_type in ["page", "residence", "careService", "ecosystemOffering", "teamMember", "siteSettings"]]
`;

export type PlaceholderHit = {
  documentTitle: string;
  documentType: string;
  alt: string;
  source: string;
  license: string;
  replaceBy: string;
};

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function walk(value: unknown, visit: (node: Record<string, unknown>) => void) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (!value || typeof value !== 'object') return;
  const node = value as Record<string, unknown>;
  visit(node);
  for (const child of Object.values(node)) walk(child, visit);
}

export function collectPlaceholders(documents: ReadonlyArray<Record<string, unknown>>): PlaceholderHit[] {
  const hits: PlaceholderHit[] = [];
  for (const doc of documents) {
    const documentTitle = text(doc.name) || text(doc.title) || text(doc.legalName) || text(doc._id) || 'Untitled';
    const documentType = text(doc._type) || 'document';
    walk(doc, (node) => {
      if (node._type !== 'mediaImage' || node.placeholder !== true) return;
      hits.push({
        documentTitle,
        documentType,
        alt: text(node.alt),
        source: text(node.source),
        license: text(node.license),
        replaceBy: text(node.replaceBy),
      });
    });
  }
  return hits;
}

function cell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export function renderPlaceholderReport(hits: PlaceholderHit[], generatedOn: string): string {
  const lines = [
    '# Placeholder images',
    '',
    `Generated ${generatedOn}. Each row is a mediaImage with placeholder set. Replace it before launch. This file does not confirm consent or ownership.`,
    '',
  ];
  if (hits.length === 0) {
    lines.push('No placeholder images.', '');
    return lines.join('\n');
  }
  lines.push('| Document | Type | Alt | Source | License | Replace by |', '| --- | --- | --- | --- | --- | --- |');
  for (const hit of hits) {
    lines.push(`| ${cell(hit.documentTitle)} | ${cell(hit.documentType)} | ${cell(hit.alt)} | ${cell(hit.source)} | ${cell(hit.license)} | ${cell(hit.replaceBy)} |`);
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const client = createClient({
    projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: requireEnv('NEXT_PUBLIC_SANITY_DATASET'),
    token: requireEnv('SANITY_API_READ_TOKEN'),
    apiVersion: '2026-02-01',
    useCdn: false,
  });
  const documents = await client.fetch<Array<Record<string, unknown>>>(PLACEHOLDER_QUERY, {}, { perspective: 'published' });
  const hits = collectPlaceholders(documents ?? []);
  const generatedOn = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' });
  mkdirSync('reports', { recursive: true });
  writeFileSync('reports/placeholders.md', renderPlaceholderReport(hits, generatedOn), 'utf8');
  console.log(`Wrote reports/placeholders.md (${hits.length} placeholder image${hits.length === 1 ? '' : 's'}).`);
}

const isDirectRun = process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/placeholder-report.ts');
if (isDirectRun) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Placeholder report failed');
    process.exit(1);
  });
}
```

`en-CA` formats the date as `YYYY-MM-DD`. The report uses the read token, not `SANITY_API_WRITE_TOKEN`.

- [ ] **Step 4: Point the npm script at `.env.local`**

In `package.json`, replace the placeholders script:

```json
"report:placeholders": "tsx --env-file=.env.local scripts/placeholder-report.ts"
```

If `tsx` rejects `--env-file`, use `node --env-file=.env.local --import tsx scripts/placeholder-report.ts`.

- [ ] **Step 5: Run the unit test**

```powershell
npx vitest run scripts/placeholder-report.test.ts
```

Expected: PASS (3 tests). The test imports the module; `isDirectRun` is false under Vitest, so it does not call Sanity.

- [ ] **Step 6: Commit**

```powershell
git add scripts/placeholder-report.ts scripts/placeholder-report.test.ts package.json
git commit -m "feat(media): report placeholder images with source, license and deadline"
```

Running `npm run report:placeholders` needs a Sanity project and a read token. Do that after Task 6's `.env.local` exists. Expected stdout: `Wrote reports/placeholders.md (N placeholder images).` The seed marks every image as a placeholder, so N is greater than zero on a seeded dataset.

---

### Task 35: Playwright smoke, axe, keyboard, reduced motion

**Files:**
- Create: `e2e/home.spec.ts`
- Modify: `e2e/smoke.spec.ts` (replace), `src/sanity/fetch.ts`, `src/app/sitemap.ts`, `src/components/site/Header.tsx`, `src/components/site/Footer.tsx`, `src/components/site/MobileActionBar.tsx`, `src/components/site/Header.test.tsx`

**Interfaces:**
- Consumes: `fetchPublished`, `sitemapEntries`, `HomeView` regions `data-home-section` in the order `hero`, `pathways`, `oracle`, `homes`, `care`, `silver-roots`, `ecosystem`, `trust`. Skip link text "Skip to main content". Header is a `banner`, footer is `contentinfo`, pages render `main#main`. Enquire button name "Enquire". General form heading "Talk to the team". `VideoHero` omits `<video autoplay>` when `prefers-reduced-motion: reduce`.
- Produces: `fetchPublished` returns `null` when the Sanity request throws, so `next build` and the empty-state smoke tests render. `e2e/smoke.spec.ts` covers structure, section order, axe, keyboard and reduced motion without CMS content. `e2e/home.spec.ts` asserts The Grove's "Coming soon" label and skips when `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing or `testproject`.

- [ ] **Step 1: Make a failed published fetch an empty result**

Replace `fetchPublished` in `src/sanity/fetch.ts` with:

```ts
/** Published content only; safe outside a request scope. A failed request renders the empty state instead of throwing. */
export async function fetchPublished<const Q extends string>(query: Q, params: QueryParams = {}, tags: string[] = []): Promise<ClientReturn<Q> | null> {
  try {
    return await client.fetch(query, params, { perspective: 'published', useCdn: true, next: { revalidate: DEFAULT_REVALIDATE, tags } });
  } catch (error: unknown) {
    console.error('Published Sanity fetch failed', error instanceof Error ? error.name : 'Error');
    return null;
  }
}
```

In `src/app/sitemap.ts`, pass an empty group when the fetch returns null:

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchPublished(SITEMAP_QUERY, {}, ['sitemap']);
  return sitemapEntries(
    getPublicEnv().siteUrl,
    data ?? { pages: [], residences: [], careServices: [], offerings: [] },
  );
}
```

Log the error name only. Do not log `error.message` or the token. A missing document was already `null` from GROQ; this catch is for an unreachable project, which is what CI uses.

- [ ] **Step 2: Hide Call and WhatsApp when the number is empty**

Empty chrome uses `contactFromSettings(null)`, whose phone and WhatsApp are `''`. `telHref('')` is `tel:+`. That link must not render.

In `src/components/site/Header.tsx`, wrap the Call anchor in `contact.phone ? … : null` and the `WhatsAppLink` in `contact.whatsapp ? … : null`. Leave the Enquire trigger.

In `src/components/site/Footer.tsx`, wrap the Call anchor and the `WhatsAppLink` the same way. Keep the email anchor behind `contact.email`.

Replace the body of `MobileActionBar` so it returns `null` when both numbers are empty, and otherwise renders only the actions that have a number:

```tsx
export function MobileActionBar({ contact }: { contact: SiteContact }) {
  const context = contextForPath(usePathname() || '/');
  if (!contact.phone && !contact.whatsapp) return null;
  return (
    <div className={`fixed inset-x-0 bottom-0 z-30 grid gap-px border-t border-stone bg-stone md:hidden ${contact.phone && contact.whatsapp ? 'grid-cols-2' : 'grid-cols-1'}`} role="region" aria-label="Quick contact">
      {contact.phone ? (
        <a href={telHref(contact.phone)} className="flex min-h-14 items-center justify-center bg-green font-semibold text-ivory no-underline" data-track="call_click">
          Call
        </a>
      ) : null}
      {contact.whatsapp ? (
        <a
          href={whatsappHref(contact.whatsapp, context)}
          className="flex min-h-14 items-center justify-center bg-paper font-semibold text-green no-underline"
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp_click"
        >
          WhatsApp
        </a>
      ) : null}
    </div>
  );
}
```

Add this test to `src/components/site/Header.test.tsx`:

```tsx
it('does not render a tel link when the phone number is empty', () => {
  render(
    <Header
      contact={{ phone: '', phoneDisplay: '', whatsapp: '', email: '', responseTime: 'as soon as we can' }}
      enquiryTrigger={<button type="button">Enquire</button>}
    />,
  );
  expect(screen.queryByRole('link', { name: /^Call/ })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Enquire' })).toBeInTheDocument();
});
```

The existing Header test still uses `contactFixture` and still expects the Serenity WhatsApp href.

- [ ] **Step 3: Run the chrome unit tests**

```powershell
npx vitest run src/components/site/Header.test.tsx src/components/site/Footer.test.tsx src/components/site/MobileActionBar.test.tsx
npm run typecheck
```

Expected: PASS and a clean typecheck. If another file treats `fetchPublished`'s result as a non-null array, narrow it with `?? []` at that call site. Do not cast.

- [ ] **Step 4: Replace `e2e/smoke.spec.ts`**

```ts
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
    expect(sections).toEqual(['hero', 'pathways', 'oracle', 'homes', 'care', 'silver-roots', 'ecosystem', 'trust']);
    const find = page.getByRole('link', { name: 'Find the Right Care' }).first();
    const oracle = page.getByRole('heading', { name: 'Oracle' }).first();
    const findBox = await find.boundingBox();
    const oracleBox = await oracle.boundingBox();
    expect(findBox && oracleBox && findBox.y < oracleBox.y).toBeTruthy();
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
```

The section order is in the view even when Sanity returns null. The Grove label is not, so it lives in the next file. If axe names a violation, fix that component. Do not exclude the rule. The Find the Right Care link must sit above the Oracle heading.

- [ ] **Step 5: Create `e2e/home.spec.ts`**

```ts
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
```

`ResidenceCard` renders an `<article>`. The heading sits inside it, and the status badge text is "Coming soon". If the article is not an ancestor in the built card, assert `page.getByRole('article').filter({ hasText: 'The Grove' })` contains "Coming soon" instead. Do not weaken the status text.

- [ ] **Step 6: Run the unit tests, then the smoke spec**

```powershell
npx vitest run src/components/site
npx playwright test e2e/smoke.spec.ts
```

Playwright starts `npm run dev` (Task 1 config) unless `CI` is set. `.env.local` may point at a real project; the smoke spec still passes because it asserts structure the views render either way. Expected: the smoke tests pass on both Playwright projects (desktop-chrome and mobile-chrome). `e2e/home.spec.ts` is not part of this command. Run it separately:

```powershell
npx playwright test e2e/home.spec.ts
```

Expected without a real project id: 2 skipped (one per project). With a seeded dataset: 2 passed, and the Grove card shows "Coming soon".

- [ ] **Step 7: Commit**

```powershell
git add e2e/smoke.spec.ts e2e/home.spec.ts src/sanity/fetch.ts src/app/sitemap.ts src/components/site/Header.tsx src/components/site/Footer.tsx src/components/site/MobileActionBar.tsx src/components/site/Header.test.tsx
git commit -m "test(e2e): cover empty-state structure, axe, keyboard and reduced motion"
```

---

### Task 36: CI, Dependabot and the local Lighthouse config

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/dependabot.yml`, `lighthouserc.json`
- Modify: `src/sanity/client.ts`

**Interfaces:**
- Consumes: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run e2e`, `e2e/smoke.spec.ts`, `fetchPublished` returning `null` on failure (Task 35), `getPublicEnv()`.
- Produces: a required CI job that does not run Lighthouse, a Playwright job that runs smoke tests when Sanity secrets are absent, and `lighthouserc.json` for a local `npx lhci autorun`. The published Sanity client sends `SANITY_API_READ_TOKEN` when that variable is set, so a private dataset can serve the seeded Playwright test.

- [ ] **Step 1: Let the published client use the read token when it exists**

In `src/sanity/client.ts`, replace the client construction with:

```ts
const token = process.env.SANITY_API_READ_TOKEN;

export const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion,
  useCdn: !token,
  perspective: 'published',
  token,
});
```

Leave `apiVersion` and the `getPublicEnv()` call as they are. An empty token stays falsy, the CDN stays on, and Vitest still does not need a secret. Do not log the token. Do not switch this to `requireEnv`.

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    name: Lint, typecheck, test, build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Refuse tracked env files
        run: |
          if git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$'; then
            echo "An env file is tracked. Remove it."
            exit 1
          fi
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: http://localhost:3000
          NEXT_PUBLIC_SANITY_PROJECT_ID: testproject
          NEXT_PUBLIC_SANITY_DATASET: test

  e2e:
    name: Playwright
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - name: Sanity credentials present
        id: sanity
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
        run: |
          if [ -n "$NEXT_PUBLIC_SANITY_PROJECT_ID" ]; then
            echo "present=true" >> "$GITHUB_OUTPUT"
          else
            echo "present=false" >> "$GITHUB_OUTPUT"
          fi
      - name: Smoke against empty content
        if: steps.sanity.outputs.present == 'false'
        run: npx playwright test e2e/smoke.spec.ts
        env:
          CI: "true"
          NEXT_PUBLIC_SITE_URL: http://localhost:3000
          NEXT_PUBLIC_SANITY_PROJECT_ID: testproject
          NEXT_PUBLIC_SANITY_DATASET: test
      - name: Full browser tests
        if: steps.sanity.outputs.present == 'true'
        run: npm run e2e
        env:
          CI: "true"
          NEXT_PUBLIC_SITE_URL: http://localhost:3000
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.NEXT_PUBLIC_SANITY_DATASET }}
          SANITY_API_READ_TOKEN: ${{ secrets.SANITY_API_READ_TOKEN }}
```

`playwright.config.ts` already builds and starts the app when `CI` is set. The step env is what that build sees. Do not add a Lighthouse job. `testproject` is the same id Vitest uses; the build renders empty states because Task 35 catches a failed fetch.

The full browser job expects a seeded dataset. Store these repository secrets: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` (use `development`, not `production`), `SANITY_API_READ_TOKEN`. Until they exist, only `e2e/smoke.spec.ts` runs.

- [ ] **Step 3: Create `.github/dependabot.yml`**

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
```

This is the dependency scan (spec §15). Secret scanning is the tracked-env step above, plus GitHub secret scanning enabled in the repository settings (recorded in the README). Do not add a third scanner package.

- [ ] **Step 4: Create `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/contact",
        "http://localhost:3000/oracle"
      ],
      "startServerCommand": "npm run start",
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "./reports/lighthouse"
    }
  }
}
```

Lighthouse's default run is mobile. Accessibility 95 is spec §22. LCP 2.5s and CLS 0.1 are spec §18. INP is a field metric; do not invent a lab assertion for it. `reports/` is gitignored. This file is not a CI required check. Run it locally after a production URL exists, or against the local build:

```powershell
npm run build
npx lhci autorun
```

Expected locally: a report under `reports/lighthouse`. A failure prints the assertion that missed. Fix the page or record the remediation in the launch notes. Do not lower the numbers to make a run pass.

- [ ] **Step 5: Typecheck and commit**

```powershell
npm run typecheck
git add .github/workflows/ci.yml .github/dependabot.yml lighthouserc.json src/sanity/client.ts
git commit -m "ci: verify the build and keep Lighthouse as a local check"
```

Expected: typecheck clean. GitHub runs the workflow after the file is on the remote; pushing is a separate decision.

---

### Task 37: README and launch checklist

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: scripts from `package.json` (`dev`, `build`, `lint`, `typecheck`, `test`, `e2e`, `seed`, `report:placeholders`), `.env.example`, the preview route `/api/draft-mode/enable?secret=&slug=`, the webhook shape from Task 9, spec §19 and §20.
- Produces: `README.md`. It tells a new developer how to create the Sanity project, which env vars exist, how to seed, how to open preview, and which facts are still unconfirmed. It does not state a founding year, phone number, or address as a confirmed fact.

- [ ] **Step 1: Create `README.md`**

````md
# Village 60 Plus

Marketing site for Village 60 Plus. Next.js App Router, Sanity Studio at `/studio`, enquiry email through Resend, and the Verandah visual system.

Node 22 and npm. The app lives in `src/`.

## Create the Sanity project

```powershell
npx sanity@latest init --bare
```

Choose **Create new project**, name it `Village 60 Plus`, and name the dataset `development` (private). Then in [sanity.io/manage](https://www.sanity.io/manage):

1. Add a private `production` dataset and leave it empty.
2. Create a **Viewer** token named `website-read`. This is `SANITY_API_READ_TOKEN`.
3. Create an **Editor** token named `seed-write`. This is `SANITY_API_WRITE_TOKEN`. It stays on the machine that runs the seed. It is not a Vercel variable.
4. Add CORS origin `http://localhost:3000` with credentials allowed. Add the Vercel preview and production origins when those hosts exist.

## Environment

```powershell
Copy-Item .env.example .env.local
```

Fill `.env.local` from `.env.example`. Public variables:

| Name | Role |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Local default `http://localhost:3000`. Production `https://www.village60plus.lk`. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From `sanity init`. |
| `NEXT_PUBLIC_SANITY_DATASET` | `development` locally. |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement id. Empty leaves analytics unloaded. |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Maps Static API and Maps Embed API, restricted by HTTP referrer. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Search Console HTML-tag token. |

Server variables: `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN` (seed only), `SANITY_PREVIEW_SECRET`, `SANITY_REVALIDATE_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `FORM_FALLBACK_RECIPIENT`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ALLOW_PRODUCTION_SEED`.

Generate the two secrets:

```powershell
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

`.env.local` is gitignored. Enable GitHub secret scanning and push protection on the repository before the first deploy.

## Scripts

```powershell
npm run dev
npm run lint
npm run typecheck
npm test
npm run e2e
npm run build
npm run seed
npm run report:placeholders
```

`npm run seed` writes the development dataset only. It refuses `production` unless `ALLOW_PRODUCTION_SEED=yes`. Seed copy and contact details are unverified filler. Do not publish them.

`npm run report:placeholders` writes `reports/placeholders.md` with the source, license and replacement deadline of every `mediaImage` still marked as a placeholder.

After `npm run build`, the local performance check is:

```powershell
npx lhci autorun
```

That reads `lighthouserc.json` (accessibility at least 95, LCP 2.5s, CLS 0.1). It is not a CI gate. Interaction to Next Paint is measured in the field after launch.

## Preview and revalidation

Turn draft mode on for one path:

`/api/draft-mode/enable?secret=<SANITY_PREVIEW_SECRET>&slug=/homes/serenity`

`slug` must be a same-origin path. `/` is the default. Turn it off at `/api/draft-mode/disable`.

When a deployment URL exists, add a Sanity webhook: URL `https://www.village60plus.lk/api/revalidate`, dataset `production`, triggers create, update and delete, projection `{ _type, slug }`, secret `SANITY_REVALIDATE_SECRET`.

## Hosting

Vercel, or a host with image optimization, encrypted env vars, preview deployments and rollback. Set the same variables as `.env.example` except `SANITY_API_WRITE_TOKEN` and `ALLOW_PRODUCTION_SEED`.

## Privacy and retention

The privacy notice, the lawful basis for enquiries, and how long a submission is kept are not decided in this repo. Sri Lankan counsel approves them (spec §19). Do not invent a retention period. The consent banner only records `v60-consent=accepted` or `v60-consent=rejected`. Analytics events are the six allow-listed names in `src/lib/analytics.ts` and never include a name, phone, email or message.

## Launch checklist

Nothing below is confirmed by being written here. Tick an item only after the client confirms it.

Public details to verify before they are treated as fact:

- [ ] Phone `+94 11 250 4838`
- [ ] WhatsApp `+94 74 100 3994`
- [ ] Email `village60plus@gmail.com`
- [ ] Head office `133/19 Nawala Road, Narahenpita, Colombo 05`

Must be confirmed:

- [ ] Founded in 2008 or 2009
- [ ] Official spelling and location for every residence
- [ ] Serenity: Railway Avenue, Kirulapone, or Nugegoda
- [ ] House on the Hill versus Hope on the Hill
- [ ] House on the Hill location: Kirulapone or Nugegoda
- [ ] Enchanted Field versus Enchanted Fields
- [ ] Oracle opening and operating status
- [ ] Oracle room names, capacity, services, and visit availability
- [ ] The Grove timeline, and whether it is all or part of the 80-room expansion
- [ ] Which care types are available at each residence
- [ ] Which services are delivered directly and which are coordinated by partners
- [ ] Silver Roots features available now
- [ ] SAGE features deployed now
- [ ] Destination Retirement inventory available now
- [ ] Whether Home Nursing, Care Products, and Caregiver Training stay, move, or retire
- [ ] Whether CILS belongs on the public story timeline
- [ ] Registration, licensing, staffing, and medical-service language
- [ ] Primary phone, WhatsApp, email, contact hours, and response time
- [ ] Ownership and consent for existing photographs

Ship only when:

- [ ] Every sitemap page is implemented or redirected, and `/homes/oracle` redirects to `/oracle`
- [ ] The homepage is the eight-section sequence, with Find the Right Care before Oracle
- [ ] Call and WhatsApp are one action away on every page that has numbers
- [ ] The Grove reads as coming soon, with one interest action
- [ ] Future Silver Roots, SAGE and Destination Retirement capabilities stay labelled
- [ ] No public price, and no unsupported medical, outcome, ranking or availability claim
- [ ] Forms reach the right inbox and offer WhatsApp if email fails
- [ ] axe reports no violations for `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa` on `/` and `/contact`
- [ ] A person has completed the keyboard, screen-reader, 200% zoom and text-spacing passes on menus, forms, accordions, galleries and the map
- [ ] Reduced motion does not autoplay the hero video
- [ ] Lighthouse accessibility is at least 95 on home, contact and Oracle, and LCP / CLS meet the budgets or the gap is written down
- [ ] `npm run report:placeholders` has been read, and every remaining placeholder has source, license and a replacement deadline
- [ ] Identifiable resident or family photographs have a consent record
- [ ] Counsel has approved the privacy notice, cookie behaviour and retention
- [ ] The client has signed this list
````

The phone, WhatsApp, email and address lines are the details spec §20 found on the current public site. They stay checklist items. Do not copy them into a component as if they were confirmed.

- [ ] **Step 2: Confirm the file renders and commit**

```powershell
Get-Content README.md -TotalCount 5
git add README.md
git commit -m "docs: add setup steps and the unconfirmed launch checklist"
```

Expected: the first lines are the title and the one-sentence description. The checklist still contains "2008 or 2009" as a question, not a chosen year.

---

**Phase 5 exit criteria:** `securityHeaders` sends HSTS, `nosniff`, `strict-origin-when-cross-origin`, `SAMEORIGIN` and a camera/microphone/geolocation lock. The CSP allows `cdn.sanity.io` and `maps.googleapis.com`, and adds GA hosts only when `NEXT_PUBLIC_GA_ID` is set. There is no `proxy.ts`. `Analytics` renders `GoogleAnalytics` only after `v60-consent=accepted`, and `trackName` drops anything outside the six event names. `npm run report:placeholders` writes source, license and deadline. Playwright smoke covers skip link, header, main, footer, home section order, axe on `/` and `/contact`, keyboard access to the enquiry dialog, and no `video[autoplay]` under reduced motion. The Grove coming-soon spec skips on `testproject`. CI runs lint, typecheck, unit tests and build. Lighthouse stays a local `npx lhci autorun`. The README lists env vars, seed, preview and the spec §20 checklist without promoting an unconfirmed fact.

---

## Spec coverage

| Spec | Where it is implemented |
|---|---|
| §1 Purpose, §2 decisions, §5 message rules, §23 non-goals | Global constraints. No task builds a marketplace, accounts, payments, chatbot or a second language. |
| §3 Success criteria, §22 launch acceptance | Task 37 checklist, plus the page and form tasks it points at. |
| §4 Audience, §13 content strategy | Sanity copy and the editing rules in the schema descriptions (Tasks 7–8). Pages render CMS text. |
| §6 Information architecture, §7 journeys | `src/lib/routes.ts`, `src/lib/navigation.ts`, Tasks 23–31. |
| §8 Pages | Tasks 23–30. |
| §9 Forms | Tasks 19–22. Task 33 records open, submit and error without field values. |
| §10 Visual system | Tasks 2–5. |
| §11 Responsive and accessible behaviour | Tasks 2–5, 14, 21, 35. Screen-reader, zoom and text-spacing passes are manual items in Task 37. |
| §12 Photography and temporary assets | Tasks 7, 11–14 and 34. |
| §14 CMS | Tasks 6–10. |
| §15 Application, preview, sitemap | Tasks 1, 9 and 18. |
| §15 Hosting | Task 37. |
| §15 Forms and email | Tasks 19–21. |
| §15 WhatsApp | Tasks 4 and 31. |
| §15 Maps | Task 15. |
| §15 Security headers and CSP | Task 32. |
| §15 Validation, rate limit, no personal data in analytics | Tasks 20 and 33. |
| §15 Dependency and secret scanning | Task 36 Dependabot and the tracked-env check. GitHub secret scanning is a Task 37 setting. |
| §15 Retention | Task 37 states that the period is unconfirmed and must not be invented. |
| §16 SEO | Task 18. |
| §17 Analytics | Task 33. Residence views are the GA4 page view. |
| §18 Performance | Tasks 2, 11 and 14 for fonts, images and video. Task 36 holds the LCP and CLS budgets for local Lighthouse. INP is field-measured, as Task 37 says. |
| §19 Privacy and care-claim controls | Task 30 legal pages, Task 33 cookie choice, Task 37 counsel gate. |
| §20 Known facts | Task 10 seed guard and the Task 37 checklist. |
| §21 Testing | Unit tests in each task. Task 35 browser and axe tests. Task 36 CI. Browser-matrix and screen-reader checks are on the Task 37 list. |
| §24 Sources | Not a software task. |

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-12-village60-plus-website.md`. Two execution options:

**1. Subagent-Driven (recommended)** — a fresh subagent per task, with review between tasks.

**2. Inline Execution** — execute tasks in this session using executing-plans, in batches with checkpoints.

Which approach?











