# Content model v3 — typed content files

- Status: accepted
- Date: 2026-11-21
- Supersedes: `content-model-v2.md` (Sanity)
- Decision: [`../decisions/0007-content-in-code.md`](../decisions/0007-content-in-code.md)
- Source of facts: `docs/content/cv-data.md`

## Principles

- The CV and the owner are the only factual sources. Fields the CV cannot fill contain a
  `[TODO: …]` marker and appear in `docs/content/TODO.md`. No plausible text is invented.
- No phone field exists anywhere. Privacy is enforced by omission.
- Content is typed TypeScript, not a database. `src/content/types.ts` is the schema.
- One project per file under `src/content/projects/`. Everything else lives in
  `src/content/cv.ts`.
- Routes read content only through `src/content/content.ts`.

## Files

```
src/content/
  types.ts                 types for every content entry
  cv.ts                    about, settings, experience, education, skills, awards, leadership
  content.ts               async driver: getContent, getProjects, getProject, getProjectSlugs
  projects/
    helpers.ts             caseSections(approach)
    vibeshift.ts
    slidel.ts
    silmarillion-rag.ts
    clustering-demand-forecasting.ts
    index.ts               ordered array
```

## Types

### `Project`

| Field | Type | Rule |
| --- | --- | --- |
| `id` | string | stable, e.g. `project.vibeshift` |
| `title` | string | from the CV |
| `slug` | string | unique; duplicate slugs fail the build |
| `summary` | string | `[TODO]` until supplied |
| `period` | string | CV format |
| `projectType` | string | from the CV |
| `stack` | string[] | from the CV |
| `repoUrl` | string? | optional; Silmarillion URL is unverified |
| `awards` | `ProjectAward[]` | embedded objects |
| `accent` | string | `#rrggbb`, used by the card and scene |
| `order` | number | journey order |
| `transitionPreset` | `slash` / `thrust` / `sweep` / `spiral` | strike before navigation |
| `caseStudy` | `CaseBlock[]` | five sections |
| `cover` | `{ src, alt }?` | path under `public/projects/<slug>/` |

### Other entries

- `Experience`: `company`, `roles[]` of `{ title, start, end, bullets[] }`, `order`.
- `Education`: `institution`, `degree`, `classification`, `start`, `end`,
  `dissertationTitle`, `dissertationNote?`, `order`.
- `SkillGroup`: `group`, `items[]`, `order`.
- `Certification`: `title`, `issuer`, `note?`, `order`.
- `Award`: `title`, `event?`, `note?`, `year?`, `order`.
- `Leadership`: `role`, `organization`, `start`, `end`, `note?`, `order`.
- `About`: `headline`, `summary`, `location?`, `bio?`, `portrait?` (`url`, `alt`).
- `SiteSettings`: `title`, `description`, `email`, `linkedin?`, `github?`, `cvFile?`.

## CV → file mapping

| CV section | Location |
| --- | --- |
| Identity | `cv.ts` → `settings`, `about.headline` |
| Summary | `cv.ts` → `about.summary` |
| Education | `cv.ts` → `education[0]` |
| Experience | `cv.ts` → `experience[0]` (HCL, two roles) |
| Projects (4) | one file each under `projects/` |
| Skills (6 groups) | `cv.ts` → `skills` |
| Certifications (3) | `cv.ts` → `certifications` |
| Awards (5) | `cv.ts` → `awards` |
| Leadership (2) | `cv.ts` → `leadership` |
| Phone | never stored, rendered or queried |

## Case studies

`caseSections(approach)` creates the fixed sequence Problem → Approach → Architecture →
Results → What I learned. `Approach` carries the CV bullets verbatim; the other four
start as `[TODO: …]` unless the owner writes them. The CV describes pipelines, not a
sectioned architecture, so no architecture text is inferred.

## Build guards

- `getProjectSlugs()` throws on zero projects or duplicate slugs.
- Prerender enumerates `/`, `/projects`, `/about`, `/experience`, `/credentials`,
  `/contact` and every project slug.
- `sitemap.xml` and `robots.txt` use `SITE_URL` or the Vercel production URL.

## Acceptance criteria

- `pnpm typecheck` and `pnpm build` pass.
- Every CV fact maps to exactly one field or project file.
- No route component contains a content fact; interface labels are the documented
  exception in decision 0006.
- Placeholders contain `[TODO: …]` and match `docs/content/TODO.md`.
- No phone number appears in source or built output.
