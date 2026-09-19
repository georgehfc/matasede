# Mata-Sede

**O mapa que Lisboa nunca fez.**

Lisboa tem mais de 400 bebedouros públicos, mas não há um mapa para os encontrar. O Mata-Sede junta-os todos num só mapa, pensado para o telemóvel: encontra o bebedouro mais perto, vê fotos recentes e sabe se está a funcionar antes de lá chegares.

🌐 [matasede.pt](https://matasede.pt) · Em construção, lançamento previsto para a primavera de 2027.

## O que vais poder fazer

- Ver no mapa os 438 bebedouros da cidade, e ainda chafarizes e bicas históricas.
- Filtrar por taça para cães 🐕, torneira para garrafas 🍶 e acessibilidade ♿.
- Ver o álbum de fotos de cada bebedouro, tiradas por quem passa.
- Adicionar as tuas fotos e avisar quando um bebedouro está avariado.
- Nos dias de calor, encontrar também os refúgios climáticos da cidade.

## Os dados

A base do mapa são os dados abertos da Câmara Municipal de Lisboa. Fotos e estado de cada bebedouro vêm de quem usa o Mata-Sede.

| Ficheiro | O que é |
| --- | --- |
| `data/pontos.geojson` | 438 bebedouros, 101 chafarizes, 106 bicas e 3 pontos de nevoeiro |
| `data/raw/` | O ficheiro original da Lisboa Aberta, sem alterações |
| `scripts/converter.py` | Converte o ficheiro original no mapa: `python3 scripts/converter.py data/raw/<ficheiro>.csv` |

## Créditos

- Dados base: Câmara Municipal de Lisboa, [Lisboa Aberta](https://dados.cm-lisboa.pt/) (Public Domain Mark 1.0).
- Mapa: OpenFreeMap © OpenMapTiles, dados © contribuidores do OpenStreetMap.

O Mata-Sede é um projeto independente, sem afiliação à Câmara Municipal de Lisboa, à EPAL ou ao GEOTA.

---

## In English

**Mata-Sede: the map Lisbon never made.** Lisbon has over 400 public drinking fountains but no map to find them. Mata-Sede puts all of them on one mobile-first map, with recent photos and whether each one is working. Base data comes from the Lisbon City Council's open data portal; photos and status come from the people who use it. Launching spring 2027 at [matasede.pt](https://matasede.pt).

© 2026 Mata-Sede. Todos os direitos reservados. All rights reserved.
