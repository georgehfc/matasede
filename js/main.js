// Mata-Sede, Block 4: map, left panel (bottom sheet on phones), search,
// filters, "Perto de mim", fountain detail, PT/EN and the heat header.

import pt from "./strings.pt.js";
import en from "./strings.en.js";
import { icons, fillIcons } from "./icons.js";
import { loadPoints, search, nearest, distance, walkMinutes } from "./data.js";
import { loadWeather, renderWeather } from "./weather.js";
import { createMap } from "./map.js";

const root = document.documentElement;
const t = root.dataset.lang === "en" ? en : pt;
const base = root.dataset.base || "./";

const panel = document.getElementById("painel");
const searchForm = document.getElementById("pesquisa");
const searchInput = document.getElementById("pesquisa-input");

// Which filters are on. Only "acessivel" has data before Block 5.
const FILTERS_WITH_DATA = ["acessivel"];
const state = {
  view: "inicio", // inicio | perto | resultados | todos | detalhe
  previous: "inicio",
  located: null, // { lat, lng } once the visitor shares location
  denied: false,
  query: "",
  filters: new Set(),
  selected: null,
};

let all = []; // every point
let fountains = []; // bebedouros only
let heritage = []; // chafarizes and bicas
let byId = new Map();
let map;

// ── Text from the strings file ──────────────────────────────────────────
function applyStrings() {
  document.title = t.title;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t[el.dataset.i18n]));
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => (el.placeholder = t[el.dataset.i18nPlaceholder]));
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t[el.dataset.i18nAria]));
  const lang = document.getElementById("lingua");
  lang.textContent = t.otherLangLabel;
  lang.href = base + (t.lang === "pt" ? "en/" : "");
}

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function formatDistance(m) {
  return m < 1000 ? `${Math.round(m / 10) * 10} ${t.distanceUnitM}` : `${(m / 1000).toFixed(1).replace(".", t.lang === "pt" ? "," : ".")} ${t.distanceUnitKm}`;
}

// ── Filters ─────────────────────────────────────────────────────────────
function passesFilters(p) {
  for (const f of state.filters) {
    if (!FILTERS_WITH_DATA.includes(f)) return false; // no data yet
    if (f === "acessivel" && !p.accessible) return false;
  }
  return true;
}
const visibleFountains = () => fountains.filter(passesFilters);
const missingData = () => [...state.filters].some((f) => !FILTERS_WITH_DATA.includes(f));

function filtersHTML() {
  const accessibleCount = fountains.filter((p) => p.accessible).length;
  const chip = (key, icon) => {
    const on = state.filters.has(key);
    const count = key === "acessivel" ? ` · ${accessibleCount}` : "";
    return `<button type="button" class="chip${on ? " chip--on" : ""}${FILTERS_WITH_DATA.includes(key) ? "" : " chip--sem-dados"}" data-filter="${key}" aria-pressed="${on}">${icon ? `<span class="icone">${icons[icon]}</span>` : ""}${t.filters[key]}${count}</button>`;
  };
  return `
    <div class="filtros">
      <h2 class="sobretitulo">${t.filtersTitle}</h2>
      <div class="chips">
        ${chip("acessivel", "accessible")}${chip("garrafa", "bottle")}${chip("taca", "bowl")}${chip("funcionar")}${chip("fotos")}
      </div>
      <p class="nota">${missingData() ? t.filtersEmpty : t.filtersNote}</p>
    </div>`;
}

// ── Cards and detail ────────────────────────────────────────────────────
function cardHTML(p, { number, metres } = {}) {
  const selected = state.selected === p.id;
  return `
    <li>
      <button type="button" class="cartao${selected ? " cartao--sel" : ""}" data-id="${p.id}">
        <span class="cartao-num">${number ?? ""}</span>
        <span class="cartao-meio">
          <span class="cartao-nome">${esc(p.title)}</span>
          <span class="cartao-estado"><span class="icone">${icons.noInfo}</span>${t.statusNoInfo}</span>
          ${p.accessible ? `<span class="cartao-icones"><span class="tile" title="${t.featAccessible}">${icons.accessible}</span></span>` : ""}
        </span>
        ${metres != null ? `<span class="cartao-dist"><span class="dist">${formatDistance(metres)}</span><span class="min">${fill(t.minutes, { m: walkMinutes(metres) })}</span></span>` : ""}
      </button>
    </li>`;
}

function listHTML(list, withNumbers) {
  if (!list.length) return `<p class="vazio">${missingData() ? t.filtersEmpty : ""}</p>`;
  return `<ul class="lista">${list
    .map((p, i) => cardHTML(p, { number: withNumbers ? i + 1 : null, metres: state.located ? distance(state.located, p) : null }))
    .join("")}</ul>`;
}

