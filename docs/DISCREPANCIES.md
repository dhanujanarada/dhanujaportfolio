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
