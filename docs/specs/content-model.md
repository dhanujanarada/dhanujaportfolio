# Spec — Content model and content access

- Status: draft, awaiting approval
- Phase: content
- Supersedes: nothing. Follows decision 0001.

## Goal

Sanity owns every word and image. The frontend reads it through typed GROQ
queries, and prerendered HTML contains real content at build time. No visuals
and no scene work in this phase.

## Decisions taken in the interview

1. `summary` is 1–2 sentences of plaque copy. `body` is the long-form case study.
   `role` is free text (soft cap 60). `stack` is plain strings, not a shared tech
   document.
2. Media is images only. `alt` is required wherever an image appears. No video
   pipeline yet.
3. About is a section of the home scroll, not a route. The persistent Canvas is
   never disturbed and there is one animated surface.
4. `transitionPreset` is editor-chosen, optional, and describes the transition
   **into** that project. Empty falls back to `order % 4` over the published,
   ordered project list. The fallback lives in one function, not in the scene.
5. `siteSettings` holds `title`, `description`, `socials[]`, `defaultOgImage`.
   A build with no project ID, or with zero projects, **fails loudly**. Dev shows
   a loading state.

## Schemas (`studio/schemaTypes/`)

### `project` (document)

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | required |
| `slug` | slug from title | required, unique |
| `summary` | text | required, max 200 |
| `role` | string | required, max 60 |
| `year` | number | required, 1990–2100, integer |
| `stack` | array of string | required, min 1 |
| `links` | array of `{ label: string, url: url }` | optional |
| `cover` | image, hotspot | required, `alt` required |
| `gallery` | array of `{ image, alt, caption? }` | optional |
| `accent` | string | required, `#rrggbb` regex |
| `order` | number | required, integer, drives sequence |
| `body` | portable text (block) | required |
| `transitionPreset` | string, list `slash`/`thrust`/`sweep`/`spiral` | optional |

### `about` (singleton, `_id: "about"`)

`headline` (string, required), `bio` (portable text, required), `timeline[]`
(`year`, `title`, `detail`), `skills[]` (`group`, `items[]`), `portrait`
(image, `alt` required).

### `siteSettings` (singleton, `_id: "siteSettings"`)

`title`, `description`, `socials[]` (`label`, `url`), `defaultOgImage`
(image, `alt` required).

Singletons are pinned in `structureTool` so they cannot be duplicated.

## Content access (`src/cms/`)

- `client.ts` — `createClient` from `@sanity/client`, pinned `apiVersion`,
  `useCdn: true`, `perspective: "published"`. Reads `VITE_SANITY_PROJECT_ID` and
  `VITE_SANITY_DATASET`; no token, ever.
- `queries.ts` — GROQ constants for: ordered projects, project by slug, about,
  site settings. One projection per query, no `*[_type == "project"]` leaking
  unprojected documents.
- `types.ts` — hand-written types mirroring those projections. Sanity codegen is
  a later improvement, not this phase.
- `queryClient.ts` — one module-level `QueryClient`. Public read-only data, so a
  shared cache is safe and lets the build and the browser share one code path.
- `hooks.ts` — `useProjects`, `useProject(slug)`, `useAbout`, `useSiteSettings`,
  each `useQuery` over the matching fetcher, with query keys in one place.

## Build-time content

- Home and project routes export `loader`s that `ensureQueryData` the same
  queries the hooks use. During prerender React Router runs those loaders, so the
  emitted HTML carries real copy rather than a loading state.
- Components pass loader data as `initialData` so hydration does not refetch.
- `react-router.config.ts` becomes an async `prerender({ getStaticPaths })`:
  `getStaticPaths()` plus `/project/<slug>` for every published slug, fetched with
  a Node-side Sanity client that reads `process.env` (not `import.meta.env`).
- Missing env vars or zero projects throw during config evaluation. A build must
  never ship an empty homepage.

This closes the `/project/:slug` gap recorded in `docs/DISCREPANCIES.md`.

## Seeding

`studio/scripts/seed.ts`, run as `pnpm --dir studio seed`, idempotent via fixed
`_id`s: three projects with distinct `order`, `accent`, and `transitionPreset`,
plus `about` and `siteSettings`. It uses `SANITY_API_WRITE_TOKEN`, which lives
only in `studio/.env` and never reaches the frontend.

## Environment

`.env.example` gains `SANITY_API_WRITE_TOKEN` for the studio seed script only.
Frontend variables stay `VITE_`-prefixed and read-only. No `.env` is committed.

## Acceptance criteria

- `pnpm typecheck` and `pnpm --dir studio typecheck` pass.
- `pnpm build` with valid env emits `index.html`, one HTML file per seeded slug,
  and `__spa-fallback.html`; the HTML contains the seeded project titles.
- `pnpm build` without `VITE_SANITY_PROJECT_ID` fails with a message naming the
  missing variable.
- Studio schemas load in `pnpm --dir studio dev` (requires credentials).

## Deviations to note

- The "warn when consecutive projects share a preset" idea cannot be done with
  schema validation, which sees one document. It becomes a build-time warning
  from the resolver instead.
- The fallback resolver is data-layer code; the scene consumes it later.

## Out of scope

Scene, sword, typography, image URL rendering (`@sanity/image-url` would be a new
dependency and needs approval), Sanity typegen, and any Studio theming.

## Blocking dependency

Seeding, the Studio check, and the real-content prerender all need a Sanity
project ID, a dataset, and a write token. Without them I can build and typecheck
the code against mocks, but I cannot claim the acceptance criteria are met.
