import { Component } from "tosijs";
export declare class TosiFilmstrip extends Component {
    static initAttributes: {
        src: string;
        cols: number;
        rows: number;
        total: number;
    };
    private _img;
    private _ctx;
    private _lastProgress;
    private _canvas;
    private _loadedSrc;
    private _loadId;
    static styleSpec: {
        ":host": {
            display: string;
            position: string;
            width: string;
            height: string;
        };
        canvas: {
            width: string;
            height: string;
            objectFit: string;
            display: string;
        };
    };
    content: () => HTMLCanvasElement;
    private _parseGrid;
    private load;
    setScrollProgress(progress: number): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): void;
}
export declare const tosiFilmstrip: import("tosijs").ElementCreator<TosiFilmstrip>;
