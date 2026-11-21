# Discrepancies

Temporary gaps between the documented plan and the code. Remove an entry when it
is closed; record lasting decisions in `decisions/` instead.

## 2026-11-21 — `/project/:slug` redirects but is not prerendered

`react-router.config.ts` prerenders concrete URLs only. The legacy route uses a
`clientLoader` that 301-redirects to `/projects/:slug`, so it is deliberately not an
HTML page and falls through to the SPA fallback. There is no SEO value in prerendering
a redirect.

## 2026-11-21 — shader hover uses procedural covers

`ProjectHover` paints its own cover (`makeCover`) and keeps a parallel accent list.
Project `accent` values exist in the content driver, but the scene does not read them;
a fifth project would fall back to the first accent. Proposal 3 in the architecture
pass would feed the scene from project data.

## 2026-11-21 — the hover plane is supplementary

The corner shader plane is discoverable only by moving the cursor into it, and the low
tier removes it. It is now optional decoration: every project slab is itself a link, so
the same destination is reachable by clicking the paper, the keyboard or the projects
index.

## 2026-11-21 — smoke is distance-faded, not depth-faded

`Smoke.tsx` fades billboards by camera distance and radial mask. True soft
particles need the scene depth buffer, which the postprocessing composer does not
expose to a custom material. This is a deliberate substitution, not a completed
soft-particle implementation.

## 2026-11-21 — frame time and visuals are unverified

No browser exists in this environment. `QualityMonitor` measures a 1.5 s frame
sample after a 0.5 s warm-up and the overlay prints it, but no tier has been
measured on real hardware. Every visual claim is code-level only; the katana draw,
smoke, parchment edges, text fit, kinetic reveals and fog still need a human look.

## 2026-11-21 — routes read the CV file, not Sanity

No Sanity project ID or token exists, so `src/cms/content.ts` falls back to
`src/content/cv.ts` and the seed has never run. The build succeeds and every route
prerenders from the CV file. Decision 0005 records this; it must be closed by setting
the env vars and running the seed before deploy.

## 2026-11-21 — the shader cover stays home-only

`/projects` renders parchment cards with no shader plane; the plane exists only on the
home journey where sections align with the canvas. Both routes use the same content and
the same card affordance.

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

Route copy that comes from the CV flows through the content driver: the hero headline,
hero summary, project titles, periods, awards, skills, education and leadership. Labels
that exist only to run the interface — “Descend”, “The long way here”, “Let's talk”,
nav text and button text — remain in JSX. They are not CV claims and adding singleton
fields for each would bloat the schema. Decision 0006 records the visual language; if
the owner wants these labels editable, they become `siteSettings` fields.

## 2026-11-21 — fixed in the review pass

Ambient routes now show the animated sword through a translucent page surface; presets
produce different strikes, driven by one GSAP tween; focus-visible rings and a skip link
exist; the mobile menu traps Tab and returns focus to its trigger; hidden CTAs leave the
tab order; OG tags are emitted on every page; JSON-LD is limited to `/` and `/about`
without email, and prerender's trailing-slash paths no longer suppress it; an empty
project set fails the build; CV location and the Toastmasters committee note are present;
the Sanity queries now fetch `cvFile` and the portrait, so both resolve when configured.
