// Map pins, drawn once and used twice: on the map and in the legend,
// so the two always match. Change colours or shapes here.

const COBALT = "#1D3CA8";
const WHITE = "#FFFFFF";

const svg = (size, view, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${view} ${view}">${body}</svg>`;

// White glyphs that sit inside the zoomed-in pins (14×14 grid).
const GLYPHS = {
  drop: `<path d="M7 1.5S2.8 6.4 2.8 9a4.2 4.2 0 0 0 8.4 0C11.2 6.4 7 1.5 7 1.5z" fill="${WHITE}"/>`,
  accessible: `<g fill="none" stroke="${WHITE}" stroke-width="1.7"><circle cx="7" cy="2" r="1.3" fill="${WHITE}" stroke="none"/><path d="M7 5v4h4l1 3"/><path d="M5 7a4 4 0 1 0 5 5"/></g>`,
};

export const pins = {
  // A bebedouro: filled cobalt circle with a white ring.
  bebedouro: (size = 20) => svg(size, 20, `<circle cx="10" cy="10" r="8" fill="${COBALT}" stroke="${WHITE}" stroke-width="2.5"/>`),

  // Close up (zoom 16+): a bigger circle with a glyph for what it has.
  bebedouroGota: (size = 32) => svg(size, 32, `<circle cx="16" cy="16" r="14" fill="${COBALT}" stroke="${WHITE}" stroke-width="2.5"/><g transform="translate(9 9)">${GLYPHS.drop}</g>`),
  bebedouroAcessivel: (size = 32) => svg(size, 32, `<circle cx="16" cy="16" r="14" fill="${COBALT}" stroke="${WHITE}" stroke-width="2.5"/><g transform="translate(9 9)">${GLYPHS.accessible}</g>`),

  // Selected: cobalt dot inside a white gap and a cobalt ring.
  selecionado: (size = 44) => svg(size, 44, `<circle cx="22" cy="22" r="20" fill="${WHITE}" stroke="${COBALT}" stroke-width="2.5"/><circle cx="22" cy="22" r="13" fill="${COBALT}"/>`),

  // A group of fountains (zoomed out): bigger cobalt circle, count drawn on top by the map.
  grupo: (size = 36) => svg(size, 36, `<circle cx="18" cy="18" r="16" fill="${COBALT}" stroke="${WHITE}" stroke-width="3"/>`),

  // Chafariz or bica: white diamond with a cobalt outline.
  patrimonio: (size = 16) => svg(size, 16, `<rect x="3.5" y="3.5" width="9" height="9" transform="rotate(45 8 8)" fill="${WHITE}" stroke="${COBALT}" stroke-width="2"/>`),
};

// For MapLibre: turns a pin into an image at 2× for sharp edges.
export function pinImage(draw, size) {
  return new Promise((resolve, reject) => {
    const img = new Image(size * 2, size * 2);
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(draw(size * 2));
  });
}

// For the legend: fills every element marked data-pin="name".
export function fillPins(root = document) {
  root.querySelectorAll("[data-pin]").forEach((el) => {
    el.innerHTML = pins[el.dataset.pin](Number(el.dataset.size) || 16);
  });
}
