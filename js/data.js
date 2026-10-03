// Loads data/pontos.geojson and prepares it for the map and the lists.

const WALK_METRES_PER_MINUTE = 80; // used for "≈ min"; straight line, not a route

export async function loadPoints(base) {
  const res = await fetch(`${base}data/pontos.geojson`);
  const geo = await res.json();
  const points = geo.features.map((f) => {
    const p = f.properties;
    const [lng, lat] = f.geometry.coordinates;
    return {
      id: p.id,
      kind: p.kind, // bebedouro | chafariz | bica | nevoeiro
      officialName: p.name,
      title: shortTitle(p.name, p.kind),
      address: p.address,
      accessible: p.accessible === true,
      lng,
      lat,
      search: normalise(`${p.name} ${p.address}`),
    };
  });
  return points;
}

// "Bebedouro 2 na Praça das Flores" -> "Praça das Flores · 2"
// The official name is still shown in the detail panel.
export function shortTitle(name, kind) {
  if (kind !== "bebedouro") return name;
  const m = name.match(/^Bebedouro\s*(\d+)?\s*(?:junto\s+(?:ao|à|a|aos|às)|n[oa]s?|d[oa]s?|em|à|ao)?\s*(.*)$/i);
  if (!m || !m[2]) return name;
  const rest = m[2].charAt(0).toUpperCase() + m[2].slice(1);
  return m[1] ? `${rest}\u00a0·\u00a0${m[1]}` : rest; // no-break spaces keep "· 2" with its name
}

// Lower case and without accents, so "praca" finds "Praça".
export function normalise(text) {
  return (text || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function search(points, query) {
  const words = normalise(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return points.filter((p) => words.every((w) => p.search.includes(w)));
}

// Straight-line distance in metres (haversine).
export function distance(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearest(points, from, count = 3) {
  return points
    .map((p) => ({ ...p, metres: distance(from, p) }))
    .sort((a, b) => a.metres - b.metres)
    .slice(0, count);
}

export function walkMinutes(metres) {
  return Math.max(1, Math.round(metres / WALK_METRES_PER_MINUTE));
}
