"""
Verifica as fotos enviadas em matasede.pt/enviar e associa-as a um ponto do mapa.
Checks photos sent through matasede.pt/enviar and matches them to a map point.

Corre no GitHub Actions (.github/workflows/verificar-fotos.yml), de 10 em 10 minutos.
Para cada foto pendente ainda não verificada:
  1. descarrega a imagem do Supabase;
  2. junta os pontos candidatos (o escolhido por quem enviou e os mais próximos);
  3. pergunta ao Claude se a foto mostra mesmo um ponto de água e qual dos candidatos é;
  4. grava o resultado nas colunas check_* da tabela photos.

Por defeito não aprova nem rejeita nada: só deixa a sugestão para reveres.
Com AUTO_APROVAR=true, aprova as fotos com veredicto "ok" e rejeita as "rejeitar".

Precisa de / needs: SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY; pip install anthropic
Uso local / local use:  python3 scripts/verificar_fotos.py [--dry-run]
"""
import base64, json, math, os, sys, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timezone

import anthropic

MODEL = "claude-opus-5-5"
MAX_PER_RUN = 20
NEAR_M = 300          # candidates within this distance of the photo's location
MATCH_M = 100         # a chosen point further than this from the photo's location needs review
KINDS = {"bebedouro": "bebedouro", "chafariz": "chafariz", "bica": "bica", "nevoeiro": "ponto de nevoeiro"}

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
AUTO = os.environ.get("AUTO_APROVAR", "").strip().lower() == "true"
DRY = "--dry-run" in sys.argv


# ---------- Supabase (REST + Storage, standard library only) ----------

def _headers(extra=None):
    h = {"apikey": SERVICE_KEY}
    # New-style secret keys (sb_secret_...) go in apikey only; legacy service_role JWTs also need Authorization.
    if not SERVICE_KEY.startswith("sb_"):
        h["Authorization"] = "Bearer " + SERVICE_KEY
    h.update(extra or {})
    return h


def _request(method, path, body=None, extra=None):
    data = json.dumps(body).encode() if body is not None else None
    hdrs = _headers(extra)
    if data is not None:
        hdrs["Content-Type"] = "application/json"
    req = urllib.request.Request(SUPABASE_URL + path, data=data, method=method, headers=hdrs)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def pending_photos():
    q = urllib.parse.urlencode({
        "select": "id,point_id,storage_path,photo_lat,photo_lng,created_at",
        "moderation": "eq.pending",
        "checked_at": "is.null",
        "order": "created_at.asc",
        "limit": str(MAX_PER_RUN),
    })
    return json.loads(_request("GET", "/rest/v1/photos?" + q))


def download(storage_path):
    return _request("GET", "/storage/v1/object/fotos/" + urllib.parse.quote(storage_path))


def save(photo_id, fields):
    if DRY:
        print("   (dry run) would save:", json.dumps(fields, ensure_ascii=False))
        return
    _request("PATCH", "/rest/v1/photos?id=eq." + urllib.parse.quote(photo_id), fields,
             {"Prefer": "return=minimal"})


# ---------- Points ----------

def load_points():
    here = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(here, "..", "data", "pontos.geojson"), encoding="utf-8") as f:
        return {ft["id"]: ft for ft in json.load(f)["features"]}


def dist_m(a, b):
    """Metres between two (lng, lat) pairs."""
    rad = math.pi / 180
    dlat, dlng = (b[1] - a[1]) * rad, (b[0] - a[0]) * rad
    h = math.sin(dlat / 2) ** 2 + math.cos(a[1] * rad) * math.cos(b[1] * rad) * math.sin(dlng / 2) ** 2
    return 2 * 6371000 * math.asin(math.sqrt(h))


