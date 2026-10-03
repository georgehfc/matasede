"""
Prepara as fotos semente e as ligações às fotos da CML.
Prepares the seed photos and the links to CML's photos.

Uso / usage:
  python3 scripts/fotos.py <pasta-com-as-fotos> [<csv-da-cml>]
  python3 scripts/fotos.py ~/Downloads/bebedouros ~/Downloads/bebedouros/Bebedouros.csv

1. For every photo in data/fotos-semente.json, writes a web size (1400 px)
   to fotos/ and a thumbnail (320 px) to fotos/mini/, and strips the camera
   data (GPS, phone model) because the repo is public.
2. With the CML csv, matches each row to the nearest bebedouro (within 80 m)
   and writes data/links-cml.json. We only link to CML's photos, never copy them.

Requer / needs: macOS (uses the built-in `sips`), Python 3, no extra libraries.
"""
import csv, json, math, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SIZES = {"fotos": 1200, "fotos/mini": 320}
QUALITY = "55"  # JPEG quality, 0–100
MAX_MATCH_M = 80


def strip_metadata(path):
    """Removes EXIF/XMP (APP1) and other app segments from a JPEG, keeping the image."""
    data = path.read_bytes()
    out, i = bytearray(data[:2]), 2  # SOI
    while i < len(data):
        if data[i] != 0xFF:
            raise ValueError(f"{path.name}: not a clean JPEG")
        marker = data[i + 1]
        if marker == 0xDA:  # start of scan: the rest is image data
            out += data[i:]
            break
        length = int.from_bytes(data[i + 2:i + 4], "big")
        segment = data[i:i + 2 + length]
        if not (0xE1 <= marker <= 0xEF or marker == 0xFE):  # keep APP0 (JFIF) and the image tables
            out += segment
        i += 2 + length
    path.write_bytes(bytes(out))


def make_photos(source):
    seed = json.loads((ROOT / "data/fotos-semente.json").read_text())
    for folder in SIZES:
        (ROOT / folder).mkdir(parents=True, exist_ok=True)
        for old in (ROOT / folder).glob("*.jpg"):
            old.unlink()  # start clean, so removed photos disappear too
    photos = [p for p in seed["photos"] if p.get("point_id")]  # no fountain yet: not published
    for photo in photos:
        src = Path(source).expanduser() / photo["file"]
        name = Path(photo["file"]).stem + ".jpg"
        longest = max(int(n) for n in re.findall(r"pixel(?:Width|Height): (\d+)", subprocess.run(
            ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(src)], capture_output=True, text=True).stdout))
        for folder, size in SIZES.items():
            dest = ROOT / folder / name
            resize = ["-Z", str(size)] if longest > size else []  # shrink only, never enlarge
            subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", QUALITY,
                            *resize, str(src), "--out", str(dest)],
                           check=True, capture_output=True)
            strip_metadata(dest)
    total = sum(p.stat().st_size for p in (ROOT / "fotos").rglob("*.jpg"))
    print(f"{len(photos)} fotos → fotos/ e fotos/mini/ ({total / 1e6:.1f} MB)")


def dms(text):
    d, m, s = (float(x) for x in re.findall(r"[\d.]+", text)[:3])
    value = d + m / 60 + s / 3600
    return -value if re.search(r"[SW]", text) else value


def distance(a, b):
    r = 6371000
    p1, p2 = math.radians(a[1]), math.radians(b[1])
    dp, dl = p2 - p1, math.radians(b[0] - a[0])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def make_cml_links(csv_path):
    geo = json.loads((ROOT / "data/pontos.geojson").read_text())
    fountains = [f for f in geo["features"] if f["properties"]["kind"] == "bebedouro"]
    links, missed = [], []
    with open(Path(csv_path).expanduser(), encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            lat_text, lng_text = row["Localização"].split("|")
            where = (dms(lng_text), dms(lat_text))
            best = min(fountains, key=lambda ft: distance(where, ft["geometry"]["coordinates"]))
            metres = round(distance(where, best["geometry"]["coordinates"]))
            if metres > MAX_MATCH_M:
                missed.append(f"{row['Nome']} ({metres} m)")
                continue
            links.append({
                "point_id": best["properties"]["id"],
                "point_name": best["properties"]["name"],
                "cml_name": row["Nome"],
                "url": row["Foto"],
                "distance_m": metres,
            })
    out = {"description": "Ligações para fotos no site da CML (informacoeseservicos.lisboa.pt). Só ligamos, não copiamos.",
           "links": links}
    (ROOT / "data/links-cml.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(f"{len(links)} ligações CML → data/links-cml.json")
    for m in missed:
        print("  sem bebedouro a menos de", MAX_MATCH_M, "m:", m)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    make_photos(sys.argv[1])
    if len(sys.argv) > 2:
        make_cml_links(sys.argv[2])
