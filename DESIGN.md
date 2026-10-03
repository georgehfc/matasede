# DESIGN.md — Mata-Sede

Version 1.0, 3 Oct 2026. Replaces v0.1 (20 Sep: Clay, Refill, Inter and Fluent Emoji).
Origin: direction D in the Paper file "Mata-Sede — Ideação". It takes azulejo visuals from B, calçada typography from A, and signage structure from C. Reasoning is in `docs/design/IDEATION.md`.

**Desktop-first.** The main experience is someone at a monitor exploring, browsing albums and taking part in the 438 challenge. The phone is a simpler companion for "where's water now" and taking photos, and it must still work at 375 px.

## 1. Idea in one line

Cobalt on tin-glaze white, set in pavement type. The city's water drawn like a tile panel, numbers big enough to read across a room, and the Mar Largo wave as the signature.

## 2. Colour

One hue does the work. Cobalt marks water, action, selection and the brand. The only other hue is red, and it only means "broken".

| Token | Hex | Use |
| --- | --- | --- |
| `--color-glaze` | `#FFFFFF` | Page and panel background (tin-glaze white) |
| `--color-cobalt` | `#1D3CA8` | Brand, primary actions, map lines, "a funcionar", selection, the wave |
| `--color-wash` | `#E3E8F7` | Cobalt wash: river, plazas, tinted panels, inactive number badges |
| `--color-ink` | `#121B3D` | Text, borders on white, wordmark |
| `--color-muted` | `#5A6285` | Secondary text (6.0:1 on white, 4.9:1 on wash) |
| `--color-line` | `#E3E8F7` | Dividers, the panel/map divider and the search field border (same value as wash) |
| `--color-hover` | `#F2F3F5` | Quiet grey fill on hover (e.g. the "Ver todos em lista" footer) |
| `--color-edge` | `#BBC4E5` | Soft cobalt border of available filter chips (cobalt on hover) |
| `--color-disabled` | `#9AA0B8` | Label and icon of filters with no data yet |
| `--color-broken` | `#D2452F` | "Avariado" only, always paired with ✕ and the word |
| `--color-warning-yellow` | `#E8B300` | IPMA yellow warning swatch (small square only) |
| `--color-warning-orange` | `#E0701B` | IPMA orange warning swatch |
| `--color-warning-red` | `#C4231B` | IPMA red warning swatch |

Rules:
- Text on cobalt is always white. Cobalt on white is 9.3:1. Broken red is 4.5:1, which is enough for AA text but only just, so keep it at 13 px or larger.
- Never use colour alone for status. Each status has a shape and a word (section 6).
- The three warning colours are only ever small swatches next to a word. They never become backgrounds.
- No gradients, no glass, no soft drop shadows. Elevation is a 1.5 px ink border.

## 3. Type

| Role | Font | Weight | Size / line | Tracking |
| --- | --- | --- | --- | --- |
| Wordmark | Archivo Black | 400 | 24 / 24 | −0.02em |
| Display (page titles, numbers) | Archivo Black | 400 | 40 / 40 | −0.03em |
| Title (panel heads, fountain name in detail) | Archivo Black | 400 | 32 / 32 (28 on mobile) | −0.025em |
| Distance numerals | Archivo Black | 400 | 26 / 28 | −0.02em, tabular |
| Card name | Archivo | 700 | 17 / 22 | 0 |
| Body | Archivo | 400 | 15 / 22 | 0 |
| Label / meta | Archivo | 400–600 | 13 / 18 | 0 |
| Eyebrow | Archivo | 700 | 12 / 16 | 0.1em |

- Both fonts are on Google Fonts. Load only the weights listed, with `font-display: swap`.
- Numbers (distances, counts, temperature) always use `font-variant-numeric: tabular-nums`.
- Copy is sentence case. The only text in capitals is the wordmark MATA-SEDE (always hyphenated) and eyebrow labels, which are set uppercase in CSS (`text-transform`), so the strings file stays sentence case.
- Minimum size is 12 px, and that size is reserved for eyebrows and map legends.

## 4. Space, shape, layout

