import { Component, elements } from "tosijs";

const { div, slot } = elements;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getScrollParent(el: HTMLElement): EventTarget {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    if (node === document.body || node === document.documentElement) break;
    const { overflow, overflowX, overflowY } = getComputedStyle(node);
    if (/(auto|scroll)/.test(overflow + overflowX + overflowY)) return node;
    node = node.parentElement;
  }
  return window;
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

export class TosiProductV2 extends Component {
  static initAttributes = {
    direction: "vertical",
    debug: false,
  };

  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      background: "#000",
      color: "#fff",
    },
    ".window": {
      position: "sticky",
      top: "0",
      left: "0",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
    },
    ":host([direction=horizontal])": {
      display: "inline-block",
      width: "max-content",
    },
    ":host([direction=horizontal]) .window": {
      width: "100vw",
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

  private _scrollTarget: EventTarget | null = null;
  private _stack: HTMLElement | null = null;
  private _debugPanel: HTMLElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _mutationObserver: MutationObserver | null = null;
  private _items: Item[] = [];
  private _totalRunway = 0;
  private _scrollHandler = () => this._scheduleUpdate();
  private _rafPending = false;

  connectedCallback() {
    super.connectedCallback();
    this._stack = this.shadowRoot?.querySelector(".stack") as HTMLElement;
    this._debugPanel = this.shadowRoot?.querySelector(
      ".debug-panel"
    ) as HTMLElement;
    this._scrollTarget = getScrollParent(this);
    this._scrollTarget.addEventListener("scroll", this._scrollHandler, {
      passive: true,
    });
    window.addEventListener("resize", this._scrollHandler, { passive: true });

    this._mutationObserver = new MutationObserver(() => this._relayout());
    this._mutationObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ["scroll"],
    });

    this._resizeObserver = new ResizeObserver(() => this._relayout());
    for (const child of Array.from(this.children)) {
      if (child instanceof HTMLElement) this._resizeObserver.observe(child);
    }

    requestAnimationFrame(() => {
      this._relayout();
      this._update();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._scrollTarget?.removeEventListener("scroll", this._scrollHandler);
    window.removeEventListener("resize", this._scrollHandler);
    this._mutationObserver?.disconnect();
    this._resizeObserver?.disconnect();
  }

  private _isHorizontal(): boolean {
    return this.getAttribute("direction") === "horizontal";
  }

  private _viewSize(): number {
    const horizontal = this._isHorizontal();
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

    const items: Item[] = [];
    let cumOffset = 0;
    let cumRunway = 0;
    for (const child of Array.from(this.children)) {
      if (!(child instanceof HTMLElement)) continue;
      const isSection = child.tagName.toLowerCase() === "tosi-product-section-v2";
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

    this._items = items;
    this._totalRunway = cumRunway;

    // Host height = runway + viewport so the sticky window can pin for the
    // entire runway. The end-state translate clamp ensures the last viewport
    // shows the tail of the stack rather than blank space.
    const hostDim = horizontal ? "width" : "height";
    this.style[hostDim as any] = `${cumRunway + view}px`;

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
    const scrollPos = this._scrollPos();
    const hostStart = this._hostStart();
    const local = scrollPos - hostStart;

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

    if (this._debugPanel) {
      const showDebug = this.getAttribute("debug") === "true";
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
}

export class TosiProductSectionV2 extends Component {
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
    const animators = this.querySelectorAll(
      "[data-scroll-animate], [data-scroll-range]"
    );
    for (const el of Array.from(animators)) {
      const rangeStr = el.getAttribute("data-scroll-range") || "0,1";
      const [start, end] = rangeStr.split(",").map(Number);
      const range = end - start;
      const localProgress =
        range <= 0
          ? progress >= end
            ? 1
            : 0
          : Math.max(0, Math.min(1, (progress - start) / range));
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
      }
    }
    if (this.scrollCallback) this.scrollCallback(progress, this);
  }
}

export const tosiProductV2 = TosiProductV2.elementCreator({
  tag: "tosi-product-v2",
});
export const tosiProductSectionV2 = TosiProductSectionV2.elementCreator({
  tag: "tosi-product-section-v2",
});
