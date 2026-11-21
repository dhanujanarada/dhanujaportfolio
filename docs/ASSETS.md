# Asset ledger

Every third-party model, font, texture, or audio file must have a row here before
it is used in the project. Reference repositories (`zen-aperios/a-drift`,
`ismamz/amber`) are inspiration only: no file from them may appear below.

| Asset | Where used | Source | License | Recorded |
| --- | --- | --- | --- | --- |
| `studio_small_03_1k.hdr` (drei preset `studio`) | environment lighting for the sword | Poly Haven via `raw.githack.com/pmndrs/drei-assets` — fetched at runtime, not vendored | CC0 (Poly Haven) | 2026-11-21 |
| `katana.gltf` → `public/models/katana.glb` | the sword and its saya; blade can be drawn | supplied by the project owner; source `assets/katana/katana.gltf`, untextured (materials authored in code) | owner-supplied; licence terms **not yet confirmed** | 2026-11-21 |

Retired: `assets/Golden Katana V1.glb` (30 MB, gold blade, no separate saya) is no longer
shipped; it stays in `assets/` as an unused master.

## Font candidates (proposed, not installed)

All are SIL OFL-1.1 via Fontsource, self-hosted, no runtime Google request. Rejected:
`Neue Haas Grotesk Text` (commercial) and `PixelCaps` (custom, no licence) from the
reference sites.

| Family | Package | Axes / weights | Role | Why |
| --- | --- | --- | --- | --- |
| Cinzel | `@fontsource/cinzel` | 400–900, no italic, caps-first | display capitals | Roman inscriptional proportions; "grand" without ornament |
| Cormorant Garamond | `@fontsource-variable/cormorant-garamond` | 300–700 + italic | editorial body, pull quotes | high-contrast, airy, genuinely angelic at 18–24 px |
| Inter | `@fontsource-variable/inter` | 100–900 | UI, labels, numerals | neutral counterweight; not asked to be expressive |
| Italiana | `@fontsource/italiana` | 400 only | alternative display | thinner, more ethereal than Cinzel |
| Bodoni Moda | `@fontsource-variable/bodoni-moda` | 400–900 + optical size | alternative display | Didone contrast; reads fashion rather than angelic |
| Marcellus | `@fontsource/marcellus` | 400 only | alternative display | softer Trajan; less authority than Cinzel |
| Newsreader | `@fontsource-variable/newsreader` | 200–800 + italic + optical size | alternative body | more editorial warmth, less contrast |
| IBM Plex Mono | `@fontsource/ibm-plex-mono` | 100–700 | optional numerals/labels | only if Inter's tabular figures feel too plain |