- Spacing scale (px): 4, 6, 8, 12, 16, 20, 24, 32, 40, 56.
- Radius: **0** everywhere. Squares come from tiles and setts. The exceptions are on the map: fountain pins, photo thumbnails and the location dot are round, so they read as points against the street grid.
- Borders: 1.5 px. Ink for buttons, chips and map controls, cobalt for icon tiles, line (#E3E8F7) for dividers, the panel edge and the search field.
- Desktop layout at 1440:
  - **Header:** 80 px.
  - **Wave frieze:** 20 px.
  - **Body:** a 440 px left panel with a 1.5 px line (#E3E8F7) border on its right side, and the map filling the rest.
  - Gutters are 32 px in the header and the panel heads, and 20 px around cards.
- Breakpoints: `--breakpoint-sm: 375px`, `--breakpoint-md: 768px`, `--breakpoint-lg: 1024px`, `--breakpoint-xl: 1440px`. Below 1024 the left panel becomes the mobile bottom sheet.

## 5. The wave (signature)

The Mar Largo wave from Rossio's pavement, drawn as a single repeating quadratic curve.

| Where | Look |
| --- | --- |
| Frieze under the header | 20 px cobalt band, white wave, 2.4 px stroke, 20 px wavelength |
| River on the map | 3 parallel cobalt strokes (2.2–3 px) on the wash, slightly offset, for a hand-set feel |
| Empty and loading states | A short cobalt wave segment |
| Posters and social | Thick ink or cobalt wave as a base rule |

Use the wave once per view. It is a signature, not a texture.

## 6. Status (pins, cards, detail)

| State | Pin / mark | Word (pt) | Word (en) |
| --- | --- | --- | --- |
| Bebedouro (no report yet) | solid cobalt circle with a white ring; 13 px far out, 20–23 px at street zoom | — (no status word) | — |
| Bebedouro, zoom 16+ | 32 px cobalt circle with a white glyph: ♿ if accessible, a water drop otherwise | — | — |
| Bebedouro with photos, zoom 15+ | 46 px round photo thumbnail, cobalt ring, ♿ badge if accessible | — | — |
| A funcionar (Block 5) | cobalt circle with ✓ | A funcionar | Working |
| Avariado (Block 5) | white circle, red ring, red ✕ | Avariado | Not working |
| Selected | 44 px: cobalt dot, white gap, cobalt ring (thumbnails grow to 60 px) | — | — |
| Chafariz / bica (heritage) | 10 px cobalt outline diamond | Chafariz / Bica | Fountain / Spout |

- No status word until there is a status to report: "Sem informação recente" was dropped (3 Oct 2026) as vague. Block 5 adds "A funcionar" and "Avariado" only.
- Clusters (below zoom 11) are larger cobalt circles with a white count.
- Pin artwork lives in `js/pins.js` and is used by both the map and the legend, so they always match.
- Your location is a cobalt dot with a white ring and a 12% cobalt halo. A dotted cobalt line runs to the selected fountain (a straight line, not a route).

## 7. Icons

Drawn geometric SVG icons, 1.6 px cobalt stroke, inside a 24 px square tile with a 1.5 px cobalt border (white strokes on cobalt when selected). They replace Fluent Emoji in the interface.

| Feature | Icon |
| --- | --- |
| Garrafa (bottle tap) | bottle outline |
| Taça (dog bowl) | half-ellipse bowl |
| Acessível | simplified wheelchair |
| Como chegar | arrow out ↗ |
| Perto de mim | crosshair |
| Foto | + in a dashed tile |
| Search | magnifier |

Files go in `assets/icons/*.svg`, using `currentColor` so CSS can colour them. Fluent Emoji are no longer used in the interface. If they return, it's only for one-off playful moments on the Sobre page, in social posts or on the poster, and the founder decides case by case.

## 8. Components

### Header (desktop)
Contains the wordmark (376 px slot, so search lines up with the map), search (1.5 px line border, cobalt with a focus ring when active, 46 px tall), the "Perto de mim" button (cobalt, white text, crosshair icon) and the weather module, separated by a 1.5 px wash rule.

### Weather module (heat header, IPMA proof of concept)
- **Data:** IPMA open data, no key, CORS open.
  - Warnings: `https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json`, filtered to `idAreaAviso: "LSB"` and `awarenessTypeName: "Tempo Quente"`.
  - Forecast: `https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1110600.json`, today's `tMax`.
- **Calm (green or no warning):** shows today's maximum. Big "28°" (Archivo Black 40) with the label "Máx. hoje em Lisboa" and the line "Água da torneira, de graça, perto de ti".
- **Heat (yellow, orange or red):** the warning swatch and "Aviso amarelo/laranja/vermelho · tempo quente", plus "Bebe antes de ter sede". The number stays the same size, so the layout doesn't jump.
- **Failure:** the module hides itself and nothing else changes.
- Always show the word "Máx." so the forecast maximum is never mistaken for the current temperature.
- Credit IPMA in the footer and on the Sobre page.

### Fountain card (left panel list)
- **Columns:** number badge 32 px | name, status line and icon tiles | distance column, 100 px wide and right-aligned.
- **Rest state:** white with a wash divider. The badge is wash with a cobalt number.
- **Selected state:** cobalt fill, everything white, white badge with a cobalt number.
- **Distance:** "270 m" is straight-line distance and "≈ 3 min" assumes 80 m/min, so it's always marked ≈.
- **Without location:** the distance column is empty and the list is sorted by name.

### Detail panel (fountain drawer)
- **Placement:** on desktop it **replaces the list in the left panel**, with "← Perto de ti" to go back. On mobile it is the bottom sheet (peek, half, full).
- **Order:**
  1. Eyebrow (type, e.g. "bebedouro")
  2. Title
  3. Status line
  4. **Album** (78 px square photo tiles plus a dashed "+ Foto" tile; empty state "Ainda sem fotos")
  5. Feature tiles with words
  6. Actions: "Como chegar ↗" (cobalt, full width) and "Reportar" (ink outline)
  7. Note: "Abre o percurso na app de mapas"
- **Shareable URL** per fountain (`?b=<id>`).

### 438 challenge
Sits at the bottom of the left panel on a wash background. The count is in Archivo Black 40 cobalt with "de 438 bebedouros já têm foto". Below it is an 8 px progress bar (cobalt on white) and the line "Há N sem foto a menos de 400 m" with a "Fotografar" link.

### Filter chips
These are square, unlike the v0.1 pills: 36 px tall with a 1.5 px soft cobalt (edge) border, cobalt on hover, and a feature icon plus a word. Filters with no data yet keep a wash border and a lighter (disabled) label. Active chips are solid cobalt with white text. Filters that have no data before Block 5 explain this in the empty result.

### Heritage toggle
A map control labelled "Chafarizes e bicas" with a diamond icon, off by default.

### Map style
OpenFreeMap Liberty, restyled:
- Land is glaze white. Streets are white with cobalt casing, the casing at about 30% of street width.
- Minor streets are 1.5 px cobalt lines. Parks and plazas are wash.
- The river is wash, with the wave strokes added as an overlay.
- Labels are ink in Archivo, and POIs are hidden.
- Keep the OpenFreeMap and OpenStreetMap attribution visible, bottom right, in muted 12 px.

## 9. Mobile (companion)

- **Header:** wordmark plus "Perto de mim". Search sits behind an icon, and the weather module collapses to "28°" plus a swatch.
- **Frieze:** the wave frieze stays, at 14 px.
- **List:** the nearest 3 open as the bottom sheet peek, with the full list at full height.
- **Tap targets:** at least 44 px.

## 10. Motion and accessibility

- **Motion:** the only transitions are the panel sliding (200 ms) and the selected pin growing (150 ms). Both are removed under `prefers-reduced-motion`.
- **Focus:** a 3 px cobalt outline with 2 px offset, or white on cobalt surfaces.
- **List view:** reaches every fountain, and every map action has a list equivalent.
- **Contrast:** WCAG 2.1 AA minimum. Everything in the palette above passes on white.

## 11. Tokens (CSS)

```css
:root {
  --color-glaze: #FFFFFF;
  --color-cobalt: #1D3CA8;
  --color-wash: #E3E8F7;
  --color-ink: #121B3D;
  --color-muted: #5A6285;
  --color-line: #E3E8F7;
  --color-hover: #F2F3F5;   /* quiet grey fill on hover */
  --color-edge: #BBC4E5;    /* soft cobalt border for available filter chips */
  --color-disabled: #9AA0B8; /* labels and icons of filters with no data yet */
  --color-broken: #D2452F;
  --color-warning-yellow: #E8B300;
  --color-warning-orange: #E0701B;
  --color-warning-red: #C4231B;

  --font-display: "Archivo Black", "Archivo", system-ui, sans-serif;
  --font-body: "Archivo", system-ui, sans-serif;

  --text-wordmark: 24px;
  --text-display: 40px;
  --text-title: 32px;
  --text-distance: 26px;
  --text-name: 17px;
  --text-body: 15px;
  --text-label: 13px;
  --text-eyebrow: 12px;

  --tracking-display: -0.03em;
  --tracking-title: -0.025em;
  --tracking-eyebrow: 0.1em;

  --spacing-1: 4px;  --spacing-2: 8px;  --spacing-3: 12px; --spacing-4: 16px;
  --spacing-5: 20px; --spacing-6: 24px; --spacing-8: 32px; --spacing-10: 40px;

  --border: 1.5px;
  --radius: 0;

  --header-height: 80px;
  --frieze-height: 20px;
  --panel-width: 440px;

  --breakpoint-sm: 375px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1440px;
}
```

## 12. Not yet designed

- The mobile companion in detail.
- The full "Ainda sem fotos" empty state.
- The Sobre page, the English version and posters.
- A new `preview.html` for this version; the v0.1 preview no longer applies.
