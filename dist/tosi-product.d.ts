import { Component } from "tosijs";
export type ThemeMap = Record<string, string>;
export type ThemeRegistry = Record<string, ThemeMap>;
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
