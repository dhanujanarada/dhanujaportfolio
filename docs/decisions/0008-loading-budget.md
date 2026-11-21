# 0008 — Scene loading budget

- Date: 2026-11-21
- Status: accepted

## Context

The home journey downloaded the entire three/drei/postprocessing stack with the
initial bundle, then blocked on `Environment preset="studio"`, which fetches an HDR
from `raw.githack.com` at runtime. A headless Chromium run showed the scene chunk
starting late, no first frame until the HDR arrived, and a multi-second shader-compile
stall that the quality monitor then misread as a slow device. Phones paid the same cost
for an effect mostly hidden behind the parchment.

## Decision

- **The scene is a lazy chunk.** `App` imports `SceneCanvas` dynamically and starts that
  import with the root module, so the DOM and fonts win the first paint while the 3D
  downloads in parallel. The Canvas still mounts once and never remounts across routes.
- **No remote HDR.** `Environment preset="studio"` is gone. The blade uses a
  `MeshStandardMaterial` and a direct light rig (key, fill, rim) instead of image-based
  lighting.
- **One material program.** All five sword parts use `MeshStandardMaterial`; clearcoat
  was subtle at this scale and multiplied shader variants.
- **Postprocessing is optional and late.** `Halo` is its own lazy chunk, home-only, and
  rendered only after the quality monitor settles and the tier is not low.
- **Smoke is preallocated.** One instanced buffer holds the high-tier count; changing
  tiers only changes `instanceCount`, so an upgrade does not rebuild or reshuffle it.
- **The katana is preloaded.** A `<link rel="preload" as="fetch" crossorigin>` in the
  root head and `useGLTF.preload` in the scene chunk start the 201 kB model immediately.
- **Conservative start.** Phones, coarse pointers, reduced motion and low-core/low-memory
  devices start at low (static sword, no smoke/postprocessing). Everyone else starts at
  medium and can upgrade to high after the sample.
- **The monitor ignores stalls.** Deltas over 200 ms restart the sample; eight in a row
  settle to low, so a machine that never reaches steady state still stops paying for
  medium.
- **Dev dependencies are pre-declared.** `optimizeDeps.include` lists React, React
  Router, GSAP, Lenis, Zustand and the three/drei/postprocessing packages. Without it,
  the lazy scene triggers a late Vite re-optimization and a page reload with
  `504 Outdated Optimize Dep` in `pnpm dev`.

## Consequences

- Initial JavaScript drops from one ~332 kB gzip root chunk to roughly 150 kB gzip of
  shared/route code; the scene is ~261 kB gzip and the effects ~42 kB gzip, both lazy.
- Without an environment map the blade is less reflective. The direct lights recover a
  steel gradient; the look was checked in headless Chromium screenshots.
- Under software WebGL the first frame still blocks for about 1.2 s and frames are slow;
  that is a SwiftShader measurement, not a GPU one. Real-device frame time remains
  unverified and the debug overlay still reports it.
