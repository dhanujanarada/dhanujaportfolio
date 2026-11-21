# 0005 — Content driver, CV fallback, and schema meaning changes

- Date: 2026-11-21
- Status: accepted

## Context

The site now needs every CV fact on real routes, but no Sanity project ID, dataset or
write token exists yet. The approved site spec said a build without Sanity should fail;
that would make the routes unverifiable here and block the owner from reviewing them.

## Decision

- **One content driver** (`src/cms/content.ts`). When `VITE_SANITY_PROJECT_ID` is set it
  reads Sanity; otherwise it returns `src/content/cv.ts`, a verbatim transcription of
  `docs/content/cv-data.md`. The fallback is a build-time source only, never a runtime
  fetch.
- **No invented content.** Fields the CV cannot fill are `[TODO: …]` and are listed in
  `docs/content/TODO.md`. Project summaries, Problem, Architecture, Results and What I
  learned are all placeholders.
- **Slug uniqueness moves out of schema.** Sanity 6 removed `Rule.unique()` from
  `SlugRule`; fixed document IDs in the seed plus a duplicate check in
  `getProjectSlugs()` fail the build instead.
- **`about` drops `timeline[]` and `skills[]`.** They become `experience`, `education`
  and `skillGroup` documents. This changes field meaning; no content exists yet, so there
  is nothing to migrate.
- **Privacy by omission.** No schema, query, seed or page has a phone field. JSON-LD
  carries email and `sameAs` only.

## Consequences

- The current prerendered output carries CV-file copy. Setting the Sanity env vars and
  running the seed switches the source without touching routes, but that switch has not
  been verified.
- `SITE_URL` is required for `sitemap.xml` and `robots.txt`; without it the plugin skips
  both and warns. No domain is invented.
- The fallback is a documented deviation from rule 6 ("all copy from Sanity") and must be
  closed before deploy.
