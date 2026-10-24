/*
The closed set of URLs `<tosi-prism>` may fetch, and the two pure seams that keep it closed.

This is the only code in the library that fetches and executes third-party code, so its two
invariants are tested directly (src/prism.test.ts): every reachable URL has an integrity hash
(fail closed), and the language allowlist answers only about its OWN keys. Both were reverted
by accident once and caught only by review, with tests and build green (board #2511).

Internal: src/index.ts re-exports tosi-prism.ts, not this module, so none of it is public API.
*/

/*
Pinned exactly, not to the floating `1` it used to be, and integrity-checked.

An earlier version of this comment claimed SRI was impractical here because
`loadPrism([...])` builds "a URL per language on demand" and would need a
build-time manifest. That was wrong, and the pre-release review caught it:
`visit()` returns early for any language absent from `LANGUAGE_DEPS`, so the
reachable set is closed — core, seven grammars and one theme, **nine fixed URLs
at a pinned version**. A nine-entry constant, not a manifest.

`LANGUAGE_DEPS` is therefore a security boundary, not just dependency ordering:
it is the allowlist that keeps the URL set closed, and `SUBRESOURCE_INTEGRITY`
below is keyed to exactly those URLs. Widening it — the obvious feature request
is "support any Prism language" — means either adding the hash alongside, or
knowingly giving up integrity checking. Bumping PRISM_VERSION means regenerating
every hash:

  for u in components/prism-{core,markup,css,clike,javascript,typescript,bash,json}.min.js \
           themes/prism-tomorrow.min.css; do
    curl -sfL "https://cdn.jsdelivr.net/npm/prismjs@$VER/$u" |
      openssl dgst -sha384 -binary | openssl base64 -A
  done

**This is a runtime CDN dependency.** A consumer with a strict CSP must allow
`https://cdn.jsdelivr.net` in `script-src` and `style-src`, or skip
`<tosi-prism>`; nothing else in this library loads anything at runtime.
*/
export const PRISM_VERSION = "1.30.0";
export const CDN = `https://cdn.jsdelivr.net/npm/prismjs@${PRISM_VERSION}`;

/** sha384 for every URL this module can reach, keyed by path under `CDN`. */
export const SUBRESOURCE_INTEGRITY: Record<string, string> = {
  "components/prism-core.min.js":
    "sha384-zLRFO4dwowZvh8kzutOb5AWhH7f39HeJp+N7PtHF1SQtTBnifRx0AtmvTYs3F4YV",
  "components/prism-markup.min.js":
    "sha384-HkMr0bZB9kBW4iVtXn6nd35kO/L/dQtkkUBkL9swzTEDMdIe5ExJChVDSnC79aNA",
  "components/prism-css.min.js":
    "sha384-0mV13Neu0xhJFylI+HV43C+XiR13bGSeL7D0/7e6hK7sJgvyvK6HVjeQwmvXTstY",
  "components/prism-clike.min.js":
    "sha384-7LHwxHIDSHTBleLmgDWZbC/IMJsfYfFVOihKhvsrxYW4j47YQcRwZja4ToFE3bA8",
  "components/prism-javascript.min.js":
    "sha384-D44bgYYKvaiDh4cOGlj1dbSDpSctn2FSUj118HZGmZEShZcO2v//Q5vvhNy206pp",
  "components/prism-typescript.min.js":
    "sha384-PeOqKNW/piETaCg8rqKFy+Pm6KEk7e36/5YZE5XO/OaFdO+/Aw3O8qZ9qDPKVUgx",
  "components/prism-bash.min.js":
    "sha384-9WmlN8ABpoFSSHvBGGjhvB3E/D8UkNB9HpLJjBQFC2VSQsM1odiQDv4NbEo+7l15",
  "components/prism-json.min.js":
    "sha384-RhrmFFMb0ZCHImjFMpR/UE3VEtIVTCtNrtKQqXCzqXZNJala02N3UbVhi+qzw3CY",
  "themes/prism-tomorrow.min.css":
    "sha384-wFjoQjtV1y5jVHbt0p35Ui8aV8GVpEZkyF99OXWqP/eNJDU93D3Ugxkoyh6Y2I4A",
};

// Prism's language graph — only the entries we want to surface in docs.
// Each value lists prerequisite languages that must load first.
export const LANGUAGE_DEPS: Record<string, string[]> = {
  markup: [],
  css: [],
  clike: [],
  javascript: ["clike"],
  typescript: ["javascript"],
  bash: [],
  json: [],
};

export const THEME_PATH = "themes/prism-tomorrow.min.css";

/**
 * The integrity hash for a path under `CDN`, or `null` — and `null` means DO NOT FETCH.
 * `Object.hasOwn` for the same reason as `resolveLoadSet`: `SUBRESOURCE_INTEGRITY["constructor"]`
 * is a function, and a truthiness test would hand it to `script.integrity`.
 */
export function integrityFor(path: string): string | null {
  return Object.hasOwn(SUBRESOURCE_INTEGRITY, path)
    ? SUBRESOURCE_INTEGRITY[path]
    : null;
}

/**
 * The script paths `loadPrism(languages)` fetches, in load order: core, then each known
 * grammar after its prerequisites. Unknown languages are dropped silently.
 */
export function resolveLoadSet(languages: string[]): string[] {
  const wanted = new Set<string>();
  const visit = (lang: string) => {
    if (wanted.has(lang)) return;
    /*
    `Object.hasOwn`, not a truthiness test: `LANGUAGE_DEPS["constructor"]` (and `toString`,
    `valueOf`, `__proto__`) inherits a truthy value from Object.prototype, so the old
    `if (!deps) return` let those through the allowlist and on to a
    `prism-constructor.min.js` fetch. This map is the boundary that keeps the URL set
    closed and the SRI table complete; it has to answer about its OWN keys.
    */
    if (!Object.hasOwn(LANGUAGE_DEPS, lang)) return; // unknown language — skip silently
    for (const d of LANGUAGE_DEPS[lang]) visit(d);
    wanted.add(lang);
  };
  for (const lang of languages) visit(lang);
  return [
    "components/prism-core.min.js",
    ...Array.from(wanted, (lang) => `components/prism-${lang}.min.js`),
  ];
}
