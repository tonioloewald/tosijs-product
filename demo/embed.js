// ../tosijs/dist/module.js
function n(E) {
  if (E == null || typeof E !== "object")
    return E;
  if (E instanceof Set)
    return new Set(E);
  else if (Array.isArray(E))
    return E.map(n);
  let M = {};
  for (let L in E) {
    let f = E[L];
    if (E != null && typeof E === "object")
      M[L] = n(f);
    else
      M[L] = f;
  }
  return M;
}
var wE = "-xin-data";
var p = `.${wE}`;
var vE = "-xin-event";
var uE = `.${vE}`;
var m = Symbol.for("xin-path");
var r = Symbol.for("xin-value");
var IM = "xinObserve";
var BM = "xinBind";
var _M = "xinOn";
var jE = Symbol.for("tosi-accessor");
var ME = Symbol.for("tosi-take");
var QE = Symbol("list-binding");
var o = Symbol("list-instance");
var cE = new Map;
function SM(E, M) {
  let L = cE.get(E);
  if (L === undefined)
    L = new Set, cE.set(E, L);
  L.add(M);
}
function NM(E) {
  return cE.get(E);
}
var kM = new Set;
function R(E, M) {
  if (!kM.has(E))
    console.warn(M), kM.add(E);
}
function gE(E, M) {
  let L = false;
  return (...f) => {
    if (!L)
      console.warn(M), L = true;
    return E(...f);
  };
}
var j = (E) => {
  return E && E[m] || undefined;
};
function C(E) {
  if (typeof E === "object" && E !== null) {
    let M = E[r];
    return M !== undefined ? M : E;
  }
  return E;
}
var RL = gE(j, "xinPath is deprecated. Use tosiPath instead.");
var kL = gE(C, "xinValue is deprecated. Use tosiValue instead.");
var EE = new WeakMap;
var b = new WeakMap;
var LE = (E) => {
  let M = E.cloneNode();
  if (M instanceof Element) {
    let L = b.get(E), f = EE.get(E);
    if (L != null)
      b.set(M, n(L));
    if (f != null)
      EE.set(M, n(f));
  }
  for (let L of Array.from(E instanceof HTMLTemplateElement ? E.content.childNodes : E.childNodes))
    if (L instanceof Element || L instanceof DocumentFragment)
      M.appendChild(LE(L));
    else
      M.appendChild(L.cloneNode());
  return M;
};
var fE = { debug: false, perf: false };
var IL = (E) => {
  try {
    return JSON.stringify(E);
  } catch (M) {
    return "{has circular references}";
  }
};
var dE = (...E) => Error(E.map(IL).join(" "));
var BL = () => new Date(parseInt("1000000000", 36) + Date.now()).valueOf().toString(36).slice(1);
var _L = 0;
var SL = () => (parseInt("10000", 36) + ++_L).toString(36).slice(-5);
var iE = () => BL() + SL();
var hE = Symbol("delete");
var PM = Symbol("new-object");
var nE = Symbol("automatic-index");
function mM(E) {
  if (E === "")
    return [];
  if (Array.isArray(E))
    return E;
  else {
    let M = [];
    while (E.length > 0) {
      let L = E.search(/\[[^\]]+\]/);
      if (L === -1) {
        M.push(E.split("."));
        break;
      } else {
        let f = E.slice(0, L);
        if (E = E.slice(L), f !== "")
          M.push(f.split("."));
        if (L = E.indexOf("]") + 1, M.push(E.slice(1, L - 1)), E.slice(L, L + 1) === ".")
          L += 1;
        E = E.slice(L);
      }
    }
    return M;
  }
}
var h = new WeakMap;
function bM(E, M) {
  if (h.get(E) === undefined)
    h.set(E, {});
  if (h.get(E)[M] === undefined)
    h.get(E)[M] = {};
  let L = h.get(E)[M];
  if (M === "_auto_")
    E.forEach((f, H) => {
      if (f[nE] === undefined)
        f[nE] = iE();
      L[f[nE] + ""] = H;
    });
  else
    E.forEach((f, H) => {
      L[V(f, M) + ""] = H;
    });
  return L;
}
function NL(E, M) {
  if (h.get(E) === undefined || h.get(E)[M] === undefined)
    return bM(E, M);
  else
    return h.get(E)[M];
}
function xL(E, M, L) {
  L = L + "";
  let f = NL(E, M)[L];
  if (f === undefined || V(E[f], M) + "" !== L)
    f = bM(E, M)[L];
  return f;
}
function yL(E, M, L) {
  if (E[M] === undefined && L !== undefined)
    E[M] = L;
  return E[M];
}
function cM(E, M, L, f) {
  let H = M !== "" ? xL(E, M, L) : L;
  if (f === hE)
    return E.splice(H, 1), h.delete(E), Symbol("deleted");
  else if (f === PM) {
    if (M === "" && E[H] === undefined)
      E[H] = {};
  } else if (f !== undefined)
    if (H !== undefined)
      E[H] = f;
    else if (M !== "" && V(f, M) + "" === L + "")
      E.push(f), H = E.length - 1;
    else
      throw Error(`byIdPath insert failed at [${M}=${L}]`);
  return E[H];
}
function xM(E) {
  if (!Array.isArray(E))
    throw dE("setByPath failed: expected array, found", E);
}
function yM(E) {
  if (E == null || !(E instanceof Object))
    throw dE("setByPath failed: expected Object, found", E);
}
function V(E, M) {
  let L = mM(M), f = E, H, $, J, Q;
  for (H = 0, $ = L.length;f !== undefined && H < $; H++) {
    let Z = L[H];
    if (Array.isArray(Z))
      for (J = 0, Q = Z.length;f !== undefined && J < Q; J++) {
        let Y = Z[J];
        f = f[Y];
      }
    else if (f.length === 0) {
      if (f = f[Number(Z.slice(1))], Z[0] !== "=")
        return;
    } else if (Z.includes("=")) {
      let [Y, ...F] = Z.split("=");
      f = cM(f, Y, F.join("="));
    } else
      J = parseInt(Z, 10), f = f[J];
  }
  return f;
}
function l(E, M, L) {
  let f = E;
  if (M === "")
    throw Error("setByPath cannot be used to set the root object");
  let H = mM(M);
  while (f != null && H.length > 0) {
    let $ = H.shift();
    if (typeof $ === "string") {
      let J = $.indexOf("=");
      if (J > -1) {
        if (J === 0)
          yM(f);
        else
          xM(f);
        let Q = $.slice(0, J), Z = $.slice(J + 1);
        if (f = cM(f, Q, Z, H.length > 0 ? PM : L), H.length === 0)
          return true;
      } else {
        xM(f);
        let Q = parseInt($, 10);
        if (H.length > 0)
          f = f[Q];
        else {
          if (L !== hE) {
            if (f[Q] === L)
              return false;
            f[Q] = L;
          } else
            f.splice(Q, 1);
          return true;
        }
      }
    } else if (Array.isArray($) && $.length > 0) {
      yM(f);
      while ($.length > 0) {
        let J = $.shift();
        if ($.length > 0 || H.length > 0)
          f = yL(f, J, $.length > 0 ? {} : []);
        else {
          if (L !== hE) {
            if (f[J] === L)
              return false;
            f[J] = L;
          } else {
            if (!Object.prototype.hasOwnProperty.call(f, J))
              return false;
            delete f[J];
          }
          return true;
        }
      }
    } else
      throw Error(`setByPath failed, bad path ${M}`);
  }
  throw Error(`setByPath(${E}, ${M}, ${L}) failed`);
}
var T = {};
var sE = null;
var vM = (E) => {
  sE = E;
};
var GE = () => {
  if (sE === null)
    throw Error("xin proxy not initialized");
  return sE;
};
var pE = null;
var rE = null;
var uM = (E, M) => {
  pE = E, rE = M;
};
var gM = () => {
  if (pE === null)
    throw Error("bind not initialized");
  return pE;
};
var dM = () => {
  if (rE === null)
    throw Error("on not initialized");
  return rE;
};
var nM = Symbol("observer should be removed");
var VE = [];
var YE = [];
var oE = false;
var lE;
var tE;
function PL(E, M, L, f) {
  let H = NM(E);
  if (H === undefined)
    return [];
  let $ = [];
  for (let J of H) {
    let Q = V(L, J);
    if (Q !== undefined)
      $.push(`${E}[${J}=${Q}]${f}`);
  }
  return $;
}

class hM {
  description;
  test;
  callback;
  constructor(E, M) {
    let L = typeof M === "string" ? `"${M}"` : `function ${M.name}`, f;
    if (typeof E === "string")
      this.test = (H) => typeof H === "string" && H !== "" && (E.startsWith(H) || H.startsWith(E)), f = `test = "${E}"`;
    else if (E instanceof RegExp)
      this.test = E.test.bind(E), f = `test = "${E.toString()}"`;
    else if (E instanceof Function)
      this.test = E, f = `test = function ${E.name}`;
    else
      throw Error("expect listener test to be a string, RegExp, or test function");
    if (this.description = `${f}, ${L}`, typeof M === "function")
      this.callback = M;
    else
      throw Error("expect callback to be a path or function");
    VE.push(this);
  }
}
var mL = () => {
  if (fE.perf)
    console.time("xin async update");
  let E = Array.from(YE);
  YE.length = 0, oE = false;
  for (let M of E)
    VE.filter((L) => {
      let f;
      try {
        f = L.test(M);
      } catch (H) {
        throw Error(`Listener ${L.description} threw "${H}" at "${M}"`);
      }
      if (f === nM)
        return HE(L), false;
      return f;
    }).forEach((L) => {
      let f;
      try {
        f = L.callback(M);
      } catch (H) {
        console.error(`Listener ${L.description} threw "${H}" handling "${M}"`);
      }
      if (f === nM)
        HE(L);
    });
  if (typeof tE === "function")
    tE();
  if (fE.perf)
    console.timeEnd("xin async update");
};
var N = (E) => {
  let M = typeof E === "string" ? E : j(E);
  if (M === undefined)
    throw console.error("touch was called on an invalid target", E), Error("touch was called on an invalid target");
  if (oE === false)
    lE = new Promise((f) => {
      tE = f;
    }), oE = setTimeout(mL);
  if (YE.find((f) => M.startsWith(f)) == null)
    YE.push(M);
  let L = M.match(/^(.+)\[(\d+)\](.*)$/);
  if (L !== null) {
    let [, f, H, $] = L, J = parseInt(H, 10), Q = V(T, `${f}[${J}]`);
    if (Q != null) {
      let Z = PL(f, J, Q, $);
      for (let Y of Z)
        if (YE.find((F) => Y.startsWith(F)) == null)
          YE.push(Y);
    }
  }
};
var i = (E, M) => {
  return new hM(E, M);
};
var HE = (E) => {
  let M = VE.indexOf(E);
  if (M > -1)
    VE.splice(M, 1);
  else
    throw Error("unobserve failed, listener not found");
};
var aE = (E, M) => {
  let L = new Event(M);
  E.dispatchEvent(L);
};
var sM = (E) => {
  if (E instanceof HTMLInputElement)
    return E.type;
  else if (E instanceof HTMLSelectElement && E.hasAttribute("multiple"))
    return "multi-select";
  else
    return "other";
};
var pM = (E, M) => {
  switch (sM(E)) {
    case "radio":
      E.checked = E.value === M;
      break;
    case "checkbox":
      E.checked = !!M;
      break;
    case "date":
      E.valueAsDate = new Date(M);
      break;
    case "multi-select":
      for (let L of Array.from(E.querySelectorAll("option")))
        L.selected = M[L.value];
      break;
    default:
      E.value = M;
  }
};
var rM = (E) => {
  switch (sM(E)) {
    case "radio": {
      let M = E.parentElement?.querySelector(`[name="${E.name}"]:checked`);
      return M != null ? M.value : null;
    }
    case "checkbox":
      return E.checked;
    case "date":
      return E.valueAsDate?.toISOString();
    case "multi-select":
      return Array.from(E.querySelectorAll("option")).reduce((M, L) => {
        return M[L.value] = L.selected, M;
      }, {});
    default:
      return E.value;
  }
};
var { ResizeObserver: iM } = globalThis;
var WE = iM != null ? new iM((E) => {
  for (let M of E) {
    let L = M.target;
    aE(L, "resize");
  }
}) : { observe() {}, unobserve() {} };
var eE = (E, M, L = true) => {
  if (E != null && M != null)
    if (typeof M === "string")
      E.textContent = M;
    else if (Array.isArray(M))
      M.forEach((f) => {
        E.append(f instanceof Node && L ? LE(f) : f);
      });
    else if (M instanceof Node)
      E.append(L ? LE(M) : M);
    else
      throw Error("expect text content or document node");
};
var FE = (E, M = 250) => {
  let L, f = Date.now() - M, H = false;
  return (...$) => {
    if (clearTimeout(L), L = setTimeout(() => {
      E(...$), f = Date.now();
    }, M), !H && Date.now() - f >= M) {
      H = true;
      try {
        E(...$), f = Date.now();
      } finally {
        H = false;
      }
    }
  };
};
var TE = { value: { toDOM: pM, fromDOM(E) {
  return rM(E);
} }, text: { toDOM(E, M) {
  E.textContent = M;
} }, enabled: { toDOM(E, M) {
  E.disabled = !M;
} }, disabled: { toDOM(E, M) {
  E.disabled = Boolean(M);
} }, list: { toDOM(E, M, L) {
  DE(E, M, L).update(M);
} } };
function P(E) {
  return E.replace(/[A-Z]/g, (M) => {
    return `-${M.toLocaleLowerCase()}`;
  });
}
function EM(E) {
  return E.replace(/-([a-z])/g, (M, L) => {
    return L.toLocaleUpperCase();
  });
}
var bL = 180 / Math.PI;
var cL = Math.PI / 180;
function c(E, M, L) {
  return L < E ? NaN : M < E ? E : M > L ? L : M;
}
function s(E, M, L, f = true) {
  if (f)
    L = c(0, L, 1);
  return L * (M - E) + E;
}
function MM(E, M = document.body) {
  let L = getComputedStyle(M);
  if (E.endsWith(")") && E.startsWith("var("))
    E = E.slice(4, -1);
  return L.getPropertyValue(E).trim();
}
var uL = (E, M, L) => {
  return (0.299 * E + 0.587 * M + 0.114 * L) / 255;
};
var JE = (E) => ("00" + Math.round(Number(E)).toString(16)).slice(-2);

