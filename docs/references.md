# Reference teardown

Read-only study of two sites, for behaviour and typography only. **Neither repo has a
licence** (GitHub reports none for both), so nothing here may be copied: no code, no
assets, no fonts. Ideas are reimplemented in our own stack and recorded under
"Influence" in the relevant decision record.

## zen-aperios/a-drift

Source read: `index.html`, `src/styles.css` (repo root, `main`).

### Fonts

- `"Neue Haas Grotesk Text"` — primary face, used 3× with `"Helvetica Neue", Arial` fallbacks.
- `"Geist"` — used 2×, stacked before Neue Haas.
- `"DM Sans"` — 1×, in the inline loading line in `index.html`.
- **No `@font-face` and no font files in the repo.** The design depends on locally
  installed or licensed faces. On a machine without them it silently falls back to
  Helvetica/Arial. That is a licensing hazard, not a technique to copy.

### Typographic treatment

- **Tiny labels dominate:** 11 declarations at `8px`, six at `9px`, five at `11px`,
  four at `10px` — the interface reads like instrumentation.
- **Tracking:** `0.02em`, `0.03em`, `0.04em`, `0.08em`, `0.12em` — micro-copy is
  letter-spaced; display is not.
- **Leading:** `line-height: 1` appears 24 times. Almost nothing gets air between lines.
- **Weights:** 300, 400, 500 only. No bold display.
- **Scale:** one large face — `clamp(55px, 5.35vw, 90px)` — plus a single 48px and a
  single 16px. The hierarchy is created by size jump, not by weight.
- **Case:** exactly one `text-transform: uppercase`. The restraint is real.

### Takeaway

A neo-grotesk at small sizes, tight leading, wide tracking on labels, one enormous
display line. Grandeur comes from the size jump and the empty space, not from an
ornate typeface. We will not use the commercial face.

## ismamz/amber

Source read: `package.json`, `app/root.tsx`, `app/routes.ts`, `app/routes/_index.tsx`,
`app/routes/specimens.$slug.tsx`, `app/components/scene.tsx`,
`app/components/specimen-sequencer.tsx`, `app/components/specimen-detail.tsx`,
`app/lib/scene.ts`, `app/lib/transition.ts`, `app/lib/reveal.ts`, `app/lib/eases.ts`,
`app/globals.css`.

### Stack

React Router 8.4, R3F 9.7, three 0.186, drei 10.7, GSAP 3.15 + `@gsap/react`,
`@react-three/postprocessing`, Tailwind v4, `hyperkinetic` (alpha) for route
transitions. Fonts: `Sometype Mono` from Google Fonts and a custom `PixelCaps`
woff2. Light, near-white UI with a single emissive accent.

### Hover effect (3D specimen)

1. **Per-specimen material clones.** Each model is cloned and every material is
   cloned with it, because a shared material would make every specimen glow at once.
2. **Emissive flash, not a held hover.** On enter: `emissiveIntensity` 0 → 1 in
   0.1 s, then settles to 0.3 in 0.4 s; on leave, back to 0 in 0.3 s. Every tween
   calls `invalidate()`.
3. **Label strobes.** The label uses GSAP keyframes
   `opacity: [0, 1, 0.15, 1, 0.4, 1]` over 0.32 s with `steps(1)` — a readout
   switching on, not a fade.
4. **Generous hit area.** An invisible `Box3` scaled 1.05 covers the whole
   footprint, so the pointer reacts off-silhouette.
5. **Press feedback** on `pointerdown`, not `click`: the model scales to 0.965 and
   back over 0.1 s + 0.3 s, so the feedback does not wait for navigation work.
6. **Depth-aware labels.** In `useFrame` the label's world position is projected
   into camera space and blurred up to 3.5 px with distance. One DOM write per frame.
7. Cursor is set to `pointer` on a data attribute surface while hovered.

### Page transitions

- `AnimatedOutlet` (hyperkinetic) supplies one `gsap.timeline`; the scene registers a
  `controller.transition(timeline, currentPath, nextPath, position, initial)` and adds
  its own tweens at named positions.
- **Named labels** coordinate DOM and 3D: `exit-end`, `scene-start`,
  `entrance-start`, `title-start`, `identity-start`. Titles start after the outgoing
  titles leave; identity starts earlier when moving detail→detail.
- **Text**: masked character rise — chars `yPercent: 100 → 0` with a staggered
  amount, plus a block `scaleX: 0 → 1` behind them; leave reverses from the end.
  Fallback content uses `autoAlpha` with 0.035 s leave / 0.07 s enter staggers.
- **Custom eases**: `im-quint-inout` = `.76, 0, .2, 1`, `im-quart-inout` =
  `0.65, 0.01, 0.05, 0.99` via `CustomEase`.
- **Scene choreography per route pair**: home→detail sinks and fades the platform,
  shrinks every other specimen, then glides the chosen one to its detail pose;
  detail→detail slides old/new ±0.45 with a 1.1 rad turn; detail→home rises the
  platform under the exit and returns specimens outward by ring rank.
- `history.scrollRestoration = "manual"`, `window.scrollTo(0, 0)` after enter, and a
  **5 s resource timeout** so a slow model or shader cannot hold navigation forever.

### Takeaway

One timeline for DOM and scene, with named labels; masks for text; cloned materials
for per-object feedback; invisible hit volumes; on-demand rendering.

## What we adopt (ideas only)

- Choreograph DOM and R3F from **one GSAP timeline with named labels**, which also
  satisfies rule 16.
- Masked character rise (`yPercent` clip) in addition to our blur/opacity reveal.
- Per-project material clones for hover, so only the hovered project glows.
- Invisible hit volume for project hover targets.
- Press feedback on `pointerdown`.
- Depth-based label blur, if the label is DOM inside the canvas.

## What we refuse

- `Neue Haas Grotesk Text` and `PixelCaps`: commercial/custom faces with no licence.
- Any model, texture, shader, or source file from either repo.
- Amber's light "instrument" palette and all-caps mono body; it does not fit
  "grand, angelic".
