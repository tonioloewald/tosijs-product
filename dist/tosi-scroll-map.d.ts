import { Component, type ComponentAttrs } from "tosijs";
export declare class TosiScrollMap extends Component {
    static initAttributes: {
        easing: string;
    };
    static styleSpec: {
        ":host": {
            display: string;
        };
    };
    content: () => HTMLSlotElement;
    setScrollProgress(progress: number): void;
}
export declare const tosiScrollMap: import("tosijs").ElementCreator<TosiScrollMap>;
export interface TosiScrollMap extends ComponentAttrs<typeof TosiScrollMap.initAttributes> {
}
