# Content TODO

Every placeholder currently on the site. Source of facts: `docs/content/cv-data.md`.
Clear an item by supplying copy/asset, updating Sanity (or the CV driver), and removing
the line here.

## Projects

- [ ] **Summaries** — all four projects show `[TODO: one-line project summary]`.
  `vibeshift`, `slidel`, `silmarillion-rag`, `clustering-demand-forecasting`.
- [ ] **Problem** — one per project; the CV has no problem framing.
- [ ] **Architecture** — one per project; the CV describes pipelines in bullets but not
  the architecture as a section.
- [ ] **Results** — one per project; the CV has no metrics, benchmarks or outcomes.
- [ ] **What I learned** — one per project; not in the CV.
- [ ] **Project images** — hero slot per case study, plus optional galleries.
- [ ] **Silmarillion repository URL** — the CV flags it: "verify spelling of this URL".
  Currently `github.com/dhanujanarada/similarionRAG`.

## Media and documents

- [ ] **Portrait** for `/about` (currently a dashed `[TODO: portrait]` frame).
- [ ] **CV PDF** — place at `public/cv/dhanuja-narada-uduravana-cv.pdf` and point
  `siteSettings.cvFile` at it. CV links are hidden until then.

## Data gaps in the CV

- [ ] **Award years** — Codesprint 8.0, Codesprint 7.0 and IEEEXtreme have no year in
  the source. No year is displayed rather than guessing.
- [ ] **Habl project** — Codesprint 7.0 mentions “habl”, which is not in the CV's
  project list. It is currently an award note only.

## Infrastructure

- [ ] **Sanity project** — no project ID/dataset/write token yet, so the seed script has
  not run and routes read the CV driver (`src/content/cv.ts`).
- [ ] **SITE_URL** — set at build time to emit `sitemap.xml` and `robots.txt` with
  absolute URLs. No domain is invented; both files are skipped without it.
- [ ] **Seed run** — requires owner approval and credentials.

## Motion gaps (code, not content)

- [ ] **Preset strike before navigation** — the “Read the case study” link navigates with
  the route wipe, but the project's `transitionPreset` strike is not played yet.
- [ ] **`/projects` index hover** — cards are DOM; the shader plane hover exists only on
  the home journey where sections are aligned with the canvas.
