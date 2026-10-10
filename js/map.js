// The map: OpenFreeMap "Liberty" restyled to DESIGN.md, plus our pins.

import { pins, pinImage } from "./pins.js";

// ── Map colours. Change these to restyle the base map. ─────────────────
const MAP = {
  land: "#FFFFFF",       // glaze
  water: "#E3E8F7",      // wash
  park: "#EEF1FA",       // a lighter wash for parks and gardens
  building: "#F4F5F9",
  roadFill: "#FFFFFF",
  roadCasing: "#1D3CA8", // cobalt, drawn faint
  roadCasingOpacity: 0.32,
  path: "#1D3CA8",
  pathOpacity: 0.14,
  rail: "#B9BED0",
  label: "#121B3D",      // ink
  labelHalo: "#FFFFFF",
  waterLabel: "#1D3CA8",
  pin: "#1D3CA8",
};
// ────────────────────────────────────────────────────────────────────────

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const CLUSTER_UNTIL_ZOOM = 11; // below this zoom fountains group into circles with a count
const FEATURES_FROM_ZOOM = 16; // from here pins show a glyph (♿ or a drop)
const PHOTOS_FROM_ZOOM = 15; // from here fountains with photos show a round thumbnail

const HIDE = [/^natural_earth$/, /^poi_/, /^airport$/, /shield/, /one_way/, /hatching/, /^building-3d$/, /^boundary/, /^park_outline$/, /^landuse_/, /^aeroway/, /^label_country/, /^label_state/];

function restyle(style) {
  for (const layer of style.layers) {
    const id = layer.id;
    if (HIDE.some((re) => re.test(id))) {
      layer.layout = { ...(layer.layout || {}), visibility: "none" };
      continue;
    }
    const paint = (layer.paint = layer.paint || {});
    if (layer.type === "background") paint["background-color"] = MAP.land;
    else if (id === "water") paint["fill-color"] = MAP.water;
    else if (layer.type === "line" && id.startsWith("waterway")) paint["line-color"] = MAP.water;
    else if (id === "park" || id.startsWith("landcover")) {
      paint["fill-color"] = MAP.park;
      paint["fill-outline-color"] = MAP.park;
      paint["fill-opacity"] = 1;
    } else if (id === "building") {
      paint["fill-color"] = MAP.building;
      paint["fill-outline-color"] = MAP.building;
    } else if (layer.type === "line" && id.endsWith("_casing")) {
      paint["line-color"] = MAP.roadCasing;
      paint["line-opacity"] = MAP.roadCasingOpacity;
    } else if (layer.type === "line" && /path_pedestrian/.test(id)) {
      paint["line-color"] = MAP.path;
      paint["line-opacity"] = MAP.pathOpacity;
    } else if (layer.type === "line" && /rail/.test(id)) {
      paint["line-color"] = MAP.rail;
    } else if (layer.type === "line" && /^(road|bridge|tunnel)_/.test(id)) {
      paint["line-color"] = MAP.roadFill;
    } else if (layer.type === "fill" && id === "road_area_pattern") {
      layer.layout = { ...(layer.layout || {}), visibility: "none" };
    } else if (layer.type === "symbol") {
      const isWater = /water/.test(id);
      paint["text-color"] = isWater ? MAP.waterLabel : MAP.label;
      paint["text-halo-color"] = MAP.labelHalo;
      paint["text-halo-width"] = 1.5;
      // Local names on both languages: the street signs are in Portuguese ("Rio Tejo", not "Tagus River").
      if (layer.layout && layer.layout["text-field"] && JSON.stringify(layer.layout["text-field"]).includes("name")) {
        layer.layout["text-field"] = ["coalesce", ["get", "name"], ["get", "name:latin"]];
      }
    }
  }
  return style;
}

function toCollection(points) {
  return {
    type: "FeatureCollection",
    features: points.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: { id: p.id, accessible: !!p.accessible },
    })),
  };
}

