# Mata-Sede: design reset (ideation, Oct 2026)

The DESIGN.md v0.1 preview (20 Sep) is not good enough yet. This file explains why, collects the references, and sets up three directions to sketch in Paper.

Paper file: **Mata-Sede — Ideação** (https://app.paper.design/file/01M41A9NY8JF544QDBJED9Z4BK)

## Why v0.1 reads as AI slop

1. **The palette is the 2019–2024 SaaS palette.** Navy ink with electric periwinkle (#5A5EEB), lime (#D8FF3E) and coral (#FF5A36) on warm cream is the default "friendly startup" palette. Nothing in it comes from Lisbon or from water.
2. **The identity is borrowed.** "Clay's structure + Refill's colours" says it outright: it is a mix of two other brands. The calçada names (limestone, basalt) are only labels on generic swatches.
3. **The Lisbon signature is decoration.** The Mar Largo wave only shows up as a 6% opacity footer strip. It never shapes the layout, the pins or the map.
4. **The components are kit parts.** Teardrop pins, pill chips, 24px-radius cards, a floating search pill and a bottom sheet with a grab handle. All are competent, and none of them is ours.
5. **3D Fluent emoji do the brand work.** Glossy emoji are the most recognisable "generated" marker there is. They also clash with a civic, factual tone.
6. **Inter for display.** Inter stands in for Clay's Plain Black, so the headline voice is just the default UI voice.
7. **The marketing cards are the usual four.** One colour block each (blue, lime, dark, stone) with a big number and a short line is the landing-page template.

What v0.1 got right and we keep: map-first, the photo album as the differentiator, status always shown as a word plus a mark (never colour alone), pt-PT copy, the 438 counter, the heat hook and the heritage layer (101 chafarizes, 106 bicas).

## Facts to design with (from `data/`)

- 438 bebedouros, 101 chafarizes, 106 bicas and 3 nevoeiros.
- 200 of 438 are marked accessible, exactly the nova rede.
- 46 seed photos from the founder.
- No official condition field, so every status comes from us. **"Sem info" is the default state for about 90% of pins at launch**, and the design has to make that look honest and inviting, not broken.

## References (real, from Lisbon and from water)

**Material and street**
- **Calçada portuguesa**: white limestone and black basalt set by hand. Two colours, irregular cobbles and a joint grid. Rossio's *Mar Largo* is the famous wave.
- **Chafarizes and bicas**: lioz limestone, bronze spouts, verdigris stains under the tap, carved dates and inscriptions.
- **Aqueduto das Águas Livres**: repeated arches, a strong rhythm and a horizontal line.
- **Street plaques**: dark lettering in a bordered frame. *Careful: copying official signage implies endorsement. Borrow the logic, not the look.*
- **Azulejo**: cobalt on tin-glaze white, painted by hand and a little uneven. Maria Keil's metro station tiles are the modernist version.
- **Carris trams**: chrome yellow on cream, with a utilitarian number board.
- **Aguadeiros**: barrels, a water seller's call and route. A possible illustration or mascot thread.

**Product**
- Refill app: the closest competitor. Note what it does and avoid looking like it.
- Transit and Citymapper: dense wayfinding where icons carry meaning and type is functional.
- Mensagem de Lisboa and Lisboa para Pessoas: the editorial tone of our launch outlets.

## Three directions to sketch

Each direction gets the same test content: **the mobile map with one selected fountain (Praça das Flores, a working one with 3 photos)** plus **one launch poster**, so we can compare them like for like.

### A. Calçada (two-tone, almost brutalist)
- Pure white ground, basalt black, and **one** water accent used only for working fountains.
- The map is restyled to two tones like pavement. Pins are cobbles (squares rotated a little off-grid), not teardrops.
- The wave is structural: it's the loading state, the "sem info" texture and the sheet edge.
- Type: a heavy grotesk for display and a plain grotesk for UI, with tabular numerals.
- Risk: it can feel cold. The fix is warm copy and real photos.

### B. Azulejo (painted, editorial)
- Tin-glaze white with cobalt, painted by hand.
- Status marks look brushed (a stroke, a cross, a dot) rather than vector-perfect. The heritage layer gets tile frames.
- Type: a serif display (editorial, a bit literary) paired with a grotesk UI.
- Risk: it could look touristy or official. Avoid plaque shapes and keep the painting loose.

### C. Sinalética de calor (signage, urgent)
- Ink black with chrome yellow, the tram and road-sign family. Heat mode inverts it.
- Wayfinding pictograms replace the 3D emoji. Distance and minutes are set big in a mono or tabular face, like a departure board.
- Built for a sweaty tourist in July: one glance, one action.
- Risk: it could feel aggressive outside the summer. Test a calmer winter state.

## Open questions for the founder
- Keep Fluent emoji anywhere (fun moments only), or drop them entirely for drawn pictograms?
- Keep the "Mar Largo" wave as the signature regardless of direction?
- How much should the heritage layer (chafarizes, aguadeiros) drive the brand versus sit as an extra map layer?

## Sketch round 1 (3 Oct 2026)

All three are in Paper, page "Direções A · B · C", as a mobile map plus a poster for each. The wave appears in all three.

| | Fonts | Wave role | Emoji |
| --- | --- | --- | --- |
| A Calçada | Archivo Black + Archivo | the Tejo, the sheet edge, the poster base | one small Fluent 3D droplet on the poster (the minimal-emoji proposal) |
| B Azulejo | Instrument Serif + Instrument Sans | river brushstrokes, the cobalt tile frieze above the sheet, one poster tile | none |
| C Sinalética | Big Shoulders Display + IBM Plex Mono/Sans | the heat-warning band, the poster rule | none; drawn pictograms instead |

Answers so far: Fluent emoji stay at a minimum (A tests one); the Mar Largo wave stays as the signature.

Not yet done: the "Sem info" invite state, a winter (non-heat) state for C, and making B's marks look truly brushed rather than vector.

Note: `CLAUDE.md`, `docs/SPEC.md` and `DESIGN.md` are not in this folder or on GitHub (`main` has only README, data and scripts).
