# Mata-Sede — Context and decision log

Everything decided before the repo existed, written down so nobody has to remember a chat. Updated 6 Oct 2026.

Read order for a new session: `CLAUDE.md` → `docs/SPEC.md` → `DESIGN.md` → this file.

## Where the project came from

The founder built a bootcamp exercise called *Bebedouros de Lisboa* (a static page with a hard-coded list and a Leaflet map) that looked semi-official because it carried the CML logo. Mata-Sede is its replacement: an independent product, new repo, new name, new design system. The old repo stays online as a portfolio piece and is never referenced here.

The founder is a web designer with minimal programming experience. The project must stay maintainable by editing data and copy, not code.

## Why this project exists (research, Sep 2026)

- Lisbon's open data lists **438 bebedouros**; an August 2024 article counted 411, so the network is still growing.
- **200 of them** come from the EPAL/CML/GEOTA network launched in January 2020, with a budget of about €800,000. The new units combine a drinking jet, a bottle tap, an animal bowl and reduced-mobility access.
- The launch (Time Out Lisboa, 27 Jan 2020) promised all 200 **by 2021**, tied to Lisbon's year as European Green Capital 2020. The first unit went in on **Avenida da Liberdade**, with 30 more in the first phase. Presented at EPAL headquarters by José Sá Fernandes, the councillor for environment. Stated aim: promote tap water and good water management in the city. Each unit is designed for children, adults and people with reduced mobility, and also has a bowl for pets.
- The rollout was slow: in mid-2022 only about 30 were installed, a 15% completion rate at that point.
- **There is no usable public map.** EPAL's *H2O Quality* app has disappeared from Google Play and no longer works on iOS. In the city's open data portal the fountains are filed under "elementos de água", so searching for "bebedouro" finds nothing. Neighbouring Cascais publishes a fountain map; Lisbon does not.
- **Nobody tracks which fountains work.** The official data has no condition field. This is the gap Mata-Sede fills with photos and reports.
- About **half** of the official fountains are marked accessible for reduced mobility (exactly 200 of 438 — see the "nova rede" hypothesis in SPEC.md).
- **Heat is the seasonal hook.** During the July 2026 heat wave Lisbon opened 49 climate refuges, and Monsanto was closed from 3 to 6 July over fire risk. The city's own advice includes drinking water before you feel thirsty.
- **Tap water is good.** EPAL water comes mainly from Castelo do Bode on the Zêzere, plus the Tagus at Valada and groundwater; nationally 98.77% of mainland tap water is rated safe.
- **Heritage angle:** the Aqueduto das Águas Livres, the old chafarizes and the aguadeiros who carried water through the city. EPAL is restoring chafarizes alongside the new network. The open data includes 101 chafarizes and 106 bicas, which become our heritage layer.
- **Civic reporting precedent:** *Na Minha Rua LX* is the city's own reporting portal (since 2017) and explicitly covers fountain maintenance. Deferred for now by decision (see below), but it is where official complaints belong.
- **Crowdsourcing precedent:** the Refill app lists over 295,000 water points worldwide and moderates every submission before it appears.
- **Wildfire reporting is deliberately out of scope:** that space is well covered (for example fogos.pt, refreshed every two minutes from civil protection data), and real emergencies belong to 112.

Sources are named rather than linked because links rot; search the outlet plus the fact. Main sources: Lisboa Aberta (dados.cm-lisboa.pt), Lisboa para Pessoas, Time Out Lisboa, Mensagem de Lisboa, EPAL, ERSAR, Câmara Municipal de Lisboa.

## Decision log

