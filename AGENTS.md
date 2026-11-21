# AGENTS.md

## Current state

- Greenfield portfolio showcase site: Vite + React + TypeScript SPA with prerendering, a single persistent R3F scene, and Sanity as the content source.
- Layout: frontend at the repo root (`src/`), Sanity Studio in `studio/`, documentation in `docs/`.
- Work proceeds in phases (scaffold, content, scene shell, sword and path, atmosphere, hover and typography, about infographic, swordsman and polish). Do not start a phase until the user says so.

## Review protocol (mandatory)

Every file change must be reviewed before the next file is changed, regardless of
task size, mode, or any general instruction to move quickly.

1. Change exactly one file.
2. Explain what changed, why, and what effect it has (including any visual or scroll-behavior effect).
3. Show the diff or the exact new file.
4. Stop and wait for explicit approval.
5. Only then change the next file.

Do not batch file changes. Do not commit a step until the user approves it. Do
not treat silence as approval. This rule applies to code, shaders, styles,
configuration, Sanity schemas, and documentation. Installing dependencies counts
as a change: state the packages and why, then wait for approval.

## Verification

- After each approved step, run `pnpm typecheck`. After each phase, also run `pnpm build`.
- For any change touching the scene, run the dev server and describe what should be visible (sword position at given scroll progress, smoke density, hover reveal) so the user can confirm by eye before approving.
- Report console errors and warnings honestly. Never claim a visual result you did not observe.

## Stack

Vite, React, TypeScript, React Router (SPA + prerender), React Three Fiber + drei +
postprocessing, GSAP (ScrollTrigger) + Lenis, Tailwind v4, Sanity (content), pnpm.

Library versions may differ from your training data (React, R3F, drei, Tailwind v4,
React Router, Sanity). Before writing code against a library, read the installed
package's docs or types in `node_modules/`, and heed deprecation notices.

## Architecture rules

1. ONE persistent `<Canvas>` mounted in `App.tsx` outside the router outlet. Never remount it.
2. Per-frame values (scroll progress, uniforms, sword transform) live in a mutable
   store or refs, NOT React state. No `setState` inside `useFrame`.
3. Scroll is the single source of truth: Lenis -> GSAP ScrollTrigger -> scroll store -> `useFrame`.
4. Every listener, ScrollTrigger, texture, geometry, material, and render target needs a cleanup path.
5. Each section's motion reads its own local progress from the store. No section may reach into another section's state.

## Content rules

6. All copy and project data comes from Sanity via GROQ. No hard-coded content. Show a
   loading state in the scene until content resolves.
7. Schema changes live in `studio/schemaTypes/` and need a decision record if they change existing field meaning.
8. Sanity project ID and dataset come from env vars. Never commit tokens or `.env` files. Use read-only public queries in the browser; any write token stays out of the frontend entirely.

## Quality and accessibility

9. Respect `prefers-reduced-motion` and provide a low-power fallback (no smoke, static sword).
10. Prerender routes at build time so link previews and SEO work.
11. Quality tiers (high / medium / low) must degrade smoke count, postprocessing, and DPR. Never ship an effect without a low-tier path.
12. Budgets: sword model under about 2 MB (Draco or meshopt compressed), textures as WebP or KTX2, no uncompressed assets in `public/`.

## Inspiration and licensing

13. `zen-aperios/a-drift` and `ismamz/amber` are reference only. a-drift has no license:
    never copy its code or assets. Reimplement ideas, and note in the docs which idea came from where.
14. Third-party models, fonts, and textures must have a recorded license in `docs/ASSETS.md` before use.

## Documentation

- When finishing a build step, update the matching docs in the same commit.
- When a decision changes, add a new decision record in `docs/decisions/` that supersedes the old one; do not edit history in place.
- Start at `docs/README.md` for reading order. Temporary gaps between plan and implementation live in `docs/DISCREPANCIES.md`.