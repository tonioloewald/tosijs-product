/*
Workaround for a tosijs-ui live-example bug (tosijs-ui board #3820; remove this
module once the fix ships).

`insertExamples` collects `[class*="language-"]` anywhere in the page and turns
the live ones into `<tosi-example>`s. The static highlighter (Prism) also marks
CSS embedded in markup — a `<style>` body, a `style="…"` attribute — with a
`token language-css` span inside the code block. Those spans matched, so the
README's Pure HTML sample hydrated as a code block broken up by empty live-CSS
editors. Dropping the `language-*` class from token spans makes them plain
highlighted text again; real fences carry it on the `<code>`, which we leave
alone.

Imported FIRST by demo/site.ts so it runs before the doc system upgrades and
inserts examples.
*/

for (const span of Array.from(
  document.querySelectorAll('pre code .token[class*="language-"]'),
)) {
  for (const cls of Array.from(span.classList)) {
    if (cls.startsWith("language-")) span.classList.remove(cls);
  }
}
