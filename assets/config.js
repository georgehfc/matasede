// Ligação ao Supabase. Preenche com os valores de Project Settings → API.
// A chave "anon" (ou "publishable") foi feita para estar numa página pública.
// Nunca ponhas aqui a chave "service_role" (ou "secret").
//
// Dois projetos: o verdadeiro (matasede.pt) e o de testes (matasede-teste).
// A pré-visualização local (localhost) usa sempre o de testes, para que nada do que
// se experimenta no computador chegue ao site a sério.
(function () {
  var REAL = {
    supabaseUrl: "https://zqqslkwalviwivzzslxz.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxcXNsa3dhbHZpd2l2enpzbHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMzM0MjYsImV4cCI6MjEwNjgwOTQyNn0.Hffzi-4s5AwJybl6a3PTxeABhek2qltYxwbZS76REBc"
  };
  var TESTE = {
    supabaseUrl: "https://lzgbvuikxwhmskmyqpqq.supabase.co",
    supabaseKey: "sb_publishable_1Uh2OqNKaUePvNWBtHfdnw_ebqSk0zC",
    teste: true
  };
  var local = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/.test(location.hostname) || location.protocol === "file:";
  window.MATASEDE = local ? TESTE : REAL;
  if (local) {
    try { var tema = localStorage.getItem("ms-tema"); if (tema) document.documentElement.dataset.theme = tema; } catch (e) {}
    console.info("Mata-Sede: a usar o projeto de TESTES (matasede-teste).");
    // A small badge so it's obvious this preview writes to the test project, not the real one.
    document.addEventListener("DOMContentLoaded", function () {
      var b = document.createElement("div");
      b.textContent = "TESTES";
      b.title = "Pré-visualização local: fotos e envios vão para o projeto matasede-teste.";
      b.style.cssText = "position:fixed;left:50%;bottom:6px;transform:translateX(-50%);z-index:9999;padding:3px 9px;border-radius:999px;" +
        "background:#071447;box-shadow:0 0 0 1px #2457F5;color:#fff;font:700 11px/1.2 system-ui,sans-serif;letter-spacing:.08em;pointer-events:none;opacity:.9";
      document.body.appendChild(b);
    });
  }
})();
