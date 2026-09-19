"""
Converte o export "elementos de água" da Lisboa Aberta em data/pontos.geojson.
Converts the Lisboa Aberta "water elements" export into data/pontos.geojson.

Uso / usage:  python3 scripts/converter.py data/raw/<ficheiro>.csv
Requer / needs: Python 3 (sem bibliotecas extra / no extra libraries)
"""
import csv, json, math, re, sys

KINDS = {"Bebedouro": "bebedouro", "Chafariz": "chafariz", "Bica": "bica", "Nevoeiro": "nevoeiro"}
FIXES = {"Eixo Central ¿ Saldanha": "Eixo Central – Saldanha", "d¿Ávila": "d'Ávila"}

def mercator_to_lnglat(x, y):
    lng = x / 6378137 * 180 / math.pi
    lat = (2 * math.atan(math.exp(y / 6378137)) - math.pi / 2) * 180 / math.pi
    return round(lng, 6), round(lat, 6)

def clean(text):
    text = re.sub(r"\s+", " ", (text or "")).strip()
    for bad, good in FIXES.items():
        text = text.replace(bad, good)
    return text

def main(path):
    features = []
    with open(path, encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            kind = KINDS.get(row["Tipologia"])
            if not kind:
                continue
            lng, lat = mercator_to_lnglat(float(row["x"]), float(row["y"]))
            acc = row["MOBILIDADE_REDUZIDA"].strip().upper()
            features.append({
                "type": "Feature",
                "id": row["GlobalID"],
                "geometry": {"type": "Point", "coordinates": [lng, lat]},
                "properties": {
                    "id": row["GlobalID"],
                    "vertical": "bebedouros",
                    "kind": kind,
                    "name": clean(row["Designação"]),
                    "address": clean(row["Morada"]),
                    "source": "lisboa_aberta",
                    "source_ref": row["Código SIG"],
                    "accessible": True if acc == "SIM" else False if acc in ("NÃO", "NAO") else None,
                },
            })
    features.sort(key=lambda ft: (ft["properties"]["kind"], ft["properties"]["name"]))
    out = {
        "type": "FeatureCollection",
        "metadata": {
            "source": "Câmara Municipal de Lisboa — Lisboa Aberta (Public Domain Mark 1.0)",
            "source_file": path.split("/")[-1],
            "counts": {k: sum(ft["properties"]["kind"] == k for ft in features) for k in KINDS.values()},
        },
        "features": features,
    }
    with open("data/pontos.geojson", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print("OK:", out["metadata"]["counts"])

if __name__ == "__main__":
    main(sys.argv[1])
