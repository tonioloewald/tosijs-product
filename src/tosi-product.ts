import { BodymovinPlayer, B3d } from "tosijs-ui";
import { Component, elements } from "tosijs";

const { div, span, slot } = elements;

const scrollTargets = new Map<EventTarget, Set<TosiProductSection>>();

function getScrollParent(el: HTMLElement): EventTarget {
  let node: HTMLElement | null = el.parentElement;
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

function onScroll(target: EventTarget) {
  requestAnimationFrame(() => {
    const sections = scrollTargets.get(target);
    if (sections) {
      for (const section of sections) {
        section.updateProgress();
      }
    }
  });
}

export class TosiProductSection extends Component {
  scrollCallback: ((progress: number, el: HTMLElement) => void) | null = null;

  static initAttributes = {
    scroll: 100,
    debug: false,
    direction: "vertical",
  };

  private _debugInfo: HTMLElement | null = null;

  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      backgroundColor: "#000",
      color: "#fff",
    },
    ":host([direction=horizontal])": {
      display: "inline-block",
    },
    ".tosi-sticky": {
      position: "sticky",
      overflow: "hidden",
      zIndex: 1,
      backgroundColor: "inherit",
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
      pointerEvents: "none",
    },
  };

  content = () => [
    div(
      { class: "tosi-sticky" },
      slot(),
      span({ class: "tosi-debug", part: "debug-info", hidden: true })
    ),
  ];

  private _scrollTarget: EventTarget | null = null;

  connectedCallback() {
    // Set scroll target before super so render() can use it
    this._scrollTarget = getScrollParent(this);

    super.connectedCallback();
    this._debugInfo = this.shadowRoot?.querySelector(
      ".tosi-debug"
    ) as HTMLElement;

    let sections = scrollTargets.get(this._scrollTarget);
    if (!sections) {
      sections = new Set();
      scrollTargets.set(this._scrollTarget, sections);
      const target = this._scrollTarget;
      target.addEventListener("scroll", () => onScroll(target), {
        passive: true,
      });
    }
    sections.add(this);

    this.updateProgress();

    // Re-render after layout in case container dimensions weren't ready
    requestAnimationFrame(() => {
      this.render();
      this.updateProgress();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._scrollTarget) {
      const sections = scrollTargets.get(this._scrollTarget);
      if (sections) {
        sections.delete(this);
      }
    }
  }

  render() {
    super.render();
    const scrollPct = this.getAttribute("scroll") || "100";
    const horizontal = this.getAttribute("direction") === "horizontal";
    const sticky = this.shadowRoot?.querySelector(
      ".tosi-sticky"
    ) as HTMLElement;

    const container =
      this._scrollTarget instanceof HTMLElement ? this._scrollTarget : null;
    const viewW = container ? container.clientWidth + "px" : "100vw";
    const viewH = container ? container.clientHeight + "px" : "100vh";
    const scrollDim = container
      ? `${
          (Number(scrollPct) / 100) *
          (horizontal ? container.clientWidth : container.clientHeight)
        }px`
      : `${scrollPct}${horizontal ? "vw" : "vh"}`;

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

  private _getScrollAmountPx(): number {
    const scrollPct = Number(this.getAttribute("scroll") || 100);
    const horizontal = this.getAttribute("direction") === "horizontal";
    const container =
      this._scrollTarget instanceof HTMLElement ? this._scrollTarget : null;
    if (container) {
      return (
        (scrollPct / 100) *
        (horizontal ? container.clientWidth : container.clientHeight)
      );
    }
    return (
      (scrollPct / 100) * (horizontal ? window.innerWidth : window.innerHeight)
    );
  }

  updateProgress() {
    if (!this.isConnected) return;

    const scrollAmount = this._getScrollAmountPx();
    if (scrollAmount <= 0) return; // Container not laid out yet

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

    const animators = this.querySelectorAll(
      "[data-scroll-animate], [data-scroll-range]"
    );
    animators.forEach((el: any) => {
      const rangeStr = el.getAttribute("data-scroll-range") || "0,1";
      const [start, end] = rangeStr.split(",").map(Number);
      const localProgress = Math.max(
        0,
        Math.min(1, (progress - start) / (end - start))
      );

      el.style.setProperty("--local-progress", localProgress.toString());
      el.dataset.localProgress = localProgress.toFixed(3);

      if (typeof el.setScrollProgress === "function") {
        el.setScrollProgress(localProgress);
      } else if (
        el.getAttribute("data-scroll-animate") === "currentTime" &&
        el.duration
      ) {
        // Handle Video scrubbing
        el.currentTime = localProgress * el.duration;
      } else if (
        el.getAttribute("data-scroll-animate") === "lottie" &&
        el.animation &&
        (el instanceof BodymovinPlayer || el.tagName.includes("LOTTIE"))
      ) {
        el.animation.goToAndStop(
          localProgress * el.animation.totalFrames,
          true
        );
      } else if (el.scene && (el instanceof B3d || el.tagName.includes("3D"))) {
        if (
          el.scene.activeCamera &&
          el.scene.activeCamera.alpha !== undefined
        ) {
          el.scene.activeCamera.alpha = localProgress * Math.PI * 2;
        }
      }
    });

    if (this.scrollCallback) {
      this.scrollCallback(progress, this);
    }
  }
}

export class TosiProduct extends Component {
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      background: "#000",
      color: "#fff",
    },
  };
  content = () => slot();
}

export class TosiScrollMapper extends Component {
  scrollCallback: ((progress: number) => void) | null = null;

  static styleSpec = {
    ":host": {
      display: "block",
      width: "100%",
      height: "100%",
    },
  };
  content = () => slot();

  connectedCallback() {
    super.connectedCallback();
    // Ensure the section's querySelectorAll finds this element
    if (!this.hasAttribute("data-scroll-animate")) {
      this.setAttribute("data-scroll-animate", "mapper");
    }
  }

  setScrollProgress(progress: number) {
    if (this.scrollCallback) {
      this.scrollCallback(progress);
    }
  }
}

export const tosiProduct = TosiProduct.elementCreator({ tag: "tosi-product" });
export const tosiProductSection = TosiProductSection.elementCreator({
  tag: "tosi-product-section",
});
export const tosiScrollMapper = TosiScrollMapper.elementCreator({
  tag: "tosi-scroll-mapper",
});
