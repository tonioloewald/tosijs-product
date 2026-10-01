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