class oM {
  h;
  s;
  l;
  constructor(E, M, L) {
    E /= 255, M /= 255, L /= 255;
    let f = Math.max(E, M, L), H = f - Math.min(E, M, L), $ = H !== 0 ? f === E ? (M - L) / H : f === M ? 2 + (L - E) / H : 4 + (E - M) / H : 0;
    this.h = 60 * $ < 0 ? 60 * $ + 360 : 60 * $, this.s = H !== 0 ? f <= 0.5 ? H / (2 * f - H) : H / (2 - (2 * f - H)) : 0, this.l = (2 * f - H) / 2;
  }
}
var t = globalThis.document !== undefined ? globalThis.document.createElement("span") : undefined;
if (t)
  t.style.display = "none";

class X {
  r;
  g;
  b;
  a;
  static fromVar(E, M = document.body) {
    return X.fromCss(MM(E, M));
  }
  static fromCss(E) {
    let M = E.match(/^#([0-9a-fA-F]+)$/);
    if (M) {
      let Z = M[1], Y = (F, z) => parseInt(Z.slice(F, F + z), 16);
      if (Z.length === 3 || Z.length === 4) {
        let F = (z) => Y(z, 1) * 17;
        return new X(F(0), F(1), F(2), Z.length === 4 ? F(3) / 255 : 1);
      }
      if (Z.length === 6 || Z.length === 8)
        return new X(Y(0, 2), Y(2, 2), Y(4, 2), Z.length === 8 ? Y(6, 2) / 255 : 1);
    }
    let L = E;
    if (t instanceof HTMLSpanElement)
      t.style.color = "black", t.style.color = E, document.body.appendChild(t), L = getComputedStyle(t).color, t.remove();
    let [f, H, $, J] = L.match(/[\d.]+/g) || ["0", "0", "0", "0"], Q = L.startsWith("color(srgb") ? 255 : 1;
    return new X(Number(f) * Q, Number(H) * Q, Number($) * Q, J == null ? 1 : Number(J));
  }
  static fromHsl(E, M, L, f = 1) {
    let H, $, J;
    if (M === 0)
      H = $ = J = L;
    else {
      let Z = (G, B, W) => {
        if (W < 0)
          W += 1;
        if (W > 1)
          W -= 1;
        if (W < 0.16666666666666666)
          return G + (B - G) * 6 * W;
        if (W < 0.5)
          return B;
        if (W < 0.6666666666666666)
          return G + (B - G) * (0.6666666666666666 - W) * 6;
        return G;
      }, Y = L < 0.5 ? L * (1 + M) : L + M - L * M, F = 2 * L - Y, z = (E % 360 + 360) % 360 / 360;
      H = Z(F, Y, z + 0.3333333333333333), $ = Z(F, Y, z), J = Z(F, Y, z - 0.3333333333333333);
    }
    let Q = new X(H * 255, $ * 255, J * 255, f);
    return Q.hslCached = { h: (E % 360 + 360) % 360, s: M, l: L }, Q;
  }
  static black = new X(0, 0, 0);
  static white = new X(255, 255, 255);
  constructor(E, M, L, f = 1) {
    this.r = c(0, E, 255), this.g = c(0, M, 255), this.b = c(0, L, 255), this.a = c(0, f, 1);
  }
  get inverse() {
    return new X(255 - this.r, 255 - this.g, 255 - this.b, this.a);
  }
  get inverseLuminance() {
    let { h: E, s: M, l: L } = this._hsl;
    return X.fromHsl(E, M, 1 - L, this.a);
  }
  get opaque() {
    return this.a === 1 ? this : new X(this.r, this.g, this.b, 1);
  }
  contrasting(E = 1) {
    return this.opaque.blend(this.brightness > 0.5 ? X.black : X.white, E);
  }
  get rgb() {
    let { r: E, g: M, b: L } = this;
    return `rgb(${E.toFixed(0)},${M.toFixed(0)},${L.toFixed(0)})`;
  }
  get rgba() {
    let { r: E, g: M, b: L, a: f } = this;
    return `rgba(${E.toFixed(0)},${M.toFixed(0)},${L.toFixed(0)},${f.toFixed(2)})`;
  }
  get RGBA() {
    return [this.r / 255, this.g / 255, this.b / 255, this.a];
  }
  get ARGB() {
    return [this.a, this.r / 255, this.g / 255, this.b / 255];
  }
  hslCached;
  get _hsl() {
    if (this.hslCached == null)
      this.hslCached = new oM(this.r, this.g, this.b);
    return this.hslCached;
  }
  get hsl() {
    let { h: E, s: M, l: L } = this._hsl;
    return `hsl(${E.toFixed(0)}deg ${(M * 100).toFixed(0)}% ${(L * 100).toFixed(0)}%)`;
  }
  get hsla() {
    let { h: E, s: M, l: L } = this._hsl;
    return `hsl(${E.toFixed(0)}deg ${(M * 100).toFixed(0)}% ${(L * 100).toFixed(0)}% / ${(this.a * 100).toFixed(0)}%)`;
  }
  get mono() {
    let E = this.brightness * 255;
    return new X(E, E, E);
  }
  get brightness() {
    return uL(this.r, this.g, this.b);
  }
  get html() {
    return this.toString();
  }
  toString() {
    return this.a === 1 ? "#" + JE(this.r) + JE(this.g) + JE(this.b) : "#" + JE(this.r) + JE(this.g) + JE(this.b) + JE(Math.floor(255 * this.a));
  }
  brighten(E) {
    let { h: M, s: L, l: f } = this._hsl, H = c(0, f + E * (1 - f), 1);
    return X.fromHsl(M, L, H, this.a);
  }
  darken(E) {
    let { h: M, s: L, l: f } = this._hsl, H = c(0, f * (1 - E), 1);
    return X.fromHsl(M, L, H, this.a);
  }
  saturate(E) {
    let { h: M, s: L, l: f } = this._hsl, H = c(0, L + E * (1 - L), 1);
    return X.fromHsl(M, H, f, this.a);
  }
  desaturate(E) {
    let { h: M, s: L, l: f } = this._hsl, H = c(0, L * (1 - E), 1);
    return X.fromHsl(M, H, f, this.a);
  }
  rotate(E) {
    let { h: M, s: L, l: f } = this._hsl, H = (M + 360 + E) % 360;
    return X.fromHsl(H, L, f, this.a);
  }
  opacity(E) {
    let { h: M, s: L, l: f } = this._hsl;
    return X.fromHsl(M, L, f, E);
  }
  swatch() {
    return console.log(`%c      %c ${this.html}, ${this.rgba}`, `background-color: ${this.html}`, "background-color: transparent"), this;
  }
  blend(E, M) {
    return new X(s(this.r, E.r, M), s(this.g, E.g, M), s(this.b, E.b, M), s(this.a, E.a, M));
  }
  static blendHue(E, M, L) {
    let f = (M - E + 720) % 360;
    if (f < 180)
      return E + L * f;
    else
      return E - (360 - f) * L;
  }
  mix(E, M) {
    let L = this._hsl, f = E._hsl;
    return X.fromHsl(L.s === 0 ? f.h : f.s === 0 ? L.h : X.blendHue(L.h, f.h, M), s(L.s, f.s, M), s(L.l, f.l, M), s(this.a, E.a, M));
  }
  colorMix(E, M) {
    return X.fromCss(`color-mix(in hsl, ${this.html}, ${E.html} ${(M * 100).toFixed(0)}%)`);
  }
  static computedColorStylesheet = null;
  static computedColors = new Map;
  static recomputeQueued = false;
  static registerComputedColor(E, M, L, f) {
    if (!X.computedColors.has(E))
      X.computedColors.set(E, { varName: M, scale: L, method: f }), X.queueRecompute();
  }
  static queueRecompute() {
    if (X.recomputeQueued)
      return;
    X.recomputeQueued = true, queueMicrotask(() => {
      X.recomputeQueued = false, X.recomputeColors();
    });
  }
  static recomputeColors() {
    if (X.computedColors.size === 0)
      return;
    let E = [];
    for (let [L, { varName: f, scale: H, method: $ }] of X.computedColors)
      try {
        let J = X.fromVar(f), Q;
        switch ($) {
          case "b":
            Q = H > 0 ? J.brighten(H) : J.darken(-H);
            break;
          case "s":
            Q = H > 0 ? J.saturate(H) : J.desaturate(-H);
            break;
          case "h":
            Q = J.rotate(H * 100);
            break;
          case "o":
            Q = J.opacity(H);
            break;
          default:
            continue;
        }
        E.push(`  ${L}: ${Q.rgba};`);
      } catch (J) {}
    if (E.length === 0)
      return;
    let M = `:root {
${E.join(`
`)}
}`;
    if (X.computedColorStylesheet === null)
      X.computedColorStylesheet = document.createElement("style"), X.computedColorStylesheet.id = "tosijs-computed-colors", document.head.append(X.computedColorStylesheet);
    X.computedColorStylesheet.textContent = M;
  }
}
var RE = new Set;
var iL = /^(animation-iteration-count|column-count|flex(-grow|-shrink)?|font-weight|line-height|opacity|order|orphans|scale|tab-size|widows|z-index|zoom)$/;
var LM = (E, M) => {
  if (typeof M === "number" && !iL.test(E))
    M = `${M}px`;
  if (E.startsWith("_"))
    if (E.startsWith("__"))
      E = "--" + E.substring(2), M = `var(${E}-default, ${M})`;
    else
      E = "--" + E.substring(1);
  return { prop: E, value: String(M) };
};
var sL = (E, M, L) => {
  if (L === undefined)
    return "";
  if (L instanceof X)
    L = L.html;
  let f = LM(M, L);
  return `${E}  ${f.prop}: ${f.value};`;
};
var tM = (E, M, L = "") => {
  let f = P(E);
  if (typeof M === "object" && !(M instanceof X)) {
    let H = Object.keys(M).map(($) => tM($, M[$], `${L}  `)).join(`
`);
    return `${L}  ${E} {
${H}
${L}  }`;
  } else
    return sL(L, f, M);
};
var $E = (E, M = "") => {
  return Object.keys(E).map((f) => {
    let H = E[f];
    if (typeof H === "string") {
      if (f === "@import")
        return `@import url('${H}');`;
      throw Error("top-level string value only allowed for `@import`");
    }
    let $ = Object.keys(H).map((J) => tM(J, H[J])).join(`
`);
    return `${M}${f} {
${$}
}`;
  }).join(`

`);
};
var kE = new Proxy({}, { get(E, M) {
  if (E[M] === undefined) {
    let L = "--" + P(M);
    E[M] = (f) => `var(${L}, ${f})`;
  }
  return E[M];
} });
var fM = new Proxy({}, { get(E, M) {
  if (M === "default")
    return kE;
  if (E[M] == null) {
    M = P(M);
    let [, L, , f, H, $] = M.match(/^([-\w]*?)((_)?(\d+)(\w?))?$/) || ["", M], J = `--${L}`;
    if (H != null) {
      let Q = f == null ? Number(H) / 100 : -Number(H) / 100;
      switch ($) {
        case "b":
        case "s":
        case "h":
        case "o":
          {
            let Z = `--${M}`;
            X.registerComputedColor(Z, J, Q, $), E[M] = `var(${Z})`;
          }
          break;
        case "":
          E[M] = `calc(var(${J}) * ${Q})`;
          break;
        default:
          throw console.error($), Error(`Unrecognized method ${$} for css variable ${J}`);
      }
    } else
      E[M] = `var(${J})`;
  }
  return E[M];
} });
var eM = "http://www.w3.org/1998/Math/MathML";
var EL = "http://www.w3.org/2000/svg";
var IE = {};
var fL = (E, M, L) => {
  let f = LM(P(M), L);
  if (f.prop.startsWith("--"))
    E.style.setProperty(f.prop, f.value);
  else
    E.style[M] = f.value;
};
var lL = (E) => {
  return { toDOM(M, L) {
    fL(M, E, L);
  } };
};
var HL = (E, M, L) => {
  if (M === "style")
    if (typeof L === "object")
      for (let f of Object.keys(L))
        if (j(L[f]))
          v(E, L[f], lL(f));
        else
          fL(E, f, L[f]);
    else
      E.setAttribute("style", L);
  else {
    let f = P(M), H = E.constructor.observedAttributes;
    if (H?.includes(M) || H?.includes(f))
      if (typeof L === "boolean")
        L ? E.setAttribute(f, "") : E.removeAttribute(f);
      else
        E.setAttribute(f, L);
    else if (E[M] !== undefined) {
      let { MathMLElement: J } = globalThis;
      if (E instanceof SVGElement || J !== undefined && E instanceof J)
        E.setAttribute(M, L);
      else
        E[M] = L;
    } else if (f === "class")
      L.split(" ").forEach((J) => {
        E.classList.add(J);
      });
    else if (E[f] !== undefined)
      E[f] = L;
    else if (typeof L === "boolean")
      L ? E.setAttribute(f, "") : E.removeAttribute(f);
    else
      E.setAttribute(f, L);
  }
};
var HM = {};
var ML = (E) => {
  if (!HM[E])
    HM[E] = { toDOM(M, L) {
      HL(M, E, L);
    } };
  return HM[E];
};
var BE = (E, M, L) => {
  if (M === "apply")
    L(E);
  else if (M.match(/^on[A-Z]/) != null) {
    let f = M.substring(2).toLowerCase();
    XE(E, f, L);
  } else if (M === "bind")
    if ((typeof L.binding === "string" ? TE[L.binding] : L.binding) !== undefined && L.value !== undefined)
      v(E, L.value, L.binding instanceof Function ? { toDOM: L.binding } : L.binding);
    else
      throw Error("bad binding");
  else if (M.match(/^bind[A-Z]/) != null) {
    let f = M.substring(4, 5).toLowerCase() + M.substring(5);
    if (f !== "value") {
      let $ = f === "text" ? "textContent" : f === "enabled" ? "disabled (with .tosi.take(v => !v))" : f === "disabled" ? "disabled" : f === "list" ? ".tosi.listBinding()" : null;
      if ($)
        R(`bind${f}`, `bind${M.substring(4)} is deprecated. Use { ${$}: ... } instead.`);
    }
    let H = TE[f];
    if (H !== undefined)
      v(E, L, H);
    else
      throw Error(`${M} is not allowed, bindings.${f} is not defined`);
  } else if (L != null && typeof L === "object" && L[ME])
    v(E, L, ML(M));
  else if (j(L))
    v(E, L, ML(M));
  else
    HL(E, M, L);
};
var JM = (E, ...M) => {
  if (IE[E] === undefined) {
    let [H, $] = E.split("|");
    if ($ === undefined)
      IE[E] = globalThis.document.createElement(H);
    else
      IE[E] = globalThis.document.createElementNS($, H);
  }
  let L = IE[E].cloneNode(), f = {};
  for (let H of M)
    if (H instanceof Element || H instanceof DocumentFragment || typeof H === "string" || typeof H === "number")
      if (L instanceof HTMLTemplateElement)
        L.content.append(H);
      else
        L.append(H);
    else if (j(H))
      L.append(I.span({ bindText: H }));
    else
      Object.assign(f, H);
  for (let H of Object.keys(f)) {
    let $ = f[H];
    BE(L, H, $);
  }
  return L;
};
var $M = (...E) => {
  let M = globalThis.document.createDocumentFragment();
  for (let L of E)
    M.append(L);
  return M;
};
var I = new Proxy({ fragment: $M }, { get(E, M) {
  if (M = M.replace(/[A-Z]/g, (L) => `-${L.toLocaleLowerCase()}`), E[M] === undefined)
    E[M] = (...L) => JM(M, ...L);
  return E[M];
}, set() {
  throw Error("You may not add new properties to elements");
} });
var ZM = new Proxy({ fragment: $M }, { get(E, M) {
  if (E[M] === undefined)
    E[M] = (...L) => JM(`${M}|${EL}`, ...L);
  return E[M];
}, set() {
  throw Error("You may not add new properties to elements");
} });
var QM = new Proxy({ fragment: $M }, { get(E, M) {
  if (E[M] === undefined)
    E[M] = (...L) => JM(`${M}|${eM}`, ...L);
  return E[M];
}, set() {
  throw Error("You may not add new properties to elements");
} });
var LL = new WeakSet;
var aL = ["sort", "splice", "copyWithin", "fill", "pop", "push", "reverse", "shift", "unshift"];
var eL = true;
var Ef = /^\.?([^.[\](),])+(\.[^.[\](),]+|\[\d+\]|\[[^=[\](),]*=[^[\]()]+\])*$/;
var Mf = (E) => Ef.test(E);
var a = (E = "", M = "") => {
  if (E === "")
    return M;
  else if (M.match(/^\d+$/) !== null || M.includes("="))
    return `${E}[${M}]`;
  else
    return `${E}.${M}`;
};
var _E = {};
function YM(E, M) {
  if (E !== null && (typeof E === "object" || typeof E === "function"))
    return E;
  return new Proxy(_E, e(M, true));
}
var YL = () => new Proxy({}, e("^", true));
var zM = (E) => {
  let L = E(YL())?.path;
  if (!L?.startsWith("^."))
    throw Error("selector must return a property of the item");
  return L.substring(2);
};
var FM = (E, M, L) => {
  for (let f = 0;f < E.length; f++)
    if (`${V(E[f], M)}` === `${L}`)
      return f;
  return -1;
};
var Lf = (E, M) => ({ listFind(L, f) {
  if (L instanceof Element) {
    let J = L;
    while (J && !J[o] && J.parentElement)
      J = J.parentElement;
    let Q = J?.[o];
    if (Q == null)
      return;
    let Z = M.indexOf(Q);
    return Z !== -1 ? x[E][Z] : undefined;
  }
  let H = zM(L), $ = FM(M, H, f);
  return $ !== -1 ? x[E][$] : undefined;
}, listUpdate(L, f) {
  let H = zM(L), $ = V(f, H), J = FM(M, H, $);
  if (J !== -1) {
    let Q = x[E][J];
    for (let Z of Object.keys(f))
      Q[Z] = f[Z];
    return Q;
  }
  return x[E].push(f), x[E][M.length - 1];
}, listRemove(L, f) {
  let H = zM(L), $ = FM(M, H, f);
  if ($ === -1)
    return false;
  return x[E].splice($, 1), true;
} });
var JL = false;
function ff() {
  if (!JL)
    console.warn("xinValue, tosiValue, xinPath, tosiPath, etc. are deprecated. Use .tosi.value, .tosi.path, .tosi.observe(), etc. instead."), JL = true;
}
var $L = (E) => {
  return E === _E;
};
var Hf = (E, M) => ({ get(L, f) {
  switch (f) {
    case "value":
      return M === _E ? V(T, E) : M.valueOf ? M.valueOf() : M;
    case "path":
      return E;
    case "touch":
      return () => N(E);
    case "observe":
      return (H) => {
        let $ = i(E, H);
        return () => HE($);
      };
    case "bind":
      return (H, $, J) => {
        gM()(H, E, $, J);
      };
    case "on": {
      let H = M === _E ? V(T, E) : M.valueOf ? M.valueOf() : M;
      return ($, J) => dM()($, J, H);
    }
    case "binding":
      return (H) => ({ bind: { value: E, binding: H } });
    case "listBinding":
      return (H = ({ span: J }) => J({ bindText: "^" }), $ = {}) => {
        let J = $.virtual?.itemsPerRow ?? 1, Q = [];
        for (let Z = 0;Z < J; Z++)
          Q.push(H(I, YL(), Z));
        return [{ bindList: { value: E, ...$ } }, I.template(...Q)];
      };
    case "listFind":
    case "listUpdate":
    case "listRemove":
      return Lf(E, Array.isArray(M) ? M : [])[f];
    case "take":
      return (...H) => {
        let $ = H[H.length - 1], Q = H.slice(0, -1).map((Z) => typeof Z === "string" ? Z : Z[m]);
        return { [ME]: true, paths: [E, ...Q], transform: $ };
      };
  }
  return;
}, set(L, f, H) {
  if (f === "value") {
    if (H = C(H), C(k[E]) !== H && l(T, E, H))
      N(E);
    return true;
  }
  return false;
} });
var qE = (E, M) => new Proxy(M, Hf(E, M));
var ZL = new Set(["path", "value", "touch", "observe", "bind", "on", "binding", "listBinding", "listFind", "listUpdate", "listRemove", "take"]);
var QL = new Map([[m, "path"], ["xinPath", "path"], ["tosiPath", "path"], [r, "value"], ["xinValue", "value"], ["tosiValue", "value"], [IM, "observe"], ["xinObserve", "observe"], ["tosiObserve", "observe"], [_M, "on"], ["xinOn", "on"], ["tosiOn", "on"], [BM, "bind"], ["xinBind", "bind"], ["tosiBind", "bind"], ["tosiBinding", "binding"], ["tosiListBinding", "listBinding"]]);
var e = (E, M) => ({ get(L, f) {
  if ((f === "tosi" || f === jE) && M)
    return qE(E, L);
  if ($L(L)) {
    let Z = () => V(T, E);
    switch (f) {
      case "valueOf":
      case "toJSON":
        return () => Z();
      case Symbol.toPrimitive:
        return (z) => {
          let G = Z();
          if (z === "number")
            return Number(G);
          if (z === "string")
            return String(G);
          return G;
        };
      case "toString":
        return () => String(Z());
    }
    if (ZL.has(f))
      return qE(E, L)[f];
    let Y = QL.get(f);
    if (Y !== undefined)
      return ff(), qE(E, L)[Y];
    let F = Z();
    if (F != null) {
      let z = Object(F);
      if (f in z) {
        let G = z[f];
        return typeof G === "function" ? G.bind(z) : G;
      }
    }
    return;
  }
  if (M && (f === "valueOf" || f === "toJSON"))
    return () => L.valueOf ? L.valueOf() : L;
  if (M && !(f in L) && ZL.has(f))
    return qE(E, L)[f];
  let H = QL.get(f);
  if (H !== undefined)
    return qE(E, L)[H];
  if (typeof f === "symbol")
    return L[f];
  let $ = Object.getOwnPropertyDescriptor(L, f);
  if ($ && !$.configurable && !$.writable && "value" in $)
    return $.value;
  let J = f, Q = J.match(/^([^.[]+)\.(.+)$/) ?? J.match(/^([^\]]+)(\[.+)/) ?? J.match(/^(\[[^\]]+\])\.(.+)$/) ?? J.match(/^(\[[^\]]+\])\[(.+)$/);
  if (Q !== null) {
    let [, Z, Y] = Q, F = a(E, Z), z = C(V(L, Z));
    return z !== null && typeof z === "object" ? new Proxy(z, e(F, M))[Y] : z;
  }
  if (J.startsWith("[") && J.endsWith("]"))
    J = J.substring(1, J.length - 1);
  if (!Array.isArray(L) && L[J] !== undefined || Array.isArray(L) && J.includes("=")) {
    let Z;
    if (J.includes("=")) {
      let [Y, F] = J.split("=");
      Z = L.find((z) => `${V(z, Y)}` === F);
    } else
      Z = L[J];
    if (Z instanceof Object) {
      Z = C(Z);
      let Y = a(E, J);
      return new Proxy(Z instanceof Function ? Z.bind(L) : Z, e(Y, M));
    } else
      return M ? YM(Z, a(E, J)) : Z;
  } else if (Array.isArray(L)) {
    let Z = L[J];
    return typeof Z === "function" ? (...Y) => {
      let F = Y.map((G) => C(G)), z = Z.apply(L, F);
      if (aL.includes(J))
        N(E);
      if (z != null && typeof z === "object") {
        if (J === "find" || J === "findLast" || J === "at") {
          let G = L.indexOf(z);
          if (G !== -1)
            return new Proxy(z, e(a(E, String(G)), M));
        }
      }
      return z;
    } : typeof Z === "object" ? new Proxy(C(Z), e(a(E, J), M)) : M ? YM(Z, a(E, J)) : Z;
  } else {
    let Z = L[J];
    if (Z !== null && typeof Z === "object")
      Z = C(Z);
    return M ? YM(Z, a(E, J)) : Z;
  }
}, set(L, f, H) {
  if (H = C(H), H !== null && typeof H === "object")
    if (Array.isArray(H))
      for (let Z = 0;Z < H.length; Z++)
        H[Z] = C(H[Z]);
    else
      for (let Z of Object.keys(H))
        H[Z] = C(H[Z]);
  let J = f === r || f === "xinValue" || f === "tosiValue" || f === "value" && ($L(L) || M) ? E : a(E, f);
  if (eL && !Mf(J))
    throw Error(`setting invalid path ${J}`);
  if (C(k[J]) !== H && l(T, J, H))
    N(J);
  return true;
} });
var k = new Proxy(T, e("", false));
vM(k);
var x = new Proxy(T, e("", true));
var Jf = 16;
var $f = 100;
function zL(E, M) {
  let L = Array.from(E.querySelectorAll(p));
  if (E.matches(p))
    L.unshift(E);
  for (let f of L) {
    let H = b.get(f);
    for (let $ of H) {
      if ($.path.startsWith("^"))
        $.path = `${M}${$.path.substring(1)}`;
      if ($.binding.toDOM != null)
        $.binding.toDOM(f, k[$.path]);
    }
  }
}

class FL {
  boundElement;
  listTop;
  listBottom;
  isNamespaced;
  templates;
  options;
  itemToElement;
  idToElement = new Map;
  array = [];
  _filteredCache;
  _update;
  _previousSlice;
  static filterBoundObservers = new WeakMap;
  constructor(E, M, L = {}) {
    if (this.boundElement = E, this.itemToElement = new WeakMap, L.idPath != null) {
      let Q = j(M);
      if (Q != null)
        SM(Q, L.idPath);
    }
    let f = L.virtual?.itemsPerRow ?? 1, H = Array.from(E.children).find((Q) => Q instanceof HTMLTemplateElement), $ = null;
    if (H != null) {
      let Q = f;
      if (H.content.children.length < 1 || H.content.children.length !== Q)
        throw Error(`ListBinding expects a template with exactly ${Q} child element(s)`);
      this.templates = Array.from(H.content.children).map((Z) => LE(Z)), $ = H.nextElementSibling, H.remove();
    } else if (E.children.length === 1)
      this.templates = [E.children[0]], this.templates[0].remove();
    else
      throw Error("ListBinding expects a <template> child or exactly one child element");
    this.options = L;
    let J = E.namespaceURI;
    if (this.isNamespaced = J === "http://www.w3.org/2000/svg" || J === "http://www.w3.org/1998/Math/MathML", this.isNamespaced)
      this.listTop = null, this.listBottom = null;
    else if (this.listTop = document.createElement("div"), this.listBottom = document.createElement("div"), this.listTop.classList.add("virtual-list-padding"), this.listBottom.classList.add("virtual-list-padding"), this.listTop.setAttribute("role", "presentation"), this.listBottom.setAttribute("role", "presentation"), this.listTop.setAttribute("aria-hidden", "true"), this.listBottom.setAttribute("aria-hidden", "true"), $ != null)
      this.boundElement.insertBefore(this.listTop, $), this.boundElement.insertBefore(this.listBottom, $);
    else
      this.boundElement.append(this.listTop), this.boundElement.append(this.listBottom);
    if (f > 1) {
      this.boundElement.classList.add("tosi-virtual-grid");
      let Q = this.boundElement.style;
      if (Q != null)
        Q.setProperty("--tosi-columns", String(f)), Q.display = Q.display || "grid", Q.gridTemplateColumns = Q.gridTemplateColumns || "repeat(var(--tosi-columns), 1fr)";
      if (this.listTop != null && this.listBottom != null)
        this.listTop.style.gridColumn = "1 / -1", this.listBottom.style.gridColumn = "1 / -1";
    }
    if (L.virtual != null && !this.boundElement.getAttribute("role"))
      this.boundElement.setAttribute("role", f > 1 ? "grid" : "list");
    if (this.boundElement[QE] = this, this.isNamespaced && L.virtual != null)
      console.warn("ListBinding: virtual scrolling is not supported in SVG/MathML containers, ignoring virtual option");
    if (!this.isNamespaced && L.virtual != null)
      if (WE.observe(this.boundElement), this._update = FE(() => {
        this.update(this.array, true);
      }, Jf), this.boundElement.addEventListener("resize", this._update), L.virtual.scrollContainer === "window")
        window.addEventListener("scroll", this._update), window.addEventListener("resize", this._update);
      else
        this.boundElement.addEventListener("scroll", this._update);
  }
  filteredArray() {
    if (this._filteredCache != null)
      return this._filteredCache;
    let { hiddenProp: E, visibleProp: M } = this.options, L = this.array;
    if (E !== undefined)
      L = L.filter((f) => f[E] !== true);
    if (M !== undefined)
      L = L.filter((f) => f[M] === true);
    if (this.options.filter && this.needle !== undefined)
      L = this.options.filter(L, this.needle);
    return this._filteredCache = L, L;
  }
  visibleSlice() {
    let { virtual: E } = this.options, M = this.filteredArray(), L = 0, f = M.length - 1, H = 0, $ = 0;
    if (E != null && this.boundElement instanceof HTMLElement) {
      let J = this.boundElement.offsetWidth, Q = E.scrollContainer === "window", Z, Y;
      if (Q) {
        Z = window.innerHeight;
        let G = this.boundElement.getBoundingClientRect();
        Y = Math.max(0, -G.top);
      } else
        Z = this.boundElement.offsetHeight, Y = this.boundElement.scrollTop;
      let F = E.width != null ? Math.max(1, Math.floor(J / E.width)) : E.visibleColumns ?? 1, z = Math.ceil(M.length / F);
      if (E.minHeight != null) {
        let G = E.minHeight, B = Math.ceil(Z / G) + (E.rowChunkSize || 1), W = F * B, D = z * G, w = Math.max(0, D - Z), K = w > 0 ? Math.min(1, Math.max(0, Y / w)) : 0, g = Math.max(0, z - B + 1), y = K * g, S = Math.floor(y);
        if (E.rowChunkSize)
          S -= S % E.rowChunkSize;
        return L = S * F, f = L + W - 1, H = Y, $ = Math.max(0, D - Y - Z), { items: M, firstItem: L, lastItem: f, topBuffer: H, bottomBuffer: $, interpolation: { t: K, position: y, scrollTop: Y, viewportHeight: Z, totalScrollHeight: D, rowHeight: E.height } };
      } else {
        let G = Math.ceil(Z / E.height) + (E.rowChunkSize || 1), B = F * G, W = Math.floor(Y / E.height);
        if (W > z - G + 1)
          W = Math.max(0, z - G + 1);
        if (E.rowChunkSize)
          W -= W % E.rowChunkSize;
        L = W * F, f = L + B - 1, H = W * E.height, $ = Math.max((z - G) * E.height - H, 0);
      }
    }
    return { items: M, firstItem: L, lastItem: f, topBuffer: H, bottomBuffer: $ };
  }
  needle;
  filter = FE((E) => {
    if (this.needle !== E)
      this.needle = E, this.update(this.array);
  }, $f);
  update(E, M) {
    if (E == null)
      E = [];
    if (this.array = E, !M)
      this._filteredCache = undefined;
    let { hiddenProp: L, visibleProp: f } = this.options, H = j(E), $ = this.visibleSlice();
    if (this.boundElement.classList.toggle("-xin-empty-list", $.items.length === 0), this.options.virtual != null)
      this.boundElement.setAttribute("aria-rowcount", String($.items.length));
    let J = this._previousSlice, { firstItem: Q, lastItem: Z, topBuffer: Y, bottomBuffer: F } = $, z = L === undefined && f === undefined && M === true && J != null && Q === J.firstItem && Z === J.lastItem;
    if (z && $.interpolation == null && Y === J.topBuffer && F === J.bottomBuffer)
      return;
    if (z && $.interpolation != null) {
      this._updateInterpolatedBuffers($);
      return;
    }
    this._previousSlice = $;
    let G = 0, B = 0, W = 0, { idPath: D } = this.options, w = this.options.virtual?.itemsPerRow ?? 1, K;
    if (D != null) {
      K = new Set;
      for (let q = Q;q <= Z; q++) {
        let U = $.items[q];
        if (U !== undefined)
          K.add(String(U[D]));
      }
    }
    let g = new Set;
    for (let q of Array.from(this.boundElement.children)) {
      if (q === this.listTop || q === this.listBottom)
        continue;
      let U = q[o];
      if (U == null)
        continue;
      else if (U === true)
        q.remove(), G++;
      else {
        if (g.has(U))
          continue;
        let O;
        if (D != null)
          O = !K.has(String(U[D]));
        else {
          let _ = $.items.indexOf(U);
          O = _ < Q || _ > Z;
        }
        if (O) {
          g.add(U);
          let _ = this.itemToElement.get(U);
          if (_ != null)
            for (let A of _)
              A.remove();
          else
            q.remove();
          if (this.itemToElement.delete(U), D != null)
            this.idToElement.delete(String(U[D]));
          G++;
        }
      }
    }
    if (this.listTop != null && this.listBottom != null)
      this.listTop.style.height = String(Y) + "px", this.listBottom.style.height = String(F) + "px";
    let y = [];
    for (let q = Q;q <= Z; q++) {
      let U = $.items[q];
      if (U === undefined)
        continue;
      let O = this.itemToElement.get(C(U));
      if (O == null && D != null) {
        let _ = String(U[D]);
        if (O = this.idToElement.get(_), O != null) {
          let A = C(U);
          this.itemToElement.set(A, O);
          for (let d of O)
            d[o] = A;
        }
      }
      if (O == null) {
        W++;
        let _ = C(U);
        if (O = this.templates.map((A) => LE(A)), typeof U === "object")
          this.itemToElement.set(_, O);
        for (let A of O)
          A[o] = typeof U === "object" ? _ : true;
        for (let A of O)
          if (this.listBottom != null)
            this.boundElement.insertBefore(A, this.listBottom);
          else
            this.boundElement.append(A);
        if (D != null) {
          let A = U[D], d = `${H}[${D}=${A}]`;
          for (let jL of O)
            zL(jL, d);
          this.idToElement.set(String(A), O);
        } else {
          let A = `${H}[${q}]`;
          for (let d of O)
            zL(d, A);
        }
      }
      if (this.options.virtual != null) {
        let _ = String(q + 1);
        if (w > 1)
          for (let A = 0;A < O.length; A++) {
            let d = O[A];
            d.setAttribute("role", "gridcell"), d.setAttribute("aria-rowindex", _), d.setAttribute("aria-colindex", String(A + 1));
          }
        else
          for (let A of O)
            A.setAttribute("role", "listitem"), A.setAttribute("aria-rowindex", _);
      }
      y.push(...O);
    }
    let S = null;
    for (let q of y) {
      if (q.previousElementSibling !== S)
        if (B++, S?.nextElementSibling != null)
          this.boundElement.insertBefore(q, S.nextElementSibling);
        else if (this.listBottom != null)
          this.boundElement.insertBefore(q, this.listBottom);
        else
          this.boundElement.append(q);
      S = q;
    }
    if ($.interpolation != null)
      this._updateInterpolatedBuffers($);
    if (fE.perf)
      console.log(H, "updated", { removed: G, created: W, moved: B });
  }
  _updateInterpolatedBuffers(E) {
    let { t: M, position: L, scrollTop: f, viewportHeight: H, totalScrollHeight: $, rowHeight: J } = E.interpolation, Q = 0;
    for (let z of Array.from(this.boundElement.children)) {
      if (z === this.listTop || z === this.listBottom)
        continue;
      Q += z.offsetHeight || J;
    }
    let Z = f, Y = f + H - Q, F = Math.max(0, M * Y + (1 - M) * Z - L % 1 * J);
    if (this.listTop != null && this.listBottom != null)
      this.listTop.style.height = String(F) + "px", this.listBottom.style.height = String(Math.max(0, $ - F - Q)) + "px";
  }
}
var DE = (E, M, L) => {
  let f = E[QE];
  if (M && f === undefined)
    f = new FL(E, M, L), E[QE] = f;
  return f;
};
var XM = (E) => {
  let M;
  while (!(M = E[o]) && E && E.parentElement)
    E = E.parentElement;
  return M ? { element: E, item: M } : undefined;
};
var GM = (E) => {
  let M = XM(E);
  return M ? M.item : undefined;
};
var { document: OE, MutationObserver: XL } = globalThis;
var WM = (E, M) => {
  let L = b.get(E);
  if (L == null)
    return;
  for (let f of L) {
    let { binding: H, options: $ } = f, { path: J } = f, { toDOM: Q } = H;
    if (Q != null) {
      if (J.startsWith("^")) {
        let Z = GM(E);
        if (Z != null && Z[m] != null)
          J = f.path = `${Z[m]}${J.substring(1)}`;
        else {
          if (E instanceof HTMLElement)
            console.warn(`Unresolved relative binding "${J}" —`, E, "is not part of a list. If this is a list template, wrap it in a <template>.");
          continue;
        }
      }
      if (M == null || J.startsWith(M))
        Q(E, GE()[J], $);
    }
  }
};
if (XL != null)
  new XL((M) => {
    M.forEach((L) => {
      Array.from(L.addedNodes).forEach((f) => {
        if (f instanceof Element)
          Array.from(f.querySelectorAll(p)).forEach((H) => WM(H));
      });
    });
  }).observe(OE.body, { subtree: true, childList: true });
i(() => true, (E) => {
  let M = Array.from(OE.querySelectorAll(p));
  for (let L of M)
    WM(L, E);
});
var GL = (E) => {
  let M = E.target?.closest(p);
  while (M != null) {
    let L = b.get(M);
    for (let f of L) {
      let { binding: H, path: $ } = f, { fromDOM: J } = H;
      if (J != null) {
        let Q;
        try {
          Q = J(M, f.options);
        } catch (Z) {
          throw console.error("Cannot get value from", M, "via", f), Error("Cannot obtain value fromDOM");
        }
        if (Q != null) {
          let Z = GE(), Y = Z[$];
          if (Y == null)
            Z[$] = Q;
          else {
            let F = Y[m] != null ? Y[r] : Y, z = Q[m] != null ? Q[r] : Q;
            if (F !== z)
              Z[$] = z;
          }
        }
      }
    }
    M = M.parentElement.closest(p);
  }
};
if (globalThis.document != null)
  OE.body.addEventListener("change", GL, true), OE.body.addEventListener("input", GL, true);
function zf(E, M, L, f) {
  let { paths: H, transform: $ } = M, { toDOM: J } = L;
  if (J == null)
    return E;
  let Q = null, Z = { toDOM(F, z, G) {
    let B = GE(), W = H.map((w) => B[w]);
    if (Q !== null && W.every((w, K) => w === Q[K]))
      return;
    Q = W;
    let D = $(...W);
    J(F, D, G);
  }, fromDOM: L.fromDOM };
  E.classList?.add(wE);
  let Y = b.get(E);
  if (Y == null)
    Y = [], b.set(E, Y);
  for (let F of H)
    Y.push({ path: F, binding: Z, options: f });
  if (!H[0].startsWith("^"))
    N(H[0]);
  return E;
}
function v(E, M, L, f) {
  if (E instanceof DocumentFragment)
    throw Error("bind cannot bind to a DocumentFragment");
  if (M != null && typeof M === "object" && M[ME])
    return zf(E, M, L, f);
  let H;
  if (typeof M === "object" && M[m] === undefined && f === undefined) {
    let { value: Q } = M;
    H = typeof Q === "string" ? Q : Q[m], f = M, delete f.value;
  } else
    H = typeof M === "string" ? M : M[m];
  if (H == null)
    throw Error("bind requires a path or object with xin Proxy");
  let { toDOM: $ } = L;
  E.classList?.add(wE);
  let J = b.get(E);
  if (J == null)
    J = [], b.set(E, J);
  if (J.push({ path: H, binding: L, options: f }), $ != null && !H.startsWith("^"))
    N(H);
  if (f?.filter && f?.needle)
    v(E, f.needle, { toDOM(Q, Z) {
      console.log({ needle: Z }), Q[QE]?.filter(Z);
    } });
  return E;
}
var WL = new Set;
var Ff = (E) => {
  let M = E?.target?.closest(uE), L = false, f = new Proxy(E, { get($, J) {
    if (J === "stopPropagation")
      return () => {
        E.stopPropagation(), L = true;
      };
    else {
      let Q = $[J];
      return typeof Q === "function" ? Q.bind($) : Q;
    }
  } }), H = new Set;
  while (!L && M != null) {
    let J = EE.get(M)[E.type] || H;
    for (let Q of J) {
      if (typeof Q === "function")
        Q(f);
      else {
        let Z = GE()[Q];
        if (typeof Z === "function")
          Z(f);
        else
          throw Error(`no event handler found at path ${Q}`);
      }
      if (L)
        continue;
    }
    M = M.parentElement != null ? M.parentElement.closest(uE) : null;
  }
};
function XE(E, M, L) {
  let f = EE.get(E);
  if (E.classList.add(vE), f == null)
    f = {}, EE.set(E, f);
  if (!f[M])
    f[M] = new Set;
  if (f[M].add(L), !WL.has(M))
    WL.add(M), OE.body.addEventListener(M, Ff, true);
  return () => {
    f[M].delete(L);
  };
}
uM(v, XE);
function UM(E, M) {
  if (!E.internals)
    return;
  let L = {}, f = "";
  if (E.hasAttribute("required") && M === "")
    L.valueMissing = true, f = "Please fill out this field.";
  let H = E.getAttribute("minlength");
  if (H && M.length < parseInt(H, 10))
    L.tooShort = true, f = `Please use at least ${H} characters.`;
  let $ = E.getAttribute("maxlength");
  if ($ && M.length > parseInt($, 10))
    L.tooLong = true, f = `Please use no more than ${$} characters.`;
  let J = E.getAttribute("pattern");
  if (J && M !== "")
    try {
      if (!new RegExp(`^(?:${J})$`).test(M))
        L.patternMismatch = true, f = "Please match the requested format.";
    } catch {}
  if (Object.keys(L).length > 0)
    E.internals.setValidity(L, f, E);
  else
    E.internals.setValidity({});
}
var Xf = 0;
function DM() {
  return `custom-elt${(Xf++).toString(36)}`;
}
var UL = 0;
var KM = null;
function Gf() {
  if (KM === null)
    KM = new MutationObserver((E) => {
      let M = new Set;
      for (let L of E)
        if (L.type === "attributes" && L.target instanceof u) {
          let f = L.target, H = EM(L.attributeName);
          if (f._legacyTrackedAttrs?.has(H))
            M.add(f);
        }
      for (let L of M)
        L.queueRender(false);
    });
  return KM;
}
var AE = {};
function Wf(E, M) {
  let L = AE[E], f = $E(M).replace(/:host\(([^)]+)\)/g, `${E}$1`).replace(/:host\b/g, E);
  AE[E] = L ? L + `
` + f : f;
}
function Uf(E) {
  if (AE[E])
    document.head.append(I.style({ id: E + "-component" }, AE[E]));
  delete AE[E];
}

