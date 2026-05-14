// src/tosi-product.ts
import { Component, elements } from "tosijs";
var { div, slot } = elements;
function isColor(s) {
  const t = s.trim();
  return t.startsWith("#") || t.startsWith("rgb") || t.startsWith("hsl") || t.startsWith("color(") || [
    "red",
    "blue",
    "green",
    "white",
    "black",
    "transparent",
    "currentColor"
  ].includes(t);
}
function interpolateThemeValue(from, to, t) {
  if (from === to || t <= 0)
    return from;
  if (t >= 1)
    return to;
  if (isColor(from) && isColor(to)) {
    return `color-mix(in srgb, ${from} ${(1 - t) * 100}%, ${to})`;
  }
  const numRegex = /-?\d+(?:\.\d+)?/g;
  const aNums = Array.from(from.matchAll(numRegex));
  const bNums = Array.from(to.matchAll(numRegex));
  if (aNums.length > 0 && aNums.length === bNums.length) {
    let result = "";
    let lastIndex = 0;
    for (let i = 0;i < aNums.length; i++) {
      const am = aNums[i];
      const bm = bNums[i];
      result += from.substring(lastIndex, am.index);
      const v = parseFloat(am[0]) + (parseFloat(bm[0]) - parseFloat(am[0])) * t;
      result += v.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
      lastIndex = am.index + am[0].length;
    }
    result += from.substring(lastIndex);
    return result;
  }
  return t < 0.5 ? from : to;
}
var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function getScrollParent(el) {
  let node = el.parentElement;
  while (node) {
    if (node === document.body || node === document.documentElement)
      break;
    const { overflow, overflowX, overflowY } = getComputedStyle(node);
    if (/(auto|scroll)/.test(overflow + overflowX + overflowY))
      return node;
    node = node.parentElement;
  }
  return window;
}
function findEnclosingSection(el) {
  let node = el.parentElement;
  while (node) {
    if (node.tagName.toLowerCase() === "tosi-product-section") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}
function nearestEnclosingProduct(el) {
  let node = el;
  while (node) {
    if (node.tagName.toLowerCase() === "tosi-product")
      return node;
    node = node.parentElement;
  }
  return null;
}

class TosiProduct extends Component {
  static initAttributes = {
    direction: "vertical",
    debug: false
  };
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      background: "var(--bg, #000)",
      color: "var(--fg, #fff)"
    },
    ".window": {
      position: "sticky",
      top: "0",
      left: "0",
      width: "100%",
      height: "var(--tosi-view-size, 100vh)",
      overflow: "hidden"
    },
    ":host([direction=horizontal])": {
      display: "inline-block",
      width: "max-content"
    },
    ":host([direction=horizontal]) .window": {
      width: "var(--tosi-view-size, 100vw)",
      height: "100%"
    },
    ".stack": {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      willChange: "transform"
    },
    ":host([direction=horizontal]) .stack": {
      display: "flex",
      flexDirection: "row",
      width: "max-content",
      height: "100%"
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
      whiteSpace: "pre"
    }
  };
  content = () => [
    div({ class: "window", part: "window" }, div({ class: "stack", part: "stack" }, slot())),
    div({ class: "debug-panel", part: "debug", hidden: true })
  ];
  themes = {};
  defaultTheme = "";
  themeTarget = document.documentElement;
  _scrollTarget = null;
  _stack = null;
  _window = null;
  _debugPanel = null;
  _resizeObserver = null;
  _mutationObserver = null;
  _items = [];
  _totalRunway = 0;
  _scrollHandler = () => this._scheduleUpdate();
  _rafPending = false;
  _isNested = false;
  _injectedProgress = 0;
  _appliedThemeKeys = new Set;
  connectedCallback() {
    super.connectedCallback();
    this._stack = this.shadowRoot?.querySelector(".stack");
    this._window = this.shadowRoot?.querySelector(".window");
    this._debugPanel = this.shadowRoot?.querySelector(".debug-panel");
    this._isNested = !!findEnclosingSection(this);
    if (this._isNested) {
      this.setAttribute("data-scroll-animate", "tosi-product");
      if (this._window) {
        this._window.style.position = "relative";
        this._window.style.width = "100%";
        this._window.style.height = "100%";
      }
      this.style.width = "100%";
      this.style.height = "100%";
      this.style.display = "block";
      if (this.themeTarget === document.documentElement) {
        this.themeTarget = this;
      }
    } else {
      this._scrollTarget = getScrollParent(this);
      this._scrollTarget.addEventListener("scroll", this._scrollHandler, {
        passive: true
      });
      window.addEventListener("resize", this._scrollHandler, { passive: true });
    }
    this._mutationObserver = new MutationObserver(() => this._relayout());
    this._mutationObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ["scroll"]
    });
    this._resizeObserver = new ResizeObserver(() => this._relayout());
    for (const child of Array.from(this.children)) {
      if (child instanceof HTMLElement)
        this._resizeObserver.observe(child);
    }
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
  setScrollProgress(progress) {
    if (!this._isNested)
      return;
    this._injectedProgress = Math.max(0, Math.min(1, progress));
    this._update();
  }
  _isHorizontal() {
    return this.getAttribute("direction") === "horizontal";
  }
  _viewSize() {
    const horizontal = this._isHorizontal();
    if (this._isNested) {
      return horizontal ? this.clientWidth : this.clientHeight;
    }
    if (this._scrollTarget instanceof HTMLElement) {
      return horizontal ? this._scrollTarget.clientWidth : this._scrollTarget.clientHeight;
    }
    return horizontal ? window.innerWidth : window.innerHeight;
  }
  _scrollPos() {
    const horizontal = this._isHorizontal();
    if (this._scrollTarget instanceof HTMLElement) {
      return horizontal ? this._scrollTarget.scrollLeft : this._scrollTarget.scrollTop;
    }
    return horizontal ? window.scrollX : window.scrollY;
  }
  _hostStart() {
    const horizontal = this._isHorizontal();
    const rect = this.getBoundingClientRect();
    let edge = horizontal ? rect.left : rect.top;
    if (this._scrollTarget instanceof HTMLElement) {
      const containerRect = this._scrollTarget.getBoundingClientRect();
      edge -= horizontal ? containerRect.left : containerRect.top;
    }
    return this._scrollPos() + edge;
  }
  _relayout() {
    if (!this._stack)
      return;
    const horizontal = this._isHorizontal();
    const view = this._viewSize();
    this.style.setProperty("--tosi-view-size", `${view}px`);
    const items = [];
    let cumOffset = 0;
    let cumRunway = 0;
    for (const child of Array.from(this.children)) {
      if (!(child instanceof HTMLElement))
        continue;
      const isSection = child.tagName.toLowerCase() === "tosi-product-section";
      const naturalSize = horizontal ? child.offsetWidth : child.offsetHeight;
      let pinDuration = 0;
      if (isSection) {
        const scrollAttr = child.getAttribute("scroll");
        if (scrollAttr !== null) {
          const pct = Number(scrollAttr);
          if (Number.isFinite(pct) && pct >= 0) {
            pinDuration = pct / 100 * view;
          }
        } else {
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
        rangeEnd
      });
      cumOffset += naturalSize;
      cumRunway += pinDuration + exitDuration;
    }
    this._items = items;
    this._totalRunway = cumRunway;
    if (!this._isNested) {
      const hostDim = horizontal ? "width" : "height";
      this.style[hostDim] = `${cumRunway + view}px`;
    }
    this._update();
  }
  _scheduleUpdate() {
    if (this._rafPending)
      return;
    this._rafPending = true;
    requestAnimationFrame(() => {
      this._rafPending = false;
      this._update();
    });
  }
  _update() {
    if (!this._stack || this._items.length === 0)
      return;
    const horizontal = this._isHorizontal();
    const view = this._viewSize();
    const local = this._isNested ? this._injectedProgress * this._totalRunway : this._scrollPos() - this._hostStart();
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
      for (let i = 0;i < this._items.length; i++) {
        const item = this._items[i];
        if (local < item.rangeStart || local >= item.rangeEnd)
          continue;
        if (local < item.pinEnd) {
          translate = -item.offset;
          activeProgress = item.pinDuration > 0 ? (local - item.rangeStart) / item.pinDuration : 1;
        } else {
          const exitProgress = (local - item.pinEnd) / item.exitDuration;
          translate = -item.offset - exitProgress * item.naturalSize;
          activeProgress = 1;
        }
        activeIdx = i;
        break;
      }
    }
    if (translate < minTranslate)
      translate = minTranslate;
    const axis = horizontal ? "X" : "Y";
    this._stack.style.transform = `translate${axis}(${translate}px)`;
    for (let i = 0;i < this._items.length; i++) {
      const item = this._items[i];
      if (!item.isSection)
        continue;
      let progress;
      if (i < activeIdx)
        progress = 1;
      else if (i > activeIdx)
        progress = 0;
      else
        progress = activeProgress;
      this._notify(item.element, progress);
    }
    this._applyTheme(activeIdx, activeProgress);
    if (this._debugPanel) {
      const showDebug = this.getAttribute("debug") === "true";
      this._debugPanel.hidden = !showDebug;
      if (showDebug) {
        this._debugPanel.textContent = `local: ${local.toFixed(0)}px / ${this._totalRunway.toFixed(0)}
` + `translate${axis}: ${translate.toFixed(0)}px
` + `active: #${activeIdx} @ ${activeProgress.toFixed(3)}`;
      }
    }
  }
  _notify(section, progress) {
    section.dataset.progress = progress.toFixed(3);
    if (typeof section.setScrollProgress === "function") {
      section.setScrollProgress(progress);
    }
  }
  _applyTheme(activeIdx, activeProgress) {
    const themeNames = Object.keys(this.themes);
    if (themeNames.length === 0)
      return;
    let fromName = this.defaultTheme;
    let toName = this.defaultTheme;
    let t = 0;
    let themeIdx = activeIdx;
    while (themeIdx >= 0) {
      const it = this._items[themeIdx];
      const el = it.element;
      const themeAttr = el.getAttribute("theme");
      const fromAttr = el.getAttribute("theme-from");
      const toAttr = el.getAttribute("theme-to");
      if (themeAttr || fromAttr || toAttr) {
        if (fromAttr && toAttr) {
          fromName = fromAttr;
          toName = toAttr;
          t = themeIdx === activeIdx ? activeProgress : 1;
        } else {
          const single = themeAttr || fromAttr || toAttr;
          fromName = single;
          toName = single;
        }
        break;
      }
      themeIdx--;
    }
    const fromTheme = this.themes[fromName];
    const toTheme = this.themes[toName];
    if (!fromTheme && !toTheme)
      return;
    const target = this.themeTarget;
    const allKeys = new Set([
      ...Object.keys(fromTheme || {}),
      ...Object.keys(toTheme || {})
    ]);
    const seen = new Set;
    for (const key of allKeys) {
      const fromVal = fromTheme?.[key] ?? toTheme?.[key];
      const toVal = toTheme?.[key] ?? fromTheme?.[key];
      if (fromVal === undefined || toVal === undefined)
        continue;
      const value = interpolateThemeValue(fromVal, toVal, t);
      target.style.setProperty(key, value);
      seen.add(key);
    }
    for (const key of this._appliedThemeKeys) {
      if (!seen.has(key))
        target.style.removeProperty(key);
    }
    this._appliedThemeKeys = seen;
  }
}

