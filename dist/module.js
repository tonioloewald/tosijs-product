// src/tosi-product.ts
import { BodymovinPlayer, B3d } from "tosijs-ui";
import { Component, elements } from "tosijs";
var { div, span, slot } = elements;
var scrollTargets = new Map;
var scrollHandlers = new Map;
function getScrollParent(el) {
  let node = el.parentElement;
  while (node) {
    if (node === document.body || node === document.documentElement) {
      break;
    }
    const { overflow, overflowX, overflowY } = getComputedStyle(node);
    if (/(auto|scroll)/.test(overflow + overflowX + overflowY)) {
      return node;
    }
    node = node.parentElement;
  }
  return window;
}
function onScroll(target) {
  requestAnimationFrame(() => {
    const sections = scrollTargets.get(target);
    if (sections) {
      for (const section of sections) {
        section.updateProgress();
      }
    }
  });
}
var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

class TosiProductSection extends Component {
  scrollCallback = null;
  static initAttributes = {
    scroll: 100,
    debug: false,
    direction: "vertical"
  };
  _debugInfo = null;
  _scrollTarget = null;
  _animators = null;
  _observer = null;
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      backgroundColor: "#000",
      color: "#fff"
    },
    ":host([direction=horizontal])": {
      display: "inline-block"
    },
    ".tosi-sticky": {
      position: "sticky",
      overflow: "hidden",
      zIndex: 1,
      backgroundColor: "inherit"
    },
    ".tosi-debug": {
      position: "absolute",
      top: "10px",
      left: "10px",
      background: "rgba(0,0,0,0.8)",
      color: "#0f0",
      padding: "5px 10px",
      fontFamily: "monospace",
      fontSize: "12px",
      zIndex: 100,
      borderRadius: "4px",
      pointerEvents: "none"
    }
  };
  content = () => [
    div({ class: "tosi-sticky" }, slot(), span({ class: "tosi-debug", part: "debug-info", hidden: true }))
  ];
  _getAnimators() {
    if (this._animators === null) {
      this._animators = Array.from(this.querySelectorAll("[data-scroll-animate], [data-scroll-range]"));
    }
    return this._animators;
  }
  _invalidateAnimators() {
    this._animators = null;
  }
  connectedCallback() {
    this._scrollTarget = getScrollParent(this);
    super.connectedCallback();
    this._debugInfo = this.shadowRoot?.querySelector(".tosi-debug");
    let sections = scrollTargets.get(this._scrollTarget);
    if (!sections) {
      sections = new Set;
      scrollTargets.set(this._scrollTarget, sections);
      const target = this._scrollTarget;
      const handler = () => onScroll(target);
      scrollHandlers.set(target, handler);
      target.addEventListener("scroll", handler, { passive: true });
    }
    sections.add(this);
    this._observer = new MutationObserver(() => this._invalidateAnimators());
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-scroll-animate", "data-scroll-range"]
    });
    requestAnimationFrame(() => {
      this.render();
      this.updateProgress();
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._animators = null;
    if (this._scrollTarget) {
      const sections = scrollTargets.get(this._scrollTarget);
      if (sections) {
        sections.delete(this);
        if (sections.size === 0) {
          scrollTargets.delete(this._scrollTarget);
          const handler = scrollHandlers.get(this._scrollTarget);
          if (handler) {
            this._scrollTarget.removeEventListener("scroll", handler);
            scrollHandlers.delete(this._scrollTarget);
          }
        }
      }
    }
  }
  render() {
    super.render();
    const scrollPct = this._getScrollPct();
    const horizontal = this.getAttribute("direction") === "horizontal";
    const sticky = this.shadowRoot?.querySelector(".tosi-sticky");
    const container = this._scrollTarget instanceof HTMLElement ? this._scrollTarget : null;
    const viewW = container ? container.clientWidth + "px" : "100vw";
    const viewH = container ? container.clientHeight + "px" : "100vh";
    const scrollDim = container ? `${scrollPct / 100 * (horizontal ? container.clientWidth : container.clientHeight)}px` : `${scrollPct}${horizontal ? "vw" : "vh"}`;
    if (horizontal) {
      this.style.width = `calc(${viewW} + ${scrollDim})`;
      this.style.height = "100%";
      if (sticky) {
        sticky.style.left = "0";
        sticky.style.top = "0";
        sticky.style.width = viewW;
        sticky.style.height = "100%";
      }
    } else {
      this.style.height = `calc(${viewH} + ${scrollDim})`;
      this.style.width = "100%";
      if (sticky) {
        sticky.style.top = "0";
        sticky.style.left = "0";
        sticky.style.height = viewH;
        sticky.style.width = "100%";
      }
    }
    if (this._debugInfo) {
      this._debugInfo.hidden = this.getAttribute("debug") !== "true";
    }
  }
  _getScrollPct() {
    const raw = Number(this.getAttribute("scroll"));
    return Number.isFinite(raw) && raw > 0 ? raw : 100;
  }
  _getScrollAmountPx() {
    const scrollPct = this._getScrollPct();
    const horizontal = this.getAttribute("direction") === "horizontal";
    const container = this._scrollTarget instanceof HTMLElement ? this._scrollTarget : null;
    if (container) {
      return scrollPct / 100 * (horizontal ? container.clientWidth : container.clientHeight);
    }
    return scrollPct / 100 * (horizontal ? window.innerWidth : window.innerHeight);
  }
  updateProgress() {
    if (!this.isConnected)
      return;
    const scrollAmount = this._getScrollAmountPx();
    if (scrollAmount <= 0)
      return;
    const rect = this.getBoundingClientRect();
    const horizontal = this.getAttribute("direction") === "horizontal";
    let offset = horizontal ? rect.left : rect.top;
    if (this._scrollTarget instanceof HTMLElement) {
      const containerRect = this._scrollTarget.getBoundingClientRect();
      offset -= horizontal ? containerRect.left : containerRect.top;
    }
    const progress = Math.max(0, Math.min(1, -offset / scrollAmount));
    this.dataset.progress = progress.toFixed(3);
    if (this._debugInfo && !this._debugInfo.hidden) {
      this._debugInfo.textContent = `Section: ${progress.toFixed(3)}`;
    }
    if (reducedMotion.matches) {
      if (this.scrollCallback) {
        this.scrollCallback(progress, this);
      }
      return;
    }
    const animators = this._getAnimators();
    for (const el of animators) {
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
      } else if (el.getAttribute("data-scroll-animate") === "lottie" && el.animation && (el instanceof BodymovinPlayer || el.tagName.includes("LOTTIE"))) {
        el.animation.goToAndStop(localProgress * el.animation.totalFrames, true);
      } else if (el.scene && (el instanceof B3d || el.tagName.includes("3D"))) {
        if (el.scene.activeCamera && el.scene.activeCamera.alpha !== undefined) {
          el.scene.activeCamera.alpha = localProgress * Math.PI * 2;
        }
      }
    }
    if (this.scrollCallback) {
      this.scrollCallback(progress, this);
    }
  }
}

