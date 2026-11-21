# 0006 — Parchment, Nordic fantasy chrome, and kinetic type

- Date: 2026-11-21
- Status: accepted

## Context

The first paper treatment was a single stretched SVG path whose shape covered only
the middle of its box. Text near the top and bottom of a slab sat outside the paper,
so headings and labels read as dark-on-dark and the slab looked broken. The owner
also asked for a stronger identity: Skyrim-style Nordic fantasy, kinetic typography,
background atmosphere, and project sections that traverse on click rather than only
through a late CTA.

## Decision

- **Paper is a component, not a path.** `src/components/Parchment.tsx` draws a
  deterministic torn silhouette with `clip-path` and layers warmth, fibre and stain
  over it. The sheet extends beyond the content box and the content carries its own
  padding, so text cannot fall off the paper. Four seeded silhouettes and small tilts
  keep slabs from looking duplicated.
- **Whole project slabs are links.** Clicking a project card fires its
  `transitionPreset` strike and navigates after 420 ms. Modified clicks, keyboard
  activation and reduced motion keep the plain link. The late-only CTA is gone.
- **Skyrim palette and chrome.** Ink/abyss ground, cold frost and steel, aged
  parchment, leather brown and brass. Nav, footer, projects index and content pages
  use thin brass rules, rune diamonds and small-caps display labels.
- **Kinetic type split into two owners.** Character reveals and the page-head
  entrance are CSS animations so prerendered text is visible before hydration. GSAP
  owns the scroll-linked ghost-numeral and page-ghost parallax.
- **Atmosphere is generated, not imported.** Fixed fog blobs, dust, grain and an
  outlined ghost word come from CSS gradients and one inline SVG noise tile. No new
  image assets or licenses.
- **Reduced motion and low tiers.** CSS animations stop under
  `prefers-reduced-motion`; GSAP effects return before registering; the WebGL hover
  plane still disables on the low tier. The DOM atmosphere remains (cheap) so the
  page does not collapse visually.

## Consequences

- The paper uses `filter: drop-shadow` and `clip-path`; both are cheap enough for a
  handful of slabs but need a frame-time check on low-end hardware.
- The visual claims in this pass are code-level only. No browser exists in this
  environment, so the torn edges, text fit, fog density and kinetic reveals still
  need an owner look.
- Interface labels stay in JSX. They are chrome, not CV claims; decision 0005 still
  governs content facts.