class TosiProductSection extends Component {
  static initAttributes = {
    scroll: 100
  };
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%"
    }
  };
  content = () => slot();
  scrollCallback = null;
  setScrollProgress(progress) {
    if (reducedMotion.matches) {
      if (this.scrollCallback)
        this.scrollCallback(progress, this);
      return;
    }
    const myProduct = this.closest("tosi-product");
    const animators = this.querySelectorAll("[data-scroll-animate], [data-scroll-range]");
    for (const el of Array.from(animators)) {
      const ownerProduct = nearestEnclosingProduct(el === this ? null : el.parentElement);
      if (ownerProduct !== myProduct)
        continue;
      const rangeStr = el.getAttribute("data-scroll-range") || "0,1";
      const [start, end] = rangeStr.split(",").map(Number);
      const range = end - start;
      const localProgress = range <= 0 ? progress >= end ? 1 : 0 : Math.max(0, Math.min(1, (progress - start) / range));
      el.style.setProperty("--local-progress", localProgress.toString());
      el.dataset.localProgress = localProgress.toFixed(3);
      if (typeof el.setScrollProgress === "function") {
        el.setScrollProgress(localProgress);
      } else if (el.getAttribute("data-scroll-animate") === "currentTime" && el.duration) {
        el.currentTime = localProgress * el.duration;
      } else if (el.getAttribute("data-scroll-animate") === "lottie" && el.animation && typeof el.animation.goToAndStop === "function") {
        const total = el.animation.totalFrames || 0;
        el.animation.goToAndStop(localProgress * total, true);
      }
    }
    if (this.scrollCallback)
      this.scrollCallback(progress, this);
  }
}

