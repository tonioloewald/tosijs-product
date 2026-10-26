/*
Every element registers under its documented tag, and its factory makes that element.

The tag names are public API: README.md and every adopter's page write them as HTML. The
migration off the deprecated `elementCreator({ tag })` (board #2535) moved each one to a
`static preferredTagName`, and tosijs falls back to an anonymous tag when a name is missing
or illegal, so a typo there would ship silently. This pins the names.

Elements are created detached and never appended (see CLAUDE.md: connecting a
<tosi-product> hangs `bun test`).
*/
import { describe, expect, test } from "bun:test";
import * as api from "./index";

const TAGS: [string, string, string][] = [
  ["TosiProduct", "tosiProduct", "tosi-product"],
  ["TosiProductSection", "tosiProductSection", "tosi-product-section"],
  ["TosiProductHeader", "tosiProductHeader", "tosi-product-header"],
  ["TosiFilmstrip", "tosiFilmstrip", "tosi-filmstrip"],
  ["TosiInterpolator", "tosiInterpolator", "tosi-interpolator"],
  ["TosiWaypoint", "tosiWaypoint", "tosi-waypoint"],
  ["TosiScrollCamera", "tosiScrollCamera", "tosi-scroll-camera"],
  ["TosiScrollTime", "tosiScrollTime", "tosi-scroll-time"],
  ["TosiScrollAnimation", "tosiScrollAnimation", "tosi-scroll-animation"],
  ["TosiScrollMap", "tosiScrollMap", "tosi-scroll-map"],
  ["TosiPrism", "tosiPrism", "tosi-prism"],
];

describe("element registration", () => {
  test.each(TAGS)("%s is <%s>", (className, factoryName, tag) => {
    const Class = (api as any)[className];
    const factory = (api as any)[factoryName];
    expect(customElements.get(tag)).toBe(Class);
    const el = factory();
    expect(el.tagName.toLowerCase()).toBe(tag);
    expect(el).toBeInstanceOf(Class);
  });

  test("no other tosi-* element is registered by this package", () => {
    const ours = new Set(TAGS.map(([c]) => (api as any)[c]));
    const classes = Object.values(api).filter(
      (v) =>
        typeof v === "function" && (v as any).prototype instanceof HTMLElement,
    );
    expect(new Set(classes)).toEqual(ours);
  });
});
