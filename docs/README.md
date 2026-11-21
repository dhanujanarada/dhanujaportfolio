# Dhanuja Portfolio — documentation

## Reading order

1. [`../AGENTS.md`](../AGENTS.md) — architecture rules, budgets, review protocol.
2. [`decisions/`](decisions/) — append-only decision records, oldest first.
3. [`DISCREPANCIES.md`](DISCREPANCIES.md) — where the plan and the code currently differ.
4. [`ASSETS.md`](ASSETS.md) — license ledger for models, fonts, and textures.

## Layout

- `src/` — the frontend (React Router framework mode, `appDirectory: "src"`).
- `studio/` — Sanity Studio, an independent package with its own dependencies.
- `docs/` — these documents and the decision records.

## Commands

| Command | Effect |
| --- | --- |
| `pnpm dev` | Vite dev server. Client-rendered SPA; prerendering only happens at build time. |
| `pnpm typecheck` | `react-router typegen` then `tsc`. |
| `pnpm build` | Prerenders `/` to `build/client/index.html` and writes the SPA fallback `build/client/__spa-fallback.html`. |
| `pnpm --dir studio dev` | Sanity Studio on :3333. Needs a project ID and dataset. |

## Environment

Copy `.env.example` to `.env` for the frontend (`VITE_SANITY_*`) and to
`studio/.env` for the Studio (`SANITY_STUDIO_*`). No tokens belong in either file;
the frontend only ever uses read-only public queries.