class TosiProductHeader extends Component {
  static initAttributes = {
    threshold: 50
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
      pointerEvents: "auto"
    },
    ":host([data-visible=true])": {
      transform: "translateY(0)"
    }
  };
  content = () => slot();
  _scrollHandler = () => this._update();
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this._scrollHandler, { passive: true });
    this._update();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("scroll", this._scrollHandler);
  }
  _update() {
    const threshold = Number(this.getAttribute("threshold")) || 50;
    this.dataset.visible = window.scrollY > threshold ? "true" : "false";
  }
}
var tosiProduct = TosiProduct.elementCreator({
  tag: "tosi-product"
});
var tosiProductSection = TosiProductSection.elementCreator({
  tag: "tosi-product-section"
});
var tosiProductHeader = TosiProductHeader.elementCreator({
  tag: "tosi-product-header"
});
// src/tosi-filmstrip.ts
import { Component as Component2, elements as elements2 } from "tosijs";
var { canvas } = elements2;

class TosiFilmstrip extends Component2 {
  static initAttributes = {
    src: "",
    cols: 0,
    rows: 0,
    total: 0
  };
  _img = null;
  _ctx = null;
  _lastProgress = 0;
  _canvas = null;
  _loadedSrc = "";
  _loadId = 0;
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      height: "100%"
    },
    canvas: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block"
    }
  };
  content = () => {
    this._canvas = canvas({ part: "canvas" });
    return this._canvas;
  };
  _parseGrid() {
    const src = this.getAttribute("src") || "";
    let cols = Number(this.getAttribute("cols")) || 0;
    let rows = Number(this.getAttribute("rows")) || 0;
    let total = Number(this.getAttribute("total")) || 0;
    if (!cols || !rows || !total) {
      const match = src.match(/(\d+)x(\d+)_(\d+)\.(webp|jpg|png|data)/i);
      if (match) {
        if (!cols)
          cols = parseInt(match[1]);
        if (!rows)
          rows = parseInt(match[2]);
        if (!total)
          total = parseInt(match[3]);
      }
    }
    if (!total || !cols || !rows)
      return null;
    return { cols, rows, total };
  }
  load() {
    const src = this.getAttribute("src") || "";
    if (!src)
      return;
    const grid = this._parseGrid();
    if (!grid)
      return;
    const loadId = ++this._loadId;
    this._loadedSrc = src;
    const img = new Image;
    img.onload = () => {
      if (loadId !== this._loadId)
        return;
      this._img = img;
      this.setScrollProgress(this._lastProgress);
    };
    img.onerror = () => {
      if (loadId !== this._loadId)
        return;
      console.warn(`[tosi-filmstrip] Failed to load: ${src}`);
      this._img = null;
    };
    img.src = src;
  }
  setScrollProgress(progress) {
    this._lastProgress = progress;
    if (!this._img)
      return;
    const grid = this._parseGrid();
    if (!grid)
      return;
    const { cols, rows, total } = grid;
    const cvs = this._canvas || this.parts && this.parts.canvas;
    if (!cvs)
      return;
    if (!this._ctx)
      this._ctx = cvs.getContext("2d");
    if (!this._ctx)
      return;
    const frameIndex = Math.max(0, Math.min(total - 1, Math.floor(progress * total)));
    const col = frameIndex % cols;
    const row = Math.floor(frameIndex / cols);
    const fw = this._img.width / cols;
    const fh = this._img.height / rows;
    if (cvs.width !== fw || cvs.height !== fh) {
      cvs.width = fw;
      cvs.height = fh;
    }
    this._ctx.clearRect(0, 0, fw, fh);
    this._ctx.drawImage(this._img, col * fw, row * fh, fw, fh, 0, 0, fw, fh);
  }
  connectedCallback() {
    super.connectedCallback();
    this.load();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._loadId++;
    this._img = null;
  }
  render() {
    super.render();
    const currentSrc = this.getAttribute("src") || "";
    if (!this._img || this._loadedSrc !== currentSrc) {
      this.load();
    } else {
      this.setScrollProgress(this._lastProgress);
    }
  }
}
var tosiFilmstrip = TosiFilmstrip.elementCreator({
  tag: "tosi-filmstrip"
});
// src/waypoints.ts
var interpolateWaypoints = (progress, waypoints) => {
  if (!waypoints || waypoints.length === 0)
    return null;
  waypoints = [...waypoints].sort((a, b) => a.progress - b.progress);
  if (progress <= waypoints[0].progress)
    return waypoints[0];
  if (progress >= waypoints[waypoints.length - 1].progress) {
    return waypoints[waypoints.length - 1];
  }
  for (let i = 0;i < waypoints.length - 1; i++) {
    const wp1 = waypoints[i];
    const wp2 = waypoints[i + 1];
    if (progress >= wp1.progress && progress <= wp2.progress) {
      const t = (progress - wp1.progress) / (wp2.progress - wp1.progress);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const result = { progress };
      for (const k in wp1) {
        if (k !== "progress") {
          result[k] = wp1[k] + (wp2[k] - wp1[k]) * e;
        }
      }
      return result;
    }
  }
  return waypoints[0];
};
// src/tosi-interpolator.ts
import { Component as Component3 } from "tosijs";
var interpolateStrings = (a, b, t) => {
  const numRegex = /-?\d+(?:\.\d+)?/g;
  const aNums = Array.from(a.matchAll(numRegex));
  const bNums = Array.from(b.matchAll(numRegex));
  if (aNums.length > 0 && aNums.length === bNums.length) {
    let result = "";
    let lastIndex = 0;
    for (let i = 0;i < aNums.length; i++) {
      const aMatch = aNums[i];
      const bMatch = bNums[i];
      result += a.substring(lastIndex, aMatch.index);
      const n1 = parseFloat(aMatch[0]);
      const n2 = parseFloat(bMatch[0]);
      const interpolated = n1 + (n2 - n1) * t;
      let numStr = interpolated.toFixed(4);
      if (numStr.includes(".")) {
        numStr = numStr.replace(/0+$/, "").replace(/\.$/, "");
      }
      result += numStr;
      lastIndex = aMatch.index + aMatch[0].length;
    }
    result += a.substring(lastIndex);
    return result;
  }
  const isColor2 = (s) => s.startsWith("#") || s.startsWith("rgb") || s.startsWith("hsl") || ["red", "blue", "white", "black", "transparent"].includes(s);
  if (isColor2(a) && isColor2(b)) {
    return `color-mix(in srgb, ${a} ${Math.round((1 - t) * 100)}%, ${b})`;
  }
  return t < 0.5 ? a : b;
};

