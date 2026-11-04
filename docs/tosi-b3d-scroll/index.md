# `<tosi-scroll-camera>` · `<tosi-scroll-time>` · `<tosi-scroll-animation>`

Scroll controllers for a BabylonJS scene. Place them inside a scene element within a
`<tosi-product-section>`; each reads scroll progress and drives one aspect of the scene — camera,
time-of-day, or an animation — declaratively via `<tosi-waypoint>` children.

**Use [`<tosi-b3d>`](https://3d.tosijs.net) (tosijs-3d).** These controllers are *scene-agnostic*:
they find their scene by duck-typing — the nearest ancestor or sibling with a `.scene` property —
and then touch only Babylon-level API (`scene.activeCamera`, `scene.animationGroups`). So they work
in any element that exposes a Babylon scene, and nothing here is bound to a particular host.

tosijs-ui's `<tosi-3d>` still works and the demo below uses it, but it is **the legacy path** —
tosijs-3d is where the 3D story is going, and it is not a bigger `<tosi-3d>` so much as a different
category: terrain, water, skybox, clouds, particles, physics, lights, HUD and XR as composable
elements, against `<tosi-3d>`'s four attributes.

> **`<tosi-scroll-time>` requires tosijs-3d and always has.** It drives a
> `<tosi-b3d-skybox>` — a tosijs-3d element — so inside a tosijs-ui `<tosi-3d>` there is nothing
> for it to find and it silently does nothing. That was true from the day it shipped while this
> page said otherwise; see the CHANGELOG.

<style>.doc-content:has(.doc-demo){--doc-content-padding:0;--doc-content-overflow:visible}.doc-content:has(.doc-demo)>:not(.doc-demo):not(style){max-width:44rem;margin-inline:auto;padding-inline:1.25rem;box-sizing:border-box}.doc-demo .media{height:var(--tosi-view-size,70vh);position:relative;overflow:hidden;background:#0a0a12}.doc-demo .media>tosi-3d{position:absolute;inset:0;width:100%;height:100%}</style>
<tosi-product class="doc-demo">
<tosi-product-section scroll="150">
<div class="media">
<tosi-3d src="https://cdn.tosijs.net/tosijs-product/macbook_neo_web.glb" hero-light fov="0.6" clear-color="transparent" data-scroll-animate>
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

Maps progress to a time-of-day on a `<tosi-b3d-skybox>` — **`from`** / **`to`** hours. Set
`realtimeScale="0"` on the skybox to stop auto-advance.

**tosijs-3d only.** The skybox it drives is a tosijs-3d element, so this one needs a
`<tosi-b3d>` scene — there is no equivalent inside tosijs-ui's `<tosi-3d>`.

```markup
<tosi-b3d>
  <tosi-b3d-skybox realtime-scale="0"></tosi-b3d-skybox>
  <tosi-scroll-time data-scroll-animate from="6" to="18"></tosi-scroll-time>
</tosi-b3d>
```

## `<tosi-scroll-animation>`

Scrubs a named BabylonJS `AnimationGroup` to the frame for the current progress — **`name`**.

```html
<tosi-scroll-animation data-scroll-animate name="DoorOpen"></tosi-scroll-animation>
```

See also [`<tosi-scroll-map>`](/tosi-scroll-map/) and [`<tosi-product>`](/tosi-product/).
