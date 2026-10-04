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

## Mobbin references, round 2 (4 Oct 2026)

Found with the Mobbin MCP. The references are for layout and behaviour only; the look stays ours (see "Why v0.1 reads as AI slop").

### Keep as they are
- **Map counters.** Clusters show a plain number badge ([Pangea Charging](https://mobbin.com/screens/f30de3e6-09d9-4012-b0f1-0de74c0208f3), [GetYourGuide web](https://mobbin.com/screens/7d8762de-2deb-4393-8667-dd8751d3b206)). That's the right read for 438 points at city zoom.
- **Photo thumbnails as pins.** A fountain with a photo shows it in the pin ([Places](https://mobbin.com/screens/04c21f71-a65c-4853-bbcc-e070a1718893), [GetYourGuide web](https://mobbin.com/screens/7d8762de-2deb-4393-8667-dd8751d3b206)). So the map itself shows which fountains are documented. Pins without a photo use the direction's plain mark.

### The selected fountain: a floating card
The founder's pick is [Zesty's floating card](https://mobbin.com/screens/48394a6d-1976-4981-a84a-833461930a9f). It's a photo-led card over the map, with a photo carousel (dots), the name, then one meta line (address · travel time · price), status as a word ("Open · Closes at 10:00 PM"), and a chip row. The next card peeks in on the right, so you swipe between nearby places.

Mata-Sede version:
- Photo carousel = the album. Meta line = `Rua da Imprensa · 3 min a pé · bebedouro`. Status line = `● A funcionar · confirmado há 2 dias`. Chips = the features (taça para cães, torneira para garrafas, acessível).
- The peeking card is the next-nearest fountain. Swiping through is "show me the closest water".
- No photo yet → the carousel area becomes the "Sem info" invite in the same size (see below).
- Don't copy its styling: dark gradient, glassy buttons and emoji chips are the kit look.

**On desktop** (≥1024px), the same card docks instead of floating:
- A left column lists nearby fountains, sorted by distance, each row with a thumbnail ([GetYourGuide](https://mobbin.com/screens/7d8762de-2deb-4393-8667-dd8751d3b206), [Sweatpals](https://mobbin.com/screens/4c4dfa1b-61c5-4d46-8b9f-bb678e55d47a)). This is the mobile swipe stack, laid out as a list.
- Selecting one opens the card as a second column next to the list, with the map still visible on the right ([komoot web](https://mobbin.com/screens/26b026be-708d-4218-b968-a338afba54a7) is the closest: list, then detail, then map). The photo carousel keeps the same proportions as on mobile.
- Between 640 and 1024px, the card floats next to its pin, like [Airbnb](https://mobbin.com/screens/4f8dca21-ac00-4bd0-88df-5e1f0b1f9554) and [Expedia](https://mobbin.com/screens/dcfcf9f1-a67d-43b5-bf24-3bcd57b6c2b1) do.
- Design it once as a component that can float or dock. Desktop visitors are likely press and planners, not thirsty people, so desktop can afford the list.

### "Sem info" as an invite
- The empty photo area keeps the album's size and shape, with a "+" where the first photo goes ([Placify](https://mobbin.com/screens/3cc388be-d7f9-4d7b-935a-9481ada919f2)). It gives a reason to help, as [AllTrails](https://mobbin.com/screens/07786e95-23cb-40fc-aedb-f6c26ab0f3e2) does ("help others know what to expect").
- Copy idea: *"Ainda ninguém fotografou este bebedouro. Diz-nos se tem água: 46 de 438 já têm foto."*
- Avoid the blank "no photos" screen ([Turo](https://mobbin.com/screens/d8e1438c-7d7c-4e7b-b286-ea8d8b225a24)).

### Reporting: three levels of effort
1. **One tap, in the card.** A small inline question, *"Tem água? Sim · Não"*, sits right in the card, like [corner's "is this place crowded?"](https://mobbin.com/screens/b3ef2e90-449e-4057-84d4-f6a18c1f8aac) and [Pangea's "How safe did you feel?"](https://mobbin.com/screens/8ef53b99-6720-4237-a9a4-0cdf3b1dfd7b). This is the cheapest way to turn "Sem info" into a status, and it should be the main way status gets filled.
2. **"Não" opens one screen of choices**, like [Bird's "What happened?"](https://mobbin.com/flows/4bb0fda2-0003-46b3-b0e0-9ab39d7a7721): *Sem água · Pouca pressão · Avariado · Sujo · Outro*, plus an optional photo. Then a short "thank you" banner, as in [Zomato](https://mobbin.com/flows/64cbc8cf-847b-43a0-a97a-9f68a521a7de).
3. **A quiet "Reportar outro problema" link** at the foot of the card, as in [Citymapper](https://mobbin.com/screens/b3751360-2dca-4534-aedf-b1c8db51ce79) and [Snapchat](https://mobbin.com/screens/fcb2c42a-e340-4e25-8b3d-63e26cf35874).

How status reads afterwards:
- Status always carries its age and source: `● A funcionar · confirmado há 2 dias por 3 pessoas`. [Transit](https://mobbin.com/screens/c84804a6-afbb-491a-8345-3811fea13cc1) does the same with "Updated just now by Metro and Transit".
- Transit's **"Crowding unknown"** tile is the model for "Sem info": an unknown shown calmly, as a normal state.
- The "thank you" must not promise a repair. Reports stay private, and nobody is sent to fix the fountain (unlike Bird's "our team will be notified"). Say what actually happens: *"Obrigado. O estado deste bebedouro foi atualizado."*

### Direction C notes
- Walking-time rings (5 min, 15 min) around the user, as in [Citymapper](https://mobbin.com/screens/3b34e7a1-b4eb-4b97-b0d5-bbb0b34e8d6c).
- Walk minutes set big and right-aligned in each row, like the [Citymapper Nearby list](https://mobbin.com/screens/7bed41db-91b3-445c-ac01-092874f4f1af). Plex Mono.
- The winter state is the same list and rings without the heat band.
