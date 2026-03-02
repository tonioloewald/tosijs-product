import { Component } from "tosijs";

export const interpolateStrings = (a: string, b: string, t: number) => {
  const numRegex = /-?\d*\.?\d+/g;
  const aNums = Array.from(a.matchAll(numRegex));
  const bNums = Array.from(b.matchAll(numRegex));

  // If we have matching numbers, interpolate them
  if (aNums.length > 0 && aNums.length === bNums.length) {
    let result = "";
    let lastIndex = 0;
    for (let i = 0; i < aNums.length; i++) {
      const aMatch = aNums[i];
      const bMatch = bNums[i];
      result += a.substring(lastIndex, aMatch.index);

      const n1 = parseFloat(aMatch[0]);
      const n2 = parseFloat(bMatch[0]);
      const interpolated = n1 + (n2 - n1) * t;

      // Format number to avoid scientific notation and keep it clean
      let numStr = interpolated.toFixed(4);
      if (numStr.includes(".")) {
        numStr = numStr.replace(/0+$/, "").replace(/\.$/, "");
      }
      result += numStr;

      lastIndex = aMatch.index! + aMatch[0].length;
    }
    result += a.substring(lastIndex);
    return result;
  }

  // Color fallback using modern CSS color-mix
  const isColor = (s: string) =>
    s.startsWith("#") ||
    s.startsWith("rgb") ||
    s.startsWith("hsl") ||
    ["red", "blue", "white", "black", "transparent"].includes(s);
  if (isColor(a) && isColor(b)) {
    return `color-mix(in srgb, ${a} ${Math.round((1 - t) * 100)}%, ${b})`;
  }

  // Step fallback
  return t < 0.5 ? a : b;
};

export class TosiInterpolator extends Component {
  static styleSpec = {
    ":host": {
      display: "contents", // don't affect layout
    },
  };

  setScrollProgress(progress: number) {
    const waypointsNodes = Array.from(this.querySelectorAll("tosi-waypoint"));
    if (waypointsNodes.length === 0) return;

    // Parse waypoints
    const waypoints = waypointsNodes
      .map((w: any) => {
        const styles: Record<string, string> = {};
        const htmlEl = w as HTMLElement;

        // Get styles from both attribute and direct style property
        for (let i = 0; i < htmlEl.style.length; i++) {
          const prop = htmlEl.style[i];
          styles[prop] = htmlEl.style.getPropertyValue(prop);
        }

        return {
          progress: Number(w.getAttribute("progress") || 0),
          styles,
        };
      })
      .sort((a, b) => a.progress - b.progress);

    // Find bounding waypoints
    let wp1 = waypoints[0];
    let wp2 = waypoints[waypoints.length - 1];
    let t = 0;

    if (progress <= wp1.progress) {
      wp2 = wp1;
      t = 0;
    } else if (progress >= wp2.progress) {
      wp1 = wp2;
      t = 1;
    } else {
      for (let i = 0; i < waypoints.length - 1; i++) {
        if (
          progress >= waypoints[i].progress &&
          progress <= waypoints[i + 1].progress
        ) {
          wp1 = waypoints[i];
          wp2 = waypoints[i + 1];
          const rawT =
            (progress - wp1.progress) / (wp2.progress - wp1.progress);

          const easing = this.getAttribute("easing");
          if (easing === "ease-in-out") {
            t = rawT < 0.5 ? 2 * rawT * rawT : -1 + (4 - 2 * rawT) * rawT;
          } else {
            t = rawT; // linear by default
          }
          break;
        }
      }
    }

    // Interpolate styles
    const currentStyles: Record<string, string> = {};

    // We only interpolate properties defined in wp1
    for (const prop in wp1.styles) {
      const val1 = wp1.styles[prop];
      const val2 = wp2.styles[prop] || val1;
      currentStyles[prop] = interpolateStrings(val1, val2, t);
    }

    // Apply to all non-waypoint children
    const targets = Array.from(this.children).filter(
      (c) => c.tagName !== "TOSI-WAYPOINT"
    );
    targets.forEach((target) => {
      const el = target as HTMLElement;
      for (const prop in currentStyles) {
        el.style.setProperty(prop, currentStyles[prop]);
      }
    });
  }
}

export class TosiWaypoint extends Component {
  static initAttributes = {
    progress: 0,
  };
  content = null;
}

export const tosiInterpolator = TosiInterpolator.elementCreator({
  tag: "tosi-interpolator",
});
export const tosiWaypoint = TosiWaypoint.elementCreator({
  tag: "tosi-waypoint",
});
