# 0003 — Continuous rendering while the sword idles

- Date: 2026-11-21
- Status: accepted
- Supersedes: the `frameloop="demand"` / "zero cost at rest" clause of 0002

## Context

The sword idles with a time-based float (±0.06 units, 4 s period). A demand-mode
canvas stops rendering at rest, which froze the float. The approved options were
continuous rendering, scroll-only idle, or a runtime frameloop switch.

## Decision

- Keep `frameloop="demand"` on the Canvas, but `SwordRig` calls `invalidate()`
  every frame while motion is enabled. The scene therefore renders continuously
  while the tab is visible and the user has not asked for reduced motion.
- Under `prefers-reduced-motion`, the rig writes a static pose and does not
  invalidate, so rendering stops again.
- Quality tiers are not implemented yet. When they land: high = always,
  medium = throttled invalidation (~30 fps), low = static pose.

## Consequences

- The GPU is busy at rest, which contradicts 0002's original claim; that claim is
  now historically accurate only for the cube phase.
- Battery cost on laptops and mobile. Acceptable for a portfolio hero, but it is
  the first thing a quality tier should buy back.
- `InvalidateOnScroll` is still required: it wakes the canvas after navigation or
  texture changes when the rig is not invalidating.
