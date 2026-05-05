import {
  tosiProductV2,
  tosiProductSectionV2,
  TosiProductV2,
} from "../src/tosi-product-v2";
import { elements } from "tosijs";

const { div, header, footer, nav, h1, h2, h3, p, span, a } = elements;

// === Theme registry ============================================================
// Themes are dictionaries of CSS custom properties. tosi-product-v2 sets these
// on document.documentElement so they cascade to everything (including the page
// header, footer, and the sticky overlay outside the engine).
const themes = {
  midnight: {
    "--bg": "#08081a",
    "--fg": "#f0f0f5",
    "--muted": "#a0a0b8",
    "--accent": "#9be7ff",
    "--surface": "rgba(255,255,255,0.06)",
    "--border": "rgba(255,255,255,0.12)",
  },
  forest: {
    "--bg": "#0a1f14",
    "--fg": "#e8f5ee",
    "--muted": "#9bbaa6",
    "--accent": "#7fdba0",
    "--surface": "rgba(255,255,255,0.06)",
    "--border": "rgba(255,255,255,0.12)",
  },
  paper: {
    "--bg": "#f5f1e8",
    "--fg": "#1a1815",
    "--muted": "#6b6862",
    "--accent": "#7c3aed",
    "--surface": "rgba(0,0,0,0.04)",
    "--border": "rgba(0,0,0,0.08)",
  },
  rose: {
    "--bg": "#2a0820",
    "--fg": "#ffeef5",
    "--muted": "#d8a8c0",
    "--accent": "#ff80b5",
    "--surface": "rgba(255,255,255,0.06)",
    "--border": "rgba(255,255,255,0.12)",
  },
};

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: 0;
    background: var(--bg, #000);
    color: var(--fg, #fff);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    transition: background-color 0.25s linear;
  }

  /* === Page header (sibling above engine) === */
  .page-header {
    background: var(--bg);
    color: var(--fg);
    border-bottom: 1px solid var(--border);
    padding: 1rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
    transition: background-color 0.25s linear, color 0.25s linear, border-color 0.25s linear;
  }
  .page-header .brand { font-weight: 700; font-size: 1.1rem; }
  .page-header nav { display: flex; gap: 1.25rem; }
  .page-header nav a {
    color: var(--muted); text-decoration: none; font-size: 0.9rem;
    transition: color 0.2s ease;
  }
  .page-header nav a:hover { color: var(--accent); }

  /* === Sticky header (fixed, slides in after scroll) === */
  .sticky-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: color-mix(in srgb, var(--bg) 85%, transparent);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: var(--fg);
    border-bottom: 1px solid var(--border);
    padding: 0.7rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
    transform: translateY(-100%);
    transition:
      transform 0.3s cubic-bezier(.5,0,.2,1),
      background-color 0.3s linear,
      color 0.3s linear,
      border-color 0.3s linear;
  }
  .sticky-header.visible { transform: translateY(0); }
  .sticky-header .brand { font-weight: 700; font-size: 1rem; }
  .sticky-header .progress {
    font-family: monospace; font-size: 0.8rem; color: var(--muted);
  }

  /* === Page footer (sibling below engine) === */
  .page-footer {
    background: var(--bg);
    color: var(--muted);
    border-top: 1px solid var(--border);
    padding: 2.5rem 2rem;
    text-align: center;
    transition: background-color 0.25s linear, color 0.25s linear, border-color 0.25s linear;
  }
  .page-footer p { margin: 0; }

  /* === Section content === */
  .scene {
    height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem; text-align: center;
    background: var(--bg); color: var(--fg);
    transition: background-color 0.25s linear, color 0.25s linear;
  }
  .scene h2 {
    font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 0.4em; font-weight: 800;
  }
  .scene p {
    font-size: clamp(1rem, 1.6vw, 1.2rem); color: var(--muted);
    max-width: 560px; margin: 0;
  }
  .scene .pill {
    display: inline-block; margin-top: 1.5em;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--accent); font-family: monospace; font-size: 0.85rem;
    padding: 0.5em 1.2em; border-radius: 999px;
  }

  .intro {
    background: var(--bg); color: var(--fg);
    padding: clamp(3rem, 8vh, 6rem) 1.5rem;
    display: flex; justify-content: center;
    transition: background-color 0.25s linear, color 0.25s linear;
  }
  .intro-inner { max-width: 640px; line-height: 1.7; }
  .intro-inner h3 { font-size: 1.5rem; margin: 0 0 0.6em; }
  .intro-inner p { color: var(--muted); margin: 0; }