function kindLabel(kind) {
  return { bebedouro: t.kindBebedouro, chafariz: t.kindChafariz, bica: t.kindBica }[kind] || kind;
}

function detailHTML(p) {
  const metres = state.located ? distance(state.located, p) : null;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`;
  const isFountain = p.kind === "bebedouro";
  return `
    <button type="button" class="voltar" data-back>${icons.back}<span>${t.back}</span></button>
    <div class="detalhe">
      <div class="detalhe-topo">
        <span class="sobretitulo">${kindLabel(p.kind)}</span>
        ${metres != null ? `<span class="detalhe-dist">${formatDistance(metres)} · ${fill(t.minutes, { m: walkMinutes(metres) })}</span>` : ""}
      </div>
      <h2 class="titulo">${esc(p.title)}</h2>
      ${isFountain ? `<p class="estado"><span class="icone">${icons.noInfo}</span>${t.statusNoInfo}</p>` : `<p class="nota">${t.heritageNote}</p>`}
      ${isFountain ? `
      <div class="album">
        <div class="album-vazio"><span class="icone">${icons.photo}</span><strong>${t.albumEmpty}</strong><span>${t.albumSoon}</span></div>
      </div>
      <div class="caracteristicas">
        <span class="caracteristica${p.accessible ? "" : " caracteristica--nao"}"><span class="tile">${icons.accessible}</span>${p.accessible ? t.featAccessible : t.featNotAccessible}</span>
      </div>` : ""}
      <dl class="ficha">
        <div><dt>${t.officialName}</dt><dd>${esc(p.officialName)}</dd></div>
        ${p.address ? `<div><dt>${t.address}</dt><dd>${esc(p.address)}</dd></div>` : ""}
      </dl>
      <div class="acoes">
        <a class="botao botao--cobalto botao--largo" href="${directions}" target="_blank" rel="noopener">${t.directions} ${icons.out}</a>
        <button type="button" class="botao botao--contorno" data-share>${icons.link}<span>${t.share}</span></button>
      </div>
      <p class="nota">${t.directionsNote}</p>
    </div>`;
}

// ── Panel views ─────────────────────────────────────────────────────────
function render() {
  let html = "";
  const list = visibleFountains();

  if (state.view === "inicio") {
    html = `
      <div class="intro">
        <h1 class="display">${t.introTitle}</h1>
        <p class="lead">${t.introText}</p>
      </div>
      ${state.denied
        ? `<div class="pedido"><h2 class="pedido-titulo">${t.deniedTitle}</h2><p>${t.deniedText}</p></div>`
        : `<div class="pedido">
            <h2 class="pedido-titulo"><span class="icone">${icons.locate}</span>${t.askTitle}</h2>
            <p>${t.askText}</p>
            <div class="pedido-acoes">
              <button type="button" class="botao botao--cobalto" data-locate>${t.askButton}</button>
              <button type="button" class="ligacao" data-skip>${t.askSkip}</button>
            </div>
          </div>`}
      ${filtersHTML()}
      <button type="button" class="todos" data-all><span>${t.allList}</span><strong>${list.length} →</strong></button>`;
  } else if (state.view === "perto") {
    const near = nearest(list, state.located, 3);
    html = `
      <div class="cabeca-painel"><h1 class="titulo">${t.nearTitle}</h1></div>
      ${listHTML(near, true)}
      ${filtersHTML()}
      <button type="button" class="todos" data-all><span>${t.allList}</span><strong>${list.length} →</strong></button>`;
    if (map) {
      map.showUser(state.located);
      map.showNearest(near, state.located);
    }
  } else if (state.view === "resultados") {
    const found = search(list, state.query);
    const sorted = state.located ? found.sort((a, b) => distance(state.located, a) - distance(state.located, b)) : found;
    html = `
      <button type="button" class="voltar" data-home>${icons.back}<span>${t.back}</span></button>
      <div class="cabeca-painel"><h1 class="titulo">${t.resultsTitle}</h1>
        <p class="nota">${found.length ? fill(t.resultsCount, { n: found.length, q: esc(state.query) }) : fill(t.resultsNone, { q: esc(state.query) })}</p></div>
      ${listHTML(sorted, false)}`;
  } else if (state.view === "todos") {
    const sorted = state.located
      ? [...list].sort((a, b) => distance(state.located, a) - distance(state.located, b))
      : [...list].sort((a, b) => a.title.localeCompare(b.title, t.lang));
    html = `
      <button type="button" class="voltar" data-home>${icons.back}<span>${t.back}</span></button>
      <div class="cabeca-painel"><h1 class="titulo">${t.allTitle}</h1><p class="nota">${sorted.length}</p></div>
      ${filtersHTML()}
      ${listHTML(sorted, false)}`;
  } else if (state.view === "detalhe") {
    html = detailHTML(byId.get(state.selected));
  }

  panel.innerHTML = html;
  panel.scrollTop = 0;
}

function go(view) {
  if (view === "detalhe" && state.view !== "detalhe") state.previous = state.view;
  state.view = view;
  if (view !== "perto" && map) map.clearNearest();
  render();
}

function select(id) {
  const p = byId.get(id);
  if (!p) return;
  state.selected = id;
  map?.select(p);
  const url = new URL(location.href);
  url.searchParams.set("b", id);
  history.replaceState(null, "", url);
  go("detalhe");
  setSheet("meio");
  panel.focus({ preventScroll: true });
}

function closeDetail() {
  state.selected = null;
  map?.select(null);
  const url = new URL(location.href);
  url.searchParams.delete("b");
  history.replaceState(null, "", url);
  go(state.previous === "detalhe" ? "inicio" : state.previous);
}

// ── "Perto de mim" ──────────────────────────────────────────────────────
function locate() {
  if (!("geolocation" in navigator)) return deny();
  const button = panel.querySelector("[data-locate]");
  if (button) button.textContent = t.locating;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.located = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      state.denied = false;
      go("perto");
      setSheet("meio");
    },
    () => deny(),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
  );
}

function deny() {
  state.denied = true;
  go("inicio");
  searchInput.focus();
}

// ── Phones: the panel is a bottom sheet (peek, half, full) ─────────────
function setSheet(level) {
  document.body.dataset.folha = level;
}

// ── Events ──────────────────────────────────────────────────────────────
panel.addEventListener("click", async (e) => {
  const el = e.target.closest("button, a");
  if (!el) return;
  if (el.dataset.id) return select(el.dataset.id);
  if (el.hasAttribute("data-locate")) return locate();
  if (el.hasAttribute("data-skip")) return searchInput.focus();
  if (el.hasAttribute("data-all")) return go("todos");
  if (el.hasAttribute("data-home")) return go(state.located ? "perto" : "inicio");
  if (el.hasAttribute("data-back")) return closeDetail();
  if (el.dataset.filter) {
    const f = el.dataset.filter;
    state.filters.has(f) ? state.filters.delete(f) : state.filters.add(f);
    map?.setFountains(visibleFountains());
    return render();
  }
  if (el.hasAttribute("data-share")) {
    try {
      await navigator.clipboard.writeText(location.href);
      el.querySelector("span").textContent = t.shared;
    } catch {
      /* clipboard blocked: the address bar already has the link */
    }
  }
});

document.getElementById("perto").addEventListener("click", () => {
  if (state.located) go("perto");
  else locate();
});

searchForm.addEventListener("submit", (e) => e.preventDefault());
searchInput.addEventListener("input", () => {
  state.query = searchInput.value.trim();
  if (state.query.length >= 2) go("resultados");
  else if (state.view === "resultados") go(state.located ? "perto" : "inicio");
});
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const first = panel.querySelector(".cartao");
    if (first) select(first.dataset.id);
  }
});

document.getElementById("patrimonio").addEventListener("change", (e) => map?.setHeritage(e.target.checked));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.view === "detalhe") closeDetail();
});

// The bottom sheet handle (phones only; hidden on desktop by CSS).
const handle = document.createElement("button");
handle.type = "button";
handle.className = "puxador";
handle.setAttribute("aria-label", t.allList);
handle.addEventListener("click", () => {
  const order = ["espreita", "meio", "cheia"];
  const next = order[(order.indexOf(document.body.dataset.folha || "espreita") + 1) % order.length];
  setSheet(next);
});
panel.before(handle);

// ── Start ───────────────────────────────────────────────────────────────
async function start() {
  applyStrings();
  fillIcons();
  setSheet("espreita");

  // The weather doesn't depend on the map, so it starts straight away.
  loadWeather()
    .then((w) => renderWeather(document.getElementById("tempo"), w, t))
    .catch(() => {}); // IPMA down: the header simply has no weather

  all = await loadPoints(base);
  fountains = all.filter((p) => p.kind === "bebedouro");
  heritage = all.filter((p) => p.kind === "chafariz" || p.kind === "bica");
  byId = new Map(all.map((p) => [p.id, p]));

  const linked = new URL(location.href).searchParams.get("b");
  render();

  map = await createMap({ container: "mapa", fountains, heritage, onSelect: select });
  if (linked && byId.has(linked)) {
    if (byId.get(linked).kind !== "bebedouro") {
      document.getElementById("patrimonio").checked = true;
      map.setHeritage(true);
    }
    select(linked);
  }
}

start();
