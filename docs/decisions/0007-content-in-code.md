# 0007 — Content lives in typed files, not a CMS

- Date: 2026-11-21
- Status: accepted
- Supersedes: 0005 (content driver and CV fallback)

## Context

Sanity was specified as the content source, but no project ID, dataset or write token
was ever supplied. The seed had never run, and every build came from
`src/content/cv.ts`. The owner edits code directly and asked whether one file per
project is enough. For four projects and one editor, a CMS adds accounts, schema
deployment, a second runtime and an editing UI without removing any work.

## Decision

- **Typed files are the source of truth.** `src/content/types.ts` defines the schema;
  `src/content/cv.ts` holds everything except projects; each project lives in
  `src/content/projects/<slug>.ts`.
- **The driver stays.** `src/content/content.ts` exposes `getContent`, `getProjects`,
  `getProject` and `getProjectSlugs`. Routes and prerender do not know where the data
  comes from, so a CMS can be reintroduced by changing this file alone.
- **Sanity is removed.** `@sanity/client`, `studio/`, `scripts/seed.ts`, the `seed`
  script and the Sanity environment variables are deleted. The UI never had a Sanity
  dependency.
- **Build guards stay.** Zero projects or duplicate slugs fail the build.
- **Images are files.** A project may set `cover: { src, alt }` pointing at
  `public/projects/<slug>/`; without one the case study shows its marked placeholder.

## Consequences

- Publishing a content change means editing a file, running `pnpm typecheck`, and
  pushing. Vercel deploys on push.
- There is no browser editor, image upload UI, draft preview or scheduled publishing.
  That is acceptable for a solo portfolio; a blog or multiple editors would justify a
  CMS again.
- `AGENTS.md` rule 6 now points at `src/content/`. Decision 0005 remains in the record
  as history; its Sanity path is no longer implemented.
