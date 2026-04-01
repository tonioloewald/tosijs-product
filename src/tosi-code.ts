import { Component } from "tosijs";

let prismLoaded: Promise<void> | null = null;

function loadPrism(): Promise<void> {
  if (prismLoaded) return prismLoaded;
  prismLoaded = new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism-tomorrow.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js";
    script.onload = () => {
      const markup = document.createElement("script");
      markup.src =
        "https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-markup.min.js";
      markup.onload = () => resolve();
      document.head.appendChild(markup);
    };
    document.head.appendChild(script);
  });
  return prismLoaded;
}

export class TosiCode extends Component {
  static initAttributes = {
    language: "html",
  };

  static lightStyleSpec = {
    ":host": {
      display: "block",
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
      textAlign: "left",
    },
    ":host code": {
      fontFamily: "Consolas, Monaco, 'Courier New', monospace",
      whiteSpace: "pre",
    },
  };

  content = null;

  connectedCallback() {
    super.connectedCallback();
    this._highlight();
  }

  private async _highlight() {
    const raw = this.textContent || "";
    if (!raw.trim()) return;

    await loadPrism();

    const lang = (this as any).language || "html";
    const grammar = (globalThis as any).Prism?.languages?.[lang];

    const codeEl = document.createElement("code");
    codeEl.className = `language-${lang}`;
    if (grammar) {
      codeEl.innerHTML = (globalThis as any).Prism.highlight(
        raw.trim(),
        grammar,
        lang
      );
    } else {
      codeEl.textContent = raw.trim();
    }

    const preEl = document.createElement("pre");
    preEl.appendChild(codeEl);

    this.textContent = "";
    this.appendChild(preEl);
  }
}

export const tosiCode = TosiCode.elementCreator({ tag: "tosi-code" });
