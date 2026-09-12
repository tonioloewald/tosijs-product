/*
Hydration bundle for tosijs-product's doc site.

Bundled to IIFE by tosijs-ui/site's build (per `bundleEntry` in the site
config) and loaded by every page. Imports register custom elements; the
`context` assignment exposes our exports to live examples so a `js` block
like `import { tosiProduct } from 'tosijs-product'` resolves at runtime.
*/

import "tosijs-ui";
/*
The DOC-SYSTEM cluster is no longer re-exported from the tosijs-ui barrel
(tosijs-ui#133) — those four modules were 77% of it, which is most of the 1.68MB
-> 0.38MB reduction. So `import "tosijs-ui"` alone no longer registers
<tosi-doc-system>, <tosi-example> or the doc browser, and this site rendered as
the un-hydrated `:not(:defined)` static fallback: no nav, no header, no theme
toggle, no live examples. It looks like a styling regression rather than a
missing import, which is how it reached a release candidate.
*/
import "tosijs-ui/doc-browser";
import "tosijs-ui/doc-system/doc-system";
import "tosijs-ui/live-example";
import * as tosijsProduct from "../src/index";

for (const el of Array.from(
  document.querySelectorAll("tosi-doc-system")
)) {
  (el as any).context = { "tosijs-product": tosijsProduct };
}
