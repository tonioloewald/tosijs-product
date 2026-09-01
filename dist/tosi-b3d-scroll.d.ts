import { Component } from "tosijs";
/**
 * Scroll-driven camera controller for B3d scenes.
 *
 * Place inside a <tosi-b3d> within a <tosi-product-section>.
 * Uses <tosi-waypoint> children to define camera keyframes.
 *
 * Waypoint attributes for ArcRotateCamera: alpha, beta, radius,
 *   target-x, target-y, target-z
 * Waypoint attributes for positional cameras: x, y, z, fov
 *
 * Example:
 *   <tosi-scroll-camera data-scroll-animate easing="ease-in-out">
 *     <tosi-waypoint progress="0" alpha="-1.57" beta="1.2" radius="15"></tosi-waypoint>
 *     <tosi-waypoint progress="1" alpha="4.71" beta="0.8" radius="5"></tosi-waypoint>
 *   </tosi-scroll-camera>
 */
export declare class TosiScrollCamera extends Component {
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
/**
 * Scroll-driven day/night cycle for B3d skybox.
 *
 * Maps scroll progress (0→1) to a timeOfDay range on a sibling
 * <tosi-b3d-skybox> element. Set realtimeScale="0" on the skybox
 * to disable auto-advancement.
 *
 * Example:
 *   <tosi-scroll-time data-scroll-animate from="6" to="18"></tosi-scroll-time>
 */
export declare class TosiScrollTime extends Component {
    static initAttributes: {
        from: number;
        to: number;
    };
    static styleSpec: {
        ":host": {
            display: string;
        };
    };
    content: null;
    setScrollProgress(progress: number): void;
}
/**
 * Scroll-driven animation scrubber for B3d scenes.
 *
 * Scrubs a named BabylonJS AnimationGroup to the frame
 * corresponding to scroll progress (0→1).
 *
 * Example:
 *   <tosi-scroll-animation data-scroll-animate name="DoorOpen"></tosi-scroll-animation>
 */
export declare class TosiScrollAnimation extends Component {
    static initAttributes: {
        name: string;
    };
    static styleSpec: {
        ":host": {
            display: string;
        };
    };
    content: null;
    private _animGroup;
    private _started;
    setScrollProgress(progress: number): void;
    disconnectedCallback(): void;
}
export declare const tosiScrollCamera: import("tosijs").ElementCreator<TosiScrollCamera>;
export declare const tosiScrollTime: import("tosijs").ElementCreator<TosiScrollTime>;
export declare const tosiScrollAnimation: import("tosijs").ElementCreator<TosiScrollAnimation>;
