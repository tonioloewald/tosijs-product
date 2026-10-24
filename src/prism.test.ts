import { describe, expect, test } from "bun:test";
import {
  LANGUAGE_DEPS,
  SUBRESOURCE_INTEGRITY,
  THEME_PATH,
  integrityFor,
  resolveLoadSet,
} from "./prism-sources";

const PROTOTYPE_KEYS = [
  "constructor",
  "toString",
  "valueOf",
  "hasOwnProperty",
  "__proto__",
];

describe("tosi-prism's closed URL set", () => {
  const reachable = [THEME_PATH, ...resolveLoadSet(Object.keys(LANGUAGE_DEPS))];

  test("every reachable URL has an integrity hash", () => {
    for (const path of reachable) expect(integrityFor(path)).not.toBeNull();
  });

  test("the integrity table names exactly the reachable URLs", () => {
    expect(new Set(Object.keys(SUBRESOURCE_INTEGRITY))).toEqual(
      new Set(reachable),
    );
  });

  test("hashes are well-formed sha384", () => {
    for (const hash of Object.values(SUBRESOURCE_INTEGRITY)) {
      expect(hash).toMatch(/^sha384-[A-Za-z0-9+/]{64}$/);
    }
  });

  test("a path outside the table gets no hash, so it is never fetched", () => {
    expect(integrityFor("components/prism-python.min.js")).toBeNull();
    for (const key of PROTOTYPE_KEYS) expect(integrityFor(key)).toBeNull();
  });
});

describe("resolveLoadSet", () => {
  test("core first, then prerequisites before dependents", () => {
    expect(resolveLoadSet(["typescript"])).toEqual([
      "components/prism-core.min.js",
      "components/prism-clike.min.js",
      "components/prism-javascript.min.js",
      "components/prism-typescript.min.js",
    ]);
  });

  test("each grammar loads once", () => {
    expect(resolveLoadSet(["javascript", "typescript", "clike"])).toEqual(
      resolveLoadSet(["typescript"]),
    );
  });

  test("unknown languages are dropped", () => {
    expect(resolveLoadSet(["python", "markup"])).toEqual([
      "components/prism-core.min.js",
      "components/prism-markup.min.js",
    ]);
  });

  test("Object.prototype keys are not languages", () => {
    expect(resolveLoadSet(PROTOTYPE_KEYS)).toEqual([
      "components/prism-core.min.js",
    ]);
  });
});
