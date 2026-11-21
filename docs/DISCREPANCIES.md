# Discrepancies

Temporary gaps between the documented plan and the code. Remove an entry when it
is closed; record lasting decisions in `decisions/` instead.

## 2026-11-21 — `/project/:slug` is not prerendered

`react-router.config.ts` prerenders only `/`. React Router can prerender concrete
URLs, not dynamic patterns, so `/project/<slug>` currently falls through to the SPA
fallback (`build/client/__spa-fallback.html`) and hydrates client-side. The slug
list will be enumerated from Sanity once content exists; see decision 0001.

## 2026-11-21 — placeholder copy and a draft content spec

`src/routes/home.tsx` (six sections) and `src/routes/project.tsx` contain
hard-coded placeholder text. Rule 6 (all copy from Sanity) applies from the
content phase onward. `docs/specs/content-model.md` is still unapproved and
unimplemented.

## 2026-11-21 — hover cover and accent are procedural

`ProjectHover` paints its own cover (`makeCover`) and uses three hard-coded
accents. Sanity's `cover`, `accent`, and project order have not been wired, so
the hover does not yet reflect real projects.

## 2026-11-21 — hover has no affordance, and low tier removes it

The cover plane lives in the empty corner opposite the paper and is discoverable
only by moving the cursor there. There is no label or cursor change until the
pointer is already over it. On the low quality tier the plane is not rendered at
all, with no CSS fallback — so a slow device loses the feature rather than
getting a cheaper version.

## 2026-11-21 — smoke is distance-faded, not depth-faded

`Smoke.tsx` fades billboards by camera distance and radial mask. True soft
particles need the scene depth buffer, which the postprocessing composer does not
expose to a custom material. This is a deliberate substitution, not a completed
soft-particle implementation.

## 2026-11-21 — frame time and visuals are unverified

No browser exists in this environment. `QualityMonitor` measures a 1.5 s frame
sample after a 0.5 s warm-up and the overlay prints it, but no tier has been
measured on real hardware. Every visual claim in this phase is code-level only;
the katana draw, paper tear, smoke, hover and wisp still need a human look.

## 2026-11-21 — routes read the CV file, not Sanity

No Sanity project ID or token exists, so `src/cms/content.ts` falls back to
`src/content/cv.ts` and the seed has never run. The build succeeds and every route
prerenders from the CV file. Decision 0005 records this; it must be closed by setting
the env vars and running the seed before deploy.

## 2026-11-21 — index hover is not wired

“Read the case study” now fires the project's `transitionPreset` strike and navigates at
its midpoint; keyboard activation and reduced motion use the plain link. `/projects`
still renders DOM cards — the shader cover plane exists only on the home journey.

## 2026-11-21 — seed script exists but has never run

`scripts/seed.ts` is idempotent and writes fixed IDs, but there is no project ID or write
token, so it cannot be verified. The CV driver remains the build-time source.

## 2026-11-21 — sitemap and robots need SITE_URL

The Vite plugin skips `sitemap.xml` and `robots.txt` when `SITE_URL` is absent rather
than inventing a domain. Prerendered HTML, per-page titles and JSON-LD are present.

## 2026-11-21 — the 404 wildcard is not prerendered

A `*` route has no concrete URL, so React Router cannot emit HTML for it. Unknown paths
are served `__spa-fallback.html` and the 404 component hydrates. A static `/404` could be
prerendered as a linkable page, but it would not change what an unknown URL returns.

## 2026-11-21 — back-scroll restoration is delegated

Browser Back relies on React Router's `ScrollRestoration`, not a custom
`history.state` save. It has not been verified with Lenis in a browser; a second history
mechanism would fight the router.

## 2026-11-21 — section metadata is declared three times

`CaseSection` values appear in `src/content/cv.ts`, the `project` schema's section list,
and `SECTION_ORDER`/`SECTION_LABELS` in `projects.$slug.tsx`. Adding a section touches
three files. Deliberately deferred to the architecture pass rather than half-fixed.

## 2026-11-21 — interface labels stay in code

Route copy that comes from the CV now flows through the content driver: the hero
headline, the hero summary, project titles, periods, awards, skills, education and
leadership. Labels that exist only to run the interface — “Keep scrolling”, “The long
way here”, “Let's talk”, nav and button text — remain in JSX. They are not CV claims and
adding singleton fields for each would bloat the schema. If the owner wants them
editable, they become `siteSettings` fields and the seed grows with them.

## 2026-11-21 — fixed in the review pass

Ambient routes now show the animated sword through a translucent page surface; presets
produce different strikes, driven by one GSAP tween; focus-visible rings and a skip link
exist; the mobile menu traps Tab and returns focus to its trigger; hidden CTAs leave the
tab order; OG tags are emitted on every page; JSON-LD is limited to `/` and `/about`
without email, and prerender's trailing-slash paths no longer suppress it; an empty
project set fails the build; CV location and the Toastmasters committee note are present;
the Sanity queries now fetch `cvFile` and the portrait, so both resolve when configured.
