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

import { Component, type ComponentAttrs } from "tosijs";
import { CDN, THEME_PATH, integrityFor, resolveLoadSet } from "./prism-sources";

const loaded = new Map<string, Promise<void>>();

/** Fail an outstanding load after `ms` rather than hanging on it forever. */
const LOAD_TIMEOUT_MS = 10000;

function loadScript(path: string): Promise<void> {
  let p = loaded.get(path);
  if (p) return p;
  /*
  Fail CLOSED. `if (integrity) { … }` meant a path with no table entry loaded with no
  integrity attribute at all — so the one way to reach an unhashed URL was also the one
  way to skip the check. Refuse instead: a URL we cannot verify is one we do not fetch.
  */
  const integrity = integrityFor(path);
  if (!integrity) {
    return Promise.reject(
      new Error(
        `tosi-prism: refusing to load ${path} — no integrity hash. Add one to SUBRESOURCE_INTEGRITY.`,
      ),
    );
  }
  p = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `${CDN}/${path}`;
    s.integrity = integrity;
    s.crossOrigin = "anonymous";
    const timer = setTimeout(
      () => reject(new Error(`Timed out loading ${s.src}`)),
      LOAD_TIMEOUT_MS,
    );
    s.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    s.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`Failed to load ${s.src}`));
    };
    document.head.appendChild(s);
  });
  /*
  A rejection must not latch. The cache exists to dedupe concurrent loads, but caching a
  REJECTED promise means one transient failure — the new timeout makes those reachable —
  disables highlighting for the life of the page, with every retry replaying the old
  error. Forget the failure so a later call can try again.
  */
  p.catch(() => {
    if (loaded.get(path) === p) loaded.delete(path);
  });
  loaded.set(path, p);
  return p;
}

/*
The theme RESOLVES on failure rather than rejecting, and is bounded by a timeout.
It only had `onload`, so under a strict CSP — exactly the consumer the note above
addresses — or offline, or during a CDN outage, the promise never settled and
`await loadPrism(...)` hung forever: the documented two-line usage silently
stopped at line one. A missing theme costs colors, not function, so failing it
open is right; a missing grammar rejects, because there is nothing to show.
*/
function loadTheme(): Promise<void> {
  const path = THEME_PATH;
  let p = loaded.get(path);
  if (p) return p;
  // Fail closed like loadScript, but quietly: an unverifiable theme is skipped, not fetched.
  const integrity = integrityFor(path);
  if (!integrity) return Promise.resolve();
  p = new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${CDN}/${path}`;
    link.integrity = integrity;
    link.crossOrigin = "anonymous";
    const done = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(done, LOAD_TIMEOUT_MS);
    link.onload = done;
    link.onerror = done;
    document.head.appendChild(link);
  });
  loaded.set(path, p);
  return p;
}

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
  languages: string[] = ["markup"],
): Promise<void> {
  await loadTheme();
  // Core first, then each grammar after its prerequisites; order is resolveLoadSet's.
  for (const path of resolveLoadSet(languages)) await loadScript(path);
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
  static preferredTagName = "tosi-prism";
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

export const tosiPrism = TosiPrism.elementCreator();

/*
Declaration merge: `initAttributes` keys become instance properties at hydration, which
the type system cannot infer from a static. tosijs 1.10 removed the `[key: string]: any`
index signature that used to paper over this, so these are now REAL types rather than
`any` — and a typo is a compile error.
*/
export interface TosiPrism extends ComponentAttrs<
  typeof TosiPrism.initAttributes
> {}
