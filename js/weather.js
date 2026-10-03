// Heat header, proof of concept (DESIGN.md, weather module).
// Reads IPMA open data straight from the browser: no key, no account.
// If anything fails, the module stays hidden and nothing else changes.

const FORECAST_URL = "https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1110600.json"; // Lisboa
const WARNINGS_URL = "https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json";
const AREA = "LSB"; // Lisboa district
const HEAT_TYPE = "Tempo Quente";
const LEVELS = ["yellow", "orange", "red"]; // green means no warning

export async function loadWeather() {
  const [forecast, warnings] = await Promise.all([
    fetch(FORECAST_URL).then((r) => r.json()),
    fetch(WARNINGS_URL).then((r) => r.json()).catch(() => []),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const day = forecast.data.find((d) => d.forecastDate === today) || forecast.data[0];
  const max = Math.round(parseFloat(day.tMax));

  const now = new Date();
  const active = warnings.filter(
    (w) =>
      w.idAreaAviso === AREA &&
      w.awarenessTypeName === HEAT_TYPE &&
      LEVELS.includes(w.awarenessLevelID) &&
      new Date(w.startTime) <= now &&
      now <= new Date(w.endTime)
  );
  // Keep the most serious one.
  const level = active
    .map((w) => w.awarenessLevelID)
    .sort((a, b) => LEVELS.indexOf(b) - LEVELS.indexOf(a))[0] || null;

  return { max, level };
}

export function renderWeather(el, weather, t) {
  const { max, level } = weather;
  const label = level ? t.weatherLevel[level] : t.weatherMax;
  const line = level ? t.weatherHeat : t.weatherCalm;
  el.innerHTML = `
    <span class="tempo-valor">${max}°</span>
    <span class="tempo-texto">
      <span class="tempo-rotulo">${level ? `<span class="aviso aviso--${level}" aria-hidden="true"></span>` : ""}${label}</span>
      <span class="tempo-linha">${level ? `${t.weatherMaxShort} · ` : ""}${line}</span>
    </span>`;
  el.title = t.attributionIpma;
  el.hidden = false;
}
