var up = Object.defineProperty;
var fp = (e, t, r) => t in e ? up(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var ia = (e, t, r) => fp(e, typeof t != "symbol" ? t + "" : t, r);
import Kt, { app as Ke, BrowserWindow as Tc, Notification as dp, ipcMain as qe, dialog as po } from "electron";
import { createRequire as Mr } from "node:module";
import { fileURLToPath as pp } from "node:url";
import Re from "node:path";
import aa, { open as hp } from "node:fs/promises";
import Dt from "fs";
import mp from "constants";
import cn from "stream";
import us from "util";
import _c from "assert";
import le from "path";
import Ti from "child_process";
import bc from "events";
import un from "crypto";
import Sc from "tty";
import _i from "os";
import _r from "url";
import gp from "string_decoder";
import Ac from "zlib";
import yp from "http";
import { exec as xp } from "node:child_process";
var Oe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function wp(e) {
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
var xt = mp, Ep = process.cwd, ri = null, vp = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return ri || (ri = Ep.call(process)), ri;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var ho = process.chdir;
  process.chdir = function(e) {
    ri = null, ho.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, ho);
}
var Tp = _p;
function _p(e) {
  xt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = a(e.chown), e.fchown = a(e.fchown), e.lchown = a(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = o(e.stat), e.fstat = o(e.fstat), e.lstat = o(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, u, d) {
    d && process.nextTick(d);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, u, d, m) {
    m && process.nextTick(m);
  }, e.lchownSync = function() {
  }), vp === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function u(d, m, w) {
      var x = Date.now(), T = 0;
      c(d, m, function b(_) {
        if (_ && (_.code === "EACCES" || _.code === "EPERM" || _.code === "EBUSY") && Date.now() - x < 6e4) {
          setTimeout(function() {
            e.stat(m, function(k, $) {
              k && k.code === "ENOENT" ? c(d, m, b) : w(_);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        w && w(_);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function u(d, m, w, x, T, b) {
      var _;
      if (b && typeof b == "function") {
        var k = 0;
        _ = function($, Q, re) {
          if ($ && $.code === "EAGAIN" && k < 10)
            return k++, c.call(e, d, m, w, x, T, _);
          b.apply(this, arguments);
        };
      }
      return c.call(e, d, m, w, x, T, _);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(u, d, m, w, x) {
      for (var T = 0; ; )
        try {
          return c.call(e, u, d, m, w, x);
        } catch (b) {
          if (b.code === "EAGAIN" && T < 10) {
            T++;
            continue;
          }
          throw b;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(u, d, m) {
      c.open(
        u,
        xt.O_WRONLY | xt.O_SYMLINK,
        d,
        function(w, x) {
          if (w) {
            m && m(w);
            return;
          }
          c.fchmod(x, d, function(T) {
            c.close(x, function(b) {
              m && m(T || b);
            });
          });
        }
      );
    }, c.lchmodSync = function(u, d) {
      var m = c.openSync(u, xt.O_WRONLY | xt.O_SYMLINK, d), w = !0, x;
      try {
        x = c.fchmodSync(m, d), w = !1;
      } finally {
        if (w)
          try {
            c.closeSync(m);
          } catch {
          }
        else
          c.closeSync(m);
      }
      return x;
    };
  }
  function r(c) {
    xt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(u, d, m, w) {
      c.open(u, xt.O_SYMLINK, function(x, T) {
        if (x) {
          w && w(x);
          return;
        }
        c.futimes(T, d, m, function(b) {
          c.close(T, function(_) {
            w && w(b || _);
          });
        });
      });
    }, c.lutimesSync = function(u, d, m) {
      var w = c.openSync(u, xt.O_SYMLINK), x, T = !0;
      try {
        x = c.futimesSync(w, d, m), T = !1;
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
    }) : c.futimes && (c.lutimes = function(u, d, m, w) {
      w && process.nextTick(w);
    }, c.lutimesSync = function() {
    });
  }
  function n(c) {
    return c && function(u, d, m) {
      return c.call(e, u, d, function(w) {
        p(w) && (w = null), m && m.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(u, d) {
      try {
        return c.call(e, u, d);
      } catch (m) {
        if (!p(m)) throw m;
      }
    };
  }
  function a(c) {
    return c && function(u, d, m, w) {
      return c.call(e, u, d, m, function(x) {
        p(x) && (x = null), w && w.apply(this, arguments);
      });
    };
  }
  function s(c) {
    return c && function(u, d, m) {
      try {
        return c.call(e, u, d, m);
      } catch (w) {
        if (!p(w)) throw w;
      }
    };
  }
  function o(c) {
    return c && function(u, d, m) {
      typeof d == "function" && (m = d, d = null);
      function w(x, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), m && m.apply(this, arguments);
      }
      return d ? c.call(e, u, d, w) : c.call(e, u, w);
    };
  }
  function l(c) {
    return c && function(u, d) {
      var m = d ? c.call(e, u, d) : c.call(e, u);
      return m && (m.uid < 0 && (m.uid += 4294967296), m.gid < 0 && (m.gid += 4294967296)), m;
    };
  }
  function p(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var u = !process.getuid || process.getuid() !== 0;
    return !!(u && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var mo = cn.Stream, bp = Sp;
function Sp(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    mo.call(this);
    var a = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var s = Object.keys(i), o = 0, l = s.length; o < l; o++) {
      var p = s[o];
      this[p] = i[p];
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
    mo.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var Ap = Cp, Ip = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Cp(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Ip(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var oe = Dt, Rp = Tp, Op = bp, Dp = Ap, kn = us, ve, oi;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (ve = Symbol.for("graceful-fs.queue"), oi = Symbol.for("graceful-fs.previous")) : (ve = "___graceful-fs.queue", oi = "___graceful-fs.previous");
function Pp() {
}
function Ic(e, t) {
  Object.defineProperty(e, ve, {
    get: function() {
      return t;
    }
  });
}
var Wt = Pp;
kn.debuglog ? Wt = kn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Wt = function() {
  var e = kn.format.apply(kn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[ve]) {
  var kp = Oe[ve] || [];
  Ic(oe, kp), oe.close = function(e) {
    function t(r, n) {
      return e.call(oe, r, function(i) {
        i || go(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, oi, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(r) {
      e.apply(oe, arguments), go();
    }
    return Object.defineProperty(t, oi, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Wt(oe[ve]), _c.equal(oe[ve].length, 0);
  });
}
Oe[ve] || Ic(Oe, oe[ve]);
var Ne = fs(Dp(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && (Ne = fs(oe), oe.__patched = !0);
function fs(e) {
  Rp(e), e.gracefulify = fs, e.createReadStream = Q, e.createWriteStream = re;
  var t = e.readFile;
  e.readFile = r;
  function r(y, q, j) {
    return typeof q == "function" && (j = q, q = null), B(y, q, j);
    function B(Z, R, I, D) {
      return t(Z, R, function(A) {
        A && (A.code === "EMFILE" || A.code === "ENFILE") ? nr([B, [Z, R, I], A, D || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(y, q, j, B) {
    return typeof j == "function" && (B = j, j = null), Z(y, q, j, B);
    function Z(R, I, D, A, N) {
      return n(R, I, D, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? nr([Z, [R, I, D, A], O, N || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var a = e.appendFile;
  a && (e.appendFile = s);
  function s(y, q, j, B) {
    return typeof j == "function" && (B = j, j = null), Z(y, q, j, B);
    function Z(R, I, D, A, N) {
      return a(R, I, D, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? nr([Z, [R, I, D, A], O, N || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var o = e.copyFile;
  o && (e.copyFile = l);
  function l(y, q, j, B) {
    return typeof j == "function" && (B = j, j = 0), Z(y, q, j, B);
    function Z(R, I, D, A, N) {
      return o(R, I, D, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? nr([Z, [R, I, D, A], O, N || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var p = e.readdir;
  e.readdir = u;
  var c = /^v[0-5]\./;
  function u(y, q, j) {
    typeof q == "function" && (j = q, q = null);
    var B = c.test(process.version) ? function(I, D, A, N) {
      return p(I, Z(
        I,
        D,
        A,
        N
      ));
    } : function(I, D, A, N) {
      return p(I, D, Z(
        I,
        D,
        A,
        N
      ));
    };
    return B(y, q, j);
    function Z(R, I, D, A) {
      return function(N, O) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? nr([
          B,
          [R, I, D],
          N,
          A || Date.now(),
          Date.now()
        ]) : (O && O.sort && O.sort(), typeof D == "function" && D.call(this, N, O));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var d = Op(e);
    b = d.ReadStream, k = d.WriteStream;
  }
  var m = e.ReadStream;
  m && (b.prototype = Object.create(m.prototype), b.prototype.open = _);
  var w = e.WriteStream;
  w && (k.prototype = Object.create(w.prototype), k.prototype.open = $), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return b;
    },
    set: function(y) {
      b = y;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return k;
    },
    set: function(y) {
      k = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var x = b;
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
  var T = k;
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
  function b(y, q) {
    return this instanceof b ? (m.apply(this, arguments), this) : b.apply(Object.create(b.prototype), arguments);
  }
  function _() {
    var y = this;
    Me(y.path, y.flags, y.mode, function(q, j) {
      q ? (y.autoClose && y.destroy(), y.emit("error", q)) : (y.fd = j, y.emit("open", j), y.read());
    });
  }
  function k(y, q) {
    return this instanceof k ? (w.apply(this, arguments), this) : k.apply(Object.create(k.prototype), arguments);
  }
  function $() {
    var y = this;
    Me(y.path, y.flags, y.mode, function(q, j) {
      q ? (y.destroy(), y.emit("error", q)) : (y.fd = j, y.emit("open", j));
    });
  }
  function Q(y, q) {
    return new e.ReadStream(y, q);
  }
  function re(y, q) {
    return new e.WriteStream(y, q);
  }
  var Y = e.open;
  e.open = Me;
  function Me(y, q, j, B) {
    return typeof j == "function" && (B = j, j = null), Z(y, q, j, B);
    function Z(R, I, D, A, N) {
      return Y(R, I, D, function(O, M) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? nr([Z, [R, I, D, A], O, N || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  return e;
}
function nr(e) {
  Wt("ENQUEUE", e[0].name, e[1]), oe[ve].push(e), ds();
}
var Nn;
function go() {
  for (var e = Date.now(), t = 0; t < oe[ve].length; ++t)
    oe[ve][t].length > 2 && (oe[ve][t][3] = e, oe[ve][t][4] = e);
  ds();
}
function ds() {
  if (clearTimeout(Nn), Nn = void 0, oe[ve].length !== 0) {
    var e = oe[ve].shift(), t = e[0], r = e[1], n = e[2], i = e[3], a = e[4];
    if (i === void 0)
      Wt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Wt("TIMEOUT", t.name, r);
      var s = r.pop();
      typeof s == "function" && s.call(null, n);
    } else {
      var o = Date.now() - a, l = Math.max(a - i, 1), p = Math.min(l * 1.2, 100);
      o >= p ? (Wt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : oe[ve].push(e);
    }
    Nn === void 0 && (Nn = setTimeout(ds, 0));
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
  }, e.read = function(i, a, s, o, l, p) {
    return typeof p == "function" ? r.read(i, a, s, o, l, p) : new Promise((c, u) => {
      r.read(i, a, s, o, l, (d, m, w) => {
        if (d) return u(d);
        c({ bytesRead: m, buffer: w });
      });
    });
  }, e.write = function(i, a, ...s) {
    return typeof s[s.length - 1] == "function" ? r.write(i, a, ...s) : new Promise((o, l) => {
      r.write(i, a, ...s, (p, c, u) => {
        if (p) return l(p);
        o({ bytesWritten: c, buffer: u });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, a, ...s) {
    return typeof s[s.length - 1] == "function" ? r.writev(i, a, ...s) : new Promise((o, l) => {
      r.writev(i, a, ...s, (p, c, u) => {
        if (p) return l(p);
        o({ bytesWritten: c, buffers: u });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Zt);
var ps = {}, Cc = {};
const Np = le;
Cc.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Np.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Rc = Zt, { checkPath: Oc } = Cc, Dc = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
ps.makeDir = async (e, t) => (Oc(e), Rc.mkdir(e, {
  mode: Dc(t),
  recursive: !0
}));
ps.makeDirSync = (e, t) => (Oc(e), Rc.mkdirSync(e, {
  mode: Dc(t),
  recursive: !0
}));
const Fp = ke.fromPromise, { makeDir: $p, makeDirSync: sa } = ps, oa = Fp($p);
var ot = {
  mkdirs: oa,
  mkdirsSync: sa,
  // alias
  mkdirp: oa,
  mkdirpSync: sa,
  ensureDir: oa,
  ensureDirSync: sa
};
const Lp = ke.fromPromise, Pc = Zt;
function Up(e) {
  return Pc.access(e).then(() => !0).catch(() => !1);
}
var er = {
  pathExists: Lp(Up),
  pathExistsSync: Pc.existsSync
};
const yr = Ne;
function Mp(e, t, r, n) {
  yr.open(e, "r+", (i, a) => {
    if (i) return n(i);
    yr.futimes(a, t, r, (s) => {
      yr.close(a, (o) => {
        n && n(s || o);
      });
    });
  });
}
function Bp(e, t, r) {
  const n = yr.openSync(e, "r+");
  return yr.futimesSync(n, t, r), yr.closeSync(n);
}
var kc = {
  utimesMillis: Mp,
  utimesMillisSync: Bp
};
const wr = Zt, ye = le, jp = us;
function zp(e, t, r) {
  const n = r.dereference ? (i) => wr.stat(i, { bigint: !0 }) : (i) => wr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, a]) => ({ srcStat: i, destStat: a }));
}
function Gp(e, t, r) {
  let n;
  const i = r.dereference ? (s) => wr.statSync(s, { bigint: !0 }) : (s) => wr.lstatSync(s, { bigint: !0 }), a = i(e);
  try {
    n = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: a, destStat: null };
    throw s;
  }
  return { srcStat: a, destStat: n };
}
function Hp(e, t, r, n, i) {
  jp.callbackify(zp)(e, t, n, (a, s) => {
    if (a) return i(a);
    const { srcStat: o, destStat: l } = s;
    if (l) {
      if (fn(o, l)) {
        const p = ye.basename(e), c = ye.basename(t);
        return r === "move" && p !== c && p.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: o, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (o.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!o.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return o.isDirectory() && hs(e, t) ? i(new Error(bi(e, t, r))) : i(null, { srcStat: o, destStat: l });
  });
}
function qp(e, t, r, n) {
  const { srcStat: i, destStat: a } = Gp(e, t, n);
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
  if (i.isDirectory() && hs(e, t))
    throw new Error(bi(e, t, r));
  return { srcStat: i, destStat: a };
}
function Nc(e, t, r, n, i) {
  const a = ye.resolve(ye.dirname(e)), s = ye.resolve(ye.dirname(r));
  if (s === a || s === ye.parse(s).root) return i();
  wr.stat(s, { bigint: !0 }, (o, l) => o ? o.code === "ENOENT" ? i() : i(o) : fn(t, l) ? i(new Error(bi(e, r, n))) : Nc(e, t, s, n, i));
}
function Fc(e, t, r, n) {
  const i = ye.resolve(ye.dirname(e)), a = ye.resolve(ye.dirname(r));
  if (a === i || a === ye.parse(a).root) return;
  let s;
  try {
    s = wr.statSync(a, { bigint: !0 });
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
function hs(e, t) {
  const r = ye.resolve(e).split(ye.sep).filter((i) => i), n = ye.resolve(t).split(ye.sep).filter((i) => i);
  return r.reduce((i, a, s) => i && n[s] === a, !0);
}
function bi(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var br = {
  checkPaths: Hp,
  checkPathsSync: qp,
  checkParentPaths: Nc,
  checkParentPathsSync: Fc,
  isSrcSubdir: hs,
  areIdentical: fn
};
const Le = Ne, Wr = le, Xp = ot.mkdirs, Wp = er.pathExists, Vp = kc.utimesMillis, Vr = br;
function Yp(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Vr.checkPaths(e, t, "copy", r, (i, a) => {
    if (i) return n(i);
    const { srcStat: s, destStat: o } = a;
    Vr.checkParentPaths(e, s, t, "copy", (l) => l ? n(l) : r.filter ? $c(yo, o, e, t, r, n) : yo(o, e, t, r, n));
  });
}
function yo(e, t, r, n, i) {
  const a = Wr.dirname(r);
  Wp(a, (s, o) => {
    if (s) return i(s);
    if (o) return li(e, t, r, n, i);
    Xp(a, (l) => l ? i(l) : li(e, t, r, n, i));
  });
}
function $c(e, t, r, n, i, a) {
  Promise.resolve(i.filter(r, n)).then((s) => s ? e(t, r, n, i, a) : a(), (s) => a(s));
}
function Kp(e, t, r, n, i) {
  return n.filter ? $c(li, e, t, r, n, i) : li(e, t, r, n, i);
}
function li(e, t, r, n, i) {
  (n.dereference ? Le.stat : Le.lstat)(t, (s, o) => s ? i(s) : o.isDirectory() ? nh(o, e, t, r, n, i) : o.isFile() || o.isCharacterDevice() || o.isBlockDevice() ? Jp(o, e, t, r, n, i) : o.isSymbolicLink() ? sh(e, t, r, n, i) : o.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : o.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Jp(e, t, r, n, i, a) {
  return t ? Qp(e, r, n, i, a) : Lc(e, r, n, i, a);
}
function Qp(e, t, r, n, i) {
  if (n.overwrite)
    Le.unlink(r, (a) => a ? i(a) : Lc(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Lc(e, t, r, n, i) {
  Le.copyFile(t, r, (a) => a ? i(a) : n.preserveTimestamps ? Zp(e.mode, t, r, i) : Si(r, e.mode, i));
}
function Zp(e, t, r, n) {
  return eh(e) ? th(r, e, (i) => i ? n(i) : xo(e, t, r, n)) : xo(e, t, r, n);
}
function eh(e) {
  return (e & 128) === 0;
}
function th(e, t, r) {
  return Si(e, t | 128, r);
}
function xo(e, t, r, n) {
  rh(t, r, (i) => i ? n(i) : Si(r, e, n));
}
function Si(e, t, r) {
  return Le.chmod(e, t, r);
}
function rh(e, t, r) {
  Le.stat(e, (n, i) => n ? r(n) : Vp(t, i.atime, i.mtime, r));
}
function nh(e, t, r, n, i, a) {
  return t ? Uc(r, n, i, a) : ih(e.mode, r, n, i, a);
}
function ih(e, t, r, n, i) {
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
  return a ? ah(e, a, t, r, n, i) : i();
}
function ah(e, t, r, n, i, a) {
  const s = Wr.join(r, t), o = Wr.join(n, t);
  Vr.checkPaths(s, o, "copy", i, (l, p) => {
    if (l) return a(l);
    const { destStat: c } = p;
    Kp(c, s, o, i, (u) => u ? a(u) : Mc(e, r, n, i, a));
  });
}
function sh(e, t, r, n, i) {
  Le.readlink(t, (a, s) => {
    if (a) return i(a);
    if (n.dereference && (s = Wr.resolve(process.cwd(), s)), e)
      Le.readlink(r, (o, l) => o ? o.code === "EINVAL" || o.code === "UNKNOWN" ? Le.symlink(s, r, i) : i(o) : (n.dereference && (l = Wr.resolve(process.cwd(), l)), Vr.isSrcSubdir(s, l) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Vr.isSrcSubdir(l, s) ? i(new Error(`Cannot overwrite '${l}' with '${s}'.`)) : oh(s, r, i)));
    else
      return Le.symlink(s, r, i);
  });
}
function oh(e, t, r) {
  Le.unlink(t, (n) => n ? r(n) : Le.symlink(e, t, r));
}
var lh = Yp;
const Se = Ne, Yr = le, ch = ot.mkdirsSync, uh = kc.utimesMillisSync, Kr = br;
function fh(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Kr.checkPathsSync(e, t, "copy", r);
  return Kr.checkParentPathsSync(e, n, t, "copy"), dh(i, e, t, r);
}
function dh(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Yr.dirname(r);
  return Se.existsSync(i) || ch(i), Bc(e, t, r, n);
}
function ph(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Bc(e, t, r, n);
}
function Bc(e, t, r, n) {
  const a = (n.dereference ? Se.statSync : Se.lstatSync)(t);
  if (a.isDirectory()) return Eh(a, e, t, r, n);
  if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return hh(a, e, t, r, n);
  if (a.isSymbolicLink()) return _h(e, t, r, n);
  throw a.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function hh(e, t, r, n, i) {
  return t ? mh(e, r, n, i) : jc(e, r, n, i);
}
function mh(e, t, r, n) {
  if (n.overwrite)
    return Se.unlinkSync(r), jc(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function jc(e, t, r, n) {
  return Se.copyFileSync(t, r), n.preserveTimestamps && gh(e.mode, t, r), ms(r, e.mode);
}
function gh(e, t, r) {
  return yh(e) && xh(r, e), wh(t, r);
}
function yh(e) {
  return (e & 128) === 0;
}
function xh(e, t) {
  return ms(e, t | 128);
}
function ms(e, t) {
  return Se.chmodSync(e, t);
}
function wh(e, t) {
  const r = Se.statSync(e);
  return uh(t, r.atime, r.mtime);
}
function Eh(e, t, r, n, i) {
  return t ? zc(r, n, i) : vh(e.mode, r, n, i);
}
function vh(e, t, r, n) {
  return Se.mkdirSync(r), zc(t, r, n), ms(r, e);
}
function zc(e, t, r) {
  Se.readdirSync(e).forEach((n) => Th(n, e, t, r));
}
function Th(e, t, r, n) {
  const i = Yr.join(t, e), a = Yr.join(r, e), { destStat: s } = Kr.checkPathsSync(i, a, "copy", n);
  return ph(s, i, a, n);
}
function _h(e, t, r, n) {
  let i = Se.readlinkSync(t);
  if (n.dereference && (i = Yr.resolve(process.cwd(), i)), e) {
    let a;
    try {
      a = Se.readlinkSync(r);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Se.symlinkSync(i, r);
      throw s;
    }
    if (n.dereference && (a = Yr.resolve(process.cwd(), a)), Kr.isSrcSubdir(i, a))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);
    if (Se.statSync(r).isDirectory() && Kr.isSrcSubdir(a, i))
      throw new Error(`Cannot overwrite '${a}' with '${i}'.`);
    return bh(i, r);
  } else
    return Se.symlinkSync(i, r);
}
function bh(e, t) {
  return Se.unlinkSync(t), Se.symlinkSync(e, t);
}
var Sh = fh;
const Ah = ke.fromCallback;
var gs = {
  copy: Ah(lh),
  copySync: Sh
};
const wo = Ne, Gc = le, te = _c, Jr = process.platform === "win32";
function Hc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || wo[r], r = r + "Sync", e[r] = e[r] || wo[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function ys(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te.strictEqual(typeof r, "function", "rimraf: callback function required"), te(t, "rimraf: invalid options argument provided"), te.strictEqual(typeof t, "object", "rimraf: options should be object"), Hc(t), Eo(e, t, function i(a) {
    if (a) {
      if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const s = n * 100;
        return setTimeout(() => Eo(e, t, i), s);
      }
      a.code === "ENOENT" && (a = null);
    }
    r(a);
  });
}
function Eo(e, t, r) {
  te(e), te(t), te(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Jr)
      return vo(e, t, n, r);
    if (i && i.isDirectory())
      return ni(e, t, n, r);
    t.unlink(e, (a) => {
      if (a) {
        if (a.code === "ENOENT")
          return r(null);
        if (a.code === "EPERM")
          return Jr ? vo(e, t, a, r) : ni(e, t, a, r);
        if (a.code === "EISDIR")
          return ni(e, t, a, r);
      }
      return r(a);
    });
  });
}
function vo(e, t, r, n) {
  te(e), te(t), te(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (a, s) => {
      a ? n(a.code === "ENOENT" ? null : r) : s.isDirectory() ? ni(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function To(e, t, r) {
  let n;
  te(e), te(t);
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
  te(e), te(t), te(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Ih(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Ih(e, t, r) {
  te(e), te(t), te(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let a = i.length, s;
    if (a === 0) return t.rmdir(e, r);
    i.forEach((o) => {
      ys(Gc.join(e, o), t, (l) => {
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
  t = t || {}, Hc(t), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te(t, "rimraf: missing options"), te.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Jr && To(e, t, n);
  }
  try {
    r && r.isDirectory() ? ii(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Jr ? To(e, t, n) : ii(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    ii(e, t, n);
  }
}
function ii(e, t, r) {
  te(e), te(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      Ch(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Ch(e, t) {
  if (te(e), te(t), t.readdirSync(e).forEach((r) => qc(Gc.join(e, r), t)), Jr) {
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
var Rh = ys;
ys.sync = qc;
const ci = Ne, Oh = ke.fromCallback, Xc = Rh;
function Dh(e, t) {
  if (ci.rm) return ci.rm(e, { recursive: !0, force: !0 }, t);
  Xc(e, t);
}
function Ph(e) {
  if (ci.rmSync) return ci.rmSync(e, { recursive: !0, force: !0 });
  Xc.sync(e);
}
var Ai = {
  remove: Oh(Dh),
  removeSync: Ph
};
const kh = ke.fromPromise, Wc = Zt, Vc = le, Yc = ot, Kc = Ai, _o = kh(async function(t) {
  let r;
  try {
    r = await Wc.readdir(t);
  } catch {
    return Yc.mkdirs(t);
  }
  return Promise.all(r.map((n) => Kc.remove(Vc.join(t, n))));
});
function bo(e) {
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
var Nh = {
  emptyDirSync: bo,
  emptydirSync: bo,
  emptyDir: _o,
  emptydir: _o
};
const Fh = ke.fromCallback, Jc = le, Tt = Ne, Qc = ot;
function $h(e, t) {
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
function Lh(e) {
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
var Uh = {
  createFile: Fh($h),
  createFileSync: Lh
};
const Mh = ke.fromCallback, Zc = le, vt = Ne, eu = ot, Bh = er.pathExists, { areIdentical: tu } = br;
function jh(e, t, r) {
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
      Bh(l, (p, c) => {
        if (p) return r(p);
        if (c) return n(e, t);
        eu.mkdirs(l, (u) => {
          if (u) return r(u);
          n(e, t);
        });
      });
    });
  });
}
function zh(e, t) {
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
var Gh = {
  createLink: Mh(jh),
  createLinkSync: zh
};
const _t = le, Gr = Ne, Hh = er.pathExists;
function qh(e, t, r) {
  if (_t.isAbsolute(e))
    return Gr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = _t.dirname(t), i = _t.join(n, e);
    return Hh(i, (a, s) => a ? r(a) : s ? r(null, {
      toCwd: i,
      toDst: e
    }) : Gr.lstat(e, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), r(o)) : r(null, {
      toCwd: e,
      toDst: _t.relative(n, e)
    })));
  }
}
function Xh(e, t) {
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
var Wh = {
  symlinkPaths: qh,
  symlinkPathsSync: Xh
};
const ru = Ne;
function Vh(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  ru.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function Yh(e, t) {
  let r;
  if (t) return t;
  try {
    r = ru.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Kh = {
  symlinkType: Vh,
  symlinkTypeSync: Yh
};
const Jh = ke.fromCallback, nu = le, Ye = Zt, iu = ot, Qh = iu.mkdirs, Zh = iu.mkdirsSync, au = Wh, em = au.symlinkPaths, tm = au.symlinkPathsSync, su = Kh, rm = su.symlinkType, nm = su.symlinkTypeSync, im = er.pathExists, { areIdentical: ou } = br;
function am(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Ye.lstat(t, (i, a) => {
    !i && a.isSymbolicLink() ? Promise.all([
      Ye.stat(e),
      Ye.stat(t)
    ]).then(([s, o]) => {
      if (ou(s, o)) return n(null);
      So(e, t, r, n);
    }) : So(e, t, r, n);
  });
}
function So(e, t, r, n) {
  em(e, t, (i, a) => {
    if (i) return n(i);
    e = a.toDst, rm(a.toCwd, r, (s, o) => {
      if (s) return n(s);
      const l = nu.dirname(t);
      im(l, (p, c) => {
        if (p) return n(p);
        if (c) return Ye.symlink(e, t, o, n);
        Qh(l, (u) => {
          if (u) return n(u);
          Ye.symlink(e, t, o, n);
        });
      });
    });
  });
}
function sm(e, t, r) {
  let n;
  try {
    n = Ye.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const o = Ye.statSync(e), l = Ye.statSync(t);
    if (ou(o, l)) return;
  }
  const i = tm(e, t);
  e = i.toDst, r = nm(i.toCwd, r);
  const a = nu.dirname(t);
  return Ye.existsSync(a) || Zh(a), Ye.symlinkSync(e, t, r);
}
var om = {
  createSymlink: Jh(am),
  createSymlinkSync: sm
};
const { createFile: Ao, createFileSync: Io } = Uh, { createLink: Co, createLinkSync: Ro } = Gh, { createSymlink: Oo, createSymlinkSync: Do } = om;
var lm = {
  // file
  createFile: Ao,
  createFileSync: Io,
  ensureFile: Ao,
  ensureFileSync: Io,
  // link
  createLink: Co,
  createLinkSync: Ro,
  ensureLink: Co,
  ensureLinkSync: Ro,
  // symlink
  createSymlink: Oo,
  createSymlinkSync: Do,
  ensureSymlink: Oo,
  ensureSymlinkSync: Do
};
function cm(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const a = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + a;
}
function um(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var xs = { stringify: cm, stripBom: um };
let Er;
try {
  Er = Ne;
} catch {
  Er = Dt;
}
const Ii = ke, { stringify: lu, stripBom: cu } = xs;
async function fm(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Er, n = "throws" in t ? t.throws : !0;
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
const dm = Ii.fromPromise(fm);
function pm(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Er, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = cu(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function hm(e, t, r = {}) {
  const n = r.fs || Er, i = lu(t, r);
  await Ii.fromCallback(n.writeFile)(e, i, r);
}
const mm = Ii.fromPromise(hm);
function gm(e, t, r = {}) {
  const n = r.fs || Er, i = lu(t, r);
  return n.writeFileSync(e, i, r);
}
var ym = {
  readFile: dm,
  readFileSync: pm,
  writeFile: mm,
  writeFileSync: gm
};
const Fn = ym;
var xm = {
  // jsonfile exports
  readJson: Fn.readFile,
  readJsonSync: Fn.readFileSync,
  writeJson: Fn.writeFile,
  writeJsonSync: Fn.writeFileSync
};
const wm = ke.fromCallback, Hr = Ne, uu = le, fu = ot, Em = er.pathExists;
function vm(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = uu.dirname(e);
  Em(i, (a, s) => {
    if (a) return n(a);
    if (s) return Hr.writeFile(e, t, r, n);
    fu.mkdirs(i, (o) => {
      if (o) return n(o);
      Hr.writeFile(e, t, r, n);
    });
  });
}
function Tm(e, ...t) {
  const r = uu.dirname(e);
  if (Hr.existsSync(r))
    return Hr.writeFileSync(e, ...t);
  fu.mkdirsSync(r), Hr.writeFileSync(e, ...t);
}
var ws = {
  outputFile: wm(vm),
  outputFileSync: Tm
};
const { stringify: _m } = xs, { outputFile: bm } = ws;
async function Sm(e, t, r = {}) {
  const n = _m(t, r);
  await bm(e, n, r);
}
var Am = Sm;
const { stringify: Im } = xs, { outputFileSync: Cm } = ws;
function Rm(e, t, r) {
  const n = Im(t, r);
  Cm(e, n, r);
}
var Om = Rm;
const Dm = ke.fromPromise, Pe = xm;
Pe.outputJson = Dm(Am);
Pe.outputJsonSync = Om;
Pe.outputJSON = Pe.outputJson;
Pe.outputJSONSync = Pe.outputJsonSync;
Pe.writeJSON = Pe.writeJson;
Pe.writeJSONSync = Pe.writeJsonSync;
Pe.readJSON = Pe.readJson;
Pe.readJSONSync = Pe.readJsonSync;
var Pm = Pe;
const km = Ne, ja = le, Nm = gs.copy, du = Ai.remove, Fm = ot.mkdirp, $m = er.pathExists, Po = br;
function Lm(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Po.checkPaths(e, t, "move", r, (a, s) => {
    if (a) return n(a);
    const { srcStat: o, isChangingCase: l = !1 } = s;
    Po.checkParentPaths(e, o, t, "move", (p) => {
      if (p) return n(p);
      if (Um(t)) return ko(e, t, i, l, n);
      Fm(ja.dirname(t), (c) => c ? n(c) : ko(e, t, i, l, n));
    });
  });
}
function Um(e) {
  const t = ja.dirname(e);
  return ja.parse(t).root === t;
}
function ko(e, t, r, n, i) {
  if (n) return la(e, t, r, i);
  if (r)
    return du(t, (a) => a ? i(a) : la(e, t, r, i));
  $m(t, (a, s) => a ? i(a) : s ? i(new Error("dest already exists.")) : la(e, t, r, i));
}
function la(e, t, r, n) {
  km.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Mm(e, t, r, n) : n());
}
function Mm(e, t, r, n) {
  Nm(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (a) => a ? n(a) : du(e, n));
}
var Bm = Lm;
const pu = Ne, za = le, jm = gs.copySync, hu = Ai.removeSync, zm = ot.mkdirpSync, No = br;
function Gm(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: a = !1 } = No.checkPathsSync(e, t, "move", r);
  return No.checkParentPathsSync(e, i, t, "move"), Hm(t) || zm(za.dirname(t)), qm(e, t, n, a);
}
function Hm(e) {
  const t = za.dirname(e);
  return za.parse(t).root === t;
}
function qm(e, t, r, n) {
  if (n) return ca(e, t, r);
  if (r)
    return hu(t), ca(e, t, r);
  if (pu.existsSync(t)) throw new Error("dest already exists.");
  return ca(e, t, r);
}
function ca(e, t, r) {
  try {
    pu.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Xm(e, t, r);
  }
}
function Xm(e, t, r) {
  return jm(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), hu(e);
}
var Wm = Gm;
const Vm = ke.fromCallback;
var Ym = {
  move: Vm(Bm),
  moveSync: Wm
}, Pt = {
  // Export promiseified graceful-fs:
  ...Zt,
  // Export extra methods:
  ...gs,
  ...Nh,
  ...lm,
  ...Pm,
  ...ot,
  ...Ym,
  ...ws,
  ...er,
  ...Ai
}, pt = {}, At = {}, xe = {}, It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
It.CancellationError = It.CancellationToken = void 0;
const Km = bc;
class Jm extends Km.EventEmitter {
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
It.CancellationToken = Jm;
class Ga extends Error {
  constructor() {
    super("cancelled");
  }
}
It.CancellationError = Ga;
var Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.newError = Qm;
function Qm(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var De = {}, Ha = { exports: {} }, $n = { exports: {} }, ua, Fo;
function Zm() {
  if (Fo) return ua;
  Fo = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, a = n * 365.25;
  ua = function(c, u) {
    u = u || {};
    var d = typeof c;
    if (d === "string" && c.length > 0)
      return s(c);
    if (d === "number" && isFinite(c))
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
        var d = parseFloat(u[1]), m = (u[2] || "ms").toLowerCase();
        switch (m) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * a;
          case "weeks":
          case "week":
          case "w":
            return d * i;
          case "days":
          case "day":
          case "d":
            return d * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
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
    return u >= n ? p(c, u, n, "day") : u >= r ? p(c, u, r, "hour") : u >= t ? p(c, u, t, "minute") : u >= e ? p(c, u, e, "second") : c + " ms";
  }
  function p(c, u, d, m) {
    var w = u >= d * 1.5;
    return Math.round(c / d) + " " + m + (w ? "s" : "");
  }
  return ua;
}
var fa, $o;
function mu() {
  if ($o) return fa;
  $o = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = p, n.disable = o, n.enable = a, n.enabled = l, n.humanize = Zm(), n.destroy = c, Object.keys(t).forEach((u) => {
      n[u] = t[u];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(u) {
      let d = 0;
      for (let m = 0; m < u.length; m++)
        d = (d << 5) - d + u.charCodeAt(m), d |= 0;
      return n.colors[Math.abs(d) % n.colors.length];
    }
    n.selectColor = r;
    function n(u) {
      let d, m = null, w, x;
      function T(...b) {
        if (!T.enabled)
          return;
        const _ = T, k = Number(/* @__PURE__ */ new Date()), $ = k - (d || k);
        _.diff = $, _.prev = d, _.curr = k, d = k, b[0] = n.coerce(b[0]), typeof b[0] != "string" && b.unshift("%O");
        let Q = 0;
        b[0] = b[0].replace(/%([a-zA-Z%])/g, (Y, Me) => {
          if (Y === "%%")
            return "%";
          Q++;
          const y = n.formatters[Me];
          if (typeof y == "function") {
            const q = b[Q];
            Y = y.call(_, q), b.splice(Q, 1), Q--;
          }
          return Y;
        }), n.formatArgs.call(_, b), (_.log || n.log).apply(_, b);
      }
      return T.namespace = u, T.useColors = n.useColors(), T.color = n.selectColor(u), T.extend = i, T.destroy = n.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (w !== n.namespaces && (w = n.namespaces, x = n.enabled(u)), x),
        set: (b) => {
          m = b;
        }
      }), typeof n.init == "function" && n.init(T), T;
    }
    function i(u, d) {
      const m = n(this.namespace + (typeof d > "u" ? ":" : d) + u);
      return m.log = this.log, m;
    }
    function a(u) {
      n.save(u), n.namespaces = u, n.names = [], n.skips = [];
      const d = (typeof u == "string" ? u : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const m of d)
        m[0] === "-" ? n.skips.push(m.slice(1)) : n.names.push(m);
    }
    function s(u, d) {
      let m = 0, w = 0, x = -1, T = 0;
      for (; m < u.length; )
        if (w < d.length && (d[w] === u[m] || d[w] === "*"))
          d[w] === "*" ? (x = w, T = m, w++) : (m++, w++);
        else if (x !== -1)
          w = x + 1, T++, m = T;
        else
          return !1;
      for (; w < d.length && d[w] === "*"; )
        w++;
      return w === d.length;
    }
    function o() {
      const u = [
        ...n.names,
        ...n.skips.map((d) => "-" + d)
      ].join(",");
      return n.enable(""), u;
    }
    function l(u) {
      for (const d of n.skips)
        if (s(u, d))
          return !1;
      for (const d of n.names)
        if (s(u, d))
          return !0;
      return !1;
    }
    function p(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return fa = e, fa;
}
var Lo;
function e0() {
  return Lo || (Lo = 1, function(e, t) {
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
      const p = "color: " + this.color;
      l.splice(1, 0, p, "color: inherit");
      let c = 0, u = 0;
      l[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (c++, d === "%c" && (u = c));
      }), l.splice(u, 0, p);
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
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }($n, $n.exports)), $n.exports;
}
var Ln = { exports: {} }, da, Uo;
function t0() {
  return Uo || (Uo = 1, da = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), da;
}
var pa, Mo;
function r0() {
  if (Mo) return pa;
  Mo = 1;
  const e = _i, t = Sc, r = t0(), { env: n } = process;
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
  function s(l, p) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (l && !p && i === void 0)
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
    const p = s(l, l && l.isTTY);
    return a(p);
  }
  return pa = {
    supportsColor: o,
    stdout: a(s(!0, t.isatty(1))),
    stderr: a(s(!0, t.isatty(2)))
  }, pa;
}
var Bo;
function n0() {
  return Bo || (Bo = 1, function(e, t) {
    const r = Sc, n = us;
    t.init = c, t.log = o, t.formatArgs = a, t.save = l, t.load = p, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = r0();
      d && (d.stderr || d).level >= 2 && (t.colors = [
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
    t.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, m) => {
      const w = m.substring(6).toLowerCase().replace(/_([a-z])/g, (T, b) => b.toUpperCase());
      let x = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(x) ? x = !0 : /^(no|off|false|disabled)$/i.test(x) ? x = !1 : x === "null" ? x = null : x = Number(x), d[w] = x, d;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function a(d) {
      const { namespace: m, useColors: w } = this;
      if (w) {
        const x = this.color, T = "\x1B[3" + (x < 8 ? x : "8;5;" + x), b = `  ${T};1m${m} \x1B[0m`;
        d[0] = b + d[0].split(`
`).join(`
` + b), d.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = s() + m + " " + d[0];
    }
    function s() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function o(...d) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...d) + `
`);
    }
    function l(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function p() {
      return process.env.DEBUG;
    }
    function c(d) {
      d.inspectOpts = {};
      const m = Object.keys(t.inspectOpts);
      for (let w = 0; w < m.length; w++)
        d.inspectOpts[m[w]] = t.inspectOpts[m[w]];
    }
    e.exports = mu()(t);
    const { formatters: u } = e.exports;
    u.o = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, u.O = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts);
    };
  }(Ln, Ln.exports)), Ln.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Ha.exports = e0() : Ha.exports = n0();
var gu = Ha.exports;
const Ar = /* @__PURE__ */ wp(gu);
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.ProgressCallbackTransform = void 0;
const i0 = cn;
class a0 extends i0.Transform {
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
dn.ProgressCallbackTransform = a0;
Object.defineProperty(De, "__esModule", { value: !0 });
De.DigestTransform = De.HttpExecutor = De.HttpError = void 0;
De.createHttpError = qa;
De.parseJson = p0;
De.configureRequestOptionsFromUrl = xu;
De.configureRequestUrl = vs;
De.safeGetHeader = xr;
De.configureRequestOptions = fi;
De.safeStringifyJson = di;
const s0 = un, o0 = gu, l0 = Dt, c0 = cn, yu = _r, u0 = It, jo = Sr, f0 = dn, Nr = (0, o0.default)("electron-builder");
function qa(e, t = null) {
  return new Es(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + di(e.headers), t);
}
const d0 = /* @__PURE__ */ new Map([
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
class Es extends Error {
  constructor(t, r = `HTTP error: ${d0.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
De.HttpError = Es;
function p0(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class ui {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new u0.CancellationToken(), n) {
    fi(t);
    const i = n == null ? void 0 : JSON.stringify(n), a = i ? Buffer.from(i) : void 0;
    if (a != null) {
      Nr(i);
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
    return Nr.enabled && Nr(`Request: ${di(t)}`), r.createPromise((a, s, o) => {
      const l = this.createRequest(t, (p) => {
        try {
          this.handleResponse(p, t, r, a, s, i, n);
        } catch (c) {
          s(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, s, t.timeout), this.addRedirectHandlers(l, t, s, i, (p) => {
        this.doApiRequest(p, r, n, i).then(a).catch(s);
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
    if (Nr.enabled && Nr(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${di(r)}`), t.statusCode === 404) {
      a(qa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const p = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = p >= 300 && p < 400, u = xr(t, "location");
    if (c && u != null) {
      if (s > this.maxRedirects) {
        a(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(ui.prepareRedirectUrlOptions(u, r), n, o, s).then(i).catch(a);
      return;
    }
    t.setEncoding("utf8");
    let d = "";
    t.on("error", a), t.on("data", (m) => d += m), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const m = xr(t, "content-type"), w = m != null && (Array.isArray(m) ? m.find((x) => x.includes("json")) != null : m.includes("json"));
          a(qa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${w ? JSON.stringify(JSON.parse(d)) : d}
          `));
        } else
          i(d.length === 0 ? null : d);
      } catch (m) {
        a(m);
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
      vs(t, o), fi(o), this.doDownload(o, {
        destination: null,
        options: r,
        onCancel: a,
        callback: (l) => {
          l == null ? n(Buffer.concat(s)) : i(l);
        },
        responseHandler: (l, p) => {
          let c = 0;
          l.on("data", (u) => {
            if (c += u.length, c > 524288e3) {
              p(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            s.push(u);
          }), l.on("end", () => {
            p(null);
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
      const s = xr(a, "location");
      if (s != null) {
        n < this.maxRedirects ? this.doDownload(ui.prepareRedirectUrlOptions(s, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? m0(r, a) : r.responseHandler(a, r.callback);
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
        if (n < r && (i instanceof Es && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
De.HttpExecutor = ui;
function xu(e, t) {
  const r = fi(t);
  return vs(new yu.URL(e), r), r;
}
function vs(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Xa extends c0.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, s0.createHash)(r);
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
function h0(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function xr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function m0(e, t) {
  if (!h0(xr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const s = xr(t, "content-length");
    s != null && r.push(new f0.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Xa(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Xa(e.options.sha2, "sha256", "hex"));
  const i = (0, l0.createWriteStream)(e.destination);
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
class g0 {
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
Ci.MemoLazy = g0;
function wu(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), a = Object.keys(t);
    return i.length === a.length && i.every((s) => wu(e[s], t[s]));
  }
  return e === t;
}
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.githubUrl = y0;
Ri.getS3LikeProviderBaseUrl = x0;
function y0(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function x0(e) {
  const t = e.provider;
  if (t === "s3")
    return w0(e);
  if (t === "spaces")
    return E0(e);
  throw new Error(`Not supported provider: ${t}`);
}
function w0(e) {
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
function E0(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Eu(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.retry = vu;
const v0 = It;
async function vu(e, t, r, n = 0, i = 0, a) {
  var s;
  const o = new v0.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((s = a == null ? void 0 : a(l)) !== null && s !== void 0) || s) && t > 0 && !o.cancelled)
      return await new Promise((p) => setTimeout(p, r + n * i)), await vu(e, t - 1, r, n, i + 1, a);
    throw l;
  }
}
var _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.parseDn = T0;
function T0(e) {
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
var vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.nil = vr.UUID = void 0;
const Tu = un, _u = Sr, _0 = "options.name must be either a string or a Buffer", zo = (0, Tu.randomBytes)(16);
zo[0] = zo[0] | 1;
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
    return b0(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = S0(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (ai[t[14] + t[15]] & 240) >> 4,
        variant: Go((ai[t[19] + t[20]] & 224) >> 5),
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
        variant: Go((t[r + 8] & 224) >> 5),
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
vr.UUID = Jt;
Jt.OID = Jt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Go(e) {
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
function b0(e, t, r, n, i = qr.ASCII) {
  const a = (0, Tu.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, _u.newError)(_0, "ERR_INVALID_UUID_NAME");
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
function S0(e) {
  return V[e[0]] + V[e[1]] + V[e[2]] + V[e[3]] + "-" + V[e[4]] + V[e[5]] + "-" + V[e[6]] + V[e[7]] + "-" + V[e[8]] + V[e[9]] + "-" + V[e[10]] + V[e[11]] + V[e[12]] + V[e[13]] + V[e[14]] + V[e[15]];
}
vr.nil = new Jt("00000000-0000-0000-0000-000000000000");
var pn = {}, bu = {};
(function(e) {
  (function(t) {
    t.parser = function(h, f) {
      return new n(h, f);
    }, t.SAXParser = n, t.SAXStream = c, t.createStream = p, t.MAX_BUFFER_LENGTH = 64 * 1024;
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
      a(S), S.q = S.c = "", S.bufferCheckPosition = t.MAX_BUFFER_LENGTH, S.opt = f || {}, S.opt.lowercase = S.opt.lowercase || S.opt.lowercasetags, S.looseCase = S.opt.lowercase ? "toLowerCase" : "toUpperCase", S.tags = [], S.closed = S.closedRoot = S.sawRoot = !1, S.tag = S.error = null, S.strict = !!h, S.noscript = !!(h || S.opt.noscript), S.state = y.BEGIN, S.strictEntities = S.opt.strictEntities, S.ENTITIES = S.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), S.attribList = [], S.opt.xmlns && (S.ns = Object.create(x)), S.opt.unquotedAttributeValues === void 0 && (S.opt.unquotedAttributeValues = !h), S.trackPosition = S.opt.position !== !1, S.trackPosition && (S.position = S.line = S.column = 0), j(S, "onready");
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
        var ie = h[r[v]].length;
        if (ie > f)
          switch (r[v]) {
            case "textNode":
              Z(h);
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
        S = Math.max(S, ie);
      }
      var ce = t.MAX_BUFFER_LENGTH - S;
      h.bufferCheckPosition = ce + h.position;
    }
    function a(h) {
      for (var f = 0, S = r.length; f < S; f++)
        h[r[f]] = "";
    }
    function s(h) {
      Z(h), h.cdata !== "" && (B(h, "oncdata", h.cdata), h.cdata = ""), h.script !== "" && (B(h, "onscript", h.script), h.script = "");
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
    function p(h, f) {
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
          var f = gp.StringDecoder;
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
    var u = "[CDATA[", d = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", w = "http://www.w3.org/2000/xmlns/", x = { xml: m, xmlns: w }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, b = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, _ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, k = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function $(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function Q(h) {
      return h === '"' || h === "'";
    }
    function re(h) {
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
    function j(h, f, S) {
      h[f] && h[f](S);
    }
    function B(h, f, S) {
      h.textNode && Z(h), j(h, f, S);
    }
    function Z(h) {
      h.textNode = R(h.opt, h.textNode), h.textNode && j(h, "ontext", h.textNode), h.textNode = "";
    }
    function R(h, f) {
      return h.trim && (f = f.trim()), h.normalize && (f = f.replace(/\s+/g, " ")), f;
    }
    function I(h, f) {
      return Z(h), h.trackPosition && (f += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), f = new Error(f), h.error = f, j(h, "onerror", f), h;
    }
    function D(h) {
      return h.sawRoot && !h.closedRoot && A(h, "Unclosed root tag"), h.state !== y.BEGIN && h.state !== y.BEGIN_WHITESPACE && h.state !== y.TEXT && I(h, "Unexpected end"), Z(h), h.c = "", h.closed = !0, j(h, "onend"), n.call(h, h.strict, h.opt), h;
    }
    function A(h, f) {
      if (typeof h != "object" || !(h instanceof n))
        throw new Error("bad call to strictFail");
      h.strict && I(h, f);
    }
    function N(h) {
      h.strict || (h.tagName = h.tagName[h.looseCase]());
      var f = h.tags[h.tags.length - 1] || h, S = h.tag = { name: h.tagName, attributes: {} };
      h.opt.xmlns && (S.ns = f.ns), h.attribList.length = 0, B(h, "onopentagstart", S);
    }
    function O(h, f) {
      var S = h.indexOf(":"), v = S < 0 ? ["", h] : h.split(":"), K = v[0], ie = v[1];
      return f && h === "xmlns" && (K = "xmlns", ie = ""), { prefix: K, local: ie };
    }
    function M(h) {
      if (h.strict || (h.attribName = h.attribName[h.looseCase]()), h.attribList.indexOf(h.attribName) !== -1 || h.tag.attributes.hasOwnProperty(h.attribName)) {
        h.attribName = h.attribValue = "";
        return;
      }
      if (h.opt.xmlns) {
        var f = O(h.attribName, !0), S = f.prefix, v = f.local;
        if (S === "xmlns")
          if (v === "xml" && h.attribValue !== m)
            A(
              h,
              "xml: prefix must be bound to " + m + `
Actual: ` + h.attribValue
            );
          else if (v === "xmlns" && h.attribValue !== w)
            A(
              h,
              "xmlns: prefix must be bound to " + w + `
Actual: ` + h.attribValue
            );
          else {
            var K = h.tag, ie = h.tags[h.tags.length - 1] || h;
            K.ns === ie.ns && (K.ns = Object.create(ie.ns)), K.ns[v] = h.attribValue;
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
        for (var ie = 0, ce = h.attribList.length; ie < ce; ie++) {
          var we = h.attribList[ie], _e = we[0], ht = we[1], de = O(_e, !0), We = de.prefix, Ki = de.local, _n = We === "" ? "" : S.ns[We] || "", Rr = {
            name: _e,
            value: ht,
            prefix: We,
            local: Ki,
            uri: _n
          };
          We && We !== "xmlns" && !_n && (A(
            h,
            "Unbound namespace prefix: " + JSON.stringify(We)
          ), Rr.uri = We), h.tag.attributes[_e] = Rr, B(h, "onattribute", Rr);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!f, h.sawRoot = !0, h.tags.push(h.tag), B(h, "onopentag", h.tag), f || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = y.SCRIPT : h.state = y.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function z(h) {
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
      for (var ie = h.tags.length; ie-- > f; ) {
        var ce = h.tag = h.tags.pop();
        h.tagName = h.tag.name, B(h, "onclosetag", h.tagName);
        var we = {};
        for (var _e in ce.ns)
          we[_e] = ce.ns[_e];
        var ht = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && ce.ns !== ht.ns && Object.keys(ce.ns).forEach(function(de) {
          var We = ce.ns[de];
          B(h, "onclosenamespace", { prefix: de, uri: We });
        });
      }
      f === 0 && (h.closedRoot = !0), h.tagName = h.attribValue = h.attribName = "", h.attribList.length = 0, h.state = y.TEXT;
    }
    function ee(h) {
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
              for (var ie = S - 1; v && v !== "<" && v !== "&"; )
                v = U(h, S++), v && f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++);
              f.textNode += h.substring(ie, S - 1);
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
            f.doctype && f.doctype !== !0 && f.sgmlDecl ? (f.state = y.DOCTYPE_DTD, f.doctype += "<!" + f.sgmlDecl + v, f.sgmlDecl = "") : (f.sgmlDecl + v).toUpperCase() === u ? (B(f, "onopencdata"), f.state = y.CDATA, f.sgmlDecl = "", f.cdata = "") : (f.sgmlDecl + v).toUpperCase() === d ? (f.state = y.DOCTYPE, (f.doctype || f.sawRoot) && A(
              f,
              "Inappropriately located doctype declaration"
            ), f.doctype = "", f.sgmlDecl = "") : v === ">" ? (B(f, "onsgmldeclaration", f.sgmlDecl), f.sgmlDecl = "", f.state = y.TEXT) : (Q(v) && (f.state = y.SGML_DECL_QUOTED), f.sgmlDecl += v);
            continue;
          case y.SGML_DECL_QUOTED:
            v === f.q && (f.state = y.SGML_DECL, f.q = ""), f.sgmlDecl += v;
            continue;
          case y.DOCTYPE:
            v === ">" ? (f.state = y.TEXT, B(f, "ondoctype", f.doctype), f.doctype = !0) : (f.doctype += v, v === "[" ? f.state = y.DOCTYPE_DTD : Q(v) && (f.state = y.DOCTYPE_QUOTED, f.q = v));
            continue;
          case y.DOCTYPE_QUOTED:
            f.doctype += v, v === f.q && (f.q = "", f.state = y.DOCTYPE);
            continue;
          case y.DOCTYPE_DTD:
            v === "]" ? (f.doctype += v, f.state = y.DOCTYPE) : v === "<" ? (f.state = y.OPEN_WAKA, f.startTagPosition = f.position) : Q(v) ? (f.doctype += v, f.state = y.DOCTYPE_DTD_QUOTED, f.q = v) : f.doctype += v;
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
            for (var ie = S - 1; v && v !== "]"; )
              v = U(h, S++), v && f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++);
            f.cdata += h.substring(ie, S - 1), v === "]" && (f.state = y.CDATA_ENDING);
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
            Y(b, v) ? f.tagName += v : (N(f), v === ">" ? X(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : ($(v) || A(f, "Invalid character in tag name"), f.state = y.ATTRIB));
            continue;
          case y.OPEN_TAG_SLASH:
            v === ">" ? (X(f, !0), z(f)) : (A(
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
            v === "=" ? f.state = y.ATTRIB_VALUE : v === ">" ? (A(f, "Attribute without value"), f.attribValue = f.attribName, M(f), X(f)) : $(v) ? f.state = y.ATTRIB_NAME_SAW_WHITE : Y(b, v) ? f.attribName += v : A(f, "Invalid attribute name");
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
            Q(v) ? (f.q = v, f.state = y.ATTRIB_VALUE_QUOTED) : (f.opt.unquotedAttributeValues || I(f, "Unquoted attribute value"), f.state = y.ATTRIB_VALUE_UNQUOTED, f.attribValue = v);
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
            if (!re(v)) {
              v === "&" ? f.state = y.ATTRIB_VALUE_ENTITY_U : f.attribValue += v;
              continue;
            }
            M(f), v === ">" ? X(f) : f.state = y.ATTRIB;
            continue;
          case y.CLOSE_TAG:
            if (f.tagName)
              v === ">" ? z(f) : Y(b, v) ? f.tagName += v : f.script ? (f.script += "</" + f.tagName, f.tagName = "", f.state = y.SCRIPT) : ($(v) || A(f, "Invalid tagname in closing tag"), f.state = y.CLOSE_TAG_SAW_WHITE);
            else {
              if ($(v))
                continue;
              Me(T, v) ? f.script ? (f.script += "</" + v, f.state = y.SCRIPT) : A(f, "Invalid tagname in closing tag.") : f.tagName = v;
            }
            continue;
          case y.CLOSE_TAG_SAW_WHITE:
            if ($(v))
              continue;
            v === ">" ? z(f) : A(f, "Invalid characters in closing tag");
            continue;
          case y.TEXT_ENTITY:
          case y.ATTRIB_VALUE_ENTITY_Q:
          case y.ATTRIB_VALUE_ENTITY_U:
            var ce, we;
            switch (f.state) {
              case y.TEXT_ENTITY:
                ce = y.TEXT, we = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                ce = y.ATTRIB_VALUE_QUOTED, we = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                ce = y.ATTRIB_VALUE_UNQUOTED, we = "attribValue";
                break;
            }
            if (v === ";") {
              var _e = ee(f);
              f.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(_e) ? (f.entity = "", f.state = ce, f.write(_e)) : (f[we] += _e, f.entity = "", f.state = ce);
            } else Y(f.entity.length ? k : _, v) ? f.entity += v : (A(f, "Invalid character in entity name"), f[we] += "&" + f.entity + v, f.entity = "", f.state = ce);
            continue;
          default:
            throw new Error(f, "Unknown state: " + f.state);
        }
      return f.position >= f.bufferCheckPosition && i(f), f;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, f = Math.floor, S = function() {
        var v = 16384, K = [], ie, ce, we = -1, _e = arguments.length;
        if (!_e)
          return "";
        for (var ht = ""; ++we < _e; ) {
          var de = Number(arguments[we]);
          if (!isFinite(de) || // `NaN`, `+Infinity`, or `-Infinity`
          de < 0 || // not a valid Unicode code point
          de > 1114111 || // not a valid Unicode code point
          f(de) !== de)
            throw RangeError("Invalid code point: " + de);
          de <= 65535 ? K.push(de) : (de -= 65536, ie = (de >> 10) + 55296, ce = de % 1024 + 56320, K.push(ie, ce)), (we + 1 === _e || K.length > v) && (ht += h.apply(null, K), K.length = 0);
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
pn.parseXml = R0;
const A0 = bu, Un = Sr;
class Su {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Un.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!C0(t))
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
      if (Ho(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Ho(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
pn.XElement = Su;
const I0 = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function C0(e) {
  return I0.test(e);
}
function Ho(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function R0(e) {
  let t = null;
  const r = A0.parser(!0, {}), n = [];
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
  var r = Sr;
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
  var o = Ts;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return o.retry;
  } });
  var l = _s;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var p = vr;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return p.UUID;
  } });
  var c = pn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function u(d) {
    return d == null ? [] : Array.isArray(d) ? d : [d];
  }
})(xe);
var Te = {}, bs = {}, Je = {};
function Au(e) {
  return typeof e > "u" || e === null;
}
function O0(e) {
  return typeof e == "object" && e !== null;
}
function D0(e) {
  return Array.isArray(e) ? e : Au(e) ? [] : [e];
}
function P0(e, t) {
  var r, n, i, a;
  if (t)
    for (a = Object.keys(t), r = 0, n = a.length; r < n; r += 1)
      i = a[r], e[i] = t[i];
  return e;
}
function k0(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function N0(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Je.isNothing = Au;
Je.isObject = O0;
Je.toArray = D0;
Je.repeat = k0;
Je.isNegativeZero = N0;
Je.extend = P0;
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
function ha(e, t, r, n, i) {
  var a = "", s = "", o = Math.floor(i / 2) - 1;
  return n - t > o && (a = " ... ", t = n - o + a.length), r - n > o && (s = " ...", r = n + o - s.length), {
    str: a + e.slice(t, r).replace(/\t/g, "→") + s,
    pos: n - t + a.length
    // relative position
  };
}
function ma(e, t) {
  return Br.repeat(" ", t - e.length) + e;
}
function F0(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], a, s = -1; a = r.exec(e.buffer); )
    i.push(a.index), n.push(a.index + a[0].length), e.position <= a.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var o = "", l, p, c = Math.min(e.line + t.linesAfter, i.length).toString().length, u = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(s - l < 0); l++)
    p = ha(
      e.buffer,
      n[s - l],
      i[s - l],
      e.position - (n[s] - n[s - l]),
      u
    ), o = Br.repeat(" ", t.indent) + ma((e.line - l + 1).toString(), c) + " | " + p.str + `
` + o;
  for (p = ha(e.buffer, n[s], i[s], e.position, u), o += Br.repeat(" ", t.indent) + ma((e.line + 1).toString(), c) + " | " + p.str + `
`, o += Br.repeat("-", t.indent + c + 3 + p.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++)
    p = ha(
      e.buffer,
      n[s + l],
      i[s + l],
      e.position - (n[s] - n[s + l]),
      u
    ), o += Br.repeat(" ", t.indent) + ma((e.line + l + 1).toString(), c) + " | " + p.str + `
`;
  return o.replace(/\n$/, "");
}
var $0 = F0, qo = hn, L0 = [
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
], U0 = [
  "scalar",
  "sequence",
  "mapping"
];
function M0(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function B0(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (L0.indexOf(r) === -1)
      throw new qo('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = M0(t.styleAliases || null), U0.indexOf(this.kind) === -1)
    throw new qo('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Fe = B0, Fr = hn, ga = Fe;
function Xo(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(a, s) {
      a.tag === n.tag && a.kind === n.kind && a.multi === n.multi && (i = s);
    }), r[i] = n;
  }), r;
}
function j0() {
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
  if (t instanceof ga)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Fr("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(a) {
    if (!(a instanceof ga))
      throw new Fr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (a.loadKind && a.loadKind !== "scalar")
      throw new Fr("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (a.multi)
      throw new Fr("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(a) {
    if (!(a instanceof ga))
      throw new Fr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Wa.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Xo(i, "implicit"), i.compiledExplicit = Xo(i, "explicit"), i.compiledTypeMap = j0(i.compiledImplicit, i.compiledExplicit), i;
};
var Cu = Wa, z0 = Fe, Ru = new z0("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), G0 = Fe, Ou = new G0("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), H0 = Fe, Du = new H0("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), q0 = Cu, Pu = new q0({
  explicit: [
    Ru,
    Ou,
    Du
  ]
}), X0 = Fe;
function W0(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function V0() {
  return null;
}
function Y0(e) {
  return e === null;
}
var ku = new X0("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: W0,
  construct: V0,
  predicate: Y0,
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
}), K0 = Fe;
function J0(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Q0(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Z0(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Nu = new K0("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: J0,
  construct: Q0,
  predicate: Z0,
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
}), eg = Je, tg = Fe;
function rg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function ng(e) {
  return 48 <= e && e <= 55;
}
function ig(e) {
  return 48 <= e && e <= 57;
}
function ag(e) {
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
          if (!rg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!ng(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!ig(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function sg(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function og(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !eg.isNegativeZero(e);
}
var Fu = new tg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: ag,
  construct: sg,
  predicate: og,
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
}), $u = Je, lg = Fe, cg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function ug(e) {
  return !(e === null || !cg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function fg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var dg = /^[-+]?[0-9]+e/;
function pg(e, t) {
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
  return r = e.toString(10), dg.test(r) ? r.replace("e", ".e") : r;
}
function hg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || $u.isNegativeZero(e));
}
var Lu = new lg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: ug,
  construct: fg,
  predicate: hg,
  represent: pg,
  defaultStyle: "lowercase"
}), Uu = Pu.extend({
  implicit: [
    ku,
    Nu,
    Fu,
    Lu
  ]
}), Mu = Uu, mg = Fe, Bu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), ju = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function gg(e) {
  return e === null ? !1 : Bu.exec(e) !== null || ju.exec(e) !== null;
}
function yg(e) {
  var t, r, n, i, a, s, o, l = 0, p = null, c, u, d;
  if (t = Bu.exec(e), t === null && (t = ju.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (a = +t[4], s = +t[5], o = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], u = +(t[11] || 0), p = (c * 60 + u) * 6e4, t[9] === "-" && (p = -p)), d = new Date(Date.UTC(r, n, i, a, s, o, l)), p && d.setTime(d.getTime() - p), d;
}
function xg(e) {
  return e.toISOString();
}
var zu = new mg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: gg,
  construct: yg,
  instanceOf: Date,
  represent: xg
}), wg = Fe;
function Eg(e) {
  return e === "<<" || e === null;
}
var Gu = new wg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Eg
}), vg = Fe, Ss = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Tg(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, a = Ss;
  for (r = 0; r < i; r++)
    if (t = a.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function _g(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, a = Ss, s = 0, o = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (o.push(s >> 16 & 255), o.push(s >> 8 & 255), o.push(s & 255)), s = s << 6 | a.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (o.push(s >> 16 & 255), o.push(s >> 8 & 255), o.push(s & 255)) : r === 18 ? (o.push(s >> 10 & 255), o.push(s >> 2 & 255)) : r === 12 && o.push(s >> 4 & 255), new Uint8Array(o);
}
function bg(e) {
  var t = "", r = 0, n, i, a = e.length, s = Ss;
  for (n = 0; n < a; n++)
    n % 3 === 0 && n && (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]), r = (r << 8) + e[n];
  return i = a % 3, i === 0 ? (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]) : i === 2 ? (t += s[r >> 10 & 63], t += s[r >> 4 & 63], t += s[r << 2 & 63], t += s[64]) : i === 1 && (t += s[r >> 2 & 63], t += s[r << 4 & 63], t += s[64], t += s[64]), t;
}
function Sg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Hu = new vg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Tg,
  construct: _g,
  predicate: Sg,
  represent: bg
}), Ag = Fe, Ig = Object.prototype.hasOwnProperty, Cg = Object.prototype.toString;
function Rg(e) {
  if (e === null) return !0;
  var t = [], r, n, i, a, s, o = e;
  for (r = 0, n = o.length; r < n; r += 1) {
    if (i = o[r], s = !1, Cg.call(i) !== "[object Object]") return !1;
    for (a in i)
      if (Ig.call(i, a))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function Og(e) {
  return e !== null ? e : [];
}
var qu = new Ag("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Rg,
  construct: Og
}), Dg = Fe, Pg = Object.prototype.toString;
function kg(e) {
  if (e === null) return !0;
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1) {
    if (n = s[t], Pg.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    a[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function Ng(e) {
  if (e === null) return [];
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1)
    n = s[t], i = Object.keys(n), a[t] = [i[0], n[i[0]]];
  return a;
}
var Xu = new Dg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: kg,
  construct: Ng
}), Fg = Fe, $g = Object.prototype.hasOwnProperty;
function Lg(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if ($g.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Ug(e) {
  return e !== null ? e : {};
}
var Wu = new Fg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Lg,
  construct: Ug
}), As = Mu.extend({
  implicit: [
    zu,
    Gu
  ],
  explicit: [
    Hu,
    qu,
    Xu,
    Wu
  ]
}), Ht = Je, Vu = hn, Mg = $0, Bg = As, Ct = Object.prototype.hasOwnProperty, pi = 1, Yu = 2, Ku = 3, hi = 4, ya = 1, jg = 2, Wo = 3, zg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Gg = /[\x85\u2028\u2029]/, Hg = /[,\[\]\{\}]/, Ju = /^(?:!|!!|![a-z\-]+!)$/i, Qu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Vo(e) {
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
function fr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function qg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Xg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Wg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Yo(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Vg(e) {
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
for (var ir = 0; ir < 256; ir++)
  ef[ir] = Yo(ir) ? 1 : 0, tf[ir] = Yo(ir);
function Yg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Bg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
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
  return r.snippet = Mg(r), new Vu(t, r);
}
function L(e, t) {
  throw rf(e, t);
}
function mi(e, t) {
  e.onWarning && e.onWarning.call(null, rf(e, t));
}
var Ko = {
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
    else zg.test(o) && L(e, "the stream contains non-printable characters");
    e.result += o;
  }
}
function Jo(e, t, r, n) {
  var i, a, s, o;
  for (Ht.isObject(r) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), s = 0, o = i.length; s < o; s += 1)
    a = i[s], Ct.call(t, a) || (Zu(t, a, r[a]), n[a] = !0);
}
function dr(e, t, r, n, i, a, s, o, l) {
  var p, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), p = 0, c = i.length; p < c; p += 1)
      Array.isArray(i[p]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && Vo(i[p]) === "[object Object]" && (i[p] = "[object Object]");
  if (typeof i == "object" && Vo(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(a))
      for (p = 0, c = a.length; p < c; p += 1)
        Jo(e, t, a[p], r);
    else
      Jo(e, t, a, r);
  else
    !e.json && !Ct.call(r, i) && Ct.call(t, i) && (e.line = s || e.line, e.lineStart = o || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), Zu(t, i, a), delete r[i];
  return t;
}
function Is(e) {
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
      for (Is(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
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
function Cs(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Ht.repeat(`
`, t - 1));
}
function Kg(e, t, r) {
  var n, i, a, s, o, l, p, c, u = e.kind, d = e.result, m;
  if (m = e.input.charCodeAt(e.position), Ue(m) || fr(m) || m === 35 || m === 38 || m === 42 || m === 33 || m === 124 || m === 62 || m === 39 || m === 34 || m === 37 || m === 64 || m === 96 || (m === 63 || m === 45) && (i = e.input.charCodeAt(e.position + 1), Ue(i) || r && fr(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", a = s = e.position, o = !1; m !== 0; ) {
    if (m === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ue(i) || r && fr(i))
        break;
    } else if (m === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Ue(n))
        break;
    } else {
      if (e.position === e.lineStart && Oi(e) || r && fr(m))
        break;
      if (at(m))
        if (l = e.line, p = e.lineStart, c = e.lineIndent, fe(e, !1, -1), e.lineIndent >= t) {
          o = !0, m = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = p, e.lineIndent = c;
          break;
        }
    }
    o && (bt(e, a, s, !1), Cs(e, e.line - l), a = s = e.position, o = !1), Vt(m) || (s = e.position + 1), m = e.input.charCodeAt(++e.position);
  }
  return bt(e, a, s, !1), e.result ? !0 : (e.kind = u, e.result = d, !1);
}
function Jg(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (bt(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else at(r) ? (bt(e, n, i, !0), Cs(e, fe(e, !1, t)), n = i = e.position) : e.position === e.lineStart && Oi(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function Qg(e, t) {
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
      else if ((s = Xg(o)) > 0) {
        for (i = s, a = 0; i > 0; i--)
          o = e.input.charCodeAt(++e.position), (s = qg(o)) >= 0 ? a = (a << 4) + s : L(e, "expected hexadecimal character");
        e.result += Vg(a), e.position++;
      } else
        L(e, "unknown escape sequence");
      r = n = e.position;
    } else at(o) ? (bt(e, r, n, !0), Cs(e, fe(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Oi(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function Zg(e, t) {
  var r = !0, n, i, a, s = e.tag, o, l = e.anchor, p, c, u, d, m, w = /* @__PURE__ */ Object.create(null), x, T, b, _;
  if (_ = e.input.charCodeAt(e.position), _ === 91)
    c = 93, m = !1, o = [];
  else if (_ === 123)
    c = 125, m = !0, o = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), _ = e.input.charCodeAt(++e.position); _ !== 0; ) {
    if (fe(e, !0, t), _ = e.input.charCodeAt(e.position), _ === c)
      return e.position++, e.tag = s, e.anchor = l, e.kind = m ? "mapping" : "sequence", e.result = o, !0;
    r ? _ === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), T = x = b = null, u = d = !1, _ === 63 && (p = e.input.charCodeAt(e.position + 1), Ue(p) && (u = d = !0, e.position++, fe(e, !0, t))), n = e.line, i = e.lineStart, a = e.position, Tr(e, t, pi, !1, !0), T = e.tag, x = e.result, fe(e, !0, t), _ = e.input.charCodeAt(e.position), (d || e.line === n) && _ === 58 && (u = !0, _ = e.input.charCodeAt(++e.position), fe(e, !0, t), Tr(e, t, pi, !1, !0), b = e.result), m ? dr(e, o, w, T, x, b, n, i, a) : u ? o.push(dr(e, null, w, T, x, b, n, i, a)) : o.push(x), fe(e, !0, t), _ = e.input.charCodeAt(e.position), _ === 44 ? (r = !0, _ = e.input.charCodeAt(++e.position)) : r = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function ey(e, t) {
  var r, n, i = ya, a = !1, s = !1, o = t, l = 0, p = !1, c, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    n = !1;
  else if (u === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      ya === i ? i = u === 43 ? Wo : jg : L(e, "repeat of a chomping mode identifier");
    else if ((c = Wg(u)) >= 0)
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
    for (Is(e), e.lineIndent = 0, u = e.input.charCodeAt(e.position); (!s || e.lineIndent < o) && u === 32; )
      e.lineIndent++, u = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > o && (o = e.lineIndent), at(u)) {
      l++;
      continue;
    }
    if (e.lineIndent < o) {
      i === Wo ? e.result += Ht.repeat(`
`, a ? 1 + l : l) : i === ya && a && (e.result += `
`);
      break;
    }
    for (n ? Vt(u) ? (p = !0, e.result += Ht.repeat(`
`, a ? 1 + l : l)) : p ? (p = !1, e.result += Ht.repeat(`
`, l + 1)) : l === 0 ? a && (e.result += " ") : e.result += Ht.repeat(`
`, l) : e.result += Ht.repeat(`
`, a ? 1 + l : l), a = !0, s = !0, l = 0, r = e.position; !at(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    bt(e, r, e.position, !1);
  }
  return !0;
}
function Qo(e, t) {
  var r, n = e.tag, i = e.anchor, a = [], s, o = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !Ue(s)))); ) {
    if (o = !0, e.position++, fe(e, !0, -1) && e.lineIndent <= t) {
      a.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, Tr(e, t, Ku, !1, !0), a.push(e.result), fe(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return o ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function ty(e, t, r) {
  var n, i, a, s, o, l, p = e.tag, c = e.anchor, u = {}, d = /* @__PURE__ */ Object.create(null), m = null, w = null, x = null, T = !1, b = !1, _;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), _ = e.input.charCodeAt(e.position); _ !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), a = e.line, (_ === 63 || _ === 58) && Ue(n))
      _ === 63 ? (T && (dr(e, u, d, m, w, null, s, o, l), m = w = x = null), b = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, _ = n;
    else {
      if (s = e.line, o = e.lineStart, l = e.position, !Tr(e, r, Yu, !1, !0))
        break;
      if (e.line === a) {
        for (_ = e.input.charCodeAt(e.position); Vt(_); )
          _ = e.input.charCodeAt(++e.position);
        if (_ === 58)
          _ = e.input.charCodeAt(++e.position), Ue(_) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (dr(e, u, d, m, w, null, s, o, l), m = w = x = null), b = !0, T = !1, i = !1, m = e.tag, w = e.result;
        else if (b)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = p, e.anchor = c, !0;
      } else if (b)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = p, e.anchor = c, !0;
    }
    if ((e.line === a || e.lineIndent > t) && (T && (s = e.line, o = e.lineStart, l = e.position), Tr(e, t, hi, !0, i) && (T ? w = e.result : x = e.result), T || (dr(e, u, d, m, w, x, s, o, l), m = w = x = null), fe(e, !0, -1), _ = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && _ !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && dr(e, u, d, m, w, null, s, o, l), b && (e.tag = p, e.anchor = c, e.kind = "mapping", e.result = u), b;
}
function ry(e) {
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
    a = e.input.slice(t, e.position), Hg.test(a) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  a && !Qu.test(a) && L(e, "tag name cannot contain such characters: " + a);
  try {
    a = decodeURIComponent(a);
  } catch {
    L(e, "tag name is malformed: " + a);
  }
  return r ? e.tag = a : Ct.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function ny(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ue(r) && !fr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function iy(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ue(n) && !fr(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), Ct.call(e.anchorMap, r) || L(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], fe(e, !0, -1), !0;
}
function Tr(e, t, r, n, i) {
  var a, s, o, l = 1, p = !1, c = !1, u, d, m, w, x, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = s = o = hi === r || Ku === r, n && fe(e, !0, -1) && (p = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; ry(e) || ny(e); )
      fe(e, !0, -1) ? (p = !0, o = a, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : o = !1;
  if (o && (o = p || i), (l === 1 || hi === r) && (pi === r || Yu === r ? x = t : x = t + 1, T = e.position - e.lineStart, l === 1 ? o && (Qo(e, T) || ty(e, T, x)) || Zg(e, x) ? c = !0 : (s && ey(e, x) || Jg(e, x) || Qg(e, x) ? c = !0 : iy(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : Kg(e, x, pi === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = o && Qo(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, d = e.implicitTypes.length; u < d; u += 1)
      if (w = e.implicitTypes[u], w.resolve(e.result)) {
        e.result = w.construct(e.result), e.tag = w.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Ct.call(e.typeMap[e.kind || "fallback"], e.tag))
      w = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (w = null, m = e.typeMap.multi[e.kind || "fallback"], u = 0, d = m.length; u < d; u += 1)
        if (e.tag.slice(0, m[u].tag.length) === m[u].tag) {
          w = m[u];
          break;
        }
    w || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && w.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + w.kind + '", not "' + e.kind + '"'), w.resolve(e.result, e.tag) ? (e.result = w.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function ay(e) {
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
    s !== 0 && Is(e), Ct.call(Ko, n) ? Ko[n](e, n, i) : mi(e, 'unknown document directive "' + n + '"');
  }
  if (fe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, fe(e, !0, -1)) : a && L(e, "directives end mark is expected"), Tr(e, e.lineIndent - 1, hi, !1, !0), fe(e, !0, -1), e.checkLineBreaks && Gg.test(e.input.slice(t, e.position)) && mi(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Oi(e)) {
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
  var r = new Yg(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, L(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    ay(r);
  return r.documents;
}
function sy(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = nf(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, a = n.length; i < a; i += 1)
    t(n[i]);
}
function oy(e, t) {
  var r = nf(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new Vu("expected a single document in the stream, but found more");
  }
}
bs.loadAll = sy;
bs.load = oy;
var af = {}, Di = Je, mn = hn, ly = As, sf = Object.prototype.toString, of = Object.prototype.hasOwnProperty, Rs = 65279, cy = 9, Zr = 10, uy = 13, fy = 32, dy = 33, py = 34, Va = 35, hy = 37, my = 38, gy = 39, yy = 42, lf = 44, xy = 45, gi = 58, wy = 61, Ey = 62, vy = 63, Ty = 64, cf = 91, uf = 93, _y = 96, ff = 123, by = 124, df = 125, Ie = {};
Ie[0] = "\\0";
Ie[7] = "\\a";
Ie[8] = "\\b";
Ie[9] = "\\t";
Ie[10] = "\\n";
Ie[11] = "\\v";
Ie[12] = "\\f";
Ie[13] = "\\r";
Ie[27] = "\\e";
Ie[34] = '\\"';
Ie[92] = "\\\\";
Ie[133] = "\\N";
Ie[160] = "\\_";
Ie[8232] = "\\L";
Ie[8233] = "\\P";
var Sy = [
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
], Ay = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Iy(e, t) {
  var r, n, i, a, s, o, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, a = n.length; i < a; i += 1)
    s = n[i], o = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && of.call(l.styleAliases, o) && (o = l.styleAliases[o]), r[s] = o;
  return r;
}
function Cy(e) {
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
var Ry = 1, en = 2;
function Oy(e) {
  this.schema = e.schema || ly, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Di.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Iy(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? en : Ry, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Zo(e, t) {
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
function Dy(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function yi(e) {
  return e === fy || e === cy;
}
function tn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Rs || 65536 <= e && e <= 1114111;
}
function el(e) {
  return tn(e) && e !== Rs && e !== uy && e !== Zr;
}
function tl(e, t, r) {
  var n = el(e), i = n && !yi(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== lf && e !== cf && e !== uf && e !== ff && e !== df) && e !== Va && !(t === gi && !i) || el(t) && !yi(t) && e === Va || t === gi && i
  );
}
function Py(e) {
  return tn(e) && e !== Rs && !yi(e) && e !== xy && e !== vy && e !== gi && e !== lf && e !== cf && e !== uf && e !== ff && e !== df && e !== Va && e !== my && e !== yy && e !== dy && e !== by && e !== wy && e !== Ey && e !== gy && e !== py && e !== hy && e !== Ty && e !== _y;
}
function ky(e) {
  return !yi(e) && e !== gi;
}
function jr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function pf(e) {
  var t = /^\n* /;
  return t.test(e);
}
var hf = 1, Ka = 2, mf = 3, gf = 4, ur = 5;
function Ny(e, t, r, n, i, a, s, o) {
  var l, p = 0, c = null, u = !1, d = !1, m = n !== -1, w = -1, x = Py(jr(e, 0)) && ky(jr(e, e.length - 1));
  if (t || s)
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = jr(e, l), !tn(p))
        return ur;
      x = x && tl(p, c, o), c = p;
    }
  else {
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = jr(e, l), p === Zr)
        u = !0, m && (d = d || // Foldable line = too long, and not more-indented.
        l - w - 1 > n && e[w + 1] !== " ", w = l);
      else if (!tn(p))
        return ur;
      x = x && tl(p, c, o), c = p;
    }
    d = d || m && l - w - 1 > n && e[w + 1] !== " ";
  }
  return !u && !d ? x && !s && !i(e) ? hf : a === en ? ur : Ka : r > 9 && pf(e) ? ur : s ? a === en ? ur : Ka : d ? gf : mf;
}
function Fy(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === en ? '""' : "''";
    if (!e.noCompatMode && (Sy.indexOf(t) !== -1 || Ay.test(t)))
      return e.quotingType === en ? '"' + t + '"' : "'" + t + "'";
    var a = e.indent * Math.max(1, r), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), o = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(p) {
      return Dy(e, p);
    }
    switch (Ny(
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
        return "|" + rl(t, e.indent) + nl(Zo(t, a));
      case gf:
        return ">" + rl(t, e.indent) + nl(Zo($y(t, s), a));
      case ur:
        return '"' + Ly(t) + '"';
      default:
        throw new mn("impossible error: invalid scalar style");
    }
  }();
}
function rl(e, t) {
  var r = pf(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), a = i ? "+" : n ? "" : "-";
  return r + a + `
`;
}
function nl(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function $y(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var p = e.indexOf(`
`);
    return p = p !== -1 ? p : e.length, r.lastIndex = p, il(e.slice(0, p), t);
  }(), i = e[0] === `
` || e[0] === " ", a, s; s = r.exec(e); ) {
    var o = s[1], l = s[2];
    a = l[0] === " ", n += o + (!i && !a && l !== "" ? `
` : "") + il(l, t), i = a;
  }
  return n;
}
function il(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, a, s = 0, o = 0, l = ""; n = r.exec(e); )
    o = n.index, o - i > t && (a = s > i ? s : o, l += `
` + e.slice(i, a), i = a + 1), s = o;
  return l += `
`, e.length - i > t && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function Ly(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = jr(e, i), n = Ie[r], !n && tn(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || Cy(r);
  return t;
}
function Uy(e, t, r) {
  var n = "", i = e.tag, a, s, o;
  for (a = 0, s = r.length; a < s; a += 1)
    o = r[a], e.replacer && (o = e.replacer.call(r, String(a), o)), (dt(e, t, o, !1, !1) || typeof o > "u" && dt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function al(e, t, r, n) {
  var i = "", a = e.tag, s, o, l;
  for (s = 0, o = r.length; s < o; s += 1)
    l = r[s], e.replacer && (l = e.replacer.call(r, String(s), l)), (dt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && dt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Ya(e, t)), e.dump && Zr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = a, e.dump = i || "[]";
}
function My(e, t, r) {
  var n = "", i = e.tag, a = Object.keys(r), s, o, l, p, c;
  for (s = 0, o = a.length; s < o; s += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = a[s], p = r[l], e.replacer && (p = e.replacer.call(r, l, p)), dt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), dt(e, t, p, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function By(e, t, r, n) {
  var i = "", a = e.tag, s = Object.keys(r), o, l, p, c, u, d;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new mn("sortKeys must be a boolean or a function");
  for (o = 0, l = s.length; o < l; o += 1)
    d = "", (!n || i !== "") && (d += Ya(e, t)), p = s[o], c = r[p], e.replacer && (c = e.replacer.call(r, p, c)), dt(e, t + 1, p, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && Zr === e.dump.charCodeAt(0) ? d += "?" : d += "? "), d += e.dump, u && (d += Ya(e, t)), dt(e, t + 1, c, !0, u) && (e.dump && Zr === e.dump.charCodeAt(0) ? d += ":" : d += ": ", d += e.dump, i += d));
  e.tag = a, e.dump = i || "{}";
}
function sl(e, t, r) {
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
  e.tag = null, e.dump = r, sl(e, r, !1) || sl(e, r, !0);
  var o = sf.call(e.dump), l = n, p;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = o === "[object Object]" || o === "[object Array]", u, d;
  if (c && (u = e.duplicates.indexOf(r), d = u !== -1), (e.tag !== null && e.tag !== "?" || d || e.indent !== 2 && t > 0) && (i = !1), d && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (c && d && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), o === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (By(e, t, e.dump, i), d && (e.dump = "&ref_" + u + e.dump)) : (My(e, t, e.dump), d && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? al(e, t - 1, e.dump, i) : al(e, t, e.dump, i), d && (e.dump = "&ref_" + u + e.dump)) : (Uy(e, t, e.dump), d && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object String]")
      e.tag !== "?" && Fy(e, e.dump, t, a, l);
    else {
      if (o === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new mn("unacceptable kind of an object to dump " + o);
    }
    e.tag !== null && e.tag !== "?" && (p = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? p = "!" + p : p.slice(0, 18) === "tag:yaml.org,2002:" ? p = "!!" + p.slice(18) : p = "!<" + p + ">", e.dump = p + " " + e.dump);
  }
  return !0;
}
function jy(e, t) {
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
function zy(e, t) {
  t = t || {};
  var r = new Oy(t);
  r.noRefs || jy(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), dt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
af.dump = zy;
var yf = bs, Gy = af;
function Os(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Te.Type = Fe;
Te.Schema = Cu;
Te.FAILSAFE_SCHEMA = Pu;
Te.JSON_SCHEMA = Uu;
Te.CORE_SCHEMA = Mu;
Te.DEFAULT_SCHEMA = As;
Te.load = yf.load;
Te.loadAll = yf.loadAll;
Te.dump = Gy.dump;
Te.YAMLException = hn;
Te.types = {
  binary: Hu,
  float: Lu,
  map: Du,
  null: ku,
  pairs: Xu,
  set: Wu,
  timestamp: zu,
  bool: Nu,
  int: Fu,
  merge: Gu,
  omap: qu,
  seq: Ou,
  str: Ru
};
Te.safeLoad = Os("safeLoad", "load");
Te.safeLoadAll = Os("safeLoadAll", "loadAll");
Te.safeDump = Os("safeDump", "dump");
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.Lazy = void 0;
class Hy {
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
Pi.Lazy = Hy;
var Qa = { exports: {} };
const qy = "2.0.0", xf = 256, Xy = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Wy = 16, Vy = xf - 6, Yy = [
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
  MAX_SAFE_COMPONENT_LENGTH: Wy,
  MAX_SAFE_BUILD_LENGTH: Vy,
  MAX_SAFE_INTEGER: Xy,
  RELEASE_TYPES: Yy,
  SEMVER_SPEC_VERSION: qy,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Ky = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ni = Ky;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = ki, a = Ni;
  t = e.exports = {};
  const s = t.re = [], o = t.safeRe = [], l = t.src = [], p = t.safeSrc = [], c = t.t = {};
  let u = 0;
  const d = "[a-zA-Z0-9-]", m = [
    ["\\s", 1],
    ["\\d", i],
    [d, n]
  ], w = (T) => {
    for (const [b, _] of m)
      T = T.split(`${b}*`).join(`${b}{0,${_}}`).split(`${b}+`).join(`${b}{1,${_}}`);
    return T;
  }, x = (T, b, _) => {
    const k = w(b), $ = u++;
    a(T, $, b), c[T] = $, l[$] = b, p[$] = k, s[$] = new RegExp(b, _ ? "g" : void 0), o[$] = new RegExp(k, _ ? "g" : void 0);
  };
  x("NUMERICIDENTIFIER", "0|[1-9]\\d*"), x("NUMERICIDENTIFIERLOOSE", "\\d+"), x("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), x("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), x("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), x("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), x("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), x("BUILDIDENTIFIER", `${d}+`), x("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), x("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), x("FULL", `^${l[c.FULLPLAIN]}$`), x("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), x("LOOSE", `^${l[c.LOOSEPLAIN]}$`), x("GTLT", "((?:<|>)?=?)"), x("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), x("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), x("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), x("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), x("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), x("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), x("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), x("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), x("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), x("COERCERTL", l[c.COERCE], !0), x("COERCERTLFULL", l[c.COERCEFULL], !0), x("LONETILDE", "(?:~>?)"), x("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", x("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), x("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), x("LONECARET", "(?:\\^)"), x("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", x("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), x("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), x("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), x("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), x("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", x("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), x("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), x("STAR", "(<|>)?=?\\s*\\*"), x("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), x("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Qa, Qa.exports);
var gn = Qa.exports;
const Jy = Object.freeze({ loose: !0 }), Qy = Object.freeze({}), Zy = (e) => e ? typeof e != "object" ? Jy : e : Qy;
var Ds = Zy;
const ol = /^[0-9]+$/, wf = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = ol.test(e), n = ol.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, ex = (e, t) => wf(t, e);
var Ef = {
  compareIdentifiers: wf,
  rcompareIdentifiers: ex
};
const Mn = Ni, { MAX_LENGTH: ll, MAX_SAFE_INTEGER: Bn } = ki, { safeRe: jn, t: zn } = gn, tx = Ds, { compareIdentifiers: xa } = Ef;
let rx = class it {
  constructor(t, r) {
    if (r = tx(r), t instanceof it) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > ll)
      throw new TypeError(
        `version is longer than ${ll} characters`
      );
    Mn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? jn[zn.LOOSE] : jn[zn.FULL]);
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
      return xa(n, i);
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
      return xa(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? jn[zn.PRERELEASELOOSE] : jn[zn.PRERELEASE]);
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
          n === !1 && (a = [r]), xa(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var $e = rx;
const cl = $e, nx = (e, t, r = !1) => {
  if (e instanceof cl)
    return e;
  try {
    return new cl(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Ir = nx;
const ix = Ir, ax = (e, t) => {
  const r = ix(e, t);
  return r ? r.version : null;
};
var sx = ax;
const ox = Ir, lx = (e, t) => {
  const r = ox(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var cx = lx;
const ul = $e, ux = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new ul(
      e instanceof ul ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var fx = ux;
const fl = Ir, dx = (e, t) => {
  const r = fl(e, null, !0), n = fl(t, null, !0), i = r.compare(n);
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
var px = dx;
const hx = $e, mx = (e, t) => new hx(e, t).major;
var gx = mx;
const yx = $e, xx = (e, t) => new yx(e, t).minor;
var wx = xx;
const Ex = $e, vx = (e, t) => new Ex(e, t).patch;
var Tx = vx;
const _x = Ir, bx = (e, t) => {
  const r = _x(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Sx = bx;
const dl = $e, Ax = (e, t, r) => new dl(e, r).compare(new dl(t, r));
var Qe = Ax;
const Ix = Qe, Cx = (e, t, r) => Ix(t, e, r);
var Rx = Cx;
const Ox = Qe, Dx = (e, t) => Ox(e, t, !0);
var Px = Dx;
const pl = $e, kx = (e, t, r) => {
  const n = new pl(e, r), i = new pl(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Ps = kx;
const Nx = Ps, Fx = (e, t) => e.sort((r, n) => Nx(r, n, t));
var $x = Fx;
const Lx = Ps, Ux = (e, t) => e.sort((r, n) => Lx(n, r, t));
var Mx = Ux;
const Bx = Qe, jx = (e, t, r) => Bx(e, t, r) > 0;
var Fi = jx;
const zx = Qe, Gx = (e, t, r) => zx(e, t, r) < 0;
var ks = Gx;
const Hx = Qe, qx = (e, t, r) => Hx(e, t, r) === 0;
var vf = qx;
const Xx = Qe, Wx = (e, t, r) => Xx(e, t, r) !== 0;
var Tf = Wx;
const Vx = Qe, Yx = (e, t, r) => Vx(e, t, r) >= 0;
var Ns = Yx;
const Kx = Qe, Jx = (e, t, r) => Kx(e, t, r) <= 0;
var Fs = Jx;
const Qx = vf, Zx = Tf, ew = Fi, tw = Ns, rw = ks, nw = Fs, iw = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Qx(e, r, n);
    case "!=":
      return Zx(e, r, n);
    case ">":
      return ew(e, r, n);
    case ">=":
      return tw(e, r, n);
    case "<":
      return rw(e, r, n);
    case "<=":
      return nw(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var _f = iw;
const aw = $e, sw = Ir, { safeRe: Gn, t: Hn } = gn, ow = (e, t) => {
  if (e instanceof aw)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Gn[Hn.COERCEFULL] : Gn[Hn.COERCE]);
  else {
    const l = t.includePrerelease ? Gn[Hn.COERCERTLFULL] : Gn[Hn.COERCERTL];
    let p;
    for (; (p = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || p.index + p[0].length !== r.index + r[0].length) && (r = p), l.lastIndex = p.index + p[1].length + p[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", a = r[4] || "0", s = t.includePrerelease && r[5] ? `-${r[5]}` : "", o = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return sw(`${n}.${i}.${a}${s}${o}`, t);
};
var lw = ow;
class cw {
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
var uw = cw, wa, hl;
function Ze() {
  if (hl) return wa;
  hl = 1;
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
        if (this.set = this.set.filter((N) => !x(N[0])), this.set.length === 0)
          this.set = [A];
        else if (this.set.length > 1) {
          for (const N of this.set)
            if (N.length === 1 && T(N[0])) {
              this.set = [N];
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
      const A = ((this.options.includePrerelease && m) | (this.options.loose && w)) + ":" + I, N = n.get(A);
      if (N)
        return N;
      const O = this.options.loose, M = O ? l[p.HYPHENRANGELOOSE] : l[p.HYPHENRANGE];
      I = I.replace(M, B(this.options.includePrerelease)), s("hyphen replace", I), I = I.replace(l[p.COMPARATORTRIM], c), s("comparator trim", I), I = I.replace(l[p.TILDETRIM], u), s("tilde trim", I), I = I.replace(l[p.CARETTRIM], d), s("caret trim", I);
      let X = I.split(" ").map((U) => _(U, this.options)).join(" ").split(/\s+/).map((U) => j(U, this.options));
      O && (X = X.filter((U) => (s("loose invalid filter", U, this.options), !!U.match(l[p.COMPARATORLOOSE])))), s("range list", X);
      const z = /* @__PURE__ */ new Map(), ee = X.map((U) => new a(U, this.options));
      for (const U of ee) {
        if (x(U))
          return [U];
        z.set(U.value, U);
      }
      z.size > 1 && z.has("") && z.delete("");
      const he = [...z.values()];
      return n.set(A, he), he;
    }
    intersects(I, D) {
      if (!(I instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((A) => b(A, D) && I.set.some((N) => b(N, D) && A.every((O) => N.every((M) => O.intersects(M, D)))));
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
        if (Z(this.set[D], I, this.options))
          return !0;
      return !1;
    }
  }
  wa = t;
  const r = uw, n = new r(), i = Ds, a = $i(), s = Ni, o = $e, {
    safeRe: l,
    t: p,
    comparatorTrimReplace: c,
    tildeTrimReplace: u,
    caretTrimReplace: d
  } = gn, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: w } = ki, x = (R) => R.value === "<0.0.0-0", T = (R) => R.value === "", b = (R, I) => {
    let D = !0;
    const A = R.slice();
    let N = A.pop();
    for (; D && A.length; )
      D = A.every((O) => N.intersects(O, I)), N = A.pop();
    return D;
  }, _ = (R, I) => (R = R.replace(l[p.BUILD], ""), s("comp", R, I), R = re(R, I), s("caret", R), R = $(R, I), s("tildes", R), R = Me(R, I), s("xrange", R), R = q(R, I), s("stars", R), R), k = (R) => !R || R.toLowerCase() === "x" || R === "*", $ = (R, I) => R.trim().split(/\s+/).map((D) => Q(D, I)).join(" "), Q = (R, I) => {
    const D = I.loose ? l[p.TILDELOOSE] : l[p.TILDE];
    return R.replace(D, (A, N, O, M, X) => {
      s("tilde", R, A, N, O, M, X);
      let z;
      return k(N) ? z = "" : k(O) ? z = `>=${N}.0.0 <${+N + 1}.0.0-0` : k(M) ? z = `>=${N}.${O}.0 <${N}.${+O + 1}.0-0` : X ? (s("replaceTilde pr", X), z = `>=${N}.${O}.${M}-${X} <${N}.${+O + 1}.0-0`) : z = `>=${N}.${O}.${M} <${N}.${+O + 1}.0-0`, s("tilde return", z), z;
    });
  }, re = (R, I) => R.trim().split(/\s+/).map((D) => Y(D, I)).join(" "), Y = (R, I) => {
    s("caret", R, I);
    const D = I.loose ? l[p.CARETLOOSE] : l[p.CARET], A = I.includePrerelease ? "-0" : "";
    return R.replace(D, (N, O, M, X, z) => {
      s("caret", R, N, O, M, X, z);
      let ee;
      return k(O) ? ee = "" : k(M) ? ee = `>=${O}.0.0${A} <${+O + 1}.0.0-0` : k(X) ? O === "0" ? ee = `>=${O}.${M}.0${A} <${O}.${+M + 1}.0-0` : ee = `>=${O}.${M}.0${A} <${+O + 1}.0.0-0` : z ? (s("replaceCaret pr", z), O === "0" ? M === "0" ? ee = `>=${O}.${M}.${X}-${z} <${O}.${M}.${+X + 1}-0` : ee = `>=${O}.${M}.${X}-${z} <${O}.${+M + 1}.0-0` : ee = `>=${O}.${M}.${X}-${z} <${+O + 1}.0.0-0`) : (s("no pr"), O === "0" ? M === "0" ? ee = `>=${O}.${M}.${X}${A} <${O}.${M}.${+X + 1}-0` : ee = `>=${O}.${M}.${X}${A} <${O}.${+M + 1}.0-0` : ee = `>=${O}.${M}.${X} <${+O + 1}.0.0-0`), s("caret return", ee), ee;
    });
  }, Me = (R, I) => (s("replaceXRanges", R, I), R.split(/\s+/).map((D) => y(D, I)).join(" ")), y = (R, I) => {
    R = R.trim();
    const D = I.loose ? l[p.XRANGELOOSE] : l[p.XRANGE];
    return R.replace(D, (A, N, O, M, X, z) => {
      s("xRange", R, A, N, O, M, X, z);
      const ee = k(O), he = ee || k(M), U = he || k(X), et = U;
      return N === "=" && et && (N = ""), z = I.includePrerelease ? "-0" : "", ee ? N === ">" || N === "<" ? A = "<0.0.0-0" : A = "*" : N && et ? (he && (M = 0), X = 0, N === ">" ? (N = ">=", he ? (O = +O + 1, M = 0, X = 0) : (M = +M + 1, X = 0)) : N === "<=" && (N = "<", he ? O = +O + 1 : M = +M + 1), N === "<" && (z = "-0"), A = `${N + O}.${M}.${X}${z}`) : he ? A = `>=${O}.0.0${z} <${+O + 1}.0.0-0` : U && (A = `>=${O}.${M}.0${z} <${O}.${+M + 1}.0-0`), s("xRange return", A), A;
    });
  }, q = (R, I) => (s("replaceStars", R, I), R.trim().replace(l[p.STAR], "")), j = (R, I) => (s("replaceGTE0", R, I), R.trim().replace(l[I.includePrerelease ? p.GTE0PRE : p.GTE0], "")), B = (R) => (I, D, A, N, O, M, X, z, ee, he, U, et) => (k(A) ? D = "" : k(N) ? D = `>=${A}.0.0${R ? "-0" : ""}` : k(O) ? D = `>=${A}.${N}.0${R ? "-0" : ""}` : M ? D = `>=${D}` : D = `>=${D}${R ? "-0" : ""}`, k(ee) ? z = "" : k(he) ? z = `<${+ee + 1}.0.0-0` : k(U) ? z = `<${ee}.${+he + 1}.0-0` : et ? z = `<=${ee}.${he}.${U}-${et}` : R ? z = `<${ee}.${he}.${+U + 1}-0` : z = `<=${z}`, `${D} ${z}`.trim()), Z = (R, I, D) => {
    for (let A = 0; A < R.length; A++)
      if (!R[A].test(I))
        return !1;
    if (I.prerelease.length && !D.includePrerelease) {
      for (let A = 0; A < R.length; A++)
        if (s(R[A].semver), R[A].semver !== a.ANY && R[A].semver.prerelease.length > 0) {
          const N = R[A].semver;
          if (N.major === I.major && N.minor === I.minor && N.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return wa;
}
var Ea, ml;
function $i() {
  if (ml) return Ea;
  ml = 1;
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
      const u = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], d = c.match(u);
      if (!d)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new o(d[2], this.options.loose) : this.semver = e;
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
  Ea = t;
  const r = Ds, { safeRe: n, t: i } = gn, a = _f, s = Ni, o = $e, l = Ze();
  return Ea;
}
const fw = Ze(), dw = (e, t, r) => {
  try {
    t = new fw(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Li = dw;
const pw = Ze(), hw = (e, t) => new pw(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var mw = hw;
const gw = $e, yw = Ze(), xw = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new yw(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === -1) && (n = s, i = new gw(n, r));
  }), n;
};
var ww = xw;
const Ew = $e, vw = Ze(), Tw = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new vw(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === 1) && (n = s, i = new Ew(n, r));
  }), n;
};
var _w = Tw;
const va = $e, bw = Ze(), gl = Fi, Sw = (e, t) => {
  e = new bw(e, t);
  let r = new va("0.0.0");
  if (e.test(r) || (r = new va("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let a = null;
    i.forEach((s) => {
      const o = new va(s.semver.version);
      switch (s.operator) {
        case ">":
          o.prerelease.length === 0 ? o.patch++ : o.prerelease.push(0), o.raw = o.format();
        case "":
        case ">=":
          (!a || gl(o, a)) && (a = o);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), a && (!r || gl(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var Aw = Sw;
const Iw = Ze(), Cw = (e, t) => {
  try {
    return new Iw(e, t).range || "*";
  } catch {
    return null;
  }
};
var Rw = Cw;
const Ow = $e, bf = $i(), { ANY: Dw } = bf, Pw = Ze(), kw = Li, yl = Fi, xl = ks, Nw = Fs, Fw = Ns, $w = (e, t, r, n) => {
  e = new Ow(e, n), t = new Pw(t, n);
  let i, a, s, o, l;
  switch (r) {
    case ">":
      i = yl, a = Nw, s = xl, o = ">", l = ">=";
      break;
    case "<":
      i = xl, a = Fw, s = yl, o = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (kw(e, t, n))
    return !1;
  for (let p = 0; p < t.set.length; ++p) {
    const c = t.set[p];
    let u = null, d = null;
    if (c.forEach((m) => {
      m.semver === Dw && (m = new bf(">=0.0.0")), u = u || m, d = d || m, i(m.semver, u.semver, n) ? u = m : s(m.semver, d.semver, n) && (d = m);
    }), u.operator === o || u.operator === l || (!d.operator || d.operator === o) && a(e, d.semver))
      return !1;
    if (d.operator === l && s(e, d.semver))
      return !1;
  }
  return !0;
};
var $s = $w;
const Lw = $s, Uw = (e, t, r) => Lw(e, t, ">", r);
var Mw = Uw;
const Bw = $s, jw = (e, t, r) => Bw(e, t, "<", r);
var zw = jw;
const wl = Ze(), Gw = (e, t, r) => (e = new wl(e, r), t = new wl(t, r), e.intersects(t, r));
var Hw = Gw;
const qw = Li, Xw = Qe;
var Ww = (e, t, r) => {
  const n = [];
  let i = null, a = null;
  const s = e.sort((c, u) => Xw(c, u, r));
  for (const c of s)
    qw(c, t, r) ? (a = c, i || (i = c)) : (a && n.push([i, a]), a = null, i = null);
  i && n.push([i, null]);
  const o = [];
  for (const [c, u] of n)
    c === u ? o.push(c) : !u && c === s[0] ? o.push("*") : u ? c === s[0] ? o.push(`<=${u}`) : o.push(`${c} - ${u}`) : o.push(`>=${c}`);
  const l = o.join(" || "), p = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < p.length ? l : t;
};
const El = Ze(), Ls = $i(), { ANY: Ta } = Ls, $r = Li, Us = Qe, Vw = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new El(e, r), t = new El(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const a of t.set) {
      const s = Kw(i, a, r);
      if (n = n || s !== null, s)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Yw = [new Ls(">=0.0.0-0")], vl = [new Ls(">=0.0.0")], Kw = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Ta) {
    if (t.length === 1 && t[0].semver === Ta)
      return !0;
    r.includePrerelease ? e = Yw : e = vl;
  }
  if (t.length === 1 && t[0].semver === Ta) {
    if (r.includePrerelease)
      return !0;
    t = vl;
  }
  const n = /* @__PURE__ */ new Set();
  let i, a;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? i = Tl(i, m, r) : m.operator === "<" || m.operator === "<=" ? a = _l(a, m, r) : n.add(m.semver);
  if (n.size > 1)
    return null;
  let s;
  if (i && a) {
    if (s = Us(i.semver, a.semver, r), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const m of n) {
    if (i && !$r(m, String(i), r) || a && !$r(m, String(a), r))
      return null;
    for (const w of t)
      if (!$r(m, String(w), r))
        return !1;
    return !0;
  }
  let o, l, p, c, u = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, d = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && a.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const m of t) {
    if (c = c || m.operator === ">" || m.operator === ">=", p = p || m.operator === "<" || m.operator === "<=", i) {
      if (d && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === d.major && m.semver.minor === d.minor && m.semver.patch === d.patch && (d = !1), m.operator === ">" || m.operator === ">=") {
        if (o = Tl(i, m, r), o === m && o !== i)
          return !1;
      } else if (i.operator === ">=" && !$r(i.semver, String(m), r))
        return !1;
    }
    if (a) {
      if (u && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === u.major && m.semver.minor === u.minor && m.semver.patch === u.patch && (u = !1), m.operator === "<" || m.operator === "<=") {
        if (l = _l(a, m, r), l === m && l !== a)
          return !1;
      } else if (a.operator === "<=" && !$r(a.semver, String(m), r))
        return !1;
    }
    if (!m.operator && (a || i) && s !== 0)
      return !1;
  }
  return !(i && p && !a && s !== 0 || a && c && !i && s !== 0 || d || u);
}, Tl = (e, t, r) => {
  if (!e)
    return t;
  const n = Us(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, _l = (e, t, r) => {
  if (!e)
    return t;
  const n = Us(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Jw = Vw;
const _a = gn, bl = ki, Qw = $e, Sl = Ef, Zw = Ir, eE = sx, tE = cx, rE = fx, nE = px, iE = gx, aE = wx, sE = Tx, oE = Sx, lE = Qe, cE = Rx, uE = Px, fE = Ps, dE = $x, pE = Mx, hE = Fi, mE = ks, gE = vf, yE = Tf, xE = Ns, wE = Fs, EE = _f, vE = lw, TE = $i(), _E = Ze(), bE = Li, SE = mw, AE = ww, IE = _w, CE = Aw, RE = Rw, OE = $s, DE = Mw, PE = zw, kE = Hw, NE = Ww, FE = Jw;
var Sf = {
  parse: Zw,
  valid: eE,
  clean: tE,
  inc: rE,
  diff: nE,
  major: iE,
  minor: aE,
  patch: sE,
  prerelease: oE,
  compare: lE,
  rcompare: cE,
  compareLoose: uE,
  compareBuild: fE,
  sort: dE,
  rsort: pE,
  gt: hE,
  lt: mE,
  eq: gE,
  neq: yE,
  gte: xE,
  lte: wE,
  cmp: EE,
  coerce: vE,
  Comparator: TE,
  Range: _E,
  satisfies: bE,
  toComparators: SE,
  maxSatisfying: AE,
  minSatisfying: IE,
  minVersion: CE,
  validRange: RE,
  outside: OE,
  gtr: DE,
  ltr: PE,
  intersects: kE,
  simplifyRange: NE,
  subset: FE,
  SemVer: Qw,
  re: _a.re,
  src: _a.src,
  tokens: _a.t,
  SEMVER_SPEC_VERSION: bl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: bl.RELEASE_TYPES,
  compareIdentifiers: Sl.compareIdentifiers,
  rcompareIdentifiers: Sl.rcompareIdentifiers
}, yn = {}, xi = { exports: {} };
xi.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, a = 2, s = 9007199254740991, o = "[object Arguments]", l = "[object Array]", p = "[object AsyncFunction]", c = "[object Boolean]", u = "[object Date]", d = "[object Error]", m = "[object Function]", w = "[object GeneratorFunction]", x = "[object Map]", T = "[object Number]", b = "[object Null]", _ = "[object Object]", k = "[object Promise]", $ = "[object Proxy]", Q = "[object RegExp]", re = "[object Set]", Y = "[object String]", Me = "[object Symbol]", y = "[object Undefined]", q = "[object WeakMap]", j = "[object ArrayBuffer]", B = "[object DataView]", Z = "[object Float32Array]", R = "[object Float64Array]", I = "[object Int8Array]", D = "[object Int16Array]", A = "[object Int32Array]", N = "[object Uint8Array]", O = "[object Uint8ClampedArray]", M = "[object Uint16Array]", X = "[object Uint32Array]", z = /[\\^$.*+?()[\]{}|]/g, ee = /^\[object .+?Constructor\]$/, he = /^(?:0|[1-9]\d*)$/, U = {};
  U[Z] = U[R] = U[I] = U[D] = U[A] = U[N] = U[O] = U[M] = U[X] = !0, U[o] = U[l] = U[j] = U[c] = U[B] = U[u] = U[d] = U[m] = U[x] = U[T] = U[_] = U[Q] = U[re] = U[Y] = U[q] = !1;
  var et = typeof Oe == "object" && Oe && Oe.Object === Object && Oe, h = typeof self == "object" && self && self.Object === Object && self, f = et || h || Function("return this")(), S = t && !t.nodeType && t, v = S && !0 && e && !e.nodeType && e, K = v && v.exports === S, ie = K && et.process, ce = function() {
    try {
      return ie && ie.binding && ie.binding("util");
    } catch {
    }
  }(), we = ce && ce.isTypedArray;
  function _e(g, E) {
    for (var C = -1, F = g == null ? 0 : g.length, ae = 0, H = []; ++C < F; ) {
      var ue = g[C];
      E(ue, C, g) && (H[ae++] = ue);
    }
    return H;
  }
  function ht(g, E) {
    for (var C = -1, F = E.length, ae = g.length; ++C < F; )
      g[ae + C] = E[C];
    return g;
  }
  function de(g, E) {
    for (var C = -1, F = g == null ? 0 : g.length; ++C < F; )
      if (E(g[C], C, g))
        return !0;
    return !1;
  }
  function We(g, E) {
    for (var C = -1, F = Array(g); ++C < g; )
      F[C] = E(C);
    return F;
  }
  function Ki(g) {
    return function(E) {
      return g(E);
    };
  }
  function _n(g, E) {
    return g.has(E);
  }
  function Rr(g, E) {
    return g == null ? void 0 : g[E];
  }
  function bn(g) {
    var E = -1, C = Array(g.size);
    return g.forEach(function(F, ae) {
      C[++E] = [ae, F];
    }), C;
  }
  function ld(g, E) {
    return function(C) {
      return g(E(C));
    };
  }
  function cd(g) {
    var E = -1, C = Array(g.size);
    return g.forEach(function(F) {
      C[++E] = F;
    }), C;
  }
  var ud = Array.prototype, fd = Function.prototype, Sn = Object.prototype, Ji = f["__core-js_shared__"], Vs = fd.toString, tt = Sn.hasOwnProperty, Ys = function() {
    var g = /[^.]+$/.exec(Ji && Ji.keys && Ji.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Ks = Sn.toString, dd = RegExp(
    "^" + Vs.call(tt).replace(z, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Js = K ? f.Buffer : void 0, An = f.Symbol, Qs = f.Uint8Array, Zs = Sn.propertyIsEnumerable, pd = ud.splice, Nt = An ? An.toStringTag : void 0, eo = Object.getOwnPropertySymbols, hd = Js ? Js.isBuffer : void 0, md = ld(Object.keys, Object), Qi = rr(f, "DataView"), Or = rr(f, "Map"), Zi = rr(f, "Promise"), ea = rr(f, "Set"), ta = rr(f, "WeakMap"), Dr = rr(Object, "create"), gd = Lt(Qi), yd = Lt(Or), xd = Lt(Zi), wd = Lt(ea), Ed = Lt(ta), to = An ? An.prototype : void 0, ra = to ? to.valueOf : void 0;
  function Ft(g) {
    var E = -1, C = g == null ? 0 : g.length;
    for (this.clear(); ++E < C; ) {
      var F = g[E];
      this.set(F[0], F[1]);
    }
  }
  function vd() {
    this.__data__ = Dr ? Dr(null) : {}, this.size = 0;
  }
  function Td(g) {
    var E = this.has(g) && delete this.__data__[g];
    return this.size -= E ? 1 : 0, E;
  }
  function _d(g) {
    var E = this.__data__;
    if (Dr) {
      var C = E[g];
      return C === n ? void 0 : C;
    }
    return tt.call(E, g) ? E[g] : void 0;
  }
  function bd(g) {
    var E = this.__data__;
    return Dr ? E[g] !== void 0 : tt.call(E, g);
  }
  function Sd(g, E) {
    var C = this.__data__;
    return this.size += this.has(g) ? 0 : 1, C[g] = Dr && E === void 0 ? n : E, this;
  }
  Ft.prototype.clear = vd, Ft.prototype.delete = Td, Ft.prototype.get = _d, Ft.prototype.has = bd, Ft.prototype.set = Sd;
  function lt(g) {
    var E = -1, C = g == null ? 0 : g.length;
    for (this.clear(); ++E < C; ) {
      var F = g[E];
      this.set(F[0], F[1]);
    }
  }
  function Ad() {
    this.__data__ = [], this.size = 0;
  }
  function Id(g) {
    var E = this.__data__, C = Cn(E, g);
    if (C < 0)
      return !1;
    var F = E.length - 1;
    return C == F ? E.pop() : pd.call(E, C, 1), --this.size, !0;
  }
  function Cd(g) {
    var E = this.__data__, C = Cn(E, g);
    return C < 0 ? void 0 : E[C][1];
  }
  function Rd(g) {
    return Cn(this.__data__, g) > -1;
  }
  function Od(g, E) {
    var C = this.__data__, F = Cn(C, g);
    return F < 0 ? (++this.size, C.push([g, E])) : C[F][1] = E, this;
  }
  lt.prototype.clear = Ad, lt.prototype.delete = Id, lt.prototype.get = Cd, lt.prototype.has = Rd, lt.prototype.set = Od;
  function $t(g) {
    var E = -1, C = g == null ? 0 : g.length;
    for (this.clear(); ++E < C; ) {
      var F = g[E];
      this.set(F[0], F[1]);
    }
  }
  function Dd() {
    this.size = 0, this.__data__ = {
      hash: new Ft(),
      map: new (Or || lt)(),
      string: new Ft()
    };
  }
  function Pd(g) {
    var E = Rn(this, g).delete(g);
    return this.size -= E ? 1 : 0, E;
  }
  function kd(g) {
    return Rn(this, g).get(g);
  }
  function Nd(g) {
    return Rn(this, g).has(g);
  }
  function Fd(g, E) {
    var C = Rn(this, g), F = C.size;
    return C.set(g, E), this.size += C.size == F ? 0 : 1, this;
  }
  $t.prototype.clear = Dd, $t.prototype.delete = Pd, $t.prototype.get = kd, $t.prototype.has = Nd, $t.prototype.set = Fd;
  function In(g) {
    var E = -1, C = g == null ? 0 : g.length;
    for (this.__data__ = new $t(); ++E < C; )
      this.add(g[E]);
  }
  function $d(g) {
    return this.__data__.set(g, n), this;
  }
  function Ld(g) {
    return this.__data__.has(g);
  }
  In.prototype.add = In.prototype.push = $d, In.prototype.has = Ld;
  function mt(g) {
    var E = this.__data__ = new lt(g);
    this.size = E.size;
  }
  function Ud() {
    this.__data__ = new lt(), this.size = 0;
  }
  function Md(g) {
    var E = this.__data__, C = E.delete(g);
    return this.size = E.size, C;
  }
  function Bd(g) {
    return this.__data__.get(g);
  }
  function jd(g) {
    return this.__data__.has(g);
  }
  function zd(g, E) {
    var C = this.__data__;
    if (C instanceof lt) {
      var F = C.__data__;
      if (!Or || F.length < r - 1)
        return F.push([g, E]), this.size = ++C.size, this;
      C = this.__data__ = new $t(F);
    }
    return C.set(g, E), this.size = C.size, this;
  }
  mt.prototype.clear = Ud, mt.prototype.delete = Md, mt.prototype.get = Bd, mt.prototype.has = jd, mt.prototype.set = zd;
  function Gd(g, E) {
    var C = On(g), F = !C && ip(g), ae = !C && !F && na(g), H = !C && !F && !ae && uo(g), ue = C || F || ae || H, me = ue ? We(g.length, String) : [], Ee = me.length;
    for (var se in g)
      tt.call(g, se) && !(ue && // Safari 9 has enumerable `arguments.length` in strict mode.
      (se == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ae && (se == "offset" || se == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      H && (se == "buffer" || se == "byteLength" || se == "byteOffset") || // Skip index properties.
      Zd(se, Ee))) && me.push(se);
    return me;
  }
  function Cn(g, E) {
    for (var C = g.length; C--; )
      if (so(g[C][0], E))
        return C;
    return -1;
  }
  function Hd(g, E, C) {
    var F = E(g);
    return On(g) ? F : ht(F, C(g));
  }
  function Pr(g) {
    return g == null ? g === void 0 ? y : b : Nt && Nt in Object(g) ? Jd(g) : np(g);
  }
  function ro(g) {
    return kr(g) && Pr(g) == o;
  }
  function no(g, E, C, F, ae) {
    return g === E ? !0 : g == null || E == null || !kr(g) && !kr(E) ? g !== g && E !== E : qd(g, E, C, F, no, ae);
  }
  function qd(g, E, C, F, ae, H) {
    var ue = On(g), me = On(E), Ee = ue ? l : gt(g), se = me ? l : gt(E);
    Ee = Ee == o ? _ : Ee, se = se == o ? _ : se;
    var Be = Ee == _, Ve = se == _, be = Ee == se;
    if (be && na(g)) {
      if (!na(E))
        return !1;
      ue = !0, Be = !1;
    }
    if (be && !Be)
      return H || (H = new mt()), ue || uo(g) ? io(g, E, C, F, ae, H) : Yd(g, E, Ee, C, F, ae, H);
    if (!(C & i)) {
      var Ge = Be && tt.call(g, "__wrapped__"), He = Ve && tt.call(E, "__wrapped__");
      if (Ge || He) {
        var yt = Ge ? g.value() : g, ct = He ? E.value() : E;
        return H || (H = new mt()), ae(yt, ct, C, F, H);
      }
    }
    return be ? (H || (H = new mt()), Kd(g, E, C, F, ae, H)) : !1;
  }
  function Xd(g) {
    if (!co(g) || tp(g))
      return !1;
    var E = oo(g) ? dd : ee;
    return E.test(Lt(g));
  }
  function Wd(g) {
    return kr(g) && lo(g.length) && !!U[Pr(g)];
  }
  function Vd(g) {
    if (!rp(g))
      return md(g);
    var E = [];
    for (var C in Object(g))
      tt.call(g, C) && C != "constructor" && E.push(C);
    return E;
  }
  function io(g, E, C, F, ae, H) {
    var ue = C & i, me = g.length, Ee = E.length;
    if (me != Ee && !(ue && Ee > me))
      return !1;
    var se = H.get(g);
    if (se && H.get(E))
      return se == E;
    var Be = -1, Ve = !0, be = C & a ? new In() : void 0;
    for (H.set(g, E), H.set(E, g); ++Be < me; ) {
      var Ge = g[Be], He = E[Be];
      if (F)
        var yt = ue ? F(He, Ge, Be, E, g, H) : F(Ge, He, Be, g, E, H);
      if (yt !== void 0) {
        if (yt)
          continue;
        Ve = !1;
        break;
      }
      if (be) {
        if (!de(E, function(ct, Ut) {
          if (!_n(be, Ut) && (Ge === ct || ae(Ge, ct, C, F, H)))
            return be.push(Ut);
        })) {
          Ve = !1;
          break;
        }
      } else if (!(Ge === He || ae(Ge, He, C, F, H))) {
        Ve = !1;
        break;
      }
    }
    return H.delete(g), H.delete(E), Ve;
  }
  function Yd(g, E, C, F, ae, H, ue) {
    switch (C) {
      case B:
        if (g.byteLength != E.byteLength || g.byteOffset != E.byteOffset)
          return !1;
        g = g.buffer, E = E.buffer;
      case j:
        return !(g.byteLength != E.byteLength || !H(new Qs(g), new Qs(E)));
      case c:
      case u:
      case T:
        return so(+g, +E);
      case d:
        return g.name == E.name && g.message == E.message;
      case Q:
      case Y:
        return g == E + "";
      case x:
        var me = bn;
      case re:
        var Ee = F & i;
        if (me || (me = cd), g.size != E.size && !Ee)
          return !1;
        var se = ue.get(g);
        if (se)
          return se == E;
        F |= a, ue.set(g, E);
        var Be = io(me(g), me(E), F, ae, H, ue);
        return ue.delete(g), Be;
      case Me:
        if (ra)
          return ra.call(g) == ra.call(E);
    }
    return !1;
  }
  function Kd(g, E, C, F, ae, H) {
    var ue = C & i, me = ao(g), Ee = me.length, se = ao(E), Be = se.length;
    if (Ee != Be && !ue)
      return !1;
    for (var Ve = Ee; Ve--; ) {
      var be = me[Ve];
      if (!(ue ? be in E : tt.call(E, be)))
        return !1;
    }
    var Ge = H.get(g);
    if (Ge && H.get(E))
      return Ge == E;
    var He = !0;
    H.set(g, E), H.set(E, g);
    for (var yt = ue; ++Ve < Ee; ) {
      be = me[Ve];
      var ct = g[be], Ut = E[be];
      if (F)
        var fo = ue ? F(Ut, ct, be, E, g, H) : F(ct, Ut, be, g, E, H);
      if (!(fo === void 0 ? ct === Ut || ae(ct, Ut, C, F, H) : fo)) {
        He = !1;
        break;
      }
      yt || (yt = be == "constructor");
    }
    if (He && !yt) {
      var Dn = g.constructor, Pn = E.constructor;
      Dn != Pn && "constructor" in g && "constructor" in E && !(typeof Dn == "function" && Dn instanceof Dn && typeof Pn == "function" && Pn instanceof Pn) && (He = !1);
    }
    return H.delete(g), H.delete(E), He;
  }
  function ao(g) {
    return Hd(g, op, Qd);
  }
  function Rn(g, E) {
    var C = g.__data__;
    return ep(E) ? C[typeof E == "string" ? "string" : "hash"] : C.map;
  }
  function rr(g, E) {
    var C = Rr(g, E);
    return Xd(C) ? C : void 0;
  }
  function Jd(g) {
    var E = tt.call(g, Nt), C = g[Nt];
    try {
      g[Nt] = void 0;
      var F = !0;
    } catch {
    }
    var ae = Ks.call(g);
    return F && (E ? g[Nt] = C : delete g[Nt]), ae;
  }
  var Qd = eo ? function(g) {
    return g == null ? [] : (g = Object(g), _e(eo(g), function(E) {
      return Zs.call(g, E);
    }));
  } : lp, gt = Pr;
  (Qi && gt(new Qi(new ArrayBuffer(1))) != B || Or && gt(new Or()) != x || Zi && gt(Zi.resolve()) != k || ea && gt(new ea()) != re || ta && gt(new ta()) != q) && (gt = function(g) {
    var E = Pr(g), C = E == _ ? g.constructor : void 0, F = C ? Lt(C) : "";
    if (F)
      switch (F) {
        case gd:
          return B;
        case yd:
          return x;
        case xd:
          return k;
        case wd:
          return re;
        case Ed:
          return q;
      }
    return E;
  });
  function Zd(g, E) {
    return E = E ?? s, !!E && (typeof g == "number" || he.test(g)) && g > -1 && g % 1 == 0 && g < E;
  }
  function ep(g) {
    var E = typeof g;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? g !== "__proto__" : g === null;
  }
  function tp(g) {
    return !!Ys && Ys in g;
  }
  function rp(g) {
    var E = g && g.constructor, C = typeof E == "function" && E.prototype || Sn;
    return g === C;
  }
  function np(g) {
    return Ks.call(g);
  }
  function Lt(g) {
    if (g != null) {
      try {
        return Vs.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function so(g, E) {
    return g === E || g !== g && E !== E;
  }
  var ip = ro(/* @__PURE__ */ function() {
    return arguments;
  }()) ? ro : function(g) {
    return kr(g) && tt.call(g, "callee") && !Zs.call(g, "callee");
  }, On = Array.isArray;
  function ap(g) {
    return g != null && lo(g.length) && !oo(g);
  }
  var na = hd || cp;
  function sp(g, E) {
    return no(g, E);
  }
  function oo(g) {
    if (!co(g))
      return !1;
    var E = Pr(g);
    return E == m || E == w || E == p || E == $;
  }
  function lo(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= s;
  }
  function co(g) {
    var E = typeof g;
    return g != null && (E == "object" || E == "function");
  }
  function kr(g) {
    return g != null && typeof g == "object";
  }
  var uo = we ? Ki(we) : Wd;
  function op(g) {
    return ap(g) ? Gd(g) : Vd(g);
  }
  function lp() {
    return [];
  }
  function cp() {
    return !1;
  }
  e.exports = sp;
})(xi, xi.exports);
var $E = xi.exports;
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.DownloadedUpdateHelper = void 0;
yn.createTempUpdateFile = jE;
const LE = un, UE = Dt, Al = $E, zt = Pt, Xr = le;
class ME {
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
      return Al(this.versionInfo, r) && Al(this.fileInfo.info, n.info) && await (0, zt.pathExists)(t) ? t : null;
    const a = await this.getValidCachedUpdateFile(n, i);
    return a === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = a, a);
  }
  async setDownloadedFile(t, r, n, i, a, s) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: a,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, zt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, zt.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, zt.pathExists)(n))
      return null;
    let a;
    try {
      a = await (0, zt.readJson)(n);
    } catch (p) {
      let c = "No cached update info available";
      return p.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${p.message})`), r.info(c), null;
    }
    if (!((a == null ? void 0 : a.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== a.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${a.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const o = Xr.join(this.cacheDirForPendingUpdate, a.fileName);
    if (!await (0, zt.pathExists)(o))
      return r.info("Cached update file doesn't exist"), null;
    const l = await BE(o);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = a, o);
  }
  getUpdateInfoFile() {
    return Xr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
yn.DownloadedUpdateHelper = ME;
function BE(e, t = "sha512", r = "base64", n) {
  return new Promise((i, a) => {
    const s = (0, LE.createHash)(t);
    s.on("error", a).setEncoding(r), (0, UE.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", a).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function jE(e, t, r) {
  let n = 0, i = Xr.join(t, e);
  for (let a = 0; a < 3; a++)
    try {
      return await (0, zt.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${s}`), i = Xr.join(t, `${n++}-${e}`);
    }
  return i;
}
var Ui = {}, Ms = {};
Object.defineProperty(Ms, "__esModule", { value: !0 });
Ms.getAppCacheDir = GE;
const ba = le, zE = _i;
function GE() {
  const e = (0, zE.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || ba.join(e, "AppData", "Local") : process.platform === "darwin" ? t = ba.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || ba.join(e, ".cache"), t;
}
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.ElectronAppAdapter = void 0;
const Il = le, HE = Ms;
class qE {
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
    return this.isPackaged ? Il.join(process.resourcesPath, "app-update.yml") : Il.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, HE.getAppCacheDir)();
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
Ui.ElectronAppAdapter = qE;
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
      return await o.cancellationToken.createPromise((l, p, c) => {
        const u = {
          headers: o.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(a, u), (0, t.configureRequestOptions)(u), this.doDownload(u, {
          destination: s,
          options: o,
          onCancel: c,
          callback: (d) => {
            d == null ? l(s) : p(d);
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
    addRedirectHandlers(a, s, o, l, p) {
      a.on("redirect", (c, u, d) => {
        a.abort(), l > this.maxRedirects ? o(this.createMaxRedirectError()) : p(t.HttpExecutor.prepareRedirectUrlOptions(d, s));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(Af);
var xn = {}, Xe = {}, XE = "[object Symbol]", If = /[\\^$.*+?()[\]{}|]/g, WE = RegExp(If.source), VE = typeof Oe == "object" && Oe && Oe.Object === Object && Oe, YE = typeof self == "object" && self && self.Object === Object && self, KE = VE || YE || Function("return this")(), JE = Object.prototype, QE = JE.toString, Cl = KE.Symbol, Rl = Cl ? Cl.prototype : void 0, Ol = Rl ? Rl.toString : void 0;
function ZE(e) {
  if (typeof e == "string")
    return e;
  if (tv(e))
    return Ol ? Ol.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function ev(e) {
  return !!e && typeof e == "object";
}
function tv(e) {
  return typeof e == "symbol" || ev(e) && QE.call(e) == XE;
}
function rv(e) {
  return e == null ? "" : ZE(e);
}
function nv(e) {
  return e = rv(e), e && WE.test(e) ? e.replace(If, "\\$&") : e;
}
var iv = nv;
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.newBaseUrl = sv;
Xe.newUrlFromBase = Za;
Xe.getChannelFilename = ov;
Xe.blockmapFiles = lv;
const Cf = _r, av = iv;
function sv(e) {
  const t = new Cf.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Za(e, t, r = !1) {
  const n = new Cf.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function ov(e) {
  return `${e}.yml`;
}
function lv(e, t, r) {
  const n = Za(`${e.pathname}.blockmap`, e);
  return [Za(`${e.pathname.replace(new RegExp(av(r), "g"), t)}.blockmap`, e), n];
}
var pe = {};
Object.defineProperty(pe, "__esModule", { value: !0 });
pe.Provider = void 0;
pe.findFile = fv;
pe.parseUpdateInfo = dv;
pe.getFileList = Rf;
pe.resolveFiles = pv;
const Rt = xe, cv = Te, Dl = Xe;
class uv {
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
pe.Provider = uv;
function fv(e, t, r) {
  if (e.length === 0)
    throw (0, Rt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((a) => i.url.pathname.toLowerCase().endsWith(`.${a}`))));
}
function dv(e, t, r) {
  if (e == null)
    throw (0, Rt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, cv.load)(e);
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
function pv(e, t, r = (n) => n) {
  const i = Rf(e).map((o) => {
    if (o.sha2 == null && o.sha512 == null)
      throw (0, Rt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Rt.safeStringifyJson)(o)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Dl.newUrlFromBase)(r(o.url), t),
      info: o
    };
  }), a = e.packages, s = a == null ? null : a[process.arch] || a.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, Dl.newUrlFromBase)(r(s.path), t).href
  }), i;
}
Object.defineProperty(xn, "__esModule", { value: !0 });
xn.GenericProvider = void 0;
const Pl = xe, Sa = Xe, Aa = pe;
class hv extends Aa.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, Sa.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Sa.getChannelFilename)(this.channel), r = (0, Sa.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Aa.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Pl.HttpError && i.statusCode === 404)
          throw (0, Pl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, Aa.resolveFiles)(t, this.baseUrl);
  }
}
xn.GenericProvider = hv;
var Mi = {}, Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.BitbucketProvider = void 0;
const kl = xe, Ia = Xe, Ca = pe;
class mv extends Ca.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: a } = t;
    this.baseUrl = (0, Ia.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new kl.CancellationToken(), r = (0, Ia.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Ia.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Ca.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, kl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Ca.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
Bi.BitbucketProvider = mv;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.GitHubProvider = Ot.BaseGitHubProvider = void 0;
Ot.computeReleaseNotes = Df;
const ut = xe, pr = Sf, gv = _r, hr = Xe, es = pe, Ra = /\/tag\/([^/]+)$/;
class Of extends es.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, hr.newBaseUrl)((0, ut.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, hr.newBaseUrl)((0, ut.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
Ot.BaseGitHubProvider = Of;
class yv extends Of {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, a;
    const s = new ut.CancellationToken(), o = await this.httpRequest((0, hr.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), l = (0, ut.parseXml)(o);
    let p = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = pr.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (T === null)
          c = Ra.exec(p.element("link").attribute("href"))[1];
        else
          for (const b of l.getElements("entry")) {
            const _ = Ra.exec(b.element("link").attribute("href"));
            if (_ === null)
              continue;
            const k = _[1], $ = ((n = pr.prerelease(k)) === null || n === void 0 ? void 0 : n[0]) || null, Q = !T || ["alpha", "beta"].includes(T), re = $ !== null && !["alpha", "beta"].includes(String($));
            if (Q && !re && !(T === "beta" && $ === "alpha")) {
              c = k;
              break;
            }
            if ($ && $ === T) {
              c = k;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(s);
        for (const T of l.getElements("entry"))
          if (Ra.exec(T.element("link").attribute("href"))[1] === c) {
            p = T;
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
    let u, d = "", m = "";
    const w = async (T) => {
      d = (0, hr.getChannelFilename)(T), m = (0, hr.newUrlFromBase)(this.getBaseDownloadPath(String(c), d), this.baseUrl);
      const b = this.createRequestOptions(m);
      try {
        return await this.executor.request(b, s);
      } catch (_) {
        throw _ instanceof ut.HttpError && _.statusCode === 404 ? (0, ut.newError)(`Cannot find ${d} in the latest release artifacts (${m}): ${_.stack || _.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : _;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = pr.prerelease(c)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((a = pr.prerelease(c)) === null || a === void 0 ? void 0 : a[0]))), u = await w(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        u = await w(this.getDefaultChannelName());
      else
        throw T;
    }
    const x = (0, es.parseUpdateInfo)(u, d, m);
    return x.releaseName == null && (x.releaseName = p.elementValueOrEmpty("title")), x.releaseNotes == null && (x.releaseNotes = Df(this.updater.currentVersion, this.updater.fullChangelog, l, p)), {
      tag: c,
      ...x
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, hr.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new gv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
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
Ot.GitHubProvider = yv;
function Nl(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Df(e, t, r, n) {
  if (!t)
    return Nl(n);
  const i = [];
  for (const a of r.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(a.element("link").attribute("href"))[1];
    pr.lt(e, s) && i.push({
      version: s,
      note: Nl(a)
    });
  }
  return i.sort((a, s) => pr.rcompare(a.version, s.version));
}
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.KeygenProvider = void 0;
const Fl = xe, Oa = Xe, Da = pe;
class xv extends Da.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Oa.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Fl.CancellationToken(), r = (0, Oa.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Oa.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Da.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Fl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Da.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
ji.KeygenProvider = xv;
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.PrivateGitHubProvider = void 0;
const ar = xe, wv = Te, Ev = le, $l = _r, Ll = Xe, vv = Ot, Tv = pe;
class _v extends vv.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new ar.CancellationToken(), r = (0, Ll.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((o) => o.name === r);
    if (i == null)
      throw (0, ar.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const a = new $l.URL(i.url);
    let s;
    try {
      s = (0, wv.load)(await this.httpRequest(a, this.configureHeaders("application/octet-stream"), t));
    } catch (o) {
      throw o instanceof ar.HttpError && o.statusCode === 404 ? (0, ar.newError)(`Cannot find ${r} in the latest release artifacts (${a}): ${o.stack || o.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : o;
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
    const i = (0, Ll.newUrlFromBase)(n, this.baseUrl);
    try {
      const a = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? a.find((s) => s.prerelease) || a[0] : a;
    } catch (a) {
      throw (0, ar.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${a.stack || a.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Tv.getFileList)(t).map((r) => {
      const n = Ev.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((a) => a != null && a.name === n);
      if (i == null)
        throw (0, ar.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new $l.URL(i.url),
        info: r
      };
    });
  }
}
zi.PrivateGitHubProvider = _v;
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.isUrlProbablySupportMultiRangeRequests = Pf;
Mi.createClient = Cv;
const qn = xe, bv = Bi, Ul = xn, Sv = Ot, Av = ji, Iv = zi;
function Pf(e) {
  return !e.includes("s3.amazonaws.com");
}
function Cv(e, t, r) {
  if (typeof e == "string")
    throw (0, qn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, a = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return a == null ? new Sv.GitHubProvider(i, t, r) : new Iv.PrivateGitHubProvider(i, t, a, r);
    }
    case "bitbucket":
      return new bv.BitbucketProvider(e, t, r);
    case "keygen":
      return new Av.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Ul.GenericProvider({
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
      return new Ul.GenericProvider(i, t, {
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
var Gi = {}, wn = {}, Cr = {}, tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.OperationKind = void 0;
tr.computeOperations = Rv;
var Xt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Xt || (tr.OperationKind = Xt = {}));
function Rv(e, t, r) {
  const n = Bl(e.files), i = Bl(t.files);
  let a = null;
  const s = t.files[0], o = [], l = s.name, p = n.get(l);
  if (p == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let u = 0;
  const { checksumToOffset: d, checksumToOldSize: m } = Dv(n.get(l), p.offset, r);
  let w = s.offset;
  for (let x = 0; x < c.checksums.length; w += c.sizes[x], x++) {
    const T = c.sizes[x], b = c.checksums[x];
    let _ = d.get(b);
    _ != null && m.get(b) !== T && (r.warn(`Checksum ("${b}") matches, but size differs (old: ${m.get(b)}, new: ${T})`), _ = void 0), _ === void 0 ? (u++, a != null && a.kind === Xt.DOWNLOAD && a.end === w ? a.end += T : (a = {
      kind: Xt.DOWNLOAD,
      start: w,
      end: w + T
      // oldBlocks: null,
    }, Ml(a, o, b, x))) : a != null && a.kind === Xt.COPY && a.end === _ ? a.end += T : (a = {
      kind: Xt.COPY,
      start: _,
      end: _ + T
      // oldBlocks: [checksum]
    }, Ml(a, o, b, x));
  }
  return u > 0 && r.info(`File${s.name === "file" ? "" : " " + s.name} has ${u} changed blocks`), o;
}
const Ov = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Ml(e, t, r, n) {
  if (Ov && t.length !== 0) {
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
function Dv(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let a = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const o = e.checksums[s], l = e.sizes[s], p = i.get(o);
    if (p === void 0)
      n.set(o, a), i.set(o, l);
    else if (r.debug != null) {
      const c = p === l ? "(same size)" : `(size: ${p}, this size: ${l})`;
      r.debug(`${o} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    a += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function Bl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.DataSplitter = void 0;
Cr.copyData = kf;
const Xn = xe, Pv = Dt, kv = cn, Nv = tr, jl = Buffer.from(`\r
\r
`);
var Et;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Et || (Et = {}));
function kf(e, t, r, n, i) {
  const a = (0, Pv.createReadStream)("", {
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
class Fv extends kv.Writable {
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
        if (s.kind !== Nv.OperationKind.COPY) {
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
Cr.DataSplitter = Fv;
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.executeTasksUsingMultipleRangeRequests = $v;
Hi.checkIsRangesSupported = rs;
const ts = xe, zl = Cr, Gl = tr;
function $v(e, t, r, n, i) {
  const a = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const o = s + 1e3;
    Lv(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, o),
      oldFileFd: n
    }, r, () => a(o), i);
  };
  return a;
}
function Lv(e, t, r, n, i) {
  let a = "bytes=", s = 0;
  const o = /* @__PURE__ */ new Map(), l = [];
  for (let u = t.start; u < t.end; u++) {
    const d = t.tasks[u];
    d.kind === Gl.OperationKind.DOWNLOAD && (a += `${d.start}-${d.end - 1}, `, o.set(s, u), s++, l.push(d.end - d.start));
  }
  if (s <= 1) {
    const u = (d) => {
      if (d >= t.end) {
        n();
        return;
      }
      const m = t.tasks[d++];
      if (m.kind === Gl.OperationKind.COPY)
        (0, zl.copyData)(m, r, t.oldFileFd, i, () => u(d));
      else {
        const w = e.createRequestOptions();
        w.headers.Range = `bytes=${m.start}-${m.end - 1}`;
        const x = e.httpExecutor.createRequest(w, (T) => {
          rs(T, i) && (T.pipe(r, {
            end: !1
          }), T.once("end", () => u(d)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(x, i), x.end();
      }
    };
    u(t.start);
    return;
  }
  const p = e.createRequestOptions();
  p.headers.Range = a.substring(0, a.length - 2);
  const c = e.httpExecutor.createRequest(p, (u) => {
    if (!rs(u, i))
      return;
    const d = (0, ts.safeGetHeader)(u, "content-type"), m = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(d);
    if (m == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${d}"`));
      return;
    }
    const w = new zl.DataSplitter(r, t, o, m[1] || m[2], l, n);
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
const Uv = cn;
var mr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(mr || (mr = {}));
class Mv extends Uv.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = mr.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == mr.COPY) {
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
    this.operationType = mr.COPY;
  }
  beginRangeDownload() {
    this.operationType = mr.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
qi.ProgressDifferentialDownloadCallbackTransform = Mv;
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.DifferentialDownloader = void 0;
const Lr = xe, Pa = Pt, Bv = Dt, jv = Cr, zv = _r, Wn = tr, Hl = Hi, Gv = qi;
class Hv {
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
    return (0, Lr.configureRequestUrl)(this.options.newUrl, t), (0, Lr.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Wn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let a = 0, s = 0;
    for (const l of i) {
      const p = l.end - l.start;
      l.kind === Wn.OperationKind.DOWNLOAD ? a += p : s += p;
    }
    const o = this.blockAwareFileInfo.size;
    if (a + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== o)
      throw new Error(`Internal error, size mismatch: downloadSize: ${a}, copySize: ${s}, newSize: ${o}`);
    return n.info(`Full: ${ql(o)}, To download: ${ql(a)} (${Math.round(a / (o / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Pa.close)(i.descriptor).catch((a) => {
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
    const n = await (0, Pa.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Pa.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const a = (0, Bv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, o) => {
      const l = [];
      let p;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const b = [];
        let _ = 0;
        for (const $ of t)
          $.kind === Wn.OperationKind.DOWNLOAD && (b.push($.end - $.start), _ += $.end - $.start);
        const k = {
          expectedByteCounts: b,
          grandTotal: _
        };
        p = new Gv.ProgressDifferentialDownloadCallbackTransform(k, this.options.cancellationToken, this.options.onProgress), l.push(p);
      }
      const c = new Lr.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), a.on("finish", () => {
        a.close(() => {
          r.splice(1, 1);
          try {
            c.validate();
          } catch (b) {
            o(b);
            return;
          }
          s(void 0);
        });
      }), l.push(a);
      let u = null;
      for (const b of l)
        b.on("error", o), u == null ? u = b : u = u.pipe(b);
      const d = l[0];
      let m;
      if (this.options.isUseMultipleRangeRequest) {
        m = (0, Hl.executeTasksUsingMultipleRangeRequests)(this, t, d, n, o), m(0);
        return;
      }
      let w = 0, x = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", m = (b) => {
        var _, k;
        if (b >= t.length) {
          this.fileMetadataBuffer != null && d.write(this.fileMetadataBuffer), d.end();
          return;
        }
        const $ = t[b++];
        if ($.kind === Wn.OperationKind.COPY) {
          p && p.beginFileCopy(), (0, jv.copyData)($, d, n, o, () => m(b));
          return;
        }
        const Q = `bytes=${$.start}-${$.end - 1}`;
        T.headers.range = Q, (k = (_ = this.logger) === null || _ === void 0 ? void 0 : _.debug) === null || k === void 0 || k.call(_, `download range: ${Q}`), p && p.beginRangeDownload();
        const re = this.httpExecutor.createRequest(T, (Y) => {
          Y.on("error", o), Y.on("aborted", () => {
            o(new Error("response has been aborted by the server"));
          }), Y.statusCode >= 400 && o((0, Lr.createHttpError)(Y)), Y.pipe(d, {
            end: !1
          }), Y.once("end", () => {
            p && p.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => m(b), 1e3)) : m(b);
          });
        });
        re.on("redirect", (Y, Me, y) => {
          this.logger.info(`Redirect to ${qv(y)}`), x = y, (0, Lr.configureRequestUrl)(new zv.URL(x), T), re.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(re, o), re.end();
      }, m(0);
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
        (0, Hl.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", r), s.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(a, i), a.end();
    });
  }
}
wn.DifferentialDownloader = Hv;
function ql(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function qv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.GenericDifferentialDownloader = void 0;
const Xv = wn;
class Wv extends Xv.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Gi.GenericDifferentialDownloader = Wv;
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
const Ce = xe, Vv = un, Yv = _i, Kv = bc, sr = Pt, Jv = Te, ka = Pi, Mt = le, Gt = Sf, Xl = yn, Qv = Ui, Wl = Af, Zv = xn, Na = Mi, eT = Ac, tT = Xe, rT = Gi, or = kt;
class Bs extends Kv.EventEmitter {
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
        throw (0, Ce.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Ce.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, Wl.getNetSession)();
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
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new ka.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new or.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (a) => this.checkIfUpdateSupported(a), this.clientPromise = null, this.stagingUserIdPromise = new ka.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new ka.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (a) => {
      this._logger.error(`Error: ${a.stack || a.message}`);
    }), r == null ? (this.app = new Qv.ElectronAppAdapter(), this.httpExecutor = new Wl.ElectronHttpExecutor((a, s) => this.emit("login", a, s))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Gt.parse)(n);
    if (i == null)
      throw (0, Ce.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = nT(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new Zv.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Na.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Na.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = Bs.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
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
    const i = await this.stagingUserIdPromise.value, s = Ce.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${s}, user id: ${i}`), s < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Gt.parse)(t.version);
    if (r == null)
      throw (0, Ce.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Gt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const a = (0, Gt.gt)(r, n), s = (0, Gt.lt)(r, n);
    return a ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, Yv.release)();
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
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Na.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    const n = new Ce.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Ce.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Ce.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Ce.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Ce.CancellationError))
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
    this.emit(or.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, Jv.load)(await (0, sr.readFile)(this._appUpdateConfigPath, "utf-8"));
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
      const n = await (0, sr.readFile)(t, "utf-8");
      if (Ce.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Ce.UUID.v5((0, Vv.randomBytes)(4096), Ce.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, sr.outputFile)(t, r);
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
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Xl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(or.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (_) => this.emit(or.DOWNLOAD_PROGRESS, _));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, a = i.version, s = r.packageInfo;
    function o() {
      const _ = decodeURIComponent(t.fileInfo.url.pathname);
      return _.endsWith(`.${t.fileExtension}`) ? Mt.basename(_) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), p = l.cacheDirForPendingUpdate;
    await (0, sr.mkdir)(p, { recursive: !0 });
    const c = o();
    let u = Mt.join(p, c);
    const d = s == null ? null : Mt.join(p, `package-${a}${Mt.extname(s.path) || ".7z"}`), m = async (_) => (await l.setDownloadedFile(u, d, i, r, c, _), await t.done({
      ...i,
      downloadedFile: u
    }), d == null ? [u] : [u, d]), w = this._logger, x = await l.validateDownloadedPath(u, i, r, w);
    if (x != null)
      return u = x, await m(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, sr.unlink)(u).catch(() => {
    })), b = await (0, Xl.createTempUpdateFile)(`temp-${c}`, p, w);
    try {
      await t.task(b, n, d, T), await (0, Ce.retry)(() => (0, sr.rename)(b, u), 60, 500, 0, 0, (_) => _ instanceof Error && /^EBUSY:/.test(_.message));
    } catch (_) {
      throw await T(), _ instanceof Ce.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), _;
    }
    return w.info(`New version ${a} has been downloaded to ${u}`), await m(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, a) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, tT.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const o = async (c) => {
        const u = await this.httpExecutor.downloadToBuffer(c, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (u == null || u.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, eT.gunzipSync)(u).toString());
        } catch (d) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${d}`);
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
      this.listenerCount(or.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(or.DOWNLOAD_PROGRESS, c));
      const p = await Promise.all(s.map((c) => o(c)));
      return await new rT.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(p[0], p[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
At.AppUpdater = Bs;
function nT(e) {
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
const Vl = Ti, iT = At;
class aT extends iT.AppUpdater {
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
    const i = (0, Vl.spawnSync)(t, r, {
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
        const o = { stdio: i, env: n, detached: !0 }, l = (0, Vl.spawn)(t, r, o);
        l.on("error", (p) => {
          s(p);
        }), l.unref(), l.pid !== void 0 && a(!0);
      } catch (o) {
        s(o);
      }
    });
  }
}
pt.BaseUpdater = aT;
var rn = {}, En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
En.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const lr = Pt, sT = wn, oT = Ac;
class lT extends sT.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Ff(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await cT(this.options.oldFile), i);
  }
}
En.FileWithEmbeddedBlockMapDifferentialDownloader = lT;
function Ff(e) {
  return JSON.parse((0, oT.inflateRawSync)(e).toString());
}
async function cT(e) {
  const t = await (0, lr.open)(e, "r");
  try {
    const r = (await (0, lr.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, lr.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, lr.read)(t, i, 0, i.length, r - n.length - i.length), await (0, lr.close)(t), Ff(i);
  } catch (r) {
    throw await (0, lr.close)(t), r;
  }
}
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.AppImageUpdater = void 0;
const Yl = xe, Kl = Ti, uT = Pt, fT = Dt, Ur = le, dT = pt, pT = En, hT = pe, Jl = kt;
class mT extends dT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, hT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, Yl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, s, i, r, t)) && await this.httpExecutor.download(n.url, i, a), await (0, uT.chmod)(i, 493);
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
      return this.listenerCount(Jl.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Jl.DOWNLOAD_PROGRESS, o)), await new pT.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Yl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, fT.unlinkSync)(r);
    let n;
    const i = Ur.basename(r), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Ur.basename(a) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Ur.join(Ur.dirname(r), Ur.basename(a)), (0, Kl.execFileSync)("mv", ["-f", a, n]), n !== r && this.emit("appimage-filename-updated", n);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Kl.execFileSync)(n, [], { env: s })), !0;
  }
}
rn.AppImageUpdater = mT;
var nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.DebUpdater = void 0;
const gT = pt, yT = pe, Ql = kt;
class xT extends gT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, yT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(Ql.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(Ql.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
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
nn.DebUpdater = xT;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.PacmanUpdater = void 0;
const wT = pt, Zl = kt, ET = pe;
class vT extends wT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, ET.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
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
    const a = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
an.PacmanUpdater = vT;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.RpmUpdater = void 0;
const TT = pt, ec = kt, _T = pe;
class bT extends TT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, _T.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
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
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.spawnSyncLog("which zypper"), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    let s;
    return i ? s = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", a] : s = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", a], this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${s.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
sn.RpmUpdater = bT;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.MacUpdater = void 0;
const tc = xe, Fa = Pt, ST = Dt, rc = le, AT = yp, IT = At, CT = pe, nc = Ti, ic = un;
class RT extends IT.AppUpdater {
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
      this.debug("Checking for macOS Rosetta environment"), a = (0, nc.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${a})`);
    } catch (u) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${u}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const d = (0, nc.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${d}`), s = s || d;
    } catch (u) {
      n.warn(`uname shell command to check for arm64 failed: ${u}`);
    }
    s = s || process.arch === "arm64" || a;
    const o = (u) => {
      var d;
      return u.url.pathname.includes("arm64") || ((d = u.info.url) === null || d === void 0 ? void 0 : d.includes("arm64"));
    };
    s && r.some(o) ? r = r.filter((u) => s === o(u)) : r = r.filter((u) => !o(u));
    const l = (0, CT.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, tc.newError)(`ZIP file not provided: ${(0, tc.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const p = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (u, d) => {
        const m = rc.join(this.downloadedUpdateHelper.cacheDir, c), w = () => (0, Fa.pathExistsSync)(m) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let x = !0;
        w() && (x = await this.differentialDownloadInstaller(l, t, u, p, c)), x && await this.httpExecutor.download(l.url, u, d);
      },
      done: async (u) => {
        if (!t.disableDifferentialDownload)
          try {
            const d = rc.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Fa.copyFile)(u.downloadedFile, d);
          } catch (d) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${d.message}`);
          }
        return this.updateDownloaded(l, u);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, a = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Fa.stat)(i)).size, s = this._logger, o = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${o})`), this.server = (0, AT.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${o})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${o})`);
    });
    const l = (p) => {
      const c = p.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((p, c) => {
      const u = (0, ic.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${u}`, "ascii"), m = `/${(0, ic.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, x) => {
        const T = w.url;
        if (s.info(`${T} requested`), T === "/") {
          if (!w.headers.authorization || w.headers.authorization.indexOf("Basic ") === -1) {
            x.statusCode = 401, x.statusMessage = "Invalid Authentication Credentials", x.end(), s.warn("No authenthication info");
            return;
          }
          const k = w.headers.authorization.split(" ")[1], $ = Buffer.from(k, "base64").toString("ascii"), [Q, re] = $.split(":");
          if (Q !== "autoupdater" || re !== u) {
            x.statusCode = 401, x.statusMessage = "Invalid Authentication Credentials", x.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const Y = Buffer.from(`{ "url": "${l(this.server)}${m}" }`);
          x.writeHead(200, { "Content-Type": "application/json", "Content-Length": Y.length }), x.end(Y);
          return;
        }
        if (!T.startsWith(m)) {
          s.warn(`${T} requested, but not supported`), x.writeHead(404), x.end();
          return;
        }
        s.info(`${m} requested by Squirrel.Mac, pipe ${i}`);
        let b = !1;
        x.on("finish", () => {
          b || (this.nativeUpdater.removeListener("error", c), p([]));
        });
        const _ = (0, ST.createReadStream)(i);
        _.on("error", (k) => {
          try {
            x.end();
          } catch ($) {
            s.warn(`cannot end response: ${$}`);
          }
          b = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${k}`));
        }), x.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": a
        }), _.pipe(x);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${o})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${o})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${d.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : p([]);
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
on.MacUpdater = RT;
var ln = {}, js = {};
Object.defineProperty(js, "__esModule", { value: !0 });
js.verifySignature = DT;
const ac = xe, $f = Ti, OT = _i, sc = le;
function DT(e, t, r) {
  return new Promise((n, i) => {
    const a = t.replace(/'/g, "''");
    r.info(`Verifying signature ${a}`), (0, $f.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${a}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, o, l) => {
      var p;
      try {
        if (s != null || l) {
          $a(r, s, l, i), n(null);
          return;
        }
        const c = PT(o);
        if (c.Status === 0) {
          try {
            const w = sc.normalize(c.Path), x = sc.normalize(t);
            if (r.info(`LiteralPath: ${w}. Update Path: ${x}`), w !== x) {
              $a(r, new Error(`LiteralPath of ${w} is different than ${x}`), l, i), n(null);
              return;
            }
          } catch (w) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(p = w.message) !== null && p !== void 0 ? p : w.stack}`);
          }
          const d = (0, ac.parseDn)(c.SignerCertificate.Subject);
          let m = !1;
          for (const w of e) {
            const x = (0, ac.parseDn)(w);
            if (x.size ? m = Array.from(x.keys()).every((b) => x.get(b) === d.get(b)) : w === d.get("CN") && (r.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), m = !0), m) {
              n(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (d, m) => d === "RawData" ? void 0 : m, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), n(u);
      } catch (c) {
        $a(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function PT(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function $a(e, t, r, n) {
  if (kT()) {
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
function kT() {
  const e = OT.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.NsisUpdater = void 0;
const Vn = xe, oc = le, NT = pt, FT = En, lc = kt, $T = pe, LT = Pt, UT = js, cc = _r;
class MT extends NT.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, UT.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, $T.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, a, s, o) => {
        const l = n.packageInfo, p = l != null && s != null;
        if (p && t.disableWebInstaller)
          throw (0, Vn.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !p && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (p || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Vn.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, a);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await o(), (0, Vn.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (p && await this.differentialDownloadWebPackage(t, l, s, r))
          try {
            await this.httpExecutor.download(new cc.URL(l.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (u) {
            try {
              await (0, LT.unlink)(s);
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
      this.spawnLog(oc.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((s) => this.dispatchError(s));
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
        newUrl: new cc.URL(r.path),
        oldFile: oc.join(this.downloadedUpdateHelper.cacheDir, Vn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(lc.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(lc.DOWNLOAD_PROGRESS, s)), await new FT.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, a).download();
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "win32";
    }
    return !1;
  }
}
ln.NsisUpdater = MT;
(function(e) {
  var t = Oe && Oe.__createBinding || (Object.create ? function(T, b, _, k) {
    k === void 0 && (k = _);
    var $ = Object.getOwnPropertyDescriptor(b, _);
    (!$ || ("get" in $ ? !b.__esModule : $.writable || $.configurable)) && ($ = { enumerable: !0, get: function() {
      return b[_];
    } }), Object.defineProperty(T, k, $);
  } : function(T, b, _, k) {
    k === void 0 && (k = _), T[k] = b[_];
  }), r = Oe && Oe.__exportStar || function(T, b) {
    for (var _ in T) _ !== "default" && !Object.prototype.hasOwnProperty.call(b, _) && t(b, T, _);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = Pt, i = le;
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
  var p = nn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return p.DebUpdater;
  } });
  var c = an;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var u = sn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return u.RpmUpdater;
  } });
  var d = on;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return d.MacUpdater;
  } });
  var m = ln;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return m.NsisUpdater;
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
        const b = (0, n.readFileSync)(T).toString().trim();
        switch (console.info("Found package-type:", b), b) {
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
const BT = "End-Of-Stream";
class Ae extends Error {
  constructor() {
    super(BT), this.name = "EndOfStreamError";
  }
}
class jT extends Error {
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
      throw new Ae();
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
        throw new jT();
      const i = await this.readFromStream(t.subarray(n), r);
      if (i === 0)
        break;
      n += i;
    }
    if (!r && n < t.length)
      throw new Ae();
    return n;
  }
}
class zT extends Lf {
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
class GT extends zT {
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
class uc extends Lf {
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
      throw new Ae();
    return n;
  }
  abort() {
    return this.interrupted = !0, this.reader.cancel();
  }
  async close() {
    await this.abort(), this.reader.releaseLock();
  }
}
function HT(e) {
  try {
    const t = e.getReader({ mode: "byob" });
    return t instanceof ReadableStreamDefaultReader ? new uc(t) : new GT(t);
  } catch (t) {
    if (t instanceof TypeError)
      return new uc(e.getReader());
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
      throw new Ae();
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
      throw new Ae();
    return t.get(n, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async readNumber(t) {
    if (await this.readBuffer(this.numBuffer, { length: t.len }) < t.len)
      throw new Ae();
    return t.get(this.numBuffer, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async peekNumber(t) {
    if (await this.peekBuffer(this.numBuffer, { length: t.len }) < t.len)
      throw new Ae();
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
const qT = 256e3;
class XT extends Xi {
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
      throw new Ae();
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
        if (r != null && r.mayBeLess && a instanceof Ae)
          return 0;
        throw a;
      }
      if (!n.mayBeLess && i < n.length)
        throw new Ae();
    }
    return i;
  }
  async ignore(t) {
    const r = Math.min(qT, t), n = new Uint8Array(r);
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
class WT extends Xi {
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
      throw new Ae();
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
class VT extends Xi {
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
      throw new Ae();
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
function YT(e, t) {
  const r = HT(e), n = t ?? {}, i = n.onClose;
  return n.onClose = async () => {
    if (await r.close(), i)
      return i();
  }, new XT(r, n);
}
function ns(e, t) {
  return new WT(e, t);
}
function KT(e, t) {
  return new VT(e, t);
}
class zs extends Xi {
  /**
   * Create tokenizer from provided file path
   * @param sourceFilePath File path
   */
  static async fromFile(t) {
    const r = await hp(t, "r"), n = await r.stat();
    return new zs(r, { fileInfo: { path: t, size: n.size } });
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
      throw new Ae();
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
      throw new Ae();
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
const JT = zs.fromFile;
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Wi = function(e, t, r, n, i) {
  var a, s, o = i * 8 - n - 1, l = (1 << o) - 1, p = l >> 1, c = -7, u = r ? i - 1 : 0, d = r ? -1 : 1, m = e[t + u];
  for (u += d, a = m & (1 << -c) - 1, m >>= -c, c += o; c > 0; a = a * 256 + e[t + u], u += d, c -= 8)
    ;
  for (s = a & (1 << -c) - 1, a >>= -c, c += n; c > 0; s = s * 256 + e[t + u], u += d, c -= 8)
    ;
  if (a === 0)
    a = 1 - p;
  else {
    if (a === l)
      return s ? NaN : (m ? -1 : 1) * (1 / 0);
    s = s + Math.pow(2, n), a = a - p;
  }
  return (m ? -1 : 1) * s * Math.pow(2, a - n);
}, Vi = function(e, t, r, n, i, a) {
  var s, o, l, p = a * 8 - i - 1, c = (1 << p) - 1, u = c >> 1, d = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, m = n ? 0 : a - 1, w = n ? 1 : -1, x = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (o = isNaN(t) ? 1 : 0, s = c) : (s = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -s)) < 1 && (s--, l *= 2), s + u >= 1 ? t += d / l : t += d * Math.pow(2, 1 - u), t * l >= 2 && (s++, l /= 2), s + u >= c ? (o = 0, s = c) : s + u >= 1 ? (o = (t * l - 1) * Math.pow(2, i), s = s + u) : (o = t * Math.pow(2, u - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + m] = o & 255, m += w, o /= 256, i -= 8)
    ;
  for (s = s << i | o, p += i; p > 0; e[r + m] = s & 255, m += w, s /= 256, p -= 8)
    ;
  e[r + m - w] |= x * 128;
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
function QT(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8":
      return typeof globalThis.TextDecoder < "u" ? new globalThis.TextDecoder("utf-8").decode(e) : ZT(e);
    case "utf-16le":
      return e_(e);
    case "ascii":
      return t_(e);
    case "latin1":
    case "iso-8859-1":
      return r_(e);
    case "windows-1252":
      return n_(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function ZT(e) {
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
function e_(e) {
  let t = "";
  for (let r = 0; r < e.length; r += 2)
    t += String.fromCharCode(e[r] | e[r + 1] << 8);
  return t;
}
function t_(e) {
  return String.fromCharCode(...e.map((t) => t & 127));
}
function r_(e) {
  return String.fromCharCode(...e);
}
function n_(e) {
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
}, ne = {
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
}, i_ = {
  len: 2,
  get(e, t) {
    return G(e).getInt16(t);
  },
  put(e, t, r) {
    return G(e).setInt16(t, r), t + 2;
  }
}, a_ = {
  len: 2,
  get(e, t) {
    return G(e).getInt16(t, !0);
  },
  put(e, t, r) {
    return G(e).setInt16(t, r, !0), t + 2;
  }
}, s_ = {
  len: 3,
  get(e, t) {
    const r = Uf.get(e, t);
    return r > 8388607 ? r - 16777216 : r;
  },
  put(e, t, r) {
    const n = G(e);
    return n.setUint8(t, r & 255), n.setUint16(t + 1, r >> 8, !0), t + 3;
  }
}, o_ = {
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
}, l_ = {
  len: 4,
  get(e, t) {
    return G(e).getInt32(t, !0);
  },
  put(e, t, r) {
    return G(e).setInt32(t, r, !0), t + 4;
  }
}, jf = {
  len: 8,
  get(e, t) {
    return G(e).getBigUint64(t, !0);
  },
  put(e, t, r) {
    return G(e).setBigUint64(t, r, !0), t + 8;
  }
}, c_ = {
  len: 8,
  get(e, t) {
    return G(e).getBigInt64(t, !0);
  },
  put(e, t, r) {
    return G(e).setBigInt64(t, r, !0), t + 8;
  }
}, u_ = {
  len: 8,
  get(e, t) {
    return G(e).getBigUint64(t);
  },
  put(e, t, r) {
    return G(e).setBigUint64(t, r), t + 8;
  }
}, f_ = {
  len: 8,
  get(e, t) {
    return G(e).getBigInt64(t);
  },
  put(e, t, r) {
    return G(e).setBigInt64(t, r), t + 8;
  }
}, d_ = {
  len: 2,
  get(e, t) {
    return Wi(e, t, !1, 10, this.len);
  },
  put(e, t, r) {
    return Vi(e, r, t, !1, 10, this.len), t + this.len;
  }
}, p_ = {
  len: 2,
  get(e, t) {
    return Wi(e, t, !0, 10, this.len);
  },
  put(e, t, r) {
    return Vi(e, r, t, !0, 10, this.len), t + this.len;
  }
}, h_ = {
  len: 4,
  get(e, t) {
    return G(e).getFloat32(t);
  },
  put(e, t, r) {
    return G(e).setFloat32(t, r), t + 4;
  }
}, m_ = {
  len: 4,
  get(e, t) {
    return G(e).getFloat32(t, !0);
  },
  put(e, t, r) {
    return G(e).setFloat32(t, r, !0), t + 4;
  }
}, g_ = {
  len: 8,
  get(e, t) {
    return G(e).getFloat64(t);
  },
  put(e, t, r) {
    return G(e).setFloat64(t, r), t + 8;
  }
}, y_ = {
  len: 8,
  get(e, t) {
    return G(e).getFloat64(t, !0);
  },
  put(e, t, r) {
    return G(e).setFloat64(t, r, !0), t + 8;
  }
}, x_ = {
  len: 10,
  get(e, t) {
    return Wi(e, t, !1, 63, this.len);
  },
  put(e, t, r) {
    return Vi(e, r, t, !1, 63, this.len), t + this.len;
  }
}, w_ = {
  len: 10,
  get(e, t) {
    return Wi(e, t, !0, 63, this.len);
  },
  put(e, t, r) {
    return Vi(e, r, t, !0, 63, this.len), t + this.len;
  }
};
class E_ {
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
class zf {
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
    return QT(n, this.encoding);
  }
}
class v_ extends ge {
  constructor(t) {
    super(t, "windows-1252");
  }
}
const WS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnsiStringType: v_,
  Float16_BE: d_,
  Float16_LE: p_,
  Float32_BE: h_,
  Float32_LE: m_,
  Float64_BE: g_,
  Float64_LE: y_,
  Float80_BE: x_,
  Float80_LE: w_,
  INT16_BE: i_,
  INT16_LE: a_,
  INT24_BE: o_,
  INT24_LE: s_,
  INT32_BE: Bf,
  INT32_LE: l_,
  INT64_BE: f_,
  INT64_LE: c_,
  INT8: as,
  IgnoreType: E_,
  StringType: ge,
  UINT16_BE: qt,
  UINT16_LE: ne,
  UINT24_BE: Mf,
  UINT24_LE: Uf,
  UINT32_BE: wi,
  UINT32_LE: W,
  UINT64_BE: u_,
  UINT64_LE: jf,
  UINT8: Yt,
  Uint8ArrayType: zf
}, Symbol.toStringTag, { value: "Module" })), gr = {
  LocalFileHeader: 67324752,
  DataDescriptor: 134695760,
  CentralFileHeader: 33639248,
  EndOfCentralDirectory: 101010256
}, fc = {
  get(e) {
    return {
      signature: W.get(e, 0),
      compressedSize: W.get(e, 8),
      uncompressedSize: W.get(e, 12)
    };
  },
  len: 16
}, T_ = {
  get(e) {
    const t = ne.get(e, 6);
    return {
      signature: W.get(e, 0),
      minVersion: ne.get(e, 4),
      dataDescriptor: !!(t & 8),
      compressedMethod: ne.get(e, 8),
      compressedSize: W.get(e, 18),
      uncompressedSize: W.get(e, 22),
      filenameLength: ne.get(e, 26),
      extraFieldLength: ne.get(e, 28),
      filename: null
    };
  },
  len: 30
}, __ = {
  get(e) {
    return {
      signature: W.get(e, 0),
      nrOfThisDisk: ne.get(e, 4),
      nrOfThisDiskWithTheStart: ne.get(e, 6),
      nrOfEntriesOnThisDisk: ne.get(e, 8),
      nrOfEntriesOfSize: ne.get(e, 10),
      sizeOfCd: W.get(e, 12),
      offsetOfStartOfCd: W.get(e, 16),
      zipFileCommentLength: ne.get(e, 20)
    };
  },
  len: 22
}, b_ = {
  get(e) {
    const t = ne.get(e, 8);
    return {
      signature: W.get(e, 0),
      minVersion: ne.get(e, 6),
      dataDescriptor: !!(t & 8),
      compressedMethod: ne.get(e, 10),
      compressedSize: W.get(e, 20),
      uncompressedSize: W.get(e, 24),
      filenameLength: ne.get(e, 28),
      extraFieldLength: ne.get(e, 30),
      fileCommentLength: ne.get(e, 32),
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
const rt = Ar("tokenizer:inflate"), La = 256 * 1024, S_ = Gf(gr.DataDescriptor), Yn = Gf(gr.EndOfCentralDirectory);
class Gs {
  constructor(t) {
    this.tokenizer = t, this.syncBuffer = new Uint8Array(La);
  }
  async isZip() {
    return await this.peekSignature() === gr.LocalFileHeader;
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
      const n = await this.tokenizer.readToken(__, r), i = [];
      this.tokenizer.setPosition(n.offsetOfStartOfCd);
      for (let a = 0; a < n.nrOfEntriesOfSize; ++a) {
        const s = await this.tokenizer.readToken(b_);
        if (s.signature !== gr.CentralFileHeader)
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
        let l = La;
        rt("Compressed-file-size unknown, scanning for next data-descriptor-signature....");
        let p = -1;
        for (; p < 0 && l === La; ) {
          l = await this.tokenizer.peekBuffer(this.syncBuffer, { mayBeLess: !0 }), p = A_(this.syncBuffer.subarray(0, l), S_);
          const c = p >= 0 ? p : l;
          if (a.handler) {
            const u = new Uint8Array(c);
            await this.tokenizer.readBuffer(u), o.push(u);
          } else
            await this.tokenizer.ignore(c);
        }
        rt(`Found data-descriptor-signature at pos=${this.tokenizer.position}`), a.handler && await this.inflate(i, I_(o), a.handler);
      } else
        a.handler ? (rt(`Reading compressed-file-data: ${i.compressedSize} bytes`), s = new Uint8Array(i.compressedSize), await this.tokenizer.readBuffer(s), await this.inflate(i, s, a.handler)) : (rt(`Ignoring compressed-file-data: ${i.compressedSize} bytes`), await this.tokenizer.ignore(i.compressedSize));
      if (rt(`Reading data-descriptor at pos=${this.tokenizer.position}`), i.dataDescriptor && (await this.tokenizer.readToken(fc)).signature !== 134695760)
        throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - fc.len}`);
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
    const i = await Gs.decompressDeflateRaw(r);
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
    if (t === gr.LocalFileHeader) {
      const r = await this.tokenizer.readToken(T_);
      return r.filename = await this.tokenizer.readToken(new ge(r.filenameLength, "utf-8")), r;
    }
    if (t === gr.CentralFileHeader)
      return !1;
    throw t === 3759263696 ? new Error("Encrypted ZIP") : new Error("Unexpected signature");
  }
}
function A_(e, t) {
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
function I_(e) {
  const t = e.reduce((i, a) => i + a.length, 0), r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    r.set(i, n), n += i.length;
  return r;
}
class C_ {
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
const R_ = Object.prototype.toString, O_ = "[object Uint8Array]";
function D_(e, t, r) {
  return e ? e.constructor === t ? !0 : R_.call(e) === r : !1;
}
function P_(e) {
  return D_(e, Uint8Array, O_);
}
function k_(e) {
  if (!P_(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
new globalThis.TextDecoder("utf8");
function N_(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
new globalThis.TextEncoder();
const F_ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function VS(e) {
  k_(e);
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += F_[e[r]];
  return t;
}
const dc = {
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
function YS(e) {
  if (N_(e), e.length % 2 !== 0)
    throw new Error("Invalid Hex string length.");
  const t = e.length / 2, r = new Uint8Array(t);
  for (let n = 0; n < t; n++) {
    const i = dc[e[n * 2]], a = dc[e[n * 2 + 1]];
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
function $_(e, t) {
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
function L_(e, t = 0) {
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
const U_ = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, M_ = [
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
], B_ = [
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
], Ua = 4100;
async function Hf(e, t) {
  return new j_(t).fromBuffer(e);
}
function Ma(e) {
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
class j_ {
  constructor(t) {
    // Detections with a high degree of certainty in identifying the correct file type
    ia(this, "detectConfident", async (t) => {
      if (this.buffer = new Uint8Array(Ua), t.fileInfo.size === void 0 && (t.fileInfo.size = Number.MAX_SAFE_INTEGER), this.tokenizer = t, await t.peekBuffer(this.buffer, { length: 32, mayBeLess: !0 }), this.check([66, 77]))
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
        const n = new C_(t).inflate();
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
        const r = await t.readToken(U_);
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
        return await new Gs(t).unzip((n) => {
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
                  r = Ma(a);
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
                    a.includes(`ContentType="${o}"`) && (r = Ma(o));
                  } else {
                    a = a.slice(0, Math.max(0, s));
                    const o = a.lastIndexOf('"'), l = a.slice(Math.max(0, o + 1));
                    r = Ma(l);
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
          if (!(n instanceof Ae))
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
          let l = 128, p = 0;
          for (; !(o & l) && l !== 0; )
            ++p, l >>= 1;
          const c = new Uint8Array(p + 1);
          return await t.readBuffer(c), c;
        }
        async function n() {
          const o = await r(), l = await r();
          l[0] ^= 128 >> l.length - 1;
          const p = Math.min(6, l.length), c = new DataView(o.buffer), u = new DataView(l.buffer, l.length - p, p);
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
            size: Number(await t.readToken(jf))
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
      if (await t.peekBuffer(this.buffer, { length: Math.min(512, t.fileInfo.size), mayBeLess: !0 }), this.checkString("ustar", { offset: 257 }) && (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 })) || this.check([0, 0, 0, 0, 0, 0], { offset: 257 }) && L_(this.buffer))
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
      if (this.buffer = new Uint8Array(Ua), await t.peekBuffer(this.buffer, { length: Math.min(8, t.fileInfo.size), mayBeLess: !0 }), this.check([0, 0, 1, 186]) || this.check([0, 0, 1, 179]))
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
    const r = KT(t, this.tokenizerOptions);
    try {
      return await this.fromTokenizer(r);
    } finally {
      await r.close();
    }
  }
  async fromStream(t) {
    const r = YT(t, this.tokenizerOptions);
    try {
      return await this.fromTokenizer(r);
    } finally {
      await r.close();
    }
  }
  async toDetectionStream(t, r) {
    const { sampleSize: n = Ua } = r;
    let i, a;
    const s = t.getReader({ mode: "byob" });
    try {
      const { value: p, done: c } = await s.read(new Uint8Array(n));
      if (a = p, !c && p)
        try {
          i = await this.fromBuffer(p.subarray(0, n));
        } catch (u) {
          if (!(u instanceof Ae))
            throw u;
          i = void 0;
        }
      a = p;
    } finally {
      s.releaseLock();
    }
    const o = new TransformStream({
      async start(p) {
        p.enqueue(a);
      },
      transform(p, c) {
        c.enqueue(p);
      }
    }), l = t.pipeThrough(o);
    return l.fileType = i, l;
  }
  check(t, r) {
    return nt(this.buffer, t, r);
  }
  checkString(t, r) {
    return this.check($_(t, r == null ? void 0 : r.encoding), r);
  }
  async readTiffTag(t) {
    const r = await this.tokenizer.readToken(t ? qt : ne);
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
    const r = await this.tokenizer.readToken(t ? qt : ne);
    for (let n = 0; n < r; ++n) {
      const i = await this.readTiffTag(t);
      if (i)
        return i;
    }
  }
  async readTiffHeader(t) {
    const r = (t ? qt : ne).get(this.buffer, 2), n = (t ? wi : W).get(this.buffer, 4);
    if (r === 42) {
      if (n >= 6) {
        if (this.checkString("CR", { offset: 8 }))
          return {
            ext: "cr2",
            mime: "image/x-canon-cr2"
          };
        if (n >= 8) {
          const a = (t ? qt : ne).get(this.buffer, 8), s = (t ? qt : ne).get(this.buffer, 10);
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
new Set(M_);
new Set(B_);
var Hs = {};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
var pc = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g, z_ = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/, qf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/, G_ = /\\([\u000b\u0020-\u00ff])/g, H_ = /([\\"])/g, Xf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
Hs.format = q_;
Hs.parse = X_;
function q_(e) {
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
      n += "; " + i + "=" + V_(t[i]);
    }
  return n;
}
function X_(e) {
  if (!e)
    throw new TypeError("argument string is required");
  var t = typeof e == "object" ? W_(e) : e;
  if (typeof t != "string")
    throw new TypeError("argument string is required to be a string");
  var r = t.indexOf(";"), n = r !== -1 ? t.slice(0, r).trim() : t.trim();
  if (!Xf.test(n))
    throw new TypeError("invalid media type");
  var i = new Y_(n.toLowerCase());
  if (r !== -1) {
    var a, s, o;
    for (pc.lastIndex = r; s = pc.exec(t); ) {
      if (s.index !== r)
        throw new TypeError("invalid parameter format");
      r += s[0].length, a = s[1].toLowerCase(), o = s[2], o.charCodeAt(0) === 34 && (o = o.slice(1, -1), o.indexOf("\\") !== -1 && (o = o.replace(G_, "$1"))), i.parameters[a] = o;
    }
    if (r !== t.length)
      throw new TypeError("invalid parameter format");
  }
  return i;
}
function W_(e) {
  var t;
  if (typeof e.getHeader == "function" ? t = e.getHeader("content-type") : typeof e.headers == "object" && (t = e.headers && e.headers["content-type"]), typeof t != "string")
    throw new TypeError("content-type header is missing from object");
  return t;
}
function V_(e) {
  var t = String(e);
  if (qf.test(t))
    return t;
  if (t.length > 0 && !z_.test(t))
    throw new TypeError("invalid parameter value");
  return '"' + t.replace(H_, "\\$1") + '"';
}
function Y_(e) {
  this.parameters = /* @__PURE__ */ Object.create(null), this.type = e;
}
/*!
 * media-typer
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
var K_ = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/, J_ = Q_;
function Q_(e) {
  if (!e)
    throw new TypeError("argument string is required");
  if (typeof e != "string")
    throw new TypeError("argument string is required to be a string");
  var t = K_.exec(e.toLowerCase());
  if (!t)
    throw new TypeError("invalid media type");
  var r = t[1], n = t[2], i, a = n.lastIndexOf("+");
  return a !== -1 && (i = n.substr(a + 1), n = n.substr(0, a)), new Z_(r, n, i);
}
function Z_(e, t, r) {
  this.type = e, this.subtype = t, this.suffix = r;
}
const KS = {
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
}, eb = {
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
class tb extends vn("UnexpectedFileContentError") {
  constructor(t, r) {
    super(r), this.fileType = t;
  }
  // Override toString to include file type information.
  toString() {
    return `${this.name} (FileType: ${this.fileType}): ${this.message}`;
  }
}
class qs extends vn("FieldDecodingError") {
}
class Yf extends vn("InternalParserError") {
}
const rb = (e) => class extends tb {
  constructor(t) {
    super(e, t);
  }
};
function zr(e, t, r) {
  return (e[t] & 1 << r) !== 0;
}
function hc(e, t, r, n) {
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
function nb(e) {
  const t = e.indexOf("\0");
  return t === -1 ? e : e.substr(0, t);
}
function ib(e) {
  const t = e.length;
  if (t & 1)
    throw new qs("Buffer length must be even");
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
      throw new qs("Expected even number of octets for 16-bit unicode string");
    return os(ib(e), t);
  }
  return new ge(e.length, t).get(e, 0);
}
function QS(e) {
  return e = e.replace(/^\x00+/g, ""), e = e.replace(/\x00+$/g, ""), e;
}
function Kf(e, t, r, n) {
  const i = t + ~~(r / 8), a = r % 8;
  let s = e[i];
  s &= 255 >> a;
  const o = 8 - a, l = n - o;
  return l < 0 ? s >>= 8 - a - n : l > 0 && (s <<= l, s |= Kf(e, t, r + o, l)), s;
}
function ZS(e, t, r) {
  return Kf(e, t, r, 1) === 1;
}
function ab(e) {
  const t = [];
  for (let r = 0, n = e.length; r < n; r++) {
    const i = Number(e.charCodeAt(r)).toString(16);
    t.push(i.length === 1 ? `0${i}` : i);
  }
  return t.join(" ");
}
function sb(e) {
  return 10 * Math.log10(e);
}
function ob(e) {
  return 10 ** (e / 10);
}
function lb(e) {
  const t = e.split(" ").map((r) => r.trim().toLowerCase());
  if (t.length >= 1) {
    const r = Number.parseFloat(t[0]);
    return t.length === 2 && t[1] === "db" ? {
      dB: r,
      ratio: ob(r)
    } : {
      dB: sb(r),
      ratio: r
    };
  }
}
function eA(e) {
  if (e.length === 0)
    throw new Error("decodeUintBE: empty Uint8Array");
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength);
  return ss(t);
}
const tA = {
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
}, cb = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, rA = {
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
      unsynchronisation: zr(e, t + 5, 7),
      // Extended header
      isExtendedHeader: zr(e, t + 5, 6),
      // Experimental indicator
      expIndicator: zr(e, t + 5, 5),
      footer: zr(e, t + 5, 4)
    },
    size: cb.get(e, t + 6)
  })
}, nA = {
  len: 10,
  get: (e, t) => ({
    // Extended header size
    size: wi.get(e, t),
    // Extended Flags
    extendedFlags: qt.get(e, t + 4),
    // Size of padding
    sizeOfPadding: wi.get(e, t + 6),
    // CRC data present
    crcDataPresent: zr(e, t + 4, 31)
  })
}, ub = {
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
}, fb = {
  len: 4,
  get: (e, t) => ({
    encoding: ub.get(e, t),
    language: new ge(3, "latin1").get(e, t + 1)
  })
}, iA = {
  len: 6,
  get: (e, t) => {
    const r = fb.get(e, t);
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
function db(e) {
  return Ei[e] && !Ei[e].multiple;
}
function pb(e) {
  return !Ei[e].multiple || Ei[e].unique || !1;
}
class ze {
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
ze.maxRatingScore = 1;
const hb = {
  title: "title",
  artist: "artist",
  album: "album",
  year: "year",
  comment: "comment",
  track: "track",
  genre: "genre"
};
class mb extends ze {
  constructor() {
    super(["ID3v1"], hb);
  }
}
class Tn extends ze {
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
const gb = {
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
class Xs extends Tn {
  static toRating(t) {
    return {
      source: t.email,
      rating: t.rating > 0 ? (t.rating - 1) / 254 * ze.maxRatingScore : void 0
    };
  }
  constructor() {
    super(["ID3v2.3", "ID3v2.4"], gb);
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
        t.value = Xs.toRating(t.value);
        break;
    }
  }
}
const yb = {
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
class Ws extends ze {
  static toRating(t) {
    return {
      rating: Number.parseFloat(t + 1) / 5
    };
  }
  constructor() {
    super(["asf"], yb);
  }
  postMap(t) {
    switch (t.id) {
      case "WM/SharedUserRating": {
        const r = t.id.split(":");
        t.value = Ws.toRating(t.value), t.id = r[0];
        break;
      }
    }
  }
}
const xb = {
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
class wb extends Tn {
  constructor() {
    super(["ID3v2.2"], xb);
  }
}
const Eb = {
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
class vb extends Tn {
  constructor() {
    super(["APEv2"], Eb);
  }
}
const Tb = {
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
}, _b = "iTunes";
class mc extends Tn {
  constructor() {
    super([_b], Tb);
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
const bb = {
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
class vi extends ze {
  static toRating(t, r, n) {
    return {
      source: t ? t.toLowerCase() : void 0,
      rating: Number.parseFloat(r) / n * ze.maxRatingScore
    };
  }
  constructor() {
    super(["vorbis"], bb);
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
const Sb = {
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
class Ab extends ze {
  constructor() {
    super(["exif"], Sb);
  }
}
const Ib = {
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
class Cb extends Tn {
  constructor() {
    super(["matroska"], Ib);
  }
}
const Rb = {
  NAME: "title",
  AUTH: "artist",
  "(c) ": "copyright",
  ANNO: "comment"
};
class Ob extends ze {
  constructor() {
    super(["AIFF"], Rb);
  }
}
class Db {
  constructor() {
    this.tagMappers = {}, [
      new mb(),
      new wb(),
      new Xs(),
      new mc(),
      new mc(),
      new vi(),
      new vb(),
      new Ws(),
      new Ab(),
      new Cb(),
      new Ob()
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
function Pb(e) {
  return ls.test(e) ? Nb(e) : kb(e);
}
function kb(e) {
  return {
    contentType: Jf.lyrics,
    timeStampFormat: Qf.notSynchronized,
    text: e.trim(),
    syncText: []
  };
}
function Nb(e) {
  const t = e.split(`
`), r = [];
  for (const n of t) {
    const i = n.match(ls);
    if (i) {
      const a = Number.parseInt(i[1], 10), s = Number.parseInt(i[2], 10), o = i[3].length === 3 ? Number.parseInt(i[3], 10) : Number.parseInt(i[3], 10) * 10, l = (a * 60 + s) * 1e3 + o, p = n.replace(ls, "").trim();
      r.push({ timestamp: l, text: p });
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
const Bt = Ar("music-metadata:collector"), Fb = ["matroska", "APEv2", "vorbis", "ID3v2.4", "ID3v2.3", "ID3v2.2", "exif", "asf", "iTunes", "AIFF", "ID3v1"];
class $b {
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
    }, this.commonOrigin = {}, this.originPriority = {}, this.tagMapper = new Db(), this.opts = t;
    let r = 1;
    for (const n of Fb)
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
    Bt(`streamInfo: type=${t.type ? eb[t.type] : "?"}, codec=${t.codecName}`), this.format.trackInfo.push(t);
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
          const n = (this.common.artists || []).concat([r.value]), a = { id: "artist", value: Lb(n) };
          this.setGenericTag("artificial", a);
        }
        break;
      case "picture":
        return this.postFixPicture(r.value).then((n) => {
          n !== null && (r.value = n, this.setGenericTag(t, r));
        });
      case "totaltracks":
        this.common.track.of = ze.toIntOrNull(r.value);
        return;
      case "totaldiscs":
        this.common.disk.of = ze.toIntOrNull(r.value);
        return;
      case "movementTotal":
        this.common.movementIndex.of = ze.toIntOrNull(r.value);
        return;
      case "track":
      case "disk":
      case "movementIndex": {
        const n = this.common[r.id].of;
        this.common[r.id] = ze.normalizeTrack(r.value), this.common[r.id].of = n ?? this.common[r.id].of;
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
        r.value = lb(r.value);
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
        typeof r.value == "string" && (r.value = Pb(r.value));
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
    if (db(r.id))
      if (i <= n)
        this.common[r.id] = r.value, this.commonOrigin[r.id] = i;
      else
        return Bt(`Ignore native tag (singleton): ${t}.${r.id} = ${r.value}`);
    else if (i === n)
      !pb(r.id) || this.common[r.id].indexOf(r.value) === -1 ? this.common[r.id].push(r.value) : Bt(`Ignore duplicate value: ${t}.${r.id} = ${r.value}`);
    else if (i < n)
      this.common[r.id] = [r.value], this.commonOrigin[r.id] = i;
    else
      return Bt(`Ignore native tag (list): ${t}.${r.id} = ${r.value}`);
    (a = this.opts) != null && a.observer && this.opts.observer({ metadata: this, tag: { type: "common", id: r.id, value: r.value } });
  }
}
function Lb(e) {
  return e.length > 2 ? `${e.slice(0, e.length - 1).join(", ")} & ${e[e.length - 1]}` : e.join(" & ");
}
const Ub = {
  parserType: "mpeg",
  extensions: [".mp2", ".mp3", ".m2a", ".aac", "aacp"],
  mimeTypes: ["audio/mpeg", "audio/mp3", "audio/aacs", "audio/aacp"],
  async load() {
    return (await import("./MpegParser-yi4R-j0O.js")).MpegParser;
  }
}, Mb = {
  parserType: "apev2",
  extensions: [".ape"],
  mimeTypes: ["audio/ape", "audio/monkeys-audio"],
  async load() {
    return (await Promise.resolve().then(() => gS)).APEv2Parser;
  }
}, Bb = {
  parserType: "asf",
  extensions: [".asf"],
  mimeTypes: ["audio/ms-wma", "video/ms-wmv", "audio/ms-asf", "video/ms-asf", "application/vnd.ms-asf"],
  async load() {
    return (await import("./AsfParser-BThMowbK.js")).AsfParser;
  }
}, jb = {
  parserType: "dsdiff",
  extensions: [".dff"],
  mimeTypes: ["audio/dsf", "audio/dsd"],
  async load() {
    return (await import("./DsdiffParser-DcAOuyR_.js")).DsdiffParser;
  }
}, zb = {
  parserType: "aiff",
  extensions: [".aif", "aiff", "aifc"],
  mimeTypes: ["audio/aiff", "audio/aif", "audio/aifc", "application/aiff"],
  async load() {
    return (await import("./AiffParser-E69ldTgi.js")).AIFFParser;
  }
}, Gb = {
  parserType: "dsf",
  extensions: [".dsf"],
  mimeTypes: ["audio/dsf"],
  async load() {
    return (await import("./DsfParser-wzmGHXqv.js")).DsfParser;
  }
}, Hb = {
  parserType: "flac",
  extensions: [".flac"],
  mimeTypes: ["audio/flac"],
  async load() {
    return (await import("./FlacParser-CT5TtL6w.js").then((e) => e.d)).FlacParser;
  }
}, qb = {
  parserType: "matroska",
  extensions: [".mka", ".mkv", ".mk3d", ".mks", "webm"],
  mimeTypes: ["audio/matroska", "video/matroska", "audio/webm", "video/webm"],
  async load() {
    return (await import("./MatroskaParser-DCulQRnn.js")).MatroskaParser;
  }
}, Xb = {
  parserType: "mp4",
  extensions: [".mp4", ".m4a", ".m4b", ".m4pa", "m4v", "m4r", "3gp", ".mov", ".movie", ".qt"],
  mimeTypes: ["audio/mp4", "audio/m4a", "video/m4v", "video/mp4", "video/quicktime"],
  async load() {
    return (await import("./MP4Parser-BcV8RYww.js")).MP4Parser;
  }
}, Wb = {
  parserType: "musepack",
  extensions: [".mpc"],
  mimeTypes: ["audio/musepack"],
  async load() {
    return (await import("./MusepackParser-DX9h_91x.js")).MusepackParser;
  }
}, Vb = {
  parserType: "ogg",
  extensions: [".ogg", ".ogv", ".oga", ".ogm", ".ogx", ".opus", ".spx"],
  mimeTypes: ["audio/ogg", "audio/opus", "audio/speex", "video/ogg"],
  // RFC 7845, RFC 6716, RFC 5574
  async load() {
    return (await import("./OggParser-DSZxzJs1.js")).OggParser;
  }
}, Yb = {
  parserType: "wavpack",
  extensions: [".wv", ".wvp"],
  mimeTypes: ["audio/wavpack"],
  async load() {
    return (await import("./WavPackParser-DMdguc4g.js")).WavPackParser;
  }
}, Kb = {
  parserType: "riff",
  extensions: [".wav", "wave", ".bwf"],
  mimeTypes: ["audio/vnd.wave", "audio/wav", "audio/wave"],
  async load() {
    return (await import("./WaveParser-B4PASuz_.js")).WaveParser;
  }
}, jt = Ar("music-metadata:parser:factory");
function Jb(e) {
  const t = Hs.parse(e), r = J_(t.type);
  return {
    type: r.type,
    subtype: r.subtype,
    suffix: r.suffix,
    parameters: t.parameters
  };
}
class Qb {
  constructor() {
    this.parsers = [], [
      Hb,
      Ub,
      Mb,
      Xb,
      qb,
      Kb,
      Vb,
      Bb,
      zb,
      Yb,
      Wb,
      Gb,
      jb
    ].forEach((t) => {
      this.registerParser(t);
    });
  }
  registerParser(t) {
    this.parsers.push(t);
  }
  async parse(t, r, n) {
    if (t.supportsRandomAccess() ? (jt("tokenizer supports random-access, scanning for appending headers"), await ES(t, n)) : jt("tokenizer does not support random-access, cannot scan for appending headers"), !r) {
      const o = new Uint8Array(4100);
      if (t.fileInfo.mimeType && (r = this.findLoaderForContentType(t.fileInfo.mimeType)), !r && t.fileInfo.path && (r = this.findLoaderForExtension(t.fileInfo.path)), !r) {
        jt("Guess parser on content..."), await t.peekBuffer(o, { mayBeLess: !0 });
        const l = await Hf(o, { mpegOffsetTolerance: 10 });
        if (!l || !l.mime)
          throw new Wf("Failed to determine audio format");
        if (jt(`Guessed file type is mime=${l.mime}, extension=${l.ext}`), r = this.findLoaderForContentType(l.mime), !r)
          throw new Vf(`Guessed MIME-type not supported: ${l.mime}`);
      }
    }
    jt(`Loading ${r.parserType} parser...`);
    const i = new $b(n), a = await r.load(), s = new a(i, t, n ?? {});
    return jt(`Parser ${r.parserType} loaded`), await s.parse(), i.format.trackInfo && (i.format.hasAudio === void 0 && i.setFormat("hasAudio", !!i.format.trackInfo.find((o) => o.type === ft.audio)), i.format.hasVideo === void 0 && i.setFormat("hasVideo", !!i.format.trackInfo.find((o) => o.type === ft.video))), i.toCommonMetadata();
  }
  /**
   * @param filePath - Path, filename or extension to audio file
   * @return Parser submodule name
   */
  findLoaderForExtension(t) {
    if (!t)
      return;
    const r = Zb(t).toLocaleLowerCase() || t;
    return this.parsers.find((n) => n.extensions.indexOf(r) !== -1);
  }
  findLoaderForContentType(t) {
    let r;
    if (!t)
      return;
    try {
      r = Jb(t);
    } catch {
      jt(`Invalid HTTP Content-Type header value: ${t}`);
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
function Zb(e) {
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
function eS() {
  if (!(typeof globalThis.TextDecoder > "u"))
    return Kn ?? (Kn = new globalThis.TextDecoder("utf-8"));
}
function tS() {
  if (!(typeof globalThis.TextEncoder > "u"))
    return Jn ?? (Jn = new globalThis.TextEncoder());
}
const Qt = 32 * 1024;
function Yi(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = eS();
      return r ? r.decode(e) : nS(e);
    }
    case "utf-16le":
      return iS(e);
    case "us-ascii":
    case "ascii":
      return aS(e);
    case "latin1":
    case "iso-8859-1":
      return sS(e);
    case "windows-1252":
      return oS(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function rS(e = "", t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = tS();
      return r ? r.encode(e) : lS(e);
    }
    case "utf-16le":
      return cS(e);
    case "us-ascii":
    case "ascii":
      return uS(e);
    case "latin1":
    case "iso-8859-1":
      return fS(e);
    case "windows-1252":
      return dS(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function nS(e) {
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
function iS(e) {
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
function aS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Qt) {
    const n = Math.min(e.length, r + Qt), i = new Array(n - r);
    for (let a = r, s = 0; a < n; a++, s++)
      i[s] = e[a] & 127;
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function sS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Qt) {
    const n = Math.min(e.length, r + Qt), i = new Array(n - r);
    for (let a = r, s = 0; a < n; a++, s++)
      i[s] = e[a];
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function oS(e) {
  const t = [];
  let r = "";
  for (let n = 0; n < e.length; n++) {
    const i = e[n], a = i >= 128 && i <= 159 ? ed[i] : void 0;
    r += a ?? String.fromCharCode(i), r.length >= Qt && (t.push(r), r = "");
  }
  return r && t.push(r), t.join("");
}
function lS(e) {
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
function cS(e) {
  const t = new Uint8Array(e.length * 2);
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r), i = r * 2;
    t[i] = n & 255, t[i + 1] = n >>> 8;
  }
  return t;
}
function uS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r) & 127;
  return t;
}
function fS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r) & 255;
  return t;
}
function dS(e) {
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
const pS = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/, rd = {
  len: 4,
  get: (e, t) => {
    const r = Yi(e.subarray(t, t + rd.len), "latin1");
    if (!r.match(pS))
      throw new qs(`FourCC contains invalid characters: ${ab(r)} "${r}"`);
    return r;
  },
  put: (e, t, r) => {
    const n = rS(r, "latin1");
    if (n.length !== 4)
      throw new Yf("Invalid length");
    return e.set(n, t), t + 4;
  }
}, Qn = {
  text_utf8: 0,
  binary: 1,
  external_info: 2,
  reserved: 3
}, gc = {
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
    fileMD5: new zf(16).get(e, t + 36)
  })
}, hS = {
  len: 24,
  get: (e, t) => ({
    // the compression level (see defines I.E. COMPRESSION_LEVEL_FAST)
    compressionLevel: ne.get(e, t),
    // any format flags (for future use)
    formatFlags: ne.get(e, t + 2),
    // the number of audio blocks in one frame
    blocksPerFrame: W.get(e, t + 4),
    // the number of audio blocks in the final frame
    finalFrameBlocks: W.get(e, t + 8),
    // the total number of frames
    totalFrames: W.get(e, t + 12),
    // the bits per sample (typically 16)
    bitsPerSample: ne.get(e, t + 16),
    // the number of channels (1 or 2)
    channel: ne.get(e, t + 18),
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
}, Ba = {
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
const wt = Ar("music-metadata:parser:APEv2"), yc = "APEv2", xc = "APETAGEX";
class si extends rb("APEv2") {
}
function mS(e, t, r) {
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
    if (i.ID !== xc)
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
    if (t.ID === xc)
      return await this.tokenizer.ignore(je.len), this.parseTags(t);
    if (wt(`APEv2 header not found at offset=${this.tokenizer.position}`), this.tokenizer.fileInfo.size) {
      const r = this.tokenizer.fileInfo.size - this.tokenizer.position, n = new Uint8Array(r);
      return await this.tokenizer.readBuffer(n), St.parseTagFooter(this.metadata, n, this.options);
    }
  }
  async parse() {
    const t = await this.tokenizer.readToken(gc);
    if (t.ID !== "MAC ")
      throw new si("Unexpected descriptor ID");
    this.ape.descriptor = t;
    const r = t.descriptorBytes - gc.len, n = await (r > 0 ? this.parseDescriptorExpansion(r) : this.parseHeader());
    return this.metadata.setAudioOnly(), await this.tokenizer.ignore(n.forwardBytes), this.tryParseApeHeader();
  }
  async parseTags(t) {
    const r = new Uint8Array(256);
    let n = t.size - je.len;
    wt(`Parse APE tags at offset=${this.tokenizer.position}, size=${n}`);
    for (let i = 0; i < t.fields; i++) {
      if (n < Ba.len) {
        this.metadata.addWarning(`APEv2 Tag-header: ${t.fields - i} items remaining, but no more tag data to read.`);
        break;
      }
      const a = await this.tokenizer.readToken(Ba);
      n -= Ba.len + a.size, await this.tokenizer.peekBuffer(r, { length: Math.min(r.length, n) });
      let s = hc(r, 0, r.length);
      const o = await this.tokenizer.readToken(new ge(s, "ascii"));
      switch (await this.tokenizer.ignore(1), n -= o.length + 1, a.flags.dataType) {
        case Qn.text_utf8: {
          const p = (await this.tokenizer.readToken(new ge(a.size, "utf8"))).split(/\x00/g);
          await Promise.all(p.map((c) => this.metadata.addTag(yc, o, c)));
          break;
        }
        case Qn.binary:
          if (this.options.skipCovers)
            await this.tokenizer.ignore(a.size);
          else {
            const l = new Uint8Array(a.size);
            await this.tokenizer.readBuffer(l), s = hc(l, 0, l.length);
            const p = Yi(l.subarray(0, s), "utf-8"), c = l.subarray(s + 1);
            await this.metadata.addTag(yc, o, {
              description: p,
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
    const t = await this.tokenizer.readToken(hS);
    if (this.metadata.setFormat("lossless", !0), this.metadata.setFormat("container", "Monkey's Audio"), this.metadata.setFormat("bitsPerSample", t.bitsPerSample), this.metadata.setFormat("sampleRate", t.sampleRate), this.metadata.setFormat("numberOfChannels", t.channel), this.metadata.setFormat("duration", St.calculateDuration(t)), !this.ape.descriptor)
      throw new si("Missing APE descriptor");
    return {
      forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes
    };
  }
}
const gS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  APEv2Parser: St,
  ApeContentError: si,
  tryParseApeHeader: mS
}, Symbol.toStringTag, { value: "Module" })), ei = Ar("music-metadata:parser:ID3v1"), wc = [
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
    const r = new cr(3).get(e, t);
    return r === "TAG" ? {
      header: r,
      title: new cr(30).get(e, t + 3),
      artist: new cr(30).get(e, t + 33),
      album: new cr(30).get(e, t + 63),
      year: new cr(4).get(e, t + 93),
      comment: new cr(28).get(e, t + 97),
      // ID3v1.1 separator for track
      zeroByte: Yt.get(e, t + 127),
      // track: ID3v1.1 field added by Michael Mutschler
      track: Yt.get(e, t + 126),
      genre: Yt.get(e, t + 127)
    } : null;
  }
};
class cr {
  constructor(t) {
    this.len = t, this.stringType = new ge(t, "latin1");
  }
  get(t, r) {
    let n = this.stringType.get(t, r);
    return n = nb(n), n = n.trim(), n.length > 0 ? n : void 0;
  }
}
class id extends Zf {
  constructor(t, r, n) {
    super(t, r, n), this.apeHeader = n.apeHeader;
  }
  static getGenre(t) {
    if (t < wc.length)
      return wc[t];
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
async function yS(e) {
  if (e.fileInfo.size >= 128) {
    const t = new Uint8Array(3), r = e.position;
    return await e.readBuffer(t, { position: e.fileInfo.size - 128 }), e.setPosition(r), Yi(t, "latin1") === "TAG";
  }
  return !1;
}
const xS = "LYRICS200";
async function wS(e) {
  const t = e.fileInfo.size;
  if (t >= 143) {
    const r = new Uint8Array(15), n = e.position;
    await e.readBuffer(r, { position: t - 143 }), e.setPosition(n);
    const i = Yi(r, "latin1");
    if (i.substring(6) === xS)
      return Number.parseInt(i.substring(0, 6), 10) + 15;
  }
  return 0;
}
async function ES(e, t = {}) {
  let r = e.fileInfo.size;
  if (await yS(e)) {
    r -= 128;
    const n = await wS(e);
    r -= n;
  }
  t.apeHeader = await St.findApeFooterOffset(e, r);
}
const Ec = Ar("music-metadata:parser");
async function vS(e, t = {}) {
  Ec(`parseFile: ${e}`);
  const r = await JT(e), n = new Qb();
  try {
    const i = n.findLoaderForExtension(e);
    i || Ec("Parser could not be determined by file extension");
    try {
      return await n.parse(r, i, t);
    } catch (a) {
      throw (a instanceof Wf || a instanceof Vf) && (a.message += `: ${e}`), a;
    }
  } finally {
    await r.close();
  }
}
const TS = Mr(import.meta.url);
let vc = TS("ffmpeg-static");
Ke.isPackaged && (vc = vc.replace("app.asar", "app.asar.unpacked"));
function _S(e) {
  return new Promise((t) => {
    xp(`powershell -ExecutionPolicy Bypass -File "${e}"`, (r, n) => {
      if (r) {
        t("unknown");
        return;
      }
      t(n.trim());
    });
  });
}
st.autoUpdater.allowPrerelease = !0;
const bS = Ke.requestSingleInstanceLock();
bS ? Ke.on("second-instance", () => {
  J && (J.isMinimized() && J.restore(), J.focus());
}) : Ke.quit();
const ad = Re.dirname(pp(import.meta.url));
process.env.APP_ROOT = Re.join(ad, "..");
const cs = process.env.VITE_DEV_SERVER_URL, aA = Re.join(process.env.APP_ROOT, "dist-electron"), sd = Re.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = cs ? Re.join(process.env.APP_ROOT, "public") : sd;
let J;
function od() {
  J = new Tc({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: Re.join(process.env.VITE_PUBLIC, "logo.png"),
    titleBarStyle: "hidden",
    // Custom title bar for premium look
    titleBarOverlay: {
      color: "#00000000",
      symbolColor: "#ffffff",
      height: 30
    },
    webPreferences: {
      preload: Re.join(ad, "preload.mjs"),
      webSecurity: !1,
      // simplified for local file access in dev
      backgroundThrottling: !1
    }
  }), J.webContents.on("did-finish-load", () => {
    J == null || J.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), cs ? J.loadURL(cs) : J.loadFile(Re.join(sd, "index.html"));
}
Ke.on("window-all-closed", () => {
  process.platform !== "darwin" && (Ke.quit(), J = null);
});
Ke.on("activate", () => {
  Tc.getAllWindows().length === 0 && od();
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
  J == null || J.webContents.send("update-status", { status: "downloaded", info: e }), new dp({
    title: "NeonWave 更新",
    body: "新版本已下載完成，將於重啟後自動安裝。",
    icon: Re.join(process.env.VITE_PUBLIC, "logo.png")
  }).show();
});
Ke.whenReady().then(() => {
  process.platform === "win32" && Ke.setAppUserModelId("NeonWave"), od(), qe.handle("dialog:openDirectory", async () => {
    const { canceled: r, filePaths: n } = await po.showOpenDialog(J, {
      properties: ["openDirectory"]
    });
    return r ? null : n[0];
  }), qe.handle("files:listMusic", async (r, n) => {
    if (!n) return [];
    try {
      const i = await aa.readdir(n), a = [".mp3", ".wav", ".wma", ".m4a", ".flac", ".ogg", ".mp4", ".mov", ".wmv", ".avi"];
      return i.filter((s) => a.includes(Re.extname(s).toLowerCase())).map((s) => Re.join(n, s));
    } catch (i) {
      return console.error("Error reading directory:", i), [];
    }
  }), qe.handle("files:readBuffer", async (r, n) => {
    try {
      return await aa.readFile(n);
    } catch (i) {
      return console.error("Error reading file:", i), null;
    }
  }), qe.handle("files:getMetadata", async (r, n) => {
    try {
      const i = await vS(n);
      let a = null;
      if (i.common.picture && i.common.picture.length > 0) {
        const s = i.common.picture[0];
        a = `data:${s.format};base64,${Buffer.from(s.data).toString("base64")}`;
      }
      return {
        title: i.common.title,
        artist: i.common.artist,
        album: i.common.album,
        artwork: a,
        duration: i.format.duration,
        codec: i.format.codec,
        bitrate: i.format.bitrate,
        sampleRate: i.format.sampleRate
      };
    } catch {
      return null;
    }
  }), qe.handle("app:active-window", async () => {
    const r = Re.join(process.env.APP_ROOT, "scripts/get-active-window.ps1");
    return await _S(r);
  });
  const e = Mr(import.meta.url)("yt-dlp-wrap").default, t = async () => {
    const r = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp", n = Re.join(Ke.getPath("userData"), r);
    try {
      await aa.access(n);
    } catch {
      console.log("Downloading yt-dlp binary..."), await e.downloadFromGithub(n), console.log("Downloaded yt-dlp to", n);
    }
    return new e(n);
  };
  qe.handle("search:youtube", async (r, n) => {
    try {
      return (await (await t()).execPromise([
        `ytsearch20:${n}`,
        "--dump-json",
        "--flat-playlist"
      ])).trim().split(`
`).map((o) => {
        try {
          return JSON.parse(o);
        } catch {
          return null;
        }
      }).filter((o) => o && o.id).map((o) => ({
        id: o.id,
        title: o.title,
        artist: o.channel || o.uploader || "Unknown",
        duration: o.duration,
        thumbnail: `https://i.ytimg.com/vi/${o.id}/hqdefault.jpg`,
        // yt-dlp flat-playlist sometimes misses thumbs
        url: o.url || `https://www.youtube.com/watch?v=${o.id}`
      }));
    } catch (i) {
      return console.error("Yt-dlp search error:", i), [];
    }
  }), qe.handle("download:youtube", async (r, n, i, a) => {
    try {
      const s = await t(), o = Mr(import.meta.url)("ffmpeg-static").replace("app.asar", "app.asar.unpacked");
      let l = i.replace(/[\\/:*?"<>|]/g, "_").trim();
      const { filePath: p } = await po.showSaveDialog(J, {
        title: "下載歌曲",
        defaultPath: `${l}.m4a`,
        // Force m4a for best playback
        filters: [{ name: "Audio (m4a)", extensions: ["m4a"] }]
      });
      return p ? new Promise((c, u) => {
        const d = [
          n,
          "-f",
          "bestaudio[ext=m4a]",
          "--ffmpeg-location",
          o,
          "--add-metadata",
          "--embed-thumbnail",
          "-o",
          p
        ];
        a && (d.push("--parse-metadata", `${a}:%(artist)s`), d.push("--parse-metadata", `${a}:%(album_artist)s`)), i && d.push("--parse-metadata", `${i}:%(title)s`);
        const m = s.exec(d);
        m.on("progress", () => {
        }), m.on("error", (w) => {
          console.error("yt-dlp error:", w), u(new Error(`下載錯誤: ${w.message}`));
        }), m.on("close", () => {
          c(p);
        });
      }) : null;
    } catch (s) {
      throw console.error("Download fatal error:", s), new Error(s.message);
    }
  }), qe.handle("search:artistImage", async (r, n) => {
    try {
      const i = `https://api.deezer.com/search/artist?q=${encodeURIComponent(n)}&limit=1`;
      try {
        const o = await fetch(i);
        if (o.ok) {
          const l = await o.json();
          if (l && l.data && l.data.length > 0) {
            const p = l.data[0].picture_medium || l.data[0].picture_big;
            if (p) return p;
          }
        }
      } catch {
      }
      const a = `https://itunes.apple.com/search?term=${encodeURIComponent(n)}&media=music&entity=album&limit=1`, s = await fetch(a);
      if (s.ok) {
        const o = await s.json();
        if (o && o.results && o.results.length > 0) {
          const l = o.results[0].artworkUrl100;
          if (l)
            return l.replace("100x100bb", "600x600bb");
        }
      }
      try {
        const o = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(n)}`, l = await fetch(o);
        if (l.ok) {
          const p = await l.json();
          if (p && p.artists && p.artists.length > 0) {
            const c = p.artists[0], u = c.strArtistThumb || c.strArtistFanart;
            if (u) return u;
          }
        }
      } catch {
      }
      return null;
    } catch (i) {
      return console.error("Error fetching artist image:", i), null;
    }
  }), qe.handle("search:lyrics", async (r, n, i, a) => {
    try {
      const s = Mr(import.meta.url)("get-artist-title"), o = Mr(import.meta.url)("genius-lyrics"), l = new o.Client(), p = async (d, m = "") => {
        try {
          const w = `https://lrclib.net/api/search?q=${encodeURIComponent(d)}`, x = await fetch(w);
          if (x.ok) {
            const T = await x.json();
            if (Array.isArray(T) && T.length > 0) {
              const b = (m || "").split(" ")[0].toLowerCase(), _ = T.find((k) => k.syncedLyrics && (!b || k.artistName.toLowerCase().includes(b))) || T.find((k) => k.syncedLyrics) || T[0];
              return _.syncedLyrics || _.plainLyrics;
            }
          }
        } catch (w) {
          console.error("LRC Search Error", d, w);
        }
        return null;
      }, c = async (d) => {
        var m, w, x;
        try {
          const T = `http://music.163.com/api/search/get/web?csrf_token=&hlpretag=&hlposttag=&s=${encodeURIComponent(d)}&type=1&offset=0&total=true&limit=1`, b = await fetch(T);
          if (b.ok) {
            const _ = await b.json();
            if (((w = (m = _ == null ? void 0 : _.result) == null ? void 0 : m.songs) == null ? void 0 : w.length) > 0) {
              const $ = `http://music.163.com/api/song/lyric?id=${_.result.songs[0].id}&lv=1&kv=-1&tv=-1`, Q = await fetch($);
              if (Q.ok) {
                const re = await Q.json();
                if ((x = re == null ? void 0 : re.lrc) != null && x.lyric)
                  return re.lrc.lyric;
              }
            }
          }
        } catch (T) {
          console.error("Netease Search Error", d, T);
        }
        return null;
      };
      if (n && i) {
        let d = await p(`${n} ${i}`, i);
        if (d) return d;
        let m = `${n} ${i}`;
        if (d = await c(m), d) return d;
      }
      let u = null;
      if (a) {
        const d = Re.basename(a, Re.extname(a));
        u = s(d, {
          defaultArtist: i
          // Fallback
        });
      } else n && (u = s(n));
      if (u && Array.isArray(u) && u.length === 2 && u[1]) {
        const [d, m] = u;
        if (m) {
          const w = `${m} ${d || ""}`;
          let x = await p(w, d);
          if (x || (x = await c(w), x)) return x;
        }
      }
      try {
        const d = u ? `${u[1]} ${u[0] || ""}` : `${n} ${i || ""}`, m = await l.songs.search(d);
        if (m.length > 0) {
          const x = await m[0].lyrics();
          if (x)
            return x.split(`
`).filter((T) => T.trim()).map((T) => `[00:00.00]${T}`).join(`
`);
        }
      } catch (d) {
        console.error("Genius Search Error:", d);
      }
      return null;
    } catch (s) {
      return console.error("Error fetching lyrics:", s), null;
    }
  }), qe.handle("update:check", () => {
    st.autoUpdater.checkForUpdates();
  }), qe.handle("update:install", () => {
    st.autoUpdater.quitAndInstall(!0, !0);
  }), qe.handle("app:version", () => Ke.getVersion());
});
export {
  tA as A,
  Zf as B,
  Mf as C,
  WS as D,
  Ae as E,
  rd as F,
  Yi as G,
  wc as H,
  i_ as I,
  mS as J,
  nb as K,
  rA as L,
  id as M,
  Uf as N,
  ub as O,
  hc as P,
  eA as Q,
  fb as R,
  ge as S,
  ft as T,
  wi as U,
  iA as V,
  nA as W,
  cb as X,
  cs as Y,
  aA as Z,
  sd as _,
  qt as a,
  Yt as b,
  Ar as c,
  zf as d,
  os as e,
  W as f,
  Kf as g,
  YS as h,
  ZS as i,
  jf as j,
  ne as k,
  zr as l,
  rb as m,
  f_ as n,
  ns as o,
  c_ as p,
  l_ as q,
  g_ as r,
  QS as s,
  h_ as t,
  VS as u,
  u_ as v,
  KS as w,
  Bf as x,
  o_ as y,
  as as z
};
