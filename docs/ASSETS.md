# Asset ledger

Every third-party model, font, texture, or audio file must have a row here before
it is used in the project. Reference repositories (`zen-aperios/a-drift`,
`ismamz/amber`) are inspiration only: no file from them may appear below.

| Asset | Where used | Source | License | Recorded |
| --- | --- | --- | --- | --- |
| `studio_small_03_1k.hdr` (drei preset `studio`) | environment lighting for the sword | Poly Haven via `raw.githack.com/pmndrs/drei-assets` — fetched at runtime, not vendored | CC0 (Poly Haven) | 2026-11-21 |
| `katana.gltf` → `public/models/katana.glb` | the sword and its saya; blade can be drawn | supplied by the project owner; source `assets/katana/katana.gltf`, untextured (materials authored in code). 205 kB, geometry uncompressed — Blender 5.2 accepted the Draco/meshopt flags but wrote neither extension | owner-supplied; licence terms **not yet confirmed** | 2026-11-21 |

Retired: `assets/Golden Katana V1.glb` (30 MB, gold blade, no separate saya) is no longer
shipped; it stays in `assets/` as an unused master.

## Fonts

Installed 2026-11-21, Fontsource 5.3.0, **SIL OFL-1.1**, self-hosted and imported from
`src/app.css`: **Cinzel** (display), **Cormorant Garamond** (body + italic), **Inter**
(UI). No runtime Google request. The remaining rows are alternatives that were
considered but are not installed. Rejected outright: `Neue Haas Grotesk Text`
(commercial) and `PixelCaps` (custom, no licence) from the reference sites.

| Family | Package | Axes / weights | Role | Status |
| --- | --- | --- | --- | --- |
| Cinzel | `@fontsource/cinzel` | 400–900, no italic, caps-first | display capitals | **installed** (400, 500) |
| Cormorant Garamond | `@fontsource-variable/cormorant-garamond` | 300–700 + italic | editorial body, pull quotes | **installed** |
| Inter | `@fontsource-variable/inter` | 100–900 | UI, labels, numerals | **installed** |
| Italiana | `@fontsource/italiana` | 400 only | alternative display | considered |
| Bodoni Moda | `@fontsource-variable/bodoni-moda` | 400–900 + optical size | alternative display | considered |
| Marcellus | `@fontsource/marcellus` | 400 only | alternative display | considered |
| Newsreader | `@fontsource-variable/newsreader` | 200–800 + italic + optical size | alternative body | considered |
| IBM Plex Mono | `@fontsource/ibm-plex-mono` | 100–700 | optional numerals/labels | considered |

