# Dhanuja Portfolio — documentation

## Reading order

1. [`../AGENTS.md`](../AGENTS.md) — architecture rules, budgets, review protocol.
2. [`decisions/`](decisions/) — append-only decision records, oldest first.
3. [`DISCREPANCIES.md`](DISCREPANCIES.md) — where the plan and the code currently differ.
4. [`ASSETS.md`](ASSETS.md) — license ledger for models, fonts, and textures.
5. [`DEPLOY.md`](DEPLOY.md) — Vercel build settings and the release checklist.

## Layout

- `src/` — the frontend (React Router framework mode, `appDirectory: "src"`).
- `src/content/` — the content source. One file per project in
  `src/content/projects/`; shared types in `src/content/types.ts`.
- `docs/` — these documents and the decision records.

## Commands

| Command | Effect |
| --- | --- |
| `pnpm dev` | Vite dev server. Client-rendered SPA; prerendering only happens at build time. |
| `pnpm typecheck` | `react-router typegen` then `tsc`. |
| `pnpm build` | Prerenders every route into `build/client/` and writes the SPA fallback `build/client/__spa-fallback.html`. |

## Environment

`.env.example` is the only tracked environment file. `SITE_URL` is optional; it gives
`sitemap.xml` and `robots.txt` an absolute origin. On Vercel the build falls back to
`VERCEL_PROJECT_PRODUCTION_URL`, so the first production deploy emits both files
without extra configuration.