class TosiInterpolator extends Component3 {
  static styleSpec = {
    ":host": {
      display: "contents"
    }
  };
  setScrollProgress(progress) {
    const waypointsNodes = Array.from(this.querySelectorAll("tosi-waypoint"));
    if (waypointsNodes.length === 0)
      return;
    const waypoints = waypointsNodes.map((w) => {
      const styles = {};
      const htmlEl = w;
      for (let i = 0;i < htmlEl.style.length; i++) {
        const prop = htmlEl.style[i];
        styles[prop] = htmlEl.style.getPropertyValue(prop);
      }
      return {
        progress: Number(w.getAttribute("progress") || 0),
        styles
      };
    }).sort((a, b) => a.progress - b.progress);
    let wp1 = waypoints[0];
    let wp2 = waypoints[waypoints.length - 1];
    let t = 0;
    if (progress <= wp1.progress) {
      wp2 = wp1;
      t = 0;
    } else if (progress >= wp2.progress) {
      wp1 = wp2;
      t = 1;
    } else {
      for (let i = 0;i < waypoints.length - 1; i++) {
        if (progress >= waypoints[i].progress && progress <= waypoints[i + 1].progress) {
          wp1 = waypoints[i];
          wp2 = waypoints[i + 1];
          const rawT = (progress - wp1.progress) / (wp2.progress - wp1.progress);
          const easing = this.getAttribute("easing");
          if (easing === "ease-in-out") {
            t = rawT < 0.5 ? 2 * rawT * rawT : -1 + (4 - 2 * rawT) * rawT;
          } else {
            t = rawT;
          }
          break;
        }
      }
    }
    const currentStyles = {};
    for (const prop in wp1.styles) {
      const val1 = wp1.styles[prop];
      const val2 = wp2.styles[prop] || val1;
      currentStyles[prop] = interpolateStrings(val1, val2, t);
    }
    const targets = Array.from(this.children).filter((c) => c.tagName !== "TOSI-WAYPOINT");
    targets.forEach((target) => {
      const el = target;
      for (const prop in currentStyles) {
        el.style.setProperty(prop, currentStyles[prop]);
      }
    });
  }
}

