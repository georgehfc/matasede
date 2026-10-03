# Mata-Sede — Context and decision log

Everything decided before the repo existed, written down so nobody has to remember a chat. Updated 20 Sep 2026.

Read order for a new session: `CLAUDE.md` → `docs/SPEC.md` → `DESIGN.md` → this file.

## Where the project came from

The founder built a bootcamp exercise called *Bebedouros de Lisboa* (a static page with a hard-coded list and a Leaflet map) that looked semi-official because it carried the CML logo. Mata-Sede is its replacement: an independent product, new repo, new name, new design system. The old repo stays online as a portfolio piece and is never referenced here.

The founder is a web designer with minimal programming experience. The project must stay maintainable by editing data and copy, not code.

## Why this project exists (research, Sep 2026)

- Lisbon's open data lists **438 bebedouros**; an August 2024 article counted 411, so the network is still growing.
- **200 of them** come from the EPAL/CML/GEOTA network launched in January 2020, with a budget of about €800,000. The new units combine a drinking jet, a bottle tap, an animal bowl and reduced-mobility access.
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

Sources are named rather than linked because links rot; search the outlet plus the fact. Main sources: Lisboa Aberta (dados.cm-lisboa.pt), Lisboa para Pessoas, Mensagem de Lisboa, EPAL, ERSAR, Câmara Municipal de Lisboa.

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
| 20 Sep 2026 | Design system: Clay's structure and typography, Refill's colours, calçada naming (limestone, basalt), Mar Largo wave as the Lisbon signature. *(Under review, Oct 2026 — see docs/design/IDEATION.md.)* |
| 20 Sep 2026 | Icons: Fluent Emoji files (MIT), never system emoji. 🍶 replaced by 🚰 because 🍶 is a sake bottle. *(Under review.)* |
| 20 Sep 2026 | PamPam integration shelved: it can't hold data we want to own, and it's a competitor for the generic points engine. |

## Still open

- Photo licence: CC BY 4.0 or CC0?
- May contributors suggest fountains that aren't in the official data?
- Repo licence, once the engine is worth protecting.
- Verify the "nova rede = accessible" hypothesis by checking three NÃO fountains in person.
- Find a stable download URL for the Lisboa Aberta export (for the monthly update Action).
- IPMA warnings feed: exact URL, format and Lisboa district code.
- The official list of 49 climate refuges as coordinates.

## Marketing plan (for Block 6, May 2027)

- **Launch story:** the research above is the pitch. Lisboa para Pessoas and Mensagem de Lisboa have both covered the missing map and the heat; offer them the answer.
- **The 438 challenge:** a public counter ("87 de 438 bebedouros fotografados") gives contributors a reason to join and a number journalists can quote.
- **Content:** "Bebedouro da semana", "Tens sede?" street interviews in July, dogs drinking. Vertical phone video, pt-PT.
- **Don't** put stickers on the fountains: it is public property, and the project tracks their condition.
- Timing: build through the winter, launch May or June 2027, before the heat season.

## The bigger idea (after v1)

The data model is deliberately generic (`points` + `photos` + `reports`, one `vertical` per project), so the same engine can run sibling maps: graffiti or sticker spotting (easy, playful), potholes and broken pavement (overlaps with Na Minha Rua LX), badly parked cars (number plates are personal data, so blur them). Wildfire reporting is excluded.