`;
document.head.appendChild(style);

// === Page header ==============================================================
const pageHeader = header(
  { class: "page-header" },
  div({ class: "brand" }, "tosijs-product"),
  nav(
    a({ href: "#" }, "Docs"),
    a({ href: "#" }, "Examples"),
    a({ href: "#" }, "GitHub")
  )
);

// === Sticky header (overlay) ==================================================
const stickyProgress = span({ class: "progress" }, "0%");
const stickyHeader = header(
  { class: "sticky-header", id: "sticky" },
  div({ class: "brand" }, "tosijs-product"),
  stickyProgress
);

// === Engine ==================================================================
const app = tosiProductV2(
  tosiProductSectionV2(
    { scroll: 100, theme: "midnight" },
    div(
      { class: "scene" },
      h2("Midnight"),
      p("First section pinned with a constant midnight theme. Scroll to enter the next scene."),
      span({ class: "pill" }, "theme=midnight")
    )
  ),

  div(
    { class: "intro" },
    div(
      { class: "intro-inner" },
      h3("Why themes?"),
      p(
        "Themes are dictionaries of CSS custom properties. tosi-product-v2 reads the active section's theme attributes and writes the resolved values to document.documentElement, so everything cascading from there — including the sticky header above — re-themes in unison."
      )
    )
  ),

  tosiProductSectionV2(
    { scroll: 100, theme: "forest" },
    div(
      { class: "scene" },
      h2("Forest"),
      p("Different theme, same layout. Notice the page header and sticky header both follow."),
      span({ class: "pill" }, "theme=forest")
    )
  ),

  // The transition section: dark → light over its pin range
  tosiProductSectionV2(
    {
      scroll: 250,
      "theme-from": "forest",
      "theme-to": "paper",
    },
    div(
      { class: "scene" },
      h2("Dawn"),
      p("This section's pin progress interpolates the theme from forest into paper. By the time pinning ends, you're in light mode — and so is the page above and below."),
      span({ class: "pill" }, 'theme-from="forest" theme-to="paper"')
    )
  ),

  tosiProductSectionV2(
    { scroll: 100, theme: "paper" },
    div(
      { class: "scene" },
      h2("Paper"),
      p("Light theme settled. Sticky header is themed in light too."),
      span({ class: "pill" }, "theme=paper")
    )
  ),

  // Transition back to dark for the closing scene
  tosiProductSectionV2(
    {
      scroll: 200,
      "theme-from": "paper",
      "theme-to": "rose",
    },
    div(
      { class: "scene" },
      h2("Dusk"),
      p("And back the other way — paper interpolating to rose."),
      span({ class: "pill" }, 'theme-from="paper" theme-to="rose"')
    )
  ),

  tosiProductSectionV2(
    { scroll: 100, theme: "rose" },
    div(
      { class: "scene" },
      h2("Rose"),
      p("Last section. The footer below inherits this theme too."),
      span({ class: "pill" }, "theme=rose")
    )
  )
) as TosiProductV2;

// Configure themes on the engine instance.
app.themes = themes;
app.defaultTheme = "midnight";

// === Page footer ===========================================================
const pageFooter = footer(
  { class: "page-footer" },
  p("Page footer — themed by whatever section ended the engine.")
);

document.body.appendChild(pageHeader);
document.body.appendChild(stickyHeader);
document.body.appendChild(app);
document.body.appendChild(pageFooter);

// === Sticky header behavior ===============================================
// Show after scrolling past the page header height; update progress text.
let lastScroll = 0;
const STICKY_THRESHOLD = 80;
function onPageScroll() {
  const y = window.scrollY;
  stickyHeader.classList.toggle("visible", y > STICKY_THRESHOLD);
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.round((y / docHeight) * 100) : 0;
  stickyProgress.textContent = `${pct}%`;
  lastScroll = y;
}
window.addEventListener("scroll", () => requestAnimationFrame(onPageScroll), { passive: true });
onPageScroll();