export async function createMap({ container, fountains, heritage, onSelect }) {
  const style = restyle(await fetch(STYLE_URL).then((r) => r.json()));

  const map = new maplibregl.Map({
    container,
    style,
    bounds: boundsOf(fountains),
    fitBoundsOptions: { padding: 40 },
    attributionControl: { compact: false },
    dragRotate: false,
    pitchWithRotate: false,
  });
  map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

  await new Promise((resolve) => map.on("load", resolve));

  const images = {
    pino: [pins.bebedouro, 20],
    "pino-gota": [pins.bebedouroGota, 32],
    "pino-acessivel": [pins.bebedouroAcessivel, 32],
    "pino-sel": [pins.selecionado, 44],
    grupo: [pins.grupo, 36],
    patrimonio: [pins.patrimonio, 16],
  };
  await Promise.all(
    Object.entries(images).map(async ([name, [draw, size]]) => map.addImage(name, await pinImage(draw, size), { pixelRatio: 2 }))
  );

  map.addSource("bebedouros", {
    type: "geojson",
    data: toCollection(fountains),
    cluster: true,
    clusterMaxZoom: CLUSTER_UNTIL_ZOOM,
    clusterRadius: 36,
  });
  map.addSource("patrimonio", { type: "geojson", data: toCollection(heritage) });
  map.addSource("selecionado", { type: "geojson", data: toCollection([]) });

  map.addLayer({
    id: "patrimonio",
    type: "symbol",
    source: "patrimonio",
    layout: {
      visibility: "none",
      "icon-image": "patrimonio",
      "icon-allow-overlap": true,
      "icon-size": ["interpolate", ["linear"], ["zoom"], 11, 0.7, 16, 1.2],
    },
  });
  map.addLayer({
    id: "grupos",
    type: "symbol",
    source: "bebedouros",
    filter: ["has", "point_count"],
    layout: {
      "icon-image": "grupo",
      "icon-allow-overlap": true,
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["Noto Sans Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
    },
    paint: { "text-color": "#FFFFFF" },
  });
  map.addLayer({
    id: "pinos",
    type: "symbol",
    source: "bebedouros",
    filter: ["!", ["has", "point_count"]],
    layout: {
      // Plain dots further out; close up, a glyph for what the fountain has.
      "icon-image": ["step", ["zoom"], "pino", FEATURES_FROM_ZOOM, ["case", ["get", "accessible"], "pino-acessivel", "pino-gota"]],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 11, 0.65, 14, 1, 15.99, 1.15, 16, 0.9, 18, 1.1],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
  });
  map.addLayer({
    id: "selecionado",
    type: "symbol",
    source: "selecionado",
    layout: { "icon-image": "pino-sel", "icon-allow-overlap": true, "icon-ignore-placement": true },
  });

  // Clicks: a pin opens its detail; a group zooms in.
  for (const layer of ["pinos", "patrimonio"]) {
    map.on("click", layer, (e) => onSelect(e.features[0].properties.id));
    map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
  }
  map.on("click", "grupos", async (e) => {
    const f = e.features[0];
    const zoom = await map.getSource("bebedouros").getClusterExpansionZoom(f.properties.cluster_id);
    map.easeTo({ center: f.geometry.coordinates, zoom: zoom + 0.5 });
  });
  map.on("mouseenter", "grupos", () => (map.getCanvas().style.cursor = "pointer"));
  map.on("mouseleave", "grupos", () => (map.getCanvas().style.cursor = ""));

  // Phones: a small tap near a pin still counts (pins are smaller than a finger).
  map.on("click", (e) => {
    if (map.queryRenderedFeatures(e.point, { layers: ["pinos", "grupos", "patrimonio"] }).length) return;
    const box = [[e.point.x - 22, e.point.y - 22], [e.point.x + 22, e.point.y + 22]];
    const near = map.queryRenderedFeatures(box, { layers: ["pinos"] });
    if (near.length) onSelect(near[0].properties.id);
  });

  // Fountains with photos: a round thumbnail once you're close enough to see it.
  let photoMarkers = new Map(); // id -> marker
  let selectedId = null;
  function setPhotoMarkers(list) {
    photoMarkers.forEach((m) => m.remove());
    photoMarkers = new Map();
    for (const p of list) {
      if (!p.photos?.length) continue;
      const el = document.createElement("button");
      el.type = "button";
      el.className = "pino-foto";
      el.style.backgroundImage = `url("${p.photos[0].thumb}")`;
      el.setAttribute("aria-label", p.title);
      if (p.accessible) el.innerHTML = '<span class="pino-foto-selo" aria-hidden="true"></span>';
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelect(p.id);
      });
      photoMarkers.set(p.id, new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]));
    }
    updatePhotoMarkers();
  }
  function updatePhotoMarkers() {
    const show = map.getZoom() >= PHOTOS_FROM_ZOOM;
    photoMarkers.forEach((m, id) => {
      show ? m.addTo(map) : m.remove();
      m.getElement().classList.toggle("pino-foto--sel", id === selectedId);
    });
  }
  map.on("zoomend", updatePhotoMarkers);
  setPhotoMarkers(fountains);

  let userMarker = null;
  let numberMarkers = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSheet = window.matchMedia("(max-width: 1023px)");
  // On phones the panel is a bottom sheet over the map: centre pins in the part you can still see.
  const visible = (base) => {
    const sheet = isSheet.matches ? document.getElementById("painel").offsetHeight : 0;
    return { top: base, left: base, right: base, bottom: base + sheet };
  };

  return {
    setFountains(list) {
      map.getSource("bebedouros").setData(toCollection(list));
      setPhotoMarkers(list);
    },
    setHeritage(visible) {
      map.setLayoutProperty("patrimonio", "visibility", visible ? "visible" : "none");
    },
    select(point) {
      map.getSource("selecionado").setData(toCollection(point ? [point] : []));
      selectedId = point?.id ?? null;
      updatePhotoMarkers();
      if (point) {
        const zoom = Math.max(map.getZoom(), 15);
        map.easeTo({ center: [point.lng, point.lat], zoom, padding: visible(0), duration: reduceMotion ? 0 : 600 });
      }
    },
    showUser(where) {
      if (!userMarker) {
        const el = document.createElement("div");
        el.className = "voce";
        userMarker = new maplibregl.Marker({ element: el });
      }
      userMarker.setLngLat([where.lng, where.lat]).addTo(map);
    },
    showNearest(list, from) {
      numberMarkers.forEach((m) => m.remove());
      numberMarkers = list.map((p, i) => {
        const el = document.createElement("button");
        el.className = "numero";
        el.textContent = String(i + 1);
        el.setAttribute("aria-label", p.title);
        el.addEventListener("click", () => onSelect(p.id));
        return new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
      });
      const b = boundsOf([...list, from]);
      map.fitBounds(b, { padding: visible(80), maxZoom: 16, duration: reduceMotion ? 0 : 800 });
    },
    clearNearest() {
      numberMarkers.forEach((m) => m.remove());
      numberMarkers = [];
    },
    resize() {
      map.resize();
    },
  };
}

function boundsOf(points) {
  const lngs = points.map((p) => p.lng);
  const lats = points.map((p) => p.lat);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}
