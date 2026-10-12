# Sanity + Next.js (App Router) reference

**As of:** 12 October 2026  
**Verified:** `npm view` in `%TEMP%`; `npx sanity@latest init --help` (sanity **6.18.0**)

---

## 1. Package versions

| Package | Version |
|---------|---------|
| `sanity` | 6.18.0 |
| `next-sanity` | 13.3.4 |
| `@sanity/client` | 8.9.0 |
| `@sanity/image-url` | 2.1.1 |
| `@sanity/vision` | 6.18.0 |
| `groq` | 6.18.0 |
| `@sanity/types` | 6.18.0 |
| `styled-components` | 6.5.3 |
| `@portabletext/react` | 8.0.1 |
| `sanity-plugin-workflow` | 3.0.48 |

**Peers:** `sanity` requires `styled-components` ^6.1.15, React ^19.2.2. `next-sanity` requires `sanity` ^5.29 \|\| ^6.0, `next` ^16.0.0-0, `@sanity/client` ^7.26.2 \|\| ^8.0, `styled-components` ^6.1.

---

## 2. Embedded Studio

Docs: [Embedding Sanity Studio in Next.js](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs)

### `sanity.config.ts`

```typescript
'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
})
```

### `sanity.cli.ts`

```typescript
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  },
  schemaExtraction: { enabled: true },
  typegen: {
    path: './src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: './sanity.types.ts',
    overloadClientMethods: true,
  },
})
```

### Studio route

```typescript
// src/app/(studio)/studio/[[...tool]]/page.tsx
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

### `sanity init` (non-interactive)

From `npx sanity@latest init --help` (sanity 6.18.0):

- `-y`, `--yes` — unattended
- `--project=<id>`, `--dataset=<name>`, `--dataset-default`
- `--env=<filename>` — write env vars (mutually exclusive with `--dashboard`)
- `--output-path`, `--overwrite-files`, `--install`, `--template`, `--typescript`, `--bare`
- `--organization=<id>` — required for unattended **new** project
- Next.js: `--[no-]nextjs-add-config-files`, `--[no-]nextjs-append-env`, `--[no-]nextjs-embed-studio`

Example:

```shell
npx sanity@latest init -y --project YOUR_ID --dataset production --nextjs-add-config-files --nextjs-embed-studio --nextjs-append-env --env .env.local
```

---

## 3. Schema patterns

Imports: `defineType`, `defineField`, `defineArrayMember` from `sanity`.

- **Slug:** `type: 'slug'`, `options: { source: 'name' }` (or `'title'`)
- **Reference / array of references:** `type: 'reference'`, `to: [{ type: '...' }]`
- **Status list:** `type: 'string'`, `options: { list: [...] }`
- **Image + hotspot + alt:** `options: { hotspot: true }`, nested `fields` for alt/caption
- **Reusable object:** `defineType({ type: 'object', name: 'seo', fields: [...] })`
- **Singleton (Studio ≥ 6.17):** `document: { singletons: ['siteSettings'] }`, structure `S.listItem().singleton('siteSettings')`
- **Legacy singleton pane:** `S.document().schemaType('siteSettings').documentId('siteSettings')`
- **Geopoint:** `type: 'geopoint'`
- **Validation:** `validation: (Rule) => Rule.required().max(80)`

---

## 4. Data fetching (recommended)

[Visual Editing with Next.js App Router](https://www.sanity.io/docs/nextjs/visual-editing-with-next-js-app-router)

```typescript
// client.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-02-01',
  useCdn: true,
  stega: { studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL! },
})
```

```typescript
// live.ts
import { defineLive } from 'next-sanity/live'
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: '2026-02-01' }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
})
```

- **`defineQuery`** from `next-sanity` (or `groq`) for TypeGen.
- **`perspective: 'drafts'`** (not `previewDrafts`, deprecated). Drafts need `useCdn: false` + token.
- **Draft enable:** `defineEnableDraftMode` from `next-sanity/draft-mode`
- **Layout:** `<SanityLive />` always on content routes; `<VisualEditing />` when `draftMode().isEnabled`
- **Env:** `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (server only)

Alternative without Live API: wrap `client.fetch` with `next: { revalidate, tags }` and manual perspective (see visual editing doc “without Live Content API”).

---

## 5. TypeGen

```shell
npx sanity schema extract
npx sanity typegen generate
npx sanity typegen generate --watch
```

Configure in `sanity.cli.ts` (`sanity-typegen.json` deprecated). Named `defineQuery` / `groq` variables are typed after generate; include `sanity.types.ts` in `tsconfig` `include`.

---

## 6. `@sanity/image-url` v2

```typescript
import { createImageUrlBuilder } from '@sanity/image-url'

const builder = createImageUrlBuilder(client)
builder.image(source).width(1200).height(800).fit('crop').auto('format').url()
```

v1 default export `imageUrlBuilder` → v2 `createImageUrlBuilder`. Hotspot needs full image object + width/height.

---

## 7. Workflow

- No built-in multi-state publish workflow; use `reviewStatus` field + validation and/or custom document actions (`publish.disabled`, `useDocumentOperation`).
- **`sanity-plugin-workflow`** 3.x — maintained; Studio-only state machine; does not replace draft/publish.
- **`@sanity/workflow-*`** — pre-1.0, separate product direction.

---

## 8. Roles (Free vs Growth)

| Plan | Roles |
|------|--------|
| Free | Administrator, Viewer (2 roles; 20 seats) |
| Growth | + Editor, Developer, Contributor (5 roles; Viewer seats free) |
| Enterprise | Custom roles, user attributes |

Custom roles: Enterprise only.