class TosiWaypoint extends Component3 {
  static initAttributes = {
    progress: 0
  };
  static styleSpec = {
    ":host": {
      display: "none"
    }
  };
  content = null;
}
var tosiInterpolator = TosiInterpolator.elementCreator({
  tag: "tosi-interpolator"
});
var tosiWaypoint = TosiWaypoint.elementCreator({
  tag: "tosi-waypoint"
});
// src/tosi-b3d-scroll.ts
import { Component as Component4, elements as elements3 } from "tosijs";
var { slot: slot2 } = elements3;
function findScene(el) {
  let node = el.parentElement;
  while (node) {
    if ("scene" in node)
      return node;
    for (const child of Array.from(node.children)) {
      if (child !== el && "scene" in child)
        return child;
    }
    node = node.parentElement;
  }
  return null;
}
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function interpolateWaypoints2(progress, waypoints, easing) {
  if (waypoints.length === 0)
    return {};
  if (waypoints.length === 1)
    return waypoints[0];
  if (progress <= waypoints[0].progress)
    return waypoints[0];
  if (progress >= waypoints[waypoints.length - 1].progress) {
    return waypoints[waypoints.length - 1];
  }
  for (let i = 0;i < waypoints.length - 1; i++) {
    const wp1 = waypoints[i];
    const wp2 = waypoints[i + 1];
    if (progress >= wp1.progress && progress <= wp2.progress) {
      const rawT = (progress - wp1.progress) / (wp2.progress - wp1.progress);
      const t = easing ? easeInOutQuad(rawT) : rawT;
      const result = {};
      for (const key in wp1) {
        if (key === "progress")
          continue;
        const v1 = wp1[key] ?? 0;
        const v2 = wp2[key] ?? v1;
        result[key] = v1 + (v2 - v1) * t;
      }
      return result;
    }
  }
  return waypoints[0];
}
function readWaypoints(host) {
  return Array.from(host.querySelectorAll("tosi-waypoint")).map((wp) => {
    const result = {
      progress: Number(wp.getAttribute("progress") || 0)
    };
    for (const attr of Array.from(wp.attributes)) {
      if (attr.name === "progress")
        continue;
      const val = Number(attr.value);
      if (Number.isFinite(val)) {
        const key = attr.name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        result[key] = val;
      }
    }
    return result;
  }).sort((a, b) => a.progress - b.progress);
}

