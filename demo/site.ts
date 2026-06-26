/*
Hydration bundle for tosijs-product's doc site.

Bundled to IIFE by tosijs-ui/site's build (per `bundleEntry` in the site
config) and loaded by every page. Imports register custom elements; the
`context` assignment exposes our exports to live examples so a `js` block
like `import { tosiProduct } from 'tosijs-product'` resolves at runtime.
*/

import "tosijs-ui";
import * as tosijsProduct from "../src/index";

for (const el of Array.from(
  document.querySelectorAll("tosi-doc-system")
)) {
  (el as any).context = { "tosijs-product": tosijsProduct };
}
