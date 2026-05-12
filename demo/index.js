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
var lM = false;
function gL() {
  if (!lM)
    lM = true, RE.add(() => X.queueRecompute());
}
function nL() {
  gL();
  for (let E of RE)
    E();
}
function hL(E, M) {
  let L = C(M), f = I.style($E(L));
  f.id = E, document.head.append(f);
  let H = j(M);
  if (H !== undefined)
    KE(H, () => {
      f.textContent = $E(C(M)), nL();
    });
}
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
var rL = (E) => {
  let M = {};
  for (let L of Object.keys(E)) {
    let f = E[L];
    if (f instanceof X)
      M[L] = f.inverseLuminance;
    else if (typeof f === "string" && f.match(/^(#[0-9a-fA-F]{3}|rgba?\(|hsla?\()/))
      M[L] = X.fromCss(f).inverseLuminance;
  }
  return M;
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
var KE = (E, M) => {
  let L = typeof M === "function" ? M : k[M];
  if (typeof L !== "function")
    throw Error(`observe expects a function or path to a function, ${M} is neither`);
  return i(E, L);
};
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

// src/tosi-interpolator.ts
var interpolateStrings = (a2, b2, t2) => {
  const numRegex = /-?\d+(?:\.\d+)?/g;
  const aNums = Array.from(a2.matchAll(numRegex));
  const bNums = Array.from(b2.matchAll(numRegex));
  if (aNums.length > 0 && aNums.length === bNums.length) {
    let result = "";
    let lastIndex = 0;
    for (let i2 = 0;i2 < aNums.length; i2++) {
      const aMatch = aNums[i2];
      const bMatch = bNums[i2];
      result += a2.substring(lastIndex, aMatch.index);
      const n1 = parseFloat(aMatch[0]);
      const n2 = parseFloat(bMatch[0]);
      const interpolated = n1 + (n2 - n1) * t2;
      let numStr = interpolated.toFixed(4);
      if (numStr.includes(".")) {
        numStr = numStr.replace(/0+$/, "").replace(/\.$/, "");
      }
      result += numStr;
      lastIndex = aMatch.index + aMatch[0].length;
    }
    result += a2.substring(lastIndex);
    return result;
  }
  const isColor2 = (s2) => s2.startsWith("#") || s2.startsWith("rgb") || s2.startsWith("hsl") || ["red", "blue", "white", "black", "transparent"].includes(s2);
  if (isColor2(a2) && isColor2(b2)) {
    return `color-mix(in srgb, ${a2} ${Math.round((1 - t2) * 100)}%, ${b2})`;
  }
  return t2 < 0.5 ? a2 : b2;
};

class TosiInterpolator extends u {
  static styleSpec = {
    ":host": {
      display: "contents"
    }
  };
  setScrollProgress(progress) {
    const waypointsNodes = Array.from(this.querySelectorAll("tosi-waypoint"));
    if (waypointsNodes.length === 0)
      return;
    const waypoints = waypointsNodes.map((w) => {
      const styles = {};
      const htmlEl = w;
      for (let i2 = 0;i2 < htmlEl.style.length; i2++) {
        const prop = htmlEl.style[i2];
        styles[prop] = htmlEl.style.getPropertyValue(prop);
      }
      return {
        progress: Number(w.getAttribute("progress") || 0),
        styles
      };
    }).sort((a2, b2) => a2.progress - b2.progress);
    let wp1 = waypoints[0];
    let wp2 = waypoints[waypoints.length - 1];
    let t2 = 0;
    if (progress <= wp1.progress) {
      wp2 = wp1;
      t2 = 0;
    } else if (progress >= wp2.progress) {
      wp1 = wp2;
      t2 = 1;
    } else {
      for (let i2 = 0;i2 < waypoints.length - 1; i2++) {
        if (progress >= waypoints[i2].progress && progress <= waypoints[i2 + 1].progress) {
          wp1 = waypoints[i2];
          wp2 = waypoints[i2 + 1];
          const rawT = (progress - wp1.progress) / (wp2.progress - wp1.progress);
          const easing = this.getAttribute("easing");
          if (easing === "ease-in-out") {
            t2 = rawT < 0.5 ? 2 * rawT * rawT : -1 + (4 - 2 * rawT) * rawT;
          } else {
            t2 = rawT;
          }
          break;
        }
      }
    }
    const currentStyles = {};
    for (const prop in wp1.styles) {
      const val1 = wp1.styles[prop];
      const val2 = wp2.styles[prop] || val1;
      currentStyles[prop] = interpolateStrings(val1, val2, t2);
    }
    const targets = Array.from(this.children).filter((c2) => c2.tagName !== "TOSI-WAYPOINT");
    targets.forEach((target) => {
      const el = target;
      for (const prop in currentStyles) {
        el.style.setProperty(prop, currentStyles[prop]);
      }
    });
  }
}

class TosiWaypoint extends u {
  static initAttributes = {
    progress: 0
  };
  static styleSpec = {
    ":host": {
      display: "none"
    }
  };
  content = null;
}
var tosiInterpolator = TosiInterpolator.elementCreator({
  tag: "tosi-interpolator"
});
var tosiWaypoint = TosiWaypoint.elementCreator({
  tag: "tosi-waypoint"
});

// src/tosi-filmstrip.ts
var { canvas } = I;

class TosiFilmstrip extends u {
  static initAttributes = {
    src: "",
    cols: 0,
    rows: 0,
    total: 0
  };
  _img = null;
  _ctx = null;
  _lastProgress = 0;
  _canvas = null;
  _loadedSrc = "";
  _loadId = 0;
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      height: "100%"
    },
    canvas: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block"
    }
  };
  content = () => {
    this._canvas = canvas({ part: "canvas" });
    return this._canvas;
  };
  _parseGrid() {
    const src = this.getAttribute("src") || "";
    let cols = Number(this.getAttribute("cols")) || 0;
    let rows = Number(this.getAttribute("rows")) || 0;
    let total = Number(this.getAttribute("total")) || 0;
    if (!cols || !rows || !total) {
      const match = src.match(/(\d+)x(\d+)_(\d+)\.(webp|jpg|png|data)/i);
      if (match) {
        if (!cols)
          cols = parseInt(match[1]);
        if (!rows)
          rows = parseInt(match[2]);
        if (!total)
          total = parseInt(match[3]);
      }
    }
    if (!total || !cols || !rows)
      return null;
    return { cols, rows, total };
  }
  load() {
    const src = this.getAttribute("src") || "";
    if (!src)
      return;
    const grid = this._parseGrid();
    if (!grid)
      return;
    const loadId = ++this._loadId;
    this._loadedSrc = src;
    const img = new Image;
    img.onload = () => {
      if (loadId !== this._loadId)
        return;
      this._img = img;
      this.setScrollProgress(this._lastProgress);
    };
    img.onerror = () => {
      if (loadId !== this._loadId)
        return;
      console.warn(`[tosi-filmstrip] Failed to load: ${src}`);
      this._img = null;
    };
    img.src = src;
  }
  setScrollProgress(progress) {
    this._lastProgress = progress;
    if (!this._img)
      return;
    const grid = this._parseGrid();
    if (!grid)
      return;
    const { cols, rows, total } = grid;
    const cvs = this._canvas || this.parts && this.parts.canvas;
    if (!cvs)
      return;
    if (!this._ctx)
      this._ctx = cvs.getContext("2d");
    if (!this._ctx)
      return;
    const frameIndex = Math.max(0, Math.min(total - 1, Math.floor(progress * total)));
    const col = frameIndex % cols;
    const row = Math.floor(frameIndex / cols);
    const fw = this._img.width / cols;
    const fh = this._img.height / rows;
    if (cvs.width !== fw || cvs.height !== fh) {
      cvs.width = fw;
      cvs.height = fh;
    }
    this._ctx.clearRect(0, 0, fw, fh);
    this._ctx.drawImage(this._img, col * fw, row * fh, fw, fh, 0, 0, fw, fh);
  }
  connectedCallback() {
    super.connectedCallback();
    this.load();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._loadId++;
    this._img = null;
  }
  render() {
    super.render();
    const currentSrc = this.getAttribute("src") || "";
    if (!this._img || this._loadedSrc !== currentSrc) {
      this.load();
    } else {
      this.setScrollProgress(this._lastProgress);
    }
  }
}
var tosiFilmstrip = TosiFilmstrip.elementCreator({
  tag: "tosi-filmstrip"
});

// src/tosi-code.ts
var prismLoaded = null;
function loadPrism() {
  if (prismLoaded)
    return prismLoaded;
  prismLoaded = new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism-tomorrow.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js";
    script.onload = () => {
      const markup = document.createElement("script");
      markup.src = "https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-markup.min.js";
      markup.onload = () => resolve();
      document.head.appendChild(markup);
    };
    document.head.appendChild(script);
  });
  return prismLoaded;
}

class TosiCode extends u {
  static initAttributes = {
    language: "html"
  };
  static lightStyleSpec = {
    ":host": {
      display: "block"
    },
    ":host pre": {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px",
      padding: "1.5em",
      fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
      lineHeight: 1.6,
      maxWidth: "90vw",
      overflowX: "auto",
      backdropFilter: "blur(20px)",
      margin: "1em 0 0",
      textAlign: "left"
    },
    ":host code": {
      fontFamily: "Consolas, Monaco, 'Courier New', monospace",
      whiteSpace: "pre"
    }
  };
  content = null;
  connectedCallback() {
    super.connectedCallback();
    this._highlight();
  }
  async _highlight() {
    const raw = this.textContent || "";
    if (!raw.trim())
      return;
    await loadPrism();
    const lang = this.language || "html";
    const grammar = globalThis.Prism?.languages?.[lang];
    const codeEl = document.createElement("code");
    codeEl.className = `language-${lang}`;
    if (grammar) {
      codeEl.innerHTML = globalThis.Prism.highlight(raw.trim(), grammar, lang);
    } else {
      codeEl.textContent = raw.trim();
    }
    const preEl = document.createElement("pre");
    preEl.appendChild(codeEl);
    this.textContent = "";
    this.appendChild(preEl);
  }
}
var tosiCode = TosiCode.elementCreator({ tag: "tosi-code" });

// node_modules/marked/lib/marked.esm.js
function L() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var T2 = L();
function G(l2) {
  T2 = l2;
}
var E = { exec: () => null };
function d(l2, e2 = "") {
  let t2 = typeof l2 == "string" ? l2 : l2.source, n2 = { replace: (r2, i2) => {
    let s2 = typeof i2 == "string" ? i2 : i2.source;
    return s2 = s2.replace(m2.caret, "$1"), t2 = t2.replace(r2, s2), n2;
  }, getRegex: () => new RegExp(t2, e2) };
  return n2;
}
var be = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return false;
  }
})();
var m2 = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (l2) => new RegExp(`^( {0,3}${l2})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}#`), htmlBeginRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}<(?:[a-z].*>|!--)`, "i") };
var Re = /^(?:[ \t]*(?:\n|$))+/;
var Te = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var Oe = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var I2 = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var we = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var F = /(?:[*+-]|\d{1,9}[.)])/;
var ie = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var oe = d(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var ye = d(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var j2 = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var Pe = /^[^\n]+/;
var Q = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var Se = d(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Q).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var $e = d(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, F).getRegex();
var v2 = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var _e = d("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))", "i").replace("comment", U).replace("tag", v2).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var ae = d(j2).replace("hr", I2).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v2).getRegex();
var Le = d(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ae).getRegex();
var K = { blockquote: Le, code: Te, def: Se, fences: Oe, heading: we, hr: I2, html: _e, lheading: oe, list: $e, newline: Re, paragraph: ae, table: E, text: Pe };
var re = d("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", I2).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}\t)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v2).getRegex();
var Me = { ...K, lheading: ye, table: re, paragraph: d(j2).replace("hr", I2).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v2).getRegex() };
var ze = { ...K, html: d(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: E, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: d(j2).replace("hr", I2).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", oe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var Ae = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var Ee = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var le = /^( {2,}|\\)\n(?!\s*$)/;
var Ie = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var D = /[\p{P}\p{S}]/u;
var W = /[\s\p{P}\p{S}]/u;
var ue = /[^\s\p{P}\p{S}]/u;
var Ce = d(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, W).getRegex();
var pe = /(?!~)[\p{P}\p{S}]/u;
var Be = /(?!~)[\s\p{P}\p{S}]/u;
var qe = /(?:[^\s\p{P}\p{S}]|~)/u;
var ve = d(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", be ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ce = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var De = d(ce, "u").replace(/punct/g, D).getRegex();
var He = d(ce, "u").replace(/punct/g, pe).getRegex();
var he = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var Ze = d(he, "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex();
var Ge = d(he, "gu").replace(/notPunctSpace/g, qe).replace(/punctSpace/g, Be).replace(/punct/g, pe).getRegex();
var Ne = d("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex();
var Fe = d(/\\(punct)/, "gu").replace(/punct/g, D).getRegex();
var je = d(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var Qe = d(U).replace("(?:-->|$)", "-->").getRegex();
var Ue = d("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Qe).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/;
var Ke = d(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var de = d(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", Q).getRegex();
var ke = d(/^!?\[(ref)\](?:\[\])?/).replace("ref", Q).getRegex();
var We = d("reflink|nolink(?!\\()", "g").replace("reflink", de).replace("nolink", ke).getRegex();
var se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var X2 = { _backpedal: E, anyPunctuation: Fe, autolink: je, blockSkip: ve, br: le, code: Ee, del: E, emStrongLDelim: De, emStrongRDelimAst: Ze, emStrongRDelimUnd: Ne, escape: Ae, link: Ke, nolink: ke, punctuation: Ce, reflink: de, reflinkSearch: We, tag: Ue, text: Ie, url: E };
var Xe = { ...X2, link: d(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: d(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() };
var N2 = { ...X2, emStrongRDelimAst: Ge, emStrongLDelim: He, url: d(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: d(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", se).getRegex() };
var Je = { ...N2, br: d(le).replace("{2,}", "*").getRegex(), text: d(N2.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var C2 = { normal: K, gfm: Me, pedantic: ze };
var M = { normal: X2, gfm: N2, breaks: Je, pedantic: Xe };
var Ve = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ge = (l2) => Ve[l2];
function w(l2, e2) {
  if (e2) {
    if (m2.escapeTest.test(l2))
      return l2.replace(m2.escapeReplace, ge);
  } else if (m2.escapeTestNoEncode.test(l2))
    return l2.replace(m2.escapeReplaceNoEncode, ge);
  return l2;
}
function J(l2) {
  try {
    l2 = encodeURI(l2).replace(m2.percentDecode, "%");
  } catch {
    return null;
  }
  return l2;
}
function V2(l2, e2) {
  let t2 = l2.replace(m2.findPipe, (i2, s2, a2) => {
    let o2 = false, p2 = s2;
    for (;--p2 >= 0 && a2[p2] === "\\"; )
      o2 = !o2;
    return o2 ? "|" : " |";
  }), n2 = t2.split(m2.splitPipe), r2 = 0;
  if (n2[0].trim() || n2.shift(), n2.length > 0 && !n2.at(-1)?.trim() && n2.pop(), e2)
    if (n2.length > e2)
      n2.splice(e2);
    else
      for (;n2.length < e2; )
        n2.push("");
  for (;r2 < n2.length; r2++)
    n2[r2] = n2[r2].trim().replace(m2.slashPipe, "|");
  return n2;
}
function z(l2, e2, t2) {
  let n2 = l2.length;
  if (n2 === 0)
    return "";
  let r2 = 0;
  for (;r2 < n2; ) {
    let i2 = l2.charAt(n2 - r2 - 1);
    if (i2 === e2 && !t2)
      r2++;
    else if (i2 !== e2 && t2)
      r2++;
    else
      break;
  }
  return l2.slice(0, n2 - r2);
}
function fe(l2, e2) {
  if (l2.indexOf(e2[1]) === -1)
    return -1;
  let t2 = 0;
  for (let n2 = 0;n2 < l2.length; n2++)
    if (l2[n2] === "\\")
      n2++;
    else if (l2[n2] === e2[0])
      t2++;
    else if (l2[n2] === e2[1] && (t2--, t2 < 0))
      return n2;
  return t2 > 0 ? -2 : -1;
}
function me(l2, e2, t2, n2, r2) {
  let i2 = e2.href, s2 = e2.title || null, a2 = l2[1].replace(r2.other.outputLinkReplace, "$1");
  n2.state.inLink = true;
  let o2 = { type: l2[0].charAt(0) === "!" ? "image" : "link", raw: t2, href: i2, title: s2, text: a2, tokens: n2.inlineTokens(a2) };
  return n2.state.inLink = false, o2;
}
function Ye(l2, e2, t2) {
  let n2 = l2.match(t2.other.indentCodeCompensation);
  if (n2 === null)
    return e2;
  let r2 = n2[1];
  return e2.split(`
`).map((i2) => {
    let s2 = i2.match(t2.other.beginningSpace);
    if (s2 === null)
      return i2;
    let [a2] = s2;
    return a2.length >= r2.length ? i2.slice(r2.length) : i2;
  }).join(`
`);
}
var y = class {
  options;
  rules;
  lexer;
  constructor(e2) {
    this.options = e2 || T2;
  }
  space(e2) {
    let t2 = this.rules.block.newline.exec(e2);
    if (t2 && t2[0].length > 0)
      return { type: "space", raw: t2[0] };
  }
  code(e2) {
    let t2 = this.rules.block.code.exec(e2);
    if (t2) {
      let n2 = t2[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t2[0], codeBlockStyle: "indented", text: this.options.pedantic ? n2 : z(n2, `
`) };
    }
  }
  fences(e2) {
    let t2 = this.rules.block.fences.exec(e2);
    if (t2) {
      let n2 = t2[0], r2 = Ye(n2, t2[3] || "", this.rules);
      return { type: "code", raw: n2, lang: t2[2] ? t2[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t2[2], text: r2 };
    }
  }
  heading(e2) {
    let t2 = this.rules.block.heading.exec(e2);
    if (t2) {
      let n2 = t2[2].trim();
      if (this.rules.other.endingHash.test(n2)) {
        let r2 = z(n2, "#");
        (this.options.pedantic || !r2 || this.rules.other.endingSpaceChar.test(r2)) && (n2 = r2.trim());
      }
      return { type: "heading", raw: t2[0], depth: t2[1].length, text: n2, tokens: this.lexer.inline(n2) };
    }
  }
  hr(e2) {
    let t2 = this.rules.block.hr.exec(e2);
    if (t2)
      return { type: "hr", raw: z(t2[0], `
`) };
  }
  blockquote(e2) {
    let t2 = this.rules.block.blockquote.exec(e2);
    if (t2) {
      let n2 = z(t2[0], `
`).split(`
`), r2 = "", i2 = "", s2 = [];
      for (;n2.length > 0; ) {
        let a2 = false, o2 = [], p2;
        for (p2 = 0;p2 < n2.length; p2++)
          if (this.rules.other.blockquoteStart.test(n2[p2]))
            o2.push(n2[p2]), a2 = true;
          else if (!a2)
            o2.push(n2[p2]);
          else
            break;
        n2 = n2.slice(p2);
        let u2 = o2.join(`
`), c2 = u2.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r2 = r2 ? `${r2}
${u2}` : u2, i2 = i2 ? `${i2}
${c2}` : c2;
        let g = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(c2, s2, true), this.lexer.state.top = g, n2.length === 0)
          break;
        let h2 = s2.at(-1);
        if (h2?.type === "code")
          break;
        if (h2?.type === "blockquote") {
          let R2 = h2, f = R2.raw + `
` + n2.join(`
`), O = this.blockquote(f);
          s2[s2.length - 1] = O, r2 = r2.substring(0, r2.length - R2.raw.length) + O.raw, i2 = i2.substring(0, i2.length - R2.text.length) + O.text;
          break;
        } else if (h2?.type === "list") {
          let R2 = h2, f = R2.raw + `
` + n2.join(`
`), O = this.list(f);
          s2[s2.length - 1] = O, r2 = r2.substring(0, r2.length - h2.raw.length) + O.raw, i2 = i2.substring(0, i2.length - R2.raw.length) + O.raw, n2 = f.substring(s2.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r2, tokens: s2, text: i2 };
    }
  }
  list(e2) {
    let t2 = this.rules.block.list.exec(e2);
    if (t2) {
      let n2 = t2[1].trim(), r2 = n2.length > 1, i2 = { type: "list", raw: "", ordered: r2, start: r2 ? +n2.slice(0, -1) : "", loose: false, items: [] };
      n2 = r2 ? `\\d{1,9}\\${n2.slice(-1)}` : `\\${n2}`, this.options.pedantic && (n2 = r2 ? n2 : "[*+-]");
      let s2 = this.rules.other.listItemRegex(n2), a2 = false;
      for (;e2; ) {
        let p2 = false, u2 = "", c2 = "";
        if (!(t2 = s2.exec(e2)) || this.rules.block.hr.test(e2))
          break;
        u2 = t2[0], e2 = e2.substring(u2.length);
        let g = t2[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (H) => " ".repeat(3 * H.length)), h2 = e2.split(`
`, 1)[0], R2 = !g.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, c2 = g.trimStart()) : R2 ? f = t2[1].length + 1 : (f = t2[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, c2 = g.slice(f), f += t2[1].length), R2 && this.rules.other.blankLine.test(h2) && (u2 += h2 + `
`, e2 = e2.substring(h2.length + 1), p2 = true), !p2) {
          let H = this.rules.other.nextBulletRegex(f), ee = this.rules.other.hrRegex(f), te = this.rules.other.fencesBeginRegex(f), ne = this.rules.other.headingBeginRegex(f), xe = this.rules.other.htmlBeginRegex(f);
          for (;e2; ) {
            let Z = e2.split(`
`, 1)[0], A;
            if (h2 = Z, this.options.pedantic ? (h2 = h2.replace(this.rules.other.listReplaceNesting, "  "), A = h2) : A = h2.replace(this.rules.other.tabCharGlobal, "    "), te.test(h2) || ne.test(h2) || xe.test(h2) || H.test(h2) || ee.test(h2))
              break;
            if (A.search(this.rules.other.nonSpaceChar) >= f || !h2.trim())
              c2 += `
` + A.slice(f);
            else {
              if (R2 || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || te.test(g) || ne.test(g) || ee.test(g))
                break;
              c2 += `
` + h2;
            }
            !R2 && !h2.trim() && (R2 = true), u2 += Z + `
`, e2 = e2.substring(Z.length + 1), g = A.slice(f);
          }
        }
        i2.loose || (a2 ? i2.loose = true : this.rules.other.doubleBlankLine.test(u2) && (a2 = true));
        let O = null, Y;
        this.options.gfm && (O = this.rules.other.listIsTask.exec(c2), O && (Y = O[0] !== "[ ] ", c2 = c2.replace(this.rules.other.listReplaceTask, ""))), i2.items.push({ type: "list_item", raw: u2, task: !!O, checked: Y, loose: false, text: c2, tokens: [] }), i2.raw += u2;
      }
      let o2 = i2.items.at(-1);
      if (o2)
        o2.raw = o2.raw.trimEnd(), o2.text = o2.text.trimEnd();
      else
        return;
      i2.raw = i2.raw.trimEnd();
      for (let p2 = 0;p2 < i2.items.length; p2++)
        if (this.lexer.state.top = false, i2.items[p2].tokens = this.lexer.blockTokens(i2.items[p2].text, []), !i2.loose) {
          let u2 = i2.items[p2].tokens.filter((g) => g.type === "space"), c2 = u2.length > 0 && u2.some((g) => this.rules.other.anyLine.test(g.raw));
          i2.loose = c2;
        }
      if (i2.loose)
        for (let p2 = 0;p2 < i2.items.length; p2++)
          i2.items[p2].loose = true;
      return i2;
    }
  }
  html(e2) {
    let t2 = this.rules.block.html.exec(e2);
    if (t2)
      return { type: "html", block: true, raw: t2[0], pre: t2[1] === "pre" || t2[1] === "script" || t2[1] === "style", text: t2[0] };
  }
  def(e2) {
    let t2 = this.rules.block.def.exec(e2);
    if (t2) {
      let n2 = t2[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r2 = t2[2] ? t2[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i2 = t2[3] ? t2[3].substring(1, t2[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t2[3];
      return { type: "def", tag: n2, raw: t2[0], href: r2, title: i2 };
    }
  }
  table(e2) {
    let t2 = this.rules.block.table.exec(e2);
    if (!t2 || !this.rules.other.tableDelimiter.test(t2[2]))
      return;
    let n2 = V2(t2[1]), r2 = t2[2].replace(this.rules.other.tableAlignChars, "").split("|"), i2 = t2[3]?.trim() ? t2[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s2 = { type: "table", raw: t2[0], header: [], align: [], rows: [] };
    if (n2.length === r2.length) {
      for (let a2 of r2)
        this.rules.other.tableAlignRight.test(a2) ? s2.align.push("right") : this.rules.other.tableAlignCenter.test(a2) ? s2.align.push("center") : this.rules.other.tableAlignLeft.test(a2) ? s2.align.push("left") : s2.align.push(null);
      for (let a2 = 0;a2 < n2.length; a2++)
        s2.header.push({ text: n2[a2], tokens: this.lexer.inline(n2[a2]), header: true, align: s2.align[a2] });
      for (let a2 of i2)
        s2.rows.push(V2(a2, s2.header.length).map((o2, p2) => ({ text: o2, tokens: this.lexer.inline(o2), header: false, align: s2.align[p2] })));
      return s2;
    }
  }
  lheading(e2) {
    let t2 = this.rules.block.lheading.exec(e2);
    if (t2)
      return { type: "heading", raw: t2[0], depth: t2[2].charAt(0) === "=" ? 1 : 2, text: t2[1], tokens: this.lexer.inline(t2[1]) };
  }
  paragraph(e2) {
    let t2 = this.rules.block.paragraph.exec(e2);
    if (t2) {
      let n2 = t2[1].charAt(t2[1].length - 1) === `
` ? t2[1].slice(0, -1) : t2[1];
      return { type: "paragraph", raw: t2[0], text: n2, tokens: this.lexer.inline(n2) };
    }
  }
  text(e2) {
    let t2 = this.rules.block.text.exec(e2);
    if (t2)
      return { type: "text", raw: t2[0], text: t2[0], tokens: this.lexer.inline(t2[0]) };
  }
  escape(e2) {
    let t2 = this.rules.inline.escape.exec(e2);
    if (t2)
      return { type: "escape", raw: t2[0], text: t2[1] };
  }
  tag(e2) {
    let t2 = this.rules.inline.tag.exec(e2);
    if (t2)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(t2[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t2[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t2[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t2[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t2[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t2[0] };
  }
  link(e2) {
    let t2 = this.rules.inline.link.exec(e2);
    if (t2) {
      let n2 = t2[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n2)) {
        if (!this.rules.other.endAngleBracket.test(n2))
          return;
        let s2 = z(n2.slice(0, -1), "\\");
        if ((n2.length - s2.length) % 2 === 0)
          return;
      } else {
        let s2 = fe(t2[2], "()");
        if (s2 === -2)
          return;
        if (s2 > -1) {
          let o2 = (t2[0].indexOf("!") === 0 ? 5 : 4) + t2[1].length + s2;
          t2[2] = t2[2].substring(0, s2), t2[0] = t2[0].substring(0, o2).trim(), t2[3] = "";
        }
      }
      let r2 = t2[2], i2 = "";
      if (this.options.pedantic) {
        let s2 = this.rules.other.pedanticHrefTitle.exec(r2);
        s2 && (r2 = s2[1], i2 = s2[3]);
      } else
        i2 = t2[3] ? t2[3].slice(1, -1) : "";
      return r2 = r2.trim(), this.rules.other.startAngleBracket.test(r2) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n2) ? r2 = r2.slice(1) : r2 = r2.slice(1, -1)), me(t2, { href: r2 && r2.replace(this.rules.inline.anyPunctuation, "$1"), title: i2 && i2.replace(this.rules.inline.anyPunctuation, "$1") }, t2[0], this.lexer, this.rules);
    }
  }
  reflink(e2, t2) {
    let n2;
    if ((n2 = this.rules.inline.reflink.exec(e2)) || (n2 = this.rules.inline.nolink.exec(e2))) {
      let r2 = (n2[2] || n2[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i2 = t2[r2.toLowerCase()];
      if (!i2) {
        let s2 = n2[0].charAt(0);
        return { type: "text", raw: s2, text: s2 };
      }
      return me(n2, i2, n2[0], this.lexer, this.rules);
    }
  }
  emStrong(e2, t2, n2 = "") {
    let r2 = this.rules.inline.emStrongLDelim.exec(e2);
    if (!r2 || r2[3] && n2.match(this.rules.other.unicodeAlphaNumeric))
      return;
    if (!(r2[1] || r2[2] || "") || !n2 || this.rules.inline.punctuation.exec(n2)) {
      let s2 = [...r2[0]].length - 1, a2, o2, p2 = s2, u2 = 0, c2 = r2[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c2.lastIndex = 0, t2 = t2.slice(-1 * e2.length + s2);(r2 = c2.exec(t2)) != null; ) {
        if (a2 = r2[1] || r2[2] || r2[3] || r2[4] || r2[5] || r2[6], !a2)
          continue;
        if (o2 = [...a2].length, r2[3] || r2[4]) {
          p2 += o2;
          continue;
        } else if ((r2[5] || r2[6]) && s2 % 3 && !((s2 + o2) % 3)) {
          u2 += o2;
          continue;
        }
        if (p2 -= o2, p2 > 0)
          continue;
        o2 = Math.min(o2, o2 + p2 + u2);
        let g = [...r2[0]][0].length, h2 = e2.slice(0, s2 + r2.index + g + o2);
        if (Math.min(s2, o2) % 2) {
          let f = h2.slice(1, -1);
          return { type: "em", raw: h2, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let R2 = h2.slice(2, -2);
        return { type: "strong", raw: h2, text: R2, tokens: this.lexer.inlineTokens(R2) };
      }
    }
  }
  codespan(e2) {
    let t2 = this.rules.inline.code.exec(e2);
    if (t2) {
      let n2 = t2[2].replace(this.rules.other.newLineCharGlobal, " "), r2 = this.rules.other.nonSpaceChar.test(n2), i2 = this.rules.other.startingSpaceChar.test(n2) && this.rules.other.endingSpaceChar.test(n2);
      return r2 && i2 && (n2 = n2.substring(1, n2.length - 1)), { type: "codespan", raw: t2[0], text: n2 };
    }
  }
  br(e2) {
    let t2 = this.rules.inline.br.exec(e2);
    if (t2)
      return { type: "br", raw: t2[0] };
  }
  del(e2) {
    let t2 = this.rules.inline.del.exec(e2);
    if (t2)
      return { type: "del", raw: t2[0], text: t2[2], tokens: this.lexer.inlineTokens(t2[2]) };
  }
  autolink(e2) {
    let t2 = this.rules.inline.autolink.exec(e2);
    if (t2) {
      let n2, r2;
      return t2[2] === "@" ? (n2 = t2[1], r2 = "mailto:" + n2) : (n2 = t2[1], r2 = n2), { type: "link", raw: t2[0], text: n2, href: r2, tokens: [{ type: "text", raw: n2, text: n2 }] };
    }
  }
  url(e2) {
    let t2;
    if (t2 = this.rules.inline.url.exec(e2)) {
      let n2, r2;
      if (t2[2] === "@")
        n2 = t2[0], r2 = "mailto:" + n2;
      else {
        let i2;
        do
          i2 = t2[0], t2[0] = this.rules.inline._backpedal.exec(t2[0])?.[0] ?? "";
        while (i2 !== t2[0]);
        n2 = t2[0], t2[1] === "www." ? r2 = "http://" + t2[0] : r2 = t2[0];
      }
      return { type: "link", raw: t2[0], text: n2, href: r2, tokens: [{ type: "text", raw: n2, text: n2 }] };
    }
  }
  inlineText(e2) {
    let t2 = this.rules.inline.text.exec(e2);
    if (t2) {
      let n2 = this.lexer.state.inRawBlock;
      return { type: "text", raw: t2[0], text: t2[0], escaped: n2 };
    }
  }
};
var x2 = class l2 {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(e2) {
    this.tokens = [], this.tokens.links = Object.create(null), this.options = e2 || T2, this.options.tokenizer = this.options.tokenizer || new y, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t2 = { other: m2, block: C2.normal, inline: M.normal };
    this.options.pedantic ? (t2.block = C2.pedantic, t2.inline = M.pedantic) : this.options.gfm && (t2.block = C2.gfm, this.options.breaks ? t2.inline = M.breaks : t2.inline = M.gfm), this.tokenizer.rules = t2;
  }
  static get rules() {
    return { block: C2, inline: M };
  }
  static lex(e2, t2) {
    return new l2(t2).lex(e2);
  }
  static lexInline(e2, t2) {
    return new l2(t2).inlineTokens(e2);
  }
  lex(e2) {
    e2 = e2.replace(m2.carriageReturn, `
`), this.blockTokens(e2, this.tokens);
    for (let t2 = 0;t2 < this.inlineQueue.length; t2++) {
      let n2 = this.inlineQueue[t2];
      this.inlineTokens(n2.src, n2.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e2, t2 = [], n2 = false) {
    for (this.options.pedantic && (e2 = e2.replace(m2.tabCharGlobal, "    ").replace(m2.spaceLine, ""));e2; ) {
      let r2;
      if (this.options.extensions?.block?.some((s2) => (r2 = s2.call({ lexer: this }, e2, t2)) ? (e2 = e2.substring(r2.raw.length), t2.push(r2), true) : false))
        continue;
      if (r2 = this.tokenizer.space(e2)) {
        e2 = e2.substring(r2.raw.length);
        let s2 = t2.at(-1);
        r2.raw.length === 1 && s2 !== undefined ? s2.raw += `
` : t2.push(r2);
        continue;
      }
      if (r2 = this.tokenizer.code(e2)) {
        e2 = e2.substring(r2.raw.length);
        let s2 = t2.at(-1);
        s2?.type === "paragraph" || s2?.type === "text" ? (s2.raw += (s2.raw.endsWith(`
`) ? "" : `
`) + r2.raw, s2.text += `
` + r2.text, this.inlineQueue.at(-1).src = s2.text) : t2.push(r2);
        continue;
      }
      if (r2 = this.tokenizer.fences(e2)) {
        e2 = e2.substring(r2.raw.length), t2.push(r2);
        continue;
      }
      if (r2 = this.tokenizer.heading(e2)) {
        e2 = e2.substring(r2.raw.length), t2.push(r2);
        continue;
      }
      if (r2 = this.tokenizer.hr(e2)) {
        e2 = e2.substring(r2.raw.length), t2.push(r2);
        continue;
      }
      if (r2 = this.tokenizer.blockquote(e2)) {
        e2 = e2.substring(r2.raw.length), t2.push(r2);
        continue;
      }
      if (r2 = this.tokenizer.list(e2)) {
        e2 = e2.substring(r2.raw.length), t2.push(r2);
        continue;
      }
      if (r2 = this.tokenizer.html(e2)) {
        e2 = e2.substring(r2.raw.length), t2.push(r2);
        continue;
      }
      if (r2 = this.tokenizer.def(e2)) {
        e2 = e2.substring(r2.raw.length);
        let s2 = t2.at(-1);
        s2?.type === "paragraph" || s2?.type === "text" ? (s2.raw += (s2.raw.endsWith(`
`) ? "" : `
`) + r2.raw, s2.text += `
` + r2.raw, this.inlineQueue.at(-1).src = s2.text) : this.tokens.links[r2.tag] || (this.tokens.links[r2.tag] = { href: r2.href, title: r2.title }, t2.push(r2));
        continue;
      }
      if (r2 = this.tokenizer.table(e2)) {
        e2 = e2.substring(r2.raw.length), t2.push(r2);
        continue;
      }
      if (r2 = this.tokenizer.lheading(e2)) {
        e2 = e2.substring(r2.raw.length), t2.push(r2);
        continue;
      }
      let i2 = e2;
      if (this.options.extensions?.startBlock) {
        let s2 = 1 / 0, a2 = e2.slice(1), o2;
        this.options.extensions.startBlock.forEach((p2) => {
          o2 = p2.call({ lexer: this }, a2), typeof o2 == "number" && o2 >= 0 && (s2 = Math.min(s2, o2));
        }), s2 < 1 / 0 && s2 >= 0 && (i2 = e2.substring(0, s2 + 1));
      }
      if (this.state.top && (r2 = this.tokenizer.paragraph(i2))) {
        let s2 = t2.at(-1);
        n2 && s2?.type === "paragraph" ? (s2.raw += (s2.raw.endsWith(`
`) ? "" : `
`) + r2.raw, s2.text += `
` + r2.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s2.text) : t2.push(r2), n2 = i2.length !== e2.length, e2 = e2.substring(r2.raw.length);
        continue;
      }
      if (r2 = this.tokenizer.text(e2)) {
        e2 = e2.substring(r2.raw.length);
        let s2 = t2.at(-1);
        s2?.type === "text" ? (s2.raw += (s2.raw.endsWith(`
`) ? "" : `
`) + r2.raw, s2.text += `
` + r2.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s2.text) : t2.push(r2);
        continue;
      }
      if (e2) {
        let s2 = "Infinite loop on byte: " + e2.charCodeAt(0);
        if (this.options.silent) {
          console.error(s2);
          break;
        } else
          throw new Error(s2);
      }
    }
    return this.state.top = true, t2;
  }
  inline(e2, t2 = []) {
    return this.inlineQueue.push({ src: e2, tokens: t2 }), t2;
  }
  inlineTokens(e2, t2 = []) {
    let n2 = e2, r2 = null;
    if (this.tokens.links) {
      let o2 = Object.keys(this.tokens.links);
      if (o2.length > 0)
        for (;(r2 = this.tokenizer.rules.inline.reflinkSearch.exec(n2)) != null; )
          o2.includes(r2[0].slice(r2[0].lastIndexOf("[") + 1, -1)) && (n2 = n2.slice(0, r2.index) + "[" + "a".repeat(r2[0].length - 2) + "]" + n2.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (;(r2 = this.tokenizer.rules.inline.anyPunctuation.exec(n2)) != null; )
      n2 = n2.slice(0, r2.index) + "++" + n2.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i2;
    for (;(r2 = this.tokenizer.rules.inline.blockSkip.exec(n2)) != null; )
      i2 = r2[2] ? r2[2].length : 0, n2 = n2.slice(0, r2.index + i2) + "[" + "a".repeat(r2[0].length - i2 - 2) + "]" + n2.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n2 = this.options.hooks?.emStrongMask?.call({ lexer: this }, n2) ?? n2;
    let s2 = false, a2 = "";
    for (;e2; ) {
      s2 || (a2 = ""), s2 = false;
      let o2;
      if (this.options.extensions?.inline?.some((u2) => (o2 = u2.call({ lexer: this }, e2, t2)) ? (e2 = e2.substring(o2.raw.length), t2.push(o2), true) : false))
        continue;
      if (o2 = this.tokenizer.escape(e2)) {
        e2 = e2.substring(o2.raw.length), t2.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.tag(e2)) {
        e2 = e2.substring(o2.raw.length), t2.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.link(e2)) {
        e2 = e2.substring(o2.raw.length), t2.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.reflink(e2, this.tokens.links)) {
        e2 = e2.substring(o2.raw.length);
        let u2 = t2.at(-1);
        o2.type === "text" && u2?.type === "text" ? (u2.raw += o2.raw, u2.text += o2.text) : t2.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.emStrong(e2, n2, a2)) {
        e2 = e2.substring(o2.raw.length), t2.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.codespan(e2)) {
        e2 = e2.substring(o2.raw.length), t2.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.br(e2)) {
        e2 = e2.substring(o2.raw.length), t2.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.del(e2)) {
        e2 = e2.substring(o2.raw.length), t2.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.autolink(e2)) {
        e2 = e2.substring(o2.raw.length), t2.push(o2);
        continue;
      }
      if (!this.state.inLink && (o2 = this.tokenizer.url(e2))) {
        e2 = e2.substring(o2.raw.length), t2.push(o2);
        continue;
      }
      let p2 = e2;
      if (this.options.extensions?.startInline) {
        let u2 = 1 / 0, c2 = e2.slice(1), g;
        this.options.extensions.startInline.forEach((h2) => {
          g = h2.call({ lexer: this }, c2), typeof g == "number" && g >= 0 && (u2 = Math.min(u2, g));
        }), u2 < 1 / 0 && u2 >= 0 && (p2 = e2.substring(0, u2 + 1));
      }
      if (o2 = this.tokenizer.inlineText(p2)) {
        e2 = e2.substring(o2.raw.length), o2.raw.slice(-1) !== "_" && (a2 = o2.raw.slice(-1)), s2 = true;
        let u2 = t2.at(-1);
        u2?.type === "text" ? (u2.raw += o2.raw, u2.text += o2.text) : t2.push(o2);
        continue;
      }
      if (e2) {
        let u2 = "Infinite loop on byte: " + e2.charCodeAt(0);
        if (this.options.silent) {
          console.error(u2);
          break;
        } else
          throw new Error(u2);
      }
    }
    return t2;
  }
};
var P2 = class {
  options;
  parser;
  constructor(e2) {
    this.options = e2 || T2;
  }
  space(e2) {
    return "";
  }
  code({ text: e2, lang: t2, escaped: n2 }) {
    let r2 = (t2 || "").match(m2.notSpaceStart)?.[0], i2 = e2.replace(m2.endingNewline, "") + `
`;
    return r2 ? '<pre><code class="language-' + w(r2) + '">' + (n2 ? i2 : w(i2, true)) + `</code></pre>
` : "<pre><code>" + (n2 ? i2 : w(i2, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e2 }) {
    return `<blockquote>
${this.parser.parse(e2)}</blockquote>
`;
  }
  html({ text: e2 }) {
    return e2;
  }
  def(e2) {
    return "";
  }
  heading({ tokens: e2, depth: t2 }) {
    return `<h${t2}>${this.parser.parseInline(e2)}</h${t2}>
`;
  }
  hr(e2) {
    return `<hr>
`;
  }
  list(e2) {
    let { ordered: t2, start: n2 } = e2, r2 = "";
    for (let a2 = 0;a2 < e2.items.length; a2++) {
      let o2 = e2.items[a2];
      r2 += this.listitem(o2);
    }
    let i2 = t2 ? "ol" : "ul", s2 = t2 && n2 !== 1 ? ' start="' + n2 + '"' : "";
    return "<" + i2 + s2 + `>
` + r2 + "</" + i2 + `>
`;
  }
  listitem(e2) {
    let t2 = "";
    if (e2.task) {
      let n2 = this.checkbox({ checked: !!e2.checked });
      e2.loose ? e2.tokens[0]?.type === "paragraph" ? (e2.tokens[0].text = n2 + " " + e2.tokens[0].text, e2.tokens[0].tokens && e2.tokens[0].tokens.length > 0 && e2.tokens[0].tokens[0].type === "text" && (e2.tokens[0].tokens[0].text = n2 + " " + w(e2.tokens[0].tokens[0].text), e2.tokens[0].tokens[0].escaped = true)) : e2.tokens.unshift({ type: "text", raw: n2 + " ", text: n2 + " ", escaped: true }) : t2 += n2 + " ";
    }
    return t2 += this.parser.parse(e2.tokens, !!e2.loose), `<li>${t2}</li>
`;
  }
  checkbox({ checked: e2 }) {
    return "<input " + (e2 ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: e2 }) {
    return `<p>${this.parser.parseInline(e2)}</p>
`;
  }
  table(e2) {
    let t2 = "", n2 = "";
    for (let i2 = 0;i2 < e2.header.length; i2++)
      n2 += this.tablecell(e2.header[i2]);
    t2 += this.tablerow({ text: n2 });
    let r2 = "";
    for (let i2 = 0;i2 < e2.rows.length; i2++) {
      let s2 = e2.rows[i2];
      n2 = "";
      for (let a2 = 0;a2 < s2.length; a2++)
        n2 += this.tablecell(s2[a2]);
      r2 += this.tablerow({ text: n2 });
    }
    return r2 && (r2 = `<tbody>${r2}</tbody>`), `<table>
<thead>
` + t2 + `</thead>
` + r2 + `</table>
`;
  }
  tablerow({ text: e2 }) {
    return `<tr>
${e2}</tr>
`;
  }
  tablecell(e2) {
    let t2 = this.parser.parseInline(e2.tokens), n2 = e2.header ? "th" : "td";
    return (e2.align ? `<${n2} align="${e2.align}">` : `<${n2}>`) + t2 + `</${n2}>
`;
  }
  strong({ tokens: e2 }) {
    return `<strong>${this.parser.parseInline(e2)}</strong>`;
  }
  em({ tokens: e2 }) {
    return `<em>${this.parser.parseInline(e2)}</em>`;
  }
  codespan({ text: e2 }) {
    return `<code>${w(e2, true)}</code>`;
  }
  br(e2) {
    return "<br>";
  }
  del({ tokens: e2 }) {
    return `<del>${this.parser.parseInline(e2)}</del>`;
  }
  link({ href: e2, title: t2, tokens: n2 }) {
    let r2 = this.parser.parseInline(n2), i2 = J(e2);
    if (i2 === null)
      return r2;
    e2 = i2;
    let s2 = '<a href="' + e2 + '"';
    return t2 && (s2 += ' title="' + w(t2) + '"'), s2 += ">" + r2 + "</a>", s2;
  }
  image({ href: e2, title: t2, text: n2, tokens: r2 }) {
    r2 && (n2 = this.parser.parseInline(r2, this.parser.textRenderer));
    let i2 = J(e2);
    if (i2 === null)
      return w(n2);
    e2 = i2;
    let s2 = `<img src="${e2}" alt="${n2}"`;
    return t2 && (s2 += ` title="${w(t2)}"`), s2 += ">", s2;
  }
  text(e2) {
    return "tokens" in e2 && e2.tokens ? this.parser.parseInline(e2.tokens) : ("escaped" in e2) && e2.escaped ? e2.text : w(e2.text);
  }
};
var $ = class {
  strong({ text: e2 }) {
    return e2;
  }
  em({ text: e2 }) {
    return e2;
  }
  codespan({ text: e2 }) {
    return e2;
  }
  del({ text: e2 }) {
    return e2;
  }
  html({ text: e2 }) {
    return e2;
  }
  text({ text: e2 }) {
    return e2;
  }
  link({ text: e2 }) {
    return "" + e2;
  }
  image({ text: e2 }) {
    return "" + e2;
  }
  br() {
    return "";
  }
};
var b2 = class l3 {
  options;
  renderer;
  textRenderer;
  constructor(e2) {
    this.options = e2 || T2, this.options.renderer = this.options.renderer || new P2, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $;
  }
  static parse(e2, t2) {
    return new l3(t2).parse(e2);
  }
  static parseInline(e2, t2) {
    return new l3(t2).parseInline(e2);
  }
  parse(e2, t2 = true) {
    let n2 = "";
    for (let r2 = 0;r2 < e2.length; r2++) {
      let i2 = e2[r2];
      if (this.options.extensions?.renderers?.[i2.type]) {
        let a2 = i2, o2 = this.options.extensions.renderers[a2.type].call({ parser: this }, a2);
        if (o2 !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a2.type)) {
          n2 += o2 || "";
          continue;
        }
      }
      let s2 = i2;
      switch (s2.type) {
        case "space": {
          n2 += this.renderer.space(s2);
          continue;
        }
        case "hr": {
          n2 += this.renderer.hr(s2);
          continue;
        }
        case "heading": {
          n2 += this.renderer.heading(s2);
          continue;
        }
        case "code": {
          n2 += this.renderer.code(s2);
          continue;
        }
        case "table": {
          n2 += this.renderer.table(s2);
          continue;
        }
        case "blockquote": {
          n2 += this.renderer.blockquote(s2);
          continue;
        }
        case "list": {
          n2 += this.renderer.list(s2);
          continue;
        }
        case "html": {
          n2 += this.renderer.html(s2);
          continue;
        }
        case "def": {
          n2 += this.renderer.def(s2);
          continue;
        }
        case "paragraph": {
          n2 += this.renderer.paragraph(s2);
          continue;
        }
        case "text": {
          let a2 = s2, o2 = this.renderer.text(a2);
          for (;r2 + 1 < e2.length && e2[r2 + 1].type === "text"; )
            a2 = e2[++r2], o2 += `
` + this.renderer.text(a2);
          t2 ? n2 += this.renderer.paragraph({ type: "paragraph", raw: o2, text: o2, tokens: [{ type: "text", raw: o2, text: o2, escaped: true }] }) : n2 += o2;
          continue;
        }
        default: {
          let a2 = 'Token with "' + s2.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a2), "";
          throw new Error(a2);
        }
      }
    }
    return n2;
  }
  parseInline(e2, t2 = this.renderer) {
    let n2 = "";
    for (let r2 = 0;r2 < e2.length; r2++) {
      let i2 = e2[r2];
      if (this.options.extensions?.renderers?.[i2.type]) {
        let a2 = this.options.extensions.renderers[i2.type].call({ parser: this }, i2);
        if (a2 !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i2.type)) {
          n2 += a2 || "";
          continue;
        }
      }
      let s2 = i2;
      switch (s2.type) {
        case "escape": {
          n2 += t2.text(s2);
          break;
        }
        case "html": {
          n2 += t2.html(s2);
          break;
        }
        case "link": {
          n2 += t2.link(s2);
          break;
        }
        case "image": {
          n2 += t2.image(s2);
          break;
        }
        case "strong": {
          n2 += t2.strong(s2);
          break;
        }
        case "em": {
          n2 += t2.em(s2);
          break;
        }
        case "codespan": {
          n2 += t2.codespan(s2);
          break;
        }
        case "br": {
          n2 += t2.br(s2);
          break;
        }
        case "del": {
          n2 += t2.del(s2);
          break;
        }
        case "text": {
          n2 += t2.text(s2);
          break;
        }
        default: {
          let a2 = 'Token with "' + s2.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a2), "";
          throw new Error(a2);
        }
      }
    }
    return n2;
  }
};
var S = class {
  options;
  block;
  constructor(e2) {
    this.options = e2 || T2;
  }
  static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(e2) {
    return e2;
  }
  postprocess(e2) {
    return e2;
  }
  processAllTokens(e2) {
    return e2;
  }
  emStrongMask(e2) {
    return e2;
  }
  provideLexer() {
    return this.block ? x2.lex : x2.lexInline;
  }
  provideParser() {
    return this.block ? b2.parse : b2.parseInline;
  }
};
var B = class {
  defaults = L();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b2;
  Renderer = P2;
  TextRenderer = $;
  Lexer = x2;
  Tokenizer = y;
  Hooks = S;
  constructor(...e2) {
    this.use(...e2);
  }
  walkTokens(e2, t2) {
    let n2 = [];
    for (let r2 of e2)
      switch (n2 = n2.concat(t2.call(this, r2)), r2.type) {
        case "table": {
          let i2 = r2;
          for (let s2 of i2.header)
            n2 = n2.concat(this.walkTokens(s2.tokens, t2));
          for (let s2 of i2.rows)
            for (let a2 of s2)
              n2 = n2.concat(this.walkTokens(a2.tokens, t2));
          break;
        }
        case "list": {
          let i2 = r2;
          n2 = n2.concat(this.walkTokens(i2.items, t2));
          break;
        }
        default: {
          let i2 = r2;
          this.defaults.extensions?.childTokens?.[i2.type] ? this.defaults.extensions.childTokens[i2.type].forEach((s2) => {
            let a2 = i2[s2].flat(1 / 0);
            n2 = n2.concat(this.walkTokens(a2, t2));
          }) : i2.tokens && (n2 = n2.concat(this.walkTokens(i2.tokens, t2)));
        }
      }
    return n2;
  }
  use(...e2) {
    let t2 = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e2.forEach((n2) => {
      let r2 = { ...n2 };
      if (r2.async = this.defaults.async || r2.async || false, n2.extensions && (n2.extensions.forEach((i2) => {
        if (!i2.name)
          throw new Error("extension name required");
        if ("renderer" in i2) {
          let s2 = t2.renderers[i2.name];
          s2 ? t2.renderers[i2.name] = function(...a2) {
            let o2 = i2.renderer.apply(this, a2);
            return o2 === false && (o2 = s2.apply(this, a2)), o2;
          } : t2.renderers[i2.name] = i2.renderer;
        }
        if ("tokenizer" in i2) {
          if (!i2.level || i2.level !== "block" && i2.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          let s2 = t2[i2.level];
          s2 ? s2.unshift(i2.tokenizer) : t2[i2.level] = [i2.tokenizer], i2.start && (i2.level === "block" ? t2.startBlock ? t2.startBlock.push(i2.start) : t2.startBlock = [i2.start] : i2.level === "inline" && (t2.startInline ? t2.startInline.push(i2.start) : t2.startInline = [i2.start]));
        }
        "childTokens" in i2 && i2.childTokens && (t2.childTokens[i2.name] = i2.childTokens);
      }), r2.extensions = t2), n2.renderer) {
        let i2 = this.defaults.renderer || new P2(this.defaults);
        for (let s2 in n2.renderer) {
          if (!(s2 in i2))
            throw new Error(`renderer '${s2}' does not exist`);
          if (["options", "parser"].includes(s2))
            continue;
          let a2 = s2, o2 = n2.renderer[a2], p2 = i2[a2];
          i2[a2] = (...u2) => {
            let c2 = o2.apply(i2, u2);
            return c2 === false && (c2 = p2.apply(i2, u2)), c2 || "";
          };
        }
        r2.renderer = i2;
      }
      if (n2.tokenizer) {
        let i2 = this.defaults.tokenizer || new y(this.defaults);
        for (let s2 in n2.tokenizer) {
          if (!(s2 in i2))
            throw new Error(`tokenizer '${s2}' does not exist`);
          if (["options", "rules", "lexer"].includes(s2))
            continue;
          let a2 = s2, o2 = n2.tokenizer[a2], p2 = i2[a2];
          i2[a2] = (...u2) => {
            let c2 = o2.apply(i2, u2);
            return c2 === false && (c2 = p2.apply(i2, u2)), c2;
          };
        }
        r2.tokenizer = i2;
      }
      if (n2.hooks) {
        let i2 = this.defaults.hooks || new S;
        for (let s2 in n2.hooks) {
          if (!(s2 in i2))
            throw new Error(`hook '${s2}' does not exist`);
          if (["options", "block"].includes(s2))
            continue;
          let a2 = s2, o2 = n2.hooks[a2], p2 = i2[a2];
          S.passThroughHooks.has(s2) ? i2[a2] = (u2) => {
            if (this.defaults.async && S.passThroughHooksRespectAsync.has(s2))
              return (async () => {
                let g = await o2.call(i2, u2);
                return p2.call(i2, g);
              })();
            let c2 = o2.call(i2, u2);
            return p2.call(i2, c2);
          } : i2[a2] = (...u2) => {
            if (this.defaults.async)
              return (async () => {
                let g = await o2.apply(i2, u2);
                return g === false && (g = await p2.apply(i2, u2)), g;
              })();
            let c2 = o2.apply(i2, u2);
            return c2 === false && (c2 = p2.apply(i2, u2)), c2;
          };
        }
        r2.hooks = i2;
      }
      if (n2.walkTokens) {
        let i2 = this.defaults.walkTokens, s2 = n2.walkTokens;
        r2.walkTokens = function(a2) {
          let o2 = [];
          return o2.push(s2.call(this, a2)), i2 && (o2 = o2.concat(i2.call(this, a2))), o2;
        };
      }
      this.defaults = { ...this.defaults, ...r2 };
    }), this;
  }
  setOptions(e2) {
    return this.defaults = { ...this.defaults, ...e2 }, this;
  }
  lexer(e2, t2) {
    return x2.lex(e2, t2 ?? this.defaults);
  }
  parser(e2, t2) {
    return b2.parse(e2, t2 ?? this.defaults);
  }
  parseMarkdown(e2) {
    return (n2, r2) => {
      let i2 = { ...r2 }, s2 = { ...this.defaults, ...i2 }, a2 = this.onError(!!s2.silent, !!s2.async);
      if (this.defaults.async === true && i2.async === false)
        return a2(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n2 > "u" || n2 === null)
        return a2(new Error("marked(): input parameter is undefined or null"));
      if (typeof n2 != "string")
        return a2(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n2) + ", string expected"));
      if (s2.hooks && (s2.hooks.options = s2, s2.hooks.block = e2), s2.async)
        return (async () => {
          let o2 = s2.hooks ? await s2.hooks.preprocess(n2) : n2, u2 = await (s2.hooks ? await s2.hooks.provideLexer() : e2 ? x2.lex : x2.lexInline)(o2, s2), c2 = s2.hooks ? await s2.hooks.processAllTokens(u2) : u2;
          s2.walkTokens && await Promise.all(this.walkTokens(c2, s2.walkTokens));
          let h2 = await (s2.hooks ? await s2.hooks.provideParser() : e2 ? b2.parse : b2.parseInline)(c2, s2);
          return s2.hooks ? await s2.hooks.postprocess(h2) : h2;
        })().catch(a2);
      try {
        s2.hooks && (n2 = s2.hooks.preprocess(n2));
        let p2 = (s2.hooks ? s2.hooks.provideLexer() : e2 ? x2.lex : x2.lexInline)(n2, s2);
        s2.hooks && (p2 = s2.hooks.processAllTokens(p2)), s2.walkTokens && this.walkTokens(p2, s2.walkTokens);
        let c2 = (s2.hooks ? s2.hooks.provideParser() : e2 ? b2.parse : b2.parseInline)(p2, s2);
        return s2.hooks && (c2 = s2.hooks.postprocess(c2)), c2;
      } catch (o2) {
        return a2(o2);
      }
    };
  }
  onError(e2, t2) {
    return (n2) => {
      if (n2.message += `
Please report this to https://github.com/markedjs/marked.`, e2) {
        let r2 = "<p>An error occurred:</p><pre>" + w(n2.message + "", true) + "</pre>";
        return t2 ? Promise.resolve(r2) : r2;
      }
      if (t2)
        return Promise.reject(n2);
      throw n2;
    };
  }
};
var _ = new B;
function k2(l4, e2) {
  return _.parse(l4, e2);
}
k2.options = k2.setOptions = function(l4) {
  return _.setOptions(l4), k2.defaults = _.defaults, G(k2.defaults), k2;
};
k2.getDefaults = L;
k2.defaults = T2;
k2.use = function(...l4) {
  return _.use(...l4), k2.defaults = _.defaults, G(k2.defaults), k2;
};
k2.walkTokens = function(l4, e2) {
  return _.walkTokens(l4, e2);
};
k2.parseInline = _.parseInline;
k2.Parser = b2;
k2.parser = b2.parse;
k2.Renderer = P2;
k2.TextRenderer = $;
k2.Lexer = x2;
k2.lexer = x2.lex;
k2.Tokenizer = y;
k2.Hooks = S;
k2.parse = k2;
var Zt = k2.options;
var Gt = k2.setOptions;
var Nt = k2.use;
var Ft = k2.walkTokens;
var jt = k2.parseInline;
var Ut = b2.parse;
var Kt = x2.lex;

// node_modules/tosijs-ui/dist/index.js
var G4 = Object.defineProperty;
var U4 = (i2) => i2;
function Z4(i2, l4) {
  this[i2] = U4.bind(null, l4);
}
var X4 = (i2, l4) => {
  for (var s2 in l4)
    G4(i2, s2, { get: l4[s2], enumerable: true, configurable: true, set: Z4.bind(l4, s2) });
};
var n2 = {};

class _1 extends u {
  static set conditions(i2) {
    Object.assign(n2, i2);
    for (let l4 of [..._1.instances])
      l4.queueRender();
  }
  static initAttributes = { condition: "", not: false };
  static instances = new Set;
  connectedCallback() {
    super.connectedCallback(), _1.instances.add(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), _1.instances.delete(this);
  }
  render() {
    if (this.condition !== "" && (this.not ? n2[this.condition] !== true : n2[this.condition] === true))
      this.toggleAttribute("hidden", false);
    else
      this.toggleAttribute("hidden", true);
  }
}
var Tl = _1.elementCreator({ tag: "tosi-ab" });
var D1 = {};
function Z(i2, l4) {
  if (D1[i2] === undefined) {
    if (l4 !== undefined) {
      let o2 = globalThis[l4];
      D1[i2] = Promise.resolve({ [l4]: o2 });
    }
    let s2 = I.script({ src: i2 });
    document.head.append(s2), D1[i2] = new Promise((o2) => {
      s2.onload = () => o2(globalThis);
    });
  }
  return D1[i2];
}
var t2 = {};
function c2(i2) {
  if (t2[i2] === undefined) {
    let l4 = I.link({ rel: "stylesheet", type: "text/css", href: i2 });
    document.head.append(l4), t2[i2] = new Promise((s2) => {
      l4.onload = s2;
    });
  }
  return t2[i2];
}
var O1 = { earth: '<svg class="color" viewBox="0 0 48 48"><g><g><g><path style="fill:#a3d9ff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M7,13.46 C5.1,16.52,4,20.13,4,24 C4,31.81,8.47,38.57,15,41.87 C15,41.87,15,31,15,31 C15,31,9,29,9,29 C9,29,9,19,9,19 C9,19,7,15,7,15 C7,15,7,13.46,7,13.46 z"/><path style="fill:#a3d9ff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M18.4,4.79 C20.18,4.28,22.06,4,24,4 C27.57,4,30.92,4.93,33.82,6.57 C33.82,6.57,29,13,29,13 C29,13,31,19,31,19 C31,19,37,21,37,21 C37,21,39,29,39,29 C39,29,37.35,38.89,37.35,38.89 C33.81,42.07,29.13,44,24,44 C21.03,44,18.22,43.35,15.69,42.2 C15.69,42.2,27,29,27,29 C27,29,27,25,27,25 C27,25,21,23,21,23 C21,23,15,19,15,19 C15,19,11,19,11,19 C11,19,11,13,11,13 C11,13,13,11,13,11 C13,11,15,15,15,15 C15,15,17,15,17,15 C17,15,17,9,17,9 C17,9,18.4,4.79,18.4,4.79 z"/><path style="fill:#274e42;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M18.4,4.79 C18.4,4.79,17,9,17,9 C17,9,17,15,17,15 C17,15,15,15,15,15 C15,15,13,11,13,11 C13,11,11,13,11,13 C11,13,11,19,11,19 C11,19,15,19,15,19 C15,19,21,23,21,23 C21,23,27,25,27,25 C27,25,27,29,27,29 C27,29,15.69,42.2,15.69,42.2 C15.46,42.09,15.23,41.98,15,41.87 C15,41.87,15,31,15,31 C15,31,9,29,9,29 C9,29,9,19,9,19 C9,19,7,15,7,15 C7,15,7,13.46,7,13.46 C9.57,9.32,13.62,6.19,18.4,4.79 z"/><path style="fill:#274e42;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M33.82,6.57 C33.82,6.57,29,13,29,13 C29,13,31,19,31,19 C31,19,37,21,37,21 C37,21,39,29,39,29 C39,29,37.35,38.89,37.35,38.89 C41.43,35.23,44,29.91,44,24 C44,16.52,39.9,10,33.82,6.57 z"/></g></g></g></svg> ', blueprint: '<svg class="color" viewBox="0 0 24 24"><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M10.5,14.5 C10.5,14.5,7.5,15.5,7.5,17.5 C7.5,19.5,10.5,19.5,10.5,19.5"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M18.5,14.5 C18.5,14.5,21.5,15.5,21.5,17.5 C21.5,19.5,18.5,19.5,18.5,19.5"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M7,5.09 C7,3.94,7.9,3,9,3 C9,3,20,3,20,3 C21.1,3,22,3.94,22,5.09 C22,5.09,22,12.41,22,12.41 C22,13.56,21.1,14.5,20,14.5 C20,14.5,9,14.5,9,14.5 C7.9,14.5,7,13.56,7,12.41 C7,12.41,7,5.09,7,5.09 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M14.5,5.5 C14.5,5.5,14.5,11.5,14.5,11.5"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M16.5,7.5 C16.5,7.5,16.5,8.5,16.5,8.5"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12.5,7.5 C12.5,7.5,12.5,8.5,12.5,8.5"/><g/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M18.5,21.5 C18.5,21.5,17.5,20.5,17.5,20.5 C17.5,20.5,16.5,21.5,16.5,21.5"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12.5,21.5 C12.5,21.5,11.5,20.5,11.5,20.5 C11.5,20.5,10.5,21.5,10.5,21.5"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M10.5,14.5 C10.5,14.5,18.5,14.5,18.5,14.5 C18.5,14.5,18.5,19.5,18.5,19.5 C18.5,19.5,10.5,19.5,10.5,19.5 C10.5,19.5,10.5,14.5,10.5,14.5 z"/><g><g><path style="fill:#5e78ca;fill-rule:nonzero;stroke:#f2f2f2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M14,16.5 C14,16.5,16,16.5,16,16.5 C16,16.5,14.53,19.5,14.53,19.5"/><path style="fill:#5e78ca;fill-rule:evenodd;stroke:none;" d="M3.59,8.5 C3.59,8.5,12.59,8.5,12.59,8.5 C12.59,8.5,14.53,19.5,14.53,19.5 C14.53,19.5,5.53,19.5,5.53,19.5 C5.53,19.5,3.59,8.5,3.59,8.5 z"/><path style="fill:#5e78ca;fill-rule:nonzero;stroke:#f2f2f2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12.59,8.5 C12.59,8.5,11.12,11.5,11.12,11.5 C11.12,11.5,2.12,11.5,2.12,11.5 C2.12,11.5,3.59,8.5,3.59,8.5"/><path style="fill:#5e78ca;fill-rule:nonzero;stroke:#f2f2f2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12.59,8.5 C12.59,8.5,14.53,19.5,14.53,19.5"/><path style="fill:#5e78ca;fill-rule:nonzero;stroke:#f2f2f2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M4.12,11.5 C4.12,11.5,5.53,19.5,5.53,19.5"/></g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M9.24,12.5 C10.75,12.5,12.2,13.73,12.46,15.24 C12.46,15.24,12.46,15.24,12.46,15.24 C12.68,16.49,11.85,17.5,10.6,17.5 C10.6,17.5,10.55,17.5,10.55,17.5 C10.17,17.5,9.92,17.81,9.98,18.19 C9.98,18.19,9.98,18.19,9.98,18.19 C10.21,19.47,9.36,20.5,8.08,20.5 C8.08,20.5,6.39,20.5,6.39,20.5 C5.1,20.5,3.87,19.45,3.64,18.16 C3.64,18.16,3.12,15.21,3.12,15.21 C2.86,13.71,3.86,12.5,5.35,12.5 C5.35,12.5,9.24,12.5,9.24,12.5 z"/></g></g></svg> ', tosiXr: '<svg class="color" viewBox="0 0 24 24"><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M8,14.25 C8,14.25,5,15.25,5,17.25 C5,19.25,8,19.25,8,19.25"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M16,14.25 C16,14.25,19,15.25,19,17.25 C19,19.25,16,19.25,16,19.25"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M4.5,4.85 C4.5,3.69,5.4,2.75,6.5,2.75 C6.5,2.75,17.5,2.75,17.5,2.75 C18.61,2.75,19.5,3.69,19.5,4.85 C19.5,4.85,19.5,12.16,19.5,12.16 C19.5,13.32,18.61,14.25,17.5,14.25 C17.5,14.25,6.5,14.25,6.5,14.25 C5.4,14.25,4.5,13.32,4.5,12.16 C4.5,12.16,4.5,4.85,4.5,4.85 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12,5.25 C12,5.25,12,11.25,12,11.25"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M14,7.25 C14,7.25,14,8.25,14,8.25"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M10,7.25 C10,7.25,10,8.25,10,8.25"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M16,21.25 C16,21.25,15,20.25,15,20.25 C15,20.25,14,21.25,14,21.25"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M10,21.25 C10,21.25,9,20.25,9,20.25 C9,20.25,8,21.25,8,21.25"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M8,14.25 C8,14.25,16,14.25,16,14.25 C16,14.25,16,19.25,16,19.25 C16,19.25,8,19.25,8,19.25 C8,19.25,8,14.25,8,14.25 z"/><path style="fill:#ff7bac;fill-opacity:0.75;fill-rule:evenodd;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-width:1;" d="M12,4 C12,4,11.99,4,11.99,4 C6.19,4,3,4.73,3,8.5 C3,11.39,4.66,13,7.27,13 C9.88,13,10.68,11.13,11.99,11.13 C11.99,11.13,12,11.13,12,11.13 C12,11.13,12.01,11.13,12.01,11.13 C13.32,11.13,14.12,13,16.73,13 C19.34,13,21,11.39,21,8.5 C21,4.73,17.81,4,12.01,4 C12.01,4,12,4,12,4 C12,4,12,4,12,4 z"/></g></svg> ', cmy: '<svg class="color filled" viewBox="0 0 24 24"><g><g><path style="fill:#00ff00;fill-rule:evenodd;" d="M12,10.88 C10.9,10.01,9.51,9.5,8,9.5 C7.22,9.5,6.47,9.64,5.78,9.89 C6.37,11.85,7.87,13.42,9.78,14.11 C10.17,12.81,10.96,11.69,12,10.88 z"/><path style="fill:#0000ff;fill-rule:evenodd;" d="M12,10.88 C13.1,10.01,14.49,9.5,16,9.5 C16.78,9.5,17.53,9.64,18.22,9.89 C17.63,11.85,16.13,13.42,14.22,14.11 C13.83,12.81,13.04,11.69,12,10.88 C12,10.88,12,10.88,12,10.88 z"/><path style="fill:#000000;fill-rule:evenodd;" d="M9.78,14.11 C10.17,12.81,10.96,11.69,12,10.88 C13.04,11.69,13.83,12.81,14.22,14.11 C13.53,14.36,12.78,14.5,12,14.5 C11.22,14.5,10.47,14.36,9.78,14.11 C9.78,14.11,9.78,14.11,9.78,14.11 z"/><path style="fill:#ff0000;fill-rule:evenodd;" d="M9.78,14.11 C9.6,14.71,9.5,15.34,9.5,16 C9.5,18.08,10.48,19.93,12,21.12 C13.52,19.93,14.5,18.08,14.5,16 C14.5,15.34,14.4,14.71,14.22,14.11 C13.53,14.36,12.78,14.5,12,14.5 C11.22,14.5,10.47,14.36,9.78,14.11 C9.78,14.11,9.78,14.11,9.78,14.11 z"/><path style="fill:#02fefe;fill-rule:evenodd;" d="M5.78,9.89 C5.6,9.29,5.5,8.66,5.5,8 C5.5,4.41,8.41,1.5,12,1.5 C15.59,1.5,18.5,4.41,18.5,8 C18.5,8.66,18.4,9.29,18.22,9.89 C17.53,9.64,16.78,9.5,16,9.5 C14.49,9.5,13.1,10.01,12,10.88 C10.9,10.01,9.51,9.5,8,9.5 C7.22,9.5,6.47,9.64,5.78,9.89 C5.78,9.89,5.78,9.89,5.78,9.89 z"/><path style="fill:#fffe00;fill-rule:evenodd;" d="M5.78,9.89 C3.28,10.8,1.5,13.19,1.5,16 C1.5,19.59,4.41,22.5,8,22.5 C9.51,22.5,10.9,21.99,12,21.12 C10.48,19.93,9.5,18.08,9.5,16 C9.5,15.34,9.6,14.71,9.78,14.11 C7.87,13.42,6.37,11.85,5.78,9.89 C5.78,9.89,5.78,9.89,5.78,9.89 z"/><path style="fill:#ff00ff;fill-rule:evenodd;" d="M18.22,9.89 C20.72,10.8,22.5,13.19,22.5,16 C22.5,19.59,19.59,22.5,16,22.5 C14.49,22.5,13.1,21.99,12,21.12 C13.52,19.93,14.5,18.08,14.5,16 C14.5,15.34,14.4,14.71,14.22,14.11 C16.13,13.42,17.63,11.85,18.22,9.89 z"/></g></g></svg> ', rgb: '<svg class="color filled" viewBox="0 0 24 24"><g><g><path style="fill:#ff00ff;fill-rule:evenodd;" d="M12,10.88 C10.9,10.01,9.51,9.5,8,9.5 C7.22,9.5,6.47,9.64,5.78,9.89 C6.37,11.85,7.87,13.42,9.78,14.11 C10.17,12.81,10.96,11.69,12,10.88 z"/><path style="fill:#ffff00;fill-rule:evenodd;" d="M12,10.88 C13.1,10.01,14.49,9.5,16,9.5 C16.78,9.5,17.53,9.64,18.22,9.89 C17.63,11.85,16.13,13.42,14.22,14.11 C13.83,12.81,13.04,11.69,12,10.88 C12,10.88,12,10.88,12,10.88 z"/><path style="fill:#ffffff;fill-rule:evenodd;" d="M9.78,14.11 C10.17,12.81,10.96,11.69,12,10.88 C13.04,11.69,13.83,12.81,14.22,14.11 C13.53,14.36,12.78,14.5,12,14.5 C11.22,14.5,10.47,14.36,9.78,14.11 C9.78,14.11,9.78,14.11,9.78,14.11 z"/><path style="fill:#00ffff;fill-rule:evenodd;" d="M9.78,14.11 C9.6,14.71,9.5,15.34,9.5,16 C9.5,18.08,10.48,19.93,12,21.12 C13.52,19.93,14.5,18.08,14.5,16 C14.5,15.34,14.4,14.71,14.22,14.11 C13.53,14.36,12.78,14.5,12,14.5 C11.22,14.5,10.47,14.36,9.78,14.11 C9.78,14.11,9.78,14.11,9.78,14.11 z"/><path style="fill:#ff0000;fill-rule:evenodd;" d="M5.78,9.89 C5.6,9.29,5.5,8.66,5.5,8 C5.5,4.41,8.41,1.5,12,1.5 C15.59,1.5,18.5,4.41,18.5,8 C18.5,8.66,18.4,9.29,18.22,9.89 C17.53,9.64,16.78,9.5,16,9.5 C14.49,9.5,13.1,10.01,12,10.88 C10.9,10.01,9.51,9.5,8,9.5 C7.22,9.5,6.47,9.64,5.78,9.89 C5.78,9.89,5.78,9.89,5.78,9.89 z"/><path style="fill:#0000ff;fill-rule:evenodd;" d="M5.78,9.89 C3.28,10.8,1.5,13.19,1.5,16 C1.5,19.59,4.41,22.5,8,22.5 C9.51,22.5,10.9,21.99,12,21.12 C10.48,19.93,9.5,18.08,9.5,16 C9.5,15.34,9.6,14.71,9.78,14.11 C7.87,13.42,6.37,11.85,5.78,9.89 C5.78,9.89,5.78,9.89,5.78,9.89 z"/><path style="fill:#00ff00;fill-rule:evenodd;" d="M18.22,9.89 C20.72,10.8,22.5,13.19,22.5,16 C22.5,19.59,19.59,22.5,16,22.5 C14.49,22.5,13.1,21.99,12,21.12 C13.52,19.93,14.5,18.08,14.5,16 C14.5,15.34,14.4,14.71,14.22,14.11 C16.13,13.42,17.63,11.85,18.22,9.89 z"/></g></g></svg> ', xrColor: '<svg class="color filled" viewBox="0 0 40 24"><g><g><g><path style="fill:#000000;fill-rule:evenodd;" d="M20,2 C19.99,2,19.98,2,19.98,2 C8.39,2,2,3.61,2,12 C2,18.41,5.32,22,10.54,22 C15.77,22,17.37,17.85,19.98,17.85 C19.98,17.85,19.99,17.85,20,17.85 C20.01,17.85,20.02,17.85,20.02,17.85 C22.63,17.85,24.23,22,29.46,22 C34.68,22,38,18.41,38,12 C38,3.61,31.61,2,20.02,2 C20.02,2,20.01,2,20,2 C20,2,20,2,20,2 z"/></g><path style="fill:#fbed21;fill-rule:evenodd;" d="M12.2,19.84 C15.79,19.39,17.07,16.46,19.07,16.46 C19.07,16.46,19.08,16.46,19.09,16.46 C19.09,16.46,19.1,16.46,19.11,16.46 C19.44,16.46,19.75,16.54,20.06,16.68 C20.37,16.54,20.68,16.46,21.01,16.46 C21.02,16.46,21.02,16.46,21.03,16.46 C21.04,16.46,21.04,16.46,21.05,16.46 C23.05,16.46,24.33,19.39,27.92,19.84 C31.66,19.4,33.98,16.5,33.98,11.62 C33.98,4.91,29.04,3.44,20.06,3.35 C11.07,3.44,6.14,4.91,6.14,11.62 C6.14,16.5,8.46,19.4,12.2,19.84 z"/><path style="fill:#8cc63f;fill-rule:evenodd;" d="M12.2,19.84 C12.52,19.87,12.86,19.89,13.21,19.89 C16.86,19.89,18.37,17.43,20.06,16.68 C19.75,16.54,19.44,16.46,19.11,16.46 C19.1,16.46,19.09,16.46,19.09,16.46 C19.08,16.46,19.07,16.46,19.07,16.46 C17.07,16.46,15.79,19.39,12.2,19.84 z"/><path style="fill:#8cc63f;fill-rule:evenodd;" d="M20.06,3.35 C20.37,3.35,20.69,3.35,21.01,3.35 C21.02,3.35,21.02,3.35,21.03,3.35 C21.03,3.35,21.03,3.35,21.03,3.35 C21.04,3.35,21.04,3.35,21.05,3.35 C30.64,3.35,35.92,4.68,35.92,11.62 C35.92,16.92,33.18,19.89,28.86,19.89 C28.53,19.89,28.22,19.87,27.92,19.84 C31.66,19.4,33.98,16.5,33.98,11.62 C33.98,4.91,29.04,3.44,20.06,3.35 C20.06,3.35,20.06,3.35,20.06,3.35 z"/><path style="fill:#ff1c23;fill-rule:evenodd;" d="M20.06,16.68 C21.74,17.43,23.25,19.89,26.91,19.89 C27.26,19.89,27.59,19.87,27.92,19.84 C24.33,19.39,23.05,16.46,21.05,16.46 C21.04,16.46,21.04,16.46,21.03,16.46 C21.02,16.46,21.02,16.46,21.01,16.46 C20.68,16.46,20.37,16.54,20.06,16.68 z"/><path style="fill:#ff1c23;fill-rule:evenodd;" d="M12.2,19.84 C11.9,19.87,11.59,19.89,11.26,19.89 C6.94,19.89,4.19,16.92,4.19,11.62 C4.19,4.68,9.48,3.35,19.07,3.35 C19.07,3.35,19.08,3.35,19.09,3.35 C19.09,3.35,19.09,3.35,19.09,3.35 C19.09,3.35,19.1,3.35,19.11,3.35 C19.43,3.35,19.75,3.35,20.06,3.35 C11.07,3.44,6.14,4.91,6.14,11.62 C6.14,16.5,8.46,19.4,12.2,19.84 z"/></g><g><path style="fill:#8cc63e;fill-rule:nonzero;" d="M22.55,8.63 C22.55,9.05,22.55,9.46,22.55,9.88 C22.54,10.25,22.85,10.56,23.2,10.55 C23.54,10.56,23.85,10.25,23.85,9.88 C23.85,9.46,23.85,9.05,23.85,8.63 C23.85,8.26,23.54,7.95,23.2,7.96 C22.85,7.95,22.54,8.26,22.55,8.63 z"/><path style="fill:#8cc63e;fill-rule:nonzero;" d="M17.32,8.63 C17.32,9.05,17.32,9.46,17.32,9.88 C17.31,10.25,17.62,10.56,17.97,10.55 C18.31,10.56,18.62,10.25,18.62,9.88 C18.62,9.46,18.62,9.05,18.62,8.63 C18.62,8.26,18.31,7.95,17.97,7.96 C17.62,7.95,17.31,8.26,17.32,8.63 z"/><path style="fill:#8cc63e;fill-rule:nonzero;" d="M19.99,4.39 C19.99,8.09,19.99,11.8,19.99,15.5 C19.99,15.87,20.3,16.18,20.64,16.17 C20.99,16.18,21.3,15.87,21.29,15.5 C21.29,11.8,21.29,8.09,21.29,4.39 C21.3,4.02,20.99,3.71,20.64,3.72 C20.3,3.71,19.99,4.02,19.99,4.39 z"/><path style="fill:#fe1a22;fill-rule:nonzero;" d="M21.43,8.63 C21.43,9.05,21.43,9.46,21.43,9.88 C21.42,10.25,21.73,10.56,22.08,10.55 C22.42,10.56,22.73,10.25,22.73,9.88 C22.73,9.46,22.73,9.05,22.73,8.63 C22.73,8.26,22.42,7.95,22.08,7.96 C21.73,7.95,21.42,8.26,21.43,8.63 z"/><path style="fill:#fe1a22;fill-rule:nonzero;" d="M16.2,8.63 C16.2,9.05,16.2,9.46,16.2,9.88 C16.19,10.25,16.5,10.56,16.85,10.55 C17.19,10.56,17.5,10.25,17.5,9.88 C17.5,9.46,17.5,9.05,17.5,8.63 C17.5,8.26,17.19,7.95,16.85,7.96 C16.5,7.95,16.19,8.26,16.2,8.63 z"/><path style="fill:#fe1a22;fill-rule:nonzero;" d="M18.87,4.39 C18.87,8.09,18.87,11.8,18.87,15.5 C18.87,15.87,19.18,16.18,19.52,16.17 C19.86,16.18,20.18,15.87,20.17,15.5 C20.17,11.8,20.17,8.09,20.17,4.39 C20.18,4.02,19.86,3.71,19.52,3.72 C19.18,3.71,18.87,4.02,18.87,4.39 z"/><path style="fill:#000000;fill-rule:nonzero;" d="M21.97,8.63 C21.97,9.05,21.97,9.46,21.97,9.88 C21.97,10.25,22.28,10.56,22.62,10.55 C22.97,10.56,23.28,10.25,23.27,9.88 C23.27,9.46,23.27,9.05,23.27,8.63 C23.28,8.26,22.97,7.95,22.62,7.96 C22.28,7.95,21.97,8.26,21.97,8.63 z"/><path style="fill:#000000;fill-rule:nonzero;" d="M16.74,8.63 C16.74,9.05,16.74,9.46,16.74,9.88 C16.74,10.25,17.05,10.56,17.39,10.55 C17.74,10.56,18.05,10.25,18.04,9.88 C18.04,9.46,18.04,9.05,18.04,8.63 C18.05,8.26,17.74,7.95,17.39,7.96 C17.05,7.95,16.74,8.26,16.74,8.63 z"/><path style="fill:#000000;fill-rule:nonzero;" d="M19.41,4.39 C19.41,8.09,19.41,11.8,19.41,15.5 C19.41,15.87,19.72,16.18,20.07,16.17 C20.41,16.18,20.72,15.87,20.72,15.5 C20.72,11.8,20.72,8.09,20.72,4.39 C20.72,4.02,20.41,3.71,20.07,3.72 C19.72,3.71,19.41,4.02,19.41,4.39 z"/></g></g></svg> ', tosiUi: '<svg class="color" viewBox="0 0 48 48"><g><g><g><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M3,33 C3,31.9,3.9,31,5,31 C5,31,43,31,43,31 C44.1,31,45,31.9,45,33 C45,33,45,43,45,43 C45,44.1,44.1,45,43,45 C43,45,5,45,5,45 C3.9,45,3,44.1,3,43 C3,43,3,33,3,33 z"/><g><path style="fill:#ffffff;fill-rule:evenodd;stroke:#ed247b;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M7,35 C7,35,7,36.34,7,38 C7,39.66,8.34,41,10,41 C11.66,41,13,39.66,13,38 C13,36.34,13,35,13,35"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#ed247b;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M17,35 C17,35,17,41,17,41"/></g><g><path style="fill:#ed247b;fill-rule:evenodd;stroke:none;" d="M38,33 C40.76,33,43,35.24,43,38 C43,40.76,40.76,43,38,43 C35.24,43,33,40.76,33,38 C33,35.24,35.24,33,38,33 z"/><path style="fill:#ed247b;fill-rule:nonzero;stroke:#ffffff;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M40,36 C40,36,36,40,36,40"/><path style="fill:#ed247b;fill-rule:nonzero;stroke:#ffffff;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M36,36 C36,36,40,40,40,40"/></g></g><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M15.97,21.01 C15.97,21.01,9.97,23.01,9.97,27.01 C9.97,31.01,15.97,31.01,15.97,31.01"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M31.97,21.01 C31.97,21.01,37.97,23.01,37.97,27.01 C37.97,31.01,31.97,31.01,31.97,31.01"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M31,33 C31,33,29.49,31,29.49,31 C29.49,31,27.97,33,27.97,33"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M19.97,33 C19.97,33,17.97,31,17.97,31 C17.97,31,15.97,33,15.97,33"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M15.97,21 C15.97,21,31.97,21,31.97,21 C31.97,21,31.97,31,31.97,31 C31.97,31,15.97,31,15.97,31 C15.97,31,15.97,21,15.97,21 z"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M9,7.18 C9,4.87,10.79,3,13,3 C13,3,35.02,3,35.02,3 C37.23,3,39.03,4.87,39.03,7.18 C39.03,7.18,39.03,21.82,39.03,21.82 C39.03,24.13,37.23,26,35.02,26 C35.02,26,13,26,13,26 C10.79,26,9,24.13,9,21.82 C9,21.82,9,7.18,9,7.18 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M24,11 C24,11,24,23,24,23"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M28,15 C28,15,28,17,28,17"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20,15 C20,15,20,17,20,17"/></g></g></g></svg> ', tosiFavicon: '<svg class="color" viewBox="0 0 48 48"><g><g><path style="fill:#ed247b;fill-rule:evenodd;stroke:none;" d="M1,9 C1,4.58,4.58,1,9,1 C9,1,39,1,39,1 C43.42,1,47,4.58,47,9 C47,9,47,39,47,39 C47,43.42,43.42,47,39,47 C39,47,9,47,9,47 C4.58,47,1,43.42,1,39 C1,39,1,9,1,9 z"/><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M16,29 C16,29,10,31,10,35 C10,39,16,39,16,39"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M32,29 C32,29,38,31,38,35 C38,39,32,39,32,39"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M9,10.18 C9,7.87,10.79,6,13,6 C13,6,35,6,35,6 C37.21,6,39,7.87,39,10.18 C39,10.18,39,24.82,39,24.82 C39,27.13,37.21,29,35,29 C35,29,13,29,13,29 C10.79,29,9,27.13,9,24.82 C9,24.82,9,10.18,9,10.18 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M24,11 C24,11,24,23,24,23"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M28,15 C28,15,28,17,28,17"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20,15 C20,15,20,17,20,17"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M32,43 C32,43,30,41,30,41 C30,41,28,43,28,43"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20,43 C20,43,18,41,18,41 C18,41,16,43,16,43"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M16,29 C16,29,32,29,32,29 C32,29,32,39,32,39 C32,39,16,39,16,39 C16,39,16,29,16,29 z"/></g></g></g></svg> ', tosiPlatform: '<svg class="color" viewBox="0 0 48 48"><g><g><g><path style="fill:#3ea9f5;fill-rule:evenodd;stroke:none;" d="M23.97,47 C23.97,47,39,47,39,47 C43.42,47,47,43.42,47,39 C47,39,47,9,47,9 C47,4.58,43.42,1,39,1 C39,1,9,1,9,1 C4.58,1,1,4.58,1,9 C1,9,1,39,1,39 C1,41.64,2.28,43.98,4.25,45.44 C4.09,44.82,4,44.17,4,43.5 C4,39.36,7.36,36,11.5,36 C15.14,36,18.18,38.6,18.86,42.05 C19.07,42.02,19.28,42,19.5,42 C21.99,42,24,44.01,24,46.5 C24,46.67,23.99,46.84,23.97,47 z"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:none;" d="M4.25,45.44 C4.09,44.82,4,44.17,4,43.5 C4,39.36,7.36,36,11.5,36 C15.14,36,18.18,38.6,18.86,42.05 C19.07,42.02,19.28,42,19.5,42 C21.99,42,24,44.01,24,46.5 C24,46.67,23.99,46.84,23.97,47 C23.97,47,9,47,9,47 C7.22,47,5.58,46.42,4.25,45.44 z"/></g><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M35,35 C35,35,32.17,35,32.17,35 C32.17,35,32.17,37.83,32.17,37.83"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M31,39 C31,39,28.17,39,28.17,39 C28.17,39,28.17,41.83,28.17,41.83"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M7.48,16 C4.45,16,2,18.45,2,21.48 C2,21.48,2,21.48,2,21.48 C2,23.98,4.02,26,6.52,26 C6.52,26,6.62,26,6.62,26 C7.38,26,8,26.62,8,27.38 C8,27.38,8,27.38,8,27.38 C8,29.93,10.07,32,12.62,32 C12.62,32,16,32,16,32 C18.58,32,20.68,29.91,20.68,27.32 C20.68,27.32,20.68,21.42,20.68,21.42 C20.68,18.43,18.25,16,15.26,16 C15.26,16,7.48,16,7.48,16 z"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M17,29 C17,29,33,29,33,29 C33,29,33,29,33,29 C33,34.52,28.52,39,23,39 C23,39,23,39,23,39 C19.69,39,17,36.31,17,33 C17,33,17,29,17,29 z"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M40.52,16 C43.55,16,46,18.45,46,21.48 C46,21.48,46,21.48,46,21.48 C46,23.98,43.98,26,41.48,26 C41.48,26,41.38,26,41.38,26 C40.62,26,40,26.62,40,27.38 C40,27.38,40,27.38,40,27.38 C40,29.93,37.93,32,35.38,32 C35.38,32,32,32,32,32 C29.42,32,27.32,29.91,27.32,27.32 C27.32,27.32,27.32,21.42,27.32,21.42 C27.32,18.43,29.75,16,32.74,16 C32.74,16,40.52,16,40.52,16 z"/><g><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M6,10.18 C6,7.87,7.79,6,10,6 C10,6,32,6,32,6 C34.21,6,36,7.87,36,10.18 C36,10.18,36,24.82,36,24.82 C36,27.13,34.21,29,32,29 C32,29,10,29,10,29 C7.79,29,6,27.13,6,24.82 C6,24.82,6,10.18,6,10.18 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M21,11 C21,11,21,23,21,23"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M25,15 C25,15,25,17,25,17"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M17,15 C17,15,17,17,17,17"/></g></g></g></svg> ', tosi: '<svg class="color" viewBox="0 0 48 48"><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M38.35,31.7 C39.78,34.37,38.78,37.69,36.11,39.13 C36.11,39.13,36.11,39.13,36.11,39.13 C33.92,40.31,31.18,39.48,29.99,37.29 C29.99,37.29,29.95,37.2,29.95,37.2 C29.58,36.53,28.75,36.27,28.08,36.64 C28.08,36.64,28.08,36.64,28.08,36.64 C25.83,37.84,23.03,37,21.82,34.76 C21.82,34.76,20.22,31.78,20.22,31.78 C18.99,29.5,19.85,26.67,22.12,25.44 C22.12,25.44,27.32,22.65,27.32,22.65 C29.96,21.23,33.24,22.22,34.66,24.85 C34.66,24.85,38.35,31.7,38.35,31.7 z"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M10.65,31.7 C9.22,34.37,10.22,37.69,12.89,39.13 C12.89,39.13,12.89,39.13,12.89,39.13 C15.08,40.31,17.82,39.48,19.01,37.29 C19.01,37.29,19.05,37.2,19.05,37.2 C19.42,36.53,20.25,36.27,20.92,36.64 C20.92,36.64,20.92,36.64,20.92,36.64 C23.17,37.84,25.97,37,27.18,34.76 C27.18,34.76,28.78,31.78,28.78,31.78 C30.01,29.5,29.15,26.67,26.88,25.44 C26.88,25.44,21.68,22.65,21.68,22.65 C19.04,21.23,15.76,22.22,14.34,24.85 C14.34,24.85,10.65,31.7,10.65,31.7 z"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M32.5,43 C32.5,43,30.5,41,30.5,41 C30.5,41,28.5,43,28.5,43"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20.5,43 C20.5,43,18.5,41,18.5,41 C18.5,41,16.5,43,16.5,43"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M16.5,29 C16.5,29,32.5,29,32.5,29 C32.5,29,32.5,36,32.5,36 C32.5,37.66,31.16,39,29.5,39 C29.5,39,19.5,39,19.5,39 C17.84,39,16.5,37.66,16.5,36 C16.5,36,16.5,29,16.5,29 z"/><g><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M9.5,10.18 C9.5,7.87,11.29,6,13.5,6 C13.5,6,35.5,6,35.5,6 C37.71,6,39.5,7.87,39.5,10.18 C39.5,10.18,39.5,24.82,39.5,24.82 C39.5,27.13,37.71,29,35.5,29 C35.5,29,13.5,29,13.5,29 C11.29,29,9.5,27.13,9.5,24.82 C9.5,24.82,9.5,10.18,9.5,10.18 z"/><g><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M24.5,11 C24.5,11,24.5,23,24.5,23"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M28.5,15 C28.5,15,28.5,17,28.5,17"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20.5,15 C20.5,15,20.5,17,20.5,17"/></g></g></g></svg> ', sortDescending: '<svg class="stroked" viewBox="0 0 24 24"><g><path d="M16.5,14.5 C16.5,14.5,7.5,14.5,7.5,14.5"/><path d="M14.5,18.5 C14.5,18.5,9.5,18.5,9.5,18.5"/><path d="M18.5,10.5 C18.5,10.5,5.5,10.5,5.5,10.5"/><path d="M20.5,6.5 C20.5,6.5,3.5,6.5,3.5,6.5"/></g></svg> ', columns: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path></svg>', underline: '<svg class="stroked" viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>', grid: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>', triangle: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>', search: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>', volume2: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>', arrowUpCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>', pauseCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>', checkSquare: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>', arrowDown: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>', figma: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path></svg>', cornerRightUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="10 9 15 4 20 9"></polyline><path d="M4 20h7a4 4 0 0 0 4-4V4"></path></svg>', chevronsRight: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>', list: '<svg class="stroked" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>', chevronsDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>', wind: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>', cornerUpRight: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path></svg>', target: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>', scissors: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>', minimize2: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>', playCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>', crosshair: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>', airplay: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg>', xOctagon: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>', repeat: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>', edit3: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>', volume1: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>', sunrise: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline></svg>', toggleRight: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle></svg>', umbrella: '<svg class="stroked" viewBox="0 0 24 24"><path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path></svg>', user: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>', fileMinus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>', xCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>', circle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle></svg>', phoneMissed: '<svg class="stroked" viewBox="0 0 24 24"><line x1="23" y1="1" x2="17" y2="7"></line><line x1="17" y1="1" x2="23" y2="7"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', edit2: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>', cornerLeftUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="14 9 9 4 4 9"></polyline><path d="M20 20h-7a4 4 0 0 1-4-4V4"></path></svg>', home: '<svg class="stroked" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>', gitlab: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path></svg>', music: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>', smartphone: '<svg class="stroked" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>', moreHorizontal: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>', sliders: '<svg class="stroked" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>', arrowUpLeft: '<svg class="stroked" viewBox="0 0 24 24"><line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline></svg>', chevronDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>', hexagon: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>', github: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>', crop: '<svg class="stroked" viewBox="0 0 24 24"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path></svg>', tag: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>', briefcase: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>', rotateCw: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>', map: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>', inbox: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>', alignJustify: '<svg class="stroked" viewBox="0 0 24 24"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>', plusSquare: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>', power: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>', database: '<svg class="stroked" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>', cameraOff: '<svg class="stroked" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path></svg>', toggleLeft: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle></svg>', file: '<svg class="stroked" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>', messageCircle: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>', voicemail: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line></svg>', terminal: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>', move: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>', maximize: '<svg class="stroked" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>', chevronUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>', arrowDownLeft: '<svg class="stroked" viewBox="0 0 24 24"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>', fileText: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>', droplet: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>', zapOff: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="12.41 6.75 13 2 10.57 4.92"></polyline><polyline points="18.57 12.91 21 10 15.66 10"></polyline><polyline points="8 8 3 14 12 14 11 22 16 16"></polyline><line x1="1" y1="1" x2="23" y2="23"></line></svg>', x: '<svg class="stroked" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', barChart: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>', lock: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>', logIn: '<svg class="stroked" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>', shoppingBag: '<svg class="stroked" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>', divide: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="6" r="2"></circle><line x1="5" y1="12" x2="19" y2="12"></line><circle cx="12" cy="18" r="2"></circle></svg>', cloudDrizzle: '<svg class="stroked" viewBox="0 0 24 24"><line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>', refreshCw: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>', chevronRight: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>', clipboard: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>', package: '<svg class="stroked" viewBox="0 0 24 24"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>', instagram: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>', link: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>', videoOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', key: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>', meh: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', cornerDownRight: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path></svg>', arrowRight: '<svg class="stroked" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>', aperture: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>', stopCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>', logOut: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>', arrowLeftCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>', barChart2: '<svg class="stroked" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>', gitPullRequest: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>', minimize: '<svg class="stroked" viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>', minusSquare: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line></svg>', settings: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.6.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.6.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.6.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.6.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>', cloudSnow: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="8" y1="20" x2="8.01" y2="20"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="12" y1="22" x2="12.01" y2="22"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><line x1="16" y1="20" x2="16.01" y2="20"></line></svg>', thumbsDown: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>', type: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>', archive: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>', phoneOutgoing: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 7 23 1 17 1"></polyline><line x1="16" y1="8" x2="23" y2="1"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', pocket: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline></svg>', mail: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>', shield: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>', download: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>', phoneForwarded: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="19 1 23 5 19 9"></polyline><line x1="15" y1="5" x2="23" y2="5"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', cornerRightDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="10 15 15 20 20 15"></polyline><path d="M4 4h7a4 4 0 0 1 4 4v12"></path></svg>', bookOpen: '<svg class="stroked" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>', divideSquare: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>', server: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>', tv: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>', skipForward: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>', volume: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>', userPlus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>', batteryCharging: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline></svg>', layers: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>', slash: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>', radio: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>', book: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>', userMinus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>', bell: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>', gitBranch: '<svg class="stroked" viewBox="0 0 24 24"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>', coffee: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>', code: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>', thermometer: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>', cast: '<svg class="stroked" viewBox="0 0 24 24"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2.01" y2="20"></line></svg>', flag: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>', eyeOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', battery: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line></svg>', disc: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>', frown: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', tool: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>', cpu: '<svg class="stroked" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>', bold: '<svg class="stroked" viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>', hash: '<svg class="stroked" viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>', share2: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>', plus: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>', check: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>', rotateCcw: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>', hardDrive: '<svg class="stroked" viewBox="0 0 24 24"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>', bluetooth: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline></svg>', pieChart: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>', headphones: '<svg class="stroked" viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>', rss: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>', wifi: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>', cornerUpLeft: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>', watch: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path></svg>', info: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>', userX: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>', loader: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>', refreshCcw: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>', folderPlus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>', gitMerge: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg>', mic: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>', copy: '<svg class="stroked" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>', zoomIn: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>', arrowRightCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>', alignRight: '<svg class="stroked" viewBox="0 0 24 24"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>', image: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>', maximize2: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>', checkCircle: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>', sunset: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline></svg>', save: '<svg class="stroked" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>', smile: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', navigation: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>', cloudLightning: '<svg class="stroked" viewBox="0 0 24 24"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline></svg>', paperclip: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>', fastForward: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>', xSquare: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>', award: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>', zoomOut: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>', box: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>', thumbsUp: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>', percent: '<svg class="stroked" viewBox="0 0 24 24"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>', sidebar: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>', square: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>', play: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>', gitCommit: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line></svg>', table: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path></svg>', send: '<svg class="stroked" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>', phoneCall: '<svg class="stroked" viewBox="0 0 24 24"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', speaker: '<svg class="stroked" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>', facebook: '<svg class="filled" version="1" viewBox="0 0 512 512"><path d="M464 0h-416c-26 0-48 22-48 48v416c0 26 22 48 48 48h208v-224h-64v-64h64v-32c0-53 43-96 96-96h64v64h-64c-18 0-32 14-32 32v32h96l-16 64h-80v224h144c26 0 48-22 48-48v-416c0-26-22-48-48-48z"></path></svg> ', codesandbox: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>', camera: '<svg class="stroked" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>', link2: '<svg class="stroked" viewBox="0 0 24 24"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>', printer: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>', folderMinus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line></svg>', arrowUpRight: '<svg class="stroked" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>', truck: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>', lifeBuoy: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>', penTool: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.59 7.59"></path><circle cx="11" cy="11" r="2"></circle></svg>', atSign: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>', feather: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>', trash: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>', wifiOff: '<svg class="stroked" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>', cornerLeftDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="14 15 9 20 4 15"></polyline><path d="M20 4h-7a4 4 0 0 0-4 4v12"></path></svg>', dollarSign: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', star: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>', cloudOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', sun: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>', messageSquare: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>', edit: '<svg class="stroked" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>', anchor: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path></svg>', alertCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>', chevronsUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline></svg>', uploadCloud: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>', twitch: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg>', youtube: '<svg class="filled" version="1" viewBox="0 0 512 512"><g></g><path d="M507 154c0 0-5-35-20-51-20-20-41-21-51-22-72-5-179-5-179-5h-0c0 0-108 0-179 5-10 1-32 1-51 22-15 16-20 51-20 51s-5 41-5 83v39c0 41 5 83 5 83s5 35 20 51c20 20 45 20 57 22 41 4 174 5 174 5s108-0 179-5c10-1 32-1 51-22 15-16 20-51 20-51s5-41 5-83v-39c-0-41-5-83-5-83zM203 322v-144l138 72-138 72z"></path></svg> ', unlock: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>', compass: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>', plusCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>', creditCard: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>', cloudRain: '<svg class="stroked" viewBox="0 0 24 24"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>', trash2: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>', skipBack: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>', filePlus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>', delete: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>', command: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>', clock: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>', octagon: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon></svg>', phone: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', eye: '<svg class="stroked" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>', phoneOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>', codepen: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line></svg>', dribbble: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path></svg>', gift: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>', externalLink: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>', zap: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', trello: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect></svg>', moreVertical: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>', micOff: '<svg class="stroked" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>', share: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>', arrowUp: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>', bellOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', linkedin: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>', video: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>', divideCircle: '<svg class="stroked" viewBox="0 0 24 24"><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line><circle cx="12" cy="12" r="10"></circle></svg>', activity: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>', twitter: '<svg class="stroked" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>', mapPin: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>', filter: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>', phoneIncoming: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="16 2 16 8 22 8"></polyline><line x1="23" y1="1" x2="16" y2="8"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', italic: '<svg class="stroked" viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>', chevronsLeft: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>', calendar: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>', globe: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>', arrowLeft: '<svg class="stroked" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', alignCenter: '<svg class="stroked" viewBox="0 0 24 24"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>', minusCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>', arrowDownRight: '<svg class="stroked" viewBox="0 0 24 24"><line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline></svg>', framer: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7"></path></svg>', volumeX: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>', slack: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path></svg>', cloud: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>', downloadCloud: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg>', shuffle: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>', rewind: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>', upload: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>', trendingDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>', pause: '<svg class="stroked" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>', arrowDownCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line></svg>', bookmark: '<svg class="stroked" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>', alertTriangle: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', userCheck: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>', tablet: '<svg class="stroked" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>', alertOctagon: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>', menu: '<svg class="stroked" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>', chrome: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>', shoppingCart: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>', folder: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>', users: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>', cornerDownLeft: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>', monitor: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', minus: '<svg class="stroked" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line></svg>', helpCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', navigation2: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="12 2 19 21 12 17 5 21 12 2"></polygon></svg>', chevronLeft: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>', film: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>', moon: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>', shieldOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', layout: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>', mousePointer: '<svg class="stroked" viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>', alignLeft: '<svg class="stroked" viewBox="0 0 24 24"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>', heart: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>', trendingUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>', listBullet: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,6 C21,6,10,6,10,6"/><path style="" d="M21,12 C21,12,10,12,10,12"/><path style="" d="M21,18 C21,18,10,18,10,18"/><path style="" d="M5.5,5 C6.05,5,6.5,5.45,6.5,6 C6.5,6.55,6.05,7,5.5,7 C4.95,7,4.5,6.55,4.5,6 C4.5,5.45,4.95,5,5.5,5 z"/><path style="" d="M5.5,11 C6.05,11,6.5,11.45,6.5,12 C6.5,12.55,6.05,13,5.5,13 C4.95,13,4.5,12.55,4.5,12 C4.5,11.45,4.95,11,5.5,11 z"/><path style="" d="M5.5,17 C6.05,17,6.5,17.45,6.5,18 C6.5,18.55,6.05,19,5.5,19 C4.95,19,4.5,18.55,4.5,18 C4.5,17.45,4.95,17,5.5,17 z"/></g></svg> ', indent: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,10 C21,10,8,10,8,10"/><path style="" d="M21,6 C21,6,8,6,8,6"/><path style="" d="M21,14 C21,14,8,14,8,14"/><path style="" d="M21,18 C21,18,8,18,8,18"/><path style="" d="M2.5,9 C2.5,9,5.5,12,5.5,12 C5.5,12,2.5,15,2.5,15"/></g></svg> ', fontBold: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M13.5,11 C15.71,11,17.5,12.68,17.5,14.75 C17.5,16.82,15.71,18.5,13.5,18.5 C13.5,18.5,8.5,18.5,8.5,18.5 C8.5,18.5,8.5,3.5,8.5,3.5 C8.5,3.5,13.5,3.5,13.5,3.5 C15.71,3.5,17.5,5.18,17.5,7.25 C17.5,9.32,15.71,11,13.5,11 C13.5,11,13.5,11,13.5,11 z"/><path style="" d="M13.5,11 C13.5,11,8.5,11,8.5,11"/><path style="" d="M12.5,11 C14.71,11,16.5,12.68,16.5,14.75 C16.5,16.82,14.71,18.5,12.5,18.5 C12.5,18.5,7.5,18.5,7.5,18.5 C7.5,18.5,7.5,3.5,7.5,3.5 C7.5,3.5,12.5,3.5,12.5,3.5 C14.71,3.5,16.5,5.18,16.5,7.25 C16.5,9.32,14.71,11,12.5,11 C12.5,11,12.5,11,12.5,11 z"/><path style="" d="M12.5,11 C12.5,11,7.5,11,7.5,11"/></g></svg> ', fontItalic: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M17,4.5 C17,4.5,13,4.5,13,4.5"/><path style="" d="M11,19.5 C11,19.5,7,19.5,7,19.5"/><path style="" d="M15,4.5 C15,4.5,9,19.5,9,19.5"/></g></svg> ', fontUnderline: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M7.5,3.5 C7.5,3.5,7.5,10.74,7.5,13.5 C7.5,16.26,9.74,18.5,12.5,18.5 C15.26,18.5,17.5,16.26,17.5,13.5 C17.5,10.74,17.5,3.5,17.5,3.5"/><path style="" d="M7.5,21.5 C7.5,21.5,17.5,21.5,17.5,21.5"/></g></svg> ', outdent: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,10 C21,10,8,10,8,10"/><path style="" d="M21,6 C21,6,8,6,8,6"/><path style="" d="M21,14 C21,14,8,14,8,14"/><path style="" d="M21,18 C21,18,8,18,8,18"/><path style="" d="M5.5,9 C5.5,9,2.5,12,2.5,12 C2.5,12,5.5,15,5.5,15"/></g></svg> ', listNumber: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,6 C21,6,10,6,10,6"/><path style="" d="M21,12 C21,12,10,12,10,12"/><path style="" d="M21,18 C21,18,10,18,10,18"/><path style="" d="M4.5,5 C4.5,5,5.5,4,5.5,4 C5.5,4,5.5,8,5.5,8"/><path style="" d="M4.5,10 C4.5,10,5.5,10,5.5,10 C6.05,10,6.5,10.45,6.5,11 C6.5,11,6.5,11,6.5,11 C6.5,11.55,6.05,12,5.5,12 C5.5,12,5.5,12,5.5,12 C4.95,12,4.5,12.45,4.5,13 C4.5,13,4.5,14,4.5,14 C4.5,14,6.5,14,6.5,14"/><path style="" d="M4.5,16 C4.5,16,5.5,16,5.5,16 C6.05,16,6.5,16.45,6.5,17 C6.5,17,6.5,17,6.5,17 C6.5,17.55,6.05,18,5.5,18 C5.5,18,4.5,18,4.5,18 C4.5,18,5.5,18,5.5,18 C6.05,18,6.5,18.45,6.5,19 C6.5,19,6.5,19,6.5,19 C6.5,19.55,6.05,20,5.5,20 C5.5,20,4.5,20,4.5,20"/></g></svg> ', resize: '<svg class="stroked" version="1.1" viewBox="0, 0, 24, 24"><g><path d="M9,3 L3,3 L3,9"/><path d="M15,21 L21,21 L21,15"/><path d="M3,3 L10,10"/><path d="M21,21 L14,14"/></g></svg> ', bug: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M8,6 C8,3.79,9.79,2,12,2 C14.21,2,16,3.79,16,6 C16,6,8,6,8,6 z"/><path style="" d="M20,7 C20,7,18,9,18,9"/><path style="" d="M20,19 C20,19,18,17,18,17"/><path style="" d="M21,13 C21,13,18,13,18,13"/><path style="" d="M16.44,9 C17.3,9,18,9.7,18,10.56 C18,10.56,18,15,18,15 C18,18.31,15.31,21,12,21 C8.69,21,6,18.31,6,15 C6,15,6,10.56,6,10.56 C6,9.7,6.7,9,7.56,9 C7.56,9,16.44,9,16.44,9 z"/><path style="" d="M4,7 C4,7,6,9,6,9"/><path style="" d="M4,19 C4,19,6,17,6,17"/><path style="" d="M3,13 C3,13,6,13,6,13"/><path style="" d="M12,12 C12,12,12,17,12,17"/></g></svg> ', blog: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,10.02 C21,10.02,21,15,21,15 C21,15.53,20.79,16.04,20.41,16.41 C20.04,16.79,19.53,17,19,17 C19,17,7,17,7,17 C5.67,18.33,4.33,19.67,3,21 C3,21,3,5,3,5 C3,4.47,3.21,3.96,3.59,3.59 C3.96,3.21,4.47,3,5,3 C8.53,3,10.49,3,14.02,3"/><path style="" d="M19,2 C19.54,1.46,20.32,1.25,21.05,1.45 C21.78,1.65,22.35,2.22,22.55,2.95 C22.75,3.68,22.54,4.46,22,5 C22,5,15.5,11.5,15.5,11.5 C14.17,11.83,12.83,12.17,11.5,12.5 C11.83,11.17,12.17,9.83,12.5,8.5 C15.67,5.33,15.83,5.17,19,2 z"/><path style="" d="M14.6,3"/><path style="" d="M21,8.77"/><path style="" d="M7,7 C7,7,10,7,10,7"/><path style="" d="M7,10 C7,10,9,10,9,10"/></g></svg> ', sortAscending: '<svg class="stroked" viewBox="0 0 24 24"><g><path d="M16.5,10.5 C16.5,10.5,7.5,10.5,7.5,10.5"/><path d="M14.5,6.5 C14.5,6.5,9.5,6.5,9.5,6.5"/><path d="M18.5,14.5 C18.5,14.5,5.5,14.5,5.5,14.5"/><path d="M20.5,18.5 C20.5,18.5,3.5,18.5,3.5,18.5"/></g></svg> ', npm: '<svg class="filled" version="1" viewBox="0 0 512 512"><path d="M0 0v512h512v-512h-512zM416 416h-64v-256h-96v256h-160v-320h320v320z"></path></svg> ', game: '<svg class="filled" version="1" viewBox="0 0 704 512"><path d="M528 97v-1h-336c-88 0-160 72-160 160s72 160 160 160c52 0 99-25 128-64h64c29 39 76 64 128 64 88 0 160-72 160-160 0-83-63-151-144-159zM288 288h-64v64h-64v-64h-64v-64h64v-64h64v64h64v64zM480 288c-18 0-32-14-32-32s14-32 32-32 32 14 32 32-14 32-32 32zM576 288c-18 0-32-14-32-32 0-18 14-32 32-32s32 14 32 32c0 18-14 32-32 32z"></path></svg> ', google: '<svg class="filled" version="1" viewBox="0 0 512 512"><path d="M256 0c-141 0-256 115-256 256s115 256 256 256 256-115 256-256-115-256-256-256zM260 448c-106 0-192-86-192-192s86-192 192-192c52 0 95 19 129 50l-52 50c-14-14-39-30-77-30-66 0-119 54-119 121s54 121 119 121c76 0 105-55 109-83h-109v-66h181c2 10 3 19 3 32 0 110-73 188-184 188z"></path></svg> ', discord: '<svg class="filled" version="1" viewBox="0 0 1013 768"><path d="M858 64c-60-28-131-51-204-64l-5-1c-8 14-17 32-25 51l-1 4c-35-6-75-9-116-9s-81 3-120 9l4-1c-9-22-18-40-28-57l1 3c-79 14-149 36-214 67l5-2c-132 196-168 387-150 575v0c73 55 158 99 250 127l6 2c19-26 38-55 53-85l2-3c-33-13-62-27-89-43l2 1c7-5 14-11 21-16 75 36 163 57 256 57s181-21 260-59l-4 2c7 6 14 11 21 16-25 15-53 29-83 40l-4 1c17 34 36 63 56 90l-1-2c98-30 183-74 259-130l-2 2c21-218-36-407-151-575zM338 524c-50 0-91-45-91-101s40-102 91-102 92 46 91 102-40 101-91 101zM675 524c-50 0-91-45-91-101s40-102 91-102 92 46 91 102-40 101-91 101z"></path></svg> ' };
var g0 = (i2, l4, s2, o2) => {
  i2.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  for (let y2 of [...i2.querySelectorAll("path, polygon, line, circle, rect, ellipse, polyline")]) {
    if (l4 !== undefined)
      y2.setAttribute("fill", l4);
    if (s2 !== undefined)
      y2.setAttribute("stroke", s2);
    if (o2 !== undefined)
      y2.setAttribute("stroke-width", String(o2));
  }
  let h2 = i2.querySelectorAll("[style]");
  i2.removeAttribute("style");
  for (let y2 of [...h2]) {
    let { fill: e2, stroke: x3, strokeWidth: n3, strokeLinecap: p2, strokeLinejoin: d2 } = y2.style;
    if (e2)
      y2.setAttribute("fill", X.fromCss(e2).html);
    if (x3)
      y2.setAttribute("stroke", X.fromCss(x3).html);
    if (n3)
      y2.setAttribute("strokeWidth", n3);
    if (p2)
      y2.setAttribute("strokeLinecap", p2);
    if (d2)
      y2.setAttribute("strokeLinejoin", d2);
    y2.removeAttribute("style");
  }
  return `url(data:image/svg+xml;charset=UTF-8,${encodeURIComponent(i2.outerHTML)})`;
};
var t3 = new Proxy(O1, { get(i2, l4) {
  let s2 = O1[l4];
  if (l4 && !s2)
    console.warn(`icon ${l4} does not exist`);
  if (!s2)
    s2 = O1.square;
  return (...o2) => {
    let h2 = I.div();
    h2.innerHTML = s2;
    let r2 = h2.querySelector("svg"), y2 = new Set(r2.classList);
    y2.add("tosi-icon");
    let e2 = ZM.svg({ class: Array.from(y2).join(" "), viewBox: r2.getAttribute("viewBox") }, ...o2, ...r2.children);
    if (e2.style.strokeWidth = kE.tosiIconStrokeWidth("2px"), y2.has("filled"))
      e2.style.stroke = "none", e2.style.fill = "currentColor";
    else if (y2.has("stroked"))
      e2.style.stroke = kE.tosiIconStroke("currentColor"), e2.style.fill = "none";
    else
      e2.style.stroke = kE.tosiIconStroke("currentColor"), e2.style.fill = kE.tosiIconFill("currentColor");
    return e2.style.height = kE.tosiIconSize("16px"), e2;
  };
} });

class k0 extends u {
  static initAttributes = { icon: "", size: 0, fill: "", stroke: "", strokeWidth: 1 };
  render() {
    super.render(), this.textContent = "";
    let i2 = {};
    if (this.size)
      i2.height = this.size + "px", this.style.setProperty("--tosi-icon-size", `${this.size}px`), this.style.setProperty("--xin-icon-size", `${this.size}px`);
    if (this.stroke)
      i2.stroke = this.stroke, i2.strokeWidth = this.strokeWidth;
    if (this.fill)
      i2.fill = this.fill;
    this.append(t3[this.icon]({ style: i2 }));
  }
}
var t32 = k0.elementCreator({ tag: "tosi-icon", styleSpec: { ":host": { "--tosi-icon-size": "var(--xin-icon-size, 16px)", "--tosi-icon-stroke-width": "var(--xin-icon-stroke-width, var(--icon-stroke-width, 2px))", "--tosi-icon-stroke-linejoin": "var(--icon-stroke-linejoin, round)", "--tosi-icon-stroke-linecap": "var(--icon-stroke-linecap, round)", "--tosi-icon-fill": "var(--xin-icon-fill, var(--icon-fill, none))", display: "inline-flex", stroke: "currentColor", strokeWidth: kE.tosiIconStrokeWidth("2px"), strokeLinejoin: kE.tosiIconStrokeLinejoin("round"), strokeLinecap: kE.tosiIconStrokeLinecap("round"), fill: kE.tosiIconFill("none") }, ":host, :host svg": { height: kE.tosiIconSize("16px") } } });
var w0 = () => {};

class v0 extends u {
  babylonReady;
  BABYLON;
  static styleSpec = { ":host": { display: "block", position: "relative" }, ":host canvas": { width: "100%", height: "100%" }, ":host .babylonVRicon": { height: 50, width: 80, backgroundColor: "transparent", filter: "drop-shadow(0 0 4px #000c)", backgroundImage: g0(t3.xrColor()), backgroundPosition: "center", backgroundRepeat: "no-repeat", border: "none", borderRadius: 5, borderStyle: "none", outline: "none", transition: "transform 0.125s ease-out" }, ":host .babylonVRicon:hover": { transform: "scale(1.1)" } };
  content = I.canvas({ part: "canvas" });
  constructor() {
    super();
    this.babylonReady = (async () => {
      let { BABYLON: i2 } = await Z("https://cdn.babylonjs.com/babylon.js", "BABYLON");
      return i2;
    })();
  }
  scene;
  engine;
  sceneCreated = w0;
  update = w0;
  _update = () => {
    if (this.scene) {
      if (this.update !== undefined)
        this.update(this, this.BABYLON);
      if (this.scene.activeCamera !== undefined)
        this.scene.render();
    }
  };
  onResize() {
    if (this.engine)
      this.engine.resize();
  }
  loadScene = async (i2, l4, s2) => {
    let { BABYLON: o2 } = await Z("https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js", "BABYLON");
    o2.SceneLoader.Append(i2, l4, this.scene, s2);
  };
  loadUI = async (i2) => {
    let { BABYLON: l4 } = await Z("https://cdn.babylonjs.com/gui/babylon.gui.min.js", "BABYLON"), s2 = l4.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, this.scene), { snippetId: o2, jsonUrl: h2, data: r2, size: y2 } = i2;
    if (y2)
      s2.idealWidth = y2, s2.renderAtIdealSize = true;
    let e2;
    if (o2)
      e2 = await s2.parseFromSnippetAsync(o2);
    else if (h2)
      e2 = await s2.parseFromURLAsync(h2);
    else if (r2)
      e2 = s2.parseContent(r2);
    else
      return null;
    let x3 = s2.getChildren()[0], n3 = x3.children.reduce((p2, d2) => {
      return p2[d2.name] = d2, p2;
    }, {});
    return { advancedTexture: s2, gui: e2, root: x3, widgets: n3 };
  };
  connectedCallback() {
    super.connectedCallback();
    let { canvas: i2 } = this.parts;
    this.babylonReady.then(async (l4) => {
      if (this.BABYLON = l4, this.engine = new l4.Engine(i2, true), this.scene = new l4.Scene(this.engine), this.sceneCreated)
        await this.sceneCreated(this, l4);
      if (this.scene.activeCamera === undefined)
        new l4.ArcRotateCamera("default-camera", -Math.PI / 2, Math.PI / 2.5, 3, new l4.Vector3(0, 0, 0)).attachControl(this.parts.canvas, true);
      this.engine.runRenderLoop(this._update);
    });
  }
}
var a3 = v0.elementCreator({ tag: "tosi-3d" });

class P1 extends u {
  static initAttributes = { src: "", json: "" };
  content = null;
  config = { renderer: "svg", loop: true, autoplay: true };
  static bodymovinAvailable;
  animation;
  static styleSpec = { ":host": { width: 400, height: 400, display: "inline-block" } };
  _loading = false;
  get loading() {
    return this._loading;
  }
  constructor() {
    super();
    if (P1.bodymovinAvailable === undefined)
      P1.bodymovinAvailable = Z("https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js", "bodymovin");
  }
  doneLoading = () => {
    this._loading = false;
  };
  load = ({ bodymovin: i2 }) => {
    if (this._loading = true, this.config.container = this.shadowRoot !== null ? this.shadowRoot : undefined, this.json !== "")
      this.config.animationData = this.json, delete this.config.path;
    else if (this.src !== "")
      delete this.config.animationData, this.config.path = this.src;
    else
      console.log("%c<tosi-lottie>%c expected either %cjson%c (animation data) or %csrc% c(url) but found neither.", "color: #44f; background: #fff; padding: 0 5px", "color: default", "color: #44f; background: #fff; padding: 0 5px", "color: default", "color: #44f; background: #fff; padding: 0 5px", "color: default");
    if (this.animation) {
      this.animation.destroy();
      let l4 = this.shadowRoot;
      if (l4 !== null)
        l4.querySelector("svg")?.remove();
    }
    this.animation = i2.loadAnimation(this.config), this.animation.addEventListener("DOMLoaded", this.doneLoading);
  };
  render() {
    super.render(), P1.bodymovinAvailable.then(this.load).catch((i2) => {
      console.error(i2);
    });
  }
}
var M3 = P1.elementCreator({ tag: "tosi-lottie" });
var { button: p2, slot: m4, div: E1 } = I;

class d2 extends u {
  static initAttributes = { dots: false, arrows: false, maxVisibleItems: 1, snapDuration: 0.25, snapDelay: 0.1, loop: false, auto: 0 };
  lastAutoAdvance = Date.now();
  interval;
  autoAdvance = () => {
    if (this.auto > 0 && this.auto * 1000 < Date.now() - this.lastAutoAdvance)
      this.forward();
  };
  _page = 0;
  get page() {
    return this._page;
  }
  set page(i2) {
    let { scroller: l4, back: s2, forward: o2 } = this.parts;
    if (this.lastPage <= 0)
      o2.disabled = s2.disabled = true, i2 = 0;
    else
      i2 = Math.max(0, Math.min(this.lastPage, i2)), i2 = isNaN(i2) ? 0 : i2;
    if (this._page !== i2)
      this._page = isNaN(i2) ? 0 : i2, this.animateScroll(this._page * l4.offsetWidth), s2.disabled = this.page <= 0 && !this.loop, o2.disabled = this.page >= this.lastPage && !this.loop;
  }
  get visibleItems() {
    return [...this.children].filter((i2) => getComputedStyle(i2).display !== "none");
  }
  get lastPage() {
    return Math.max(Math.ceil(this.visibleItems.length / (this.maxVisibleItems || 1)) - 1, 0);
  }
  static styleSpec = { ":host": { display: "flex", flexDirection: "column", position: "relative" }, ":host svg": { height: fM.carouselIconSize }, ":host button": { outline: "none", border: "none", boxShadow: "none", background: "transparent", color: fM.carouselButtonColor, padding: 0 }, ":host::part(back), :host::part(forward)": { position: "absolute", top: 0, bottom: 0, width: fM.carouseButtonWidth, zIndex: 2 }, ":host::part(back)": { left: 0 }, ":host::part(forward)": { right: 0 }, ":host button:disabled": { opacity: 0.5, pointerEvents: "none" }, ":host button:hover": { color: fM.carouselButtonHoverColor }, ":host button:active": { color: fM.carouselButtonActiveColor }, ":host::part(pager)": { position: "relative" }, ":host::part(scroller)": { overflow: "auto hidden", position: "relative" }, ":host::part(grid)": { display: "grid", justifyItems: "center" }, ":host *::-webkit-scrollbar, *::-webkit-scrollbar-thumb": { display: "none" }, ":host .dot": { background: fM.carouselButtonColor, borderRadius: fM.carouselDotSize, height: fM.carouselDotSize, width: fM.carouselDotSize, transition: fM.carouselDotTransition }, ":host .dot:not(.current):hover": { background: fM.carouselButtonHoverColor, height: fM.carouselDotSize150, width: fM.carouselDotSize150, margin: fM.carouselDotSize_25 }, ":host .dot:not(.current):active": { background: fM.carouselButtonActiveColor }, ":host .dot.current": { background: fM.carouselDotCurrentColor }, ":host::part(progress)": { display: "flex", gap: fM.carouselDotSpacing, justifyContent: "center", padding: fM.carouselProgressPadding } };
  easing = (i2) => {
    return Math.sin(i2 * Math.PI * 0.5);
  };
  indicateCurrent = () => {
    let { scroller: i2, progress: l4 } = this.parts, s2 = i2.scrollLeft / i2.offsetWidth;
    [...l4.children].forEach((o2, h2) => {
      o2.classList.toggle("current", Math.floor(h2 / this.maxVisibleItems - s2) === 0);
    }), this.lastAutoAdvance = Date.now(), clearTimeout(this.snapTimer), this.snapTimer = setTimeout(this.snapPosition, this.snapDelay * 1000);
  };
  snapPosition = () => {
    let { scroller: i2 } = this.parts, l4 = Math.round(i2.scrollLeft / i2.offsetWidth);
    if (l4 !== this.page)
      this.page = l4 > this.page ? Math.ceil(l4) : Math.floor(l4);
    this.lastAutoAdvance = Date.now();
  };
  back = () => {
    this.page = this.page > 0 ? this.page - 1 : this.lastPage;
  };
  forward = () => {
    this.page = this.page < this.lastPage ? this.page + 1 : 0;
  };
  handleDotClick = (i2) => {
    let { progress: l4 } = this.parts, s2 = [...l4.children].indexOf(i2.target);
    if (s2 > -1)
      this.page = Math.floor(s2 / this.maxVisibleItems);
  };
  snapTimer;
  animationFrame;
  animateScroll(i2, l4 = -1, s2 = 0) {
    cancelAnimationFrame(this.animationFrame);
    let { scroller: o2 } = this.parts;
    if (l4 === -1) {
      l4 = o2.scrollLeft, s2 = Date.now(), this.animationFrame = requestAnimationFrame(() => {
        this.animateScroll(i2, l4, s2);
      });
      return;
    }
    let h2 = (Date.now() - s2) / 1000;
    if (h2 >= this.snapDuration || Math.abs(o2.scrollLeft - i2) < 2)
      o2.scrollLeft = i2, this.animationFrame = null;
    else
      o2.scrollLeft = l4 + this.easing(h2 / this.snapDuration) * (i2 - l4), this.animationFrame = requestAnimationFrame(() => {
        this.animateScroll(i2, l4, s2);
      });
  }
  content = () => [E1({ part: "pager" }, p2({ title: "previous slide", part: "back" }, t3.chevronLeft()), E1({ title: "slides", role: "group", part: "scroller" }, E1({ part: "grid" }, m4())), p2({ title: "next slide", part: "forward" }, t3.chevronRight())), E1({ title: "choose slide to display", role: "group", part: "progress" })];
  connectedCallback() {
    super.connectedCallback(), this.ariaRoleDescription = "carousel", this.ariaOrientation = "horizontal", this.ariaReadOnly = "true";
    let { back: i2, forward: l4, scroller: s2, progress: o2 } = this.parts;
    i2.addEventListener("click", this.back), l4.addEventListener("click", this.forward), s2.addEventListener("scroll", this.indicateCurrent), o2.addEventListener("click", this.handleDotClick), this.lastAutoAdvance = Date.now(), this.interval = setInterval(this.autoAdvance, 100);
  }
  disconnectedCallback() {
    clearInterval(this.interval);
  }
  render() {
    super.render();
    let { dots: i2, arrows: l4, visibleItems: s2, lastPage: o2 } = this, { progress: h2, back: r2, forward: y2, grid: e2 } = this.parts;
    s2.forEach((x3) => {
      x3.role = "group";
    }), e2.style.gridTemplateColumns = `${100 / this.maxVisibleItems / (1 + this.lastPage)}% `.repeat(s2.length).trim(), e2.style.width = (1 + this.lastPage) * 100 + "%", h2.textContent = "", h2.append(...s2.map((x3, n3) => p2({ title: `item ${n3 + 1}`, class: "dot" }))), this.indicateCurrent(), h2.style.display = i2 && o2 > 0 ? "" : "none", r2.hidden = y2.hidden = !(l4 && o2 > 0);
  }
}
var S4 = d2.elementCreator({ tag: "tosi-carousel", styleSpec: { ":host": { _carouselIconSize: 24, _carouselButtonColor: "#0004", _carouselButtonHoverColor: "#0006", _carouselButtonActiveColor: "#000c", _carouseButtonWidth: 48, _carouselDotCurrentColor: "#0008", _carouselDotSize: 8, _carouselDotSpacing: fM.carouselDotSize, _carouselProgressPadding: 12, _carouselDotTransition: "0.125s ease-in-out" }, ":host:focus": { outline: "none", boxShadow: "none" } } });
var M0 = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.2/";
var B0 = "ace/theme/tomorrow";
var i5 = async () => {
  let { ace: i2 } = await Z(`${M0}ace.min.js`);
  return i2;
};
var l5 = async (i2, l4 = "html", s2 = {}, o2 = B0) => {
  let h2 = await i5();
  h2.config.set("basePath", M0);
  let r2 = h2.edit(i2, { mode: `ace/mode/${l4}`, tabSize: 2, useSoftTabs: true, useWorker: false, ...s2 });
  return r2.setTheme(o2), { ace: h2, editor: r2 };
};

class M1 extends u {
  source = "";
  get value() {
    return this.editor === undefined ? this.source : this.editor.getValue();
  }
  set value(i2) {
    if (this.editor === undefined)
      this.source = i2;
    else
      this.editor.setValue(i2), this.editor.clearSelection(), this.editor.session.getUndoManager().reset();
  }
  static initAttributes = { mode: "javascript", theme: B0, disabled: false };
  role = "code editor";
  _ace;
  _editor;
  _editorPromise;
  options = {};
  get ace() {
    return this._ace;
  }
  get editor() {
    return this._editor;
  }
  static styleSpec = { ":host": { display: "block", position: "relative", width: "100%", height: "100%" } };
  onResize() {
    if (this.editor !== undefined)
      this.editor.resize(true);
  }
  connectedCallback() {
    if (super.connectedCallback(), this.source === "")
      this.value = this.textContent !== null ? this.textContent.trim() : "";
    if (this._editorPromise === undefined)
      this._editorPromise = l5(this, this.mode, this.options, this.theme), this._editorPromise.then(({ ace: i2, editor: l4 }) => {
        this._ace = i2, this._editor = l4, l4.setValue(this.source, 1), l4.clearSelection(), l4.session.getUndoManager().reset();
      });
  }
  render() {
    if (super.render(), this._editorPromise !== undefined)
      this._editorPromise.then(({ editor: i2 }) => i2.setReadOnly(this.disabled));
  }
}
var $1 = M1.elementCreator({ tag: "tosi-code" });
var { input: f2 } = I;
var z0 = X.fromCss("#8888");

class H0 extends u {
  value = z0.rgba;
  color = z0;
  static styleSpec = { ":host": { _gap: 8, _swatchSize: 32, _cssWidth: 72, _alphaWidth: 72, display: "inline-flex", gap: fM.gap, alignItems: "center" }, ':host input[type="color"]': { border: 0, width: fM.swatchSize, height: fM.swatchSize, background: "transparent" }, ":host::part(alpha)": { width: fM.alphaWidth }, ":host::part(css)": { width: fM.cssWidth, fontFamily: "monospace" } };
  content = [f2({ title: "base color", type: "color", part: "rgb" }), f2({ type: "range", title: "opacity", part: "alpha", min: 0, max: 1, step: 0.05 }), f2({ title: "css color spec", part: "css" })];
  valueChanged = false;
  update = (i2) => {
    let { rgb: l4, alpha: s2, css: o2 } = this.parts;
    if (i2.type === "input")
      this.color = X.fromCss(l4.value), this.color.a = Number(s2.value), o2.value = this.color.html;
    else
      this.color = X.fromCss(o2.value), l4.value = this.color.html.substring(0, 7), s2.value = String(this.color.a);
    l4.style.opacity = String(this.color.a), this.value = this.color.rgba, this.valueChanged = true;
  };
  connectedCallback() {
    super.connectedCallback();
    let { rgb: i2, alpha: l4, css: s2 } = this.parts;
    i2.addEventListener("input", this.update), l4.addEventListener("input", this.update), s2.addEventListener("change", this.update);
  }
  render() {
    if (this.valueChanged) {
      this.valueChanged = false;
      return;
    }
    let { rgb: i2, alpha: l4, css: s2 } = this.parts;
    this.color = X.fromCss(this.value), i2.value = this.color.html.substring(0, 7), i2.style.opacity = String(this.color.a), l4.value = String(this.color.a), s2.value = this.color.html;
  }
}
var j0 = H0.elementCreator({ tag: "tosi-color" });
var h1 = I.div({ style: { content: " ", position: "fixed", top: 0, left: 0, right: 0, bottom: 0 } });
var u1 = { passive: true };
var G2 = (i2, l4, s2 = "move") => {
  if (!i2.type.startsWith("touch")) {
    let { clientX: h2, clientY: r2 } = i2;
    h1.style.cursor = s2, t1(h1), document.body.append(h1);
    let y2 = (e2) => {
      let x3 = e2.clientX - h2, n3 = e2.clientY - r2;
      if (l4(x3, n3, e2) === true)
        h1.removeEventListener("mousemove", y2), h1.removeEventListener("mouseup", y2), h1.remove();
    };
    h1.addEventListener("mousemove", y2, u1), h1.addEventListener("mouseup", y2, u1);
  } else if (i2 instanceof TouchEvent) {
    let h2 = i2.changedTouches[0], r2 = h2.identifier, y2 = h2.clientX, e2 = h2.clientY, x3 = i2.target, n3 = 0, p3 = 0, d3 = (C3) => {
      let k3 = [...C3.touches].find((w2) => w2.identifier === r2);
      if (k3 !== undefined)
        n3 = k3.clientX - y2, p3 = k3.clientY - e2;
      if (C3.type === "touchmove")
        C3.stopPropagation(), C3.preventDefault();
      if (l4(n3, p3, C3) === true || k3 === undefined)
        x3.removeEventListener("touchmove", d3), x3.removeEventListener("touchend", d3), x3.removeEventListener("touchcancel", d3);
    };
    x3.addEventListener("touchmove", d3), x3.addEventListener("touchend", d3, u1), x3.addEventListener("touchcancel", d3, u1);
  }
};
var B1 = (i2 = "body *") => [...document.querySelectorAll(i2)].map((l4) => parseFloat(getComputedStyle(l4).zIndex)).reduce((l4, s2) => isNaN(l4) || Number(l4) < s2 ? s2 : Number(l4), 0);
var t1 = (i2, l4 = "body *") => {
  i2.style.zIndex = String(B1(l4) + 1);
};
var { slot: e5 } = I;

class r1 extends u {
  static floats = new Set;
  static initAttributes = { drag: false, remainOnResize: "remove", remainOnScroll: "remain" };
  content = e5();
  static styleSpec = { ":host": { position: "fixed" } };
  reposition = (i2) => {
    if (i2.target?.closest(".no-drag"))
      return;
    if (this.drag) {
      t1(this);
      let s2 = this.offsetLeft, o2 = this.offsetTop;
      G2(i2, (h2, r2, y2) => {
        if (this.style.left = `${s2 + h2}px`, this.style.top = `${o2 + r2}px`, this.style.right = "auto", this.style.bottom = "auto", y2.type === "mouseup")
          return true;
      });
    }
  };
  connectedCallback() {
    super.connectedCallback(), r1.floats.add(this);
    let i2 = { passive: true };
    this.addEventListener("touchstart", this.reposition, i2), this.addEventListener("mousedown", this.reposition, i2), t1(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), r1.floats.delete(this);
  }
}
var m1 = r1.elementCreator({ tag: "tosi-float" });
window.addEventListener("resize", () => {
  Array.from(r1.floats).forEach((i2) => {
    if (i2.remainOnResize === "hide")
      i2.hidden = true;
    else if (i2.remainOnResize === "remove")
      i2.remove();
  });
}, { passive: true });
document.addEventListener("scroll", (i2) => {
  if (i2.target instanceof HTMLElement && i2.target.closest(r1.tagName))
    return;
  Array.from(r1.floats).forEach((l4) => {
    if (l4.remainOnScroll === "hide")
      l4.hidden = true;
    else if (l4.remainOnScroll === "remove")
      l4.remove();
  });
}, { passive: true, capture: true });
var A0 = (i2) => {
  let { content: l4, target: s2, position: o2, remainOnScroll: h2, remainOnResize: r2, draggable: y2 } = i2, e2 = Array.isArray(l4) ? m1(...l4) : m1(l4);
  if (x5(e2, s2, o2, h2, r2, y2), i2.class)
    e2.setAttribute("class", i2.class);
  return document.body.append(e2), e2;
};
var x5 = (i2, l4, s2, o2, h2, r2 = false) => {
  {
    let { position: w2 } = getComputedStyle(i2);
    if (w2 !== "fixed")
      i2.style.position = "fixed";
    if (h2)
      i2.remainOnResize = h2;
    if (o2)
      i2.remainOnScroll = o2;
    t1(i2);
  }
  i2.drag = r2;
  let { left: y2, top: e2, width: x3, height: n3 } = l4.getBoundingClientRect(), p3 = y2 + x3 * 0.5, d3 = e2 + n3 * 0.5, C3 = window.innerWidth, k3 = window.innerHeight;
  if (s2 === "side")
    s2 = (p3 < C3 * 0.5 ? "e" : "w") + (d3 < k3 * 0.5 ? "s" : "n");
  else if (s2 === "auto" || s2 === undefined)
    s2 = (d3 < k3 * 0.5 ? "s" : "n") + (p3 < C3 * 0.5 ? "e" : "w");
  if (i2.style.top = i2.style.left = i2.style.right = i2.style.bottom = i2.style.transform = "", s2.length === 2) {
    let [w2, O] = s2;
    switch (w2) {
      case "n":
        i2.style.bottom = (k3 - e2).toFixed(2) + "px";
        break;
      case "e":
        i2.style.left = (y2 + x3).toFixed(2) + "px";
        break;
      case "s":
        i2.style.top = (e2 + n3).toFixed(2) + "px";
        break;
      case "w":
        i2.style.right = (C3 - y2).toFixed(2) + "px";
        break;
    }
    switch (O) {
      case "n":
        i2.style.bottom = (k3 - e2 - n3).toFixed(2) + "px";
        break;
      case "e":
        i2.style.left = y2.toFixed(2) + "px";
        break;
      case "s":
        i2.style.top = e2.toFixed(2) + "px";
        break;
      case "w":
        i2.style.right = (C3 - y2 - x3).toFixed(2) + "px";
        break;
    }
    i2.style.transform = "";
  } else if (s2 === "n")
    i2.style.bottom = (k3 - e2).toFixed(2) + "px", i2.style.left = p3.toFixed(2) + "px", i2.style.transform = "translateX(-50%)";
  else if (s2 === "s")
    i2.style.top = (e2 + n3).toFixed(2) + "px", i2.style.left = p3.toFixed(2) + "px", i2.style.transform = "translateX(-50%)";
  else if (s2 === "e")
    i2.style.left = (y2 + x3).toFixed(2) + "px", i2.style.top = d3.toFixed(2) + "px", i2.style.transform = "translateY(-50%)";
  else if (s2 === "w")
    i2.style.right = (C3 - y2).toFixed(2) + "px", i2.style.top = d3.toFixed(2) + "px", i2.style.transform = "translateY(-50%)";
  i2.style.setProperty("--max-height", `calc(100vh - ${i2.style.top || i2.style.bottom})`), i2.style.setProperty("--max-width", `calc(100vw - ${i2.style.left || i2.style.right})`);
};
function C22(i2, l4 = true) {
  return (s2, o2) => {
    let h2 = i2(s2), r2 = i2(o2);
    for (let y2 in h2)
      if (h2[y2] !== r2[y2])
        return (Array.isArray(l4) ? l4[y2] !== false : l4) ? h2[y2] > r2[y2] ? 1 : -1 : h2[y2] > r2[y2] ? -1 : 1;
    return 0;
  };
}
var { button: d5, span: F0, input: f5 } = I;
var q0 = (i2, l4) => {
  return !!i2.find((s2) => {
    if (s2 === null || l4 == null)
      return false;
    else if (Array.isArray(s2))
      return q0(s2, l4);
    else if (s2.value === l4 || s2 === l4)
      return true;
  });
};

class T3 extends u {
  static formAssociated = true;
  static initAttributes = { editable: false, placeholder: "", showIcon: false, hideCaption: false, localized: false, disabled: false, required: false, name: "" };
  _options = [];
  get options() {
    return this._options;
  }
  set options(i2) {
    if (typeof i2 === "string")
      this._options = T3.parseOptionsString(i2);
    else
      this._options = i2;
    this.queueRender();
  }
  static parseOptionsString(i2) {
    return i2.split(",").map((l4) => {
      let s2 = l4.trim();
      if (s2 === "")
        return null;
      let [o2, h2] = s2.split("=").map((e2) => e2.trim());
      if (!h2)
        return { value: o2, caption: o2 };
      let [r2, y2] = h2.split(":").map((e2) => e2.trim());
      return { value: o2, caption: r2 || o2, icon: y2 || undefined };
    });
  }
  value = "";
  filter = "";
  isExpanded = false;
  formDisabledCallback(i2) {
    this.disabled = i2;
  }
  formResetCallback() {
    this.value = "";
  }
  setValue = (i2, l4 = false) => {
    if (this.value !== i2)
      this.value = i2, this.queueRender(true);
    if (l4)
      this.dispatchEvent(new Event("action"));
  };
  getValue = () => this.value;
  get selectOptions() {
    return this.options;
  }
  buildOptionMenuItem = (i2) => {
    if (i2 === null)
      return null;
    let { setValue: l4, getValue: s2 } = this, o2, h2, r2;
    if (typeof i2 === "string")
      h2 = r2 = i2;
    else
      ({ icon: o2, caption: h2, value: r2 } = i2);
    if (this.localized)
      h2 = z2(h2);
    let { options: y2 } = i2;
    if (y2)
      return { icon: o2, caption: h2, checked: () => q0(y2, s2()), menuItems: y2.map(this.buildOptionMenuItem) };
    return { icon: o2, caption: h2, checked: () => s2() === r2, action: typeof r2 === "function" ? async () => {
      let e2 = await r2();
      if (e2 !== undefined)
        l4(e2, true);
    } : () => {
      if (typeof r2 === "string")
        l4(r2, true);
    } };
  };
  poppedOptions = [];
  get optionsMenu() {
    let i2 = this.selectOptions.map(this.buildOptionMenuItem);
    if (this.filter === "")
      return i2;
    let l4 = (s2) => {
      if (s2 === null)
        return true;
      else if (s2.menuItems)
        return s2.menuItems = s2.menuItems.filter(l4), s2.menuItems.length > 0;
      else
        return s2.caption.toLocaleLowerCase().includes(this.filter);
    };
    return i2.filter(l4);
  }
  handleChange = (i2) => {
    let { value: l4 } = this.parts, s2 = l4.value || "";
    if (this.value !== String(s2))
      this.value = s2, this.dispatchEvent(new Event("change"));
    this.filter = "", i2.stopPropagation(), i2.preventDefault();
  };
  handleKey = (i2) => {
    if (i2.key === "Enter")
      i2.preventDefault();
  };
  filterMenu = FE(() => {
    this.filter = this.parts.value.value.toLocaleLowerCase(), p1(0), this.popOptions();
  });
  popOptions = (i2) => {
    if (i2 && i2.type === "click")
      this.filter = "";
    this.poppedOptions = this.optionsMenu, this.isExpanded = true, this.updateAriaExpanded(), J2({ target: this, menuItems: this.poppedOptions, showChecked: true, role: "listbox", onClose: () => {
      this.isExpanded = false, this.updateAriaExpanded();
    } });
  };
  updateAriaExpanded() {
    let { value: i2 } = this.parts;
    i2.setAttribute("aria-expanded", String(this.isExpanded));
  }
  content = () => [d5({ type: "button", part: "button", onClick: this.popOptions }, F0(), f5({ part: "value", value: this.value, tabindex: 0, role: "combobox", ariaHaspopup: "listbox", ariaExpanded: "false", ariaAutocomplete: this.editable ? "list" : "none", onKeydown: this.handleKey, onInput: this.filterMenu, onChange: this.handleChange }), t3.chevronDown())];
  get allOptions() {
    let i2 = [];
    function l4(s2) {
      for (let o2 of s2)
        if (typeof o2 === "string")
          i2.push({ caption: o2, value: o2 });
        else if (o2?.value)
          i2.push(o2);
        else if (o2?.options)
          l4(o2.options);
    }
    return l4(this.selectOptions), i2;
  }
  findOption() {
    return this.allOptions.find((l4) => l4.value === this.value) || { caption: this.value, value: this.value };
  }
  localeChanged = () => {
    this.queueRender();
  };
  connectedCallback() {
    super.connectedCallback();
    let i2 = this.getAttribute("options");
    if (i2 && this._options.length === 0)
      this._options = T3.parseOptionsString(i2);
    if (this.localized)
      a2.allInstances.add(this);
  }
  disconnectedCallback() {
    if (super.disconnectedCallback(), this.localized)
      a2.allInstances.delete(this);
  }
  render() {
    super.render();
    let { value: i2, button: l4 } = this.parts;
    l4.disabled = this.disabled;
    let s2 = i2.previousElementSibling, o2 = this.findOption(), h2 = F0();
    if (i2.value = this.localized ? z2(o2.caption) : o2.caption, o2.icon)
      if (o2.icon instanceof HTMLElement)
        h2 = o2.icon.cloneNode(true);
      else
        h2 = t3[o2.icon]();
    s2.replaceWith(h2), i2.setAttribute("placeholder", this.localized ? z2(this.placeholder) : this.placeholder), i2.style.pointerEvents = this.editable ? "" : "none", i2.readOnly = !this.editable;
  }
}
var X3 = T3.elementCreator({ tag: "tosi-select", styleSpec: { ":host": { "--tosi-select-gap": "var(--tosi-spacing-sm, 8px)", "--tosi-select-touch-size": "var(--tosi-touch-size, 44px)", "--tosi-select-padding": "0 var(--tosi-spacing-sm, 8px)", "--tosi-select-value-padding": "0 var(--tosi-spacing-sm, 8px)", "--tosi-select-icon-width": "24px", "--tosi-select-field-width": "140px", "--gap": "var(--tosi-select-gap)", "--touch-size": "var(--tosi-select-touch-size)", "--padding": "var(--tosi-select-padding)", "--value-padding": "var(--tosi-select-value-padding)", "--icon-width": "var(--tosi-select-icon-width)", "--fieldWidth": "var(--tosi-select-field-width)", display: "inline-flex", position: "relative" }, ":host button": { display: "flex", alignItems: "center", justifyItems: "center", gap: fM.tosiSelectGap, textAlign: "left", height: fM.tosiSelectTouchSize, padding: fM.tosiSelectPadding, position: "relative", width: "100%" }, ":host:not([show-icon]) button > :first-child": { display: "none" }, ":host[hide-caption] button > :nth-child(2)": { display: "none" }, ':host [part="value"]': { width: fM.tosiSelectFieldWidth, padding: fM.tosiSelectValuePadding, height: fM.tosiSelectTouchSize, lineHeight: fM.tosiSelectTouchSize, boxShadow: "none", whiteSpace: "nowrap", outline: "none", background: "transparent", flex: "1" }, ':host [part="value"]:not(:focus)': { overflow: "hidden", textOverflow: "ellipsis", background: "transparent" } } });
var r9 = gE((...i2) => X3(...i2), "xinSelect is deprecated, use tosiSelect instead (tag is now <tosi-select>)");
var { span: _0 } = I;
var { i18n: A } = xE({ i18n: { locale: window.navigator.language, locales: [window.navigator.language], languages: [window.navigator.language], emoji: [""], stringMap: {}, localeOptions: [{ icon: _0(), caption: window.navigator.language, value: window.navigator.language }] } });
TE.localeOptions = { toDOM(i2, l4) {
  if (i2 instanceof T3)
    i2.options = l4;
} };
var O0 = () => {
  let i2 = Array.from(i1.allInstances);
  for (let l4 of i2)
    l4.localeChanged();
};
A.locale.observe(O0);
var g5 = C22((i2) => [i2.caption.toLocaleLowerCase()]);
function z2(i2) {
  if (i2.endsWith("…"))
    return z2(i2.substring(0, i2.length - 1)) + "…";
  let l4 = A.locales.value.indexOf(A.locale.value);
  if (l4 > -1) {
    let o2 = A.stringMap.value[i2.toLocaleLowerCase()], h2 = o2 && o2[l4];
    if (h2)
      i2 = i2.toLocaleLowerCase() === i2 ? h2.toLocaleLowerCase() : h2;
  }
  return i2;
}

class g2 extends u {
  static initAttributes = { hideCaption: false };
  content = () => {
    return X3({ part: "select", showIcon: true, title: z2("Language"), bindValue: A.locale, bindLocaleOptions: A.localeOptions });
  };
  render() {
    super.render(), this.parts.select.toggleAttribute("hide-caption", this.hideCaption);
  }
}
var k5 = g2.elementCreator({ tag: "tosi-locale-picker" });
class i1 extends u {
  static allInstances = new Set;
  static initAttributes = { refString: "" };
  contents = () => I.xinSlot();
  connectedCallback() {
    super.connectedCallback(), i1.allInstances.add(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), i1.allInstances.delete(this);
  }
  localeChanged() {
    if (!this.refString)
      this.refString = this.textContent || "";
    this.textContent = this.refString ? z2(this.refString) : "";
  }
  render() {
    super.render(), this.localeChanged();
  }
}
var a2 = i1;
var l1 = i1.elementCreator({ tag: "tosi-localized", styleSpec: { ":host": { pointerEvents: "none" } } });
var P0 = (i2, l4) => {
  l4 = l4.toLocaleLowerCase();
  let s2 = !!l4.match(/\^|ctrl/), o2 = !!l4.match(/⌘|meta/), h2 = !!l4.match(/⌥|⎇|alt|option/), r2 = !!l4.match(/⇧|shift/), y2 = l4.slice(-1);
  return i2.key === y2 && i2.metaKey === o2 && i2.ctrlKey === s2 && i2.altKey === h2 && i2.shiftKey === r2;
};
var { div: $0, button: k22, span: K2, a: B5, xinSlot: z5 } = I;
hL("xin-menu-helper", { ".xin-menu": { overflow: "hidden auto", maxHeight: `calc(${fM.maxHeight} - ${kE.menuInset("8px")})`, borderRadius: fM.spacing50, background: kE.menuBg("#fafafa"), boxShadow: kE.menuShadow(`${fM.spacing13} ${fM.spacing50} ${fM.spacing} #0004`) }, ".xin-menu > div": { width: kE.menuWidth("auto") }, ".xin-menu-trigger": { paddingLeft: 0, paddingRight: 0, minWidth: kE.touchSize("48px") }, ".xin-menu-separator": { display: "inline-block", content: " ", height: "1px", width: "100%", background: kE.menuSeparatorColor("#2224"), margin: kE.menuSeparatorMargin("8px 0") }, ".xin-menu-item": { boxShadow: "none", border: "none !important", display: "grid", alignItems: "center", justifyContent: "flex-start", textDecoration: "none", gridTemplateColumns: "0px 1fr 30px", width: "100%", gap: 0, background: "transparent", padding: kE.menuItemPadding("0 16px"), height: kE.menuItemHeight("48px"), lineHeight: kE.menuItemHeight("48px"), textAlign: "left" }, ".xin-menu-item, .xin-menu-item > span": { color: kE.menuItemColor("#222") }, ".xin-menu-with-icons .xin-menu-item": { gridTemplateColumns: "30px 1fr 30px" }, ".xin-menu-item svg": { stroke: kE.menuItemIconColor("#222") }, ".xin-menu-item.xin-menu-item-checked": { background: kE.menuItemHoverBg("#eee") }, ".xin-menu-item > span:nth-child(2)": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" }, ".xin-menu-item:hover": { boxShadow: "none !important", background: kE.menuItemHoverBg("#eee") }, ".xin-menu-item:active": { boxShadow: "none !important", background: kE.menuItemActiveBg("#aaa"), color: kE.menuItemActiveColor("#000") }, ".xin-menu-item:active svg": { stroke: kE.menuItemIconActiveColor("#000") } });
var H5 = (i2, l4) => {
  let s2 = i2.checked && i2.checked() && "check" || false, o2 = i2?.icon || s2 || K2(" ");
  if (typeof o2 === "string")
    o2 = t3[o2]();
  let h2 = l4.role === "listbox" ? "option" : "menuitem", r2;
  if (typeof i2?.action === "string")
    r2 = B5({ class: "xin-menu-item", role: h2, href: i2.action }, o2, l4.localized ? K2(z2(i2.caption)) : K2(i2.caption), K2(i2.shortcut || " "));
  else
    r2 = k22({ class: "xin-menu-item", role: h2, onClick: i2.action }, o2, l4.localized ? K2(z2(i2.caption)) : K2(i2.caption), K2(i2.shortcut || " "));
  if (r2.classList.toggle("xin-menu-item-checked", s2 !== false), l4.role === "listbox" && s2)
    r2.setAttribute("aria-selected", "true");
  if (i2?.enabled && !i2.enabled())
    r2.setAttribute("disabled", ""), r2.setAttribute("aria-disabled", "true");
  return r2;
};
var j5 = (i2, l4) => {
  let s2 = i2.checked && i2.checked() && "check" || false, o2 = i2?.icon || s2 || K2(" ");
  if (typeof o2 === "string")
    o2 = t3[o2]();
  let h2 = k22({ class: "xin-menu-item", disabled: !(!i2.enabled || i2.enabled()), onClick(r2) {
    J2(Object.assign({}, l4, { menuItems: i2.menuItems, target: h2, submenuDepth: (l4.submenuDepth || 0) + 1, position: "side" })), r2.stopPropagation(), r2.preventDefault();
  } }, o2, l4.localized ? K2(z2(i2.caption)) : K2(i2.caption), t3.chevronRight({ style: { justifySelf: "flex-end" } }));
  return h2;
};
var A5 = (i2, l4) => {
  if (i2 === null)
    return K2({ class: "xin-menu-separator" });
  else {
    let s2 = i2?.action ? H5(i2, l4) : j5(i2, l4);
    if (l4.showChecked && i2.checked && i2.checked())
      requestAnimationFrame(() => {
        s2.scrollIntoView({ block: "center" });
      });
    return s2;
  }
};
var F5 = (i2) => {
  let { target: l4, width: s2, menuItems: o2, role: h2 = "menu" } = i2, r2 = o2.find((y2) => y2?.icon || y2?.checked);
  return $0({ class: r2 ? "xin-menu xin-menu-with-icons" : "xin-menu", role: h2, onClick() {
    p1(0);
  } }, $0({ style: { minWidth: l4.offsetWidth + "px", width: typeof s2 === "number" ? `${s2}px` : s2 }, onMousedown(y2) {
    y2.preventDefault(), y2.stopPropagation();
  } }, ...o2.map((y2) => A5(y2, i2))));
};
var z1;
var d1 = [];
var p1 = (i2 = 0) => {
  let l4 = d1.splice(i2);
  for (let s2 of l4)
    if (s2.menu.remove(), s2.onClose)
      s2.onClose();
  return z1 = l4[0], i2 > 0 ? d1[i2 - 1] : undefined;
};
document.body.addEventListener("mousedown", (i2) => {
  if (i2.target && !d1.find((l4) => l4.target.contains(i2.target)))
    p1(0);
});
document.body.addEventListener("keydown", (i2) => {
  if (i2.key === "Escape")
    p1(0);
});
var J2 = (i2) => {
  i2 = Object.assign({ submenuDepth: 0 }, i2);
  let { target: l4, position: s2, submenuDepth: o2 } = i2;
  if (z1 && !document.body.contains(z1?.menu))
    z1 = undefined;
  if (d1.length && !document.body.contains(d1[0].menu))
    d1.splice(0);
  if (o2 === 0 && z1?.target === l4)
    return;
  let h2 = p1(o2);
  if (z1?.target === l4)
    return;
  if (h2 && h2.target === l4) {
    p1();
    return;
  }
  if (!i2.menuItems?.length)
    return;
  let r2 = F5(i2), y2 = A0({ content: r2, target: l4, position: s2 });
  y2.remainOnScroll = "remove", d1.push({ target: l4, menu: y2, onClose: i2.onClose });
};
function J0(i2, l4) {
  for (let s2 of i2) {
    if (!s2)
      continue;
    let { shortcut: o2 } = s2, { menuItems: h2 } = s2;
    if (o2) {
      if (P0(l4, o2))
        return s2;
    } else if (h2) {
      let r2 = J0(h2, l4);
      if (r2)
        return r2;
    }
  }
  return;
}

class w2 extends u {
  static initAttributes = { menuWidth: "auto", localized: false, icon: "" };
  menuItems = [];
  showMenu = (i2) => {
    if (i2.type === "click" || i2.code === "Space")
      J2({ target: this.parts.trigger, width: this.menuWidth, localized: this.localized, menuItems: this.menuItems }), i2.stopPropagation(), i2.preventDefault();
  };
  content = () => k22({ tabindex: 0, part: "trigger", onClick: this.showMenu }, z5());
  handleShortcut = async (i2) => {
    let l4 = J0(this.menuItems, i2);
    if (l4) {
      if (l4.action instanceof Function)
        l4.action();
    }
  };
  constructor() {
    super();
    this.addEventListener("keydown", this.showMenu);
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("keydown", this.handleShortcut, true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("keydown", this.handleShortcut);
  }
}
var q5 = w2.elementCreator({ tag: "tosi-menu", styleSpec: { ":host": { display: "inline-block" }, ":host button > xin-slot": { display: "flex", alignItems: "center", gap: kE.tosiMenuTriggerGap("10px") } } });
var B2 = {};
X4(B2, { init: () => M2, draggedElement: () => P5 });
var V5 = () => !!document.querySelector(".drag-source");
var G0 = (i2, l4) => {
  if (!i2)
    return false;
  for (let s2 of i2)
    if (s2 === "special/any")
      return true;
    else if (s2.indexOf("*") > -1) {
      let [o2, h2] = s2.split("/"), [r2, y2] = l4.split("/");
      if ((o2 === "*" || o2 === r2) && (h2 === "*" || h2 === y2))
        return true;
    } else if (s2 === l4)
      return true;
};
var S1 = (i2) => {
  for (let l4 of [...document.querySelectorAll(`.${i2}`)])
    l4.classList.remove(i2);
};
var U0 = () => {
  S1("drag-over"), S1("drag-source"), S1("drag-target");
};
var v22 = (i2, l4 = ";") => {
  return (i2 || "").split(l4).map((s2) => s2.trim()).filter((s2) => s2 !== "");
};
var Z0 = (i2) => {
  if (!i2)
    i2 = [];
  let l4 = [...document.querySelectorAll("[data-drop]")];
  for (let s2 of l4) {
    let o2 = v22(s2.dataset.drop);
    if (i2.find((h2) => G0(o2, h2)))
      s2.classList.add("drag-target");
    else
      s2.classList.remove("drag-target");
  }
};
function L5(i2) {
  let l4 = i2.target?.closest('[draggable="true"],a[href]');
  if (!l4)
    return;
  l4.classList.add("drag-source");
  let s2 = l4.matches('[draggable="true"]') ? v22(l4.dataset.drag || "text/html") : v22(l4.dataset.drag || "url");
  for (let o2 of s2) {
    let h2 = l4.dataset.dragContent || (o2 === "text/html" ? l4.innerHTML : l4.textContent);
    i2.dataTransfer?.setData(o2, h2 || "");
  }
  Z0(i2.dataTransfer?.types), i2.stopPropagation();
}
function Q0(i2) {
  if (!V5())
    Z0(i2.dataTransfer?.types);
  let l4 = i2.target.closest(".drag-target");
  if (l4 && i2.dataTransfer)
    l4.classList.add("drag-over"), i2.dataTransfer.dropEffect = "copy";
  else
    i2.preventDefault(), i2.stopPropagation();
}
function _5() {
  S1("drag-over");
}
function O5(i2) {
  let l4 = i2.target.closest(".drag-target");
  if (l4) {
    let s2 = (l4.dataset?.drop || "").split(";");
    for (let o2 of s2)
      if (G0(i2.dataTransfer?.types, o2))
        if (o2 === "text/html")
          l4.innerHTML = i2.dataTransfer?.getData(o2) || "";
        else
          l4.textContent = i2.dataTransfer?.getData(o2) || "";
  }
  U0();
}
var P5 = () => document.querySelector(".drag-source");
var b0 = false;
var M2 = () => {
  if (b0)
    return;
  document.body.addEventListener("dragstart", L5), document.body.addEventListener("dragenter", Q0), document.body.addEventListener("dragover", Q0), document.body.addEventListener("drop", O5), document.body.addEventListener("dragleave", _5), document.body.addEventListener("dragend", U0), window.addEventListener("dragover", (i2) => i2.preventDefault()), window.addEventListener("drop", (i2) => i2.preventDefault()), b0 = true;
};
function b5(i2, l4, s2) {
  let o2 = i2.find((h2) => h2[l4] !== undefined && h2[l4] !== null);
  if (o2 !== undefined) {
    let h2 = o2[l4];
    switch (typeof h2) {
      case "string":
        if (h2.match(/^\d+(\.\d+)?$/))
          return 6 * s2;
        else if (h2.includes(" "))
          return 20 * s2;
        else
          return 12 * s2;
      case "number":
        return 6 * s2;
      case "boolean":
        return 5 * s2;
      case "object":
        return false;
      default:
        return 8 * s2;
    }
  }
  return false;
}
var { div: H1, span: z22, button: G5, template: U5 } = I;
var K0 = (i2) => i2;

class H2 extends u {
  static initAttributes = { rowHeight: 30, charWidth: 15, minColumnWidth: 30, select: false, multiple: false, pinnedTop: 0, pinnedBottom: 0, nosort: false, nohide: false, noreorder: false, localized: false };
  selectionChanged = () => {};
  selectedKey = Symbol("selected");
  selectBinding = (i2, l4) => {
    i2.toggleAttribute("aria-selected", l4[this.selectedKey] === true);
  };
  maxVisibleRows = 1e4;
  get value() {
    return { array: this.array, filter: this.filter, columns: this.columns };
  }
  set value(i2) {
    let { array: l4, columns: s2, filter: o2 } = C(i2);
    if (this._array !== l4 || this._columns !== s2 || this._filter !== o2)
      this.queueRender();
    this._array = l4 || [], this._columns = s2 || null, this._filter = o2 || K0;
  }
  rowData = { visible: [], pinnedTop: [], pinnedBottom: [] };
  _array = [];
  _columns = null;
  _filter = K0;
  get virtual() {
    return this.rowHeight > 0 ? { height: this.rowHeight } : undefined;
  }
  constructor() {
    super();
    this.rowData = xE({ [this.instanceId]: this.rowData })[this.instanceId];
  }
  get array() {
    return this._array;
  }
  set array(i2) {
    this._array = C(i2), this.queueRender();
  }
  get filter() {
    return this._filter;
  }
  set filter(i2) {
    if (this._filter !== i2)
      this._filter = i2, this.queueRender();
  }
  get sort() {
    if (this._sort)
      return this._sort;
    let i2 = this._columns?.find((s2) => s2.sort === "ascending" || s2.sort === "descending");
    if (!i2)
      return;
    let { prop: l4 } = i2;
    return i2.sort === "ascending" ? (s2, o2) => s2[l4] > o2[l4] ? 1 : -1 : (s2, o2) => s2[l4] > o2[l4] ? -1 : 1;
  }
  set sort(i2) {
    if (this._sort !== i2)
      this._sort = i2, this.queueRender();
  }
  get columns() {
    if (!Array.isArray(this._columns)) {
      let { _array: i2 } = this;
      this._columns = Object.keys(i2[0] || {}).map((l4) => {
        let s2 = b5(i2, l4, this.charWidth);
        return { name: l4.replace(/([a-z])([A-Z])/g, "$1 $2").toLocaleLowerCase(), prop: l4, align: typeof i2[0][l4] === "number" || i2[0][l4] !== "" && !isNaN(i2[0][l4]) ? "right" : "left", visible: s2 !== false, width: s2 ? s2 : 0 };
      });
    }
    return this._columns;
  }
  set columns(i2) {
    this._columns = i2, this.queueRender();
  }
  get visibleColumns() {
    return this.columns.filter((i2) => i2.visible !== false);
  }
  content = null;
  getColumn(i2) {
    let l4 = (i2.touches !== undefined ? i2.touches[0].clientX : i2.clientX) - this.getBoundingClientRect().x, s2 = i2.touches !== undefined ? 20 : 5, o2 = 0, h2 = [];
    return this.visibleColumns.find((y2) => {
      if (y2.visible !== false)
        return o2 += y2.width, h2.push(o2), Math.abs(l4 - o2) < s2;
    });
  }
  setCursor = (i2) => {
    if (this.getColumn(i2) !== undefined)
      this.style.cursor = "col-resize";
    else
      this.style.cursor = "";
  };
  resizeColumn = (i2) => {
    let l4 = this.getColumn(i2);
    if (l4 !== undefined) {
      let s2 = Number(l4.width), o2 = i2.touches !== undefined, h2 = o2 ? i2.touches[0].identifier : undefined;
      G2(i2, (r2, y2, e2) => {
        if ((o2 ? [...e2.touches].find((p3) => p3.identifier === h2) : true) === undefined)
          return true;
        let n3 = s2 + r2;
        if (l4.width = n3 > this.minColumnWidth ? n3 : this.minColumnWidth, this.setColumnWidths(), e2.type === "mouseup")
          return true;
      }, "col-resize");
    }
  };
  selectRow(i2, l4 = true) {
    if (l4)
      i2[this.selectedKey] = true;
    else
      delete i2[this.selectedKey];
  }
  selectRows(i2, l4 = true) {
    for (let s2 of i2 || this.array)
      this.selectRow(s2, l4);
  }
  deSelect(i2) {
    this.selectRows(i2, false);
  }
  rangeStart;
  updateSelection = (i2) => {
    if (!this.select && !this.multiple)
      return;
    let { target: l4 } = i2;
    if (!(l4 instanceof HTMLElement))
      return;
    let s2 = l4.closest(".tr");
    if (!(s2 instanceof HTMLElement))
      return;
    let o2 = GM(s2);
    if (o2 === false)
      return;
    let h2 = i2, r2 = window.getSelection();
    if (r2 !== null)
      r2.removeAllRanges();
    let y2 = this.visibleRows;
    if (this.multiple && h2.shiftKey && y2.length > 0 && this.rangeStart !== o2) {
      let e2 = this.rangeStart === undefined || this.rangeStart[this.selectedKey] === true, [x3, n3] = [this.rangeStart !== undefined ? y2.indexOf(this.rangeStart) : 0, y2.indexOf(o2)].sort((p3, d3) => p3 - d3);
      if (x3 > -1)
        for (let p3 = x3;p3 <= n3; p3++) {
          let d3 = y2[p3];
          this.selectRow(d3, e2);
        }
    } else if (this.multiple && h2.metaKey) {
      this.selectRow(o2, !o2[this.selectedKey]);
      let e2 = y2.indexOf(o2), x3 = y2[e2 + 1], n3 = e2 > 0 ? y2[e2 - 1] : undefined;
      if (x3 !== undefined && x3[this.selectedKey] === true)
        this.rangeStart = x3;
      else if (n3 !== undefined && n3[this.selectedKey] === true)
        this.rangeStart = n3;
      else
        this.rangeStart = undefined;
    } else
      this.rangeStart = o2, this.deSelect(), this.selectRow(o2, true);
    this.selectionChanged(this.visibleSelectedRows);
    for (let e2 of Array.from(this.querySelectorAll(".tr"))) {
      let x3 = GM(e2);
      this.selectBinding(e2, x3);
    }
  };
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("mousemove", this.setCursor), this.addEventListener("mousedown", this.resizeColumn), this.addEventListener("touchstart", this.resizeColumn, { passive: true }), this.addEventListener("mouseup", this.updateSelection), this.addEventListener("touchend", this.updateSelection);
  }
  setColumnWidths() {
    let i2 = this.visibleColumns.map((s2) => s2.width + "px").join(" "), l4 = this.visibleColumns.reduce((s2, o2) => s2 + o2.width, 0) + "px";
    this.style.setProperty("--tosi-table-grid-columns", i2), this.style.setProperty("--tosi-table-grid-row-width", l4), this.style.setProperty("--grid-columns", i2), this.style.setProperty("--grid-row-width", l4);
  }
  sortByColumn = (i2, l4 = "auto") => {
    for (let s2 of this.columns.filter((o2) => C(o2.sort) !== false))
      if (C(s2) === i2) {
        if (l4 === "auto")
          s2.sort = s2.sort === "ascending" ? "descending" : "ascending";
        else
          s2.sort = l4;
        this.queueRender();
      } else
        delete s2.sort;
  };
  popColumnMenu = (i2, l4) => {
    let { sortByColumn: s2 } = this, o2 = this.columns.filter((y2) => y2.visible === false), h2 = this.queueRender.bind(this), r2 = [];
    if (!this.nosort && l4.sort !== false)
      r2.push({ caption: this.localized ? `${z2("Sort")} ${z2("Ascending")}` : "Sort Ascending", icon: "sortAscending", action() {
        s2(l4);
      } }, { caption: this.localized ? `${z2("Sort")} ${z2("Descending")}` : "Sort Descending", icon: "sortDescending", action() {
        s2(l4, "descending");
      } });
    if (!this.nohide) {
      if (r2.length)
        r2.push(null);
      r2.push({ caption: this.localized ? `${z2("Hide")} ${z2("Column")}` : "Hide Column", icon: "eyeOff", enabled: () => l4.visible !== true, action() {
        l4.visible = false, h2();
      } }, { caption: this.localized ? `${z2("Show")} ${z2("Column")}` : "Show Column", icon: "eye", enabled: () => o2.length > 0, menuItems: o2.map((y2) => {
        return { caption: y2.name || y2.prop, action() {
          delete y2.visible, h2();
        } };
      }) });
    }
    J2({ target: i2, localized: this.localized, menuItems: r2 });
  };
  get captionSpan() {
    return this.localized ? l1 : z22;
  }
  headerCell = (i2) => {
    let { popColumnMenu: l4 } = this, s2 = "none", o2;
    switch (i2.sort) {
      case "ascending":
        o2 = t3.sortAscending(), s2 = "descending";
        break;
      case false:
        break;
      default:
        break;
      case "descending":
        s2 = "ascending", o2 = t3.sortDescending();
    }
    let h2 = !(this.nosort && this.nohide) ? G5({ class: "menu-trigger", onClick(r2) {
      l4(r2.target, i2), r2.stopPropagation();
    } }, o2 || t3.moreVertical()) : {};
    return i2.headerCell !== undefined ? i2.headerCell(i2) : z22({ class: "th", role: "columnheader", ariaSort: s2, style: { ...this.cellStyle, justifyContent: i2.align || "left" } }, this.captionSpan({ style: { flex: "1" } }, typeof i2.name === "string" ? i2.name : i2.prop), h2);
  };
  dataCell = (i2) => {
    if (i2.dataCell !== undefined)
      return i2.dataCell(i2);
    return z22({ class: "td", role: "cell", style: { ...this.cellStyle, justifyContent: i2.align || "left" }, bindText: `^.${i2.prop}` });
  };
  get visibleRows() {
    return C(this.rowData.visible);
  }
  get visibleSelectedRows() {
    return this.visibleRows.filter((i2) => i2[this.selectedKey]);
  }
  get selectedRows() {
    return this.array.filter((i2) => i2[this.selectedKey]);
  }
  rowTemplate(i2) {
    return U5(H1({ class: "tr", role: "row", bind: { value: "^", binding: { toDOM: this.selectBinding } } }, ...i2.map(this.dataCell)));
  }
  draggedColumn;
  dropColumn = (i2) => {
    let l4 = i2.target.closest(".drag-over"), s2 = Array.from(l4.parentElement.children).indexOf(l4), o2 = this.visibleColumns[s2], h2 = this.columns.indexOf(this.draggedColumn), r2 = this.columns.indexOf(o2);
    this.columns.splice(h2, 1), this.columns.splice(r2, 0, this.draggedColumn), console.log({ event: i2, target: l4, targetIndex: s2, draggedIndex: h2, droppedIndex: r2 }), this.queueRender(), i2.preventDefault(), i2.stopPropagation();
  };
  render() {
    super.render(), this.rowData.pinnedTop = this.pinnedTop > 0 ? this._array.slice(0, this.pinnedTop) : [], this.rowData.pinnedBottom = this.pinnedBottom > 0 ? this._array.slice(this._array.length - this.pinnedBottom) : [], this.rowData.visible = this.filter(this._array.slice(this.pinnedTop, Math.min(this.maxVisibleRows, this._array.length - this.pinnedTop - this.pinnedBottom)));
    let { sort: i2 } = this;
    if (i2)
      this.rowData.visible.sort(i2);
    this.textContent = "", this.style.display = "flex", this.style.flexDirection = "column";
    let { visibleColumns: l4 } = this;
    if (this.style.setProperty("--tosi-table-row-height", `${this.rowHeight}px`), this.style.setProperty("--row-height", `${this.rowHeight}px`), this.setColumnWidths(), !this.noreorder)
      M2();
    let s2 = this.instanceId + "-column-header", o2 = l4.map((h2) => {
      let r2 = this.headerCell(h2);
      if (!this.noreorder && r2.children[0]) {
        let y2 = r2.children[0];
        y2.setAttribute("draggable", "true"), y2.style.pointerEvents = "all", y2.dataset.drag = s2, r2.dataset.drop = s2, y2.addEventListener("dragstart", () => {
          this.draggedColumn = h2;
        }), r2.addEventListener("drop", this.dropColumn);
      }
      return r2;
    });
    if (this.append(H1({ class: "thead", role: "rowgroup", style: { touchAction: "none" } }, H1({ class: "tr", role: "row" }, ...o2))), this.pinnedTop > 0)
      this.append(H1({ part: "pinnedTopRows", class: "tbody", role: "rowgroup", style: { flex: "0 0 auto", overflow: "hidden", height: `${this.rowHeight * this.pinnedTop}px` }, bindList: { value: this.rowData.pinnedTop, virtual: this.virtual } }, this.rowTemplate(l4)));
    if (this.append(H1({ part: "visibleRows", class: "tbody", role: "rowgroup", style: { content: " ", minHeight: "100px", flex: "1 1 100px", overflow: "hidden auto" }, bindList: { value: this.rowData.visible, virtual: this.virtual } }, this.rowTemplate(l4))), this.pinnedBottom > 0)
      this.append(H1({ part: "pinnedBottomRows", class: "tbody", role: "rowgroup", style: { flex: "0 0 auto", overflow: "hidden", height: `${this.rowHeight * this.pinnedBottom}px` }, bindList: { value: this.rowData.pinnedBottom, virtual: this.virtual } }, this.rowTemplate(l4)));
  }
}
var Y0 = H2.elementCreator({ tag: "tosi-table", styleSpec: { ":host": { "--tosi-table-row-height": "32px", "--tosi-table-touch-size": "var(--tosi-touch-size, 44px)", "--tosi-table-dragged-header-bg": "#0004", "--tosi-table-dragged-header-color": "#fff", "--tosi-table-drop-header-bg": "#fff4", "--row-height": "var(--tosi-table-row-height)", "--touch-size": "var(--tosi-table-touch-size)", "--dragged-header-bg": "var(--tosi-table-dragged-header-bg)", "--dragged-header-color": "var(--tosi-table-dragged-header-color)", "--drop-header-bg": "var(--tosi-table-drop-header-bg)", overflow: "auto hidden" }, ":host .thead, :host .tbody": { width: fM.tosiTableGridRowWidth }, ":host .tr": { display: "grid", gridTemplateColumns: fM.tosiTableGridColumns, height: fM.tosiTableRowHeight, lineHeight: fM.tosiTableRowHeight }, ":host .td, :host .th": { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "flex", alignItems: "center" }, ":host .th .menu-trigger": { color: "currentColor", background: "none", padding: 0, lineHeight: fM.tosiTableTouchSize, height: fM.tosiTableTouchSize, width: fM.tosiTableTouchSize }, ':host [draggable="true"]': { cursor: "ew-resize" }, ':host [draggable="true"]:active': { background: fM.tosiTableDraggedHeaderBg, color: fM.tosiTableDraggedHeaderColor }, ":host .drag-over": { background: fM.tosiTableDropHeaderBg } } });
var { dialog: K5, button: F2, header: Y5, footer: N5, xinSlot: q2, h3: V22, p: L2, label: W5, input: R5, div: D5 } = I;

class W0 extends u {
  static async alert(i2, l4 = "Alert") {
    return new Promise((s2) => {
      let o2 = _2({ removeOnClose: true, closeOnBackgroundClick: true, dialogWillClose() {
        s2();
      } }, V22({ slot: "header" }, l4), i2.includes(`
`) ? I.pre({ style: { whiteSpace: "pre-wrap", margin: 0 } }, i2) : L2(i2));
      document.body.append(o2), o2.showModal();
    });
  }
  static async confirm(i2, l4 = "Confirm") {
    return new Promise((s2) => {
      let o2 = _2({ removeOnClose: true, dialogWillClose(h2) {
        s2(h2 === "confirm");
      } }, V22({ slot: "header" }, l4), L2(i2), F2({ slot: "footer", onClick() {
        o2.close();
      } }, "Cancel"));
      document.body.append(o2), o2.showModal();
    });
  }
  static async prompt(i2, l4 = "Prompt", s2 = "") {
    return new Promise((o2) => {
      let h2 = R5({ value: s2 }), r2 = _2({ removeOnClose: true, dialogWillClose(y2) {
        o2(y2 === "confirm" ? h2.value : null);
      }, initialFocus() {
        h2.focus();
      } }, V22({ slot: "header" }, l4), L2(W5({ style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: 5 } }, D5(i2), h2)), F2({ slot: "footer", onClick() {
        r2.close();
      } }, "Cancel"));
      document.body.append(r2), r2.showModal();
    });
  }
  static initAttributes = { removeOnClose: false, closeOnBackgroundClick: false };
  constructor() {
    super();
    XE(this, "click", () => {
      if (this.closeOnBackgroundClick)
        this.close();
    });
  }
  dialogWillClose = (i2 = "cancel") => {
    console.log("dialog will close with", i2);
  };
  initialFocus() {
    this.parts.ok.focus();
  }
  #i = (i2) => {};
  showModal = () => {
    return this.style.zIndex = String(B1()), new Promise((i2) => {
      this.#i = i2, this.parts.dialog.showModal(), requestAnimationFrame(() => {
        this.initialFocus();
      });
    });
  };
  close = (i2 = "cancel") => {
    if (this.dialogWillClose(i2), this.#i(i2), this.parts.dialog.close(), this.removeOnClose)
      this.remove();
  };
  ok = () => {
    this.close("confirm");
  };
  content = () => K5({ part: "dialog" }, Y5(q2({ name: "header" })), q2(), N5(q2({ name: "footer" }), F2({ part: "ok", onClick: this.ok }, "OK")));
}
var _2 = W0.elementCreator({ tag: "tosi-dialog", styleSpec: { ":host > dialog::backdrop": { backdropFilter: "blur(8px)" }, ":host > dialog:not([open])": { display: "none" }, ":host > dialog[open]": { minWidth: 300, border: 0, borderRadius: 10, overflow: "hidden", maxHeight: "calc(100% - 20px)", padding: 0, display: "flex", flexDirection: "column", gap: 5, _dialogShadow: kE.menuShadow("0 5px 10px #0004"), _dialogBackground: kE.background("#fafafa"), _dialogColor: kE.textColor("#222"), boxShadow: fM.dialogShadow, background: fM.dialogBackground, color: fM.dialogColor }, ":host > dialog > *": { padding: "0 20px" }, ":host > dialog > header": { display: "flex", justifyContent: "center", gap: 10 }, ":host > dialog > footer": { display: "flex", justifyContent: "flex-end", gap: 10, paddingBottom: 20 } } });
function E0(i2, l4) {
  if (l4 == null)
    l4 = "";
  else if (typeof l4 !== "string")
    l4 = String(l4);
  return l4.replace(/\{\{([^}]+)\}\}/g, (s2, o2) => {
    let h2 = k[`${i2}${o2.startsWith("[") ? o2 : "." + o2}`];
    return h2 === undefined ? s2 : E0(i2, String(h2));
  });
}

class O2 extends u {
  static initAttributes = { src: "", elements: false };
  context = {};
  value = "";
  content = null;
  options = {};
  connectedCallback() {
    if (super.connectedCallback(), this.src !== "")
      (async () => {
        let i2 = await fetch(this.src);
        this.value = await i2.text();
      })();
    else if (this.value === "")
      if (this.elements)
        this.value = this.innerHTML;
      else
        this.value = this.textContent != null ? this.textContent : "";
  }
  didRender = () => {};
  render() {
    super.render(), k[this.instanceId] = typeof this.context === "string" ? JSON.parse(this.context) : this.context;
    let i2 = E0(this.instanceId, this.value);
    if (this.elements) {
      let l4 = i2.split(`
`).reduce((s2, o2) => {
        if (o2.startsWith("<") || s2.length === 0)
          s2.push(o2);
        else {
          let h2 = s2[s2.length - 1];
          if (!h2.startsWith("<") || !h2.endsWith(">"))
            s2[s2.length - 1] += `
` + o2;
          else
            s2.push(o2);
        }
        return s2;
      }, []);
      this.innerHTML = l4.map((s2) => s2.startsWith("<") && s2.endsWith(">") ? s2 : k2(s2, this.options)).join("");
    } else
      this.innerHTML = k2(i2, this.options);
    this.didRender();
  }
}
var G1 = O2.elementCreator({ tag: "tosi-md" });
var I9 = G1;
var { div: f1, slot: I0, span: m5, button: S5 } = I;

class P22 extends u {
  static initAttributes = { localized: false };
  value = 0;
  makeTab(i2, l4, s2) {
    let o2 = l4.getAttribute("name"), h2 = l4.querySelector('template[role="tab"]')?.content.cloneNode(true) || (this.localized ? l1(o2) : m5(o2));
    return f1(h2, { part: "tab", tabindex: 0, role: "tab", ariaControls: s2 }, l4.hasAttribute("data-close") ? S5({ title: "close", class: "close" }, t3.x()) : {});
  }
  static styleSpec = { ":host": { "--tosi-tabs-selected-color": "var(--xin-tabs-selected-color, var(--tosi-accent, currentColor))", "--tosi-tabs-bar-color": "var(--xin-tabs-bar-color, #ccc)", "--tosi-tabs-bar-height": "var(--xin-tabs-bar-height, 2px)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", boxShadow: "none !important" }, slot: { position: "relative", display: "block", flex: "1", overflow: "hidden", overflowY: "auto" }, 'slot[name="after-tabs"]': { flex: "0 0 auto" }, "::slotted([hidden])": { display: "none !important" }, ":host::part(tabpanel)": { display: "flex", flexDirection: "column", overflowX: "auto" }, ":host::part(tabrow)": { display: "flex" }, ":host .tabs": { display: "flex", userSelect: "none", whiteSpace: "nowrap" }, ":host .tabs > div": { padding: `${fM.spacing50} ${fM.spacing}`, cursor: "default", display: "flex", alignItems: "baseline" }, ':host .tabs > [aria-selected="true"]': { "--text-color": fM.tosiTabsSelectedColor, color: fM.textColor }, ":host .elastic": { flex: "1" }, ":host .border": { background: fM.tosiTabsBarColor }, ":host .border > .selected": { content: " ", width: 0, height: fM.tosiTabsBarHeight, background: fM.tosiTabsSelectedColor, transition: "ease-out 0.2s" }, ":host button.close": { border: 0, background: "transparent", textAlign: "center", marginLeft: fM.spacing50, padding: 0 }, ":host button.close > svg": { height: "12px" } };
  onCloseTab = null;
  content = [f1({ role: "tabpanel", part: "tabpanel" }, f1({ part: "tabrow" }, f1({ class: "tabs", part: "tabs" }), f1({ class: "elastic" }), I0({ name: "after-tabs" })), f1({ class: "border" }, f1({ class: "selected", part: "selected" }))), I0()];
  addTabBody(i2, l4 = false) {
    if (!i2.hasAttribute("name"))
      throw console.error("element has no name attribute", i2), Error("element has no name attribute");
    if (this.append(i2), this.setupTabs(), l4)
      this.value = this.bodies.length - 1;
    this.queueRender();
  }
  removeTabBody(i2) {
    i2.remove(), this.setupTabs(), this.queueRender();
  }
  keyTab = (i2) => {
    let { tabs: l4 } = this.parts, s2 = [...l4.children].indexOf(i2.target);
    switch (i2.key) {
      case "ArrowLeft":
        this.value = (s2 + Number(l4.children.length) - 1) % l4.children.length, l4.children[this.value].focus(), i2.preventDefault();
        break;
      case "ArrowRight":
        this.value = (s2 + 1) % l4.children.length, l4.children[this.value].focus(), i2.preventDefault();
        break;
      case " ":
        this.pickTab(i2), i2.preventDefault();
        break;
      default:
    }
  };
  get bodies() {
    return [...this.children].filter((i2) => i2.hasAttribute("name"));
  }
  pickTab = (i2) => {
    let { tabs: l4 } = this.parts, s2 = i2.target, o2 = s2.closest("button.close") !== null, h2 = s2.closest(".tabs > div"), r2 = [...l4.children].indexOf(h2);
    if (o2) {
      let y2 = this.bodies[r2];
      if (!this.onCloseTab || this.onCloseTab(y2) !== false)
        this.removeTabBody(this.bodies[r2]);
    } else if (r2 > -1)
      this.value = r2;
  };
  setupTabs = () => {
    let { tabs: i2 } = this.parts, l4 = [...this.children].filter((s2) => !s2.hasAttribute("slot") && s2.hasAttribute("name"));
    if (i2.textContent = "", this.value >= l4.length)
      this.value = l4.length - 1;
    for (let s2 in l4) {
      let o2 = l4[s2], h2 = `${this.instanceId}-${s2}`;
      o2.id = h2;
      let r2 = this.makeTab(this, o2, h2);
      i2.append(r2);
    }
  };
  connectedCallback() {
    super.connectedCallback();
    let { tabs: i2 } = this.parts;
    i2.addEventListener("click", this.pickTab), i2.addEventListener("keydown", this.keyTab), this.setupTabs(), i1.allInstances.add(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), i1.allInstances.delete(this);
  }
  localeChanged = () => {
    this.queueRender();
  };
  onResize() {
    this.queueRender();
  }
  render() {
    let { tabs: i2, selected: l4 } = this.parts, s2 = this.bodies;
    for (let o2 = 0;o2 < s2.length; o2++) {
      let h2 = s2[o2], r2 = i2.children[o2];
      if (this.value === Number(o2))
        r2.setAttribute("aria-selected", "true"), l4.style.marginLeft = `${r2.offsetLeft - i2.offsetLeft}px`, l4.style.width = `${r2.offsetWidth}px`, h2.toggleAttribute("hidden", false);
      else
        r2.toggleAttribute("aria-selected", false), h2.toggleAttribute("hidden", true);
    }
  }
}
var T1 = P22.elementCreator({ tag: "tosi-tabs" });
var T5 = () => "https://cdn.jsdelivr.net/npm/sucrase@3.35.0/+esm";
var U1 = (async () => {}).constructor;
function C1(i2, l4) {
  let s2 = i2;
  for (let o2 of l4)
    s2 = s2.replace(new RegExp(`import \\{(.*)\\} from '${o2}'`, "g"), `const {$1} = ${o2.replace(/-/g, "")}`);
  return s2;
}
async function $2() {
  let { transform: i2 } = await import(T5());
  return i2;
}
var Q2 = "live-example-payload";
function u0(i2, l4, s2) {
  return s2 !== "" ? `${i2}-${s2}` : `${i2}-${l4}`;
}
function J22(i2, l4) {
  try {
    localStorage.setItem(i2, JSON.stringify(l4));
  } catch (s2) {
    console.warn("live-example: failed to write to localStorage", s2);
  }
}
function li(i2) {
  if (i2 === null)
    return null;
  try {
    return JSON.parse(i2);
  } catch {
    return null;
  }
}
function m0(i2, l4, s2, o2, h2) {
  let r2 = location.href.split("?")[0] + `?${i2}=${l4}`;
  J22(s2, { remoteKey: o2, sentAt: Date.now(), ...h2 }), window.open(r2);
}
var si = typeof BroadcastChannel < "u";

class i2 {
  storageKey;
  remoteKey;
  lastUpdate = 0;
  interval;
  channel;
  listening = false;
  onReceive;
  constructor(i3, l4, s2) {
    this.storageKey = i3, this.remoteKey = l4, this.onReceive = s2;
  }
  handlePayload = (i3) => {
    if (i3.sentAt <= this.lastUpdate)
      return;
    if (i3.remoteKey !== this.remoteKey)
      return;
    this.lastUpdate = i3.sentAt, this.onReceive(i3);
  };
  handleMessage = (i3) => {
    let l4 = i3.data;
    if (l4)
      this.handlePayload(l4);
  };
  handlePoll = () => {
    let i3 = null;
    try {
      i3 = localStorage.getItem(this.storageKey);
    } catch {
      return;
    }
    let l4 = li(i3);
    if (l4)
      this.handlePayload(l4);
  };
  startListening() {
    if (this.listening)
      return;
    if (this.listening = true, si)
      this.channel = new BroadcastChannel(this.storageKey), this.channel.onmessage = this.handleMessage;
    this.interval = setInterval(this.handlePoll, 500);
  }
  stopListening() {
    if (!this.listening)
      return;
    if (this.listening = false, this.channel)
      this.channel.close(), this.channel = undefined;
    if (this.interval)
      clearInterval(this.interval), this.interval = undefined;
  }
  send(i3) {
    let l4 = { remoteKey: this.remoteKey, sentAt: Date.now(), ...i3 };
    if (J22(this.storageKey, l4), this.channel)
      this.channel.postMessage(l4);
  }
  sendClose() {
    let i3 = { remoteKey: this.remoteKey, sentAt: Date.now(), css: "", html: "", js: "", close: true };
    if (J22(this.storageKey, i3), this.channel)
      this.channel.postMessage(i3);
  }
}
var { div: hi } = I;
function ri(i3, l4) {
  let s2 = i3.customElements;
  if (!s2)
    return;
  let o2 = (r2) => {
    if (!r2 || s2.get(r2))
      return;
    let y2 = customElements.get(r2);
    if (y2)
      try {
        s2.define(r2, y2);
      } catch {}
  };
  for (let r2 of Object.values(l4))
    if (r2 && typeof r2 === "object") {
      for (let y2 of Object.values(r2))
        if (typeof y2 === "function" && "tagName" in y2)
          o2(y2.tagName);
    }
  let h2 = i3.document;
  if (h2) {
    let r2 = h2.querySelectorAll("*");
    for (let y2 of r2) {
      let e2 = y2.tagName.toLowerCase();
      if (e2.includes("-"))
        o2(e2);
    }
  }
}
async function b22(i3) {
  let { html: l4, css: s2, js: o2, context: h2, transform: r2, exampleElement: y2, styleElement: e2, widgetsElement: x3, onError: n3 } = i3, p3 = hi({ class: "preview" });
  p3.innerHTML = l4, e2.innerText = s2;
  let d3 = y2.querySelector(".preview");
  if (d3)
    d3.replaceWith(p3);
  else
    y2.insertBefore(p3, x3);
  let C3 = { preview: p3, ...h2 };
  try {
    let k3 = C1(o2, Object.keys(h2)), w3 = r2(k3, { transforms: ["typescript"] }).code, O = Object.keys(C3).map((F3) => F3.replace(/-/g, "")), R2 = Object.values(C3);
    await new U1(...O, w3)(...R2);
  } catch (k3) {
    if (console.error(k3), n3)
      n3(k3);
    else
      window.alert(`Error: ${k3}, the console may have more information…`);
  }
  return p3;
}
async function G22(i3) {
  let { html: l4, css: s2, js: o2, context: h2, transform: r2, exampleElement: y2, widgetsElement: e2, onError: x3 } = i3, n3 = y2.querySelector("iframe.preview-iframe");
  if (!n3) {
    n3 = document.createElement("iframe"), n3.className = "preview-iframe", n3.style.cssText = "width: 100%; height: 100%; border: none;";
    let w3 = y2.querySelector(".preview");
    if (w3)
      w3.replaceWith(n3);
    else
      y2.insertBefore(n3, e2);
  }
  let p3 = n3.contentDocument;
  if (!p3)
    return console.error("Could not access iframe document"), null;
  let d3 = n3.contentWindow;
  if (h2.tosijs)
    d3.tosijs = h2.tosijs;
  if (h2["tosijs-ui"])
    d3.tosijsui = h2["tosijs-ui"];
  p3.open(), p3.write(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; }
    .preview { height: 100%; position: relative; }
    ${s2}
  </style>
</head>
<body>
  <div class="preview">${l4}</div>
</body>
</html>`), p3.close(), ri(d3, h2);
  let C3 = p3.querySelector(".preview");
  if (!C3)
    return console.error("Could not find preview element in iframe"), null;
  let k3 = { preview: C3, ...h2 };
  try {
    let w3 = C1(o2, Object.keys(h2)), O = r2(w3, { transforms: ["typescript"] }).code, R2 = d3.eval("(async () => {}).constructor"), H = Object.keys(k3).map((v1) => v1.replace(/-/g, "")), F3 = Object.values(k3);
    await new R2(...H, O)(...F3);
  } catch (w3) {
    if (console.error(w3), x3)
      x3(w3);
    else
      window.alert(`Error: ${w3}, the console may have more information…`);
  }
  return C3;
}
function U2(i3, l4, s2, o2) {
  let h2 = [...i3.querySelectorAll(".language-html,.language-js,.language-css,.language-test")].filter((r2) => !r2.closest(o2)).map((r2) => ({ block: r2.parentElement, language: r2.classList[0].split("-").pop(), code: r2.innerText }));
  for (let r2 = 0;r2 < h2.length; r2 += 1) {
    let y2 = [h2[r2]];
    while (r2 < h2.length - 1 && h2[r2].block.nextElementSibling === h2[r2 + 1].block)
      y2.push(h2[r2 + 1]), r2 += 1;
    let e2 = s2({ context: l4 });
    y2[0].block.parentElement.insertBefore(e2, y2[0].block), y2.forEach((n3) => {
      switch (n3.language) {
        case "js":
          e2.js = n3.code;
          break;
        case "html":
          e2.html = n3.code;
          break;
        case "css":
          e2.css = n3.code;
          break;
        case "test":
          e2.test = n3.code;
          break;
      }
      n3.block.remove();
    }), e2.showDefaultTab();
  }
}
var S0 = { ":host": { "--tosi-example-height": "320px", "--code-editors-bar-bg": "#777", "--code-editors-bar-color": "#fff", "--widget-bg": "#fff8", "--widget-color": "#000", position: "relative", display: "flex", height: "var(--tosi-example-height)", background: "var(--background)", boxSizing: "border-box" }, ":host.-maximize": { position: "fixed", left: "0", top: "0", height: "100vh", width: "100vw", margin: "0 !important" }, ".-maximize": { zIndex: 101 }, ":host.-vertical": { flexDirection: "column" }, ":host .layout-indicator": { transition: "0.5s ease-out", transform: "rotateZ(270deg)" }, ":host.-vertical .layout-indicator": { transform: "rotateZ(180deg)" }, ":host.-maximize .hide-if-maximized, :host:not(.-maximize) .show-if-maximized": { display: "none" }, ':host [part="example"]': { flex: "1 1 50%", height: "100%", position: "relative", overflowX: "auto" }, ":host .preview": { height: "100%", position: "relative", overflow: "hidden", boxShadow: "inset 0 0 0 2px #8883" }, ':host [part="editors"]': { flex: "1 1 200px", height: "100%", position: "relative" }, ':host [part="exampleWidgets"]': { position: "absolute", left: "5px", bottom: "5px", "--widget-color": "var(--brand-color)", borderRadius: "5px", width: "44px", height: "44px", lineHeight: "44px", zIndex: "100" }, ':host [part="exampleWidgets"] svg': { stroke: "var(--widget-color)" }, ":host .code-editors": { overflow: "hidden", background: "white", position: "relative", top: "0", right: "0", flex: "1 1 50%", height: "100%", flexDirection: "column", zIndex: "10" }, ":host .code-editors:not([hidden])": { display: "flex" }, ":host .code-editors > h4": { padding: "5px", margin: "0", textAlign: "center", background: "var(--code-editors-bar-bg)", color: "var(--code-editors-bar-color)", cursor: "move" }, ":host button.transparent, :host .sizer": { width: "32px", height: "32px", lineHeight: "32px", textAlign: "center", padding: "0", margin: "0" }, ":host .sizer": { cursor: "nwse-resize" }, ':host [part="testIndicator"]': { position: "absolute", top: "8px", right: "8px", width: "12px", height: "12px", borderRadius: "50%", background: "#888", zIndex: "100", display: "none" }, ':host.-has-tests [part="testIndicator"]': { display: "block", opacity: "var(--tests-enabled, 1)" }, ':host.-test-running [part="testIndicator"]': { background: "#fa0", animation: "test-pulse 0.5s ease-in-out infinite" }, ':host.-test-passed [part="testIndicator"]': { background: "#0a0", animation: "test-fade 2s ease-out forwards" }, ':host.-test-failed [part="testIndicator"]': { background: "#c00", animation: "test-pulse 1s ease-in-out infinite" }, "@keyframes test-pulse": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } }, "@keyframes test-fade": { "0%": { opacity: "1" }, "50%": { opacity: "1" }, "100%": { opacity: "0" } }, ':host.-test-passed [part="exampleWidgets"]': { "--widget-color": "#0a0" }, ':host.-test-failed [part="exampleWidgets"]': { "--widget-color": "#f00" }, ':host [part="testResults"]': { position: "absolute", bottom: "54px", left: "5px", background: "var(--widget-bg)", borderRadius: "5px", padding: "8px", fontSize: "14px", margin: "0", maxWidth: "400px", maxHeight: "200px", overflow: "auto", zIndex: "100" }, ':host [part="testResults"][hidden]': { display: "none" }, ":host .test-pass": { color: "#0a0" }, ":host .test-fail": { color: "#f00" } };

class Z2 extends Error {
  constructor(i3) {
    super(i3);
    this.name = "AssertionError";
  }
}
function T0(i3, l4) {
  if (i3 === l4)
    return true;
  if (typeof i3 !== typeof l4)
    return false;
  if (i3 === null || l4 === null)
    return i3 === l4;
  if (typeof i3 !== "object")
    return false;
  let s2 = i3, o2 = l4;
  if (Array.isArray(s2) !== Array.isArray(o2))
    return false;
  let h2 = Object.keys(s2), r2 = Object.keys(o2);
  if (h2.length !== r2.length)
    return false;
  return h2.every((y2) => T0(s2[y2], o2[y2]));
}
var yi = 5000;
var ei = { stringify(i3) {
  if (typeof i3 > "u")
    return "undefined";
  if (i3 === null)
    return "null";
  if (typeof Element < "u" && i3 instanceof Element)
    return `<${i3.tagName.toLowerCase()}>`;
  if (typeof Node < "u" && i3 instanceof Node)
    return `[${i3.nodeName}]`;
  try {
    return JSON.stringify(i3);
  } catch {
    return String(i3);
  }
} };
var { stringify: u2 } = ei;
function i4(i3, l4 = false) {
  let s2 = (h2, r2) => {
    if (!(l4 ? !h2 : h2))
      throw new Z2(l4 ? `not: ${r2}` : r2);
  };
  return { toBe(h2) {
    s2(i3 === h2, `Expected ${u2(i3)} to be ${u2(h2)}`);
  }, toEqual(h2) {
    s2(T0(i3, h2), `Expected ${u2(i3)} to equal ${u2(h2)}`);
  }, toBeTruthy() {
    s2(!!i3, `Expected ${u2(i3)} to be truthy`);
  }, toBeFalsy() {
    s2(!i3, `Expected ${u2(i3)} to be falsy`);
  }, toBeNull() {
    s2(i3 === null, `Expected ${u2(i3)} to be null`);
  }, toBeUndefined() {
    s2(i3 === undefined, `Expected ${u2(i3)} to be undefined`);
  }, toBeDefined() {
    s2(i3 !== undefined, `Expected ${u2(i3)} to be defined`);
  }, toContain(h2) {
    if (typeof i3 === "string")
      s2(i3.includes(h2), `Expected "${i3}" to contain "${h2}"`);
    else if (Array.isArray(i3))
      s2(i3.includes(h2), `Expected array to contain ${u2(h2)}`);
    else
      throw new Z2("toContain requires string or array");
  }, toHaveLength(h2) {
    let r2 = i3.length;
    s2(r2 === h2, `Expected length ${r2} to be ${h2}`);
  }, toMatch(h2) {
    s2(h2.test(i3), `Expected "${i3}" to match ${h2}`);
  }, toBeGreaterThan(h2) {
    s2(i3 > h2, `Expected ${i3} to be greater than ${h2}`);
  }, toBeLessThan(h2) {
    s2(i3 < h2, `Expected ${i3} to be less than ${h2}`);
  }, toBeInstanceOf(h2) {
    s2(i3 instanceof h2, `Expected value to be instance of ${h2.name}`);
  }, get not() {
    return i4(i3, !l4);
  } };
}
function l4(i3) {
  return i4(i3);
}
function xi(i3) {
  return new Promise((l6) => setTimeout(l6, i3));
}
function ni(i3, l6, s2 = 1000) {
  return new Promise((o2, h2) => {
    let r2 = Date.now(), y2 = () => {
      let e2 = i3.querySelector(l6);
      if (e2) {
        o2(e2);
        return;
      }
      if (Date.now() - r2 >= s2) {
        h2(Error(`Timeout waiting for "${l6}" after ${s2}ms`));
        return;
      }
      requestAnimationFrame(y2);
    };
    y2();
  });
}
function ti(i3, l6, s2) {
  return Promise.race([i3, new Promise((o2, h2) => setTimeout(() => h2(Error(`Test "${s2}" timed out after ${l6}ms`)), l6))]);
}
function s4(i3, l6 = yi) {
  let s2 = "", o2 = [];
  return { pending: o2, expect: l4, test(h2, r2) {
    let y2 = s2 ? `${s2} > ${h2}` : h2;
    try {
      let e2 = r2();
      if (e2 instanceof Promise) {
        let x3 = ti(e2, l6, y2).then(() => {
          i3.push({ name: y2, passed: true });
        }).catch((n3) => {
          i3.push({ name: y2, passed: false, error: n3.message });
        });
        o2.push(x3);
      } else
        i3.push({ name: y2, passed: true });
    } catch (e2) {
      i3.push({ name: y2, passed: false, error: e2.message });
    }
  }, describe(h2, r2) {
    let y2 = s2;
    s2 = s2 ? `${s2} > ${h2}` : h2, r2(), s2 = y2;
  } };
}
async function X22(i3, l6, s2, o2) {
  let h2 = [], r2 = s4(h2), y2 = { preview: l6, ...s2, expect: r2.expect, test: r2.test, describe: r2.describe, waitMs: xi, waitFor: (e2, x3) => ni(l6, e2, x3) };
  try {
    let e2 = C1(i3, Object.keys(s2)), x3 = o2(e2, { transforms: ["typescript"] }).code, n3 = Object.keys(y2).map((C3) => C3.replace(/-/g, "")), p3 = Object.values(y2);
    await new U1(...n3, x3)(...p3);
  } catch (e2) {
    h2.push({ name: "Test execution", passed: false, error: e2.message });
  }
  if (r2.pending.length > 0)
    await Promise.all(r2.pending);
  return { passed: h2.filter((e2) => e2.passed).length, failed: h2.filter((e2) => !e2.passed).length, tests: h2 };
}
var { div: j1, xinSlot: fi, style: Ci, button: a1, pre: o4, span: h4 } = I;
var K22 = "tosijs-ui-tests-enabled";
var ai = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
function gi() {
  if (typeof localStorage > "u")
    return false;
  let i3 = localStorage.getItem(K22);
  if (i3 !== null)
    return i3 === "true";
  return ai;
}
var { testManager: Y } = xE({ testManager: { enabled: gi() } });
function l22() {
  document.body.classList.toggle("tests-enabled", Y.enabled.value), document.body.style.setProperty("--tests-enabled", Y.enabled.value ? "1" : "0");
}
if (typeof document < "u")
  if (document.body)
    l22();
  else
    document.addEventListener("DOMContentLoaded", l22);
function y4() {
  localStorage.setItem(K22, "true"), Y.enabled.value = true, l22(), document.querySelectorAll("tosi-example").forEach((i3) => {
    i3.refresh();
  });
}
function e4() {
  localStorage.setItem(K22, "false"), Y.enabled.value = false, l22();
}

class g1 extends u {
  static initAttributes = { persistToDom: false, iframe: false };
  prefix = "lx";
  storageKey = Q2;
  context = {};
  uuid = crypto.randomUUID();
  remoteId = "";
  remoteSync;
  undoInterval;
  testResults;
  pendingValues = {};
  pendingShowDefaultTab = false;
  beforeUnloadHandler;
  static insertExamples(i3, l6 = {}) {
    U2(i3, l6, Y2, g1.tagName);
  }
  get activeTab() {
    let { editors: i3 } = this.parts;
    return [...i3.children].find((l6) => l6.getAttribute("hidden") === null);
  }
  get hydrated() {
    try {
      return this.parts.js !== undefined;
    } catch {
      return false;
    }
  }
  getEditorValue(i3) {
    if (!this.hydrated)
      return this.pendingValues[i3] ?? "";
    return this.parts[i3].value;
  }
  setEditorValue(i3, l6) {
    if (!this.hydrated) {
      this.pendingValues[i3] = l6;
      return;
    }
    let s2 = this.parts[i3];
    s2.value = l6;
  }
  flushPendingValues() {
    for (let [i3, l6] of Object.entries(this.pendingValues)) {
      let s2 = this.parts[i3];
      if (s2)
        s2.value = l6;
    }
    if (this.pendingValues = {}, this.pendingShowDefaultTab)
      this.pendingShowDefaultTab = false, this.showDefaultTab();
  }
  get css() {
    return this.getEditorValue("css");
  }
  set css(i3) {
    this.setEditorValue("css", i3);
  }
  get html() {
    return this.getEditorValue("html");
  }
  set html(i3) {
    this.setEditorValue("html", i3);
  }
  get js() {
    return this.getEditorValue("js");
  }
  set js(i3) {
    this.setEditorValue("js", i3);
  }
  get test() {
    return this.getEditorValue("test");
  }
  set test(i3) {
    this.setEditorValue("test", i3);
  }
  get remoteKey() {
    return u0(this.prefix, this.uuid, this.remoteId);
  }
  updateUndo = () => {
    let { activeTab: i3 } = this, { undo: l6, redo: s2 } = this.parts;
    if (i3 instanceof M1 && i3.editor !== undefined) {
      let o2 = i3.editor.session.getUndoManager();
      l6.disabled = !o2.hasUndo(), s2.disabled = !o2.hasRedo();
    } else
      l6.disabled = true, s2.disabled = true;
    this.updateTestResultsVisibility();
  };
  updateTestResultsVisibility() {
    let { testResults: i3 } = this.parts, l6 = this.testResults, s2 = this.activeTab?.getAttribute("name") === "test", o2 = l6 && l6.failed > 0;
    i3.hidden = !l6 || l6.tests.length === 0 || !s2 && !o2;
  }
  undo = () => {
    let { activeTab: i3 } = this;
    if (i3 instanceof M1)
      i3.editor.undo();
  };
  redo = () => {
    let { activeTab: i3 } = this;
    if (i3 instanceof M1)
      i3.editor.redo();
  };
  get isMaximized() {
    return this.classList.contains("-maximize");
  }
  flipLayout = () => {
    this.classList.toggle("-vertical");
  };
  exampleMenu = () => {
    let i3 = Y.enabled.value;
    J2({ target: this.parts.exampleWidgets, width: "auto", menuItems: [{ icon: "edit2", caption: "view/edit code", action: this.showCode }, { icon: "edit", caption: "view/edit code in a new window", action: this.openEditorWindow }, null, { icon: this.isMaximized ? "minimize" : "maximize", caption: this.isMaximized ? "restore preview" : "maximize preview", action: this.toggleMaximize }, null, { icon: i3 ? "check" : "", caption: "Run tests", action: () => {
      if (i3)
        e4();
      else
        y4();
    } }] });
  };
  handleShortcuts = (i3) => {
    if (i3.metaKey || i3.ctrlKey) {
      let l6 = false;
      switch (i3.key) {
        case "s":
        case "r":
          this.refresh(), l6 = true;
          break;
        case "/":
          this.flipLayout();
          break;
        case "c":
          if (i3.shiftKey)
            this.copy(), l6 = true;
          break;
      }
      if (l6)
        i3.preventDefault(), i3.stopPropagation();
    }
  };
  content = () => [j1({ part: "example" }, Ci({ part: "style" }), j1({ part: "testIndicator", title: "test status" }), o4({ part: "testResults", hidden: true }), a1({ title: "example menu", part: "exampleWidgets", onClick: this.exampleMenu }, t3.code())), j1({ class: "code-editors", part: "codeEditors", onKeydown: this.handleShortcuts, hidden: true }, T1({ part: "editors", onChange: this.updateUndo }, $1({ name: "js", mode: "javascript", part: "js" }), $1({ name: "html", mode: "html", part: "html" }), $1({ name: "css", mode: "css", part: "css" }), $1({ name: "test", mode: "javascript", part: "test" }), j1({ slot: "after-tabs", class: "row" }, a1({ title: "undo", part: "undo", class: "transparent", onClick: this.undo }, t3.cornerUpLeft()), a1({ title: "redo", part: "redo", class: "transparent", onClick: this.redo }, t3.cornerUpRight()), a1({ title: "flip direction (⌘/ | ^/)", class: "transparent", onClick: this.flipLayout }, t3.columns({ class: "layout-indicator" })), a1({ title: "copy as markdown (⌘⇧C | ^⇧C)", class: "transparent", onClick: this.copy }, t3.copy()), a1({ title: "reload (⌘R | ^R)", class: "transparent", onClick: this.refreshRemote }, t3.refreshCw()), a1({ title: "close code", class: "transparent", onClick: this.closeCode }, t3.x())))), fi({ part: "sources", hidden: true })];
  connectedCallback() {
    super.connectedCallback(), this.flushPendingValues();
    let { sources: i3 } = this.parts;
    this.initFromElements([...i3.children]), this.remoteSync = new i2(this.storageKey, this.remoteKey, (s2) => {
      if (s2.close) {
        if (this.remoteId !== "")
          window.close();
        else
          this.classList.remove("-maximize"), this.parts.codeEditors.hidden = true;
        return;
      }
      if (this.css = s2.css, this.html = s2.html, this.js = s2.js, s2.test)
        this.test = s2.test;
      this.refresh();
    }), this.remoteSync.startListening();
    let l6 = Math.random() * 100;
    this.undoInterval = setInterval(() => {
      if (!document.hidden)
        this.updateUndo();
    }, 250 + l6), this.beforeUnloadHandler = () => this.remoteSync?.sendClose(), addEventListener("beforeunload", this.beforeUnloadHandler);
  }
  disconnectedCallback() {
    if (super.disconnectedCallback(), this.remoteSync?.sendClose(), this.remoteSync?.stopListening(), this.undoInterval)
      clearInterval(this.undoInterval), this.undoInterval = undefined;
    if (this.beforeUnloadHandler)
      removeEventListener("beforeunload", this.beforeUnloadHandler), this.beforeUnloadHandler = undefined;
  }
  copy = () => {
    let i3 = this.js !== "" ? "```js\n" + this.js.trim() + "\n```\n" : "", l6 = this.html !== "" ? "```html\n" + this.html.trim() + "\n```\n" : "", s2 = this.css !== "" ? "```css\n" + this.css.trim() + "\n```\n" : "", o2 = this.test !== "" ? "```test\n" + this.test.trim() + "\n```\n" : "";
    navigator.clipboard.writeText(i3 + l6 + s2 + o2);
  };
  toggleMaximize = () => {
    this.classList.toggle("-maximize");
  };
  showCode = () => {
    this.classList.add("-maximize"), this.classList.toggle("-vertical", this.offsetHeight > this.offsetWidth), this.parts.codeEditors.hidden = false;
  };
  closeCode = () => {
    if (this.remoteId !== "")
      this.remoteSync?.sendClose(), window.close();
    else
      this.remoteSync?.sendClose(), this.classList.remove("-maximize"), this.parts.codeEditors.hidden = true;
  };
  openEditorWindow = () => {
    let { css: i3, html: l6, js: s2, test: o2 } = this;
    m0(this.prefix, this.uuid, this.storageKey, this.remoteKey, { css: i3, html: l6, js: s2, test: o2 }), this.classList.add("-maximize");
  };
  refreshRemote = () => {
    this.remoteSync?.send({ css: this.css, html: this.html, js: this.js, test: this.test });
  };
  updateSources = () => {
    if (this.persistToDom) {
      let { sources: i3 } = this.parts;
      i3.innerText = "";
      for (let l6 of ["js", "css", "html", "test"])
        if (this[l6])
          i3.append(o4({ class: `language-${l6}`, innerHTML: this[l6] }));
    }
  };
  refresh = async () => {
    if (this.remoteId !== "")
      return;
    let i3 = await $2(), { example: l6, style: s2, exampleWidgets: o2 } = this.parts, h2;
    if (this.iframe)
      h2 = await G22({ html: this.html, css: this.css, js: this.js, context: this.context, transform: i3, exampleElement: l6, widgetsElement: o2 });
    else
      h2 = await b22({ html: this.html, css: this.css, js: this.js, context: this.context, transform: i3, exampleElement: l6, styleElement: s2, widgetsElement: o2 });
    if (this.persistToDom)
      this.updateSources();
    if (this.test && h2 && Y.enabled.value)
      this.classList.add("-has-tests", "-test-running"), this.classList.remove("-test-passed", "-test-failed"), this.testResults = await X22(this.test, h2, this.context, i3), this.classList.remove("-test-running"), this.displayTestResults();
    else
      this.classList.remove("-has-tests", "-test-running", "-test-passed", "-test-failed");
  };
  displayTestResults() {
    let { testResults: i3, testIndicator: l6 } = this.parts, s2 = this.testResults;
    if (!s2 || s2.tests.length === 0) {
      i3.hidden = true, this.classList.remove("-test-passed", "-test-failed"), l6.title = "no tests";
      return;
    }
    i3.innerHTML = "";
    let o2 = j1({ style: { marginBottom: "8px", fontWeight: "bold" } }, `${s2.passed}/${s2.tests.length} tests passed`);
    i3.append(o2);
    for (let h2 of s2.tests) {
      let r2 = h2.passed ? "✓" : "✗", y2 = h2.passed ? "test-pass" : "test-fail", e2 = j1({ class: y2 }, h4(r2 + " "), h2.name, h2.error ? h4({ style: { opacity: "0.7" } }, ` - ${h2.error}`) : "");
      i3.append(e2);
    }
    this.classList.toggle("-test-passed", s2.failed === 0), this.classList.toggle("-test-failed", s2.failed > 0), l6.title = s2.failed === 0 ? `${s2.passed} tests passed` : `${s2.failed}/${s2.tests.length} tests failed`, this.updateTestResultsVisibility(), this.dispatchEvent(new CustomEvent("testcomplete", { bubbles: true, detail: { results: s2, element: this } }));
  }
  initFromElements(i3) {
    for (let l6 of i3) {
      l6.hidden = true;
      let [s2, ...o2] = l6.innerHTML.split(`
`);
      if (["js", "html", "css", "test"].includes(s2)) {
        let h2 = o2.filter((y2) => y2.trim() !== "").map((y2) => y2.match(/^\s*/)[0].length).sort()[0], r2 = (h2 > 0 ? o2.map((y2) => y2.substring(h2)) : o2).join(`
`);
        this.setEditorValue(s2, r2);
      } else {
        let h2 = ["js", "html", "css", "test"].find((r2) => l6.matches(`.language-${r2}`));
        if (h2)
          this.setEditorValue(h2, h2 === "html" ? l6.innerHTML : l6.innerText);
      }
    }
  }
  showDefaultTab() {
    if (!this.hydrated) {
      this.pendingShowDefaultTab = true;
      return;
    }
    let { editors: i3 } = this.parts;
    if (this.js !== "")
      i3.value = 0;
    else if (this.html !== "")
      i3.value = 1;
    else if (this.css !== "")
      i3.value = 2;
    else if (this.test !== "")
      i3.value = 3;
  }
  render() {
    if (super.render(), this.remoteId !== "") {
      let i3 = localStorage.getItem(this.storageKey);
      if (i3 !== null) {
        let l6 = JSON.parse(i3);
        if (this.remoteKey !== l6.remoteKey)
          return;
        if (this.css = l6.css, this.html = l6.html, this.js = l6.js, l6.test)
          this.test = l6.test;
        this.parts.example.hidden = true, this.parts.codeEditors.hidden = false, this.classList.add("-maximize"), this.updateUndo();
      }
    } else
      this.refresh();
  }
}
var Y2 = g1.elementCreator({ tag: "tosi-example", styleSpec: S0 });
var ki = new URL(window.location.href).searchParams;
var r4 = ki.get("lx");
if (r4)
  document.title += " [code editor]", document.body.textContent = "", document.body.append(Y2({ remoteId: r4 }));
var { slot: x4 } = I;

class A1 extends u {
  static initAttributes = { minSize: 800, navSize: 200, compact: false, contentVisible: false };
  value = "normal";
  content = [x4({ name: "nav", part: "nav" }), x4({ part: "content" })];
  static styleSpec = { ":host": { display: "grid", gridTemplateColumns: `${kE.navWidth("50%")} ${kE.contentWidth("50%")}`, gridTemplateRows: "100%", position: "relative", margin: kE.margin("0 0 0 -100%"), transition: kE.sideNavTransition("0.25s ease-out") }, ":host slot": { position: "relative" }, ":host slot:not([name])": { display: "block" }, ':host slot[name="nav"]': { display: "block" } };
  onResize = () => {
    let { content: i3 } = this.parts, l6 = this.offsetParent;
    if (l6 === null)
      return;
    let s2 = this.value;
    if (this.compact = l6.offsetWidth < this.minSize, [...this.childNodes].find((h2) => h2 instanceof Element ? h2.getAttribute("slot") !== "nav" : true) === undefined)
      s2 = "compact/nav", this.style.setProperty("--nav-width", "100%"), this.style.setProperty("--content-width", "0%");
    else if (!this.compact)
      s2 = "normal", i3.classList.add("-tosi-sidenav-visible"), this.style.setProperty("--nav-width", `${this.navSize}px`), this.style.setProperty("--content-width", `calc(100% - ${this.navSize}px)`), this.style.setProperty("--margin", "0");
    else if (i3.classList.remove("-tosi-sidenav-visible"), this.style.setProperty("--nav-width", "50%"), this.style.setProperty("--content-width", "50%"), this.contentVisible)
      s2 = "compact/content", this.style.setProperty("--margin", "0 0 0 -100%");
    else
      s2 = "compact/nav", this.style.setProperty("--margin", "0 -100% 0 0");
    if (this.value !== s2)
      this.value = s2;
  };
  observer;
  connectedCallback() {
    super.connectedCallback(), this.contentVisible = this.parts.content.childNodes.length === 0, globalThis.addEventListener("resize", this.onResize), this.observer = new MutationObserver(this.onResize), this.observer.observe(this, { childList: true }), this.style.setProperty("--side-nav-transition", "0s"), setTimeout(() => {
      this.style.removeProperty("--side-nav-transition");
    }, 250);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.observer.disconnect();
  }
  render() {
    super.render(), this.onResize();
  }
}
var o2 = A1.elementCreator({ tag: "tosi-sidenav" });
var F1 = { pass: kE.testColorPass("#0a0"), fail: kE.testColorFail("#c00"), running: kE.testColorRunning("#fa0") };
var _i = { "@keyframes test-pulse": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.7" } }, "@keyframes test-appear": { from: { opacity: "0", transform: "scale(0.8)" }, to: { opacity: "1", transform: "scale(1)" } }, "@keyframes test-fade": { "0%, 20%": { opacity: "1", transform: "scale(1)" }, "70%": { opacity: "1", transform: "scale(1.1)" }, "100%": { opacity: "0", transform: "scale(0.9)", pointerEvents: "none" } }, "body:not(.tests-enabled) .doc-link::after, body:not(.tests-enabled) .test-widget": { display: "none !important" }, ".doc-link.-test-passed::after, .doc-link.-test-failed::after": { content: "''", width: fM.fontSize50, height: fM.fontSize50, borderRadius: "50%", marginLeft: fM.spacing50, display: "inline-block", verticalAlign: "middle" }, ".doc-link.-test-passed::after": { background: F1.pass }, ".doc-link.-test-failed::after": { background: F1.fail, animation: "test-pulse 2s ease-in-out infinite" }, ".test-widget": { _testBg: F1.running, position: "fixed", bottom: fM.spacing, right: fM.spacing, zIndex: "1000", background: fM.testBg, color: "white", gap: fM.spacing50 }, ".test-widget[hidden]": { display: "none" }, ".test-widget.-running": { _testBg: F1.running, animation: "test-appear 0.3s ease-out, test-pulse 2s ease-in-out 0.3s infinite" }, ".test-widget.-passed": { _testBg: F1.pass, animation: "test-fade 3s ease-out forwards" }, ".test-widget.-failed": { _testBg: F1.fail, animation: "test-pulse 2s ease-in-out infinite" }, ".test-widget .count": { background: "white", color: fM.testBg, borderRadius: "50%", width: fM.lineHeight, height: fM.lineHeight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" } };
var { div: W2, slot: $i } = I;

class m3 extends u {
  static initAttributes = { rotationSnap: 0, positionSnap: 0 };
  static angleSize = 15;
  static gridSize = 8;
  static snapAngle = false;
  static snapToGrid = false;
  static styleSpec = { ":host": { "--handle-bg": "#fff4", "--handle-color": "#2228", "--handle-hover-bg": "#8ff8", "--handle-hover-color": "#222", "--handle-size": "20px", "--handle-padding": "2px" }, ":host ::slotted(*)": { position: "absolute" }, ":host > :not(style,slot)": { boxSizing: "border-box", content: '" "', position: "absolute", display: "flex", height: fM.handleSize, width: fM.handleSize, padding: fM.handlePadding, "--text-color": fM.handleColor, background: fM.handleBg }, ":host > .drag-size": { top: 0, bottom: 0, left: 0, right: 0, height: "auto", width: "auto", background: "transparent", cursor: "ew-resize" }, ':host > [part="rotate"]': { transform: `translateY(${fM.handleSize_50})` }, ":host > [locked] > svg:first-child, :host > :not([locked]) > svg+svg": { display: "none" }, ":host .icon-unlock": { opacity: 0.5 }, ":host svg": { pointerEvents: "none" }, ":host > *:hover": { "--text-color": fM.handleHoverColor, background: fM.handleHoverBg } };
  static snappedCoords(i3, l6) {
    let { gridSize: s2 } = m3;
    return m3.snapToGrid || i3.shiftKey ? l6.map((o3) => Math.round(o3 / s2) * s2) : l6;
  }
  static snappedAngle(i3, l6) {
    let { angleSize: s2 } = m3;
    return m3.snapAngle || i3.shiftKey ? Math.round(l6 / s2) * s2 : l6;
  }
  get locked() {
    let i3 = this.parentElement;
    if (i3.style.inset)
      return { left: true, top: true, bottom: true, right: true };
    let l6 = i3.style.right.match(/\d/) !== null, s2 = !l6 || i3.style.left.match(/\d/) !== null, o3 = i3.style.bottom.match(/\d/) !== null, h2 = !o3 || i3.style.top.match(/\d/) !== null;
    return { left: s2, top: h2, bottom: o3, right: l6 };
  }
  set locked(i3) {
    let { bottom: l6, right: s2 } = i3, { left: o3, top: h2 } = i3, r2 = this.parentElement, y2 = r2.offsetLeft, e2 = r2.offsetTop, x3 = r2.offsetWidth, n3 = r2.offsetHeight, p3 = r2.offsetParent.offsetWidth - y2 - x3, d3 = r2.offsetParent.offsetHeight - e2 - n3;
    if (Object.assign(r2.style, { left: "", right: "", top: "", bottom: "", width: "", height: "" }), !s2)
      o3 = true;
    if (!l6)
      h2 = true;
    if (o3)
      r2.style.left = y2 + "px";
    if (s2)
      r2.style.right = p3 + "px";
    if (o3 && s2)
      r2.style.width = "auto";
    else
      r2.style.width = x3 + "px";
    if (h2)
      r2.style.top = e2 + "px";
    if (l6)
      r2.style.bottom = d3 + "px";
    if (h2 && l6)
      r2.style.height = "auto";
    else
      r2.style.height = n3 + "px";
    this.queueRender();
  }
  get coords() {
    let { top: i3, left: l6, right: s2, bottom: o3 } = this.parentElement.style;
    return { top: parseFloat(i3), left: parseFloat(l6), right: parseFloat(s2), bottom: parseFloat(o3) };
  }
  get left() {
    return this.parentElement.offsetLeft;
  }
  get width() {
    return this.parentElement.offsetWidth;
  }
  get right() {
    return this.parentElement.offsetParent.offsetWidth - (this.left + this.width);
  }
  get top() {
    return this.parentElement.offsetTop;
  }
  get height() {
    return this.parentElement.offsetHeight;
  }
  get bottom() {
    return this.parentElement.offsetParent.offsetHeight - (this.top + this.height);
  }
  triggerChange = () => {
    this.parentElement.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };
  adjustPosition = (i3) => {
    let { locked: l6 } = this;
    this.locked = l6;
    let s2 = this.parentElement, { top: o3, left: h2, bottom: r2, right: y2 } = this.coords;
    G2(i3, (e2, x3, n3) => {
      if ([e2, x3] = m3.snappedCoords(n3, [e2, x3]), !isNaN(o3))
        s2.style.top = o3 + x3 + "px";
      if (!isNaN(r2))
        s2.style.bottom = r2 - x3 + "px";
      if (!isNaN(h2))
        s2.style.left = h2 + e2 + "px";
      if (!isNaN(y2))
        s2.style.right = y2 - e2 + "px";
      if (n3.type === "mouseup")
        return this.triggerChange(), true;
    });
  };
  resize = (i3) => {
    let l6 = this.parentElement, { locked: s2 } = this;
    this.locked = Object.assign({ left: true, top: true, right: true, bottom: true });
    let [o3, h2] = [this.right, this.bottom];
    G2(i3, (r2, y2, e2) => {
      let x3 = o3 - r2, n3 = h2 - y2;
      if ([x3, n3] = m3.snappedCoords(e2, [x3, n3]), l6.style.right = x3 + "px", l6.style.bottom = n3 + "px", e2.type === "mouseup")
        return this.locked = s2, this.triggerChange(), true;
    });
  };
  adjustSize = (i3) => {
    let l6 = this.parentElement, { locked: s2 } = this, o3 = i3.target.getAttribute("part");
    this.locked = Object.assign({ left: true, right: true, top: true, bottom: true });
    let h2 = this[o3];
    G2(i3, (r2, y2, e2) => {
      let [x3] = m3.snappedCoords(e2, [h2 + (["left", "right"].includes(o3) ? r2 : y2) * (["right", "bottom"].includes(o3) ? -1 : 1)]);
      if (l6.style[o3] = x3 + "px", e2.type === "mouseup")
        return this.locked = s2, this.triggerChange(), true;
    });
  };
  get rect() {
    return this.parentElement.getBoundingClientRect();
  }
  get center() {
    let i3 = this.parentElement.getBoundingClientRect();
    return { x: i3.x + i3.width * 0.5, y: i3.y + i3.height * 0.5 };
  }
  get element() {
    return this.parentElement;
  }
  adjustRotation = (i3) => {
    let { center: l6 } = this, { transformOrigin: s2 } = this.element.style;
    if (!s2)
      this.element.style.transformOrigin = "50% 50%";
    G2(i3, (o3, h2, r2) => {
      let { clientX: y2, clientY: e2 } = r2, x3 = y2 - l6.x, n3 = e2 - l6.y, p3 = n3 > 0 ? 90 : -90;
      if (x3 !== 0)
        p3 = Math.atan2(n3, x3) * 180 / Math.PI;
      if (p3 = m3.snappedAngle(r2, p3), p3 === 0)
        this.element.style.transformOrigin = "", this.element.style.transform = "";
      else
        this.element.style.transform = `rotate(${p3}deg)`;
      return this.triggerChange(), r2.type === "mouseup";
    });
  };
  toggleLock = (i3) => {
    let { locked: l6 } = this, s2 = i3.target.title.split(" ")[1];
    l6[s2] = !l6[s2], this.locked = l6, this.queueRender(), i3.stopPropagation(), i3.preventDefault();
  };
  content = () => [W2({ part: "move", style: { top: "50%", left: "50%", transform: "translate(-50%,-50%)" } }, t3.move()), W2({ part: "left", title: "resize left", class: "drag-size", style: { left: "-6px", width: "8px" } }), W2({ part: "right", title: "resize right", class: "drag-size", style: { left: "calc(100% - 2px)", width: "8px" } }), W2({ part: "top", title: "resize top", class: "drag-size", style: { top: "-6px", height: "8px", cursor: "ns-resize" } }), W2({ part: "bottom", title: "resize bottom", class: "drag-size", style: { top: "calc(100% - 2px)", height: "8px", cursor: "ns-resize" } }), W2({ part: "resize", style: { top: "100%", left: "100%" } }, t3.resize()), W2({ part: "rotate", style: { top: "50%", right: "0" } }, t3.refreshCw()), W2({ part: "lockLeft", title: "lock left", style: { top: "50%", left: 0, transform: "translate(-100%, -50%)" } }, t3.unlock(), t3.lock()), W2({ part: "lockRight", title: "lock right", style: { top: "50%", left: "100%", transform: "translate(0%, -50%)" } }, t3.unlock(), t3.lock()), W2({ part: "lockTop", title: "lock top", style: { top: 0, left: "50%", transform: "translate(-50%, -100%)" } }, t3.unlock(), t3.lock()), W2({ part: "lockBottom", title: "lock bottom", style: { top: "100%", left: "50%", transform: "translate(-50%, 0%)" } }, t3.unlock(), t3.lock()), $i()];
  connectedCallback() {
    super.connectedCallback();
    let { left: i3, right: l6, top: s2, bottom: o3, lockLeft: h2, lockRight: r2, lockTop: y2, lockBottom: e2, move: x3, resize: n3, rotate: p3 } = this.parts, d3 = { passive: true };
    [i3, l6, s2, o3].forEach((C3) => {
      C3.addEventListener("mousedown", this.adjustSize, d3), C3.addEventListener("touchstart", this.adjustSize, d3);
    }), [h2, r2, y2, e2].forEach((C3) => {
      C3.addEventListener("click", this.toggleLock);
    }), n3.addEventListener("mousedown", this.resize, d3), x3.addEventListener("mousedown", this.adjustPosition, d3), p3.addEventListener("mousedown", this.adjustRotation, d3), n3.addEventListener("touchstart", this.resize, d3), x3.addEventListener("touchstart", this.adjustPosition, d3), p3.addEventListener("touchstart", this.adjustRotation, d3);
  }
  render() {
    if (super.render(), !this.parentElement)
      return;
    let { lockLeft: i3, lockRight: l6, lockTop: s2, lockBottom: o3 } = this.parts, { left: h2, right: r2, top: y2, bottom: e2 } = this.locked;
    i3.toggleAttribute("locked", h2), l6.toggleAttribute("locked", r2), s2.toggleAttribute("locked", y2), o3.toggleAttribute("locked", e2);
  }
}
var y8 = m3.elementCreator({ tag: "tosi-editable" });
var { div: Qi, input: bi, button: E2, span: Gi } = I;
var t4 = (i3) => i3;
var c4 = "null filter, everything matches";
var f4 = { contains: { caption: "contains", negative: "does not contain", makeTest: (i3) => {
  return i3 = i3.toLocaleLowerCase(), (l6) => String(l6).toLocaleLowerCase().includes(i3);
} }, hasTags: { caption: "has tags", makeTest: (i3) => {
  let l6 = i3.split(/[\s,]/).map((s2) => s2.trim().toLocaleLowerCase()).filter((s2) => s2 !== "");
  return (s2) => Array.isArray(s2) && l6.find((o3) => !s2.includes(o3)) === undefined;
} }, doesNotHaveTags: { caption: "does not have tags", makeTest: (i3) => {
  let l6 = i3.split(/[\s,]/).map((s2) => s2.trim().toLocaleLowerCase()).filter((s2) => s2 !== "");
  return (s2) => Array.isArray(s2) && l6.find((o3) => s2.includes(o3)) === undefined;
} }, equals: { caption: "=", negative: "≠", makeTest: (i3) => {
  if (isNaN(Number(i3)))
    return i3 = String(i3).toLocaleLowerCase(), (s2) => String(s2).toLocaleLowerCase() === i3;
  let l6 = Number(i3);
  return (s2) => Number(s2) === l6;
} }, after: { caption: "is after", negative: "is before", makeTest: (i3) => {
  let l6 = new Date(i3);
  return (s2) => new Date(s2) > l6;
} }, greaterThan: { caption: ">", negative: "≤", makeTest: (i3) => {
  if (!isNaN(Number(i3))) {
    let l6 = Number(i3);
    return (s2) => Number(s2) > l6;
  }
  return i3 = i3.toLocaleLowerCase(), (l6) => String(l6).toLocaleLowerCase() > i3;
} }, truthy: { caption: "is true/non-empty/non-zero", negative: "is false/empty/zero", needsValue: false, makeTest: () => (i3) => !!i3 }, isTrue: { caption: "= true", needsValue: false, makeTest: () => (i3) => i3 === true }, isFalse: { caption: "= false", needsValue: false, makeTest: () => (i3) => i3 === false } };
var Ui = { description: "anything", test: () => true };
function p4(i3) {
  return i3.options[i3.selectedIndex]?.caption || "";
}

class C4 extends u {
  static initAttributes = { haystack: "*", condition: "contains", needle: "" };
  fields = [];
  filters = f4;
  content = () => [X3({ part: "haystack" }), X3({ part: "condition" }), bi({ part: "needle", type: "search" }), Gi({ part: "padding" }), E2({ part: "remove", title: "delete" }, t3.trash())];
  filter = Ui;
  get state() {
    let { haystack: i3, needle: l6, condition: s2 } = this.parts;
    return { haystack: i3.value, needle: l6.value, condition: s2.value };
  }
  set state(i3) {
    Object.assign(this, i3);
  }
  buildFilter = () => {
    let { haystack: i3, condition: l6, needle: s2 } = this.parts, o3 = l6.value.startsWith("~"), h2 = o3 ? l6.value.slice(1) : l6.value, r2 = this.filters[h2];
    s2.hidden = r2.needsValue === false;
    let y2 = r2.needsValue === false ? r2.makeTest(undefined) : r2.makeTest(s2.value), e2 = i3.value, x3;
    if (e2 !== "*")
      x3 = o3 ? (d3) => !y2(d3[e2]) : (d3) => y2(d3[e2]);
    else
      x3 = o3 ? (d3) => Object.values(d3).find((C3) => !y2(C3)) !== undefined : (d3) => Object.values(d3).find((C3) => y2(C3)) !== undefined;
    let n3 = r2.needsValue !== false ? ` "${s2.value}"` : "", p3 = `${p4(i3)} ${p4(l6)}${n3}`;
    this.filter = { description: p3, test: x3 }, this.parentElement?.dispatchEvent(new Event("change"));
  };
  connectedCallback() {
    super.connectedCallback();
    let { haystack: i3, condition: l6, needle: s2, remove: o3 } = this.parts;
    i3.addEventListener("change", this.buildFilter), l6.addEventListener("change", this.buildFilter), s2.addEventListener("input", this.buildFilter), i3.value = this.haystack, l6.value = this.condition, s2.value = this.needle, o3.addEventListener("click", () => {
      let { parentElement: h2 } = this;
      this.remove(), h2?.dispatchEvent(new Event("change"));
    });
  }
  render() {
    super.render();
    let { haystack: i3, condition: l6, needle: s2 } = this.parts;
    if (i3.options = [{ caption: "any field", value: "*" }, ...this.fields.map((o3) => o3.prop)], l6.options = Object.keys(this.filters).map((o3) => {
      let h2 = this.filters[o3];
      return h2.negative !== undefined ? [{ caption: h2.caption, value: o3 }, { caption: h2.negative, value: "~" + o3 }] : { caption: h2.caption, value: o3 };
    }).flat(), this.haystack !== "")
      i3.value = this.haystack;
    if (this.condition !== "")
      l6.value = this.condition;
    if (this.needle !== "")
      s2.value = this.needle;
    this.buildFilter();
  }
}
var D2 = C4.elementCreator({ tag: "tosi-filter-part", styleSpec: { ":host": { display: "flex" }, ":host .tosi-icon:": { verticalAlign: "middle", pointerEvents: "none" }, ':host [part="haystack"], :host [part="condition"]': { flex: "1" }, ':host [part="needle"]': { flex: 2 }, ':host [hidden]+[part="padding"]': { display: "block", content: " ", flex: "1 1 auto" } } });

class a4 extends u {
  _fields = [];
  get fields() {
    return this._fields;
  }
  set fields(i3) {
    this._fields = i3, this.queueRender();
  }
  get state() {
    let { filterContainer: i3 } = this.parts;
    return [...i3.children].map((l6) => l6.state);
  }
  set state(i3) {
    let { fields: l6, filters: s2 } = this, { filterContainer: o3 } = this.parts;
    o3.textContent = "";
    for (let h2 of i3)
      o3.append(D2({ fields: l6, filters: s2, ...h2 }));
  }
  filter = t4;
  description = c4;
  addFilter = () => {
    let { fields: i3, filters: l6 } = this, { filterContainer: s2 } = this.parts;
    s2.append(D2({ fields: i3, filters: l6 }));
  };
  content = () => [E2({ part: "add", title: "add filter condition", onClick: this.addFilter, class: "round" }, t3.plus()), Qi({ part: "filterContainer" }), E2({ part: "reset", title: "reset filter", onClick: this.reset }, t3.x())];
  filters = f4;
  reset = () => {
    let { fields: i3, filters: l6 } = this, { filterContainer: s2 } = this.parts;
    this.description = c4, this.filter = t4, s2.textContent = "", s2.append(D2({ fields: i3, filters: l6 })), this.dispatchEvent(new Event("change"));
  };
  buildFilter = () => {
    let { filterContainer: i3 } = this.parts;
    if (i3.children.length === 0) {
      this.reset();
      return;
    }
    let l6 = [...i3.children].map((o3) => o3.filter), s2 = l6.map((o3) => o3.test);
    this.description = l6.map((o3) => o3.description).join(", "), this.filter = (o3) => o3.filter((h2) => s2.find((r2) => r2(h2) === false) === undefined), this.dispatchEvent(new Event("change"));
  };
  connectedCallback() {
    super.connectedCallback();
    let { filterContainer: i3 } = this.parts;
    i3.addEventListener("change", this.buildFilter), this.reset();
  }
  render() {
    super.render();
  }
}
var C8 = a4.elementCreator({ tag: "tosi-filter", styleSpec: { ":host": { height: "auto", display: "grid", gridTemplateColumns: "32px calc(100% - 64px) 32px", alignItems: "center" }, ':host [part="filterContainer"]': { display: "flex", flexDirection: "column", alignItems: "stretch", flex: "1 1 auto" }, ':host [part="haystack"]': { _fieldWidth: "100px" }, ':host [part="condition"]': { _fieldWidth: "60px" }, ':host [part="needle"]': { _fieldWidth: "80px" }, ':host [part="add"], :host [part="reset"]': { "--button-size": "var(--touch-size, 32px)", borderRadius: "999px", height: "var(--button-size)", lineHeight: "var(--button-size)", margin: "0", padding: "0", textAlign: "center", width: "var(--button-size)", flex: "0 0 var(--button-size)" } } });
var { form: Xi, slot: I22, xinSlot: g4, label: Ki, input: Yi, span: Ni } = I;
function n1(i3, l6, s2) {
  if (s2 !== "" && s2 !== false)
    i3.setAttribute(l6, s2);
  else
    i3.removeAttribute(l6);
}
function Wi(i3) {
  switch (i3.type) {
    case "checkbox":
      return i3.checked;
    case "radio": {
      let l6 = i3.parentElement?.querySelector(`input[type="radio"][name="${i3.name}"]:checked`);
      return l6 ? l6.value : null;
    }
    case "range":
    case "number":
      return Number(i3.value);
    default:
      return Array.isArray(i3.value) && i3.value.length === 0 ? null : i3.value;
  }
}
function k4(i3, l6) {
  if (!(i3 instanceof HTMLElement))
    ;
  else if (i3 instanceof HTMLInputElement)
    switch (i3.type) {
      case "checkbox":
        i3.checked = l6;
        break;
      case "radio":
        i3.checked = l6 === i3.value;
        break;
      default:
        i3.value = String(l6 || "");
    }
  else if (l6 != null || i3.value != null)
    i3.value = String(l6 || "");
}

class u22 extends u {
  static initAttributes = { caption: "", key: "", type: "", optional: false, pattern: "", placeholder: "", min: "", max: "", step: "", fixedPrecision: -1, prefix: "", suffix: "" };
  value = null;
  content = Ki(g4({ part: "caption" }), Ni({ part: "field" }, g4({ part: "input", name: "input" }), Yi({ part: "valueHolder" })));
  valueChanged = false;
  handleChange = () => {
    let { input: i3, valueHolder: l6 } = this.parts, s2 = i3.children[0] || l6;
    if (s2 !== l6)
      l6.value = s2.value;
    this.value = Wi(s2), this.valueChanged = true;
    let o3 = this.closest("tosi-form");
    if (o3 && this.key !== "")
      switch (this.type) {
        case "checkbox":
          o3.fields[this.key] = s2.checked;
          break;
        case "number":
        case "range":
          if (this.fixedPrecision > -1)
            s2.value = Number(s2.value).toFixed(this.fixedPrecision), o3.fields[this.key] = Number(s2.value);
          else
            o3.fields[this.key] = Number(s2.value);
          break;
        default:
          o3.fields[this.key] = s2.value;
      }
  };
  connectedCallback() {
    super.connectedCallback();
    let { input: i3, valueHolder: l6 } = this.parts;
    l6.addEventListener("change", this.handleChange), i3.addEventListener("change", this.handleChange, true);
  }
  render() {
    if (this.valueChanged) {
      this.valueChanged = false;
      return;
    }
    let { input: i3, caption: l6, valueHolder: s2, field: o3 } = this.parts;
    if (l6.textContent?.trim() === "")
      l6.append(this.caption !== "" ? this.caption : this.key);
    if (this.type === "text") {
      i3.textContent = "";
      let h2 = I.textarea({ value: this.value });
      if (this.placeholder)
        h2.setAttribute("placeholder", this.placeholder);
      i3.append(h2);
    } else if (this.type === "color")
      i3.textContent = "", i3.append(j0({ value: this.value }));
    else if (i3.children.length === 0) {
      if (n1(s2, "placeholder", this.placeholder), n1(s2, "type", this.type), n1(s2, "pattern", this.pattern), n1(s2, "min", this.min), n1(s2, "max", this.max), this.step)
        n1(s2, "step", this.step);
      else if (this.fixedPrecision > 0 && this.type === "number")
        n1(s2, "step", Math.pow(10, -this.fixedPrecision));
    }
    if (k4(s2, this.value), k4(i3.children[0], this.value), this.prefix ? o3.setAttribute("prefix", this.prefix) : o3.removeAttribute("prefix"), this.suffix ? o3.setAttribute("suffix", this.suffix) : o3.removeAttribute("suffix"), s2.classList.toggle("hidden", i3.children.length > 0), i3.children.length > 0)
      s2.setAttribute("tabindex", "-1");
    else
      s2.removeAttribute("tabindex");
    i3.style.display = i3.children.length === 0 ? "none" : "", n1(s2, "required", !this.optional);
  }
}

class m22 extends u {
  context = {};
  value = {};
  get isValid() {
    return [...this.querySelectorAll("*")].filter((l6) => l6.required !== undefined).find((l6) => !l6.reportValidity()) === undefined;
  }
  static styleSpec = { ":host": { display: "flex", flexDirection: "column" }, ":host::part(header), :host::part(footer)": { display: "flex" }, ":host::part(content)": { display: "flex", flexDirection: "column", overflow: "hidden auto", height: "100%", width: "100%", position: "relative", boxSizing: "border-box" }, ":host form": { display: "flex", flex: "1 1 auto", position: "relative", overflow: "hidden" } };
  content = [I22({ part: "header", name: "header" }), Xi({ part: "form" }, I22({ part: "content" })), I22({ part: "footer", name: "footer" })];
  getField = (i3) => {
    return this.querySelector(`tosi-field[key="${i3}"]`);
  };
  get fields() {
    if (typeof this.value === "string")
      try {
        this.value = JSON.parse(this.value);
      } catch (s2) {
        console.log("<tosi-form> could not use its value, expects valid JSON"), this.value = {};
      }
    let { getField: i3 } = this, l6 = this.dispatchEvent.bind(this);
    return new Proxy(this.value, { get(s2, o3) {
      return s2[o3];
    }, set(s2, o3, h2) {
      if (s2[o3] !== h2) {
        s2[o3] = h2;
        let r2 = i3(o3);
        if (r2)
          r2.value = h2;
        l6(new Event("change"));
      }
      return true;
    } });
  }
  set fields(i3) {
    let l6 = [...this.querySelectorAll("tosi-field")];
    for (let s2 of l6)
      s2.value = i3[s2.key];
  }
  submit = () => {
    this.parts.form.dispatchEvent(new Event("submit"));
  };
  handleSubmit = (i3) => {
    i3.preventDefault(), i3.stopPropagation();
    let l6 = this.fields;
    this.submitCallback(l6, this.isValid);
  };
  submitCallback = (i3, l6) => {
    console.log("override submitCallback to handle this data", { value: i3, isValid: l6 });
  };
  connectedCallback() {
    super.connectedCallback();
    let { form: i3 } = this.parts;
    i3.addEventListener("submit", this.handleSubmit), this.addEventListener("change", this.handleElementChange, true), this.initializeNamedElements();
  }
  handleElementChange = (i3) => {
    let l6 = i3.target, s2 = l6.getAttribute("name");
    if (s2 && "value" in l6)
      this.fields[s2] = l6.value;
  };
  initializeNamedElements() {
    let i3 = this.fields, l6 = this.querySelectorAll("[name], [key]");
    for (let s2 of l6) {
      let o3 = s2.getAttribute("name") || s2.getAttribute("key");
      if (o3 && i3[o3] !== undefined)
        s2.value = i3[o3];
    }
  }
}
var Ri = { ':host [part="field"]': { position: "relative", display: "flex", alignItems: "center", gap: kE.prefixSuffixGap("8px") }, ':host [part="field"][prefix]::before': { content: "attr(prefix)" }, ':host [part="field"][suffix]::after': { content: "attr(suffix)" }, ':host [part="field"] > *, :host [part="input"] > *': { width: "100%" }, ":host textarea": { resize: "none" }, ':host input[type="checkbox"]': { width: "fit-content" }, ":host .hidden": { position: "absolute", pointerEvents: "none", opacity: 0 } };
var Di = u22.elementCreator({ tag: "tosi-field", styleSpec: Ri });
var Ei = m22.elementCreator({ tag: "tosi-form" });
var { div: Si } = I;

class q1 extends u {
  static formAssociated = true;
  static initAttributes = { coords: "65.01715565258993,25.48081004203459,12", token: "", mapStyle: "mapbox://styles/mapbox/streets-v12", name: "" };
  value = "";
  formDisabledCallback(i3) {}
  formResetCallback() {
    this.value = "", this.coords = "65.01715565258993,25.48081004203459,12";
  }
  content = Si({ style: { width: "100%", height: "100%" } });
  get map() {
    return this._map;
  }
  static mapboxCSSAvailable;
  static mapboxAvailable;
  _map;
  static styleSpec = { ":host": { display: "inline-block", position: "relative", width: "400px", height: "400px", textAlign: "left" } };
  constructor() {
    super();
    if (q1.mapboxCSSAvailable === undefined)
      q1.mapboxCSSAvailable = c2("https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css").catch((i3) => {
        console.error("failed to load mapbox-gl.css", i3);
      }), q1.mapboxAvailable = Z("https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.js").catch((i3) => {
        console.error("failed to load mapbox-gl.js", i3);
      });
  }
  connectedCallback() {
    if (super.connectedCallback(), !this.token)
      console.error("mapbox requires an access token which you can provide via the token attribute");
  }
  _lastCoords = "";
  _lastStyle = "";
  render() {
    if (super.render(), !this.token)
      return;
    if (this._map) {
      if (this.coords !== this._lastCoords) {
        let [h2, r2, y2] = this.coords.split(",").map((e2) => Number(e2));
        this._map.setCenter([r2, h2]), this._map.setZoom(y2), this._lastCoords = this.coords;
      }
      if (this.mapStyle !== this._lastStyle)
        this._map.setStyle(this.mapStyle), this._lastStyle = this.mapStyle;
      return;
    }
    let { div: i3 } = this.parts, [l6, s2, o3] = this.coords.split(",").map((h2) => Number(h2));
    this._lastCoords = this.coords, this._lastStyle = this.mapStyle, q1.mapboxAvailable.then(({ mapboxgl: h2 }) => {
      console.log("%cmapbox may complain about missing css -- don't panic!", "background: orange; color: black; padding: 0 5px;"), h2.accessToken = this.token, this._map = new h2.Map({ container: i3, style: this.mapStyle, zoom: o3, center: [s2, l6] }), this._map.on("render", () => this._map.resize()), this._map.on("moveend", () => {
        let r2 = this._map.getCenter(), y2 = this._map.getZoom(), e2 = `${r2.lat.toFixed(6)},${r2.lng.toFixed(6)},${y2.toFixed(1)}`;
        if (e2 !== this.value) {
          if (this.internals)
            this.internals.setFormValue(e2);
        }
      });
    });
  }
}
var O8 = q1.elementCreator({ tag: "tosi-map" });
var { div: S2, span: h2, button: T22 } = I;
var X1 = 86400000;
var ll = [0, 1, 2, 3, 4, 5, 6];
var sl = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var i0 = (i3, l6 = 2, s2 = "0") => String(i3).padStart(l6, s2);
var K1 = (i3, l6, s2) => new Date(`${i3}-${i0(l6)}-${i0(s2)}`);

class M4 extends u {
  static formAssociated = true;
  static initAttributes = { month: NaN, year: NaN, weekStart: 0, minDate: K1(new Date().getFullYear() - 100, 1, 1).toISOString().split("T")[0], maxDate: K1(new Date().getFullYear() + 10, 12, 31).toISOString().split("T")[0], selectable: false, multiple: false, range: false, disabled: false, readonly: false, required: false, name: "" };
  selectedDays = [];
  value = "";
  formDisabledCallback(i3) {
    this.disabled = i3;
  }
  formResetCallback() {
    this.value = "", this.selectedDays = [];
  }
  get endDay() {
    return 1 - this.weekStart;
  }
  get months() {
    return sl.map((i3) => ({ caption: K1(2025, i3, 1).toString().split(" ")[1], value: String(i3) }));
  }
  get years() {
    let i3 = Number(this.minDate.split("-")[0]), l6 = Number(this.maxDate.split("-")[0]), s2 = [];
    for (let o3 = i3;o3 <= l6; o3++)
      s2.push(String(o3));
    return s2;
  }
  monthChanged = (i3, l6) => {};
  gotoMonth(i3, l6) {
    if (this.month !== l6 || this.year !== i3)
      this.month = l6, this.year = i3, this.monthChanged(i3, l6);
  }
  setMonth = () => {
    this.gotoMonth(Number(this.parts.year.value), Number(this.parts.month.value));
  };
  get to() {
    return this.selectedDays[1] || "";
  }
  set to(i3) {
    this.selectedDays[1] = i3, this.selectedDays.splice(2);
  }
  get from() {
    return this.selectedDays[0] || "";
  }
  set from(i3) {
    this.selectedDays[0] = i3, this.selectedDays.splice(2);
  }
  clickDate = (i3) => {
    let l6 = i3.target.getAttribute("title");
    this.selectDate(l6);
  };
  keyDate = (i3) => {
    let l6 = false;
    switch (i3.code) {
      case "Space": {
        let s2 = i3.target.getAttribute("title");
        this.selectDate(s2), l6 = true;
        break;
      }
      case "Tab":
        break;
      default:
        console.log(i3);
    }
    if (l6)
      i3.preventDefault(), i3.stopPropagation();
  };
  #i = "";
  selectDate = (i3) => {
    if (this.#i = i3, this.range) {
      if (!this.to)
        this.selectedDays = [i3, i3];
      else if (this.from === i3 && this.to === i3)
        this.selectedDays = [];
      else if (this.from === i3)
        this.from = this.to;
      else if (this.to === i3)
        this.to = this.from;
      else if (i3 < this.from)
        this.from = i3;
      else if (i3 > this.to)
        this.to = i3;
      else
        this.to = i3;
      this.value = `${this.from},${this.to}`;
    } else if (this.multiple) {
      if (this.selectedDays.includes(i3))
        this.selectedDays.splice(this.selectedDays.indexOf(i3), 1);
      else
        this.selectedDays.push(i3), this.selectedDays.sort();
      this.value = this.selectedDays.join(",");
    } else if (this.selectable)
      if (this.selectedDays.includes(i3))
        this.value = "", this.selectedDays = [];
      else
        this.value = i3, this.selectedDays = [i3];
  };
  nextMonth = () => {
    if (this.month < 12)
      this.gotoMonth(this.year, this.month + 1);
    else
      this.gotoMonth(this.year + 1, 1);
  };
  previousMonth = () => {
    if (this.month > 1)
      this.gotoMonth(this.year, this.month - 1);
    else
      this.gotoMonth(this.year - 1, 12);
  };
  checkDay = (i3) => {
    if (!this.range)
      return this.selectedDays.includes(i3);
    else if (this.range)
      return this.from && i3 >= this.from && i3 <= this.to;
    return false;
  };
  dateMenuItem = (i3, l6 = "") => {
    return i3 = i3.split("T")[0], { caption: l6 || i3, enabled: () => !i3.startsWith(`${this.year}-${i0(this.month)}-`), action: () => {
      this.gotoDate(i3);
    } };
  };
  jumpMenu = () => {
    J2({ target: this.parts.jump, menuItems: [this.dateMenuItem(new Date().toISOString(), "This Month"), ...this.selectedDays.length === 0 ? [] : [null], ...this.selectedDays.map((i3) => this.dateMenuItem(i3))] });
  };
  content = () => [S2({ part: "header" }, T22({ part: "previous", onClick: this.previousMonth }, t3.chevronLeft()), h2({ style: { flex: "1" } }), T22({ part: "jump", onClick: this.jumpMenu }, t3.calendar()), X3({ part: "month", options: this.months, onChange: this.setMonth }), X3({ part: "year", options: [this.year], onChange: this.setMonth }), h2({ style: { flex: "1" } }), T22({ part: "next", onClick: this.nextMonth }, t3.chevronRight())), S2({ part: "week" }), S2({ part: "days" })];
  gotoDate(i3) {
    let l6 = new Date(i3);
    this.gotoMonth(l6.getFullYear(), l6.getMonth() + 1);
  }
  connectedCallback() {
    super.connectedCallback();
    let i3 = new Date(this.value.split(",").pop() || Date.now());
    if (isNaN(this.month))
      this.month = i3.getMonth() + 1;
    if (isNaN(this.year))
      this.year = i3.getFullYear();
  }
  days = [];
  render() {
    super.render();
    let { week: i3, days: l6, jump: s2, month: o3, year: h3, previous: r2, next: y2 } = this.parts;
    this.selectedDays = this.value ? this.value.split(",") : [];
    let e2 = K1(this.year, this.month, 1), x3 = new Date(e2.valueOf() - (7 + e2.getDay() - this.weekStart) % 7 * X1), n3 = this.month === 12 ? 1 : this.month + 1, p3 = new Date(K1(this.year + (this.month === 12 ? 1 : 0), n3, 1).valueOf() - X1), d3 = new Date(p3.valueOf() + (this.weekStart * 2 + 5 + this.endDay - p3.getDay()) % 7 * X1), C3 = ll.map((H) => new Date(x3.valueOf() + H * X1).toString().split(" ")[0]);
    this.days = [];
    let k3 = new Date().toISOString().split("T")[0];
    for (let H = x3.valueOf();H <= d3.valueOf(); H += X1) {
      let F3 = new Date(H), P3 = F3.toISOString().split("T")[0];
      this.days.push({ date: F3, selected: false, inMonth: F3.getMonth() + 1 === this.month, isToday: P3 === k3, isWeekend: F3.getDay() % 6 === 0, inRange: !!(this.from && P3 >= this.from && P3 <= this.to) });
    }
    o3.value = String(this.month), h3.value = String(this.year), o3.disabled = h3.disabled = s2.disabled = r2.disabled = y2.disabled = this.disabled || this.readonly, h3.options = this.years, i3.textContent = "", i3.append(...C3.map((H) => h2({ class: "day" }, H))), l6.textContent = "";
    let w3 = null, { to: O, from: R2 } = this;
    l6.append(...this.days.map((H) => {
      let F3 = ["date"];
      if (H.inMonth)
        F3.push("in-month");
      if (H.isToday)
        F3.push("today");
      let P3 = H.date.toISOString().split("T")[0];
      if (this.checkDay(P3))
        F3.push("checked");
      if (F3.push(H.isWeekend ? "weekend" : "weekday"), this.range) {
        if (O === P3)
          F3.push("range-end");
        if (R2 === P3)
          F3.push("range-start");
      }
      let v1 = h2({ class: F3.join(" "), title: P3, onClick: this.clickDate, onKeydown: this.keyDate, tabindex: "0" }, H.date.getDate());
      if (P3 === this.#i)
        w3 = v1;
      return v1;
    })), w3?.focus();
  }
}
var X8 = M4.elementCreator({ tag: "tosi-month", styleSpec: { ":host": { display: "block" }, ":host [part=header]": { display: "flex", alignItems: "stretch", justifyContent: "stretch" }, ":host[disabled]": { pointerEvents: "none", opacity: kE.disabledOpacity(0.6) }, ':host [part="month"], :host [part="year"]': { _fieldWidth: "4em", flex: "1" }, ":host [part=week], :host [part=days]": { display: "grid", gridTemplateColumns: "auto auto auto auto auto auto auto", justifyItems: "stretch" }, ":host .today": { background: kE.monthTodayBackground("transparent"), boxShadow: kE.monthTodayShadow("none"), backdropFilter: kE.monthTodayBackdropFilter("brightness(0.9)"), fontWeight: kE.monthTodayFontWeight("800") }, ":host .day, :host .date": { padding: 5, display: "flex", justifyContent: "center", userSelect: "none" }, ":host .day": { color: kE.monthDayColor("hotpink"), background: kE.monthDayBackground("white"), fontWeight: kE.monthDayFontWeight("800") }, ":host .date": { cursor: "default" }, ":host .weekend": { background: kE.monthWeekendBackground("#eee") }, ":host .date:not(.in-month)": { opacity: 0.5 }, ":host .date.checked": { color: kE.monthDateCheckedColor("white"), background: kE.monthDateCheckedBackground("hotpink") }, ":host:not([range]) .date.checked": { borderRadius: kE.monthDateCheckedBorderRadius("10px") }, ":host .range-start": { borderTopLeftRadius: kE.monthDateCheckedBorderRadius("10px"), borderBottomLeftRadius: kE.monthDateCheckedBorderRadius("10px") }, ":host .range-end": { borderTopRightRadius: kE.monthDateCheckedBorderRadius("10px"), borderBottomRightRadius: kE.monthDateCheckedBorderRadius("10px") } } });
var { div: l0, button: hl } = I;
var rl = { error: "red", warn: "orange", info: "royalblue", log: "gray", success: "green", progress: "royalblue" };

class k1 extends u {
  static singleton;
  static styleSpec = { ":host": { _notificationSpacing: 8, _notificationWidth: 360, _notificationPadding: `${fM.notificationSpacing} ${fM.notificationSpacing50} ${fM.notificationSpacing} ${fM.notificationSpacing200}`, _notificationBg: "#fafafa", _notificationAccentColor: "#aaa", _notificationTextColor: "#444", _notificationIconSize: fM.notificationSpacing300, _notificationButtonSize: 48, _notificationBorderWidth: "3px 0 0", _notificationBorderRadius: fM.notificationSpacing50, position: "fixed", left: 0, right: 0, bottom: 0, paddingBottom: fM.notificationSpacing, width: fM.notificationWidth, display: "flex", flexDirection: "column-reverse", margin: "0 auto", gap: fM.notificationSpacing, maxHeight: "50vh", overflow: "hidden auto", boxShadow: "none !important" }, ":host *": { color: fM.notificationTextColor }, ":host .note": { display: "grid", background: fM.notificationBg, padding: fM.notificationPadding, gridTemplateColumns: `${fM.notificationIconSize} 1fr ${fM.notificationButtonSize}`, gap: fM.notificationSpacing, alignItems: "center", borderRadius: fM.notificationBorderRadius, boxShadow: `0 2px 8px #0006, inset 0 0 0 2px ${fM.notificationAccentColor}`, borderColor: fM.notificationAccentColor, borderWidth: fM.notificationBorderWidth, borderStyle: "solid", transition: "0.5s ease-in", transitionProperty: "margin, opacity", zIndex: 1 }, ":host .note .icon": { stroke: fM.notificationAccentColor }, ":host .note button": { display: "flex", lineHeight: fM.notificationButtonSize, padding: 0, margin: 0, height: fM.notificationButtonSize, width: fM.notificationButtonSize, background: "transparent", alignItems: "center", justifyContent: "center", boxShadow: "none", border: "none", position: "relative" }, ":host .note button:hover svg": { stroke: fM.notificationAccentColor }, ":host .note button:active svg": { borderRadius: 99, stroke: fM.notificationBg, background: fM.notificationAccentColor, padding: fM.spacing50 }, ":host .note svg": { height: fM.notificationIconSize, width: fM.notificationIconSize, pointerEvents: "none" }, ":host .message": { display: "flex", flexDirection: "column", alignItems: "center", gap: fM.notificationSpacing }, ":host .note.closing": { opacity: 0, zIndex: 0 } };
  static removeNote(i3) {
    i3.classList.add("closing"), i3.style.marginBottom = -i3.offsetHeight + "px";
    let l6 = () => {
      i3.remove();
    };
    i3.addEventListener("transitionend", l6), setTimeout(l6, 1000);
  }
  static post(i3) {
    let { message: l6, duration: s2, type: o3, close: h3, progress: r2, icon: y2, color: e2 } = Object.assign({ type: "info", duration: -1 }, typeof i3 === "string" ? { message: i3 } : i3);
    if (!this.singleton)
      this.singleton = z4();
    let x3 = this.singleton;
    document.body.append(x3), x3.style.zIndex = String(B1() + 1);
    let n3 = e2 || rl[o3], p3 = r2 || o3 === "progress" ? I.progress() : {}, d3 = () => {
      if (h3)
        h3();
      k1.removeNote(w3);
    }, C3 = y2 instanceof SVGElement ? y2 : y2 ? t3[y2]({ class: "icon" }) : t3.info({ class: "icon" }), k3 = o3 === "error" || o3 === "warn", w3 = l0({ class: `note ${o3}`, role: k3 ? "alert" : "status", ariaLive: k3 ? "assertive" : "polite", style: { _notificationAccentColor: n3 } }, C3, l0({ class: "message" }, l0(l6), p3), hl({ class: "close", title: "close", ariaLabel: "Close notification", apply(O) {
      O.addEventListener("click", d3);
    } }, t3.x()));
    if (x3.shadowRoot.append(w3), p3 instanceof HTMLProgressElement && r2 instanceof Function) {
      p3.setAttribute("max", String(100)), p3.value = r2();
      let O = setInterval(() => {
        if (!x3.shadowRoot.contains(w3)) {
          clearInterval(O);
          return;
        }
        let R2 = r2();
        if (p3.value = R2, R2 >= 100)
          k1.removeNote(w3);
      }, 1000);
    }
    if (s2 > 0)
      setTimeout(() => {
        k1.removeNote(w3);
      }, s2 * 1000);
    return w3.scrollIntoView(), d3;
  }
  content = null;
}
var z4 = k1.elementCreator({ tag: "tosi-notification" });
var xl = async (i3, l6 = "SHA-1") => {
  let o3 = new TextEncoder().encode(i3), h3 = await crypto.subtle.digest(l6, o3);
  return Array.from(new Uint8Array(h3)).map((e2) => e2.toString(16).padStart(2, "0")).join("");
};
var nl = async (i3) => {
  let l6 = await xl(i3), s2 = await fetch(`https://weakpass.com/api/v1/search/${l6}`);
  if (s2.ok) {
    let o3 = await s2.json();
    console.log("password found in weakpass database", o3);
  }
  return s2.status !== 404;
};
var { span: s0, xinSlot: tl } = I;

class o0 extends u {
  static initAttributes = { minLength: 8, goodLength: 12, indicatorColors: "#f00,#f40,#f80,#ef0,#8f0,#0a2" };
  descriptionColors = "#000,#000,#000,#000,#000,#fff";
  issues = { tooShort: true, short: true, noUpper: true, noLower: true, noNumber: true, noSpecial: true };
  issueDescriptions = { tooShort: "too short", short: "short", noUpper: "no upper case", noLower: "no lower case", noNumber: "no digits", noSpecial: "no unusual characters" };
  value = 0;
  strengthDescriptions = ["unacceptable", "very weak", "weak", "moderate", "strong", "very strong"];
  strength(i3) {
    return this.issues = { tooShort: i3.length < this.minLength, short: i3.length < this.goodLength, noUpper: !i3.match(/[A-Z]/), noLower: !i3.match(/[a-z]/), noNumber: !i3.match(/[0-9]/), noSpecial: !i3.match(/[^a-zA-Z0-9]/) }, this.issues.tooShort ? 0 : Object.values(this.issues).filter((l6) => !l6).length - 1;
  }
  async isBreached() {
    let i3 = this.querySelector("input")?.value;
    if (!i3 || typeof i3 !== "string")
      return true;
    return await nl(i3);
  }
  updateIndicator = (i3) => {
    let { level: l6, description: s2 } = this.parts, o3 = this.indicatorColors.split(","), h3 = this.descriptionColors.split(","), r2 = this.strength(i3);
    if (this.value !== r2)
      this.value = r2, this.dispatchEvent(new Event("change"));
    l6.style.width = `${(r2 + 1) * 16.67}%`, this.style.setProperty("--indicator-color", o3[r2]), this.style.setProperty("--description-color", h3[r2]), s2.textContent = this.strengthDescriptions[r2];
  };
  update = (i3) => {
    let l6 = i3.target.closest("input");
    this.updateIndicator(l6?.value || "");
  };
  content = () => [tl({ onInput: this.update }), s0({ part: "meter" }, s0({ part: "level" }), s0({ part: "description" }))];
  render() {
    super.render();
    let i3 = this.querySelector("input");
    this.updateIndicator(i3?.value);
  }
}
var cl = o0.elementCreator({ tag: "tosi-password-strength", styleSpec: { ":host": { display: "inline-flex", flexDirection: "column", gap: fM.spacing50, position: "relative" }, ":host xin-slot": { display: "flex" }, ':host [part="meter"]': { display: "block", position: "relative", height: kE.meterHeight("24px"), background: kE.indicatorBg("white"), borderRadius: kE.meterRadius("4px"), boxShadow: kE.meterShadow(`inset 0 0 0 2px ${fM.indicatorColor}`) }, ':host [part="level"]': { height: kE.levelHeight("20px"), content: '" "', display: "inline-block", width: 0, transition: "0.15s ease-out", background: fM.indicatorColor, margin: kE.levelMargin("2px"), borderRadius: kE.levelRadius("2px") }, ':host [part="description"]': { position: "absolute", inset: "0", color: fM.descriptionColor, height: kE.meterHeight("24px"), lineHeight: kE.meterHeight("24px"), textAlign: "center" } } });
var { span: h0 } = I;

class r0 extends u {
  static formAssociated = true;
  static initAttributes = { max: 5, min: 1, icon: "star", step: 1, ratingStroke: "#e81", ratingFill: "#f91", emptyStroke: "none", emptyFill: "#ccc", readonly: false, iconSize: 24, hollow: false, required: false, name: "" };
  value = "";
  formDisabledCallback(i3) {
    this.readonly = i3;
  }
  formResetCallback() {
    this.value = "";
  }
  static styleSpec = { ":host": { display: "inline-block", position: "relative", width: "fit-content" }, ":host::part(container)": { position: "relative", display: "inline-block" }, ":host::part(empty), :host::part(filled)": { height: "100%", whiteSpace: "nowrap", overflow: "hidden" }, ":host::part(empty)": { pointerEvents: "none" }, ":host::part(filled)": { position: "absolute", left: 0, transition: "width 0.15s ease-out" }, ":host svg": { transform: "scale(0.9)", pointerEvents: "all !important", transition: "0.25s ease-in-out" }, ":host svg:hover": { transform: "scale(1)" }, ":host svg:active": { transform: "scale(1.1)" } };
  content = () => h0({ part: "container" }, h0({ part: "empty" }), h0({ part: "filled" }));
  displayValue(i3) {
    let { empty: l6, filled: s2 } = this.parts, h3 = Math.round((typeof i3 === "string" ? 0 : i3 || 0) / this.step) * this.step;
    s2.style.width = h3 / this.max * l6.offsetWidth + "px";
  }
  update = (i3) => {
    if (this.readonly)
      return;
    let { empty: l6 } = this.parts, s2 = i3 instanceof MouseEvent ? i3.pageX - l6.getBoundingClientRect().x : 0, o3 = Math.min(Math.max(this.min, Math.round(s2 / l6.offsetWidth * this.max / this.step + this.step * 0.5) * this.step), this.max);
    if (i3.type === "click")
      this.value = o3;
    else if (i3.type === "mousemove")
      this.displayValue(o3);
    else
      this.displayValue(this.value || 0);
  };
  handleKey = (i3) => {
    let l6 = this.value === "" ? NaN : Number(this.value);
    if (isNaN(l6))
      l6 = Math.round((this.min + this.max) * 0.5 * this.step) * this.step;
    let s2 = false;
    switch (i3.key) {
      case "ArrowUp":
      case "ArrowRight":
        l6 += this.step, s2 = true;
        break;
      case "ArrowDown":
      case "ArrowLeft":
        l6 -= this.step, s2 = true;
        break;
    }
    if (this.value = Math.max(Math.min(l6, this.max), this.min), s2)
      i3.stopPropagation(), i3.preventDefault();
  };
  connectedCallback() {
    super.connectedCallback();
    let { container: i3 } = this.parts;
    i3.tabIndex = 0, i3.addEventListener("mousemove", this.update, true), i3.addEventListener("mouseleave", this.update), i3.addEventListener("blur", this.update), i3.addEventListener("click", this.update), i3.addEventListener("keydown", this.handleKey);
  }
  _renderedIcon = "";
  render() {
    super.render();
    let i3 = this.iconSize + "px";
    if (this.style.setProperty("--tosi-icon-size", i3), this.readonly)
      this.role = "image";
    else
      this.role = "slider";
    this.ariaLabel = `rating ${this.value} out of ${this.max}`, this.ariaValueMax = String(this.max), this.ariaValueMin = String(this.min), this.ariaValueNow = this.value === "" ? String(-1) : String(this.value);
    let { empty: l6, filled: s2 } = this.parts;
    if (l6.classList.toggle("hollow", this.hollow), l6.style.setProperty("--tosi-icon-fill", this.emptyFill), l6.style.setProperty("--tosi-icon-stroke", this.emptyStroke), s2.style.setProperty("--tosi-icon-fill", this.ratingFill), s2.style.setProperty("--tosi-icon-stroke", this.ratingStroke), this._renderedIcon !== this.icon) {
      this._renderedIcon = this.icon;
      for (let o3 = 0;o3 < this.max; o3++)
        l6.append(t3[this.icon]()), s2.append(t3[this.icon]());
    }
    this.displayValue(this.value);
  }
}
var Cl = r0.elementCreator({ tag: "tosi-rating" });
var rs = gE((...i3) => Cl(...i3), "xinRating is deprecated, use tosiRating instead (tag is now <tosi-rating>)");
var { xinSlot: H4, div: wl, button: vl, span: j4 } = I;
var Ml = [{ caption: "Title", tagType: "H1" }, { caption: "Heading", tagType: "H2" }, { caption: "Subheading", tagType: "H3" }, { caption: "Minor heading", tagType: "H4" }, { caption: "Body", tagType: "P" }, { caption: "Code Block", tagType: "PRE" }];
function A4(i3 = Ml) {
  return X3({ title: "paragraph style", slot: "toolbar", class: "block-style", options: i3.map(({ caption: l6, tagType: s2 }) => ({ caption: l6, value: `formatBlock,${s2}` })) });
}
function Y1(i3 = "10px") {
  return j4({ slot: "toolbar", style: { flex: `0 0 ${i3}`, content: " " } });
}
function S3(i3, l6, s2) {
  return vl({ slot: "toolbar", dataCommand: l6, title: i3 }, s2);
}
var Bl = () => [S3("left-justify", "justifyLeft", t3.alignLeft()), S3("center", "justifyCenter", t3.alignCenter()), S3("right-justify", "justifyRight", t3.alignRight()), Y1(), S3("bullet list", "insertUnorderedList", t3.listBullet()), S3("numbered list", "insertOrderedList", t3.listNumber()), Y1(), S3("indent", "indent", t3.indent()), S3("indent", "outdent", t3.outdent())];
var F4 = () => [S3("bold", "bold", t3.fontBold()), S3("italic", "italic", t3.fontItalic()), S3("underline", "underline", t3.fontUnderline())];
var zl = () => [A4(), Y1(), ...F4()];
var Hl = () => [A4(), Y1(), ...Bl(), Y1(), ...F4()];

class y0 extends u {
  static formAssociated = true;
  static initAttributes = { widgets: "default", name: "", required: false };
  isInitialized = false;
  savedValue = "";
  formDisabledCallback(i3) {
    if (this.isInitialized)
      this.parts.doc.contentEditable = i3 ? "false" : "true";
  }
  formResetCallback() {
    this.value = "";
  }
  _value = "";
  get value() {
    return this.isInitialized ? this.parts.doc.innerHTML : this._value;
  }
  set value(i3) {
    let l6 = this._value;
    if (this._value = i3, this.isInitialized) {
      if (this.parts.doc.innerHTML !== i3)
        this.parts.doc.innerHTML = i3;
    }
    if (l6 !== i3 && this.internals)
      this.internals.setFormValue(i3);
  }
  blockElement(i3) {
    let { doc: l6 } = this.parts;
    while (i3.parentElement !== null && i3.parentElement !== l6)
      i3 = i3.parentElement;
    return i3.parentElement === l6 ? i3 : undefined;
  }
  get selectedBlocks() {
    let { doc: i3 } = this.parts, l6 = window.getSelection();
    if (l6 === null)
      return [];
    let s2 = [];
    for (let o3 = 0;o3 < l6.rangeCount; o3++) {
      let h3 = l6.getRangeAt(o3);
      if (!i3.contains(h3.commonAncestorContainer))
        continue;
      let r2 = this.blockElement(h3.startContainer), y2 = this.blockElement(h3.endContainer);
      s2.push(r2);
      while (r2 !== y2 && r2 !== null)
        r2 = r2.nextElementSibling, s2.push(r2);
    }
    return s2;
  }
  get selectedText() {
    let i3 = window.getSelection();
    if (i3 === null)
      return "";
    return this.selectedBlocks.length ? i3.toString() : "";
  }
  selectionChange = () => {};
  _updatingBlockStyle = false;
  handleSelectChange = (i3) => {
    if (this._updatingBlockStyle)
      return;
    let s2 = i3.target?.closest(T3.tagName);
    if (s2 == null)
      return;
    this.doCommand(s2.value);
  };
  handleButtonClick = (i3) => {
    let s2 = i3.target?.closest("button");
    if (s2 == null)
      return;
    this.doCommand(s2.dataset.command);
  };
  content = [H4({ name: "toolbar", part: "toolbar", onClick: this.handleButtonClick, onChange: this.handleSelectChange }), wl({ part: "doc", contenteditable: true, style: { flex: "1 1 auto", outline: "none" } }), H4({ part: "content" })];
  doCommand(i3) {
    if (i3 === undefined)
      return;
    let l6 = i3.split(",");
    console.log("execCommand", l6[0], false, ...l6.slice(1)), document.execCommand(l6[0], false, ...l6.slice(1));
  }
  updateBlockStyle() {
    let i3 = this.parts.toolbar.querySelector(".block-style");
    if (i3 === null)
      return;
    let l6 = this.selectedBlocks.map((s2) => s2.tagName);
    l6 = [...new Set(l6)], this._updatingBlockStyle = true, i3.value = l6.length === 1 ? `formatBlock,${l6[0]}` : "", this._updatingBlockStyle = false;
  }
  hasContent() {
    return (this.parts.doc.textContent || "").trim().length > 0;
  }
  handleInput = () => {
    if (this.internals)
      this.internals.setFormValue(this.parts.doc.innerHTML), this.updateValidity();
  };
  updateValidity() {
    if (this.internals)
      if (this.required && !this.hasContent())
        this.internals.setValidity({ valueMissing: true }, "Please enter some content", this.parts.doc);
      else
        this.internals.setValidity({});
  }
  connectedCallback() {
    super.connectedCallback();
    let { doc: i3, content: l6 } = this.parts;
    if (l6.innerHTML !== "" && i3.innerHTML === "")
      i3.innerHTML = l6.innerHTML, l6.innerHTML = "";
    this.isInitialized = true, l6.style.display = "none", i3.addEventListener("input", this.handleInput), this.updateValidity(), document.addEventListener("selectionchange", (s2) => {
      this.updateBlockStyle(), this.selectionChange(s2, this);
    });
  }
  render() {
    let { toolbar: i3 } = this.parts;
    if (super.render(), i3.children.length === 0)
      switch (this.widgets) {
        case "minimal":
          i3.append(...zl());
          break;
        case "default":
          i3.append(...Hl());
          break;
      }
  }
}
var jl = y0.elementCreator({ tag: "tosi-rich-text", styleSpec: { ":host": { display: "flex", flexDirection: "column", height: "100%" }, ':host [part="toolbar"]': { padding: 4, display: "flex", gap: "0px", flex: "0 0 auto", flexWrap: "wrap" }, ':host [part="toolbar"] > button': { _xinIconSize: 18 } } });
var fs = gE((...i3) => jl(...i3), "richText is deprecated, use tosiRichText instead (tag is now <tosi-rich-text>)");
var { div: Vl, slot: Ll, label: _l, span: Ol, input: q4 } = I;

class N1 extends u {
  static formAssociated = true;
  static initAttributes = { direction: "row", other: "", multiple: false, name: "", placeholder: "Please specify…", localized: false, required: false };
  _choices = [];
  get choices() {
    return this._choices;
  }
  set choices(i3) {
    if (typeof i3 === "string")
      this._choices = N1.parseChoicesString(i3);
    else
      this._choices = i3;
    this.queueRender();
  }
  static parseChoicesString(i3) {
    return i3.split(",").filter((l6) => l6.trim() !== "").map((l6) => {
      let [s2, o3] = l6.split("=").map((e2) => e2.trim()), [h3, r2] = (o3 || s2).split(":").map((e2) => e2.trim()), y2 = r2 ? t3[r2]() : "";
      return { value: s2, icon: y2, caption: h3 };
    });
  }
  value = "";
  formDisabledCallback(i3) {}
  formResetCallback() {
    this.value = "";
  }
  get values() {
    return (this.value || "").split(",").map((i3) => i3.trim()).filter((i3) => i3 !== "");
  }
  content = () => [Ll(), Vl({ part: "options" }, q4({ part: "custom", hidden: true }))];
  static styleSpec = { ":host": { display: "inline-flex", gap: kE.segmentedOptionGap("8px"), alignItems: kE.segmentedAlignItems("center") }, ":host, :host::part(options)": { flexDirection: kE.segmentedDirection("row") }, ":host label": { display: "inline-grid", alignItems: "center", gap: kE.segmentedOptionGap("8px"), gridTemplateColumns: kE.segmentedOptionGridColumns("0px 24px 1fr"), padding: kE.segmentedOptionPadding("4px 12px"), font: kE.segmentedOptionFont("16px") }, ":host label:focus": { outline: "none", boxShadow: kE.segmentedFocusShadow(`inset 0 0 0 2px ${kE.segmentedOptionCurrentBackground("#44a")}`), borderRadius: kE.segmentedOptionsBorderRadius("8px") }, ":host label:has(:checked)": { color: kE.segmentedOptionCurrentColor("#eee"), background: kE.segmentedOptionCurrentBackground("#44a") }, ":host label:has(:checked):focus": { boxShadow: kE.segmentedCurrentFocusShadow(`inset 0 0 0 2px ${kE.segmentedOptionCurrentColor("#eee")}`) }, ":host svg": { height: kE.segmentOptionIconSize("16px"), stroke: kE.segmentedOptionIconColor("currentColor") }, ":host label.no-icon": { gap: 0, gridTemplateColumns: kE.segmentedOptionGridColumns("0px 1fr") }, ':host input[type="radio"], :host input[type="checkbox"]': { visibility: kE.segmentedInputVisibility("hidden") }, ":host::part(options)": { display: "flex", borderRadius: kE.segmentedOptionsBorderRadius("8px"), background: kE.segmentedOptionsBackground("#fff"), color: kE.segmentedOptionColor("#222"), overflow: "hidden", alignItems: kE.segmentedOptionAlignItems("stretch") }, ":host::part(custom)": { padding: kE.segmentedOptionPadding("4px 12px"), color: kE.segmentedOptionCurrentColor("#eee"), background: kE.segmentedOptionCurrentBackground("#44a"), font: kE.segmentedOptionFont("16px"), border: "0", outline: "none" }, ":host::part(custom)::placeholder": { color: kE.segmentedOptionCurrentColor("#eee"), opacity: kE.segmentedPlaceholderOpacity(0.75) } };
  valueChanged = false;
  handleChange = () => {
    let { options: i3, custom: l6 } = this.parts;
    if (this.multiple) {
      let s2 = [...i3.querySelectorAll("input:checked")];
      this.value = s2.map((o3) => o3.value).join(",");
    } else {
      let s2 = i3.querySelector("input:checked");
      if (!s2)
        this.value = "";
      else if (s2.value)
        l6.setAttribute("hidden", ""), this.value = s2.value;
      else
        l6.removeAttribute("hidden"), l6.focus(), l6.select(), this.value = l6.value;
    }
    this.valueChanged = true;
  };
  handleKey = (i3) => {
    let l6 = false;
    switch (i3.code) {
      case "Space":
        if (i3.target instanceof HTMLLabelElement)
          i3.target.click(), l6 = true;
        break;
      case "Tab":
        if (!(i3.target instanceof HTMLLabelElement))
          i3.target.closest("label").focus();
        break;
      case "ArrowLeft":
      case "ArrowUp":
        {
          let s2 = i3.target.closest("label");
          if (s2.previousElementSibling instanceof HTMLLabelElement)
            s2.previousElementSibling.focus();
        }
        l6 = true;
        break;
      case "ArrowRight":
      case "ArrowDown":
        {
          let s2 = i3.target.closest("label");
          if (s2.nextElementSibling instanceof HTMLLabelElement)
            s2.nextElementSibling.focus();
        }
        l6 = true;
        break;
    }
    if (l6)
      i3.preventDefault(), i3.stopPropagation();
  };
  connectedCallback() {
    super.connectedCallback();
    let i3 = this.getAttribute("choices");
    if (i3 && this._choices.length === 0)
      this._choices = N1.parseChoicesString(i3);
    let { options: l6 } = this.parts;
    if (this.name === "")
      this.name = this.instanceId;
    if (l6.addEventListener("change", this.handleChange), l6.addEventListener("keydown", this.handleKey), this.other && this.multiple)
      console.warn(this, "is set to [other] and [multiple]; [other] will be ignored"), this.other = "";
  }
  get _choicesWithOther() {
    let i3 = [...this.choices];
    if (this.other && !this.multiple) {
      let [l6, s2] = this.other.split(":");
      i3.push({ value: "", caption: l6, icon: s2 });
    }
    return i3;
  }
  get isOtherValue() {
    return Boolean(this.value === "" || this.value && !this._choicesWithOther.find((i3) => i3.value === this.value));
  }
  render() {
    if (super.render(), this.valueChanged) {
      this.valueChanged = false;
      return;
    }
    let { options: i3, custom: l6 } = this.parts;
    i3.textContent = "";
    let s2 = this.multiple ? "checkbox" : "radio", { values: o3, isOtherValue: h3 } = this;
    if (i3.append(...this._choicesWithOther.map((r2) => {
      return _l({ tabindex: 0 }, q4({ type: s2, name: this.name, value: r2.value, checked: o3.includes(r2.value) || r2.value === "" && h3, tabIndex: -1 }), r2.icon || { class: "no-icon" }, this.localized ? l1(r2.caption) : Ol(r2.caption));
    })), this.other && !this.multiple)
      l6.hidden = !h3, l6.value = h3 ? this.value : "", l6.placeholder = this.placeholder, i3.append(l6);
  }
}
var Pl = N1.elementCreator({ tag: "tosi-segmented" });
var Ms = gE((...i3) => Pl(...i3), "xinSegmented is deprecated, use tosiSegmented instead (tag is now <tosi-segmented>)");
var { slot: V4 } = I;

class L4 extends u {
  static initAttributes = { minWidth: 0, minHeight: 0 };
  value = "normal";
  content = [V4({ part: "normal" }), V4({ part: "small", name: "small" })];
  static styleSpec = { ":host": { display: "inline-block", position: "relative" } };
  onResize = () => {
    let { normal: i3, small: l6 } = this.parts, s2 = this.offsetParent;
    if (!(s2 instanceof HTMLElement))
      return;
    else if (s2.offsetWidth < this.minWidth || s2.offsetHeight < this.minHeight)
      i3.hidden = true, l6.hidden = false, this.value = "small";
    else
      i3.hidden = false, l6.hidden = true, this.value = "normal";
  };
  connectedCallback() {
    super.connectedCallback(), globalThis.addEventListener("resize", this.onResize);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), globalThis.removeEventListener("resize", this.onResize);
  }
}
var js = L4.elementCreator({ tag: "tosi-sizebreak" });

class e0 extends u {
  target = null;
  static styleSpec = { ":host": { _resizeIconFill: "#222", display: "block", position: "absolute", bottom: -7, right: -7, padding: 14, width: 44, height: 44, opacity: 0.25, transition: "opacity 0.25s ease-out" }, ":host(:hover)": { opacity: 0.5 }, ":host svg": { width: 16, height: 16, stroke: fM.resizeIconFill } };
  content = t3.resize();
  get minSize() {
    let { minWidth: i3, minHeight: l6 } = getComputedStyle(this.target);
    return { width: parseFloat(i3) || 32, height: parseFloat(l6) || 32 };
  }
  resizeTarget = (i3) => {
    let { target: l6 } = this;
    if (!l6)
      return;
    let { offsetWidth: s2, offsetHeight: o3 } = l6;
    l6.style.left = l6.offsetLeft + "px", l6.style.top = l6.offsetTop + "px", l6.style.bottom = "", l6.style.right = "";
    let { minSize: h3 } = this;
    G2(i3, (r2, y2, e2) => {
      if (l6.style.width = Math.max(h3.width, s2 + r2) + "px", l6.style.height = Math.max(h3.height, o3 + y2) + "px", e2.type === "mouseup")
        return true;
    }, "nwse-resize");
  };
  connectedCallback() {
    if (super.connectedCallback(), !this.target)
      this.target = this.parentElement;
    let i3 = { passive: true };
    this.addEventListener("mousedown", this.resizeTarget, i3), this.addEventListener("touchstart", this.resizeTarget, i3);
  }
}
var Gl = e0.elementCreator({ tag: "tosi-sizer" });
var { div: Zl, input: Xl, span: Kl, button: x0 } = I;

class y2 extends u {
  static initAttributes = { caption: "", removeable: false };
  removeCallback = () => {
    this.remove();
  };
  content = () => [Kl({ part: "caption" }, this.caption), x0(t3.x(), { type: "button", part: "remove", hidden: !this.removeable, ariaLabel: `Remove ${this.caption}`, onClick: this.removeCallback })];
}
var P4 = y2.elementCreator({ tag: "tosi-tag", styleSpec: { ":host": { "--tag-close-button-color": "#000c", "--tag-close-button-bg": "#fffc", "--tag-button-opacity": "0.5", "--tag-button-hover-opacity": "0.75", "--tag-bg": kE.brandColor("blue"), "--tag-text-color": kE.brandTextColor("white"), display: "inline-flex", borderRadius: kE.tagRoundedRadius(fM.spacing50), color: fM.tagTextColor, background: fM.tagBg, padding: `0 ${fM.spacing75} 0 ${fM.spacing75}`, height: `calc(${fM.lineHeight} + ${fM.spacing50})`, lineHeight: `calc(${fM.lineHeight} + ${fM.spacing50})` }, ':host > [part="caption"]': { position: "relative", whiteSpace: "nowrap", overflow: "hidden", flex: "1 1 auto", fontSize: kE.fontSize("16px"), color: fM.tagTextColor, textOverflow: "ellipsis" }, ':host [part="remove"]': { boxShadow: "none", margin: `0 ${fM.spacing_50} 0 ${fM.spacing25}`, padding: 0, display: "inline-flex", alignItems: "center", alignSelf: "center", justifyContent: "center", height: fM.spacing150, width: fM.spacing150, color: fM.tagCloseButtonColor, background: fM.tagCloseButtonBg, borderRadius: kE.tagCloseButtonRadius("99px"), opacity: fM.tagButtonOpacity }, ':host [part="remove"]:hover': { background: fM.tagCloseButtonBg, opacity: fM.tagButtonHoverOpacity } } });
var Zs = gE((...i3) => P4(...i3), "xinTag is deprecated, use tosiTag instead (tag is now <tosi-tag>)");

class W1 extends u {
  static formAssociated = true;
  static initAttributes = { name: "", textEntry: false, editable: false, placeholder: "enter tags", disabled: false, required: false };
  value = "";
  get tags() {
    return this.value.split(",").map((i3) => i3.trim()).filter((i3) => i3 !== "");
  }
  set tags(i3) {
    this.value = i3.join(",");
  }
  _availableTags = [];
  get availableTags() {
    return this._availableTags;
  }
  set availableTags(i3) {
    if (typeof i3 === "string")
      this._availableTags = W1.parseAvailableTagsString(i3);
    else
      this._availableTags = i3;
    this.queueRender();
  }
  static parseAvailableTagsString(i3) {
    return i3.split(",").map((l6) => {
      let s2 = l6.trim();
      return s2 === "" ? null : s2;
    });
  }
  connectedCallback() {
    super.connectedCallback();
    let i3 = this.getAttribute("available-tags");
    if (i3 && this._availableTags.length === 0)
      this._availableTags = W1.parseAvailableTagsString(i3);
  }
  formDisabledCallback(i3) {
    this.disabled = i3;
  }
  formResetCallback() {
    this.value = "";
  }
  addTag = (i3) => {
    let l6 = i3.trim();
    if (l6 === "" || this.tags.includes(l6))
      return;
    this.tags = [...this.tags, l6], this.queueRender(true);
  };
  toggleTag = (i3) => {
    if (this.tags.includes(i3))
      this.tags = this.tags.filter((l6) => l6 !== i3), this.queueRender(true);
    else
      this.addTag(i3);
  };
  enterTag = (i3) => {
    let { tagInput: l6 } = this.parts;
    switch (i3.key) {
      case ",":
        {
          let s2 = l6.value.split(",")[0];
          this.addTag(s2);
        }
        break;
      case "Enter":
        {
          let s2 = l6.value.split(",")[0];
          this.addTag(s2);
        }
        i3.stopPropagation(), i3.preventDefault();
        break;
      default:
    }
  };
  popSelectMenu = () => {
    let { toggleTag: i3 } = this, { tagMenu: l6 } = this.parts, s2 = [...this.availableTags], o3 = this.tags.filter((r2) => !s2.includes(r2));
    if (o3.length)
      s2.push(null, ...o3);
    let h3 = s2.map((r2) => {
      if (r2 === "" || r2 === null)
        return null;
      else if (typeof r2 === "object")
        return { checked: () => this.tags.includes(r2.value), caption: r2.caption, action() {
          i3(r2.value);
        } };
      else
        return { checked: () => this.tags.includes(r2), caption: r2, action() {
          i3(r2);
        } };
    });
    J2({ target: l6, width: "auto", menuItems: h3 });
  };
  content = () => [x0({ type: "button", style: { visibility: "hidden" }, tabindex: -1 }), Zl({ part: "tagContainer", class: "row", role: "list", ariaLabel: "Selected tags" }), Xl({ part: "tagInput", class: "elastic", ariaLabel: "Enter new tag", onKeydown: this.enterTag }), x0({ type: "button", title: "add tag", ariaLabel: "Select tags from list", ariaHaspopup: "listbox", part: "tagMenu", onClick: this.popSelectMenu }, t3.chevronDown())];
  removeTag = (i3) => {
    if (this.editable && !this.disabled) {
      let l6 = i3.target.closest(y2.tagName);
      this.tags = this.tags.filter((s2) => s2 !== l6.caption), l6.remove(), this.queueRender(true);
    }
    i3.stopPropagation(), i3.preventDefault();
  };
  render() {
    super.render();
    let { tagContainer: i3, tagMenu: l6, tagInput: s2 } = this.parts;
    if (l6.disabled = this.disabled, s2.value = "", s2.setAttribute("placeholder", this.placeholder), this.editable && !this.disabled)
      l6.toggleAttribute("hidden", false), s2.toggleAttribute("hidden", !this.textEntry);
    else
      l6.toggleAttribute("hidden", true), s2.toggleAttribute("hidden", true);
    i3.textContent = "";
    for (let o3 of this.tags)
      i3.append(P4({ caption: o3, removeable: this.editable && !this.disabled, removeCallback: this.removeTag }));
  }
}
var Yl = W1.elementCreator({ tag: "tosi-tag-list", styleSpec: { ":host": { "--tag-list-bg": "#f8f8f8", "--touch-size": "44px", "--spacing": "16px", display: "grid", gridTemplateColumns: "auto", alignItems: "center", background: fM.tagListBg, gap: fM.spacing25, borderRadius: kE.taglistRoundedRadius(fM.spacing50), overflow: "hidden" }, ":host[editable]": { gridTemplateColumns: `0px auto ${fM.touchSize}` }, ":host[editable][text-entry]": { gridTemplateColumns: `0px 2fr 1fr ${fM.touchSize}` }, ':host [part="tagContainer"]': { display: "flex", content: '" "', alignItems: "center", background: fM.inputBg, borderRadius: kE.tagContainerRadius(fM.spacing50), boxShadow: fM.borderShadow, flexWrap: "nowrap", overflow: "auto hidden", gap: fM.spacing25, minHeight: `calc(${fM.lineHeight} + ${fM.spacing})`, padding: fM.spacing25 }, ':host [part="tagMenu"]': { width: fM.touchSize, height: fM.touchSize, lineHeight: fM.touchSize, textAlign: "center", padding: 0, margin: 0 }, ":host [hidden]": { display: "none !important" }, ':host button[part="tagMenu"]': { background: fM.brandColor, color: fM.brandTextColor } } });
var Ks = gE((...i3) => Yl(...i3), "xinTagList is deprecated, use tosiTagList instead (tag is now <tosi-tag-list>)");
var $4 = { accent: X.fromCss("#EE257B"), background: X.fromCss("#fafafa"), text: X.fromCss("#222222") };
var Dl = { _tosiSpacingXs: "4px", _tosiSpacingSm: "8px", _tosiSpacing: "12px", _tosiSpacingLg: "16px", _tosiSpacingXl: "24px", _tosiFontFamily: "system-ui, -apple-system, sans-serif", _tosiFontSize: "16px", _tosiLineHeight: "1.5", _tosiCodeFontFamily: "ui-monospace, monospace", _tosiCodeFontSize: "14px", _tosiTouchSize: "44px", _tosiBorderRadius: "4px", _tosiBorderRadiusLg: "8px", _tosiTransition: "0.15s ease-out" };
function El(i3) {
  let { accent: l6, background: s2, text: o3 } = i3, h3 = i3.accentText ?? l6.contrasting(), r2 = i3.backgroundInset ?? s2.darken(0.03), y3 = i3.border ?? o3.opacity(0.15), e2 = i3.shadow ?? o3.opacity(0.1), x3 = i3.focus ?? l6.opacity(0.5);
  return { _tosiAccent: l6, _tosiAccentLight: l6.brighten(0.15), _tosiAccentDark: l6.darken(0.15), _tosiAccentText: h3, _tosiBg: s2, _tosiBgInset: r2, _tosiBgHover: s2.darken(0.05), _tosiBgActive: s2.darken(0.1), _tosiText: o3, _tosiTextMuted: o3.opacity(0.6), _tosiTextDisabled: o3.opacity(0.4), _tosiBorder: y3, _tosiBorderFocus: l6, _tosiShadow: e2, _tosiShadowColor: e2, _tosiFocusRing: `0 0 0 2px ${x3}`, _tosiInputBg: s2, _tosiInputBorder: y3, _tosiInputBorderFocus: l6, _tosiButtonBg: s2, _tosiButtonText: o3, _tosiButtonBorder: y3, _tosiButtonHoverBg: s2.darken(0.05), _tosiButtonActiveBg: l6, _tosiButtonActiveText: h3 };
}
function t0(i3) {
  return { ":root": { ...Dl, ...El(i3) } };
}
function Il(i3) {
  let s2 = t0(i3)[":root"];
  return { ":root": rL(s2) };
}
var Is = t0($4);
var us = Il($4);
var ul = { "--xin-icon-size": fM.tosiIconSize, "--xin-icon-fill": fM.tosiIconFill, "--xin-icon-stroke": fM.tosiIconStroke, "--xin-tabs-bar-color": fM.tosiTabsBarColor, "--xin-tabs-bar-height": fM.tosiTabsBarHeight, "--xin-tabs-selected-color": fM.tosiTabsSelectedColor, "--spacing": fM.tosiSpacing, "--gap": fM.tosiSpacingSm, "--touch-size": fM.tosiTouchSize, "--background": fM.tosiBg, "--text-color": fM.tosiText, "--brand-color": fM.tosiAccent, "--brand-text-color": fM.tosiAccentText };

// demo/index.ts
var { div: div2, header, footer, nav, h1: h12, h2: h22, p: p3, span, a: a5, video } = I;
var HMB = { lat: 37.4636, lng: -122.4286 };
var OULU = { lat: 65.0121, lng: 25.4651 };
var MAPBOX_TOKEN = "pk.eyJ1IjoicG9kcGVyc29uIiwiYSI6ImNqc2JlbWU0bjA1ZmY0YW5ycHZod3VhbWcifQ.arvqfpOqMgFYkKgQ35UScA";
var ease = (t5) => t5 < 0.5 ? 2 * t5 * t5 : -1 + (4 - 2 * t5) * t5;
var themes = {
  midnight: {
    "--bg": "#08081a",
    "--fg": "#f0f0f5",
    "--muted": "#a0a0b8",
    "--accent": "#9be7ff",
    "--surface": "rgba(255,255,255,0.06)",
    "--border": "rgba(255,255,255,0.12)",
    "--code-bg": "rgba(255,255,255,0.04)"
  },
  forest: {
    "--bg": "#0a1f14",
    "--fg": "#e8f5ee",
    "--muted": "#9bbaa6",
    "--accent": "#7fdba0",
    "--surface": "rgba(255,255,255,0.06)",
    "--border": "rgba(255,255,255,0.12)",
    "--code-bg": "rgba(255,255,255,0.04)"
  },
  paper: {
    "--bg": "#f5f1e8",
    "--fg": "#1a1815",
    "--muted": "#6b6862",
    "--accent": "#7c3aed",
    "--surface": "rgba(0,0,0,0.04)",
    "--border": "rgba(0,0,0,0.08)",
    "--code-bg": "rgba(0,0,0,0.05)"
  },
  rose: {
    "--bg": "#2a0820",
    "--fg": "#ffeef5",
    "--muted": "#d8a8c0",
    "--accent": "#ff80b5",
    "--surface": "rgba(255,255,255,0.06)",
    "--border": "rgba(255,255,255,0.12)",
    "--code-bg": "rgba(255,255,255,0.04)"
  }
};
var style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: 0;
    background: var(--bg, #000);
    color: var(--fg, #fff);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    transition: background-color 0.25s linear;
  }

  /* === Page chrome === */
  .page-header, .page-footer, .sticky-bar {
    background: var(--bg);
    color: var(--fg);
    transition:
      background-color 0.25s linear,
      color 0.25s linear,
      border-color 0.25s linear;
  }
  .page-header {
    border-bottom: 1px solid var(--border);
    padding: 1rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .page-header .brand { font-weight: 700; font-size: 1.1rem; }
  .page-header nav { display: flex; gap: 1.25rem; }
  .page-header nav a {
    color: var(--muted); text-decoration: none; font-size: 0.9rem;
    transition: color 0.2s ease;
  }
  .page-header nav a:hover { color: var(--accent); }

  .sticky-bar {
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0.7rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .sticky-bar .brand { font-weight: 700; font-size: 1rem; }
  .sticky-bar .progress {
    font-family: monospace; font-size: 0.8rem; color: var(--muted);
  }

  .page-footer {
    border-top: 1px solid var(--border);
    padding: 3rem 2rem;
    text-align: center; color: var(--muted);
  }
  .page-footer p { margin: 0; }
  .page-footer a { color: var(--accent); text-decoration: none; }

  /* === Scenes === */
  .scene {
    height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem; text-align: center; position: relative;
    background: var(--bg); color: var(--fg);
    transition: background-color 0.25s linear, color 0.25s linear;
  }
  .scene h1 {
    font-size: clamp(2.5rem, 9vw, 6rem); margin: 0 0 0.2em; font-weight: 800;
    letter-spacing: -0.02em;
  }
  .scene h2 {
    font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 0.4em; font-weight: 800;
  }
  .scene p {
    font-size: clamp(1rem, 1.6vw, 1.25rem); color: var(--muted);
    max-width: 580px; margin: 0;
  }
  .scene .pill {
    display: inline-block; margin-top: 1.5em;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--accent); font-family: monospace; font-size: 0.85rem;
    padding: 0.5em 1.2em; border-radius: 999px;
  }

  /* === Markdown intro blocks === */
  .intro {
    background: var(--bg); color: var(--fg);
    padding: clamp(3rem, 10vh, 7rem) 1.5rem;
    display: flex; justify-content: center;
    transition: background-color 0.25s linear, color 0.25s linear;
  }
  .intro tosi-md {
    display: block; max-width: 640px;
    line-height: 1.7; font-size: clamp(1rem, 1.55vw, 1.15rem);
  }
  .intro tosi-md h2 {
    font-size: clamp(1.6rem, 3.5vw, 2.4rem); margin: 0 0 0.6em; font-weight: 800;
  }
  .intro tosi-md p { color: var(--muted); margin: 0 0 1em; }
  .intro tosi-md p:last-child { margin: 0; }
  .intro tosi-md strong { color: var(--fg); }
  .intro tosi-md code {
    background: var(--code-bg); padding: 0.12em 0.4em;
    border-radius: 4px; font-size: 0.9em;
    font-family: Consolas, Monaco, "Courier New", monospace;
  }

  /* === Staged reveal feature list === */
  .feature-list {
    display: flex; flex-direction: column; align-items: flex-start;
    gap: 0.5em; max-width: 580px; padding: 0 1.5rem;
  }
  .feature-list h2, .feature-list p { text-align: left; }
  .feature-row {
    font-size: 1.05rem;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 0.7em 1.1em; margin-top: 0.3em;
    font-family: monospace; color: var(--fg);
  }

  /* === Embedded vertical scroll region === */
  .embed-host {
    background: var(--bg); padding: clamp(2rem, 5vh, 4rem) 1.5rem;
    transition: background-color 0.25s linear;
  }
  .embed-host h2 {
    text-align: center; max-width: 720px; margin: 0 auto 0.4em;
    font-size: clamp(1.5rem, 4vw, 2.2rem);
  }
  .embed-host > p {
    text-align: center; max-width: 560px; margin: 0 auto 2em;
    color: var(--muted);
  }
  .embed-frame {
    height: 60vh; max-width: 880px; margin: 0 auto;
    border: 1px solid var(--border); border-radius: 14px;
    overflow: hidden; background: var(--surface);
  }
  .embed-frame.scroll-y { overflow-y: auto; overflow-x: hidden; }
  .embed-frame.scroll-y::-webkit-scrollbar { width: 8px; }
  .embed-frame.scroll-y::-webkit-scrollbar-thumb {
    background: var(--border); border-radius: 4px;
  }
  .inner-scene {
    /* Use the engine's view size so each inner section pins to a full card,
       independent of the document viewport. */
    height: var(--tosi-view-size, 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 2rem; text-align: center;
    color: var(--fg);
  }
  .inner-scene h3 {
    font-size: clamp(1.4rem, 3.5vw, 2rem); margin: 0 0 0.3em;
    background: linear-gradient(180deg, var(--fg), var(--muted));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .inner-scene p {
    color: var(--fg); max-width: 460px; margin: 0;
    opacity: 0.85; font-size: 1rem;
  }
  .h-card {
    /* Size to the engine's view size (engine writes --tosi-view-size).
       Avoids the 100vw / flex-max-content collapse problem when nested. */
    width: var(--tosi-view-size, 100%); height: 100%; flex-shrink: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem; text-align: center; color: #fff;
    white-space: normal;
  }
  .h-card h3 { font-size: 1.8rem; margin: 0 0 0.3em; }
  .h-card p { max-width: 320px; opacity: 0.9; }

  /* === Hero scroll-down arrow uses the theme accent === */
  .hero-pill {
    position: absolute; left: 50%; bottom: 6vh; transform: translateX(-50%);
    color: var(--muted); font-size: 0.7rem;
    letter-spacing: 0.25em; text-transform: uppercase;
  }

  /* === Full-bleed media scene === */
  .media-scene {
    position: relative;
    height: var(--tosi-view-size, 100vh);
    overflow: hidden;
    background: #000;
  }
  .media-scene > video,
  .media-scene > tosi-filmstrip,
  .media-scene > tosi-map {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  /* Lottie SVGs don't object-fit — center it at a contained size and let
     the scene background show through. */
  .media-scene.lottie {
    background: radial-gradient(ellipse at center, #0a0a18 0%, #000 100%);
  }
  .media-scene > tosi-lottie {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: min(70vh, 60vw);
    height: min(70vh, 60vw);
  }
  .media-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    pointer-events: none; text-align: center;
    color: #fff; padding: 2rem;
  }
  .media-overlay h2 {
    font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 0.3em; font-weight: 800;
    filter: drop-shadow(0 2px 12px rgba(0,0,0,0.85))
            drop-shadow(0 0 40px rgba(0,0,0,0.6));
  }
  .media-overlay p {
    color: #ddd; max-width: 560px; margin: 0;
    font-size: clamp(1rem, 1.6vw, 1.2rem);
    filter: drop-shadow(0 1px 6px rgba(0,0,0,0.9));
  }
`;
document.head.appendChild(style);
var pageHeader = header({ class: "page-header" }, div2({ class: "brand" }, "tosijs-product"), nav(a5({ href: "https://github.com/tonioloewald/tosijs-product" }, "GitHub"), a5({ href: "https://tosijs.net" }, "tosijs"), a5({ href: "#" }, "Examples")));
var stickyProgressLabel = span({ class: "progress" }, "0%");
var stickyHeader = tosiProductHeader({ threshold: 80 }, div2({ class: "sticky-bar" }, div2({ class: "brand" }, "tosijs-product"), stickyProgressLabel));
var pageFooter = footer({ class: "page-footer" }, p3("Built with ", a5({ href: "https://tosijs.net" }, "tosijs"), ". Source on ", a5({ href: "https://github.com/tonioloewald/tosijs-product" }, "GitHub"), "."));
var md = (markdown) => div2({ class: "intro" }, I9(markdown));
var mediaOverlay = (range, title, subtitle) => tosiInterpolator({ "data-scroll-animate": true, "data-scroll-range": range, easing: "ease-in-out" }, tosiWaypoint({
  progress: 0,
  style: { opacity: 0, transform: "translateY(20px)" }
}), tosiWaypoint({
  progress: 0.5,
  style: { opacity: 1, transform: "translateY(0px)" }
}), tosiWaypoint({
  progress: 1,
  style: { opacity: 0, transform: "translateY(-20px)" }
}), div2({ class: "media-overlay" }, h22(title), ...subtitle ? [p3(subtitle)] : []));
var stagedRow = (label, start, end) => tosiInterpolator({
  "data-scroll-animate": true,
  "data-scroll-range": `${start},${end}`,
  easing: "ease-in-out"
}, tosiWaypoint({
  progress: 0,
  style: { opacity: 0, transform: "translateX(-40px)" }
}), tosiWaypoint({
  progress: 0.5,
  style: { opacity: 1, transform: "translateX(0px)" }
}), tosiWaypoint({
  progress: 1,
  style: { opacity: 1, transform: "translateX(0px)" }
}), div2({ class: "feature-row" }, "✓ " + label));
var app = tosiProduct(tosiProductSection({ scroll: 100, theme: "midnight" }, div2({ class: "scene" }, tosiInterpolator({ "data-scroll-animate": true, easing: "ease-in-out" }, tosiWaypoint({
  progress: 0,
  style: { transform: "scale(1) translateY(0px)" }
}), tosiWaypoint({
  progress: 1,
  style: { transform: "scale(1.4) translateY(20px)" }
}), h12("tosijs-product")), p3("Build cinematic product pages with HTML."), div2({ class: "hero-pill" }, "scroll"))), md(`## What is tosijs-product?

A small library for building **scroll-driven product pages** — the cinematic, "Apple-style" pages where scrolling becomes the timeline.

You compose a stack of \`<tosi-product-section>\` elements inside a \`<tosi-product>\`. Each section claims a slice of scroll runway: it pins at the viewport top, animations run during pin, then it scrolls out at 1:1 as the next section takes over.

This whole page is one engine. Read on to see what each piece does.`), tosiProductSection({ scroll: 200, theme: "midnight" }, div2({ class: "scene" }, tosiInterpolator({ "data-scroll-animate": true, easing: "ease-in-out" }, tosiWaypoint({
  progress: 0,
  style: { opacity: 0, transform: "translateY(60px) scale(0.95)" }
}), tosiWaypoint({
  progress: 0.4,
  style: { opacity: 1, transform: "translateY(0px) scale(1)" }
}), tosiWaypoint({
  progress: 1,
  style: { opacity: 1, transform: "translateY(0px) scale(1)" }
}), h22("Interpolator")), p3("A waypoint timeline for any CSS property. Set keyframes by progress and let the engine drive the rest."), span({ class: "pill" }, "<tosi-interpolator>"))), md(`## Declarative interpolation

\`<tosi-interpolator>\` interpolates inline styles between \`<tosi-waypoint>\` keyframes as the section's progress moves from 0 to 1. Numbers in transforms, opacity, colors — anything CSS understands.

\`\`\`html
<tosi-interpolator data-scroll-animate>
  <tosi-waypoint progress="0" style="opacity: 0"></tosi-waypoint>
  <tosi-waypoint progress="1" style="opacity: 1"></tosi-waypoint>
  <div>I fade in.</div>
</tosi-interpolator>
\`\`\``), tosiProductSection({ scroll: 300, theme: "midnight" }, div2({ class: "scene" }, div2({ class: "feature-list" }, h22("Staged reveal"), p3("Multiple interpolators in one section, each scoped to a slice of progress with data-scroll-range:"), stagedRow("Sticky window pins the engine", 0.05, 0.2), stagedRow("Stack translates as you scroll", 0.2, 0.35), stagedRow("Sections pin then exit", 0.35, 0.5), stagedRow("Sub-range staging schedules the rest", 0.5, 0.65)))), md(`## Drive media with scroll

Interpolators handle CSS. For richer media — videos, vector animations, 3D scenes, maps — the engine forwards each section's progress to any descendant tagged with \`data-scroll-animate\`. The next few scenes show the built-in dispatchers in action.`), tosiProductSection({ scroll: 300, theme: "midnight" }, div2({ class: "media-scene" }, video({
  src: "assets/agent-owl.mp4",
  "data-scroll-animate": "currentTime",
  muted: true,
  playsinline: true,
  preload: "auto"
}), mediaOverlay("0,0.4", "Scrub video", 'data-scroll-animate="currentTime" maps progress to video.currentTime — frame-perfect scrubbing.'), mediaOverlay("0.5,1", "Native <video>, no plugin"))), md(`## Filmstrip mosaics

Video decoders aren't built for random seeking — scrubbing real video stutters. \`<tosi-filmstrip>\` solves this by packing every frame into a single WebP mosaic that the engine renders on a canvas. Use the bundled \`bunx tosi-mosaic\` CLI to encode a clip.

\`\`\`html
<tosi-filmstrip
  src="agent-owl_10x10_100.webp"
  data-scroll-animate>
</tosi-filmstrip>
\`\`\`

Grid dimensions and frame count are auto-detected from the filename suffix (\`_COLSxROWS_TOTAL\`).`), tosiProductSection({ scroll: 300, theme: "midnight" }, div2({ class: "media-scene" }, tosiFilmstrip({
  src: "assets/agent-owl_10x10_100.jpg",
  cols: 10,
  rows: 10,
  total: 100,
  "data-scroll-animate": "true"
}), mediaOverlay("0,0.4", "100 frames. One image.", "Zero video decode. Instant seeking. Works everywhere."), mediaOverlay("0.5,1", "Hardware-accelerated canvas blits"))), md(`## Lottie / Bodymovin

Scrub Bodymovin (Lottie) animations the same way as video. Tag a \`<tosi-lottie>\` with \`data-scroll-animate="lottie"\` and the engine drives it via \`animation.goToAndStop()\`. Pure SVG, vector-perfect at any zoom.

\`\`\`html
<tosi-lottie
  src="animation.json"
  data-scroll-animate="lottie">
</tosi-lottie>
\`\`\``), tosiProductSection({ scroll: 250, theme: "midnight" }, div2({ class: "media-scene lottie" }, M3({
  src: "assets/tosi-platform.json",
  "data-scroll-animate": "lottie",
  config: { renderer: "svg", autoplay: false, loop: false }
}), mediaOverlay("0,0.5", "Vector animation", "Bodymovin / Lottie JSON, scrubbed by scroll."), mediaOverlay("0.5,1", "Frame-perfect at every zoom"))), md(`## Mapbox fly-around

For more bespoke scroll-driven behavior, every section exposes a \`scrollCallback(progress, el)\` property. Below, the section drives a \`<tosi-map>\` — interpolating lat/lng + zoom across the section's pin to fly between two points on Earth.

\`\`\`ts
tosiProductSection({
  scroll: 400,
  apply(section) {
    section.scrollCallback = (p, el) => {
      const map = el.querySelector('tosi-map')
      map.coords = interpolateCoords(p)
    }
  }
}, mapBox({ token, coords, mapStyle }))
\`\`\``), tosiProductSection({
  scroll: 400,
  theme: "midnight",
  apply(el) {
    const section = el;
    section.scrollCallback = (progress, el2) => {
      const map = el2.querySelector("tosi-map");
      if (!map)
        return;
      const move = progress <= 0.1 ? 0 : progress >= 0.9 ? 1 : ease((progress - 0.1) / 0.8);
      const zoomT = Math.abs(progress - 0.5) * 2;
      const zoom = 2 + zoomT * zoomT * 10;
      const lat = HMB.lat + (OULU.lat - HMB.lat) * move;
      const lng = HMB.lng + (OULU.lng - HMB.lng) * move;
      map.coords = `${lat.toFixed(6)},${lng.toFixed(6)},${zoom.toFixed(4)}`;
    };
  }
}, div2({ class: "media-scene" }, O8({
  token: MAPBOX_TOKEN,
  coords: `${HMB.lat},${HMB.lng},12`,
  mapStyle: "mapbox://styles/mapbox/dark-v11",
  style: { pointerEvents: "none" }
}), mediaOverlay("0,0.2", "Half Moon Bay"), mediaOverlay("0.45,0.55", "↑ zoom out, fly ↑"), mediaOverlay("0.8,1", "Oulu, Finland"))), tosiProductSection({
  scroll: 250,
  "theme-from": "midnight",
  "theme-to": "paper"
}, div2({ class: "scene" }, tosiInterpolator({ "data-scroll-animate": true, easing: "ease-in-out" }, tosiWaypoint({
  progress: 0,
  style: { transform: "translateY(40px)", opacity: 0 }
}), tosiWaypoint({
  progress: 0.4,
  style: { transform: "translateY(0px)", opacity: 1 }
}), tosiWaypoint({
  progress: 1,
  style: { transform: "translateY(0px)", opacity: 1 }
}), h22("Theme transition")), p3("This section interpolates the theme from midnight to paper as you scroll through it. Page header, sticky bar, and footer all follow."), span({ class: "pill" }, 'theme-from="midnight" theme-to="paper"'))), tosiProductSection({ scroll: 100, theme: "paper" }, div2({ class: "scene" }, h22("Paper"), p3("Light theme settled. The chrome above and below switched too."), span({ class: "pill" }, "theme=paper"))), md(`## Theming via CSS variables

Themes are dictionaries of CSS custom properties. The engine writes the active section's resolved values to \`document.documentElement\`, so anything cascading from \`:root\` — including the page header, the sticky overlay, and the footer — re-themes in unison.

For interpolated sections, color values blend through \`color-mix(in srgb, ...)\`; numeric strings interpolate per-number; everything else steps at the midpoint.

\`\`\`html
<tosi-product-section
  theme-from="midnight"
  theme-to="paper">
  ...
</tosi-product-section>
\`\`\``), tosiProductSection({
  scroll: 200,
  "theme-from": "paper",
  "theme-to": "rose"
}, div2({ class: "scene" }, h22("Dusk"), p3("And back the other way. The transition is just a section with two themes."), span({ class: "pill" }, 'theme-from="paper" theme-to="rose"'))), div2({ class: "embed-host" }, h22("Nested scroll engines"), p3("A tosi-product inside any scrollable container detects its scroll parent automatically. It works the same in a 60vh card as on the whole page."), div2({ class: "embed-frame scroll-y" }, tosiProduct(...["Hero", "Intro", "Reveal", "Theme", "Done"].map((label, i3, arr) => tosiProductSection({
  scroll: 80,
  theme: ["midnight", "forest", "paper", "rose", "midnight"][i3]
}, div2({ class: "inner-scene" }, tosiInterpolator({ "data-scroll-animate": true, easing: "ease-in-out" }, tosiWaypoint({
  progress: 0,
  style: { opacity: i3 === 0 ? 1 : 0, transform: "translateY(20px)" }
}), tosiWaypoint({
  progress: 0.4,
  style: { opacity: 1, transform: "translateY(0)" }
}), tosiWaypoint({
  progress: 1,
  style: { opacity: i3 === arr.length - 1 ? 1 : 0.85, transform: "translateY(0)" }
}), I.h3(label)), p3(`Inner section ${i3 + 1} of ${arr.length}. Note: this engine has its own theme set per section, but it doesn't write to :root — it would override the outer engine.`))))))), tosiProductSection({ scroll: 250, theme: "rose" }, div2({ class: "embed-host", style: { padding: "2rem 1rem", background: "transparent" } }, h22("Horizontal nested engine"), p3("This section pins. Inside the pin, a horizontal tosi-product in follower mode — its panels slide as the outer's pin progress advances."), div2({ class: "embed-frame", style: { height: "55vh" } }, tosiProduct({ direction: "horizontal" }, ...[
  { name: "tosijs", desc: "Web components + proxy state.", bg: "#1a3a4a" },
  { name: "tosijs-ui", desc: "UI components that respect the DOM.", bg: "#3a3a1a" },
  { name: "tosijs-3d", desc: "BabylonJS, declaratively.", bg: "#3a1a3a" },
  { name: "tosijs-product", desc: "You are here.", bg: "#1a1a3a" }
].map((card) => tosiProductSection({ scroll: 100 }, div2({ class: "h-card", style: { background: card.bg } }, I.h3(card.name), p3(card.desc)))))))), md(`## Get started

\`\`\`html
<script src="https://cdn.jsdelivr.net/npm/tosijs-product/dist/index.js"></script>
\`\`\`

Drop the IIFE into any page — \`tosijs\`, \`tosijs-ui\`, and \`tosijs-product\` are all bundled. Or install from npm:

\`\`\`bash
bun add tosijs-product tosijs tosijs-ui
\`\`\`

Then compose your scenes in HTML.`));
app.themes = themes;
app.defaultTheme = "midnight";
document.body.appendChild(pageHeader);
document.body.appendChild(stickyHeader);
document.body.appendChild(app);
document.body.appendChild(pageFooter);
window.addEventListener("scroll", () => {
  requestAnimationFrame(() => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? Math.round(window.scrollY / docH * 100) : 0;
    stickyProgressLabel.textContent = `${pct}%`;
  });
}, { passive: true });