| Date | Decision |
| --- | --- |
| 19 Sep 2026 | Name **Mata-Sede**, always hyphenated, including the logo. Tagline: *o mapa que Lisboa nunca fez*. |
| 19 Sep 2026 | Independent project: no CML or EPAL logos, no implied endorsement. The footer disclaimer line was dropped; the Sobre page carries the statement instead. |
| 19 Sep 2026 | Lisboa Aberta "elementos de água" is the foundation layer; Mata-Sede never edits official rows, only adds photos, status and reports. |
| 19 Sep 2026 | Static-first: official points ship as a file with the site; Supabase only holds photos and reports. |
| 19 Sep 2026 | Reports stay private to Mata-Sede. No link to Na Minha Rua LX in v1; the founder may batch-report cases manually. |
| 19 Sep 2026 | Show all 438 fountains by default, old and new network alike. |
| 19 Sep 2026 | Map style: OpenFreeMap **Liberty**, restyled to the brand. No API-key services. |
| 19 Sep 2026 | Repo `matasede` with **no licence** for now (all rights reserved). Revisit between MIT and AGPL-3.0 later. |
| 19 Sep 2026 | Domain matasede.pt registered. Supabase project created (EU region). |
| 20 Sep 2026 | Design system: Clay's structure and typography, Refill's colours, calçada naming (limestone, basalt), Mar Largo wave as the Lisbon signature. *(Superseded 3 Oct 2026.)* |
| 20 Sep 2026 | Icons: Fluent Emoji files (MIT), never system emoji. 🍶 replaced by 🚰 because 🍶 is a sake bottle. *(Superseded 3 Oct 2026.)* |
| 20 Sep 2026 | PamPam integration shelved: it can't hold data we want to own, and it's a competitor for the generic points engine. |
| 3 Oct 2026 | **Desktop-first.** The main experience is exploring at a monitor; mobile is the companion for "where's water now" and photos, and must still work at 375 px. Replaces mobile-first. |
| 3 Oct 2026 | **Design system v1.0 (direction D):** cobalt on tin-glaze white from azulejo, Archivo Black + Archivo from the calçada, structure from the signage sketch (weather in the header, nearest-fountain cards), Mar Largo wave as signature. DESIGN.md rewritten. |
| 3 Oct 2026 | **Icons:** drawn geometric SVGs replace Fluent Emoji in the interface. Emoji only for occasional playful moments outside the UI, case by case. |
| 3 Oct 2026 | **Location scope:** browser geolocation, nearest first, straight-line distance and ≈ walking minutes, "Como chegar" hands off to the phone's maps app. No in-app routing. |
| 3 Oct 2026 | **Heat header pulled into Block 4** as a proof of concept, reading IPMA open data in the browser (Lisboa codes: warnings `LSB`, forecast `1110600`; no key, CORS open). Full heat mode stays later. |
| 3 Oct 2026 | **Search** covers fountain names and addresses only (no geocoding service). **"Como chegar" on desktop** opens the walking route in Google Maps in a new tab; no QR handoff. |
| 3 Oct 2026 | **Seed albums in Block 4:** the founder's 44 located photos (27 fountains) show in the detail album, resized and with camera data stripped by `scripts/fotos.py`. "Com fotos" filter is live. |
| 3 Oct 2026 | **Map pins round and filled; "Sem informação recente" dropped.** Dashed squares were illegible zoomed in and the label was vague. Pins grow with zoom, show ♿/drop glyphs from zoom 16 and photo thumbnails from zoom 15. Photos open in a modal viewer (Esc, Fechar, full screen), not a new tab. |
| 3 Oct 2026 | **CML photos: link only.** The 18 CML photos that match a fountain appear as "Ver foto no site da CML ↗" links; we never copy or embed CML images (rights unclear, independence). |
| 5 Oct 2026 | **matasede.pt went live early** from the `gh-pages` branch: a small separate site (holding page, `/mapa/`, `/enviar/` photo upload on Supabase, `supabase/` SQL). The database refuses photos without GPS or more than 50 m from a bebedouro, using a private `bebedouros` table (id + position only). |
| 6 Oct 2026 | **Seed photos moved to Supabase.** 43 of the founder's photos (26 fountains) uploaded through the same path as `/enviar/`, credited "George Chaves", approved. Left out: Pavilhão do Conhecimento (72 m away) and Rua do Caribe (no GPS). |
| 6 Oct 2026 | **One site, built from `block-4/map`.** It follows DESIGN.md, the spec and the accessibility rules; `gh-pages` was a quick launch. Until the switch, `gh-pages` stays live and gets small fixes only. Before the switch, `block-4/map` takes over from `gh-pages`: photos read from Supabase (the only photo source, so the repo's `fotos/` copies and static seed albums go; supersedes the 3 Oct seed-albums line), `/enviar/` restyled to DESIGN.md, `supabase/` SQL and `scripts/gerar_sql.py`, and old `/mapa/?ponto=<id>` links redirect to the new fountain URL. Then merge to `main`, point GitHub Pages at `main`, and delete `gh-pages` a week later. |
| 9 Oct 2026 | **Live map filters:** heritage (chafarizes e bicas) off by default; chips carry the drawn icons; Taça, Garrafa and A funcionar show greyed out and explain "em breve" when clicked; **"Com fotos" is an on/off switch, not a chip** (DESIGN.md updated). |
| 10 Oct 2026 | **CML photos: copy them (reverses 3 Oct "link only").** Founder's call, aware the rights are unclear. 17 of the 23 photos in CML's bebedouro directory downloaded (6 blocked by their server); they go into Supabase credited to the Câmara Municipal de Lisboa. Pages that refuse automated access are not worked around. |
| 10 Oct 2026 | **Competitors found:** bebedouros.pt (bernzrdo, GPLv3, Leaflet, CML data) and bebedouroslisboa.onrender.com (Google Maps, Funciona/Avariado voting, suggestions, Google login), both launched in the summer 2026 heat wave. "There is no working public map" and the tagline need rethinking before launch. |
| 10 Oct 2026 | **Type and icons:** Bricolage Grotesque (logo, titles) + Inter (everything else) replace Archivo. Lucide line icons (ISC) in the interface; Apple emoji can't be shipped to other platforms (licence), so emoji use is still open. Fountain card is draggable (bottom sheet on phones). |
| 10 Oct 2026 | **Design v2 live on matasede.pt** (gh-pages): glass surfaces and pill shapes; one blue scale (abismo #050F38, noite #071447, azul-profundo #0E2A9A, azul #2457F5, azul-texto #1D46D1, azul-claro #7FB2FF, agua #5AD2F4); **one primary per screen**, the "brilho" button (navy, cobalt light running round its edge, still when disabled); every other button a frosted, slightly see-through pill; home hero = ocean swirl with Lisbon's silhouette and the 438 fountains as glowing dots, centred logo, no nav links; drawer drags on desktop only; Esc leaves the upload page (asks if the form is filled). Supersedes DESIGN.md v1.0's flat/no-shadow rules; DESIGN.md v2 still to be written. |
| 10 Oct 2026 | **Reports live (anonymous):** the fountain card asks *A funcionar*, *Taça para animais* and *Torneira para garrafas* with Sim / Não; anyone can answer, no account, and answers show straight away (newest answer wins). A random per-browser id replaces your own answer within a day and caps 30 answers an hour; bad answers are deleted in the `reports` table. Broken fountains turn red; the Taça, Garrafa and A funcionar filters are live. Names later via Google sign-in or accounts. The failing *Verificar fotos* GitHub Action was disabled. |

## Still open

- Photo licence: CC BY 4.0 or CC0?
- May contributors suggest fountains that aren't in the official data?
- Repo licence, once the engine is worth protecting.
- Verify the "nova rede = accessible" hypothesis by checking three NÃO fountains in person.
- Find a stable download URL for the Lisboa Aberta export (for the monthly update Action).
- The official list of 49 climate refuges as coordinates.
- Which fountains the two seed photos without GPS show (`5EF80971…`, `C238FCB2…` in `data/fotos-semente.json`).

## Marketing plan (for Block 6, May 2027)

- **Launch story:** the research above is the pitch. Lisboa para Pessoas and Mensagem de Lisboa have both covered the missing map and the heat; offer them the answer.
- **The 438 challenge:** a public counter ("87 de 438 bebedouros fotografados") gives contributors a reason to join and a number journalists can quote.
- **Content:** "Bebedouro da semana", "Tens sede?" street interviews in July, dogs drinking. Vertical phone video, pt-PT.
- **Don't** put stickers on the fountains: it is public property, and the project tracks their condition.
- Timing: build through the winter, launch May or June 2027, before the heat season.

## The bigger idea (after v1)

The data model is deliberately generic (`points` + `photos` + `reports`, one `vertical` per project), so the same engine can run sibling maps: graffiti or sticker spotting (easy, playful), potholes and broken pavement (overlaps with Na Minha Rua LX), badly parked cars (number plates are personal data, so blur them). Wildfire reporting is excluded.
