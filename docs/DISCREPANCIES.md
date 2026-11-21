# Discrepancies

Temporary gaps between the documented plan and the code. Remove an entry when it
is closed; record lasting decisions in `decisions/` instead.

## 2026-11-21 — `/project/:slug` is not prerendered

`react-router.config.ts` prerenders only `/`. React Router can prerender concrete
URLs, not dynamic patterns, so `/project/<slug>` currently falls through to the SPA
fallback (`build/client/__spa-fallback.html`) and hydrates client-side. The slug
list will be enumerated from Sanity once content exists; see decision 0001.

## 2026-11-21 — placeholder copy in routes

`src/routes/home.tsx` (six sections) and `src/routes/project.tsx` contain
hard-coded placeholder text. Rule 6 (all copy from Sanity) applies from the
content phase onward, and the content model spec is still awaiting approval.

## 2026-11-21 — sword is procedural and presets are positional

`src/scene/Sword.tsx` draws a stand-in until `/public/models/sword.glb` exists
(`USE_GLB = false`, ~1.4 units, blade +Y). `SwordRig` maps sections 1–3 to
slash/thrust/sweep by index because presets do not travel through the CMS yet.
The trail colour is fixed, not the project accent. The HDRI streams from drei's
CDN rather than `public/`. Quality tiers are unimplemented; see decision 0003.

## 2026-11-21 — HUD copy uses the tells the design skill flags

The section labels are tracked ALL-CAPS eyebrows with mono micro-copy and
middle-dot separators, which `frontend-design` names as templated defaults. To be
replaced deliberately in the HUD/typography phase, not inherited by accident.
