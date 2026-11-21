# Discrepancies

Temporary gaps between the documented plan and the code. Remove an entry when it
is closed; record lasting decisions in `decisions/` instead.

## 2026-11-21 — `/project/:slug` is not prerendered

`react-router.config.ts` prerenders only `/`. React Router can prerender concrete
URLs, not dynamic patterns, so `/project/<slug>` currently falls through to the SPA
fallback (`build/client/__spa-fallback.html`) and hydrates client-side. The slug
list will be enumerated from Sanity once content exists; see decision 0001.

## 2026-11-21 — placeholder copy in routes

`src/routes/home.tsx` and `src/routes/project.tsx` contain hard-coded placeholder
text so the scaffold can be exercised. Rule 6 (all copy from Sanity) applies from
the content phase onward.

## 2026-11-21 — no scene yet

`src/scene/`, `src/store/`, and `src/components/` are empty. The persistent
`<Canvas>` is deliberately not mounted yet; it belongs to the scene-shell phase.
