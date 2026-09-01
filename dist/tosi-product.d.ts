import { Component } from "tosijs";
export type ThemeMap = Record<string, string>;
export type ThemeRegistry = Record<string, ThemeMap>;
/** The nearest ancestor `<tosi-product-section>`, or `null` if this element isn't inside one. */
export declare function findEnclosingSection(el: HTMLElement): HTMLElement | null;
/**
 * The nearest ancestor `<tosi-product>` (inclusive of `el` itself), or `null`.
 *
 * This is how an engine decides which animators are *its own*: a nested (follower) engine owns
 * the animators inside it, so the outer engine must skip them rather than drive them twice.
 */
export declare function nearestEnclosingProduct(el: HTMLElement | null): HTMLElement | null;
export declare function rangeProgress(progress: number, rangeStr: string | null): number;
export interface ThemeSource {
    fromName: string;
    toName: string;
    t: number;
}
/**
 * Resolve which theme(s) are in force at `activeIdx`, walking back to the nearest
 * preceding theme-bearing item so non-section interludes (markdown blocks, embed
 * hosts) inherit the most recent section's theme instead of snapping to default.
 * A `theme-from`/`theme-to` pair only interpolates while its own item is active;
 * once we've moved past it, it holds at the to-value.
 */
export declare function resolveThemeSource(items: readonly {
    element: HTMLElement;
}[], activeIdx: number, activeProgress: number, defaultTheme: string): ThemeSource;
export declare class TosiProduct extends Component {
    static initAttributes: {
        direction: string;
        debug: boolean;
    };
    static styleSpec: {
        ":host": {
            display: string;
            position: string;
            width: string;
            background: string;
            color: string;
        };
        ".window": {
            position: string;
            top: string;
            left: string;
            width: string;
            height: string;
            overflow: string;
        };
        ":host([direction=horizontal])": {
            display: string;
            width: string;
        };
        ":host([direction=horizontal]) .window": {
            width: string;
            height: string;
        };
        ".stack": {
            position: string;
            top: string;
            left: string;
            width: string;
            willChange: string;
        };
        ":host([direction=horizontal]) .stack": {
            display: string;
            flexDirection: string;
            width: string;
            height: string;
        };
        ".debug-panel": {
            position: string;
            top: string;
            right: string;
            background: string;
            color: string;
            padding: string;
            fontFamily: string;
            fontSize: string;
            borderRadius: string;
            zIndex: number;
            pointerEvents: string;
            whiteSpace: string;
        };
    };
    content: () => HTMLDivElement[];
    themes: ThemeRegistry;
    defaultTheme: string;
    themeTarget: HTMLElement;
    private _scrollTarget;
    private _stack;
    private _window;
    private _debugPanel;
    private _resizeObserver;
    private _mutationObserver;
    private _items;
    private _totalRunway;
    private _scrollHandler;
    private _rafPending;
    private _isNested;
    private _injectedProgress;
    private _appliedThemeKeys;
    connectedCallback(): void;
    disconnectedCallback(): void;
    setScrollProgress(progress: number): void;
    private _isHorizontal;
    private _viewSize;
    private _scrollPos;
    private _hostStart;
    private _relayout;
    private _scheduleUpdate;
    private _update;
    private _notify;
    private _applyTheme;
}
export declare class TosiProductSection extends Component {
    static initAttributes: {
        scroll: number;
    };
    static styleSpec: {
        ":host": {
            display: string;
            position: string;
            width: string;
        };
    };
    content: () => HTMLSlotElement;
    scrollCallback: ((progress: number, el: HTMLElement) => void) | null;
    setScrollProgress(progress: number): void;
}
export declare class TosiProductHeader extends Component {
    static initAttributes: {
        threshold: number;
    };
    static styleSpec: {
        ":host": {
            position: string;
            top: string;
            left: string;
            right: string;
            zIndex: string;
            transform: string;
            transition: string;
            pointerEvents: string;
        };
        ":host([data-visible=true])": {
            transform: string;
        };
    };
    content: () => HTMLSlotElement;
    private _scrollHandler;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _update;
}
export declare const tosiProduct: import("tosijs").ElementCreator<TosiProduct>;
export declare const tosiProductSection: import("tosijs").ElementCreator<TosiProductSection>;
export declare const tosiProductHeader: import("tosijs").ElementCreator<TosiProductHeader>;