class u extends HTMLElement {
  static elements = I;
  static _elementCreator;
  static initAttributes;
  static formAssociated;
  static preferredTagName;
  static shadowStyleSpec;
  static lightStyleSpec;
  static extends;
  internals;
  get validity() {
    return this.internals?.validity;
  }
  get validationMessage() {
    return this.internals?.validationMessage ?? "";
  }
  get willValidate() {
    return this.internals?.willValidate ?? false;
  }
  checkValidity() {
    return this.internals?.checkValidity() ?? true;
  }
  reportValidity() {
    return this.internals?.reportValidity() ?? true;
  }
  setCustomValidity(E) {
    if (this.internals)
      if (E)
        this.internals.setValidity({ customError: true }, E);
      else
        this.internals.setValidity({});
  }
  setValidity(E, M, L) {
    this.internals?.setValidity(E, M, L);
  }
  setFormValue(E, M) {
    this.internals?.setFormValue(E, M);
  }
  static get observedAttributes() {
    let E = this.initAttributes;
    if (E)
      return ["hidden", ...Object.keys(E).map(P)];
    return ["hidden"];
  }
  instanceId;
  styleNode;
  static styleSpec;
  static styleNode;
  content = I.slot();
  isSlotted;
  static _tagName = null;
  static get tagName() {
    return this._tagName;
  }
  _legacyTrackedAttrs;
  _attrValues;
  _valueChanged = false;
  static StyleNode(E) {
    return console.warn("StyleNode is deprecated, use static shadowStyleSpec instead"), I.style($E(E));
  }
  static elementCreator(E = {}) {
    let M = this;
    if (!Object.prototype.hasOwnProperty.call(M, "_elementCreator")) {
      if (E.tag !== undefined)
        R("elementCreator-tag", "Passing tag to elementCreator() is deprecated. Use static preferredTagName instead.");
      if (E.styleSpec !== undefined)
        R("elementCreator-styleSpec", "Passing styleSpec to elementCreator() is deprecated. Use static lightStyleSpec instead.");
      if (E.extends !== undefined)
        R("elementCreator-extends", "Passing extends to elementCreator() is deprecated. Use static extends instead.");
      let L = E.tag ?? M.preferredTagName;
      if (L == null)
        if (typeof M.name === "string" && M.name !== "") {
          if (L = P(M.name), L.startsWith("-"))
            L = L.slice(1);
        } else
          L = DM();
      if (customElements.get(L) != null)
        console.warn(`${L} is already defined`);
      if (L.match(/\w+(-\w+)+/) == null)
        console.warn(`${L} is not a legal tag for a custom-element`), L = DM();
      while (customElements.get(L) !== undefined)
        L = DM();
      M._tagName = L;
      let f = E.styleSpec ?? M.lightStyleSpec;
      if (f !== undefined)
        Wf(L, f);
      let H = E.extends ?? M.extends, $ = H ? { extends: H } : undefined;
      window.customElements.define(L, this, $), M._elementCreator = I[L];
    }
    return M._elementCreator;
  }
  initAttributes(...E) {
    if (R("initAttributes", "initAttributes() is deprecated. Use static initAttributes = { ... } instead."), !this._legacyTrackedAttrs)
      this._legacyTrackedAttrs = new Set;
    for (let H of E)
      this._legacyTrackedAttrs.add(H);
    Gf().observe(this, { attributes: true });
    let L = {}, f = {};
    E.forEach((H) => {
      L[H] = n(this[H]);
      let $ = P(H);
      Object.defineProperty(this, H, { enumerable: false, get() {
        if (typeof L[H] === "boolean")
          return this.hasAttribute($);
        else if (this.hasAttribute($))
          return typeof L[H] === "number" ? parseFloat(this.getAttribute($)) : this.getAttribute($);
        else if (f[H] !== undefined)
          return f[H];
        else
          return L[H];
      }, set(J) {
        if (typeof L[H] === "boolean") {
          if (J !== this[H]) {
            if (J)
              this.setAttribute($, "");
            else
              this.removeAttribute($);
            this.queueRender();
          }
        } else if (typeof L[H] === "number") {
          if (J !== parseFloat(this[H]))
            this.setAttribute($, J), this.queueRender();
        } else if (typeof J === "object" || `${J}` !== `${this[H]}`) {
          if (J === null || J === undefined || typeof J === "object")
            this.removeAttribute($);
          else
            this.setAttribute($, J);
          this.queueRender(), f[H] = J;
        }
      } });
    });
  }
  initValue() {
    let E = Object.getOwnPropertyDescriptor(this, "value");
    if (E === undefined || E.get !== undefined || E.set !== undefined)
      return;
    let M = this.hasAttribute("value") ? this.getAttribute("value") : n(this.value);
    delete this.value, Object.defineProperty(this, "value", { enumerable: false, get() {
      return M;
    }, set(L) {
      if (M !== L)
        M = L, this._valueChanged = true, this.queueRender(true);
    } });
  }
  _parts;
  get parts() {
    let E = this.shadowRoot != null ? this.shadowRoot : this;
    if (this._parts == null)
      this._parts = new Proxy({}, { get(M, L) {
        if (M[L] === undefined) {
          let f = E.querySelector(`[part="${L}"]`);
          if (f == null)
            f = E.querySelector(L);
          if (f == null)
            throw Error(`elementRef "${L}" does not exist!`);
          f.removeAttribute("data-ref"), M[L] = f;
        }
        return M[L];
      } });
    return this._parts;
  }
  attributeChangedCallback(E, M, L) {
    let f = EM(E);
    if (!this._legacyTrackedAttrs?.has(f))
      this.queueRender(false);
  }
  constructor() {
    super();
    if (UL += 1, this.constructor.formAssociated && typeof this.attachInternals === "function" && !this.internals)
      this.internals = this.attachInternals();
    let E = this.constructor.initAttributes;
    if (E)
      this._setupAttributeAccessors(E);
    this.instanceId = `${this.tagName.toLocaleLowerCase()}-${UL}`, this._value = n(this.defaultValue);
  }
  _setupAttributeAccessors(E) {
    if (!this._attrValues)
      this._attrValues = new Map;
    for (let M of Object.keys(E)) {
      let L = P(M), f = E[M];
      if (M === "value") {
        console.warn(`${this.tagName}: 'value' cannot be an attribute. Use the Component value property instead.`);
        continue;
      }
      if (typeof f === "object" && f !== null) {
        console.warn(`${this.tagName}: initAttributes.${M} is an object. Use a regular property instead.`);
        continue;
      }
      let H = this, $ = false;
      while (H) {
        let J = Object.getOwnPropertyDescriptor(H, M);
        if (J) {
          if (!J.configurable || J.get || J.set) {
            $ = true;
            break;
          }
          break;
        }
        H = Object.getPrototypeOf(H);
      }
      if ($)
        continue;
      Object.defineProperty(this, M, { enumerable: false, get: () => {
        if (typeof f === "boolean")
          return this.hasAttribute(L);
        else if (this.hasAttribute(L))
          return typeof f === "number" ? parseFloat(this.getAttribute(L)) : this.getAttribute(L);
        else if (this._attrValues.has(M))
          return this._attrValues.get(M);
        else
          return f;
      }, set: (J) => {
        if (typeof f === "boolean") {
          if (J !== this[M]) {
            if (J)
              this.setAttribute(L, "");
            else
              this.removeAttribute(L);
            this.queueRender();
          }
        } else if (typeof f === "number") {
          if (J !== parseFloat(this[M]))
            this.setAttribute(L, J), this.queueRender();
        } else if (typeof J === "object" || `${J}` !== `${this[M]}`) {
          if (J === null || J === undefined || typeof J === "object")
            this.removeAttribute(L);
          else
            this.setAttribute(L, J);
          this.queueRender(), this._attrValues.set(M, J);
        }
      } });
    }
  }
  connectedCallback() {
    if (Uf(this.constructor.tagName), this.hydrate(), this.role != null)
      this.setAttribute("role", this.role);
    if (this.constructor.formAssociated && !this.hasAttribute("tabindex"))
      this.setAttribute("tabindex", "0");
    if (this.onResize !== undefined) {
      if (WE.observe(this), this._onResize == null)
        this._onResize = this.onResize.bind(this);
      this.addEventListener("resize", this._onResize);
    }
    if (this.value != null && this.getAttribute("value") != null)
      this._value = this.getAttribute("value");
    if (this.internals && this.value !== undefined)
      this.internals.setFormValue(this.value), this.validateValue();
    this.queueRender();
  }
  disconnectedCallback() {
    WE.unobserve(this);
  }
  formResetCallback() {
    if (this.value !== undefined)
      this.value = this.defaultValue ?? "";
  }
  formDisabledCallback(E) {
    if (E)
      this.setAttribute("disabled", "");
    else
      this.removeAttribute("disabled");
  }
  formStateRestoreCallback(E) {
    if (this.value !== undefined && typeof E === "string")
      this.value = E;
  }
  _changeQueued = false;
  _renderQueued = false;
  queueRender(E = false) {
    if (!this._hydrated)
      return;
    if (!this._changeQueued)
      this._changeQueued = E;
    if (!this._renderQueued)
      this._renderQueued = true, requestAnimationFrame(() => {
        if (this._changeQueued) {
          if (aE(this, "change"), this.internals && this.value !== undefined)
            this.internals.setFormValue(this.value);
        }
        this._changeQueued = false, this._renderQueued = false, this.render();
      });
  }
  _hydrated = false;
  hydrate() {
    if (!this._hydrated) {
      this.initValue();
      let E = typeof this.content !== "function", M = typeof this.content === "function" ? this.content(I) : this.content;
      if (Array.isArray(M)) {
        let $ = {};
        M = M.filter((J) => {
          if (J instanceof Node || typeof J === "string" || typeof J === "number" || j(J))
            return true;
          return Object.assign($, J), false;
        });
        for (let J of Object.keys($))
          BE(this, J, $[J]);
      }
      let L = this.constructor, f = L.shadowStyleSpec ?? L.styleSpec;
      if (L.styleSpec && !L.shadowStyleSpec)
        R("static-styleSpec", "static styleSpec is deprecated. Use static shadowStyleSpec instead.");
      let { styleNode: H } = L;
      if (f)
        H = L.styleNode = I.style($E(f)), delete L.styleNode;
      if (this.styleNode)
        console.warn(this, "styleNode is deprecated, use static shadowStyleSpec instead"), H = this.styleNode;
      if (H) {
        let $ = this.attachShadow({ mode: "open" });
        $.appendChild(H.cloneNode(true)), eE($, M, E);
      } else if (M !== null) {
        let $ = Array.from(this.childNodes);
        eE(this, M, E), this.isSlotted = this.querySelector("slot,tosi-slot,xin-slot") !== undefined;
        let J = Array.from(this.querySelectorAll("slot"));
        if (J.length > 0)
          J.forEach(SE.replaceSlot);
        if ($.length > 0) {
          let Q = { "": this };
          Array.from(this.querySelectorAll("tosi-slot,xin-slot")).forEach((Z) => {
            Q[Z.name] = Z;
          }), $.forEach((Z) => {
            let Y = Q[""], F = Z instanceof Element ? Q[Z.slot] : Y;
            (F !== undefined ? F : Y).append(Z);
          });
        }
      }
      this._hydrated = true;
    }
  }
  render() {
    if (this._valueChanged && this.internals && this.value !== undefined)
      this.internals.setFormValue(this.value), this.validateValue();
    this._valueChanged = false;
  }
  validateValue() {
    if (!this.internals || this.value === undefined)
      return;
    let E = typeof this.value === "string" ? this.value : String(this.value);
    UM(this, E);
  }
}

