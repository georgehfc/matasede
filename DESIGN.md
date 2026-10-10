# DESIGN.md — Mata-Sede

Version 2.0, 10 Oct 2026. Written from the live site (matasede.pt, `gh-pages`), which is the reference. Replaces v1.0 (3 Oct: Archivo, flat, no shadows, square chips).
See it rendered: `preview.html` (it reads the real `assets/site.css`, so it can't drift from the site).

**Desktop-first.** The main experience is someone at a monitor exploring, browsing albums and taking part in the 438 challenge. The phone is the companion for "where's water now", photos and quick answers, and it must still work at 375 px.

**Where the values live.** Every colour, font, radius and shadow is a CSS custom property in `assets/site.css`, defined once. Change a colour there and the whole site follows. A few places that can't read CSS (the map's paint rules, the hero's canvas, inline SVG) repeat the same hex values; they're listed in section 11.

## 1. Idea in one line

Deep Lisbon water under frosted glass. Navy and azulejo cobalt carry the brand, the city sits under floating glass panels, and one shining button per screen tells you what to do next. Red only ever means broken.

## 2. Colour

One blue scale does the work. Red is the only other hue in the interface, and it only means "broken".

**The blue scale** (darkest to lightest):

| Token | Hex | Use |
| --- | --- | --- |
| `--abismo` | `#050F38` | Deepest navy: top of the home hero, Lisbon's land in the hero |
| `--noite` | `#071447` | Navy: the primary button, active filters and switches, icon discs, the favicon |
| `--azul-profundo` | `#0E2A9A` | Deep cobalt: gradients between navy and cobalt, the primary button's inner edge |
| `--azul` | `#2457F5` | Cobalt, the brand blue: map pins and clusters, edges of active things, focus ring, the logo hyphen |
| `--azul-texto` | `#1D46D1` | Cobalt for text, links and icons on white |
| `--azul-claro` | `#7FB2FF` | Light blue: icons and the hyphen on navy, the primary button's hover glow |
| `--agua` | `#5AD2F4` | Aqua: the fountains' glow in the hero, water highlights |
| `--azul-fundo` | `#EDF2FF` | Soft cobalt tint: tags, empty album, photo placeholders, hover rows |

**Neutrals and status:**

| Token | Hex | Use |
| --- | --- | --- |
| `--chao` | `#FFFFFF` | Solid cards and inputs |
| `--fundo` | `#F4F6FB` | Page ground |
| `--basalto` | `#0B1020` | Text |
| `--cinza` | `#5D6478` | Secondary text |
| `--linha` | ink at 9% | Hairline dividers |
| `--erro` | `#D3263A` | **Broken only** ("Avariado", broken pins), and form errors |

**Glass:**

| Token | Value | Use |
| --- | --- | --- |
| `--vidro` | white at 82% | Secondary buttons, chips, switches |
| `--vidro-forte` | white at 86% | Floating panels: header bubble, fountain card, dialogs |
| `--vidro-borda` | ink at 8% | The 1 px edge of anything glass |
| `--desfoque` | blur 14 px, saturate 1.6 | What shows through the glass |

Rules:
- **Red only ever means broken**, and it never appears alone: it always comes with a ✕ and, wherever there's room for text, the word "Avariado" (section 6).
- One primary per screen, in navy (section 8). Everything else is glass or white.
- Gradients are allowed only along the blue scale (navy → cobalt → aqua): the hero, the 438 bar, the challenge band. Never a gradient into red.
- **Contrast (measured, WCAG 2.1):** text 18.9:1 on white; secondary text 5.9:1 on white, 5.5:1 on the page ground; `--azul-texto` 7.4:1 on white; `--azul` 5.6:1 on white; red 5.1:1 on white and white on red 5.1:1; white on navy 17.5:1, light blue on navy 8.1:1. All pass AA. Glass sits over a pale map, so it is checked against white; never put glass text over a photo without a dark scrim.

**Dark mode.** The site follows the device setting (`prefers-color-scheme`). The navy, cobalt and red identity stays; surfaces turn deep navy-grey. Values: page `#0A0E1A`, cards `#141A2B`, text `#F1F4FB`, secondary `#9EA6BB` (7.1:1), link and icon blue `#7FB2FF` (8.0:1), tint `#1B2442`, red `#FF8A94` (7.7:1), glass navy-grey at 62% and 82% with a white 12% edge. The map itself stays light for now (open, section 12).

## 3. Type

Two fonts, both on Google Fonts:
- **Bricolage Grotesque** (`--display`): the logo, page and section titles, fountain names, big numbers. Weights 600–800, optical size axis on.
- **Inter** (`--texto`): everything else. Weights 400, 500, 600, 700.

| Role | Font | Weight | Size / line | Tracking |
| --- | --- | --- | --- | --- |
| Wordmark | Bricolage | 800, opsz 96 | 22–24 / 1 | −0.035em |
| Hero title | Bricolage | 800 | 52–132 (fluid) / 0.9 | −0.05em |
| Section title | Bricolage | 700 | 28–40 (fluid) / 1.05 | −0.035em |
| Big numbers | Bricolage | 800 | 38–60 (fluid) / 1 | −0.04em, tabular |
| Fountain name (card) | Bricolage | 700, opsz 48 | 23 / 1.1 | −0.03em |
| Card and step titles | Bricolage | 700 | 17–19 / 1.2 | −0.02em |
| Body | Inter | 400 | 16 / 1.5 | 0 |
| Buttons | Inter | 600 | 15 (16 in the hero) | −0.005em |
| Chips, labels | Inter | 500 | 13–14 | 0 |
| Meta, hints | Inter | 400–500 | 12.5–13.5 | 0 |
| Eyebrow | Inter | 600 | 11–13 | 0.07–0.08em, uppercase |

- Numbers (distances, counts, temperature, photo n/N) always use `font-variant-numeric: tabular-nums`.
- Copy is sentence case. Only eyebrows are set in capitals, through CSS (`text-transform`), so the text itself stays sentence case.
- The wordmark is always **Mata-Sede**, hyphenated, the hyphen in cobalt (light blue on navy).
- Minimum size 11 px, only for eyebrows; everything people need to read is 12.5 px or more.

## 4. Space, shape, layout

- **Shape:** round and soft. Pills (`999px`) for every button, chip, tag, input and switch. Cards and panels use `--raio` (24 px); photos inside cards 18 px; list rows 16–18 px; the header bubble 28 px; the challenge band 32 px. Pins, photo pins and the location dot are circles.
- **Elevation:** soft navy-tinted shadows, never grey. `--sombra` for cards on the page, `--sombra-leve` for small controls; floating panels over the map use a deeper `0 14px 40px` navy shadow at 22%. Every glass surface also has its 1 px `--vidro-borda` edge.
- **Spacing:** steps of 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 26, 32, 56 px. The map overlays sit 14 px from the screen edges; pages use a 16–20 px side gutter.
- **Breakpoints:** desktop from 900 px (the card floats beside the map); below 900 px it becomes a bottom sheet; dragging the card only from 1025 px with a mouse. Small-phone tweaks at 600 and 640 px.
- **Map page at 1440:** the map fills the screen. Floating on top: the header bubble (logo + "Procurar"), top left; the 438 counter, top right; the filter row under the bubble; the fountain card, 380 px wide, under the header on the left; zoom and location, bottom right; "Enviar foto", bottom left.
- **Content pages** (home, upload): a centred column, 1100 px for the home page, 560 px for the upload form.

## 5. The wave (signature)

The Mar Largo wave from Rossio's pavement survives v2 as the brand mark, drawn small:

| Where | Look |
| --- | --- |
| Logo drop | Two white wave lines inside a water drop (aqua → cobalt gradient), left of the wordmark |
| Favicon | Two white wave lines on a navy square |
| Home hero | The swirling water itself (the Tejo and the sea moving under Lisbon's silhouette) is the wave at full scale |

Use it as the logo, not as a texture or frieze. The v1 header frieze and map river strokes are retired.

## 6. Status (pins, cards, answers)

Status comes from people's answers (section 8, "O que sabemos"). The newest answer wins.

| State | On the map | In the card |
| --- | --- | --- |
| Bebedouro, no answer | cobalt dot, white ring; 4 px far out → 8 px at street zoom | "Ainda ninguém disse" |
| A funcionar | same cobalt dot (working is the normal case, so it doesn't shout) | "A funcionar · há 2 h" |
| **Avariado** | **red dot**; from zoom 15 it grows to 11 px and carries a **white ✕** | ✕ icon + **"Avariado · há 2 h"** in red |
| With a photo, out of a cluster | round photo pin, 56 px easing to 50 px, white border, cobalt ring | the album |
| Photo pin, avariado | red border + a **red ✕ badge** on the top-right corner; screen readers hear "…, avariado" | as above |
| Selected | navy ring around the dot; photo pins grow 14 px with a navy and white double ring | — |
| Chafariz / bica (heritage) | white dot with a cobalt ring (the reverse of a bebedouro) | eyebrow "Chafariz" / "Bica" and a note on drinkability |
| Cluster | cobalt circle with a soft cobalt halo and a white count | — |

- **Never by colour alone.** Red always comes with the ✕ shape, and with the word wherever there's text.
- Taça and garrafa answers don't change the pin; they show in the card and drive the filters.
- Times are relative: "agora mesmo", "há 5 min", "há 3 h", "ontem", "há 4 dias", then month and year.

## 7. Icons

**Lucide** line icons (ISC licence), drawn inline as SVG in `currentColor`: 24 px grid, 2 px stroke, round caps and joins. Shown at 18 px by default, 15–17 px in chips and tags, 20 px in the card's questions, 28 px in empty states.

| Meaning | Lucide icon | Our name |
| --- | --- | --- |
| Bebedouro | droplet | `gota` |
| Chafariz / bica | landmark | `chafariz` |
| Acessível | accessibility | `acessivel` |
| Taça (animal bowl) | dog | `taca` |
| Garrafa (bottle tap) | milk / bottle | `garrafa` |
| A funcionar | circle-check | `funciona` |
| Avariado | circle-x | `avariado` |
| Foto | camera | `camara` |
| Procurar | search | `lupa` |
| Distância a pé | footprints | `andar` |
| Como lá chegar | navigation | `mapa` |
| Em destaque, notas | sparkles | `brilho` |
| Fechar, anterior, seguinte | x, chevron-left, chevron-right | `x`, `esq`, `dir` |

- Icon discs (home steps, search results): navy circle, light blue icon, 1 px cobalt inner edge.
- **Emoji:** never in the interface. Apple emoji can't be shipped to other platforms (licence). Any emoji use outside the UI is still open.

## 8. Components

### Buttons: one primary per screen
- **Primary, "brilho":** navy pill, 52 px tall, white text, a cobalt light that runs slowly around its edge, with a faint sheen inside. On hover or keyboard focus the light widens and brightens to light blue. **Exactly one per screen**: "Abrir o mapa" (home), "Enviar foto" (map), "Enviar foto" (upload form), "Continuar" (leave dialog). When disabled it stays a still, flat navy pill (no light, no motion), so the screen keeps its one primary in place.
- **Secondary (every other button):** frosted glass pill, 48 px tall, ink text, 1 px glass edge, soft navy shadow; a touch more opaque on hover. On the dark hero and the navy challenge band it turns almost solid white.
- Icons sit left of the label, 8 px apart.

### Header bubble (map and upload pages)
A frosted glass bubble, 28 px radius, holding the wordmark and one pill on the right: "Procurar" with a `/` key hint on the map, "Ver o mapa" on the upload page. The pill turns navy while open.

### Search (map)
"Procurar" opens a panel inside the header bubble, like an accordion: a pill input, then up to 8 results (icon disc + name + address). While it's open the filters and counter hide. `/` opens it, Esc closes it.

### 438 counter (map, desktop)
A glass pill, top right: camera icon, "**N** de 438 bebedouros com foto", and a thin bar (navy → cobalt gradient). Hidden below 900 px.

### Filter chips and the "Com foto" switch
- **Chips:** glass pills, 36 px, icon + word: Bebedouros, Chafarizes e bicas (off by default), Só acessíveis, Taça, Garrafa, A funcionar. **Active** = navy with the cobalt inner edge and white text; the icon gives a small pop when switched on.
- Taça, Garrafa and A funcionar only match fountains someone has answered for. If a filter leaves the map empty, a note explains it: "Ainda ninguém confirmou isto num bebedouro. Abre um e responde!"
- **"Com foto" is a switch, not a chip:** camera, label, then a 34 × 22 px track with a white knob; navy with a cobalt edge when on. A thin divider sets it apart; on phones it comes first in the scrolling row.

### Fountain card
A glass panel, 380 px on desktop, under the header; a bottom sheet on phones. From top to bottom:
1. **Grip bar:** eyebrow with the type and icon ("BEBEDOURO"), close ✕. On desktop with a mouse, drag the card by this bar; double-click puts it back.
2. **Album:** the newest photo, 220 px tall (vertical photos shown whole), credit and date in a dark pill bottom-left, n/N bottom-right, round prev/next buttons, and a strip of 46 px thumbnails. Click opens the viewer. **Empty album:** a tinted panel with a camera, "Ainda sem fotos. Sê o primeiro!" and a line of invitation.
3. **Name** (Bricolage 23) and address.
4. **Walking distance** if location is on: footprints, "6 min a pé · 450 m" (straight line at 80 m/min, so it's an estimate).
5. **Tags:** e.g. "Acessível a mobilidade reduzida" (tinted pill with icon).
6. **O que sabemos** (bebedouros only): see below.
7. **Actions:** "Enviar foto" (the screen's primary) and "Como lá chegar" (secondary; opens the walking route in Google Maps).

### O que sabemos (answers)
Three questions, in this order: **A funcionar**, **Taça para animais**, **Torneira para garrafas**. Each row: 20 px icon, the question, the newest answer and when ("Tem · há 3 dias", "Ainda ninguém disse"), and two small pills, **Sim** and **Não**. The pill matching the current answer is navy. "Avariado" is red with the ✕ icon. Below: "Passaste por cá? Responde e ajudas quem vem a seguir." A tap shows straight away and a note confirms "Obrigado! Já está no mapa." No account needed (yet).

### Photo viewer
Full screen, near-black. The photo is centred with prev/next on the sides (bottom on phones), close top right, caption and n/N below. **Click the photo or the dark area to close** (zoom-out cursor); Esc closes; arrows and swipes move through the album.

### Notes (toasts)
A navy pill with a cobalt edge and a sparkles icon, centred near the bottom, gone after 4 seconds. Used for confirmations and gentle explanations, never for errors that need action.

### Dialog ("Sair sem enviar?")
A glass panel over a blurred navy veil, 24 px radius. Title in Bricolage, one line of text, then the secondary ("Sair") and the primary ("Continuar", focused, the safe choice).

### Upload form
Numbered sections ("1 · A foto", "2 · Qual é?", "3 · Quem tirou") with cobalt numbers in uppercase eyebrows. The photo picker is a dashed cobalt tile on the tint. Fountain options are white rows with a radio dot that turn tinted with a cobalt edge when chosen. Inputs are 48 px pills with a cobalt focus glow. The send button is the full-width primary.

### Home page
- **Hero:** the swirling water (navy → cobalt → aqua) with Lisbon's silhouette over it and the 438 fountains as glowing aqua dots; centred logo, no nav links; a glass eyebrow ("438 bebedouros públicos em Lisboa"), the big title, a line of copy, then "Abrir o mapa" (primary) and "Enviar uma foto" (secondary). A soft dark halo behind the text keeps it readable. If WebGL can't run, soft aqua and violet glows replace the swirl.
- **Numbers:** three white cards (438 bebedouros, 101 chafarizes, 106 bicas), numbers in cobalt Bricolage.
- **Como funciona:** three white cards with navy icon discs.
- **O desafio dos 438:** a navy band with a cobalt glow, the count, a progress bar (cobalt → light blue) and a secondary button.
- **Footer:** data and map credits, and the independence line.

### Map style
OpenFreeMap Liberty, recoloured toward the brand: pale cool ground `#F1F4FA`, blocks `#E6EBF5`, buildings `#E1E7F2`, white streets with `#D7DFEF` casing, mint parks `#D9EFDB`, cobalt-tinted water `#CAD7FD`, rail `#C6CEE0`, labels `#5B6380`; points of interest faded. Keep the OpenFreeMap and OpenStreetMap attribution visible, bottom right. Map controls are glass pills.

## 9. Mobile (companion)

- **Header:** the bubble spans the width; the 438 counter hides; the filter row scrolls sideways with "Com foto" first.
- **Card:** a bottom sheet (up to 68% of the screen) whose content scrolls inside; the map eases so the chosen fountain stays visible above it. No dragging on phones and tablets.
- **"Enviar foto"** centred at the bottom while no card is open.
- **Tap targets:** at least 44 px for main actions; the Sim / Não pills are 32 px tall inside a 44 px row.
- Respect the safe areas (notch, home bar).

## 10. Motion and accessibility

- **Motion:** the card rises in (0.22 s); the search panel drops in (0.18 s); chip icons pop when switched on; photo pins resize smoothly with zoom; the primary button's light runs continuously, faster on hover. **Under `prefers-reduced-motion` all of it stops**, including the primary's light.
- **Focus:** a 2 px cobalt outline with a 2 px offset on every interactive element.
- **Status:** never by colour alone (section 6).
- **Language:** `lang="pt-PT"`; buttons that are only icons have Portuguese labels ("Fechar", "Foto anterior").
- **Not yet met:** a list view that reaches every fountain (Block 4 requirement; open, section 12).
- **Contrast:** WCAG 2.1 AA minimum; measured values in section 2.

## 11. Tokens (CSS)

The source of truth is the top of `assets/site.css`. Copied here for reference:

```css
:root {
  --chao: #FFFFFF;             /* cards and controls */
  --fundo: #F4F6FB;            /* page ground */
  --basalto: #0B1020;          /* text */
  --cinza: #5D6478;            /* secondary text */
  --linha: rgba(11,16,32,.09); /* hairline borders */

  --abismo: #050F38;
  --noite: #071447;
  --azul-profundo: #0E2A9A;
  --azul: #2457F5;
  --azul-texto: #1D46D1;
  --azul-claro: #7FB2FF;
  --agua: #5AD2F4;
  --azul-fundo: #EDF2FF;
  --erro: #D3263A;             /* red only ever means broken */

  --sombra: 0 1px 2px rgba(11,16,32,.06), 0 8px 28px rgba(11,16,32,.10);
  --sombra-leve: 0 1px 2px rgba(11,16,32,.06), 0 2px 8px rgba(11,16,32,.06);
  --raio: 24px;

  --vidro: rgba(255,255,255,.82);
  --vidro-forte: rgba(255,255,255,.86);
  --vidro-borda: rgba(11,16,32,.08);
  --desfoque: saturate(1.6) blur(14px);

  --display: "Bricolage Grotesque", "Inter", system-ui, sans-serif;
  --texto: "Inter", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
}
```

**Hex values repeated outside CSS** (change them together with the tokens):
- `mapa/index.html`: pin cobalt `#2457F5`, broken red `#D3263A`, selected ring `#071447`, and the base-map colours (section 8, map style).
- `index.html` hero and `assets/mar.js` / `assets/lisboa-pixels.js`: the blue scale.
- The favicon and logo drop SVGs: `#071447`, `#5AD2F4`, `#2457F5`.

## 12. Open and not yet designed

- **List view** reaching every fountain, with the same search and filters (needed for accessibility).
- **Perto de mim:** the nearest-3 cards (today there is only the map's location button).
- **Heat header** (IPMA maximum and warnings): v1's spec still describes the data; it needs a v2 look (probably a glass pill beside the counter).
- **English** version at `/en`, and the Sobre page.
- **Names on answers:** Google sign-in or accounts, and how a name shows next to an answer.
- **Dark map:** the base map stays light in dark mode.
- **Tagline and hero copy** after the competitor findings (10 Oct); the hero currently says "Mata a sede."
- **Emoji** outside the interface.
