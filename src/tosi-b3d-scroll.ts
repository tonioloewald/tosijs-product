/*{ "layout": "full-width" }*/
/*#
# `<tosi-scroll-camera>` · `<tosi-scroll-time>` · `<tosi-scroll-animation>`

Scroll controllers for a tosijs-ui [`<tosi-3d>`](https://ui.tosijs.net/babylon-3d) BabylonJS scene.
Place them inside a `<tosi-3d>` within a section; each reads scroll progress and drives one aspect
of the scene — camera, time-of-day, or an animation — declaratively via `<tosi-waypoint>` children.

<style>.doc-content:has(.doc-demo){--doc-content-padding:0;overflow:visible !important}.doc-content:has(.doc-demo)>:not(.doc-demo):not(style){max-width:44rem;margin-inline:auto;padding-inline:1.25rem;box-sizing:border-box}.doc-demo .media{height:var(--tosi-view-size,70vh);position:relative;overflow:hidden;background:#0a0a12}.doc-demo .media>tosi-3d{position:absolute;inset:0;width:100%;height:100%}</style>
<tosi-product class="doc-demo">
<tosi-product-section scroll="150">
<div class="media">
<tosi-3d src="/macbook_neo.glb" hero-light fov="0.6" clear-color="transparent" data-scroll-animate>
<tosi-scroll-camera data-scroll-animate easing="ease-in-out">
<tosi-waypoint progress="0" alpha="-1.57" beta="1.2" radius="110" target-y="10"></tosi-waypoint>
<tosi-waypoint progress="1" alpha="1.57" beta="1.4" radius="76" target-y="10"></tosi-waypoint>
</tosi-scroll-camera>
</tosi-3d>
</div>
</tosi-product-section>
</tosi-product>

## `<tosi-scroll-camera>`

Interpolates an `ArcRotateCamera` (or a positional camera) across `<tosi-waypoint>` keyframes.
- Arc-rotate: **`alpha`**, **`beta`**, **`radius`**, **`target-x`** / **`target-y`** / **`target-z`**.
- Positional: **`x`**, **`y`**, **`z`**, **`fov`**.
- **`easing="ease-in-out"`** eases each segment.

## `<tosi-scroll-time>`

Maps progress to a time-of-day on a sibling `<tosi-b3d-skybox>` — **`from`** / **`to`** hours. Set
`realtimeScale="0"` on the skybox to stop auto-advance.

```html
<tosi-scroll-time data-scroll-animate from="6" to="18"></tosi-scroll-time>
```

## `<tosi-scroll-animation>`

Scrubs a named BabylonJS `AnimationGroup` to the frame for the current progress — **`name`**.

```html
<tosi-scroll-animation data-scroll-animate name="DoorOpen"></tosi-scroll-animation>
```

See also [`<tosi-scroll-map>`](/tosi-scroll-map/) and [`<tosi-product>`](/tosi-product/).
*/

import { Component, elements } from "tosijs";

/** Parse an attribute to a number, falling back only when it is missing or unparseable — an explicit `0` is a value. */
function num(attr: string | null, fallback: number): number {
  const n = Number(attr);
  return attr !== null && attr !== "" && Number.isFinite(n) ? n : fallback;
}

const { slot } = elements;

function findScene(el: HTMLElement): any {
  // Check ancestors first
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    if ("scene" in node) return node;
    // Also check siblings at each level
    for (const child of Array.from(node.children)) {
      if (child !== el && "scene" in child) return child;
    }
    node = node.parentElement;
  }
  return null;
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function interpolateWaypoints(
  progress: number,
  waypoints: Array<{ progress: number; [key: string]: number }>,
  easing: boolean
): Record<string, number> {
  if (waypoints.length === 0) return {};
  if (waypoints.length === 1) return waypoints[0];

  if (progress <= waypoints[0].progress) return waypoints[0];
  if (progress >= waypoints[waypoints.length - 1].progress) {
    return waypoints[waypoints.length - 1];
  }

  for (let i = 0; i < waypoints.length - 1; i++) {
    const wp1 = waypoints[i];
    const wp2 = waypoints[i + 1];
    if (progress >= wp1.progress && progress <= wp2.progress) {
      const rawT = (progress - wp1.progress) / (wp2.progress - wp1.progress);
      const t = easing ? easeInOutQuad(rawT) : rawT;

      const result: Record<string, number> = {};
      for (const key in wp1) {
        if (key === "progress") continue;
        const v1 = wp1[key] ?? 0;
        const v2 = wp2[key] ?? v1;
        result[key] = v1 + (v2 - v1) * t;
      }
      return result;
    }
  }

  return waypoints[0];
}

type Waypoint = { progress: number; [key: string]: number };

function readWaypoints(host: HTMLElement): Waypoint[] {
  return Array.from(host.querySelectorAll("tosi-waypoint"))
    .map((wp) => {
      const result: Waypoint = {
        progress: Number(wp.getAttribute("progress") || 0),
      };
      for (const attr of Array.from(wp.attributes)) {
        if (attr.name === "progress") continue;
        const val = Number(attr.value);
        if (Number.isFinite(val)) {
          const key = attr.name.replace(/-([a-z])/g, (_, c: string) =>
            c.toUpperCase()
          );
          result[key] = val;
        }
      }
      return result;
    })
    .sort((a, b) => a.progress - b.progress);
}