class SE extends u {
  static preferredTagName = "tosi-slot";
  static initAttributes = { name: "" };
  content = null;
  static replaceSlot(E) {
    let M = document.createElement("tosi-slot");
    if (E.name !== "")
      M.setAttribute("name", E.name);
    E.replaceWith(M);
  }
}
var Df = SE.elementCreator();

class DL extends u {
  static preferredTagName = "xin-slot";
  static initAttributes = { name: "" };
  content = null;
  constructor() {
    super();
    R("xin-slot", "<xin-slot> is deprecated. Use <tosi-slot> instead.");
  }
  static replaceSlot = SE.replaceSlot;
}
var Kf = DL.elementCreator();
var OM = new Set;
var AM = new Set;
var qM = new Map;
var wM = new Set;
var jM = "1.6.2";
function xE(E) {
  return Object.assign(x, E), x;
}
function yE(E) {
  return R("boxedProxy", "boxedProxy is deprecated, please use tosi() instead"), xE(E);
}
var yf = new FinalizationRegistry((E) => {
  E();
});
function VM(E, M = false) {
  if (M)
    return R("xinProxy-boxed", "xinProxy(..., true) is deprecated; use tosi(...) instead"), yE(E);
  return Object.keys(E).forEach((L) => {
    k[L] = E[L];
  }), k;
}
var mf = {};
async function PE(E, M) {
  let L = await M(E, { Color: X, Component: u, elements: I, svgElements: ZM, mathML: QM, varDefault: kE, vars: fM, xin: k, boxed: x, xinProxy: VM, boxedProxy: yE, tosi: xE, makeComponent: PE, bind: v, on: XE, version: jM }), { type: f } = L;
  f.preferredTagName = E;
  let H = L.lightStyleSpec ?? L.styleSpec;
  if (H)
    f.lightStyleSpec = H;
  let $ = { type: f, creator: f.elementCreator() };
  return mf[E] = $, $;
}
var mE = { ":host": { display: "none" } };
var TM = {};
var bf = (E) => import(E);

