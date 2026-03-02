import { BodymovinPlayer, B3d } from "tosijs-ui";
import { Component, elements } from "tosijs";

const { div, span, slot } = elements;

let scrollHandlerInitialized = false;
const sections: TosiProductSection[] = [];

function onGlobalScroll() {
  requestAnimationFrame(() => {
    for (const section of sections) {
      section.updateProgress();
    }
  });
}

export class TosiProductSection extends Component {
  scrollCallback: ((progress: number, el: HTMLElement) => void) | null = null;

  static initAttributes = {
    scroll: 1000,
    debug: false,
  };

  private _debugInfo: HTMLElement | null = null;

  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      height: "calc(100vh + var(--scroll-amount, 1000px))",
      backgroundColor: "#000",
      color: "#fff",
    },
    ".tosi-sticky": {
      position: "sticky",
      top: 0,
      left: 0,
      height: "100vh",
      width: "100vw",
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

  connectedCallback() {
    super.connectedCallback();
    this._debugInfo = this.shadowRoot?.querySelector(
      ".tosi-debug"
    ) as HTMLElement;

    sections.push(this);
    if (!scrollHandlerInitialized) {
      window.addEventListener("scroll", onGlobalScroll, {
        passive: true,
        capture: true,
      });
      scrollHandlerInitialized = true;
    }

    this.updateProgress();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const index = sections.indexOf(this);
    if (index > -1) {
      sections.splice(index, 1);
    }
  }

  render() {
    super.render();
    const scrollAmount = this.getAttribute("scroll") || "1000";
    this.style.setProperty("--scroll-amount", scrollAmount + "px");
    if (this._debugInfo) {
      this._debugInfo.hidden = this.getAttribute("debug") !== "true";
    }
  }

  updateProgress() {
    if (!this.isConnected) return;

    const scrollAmount = Number(this.getAttribute("scroll") || 1000);
    const rect = this.getBoundingClientRect();

    // Progress is 0 when the top of the section is at the top of the viewport
    // Progress is 1 when the bottom of the section (minus 100vh) is at the top of the viewport
    const progress = Math.max(0, Math.min(1, -rect.top / scrollAmount));

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
