import { Component } from "tosijs";
export declare class TosiProductSection extends Component {
    scrollCallback: ((progress: number, el: HTMLElement) => void) | null;
    static initAttributes: {
        scroll: number;
        debug: boolean;
        direction: string;
        overflow: boolean;
    };
    private _debugInfo;
    private _scrollTarget;
    private _animators;
    private _observer;
    static styleSpec: {
        ":host": {
            display: string;
            position: string;
            backgroundColor: string;
            color: string;
        };
        ":host([direction=horizontal])": {
            display: string;
        };
        ".tosi-sticky": {
            position: string;
            overflow: string;
            zIndex: number;
            backgroundColor: string;
        };
        ".tosi-debug": {
            position: string;
            top: string;
            left: string;
            background: string;
            color: string;
            padding: string;
            fontFamily: string;
            fontSize: string;
            zIndex: number;
            borderRadius: string;
            pointerEvents: string;
        };
    };
    content: () => HTMLDivElement[];
    private _getAnimators;
    private _invalidateAnimators;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): void;
    private _getScrollPct;
    private _getScrollAmountPx;
    updateProgress(): void;
}
export declare class TosiProduct extends Component {
    static styleSpec: {
        ":host": {
            display: string;
            position: string;
            width: string;
            background: string;
            color: string;
        };
    };
    content: () => HTMLSlotElement;
}
export declare class TosiScrollMapper extends Component {
    scrollCallback: ((progress: number) => void) | null;
    static styleSpec: {
        ":host": {
            display: string;
            width: string;
            height: string;
        };
    };
    content: () => HTMLSlotElement;
    connectedCallback(): void;
    setScrollProgress(progress: number): void;
}
export declare const tosiProduct: import("tosijs").ElementCreator<TosiProduct>;
export declare const tosiProductSection: import("tosijs").ElementCreator<TosiProductSection>;
export declare const tosiScrollMapper: import("tosijs").ElementCreator<TosiScrollMapper>;
