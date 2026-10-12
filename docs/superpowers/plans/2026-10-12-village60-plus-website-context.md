# Context for continuing the Village 60 Plus plan

Read this before appending to `docs/superpowers/plans/2026-10-12-village60-plus-website.md`. The plan file is the deliverable. This file is the reasoning that is not repeated inside every task.

**Plan status:** Tasks 1–37 are written (Phases 0–5). The plan ends with the spec-coverage table and the execution handoff. Do not append further tasks unless the spec changes.

**How to write:** This file was the brief for Phases 4 and 5. Phase 5 is Tasks 32–37 in `docs/superpowers/plans/2026-10-12-village60-plus-website.md`.

**Who writes:** The plan is written in this repo by the session that owns the spec. Research versions were gathered separately and are already baked into the plan header and `docs/superpowers/research/2026-10-12-sanity-nextjs-reference.md`. Do not re-research unless an API name in a new task is uncertain.

---

## What is already decided

The site is a greenfield Next.js 16 App Router app in `src/`. There is no application code yet; the repo holds the spec, the client extract, this plan, and the Sanity research note. Node 22 and npm. No pnpm.

Pages are thin async server components that fetch and render a synchronous `*View`. Vitest cannot render async Server Components, so tests target the view. Playwright covers the route.

Navigation is code in `src/lib/routes.ts` and `src/lib/navigation.ts`. Copy, contact details, recipients, and SEO are Sanity. Oracle and The Grove are `residence` documents (`isFlagship` for Oracle, future status for The Grove). `ecosystemOffering` is only Silver Roots, Destination Retirement, and SAGE.

Slug constants (do not invent new ones):

- Residences: `tranquility`, `serenity`, `house-on-the-hill`, `enchanted-fields`, `oracle`, `the-grove`
- Care: `independent-living`, `residential-care`, `respite-care`, `recovery`, `rehabilitation`
- Offerings: `silver-roots`, `destination-retirement`, `sage`
- Pages: `home`, `find-the-right-care`, `homes`, `living-and-care`, `our-story`, `contact`, plus `privacy`, `terms`, `accessibility`
- `residencePath('oracle')` is `/oracle`. Every other residence is `/homes/[slug]`. There is no `/homes/oracle` page.

`generateStaticParams` must use these constants, not a live Sanity query, so `next build` works with an empty dataset. A slug outside the list is `notFound()`. A missing document renders the view's empty state, not a throw.

Status values: `available`, `limited`, `pilot`, `coming-soon`, `in-development`, `planned`. Labels are exactly "Available now", "Limited availability", "Pilot", "Coming soon", "In development", "Planned". `isFuture` is the last three. `isOperating` is the first two. `localBusinessJsonLd` and `serviceJsonLd` return null unless operating.

Form kinds: `general`, `find-care`, `oracle-visit`, `grove-interest`, `silver-roots-partner`, `destination-retirement`. Subjects are the strings on `FORM_KINDS` and must not contain names, phones, or health details. The general panel has five primary fields plus a privacy checkbox. Find the Right Care has no message and no diagnosis field.

Dark sections (`tone="night"` or `tone="green"`) are only the Oracle hero, the SAGE hero, the footer, and at most one quote band on Our Story. Homepage Oracle teaser is the dark section. Do not pass `night` anywhere else.

Seed data is development-only and flagged so it cannot be published without approval. Page tests use local fixtures, not the seed.

---

## Components Phase 4 must compose, not recreate

| Export | Use |
|---|---|
| `PageHero` | The only H1 (`id="page-title"`). Actions go in `children`. |
| `SectionList` | CMS `sections[]` on `page` documents. Not the homepage structure. |
| `ResidenceCard`, `CareServiceCard` | Hubs. Cards already link via `residencePath`. |
| `CapabilityList` | Included vs partner-delivered. Shows status. |
| `FaqList` | Native `<details>`. Server component. |
| `CtaBand` | Closing band. Pass buttons as `children`. |
| `Breadcrumbs` | Nested pages. Last crumb is not a link. |
| `Gallery`, `VideoHero`, `StaticMap`, `SanityImage`, `PortableText` | As named. Images without alt render nothing. |
| `ContactActions` | Call + WhatsApp for a page `context` string. |
| `EnquiryButton` | Opens the panel. Must be under `EnquiryProvider` (the site layout already provides it). |
| `EnquiryForm` | Inline form where the spec wants the form on the page, not only a button. |
| `pageMetadata`, `JsonLd`, `breadcrumbJsonLd`, `organizationJsonLd`, `websiteJsonLd`, `localBusinessJsonLd`, `serviceJsonLd` | Every indexable page. |

