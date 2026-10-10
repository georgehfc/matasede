// Mata-Sede map page (shared by /mapa/ and every fountain page /b/<id>/).
(function () {
  var params = new URLSearchParams(location.search);
  var STYLE = params.get("estilo") === "teste"
    ? { version: 8, sources: {}, layers: [{ id: "bg", type: "background", paint: { "background-color": "#ECECE8" } }] }
    : "https://tiles.openfreemap.org/styles/liberty";
  var AZUL = "#2457F5";
  // Line icons (Lucide, ISC licence): inner SVG markup by name.
  var ICONS = {"gota": "<path d=\"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z\"/>", "chafariz": "<line x1=\"3\" x2=\"21\" y1=\"22\" y2=\"22\"/> <line x1=\"6\" x2=\"6\" y1=\"18\" y2=\"11\"/> <line x1=\"10\" x2=\"10\" y1=\"18\" y2=\"11\"/> <line x1=\"14\" x2=\"14\" y1=\"18\" y2=\"11\"/> <line x1=\"18\" x2=\"18\" y1=\"18\" y2=\"11\"/> <polygon points=\"12 2 20 7 4 7\"/>", "acessivel": "<circle cx=\"16\" cy=\"4\" r=\"1\"/> <path d=\"m18 19 1-7-6 1\"/> <path d=\"m5 8 3-3 5.5 3-2.36 3.5\"/> <path d=\"M4.24 14.5a5 5 0 0 0 6.88 6\"/> <path d=\"M13.76 17.5a5 5 0 0 0-6.88-6\"/>", "taca": "<path d=\"M11.25 16.25h1.5L12 17z\"/> <path d=\"M16 14v.5\"/> <path d=\"M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309\"/> <path d=\"M8 14v.5\"/> <path d=\"M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5\"/>", "garrafa": "<path d=\"M8 2h8\"/> <path d=\"M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2\"/> <path d=\"M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0\"/>", "funciona": "<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"m9 12 2 2 4-4\"/>", "camara": "<path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\"/> <circle cx=\"12\" cy=\"13\" r=\"3\"/>", "lupa": "<circle cx=\"11\" cy=\"11\" r=\"8\"/> <path d=\"m21 21-4.3-4.3\"/>", "andar": "<path d=\"M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z\"/> <path d=\"M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z\"/> <path d=\"M16 17h4\"/> <path d=\"M4 13h4\"/>", "mapa": "<polygon points=\"3 11 22 2 13 21 11 13 3 11\"/>", "brilho": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\"/> <path d=\"M20 3v4\"/> <path d=\"M22 5h-4\"/> <path d=\"M4 17v2\"/> <path d=\"M5 18H3\"/>", "x": "<path d=\"M18 6 6 18\"/> <path d=\"m6 6 12 12\"/>", "partilhar": "<path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\"/> <polyline points=\"16 6 12 2 8 6\"/> <line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"15\"/>", "sol": "<circle cx=\"12\" cy=\"12\" r=\"4\"/> <path d=\"M12 2v2\"/> <path d=\"M12 20v2\"/> <path d=\"m4.93 4.93 1.41 1.41\"/> <path d=\"m17.66 17.66 1.41 1.41\"/> <path d=\"M2 12h2\"/> <path d=\"M20 12h2\"/> <path d=\"m6.34 17.66-1.41 1.41\"/> <path d=\"m19.07 4.93-1.41 1.41\"/>", "lua": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"/>", "avariado": "<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"m15 9-6 6\"/> <path d=\"m9 9 6 6\"/>", "esq": "<path d=\"m15 18-6-6 6-6\"/>", "dir": "<path d=\"m9 18 6-6-6-6\"/>"};
  function ic(name) {
    return '<svg class="ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || "") + "</svg>";
  }
  var KIND_ICON = { bebedouro: "gota", chafariz: "chafariz", bica: "chafariz" };
  var all = null, byId = {}, photos = {}, thumbs = {}, me = null, sel = null, photoIx = 0;
  var filters = { bebedouro: true, heritage: false, acc: false, taca: false, garrafa: false, funciona: false, fotos: false }; // chafarizes e bicas off by default
  // The three questions anyone can answer in the fountain card. rep[pointId][field] = { value, at } holds the newest answer.
  var ASK = [
    { f: "funciona", icon: "funciona", label: "A funcionar", yes: "A funcionar", no: "Avariado" },
    { f: "taca", icon: "taca", label: "Taça para animais", yes: "Tem", no: "Não tem" },
    { f: "garrafa", icon: "garrafa", label: "Torneira para garrafas", yes: "Tem", no: "Não tem" }
  ];
  var rep = {};
  var ERRO = "#D3263A"; // --erro: red only ever means broken
  var MAU = ["==", ["get", "funciona"], false]; // map expression: reported broken
  // A white ✕ drawn in code (no image file), 16 px on screen.
  function crossImage() {
    var c = document.createElement("canvas"); c.width = c.height = 32;
    var g = c.getContext("2d");
    g.strokeStyle = "#fff"; g.lineWidth = 4.5; g.lineCap = "round";
    g.beginPath(); g.moveTo(9, 9); g.lineTo(23, 23); g.moveTo(23, 9); g.lineTo(9, 23); g.stroke();
    return g.getImageData(0, 0, 32, 32);
  }
  var markers = {};
  var card = document.getElementById("card");

  var map = new maplibregl.Map({
    container: "map", style: STYLE, center: [-9.1393, 38.7223], zoom: 12.2, maxZoom: 19,
    attributionControl: { compact: true }
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
  var geo = new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true });
  map.addControl(geo, "bottom-right");
  geo.on("geolocate", function (e) { me = [e.coords.longitude, e.coords.latitude]; if (sel) renderCard(); });

  function visible(f) {
    var p = f.properties;
    if (p.kind === "bebedouro" && !filters.bebedouro) return false;
    if (p.kind !== "bebedouro" && !filters.heritage) return false;
    if (filters.acc && p.accessible !== true) return false;
    if (filters.fotos && !p.fotos) return false;
    if (filters.taca && p.taca !== true) return false;
    if (filters.garrafa && p.garrafa !== true) return false;
    if (filters.funciona && p.funciona !== true) return false;
    return true;
  }
  function data() { return { type: "FeatureCollection", features: all.features.filter(visible) }; }

  function showError(msg) {
    var d = document.createElement("div"); d.className = "err"; d.textContent = msg;
    document.querySelector(".stage").appendChild(d);
  }

  // OpenFreeMap Liberty, recoloured toward the brand: cool pale ground, white streets, mint parks, cobalt-tinted water.
  var BASE = { ground: "#F1F4FA", block: "#E6EBF5", building: "#E1E7F2", casing: "#D7DFEF", street: "#FFFFFF",
    park: "#D9EFDB", water: "#CAD7FD", rail: "#C6CEE0", label: "#5B6380" };
  function restyleBaseMap() {
    (map.getStyle().layers || []).forEach(function (l) {
      var id = l.id, set = function (k, v) { try { map.setPaintProperty(id, k, v); } catch (e) {} };
      if (l.type === "background") set("background-color", BASE.ground);
      else if (l.type === "fill") {
        if (id === "water") set("fill-color", BASE.water);
        else if (/park|grass|wood|wetland/.test(id)) set("fill-color", BASE.park);
        else if (id === "building") set("fill-color", BASE.building);
        else if (/^landuse|landcover_sand|aeroway/.test(id)) set("fill-color", BASE.block);
      } else if (l.type === "fill-extrusion") set("fill-extrusion-color", BASE.building);
      else if (l.type === "line") {
        if (/^waterway/.test(id)) set("line-color", BASE.water);
        else if (/rail/.test(id)) set("line-color", BASE.rail);
        else if (/casing$/.test(id)) set("line-color", BASE.casing);
        else if (/^(road|tunnel|bridge)_/.test(id)) set("line-color", BASE.street);
        else if (id === "park_outline") set("line-color", BASE.park);
      } else if (l.type === "symbol") {
        if (/^poi/.test(id)) { set("icon-opacity", 0.55); set("text-opacity", 0.75); }
        if (l.layout && l.layout["text-field"]) set("text-color", BASE.label);
      }
    });
  }

  map.on("error", function (e) { console.warn(e && e.error); });

  map.on("load", function () {
    restyleBaseMap();
    Promise.all([MS.points(), MS.allPhotos(), MS.latestReports()]).then(function (res) {
      all = res[0];
      res[2].forEach(function (r) { (rep[r.point_id] = rep[r.point_id] || {})[r.field] = { value: r.value, at: r.created_at }; });
      res[1].forEach(function (ph) { (photos[ph.point_id] = photos[ph.point_id] || []).push(ph); });
      Object.keys(photos).forEach(function (id) {
        // Newest first; undated photos (some of CML's) go last.
        photos[id].sort(function (a, b) { return (b.taken_at || b.created_at || "").localeCompare(a.taken_at || a.created_at || ""); });
      });
      all.features.forEach(function (f) { byId[f.id] = f; f.properties.fotos = (photos[f.id] || []).length; applyReports(f); });
      var withPhoto = all.features.filter(function (f) { return f.properties.kind === "bebedouro" && f.properties.fotos; }).length;
      if (withPhoto) {
        var c = document.getElementById("count");
        // The 438 challenge: how many bebedouros already have a photo.
        c.innerHTML = ic("camara") + "<span><b>" + withPhoto + "</b> de 438 bebedouros com foto" +
          '<span class="bar"><i style="width:' + Math.max(2, Math.round(withPhoto / 438 * 100)) + '%"></i></span></span>';
        c.hidden = false;
      }
      var tpaths = res[1].map(function (ph) { return MS.thumbPath(ph.storage_path); });
      var fpaths = res[1].map(function (ph) { return ph.storage_path; });
      return MS.signed(tpaths.concat(fpaths)).then(function (urls) { thumbs = urls; addLayers(); });
    }).catch(function (e) {
      console.error(e); showError("Não foi possível carregar os pontos. Tenta recarregar a página.");
    });
  });

  // Copies the newest answers onto the point, so filters and pin colours can read them.
  function applyReports(f) {
    var r = rep[f.id] || {};
    ASK.forEach(function (a) { if (r[a.f]) f.properties[a.f] = r[a.f].value; else delete f.properties[a.f]; });
  }

  function addLayers() {
    map.addSource("pts", { type: "geojson", data: data(), cluster: true, clusterMaxZoom: 14, clusterRadius: 46 });
    // A soft halo behind each cluster bubble.
    map.addLayer({ id: "clusters-halo", type: "circle", source: "pts", filter: ["has", "point_count"],
      paint: { "circle-color": AZUL, "circle-opacity": 0.18, "circle-radius": ["step", ["get", "point_count"], 23, 10, 28, 40, 35] } });
    map.addLayer({ id: "clusters", type: "circle", source: "pts", filter: ["has", "point_count"],
      paint: { "circle-color": AZUL, "circle-stroke-color": "#fff", "circle-stroke-width": 2,
        "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 40, 26] } });
    if (typeof STYLE === "string") {
      map.addLayer({ id: "cluster-n", type: "symbol", source: "pts", filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-font": ["Noto Sans Bold"], "text-size": 13, "text-allow-overlap": true },
        paint: { "text-color": "#fff" } });
    }
    map.addLayer({ id: "pt", type: "circle", source: "pts", filter: ["!", ["has", "point_count"]],
      paint: {
        // Broken dots grow from zoom 15 to make room for their ✕.
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 4, 15, ["case", MAU, 8, 7], 16, ["case", MAU, 11, 8]],
        "circle-color": ["case", MAU, ERRO, ["match", ["get", "kind"], "bebedouro", AZUL, "#FFFFFF"]],
        "circle-stroke-color": ["match", ["get", "kind"], "bebedouro", "#FFFFFF", AZUL],
        "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 11, 1.5, 16, 2.5]
      } });
    // Status never by colour alone: a white ✕ on broken dots once they are big enough to hold it.
    map.addImage("mau-x", crossImage(), { pixelRatio: 2 });
    map.addLayer({ id: "pt-mau", type: "symbol", source: "pts", minzoom: 15, filter: ["all", ["!", ["has", "point_count"]], MAU],
      layout: { "icon-image": "mau-x", "icon-size": ["interpolate", ["linear"], ["zoom"], 15, 0.8, 16, 1], "icon-allow-overlap": true, "icon-ignore-placement": true } });
    map.addLayer({ id: "pt-sel", type: "circle", source: "pts", filter: ["==", ["get", "id"], ""],
      paint: { "circle-radius": 14, "circle-color": "rgba(0,0,0,0)", "circle-stroke-color": "#071447", "circle-stroke-width": 3 } });

    map.on("click", "clusters", function (e) {
      var f = e.features[0];
      map.getSource("pts").getClusterExpansionZoom(f.properties.cluster_id).then(function (z) {
        map.easeTo({ center: f.geometry.coordinates, zoom: z + 0.5 });
      });
    });
    map.on("click", "pt", function (e) { select(e.features[0].properties.id, false); });
    // A click on empty map (not a pin or a cluster) closes the open fountain card, like clicking outside a modal.
    map.on("click", function (e) {
      if (!sel) return;
      if (map.queryRenderedFeatures(e.point, { layers: ["pt", "clusters"] }).length) return;
      closeCard();
    });
    ["clusters", "pt"].forEach(function (l) {
      map.on("mouseenter", l, function () { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", l, function () { map.getCanvas().style.cursor = ""; });
    });
    map.on("render", syncPhotoPins);
    map.on("zoom", sizePhotoPins); sizePhotoPins();

    // A fountain to open: /b/<id>/ (its own page) or the older /mapa/?ponto=<id>.
    var start = params.get("ponto") || (location.pathname.match(/^\/b\/([0-9a-f-]{36})\/?$/) || [])[1];
    if (start && byId[start]) select(start, true);
  }

  // Photo pin size: 56 px up to zoom 14 (when they first leave the clusters), easing to 50 px from zoom 17.
  function sizePhotoPins() {
    var z = Math.min(17, Math.max(14, map.getZoom()));
    map.getContainer().style.setProperty("--ppin", Math.round(56 - (z - 14) * 2) + "px");
  }

  // Photo thumbnails replace the dot for points that have an approved photo, once they are out of a cluster.
  var syncQueued = false;
  function syncPhotoPins() {
    if (syncQueued) return; syncQueued = true;
    requestAnimationFrame(function () {
      syncQueued = false;
      if (!map.getSource("pts")) return;
      var seen = {};
      map.querySourceFeatures("pts").forEach(function (f) {
        var p = f.properties;
        if (p.cluster || !p.fotos || seen[p.id]) return;
        var ph = photos[p.id] && photos[p.id][0];
        var url = ph && thumbs[MS.thumbPath(ph.storage_path)];
        if (!url) return;
        seen[p.id] = true;
        if (!markers[p.id]) {
          var el = document.createElement("button");
          el.type = "button"; el.className = "ppin"; el.style.backgroundImage = "url(\"" + url + "\")";
          el.setAttribute("aria-label", p.name);
          el.addEventListener("click", function (ev) { ev.stopPropagation(); select(p.id, false); });
          markers[p.id] = new maplibregl.Marker({ element: el }).setLngLat(byId[p.id].geometry.coordinates).addTo(map);
        }
        markers[p.id].getElement().classList.toggle("sel", p.id === sel);
        var mau = byId[p.id].properties.funciona === false, pin = markers[p.id].getElement();
        pin.classList.toggle("mau", mau);
        pin.setAttribute("aria-label", p.name + (mau ? ", avariado" : ""));
      });
      Object.keys(markers).forEach(function (id) {
        if (!seen[id]) { markers[id].remove(); delete markers[id]; }
      });
    });
  }

  // Each bebedouro has its own page, /b/<id>/, with its own title and preview image for shared links.
  // Chafarizes and bicas don't (yet), so they keep the /mapa/?ponto=<id> address.
  function pageOf(f) {
    return f.properties.kind === "bebedouro" ? "/b/" + f.id + "/" : "/mapa/?ponto=" + encodeURIComponent(f.id);
  }

  function select(id, fly) {
    sel = id; photoIx = 0;
    var f = byId[id];
    if (map.getLayer("pt-sel")) map.setFilter("pt-sel", ["==", ["get", "id"], id]);
    history.replaceState(null, "", pageOf(f));
    document.title = f.properties.name + " · Mata-Sede";
    renderCard();
    // Phones: centre the fountain in the map left visible above the sheet. Desktop: to the right of the card.
    var off = window.innerWidth < 900 ? [0, -Math.round(card.offsetHeight / 2)] : [190, 0];
    if (fly) map.flyTo({ center: f.geometry.coordinates, zoom: Math.max(map.getZoom(), 16.5), offset: off, duration: 900 });
    else if (window.innerWidth < 900) map.easeTo({ center: f.geometry.coordinates, offset: off, duration: 400 });
    syncPhotoPins();
  }

  function renderCard() {
    var f = byId[sel]; if (!f) return;
    var p = f.properties, list = photos[p.id] || [];
    var ll = f.geometry.coordinates;
    var media;
    if (list.length) {
      var many = list.length > 1;
      media = '<div class="media"><div class="fundo-foto" id="phb" aria-hidden="true"></div><img src="" alt="" id="ph" tabindex="0" role="button">' +
        (many ? '<span class="n" id="phn"></span>' +
          '<button type="button" class="nav prev" id="phprev" aria-label="Foto anterior">' + ic("esq") + "</button>" +
          '<button type="button" class="nav next" id="phnext" aria-label="Foto seguinte">' + ic("dir") + "</button>" : "") +
        '<span class="credit" id="phc"></span></div>' +
        (many ? '<ul class="strip" aria-label="Fotos deste bebedouro">' + list.map(function (ph, i) {
          var t = thumbs[MS.thumbPath(ph.storage_path)] || "";
          return '<li><button type="button" data-ph="' + i + '" style="background-image:url(&quot;' + MS.esc(t) + '&quot;)" aria-label="Foto ' +
            (i + 1) + " de " + list.length + '"></button></li>';
        }).join("") + "</ul>" : "");
    } else if (p.kind === "bebedouro") {
      media = '<div class="media invite">' + ic("camara") + "<strong>Ainda sem fotos. Sê o primeiro!</strong>" +
        "<span>Passas por cá? Tira uma foto e ajuda a completar o mapa.</span></div>";
    } else {
      media = "";
    }
    var walk = me ? '<p class="walk">' + ic("andar") + MS.walkMin(MS.dist(me, ll)) + " min a pé · " + MS.fmtDist(MS.dist(me, ll)) + "</p>" : "";
    var tags = p.accessible === true ? '<div class="tags"><span class="tag">' + ic("acessivel") + 'Acessível a mobilidade reduzida</span></div>' : "";
    var note = MS.NOTE[p.kind] ? '<p class="note">' + MS.NOTE[p.kind] + "</p>" : "";
    var dir = "https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=" + ll[1] + "," + ll[0];
    card.innerHTML = '<div class="grip" id="grip"><span class="kind">' + ic(KIND_ICON[p.kind] || "gota") + MS.KIND[p.kind] + "</span>" +
      '<span class="btns"><button type="button" class="close" id="share" aria-label="Partilhar este bebedouro" title="Partilhar">' + ic("partilhar") + "</button>" +
      '<button type="button" class="close" id="close" aria-label="Fechar">' + ic("x") + "</button></span></div>" +
      '<div class="scroll">' + media +
      '<div class="body"><h2>' + MS.esc(p.name) + '</h2><p class="meta">' + MS.esc(p.address) + "</p>" +
      walk + tags + note + (p.kind === "bebedouro" ? askHTML(p.id) : "") +
      '<div class="acts">' + (p.kind === "bebedouro" ? '<a class="btn brilho" href="/enviar/?ponto=' + encodeURIComponent(p.id) + '"><span class="brilho-txt">' + ic("camara") + "Enviar foto</span></a>" : "") +
      '<a class="btn" href="' + dir + '" target="_blank" rel="noopener">' + ic("mapa") + "Como lá chegar</a></div></div></div>";
    card.hidden = false;
    document.getElementById("send").hidden = true;
    document.getElementById("close").onclick = closeCard;
    document.getElementById("share").onclick = share;
    if (list.length) {
      var hero = document.getElementById("ph");
      hero.onclick = openViewer;
      hero.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openViewer(); } };
      showPhoto(photoIx);
    }
    if (list.length > 1) {
      var img = document.getElementById("ph"), x0 = null;
      document.getElementById("phprev").onclick = function () { showPhoto(photoIx - 1); };
      document.getElementById("phnext").onclick = function () { showPhoto(photoIx + 1); };
      card.querySelector(".strip").onclick = function (e) {
        var b = e.target.closest("[data-ph]"); if (b) showPhoto(Number(b.dataset.ph));
      };
      img.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      img.addEventListener("touchend", function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) showPhoto(photoIx + (dx < 0 ? 1 : -1));
      });
    }
  }

  // "O que sabemos": each question shows the newest answer and when it came, plus Sim / Não buttons anyone can press.
  function askHTML(id) {
    var r = rep[id] || {};
    return '<section class="ask" id="ask" aria-labelledby="askh"><h3 id="askh">O que sabemos</h3>' + ASK.map(function (a) {
      var now = r[a.f], status, mau = now && now.value === false && a.f === "funciona";
      if (!now) status = "Ainda ninguém disse";
      else status = (mau ? ic("avariado") : "") + (now.value ? a.yes : a.no) + " · " + MS.ago(now.at);
      return '<div class="q' + (mau ? " mau" : "") + '">' + ic(a.icon) + "<b>" + a.label + "</b><small>" + status + "</small>" +
        '<div class="yn" role="group" aria-label="' + a.label + '">' +
        '<button type="button" data-r="' + a.f + ':1" aria-pressed="' + (!!now && now.value === true) + '">Sim</button>' +
        '<button type="button" data-r="' + a.f + ':0" aria-pressed="' + (!!now && now.value === false) + '">Não</button></div></div>';
    }).join("") + '<p class="hint">Passaste por cá? Responde e ajudas quem vem a seguir.</p></section>';
  }
  function renderAsk(focus) {
    var el = document.getElementById("ask"); if (!el || !sel) return;
    el.outerHTML = askHTML(sel);
    if (focus) { var b = card.querySelector('[data-r="' + focus + '"]'); if (b) b.focus(); }
  }
  // An answer shows straight away; if the database refuses it, it is undone and we say so.
  card.addEventListener("click", function (e) {
    var b = e.target.closest("[data-r]"); if (!b || b.disabled || !sel) return;
    var id = sel, parts = b.dataset.r.split(":"), field = parts[0], value = parts[1] === "1";
    var r = rep[id] = rep[id] || {}, before = r[field];
    if (before && before.value === value && Date.now() - new Date(before.at).getTime() < 60000) return; // same answer just now
    r[field] = { value: value, at: new Date().toISOString() };
    applyReports(byId[id]); map.getSource("pts").setData(data()); syncPhotoPins();
    renderAsk(b.dataset.r);
    MS.report(id, field, value).then(function () {
      note("Obrigado! Já está no mapa.");
    }).catch(function (err) {
      console.warn(err);
      if (before) r[field] = before; else delete r[field];
      applyReports(byId[id]); map.getSource("pts").setData(data()); syncPhotoPins();
      if (sel === id) renderAsk();
      note(err && /demasiados/.test(err.message) ? "Muitas respostas seguidas. Tenta daqui a pouco." : "Não foi possível guardar. Tenta outra vez.");
    });
  });

  // Share: the phone's (or Safari's) share sheet when there is one; otherwise copy the fountain's link.
  function share() {
    var p = byId[sel] && byId[sel].properties; if (!p) return;
    var url = location.origin + pageOf(byId[sel]);
    if (navigator.share) {
      navigator.share({ title: p.name + " · Mata-Sede", text: p.name + ", no mapa de bebedouros de Lisboa.", url: url })
        .catch(function () {}); // closing the sheet without sharing is fine
      return;
    }
    var copy = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(url) : Promise.reject();
    copy.then(function () { note("Link copiado. Cola-o onde quiseres."); })
      .catch(function () { window.prompt("Copia o link deste bebedouro:", url); });
  }

  // Shows photo i of the selected fountain's album (wraps around) without redrawing the card.
  function showPhoto(i) {
    var p = byId[sel] && byId[sel].properties, list = p && photos[p.id] || [];
    if (!list.length) return;
    photoIx = (i % list.length + list.length) % list.length;
    var ph = list[photoIx];
    var img = document.getElementById("ph");
    img.onload = function () { img.classList.toggle("tall", img.naturalHeight > img.naturalWidth); };
    img.src = thumbs[ph.storage_path] || thumbs[MS.thumbPath(ph.storage_path)] || "";
    document.getElementById("phb").style.backgroundImage = img.src ? 'url("' + img.src + '")' : "";
    var when = MS.monthYear(ph.taken_at || ph.created_at);
    img.alt = "Foto de " + p.name + (when ? ", " + when : "");
    img.setAttribute("aria-label", "Ver em grande: " + img.alt);
    var cap = "Foto: " + (ph.credit || "Anónimo") + (when ? " · " + when : "");
    document.getElementById("phc").textContent = cap;
    vimg.src = thumbs[ph.storage_path] || img.src;
    vimg.alt = img.alt;
    document.getElementById("vcap").textContent = p.name + " — " + cap;
    document.getElementById("vn").textContent = list.length > 1 ? (photoIx + 1) + " / " + list.length : "";
    vprev.hidden = vnext.hidden = list.length < 2;
    if (list.length > 1) {
      document.getElementById("phn").textContent = (photoIx + 1) + "/" + list.length;
      card.querySelectorAll("[data-ph]").forEach(function (b) {
        var on = Number(b.dataset.ph) === photoIx;
        b.setAttribute("aria-current", on);
        if (on) b.scrollIntoView({ block: "nearest", inline: "nearest" });
      });
    }
  }
  // Full-screen viewer: same album and position as the card. Esc, the × button or a click outside the photo close it.
  var viewer = document.getElementById("viewer"), vimg = document.getElementById("vimg");
  var vprev = document.getElementById("vprev"), vnext = document.getElementById("vnext");
  function openViewer() {
    if (!viewer.open) viewer.showModal();
    document.getElementById("vclose").focus();
  }
  function closeViewer() {
    if (!viewer.open) return;
    viewer.close();
    var hero = document.getElementById("ph"); if (hero) hero.focus();
  }
  document.getElementById("vclose").onclick = closeViewer;
  vprev.onclick = function () { showPhoto(photoIx - 1); };
  vnext.onclick = function () { showPhoto(photoIx + 1); };
  // A click anywhere except the buttons closes it, the photo included (it shows a zoom-out cursor).
  viewer.addEventListener("click", function (e) { if (e.target === viewer || e.target === vimg || e.target.classList.contains("info")) closeViewer(); });
  viewer.addEventListener("cancel", function (e) { e.preventDefault(); closeViewer(); });
  var vx0 = null;
  viewer.addEventListener("touchstart", function (e) { vx0 = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener("touchend", function (e) {
    if (vx0 === null) return;
    var dx = e.changedTouches[0].clientX - vx0; vx0 = null;
    if (Math.abs(dx) > 40 && !vnext.hidden) showPhoto(photoIx + (dx < 0 ? 1 : -1));
  });

  // Dragging the card by its handle bar.
  // Phones: a bottom sheet with three resting points (full, half, peek); dragging below peek closes it.
  // Desktop: the card moves anywhere over the map; double-click the handle to put it back.
  var phone = window.matchMedia("(max-width: 899px)");
  function sheetStops() {
    var h = card.offsetHeight;
    return { full: 0, half: Math.round(h * 0.45), peek: Math.max(0, h - 176) };
  }
  function setSheet(stop) {
    card.style.setProperty("--sheet-y", sheetStops()[stop] + "px"); card.dataset.sheet = stop;
  }
  function sheetY() {
    var y = parseFloat(card.style.getPropertyValue("--sheet-y"));
    return isNaN(y) ? sheetStops().half : y; // 0 is a real position (full), so no "|| default" here
  }
  var drag = null;
  // Tablets and phones (touch, or 1024 px and narrower): no dragging at all.
  var noDrag = window.matchMedia("(max-width: 1024px), (pointer: coarse)");
  card.addEventListener("pointerdown", function (e) {
    if (noDrag.matches) return;
    if (!e.target.closest(".grip") || e.target.closest(".close") || e.button > 0) return;
    var r = card.getBoundingClientRect(), st = stage.getBoundingClientRect();
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, left: r.left - st.left, top: r.top - st.top,
      sheet: sheetY(), t: Date.now(), moved: false };
    try { card.setPointerCapture(e.pointerId); } catch (err) {}
    card.classList.add("dragging");
  });
  card.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
    if (phone.matches) {
      card.style.setProperty("--sheet-y", Math.max(0, drag.sheet + dy) + "px");
    } else {
      var st = stage.getBoundingClientRect();
      var x = Math.min(Math.max(8, drag.left + dx), st.width - card.offsetWidth - 8);
      var y = Math.min(Math.max(8, drag.top + dy), st.height - 120);
      stage.style.setProperty("--card-x", x + "px"); stage.style.setProperty("--card-y", y + "px");
    }
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    card.classList.remove("dragging");
    if (phone.matches) {
      var y = sheetY(), stops = sheetStops();
      var v = (e.clientY - drag.y0) / Math.max(1, Date.now() - drag.t); // px per ms; a flick picks the next stop
      if (!drag.moved) setSheet(card.dataset.sheet === "peek" ? "half" : card.dataset.sheet === "half" ? "full" : "half"); // a tap cycles up
      else if (y > stops.peek + 70 || (v > 0.9 && card.dataset.sheet === "peek")) closeCard();
      else if (v > 0.5) setSheet(card.dataset.sheet === "full" ? "half" : "peek");
      else if (v < -0.5) setSheet(card.dataset.sheet === "peek" ? "half" : "full");
      else setSheet(["full", "half", "peek"].reduce(function (a, b) { return Math.abs(stops[b] - y) < Math.abs(stops[a] - y) ? b : a; }));
    }
    drag = null;
  }
  card.addEventListener("pointerup", endDrag);
  card.addEventListener("pointercancel", endDrag);
  card.addEventListener("dblclick", function (e) {
    if (!e.target.closest(".grip") || phone.matches) return;
    stage.style.removeProperty("--card-x"); stage.style.removeProperty("--card-y");
  });

  // Phones: drag the card's top bar down to dismiss it. A short drag springs back; a long drag or a flick closes.
  var pull = null;
  card.addEventListener("pointerdown", function (e) {
    if (!phone.matches || !e.target.closest(".grip") || e.target.closest(".close")) return;
    pull = { id: e.pointerId, y0: e.clientY, t: Date.now(), dy: 0 };
    try { card.setPointerCapture(e.pointerId); } catch (err) {}
    card.style.transition = "none";
  });
  card.addEventListener("pointermove", function (e) {
    if (!pull || e.pointerId !== pull.id) return;
    pull.dy = Math.max(0, e.clientY - pull.y0);
    card.style.transform = "translateY(" + pull.dy + "px)";
  });
  function endPull(e) {
    if (!pull || e.pointerId !== pull.id) return;
    var dy = pull.dy, flick = dy / Math.max(1, Date.now() - pull.t) > 0.6;
    pull = null;
    card.style.transition = "transform .22s ease";
    if (dy > 90 || (flick && dy > 20)) {
      card.style.transform = "translateY(100%)";
      setTimeout(closeCard, 220);
    } else {
      card.style.transform = "";
    }
  }
  card.addEventListener("pointerup", endPull);
  card.addEventListener("pointercancel", endPull);

  function closeCard() {
    card.style.transform = ""; card.style.transition = "";
    closeViewer(); sel = null; card.hidden = true; document.getElementById("send").hidden = false;
    if (map.getLayer("pt-sel")) map.setFilter("pt-sel", ["==", ["get", "id"], ""]);
    history.replaceState(null, "", "/mapa/");
    document.title = "Mapa · Mata-Sede";
    syncPhotoPins();
  }
  document.addEventListener("keydown", function (e) {
    if (viewer.open) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); if (!vnext.hidden) showPhoto(photoIx + (e.key === "ArrowRight" ? 1 : -1)); }
      return; // Esc is handled by the dialog's cancel event, so it closes only the viewer
    }
    if (e.key === "Escape" && sel) closeCard();
    if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && sel && !card.hidden && (card.contains(e.target) || e.target === document.body)) {
      showPhoto(photoIx + (e.key === "ArrowRight" ? 1 : -1));
    }
  });

  document.querySelector(".chips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-f]"); if (!b || !all) return;
    filters[b.dataset.f] = !filters[b.dataset.f];
    b.setAttribute(b.getAttribute("role") === "switch" ? "aria-checked" : "aria-pressed", filters[b.dataset.f]);
    var d = data();
    map.getSource("pts").setData(d);
    // Taça, Garrafa and A funcionar only match what people have answered so far: explain an empty map.
    if (!d.features.length && (filters.taca || filters.garrafa || filters.funciona)) {
      note("Ainda ninguém confirmou isto num bebedouro. Abre um e responde!");
    }
  });
  // A short message floating at the bottom, gone after 4 seconds.
  var noteTimer = null;
  function note(msg) {
    var n = document.querySelector(".soon-note");
    if (!n) {
      n = document.createElement("p"); n.className = "soon-note"; n.setAttribute("role", "status");
      document.querySelector(".stage").appendChild(n);
    }
    n.innerHTML = ic("brilho") + "<span>" + MS.esc(msg) + "</span>";
    n.hidden = false;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () { n.hidden = true; }, 4000);
  }

  // Light/dark switch, shown only in the local preview (config.js marks it "teste"). The choice is remembered.
  (function () {
    var b = document.getElementById("tema");
    if (!window.MATASEDE || !MATASEDE.teste) return;
    var root = document.documentElement, dark = window.matchMedia("(prefers-color-scheme: dark)");
    function now() { return root.dataset.theme || (dark.matches ? "dark" : "light"); }
    function paint() {
      var d = now() === "dark";
      b.innerHTML = ic(d ? "sol" : "lua");
      b.setAttribute("aria-label", d ? "Mudar para modo claro" : "Mudar para modo escuro");
      b.title = b.getAttribute("aria-label");
    }
    b.hidden = false; paint();
    b.onclick = function () {
      root.dataset.theme = now() === "dark" ? "light" : "dark";
      try { localStorage.setItem("ms-tema", root.dataset.theme); } catch (e) {}
      paint();
    };
  })();

  // Search: a "Procurar" pill that opens into a panel under the logo (accordion). Esc or a click on the map closes it.
  var q = document.getElementById("q"), results = document.getElementById("results"), hint = document.getElementById("hint");
  var findBtn = document.getElementById("findBtn"), findPanel = document.getElementById("findPanel");
  function openFind() {
    findPanel.hidden = false; findBtn.setAttribute("aria-expanded", "true"); findPanel.parentNode.classList.add("open"); top.classList.add("searching");
    setTimeout(function () { q.focus(); }, 30);
  }
  function closeFind(back) {
    if (findPanel.hidden) return;
    findPanel.hidden = true; findBtn.setAttribute("aria-expanded", "false"); findPanel.parentNode.classList.remove("open"); top.classList.remove("searching");
    q.value = ""; results.innerHTML = ""; results.hidden = true; hint.hidden = false;
    if (back) findBtn.focus();
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !e.target.closest("input, textarea") && !viewer.open) { e.preventDefault(); openFind(); }
  });
  findBtn.addEventListener("click", function () { findPanel.hidden ? openFind() : closeFind(true); });
  q.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); closeFind(true); } });
  q.addEventListener("input", function () {
    if (!all) return;
    var hits = MS.search(all.features, q.value, 8);
    results.innerHTML = hits.map(function (f) {
      return '<li><button type="button" data-id="' + f.id + '"><span class="ico">' + ic(KIND_ICON[f.properties.kind] || "gota") +
        "</span><span><b>" + MS.esc(f.properties.name) + "</b><span>" + MS.esc(f.properties.address) + "</span></span></button></li>";
    }).join("");
    results.hidden = !hits.length;
    hint.hidden = !!hits.length;
    hint.textContent = q.value.trim() ? "Nada encontrado. Experimenta outra rua ou jardim." : "Escreve o nome de uma rua, praça ou jardim.";
  });
  results.addEventListener("click", function (e) {
    var b = e.target.closest("[data-id]"); if (!b) return;
    closeFind(false);
    select(b.dataset.id, true);
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".brand")) closeFind(false); });

  // The fountain card sits just below the floating header on desktop.
  var top = document.getElementById("top"), stage = document.querySelector(".stage");
  function placeCard() { stage.style.setProperty("--top-h", Math.round(top.getBoundingClientRect().bottom + 12) + "px"); }
  if (window.ResizeObserver) new ResizeObserver(placeCard).observe(top);
  placeCard();
})();