class TosiScrollCamera extends Component4 {
  static initAttributes = {
    easing: ""
  };
  static styleSpec = {
    ":host": { display: "none" }
  };
  content = () => slot2();
  setScrollProgress(progress) {
    const owner = findScene(this);
    if (!owner?.scene?.activeCamera)
      return;
    const camera = owner.scene.activeCamera;
    const waypoints = readWaypoints(this);
    if (waypoints.length === 0)
      return;
    const easing = this.getAttribute("easing") === "ease-in-out";
    const v = interpolateWaypoints2(progress, waypoints, easing);
    if ("alpha" in v && camera.alpha !== undefined)
      camera.alpha = v.alpha;
    if ("beta" in v && camera.beta !== undefined)
      camera.beta = v.beta;
    if ("radius" in v && camera.radius !== undefined)
      camera.radius = v.radius;
    if (camera.target && typeof camera.target.copyFromFloats === "function") {
      if ("targetX" in v || "targetY" in v || "targetZ" in v) {
        camera.target.copyFromFloats(v.targetX ?? camera.target.x, v.targetY ?? camera.target.y, v.targetZ ?? camera.target.z);
      }
    }
    if (camera.position) {
      if ("x" in v)
        camera.position.x = v.x;
      if ("y" in v)
        camera.position.y = v.y;
      if ("z" in v)
        camera.position.z = v.z;
    }
    if ("fov" in v && camera.fov !== undefined)
      camera.fov = v.fov;
  }
}

