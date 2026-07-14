import { describe, expect, test } from "bun:test";
import {
  findEnclosingSection,
  nearestEnclosingProduct,
  rangeProgress,
} from "./tosi-product";

// Coverage for embeddability — the behaviour the old demo/embed.html exercised
// by eye: sibling engines on one page, and a nested (follower-mode) engine
// inside a section. The invariant that makes both work is *ownership*: a
// section drives only the animators whose nearest enclosing <tosi-product> is
// its own. Get that wrong and an outer engine fights the nested one for the
// same elements.

/**
 * Build a tree from nested tag names, returning every created element by key.
 * The tree stays DETACHED: connecting a <tosi-product> upgrades it, and its
 * connectedCallback keeps happy-dom's event loop alive so `bun test` never
 * exits. Everything under test here is a pure parentElement walk, so a
 * detached (un-upgraded) tree exercises it exactly the same.
 */
const build = (html: string) => {
  const host = document.createElement("div");
  host.innerHTML = html;
  const at = (sel: string) => host.querySelector(sel) as HTMLElement;
  return { host, at };
};

describe("nearestEnclosingProduct", () => {
  test("finds the engine that owns an animator", () => {
    const { at } = build(`
      <tosi-product id="outer">
        <tosi-product-section id="s">
          <div id="anim" data-scroll-animate></div>
        </tosi-product-section>
      </tosi-product>`);
    expect(nearestEnclosingProduct(at("#anim"))).toBe(at("#outer"));
  });

  test("returns the element itself when it is a product", () => {
    const { at } = build(`<tosi-product id="p"></tosi-product>`);
    expect(nearestEnclosingProduct(at("#p"))).toBe(at("#p"));
  });

  test("returns null outside any engine, and for null", () => {
    const { at } = build(`<div id="loose" data-scroll-animate></div>`);
    expect(nearestEnclosingProduct(at("#loose"))).toBe(null);
    expect(nearestEnclosingProduct(null)).toBe(null);
  });

  test("sibling engines own their own animators, never each other's", () => {
    const { at } = build(`
      <div>
        <tosi-product id="a">
          <tosi-product-section><div id="anim-a" data-scroll-animate></div></tosi-product-section>
        </tosi-product>
        <tosi-product id="b">
          <tosi-product-section><div id="anim-b" data-scroll-animate></div></tosi-product-section>
        </tosi-product>
      </div>`);
    expect(nearestEnclosingProduct(at("#anim-a"))).toBe(at("#a"));
    expect(nearestEnclosingProduct(at("#anim-b"))).toBe(at("#b"));
    expect(nearestEnclosingProduct(at("#anim-a"))).not.toBe(at("#b"));
  });

  test("a nested engine's animator belongs to the INNER engine, not the outer", () => {
    // The core follower-mode invariant. The outer section's querySelectorAll
    // reaches #inner-anim (it is a descendant), so the outer engine MUST use
    // ownership to skip it — otherwise both engines write --local-progress to
    // the same element and the nested narrative stutters.
    const { at } = build(`
      <tosi-product id="outer">
        <tosi-product-section id="outer-sec">
          <div id="outer-anim" data-scroll-animate></div>
          <tosi-product id="inner">
            <tosi-product-section id="inner-sec">
              <div id="inner-anim" data-scroll-animate></div>
            </tosi-product-section>
          </tosi-product>
        </tosi-product-section>
      </tosi-product>`);

    expect(nearestEnclosingProduct(at("#outer-anim"))).toBe(at("#outer"));
    expect(nearestEnclosingProduct(at("#inner-anim"))).toBe(at("#inner"));

    // Reproduce the ownership filter the outer section applies, and assert it
    // drops exactly the nested engine's animator.
    const outerSec = at("#outer-sec");
    const owned = Array.from(
      outerSec.querySelectorAll("[data-scroll-animate], [data-scroll-range]")
    ).filter(
      (el) =>
        nearestEnclosingProduct(el.parentElement as HTMLElement) ===
        outerSec.closest("tosi-product")
    );
    expect(owned).toEqual([at("#outer-anim")]);
  });

  test("the nested engine itself is owned by the outer engine", () => {
    // It is marked data-scroll-animate="tosi-product" and driven by the outer
    // section's pin progress — so ownership must resolve to the OUTER product,
    // which is why the filter walks up from parentElement, not from the element.
    const { at } = build(`
      <tosi-product id="outer">
        <tosi-product-section>
          <tosi-product id="inner" data-scroll-animate="tosi-product"></tosi-product>
        </tosi-product-section>
      </tosi-product>`);
    const inner = at("#inner");
    expect(nearestEnclosingProduct(inner.parentElement as HTMLElement)).toBe(
      at("#outer")
    );
  });
});

describe("findEnclosingSection", () => {
  test("a nested product finds the section that pins it (follower mode)", () => {
    const { at } = build(`
      <tosi-product id="outer">
        <tosi-product-section id="sec">
          <tosi-product id="inner"></tosi-product>
        </tosi-product-section>
      </tosi-product>`);
    expect(findEnclosingSection(at("#inner"))).toBe(at("#sec"));
  });

  test("a top-level product has no enclosing section (drives document scroll)", () => {
    const { at } = build(`<tosi-product id="outer"></tosi-product>`);
    expect(findEnclosingSection(at("#outer"))).toBe(null);
  });

  test("looks strictly upward — a section child does not count", () => {
    const { at } = build(`
      <tosi-product id="p">
        <tosi-product-section id="sec"></tosi-product-section>
      </tosi-product>`);
    expect(findEnclosingSection(at("#p"))).toBe(null);
  });
});

describe("rangeProgress", () => {
  test("defaults to the full 0->1 range", () => {
    expect(rangeProgress(0, null)).toBe(0);
    expect(rangeProgress(0.42, null)).toBe(0.42);
    expect(rangeProgress(1, "0,1")).toBe(1);
  });

  test("maps a sub-range onto 0->1 and clamps outside it", () => {
    expect(rangeProgress(0.25, "0.5,1")).toBe(0); // before the range
    expect(rangeProgress(0.5, "0.5,1")).toBe(0); // at its start
    expect(rangeProgress(0.75, "0.5,1")).toBe(0.5); // halfway through
    expect(rangeProgress(1, "0.5,1")).toBe(1); // at its end
  });

  test("handles a mid-runway window", () => {
    expect(rangeProgress(0.4, "0.25,0.75")).toBeCloseTo(0.3, 10);
    expect(rangeProgress(0.9, "0.25,0.75")).toBe(1); // past it -> pinned at 1
  });

  test("a degenerate range acts as a step", () => {
    // end <= start: nothing to interpolate, so it flips at `end`.
    expect(rangeProgress(0.49, "0.5,0.5")).toBe(0);
    expect(rangeProgress(0.5, "0.5,0.5")).toBe(1);
    expect(rangeProgress(0.9, "0.8,0.2")).toBe(1);
  });
});
