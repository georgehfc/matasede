// Drawn geometric icons (DESIGN.md section 7). They use currentColor,
// so CSS decides the colour. Each one is a 14×14 or 18×18 grid.

export const icons = {
  search: '<svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="M12.5 12.5 17 17"/></svg>',
  locate: '<svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="5"/><path d="M9 0v3M9 15v3M0 9h3M15 9h3"/></svg>',
  accessible: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="2" r="1.2" fill="currentColor" stroke="none"/><path d="M7 5v4h4l1 3"/><path d="M5 7a4 4 0 1 0 5 5"/></svg>',
  bottle: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 1h4v2l1 2v8H4V5l1-2z"/></svg>',
  bowl: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 7h12A6 5 0 0 1 1 7z"/></svg>',
  check: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 7.5 5.5 11 12 3"/></svg>',
  noInfo: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2.4 2"><circle cx="7" cy="7" r="5.5"/></svg>',
  out: '<svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 10 10 2M4 2h6v6"/></svg>',
  back: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 7H2M6 2 1 7l5 5"/></svg>',
  link: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8a3 3 0 0 0 4 0l2-2a3 3 0 0 0-4-4L7 3M8 6a3 3 0 0 0-4 0L2 8a3 3 0 0 0 4 4l1-1"/></svg>',
  photo: '<svg viewBox="0 0 26 22" width="26" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="1.5" y="5" width="23" height="15"/><circle cx="13" cy="12.5" r="4.5"/><path d="M8 5l2-3.5h6L18 5"/></svg>',
};

// Puts the right icon into every element marked data-icon="name".
export function fillIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icons[el.dataset.icon] || "";
  });
}
