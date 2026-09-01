/*{ "layout": "full-width" }*/
/*#
# `<tosi-product>`

The scroll engine. A `<tosi-product>` owns the scrollable region it lives in: it measures a
**runway** from its `<tosi-product-section>` children, hosts a sticky viewport-sized window, and
translates the stack as you scroll. Each section **pins** (holds still while its animators run),
then **exits** (scrolls out 1:1). Drop it into HTML — no orchestration code.

<style>.doc-content:has(.doc-demo){--doc-content-padding:0;overflow:visible !important}.doc-content:has(.doc-demo)>:not(.doc-demo):not(style){max-width:44rem;margin-inline:auto;padding-inline:1.25rem;box-sizing:border-box}.doc-demo .scene{height:var(--tosi-view-size,70vh);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f0f0f5;text-align:center;padding:2rem}.doc-demo h2{font-size:clamp(1.8rem,6vw,3rem);margin:0;font-weight:800}</style>
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

A sticky overlay header that slides in once `scrollY` passes its **`threshold`** (default `50`), inheriting the active theme through the CSS cascade.

## Nesting (follower mode)

A `<tosi-product>` placed inside a `<tosi-product-section>` becomes a **follower**: it's driven by the parent section's pin progress instead of document scroll, and sizes to fill its parent.

See also [`<tosi-interpolator>`](/tosi-interpolator/) and [`<tosi-filmstrip>`](/tosi-filmstrip/).
*/

import { Component, elements } from "tosijs";
import { interpolateThemeValue, isColor, numAttr } from "./waypoints";

const { div, slot } = elements;

export type ThemeMap = Record<string, string>;
export type ThemeRegistry = Record<string, ThemeMap>;

/**
 * Does this CSS value look like a color? Recognises `#hex`, `rgb()`/`rgba()`, `hsl()`/`hsla()`,
 * `color()`, and a small set of named colors. Used to decide whether two theme values should be
 * blended with `color-mix()` or interpolated numerically.
 */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getScrollParent(el: HTMLElement): EventTarget {
  // Walk up the *flattened* tree, not just light-DOM parents. When our host is
  // slotted into another component's shadow DOM — e.g. the tosijs-ui doc-system,
  // which scrolls an inner pane in its shadow root and projects `.doc-content`
  // into it — the real scroll container is reached via `assignedSlot`, not
  // `parentElement`. Plain `parentElement` dead-ends at the slotted subtree's
  // light-DOM top and we'd fall back to `window` (which never scrolls there),
  // freezing the engine. So at each step prefer the slot we're assigned to, then
  // the light-DOM parent, then hop the shadow→host boundary via getRootNode().
  let node: Element | null = el;
  while (node) {
    const root = node.getRootNode() as ShadowRoot;
    const next: Element | null =
      (node as HTMLElement).assignedSlot ?? node.parentElement ?? root.host ?? null;
    if (!next || next === document.body || next === document.documentElement) break;
    const { overflow, overflowX, overflowY } = getComputedStyle(next);
    if (/(auto|scroll)/.test(overflow + overflowX + overflowY)) return next;
    node = next;
  }
  return window;
}

