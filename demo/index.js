// node_modules/tosijs/dist/module.js
function O(n) {
  if (n == null || typeof n !== "object")
    return n;
  if (n instanceof Set)
    return new Set(n);
  else if (Array.isArray(n))
    return n.map(O);
  let f = {};
  for (let o in n) {
    let E = n[o];
    if (n != null && typeof n === "object")
      f[o] = O(E);
    else
      f[o] = E;
  }
  return f;
}
var kn = "-xin-data";
var S = `.${kn}`;
var qn = "-xin-event";
var rn = `.${qn}`;
var q = Symbol.for("xin-path");
var K = Symbol.for("xin-value");
var Un = "xinObserve";
var jn = "xinBind";
var An = "xinOn";
var nn = Symbol("list-binding");
var p = Symbol("list-instance");
var Wn = new Map;
function Yf(n, f) {
  let o = Wn.get(n);
  if (o === undefined)
    o = new Set, Wn.set(n, o);
  o.add(f);
}
function $f(n) {
  return Wn.get(n);
}
var Df = new Set;
function I(n, f) {
  if (!Df.has(n))
    console.warn(f), Df.add(n);
}
function On(n, f) {
  let o = false;
  return (...E) => {
    if (!o)
      console.warn(f), o = true;
    return n(...E);
  };
}
var z = (n) => {
  return n && n[q] || undefined;
};
function Z(n) {
  if (typeof n === "object" && n !== null) {
    let f = n[K];
    return f !== undefined ? f : n;
  }
  return n;
}
var no = On(z, "xinPath is deprecated. Use tosiPath instead.");
var fo = On(Z, "xinValue is deprecated. Use tosiValue instead.");
var h = new WeakMap;
var s = new WeakMap;
var g = (n) => {
  let f = n.cloneNode();
  if (f instanceof Element) {
    let o = s.get(n), E = h.get(n);
    if (o != null)
      s.set(f, O(o));
    if (E != null)
      h.set(f, O(E));
  }
  for (let o of Array.from(n instanceof HTMLTemplateElement ? n.content.childNodes : n.childNodes))
    if (o instanceof Element || o instanceof DocumentFragment)
      f.appendChild(g(o));
    else
      f.appendChild(o.cloneNode());
  return f;
};
var v = { debug: false, perf: false };
var oo = (n) => {
  try {
    return JSON.stringify(n);
  } catch (f) {
    return "{has circular references}";
  }
};
var sn = (...n) => Error(n.map(oo).join(" "));
var Eo = () => new Date(parseInt("1000000000", 36) + Date.now()).valueOf().toString(36).slice(1);
var Mo = 0;
var co = () => (parseInt("10000", 36) + ++Mo).toString(36).slice(-5);
var mo = () => Eo() + co();
var Bn = Symbol("delete");
var Zf = Symbol("new-object");
var Kn = Symbol("automatic-index");
function Qf(n) {
  if (n === "")
    return [];
  if (Array.isArray(n))
    return n;
  else {
    let f = [];
    while (n.length > 0) {
      let o = n.search(/\[[^\]]+\]/);
      if (o === -1) {
        f.push(n.split("."));
        break;
      } else {
        let E = n.slice(0, o);
        if (n = n.slice(o), E !== "")
          f.push(E.split("."));
        if (o = n.indexOf("]") + 1, f.push(n.slice(1, o - 1)), n.slice(o, o + 1) === ".")
          o += 1;
        n = n.slice(o);
      }
    }
    return f;
  }
}
var B = new WeakMap;
function Gf(n, f) {
  if (B.get(n) === undefined)
    B.set(n, {});
  if (B.get(n)[f] === undefined)
    B.get(n)[f] = {};
  let o = B.get(n)[f];
  if (f === "_auto_")
    n.forEach((E, M) => {
      if (E[Kn] === undefined)
        E[Kn] = mo();
      o[E[Kn] + ""] = M;
    });
  else
    n.forEach((E, M) => {
      o[r(E, f) + ""] = M;
    });
  return o;
}
function Lo(n, f) {
  if (B.get(n) === undefined || B.get(n)[f] === undefined)
    return Gf(n, f);
  else
    return B.get(n)[f];
}
function yo(n, f, o) {
  o = o + "";
  let E = Lo(n, f)[o];
  if (E === undefined || r(n[E], f) + "" !== o)
    E = Gf(n, f)[o];
  return E;
}
function wo(n, f, o) {
  if (n[f] === undefined && o !== undefined)
    n[f] = o;
  return n[f];
}
function zf(n, f, o, E) {
  let M = f !== "" ? yo(n, f, o) : o;
  if (E === Bn)
    return n.splice(M, 1), B.delete(n), Symbol("deleted");
  else if (E === Zf) {
    if (f === "" && n[M] === undefined)
      n[M] = {};
  } else if (E !== undefined)
    if (M !== undefined)
      n[M] = E;
    else if (f !== "" && r(E, f) + "" === o + "")
      n.push(E), M = n.length - 1;
    else
      throw Error(`byIdPath insert failed at [${f}=${o}]`);
  return n[M];
}
function Jf(n) {
  if (!Array.isArray(n))
    throw sn("setByPath failed: expected array, found", n);
}
function Ff(n) {
  if (n == null || !(n instanceof Object))
    throw sn("setByPath failed: expected Object, found", n);
}
function r(n, f) {
  let o = Qf(f), E = n, M, c, L, y;
  for (M = 0, c = o.length;E !== undefined && M < c; M++) {
    let m = o[M];
    if (Array.isArray(m))
      for (L = 0, y = m.length;E !== undefined && L < y; L++) {
        let w = m[L];
        E = E[w];
      }
    else if (E.length === 0) {
      if (E = E[Number(m.slice(1))], m[0] !== "=")
        return;
    } else if (m.includes("=")) {
      let [w, ...C] = m.split("=");
      E = zf(E, w, C.join("="));
    } else
      L = parseInt(m, 10), E = E[L];
  }
  return E;
}
function Wf(n, f, o) {
  let E = n;
  if (f === "")
    throw Error("setByPath cannot be used to set the root object");
  let M = Qf(f);
  while (E != null && M.length > 0) {
    let c = M.shift();
    if (typeof c === "string") {
      let L = c.indexOf("=");
      if (L > -1) {
        if (L === 0)
          Ff(E);
        else
          Jf(E);
        let y = c.slice(0, L), m = c.slice(L + 1);
        if (E = zf(E, y, m, M.length > 0 ? Zf : o), M.length === 0)
          return true;
      } else {
        Jf(E);
        let y = parseInt(c, 10);
        if (M.length > 0)
          E = E[y];
        else {
          if (o !== Bn) {
            if (E[y] === o)
              return false;
            E[y] = o;
          } else
            E.splice(y, 1);
          return true;
        }
      }
    } else if (Array.isArray(c) && c.length > 0) {
      Ff(E);
      while (c.length > 0) {
        let L = c.shift();
        if (c.length > 0 || M.length > 0)
          E = wo(E, L, c.length > 0 ? {} : []);
        else {
          if (o !== Bn) {
            if (E[L] === o)
              return false;
            E[L] = o;
          } else {
            if (!Object.prototype.hasOwnProperty.call(E, L))
              return false;
            delete E[L];
          }
          return true;
        }
      }
    } else
      throw Error(`setByPath failed, bad path ${f}`);
  }
  throw Error(`setByPath(${n}, ${f}, ${o}) failed`);
}
var e = {};
var dn = null;
var kf = (n) => {
  dn = n;
};
var Xn = () => {
  if (dn === null)
    throw Error("xin proxy not initialized");
  return dn;
};
var Rn = null;
var Sn = null;
var qf = (n, f) => {
  Rn = n, Sn = f;
};
var Mn = () => {
  if (Rn === null)
    throw Error("bind not initialized");
  return Rn;
};
var cn = () => {
  if (Sn === null)
    throw Error("on not initialized");
  return Sn;
};
var rf = Symbol("observer should be removed");
var Tn = [];
var fn = [];
var In = false;
var Vn;
var un;
function xo(n, f, o, E) {
  let M = $f(n);
  if (M === undefined)
    return [];
  let c = [];
  for (let L of M) {
    let y = r(o, L);
    if (y !== undefined)
      c.push(`${n}[${L}=${y}]${E}`);
  }
  return c;
}

class Uf {
  description;
  test;
  callback;
  constructor(n, f) {
    let o = typeof f === "string" ? `"${f}"` : `function ${f.name}`, E;
    if (typeof n === "string")
      this.test = (M) => typeof M === "string" && M !== "" && (n.startsWith(M) || M.startsWith(n)), E = `test = "${n}"`;
    else if (n instanceof RegExp)
      this.test = n.test.bind(n), E = `test = "${n.toString()}"`;
    else if (n instanceof Function)
      this.test = n, E = `test = function ${n.name}`;
    else
      throw Error("expect listener test to be a string, RegExp, or test function");
    if (this.description = `${E}, ${o}`, typeof f === "function")
      this.callback = f;
    else
      throw Error("expect callback to be a path or function");
    Tn.push(this);
  }
}
var Co = () => {
  if (v.perf)
    console.time("xin async update");
  let n = Array.from(fn);
  fn.length = 0, In = false;
  for (let f of n)
    Tn.filter((o) => {
      let E;
      try {
        E = o.test(f);
      } catch (M) {
        throw Error(`Listener ${o.description} threw "${M}" at "${f}"`);
      }
      if (E === rf)
        return V(o), false;
      return E;
    }).forEach((o) => {
      let E;
      try {
        E = o.callback(f);
      } catch (M) {
        console.error(`Listener ${o.description} threw "${M}" handling "${f}"`);
      }
      if (E === rf)
        V(o);
    });
  if (typeof un === "function")
    un();
  if (v.perf)
    console.timeEnd("xin async update");
};
var u = (n) => {
  let f = typeof n === "string" ? n : z(n);
  if (f === undefined)
    throw console.error("touch was called on an invalid target", n), Error("touch was called on an invalid target");
  if (In === false)
    Vn = new Promise((E) => {
      un = E;
    }), In = setTimeout(Co);
  if (fn.find((E) => f.startsWith(E)) == null)
    fn.push(f);
  let o = f.match(/^(.+)\[(\d+)\](.*)$/);
  if (o !== null) {
    let [, E, M, c] = o, L = parseInt(M, 10), y = r(e, `${E}[${L}]`);
    if (y != null) {
      let m = xo(E, L, y, c);
      for (let w of m)
        if (fn.find((C) => w.startsWith(C)) == null)
          fn.push(w);
    }
  }
};
var P = (n, f) => {
  return new Uf(n, f);
};
var V = (n) => {
  let f = Tn.indexOf(n);
  if (f > -1)
    Tn.splice(f, 1);
  else
    throw Error("unobserve failed, listener not found");
};
var Pn = (n, f) => {
  let o = new Event(f);
  n.dispatchEvent(o);
};
var Of = (n) => {
  if (n instanceof HTMLInputElement)
    return n.type;
  else if (n instanceof HTMLSelectElement && n.hasAttribute("multiple"))
    return "multi-select";
  else
    return "other";
};
var sf = (n, f) => {
  switch (Of(n)) {
    case "radio":
      n.checked = n.value === f;
      break;
    case "checkbox":
      n.checked = !!f;
      break;
    case "date":
      n.valueAsDate = new Date(f);
      break;
    case "multi-select":
      for (let o of Array.from(n.querySelectorAll("option")))
        o.selected = f[o.value];
      break;
    default:
      n.value = f;
  }
};
var Kf = (n) => {
  switch (Of(n)) {
    case "radio": {
      let f = n.parentElement?.querySelector(`[name="${n.name}"]:checked`);
      return f != null ? f.value : null;
    }
    case "checkbox":
      return n.checked;
    case "date":
      return n.valueAsDate?.toISOString();
    case "multi-select":
      return Array.from(n.querySelectorAll("option")).reduce((f, o) => {
        return f[o.value] = o.selected, f;
      }, {});
    default:
      return n.value;
  }
};
var { ResizeObserver: Af } = globalThis;
var mn = Af != null ? new Af((n) => {
  for (let f of n) {
    let o = f.target;
    Pn(o, "resize");
  }
}) : { observe() {}, unobserve() {} };
var _n = (n, f, o = true) => {
  if (n != null && f != null)
    if (typeof f === "string")
      n.textContent = f;
    else if (Array.isArray(f))
      f.forEach((E) => {
        n.append(E instanceof Node && o ? g(E) : E);
      });
    else if (f instanceof Node)
      n.append(o ? g(f) : f);
    else
      throw Error("expect text content or document node");
};
var Dn = (n, f = 250) => {
  let o, E = Date.now() - f, M = false;
  return (...c) => {
    if (clearTimeout(o), o = setTimeout(() => {
      n(...c), E = Date.now();
    }, f), !M && Date.now() - E >= f) {
      M = true;
      try {
        n(...c), E = Date.now();
      } finally {
        M = false;
      }
    }
  };
};
var Yn = { value: { toDOM: sf, fromDOM(n) {
  return Kf(n);
} }, text: { toDOM(n, f) {
  n.textContent = f;
} }, enabled: { toDOM(n, f) {
  n.disabled = !f;
} }, disabled: { toDOM(n, f) {
  n.disabled = Boolean(f);
} }, list: { toDOM(n, f, o) {
  Ln(n, f, o).update(f);
} } };
function W(n) {
  return n.replace(/[A-Z]/g, (f) => {
    return `-${f.toLocaleLowerCase()}`;
  });
}
function Nn(n) {
  return n.replace(/-([a-z])/g, (f, o) => {
    return o.toLocaleUpperCase();
  });
}
var Ho = 180 / Math.PI;
var io = Math.PI / 180;
function j(n, f, o) {
  return o < n ? NaN : f < n ? n : f > o ? o : f;
}
function d(n, f, o, E = true) {
  if (E)
    o = j(0, o, 1);
  return o * (f - n) + n;
}
function hn(n, f = document.body) {
  let o = getComputedStyle(f);
  if (n.endsWith(")") && n.startsWith("var("))
    n = n.slice(4, -1);
  return o.getPropertyValue(n).trim();
}
var To = (n, f, o) => {
  return (0.299 * n + 0.587 * f + 0.114 * o) / 255;
};
var l = (n) => ("00" + Math.round(Number(n)).toString(16)).slice(-2);

class Bf {
  h;
  s;
  l;
  constructor(n, f, o) {
    n /= 255, f /= 255, o /= 255;
    let E = Math.max(n, f, o), M = E - Math.min(n, f, o), c = M !== 0 ? E === n ? (f - o) / M : E === f ? 2 + (o - n) / M : 4 + (n - f) / M : 0;
    this.h = 60 * c < 0 ? 60 * c + 360 : 60 * c, this.s = M !== 0 ? E <= 0.5 ? M / (2 * E - M) : M / (2 - (2 * E - M)) : 0, this.l = (2 * E - M) / 2;
  }
}
var on = globalThis.document !== undefined ? globalThis.document.createElement("span") : undefined;

class x {
  r;
  g;
  b;
  a;
  static fromVar(n, f = document.body) {
    return x.fromCss(hn(n, f));
  }
  static fromCss(n) {
    let f = n.match(/^#([0-9a-fA-F]+)$/);
    if (f) {
      let m = f[1];
      if (m.length === 3)
        return new x(parseInt(m[0] + m[0], 16), parseInt(m[1] + m[1], 16), parseInt(m[2] + m[2], 16));
      if (m.length === 4)
        return new x(parseInt(m[0] + m[0], 16), parseInt(m[1] + m[1], 16), parseInt(m[2] + m[2], 16), parseInt(m[3] + m[3], 16) / 255);
      if (m.length === 6)
        return new x(parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16));
      if (m.length === 8)
        return new x(parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16), parseInt(m.slice(6, 8), 16) / 255);
    }
    let o = n;
    if (on instanceof HTMLSpanElement)
      on.style.color = "black", on.style.color = n, document.body.appendChild(on), o = getComputedStyle(on).color, on.remove();
    let [E, M, c, L] = o.match(/[\d.]+/g) || ["0", "0", "0", "0"], y = o.startsWith("color(srgb") ? 255 : 1;
    return new x(Number(E) * y, Number(M) * y, Number(c) * y, L == null ? 1 : Number(L));
  }
  static fromHsl(n, f, o, E = 1) {
    let M, c, L;
    if (f === 0)
      M = c = L = o;
    else {
      let m = (Y, Q, H) => {
        if (H < 0)
          H += 1;
        if (H > 1)
          H -= 1;
        if (H < 0.16666666666666666)
          return Y + (Q - Y) * 6 * H;
        if (H < 0.5)
          return Q;
        if (H < 0.6666666666666666)
          return Y + (Q - Y) * (0.6666666666666666 - H) * 6;
        return Y;
      }, w = o < 0.5 ? o * (1 + f) : o + f - o * f, C = 2 * o - w, i = (n % 360 + 360) % 360 / 360;
      M = m(C, w, i + 0.3333333333333333), c = m(C, w, i), L = m(C, w, i - 0.3333333333333333);
    }
    let y = new x(M * 255, c * 255, L * 255, E);
    return y.hslCached = { h: (n % 360 + 360) % 360, s: f, l: o }, y;
  }
  static black = new x(0, 0, 0);
  static white = new x(255, 255, 255);
  constructor(n, f, o, E = 1) {
    this.r = j(0, n, 255), this.g = j(0, f, 255), this.b = j(0, o, 255), this.a = j(0, E, 1);
  }
  get inverse() {
    return new x(255 - this.r, 255 - this.g, 255 - this.b, this.a);
  }
  get inverseLuminance() {
    let { h: n, s: f, l: o } = this._hsl;
    return x.fromHsl(n, f, 1 - o, this.a);
  }
  get opaque() {
    return this.a === 1 ? this : new x(this.r, this.g, this.b, 1);
  }
  contrasting(n = 1) {
    return this.opaque.blend(this.brightness > 0.5 ? x.black : x.white, n);
  }
  get rgb() {
    let { r: n, g: f, b: o } = this;
    return `rgb(${n.toFixed(0)},${f.toFixed(0)},${o.toFixed(0)})`;
  }
  get rgba() {
    let { r: n, g: f, b: o, a: E } = this;
    return `rgba(${n.toFixed(0)},${f.toFixed(0)},${o.toFixed(0)},${E.toFixed(2)})`;
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
      this.hslCached = new Bf(this.r, this.g, this.b);
    return this.hslCached;
  }
  get hsl() {
    let { h: n, s: f, l: o } = this._hsl;
    return `hsl(${n.toFixed(0)}deg ${(f * 100).toFixed(0)}% ${(o * 100).toFixed(0)}%)`;
  }
  get hsla() {
    let { h: n, s: f, l: o } = this._hsl;
    return `hsl(${n.toFixed(0)}deg ${(f * 100).toFixed(0)}% ${(o * 100).toFixed(0)}% / ${(this.a * 100).toFixed(0)}%)`;
  }
  get mono() {
    let n = this.brightness * 255;
    return new x(n, n, n);
  }
  get brightness() {
    return To(this.r, this.g, this.b);
  }
  get html() {
    return this.toString();
  }
  toString() {
    return this.a === 1 ? "#" + l(this.r) + l(this.g) + l(this.b) : "#" + l(this.r) + l(this.g) + l(this.b) + l(Math.floor(255 * this.a));
  }
  brighten(n) {
    let { h: f, s: o, l: E } = this._hsl, M = j(0, E + n * (1 - E), 1);
    return x.fromHsl(f, o, M, this.a);
  }
  darken(n) {
    let { h: f, s: o, l: E } = this._hsl, M = j(0, E * (1 - n), 1);
    return x.fromHsl(f, o, M, this.a);
  }
  saturate(n) {
    let { h: f, s: o, l: E } = this._hsl, M = j(0, o + n * (1 - o), 1);
    return x.fromHsl(f, M, E, this.a);
  }
  desaturate(n) {
    let { h: f, s: o, l: E } = this._hsl, M = j(0, o * (1 - n), 1);
    return x.fromHsl(f, M, E, this.a);
  }
  rotate(n) {
    let { h: f, s: o, l: E } = this._hsl, M = (f + 360 + n) % 360;
    return x.fromHsl(M, o, E, this.a);
  }
  opacity(n) {
    let { h: f, s: o, l: E } = this._hsl;
    return x.fromHsl(f, o, E, n);
  }
  swatch() {
    return console.log(`%c      %c ${this.html}, ${this.rgba}`, `background-color: ${this.html}`, "background-color: transparent"), this;
  }
  blend(n, f) {
    return new x(d(this.r, n.r, f), d(this.g, n.g, f), d(this.b, n.b, f), d(this.a, n.a, f));
  }
  static blendHue(n, f, o) {
    let E = (f - n + 720) % 360;
    if (E < 180)
      return n + o * E;
    else
      return n - (360 - E) * o;
  }
  mix(n, f) {
    let o = this._hsl, E = n._hsl;
    return x.fromHsl(o.s === 0 ? E.h : E.s === 0 ? o.h : x.blendHue(o.h, E.h, f), d(o.s, E.s, f), d(o.l, E.l, f), d(this.a, n.a, f));
  }
  colorMix(n, f) {
    return x.fromCss(`color-mix(in hsl, ${this.html}, ${n.html} ${(f * 100).toFixed(0)}%)`);
  }
  static computedColorStylesheet = null;
  static computedColors = new Map;
  static recomputeQueued = false;
  static registerComputedColor(n, f, o, E) {
    if (!x.computedColors.has(n))
      x.computedColors.set(n, { varName: f, scale: o, method: E }), x.queueRecompute();
  }
  static queueRecompute() {
    if (x.recomputeQueued)
      return;
    x.recomputeQueued = true, queueMicrotask(() => {
      x.recomputeQueued = false, x.recomputeColors();
    });
  }
  static recomputeColors() {
    if (x.computedColors.size === 0)
      return;
    let n = [];
    for (let [o, { varName: E, scale: M, method: c }] of x.computedColors)
      try {
        let L = x.fromVar(E), y;
        switch (c) {
          case "b":
            y = M > 0 ? L.brighten(M) : L.darken(-M);
            break;
          case "s":
            y = M > 0 ? L.saturate(M) : L.desaturate(-M);
            break;
          case "h":
            y = L.rotate(M * 100);
            break;
          case "o":
            y = L.opacity(M);
            break;
          default:
            continue;
        }
        n.push(`  ${o}: ${y.rgba};`);
      } catch (L) {}
    if (n.length === 0)
      return;
    let f = `:root {
${n.join(`
`)}
}`;
    if (x.computedColorStylesheet === null)
      x.computedColorStylesheet = document.createElement("style"), x.computedColorStylesheet.id = "tosijs-computed-colors", document.head.append(x.computedColorStylesheet);
    x.computedColorStylesheet.textContent = f;
  }
}
var $n = new Set;
var df = false;
function Do() {
  if (!df)
    df = true, $n.add(() => x.queueRecompute());
}
function $o() {
  Do();
  for (let n of $n)
    n();
}
function Jo(n, f) {
  let o = Z(f), E = T.style(t(o));
  E.id = n, document.head.append(E);
  let M = z(f);
  if (M !== undefined)
    yn(M, () => {
      E.textContent = t(Z(f)), $o();
    });
}
var Fo = /^(animation-iteration-count|column-count|flex(-grow|-shrink)?|font-weight|line-height|opacity|order|orphans|scale|tab-size|widows|z-index|zoom)$/;
var pn = (n, f) => {
  if (typeof f === "number" && !Fo.test(n))
    f = `${f}px`;
  if (n.startsWith("_"))
    if (n.startsWith("__"))
      n = "--" + n.substring(2), f = `var(${n}-default, ${f})`;
    else
      n = "--" + n.substring(1);
  return { prop: n, value: String(f) };
};
var Zo = (n, f, o) => {
  if (o === undefined)
    return "";
  if (o instanceof x)
    o = o.html;
  let E = pn(f, o);
  return `${n}  ${E.prop}: ${E.value};`;
};
var Rf = (n, f, o = "") => {
  let E = W(n);
  if (typeof f === "object" && !(f instanceof x)) {
    let M = Object.keys(f).map((c) => Rf(c, f[c], `${o}  `)).join(`
`);
    return `${o}  ${n} {
${M}
${o}  }`;
  } else
    return Zo(o, E, f);
};
var t = (n, f = "") => {
  return Object.keys(n).map((E) => {
    let M = n[E];
    if (typeof M === "string") {
      if (E === "@import")
        return `@import url('${M}');`;
      throw Error("top-level string value only allowed for `@import`");
    }
    let c = Object.keys(M).map((L) => Rf(L, M[L])).join(`
`);
    return `${f}${E} {
${c}
}`;
  }).join(`

`);
};
var Go = (n) => {
  let f = {};
  for (let o of Object.keys(n)) {
    let E = n[o];
    if (E instanceof x)
      f[o] = E.inverseLuminance;
    else if (typeof E === "string" && E.match(/^(#[0-9a-fA-F]{3}|rgba?\(|hsla?\()/))
      f[o] = x.fromCss(E).inverseLuminance;
  }
  return f;
};
var Jn = new Proxy({}, { get(n, f) {
  if (n[f] === undefined) {
    let o = "--" + W(f);
    n[f] = (E) => `var(${o}, ${E})`;
  }
  return n[f];
} });
var gn = new Proxy({}, { get(n, f) {
  if (f === "default")
    return Jn;
  if (n[f] == null) {
    f = W(f);
    let [, o, , E, M, c] = f.match(/^([-\w]*?)((_)?(\d+)(\w?))?$/) || ["", f], L = `--${o}`;
    if (M != null) {
      let y = E == null ? Number(M) / 100 : -Number(M) / 100;
      switch (c) {
        case "b":
        case "s":
        case "h":
        case "o":
          {
            let m = `--${f}`;
            x.registerComputedColor(m, L, y, c), n[f] = `var(${m})`;
          }
          break;
        case "":
          n[f] = `calc(var(${L}) * ${y})`;
          break;
        default:
          throw console.error(c), Error(`Unrecognized method ${c} for css variable ${L}`);
      }
    } else
      n[f] = `var(${L})`;
  }
  return n[f];
} });
var If = "http://www.w3.org/1998/Math/MathML";
var Vf = "http://www.w3.org/2000/svg";
var Fn = {};
var uf = (n, f, o) => {
  let E = pn(W(f), o);
  if (E.prop.startsWith("--"))
    n.style.setProperty(E.prop, E.value);
  else
    n.style[f] = E.value;
};
var Wo = (n) => {
  return { toDOM(f, o) {
    uf(f, n, o);
  } };
};
var Pf = (n, f, o) => {
  if (f === "style")
    if (typeof o === "object")
      for (let E of Object.keys(o))
        if (z(o[E]))
          A(n, o[E], Wo(E));
        else
          uf(n, E, o[E]);
    else
      n.setAttribute("style", o);
  else {
    let E = W(f), M = n.constructor.observedAttributes;
    if (M?.includes(f) || M?.includes(E))
      if (typeof o === "boolean")
        o ? n.setAttribute(E, "") : n.removeAttribute(E);
      else
        n.setAttribute(E, o);
    else if (n[f] !== undefined) {
      let { MathMLElement: L } = globalThis;
      if (n instanceof SVGElement || L !== undefined && n instanceof L)
        n.setAttribute(f, o);
      else
        n[f] = o;
    } else if (E === "class")
      o.split(" ").forEach((L) => {
        n.classList.add(L);
      });
    else if (n[E] !== undefined)
      n[E] = o;
    else if (typeof o === "boolean")
      o ? n.setAttribute(E, "") : n.removeAttribute(E);
    else
      n.setAttribute(E, o);
  }
};
var vn = {};
var ko = (n) => {
  if (!vn[n])
    vn[n] = { toDOM(f, o) {
      Pf(f, n, o);
    } };
  return vn[n];
};
var qo = (n, f, o) => {
  if (f === "apply")
    o(n);
  else if (f.match(/^on[A-Z]/) != null) {
    let E = f.substring(2).toLowerCase();
    En(n, E, o);
  } else if (f === "bind")
    if ((typeof o.binding === "string" ? Yn[o.binding] : o.binding) !== undefined && o.value !== undefined)
      A(n, o.value, o.binding instanceof Function ? { toDOM: o.binding } : o.binding);
    else
      throw Error("bad binding");
  else if (f.match(/^bind[A-Z]/) != null) {
    let E = f.substring(4, 5).toLowerCase() + f.substring(5), M = Yn[E];
    if (M !== undefined)
      A(n, o, M);
    else
      throw Error(`${f} is not allowed, bindings.${E} is not defined`);
  } else if (z(o))
    A(n, o, ko(f));
  else
    Pf(n, f, o);
};
var en = (n, ...f) => {
  if (Fn[n] === undefined) {
    let [M, c] = n.split("|");
    if (c === undefined)
      Fn[n] = globalThis.document.createElement(M);
    else
      Fn[n] = globalThis.document.createElementNS(c, M);
  }
  let o = Fn[n].cloneNode(), E = {};
  for (let M of f)
    if (M instanceof Element || M instanceof DocumentFragment || typeof M === "string" || typeof M === "number")
      if (o instanceof HTMLTemplateElement)
        o.content.append(M);
      else
        o.append(M);
    else if (z(M))
      o.append(T.span({ bindText: M }));
    else
      Object.assign(E, M);
  for (let M of Object.keys(E)) {
    let c = E[M];
    qo(o, M, c);
  }
  return o;
};
var ln = (...n) => {
  let f = globalThis.document.createDocumentFragment();
  for (let o of n)
    f.append(o);
  return f;
};
var T = new Proxy({ fragment: ln }, { get(n, f) {
  if (f = f.replace(/[A-Z]/g, (o) => `-${o.toLocaleLowerCase()}`), n[f] === undefined)
    n[f] = (...o) => en(f, ...o);
  return n[f];
}, set() {
  throw Error("You may not add new properties to elements");
} });
var tn = new Proxy({ fragment: ln }, { get(n, f) {
  if (n[f] === undefined)
    n[f] = (...o) => en(`${f}|${Vf}`, ...o);
  return n[f];
}, set() {
  throw Error("You may not add new properties to elements");
} });
var an = new Proxy({ fragment: ln }, { get(n, f) {
  if (n[f] === undefined)
    n[f] = (...o) => en(`${f}|${If}`, ...o);
  return n[f];
}, set() {
  throw Error("You may not add new properties to elements");
} });
var ro = ["sort", "splice", "copyWithin", "fill", "pop", "push", "reverse", "shift", "unshift"];
var Uo = true;
var jo = /^\.?([^.[\](),])+(\.[^.[\](),]+|\[\d+\]|\[[^=[\](),]*=[^[\]()]+\])*$/;
var Ao = (n) => jo.test(n);
var _ = (n = "", f = "") => {
  if (n === "")
    return f;
  else if (f.match(/^\d+$/) !== null || f.includes("="))
    return `${n}[${f}]`;
  else
    return `${n}.${f}`;
};
var hf = {};
function nf(n, f) {
  if (n !== null && (typeof n === "object" || typeof n === "function"))
    return n;
  return new Proxy(hf, b(f, true));
}
var wn = () => new Proxy({}, b("^", true));
var ff = (n) => {
  let o = n(wn())?.path;
  if (!o?.startsWith("^."))
    throw Error("selector must return a property of the item");
  return o.substring(2);
};
var of = (n, f, o) => {
  for (let E = 0;E < n.length; E++)
    if (`${r(n[E], f)}` === `${o}`)
      return E;
  return -1;
};
var _f = (n, f) => ({ listFind(o, E) {
  if (o instanceof Element) {
    let L = o;
    while (L && !L[p] && L.parentElement)
      L = L.parentElement;
    let y = L?.[p];
    if (y == null)
      return;
    let m = f.indexOf(y);
    return m !== -1 ? U[n][m] : undefined;
  }
  let M = ff(o), c = of(f, M, E);
  return c !== -1 ? U[n][c] : undefined;
}, listUpdate(o, E) {
  let M = ff(o), c = r(E, M), L = of(f, M, c);
  if (L !== -1) {
    let y = U[n][L];
    for (let m of Object.keys(E))
      y[m] = E[m];
    return y;
  }
  return U[n].push(E), U[n][f.length - 1];
}, listRemove(o, E) {
  let M = ff(o), c = of(f, M, E);
  if (c === -1)
    return false;
  return U[n].splice(c, 1), true;
} });
var bf = false;
function a() {
  if (!bf)
    console.warn("xinValue, tosiValue, xinPath, tosiPath, etc. are deprecated. Use value, path, observe, bind, on, binding, listBinding instead."), bf = true;
}
var Nf = (n) => {
  return n === hf;
};
var b = (n, f) => ({ get(o, E) {
  if (Nf(o)) {
    let y = () => r(e, n);
    switch (E) {
      case "path":
        return n;
      case "value":
        return y();
      case "valueOf":
      case "toJSON":
        return () => y();
      case Symbol.toPrimitive:
        return (m) => {
          let w = y();
          if (m === "number")
            return Number(w);
          if (m === "string")
            return String(w);
          return w;
        };
      case "toString":
        return () => String(y());
      case "touch":
        return () => u(n);
      case "observe":
        return (m) => {
          let w = P(n, m);
          return () => V(w);
        };
      case "on":
        return (m, w) => cn()(m, w, y());
      case "bind":
        return (m, w, C) => {
          Mn()(m, n, w, C);
        };
      case "binding":
        return (m) => ({ bind: { value: n, binding: m } });
      case "listBinding":
        return (m = ({ span: C }) => C({ bindText: "^" }), w = {}) => [{ bindList: { value: n, ...w } }, T.template(m(T, wn()))];
      case "listFind":
      case "listUpdate":
      case "listRemove":
        return _f(n, o)[E];
      case K:
      case "xinValue":
      case "tosiValue":
        return a(), y();
      case q:
      case "xinPath":
      case "tosiPath":
        return a(), n;
      case Un:
      case "tosiObserve":
        return a(), (m) => {
          let w = P(n, m);
          return () => V(w);
        };
      case An:
      case "tosiOn":
        return a(), (m, w) => cn()(m, w, y());
      case jn:
      case "tosiBind":
        return a(), (m, w, C) => {
          Mn()(m, n, w, C);
        };
      case "tosiBinding":
        return a(), (m) => ({ bind: { value: n, binding: m } });
      case "tosiListBinding":
        return a(), (m = ({ span: C }) => C({ bindText: "^" }), w = {}) => [{ bindList: { value: n, ...w } }, T.template(m(T, wn()))];
    }
    if (typeof E === "string" && /^\d+$/.test(E)) {
      let m = y();
      if (typeof m === "string")
        return m[parseInt(E, 10)];
    }
    if (E === "length") {
      let m = y();
      if (typeof m === "string")
        return m.length;
    }
    return;
  }
  if (f && !(E in o))
    switch (E) {
      case "path":
        return n;
      case "value":
        return o.valueOf ? o.valueOf() : o;
      case "valueOf":
      case "toJSON":
        return () => o.valueOf ? o.valueOf() : o;
      case "touch":
        return () => u(n);
      case "observe":
        return (y) => {
          let m = P(n, y);
          return () => V(m);
        };
      case "on":
        return (y, m) => cn()(y, m, Z(o));
      case "bind":
        return (y, m, w) => {
          Mn()(y, n, m, w);
        };
      case "binding":
        return (y) => ({ bind: { value: n, binding: y } });
      case "listBinding":
        return (y = ({ span: w }) => w({ bindText: "^" }), m = {}) => [{ bindList: { value: n, ...m } }, T.template(y(T, wn()))];
      case "listFind":
      case "listUpdate":
      case "listRemove":
        return _f(n, o)[E];
    }
  switch (E) {
    case q:
    case "xinPath":
    case "tosiPath":
      return n;
    case K:
    case "xinValue":
    case "tosiValue":
      return o.valueOf ? o.valueOf() : o;
    case Un:
    case "xinObserve":
    case "tosiObserve":
      return (y) => {
        let m = P(n, y);
        return () => V(m);
      };
    case An:
    case "xinOn":
    case "tosiOn":
      return (y, m) => cn()(y, m, Z(o));
    case jn:
    case "xinBind":
    case "tosiBind":
      return (y, m, w) => {
        Mn()(y, n, m, w);
      };
    case "tosiBinding":
      return (y) => ({ bind: { value: n, binding: y } });
    case "tosiListBinding":
      return (y = ({ span: w }) => w({ bindText: "^" }), m = {}) => [{ bindList: { value: n, ...m } }, T.template(y(T, wn()))];
  }
  if (typeof E === "symbol")
    return o[E];
  let M = Object.getOwnPropertyDescriptor(o, E);
  if (M && !M.configurable && !M.writable && "value" in M)
    return M.value;
  let c = E, L = c.match(/^([^.[]+)\.(.+)$/) ?? c.match(/^([^\]]+)(\[.+)/) ?? c.match(/^(\[[^\]]+\])\.(.+)$/) ?? c.match(/^(\[[^\]]+\])\[(.+)$/);
  if (L !== null) {
    let [, y, m] = L, w = _(n, y), C = r(o, y);
    return C !== null && typeof C === "object" ? new Proxy(C, b(w, f))[m] : C;
  }
  if (c.startsWith("[") && c.endsWith("]"))
    c = c.substring(1, c.length - 1);
  if (!Array.isArray(o) && o[c] !== undefined || Array.isArray(o) && c.includes("=")) {
    let y;
    if (c.includes("=")) {
      let [m, w] = c.split("=");
      y = o.find((C) => `${r(C, m)}` === w);
    } else
      y = o[c];
    if (y instanceof Object) {
      let m = _(n, c);
      return new Proxy(y instanceof Function ? y.bind(o) : y, b(m, f));
    } else
      return f ? nf(y, _(n, c)) : y;
  } else if (Array.isArray(o)) {
    let y = o[c];
    return typeof y === "function" ? (...m) => {
      let w = m.map((i) => Z(i)), C = y.apply(o, w);
      if (ro.includes(c))
        u(n);
      if (C != null && typeof C === "object") {
        if (c === "find" || c === "findLast" || c === "at") {
          let i = o.indexOf(C);
          if (i !== -1)
            return new Proxy(C, b(_(n, String(i)), f));
        }
      }
      return C;
    } : typeof y === "object" ? new Proxy(y, b(_(n, c), f)) : f ? nf(y, _(n, c)) : y;
  } else
    return f ? nf(o[c], _(n, c)) : o[c];
}, set(o, E, M) {
  M = Z(M);
  let L = E === K || E === "xinValue" || E === "tosiValue" || E === "value" && (Nf(o) || f) ? n : _(n, E);
  if (Uo && !Ao(L))
    throw Error(`setting invalid path ${L}`);
  if (Z(G[L]) !== M && Wf(e, L, M))
    u(L);
  return true;
} });
var yn = (n, f) => {
  let o = typeof f === "function" ? f : G[f];
  if (typeof o !== "function")
    throw Error(`observe expects a function or path to a function, ${f} is neither`);
  return P(n, o);
};
var G = new Proxy(e, b("", false));
kf(G);
var U = new Proxy(e, b("", true));
var Oo = 16;
var so = 100;
function pf(n, f) {
  let o = Array.from(n.querySelectorAll(S));
  if (n.matches(S))
    o.unshift(n);
  for (let E of o) {
    let M = s.get(E);
    for (let c of M) {
      if (c.path.startsWith("^"))
        c.path = `${f}${c.path.substring(1)}`;
      if (c.binding.toDOM != null)
        c.binding.toDOM(E, G[c.path]);
    }
  }
}

class gf {
  boundElement;
  listTop;
  listBottom;
  template;
  options;
  itemToElement;
  array = [];
  _filteredCache;
  _update;
  _previousSlice;
  static filterBoundObservers = new WeakMap;
  constructor(n, f, o = {}) {
    if (this.boundElement = n, this.itemToElement = new WeakMap, o.idPath != null) {
      let E = z(f);
      if (E != null)
        Yf(E, o.idPath);
    }
    if (n.children.length !== 1)
      throw Error("ListBinding expects an element with exactly one child element");
    if (n.children[0] instanceof HTMLTemplateElement) {
      let E = n.children[0];
      if (E.content.children.length !== 1)
        throw Error("ListBinding expects a template with exactly one child element");
      this.template = g(E.content.children[0]);
    } else
      this.template = n.children[0], this.template.remove();
    if (this.options = o, this.listTop = document.createElement("div"), this.listBottom = document.createElement("div"), this.listTop.classList.add("virtual-list-padding"), this.listBottom.classList.add("virtual-list-padding"), this.boundElement.append(this.listTop), this.boundElement.append(this.listBottom), this.boundElement[nn] = this, o.virtual != null)
      if (mn.observe(this.boundElement), this._update = Dn(() => {
        this.update(this.array, true);
      }, Oo), this.boundElement.addEventListener("resize", this._update), o.virtual.scrollContainer === "window")
        window.addEventListener("scroll", this._update), window.addEventListener("resize", this._update);
      else
        this.boundElement.addEventListener("scroll", this._update);
  }
  filteredArray() {
    if (this._filteredCache != null)
      return this._filteredCache;
    let { hiddenProp: n, visibleProp: f } = this.options, o = this.array;
    if (n !== undefined)
      o = o.filter((E) => E[n] !== true);
    if (f !== undefined)
      o = o.filter((E) => E[f] === true);
    if (this.options.filter && this.needle !== undefined)
      o = this.options.filter(o, this.needle);
    return this._filteredCache = o, o;
  }
  visibleSlice() {
    let { virtual: n } = this.options, f = this.filteredArray(), o = 0, E = f.length - 1, M = 0, c = 0;
    if (n != null && this.boundElement instanceof HTMLElement) {
      let L = this.boundElement.offsetWidth, y = n.scrollContainer === "window", m, w;
      if (y) {
        m = window.innerHeight;
        let Y = this.boundElement.getBoundingClientRect();
        w = Math.max(0, -Y.top);
      } else
        m = this.boundElement.offsetHeight, w = this.boundElement.scrollTop;
      let C = n.width != null ? Math.max(1, Math.floor(L / n.width)) : n.visibleColumns ?? 1, i = Math.ceil(f.length / C);
      if (n.minHeight != null) {
        let Y = n.minHeight, Q = Math.ceil(m / Y) + (n.rowChunkSize || 1), H = C * Q, $ = i * Y, D = Math.max(0, $ - m), k = D > 0 ? Math.min(1, Math.max(0, w / D)) : 0, X = Math.max(0, i - Q + 1), J = k * X, F = Math.floor(J);
        if (n.rowChunkSize)
          F -= F % n.rowChunkSize;
        return o = F * C, E = o + H - 1, M = w, c = Math.max(0, $ - w - m), { items: f, firstItem: o, lastItem: E, topBuffer: M, bottomBuffer: c, interpolation: { t: k, position: J, scrollTop: w, viewportHeight: m, totalScrollHeight: $, rowHeight: n.height } };
      } else {
        let Y = Math.ceil(m / n.height) + (n.rowChunkSize || 1), Q = C * Y, H = Math.floor(w / n.height);
        if (H > i - Y + 1)
          H = Math.max(0, i - Y + 1);
        if (n.rowChunkSize)
          H -= H % n.rowChunkSize;
        o = H * C, E = o + Q - 1, M = H * n.height, c = Math.max((i - Y) * n.height - M, 0);
      }
    }
    return { items: f, firstItem: o, lastItem: E, topBuffer: M, bottomBuffer: c };
  }
  needle;
  filter = Dn((n) => {
    if (this.needle !== n)
      this.needle = n, this.update(this.array);
  }, so);
  update(n, f) {
    if (n == null)
      n = [];
    if (this.array = n, !f)
      this._filteredCache = undefined;
    let { hiddenProp: o, visibleProp: E } = this.options, M = z(n), c = this.visibleSlice();
    this.boundElement.classList.toggle("-xin-empty-list", c.items.length === 0);
    let L = this._previousSlice, { firstItem: y, lastItem: m, topBuffer: w, bottomBuffer: C } = c, i = o === undefined && E === undefined && f === true && L != null && y === L.firstItem && m === L.lastItem;
    if (i && c.interpolation == null && w === L.topBuffer && C === L.bottomBuffer)
      return;
    if (i && c.interpolation != null) {
      this._updateInterpolatedBuffers(c);
      return;
    }
    this._previousSlice = c;
    let Y = 0, Q = 0, H = 0;
    for (let X of Array.from(this.boundElement.children)) {
      if (X === this.listTop || X === this.listBottom)
        continue;
      let J = X[p];
      if (J == null)
        X.remove();
      else {
        let F = c.items.indexOf(J);
        if (F < y || F > m)
          X.remove(), this.itemToElement.delete(J), Y++;
      }
    }
    this.listTop.style.height = String(w) + "px", this.listBottom.style.height = String(C) + "px";
    let $ = [], { idPath: D } = this.options;
    for (let X = y;X <= m; X++) {
      let J = c.items[X];
      if (J === undefined)
        continue;
      let F = this.itemToElement.get(Z(J));
      if (F == null) {
        if (H++, F = g(this.template), typeof J === "object")
          this.itemToElement.set(Z(J), F), F[p] = Z(J);
        if (this.boundElement.insertBefore(F, this.listBottom), D != null) {
          let N = J[D], Hn = `${M}[${D}=${N}]`;
          pf(F, Hn);
        } else {
          let N = `${M}[${X}]`;
          pf(F, N);
        }
      }
      $.push(F);
    }
    let k = null;
    for (let X of $) {
      if (X.previousElementSibling !== k)
        if (Q++, k?.nextElementSibling != null)
          this.boundElement.insertBefore(X, k.nextElementSibling);
        else
          this.boundElement.insertBefore(X, this.listBottom);
      k = X;
    }
    if (c.interpolation != null)
      this._updateInterpolatedBuffers(c);
    if (v.perf)
      console.log(M, "updated", { removed: Y, created: H, moved: Q });
  }
  _updateInterpolatedBuffers(n) {
    let { t: f, position: o, scrollTop: E, viewportHeight: M, totalScrollHeight: c, rowHeight: L } = n.interpolation, y = 0;
    for (let i of Array.from(this.boundElement.children)) {
      if (i === this.listTop || i === this.listBottom)
        continue;
      y += i.offsetHeight || L;
    }
    let m = E, w = E + M - y, C = Math.max(0, f * w + (1 - f) * m - o % 1 * L);
    this.listTop.style.height = String(C) + "px", this.listBottom.style.height = String(Math.max(0, c - C - y)) + "px";
  }
}
var Ln = (n, f, o) => {
  let E = n[nn];
  if (f && E === undefined)
    E = new gf(n, f, o), n[nn] = E;
  return E;
};
var Ef = (n) => {
  let f;
  while (!(f = n[p]) && n && n.parentElement)
    n = n.parentElement;
  return f ? { element: n, item: f } : undefined;
};
var Mf = (n) => {
  let f = Ef(n);
  return f ? f.item : undefined;
};
var { document: xn, MutationObserver: vf } = globalThis;
var cf = (n, f) => {
  let o = s.get(n);
  if (o == null)
    return;
  for (let E of o) {
    let { binding: M, options: c } = E, { path: L } = E, { toDOM: y } = M;
    if (y != null) {
      if (L.startsWith("^")) {
        let m = Mf(n);
        if (m != null && m[q] != null)
          L = E.path = `${m[q]}${L.substring(1)}`;
        else
          throw console.error(`Cannot resolve relative binding ${L}`, n, "is not part of a list"), Error(`Cannot resolve relative binding ${L}`);
      }
      if (f == null || L.startsWith(f))
        y(n, Xn()[L], c);
    }
  }
};
if (vf != null)
  new vf((f) => {
    f.forEach((o) => {
      Array.from(o.addedNodes).forEach((E) => {
        if (E instanceof Element)
          Array.from(E.querySelectorAll(S)).forEach((M) => cf(M));
      });
    });
  }).observe(xn.body, { subtree: true, childList: true });
P(() => true, (n) => {
  let f = Array.from(xn.querySelectorAll(S));
  for (let o of f)
    cf(o, n);
});
var ef = (n) => {
  let f = n.target?.closest(S);
  while (f != null) {
    let o = s.get(f);
    for (let E of o) {
      let { binding: M, path: c } = E, { fromDOM: L } = M;
      if (L != null) {
        let y;
        try {
          y = L(f, E.options);
        } catch (m) {
          throw console.error("Cannot get value from", f, "via", E), Error("Cannot obtain value fromDOM");
        }
        if (y != null) {
          let m = Xn(), w = m[c];
          if (w == null)
            m[c] = y;
          else {
            let C = w[q] != null ? w[K] : w, i = y[q] != null ? y[K] : y;
            if (C !== i)
              m[c] = i;
          }
        }
      }
    }
    f = f.parentElement.closest(S);
  }
};
if (globalThis.document != null)
  xn.body.addEventListener("change", ef, true), xn.body.addEventListener("input", ef, true);
function A(n, f, o, E) {
  if (n instanceof DocumentFragment)
    throw Error("bind cannot bind to a DocumentFragment");
  let M;
  if (typeof f === "object" && f[q] === undefined && E === undefined) {
    let { value: y } = f;
    M = typeof y === "string" ? y : y[q], E = f, delete E.value;
  } else
    M = typeof f === "string" ? f : f[q];
  if (M == null)
    throw Error("bind requires a path or object with xin Proxy");
  let { toDOM: c } = o;
  n.classList?.add(kn);
  let L = s.get(n);
  if (L == null)
    L = [], s.set(n, L);
  if (L.push({ path: M, binding: o, options: E }), c != null && !M.startsWith("^"))
    u(M);
  if (E?.filter && E?.needle)
    A(n, E.needle, { toDOM(y, m) {
      console.log({ needle: m }), y[nn]?.filter(m);
    } });
  return n;
}
var lf = new Set;
var So = (n) => {
  let f = n?.target?.closest(rn), o = false, E = new Proxy(n, { get(c, L) {
    if (L === "stopPropagation")
      return () => {
        n.stopPropagation(), o = true;
      };
    else {
      let y = c[L];
      return typeof y === "function" ? y.bind(c) : y;
    }
  } }), M = new Set;
  while (!o && f != null) {
    let L = h.get(f)[n.type] || M;
    for (let y of L) {
      if (typeof y === "function")
        y(E);
      else {
        let m = Xn()[y];
        if (typeof m === "function")
          m(E);
        else
          throw Error(`no event handler found at path ${y}`);
      }
      if (o)
        continue;
    }
    f = f.parentElement != null ? f.parentElement.closest(rn) : null;
  }
};
function En(n, f, o) {
  let E = h.get(n);
  if (n.classList.add(qn), E == null)
    E = {}, h.set(n, E);
  if (!E[f])
    E[f] = new Set;
  if (E[f].add(o), !lf.has(f))
    lf.add(f), xn.body.addEventListener(f, So, true);
  return () => {
    E[f].delete(o);
  };
}
qf(A, En);
function mf(n, f) {
  if (!n.internals)
    return;
  let o = {}, E = "";
  if (n.hasAttribute("required") && f === "")
    o.valueMissing = true, E = "Please fill out this field.";
  let M = n.getAttribute("minlength");
  if (M && f.length < parseInt(M, 10))
    o.tooShort = true, E = `Please use at least ${M} characters.`;
  let c = n.getAttribute("maxlength");
  if (c && f.length > parseInt(c, 10))
    o.tooLong = true, E = `Please use no more than ${c} characters.`;
  let L = n.getAttribute("pattern");
  if (L && f !== "")
    try {
      if (!new RegExp(`^(?:${L})$`).test(f))
        o.patternMismatch = true, E = "Please match the requested format.";
    } catch {}
  if (Object.keys(o).length > 0)
    n.internals.setValidity(o, E, n);
  else
    n.internals.setValidity({});
}
var Io = 0;
function Lf() {
  return `custom-elt${(Io++).toString(36)}`;
}
var tf = 0;
var yf = null;
function Vo() {
  if (yf === null)
    yf = new MutationObserver((n) => {
      let f = new Set;
      for (let o of n)
        if (o.type === "attributes" && o.target instanceof R) {
          let E = o.target, M = Nn(o.attributeName);
          if (E._legacyTrackedAttrs?.has(M))
            f.add(E);
        }
      for (let o of f)
        o.queueRender(false);
    });
  return yf;
}
var Cn = {};
function uo(n, f) {
  let o = Cn[n], E = t(f).replace(/:host\(([^)]+)\)/g, `${n}$1`).replace(/:host\b/g, n);
  Cn[n] = o ? o + `
` + E : E;
}
function Po(n) {
  if (Cn[n])
    document.head.append(T.style({ id: n + "-component" }, Cn[n]));
  delete Cn[n];
}

class R extends HTMLElement {
  static elements = T;
  static _elementCreator;
  static initAttributes;
  static formAssociated;
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
  setCustomValidity(n) {
    if (this.internals)
      if (n)
        this.internals.setValidity({ customError: true }, n);
      else
        this.internals.setValidity({});
  }
  setValidity(n, f, o) {
    this.internals?.setValidity(n, f, o);
  }
  setFormValue(n, f) {
    this.internals?.setFormValue(n, f);
  }
  static get observedAttributes() {
    let n = this.initAttributes;
    if (n)
      return ["hidden", ...Object.keys(n).map(W)];
    return ["hidden"];
  }
  instanceId;
  styleNode;
  static styleSpec;
  static styleNode;
  content = T.slot();
  isSlotted;
  static _tagName = null;
  static get tagName() {
    return this._tagName;
  }
  _legacyTrackedAttrs;
  _attrValues;
  _valueChanged = false;
  static StyleNode(n) {
    return console.warn("StyleNode is deprecated, just assign static styleSpec: XinStyleSheet to the class directly"), T.style(t(n));
  }
  static elementCreator(n = {}) {
    let f = this;
    if (f._elementCreator == null) {
      let { tag: o, styleSpec: E } = n, M = n != null ? o : null;
      if (M == null)
        if (typeof f.name === "string" && f.name !== "") {
          if (M = W(f.name), M.startsWith("-"))
            M = M.slice(1);
        } else
          M = Lf();
      if (customElements.get(M) != null)
        console.warn(`${M} is already defined`);
      if (M.match(/\w+(-\w+)+/) == null)
        console.warn(`${M} is not a legal tag for a custom-element`), M = Lf();
      while (customElements.get(M) !== undefined)
        M = Lf();
      if (f._tagName = M, E !== undefined)
        uo(M, E);
      window.customElements.define(M, this, n), f._elementCreator = T[M];
    }
    return f._elementCreator;
  }
  initAttributes(...n) {
    if (I("initAttributes", "initAttributes() is deprecated. Use static initAttributes = { ... } instead."), !this._legacyTrackedAttrs)
      this._legacyTrackedAttrs = new Set;
    for (let M of n)
      this._legacyTrackedAttrs.add(M);
    Vo().observe(this, { attributes: true });
    let o = {}, E = {};
    n.forEach((M) => {
      o[M] = O(this[M]);
      let c = W(M);
      Object.defineProperty(this, M, { enumerable: false, get() {
        if (typeof o[M] === "boolean")
          return this.hasAttribute(c);
        else if (this.hasAttribute(c))
          return typeof o[M] === "number" ? parseFloat(this.getAttribute(c)) : this.getAttribute(c);
        else if (E[M] !== undefined)
          return E[M];
        else
          return o[M];
      }, set(L) {
        if (typeof o[M] === "boolean") {
          if (L !== this[M]) {
            if (L)
              this.setAttribute(c, "");
            else
              this.removeAttribute(c);
            this.queueRender();
          }
        } else if (typeof o[M] === "number") {
          if (L !== parseFloat(this[M]))
            this.setAttribute(c, L), this.queueRender();
        } else if (typeof L === "object" || `${L}` !== `${this[M]}`) {
          if (L === null || L === undefined || typeof L === "object")
            this.removeAttribute(c);
          else
            this.setAttribute(c, L);
          this.queueRender(), E[M] = L;
        }
      } });
    });
  }
  initValue() {
    let n = Object.getOwnPropertyDescriptor(this, "value");
    if (n === undefined || n.get !== undefined || n.set !== undefined)
      return;
    let f = this.hasAttribute("value") ? this.getAttribute("value") : O(this.value);
    delete this.value, Object.defineProperty(this, "value", { enumerable: false, get() {
      return f;
    }, set(o) {
      if (f !== o)
        f = o, this._valueChanged = true, this.queueRender(true);
    } });
  }
  _parts;
  get parts() {
    let n = this.shadowRoot != null ? this.shadowRoot : this;
    if (this._parts == null)
      this._parts = new Proxy({}, { get(f, o) {
        if (f[o] === undefined) {
          let E = n.querySelector(`[part="${o}"]`);
          if (E == null)
            E = n.querySelector(o);
          if (E == null)
            throw Error(`elementRef "${o}" does not exist!`);
          E.removeAttribute("data-ref"), f[o] = E;
        }
        return f[o];
      } });
    return this._parts;
  }
  attributeChangedCallback(n, f, o) {
    let E = Nn(n);
    if (!this._legacyTrackedAttrs?.has(E))
      this.queueRender(false);
  }
  constructor() {
    super();
    if (tf += 1, this.constructor.formAssociated && typeof this.attachInternals === "function" && !this.internals)
      this.internals = this.attachInternals();
    let n = this.constructor.initAttributes;
    if (n)
      this._setupAttributeAccessors(n);
    this.instanceId = `${this.tagName.toLocaleLowerCase()}-${tf}`, this._value = O(this.defaultValue);
  }
  _setupAttributeAccessors(n) {
    if (!this._attrValues)
      this._attrValues = new Map;
    for (let f of Object.keys(n)) {
      let o = W(f), E = n[f];
      if (f === "value") {
        console.warn(`${this.tagName}: 'value' cannot be an attribute. Use the Component value property instead.`);
        continue;
      }
      if (typeof E === "object" && E !== null) {
        console.warn(`${this.tagName}: initAttributes.${f} is an object. Use a regular property instead.`);
        continue;
      }
      let M = this, c = false;
      while (M) {
        let L = Object.getOwnPropertyDescriptor(M, f);
        if (L) {
          if (!L.configurable || L.get || L.set) {
            c = true;
            break;
          }
          break;
        }
        M = Object.getPrototypeOf(M);
      }
      if (c)
        continue;
      Object.defineProperty(this, f, { enumerable: false, get: () => {
        if (typeof E === "boolean")
          return this.hasAttribute(o);
        else if (this.hasAttribute(o))
          return typeof E === "number" ? parseFloat(this.getAttribute(o)) : this.getAttribute(o);
        else if (this._attrValues.has(f))
          return this._attrValues.get(f);
        else
          return E;
      }, set: (L) => {
        if (typeof E === "boolean") {
          if (L !== this[f]) {
            if (L)
              this.setAttribute(o, "");
            else
              this.removeAttribute(o);
            this.queueRender();
          }
        } else if (typeof E === "number") {
          if (L !== parseFloat(this[f]))
            this.setAttribute(o, L), this.queueRender();
        } else if (typeof L === "object" || `${L}` !== `${this[f]}`) {
          if (L === null || L === undefined || typeof L === "object")
            this.removeAttribute(o);
          else
            this.setAttribute(o, L);
          this.queueRender(), this._attrValues.set(f, L);
        }
      } });
    }
  }
  connectedCallback() {
    if (Po(this.constructor.tagName), this.hydrate(), this.role != null)
      this.setAttribute("role", this.role);
    if (this.constructor.formAssociated && !this.hasAttribute("tabindex"))
      this.setAttribute("tabindex", "0");
    if (this.onResize !== undefined) {
      if (mn.observe(this), this._onResize == null)
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
    mn.unobserve(this);
  }
  formResetCallback() {
    if (this.value !== undefined)
      this.value = this.defaultValue ?? "";
  }
  formDisabledCallback(n) {
    if (n)
      this.setAttribute("disabled", "");
    else
      this.removeAttribute("disabled");
  }
  formStateRestoreCallback(n) {
    if (this.value !== undefined && typeof n === "string")
      this.value = n;
  }
  _changeQueued = false;
  _renderQueued = false;
  queueRender(n = false) {
    if (!this._hydrated)
      return;
    if (!this._changeQueued)
      this._changeQueued = n;
    if (!this._renderQueued)
      this._renderQueued = true, requestAnimationFrame(() => {
        if (this._changeQueued) {
          if (Pn(this, "change"), this.internals && this.value !== undefined)
            this.internals.setFormValue(this.value);
        }
        this._changeQueued = false, this._renderQueued = false, this.render();
      });
  }
  _hydrated = false;
  hydrate() {
    if (!this._hydrated) {
      this.initValue();
      let n = typeof this.content !== "function", f = typeof this.content === "function" ? this.content(T) : this.content, { styleSpec: o } = this.constructor, { styleNode: E } = this.constructor;
      if (o)
        E = this.constructor.styleNode = T.style(t(o)), delete this.constructor.styleNode;
      if (this.styleNode)
        console.warn(this, "styleNode is deprecrated, use static styleNode or statc styleSpec instead"), E = this.styleNode;
      if (E) {
        let M = this.attachShadow({ mode: "open" });
        M.appendChild(E.cloneNode(true)), _n(M, f, n);
      } else if (f !== null) {
        let M = Array.from(this.childNodes);
        _n(this, f, n), this.isSlotted = this.querySelector("slot,xin-slot") !== undefined;
        let c = Array.from(this.querySelectorAll("slot"));
        if (c.length > 0)
          c.forEach(wf.replaceSlot);
        if (M.length > 0) {
          let L = { "": this };
          Array.from(this.querySelectorAll("xin-slot")).forEach((y) => {
            L[y.name] = y;
          }), M.forEach((y) => {
            let m = L[""], w = y instanceof Element ? L[y.slot] : m;
            (w !== undefined ? w : m).append(y);
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
    let n = typeof this.value === "string" ? this.value : String(this.value);
    mf(this, n);
  }
}

class wf extends R {
  static initAttributes = { name: "" };
  content = null;
  static replaceSlot(n) {
    let f = document.createElement("xin-slot");
    if (n.name !== "")
      f.setAttribute("name", n.name);
    n.replaceWith(f);
  }
}
var CM = wf.elementCreator({ tag: "xin-slot" });
var xf = "1.4.0";
function Zn(n) {
  return Object.assign(U, n), U;
}
function Qn(n) {
  return I("boxedProxy", "boxedProxy is deprecated, please use tosi() instead"), Zn(n);
}
function Cf(n, f = false) {
  if (f)
    return I("xinProxy-boxed", "xinProxy(..., true) is deprecated; use tosi(...) instead"), Qn(n);
  return Object.keys(n).forEach((o) => {
    G[o] = n[o];
  }), G;
}
var bo = {};
async function Gn(n, f) {
  let { type: o, styleSpec: E } = await f(n, { Color: x, Component: R, elements: T, svgElements: tn, mathML: an, varDefault: Jn, vars: gn, xin: G, boxed: U, xinProxy: Cf, boxedProxy: Qn, tosi: Zn, makeComponent: Gn, bind: A, on: En, version: xf }), M = { type: o, creator: o.elementCreator({ tag: n, styleSpec: E }) };
  return bo[n] = M, M;
}
var Hf = {};
var No = (n) => import(n);

class zn extends R {
  static initAttributes = { tag: "anon-elt", src: "", property: "default" };
  loaded;
  blueprintLoaded = (n) => {};
  async packaged() {
    let { tag: n, src: f, property: o } = this, E = `${n}.${o}:${f}`;
    if (!this.loaded) {
      if (Hf[E] === undefined)
        Hf[E] = No(f).then((M) => {
          let c = M[o];
          return Gn(n, c);
        });
      else
        console.log(`using cached ${n} with signature ${E}`);
      this.loaded = await Hf[E], this.blueprintLoaded(this.loaded);
    }
    return this.loaded;
  }
}
var ho = zn.elementCreator({ tag: "xin-blueprint", styleSpec: { ":host": { display: "none" } } });

class Xf extends R {
  allLoaded = () => {};
  constructor() {
    super();
  }
  async load() {
    let f = Array.from(this.querySelectorAll(zn.tagName)).filter((o) => o.src).map((o) => o.packaged());
    await Promise.all(f), this.allLoaded();
  }
  connectedCallback() {
    super.connectedCallback(), this.load();
  }
}
var po = Xf.elementCreator({ tag: "xin-loader", styleSpec: { ":host": { display: "none" } } });

// node_modules/marked/lib/marked.esm.js
function L() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var T2 = L();
function G2(l2) {
  T2 = l2;
}
var E = { exec: () => null };
function d2(l2, e2 = "") {
  let t2 = typeof l2 == "string" ? l2 : l2.source, n = { replace: (r2, i) => {
    let s2 = typeof i == "string" ? i : i.source;
    return s2 = s2.replace(m.caret, "$1"), t2 = t2.replace(r2, s2), n;
  }, getRegex: () => new RegExp(t2, e2) };
  return n;
}
var be = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return false;
  }
})();
var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (l2) => new RegExp(`^( {0,3}${l2})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}#`), htmlBeginRegex: (l2) => new RegExp(`^ {0,${Math.min(3, l2 - 1)}}<(?:[a-z].*>|!--)`, "i") };
var Re = /^(?:[ \t]*(?:\n|$))+/;
var Te = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var Oe = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var I2 = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var we = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var F = /(?:[*+-]|\d{1,9}[.)])/;
var ie = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var oe = d2(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var ye = d2(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var j2 = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var Pe = /^[^\n]+/;
var Q = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var Se = d2(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Q).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var $e = d2(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, F).getRegex();
var v2 = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var U2 = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var _e = d2("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))", "i").replace("comment", U2).replace("tag", v2).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var ae = d2(j2).replace("hr", I2).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v2).getRegex();
var Le = d2(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ae).getRegex();
var K2 = { blockquote: Le, code: Te, def: Se, fences: Oe, heading: we, hr: I2, html: _e, lheading: oe, list: $e, newline: Re, paragraph: ae, table: E, text: Pe };
var re = d2("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", I2).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}\t)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v2).getRegex();
var Me = { ...K2, lheading: ye, table: re, paragraph: d2(j2).replace("hr", I2).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v2).getRegex() };
var ze = { ...K2, html: d2(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U2).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: E, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: d2(j2).replace("hr", I2).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", oe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var Ae = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var Ee = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var le = /^( {2,}|\\)\n(?!\s*$)/;
var Ie = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var D = /[\p{P}\p{S}]/u;
var W2 = /[\s\p{P}\p{S}]/u;
var ue = /[^\s\p{P}\p{S}]/u;
var Ce = d2(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, W2).getRegex();
var pe = /(?!~)[\p{P}\p{S}]/u;
var Be = /(?!~)[\s\p{P}\p{S}]/u;
var qe = /(?:[^\s\p{P}\p{S}]|~)/u;
var ve = d2(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", be ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ce = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var De = d2(ce, "u").replace(/punct/g, D).getRegex();
var He = d2(ce, "u").replace(/punct/g, pe).getRegex();
var he = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var Ze = d2(he, "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W2).replace(/punct/g, D).getRegex();
var Ge = d2(he, "gu").replace(/notPunctSpace/g, qe).replace(/punctSpace/g, Be).replace(/punct/g, pe).getRegex();
var Ne = d2("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W2).replace(/punct/g, D).getRegex();
var Fe = d2(/\\(punct)/, "gu").replace(/punct/g, D).getRegex();
var je = d2(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var Qe = d2(U2).replace("(?:-->|$)", "-->").getRegex();
var Ue = d2("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Qe).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var q2 = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/;
var Ke = d2(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q2).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var de = d2(/^!?\[(label)\]\[(ref)\]/).replace("label", q2).replace("ref", Q).getRegex();
var ke = d2(/^!?\[(ref)\](?:\[\])?/).replace("ref", Q).getRegex();
var We = d2("reflink|nolink(?!\\()", "g").replace("reflink", de).replace("nolink", ke).getRegex();
var se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var X = { _backpedal: E, anyPunctuation: Fe, autolink: je, blockSkip: ve, br: le, code: Ee, del: E, emStrongLDelim: De, emStrongRDelimAst: Ze, emStrongRDelimUnd: Ne, escape: Ae, link: Ke, nolink: ke, punctuation: Ce, reflink: de, reflinkSearch: We, tag: Ue, text: Ie, url: E };
var Xe = { ...X, link: d2(/^!?\[(label)\]\((.*?)\)/).replace("label", q2).getRegex(), reflink: d2(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q2).getRegex() };
var N = { ...X, emStrongRDelimAst: Ge, emStrongLDelim: He, url: d2(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: d2(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", se).getRegex() };
var Je = { ...N, br: d2(le).replace("{2,}", "*").getRegex(), text: d2(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var C = { normal: K2, gfm: Me, pedantic: ze };
var M = { normal: X, gfm: N, breaks: Je, pedantic: Xe };
var Ve = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ge = (l2) => Ve[l2];
function w(l2, e2) {
  if (e2) {
    if (m.escapeTest.test(l2))
      return l2.replace(m.escapeReplace, ge);
  } else if (m.escapeTestNoEncode.test(l2))
    return l2.replace(m.escapeReplaceNoEncode, ge);
  return l2;
}
function J(l2) {
  try {
    l2 = encodeURI(l2).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return l2;
}
function V2(l2, e2) {
  let t2 = l2.replace(m.findPipe, (i, s2, a2) => {
    let o = false, p2 = s2;
    for (;--p2 >= 0 && a2[p2] === "\\"; )
      o = !o;
    return o ? "|" : " |";
  }), n = t2.split(m.splitPipe), r2 = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e2)
    if (n.length > e2)
      n.splice(e2);
    else
      for (;n.length < e2; )
        n.push("");
  for (;r2 < n.length; r2++)
    n[r2] = n[r2].trim().replace(m.slashPipe, "|");
  return n;
}
function z2(l2, e2, t2) {
  let n = l2.length;
  if (n === 0)
    return "";
  let r2 = 0;
  for (;r2 < n; ) {
    let i = l2.charAt(n - r2 - 1);
    if (i === e2 && !t2)
      r2++;
    else if (i !== e2 && t2)
      r2++;
    else
      break;
  }
  return l2.slice(0, n - r2);
}
function fe(l2, e2) {
  if (l2.indexOf(e2[1]) === -1)
    return -1;
  let t2 = 0;
  for (let n = 0;n < l2.length; n++)
    if (l2[n] === "\\")
      n++;
    else if (l2[n] === e2[0])
      t2++;
    else if (l2[n] === e2[1] && (t2--, t2 < 0))
      return n;
  return t2 > 0 ? -2 : -1;
}
function me(l2, e2, t2, n, r2) {
  let i = e2.href, s2 = e2.title || null, a2 = l2[1].replace(r2.other.outputLinkReplace, "$1");
  n.state.inLink = true;
  let o = { type: l2[0].charAt(0) === "!" ? "image" : "link", raw: t2, href: i, title: s2, text: a2, tokens: n.inlineTokens(a2) };
  return n.state.inLink = false, o;
}
function Ye(l2, e2, t2) {
  let n = l2.match(t2.other.indentCodeCompensation);
  if (n === null)
    return e2;
  let r2 = n[1];
  return e2.split(`
`).map((i) => {
    let s2 = i.match(t2.other.beginningSpace);
    if (s2 === null)
      return i;
    let [a2] = s2;
    return a2.length >= r2.length ? i.slice(r2.length) : i;
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
      let n = t2[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t2[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : z2(n, `
`) };
    }
  }
  fences(e2) {
    let t2 = this.rules.block.fences.exec(e2);
    if (t2) {
      let n = t2[0], r2 = Ye(n, t2[3] || "", this.rules);
      return { type: "code", raw: n, lang: t2[2] ? t2[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t2[2], text: r2 };
    }
  }
  heading(e2) {
    let t2 = this.rules.block.heading.exec(e2);
    if (t2) {
      let n = t2[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r2 = z2(n, "#");
        (this.options.pedantic || !r2 || this.rules.other.endingSpaceChar.test(r2)) && (n = r2.trim());
      }
      return { type: "heading", raw: t2[0], depth: t2[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e2) {
    let t2 = this.rules.block.hr.exec(e2);
    if (t2)
      return { type: "hr", raw: z2(t2[0], `
`) };
  }
  blockquote(e2) {
    let t2 = this.rules.block.blockquote.exec(e2);
    if (t2) {
      let n = z2(t2[0], `
`).split(`
`), r2 = "", i = "", s2 = [];
      for (;n.length > 0; ) {
        let a2 = false, o = [], p2;
        for (p2 = 0;p2 < n.length; p2++)
          if (this.rules.other.blockquoteStart.test(n[p2]))
            o.push(n[p2]), a2 = true;
          else if (!a2)
            o.push(n[p2]);
          else
            break;
        n = n.slice(p2);
        let u2 = o.join(`
`), c = u2.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r2 = r2 ? `${r2}
${u2}` : u2, i = i ? `${i}
${c}` : c;
        let g2 = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(c, s2, true), this.lexer.state.top = g2, n.length === 0)
          break;
        let h2 = s2.at(-1);
        if (h2?.type === "code")
          break;
        if (h2?.type === "blockquote") {
          let R2 = h2, f = R2.raw + `
` + n.join(`
`), O2 = this.blockquote(f);
          s2[s2.length - 1] = O2, r2 = r2.substring(0, r2.length - R2.raw.length) + O2.raw, i = i.substring(0, i.length - R2.text.length) + O2.text;
          break;
        } else if (h2?.type === "list") {
          let R2 = h2, f = R2.raw + `
` + n.join(`
`), O2 = this.list(f);
          s2[s2.length - 1] = O2, r2 = r2.substring(0, r2.length - h2.raw.length) + O2.raw, i = i.substring(0, i.length - R2.raw.length) + O2.raw, n = f.substring(s2.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r2, tokens: s2, text: i };
    }
  }
  list(e2) {
    let t2 = this.rules.block.list.exec(e2);
    if (t2) {
      let n = t2[1].trim(), r2 = n.length > 1, i = { type: "list", raw: "", ordered: r2, start: r2 ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = r2 ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r2 ? n : "[*+-]");
      let s2 = this.rules.other.listItemRegex(n), a2 = false;
      for (;e2; ) {
        let p2 = false, u2 = "", c = "";
        if (!(t2 = s2.exec(e2)) || this.rules.block.hr.test(e2))
          break;
        u2 = t2[0], e2 = e2.substring(u2.length);
        let g2 = t2[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (H) => " ".repeat(3 * H.length)), h2 = e2.split(`
`, 1)[0], R2 = !g2.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, c = g2.trimStart()) : R2 ? f = t2[1].length + 1 : (f = t2[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, c = g2.slice(f), f += t2[1].length), R2 && this.rules.other.blankLine.test(h2) && (u2 += h2 + `
`, e2 = e2.substring(h2.length + 1), p2 = true), !p2) {
          let H = this.rules.other.nextBulletRegex(f), ee = this.rules.other.hrRegex(f), te = this.rules.other.fencesBeginRegex(f), ne = this.rules.other.headingBeginRegex(f), xe = this.rules.other.htmlBeginRegex(f);
          for (;e2; ) {
            let Z2 = e2.split(`
`, 1)[0], A2;
            if (h2 = Z2, this.options.pedantic ? (h2 = h2.replace(this.rules.other.listReplaceNesting, "  "), A2 = h2) : A2 = h2.replace(this.rules.other.tabCharGlobal, "    "), te.test(h2) || ne.test(h2) || xe.test(h2) || H.test(h2) || ee.test(h2))
              break;
            if (A2.search(this.rules.other.nonSpaceChar) >= f || !h2.trim())
              c += `
` + A2.slice(f);
            else {
              if (R2 || g2.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || te.test(g2) || ne.test(g2) || ee.test(g2))
                break;
              c += `
` + h2;
            }
            !R2 && !h2.trim() && (R2 = true), u2 += Z2 + `
`, e2 = e2.substring(Z2.length + 1), g2 = A2.slice(f);
          }
        }
        i.loose || (a2 ? i.loose = true : this.rules.other.doubleBlankLine.test(u2) && (a2 = true));
        let O2 = null, Y;
        this.options.gfm && (O2 = this.rules.other.listIsTask.exec(c), O2 && (Y = O2[0] !== "[ ] ", c = c.replace(this.rules.other.listReplaceTask, ""))), i.items.push({ type: "list_item", raw: u2, task: !!O2, checked: Y, loose: false, text: c, tokens: [] }), i.raw += u2;
      }
      let o = i.items.at(-1);
      if (o)
        o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else
        return;
      i.raw = i.raw.trimEnd();
      for (let p2 = 0;p2 < i.items.length; p2++)
        if (this.lexer.state.top = false, i.items[p2].tokens = this.lexer.blockTokens(i.items[p2].text, []), !i.loose) {
          let u2 = i.items[p2].tokens.filter((g2) => g2.type === "space"), c = u2.length > 0 && u2.some((g2) => this.rules.other.anyLine.test(g2.raw));
          i.loose = c;
        }
      if (i.loose)
        for (let p2 = 0;p2 < i.items.length; p2++)
          i.items[p2].loose = true;
      return i;
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
      let n = t2[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r2 = t2[2] ? t2[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t2[3] ? t2[3].substring(1, t2[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t2[3];
      return { type: "def", tag: n, raw: t2[0], href: r2, title: i };
    }
  }
  table(e2) {
    let t2 = this.rules.block.table.exec(e2);
    if (!t2 || !this.rules.other.tableDelimiter.test(t2[2]))
      return;
    let n = V2(t2[1]), r2 = t2[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t2[3]?.trim() ? t2[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s2 = { type: "table", raw: t2[0], header: [], align: [], rows: [] };
    if (n.length === r2.length) {
      for (let a2 of r2)
        this.rules.other.tableAlignRight.test(a2) ? s2.align.push("right") : this.rules.other.tableAlignCenter.test(a2) ? s2.align.push("center") : this.rules.other.tableAlignLeft.test(a2) ? s2.align.push("left") : s2.align.push(null);
      for (let a2 = 0;a2 < n.length; a2++)
        s2.header.push({ text: n[a2], tokens: this.lexer.inline(n[a2]), header: true, align: s2.align[a2] });
      for (let a2 of i)
        s2.rows.push(V2(a2, s2.header.length).map((o, p2) => ({ text: o, tokens: this.lexer.inline(o), header: false, align: s2.align[p2] })));
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
      let n = t2[1].charAt(t2[1].length - 1) === `
` ? t2[1].slice(0, -1) : t2[1];
      return { type: "paragraph", raw: t2[0], text: n, tokens: this.lexer.inline(n) };
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
      let n = t2[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n))
          return;
        let s2 = z2(n.slice(0, -1), "\\");
        if ((n.length - s2.length) % 2 === 0)
          return;
      } else {
        let s2 = fe(t2[2], "()");
        if (s2 === -2)
          return;
        if (s2 > -1) {
          let o = (t2[0].indexOf("!") === 0 ? 5 : 4) + t2[1].length + s2;
          t2[2] = t2[2].substring(0, s2), t2[0] = t2[0].substring(0, o).trim(), t2[3] = "";
        }
      }
      let r2 = t2[2], i = "";
      if (this.options.pedantic) {
        let s2 = this.rules.other.pedanticHrefTitle.exec(r2);
        s2 && (r2 = s2[1], i = s2[3]);
      } else
        i = t2[3] ? t2[3].slice(1, -1) : "";
      return r2 = r2.trim(), this.rules.other.startAngleBracket.test(r2) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r2 = r2.slice(1) : r2 = r2.slice(1, -1)), me(t2, { href: r2 && r2.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t2[0], this.lexer, this.rules);
    }
  }
  reflink(e2, t2) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e2)) || (n = this.rules.inline.nolink.exec(e2))) {
      let r2 = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t2[r2.toLowerCase()];
      if (!i) {
        let s2 = n[0].charAt(0);
        return { type: "text", raw: s2, text: s2 };
      }
      return me(n, i, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e2, t2, n = "") {
    let r2 = this.rules.inline.emStrongLDelim.exec(e2);
    if (!r2 || r2[3] && n.match(this.rules.other.unicodeAlphaNumeric))
      return;
    if (!(r2[1] || r2[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let s2 = [...r2[0]].length - 1, a2, o, p2 = s2, u2 = 0, c = r2[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c.lastIndex = 0, t2 = t2.slice(-1 * e2.length + s2);(r2 = c.exec(t2)) != null; ) {
        if (a2 = r2[1] || r2[2] || r2[3] || r2[4] || r2[5] || r2[6], !a2)
          continue;
        if (o = [...a2].length, r2[3] || r2[4]) {
          p2 += o;
          continue;
        } else if ((r2[5] || r2[6]) && s2 % 3 && !((s2 + o) % 3)) {
          u2 += o;
          continue;
        }
        if (p2 -= o, p2 > 0)
          continue;
        o = Math.min(o, o + p2 + u2);
        let g2 = [...r2[0]][0].length, h2 = e2.slice(0, s2 + r2.index + g2 + o);
        if (Math.min(s2, o) % 2) {
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
      let n = t2[2].replace(this.rules.other.newLineCharGlobal, " "), r2 = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return r2 && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t2[0], text: n };
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
      let n, r2;
      return t2[2] === "@" ? (n = t2[1], r2 = "mailto:" + n) : (n = t2[1], r2 = n), { type: "link", raw: t2[0], text: n, href: r2, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e2) {
    let t2;
    if (t2 = this.rules.inline.url.exec(e2)) {
      let n, r2;
      if (t2[2] === "@")
        n = t2[0], r2 = "mailto:" + n;
      else {
        let i;
        do
          i = t2[0], t2[0] = this.rules.inline._backpedal.exec(t2[0])?.[0] ?? "";
        while (i !== t2[0]);
        n = t2[0], t2[1] === "www." ? r2 = "http://" + t2[0] : r2 = t2[0];
      }
      return { type: "link", raw: t2[0], text: n, href: r2, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e2) {
    let t2 = this.rules.inline.text.exec(e2);
    if (t2) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t2[0], text: t2[0], escaped: n };
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
    let t2 = { other: m, block: C.normal, inline: M.normal };
    this.options.pedantic ? (t2.block = C.pedantic, t2.inline = M.pedantic) : this.options.gfm && (t2.block = C.gfm, this.options.breaks ? t2.inline = M.breaks : t2.inline = M.gfm), this.tokenizer.rules = t2;
  }
  static get rules() {
    return { block: C, inline: M };
  }
  static lex(e2, t2) {
    return new l2(t2).lex(e2);
  }
  static lexInline(e2, t2) {
    return new l2(t2).inlineTokens(e2);
  }
  lex(e2) {
    e2 = e2.replace(m.carriageReturn, `
`), this.blockTokens(e2, this.tokens);
    for (let t2 = 0;t2 < this.inlineQueue.length; t2++) {
      let n = this.inlineQueue[t2];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e2, t2 = [], n = false) {
    for (this.options.pedantic && (e2 = e2.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, ""));e2; ) {
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
      let i = e2;
      if (this.options.extensions?.startBlock) {
        let s2 = 1 / 0, a2 = e2.slice(1), o;
        this.options.extensions.startBlock.forEach((p2) => {
          o = p2.call({ lexer: this }, a2), typeof o == "number" && o >= 0 && (s2 = Math.min(s2, o));
        }), s2 < 1 / 0 && s2 >= 0 && (i = e2.substring(0, s2 + 1));
      }
      if (this.state.top && (r2 = this.tokenizer.paragraph(i))) {
        let s2 = t2.at(-1);
        n && s2?.type === "paragraph" ? (s2.raw += (s2.raw.endsWith(`
`) ? "" : `
`) + r2.raw, s2.text += `
` + r2.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s2.text) : t2.push(r2), n = i.length !== e2.length, e2 = e2.substring(r2.raw.length);
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
    let n = e2, r2 = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0)
        for (;(r2 = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; )
          o.includes(r2[0].slice(r2[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r2.index) + "[" + "a".repeat(r2[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (;(r2 = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; )
      n = n.slice(0, r2.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (;(r2 = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; )
      i = r2[2] ? r2[2].length : 0, n = n.slice(0, r2.index + i) + "[" + "a".repeat(r2[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let s2 = false, a2 = "";
    for (;e2; ) {
      s2 || (a2 = ""), s2 = false;
      let o;
      if (this.options.extensions?.inline?.some((u2) => (o = u2.call({ lexer: this }, e2, t2)) ? (e2 = e2.substring(o.raw.length), t2.push(o), true) : false))
        continue;
      if (o = this.tokenizer.escape(e2)) {
        e2 = e2.substring(o.raw.length), t2.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e2)) {
        e2 = e2.substring(o.raw.length), t2.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e2)) {
        e2 = e2.substring(o.raw.length), t2.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e2, this.tokens.links)) {
        e2 = e2.substring(o.raw.length);
        let u2 = t2.at(-1);
        o.type === "text" && u2?.type === "text" ? (u2.raw += o.raw, u2.text += o.text) : t2.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e2, n, a2)) {
        e2 = e2.substring(o.raw.length), t2.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e2)) {
        e2 = e2.substring(o.raw.length), t2.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e2)) {
        e2 = e2.substring(o.raw.length), t2.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e2)) {
        e2 = e2.substring(o.raw.length), t2.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e2)) {
        e2 = e2.substring(o.raw.length), t2.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e2))) {
        e2 = e2.substring(o.raw.length), t2.push(o);
        continue;
      }
      let p2 = e2;
      if (this.options.extensions?.startInline) {
        let u2 = 1 / 0, c = e2.slice(1), g2;
        this.options.extensions.startInline.forEach((h2) => {
          g2 = h2.call({ lexer: this }, c), typeof g2 == "number" && g2 >= 0 && (u2 = Math.min(u2, g2));
        }), u2 < 1 / 0 && u2 >= 0 && (p2 = e2.substring(0, u2 + 1));
      }
      if (o = this.tokenizer.inlineText(p2)) {
        e2 = e2.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a2 = o.raw.slice(-1)), s2 = true;
        let u2 = t2.at(-1);
        u2?.type === "text" ? (u2.raw += o.raw, u2.text += o.text) : t2.push(o);
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
  code({ text: e2, lang: t2, escaped: n }) {
    let r2 = (t2 || "").match(m.notSpaceStart)?.[0], i = e2.replace(m.endingNewline, "") + `
`;
    return r2 ? '<pre><code class="language-' + w(r2) + '">' + (n ? i : w(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : w(i, true)) + `</code></pre>
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
    let { ordered: t2, start: n } = e2, r2 = "";
    for (let a2 = 0;a2 < e2.items.length; a2++) {
      let o = e2.items[a2];
      r2 += this.listitem(o);
    }
    let i = t2 ? "ol" : "ul", s2 = t2 && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + s2 + `>
` + r2 + "</" + i + `>
`;
  }
  listitem(e2) {
    let t2 = "";
    if (e2.task) {
      let n = this.checkbox({ checked: !!e2.checked });
      e2.loose ? e2.tokens[0]?.type === "paragraph" ? (e2.tokens[0].text = n + " " + e2.tokens[0].text, e2.tokens[0].tokens && e2.tokens[0].tokens.length > 0 && e2.tokens[0].tokens[0].type === "text" && (e2.tokens[0].tokens[0].text = n + " " + w(e2.tokens[0].tokens[0].text), e2.tokens[0].tokens[0].escaped = true)) : e2.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: true }) : t2 += n + " ";
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
    let t2 = "", n = "";
    for (let i = 0;i < e2.header.length; i++)
      n += this.tablecell(e2.header[i]);
    t2 += this.tablerow({ text: n });
    let r2 = "";
    for (let i = 0;i < e2.rows.length; i++) {
      let s2 = e2.rows[i];
      n = "";
      for (let a2 = 0;a2 < s2.length; a2++)
        n += this.tablecell(s2[a2]);
      r2 += this.tablerow({ text: n });
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
    let t2 = this.parser.parseInline(e2.tokens), n = e2.header ? "th" : "td";
    return (e2.align ? `<${n} align="${e2.align}">` : `<${n}>`) + t2 + `</${n}>
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
  link({ href: e2, title: t2, tokens: n }) {
    let r2 = this.parser.parseInline(n), i = J(e2);
    if (i === null)
      return r2;
    e2 = i;
    let s2 = '<a href="' + e2 + '"';
    return t2 && (s2 += ' title="' + w(t2) + '"'), s2 += ">" + r2 + "</a>", s2;
  }
  image({ href: e2, title: t2, text: n, tokens: r2 }) {
    r2 && (n = this.parser.parseInline(r2, this.parser.textRenderer));
    let i = J(e2);
    if (i === null)
      return w(n);
    e2 = i;
    let s2 = `<img src="${e2}" alt="${n}"`;
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
    let n = "";
    for (let r2 = 0;r2 < e2.length; r2++) {
      let i = e2[r2];
      if (this.options.extensions?.renderers?.[i.type]) {
        let a2 = i, o = this.options.extensions.renderers[a2.type].call({ parser: this }, a2);
        if (o !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a2.type)) {
          n += o || "";
          continue;
        }
      }
      let s2 = i;
      switch (s2.type) {
        case "space": {
          n += this.renderer.space(s2);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(s2);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(s2);
          continue;
        }
        case "code": {
          n += this.renderer.code(s2);
          continue;
        }
        case "table": {
          n += this.renderer.table(s2);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(s2);
          continue;
        }
        case "list": {
          n += this.renderer.list(s2);
          continue;
        }
        case "html": {
          n += this.renderer.html(s2);
          continue;
        }
        case "def": {
          n += this.renderer.def(s2);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(s2);
          continue;
        }
        case "text": {
          let a2 = s2, o = this.renderer.text(a2);
          for (;r2 + 1 < e2.length && e2[r2 + 1].type === "text"; )
            a2 = e2[++r2], o += `
` + this.renderer.text(a2);
          t2 ? n += this.renderer.paragraph({ type: "paragraph", raw: o, text: o, tokens: [{ type: "text", raw: o, text: o, escaped: true }] }) : n += o;
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
    return n;
  }
  parseInline(e2, t2 = this.renderer) {
    let n = "";
    for (let r2 = 0;r2 < e2.length; r2++) {
      let i = e2[r2];
      if (this.options.extensions?.renderers?.[i.type]) {
        let a2 = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (a2 !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += a2 || "";
          continue;
        }
      }
      let s2 = i;
      switch (s2.type) {
        case "escape": {
          n += t2.text(s2);
          break;
        }
        case "html": {
          n += t2.html(s2);
          break;
        }
        case "link": {
          n += t2.link(s2);
          break;
        }
        case "image": {
          n += t2.image(s2);
          break;
        }
        case "strong": {
          n += t2.strong(s2);
          break;
        }
        case "em": {
          n += t2.em(s2);
          break;
        }
        case "codespan": {
          n += t2.codespan(s2);
          break;
        }
        case "br": {
          n += t2.br(s2);
          break;
        }
        case "del": {
          n += t2.del(s2);
          break;
        }
        case "text": {
          n += t2.text(s2);
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
    return n;
  }
};
var S2 = class {
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
var B2 = class {
  defaults = L();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b2;
  Renderer = P2;
  TextRenderer = $;
  Lexer = x2;
  Tokenizer = y;
  Hooks = S2;
  constructor(...e2) {
    this.use(...e2);
  }
  walkTokens(e2, t2) {
    let n = [];
    for (let r2 of e2)
      switch (n = n.concat(t2.call(this, r2)), r2.type) {
        case "table": {
          let i = r2;
          for (let s2 of i.header)
            n = n.concat(this.walkTokens(s2.tokens, t2));
          for (let s2 of i.rows)
            for (let a2 of s2)
              n = n.concat(this.walkTokens(a2.tokens, t2));
          break;
        }
        case "list": {
          let i = r2;
          n = n.concat(this.walkTokens(i.items, t2));
          break;
        }
        default: {
          let i = r2;
          this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s2) => {
            let a2 = i[s2].flat(1 / 0);
            n = n.concat(this.walkTokens(a2, t2));
          }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t2)));
        }
      }
    return n;
  }
  use(...e2) {
    let t2 = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e2.forEach((n) => {
      let r2 = { ...n };
      if (r2.async = this.defaults.async || r2.async || false, n.extensions && (n.extensions.forEach((i) => {
        if (!i.name)
          throw new Error("extension name required");
        if ("renderer" in i) {
          let s2 = t2.renderers[i.name];
          s2 ? t2.renderers[i.name] = function(...a2) {
            let o = i.renderer.apply(this, a2);
            return o === false && (o = s2.apply(this, a2)), o;
          } : t2.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          let s2 = t2[i.level];
          s2 ? s2.unshift(i.tokenizer) : t2[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t2.startBlock ? t2.startBlock.push(i.start) : t2.startBlock = [i.start] : i.level === "inline" && (t2.startInline ? t2.startInline.push(i.start) : t2.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (t2.childTokens[i.name] = i.childTokens);
      }), r2.extensions = t2), n.renderer) {
        let i = this.defaults.renderer || new P2(this.defaults);
        for (let s2 in n.renderer) {
          if (!(s2 in i))
            throw new Error(`renderer '${s2}' does not exist`);
          if (["options", "parser"].includes(s2))
            continue;
          let a2 = s2, o = n.renderer[a2], p2 = i[a2];
          i[a2] = (...u2) => {
            let c = o.apply(i, u2);
            return c === false && (c = p2.apply(i, u2)), c || "";
          };
        }
        r2.renderer = i;
      }
      if (n.tokenizer) {
        let i = this.defaults.tokenizer || new y(this.defaults);
        for (let s2 in n.tokenizer) {
          if (!(s2 in i))
            throw new Error(`tokenizer '${s2}' does not exist`);
          if (["options", "rules", "lexer"].includes(s2))
            continue;
          let a2 = s2, o = n.tokenizer[a2], p2 = i[a2];
          i[a2] = (...u2) => {
            let c = o.apply(i, u2);
            return c === false && (c = p2.apply(i, u2)), c;
          };
        }
        r2.tokenizer = i;
      }
      if (n.hooks) {
        let i = this.defaults.hooks || new S2;
        for (let s2 in n.hooks) {
          if (!(s2 in i))
            throw new Error(`hook '${s2}' does not exist`);
          if (["options", "block"].includes(s2))
            continue;
          let a2 = s2, o = n.hooks[a2], p2 = i[a2];
          S2.passThroughHooks.has(s2) ? i[a2] = (u2) => {
            if (this.defaults.async && S2.passThroughHooksRespectAsync.has(s2))
              return (async () => {
                let g2 = await o.call(i, u2);
                return p2.call(i, g2);
              })();
            let c = o.call(i, u2);
            return p2.call(i, c);
          } : i[a2] = (...u2) => {
            if (this.defaults.async)
              return (async () => {
                let g2 = await o.apply(i, u2);
                return g2 === false && (g2 = await p2.apply(i, u2)), g2;
              })();
            let c = o.apply(i, u2);
            return c === false && (c = p2.apply(i, u2)), c;
          };
        }
        r2.hooks = i;
      }
      if (n.walkTokens) {
        let i = this.defaults.walkTokens, s2 = n.walkTokens;
        r2.walkTokens = function(a2) {
          let o = [];
          return o.push(s2.call(this, a2)), i && (o = o.concat(i.call(this, a2))), o;
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
    return (n, r2) => {
      let i = { ...r2 }, s2 = { ...this.defaults, ...i }, a2 = this.onError(!!s2.silent, !!s2.async);
      if (this.defaults.async === true && i.async === false)
        return a2(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null)
        return a2(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string")
        return a2(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      if (s2.hooks && (s2.hooks.options = s2, s2.hooks.block = e2), s2.async)
        return (async () => {
          let o = s2.hooks ? await s2.hooks.preprocess(n) : n, u2 = await (s2.hooks ? await s2.hooks.provideLexer() : e2 ? x2.lex : x2.lexInline)(o, s2), c = s2.hooks ? await s2.hooks.processAllTokens(u2) : u2;
          s2.walkTokens && await Promise.all(this.walkTokens(c, s2.walkTokens));
          let h2 = await (s2.hooks ? await s2.hooks.provideParser() : e2 ? b2.parse : b2.parseInline)(c, s2);
          return s2.hooks ? await s2.hooks.postprocess(h2) : h2;
        })().catch(a2);
      try {
        s2.hooks && (n = s2.hooks.preprocess(n));
        let p2 = (s2.hooks ? s2.hooks.provideLexer() : e2 ? x2.lex : x2.lexInline)(n, s2);
        s2.hooks && (p2 = s2.hooks.processAllTokens(p2)), s2.walkTokens && this.walkTokens(p2, s2.walkTokens);
        let c = (s2.hooks ? s2.hooks.provideParser() : e2 ? b2.parse : b2.parseInline)(p2, s2);
        return s2.hooks && (c = s2.hooks.postprocess(c)), c;
      } catch (o) {
        return a2(o);
      }
    };
  }
  onError(e2, t2) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e2) {
        let r2 = "<p>An error occurred:</p><pre>" + w(n.message + "", true) + "</pre>";
        return t2 ? Promise.resolve(r2) : r2;
      }
      if (t2)
        return Promise.reject(n);
      throw n;
    };
  }
};
var _2 = new B2;
function k(l4, e2) {
  return _2.parse(l4, e2);
}
k.options = k.setOptions = function(l4) {
  return _2.setOptions(l4), k.defaults = _2.defaults, G2(k.defaults), k;
};
k.getDefaults = L;
k.defaults = T2;
k.use = function(...l4) {
  return _2.use(...l4), k.defaults = _2.defaults, G2(k.defaults), k;
};
k.walkTokens = function(l4, e2) {
  return _2.walkTokens(l4, e2);
};
k.parseInline = _2.parseInline;
k.Parser = b2;
k.parser = b2.parse;
k.Renderer = P2;
k.TextRenderer = $;
k.Lexer = x2;
k.lexer = x2.lex;
k.Tokenizer = y;
k.Hooks = S2;
k.parse = k;
var Zt = k.options;
var Gt = k.setOptions;
var Nt = k.use;
var Ft = k.walkTokens;
var jt = k.parseInline;
var Ut = b2.parse;
var Kt = x2.lex;

// node_modules/tosijs-ui/dist/index.js
var G4 = Object.defineProperty;
var U4 = (i) => i;
function Z4(i, l4) {
  this[i] = U4.bind(null, l4);
}
var X4 = (i, l4) => {
  for (var s2 in l4)
    G4(i, s2, { get: l4[s2], enumerable: true, configurable: true, set: Z4.bind(l4, s2) });
};
var n2 = {};

class _1 extends R {
  static set conditions(i) {
    Object.assign(n2, i);
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
function Z2(i, l4) {
  if (D1[i] === undefined) {
    if (l4 !== undefined) {
      let o = globalThis[l4];
      D1[i] = Promise.resolve({ [l4]: o });
    }
    let s2 = T.script({ src: i });
    document.head.append(s2), D1[i] = new Promise((o) => {
      s2.onload = () => o(globalThis);
    });
  }
  return D1[i];
}
var t2 = {};
function c2(i) {
  if (t2[i] === undefined) {
    let l4 = T.link({ rel: "stylesheet", type: "text/css", href: i });
    document.head.append(l4), t2[i] = new Promise((s2) => {
      l4.onload = s2;
    });
  }
  return t2[i];
}
var O1 = { earth: '<svg class="color" viewBox="0 0 48 48"><g><g><g><path style="fill:#a3d9ff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M7,13.46 C5.1,16.52,4,20.13,4,24 C4,31.81,8.47,38.57,15,41.87 C15,41.87,15,31,15,31 C15,31,9,29,9,29 C9,29,9,19,9,19 C9,19,7,15,7,15 C7,15,7,13.46,7,13.46 z"/><path style="fill:#a3d9ff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M18.4,4.79 C20.18,4.28,22.06,4,24,4 C27.57,4,30.92,4.93,33.82,6.57 C33.82,6.57,29,13,29,13 C29,13,31,19,31,19 C31,19,37,21,37,21 C37,21,39,29,39,29 C39,29,37.35,38.89,37.35,38.89 C33.81,42.07,29.13,44,24,44 C21.03,44,18.22,43.35,15.69,42.2 C15.69,42.2,27,29,27,29 C27,29,27,25,27,25 C27,25,21,23,21,23 C21,23,15,19,15,19 C15,19,11,19,11,19 C11,19,11,13,11,13 C11,13,13,11,13,11 C13,11,15,15,15,15 C15,15,17,15,17,15 C17,15,17,9,17,9 C17,9,18.4,4.79,18.4,4.79 z"/><path style="fill:#274e42;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M18.4,4.79 C18.4,4.79,17,9,17,9 C17,9,17,15,17,15 C17,15,15,15,15,15 C15,15,13,11,13,11 C13,11,11,13,11,13 C11,13,11,19,11,19 C11,19,15,19,15,19 C15,19,21,23,21,23 C21,23,27,25,27,25 C27,25,27,29,27,29 C27,29,15.69,42.2,15.69,42.2 C15.46,42.09,15.23,41.98,15,41.87 C15,41.87,15,31,15,31 C15,31,9,29,9,29 C9,29,9,19,9,19 C9,19,7,15,7,15 C7,15,7,13.46,7,13.46 C9.57,9.32,13.62,6.19,18.4,4.79 z"/><path style="fill:#274e42;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M33.82,6.57 C33.82,6.57,29,13,29,13 C29,13,31,19,31,19 C31,19,37,21,37,21 C37,21,39,29,39,29 C39,29,37.35,38.89,37.35,38.89 C41.43,35.23,44,29.91,44,24 C44,16.52,39.9,10,33.82,6.57 z"/></g></g></g></svg> ', blueprint: '<svg class="color" viewBox="0 0 24 24"><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M10.5,14.5 C10.5,14.5,7.5,15.5,7.5,17.5 C7.5,19.5,10.5,19.5,10.5,19.5"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M18.5,14.5 C18.5,14.5,21.5,15.5,21.5,17.5 C21.5,19.5,18.5,19.5,18.5,19.5"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M7,5.09 C7,3.94,7.9,3,9,3 C9,3,20,3,20,3 C21.1,3,22,3.94,22,5.09 C22,5.09,22,12.41,22,12.41 C22,13.56,21.1,14.5,20,14.5 C20,14.5,9,14.5,9,14.5 C7.9,14.5,7,13.56,7,12.41 C7,12.41,7,5.09,7,5.09 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M14.5,5.5 C14.5,5.5,14.5,11.5,14.5,11.5"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M16.5,7.5 C16.5,7.5,16.5,8.5,16.5,8.5"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12.5,7.5 C12.5,7.5,12.5,8.5,12.5,8.5"/><g/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M18.5,21.5 C18.5,21.5,17.5,20.5,17.5,20.5 C17.5,20.5,16.5,21.5,16.5,21.5"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12.5,21.5 C12.5,21.5,11.5,20.5,11.5,20.5 C11.5,20.5,10.5,21.5,10.5,21.5"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M10.5,14.5 C10.5,14.5,18.5,14.5,18.5,14.5 C18.5,14.5,18.5,19.5,18.5,19.5 C18.5,19.5,10.5,19.5,10.5,19.5 C10.5,19.5,10.5,14.5,10.5,14.5 z"/><g><g><path style="fill:#5e78ca;fill-rule:nonzero;stroke:#f2f2f2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M14,16.5 C14,16.5,16,16.5,16,16.5 C16,16.5,14.53,19.5,14.53,19.5"/><path style="fill:#5e78ca;fill-rule:evenodd;stroke:none;" d="M3.59,8.5 C3.59,8.5,12.59,8.5,12.59,8.5 C12.59,8.5,14.53,19.5,14.53,19.5 C14.53,19.5,5.53,19.5,5.53,19.5 C5.53,19.5,3.59,8.5,3.59,8.5 z"/><path style="fill:#5e78ca;fill-rule:nonzero;stroke:#f2f2f2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12.59,8.5 C12.59,8.5,11.12,11.5,11.12,11.5 C11.12,11.5,2.12,11.5,2.12,11.5 C2.12,11.5,3.59,8.5,3.59,8.5"/><path style="fill:#5e78ca;fill-rule:nonzero;stroke:#f2f2f2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12.59,8.5 C12.59,8.5,14.53,19.5,14.53,19.5"/><path style="fill:#5e78ca;fill-rule:nonzero;stroke:#f2f2f2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M4.12,11.5 C4.12,11.5,5.53,19.5,5.53,19.5"/></g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M9.24,12.5 C10.75,12.5,12.2,13.73,12.46,15.24 C12.46,15.24,12.46,15.24,12.46,15.24 C12.68,16.49,11.85,17.5,10.6,17.5 C10.6,17.5,10.55,17.5,10.55,17.5 C10.17,17.5,9.92,17.81,9.98,18.19 C9.98,18.19,9.98,18.19,9.98,18.19 C10.21,19.47,9.36,20.5,8.08,20.5 C8.08,20.5,6.39,20.5,6.39,20.5 C5.1,20.5,3.87,19.45,3.64,18.16 C3.64,18.16,3.12,15.21,3.12,15.21 C2.86,13.71,3.86,12.5,5.35,12.5 C5.35,12.5,9.24,12.5,9.24,12.5 z"/></g></g></svg> ', tosiXr: '<svg class="color" viewBox="0 0 24 24"><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M8,14.25 C8,14.25,5,15.25,5,17.25 C5,19.25,8,19.25,8,19.25"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M16,14.25 C16,14.25,19,15.25,19,17.25 C19,19.25,16,19.25,16,19.25"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M4.5,4.85 C4.5,3.69,5.4,2.75,6.5,2.75 C6.5,2.75,17.5,2.75,17.5,2.75 C18.61,2.75,19.5,3.69,19.5,4.85 C19.5,4.85,19.5,12.16,19.5,12.16 C19.5,13.32,18.61,14.25,17.5,14.25 C17.5,14.25,6.5,14.25,6.5,14.25 C5.4,14.25,4.5,13.32,4.5,12.16 C4.5,12.16,4.5,4.85,4.5,4.85 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M12,5.25 C12,5.25,12,11.25,12,11.25"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M14,7.25 C14,7.25,14,8.25,14,8.25"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M10,7.25 C10,7.25,10,8.25,10,8.25"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M16,21.25 C16,21.25,15,20.25,15,20.25 C15,20.25,14,21.25,14,21.25"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M10,21.25 C10,21.25,9,20.25,9,20.25 C9,20.25,8,21.25,8,21.25"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1;" d="M8,14.25 C8,14.25,16,14.25,16,14.25 C16,14.25,16,19.25,16,19.25 C16,19.25,8,19.25,8,19.25 C8,19.25,8,14.25,8,14.25 z"/><path style="fill:#ff7bac;fill-opacity:0.75;fill-rule:evenodd;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-width:1;" d="M12,4 C12,4,11.99,4,11.99,4 C6.19,4,3,4.73,3,8.5 C3,11.39,4.66,13,7.27,13 C9.88,13,10.68,11.13,11.99,11.13 C11.99,11.13,12,11.13,12,11.13 C12,11.13,12.01,11.13,12.01,11.13 C13.32,11.13,14.12,13,16.73,13 C19.34,13,21,11.39,21,8.5 C21,4.73,17.81,4,12.01,4 C12.01,4,12,4,12,4 C12,4,12,4,12,4 z"/></g></svg> ', cmy: '<svg class="color filled" viewBox="0 0 24 24"><g><g><path style="fill:#00ff00;fill-rule:evenodd;" d="M12,10.88 C10.9,10.01,9.51,9.5,8,9.5 C7.22,9.5,6.47,9.64,5.78,9.89 C6.37,11.85,7.87,13.42,9.78,14.11 C10.17,12.81,10.96,11.69,12,10.88 z"/><path style="fill:#0000ff;fill-rule:evenodd;" d="M12,10.88 C13.1,10.01,14.49,9.5,16,9.5 C16.78,9.5,17.53,9.64,18.22,9.89 C17.63,11.85,16.13,13.42,14.22,14.11 C13.83,12.81,13.04,11.69,12,10.88 C12,10.88,12,10.88,12,10.88 z"/><path style="fill:#000000;fill-rule:evenodd;" d="M9.78,14.11 C10.17,12.81,10.96,11.69,12,10.88 C13.04,11.69,13.83,12.81,14.22,14.11 C13.53,14.36,12.78,14.5,12,14.5 C11.22,14.5,10.47,14.36,9.78,14.11 C9.78,14.11,9.78,14.11,9.78,14.11 z"/><path style="fill:#ff0000;fill-rule:evenodd;" d="M9.78,14.11 C9.6,14.71,9.5,15.34,9.5,16 C9.5,18.08,10.48,19.93,12,21.12 C13.52,19.93,14.5,18.08,14.5,16 C14.5,15.34,14.4,14.71,14.22,14.11 C13.53,14.36,12.78,14.5,12,14.5 C11.22,14.5,10.47,14.36,9.78,14.11 C9.78,14.11,9.78,14.11,9.78,14.11 z"/><path style="fill:#02fefe;fill-rule:evenodd;" d="M5.78,9.89 C5.6,9.29,5.5,8.66,5.5,8 C5.5,4.41,8.41,1.5,12,1.5 C15.59,1.5,18.5,4.41,18.5,8 C18.5,8.66,18.4,9.29,18.22,9.89 C17.53,9.64,16.78,9.5,16,9.5 C14.49,9.5,13.1,10.01,12,10.88 C10.9,10.01,9.51,9.5,8,9.5 C7.22,9.5,6.47,9.64,5.78,9.89 C5.78,9.89,5.78,9.89,5.78,9.89 z"/><path style="fill:#fffe00;fill-rule:evenodd;" d="M5.78,9.89 C3.28,10.8,1.5,13.19,1.5,16 C1.5,19.59,4.41,22.5,8,22.5 C9.51,22.5,10.9,21.99,12,21.12 C10.48,19.93,9.5,18.08,9.5,16 C9.5,15.34,9.6,14.71,9.78,14.11 C7.87,13.42,6.37,11.85,5.78,9.89 C5.78,9.89,5.78,9.89,5.78,9.89 z"/><path style="fill:#ff00ff;fill-rule:evenodd;" d="M18.22,9.89 C20.72,10.8,22.5,13.19,22.5,16 C22.5,19.59,19.59,22.5,16,22.5 C14.49,22.5,13.1,21.99,12,21.12 C13.52,19.93,14.5,18.08,14.5,16 C14.5,15.34,14.4,14.71,14.22,14.11 C16.13,13.42,17.63,11.85,18.22,9.89 z"/></g></g></svg> ', rgb: '<svg class="color filled" viewBox="0 0 24 24"><g><g><path style="fill:#ff00ff;fill-rule:evenodd;" d="M12,10.88 C10.9,10.01,9.51,9.5,8,9.5 C7.22,9.5,6.47,9.64,5.78,9.89 C6.37,11.85,7.87,13.42,9.78,14.11 C10.17,12.81,10.96,11.69,12,10.88 z"/><path style="fill:#ffff00;fill-rule:evenodd;" d="M12,10.88 C13.1,10.01,14.49,9.5,16,9.5 C16.78,9.5,17.53,9.64,18.22,9.89 C17.63,11.85,16.13,13.42,14.22,14.11 C13.83,12.81,13.04,11.69,12,10.88 C12,10.88,12,10.88,12,10.88 z"/><path style="fill:#ffffff;fill-rule:evenodd;" d="M9.78,14.11 C10.17,12.81,10.96,11.69,12,10.88 C13.04,11.69,13.83,12.81,14.22,14.11 C13.53,14.36,12.78,14.5,12,14.5 C11.22,14.5,10.47,14.36,9.78,14.11 C9.78,14.11,9.78,14.11,9.78,14.11 z"/><path style="fill:#00ffff;fill-rule:evenodd;" d="M9.78,14.11 C9.6,14.71,9.5,15.34,9.5,16 C9.5,18.08,10.48,19.93,12,21.12 C13.52,19.93,14.5,18.08,14.5,16 C14.5,15.34,14.4,14.71,14.22,14.11 C13.53,14.36,12.78,14.5,12,14.5 C11.22,14.5,10.47,14.36,9.78,14.11 C9.78,14.11,9.78,14.11,9.78,14.11 z"/><path style="fill:#ff0000;fill-rule:evenodd;" d="M5.78,9.89 C5.6,9.29,5.5,8.66,5.5,8 C5.5,4.41,8.41,1.5,12,1.5 C15.59,1.5,18.5,4.41,18.5,8 C18.5,8.66,18.4,9.29,18.22,9.89 C17.53,9.64,16.78,9.5,16,9.5 C14.49,9.5,13.1,10.01,12,10.88 C10.9,10.01,9.51,9.5,8,9.5 C7.22,9.5,6.47,9.64,5.78,9.89 C5.78,9.89,5.78,9.89,5.78,9.89 z"/><path style="fill:#0000ff;fill-rule:evenodd;" d="M5.78,9.89 C3.28,10.8,1.5,13.19,1.5,16 C1.5,19.59,4.41,22.5,8,22.5 C9.51,22.5,10.9,21.99,12,21.12 C10.48,19.93,9.5,18.08,9.5,16 C9.5,15.34,9.6,14.71,9.78,14.11 C7.87,13.42,6.37,11.85,5.78,9.89 C5.78,9.89,5.78,9.89,5.78,9.89 z"/><path style="fill:#00ff00;fill-rule:evenodd;" d="M18.22,9.89 C20.72,10.8,22.5,13.19,22.5,16 C22.5,19.59,19.59,22.5,16,22.5 C14.49,22.5,13.1,21.99,12,21.12 C13.52,19.93,14.5,18.08,14.5,16 C14.5,15.34,14.4,14.71,14.22,14.11 C16.13,13.42,17.63,11.85,18.22,9.89 z"/></g></g></svg> ', xrColor: '<svg class="color filled" viewBox="0 0 40 24"><g><g><g><path style="fill:#000000;fill-rule:evenodd;" d="M20,2 C19.99,2,19.98,2,19.98,2 C8.39,2,2,3.61,2,12 C2,18.41,5.32,22,10.54,22 C15.77,22,17.37,17.85,19.98,17.85 C19.98,17.85,19.99,17.85,20,17.85 C20.01,17.85,20.02,17.85,20.02,17.85 C22.63,17.85,24.23,22,29.46,22 C34.68,22,38,18.41,38,12 C38,3.61,31.61,2,20.02,2 C20.02,2,20.01,2,20,2 C20,2,20,2,20,2 z"/></g><path style="fill:#fbed21;fill-rule:evenodd;" d="M12.2,19.84 C15.79,19.39,17.07,16.46,19.07,16.46 C19.07,16.46,19.08,16.46,19.09,16.46 C19.09,16.46,19.1,16.46,19.11,16.46 C19.44,16.46,19.75,16.54,20.06,16.68 C20.37,16.54,20.68,16.46,21.01,16.46 C21.02,16.46,21.02,16.46,21.03,16.46 C21.04,16.46,21.04,16.46,21.05,16.46 C23.05,16.46,24.33,19.39,27.92,19.84 C31.66,19.4,33.98,16.5,33.98,11.62 C33.98,4.91,29.04,3.44,20.06,3.35 C11.07,3.44,6.14,4.91,6.14,11.62 C6.14,16.5,8.46,19.4,12.2,19.84 z"/><path style="fill:#8cc63f;fill-rule:evenodd;" d="M12.2,19.84 C12.52,19.87,12.86,19.89,13.21,19.89 C16.86,19.89,18.37,17.43,20.06,16.68 C19.75,16.54,19.44,16.46,19.11,16.46 C19.1,16.46,19.09,16.46,19.09,16.46 C19.08,16.46,19.07,16.46,19.07,16.46 C17.07,16.46,15.79,19.39,12.2,19.84 z"/><path style="fill:#8cc63f;fill-rule:evenodd;" d="M20.06,3.35 C20.37,3.35,20.69,3.35,21.01,3.35 C21.02,3.35,21.02,3.35,21.03,3.35 C21.03,3.35,21.03,3.35,21.03,3.35 C21.04,3.35,21.04,3.35,21.05,3.35 C30.64,3.35,35.92,4.68,35.92,11.62 C35.92,16.92,33.18,19.89,28.86,19.89 C28.53,19.89,28.22,19.87,27.92,19.84 C31.66,19.4,33.98,16.5,33.98,11.62 C33.98,4.91,29.04,3.44,20.06,3.35 C20.06,3.35,20.06,3.35,20.06,3.35 z"/><path style="fill:#ff1c23;fill-rule:evenodd;" d="M20.06,16.68 C21.74,17.43,23.25,19.89,26.91,19.89 C27.26,19.89,27.59,19.87,27.92,19.84 C24.33,19.39,23.05,16.46,21.05,16.46 C21.04,16.46,21.04,16.46,21.03,16.46 C21.02,16.46,21.02,16.46,21.01,16.46 C20.68,16.46,20.37,16.54,20.06,16.68 z"/><path style="fill:#ff1c23;fill-rule:evenodd;" d="M12.2,19.84 C11.9,19.87,11.59,19.89,11.26,19.89 C6.94,19.89,4.19,16.92,4.19,11.62 C4.19,4.68,9.48,3.35,19.07,3.35 C19.07,3.35,19.08,3.35,19.09,3.35 C19.09,3.35,19.09,3.35,19.09,3.35 C19.09,3.35,19.1,3.35,19.11,3.35 C19.43,3.35,19.75,3.35,20.06,3.35 C11.07,3.44,6.14,4.91,6.14,11.62 C6.14,16.5,8.46,19.4,12.2,19.84 z"/></g><g><path style="fill:#8cc63e;fill-rule:nonzero;" d="M22.55,8.63 C22.55,9.05,22.55,9.46,22.55,9.88 C22.54,10.25,22.85,10.56,23.2,10.55 C23.54,10.56,23.85,10.25,23.85,9.88 C23.85,9.46,23.85,9.05,23.85,8.63 C23.85,8.26,23.54,7.95,23.2,7.96 C22.85,7.95,22.54,8.26,22.55,8.63 z"/><path style="fill:#8cc63e;fill-rule:nonzero;" d="M17.32,8.63 C17.32,9.05,17.32,9.46,17.32,9.88 C17.31,10.25,17.62,10.56,17.97,10.55 C18.31,10.56,18.62,10.25,18.62,9.88 C18.62,9.46,18.62,9.05,18.62,8.63 C18.62,8.26,18.31,7.95,17.97,7.96 C17.62,7.95,17.31,8.26,17.32,8.63 z"/><path style="fill:#8cc63e;fill-rule:nonzero;" d="M19.99,4.39 C19.99,8.09,19.99,11.8,19.99,15.5 C19.99,15.87,20.3,16.18,20.64,16.17 C20.99,16.18,21.3,15.87,21.29,15.5 C21.29,11.8,21.29,8.09,21.29,4.39 C21.3,4.02,20.99,3.71,20.64,3.72 C20.3,3.71,19.99,4.02,19.99,4.39 z"/><path style="fill:#fe1a22;fill-rule:nonzero;" d="M21.43,8.63 C21.43,9.05,21.43,9.46,21.43,9.88 C21.42,10.25,21.73,10.56,22.08,10.55 C22.42,10.56,22.73,10.25,22.73,9.88 C22.73,9.46,22.73,9.05,22.73,8.63 C22.73,8.26,22.42,7.95,22.08,7.96 C21.73,7.95,21.42,8.26,21.43,8.63 z"/><path style="fill:#fe1a22;fill-rule:nonzero;" d="M16.2,8.63 C16.2,9.05,16.2,9.46,16.2,9.88 C16.19,10.25,16.5,10.56,16.85,10.55 C17.19,10.56,17.5,10.25,17.5,9.88 C17.5,9.46,17.5,9.05,17.5,8.63 C17.5,8.26,17.19,7.95,16.85,7.96 C16.5,7.95,16.19,8.26,16.2,8.63 z"/><path style="fill:#fe1a22;fill-rule:nonzero;" d="M18.87,4.39 C18.87,8.09,18.87,11.8,18.87,15.5 C18.87,15.87,19.18,16.18,19.52,16.17 C19.86,16.18,20.18,15.87,20.17,15.5 C20.17,11.8,20.17,8.09,20.17,4.39 C20.18,4.02,19.86,3.71,19.52,3.72 C19.18,3.71,18.87,4.02,18.87,4.39 z"/><path style="fill:#000000;fill-rule:nonzero;" d="M21.97,8.63 C21.97,9.05,21.97,9.46,21.97,9.88 C21.97,10.25,22.28,10.56,22.62,10.55 C22.97,10.56,23.28,10.25,23.27,9.88 C23.27,9.46,23.27,9.05,23.27,8.63 C23.28,8.26,22.97,7.95,22.62,7.96 C22.28,7.95,21.97,8.26,21.97,8.63 z"/><path style="fill:#000000;fill-rule:nonzero;" d="M16.74,8.63 C16.74,9.05,16.74,9.46,16.74,9.88 C16.74,10.25,17.05,10.56,17.39,10.55 C17.74,10.56,18.05,10.25,18.04,9.88 C18.04,9.46,18.04,9.05,18.04,8.63 C18.05,8.26,17.74,7.95,17.39,7.96 C17.05,7.95,16.74,8.26,16.74,8.63 z"/><path style="fill:#000000;fill-rule:nonzero;" d="M19.41,4.39 C19.41,8.09,19.41,11.8,19.41,15.5 C19.41,15.87,19.72,16.18,20.07,16.17 C20.41,16.18,20.72,15.87,20.72,15.5 C20.72,11.8,20.72,8.09,20.72,4.39 C20.72,4.02,20.41,3.71,20.07,3.72 C19.72,3.71,19.41,4.02,19.41,4.39 z"/></g></g></svg> ', tosiUi: '<svg class="color" viewBox="0 0 48 48"><g><g><g><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M3,33 C3,31.9,3.9,31,5,31 C5,31,43,31,43,31 C44.1,31,45,31.9,45,33 C45,33,45,43,45,43 C45,44.1,44.1,45,43,45 C43,45,5,45,5,45 C3.9,45,3,44.1,3,43 C3,43,3,33,3,33 z"/><g><path style="fill:#ffffff;fill-rule:evenodd;stroke:#ed247b;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M7,35 C7,35,7,36.34,7,38 C7,39.66,8.34,41,10,41 C11.66,41,13,39.66,13,38 C13,36.34,13,35,13,35"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#ed247b;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M17,35 C17,35,17,41,17,41"/></g><g><path style="fill:#ed247b;fill-rule:evenodd;stroke:none;" d="M38,33 C40.76,33,43,35.24,43,38 C43,40.76,40.76,43,38,43 C35.24,43,33,40.76,33,38 C33,35.24,35.24,33,38,33 z"/><path style="fill:#ed247b;fill-rule:nonzero;stroke:#ffffff;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M40,36 C40,36,36,40,36,40"/><path style="fill:#ed247b;fill-rule:nonzero;stroke:#ffffff;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M36,36 C36,36,40,40,40,40"/></g></g><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M15.97,21.01 C15.97,21.01,9.97,23.01,9.97,27.01 C9.97,31.01,15.97,31.01,15.97,31.01"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M31.97,21.01 C31.97,21.01,37.97,23.01,37.97,27.01 C37.97,31.01,31.97,31.01,31.97,31.01"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M31,33 C31,33,29.49,31,29.49,31 C29.49,31,27.97,33,27.97,33"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M19.97,33 C19.97,33,17.97,31,17.97,31 C17.97,31,15.97,33,15.97,33"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M15.97,21 C15.97,21,31.97,21,31.97,21 C31.97,21,31.97,31,31.97,31 C31.97,31,15.97,31,15.97,31 C15.97,31,15.97,21,15.97,21 z"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M9,7.18 C9,4.87,10.79,3,13,3 C13,3,35.02,3,35.02,3 C37.23,3,39.03,4.87,39.03,7.18 C39.03,7.18,39.03,21.82,39.03,21.82 C39.03,24.13,37.23,26,35.02,26 C35.02,26,13,26,13,26 C10.79,26,9,24.13,9,21.82 C9,21.82,9,7.18,9,7.18 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M24,11 C24,11,24,23,24,23"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M28,15 C28,15,28,17,28,17"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20,15 C20,15,20,17,20,17"/></g></g></g></svg> ', tosiFavicon: '<svg class="color" viewBox="0 0 48 48"><g><g><path style="fill:#ed247b;fill-rule:evenodd;stroke:none;" d="M1,9 C1,4.58,4.58,1,9,1 C9,1,39,1,39,1 C43.42,1,47,4.58,47,9 C47,9,47,39,47,39 C47,43.42,43.42,47,39,47 C39,47,9,47,9,47 C4.58,47,1,43.42,1,39 C1,39,1,9,1,9 z"/><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M16,29 C16,29,10,31,10,35 C10,39,16,39,16,39"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M32,29 C32,29,38,31,38,35 C38,39,32,39,32,39"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M9,10.18 C9,7.87,10.79,6,13,6 C13,6,35,6,35,6 C37.21,6,39,7.87,39,10.18 C39,10.18,39,24.82,39,24.82 C39,27.13,37.21,29,35,29 C35,29,13,29,13,29 C10.79,29,9,27.13,9,24.82 C9,24.82,9,10.18,9,10.18 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M24,11 C24,11,24,23,24,23"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M28,15 C28,15,28,17,28,17"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20,15 C20,15,20,17,20,17"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M32,43 C32,43,30,41,30,41 C30,41,28,43,28,43"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20,43 C20,43,18,41,18,41 C18,41,16,43,16,43"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M16,29 C16,29,32,29,32,29 C32,29,32,39,32,39 C32,39,16,39,16,39 C16,39,16,29,16,29 z"/></g></g></g></svg> ', tosiPlatform: '<svg class="color" viewBox="0 0 48 48"><g><g><g><path style="fill:#3ea9f5;fill-rule:evenodd;stroke:none;" d="M23.97,47 C23.97,47,39,47,39,47 C43.42,47,47,43.42,47,39 C47,39,47,9,47,9 C47,4.58,43.42,1,39,1 C39,1,9,1,9,1 C4.58,1,1,4.58,1,9 C1,9,1,39,1,39 C1,41.64,2.28,43.98,4.25,45.44 C4.09,44.82,4,44.17,4,43.5 C4,39.36,7.36,36,11.5,36 C15.14,36,18.18,38.6,18.86,42.05 C19.07,42.02,19.28,42,19.5,42 C21.99,42,24,44.01,24,46.5 C24,46.67,23.99,46.84,23.97,47 z"/><path style="fill:#ffffff;fill-rule:evenodd;stroke:none;" d="M4.25,45.44 C4.09,44.82,4,44.17,4,43.5 C4,39.36,7.36,36,11.5,36 C15.14,36,18.18,38.6,18.86,42.05 C19.07,42.02,19.28,42,19.5,42 C21.99,42,24,44.01,24,46.5 C24,46.67,23.99,46.84,23.97,47 C23.97,47,9,47,9,47 C7.22,47,5.58,46.42,4.25,45.44 z"/></g><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M35,35 C35,35,32.17,35,32.17,35 C32.17,35,32.17,37.83,32.17,37.83"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M31,39 C31,39,28.17,39,28.17,39 C28.17,39,28.17,41.83,28.17,41.83"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M7.48,16 C4.45,16,2,18.45,2,21.48 C2,21.48,2,21.48,2,21.48 C2,23.98,4.02,26,6.52,26 C6.52,26,6.62,26,6.62,26 C7.38,26,8,26.62,8,27.38 C8,27.38,8,27.38,8,27.38 C8,29.93,10.07,32,12.62,32 C12.62,32,16,32,16,32 C18.58,32,20.68,29.91,20.68,27.32 C20.68,27.32,20.68,21.42,20.68,21.42 C20.68,18.43,18.25,16,15.26,16 C15.26,16,7.48,16,7.48,16 z"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M17,29 C17,29,33,29,33,29 C33,29,33,29,33,29 C33,34.52,28.52,39,23,39 C23,39,23,39,23,39 C19.69,39,17,36.31,17,33 C17,33,17,29,17,29 z"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M40.52,16 C43.55,16,46,18.45,46,21.48 C46,21.48,46,21.48,46,21.48 C46,23.98,43.98,26,41.48,26 C41.48,26,41.38,26,41.38,26 C40.62,26,40,26.62,40,27.38 C40,27.38,40,27.38,40,27.38 C40,29.93,37.93,32,35.38,32 C35.38,32,32,32,32,32 C29.42,32,27.32,29.91,27.32,27.32 C27.32,27.32,27.32,21.42,27.32,21.42 C27.32,18.43,29.75,16,32.74,16 C32.74,16,40.52,16,40.52,16 z"/><g><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M6,10.18 C6,7.87,7.79,6,10,6 C10,6,32,6,32,6 C34.21,6,36,7.87,36,10.18 C36,10.18,36,24.82,36,24.82 C36,27.13,34.21,29,32,29 C32,29,10,29,10,29 C7.79,29,6,27.13,6,24.82 C6,24.82,6,10.18,6,10.18 z"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M21,11 C21,11,21,23,21,23"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M25,15 C25,15,25,17,25,17"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M17,15 C17,15,17,17,17,17"/></g></g></g></svg> ', tosi: '<svg class="color" viewBox="0 0 48 48"><g><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M38.35,31.7 C39.78,34.37,38.78,37.69,36.11,39.13 C36.11,39.13,36.11,39.13,36.11,39.13 C33.92,40.31,31.18,39.48,29.99,37.29 C29.99,37.29,29.95,37.2,29.95,37.2 C29.58,36.53,28.75,36.27,28.08,36.64 C28.08,36.64,28.08,36.64,28.08,36.64 C25.83,37.84,23.03,37,21.82,34.76 C21.82,34.76,20.22,31.78,20.22,31.78 C18.99,29.5,19.85,26.67,22.12,25.44 C22.12,25.44,27.32,22.65,27.32,22.65 C29.96,21.23,33.24,22.22,34.66,24.85 C34.66,24.85,38.35,31.7,38.35,31.7 z"/><path style="fill:#9e9e9e;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M10.65,31.7 C9.22,34.37,10.22,37.69,12.89,39.13 C12.89,39.13,12.89,39.13,12.89,39.13 C15.08,40.31,17.82,39.48,19.01,37.29 C19.01,37.29,19.05,37.2,19.05,37.2 C19.42,36.53,20.25,36.27,20.92,36.64 C20.92,36.64,20.92,36.64,20.92,36.64 C23.17,37.84,25.97,37,27.18,34.76 C27.18,34.76,28.78,31.78,28.78,31.78 C30.01,29.5,29.15,26.67,26.88,25.44 C26.88,25.44,21.68,22.65,21.68,22.65 C19.04,21.23,15.76,22.22,14.34,24.85 C14.34,24.85,10.65,31.7,10.65,31.7 z"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M32.5,43 C32.5,43,30.5,41,30.5,41 C30.5,41,28.5,43,28.5,43"/><path style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20.5,43 C20.5,43,18.5,41,18.5,41 C18.5,41,16.5,43,16.5,43"/><path style="fill:#e4e4e4;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M16.5,29 C16.5,29,32.5,29,32.5,29 C32.5,29,32.5,36,32.5,36 C32.5,37.66,31.16,39,29.5,39 C29.5,39,19.5,39,19.5,39 C17.84,39,16.5,37.66,16.5,36 C16.5,36,16.5,29,16.5,29 z"/><g><path style="fill:#ffffff;fill-rule:evenodd;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M9.5,10.18 C9.5,7.87,11.29,6,13.5,6 C13.5,6,35.5,6,35.5,6 C37.71,6,39.5,7.87,39.5,10.18 C39.5,10.18,39.5,24.82,39.5,24.82 C39.5,27.13,37.71,29,35.5,29 C35.5,29,13.5,29,13.5,29 C11.29,29,9.5,27.13,9.5,24.82 C9.5,24.82,9.5,10.18,9.5,10.18 z"/><g><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M24.5,11 C24.5,11,24.5,23,24.5,23"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M28.5,15 C28.5,15,28.5,17,28.5,17"/><path style="fill:#ffffff;fill-rule:nonzero;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2;" d="M20.5,15 C20.5,15,20.5,17,20.5,17"/></g></g></g></svg> ', sortDescending: '<svg class="stroked" viewBox="0 0 24 24"><g><path d="M16.5,14.5 C16.5,14.5,7.5,14.5,7.5,14.5"/><path d="M14.5,18.5 C14.5,18.5,9.5,18.5,9.5,18.5"/><path d="M18.5,10.5 C18.5,10.5,5.5,10.5,5.5,10.5"/><path d="M20.5,6.5 C20.5,6.5,3.5,6.5,3.5,6.5"/></g></svg> ', columns: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path></svg>', underline: '<svg class="stroked" viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>', grid: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>', triangle: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>', search: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>', volume2: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>', arrowUpCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>', pauseCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>', checkSquare: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>', arrowDown: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>', figma: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path></svg>', cornerRightUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="10 9 15 4 20 9"></polyline><path d="M4 20h7a4 4 0 0 0 4-4V4"></path></svg>', chevronsRight: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>', list: '<svg class="stroked" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>', chevronsDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>', wind: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>', cornerUpRight: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path></svg>', target: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>', scissors: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>', minimize2: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>', playCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>', crosshair: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>', airplay: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg>', xOctagon: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>', repeat: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>', edit3: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>', volume1: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>', sunrise: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline></svg>', toggleRight: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle></svg>', umbrella: '<svg class="stroked" viewBox="0 0 24 24"><path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path></svg>', user: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>', fileMinus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>', xCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>', circle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle></svg>', phoneMissed: '<svg class="stroked" viewBox="0 0 24 24"><line x1="23" y1="1" x2="17" y2="7"></line><line x1="17" y1="1" x2="23" y2="7"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', edit2: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>', cornerLeftUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="14 9 9 4 4 9"></polyline><path d="M20 20h-7a4 4 0 0 1-4-4V4"></path></svg>', home: '<svg class="stroked" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>', gitlab: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path></svg>', music: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>', smartphone: '<svg class="stroked" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>', moreHorizontal: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>', sliders: '<svg class="stroked" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>', arrowUpLeft: '<svg class="stroked" viewBox="0 0 24 24"><line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline></svg>', chevronDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>', hexagon: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>', github: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>', crop: '<svg class="stroked" viewBox="0 0 24 24"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path></svg>', tag: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>', briefcase: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>', rotateCw: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>', map: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>', inbox: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>', alignJustify: '<svg class="stroked" viewBox="0 0 24 24"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>', plusSquare: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>', power: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>', database: '<svg class="stroked" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>', cameraOff: '<svg class="stroked" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path></svg>', toggleLeft: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle></svg>', file: '<svg class="stroked" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>', messageCircle: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>', voicemail: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line></svg>', terminal: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>', move: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>', maximize: '<svg class="stroked" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>', chevronUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>', arrowDownLeft: '<svg class="stroked" viewBox="0 0 24 24"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>', fileText: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>', droplet: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>', zapOff: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="12.41 6.75 13 2 10.57 4.92"></polyline><polyline points="18.57 12.91 21 10 15.66 10"></polyline><polyline points="8 8 3 14 12 14 11 22 16 16"></polyline><line x1="1" y1="1" x2="23" y2="23"></line></svg>', x: '<svg class="stroked" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', barChart: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>', lock: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>', logIn: '<svg class="stroked" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>', shoppingBag: '<svg class="stroked" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>', divide: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="6" r="2"></circle><line x1="5" y1="12" x2="19" y2="12"></line><circle cx="12" cy="18" r="2"></circle></svg>', cloudDrizzle: '<svg class="stroked" viewBox="0 0 24 24"><line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>', refreshCw: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>', chevronRight: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>', clipboard: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>', package: '<svg class="stroked" viewBox="0 0 24 24"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>', instagram: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>', link: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>', videoOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', key: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>', meh: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', cornerDownRight: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path></svg>', arrowRight: '<svg class="stroked" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>', aperture: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>', stopCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>', logOut: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>', arrowLeftCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>', barChart2: '<svg class="stroked" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>', gitPullRequest: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>', minimize: '<svg class="stroked" viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>', minusSquare: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line></svg>', settings: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.6.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.6.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.6.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.6.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>', cloudSnow: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="8" y1="20" x2="8.01" y2="20"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="12" y1="22" x2="12.01" y2="22"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><line x1="16" y1="20" x2="16.01" y2="20"></line></svg>', thumbsDown: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>', type: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>', archive: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>', phoneOutgoing: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 7 23 1 17 1"></polyline><line x1="16" y1="8" x2="23" y2="1"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', pocket: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline></svg>', mail: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>', shield: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>', download: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>', phoneForwarded: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="19 1 23 5 19 9"></polyline><line x1="15" y1="5" x2="23" y2="5"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', cornerRightDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="10 15 15 20 20 15"></polyline><path d="M4 4h7a4 4 0 0 1 4 4v12"></path></svg>', bookOpen: '<svg class="stroked" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>', divideSquare: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>', server: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>', tv: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>', skipForward: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>', volume: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>', userPlus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>', batteryCharging: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline></svg>', layers: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>', slash: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>', radio: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>', book: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>', userMinus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>', bell: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>', gitBranch: '<svg class="stroked" viewBox="0 0 24 24"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>', coffee: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>', code: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>', thermometer: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>', cast: '<svg class="stroked" viewBox="0 0 24 24"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2.01" y2="20"></line></svg>', flag: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>', eyeOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', battery: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line></svg>', disc: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>', frown: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', tool: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>', cpu: '<svg class="stroked" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>', bold: '<svg class="stroked" viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>', hash: '<svg class="stroked" viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>', share2: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>', plus: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>', check: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>', rotateCcw: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>', hardDrive: '<svg class="stroked" viewBox="0 0 24 24"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>', bluetooth: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline></svg>', pieChart: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>', headphones: '<svg class="stroked" viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>', rss: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>', wifi: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>', cornerUpLeft: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>', watch: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path></svg>', info: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>', userX: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>', loader: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>', refreshCcw: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>', folderPlus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>', gitMerge: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg>', mic: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>', copy: '<svg class="stroked" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>', zoomIn: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>', arrowRightCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>', alignRight: '<svg class="stroked" viewBox="0 0 24 24"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>', image: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>', maximize2: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>', checkCircle: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>', sunset: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline></svg>', save: '<svg class="stroked" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>', smile: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', navigation: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>', cloudLightning: '<svg class="stroked" viewBox="0 0 24 24"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline></svg>', paperclip: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>', fastForward: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>', xSquare: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>', award: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>', zoomOut: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>', box: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>', thumbsUp: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>', percent: '<svg class="stroked" viewBox="0 0 24 24"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>', sidebar: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>', square: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>', play: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>', gitCommit: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line></svg>', table: '<svg class="stroked" viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path></svg>', send: '<svg class="stroked" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>', phoneCall: '<svg class="stroked" viewBox="0 0 24 24"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', speaker: '<svg class="stroked" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>', facebook: '<svg class="filled" version="1" viewBox="0 0 512 512"><path d="M464 0h-416c-26 0-48 22-48 48v416c0 26 22 48 48 48h208v-224h-64v-64h64v-32c0-53 43-96 96-96h64v64h-64c-18 0-32 14-32 32v32h96l-16 64h-80v224h144c26 0 48-22 48-48v-416c0-26-22-48-48-48z"></path></svg> ', codesandbox: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>', camera: '<svg class="stroked" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>', link2: '<svg class="stroked" viewBox="0 0 24 24"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>', printer: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>', folderMinus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line></svg>', arrowUpRight: '<svg class="stroked" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>', truck: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>', lifeBuoy: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>', penTool: '<svg class="stroked" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.59 7.59"></path><circle cx="11" cy="11" r="2"></circle></svg>', atSign: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>', feather: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>', trash: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>', wifiOff: '<svg class="stroked" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>', cornerLeftDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="14 15 9 20 4 15"></polyline><path d="M20 4h-7a4 4 0 0 0-4 4v12"></path></svg>', dollarSign: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', star: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>', cloudOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', sun: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>', messageSquare: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>', edit: '<svg class="stroked" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>', anchor: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path></svg>', alertCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>', chevronsUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline></svg>', uploadCloud: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>', twitch: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg>', youtube: '<svg class="filled" version="1" viewBox="0 0 512 512"><g></g><path d="M507 154c0 0-5-35-20-51-20-20-41-21-51-22-72-5-179-5-179-5h-0c0 0-108 0-179 5-10 1-32 1-51 22-15 16-20 51-20 51s-5 41-5 83v39c0 41 5 83 5 83s5 35 20 51c20 20 45 20 57 22 41 4 174 5 174 5s108-0 179-5c10-1 32-1 51-22 15-16 20-51 20-51s5-41 5-83v-39c-0-41-5-83-5-83zM203 322v-144l138 72-138 72z"></path></svg> ', unlock: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>', compass: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>', plusCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>', creditCard: '<svg class="stroked" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>', cloudRain: '<svg class="stroked" viewBox="0 0 24 24"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>', trash2: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>', skipBack: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>', filePlus: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>', delete: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>', command: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>', clock: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>', octagon: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon></svg>', phone: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', eye: '<svg class="stroked" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>', phoneOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>', codepen: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line></svg>', dribbble: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path></svg>', gift: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>', externalLink: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>', zap: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', trello: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect></svg>', moreVertical: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>', micOff: '<svg class="stroked" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>', share: '<svg class="stroked" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>', arrowUp: '<svg class="stroked" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>', bellOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', linkedin: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>', video: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>', divideCircle: '<svg class="stroked" viewBox="0 0 24 24"><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line><circle cx="12" cy="12" r="10"></circle></svg>', activity: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>', twitter: '<svg class="stroked" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>', mapPin: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>', filter: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>', phoneIncoming: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="16 2 16 8 22 8"></polyline><line x1="23" y1="1" x2="16" y2="8"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', italic: '<svg class="stroked" viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>', chevronsLeft: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>', calendar: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>', globe: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>', arrowLeft: '<svg class="stroked" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', alignCenter: '<svg class="stroked" viewBox="0 0 24 24"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>', minusCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>', arrowDownRight: '<svg class="stroked" viewBox="0 0 24 24"><line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline></svg>', framer: '<svg class="stroked" viewBox="0 0 24 24"><path d="M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7"></path></svg>', volumeX: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>', slack: '<svg class="stroked" viewBox="0 0 24 24"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path></svg>', cloud: '<svg class="stroked" viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>', downloadCloud: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg>', shuffle: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>', rewind: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>', upload: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>', trendingDown: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>', pause: '<svg class="stroked" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>', arrowDownCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line></svg>', bookmark: '<svg class="stroked" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>', alertTriangle: '<svg class="stroked" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', userCheck: '<svg class="stroked" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>', tablet: '<svg class="stroked" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>', alertOctagon: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>', menu: '<svg class="stroked" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>', chrome: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>', shoppingCart: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>', folder: '<svg class="stroked" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>', users: '<svg class="stroked" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>', cornerDownLeft: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>', monitor: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', minus: '<svg class="stroked" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line></svg>', helpCircle: '<svg class="stroked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', navigation2: '<svg class="stroked" viewBox="0 0 24 24"><polygon points="12 2 19 21 12 17 5 21 12 2"></polygon></svg>', chevronLeft: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>', film: '<svg class="stroked" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>', moon: '<svg class="stroked" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>', shieldOff: '<svg class="stroked" viewBox="0 0 24 24"><path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>', layout: '<svg class="stroked" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>', mousePointer: '<svg class="stroked" viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>', alignLeft: '<svg class="stroked" viewBox="0 0 24 24"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>', heart: '<svg class="stroked" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>', trendingUp: '<svg class="stroked" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>', listBullet: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,6 C21,6,10,6,10,6"/><path style="" d="M21,12 C21,12,10,12,10,12"/><path style="" d="M21,18 C21,18,10,18,10,18"/><path style="" d="M5.5,5 C6.05,5,6.5,5.45,6.5,6 C6.5,6.55,6.05,7,5.5,7 C4.95,7,4.5,6.55,4.5,6 C4.5,5.45,4.95,5,5.5,5 z"/><path style="" d="M5.5,11 C6.05,11,6.5,11.45,6.5,12 C6.5,12.55,6.05,13,5.5,13 C4.95,13,4.5,12.55,4.5,12 C4.5,11.45,4.95,11,5.5,11 z"/><path style="" d="M5.5,17 C6.05,17,6.5,17.45,6.5,18 C6.5,18.55,6.05,19,5.5,19 C4.95,19,4.5,18.55,4.5,18 C4.5,17.45,4.95,17,5.5,17 z"/></g></svg> ', indent: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,10 C21,10,8,10,8,10"/><path style="" d="M21,6 C21,6,8,6,8,6"/><path style="" d="M21,14 C21,14,8,14,8,14"/><path style="" d="M21,18 C21,18,8,18,8,18"/><path style="" d="M2.5,9 C2.5,9,5.5,12,5.5,12 C5.5,12,2.5,15,2.5,15"/></g></svg> ', fontBold: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M13.5,11 C15.71,11,17.5,12.68,17.5,14.75 C17.5,16.82,15.71,18.5,13.5,18.5 C13.5,18.5,8.5,18.5,8.5,18.5 C8.5,18.5,8.5,3.5,8.5,3.5 C8.5,3.5,13.5,3.5,13.5,3.5 C15.71,3.5,17.5,5.18,17.5,7.25 C17.5,9.32,15.71,11,13.5,11 C13.5,11,13.5,11,13.5,11 z"/><path style="" d="M13.5,11 C13.5,11,8.5,11,8.5,11"/><path style="" d="M12.5,11 C14.71,11,16.5,12.68,16.5,14.75 C16.5,16.82,14.71,18.5,12.5,18.5 C12.5,18.5,7.5,18.5,7.5,18.5 C7.5,18.5,7.5,3.5,7.5,3.5 C7.5,3.5,12.5,3.5,12.5,3.5 C14.71,3.5,16.5,5.18,16.5,7.25 C16.5,9.32,14.71,11,12.5,11 C12.5,11,12.5,11,12.5,11 z"/><path style="" d="M12.5,11 C12.5,11,7.5,11,7.5,11"/></g></svg> ', fontItalic: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M17,4.5 C17,4.5,13,4.5,13,4.5"/><path style="" d="M11,19.5 C11,19.5,7,19.5,7,19.5"/><path style="" d="M15,4.5 C15,4.5,9,19.5,9,19.5"/></g></svg> ', fontUnderline: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M7.5,3.5 C7.5,3.5,7.5,10.74,7.5,13.5 C7.5,16.26,9.74,18.5,12.5,18.5 C15.26,18.5,17.5,16.26,17.5,13.5 C17.5,10.74,17.5,3.5,17.5,3.5"/><path style="" d="M7.5,21.5 C7.5,21.5,17.5,21.5,17.5,21.5"/></g></svg> ', outdent: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,10 C21,10,8,10,8,10"/><path style="" d="M21,6 C21,6,8,6,8,6"/><path style="" d="M21,14 C21,14,8,14,8,14"/><path style="" d="M21,18 C21,18,8,18,8,18"/><path style="" d="M5.5,9 C5.5,9,2.5,12,2.5,12 C2.5,12,5.5,15,5.5,15"/></g></svg> ', listNumber: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,6 C21,6,10,6,10,6"/><path style="" d="M21,12 C21,12,10,12,10,12"/><path style="" d="M21,18 C21,18,10,18,10,18"/><path style="" d="M4.5,5 C4.5,5,5.5,4,5.5,4 C5.5,4,5.5,8,5.5,8"/><path style="" d="M4.5,10 C4.5,10,5.5,10,5.5,10 C6.05,10,6.5,10.45,6.5,11 C6.5,11,6.5,11,6.5,11 C6.5,11.55,6.05,12,5.5,12 C5.5,12,5.5,12,5.5,12 C4.95,12,4.5,12.45,4.5,13 C4.5,13,4.5,14,4.5,14 C4.5,14,6.5,14,6.5,14"/><path style="" d="M4.5,16 C4.5,16,5.5,16,5.5,16 C6.05,16,6.5,16.45,6.5,17 C6.5,17,6.5,17,6.5,17 C6.5,17.55,6.05,18,5.5,18 C5.5,18,4.5,18,4.5,18 C4.5,18,5.5,18,5.5,18 C6.05,18,6.5,18.45,6.5,19 C6.5,19,6.5,19,6.5,19 C6.5,19.55,6.05,20,5.5,20 C5.5,20,4.5,20,4.5,20"/></g></svg> ', resize: '<svg class="stroked" version="1.1" viewBox="0, 0, 24, 24"><g><path d="M9,3 L3,3 L3,9"/><path d="M15,21 L21,21 L21,15"/><path d="M3,3 L10,10"/><path d="M21,21 L14,14"/></g></svg> ', bug: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M8,6 C8,3.79,9.79,2,12,2 C14.21,2,16,3.79,16,6 C16,6,8,6,8,6 z"/><path style="" d="M20,7 C20,7,18,9,18,9"/><path style="" d="M20,19 C20,19,18,17,18,17"/><path style="" d="M21,13 C21,13,18,13,18,13"/><path style="" d="M16.44,9 C17.3,9,18,9.7,18,10.56 C18,10.56,18,15,18,15 C18,18.31,15.31,21,12,21 C8.69,21,6,18.31,6,15 C6,15,6,10.56,6,10.56 C6,9.7,6.7,9,7.56,9 C7.56,9,16.44,9,16.44,9 z"/><path style="" d="M4,7 C4,7,6,9,6,9"/><path style="" d="M4,19 C4,19,6,17,6,17"/><path style="" d="M3,13 C3,13,6,13,6,13"/><path style="" d="M12,12 C12,12,12,17,12,17"/></g></svg> ', blog: '<svg class="stroked" viewBox="0 0 24 24"><g><path style="" d="M21,10.02 C21,10.02,21,15,21,15 C21,15.53,20.79,16.04,20.41,16.41 C20.04,16.79,19.53,17,19,17 C19,17,7,17,7,17 C5.67,18.33,4.33,19.67,3,21 C3,21,3,5,3,5 C3,4.47,3.21,3.96,3.59,3.59 C3.96,3.21,4.47,3,5,3 C8.53,3,10.49,3,14.02,3"/><path style="" d="M19,2 C19.54,1.46,20.32,1.25,21.05,1.45 C21.78,1.65,22.35,2.22,22.55,2.95 C22.75,3.68,22.54,4.46,22,5 C22,5,15.5,11.5,15.5,11.5 C14.17,11.83,12.83,12.17,11.5,12.5 C11.83,11.17,12.17,9.83,12.5,8.5 C15.67,5.33,15.83,5.17,19,2 z"/><path style="" d="M14.6,3"/><path style="" d="M21,8.77"/><path style="" d="M7,7 C7,7,10,7,10,7"/><path style="" d="M7,10 C7,10,9,10,9,10"/></g></svg> ', sortAscending: '<svg class="stroked" viewBox="0 0 24 24"><g><path d="M16.5,10.5 C16.5,10.5,7.5,10.5,7.5,10.5"/><path d="M14.5,6.5 C14.5,6.5,9.5,6.5,9.5,6.5"/><path d="M18.5,14.5 C18.5,14.5,5.5,14.5,5.5,14.5"/><path d="M20.5,18.5 C20.5,18.5,3.5,18.5,3.5,18.5"/></g></svg> ', npm: '<svg class="filled" version="1" viewBox="0 0 512 512"><path d="M0 0v512h512v-512h-512zM416 416h-64v-256h-96v256h-160v-320h320v320z"></path></svg> ', game: '<svg class="filled" version="1" viewBox="0 0 704 512"><path d="M528 97v-1h-336c-88 0-160 72-160 160s72 160 160 160c52 0 99-25 128-64h64c29 39 76 64 128 64 88 0 160-72 160-160 0-83-63-151-144-159zM288 288h-64v64h-64v-64h-64v-64h64v-64h64v64h64v64zM480 288c-18 0-32-14-32-32s14-32 32-32 32 14 32 32-14 32-32 32zM576 288c-18 0-32-14-32-32 0-18 14-32 32-32s32 14 32 32c0 18-14 32-32 32z"></path></svg> ', google: '<svg class="filled" version="1" viewBox="0 0 512 512"><path d="M256 0c-141 0-256 115-256 256s115 256 256 256 256-115 256-256-115-256-256-256zM260 448c-106 0-192-86-192-192s86-192 192-192c52 0 95 19 129 50l-52 50c-14-14-39-30-77-30-66 0-119 54-119 121s54 121 119 121c76 0 105-55 109-83h-109v-66h181c2 10 3 19 3 32 0 110-73 188-184 188z"></path></svg> ', discord: '<svg class="filled" version="1" viewBox="0 0 1013 768"><path d="M858 64c-60-28-131-51-204-64l-5-1c-8 14-17 32-25 51l-1 4c-35-6-75-9-116-9s-81 3-120 9l4-1c-9-22-18-40-28-57l1 3c-79 14-149 36-214 67l5-2c-132 196-168 387-150 575v0c73 55 158 99 250 127l6 2c19-26 38-55 53-85l2-3c-33-13-62-27-89-43l2 1c7-5 14-11 21-16 75 36 163 57 256 57s181-21 260-59l-4 2c7 6 14 11 21 16-25 15-53 29-83 40l-4 1c17 34 36 63 56 90l-1-2c98-30 183-74 259-130l-2 2c21-218-36-407-151-575zM338 524c-50 0-91-45-91-101s40-102 91-102 92 46 91 102-40 101-91 101zM675 524c-50 0-91-45-91-101s40-102 91-102 92 46 91 102-40 101-91 101z"></path></svg> ' };
var g0 = (i, l4, s2, o) => {
  i.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  for (let y2 of [...i.querySelectorAll("path, polygon, line, circle, rect, ellipse, polyline")]) {
    if (l4 !== undefined)
      y2.setAttribute("fill", l4);
    if (s2 !== undefined)
      y2.setAttribute("stroke", s2);
    if (o !== undefined)
      y2.setAttribute("stroke-width", String(o));
  }
  let h2 = i.querySelectorAll("[style]");
  i.removeAttribute("style");
  for (let y2 of [...h2]) {
    let { fill: e2, stroke: x3, strokeWidth: n, strokeLinecap: p2, strokeLinejoin: d3 } = y2.style;
    if (e2)
      y2.setAttribute("fill", x.fromCss(e2).html);
    if (x3)
      y2.setAttribute("stroke", x.fromCss(x3).html);
    if (n)
      y2.setAttribute("strokeWidth", n);
    if (p2)
      y2.setAttribute("strokeLinecap", p2);
    if (d3)
      y2.setAttribute("strokeLinejoin", d3);
    y2.removeAttribute("style");
  }
  return `url(data:image/svg+xml;charset=UTF-8,${encodeURIComponent(i.outerHTML)})`;
};
var t3 = new Proxy(O1, { get(i, l4) {
  let s2 = O1[l4];
  if (l4 && !s2)
    console.warn(`icon ${l4} does not exist`);
  if (!s2)
    s2 = O1.square;
  return (...o) => {
    let h2 = T.div();
    h2.innerHTML = s2;
    let r2 = h2.querySelector("svg"), y2 = new Set(r2.classList);
    y2.add("tosi-icon");
    let e2 = tn.svg({ class: Array.from(y2).join(" "), viewBox: r2.getAttribute("viewBox") }, ...o, ...r2.children);
    if (e2.style.strokeWidth = Jn.tosiIconStrokeWidth("2px"), y2.has("filled"))
      e2.style.stroke = "none", e2.style.fill = "currentColor";
    else if (y2.has("stroked"))
      e2.style.stroke = Jn.tosiIconStroke("currentColor"), e2.style.fill = "none";
    else
      e2.style.stroke = Jn.tosiIconStroke("currentColor"), e2.style.fill = Jn.tosiIconFill("currentColor");
    return e2.style.height = Jn.tosiIconSize("16px"), e2;
  };
} });

class k0 extends R {
  static initAttributes = { icon: "", size: 0, fill: "", stroke: "", strokeWidth: 1 };
  render() {
    super.render(), this.textContent = "";
    let i = {};
    if (this.size)
      i.height = this.size + "px", this.style.setProperty("--tosi-icon-size", `${this.size}px`), this.style.setProperty("--xin-icon-size", `${this.size}px`);
    if (this.stroke)
      i.stroke = this.stroke, i.strokeWidth = this.strokeWidth;
    if (this.fill)
      i.fill = this.fill;
    this.append(t3[this.icon]({ style: i }));
  }
}
var t32 = k0.elementCreator({ tag: "tosi-icon", styleSpec: { ":host": { "--tosi-icon-size": "var(--xin-icon-size, 16px)", "--tosi-icon-stroke-width": "var(--xin-icon-stroke-width, var(--icon-stroke-width, 2px))", "--tosi-icon-stroke-linejoin": "var(--icon-stroke-linejoin, round)", "--tosi-icon-stroke-linecap": "var(--icon-stroke-linecap, round)", "--tosi-icon-fill": "var(--xin-icon-fill, var(--icon-fill, none))", display: "inline-flex", stroke: "currentColor", strokeWidth: Jn.tosiIconStrokeWidth("2px"), strokeLinejoin: Jn.tosiIconStrokeLinejoin("round"), strokeLinecap: Jn.tosiIconStrokeLinecap("round"), fill: Jn.tosiIconFill("none") }, ":host, :host svg": { height: Jn.tosiIconSize("16px") } } });
var w0 = () => {};

class v0 extends R {
  babylonReady;
  BABYLON;
  static styleSpec = { ":host": { display: "block", position: "relative" }, ":host canvas": { width: "100%", height: "100%" }, ":host .babylonVRicon": { height: 50, width: 80, backgroundColor: "transparent", filter: "drop-shadow(0 0 4px #000c)", backgroundImage: g0(t3.xrColor()), backgroundPosition: "center", backgroundRepeat: "no-repeat", border: "none", borderRadius: 5, borderStyle: "none", outline: "none", transition: "transform 0.125s ease-out" }, ":host .babylonVRicon:hover": { transform: "scale(1.1)" } };
  content = T.canvas({ part: "canvas" });
  constructor() {
    super();
    this.babylonReady = (async () => {
      let { BABYLON: i } = await Z2("https://cdn.babylonjs.com/babylon.js", "BABYLON");
      return i;
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
  loadScene = async (i, l4, s2) => {
    let { BABYLON: o } = await Z2("https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js", "BABYLON");
    o.SceneLoader.Append(i, l4, this.scene, s2);
  };
  loadUI = async (i) => {
    let { BABYLON: l4 } = await Z2("https://cdn.babylonjs.com/gui/babylon.gui.min.js", "BABYLON"), s2 = l4.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, this.scene), { snippetId: o, jsonUrl: h2, data: r2, size: y2 } = i;
    if (y2)
      s2.idealWidth = y2, s2.renderAtIdealSize = true;
    let e2;
    if (o)
      e2 = await s2.parseFromSnippetAsync(o);
    else if (h2)
      e2 = await s2.parseFromURLAsync(h2);
    else if (r2)
      e2 = s2.parseContent(r2);
    else
      return null;
    let x3 = s2.getChildren()[0], n = x3.children.reduce((p2, d3) => {
      return p2[d3.name] = d3, p2;
    }, {});
    return { advancedTexture: s2, gui: e2, root: x3, widgets: n };
  };
  connectedCallback() {
    super.connectedCallback();
    let { canvas: i } = this.parts;
    this.babylonReady.then(async (l4) => {
      if (this.BABYLON = l4, this.engine = new l4.Engine(i, true), this.scene = new l4.Scene(this.engine), this.sceneCreated)
        await this.sceneCreated(this, l4);
      if (this.scene.activeCamera === undefined)
        new l4.ArcRotateCamera("default-camera", -Math.PI / 2, Math.PI / 2.5, 3, new l4.Vector3(0, 0, 0)).attachControl(this.parts.canvas, true);
      this.engine.runRenderLoop(this._update);
    });
  }
}
var a3 = v0.elementCreator({ tag: "tosi-3d" });

class P1 extends R {
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
      P1.bodymovinAvailable = Z2("https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js", "bodymovin");
  }
  doneLoading = () => {
    this._loading = false;
  };
  load = ({ bodymovin: i }) => {
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
    this.animation = i.loadAnimation(this.config), this.animation.addEventListener("DOMLoaded", this.doneLoading);
  };
  render() {
    super.render(), P1.bodymovinAvailable.then(this.load).catch((i) => {
      console.error(i);
    });
  }
}
var M3 = P1.elementCreator({ tag: "tosi-lottie" });
var { button: p2, slot: m4, div: E1 } = T;

class d22 extends R {
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
  set page(i) {
    let { scroller: l4, back: s2, forward: o } = this.parts;
    if (this.lastPage <= 0)
      o.disabled = s2.disabled = true, i = 0;
    else
      i = Math.max(0, Math.min(this.lastPage, i)), i = isNaN(i) ? 0 : i;
    if (this._page !== i)
      this._page = isNaN(i) ? 0 : i, this.animateScroll(this._page * l4.offsetWidth), s2.disabled = this.page <= 0 && !this.loop, o.disabled = this.page >= this.lastPage && !this.loop;
  }
  get visibleItems() {
    return [...this.children].filter((i) => getComputedStyle(i).display !== "none");
  }
  get lastPage() {
    return Math.max(Math.ceil(this.visibleItems.length / (this.maxVisibleItems || 1)) - 1, 0);
  }
  static styleSpec = { ":host": { display: "flex", flexDirection: "column", position: "relative" }, ":host svg": { height: gn.carouselIconSize }, ":host button": { outline: "none", border: "none", boxShadow: "none", background: "transparent", color: gn.carouselButtonColor, padding: 0 }, ":host::part(back), :host::part(forward)": { position: "absolute", top: 0, bottom: 0, width: gn.carouseButtonWidth, zIndex: 2 }, ":host::part(back)": { left: 0 }, ":host::part(forward)": { right: 0 }, ":host button:disabled": { opacity: 0.5, pointerEvents: "none" }, ":host button:hover": { color: gn.carouselButtonHoverColor }, ":host button:active": { color: gn.carouselButtonActiveColor }, ":host::part(pager)": { position: "relative" }, ":host::part(scroller)": { overflow: "auto hidden", position: "relative" }, ":host::part(grid)": { display: "grid", justifyItems: "center" }, ":host *::-webkit-scrollbar, *::-webkit-scrollbar-thumb": { display: "none" }, ":host .dot": { background: gn.carouselButtonColor, borderRadius: gn.carouselDotSize, height: gn.carouselDotSize, width: gn.carouselDotSize, transition: gn.carouselDotTransition }, ":host .dot:not(.current):hover": { background: gn.carouselButtonHoverColor, height: gn.carouselDotSize150, width: gn.carouselDotSize150, margin: gn.carouselDotSize_25 }, ":host .dot:not(.current):active": { background: gn.carouselButtonActiveColor }, ":host .dot.current": { background: gn.carouselDotCurrentColor }, ":host::part(progress)": { display: "flex", gap: gn.carouselDotSpacing, justifyContent: "center", padding: gn.carouselProgressPadding } };
  easing = (i) => {
    return Math.sin(i * Math.PI * 0.5);
  };
  indicateCurrent = () => {
    let { scroller: i, progress: l4 } = this.parts, s2 = i.scrollLeft / i.offsetWidth;
    [...l4.children].forEach((o, h2) => {
      o.classList.toggle("current", Math.floor(h2 / this.maxVisibleItems - s2) === 0);
    }), this.lastAutoAdvance = Date.now(), clearTimeout(this.snapTimer), this.snapTimer = setTimeout(this.snapPosition, this.snapDelay * 1000);
  };
  snapPosition = () => {
    let { scroller: i } = this.parts, l4 = Math.round(i.scrollLeft / i.offsetWidth);
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
  handleDotClick = (i) => {
    let { progress: l4 } = this.parts, s2 = [...l4.children].indexOf(i.target);
    if (s2 > -1)
      this.page = Math.floor(s2 / this.maxVisibleItems);
  };
  snapTimer;
  animationFrame;
  animateScroll(i, l4 = -1, s2 = 0) {
    cancelAnimationFrame(this.animationFrame);
    let { scroller: o } = this.parts;
    if (l4 === -1) {
      l4 = o.scrollLeft, s2 = Date.now(), this.animationFrame = requestAnimationFrame(() => {
        this.animateScroll(i, l4, s2);
      });
      return;
    }
    let h2 = (Date.now() - s2) / 1000;
    if (h2 >= this.snapDuration || Math.abs(o.scrollLeft - i) < 2)
      o.scrollLeft = i, this.animationFrame = null;
    else
      o.scrollLeft = l4 + this.easing(h2 / this.snapDuration) * (i - l4), this.animationFrame = requestAnimationFrame(() => {
        this.animateScroll(i, l4, s2);
      });
  }
  content = () => [E1({ part: "pager" }, p2({ title: "previous slide", part: "back" }, t3.chevronLeft()), E1({ title: "slides", role: "group", part: "scroller" }, E1({ part: "grid" }, m4())), p2({ title: "next slide", part: "forward" }, t3.chevronRight())), E1({ title: "choose slide to display", role: "group", part: "progress" })];
  connectedCallback() {
    super.connectedCallback(), this.ariaRoleDescription = "carousel", this.ariaOrientation = "horizontal", this.ariaReadOnly = "true";
    let { back: i, forward: l4, scroller: s2, progress: o } = this.parts;
    i.addEventListener("click", this.back), l4.addEventListener("click", this.forward), s2.addEventListener("scroll", this.indicateCurrent), o.addEventListener("click", this.handleDotClick), this.lastAutoAdvance = Date.now(), this.interval = setInterval(this.autoAdvance, 100);
  }
  disconnectedCallback() {
    clearInterval(this.interval);
  }
  render() {
    super.render();
    let { dots: i, arrows: l4, visibleItems: s2, lastPage: o } = this, { progress: h2, back: r2, forward: y2, grid: e2 } = this.parts;
    s2.forEach((x3) => {
      x3.role = "group";
    }), e2.style.gridTemplateColumns = `${100 / this.maxVisibleItems / (1 + this.lastPage)}% `.repeat(s2.length).trim(), e2.style.width = (1 + this.lastPage) * 100 + "%", h2.textContent = "", h2.append(...s2.map((x3, n) => p2({ title: `item ${n + 1}`, class: "dot" }))), this.indicateCurrent(), h2.style.display = i && o > 0 ? "" : "none", r2.hidden = y2.hidden = !(l4 && o > 0);
  }
}
var S4 = d22.elementCreator({ tag: "tosi-carousel", styleSpec: { ":host": { _carouselIconSize: 24, _carouselButtonColor: "#0004", _carouselButtonHoverColor: "#0006", _carouselButtonActiveColor: "#000c", _carouseButtonWidth: 48, _carouselDotCurrentColor: "#0008", _carouselDotSize: 8, _carouselDotSpacing: gn.carouselDotSize, _carouselProgressPadding: 12, _carouselDotTransition: "0.125s ease-in-out" }, ":host:focus": { outline: "none", boxShadow: "none" } } });
var M0 = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.2/";
var B0 = "ace/theme/tomorrow";
var i5 = async () => {
  let { ace: i } = await Z2(`${M0}ace.min.js`);
  return i;
};
var l5 = async (i, l4 = "html", s2 = {}, o = B0) => {
  let h2 = await i5();
  h2.config.set("basePath", M0);
  let r2 = h2.edit(i, { mode: `ace/mode/${l4}`, tabSize: 2, useSoftTabs: true, useWorker: false, ...s2 });
  return r2.setTheme(o), { ace: h2, editor: r2 };
};

class M1 extends R {
  source = "";
  get value() {
    return this.editor === undefined ? this.source : this.editor.getValue();
  }
  set value(i) {
    if (this.editor === undefined)
      this.source = i;
    else
      this.editor.setValue(i), this.editor.clearSelection(), this.editor.session.getUndoManager().reset();
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
      this._editorPromise = l5(this, this.mode, this.options, this.theme), this._editorPromise.then(({ ace: i, editor: l4 }) => {
        this._ace = i, this._editor = l4, l4.setValue(this.source, 1), l4.clearSelection(), l4.session.getUndoManager().reset();
      });
  }
  render() {
    if (super.render(), this._editorPromise !== undefined)
      this._editorPromise.then(({ editor: i }) => i.setReadOnly(this.disabled));
  }
}
var $1 = M1.elementCreator({ tag: "tosi-code" });
var { input: f2 } = T;
var z0 = x.fromCss("#8888");

class H0 extends R {
  value = z0.rgba;
  color = z0;
  static styleSpec = { ":host": { _gap: 8, _swatchSize: 32, _cssWidth: 72, _alphaWidth: 72, display: "inline-flex", gap: gn.gap, alignItems: "center" }, ':host input[type="color"]': { border: 0, width: gn.swatchSize, height: gn.swatchSize, background: "transparent" }, ":host::part(alpha)": { width: gn.alphaWidth }, ":host::part(css)": { width: gn.cssWidth, fontFamily: "monospace" } };
  content = [f2({ title: "base color", type: "color", part: "rgb" }), f2({ type: "range", title: "opacity", part: "alpha", min: 0, max: 1, step: 0.05 }), f2({ title: "css color spec", part: "css" })];
  valueChanged = false;
  update = (i) => {
    let { rgb: l4, alpha: s2, css: o } = this.parts;
    if (i.type === "input")
      this.color = x.fromCss(l4.value), this.color.a = Number(s2.value), o.value = this.color.html;
    else
      this.color = x.fromCss(o.value), l4.value = this.color.html.substring(0, 7), s2.value = String(this.color.a);
    l4.style.opacity = String(this.color.a), this.value = this.color.rgba, this.valueChanged = true;
  };
  connectedCallback() {
    super.connectedCallback();
    let { rgb: i, alpha: l4, css: s2 } = this.parts;
    i.addEventListener("input", this.update), l4.addEventListener("input", this.update), s2.addEventListener("change", this.update);
  }
  render() {
    if (this.valueChanged) {
      this.valueChanged = false;
      return;
    }
    let { rgb: i, alpha: l4, css: s2 } = this.parts;
    this.color = x.fromCss(this.value), i.value = this.color.html.substring(0, 7), i.style.opacity = String(this.color.a), l4.value = String(this.color.a), s2.value = this.color.html;
  }
}
var j0 = H0.elementCreator({ tag: "tosi-color" });
var h1 = T.div({ style: { content: " ", position: "fixed", top: 0, left: 0, right: 0, bottom: 0 } });
var u1 = { passive: true };
var G3 = (i, l4, s2 = "move") => {
  if (!i.type.startsWith("touch")) {
    let { clientX: h2, clientY: r2 } = i;
    h1.style.cursor = s2, t1(h1), document.body.append(h1);
    let y2 = (e2) => {
      let x3 = e2.clientX - h2, n = e2.clientY - r2;
      if (l4(x3, n, e2) === true)
        h1.removeEventListener("mousemove", y2), h1.removeEventListener("mouseup", y2), h1.remove();
    };
    h1.addEventListener("mousemove", y2, u1), h1.addEventListener("mouseup", y2, u1);
  } else if (i instanceof TouchEvent) {
    let h2 = i.changedTouches[0], r2 = h2.identifier, y2 = h2.clientX, e2 = h2.clientY, x3 = i.target, n = 0, p3 = 0, d3 = (C2) => {
      let k2 = [...C2.touches].find((w2) => w2.identifier === r2);
      if (k2 !== undefined)
        n = k2.clientX - y2, p3 = k2.clientY - e2;
      if (C2.type === "touchmove")
        C2.stopPropagation(), C2.preventDefault();
      if (l4(n, p3, C2) === true || k2 === undefined)
        x3.removeEventListener("touchmove", d3), x3.removeEventListener("touchend", d3), x3.removeEventListener("touchcancel", d3);
    };
    x3.addEventListener("touchmove", d3), x3.addEventListener("touchend", d3, u1), x3.addEventListener("touchcancel", d3, u1);
  }
};
var B1 = (i = "body *") => [...document.querySelectorAll(i)].map((l4) => parseFloat(getComputedStyle(l4).zIndex)).reduce((l4, s2) => isNaN(l4) || Number(l4) < s2 ? s2 : Number(l4), 0);
var t1 = (i, l4 = "body *") => {
  i.style.zIndex = String(B1(l4) + 1);
};
var { slot: e5 } = T;

class r1 extends R {
  static floats = new Set;
  static initAttributes = { drag: false, remainOnResize: "remove", remainOnScroll: "remain" };
  content = e5();
  static styleSpec = { ":host": { position: "fixed" } };
  reposition = (i) => {
    if (i.target?.closest(".no-drag"))
      return;
    if (this.drag) {
      t1(this);
      let s2 = this.offsetLeft, o = this.offsetTop;
      G3(i, (h2, r2, y2) => {
        if (this.style.left = `${s2 + h2}px`, this.style.top = `${o + r2}px`, this.style.right = "auto", this.style.bottom = "auto", y2.type === "mouseup")
          return true;
      });
    }
  };
  connectedCallback() {
    super.connectedCallback(), r1.floats.add(this);
    let i = { passive: true };
    this.addEventListener("touchstart", this.reposition, i), this.addEventListener("mousedown", this.reposition, i), t1(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), r1.floats.delete(this);
  }
}
var m1 = r1.elementCreator({ tag: "tosi-float" });
window.addEventListener("resize", () => {
  Array.from(r1.floats).forEach((i) => {
    if (i.remainOnResize === "hide")
      i.hidden = true;
    else if (i.remainOnResize === "remove")
      i.remove();
  });
}, { passive: true });
document.addEventListener("scroll", (i) => {
  if (i.target instanceof HTMLElement && i.target.closest(r1.tagName))
    return;
  Array.from(r1.floats).forEach((l4) => {
    if (l4.remainOnScroll === "hide")
      l4.hidden = true;
    else if (l4.remainOnScroll === "remove")
      l4.remove();
  });
}, { passive: true, capture: true });
var A0 = (i) => {
  let { content: l4, target: s2, position: o, remainOnScroll: h2, remainOnResize: r2, draggable: y2 } = i, e2 = Array.isArray(l4) ? m1(...l4) : m1(l4);
  if (x5(e2, s2, o, h2, r2, y2), i.class)
    e2.setAttribute("class", i.class);
  return document.body.append(e2), e2;
};
var x5 = (i, l4, s2, o, h2, r2 = false) => {
  {
    let { position: w2 } = getComputedStyle(i);
    if (w2 !== "fixed")
      i.style.position = "fixed";
    if (h2)
      i.remainOnResize = h2;
    if (o)
      i.remainOnScroll = o;
    t1(i);
  }
  i.drag = r2;
  let { left: y2, top: e2, width: x3, height: n } = l4.getBoundingClientRect(), p3 = y2 + x3 * 0.5, d3 = e2 + n * 0.5, C2 = window.innerWidth, k2 = window.innerHeight;
  if (s2 === "side")
    s2 = (p3 < C2 * 0.5 ? "e" : "w") + (d3 < k2 * 0.5 ? "s" : "n");
  else if (s2 === "auto" || s2 === undefined)
    s2 = (d3 < k2 * 0.5 ? "s" : "n") + (p3 < C2 * 0.5 ? "e" : "w");
  if (i.style.top = i.style.left = i.style.right = i.style.bottom = i.style.transform = "", s2.length === 2) {
    let [w2, O2] = s2;
    switch (w2) {
      case "n":
        i.style.bottom = (k2 - e2).toFixed(2) + "px";
        break;
      case "e":
        i.style.left = (y2 + x3).toFixed(2) + "px";
        break;
      case "s":
        i.style.top = (e2 + n).toFixed(2) + "px";
        break;
      case "w":
        i.style.right = (C2 - y2).toFixed(2) + "px";
        break;
    }
    switch (O2) {
      case "n":
        i.style.bottom = (k2 - e2 - n).toFixed(2) + "px";
        break;
      case "e":
        i.style.left = y2.toFixed(2) + "px";
        break;
      case "s":
        i.style.top = e2.toFixed(2) + "px";
        break;
      case "w":
        i.style.right = (C2 - y2 - x3).toFixed(2) + "px";
        break;
    }
    i.style.transform = "";
  } else if (s2 === "n")
    i.style.bottom = (k2 - e2).toFixed(2) + "px", i.style.left = p3.toFixed(2) + "px", i.style.transform = "translateX(-50%)";
  else if (s2 === "s")
    i.style.top = (e2 + n).toFixed(2) + "px", i.style.left = p3.toFixed(2) + "px", i.style.transform = "translateX(-50%)";
  else if (s2 === "e")
    i.style.left = (y2 + x3).toFixed(2) + "px", i.style.top = d3.toFixed(2) + "px", i.style.transform = "translateY(-50%)";
  else if (s2 === "w")
    i.style.right = (C2 - y2).toFixed(2) + "px", i.style.top = d3.toFixed(2) + "px", i.style.transform = "translateY(-50%)";
  i.style.setProperty("--max-height", `calc(100vh - ${i.style.top || i.style.bottom})`), i.style.setProperty("--max-width", `calc(100vw - ${i.style.left || i.style.right})`);
};
function C2(i, l4 = true) {
  return (s2, o) => {
    let h2 = i(s2), r2 = i(o);
    for (let y2 in h2)
      if (h2[y2] !== r2[y2])
        return (Array.isArray(l4) ? l4[y2] !== false : l4) ? h2[y2] > r2[y2] ? 1 : -1 : h2[y2] > r2[y2] ? -1 : 1;
    return 0;
  };
}
var { button: d5, span: F0, input: f5 } = T;
var q0 = (i, l4) => {
  return !!i.find((s2) => {
    if (s2 === null || l4 == null)
      return false;
    else if (Array.isArray(s2))
      return q0(s2, l4);
    else if (s2.value === l4 || s2 === l4)
      return true;
  });
};

class T3 extends R {
  static formAssociated = true;
  static initAttributes = { editable: false, placeholder: "", showIcon: false, hideCaption: false, localized: false, disabled: false, required: false, name: "" };
  _options = [];
  get options() {
    return this._options;
  }
  set options(i) {
    if (typeof i === "string")
      this._options = T3.parseOptionsString(i);
    else
      this._options = i;
    this.queueRender();
  }
  static parseOptionsString(i) {
    return i.split(",").map((l4) => {
      let s2 = l4.trim();
      if (s2 === "")
        return null;
      let [o, h2] = s2.split("=").map((e2) => e2.trim());
      if (!h2)
        return { value: o, caption: o };
      let [r2, y2] = h2.split(":").map((e2) => e2.trim());
      return { value: o, caption: r2 || o, icon: y2 || undefined };
    });
  }
  value = "";
  filter = "";
  isExpanded = false;
  formDisabledCallback(i) {
    this.disabled = i;
  }
  formResetCallback() {
    this.value = "";
  }
  setValue = (i, l4 = false) => {
    if (this.value !== i)
      this.value = i, this.queueRender(true);
    if (l4)
      this.dispatchEvent(new Event("action"));
  };
  getValue = () => this.value;
  get selectOptions() {
    return this.options;
  }
  buildOptionMenuItem = (i) => {
    if (i === null)
      return null;
    let { setValue: l4, getValue: s2 } = this, o, h2, r2;
    if (typeof i === "string")
      h2 = r2 = i;
    else
      ({ icon: o, caption: h2, value: r2 } = i);
    if (this.localized)
      h2 = z3(h2);
    let { options: y2 } = i;
    if (y2)
      return { icon: o, caption: h2, checked: () => q0(y2, s2()), menuItems: y2.map(this.buildOptionMenuItem) };
    return { icon: o, caption: h2, checked: () => s2() === r2, action: typeof r2 === "function" ? async () => {
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
    let i = this.selectOptions.map(this.buildOptionMenuItem);
    if (this.filter === "")
      return i;
    let l4 = (s2) => {
      if (s2 === null)
        return true;
      else if (s2.menuItems)
        return s2.menuItems = s2.menuItems.filter(l4), s2.menuItems.length > 0;
      else
        return s2.caption.toLocaleLowerCase().includes(this.filter);
    };
    return i.filter(l4);
  }
  handleChange = (i) => {
    let { value: l4 } = this.parts, s2 = l4.value || "";
    if (this.value !== String(s2))
      this.value = s2, this.dispatchEvent(new Event("change"));
    this.filter = "", i.stopPropagation(), i.preventDefault();
  };
  handleKey = (i) => {
    if (i.key === "Enter")
      i.preventDefault();
  };
  filterMenu = Dn(() => {
    this.filter = this.parts.value.value.toLocaleLowerCase(), p1(0), this.popOptions();
  });
  popOptions = (i) => {
    if (i && i.type === "click")
      this.filter = "";
    this.poppedOptions = this.optionsMenu, this.isExpanded = true, this.updateAriaExpanded(), J2({ target: this, menuItems: this.poppedOptions, showChecked: true, role: "listbox", onClose: () => {
      this.isExpanded = false, this.updateAriaExpanded();
    } });
  };
  updateAriaExpanded() {
    let { value: i } = this.parts;
    i.setAttribute("aria-expanded", String(this.isExpanded));
  }
  content = () => [d5({ type: "button", part: "button", onClick: this.popOptions }, F0(), f5({ part: "value", value: this.value, tabindex: 0, role: "combobox", ariaHaspopup: "listbox", ariaExpanded: "false", ariaAutocomplete: this.editable ? "list" : "none", onKeydown: this.handleKey, onInput: this.filterMenu, onChange: this.handleChange }), t3.chevronDown())];
  get allOptions() {
    let i = [];
    function l4(s2) {
      for (let o of s2)
        if (typeof o === "string")
          i.push({ caption: o, value: o });
        else if (o?.value)
          i.push(o);
        else if (o?.options)
          l4(o.options);
    }
    return l4(this.selectOptions), i;
  }
  findOption() {
    return this.allOptions.find((l4) => l4.value === this.value) || { caption: this.value, value: this.value };
  }
  localeChanged = () => {
    this.queueRender();
  };
  connectedCallback() {
    super.connectedCallback();
    let i = this.getAttribute("options");
    if (i && this._options.length === 0)
      this._options = T3.parseOptionsString(i);
    if (this.localized)
      a2.allInstances.add(this);
  }
  disconnectedCallback() {
    if (super.disconnectedCallback(), this.localized)
      a2.allInstances.delete(this);
  }
  render() {
    super.render();
    let { value: i, button: l4 } = this.parts;
    l4.disabled = this.disabled;
    let s2 = i.previousElementSibling, o = this.findOption(), h2 = F0();
    if (i.value = this.localized ? z3(o.caption) : o.caption, o.icon)
      if (o.icon instanceof HTMLElement)
        h2 = o.icon.cloneNode(true);
      else
        h2 = t3[o.icon]();
    s2.replaceWith(h2), i.setAttribute("placeholder", this.localized ? z3(this.placeholder) : this.placeholder), i.style.pointerEvents = this.editable ? "" : "none", i.readOnly = !this.editable;
  }
}
var X2 = T3.elementCreator({ tag: "tosi-select", styleSpec: { ":host": { "--tosi-select-gap": "var(--tosi-spacing-sm, 8px)", "--tosi-select-touch-size": "var(--tosi-touch-size, 44px)", "--tosi-select-padding": "0 var(--tosi-spacing-sm, 8px)", "--tosi-select-value-padding": "0 var(--tosi-spacing-sm, 8px)", "--tosi-select-icon-width": "24px", "--tosi-select-field-width": "140px", "--gap": "var(--tosi-select-gap)", "--touch-size": "var(--tosi-select-touch-size)", "--padding": "var(--tosi-select-padding)", "--value-padding": "var(--tosi-select-value-padding)", "--icon-width": "var(--tosi-select-icon-width)", "--fieldWidth": "var(--tosi-select-field-width)", display: "inline-flex", position: "relative" }, ":host button": { display: "flex", alignItems: "center", justifyItems: "center", gap: gn.tosiSelectGap, textAlign: "left", height: gn.tosiSelectTouchSize, padding: gn.tosiSelectPadding, position: "relative", width: "100%" }, ":host:not([show-icon]) button > :first-child": { display: "none" }, ":host[hide-caption] button > :nth-child(2)": { display: "none" }, ':host [part="value"]': { width: gn.tosiSelectFieldWidth, padding: gn.tosiSelectValuePadding, height: gn.tosiSelectTouchSize, lineHeight: gn.tosiSelectTouchSize, boxShadow: "none", whiteSpace: "nowrap", outline: "none", background: "transparent", flex: "1" }, ':host [part="value"]:not(:focus)': { overflow: "hidden", textOverflow: "ellipsis", background: "transparent" } } });
var r9 = On((...i) => X2(...i), "xinSelect is deprecated, use tosiSelect instead (tag is now <tosi-select>)");
var { span: _0 } = T;
var { i18n: A2 } = Zn({ i18n: { locale: window.navigator.language, locales: [window.navigator.language], languages: [window.navigator.language], emoji: [""], stringMap: {}, localeOptions: [{ icon: _0(), caption: window.navigator.language, value: window.navigator.language }] } });
Yn.localeOptions = { toDOM(i, l4) {
  if (i instanceof T3)
    i.options = l4;
} };
var O0 = () => {
  let i = Array.from(i1.allInstances);
  for (let l4 of i)
    l4.localeChanged();
};
A2.locale.observe(O0);
var g5 = C2((i) => [i.caption.toLocaleLowerCase()]);
function z3(i) {
  if (i.endsWith("…"))
    return z3(i.substring(0, i.length - 1)) + "…";
  let l4 = A2.locales.value.indexOf(A2.locale.value);
  if (l4 > -1) {
    let o = A2.stringMap.value[i.toLocaleLowerCase()], h2 = o && o[l4];
    if (h2)
      i = i.toLocaleLowerCase() === i ? h2.toLocaleLowerCase() : h2;
  }
  return i;
}

class g2 extends R {
  static initAttributes = { hideCaption: false };
  content = () => {
    return X2({ part: "select", showIcon: true, title: z3("Language"), bindValue: A2.locale, bindLocaleOptions: A2.localeOptions });
  };
  render() {
    super.render(), this.parts.select.toggleAttribute("hide-caption", this.hideCaption);
  }
}
var k5 = g2.elementCreator({ tag: "tosi-locale-picker" });
class i1 extends R {
  static allInstances = new Set;
  static initAttributes = { refString: "" };
  contents = () => T.xinSlot();
  connectedCallback() {
    super.connectedCallback(), i1.allInstances.add(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), i1.allInstances.delete(this);
  }
  localeChanged() {
    if (!this.refString)
      this.refString = this.textContent || "";
    this.textContent = this.refString ? z3(this.refString) : "";
  }
  render() {
    super.render(), this.localeChanged();
  }
}
var a2 = i1;
var l1 = i1.elementCreator({ tag: "tosi-localized", styleSpec: { ":host": { pointerEvents: "none" } } });
var P0 = (i, l4) => {
  l4 = l4.toLocaleLowerCase();
  let s2 = !!l4.match(/\^|ctrl/), o = !!l4.match(/⌘|meta/), h2 = !!l4.match(/⌥|⎇|alt|option/), r2 = !!l4.match(/⇧|shift/), y2 = l4.slice(-1);
  return i.key === y2 && i.metaKey === o && i.ctrlKey === s2 && i.altKey === h2 && i.shiftKey === r2;
};
var { div: $0, button: k2, span: K3, a: B5, xinSlot: z5 } = T;
Jo("xin-menu-helper", { ".xin-menu": { overflow: "hidden auto", maxHeight: `calc(${gn.maxHeight} - ${Jn.menuInset("8px")})`, borderRadius: gn.spacing50, background: Jn.menuBg("#fafafa"), boxShadow: Jn.menuShadow(`${gn.spacing13} ${gn.spacing50} ${gn.spacing} #0004`) }, ".xin-menu > div": { width: Jn.menuWidth("auto") }, ".xin-menu-trigger": { paddingLeft: 0, paddingRight: 0, minWidth: Jn.touchSize("48px") }, ".xin-menu-separator": { display: "inline-block", content: " ", height: "1px", width: "100%", background: Jn.menuSeparatorColor("#2224"), margin: Jn.menuSeparatorMargin("8px 0") }, ".xin-menu-item": { boxShadow: "none", border: "none !important", display: "grid", alignItems: "center", justifyContent: "flex-start", textDecoration: "none", gridTemplateColumns: "0px 1fr 30px", width: "100%", gap: 0, background: "transparent", padding: Jn.menuItemPadding("0 16px"), height: Jn.menuItemHeight("48px"), lineHeight: Jn.menuItemHeight("48px"), textAlign: "left" }, ".xin-menu-item, .xin-menu-item > span": { color: Jn.menuItemColor("#222") }, ".xin-menu-with-icons .xin-menu-item": { gridTemplateColumns: "30px 1fr 30px" }, ".xin-menu-item svg": { stroke: Jn.menuItemIconColor("#222") }, ".xin-menu-item.xin-menu-item-checked": { background: Jn.menuItemHoverBg("#eee") }, ".xin-menu-item > span:nth-child(2)": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" }, ".xin-menu-item:hover": { boxShadow: "none !important", background: Jn.menuItemHoverBg("#eee") }, ".xin-menu-item:active": { boxShadow: "none !important", background: Jn.menuItemActiveBg("#aaa"), color: Jn.menuItemActiveColor("#000") }, ".xin-menu-item:active svg": { stroke: Jn.menuItemIconActiveColor("#000") } });
var H5 = (i, l4) => {
  let s2 = i.checked && i.checked() && "check" || false, o = i?.icon || s2 || K3(" ");
  if (typeof o === "string")
    o = t3[o]();
  let h2 = l4.role === "listbox" ? "option" : "menuitem", r2;
  if (typeof i?.action === "string")
    r2 = B5({ class: "xin-menu-item", role: h2, href: i.action }, o, l4.localized ? K3(z3(i.caption)) : K3(i.caption), K3(i.shortcut || " "));
  else
    r2 = k2({ class: "xin-menu-item", role: h2, onClick: i.action }, o, l4.localized ? K3(z3(i.caption)) : K3(i.caption), K3(i.shortcut || " "));
  if (r2.classList.toggle("xin-menu-item-checked", s2 !== false), l4.role === "listbox" && s2)
    r2.setAttribute("aria-selected", "true");
  if (i?.enabled && !i.enabled())
    r2.setAttribute("disabled", ""), r2.setAttribute("aria-disabled", "true");
  return r2;
};
var j5 = (i, l4) => {
  let s2 = i.checked && i.checked() && "check" || false, o = i?.icon || s2 || K3(" ");
  if (typeof o === "string")
    o = t3[o]();
  let h2 = k2({ class: "xin-menu-item", disabled: !(!i.enabled || i.enabled()), onClick(r2) {
    J2(Object.assign({}, l4, { menuItems: i.menuItems, target: h2, submenuDepth: (l4.submenuDepth || 0) + 1, position: "side" })), r2.stopPropagation(), r2.preventDefault();
  } }, o, l4.localized ? K3(z3(i.caption)) : K3(i.caption), t3.chevronRight({ style: { justifySelf: "flex-end" } }));
  return h2;
};
var A5 = (i, l4) => {
  if (i === null)
    return K3({ class: "xin-menu-separator" });
  else {
    let s2 = i?.action ? H5(i, l4) : j5(i, l4);
    if (l4.showChecked && i.checked && i.checked())
      requestAnimationFrame(() => {
        s2.scrollIntoView({ block: "center" });
      });
    return s2;
  }
};
var F5 = (i) => {
  let { target: l4, width: s2, menuItems: o, role: h2 = "menu" } = i, r2 = o.find((y2) => y2?.icon || y2?.checked);
  return $0({ class: r2 ? "xin-menu xin-menu-with-icons" : "xin-menu", role: h2, onClick() {
    p1(0);
  } }, $0({ style: { minWidth: l4.offsetWidth + "px", width: typeof s2 === "number" ? `${s2}px` : s2 }, onMousedown(y2) {
    y2.preventDefault(), y2.stopPropagation();
  } }, ...o.map((y2) => A5(y2, i))));
};
var z1;
var d1 = [];
var p1 = (i = 0) => {
  let l4 = d1.splice(i);
  for (let s2 of l4)
    if (s2.menu.remove(), s2.onClose)
      s2.onClose();
  return z1 = l4[0], i > 0 ? d1[i - 1] : undefined;
};
document.body.addEventListener("mousedown", (i) => {
  if (i.target && !d1.find((l4) => l4.target.contains(i.target)))
    p1(0);
});
document.body.addEventListener("keydown", (i) => {
  if (i.key === "Escape")
    p1(0);
});
var J2 = (i) => {
  i = Object.assign({ submenuDepth: 0 }, i);
  let { target: l4, position: s2, submenuDepth: o } = i;
  if (z1 && !document.body.contains(z1?.menu))
    z1 = undefined;
  if (d1.length && !document.body.contains(d1[0].menu))
    d1.splice(0);
  if (o === 0 && z1?.target === l4)
    return;
  let h2 = p1(o);
  if (z1?.target === l4)
    return;
  if (h2 && h2.target === l4) {
    p1();
    return;
  }
  if (!i.menuItems?.length)
    return;
  let r2 = F5(i), y2 = A0({ content: r2, target: l4, position: s2 });
  y2.remainOnScroll = "remove", d1.push({ target: l4, menu: y2, onClose: i.onClose });
};
function J0(i, l4) {
  for (let s2 of i) {
    if (!s2)
      continue;
    let { shortcut: o } = s2, { menuItems: h2 } = s2;
    if (o) {
      if (P0(l4, o))
        return s2;
    } else if (h2) {
      let r2 = J0(h2, l4);
      if (r2)
        return r2;
    }
  }
  return;
}

class w2 extends R {
  static initAttributes = { menuWidth: "auto", localized: false, icon: "" };
  menuItems = [];
  showMenu = (i) => {
    if (i.type === "click" || i.code === "Space")
      J2({ target: this.parts.trigger, width: this.menuWidth, localized: this.localized, menuItems: this.menuItems }), i.stopPropagation(), i.preventDefault();
  };
  content = () => k2({ tabindex: 0, part: "trigger", onClick: this.showMenu }, z5());
  handleShortcut = async (i) => {
    let l4 = J0(this.menuItems, i);
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
var q5 = w2.elementCreator({ tag: "tosi-menu", styleSpec: { ":host": { display: "inline-block" }, ":host button > xin-slot": { display: "flex", alignItems: "center", gap: Jn.tosiMenuTriggerGap("10px") } } });
var B22 = {};
X4(B22, { init: () => M2, draggedElement: () => P5 });
var V5 = () => !!document.querySelector(".drag-source");
var G0 = (i, l4) => {
  if (!i)
    return false;
  for (let s2 of i)
    if (s2 === "special/any")
      return true;
    else if (s2.indexOf("*") > -1) {
      let [o, h2] = s2.split("/"), [r2, y2] = l4.split("/");
      if ((o === "*" || o === r2) && (h2 === "*" || h2 === y2))
        return true;
    } else if (s2 === l4)
      return true;
};
var S1 = (i) => {
  for (let l4 of [...document.querySelectorAll(`.${i}`)])
    l4.classList.remove(i);
};
var U0 = () => {
  S1("drag-over"), S1("drag-source"), S1("drag-target");
};
var v22 = (i, l4 = ";") => {
  return (i || "").split(l4).map((s2) => s2.trim()).filter((s2) => s2 !== "");
};
var Z0 = (i) => {
  if (!i)
    i = [];
  let l4 = [...document.querySelectorAll("[data-drop]")];
  for (let s2 of l4) {
    let o = v22(s2.dataset.drop);
    if (i.find((h2) => G0(o, h2)))
      s2.classList.add("drag-target");
    else
      s2.classList.remove("drag-target");
  }
};
function L5(i) {
  let l4 = i.target?.closest('[draggable="true"],a[href]');
  if (!l4)
    return;
  l4.classList.add("drag-source");
  let s2 = l4.matches('[draggable="true"]') ? v22(l4.dataset.drag || "text/html") : v22(l4.dataset.drag || "url");
  for (let o of s2) {
    let h2 = l4.dataset.dragContent || (o === "text/html" ? l4.innerHTML : l4.textContent);
    i.dataTransfer?.setData(o, h2 || "");
  }
  Z0(i.dataTransfer?.types), i.stopPropagation();
}
function Q0(i) {
  if (!V5())
    Z0(i.dataTransfer?.types);
  let l4 = i.target.closest(".drag-target");
  if (l4 && i.dataTransfer)
    l4.classList.add("drag-over"), i.dataTransfer.dropEffect = "copy";
  else
    i.preventDefault(), i.stopPropagation();
}
function _5() {
  S1("drag-over");
}
function O5(i) {
  let l4 = i.target.closest(".drag-target");
  if (l4) {
    let s2 = (l4.dataset?.drop || "").split(";");
    for (let o of s2)
      if (G0(i.dataTransfer?.types, o))
        if (o === "text/html")
          l4.innerHTML = i.dataTransfer?.getData(o) || "";
        else
          l4.textContent = i.dataTransfer?.getData(o) || "";
  }
  U0();
}
var P5 = () => document.querySelector(".drag-source");
var b0 = false;
var M2 = () => {
  if (b0)
    return;
  document.body.addEventListener("dragstart", L5), document.body.addEventListener("dragenter", Q0), document.body.addEventListener("dragover", Q0), document.body.addEventListener("drop", O5), document.body.addEventListener("dragleave", _5), document.body.addEventListener("dragend", U0), window.addEventListener("dragover", (i) => i.preventDefault()), window.addEventListener("drop", (i) => i.preventDefault()), b0 = true;
};
function b5(i, l4, s2) {
  let o = i.find((h2) => h2[l4] !== undefined && h2[l4] !== null);
  if (o !== undefined) {
    let h2 = o[l4];
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
var { div: H1, span: z22, button: G5, template: U5 } = T;
var K0 = (i) => i;

class H2 extends R {
  static initAttributes = { rowHeight: 30, charWidth: 15, minColumnWidth: 30, select: false, multiple: false, pinnedTop: 0, pinnedBottom: 0, nosort: false, nohide: false, noreorder: false, localized: false };
  selectionChanged = () => {};
  selectedKey = Symbol("selected");
  selectBinding = (i, l4) => {
    i.toggleAttribute("aria-selected", l4[this.selectedKey] === true);
  };
  maxVisibleRows = 1e4;
  get value() {
    return { array: this.array, filter: this.filter, columns: this.columns };
  }
  set value(i) {
    let { array: l4, columns: s2, filter: o } = Z(i);
    if (this._array !== l4 || this._columns !== s2 || this._filter !== o)
      this.queueRender();
    this._array = l4 || [], this._columns = s2 || null, this._filter = o || K0;
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
    this.rowData = Zn({ [this.instanceId]: this.rowData })[this.instanceId];
  }
  get array() {
    return this._array;
  }
  set array(i) {
    this._array = Z(i), this.queueRender();
  }
  get filter() {
    return this._filter;
  }
  set filter(i) {
    if (this._filter !== i)
      this._filter = i, this.queueRender();
  }
  get sort() {
    if (this._sort)
      return this._sort;
    let i = this._columns?.find((s2) => s2.sort === "ascending" || s2.sort === "descending");
    if (!i)
      return;
    let { prop: l4 } = i;
    return i.sort === "ascending" ? (s2, o) => s2[l4] > o[l4] ? 1 : -1 : (s2, o) => s2[l4] > o[l4] ? -1 : 1;
  }
  set sort(i) {
    if (this._sort !== i)
      this._sort = i, this.queueRender();
  }
  get columns() {
    if (!Array.isArray(this._columns)) {
      let { _array: i } = this;
      this._columns = Object.keys(i[0] || {}).map((l4) => {
        let s2 = b5(i, l4, this.charWidth);
        return { name: l4.replace(/([a-z])([A-Z])/g, "$1 $2").toLocaleLowerCase(), prop: l4, align: typeof i[0][l4] === "number" || i[0][l4] !== "" && !isNaN(i[0][l4]) ? "right" : "left", visible: s2 !== false, width: s2 ? s2 : 0 };
      });
    }
    return this._columns;
  }
  set columns(i) {
    this._columns = i, this.queueRender();
  }
  get visibleColumns() {
    return this.columns.filter((i) => i.visible !== false);
  }
  content = null;
  getColumn(i) {
    let l4 = (i.touches !== undefined ? i.touches[0].clientX : i.clientX) - this.getBoundingClientRect().x, s2 = i.touches !== undefined ? 20 : 5, o = 0, h2 = [];
    return this.visibleColumns.find((y2) => {
      if (y2.visible !== false)
        return o += y2.width, h2.push(o), Math.abs(l4 - o) < s2;
    });
  }
  setCursor = (i) => {
    if (this.getColumn(i) !== undefined)
      this.style.cursor = "col-resize";
    else
      this.style.cursor = "";
  };
  resizeColumn = (i) => {
    let l4 = this.getColumn(i);
    if (l4 !== undefined) {
      let s2 = Number(l4.width), o = i.touches !== undefined, h2 = o ? i.touches[0].identifier : undefined;
      G3(i, (r2, y2, e2) => {
        if ((o ? [...e2.touches].find((p3) => p3.identifier === h2) : true) === undefined)
          return true;
        let n = s2 + r2;
        if (l4.width = n > this.minColumnWidth ? n : this.minColumnWidth, this.setColumnWidths(), e2.type === "mouseup")
          return true;
      }, "col-resize");
    }
  };
  selectRow(i, l4 = true) {
    if (l4)
      i[this.selectedKey] = true;
    else
      delete i[this.selectedKey];
  }
  selectRows(i, l4 = true) {
    for (let s2 of i || this.array)
      this.selectRow(s2, l4);
  }
  deSelect(i) {
    this.selectRows(i, false);
  }
  rangeStart;
  updateSelection = (i) => {
    if (!this.select && !this.multiple)
      return;
    let { target: l4 } = i;
    if (!(l4 instanceof HTMLElement))
      return;
    let s2 = l4.closest(".tr");
    if (!(s2 instanceof HTMLElement))
      return;
    let o = Mf(s2);
    if (o === false)
      return;
    let h2 = i, r2 = window.getSelection();
    if (r2 !== null)
      r2.removeAllRanges();
    let y2 = this.visibleRows;
    if (this.multiple && h2.shiftKey && y2.length > 0 && this.rangeStart !== o) {
      let e2 = this.rangeStart === undefined || this.rangeStart[this.selectedKey] === true, [x3, n] = [this.rangeStart !== undefined ? y2.indexOf(this.rangeStart) : 0, y2.indexOf(o)].sort((p3, d3) => p3 - d3);
      if (x3 > -1)
        for (let p3 = x3;p3 <= n; p3++) {
          let d3 = y2[p3];
          this.selectRow(d3, e2);
        }
    } else if (this.multiple && h2.metaKey) {
      this.selectRow(o, !o[this.selectedKey]);
      let e2 = y2.indexOf(o), x3 = y2[e2 + 1], n = e2 > 0 ? y2[e2 - 1] : undefined;
      if (x3 !== undefined && x3[this.selectedKey] === true)
        this.rangeStart = x3;
      else if (n !== undefined && n[this.selectedKey] === true)
        this.rangeStart = n;
      else
        this.rangeStart = undefined;
    } else
      this.rangeStart = o, this.deSelect(), this.selectRow(o, true);
    this.selectionChanged(this.visibleSelectedRows);
    for (let e2 of Array.from(this.querySelectorAll(".tr"))) {
      let x3 = Mf(e2);
      this.selectBinding(e2, x3);
    }
  };
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("mousemove", this.setCursor), this.addEventListener("mousedown", this.resizeColumn), this.addEventListener("touchstart", this.resizeColumn, { passive: true }), this.addEventListener("mouseup", this.updateSelection), this.addEventListener("touchend", this.updateSelection);
  }
  setColumnWidths() {
    let i = this.visibleColumns.map((s2) => s2.width + "px").join(" "), l4 = this.visibleColumns.reduce((s2, o) => s2 + o.width, 0) + "px";
    this.style.setProperty("--tosi-table-grid-columns", i), this.style.setProperty("--tosi-table-grid-row-width", l4), this.style.setProperty("--grid-columns", i), this.style.setProperty("--grid-row-width", l4);
  }
  sortByColumn = (i, l4 = "auto") => {
    for (let s2 of this.columns.filter((o) => Z(o.sort) !== false))
      if (Z(s2) === i) {
        if (l4 === "auto")
          s2.sort = s2.sort === "ascending" ? "descending" : "ascending";
        else
          s2.sort = l4;
        this.queueRender();
      } else
        delete s2.sort;
  };
  popColumnMenu = (i, l4) => {
    let { sortByColumn: s2 } = this, o = this.columns.filter((y2) => y2.visible === false), h2 = this.queueRender.bind(this), r2 = [];
    if (!this.nosort && l4.sort !== false)
      r2.push({ caption: this.localized ? `${z3("Sort")} ${z3("Ascending")}` : "Sort Ascending", icon: "sortAscending", action() {
        s2(l4);
      } }, { caption: this.localized ? `${z3("Sort")} ${z3("Descending")}` : "Sort Descending", icon: "sortDescending", action() {
        s2(l4, "descending");
      } });
    if (!this.nohide) {
      if (r2.length)
        r2.push(null);
      r2.push({ caption: this.localized ? `${z3("Hide")} ${z3("Column")}` : "Hide Column", icon: "eyeOff", enabled: () => l4.visible !== true, action() {
        l4.visible = false, h2();
      } }, { caption: this.localized ? `${z3("Show")} ${z3("Column")}` : "Show Column", icon: "eye", enabled: () => o.length > 0, menuItems: o.map((y2) => {
        return { caption: y2.name || y2.prop, action() {
          delete y2.visible, h2();
        } };
      }) });
    }
    J2({ target: i, localized: this.localized, menuItems: r2 });
  };
  get captionSpan() {
    return this.localized ? l1 : z22;
  }
  headerCell = (i) => {
    let { popColumnMenu: l4 } = this, s2 = "none", o;
    switch (i.sort) {
      case "ascending":
        o = t3.sortAscending(), s2 = "descending";
        break;
      case false:
        break;
      default:
        break;
      case "descending":
        s2 = "ascending", o = t3.sortDescending();
    }
    let h2 = !(this.nosort && this.nohide) ? G5({ class: "menu-trigger", onClick(r2) {
      l4(r2.target, i), r2.stopPropagation();
    } }, o || t3.moreVertical()) : {};
    return i.headerCell !== undefined ? i.headerCell(i) : z22({ class: "th", role: "columnheader", ariaSort: s2, style: { ...this.cellStyle, justifyContent: i.align || "left" } }, this.captionSpan({ style: { flex: "1" } }, typeof i.name === "string" ? i.name : i.prop), h2);
  };
  dataCell = (i) => {
    if (i.dataCell !== undefined)
      return i.dataCell(i);
    return z22({ class: "td", role: "cell", style: { ...this.cellStyle, justifyContent: i.align || "left" }, bindText: `^.${i.prop}` });
  };
  get visibleRows() {
    return Z(this.rowData.visible);
  }
  get visibleSelectedRows() {
    return this.visibleRows.filter((i) => i[this.selectedKey]);
  }
  get selectedRows() {
    return this.array.filter((i) => i[this.selectedKey]);
  }
  rowTemplate(i) {
    return U5(H1({ class: "tr", role: "row", bind: { value: "^", binding: { toDOM: this.selectBinding } } }, ...i.map(this.dataCell)));
  }
  draggedColumn;
  dropColumn = (i) => {
    let l4 = i.target.closest(".drag-over"), s2 = Array.from(l4.parentElement.children).indexOf(l4), o = this.visibleColumns[s2], h2 = this.columns.indexOf(this.draggedColumn), r2 = this.columns.indexOf(o);
    this.columns.splice(h2, 1), this.columns.splice(r2, 0, this.draggedColumn), console.log({ event: i, target: l4, targetIndex: s2, draggedIndex: h2, droppedIndex: r2 }), this.queueRender(), i.preventDefault(), i.stopPropagation();
  };
  render() {
    super.render(), this.rowData.pinnedTop = this.pinnedTop > 0 ? this._array.slice(0, this.pinnedTop) : [], this.rowData.pinnedBottom = this.pinnedBottom > 0 ? this._array.slice(this._array.length - this.pinnedBottom) : [], this.rowData.visible = this.filter(this._array.slice(this.pinnedTop, Math.min(this.maxVisibleRows, this._array.length - this.pinnedTop - this.pinnedBottom)));
    let { sort: i } = this;
    if (i)
      this.rowData.visible.sort(i);
    this.textContent = "", this.style.display = "flex", this.style.flexDirection = "column";
    let { visibleColumns: l4 } = this;
    if (this.style.setProperty("--tosi-table-row-height", `${this.rowHeight}px`), this.style.setProperty("--row-height", `${this.rowHeight}px`), this.setColumnWidths(), !this.noreorder)
      M2();
    let s2 = this.instanceId + "-column-header", o = l4.map((h2) => {
      let r2 = this.headerCell(h2);
      if (!this.noreorder && r2.children[0]) {
        let y2 = r2.children[0];
        y2.setAttribute("draggable", "true"), y2.style.pointerEvents = "all", y2.dataset.drag = s2, r2.dataset.drop = s2, y2.addEventListener("dragstart", () => {
          this.draggedColumn = h2;
        }), r2.addEventListener("drop", this.dropColumn);
      }
      return r2;
    });
    if (this.append(H1({ class: "thead", role: "rowgroup", style: { touchAction: "none" } }, H1({ class: "tr", role: "row" }, ...o))), this.pinnedTop > 0)
      this.append(H1({ part: "pinnedTopRows", class: "tbody", role: "rowgroup", style: { flex: "0 0 auto", overflow: "hidden", height: `${this.rowHeight * this.pinnedTop}px` }, bindList: { value: this.rowData.pinnedTop, virtual: this.virtual } }, this.rowTemplate(l4)));
    if (this.append(H1({ part: "visibleRows", class: "tbody", role: "rowgroup", style: { content: " ", minHeight: "100px", flex: "1 1 100px", overflow: "hidden auto" }, bindList: { value: this.rowData.visible, virtual: this.virtual } }, this.rowTemplate(l4))), this.pinnedBottom > 0)
      this.append(H1({ part: "pinnedBottomRows", class: "tbody", role: "rowgroup", style: { flex: "0 0 auto", overflow: "hidden", height: `${this.rowHeight * this.pinnedBottom}px` }, bindList: { value: this.rowData.pinnedBottom, virtual: this.virtual } }, this.rowTemplate(l4)));
  }
}
var Y0 = H2.elementCreator({ tag: "tosi-table", styleSpec: { ":host": { "--tosi-table-row-height": "32px", "--tosi-table-touch-size": "var(--tosi-touch-size, 44px)", "--tosi-table-dragged-header-bg": "#0004", "--tosi-table-dragged-header-color": "#fff", "--tosi-table-drop-header-bg": "#fff4", "--row-height": "var(--tosi-table-row-height)", "--touch-size": "var(--tosi-table-touch-size)", "--dragged-header-bg": "var(--tosi-table-dragged-header-bg)", "--dragged-header-color": "var(--tosi-table-dragged-header-color)", "--drop-header-bg": "var(--tosi-table-drop-header-bg)", overflow: "auto hidden" }, ":host .thead, :host .tbody": { width: gn.tosiTableGridRowWidth }, ":host .tr": { display: "grid", gridTemplateColumns: gn.tosiTableGridColumns, height: gn.tosiTableRowHeight, lineHeight: gn.tosiTableRowHeight }, ":host .td, :host .th": { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "flex", alignItems: "center" }, ":host .th .menu-trigger": { color: "currentColor", background: "none", padding: 0, lineHeight: gn.tosiTableTouchSize, height: gn.tosiTableTouchSize, width: gn.tosiTableTouchSize }, ':host [draggable="true"]': { cursor: "ew-resize" }, ':host [draggable="true"]:active': { background: gn.tosiTableDraggedHeaderBg, color: gn.tosiTableDraggedHeaderColor }, ":host .drag-over": { background: gn.tosiTableDropHeaderBg } } });
var { dialog: K5, button: F2, header: Y5, footer: N5, xinSlot: q22, h3: V22, p: L2, label: W5, input: R5, div: D5 } = T;

class W0 extends R {
  static async alert(i, l4 = "Alert") {
    return new Promise((s2) => {
      let o = _22({ removeOnClose: true, closeOnBackgroundClick: true, dialogWillClose() {
        s2();
      } }, V22({ slot: "header" }, l4), i.includes(`
`) ? T.pre({ style: { whiteSpace: "pre-wrap", margin: 0 } }, i) : L2(i));
      document.body.append(o), o.showModal();
    });
  }
  static async confirm(i, l4 = "Confirm") {
    return new Promise((s2) => {
      let o = _22({ removeOnClose: true, dialogWillClose(h2) {
        s2(h2 === "confirm");
      } }, V22({ slot: "header" }, l4), L2(i), F2({ slot: "footer", onClick() {
        o.close();
      } }, "Cancel"));
      document.body.append(o), o.showModal();
    });
  }
  static async prompt(i, l4 = "Prompt", s2 = "") {
    return new Promise((o) => {
      let h2 = R5({ value: s2 }), r2 = _22({ removeOnClose: true, dialogWillClose(y2) {
        o(y2 === "confirm" ? h2.value : null);
      }, initialFocus() {
        h2.focus();
      } }, V22({ slot: "header" }, l4), L2(W5({ style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: 5 } }, D5(i), h2)), F2({ slot: "footer", onClick() {
        r2.close();
      } }, "Cancel"));
      document.body.append(r2), r2.showModal();
    });
  }
  static initAttributes = { removeOnClose: false, closeOnBackgroundClick: false };
  constructor() {
    super();
    En(this, "click", () => {
      if (this.closeOnBackgroundClick)
        this.close();
    });
  }
  dialogWillClose = (i = "cancel") => {
    console.log("dialog will close with", i);
  };
  initialFocus() {
    this.parts.ok.focus();
  }
  #i = (i) => {};
  showModal = () => {
    return this.style.zIndex = String(B1()), new Promise((i) => {
      this.#i = i, this.parts.dialog.showModal(), requestAnimationFrame(() => {
        this.initialFocus();
      });
    });
  };
  close = (i = "cancel") => {
    if (this.dialogWillClose(i), this.#i(i), this.parts.dialog.close(), this.removeOnClose)
      this.remove();
  };
  ok = () => {
    this.close("confirm");
  };
  content = () => K5({ part: "dialog" }, Y5(q22({ name: "header" })), q22(), N5(q22({ name: "footer" }), F2({ part: "ok", onClick: this.ok }, "OK")));
}
var _22 = W0.elementCreator({ tag: "tosi-dialog", styleSpec: { ":host > dialog::backdrop": { backdropFilter: "blur(8px)" }, ":host > dialog:not([open])": { display: "none" }, ":host > dialog[open]": { minWidth: 300, border: 0, borderRadius: 10, overflow: "hidden", maxHeight: "calc(100% - 20px)", padding: 0, display: "flex", flexDirection: "column", gap: 5, _dialogShadow: Jn.menuShadow("0 5px 10px #0004"), _dialogBackground: Jn.background("#fafafa"), _dialogColor: Jn.textColor("#222"), boxShadow: gn.dialogShadow, background: gn.dialogBackground, color: gn.dialogColor }, ":host > dialog > *": { padding: "0 20px" }, ":host > dialog > header": { display: "flex", justifyContent: "center", gap: 10 }, ":host > dialog > footer": { display: "flex", justifyContent: "flex-end", gap: 10, paddingBottom: 20 } } });
function E0(i, l4) {
  if (l4 == null)
    l4 = "";
  else if (typeof l4 !== "string")
    l4 = String(l4);
  return l4.replace(/\{\{([^}]+)\}\}/g, (s2, o) => {
    let h2 = G[`${i}${o.startsWith("[") ? o : "." + o}`];
    return h2 === undefined ? s2 : E0(i, String(h2));
  });
}

class O2 extends R {
  static initAttributes = { src: "", elements: false };
  context = {};
  value = "";
  content = null;
  options = {};
  connectedCallback() {
    if (super.connectedCallback(), this.src !== "")
      (async () => {
        let i = await fetch(this.src);
        this.value = await i.text();
      })();
    else if (this.value === "")
      if (this.elements)
        this.value = this.innerHTML;
      else
        this.value = this.textContent != null ? this.textContent : "";
  }
  didRender = () => {};
  render() {
    super.render(), G[this.instanceId] = typeof this.context === "string" ? JSON.parse(this.context) : this.context;
    let i = E0(this.instanceId, this.value);
    if (this.elements) {
      let l4 = i.split(`
`).reduce((s2, o) => {
        if (o.startsWith("<") || s2.length === 0)
          s2.push(o);
        else {
          let h2 = s2[s2.length - 1];
          if (!h2.startsWith("<") || !h2.endsWith(">"))
            s2[s2.length - 1] += `
` + o;
          else
            s2.push(o);
        }
        return s2;
      }, []);
      this.innerHTML = l4.map((s2) => s2.startsWith("<") && s2.endsWith(">") ? s2 : k(s2, this.options)).join("");
    } else
      this.innerHTML = k(i, this.options);
    this.didRender();
  }
}
var G1 = O2.elementCreator({ tag: "tosi-md" });
var { div: f1, slot: I0, span: m5, button: S5 } = T;

class P22 extends R {
  static initAttributes = { localized: false };
  value = 0;
  makeTab(i, l4, s2) {
    let o = l4.getAttribute("name"), h2 = l4.querySelector('template[role="tab"]')?.content.cloneNode(true) || (this.localized ? l1(o) : m5(o));
    return f1(h2, { part: "tab", tabindex: 0, role: "tab", ariaControls: s2 }, l4.hasAttribute("data-close") ? S5({ title: "close", class: "close" }, t3.x()) : {});
  }
  static styleSpec = { ":host": { "--tosi-tabs-selected-color": "var(--xin-tabs-selected-color, var(--tosi-accent, currentColor))", "--tosi-tabs-bar-color": "var(--xin-tabs-bar-color, #ccc)", "--tosi-tabs-bar-height": "var(--xin-tabs-bar-height, 2px)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", boxShadow: "none !important" }, slot: { position: "relative", display: "block", flex: "1", overflow: "hidden", overflowY: "auto" }, 'slot[name="after-tabs"]': { flex: "0 0 auto" }, "::slotted([hidden])": { display: "none !important" }, ":host::part(tabpanel)": { display: "flex", flexDirection: "column", overflowX: "auto" }, ":host::part(tabrow)": { display: "flex" }, ":host .tabs": { display: "flex", userSelect: "none", whiteSpace: "nowrap" }, ":host .tabs > div": { padding: `${gn.spacing50} ${gn.spacing}`, cursor: "default", display: "flex", alignItems: "baseline" }, ':host .tabs > [aria-selected="true"]': { "--text-color": gn.tosiTabsSelectedColor, color: gn.textColor }, ":host .elastic": { flex: "1" }, ":host .border": { background: gn.tosiTabsBarColor }, ":host .border > .selected": { content: " ", width: 0, height: gn.tosiTabsBarHeight, background: gn.tosiTabsSelectedColor, transition: "ease-out 0.2s" }, ":host button.close": { border: 0, background: "transparent", textAlign: "center", marginLeft: gn.spacing50, padding: 0 }, ":host button.close > svg": { height: "12px" } };
  onCloseTab = null;
  content = [f1({ role: "tabpanel", part: "tabpanel" }, f1({ part: "tabrow" }, f1({ class: "tabs", part: "tabs" }), f1({ class: "elastic" }), I0({ name: "after-tabs" })), f1({ class: "border" }, f1({ class: "selected", part: "selected" }))), I0()];
  addTabBody(i, l4 = false) {
    if (!i.hasAttribute("name"))
      throw console.error("element has no name attribute", i), Error("element has no name attribute");
    if (this.append(i), this.setupTabs(), l4)
      this.value = this.bodies.length - 1;
    this.queueRender();
  }
  removeTabBody(i) {
    i.remove(), this.setupTabs(), this.queueRender();
  }
  keyTab = (i) => {
    let { tabs: l4 } = this.parts, s2 = [...l4.children].indexOf(i.target);
    switch (i.key) {
      case "ArrowLeft":
        this.value = (s2 + Number(l4.children.length) - 1) % l4.children.length, l4.children[this.value].focus(), i.preventDefault();
        break;
      case "ArrowRight":
        this.value = (s2 + 1) % l4.children.length, l4.children[this.value].focus(), i.preventDefault();
        break;
      case " ":
        this.pickTab(i), i.preventDefault();
        break;
      default:
    }
  };
  get bodies() {
    return [...this.children].filter((i) => i.hasAttribute("name"));
  }
  pickTab = (i) => {
    let { tabs: l4 } = this.parts, s2 = i.target, o = s2.closest("button.close") !== null, h2 = s2.closest(".tabs > div"), r2 = [...l4.children].indexOf(h2);
    if (o) {
      let y2 = this.bodies[r2];
      if (!this.onCloseTab || this.onCloseTab(y2) !== false)
        this.removeTabBody(this.bodies[r2]);
    } else if (r2 > -1)
      this.value = r2;
  };
  setupTabs = () => {
    let { tabs: i } = this.parts, l4 = [...this.children].filter((s2) => !s2.hasAttribute("slot") && s2.hasAttribute("name"));
    if (i.textContent = "", this.value >= l4.length)
      this.value = l4.length - 1;
    for (let s2 in l4) {
      let o = l4[s2], h2 = `${this.instanceId}-${s2}`;
      o.id = h2;
      let r2 = this.makeTab(this, o, h2);
      i.append(r2);
    }
  };
  connectedCallback() {
    super.connectedCallback();
    let { tabs: i } = this.parts;
    i.addEventListener("click", this.pickTab), i.addEventListener("keydown", this.keyTab), this.setupTabs(), i1.allInstances.add(this);
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
    let { tabs: i, selected: l4 } = this.parts, s2 = this.bodies;
    for (let o = 0;o < s2.length; o++) {
      let h2 = s2[o], r2 = i.children[o];
      if (this.value === Number(o))
        r2.setAttribute("aria-selected", "true"), l4.style.marginLeft = `${r2.offsetLeft - i.offsetLeft}px`, l4.style.width = `${r2.offsetWidth}px`, h2.toggleAttribute("hidden", false);
      else
        r2.toggleAttribute("aria-selected", false), h2.toggleAttribute("hidden", true);
    }
  }
}
var T1 = P22.elementCreator({ tag: "tosi-tabs" });
var T5 = () => "https://cdn.jsdelivr.net/npm/sucrase@3.35.0/+esm";
var U1 = (async () => {}).constructor;
function C1(i, l4) {
  let s2 = i;
  for (let o of l4)
    s2 = s2.replace(new RegExp(`import \\{(.*)\\} from '${o}'`, "g"), `const {$1} = ${o.replace(/-/g, "")}`);
  return s2;
}
async function $2() {
  let { transform: i } = await import(T5());
  return i;
}
var Q2 = "live-example-payload";
function u0(i, l4, s2) {
  return s2 !== "" ? `${i}-${s2}` : `${i}-${l4}`;
}
function J22(i, l4) {
  try {
    localStorage.setItem(i, JSON.stringify(l4));
  } catch (s2) {
    console.warn("live-example: failed to write to localStorage", s2);
  }
}
function li(i) {
  if (i === null)
    return null;
  try {
    return JSON.parse(i);
  } catch {
    return null;
  }
}
function m0(i, l4, s2, o, h2) {
  let r2 = location.href.split("?")[0] + `?${i}=${l4}`;
  J22(s2, { remoteKey: o, sentAt: Date.now(), ...h2 }), window.open(r2);
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
  constructor(i, l4, s2) {
    this.storageKey = i, this.remoteKey = l4, this.onReceive = s2;
  }
  handlePayload = (i) => {
    if (i.sentAt <= this.lastUpdate)
      return;
    if (i.remoteKey !== this.remoteKey)
      return;
    this.lastUpdate = i.sentAt, this.onReceive(i);
  };
  handleMessage = (i) => {
    let l4 = i.data;
    if (l4)
      this.handlePayload(l4);
  };
  handlePoll = () => {
    let i = null;
    try {
      i = localStorage.getItem(this.storageKey);
    } catch {
      return;
    }
    let l4 = li(i);
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
  send(i) {
    let l4 = { remoteKey: this.remoteKey, sentAt: Date.now(), ...i };
    if (J22(this.storageKey, l4), this.channel)
      this.channel.postMessage(l4);
  }
  sendClose() {
    let i = { remoteKey: this.remoteKey, sentAt: Date.now(), css: "", html: "", js: "", close: true };
    if (J22(this.storageKey, i), this.channel)
      this.channel.postMessage(i);
  }
}
var { div: hi } = T;
function ri(i, l4) {
  let s2 = i.customElements;
  if (!s2)
    return;
  let o = (r2) => {
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
          o(y2.tagName);
    }
  let h2 = i.document;
  if (h2) {
    let r2 = h2.querySelectorAll("*");
    for (let y2 of r2) {
      let e2 = y2.tagName.toLowerCase();
      if (e2.includes("-"))
        o(e2);
    }
  }
}
async function b22(i) {
  let { html: l4, css: s2, js: o, context: h2, transform: r2, exampleElement: y2, styleElement: e2, widgetsElement: x3, onError: n } = i, p3 = hi({ class: "preview" });
  p3.innerHTML = l4, e2.innerText = s2;
  let d3 = y2.querySelector(".preview");
  if (d3)
    d3.replaceWith(p3);
  else
    y2.insertBefore(p3, x3);
  let C3 = { preview: p3, ...h2 };
  try {
    let k3 = C1(o, Object.keys(h2)), w3 = r2(k3, { transforms: ["typescript"] }).code, O3 = Object.keys(C3).map((F3) => F3.replace(/-/g, "")), R2 = Object.values(C3);
    await new U1(...O3, w3)(...R2);
  } catch (k3) {
    if (console.error(k3), n)
      n(k3);
    else
      window.alert(`Error: ${k3}, the console may have more information…`);
  }
  return p3;
}
async function G22(i) {
  let { html: l4, css: s2, js: o, context: h2, transform: r2, exampleElement: y2, widgetsElement: e2, onError: x3 } = i, n = y2.querySelector("iframe.preview-iframe");
  if (!n) {
    n = document.createElement("iframe"), n.className = "preview-iframe", n.style.cssText = "width: 100%; height: 100%; border: none;";
    let w3 = y2.querySelector(".preview");
    if (w3)
      w3.replaceWith(n);
    else
      y2.insertBefore(n, e2);
  }
  let p3 = n.contentDocument;
  if (!p3)
    return console.error("Could not access iframe document"), null;
  let d3 = n.contentWindow;
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
    let w3 = C1(o, Object.keys(h2)), O3 = r2(w3, { transforms: ["typescript"] }).code, R2 = d3.eval("(async () => {}).constructor"), H = Object.keys(k3).map((v1) => v1.replace(/-/g, "")), F3 = Object.values(k3);
    await new R2(...H, O3)(...F3);
  } catch (w3) {
    if (console.error(w3), x3)
      x3(w3);
    else
      window.alert(`Error: ${w3}, the console may have more information…`);
  }
  return C3;
}
function U22(i, l4, s2, o) {
  let h2 = [...i.querySelectorAll(".language-html,.language-js,.language-css,.language-test")].filter((r2) => !r2.closest(o)).map((r2) => ({ block: r2.parentElement, language: r2.classList[0].split("-").pop(), code: r2.innerText }));
  for (let r2 = 0;r2 < h2.length; r2 += 1) {
    let y2 = [h2[r2]];
    while (r2 < h2.length - 1 && h2[r2].block.nextElementSibling === h2[r2 + 1].block)
      y2.push(h2[r2 + 1]), r2 += 1;
    let e2 = s2({ context: l4 });
    y2[0].block.parentElement.insertBefore(e2, y2[0].block), y2.forEach((n) => {
      switch (n.language) {
        case "js":
          e2.js = n.code;
          break;
        case "html":
          e2.html = n.code;
          break;
        case "css":
          e2.css = n.code;
          break;
        case "test":
          e2.test = n.code;
          break;
      }
      n.block.remove();
    }), e2.showDefaultTab();
  }
}
var S0 = { ":host": { "--tosi-example-height": "320px", "--code-editors-bar-bg": "#777", "--code-editors-bar-color": "#fff", "--widget-bg": "#fff8", "--widget-color": "#000", position: "relative", display: "flex", height: "var(--tosi-example-height)", background: "var(--background)", boxSizing: "border-box" }, ":host.-maximize": { position: "fixed", left: "0", top: "0", height: "100vh", width: "100vw", margin: "0 !important" }, ".-maximize": { zIndex: 101 }, ":host.-vertical": { flexDirection: "column" }, ":host .layout-indicator": { transition: "0.5s ease-out", transform: "rotateZ(270deg)" }, ":host.-vertical .layout-indicator": { transform: "rotateZ(180deg)" }, ":host.-maximize .hide-if-maximized, :host:not(.-maximize) .show-if-maximized": { display: "none" }, ':host [part="example"]': { flex: "1 1 50%", height: "100%", position: "relative", overflowX: "auto" }, ":host .preview": { height: "100%", position: "relative", overflow: "hidden", boxShadow: "inset 0 0 0 2px #8883" }, ':host [part="editors"]': { flex: "1 1 200px", height: "100%", position: "relative" }, ':host [part="exampleWidgets"]': { position: "absolute", left: "5px", bottom: "5px", "--widget-color": "var(--brand-color)", borderRadius: "5px", width: "44px", height: "44px", lineHeight: "44px", zIndex: "100" }, ':host [part="exampleWidgets"] svg': { stroke: "var(--widget-color)" }, ":host .code-editors": { overflow: "hidden", background: "white", position: "relative", top: "0", right: "0", flex: "1 1 50%", height: "100%", flexDirection: "column", zIndex: "10" }, ":host .code-editors:not([hidden])": { display: "flex" }, ":host .code-editors > h4": { padding: "5px", margin: "0", textAlign: "center", background: "var(--code-editors-bar-bg)", color: "var(--code-editors-bar-color)", cursor: "move" }, ":host button.transparent, :host .sizer": { width: "32px", height: "32px", lineHeight: "32px", textAlign: "center", padding: "0", margin: "0" }, ":host .sizer": { cursor: "nwse-resize" }, ':host [part="testIndicator"]': { position: "absolute", top: "8px", right: "8px", width: "12px", height: "12px", borderRadius: "50%", background: "#888", zIndex: "100", display: "none" }, ':host.-has-tests [part="testIndicator"]': { display: "block", opacity: "var(--tests-enabled, 1)" }, ':host.-test-running [part="testIndicator"]': { background: "#fa0", animation: "test-pulse 0.5s ease-in-out infinite" }, ':host.-test-passed [part="testIndicator"]': { background: "#0a0", animation: "test-fade 2s ease-out forwards" }, ':host.-test-failed [part="testIndicator"]': { background: "#c00", animation: "test-pulse 1s ease-in-out infinite" }, "@keyframes test-pulse": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } }, "@keyframes test-fade": { "0%": { opacity: "1" }, "50%": { opacity: "1" }, "100%": { opacity: "0" } }, ':host.-test-passed [part="exampleWidgets"]': { "--widget-color": "#0a0" }, ':host.-test-failed [part="exampleWidgets"]': { "--widget-color": "#f00" }, ':host [part="testResults"]': { position: "absolute", bottom: "54px", left: "5px", background: "var(--widget-bg)", borderRadius: "5px", padding: "8px", fontSize: "14px", margin: "0", maxWidth: "400px", maxHeight: "200px", overflow: "auto", zIndex: "100" }, ':host [part="testResults"][hidden]': { display: "none" }, ":host .test-pass": { color: "#0a0" }, ":host .test-fail": { color: "#f00" } };

class Z22 extends Error {
  constructor(i) {
    super(i);
    this.name = "AssertionError";
  }
}
function T0(i, l4) {
  if (i === l4)
    return true;
  if (typeof i !== typeof l4)
    return false;
  if (i === null || l4 === null)
    return i === l4;
  if (typeof i !== "object")
    return false;
  let s2 = i, o = l4;
  if (Array.isArray(s2) !== Array.isArray(o))
    return false;
  let h2 = Object.keys(s2), r2 = Object.keys(o);
  if (h2.length !== r2.length)
    return false;
  return h2.every((y2) => T0(s2[y2], o[y2]));
}
var yi = 5000;
var ei = { stringify(i) {
  if (typeof i > "u")
    return "undefined";
  if (i === null)
    return "null";
  if (typeof Element < "u" && i instanceof Element)
    return `<${i.tagName.toLowerCase()}>`;
  if (typeof Node < "u" && i instanceof Node)
    return `[${i.nodeName}]`;
  try {
    return JSON.stringify(i);
  } catch {
    return String(i);
  }
} };
var { stringify: u2 } = ei;
function i4(i, l4 = false) {
  let s2 = (h2, r2) => {
    if (!(l4 ? !h2 : h2))
      throw new Z22(l4 ? `not: ${r2}` : r2);
  };
  return { toBe(h2) {
    s2(i === h2, `Expected ${u2(i)} to be ${u2(h2)}`);
  }, toEqual(h2) {
    s2(T0(i, h2), `Expected ${u2(i)} to equal ${u2(h2)}`);
  }, toBeTruthy() {
    s2(!!i, `Expected ${u2(i)} to be truthy`);
  }, toBeFalsy() {
    s2(!i, `Expected ${u2(i)} to be falsy`);
  }, toBeNull() {
    s2(i === null, `Expected ${u2(i)} to be null`);
  }, toBeUndefined() {
    s2(i === undefined, `Expected ${u2(i)} to be undefined`);
  }, toBeDefined() {
    s2(i !== undefined, `Expected ${u2(i)} to be defined`);
  }, toContain(h2) {
    if (typeof i === "string")
      s2(i.includes(h2), `Expected "${i}" to contain "${h2}"`);
    else if (Array.isArray(i))
      s2(i.includes(h2), `Expected array to contain ${u2(h2)}`);
    else
      throw new Z22("toContain requires string or array");
  }, toHaveLength(h2) {
    let r2 = i.length;
    s2(r2 === h2, `Expected length ${r2} to be ${h2}`);
  }, toMatch(h2) {
    s2(h2.test(i), `Expected "${i}" to match ${h2}`);
  }, toBeGreaterThan(h2) {
    s2(i > h2, `Expected ${i} to be greater than ${h2}`);
  }, toBeLessThan(h2) {
    s2(i < h2, `Expected ${i} to be less than ${h2}`);
  }, toBeInstanceOf(h2) {
    s2(i instanceof h2, `Expected value to be instance of ${h2.name}`);
  }, get not() {
    return i4(i, !l4);
  } };
}
function l4(i) {
  return i4(i);
}
function xi(i) {
  return new Promise((l6) => setTimeout(l6, i));
}
function ni(i, l6, s2 = 1000) {
  return new Promise((o, h2) => {
    let r2 = Date.now(), y2 = () => {
      let e2 = i.querySelector(l6);
      if (e2) {
        o(e2);
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
function ti(i, l6, s2) {
  return Promise.race([i, new Promise((o, h2) => setTimeout(() => h2(Error(`Test "${s2}" timed out after ${l6}ms`)), l6))]);
}
function s4(i, l6 = yi) {
  let s2 = "", o = [];
  return { pending: o, expect: l4, test(h2, r2) {
    let y2 = s2 ? `${s2} > ${h2}` : h2;
    try {
      let e2 = r2();
      if (e2 instanceof Promise) {
        let x3 = ti(e2, l6, y2).then(() => {
          i.push({ name: y2, passed: true });
        }).catch((n) => {
          i.push({ name: y2, passed: false, error: n.message });
        });
        o.push(x3);
      } else
        i.push({ name: y2, passed: true });
    } catch (e2) {
      i.push({ name: y2, passed: false, error: e2.message });
    }
  }, describe(h2, r2) {
    let y2 = s2;
    s2 = s2 ? `${s2} > ${h2}` : h2, r2(), s2 = y2;
  } };
}
async function X22(i, l6, s2, o) {
  let h2 = [], r2 = s4(h2), y2 = { preview: l6, ...s2, expect: r2.expect, test: r2.test, describe: r2.describe, waitMs: xi, waitFor: (e2, x3) => ni(l6, e2, x3) };
  try {
    let e2 = C1(i, Object.keys(s2)), x3 = o(e2, { transforms: ["typescript"] }).code, n = Object.keys(y2).map((C3) => C3.replace(/-/g, "")), p3 = Object.values(y2);
    await new U1(...n, x3)(...p3);
  } catch (e2) {
    h2.push({ name: "Test execution", passed: false, error: e2.message });
  }
  if (r2.pending.length > 0)
    await Promise.all(r2.pending);
  return { passed: h2.filter((e2) => e2.passed).length, failed: h2.filter((e2) => !e2.passed).length, tests: h2 };
}
var { div: j1, xinSlot: fi, style: Ci, button: a1, pre: o4, span: h4 } = T;
var K22 = "tosijs-ui-tests-enabled";
var ai = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
function gi() {
  if (typeof localStorage > "u")
    return false;
  let i = localStorage.getItem(K22);
  if (i !== null)
    return i === "true";
  return ai;
}
var { testManager: Y } = Zn({ testManager: { enabled: gi() } });
function l22() {
  document.body.classList.toggle("tests-enabled", Y.enabled.value), document.body.style.setProperty("--tests-enabled", Y.enabled.value ? "1" : "0");
}
if (typeof document < "u")
  if (document.body)
    l22();
  else
    document.addEventListener("DOMContentLoaded", l22);
function y4() {
  localStorage.setItem(K22, "true"), Y.enabled.value = true, l22(), document.querySelectorAll("tosi-example").forEach((i) => {
    i.refresh();
  });
}
function e4() {
  localStorage.setItem(K22, "false"), Y.enabled.value = false, l22();
}

class g1 extends R {
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
  static insertExamples(i, l6 = {}) {
    U22(i, l6, Y2, g1.tagName);
  }
  get activeTab() {
    let { editors: i } = this.parts;
    return [...i.children].find((l6) => l6.getAttribute("hidden") === null);
  }
  get hydrated() {
    try {
      return this.parts.js !== undefined;
    } catch {
      return false;
    }
  }
  getEditorValue(i) {
    if (!this.hydrated)
      return this.pendingValues[i] ?? "";
    return this.parts[i].value;
  }
  setEditorValue(i, l6) {
    if (!this.hydrated) {
      this.pendingValues[i] = l6;
      return;
    }
    let s2 = this.parts[i];
    s2.value = l6;
  }
  flushPendingValues() {
    for (let [i, l6] of Object.entries(this.pendingValues)) {
      let s2 = this.parts[i];
      if (s2)
        s2.value = l6;
    }
    if (this.pendingValues = {}, this.pendingShowDefaultTab)
      this.pendingShowDefaultTab = false, this.showDefaultTab();
  }
  get css() {
    return this.getEditorValue("css");
  }
  set css(i) {
    this.setEditorValue("css", i);
  }
  get html() {
    return this.getEditorValue("html");
  }
  set html(i) {
    this.setEditorValue("html", i);
  }
  get js() {
    return this.getEditorValue("js");
  }
  set js(i) {
    this.setEditorValue("js", i);
  }
  get test() {
    return this.getEditorValue("test");
  }
  set test(i) {
    this.setEditorValue("test", i);
  }
  get remoteKey() {
    return u0(this.prefix, this.uuid, this.remoteId);
  }
  updateUndo = () => {
    let { activeTab: i } = this, { undo: l6, redo: s2 } = this.parts;
    if (i instanceof M1 && i.editor !== undefined) {
      let o = i.editor.session.getUndoManager();
      l6.disabled = !o.hasUndo(), s2.disabled = !o.hasRedo();
    } else
      l6.disabled = true, s2.disabled = true;
    this.updateTestResultsVisibility();
  };
  updateTestResultsVisibility() {
    let { testResults: i } = this.parts, l6 = this.testResults, s2 = this.activeTab?.getAttribute("name") === "test", o = l6 && l6.failed > 0;
    i.hidden = !l6 || l6.tests.length === 0 || !s2 && !o;
  }
  undo = () => {
    let { activeTab: i } = this;
    if (i instanceof M1)
      i.editor.undo();
  };
  redo = () => {
    let { activeTab: i } = this;
    if (i instanceof M1)
      i.editor.redo();
  };
  get isMaximized() {
    return this.classList.contains("-maximize");
  }
  flipLayout = () => {
    this.classList.toggle("-vertical");
  };
  exampleMenu = () => {
    let i = Y.enabled.value;
    J2({ target: this.parts.exampleWidgets, width: "auto", menuItems: [{ icon: "edit2", caption: "view/edit code", action: this.showCode }, { icon: "edit", caption: "view/edit code in a new window", action: this.openEditorWindow }, null, { icon: this.isMaximized ? "minimize" : "maximize", caption: this.isMaximized ? "restore preview" : "maximize preview", action: this.toggleMaximize }, null, { icon: i ? "check" : "", caption: "Run tests", action: () => {
      if (i)
        e4();
      else
        y4();
    } }] });
  };
  handleShortcuts = (i) => {
    if (i.metaKey || i.ctrlKey) {
      let l6 = false;
      switch (i.key) {
        case "s":
        case "r":
          this.refresh(), l6 = true;
          break;
        case "/":
          this.flipLayout();
          break;
        case "c":
          if (i.shiftKey)
            this.copy(), l6 = true;
          break;
      }
      if (l6)
        i.preventDefault(), i.stopPropagation();
    }
  };
  content = () => [j1({ part: "example" }, Ci({ part: "style" }), j1({ part: "testIndicator", title: "test status" }), o4({ part: "testResults", hidden: true }), a1({ title: "example menu", part: "exampleWidgets", onClick: this.exampleMenu }, t3.code())), j1({ class: "code-editors", part: "codeEditors", onKeydown: this.handleShortcuts, hidden: true }, T1({ part: "editors", onChange: this.updateUndo }, $1({ name: "js", mode: "javascript", part: "js" }), $1({ name: "html", mode: "html", part: "html" }), $1({ name: "css", mode: "css", part: "css" }), $1({ name: "test", mode: "javascript", part: "test" }), j1({ slot: "after-tabs", class: "row" }, a1({ title: "undo", part: "undo", class: "transparent", onClick: this.undo }, t3.cornerUpLeft()), a1({ title: "redo", part: "redo", class: "transparent", onClick: this.redo }, t3.cornerUpRight()), a1({ title: "flip direction (⌘/ | ^/)", class: "transparent", onClick: this.flipLayout }, t3.columns({ class: "layout-indicator" })), a1({ title: "copy as markdown (⌘⇧C | ^⇧C)", class: "transparent", onClick: this.copy }, t3.copy()), a1({ title: "reload (⌘R | ^R)", class: "transparent", onClick: this.refreshRemote }, t3.refreshCw()), a1({ title: "close code", class: "transparent", onClick: this.closeCode }, t3.x())))), fi({ part: "sources", hidden: true })];
  connectedCallback() {
    super.connectedCallback(), this.flushPendingValues();
    let { sources: i } = this.parts;
    this.initFromElements([...i.children]), this.remoteSync = new i2(this.storageKey, this.remoteKey, (s2) => {
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
    let i = this.js !== "" ? "```js\n" + this.js.trim() + "\n```\n" : "", l6 = this.html !== "" ? "```html\n" + this.html.trim() + "\n```\n" : "", s2 = this.css !== "" ? "```css\n" + this.css.trim() + "\n```\n" : "", o = this.test !== "" ? "```test\n" + this.test.trim() + "\n```\n" : "";
    navigator.clipboard.writeText(i + l6 + s2 + o);
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
    let { css: i, html: l6, js: s2, test: o } = this;
    m0(this.prefix, this.uuid, this.storageKey, this.remoteKey, { css: i, html: l6, js: s2, test: o }), this.classList.add("-maximize");
  };
  refreshRemote = () => {
    this.remoteSync?.send({ css: this.css, html: this.html, js: this.js, test: this.test });
  };
  updateSources = () => {
    if (this.persistToDom) {
      let { sources: i } = this.parts;
      i.innerText = "";
      for (let l6 of ["js", "css", "html", "test"])
        if (this[l6])
          i.append(o4({ class: `language-${l6}`, innerHTML: this[l6] }));
    }
  };
  refresh = async () => {
    if (this.remoteId !== "")
      return;
    let i = await $2(), { example: l6, style: s2, exampleWidgets: o } = this.parts, h2;
    if (this.iframe)
      h2 = await G22({ html: this.html, css: this.css, js: this.js, context: this.context, transform: i, exampleElement: l6, widgetsElement: o });
    else
      h2 = await b22({ html: this.html, css: this.css, js: this.js, context: this.context, transform: i, exampleElement: l6, styleElement: s2, widgetsElement: o });
    if (this.persistToDom)
      this.updateSources();
    if (this.test && h2 && Y.enabled.value)
      this.classList.add("-has-tests", "-test-running"), this.classList.remove("-test-passed", "-test-failed"), this.testResults = await X22(this.test, h2, this.context, i), this.classList.remove("-test-running"), this.displayTestResults();
    else
      this.classList.remove("-has-tests", "-test-running", "-test-passed", "-test-failed");
  };
  displayTestResults() {
    let { testResults: i, testIndicator: l6 } = this.parts, s2 = this.testResults;
    if (!s2 || s2.tests.length === 0) {
      i.hidden = true, this.classList.remove("-test-passed", "-test-failed"), l6.title = "no tests";
      return;
    }
    i.innerHTML = "";
    let o = j1({ style: { marginBottom: "8px", fontWeight: "bold" } }, `${s2.passed}/${s2.tests.length} tests passed`);
    i.append(o);
    for (let h2 of s2.tests) {
      let r2 = h2.passed ? "✓" : "✗", y2 = h2.passed ? "test-pass" : "test-fail", e2 = j1({ class: y2 }, h4(r2 + " "), h2.name, h2.error ? h4({ style: { opacity: "0.7" } }, ` - ${h2.error}`) : "");
      i.append(e2);
    }
    this.classList.toggle("-test-passed", s2.failed === 0), this.classList.toggle("-test-failed", s2.failed > 0), l6.title = s2.failed === 0 ? `${s2.passed} tests passed` : `${s2.failed}/${s2.tests.length} tests failed`, this.updateTestResultsVisibility(), this.dispatchEvent(new CustomEvent("testcomplete", { bubbles: true, detail: { results: s2, element: this } }));
  }
  initFromElements(i) {
    for (let l6 of i) {
      l6.hidden = true;
      let [s2, ...o] = l6.innerHTML.split(`
`);
      if (["js", "html", "css", "test"].includes(s2)) {
        let h2 = o.filter((y2) => y2.trim() !== "").map((y2) => y2.match(/^\s*/)[0].length).sort()[0], r2 = (h2 > 0 ? o.map((y2) => y2.substring(h2)) : o).join(`
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
    let { editors: i } = this.parts;
    if (this.js !== "")
      i.value = 0;
    else if (this.html !== "")
      i.value = 1;
    else if (this.css !== "")
      i.value = 2;
    else if (this.test !== "")
      i.value = 3;
  }
  render() {
    if (super.render(), this.remoteId !== "") {
      let i = localStorage.getItem(this.storageKey);
      if (i !== null) {
        let l6 = JSON.parse(i);
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
var { slot: x4 } = T;

class A1 extends R {
  static initAttributes = { minSize: 800, navSize: 200, compact: false, contentVisible: false };
  value = "normal";
  content = [x4({ name: "nav", part: "nav" }), x4({ part: "content" })];
  static styleSpec = { ":host": { display: "grid", gridTemplateColumns: `${Jn.navWidth("50%")} ${Jn.contentWidth("50%")}`, gridTemplateRows: "100%", position: "relative", margin: Jn.margin("0 0 0 -100%"), transition: Jn.sideNavTransition("0.25s ease-out") }, ":host slot": { position: "relative" }, ":host slot:not([name])": { display: "block" }, ':host slot[name="nav"]': { display: "block" } };
  onResize = () => {
    let { content: i } = this.parts, l6 = this.offsetParent;
    if (l6 === null)
      return;
    let s2 = this.value;
    if (this.compact = l6.offsetWidth < this.minSize, [...this.childNodes].find((h2) => h2 instanceof Element ? h2.getAttribute("slot") !== "nav" : true) === undefined)
      s2 = "compact/nav", this.style.setProperty("--nav-width", "100%"), this.style.setProperty("--content-width", "0%");
    else if (!this.compact)
      s2 = "normal", i.classList.add("-tosi-sidenav-visible"), this.style.setProperty("--nav-width", `${this.navSize}px`), this.style.setProperty("--content-width", `calc(100% - ${this.navSize}px)`), this.style.setProperty("--margin", "0");
    else if (i.classList.remove("-tosi-sidenav-visible"), this.style.setProperty("--nav-width", "50%"), this.style.setProperty("--content-width", "50%"), this.contentVisible)
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
var F1 = { pass: Jn.testColorPass("#0a0"), fail: Jn.testColorFail("#c00"), running: Jn.testColorRunning("#fa0") };
var _i = { "@keyframes test-pulse": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.7" } }, "@keyframes test-appear": { from: { opacity: "0", transform: "scale(0.8)" }, to: { opacity: "1", transform: "scale(1)" } }, "@keyframes test-fade": { "0%, 20%": { opacity: "1", transform: "scale(1)" }, "70%": { opacity: "1", transform: "scale(1.1)" }, "100%": { opacity: "0", transform: "scale(0.9)", pointerEvents: "none" } }, "body:not(.tests-enabled) .doc-link::after, body:not(.tests-enabled) .test-widget": { display: "none !important" }, ".doc-link.-test-passed::after, .doc-link.-test-failed::after": { content: "''", width: gn.fontSize50, height: gn.fontSize50, borderRadius: "50%", marginLeft: gn.spacing50, display: "inline-block", verticalAlign: "middle" }, ".doc-link.-test-passed::after": { background: F1.pass }, ".doc-link.-test-failed::after": { background: F1.fail, animation: "test-pulse 2s ease-in-out infinite" }, ".test-widget": { _testBg: F1.running, position: "fixed", bottom: gn.spacing, right: gn.spacing, zIndex: "1000", background: gn.testBg, color: "white", gap: gn.spacing50 }, ".test-widget[hidden]": { display: "none" }, ".test-widget.-running": { _testBg: F1.running, animation: "test-appear 0.3s ease-out, test-pulse 2s ease-in-out 0.3s infinite" }, ".test-widget.-passed": { _testBg: F1.pass, animation: "test-fade 3s ease-out forwards" }, ".test-widget.-failed": { _testBg: F1.fail, animation: "test-pulse 2s ease-in-out infinite" }, ".test-widget .count": { background: "white", color: gn.testBg, borderRadius: "50%", width: gn.lineHeight, height: gn.lineHeight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" } };
var { div: W3, slot: $i } = T;

class m2 extends R {
  static initAttributes = { rotationSnap: 0, positionSnap: 0 };
  static angleSize = 15;
  static gridSize = 8;
  static snapAngle = false;
  static snapToGrid = false;
  static styleSpec = { ":host": { "--handle-bg": "#fff4", "--handle-color": "#2228", "--handle-hover-bg": "#8ff8", "--handle-hover-color": "#222", "--handle-size": "20px", "--handle-padding": "2px" }, ":host ::slotted(*)": { position: "absolute" }, ":host > :not(style,slot)": { boxSizing: "border-box", content: '" "', position: "absolute", display: "flex", height: gn.handleSize, width: gn.handleSize, padding: gn.handlePadding, "--text-color": gn.handleColor, background: gn.handleBg }, ":host > .drag-size": { top: 0, bottom: 0, left: 0, right: 0, height: "auto", width: "auto", background: "transparent", cursor: "ew-resize" }, ':host > [part="rotate"]': { transform: `translateY(${gn.handleSize_50})` }, ":host > [locked] > svg:first-child, :host > :not([locked]) > svg+svg": { display: "none" }, ":host .icon-unlock": { opacity: 0.5 }, ":host svg": { pointerEvents: "none" }, ":host > *:hover": { "--text-color": gn.handleHoverColor, background: gn.handleHoverBg } };
  static snappedCoords(i, l6) {
    let { gridSize: s2 } = m2;
    return m2.snapToGrid || i.shiftKey ? l6.map((o) => Math.round(o / s2) * s2) : l6;
  }
  static snappedAngle(i, l6) {
    let { angleSize: s2 } = m2;
    return m2.snapAngle || i.shiftKey ? Math.round(l6 / s2) * s2 : l6;
  }
  get locked() {
    let i = this.parentElement;
    if (i.style.inset)
      return { left: true, top: true, bottom: true, right: true };
    let l6 = i.style.right.match(/\d/) !== null, s2 = !l6 || i.style.left.match(/\d/) !== null, o = i.style.bottom.match(/\d/) !== null, h2 = !o || i.style.top.match(/\d/) !== null;
    return { left: s2, top: h2, bottom: o, right: l6 };
  }
  set locked(i) {
    let { bottom: l6, right: s2 } = i, { left: o, top: h2 } = i, r2 = this.parentElement, y2 = r2.offsetLeft, e2 = r2.offsetTop, x3 = r2.offsetWidth, n = r2.offsetHeight, p3 = r2.offsetParent.offsetWidth - y2 - x3, d3 = r2.offsetParent.offsetHeight - e2 - n;
    if (Object.assign(r2.style, { left: "", right: "", top: "", bottom: "", width: "", height: "" }), !s2)
      o = true;
    if (!l6)
      h2 = true;
    if (o)
      r2.style.left = y2 + "px";
    if (s2)
      r2.style.right = p3 + "px";
    if (o && s2)
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
      r2.style.height = n + "px";
    this.queueRender();
  }
  get coords() {
    let { top: i, left: l6, right: s2, bottom: o } = this.parentElement.style;
    return { top: parseFloat(i), left: parseFloat(l6), right: parseFloat(s2), bottom: parseFloat(o) };
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
  adjustPosition = (i) => {
    let { locked: l6 } = this;
    this.locked = l6;
    let s2 = this.parentElement, { top: o, left: h2, bottom: r2, right: y2 } = this.coords;
    G3(i, (e2, x3, n) => {
      if ([e2, x3] = m2.snappedCoords(n, [e2, x3]), !isNaN(o))
        s2.style.top = o + x3 + "px";
      if (!isNaN(r2))
        s2.style.bottom = r2 - x3 + "px";
      if (!isNaN(h2))
        s2.style.left = h2 + e2 + "px";
      if (!isNaN(y2))
        s2.style.right = y2 - e2 + "px";
      if (n.type === "mouseup")
        return this.triggerChange(), true;
    });
  };
  resize = (i) => {
    let l6 = this.parentElement, { locked: s2 } = this;
    this.locked = Object.assign({ left: true, top: true, right: true, bottom: true });
    let [o, h2] = [this.right, this.bottom];
    G3(i, (r2, y2, e2) => {
      let x3 = o - r2, n = h2 - y2;
      if ([x3, n] = m2.snappedCoords(e2, [x3, n]), l6.style.right = x3 + "px", l6.style.bottom = n + "px", e2.type === "mouseup")
        return this.locked = s2, this.triggerChange(), true;
    });
  };
  adjustSize = (i) => {
    let l6 = this.parentElement, { locked: s2 } = this, o = i.target.getAttribute("part");
    this.locked = Object.assign({ left: true, right: true, top: true, bottom: true });
    let h2 = this[o];
    G3(i, (r2, y2, e2) => {
      let [x3] = m2.snappedCoords(e2, [h2 + (["left", "right"].includes(o) ? r2 : y2) * (["right", "bottom"].includes(o) ? -1 : 1)]);
      if (l6.style[o] = x3 + "px", e2.type === "mouseup")
        return this.locked = s2, this.triggerChange(), true;
    });
  };
  get rect() {
    return this.parentElement.getBoundingClientRect();
  }
  get center() {
    let i = this.parentElement.getBoundingClientRect();
    return { x: i.x + i.width * 0.5, y: i.y + i.height * 0.5 };
  }
  get element() {
    return this.parentElement;
  }
  adjustRotation = (i) => {
    let { center: l6 } = this, { transformOrigin: s2 } = this.element.style;
    if (!s2)
      this.element.style.transformOrigin = "50% 50%";
    G3(i, (o, h2, r2) => {
      let { clientX: y2, clientY: e2 } = r2, x3 = y2 - l6.x, n = e2 - l6.y, p3 = n > 0 ? 90 : -90;
      if (x3 !== 0)
        p3 = Math.atan2(n, x3) * 180 / Math.PI;
      if (p3 = m2.snappedAngle(r2, p3), p3 === 0)
        this.element.style.transformOrigin = "", this.element.style.transform = "";
      else
        this.element.style.transform = `rotate(${p3}deg)`;
      return this.triggerChange(), r2.type === "mouseup";
    });
  };
  toggleLock = (i) => {
    let { locked: l6 } = this, s2 = i.target.title.split(" ")[1];
    l6[s2] = !l6[s2], this.locked = l6, this.queueRender(), i.stopPropagation(), i.preventDefault();
  };
  content = () => [W3({ part: "move", style: { top: "50%", left: "50%", transform: "translate(-50%,-50%)" } }, t3.move()), W3({ part: "left", title: "resize left", class: "drag-size", style: { left: "-6px", width: "8px" } }), W3({ part: "right", title: "resize right", class: "drag-size", style: { left: "calc(100% - 2px)", width: "8px" } }), W3({ part: "top", title: "resize top", class: "drag-size", style: { top: "-6px", height: "8px", cursor: "ns-resize" } }), W3({ part: "bottom", title: "resize bottom", class: "drag-size", style: { top: "calc(100% - 2px)", height: "8px", cursor: "ns-resize" } }), W3({ part: "resize", style: { top: "100%", left: "100%" } }, t3.resize()), W3({ part: "rotate", style: { top: "50%", right: "0" } }, t3.refreshCw()), W3({ part: "lockLeft", title: "lock left", style: { top: "50%", left: 0, transform: "translate(-100%, -50%)" } }, t3.unlock(), t3.lock()), W3({ part: "lockRight", title: "lock right", style: { top: "50%", left: "100%", transform: "translate(0%, -50%)" } }, t3.unlock(), t3.lock()), W3({ part: "lockTop", title: "lock top", style: { top: 0, left: "50%", transform: "translate(-50%, -100%)" } }, t3.unlock(), t3.lock()), W3({ part: "lockBottom", title: "lock bottom", style: { top: "100%", left: "50%", transform: "translate(-50%, 0%)" } }, t3.unlock(), t3.lock()), $i()];
  connectedCallback() {
    super.connectedCallback();
    let { left: i, right: l6, top: s2, bottom: o, lockLeft: h2, lockRight: r2, lockTop: y2, lockBottom: e2, move: x3, resize: n, rotate: p3 } = this.parts, d3 = { passive: true };
    [i, l6, s2, o].forEach((C3) => {
      C3.addEventListener("mousedown", this.adjustSize, d3), C3.addEventListener("touchstart", this.adjustSize, d3);
    }), [h2, r2, y2, e2].forEach((C3) => {
      C3.addEventListener("click", this.toggleLock);
    }), n.addEventListener("mousedown", this.resize, d3), x3.addEventListener("mousedown", this.adjustPosition, d3), p3.addEventListener("mousedown", this.adjustRotation, d3), n.addEventListener("touchstart", this.resize, d3), x3.addEventListener("touchstart", this.adjustPosition, d3), p3.addEventListener("touchstart", this.adjustRotation, d3);
  }
  render() {
    if (super.render(), !this.parentElement)
      return;
    let { lockLeft: i, lockRight: l6, lockTop: s2, lockBottom: o } = this.parts, { left: h2, right: r2, top: y2, bottom: e2 } = this.locked;
    i.toggleAttribute("locked", h2), l6.toggleAttribute("locked", r2), s2.toggleAttribute("locked", y2), o.toggleAttribute("locked", e2);
  }
}
var y8 = m2.elementCreator({ tag: "tosi-editable" });
var { div: Qi, input: bi, button: E2, span: Gi } = T;
var t4 = (i) => i;
var c4 = "null filter, everything matches";
var f4 = { contains: { caption: "contains", negative: "does not contain", makeTest: (i) => {
  return i = i.toLocaleLowerCase(), (l6) => String(l6).toLocaleLowerCase().includes(i);
} }, hasTags: { caption: "has tags", makeTest: (i) => {
  let l6 = i.split(/[\s,]/).map((s2) => s2.trim().toLocaleLowerCase()).filter((s2) => s2 !== "");
  return (s2) => Array.isArray(s2) && l6.find((o) => !s2.includes(o)) === undefined;
} }, doesNotHaveTags: { caption: "does not have tags", makeTest: (i) => {
  let l6 = i.split(/[\s,]/).map((s2) => s2.trim().toLocaleLowerCase()).filter((s2) => s2 !== "");
  return (s2) => Array.isArray(s2) && l6.find((o) => s2.includes(o)) === undefined;
} }, equals: { caption: "=", negative: "≠", makeTest: (i) => {
  if (isNaN(Number(i)))
    return i = String(i).toLocaleLowerCase(), (s2) => String(s2).toLocaleLowerCase() === i;
  let l6 = Number(i);
  return (s2) => Number(s2) === l6;
} }, after: { caption: "is after", negative: "is before", makeTest: (i) => {
  let l6 = new Date(i);
  return (s2) => new Date(s2) > l6;
} }, greaterThan: { caption: ">", negative: "≤", makeTest: (i) => {
  if (!isNaN(Number(i))) {
    let l6 = Number(i);
    return (s2) => Number(s2) > l6;
  }
  return i = i.toLocaleLowerCase(), (l6) => String(l6).toLocaleLowerCase() > i;
} }, truthy: { caption: "is true/non-empty/non-zero", negative: "is false/empty/zero", needsValue: false, makeTest: () => (i) => !!i }, isTrue: { caption: "= true", needsValue: false, makeTest: () => (i) => i === true }, isFalse: { caption: "= false", needsValue: false, makeTest: () => (i) => i === false } };
var Ui = { description: "anything", test: () => true };
function p4(i) {
  return i.options[i.selectedIndex]?.caption || "";
}

class C4 extends R {
  static initAttributes = { haystack: "*", condition: "contains", needle: "" };
  fields = [];
  filters = f4;
  content = () => [X2({ part: "haystack" }), X2({ part: "condition" }), bi({ part: "needle", type: "search" }), Gi({ part: "padding" }), E2({ part: "remove", title: "delete" }, t3.trash())];
  filter = Ui;
  get state() {
    let { haystack: i, needle: l6, condition: s2 } = this.parts;
    return { haystack: i.value, needle: l6.value, condition: s2.value };
  }
  set state(i) {
    Object.assign(this, i);
  }
  buildFilter = () => {
    let { haystack: i, condition: l6, needle: s2 } = this.parts, o = l6.value.startsWith("~"), h2 = o ? l6.value.slice(1) : l6.value, r2 = this.filters[h2];
    s2.hidden = r2.needsValue === false;
    let y2 = r2.needsValue === false ? r2.makeTest(undefined) : r2.makeTest(s2.value), e2 = i.value, x3;
    if (e2 !== "*")
      x3 = o ? (d3) => !y2(d3[e2]) : (d3) => y2(d3[e2]);
    else
      x3 = o ? (d3) => Object.values(d3).find((C3) => !y2(C3)) !== undefined : (d3) => Object.values(d3).find((C3) => y2(C3)) !== undefined;
    let n = r2.needsValue !== false ? ` "${s2.value}"` : "", p3 = `${p4(i)} ${p4(l6)}${n}`;
    this.filter = { description: p3, test: x3 }, this.parentElement?.dispatchEvent(new Event("change"));
  };
  connectedCallback() {
    super.connectedCallback();
    let { haystack: i, condition: l6, needle: s2, remove: o } = this.parts;
    i.addEventListener("change", this.buildFilter), l6.addEventListener("change", this.buildFilter), s2.addEventListener("input", this.buildFilter), i.value = this.haystack, l6.value = this.condition, s2.value = this.needle, o.addEventListener("click", () => {
      let { parentElement: h2 } = this;
      this.remove(), h2?.dispatchEvent(new Event("change"));
    });
  }
  render() {
    super.render();
    let { haystack: i, condition: l6, needle: s2 } = this.parts;
    if (i.options = [{ caption: "any field", value: "*" }, ...this.fields.map((o) => o.prop)], l6.options = Object.keys(this.filters).map((o) => {
      let h2 = this.filters[o];
      return h2.negative !== undefined ? [{ caption: h2.caption, value: o }, { caption: h2.negative, value: "~" + o }] : { caption: h2.caption, value: o };
    }).flat(), this.haystack !== "")
      i.value = this.haystack;
    if (this.condition !== "")
      l6.value = this.condition;
    if (this.needle !== "")
      s2.value = this.needle;
    this.buildFilter();
  }
}
var D2 = C4.elementCreator({ tag: "tosi-filter-part", styleSpec: { ":host": { display: "flex" }, ":host .tosi-icon:": { verticalAlign: "middle", pointerEvents: "none" }, ':host [part="haystack"], :host [part="condition"]': { flex: "1" }, ':host [part="needle"]': { flex: 2 }, ':host [hidden]+[part="padding"]': { display: "block", content: " ", flex: "1 1 auto" } } });

class a4 extends R {
  _fields = [];
  get fields() {
    return this._fields;
  }
  set fields(i) {
    this._fields = i, this.queueRender();
  }
  get state() {
    let { filterContainer: i } = this.parts;
    return [...i.children].map((l6) => l6.state);
  }
  set state(i) {
    let { fields: l6, filters: s2 } = this, { filterContainer: o } = this.parts;
    o.textContent = "";
    for (let h2 of i)
      o.append(D2({ fields: l6, filters: s2, ...h2 }));
  }
  filter = t4;
  description = c4;
  addFilter = () => {
    let { fields: i, filters: l6 } = this, { filterContainer: s2 } = this.parts;
    s2.append(D2({ fields: i, filters: l6 }));
  };
  content = () => [E2({ part: "add", title: "add filter condition", onClick: this.addFilter, class: "round" }, t3.plus()), Qi({ part: "filterContainer" }), E2({ part: "reset", title: "reset filter", onClick: this.reset }, t3.x())];
  filters = f4;
  reset = () => {
    let { fields: i, filters: l6 } = this, { filterContainer: s2 } = this.parts;
    this.description = c4, this.filter = t4, s2.textContent = "", s2.append(D2({ fields: i, filters: l6 })), this.dispatchEvent(new Event("change"));
  };
  buildFilter = () => {
    let { filterContainer: i } = this.parts;
    if (i.children.length === 0) {
      this.reset();
      return;
    }
    let l6 = [...i.children].map((o) => o.filter), s2 = l6.map((o) => o.test);
    this.description = l6.map((o) => o.description).join(", "), this.filter = (o) => o.filter((h2) => s2.find((r2) => r2(h2) === false) === undefined), this.dispatchEvent(new Event("change"));
  };
  connectedCallback() {
    super.connectedCallback();
    let { filterContainer: i } = this.parts;
    i.addEventListener("change", this.buildFilter), this.reset();
  }
  render() {
    super.render();
  }
}
var C8 = a4.elementCreator({ tag: "tosi-filter", styleSpec: { ":host": { height: "auto", display: "grid", gridTemplateColumns: "32px calc(100% - 64px) 32px", alignItems: "center" }, ':host [part="filterContainer"]': { display: "flex", flexDirection: "column", alignItems: "stretch", flex: "1 1 auto" }, ':host [part="haystack"]': { _fieldWidth: "100px" }, ':host [part="condition"]': { _fieldWidth: "60px" }, ':host [part="needle"]': { _fieldWidth: "80px" }, ':host [part="add"], :host [part="reset"]': { "--button-size": "var(--touch-size, 32px)", borderRadius: "999px", height: "var(--button-size)", lineHeight: "var(--button-size)", margin: "0", padding: "0", textAlign: "center", width: "var(--button-size)", flex: "0 0 var(--button-size)" } } });
var { form: Xi, slot: I22, xinSlot: g4, label: Ki, input: Yi, span: Ni } = T;
function n1(i, l6, s2) {
  if (s2 !== "" && s2 !== false)
    i.setAttribute(l6, s2);
  else
    i.removeAttribute(l6);
}
function Wi(i) {
  switch (i.type) {
    case "checkbox":
      return i.checked;
    case "radio": {
      let l6 = i.parentElement?.querySelector(`input[type="radio"][name="${i.name}"]:checked`);
      return l6 ? l6.value : null;
    }
    case "range":
    case "number":
      return Number(i.value);
    default:
      return Array.isArray(i.value) && i.value.length === 0 ? null : i.value;
  }
}
function k4(i, l6) {
  if (!(i instanceof HTMLElement))
    ;
  else if (i instanceof HTMLInputElement)
    switch (i.type) {
      case "checkbox":
        i.checked = l6;
        break;
      case "radio":
        i.checked = l6 === i.value;
        break;
      default:
        i.value = String(l6 || "");
    }
  else if (l6 != null || i.value != null)
    i.value = String(l6 || "");
}

class u22 extends R {
  static initAttributes = { caption: "", key: "", type: "", optional: false, pattern: "", placeholder: "", min: "", max: "", step: "", fixedPrecision: -1, prefix: "", suffix: "" };
  value = null;
  content = Ki(g4({ part: "caption" }), Ni({ part: "field" }, g4({ part: "input", name: "input" }), Yi({ part: "valueHolder" })));
  valueChanged = false;
  handleChange = () => {
    let { input: i, valueHolder: l6 } = this.parts, s2 = i.children[0] || l6;
    if (s2 !== l6)
      l6.value = s2.value;
    this.value = Wi(s2), this.valueChanged = true;
    let o = this.closest("tosi-form");
    if (o && this.key !== "")
      switch (this.type) {
        case "checkbox":
          o.fields[this.key] = s2.checked;
          break;
        case "number":
        case "range":
          if (this.fixedPrecision > -1)
            s2.value = Number(s2.value).toFixed(this.fixedPrecision), o.fields[this.key] = Number(s2.value);
          else
            o.fields[this.key] = Number(s2.value);
          break;
        default:
          o.fields[this.key] = s2.value;
      }
  };
  connectedCallback() {
    super.connectedCallback();
    let { input: i, valueHolder: l6 } = this.parts;
    l6.addEventListener("change", this.handleChange), i.addEventListener("change", this.handleChange, true);
  }
  render() {
    if (this.valueChanged) {
      this.valueChanged = false;
      return;
    }
    let { input: i, caption: l6, valueHolder: s2, field: o } = this.parts;
    if (l6.textContent?.trim() === "")
      l6.append(this.caption !== "" ? this.caption : this.key);
    if (this.type === "text") {
      i.textContent = "";
      let h2 = T.textarea({ value: this.value });
      if (this.placeholder)
        h2.setAttribute("placeholder", this.placeholder);
      i.append(h2);
    } else if (this.type === "color")
      i.textContent = "", i.append(j0({ value: this.value }));
    else if (i.children.length === 0) {
      if (n1(s2, "placeholder", this.placeholder), n1(s2, "type", this.type), n1(s2, "pattern", this.pattern), n1(s2, "min", this.min), n1(s2, "max", this.max), this.step)
        n1(s2, "step", this.step);
      else if (this.fixedPrecision > 0 && this.type === "number")
        n1(s2, "step", Math.pow(10, -this.fixedPrecision));
    }
    if (k4(s2, this.value), k4(i.children[0], this.value), this.prefix ? o.setAttribute("prefix", this.prefix) : o.removeAttribute("prefix"), this.suffix ? o.setAttribute("suffix", this.suffix) : o.removeAttribute("suffix"), s2.classList.toggle("hidden", i.children.length > 0), i.children.length > 0)
      s2.setAttribute("tabindex", "-1");
    else
      s2.removeAttribute("tabindex");
    i.style.display = i.children.length === 0 ? "none" : "", n1(s2, "required", !this.optional);
  }
}

class m22 extends R {
  context = {};
  value = {};
  get isValid() {
    return [...this.querySelectorAll("*")].filter((l6) => l6.required !== undefined).find((l6) => !l6.reportValidity()) === undefined;
  }
  static styleSpec = { ":host": { display: "flex", flexDirection: "column" }, ":host::part(header), :host::part(footer)": { display: "flex" }, ":host::part(content)": { display: "flex", flexDirection: "column", overflow: "hidden auto", height: "100%", width: "100%", position: "relative", boxSizing: "border-box" }, ":host form": { display: "flex", flex: "1 1 auto", position: "relative", overflow: "hidden" } };
  content = [I22({ part: "header", name: "header" }), Xi({ part: "form" }, I22({ part: "content" })), I22({ part: "footer", name: "footer" })];
  getField = (i) => {
    return this.querySelector(`tosi-field[key="${i}"]`);
  };
  get fields() {
    if (typeof this.value === "string")
      try {
        this.value = JSON.parse(this.value);
      } catch (s2) {
        console.log("<tosi-form> could not use its value, expects valid JSON"), this.value = {};
      }
    let { getField: i } = this, l6 = this.dispatchEvent.bind(this);
    return new Proxy(this.value, { get(s2, o) {
      return s2[o];
    }, set(s2, o, h2) {
      if (s2[o] !== h2) {
        s2[o] = h2;
        let r2 = i(o);
        if (r2)
          r2.value = h2;
        l6(new Event("change"));
      }
      return true;
    } });
  }
  set fields(i) {
    let l6 = [...this.querySelectorAll("tosi-field")];
    for (let s2 of l6)
      s2.value = i[s2.key];
  }
  submit = () => {
    this.parts.form.dispatchEvent(new Event("submit"));
  };
  handleSubmit = (i) => {
    i.preventDefault(), i.stopPropagation();
    let l6 = this.fields;
    this.submitCallback(l6, this.isValid);
  };
  submitCallback = (i, l6) => {
    console.log("override submitCallback to handle this data", { value: i, isValid: l6 });
  };
  connectedCallback() {
    super.connectedCallback();
    let { form: i } = this.parts;
    i.addEventListener("submit", this.handleSubmit), this.addEventListener("change", this.handleElementChange, true), this.initializeNamedElements();
  }
  handleElementChange = (i) => {
    let l6 = i.target, s2 = l6.getAttribute("name");
    if (s2 && "value" in l6)
      this.fields[s2] = l6.value;
  };
  initializeNamedElements() {
    let i = this.fields, l6 = this.querySelectorAll("[name], [key]");
    for (let s2 of l6) {
      let o = s2.getAttribute("name") || s2.getAttribute("key");
      if (o && i[o] !== undefined)
        s2.value = i[o];
    }
  }
}
var Ri = { ':host [part="field"]': { position: "relative", display: "flex", alignItems: "center", gap: Jn.prefixSuffixGap("8px") }, ':host [part="field"][prefix]::before': { content: "attr(prefix)" }, ':host [part="field"][suffix]::after': { content: "attr(suffix)" }, ':host [part="field"] > *, :host [part="input"] > *': { width: "100%" }, ":host textarea": { resize: "none" }, ':host input[type="checkbox"]': { width: "fit-content" }, ":host .hidden": { position: "absolute", pointerEvents: "none", opacity: 0 } };
var Di = u22.elementCreator({ tag: "tosi-field", styleSpec: Ri });
var Ei = m22.elementCreator({ tag: "tosi-form" });
var { div: Si } = T;

class q1 extends R {
  static formAssociated = true;
  static initAttributes = { coords: "65.01715565258993,25.48081004203459,12", token: "", mapStyle: "mapbox://styles/mapbox/streets-v12", name: "" };
  value = "";
  formDisabledCallback(i) {}
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
      q1.mapboxCSSAvailable = c2("https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css").catch((i) => {
        console.error("failed to load mapbox-gl.css", i);
      }), q1.mapboxAvailable = Z2("https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.js").catch((i) => {
        console.error("failed to load mapbox-gl.js", i);
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
    let { div: i } = this.parts, [l6, s2, o] = this.coords.split(",").map((h2) => Number(h2));
    this._lastCoords = this.coords, this._lastStyle = this.mapStyle, q1.mapboxAvailable.then(({ mapboxgl: h2 }) => {
      console.log("%cmapbox may complain about missing css -- don't panic!", "background: orange; color: black; padding: 0 5px;"), h2.accessToken = this.token, this._map = new h2.Map({ container: i, style: this.mapStyle, zoom: o, center: [s2, l6] }), this._map.on("render", () => this._map.resize()), this._map.on("moveend", () => {
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
var { div: S22, span: h2, button: T22 } = T;
var X1 = 86400000;
var ll = [0, 1, 2, 3, 4, 5, 6];
var sl = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var i0 = (i, l6 = 2, s2 = "0") => String(i).padStart(l6, s2);
var K1 = (i, l6, s2) => new Date(`${i}-${i0(l6)}-${i0(s2)}`);

class M4 extends R {
  static formAssociated = true;
  static initAttributes = { month: NaN, year: NaN, weekStart: 0, minDate: K1(new Date().getFullYear() - 100, 1, 1).toISOString().split("T")[0], maxDate: K1(new Date().getFullYear() + 10, 12, 31).toISOString().split("T")[0], selectable: false, multiple: false, range: false, disabled: false, readonly: false, required: false, name: "" };
  selectedDays = [];
  value = "";
  formDisabledCallback(i) {
    this.disabled = i;
  }
  formResetCallback() {
    this.value = "", this.selectedDays = [];
  }
  get endDay() {
    return 1 - this.weekStart;
  }
  get months() {
    return sl.map((i) => ({ caption: K1(2025, i, 1).toString().split(" ")[1], value: String(i) }));
  }
  get years() {
    let i = Number(this.minDate.split("-")[0]), l6 = Number(this.maxDate.split("-")[0]), s2 = [];
    for (let o = i;o <= l6; o++)
      s2.push(String(o));
    return s2;
  }
  monthChanged = (i, l6) => {};
  gotoMonth(i, l6) {
    if (this.month !== l6 || this.year !== i)
      this.month = l6, this.year = i, this.monthChanged(i, l6);
  }
  setMonth = () => {
    this.gotoMonth(Number(this.parts.year.value), Number(this.parts.month.value));
  };
  get to() {
    return this.selectedDays[1] || "";
  }
  set to(i) {
    this.selectedDays[1] = i, this.selectedDays.splice(2);
  }
  get from() {
    return this.selectedDays[0] || "";
  }
  set from(i) {
    this.selectedDays[0] = i, this.selectedDays.splice(2);
  }
  clickDate = (i) => {
    let l6 = i.target.getAttribute("title");
    this.selectDate(l6);
  };
  keyDate = (i) => {
    let l6 = false;
    switch (i.code) {
      case "Space": {
        let s2 = i.target.getAttribute("title");
        this.selectDate(s2), l6 = true;
        break;
      }
      case "Tab":
        break;
      default:
        console.log(i);
    }
    if (l6)
      i.preventDefault(), i.stopPropagation();
  };
  #i = "";
  selectDate = (i) => {
    if (this.#i = i, this.range) {
      if (!this.to)
        this.selectedDays = [i, i];
      else if (this.from === i && this.to === i)
        this.selectedDays = [];
      else if (this.from === i)
        this.from = this.to;
      else if (this.to === i)
        this.to = this.from;
      else if (i < this.from)
        this.from = i;
      else if (i > this.to)
        this.to = i;
      else
        this.to = i;
      this.value = `${this.from},${this.to}`;
    } else if (this.multiple) {
      if (this.selectedDays.includes(i))
        this.selectedDays.splice(this.selectedDays.indexOf(i), 1);
      else
        this.selectedDays.push(i), this.selectedDays.sort();
      this.value = this.selectedDays.join(",");
    } else if (this.selectable)
      if (this.selectedDays.includes(i))
        this.value = "", this.selectedDays = [];
      else
        this.value = i, this.selectedDays = [i];
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
  checkDay = (i) => {
    if (!this.range)
      return this.selectedDays.includes(i);
    else if (this.range)
      return this.from && i >= this.from && i <= this.to;
    return false;
  };
  dateMenuItem = (i, l6 = "") => {
    return i = i.split("T")[0], { caption: l6 || i, enabled: () => !i.startsWith(`${this.year}-${i0(this.month)}-`), action: () => {
      this.gotoDate(i);
    } };
  };
  jumpMenu = () => {
    J2({ target: this.parts.jump, menuItems: [this.dateMenuItem(new Date().toISOString(), "This Month"), ...this.selectedDays.length === 0 ? [] : [null], ...this.selectedDays.map((i) => this.dateMenuItem(i))] });
  };
  content = () => [S22({ part: "header" }, T22({ part: "previous", onClick: this.previousMonth }, t3.chevronLeft()), h2({ style: { flex: "1" } }), T22({ part: "jump", onClick: this.jumpMenu }, t3.calendar()), X2({ part: "month", options: this.months, onChange: this.setMonth }), X2({ part: "year", options: [this.year], onChange: this.setMonth }), h2({ style: { flex: "1" } }), T22({ part: "next", onClick: this.nextMonth }, t3.chevronRight())), S22({ part: "week" }), S22({ part: "days" })];
  gotoDate(i) {
    let l6 = new Date(i);
    this.gotoMonth(l6.getFullYear(), l6.getMonth() + 1);
  }
  connectedCallback() {
    super.connectedCallback();
    let i = new Date(this.value.split(",").pop() || Date.now());
    if (isNaN(this.month))
      this.month = i.getMonth() + 1;
    if (isNaN(this.year))
      this.year = i.getFullYear();
  }
  days = [];
  render() {
    super.render();
    let { week: i, days: l6, jump: s2, month: o, year: h3, previous: r2, next: y2 } = this.parts;
    this.selectedDays = this.value ? this.value.split(",") : [];
    let e2 = K1(this.year, this.month, 1), x3 = new Date(e2.valueOf() - (7 + e2.getDay() - this.weekStart) % 7 * X1), n = this.month === 12 ? 1 : this.month + 1, p3 = new Date(K1(this.year + (this.month === 12 ? 1 : 0), n, 1).valueOf() - X1), d3 = new Date(p3.valueOf() + (this.weekStart * 2 + 5 + this.endDay - p3.getDay()) % 7 * X1), C3 = ll.map((H) => new Date(x3.valueOf() + H * X1).toString().split(" ")[0]);
    this.days = [];
    let k3 = new Date().toISOString().split("T")[0];
    for (let H = x3.valueOf();H <= d3.valueOf(); H += X1) {
      let F3 = new Date(H), P3 = F3.toISOString().split("T")[0];
      this.days.push({ date: F3, selected: false, inMonth: F3.getMonth() + 1 === this.month, isToday: P3 === k3, isWeekend: F3.getDay() % 6 === 0, inRange: !!(this.from && P3 >= this.from && P3 <= this.to) });
    }
    o.value = String(this.month), h3.value = String(this.year), o.disabled = h3.disabled = s2.disabled = r2.disabled = y2.disabled = this.disabled || this.readonly, h3.options = this.years, i.textContent = "", i.append(...C3.map((H) => h2({ class: "day" }, H))), l6.textContent = "";
    let w3 = null, { to: O3, from: R2 } = this;
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
        if (O3 === P3)
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
var X8 = M4.elementCreator({ tag: "tosi-month", styleSpec: { ":host": { display: "block" }, ":host [part=header]": { display: "flex", alignItems: "stretch", justifyContent: "stretch" }, ":host[disabled]": { pointerEvents: "none", opacity: Jn.disabledOpacity(0.6) }, ':host [part="month"], :host [part="year"]': { _fieldWidth: "4em", flex: "1" }, ":host [part=week], :host [part=days]": { display: "grid", gridTemplateColumns: "auto auto auto auto auto auto auto", justifyItems: "stretch" }, ":host .today": { background: Jn.monthTodayBackground("transparent"), boxShadow: Jn.monthTodayShadow("none"), backdropFilter: Jn.monthTodayBackdropFilter("brightness(0.9)"), fontWeight: Jn.monthTodayFontWeight("800") }, ":host .day, :host .date": { padding: 5, display: "flex", justifyContent: "center", userSelect: "none" }, ":host .day": { color: Jn.monthDayColor("hotpink"), background: Jn.monthDayBackground("white"), fontWeight: Jn.monthDayFontWeight("800") }, ":host .date": { cursor: "default" }, ":host .weekend": { background: Jn.monthWeekendBackground("#eee") }, ":host .date:not(.in-month)": { opacity: 0.5 }, ":host .date.checked": { color: Jn.monthDateCheckedColor("white"), background: Jn.monthDateCheckedBackground("hotpink") }, ":host:not([range]) .date.checked": { borderRadius: Jn.monthDateCheckedBorderRadius("10px") }, ":host .range-start": { borderTopLeftRadius: Jn.monthDateCheckedBorderRadius("10px"), borderBottomLeftRadius: Jn.monthDateCheckedBorderRadius("10px") }, ":host .range-end": { borderTopRightRadius: Jn.monthDateCheckedBorderRadius("10px"), borderBottomRightRadius: Jn.monthDateCheckedBorderRadius("10px") } } });
var { div: l0, button: hl } = T;
var rl = { error: "red", warn: "orange", info: "royalblue", log: "gray", success: "green", progress: "royalblue" };

class k1 extends R {
  static singleton;
  static styleSpec = { ":host": { _notificationSpacing: 8, _notificationWidth: 360, _notificationPadding: `${gn.notificationSpacing} ${gn.notificationSpacing50} ${gn.notificationSpacing} ${gn.notificationSpacing200}`, _notificationBg: "#fafafa", _notificationAccentColor: "#aaa", _notificationTextColor: "#444", _notificationIconSize: gn.notificationSpacing300, _notificationButtonSize: 48, _notificationBorderWidth: "3px 0 0", _notificationBorderRadius: gn.notificationSpacing50, position: "fixed", left: 0, right: 0, bottom: 0, paddingBottom: gn.notificationSpacing, width: gn.notificationWidth, display: "flex", flexDirection: "column-reverse", margin: "0 auto", gap: gn.notificationSpacing, maxHeight: "50vh", overflow: "hidden auto", boxShadow: "none !important" }, ":host *": { color: gn.notificationTextColor }, ":host .note": { display: "grid", background: gn.notificationBg, padding: gn.notificationPadding, gridTemplateColumns: `${gn.notificationIconSize} 1fr ${gn.notificationButtonSize}`, gap: gn.notificationSpacing, alignItems: "center", borderRadius: gn.notificationBorderRadius, boxShadow: `0 2px 8px #0006, inset 0 0 0 2px ${gn.notificationAccentColor}`, borderColor: gn.notificationAccentColor, borderWidth: gn.notificationBorderWidth, borderStyle: "solid", transition: "0.5s ease-in", transitionProperty: "margin, opacity", zIndex: 1 }, ":host .note .icon": { stroke: gn.notificationAccentColor }, ":host .note button": { display: "flex", lineHeight: gn.notificationButtonSize, padding: 0, margin: 0, height: gn.notificationButtonSize, width: gn.notificationButtonSize, background: "transparent", alignItems: "center", justifyContent: "center", boxShadow: "none", border: "none", position: "relative" }, ":host .note button:hover svg": { stroke: gn.notificationAccentColor }, ":host .note button:active svg": { borderRadius: 99, stroke: gn.notificationBg, background: gn.notificationAccentColor, padding: gn.spacing50 }, ":host .note svg": { height: gn.notificationIconSize, width: gn.notificationIconSize, pointerEvents: "none" }, ":host .message": { display: "flex", flexDirection: "column", alignItems: "center", gap: gn.notificationSpacing }, ":host .note.closing": { opacity: 0, zIndex: 0 } };
  static removeNote(i) {
    i.classList.add("closing"), i.style.marginBottom = -i.offsetHeight + "px";
    let l6 = () => {
      i.remove();
    };
    i.addEventListener("transitionend", l6), setTimeout(l6, 1000);
  }
  static post(i) {
    let { message: l6, duration: s2, type: o, close: h3, progress: r2, icon: y2, color: e2 } = Object.assign({ type: "info", duration: -1 }, typeof i === "string" ? { message: i } : i);
    if (!this.singleton)
      this.singleton = z4();
    let x3 = this.singleton;
    document.body.append(x3), x3.style.zIndex = String(B1() + 1);
    let n = e2 || rl[o], p3 = r2 || o === "progress" ? T.progress() : {}, d3 = () => {
      if (h3)
        h3();
      k1.removeNote(w3);
    }, C3 = y2 instanceof SVGElement ? y2 : y2 ? t3[y2]({ class: "icon" }) : t3.info({ class: "icon" }), k3 = o === "error" || o === "warn", w3 = l0({ class: `note ${o}`, role: k3 ? "alert" : "status", ariaLive: k3 ? "assertive" : "polite", style: { _notificationAccentColor: n } }, C3, l0({ class: "message" }, l0(l6), p3), hl({ class: "close", title: "close", ariaLabel: "Close notification", apply(O3) {
      O3.addEventListener("click", d3);
    } }, t3.x()));
    if (x3.shadowRoot.append(w3), p3 instanceof HTMLProgressElement && r2 instanceof Function) {
      p3.setAttribute("max", String(100)), p3.value = r2();
      let O3 = setInterval(() => {
        if (!x3.shadowRoot.contains(w3)) {
          clearInterval(O3);
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
var xl = async (i, l6 = "SHA-1") => {
  let o = new TextEncoder().encode(i), h3 = await crypto.subtle.digest(l6, o);
  return Array.from(new Uint8Array(h3)).map((e2) => e2.toString(16).padStart(2, "0")).join("");
};
var nl = async (i) => {
  let l6 = await xl(i), s2 = await fetch(`https://weakpass.com/api/v1/search/${l6}`);
  if (s2.ok) {
    let o = await s2.json();
    console.log("password found in weakpass database", o);
  }
  return s2.status !== 404;
};
var { span: s0, xinSlot: tl } = T;

class o0 extends R {
  static initAttributes = { minLength: 8, goodLength: 12, indicatorColors: "#f00,#f40,#f80,#ef0,#8f0,#0a2" };
  descriptionColors = "#000,#000,#000,#000,#000,#fff";
  issues = { tooShort: true, short: true, noUpper: true, noLower: true, noNumber: true, noSpecial: true };
  issueDescriptions = { tooShort: "too short", short: "short", noUpper: "no upper case", noLower: "no lower case", noNumber: "no digits", noSpecial: "no unusual characters" };
  value = 0;
  strengthDescriptions = ["unacceptable", "very weak", "weak", "moderate", "strong", "very strong"];
  strength(i) {
    return this.issues = { tooShort: i.length < this.minLength, short: i.length < this.goodLength, noUpper: !i.match(/[A-Z]/), noLower: !i.match(/[a-z]/), noNumber: !i.match(/[0-9]/), noSpecial: !i.match(/[^a-zA-Z0-9]/) }, this.issues.tooShort ? 0 : Object.values(this.issues).filter((l6) => !l6).length - 1;
  }
  async isBreached() {
    let i = this.querySelector("input")?.value;
    if (!i || typeof i !== "string")
      return true;
    return await nl(i);
  }
  updateIndicator = (i) => {
    let { level: l6, description: s2 } = this.parts, o = this.indicatorColors.split(","), h3 = this.descriptionColors.split(","), r2 = this.strength(i);
    if (this.value !== r2)
      this.value = r2, this.dispatchEvent(new Event("change"));
    l6.style.width = `${(r2 + 1) * 16.67}%`, this.style.setProperty("--indicator-color", o[r2]), this.style.setProperty("--description-color", h3[r2]), s2.textContent = this.strengthDescriptions[r2];
  };
  update = (i) => {
    let l6 = i.target.closest("input");
    this.updateIndicator(l6?.value || "");
  };
  content = () => [tl({ onInput: this.update }), s0({ part: "meter" }, s0({ part: "level" }), s0({ part: "description" }))];
  render() {
    super.render();
    let i = this.querySelector("input");
    this.updateIndicator(i?.value);
  }
}
var cl = o0.elementCreator({ tag: "tosi-password-strength", styleSpec: { ":host": { display: "inline-flex", flexDirection: "column", gap: gn.spacing50, position: "relative" }, ":host xin-slot": { display: "flex" }, ':host [part="meter"]': { display: "block", position: "relative", height: Jn.meterHeight("24px"), background: Jn.indicatorBg("white"), borderRadius: Jn.meterRadius("4px"), boxShadow: Jn.meterShadow(`inset 0 0 0 2px ${gn.indicatorColor}`) }, ':host [part="level"]': { height: Jn.levelHeight("20px"), content: '" "', display: "inline-block", width: 0, transition: "0.15s ease-out", background: gn.indicatorColor, margin: Jn.levelMargin("2px"), borderRadius: Jn.levelRadius("2px") }, ':host [part="description"]': { position: "absolute", inset: "0", color: gn.descriptionColor, height: Jn.meterHeight("24px"), lineHeight: Jn.meterHeight("24px"), textAlign: "center" } } });
var { span: h0 } = T;

class r0 extends R {
  static formAssociated = true;
  static initAttributes = { max: 5, min: 1, icon: "star", step: 1, ratingStroke: "#e81", ratingFill: "#f91", emptyStroke: "none", emptyFill: "#ccc", readonly: false, iconSize: 24, hollow: false, required: false, name: "" };
  value = "";
  formDisabledCallback(i) {
    this.readonly = i;
  }
  formResetCallback() {
    this.value = "";
  }
  static styleSpec = { ":host": { display: "inline-block", position: "relative", width: "fit-content" }, ":host::part(container)": { position: "relative", display: "inline-block" }, ":host::part(empty), :host::part(filled)": { height: "100%", whiteSpace: "nowrap", overflow: "hidden" }, ":host::part(empty)": { pointerEvents: "none" }, ":host::part(filled)": { position: "absolute", left: 0, transition: "width 0.15s ease-out" }, ":host svg": { transform: "scale(0.9)", pointerEvents: "all !important", transition: "0.25s ease-in-out" }, ":host svg:hover": { transform: "scale(1)" }, ":host svg:active": { transform: "scale(1.1)" } };
  content = () => h0({ part: "container" }, h0({ part: "empty" }), h0({ part: "filled" }));
  displayValue(i) {
    let { empty: l6, filled: s2 } = this.parts, h3 = Math.round((typeof i === "string" ? 0 : i || 0) / this.step) * this.step;
    s2.style.width = h3 / this.max * l6.offsetWidth + "px";
  }
  update = (i) => {
    if (this.readonly)
      return;
    let { empty: l6 } = this.parts, s2 = i instanceof MouseEvent ? i.pageX - l6.getBoundingClientRect().x : 0, o = Math.min(Math.max(this.min, Math.round(s2 / l6.offsetWidth * this.max / this.step + this.step * 0.5) * this.step), this.max);
    if (i.type === "click")
      this.value = o;
    else if (i.type === "mousemove")
      this.displayValue(o);
    else
      this.displayValue(this.value || 0);
  };
  handleKey = (i) => {
    let l6 = this.value === "" ? NaN : Number(this.value);
    if (isNaN(l6))
      l6 = Math.round((this.min + this.max) * 0.5 * this.step) * this.step;
    let s2 = false;
    switch (i.key) {
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
      i.stopPropagation(), i.preventDefault();
  };
  connectedCallback() {
    super.connectedCallback();
    let { container: i } = this.parts;
    i.tabIndex = 0, i.addEventListener("mousemove", this.update, true), i.addEventListener("mouseleave", this.update), i.addEventListener("blur", this.update), i.addEventListener("click", this.update), i.addEventListener("keydown", this.handleKey);
  }
  _renderedIcon = "";
  render() {
    super.render();
    let i = this.iconSize + "px";
    if (this.style.setProperty("--tosi-icon-size", i), this.readonly)
      this.role = "image";
    else
      this.role = "slider";
    this.ariaLabel = `rating ${this.value} out of ${this.max}`, this.ariaValueMax = String(this.max), this.ariaValueMin = String(this.min), this.ariaValueNow = this.value === "" ? String(-1) : String(this.value);
    let { empty: l6, filled: s2 } = this.parts;
    if (l6.classList.toggle("hollow", this.hollow), l6.style.setProperty("--tosi-icon-fill", this.emptyFill), l6.style.setProperty("--tosi-icon-stroke", this.emptyStroke), s2.style.setProperty("--tosi-icon-fill", this.ratingFill), s2.style.setProperty("--tosi-icon-stroke", this.ratingStroke), this._renderedIcon !== this.icon) {
      this._renderedIcon = this.icon;
      for (let o = 0;o < this.max; o++)
        l6.append(t3[this.icon]()), s2.append(t3[this.icon]());
    }
    this.displayValue(this.value);
  }
}
var Cl = r0.elementCreator({ tag: "tosi-rating" });
var rs = On((...i) => Cl(...i), "xinRating is deprecated, use tosiRating instead (tag is now <tosi-rating>)");
var { xinSlot: H4, div: wl, button: vl, span: j4 } = T;
var Ml = [{ caption: "Title", tagType: "H1" }, { caption: "Heading", tagType: "H2" }, { caption: "Subheading", tagType: "H3" }, { caption: "Minor heading", tagType: "H4" }, { caption: "Body", tagType: "P" }, { caption: "Code Block", tagType: "PRE" }];
function A4(i = Ml) {
  return X2({ title: "paragraph style", slot: "toolbar", class: "block-style", options: i.map(({ caption: l6, tagType: s2 }) => ({ caption: l6, value: `formatBlock,${s2}` })) });
}
function Y1(i = "10px") {
  return j4({ slot: "toolbar", style: { flex: `0 0 ${i}`, content: " " } });
}
function S3(i, l6, s2) {
  return vl({ slot: "toolbar", dataCommand: l6, title: i }, s2);
}
var Bl = () => [S3("left-justify", "justifyLeft", t3.alignLeft()), S3("center", "justifyCenter", t3.alignCenter()), S3("right-justify", "justifyRight", t3.alignRight()), Y1(), S3("bullet list", "insertUnorderedList", t3.listBullet()), S3("numbered list", "insertOrderedList", t3.listNumber()), Y1(), S3("indent", "indent", t3.indent()), S3("indent", "outdent", t3.outdent())];
var F4 = () => [S3("bold", "bold", t3.fontBold()), S3("italic", "italic", t3.fontItalic()), S3("underline", "underline", t3.fontUnderline())];
var zl = () => [A4(), Y1(), ...F4()];
var Hl = () => [A4(), Y1(), ...Bl(), Y1(), ...F4()];

class y0 extends R {
  static formAssociated = true;
  static initAttributes = { widgets: "default", name: "", required: false };
  isInitialized = false;
  savedValue = "";
  formDisabledCallback(i) {
    if (this.isInitialized)
      this.parts.doc.contentEditable = i ? "false" : "true";
  }
  formResetCallback() {
    this.value = "";
  }
  _value = "";
  get value() {
    return this.isInitialized ? this.parts.doc.innerHTML : this._value;
  }
  set value(i) {
    let l6 = this._value;
    if (this._value = i, this.isInitialized) {
      if (this.parts.doc.innerHTML !== i)
        this.parts.doc.innerHTML = i;
    }
    if (l6 !== i && this.internals)
      this.internals.setFormValue(i);
  }
  blockElement(i) {
    let { doc: l6 } = this.parts;
    while (i.parentElement !== null && i.parentElement !== l6)
      i = i.parentElement;
    return i.parentElement === l6 ? i : undefined;
  }
  get selectedBlocks() {
    let { doc: i } = this.parts, l6 = window.getSelection();
    if (l6 === null)
      return [];
    let s2 = [];
    for (let o = 0;o < l6.rangeCount; o++) {
      let h3 = l6.getRangeAt(o);
      if (!i.contains(h3.commonAncestorContainer))
        continue;
      let r2 = this.blockElement(h3.startContainer), y2 = this.blockElement(h3.endContainer);
      s2.push(r2);
      while (r2 !== y2 && r2 !== null)
        r2 = r2.nextElementSibling, s2.push(r2);
    }
    return s2;
  }
  get selectedText() {
    let i = window.getSelection();
    if (i === null)
      return "";
    return this.selectedBlocks.length ? i.toString() : "";
  }
  selectionChange = () => {};
  _updatingBlockStyle = false;
  handleSelectChange = (i) => {
    if (this._updatingBlockStyle)
      return;
    let s2 = i.target?.closest(T3.tagName);
    if (s2 == null)
      return;
    this.doCommand(s2.value);
  };
  handleButtonClick = (i) => {
    let s2 = i.target?.closest("button");
    if (s2 == null)
      return;
    this.doCommand(s2.dataset.command);
  };
  content = [H4({ name: "toolbar", part: "toolbar", onClick: this.handleButtonClick, onChange: this.handleSelectChange }), wl({ part: "doc", contenteditable: true, style: { flex: "1 1 auto", outline: "none" } }), H4({ part: "content" })];
  doCommand(i) {
    if (i === undefined)
      return;
    let l6 = i.split(",");
    console.log("execCommand", l6[0], false, ...l6.slice(1)), document.execCommand(l6[0], false, ...l6.slice(1));
  }
  updateBlockStyle() {
    let i = this.parts.toolbar.querySelector(".block-style");
    if (i === null)
      return;
    let l6 = this.selectedBlocks.map((s2) => s2.tagName);
    l6 = [...new Set(l6)], this._updatingBlockStyle = true, i.value = l6.length === 1 ? `formatBlock,${l6[0]}` : "", this._updatingBlockStyle = false;
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
    let { doc: i, content: l6 } = this.parts;
    if (l6.innerHTML !== "" && i.innerHTML === "")
      i.innerHTML = l6.innerHTML, l6.innerHTML = "";
    this.isInitialized = true, l6.style.display = "none", i.addEventListener("input", this.handleInput), this.updateValidity(), document.addEventListener("selectionchange", (s2) => {
      this.updateBlockStyle(), this.selectionChange(s2, this);
    });
  }
  render() {
    let { toolbar: i } = this.parts;
    if (super.render(), i.children.length === 0)
      switch (this.widgets) {
        case "minimal":
          i.append(...zl());
          break;
        case "default":
          i.append(...Hl());
          break;
      }
  }
}
var jl = y0.elementCreator({ tag: "tosi-rich-text", styleSpec: { ":host": { display: "flex", flexDirection: "column", height: "100%" }, ':host [part="toolbar"]': { padding: 4, display: "flex", gap: "0px", flex: "0 0 auto", flexWrap: "wrap" }, ':host [part="toolbar"] > button': { _xinIconSize: 18 } } });
var fs = On((...i) => jl(...i), "richText is deprecated, use tosiRichText instead (tag is now <tosi-rich-text>)");
var { div: Vl, slot: Ll, label: _l, span: Ol, input: q4 } = T;

class N1 extends R {
  static formAssociated = true;
  static initAttributes = { direction: "row", other: "", multiple: false, name: "", placeholder: "Please specify…", localized: false, required: false };
  _choices = [];
  get choices() {
    return this._choices;
  }
  set choices(i) {
    if (typeof i === "string")
      this._choices = N1.parseChoicesString(i);
    else
      this._choices = i;
    this.queueRender();
  }
  static parseChoicesString(i) {
    return i.split(",").filter((l6) => l6.trim() !== "").map((l6) => {
      let [s2, o] = l6.split("=").map((e2) => e2.trim()), [h3, r2] = (o || s2).split(":").map((e2) => e2.trim()), y2 = r2 ? t3[r2]() : "";
      return { value: s2, icon: y2, caption: h3 };
    });
  }
  value = "";
  formDisabledCallback(i) {}
  formResetCallback() {
    this.value = "";
  }
  get values() {
    return (this.value || "").split(",").map((i) => i.trim()).filter((i) => i !== "");
  }
  content = () => [Ll(), Vl({ part: "options" }, q4({ part: "custom", hidden: true }))];
  static styleSpec = { ":host": { display: "inline-flex", gap: Jn.segmentedOptionGap("8px"), alignItems: Jn.segmentedAlignItems("center") }, ":host, :host::part(options)": { flexDirection: Jn.segmentedDirection("row") }, ":host label": { display: "inline-grid", alignItems: "center", gap: Jn.segmentedOptionGap("8px"), gridTemplateColumns: Jn.segmentedOptionGridColumns("0px 24px 1fr"), padding: Jn.segmentedOptionPadding("4px 12px"), font: Jn.segmentedOptionFont("16px") }, ":host label:focus": { outline: "none", boxShadow: Jn.segmentedFocusShadow(`inset 0 0 0 2px ${Jn.segmentedOptionCurrentBackground("#44a")}`), borderRadius: Jn.segmentedOptionsBorderRadius("8px") }, ":host label:has(:checked)": { color: Jn.segmentedOptionCurrentColor("#eee"), background: Jn.segmentedOptionCurrentBackground("#44a") }, ":host label:has(:checked):focus": { boxShadow: Jn.segmentedCurrentFocusShadow(`inset 0 0 0 2px ${Jn.segmentedOptionCurrentColor("#eee")}`) }, ":host svg": { height: Jn.segmentOptionIconSize("16px"), stroke: Jn.segmentedOptionIconColor("currentColor") }, ":host label.no-icon": { gap: 0, gridTemplateColumns: Jn.segmentedOptionGridColumns("0px 1fr") }, ':host input[type="radio"], :host input[type="checkbox"]': { visibility: Jn.segmentedInputVisibility("hidden") }, ":host::part(options)": { display: "flex", borderRadius: Jn.segmentedOptionsBorderRadius("8px"), background: Jn.segmentedOptionsBackground("#fff"), color: Jn.segmentedOptionColor("#222"), overflow: "hidden", alignItems: Jn.segmentedOptionAlignItems("stretch") }, ":host::part(custom)": { padding: Jn.segmentedOptionPadding("4px 12px"), color: Jn.segmentedOptionCurrentColor("#eee"), background: Jn.segmentedOptionCurrentBackground("#44a"), font: Jn.segmentedOptionFont("16px"), border: "0", outline: "none" }, ":host::part(custom)::placeholder": { color: Jn.segmentedOptionCurrentColor("#eee"), opacity: Jn.segmentedPlaceholderOpacity(0.75) } };
  valueChanged = false;
  handleChange = () => {
    let { options: i, custom: l6 } = this.parts;
    if (this.multiple) {
      let s2 = [...i.querySelectorAll("input:checked")];
      this.value = s2.map((o) => o.value).join(",");
    } else {
      let s2 = i.querySelector("input:checked");
      if (!s2)
        this.value = "";
      else if (s2.value)
        l6.setAttribute("hidden", ""), this.value = s2.value;
      else
        l6.removeAttribute("hidden"), l6.focus(), l6.select(), this.value = l6.value;
    }
    this.valueChanged = true;
  };
  handleKey = (i) => {
    let l6 = false;
    switch (i.code) {
      case "Space":
        if (i.target instanceof HTMLLabelElement)
          i.target.click(), l6 = true;
        break;
      case "Tab":
        if (!(i.target instanceof HTMLLabelElement))
          i.target.closest("label").focus();
        break;
      case "ArrowLeft":
      case "ArrowUp":
        {
          let s2 = i.target.closest("label");
          if (s2.previousElementSibling instanceof HTMLLabelElement)
            s2.previousElementSibling.focus();
        }
        l6 = true;
        break;
      case "ArrowRight":
      case "ArrowDown":
        {
          let s2 = i.target.closest("label");
          if (s2.nextElementSibling instanceof HTMLLabelElement)
            s2.nextElementSibling.focus();
        }
        l6 = true;
        break;
    }
    if (l6)
      i.preventDefault(), i.stopPropagation();
  };
  connectedCallback() {
    super.connectedCallback();
    let i = this.getAttribute("choices");
    if (i && this._choices.length === 0)
      this._choices = N1.parseChoicesString(i);
    let { options: l6 } = this.parts;
    if (this.name === "")
      this.name = this.instanceId;
    if (l6.addEventListener("change", this.handleChange), l6.addEventListener("keydown", this.handleKey), this.other && this.multiple)
      console.warn(this, "is set to [other] and [multiple]; [other] will be ignored"), this.other = "";
  }
  get _choicesWithOther() {
    let i = [...this.choices];
    if (this.other && !this.multiple) {
      let [l6, s2] = this.other.split(":");
      i.push({ value: "", caption: l6, icon: s2 });
    }
    return i;
  }
  get isOtherValue() {
    return Boolean(this.value === "" || this.value && !this._choicesWithOther.find((i) => i.value === this.value));
  }
  render() {
    if (super.render(), this.valueChanged) {
      this.valueChanged = false;
      return;
    }
    let { options: i, custom: l6 } = this.parts;
    i.textContent = "";
    let s2 = this.multiple ? "checkbox" : "radio", { values: o, isOtherValue: h3 } = this;
    if (i.append(...this._choicesWithOther.map((r2) => {
      return _l({ tabindex: 0 }, q4({ type: s2, name: this.name, value: r2.value, checked: o.includes(r2.value) || r2.value === "" && h3, tabIndex: -1 }), r2.icon || { class: "no-icon" }, this.localized ? l1(r2.caption) : Ol(r2.caption));
    })), this.other && !this.multiple)
      l6.hidden = !h3, l6.value = h3 ? this.value : "", l6.placeholder = this.placeholder, i.append(l6);
  }
}
var Pl = N1.elementCreator({ tag: "tosi-segmented" });
var Ms = On((...i) => Pl(...i), "xinSegmented is deprecated, use tosiSegmented instead (tag is now <tosi-segmented>)");
var { slot: V4 } = T;

class L4 extends R {
  static initAttributes = { minWidth: 0, minHeight: 0 };
  value = "normal";
  content = [V4({ part: "normal" }), V4({ part: "small", name: "small" })];
  static styleSpec = { ":host": { display: "inline-block", position: "relative" } };
  onResize = () => {
    let { normal: i, small: l6 } = this.parts, s2 = this.offsetParent;
    if (!(s2 instanceof HTMLElement))
      return;
    else if (s2.offsetWidth < this.minWidth || s2.offsetHeight < this.minHeight)
      i.hidden = true, l6.hidden = false, this.value = "small";
    else
      i.hidden = false, l6.hidden = true, this.value = "normal";
  };
  connectedCallback() {
    super.connectedCallback(), globalThis.addEventListener("resize", this.onResize);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), globalThis.removeEventListener("resize", this.onResize);
  }
}
var js = L4.elementCreator({ tag: "tosi-sizebreak" });

class e0 extends R {
  target = null;
  static styleSpec = { ":host": { _resizeIconFill: "#222", display: "block", position: "absolute", bottom: -7, right: -7, padding: 14, width: 44, height: 44, opacity: 0.25, transition: "opacity 0.25s ease-out" }, ":host(:hover)": { opacity: 0.5 }, ":host svg": { width: 16, height: 16, stroke: gn.resizeIconFill } };
  content = t3.resize();
  get minSize() {
    let { minWidth: i, minHeight: l6 } = getComputedStyle(this.target);
    return { width: parseFloat(i) || 32, height: parseFloat(l6) || 32 };
  }
  resizeTarget = (i) => {
    let { target: l6 } = this;
    if (!l6)
      return;
    let { offsetWidth: s2, offsetHeight: o } = l6;
    l6.style.left = l6.offsetLeft + "px", l6.style.top = l6.offsetTop + "px", l6.style.bottom = "", l6.style.right = "";
    let { minSize: h3 } = this;
    G3(i, (r2, y2, e2) => {
      if (l6.style.width = Math.max(h3.width, s2 + r2) + "px", l6.style.height = Math.max(h3.height, o + y2) + "px", e2.type === "mouseup")
        return true;
    }, "nwse-resize");
  };
  connectedCallback() {
    if (super.connectedCallback(), !this.target)
      this.target = this.parentElement;
    let i = { passive: true };
    this.addEventListener("mousedown", this.resizeTarget, i), this.addEventListener("touchstart", this.resizeTarget, i);
  }
}
var Gl = e0.elementCreator({ tag: "tosi-sizer" });
var { div: Zl, input: Xl, span: Kl, button: x0 } = T;

class y2 extends R {
  static initAttributes = { caption: "", removeable: false };
  removeCallback = () => {
    this.remove();
  };
  content = () => [Kl({ part: "caption" }, this.caption), x0(t3.x(), { type: "button", part: "remove", hidden: !this.removeable, ariaLabel: `Remove ${this.caption}`, onClick: this.removeCallback })];
}
var P4 = y2.elementCreator({ tag: "tosi-tag", styleSpec: { ":host": { "--tag-close-button-color": "#000c", "--tag-close-button-bg": "#fffc", "--tag-button-opacity": "0.5", "--tag-button-hover-opacity": "0.75", "--tag-bg": Jn.brandColor("blue"), "--tag-text-color": Jn.brandTextColor("white"), display: "inline-flex", borderRadius: Jn.tagRoundedRadius(gn.spacing50), color: gn.tagTextColor, background: gn.tagBg, padding: `0 ${gn.spacing75} 0 ${gn.spacing75}`, height: `calc(${gn.lineHeight} + ${gn.spacing50})`, lineHeight: `calc(${gn.lineHeight} + ${gn.spacing50})` }, ':host > [part="caption"]': { position: "relative", whiteSpace: "nowrap", overflow: "hidden", flex: "1 1 auto", fontSize: Jn.fontSize("16px"), color: gn.tagTextColor, textOverflow: "ellipsis" }, ':host [part="remove"]': { boxShadow: "none", margin: `0 ${gn.spacing_50} 0 ${gn.spacing25}`, padding: 0, display: "inline-flex", alignItems: "center", alignSelf: "center", justifyContent: "center", height: gn.spacing150, width: gn.spacing150, color: gn.tagCloseButtonColor, background: gn.tagCloseButtonBg, borderRadius: Jn.tagCloseButtonRadius("99px"), opacity: gn.tagButtonOpacity }, ':host [part="remove"]:hover': { background: gn.tagCloseButtonBg, opacity: gn.tagButtonHoverOpacity } } });
var Zs = On((...i) => P4(...i), "xinTag is deprecated, use tosiTag instead (tag is now <tosi-tag>)");

class W1 extends R {
  static formAssociated = true;
  static initAttributes = { name: "", textEntry: false, editable: false, placeholder: "enter tags", disabled: false, required: false };
  value = "";
  get tags() {
    return this.value.split(",").map((i) => i.trim()).filter((i) => i !== "");
  }
  set tags(i) {
    this.value = i.join(",");
  }
  _availableTags = [];
  get availableTags() {
    return this._availableTags;
  }
  set availableTags(i) {
    if (typeof i === "string")
      this._availableTags = W1.parseAvailableTagsString(i);
    else
      this._availableTags = i;
    this.queueRender();
  }
  static parseAvailableTagsString(i) {
    return i.split(",").map((l6) => {
      let s2 = l6.trim();
      return s2 === "" ? null : s2;
    });
  }
  connectedCallback() {
    super.connectedCallback();
    let i = this.getAttribute("available-tags");
    if (i && this._availableTags.length === 0)
      this._availableTags = W1.parseAvailableTagsString(i);
  }
  formDisabledCallback(i) {
    this.disabled = i;
  }
  formResetCallback() {
    this.value = "";
  }
  addTag = (i) => {
    let l6 = i.trim();
    if (l6 === "" || this.tags.includes(l6))
      return;
    this.tags = [...this.tags, l6], this.queueRender(true);
  };
  toggleTag = (i) => {
    if (this.tags.includes(i))
      this.tags = this.tags.filter((l6) => l6 !== i), this.queueRender(true);
    else
      this.addTag(i);
  };
  enterTag = (i) => {
    let { tagInput: l6 } = this.parts;
    switch (i.key) {
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
        i.stopPropagation(), i.preventDefault();
        break;
      default:
    }
  };
  popSelectMenu = () => {
    let { toggleTag: i } = this, { tagMenu: l6 } = this.parts, s2 = [...this.availableTags], o = this.tags.filter((r2) => !s2.includes(r2));
    if (o.length)
      s2.push(null, ...o);
    let h3 = s2.map((r2) => {
      if (r2 === "" || r2 === null)
        return null;
      else if (typeof r2 === "object")
        return { checked: () => this.tags.includes(r2.value), caption: r2.caption, action() {
          i(r2.value);
        } };
      else
        return { checked: () => this.tags.includes(r2), caption: r2, action() {
          i(r2);
        } };
    });
    J2({ target: l6, width: "auto", menuItems: h3 });
  };
  content = () => [x0({ type: "button", style: { visibility: "hidden" }, tabindex: -1 }), Zl({ part: "tagContainer", class: "row", role: "list", ariaLabel: "Selected tags" }), Xl({ part: "tagInput", class: "elastic", ariaLabel: "Enter new tag", onKeydown: this.enterTag }), x0({ type: "button", title: "add tag", ariaLabel: "Select tags from list", ariaHaspopup: "listbox", part: "tagMenu", onClick: this.popSelectMenu }, t3.chevronDown())];
  removeTag = (i) => {
    if (this.editable && !this.disabled) {
      let l6 = i.target.closest(y2.tagName);
      this.tags = this.tags.filter((s2) => s2 !== l6.caption), l6.remove(), this.queueRender(true);
    }
    i.stopPropagation(), i.preventDefault();
  };
  render() {
    super.render();
    let { tagContainer: i, tagMenu: l6, tagInput: s2 } = this.parts;
    if (l6.disabled = this.disabled, s2.value = "", s2.setAttribute("placeholder", this.placeholder), this.editable && !this.disabled)
      l6.toggleAttribute("hidden", false), s2.toggleAttribute("hidden", !this.textEntry);
    else
      l6.toggleAttribute("hidden", true), s2.toggleAttribute("hidden", true);
    i.textContent = "";
    for (let o of this.tags)
      i.append(P4({ caption: o, removeable: this.editable && !this.disabled, removeCallback: this.removeTag }));
  }
}
var Yl = W1.elementCreator({ tag: "tosi-tag-list", styleSpec: { ":host": { "--tag-list-bg": "#f8f8f8", "--touch-size": "44px", "--spacing": "16px", display: "grid", gridTemplateColumns: "auto", alignItems: "center", background: gn.tagListBg, gap: gn.spacing25, borderRadius: Jn.taglistRoundedRadius(gn.spacing50), overflow: "hidden" }, ":host[editable]": { gridTemplateColumns: `0px auto ${gn.touchSize}` }, ":host[editable][text-entry]": { gridTemplateColumns: `0px 2fr 1fr ${gn.touchSize}` }, ':host [part="tagContainer"]': { display: "flex", content: '" "', alignItems: "center", background: gn.inputBg, borderRadius: Jn.tagContainerRadius(gn.spacing50), boxShadow: gn.borderShadow, flexWrap: "nowrap", overflow: "auto hidden", gap: gn.spacing25, minHeight: `calc(${gn.lineHeight} + ${gn.spacing})`, padding: gn.spacing25 }, ':host [part="tagMenu"]': { width: gn.touchSize, height: gn.touchSize, lineHeight: gn.touchSize, textAlign: "center", padding: 0, margin: 0 }, ":host [hidden]": { display: "none !important" }, ':host button[part="tagMenu"]': { background: gn.brandColor, color: gn.brandTextColor } } });
var Ks = On((...i) => Yl(...i), "xinTagList is deprecated, use tosiTagList instead (tag is now <tosi-tag-list>)");
var $4 = { accent: x.fromCss("#EE257B"), background: x.fromCss("#fafafa"), text: x.fromCss("#222222") };
var Dl = { _tosiSpacingXs: "4px", _tosiSpacingSm: "8px", _tosiSpacing: "12px", _tosiSpacingLg: "16px", _tosiSpacingXl: "24px", _tosiFontFamily: "system-ui, -apple-system, sans-serif", _tosiFontSize: "16px", _tosiLineHeight: "1.5", _tosiCodeFontFamily: "ui-monospace, monospace", _tosiCodeFontSize: "14px", _tosiTouchSize: "44px", _tosiBorderRadius: "4px", _tosiBorderRadiusLg: "8px", _tosiTransition: "0.15s ease-out" };
function El(i) {
  let { accent: l6, background: s2, text: o } = i, h3 = i.accentText ?? l6.contrasting(), r2 = i.backgroundInset ?? s2.darken(0.03), y3 = i.border ?? o.opacity(0.15), e2 = i.shadow ?? o.opacity(0.1), x3 = i.focus ?? l6.opacity(0.5);
  return { _tosiAccent: l6, _tosiAccentLight: l6.brighten(0.15), _tosiAccentDark: l6.darken(0.15), _tosiAccentText: h3, _tosiBg: s2, _tosiBgInset: r2, _tosiBgHover: s2.darken(0.05), _tosiBgActive: s2.darken(0.1), _tosiText: o, _tosiTextMuted: o.opacity(0.6), _tosiTextDisabled: o.opacity(0.4), _tosiBorder: y3, _tosiBorderFocus: l6, _tosiShadow: e2, _tosiShadowColor: e2, _tosiFocusRing: `0 0 0 2px ${x3}`, _tosiInputBg: s2, _tosiInputBorder: y3, _tosiInputBorderFocus: l6, _tosiButtonBg: s2, _tosiButtonText: o, _tosiButtonBorder: y3, _tosiButtonHoverBg: s2.darken(0.05), _tosiButtonActiveBg: l6, _tosiButtonActiveText: h3 };
}
function t0(i) {
  return { ":root": { ...Dl, ...El(i) } };
}
function Il(i) {
  let s2 = t0(i)[":root"];
  return { ":root": Go(s2) };
}
var Is = t0($4);
var us = Il($4);
var ul = { "--xin-icon-size": gn.tosiIconSize, "--xin-icon-fill": gn.tosiIconFill, "--xin-icon-stroke": gn.tosiIconStroke, "--xin-tabs-bar-color": gn.tosiTabsBarColor, "--xin-tabs-bar-height": gn.tosiTabsBarHeight, "--xin-tabs-selected-color": gn.tosiTabsSelectedColor, "--spacing": gn.tosiSpacing, "--gap": gn.tosiSpacingSm, "--touch-size": gn.tosiTouchSize, "--background": gn.tosiBg, "--text-color": gn.tosiText, "--brand-color": gn.tosiAccent, "--brand-text-color": gn.tosiAccentText };

// src/tosi-product.ts
var { div, span, slot } = T;
var scrollTargets = new Map;
var scrollHandlers = new Map;
function getScrollParent(el) {
  let node = el.parentElement;
  while (node) {
    if (node === document.body || node === document.documentElement) {
      break;
    }
    const { overflow, overflowX, overflowY } = getComputedStyle(node);
    if (/(auto|scroll)/.test(overflow + overflowX + overflowY)) {
      return node;
    }
    node = node.parentElement;
  }
  return window;
}
function onScroll(target) {
  requestAnimationFrame(() => {
    const sections = scrollTargets.get(target);
    if (sections) {
      for (const section of sections) {
        section.updateProgress();
      }
    }
  });
}
var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

class TosiProductSection extends R {
  scrollCallback = null;
  static initAttributes = {
    scroll: 100,
    debug: false,
    direction: "vertical"
  };
  _debugInfo = null;
  _scrollTarget = null;
  _animators = null;
  _observer = null;
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      backgroundColor: "#000",
      color: "#fff"
    },
    ":host([direction=horizontal])": {
      display: "inline-block"
    },
    ".tosi-sticky": {
      position: "sticky",
      overflow: "hidden",
      zIndex: 1,
      backgroundColor: "inherit"
    },
    ".tosi-debug": {
      position: "absolute",
      top: "10px",
      left: "10px",
      background: "rgba(0,0,0,0.8)",
      color: "#0f0",
      padding: "5px 10px",
      fontFamily: "monospace",
      fontSize: "12px",
      zIndex: 100,
      borderRadius: "4px",
      pointerEvents: "none"
    }
  };
  content = () => [
    div({ class: "tosi-sticky" }, slot(), span({ class: "tosi-debug", part: "debug-info", hidden: true }))
  ];
  _getAnimators() {
    if (this._animators === null) {
      this._animators = Array.from(this.querySelectorAll("[data-scroll-animate], [data-scroll-range]"));
    }
    return this._animators;
  }
  _invalidateAnimators() {
    this._animators = null;
  }
  connectedCallback() {
    this._scrollTarget = getScrollParent(this);
    super.connectedCallback();
    this._debugInfo = this.shadowRoot?.querySelector(".tosi-debug");
    let sections = scrollTargets.get(this._scrollTarget);
    if (!sections) {
      sections = new Set;
      scrollTargets.set(this._scrollTarget, sections);
      const target = this._scrollTarget;
      const handler = () => onScroll(target);
      scrollHandlers.set(target, handler);
      target.addEventListener("scroll", handler, { passive: true });
    }
    sections.add(this);
    this._observer = new MutationObserver(() => this._invalidateAnimators());
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-scroll-animate", "data-scroll-range"]
    });
    requestAnimationFrame(() => {
      this.render();
      this.updateProgress();
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._animators = null;
    if (this._scrollTarget) {
      const sections = scrollTargets.get(this._scrollTarget);
      if (sections) {
        sections.delete(this);
        if (sections.size === 0) {
          scrollTargets.delete(this._scrollTarget);
          const handler = scrollHandlers.get(this._scrollTarget);
          if (handler) {
            this._scrollTarget.removeEventListener("scroll", handler);
            scrollHandlers.delete(this._scrollTarget);
          }
        }
      }
    }
  }
  render() {
    super.render();
    const scrollPct = this._getScrollPct();
    const horizontal = this.getAttribute("direction") === "horizontal";
    const sticky = this.shadowRoot?.querySelector(".tosi-sticky");
    const container = this._scrollTarget instanceof HTMLElement ? this._scrollTarget : null;
    const viewW = container ? container.clientWidth + "px" : "100vw";
    const viewH = container ? container.clientHeight + "px" : "100vh";
    const scrollDim = container ? `${scrollPct / 100 * (horizontal ? container.clientWidth : container.clientHeight)}px` : `${scrollPct}${horizontal ? "vw" : "vh"}`;
    if (horizontal) {
      this.style.width = `calc(${viewW} + ${scrollDim})`;
      this.style.height = "100%";
      if (sticky) {
        sticky.style.left = "0";
        sticky.style.top = "0";
        sticky.style.width = viewW;
        sticky.style.height = "100%";
      }
    } else {
      this.style.height = `calc(${viewH} + ${scrollDim})`;
      this.style.width = "100%";
      if (sticky) {
        sticky.style.top = "0";
        sticky.style.left = "0";
        sticky.style.height = viewH;
        sticky.style.width = "100%";
      }
    }
    if (this._debugInfo) {
      this._debugInfo.hidden = this.getAttribute("debug") !== "true";
    }
  }
  _getScrollPct() {
    const raw = Number(this.getAttribute("scroll"));
    return Number.isFinite(raw) && raw > 0 ? raw : 100;
  }
  _getScrollAmountPx() {
    const scrollPct = this._getScrollPct();
    const horizontal = this.getAttribute("direction") === "horizontal";
    const container = this._scrollTarget instanceof HTMLElement ? this._scrollTarget : null;
    if (container) {
      return scrollPct / 100 * (horizontal ? container.clientWidth : container.clientHeight);
    }
    return scrollPct / 100 * (horizontal ? window.innerWidth : window.innerHeight);
  }
  updateProgress() {
    if (!this.isConnected)
      return;
    const scrollAmount = this._getScrollAmountPx();
    if (scrollAmount <= 0)
      return;
    const rect = this.getBoundingClientRect();
    const horizontal = this.getAttribute("direction") === "horizontal";
    let offset = horizontal ? rect.left : rect.top;
    if (this._scrollTarget instanceof HTMLElement) {
      const containerRect = this._scrollTarget.getBoundingClientRect();
      offset -= horizontal ? containerRect.left : containerRect.top;
    }
    const progress = Math.max(0, Math.min(1, -offset / scrollAmount));
    this.dataset.progress = progress.toFixed(3);
    if (this._debugInfo && !this._debugInfo.hidden) {
      this._debugInfo.textContent = `Section: ${progress.toFixed(3)}`;
    }
    if (reducedMotion.matches) {
      if (this.scrollCallback) {
        this.scrollCallback(progress, this);
      }
      return;
    }
    const animators = this._getAnimators();
    for (const el of animators) {
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
      } else if (el.getAttribute("data-scroll-animate") === "lottie" && el.animation && (el instanceof P1 || el.tagName.includes("LOTTIE"))) {
        el.animation.goToAndStop(localProgress * el.animation.totalFrames, true);
      } else if (el.scene && (el instanceof v0 || el.tagName.includes("3D"))) {
        if (el.scene.activeCamera && el.scene.activeCamera.alpha !== undefined) {
          el.scene.activeCamera.alpha = localProgress * Math.PI * 2;
        }
      }
    }
    if (this.scrollCallback) {
      this.scrollCallback(progress, this);
    }
  }
}

class TosiProduct extends R {
  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      background: "#000",
      color: "#fff"
    }
  };
  content = () => slot();
}

class TosiScrollMapper extends R {
  scrollCallback = null;
  static styleSpec = {
    ":host": {
      display: "block",
      width: "100%",
      height: "100%"
    }
  };
  content = () => slot();
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("data-scroll-animate")) {
      this.setAttribute("data-scroll-animate", "mapper");
    }
  }
  setScrollProgress(progress) {
    if (this.scrollCallback) {
      this.scrollCallback(progress);
    }
  }
}
var tosiProduct = TosiProduct.elementCreator({ tag: "tosi-product" });
var tosiProductSection = TosiProductSection.elementCreator({
  tag: "tosi-product-section"
});
var tosiScrollMapper = TosiScrollMapper.elementCreator({
  tag: "tosi-scroll-mapper"
});
// src/tosi-filmstrip.ts
var { canvas } = T;

class TosiFilmstrip extends R {
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
// src/tosi-interpolator.ts
var interpolateStrings = (a5, b3, t5) => {
  const numRegex = /-?\d+(?:\.\d+)?/g;
  const aNums = Array.from(a5.matchAll(numRegex));
  const bNums = Array.from(b3.matchAll(numRegex));
  if (aNums.length > 0 && aNums.length === bNums.length) {
    let result = "";
    let lastIndex = 0;
    for (let i = 0;i < aNums.length; i++) {
      const aMatch = aNums[i];
      const bMatch = bNums[i];
      result += a5.substring(lastIndex, aMatch.index);
      const n12 = parseFloat(aMatch[0]);
      const n22 = parseFloat(bMatch[0]);
      const interpolated = n12 + (n22 - n12) * t5;
      let numStr = interpolated.toFixed(4);
      if (numStr.includes(".")) {
        numStr = numStr.replace(/0+$/, "").replace(/\.$/, "");
      }
      result += numStr;
      lastIndex = aMatch.index + aMatch[0].length;
    }
    result += a5.substring(lastIndex);
    return result;
  }
  const isColor = (s2) => s2.startsWith("#") || s2.startsWith("rgb") || s2.startsWith("hsl") || ["red", "blue", "white", "black", "transparent"].includes(s2);
  if (isColor(a5) && isColor(b3)) {
    return `color-mix(in srgb, ${a5} ${Math.round((1 - t5) * 100)}%, ${b3})`;
  }
  return t5 < 0.5 ? a5 : b3;
};

class TosiInterpolator extends R {
  static styleSpec = {
    ":host": {
      display: "contents"
    }
  };
  setScrollProgress(progress) {
    const waypointsNodes = Array.from(this.querySelectorAll("tosi-waypoint"));
    if (waypointsNodes.length === 0)
      return;
    const waypoints = waypointsNodes.map((w3) => {
      const styles = {};
      const htmlEl = w3;
      for (let i = 0;i < htmlEl.style.length; i++) {
        const prop = htmlEl.style[i];
        styles[prop] = htmlEl.style.getPropertyValue(prop);
      }
      return {
        progress: Number(w3.getAttribute("progress") || 0),
        styles
      };
    }).sort((a5, b3) => a5.progress - b3.progress);
    let wp1 = waypoints[0];
    let wp2 = waypoints[waypoints.length - 1];
    let t5 = 0;
    if (progress <= wp1.progress) {
      wp2 = wp1;
      t5 = 0;
    } else if (progress >= wp2.progress) {
      wp1 = wp2;
      t5 = 1;
    } else {
      for (let i = 0;i < waypoints.length - 1; i++) {
        if (progress >= waypoints[i].progress && progress <= waypoints[i + 1].progress) {
          wp1 = waypoints[i];
          wp2 = waypoints[i + 1];
          const rawT = (progress - wp1.progress) / (wp2.progress - wp1.progress);
          const easing = this.getAttribute("easing");
          if (easing === "ease-in-out") {
            t5 = rawT < 0.5 ? 2 * rawT * rawT : -1 + (4 - 2 * rawT) * rawT;
          } else {
            t5 = rawT;
          }
          break;
        }
      }
    }
    const currentStyles = {};
    for (const prop in wp1.styles) {
      const val1 = wp1.styles[prop];
      const val2 = wp2.styles[prop] || val1;
      currentStyles[prop] = interpolateStrings(val1, val2, t5);
    }
    const targets = Array.from(this.children).filter((c) => c.tagName !== "TOSI-WAYPOINT");
    targets.forEach((target) => {
      const el = target;
      for (const prop in currentStyles) {
        el.style.setProperty(prop, currentStyles[prop]);
      }
    });
  }
}

class TosiWaypoint extends R {
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
// src/tosi-b3d-scroll.ts
var { slot: slot2 } = T;
function findScene(el) {
  let node = el.parentElement;
  while (node) {
    if ("scene" in node)
      return node;
    for (const child of Array.from(node.children)) {
      if (child !== el && "scene" in child)
        return child;
    }
    node = node.parentElement;
  }
  return null;
}
function easeInOutQuad(t5) {
  return t5 < 0.5 ? 2 * t5 * t5 : -1 + (4 - 2 * t5) * t5;
}
function interpolateWaypoints(progress, waypoints, easing) {
  if (waypoints.length === 0)
    return {};
  if (waypoints.length === 1)
    return waypoints[0];
  if (progress <= waypoints[0].progress)
    return waypoints[0];
  if (progress >= waypoints[waypoints.length - 1].progress) {
    return waypoints[waypoints.length - 1];
  }
  for (let i = 0;i < waypoints.length - 1; i++) {
    const wp1 = waypoints[i];
    const wp2 = waypoints[i + 1];
    if (progress >= wp1.progress && progress <= wp2.progress) {
      const rawT = (progress - wp1.progress) / (wp2.progress - wp1.progress);
      const t5 = easing ? easeInOutQuad(rawT) : rawT;
      const result = {};
      for (const key in wp1) {
        if (key === "progress")
          continue;
        const v1 = wp1[key] ?? 0;
        const v23 = wp2[key] ?? v1;
        result[key] = v1 + (v23 - v1) * t5;
      }
      return result;
    }
  }
  return waypoints[0];
}
function readWaypoints(host) {
  return Array.from(host.querySelectorAll("tosi-waypoint")).map((wp) => {
    const result = {
      progress: Number(wp.getAttribute("progress") || 0)
    };
    for (const attr of Array.from(wp.attributes)) {
      if (attr.name === "progress")
        continue;
      const val = Number(attr.value);
      if (Number.isFinite(val)) {
        const key = attr.name.replace(/-([a-z])/g, (_3, c) => c.toUpperCase());
        result[key] = val;
      }
    }
    return result;
  }).sort((a5, b3) => a5.progress - b3.progress);
}

class TosiScrollCamera extends R {
  static initAttributes = {
    easing: ""
  };
  static styleSpec = {
    ":host": { display: "none" }
  };
  content = () => slot2();
  setScrollProgress(progress) {
    const owner = findScene(this);
    if (!owner?.scene?.activeCamera)
      return;
    const camera = owner.scene.activeCamera;
    const waypoints = readWaypoints(this);
    if (waypoints.length === 0)
      return;
    const easing = this.getAttribute("easing") === "ease-in-out";
    const v3 = interpolateWaypoints(progress, waypoints, easing);
    if ("alpha" in v3 && camera.alpha !== undefined)
      camera.alpha = v3.alpha;
    if ("beta" in v3 && camera.beta !== undefined)
      camera.beta = v3.beta;
    if ("radius" in v3 && camera.radius !== undefined)
      camera.radius = v3.radius;
    if (camera.target && typeof camera.target.copyFromFloats === "function") {
      if ("targetX" in v3 || "targetY" in v3 || "targetZ" in v3) {
        camera.target.copyFromFloats(v3.targetX ?? camera.target.x, v3.targetY ?? camera.target.y, v3.targetZ ?? camera.target.z);
      }
    }
    if (camera.position) {
      if ("x" in v3)
        camera.position.x = v3.x;
      if ("y" in v3)
        camera.position.y = v3.y;
      if ("z" in v3)
        camera.position.z = v3.z;
    }
    if ("fov" in v3 && camera.fov !== undefined)
      camera.fov = v3.fov;
  }
}

class TosiScrollTime extends R {
  static initAttributes = {
    from: 0,
    to: 24
  };
  static styleSpec = {
    ":host": { display: "none" }
  };
  content = null;
  setScrollProgress(progress) {
    const owner = findScene(this);
    if (!owner)
      return;
    const from = Number(this.getAttribute("from")) || 0;
    const to = Number(this.getAttribute("to")) || 24;
    const time = from + (to - from) * progress;
    const skybox = owner.querySelector("tosi-b3d-skybox");
    if (skybox) {
      skybox.timeOfDay = time;
    }
  }
}

class TosiScrollAnimation extends R {
  static initAttributes = {
    name: ""
  };
  static styleSpec = {
    ":host": { display: "none" }
  };
  content = null;
  _animGroup = null;
  _started = false;
  setScrollProgress(progress) {
    const owner = findScene(this);
    if (!owner?.scene)
      return;
    const name = this.getAttribute("name") || "";
    if (!name)
      return;
    if (!this._animGroup || this._animGroup.name !== name) {
      this._animGroup = owner.scene.animationGroups?.find((g3) => g3.name === name);
      this._started = false;
    }
    if (!this._animGroup)
      return;
    if (!this._started) {
      this._animGroup.start(false, 0);
      this._started = true;
    }
    const from = this._animGroup.from ?? 0;
    const to = this._animGroup.to ?? 1;
    const frame = from + (to - from) * progress;
    this._animGroup.goToFrame(frame);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._animGroup && this._started) {
      this._animGroup.stop();
    }
    this._animGroup = null;
    this._started = false;
  }
}
var tosiScrollCamera = TosiScrollCamera.elementCreator({
  tag: "tosi-scroll-camera"
});
var tosiScrollTime = TosiScrollTime.elementCreator({
  tag: "tosi-scroll-time"
});
var tosiScrollAnimation = TosiScrollAnimation.elementCreator({
  tag: "tosi-scroll-animation"
});
// demo/index.ts
var style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: 0; background: #000; color: #fff; overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  tosi-product-section { display: block !important; width: 100% !important; position: relative !important; }
  tosi-lottie, tosi-3d, tosi-map, video, tosi-filmstrip {
    position: absolute !important;
    top: 0 !important; left: 0 !important;
    width: 100vw !important; height: 100vh !important;
    object-fit: cover !important; display: block !important;
  }
  .overlay {
    position: absolute !important; top: 0; left: 0;
    width: 100vw; height: 100vh;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; z-index: 10;
  }
  .hero-text {
    font-size: clamp(2rem, 8vw, 5rem); font-weight: 800; text-align: center;
    background: linear-gradient(to bottom, #fff, #999);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    padding: 0 20px; margin: 0;
    filter: drop-shadow(0 2px 12px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(0,0,0,0.6));
  }
  .hero { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; z-index: 10; }
  .hero h1 {
    font-size: clamp(2rem, 8vw, 6rem); font-weight: 800; text-align: center; margin: 0;
    background: linear-gradient(to bottom, #fff, #aaa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .hero p { font-size: clamp(1rem, 2.5vw, 1.5rem); text-align: center; color: #999; margin: 0.5em 0 0; max-width: 600px; padding: 0 20px; }
  .feature-text {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; z-index: 10;
  }
  .feature-text h2 { font-size: clamp(1.5rem, 5vw, 3.5rem); font-weight: 700; text-align: center; margin: 0; padding: 0 20px; }
  .feature-text p { font-size: clamp(0.875rem, 2vw, 1.25rem); text-align: center; color: #aaa; margin: 0.5em 0 0; max-width: 500px; padding: 0 20px; }
  .code-block {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center; z-index: 10;
  }
  .code-block pre {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; padding: 2em; font-size: clamp(0.75rem, 1.5vw, 1rem);
    line-height: 1.6; max-width: 90vw; overflow-x: auto; backdrop-filter: blur(20px);
  }
  .code-block code { color: #e0e0e0; }
  .code-block .tag { color: #7ec8e3; }
  .code-block .attr { color: #c792ea; }
  .code-block .val { color: #c3e88d; }
  .code-block .comment { color: #666; }
  .gradient-bg { position: absolute; inset: 0; z-index: 0; }
  .nested-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent; }
  .nested-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .nested-scroll::-webkit-scrollbar-track { background: transparent; }
  .nested-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
`;
document.head.appendChild(style);
var { div: div2, h1: h12, h2: h22, p: p3, pre, code, span: span2, video } = T;
var ease = (t5) => t5 < 0.5 ? 2 * t5 * t5 : -1 + (4 - 2 * t5) * t5;
var overlay = (range, text, options = {}) => tosiInterpolator({ "data-scroll-animate": "interpolator", "data-scroll-range": range }, tosiWaypoint({ progress: 0, style: { opacity: 0, transform: "translateY(20px)" } }), tosiWaypoint({ progress: 0.5, style: { opacity: 1, transform: "translateY(0px)" } }), tosiWaypoint({ progress: 1, style: { opacity: 0, transform: "translateY(-20px)" } }), div2({ class: "overlay", ...options }, h12({ class: "hero-text" }, text)));
var featureIntro = (title, description, codeHtml, bg = "#0a0a0a") => tosiProductSection({ scroll: 250, style: { background: bg } }, tosiInterpolator({ "data-scroll-animate": true, easing: "ease-in-out" }, tosiWaypoint({ progress: 0, style: { opacity: 0, transform: "translateY(60px)" } }), tosiWaypoint({ progress: 0.3, style: { opacity: 1, transform: "translateY(0px)" } }), tosiWaypoint({ progress: 0.7, style: { opacity: 1, transform: "translateY(0px)" } }), tosiWaypoint({ progress: 1, style: { opacity: 0, transform: "translateY(-60px)" } }), div2({ class: "feature-text", style: { flexDirection: "column" } }, h22(title), p3(description), ...codeHtml ? [
  pre({
    style: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      padding: "1em",
      marginTop: "1em",
      fontSize: "clamp(0.7rem, 1.2vw, 0.9rem)",
      lineHeight: "1.6",
      backdropFilter: "blur(20px)",
      maxWidth: "90vw",
      overflowX: "auto",
      textAlign: "left"
    },
    innerHTML: codeHtml
  })
] : [])));
var hmb = { lat: 37.4636, lng: -122.4286 };
var oulu = { lat: 65.0121, lng: 25.4651 };
var app = tosiProduct(tosiProductSection({ scroll: 150 }, div2({
  class: "gradient-bg",
  style: { background: "radial-gradient(ellipse at center, #1a1a2e 0%, #000 120%)" }
}), tosiInterpolator({ "data-scroll-animate": true }, tosiWaypoint({ progress: 0, style: { opacity: 1, transform: "translateY(0px) scale(1)" } }), tosiWaypoint({ progress: 0.8, style: { opacity: 0, transform: "translateY(-100px) scale(0.9)" } }), div2({ class: "hero" }, h12("tosijs-product"), p3("Build scrolling pages that tell your product's story. With HTML.")))), featureIntro("<tosi-interpolator>", "Scrolling is progress. Orchestrate layers with declarative waypoints — opacity, transforms, any CSS property.", `<code><span class="tag">&lt;tosi-interpolator</span> <span class="attr">data-scroll-animate</span><span class="tag">&gt;</span>
  <span class="tag">&lt;tosi-waypoint</span> <span class="attr">progress=</span><span class="val">"0.0"</span> <span class="attr">style=</span><span class="val">"opacity: 0"</span><span class="tag">/&gt;</span>
  <span class="tag">&lt;tosi-waypoint</span> <span class="attr">progress=</span><span class="val">"0.5"</span> <span class="attr">style=</span><span class="val">"opacity: 1"</span><span class="tag">/&gt;</span>
  <span class="tag">&lt;tosi-waypoint</span> <span class="attr">progress=</span><span class="val">"1.0"</span> <span class="attr">style=</span><span class="val">"opacity: 0"</span><span class="tag">/&gt;</span>
  <span class="tag">&lt;div&gt;</span>Your content here<span class="tag">&lt;/div&gt;</span>
<span class="tag">&lt;/tosi-interpolator&gt;</span></code>`, "#050510"), tosiProductSection({ scroll: 300, style: { background: "#0a0a0a" } }, tosiInterpolator({ "data-scroll-range": "0,0.5", easing: "ease-in-out" }, tosiWaypoint({ progress: 0, style: { opacity: 0, transform: "translateX(-80px)" } }), tosiWaypoint({ progress: 0.4, style: { opacity: 1, transform: "translateX(0px)" } }), tosiWaypoint({ progress: 1, style: { opacity: 0, transform: "translateX(-80px)" } }), div2({
  class: "feature-text",
  style: { flexDirection: "column", alignItems: "flex-start", paddingLeft: "10vw" }
}, h22("Scroll Ranges"), p3("Constrain animations to any portion of a section's scroll."))), tosiInterpolator({ "data-scroll-range": "0.5,1", easing: "ease-in-out" }, tosiWaypoint({ progress: 0, style: { opacity: 0, transform: "translateX(80px)" } }), tosiWaypoint({ progress: 0.5, style: { opacity: 1, transform: "translateX(0px)" } }), tosiWaypoint({ progress: 1, style: { opacity: 0, transform: "translateX(80px)" } }), div2({
  class: "feature-text",
  style: { flexDirection: "column", alignItems: "flex-end", paddingRight: "10vw" }
}, h22("Layer by Layer"), p3("Choreograph multiple elements, each with its own timing.")))), featureIntro("Video Scrubbing", `Scrub any video frame-by-frame via scroll position. Just add data-scroll-animate="currentTime" — you'll want a fast server or CDN.`, `<code><span class="tag">&lt;video</span> <span class="attr">src=</span><span class="val">"clip.mp4"</span> <span class="attr">data-scroll-animate=</span><span class="val">"currentTime"</span> <span class="attr">muted</span> <span class="attr">playsinline</span><span class="tag">&gt;&lt;/video&gt;</span></code>`), tosiProductSection({ scroll: 300, style: { backgroundColor: "#000" } }, video({
  src: "demo/assets/agent-owl.mp4",
  "data-scroll-animate": "currentTime",
  muted: true,
  playsinline: true,
  preload: "auto"
}), overlay("0.1, 0.5", "Scrub any video. Frame by frame.")), featureIntro("Filmstrip Mosaic", "Convert video into a single mosaic image. No video decode, instant seeking, works everywhere. Use the tosi-mosaic CLI to generate.", `<code><span class="tag">&lt;tosi-filmstrip</span>
  <span class="attr">src=</span><span class="val">"clip_10x10_100.jpg"</span>
  <span class="attr">cols=</span><span class="val">"10"</span> <span class="attr">rows=</span><span class="val">"10"</span> <span class="attr">total=</span><span class="val">"100"</span>
  <span class="attr">data-scroll-animate</span>
<span class="tag">&gt;&lt;/tosi-filmstrip&gt;</span></code>`), tosiProductSection({ scroll: 300, style: { backgroundColor: "#000" } }, tosiFilmstrip({
  src: "demo/assets/agent-owl_10x10_100.jpg",
  cols: 10,
  rows: 10,
  total: 100,
  "data-scroll-animate": "true"
}), overlay("0.1, 0.9", "100 frames. One image. Zero stutter.")), featureIntro("Mapbox Integration", "Travel the world with scroll-linked map navigation. Zoom out, pan across continents, zoom back in.", `<code><span class="tag">&lt;tosi-scroll-mapper&gt;</span>
  <span class="tag">&lt;tosi-map</span> <span class="attr">token=</span><span class="val">"pk.ey..."</span>
    <span class="attr">coords=</span><span class="val">"37.46,-122.43,12"</span>
    <span class="attr">map-style=</span><span class="val">"mapbox://styles/mapbox/dark-v11"</span><span class="tag">/&gt;</span>
<span class="tag">&lt;/tosi-scroll-mapper&gt;</span></code>`), tosiProductSection({ scroll: 500, style: { backgroundColor: "#fff" } }, tosiScrollMapper({
  scrollCallback(progress) {
    const map = this.querySelector("tosi-map");
    if (!map)
      return;
    let moveP = 0;
    if (progress > 0.1 && progress < 0.9) {
      moveP = ease((progress - 0.1) / 0.8);
    } else if (progress >= 0.9) {
      moveP = 1;
    }
    const zp = Math.abs(progress - 0.5) * 2;
    const zoom = 2 + zp * zp * 10;
    const lat = hmb.lat + (oulu.lat - hmb.lat) * moveP;
    const lng = hmb.lng + (oulu.lng - hmb.lng) * moveP;
    map.coords = `${lat.toFixed(6)},${lng.toFixed(6)},${zoom.toFixed(4)}`;
  }
}, O8({
  token: "pk.eyJ1IjoicG9kcGVyc29uIiwiYSI6ImNqc2JlbWU0bjA1ZmY0YW5ycHZod3VhbWcifQ.arvqfpOqMgFYkKgQ35UScA",
  coords: `${hmb.lat},${hmb.lng},12`,
  mapStyle: "mapbox://styles/mapbox/dark-v11",
  style: { width: "100%", height: "100%", pointerEvents: "none" }
})), overlay("0, 0.2", "Half Moon Bay"), overlay("0.8, 1.0", "Oulu")), featureIntro("3D Scenes", "Animate BabylonJS scenes with scroll-driven camera waypoints. Load any GLB/glTF model.", `<code><span class="tag">&lt;tosi-scroll-camera</span> <span class="attr">data-scroll-animate</span> <span class="attr">easing=</span><span class="val">"ease-in-out"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;tosi-waypoint</span> <span class="attr">progress=</span><span class="val">"0"</span> <span class="attr">alpha=</span><span class="val">"-1.57"</span> <span class="attr">radius=</span><span class="val">"110"</span><span class="tag">/&gt;</span>
  <span class="tag">&lt;tosi-waypoint</span> <span class="attr">progress=</span><span class="val">"1"</span> <span class="attr">alpha=</span><span class="val">"1.57"</span> <span class="attr">radius=</span><span class="val">"76"</span><span class="tag">/&gt;</span>
<span class="tag">&lt;/tosi-scroll-camera&gt;</span></code>`), tosiProductSection({ scroll: 400, style: { backgroundColor: "#111" } }, overlay("0, 0.5", "MacBook Neo."), overlay("0.5, 1.0", "Every angle. Pure elegance."), a3({
  "data-scroll-animate": "babylon",
  async sceneCreated(element, BABYLON) {
    const { scene } = element;
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 80, new BABYLON.Vector3(0, 10, 0), scene);
    scene.activeCamera = camera;
    camera.minZ = 0.1;
    camera.fov = camera.fov * 0.6;
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene).intensity = 0.6;
    const dir = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-1, -2, 1), scene);
    dir.intensity = 0.8;
    element.loadScene("demo/assets/", "macbook_neo.glb");
  }
}), tosiScrollCamera({ "data-scroll-animate": true, easing: "ease-in-out" }, tosiWaypoint({ progress: 0, alpha: -1.57, beta: 1.2, radius: 110 }), tosiWaypoint({ progress: 0.5, alpha: 0, beta: 1, radius: 70 }), tosiWaypoint({ progress: 1, alpha: 1.57, beta: 1.55, radius: 76 }))), featureIntro("Lottie Animations", "Scrub Lottie/Bodymovin animations with scroll progress. Frame-perfect control over vector animations.", `<code><span class="tag">&lt;tosi-lottie</span>
  <span class="attr">src=</span><span class="val">"animation.json"</span>
  <span class="attr">data-scroll-animate=</span><span class="val">"lottie"</span>
<span class="tag">&gt;&lt;/tosi-lottie&gt;</span></code>`), tosiProductSection({
  scroll: 200,
  style: { backgroundColor: "#000" }
}, M3({
  src: "demo/assets/tosi-platform.json",
  "data-scroll-animate": "lottie",
  config: { renderer: "svg", autoplay: false, loop: false }
}), overlay("0, 0.5", "Scroll-driven vector art."), overlay("0.5, 1.0", "Any Lottie animation. Zero code.")), tosiProductSection({
  scroll: 200,
  style: { background: "radial-gradient(ellipse at center, #1a1a2e 0%, #000 70%)" }
}, tosiInterpolator({ "data-scroll-animate": true, easing: "ease-in-out" }, tosiWaypoint({ progress: 0, style: { opacity: 0, transform: "translateY(40px)" } }), tosiWaypoint({ progress: 0.3, style: { opacity: 1, transform: "translateY(0px)" } }), tosiWaypoint({ progress: 0.7, style: { opacity: 1, transform: "translateY(0px)" } }), tosiWaypoint({ progress: 1, style: { opacity: 0, transform: "translateY(-40px)" } }), div2({ class: "feature-text", style: { flexDirection: "column" } }, h22("One Script Tag"), p3("The IIFE build includes tosijs, tosijs-ui, and tosijs-product. Load it from a CDN and start building."), pre({
  style: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "1em",
    marginTop: "1em",
    fontSize: "clamp(0.7rem, 1.2vw, 0.9rem)"
  },
  innerHTML: `<code><span class="tag">&lt;script</span> <span class="attr">src=</span><span class="val">"https://cdn.jsdelivr.net/npm/tosijs-product/dist/index.js"</span><span class="tag">&gt;&lt;/script&gt;</span></code>`
})))), div2({ style: { padding: "4em 1em", background: "#111", textAlign: "center" } }, h22({ style: { fontSize: "clamp(1.5rem, 4vw, 2.5rem)", margin: "0 0 0.5em" } }, "Nested Scroll Containers"), p3({
  style: { color: "#999", margin: "0 auto 2em", maxWidth: "500px" },
  innerHTML: "A <code>tosi-product</code> inside an <code>overflow-y: auto</code> div detects its scroll parent automatically."
}), div2({
  class: "nested-scroll",
  style: {
    height: "60vh",
    overflowY: "auto",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    maxWidth: "800px",
    margin: "0 auto",
    background: "#000"
  }
}, tosiProduct(...[
  ["tosi-product", "Top-level container. Wraps your scroll story.", "#0a0a1a", "#7ec8e3"],
  ["tosi-product-section", "Converts scroll offset to 0→1 progress. Sticky viewport pinning.", "#1a0a1a", "#c792ea"],
  ["tosi-interpolator", "Declarative CSS interpolation between waypoints.", "#0a1a0a", "#88e0a0"],
  ["tosi-filmstrip", "Canvas-based frame animator from a single mosaic image.", "#1a1a0a", "#e0d888"],
  ["tosi-scroll-mapper", "Generic scroll progress wrapper with a callback.", "#0a0a1a", "#e08888"],
  ["tosi-scroll-camera", "Waypoint-driven camera controller for BabylonJS.", "#1a0a0a", "#c0a0e0"]
].map(([name, desc, bg, color], i, arr) => tosiProductSection({ scroll: 200, style: { background: bg } }, tosiInterpolator({ "data-scroll-animate": true }, tosiWaypoint({ progress: 0, style: { opacity: i === 0 ? 1 : 0, transform: i === 0 ? "translateY(0px)" : "translateY(40px)" } }), tosiWaypoint({ progress: 0.3, style: { opacity: 1, transform: "translateY(0px)" } }), tosiWaypoint({ progress: 0.7, style: { opacity: 1, transform: "translateY(0px)" } }), tosiWaypoint({ progress: 1, style: { opacity: i === arr.length - 1 ? 1 : 0, transform: i === arr.length - 1 ? "translateY(0px)" : "translateY(-40px)" } }), div2({ class: "feature-text", style: { flexDirection: "column" } }, h22({ style: { color } }, `<${name}>`), p3(desc)))))))), div2({ style: { padding: "4em 1em", background: "#0a0a0a", textAlign: "center" } }, h22({ style: { fontSize: "clamp(1.5rem, 4vw, 2.5rem)", margin: "0 0 0.5em" } }, "Horizontal Scrolling"), p3({
  style: { color: "#999", margin: "0 auto 2em", maxWidth: "500px" },
  innerHTML: 'Set <code>direction="horizontal"</code> for side-scrolling sections.'
}), div2({
  class: "nested-scroll",
  style: {
    width: "100%",
    maxWidth: "800px",
    height: "60vh",
    overflowX: "auto",
    overflowY: "hidden",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    margin: "0 auto",
    background: "#000",
    whiteSpace: "nowrap"
  }
}, tosiProduct({ style: { display: "inline-flex", width: "max-content", height: "100%" } }, ...[
  [
    "tosijs",
    "A front-end library for leveraging web components and CSS3 with proxy-based state management and O(1) virtual lists.",
    "#0a1a0a",
    "#88e0a0"
  ],
  [
    "tosijs-ui",
    "Web components that complement the DOM instead of fighting it.",
    "#1a1a0a",
    "#e0d888"
  ],
  [
    "tosijs-3d",
    "A declarative 3D library built on BabylonJS.",
    "#1a0a1a",
    "#c792ea"
  ],
  [
    "tjs-lang",
    "Fulfills the promise of JavaScript, Lisp, and Dylan. Transpiles TypeScript, turns types into runtime contracts, provides safe eval.",
    "#0a0a1a",
    "#7ec8e3"
  ]
].map(([name, desc, bg, color], i, arr) => tosiProductSection({
  direction: "horizontal",
  scroll: 200,
  style: { background: bg, height: "100%", flexShrink: 0 }
}, tosiInterpolator({ "data-scroll-animate": true }, tosiWaypoint({ progress: 0, style: { opacity: i === 0 ? 1 : 0, transform: i === 0 ? "translateX(0px)" : "translateX(60px)" } }), tosiWaypoint({ progress: 0.3, style: { opacity: 1, transform: "translateX(0px)" } }), tosiWaypoint({ progress: 0.7, style: { opacity: 1, transform: "translateX(0px)" } }), tosiWaypoint({ progress: 1, style: { opacity: i === arr.length - 1 ? 1 : 0, transform: i === arr.length - 1 ? "translateX(0px)" : "translateX(-60px)" } }), div2({ class: "feature-text", style: { flexDirection: "column", whiteSpace: "normal" } }, h22({ style: { color } }, name), p3(desc)))))))), div2({ style: { textAlign: "center", padding: "4em 1em", background: "#000", color: "#555", fontSize: "0.9rem" } }, p3("Built with ", T.a({ href: "https://tosijs.net", style: { color: "#7ec8e3", textDecoration: "none" } }, "tosijs"))));
document.body.append(app);
