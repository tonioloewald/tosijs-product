# Decisions

Standing owner decisions about this project: things that look like open work but have been
ruled on. Open work lives on the board (see `TODO.md`).

## Accepted risk: the unrestricted public Mapbox token

The Mapbox token used by `src/tosi-scroll-map.ts`, `README.md` and the deployed `docs/` is
unrestricted. The 0.7.0 review confirmed it: the API returns 200 with a spoofed referer, so any
origin can bill tiles to the account.

**The owner accepted this on 2026-09-01.** It's a public token, which is designed to be
client-visible, and the demo needs a live one. Restricting it to `product.tosijs.net` in the
Mapbox dashboard is still the cheap mitigation if that changes.

## 2026-10-26: the deferred items (#2515, #2525, #2533, #2535)

The owner took the recommended default on each:

- **#2535, migrate off `elementCreator({ tag })`.** Do it now, as its own change: tag names and
  exported factories stay exactly as they are, and a test proves it.
- **#2533, the header listens only to window scroll.** Fix it with `getScrollParent`, with a
  test for the embedded case, and say so in the CHANGELOG. Pages that scroll the window are
  unchanged.
- **#2515, cut the IIFE with per-component subpaths.** Measure first. The task's 578kB → 72kB
  figure predates tosijs-ui 1.14.1's editor-free barrel. Narrowing `globalThis.tosijsUi` is
  breaking, and is worth it only if the saving is large.
- **#2525, ship the doc-site sourcemaps.** Keep them: the source is public on GitHub anyway.
  `iife.js.map` leaves with `iife.js` when tosijs-ui #2437 ships.
- **#2534, Prism SRI.** Closed as obsolete: it shipped in 0.7.0.