class bE extends u {
  static preferredTagName = "tosi-blueprint";
  static lightStyleSpec = mE;
  static initAttributes = { tag: "anon-elt", src: "", property: "default" };
  loaded;
  blueprintLoaded = (E) => {};
  async packaged() {
    let { tag: E, src: M, property: L } = this, f = `${E}.${L}:${M}`;
    if (!this.loaded) {
      if (TM[f] === undefined)
        TM[f] = bf(M).then((H) => {
          let $ = H[L];
          return PE(E, $);
        });
      else
        console.log(`using cached ${E} with signature ${f}`);
      this.loaded = await TM[f], this.blueprintLoaded(this.loaded);
    }
    return this.loaded;
  }
}
var cf = bE.elementCreator();

class RM extends u {
  static preferredTagName = "tosi-loader";
  static lightStyleSpec = mE;
  allLoaded = () => {};
  async load() {
    let M = Array.from(this.querySelectorAll("tosi-blueprint, xin-blueprint")).filter((L) => L.src).map((L) => L.packaged());
    await Promise.all(M), this.allLoaded();
  }
  connectedCallback() {
    super.connectedCallback(), this.load();
  }
}
var vf = RM.elementCreator();

class CL extends bE {
  static preferredTagName = "xin-blueprint";
  static lightStyleSpec = mE;
  constructor() {
    super();
    R("xin-blueprint", "<xin-blueprint> is deprecated. Use <tosi-blueprint> instead.");
  }
}
var uf = CL.elementCreator();

