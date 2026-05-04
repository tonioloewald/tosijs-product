import {
  tosiProductV2,
  tosiProductSectionV2,
} from "../src/tosi-product-v2";
import { tosiInterpolator, tosiWaypoint } from "../src/tosi-interpolator";
import { elements } from "tosijs";

const { div, h1, h2, p } = elements;

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: 0; background: #000; color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .hero {
    height: 70vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, #1a1a2e 0%, #000 120%);
    text-align: center;
  }
  .hero h1 {
    font-size: clamp(2rem, 7vw, 5rem); margin: 0; font-weight: 800;
    background: linear-gradient(to bottom, #fff, #aaa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero p { color: #999; margin-top: 0.5em; font-size: 1.2rem; }
  .intro {
    background: #050510;
    padding: clamp(3rem, 10vh, 8rem) 1.5rem;
    display: flex; justify-content: center;
  }
  .intro-inner {
    max-width: 640px; line-height: 1.7; color: #bbb;
    font-size: clamp(1rem, 1.6vw, 1.15rem);
  }
  .intro-inner h2 {
    font-size: clamp(1.4rem, 3.5vw, 2.2rem); margin: 0 0 0.6em;
    color: #fff;
  }
  .panel {
    height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 2rem;
  }
  .panel h2 {
    font-size: clamp(1.6rem, 5vw, 3rem); margin: 0 0 0.4em;
  }
  .panel p { color: #aaa; max-width: 540px; margin: 0; }
  .feature-list {
    display: flex; flex-direction: column; align-items: flex-start;
    gap: 0.5em; max-width: 560px; padding: 0 1.5rem;
  }
  .feature-list h2, .feature-list p { text-align: left; }
  .feature-row {
    font-size: 1.1rem; color: #fff;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 0.6em 1em;
    margin-top: 0.25em;
    font-family: monospace;
  }
  .blue { background: linear-gradient(180deg, #051030 0%, #000820 100%); }
  .green { background: linear-gradient(180deg, #052010 0%, #001008 100%); }
  .purple { background: linear-gradient(180deg, #1a0530 0%, #08001a 100%); }
  .progress-overlay {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
  }
  .pill {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border-radius: 999px;
    padding: 0.6em 1.4em; font-size: 0.85rem;
    color: #fff; font-family: monospace;
  }
`;
document.head.appendChild(style);

const app = tosiProductV2(
  { debug: true },

  // Hero — 70vh, claims 200vh of runway (lingers strongly so the title animation is clearly visible)
  tosiProductSectionV2(
    { scroll: 200 },
    div(
      { class: "hero" },
      tosiInterpolator(
        { "data-scroll-animate": true, easing: "ease-in-out" },
        tosiWaypoint({
          progress: 0.0,
          style: { transform: "scale(1) translateY(0px)" },
        }),
        tosiWaypoint({
          progress: 1.0,
          style: { transform: "scale(1.4) translateY(20px)" },
        }),
        h1("tosijs-product")
      ),
      p("Build cinematic product pages with HTML.")
    )
  ),

  // Markdown-style intro — natural height, no extra runway
  div(
    { class: "intro" },
    div(
      { class: "intro-inner" },
      h2("What is this?"),
      p(
        "A small library for scroll-driven product pages. Each section claims a slice of scroll runway; as you scroll, the stack translates so each scene gets its moment, then yields to the next."
      )
    )
  ),

  // Panel A — 100vh, claims 400vh of runway (lingers strongly)
  tosiProductSectionV2(
    { scroll: 400 },
    div(
      { class: "panel blue" },
      h2("Lingering Scene"),
      p("Pinned for 400vh of scroll, then exits. The panel sits motionless while interpolators run; once progress reaches 1 the section scrolls out at 1:1 and the next section takes over."),
      tosiInterpolator(
        { "data-scroll-animate": true, easing: "ease-in-out" },
        tosiWaypoint({
          progress: 0.0,
          style: {
            opacity: 0,
            transform: "translate(-40vw, -25vh) scale(0.4) rotate(-180deg)",
          },
        }),
        tosiWaypoint({
          progress: 0.5,
          style: {
            opacity: 1,
            transform: "translate(0, 25vh) scale(2.2) rotate(0deg)",
          },
        }),
        tosiWaypoint({
          progress: 1.0,
          style: {
            opacity: 0,
            transform: "translate(40vw, -25vh) scale(0.4) rotate(180deg)",
          },
        }),
        div({ class: "progress-overlay" }, div({ class: "pill" }, "✨ interpolated ✨"))
      )
    )
  ),

  // Panel B — 100vh, default scroll = 100vh = 1:1 natural scrolling
  tosiProductSectionV2(
    { scroll: 100 },
    div(
      { class: "panel green" },
      h2("Natural Scroll"),
      p("With scroll=100, this section scrolls at 1:1 — no lingering, no fast-forward.")
    )
  ),

  // Panel C — 100vh, scroll=300 (lingers), demonstrates data-scroll-range
  // for staging multiple animations within a single section.
  tosiProductSectionV2(
    { scroll: 300 },
    div(
      { class: "panel purple" },
      div(
        { class: "feature-list" },
        h2("Staged Reveal"),
        p("Multiple interpolators in one section, each constrained to a sub-range with data-scroll-range."),
        ...["Sticky window", "Stack translation", "Per-section progress", "Sub-range staging"].map(
          (label, i) => {
            const start = 0.2 + i * 0.15;
            const end = start + 0.15;
            return tosiInterpolator(
              {
                "data-scroll-animate": true,
                "data-scroll-range": `${start},${end}`,
                easing: "ease-in-out",
              },
              tosiWaypoint({
                progress: 0.0,
                style: { opacity: 0, transform: "translateX(-40px)" },
              }),
              tosiWaypoint({
                progress: 0.5,
                style: { opacity: 1, transform: "translateX(0px)" },
              }),
              tosiWaypoint({
                progress: 1.0,
                style: { opacity: 1, transform: "translateX(0px)" },
              }),
              div({ class: "feature-row" }, "✓ " + label)
            );
          }
        )
      )
    )
  ),

  // Trailing block — natural flow after the engine releases
  div(
    { class: "intro" },
    div(
      { class: "intro-inner" },
      h2("End of stack"),
      p(
        "After the runway is exhausted, the sticky frame releases and you scroll naturally past the trailing content."
      )
    )
  )
);

document.body.appendChild(app);
