# Deployment

The site is a static SPA: React Router prerenders every route at build time and writes a
fallback for unknown paths. There is no server runtime, database or function.

## Prerequisites

- Node 22.12 or newer (`package.json` engines) and pnpm 12.
- A GitHub repository containing this project.
- A Vercel account. The Hobby tier is free and sufficient for a personal portfolio.

## Vercel project settings

`vercel.json` supplies the build settings, so the dashboard can stay on defaults:

| Setting | Value |
| --- | --- |
| Framework preset | Vite (or Other) |
| Root directory | repository root |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Output directory | `build/client` |
| Node version | 22 or newer |

`pnpm-lock.yaml` is committed, so Vercel uses pnpm automatically.

## Environment

`SITE_URL` is optional. Set it to the canonical origin, for example
`https://dhanujanarada.com`, when a custom domain is attached. Without it, the build
uses `VERCEL_PROJECT_PRODUCTION_URL`, so the first production deploy already writes
`sitemap.xml` and `robots.txt` with absolute URLs. No token or secret is needed.

## First deploy — GitHub import

1. Create an empty GitHub repository and push this project.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Confirm the settings above. `vercel.json` should already match them.
4. Deploy. Every push to the production branch triggers a new deployment.

## First deploy — CLI fallback

```sh
pnpm dlx vercel
# log in with the device flow, then:
pnpm dlx vercel --prod
```

The CLI builds locally and uploads `build/client`. Use the Git integration if you want
automatic deploys on push.

## How routing works

- Prerendered routes exist as `<route>/index.html`; Vercel serves them directly.
- Unknown paths are rewritten to `__spa-fallback.html`, which hydrates the React 404
  page. It carries `X-Robots-Tag: noindex`.
- This is a soft 404: the response status is 200. A true 404 status would need a static
  `404.html` or a function, and would lose the React 404 page.

## Post-deploy checklist

Replace `<origin>` with the deployment or custom domain.

```sh
for p in / /projects /projects/vibeshift /about /experience /credentials /contact; do
  printf '%s ' "$p"
  curl -sS -o /dev/null -w '%{http_code}\n' "<origin>$p"
done

curl -sS "<origin>/sitemap.xml" | head
curl -sS "<origin>/robots.txt"
```

- All seven routes return 200 and their own `<title>`.
- An unknown path renders the 404 page.
- `sitemap.xml` and `robots.txt` contain the production origin.
- Project pages carry `og:*` tags.
- `/` and `/about` carry the `Person` JSON-LD; other routes do not.
- The deployed HTML contains no phone number.

## Rollback

Vercel keeps every deployment. Use **Deployments → … → Promote to Production** to roll
back without a git revert. Content changes are ordinary commits, so the Git history is
the content history.
