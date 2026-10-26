/*
<tosi-product-header> appears once ITS scroll container passes `threshold` (board #2533).

It used to listen to window scroll only, so inside an inner scroll container (the embed case
`getScrollParent` exists for, and how the doc site scrolls) it never appeared, and on a
horizontal scroller it read the wrong axis.

This appends to the document, which CLAUDE.md warns against for <tosi-product>. The header
is a different element: it registers one scroll listener and nothing that keeps happy-dom's
event loop alive, and each test removes what it added.
*/
import { afterEach, describe, expect, test } from "bun:test";
import "./index";

let fixture: HTMLElement | null = null;
afterEach(() => {
  fixture?.remove();
  fixture = null;
});

function mount(scrollerStyle: string) {
  fixture = document.createElement("div");
  fixture.innerHTML = `<div class="scroller" style="${scrollerStyle}">
    <div style="width: 5000px; height: 5000px">
      <tosi-product-header threshold="50">Header</tosi-product-header>
    </div>
  </div>`;
  document.body.append(fixture);
  return {
    scroller: fixture.querySelector(".scroller") as HTMLElement,
    header: fixture.querySelector("tosi-product-header") as HTMLElement,
  };
}

describe("<tosi-product-header>", () => {
  test("hidden before its container scrolls", () => {
    const { header } = mount("overflow: auto; height: 200px");
    expect(header.dataset.visible).toBe("false");
  });

  test("appears when its inner scroll container passes threshold", () => {
    const { scroller, header } = mount("overflow: auto; height: 200px");
    scroller.scrollTop = 100;
    scroller.dispatchEvent(new Event("scroll"));
    expect(header.dataset.visible).toBe("true");
    scroller.scrollTop = 10;
    scroller.dispatchEvent(new Event("scroll"));
    expect(header.dataset.visible).toBe("false");
  });

  test("a horizontal scroller counts on its own axis", () => {
    const { scroller, header } = mount("overflow-x: auto; width: 200px");
    scroller.scrollLeft = 100;
    scroller.dispatchEvent(new Event("scroll"));
    expect(header.dataset.visible).toBe("true");
  });

  test("not in a scroll container: window scroll, as before", () => {
    const { header } = mount("");
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event("scroll"));
    expect(header.dataset.visible).toBe("false");
    window.scrollTo(0, 100);
    window.dispatchEvent(new Event("scroll"));
    expect(header.dataset.visible).toBe("true");
    window.scrollTo(0, 0);
  });
});
