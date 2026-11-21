# 0001 — Project scaffold

- Date: 2026-11-21
- Status: accepted

## Context

Greenfield portfolio site. AGENTS.md fixes the stack and requires static hosting
with working link previews, one persistent WebGL canvas, and Sanity as the only
content source.

## Decision

- **React Router 8 framework mode**, not a hand-rolled Vite SPA. It is the only
  supported way to get build-time prerendering from React Router.
- `ssr: false` + `prerender: ["/"]`: static output, no runtime server. React Router
  also emits `build/client/__spa-fallback.html` for paths that are not prerendered.
- `appDirectory: "src"` so the layout matches AGENTS.md instead of RR's default `app/`.
- **Routes are declared in `src/routes.ts`** with the `index`/`route` helpers, so
  route paths and file locations are readable in one place.
- **pnpm via corepack** (`packageManager: pnpm@12.21.0`). pnpm 12 writes
  `pnpm-workspace.yaml` for its release-age policy; that file is committed.
- **Sanity Studio is an independent package in `studio/`**, not a pnpm workspace
  member, so its React/Sanity versions cannot constrain the frontend's.
- Dependency versions are pinned to what npm resolved on 2026-11-21. Notable newer
  majors than prior experience: React Router 8, Vite 8, TypeScript 7, Sanity 6.
  Code must be checked against installed types before use.

## Consequences

- `/project/:slug` cannot be prerendered until real slugs exist; it is served from
  the SPA fallback until the content phase adds Sanity-driven path enumeration.
- Deployments must map unknown paths to `__spa-fallback.html` (`_redirects` or host
  equivalent), since `/` is prerendered.
- Prerendered HTML is React Markup from a client-only render pass; anything that
  needs `window` at module scope will break the build.