/** The nearest ancestor `<tosi-product-section>`, or `null` if this element isn't inside one. */
export function findEnclosingSection(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    if (node.tagName.toLowerCase() === "tosi-product-section") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * The nearest ancestor `<tosi-product>` (inclusive of `el` itself), or `null`.
 *
 * This is how an engine decides which animators are *its own*: a nested (follower) engine owns
 * the animators inside it, so the outer engine must skip them rather than drive them twice.
 */
export function nearestEnclosingProduct(el: HTMLElement | null): HTMLElement | null {
  let node = el;
  while (node) {
    if (node.tagName.toLowerCase() === "tosi-product") return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * Map a section's 0→1 pin progress onto an animator's `data-scroll-range="start,end"`
 * sub-range, clamped to 0→1. A degenerate range (end <= start) acts as a step at `end`.
 */
let warnedRanges: Set<string> | null = null;

export function rangeProgress(progress: number, rangeStr: string | null): number {
  /*
  Split into exactly two non-empty parts before reading numbers. `Number("")` is
  0, not NaN, so a trailing comma (`"0.5,"`) would otherwise parse as
  `start=0.5, end=0` — a backwards range that silently pins the animator at 1.
  That is worse than the NaN case, because nothing about it looks wrong.
  */
  const parts = (rangeStr || "0,1").split(",");
  const [start, end] =
    parts.length === 2 && parts.every((p) => p.trim() !== "")
      ? parts.map(Number)
      : [NaN, NaN];
  /*
  A malformed `data-scroll-range` — `"0.5"` with no comma, or anything
  unparseable — used to yield NaN here, and NaN survives both the clamp and every
  arithmetic step downstream. The animator then froze at its first waypoint with
  nothing logged anywhere, which reads as "the library is broken" rather than as
  a typo in the attribute. Fall back to the full range, and say so once.
  */
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    const key = String(rangeStr);
    warnedRanges ??= new Set();
    // Bounded: the keys are raw attribute values, and a long-lived app templating
    // user data into `data-scroll-range` would otherwise grow this without limit.
    // Past the cap we stop deduping rather than stop warning.
    if (warnedRanges.size > 50) warnedRanges.clear();
    if (!warnedRanges.has(key)) {
      warnedRanges.add(key);
      console.warn(
        `tosi-product: ignoring malformed data-scroll-range=${JSON.stringify(rangeStr)} — expected "start,end", e.g. "0,0.5". Using the full range.`
      );
    }
    return progress;
  }
  const range = end - start;
  if (range <= 0) return progress >= end ? 1 : 0;
  return Math.max(0, Math.min(1, (progress - start) / range));
}

export interface ThemeSource {
  fromName: string;
  toName: string;
  t: number;
}

/**
 * Resolve which theme(s) are in force at `activeIdx`, walking back to the nearest
 * preceding theme-bearing item so non-section interludes (markdown blocks, embed
 * hosts) inherit the most recent section's theme instead of snapping to default.
 * A `theme-from`/`theme-to` pair only interpolates while its own item is active;
 * once we've moved past it, it holds at the to-value.
 */
export function resolveThemeSource(
  items: readonly { element: HTMLElement }[],
  activeIdx: number,
  activeProgress: number,
  defaultTheme: string
): ThemeSource {
  let fromName = defaultTheme;
  let toName = defaultTheme;
  let t = 0;

  let themeIdx = activeIdx;
  while (themeIdx >= 0) {
    const el = items[themeIdx].element;
    const themeAttr = el.getAttribute("theme");
    const fromAttr = el.getAttribute("theme-from");
    const toAttr = el.getAttribute("theme-to");
    if (themeAttr || fromAttr || toAttr) {
      if (fromAttr && toAttr) {
        fromName = fromAttr;
        toName = toAttr;
        // Only interpolate while we're still in this item's pin phase.
        // If we've moved past it (themeIdx < activeIdx) or it's exiting,
        // hold at the to-value.
        t = themeIdx === activeIdx ? activeProgress : 1;
      } else {
        const single = (themeAttr || fromAttr || toAttr) as string;
        fromName = single;
        toName = single;
      }
      break;
    }
    themeIdx--;
  }

  return { fromName, toName, t };
}

interface Item {
  element: HTMLElement;
  isSection: boolean;
  naturalSize: number;
  pinDuration: number; // scroll units the section sits motionless
  exitDuration: number; // scroll units the section scrolls out at 1:1 (= naturalSize for vertical)
  offset: number;
  rangeStart: number;
  pinEnd: number;
  rangeEnd: number;
}

export class TosiProduct extends Component {
  static initAttributes = {
    direction: "vertical",
    debug: false,
  };

  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      background: "var(--bg, #000)",
      color: "var(--fg, #fff)",
    },
    ".window": {
      position: "sticky",
      top: "0",
      left: "0",
      width: "100%",
      height: "var(--tosi-view-size, 100vh)",
      overflow: "hidden",
    },
    ":host([direction=horizontal])": {
      display: "inline-block",
      width: "max-content",
    },
    ":host([direction=horizontal]) .window": {
      width: "var(--tosi-view-size, 100vw)",
      height: "100%",
    },
    ".stack": {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      willChange: "transform",
    },
    ":host([direction=horizontal]) .stack": {
      display: "flex",
      flexDirection: "row",
      width: "max-content",
      height: "100%",
    },
    ".debug-panel": {
      position: "fixed",
      top: "10px",
      right: "10px",
      background: "rgba(0,0,0,0.85)",
      color: "#0f0",
      padding: "6px 10px",
      fontFamily: "monospace",
      fontSize: "11px",
      borderRadius: "4px",
      zIndex: 1000,
      pointerEvents: "none",
      whiteSpace: "pre",
    },
  };

  content = () => [
    div(
      { class: "window", part: "window" },
      div({ class: "stack", part: "stack" }, slot())
    ),
    div({ class: "debug-panel", part: "debug", hidden: true }),
  ];

  // Map of theme name → CSS custom property dictionary.
  // Sections reference themes by name via `theme=` or `theme-from=`/`theme-to=`.
  themes: ThemeRegistry = {};
  // Optional theme name to apply when no section is active or section has none.
  defaultTheme: string = "";
  // Where to apply the resolved theme variables. Default: documentElement
  // so external siblings (e.g. a sticky header outside this engine) inherit.
  themeTarget: HTMLElement = document.documentElement;

  private _scrollTarget: EventTarget | null = null;
  private _stack: HTMLElement | null = null;
  private _window: HTMLElement | null = null;
  private _debugPanel: HTMLElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _mutationObserver: MutationObserver | null = null;
  private _items: Item[] = [];
  private _totalRunway = 0;
  private _scrollHandler = () => this._scheduleUpdate();
  private _rafPending = false;
  private _isNested = false;
  private _injectedProgress = 0;
  private _appliedThemeKeys = new Set<string>();

  connectedCallback() {
    super.connectedCallback();
    this._stack = this.shadowRoot?.querySelector(".stack") as HTMLElement;
    this._window = this.shadowRoot?.querySelector(".window") as HTMLElement;
    this._debugPanel = this.shadowRoot?.querySelector(
      ".debug-panel"
    ) as HTMLElement;

    // Detect nesting: if we live inside an enclosing tosi-product-section,
    // we run in "follower" mode — the parent section forwards its pin progress
    // to us via setScrollProgress, and we don't touch document scroll ourselves.
    this._isNested = !!findEnclosingSection(this);

    if (this._isNested) {
      // Tag self so the enclosing section's setScrollProgress dispatch finds us.
      this.setAttribute("data-scroll-animate", "tosi-product");
      // Override sticky-window styling: in follower mode the parent section is
      // already pinned, so the inner window just needs to clip and fill us.
      if (this._window) {
        this._window.style.position = "relative";
        this._window.style.width = "100%";
        this._window.style.height = "100%";
      }
      this.style.width = "100%";
      this.style.height = "100%";
      this.style.display = "block";
      // Avoid fighting the outer engine for :root vars: scope theme to self.
      if (this.themeTarget === document.documentElement) {
        this.themeTarget = this;
      }
    } else {
      this._scrollTarget = getScrollParent(this);
      this._scrollTarget.addEventListener("scroll", this._scrollHandler, {
        passive: true,
      });
      window.addEventListener("resize", this._scrollHandler, { passive: true });
    }

    this._mutationObserver = new MutationObserver(() => this._relayout());
    this._mutationObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ["scroll", "debug"],
    });

    this._resizeObserver = new ResizeObserver(() => this._relayout());
    for (const child of Array.from(this.children)) {
      if (child instanceof HTMLElement) this._resizeObserver.observe(child);
    }
    // Watch our own host too — nested layouts depend on our parent-supplied size.
    this._resizeObserver.observe(this);

    requestAnimationFrame(() => {
      this._relayout();
      this._update();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (!this._isNested) {
      this._scrollTarget?.removeEventListener("scroll", this._scrollHandler);
      window.removeEventListener("resize", this._scrollHandler);
    }
    this._mutationObserver?.disconnect();
    this._resizeObserver?.disconnect();
  }

  // Called by an enclosing tosi-product-section when we're nested.
  // The parent's pin progress drives our internal scroll position.
  setScrollProgress(progress: number) {
    if (!this._isNested) return;
    this._injectedProgress = Math.max(0, Math.min(1, progress));
    this._update();
  }

  private _isHorizontal(): boolean {
    return this.getAttribute("direction") === "horizontal";
  }

  private _viewSize(): number {
    const horizontal = this._isHorizontal();
    if (this._isNested) {
      // Our visible area is whatever our parent gave us.
      return horizontal ? this.clientWidth : this.clientHeight;
    }
    if (this._scrollTarget instanceof HTMLElement) {
      return horizontal
        ? this._scrollTarget.clientWidth
        : this._scrollTarget.clientHeight;
    }
    return horizontal ? window.innerWidth : window.innerHeight;
  }

  private _scrollPos(): number {
    const horizontal = this._isHorizontal();
    if (this._scrollTarget instanceof HTMLElement) {
      return horizontal
        ? this._scrollTarget.scrollLeft
        : this._scrollTarget.scrollTop;
    }
    return horizontal ? window.scrollX : window.scrollY;
  }

  private _hostStart(): number {
    const horizontal = this._isHorizontal();
    const rect = this.getBoundingClientRect();
    let edge = horizontal ? rect.left : rect.top;
    if (this._scrollTarget instanceof HTMLElement) {
      const containerRect = this._scrollTarget.getBoundingClientRect();
      edge -= horizontal ? containerRect.left : containerRect.top;
    }
    return this._scrollPos() + edge;
  }

  private _relayout() {
    if (!this._stack) return;
    const horizontal = this._isHorizontal();
    const view = this._viewSize();

    // Publish the scroll-axis view size so slotted content can size to the
    // actually-available area (handles embedded / nested scroll parents that
    // are smaller than the document viewport — pure CSS vh/vw would overflow).
    this.style.setProperty("--tosi-view-size", `${view}px`);

    const items: Item[] = [];
    let cumOffset = 0;
    let cumRunway = 0;
    for (const child of Array.from(this.children)) {
      if (!(child instanceof HTMLElement)) continue;
      const isSection = child.tagName.toLowerCase() === "tosi-product-section";
      const naturalSize = horizontal ? child.offsetWidth : child.offsetHeight;
      let pinDuration = 0;
      if (isSection) {
        const scrollAttr = child.getAttribute("scroll");
        if (scrollAttr !== null) {
          const pct = Number(scrollAttr);
          if (Number.isFinite(pct) && pct >= 0) {
            pinDuration = (pct / 100) * view;
          }
        } else {
          // Default: 1 viewport of pinning so sections feel like sections
          pinDuration = view;
        }
      }
      const exitDuration = naturalSize;
      const rangeStart = cumRunway;
      const pinEnd = rangeStart + pinDuration;
      const rangeEnd = pinEnd + exitDuration;
      items.push({
        element: child,
        isSection,
        naturalSize,
        pinDuration,
        exitDuration,
        offset: cumOffset,
        rangeStart,
        pinEnd,
        rangeEnd,
      });
      cumOffset += naturalSize;
      cumRunway += pinDuration + exitDuration;
    }

    // The last item's exit phase is always pinned by the end clamp (its bottom
    // edge can't scroll above the viewport bottom), so it only adds a viewport
    // of frozen, dead scroll before whatever follows the engine. Drop it.
    const tail = items[items.length - 1];
    if (tail) {
      cumRunway -= tail.exitDuration;
      tail.exitDuration = 0;
      tail.rangeEnd = tail.pinEnd;
    }

    this._items = items;
    this._totalRunway = cumRunway;

    if (!this._isNested) {
      // Standalone: host height = runway + viewport so the sticky window can
      // pin for the entire runway. The end-state translate clamp ensures the
      // last viewport shows the tail of the stack rather than blank space.
      const hostDim = horizontal ? "width" : "height";
      this.style[hostDim as any] = `${cumRunway + view}px`;
    }
    // Nested: host size is dictated by the parent — don't override.

    this._update();
  }

  private _scheduleUpdate() {
    if (this._rafPending) return;
    this._rafPending = true;
    requestAnimationFrame(() => {
      this._rafPending = false;
      this._update();
    });
  }

  private _update() {
    if (!this._stack || this._items.length === 0) return;
    const horizontal = this._isHorizontal();
    const view = this._viewSize();
    const local = this._isNested
      ? this._injectedProgress * this._totalRunway
      : this._scrollPos() - this._hostStart();

    const last = this._items[this._items.length - 1];
    const stackSize = last.offset + last.naturalSize;
    const minTranslate = -Math.max(0, stackSize - view);

    let translate = 0;
    let activeIdx = -1;
    let activeProgress = 0;

    if (local <= 0) {
      translate = 0;
      activeIdx = 0;
      activeProgress = 0;
    } else if (local >= this._totalRunway) {
      translate = minTranslate;
      activeIdx = this._items.length - 1;
      activeProgress = 1;
    } else {
      for (let i = 0; i < this._items.length; i++) {
        const item = this._items[i];
        if (local < item.rangeStart || local >= item.rangeEnd) continue;
        if (local < item.pinEnd) {
          // PIN: stack frozen so section sits at viewport top.
          translate = -item.offset;
          activeProgress =
            item.pinDuration > 0
              ? (local - item.rangeStart) / item.pinDuration
              : 1;
        } else {
          // EXIT: stack translates 1:1 with scroll, section scrolls out the top.
          const exitProgress = (local - item.pinEnd) / item.exitDuration;
          translate = -item.offset - exitProgress * item.naturalSize;
          activeProgress = 1;
        }
        activeIdx = i;
        break;
      }
    }

    // Clamp so the stack never scrolls past its bottom: the last item's
    // bottom edge stays at or below the viewport bottom.
    if (translate < minTranslate) translate = minTranslate;

    const axis = horizontal ? "X" : "Y";
    this._stack.style.transform = `translate${axis}(${translate}px)`;

    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      if (!item.isSection) continue;
      let progress: number;
      if (i < activeIdx) progress = 1;
      else if (i > activeIdx) progress = 0;
      else progress = activeProgress;
      this._notify(item.element, progress);
    }

    this._applyTheme(activeIdx, activeProgress);

    if (this._debugPanel) {
      // `this.debug` is the initAttributes-backed property, so this follows the
      // standard boolean-attribute rule (presence is true) that the docs, and
      // every other tosijs component, already promise. The old
      // `getAttribute("debug") === "true"` meant the documented `<tosi-product
      // debug>` set the property and did nothing to the overlay.
      const showDebug = this.debug;
      this._debugPanel.hidden = !showDebug;
      if (showDebug) {
        this._debugPanel.textContent =
          `local: ${local.toFixed(0)}px / ${this._totalRunway.toFixed(0)}\n` +
          `translate${axis}: ${translate.toFixed(0)}px\n` +
          `active: #${activeIdx} @ ${activeProgress.toFixed(3)}`;
      }
    }
  }

  private _notify(section: HTMLElement, progress: number) {
    section.dataset.progress = progress.toFixed(3);
    if (typeof (section as any).setScrollProgress === "function") {
      (section as any).setScrollProgress(progress);
    }
  }

  private _applyTheme(activeIdx: number, activeProgress: number) {
    const themeNames = Object.keys(this.themes);
    if (themeNames.length === 0) return;

    const { fromName, toName, t } = resolveThemeSource(
      this._items,
      activeIdx,
      activeProgress,
      this.defaultTheme
    );

    const fromTheme = this.themes[fromName];
    const toTheme = this.themes[toName];
    if (!fromTheme && !toTheme) return;
    const target = this.themeTarget;

    // Iterate union of keys so a target-only key isn't dropped.
    const allKeys = new Set([
      ...Object.keys(fromTheme || {}),
      ...Object.keys(toTheme || {}),
    ]);
    const seen = new Set<string>();
    for (const key of allKeys) {
      const fromVal = fromTheme?.[key] ?? toTheme?.[key];
      const toVal = toTheme?.[key] ?? fromTheme?.[key];
      if (fromVal === undefined || toVal === undefined) continue;
      const value = interpolateThemeValue(fromVal, toVal, t);
      target.style.setProperty(key, value);
      seen.add(key);
    }
    // Clean up keys we previously set but no longer need (theme schema shrank).
    for (const key of this._appliedThemeKeys) {
      if (!seen.has(key)) target.style.removeProperty(key);
    }
    this._appliedThemeKeys = seen;
  }
}