class wL extends u {
  static preferredTagName = "xin-loader";
  static lightStyleSpec = mE;
  allLoaded = () => {};
  constructor() {
    super();
    R("xin-loader", "<xin-loader> is deprecated. Use <tosi-loader> instead.");
  }
  async load() {
    let M = Array.from(this.querySelectorAll("xin-blueprint")).filter((L) => L.src).map((L) => L.packaged());
    await Promise.all(M), this.allLoaded();
  }
  connectedCallback() {
    super.connectedCallback(), this.load();
  }
}
var gf = wL.elementCreator();

// src/tosi-product.ts
var { div, slot } = I;
function isColor(s2) {
  const t2 = s2.trim();
  return t2.startsWith("#") || t2.startsWith("rgb") || t2.startsWith("hsl") || t2.startsWith("color(") || ["red", "blue", "green", "white", "black", "transparent", "currentColor"].includes(t2);
}
function interpolateThemeValue(from, to, t2) {
  if (from === to || t2 <= 0)
    return from;
  if (t2 >= 1)
    return to;
  if (isColor(from) && isColor(to)) {
    return `color-mix(in srgb, ${from} ${(1 - t2) * 100}%, ${to})`;
  }
  const numRegex = /-?\d+(?:\.\d+)?/g;
  const aNums = Array.from(from.matchAll(numRegex));
  const bNums = Array.from(to.matchAll(numRegex));
  if (aNums.length > 0 && aNums.length === bNums.length) {
    let result = "";
    let lastIndex = 0;
    for (let i2 = 0;i2 < aNums.length; i2++) {
      const am = aNums[i2];
      const bm = bNums[i2];
      result += from.substring(lastIndex, am.index);
      const v2 = parseFloat(am[0]) + (parseFloat(bm[0]) - parseFloat(am[0])) * t2;
      result += v2.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
      lastIndex = am.index + am[0].length;
    }
    result += from.substring(lastIndex);
    return result;
  }
  return t2 < 0.5 ? from : to;
}
var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function getScrollParent(el) {
  let node = el.parentElement;
  while (node) {
    if (node === document.body || node === document.documentElement)
      break;
    const { overflow, overflowX, overflowY } = getComputedStyle(node);
    if (/(auto|scroll)/.test(overflow + overflowX + overflowY))
      return node;
    node = node.parentElement;
  }
  return window;
}
function findEnclosingSection(el) {
  let node = el.parentElement;
  while (node) {
    if (node.tagName.toLowerCase() === "tosi-product-section") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}
function nearestEnclosingProduct(el) {
  let node = el;
  while (node) {
    if (node.tagName.toLowerCase() === "tosi-product")
      return node;
    node = node.parentElement;
  }
  return null;
}

class TosiProduct extends u {
  static initAttributes = {
    direction: "vertical",
    debug: false
  };
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      background: "var(--bg, #000)",
      color: "var(--fg, #fff)"
    },
    ".window": {
      position: "sticky",
      top: "0",
      left: "0",
      width: "100%",
      height: "var(--tosi-view-size, 100vh)",
      overflow: "hidden"
    },
    ":host([direction=horizontal])": {
      display: "inline-block",
      width: "max-content"
    },
    ":host([direction=horizontal]) .window": {
      width: "var(--tosi-view-size, 100vw)",
      height: "100%"
    },
    ".stack": {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      willChange: "transform"
    },
    ":host([direction=horizontal]) .stack": {
      display: "flex",
      flexDirection: "row",
      width: "max-content",
      height: "100%"
    },
    ".debug-panel": {
      position: "fixed",
      top: "10px",
      right: "10px",
      background: "rgba(0,0,0,0.85)",
      color: "#0f0",
      padding: "6px 10px",
      fontFamily: "monospace",
      fontSize: "11px",
      borderRadius: "4px",
      zIndex: 1000,
      pointerEvents: "none",
      whiteSpace: "pre"
    }
  };
  content = () => [
    div({ class: "window", part: "window" }, div({ class: "stack", part: "stack" }, slot())),
    div({ class: "debug-panel", part: "debug", hidden: true })
  ];
  themes = {};
  defaultTheme = "";
  themeTarget = document.documentElement;
  _scrollTarget = null;
  _stack = null;
  _window = null;
  _debugPanel = null;
  _resizeObserver = null;
  _mutationObserver = null;
  _items = [];
  _totalRunway = 0;
  _scrollHandler = () => this._scheduleUpdate();
  _rafPending = false;
  _isNested = false;
  _injectedProgress = 0;
  _appliedThemeKeys = new Set;
  connectedCallback() {
    super.connectedCallback();
    this._stack = this.shadowRoot?.querySelector(".stack");
    this._window = this.shadowRoot?.querySelector(".window");
    this._debugPanel = this.shadowRoot?.querySelector(".debug-panel");
    this._isNested = !!findEnclosingSection(this);
    if (this._isNested) {
      this.setAttribute("data-scroll-animate", "tosi-product");
      if (this._window) {
        this._window.style.position = "relative";
        this._window.style.width = "100%";
        this._window.style.height = "100%";
      }
      this.style.width = "100%";
      this.style.height = "100%";
      this.style.display = "block";
      if (this.themeTarget === document.documentElement) {
        this.themeTarget = this;
      }
    } else {
      this._scrollTarget = getScrollParent(this);
      this._scrollTarget.addEventListener("scroll", this._scrollHandler, {
        passive: true
      });
      window.addEventListener("resize", this._scrollHandler, { passive: true });
    }
    this._mutationObserver = new MutationObserver(() => this._relayout());
    this._mutationObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ["scroll"]
    });
    this._resizeObserver = new ResizeObserver(() => this._relayout());
    for (const child of Array.from(this.children)) {
      if (child instanceof HTMLElement)
        this._resizeObserver.observe(child);
    }
    this._resizeObserver.observe(this);
    requestAnimationFrame(() => {
      this._relayout();
      this._update();
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (!this._isNested) {
      this._scrollTarget?.removeEventListener("scroll", this._scrollHandler);
      window.removeEventListener("resize", this._scrollHandler);
    }
    this._mutationObserver?.disconnect();
    this._resizeObserver?.disconnect();
  }
  setScrollProgress(progress) {
    if (!this._isNested)
      return;
    this._injectedProgress = Math.max(0, Math.min(1, progress));
    this._update();
  }
  _isHorizontal() {
    return this.getAttribute("direction") === "horizontal";
  }
  _viewSize() {
    const horizontal = this._isHorizontal();
    if (this._isNested) {
      return horizontal ? this.clientWidth : this.clientHeight;
    }
    if (this._scrollTarget instanceof HTMLElement) {
      return horizontal ? this._scrollTarget.clientWidth : this._scrollTarget.clientHeight;
    }
    return horizontal ? window.innerWidth : window.innerHeight;
  }
  _scrollPos() {
    const horizontal = this._isHorizontal();
    if (this._scrollTarget instanceof HTMLElement) {
      return horizontal ? this._scrollTarget.scrollLeft : this._scrollTarget.scrollTop;
    }
    return horizontal ? window.scrollX : window.scrollY;
  }
  _hostStart() {
    const horizontal = this._isHorizontal();
    const rect = this.getBoundingClientRect();
    let edge = horizontal ? rect.left : rect.top;
    if (this._scrollTarget instanceof HTMLElement) {
      const containerRect = this._scrollTarget.getBoundingClientRect();
      edge -= horizontal ? containerRect.left : containerRect.top;
    }
    return this._scrollPos() + edge;
  }
  _relayout() {
    if (!this._stack)
      return;
    const horizontal = this._isHorizontal();
    const view = this._viewSize();
    this.style.setProperty("--tosi-view-size", `${view}px`);
    const items = [];
    let cumOffset = 0;
    let cumRunway = 0;
    for (const child of Array.from(this.children)) {
      if (!(child instanceof HTMLElement))
        continue;
      const isSection = child.tagName.toLowerCase() === "tosi-product-section";
      const naturalSize = horizontal ? child.offsetWidth : child.offsetHeight;
      let pinDuration = 0;
      if (isSection) {
        const scrollAttr = child.getAttribute("scroll");
        if (scrollAttr !== null) {
          const pct = Number(scrollAttr);
          if (Number.isFinite(pct) && pct >= 0) {
            pinDuration = pct / 100 * view;
          }
        } else {
          pinDuration = view;
        }
      }
      const exitDuration = naturalSize;
      const rangeStart = cumRunway;
      const pinEnd = rangeStart + pinDuration;
      const rangeEnd = pinEnd + exitDuration;
      items.push({
        element: child,
        isSection,
        naturalSize,
        pinDuration,
        exitDuration,
        offset: cumOffset,
        rangeStart,
        pinEnd,
        rangeEnd
      });
      cumOffset += naturalSize;
      cumRunway += pinDuration + exitDuration;
    }
    this._items = items;
    this._totalRunway = cumRunway;
    if (!this._isNested) {
      const hostDim = horizontal ? "width" : "height";
      this.style[hostDim] = `${cumRunway + view}px`;
    }
    this._update();
  }
  _scheduleUpdate() {
    if (this._rafPending)
      return;
    this._rafPending = true;
    requestAnimationFrame(() => {
      this._rafPending = false;
      this._update();
    });
  }
  _update() {
    if (!this._stack || this._items.length === 0)
      return;
    const horizontal = this._isHorizontal();
    const view = this._viewSize();
    const local = this._isNested ? this._injectedProgress * this._totalRunway : this._scrollPos() - this._hostStart();
    const last = this._items[this._items.length - 1];
    const stackSize = last.offset + last.naturalSize;
    const minTranslate = -Math.max(0, stackSize - view);
    let translate = 0;
    let activeIdx = -1;
    let activeProgress = 0;
    if (local <= 0) {
      translate = 0;
      activeIdx = 0;
      activeProgress = 0;
    } else if (local >= this._totalRunway) {
      translate = minTranslate;
      activeIdx = this._items.length - 1;
      activeProgress = 1;
    } else {
      for (let i2 = 0;i2 < this._items.length; i2++) {
        const item = this._items[i2];
        if (local < item.rangeStart || local >= item.rangeEnd)
          continue;
        if (local < item.pinEnd) {
          translate = -item.offset;
          activeProgress = item.pinDuration > 0 ? (local - item.rangeStart) / item.pinDuration : 1;
        } else {
          const exitProgress = (local - item.pinEnd) / item.exitDuration;
          translate = -item.offset - exitProgress * item.naturalSize;
          activeProgress = 1;
        }
        activeIdx = i2;
        break;
      }
    }
    if (translate < minTranslate)
      translate = minTranslate;
    const axis = horizontal ? "X" : "Y";
    this._stack.style.transform = `translate${axis}(${translate}px)`;
    for (let i2 = 0;i2 < this._items.length; i2++) {
      const item = this._items[i2];
      if (!item.isSection)
        continue;
      let progress;
      if (i2 < activeIdx)
        progress = 1;
      else if (i2 > activeIdx)
        progress = 0;
      else
        progress = activeProgress;
      this._notify(item.element, progress);
    }
    this._applyTheme(activeIdx, activeProgress);
    if (this._debugPanel) {
      const showDebug = this.getAttribute("debug") === "true";
      this._debugPanel.hidden = !showDebug;
      if (showDebug) {
        this._debugPanel.textContent = `local: ${local.toFixed(0)}px / ${this._totalRunway.toFixed(0)}
` + `translate${axis}: ${translate.toFixed(0)}px
` + `active: #${activeIdx} @ ${activeProgress.toFixed(3)}`;
      }
    }
  }
  _notify(section, progress) {
    section.dataset.progress = progress.toFixed(3);
    if (typeof section.setScrollProgress === "function") {
      section.setScrollProgress(progress);
    }
  }
  _applyTheme(activeIdx, activeProgress) {
    const themeNames = Object.keys(this.themes);
    if (themeNames.length === 0)
      return;
    let fromName = this.defaultTheme;
    let toName = this.defaultTheme;
    let t2 = 0;
    let themeIdx = activeIdx;
    while (themeIdx >= 0) {
      const it = this._items[themeIdx];
      const el = it.element;
      const themeAttr = el.getAttribute("theme");
      const fromAttr = el.getAttribute("theme-from");
      const toAttr = el.getAttribute("theme-to");
      if (themeAttr || fromAttr || toAttr) {
        if (fromAttr && toAttr) {
          fromName = fromAttr;
          toName = toAttr;
          t2 = themeIdx === activeIdx ? activeProgress : 1;
        } else {
          const single = themeAttr || fromAttr || toAttr;
          fromName = single;
          toName = single;
        }
        break;
      }
      themeIdx--;
    }
    const fromTheme = this.themes[fromName];
    const toTheme = this.themes[toName];
    if (!fromTheme && !toTheme)
      return;
    const target = this.themeTarget;
    const allKeys = new Set([
      ...Object.keys(fromTheme || {}),
      ...Object.keys(toTheme || {})
    ]);
    const seen = new Set;
    for (const key of allKeys) {
      const fromVal = fromTheme?.[key] ?? toTheme?.[key];
      const toVal = toTheme?.[key] ?? fromTheme?.[key];
      if (fromVal === undefined || toVal === undefined)
        continue;
      const value = interpolateThemeValue(fromVal, toVal, t2);
      target.style.setProperty(key, value);
      seen.add(key);
    }
    for (const key of this._appliedThemeKeys) {
      if (!seen.has(key))
        target.style.removeProperty(key);
    }
    this._appliedThemeKeys = seen;
  }
}

