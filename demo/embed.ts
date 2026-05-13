import { tosiProduct, tosiProductSection } from "../src/tosi-product";
import { elements } from "tosijs";

const { div, header, footer, h1, h2, p, span } = elements;

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: 0; background: #0a0a0a; color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  /* Page header — sibling above tosi-product */
  .page-header {
    background: #1a1a2e;
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #333;
  }
  .page-header h1 { margin: 0; font-size: 1.4rem; }
  .page-header p { margin: 0.25em 0 0; color: #888; font-size: 0.9rem; }

  /* Page footer — sibling below tosi-product */
  .page-footer {
    background: #1a1a2e;
    padding: 2rem;
    text-align: center;
    border-top: 2px solid #333;
    color: #888;
  }

  /* Outer panel content */
  .outer-panel {
    height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
  }
  .outer-panel h2 { font-size: 2.5rem; margin: 0 0 0.4em; }
  .outer-panel p { color: #aaa; max-width: 480px; margin: 0; padding: 0 1rem; }
  .outer-a { background: linear-gradient(180deg, #102030 0%, #051020 100%); }
  .outer-c { background: linear-gradient(180deg, #2a1030 0%, #100520 100%); }

  /* Nested horizontal tosi-product container */
  .nested-host {
    height: 100vh;
    background: #082010;
    display: flex; flex-direction: column;
  }
  .nested-host h2 {
    margin: 0; padding: 1rem 2rem; font-size: 1.4rem; flex-shrink: 0;
  }
  .nested-host .nested-frame {
    flex: 1; min-height: 0; overflow: hidden;
    border: 1px dashed #888;
    margin: 0 1rem 1rem;
  }
  /* Inner horizontal sub-panels — size to engine's published view size,
     not 100vw (which would overflow the embedded host's container). */
  .h-panel {
    width: var(--tosi-view-size, 100vw); height: 100%;
    display: flex; align-items: center; justify-content: center;
    text-align: center; font-size: 2rem; font-weight: 600;
    flex-shrink: 0;
  }
  .h-a { background: #1a4030; }
  .h-b { background: #1a2050; }
  .h-c { background: #501a30; }

  .marker {
    display: inline-block;
    background: rgba(255,255,255,0.1);
    padding: 0.4em 0.9em; border-radius: 999px;
    font-family: monospace; font-size: 0.8rem;
    margin-top: 1em;
  }
`;
document.head.appendChild(style);

// === Page header (sibling above the engine) ===
const pageHeader = header(
  { class: "page-header" },
  h1("v2 embeddability test"),
  p(
    "Page header above. tosi-product below. Footer below that. Inside the middle vertical section: a nested horizontal tosi-product."
  )
);

// === Inner horizontal tosi-product (lives inside a section of the outer) ===
const innerHorizontal = tosiProduct(
  { direction: "horizontal" },
  tosiProductSection(
    { scroll: 100 },
    div(
      { class: "h-panel h-a" },
      "Inner H-1",
      span({ class: "marker" }, "horizontal section")
    )
  ),
  tosiProductSection(
    { scroll: 100 },
    div(
      { class: "h-panel h-b" },
      "Inner H-2",
      span({ class: "marker" }, "horizontal section")
    )
  ),
  tosiProductSection(
    { scroll: 100 },
    div(
      { class: "h-panel h-c" },
      "Inner H-3",
      span({ class: "marker" }, "horizontal section")
    )
  )
);

// === Outer vertical tosi-product (the main engine) ===
const outerEngine = tosiProduct(
  // Section 1
  tosiProductSection(
    { scroll: 100 },
    div(
      { class: "outer-panel outer-a" },
      h2("Outer Section A"),
      p(
        "Vertical tosi-product. Page header above me, footer below the engine."
      ),
      span({ class: "marker" }, "outer / vertical")
    )
  ),
  // Section 2: hosts a nested horizontal tosi-product
  tosiProductSection(
    { scroll: 200 },
    div(
      { class: "nested-host" },
      h2("Outer Section B — contains nested horizontal engine"),
      div({ class: "nested-frame" }, innerHorizontal)
    )
  ),
  // Section 3
  tosiProductSection(
    { scroll: 100 },
    div(
      { class: "outer-panel outer-c" },
      h2("Outer Section C"),
      p("Engine continues vertically after the nested region."),
      span({ class: "marker" }, "outer / vertical")
    )
  )
);

// === Page footer (sibling below the engine) ===
const pageFooter = footer(
  { class: "page-footer" },
  p(
    "Page footer below. If you can see this after scrolling past the engine, embeddability works."
  )
);

document.body.appendChild(pageHeader);
document.body.appendChild(outerEngine);
document.body.appendChild(pageFooter);