class TosiProduct extends Component {
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      background: "#000",
      color: "#fff"
    }
  };
  content = () => slot();
}

class TosiScrollMapper extends Component {
  scrollCallback = null;
  static styleSpec = {
    ":host": {
      display: "block",
      width: "100%",
      height: "100%"
    }
  };
  content = () => slot();
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("data-scroll-animate")) {
      this.setAttribute("data-scroll-animate", "mapper");
    }
  }
  setScrollProgress(progress) {
    if (this.scrollCallback) {
      this.scrollCallback(progress);
    }
  }
}
var tosiProduct = TosiProduct.elementCreator({ tag: "tosi-product" });
var tosiProductSection = TosiProductSection.elementCreator({
  tag: "tosi-product-section"
});
var tosiScrollMapper = TosiScrollMapper.elementCreator({
  tag: "tosi-scroll-mapper"
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
  const isColor = (s) => s.startsWith("#") || s.startsWith("rgb") || s.startsWith("hsl") || ["red", "blue", "white", "black", "transparent"].includes(s);
  if (isColor(a) && isColor(b)) {
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
export {
  tosiWaypoint,
  tosiScrollTime,
  tosiScrollMapper,
  tosiScrollCamera,
  tosiScrollAnimation,
  tosiProductSection,
  tosiProduct,
  tosiInterpolator,
  tosiFilmstrip,
  interpolateWaypoints,
  interpolateStrings,
  TosiWaypoint,
  TosiScrollTime,
  TosiScrollMapper,
  TosiScrollCamera,
  TosiScrollAnimation,
  TosiProductSection,
  TosiProduct,
  TosiInterpolator,
  TosiFilmstrip
};
