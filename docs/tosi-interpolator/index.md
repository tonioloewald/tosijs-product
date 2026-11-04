# `<tosi-interpolator>`

Declarative CSS-property interpolation between scroll **waypoints**. Wrap any element, add
`<tosi-waypoint progress="…" style="…">` children, and each style property is blended
(numbers per-number, colours via `color-mix`) as the enclosing `<tosi-product-section>`'s pin
progress runs 0 → 1.

A property animates when every waypoint writes it in the **same shape**: the same transform
functions in the same order, with the same units (a bare `0` adopts the other side's unit).
`translateY(0px)` → `scale(1.2)` has no in-between, so it steps at the midpoint; write
`translateY(0px) scale(1)` → `translateY(0px) scale(1.2)` instead.

The panel below is a live `<tosi-interpolator>` — scroll it, then read its markup in **Source**
view (top-right). No JavaScript; it is the HTML shown here.

<style>.doc-content:has(.ti-demo){--doc-content-padding:0;--doc-content-overflow:visible}.doc-content:has(.ti-demo)>:not(.ti-demo):not(style){max-width:44rem;margin-inline:auto;padding-inline:1.25rem;box-sizing:border-box}.ti-demo .scene{height:var(--tosi-view-size,70vh);display:flex;align-items:center;justify-content:center;background:#08081a;border-radius:12px}.ti-demo h2{font-size:clamp(2rem,7vw,3.5rem);margin:0;font-weight:800}</style>
<tosi-product class="ti-demo">
<tosi-product-section scroll="120">
<div class="scene">
<tosi-interpolator data-scroll-animate easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(40px) scale(.8); color:#9be7ff"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:1; transform:translateY(0) scale(1.15); color:#f0f0f5"></tosi-waypoint>
<h2>Scroll me</h2>
</tosi-interpolator>
</div>
</tosi-product-section>
</tosi-product>

## Attributes

`<tosi-interpolator>`
- **`easing`** — `"ease-in-out"` applies easeInOutQuad between waypoints (default: linear).
- **`data-scroll-range="start,end"`** — scope this interpolator to a sub-range of its section's progress, so several can stage in sequence.

`<tosi-waypoint>`
- **`progress`** — 0 → 1 keyframe position.
- **`style`** — the CSS to interpolate toward at that progress.

## Editable example

```html
<tosi-product>
  <tosi-product-section scroll="150">
    <tosi-interpolator data-scroll-animate easing="ease-in-out">
      <tosi-waypoint progress="0" style="opacity:0; transform: translateX(-80px)"></tosi-waypoint>
      <tosi-waypoint progress="1" style="opacity:1; transform: translateX(0)"></tosi-waypoint>
      <h1>Edit me</h1>
    </tosi-interpolator>
  </tosi-product-section>
</tosi-product>
```

See also [`<tosi-product>`](/tosi-product/) and [`<tosi-filmstrip>`](/tosi-filmstrip/).
