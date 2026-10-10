// Mata-Sede: pages, preview images and sitemap for search engines and shared links.
//
//   node scripts/gerar_partilhas.mjs            make what's new or changed (new photos, new fountains)
//   node scripts/gerar_partilhas.mjs --tudo     redo every preview image
//
// What it makes:
//   b/<id>/index.html    one page per bebedouro: the map, opened on it, with its own title, description,
//                        preview image and location data (JSON-LD) in the <head>.
//   partilha/<id>.jpg    its 1200 × 630 preview image (scripts/partilha/cartao.html): the newest approved photo,
//                        or the map at its spot when it has none. partilha/mata-sede.jpg is the general one.
//   the <head> block between "partilha:inicio" and "partilha:fim" in index.html, mapa/index.html and enviar/index.html
//   sitemap.xml and robots.txt
//
// Run it again when photos are approved, when data/pontos.geojson changes, and after editing the body of
// mapa/index.html (every fountain page is a copy of it). Needs Google Chrome and an internet connection
// (fonts and map tiles). Reads approved photos from the REAL Supabase project, read-only, with the public key.
// Nothing to install: plain Node.

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://matasede.pt";
const TUDO = process.argv.includes("--tudo");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PARALELO = Number(process.env.PARALELO) || 3; // cards rendered at once (PARALELO=1 node … for one at a time)

const ler = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const escrever = (f, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), s); };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- data ----------
const pontos = JSON.parse(ler("data/pontos.geojson")).features;
const bebedouros = pontos.filter((f) => f.properties.kind === "bebedouro");

// The real project (never the test one): the REAL block of assets/config.js.
const cfg = ler("assets/config.js");
const real = cfg.slice(cfg.indexOf("var REAL"), cfg.indexOf("var TESTE"));
const SB_URL = real.match(/supabaseUrl:\s*"([^"]+)"/)[1];
const SB_KEY = real.match(/supabaseKey:\s*"([^"]+)"/)[1];
const sbHeaders = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };

async function fotos() {
  const lista = [];
  try {
    const r = await fetch(`${SB_URL}/rest/v1/photos?select=point_id,storage_path,taken_at,created_at&moderation=eq.approved`, { headers: sbHeaders });
    if (!r.ok) throw new Error(`photos ${r.status}`);
    for (const p of await r.json()) lista.push({ ...p, chave: p.storage_path });
  } catch (e) {
    console.warn("! Não consegui ler as fotos do Supabase:", e.message, "(continuo só com as da CML)");
  }
  const cml = JSON.parse(ler("data/fotos-cml.json")).photos || [];
  for (const p of cml) lista.push({ point_id: p.point_id, taken_at: p.taken_at, created_at: null, chave: "cml/" + p.file, local: "/fotos-cml/" + p.file });
  // Newest first, as on the map; undated photos last.
  lista.sort((a, b) => (b.taken_at || b.created_at || "").localeCompare(a.taken_at || a.created_at || ""));
  const porPonto = {};
  for (const p of lista) if (!porPonto[p.point_id]) porPonto[p.point_id] = p;
  return porPonto;
}

async function assinar(caminhos) {
  if (!caminhos.length) return {};
  const r = await fetch(`${SB_URL}/storage/v1/object/sign/fotos`, {
    method: "POST", headers: { ...sbHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: 3600, paths: caminhos }),
  });
  if (!r.ok) throw new Error(`sign ${r.status}`);
  const out = {};
  for (const d of await r.json()) if (d.signedURL) out[d.path] = `${SB_URL}/storage/v1${d.signedURL}`;
  return out;
}

// ---------- <head> tags ----------
function cabecalho({ titulo, descricao, url, imagem, alt, extra = "" }) {
  return [
    "<!-- partilha:inicio (gerado por scripts/gerar_partilhas.mjs) -->",
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(descricao)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Mata-Sede">`,
    `<meta property="og:locale" content="pt_PT">`,
    `<meta property="og:title" content="${esc(titulo)}">`,
    `<meta property="og:description" content="${esc(descricao)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${imagem}">`,
    `<meta property="og:image:type" content="image/jpeg">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(alt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(titulo)}">`,
    `<meta name="twitter:description" content="${esc(descricao)}">`,
    `<meta name="twitter:image" content="${imagem}">`,
    extra,
    "<!-- partilha:fim -->",
  ].filter(Boolean).join("\n");
}
function trocarCabecalho(html, bloco) {
  const a = html.indexOf("<!-- partilha:inicio"), b = html.indexOf("<!-- partilha:fim -->");
  if (a < 0 || b < 0) throw new Error("faltam as marcas partilha:inicio / partilha:fim");
  return html.slice(0, a) + bloco + html.slice(b + "<!-- partilha:fim -->".length);
}
const IMG_SITE = `${SITE}/partilha/mata-sede.jpg`;
const ALT_SITE = "Mapa de Lisboa com os bebedouros públicos marcados a azul, e o título Mata a sede.";