class TosiProductSection extends u {
  static initAttributes = {
    scroll: 100
  };
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%"
    }
  };
  content = () => slot();
  scrollCallback = null;
  setScrollProgress(progress) {
    if (reducedMotion.matches) {
      if (this.scrollCallback)
        this.scrollCallback(progress, this);
      return;
    }
    const myProduct = this.closest("tosi-product");
    const animators = this.querySelectorAll("[data-scroll-animate], [data-scroll-range]");
    for (const el of Array.from(animators)) {
      const ownerProduct = nearestEnclosingProduct(el === this ? null : el.parentElement);
      if (ownerProduct !== myProduct)
        continue;
      const rangeStr = el.getAttribute("data-scroll-range") || "0,1";
      const [start, end] = rangeStr.split(",").map(Number);
      const range = end - start;
      const localProgress = range <= 0 ? progress >= end ? 1 : 0 : Math.max(0, Math.min(1, (progress - start) / range));
      el.style.setProperty("--local-progress", localProgress.toString());
      el.dataset.localProgress = localProgress.toFixed(3);
      if (typeof el.setScrollProgress === "function") {
        el.setScrollProgress(localProgress);
      } else if (el.getAttribute("data-scroll-animate") === "currentTime" && el.duration) {
        el.currentTime = localProgress * el.duration;
      } else if (el.getAttribute("data-scroll-animate") === "lottie" && el.animation && typeof el.animation.goToAndStop === "function") {
        const total = el.animation.totalFrames || 0;
        el.animation.goToAndStop(localProgress * total, true);
      }
    }
    if (this.scrollCallback)
      this.scrollCallback(progress, this);
  }
}