/**
 * Scroll-driven camera controller for B3d scenes.
 *
 * Place inside a <tosi-b3d> within a <tosi-product-section>.
 * Uses <tosi-waypoint> children to define camera keyframes.
 *
 * Waypoint attributes for ArcRotateCamera: alpha, beta, radius,
 *   target-x, target-y, target-z
 * Waypoint attributes for positional cameras: x, y, z, fov
 *
 * Example:
 *   <tosi-scroll-camera data-scroll-animate easing="ease-in-out">
 *     <tosi-waypoint progress="0" alpha="-1.57" beta="1.2" radius="15"></tosi-waypoint>
 *     <tosi-waypoint progress="1" alpha="4.71" beta="0.8" radius="5"></tosi-waypoint>
 *   </tosi-scroll-camera>
 */
export class TosiScrollCamera extends Component {
  static initAttributes = {
    easing: "",
  };

  static styleSpec = {
    ":host": { display: "none" },
  };

  content = () => slot();

  setScrollProgress(progress: number) {
    const owner = findScene(this);
    if (!owner?.scene?.activeCamera) return;

    const camera = owner.scene.activeCamera;
    const waypoints = readWaypoints(this);
    if (waypoints.length === 0) return;

    const easing = this.getAttribute("easing") === "ease-in-out";
    const v = interpolateWaypoints(progress, waypoints, easing);

    if ("alpha" in v && camera.alpha !== undefined) camera.alpha = v.alpha;
    if ("beta" in v && camera.beta !== undefined) camera.beta = v.beta;
    if ("radius" in v && camera.radius !== undefined) camera.radius = v.radius;

    if (camera.target && typeof camera.target.copyFromFloats === "function") {
      if ("targetX" in v || "targetY" in v || "targetZ" in v) {
        camera.target.copyFromFloats(
          v.targetX ?? camera.target.x,
          v.targetY ?? camera.target.y,
          v.targetZ ?? camera.target.z
        );
      }
    }

    if (camera.position) {
      if ("x" in v) camera.position.x = v.x;
      if ("y" in v) camera.position.y = v.y;
      if ("z" in v) camera.position.z = v.z;
    }

    if ("fov" in v && camera.fov !== undefined) camera.fov = v.fov;
  }
}

/**
 * Scroll-driven day/night cycle for B3d skybox.
 *
 * Maps scroll progress (0→1) to a timeOfDay range on a sibling
 * <tosi-b3d-skybox> element. Set realtimeScale="0" on the skybox
 * to disable auto-advancement.
 *
 * Example:
 *   <tosi-scroll-time data-scroll-animate from="6" to="18"></tosi-scroll-time>
 */
export class TosiScrollTime extends Component {
  static initAttributes = {
    from: 0,
    to: 24,
  };

  static styleSpec = {
    ":host": { display: "none" },
  };

  content = null;

  setScrollProgress(progress: number) {
    const owner = findScene(this);
    if (!owner) return;

    // `|| 24` read `to="0"` — midnight, a perfectly ordinary end hour — as absent.
    const from = num(this.getAttribute("from"), 0);
    const to = num(this.getAttribute("to"), 24);
    const time = from + (to - from) * progress;

    const skybox = owner.querySelector("tosi-b3d-skybox") as any;
    if (skybox) {
      skybox.timeOfDay = time;
    }
  }
}

/**
 * Scroll-driven animation scrubber for B3d scenes.
 *
 * Scrubs a named BabylonJS AnimationGroup to the frame
 * corresponding to scroll progress (0→1).
 *
 * Example:
 *   <tosi-scroll-animation data-scroll-animate name="DoorOpen"></tosi-scroll-animation>
 */
export class TosiScrollAnimation extends Component {
  static initAttributes = {
    name: "",
  };

  static styleSpec = {
    ":host": { display: "none" },
  };

  content = null;

  private _animGroup: any = null;
  private _started = false;

  setScrollProgress(progress: number) {
    const owner = findScene(this);
    if (!owner?.scene) return;

    const name = this.getAttribute("name") || "";
    if (!name) return;

    if (!this._animGroup || this._animGroup.name !== name) {
      this._animGroup = owner.scene.animationGroups?.find(
        (g: any) => g.name === name
      );
      this._started = false;
    }

    if (!this._animGroup) return;

    if (!this._started) {
      this._animGroup.start(false, 0);
      this._started = true;
    }

    const from = this._animGroup.from ?? 0;
    const to = this._animGroup.to ?? 1;
    const frame = from + (to - from) * progress;
    this._animGroup.goToFrame(frame);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._animGroup && this._started) {
      this._animGroup.stop();
    }
    this._animGroup = null;
    this._started = false;
  }
}

export const tosiScrollCamera = TosiScrollCamera.elementCreator({
  tag: "tosi-scroll-camera",
});
export const tosiScrollTime = TosiScrollTime.elementCreator({
  tag: "tosi-scroll-time",
});
export const tosiScrollAnimation = TosiScrollAnimation.elementCreator({
  tag: "tosi-scroll-animation",
});
