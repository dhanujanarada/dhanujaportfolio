# Site structure spec

- Status: draft, awaiting approval
- Date: 2026-11-21
- Depends on: AGENTS.md rules 18–20, decision 0001 (prerender), 0002–0004 (scroll, tiers, type)
- Source of truth: `docs/content/data.md` (marked authoritative). Proposed rename to
  `docs/content/cv-data.md` so rule 18 names a real file; that rename is the first
  implementation step.

## Constraints

1. **No invented content.** Every claim, date, metric and quote comes from the CV file or
   from the owner. Missing detail becomes `[TODO: …]` and is listed in
   `docs/content/TODO.md`.
2. **No phone number** in page text, metadata, JSON-LD, mailto defaults or source.
3. **The Canvas never remounts.** One `<Canvas>` in `App`, route changes swap only the
   `<Outlet>` and play one GSAP timeline.
4. All pages must be readable with WebGL disabled and with reduced motion on.

## Pages

| Path | Nav label | Content | Notes |
| --- | --- | --- | --- |
| `/` | Home | sword journey, hero, 4 project beats, about teaser, contact beat | full choreography |
| `/projects` | Projects | 4 project cards with period, type, stack, repo | hover shader + ambient canvas |
| `/projects/:slug` | — | case study template | prerendered per slug |
| `/about` | About | headline, summary, portrait, links | portrait `[TODO]` |
| `/experience` | Experience | HCL roles + education | CV order: newest first |
| `/credentials` | Credentials | certifications, awards, leadership | grouped, each with its own heading |
| `/contact` | Contact | mailto form, email, LinkedIn, GitHub, CV download | no phone |
| `*` | — | 404 | ambient canvas, links home/projects |

Nav is persistent above the canvas: text links, a CV download action, active-route
highlight, keyboard focus visible, mobile menu (dialog with focus trap and Escape).
Footer repeats nav, email, LinkedIn, GitHub, CV, and the copyright year.

`/project/:slug` (old scaffold path) permanently redirects to `/projects/:slug`.

## Case-study template

- Metadata rail: `period`, `projectType`, `stack`, `repoUrl`, linked `awards`.
- Hero image slot: `[TODO: project image]` until an asset exists.
- `summary`, then five portable-text sections in order:
  **Problem**, **Approach**, **Architecture**, **Results**, **What I learned**.
- CV bullets seed Approach and Architecture. Problem, Results and Lessons stay marked
  placeholders unless the owner supplies copy.
- Previous / next project links, a back-to-journey link, and the shared footer.

## Home journey

- Sections: hero, four project beats, about teaser, contact beat. Copy alternates sides
  around the diagonal katana; the paper slab stays.
- Each project beat is one link to its case study: the whole parchment slab is
  clickable, and “Read the case study” stays visible at its foot.
- Home is the only route with the full sword journey. Every other route runs the
  **ambient mode**: idle sword, low smoke, no scroll choreography, no strike.
- Activating the slab plays that project's `transitionPreset` strike and navigates at
  the strike's midpoint (~420 ms). Back restores the exact journey scroll position
  from `history.state`.
- Reduced motion and keyboard activation skip the strike and use a plain `<Link>`.

## Route transitions

One GSAP timeline per change, in one place:

1. `strike` (only home→project): preset pose, smoke velocity up, tip leading.
2. `wipe`: smoke curtain crosses the frame.
3. `enter`: incoming route fades/rises; ambient mode takes over.
4. `settle`: kill triggers, reset scroll for non-home routes.

The Canvas stays mounted; only `Outlet` content and the scene's pose mode change.

## Prerender and metadata

- `react-router.config.ts` prerender enumerates `/`, `/projects`, `/about`,
  `/experience`, `/credentials`, `/contact`, and every `/projects/:slug` from Sanity.
- Build fails with a clear message if `VITE_SANITY_PROJECT_ID` is missing or no projects
  are returned.
- Per route: `<title>`, description, Open Graph tags.
- `sitemap.xml` and `robots.txt` generated at build from the same slug list.
- JSON-LD `Person` on `/` and `/about`: `name`, `headline`, `sameAs` (LinkedIn, GitHub).
  No `telephone`. No invented employer facts beyond the CV.

## Contact

- Form fields: name, email, message. Submit composes a `mailto:` to the CV email with a
  prefilled subject and body; nothing is stored or posted.
- Visible email link and LinkedIn/GitHub links. CV PDF link.
- Third-party form endpoints are out of scope.

## Quality

- Each page has exactly one `<h1>`, descending heading order afterwards.
- Focus-visible rings from the token palette; skip link to main content.
- No-WebGL: canvas container is decorative, all content is DOM.
- Reduced motion: no strike, no wipes, no idle drift, no wisp, static ambient scene.
- Mobile: nav dialog traps focus; journey text stacks within the paper slab.

## Dependencies (blocking)

- Sanity project ID, dataset and write token.
- CV PDF placed in `public/cv/` (filename to be confirmed).
- Portrait image for About, or a documented silhouette placeholder.
- Case-study copy for Problem / Results / Lessons, or placeholders accepted.
- Verification of the Silmarillion repository URL (the CV itself flags it).

## Acceptance criteria

- Every fact in `data.md` is reachable on the site; nothing invented.
- `docs/content/TODO.md` lists every placeholder.
- No phone number in any built file (`grep` check).
- All routes, including four project slugs, exist as prerendered HTML.
- Nav highlights the current route and is usable by keyboard only.
- The Canvas mounts once per session; no route change remounts it.
- One GSAP timeline drives each route change.
- Reduced-motion and no-WebGL paths are exercised.
