# Mata-Sede

**O mapa que Lisboa nunca fez.** Todos os bebedouros públicos de Lisboa num só mapa, mantido por quem os usa.

*The map Lisbon never made: every public drinking fountain in Lisbon on one map, kept current by the people who use them.*

> Projeto independente. Sem afiliação à Câmara Municipal de Lisboa, EPAL ou GEOTA.

## Estado / Status

Bloco 2 de 7: dados base. O site ainda não existe neste repositório.

## Conteúdo / Contents

| Caminho | O que é |
| --- | --- |
| `data/pontos.geojson` | 438 bebedouros, 101 chafarizes, 106 bicas e 3 pontos de nevoeiro, em latitude/longitude |
| `data/fotos-semente.json` | 46 fotos do fundador associadas aos pontos oficiais (álbuns iniciais) |
| `data/raw/` | Export original da Lisboa Aberta, sem alterações |
| `scripts/converter.py` | Gera `pontos.geojson` a partir do export original |

## Atualizar os dados / Updating the data

1. Descarregar o novo export "elementos de água" da Lisboa Aberta para `data/raw/`.
2. Correr `python3 scripts/converter.py data/raw/<ficheiro>.csv`.
3. Fazer commit do novo `data/pontos.geojson`.

## Créditos / Credits

- Dados base: Câmara Municipal de Lisboa, [Lisboa Aberta](https://dados.cm-lisboa.pt/) (Public Domain Mark 1.0).
- Mapa (a partir do Bloco 4): OpenFreeMap © OpenMapTiles, dados © contribuidores OpenStreetMap.
