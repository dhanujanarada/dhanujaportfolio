# 0002 — Scroll, scene ownership, and render loop

- Date: 2026-11-21
- Status: accepted

## Context

The scene-shell phase needs one persistent WebGL canvas above the SPA route tree,
and scroll must be the single source of truth (AGENTS.md rules 1–3) without
per-frame React renders.

## Decision

- **Canvas in `src/App.tsx`**, as a sibling of `<Outlet />`, mounted once by the
  root route. `src/root.tsx` renders `<App />`. No route can remount it.
- **Vanilla zustand store** (`src/store/scroll.ts`). Nothing subscribes reactively
  on the frame path: `useFrame` and the debug overlay read `getState()`.
- **One ticker.** `gsap.ticker` advances Lenis; `lenis.on("scroll")` calls
  `ScrollTrigger.update()`; ScrollTrigger's `onUpdate` writes the store. GSAP is
  the only animation loop besides the canvas.
- **`frameloop="demand"`.** `InvalidateOnScroll` subscribes to store writes and
  calls `invalidate()`, so rendering costs nothing at rest.
- **Section mapping.** Every section is `h-svh`. Global progress is
  `scrollY / (scrollHeight - innerHeight)`; local progress is
  `(scrollY - top) / height`; the active index is the last section whose top is
  above `scrollY + 50vh`.
- **Reduced motion.** Lenis is never constructed, native scroll drives
  ScrollTrigger, and the scene holds a fixed pose.
- **No pinning or snapping** in this phase.

## Consequences

- R3F renders during prerender; it is SSR-safe here and emits a `<canvas>` into
  `index.html`, verified by the build.
- Each scroll update rebuilds the sections array (5–6 small objects). Accepted as
  negligible; revisit if section count grows by an order of magnitude.
- The root bundle is ~931 kB because three and R3F are imported eagerly by a
  persistent canvas. Only postprocessing can be deferred later; three cannot.
- The dev-only debug overlay runs a second RAF loop for FPS sampling. It does not
  exist in production.
