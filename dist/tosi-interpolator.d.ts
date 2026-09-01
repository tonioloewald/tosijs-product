import { Component } from "tosijs";
export declare class TosiInterpolator extends Component {
    static styleSpec: {
        ":host": {
            display: string;
        };
    };
    setScrollProgress(progress: number): void;
}
export declare class TosiWaypoint extends Component {
    static initAttributes: {
        progress: number;
    };
    static styleSpec: {
        ":host": {
            display: string;
        };
    };
    content: null;
}
export declare const tosiInterpolator: import("tosijs").ElementCreator<TosiInterpolator>;
export declare const tosiWaypoint: import("tosijs").ElementCreator<TosiWaypoint>;
