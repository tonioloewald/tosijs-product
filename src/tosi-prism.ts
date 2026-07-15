/*#
# `<tosi-prism>`

Lazy-loads PrismJS (from jsDelivr) to syntax-highlight its own text content. Set the language with
**`language`** (default `markup`). Unlike a scroll scene it needs no engine — drop it anywhere.

<tosi-prism language="javascript">
const app = tosiProduct(
  tosiProductSection({ scroll: 200 })
)
app.themes = { midnight: { '--bg': '#08081a', '--fg': '#f0f0f5' } }
app.defaultTheme = 'midnight'
</tosi-prism>

## Attributes

- **`language`** — Prism language id (`markup`, `javascript`, `css`, `bash`, …). Default `markup`.

## Helpers

The module also exports `loadPrism` / `highlightCodeBlocks` for post-processing other rendered code
(e.g. markdown output):

```typescript
import { loadPrism, highlightCodeBlocks } from 'tosijs-product'
await loadPrism(['javascript', 'css'])
highlightCodeBlocks(document.querySelector('.rendered-markdown'))
```

> Renamed from `tosi-code` in v0.6.x to avoid clashing with tosijs-ui's `<tosi-code>` code editor.

See also [`<tosi-product>`](/tosi-product/).
*/

import { Component } from "tosijs";

const PRISM_VERSION = "1";
const CDN = `https://cdn.jsdelivr.net/npm/prismjs@${PRISM_VERSION}`;

const loaded = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  let p = loaded.get(src);
  if (p) return p;
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

function loadTheme(): Promise<void> {
  const key = "theme";
  let p = loaded.get(key);
  if (p) return p;
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

// Prism's language graph — only the entries we want to surface in docs.
// Each value lists prerequisite languages that must load first.
const LANGUAGE_DEPS: Record<string, string[]> = {
  markup: [],
  css: [],
  clike: [],
  javascript: ["clike"],
  typescript: ["javascript"],
  bash: [],
  json: [],
};

// Marked emits the raw fence tag as the class (e.g. ```html → language-html).
// Resolve those to Prism's canonical names before loading / lookup.
const LANGUAGE_ALIASES: Record<string, string> = {
  html: "markup",
  xml: "markup",
  svg: "markup",
  mathml: "markup",
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
};

function resolveLanguage(name: string): string {
  return LANGUAGE_ALIASES[name] ?? name;
}

/**
 * Lazy-load PrismJS core + the requested grammars from jsDelivr.
 * Safe to call repeatedly; each script + theme is fetched at most once.
 */
export async function loadPrism(
  languages: string[] = ["markup"]
): Promise<void> {
  await loadTheme();
  await loadScript(`${CDN}/components/prism-core.min.js`);
  const wanted = new Set<string>();
  const visit = (lang: string) => {
    if (wanted.has(lang)) return;
    const deps = LANGUAGE_DEPS[lang];
    if (!deps) return; // unknown language — skip silently
    for (const d of deps) visit(d);
    wanted.add(lang);
  };
  for (const lang of languages) visit(lang);
  // Load in dependency order.
  for (const lang of wanted) {
    await loadScript(`${CDN}/components/prism-${lang}.min.js`);
  }
}

/**
 * Walk `root` for `<pre><code class="language-…">` blocks (the shape Marked
 * emits) and replace each block's contents with Prism-highlighted markup.
 * Idempotent: re-running on an already-highlighted block is a no-op as long
 * as the language hasn't changed.
 */
export async function highlightCodeBlocks(root: ParentNode): Promise<void> {
  const blocks = Array.from(root.querySelectorAll("pre code")) as HTMLElement[];
  if (blocks.length === 0) return;
  const langs = new Set<string>();
  for (const code of blocks) {
    const m = code.className.match(/language-([\w-]+)/);
    langs.add(resolveLanguage(m ? m[1] : "markup"));
  }
  await loadPrism(Array.from(langs));
  const Prism = (globalThis as any).Prism;
  if (!Prism) return;
  for (const code of blocks) {
    if (code.dataset.prismHighlighted === "true") continue;
    const m = code.className.match(/language-([\w-]+)/);
    const lang = resolveLanguage(m ? m[1] : "markup");
    const grammar = Prism.languages[lang];
    if (!grammar) continue;
    code.innerHTML = Prism.highlight(code.textContent || "", grammar, lang);
    code.dataset.prismHighlighted = "true";
  }
}

/**
 * `<tosi-prism>` — a standalone code block. Renames the v0.5.x `<tosi-code>`
 * component to avoid clashing with `tosijs-ui`'s code editor (which uses
 * `tosi-code`). Behavior is unchanged: lazy-load Prism, syntax-highlight
 * text content into `<pre><code>`.
 */
export class TosiPrism extends Component {
  static initAttributes = {
    language: "markup",
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
    const lang = resolveLanguage((this as any).language || "markup");
    await loadPrism([lang]);
    const Prism = (globalThis as any).Prism;
    const grammar = Prism?.languages?.[lang];
    const codeEl = document.createElement("code");
    codeEl.className = `language-${lang}`;
    codeEl.innerHTML = grammar
      ? Prism.highlight(raw.trim(), grammar, lang)
      : escapeHtml(raw.trim());
    codeEl.dataset.prismHighlighted = grammar ? "true" : "false";
    const preEl = document.createElement("pre");
    preEl.appendChild(codeEl);
    this.textContent = "";
    this.appendChild(preEl);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const tosiPrism = TosiPrism.elementCreator({ tag: "tosi-prism" });
