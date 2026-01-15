var fp = Object.defineProperty;
var dp = (e, t, r) => t in e ? fp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var ia = (e, t, r) => dp(e, typeof t != "symbol" ? t + "" : t, r);
import Kt, { app as Xe, BrowserWindow as Tc, Notification as pp, ipcMain as ze, dialog as ho } from "electron";
import { createRequire as Ba } from "node:module";
import { fileURLToPath as hp } from "node:url";
import Se from "node:path";
import nr, { open as mp } from "node:fs/promises";
import Dt from "fs";
import gp from "constants";
import cn from "stream";
import fs from "util";
import _c from "assert";
import oe from "path";
import Ti from "child_process";
import bc from "events";
import un from "crypto";
import Sc from "tty";
import _i from "os";
import br from "url";
import yp from "string_decoder";
import Ac from "zlib";
import xp from "http";
import { execFile as wp, exec as Ep } from "node:child_process";
var Oe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function vp(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var st = {}, Zt = {}, ke = {};
ke.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, a) => i != null ? n(i) : r(a)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
ke.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var xt = gp, Tp = process.cwd, ri = null, _p = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return ri || (ri = Tp.call(process)), ri;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var mo = process.chdir;
  process.chdir = function(e) {
    ri = null, mo.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, mo);
}
var bp = Sp;
function Sp(e) {
  xt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = a(e.chown), e.fchown = a(e.fchown), e.lchown = a(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = o(e.stat), e.fstat = o(e.fstat), e.lstat = o(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, u, p) {
    p && process.nextTick(p);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, u, p, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), _p === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function u(p, g, w) {
      var x = Date.now(), T = 0;
      c(p, g, function _(b) {
        if (b && (b.code === "EACCES" || b.code === "EPERM" || b.code === "EBUSY") && Date.now() - x < 6e4) {
          setTimeout(function() {
            e.stat(g, function(N, $) {
              N && N.code === "ENOENT" ? c(p, g, _) : w(b);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        w && w(b);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function u(p, g, w, x, T, _) {
      var b;
      if (_ && typeof _ == "function") {
        var N = 0;
        b = function($, ie, ue) {
          if ($ && $.code === "EAGAIN" && N < 10)
            return N++, c.call(e, p, g, w, x, T, b);
          _.apply(this, arguments);
        };
      }
      return c.call(e, p, g, w, x, T, b);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(u, p, g, w, x) {
      for (var T = 0; ; )
        try {
          return c.call(e, u, p, g, w, x);
        } catch (_) {
          if (_.code === "EAGAIN" && T < 10) {
            T++;
            continue;
          }
          throw _;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(u, p, g) {
      c.open(
        u,
        xt.O_WRONLY | xt.O_SYMLINK,
        p,
        function(w, x) {
          if (w) {
            g && g(w);
            return;
          }
          c.fchmod(x, p, function(T) {
            c.close(x, function(_) {
              g && g(T || _);
            });
          });
        }
      );
    }, c.lchmodSync = function(u, p) {
      var g = c.openSync(u, xt.O_WRONLY | xt.O_SYMLINK, p), w = !0, x;
      try {
        x = c.fchmodSync(g, p), w = !1;
      } finally {
        if (w)
          try {
            c.closeSync(g);
          } catch {
          }
        else
          c.closeSync(g);
      }
      return x;
    };
  }
  function r(c) {
    xt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(u, p, g, w) {
      c.open(u, xt.O_SYMLINK, function(x, T) {
        if (x) {
          w && w(x);
          return;
        }
        c.futimes(T, p, g, function(_) {
          c.close(T, function(b) {
            w && w(_ || b);
          });
        });
      });
    }, c.lutimesSync = function(u, p, g) {
      var w = c.openSync(u, xt.O_SYMLINK), x, T = !0;
      try {
        x = c.futimesSync(w, p, g), T = !1;
      } finally {
        if (T)
          try {
            c.closeSync(w);
          } catch {
          }
        else
          c.closeSync(w);
      }
      return x;
    }) : c.futimes && (c.lutimes = function(u, p, g, w) {
      w && process.nextTick(w);
    }, c.lutimesSync = function() {
    });
  }
  function n(c) {
    return c && function(u, p, g) {
      return c.call(e, u, p, function(w) {
        d(w) && (w = null), g && g.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(u, p) {
      try {
        return c.call(e, u, p);
      } catch (g) {
        if (!d(g)) throw g;
      }
    };
  }
  function a(c) {
    return c && function(u, p, g, w) {
      return c.call(e, u, p, g, function(x) {
        d(x) && (x = null), w && w.apply(this, arguments);
      });
    };
  }
  function s(c) {
    return c && function(u, p, g) {
      try {
        return c.call(e, u, p, g);
      } catch (w) {
        if (!d(w)) throw w;
      }
    };
  }
  function o(c) {
    return c && function(u, p, g) {
      typeof p == "function" && (g = p, p = null);
      function w(x, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), g && g.apply(this, arguments);
      }
      return p ? c.call(e, u, p, w) : c.call(e, u, w);
    };
  }
  function l(c) {
    return c && function(u, p) {
      var g = p ? c.call(e, u, p) : c.call(e, u);
      return g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)), g;
    };
  }
  function d(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var u = !process.getuid || process.getuid() !== 0;
    return !!(u && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var go = cn.Stream, Ap = Ip;
function Ip(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    go.call(this);
    var a = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var s = Object.keys(i), o = 0, l = s.length; o < l; o++) {
      var d = s[o];
      this[d] = i[d];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        a._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(c, u) {
      if (c) {
        a.emit("error", c), a.readable = !1;
        return;
      }
      a.fd = u, a.emit("open", u), a._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    go.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var a = Object.keys(i), s = 0, o = a.length; s < o; s++) {
      var l = a[s];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var Cp = Op, Rp = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Op(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Rp(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var se = Dt, Dp = bp, Pp = Ap, kp = Cp, kn = fs, ve, oi;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (ve = Symbol.for("graceful-fs.queue"), oi = Symbol.for("graceful-fs.previous")) : (ve = "___graceful-fs.queue", oi = "___graceful-fs.previous");
function Np() {
}
function Ic(e, t) {
  Object.defineProperty(e, ve, {
    get: function() {
      return t;
    }
  });
}
var Wt = Np;
kn.debuglog ? Wt = kn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Wt = function() {
  var e = kn.format.apply(kn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!se[ve]) {
  var Fp = Oe[ve] || [];
  Ic(se, Fp), se.close = function(e) {
    function t(r, n) {
      return e.call(se, r, function(i) {
        i || yo(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, oi, {
      value: e
    }), t;
  }(se.close), se.closeSync = function(e) {
    function t(r) {
      e.apply(se, arguments), yo();
    }
    return Object.defineProperty(t, oi, {
      value: e
    }), t;
  }(se.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Wt(se[ve]), _c.equal(se[ve].length, 0);
  });
}
Oe[ve] || Ic(Oe, se[ve]);
var Ne = ds(kp(se));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !se.__patched && (Ne = ds(se), se.__patched = !0);
function ds(e) {
  Dp(e), e.gracefulify = ds, e.createReadStream = ie, e.createWriteStream = ue;
  var t = e.readFile;
  e.readFile = r;
  function r(y, q, z) {
    return typeof q == "function" && (z = q, q = null), B(y, q, z);
    function B(Q, R, I, D) {
      return t(Q, R, function(A) {
        A && (A.code === "EMFILE" || A.code === "ENFILE") ? ir([B, [Q, R, I], A, D || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(y, q, z, B) {
    return typeof z == "function" && (B = z, z = null), Q(y, q, z, B);
    function Q(R, I, D, A, k) {
      return n(R, I, D, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([Q, [R, I, D, A], O, k || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var a = e.appendFile;
  a && (e.appendFile = s);
  function s(y, q, z, B) {
    return typeof z == "function" && (B = z, z = null), Q(y, q, z, B);
    function Q(R, I, D, A, k) {
      return a(R, I, D, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([Q, [R, I, D, A], O, k || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var o = e.copyFile;
  o && (e.copyFile = l);
  function l(y, q, z, B) {
    return typeof z == "function" && (B = z, z = 0), Q(y, q, z, B);
    function Q(R, I, D, A, k) {
      return o(R, I, D, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([Q, [R, I, D, A], O, k || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var d = e.readdir;
  e.readdir = u;
  var c = /^v[0-5]\./;
  function u(y, q, z) {
    typeof q == "function" && (z = q, q = null);
    var B = c.test(process.version) ? function(I, D, A, k) {
      return d(I, Q(
        I,
        D,
        A,
        k
      ));
    } : function(I, D, A, k) {
      return d(I, D, Q(
        I,
        D,
        A,
        k
      ));
    };
    return B(y, q, z);
    function Q(R, I, D, A) {
      return function(k, O) {
        k && (k.code === "EMFILE" || k.code === "ENFILE") ? ir([
          B,
          [R, I, D],
          k,
          A || Date.now(),
          Date.now()
        ]) : (O && O.sort && O.sort(), typeof D == "function" && D.call(this, k, O));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var p = Pp(e);
    _ = p.ReadStream, N = p.WriteStream;
  }
  var g = e.ReadStream;
  g && (_.prototype = Object.create(g.prototype), _.prototype.open = b);
  var w = e.WriteStream;
  w && (N.prototype = Object.create(w.prototype), N.prototype.open = $), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return _;
    },
    set: function(y) {
      _ = y;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return N;
    },
    set: function(y) {
      N = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var x = _;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return x;
    },
    set: function(y) {
      x = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var T = N;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return T;
    },
    set: function(y) {
      T = y;
    },
    enumerable: !0,
    configurable: !0
  });
  function _(y, q) {
    return this instanceof _ ? (g.apply(this, arguments), this) : _.apply(Object.create(_.prototype), arguments);
  }
  function b() {
    var y = this;
    Me(y.path, y.flags, y.mode, function(q, z) {
      q ? (y.autoClose && y.destroy(), y.emit("error", q)) : (y.fd = z, y.emit("open", z), y.read());
    });
  }
  function N(y, q) {
    return this instanceof N ? (w.apply(this, arguments), this) : N.apply(Object.create(N.prototype), arguments);
  }
  function $() {
    var y = this;
    Me(y.path, y.flags, y.mode, function(q, z) {
      q ? (y.destroy(), y.emit("error", q)) : (y.fd = z, y.emit("open", z));
    });
  }
  function ie(y, q) {
    return new e.ReadStream(y, q);
  }
  function ue(y, q) {
    return new e.WriteStream(y, q);
  }
  var Y = e.open;
  e.open = Me;
  function Me(y, q, z, B) {
    return typeof z == "function" && (B = z, z = null), Q(y, q, z, B);
    function Q(R, I, D, A, k) {
      return Y(R, I, D, function(O, M) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([Q, [R, I, D, A], O, k || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  return e;
}
function ir(e) {
  Wt("ENQUEUE", e[0].name, e[1]), se[ve].push(e), ps();
}
var Nn;
function yo() {
  for (var e = Date.now(), t = 0; t < se[ve].length; ++t)
    se[ve][t].length > 2 && (se[ve][t][3] = e, se[ve][t][4] = e);
  ps();
}
function ps() {
  if (clearTimeout(Nn), Nn = void 0, se[ve].length !== 0) {
    var e = se[ve].shift(), t = e[0], r = e[1], n = e[2], i = e[3], a = e[4];
    if (i === void 0)
      Wt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Wt("TIMEOUT", t.name, r);
      var s = r.pop();
      typeof s == "function" && s.call(null, n);
    } else {
      var o = Date.now() - a, l = Math.max(a - i, 1), d = Math.min(l * 1.2, 100);
      o >= d ? (Wt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : se[ve].push(e);
    }
    Nn === void 0 && (Nn = setTimeout(ps, 0));
  }
}
(function(e) {
  const t = ke.fromCallback, r = Ne, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, a) {
    return typeof a == "function" ? r.exists(i, a) : new Promise((s) => r.exists(i, s));
  }, e.read = function(i, a, s, o, l, d) {
    return typeof d == "function" ? r.read(i, a, s, o, l, d) : new Promise((c, u) => {
      r.read(i, a, s, o, l, (p, g, w) => {
        if (p) return u(p);
        c({ bytesRead: g, buffer: w });
      });
    });
  }, e.write = function(i, a, ...s) {
    return typeof s[s.length - 1] == "function" ? r.write(i, a, ...s) : new Promise((o, l) => {
      r.write(i, a, ...s, (d, c, u) => {
        if (d) return l(d);
        o({ bytesWritten: c, buffer: u });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, a, ...s) {
    return typeof s[s.length - 1] == "function" ? r.writev(i, a, ...s) : new Promise((o, l) => {
      r.writev(i, a, ...s, (d, c, u) => {
        if (d) return l(d);
        o({ bytesWritten: c, buffers: u });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Zt);
var hs = {}, Cc = {};
const $p = oe;
Cc.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace($p.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Rc = Zt, { checkPath: Oc } = Cc, Dc = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
hs.makeDir = async (e, t) => (Oc(e), Rc.mkdir(e, {
  mode: Dc(t),
  recursive: !0
}));
hs.makeDirSync = (e, t) => (Oc(e), Rc.mkdirSync(e, {
  mode: Dc(t),
  recursive: !0
}));
const Lp = ke.fromPromise, { makeDir: Up, makeDirSync: aa } = hs, sa = Lp(Up);
var ot = {
  mkdirs: sa,
  mkdirsSync: aa,
  // alias
  mkdirp: sa,
  mkdirpSync: aa,
  ensureDir: sa,
  ensureDirSync: aa
};
const Mp = ke.fromPromise, Pc = Zt;
function Bp(e) {
  return Pc.access(e).then(() => !0).catch(() => !1);
}
var er = {
  pathExists: Mp(Bp),
  pathExistsSync: Pc.existsSync
};
const xr = Ne;
function zp(e, t, r, n) {
  xr.open(e, "r+", (i, a) => {
    if (i) return n(i);
    xr.futimes(a, t, r, (s) => {
      xr.close(a, (o) => {
        n && n(s || o);
      });
    });
  });
}
function jp(e, t, r) {
  const n = xr.openSync(e, "r+");
  return xr.futimesSync(n, t, r), xr.closeSync(n);
}
var kc = {
  utimesMillis: zp,
  utimesMillisSync: jp
};
const Er = Zt, ye = oe, Gp = fs;
function Hp(e, t, r) {
  const n = r.dereference ? (i) => Er.stat(i, { bigint: !0 }) : (i) => Er.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, a]) => ({ srcStat: i, destStat: a }));
}
function qp(e, t, r) {
  let n;
  const i = r.dereference ? (s) => Er.statSync(s, { bigint: !0 }) : (s) => Er.lstatSync(s, { bigint: !0 }), a = i(e);
  try {
    n = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: a, destStat: null };
    throw s;
  }
  return { srcStat: a, destStat: n };
}
function Xp(e, t, r, n, i) {
  Gp.callbackify(Hp)(e, t, n, (a, s) => {
    if (a) return i(a);
    const { srcStat: o, destStat: l } = s;
    if (l) {
      if (fn(o, l)) {
        const d = ye.basename(e), c = ye.basename(t);
        return r === "move" && d !== c && d.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: o, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (o.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!o.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return o.isDirectory() && ms(e, t) ? i(new Error(bi(e, t, r))) : i(null, { srcStat: o, destStat: l });
  });
}
function Wp(e, t, r, n) {
  const { srcStat: i, destStat: a } = qp(e, t, n);
  if (a) {
    if (fn(i, a)) {
      const s = ye.basename(e), o = ye.basename(t);
      if (r === "move" && s !== o && s.toLowerCase() === o.toLowerCase())
        return { srcStat: i, destStat: a, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !a.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && a.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && ms(e, t))
    throw new Error(bi(e, t, r));
  return { srcStat: i, destStat: a };
}
function Nc(e, t, r, n, i) {
  const a = ye.resolve(ye.dirname(e)), s = ye.resolve(ye.dirname(r));
  if (s === a || s === ye.parse(s).root) return i();
  Er.stat(s, { bigint: !0 }, (o, l) => o ? o.code === "ENOENT" ? i() : i(o) : fn(t, l) ? i(new Error(bi(e, r, n))) : Nc(e, t, s, n, i));
}
function Fc(e, t, r, n) {
  const i = ye.resolve(ye.dirname(e)), a = ye.resolve(ye.dirname(r));
  if (a === i || a === ye.parse(a).root) return;
  let s;
  try {
    s = Er.statSync(a, { bigint: !0 });
  } catch (o) {
    if (o.code === "ENOENT") return;
    throw o;
  }
  if (fn(t, s))
    throw new Error(bi(e, r, n));
  return Fc(e, t, a, n);
}
function fn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function ms(e, t) {
  const r = ye.resolve(e).split(ye.sep).filter((i) => i), n = ye.resolve(t).split(ye.sep).filter((i) => i);
  return r.reduce((i, a, s) => i && n[s] === a, !0);
}
function bi(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Sr = {
  checkPaths: Xp,
  checkPathsSync: Wp,
  checkParentPaths: Nc,
  checkParentPathsSync: Fc,
  isSrcSubdir: ms,
  areIdentical: fn
};
const Le = Ne, Wr = oe, Vp = ot.mkdirs, Yp = er.pathExists, Kp = kc.utimesMillis, Vr = Sr;
function Jp(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Vr.checkPaths(e, t, "copy", r, (i, a) => {
    if (i) return n(i);
    const { srcStat: s, destStat: o } = a;
    Vr.checkParentPaths(e, s, t, "copy", (l) => l ? n(l) : r.filter ? $c(xo, o, e, t, r, n) : xo(o, e, t, r, n));
  });
}
function xo(e, t, r, n, i) {
  const a = Wr.dirname(r);
  Yp(a, (s, o) => {
    if (s) return i(s);
    if (o) return li(e, t, r, n, i);
    Vp(a, (l) => l ? i(l) : li(e, t, r, n, i));
  });
}
function $c(e, t, r, n, i, a) {
  Promise.resolve(i.filter(r, n)).then((s) => s ? e(t, r, n, i, a) : a(), (s) => a(s));
}
function Qp(e, t, r, n, i) {
  return n.filter ? $c(li, e, t, r, n, i) : li(e, t, r, n, i);
}
function li(e, t, r, n, i) {
  (n.dereference ? Le.stat : Le.lstat)(t, (s, o) => s ? i(s) : o.isDirectory() ? ah(o, e, t, r, n, i) : o.isFile() || o.isCharacterDevice() || o.isBlockDevice() ? Zp(o, e, t, r, n, i) : o.isSymbolicLink() ? lh(e, t, r, n, i) : o.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : o.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Zp(e, t, r, n, i, a) {
  return t ? eh(e, r, n, i, a) : Lc(e, r, n, i, a);
}
function eh(e, t, r, n, i) {
  if (n.overwrite)
    Le.unlink(r, (a) => a ? i(a) : Lc(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Lc(e, t, r, n, i) {
  Le.copyFile(t, r, (a) => a ? i(a) : n.preserveTimestamps ? th(e.mode, t, r, i) : Si(r, e.mode, i));
}
function th(e, t, r, n) {
  return rh(e) ? nh(r, e, (i) => i ? n(i) : wo(e, t, r, n)) : wo(e, t, r, n);
}
function rh(e) {
  return (e & 128) === 0;
}
function nh(e, t, r) {
  return Si(e, t | 128, r);
}
function wo(e, t, r, n) {
  ih(t, r, (i) => i ? n(i) : Si(r, e, n));
}
function Si(e, t, r) {
  return Le.chmod(e, t, r);
}
function ih(e, t, r) {
  Le.stat(e, (n, i) => n ? r(n) : Kp(t, i.atime, i.mtime, r));
}
function ah(e, t, r, n, i, a) {
  return t ? Uc(r, n, i, a) : sh(e.mode, r, n, i, a);
}
function sh(e, t, r, n, i) {
  Le.mkdir(r, (a) => {
    if (a) return i(a);
    Uc(t, r, n, (s) => s ? i(s) : Si(r, e, i));
  });
}
function Uc(e, t, r, n) {
  Le.readdir(e, (i, a) => i ? n(i) : Mc(a, e, t, r, n));
}
function Mc(e, t, r, n, i) {
  const a = e.pop();
  return a ? oh(e, a, t, r, n, i) : i();
}
function oh(e, t, r, n, i, a) {
  const s = Wr.join(r, t), o = Wr.join(n, t);
  Vr.checkPaths(s, o, "copy", i, (l, d) => {
    if (l) return a(l);
    const { destStat: c } = d;
    Qp(c, s, o, i, (u) => u ? a(u) : Mc(e, r, n, i, a));
  });
}
function lh(e, t, r, n, i) {
  Le.readlink(t, (a, s) => {
    if (a) return i(a);
    if (n.dereference && (s = Wr.resolve(process.cwd(), s)), e)
      Le.readlink(r, (o, l) => o ? o.code === "EINVAL" || o.code === "UNKNOWN" ? Le.symlink(s, r, i) : i(o) : (n.dereference && (l = Wr.resolve(process.cwd(), l)), Vr.isSrcSubdir(s, l) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Vr.isSrcSubdir(l, s) ? i(new Error(`Cannot overwrite '${l}' with '${s}'.`)) : ch(s, r, i)));
    else
      return Le.symlink(s, r, i);
  });
}
function ch(e, t, r) {
  Le.unlink(t, (n) => n ? r(n) : Le.symlink(e, t, r));
}
var uh = Jp;
const Ae = Ne, Yr = oe, fh = ot.mkdirsSync, dh = kc.utimesMillisSync, Kr = Sr;
function ph(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Kr.checkPathsSync(e, t, "copy", r);
  return Kr.checkParentPathsSync(e, n, t, "copy"), hh(i, e, t, r);
}
function hh(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Yr.dirname(r);
  return Ae.existsSync(i) || fh(i), Bc(e, t, r, n);
}
function mh(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Bc(e, t, r, n);
}
function Bc(e, t, r, n) {
  const a = (n.dereference ? Ae.statSync : Ae.lstatSync)(t);
  if (a.isDirectory()) return Th(a, e, t, r, n);
  if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return gh(a, e, t, r, n);
  if (a.isSymbolicLink()) return Sh(e, t, r, n);
  throw a.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function gh(e, t, r, n, i) {
  return t ? yh(e, r, n, i) : zc(e, r, n, i);
}
function yh(e, t, r, n) {
  if (n.overwrite)
    return Ae.unlinkSync(r), zc(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function zc(e, t, r, n) {
  return Ae.copyFileSync(t, r), n.preserveTimestamps && xh(e.mode, t, r), gs(r, e.mode);
}
function xh(e, t, r) {
  return wh(e) && Eh(r, e), vh(t, r);
}
function wh(e) {
  return (e & 128) === 0;
}
function Eh(e, t) {
  return gs(e, t | 128);
}
function gs(e, t) {
  return Ae.chmodSync(e, t);
}
function vh(e, t) {
  const r = Ae.statSync(e);
  return dh(t, r.atime, r.mtime);
}
function Th(e, t, r, n, i) {
  return t ? jc(r, n, i) : _h(e.mode, r, n, i);
}
function _h(e, t, r, n) {
  return Ae.mkdirSync(r), jc(t, r, n), gs(r, e);
}
function jc(e, t, r) {
  Ae.readdirSync(e).forEach((n) => bh(n, e, t, r));
}
function bh(e, t, r, n) {
  const i = Yr.join(t, e), a = Yr.join(r, e), { destStat: s } = Kr.checkPathsSync(i, a, "copy", n);
  return mh(s, i, a, n);
}
function Sh(e, t, r, n) {
  let i = Ae.readlinkSync(t);
  if (n.dereference && (i = Yr.resolve(process.cwd(), i)), e) {
    let a;
    try {
      a = Ae.readlinkSync(r);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Ae.symlinkSync(i, r);
      throw s;
    }
    if (n.dereference && (a = Yr.resolve(process.cwd(), a)), Kr.isSrcSubdir(i, a))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);
    if (Ae.statSync(r).isDirectory() && Kr.isSrcSubdir(a, i))
      throw new Error(`Cannot overwrite '${a}' with '${i}'.`);
    return Ah(i, r);
  } else
    return Ae.symlinkSync(i, r);
}
function Ah(e, t) {
  return Ae.unlinkSync(t), Ae.symlinkSync(e, t);
}
var Ih = ph;
const Ch = ke.fromCallback;
var ys = {
  copy: Ch(uh),
  copySync: Ih
};
const Eo = Ne, Gc = oe, ee = _c, Jr = process.platform === "win32";
function Hc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Eo[r], r = r + "Sync", e[r] = e[r] || Eo[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function xs(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), ee(e, "rimraf: missing path"), ee.strictEqual(typeof e, "string", "rimraf: path should be a string"), ee.strictEqual(typeof r, "function", "rimraf: callback function required"), ee(t, "rimraf: invalid options argument provided"), ee.strictEqual(typeof t, "object", "rimraf: options should be object"), Hc(t), vo(e, t, function i(a) {
    if (a) {
      if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const s = n * 100;
        return setTimeout(() => vo(e, t, i), s);
      }
      a.code === "ENOENT" && (a = null);
    }
    r(a);
  });
}
function vo(e, t, r) {
  ee(e), ee(t), ee(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Jr)
      return To(e, t, n, r);
    if (i && i.isDirectory())
      return ni(e, t, n, r);
    t.unlink(e, (a) => {
      if (a) {
        if (a.code === "ENOENT")
          return r(null);
        if (a.code === "EPERM")
          return Jr ? To(e, t, a, r) : ni(e, t, a, r);
        if (a.code === "EISDIR")
          return ni(e, t, a, r);
      }
      return r(a);
    });
  });
}
function To(e, t, r, n) {
  ee(e), ee(t), ee(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (a, s) => {
      a ? n(a.code === "ENOENT" ? null : r) : s.isDirectory() ? ni(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function _o(e, t, r) {
  let n;
  ee(e), ee(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? ii(e, t, r) : t.unlinkSync(e);
}
function ni(e, t, r, n) {
  ee(e), ee(t), ee(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Rh(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Rh(e, t, r) {
  ee(e), ee(t), ee(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let a = i.length, s;
    if (a === 0) return t.rmdir(e, r);
    i.forEach((o) => {
      xs(Gc.join(e, o), t, (l) => {
        if (!s) {
          if (l) return r(s = l);
          --a === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function qc(e, t) {
  let r;
  t = t || {}, Hc(t), ee(e, "rimraf: missing path"), ee.strictEqual(typeof e, "string", "rimraf: path should be a string"), ee(t, "rimraf: missing options"), ee.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Jr && _o(e, t, n);
  }
  try {
    r && r.isDirectory() ? ii(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Jr ? _o(e, t, n) : ii(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    ii(e, t, n);
  }
}
function ii(e, t, r) {
  ee(e), ee(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      Oh(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Oh(e, t) {
  if (ee(e), ee(t), t.readdirSync(e).forEach((r) => qc(Gc.join(e, r), t)), Jr) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var Dh = xs;
xs.sync = qc;
const ci = Ne, Ph = ke.fromCallback, Xc = Dh;
function kh(e, t) {
  if (ci.rm) return ci.rm(e, { recursive: !0, force: !0 }, t);
  Xc(e, t);
}
function Nh(e) {
  if (ci.rmSync) return ci.rmSync(e, { recursive: !0, force: !0 });
  Xc.sync(e);
}
var Ai = {
  remove: Ph(kh),
  removeSync: Nh
};
const Fh = ke.fromPromise, Wc = Zt, Vc = oe, Yc = ot, Kc = Ai, bo = Fh(async function(t) {
  let r;
  try {
    r = await Wc.readdir(t);
  } catch {
    return Yc.mkdirs(t);
  }
  return Promise.all(r.map((n) => Kc.remove(Vc.join(t, n))));
});
function So(e) {
  let t;
  try {
    t = Wc.readdirSync(e);
  } catch {
    return Yc.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = Vc.join(e, r), Kc.removeSync(r);
  });
}
var $h = {
  emptyDirSync: So,
  emptydirSync: So,
  emptyDir: bo,
  emptydir: bo
};
const Lh = ke.fromCallback, Jc = oe, Tt = Ne, Qc = ot;
function Uh(e, t) {
  function r() {
    Tt.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  Tt.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const a = Jc.dirname(e);
    Tt.stat(a, (s, o) => {
      if (s)
        return s.code === "ENOENT" ? Qc.mkdirs(a, (l) => {
          if (l) return t(l);
          r();
        }) : t(s);
      o.isDirectory() ? r() : Tt.readdir(a, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Mh(e) {
  let t;
  try {
    t = Tt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = Jc.dirname(e);
  try {
    Tt.statSync(r).isDirectory() || Tt.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") Qc.mkdirsSync(r);
    else throw n;
  }
  Tt.writeFileSync(e, "");
}
var Bh = {
  createFile: Lh(Uh),
  createFileSync: Mh
};
const zh = ke.fromCallback, Zc = oe, vt = Ne, eu = ot, jh = er.pathExists, { areIdentical: tu } = Sr;
function Gh(e, t, r) {
  function n(i, a) {
    vt.link(i, a, (s) => {
      if (s) return r(s);
      r(null);
    });
  }
  vt.lstat(t, (i, a) => {
    vt.lstat(e, (s, o) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), r(s);
      if (a && tu(o, a)) return r(null);
      const l = Zc.dirname(t);
      jh(l, (d, c) => {
        if (d) return r(d);
        if (c) return n(e, t);
        eu.mkdirs(l, (u) => {
          if (u) return r(u);
          n(e, t);
        });
      });
    });
  });
}
function Hh(e, t) {
  let r;
  try {
    r = vt.lstatSync(t);
  } catch {
  }
  try {
    const a = vt.lstatSync(e);
    if (r && tu(a, r)) return;
  } catch (a) {
    throw a.message = a.message.replace("lstat", "ensureLink"), a;
  }
  const n = Zc.dirname(t);
  return vt.existsSync(n) || eu.mkdirsSync(n), vt.linkSync(e, t);
}
var qh = {
  createLink: zh(Gh),
  createLinkSync: Hh
};
const _t = oe, Gr = Ne, Xh = er.pathExists;
function Wh(e, t, r) {
  if (_t.isAbsolute(e))
    return Gr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = _t.dirname(t), i = _t.join(n, e);
    return Xh(i, (a, s) => a ? r(a) : s ? r(null, {
      toCwd: i,
      toDst: e
    }) : Gr.lstat(e, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), r(o)) : r(null, {
      toCwd: e,
      toDst: _t.relative(n, e)
    })));
  }
}
function Vh(e, t) {
  let r;
  if (_t.isAbsolute(e)) {
    if (r = Gr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = _t.dirname(t), i = _t.join(n, e);
    if (r = Gr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Gr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: _t.relative(n, e)
    };
  }
}
var Yh = {
  symlinkPaths: Wh,
  symlinkPathsSync: Vh
};
const ru = Ne;
function Kh(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  ru.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function Jh(e, t) {
  let r;
  if (t) return t;
  try {
    r = ru.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Qh = {
  symlinkType: Kh,
  symlinkTypeSync: Jh
};
const Zh = ke.fromCallback, nu = oe, Ke = Zt, iu = ot, em = iu.mkdirs, tm = iu.mkdirsSync, au = Yh, rm = au.symlinkPaths, nm = au.symlinkPathsSync, su = Qh, im = su.symlinkType, am = su.symlinkTypeSync, sm = er.pathExists, { areIdentical: ou } = Sr;
function om(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Ke.lstat(t, (i, a) => {
    !i && a.isSymbolicLink() ? Promise.all([
      Ke.stat(e),
      Ke.stat(t)
    ]).then(([s, o]) => {
      if (ou(s, o)) return n(null);
      Ao(e, t, r, n);
    }) : Ao(e, t, r, n);
  });
}
function Ao(e, t, r, n) {
  rm(e, t, (i, a) => {
    if (i) return n(i);
    e = a.toDst, im(a.toCwd, r, (s, o) => {
      if (s) return n(s);
      const l = nu.dirname(t);
      sm(l, (d, c) => {
        if (d) return n(d);
        if (c) return Ke.symlink(e, t, o, n);
        em(l, (u) => {
          if (u) return n(u);
          Ke.symlink(e, t, o, n);
        });
      });
    });
  });
}
function lm(e, t, r) {
  let n;
  try {
    n = Ke.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const o = Ke.statSync(e), l = Ke.statSync(t);
    if (ou(o, l)) return;
  }
  const i = nm(e, t);
  e = i.toDst, r = am(i.toCwd, r);
  const a = nu.dirname(t);
  return Ke.existsSync(a) || tm(a), Ke.symlinkSync(e, t, r);
}
var cm = {
  createSymlink: Zh(om),
  createSymlinkSync: lm
};
const { createFile: Io, createFileSync: Co } = Bh, { createLink: Ro, createLinkSync: Oo } = qh, { createSymlink: Do, createSymlinkSync: Po } = cm;
var um = {
  // file
  createFile: Io,
  createFileSync: Co,
  ensureFile: Io,
  ensureFileSync: Co,
  // link
  createLink: Ro,
  createLinkSync: Oo,
  ensureLink: Ro,
  ensureLinkSync: Oo,
  // symlink
  createSymlink: Do,
  createSymlinkSync: Po,
  ensureSymlink: Do,
  ensureSymlinkSync: Po
};
function fm(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const a = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + a;
}
function dm(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var ws = { stringify: fm, stripBom: dm };
let vr;
try {
  vr = Ne;
} catch {
  vr = Dt;
}
const Ii = ke, { stringify: lu, stripBom: cu } = ws;
async function pm(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || vr, n = "throws" in t ? t.throws : !0;
  let i = await Ii.fromCallback(r.readFile)(e, t);
  i = cu(i);
  let a;
  try {
    a = JSON.parse(i, t ? t.reviver : null);
  } catch (s) {
    if (n)
      throw s.message = `${e}: ${s.message}`, s;
    return null;
  }
  return a;
}
const hm = Ii.fromPromise(pm);
function mm(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || vr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = cu(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function gm(e, t, r = {}) {
  const n = r.fs || vr, i = lu(t, r);
  await Ii.fromCallback(n.writeFile)(e, i, r);
}
const ym = Ii.fromPromise(gm);
function xm(e, t, r = {}) {
  const n = r.fs || vr, i = lu(t, r);
  return n.writeFileSync(e, i, r);
}
var wm = {
  readFile: hm,
  readFileSync: mm,
  writeFile: ym,
  writeFileSync: xm
};
const Fn = wm;
var Em = {
  // jsonfile exports
  readJson: Fn.readFile,
  readJsonSync: Fn.readFileSync,
  writeJson: Fn.writeFile,
  writeJsonSync: Fn.writeFileSync
};
const vm = ke.fromCallback, Hr = Ne, uu = oe, fu = ot, Tm = er.pathExists;
function _m(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = uu.dirname(e);
  Tm(i, (a, s) => {
    if (a) return n(a);
    if (s) return Hr.writeFile(e, t, r, n);
    fu.mkdirs(i, (o) => {
      if (o) return n(o);
      Hr.writeFile(e, t, r, n);
    });
  });
}
function bm(e, ...t) {
  const r = uu.dirname(e);
  if (Hr.existsSync(r))
    return Hr.writeFileSync(e, ...t);
  fu.mkdirsSync(r), Hr.writeFileSync(e, ...t);
}
var Es = {
  outputFile: vm(_m),
  outputFileSync: bm
};
const { stringify: Sm } = ws, { outputFile: Am } = Es;
async function Im(e, t, r = {}) {
  const n = Sm(t, r);
  await Am(e, n, r);
}
var Cm = Im;
const { stringify: Rm } = ws, { outputFileSync: Om } = Es;
function Dm(e, t, r) {
  const n = Rm(t, r);
  Om(e, n, r);
}
var Pm = Dm;
const km = ke.fromPromise, Pe = Em;
Pe.outputJson = km(Cm);
Pe.outputJsonSync = Pm;
Pe.outputJSON = Pe.outputJson;
Pe.outputJSONSync = Pe.outputJsonSync;
Pe.writeJSON = Pe.writeJson;
Pe.writeJSONSync = Pe.writeJsonSync;
Pe.readJSON = Pe.readJson;
Pe.readJSONSync = Pe.readJsonSync;
var Nm = Pe;
const Fm = Ne, za = oe, $m = ys.copy, du = Ai.remove, Lm = ot.mkdirp, Um = er.pathExists, ko = Sr;
function Mm(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  ko.checkPaths(e, t, "move", r, (a, s) => {
    if (a) return n(a);
    const { srcStat: o, isChangingCase: l = !1 } = s;
    ko.checkParentPaths(e, o, t, "move", (d) => {
      if (d) return n(d);
      if (Bm(t)) return No(e, t, i, l, n);
      Lm(za.dirname(t), (c) => c ? n(c) : No(e, t, i, l, n));
    });
  });
}
function Bm(e) {
  const t = za.dirname(e);
  return za.parse(t).root === t;
}
function No(e, t, r, n, i) {
  if (n) return oa(e, t, r, i);
  if (r)
    return du(t, (a) => a ? i(a) : oa(e, t, r, i));
  Um(t, (a, s) => a ? i(a) : s ? i(new Error("dest already exists.")) : oa(e, t, r, i));
}
function oa(e, t, r, n) {
  Fm.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : zm(e, t, r, n) : n());
}
function zm(e, t, r, n) {
  $m(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (a) => a ? n(a) : du(e, n));
}
var jm = Mm;
const pu = Ne, ja = oe, Gm = ys.copySync, hu = Ai.removeSync, Hm = ot.mkdirpSync, Fo = Sr;
function qm(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: a = !1 } = Fo.checkPathsSync(e, t, "move", r);
  return Fo.checkParentPathsSync(e, i, t, "move"), Xm(t) || Hm(ja.dirname(t)), Wm(e, t, n, a);
}
function Xm(e) {
  const t = ja.dirname(e);
  return ja.parse(t).root === t;
}
function Wm(e, t, r, n) {
  if (n) return la(e, t, r);
  if (r)
    return hu(t), la(e, t, r);
  if (pu.existsSync(t)) throw new Error("dest already exists.");
  return la(e, t, r);
}
function la(e, t, r) {
  try {
    pu.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Vm(e, t, r);
  }
}
function Vm(e, t, r) {
  return Gm(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), hu(e);
}
var Ym = qm;
const Km = ke.fromCallback;
var Jm = {
  move: Km(jm),
  moveSync: Ym
}, Pt = {
  // Export promiseified graceful-fs:
  ...Zt,
  // Export extra methods:
  ...ys,
  ...$h,
  ...um,
  ...Nm,
  ...ot,
  ...Jm,
  ...Es,
  ...er,
  ...Ai
}, pt = {}, At = {}, xe = {}, It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
It.CancellationError = It.CancellationToken = void 0;
const Qm = bc;
class Zm extends Qm.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new Ga());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, a) => {
      let s = null;
      if (n = () => {
        try {
          s != null && (s(), s = null);
        } finally {
          a(new Ga());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, a, (o) => {
        s = o;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
It.CancellationToken = Zm;
class Ga extends Error {
  constructor() {
    super("cancelled");
  }
}
It.CancellationError = Ga;
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.newError = e0;
function e0(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var De = {}, Ha = { exports: {} }, $n = { exports: {} }, ca, $o;
function t0() {
  if ($o) return ca;
  $o = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, a = n * 365.25;
  ca = function(c, u) {
    u = u || {};
    var p = typeof c;
    if (p === "string" && c.length > 0)
      return s(c);
    if (p === "number" && isFinite(c))
      return u.long ? l(c) : o(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function s(c) {
    if (c = String(c), !(c.length > 100)) {
      var u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (u) {
        var p = parseFloat(u[1]), g = (u[2] || "ms").toLowerCase();
        switch (g) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return p * a;
          case "weeks":
          case "week":
          case "w":
            return p * i;
          case "days":
          case "day":
          case "d":
            return p * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return p * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return p * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return p * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return p;
          default:
            return;
        }
      }
    }
  }
  function o(c) {
    var u = Math.abs(c);
    return u >= n ? Math.round(c / n) + "d" : u >= r ? Math.round(c / r) + "h" : u >= t ? Math.round(c / t) + "m" : u >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var u = Math.abs(c);
    return u >= n ? d(c, u, n, "day") : u >= r ? d(c, u, r, "hour") : u >= t ? d(c, u, t, "minute") : u >= e ? d(c, u, e, "second") : c + " ms";
  }
  function d(c, u, p, g) {
    var w = u >= p * 1.5;
    return Math.round(c / p) + " " + g + (w ? "s" : "");
  }
  return ca;
}
var ua, Lo;
function mu() {
  if (Lo) return ua;
  Lo = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = d, n.disable = o, n.enable = a, n.enabled = l, n.humanize = t0(), n.destroy = c, Object.keys(t).forEach((u) => {
      n[u] = t[u];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(u) {
      let p = 0;
      for (let g = 0; g < u.length; g++)
        p = (p << 5) - p + u.charCodeAt(g), p |= 0;
      return n.colors[Math.abs(p) % n.colors.length];
    }
    n.selectColor = r;
    function n(u) {
      let p, g = null, w, x;
      function T(..._) {
        if (!T.enabled)
          return;
        const b = T, N = Number(/* @__PURE__ */ new Date()), $ = N - (p || N);
        b.diff = $, b.prev = p, b.curr = N, p = N, _[0] = n.coerce(_[0]), typeof _[0] != "string" && _.unshift("%O");
        let ie = 0;
        _[0] = _[0].replace(/%([a-zA-Z%])/g, (Y, Me) => {
          if (Y === "%%")
            return "%";
          ie++;
          const y = n.formatters[Me];
          if (typeof y == "function") {
            const q = _[ie];
            Y = y.call(b, q), _.splice(ie, 1), ie--;
          }
          return Y;
        }), n.formatArgs.call(b, _), (b.log || n.log).apply(b, _);
      }
      return T.namespace = u, T.useColors = n.useColors(), T.color = n.selectColor(u), T.extend = i, T.destroy = n.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (w !== n.namespaces && (w = n.namespaces, x = n.enabled(u)), x),
        set: (_) => {
          g = _;
        }
      }), typeof n.init == "function" && n.init(T), T;
    }
    function i(u, p) {
      const g = n(this.namespace + (typeof p > "u" ? ":" : p) + u);
      return g.log = this.log, g;
    }
    function a(u) {
      n.save(u), n.namespaces = u, n.names = [], n.skips = [];
      const p = (typeof u == "string" ? u : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const g of p)
        g[0] === "-" ? n.skips.push(g.slice(1)) : n.names.push(g);
    }
    function s(u, p) {
      let g = 0, w = 0, x = -1, T = 0;
      for (; g < u.length; )
        if (w < p.length && (p[w] === u[g] || p[w] === "*"))
          p[w] === "*" ? (x = w, T = g, w++) : (g++, w++);
        else if (x !== -1)
          w = x + 1, T++, g = T;
        else
          return !1;
      for (; w < p.length && p[w] === "*"; )
        w++;
      return w === p.length;
    }
    function o() {
      const u = [
        ...n.names,
        ...n.skips.map((p) => "-" + p)
      ].join(",");
      return n.enable(""), u;
    }
    function l(u) {
      for (const p of n.skips)
        if (s(u, p))
          return !1;
      for (const p of n.names)
        if (s(u, p))
          return !0;
      return !1;
    }
    function d(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return ua = e, ua;
}
var Uo;
function r0() {
  return Uo || (Uo = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = a, t.useColors = r, t.storage = s(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const d = "color: " + this.color;
      l.splice(1, 0, d, "color: inherit");
      let c = 0, u = 0;
      l[0].replace(/%[a-zA-Z%]/g, (p) => {
        p !== "%%" && (c++, p === "%c" && (u = c));
      }), l.splice(u, 0, d);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function a() {
      let l;
      try {
        l = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function s() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = mu()(t);
    const { formatters: o } = e.exports;
    o.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (d) {
        return "[UnexpectedJSONParseError]: " + d.message;
      }
    };
  }($n, $n.exports)), $n.exports;
}
var Ln = { exports: {} }, fa, Mo;
function n0() {
  return Mo || (Mo = 1, fa = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), fa;
}
var da, Bo;
function i0() {
  if (Bo) return da;
  Bo = 1;
  const e = _i, t = Sc, r = n0(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function a(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function s(l, d) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (l && !d && i === void 0)
      return 0;
    const c = i || 0;
    if (n.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const u = e.release().split(".");
      return Number(u[0]) >= 10 && Number(u[2]) >= 10586 ? Number(u[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((u) => u in n) || n.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const u = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return u >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : c;
  }
  function o(l) {
    const d = s(l, l && l.isTTY);
    return a(d);
  }
  return da = {
    supportsColor: o,
    stdout: a(s(!0, t.isatty(1))),
    stderr: a(s(!0, t.isatty(2)))
  }, da;
}
var zo;
function a0() {
  return zo || (zo = 1, function(e, t) {
    const r = Sc, n = fs;
    t.init = c, t.log = o, t.formatArgs = a, t.save = l, t.load = d, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const p = i0();
      p && (p.stderr || p).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((p) => /^debug_/i.test(p)).reduce((p, g) => {
      const w = g.substring(6).toLowerCase().replace(/_([a-z])/g, (T, _) => _.toUpperCase());
      let x = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(x) ? x = !0 : /^(no|off|false|disabled)$/i.test(x) ? x = !1 : x === "null" ? x = null : x = Number(x), p[w] = x, p;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function a(p) {
      const { namespace: g, useColors: w } = this;
      if (w) {
        const x = this.color, T = "\x1B[3" + (x < 8 ? x : "8;5;" + x), _ = `  ${T};1m${g} \x1B[0m`;
        p[0] = _ + p[0].split(`
`).join(`
` + _), p.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        p[0] = s() + g + " " + p[0];
    }
    function s() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function o(...p) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...p) + `
`);
    }
    function l(p) {
      p ? process.env.DEBUG = p : delete process.env.DEBUG;
    }
    function d() {
      return process.env.DEBUG;
    }
    function c(p) {
      p.inspectOpts = {};
      const g = Object.keys(t.inspectOpts);
      for (let w = 0; w < g.length; w++)
        p.inspectOpts[g[w]] = t.inspectOpts[g[w]];
    }
    e.exports = mu()(t);
    const { formatters: u } = e.exports;
    u.o = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, u.O = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts);
    };
  }(Ln, Ln.exports)), Ln.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Ha.exports = r0() : Ha.exports = a0();
var gu = Ha.exports;
const Ir = /* @__PURE__ */ vp(gu);
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.ProgressCallbackTransform = void 0;
const s0 = cn;
class o0 extends s0.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
dn.ProgressCallbackTransform = o0;
Object.defineProperty(De, "__esModule", { value: !0 });
De.DigestTransform = De.HttpExecutor = De.HttpError = void 0;
De.createHttpError = qa;
De.parseJson = m0;
De.configureRequestOptionsFromUrl = xu;
De.configureRequestUrl = Ts;
De.safeGetHeader = wr;
De.configureRequestOptions = fi;
De.safeStringifyJson = di;
const l0 = un, c0 = gu, u0 = Dt, f0 = cn, yu = br, d0 = It, jo = Ar, p0 = dn, Fr = (0, c0.default)("electron-builder");
function qa(e, t = null) {
  return new vs(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + di(e.headers), t);
}
const h0 = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class vs extends Error {
  constructor(t, r = `HTTP error: ${h0.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
De.HttpError = vs;
function m0(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class ui {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new d0.CancellationToken(), n) {
    fi(t);
    const i = n == null ? void 0 : JSON.stringify(n), a = i ? Buffer.from(i) : void 0;
    if (a != null) {
      Fr(i);
      const { headers: s, ...o } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": a.length,
          ...s
        },
        ...o
      };
    }
    return this.doApiRequest(t, r, (s) => s.end(a));
  }
  doApiRequest(t, r, n, i = 0) {
    return Fr.enabled && Fr(`Request: ${di(t)}`), r.createPromise((a, s, o) => {
      const l = this.createRequest(t, (d) => {
        try {
          this.handleResponse(d, t, r, a, s, i, n);
        } catch (c) {
          s(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, s, t.timeout), this.addRedirectHandlers(l, t, s, i, (d) => {
        this.doApiRequest(d, r, n, i).then(a).catch(s);
      }), n(l, s), o(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, a) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, a, s, o) {
    var l;
    if (Fr.enabled && Fr(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${di(r)}`), t.statusCode === 404) {
      a(qa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const d = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = d >= 300 && d < 400, u = wr(t, "location");
    if (c && u != null) {
      if (s > this.maxRedirects) {
        a(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(ui.prepareRedirectUrlOptions(u, r), n, o, s).then(i).catch(a);
      return;
    }
    t.setEncoding("utf8");
    let p = "";
    t.on("error", a), t.on("data", (g) => p += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = wr(t, "content-type"), w = g != null && (Array.isArray(g) ? g.find((x) => x.includes("json")) != null : g.includes("json"));
          a(qa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${w ? JSON.stringify(JSON.parse(p)) : p}
          `));
        } else
          i(p.length === 0 ? null : p);
      } catch (g) {
        a(g);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, a) => {
      const s = [], o = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Ts(t, o), fi(o), this.doDownload(o, {
        destination: null,
        options: r,
        onCancel: a,
        callback: (l) => {
          l == null ? n(Buffer.concat(s)) : i(l);
        },
        responseHandler: (l, d) => {
          let c = 0;
          l.on("data", (u) => {
            if (c += u.length, c > 524288e3) {
              d(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            s.push(u);
          }), l.on("end", () => {
            d(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (a) => {
      if (a.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${a.statusCode}: ${a.statusMessage}`));
        return;
      }
      a.on("error", r.callback);
      const s = wr(a, "location");
      if (s != null) {
        n < this.maxRedirects ? this.doDownload(ui.prepareRedirectUrlOptions(s, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? y0(r, a) : r.responseHandler(a, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (a) => {
      this.doDownload(a, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = xu(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const a = new yu.URL(t);
      (a.hostname.endsWith(".amazonaws.com") || a.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof vs && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
De.HttpExecutor = ui;
function xu(e, t) {
  const r = fi(t);
  return Ts(new yu.URL(e), r), r;
}
function Ts(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Xa extends f0.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, l0.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, jo.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, jo.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
De.DigestTransform = Xa;
function g0(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function wr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function y0(e, t) {
  if (!g0(wr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const s = wr(t, "content-length");
    s != null && r.push(new p0.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Xa(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Xa(e.options.sha2, "sha256", "hex"));
  const i = (0, u0.createWriteStream)(e.destination);
  r.push(i);
  let a = t;
  for (const s of r)
    s.on("error", (o) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(o);
    }), a = a.pipe(s);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function fi(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function di(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.MemoLazy = void 0;
class x0 {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && wu(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
Ci.MemoLazy = x0;
function wu(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), a = Object.keys(t);
    return i.length === a.length && i.every((s) => wu(e[s], t[s]));
  }
  return e === t;
}
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.githubUrl = w0;
Ri.getS3LikeProviderBaseUrl = E0;
function w0(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function E0(e) {
  const t = e.provider;
  if (t === "s3")
    return v0(e);
  if (t === "spaces")
    return T0(e);
  throw new Error(`Not supported provider: ${t}`);
}
function v0(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return Eu(t, e.path);
}
function Eu(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function T0(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Eu(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.retry = vu;
const _0 = It;
async function vu(e, t, r, n = 0, i = 0, a) {
  var s;
  const o = new _0.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((s = a == null ? void 0 : a(l)) !== null && s !== void 0) || s) && t > 0 && !o.cancelled)
      return await new Promise((d) => setTimeout(d, r + n * i)), await vu(e, t - 1, r, n, i + 1, a);
    throw l;
  }
}
var bs = {};
Object.defineProperty(bs, "__esModule", { value: !0 });
bs.parseDn = b0;
function b0(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const a = /* @__PURE__ */ new Map();
  for (let s = 0; s <= e.length; s++) {
    if (s === e.length) {
      r !== null && a.set(r, n);
      break;
    }
    const o = e[s];
    if (t) {
      if (o === '"') {
        t = !1;
        continue;
      }
    } else {
      if (o === '"') {
        t = !0;
        continue;
      }
      if (o === "\\") {
        s++;
        const l = parseInt(e.slice(s, s + 2), 16);
        Number.isNaN(l) ? n += e[s] : (s++, n += String.fromCharCode(l));
        continue;
      }
      if (r === null && o === "=") {
        r = n, n = "";
        continue;
      }
      if (o === "," || o === ";" || o === "+") {
        r !== null && a.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (o === " " && !t) {
      if (n.length === 0)
        continue;
      if (s > i) {
        let l = s;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        s = i - 1;
        continue;
      }
    }
    n += o;
  }
  return a;
}
var Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.nil = Tr.UUID = void 0;
const Tu = un, _u = Ar, S0 = "options.name must be either a string or a Buffer", Go = (0, Tu.randomBytes)(16);
Go[0] = Go[0] | 1;
const ai = {}, V = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  ai[t] = e, V[e] = t;
}
class Jt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Jt.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return A0(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = I0(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (ai[t[14] + t[15]] & 240) >> 4,
        variant: Ho((ai[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: Ho((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, _u.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = ai[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
Tr.UUID = Jt;
Jt.OID = Jt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Ho(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var qr;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(qr || (qr = {}));
function A0(e, t, r, n, i = qr.ASCII) {
  const a = (0, Tu.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, _u.newError)(S0, "ERR_INVALID_UUID_NAME");
  a.update(n), a.update(e);
  const o = a.digest();
  let l;
  switch (i) {
    case qr.BINARY:
      o[6] = o[6] & 15 | r, o[8] = o[8] & 63 | 128, l = o;
      break;
    case qr.OBJECT:
      o[6] = o[6] & 15 | r, o[8] = o[8] & 63 | 128, l = new Jt(o);
      break;
    default:
      l = V[o[0]] + V[o[1]] + V[o[2]] + V[o[3]] + "-" + V[o[4]] + V[o[5]] + "-" + V[o[6] & 15 | r] + V[o[7]] + "-" + V[o[8] & 63 | 128] + V[o[9]] + "-" + V[o[10]] + V[o[11]] + V[o[12]] + V[o[13]] + V[o[14]] + V[o[15]];
      break;
  }
  return l;
}
function I0(e) {
  return V[e[0]] + V[e[1]] + V[e[2]] + V[e[3]] + "-" + V[e[4]] + V[e[5]] + "-" + V[e[6]] + V[e[7]] + "-" + V[e[8]] + V[e[9]] + "-" + V[e[10]] + V[e[11]] + V[e[12]] + V[e[13]] + V[e[14]] + V[e[15]];
}
Tr.nil = new Jt("00000000-0000-0000-0000-000000000000");
var pn = {}, bu = {};
(function(e) {
  (function(t) {
    t.parser = function(h, f) {
      return new n(h, f);
    }, t.SAXParser = n, t.SAXStream = c, t.createStream = d, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(h, f) {
      if (!(this instanceof n))
        return new n(h, f);
      var S = this;
      a(S), S.q = S.c = "", S.bufferCheckPosition = t.MAX_BUFFER_LENGTH, S.opt = f || {}, S.opt.lowercase = S.opt.lowercase || S.opt.lowercasetags, S.looseCase = S.opt.lowercase ? "toLowerCase" : "toUpperCase", S.tags = [], S.closed = S.closedRoot = S.sawRoot = !1, S.tag = S.error = null, S.strict = !!h, S.noscript = !!(h || S.opt.noscript), S.state = y.BEGIN, S.strictEntities = S.opt.strictEntities, S.ENTITIES = S.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), S.attribList = [], S.opt.xmlns && (S.ns = Object.create(x)), S.opt.unquotedAttributeValues === void 0 && (S.opt.unquotedAttributeValues = !h), S.trackPosition = S.opt.position !== !1, S.trackPosition && (S.position = S.line = S.column = 0), z(S, "onready");
    }
    Object.create || (Object.create = function(h) {
      function f() {
      }
      f.prototype = h;
      var S = new f();
      return S;
    }), Object.keys || (Object.keys = function(h) {
      var f = [];
      for (var S in h) h.hasOwnProperty(S) && f.push(S);
      return f;
    });
    function i(h) {
      for (var f = Math.max(t.MAX_BUFFER_LENGTH, 10), S = 0, v = 0, K = r.length; v < K; v++) {
        var re = h[r[v]].length;
        if (re > f)
          switch (r[v]) {
            case "textNode":
              Q(h);
              break;
            case "cdata":
              B(h, "oncdata", h.cdata), h.cdata = "";
              break;
            case "script":
              B(h, "onscript", h.script), h.script = "";
              break;
            default:
              I(h, "Max buffer length exceeded: " + r[v]);
          }
        S = Math.max(S, re);
      }
      var le = t.MAX_BUFFER_LENGTH - S;
      h.bufferCheckPosition = le + h.position;
    }
    function a(h) {
      for (var f = 0, S = r.length; f < S; f++)
        h[r[f]] = "";
    }
    function s(h) {
      Q(h), h.cdata !== "" && (B(h, "oncdata", h.cdata), h.cdata = ""), h.script !== "" && (B(h, "onscript", h.script), h.script = "");
    }
    n.prototype = {
      end: function() {
        D(this);
      },
      write: et,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        s(this);
      }
    };
    var o;
    try {
      o = require("stream").Stream;
    } catch {
      o = function() {
      };
    }
    o || (o = function() {
    });
    var l = t.EVENTS.filter(function(h) {
      return h !== "error" && h !== "end";
    });
    function d(h, f) {
      return new c(h, f);
    }
    function c(h, f) {
      if (!(this instanceof c))
        return new c(h, f);
      o.apply(this), this._parser = new n(h, f), this.writable = !0, this.readable = !0;
      var S = this;
      this._parser.onend = function() {
        S.emit("end");
      }, this._parser.onerror = function(v) {
        S.emit("error", v), S._parser.error = null;
      }, this._decoder = null, l.forEach(function(v) {
        Object.defineProperty(S, "on" + v, {
          get: function() {
            return S._parser["on" + v];
          },
          set: function(K) {
            if (!K)
              return S.removeAllListeners(v), S._parser["on" + v] = K, K;
            S.on(v, K);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(o.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype.write = function(h) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(h)) {
        if (!this._decoder) {
          var f = yp.StringDecoder;
          this._decoder = new f("utf8");
        }
        h = this._decoder.write(h);
      }
      return this._parser.write(h.toString()), this.emit("data", h), !0;
    }, c.prototype.end = function(h) {
      return h && h.length && this.write(h), this._parser.end(), !0;
    }, c.prototype.on = function(h, f) {
      var S = this;
      return !S._parser["on" + h] && l.indexOf(h) !== -1 && (S._parser["on" + h] = function() {
        var v = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        v.splice(0, 0, h), S.emit.apply(S, v);
      }), o.prototype.on.call(S, h, f);
    };
    var u = "[CDATA[", p = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", w = "http://www.w3.org/2000/xmlns/", x = { xml: g, xmlns: w }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, _ = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, b = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, N = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function $(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function ie(h) {
      return h === '"' || h === "'";
    }
    function ue(h) {
      return h === ">" || $(h);
    }
    function Y(h, f) {
      return h.test(f);
    }
    function Me(h, f) {
      return !Y(h, f);
    }
    var y = 0;
    t.STATE = {
      BEGIN: y++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: y++,
      // leading whitespace
      TEXT: y++,
      // general stuff
      TEXT_ENTITY: y++,
      // &amp and such.
      OPEN_WAKA: y++,
      // <
      SGML_DECL: y++,
      // <!BLARG
      SGML_DECL_QUOTED: y++,
      // <!BLARG foo "bar
      DOCTYPE: y++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: y++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: y++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: y++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: y++,
      // <!-
      COMMENT: y++,
      // <!--
      COMMENT_ENDING: y++,
      // <!-- blah -
      COMMENT_ENDED: y++,
      // <!-- blah --
      CDATA: y++,
      // <![CDATA[ something
      CDATA_ENDING: y++,
      // ]
      CDATA_ENDING_2: y++,
      // ]]
      PROC_INST: y++,
      // <?hi
      PROC_INST_BODY: y++,
      // <?hi there
      PROC_INST_ENDING: y++,
      // <?hi "there" ?
      OPEN_TAG: y++,
      // <strong
      OPEN_TAG_SLASH: y++,
      // <strong /
      ATTRIB: y++,
      // <a
      ATTRIB_NAME: y++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: y++,
      // <a foo _
      ATTRIB_VALUE: y++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: y++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: y++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: y++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: y++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: y++,
      // <foo bar=&quot
      CLOSE_TAG: y++,
      // </a
      CLOSE_TAG_SAW_WHITE: y++,
      // </a   >
      SCRIPT: y++,
      // <script> ...
      SCRIPT_ENDING: y++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(h) {
      var f = t.ENTITIES[h], S = typeof f == "number" ? String.fromCharCode(f) : f;
      t.ENTITIES[h] = S;
    });
    for (var q in t.STATE)
      t.STATE[t.STATE[q]] = q;
    y = t.STATE;
    function z(h, f, S) {
      h[f] && h[f](S);
    }
    function B(h, f, S) {
      h.textNode && Q(h), z(h, f, S);
    }
    function Q(h) {
      h.textNode = R(h.opt, h.textNode), h.textNode && z(h, "ontext", h.textNode), h.textNode = "";
    }
    function R(h, f) {
      return h.trim && (f = f.trim()), h.normalize && (f = f.replace(/\s+/g, " ")), f;
    }
    function I(h, f) {
      return Q(h), h.trackPosition && (f += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), f = new Error(f), h.error = f, z(h, "onerror", f), h;
    }
    function D(h) {
      return h.sawRoot && !h.closedRoot && A(h, "Unclosed root tag"), h.state !== y.BEGIN && h.state !== y.BEGIN_WHITESPACE && h.state !== y.TEXT && I(h, "Unexpected end"), Q(h), h.c = "", h.closed = !0, z(h, "onend"), n.call(h, h.strict, h.opt), h;
    }
    function A(h, f) {
      if (typeof h != "object" || !(h instanceof n))
        throw new Error("bad call to strictFail");
      h.strict && I(h, f);
    }
    function k(h) {
      h.strict || (h.tagName = h.tagName[h.looseCase]());
      var f = h.tags[h.tags.length - 1] || h, S = h.tag = { name: h.tagName, attributes: {} };
      h.opt.xmlns && (S.ns = f.ns), h.attribList.length = 0, B(h, "onopentagstart", S);
    }
    function O(h, f) {
      var S = h.indexOf(":"), v = S < 0 ? ["", h] : h.split(":"), K = v[0], re = v[1];
      return f && h === "xmlns" && (K = "xmlns", re = ""), { prefix: K, local: re };
    }
    function M(h) {
      if (h.strict || (h.attribName = h.attribName[h.looseCase]()), h.attribList.indexOf(h.attribName) !== -1 || h.tag.attributes.hasOwnProperty(h.attribName)) {
        h.attribName = h.attribValue = "";
        return;
      }
      if (h.opt.xmlns) {
        var f = O(h.attribName, !0), S = f.prefix, v = f.local;
        if (S === "xmlns")
          if (v === "xml" && h.attribValue !== g)
            A(
              h,
              "xml: prefix must be bound to " + g + `
Actual: ` + h.attribValue
            );
          else if (v === "xmlns" && h.attribValue !== w)
            A(
              h,
              "xmlns: prefix must be bound to " + w + `
Actual: ` + h.attribValue
            );
          else {
            var K = h.tag, re = h.tags[h.tags.length - 1] || h;
            K.ns === re.ns && (K.ns = Object.create(re.ns)), K.ns[v] = h.attribValue;
          }
        h.attribList.push([h.attribName, h.attribValue]);
      } else
        h.tag.attributes[h.attribName] = h.attribValue, B(h, "onattribute", {
          name: h.attribName,
          value: h.attribValue
        });
      h.attribName = h.attribValue = "";
    }
    function X(h, f) {
      if (h.opt.xmlns) {
        var S = h.tag, v = O(h.tagName);
        S.prefix = v.prefix, S.local = v.local, S.uri = S.ns[v.prefix] || "", S.prefix && !S.uri && (A(
          h,
          "Unbound namespace prefix: " + JSON.stringify(h.tagName)
        ), S.uri = v.prefix);
        var K = h.tags[h.tags.length - 1] || h;
        S.ns && K.ns !== S.ns && Object.keys(S.ns).forEach(function(bn) {
          B(h, "onopennamespace", {
            prefix: bn,
            uri: S.ns[bn]
          });
        });
        for (var re = 0, le = h.attribList.length; re < le; re++) {
          var we = h.attribList[re], _e = we[0], ht = we[1], de = O(_e, !0), Ve = de.prefix, Ki = de.local, _n = Ve === "" ? "" : S.ns[Ve] || "", Or = {
            name: _e,
            value: ht,
            prefix: Ve,
            local: Ki,
            uri: _n
          };
          Ve && Ve !== "xmlns" && !_n && (A(
            h,
            "Unbound namespace prefix: " + JSON.stringify(Ve)
          ), Or.uri = Ve), h.tag.attributes[_e] = Or, B(h, "onattribute", Or);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!f, h.sawRoot = !0, h.tags.push(h.tag), B(h, "onopentag", h.tag), f || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = y.SCRIPT : h.state = y.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function j(h) {
      if (!h.tagName) {
        A(h, "Weird empty close tag."), h.textNode += "</>", h.state = y.TEXT;
        return;
      }
      if (h.script) {
        if (h.tagName !== "script") {
          h.script += "</" + h.tagName + ">", h.tagName = "", h.state = y.SCRIPT;
          return;
        }
        B(h, "onscript", h.script), h.script = "";
      }
      var f = h.tags.length, S = h.tagName;
      h.strict || (S = S[h.looseCase]());
      for (var v = S; f--; ) {
        var K = h.tags[f];
        if (K.name !== v)
          A(h, "Unexpected close tag");
        else
          break;
      }
      if (f < 0) {
        A(h, "Unmatched closing tag: " + h.tagName), h.textNode += "</" + h.tagName + ">", h.state = y.TEXT;
        return;
      }
      h.tagName = S;
      for (var re = h.tags.length; re-- > f; ) {
        var le = h.tag = h.tags.pop();
        h.tagName = h.tag.name, B(h, "onclosetag", h.tagName);
        var we = {};
        for (var _e in le.ns)
          we[_e] = le.ns[_e];
        var ht = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && le.ns !== ht.ns && Object.keys(le.ns).forEach(function(de) {
          var Ve = le.ns[de];
          B(h, "onclosenamespace", { prefix: de, uri: Ve });
        });
      }
      f === 0 && (h.closedRoot = !0), h.tagName = h.attribValue = h.attribName = "", h.attribList.length = 0, h.state = y.TEXT;
    }
    function Z(h) {
      var f = h.entity, S = f.toLowerCase(), v, K = "";
      return h.ENTITIES[f] ? h.ENTITIES[f] : h.ENTITIES[S] ? h.ENTITIES[S] : (f = S, f.charAt(0) === "#" && (f.charAt(1) === "x" ? (f = f.slice(2), v = parseInt(f, 16), K = v.toString(16)) : (f = f.slice(1), v = parseInt(f, 10), K = v.toString(10))), f = f.replace(/^0+/, ""), isNaN(v) || K.toLowerCase() !== f || v < 0 || v > 1114111 ? (A(h, "Invalid character entity"), "&" + h.entity + ";") : String.fromCodePoint(v));
    }
    function he(h, f) {
      f === "<" ? (h.state = y.OPEN_WAKA, h.startTagPosition = h.position) : $(f) || (A(h, "Non-whitespace before first tag."), h.textNode = f, h.state = y.TEXT);
    }
    function U(h, f) {
      var S = "";
      return f < h.length && (S = h.charAt(f)), S;
    }
    function et(h) {
      var f = this;
      if (this.error)
        throw this.error;
      if (f.closed)
        return I(
          f,
          "Cannot write after close. Assign an onready handler."
        );
      if (h === null)
        return D(f);
      typeof h == "object" && (h = h.toString());
      for (var S = 0, v = ""; v = U(h, S++), f.c = v, !!v; )
        switch (f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++), f.state) {
          case y.BEGIN:
            if (f.state = y.BEGIN_WHITESPACE, v === "\uFEFF")
              continue;
            he(f, v);
            continue;
          case y.BEGIN_WHITESPACE:
            he(f, v);
            continue;
          case y.TEXT:
            if (f.sawRoot && !f.closedRoot) {
              for (var re = S - 1; v && v !== "<" && v !== "&"; )
                v = U(h, S++), v && f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++);
              f.textNode += h.substring(re, S - 1);
            }
            v === "<" && !(f.sawRoot && f.closedRoot && !f.strict) ? (f.state = y.OPEN_WAKA, f.startTagPosition = f.position) : (!$(v) && (!f.sawRoot || f.closedRoot) && A(f, "Text data outside of root node."), v === "&" ? f.state = y.TEXT_ENTITY : f.textNode += v);
            continue;
          case y.SCRIPT:
            v === "<" ? f.state = y.SCRIPT_ENDING : f.script += v;
            continue;
          case y.SCRIPT_ENDING:
            v === "/" ? f.state = y.CLOSE_TAG : (f.script += "<" + v, f.state = y.SCRIPT);
            continue;
          case y.OPEN_WAKA:
            if (v === "!")
              f.state = y.SGML_DECL, f.sgmlDecl = "";
            else if (!$(v)) if (Y(T, v))
              f.state = y.OPEN_TAG, f.tagName = v;
            else if (v === "/")
              f.state = y.CLOSE_TAG, f.tagName = "";
            else if (v === "?")
              f.state = y.PROC_INST, f.procInstName = f.procInstBody = "";
            else {
              if (A(f, "Unencoded <"), f.startTagPosition + 1 < f.position) {
                var K = f.position - f.startTagPosition;
                v = new Array(K).join(" ") + v;
              }
              f.textNode += "<" + v, f.state = y.TEXT;
            }
            continue;
          case y.SGML_DECL:
            if (f.sgmlDecl + v === "--") {
              f.state = y.COMMENT, f.comment = "", f.sgmlDecl = "";
              continue;
            }
            f.doctype && f.doctype !== !0 && f.sgmlDecl ? (f.state = y.DOCTYPE_DTD, f.doctype += "<!" + f.sgmlDecl + v, f.sgmlDecl = "") : (f.sgmlDecl + v).toUpperCase() === u ? (B(f, "onopencdata"), f.state = y.CDATA, f.sgmlDecl = "", f.cdata = "") : (f.sgmlDecl + v).toUpperCase() === p ? (f.state = y.DOCTYPE, (f.doctype || f.sawRoot) && A(
              f,
              "Inappropriately located doctype declaration"
            ), f.doctype = "", f.sgmlDecl = "") : v === ">" ? (B(f, "onsgmldeclaration", f.sgmlDecl), f.sgmlDecl = "", f.state = y.TEXT) : (ie(v) && (f.state = y.SGML_DECL_QUOTED), f.sgmlDecl += v);
            continue;
          case y.SGML_DECL_QUOTED:
            v === f.q && (f.state = y.SGML_DECL, f.q = ""), f.sgmlDecl += v;
            continue;
          case y.DOCTYPE:
            v === ">" ? (f.state = y.TEXT, B(f, "ondoctype", f.doctype), f.doctype = !0) : (f.doctype += v, v === "[" ? f.state = y.DOCTYPE_DTD : ie(v) && (f.state = y.DOCTYPE_QUOTED, f.q = v));
            continue;
          case y.DOCTYPE_QUOTED:
            f.doctype += v, v === f.q && (f.q = "", f.state = y.DOCTYPE);
            continue;
          case y.DOCTYPE_DTD:
            v === "]" ? (f.doctype += v, f.state = y.DOCTYPE) : v === "<" ? (f.state = y.OPEN_WAKA, f.startTagPosition = f.position) : ie(v) ? (f.doctype += v, f.state = y.DOCTYPE_DTD_QUOTED, f.q = v) : f.doctype += v;
            continue;
          case y.DOCTYPE_DTD_QUOTED:
            f.doctype += v, v === f.q && (f.state = y.DOCTYPE_DTD, f.q = "");
            continue;
          case y.COMMENT:
            v === "-" ? f.state = y.COMMENT_ENDING : f.comment += v;
            continue;
          case y.COMMENT_ENDING:
            v === "-" ? (f.state = y.COMMENT_ENDED, f.comment = R(f.opt, f.comment), f.comment && B(f, "oncomment", f.comment), f.comment = "") : (f.comment += "-" + v, f.state = y.COMMENT);
            continue;
          case y.COMMENT_ENDED:
            v !== ">" ? (A(f, "Malformed comment"), f.comment += "--" + v, f.state = y.COMMENT) : f.doctype && f.doctype !== !0 ? f.state = y.DOCTYPE_DTD : f.state = y.TEXT;
            continue;
          case y.CDATA:
            for (var re = S - 1; v && v !== "]"; )
              v = U(h, S++), v && f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++);
            f.cdata += h.substring(re, S - 1), v === "]" && (f.state = y.CDATA_ENDING);
            continue;
          case y.CDATA_ENDING:
            v === "]" ? f.state = y.CDATA_ENDING_2 : (f.cdata += "]" + v, f.state = y.CDATA);
            continue;
          case y.CDATA_ENDING_2:
            v === ">" ? (f.cdata && B(f, "oncdata", f.cdata), B(f, "onclosecdata"), f.cdata = "", f.state = y.TEXT) : v === "]" ? f.cdata += "]" : (f.cdata += "]]" + v, f.state = y.CDATA);
            continue;
          case y.PROC_INST:
            v === "?" ? f.state = y.PROC_INST_ENDING : $(v) ? f.state = y.PROC_INST_BODY : f.procInstName += v;
            continue;
          case y.PROC_INST_BODY:
            if (!f.procInstBody && $(v))
              continue;
            v === "?" ? f.state = y.PROC_INST_ENDING : f.procInstBody += v;
            continue;
          case y.PROC_INST_ENDING:
            v === ">" ? (B(f, "onprocessinginstruction", {
              name: f.procInstName,
              body: f.procInstBody
            }), f.procInstName = f.procInstBody = "", f.state = y.TEXT) : (f.procInstBody += "?" + v, f.state = y.PROC_INST_BODY);
            continue;
          case y.OPEN_TAG:
            Y(_, v) ? f.tagName += v : (k(f), v === ">" ? X(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : ($(v) || A(f, "Invalid character in tag name"), f.state = y.ATTRIB));
            continue;
          case y.OPEN_TAG_SLASH:
            v === ">" ? (X(f, !0), j(f)) : (A(
              f,
              "Forward-slash in opening tag not followed by >"
            ), f.state = y.ATTRIB);
            continue;
          case y.ATTRIB:
            if ($(v))
              continue;
            v === ">" ? X(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : Y(T, v) ? (f.attribName = v, f.attribValue = "", f.state = y.ATTRIB_NAME) : A(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME:
            v === "=" ? f.state = y.ATTRIB_VALUE : v === ">" ? (A(f, "Attribute without value"), f.attribValue = f.attribName, M(f), X(f)) : $(v) ? f.state = y.ATTRIB_NAME_SAW_WHITE : Y(_, v) ? f.attribName += v : A(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME_SAW_WHITE:
            if (v === "=")
              f.state = y.ATTRIB_VALUE;
            else {
              if ($(v))
                continue;
              A(f, "Attribute without value"), f.tag.attributes[f.attribName] = "", f.attribValue = "", B(f, "onattribute", {
                name: f.attribName,
                value: ""
              }), f.attribName = "", v === ">" ? X(f) : Y(T, v) ? (f.attribName = v, f.state = y.ATTRIB_NAME) : (A(f, "Invalid attribute name"), f.state = y.ATTRIB);
            }
            continue;
          case y.ATTRIB_VALUE:
            if ($(v))
              continue;
            ie(v) ? (f.q = v, f.state = y.ATTRIB_VALUE_QUOTED) : (f.opt.unquotedAttributeValues || I(f, "Unquoted attribute value"), f.state = y.ATTRIB_VALUE_UNQUOTED, f.attribValue = v);
            continue;
          case y.ATTRIB_VALUE_QUOTED:
            if (v !== f.q) {
              v === "&" ? f.state = y.ATTRIB_VALUE_ENTITY_Q : f.attribValue += v;
              continue;
            }
            M(f), f.q = "", f.state = y.ATTRIB_VALUE_CLOSED;
            continue;
          case y.ATTRIB_VALUE_CLOSED:
            $(v) ? f.state = y.ATTRIB : v === ">" ? X(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : Y(T, v) ? (A(f, "No whitespace between attributes"), f.attribName = v, f.attribValue = "", f.state = y.ATTRIB_NAME) : A(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_VALUE_UNQUOTED:
            if (!ue(v)) {
              v === "&" ? f.state = y.ATTRIB_VALUE_ENTITY_U : f.attribValue += v;
              continue;
            }
            M(f), v === ">" ? X(f) : f.state = y.ATTRIB;
            continue;
          case y.CLOSE_TAG:
            if (f.tagName)
              v === ">" ? j(f) : Y(_, v) ? f.tagName += v : f.script ? (f.script += "</" + f.tagName, f.tagName = "", f.state = y.SCRIPT) : ($(v) || A(f, "Invalid tagname in closing tag"), f.state = y.CLOSE_TAG_SAW_WHITE);
            else {
              if ($(v))
                continue;
              Me(T, v) ? f.script ? (f.script += "</" + v, f.state = y.SCRIPT) : A(f, "Invalid tagname in closing tag.") : f.tagName = v;
            }
            continue;
          case y.CLOSE_TAG_SAW_WHITE:
            if ($(v))
              continue;
            v === ">" ? j(f) : A(f, "Invalid characters in closing tag");
            continue;
          case y.TEXT_ENTITY:
          case y.ATTRIB_VALUE_ENTITY_Q:
          case y.ATTRIB_VALUE_ENTITY_U:
            var le, we;
            switch (f.state) {
              case y.TEXT_ENTITY:
                le = y.TEXT, we = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                le = y.ATTRIB_VALUE_QUOTED, we = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                le = y.ATTRIB_VALUE_UNQUOTED, we = "attribValue";
                break;
            }
            if (v === ";") {
              var _e = Z(f);
              f.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(_e) ? (f.entity = "", f.state = le, f.write(_e)) : (f[we] += _e, f.entity = "", f.state = le);
            } else Y(f.entity.length ? N : b, v) ? f.entity += v : (A(f, "Invalid character in entity name"), f[we] += "&" + f.entity + v, f.entity = "", f.state = le);
            continue;
          default:
            throw new Error(f, "Unknown state: " + f.state);
        }
      return f.position >= f.bufferCheckPosition && i(f), f;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, f = Math.floor, S = function() {
        var v = 16384, K = [], re, le, we = -1, _e = arguments.length;
        if (!_e)
          return "";
        for (var ht = ""; ++we < _e; ) {
          var de = Number(arguments[we]);
          if (!isFinite(de) || // `NaN`, `+Infinity`, or `-Infinity`
          de < 0 || // not a valid Unicode code point
          de > 1114111 || // not a valid Unicode code point
          f(de) !== de)
            throw RangeError("Invalid code point: " + de);
          de <= 65535 ? K.push(de) : (de -= 65536, re = (de >> 10) + 55296, le = de % 1024 + 56320, K.push(re, le)), (we + 1 === _e || K.length > v) && (ht += h.apply(null, K), K.length = 0);
        }
        return ht;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: S,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = S;
    }();
  })(e);
})(bu);
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.XElement = void 0;
pn.parseXml = D0;
const C0 = bu, Un = Ar;
class Su {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Un.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!O0(t))
      throw (0, Un.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Un.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Un.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (qo(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => qo(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
pn.XElement = Su;
const R0 = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function O0(e) {
  return R0.test(e);
}
function qo(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function D0(e) {
  let t = null;
  const r = C0.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const a = new Su(i.name);
    if (a.attributes = i.attributes, t === null)
      t = a;
    else {
      const s = n[n.length - 1];
      s.elements == null && (s.elements = []), s.elements.push(a);
    }
    n.push(a);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const a = n[n.length - 1];
    a.value = i, a.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = u;
  var t = It;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = Ar;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = De;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = Ci;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var a = dn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return a.ProgressCallbackTransform;
  } });
  var s = Ri;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } });
  var o = _s;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return o.retry;
  } });
  var l = bs;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var d = Tr;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return d.UUID;
  } });
  var c = pn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function u(p) {
    return p == null ? [] : Array.isArray(p) ? p : [p];
  }
})(xe);
var Te = {}, Ss = {}, Je = {};
function Au(e) {
  return typeof e > "u" || e === null;
}
function P0(e) {
  return typeof e == "object" && e !== null;
}
function k0(e) {
  return Array.isArray(e) ? e : Au(e) ? [] : [e];
}
function N0(e, t) {
  var r, n, i, a;
  if (t)
    for (a = Object.keys(t), r = 0, n = a.length; r < n; r += 1)
      i = a[r], e[i] = t[i];
  return e;
}
function F0(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function $0(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Je.isNothing = Au;
Je.isObject = P0;
Je.toArray = k0;
Je.repeat = F0;
Je.isNegativeZero = $0;
Je.extend = N0;
function Iu(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Qr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Iu(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Qr.prototype = Object.create(Error.prototype);
Qr.prototype.constructor = Qr;
Qr.prototype.toString = function(t) {
  return this.name + ": " + Iu(this, t);
};
var hn = Qr, Br = Je;
function pa(e, t, r, n, i) {
  var a = "", s = "", o = Math.floor(i / 2) - 1;
  return n - t > o && (a = " ... ", t = n - o + a.length), r - n > o && (s = " ...", r = n + o - s.length), {
    str: a + e.slice(t, r).replace(/\t/g, "→") + s,
    pos: n - t + a.length
    // relative position
  };
}
function ha(e, t) {
  return Br.repeat(" ", t - e.length) + e;
}
function L0(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], a, s = -1; a = r.exec(e.buffer); )
    i.push(a.index), n.push(a.index + a[0].length), e.position <= a.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var o = "", l, d, c = Math.min(e.line + t.linesAfter, i.length).toString().length, u = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(s - l < 0); l++)
    d = pa(
      e.buffer,
      n[s - l],
      i[s - l],
      e.position - (n[s] - n[s - l]),
      u
    ), o = Br.repeat(" ", t.indent) + ha((e.line - l + 1).toString(), c) + " | " + d.str + `
` + o;
  for (d = pa(e.buffer, n[s], i[s], e.position, u), o += Br.repeat(" ", t.indent) + ha((e.line + 1).toString(), c) + " | " + d.str + `
`, o += Br.repeat("-", t.indent + c + 3 + d.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++)
    d = pa(
      e.buffer,
      n[s + l],
      i[s + l],
      e.position - (n[s] - n[s + l]),
      u
    ), o += Br.repeat(" ", t.indent) + ha((e.line + l + 1).toString(), c) + " | " + d.str + `
`;
  return o.replace(/\n$/, "");
}
var U0 = L0, Xo = hn, M0 = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], B0 = [
  "scalar",
  "sequence",
  "mapping"
];
function z0(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function j0(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (M0.indexOf(r) === -1)
      throw new Xo('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = z0(t.styleAliases || null), B0.indexOf(this.kind) === -1)
    throw new Xo('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Fe = j0, $r = hn, ma = Fe;
function Wo(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(a, s) {
      a.tag === n.tag && a.kind === n.kind && a.multi === n.multi && (i = s);
    }), r[i] = n;
  }), r;
}
function G0() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function Wa(e) {
  return this.extend(e);
}
Wa.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof ma)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new $r("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(a) {
    if (!(a instanceof ma))
      throw new $r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (a.loadKind && a.loadKind !== "scalar")
      throw new $r("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (a.multi)
      throw new $r("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(a) {
    if (!(a instanceof ma))
      throw new $r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Wa.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Wo(i, "implicit"), i.compiledExplicit = Wo(i, "explicit"), i.compiledTypeMap = G0(i.compiledImplicit, i.compiledExplicit), i;
};
var Cu = Wa, H0 = Fe, Ru = new H0("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), q0 = Fe, Ou = new q0("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), X0 = Fe, Du = new X0("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), W0 = Cu, Pu = new W0({
  explicit: [
    Ru,
    Ou,
    Du
  ]
}), V0 = Fe;
function Y0(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function K0() {
  return null;
}
function J0(e) {
  return e === null;
}
var ku = new V0("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Y0,
  construct: K0,
  predicate: J0,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), Q0 = Fe;
function Z0(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function eg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function tg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Nu = new Q0("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Z0,
  construct: eg,
  predicate: tg,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), rg = Je, ng = Fe;
function ig(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function ag(e) {
  return 48 <= e && e <= 55;
}
function sg(e) {
  return 48 <= e && e <= 57;
}
function og(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!ig(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!ag(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!sg(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function lg(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function cg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !rg.isNegativeZero(e);
}
var Fu = new ng("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: og,
  construct: lg,
  predicate: cg,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), $u = Je, ug = Fe, fg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function dg(e) {
  return !(e === null || !fg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function pg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var hg = /^[-+]?[0-9]+e/;
function mg(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if ($u.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), hg.test(r) ? r.replace("e", ".e") : r;
}
function gg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || $u.isNegativeZero(e));
}
var Lu = new ug("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: dg,
  construct: pg,
  predicate: gg,
  represent: mg,
  defaultStyle: "lowercase"
}), Uu = Pu.extend({
  implicit: [
    ku,
    Nu,
    Fu,
    Lu
  ]
}), Mu = Uu, yg = Fe, Bu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), zu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function xg(e) {
  return e === null ? !1 : Bu.exec(e) !== null || zu.exec(e) !== null;
}
function wg(e) {
  var t, r, n, i, a, s, o, l = 0, d = null, c, u, p;
  if (t = Bu.exec(e), t === null && (t = zu.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (a = +t[4], s = +t[5], o = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], u = +(t[11] || 0), d = (c * 60 + u) * 6e4, t[9] === "-" && (d = -d)), p = new Date(Date.UTC(r, n, i, a, s, o, l)), d && p.setTime(p.getTime() - d), p;
}
function Eg(e) {
  return e.toISOString();
}
var ju = new yg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: xg,
  construct: wg,
  instanceOf: Date,
  represent: Eg
}), vg = Fe;
function Tg(e) {
  return e === "<<" || e === null;
}
var Gu = new vg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Tg
}), _g = Fe, As = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function bg(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, a = As;
  for (r = 0; r < i; r++)
    if (t = a.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Sg(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, a = As, s = 0, o = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (o.push(s >> 16 & 255), o.push(s >> 8 & 255), o.push(s & 255)), s = s << 6 | a.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (o.push(s >> 16 & 255), o.push(s >> 8 & 255), o.push(s & 255)) : r === 18 ? (o.push(s >> 10 & 255), o.push(s >> 2 & 255)) : r === 12 && o.push(s >> 4 & 255), new Uint8Array(o);
}
function Ag(e) {
  var t = "", r = 0, n, i, a = e.length, s = As;
  for (n = 0; n < a; n++)
    n % 3 === 0 && n && (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]), r = (r << 8) + e[n];
  return i = a % 3, i === 0 ? (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]) : i === 2 ? (t += s[r >> 10 & 63], t += s[r >> 4 & 63], t += s[r << 2 & 63], t += s[64]) : i === 1 && (t += s[r >> 2 & 63], t += s[r << 4 & 63], t += s[64], t += s[64]), t;
}
function Ig(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Hu = new _g("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: bg,
  construct: Sg,
  predicate: Ig,
  represent: Ag
}), Cg = Fe, Rg = Object.prototype.hasOwnProperty, Og = Object.prototype.toString;
function Dg(e) {
  if (e === null) return !0;
  var t = [], r, n, i, a, s, o = e;
  for (r = 0, n = o.length; r < n; r += 1) {
    if (i = o[r], s = !1, Og.call(i) !== "[object Object]") return !1;
    for (a in i)
      if (Rg.call(i, a))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function Pg(e) {
  return e !== null ? e : [];
}
var qu = new Cg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Dg,
  construct: Pg
}), kg = Fe, Ng = Object.prototype.toString;
function Fg(e) {
  if (e === null) return !0;
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1) {
    if (n = s[t], Ng.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    a[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function $g(e) {
  if (e === null) return [];
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1)
    n = s[t], i = Object.keys(n), a[t] = [i[0], n[i[0]]];
  return a;
}
var Xu = new kg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Fg,
  construct: $g
}), Lg = Fe, Ug = Object.prototype.hasOwnProperty;
function Mg(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (Ug.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Bg(e) {
  return e !== null ? e : {};
}
var Wu = new Lg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Mg,
  construct: Bg
}), Is = Mu.extend({
  implicit: [
    ju,
    Gu
  ],
  explicit: [
    Hu,
    qu,
    Xu,
    Wu
  ]
}), Ht = Je, Vu = hn, zg = U0, jg = Is, Ct = Object.prototype.hasOwnProperty, pi = 1, Yu = 2, Ku = 3, hi = 4, ga = 1, Gg = 2, Vo = 3, Hg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, qg = /[\x85\u2028\u2029]/, Xg = /[,\[\]\{\}]/, Ju = /^(?:!|!!|![a-z\-]+!)$/i, Qu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Yo(e) {
  return Object.prototype.toString.call(e);
}
function at(e) {
  return e === 10 || e === 13;
}
function Vt(e) {
  return e === 9 || e === 32;
}
function Ue(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function dr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Wg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Vg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Yg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Ko(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Kg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function Zu(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var ef = new Array(256), tf = new Array(256);
for (var ar = 0; ar < 256; ar++)
  ef[ar] = Ko(ar) ? 1 : 0, tf[ar] = Ko(ar);
function Jg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || jg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function rf(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = zg(r), new Vu(t, r);
}
function L(e, t) {
  throw rf(e, t);
}
function mi(e, t) {
  e.onWarning && e.onWarning.call(null, rf(e, t));
}
var Jo = {
  YAML: function(t, r, n) {
    var i, a, s;
    t.version !== null && L(t, "duplication of %YAML directive"), n.length !== 1 && L(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && L(t, "ill-formed argument of the YAML directive"), a = parseInt(i[1], 10), s = parseInt(i[2], 10), a !== 1 && L(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && mi(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, a;
    n.length !== 2 && L(t, "TAG directive accepts exactly two arguments"), i = n[0], a = n[1], Ju.test(i) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), Ct.call(t.tagMap, i) && L(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Qu.test(a) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      a = decodeURIComponent(a);
    } catch {
      L(t, "tag prefix is malformed: " + a);
    }
    t.tagMap[i] = a;
  }
};
function bt(e, t, r, n) {
  var i, a, s, o;
  if (t < r) {
    if (o = e.input.slice(t, r), n)
      for (i = 0, a = o.length; i < a; i += 1)
        s = o.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || L(e, "expected valid JSON character");
    else Hg.test(o) && L(e, "the stream contains non-printable characters");
    e.result += o;
  }
}
function Qo(e, t, r, n) {
  var i, a, s, o;
  for (Ht.isObject(r) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), s = 0, o = i.length; s < o; s += 1)
    a = i[s], Ct.call(t, a) || (Zu(t, a, r[a]), n[a] = !0);
}
function pr(e, t, r, n, i, a, s, o, l) {
  var d, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), d = 0, c = i.length; d < c; d += 1)
      Array.isArray(i[d]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && Yo(i[d]) === "[object Object]" && (i[d] = "[object Object]");
  if (typeof i == "object" && Yo(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(a))
      for (d = 0, c = a.length; d < c; d += 1)
        Qo(e, t, a[d], r);
    else
      Qo(e, t, a, r);
  else
    !e.json && !Ct.call(r, i) && Ct.call(t, i) && (e.line = s || e.line, e.lineStart = o || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), Zu(t, i, a), delete r[i];
  return t;
}
function Cs(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function fe(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Vt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (at(i))
      for (Cs(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && mi(e, "deficient indentation"), n;
}
function Oi(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Ue(r)));
}
function Rs(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Ht.repeat(`
`, t - 1));
}
function Qg(e, t, r) {
  var n, i, a, s, o, l, d, c, u = e.kind, p = e.result, g;
  if (g = e.input.charCodeAt(e.position), Ue(g) || dr(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), Ue(i) || r && dr(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", a = s = e.position, o = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ue(i) || r && dr(i))
        break;
    } else if (g === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Ue(n))
        break;
    } else {
      if (e.position === e.lineStart && Oi(e) || r && dr(g))
        break;
      if (at(g))
        if (l = e.line, d = e.lineStart, c = e.lineIndent, fe(e, !1, -1), e.lineIndent >= t) {
          o = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = d, e.lineIndent = c;
          break;
        }
    }
    o && (bt(e, a, s, !1), Rs(e, e.line - l), a = s = e.position, o = !1), Vt(g) || (s = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return bt(e, a, s, !1), e.result ? !0 : (e.kind = u, e.result = p, !1);
}
function Zg(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (bt(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else at(r) ? (bt(e, n, i, !0), Rs(e, fe(e, !1, t)), n = i = e.position) : e.position === e.lineStart && Oi(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function ey(e, t) {
  var r, n, i, a, s, o;
  if (o = e.input.charCodeAt(e.position), o !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (o = e.input.charCodeAt(e.position)) !== 0; ) {
    if (o === 34)
      return bt(e, r, e.position, !0), e.position++, !0;
    if (o === 92) {
      if (bt(e, r, e.position, !0), o = e.input.charCodeAt(++e.position), at(o))
        fe(e, !1, t);
      else if (o < 256 && ef[o])
        e.result += tf[o], e.position++;
      else if ((s = Vg(o)) > 0) {
        for (i = s, a = 0; i > 0; i--)
          o = e.input.charCodeAt(++e.position), (s = Wg(o)) >= 0 ? a = (a << 4) + s : L(e, "expected hexadecimal character");
        e.result += Kg(a), e.position++;
      } else
        L(e, "unknown escape sequence");
      r = n = e.position;
    } else at(o) ? (bt(e, r, n, !0), Rs(e, fe(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Oi(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function ty(e, t) {
  var r = !0, n, i, a, s = e.tag, o, l = e.anchor, d, c, u, p, g, w = /* @__PURE__ */ Object.create(null), x, T, _, b;
  if (b = e.input.charCodeAt(e.position), b === 91)
    c = 93, g = !1, o = [];
  else if (b === 123)
    c = 125, g = !0, o = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), b = e.input.charCodeAt(++e.position); b !== 0; ) {
    if (fe(e, !0, t), b = e.input.charCodeAt(e.position), b === c)
      return e.position++, e.tag = s, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = o, !0;
    r ? b === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), T = x = _ = null, u = p = !1, b === 63 && (d = e.input.charCodeAt(e.position + 1), Ue(d) && (u = p = !0, e.position++, fe(e, !0, t))), n = e.line, i = e.lineStart, a = e.position, _r(e, t, pi, !1, !0), T = e.tag, x = e.result, fe(e, !0, t), b = e.input.charCodeAt(e.position), (p || e.line === n) && b === 58 && (u = !0, b = e.input.charCodeAt(++e.position), fe(e, !0, t), _r(e, t, pi, !1, !0), _ = e.result), g ? pr(e, o, w, T, x, _, n, i, a) : u ? o.push(pr(e, null, w, T, x, _, n, i, a)) : o.push(x), fe(e, !0, t), b = e.input.charCodeAt(e.position), b === 44 ? (r = !0, b = e.input.charCodeAt(++e.position)) : r = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function ry(e, t) {
  var r, n, i = ga, a = !1, s = !1, o = t, l = 0, d = !1, c, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    n = !1;
  else if (u === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      ga === i ? i = u === 43 ? Vo : Gg : L(e, "repeat of a chomping mode identifier");
    else if ((c = Yg(u)) >= 0)
      c === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? L(e, "repeat of an indentation width identifier") : (o = t + c - 1, s = !0);
    else
      break;
  if (Vt(u)) {
    do
      u = e.input.charCodeAt(++e.position);
    while (Vt(u));
    if (u === 35)
      do
        u = e.input.charCodeAt(++e.position);
      while (!at(u) && u !== 0);
  }
  for (; u !== 0; ) {
    for (Cs(e), e.lineIndent = 0, u = e.input.charCodeAt(e.position); (!s || e.lineIndent < o) && u === 32; )
      e.lineIndent++, u = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > o && (o = e.lineIndent), at(u)) {
      l++;
      continue;
    }
    if (e.lineIndent < o) {
      i === Vo ? e.result += Ht.repeat(`
`, a ? 1 + l : l) : i === ga && a && (e.result += `
`);
      break;
    }
    for (n ? Vt(u) ? (d = !0, e.result += Ht.repeat(`
`, a ? 1 + l : l)) : d ? (d = !1, e.result += Ht.repeat(`
`, l + 1)) : l === 0 ? a && (e.result += " ") : e.result += Ht.repeat(`
`, l) : e.result += Ht.repeat(`
`, a ? 1 + l : l), a = !0, s = !0, l = 0, r = e.position; !at(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    bt(e, r, e.position, !1);
  }
  return !0;
}
function Zo(e, t) {
  var r, n = e.tag, i = e.anchor, a = [], s, o = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !Ue(s)))); ) {
    if (o = !0, e.position++, fe(e, !0, -1) && e.lineIndent <= t) {
      a.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, _r(e, t, Ku, !1, !0), a.push(e.result), fe(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return o ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function ny(e, t, r) {
  var n, i, a, s, o, l, d = e.tag, c = e.anchor, u = {}, p = /* @__PURE__ */ Object.create(null), g = null, w = null, x = null, T = !1, _ = !1, b;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), b = e.input.charCodeAt(e.position); b !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), a = e.line, (b === 63 || b === 58) && Ue(n))
      b === 63 ? (T && (pr(e, u, p, g, w, null, s, o, l), g = w = x = null), _ = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, b = n;
    else {
      if (s = e.line, o = e.lineStart, l = e.position, !_r(e, r, Yu, !1, !0))
        break;
      if (e.line === a) {
        for (b = e.input.charCodeAt(e.position); Vt(b); )
          b = e.input.charCodeAt(++e.position);
        if (b === 58)
          b = e.input.charCodeAt(++e.position), Ue(b) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (pr(e, u, p, g, w, null, s, o, l), g = w = x = null), _ = !0, T = !1, i = !1, g = e.tag, w = e.result;
        else if (_)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = d, e.anchor = c, !0;
      } else if (_)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = d, e.anchor = c, !0;
    }
    if ((e.line === a || e.lineIndent > t) && (T && (s = e.line, o = e.lineStart, l = e.position), _r(e, t, hi, !0, i) && (T ? w = e.result : x = e.result), T || (pr(e, u, p, g, w, x, s, o, l), g = w = x = null), fe(e, !0, -1), b = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && b !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && pr(e, u, p, g, w, null, s, o, l), _ && (e.tag = d, e.anchor = c, e.kind = "mapping", e.result = u), _;
}
function iy(e) {
  var t, r = !1, n = !1, i, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && L(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (r = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (n = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (a = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !Ue(s); )
      s === 33 && (n ? L(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Ju.test(i) || L(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    a = e.input.slice(t, e.position), Xg.test(a) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  a && !Qu.test(a) && L(e, "tag name cannot contain such characters: " + a);
  try {
    a = decodeURIComponent(a);
  } catch {
    L(e, "tag name is malformed: " + a);
  }
  return r ? e.tag = a : Ct.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function ay(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ue(r) && !dr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function sy(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ue(n) && !dr(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), Ct.call(e.anchorMap, r) || L(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], fe(e, !0, -1), !0;
}
function _r(e, t, r, n, i) {
  var a, s, o, l = 1, d = !1, c = !1, u, p, g, w, x, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = s = o = hi === r || Ku === r, n && fe(e, !0, -1) && (d = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; iy(e) || ay(e); )
      fe(e, !0, -1) ? (d = !0, o = a, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : o = !1;
  if (o && (o = d || i), (l === 1 || hi === r) && (pi === r || Yu === r ? x = t : x = t + 1, T = e.position - e.lineStart, l === 1 ? o && (Zo(e, T) || ny(e, T, x)) || ty(e, x) ? c = !0 : (s && ry(e, x) || Zg(e, x) || ey(e, x) ? c = !0 : sy(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : Qg(e, x, pi === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = o && Zo(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, p = e.implicitTypes.length; u < p; u += 1)
      if (w = e.implicitTypes[u], w.resolve(e.result)) {
        e.result = w.construct(e.result), e.tag = w.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Ct.call(e.typeMap[e.kind || "fallback"], e.tag))
      w = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (w = null, g = e.typeMap.multi[e.kind || "fallback"], u = 0, p = g.length; u < p; u += 1)
        if (e.tag.slice(0, g[u].tag.length) === g[u].tag) {
          w = g[u];
          break;
        }
    w || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && w.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + w.kind + '", not "' + e.kind + '"'), w.resolve(e.result, e.tag) ? (e.result = w.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function oy(e) {
  var t = e.position, r, n, i, a = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (fe(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (a = !0, s = e.input.charCodeAt(++e.position), r = e.position; s !== 0 && !Ue(s); )
      s = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && L(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; Vt(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !at(s));
        break;
      }
      if (at(s)) break;
      for (r = e.position; s !== 0 && !Ue(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    s !== 0 && Cs(e), Ct.call(Jo, n) ? Jo[n](e, n, i) : mi(e, 'unknown document directive "' + n + '"');
  }
  if (fe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, fe(e, !0, -1)) : a && L(e, "directives end mark is expected"), _r(e, e.lineIndent - 1, hi, !1, !0), fe(e, !0, -1), e.checkLineBreaks && qg.test(e.input.slice(t, e.position)) && mi(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Oi(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, fe(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    L(e, "end of the stream or a document separator is expected");
  else
    return;
}
function nf(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new Jg(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, L(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    oy(r);
  return r.documents;
}
function ly(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = nf(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, a = n.length; i < a; i += 1)
    t(n[i]);
}
function cy(e, t) {
  var r = nf(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new Vu("expected a single document in the stream, but found more");
  }
}
Ss.loadAll = ly;
Ss.load = cy;
var af = {}, Di = Je, mn = hn, uy = Is, sf = Object.prototype.toString, of = Object.prototype.hasOwnProperty, Os = 65279, fy = 9, Zr = 10, dy = 13, py = 32, hy = 33, my = 34, Va = 35, gy = 37, yy = 38, xy = 39, wy = 42, lf = 44, Ey = 45, gi = 58, vy = 61, Ty = 62, _y = 63, by = 64, cf = 91, uf = 93, Sy = 96, ff = 123, Ay = 124, df = 125, Ce = {};
Ce[0] = "\\0";
Ce[7] = "\\a";
Ce[8] = "\\b";
Ce[9] = "\\t";
Ce[10] = "\\n";
Ce[11] = "\\v";
Ce[12] = "\\f";
Ce[13] = "\\r";
Ce[27] = "\\e";
Ce[34] = '\\"';
Ce[92] = "\\\\";
Ce[133] = "\\N";
Ce[160] = "\\_";
Ce[8232] = "\\L";
Ce[8233] = "\\P";
var Iy = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], Cy = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Ry(e, t) {
  var r, n, i, a, s, o, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, a = n.length; i < a; i += 1)
    s = n[i], o = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && of.call(l.styleAliases, o) && (o = l.styleAliases[o]), r[s] = o;
  return r;
}
function Oy(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new mn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + Di.repeat("0", n - t.length) + t;
}
var Dy = 1, en = 2;
function Py(e) {
  this.schema = e.schema || uy, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Di.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Ry(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? en : Dy, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function el(e, t) {
  for (var r = Di.repeat(" ", t), n = 0, i = -1, a = "", s, o = e.length; n < o; )
    i = e.indexOf(`
`, n), i === -1 ? (s = e.slice(n), n = o) : (s = e.slice(n, i + 1), n = i + 1), s.length && s !== `
` && (a += r), a += s;
  return a;
}
function Ya(e, t) {
  return `
` + Di.repeat(" ", e.indent * t);
}
function ky(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function yi(e) {
  return e === py || e === fy;
}
function tn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Os || 65536 <= e && e <= 1114111;
}
function tl(e) {
  return tn(e) && e !== Os && e !== dy && e !== Zr;
}
function rl(e, t, r) {
  var n = tl(e), i = n && !yi(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== lf && e !== cf && e !== uf && e !== ff && e !== df) && e !== Va && !(t === gi && !i) || tl(t) && !yi(t) && e === Va || t === gi && i
  );
}
function Ny(e) {
  return tn(e) && e !== Os && !yi(e) && e !== Ey && e !== _y && e !== gi && e !== lf && e !== cf && e !== uf && e !== ff && e !== df && e !== Va && e !== yy && e !== wy && e !== hy && e !== Ay && e !== vy && e !== Ty && e !== xy && e !== my && e !== gy && e !== by && e !== Sy;
}
function Fy(e) {
  return !yi(e) && e !== gi;
}
function zr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function pf(e) {
  var t = /^\n* /;
  return t.test(e);
}
var hf = 1, Ka = 2, mf = 3, gf = 4, fr = 5;
function $y(e, t, r, n, i, a, s, o) {
  var l, d = 0, c = null, u = !1, p = !1, g = n !== -1, w = -1, x = Ny(zr(e, 0)) && Fy(zr(e, e.length - 1));
  if (t || s)
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = zr(e, l), !tn(d))
        return fr;
      x = x && rl(d, c, o), c = d;
    }
  else {
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = zr(e, l), d === Zr)
        u = !0, g && (p = p || // Foldable line = too long, and not more-indented.
        l - w - 1 > n && e[w + 1] !== " ", w = l);
      else if (!tn(d))
        return fr;
      x = x && rl(d, c, o), c = d;
    }
    p = p || g && l - w - 1 > n && e[w + 1] !== " ";
  }
  return !u && !p ? x && !s && !i(e) ? hf : a === en ? fr : Ka : r > 9 && pf(e) ? fr : s ? a === en ? fr : Ka : p ? gf : mf;
}
function Ly(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === en ? '""' : "''";
    if (!e.noCompatMode && (Iy.indexOf(t) !== -1 || Cy.test(t)))
      return e.quotingType === en ? '"' + t + '"' : "'" + t + "'";
    var a = e.indent * Math.max(1, r), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), o = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(d) {
      return ky(e, d);
    }
    switch ($y(
      t,
      o,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case hf:
        return t;
      case Ka:
        return "'" + t.replace(/'/g, "''") + "'";
      case mf:
        return "|" + nl(t, e.indent) + il(el(t, a));
      case gf:
        return ">" + nl(t, e.indent) + il(el(Uy(t, s), a));
      case fr:
        return '"' + My(t) + '"';
      default:
        throw new mn("impossible error: invalid scalar style");
    }
  }();
}
function nl(e, t) {
  var r = pf(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), a = i ? "+" : n ? "" : "-";
  return r + a + `
`;
}
function il(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function Uy(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var d = e.indexOf(`
`);
    return d = d !== -1 ? d : e.length, r.lastIndex = d, al(e.slice(0, d), t);
  }(), i = e[0] === `
` || e[0] === " ", a, s; s = r.exec(e); ) {
    var o = s[1], l = s[2];
    a = l[0] === " ", n += o + (!i && !a && l !== "" ? `
` : "") + al(l, t), i = a;
  }
  return n;
}
function al(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, a, s = 0, o = 0, l = ""; n = r.exec(e); )
    o = n.index, o - i > t && (a = s > i ? s : o, l += `
` + e.slice(i, a), i = a + 1), s = o;
  return l += `
`, e.length - i > t && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function My(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = zr(e, i), n = Ce[r], !n && tn(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || Oy(r);
  return t;
}
function By(e, t, r) {
  var n = "", i = e.tag, a, s, o;
  for (a = 0, s = r.length; a < s; a += 1)
    o = r[a], e.replacer && (o = e.replacer.call(r, String(a), o)), (dt(e, t, o, !1, !1) || typeof o > "u" && dt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function sl(e, t, r, n) {
  var i = "", a = e.tag, s, o, l;
  for (s = 0, o = r.length; s < o; s += 1)
    l = r[s], e.replacer && (l = e.replacer.call(r, String(s), l)), (dt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && dt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Ya(e, t)), e.dump && Zr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = a, e.dump = i || "[]";
}
function zy(e, t, r) {
  var n = "", i = e.tag, a = Object.keys(r), s, o, l, d, c;
  for (s = 0, o = a.length; s < o; s += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = a[s], d = r[l], e.replacer && (d = e.replacer.call(r, l, d)), dt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), dt(e, t, d, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function jy(e, t, r, n) {
  var i = "", a = e.tag, s = Object.keys(r), o, l, d, c, u, p;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new mn("sortKeys must be a boolean or a function");
  for (o = 0, l = s.length; o < l; o += 1)
    p = "", (!n || i !== "") && (p += Ya(e, t)), d = s[o], c = r[d], e.replacer && (c = e.replacer.call(r, d, c)), dt(e, t + 1, d, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && Zr === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, u && (p += Ya(e, t)), dt(e, t + 1, c, !0, u) && (e.dump && Zr === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p));
  e.tag = a, e.dump = i || "{}";
}
function ol(e, t, r) {
  var n, i, a, s, o, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, a = 0, s = i.length; a < s; a += 1)
    if (o = i[a], (o.instanceOf || o.predicate) && (!o.instanceOf || typeof t == "object" && t instanceof o.instanceOf) && (!o.predicate || o.predicate(t))) {
      if (r ? o.multi && o.representName ? e.tag = o.representName(t) : e.tag = o.tag : e.tag = "?", o.represent) {
        if (l = e.styleMap[o.tag] || o.defaultStyle, sf.call(o.represent) === "[object Function]")
          n = o.represent(t, l);
        else if (of.call(o.represent, l))
          n = o.represent[l](t, l);
        else
          throw new mn("!<" + o.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function dt(e, t, r, n, i, a, s) {
  e.tag = null, e.dump = r, ol(e, r, !1) || ol(e, r, !0);
  var o = sf.call(e.dump), l = n, d;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = o === "[object Object]" || o === "[object Array]", u, p;
  if (c && (u = e.duplicates.indexOf(r), p = u !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (i = !1), p && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (c && p && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), o === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (jy(e, t, e.dump, i), p && (e.dump = "&ref_" + u + e.dump)) : (zy(e, t, e.dump), p && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? sl(e, t - 1, e.dump, i) : sl(e, t, e.dump, i), p && (e.dump = "&ref_" + u + e.dump)) : (By(e, t, e.dump), p && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object String]")
      e.tag !== "?" && Ly(e, e.dump, t, a, l);
    else {
      if (o === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new mn("unacceptable kind of an object to dump " + o);
    }
    e.tag !== null && e.tag !== "?" && (d = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? d = "!" + d : d.slice(0, 18) === "tag:yaml.org,2002:" ? d = "!!" + d.slice(18) : d = "!<" + d + ">", e.dump = d + " " + e.dump);
  }
  return !0;
}
function Gy(e, t) {
  var r = [], n = [], i, a;
  for (Ja(e, r, n), i = 0, a = n.length; i < a; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(a);
}
function Ja(e, t, r) {
  var n, i, a;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, a = e.length; i < a; i += 1)
        Ja(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, a = n.length; i < a; i += 1)
        Ja(e[n[i]], t, r);
}
function Hy(e, t) {
  t = t || {};
  var r = new Py(t);
  r.noRefs || Gy(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), dt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
af.dump = Hy;
var yf = Ss, qy = af;
function Ds(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Te.Type = Fe;
Te.Schema = Cu;
Te.FAILSAFE_SCHEMA = Pu;
Te.JSON_SCHEMA = Uu;
Te.CORE_SCHEMA = Mu;
Te.DEFAULT_SCHEMA = Is;
Te.load = yf.load;
Te.loadAll = yf.loadAll;
Te.dump = qy.dump;
Te.YAMLException = hn;
Te.types = {
  binary: Hu,
  float: Lu,
  map: Du,
  null: ku,
  pairs: Xu,
  set: Wu,
  timestamp: ju,
  bool: Nu,
  int: Fu,
  merge: Gu,
  omap: qu,
  seq: Ou,
  str: Ru
};
Te.safeLoad = Ds("safeLoad", "load");
Te.safeLoadAll = Ds("safeLoadAll", "loadAll");
Te.safeDump = Ds("safeDump", "dump");
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.Lazy = void 0;
class Xy {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
Pi.Lazy = Xy;
var Qa = { exports: {} };
const Wy = "2.0.0", xf = 256, Vy = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Yy = 16, Ky = xf - 6, Jy = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ki = {
  MAX_LENGTH: xf,
  MAX_SAFE_COMPONENT_LENGTH: Yy,
  MAX_SAFE_BUILD_LENGTH: Ky,
  MAX_SAFE_INTEGER: Vy,
  RELEASE_TYPES: Jy,
  SEMVER_SPEC_VERSION: Wy,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Qy = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ni = Qy;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = ki, a = Ni;
  t = e.exports = {};
  const s = t.re = [], o = t.safeRe = [], l = t.src = [], d = t.safeSrc = [], c = t.t = {};
  let u = 0;
  const p = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [p, n]
  ], w = (T) => {
    for (const [_, b] of g)
      T = T.split(`${_}*`).join(`${_}{0,${b}}`).split(`${_}+`).join(`${_}{1,${b}}`);
    return T;
  }, x = (T, _, b) => {
    const N = w(_), $ = u++;
    a(T, $, _), c[T] = $, l[$] = _, d[$] = N, s[$] = new RegExp(_, b ? "g" : void 0), o[$] = new RegExp(N, b ? "g" : void 0);
  };
  x("NUMERICIDENTIFIER", "0|[1-9]\\d*"), x("NUMERICIDENTIFIERLOOSE", "\\d+"), x("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${p}*`), x("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), x("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), x("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), x("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), x("BUILDIDENTIFIER", `${p}+`), x("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), x("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), x("FULL", `^${l[c.FULLPLAIN]}$`), x("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), x("LOOSE", `^${l[c.LOOSEPLAIN]}$`), x("GTLT", "((?:<|>)?=?)"), x("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), x("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), x("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), x("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), x("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), x("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), x("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), x("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), x("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), x("COERCERTL", l[c.COERCE], !0), x("COERCERTLFULL", l[c.COERCEFULL], !0), x("LONETILDE", "(?:~>?)"), x("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", x("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), x("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), x("LONECARET", "(?:\\^)"), x("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", x("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), x("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), x("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), x("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), x("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", x("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), x("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), x("STAR", "(<|>)?=?\\s*\\*"), x("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), x("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Qa, Qa.exports);
var gn = Qa.exports;
const Zy = Object.freeze({ loose: !0 }), ex = Object.freeze({}), tx = (e) => e ? typeof e != "object" ? Zy : e : ex;
var Ps = tx;
const ll = /^[0-9]+$/, wf = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = ll.test(e), n = ll.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, rx = (e, t) => wf(t, e);
var Ef = {
  compareIdentifiers: wf,
  rcompareIdentifiers: rx
};
const Mn = Ni, { MAX_LENGTH: cl, MAX_SAFE_INTEGER: Bn } = ki, { safeRe: zn, t: jn } = gn, nx = Ps, { compareIdentifiers: ya } = Ef;
let ix = class it {
  constructor(t, r) {
    if (r = nx(r), t instanceof it) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > cl)
      throw new TypeError(
        `version is longer than ${cl} characters`
      );
    Mn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? zn[jn.LOOSE] : zn[jn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Bn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Bn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Bn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const a = +i;
        if (a >= 0 && a < Bn)
          return a;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Mn("SemVer.compare", this.version, this.options, t), !(t instanceof it)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new it(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof it || (t = new it(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof it || (t = new it(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (Mn("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return ya(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof it || (t = new it(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (Mn("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return ya(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? zn[jn.PRERELEASELOOSE] : zn[jn.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let a = [r, i];
          n === !1 && (a = [r]), ya(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var $e = ix;
const ul = $e, ax = (e, t, r = !1) => {
  if (e instanceof ul)
    return e;
  try {
    return new ul(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Cr = ax;
const sx = Cr, ox = (e, t) => {
  const r = sx(e, t);
  return r ? r.version : null;
};
var lx = ox;
const cx = Cr, ux = (e, t) => {
  const r = cx(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var fx = ux;
const fl = $e, dx = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new fl(
      e instanceof fl ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var px = dx;
const dl = Cr, hx = (e, t) => {
  const r = dl(e, null, !0), n = dl(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const a = i > 0, s = a ? r : n, o = a ? n : r, l = !!s.prerelease.length;
  if (!!o.prerelease.length && !l) {
    if (!o.patch && !o.minor)
      return "major";
    if (o.compareMain(s) === 0)
      return o.minor && !o.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return r.major !== n.major ? c + "major" : r.minor !== n.minor ? c + "minor" : r.patch !== n.patch ? c + "patch" : "prerelease";
};
var mx = hx;
const gx = $e, yx = (e, t) => new gx(e, t).major;
var xx = yx;
const wx = $e, Ex = (e, t) => new wx(e, t).minor;
var vx = Ex;
const Tx = $e, _x = (e, t) => new Tx(e, t).patch;
var bx = _x;
const Sx = Cr, Ax = (e, t) => {
  const r = Sx(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Ix = Ax;
const pl = $e, Cx = (e, t, r) => new pl(e, r).compare(new pl(t, r));
var Qe = Cx;
const Rx = Qe, Ox = (e, t, r) => Rx(t, e, r);
var Dx = Ox;
const Px = Qe, kx = (e, t) => Px(e, t, !0);
var Nx = kx;
const hl = $e, Fx = (e, t, r) => {
  const n = new hl(e, r), i = new hl(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var ks = Fx;
const $x = ks, Lx = (e, t) => e.sort((r, n) => $x(r, n, t));
var Ux = Lx;
const Mx = ks, Bx = (e, t) => e.sort((r, n) => Mx(n, r, t));
var zx = Bx;
const jx = Qe, Gx = (e, t, r) => jx(e, t, r) > 0;
var Fi = Gx;
const Hx = Qe, qx = (e, t, r) => Hx(e, t, r) < 0;
var Ns = qx;
const Xx = Qe, Wx = (e, t, r) => Xx(e, t, r) === 0;
var vf = Wx;
const Vx = Qe, Yx = (e, t, r) => Vx(e, t, r) !== 0;
var Tf = Yx;
const Kx = Qe, Jx = (e, t, r) => Kx(e, t, r) >= 0;
var Fs = Jx;
const Qx = Qe, Zx = (e, t, r) => Qx(e, t, r) <= 0;
var $s = Zx;
const ew = vf, tw = Tf, rw = Fi, nw = Fs, iw = Ns, aw = $s, sw = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return ew(e, r, n);
    case "!=":
      return tw(e, r, n);
    case ">":
      return rw(e, r, n);
    case ">=":
      return nw(e, r, n);
    case "<":
      return iw(e, r, n);
    case "<=":
      return aw(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var _f = sw;
const ow = $e, lw = Cr, { safeRe: Gn, t: Hn } = gn, cw = (e, t) => {
  if (e instanceof ow)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Gn[Hn.COERCEFULL] : Gn[Hn.COERCE]);
  else {
    const l = t.includePrerelease ? Gn[Hn.COERCERTLFULL] : Gn[Hn.COERCERTL];
    let d;
    for (; (d = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), l.lastIndex = d.index + d[1].length + d[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", a = r[4] || "0", s = t.includePrerelease && r[5] ? `-${r[5]}` : "", o = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return lw(`${n}.${i}.${a}${s}${o}`, t);
};
var uw = cw;
class fw {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var dw = fw, xa, ml;
function Ze() {
  if (ml) return xa;
  ml = 1;
  const e = /\s+/g;
  class t {
    constructor(I, D) {
      if (D = i(D), I instanceof t)
        return I.loose === !!D.loose && I.includePrerelease === !!D.includePrerelease ? I : new t(I.raw, D);
      if (I instanceof a)
        return this.raw = I.value, this.set = [[I]], this.formatted = void 0, this;
      if (this.options = D, this.loose = !!D.loose, this.includePrerelease = !!D.includePrerelease, this.raw = I.trim().replace(e, " "), this.set = this.raw.split("||").map((A) => this.parseRange(A.trim())).filter((A) => A.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const A = this.set[0];
        if (this.set = this.set.filter((k) => !x(k[0])), this.set.length === 0)
          this.set = [A];
        else if (this.set.length > 1) {
          for (const k of this.set)
            if (k.length === 1 && T(k[0])) {
              this.set = [k];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let I = 0; I < this.set.length; I++) {
          I > 0 && (this.formatted += "||");
          const D = this.set[I];
          for (let A = 0; A < D.length; A++)
            A > 0 && (this.formatted += " "), this.formatted += D[A].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(I) {
      const A = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + I, k = n.get(A);
      if (k)
        return k;
      const O = this.options.loose, M = O ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      I = I.replace(M, B(this.options.includePrerelease)), s("hyphen replace", I), I = I.replace(l[d.COMPARATORTRIM], c), s("comparator trim", I), I = I.replace(l[d.TILDETRIM], u), s("tilde trim", I), I = I.replace(l[d.CARETTRIM], p), s("caret trim", I);
      let X = I.split(" ").map((U) => b(U, this.options)).join(" ").split(/\s+/).map((U) => z(U, this.options));
      O && (X = X.filter((U) => (s("loose invalid filter", U, this.options), !!U.match(l[d.COMPARATORLOOSE])))), s("range list", X);
      const j = /* @__PURE__ */ new Map(), Z = X.map((U) => new a(U, this.options));
      for (const U of Z) {
        if (x(U))
          return [U];
        j.set(U.value, U);
      }
      j.size > 1 && j.has("") && j.delete("");
      const he = [...j.values()];
      return n.set(A, he), he;
    }
    intersects(I, D) {
      if (!(I instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((A) => _(A, D) && I.set.some((k) => _(k, D) && A.every((O) => k.every((M) => O.intersects(M, D)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(I) {
      if (!I)
        return !1;
      if (typeof I == "string")
        try {
          I = new o(I, this.options);
        } catch {
          return !1;
        }
      for (let D = 0; D < this.set.length; D++)
        if (Q(this.set[D], I, this.options))
          return !0;
      return !1;
    }
  }
  xa = t;
  const r = dw, n = new r(), i = Ps, a = $i(), s = Ni, o = $e, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: c,
    tildeTrimReplace: u,
    caretTrimReplace: p
  } = gn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = ki, x = (R) => R.value === "<0.0.0-0", T = (R) => R.value === "", _ = (R, I) => {
    let D = !0;
    const A = R.slice();
    let k = A.pop();
    for (; D && A.length; )
      D = A.every((O) => k.intersects(O, I)), k = A.pop();
    return D;
  }, b = (R, I) => (R = R.replace(l[d.BUILD], ""), s("comp", R, I), R = ue(R, I), s("caret", R), R = $(R, I), s("tildes", R), R = Me(R, I), s("xrange", R), R = q(R, I), s("stars", R), R), N = (R) => !R || R.toLowerCase() === "x" || R === "*", $ = (R, I) => R.trim().split(/\s+/).map((D) => ie(D, I)).join(" "), ie = (R, I) => {
    const D = I.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return R.replace(D, (A, k, O, M, X) => {
      s("tilde", R, A, k, O, M, X);
      let j;
      return N(k) ? j = "" : N(O) ? j = `>=${k}.0.0 <${+k + 1}.0.0-0` : N(M) ? j = `>=${k}.${O}.0 <${k}.${+O + 1}.0-0` : X ? (s("replaceTilde pr", X), j = `>=${k}.${O}.${M}-${X} <${k}.${+O + 1}.0-0`) : j = `>=${k}.${O}.${M} <${k}.${+O + 1}.0-0`, s("tilde return", j), j;
    });
  }, ue = (R, I) => R.trim().split(/\s+/).map((D) => Y(D, I)).join(" "), Y = (R, I) => {
    s("caret", R, I);
    const D = I.loose ? l[d.CARETLOOSE] : l[d.CARET], A = I.includePrerelease ? "-0" : "";
    return R.replace(D, (k, O, M, X, j) => {
      s("caret", R, k, O, M, X, j);
      let Z;
      return N(O) ? Z = "" : N(M) ? Z = `>=${O}.0.0${A} <${+O + 1}.0.0-0` : N(X) ? O === "0" ? Z = `>=${O}.${M}.0${A} <${O}.${+M + 1}.0-0` : Z = `>=${O}.${M}.0${A} <${+O + 1}.0.0-0` : j ? (s("replaceCaret pr", j), O === "0" ? M === "0" ? Z = `>=${O}.${M}.${X}-${j} <${O}.${M}.${+X + 1}-0` : Z = `>=${O}.${M}.${X}-${j} <${O}.${+M + 1}.0-0` : Z = `>=${O}.${M}.${X}-${j} <${+O + 1}.0.0-0`) : (s("no pr"), O === "0" ? M === "0" ? Z = `>=${O}.${M}.${X}${A} <${O}.${M}.${+X + 1}-0` : Z = `>=${O}.${M}.${X}${A} <${O}.${+M + 1}.0-0` : Z = `>=${O}.${M}.${X} <${+O + 1}.0.0-0`), s("caret return", Z), Z;
    });
  }, Me = (R, I) => (s("replaceXRanges", R, I), R.split(/\s+/).map((D) => y(D, I)).join(" ")), y = (R, I) => {
    R = R.trim();
    const D = I.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return R.replace(D, (A, k, O, M, X, j) => {
      s("xRange", R, A, k, O, M, X, j);
      const Z = N(O), he = Z || N(M), U = he || N(X), et = U;
      return k === "=" && et && (k = ""), j = I.includePrerelease ? "-0" : "", Z ? k === ">" || k === "<" ? A = "<0.0.0-0" : A = "*" : k && et ? (he && (M = 0), X = 0, k === ">" ? (k = ">=", he ? (O = +O + 1, M = 0, X = 0) : (M = +M + 1, X = 0)) : k === "<=" && (k = "<", he ? O = +O + 1 : M = +M + 1), k === "<" && (j = "-0"), A = `${k + O}.${M}.${X}${j}`) : he ? A = `>=${O}.0.0${j} <${+O + 1}.0.0-0` : U && (A = `>=${O}.${M}.0${j} <${O}.${+M + 1}.0-0`), s("xRange return", A), A;
    });
  }, q = (R, I) => (s("replaceStars", R, I), R.trim().replace(l[d.STAR], "")), z = (R, I) => (s("replaceGTE0", R, I), R.trim().replace(l[I.includePrerelease ? d.GTE0PRE : d.GTE0], "")), B = (R) => (I, D, A, k, O, M, X, j, Z, he, U, et) => (N(A) ? D = "" : N(k) ? D = `>=${A}.0.0${R ? "-0" : ""}` : N(O) ? D = `>=${A}.${k}.0${R ? "-0" : ""}` : M ? D = `>=${D}` : D = `>=${D}${R ? "-0" : ""}`, N(Z) ? j = "" : N(he) ? j = `<${+Z + 1}.0.0-0` : N(U) ? j = `<${Z}.${+he + 1}.0-0` : et ? j = `<=${Z}.${he}.${U}-${et}` : R ? j = `<${Z}.${he}.${+U + 1}-0` : j = `<=${j}`, `${D} ${j}`.trim()), Q = (R, I, D) => {
    for (let A = 0; A < R.length; A++)
      if (!R[A].test(I))
        return !1;
    if (I.prerelease.length && !D.includePrerelease) {
      for (let A = 0; A < R.length; A++)
        if (s(R[A].semver), R[A].semver !== a.ANY && R[A].semver.prerelease.length > 0) {
          const k = R[A].semver;
          if (k.major === I.major && k.minor === I.minor && k.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return xa;
}
var wa, gl;
function $i() {
  if (gl) return wa;
  gl = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, u) {
      if (u = r(u), c instanceof t) {
        if (c.loose === !!u.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), s("comparator", c, u), this.options = u, this.loose = !!u.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(c) {
      const u = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], p = c.match(u);
      if (!p)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = p[1] !== void 0 ? p[1] : "", this.operator === "=" && (this.operator = ""), p[2] ? this.semver = new o(p[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (s("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new o(c, this.options);
        } catch {
          return !1;
        }
      return a(c, this.operator, this.semver, this.options);
    }
    intersects(c, u) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, u).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, u).test(c.semver) : (u = r(u), u.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !u.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || a(this.semver, "<", c.semver, u) && this.operator.startsWith(">") && c.operator.startsWith("<") || a(this.semver, ">", c.semver, u) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  wa = t;
  const r = Ps, { safeRe: n, t: i } = gn, a = _f, s = Ni, o = $e, l = Ze();
  return wa;
}
const pw = Ze(), hw = (e, t, r) => {
  try {
    t = new pw(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Li = hw;
const mw = Ze(), gw = (e, t) => new mw(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var yw = gw;
const xw = $e, ww = Ze(), Ew = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new ww(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === -1) && (n = s, i = new xw(n, r));
  }), n;
};
var vw = Ew;
const Tw = $e, _w = Ze(), bw = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new _w(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === 1) && (n = s, i = new Tw(n, r));
  }), n;
};
var Sw = bw;
const Ea = $e, Aw = Ze(), yl = Fi, Iw = (e, t) => {
  e = new Aw(e, t);
  let r = new Ea("0.0.0");
  if (e.test(r) || (r = new Ea("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let a = null;
    i.forEach((s) => {
      const o = new Ea(s.semver.version);
      switch (s.operator) {
        case ">":
          o.prerelease.length === 0 ? o.patch++ : o.prerelease.push(0), o.raw = o.format();
        case "":
        case ">=":
          (!a || yl(o, a)) && (a = o);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), a && (!r || yl(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var Cw = Iw;
const Rw = Ze(), Ow = (e, t) => {
  try {
    return new Rw(e, t).range || "*";
  } catch {
    return null;
  }
};
var Dw = Ow;
const Pw = $e, bf = $i(), { ANY: kw } = bf, Nw = Ze(), Fw = Li, xl = Fi, wl = Ns, $w = $s, Lw = Fs, Uw = (e, t, r, n) => {
  e = new Pw(e, n), t = new Nw(t, n);
  let i, a, s, o, l;
  switch (r) {
    case ">":
      i = xl, a = $w, s = wl, o = ">", l = ">=";
      break;
    case "<":
      i = wl, a = Lw, s = xl, o = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Fw(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const c = t.set[d];
    let u = null, p = null;
    if (c.forEach((g) => {
      g.semver === kw && (g = new bf(">=0.0.0")), u = u || g, p = p || g, i(g.semver, u.semver, n) ? u = g : s(g.semver, p.semver, n) && (p = g);
    }), u.operator === o || u.operator === l || (!p.operator || p.operator === o) && a(e, p.semver))
      return !1;
    if (p.operator === l && s(e, p.semver))
      return !1;
  }
  return !0;
};
var Ls = Uw;
const Mw = Ls, Bw = (e, t, r) => Mw(e, t, ">", r);
var zw = Bw;
const jw = Ls, Gw = (e, t, r) => jw(e, t, "<", r);
var Hw = Gw;
const El = Ze(), qw = (e, t, r) => (e = new El(e, r), t = new El(t, r), e.intersects(t, r));
var Xw = qw;
const Ww = Li, Vw = Qe;
var Yw = (e, t, r) => {
  const n = [];
  let i = null, a = null;
  const s = e.sort((c, u) => Vw(c, u, r));
  for (const c of s)
    Ww(c, t, r) ? (a = c, i || (i = c)) : (a && n.push([i, a]), a = null, i = null);
  i && n.push([i, null]);
  const o = [];
  for (const [c, u] of n)
    c === u ? o.push(c) : !u && c === s[0] ? o.push("*") : u ? c === s[0] ? o.push(`<=${u}`) : o.push(`${c} - ${u}`) : o.push(`>=${c}`);
  const l = o.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const vl = Ze(), Us = $i(), { ANY: va } = Us, Lr = Li, Ms = Qe, Kw = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new vl(e, r), t = new vl(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const a of t.set) {
      const s = Qw(i, a, r);
      if (n = n || s !== null, s)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Jw = [new Us(">=0.0.0-0")], Tl = [new Us(">=0.0.0")], Qw = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === va) {
    if (t.length === 1 && t[0].semver === va)
      return !0;
    r.includePrerelease ? e = Jw : e = Tl;
  }
  if (t.length === 1 && t[0].semver === va) {
    if (r.includePrerelease)
      return !0;
    t = Tl;
  }
  const n = /* @__PURE__ */ new Set();
  let i, a;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = _l(i, g, r) : g.operator === "<" || g.operator === "<=" ? a = bl(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let s;
  if (i && a) {
    if (s = Ms(i.semver, a.semver, r), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (i && !Lr(g, String(i), r) || a && !Lr(g, String(a), r))
      return null;
    for (const w of t)
      if (!Lr(g, String(w), r))
        return !1;
    return !0;
  }
  let o, l, d, c, u = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, p = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && a.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const g of t) {
    if (c = c || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", i) {
      if (p && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === p.major && g.semver.minor === p.minor && g.semver.patch === p.patch && (p = !1), g.operator === ">" || g.operator === ">=") {
        if (o = _l(i, g, r), o === g && o !== i)
          return !1;
      } else if (i.operator === ">=" && !Lr(i.semver, String(g), r))
        return !1;
    }
    if (a) {
      if (u && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === u.major && g.semver.minor === u.minor && g.semver.patch === u.patch && (u = !1), g.operator === "<" || g.operator === "<=") {
        if (l = bl(a, g, r), l === g && l !== a)
          return !1;
      } else if (a.operator === "<=" && !Lr(a.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (a || i) && s !== 0)
      return !1;
  }
  return !(i && d && !a && s !== 0 || a && c && !i && s !== 0 || p || u);
}, _l = (e, t, r) => {
  if (!e)
    return t;
  const n = Ms(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, bl = (e, t, r) => {
  if (!e)
    return t;
  const n = Ms(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Zw = Kw;
const Ta = gn, Sl = ki, eE = $e, Al = Ef, tE = Cr, rE = lx, nE = fx, iE = px, aE = mx, sE = xx, oE = vx, lE = bx, cE = Ix, uE = Qe, fE = Dx, dE = Nx, pE = ks, hE = Ux, mE = zx, gE = Fi, yE = Ns, xE = vf, wE = Tf, EE = Fs, vE = $s, TE = _f, _E = uw, bE = $i(), SE = Ze(), AE = Li, IE = yw, CE = vw, RE = Sw, OE = Cw, DE = Dw, PE = Ls, kE = zw, NE = Hw, FE = Xw, $E = Yw, LE = Zw;
var Sf = {
  parse: tE,
  valid: rE,
  clean: nE,
  inc: iE,
  diff: aE,
  major: sE,
  minor: oE,
  patch: lE,
  prerelease: cE,
  compare: uE,
  rcompare: fE,
  compareLoose: dE,
  compareBuild: pE,
  sort: hE,
  rsort: mE,
  gt: gE,
  lt: yE,
  eq: xE,
  neq: wE,
  gte: EE,
  lte: vE,
  cmp: TE,
  coerce: _E,
  Comparator: bE,
  Range: SE,
  satisfies: AE,
  toComparators: IE,
  maxSatisfying: CE,
  minSatisfying: RE,
  minVersion: OE,
  validRange: DE,
  outside: PE,
  gtr: kE,
  ltr: NE,
  intersects: FE,
  simplifyRange: $E,
  subset: LE,
  SemVer: eE,
  re: Ta.re,
  src: Ta.src,
  tokens: Ta.t,
  SEMVER_SPEC_VERSION: Sl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Sl.RELEASE_TYPES,
  compareIdentifiers: Al.compareIdentifiers,
  rcompareIdentifiers: Al.rcompareIdentifiers
}, yn = {}, xi = { exports: {} };
xi.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, a = 2, s = 9007199254740991, o = "[object Arguments]", l = "[object Array]", d = "[object AsyncFunction]", c = "[object Boolean]", u = "[object Date]", p = "[object Error]", g = "[object Function]", w = "[object GeneratorFunction]", x = "[object Map]", T = "[object Number]", _ = "[object Null]", b = "[object Object]", N = "[object Promise]", $ = "[object Proxy]", ie = "[object RegExp]", ue = "[object Set]", Y = "[object String]", Me = "[object Symbol]", y = "[object Undefined]", q = "[object WeakMap]", z = "[object ArrayBuffer]", B = "[object DataView]", Q = "[object Float32Array]", R = "[object Float64Array]", I = "[object Int8Array]", D = "[object Int16Array]", A = "[object Int32Array]", k = "[object Uint8Array]", O = "[object Uint8ClampedArray]", M = "[object Uint16Array]", X = "[object Uint32Array]", j = /[\\^$.*+?()[\]{}|]/g, Z = /^\[object .+?Constructor\]$/, he = /^(?:0|[1-9]\d*)$/, U = {};
  U[Q] = U[R] = U[I] = U[D] = U[A] = U[k] = U[O] = U[M] = U[X] = !0, U[o] = U[l] = U[z] = U[c] = U[B] = U[u] = U[p] = U[g] = U[x] = U[T] = U[b] = U[ie] = U[ue] = U[Y] = U[q] = !1;
  var et = typeof Oe == "object" && Oe && Oe.Object === Object && Oe, h = typeof self == "object" && self && self.Object === Object && self, f = et || h || Function("return this")(), S = t && !t.nodeType && t, v = S && !0 && e && !e.nodeType && e, K = v && v.exports === S, re = K && et.process, le = function() {
    try {
      return re && re.binding && re.binding("util");
    } catch {
    }
  }(), we = le && le.isTypedArray;
  function _e(m, E) {
    for (var C = -1, F = m == null ? 0 : m.length, ne = 0, H = []; ++C < F; ) {
      var ce = m[C];
      E(ce, C, m) && (H[ne++] = ce);
    }
    return H;
  }
  function ht(m, E) {
    for (var C = -1, F = E.length, ne = m.length; ++C < F; )
      m[ne + C] = E[C];
    return m;
  }
  function de(m, E) {
    for (var C = -1, F = m == null ? 0 : m.length; ++C < F; )
      if (E(m[C], C, m))
        return !0;
    return !1;
  }
  function Ve(m, E) {
    for (var C = -1, F = Array(m); ++C < m; )
      F[C] = E(C);
    return F;
  }
  function Ki(m) {
    return function(E) {
      return m(E);
    };
  }
  function _n(m, E) {
    return m.has(E);
  }
  function Or(m, E) {
    return m == null ? void 0 : m[E];
  }
  function bn(m) {
    var E = -1, C = Array(m.size);
    return m.forEach(function(F, ne) {
      C[++E] = [ne, F];
    }), C;
  }
  function cd(m, E) {
    return function(C) {
      return m(E(C));
    };
  }
  function ud(m) {
    var E = -1, C = Array(m.size);
    return m.forEach(function(F) {
      C[++E] = F;
    }), C;
  }
  var fd = Array.prototype, dd = Function.prototype, Sn = Object.prototype, Ji = f["__core-js_shared__"], Ys = dd.toString, tt = Sn.hasOwnProperty, Ks = function() {
    var m = /[^.]+$/.exec(Ji && Ji.keys && Ji.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), Js = Sn.toString, pd = RegExp(
    "^" + Ys.call(tt).replace(j, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Qs = K ? f.Buffer : void 0, An = f.Symbol, Zs = f.Uint8Array, eo = Sn.propertyIsEnumerable, hd = fd.splice, Nt = An ? An.toStringTag : void 0, to = Object.getOwnPropertySymbols, md = Qs ? Qs.isBuffer : void 0, gd = cd(Object.keys, Object), Qi = rr(f, "DataView"), Dr = rr(f, "Map"), Zi = rr(f, "Promise"), ea = rr(f, "Set"), ta = rr(f, "WeakMap"), Pr = rr(Object, "create"), yd = Lt(Qi), xd = Lt(Dr), wd = Lt(Zi), Ed = Lt(ea), vd = Lt(ta), ro = An ? An.prototype : void 0, ra = ro ? ro.valueOf : void 0;
  function Ft(m) {
    var E = -1, C = m == null ? 0 : m.length;
    for (this.clear(); ++E < C; ) {
      var F = m[E];
      this.set(F[0], F[1]);
    }
  }
  function Td() {
    this.__data__ = Pr ? Pr(null) : {}, this.size = 0;
  }
  function _d(m) {
    var E = this.has(m) && delete this.__data__[m];
    return this.size -= E ? 1 : 0, E;
  }
  function bd(m) {
    var E = this.__data__;
    if (Pr) {
      var C = E[m];
      return C === n ? void 0 : C;
    }
    return tt.call(E, m) ? E[m] : void 0;
  }
  function Sd(m) {
    var E = this.__data__;
    return Pr ? E[m] !== void 0 : tt.call(E, m);
  }
  function Ad(m, E) {
    var C = this.__data__;
    return this.size += this.has(m) ? 0 : 1, C[m] = Pr && E === void 0 ? n : E, this;
  }
  Ft.prototype.clear = Td, Ft.prototype.delete = _d, Ft.prototype.get = bd, Ft.prototype.has = Sd, Ft.prototype.set = Ad;
  function lt(m) {
    var E = -1, C = m == null ? 0 : m.length;
    for (this.clear(); ++E < C; ) {
      var F = m[E];
      this.set(F[0], F[1]);
    }
  }
  function Id() {
    this.__data__ = [], this.size = 0;
  }
  function Cd(m) {
    var E = this.__data__, C = Cn(E, m);
    if (C < 0)
      return !1;
    var F = E.length - 1;
    return C == F ? E.pop() : hd.call(E, C, 1), --this.size, !0;
  }
  function Rd(m) {
    var E = this.__data__, C = Cn(E, m);
    return C < 0 ? void 0 : E[C][1];
  }
  function Od(m) {
    return Cn(this.__data__, m) > -1;
  }
  function Dd(m, E) {
    var C = this.__data__, F = Cn(C, m);
    return F < 0 ? (++this.size, C.push([m, E])) : C[F][1] = E, this;
  }
  lt.prototype.clear = Id, lt.prototype.delete = Cd, lt.prototype.get = Rd, lt.prototype.has = Od, lt.prototype.set = Dd;
  function $t(m) {
    var E = -1, C = m == null ? 0 : m.length;
    for (this.clear(); ++E < C; ) {
      var F = m[E];
      this.set(F[0], F[1]);
    }
  }
  function Pd() {
    this.size = 0, this.__data__ = {
      hash: new Ft(),
      map: new (Dr || lt)(),
      string: new Ft()
    };
  }
  function kd(m) {
    var E = Rn(this, m).delete(m);
    return this.size -= E ? 1 : 0, E;
  }
  function Nd(m) {
    return Rn(this, m).get(m);
  }
  function Fd(m) {
    return Rn(this, m).has(m);
  }
  function $d(m, E) {
    var C = Rn(this, m), F = C.size;
    return C.set(m, E), this.size += C.size == F ? 0 : 1, this;
  }
  $t.prototype.clear = Pd, $t.prototype.delete = kd, $t.prototype.get = Nd, $t.prototype.has = Fd, $t.prototype.set = $d;
  function In(m) {
    var E = -1, C = m == null ? 0 : m.length;
    for (this.__data__ = new $t(); ++E < C; )
      this.add(m[E]);
  }
  function Ld(m) {
    return this.__data__.set(m, n), this;
  }
  function Ud(m) {
    return this.__data__.has(m);
  }
  In.prototype.add = In.prototype.push = Ld, In.prototype.has = Ud;
  function mt(m) {
    var E = this.__data__ = new lt(m);
    this.size = E.size;
  }
  function Md() {
    this.__data__ = new lt(), this.size = 0;
  }
  function Bd(m) {
    var E = this.__data__, C = E.delete(m);
    return this.size = E.size, C;
  }
  function zd(m) {
    return this.__data__.get(m);
  }
  function jd(m) {
    return this.__data__.has(m);
  }
  function Gd(m, E) {
    var C = this.__data__;
    if (C instanceof lt) {
      var F = C.__data__;
      if (!Dr || F.length < r - 1)
        return F.push([m, E]), this.size = ++C.size, this;
      C = this.__data__ = new $t(F);
    }
    return C.set(m, E), this.size = C.size, this;
  }
  mt.prototype.clear = Md, mt.prototype.delete = Bd, mt.prototype.get = zd, mt.prototype.has = jd, mt.prototype.set = Gd;
  function Hd(m, E) {
    var C = On(m), F = !C && ap(m), ne = !C && !F && na(m), H = !C && !F && !ne && fo(m), ce = C || F || ne || H, me = ce ? Ve(m.length, String) : [], Ee = me.length;
    for (var ae in m)
      tt.call(m, ae) && !(ce && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ae == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ne && (ae == "offset" || ae == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      H && (ae == "buffer" || ae == "byteLength" || ae == "byteOffset") || // Skip index properties.
      ep(ae, Ee))) && me.push(ae);
    return me;
  }
  function Cn(m, E) {
    for (var C = m.length; C--; )
      if (oo(m[C][0], E))
        return C;
    return -1;
  }
  function qd(m, E, C) {
    var F = E(m);
    return On(m) ? F : ht(F, C(m));
  }
  function kr(m) {
    return m == null ? m === void 0 ? y : _ : Nt && Nt in Object(m) ? Qd(m) : ip(m);
  }
  function no(m) {
    return Nr(m) && kr(m) == o;
  }
  function io(m, E, C, F, ne) {
    return m === E ? !0 : m == null || E == null || !Nr(m) && !Nr(E) ? m !== m && E !== E : Xd(m, E, C, F, io, ne);
  }
  function Xd(m, E, C, F, ne, H) {
    var ce = On(m), me = On(E), Ee = ce ? l : gt(m), ae = me ? l : gt(E);
    Ee = Ee == o ? b : Ee, ae = ae == o ? b : ae;
    var Be = Ee == b, Ye = ae == b, be = Ee == ae;
    if (be && na(m)) {
      if (!na(E))
        return !1;
      ce = !0, Be = !1;
    }
    if (be && !Be)
      return H || (H = new mt()), ce || fo(m) ? ao(m, E, C, F, ne, H) : Kd(m, E, Ee, C, F, ne, H);
    if (!(C & i)) {
      var He = Be && tt.call(m, "__wrapped__"), qe = Ye && tt.call(E, "__wrapped__");
      if (He || qe) {
        var yt = He ? m.value() : m, ct = qe ? E.value() : E;
        return H || (H = new mt()), ne(yt, ct, C, F, H);
      }
    }
    return be ? (H || (H = new mt()), Jd(m, E, C, F, ne, H)) : !1;
  }
  function Wd(m) {
    if (!uo(m) || rp(m))
      return !1;
    var E = lo(m) ? pd : Z;
    return E.test(Lt(m));
  }
  function Vd(m) {
    return Nr(m) && co(m.length) && !!U[kr(m)];
  }
  function Yd(m) {
    if (!np(m))
      return gd(m);
    var E = [];
    for (var C in Object(m))
      tt.call(m, C) && C != "constructor" && E.push(C);
    return E;
  }
  function ao(m, E, C, F, ne, H) {
    var ce = C & i, me = m.length, Ee = E.length;
    if (me != Ee && !(ce && Ee > me))
      return !1;
    var ae = H.get(m);
    if (ae && H.get(E))
      return ae == E;
    var Be = -1, Ye = !0, be = C & a ? new In() : void 0;
    for (H.set(m, E), H.set(E, m); ++Be < me; ) {
      var He = m[Be], qe = E[Be];
      if (F)
        var yt = ce ? F(qe, He, Be, E, m, H) : F(He, qe, Be, m, E, H);
      if (yt !== void 0) {
        if (yt)
          continue;
        Ye = !1;
        break;
      }
      if (be) {
        if (!de(E, function(ct, Ut) {
          if (!_n(be, Ut) && (He === ct || ne(He, ct, C, F, H)))
            return be.push(Ut);
        })) {
          Ye = !1;
          break;
        }
      } else if (!(He === qe || ne(He, qe, C, F, H))) {
        Ye = !1;
        break;
      }
    }
    return H.delete(m), H.delete(E), Ye;
  }
  function Kd(m, E, C, F, ne, H, ce) {
    switch (C) {
      case B:
        if (m.byteLength != E.byteLength || m.byteOffset != E.byteOffset)
          return !1;
        m = m.buffer, E = E.buffer;
      case z:
        return !(m.byteLength != E.byteLength || !H(new Zs(m), new Zs(E)));
      case c:
      case u:
      case T:
        return oo(+m, +E);
      case p:
        return m.name == E.name && m.message == E.message;
      case ie:
      case Y:
        return m == E + "";
      case x:
        var me = bn;
      case ue:
        var Ee = F & i;
        if (me || (me = ud), m.size != E.size && !Ee)
          return !1;
        var ae = ce.get(m);
        if (ae)
          return ae == E;
        F |= a, ce.set(m, E);
        var Be = ao(me(m), me(E), F, ne, H, ce);
        return ce.delete(m), Be;
      case Me:
        if (ra)
          return ra.call(m) == ra.call(E);
    }
    return !1;
  }
  function Jd(m, E, C, F, ne, H) {
    var ce = C & i, me = so(m), Ee = me.length, ae = so(E), Be = ae.length;
    if (Ee != Be && !ce)
      return !1;
    for (var Ye = Ee; Ye--; ) {
      var be = me[Ye];
      if (!(ce ? be in E : tt.call(E, be)))
        return !1;
    }
    var He = H.get(m);
    if (He && H.get(E))
      return He == E;
    var qe = !0;
    H.set(m, E), H.set(E, m);
    for (var yt = ce; ++Ye < Ee; ) {
      be = me[Ye];
      var ct = m[be], Ut = E[be];
      if (F)
        var po = ce ? F(Ut, ct, be, E, m, H) : F(ct, Ut, be, m, E, H);
      if (!(po === void 0 ? ct === Ut || ne(ct, Ut, C, F, H) : po)) {
        qe = !1;
        break;
      }
      yt || (yt = be == "constructor");
    }
    if (qe && !yt) {
      var Dn = m.constructor, Pn = E.constructor;
      Dn != Pn && "constructor" in m && "constructor" in E && !(typeof Dn == "function" && Dn instanceof Dn && typeof Pn == "function" && Pn instanceof Pn) && (qe = !1);
    }
    return H.delete(m), H.delete(E), qe;
  }
  function so(m) {
    return qd(m, lp, Zd);
  }
  function Rn(m, E) {
    var C = m.__data__;
    return tp(E) ? C[typeof E == "string" ? "string" : "hash"] : C.map;
  }
  function rr(m, E) {
    var C = Or(m, E);
    return Wd(C) ? C : void 0;
  }
  function Qd(m) {
    var E = tt.call(m, Nt), C = m[Nt];
    try {
      m[Nt] = void 0;
      var F = !0;
    } catch {
    }
    var ne = Js.call(m);
    return F && (E ? m[Nt] = C : delete m[Nt]), ne;
  }
  var Zd = to ? function(m) {
    return m == null ? [] : (m = Object(m), _e(to(m), function(E) {
      return eo.call(m, E);
    }));
  } : cp, gt = kr;
  (Qi && gt(new Qi(new ArrayBuffer(1))) != B || Dr && gt(new Dr()) != x || Zi && gt(Zi.resolve()) != N || ea && gt(new ea()) != ue || ta && gt(new ta()) != q) && (gt = function(m) {
    var E = kr(m), C = E == b ? m.constructor : void 0, F = C ? Lt(C) : "";
    if (F)
      switch (F) {
        case yd:
          return B;
        case xd:
          return x;
        case wd:
          return N;
        case Ed:
          return ue;
        case vd:
          return q;
      }
    return E;
  });
  function ep(m, E) {
    return E = E ?? s, !!E && (typeof m == "number" || he.test(m)) && m > -1 && m % 1 == 0 && m < E;
  }
  function tp(m) {
    var E = typeof m;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? m !== "__proto__" : m === null;
  }
  function rp(m) {
    return !!Ks && Ks in m;
  }
  function np(m) {
    var E = m && m.constructor, C = typeof E == "function" && E.prototype || Sn;
    return m === C;
  }
  function ip(m) {
    return Js.call(m);
  }
  function Lt(m) {
    if (m != null) {
      try {
        return Ys.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function oo(m, E) {
    return m === E || m !== m && E !== E;
  }
  var ap = no(/* @__PURE__ */ function() {
    return arguments;
  }()) ? no : function(m) {
    return Nr(m) && tt.call(m, "callee") && !eo.call(m, "callee");
  }, On = Array.isArray;
  function sp(m) {
    return m != null && co(m.length) && !lo(m);
  }
  var na = md || up;
  function op(m, E) {
    return io(m, E);
  }
  function lo(m) {
    if (!uo(m))
      return !1;
    var E = kr(m);
    return E == g || E == w || E == d || E == $;
  }
  function co(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= s;
  }
  function uo(m) {
    var E = typeof m;
    return m != null && (E == "object" || E == "function");
  }
  function Nr(m) {
    return m != null && typeof m == "object";
  }
  var fo = we ? Ki(we) : Vd;
  function lp(m) {
    return sp(m) ? Hd(m) : Yd(m);
  }
  function cp() {
    return [];
  }
  function up() {
    return !1;
  }
  e.exports = op;
})(xi, xi.exports);
var UE = xi.exports;
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.DownloadedUpdateHelper = void 0;
yn.createTempUpdateFile = GE;
const ME = un, BE = Dt, Il = UE, jt = Pt, Xr = oe;
class zE {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Xr.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Il(this.versionInfo, r) && Il(this.fileInfo.info, n.info) && await (0, jt.pathExists)(t) ? t : null;
    const a = await this.getValidCachedUpdateFile(n, i);
    return a === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = a, a);
  }
  async setDownloadedFile(t, r, n, i, a, s) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: a,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, jt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, jt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, jt.pathExists)(n))
      return null;
    let a;
    try {
      a = await (0, jt.readJson)(n);
    } catch (d) {
      let c = "No cached update info available";
      return d.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${d.message})`), r.info(c), null;
    }
    if (!((a == null ? void 0 : a.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== a.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${a.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const o = Xr.join(this.cacheDirForPendingUpdate, a.fileName);
    if (!await (0, jt.pathExists)(o))
      return r.info("Cached update file doesn't exist"), null;
    const l = await jE(o);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = a, o);
  }
  getUpdateInfoFile() {
    return Xr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
yn.DownloadedUpdateHelper = zE;
function jE(e, t = "sha512", r = "base64", n) {
  return new Promise((i, a) => {
    const s = (0, ME.createHash)(t);
    s.on("error", a).setEncoding(r), (0, BE.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", a).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function GE(e, t, r) {
  let n = 0, i = Xr.join(t, e);
  for (let a = 0; a < 3; a++)
    try {
      return await (0, jt.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${s}`), i = Xr.join(t, `${n++}-${e}`);
    }
  return i;
}
var Ui = {}, Bs = {};
Object.defineProperty(Bs, "__esModule", { value: !0 });
Bs.getAppCacheDir = qE;
const _a = oe, HE = _i;
function qE() {
  const e = (0, HE.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || _a.join(e, "AppData", "Local") : process.platform === "darwin" ? t = _a.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || _a.join(e, ".cache"), t;
}
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.ElectronAppAdapter = void 0;
const Cl = oe, XE = Bs;
class WE {
  constructor(t = Kt.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Cl.join(process.resourcesPath, "app-update.yml") : Cl.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, XE.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
Ui.ElectronAppAdapter = WE;
var Af = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = xe;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return Kt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(a) {
      super(), this.proxyLoginCallback = a, this.cachedSession = null;
    }
    async download(a, s, o) {
      return await o.cancellationToken.createPromise((l, d, c) => {
        const u = {
          headers: o.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(a, u), (0, t.configureRequestOptions)(u), this.doDownload(u, {
          destination: s,
          options: o,
          onCancel: c,
          callback: (p) => {
            p == null ? l(s) : d(p);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(a, s) {
      a.headers && a.headers.Host && (a.host = a.headers.Host, delete a.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const o = Kt.net.request({
        ...a,
        session: this.cachedSession
      });
      return o.on("response", s), this.proxyLoginCallback != null && o.on("login", this.proxyLoginCallback), o;
    }
    addRedirectHandlers(a, s, o, l, d) {
      a.on("redirect", (c, u, p) => {
        a.abort(), l > this.maxRedirects ? o(this.createMaxRedirectError()) : d(t.HttpExecutor.prepareRedirectUrlOptions(p, s));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(Af);
var xn = {}, We = {}, VE = "[object Symbol]", If = /[\\^$.*+?()[\]{}|]/g, YE = RegExp(If.source), KE = typeof Oe == "object" && Oe && Oe.Object === Object && Oe, JE = typeof self == "object" && self && self.Object === Object && self, QE = KE || JE || Function("return this")(), ZE = Object.prototype, ev = ZE.toString, Rl = QE.Symbol, Ol = Rl ? Rl.prototype : void 0, Dl = Ol ? Ol.toString : void 0;
function tv(e) {
  if (typeof e == "string")
    return e;
  if (nv(e))
    return Dl ? Dl.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function rv(e) {
  return !!e && typeof e == "object";
}
function nv(e) {
  return typeof e == "symbol" || rv(e) && ev.call(e) == VE;
}
function iv(e) {
  return e == null ? "" : tv(e);
}
function av(e) {
  return e = iv(e), e && YE.test(e) ? e.replace(If, "\\$&") : e;
}
var sv = av;
Object.defineProperty(We, "__esModule", { value: !0 });
We.newBaseUrl = lv;
We.newUrlFromBase = Za;
We.getChannelFilename = cv;
We.blockmapFiles = uv;
const Cf = br, ov = sv;
function lv(e) {
  const t = new Cf.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Za(e, t, r = !1) {
  const n = new Cf.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function cv(e) {
  return `${e}.yml`;
}
function uv(e, t, r) {
  const n = Za(`${e.pathname}.blockmap`, e);
  return [Za(`${e.pathname.replace(new RegExp(ov(r), "g"), t)}.blockmap`, e), n];
}
var pe = {};
Object.defineProperty(pe, "__esModule", { value: !0 });
pe.Provider = void 0;
pe.findFile = pv;
pe.parseUpdateInfo = hv;
pe.getFileList = Rf;
pe.resolveFiles = mv;
const Rt = xe, fv = Te, Pl = We;
class dv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Rt.configureRequestUrl)(t, n), n;
  }
}
pe.Provider = dv;
function pv(e, t, r) {
  if (e.length === 0)
    throw (0, Rt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((a) => i.url.pathname.toLowerCase().endsWith(`.${a}`))));
}
function hv(e, t, r) {
  if (e == null)
    throw (0, Rt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, fv.load)(e);
  } catch (i) {
    throw (0, Rt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Rf(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, Rt.newError)(`No files provided: ${(0, Rt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function mv(e, t, r = (n) => n) {
  const i = Rf(e).map((o) => {
    if (o.sha2 == null && o.sha512 == null)
      throw (0, Rt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Rt.safeStringifyJson)(o)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Pl.newUrlFromBase)(r(o.url), t),
      info: o
    };
  }), a = e.packages, s = a == null ? null : a[process.arch] || a.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, Pl.newUrlFromBase)(r(s.path), t).href
  }), i;
}
Object.defineProperty(xn, "__esModule", { value: !0 });
xn.GenericProvider = void 0;
const kl = xe, ba = We, Sa = pe;
class gv extends Sa.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, ba.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, ba.getChannelFilename)(this.channel), r = (0, ba.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Sa.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof kl.HttpError && i.statusCode === 404)
          throw (0, kl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((a, s) => {
            try {
              setTimeout(a, 1e3 * n);
            } catch (o) {
              s(o);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Sa.resolveFiles)(t, this.baseUrl);
  }
}
xn.GenericProvider = gv;
var Mi = {}, Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.BitbucketProvider = void 0;
const Nl = xe, Aa = We, Ia = pe;
class yv extends Ia.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: a } = t;
    this.baseUrl = (0, Aa.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Nl.CancellationToken(), r = (0, Aa.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Aa.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Ia.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Nl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Ia.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
Bi.BitbucketProvider = yv;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.GitHubProvider = Ot.BaseGitHubProvider = void 0;
Ot.computeReleaseNotes = Df;
const ut = xe, hr = Sf, xv = br, mr = We, es = pe, Ca = /\/tag\/([^/]+)$/;
class Of extends es.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, mr.newBaseUrl)((0, ut.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, mr.newBaseUrl)((0, ut.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
Ot.BaseGitHubProvider = Of;
class wv extends Of {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, a;
    const s = new ut.CancellationToken(), o = await this.httpRequest((0, mr.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), l = (0, ut.parseXml)(o);
    let d = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = hr.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (T === null)
          c = Ca.exec(d.element("link").attribute("href"))[1];
        else
          for (const _ of l.getElements("entry")) {
            const b = Ca.exec(_.element("link").attribute("href"));
            if (b === null)
              continue;
            const N = b[1], $ = ((n = hr.prerelease(N)) === null || n === void 0 ? void 0 : n[0]) || null, ie = !T || ["alpha", "beta"].includes(T), ue = $ !== null && !["alpha", "beta"].includes(String($));
            if (ie && !ue && !(T === "beta" && $ === "alpha")) {
              c = N;
              break;
            }
            if ($ && $ === T) {
              c = N;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(s);
        for (const T of l.getElements("entry"))
          if (Ca.exec(T.element("link").attribute("href"))[1] === c) {
            d = T;
            break;
          }
      }
    } catch (T) {
      throw (0, ut.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${o}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, ut.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let u, p = "", g = "";
    const w = async (T) => {
      p = (0, mr.getChannelFilename)(T), g = (0, mr.newUrlFromBase)(this.getBaseDownloadPath(String(c), p), this.baseUrl);
      const _ = this.createRequestOptions(g);
      try {
        return await this.executor.request(_, s);
      } catch (b) {
        throw b instanceof ut.HttpError && b.statusCode === 404 ? (0, ut.newError)(`Cannot find ${p} in the latest release artifacts (${g}): ${b.stack || b.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : b;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = hr.prerelease(c)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((a = hr.prerelease(c)) === null || a === void 0 ? void 0 : a[0]))), u = await w(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        u = await w(this.getDefaultChannelName());
      else
        throw T;
    }
    const x = (0, es.parseUpdateInfo)(u, p, g);
    return x.releaseName == null && (x.releaseName = d.elementValueOrEmpty("title")), x.releaseNotes == null && (x.releaseNotes = Df(this.updater.currentVersion, this.updater.fullChangelog, l, d)), {
      tag: c,
      ...x
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, mr.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new xv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, ut.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, es.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
Ot.GitHubProvider = wv;
function Fl(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Df(e, t, r, n) {
  if (!t)
    return Fl(n);
  const i = [];
  for (const a of r.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(a.element("link").attribute("href"))[1];
    hr.lt(e, s) && i.push({
      version: s,
      note: Fl(a)
    });
  }
  return i.sort((a, s) => hr.rcompare(a.version, s.version));
}
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.KeygenProvider = void 0;
const $l = xe, Ra = We, Oa = pe;
class Ev extends Oa.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Ra.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new $l.CancellationToken(), r = (0, Ra.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Ra.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Oa.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, $l.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Oa.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
zi.KeygenProvider = Ev;
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.PrivateGitHubProvider = void 0;
const sr = xe, vv = Te, Tv = oe, Ll = br, Ul = We, _v = Ot, bv = pe;
class Sv extends _v.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new sr.CancellationToken(), r = (0, Ul.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((o) => o.name === r);
    if (i == null)
      throw (0, sr.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const a = new Ll.URL(i.url);
    let s;
    try {
      s = (0, vv.load)(await this.httpRequest(a, this.configureHeaders("application/octet-stream"), t));
    } catch (o) {
      throw o instanceof sr.HttpError && o.statusCode === 404 ? (0, sr.newError)(`Cannot find ${r} in the latest release artifacts (${a}): ${o.stack || o.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : o;
    }
    return s.assets = n.assets, s;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, Ul.newUrlFromBase)(n, this.baseUrl);
    try {
      const a = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? a.find((s) => s.prerelease) || a[0] : a;
    } catch (a) {
      throw (0, sr.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${a.stack || a.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, bv.getFileList)(t).map((r) => {
      const n = Tv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((a) => a != null && a.name === n);
      if (i == null)
        throw (0, sr.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Ll.URL(i.url),
        info: r
      };
    });
  }
}
ji.PrivateGitHubProvider = Sv;
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.isUrlProbablySupportMultiRangeRequests = Pf;
Mi.createClient = Ov;
const qn = xe, Av = Bi, Ml = xn, Iv = Ot, Cv = zi, Rv = ji;
function Pf(e) {
  return !e.includes("s3.amazonaws.com");
}
function Ov(e, t, r) {
  if (typeof e == "string")
    throw (0, qn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, a = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return a == null ? new Iv.GitHubProvider(i, t, r) : new Rv.PrivateGitHubProvider(i, t, a, r);
    }
    case "bitbucket":
      return new Av.BitbucketProvider(e, t, r);
    case "keygen":
      return new Cv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Ml.GenericProvider({
        provider: "generic",
        url: (0, qn.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Ml.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Pf(i.url)
      });
    }
    case "custom": {
      const i = e, a = i.updateProvider;
      if (!a)
        throw (0, qn.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new a(i, t, r);
    }
    default:
      throw (0, qn.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Gi = {}, wn = {}, Rr = {}, tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.OperationKind = void 0;
tr.computeOperations = Dv;
var Xt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Xt || (tr.OperationKind = Xt = {}));
function Dv(e, t, r) {
  const n = zl(e.files), i = zl(t.files);
  let a = null;
  const s = t.files[0], o = [], l = s.name, d = n.get(l);
  if (d == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let u = 0;
  const { checksumToOffset: p, checksumToOldSize: g } = kv(n.get(l), d.offset, r);
  let w = s.offset;
  for (let x = 0; x < c.checksums.length; w += c.sizes[x], x++) {
    const T = c.sizes[x], _ = c.checksums[x];
    let b = p.get(_);
    b != null && g.get(_) !== T && (r.warn(`Checksum ("${_}") matches, but size differs (old: ${g.get(_)}, new: ${T})`), b = void 0), b === void 0 ? (u++, a != null && a.kind === Xt.DOWNLOAD && a.end === w ? a.end += T : (a = {
      kind: Xt.DOWNLOAD,
      start: w,
      end: w + T
      // oldBlocks: null,
    }, Bl(a, o, _, x))) : a != null && a.kind === Xt.COPY && a.end === b ? a.end += T : (a = {
      kind: Xt.COPY,
      start: b,
      end: b + T
      // oldBlocks: [checksum]
    }, Bl(a, o, _, x));
  }
  return u > 0 && r.info(`File${s.name === "file" ? "" : " " + s.name} has ${u} changed blocks`), o;
}
const Pv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Bl(e, t, r, n) {
  if (Pv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const a = [i.start, i.end, e.start, e.end].reduce((s, o) => s < o ? s : o);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${Xt[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - a} until ${i.end - a} and ${e.start - a} until ${e.end - a}`);
    }
  }
  t.push(e);
}
function kv(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let a = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const o = e.checksums[s], l = e.sizes[s], d = i.get(o);
    if (d === void 0)
      n.set(o, a), i.set(o, l);
    else if (r.debug != null) {
      const c = d === l ? "(same size)" : `(size: ${d}, this size: ${l})`;
      r.debug(`${o} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    a += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function zl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.DataSplitter = void 0;
Rr.copyData = kf;
const Xn = xe, Nv = Dt, Fv = cn, $v = tr, jl = Buffer.from(`\r
\r
`);
var Et;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Et || (Et = {}));
function kf(e, t, r, n, i) {
  const a = (0, Nv.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  a.on("error", n), a.once("end", i), a.pipe(t, {
    end: !1
  });
}
class Lv extends Fv.Writable {
  constructor(t, r, n, i, a, s) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = a, this.finishHandler = s, this.partIndex = -1, this.headerListBuffer = null, this.readState = Et.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(n).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Xn.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === Et.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = Et.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Et.BODY)
          this.readState = Et.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Xn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const o = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (o < s)
            await this.copyExistingData(o, s);
          else if (o > s)
            throw (0, Xn.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = Et.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, a = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, a), this.remainingPartDataCount = n - (a - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const a = () => {
        if (t === r) {
          n();
          return;
        }
        const s = this.options.tasks[t];
        if (s.kind !== $v.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        kf(s, this.out, this.options.oldFileFd, i, () => {
          t++, a();
        });
      };
      a();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(jl, r);
    if (n !== -1)
      return n + jl.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Xn.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((a, s) => {
      i.on("error", s), i.once("drain", () => {
        i.removeListener("error", s), a();
      });
    });
  }
}
Rr.DataSplitter = Lv;
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.executeTasksUsingMultipleRangeRequests = Uv;
Hi.checkIsRangesSupported = rs;
const ts = xe, Gl = Rr, Hl = tr;
function Uv(e, t, r, n, i) {
  const a = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const o = s + 1e3;
    Mv(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, o),
      oldFileFd: n
    }, r, () => a(o), i);
  };
  return a;
}
function Mv(e, t, r, n, i) {
  let a = "bytes=", s = 0;
  const o = /* @__PURE__ */ new Map(), l = [];
  for (let u = t.start; u < t.end; u++) {
    const p = t.tasks[u];
    p.kind === Hl.OperationKind.DOWNLOAD && (a += `${p.start}-${p.end - 1}, `, o.set(s, u), s++, l.push(p.end - p.start));
  }
  if (s <= 1) {
    const u = (p) => {
      if (p >= t.end) {
        n();
        return;
      }
      const g = t.tasks[p++];
      if (g.kind === Hl.OperationKind.COPY)
        (0, Gl.copyData)(g, r, t.oldFileFd, i, () => u(p));
      else {
        const w = e.createRequestOptions();
        w.headers.Range = `bytes=${g.start}-${g.end - 1}`;
        const x = e.httpExecutor.createRequest(w, (T) => {
          rs(T, i) && (T.pipe(r, {
            end: !1
          }), T.once("end", () => u(p)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(x, i), x.end();
      }
    };
    u(t.start);
    return;
  }
  const d = e.createRequestOptions();
  d.headers.Range = a.substring(0, a.length - 2);
  const c = e.httpExecutor.createRequest(d, (u) => {
    if (!rs(u, i))
      return;
    const p = (0, ts.safeGetHeader)(u, "content-type"), g = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(p);
    if (g == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${p}"`));
      return;
    }
    const w = new Gl.DataSplitter(r, t, o, g[1] || g[2], l, n);
    w.on("error", i), u.pipe(w), u.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function rs(e, t) {
  if (e.statusCode >= 400)
    return t((0, ts.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, ts.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.ProgressDifferentialDownloadCallbackTransform = void 0;
const Bv = cn;
var gr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(gr || (gr = {}));
class zv extends Bv.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = gr.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == gr.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = gr.COPY;
  }
  beginRangeDownload() {
    this.operationType = gr.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
qi.ProgressDifferentialDownloadCallbackTransform = zv;
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.DifferentialDownloader = void 0;
const Ur = xe, Da = Pt, jv = Dt, Gv = Rr, Hv = br, Wn = tr, ql = Hi, qv = qi;
class Xv {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, Ur.configureRequestUrl)(this.options.newUrl, t), (0, Ur.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Wn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let a = 0, s = 0;
    for (const l of i) {
      const d = l.end - l.start;
      l.kind === Wn.OperationKind.DOWNLOAD ? a += d : s += d;
    }
    const o = this.blockAwareFileInfo.size;
    if (a + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== o)
      throw new Error(`Internal error, size mismatch: downloadSize: ${a}, copySize: ${s}, newSize: ${o}`);
    return n.info(`Full: ${Xl(o)}, To download: ${Xl(a)} (${Math.round(a / (o / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Da.close)(i.descriptor).catch((a) => {
      this.logger.error(`cannot close file "${i.path}": ${a}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((a) => {
      try {
        this.logger.error(`cannot close files: ${a}`);
      } catch (s) {
        try {
          console.error(s);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, Da.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Da.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const a = (0, jv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, o) => {
      const l = [];
      let d;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const _ = [];
        let b = 0;
        for (const $ of t)
          $.kind === Wn.OperationKind.DOWNLOAD && (_.push($.end - $.start), b += $.end - $.start);
        const N = {
          expectedByteCounts: _,
          grandTotal: b
        };
        d = new qv.ProgressDifferentialDownloadCallbackTransform(N, this.options.cancellationToken, this.options.onProgress), l.push(d);
      }
      const c = new Ur.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), a.on("finish", () => {
        a.close(() => {
          r.splice(1, 1);
          try {
            c.validate();
          } catch (_) {
            o(_);
            return;
          }
          s(void 0);
        });
      }), l.push(a);
      let u = null;
      for (const _ of l)
        _.on("error", o), u == null ? u = _ : u = u.pipe(_);
      const p = l[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, ql.executeTasksUsingMultipleRangeRequests)(this, t, p, n, o), g(0);
        return;
      }
      let w = 0, x = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", g = (_) => {
        var b, N;
        if (_ >= t.length) {
          this.fileMetadataBuffer != null && p.write(this.fileMetadataBuffer), p.end();
          return;
        }
        const $ = t[_++];
        if ($.kind === Wn.OperationKind.COPY) {
          d && d.beginFileCopy(), (0, Gv.copyData)($, p, n, o, () => g(_));
          return;
        }
        const ie = `bytes=${$.start}-${$.end - 1}`;
        T.headers.range = ie, (N = (b = this.logger) === null || b === void 0 ? void 0 : b.debug) === null || N === void 0 || N.call(b, `download range: ${ie}`), d && d.beginRangeDownload();
        const ue = this.httpExecutor.createRequest(T, (Y) => {
          Y.on("error", o), Y.on("aborted", () => {
            o(new Error("response has been aborted by the server"));
          }), Y.statusCode >= 400 && o((0, Ur.createHttpError)(Y)), Y.pipe(p, {
            end: !1
          }), Y.once("end", () => {
            d && d.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => g(_), 1e3)) : g(_);
          });
        });
        ue.on("redirect", (Y, Me, y) => {
          this.logger.info(`Redirect to ${Wv(y)}`), x = y, (0, Ur.configureRequestUrl)(new Hv.URL(x), T), ue.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(ue, o), ue.end();
      }, g(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let a = 0;
    if (await this.request(i, (s) => {
      s.copy(n, a), a += s.length;
    }), a !== n.length)
      throw new Error(`Received data length ${a} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const a = this.httpExecutor.createRequest(t, (s) => {
        (0, ql.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", r), s.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(a, i), a.end();
    });
  }
}
wn.DifferentialDownloader = Xv;
function Xl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Wv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.GenericDifferentialDownloader = void 0;
const Vv = wn;
class Yv extends Vv.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Gi.GenericDifferentialDownloader = Yv;
var kt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = xe;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(a) {
      this.emitter = a;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(a) {
      n(this.emitter, "login", a);
    }
    progress(a) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, a);
    }
    updateDownloaded(a) {
      n(this.emitter, e.UPDATE_DOWNLOADED, a);
    }
    updateCancelled(a) {
      n(this.emitter, "update-cancelled", a);
    }
  }
  e.UpdaterSignal = r;
  function n(i, a, s) {
    i.on(a, s);
  }
})(kt);
Object.defineProperty(At, "__esModule", { value: !0 });
At.NoOpLogger = At.AppUpdater = void 0;
const Re = xe, Kv = un, Jv = _i, Qv = bc, or = Pt, Zv = Te, Pa = Pi, Mt = oe, Gt = Sf, Wl = yn, eT = Ui, Vl = Af, tT = xn, ka = Mi, rT = Ac, nT = We, iT = Gi, lr = kt;
class zs extends Qv.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, Re.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Re.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, Vl.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Nf();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Pa.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new lr.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (a) => this.checkIfUpdateSupported(a), this.clientPromise = null, this.stagingUserIdPromise = new Pa.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Pa.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (a) => {
      this._logger.error(`Error: ${a.stack || a.message}`);
    }), r == null ? (this.app = new eT.ElectronAppAdapter(), this.httpExecutor = new Vl.ElectronHttpExecutor((a, s) => this.emit("login", a, s))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Gt.parse)(n);
    if (i == null)
      throw (0, Re.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = aT(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new tT.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, ka.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, ka.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = zs.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new Kt.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, s = Re.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${s}, user id: ${i}`), s < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Gt.parse)(t.version);
    if (r == null)
      throw (0, Re.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Gt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const a = (0, Gt.gt)(r, n), s = (0, Gt.lt)(r, n);
    return a ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, Jv.release)();
    if (r)
      try {
        if ((0, Gt.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, ka.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new Re.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Re.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Re.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Re.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Re.CancellationError))
        try {
          this.dispatchError(i);
        } catch (a) {
          this._logger.warn(`Cannot dispatch error event: ${a.stack || a}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(lr.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, Zv.load)(await (0, or.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Mt.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, or.readFile)(t, "utf-8");
      if (Re.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Re.UUID.v5((0, Kv.randomBytes)(4096), Re.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, or.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Mt.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Wl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(lr.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (b) => this.emit(lr.DOWNLOAD_PROGRESS, b));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, a = i.version, s = r.packageInfo;
    function o() {
      const b = decodeURIComponent(t.fileInfo.url.pathname);
      return b.endsWith(`.${t.fileExtension}`) ? Mt.basename(b) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), d = l.cacheDirForPendingUpdate;
    await (0, or.mkdir)(d, { recursive: !0 });
    const c = o();
    let u = Mt.join(d, c);
    const p = s == null ? null : Mt.join(d, `package-${a}${Mt.extname(s.path) || ".7z"}`), g = async (b) => (await l.setDownloadedFile(u, p, i, r, c, b), await t.done({
      ...i,
      downloadedFile: u
    }), p == null ? [u] : [u, p]), w = this._logger, x = await l.validateDownloadedPath(u, i, r, w);
    if (x != null)
      return u = x, await g(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, or.unlink)(u).catch(() => {
    })), _ = await (0, Wl.createTempUpdateFile)(`temp-${c}`, d, w);
    try {
      await t.task(_, n, p, T), await (0, Re.retry)(() => (0, or.rename)(_, u), 60, 500, 0, 0, (b) => b instanceof Error && /^EBUSY:/.test(b.message));
    } catch (b) {
      throw await T(), b instanceof Re.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), b;
    }
    return w.info(`New version ${a} has been downloaded to ${u}`), await g(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, a) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, nT.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const o = async (c) => {
        const u = await this.httpExecutor.downloadToBuffer(c, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (u == null || u.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, rT.gunzipSync)(u).toString());
        } catch (p) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${p}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: Mt.join(this.downloadedUpdateHelper.cacheDir, a),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(lr.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(lr.DOWNLOAD_PROGRESS, c));
      const d = await Promise.all(s.map((c) => o(c)));
      return await new iT.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(d[0], d[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
At.AppUpdater = zs;
function aT(e) {
  const t = (0, Gt.prerelease)(e);
  return t != null && t.length > 0;
}
class Nf {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
At.NoOpLogger = Nf;
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.BaseUpdater = void 0;
const Yl = Ti, sT = At;
class oT extends sT.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Kt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, a = n == null ? null : n.downloadedFileInfo;
    if (i == null || a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: a.isAdminRightsRequired
      });
    } catch (s) {
      return this.dispatchError(s), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  wrapSudo() {
    const { name: t } = this.app, r = `"${t} would like to update"`, n = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), i = [n];
    return /kdesudo/i.test(n) ? (i.push("--comment", r), i.push("-c")) : /gksudo/i.test(n) ? i.push("--message", r) : /pkexec/i.test(n) && i.push("--disable-internal-agent"), i.join(" ");
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, Yl.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: a, status: s, stdout: o, stderr: l } = i;
    if (a != null)
      throw this._logger.error(l), a;
    if (s != null && s !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${s}`);
    return o.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((a, s) => {
      try {
        const o = { stdio: i, env: n, detached: !0 }, l = (0, Yl.spawn)(t, r, o);
        l.on("error", (d) => {
          s(d);
        }), l.unref(), l.pid !== void 0 && a(!0);
      } catch (o) {
        s(o);
      }
    });
  }
}
pt.BaseUpdater = oT;
var rn = {}, En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
En.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const cr = Pt, lT = wn, cT = Ac;
class uT extends lT.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Ff(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await fT(this.options.oldFile), i);
  }
}
En.FileWithEmbeddedBlockMapDifferentialDownloader = uT;
function Ff(e) {
  return JSON.parse((0, cT.inflateRawSync)(e).toString());
}
async function fT(e) {
  const t = await (0, cr.open)(e, "r");
  try {
    const r = (await (0, cr.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, cr.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, cr.read)(t, i, 0, i.length, r - n.length - i.length), await (0, cr.close)(t), Ff(i);
  } catch (r) {
    throw await (0, cr.close)(t), r;
  }
}
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.AppImageUpdater = void 0;
const Kl = xe, Jl = Ti, dT = Pt, pT = Dt, Mr = oe, hT = pt, mT = En, gT = pe, Ql = kt;
class yT extends hT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, gT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, Kl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, s, i, r, t)) && await this.httpExecutor.download(n.url, i, a), await (0, dT.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, a) {
    try {
      const s = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: a.requestHeaders,
        cancellationToken: a.cancellationToken
      };
      return this.listenerCount(Ql.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Ql.DOWNLOAD_PROGRESS, o)), await new mT.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Kl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, pT.unlinkSync)(r);
    let n;
    const i = Mr.basename(r), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Mr.basename(a) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Mr.join(Mr.dirname(r), Mr.basename(a)), (0, Jl.execFileSync)("mv", ["-f", a, n]), n !== r && this.emit("appimage-filename-updated", n);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Jl.execFileSync)(n, [], { env: s })), !0;
  }
}
rn.AppImageUpdater = yT;
var nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.DebUpdater = void 0;
const xT = pt, wT = pe, Zl = kt;
class ET extends xT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, wT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(Zl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(Zl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const a = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
nn.DebUpdater = ET;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.PacmanUpdater = void 0;
const vT = pt, ec = kt, TT = pe;
class _T extends vT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, TT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(ec.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(ec.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const a = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
an.PacmanUpdater = _T;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.RpmUpdater = void 0;
const bT = pt, tc = kt, ST = pe;
class AT extends bT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, ST.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(tc.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(tc.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.spawnSyncLog("which zypper"), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    let s;
    return i ? s = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", a] : s = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", a], this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${s.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
sn.RpmUpdater = AT;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.MacUpdater = void 0;
const rc = xe, Na = Pt, IT = Dt, nc = oe, CT = xp, RT = At, OT = pe, ic = Ti, ac = un;
class DT extends RT.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = Kt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let a = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), a = (0, ic.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${a})`);
    } catch (u) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${u}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const p = (0, ic.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${p}`), s = s || p;
    } catch (u) {
      n.warn(`uname shell command to check for arm64 failed: ${u}`);
    }
    s = s || process.arch === "arm64" || a;
    const o = (u) => {
      var p;
      return u.url.pathname.includes("arm64") || ((p = u.info.url) === null || p === void 0 ? void 0 : p.includes("arm64"));
    };
    s && r.some(o) ? r = r.filter((u) => s === o(u)) : r = r.filter((u) => !o(u));
    const l = (0, OT.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, rc.newError)(`ZIP file not provided: ${(0, rc.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const d = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (u, p) => {
        const g = nc.join(this.downloadedUpdateHelper.cacheDir, c), w = () => (0, Na.pathExistsSync)(g) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let x = !0;
        w() && (x = await this.differentialDownloadInstaller(l, t, u, d, c)), x && await this.httpExecutor.download(l.url, u, p);
      },
      done: async (u) => {
        if (!t.disableDifferentialDownload)
          try {
            const p = nc.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Na.copyFile)(u.downloadedFile, p);
          } catch (p) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${p.message}`);
          }
        return this.updateDownloaded(l, u);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, a = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Na.stat)(i)).size, s = this._logger, o = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${o})`), this.server = (0, CT.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${o})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${o})`);
    });
    const l = (d) => {
      const c = d.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((d, c) => {
      const u = (0, ac.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), p = Buffer.from(`autoupdater:${u}`, "ascii"), g = `/${(0, ac.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, x) => {
        const T = w.url;
        if (s.info(`${T} requested`), T === "/") {
          if (!w.headers.authorization || w.headers.authorization.indexOf("Basic ") === -1) {
            x.statusCode = 401, x.statusMessage = "Invalid Authentication Credentials", x.end(), s.warn("No authenthication info");
            return;
          }
          const N = w.headers.authorization.split(" ")[1], $ = Buffer.from(N, "base64").toString("ascii"), [ie, ue] = $.split(":");
          if (ie !== "autoupdater" || ue !== u) {
            x.statusCode = 401, x.statusMessage = "Invalid Authentication Credentials", x.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const Y = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          x.writeHead(200, { "Content-Type": "application/json", "Content-Length": Y.length }), x.end(Y);
          return;
        }
        if (!T.startsWith(g)) {
          s.warn(`${T} requested, but not supported`), x.writeHead(404), x.end();
          return;
        }
        s.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let _ = !1;
        x.on("finish", () => {
          _ || (this.nativeUpdater.removeListener("error", c), d([]));
        });
        const b = (0, IT.createReadStream)(i);
        b.on("error", (N) => {
          try {
            x.end();
          } catch ($) {
            s.warn(`cannot end response: ${$}`);
          }
          _ = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${N}`));
        }), x.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": a
        }), b.pipe(x);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${o})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${o})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${p.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : d([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
on.MacUpdater = DT;
var ln = {}, js = {};
Object.defineProperty(js, "__esModule", { value: !0 });
js.verifySignature = kT;
const sc = xe, $f = Ti, PT = _i, oc = oe;
function kT(e, t, r) {
  return new Promise((n, i) => {
    const a = t.replace(/'/g, "''");
    r.info(`Verifying signature ${a}`), (0, $f.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${a}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, o, l) => {
      var d;
      try {
        if (s != null || l) {
          Fa(r, s, l, i), n(null);
          return;
        }
        const c = NT(o);
        if (c.Status === 0) {
          try {
            const w = oc.normalize(c.Path), x = oc.normalize(t);
            if (r.info(`LiteralPath: ${w}. Update Path: ${x}`), w !== x) {
              Fa(r, new Error(`LiteralPath of ${w} is different than ${x}`), l, i), n(null);
              return;
            }
          } catch (w) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(d = w.message) !== null && d !== void 0 ? d : w.stack}`);
          }
          const p = (0, sc.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const w of e) {
            const x = (0, sc.parseDn)(w);
            if (x.size ? g = Array.from(x.keys()).every((_) => x.get(_) === p.get(_)) : w === p.get("CN") && (r.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              n(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (p, g) => p === "RawData" ? void 0 : g, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), n(u);
      } catch (c) {
        Fa(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function NT(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function Fa(e, t, r, n) {
  if (FT()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, $f.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function FT() {
  const e = PT.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.NsisUpdater = void 0;
const Vn = xe, lc = oe, $T = pt, LT = En, cc = kt, UT = pe, MT = Pt, BT = js, uc = br;
class zT extends $T.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, BT.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, UT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, a, s, o) => {
        const l = n.packageInfo, d = l != null && s != null;
        if (d && t.disableWebInstaller)
          throw (0, Vn.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !d && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Vn.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, a);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await o(), (0, Vn.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (d && await this.differentialDownloadWebPackage(t, l, s, r))
          try {
            await this.httpExecutor.download(new uc.URL(l.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (u) {
            try {
              await (0, MT.unlink)(s);
            } catch {
            }
            throw u;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const a = () => {
      this.spawnLog(lc.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), a(), !0) : (this.spawnLog(r, n).catch((s) => {
      const o = s.code;
      this._logger.info(`Cannot run installer: error code: ${o}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), o === "UNKNOWN" || o === "EACCES" ? a() : o === "ENOENT" ? Kt.shell.openPath(r).catch((l) => this.dispatchError(l)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const a = {
        newUrl: new uc.URL(r.path),
        oldFile: lc.join(this.downloadedUpdateHelper.cacheDir, Vn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(cc.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(cc.DOWNLOAD_PROGRESS, s)), await new LT.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, a).download();
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "win32";
    }
    return !1;
  }
}
ln.NsisUpdater = zT;
(function(e) {
  var t = Oe && Oe.__createBinding || (Object.create ? function(T, _, b, N) {
    N === void 0 && (N = b);
    var $ = Object.getOwnPropertyDescriptor(_, b);
    (!$ || ("get" in $ ? !_.__esModule : $.writable || $.configurable)) && ($ = { enumerable: !0, get: function() {
      return _[b];
    } }), Object.defineProperty(T, N, $);
  } : function(T, _, b, N) {
    N === void 0 && (N = b), T[N] = _[b];
  }), r = Oe && Oe.__exportStar || function(T, _) {
    for (var b in T) b !== "default" && !Object.prototype.hasOwnProperty.call(_, b) && t(_, T, b);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = Pt, i = oe;
  var a = pt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return a.BaseUpdater;
  } });
  var s = At;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var o = pe;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return o.Provider;
  } });
  var l = rn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var d = nn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return d.DebUpdater;
  } });
  var c = an;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var u = sn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return u.RpmUpdater;
  } });
  var p = on;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return p.MacUpdater;
  } });
  var g = ln;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), r(kt, e);
  let w;
  function x() {
    if (process.platform === "win32")
      w = new ln.NsisUpdater();
    else if (process.platform === "darwin")
      w = new on.MacUpdater();
    else {
      w = new rn.AppImageUpdater();
      try {
        const T = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(T))
          return w;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const _ = (0, n.readFileSync)(T).toString().trim();
        switch (console.info("Found package-type:", _), _) {
          case "deb":
            w = new nn.DebUpdater();
            break;
          case "rpm":
            w = new sn.RpmUpdater();
            break;
          case "pacman":
            w = new an.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (T) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", T.message);
      }
    }
    return w;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => w || x()
  });
})(st);
const jT = "End-Of-Stream";
class Ie extends Error {
  constructor() {
    super(jT), this.name = "EndOfStreamError";
  }
}
class GT extends Error {
  constructor(t = "The operation was aborted") {
    super(t), this.name = "AbortError";
  }
}
class Lf {
  constructor() {
    this.endOfStream = !1, this.interrupted = !1, this.peekQueue = [];
  }
  async peek(t, r = !1) {
    const n = await this.read(t, r);
    return this.peekQueue.push(t.subarray(0, n)), n;
  }
  async read(t, r = !1) {
    if (t.length === 0)
      return 0;
    let n = this.readFromPeekBuffer(t);
    if (this.endOfStream || (n += await this.readRemainderFromStream(t.subarray(n), r)), n === 0 && !r)
      throw new Ie();
    return n;
  }
  /**
   * Read chunk from stream
   * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
   * @returns Number of bytes read
   */
  readFromPeekBuffer(t) {
    let r = t.length, n = 0;
    for (; this.peekQueue.length > 0 && r > 0; ) {
      const i = this.peekQueue.pop();
      if (!i)
        throw new Error("peekData should be defined");
      const a = Math.min(i.length, r);
      t.set(i.subarray(0, a), n), n += a, r -= a, a < i.length && this.peekQueue.push(i.subarray(a));
    }
    return n;
  }
  async readRemainderFromStream(t, r) {
    let n = 0;
    for (; n < t.length && !this.endOfStream; ) {
      if (this.interrupted)
        throw new GT();
      const i = await this.readFromStream(t.subarray(n), r);
      if (i === 0)
        break;
      n += i;
    }
    if (!r && n < t.length)
      throw new Ie();
    return n;
  }
}
class HT extends Lf {
  constructor(t) {
    super(), this.reader = t;
  }
  async abort() {
    return this.close();
  }
  async close() {
    this.reader.releaseLock();
  }
}
class qT extends HT {
  /**
   * Read from stream
   * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
   * @param mayBeLess - If true, may fill the buffer partially
   * @protected Bytes read
   */
  async readFromStream(t, r) {
    if (t.length === 0)
      return 0;
    const n = await this.reader.read(new Uint8Array(t.length), { min: r ? void 0 : t.length });
    return n.done && (this.endOfStream = n.done), n.value ? (t.set(n.value), n.value.length) : 0;
  }
}
class fc extends Lf {
  constructor(t) {
    super(), this.reader = t, this.buffer = null;
  }
  /**
   * Copy chunk to target, and store the remainder in this.buffer
   */
  writeChunk(t, r) {
    const n = Math.min(r.length, t.length);
    return t.set(r.subarray(0, n)), n < r.length ? this.buffer = r.subarray(n) : this.buffer = null, n;
  }
  /**
   * Read from stream
   * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
   * @param mayBeLess - If true, may fill the buffer partially
   * @protected Bytes read
   */
  async readFromStream(t, r) {
    if (t.length === 0)
      return 0;
    let n = 0;
    for (this.buffer && (n += this.writeChunk(t, this.buffer)); n < t.length && !this.endOfStream; ) {
      const i = await this.reader.read();
      if (i.done) {
        this.endOfStream = !0;
        break;
      }
      i.value && (n += this.writeChunk(t.subarray(n), i.value));
    }
    if (!r && n === 0 && this.endOfStream)
      throw new Ie();
    return n;
  }
  abort() {
    return this.interrupted = !0, this.reader.cancel();
  }
  async close() {
    await this.abort(), this.reader.releaseLock();
  }
}
function XT(e) {
  try {
    const t = e.getReader({ mode: "byob" });
    return t instanceof ReadableStreamDefaultReader ? new fc(t) : new qT(t);
  } catch (t) {
    if (t instanceof TypeError)
      return new fc(e.getReader());
    throw t;
  }
}
class Xi {
  /**
   * Constructor
   * @param options Tokenizer options
   * @protected
   */
  constructor(t) {
    this.numBuffer = new Uint8Array(8), this.position = 0, this.onClose = t == null ? void 0 : t.onClose, t != null && t.abortSignal && t.abortSignal.addEventListener("abort", () => {
      this.abort();
    });
  }
  /**
   * Read a token from the tokenizer-stream
   * @param token - The token to read
   * @param position - If provided, the desired position in the tokenizer-stream
   * @returns Promise with token data
   */
  async readToken(t, r = this.position) {
    const n = new Uint8Array(t.len);
    if (await this.readBuffer(n, { position: r }) < t.len)
      throw new Ie();
    return t.get(n, 0);
  }
  /**
   * Peek a token from the tokenizer-stream.
   * @param token - Token to peek from the tokenizer-stream.
   * @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
   * @returns Promise with token data
   */
  async peekToken(t, r = this.position) {
    const n = new Uint8Array(t.len);
    if (await this.peekBuffer(n, { position: r }) < t.len)
      throw new Ie();
    return t.get(n, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async readNumber(t) {
    if (await this.readBuffer(this.numBuffer, { length: t.len }) < t.len)
      throw new Ie();
    return t.get(this.numBuffer, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async peekNumber(t) {
    if (await this.peekBuffer(this.numBuffer, { length: t.len }) < t.len)
      throw new Ie();
    return t.get(this.numBuffer, 0);
  }
  /**
   * Ignore number of bytes, advances the pointer in under tokenizer-stream.
   * @param length - Number of bytes to ignore
   * @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
   */
  async ignore(t) {
    if (this.fileInfo.size !== void 0) {
      const r = this.fileInfo.size - this.position;
      if (t > r)
        return this.position += r, r;
    }
    return this.position += t, t;
  }
  async close() {
    var t;
    await this.abort(), await ((t = this.onClose) == null ? void 0 : t.call(this));
  }
  normalizeOptions(t, r) {
    if (!this.supportsRandomAccess() && r && r.position !== void 0 && r.position < this.position)
      throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
    return {
      mayBeLess: !1,
      offset: 0,
      length: t.length,
      position: this.position,
      ...r
    };
  }
  abort() {
    return Promise.resolve();
  }
}
const WT = 256e3;
class VT extends Xi {
  /**
   * Constructor
   * @param streamReader stream-reader to read from
   * @param options Tokenizer options
   */
  constructor(t, r) {
    super(r), this.streamReader = t, this.fileInfo = (r == null ? void 0 : r.fileInfo) ?? {};
  }
  /**
   * Read buffer from tokenizer
   * @param uint8Array - Target Uint8Array to fill with data read from the tokenizer-stream
   * @param options - Read behaviour options
   * @returns Promise with number of bytes read
   */
  async readBuffer(t, r) {
    const n = this.normalizeOptions(t, r), i = n.position - this.position;
    if (i > 0)
      return await this.ignore(i), this.readBuffer(t, r);
    if (i < 0)
      throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
    if (n.length === 0)
      return 0;
    const a = await this.streamReader.read(t.subarray(0, n.length), n.mayBeLess);
    if (this.position += a, (!r || !r.mayBeLess) && a < n.length)
      throw new Ie();
    return a;
  }
  /**
   * Peek (read ahead) buffer from tokenizer
   * @param uint8Array - Uint8Array (or Buffer) to write data to
   * @param options - Read behaviour options
   * @returns Promise with number of bytes peeked
   */
  async peekBuffer(t, r) {
    const n = this.normalizeOptions(t, r);
    let i = 0;
    if (n.position) {
      const a = n.position - this.position;
      if (a > 0) {
        const s = new Uint8Array(n.length + a);
        return i = await this.peekBuffer(s, { mayBeLess: n.mayBeLess }), t.set(s.subarray(a)), i - a;
      }
      if (a < 0)
        throw new Error("Cannot peek from a negative offset in a stream");
    }
    if (n.length > 0) {
      try {
        i = await this.streamReader.peek(t.subarray(0, n.length), n.mayBeLess);
      } catch (a) {
        if (r != null && r.mayBeLess && a instanceof Ie)
          return 0;
        throw a;
      }
      if (!n.mayBeLess && i < n.length)
        throw new Ie();
    }
    return i;
  }
  async ignore(t) {
    const r = Math.min(WT, t), n = new Uint8Array(r);
    let i = 0;
    for (; i < t; ) {
      const a = t - i, s = await this.readBuffer(n, { length: Math.min(r, a) });
      if (s < 0)
        return s;
      i += s;
    }
    return i;
  }
  abort() {
    return this.streamReader.abort();
  }
  async close() {
    return this.streamReader.close();
  }
  supportsRandomAccess() {
    return !1;
  }
}
class YT extends Xi {
  /**
   * Construct BufferTokenizer
   * @param uint8Array - Uint8Array to tokenize
   * @param options Tokenizer options
   */
  constructor(t, r) {
    super(r), this.uint8Array = t, this.fileInfo = { ...(r == null ? void 0 : r.fileInfo) ?? {}, size: t.length };
  }
  /**
   * Read buffer from tokenizer
   * @param uint8Array - Uint8Array to tokenize
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  async readBuffer(t, r) {
    r != null && r.position && (this.position = r.position);
    const n = await this.peekBuffer(t, r);
    return this.position += n, n;
  }
  /**
   * Peek (read ahead) buffer from tokenizer
   * @param uint8Array
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  async peekBuffer(t, r) {
    const n = this.normalizeOptions(t, r), i = Math.min(this.uint8Array.length - n.position, n.length);
    if (!n.mayBeLess && i < n.length)
      throw new Ie();
    return t.set(this.uint8Array.subarray(n.position, n.position + i)), i;
  }
  close() {
    return super.close();
  }
  supportsRandomAccess() {
    return !0;
  }
  setPosition(t) {
    this.position = t;
  }
}
class KT extends Xi {
  /**
   * Construct BufferTokenizer
   * @param blob - Uint8Array to tokenize
   * @param options Tokenizer options
   */
  constructor(t, r) {
    super(r), this.blob = t, this.fileInfo = { ...(r == null ? void 0 : r.fileInfo) ?? {}, size: t.size, mimeType: t.type };
  }
  /**
   * Read buffer from tokenizer
   * @param uint8Array - Uint8Array to tokenize
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  async readBuffer(t, r) {
    r != null && r.position && (this.position = r.position);
    const n = await this.peekBuffer(t, r);
    return this.position += n, n;
  }
  /**
   * Peek (read ahead) buffer from tokenizer
   * @param buffer
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  async peekBuffer(t, r) {
    const n = this.normalizeOptions(t, r), i = Math.min(this.blob.size - n.position, n.length);
    if (!n.mayBeLess && i < n.length)
      throw new Ie();
    const a = await this.blob.slice(n.position, n.position + i).arrayBuffer();
    return t.set(new Uint8Array(a)), i;
  }
  close() {
    return super.close();
  }
  supportsRandomAccess() {
    return !0;
  }
  setPosition(t) {
    this.position = t;
  }
}
function JT(e, t) {
  const r = XT(e), n = t ?? {}, i = n.onClose;
  return n.onClose = async () => {
    if (await r.close(), i)
      return i();
  }, new VT(r, n);
}
function ns(e, t) {
  return new YT(e, t);
}
function QT(e, t) {
  return new KT(e, t);
}
class Gs extends Xi {
  /**
   * Create tokenizer from provided file path
   * @param sourceFilePath File path
   */
  static async fromFile(t) {
    const r = await mp(t, "r"), n = await r.stat();
    return new Gs(r, { fileInfo: { path: t, size: n.size } });
  }
  constructor(t, r) {
    super(r), this.fileHandle = t, this.fileInfo = r.fileInfo;
  }
  /**
   * Read buffer from file
   * @param uint8Array - Uint8Array to write result to
   * @param options - Read behaviour options
   * @returns Promise number of bytes read
   */
  async readBuffer(t, r) {
    const n = this.normalizeOptions(t, r);
    if (this.position = n.position, n.length === 0)
      return 0;
    const i = await this.fileHandle.read(t, 0, n.length, n.position);
    if (this.position += i.bytesRead, i.bytesRead < n.length && (!r || !r.mayBeLess))
      throw new Ie();
    return i.bytesRead;
  }
  /**
   * Peek buffer from file
   * @param uint8Array - Uint8Array (or Buffer) to write data to
   * @param options - Read behaviour options
   * @returns Promise number of bytes read
   */
  async peekBuffer(t, r) {
    const n = this.normalizeOptions(t, r), i = await this.fileHandle.read(t, 0, n.length, n.position);
    if (!n.mayBeLess && i.bytesRead < n.length)
      throw new Ie();
    return i.bytesRead;
  }
  async close() {
    return await this.fileHandle.close(), super.close();
  }
  setPosition(t) {
    this.position = t;
  }
  supportsRandomAccess() {
    return !0;
  }
}
const ZT = Gs.fromFile;
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Wi = function(e, t, r, n, i) {
  var a, s, o = i * 8 - n - 1, l = (1 << o) - 1, d = l >> 1, c = -7, u = r ? i - 1 : 0, p = r ? -1 : 1, g = e[t + u];
  for (u += p, a = g & (1 << -c) - 1, g >>= -c, c += o; c > 0; a = a * 256 + e[t + u], u += p, c -= 8)
    ;
  for (s = a & (1 << -c) - 1, a >>= -c, c += n; c > 0; s = s * 256 + e[t + u], u += p, c -= 8)
    ;
  if (a === 0)
    a = 1 - d;
  else {
    if (a === l)
      return s ? NaN : (g ? -1 : 1) * (1 / 0);
    s = s + Math.pow(2, n), a = a - d;
  }
  return (g ? -1 : 1) * s * Math.pow(2, a - n);
}, Vi = function(e, t, r, n, i, a) {
  var s, o, l, d = a * 8 - i - 1, c = (1 << d) - 1, u = c >> 1, p = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, g = n ? 0 : a - 1, w = n ? 1 : -1, x = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (o = isNaN(t) ? 1 : 0, s = c) : (s = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -s)) < 1 && (s--, l *= 2), s + u >= 1 ? t += p / l : t += p * Math.pow(2, 1 - u), t * l >= 2 && (s++, l /= 2), s + u >= c ? (o = 0, s = c) : s + u >= 1 ? (o = (t * l - 1) * Math.pow(2, i), s = s + u) : (o = t * Math.pow(2, u - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + g] = o & 255, g += w, o /= 256, i -= 8)
    ;
  for (s = s << i | o, d += i; d > 0; e[r + g] = s & 255, g += w, s /= 256, d -= 8)
    ;
  e[r + g - w] |= x * 128;
};
const is = {
  128: "€",
  130: "‚",
  131: "ƒ",
  132: "„",
  133: "…",
  134: "†",
  135: "‡",
  136: "ˆ",
  137: "‰",
  138: "Š",
  139: "‹",
  140: "Œ",
  142: "Ž",
  145: "‘",
  146: "’",
  147: "“",
  148: "”",
  149: "•",
  150: "–",
  151: "—",
  152: "˜",
  153: "™",
  154: "š",
  155: "›",
  156: "œ",
  158: "ž",
  159: "Ÿ"
};
for (const [e, t] of Object.entries(is))
  ;
function e_(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8":
      return typeof globalThis.TextDecoder < "u" ? new globalThis.TextDecoder("utf-8").decode(e) : t_(e);
    case "utf-16le":
      return r_(e);
    case "ascii":
      return n_(e);
    case "latin1":
    case "iso-8859-1":
      return i_(e);
    case "windows-1252":
      return a_(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function t_(e) {
  let t = "", r = 0;
  for (; r < e.length; ) {
    const n = e[r++];
    if (n < 128)
      t += String.fromCharCode(n);
    else if (n < 224) {
      const i = e[r++] & 63;
      t += String.fromCharCode((n & 31) << 6 | i);
    } else if (n < 240) {
      const i = e[r++] & 63, a = e[r++] & 63;
      t += String.fromCharCode((n & 15) << 12 | i << 6 | a);
    } else {
      const i = e[r++] & 63, a = e[r++] & 63, s = e[r++] & 63;
      let o = (n & 7) << 18 | i << 12 | a << 6 | s;
      o -= 65536, t += String.fromCharCode(55296 + (o >> 10 & 1023), 56320 + (o & 1023));
    }
  }
  return t;
}
function r_(e) {
  let t = "";
  for (let r = 0; r < e.length; r += 2)
    t += String.fromCharCode(e[r] | e[r + 1] << 8);
  return t;
}
function n_(e) {
  return String.fromCharCode(...e.map((t) => t & 127));
}
function i_(e) {
  return String.fromCharCode(...e);
}
function a_(e) {
  let t = "";
  for (const r of e)
    r >= 128 && r <= 159 && is[r] ? t += is[r] : t += String.fromCharCode(r);
  return t;
}
function G(e) {
  return new DataView(e.buffer, e.byteOffset);
}
const Yt = {
  len: 1,
  get(e, t) {
    return G(e).getUint8(t);
  },
  put(e, t, r) {
    return G(e).setUint8(t, r), t + 1;
  }
}, te = {
  len: 2,
  get(e, t) {
    return G(e).getUint16(t, !0);
  },
  put(e, t, r) {
    return G(e).setUint16(t, r, !0), t + 2;
  }
}, qt = {
  len: 2,
  get(e, t) {
    return G(e).getUint16(t);
  },
  put(e, t, r) {
    return G(e).setUint16(t, r), t + 2;
  }
}, Uf = {
  len: 3,
  get(e, t) {
    const r = G(e);
    return r.getUint8(t) + (r.getUint16(t + 1, !0) << 8);
  },
  put(e, t, r) {
    const n = G(e);
    return n.setUint8(t, r & 255), n.setUint16(t + 1, r >> 8, !0), t + 3;
  }
}, Mf = {
  len: 3,
  get(e, t) {
    const r = G(e);
    return (r.getUint16(t) << 8) + r.getUint8(t + 2);
  },
  put(e, t, r) {
    const n = G(e);
    return n.setUint16(t, r >> 8), n.setUint8(t + 2, r & 255), t + 3;
  }
}, W = {
  len: 4,
  get(e, t) {
    return G(e).getUint32(t, !0);
  },
  put(e, t, r) {
    return G(e).setUint32(t, r, !0), t + 4;
  }
}, wi = {
  len: 4,
  get(e, t) {
    return G(e).getUint32(t);
  },
  put(e, t, r) {
    return G(e).setUint32(t, r), t + 4;
  }
}, as = {
  len: 1,
  get(e, t) {
    return G(e).getInt8(t);
  },
  put(e, t, r) {
    return G(e).setInt8(t, r), t + 1;
  }
}, s_ = {
  len: 2,
  get(e, t) {
    return G(e).getInt16(t);
  },
  put(e, t, r) {
    return G(e).setInt16(t, r), t + 2;
  }
}, o_ = {
  len: 2,
  get(e, t) {
    return G(e).getInt16(t, !0);
  },
  put(e, t, r) {
    return G(e).setInt16(t, r, !0), t + 2;
  }
}, l_ = {
  len: 3,
  get(e, t) {
    const r = Uf.get(e, t);
    return r > 8388607 ? r - 16777216 : r;
  },
  put(e, t, r) {
    const n = G(e);
    return n.setUint8(t, r & 255), n.setUint16(t + 1, r >> 8, !0), t + 3;
  }
}, c_ = {
  len: 3,
  get(e, t) {
    const r = Mf.get(e, t);
    return r > 8388607 ? r - 16777216 : r;
  },
  put(e, t, r) {
    const n = G(e);
    return n.setUint16(t, r >> 8), n.setUint8(t + 2, r & 255), t + 3;
  }
}, Bf = {
  len: 4,
  get(e, t) {
    return G(e).getInt32(t);
  },
  put(e, t, r) {
    return G(e).setInt32(t, r), t + 4;
  }
}, u_ = {
  len: 4,
  get(e, t) {
    return G(e).getInt32(t, !0);
  },
  put(e, t, r) {
    return G(e).setInt32(t, r, !0), t + 4;
  }
}, zf = {
  len: 8,
  get(e, t) {
    return G(e).getBigUint64(t, !0);
  },
  put(e, t, r) {
    return G(e).setBigUint64(t, r, !0), t + 8;
  }
}, f_ = {
  len: 8,
  get(e, t) {
    return G(e).getBigInt64(t, !0);
  },
  put(e, t, r) {
    return G(e).setBigInt64(t, r, !0), t + 8;
  }
}, d_ = {
  len: 8,
  get(e, t) {
    return G(e).getBigUint64(t);
  },
  put(e, t, r) {
    return G(e).setBigUint64(t, r), t + 8;
  }
}, p_ = {
  len: 8,
  get(e, t) {
    return G(e).getBigInt64(t);
  },
  put(e, t, r) {
    return G(e).setBigInt64(t, r), t + 8;
  }
}, h_ = {
  len: 2,
  get(e, t) {
    return Wi(e, t, !1, 10, this.len);
  },
  put(e, t, r) {
    return Vi(e, r, t, !1, 10, this.len), t + this.len;
  }
}, m_ = {
  len: 2,
  get(e, t) {
    return Wi(e, t, !0, 10, this.len);
  },
  put(e, t, r) {
    return Vi(e, r, t, !0, 10, this.len), t + this.len;
  }
}, g_ = {
  len: 4,
  get(e, t) {
    return G(e).getFloat32(t);
  },
  put(e, t, r) {
    return G(e).setFloat32(t, r), t + 4;
  }
}, y_ = {
  len: 4,
  get(e, t) {
    return G(e).getFloat32(t, !0);
  },
  put(e, t, r) {
    return G(e).setFloat32(t, r, !0), t + 4;
  }
}, x_ = {
  len: 8,
  get(e, t) {
    return G(e).getFloat64(t);
  },
  put(e, t, r) {
    return G(e).setFloat64(t, r), t + 8;
  }
}, w_ = {
  len: 8,
  get(e, t) {
    return G(e).getFloat64(t, !0);
  },
  put(e, t, r) {
    return G(e).setFloat64(t, r, !0), t + 8;
  }
}, E_ = {
  len: 10,
  get(e, t) {
    return Wi(e, t, !1, 63, this.len);
  },
  put(e, t, r) {
    return Vi(e, r, t, !1, 63, this.len), t + this.len;
  }
}, v_ = {
  len: 10,
  get(e, t) {
    return Wi(e, t, !0, 63, this.len);
  },
  put(e, t, r) {
    return Vi(e, r, t, !0, 63, this.len), t + this.len;
  }
};
class T_ {
  /**
   * @param len number of bytes to ignore
   */
  constructor(t) {
    this.len = t;
  }
  // ToDo: don't read, but skip data
  get(t, r) {
  }
}
class jf {
  constructor(t) {
    this.len = t;
  }
  get(t, r) {
    return t.subarray(r, r + this.len);
  }
}
class ge {
  constructor(t, r) {
    this.len = t, this.encoding = r;
  }
  get(t, r = 0) {
    const n = t.subarray(r, r + this.len);
    return e_(n, this.encoding);
  }
}
class __ extends ge {
  constructor(t) {
    super(t, "windows-1252");
  }
}
const VS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnsiStringType: __,
  Float16_BE: h_,
  Float16_LE: m_,
  Float32_BE: g_,
  Float32_LE: y_,
  Float64_BE: x_,
  Float64_LE: w_,
  Float80_BE: E_,
  Float80_LE: v_,
  INT16_BE: s_,
  INT16_LE: o_,
  INT24_BE: c_,
  INT24_LE: l_,
  INT32_BE: Bf,
  INT32_LE: u_,
  INT64_BE: p_,
  INT64_LE: f_,
  INT8: as,
  IgnoreType: T_,
  StringType: ge,
  UINT16_BE: qt,
  UINT16_LE: te,
  UINT24_BE: Mf,
  UINT24_LE: Uf,
  UINT32_BE: wi,
  UINT32_LE: W,
  UINT64_BE: d_,
  UINT64_LE: zf,
  UINT8: Yt,
  Uint8ArrayType: jf
}, Symbol.toStringTag, { value: "Module" })), yr = {
  LocalFileHeader: 67324752,
  DataDescriptor: 134695760,
  CentralFileHeader: 33639248,
  EndOfCentralDirectory: 101010256
}, dc = {
  get(e) {
    return {
      signature: W.get(e, 0),
      compressedSize: W.get(e, 8),
      uncompressedSize: W.get(e, 12)
    };
  },
  len: 16
}, b_ = {
  get(e) {
    const t = te.get(e, 6);
    return {
      signature: W.get(e, 0),
      minVersion: te.get(e, 4),
      dataDescriptor: !!(t & 8),
      compressedMethod: te.get(e, 8),
      compressedSize: W.get(e, 18),
      uncompressedSize: W.get(e, 22),
      filenameLength: te.get(e, 26),
      extraFieldLength: te.get(e, 28),
      filename: null
    };
  },
  len: 30
}, S_ = {
  get(e) {
    return {
      signature: W.get(e, 0),
      nrOfThisDisk: te.get(e, 4),
      nrOfThisDiskWithTheStart: te.get(e, 6),
      nrOfEntriesOnThisDisk: te.get(e, 8),
      nrOfEntriesOfSize: te.get(e, 10),
      sizeOfCd: W.get(e, 12),
      offsetOfStartOfCd: W.get(e, 16),
      zipFileCommentLength: te.get(e, 20)
    };
  },
  len: 22
}, A_ = {
  get(e) {
    const t = te.get(e, 8);
    return {
      signature: W.get(e, 0),
      minVersion: te.get(e, 6),
      dataDescriptor: !!(t & 8),
      compressedMethod: te.get(e, 10),
      compressedSize: W.get(e, 20),
      uncompressedSize: W.get(e, 24),
      filenameLength: te.get(e, 28),
      extraFieldLength: te.get(e, 30),
      fileCommentLength: te.get(e, 32),
      relativeOffsetOfLocalHeader: W.get(e, 42),
      filename: null
    };
  },
  len: 46
};
function Gf(e) {
  const t = new Uint8Array(W.len);
  return W.put(t, 0, e), t;
}
const rt = Ir("tokenizer:inflate"), $a = 256 * 1024, I_ = Gf(yr.DataDescriptor), Yn = Gf(yr.EndOfCentralDirectory);
class Hs {
  constructor(t) {
    this.tokenizer = t, this.syncBuffer = new Uint8Array($a);
  }
  async isZip() {
    return await this.peekSignature() === yr.LocalFileHeader;
  }
  peekSignature() {
    return this.tokenizer.peekToken(W);
  }
  async findEndOfCentralDirectoryLocator() {
    const t = this.tokenizer, r = Math.min(16 * 1024, t.fileInfo.size), n = this.syncBuffer.subarray(0, r);
    await this.tokenizer.readBuffer(n, { position: t.fileInfo.size - r });
    for (let i = n.length - 4; i >= 0; i--)
      if (n[i] === Yn[0] && n[i + 1] === Yn[1] && n[i + 2] === Yn[2] && n[i + 3] === Yn[3])
        return t.fileInfo.size - r + i;
    return -1;
  }
  async readCentralDirectory() {
    if (!this.tokenizer.supportsRandomAccess()) {
      rt("Cannot reading central-directory without random-read support");
      return;
    }
    rt("Reading central-directory...");
    const t = this.tokenizer.position, r = await this.findEndOfCentralDirectoryLocator();
    if (r > 0) {
      rt("Central-directory 32-bit signature found");
      const n = await this.tokenizer.readToken(S_, r), i = [];
      this.tokenizer.setPosition(n.offsetOfStartOfCd);
      for (let a = 0; a < n.nrOfEntriesOfSize; ++a) {
        const s = await this.tokenizer.readToken(A_);
        if (s.signature !== yr.CentralFileHeader)
          throw new Error("Expected Central-File-Header signature");
        s.filename = await this.tokenizer.readToken(new ge(s.filenameLength, "utf-8")), await this.tokenizer.ignore(s.extraFieldLength), await this.tokenizer.ignore(s.fileCommentLength), i.push(s), rt(`Add central-directory file-entry: n=${a + 1}/${i.length}: filename=${i[a].filename}`);
      }
      return this.tokenizer.setPosition(t), i;
    }
    this.tokenizer.setPosition(t);
  }
  async unzip(t) {
    const r = await this.readCentralDirectory();
    if (r)
      return this.iterateOverCentralDirectory(r, t);
    let n = !1;
    do {
      const i = await this.readLocalFileHeader();
      if (!i)
        break;
      const a = t(i);
      n = !!a.stop;
      let s;
      if (await this.tokenizer.ignore(i.extraFieldLength), i.dataDescriptor && i.compressedSize === 0) {
        const o = [];
        let l = $a;
        rt("Compressed-file-size unknown, scanning for next data-descriptor-signature....");
        let d = -1;
        for (; d < 0 && l === $a; ) {
          l = await this.tokenizer.peekBuffer(this.syncBuffer, { mayBeLess: !0 }), d = C_(this.syncBuffer.subarray(0, l), I_);
          const c = d >= 0 ? d : l;
          if (a.handler) {
            const u = new Uint8Array(c);
            await this.tokenizer.readBuffer(u), o.push(u);
          } else
            await this.tokenizer.ignore(c);
        }
        rt(`Found data-descriptor-signature at pos=${this.tokenizer.position}`), a.handler && await this.inflate(i, R_(o), a.handler);
      } else
        a.handler ? (rt(`Reading compressed-file-data: ${i.compressedSize} bytes`), s = new Uint8Array(i.compressedSize), await this.tokenizer.readBuffer(s), await this.inflate(i, s, a.handler)) : (rt(`Ignoring compressed-file-data: ${i.compressedSize} bytes`), await this.tokenizer.ignore(i.compressedSize));
      if (rt(`Reading data-descriptor at pos=${this.tokenizer.position}`), i.dataDescriptor && (await this.tokenizer.readToken(dc)).signature !== 134695760)
        throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - dc.len}`);
    } while (!n);
  }
  async iterateOverCentralDirectory(t, r) {
    for (const n of t) {
      const i = r(n);
      if (i.handler) {
        this.tokenizer.setPosition(n.relativeOffsetOfLocalHeader);
        const a = await this.readLocalFileHeader();
        if (a) {
          await this.tokenizer.ignore(a.extraFieldLength);
          const s = new Uint8Array(n.compressedSize);
          await this.tokenizer.readBuffer(s), await this.inflate(a, s, i.handler);
        }
      }
      if (i.stop)
        break;
    }
  }
  async inflate(t, r, n) {
    if (t.compressedMethod === 0)
      return n(r);
    if (t.compressedMethod !== 8)
      throw new Error(`Unsupported ZIP compression method: ${t.compressedMethod}`);
    rt(`Decompress filename=${t.filename}, compressed-size=${r.length}`);
    const i = await Hs.decompressDeflateRaw(r);
    return n(i);
  }
  static async decompressDeflateRaw(t) {
    const r = new ReadableStream({
      start(a) {
        a.enqueue(t), a.close();
      }
    }), n = new DecompressionStream("deflate-raw"), i = r.pipeThrough(n);
    try {
      const s = await new Response(i).arrayBuffer();
      return new Uint8Array(s);
    } catch (a) {
      const s = a instanceof Error ? `Failed to deflate ZIP entry: ${a.message}` : "Unknown decompression error in ZIP entry";
      throw new TypeError(s);
    }
  }
  async readLocalFileHeader() {
    const t = await this.tokenizer.peekToken(W);
    if (t === yr.LocalFileHeader) {
      const r = await this.tokenizer.readToken(b_);
      return r.filename = await this.tokenizer.readToken(new ge(r.filenameLength, "utf-8")), r;
    }
    if (t === yr.CentralFileHeader)
      return !1;
    throw t === 3759263696 ? new Error("Encrypted ZIP") : new Error("Unexpected signature");
  }
}
function C_(e, t) {
  const r = e.length, n = t.length;
  if (n > r)
    return -1;
  for (let i = 0; i <= r - n; i++) {
    let a = !0;
    for (let s = 0; s < n; s++)
      if (e[i + s] !== t[s]) {
        a = !1;
        break;
      }
    if (a)
      return i;
  }
  return -1;
}
function R_(e) {
  const t = e.reduce((i, a) => i + a.length, 0), r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    r.set(i, n), n += i.length;
  return r;
}
class O_ {
  constructor(t) {
    this.tokenizer = t;
  }
  inflate() {
    const t = this.tokenizer;
    return new ReadableStream({
      async pull(r) {
        const n = new Uint8Array(1024), i = await t.readBuffer(n, { mayBeLess: !0 });
        if (i === 0) {
          r.close();
          return;
        }
        r.enqueue(n.subarray(0, i));
      }
    }).pipeThrough(new DecompressionStream("gzip"));
  }
}
const D_ = Object.prototype.toString, P_ = "[object Uint8Array]";
function k_(e, t, r) {
  return e ? e.constructor === t ? !0 : D_.call(e) === r : !1;
}
function N_(e) {
  return k_(e, Uint8Array, P_);
}
function F_(e) {
  if (!N_(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
new globalThis.TextDecoder("utf8");
function $_(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
new globalThis.TextEncoder();
const L_ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function YS(e) {
  F_(e);
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += L_[e[r]];
  return t;
}
const pc = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15
};
function KS(e) {
  if ($_(e), e.length % 2 !== 0)
    throw new Error("Invalid Hex string length.");
  const t = e.length / 2, r = new Uint8Array(t);
  for (let n = 0; n < t; n++) {
    const i = pc[e[n * 2]], a = pc[e[n * 2 + 1]];
    if (i === void 0 || a === void 0)
      throw new Error(`Invalid Hex character encountered at position ${n * 2}`);
    r[n] = i << 4 | a;
  }
  return r;
}
function ss(e) {
  const { byteLength: t } = e;
  if (t === 6)
    return e.getUint16(0) * 2 ** 32 + e.getUint32(2);
  if (t === 5)
    return e.getUint8(0) * 2 ** 32 + e.getUint32(1);
  if (t === 4)
    return e.getUint32(0);
  if (t === 3)
    return e.getUint8(0) * 2 ** 16 + e.getUint16(1);
  if (t === 2)
    return e.getUint16(0);
  if (t === 1)
    return e.getUint8(0);
}
function U_(e, t) {
  if (t === "utf-16le") {
    const r = [];
    for (let n = 0; n < e.length; n++) {
      const i = e.charCodeAt(n);
      r.push(i & 255, i >> 8 & 255);
    }
    return r;
  }
  if (t === "utf-16be") {
    const r = [];
    for (let n = 0; n < e.length; n++) {
      const i = e.charCodeAt(n);
      r.push(i >> 8 & 255, i & 255);
    }
    return r;
  }
  return [...e].map((r) => r.charCodeAt(0));
}
function M_(e, t = 0) {
  const r = Number.parseInt(new ge(6).get(e, 148).replace(/\0.*$/, "").trim(), 8);
  if (Number.isNaN(r))
    return !1;
  let n = 8 * 32;
  for (let i = t; i < t + 148; i++)
    n += e[i];
  for (let i = t + 156; i < t + 512; i++)
    n += e[i];
  return r === n;
}
const B_ = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, z_ = [
  "jpg",
  "png",
  "apng",
  "gif",
  "webp",
  "flif",
  "xcf",
  "cr2",
  "cr3",
  "orf",
  "arw",
  "dng",
  "nef",
  "rw2",
  "raf",
  "tif",
  "bmp",
  "icns",
  "jxr",
  "psd",
  "indd",
  "zip",
  "tar",
  "rar",
  "gz",
  "bz2",
  "7z",
  "dmg",
  "mp4",
  "mid",
  "mkv",
  "webm",
  "mov",
  "avi",
  "mpg",
  "mp2",
  "mp3",
  "m4a",
  "oga",
  "ogg",
  "ogv",
  "opus",
  "flac",
  "wav",
  "spx",
  "amr",
  "pdf",
  "epub",
  "elf",
  "macho",
  "exe",
  "swf",
  "rtf",
  "wasm",
  "woff",
  "woff2",
  "eot",
  "ttf",
  "otf",
  "ttc",
  "ico",
  "flv",
  "ps",
  "xz",
  "sqlite",
  "nes",
  "crx",
  "xpi",
  "cab",
  "deb",
  "ar",
  "rpm",
  "Z",
  "lz",
  "cfb",
  "mxf",
  "mts",
  "blend",
  "bpg",
  "docx",
  "pptx",
  "xlsx",
  "3gp",
  "3g2",
  "j2c",
  "jp2",
  "jpm",
  "jpx",
  "mj2",
  "aif",
  "qcp",
  "odt",
  "ods",
  "odp",
  "xml",
  "mobi",
  "heic",
  "cur",
  "ktx",
  "ape",
  "wv",
  "dcm",
  "ics",
  "glb",
  "pcap",
  "dsf",
  "lnk",
  "alias",
  "voc",
  "ac3",
  "m4v",
  "m4p",
  "m4b",
  "f4v",
  "f4p",
  "f4b",
  "f4a",
  "mie",
  "asf",
  "ogm",
  "ogx",
  "mpc",
  "arrow",
  "shp",
  "aac",
  "mp1",
  "it",
  "s3m",
  "xm",
  "skp",
  "avif",
  "eps",
  "lzh",
  "pgp",
  "asar",
  "stl",
  "chm",
  "3mf",
  "zst",
  "jxl",
  "vcf",
  "jls",
  "pst",
  "dwg",
  "parquet",
  "class",
  "arj",
  "cpio",
  "ace",
  "avro",
  "icc",
  "fbx",
  "vsdx",
  "vtt",
  "apk",
  "drc",
  "lz4",
  "potx",
  "xltx",
  "dotx",
  "xltm",
  "ott",
  "ots",
  "otp",
  "odg",
  "otg",
  "xlsm",
  "docm",
  "dotm",
  "potm",
  "pptm",
  "jar",
  "jmp",
  "rm",
  "sav",
  "ppsm",
  "ppsx",
  "tar.gz",
  "reg",
  "dat"
], j_ = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/flif",
  "image/x-xcf",
  "image/x-canon-cr2",
  "image/x-canon-cr3",
  "image/tiff",
  "image/bmp",
  "image/vnd.ms-photo",
  "image/vnd.adobe.photoshop",
  "application/x-indesign",
  "application/epub+zip",
  "application/x-xpinstall",
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  "application/zip",
  "application/x-tar",
  "application/x-rar-compressed",
  "application/gzip",
  "application/x-bzip2",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/vnd.apache.arrow.file",
  "video/mp4",
  "audio/midi",
  "video/matroska",
  "video/webm",
  "video/quicktime",
  "video/vnd.avi",
  "audio/wav",
  "audio/qcelp",
  "audio/x-ms-asf",
  "video/x-ms-asf",
  "application/vnd.ms-asf",
  "video/mpeg",
  "video/3gpp",
  "audio/mpeg",
  "audio/mp4",
  // RFC 4337
  "video/ogg",
  "audio/ogg",
  "audio/ogg; codecs=opus",
  "application/ogg",
  "audio/flac",
  "audio/ape",
  "audio/wavpack",
  "audio/amr",
  "application/pdf",
  "application/x-elf",
  "application/x-mach-binary",
  "application/x-msdownload",
  "application/x-shockwave-flash",
  "application/rtf",
  "application/wasm",
  "font/woff",
  "font/woff2",
  "application/vnd.ms-fontobject",
  "font/ttf",
  "font/otf",
  "font/collection",
  "image/x-icon",
  "video/x-flv",
  "application/postscript",
  "application/eps",
  "application/x-xz",
  "application/x-sqlite3",
  "application/x-nintendo-nes-rom",
  "application/x-google-chrome-extension",
  "application/vnd.ms-cab-compressed",
  "application/x-deb",
  "application/x-unix-archive",
  "application/x-rpm",
  "application/x-compress",
  "application/x-lzip",
  "application/x-cfb",
  "application/x-mie",
  "application/mxf",
  "video/mp2t",
  "application/x-blender",
  "image/bpg",
  "image/j2c",
  "image/jp2",
  "image/jpx",
  "image/jpm",
  "image/mj2",
  "audio/aiff",
  "application/xml",
  "application/x-mobipocket-ebook",
  "image/heif",
  "image/heif-sequence",
  "image/heic",
  "image/heic-sequence",
  "image/icns",
  "image/ktx",
  "application/dicom",
  "audio/x-musepack",
  "text/calendar",
  "text/vcard",
  "text/vtt",
  "model/gltf-binary",
  "application/vnd.tcpdump.pcap",
  "audio/x-dsf",
  // Non-standard
  "application/x.ms.shortcut",
  // Invented by us
  "application/x.apple.alias",
  // Invented by us
  "audio/x-voc",
  "audio/vnd.dolby.dd-raw",
  "audio/x-m4a",
  "image/apng",
  "image/x-olympus-orf",
  "image/x-sony-arw",
  "image/x-adobe-dng",
  "image/x-nikon-nef",
  "image/x-panasonic-rw2",
  "image/x-fujifilm-raf",
  "video/x-m4v",
  "video/3gpp2",
  "application/x-esri-shape",
  "audio/aac",
  "audio/x-it",
  "audio/x-s3m",
  "audio/x-xm",
  "video/MP1S",
  "video/MP2P",
  "application/vnd.sketchup.skp",
  "image/avif",
  "application/x-lzh-compressed",
  "application/pgp-encrypted",
  "application/x-asar",
  "model/stl",
  "application/vnd.ms-htmlhelp",
  "model/3mf",
  "image/jxl",
  "application/zstd",
  "image/jls",
  "application/vnd.ms-outlook",
  "image/vnd.dwg",
  "application/vnd.apache.parquet",
  "application/java-vm",
  "application/x-arj",
  "application/x-cpio",
  "application/x-ace-compressed",
  "application/avro",
  "application/vnd.iccprofile",
  "application/x.autodesk.fbx",
  // Invented by us
  "application/vnd.visio",
  "application/vnd.android.package-archive",
  "application/vnd.google.draco",
  // Invented by us
  "application/x-lz4",
  // Invented by us
  "application/vnd.openxmlformats-officedocument.presentationml.template",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  "application/vnd.ms-excel.template.macroenabled.12",
  "application/vnd.oasis.opendocument.text-template",
  "application/vnd.oasis.opendocument.spreadsheet-template",
  "application/vnd.oasis.opendocument.presentation-template",
  "application/vnd.oasis.opendocument.graphics",
  "application/vnd.oasis.opendocument.graphics-template",
  "application/vnd.ms-excel.sheet.macroenabled.12",
  "application/vnd.ms-word.document.macroenabled.12",
  "application/vnd.ms-word.template.macroenabled.12",
  "application/vnd.ms-powerpoint.template.macroenabled.12",
  "application/vnd.ms-powerpoint.presentation.macroenabled.12",
  "application/java-archive",
  "application/vnd.rn-realmedia",
  "application/x-spss-sav",
  "application/x-ms-regedit",
  "application/x-ft-windows-registry-hive",
  "application/x-jmp-data"
], La = 4100;
async function Hf(e, t) {
  return new G_(t).fromBuffer(e);
}
function Ua(e) {
  switch (e = e.toLowerCase(), e) {
    case "application/epub+zip":
      return {
        ext: "epub",
        mime: e
      };
    case "application/vnd.oasis.opendocument.text":
      return {
        ext: "odt",
        mime: e
      };
    case "application/vnd.oasis.opendocument.text-template":
      return {
        ext: "ott",
        mime: e
      };
    case "application/vnd.oasis.opendocument.spreadsheet":
      return {
        ext: "ods",
        mime: e
      };
    case "application/vnd.oasis.opendocument.spreadsheet-template":
      return {
        ext: "ots",
        mime: e
      };
    case "application/vnd.oasis.opendocument.presentation":
      return {
        ext: "odp",
        mime: e
      };
    case "application/vnd.oasis.opendocument.presentation-template":
      return {
        ext: "otp",
        mime: e
      };
    case "application/vnd.oasis.opendocument.graphics":
      return {
        ext: "odg",
        mime: e
      };
    case "application/vnd.oasis.opendocument.graphics-template":
      return {
        ext: "otg",
        mime: e
      };
    case "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
      return {
        ext: "ppsx",
        mime: e
      };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return {
        ext: "xlsx",
        mime: e
      };
    case "application/vnd.ms-excel.sheet.macroenabled":
      return {
        ext: "xlsm",
        mime: "application/vnd.ms-excel.sheet.macroenabled.12"
      };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
      return {
        ext: "xltx",
        mime: e
      };
    case "application/vnd.ms-excel.template.macroenabled":
      return {
        ext: "xltm",
        mime: "application/vnd.ms-excel.template.macroenabled.12"
      };
    case "application/vnd.ms-powerpoint.slideshow.macroenabled":
      return {
        ext: "ppsm",
        mime: "application/vnd.ms-powerpoint.slideshow.macroenabled.12"
      };
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return {
        ext: "docx",
        mime: e
      };
    case "application/vnd.ms-word.document.macroenabled":
      return {
        ext: "docm",
        mime: "application/vnd.ms-word.document.macroenabled.12"
      };
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
      return {
        ext: "dotx",
        mime: e
      };
    case "application/vnd.ms-word.template.macroenabledtemplate":
      return {
        ext: "dotm",
        mime: "application/vnd.ms-word.template.macroenabled.12"
      };
    case "application/vnd.openxmlformats-officedocument.presentationml.template":
      return {
        ext: "potx",
        mime: e
      };
    case "application/vnd.ms-powerpoint.template.macroenabled":
      return {
        ext: "potm",
        mime: "application/vnd.ms-powerpoint.template.macroenabled.12"
      };
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return {
        ext: "pptx",
        mime: e
      };
    case "application/vnd.ms-powerpoint.presentation.macroenabled":
      return {
        ext: "pptm",
        mime: "application/vnd.ms-powerpoint.presentation.macroenabled.12"
      };
    case "application/vnd.ms-visio.drawing":
      return {
        ext: "vsdx",
        mime: "application/vnd.visio"
      };
    case "application/vnd.ms-package.3dmanufacturing-3dmodel+xml":
      return {
        ext: "3mf",
        mime: "model/3mf"
      };
  }
}
function nt(e, t, r) {
  r = {
    offset: 0,
    ...r
  };
  for (const [n, i] of t.entries())
    if (r.mask) {
      if (i !== (r.mask[n] & e[n + r.offset]))
        return !1;
    } else if (i !== e[n + r.offset])
      return !1;
  return !0;
}
class G_ {
  constructor(t) {
    // Detections with a high degree of certainty in identifying the correct file type
    ia(this, "detectConfident", async (t) => {
      if (this.buffer = new Uint8Array(La), t.fileInfo.size === void 0 && (t.fileInfo.size = Number.MAX_SAFE_INTEGER), this.tokenizer = t, await t.peekBuffer(this.buffer, { length: 32, mayBeLess: !0 }), this.check([66, 77]))
        return {
          ext: "bmp",
          mime: "image/bmp"
        };
      if (this.check([11, 119]))
        return {
          ext: "ac3",
          mime: "audio/vnd.dolby.dd-raw"
        };
      if (this.check([120, 1]))
        return {
          ext: "dmg",
          mime: "application/x-apple-diskimage"
        };
      if (this.check([77, 90]))
        return {
          ext: "exe",
          mime: "application/x-msdownload"
        };
      if (this.check([37, 33]))
        return await t.peekBuffer(this.buffer, { length: 24, mayBeLess: !0 }), this.checkString("PS-Adobe-", { offset: 2 }) && this.checkString(" EPSF-", { offset: 14 }) ? {
          ext: "eps",
          mime: "application/eps"
        } : {
          ext: "ps",
          mime: "application/postscript"
        };
      if (this.check([31, 160]) || this.check([31, 157]))
        return {
          ext: "Z",
          mime: "application/x-compress"
        };
      if (this.check([199, 113]))
        return {
          ext: "cpio",
          mime: "application/x-cpio"
        };
      if (this.check([96, 234]))
        return {
          ext: "arj",
          mime: "application/x-arj"
        };
      if (this.check([239, 187, 191]))
        return this.tokenizer.ignore(3), this.detectConfident(t);
      if (this.check([71, 73, 70]))
        return {
          ext: "gif",
          mime: "image/gif"
        };
      if (this.check([73, 73, 188]))
        return {
          ext: "jxr",
          mime: "image/vnd.ms-photo"
        };
      if (this.check([31, 139, 8])) {
        const n = new O_(t).inflate();
        let i = !0;
        try {
          let a;
          try {
            a = await this.fromStream(n);
          } catch {
            i = !1;
          }
          if (a && a.ext === "tar")
            return {
              ext: "tar.gz",
              mime: "application/gzip"
            };
        } finally {
          i && await n.cancel();
        }
        return {
          ext: "gz",
          mime: "application/gzip"
        };
      }
      if (this.check([66, 90, 104]))
        return {
          ext: "bz2",
          mime: "application/x-bzip2"
        };
      if (this.checkString("ID3")) {
        await t.ignore(6);
        const r = await t.readToken(B_);
        return t.position + r > t.fileInfo.size ? {
          ext: "mp3",
          mime: "audio/mpeg"
        } : (await t.ignore(r), this.fromTokenizer(t));
      }
      if (this.checkString("MP+"))
        return {
          ext: "mpc",
          mime: "audio/x-musepack"
        };
      if ((this.buffer[0] === 67 || this.buffer[0] === 70) && this.check([87, 83], { offset: 1 }))
        return {
          ext: "swf",
          mime: "application/x-shockwave-flash"
        };
      if (this.check([255, 216, 255]))
        return this.check([247], { offset: 3 }) ? {
          ext: "jls",
          mime: "image/jls"
        } : {
          ext: "jpg",
          mime: "image/jpeg"
        };
      if (this.check([79, 98, 106, 1]))
        return {
          ext: "avro",
          mime: "application/avro"
        };
      if (this.checkString("FLIF"))
        return {
          ext: "flif",
          mime: "image/flif"
        };
      if (this.checkString("8BPS"))
        return {
          ext: "psd",
          mime: "image/vnd.adobe.photoshop"
        };
      if (this.checkString("MPCK"))
        return {
          ext: "mpc",
          mime: "audio/x-musepack"
        };
      if (this.checkString("FORM"))
        return {
          ext: "aif",
          mime: "audio/aiff"
        };
      if (this.checkString("icns", { offset: 0 }))
        return {
          ext: "icns",
          mime: "image/icns"
        };
      if (this.check([80, 75, 3, 4])) {
        let r;
        return await new Hs(t).unzip((n) => {
          switch (n.filename) {
            case "META-INF/mozilla.rsa":
              return r = {
                ext: "xpi",
                mime: "application/x-xpinstall"
              }, {
                stop: !0
              };
            case "META-INF/MANIFEST.MF":
              return r = {
                ext: "jar",
                mime: "application/java-archive"
              }, {
                stop: !0
              };
            case "mimetype":
              return {
                async handler(i) {
                  const a = new TextDecoder("utf-8").decode(i).trim();
                  r = Ua(a);
                },
                stop: !0
              };
            case "[Content_Types].xml":
              return {
                async handler(i) {
                  let a = new TextDecoder("utf-8").decode(i);
                  const s = a.indexOf('.main+xml"');
                  if (s === -1) {
                    const o = "application/vnd.ms-package.3dmanufacturing-3dmodel+xml";
                    a.includes(`ContentType="${o}"`) && (r = Ua(o));
                  } else {
                    a = a.slice(0, Math.max(0, s));
                    const o = a.lastIndexOf('"'), l = a.slice(Math.max(0, o + 1));
                    r = Ua(l);
                  }
                },
                stop: !0
              };
            default:
              return /classes\d*\.dex/.test(n.filename) ? (r = {
                ext: "apk",
                mime: "application/vnd.android.package-archive"
              }, { stop: !0 }) : {};
          }
        }).catch((n) => {
          if (!(n instanceof Ie))
            throw n;
        }), r ?? {
          ext: "zip",
          mime: "application/zip"
        };
      }
      if (this.checkString("OggS")) {
        await t.ignore(28);
        const r = new Uint8Array(8);
        return await t.readBuffer(r), nt(r, [79, 112, 117, 115, 72, 101, 97, 100]) ? {
          ext: "opus",
          mime: "audio/ogg; codecs=opus"
        } : nt(r, [128, 116, 104, 101, 111, 114, 97]) ? {
          ext: "ogv",
          mime: "video/ogg"
        } : nt(r, [1, 118, 105, 100, 101, 111, 0]) ? {
          ext: "ogm",
          mime: "video/ogg"
        } : nt(r, [127, 70, 76, 65, 67]) ? {
          ext: "oga",
          mime: "audio/ogg"
        } : nt(r, [83, 112, 101, 101, 120, 32, 32]) ? {
          ext: "spx",
          mime: "audio/ogg"
        } : nt(r, [1, 118, 111, 114, 98, 105, 115]) ? {
          ext: "ogg",
          mime: "audio/ogg"
        } : {
          ext: "ogx",
          mime: "application/ogg"
        };
      }
      if (this.check([80, 75]) && (this.buffer[2] === 3 || this.buffer[2] === 5 || this.buffer[2] === 7) && (this.buffer[3] === 4 || this.buffer[3] === 6 || this.buffer[3] === 8))
        return {
          ext: "zip",
          mime: "application/zip"
        };
      if (this.checkString("MThd"))
        return {
          ext: "mid",
          mime: "audio/midi"
        };
      if (this.checkString("wOFF") && (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 })))
        return {
          ext: "woff",
          mime: "font/woff"
        };
      if (this.checkString("wOF2") && (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 })))
        return {
          ext: "woff2",
          mime: "font/woff2"
        };
      if (this.check([212, 195, 178, 161]) || this.check([161, 178, 195, 212]))
        return {
          ext: "pcap",
          mime: "application/vnd.tcpdump.pcap"
        };
      if (this.checkString("DSD "))
        return {
          ext: "dsf",
          mime: "audio/x-dsf"
          // Non-standard
        };
      if (this.checkString("LZIP"))
        return {
          ext: "lz",
          mime: "application/x-lzip"
        };
      if (this.checkString("fLaC"))
        return {
          ext: "flac",
          mime: "audio/flac"
        };
      if (this.check([66, 80, 71, 251]))
        return {
          ext: "bpg",
          mime: "image/bpg"
        };
      if (this.checkString("wvpk"))
        return {
          ext: "wv",
          mime: "audio/wavpack"
        };
      if (this.checkString("%PDF"))
        return {
          ext: "pdf",
          mime: "application/pdf"
        };
      if (this.check([0, 97, 115, 109]))
        return {
          ext: "wasm",
          mime: "application/wasm"
        };
      if (this.check([73, 73])) {
        const r = await this.readTiffHeader(!1);
        if (r)
          return r;
      }
      if (this.check([77, 77])) {
        const r = await this.readTiffHeader(!0);
        if (r)
          return r;
      }
      if (this.checkString("MAC "))
        return {
          ext: "ape",
          mime: "audio/ape"
        };
      if (this.check([26, 69, 223, 163])) {
        async function r() {
          const o = await t.peekNumber(Yt);
          let l = 128, d = 0;
          for (; !(o & l) && l !== 0; )
            ++d, l >>= 1;
          const c = new Uint8Array(d + 1);
          return await t.readBuffer(c), c;
        }
        async function n() {
          const o = await r(), l = await r();
          l[0] ^= 128 >> l.length - 1;
          const d = Math.min(6, l.length), c = new DataView(o.buffer), u = new DataView(l.buffer, l.length - d, d);
          return {
            id: ss(c),
            len: ss(u)
          };
        }
        async function i(o) {
          for (; o > 0; ) {
            const l = await n();
            if (l.id === 17026)
              return (await t.readToken(new ge(l.len))).replaceAll(/\00.*$/g, "");
            await t.ignore(l.len), --o;
          }
        }
        const a = await n();
        switch (await i(a.len)) {
          case "webm":
            return {
              ext: "webm",
              mime: "video/webm"
            };
          case "matroska":
            return {
              ext: "mkv",
              mime: "video/matroska"
            };
          default:
            return;
        }
      }
      if (this.checkString("SQLi"))
        return {
          ext: "sqlite",
          mime: "application/x-sqlite3"
        };
      if (this.check([78, 69, 83, 26]))
        return {
          ext: "nes",
          mime: "application/x-nintendo-nes-rom"
        };
      if (this.checkString("Cr24"))
        return {
          ext: "crx",
          mime: "application/x-google-chrome-extension"
        };
      if (this.checkString("MSCF") || this.checkString("ISc("))
        return {
          ext: "cab",
          mime: "application/vnd.ms-cab-compressed"
        };
      if (this.check([237, 171, 238, 219]))
        return {
          ext: "rpm",
          mime: "application/x-rpm"
        };
      if (this.check([197, 208, 211, 198]))
        return {
          ext: "eps",
          mime: "application/eps"
        };
      if (this.check([40, 181, 47, 253]))
        return {
          ext: "zst",
          mime: "application/zstd"
        };
      if (this.check([127, 69, 76, 70]))
        return {
          ext: "elf",
          mime: "application/x-elf"
        };
      if (this.check([33, 66, 68, 78]))
        return {
          ext: "pst",
          mime: "application/vnd.ms-outlook"
        };
      if (this.checkString("PAR1") || this.checkString("PARE"))
        return {
          ext: "parquet",
          mime: "application/vnd.apache.parquet"
        };
      if (this.checkString("ttcf"))
        return {
          ext: "ttc",
          mime: "font/collection"
        };
      if (this.check([207, 250, 237, 254]))
        return {
          ext: "macho",
          mime: "application/x-mach-binary"
        };
      if (this.check([4, 34, 77, 24]))
        return {
          ext: "lz4",
          mime: "application/x-lz4"
          // Invented by us
        };
      if (this.checkString("regf"))
        return {
          ext: "dat",
          mime: "application/x-ft-windows-registry-hive"
        };
      if (this.checkString("$FL2") || this.checkString("$FL3"))
        return {
          ext: "sav",
          mime: "application/x-spss-sav"
        };
      if (this.check([79, 84, 84, 79, 0]))
        return {
          ext: "otf",
          mime: "font/otf"
        };
      if (this.checkString("#!AMR"))
        return {
          ext: "amr",
          mime: "audio/amr"
        };
      if (this.checkString("{\\rtf"))
        return {
          ext: "rtf",
          mime: "application/rtf"
        };
      if (this.check([70, 76, 86, 1]))
        return {
          ext: "flv",
          mime: "video/x-flv"
        };
      if (this.checkString("IMPM"))
        return {
          ext: "it",
          mime: "audio/x-it"
        };
      if (this.checkString("-lh0-", { offset: 2 }) || this.checkString("-lh1-", { offset: 2 }) || this.checkString("-lh2-", { offset: 2 }) || this.checkString("-lh3-", { offset: 2 }) || this.checkString("-lh4-", { offset: 2 }) || this.checkString("-lh5-", { offset: 2 }) || this.checkString("-lh6-", { offset: 2 }) || this.checkString("-lh7-", { offset: 2 }) || this.checkString("-lzs-", { offset: 2 }) || this.checkString("-lz4-", { offset: 2 }) || this.checkString("-lz5-", { offset: 2 }) || this.checkString("-lhd-", { offset: 2 }))
        return {
          ext: "lzh",
          mime: "application/x-lzh-compressed"
        };
      if (this.check([0, 0, 1, 186])) {
        if (this.check([33], { offset: 4, mask: [241] }))
          return {
            ext: "mpg",
            // May also be .ps, .mpeg
            mime: "video/MP1S"
          };
        if (this.check([68], { offset: 4, mask: [196] }))
          return {
            ext: "mpg",
            // May also be .mpg, .m2p, .vob or .sub
            mime: "video/MP2P"
          };
      }
      if (this.checkString("ITSF"))
        return {
          ext: "chm",
          mime: "application/vnd.ms-htmlhelp"
        };
      if (this.check([202, 254, 186, 190]))
        return {
          ext: "class",
          mime: "application/java-vm"
        };
      if (this.checkString(".RMF"))
        return {
          ext: "rm",
          mime: "application/vnd.rn-realmedia"
        };
      if (this.checkString("DRACO"))
        return {
          ext: "drc",
          mime: "application/vnd.google.draco"
          // Invented by us
        };
      if (this.check([253, 55, 122, 88, 90, 0]))
        return {
          ext: "xz",
          mime: "application/x-xz"
        };
      if (this.checkString("<?xml "))
        return {
          ext: "xml",
          mime: "application/xml"
        };
      if (this.check([55, 122, 188, 175, 39, 28]))
        return {
          ext: "7z",
          mime: "application/x-7z-compressed"
        };
      if (this.check([82, 97, 114, 33, 26, 7]) && (this.buffer[6] === 0 || this.buffer[6] === 1))
        return {
          ext: "rar",
          mime: "application/x-rar-compressed"
        };
      if (this.checkString("solid "))
        return {
          ext: "stl",
          mime: "model/stl"
        };
      if (this.checkString("AC")) {
        const r = new ge(4, "latin1").get(this.buffer, 2);
        if (r.match("^d*") && r >= 1e3 && r <= 1050)
          return {
            ext: "dwg",
            mime: "image/vnd.dwg"
          };
      }
      if (this.checkString("070707"))
        return {
          ext: "cpio",
          mime: "application/x-cpio"
        };
      if (this.checkString("BLENDER"))
        return {
          ext: "blend",
          mime: "application/x-blender"
        };
      if (this.checkString("!<arch>"))
        return await t.ignore(8), await t.readToken(new ge(13, "ascii")) === "debian-binary" ? {
          ext: "deb",
          mime: "application/x-deb"
        } : {
          ext: "ar",
          mime: "application/x-unix-archive"
        };
      if (this.checkString("WEBVTT") && // One of LF, CR, tab, space, or end of file must follow "WEBVTT" per the spec (see `fixture/fixture-vtt-*.vtt` for examples). Note that `\0` is technically the null character (there is no such thing as an EOF character). However, checking for `\0` gives us the same result as checking for the end of the stream.
      [`
`, "\r", "	", " ", "\0"].some((r) => this.checkString(r, { offset: 6 })))
        return {
          ext: "vtt",
          mime: "text/vtt"
        };
      if (this.check([137, 80, 78, 71, 13, 10, 26, 10])) {
        await t.ignore(8);
        async function r() {
          return {
            length: await t.readToken(Bf),
            type: await t.readToken(new ge(4, "latin1"))
          };
        }
        do {
          const n = await r();
          if (n.length < 0)
            return;
          switch (n.type) {
            case "IDAT":
              return {
                ext: "png",
                mime: "image/png"
              };
            case "acTL":
              return {
                ext: "apng",
                mime: "image/apng"
              };
            default:
              await t.ignore(n.length + 4);
          }
        } while (t.position + 8 < t.fileInfo.size);
        return {
          ext: "png",
          mime: "image/png"
        };
      }
      if (this.check([65, 82, 82, 79, 87, 49, 0, 0]))
        return {
          ext: "arrow",
          mime: "application/vnd.apache.arrow.file"
        };
      if (this.check([103, 108, 84, 70, 2, 0, 0, 0]))
        return {
          ext: "glb",
          mime: "model/gltf-binary"
        };
      if (this.check([102, 114, 101, 101], { offset: 4 }) || this.check([109, 100, 97, 116], { offset: 4 }) || this.check([109, 111, 111, 118], { offset: 4 }) || this.check([119, 105, 100, 101], { offset: 4 }))
        return {
          ext: "mov",
          mime: "video/quicktime"
        };
      if (this.check([73, 73, 82, 79, 8, 0, 0, 0, 24]))
        return {
          ext: "orf",
          mime: "image/x-olympus-orf"
        };
      if (this.checkString("gimp xcf "))
        return {
          ext: "xcf",
          mime: "image/x-xcf"
        };
      if (this.checkString("ftyp", { offset: 4 }) && this.buffer[8] & 96) {
        const r = new ge(4, "latin1").get(this.buffer, 8).replace("\0", " ").trim();
        switch (r) {
          case "avif":
          case "avis":
            return { ext: "avif", mime: "image/avif" };
          case "mif1":
            return { ext: "heic", mime: "image/heif" };
          case "msf1":
            return { ext: "heic", mime: "image/heif-sequence" };
          case "heic":
          case "heix":
            return { ext: "heic", mime: "image/heic" };
          case "hevc":
          case "hevx":
            return { ext: "heic", mime: "image/heic-sequence" };
          case "qt":
            return { ext: "mov", mime: "video/quicktime" };
          case "M4V":
          case "M4VH":
          case "M4VP":
            return { ext: "m4v", mime: "video/x-m4v" };
          case "M4P":
            return { ext: "m4p", mime: "video/mp4" };
          case "M4B":
            return { ext: "m4b", mime: "audio/mp4" };
          case "M4A":
            return { ext: "m4a", mime: "audio/x-m4a" };
          case "F4V":
            return { ext: "f4v", mime: "video/mp4" };
          case "F4P":
            return { ext: "f4p", mime: "video/mp4" };
          case "F4A":
            return { ext: "f4a", mime: "audio/mp4" };
          case "F4B":
            return { ext: "f4b", mime: "audio/mp4" };
          case "crx":
            return { ext: "cr3", mime: "image/x-canon-cr3" };
          default:
            return r.startsWith("3g") ? r.startsWith("3g2") ? { ext: "3g2", mime: "video/3gpp2" } : { ext: "3gp", mime: "video/3gpp" } : { ext: "mp4", mime: "video/mp4" };
        }
      }
      if (this.checkString(`REGEDIT4\r
`))
        return {
          ext: "reg",
          mime: "application/x-ms-regedit"
        };
      if (this.check([82, 73, 70, 70])) {
        if (this.checkString("WEBP", { offset: 8 }))
          return {
            ext: "webp",
            mime: "image/webp"
          };
        if (this.check([65, 86, 73], { offset: 8 }))
          return {
            ext: "avi",
            mime: "video/vnd.avi"
          };
        if (this.check([87, 65, 86, 69], { offset: 8 }))
          return {
            ext: "wav",
            mime: "audio/wav"
          };
        if (this.check([81, 76, 67, 77], { offset: 8 }))
          return {
            ext: "qcp",
            mime: "audio/qcelp"
          };
      }
      if (this.check([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216]))
        return {
          ext: "rw2",
          mime: "image/x-panasonic-rw2"
        };
      if (this.check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
        async function r() {
          const n = new Uint8Array(16);
          return await t.readBuffer(n), {
            id: n,
            size: Number(await t.readToken(zf))
          };
        }
        for (await t.ignore(30); t.position + 24 < t.fileInfo.size; ) {
          const n = await r();
          let i = n.size - 24;
          if (nt(n.id, [145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101])) {
            const a = new Uint8Array(16);
            if (i -= await t.readBuffer(a), nt(a, [64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43]))
              return {
                ext: "asf",
                mime: "audio/x-ms-asf"
              };
            if (nt(a, [192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43]))
              return {
                ext: "asf",
                mime: "video/x-ms-asf"
              };
            break;
          }
          await t.ignore(i);
        }
        return {
          ext: "asf",
          mime: "application/vnd.ms-asf"
        };
      }
      if (this.check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10]))
        return {
          ext: "ktx",
          mime: "image/ktx"
        };
      if ((this.check([126, 16, 4]) || this.check([126, 24, 4])) && this.check([48, 77, 73, 69], { offset: 4 }))
        return {
          ext: "mie",
          mime: "application/x-mie"
        };
      if (this.check([39, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { offset: 2 }))
        return {
          ext: "shp",
          mime: "application/x-esri-shape"
        };
      if (this.check([255, 79, 255, 81]))
        return {
          ext: "j2c",
          mime: "image/j2c"
        };
      if (this.check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10]))
        switch (await t.ignore(20), await t.readToken(new ge(4, "ascii"))) {
          case "jp2 ":
            return {
              ext: "jp2",
              mime: "image/jp2"
            };
          case "jpx ":
            return {
              ext: "jpx",
              mime: "image/jpx"
            };
          case "jpm ":
            return {
              ext: "jpm",
              mime: "image/jpm"
            };
          case "mjp2":
            return {
              ext: "mj2",
              mime: "image/mj2"
            };
          default:
            return;
        }
      if (this.check([255, 10]) || this.check([0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10]))
        return {
          ext: "jxl",
          mime: "image/jxl"
        };
      if (this.check([254, 255]))
        return this.checkString("<?xml ", { offset: 2, encoding: "utf-16be" }) ? {
          ext: "xml",
          mime: "application/xml"
        } : void 0;
      if (this.check([208, 207, 17, 224, 161, 177, 26, 225]))
        return {
          ext: "cfb",
          mime: "application/x-cfb"
        };
      if (await t.peekBuffer(this.buffer, { length: Math.min(256, t.fileInfo.size), mayBeLess: !0 }), this.check([97, 99, 115, 112], { offset: 36 }))
        return {
          ext: "icc",
          mime: "application/vnd.iccprofile"
        };
      if (this.checkString("**ACE", { offset: 7 }) && this.checkString("**", { offset: 12 }))
        return {
          ext: "ace",
          mime: "application/x-ace-compressed"
        };
      if (this.checkString("BEGIN:")) {
        if (this.checkString("VCARD", { offset: 6 }))
          return {
            ext: "vcf",
            mime: "text/vcard"
          };
        if (this.checkString("VCALENDAR", { offset: 6 }))
          return {
            ext: "ics",
            mime: "text/calendar"
          };
      }
      if (this.checkString("FUJIFILMCCD-RAW"))
        return {
          ext: "raf",
          mime: "image/x-fujifilm-raf"
        };
      if (this.checkString("Extended Module:"))
        return {
          ext: "xm",
          mime: "audio/x-xm"
        };
      if (this.checkString("Creative Voice File"))
        return {
          ext: "voc",
          mime: "audio/x-voc"
        };
      if (this.check([4, 0, 0, 0]) && this.buffer.length >= 16) {
        const r = new DataView(this.buffer.buffer).getUint32(12, !0);
        if (r > 12 && this.buffer.length >= r + 16)
          try {
            const n = new TextDecoder().decode(this.buffer.subarray(16, r + 16));
            if (JSON.parse(n).files)
              return {
                ext: "asar",
                mime: "application/x-asar"
              };
          } catch {
          }
      }
      if (this.check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2]))
        return {
          ext: "mxf",
          mime: "application/mxf"
        };
      if (this.checkString("SCRM", { offset: 44 }))
        return {
          ext: "s3m",
          mime: "audio/x-s3m"
        };
      if (this.check([71]) && this.check([71], { offset: 188 }))
        return {
          ext: "mts",
          mime: "video/mp2t"
        };
      if (this.check([71], { offset: 4 }) && this.check([71], { offset: 196 }))
        return {
          ext: "mts",
          mime: "video/mp2t"
        };
      if (this.check([66, 79, 79, 75, 77, 79, 66, 73], { offset: 60 }))
        return {
          ext: "mobi",
          mime: "application/x-mobipocket-ebook"
        };
      if (this.check([68, 73, 67, 77], { offset: 128 }))
        return {
          ext: "dcm",
          mime: "application/dicom"
        };
      if (this.check([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70]))
        return {
          ext: "lnk",
          mime: "application/x.ms.shortcut"
          // Invented by us
        };
      if (this.check([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0]))
        return {
          ext: "alias",
          mime: "application/x.apple.alias"
          // Invented by us
        };
      if (this.checkString("Kaydara FBX Binary  \0"))
        return {
          ext: "fbx",
          mime: "application/x.autodesk.fbx"
          // Invented by us
        };
      if (this.check([76, 80], { offset: 34 }) && (this.check([0, 0, 1], { offset: 8 }) || this.check([1, 0, 2], { offset: 8 }) || this.check([2, 0, 2], { offset: 8 })))
        return {
          ext: "eot",
          mime: "application/vnd.ms-fontobject"
        };
      if (this.check([6, 6, 237, 245, 216, 29, 70, 229, 189, 49, 239, 231, 254, 116, 183, 29]))
        return {
          ext: "indd",
          mime: "application/x-indesign"
        };
      if (this.check([255, 255, 0, 0, 7, 0, 0, 0, 4, 0, 0, 0, 1, 0, 1, 0]) || this.check([0, 0, 255, 255, 0, 0, 0, 7, 0, 0, 0, 4, 0, 1, 0, 1]))
        return {
          ext: "jmp",
          mime: "application/x-jmp-data"
        };
      if (await t.peekBuffer(this.buffer, { length: Math.min(512, t.fileInfo.size), mayBeLess: !0 }), this.checkString("ustar", { offset: 257 }) && (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 })) || this.check([0, 0, 0, 0, 0, 0], { offset: 257 }) && M_(this.buffer))
        return {
          ext: "tar",
          mime: "application/x-tar"
        };
      if (this.check([255, 254])) {
        const r = "utf-16le";
        return this.checkString("<?xml ", { offset: 2, encoding: r }) ? {
          ext: "xml",
          mime: "application/xml"
        } : this.check([255, 14], { offset: 2 }) && this.checkString("SketchUp Model", { offset: 4, encoding: r }) ? {
          ext: "skp",
          mime: "application/vnd.sketchup.skp"
        } : this.checkString(`Windows Registry Editor Version 5.00\r
`, { offset: 2, encoding: r }) ? {
          ext: "reg",
          mime: "application/x-ms-regedit"
        } : void 0;
      }
      if (this.checkString("-----BEGIN PGP MESSAGE-----"))
        return {
          ext: "pgp",
          mime: "application/pgp-encrypted"
        };
    });
    // Detections with limited supporting data, resulting in a higher likelihood of false positives
    ia(this, "detectImprecise", async (t) => {
      if (this.buffer = new Uint8Array(La), await t.peekBuffer(this.buffer, { length: Math.min(8, t.fileInfo.size), mayBeLess: !0 }), this.check([0, 0, 1, 186]) || this.check([0, 0, 1, 179]))
        return {
          ext: "mpg",
          mime: "video/mpeg"
        };
      if (this.check([0, 1, 0, 0, 0]))
        return {
          ext: "ttf",
          mime: "font/ttf"
        };
      if (this.check([0, 0, 1, 0]))
        return {
          ext: "ico",
          mime: "image/x-icon"
        };
      if (this.check([0, 0, 2, 0]))
        return {
          ext: "cur",
          mime: "image/x-icon"
        };
      if (await t.peekBuffer(this.buffer, { length: Math.min(2 + this.options.mpegOffsetTolerance, t.fileInfo.size), mayBeLess: !0 }), this.buffer.length >= 2 + this.options.mpegOffsetTolerance)
        for (let r = 0; r <= this.options.mpegOffsetTolerance; ++r) {
          const n = this.scanMpeg(r);
          if (n)
            return n;
        }
    });
    this.options = {
      mpegOffsetTolerance: 0,
      ...t
    }, this.detectors = [
      ...(t == null ? void 0 : t.customDetectors) ?? [],
      { id: "core", detect: this.detectConfident },
      { id: "core.imprecise", detect: this.detectImprecise }
    ], this.tokenizerOptions = {
      abortSignal: t == null ? void 0 : t.signal
    };
  }
  async fromTokenizer(t) {
    const r = t.position;
    for (const n of this.detectors) {
      const i = await n.detect(t);
      if (i)
        return i;
      if (r !== t.position)
        return;
    }
  }
  async fromBuffer(t) {
    if (!(t instanceof Uint8Array || t instanceof ArrayBuffer))
      throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof t}\``);
    const r = t instanceof Uint8Array ? t : new Uint8Array(t);
    if ((r == null ? void 0 : r.length) > 1)
      return this.fromTokenizer(ns(r, this.tokenizerOptions));
  }
  async fromBlob(t) {
    const r = QT(t, this.tokenizerOptions);
    try {
      return await this.fromTokenizer(r);
    } finally {
      await r.close();
    }
  }
  async fromStream(t) {
    const r = JT(t, this.tokenizerOptions);
    try {
      return await this.fromTokenizer(r);
    } finally {
      await r.close();
    }
  }
  async toDetectionStream(t, r) {
    const { sampleSize: n = La } = r;
    let i, a;
    const s = t.getReader({ mode: "byob" });
    try {
      const { value: d, done: c } = await s.read(new Uint8Array(n));
      if (a = d, !c && d)
        try {
          i = await this.fromBuffer(d.subarray(0, n));
        } catch (u) {
          if (!(u instanceof Ie))
            throw u;
          i = void 0;
        }
      a = d;
    } finally {
      s.releaseLock();
    }
    const o = new TransformStream({
      async start(d) {
        d.enqueue(a);
      },
      transform(d, c) {
        c.enqueue(d);
      }
    }), l = t.pipeThrough(o);
    return l.fileType = i, l;
  }
  check(t, r) {
    return nt(this.buffer, t, r);
  }
  checkString(t, r) {
    return this.check(U_(t, r == null ? void 0 : r.encoding), r);
  }
  async readTiffTag(t) {
    const r = await this.tokenizer.readToken(t ? qt : te);
    switch (this.tokenizer.ignore(10), r) {
      case 50341:
        return {
          ext: "arw",
          mime: "image/x-sony-arw"
        };
      case 50706:
        return {
          ext: "dng",
          mime: "image/x-adobe-dng"
        };
    }
  }
  async readTiffIFD(t) {
    const r = await this.tokenizer.readToken(t ? qt : te);
    for (let n = 0; n < r; ++n) {
      const i = await this.readTiffTag(t);
      if (i)
        return i;
    }
  }
  async readTiffHeader(t) {
    const r = (t ? qt : te).get(this.buffer, 2), n = (t ? wi : W).get(this.buffer, 4);
    if (r === 42) {
      if (n >= 6) {
        if (this.checkString("CR", { offset: 8 }))
          return {
            ext: "cr2",
            mime: "image/x-canon-cr2"
          };
        if (n >= 8) {
          const a = (t ? qt : te).get(this.buffer, 8), s = (t ? qt : te).get(this.buffer, 10);
          if (a === 28 && s === 254 || a === 31 && s === 11)
            return {
              ext: "nef",
              mime: "image/x-nikon-nef"
            };
        }
      }
      return await this.tokenizer.ignore(n), await this.readTiffIFD(t) ?? {
        ext: "tif",
        mime: "image/tiff"
      };
    }
    if (r === 43)
      return {
        ext: "tif",
        mime: "image/tiff"
      };
  }
  /**
  	Scan check MPEG 1 or 2 Layer 3 header, or 'layer 0' for ADTS (MPEG sync-word 0xFFE).
  
  	@param offset - Offset to scan for sync-preamble.
  	@returns {{ext: string, mime: string}}
  	*/
  scanMpeg(t) {
    if (this.check([255, 224], { offset: t, mask: [255, 224] })) {
      if (this.check([16], { offset: t + 1, mask: [22] }))
        return this.check([8], { offset: t + 1, mask: [8] }) ? {
          ext: "aac",
          mime: "audio/aac"
        } : {
          ext: "aac",
          mime: "audio/aac"
        };
      if (this.check([2], { offset: t + 1, mask: [6] }))
        return {
          ext: "mp3",
          mime: "audio/mpeg"
        };
      if (this.check([4], { offset: t + 1, mask: [6] }))
        return {
          ext: "mp2",
          mime: "audio/mpeg"
        };
      if (this.check([6], { offset: t + 1, mask: [6] }))
        return {
          ext: "mp1",
          mime: "audio/mpeg"
        };
    }
  }
}
new Set(z_);
new Set(j_);
var qs = {};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
var hc = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g, H_ = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/, qf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/, q_ = /\\([\u000b\u0020-\u00ff])/g, X_ = /([\\"])/g, Xf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
qs.format = W_;
qs.parse = V_;
function W_(e) {
  if (!e || typeof e != "object")
    throw new TypeError("argument obj is required");
  var t = e.parameters, r = e.type;
  if (!r || !Xf.test(r))
    throw new TypeError("invalid type");
  var n = r;
  if (t && typeof t == "object")
    for (var i, a = Object.keys(t).sort(), s = 0; s < a.length; s++) {
      if (i = a[s], !qf.test(i))
        throw new TypeError("invalid parameter name");
      n += "; " + i + "=" + K_(t[i]);
    }
  return n;
}
function V_(e) {
  if (!e)
    throw new TypeError("argument string is required");
  var t = typeof e == "object" ? Y_(e) : e;
  if (typeof t != "string")
    throw new TypeError("argument string is required to be a string");
  var r = t.indexOf(";"), n = r !== -1 ? t.slice(0, r).trim() : t.trim();
  if (!Xf.test(n))
    throw new TypeError("invalid media type");
  var i = new J_(n.toLowerCase());
  if (r !== -1) {
    var a, s, o;
    for (hc.lastIndex = r; s = hc.exec(t); ) {
      if (s.index !== r)
        throw new TypeError("invalid parameter format");
      r += s[0].length, a = s[1].toLowerCase(), o = s[2], o.charCodeAt(0) === 34 && (o = o.slice(1, -1), o.indexOf("\\") !== -1 && (o = o.replace(q_, "$1"))), i.parameters[a] = o;
    }
    if (r !== t.length)
      throw new TypeError("invalid parameter format");
  }
  return i;
}
function Y_(e) {
  var t;
  if (typeof e.getHeader == "function" ? t = e.getHeader("content-type") : typeof e.headers == "object" && (t = e.headers && e.headers["content-type"]), typeof t != "string")
    throw new TypeError("content-type header is missing from object");
  return t;
}
function K_(e) {
  var t = String(e);
  if (qf.test(t))
    return t;
  if (t.length > 0 && !H_.test(t))
    throw new TypeError("invalid parameter value");
  return '"' + t.replace(X_, "\\$1") + '"';
}
function J_(e) {
  this.parameters = /* @__PURE__ */ Object.create(null), this.type = e;
}
/*!
 * media-typer
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
var Q_ = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/, Z_ = eb;
function eb(e) {
  if (!e)
    throw new TypeError("argument string is required");
  if (typeof e != "string")
    throw new TypeError("argument string is required to be a string");
  var t = Q_.exec(e.toLowerCase());
  if (!t)
    throw new TypeError("invalid media type");
  var r = t[1], n = t[2], i, a = n.lastIndexOf("+");
  return a !== -1 && (i = n.substr(a + 1), n = n.substr(0, a)), new tb(r, n, i);
}
function tb(e, t, r) {
  this.type = e, this.subtype = t, this.suffix = r;
}
const JS = {
  10: "shot",
  20: "scene",
  30: "track",
  40: "part",
  50: "album",
  60: "edition",
  70: "collection"
}, ft = {
  video: 1,
  audio: 2,
  complex: 3,
  logo: 4,
  subtitle: 17,
  button: 18,
  control: 32
}, rb = {
  [ft.video]: "video",
  [ft.audio]: "audio",
  [ft.complex]: "complex",
  [ft.logo]: "logo",
  [ft.subtitle]: "subtitle",
  [ft.button]: "button",
  [ft.control]: "control"
}, vn = (e) => class extends Error {
  constructor(r) {
    super(r), this.name = e;
  }
};
class Wf extends vn("CouldNotDetermineFileTypeError") {
}
class Vf extends vn("UnsupportedFileTypeError") {
}
class nb extends vn("UnexpectedFileContentError") {
  constructor(t, r) {
    super(r), this.fileType = t;
  }
  // Override toString to include file type information.
  toString() {
    return `${this.name} (FileType: ${this.fileType}): ${this.message}`;
  }
}
class Xs extends vn("FieldDecodingError") {
}
class Yf extends vn("InternalParserError") {
}
const ib = (e) => class extends nb {
  constructor(t) {
    super(e, t);
  }
};
function jr(e, t, r) {
  return (e[t] & 1 << r) !== 0;
}
function mc(e, t, r, n) {
  let i = t;
  if (n === "utf-16le") {
    for (; e[i] !== 0 || e[i + 1] !== 0; ) {
      if (i >= r)
        return r;
      i += 2;
    }
    return i;
  }
  for (; e[i] !== 0; ) {
    if (i >= r)
      return r;
    i++;
  }
  return i;
}
function ab(e) {
  const t = e.indexOf("\0");
  return t === -1 ? e : e.substr(0, t);
}
function sb(e) {
  const t = e.length;
  if (t & 1)
    throw new Xs("Buffer length must be even");
  for (let r = 0; r < t; r += 2) {
    const n = e[r];
    e[r] = e[r + 1], e[r + 1] = n;
  }
  return e;
}
function os(e, t) {
  if (e[0] === 255 && e[1] === 254)
    return os(e.subarray(2), t);
  if (t === "utf-16le" && e[0] === 254 && e[1] === 255) {
    if (e.length & 1)
      throw new Xs("Expected even number of octets for 16-bit unicode string");
    return os(sb(e), t);
  }
  return new ge(e.length, t).get(e, 0);
}
function ZS(e) {
  return e = e.replace(/^\x00+/g, ""), e = e.replace(/\x00+$/g, ""), e;
}
function Kf(e, t, r, n) {
  const i = t + ~~(r / 8), a = r % 8;
  let s = e[i];
  s &= 255 >> a;
  const o = 8 - a, l = n - o;
  return l < 0 ? s >>= 8 - a - n : l > 0 && (s <<= l, s |= Kf(e, t, r + o, l)), s;
}
function eA(e, t, r) {
  return Kf(e, t, r, 1) === 1;
}
function ob(e) {
  const t = [];
  for (let r = 0, n = e.length; r < n; r++) {
    const i = Number(e.charCodeAt(r)).toString(16);
    t.push(i.length === 1 ? `0${i}` : i);
  }
  return t.join(" ");
}
function lb(e) {
  return 10 * Math.log10(e);
}
function cb(e) {
  return 10 ** (e / 10);
}
function ub(e) {
  const t = e.split(" ").map((r) => r.trim().toLowerCase());
  if (t.length >= 1) {
    const r = Number.parseFloat(t[0]);
    return t.length === 2 && t[1] === "db" ? {
      dB: r,
      ratio: cb(r)
    } : {
      dB: lb(r),
      ratio: r
    };
  }
}
function tA(e) {
  if (e.length === 0)
    throw new Error("decodeUintBE: empty Uint8Array");
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength);
  return ss(t);
}
const rA = {
  0: "Other",
  1: "32x32 pixels 'file icon' (PNG only)",
  2: "Other file icon",
  3: "Cover (front)",
  4: "Cover (back)",
  5: "Leaflet page",
  6: "Media (e.g. label side of CD)",
  7: "Lead artist/lead performer/soloist",
  8: "Artist/performer",
  9: "Conductor",
  10: "Band/Orchestra",
  11: "Composer",
  12: "Lyricist/text writer",
  13: "Recording Location",
  14: "During recording",
  15: "During performance",
  16: "Movie/video screen capture",
  17: "A bright coloured fish",
  18: "Illustration",
  19: "Band/artist logotype",
  20: "Publisher/Studio logotype"
}, Jf = {
  lyrics: 1
}, Qf = {
  notSynchronized: 0,
  milliseconds: 2
}, fb = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, nA = {
  len: 10,
  get: (e, t) => ({
    // ID3v2/file identifier   "ID3"
    fileIdentifier: new ge(3, "ascii").get(e, t),
    // ID3v2 versionIndex
    version: {
      major: as.get(e, t + 3),
      revision: as.get(e, t + 4)
    },
    // ID3v2 flags
    flags: {
      // Unsynchronisation
      unsynchronisation: jr(e, t + 5, 7),
      // Extended header
      isExtendedHeader: jr(e, t + 5, 6),
      // Experimental indicator
      expIndicator: jr(e, t + 5, 5),
      footer: jr(e, t + 5, 4)
    },
    size: fb.get(e, t + 6)
  })
}, iA = {
  len: 10,
  get: (e, t) => ({
    // Extended header size
    size: wi.get(e, t),
    // Extended Flags
    extendedFlags: qt.get(e, t + 4),
    // Size of padding
    sizeOfPadding: wi.get(e, t + 6),
    // CRC data present
    crcDataPresent: jr(e, t + 4, 31)
  })
}, db = {
  len: 1,
  get: (e, t) => {
    switch (e[t]) {
      case 0:
        return { encoding: "latin1" };
      case 1:
        return { encoding: "utf-16le", bom: !0 };
      case 2:
        return { encoding: "utf-16le", bom: !1 };
      case 3:
        return { encoding: "utf8", bom: !1 };
      default:
        return { encoding: "utf8", bom: !1 };
    }
  }
}, pb = {
  len: 4,
  get: (e, t) => ({
    encoding: db.get(e, t),
    language: new ge(3, "latin1").get(e, t + 1)
  })
}, aA = {
  len: 6,
  get: (e, t) => {
    const r = pb.get(e, t);
    return {
      encoding: r.encoding,
      language: r.language,
      timeStampFormat: Yt.get(e, t + 4),
      contentType: Yt.get(e, t + 5)
    };
  }
}, P = {
  multiple: !1
}, Ei = {
  year: P,
  track: P,
  disk: P,
  title: P,
  artist: P,
  artists: { multiple: !0, unique: !0 },
  albumartist: P,
  album: P,
  date: P,
  originaldate: P,
  originalyear: P,
  releasedate: P,
  comment: { multiple: !0, unique: !1 },
  genre: { multiple: !0, unique: !0 },
  picture: { multiple: !0, unique: !0 },
  composer: { multiple: !0, unique: !0 },
  lyrics: { multiple: !0, unique: !1 },
  albumsort: { multiple: !1, unique: !0 },
  titlesort: { multiple: !1, unique: !0 },
  work: { multiple: !1, unique: !0 },
  artistsort: { multiple: !1, unique: !0 },
  albumartistsort: { multiple: !1, unique: !0 },
  composersort: { multiple: !1, unique: !0 },
  lyricist: { multiple: !0, unique: !0 },
  writer: { multiple: !0, unique: !0 },
  conductor: { multiple: !0, unique: !0 },
  remixer: { multiple: !0, unique: !0 },
  arranger: { multiple: !0, unique: !0 },
  engineer: { multiple: !0, unique: !0 },
  producer: { multiple: !0, unique: !0 },
  technician: { multiple: !0, unique: !0 },
  djmixer: { multiple: !0, unique: !0 },
  mixer: { multiple: !0, unique: !0 },
  label: { multiple: !0, unique: !0 },
  grouping: P,
  subtitle: { multiple: !0 },
  discsubtitle: P,
  totaltracks: P,
  totaldiscs: P,
  compilation: P,
  rating: { multiple: !0 },
  bpm: P,
  mood: P,
  media: P,
  catalognumber: { multiple: !0, unique: !0 },
  tvShow: P,
  tvShowSort: P,
  tvSeason: P,
  tvEpisode: P,
  tvEpisodeId: P,
  tvNetwork: P,
  podcast: P,
  podcasturl: P,
  releasestatus: P,
  releasetype: { multiple: !0 },
  releasecountry: P,
  script: P,
  language: P,
  copyright: P,
  license: P,
  encodedby: P,
  encodersettings: P,
  gapless: P,
  barcode: P,
  isrc: { multiple: !0 },
  asin: P,
  musicbrainz_recordingid: P,
  musicbrainz_trackid: P,
  musicbrainz_albumid: P,
  musicbrainz_artistid: { multiple: !0 },
  musicbrainz_albumartistid: { multiple: !0 },
  musicbrainz_releasegroupid: P,
  musicbrainz_workid: P,
  musicbrainz_trmid: P,
  musicbrainz_discid: P,
  acoustid_id: P,
  acoustid_fingerprint: P,
  musicip_puid: P,
  musicip_fingerprint: P,
  website: P,
  "performer:instrument": { multiple: !0, unique: !0 },
  averageLevel: P,
  peakLevel: P,
  notes: { multiple: !0, unique: !1 },
  key: P,
  originalalbum: P,
  originalartist: P,
  discogs_artist_id: { multiple: !0, unique: !0 },
  discogs_release_id: P,
  discogs_label_id: P,
  discogs_master_release_id: P,
  discogs_votes: P,
  discogs_rating: P,
  replaygain_track_peak: P,
  replaygain_track_gain: P,
  replaygain_album_peak: P,
  replaygain_album_gain: P,
  replaygain_track_minmax: P,
  replaygain_album_minmax: P,
  replaygain_undo: P,
  description: { multiple: !0 },
  longDescription: P,
  category: { multiple: !0 },
  hdVideo: P,
  keywords: { multiple: !0 },
  movement: P,
  movementIndex: P,
  movementTotal: P,
  podcastId: P,
  showMovement: P,
  stik: P,
  playCounter: P
};
function hb(e) {
  return Ei[e] && !Ei[e].multiple;
}
function mb(e) {
  return !Ei[e].multiple || Ei[e].unique || !1;
}
class Ge {
  static toIntOrNull(t) {
    const r = Number.parseInt(t, 10);
    return Number.isNaN(r) ? null : r;
  }
  // TODO: a string of 1of1 would fail to be converted
  // converts 1/10 to no : 1, of : 10
  // or 1 to no : 1, of : 0
  static normalizeTrack(t) {
    const r = t.toString().split("/");
    return {
      no: Number.parseInt(r[0], 10) || null,
      of: Number.parseInt(r[1], 10) || null
    };
  }
  constructor(t, r) {
    this.tagTypes = t, this.tagMap = r;
  }
  /**
   * Process and set common tags
   * write common tags to
   * @param tag Native tag
   * @param warnings Register warnings
   * @return common name
   */
  mapGenericTag(t, r) {
    t = { id: t.id, value: t.value }, this.postMap(t, r);
    const n = this.getCommonName(t.id);
    return n ? { id: n, value: t.value } : null;
  }
  /**
   * Convert native tag key to common tag key
   * @param tag Native header tag
   * @return common tag name (alias)
   */
  getCommonName(t) {
    return this.tagMap[t];
  }
  /**
   * Handle post mapping exceptions / correction
   * @param tag Tag e.g. {"©alb", "Buena Vista Social Club")
   * @param warnings Used to register warnings
   */
  postMap(t, r) {
  }
}
Ge.maxRatingScore = 1;
const gb = {
  title: "title",
  artist: "artist",
  album: "album",
  year: "year",
  comment: "comment",
  track: "track",
  genre: "genre"
};
class yb extends Ge {
  constructor() {
    super(["ID3v1"], gb);
  }
}
class Tn extends Ge {
  constructor(t, r) {
    const n = {};
    for (const i of Object.keys(r))
      n[i.toUpperCase()] = r[i];
    super(t, n);
  }
  /**
   * @tag  Native header tag
   * @return common tag name (alias)
   */
  getCommonName(t) {
    return this.tagMap[t.toUpperCase()];
  }
}
const xb = {
  // id3v2.3
  TIT2: "title",
  TPE1: "artist",
  "TXXX:Artists": "artists",
  TPE2: "albumartist",
  TALB: "album",
  TDRV: "date",
  // [ 'date', 'year' ] ToDo: improve 'year' mapping
  /**
   * Original release year
   */
  TORY: "originalyear",
  TPOS: "disk",
  TCON: "genre",
  APIC: "picture",
  TCOM: "composer",
  USLT: "lyrics",
  TSOA: "albumsort",
  TSOT: "titlesort",
  TOAL: "originalalbum",
  TSOP: "artistsort",
  TSO2: "albumartistsort",
  TSOC: "composersort",
  TEXT: "lyricist",
  "TXXX:Writer": "writer",
  TPE3: "conductor",
  // 'IPLS:instrument': 'performer:instrument', // ToDo
  TPE4: "remixer",
  "IPLS:arranger": "arranger",
  "IPLS:engineer": "engineer",
  "IPLS:producer": "producer",
  "IPLS:DJ-mix": "djmixer",
  "IPLS:mix": "mixer",
  TPUB: "label",
  TIT1: "grouping",
  TIT3: "subtitle",
  TRCK: "track",
  TCMP: "compilation",
  POPM: "rating",
  TBPM: "bpm",
  TMED: "media",
  "TXXX:CATALOGNUMBER": "catalognumber",
  "TXXX:MusicBrainz Album Status": "releasestatus",
  "TXXX:MusicBrainz Album Type": "releasetype",
  /**
   * Release country as documented: https://picard.musicbrainz.org/docs/mappings/#cite_note-0
   */
  "TXXX:MusicBrainz Album Release Country": "releasecountry",
  /**
   * Release country as implemented // ToDo: report
   */
  "TXXX:RELEASECOUNTRY": "releasecountry",
  "TXXX:SCRIPT": "script",
  TLAN: "language",
  TCOP: "copyright",
  WCOP: "license",
  TENC: "encodedby",
  TSSE: "encodersettings",
  "TXXX:BARCODE": "barcode",
  "TXXX:ISRC": "isrc",
  TSRC: "isrc",
  "TXXX:ASIN": "asin",
  "TXXX:originalyear": "originalyear",
  "UFID:http://musicbrainz.org": "musicbrainz_recordingid",
  "TXXX:MusicBrainz Release Track Id": "musicbrainz_trackid",
  "TXXX:MusicBrainz Album Id": "musicbrainz_albumid",
  "TXXX:MusicBrainz Artist Id": "musicbrainz_artistid",
  "TXXX:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
  "TXXX:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
  "TXXX:MusicBrainz Work Id": "musicbrainz_workid",
  "TXXX:MusicBrainz TRM Id": "musicbrainz_trmid",
  "TXXX:MusicBrainz Disc Id": "musicbrainz_discid",
  "TXXX:ACOUSTID_ID": "acoustid_id",
  "TXXX:Acoustid Id": "acoustid_id",
  "TXXX:Acoustid Fingerprint": "acoustid_fingerprint",
  "TXXX:MusicIP PUID": "musicip_puid",
  "TXXX:MusicMagic Fingerprint": "musicip_fingerprint",
  WOAR: "website",
  // id3v2.4
  // ToDo: In same sequence as defined at http://id3.org/id3v2.4.0-frames
  TDRC: "date",
  // date YYYY-MM-DD
  TYER: "year",
  TDOR: "originaldate",
  // 'TMCL:instrument': 'performer:instrument',
  "TIPL:arranger": "arranger",
  "TIPL:engineer": "engineer",
  "TIPL:producer": "producer",
  "TIPL:DJ-mix": "djmixer",
  "TIPL:mix": "mixer",
  TMOO: "mood",
  // additional mappings:
  SYLT: "lyrics",
  TSST: "discsubtitle",
  TKEY: "key",
  COMM: "comment",
  TOPE: "originalartist",
  // Windows Media Player
  "PRIV:AverageLevel": "averageLevel",
  "PRIV:PeakLevel": "peakLevel",
  // Discogs
  "TXXX:DISCOGS_ARTIST_ID": "discogs_artist_id",
  "TXXX:DISCOGS_ARTISTS": "artists",
  "TXXX:DISCOGS_ARTIST_NAME": "artists",
  "TXXX:DISCOGS_ALBUM_ARTISTS": "albumartist",
  "TXXX:DISCOGS_CATALOG": "catalognumber",
  "TXXX:DISCOGS_COUNTRY": "releasecountry",
  "TXXX:DISCOGS_DATE": "originaldate",
  "TXXX:DISCOGS_LABEL": "label",
  "TXXX:DISCOGS_LABEL_ID": "discogs_label_id",
  "TXXX:DISCOGS_MASTER_RELEASE_ID": "discogs_master_release_id",
  "TXXX:DISCOGS_RATING": "discogs_rating",
  "TXXX:DISCOGS_RELEASED": "date",
  "TXXX:DISCOGS_RELEASE_ID": "discogs_release_id",
  "TXXX:DISCOGS_VOTES": "discogs_votes",
  "TXXX:CATALOGID": "catalognumber",
  "TXXX:STYLE": "genre",
  "TXXX:REPLAYGAIN_TRACK_PEAK": "replaygain_track_peak",
  "TXXX:REPLAYGAIN_TRACK_GAIN": "replaygain_track_gain",
  "TXXX:REPLAYGAIN_ALBUM_PEAK": "replaygain_album_peak",
  "TXXX:REPLAYGAIN_ALBUM_GAIN": "replaygain_album_gain",
  "TXXX:MP3GAIN_MINMAX": "replaygain_track_minmax",
  "TXXX:MP3GAIN_ALBUM_MINMAX": "replaygain_album_minmax",
  "TXXX:MP3GAIN_UNDO": "replaygain_undo",
  MVNM: "movement",
  MVIN: "movementIndex",
  PCST: "podcast",
  TCAT: "category",
  TDES: "description",
  TDRL: "releasedate",
  TGID: "podcastId",
  TKWD: "keywords",
  WFED: "podcasturl",
  GRP1: "grouping",
  PCNT: "playCounter"
};
class Ws extends Tn {
  static toRating(t) {
    return {
      source: t.email,
      rating: t.rating > 0 ? (t.rating - 1) / 254 * Ge.maxRatingScore : void 0
    };
  }
  constructor() {
    super(["ID3v2.3", "ID3v2.4"], xb);
  }
  /**
   * Handle post mapping exceptions / correction
   * @param tag to post map
   * @param warnings Wil be used to register (collect) warnings
   */
  postMap(t, r) {
    switch (t.id) {
      case "UFID":
        {
          const n = t.value;
          n.owner_identifier === "http://musicbrainz.org" && (t.id += `:${n.owner_identifier}`, t.value = os(n.identifier, "latin1"));
        }
        break;
      case "PRIV":
        {
          const n = t.value;
          switch (n.owner_identifier) {
            case "AverageLevel":
            case "PeakValue":
              t.id += `:${n.owner_identifier}`, t.value = n.data.length === 4 ? W.get(n.data, 0) : null, t.value === null && r.addWarning("Failed to parse PRIV:PeakValue");
              break;
            default:
              r.addWarning(`Unknown PRIV owner-identifier: ${n.data}`);
          }
        }
        break;
      case "POPM":
        t.value = Ws.toRating(t.value);
        break;
    }
  }
}
const wb = {
  Title: "title",
  Author: "artist",
  "WM/AlbumArtist": "albumartist",
  "WM/AlbumTitle": "album",
  "WM/Year": "date",
  // changed to 'year' to 'date' based on Picard mappings; ToDo: check me
  "WM/OriginalReleaseTime": "originaldate",
  "WM/OriginalReleaseYear": "originalyear",
  Description: "comment",
  "WM/TrackNumber": "track",
  "WM/PartOfSet": "disk",
  "WM/Genre": "genre",
  "WM/Composer": "composer",
  "WM/Lyrics": "lyrics",
  "WM/AlbumSortOrder": "albumsort",
  "WM/TitleSortOrder": "titlesort",
  "WM/ArtistSortOrder": "artistsort",
  "WM/AlbumArtistSortOrder": "albumartistsort",
  "WM/ComposerSortOrder": "composersort",
  "WM/Writer": "lyricist",
  "WM/Conductor": "conductor",
  "WM/ModifiedBy": "remixer",
  "WM/Engineer": "engineer",
  "WM/Producer": "producer",
  "WM/DJMixer": "djmixer",
  "WM/Mixer": "mixer",
  "WM/Publisher": "label",
  "WM/ContentGroupDescription": "grouping",
  "WM/SubTitle": "subtitle",
  "WM/SetSubTitle": "discsubtitle",
  // 'WM/PartOfSet': 'totaldiscs',
  "WM/IsCompilation": "compilation",
  "WM/SharedUserRating": "rating",
  "WM/BeatsPerMinute": "bpm",
  "WM/Mood": "mood",
  "WM/Media": "media",
  "WM/CatalogNo": "catalognumber",
  "MusicBrainz/Album Status": "releasestatus",
  "MusicBrainz/Album Type": "releasetype",
  "MusicBrainz/Album Release Country": "releasecountry",
  "WM/Script": "script",
  "WM/Language": "language",
  Copyright: "copyright",
  LICENSE: "license",
  "WM/EncodedBy": "encodedby",
  "WM/EncodingSettings": "encodersettings",
  "WM/Barcode": "barcode",
  "WM/ISRC": "isrc",
  "MusicBrainz/Track Id": "musicbrainz_recordingid",
  "MusicBrainz/Release Track Id": "musicbrainz_trackid",
  "MusicBrainz/Album Id": "musicbrainz_albumid",
  "MusicBrainz/Artist Id": "musicbrainz_artistid",
  "MusicBrainz/Album Artist Id": "musicbrainz_albumartistid",
  "MusicBrainz/Release Group Id": "musicbrainz_releasegroupid",
  "MusicBrainz/Work Id": "musicbrainz_workid",
  "MusicBrainz/TRM Id": "musicbrainz_trmid",
  "MusicBrainz/Disc Id": "musicbrainz_discid",
  "Acoustid/Id": "acoustid_id",
  "Acoustid/Fingerprint": "acoustid_fingerprint",
  "MusicIP/PUID": "musicip_puid",
  "WM/ARTISTS": "artists",
  "WM/InitialKey": "key",
  ASIN: "asin",
  "WM/Work": "work",
  "WM/AuthorURL": "website",
  "WM/Picture": "picture"
};
class Vs extends Ge {
  static toRating(t) {
    return {
      rating: Number.parseFloat(t + 1) / 5
    };
  }
  constructor() {
    super(["asf"], wb);
  }
  postMap(t) {
    switch (t.id) {
      case "WM/SharedUserRating": {
        const r = t.id.split(":");
        t.value = Vs.toRating(t.value), t.id = r[0];
        break;
      }
    }
  }
}
const Eb = {
  TT2: "title",
  TP1: "artist",
  TP2: "albumartist",
  TAL: "album",
  TYE: "year",
  COM: "comment",
  TRK: "track",
  TPA: "disk",
  TCO: "genre",
  PIC: "picture",
  TCM: "composer",
  TOR: "originaldate",
  TOT: "originalalbum",
  TXT: "lyricist",
  TP3: "conductor",
  TPB: "label",
  TT1: "grouping",
  TT3: "subtitle",
  TLA: "language",
  TCR: "copyright",
  WCP: "license",
  TEN: "encodedby",
  TSS: "encodersettings",
  WAR: "website",
  PCS: "podcast",
  TCP: "compilation",
  TDR: "date",
  TS2: "albumartistsort",
  TSA: "albumsort",
  TSC: "composersort",
  TSP: "artistsort",
  TST: "titlesort",
  WFD: "podcasturl",
  TBP: "bpm"
};
class vb extends Tn {
  constructor() {
    super(["ID3v2.2"], Eb);
  }
}
const Tb = {
  Title: "title",
  Artist: "artist",
  Artists: "artists",
  "Album Artist": "albumartist",
  Album: "album",
  Year: "date",
  Originalyear: "originalyear",
  Originaldate: "originaldate",
  Releasedate: "releasedate",
  Comment: "comment",
  Track: "track",
  Disc: "disk",
  DISCNUMBER: "disk",
  // ToDo: backwards compatibility', valid tag?
  Genre: "genre",
  "Cover Art (Front)": "picture",
  "Cover Art (Back)": "picture",
  Composer: "composer",
  Lyrics: "lyrics",
  ALBUMSORT: "albumsort",
  TITLESORT: "titlesort",
  WORK: "work",
  ARTISTSORT: "artistsort",
  ALBUMARTISTSORT: "albumartistsort",
  COMPOSERSORT: "composersort",
  Lyricist: "lyricist",
  Writer: "writer",
  Conductor: "conductor",
  // 'Performer=artist (instrument)': 'performer:instrument',
  MixArtist: "remixer",
  Arranger: "arranger",
  Engineer: "engineer",
  Producer: "producer",
  DJMixer: "djmixer",
  Mixer: "mixer",
  Label: "label",
  Grouping: "grouping",
  Subtitle: "subtitle",
  DiscSubtitle: "discsubtitle",
  Compilation: "compilation",
  BPM: "bpm",
  Mood: "mood",
  Media: "media",
  CatalogNumber: "catalognumber",
  MUSICBRAINZ_ALBUMSTATUS: "releasestatus",
  MUSICBRAINZ_ALBUMTYPE: "releasetype",
  RELEASECOUNTRY: "releasecountry",
  Script: "script",
  Language: "language",
  Copyright: "copyright",
  LICENSE: "license",
  EncodedBy: "encodedby",
  EncoderSettings: "encodersettings",
  Barcode: "barcode",
  ISRC: "isrc",
  ASIN: "asin",
  musicbrainz_trackid: "musicbrainz_recordingid",
  musicbrainz_releasetrackid: "musicbrainz_trackid",
  MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
  MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
  MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
  MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
  MUSICBRAINZ_WORKID: "musicbrainz_workid",
  MUSICBRAINZ_TRMID: "musicbrainz_trmid",
  MUSICBRAINZ_DISCID: "musicbrainz_discid",
  Acoustid_Id: "acoustid_id",
  ACOUSTID_FINGERPRINT: "acoustid_fingerprint",
  MUSICIP_PUID: "musicip_puid",
  Weblink: "website",
  REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
  REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
  MP3GAIN_MINMAX: "replaygain_track_minmax",
  MP3GAIN_UNDO: "replaygain_undo"
};
class _b extends Tn {
  constructor() {
    super(["APEv2"], Tb);
  }
}
const bb = {
  "©nam": "title",
  "©ART": "artist",
  aART: "albumartist",
  /**
   * ToDo: Album artist seems to be stored here while Picard documentation says: aART
   */
  "----:com.apple.iTunes:Band": "albumartist",
  "©alb": "album",
  "©day": "date",
  "©cmt": "comment",
  "©com": "comment",
  trkn: "track",
  disk: "disk",
  "©gen": "genre",
  covr: "picture",
  "©wrt": "composer",
  "©lyr": "lyrics",
  soal: "albumsort",
  sonm: "titlesort",
  soar: "artistsort",
  soaa: "albumartistsort",
  soco: "composersort",
  "----:com.apple.iTunes:LYRICIST": "lyricist",
  "----:com.apple.iTunes:CONDUCTOR": "conductor",
  "----:com.apple.iTunes:REMIXER": "remixer",
  "----:com.apple.iTunes:ENGINEER": "engineer",
  "----:com.apple.iTunes:PRODUCER": "producer",
  "----:com.apple.iTunes:DJMIXER": "djmixer",
  "----:com.apple.iTunes:MIXER": "mixer",
  "----:com.apple.iTunes:LABEL": "label",
  "©grp": "grouping",
  "----:com.apple.iTunes:SUBTITLE": "subtitle",
  "----:com.apple.iTunes:DISCSUBTITLE": "discsubtitle",
  cpil: "compilation",
  tmpo: "bpm",
  "----:com.apple.iTunes:MOOD": "mood",
  "----:com.apple.iTunes:MEDIA": "media",
  "----:com.apple.iTunes:CATALOGNUMBER": "catalognumber",
  tvsh: "tvShow",
  tvsn: "tvSeason",
  tves: "tvEpisode",
  sosn: "tvShowSort",
  tven: "tvEpisodeId",
  tvnn: "tvNetwork",
  pcst: "podcast",
  purl: "podcasturl",
  "----:com.apple.iTunes:MusicBrainz Album Status": "releasestatus",
  "----:com.apple.iTunes:MusicBrainz Album Type": "releasetype",
  "----:com.apple.iTunes:MusicBrainz Album Release Country": "releasecountry",
  "----:com.apple.iTunes:SCRIPT": "script",
  "----:com.apple.iTunes:LANGUAGE": "language",
  cprt: "copyright",
  "©cpy": "copyright",
  "----:com.apple.iTunes:LICENSE": "license",
  "©too": "encodedby",
  pgap: "gapless",
  "----:com.apple.iTunes:BARCODE": "barcode",
  "----:com.apple.iTunes:ISRC": "isrc",
  "----:com.apple.iTunes:ASIN": "asin",
  "----:com.apple.iTunes:NOTES": "comment",
  "----:com.apple.iTunes:MusicBrainz Track Id": "musicbrainz_recordingid",
  "----:com.apple.iTunes:MusicBrainz Release Track Id": "musicbrainz_trackid",
  "----:com.apple.iTunes:MusicBrainz Album Id": "musicbrainz_albumid",
  "----:com.apple.iTunes:MusicBrainz Artist Id": "musicbrainz_artistid",
  "----:com.apple.iTunes:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
  "----:com.apple.iTunes:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
  "----:com.apple.iTunes:MusicBrainz Work Id": "musicbrainz_workid",
  "----:com.apple.iTunes:MusicBrainz TRM Id": "musicbrainz_trmid",
  "----:com.apple.iTunes:MusicBrainz Disc Id": "musicbrainz_discid",
  "----:com.apple.iTunes:Acoustid Id": "acoustid_id",
  "----:com.apple.iTunes:Acoustid Fingerprint": "acoustid_fingerprint",
  "----:com.apple.iTunes:MusicIP PUID": "musicip_puid",
  "----:com.apple.iTunes:fingerprint": "musicip_fingerprint",
  "----:com.apple.iTunes:replaygain_track_gain": "replaygain_track_gain",
  "----:com.apple.iTunes:replaygain_track_peak": "replaygain_track_peak",
  "----:com.apple.iTunes:replaygain_album_gain": "replaygain_album_gain",
  "----:com.apple.iTunes:replaygain_album_peak": "replaygain_album_peak",
  "----:com.apple.iTunes:replaygain_track_minmax": "replaygain_track_minmax",
  "----:com.apple.iTunes:replaygain_album_minmax": "replaygain_album_minmax",
  "----:com.apple.iTunes:replaygain_undo": "replaygain_undo",
  // Additional mappings:
  gnre: "genre",
  // ToDo: check mapping
  "----:com.apple.iTunes:ALBUMARTISTSORT": "albumartistsort",
  "----:com.apple.iTunes:ARTISTS": "artists",
  "----:com.apple.iTunes:ORIGINALDATE": "originaldate",
  "----:com.apple.iTunes:ORIGINALYEAR": "originalyear",
  "----:com.apple.iTunes:RELEASEDATE": "releasedate",
  // '----:com.apple.iTunes:PERFORMER': 'performer'
  desc: "description",
  ldes: "longDescription",
  "©mvn": "movement",
  "©mvi": "movementIndex",
  "©mvc": "movementTotal",
  "©wrk": "work",
  catg: "category",
  egid: "podcastId",
  hdvd: "hdVideo",
  keyw: "keywords",
  shwm: "showMovement",
  stik: "stik",
  rate: "rating"
}, Sb = "iTunes";
class gc extends Tn {
  constructor() {
    super([Sb], bb);
  }
  postMap(t, r) {
    switch (t.id) {
      case "rate":
        t.value = {
          source: void 0,
          rating: Number.parseFloat(t.value) / 100
        };
        break;
    }
  }
}
const Ab = {
  TITLE: "title",
  ARTIST: "artist",
  ARTISTS: "artists",
  ALBUMARTIST: "albumartist",
  "ALBUM ARTIST": "albumartist",
  ALBUM: "album",
  DATE: "date",
  ORIGINALDATE: "originaldate",
  ORIGINALYEAR: "originalyear",
  RELEASEDATE: "releasedate",
  COMMENT: "comment",
  TRACKNUMBER: "track",
  DISCNUMBER: "disk",
  GENRE: "genre",
  METADATA_BLOCK_PICTURE: "picture",
  COMPOSER: "composer",
  LYRICS: "lyrics",
  ALBUMSORT: "albumsort",
  TITLESORT: "titlesort",
  WORK: "work",
  ARTISTSORT: "artistsort",
  ALBUMARTISTSORT: "albumartistsort",
  COMPOSERSORT: "composersort",
  LYRICIST: "lyricist",
  WRITER: "writer",
  CONDUCTOR: "conductor",
  // 'PERFORMER=artist (instrument)': 'performer:instrument', // ToDo
  REMIXER: "remixer",
  ARRANGER: "arranger",
  ENGINEER: "engineer",
  PRODUCER: "producer",
  DJMIXER: "djmixer",
  MIXER: "mixer",
  LABEL: "label",
  GROUPING: "grouping",
  SUBTITLE: "subtitle",
  DISCSUBTITLE: "discsubtitle",
  TRACKTOTAL: "totaltracks",
  DISCTOTAL: "totaldiscs",
  COMPILATION: "compilation",
  RATING: "rating",
  BPM: "bpm",
  KEY: "key",
  MOOD: "mood",
  MEDIA: "media",
  CATALOGNUMBER: "catalognumber",
  RELEASESTATUS: "releasestatus",
  RELEASETYPE: "releasetype",
  RELEASECOUNTRY: "releasecountry",
  SCRIPT: "script",
  LANGUAGE: "language",
  COPYRIGHT: "copyright",
  LICENSE: "license",
  ENCODEDBY: "encodedby",
  ENCODERSETTINGS: "encodersettings",
  BARCODE: "barcode",
  ISRC: "isrc",
  ASIN: "asin",
  MUSICBRAINZ_TRACKID: "musicbrainz_recordingid",
  MUSICBRAINZ_RELEASETRACKID: "musicbrainz_trackid",
  MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
  MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
  MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
  MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
  MUSICBRAINZ_WORKID: "musicbrainz_workid",
  MUSICBRAINZ_TRMID: "musicbrainz_trmid",
  MUSICBRAINZ_DISCID: "musicbrainz_discid",
  ACOUSTID_ID: "acoustid_id",
  ACOUSTID_ID_FINGERPRINT: "acoustid_fingerprint",
  MUSICIP_PUID: "musicip_puid",
  // 'FINGERPRINT=MusicMagic Fingerprint {fingerprint}': 'musicip_fingerprint', // ToDo
  WEBSITE: "website",
  NOTES: "notes",
  TOTALTRACKS: "totaltracks",
  TOTALDISCS: "totaldiscs",
  // Discogs
  DISCOGS_ARTIST_ID: "discogs_artist_id",
  DISCOGS_ARTISTS: "artists",
  DISCOGS_ARTIST_NAME: "artists",
  DISCOGS_ALBUM_ARTISTS: "albumartist",
  DISCOGS_CATALOG: "catalognumber",
  DISCOGS_COUNTRY: "releasecountry",
  DISCOGS_DATE: "originaldate",
  DISCOGS_LABEL: "label",
  DISCOGS_LABEL_ID: "discogs_label_id",
  DISCOGS_MASTER_RELEASE_ID: "discogs_master_release_id",
  DISCOGS_RATING: "discogs_rating",
  DISCOGS_RELEASED: "date",
  DISCOGS_RELEASE_ID: "discogs_release_id",
  DISCOGS_VOTES: "discogs_votes",
  CATALOGID: "catalognumber",
  STYLE: "genre",
  //
  REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
  REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
  REPLAYGAIN_ALBUM_GAIN: "replaygain_album_gain",
  REPLAYGAIN_ALBUM_PEAK: "replaygain_album_peak",
  // To Sure if these (REPLAYGAIN_MINMAX, REPLAYGAIN_ALBUM_MINMAX & REPLAYGAIN_UNDO) are used for Vorbis:
  REPLAYGAIN_MINMAX: "replaygain_track_minmax",
  REPLAYGAIN_ALBUM_MINMAX: "replaygain_album_minmax",
  REPLAYGAIN_UNDO: "replaygain_undo"
};
class vi extends Ge {
  static toRating(t, r, n) {
    return {
      source: t ? t.toLowerCase() : void 0,
      rating: Number.parseFloat(r) / n * Ge.maxRatingScore
    };
  }
  constructor() {
    super(["vorbis"], Ab);
  }
  postMap(t) {
    if (t.id === "RATING")
      t.value = vi.toRating(void 0, t.value, 100);
    else if (t.id.indexOf("RATING:") === 0) {
      const r = t.id.split(":");
      t.value = vi.toRating(r[1], t.value, 1), t.id = r[0];
    }
  }
}
const Ib = {
  IART: "artist",
  // Artist
  ICRD: "date",
  // DateCreated
  INAM: "title",
  // Title
  TITL: "title",
  IPRD: "album",
  // Product
  ITRK: "track",
  IPRT: "track",
  // Additional tag for track index
  COMM: "comment",
  // Comments
  ICMT: "comment",
  // Country
  ICNT: "releasecountry",
  GNRE: "genre",
  // Genre
  IWRI: "writer",
  // WrittenBy
  RATE: "rating",
  YEAR: "year",
  ISFT: "encodedby",
  // Software
  CODE: "encodedby",
  // EncodedBy
  TURL: "website",
  // URL,
  IGNR: "genre",
  // Genre
  IENG: "engineer",
  // Engineer
  ITCH: "technician",
  // Technician
  IMED: "media",
  // Original Media
  IRPD: "album"
  // Product, where the file was intended for
};
class Cb extends Ge {
  constructor() {
    super(["exif"], Ib);
  }
}
const Rb = {
  "segment:title": "title",
  "album:ARTIST": "albumartist",
  "album:ARTISTSORT": "albumartistsort",
  "album:TITLE": "album",
  "album:DATE_RECORDED": "originaldate",
  "album:DATE_RELEASED": "releasedate",
  "album:PART_NUMBER": "disk",
  "album:TOTAL_PARTS": "totaltracks",
  "track:ARTIST": "artist",
  "track:ARTISTSORT": "artistsort",
  "track:TITLE": "title",
  "track:PART_NUMBER": "track",
  "track:MUSICBRAINZ_TRACKID": "musicbrainz_recordingid",
  "track:MUSICBRAINZ_ALBUMID": "musicbrainz_albumid",
  "track:MUSICBRAINZ_ARTISTID": "musicbrainz_artistid",
  "track:PUBLISHER": "label",
  "track:GENRE": "genre",
  "track:ENCODER": "encodedby",
  "track:ENCODER_OPTIONS": "encodersettings",
  "edition:TOTAL_PARTS": "totaldiscs",
  picture: "picture"
};
class Ob extends Tn {
  constructor() {
    super(["matroska"], Rb);
  }
}
const Db = {
  NAME: "title",
  AUTH: "artist",
  "(c) ": "copyright",
  ANNO: "comment"
};
class Pb extends Ge {
  constructor() {
    super(["AIFF"], Db);
  }
}
class kb {
  constructor() {
    this.tagMappers = {}, [
      new yb(),
      new vb(),
      new Ws(),
      new gc(),
      new gc(),
      new vi(),
      new _b(),
      new Vs(),
      new Cb(),
      new Ob(),
      new Pb()
    ].forEach((t) => {
      this.registerTagMapper(t);
    });
  }
  /**
   * Convert native to generic (common) tags
   * @param tagType Originating tag format
   * @param tag     Native tag to map to a generic tag id
   * @param warnings
   * @return Generic tag result (output of this function)
   */
  mapTag(t, r, n) {
    if (this.tagMappers[t])
      return this.tagMappers[t].mapGenericTag(r, n);
    throw new Yf(`No generic tag mapper defined for tag-format: ${t}`);
  }
  registerTagMapper(t) {
    for (const r of t.tagTypes)
      this.tagMappers[r] = t;
  }
}
const ls = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;
function Nb(e) {
  return ls.test(e) ? $b(e) : Fb(e);
}
function Fb(e) {
  return {
    contentType: Jf.lyrics,
    timeStampFormat: Qf.notSynchronized,
    text: e.trim(),
    syncText: []
  };
}
function $b(e) {
  const t = e.split(`
`), r = [];
  for (const n of t) {
    const i = n.match(ls);
    if (i) {
      const a = Number.parseInt(i[1], 10), s = Number.parseInt(i[2], 10), o = i[3].length === 3 ? Number.parseInt(i[3], 10) : Number.parseInt(i[3], 10) * 10, l = (a * 60 + s) * 1e3 + o, d = n.replace(ls, "").trim();
      r.push({ timestamp: l, text: d });
    }
  }
  return {
    contentType: Jf.lyrics,
    timeStampFormat: Qf.milliseconds,
    text: r.map((n) => n.text).join(`
`),
    syncText: r
  };
}
const Bt = Ir("music-metadata:collector"), Lb = ["matroska", "APEv2", "vorbis", "ID3v2.4", "ID3v2.3", "ID3v2.2", "exif", "asf", "iTunes", "AIFF", "ID3v1"];
class Ub {
  constructor(t) {
    this.format = {
      tagTypes: [],
      trackInfo: []
    }, this.native = {}, this.common = {
      track: { no: null, of: null },
      disk: { no: null, of: null },
      movementIndex: { no: null, of: null }
    }, this.quality = {
      warnings: []
    }, this.commonOrigin = {}, this.originPriority = {}, this.tagMapper = new kb(), this.opts = t;
    let r = 1;
    for (const n of Lb)
      this.originPriority[n] = r++;
    this.originPriority.artificial = 500, this.originPriority.id3v1 = 600;
  }
  /**
   * @returns {boolean} true if one or more tags have been found
   */
  hasAny() {
    return Object.keys(this.native).length > 0;
  }
  addStreamInfo(t) {
    Bt(`streamInfo: type=${t.type ? rb[t.type] : "?"}, codec=${t.codecName}`), this.format.trackInfo.push(t);
  }
  setFormat(t, r) {
    var n;
    Bt(`format: ${t} = ${r}`), this.format[t] = r, (n = this.opts) != null && n.observer && this.opts.observer({ metadata: this, tag: { type: "format", id: t, value: r } });
  }
  setAudioOnly() {
    this.setFormat("hasAudio", !0), this.setFormat("hasVideo", !1);
  }
  async addTag(t, r, n) {
    Bt(`tag ${t}.${r} = ${n}`), this.native[t] || (this.format.tagTypes.push(t), this.native[t] = []), this.native[t].push({ id: r, value: n }), await this.toCommon(t, r, n);
  }
  addWarning(t) {
    this.quality.warnings.push({ message: t });
  }
  async postMap(t, r) {
    switch (r.id) {
      case "artist":
        if (this.commonOrigin.artist === this.originPriority[t])
          return this.postMap("artificial", { id: "artists", value: r.value });
        this.common.artists || this.setGenericTag("artificial", { id: "artists", value: r.value });
        break;
      case "artists":
        if ((!this.common.artist || this.commonOrigin.artist === this.originPriority.artificial) && (!this.common.artists || this.common.artists.indexOf(r.value) === -1)) {
          const n = (this.common.artists || []).concat([r.value]), a = { id: "artist", value: Mb(n) };
          this.setGenericTag("artificial", a);
        }
        break;
      case "picture":
        return this.postFixPicture(r.value).then((n) => {
          n !== null && (r.value = n, this.setGenericTag(t, r));
        });
      case "totaltracks":
        this.common.track.of = Ge.toIntOrNull(r.value);
        return;
      case "totaldiscs":
        this.common.disk.of = Ge.toIntOrNull(r.value);
        return;
      case "movementTotal":
        this.common.movementIndex.of = Ge.toIntOrNull(r.value);
        return;
      case "track":
      case "disk":
      case "movementIndex": {
        const n = this.common[r.id].of;
        this.common[r.id] = Ge.normalizeTrack(r.value), this.common[r.id].of = n ?? this.common[r.id].of;
        return;
      }
      case "bpm":
      case "year":
      case "originalyear":
        r.value = Number.parseInt(r.value, 10);
        break;
      case "date": {
        const n = Number.parseInt(r.value.substr(0, 4), 10);
        Number.isNaN(n) || (this.common.year = n);
        break;
      }
      case "discogs_label_id":
      case "discogs_release_id":
      case "discogs_master_release_id":
      case "discogs_artist_id":
      case "discogs_votes":
        r.value = typeof r.value == "string" ? Number.parseInt(r.value, 10) : r.value;
        break;
      case "replaygain_track_gain":
      case "replaygain_track_peak":
      case "replaygain_album_gain":
      case "replaygain_album_peak":
        r.value = ub(r.value);
        break;
      case "replaygain_track_minmax":
        r.value = r.value.split(",").map((n) => Number.parseInt(n, 10));
        break;
      case "replaygain_undo": {
        const n = r.value.split(",").map((i) => Number.parseInt(i, 10));
        r.value = {
          leftChannel: n[0],
          rightChannel: n[1]
        };
        break;
      }
      case "gapless":
      case "compilation":
      case "podcast":
      case "showMovement":
        r.value = r.value === "1" || r.value === 1;
        break;
      case "isrc": {
        const n = this.common[r.id];
        if (n && n.indexOf(r.value) !== -1)
          return;
        break;
      }
      case "comment":
        typeof r.value == "string" && (r.value = { text: r.value }), r.value.descriptor === "iTunPGAP" && this.setGenericTag(t, { id: "gapless", value: r.value.text === "1" });
        break;
      case "lyrics":
        typeof r.value == "string" && (r.value = Nb(r.value));
        break;
    }
    r.value !== null && this.setGenericTag(t, r);
  }
  /**
   * Convert native tags to common tags
   * @returns {IAudioMetadata} Native + common tags
   */
  toCommonMetadata() {
    return {
      format: this.format,
      native: this.native,
      quality: this.quality,
      common: this.common
    };
  }
  /**
   * Fix some common issues with picture object
   * @param picture Picture
   */
  async postFixPicture(t) {
    if (t.data && t.data.length > 0) {
      if (!t.format) {
        const r = await Hf(Uint8Array.from(t.data));
        if (r)
          t.format = r.mime;
        else
          return null;
      }
      switch (t.format = t.format.toLocaleLowerCase(), t.format) {
        case "image/jpg":
          t.format = "image/jpeg";
      }
      return t;
    }
    return this.addWarning("Empty picture tag found"), null;
  }
  /**
   * Convert native tag to common tags
   */
  async toCommon(t, r, n) {
    const i = { id: r, value: n }, a = this.tagMapper.mapTag(t, i, this);
    a && await this.postMap(t, a);
  }
  /**
   * Set generic tag
   */
  setGenericTag(t, r) {
    var a;
    Bt(`common.${r.id} = ${r.value}`);
    const n = this.commonOrigin[r.id] || 1e3, i = this.originPriority[t];
    if (hb(r.id))
      if (i <= n)
        this.common[r.id] = r.value, this.commonOrigin[r.id] = i;
      else
        return Bt(`Ignore native tag (singleton): ${t}.${r.id} = ${r.value}`);
    else if (i === n)
      !mb(r.id) || this.common[r.id].indexOf(r.value) === -1 ? this.common[r.id].push(r.value) : Bt(`Ignore duplicate value: ${t}.${r.id} = ${r.value}`);
    else if (i < n)
      this.common[r.id] = [r.value], this.commonOrigin[r.id] = i;
    else
      return Bt(`Ignore native tag (list): ${t}.${r.id} = ${r.value}`);
    (a = this.opts) != null && a.observer && this.opts.observer({ metadata: this, tag: { type: "common", id: r.id, value: r.value } });
  }
}
function Mb(e) {
  return e.length > 2 ? `${e.slice(0, e.length - 1).join(", ")} & ${e[e.length - 1]}` : e.join(" & ");
}
const Bb = {
  parserType: "mpeg",
  extensions: [".mp2", ".mp3", ".m2a", ".aac", "aacp"],
  mimeTypes: ["audio/mpeg", "audio/mp3", "audio/aacs", "audio/aacp"],
  async load() {
    return (await import("./MpegParser-C5E7mrTL.js")).MpegParser;
  }
}, zb = {
  parserType: "apev2",
  extensions: [".ape"],
  mimeTypes: ["audio/ape", "audio/monkeys-audio"],
  async load() {
    return (await Promise.resolve().then(() => xS)).APEv2Parser;
  }
}, jb = {
  parserType: "asf",
  extensions: [".asf"],
  mimeTypes: ["audio/ms-wma", "video/ms-wmv", "audio/ms-asf", "video/ms-asf", "application/vnd.ms-asf"],
  async load() {
    return (await import("./AsfParser-umYtj7Ar.js")).AsfParser;
  }
}, Gb = {
  parserType: "dsdiff",
  extensions: [".dff"],
  mimeTypes: ["audio/dsf", "audio/dsd"],
  async load() {
    return (await import("./DsdiffParser-B1bPQCLw.js")).DsdiffParser;
  }
}, Hb = {
  parserType: "aiff",
  extensions: [".aif", "aiff", "aifc"],
  mimeTypes: ["audio/aiff", "audio/aif", "audio/aifc", "application/aiff"],
  async load() {
    return (await import("./AiffParser-Cd49ZDK_.js")).AIFFParser;
  }
}, qb = {
  parserType: "dsf",
  extensions: [".dsf"],
  mimeTypes: ["audio/dsf"],
  async load() {
    return (await import("./DsfParser-DdRLx5qt.js")).DsfParser;
  }
}, Xb = {
  parserType: "flac",
  extensions: [".flac"],
  mimeTypes: ["audio/flac"],
  async load() {
    return (await import("./FlacParser-Dza33QLc.js").then((e) => e.d)).FlacParser;
  }
}, Wb = {
  parserType: "matroska",
  extensions: [".mka", ".mkv", ".mk3d", ".mks", "webm"],
  mimeTypes: ["audio/matroska", "video/matroska", "audio/webm", "video/webm"],
  async load() {
    return (await import("./MatroskaParser-EIz_GdV9.js")).MatroskaParser;
  }
}, Vb = {
  parserType: "mp4",
  extensions: [".mp4", ".m4a", ".m4b", ".m4pa", "m4v", "m4r", "3gp", ".mov", ".movie", ".qt"],
  mimeTypes: ["audio/mp4", "audio/m4a", "video/m4v", "video/mp4", "video/quicktime"],
  async load() {
    return (await import("./MP4Parser-CGxs_WK4.js")).MP4Parser;
  }
}, Yb = {
  parserType: "musepack",
  extensions: [".mpc"],
  mimeTypes: ["audio/musepack"],
  async load() {
    return (await import("./MusepackParser-qM_JP4rV.js")).MusepackParser;
  }
}, Kb = {
  parserType: "ogg",
  extensions: [".ogg", ".ogv", ".oga", ".ogm", ".ogx", ".opus", ".spx"],
  mimeTypes: ["audio/ogg", "audio/opus", "audio/speex", "video/ogg"],
  // RFC 7845, RFC 6716, RFC 5574
  async load() {
    return (await import("./OggParser-D0HL2HuU.js")).OggParser;
  }
}, Jb = {
  parserType: "wavpack",
  extensions: [".wv", ".wvp"],
  mimeTypes: ["audio/wavpack"],
  async load() {
    return (await import("./WavPackParser-ETcmSAc5.js")).WavPackParser;
  }
}, Qb = {
  parserType: "riff",
  extensions: [".wav", "wave", ".bwf"],
  mimeTypes: ["audio/vnd.wave", "audio/wav", "audio/wave"],
  async load() {
    return (await import("./WaveParser-4yby0AT1.js")).WaveParser;
  }
}, zt = Ir("music-metadata:parser:factory");
function Zb(e) {
  const t = qs.parse(e), r = Z_(t.type);
  return {
    type: r.type,
    subtype: r.subtype,
    suffix: r.suffix,
    parameters: t.parameters
  };
}
class eS {
  constructor() {
    this.parsers = [], [
      Xb,
      Bb,
      zb,
      Vb,
      Wb,
      Qb,
      Kb,
      jb,
      Hb,
      Jb,
      Yb,
      qb,
      Gb
    ].forEach((t) => {
      this.registerParser(t);
    });
  }
  registerParser(t) {
    this.parsers.push(t);
  }
  async parse(t, r, n) {
    if (t.supportsRandomAccess() ? (zt("tokenizer supports random-access, scanning for appending headers"), await TS(t, n)) : zt("tokenizer does not support random-access, cannot scan for appending headers"), !r) {
      const o = new Uint8Array(4100);
      if (t.fileInfo.mimeType && (r = this.findLoaderForContentType(t.fileInfo.mimeType)), !r && t.fileInfo.path && (r = this.findLoaderForExtension(t.fileInfo.path)), !r) {
        zt("Guess parser on content..."), await t.peekBuffer(o, { mayBeLess: !0 });
        const l = await Hf(o, { mpegOffsetTolerance: 10 });
        if (!l || !l.mime)
          throw new Wf("Failed to determine audio format");
        if (zt(`Guessed file type is mime=${l.mime}, extension=${l.ext}`), r = this.findLoaderForContentType(l.mime), !r)
          throw new Vf(`Guessed MIME-type not supported: ${l.mime}`);
      }
    }
    zt(`Loading ${r.parserType} parser...`);
    const i = new Ub(n), a = await r.load(), s = new a(i, t, n ?? {});
    return zt(`Parser ${r.parserType} loaded`), await s.parse(), i.format.trackInfo && (i.format.hasAudio === void 0 && i.setFormat("hasAudio", !!i.format.trackInfo.find((o) => o.type === ft.audio)), i.format.hasVideo === void 0 && i.setFormat("hasVideo", !!i.format.trackInfo.find((o) => o.type === ft.video))), i.toCommonMetadata();
  }
  /**
   * @param filePath - Path, filename or extension to audio file
   * @return Parser submodule name
   */
  findLoaderForExtension(t) {
    if (!t)
      return;
    const r = tS(t).toLocaleLowerCase() || t;
    return this.parsers.find((n) => n.extensions.indexOf(r) !== -1);
  }
  findLoaderForContentType(t) {
    let r;
    if (!t)
      return;
    try {
      r = Zb(t);
    } catch {
      zt(`Invalid HTTP Content-Type header value: ${t}`);
      return;
    }
    const n = r.subtype.indexOf("x-") === 0 ? r.subtype.substring(2) : r.subtype;
    return this.parsers.find((i) => i.mimeTypes.find((a) => a.indexOf(`${r.type}/${n}`) !== -1));
  }
  getSupportedMimeTypes() {
    const t = /* @__PURE__ */ new Set();
    return this.parsers.forEach((r) => {
      r.mimeTypes.forEach((n) => {
        t.add(n), t.add(n.replace("/", "/x-"));
      });
    }), Array.from(t);
  }
}
function tS(e) {
  const t = e.lastIndexOf(".");
  return t === -1 ? "" : e.substring(t);
}
class Zf {
  /**
   * Initialize parser with output (metadata), input (tokenizer) & parsing options (options).
   * @param {INativeMetadataCollector} metadata Output
   * @param {ITokenizer} tokenizer Input
   * @param {IOptions} options Parsing options
   */
  constructor(t, r, n) {
    this.metadata = t, this.tokenizer = r, this.options = n;
  }
}
const ed = {
  128: "€",
  130: "‚",
  131: "ƒ",
  132: "„",
  133: "…",
  134: "†",
  135: "‡",
  136: "ˆ",
  137: "‰",
  138: "Š",
  139: "‹",
  140: "Œ",
  142: "Ž",
  145: "‘",
  146: "’",
  147: "“",
  148: "”",
  149: "•",
  150: "–",
  151: "—",
  152: "˜",
  153: "™",
  154: "š",
  155: "›",
  156: "œ",
  158: "ž",
  159: "Ÿ"
}, td = {};
for (const [e, t] of Object.entries(ed))
  td[t] = Number.parseInt(e, 10);
let Kn, Jn;
function rS() {
  if (!(typeof globalThis.TextDecoder > "u"))
    return Kn ?? (Kn = new globalThis.TextDecoder("utf-8"));
}
function nS() {
  if (!(typeof globalThis.TextEncoder > "u"))
    return Jn ?? (Jn = new globalThis.TextEncoder());
}
const Qt = 32 * 1024;
function Yi(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = rS();
      return r ? r.decode(e) : aS(e);
    }
    case "utf-16le":
      return sS(e);
    case "us-ascii":
    case "ascii":
      return oS(e);
    case "latin1":
    case "iso-8859-1":
      return lS(e);
    case "windows-1252":
      return cS(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function iS(e = "", t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = nS();
      return r ? r.encode(e) : uS(e);
    }
    case "utf-16le":
      return fS(e);
    case "us-ascii":
    case "ascii":
      return dS(e);
    case "latin1":
    case "iso-8859-1":
      return pS(e);
    case "windows-1252":
      return hS(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function aS(e) {
  const t = [];
  let r = "", n = 0;
  for (; n < e.length; ) {
    const i = e[n++];
    if (i < 128)
      r += String.fromCharCode(i);
    else if (i < 224) {
      const a = e[n++] & 63;
      r += String.fromCharCode((i & 31) << 6 | a);
    } else if (i < 240) {
      const a = e[n++] & 63, s = e[n++] & 63;
      r += String.fromCharCode((i & 15) << 12 | a << 6 | s);
    } else {
      const a = e[n++] & 63, s = e[n++] & 63, o = e[n++] & 63;
      let l = (i & 7) << 18 | a << 12 | s << 6 | o;
      l -= 65536, r += String.fromCharCode(55296 + (l >> 10 & 1023), 56320 + (l & 1023));
    }
    r.length >= Qt && (t.push(r), r = "");
  }
  return r && t.push(r), t.join("");
}
function sS(e) {
  const t = e.length & -2;
  if (t === 0)
    return "";
  const r = [], n = Qt;
  for (let i = 0; i < t; ) {
    const a = Math.min(n, t - i >> 1), s = new Array(a);
    for (let o = 0; o < a; o++, i += 2)
      s[o] = e[i] | e[i + 1] << 8;
    r.push(String.fromCharCode.apply(null, s));
  }
  return r.join("");
}
function oS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Qt) {
    const n = Math.min(e.length, r + Qt), i = new Array(n - r);
    for (let a = r, s = 0; a < n; a++, s++)
      i[s] = e[a] & 127;
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function lS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Qt) {
    const n = Math.min(e.length, r + Qt), i = new Array(n - r);
    for (let a = r, s = 0; a < n; a++, s++)
      i[s] = e[a];
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function cS(e) {
  const t = [];
  let r = "";
  for (let n = 0; n < e.length; n++) {
    const i = e[n], a = i >= 128 && i <= 159 ? ed[i] : void 0;
    r += a ?? String.fromCharCode(i), r.length >= Qt && (t.push(r), r = "");
  }
  return r && t.push(r), t.join("");
}
function uS(e) {
  const t = [];
  for (let r = 0; r < e.length; r++) {
    let n = e.charCodeAt(r);
    if (n >= 55296 && n <= 56319 && r + 1 < e.length) {
      const i = e.charCodeAt(r + 1);
      i >= 56320 && i <= 57343 && (n = 65536 + (n - 55296 << 10) + (i - 56320), r++);
    }
    n < 128 ? t.push(n) : n < 2048 ? t.push(192 | n >> 6, 128 | n & 63) : n < 65536 ? t.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | n & 63) : t.push(240 | n >> 18, 128 | n >> 12 & 63, 128 | n >> 6 & 63, 128 | n & 63);
  }
  return new Uint8Array(t);
}
function fS(e) {
  const t = new Uint8Array(e.length * 2);
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r), i = r * 2;
    t[i] = n & 255, t[i + 1] = n >>> 8;
  }
  return t;
}
function dS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r) & 127;
  return t;
}
function pS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r) & 255;
  return t;
}
function hS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++) {
    const n = e[r], i = n.charCodeAt(0);
    if (i <= 255) {
      t[r] = i;
      continue;
    }
    const a = td[n];
    t[r] = a !== void 0 ? a : 63;
  }
  return t;
}
const mS = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/, rd = {
  len: 4,
  get: (e, t) => {
    const r = Yi(e.subarray(t, t + rd.len), "latin1");
    if (!r.match(mS))
      throw new Xs(`FourCC contains invalid characters: ${ob(r)} "${r}"`);
    return r;
  },
  put: (e, t, r) => {
    const n = iS(r, "latin1");
    if (n.length !== 4)
      throw new Yf("Invalid length");
    return e.set(n, t), t + 4;
  }
}, Qn = {
  text_utf8: 0,
  binary: 1,
  external_info: 2,
  reserved: 3
}, yc = {
  len: 52,
  get: (e, t) => ({
    // should equal 'MAC '
    ID: rd.get(e, t),
    // versionIndex number * 1000 (3.81 = 3810) (remember that 4-byte alignment causes this to take 4-bytes)
    version: W.get(e, t + 4) / 1e3,
    // the number of descriptor bytes (allows later expansion of this header)
    descriptorBytes: W.get(e, t + 8),
    // the number of header APE_HEADER bytes
    headerBytes: W.get(e, t + 12),
    // the number of header APE_HEADER bytes
    seekTableBytes: W.get(e, t + 16),
    // the number of header data bytes (from original file)
    headerDataBytes: W.get(e, t + 20),
    // the number of bytes of APE frame data
    apeFrameDataBytes: W.get(e, t + 24),
    // the high order number of APE frame data bytes
    apeFrameDataBytesHigh: W.get(e, t + 28),
    // the terminating data of the file (not including tag data)
    terminatingDataBytes: W.get(e, t + 32),
    // the MD5 hash of the file (see notes for usage... it's a little tricky)
    fileMD5: new jf(16).get(e, t + 36)
  })
}, gS = {
  len: 24,
  get: (e, t) => ({
    // the compression level (see defines I.E. COMPRESSION_LEVEL_FAST)
    compressionLevel: te.get(e, t),
    // any format flags (for future use)
    formatFlags: te.get(e, t + 2),
    // the number of audio blocks in one frame
    blocksPerFrame: W.get(e, t + 4),
    // the number of audio blocks in the final frame
    finalFrameBlocks: W.get(e, t + 8),
    // the total number of frames
    totalFrames: W.get(e, t + 12),
    // the bits per sample (typically 16)
    bitsPerSample: te.get(e, t + 16),
    // the number of channels (1 or 2)
    channel: te.get(e, t + 18),
    // the sample rate (typically 44100)
    sampleRate: W.get(e, t + 20)
  })
}, je = {
  len: 32,
  get: (e, t) => ({
    // should equal 'APETAGEX'
    ID: new ge(8, "ascii").get(e, t),
    // equals CURRENT_APE_TAG_VERSION
    version: W.get(e, t + 8),
    // the complete size of the tag, including this footer (excludes header)
    size: W.get(e, t + 12),
    // the number of fields in the tag
    fields: W.get(e, t + 16),
    // reserved for later use (must be zero),
    flags: nd(W.get(e, t + 20))
  })
}, Ma = {
  len: 8,
  get: (e, t) => ({
    // Length of assigned value in bytes
    size: W.get(e, t),
    // reserved for later use (must be zero),
    flags: nd(W.get(e, t + 4))
  })
};
function nd(e) {
  return {
    containsHeader: Zn(e, 31),
    containsFooter: Zn(e, 30),
    isHeader: Zn(e, 29),
    readOnly: Zn(e, 0),
    dataType: (e & 6) >> 1
  };
}
function Zn(e, t) {
  return (e & 1 << t) !== 0;
}
const wt = Ir("music-metadata:parser:APEv2"), xc = "APEv2", wc = "APETAGEX";
class si extends ib("APEv2") {
}
function yS(e, t, r) {
  return new St(e, t, r).tryParseApeHeader();
}
class St extends Zf {
  constructor() {
    super(...arguments), this.ape = {};
  }
  /**
   * Calculate the media file duration
   * @param ah ApeHeader
   * @return {number} duration in seconds
   */
  static calculateDuration(t) {
    let r = t.totalFrames > 1 ? t.blocksPerFrame * (t.totalFrames - 1) : 0;
    return r += t.finalFrameBlocks, r / t.sampleRate;
  }
  /**
   * Calculates the APEv1 / APEv2 first field offset
   * @param tokenizer
   * @param offset
   */
  static async findApeFooterOffset(t, r) {
    const n = new Uint8Array(je.len), i = t.position;
    if (r <= je.len) {
      wt(`Offset is too small to read APE footer: offset=${r}`);
      return;
    }
    if (r > je.len) {
      await t.readBuffer(n, { position: r - je.len }), t.setPosition(i);
      const a = je.get(n, 0);
      if (a.ID === "APETAGEX")
        return a.flags.isHeader ? wt(`APE Header found at offset=${r - je.len}`) : (wt(`APE Footer found at offset=${r - je.len}`), r -= a.size), { footer: a, offset: r };
    }
  }
  static parseTagFooter(t, r, n) {
    const i = je.get(r, r.length - je.len);
    if (i.ID !== wc)
      throw new si("Unexpected APEv2 Footer ID preamble value");
    return ns(r), new St(t, ns(r), n).parseTags(i);
  }
  /**
   * Parse APEv1 / APEv2 header if header signature found
   */
  async tryParseApeHeader() {
    if (this.tokenizer.fileInfo.size && this.tokenizer.fileInfo.size - this.tokenizer.position < je.len) {
      wt("No APEv2 header found, end-of-file reached");
      return;
    }
    const t = await this.tokenizer.peekToken(je);
    if (t.ID === wc)
      return await this.tokenizer.ignore(je.len), this.parseTags(t);
    if (wt(`APEv2 header not found at offset=${this.tokenizer.position}`), this.tokenizer.fileInfo.size) {
      const r = this.tokenizer.fileInfo.size - this.tokenizer.position, n = new Uint8Array(r);
      return await this.tokenizer.readBuffer(n), St.parseTagFooter(this.metadata, n, this.options);
    }
  }
  async parse() {
    const t = await this.tokenizer.readToken(yc);
    if (t.ID !== "MAC ")
      throw new si("Unexpected descriptor ID");
    this.ape.descriptor = t;
    const r = t.descriptorBytes - yc.len, n = await (r > 0 ? this.parseDescriptorExpansion(r) : this.parseHeader());
    return this.metadata.setAudioOnly(), await this.tokenizer.ignore(n.forwardBytes), this.tryParseApeHeader();
  }
  async parseTags(t) {
    const r = new Uint8Array(256);
    let n = t.size - je.len;
    wt(`Parse APE tags at offset=${this.tokenizer.position}, size=${n}`);
    for (let i = 0; i < t.fields; i++) {
      if (n < Ma.len) {
        this.metadata.addWarning(`APEv2 Tag-header: ${t.fields - i} items remaining, but no more tag data to read.`);
        break;
      }
      const a = await this.tokenizer.readToken(Ma);
      n -= Ma.len + a.size, await this.tokenizer.peekBuffer(r, { length: Math.min(r.length, n) });
      let s = mc(r, 0, r.length);
      const o = await this.tokenizer.readToken(new ge(s, "ascii"));
      switch (await this.tokenizer.ignore(1), n -= o.length + 1, a.flags.dataType) {
        case Qn.text_utf8: {
          const d = (await this.tokenizer.readToken(new ge(a.size, "utf8"))).split(/\x00/g);
          await Promise.all(d.map((c) => this.metadata.addTag(xc, o, c)));
          break;
        }
        case Qn.binary:
          if (this.options.skipCovers)
            await this.tokenizer.ignore(a.size);
          else {
            const l = new Uint8Array(a.size);
            await this.tokenizer.readBuffer(l), s = mc(l, 0, l.length);
            const d = Yi(l.subarray(0, s), "utf-8"), c = l.subarray(s + 1);
            await this.metadata.addTag(xc, o, {
              description: d,
              data: c
            });
          }
          break;
        case Qn.external_info:
          wt(`Ignore external info ${o}`), await this.tokenizer.ignore(a.size);
          break;
        case Qn.reserved:
          wt(`Ignore external info ${o}`), this.metadata.addWarning(`APEv2 header declares a reserved datatype for "${o}"`), await this.tokenizer.ignore(a.size);
          break;
      }
    }
  }
  async parseDescriptorExpansion(t) {
    return await this.tokenizer.ignore(t), this.parseHeader();
  }
  async parseHeader() {
    const t = await this.tokenizer.readToken(gS);
    if (this.metadata.setFormat("lossless", !0), this.metadata.setFormat("container", "Monkey's Audio"), this.metadata.setFormat("bitsPerSample", t.bitsPerSample), this.metadata.setFormat("sampleRate", t.sampleRate), this.metadata.setFormat("numberOfChannels", t.channel), this.metadata.setFormat("duration", St.calculateDuration(t)), !this.ape.descriptor)
      throw new si("Missing APE descriptor");
    return {
      forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes
    };
  }
}
const xS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  APEv2Parser: St,
  ApeContentError: si,
  tryParseApeHeader: yS
}, Symbol.toStringTag, { value: "Module" })), ei = Ir("music-metadata:parser:ID3v1"), Ec = [
  "Blues",
  "Classic Rock",
  "Country",
  "Dance",
  "Disco",
  "Funk",
  "Grunge",
  "Hip-Hop",
  "Jazz",
  "Metal",
  "New Age",
  "Oldies",
  "Other",
  "Pop",
  "R&B",
  "Rap",
  "Reggae",
  "Rock",
  "Techno",
  "Industrial",
  "Alternative",
  "Ska",
  "Death Metal",
  "Pranks",
  "Soundtrack",
  "Euro-Techno",
  "Ambient",
  "Trip-Hop",
  "Vocal",
  "Jazz+Funk",
  "Fusion",
  "Trance",
  "Classical",
  "Instrumental",
  "Acid",
  "House",
  "Game",
  "Sound Clip",
  "Gospel",
  "Noise",
  "Alt. Rock",
  "Bass",
  "Soul",
  "Punk",
  "Space",
  "Meditative",
  "Instrumental Pop",
  "Instrumental Rock",
  "Ethnic",
  "Gothic",
  "Darkwave",
  "Techno-Industrial",
  "Electronic",
  "Pop-Folk",
  "Eurodance",
  "Dream",
  "Southern Rock",
  "Comedy",
  "Cult",
  "Gangsta Rap",
  "Top 40",
  "Christian Rap",
  "Pop/Funk",
  "Jungle",
  "Native American",
  "Cabaret",
  "New Wave",
  "Psychedelic",
  "Rave",
  "Showtunes",
  "Trailer",
  "Lo-Fi",
  "Tribal",
  "Acid Punk",
  "Acid Jazz",
  "Polka",
  "Retro",
  "Musical",
  "Rock & Roll",
  "Hard Rock",
  "Folk",
  "Folk/Rock",
  "National Folk",
  "Swing",
  "Fast-Fusion",
  "Bebob",
  "Latin",
  "Revival",
  "Celtic",
  "Bluegrass",
  "Avantgarde",
  "Gothic Rock",
  "Progressive Rock",
  "Psychedelic Rock",
  "Symphonic Rock",
  "Slow Rock",
  "Big Band",
  "Chorus",
  "Easy Listening",
  "Acoustic",
  "Humour",
  "Speech",
  "Chanson",
  "Opera",
  "Chamber Music",
  "Sonata",
  "Symphony",
  "Booty Bass",
  "Primus",
  "Porn Groove",
  "Satire",
  "Slow Jam",
  "Club",
  "Tango",
  "Samba",
  "Folklore",
  "Ballad",
  "Power Ballad",
  "Rhythmic Soul",
  "Freestyle",
  "Duet",
  "Punk Rock",
  "Drum Solo",
  "A Cappella",
  "Euro-House",
  "Dance Hall",
  "Goa",
  "Drum & Bass",
  "Club-House",
  "Hardcore",
  "Terror",
  "Indie",
  "BritPop",
  "Negerpunk",
  "Polsk Punk",
  "Beat",
  "Christian Gangsta Rap",
  "Heavy Metal",
  "Black Metal",
  "Crossover",
  "Contemporary Christian",
  "Christian Rock",
  "Merengue",
  "Salsa",
  "Thrash Metal",
  "Anime",
  "JPop",
  "Synthpop",
  "Abstract",
  "Art Rock",
  "Baroque",
  "Bhangra",
  "Big Beat",
  "Breakbeat",
  "Chillout",
  "Downtempo",
  "Dub",
  "EBM",
  "Eclectic",
  "Electro",
  "Electroclash",
  "Emo",
  "Experimental",
  "Garage",
  "Global",
  "IDM",
  "Illbient",
  "Industro-Goth",
  "Jam Band",
  "Krautrock",
  "Leftfield",
  "Lounge",
  "Math Rock",
  "New Romantic",
  "Nu-Breakz",
  "Post-Punk",
  "Post-Rock",
  "Psytrance",
  "Shoegaze",
  "Space Rock",
  "Trop Rock",
  "World Music",
  "Neoclassical",
  "Audiobook",
  "Audio Theatre",
  "Neue Deutsche Welle",
  "Podcast",
  "Indie Rock",
  "G-Funk",
  "Dubstep",
  "Garage Rock",
  "Psybient"
], ti = {
  len: 128,
  /**
   * @param buf Buffer possibly holding the 128 bytes ID3v1.1 metadata header
   * @param off Offset in buffer in bytes
   * @returns ID3v1.1 header if first 3 bytes equals 'TAG', otherwise null is returned
   */
  get: (e, t) => {
    const r = new ur(3).get(e, t);
    return r === "TAG" ? {
      header: r,
      title: new ur(30).get(e, t + 3),
      artist: new ur(30).get(e, t + 33),
      album: new ur(30).get(e, t + 63),
      year: new ur(4).get(e, t + 93),
      comment: new ur(28).get(e, t + 97),
      // ID3v1.1 separator for track
      zeroByte: Yt.get(e, t + 127),
      // track: ID3v1.1 field added by Michael Mutschler
      track: Yt.get(e, t + 126),
      genre: Yt.get(e, t + 127)
    } : null;
  }
};
class ur {
  constructor(t) {
    this.len = t, this.stringType = new ge(t, "latin1");
  }
  get(t, r) {
    let n = this.stringType.get(t, r);
    return n = ab(n), n = n.trim(), n.length > 0 ? n : void 0;
  }
}
class id extends Zf {
  constructor(t, r, n) {
    super(t, r, n), this.apeHeader = n.apeHeader;
  }
  static getGenre(t) {
    if (t < Ec.length)
      return Ec[t];
  }
  async parse() {
    if (!this.tokenizer.fileInfo.size) {
      ei("Skip checking for ID3v1 because the file-size is unknown");
      return;
    }
    this.apeHeader && (this.tokenizer.ignore(this.apeHeader.offset - this.tokenizer.position), await new St(this.metadata, this.tokenizer, this.options).parseTags(this.apeHeader.footer));
    const t = this.tokenizer.fileInfo.size - ti.len;
    if (this.tokenizer.position > t) {
      ei("Already consumed the last 128 bytes");
      return;
    }
    const r = await this.tokenizer.readToken(ti, t);
    if (r) {
      ei("ID3v1 header found at: pos=%s", this.tokenizer.fileInfo.size - ti.len);
      const n = ["title", "artist", "album", "comment", "track", "year"];
      for (const a of n)
        r[a] && r[a] !== "" && await this.addTag(a, r[a]);
      const i = id.getGenre(r.genre);
      i && await this.addTag("genre", i);
    } else
      ei("ID3v1 header not found at: pos=%s", this.tokenizer.fileInfo.size - ti.len);
  }
  async addTag(t, r) {
    await this.metadata.addTag("ID3v1", t, r);
  }
}
async function wS(e) {
  if (e.fileInfo.size >= 128) {
    const t = new Uint8Array(3), r = e.position;
    return await e.readBuffer(t, { position: e.fileInfo.size - 128 }), e.setPosition(r), Yi(t, "latin1") === "TAG";
  }
  return !1;
}
const ES = "LYRICS200";
async function vS(e) {
  const t = e.fileInfo.size;
  if (t >= 143) {
    const r = new Uint8Array(15), n = e.position;
    await e.readBuffer(r, { position: t - 143 }), e.setPosition(n);
    const i = Yi(r, "latin1");
    if (i.substring(6) === ES)
      return Number.parseInt(i.substring(0, 6), 10) + 15;
  }
  return 0;
}
async function TS(e, t = {}) {
  let r = e.fileInfo.size;
  if (await wS(e)) {
    r -= 128;
    const n = await vS(e);
    r -= n;
  }
  t.apeHeader = await St.findApeFooterOffset(e, r);
}
const vc = Ir("music-metadata:parser");
async function _S(e, t = {}) {
  vc(`parseFile: ${e}`);
  const r = await ZT(e), n = new eS();
  try {
    const i = n.findLoaderForExtension(e);
    i || vc("Parser could not be determined by file extension");
    try {
      return await n.parse(r, i, t);
    } catch (a) {
      throw (a instanceof Wf || a instanceof Vf) && (a.message += `: ${e}`), a;
    }
  } finally {
    await r.close();
  }
}
const ad = Ba(import.meta.url);
let cs = ad("ffmpeg-static");
Xe.isPackaged && (cs = cs.replace("app.asar", "app.asar.unpacked"));
function bS(e) {
  return new Promise((t) => {
    Ep(`powershell -ExecutionPolicy Bypass -File "${e}"`, (r, n) => {
      if (r) {
        t("unknown");
        return;
      }
      t(n.trim());
    });
  });
}
st.autoUpdater.allowPrerelease = !0;
const SS = Xe.requestSingleInstanceLock();
SS ? Xe.on("second-instance", () => {
  J && (J.isMinimized() && J.restore(), J.focus());
}) : Xe.quit();
const sd = Se.dirname(hp(import.meta.url));
process.env.APP_ROOT = Se.join(sd, "..");
const us = process.env.VITE_DEV_SERVER_URL, sA = Se.join(process.env.APP_ROOT, "dist-electron"), od = Se.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = us ? Se.join(process.env.APP_ROOT, "public") : od;
let J;
function ld() {
  J = new Tc({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: Se.join(process.env.VITE_PUBLIC, "logo.png"),
    titleBarStyle: "hidden",
    // Custom title bar for premium look
    titleBarOverlay: {
      color: "#00000000",
      symbolColor: "#ffffff",
      height: 30
    },
    webPreferences: {
      preload: Se.join(sd, "preload.mjs"),
      webSecurity: !1,
      // simplified for local file access in dev
      backgroundThrottling: !1
    }
  }), J.webContents.on("did-finish-load", () => {
    J == null || J.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), us ? J.loadURL(us) : J.loadFile(Se.join(od, "index.html"));
}
Xe.on("window-all-closed", () => {
  process.platform !== "darwin" && (Xe.quit(), J = null);
});
Xe.on("activate", () => {
  Tc.getAllWindows().length === 0 && ld();
});
st.autoUpdater.on("checking-for-update", () => {
  J == null || J.webContents.send("update-status", { status: "checking" });
});
st.autoUpdater.on("update-available", (e) => {
  J == null || J.webContents.send("update-status", { status: "available", info: e });
});
st.autoUpdater.on("update-not-available", (e) => {
  J == null || J.webContents.send("update-status", { status: "not-available", info: e });
});
st.autoUpdater.on("error", (e) => {
  J == null || J.webContents.send("update-status", { status: "error", error: e.message });
});
st.autoUpdater.on("download-progress", (e) => {
  J == null || J.webContents.send("update-status", { status: "downloading", progress: e });
});
st.autoUpdater.on("update-downloaded", (e) => {
  J == null || J.webContents.send("update-status", { status: "downloaded", info: e }), new pp({
    title: "NeonWave 更新",
    body: "新版本已下載完成，將於重啟後自動安裝。",
    icon: Se.join(process.env.VITE_PUBLIC, "logo.png")
  }).show();
});
Xe.whenReady().then(() => {
  process.platform === "win32" && Xe.setAppUserModelId("NeonWave"), ld(), ze.handle("dialog:openDirectory", async () => {
    const { canceled: n, filePaths: i } = await ho.showOpenDialog(J, {
      properties: ["openDirectory"]
    });
    return n ? null : i[0];
  }), ze.handle("files:listMusic", async (n, i) => {
    if (!i) return [];
    try {
      const a = await nr.readdir(i), s = [".mp3", ".wav", ".wma", ".m4a", ".flac", ".ogg", ".mp4", ".mov", ".wmv", ".avi"];
      return a.filter((o) => s.includes(Se.extname(o).toLowerCase())).map((o) => Se.join(i, o));
    } catch (a) {
      return console.error("Error reading directory:", a), [];
    }
  }), ze.handle("files:readBuffer", async (n, i) => {
    try {
      return await nr.readFile(i);
    } catch (a) {
      return console.error("Error reading file:", a), null;
    }
  }), ze.handle("files:getMetadata", async (n, i) => {
    try {
      const a = await _S(i);
      let s = null;
      if (a.common.picture && a.common.picture.length > 0) {
        const o = a.common.picture[0];
        s = `data:${o.format};base64,${Buffer.from(o.data).toString("base64")}`;
      }
      return {
        title: a.common.title,
        artist: a.common.artist,
        album: a.common.album,
        artwork: s,
        duration: a.format.duration,
        codec: a.format.codec,
        bitrate: a.format.bitrate,
        sampleRate: a.format.sampleRate
      };
    } catch {
      return null;
    }
  }), ze.handle("app:active-window", async () => {
    const n = Se.join(process.env.APP_ROOT, "scripts/get-active-window.ps1");
    return await bS(n);
  });
  const e = Ba(import.meta.url)("yt-dlp-wrap").default, t = async () => {
    const n = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp", i = Se.join(Xe.getPath("userData"), n);
    try {
      await nr.access(i);
    } catch {
      console.log("Downloading yt-dlp binary..."), await e.downloadFromGithub(i), console.log("Downloaded yt-dlp to", i);
    }
    return new e(i);
  };
  ze.handle("search:youtube", async (n, i) => {
    try {
      return (await (await t()).execPromise([
        `ytsearch20:${i}`,
        "--dump-json",
        "--flat-playlist"
      ])).trim().split(`
`).map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      }).filter((l) => l && l.id).map((l) => ({
        id: l.id,
        title: l.title,
        artist: l.channel || l.uploader || "Unknown",
        duration: l.duration,
        thumbnail: `https://i.ytimg.com/vi/${l.id}/hqdefault.jpg`,
        // yt-dlp flat-playlist sometimes misses thumbs
        url: l.url || `https://www.youtube.com/watch?v=${l.id}`
      }));
    } catch (a) {
      return console.error("Yt-dlp search error:", a), [];
    }
  }), ze.handle("download:youtube", async (n, i, a, s) => {
    try {
      const o = await t(), l = Ba(import.meta.url)("ffmpeg-static").replace("app.asar", "app.asar.unpacked");
      let d = a.replace(/[\\/:*?"<>|]/g, "_").trim();
      const { filePath: c } = await ho.showSaveDialog(J, {
        title: "下載歌曲",
        defaultPath: `${d}.m4a`,
        // Force m4a for best playback
        filters: [{ name: "Audio (m4a)", extensions: ["m4a"] }]
      });
      return c ? new Promise((u, p) => {
        const g = [
          i,
          "-f",
          "bestaudio[ext=m4a]",
          "--ffmpeg-location",
          l,
          "--add-metadata",
          "--embed-thumbnail",
          "-o",
          c
        ];
        s && (g.push("--parse-metadata", `${s}:%(artist)s`), g.push("--parse-metadata", `${s}:%(album_artist)s`)), a && g.push("--parse-metadata", `${a}:%(title)s`);
        const w = o.exec(g);
        w.on("progress", () => {
        }), w.on("error", (x) => {
          console.error("yt-dlp error:", x), p(new Error(`下載錯誤: ${x.message}`));
        }), w.on("close", () => {
          u(c);
        });
      }) : null;
    } catch (o) {
      throw console.error("Download fatal error:", o), new Error(o.message);
    }
  }), ze.handle("search:artistImage", async (n, i) => {
    try {
      const a = `https://api.deezer.com/search/artist?q=${encodeURIComponent(i)}&limit=1`;
      try {
        const l = await fetch(a);
        if (l.ok) {
          const d = await l.json();
          if (d && d.data && d.data.length > 0) {
            const c = d.data[0].picture_medium || d.data[0].picture_big;
            if (c) return c;
          }
        }
      } catch {
      }
      const s = `https://itunes.apple.com/search?term=${encodeURIComponent(i)}&media=music&entity=album&limit=1`, o = await fetch(s);
      if (o.ok) {
        const l = await o.json();
        if (l && l.results && l.results.length > 0) {
          const d = l.results[0].artworkUrl100;
          if (d)
            return d.replace("100x100bb", "600x600bb");
        }
      }
      try {
        const l = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(i)}`, d = await fetch(l);
        if (d.ok) {
          const c = await d.json();
          if (c && c.artists && c.artists.length > 0) {
            const u = c.artists[0], p = u.strArtistThumb || u.strArtistFanart;
            if (p) return p;
          }
        }
      } catch {
      }
      return null;
    } catch (a) {
      return console.error("Error fetching artist image:", a), null;
    }
  }), ze.handle("search:lyrics", async (n, i, a, s) => {
    try {
      const o = async (u) => {
        try {
          const p = `https://lrclib.net/api/search?q=${encodeURIComponent(u)}`, g = await fetch(p);
          if (g.ok) {
            const w = await g.json();
            if (Array.isArray(w) && w.length > 0) {
              const x = (a || "").split(" ")[0].toLowerCase(), T = w.find((_) => _.syncedLyrics && (!x || _.artistName.toLowerCase().includes(x))) || w.find((_) => _.syncedLyrics) || w[0];
              return T.syncedLyrics || T.plainLyrics;
            }
          }
        } catch (p) {
          console.error("LRC Search Error", u, p);
        }
        return null;
      }, l = i.match(/【(.*?)】/);
      if (l) {
        const u = l[1].trim();
        if (u) {
          const p = await o(`${u} ${a}`);
          if (p) return p;
          const g = await o(u);
          if (g) return g;
        }
      }
      let d = i.replace(/【.*?】/g, " ").replace(/\[.*?\]/g, " ").replace(/\(.*?\)/g, " ").replace(/-?\s*official\s*music\s*video/gi, "").replace(/-?\s*official\s*video/gi, "").replace(/-?\s*mv/gi, "").replace(/[^a-zA-Z0-9\u4e00-\u9fa5 ]/g, " ").replace(/\s+/g, " ").trim();
      const c = (a || "").split(" ")[0];
      if (c && d.toLowerCase().includes(c.toLowerCase()) && (d = d.replace(new RegExp(c, "gi"), "").trim()), d) {
        const u = await o(`${d} ${a}`);
        if (u) return u;
      }
      if (s) {
        const u = Se.basename(s, Se.extname(s)).replace(/-?\s*official\s*video/gi, "").replace(/\(.*\)/g, ""), p = await o(u);
        if (p) return p;
      }
      return null;
    } catch (o) {
      return console.error("Error fetching lyrics:", o), null;
    }
  });
  const r = ad("node-shazam");
  ze.handle("music:identify", async (n, i) => {
    const a = Se.join(Xe.getPath("temp"), `shazam_${Date.now()}.raw`);
    try {
      await new Promise((d, c) => {
        wp(cs, [
          "-i",
          i,
          "-f",
          "s16le",
          "-ac",
          "1",
          "-ar",
          "16000",
          "-t",
          "10",
          "-y",
          a
        ], (u) => {
          u ? c(u) : d(!0);
        });
      });
      const s = await nr.readFile(a), l = await new r().recognise(s);
      try {
        await nr.unlink(a);
      } catch {
      }
      return l && l.track ? {
        title: l.track.title,
        artist: l.track.subtitle
        // Shazam uses subtitle for artist
      } : null;
    } catch (s) {
      console.error("Shazam Error:", s);
      try {
        await nr.unlink(a);
      } catch {
      }
      return null;
    }
  }), ze.handle("update:check", () => {
    st.autoUpdater.checkForUpdates();
  }), ze.handle("update:install", () => {
    st.autoUpdater.quitAndInstall(!0, !0);
  }), ze.handle("app:version", () => Xe.getVersion());
});
export {
  rA as A,
  Zf as B,
  Mf as C,
  VS as D,
  Ie as E,
  rd as F,
  Yi as G,
  Ec as H,
  s_ as I,
  yS as J,
  ab as K,
  nA as L,
  id as M,
  Uf as N,
  db as O,
  mc as P,
  tA as Q,
  pb as R,
  ge as S,
  ft as T,
  wi as U,
  aA as V,
  iA as W,
  fb as X,
  us as Y,
  sA as Z,
  od as _,
  qt as a,
  Yt as b,
  Ir as c,
  jf as d,
  os as e,
  W as f,
  Kf as g,
  KS as h,
  eA as i,
  zf as j,
  te as k,
  jr as l,
  ib as m,
  p_ as n,
  ns as o,
  f_ as p,
  u_ as q,
  x_ as r,
  ZS as s,
  g_ as t,
  YS as u,
  d_ as v,
  JS as w,
  Bf as x,
  c_ as y,
  as as z
};