export class TosiProductSection extends Component {
  static initAttributes = {
    scroll: 100,
  };

  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
    },
  };

  content = () => slot();

  scrollCallback: ((progress: number, el: HTMLElement) => void) | null = null;

  setScrollProgress(progress: number) {
    if (reducedMotion.matches) {
      if (this.scrollCallback) this.scrollCallback(progress, this);
      return;
    }
    // We belong to the nearest enclosing tosi-product. Animators that
    // belong to a *different* (deeper) tosi-product are owned by that
    // nested engine and should not be driven from here.
    const myProduct = this.closest("tosi-product");
    const animators = this.querySelectorAll(
      "[data-scroll-animate], [data-scroll-range]"
    );
    for (const el of Array.from(animators)) {
      const ownerProduct = nearestEnclosingProduct(
        el === this ? null : (el.parentElement as HTMLElement | null)
      );
      if (ownerProduct !== myProduct) continue;
      const localProgress = rangeProgress(
        progress,
        el.getAttribute("data-scroll-range")
      );
      (el as HTMLElement).style.setProperty(
        "--local-progress",
        localProgress.toString()
      );
      (el as HTMLElement).dataset.localProgress = localProgress.toFixed(3);
      if (typeof (el as any).setScrollProgress === "function") {
        (el as any).setScrollProgress(localProgress);
      } else if (
        el.getAttribute("data-scroll-animate") === "currentTime" &&
        (el as any).duration
      ) {
        (el as HTMLVideoElement).currentTime =
          localProgress * (el as HTMLVideoElement).duration;
      } else if (
        el.getAttribute("data-scroll-animate") === "lottie" &&
        (el as any).animation &&
        typeof (el as any).animation.goToAndStop === "function"
      ) {
        const total = (el as any).animation.totalFrames || 0;
        (el as any).animation.goToAndStop(localProgress * total, true);
      }
    }
    if (this.scrollCallback) this.scrollCallback(progress, this);
  }
}

// Sticky header that slides into view once scroll passes a threshold.
// Inherits CSS variables (theme) from documentElement, so a tosi-product
// driving :root will style this header in unison with its sections.
export class TosiProductHeader extends Component {
  static initAttributes = {
    threshold: 50, // px scrolled before header becomes visible
  };

  static styleSpec = {
    ":host": {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      zIndex: "100",
      transform: "translateY(-100%)",
      transition: "transform 0.3s ease",
      pointerEvents: "auto",
    },
    ":host([data-visible=true])": {
      transform: "translateY(0)",
    },
  };

  content = () => slot();

  private _scrollHandler = () => this._update();

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this._scrollHandler, { passive: true });
    this._update();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("scroll", this._scrollHandler);
  }

  private _update() {
    const threshold = numAttr(this.getAttribute("threshold"), 50);
    this.dataset.visible = window.scrollY > threshold ? "true" : "false";
  }
}

export const tosiProduct = TosiProduct.elementCreator({
  tag: "tosi-product",
});
export const tosiProductSection = TosiProductSection.elementCreator({
  tag: "tosi-product-section",
});
export const tosiProductHeader = TosiProductHeader.elementCreator({
  tag: "tosi-product-header",
});
