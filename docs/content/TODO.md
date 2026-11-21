# Content TODO

Every placeholder currently on the site. Source of facts: `docs/content/cv-data.md`.
Clear an item by supplying copy/asset, updating the file under `src/content/`, and
removing the line here.

## Projects

- [ ] **Summaries** — all four projects show `[TODO: one-line project summary]`.
  `vibeshift`, `slidel`, `silmarillion-rag`, `clustering-demand-forecasting`.
- [ ] **Problem** — one per project; the CV has no problem framing.
- [ ] **Architecture** — one per project; the CV describes pipelines in bullets but not
  the architecture as a section.
- [ ] **Results** — one per project; the CV has no metrics, benchmarks or outcomes.
- [ ] **What I learned** — one per project; not in the CV.
- [ ] **Project images** — add `public/projects/<slug>/cover.webp` and set
  `cover: { src, alt }` in `src/content/projects/<slug>.ts`. Until then the case
  study shows a `[TODO: project image]` frame.
- [ ] **Silmarillion repository URL** — the CV flags it: "verify spelling of this URL".
  Currently `github.com/dhanujanarada/similarionRAG`.

## Media and documents

- [ ] **Portrait** for `/about` (currently a `[TODO: portrait]` frame). Drop the file in
  `public/` and set `about.portrait = { url, alt }` in `src/content/cv.ts`.
- [ ] **CV PDF** — place at `public/cv/dhanuja-narada-uduravana-cv.pdf` and set
  `settings.cvFile` in `src/content/cv.ts`. CV links are hidden until then.

## Data gaps in the CV

- [ ] **Award years** — Codesprint 8.0, Codesprint 7.0 and IEEEXtreme have no year in
  the source. No year is displayed rather than guessing.
- [ ] **Habl project** — Codesprint 7.0 mentions “habl”, which is not in the CV's
  project list. It is currently an award note only.

## Infrastructure

- [ ] **Deployment** — GitHub remote and Vercel project are not connected yet. See
  `docs/DEPLOY.md`.
- [ ] **SITE_URL** — only needed for a custom domain. On Vercel the build falls back to
  `VERCEL_PROJECT_PRODUCTION_URL` and writes `sitemap.xml` and `robots.txt`.

## Motion gaps (code, not content)

- [ ] **`/projects` index hover** — cards are DOM; the shader plane hover exists only on
  the home journey where sections are aligned with the canvas.
