# 0004 — Type system, hover plane, and pointer surface

- Date: 2026-11-21
- Status: accepted

## Context

The site needs a "grand, angelic" type voice and a project hover that reveals a
cover through a shader. One full-viewport DOM layer sits above one persistent
canvas, and the review protocol requires each change to be explainable.

## Decision

- **Fonts**: Cinzel (display capitals), Cormorant Garamond (body, italic),
  Inter (UI/labels), all SIL OFL-1.1 via Fontsource, self-hosted. No Google
  runtime request. `Neue Haas Grotesk Text` and `PixelCaps` from the reference
  sites are rejected (commercial / unlicensed).
- **Tokens** live in `src/app.css` under Tailwind v4 `@theme`: pearl, champagne,
  ink, ink-soft, plus `--color-accent` as the CMS fallback. Type roles are
  `--font-display|body|ui` and `--text-display|title|body|label`.
- **Hover plane in the empty corner**, not on the card. The canvas is behind the
  DOM, so a plane under the paper could never be hovered. The plane appears only
  for project sections and above the low tier.
- **Pointer passthrough**: `main` and each `section` are `pointer-events-none`;
  the paper panel is `pointer-events-auto`. Empty space therefore reaches the
  canvas, while text stays selectable.
- **Hover is GSAP-owned**: reveal and RGB split are one timeline per pointer
  enter/leave, with `invalidate()` on update. The title knock is a separate
  timeline on the split characters.
- **Tap pins the reveal** on coarse pointers; a second tap closes it.
- **Cursor wisp** is a DOM canvas driven by `gsap.ticker`, idle when no puffs
  are alive, absent under reduced motion.

## Consequences

- The hover is not discoverable without a visible affordance; recorded in
  `DISCREPANCIES.md`.
- Low tier removes the hover rather than degrading it.
- The wisp canvas is a second paint surface above the paper; it is
  `pointer-events-none` and clears itself when idle.
- `makeCover` runs during render and touches `document`. The prerender pass
  tolerates it today; if the prerender environment ever loses a DOM shim, the
  cover must move behind an effect.

## Influence

- Masked/staggered text, per-object emissive flashes and invisible hit volumes
  are ideas studied in `docs/references.md` (amber). No code or assets copied.
- The type scale and restrained label treatment follow the a-drift teardown
  (size jump, tight leading), with free faces instead of its unlicensed ones.
