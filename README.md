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

## Continuous integration

GitHub Actions CI (Task 36: lint, typecheck, unit tests, build, and Playwright smoke or full e2e when Sanity repository secrets exist) is not in the tree yet. Dependabot and `lighthouserc.json` ship with that task. Until then, run the script block above locally before you push.

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