Queries already defined: `SITE_SETTINGS_QUERY`, `PAGE_QUERY` (`$slug`), `RESIDENCES_QUERY`, `RESIDENCE_QUERY` (`$slug`), `CARE_SERVICES_QUERY`, `CARE_SERVICE_QUERY`, `OFFERINGS_QUERY`, `OFFERING_QUERY`, `TEAM_QUERY`, `FAQS_FOR_PAGE_QUERY`, `SITEMAP_QUERY`, `SLUGS_QUERY`. Fetch with `fetchPublished` from `src/sanity/fetch.ts`. Helpers `toSiteContact`, `formatAddress`, `recipientsFor` live in `src/lib/site-settings.ts`.

Each page file:

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params; // omit when the route has no params
  const doc = await fetchPublished(/* query */, { slug }, [/* tags */]);
  return pageMetadata({ siteUrl: getPublicEnv().siteUrl, path, fallbackTitle, fallbackDescription, seo: doc?.seo });
}
```

`page.tsx` awaits params, fetches, and returns `<HomeView ... />`. The view is sync and exported for tests. Wrap page content in `<main id="main">`. The layout does not provide `<main>`.

---

## Phase 4 task split

Write these in order. Stop after two tasks if the write is getting large.

### Task 23 — Home

Fixed eight sections, in this order (spec §8.1). Do not render Home from `SectionList`; the order is the requirement.

1. Hero: `VideoHero` when the home page has `heroVideo`, otherwise `PageHero` tone `ivory`. Title "Live well. Age exceptionally." Actions: link to `/find-the-right-care`, and Call via `ContactActions` (call only is acceptable as the secondary if both buttons would duplicate; spec asks primary Find the Right Care and secondary Call).
2. Three pathways: For a parent or relative, For myself, After hospital or surgery. All three link to `/find-the-right-care` with a hash or query (`?for=parent|myself|after-hospital`) that only preselects nothing clinical — Find the Right Care may read it to set the initial `whoFor` / `helpType` display, not to diagnose.
3. Oracle teaser: `Section` tone `night`. Link to `/oracle` and `EnquiryButton kind="oracle-visit"`.
4. Residence cards from `RESIDENCES_QUERY`, including The Grove and Oracle (`residencePath`).
5. Five care cards from `CARE_SERVICES_QUERY`.
6. Silver Roots teaser linking to `/silver-roots`. Copy must not say the marketplace, payments, or accounts are live. If the offering status `isFuture`, show `StatusBadge`.
7. Two secondary cards: Destination Retirement and SAGE, each linking to its path, with status badges when not operating.
8. Short trust line from the home page intro, an `EnquiryButton kind="general"`, then the footer is already in the layout — do not render a second footer.

View props are plain data (`residences`, `careServices`, `offerings`, `home` page fields, `contact`). Test: the eight regions render in order; the first link named like Find the Right Care appears before the Oracle heading; Oracle card href is `/oracle`; Grove card shows Coming soon when status is `coming-soon`.

### Task 24 — Find the Right Care

`PAGE_QUERY` slug `find-the-right-care`. `PageHero` plus the reassurance from `intro`. Inline `<EnquiryForm kind="find-care" context="Find the Right Care" />`. Visible sentence that this is not a medical assessment (the form intro already says it; the page test asserts the sentence is present). `ContactActions` as the alternative. Privacy link is inside the form. No multi-step wizard.

### Task 25 — Our Homes hub

`/homes`. Intro from the `homes` page. A client `HomeFilter` that filters the card list by location text, care-type slug, and status. Filtering is client-side on the cards already rendered (the list is six items). No results message when the filter matches nothing. "Which home may suit you?" is a short paragraph plus a link to `/find-the-right-care`. `ContactActions`. Grove keeps its status badge via `ResidenceCard`.

### Task 26 — Residence template and The Grove

`/homes/[slug]`. `generateStaticParams` from `RESIDENCE_SLUGS` excluding `oracle`. In the page, if `slug === 'oracle'`, `redirect('/oracle')`. Also add `next.config.ts` redirect `/homes/oracle` → `/oracle` permanent.

Shared `ResidenceView`. When `isFuture(status)`, render hero, status badge, `comingSoonNote`, and `<EnquiryForm kind="grove-interest" />` only — hide rooms, care, gallery, team, and map. Otherwise render the spec §8.4 sections in order: hero, who it suits (`audienceFit`), atmosphere, rooms and shared spaces, `CapabilityList` for care and for everyday life, gallery, team (name, role, credentials; no image without alt), `StaticMap`, FAQs, `EnquiryButton` for `formKind`, `ContactActions`.

Test the future branch and the operating branch with fixtures. One H1.

### Task 27 — Oracle

`/oracle` uses `RESIDENCE_QUERY` for slug `oracle`, not the ecosystem type. `PageHero` tone `night`. Sections from the residence fields, in the spec §8.5 order: positioning, ten rooms (names come from CMS `rooms[].name`; the seed may contain Jade, Onyx, Ruby, Ivory, Coral, Pearl, Amber, Sapphire, Opal, Emerald — the view just lists `rooms`), shared spaces, daily life, everyday support, optional services (capabilities whose provision is not direct get a visible "arranged separately" line — use the `provision` field already on `capability`), independence paragraph, map, and `EnquiryForm kind="oracle-visit"` twice (after the intro and at the end). Do not claim a regulatory phrase beyond the CMS intro. If status is future, show the badge and do not describe it as open.

### Task 28 — Living & Care hub and detail

Hub `/living-and-care`: five `CareServiceCard`s first, then `SectionList` for the everyday topics (meals, housekeeping, and the rest) from the page document, then a "not the right fit" block linking to `/silver-roots` and `/find-the-right-care`. No outcome claims in the component; it only renders CMS text.

Detail `/living-and-care/[slug]` from `CARE_SERVICE_SLUGS`. Who it suits, duration, included, direct vs partner (`CapabilityList`), participating residences (the query already resolves references), enquiry process paragraph, FAQs, `ContactActions` and `EnquiryButton`. `serviceJsonLd` only when operating. Breadcrumbs: Home / Living & Care / name.

### Task 29 — Ecosystem pages

One `EcosystemView` used by `/silver-roots`, `/destination-retirement`, `/sage`. Data from `OFFERING_QUERY`. SAGE hero tone `night`; the other two `ivory`. Render approved capabilities and planned capabilities as separate lists; planned and in-development items always show `StatusBadge`. Silver Roots includes `EnquiryForm kind="silver-roots-partner"` plus a general enquiry button. Destination Retirement includes `EnquiryForm kind="destination-retirement"`. SAGE has no enquiry fields beyond `EnquiryButton kind="general"` and must not render dashboards, voice UI, or "available now" for a capability that is not operating.

The view must not invent a how-it-works stepper if the CMS steps are empty. If `steps` exist on the offering (Task 8 schema), render them with `StepList`.

### Task 30 — Our Story, Contact, legal, not-found

- `/our-story`: `PageHero`, `PortableText` body, milestones only if present on the page sections. Founding year comes from site settings and is omitted when null (`Footer` already does this). One optional quote band, tone `green`, only if a section has that tone.
- `/contact`: phone, WhatsApp, email, hours, response time, head office via `formatAddress`, residence addresses from `RESIDENCES_QUERY` (name, `formatAddress`, directions link already inside `StaticMap` or a `Button` to the maps URL helper in `src/lib/maps.ts`), emergency notice only when the CMS field is non-empty, inline `EnquiryForm kind="general"`.
- `/privacy`, `/terms`, `/accessibility`: one route `src/app/(site)/[legalSlug]/page.tsx` that `notFound()`s unless `slug` is in `LEGAL_SLUGS`. `PAGE_QUERY`. `noIndex` is already honoured by `pageMetadata`.
- `not-found.tsx` and `error.tsx` under `(site)`. Error offers Call and WhatsApp using chrome contact if available, otherwise plain links are not possible in an error boundary that cannot fetch — pass a static fallback tel/WhatsApp only from public env, or render a link to `/contact`. Prefer a link to `/contact` plus the sentence "Please call or WhatsApp us" so a broken page does not need secrets. No stack traces.

### Task 31 — Per-page WhatsApp context

The header and mobile bar currently pass the context `"Village 60 Plus"` for every page. Spec wants page-specific prefilled text. Add `contextForPath(pathname: string): string` in `src/lib/routes.ts` with a test. Examples: `/` → `Village 60 Plus`, `/oracle` → `Oracle`, `/homes/serenity` → `Serenity`, `/homes/the-grove` → `The Grove`, `/living-and-care/respite-care` → `Respite care`, `/silver-roots` → `Silver Roots`. Unknown paths → `Village 60 Plus`.

Make `MobileActionBar` accept no context prop and call `usePathname()` itself (it becomes a client component), or add a tiny client wrapper used by the layout. Header WhatsApp link likewise. Do not change Call. Do not put the visitor's typed message in the prefill (`whatsappHref` already uses `whatsappMessage(context)`).

---

## Phase 5, after the pages

Do not start Phase 5 in the same write as Task 23.

- **Security headers** in `next.config.ts` `headers()`: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN` (Studio is same-origin), `Permissions-Policy` disabling camera, microphone, geolocation. A nonce CSP forces dynamic rendering and fights static pages, so do **not** add `proxy.ts` nonce CSP. Use a static `Content-Security-Policy` that allows `'self'`, `https://cdn.sanity.io` images, `https://maps.googleapis.com` images, and GA hosts only if `NEXT_PUBLIC_GA_ID` is part of the build. Document the policy in a comment. `images.remotePatterns` for `cdn.sanity.io` only.
- **Analytics:** `src/components/analytics/Analytics.tsx`. Mount `GoogleAnalytics` from `@next/third-parties/google` only when `getPublicEnv().gaId` is set **and** a `v60-consent=accepted` cookie is present. A short consent banner (Accept / Reject) sets that cookie; Reject leaves GA unloaded. Click listener on `[data-track]` sends `sendGAEvent` with the attribute value only (`call_click`, `whatsapp_click`, `enquiry_open`, `enquiry_submit`, `directions_click`, `form_error`). Never send field values. `ContactActions` already sets `data-track` on Call and WhatsApp.
- **Placeholder report:** `scripts/placeholder-report.ts` queries `mediaImage` where `placeholder == true` and writes `reports/placeholders.md` with source, license, and replacement deadline. `npm run report:placeholders`.
- **Playwright:** extend `e2e/` with home section order, one axe scan (`@axe-core/playwright`, tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`) on `/` and `/contact`, keyboard to the enquiry dialog, and reduced-motion not starting a video (assert no `video[autoplay]` after load). These tests need the dev server and will fail without CMS content unless the views render their empty states with a real H1. Prefer asserting structure that exists without Sanity (header, skip link, main, footer) plus one seeded-content test skipped when `NEXT_PUBLIC_SANITY_PROJECT_ID` is the test placeholder.
- **CI:** `.github/workflows/ci.yml` runs `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. E2E is a separate job that may need Sanity secrets; if secrets are absent, run only the smoke spec against the empty states. No Lighthouse budget gate in CI until a production URL exists; add `lighthouserc.json` with the spec numbers (LCP 2.5s, CLS 0.1) as the local command `npx lhci autorun`, not a required check.
- **README:** how to create the Sanity project (Task 6 step 1), env vars from `.env.example`, `npm run seed`, preview URL `/api/draft-mode/enable?secret=&slug=`, and the spec §20 list as a launch checklist. Do not invent confirmed facts (founding year, phone, addresses).

After Phase 5, do the writing-plans self-review: every spec section mapped to a task, no placeholder phrases, and type names consistent (`EnquiryState`, `FormKind`, `residencePath`, `SITE_SETTINGS_QUERY`, `fetchPublished`). Then the execution-handoff paragraph from the skill.

---

## Corrections the implementer should apply when they reach the code

These were applied in the plan. Do not treat them as unfixed work.

- Colombo date and request host are in Task 20.
- `getSiteChrome` uses `toSiteContact` / `formatAddress` in Task 22.
- `submitEnquiry` uses `fetchPublished`.
- Form ids are unique per instance, and the success state lists `summaryLines`.
- `FaqList` uses `useId` and stays a server component. That is valid in React 19. Do not add `'use client'`.
- `recipientsFor` in `src/lib/site-settings.ts` and the copy in `process.ts` are the same rule. The implementer must not add a third.

---

## Spec points that must not be weakened while writing pages

English only. No prices. No "best", rankings, or guaranteed outcomes. No chatbot, slider, parallax, or autoplay audio. Call and WhatsApp on every page (layout already does this; pages add contextual ones). The Grove is coming soon with one interest action. Future Silver Roots, SAGE, and Destination Retirement capabilities stay labelled. WCAG 2.2 AA, 44px targets, one H1, `lang="en-LK"` already on `<html>`. Hero video stays behind `VideoHero`'s reduced-motion behaviour. Maps stay static until activated.