class TosiScrollTime extends Component4 {
  static initAttributes = {
    from: 0,
    to: 24
  };
  static styleSpec = {
    ":host": { display: "none" }
  };
  content = null;
  setScrollProgress(progress) {
    const owner = findScene(this);
    if (!owner)
      return;
    const from = Number(this.getAttribute("from")) || 0;
    const to = Number(this.getAttribute("to")) || 24;
    const time = from + (to - from) * progress;
    const skybox = owner.querySelector("tosi-b3d-skybox");
    if (skybox) {
      skybox.timeOfDay = time;
    }
  }
}

class TosiScrollAnimation extends Component4 {
  static initAttributes = {
    name: ""
  };
  static styleSpec = {
    ":host": { display: "none" }
  };
  content = null;
  _animGroup = null;
  _started = false;
  setScrollProgress(progress) {
    const owner = findScene(this);
    if (!owner?.scene)
      return;
    const name = this.getAttribute("name") || "";
    if (!name)
      return;
    if (!this._animGroup || this._animGroup.name !== name) {
      this._animGroup = owner.scene.animationGroups?.find((g) => g.name === name);
      this._started = false;
    }
    if (!this._animGroup)
      return;
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
var tosiScrollCamera = TosiScrollCamera.elementCreator({
  tag: "tosi-scroll-camera"
});
var tosiScrollTime = TosiScrollTime.elementCreator({
  tag: "tosi-scroll-time"
});
var tosiScrollAnimation = TosiScrollAnimation.elementCreator({
  tag: "tosi-scroll-animation"
});
// src/tosi-prism.ts
import { Component as Component5 } from "tosijs";
var PRISM_VERSION = "1";
var CDN = `https://cdn.jsdelivr.net/npm/prismjs@${PRISM_VERSION}`;
var loaded = new Map;
function loadScript(src) {
  let p = loaded.get(src);
  if (p)
    return p;
  p = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
  loaded.set(src, p);
  return p;
}
function loadTheme() {
  const key = "theme";
  let p = loaded.get(key);
  if (p)
    return p;
  p = new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${CDN}/themes/prism-tomorrow.min.css`;
    link.onload = () => resolve();
    document.head.appendChild(link);
  });
  loaded.set(key, p);
  return p;
}
var LANGUAGE_DEPS = {
  markup: [],
  css: [],
  clike: [],
  javascript: ["clike"],
  typescript: ["javascript"],
  bash: [],
  json: []
};
var LANGUAGE_ALIASES = {
  html: "markup",
  xml: "markup",
  svg: "markup",
  mathml: "markup",
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash"
};
function resolveLanguage(name) {
  return LANGUAGE_ALIASES[name] ?? name;
}
async function loadPrism(languages = ["markup"]) {
  await loadTheme();
  await loadScript(`${CDN}/components/prism-core.min.js`);
  const wanted = new Set;
  const visit = (lang) => {
    if (wanted.has(lang))
      return;
    const deps = LANGUAGE_DEPS[lang];
    if (!deps)
      return;
    for (const d of deps)
      visit(d);
    wanted.add(lang);
  };
  for (const lang of languages)
    visit(lang);
  for (const lang of wanted) {
    await loadScript(`${CDN}/components/prism-${lang}.min.js`);
  }
}
async function highlightCodeBlocks(root) {
  const blocks = Array.from(root.querySelectorAll("pre code"));
  if (blocks.length === 0)
    return;
  const langs = new Set;
  for (const code of blocks) {
    const m = code.className.match(/language-([\w-]+)/);
    langs.add(resolveLanguage(m ? m[1] : "markup"));
  }
  await loadPrism(Array.from(langs));
  const Prism = globalThis.Prism;
  if (!Prism)
    return;
  for (const code of blocks) {
    if (code.dataset.prismHighlighted === "true")
      continue;
    const m = code.className.match(/language-([\w-]+)/);
    const lang = resolveLanguage(m ? m[1] : "markup");
    const grammar = Prism.languages[lang];
    if (!grammar)
      continue;
    code.innerHTML = Prism.highlight(code.textContent || "", grammar, lang);
    code.dataset.prismHighlighted = "true";
  }
}

class TosiPrism extends Component5 {
  static initAttributes = {
    language: "markup"
  };
  static lightStyleSpec = {
    ":host": {
      display: "block"
    },
    ":host pre": {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px",
      padding: "1.5em",
      fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
      lineHeight: 1.6,
      maxWidth: "90vw",
      overflowX: "auto",
      backdropFilter: "blur(20px)",
      margin: "1em 0 0",
      textAlign: "left"
    },
    ":host code": {
      fontFamily: "Consolas, Monaco, 'Courier New', monospace",
      whiteSpace: "pre"
    }
  };
  content = null;
  connectedCallback() {
    super.connectedCallback();
    this._highlight();
  }
  async _highlight() {
    const raw = this.textContent || "";
    if (!raw.trim())
      return;
    const lang = resolveLanguage(this.language || "markup");
    await loadPrism([lang]);
    const Prism = globalThis.Prism;
    const grammar = Prism?.languages?.[lang];
    const codeEl = document.createElement("code");
    codeEl.className = `language-${lang}`;
    codeEl.innerHTML = grammar ? Prism.highlight(raw.trim(), grammar, lang) : escapeHtml(raw.trim());
    codeEl.dataset.prismHighlighted = grammar ? "true" : "false";
    const preEl = document.createElement("pre");
    preEl.appendChild(codeEl);
    this.textContent = "";
    this.appendChild(preEl);
  }
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var tosiPrism = TosiPrism.elementCreator({ tag: "tosi-prism" });
export {
  tosiWaypoint,
  tosiScrollTime,
  tosiScrollCamera,
  tosiScrollAnimation,
  tosiProductSection,
  tosiProductHeader,
  tosiProduct,
  tosiPrism,
  tosiInterpolator,
  tosiFilmstrip,
  loadPrism,
  interpolateWaypoints,
  interpolateStrings,
  highlightCodeBlocks,
  TosiWaypoint,
  TosiScrollTime,
  TosiScrollCamera,
  TosiScrollAnimation,
  TosiProductSection,
  TosiProductHeader,
  TosiProduct,
  TosiPrism,
  TosiInterpolator,
  TosiFilmstrip
};
