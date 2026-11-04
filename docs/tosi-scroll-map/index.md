# `<tosi-scroll-map>`

Waypoint-driven scroll controller for a tosijs-ui [`<tosi-map>`](https://ui.tosijs.net/mapbox)
(Mapbox). Inside a `<tosi-map>` within a section, each `<tosi-waypoint coords="lat,lng,zoom">`
becomes a keyframe; as the section pins, the map flies between them — pure declarative HTML, no
scroll callbacks. Latitude, longitude and zoom interpolate independently, so a low-zoom mid-flight
waypoint gives a dramatic zoom-out-then-in.

<style>.doc-content:has(.doc-demo){--doc-content-padding:0;--doc-content-overflow:visible}.doc-content:has(.doc-demo)>:not(.doc-demo):not(style){max-width:44rem;margin-inline:auto;padding-inline:1.25rem;box-sizing:border-box}.doc-demo .media{height:var(--tosi-view-size,70vh);position:relative;overflow:hidden;background:#0a0a12}.doc-demo .media>tosi-map{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}</style>
<tosi-product class="doc-demo">
<tosi-product-section scroll="150">
<div class="media">
<tosi-map token="pk.eyJ1IjoicG9kcGVyc29uIiwiYSI6ImNqc2JlbWU0bjA1ZmY0YW5ycHZod3VhbWcifQ.arvqfpOqMgFYkKgQ35UScA" coords="37.4636,-122.4286,12" map-style="mapbox://styles/mapbox/satellite-streets-v12">
<tosi-scroll-map data-scroll-animate easing="ease-in-out">
<tosi-waypoint progress="0" coords="37.4636,-122.4286,12"></tosi-waypoint>
<tosi-waypoint progress="0.5" coords="51,0,2"></tosi-waypoint>
<tosi-waypoint progress="1" coords="65.0121,25.4651,12"></tosi-waypoint>
</tosi-scroll-map>
</tosi-map>
</div>
</tosi-product-section>
</tosi-product>

## Attributes

`<tosi-scroll-map>`
- **`easing`** — `"ease-in-out"` eases each segment (default: linear).

`<tosi-waypoint>`
- **`progress`** — 0 → 1 keyframe position.
- **`coords`** — `"lat,lng,zoom"` (the same triple `<tosi-map>` takes), or separate **`lat`** / **`lng`** / **`zoom`** attributes.

See also [`<tosi-scroll-camera>`](/tosi-b3d-scroll/) and [`<tosi-product>`](/tosi-product/).
