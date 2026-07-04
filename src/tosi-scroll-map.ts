import { Component, elements } from "tosijs";

const { slot } = elements;

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Nearest enclosing <tosi-map> ancestor, or a <tosi-map> sibling at any level. */
function findMap(el: HTMLElement): any {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    if (node.tagName === "TOSI-MAP") return node;
    for (const child of Array.from(node.children)) {
      if (child !== el && child.tagName === "TOSI-MAP") return child;
    }
    node = node.parentElement;
  }
  return null;
}

type MapWaypoint = { progress: number; lat: number; lng: number; zoom: number };

/**
 * Read <tosi-waypoint> children. Each carries a `coords="lat,lng,zoom"` (matching
 * <tosi-map>'s own attribute), or separate `lat`/`lng`/`zoom` attributes.
 */
function readMapWaypoints(host: HTMLElement): MapWaypoint[] {
  return Array.from(host.querySelectorAll("tosi-waypoint"))
    .map((wp) => {
      const parts = (wp.getAttribute("coords") || "")
        .split(",")
        .map((n) => Number(n.trim()));
      const at = (i: number, attr: string, fallback: number) =>
        Number.isFinite(parts[i]) ? parts[i] : Number(wp.getAttribute(attr) ?? fallback);
      return {
        progress: Number(wp.getAttribute("progress") || 0),
        lat: at(0, "lat", 0),
        lng: at(1, "lng", 0),
        zoom: at(2, "zoom", 1),
      };
    })
    .sort((a, b) => a.progress - b.progress);
}

/**
 * # &lt;tosi-scroll-map&gt;
 *
 * Waypoint-driven scroll controller for a [tosijs-ui `<tosi-map>`](https://ui.tosijs.net/mapbox)
 * (Mapbox). Place it inside (or as a sibling of) a `<tosi-map>` within a
 * `<tosi-product-section>`; as the section pins, the map flies between the
 * waypoints — pure declarative HTML, no scroll callbacks.
 *
 * Each `<tosi-waypoint>` carries a `coords="lat,lng,zoom"` (the same triple
 * `<tosi-map>` itself takes), or separate `lat` / `lng` / `zoom` attributes.
 * Latitude, longitude and zoom are interpolated independently between the
 * surrounding waypoints; `easing="ease-in-out"` applies easeInOutQuad per
 * segment (default: linear).
 *
 * ```html
 * <tosi-product-section scroll="400">
 *   <div class="media-scene">
 *     <tosi-map token="pk...." coords="37.46,-122.43,12" map-style="mapbox://styles/mapbox/dark-v11">
 *       <tosi-scroll-map data-scroll-animate easing="ease-in-out">
 *         <tosi-waypoint progress="0"   coords="37.46,-122.43,12"></tosi-waypoint>
 *         <tosi-waypoint progress="0.5" coords="51,0,2"></tosi-waypoint>
 *         <tosi-waypoint progress="1"   coords="65.01,25.47,12"></tosi-waypoint>
 *       </tosi-scroll-map>
 *     </tosi-map>
 *   </div>
 * </tosi-product-section>
 * ```
 */
export class TosiScrollMap extends Component {
  static initAttributes = {
    easing: "",
  };

  static styleSpec = {
    ":host": { display: "none" },
  };

  content = () => slot();

  setScrollProgress(progress: number) {
    const map = findMap(this);
    if (!map) return;

    const wps = readMapWaypoints(this);
    if (wps.length === 0) return;

    const easing = this.getAttribute("easing") === "ease-in-out";

    let lat: number, lng: number, zoom: number;
    const first = wps[0];
    const last = wps[wps.length - 1];
    if (progress <= first.progress) {
      ({ lat, lng, zoom } = first);
    } else if (progress >= last.progress) {
      ({ lat, lng, zoom } = last);
    } else {
      let a = first;
      let b = last;
      for (let i = 0; i < wps.length - 1; i++) {
        if (progress >= wps[i].progress && progress <= wps[i + 1].progress) {
          a = wps[i];
          b = wps[i + 1];
          break;
        }
      }
      const raw = (progress - a.progress) / (b.progress - a.progress || 1);
      const t = easing ? easeInOutQuad(raw) : raw;
      lat = lerp(a.lat, b.lat, t);
      lng = lerp(a.lng, b.lng, t);
      zoom = lerp(a.zoom, b.zoom, t);
    }

    map.coords = `${lat.toFixed(6)},${lng.toFixed(6)},${zoom.toFixed(4)}`;
  }
}

export const tosiScrollMap = TosiScrollMap.elementCreator({
  tag: "tosi-scroll-map",
});
