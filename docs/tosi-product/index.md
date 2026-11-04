# `<tosi-product>`

The scroll engine. A `<tosi-product>` owns the scrollable region it lives in: it measures a
**runway** from its `<tosi-product-section>` children, hosts a sticky viewport-sized window, and
translates the stack as you scroll. Each section **pins** (holds still while its animators run),
then **exits** (scrolls out 1:1). Drop it into HTML — no orchestration code.

<style>.doc-content:has(.doc-demo){--doc-content-padding:0;--doc-content-overflow:visible}.doc-content:has(.doc-demo)>:not(.doc-demo):not(style){max-width:44rem;margin-inline:auto;padding-inline:1.25rem;box-sizing:border-box}.doc-demo .scene{height:var(--tosi-view-size,70vh);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f0f0f5;text-align:center;padding:2rem}.doc-demo h2{font-size:clamp(1.8rem,6vw,3rem);margin:0;font-weight:800}</style>
<tosi-product class="doc-demo">
<tosi-product-section scroll="70">
<div class="scene" style="background:#08081a">
<tosi-interpolator data-scroll-animate easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(30px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:1; transform:translateY(0)"></tosi-waypoint>
<h2>Pin.</h2>
</tosi-interpolator>
</div>
</tosi-product-section>
<tosi-product-section scroll="70">
<div class="scene" style="background:#101a3a">
<h2>Then exit.</h2>
</div>
</tosi-product-section>
</tosi-product>

Scroll the panel: the first section pins while its heading fades in, then scrolls away as the
second pins. It's the HTML shown here — read it in **Source**.

## `<tosi-product>` attributes

- **`direction`** — `"vertical"` (default) or `"horizontal"`.
- **`debug`** — overlay showing local position / translate / active section + progress.

## `<tosi-product-section>` attributes

- **`scroll`** — pin duration as a percent of the viewport. `100` (default) = 1× viewport of pinning; the exit phase (1:1 over the section's height) is added on top.
- **`theme`** / **`theme-from`** / **`theme-to`** — apply or interpolate a registered theme over the pin.

## `<tosi-product-header>`

A sticky overlay header that slides in once its scroll container (the window, or the nearest scrolling ancestor) passes its **`threshold`** in px (default `50`), inheriting the active theme through the CSS cascade.

## Nesting (follower mode)

A `<tosi-product>` placed inside a `<tosi-product-section>` becomes a **follower**: it's driven by the parent section's pin progress instead of document scroll, and sizes to fill its parent.

See also [`<tosi-interpolator>`](/tosi-interpolator/) and [`<tosi-filmstrip>`](/tosi-filmstrip/).
