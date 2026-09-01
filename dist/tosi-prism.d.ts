import { Component } from "tosijs";
/**
 * Lazy-load PrismJS core + the requested grammars from jsDelivr.
 * Safe to call repeatedly; each script + theme is fetched at most once.
 */
export declare function loadPrism(languages?: string[]): Promise<void>;
/**
 * Walk `root` for `<pre><code class="language-…">` blocks (the shape Marked
 * emits) and replace each block's contents with Prism-highlighted markup.
 * Idempotent: re-running on an already-highlighted block is a no-op as long
 * as the language hasn't changed.
 */
export declare function highlightCodeBlocks(root: ParentNode): Promise<void>;
/**
 * `<tosi-prism>` — a standalone code block. Renames the v0.5.x `<tosi-code>`
 * component to avoid clashing with `tosijs-ui`'s code editor (which uses
 * `tosi-code`). Behavior is unchanged: lazy-load Prism, syntax-highlight
 * text content into `<pre><code>`.
 */
export declare class TosiPrism extends Component {
    static initAttributes: {
        language: string;
    };
    static lightStyleSpec: {
        ":host": {
            display: string;
        };
        ":host pre": {
            background: string;
            border: string;
            borderRadius: string;
            padding: string;
            fontSize: string;
            lineHeight: number;
            maxWidth: string;
            overflowX: string;
            backdropFilter: string;
            margin: string;
            textAlign: string;
        };
        ":host code": {
            fontFamily: string;
            whiteSpace: string;
        };
    };
    content: null;
    connectedCallback(): void;
    private _highlight;
}
export declare const tosiPrism: import("tosijs").ElementCreator<TosiPrism>;