function descricaoDe(p) {
  return `Bebedouro público em ${p.address || "Lisboa"}, Lisboa${p.accessible === true ? ", acessível a mobilidade reduzida" : ""}. ` +
    "Vê as fotos, se está a funcionar e como lá chegar a pé.";
}

// ---------- pages ----------
function paginas(versoes) {
  // The three fixed pages.
  const fixas = [
    { f: "index.html", titulo: "Mata-Sede · os bebedouros de Lisboa num só mapa", url: `${SITE}/`,
      descricao: "Os 438 bebedouros públicos de Lisboa num só mapa, com fotos de quem lá passou, se estão a funcionar e como lá chegar. Água boa e de graça." },
    { f: "mapa/index.html", titulo: "Mapa dos bebedouros de Lisboa · Mata-Sede", url: `${SITE}/mapa/`,
      descricao: "Encontra o bebedouro mais perto de ti em Lisboa: 438 bebedouros públicos, com fotos, estado e taça para animais. Também chafarizes e bicas." },
    { f: "enviar/index.html", titulo: "Enviar foto de um bebedouro · Mata-Sede", url: `${SITE}/enviar/`,
      descricao: "Passaste por um bebedouro em Lisboa? Envia uma foto e ajuda quem vem a seguir a saber como está." },
  ];
  for (const p of fixas) {
    escrever(p.f, trocarCabecalho(ler(p.f), cabecalho({ ...p, imagem: `${IMG_SITE}?v=${versoes["mata-sede"] || 1}`, alt: ALT_SITE })));
  }

  // One page per bebedouro: a copy of the map page with its own <head> and a short text summary for search engines.
  const modelo = ler("mapa/index.html");
  const feitos = new Set();
  for (const f of bebedouros) {
    const p = f.properties, url = `${SITE}/b/${f.id}/`, [lng, lat] = f.geometry.coordinates;
    const descricao = descricaoDe(p);
    const imagem = `${SITE}/partilha/${f.id}.jpg?v=${versoes[f.id] || 1}`;
    const ld = {
      "@context": "https://schema.org", "@type": "Place", name: p.name, description: descricao, url, image: imagem.split("?")[0],
      address: { "@type": "PostalAddress", streetAddress: p.address || undefined, addressLocality: "Lisboa", addressCountry: "PT" },
      geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
      isAccessibleForFree: true, publicAccess: true,
    };
    let html = trocarCabecalho(modelo, cabecalho({
      titulo: `${p.name} · Mata-Sede`, descricao, url, imagem, alt: `${p.name}, ${p.address || "Lisboa"}`,
      extra: `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
    }));
    const resumo = `<div class="sr"><h1>${esc(p.name)}</h1><p>${esc(descricao)}</p>` +
      `<p><a href="https://www.google.com/maps/dir/?api=1&amp;travelmode=walking&amp;destination=${lat},${lng}">Como lá chegar</a> · <a href="/mapa/">Todos os bebedouros de Lisboa</a></p></div>`;
    html = html.replace('<main class="stage">', `<main class="stage">\n  ${resumo}`);
    escrever(`b/${f.id}/index.html`, html);
    feitos.add(f.id);
  }
  // Remove pages of fountains no longer in the data.
  if (fs.existsSync(path.join(ROOT, "b"))) {
    for (const d of fs.readdirSync(path.join(ROOT, "b"))) if (!feitos.has(d)) fs.rmSync(path.join(ROOT, "b", d), { recursive: true });
  }

  // Sitemap and robots.
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = [`${SITE}/`, `${SITE}/mapa/`, `${SITE}/enviar/`, ...bebedouros.map((f) => `${SITE}/b/${f.id}/`)];
  escrever("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc><lastmod>${hoje}</lastmod></url>`).join("\n") + "\n</urlset>\n");
  escrever("robots.txt", `User-agent: *\nAllow: /\nDisallow: /scripts/\nDisallow: /preview.html\n\nSitemap: ${SITE}/sitemap.xml\n`);
  console.log(`✓ ${bebedouros.length} páginas de bebedouros, sitemap.xml e robots.txt`);
}

// ---------- preview images ----------
function servidor() {
  const tipos = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
    ".geojson": "application/geo+json", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };
  const s = http.createServer((req, res) => {
    let f = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": tipos[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => s.listen(0, "127.0.0.1", () => r(s)));
}

async function chrome() {
  const porta = 9400 + Math.floor(Math.random() * 400);
  const perfil = fs.mkdtempSync(path.join(process.env.TMPDIR || "/tmp", "matasede-chrome-"));
  const proc = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${porta}`, "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
    "--hide-scrollbars", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", `--user-data-dir=${perfil}`, "about:blank"], { stdio: "ignore" });
  for (let i = 0; i < 60; i++) { try { await (await fetch(`http://127.0.0.1:${porta}/json/version`)).json(); break; } catch { await sleep(250); } }
  async function separador() {
    const t = await (await fetch(`http://127.0.0.1:${porta}/json/new?about:blank`, { method: "PUT" })).json();
    const ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 0; const espera = {};
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && espera[d.id]) { espera[d.id](d.result || {}); delete espera[d.id]; } };
    const send = (method, params = {}) => new Promise((r) => { espera[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
    await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
    return send;
  }
  async function fechar() {
    const saiu = new Promise((r) => proc.once("exit", r));
    proc.kill(); await Promise.race([saiu, sleep(3000)]);
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch {} // a temporary folder; the system clears it anyway
  }
  return { separador, fechar };
}

async function cartao(send, url, destino) {
  await send("Page.navigate", { url });
  for (let i = 0; i < 120; i++) {
    await sleep(250);
    const r = await send("Runtime.evaluate", { expression: "window.PRONTO ? 'ok' : (window.ERRO || '')", returnByValue: true });
    const v = r.result && r.result.value;
    if (v === "ok") {
      const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 80, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
      escrever(destino, Buffer.from(shot.data, "base64"));
      return true;
    }
    if (v) throw new Error(v);
  }
  throw new Error("demorou demasiado");
}

async function imagens(porPonto) {
  const manifesto = fs.existsSync(path.join(ROOT, "partilha/manifest.json")) ? JSON.parse(ler("partilha/manifest.json")) : {};
  const assinados = await assinar(Object.values(porPonto).filter((p) => !p.local).map((p) => p.storage_path)).catch((e) => {
    console.warn("! Não consegui assinar as fotos:", e.message); return {};
  });
  const tarefas = [{ id: "mata-sede", chave: "site", query: "site=1" }];
  for (const f of bebedouros) {
    const foto = porPonto[f.id];
    const fotoUrl = foto && (foto.local || assinados[foto.storage_path]);
    tarefas.push({ id: f.id, chave: fotoUrl ? foto.chave : "mapa",
      query: `id=${f.id}` + (fotoUrl ? `&foto=${encodeURIComponent(fotoUrl)}` : "") });
  }
  const porFazer = tarefas.filter((t) => TUDO || manifesto[t.id]?.chave !== t.chave || !fs.existsSync(path.join(ROOT, `partilha/${t.id}.jpg`)));
  console.log(`… ${porFazer.length} imagens para fazer (${tarefas.length - porFazer.length} já estão em dia)`);
  if (porFazer.length) {
    const srv = await servidor(), base = `http://127.0.0.1:${srv.address().port}/scripts/partilha/cartao.html?`;
    let feitas = 0, falhas = 0, i = 0;
    // One browser per worker: a map in a background tab of a shared browser may never draw.
    await Promise.all(Array.from({ length: PARALELO }, async () => {
      const ch = await chrome(), send = await ch.separador();
      while (i < porFazer.length) {
        const t = porFazer[i++];
        try {
          await cartao(send, base + t.query, `partilha/${t.id}.jpg`);
          manifesto[t.id] = { chave: t.chave, versao: (manifesto[t.id]?.versao || 0) + 1 };
          feitas++;
        } catch (e) { falhas++; console.warn(`! ${t.id}: ${e.message}`); }
        if ((feitas + falhas) % 25 === 0) console.log(`  ${feitas + falhas}/${porFazer.length}`);
      }
      await ch.fechar();
    }));
    srv.close();
    escrever("partilha/manifest.json", JSON.stringify(manifesto, null, 1) + "\n");
    console.log(`✓ ${feitas} imagens feitas${falhas ? `, ${falhas} falharam (corre outra vez para tentar de novo)` : ""}`);
  }
  // Each image's version goes into its URL (?v=…), so apps that cached an old preview fetch the new one.
  return Object.fromEntries(Object.entries(manifesto).map(([k, v]) => [k, v.versao]));
}

const versoes = await imagens(await fotos());
paginas(versoes);
