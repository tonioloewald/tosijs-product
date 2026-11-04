# `<tosi-prism>`

Lazy-loads PrismJS (from jsDelivr) to syntax-highlight its own text content. Set the language with
**`language`** (default `markup`). Unlike a scroll scene it needs no engine — drop it anywhere.

<tosi-prism language="javascript">
const app = tosiProduct(
  tosiProductSection({ scroll: 200 })
)
app.themes = { midnight: { '--bg': '#08081a', '--fg': '#f0f0f5' } }
app.defaultTheme = 'midnight'
</tosi-prism>

## Attributes

- **`language`** — Prism language id (`markup`, `javascript`, `css`, `bash`, …). Default `markup`.

## Helpers

The module also exports `loadPrism` / `highlightCodeBlocks` for post-processing other rendered code
(e.g. markdown output):

```typescript
import { loadPrism, highlightCodeBlocks } from 'tosijs-product'
await loadPrism(['javascript', 'css'])
highlightCodeBlocks(document.querySelector('.rendered-markdown'))
```

> Renamed from `tosi-code` in v0.6.x to avoid clashing with tosijs-ui's `<tosi-code>` code editor.

See also [`<tosi-product>`](/tosi-product/).
