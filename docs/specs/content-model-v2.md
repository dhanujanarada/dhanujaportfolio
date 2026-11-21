# Content model v2

- Status: draft, awaiting approval
- Date: 2026-11-21
- Replaces: the unapproved draft in `docs/specs/content-model.md`
- Source of truth: `docs/content/data.md` (CV), plus owner-supplied media

## Principles

- The CV is the only factual source. Schema fields that the CV cannot fill are seeded
  with `[TODO: …]`, never with plausible text.
- No `phone` field exists anywhere. Privacy is enforced by omission.
- Documents are separate types, not arrays inside singletons, so each CV section can be
  queried, ordered and prerendered independently.
- Fixed document IDs make seeding idempotent (`createOrReplace`).

## Document types

### `project`

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | required |
| `slug` | slug | required, unique, from title |
| `summary` | text | required, 1–2 sentences |
| `period` | string | required, CV format ("Apr 2025 - 2026") |
| `projectType` | string | required ("Undergraduate Dissertation…") |
| `stack` | array of string | required, min 1 |
| `repoUrl` | url | optional (Silmarillion URL needs verification) |
| `awards` | array of reference→`award` | optional |
| `cover` | image + `alt` | optional until media exists |
| `gallery` | array of image + `alt` + caption | optional |
| `accent` | string `#rrggbb` | required, regex validated |
| `order` | number | required, integer, journey order |
| `transitionPreset` | `slash` / `thrust` / `sweep` / `spiral` | optional; fallback `order % 4` |
| `caseStudy` | array of `{ section, body }` | required; see below |

`caseStudy.section` is one of `Problem`, `Approach`, `Architecture`, `Results`,
`What I learned`. `body` is portable text. The frontend renders sections in that fixed
order; missing sections are seeded with a single `[TODO: …]` block.

Dropped from the v1 draft: `role` (the CV uses `projectType`), `year` (replaced by
`period`), `links[]` (replaced by `repoUrl` plus `awards`).

### `experience`

`company` (string, required), `roles[]` of `{ title, start, end, bullets[] }`
(all required; bullets are strings), `order` (number).

### `education`

`institution`, `degree`, `classification`, `start`, `end` (strings), `dissertationTitle`,
`dissertationNote` (optional text), `order`.

### `skillGroup`

`group` (string, required), `items[]` (array of string, min 1), `order` (number).

### `certification`

`title`, `issuer` (required), `note` (optional text), `order`.

### `award`

`title`, `event` (optional), `note` (optional text), `year` (string: the CV mixes a year,
a range, and none), `order`.

### `leadership`

`role`, `organization`, `start`, `end` (strings), `order`.

## Singletons

### `about` (`_id: "about"`)

`headline` (string, required — CV headline), `summary` (text, required), `bio` (portable
text, optional), `portrait` (image + required `alt`, optional until supplied).

Removed from the v1 draft: `timeline[]` and `skills[]` — they are now `experience`,
`education` and `skillGroup` documents. This changes field meaning, so it needs a
decision record before any existing document is migrated.

### `siteSettings` (`_id: "siteSettings"`)

`title`, `description`, `email` (validated email), `linkedin` (url), `github` (url),
`cvFile` (file, optional until the PDF is supplied), `defaultOgImage` (image + alt).

Deliberately absent: `phone`, `socials[]` (explicit fields instead), analytics IDs.

## CV → document mapping (seed)

| CV section | Documents |
| --- | --- |
| Identity | `siteSettings`, `about.headline` |
| Summary | `about.summary` |
| Education | one `education` |
| Experience | one `experience` (HCL) with two roles |
| Projects (4) | four `project` docs, `order` 1–4, slugs from CV |
| Skills (6 groups) | six `skillGroup` docs, CV order |
| Certifications (3) | three `certification` docs |
| Awards (5) | five `award` docs; VibeShift also references Cutting Edge 2026 |
| Leadership (2) | two `leadership` docs |
| Phone | **never seeded, never queried** |

Project case studies: `Approach` and `Architecture` are rewritten from CV bullets;
`Problem`, `Results`, `What I learned` start as `[TODO: …]` unless the owner writes them.
Hero/gallery images are `[TODO: project image]` and no `cover` is set until supplied.

## Queries

- `projects`: ordered by `order`; projection includes slug, title, summary, period,
  projectType, stack, repoUrl, accent, transitionPreset, cover, award titles.
- `projectBySlug`: full `caseStudy`, gallery, awards.
- `about`, `siteSettings`, `experience`, `education`, `skillGroups`, `certifications`,
  `awards`, `leadership`.
- Slug list for prerender comes from `projects` only.

## Seed script

`scripts/seed.ts` (or `studio/scripts/seed.ts` if it needs the Studio's environment):
reads the CV data from a single module, writes fixed `_id`s
(`project.vibeshift`, `experience.hcl`, `education.westminster`, …), and is safe to run
repeatedly. It requires `SANITY_API_WRITE_TOKEN`, which never reaches the frontend.
**Run only after owner approval.**

## Acceptance criteria

- Every CV fact maps to exactly one field or document above.
- No schema has a phone field; no query selects one.
- `pnpm --dir studio typecheck` passes.
- Seed run produces 4 projects, 1 experience, 1 education, 6 skill groups, 3
  certifications, 5 awards, 2 leadership items, 1 about, 1 siteSettings.
- Case-study sections without owner copy contain `[TODO: …]` and appear in
  `docs/content/TODO.md`.
