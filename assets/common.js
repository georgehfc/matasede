// Mata-Sede: helpers shared by the map and the upload page.
window.MS = (function () {
  var cfg = window.MATASEDE || {};
  var db = null;
  if (cfg.supabaseUrl && cfg.supabaseKey && window.supabase) {
    db = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, { auth: { persistSession: false } });
  }

  var KIND = { bebedouro: "Bebedouro", chafariz: "Chafariz", bica: "Bica", nevoeiro: "Ponto de nevoeiro" };
  var NOTE = {
    chafariz: "Património histórico. Nem todos têm água potável.",
    bica: "Património histórico. Nem todas têm água potável.",
    nevoeiro: "Serve para refrescar, não para beber."
  };

  var pointsPromise = null;
  function points() {
    if (!pointsPromise) {
      pointsPromise = fetch("/data/pontos.geojson").then(function (r) {
        if (!r.ok) throw new Error("pontos " + r.status);
        return r.json();
      });
    }
    return pointsPromise;
  }

  // Distance in metres between two [lng, lat] pairs.
  function dist(a, b) {
    var R = 6371000, rad = Math.PI / 180;
    var dLat = (b[1] - a[1]) * rad, dLng = (b[0] - a[0]) * rad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function nearest(features, at, n) {
    return features
      .map(function (f) { return { f: f, m: dist(at, f.geometry.coordinates) }; })
      .sort(function (x, y) { return x.m - y.m; })
      .slice(0, n || 5);
  }
  function fmtDist(m) {
    return m < 1000 ? Math.round(m / 10) * 10 + " m" : (m / 1000).toFixed(1).replace(".", ",") + " km";
  }
  function walkMin(m) { return Math.max(1, Math.round(m / 80)); }
  function norm(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function search(features, q, n) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return features.filter(function (f) {
      var hay = norm(f.properties.name + " " + f.properties.address);
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    }).slice(0, n || 8);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function thumbPath(p) { return p.replace(/\.jpg$/, "-t.jpg"); }

  function approvedPhotos() {
    if (!db) return Promise.resolve([]);
    return db.from("photos")
      .select("id,point_id,storage_path,taken_at,credit,created_at")
      .eq("moderation", "approved")
      .order("created_at", { ascending: false })
      .then(function (res) {
        if (res.error) { console.warn(res.error); return []; }
        return res.data || [];
      });
  }
  // Photos published by the Câmara Municipal de Lisboa, shipped with the site in /fotos-cml/ (data/fotos-cml.json).
  // Same shape as Supabase photos; their storage_path starts with "cml/" so signed() leaves them alone.
  function cmlPhotos() {
    return fetch("/data/fotos-cml.json").then(function (r) { return r.ok ? r.json() : { photos: [] }; })
      .then(function (d) {
        return (d.photos || []).map(function (p) {
          return { id: "cml-" + p.file, point_id: p.point_id, storage_path: "cml/" + p.file, taken_at: p.taken_at,
            credit: p.credit, created_at: null, source: p.source };
        });
      }).catch(function () { return []; });
  }
  // Every photo to show: approved ones from Supabase plus the CML ones.
  function allPhotos() {
    return Promise.all([approvedPhotos(), cmlPhotos()]).then(function (r) { return r[0].concat(r[1]); });
  }
  // Returns {path: url} for the given storage paths. CML photos are plain files on this site.
  function signed(paths) {
    var out = {}, remote = [];
    paths.forEach(function (p) { if (p.indexOf("cml/") === 0) out[p] = "/fotos-cml/" + p.slice(4); else remote.push(p); });
    if (!db || !remote.length) return Promise.resolve(out);
    return db.storage.from("fotos").createSignedUrls(remote, 6 * 3600).then(function (res) {
      (res.data || []).forEach(function (d) { if (d.signedUrl) out[d.path] = d.signedUrl; });
      return out;
    });
  }
  // Reports: the newest answer per fountain and question (taca, garrafa, funciona), from the reports_latest view.
  function latestReports() {
    if (!db) return Promise.resolve([]);
    return db.from("reports_latest").select("point_id,field,value,created_at").then(function (res) {
      if (res.error) { console.warn(res.error); return []; }
      return res.data || [];
    });
  }
  // A random id for this browser, so the database can replace its own earlier answer. Not linked to a person.
  var deviceId = null;
  function device() {
    if (deviceId) return deviceId;
    try { deviceId = localStorage.getItem("ms-device"); } catch (e) {}
    if (!deviceId) {
      deviceId = crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function (c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      });
      try { localStorage.setItem("ms-device", deviceId); } catch (e) {}
    }
    return deviceId;
  }
  function report(pointId, field, value) {
    if (!db) return Promise.reject(new Error("sem_ligacao"));
    return db.from("reports").insert({ point_id: pointId, field: field, value: value, device: device() }).then(function (res) {
      if (res.error) throw res.error;
    });
  }
  // "agora mesmo", "há 5 min", "há 3 h", "ontem", "há 4 dias", then month and year.
  function ago(iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (isNaN(s)) return "";
    if (s < 90) return "agora mesmo";
    if (s < 3600) return "há " + Math.round(s / 60) + " min";
    if (s < 86400) return "há " + Math.round(s / 3600) + " h";
    if (s < 172800) return "ontem";
    if (s < 30 * 86400) return "há " + Math.round(s / 86400) + " dias";
    return "em " + monthYear(iso);
  }

  function monthYear(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
  }

  return {
    db: db, KIND: KIND, NOTE: NOTE, points: points, dist: dist, nearest: nearest, fmtDist: fmtDist,
    walkMin: walkMin, norm: norm, search: search, esc: esc, thumbPath: thumbPath,
    approvedPhotos: approvedPhotos, cmlPhotos: cmlPhotos, allPhotos: allPhotos, signed: signed, monthYear: monthYear,
    latestReports: latestReports, report: report, ago: ago
  };
})();