def candidates(points, chosen_id, at):
    """The point the sender chose plus its neighbours: near the photo's location if we have it, else near the chosen point."""
    centre = at or (points[chosen_id]["geometry"]["coordinates"] if chosen_id in points else None)
    out = {}
    if chosen_id in points:
        out[chosen_id] = points[chosen_id]
    if centre:
        near = sorted(points.values(), key=lambda ft: dist_m(centre, ft["geometry"]["coordinates"]))
        for ft in near[:6]:
            if at is None or dist_m(at, ft["geometry"]["coordinates"]) <= NEAR_M:
                out[ft["id"]] = ft
    return list(out.values())


# ---------- Claude ----------

SYSTEM = """You review photos sent by the public to Mata-Sede, an independent map of Lisbon's public drinking water points.
The map's points come from Lisbon City Council open data and have four kinds:
- bebedouro: a public drinking fountain. The modern ones (installed from 2020) are dark grey metal posts with a drinking spout, often a bottle tap and a dog bowl at the base; older ones are stone or metal pillars or basins.
- chafariz: a historic monumental fountain, usually carved stone, often with inscriptions or dates.
- bica: a historic spout or tap, often set into a wall.
- nevoeiro: a misting post that sprays water to cool people down.

For each photo you get the candidate points it might show. Decide:
1. Whether the photo clearly shows a public water point, and which kind.
2. Which candidate it shows. The sender picked one; you may pick a different candidate if the photo, the distances or visible details (signs, inscriptions, surroundings) fit it better. Answer "nenhum" if none fits or you cannot tell.
3. Whether a person's face is identifiable or a vehicle number plate is readable (both must be blurred before publishing).
4. Whether the photo contains anything that should never be published (nudity, violence, hateful symbols, personal documents, advertising or spam).

Judge only what is visible. Several fountains look alike, so do not guess between near-identical candidates without distance or visual evidence; lower your confidence instead. Write the note in European Portuguese, one or two short sentences, addressed to the site owner."""

SCHEMA = {
    "type": "object",
    "properties": {
        "mostra_ponto_de_agua": {"type": "boolean"},
        "tipo": {"type": "string", "enum": ["bebedouro", "chafariz", "bica", "nevoeiro", "outro", "nao_e_ponto_de_agua"]},
        "ponto_id": {"type": "string", "description": "id of the matching candidate, or \"nenhum\""},
        "confianca": {"type": "string", "enum": ["alta", "media", "baixa"]},
        "pessoas_identificaveis": {"type": "boolean"},
        "matriculas_legiveis": {"type": "boolean"},
        "improprio": {"type": "boolean"},
        "nota": {"type": "string"},
    },
    "required": ["mostra_ponto_de_agua", "tipo", "ponto_id", "confianca",
                 "pessoas_identificaveis", "matriculas_legiveis", "improprio", "nota"],
    "additionalProperties": False,
}


def ask_claude(client, image_bytes, cands, chosen_id, at):
    lines = []
    for ft in cands:
        p = ft["properties"]
        d = dist_m(at, ft["geometry"]["coordinates"]) if at else None
        lines.append({
            "id": ft["id"],
            "name": p["name"],
            "kind": p["kind"],
            "address": p["address"],
            "accessible": p.get("accessible"),
            "chosen_by_sender": ft["id"] == chosen_id,
            "metres_from_photo_location": round(d) if d is not None else None,
        })
    where = ("The photo's own GPS location is known; distances are measured from it."
             if at else "The photo carried no location, so there are no distances; the sender chose the point by name.")
    resp = client.beta.messages.create(
        model=MODEL,
        max_tokens=4000,
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        output_config={"effort": "medium", "format": {"type": "json_schema", "schema": SCHEMA}},
        system=SYSTEM,
        messages=[{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg",
                                             "data": base64.standard_b64encode(image_bytes).decode()}},
                {"type": "text", "text": where + "\n\nCandidates:\n" + json.dumps(lines, ensure_ascii=False, indent=1)},
            ],
        }],
    )
    if resp.stop_reason == "refusal":
        return None, "O modelo recusou analisar esta foto. Revê-a à mão."
    if resp.stop_reason == "max_tokens":
        return None, "A análise ficou incompleta. Revê-a à mão."
    text = next(b.text for b in resp.content if b.type == "text")
    return json.loads(text), None