class TosiProductHeader extends u {
  static initAttributes = {
    threshold: 50
  };
  static styleSpec = {
    ":host": {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      zIndex: "100",
      transform: "translateY(-100%)",
      transition: "transform 0.3s ease",
      pointerEvents: "auto"
    },
    ":host([data-visible=true])": {
      transform: "translateY(0)"
    }
  };
  content = () => slot();
  _scrollHandler = () => this._update();
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this._scrollHandler, { passive: true });
    this._update();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("scroll", this._scrollHandler);
  }
  _update() {
    const threshold = Number(this.getAttribute("threshold")) || 50;
    this.dataset.visible = window.scrollY > threshold ? "true" : "false";
  }
}
var tosiProduct = TosiProduct.elementCreator({
  tag: "tosi-product"
});
var tosiProductSection = TosiProductSection.elementCreator({
  tag: "tosi-product-section"
});
var tosiProductHeader = TosiProductHeader.elementCreator({
  tag: "tosi-product-header"
});

// demo/embed.ts
var { div: div2, header, footer, section, h1, h2, h3, p: p2, span } = I;
var style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: 0; background: #0a0a0a; color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  /* Page header — sibling above tosi-product */
  .page-header {
    background: #1a1a2e;
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #333;
  }
  .page-header h1 { margin: 0; font-size: 1.4rem; }
  .page-header p { margin: 0.25em 0 0; color: #888; font-size: 0.9rem; }

  /* Page footer — sibling below tosi-product */
  .page-footer {
    background: #1a1a2e;
    padding: 2rem;
    text-align: center;
    border-top: 2px solid #333;
    color: #888;
  }

  /* Outer panel content */
  .outer-panel {
    height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
  }
  .outer-panel h2 { font-size: 2.5rem; margin: 0 0 0.4em; }
  .outer-panel p { color: #aaa; max-width: 480px; margin: 0; padding: 0 1rem; }
  .outer-a { background: linear-gradient(180deg, #102030 0%, #051020 100%); }
  .outer-c { background: linear-gradient(180deg, #2a1030 0%, #100520 100%); }

  /* Nested horizontal tosi-product container */
  .nested-host {
    height: 100vh;
    background: #082010;
    display: flex; flex-direction: column;
  }
  .nested-host h2 {
    margin: 0; padding: 1rem 2rem; font-size: 1.4rem; flex-shrink: 0;
  }
  .nested-host .nested-frame {
    flex: 1; min-height: 0; overflow: hidden;
    border: 1px dashed #888;
    margin: 0 1rem 1rem;
  }
  /* Inner horizontal sub-panels — size to engine's published view size,
     not 100vw (which would overflow the embedded host's container). */
  .h-panel {
    width: var(--tosi-view-size, 100vw); height: 100%;
    display: flex; align-items: center; justify-content: center;
    text-align: center; font-size: 2rem; font-weight: 600;
    flex-shrink: 0;
  }
  .h-a { background: #1a4030; }
  .h-b { background: #1a2050; }
  .h-c { background: #501a30; }

  .marker {
    display: inline-block;
    background: rgba(255,255,255,0.1);
    padding: 0.4em 0.9em; border-radius: 999px;
    font-family: monospace; font-size: 0.8rem;
    margin-top: 1em;
  }
`;
document.head.appendChild(style);
var pageHeader = header({ class: "page-header" }, h1("v2 embeddability test"), p2("Page header above. tosi-product below. Footer below that. Inside the middle vertical section: a nested horizontal tosi-product."));
var innerHorizontal = tosiProduct({ direction: "horizontal" }, tosiProductSection({ scroll: 100 }, div2({ class: "h-panel h-a" }, "Inner H-1", span({ class: "marker" }, "horizontal section"))), tosiProductSection({ scroll: 100 }, div2({ class: "h-panel h-b" }, "Inner H-2", span({ class: "marker" }, "horizontal section"))), tosiProductSection({ scroll: 100 }, div2({ class: "h-panel h-c" }, "Inner H-3", span({ class: "marker" }, "horizontal section"))));
var outerEngine = tosiProduct(tosiProductSection({ scroll: 100 }, div2({ class: "outer-panel outer-a" }, h2("Outer Section A"), p2("Vertical tosi-product. Page header above me, footer below the engine."), span({ class: "marker" }, "outer / vertical"))), tosiProductSection({ scroll: 200 }, div2({ class: "nested-host" }, h2("Outer Section B — contains nested horizontal engine"), div2({ class: "nested-frame" }, innerHorizontal))), tosiProductSection({ scroll: 100 }, div2({ class: "outer-panel outer-c" }, h2("Outer Section C"), p2("Engine continues vertically after the nested region."), span({ class: "marker" }, "outer / vertical"))));
var pageFooter = footer({ class: "page-footer" }, p2("Page footer below. If you can see this after scrolling past the engine, embeddability works."));
document.body.appendChild(pageHeader);
document.body.appendChild(outerEngine);
document.body.appendChild(pageFooter);