# ---------- Verdict ----------

def verdict(ans, chosen_id, at, points, cand_ids):
    """Turns Claude's answer into ok / rever / rejeitar plus the point to use."""
    if ans["improprio"]:
        return "rejeitar", None, ["conteúdo impróprio"]
    if not ans["mostra_ponto_de_agua"] and ans["confianca"] == "alta":
        return "rejeitar", None, ["não é um ponto de água"]
    point = ans["ponto_id"] if ans["ponto_id"] in cand_ids else None
    reasons = []
    if not ans["mostra_ponto_de_agua"]:
        reasons.append("não parece um ponto de água")
    if ans["confianca"] != "alta":
        reasons.append("confiança " + ans["confianca"])
    if point is None:
        reasons.append("sem ponto associado")
    elif point != chosen_id:
        reasons.append("ponto diferente do escolhido")
    if point and at and dist_m(at, points[point]["geometry"]["coordinates"]) > MATCH_M:
        reasons.append("foto tirada longe do ponto")
    if point and ans["tipo"] in KINDS and points[point]["properties"]["kind"] != ans["tipo"]:
        reasons.append("tipo diferente do ponto")
    if ans["pessoas_identificaveis"] or ans["matriculas_legiveis"]:
        reasons.append("tem caras ou matrículas para desfocar")
    return ("rever" if reasons else "ok"), point, reasons


def main():
    missing = [k for k in ("SUPABASE_URL", "SUPABASE_SERVICE_KEY", "ANTHROPIC_API_KEY") if not os.environ.get(k)]
    if missing:
        sys.exit("Faltam variáveis / missing env: " + ", ".join(missing))
    points = load_points()
    photos = pending_photos()
    print(f"{len(photos)} foto(s) por verificar")
    if not photos:
        return
    client = anthropic.Anthropic()
    failures = 0
    for ph in photos:
        print(f"- {ph['id']} ({ph['storage_path']})")
        at = None
        if ph.get("photo_lat") is not None and ph.get("photo_lng") is not None:
            at = (float(ph["photo_lng"]), float(ph["photo_lat"]))
        try:
            img = download(ph["storage_path"])
            cands = candidates(points, ph["point_id"], at)
            ans, problem = ask_claude(client, img, cands, ph["point_id"], at)
        except (urllib.error.URLError, anthropic.APIError) as e:
            # Leave checked_at empty so the next run tries again.
            print("   erro, fica para a próxima:", e)
            failures += 1
            continue

        now = datetime.now(timezone.utc).isoformat()
        if ans is None:
            fields = {"check_status": "rever", "check_notes": problem, "checked_at": now}
        else:
            status, point, reasons = verdict(ans, ph["point_id"], at, points, {ft["id"] for ft in cands})
            note = ans["nota"].strip()
            if reasons:
                note += " [" + "; ".join(reasons) + "]"
            fields = {
                "check_status": status,
                "check_kind": ans["tipo"],
                "check_point_id": point,
                "check_distance_m": round(dist_m(at, points[point]["geometry"]["coordinates"])) if (at and point) else None,
                "check_notes": note[:500],
                "checked_at": now,
            }
            if AUTO and status == "ok":
                fields["moderation"] = "approved"
                fields["point_id"] = point
            elif AUTO and status == "rejeitar":
                fields["moderation"] = "rejected"
        print("  ", fields["check_status"], "·", fields.get("check_notes", ""))
        try:
            save(ph["id"], fields)
        except urllib.error.URLError as e:
            print("   erro a gravar:", e)
            failures += 1
    if failures:
        sys.exit(f"{failures} foto(s) com erro; tenta-se outra vez na próxima execução")


if __name__ == "__main__":
    main()
