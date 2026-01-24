var mp = Object.defineProperty;
var gp = (e, t, r) => t in e ? mp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var rt = (e, t, r) => gp(e, typeof t != "symbol" ? t + "" : t, r);
import Jt, { app as Ke, BrowserWindow as Ac, Notification as yp, ipcMain as le, dialog as gs } from "electron";
import { createRequire as ii } from "node:module";
import { fileURLToPath as wp } from "node:url";
import Oe from "node:path";
import Nn, { open as xp } from "node:fs/promises";
import Pt from "fs";
import Ep from "constants";
import un from "stream";
import ho from "util";
import Ic from "assert";
import ue from "path";
import Si from "child_process";
import Cc from "events";
import fn from "crypto";
import Rc from "tty";
import Ai from "os";
import Sr from "url";
import vp from "string_decoder";
import Dc from "zlib";
import Tp from "http";
import { exec as _p } from "node:child_process";
import { Client as bp, GatewayIntentBits as ys, ChannelType as ws } from "discord.js";
import { createAudioPlayer as Sp, AudioPlayerStatus as ir, joinVoiceChannel as Ap, createAudioResource as sa, StreamType as Ip } from "@discordjs/voice";
var Pe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Cp(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var st = {}, er = {}, Fe = {};
Fe.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, a) => i != null ? n(i) : r(a)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Fe.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var xt = Ep, Rp = process.cwd, ai = null, Dp = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return ai || (ai = Rp.call(process)), ai;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var xs = process.chdir;
  process.chdir = function(e) {
    ai = null, xs.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, xs);
}
var Op = Pp;
function Pp(e) {
  xt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = a(e.chown), e.fchown = a(e.fchown), e.lchown = a(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = o(e.chownSync), e.fchownSync = o(e.fchownSync), e.lchownSync = o(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, u, p) {
    p && process.nextTick(p);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, u, p, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), Dp === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function u(p, g, x) {
      var w = Date.now(), T = 0;
      c(p, g, function b(_) {
        if (_ && (_.code === "EACCES" || _.code === "EPERM" || _.code === "EBUSY") && Date.now() - w < 6e4) {
          setTimeout(function() {
            e.stat(g, function(F, D) {
              F && F.code === "ENOENT" ? c(p, g, b) : x(_);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        x && x(_);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function u(p, g, x, w, T, b) {
      var _;
      if (b && typeof b == "function") {
        var F = 0;
        _ = function(D, k, H) {
          if (D && D.code === "EAGAIN" && F < 10)
            return F++, c.call(e, p, g, x, w, T, _);
          b.apply(this, arguments);
        };
      }
      return c.call(e, p, g, x, w, T, _);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(u, p, g, x, w) {
      for (var T = 0; ; )
        try {
          return c.call(e, u, p, g, x, w);
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
    c.lchmod = function(u, p, g) {
      c.open(
        u,
        xt.O_WRONLY | xt.O_SYMLINK,
        p,
        function(x, w) {
          if (x) {
            g && g(x);
            return;
          }
          c.fchmod(w, p, function(T) {
            c.close(w, function(b) {
              g && g(T || b);
            });
          });
        }
      );
    }, c.lchmodSync = function(u, p) {
      var g = c.openSync(u, xt.O_WRONLY | xt.O_SYMLINK, p), x = !0, w;
      try {
        w = c.fchmodSync(g, p), x = !1;
      } finally {
        if (x)
          try {
            c.closeSync(g);
          } catch {
          }
        else
          c.closeSync(g);
      }
      return w;
    };
  }
  function r(c) {
    xt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(u, p, g, x) {
      c.open(u, xt.O_SYMLINK, function(w, T) {
        if (w) {
          x && x(w);
          return;
        }
        c.futimes(T, p, g, function(b) {
          c.close(T, function(_) {
            x && x(b || _);
          });
        });
      });
    }, c.lutimesSync = function(u, p, g) {
      var x = c.openSync(u, xt.O_SYMLINK), w, T = !0;
      try {
        w = c.futimesSync(x, p, g), T = !1;
      } finally {
        if (T)
          try {
            c.closeSync(x);
          } catch {
          }
        else
          c.closeSync(x);
      }
      return w;
    }) : c.futimes && (c.lutimes = function(u, p, g, x) {
      x && process.nextTick(x);
    }, c.lutimesSync = function() {
    });
  }
  function n(c) {
    return c && function(u, p, g) {
      return c.call(e, u, p, function(x) {
        d(x) && (x = null), g && g.apply(this, arguments);
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
    return c && function(u, p, g, x) {
      return c.call(e, u, p, g, function(w) {
        d(w) && (w = null), x && x.apply(this, arguments);
      });
    };
  }
  function o(c) {
    return c && function(u, p, g) {
      try {
        return c.call(e, u, p, g);
      } catch (x) {
        if (!d(x)) throw x;
      }
    };
  }
  function s(c) {
    return c && function(u, p, g) {
      typeof p == "function" && (g = p, p = null);
      function x(w, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), g && g.apply(this, arguments);
      }
      return p ? c.call(e, u, p, x) : c.call(e, u, x);
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
var Es = un.Stream, kp = Np;
function Np(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Es.call(this);
    var a = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var o = Object.keys(i), s = 0, l = o.length; s < l; s++) {
      var d = o[s];
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
    Es.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var a = Object.keys(i), o = 0, s = a.length; o < s; o++) {
      var l = a[o];
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
var Fp = Lp, $p = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Lp(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: $p(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ce = Pt, Up = Op, Mp = kp, Bp = Fp, Fn = ho, _e, ui;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (_e = Symbol.for("graceful-fs.queue"), ui = Symbol.for("graceful-fs.previous")) : (_e = "___graceful-fs.queue", ui = "___graceful-fs.previous");
function jp() {
}
function Oc(e, t) {
  Object.defineProperty(e, _e, {
    get: function() {
      return t;
    }
  });
}
var Vt = jp;
Fn.debuglog ? Vt = Fn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Vt = function() {
  var e = Fn.format.apply(Fn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ce[_e]) {
  var Gp = Pe[_e] || [];
  Oc(ce, Gp), ce.close = function(e) {
    function t(r, n) {
      return e.call(ce, r, function(i) {
        i || vs(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, ui, {
      value: e
    }), t;
  }(ce.close), ce.closeSync = function(e) {
    function t(r) {
      e.apply(ce, arguments), vs();
    }
    return Object.defineProperty(t, ui, {
      value: e
    }), t;
  }(ce.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Vt(ce[_e]), Ic.equal(ce[_e].length, 0);
  });
}
Pe[_e] || Oc(Pe, ce[_e]);
var $e = mo(Bp(ce));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ce.__patched && ($e = mo(ce), ce.__patched = !0);
function mo(e) {
  Up(e), e.gracefulify = mo, e.createReadStream = k, e.createWriteStream = H;
  var t = e.readFile;
  e.readFile = r;
  function r(y, j, U) {
    return typeof j == "function" && (U = j, j = null), M(y, j, U);
    function M(J, R, I, P) {
      return t(J, R, function(S) {
        S && (S.code === "EMFILE" || S.code === "ENFILE") ? ar([M, [J, R, I], S, P || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(y, j, U, M) {
    return typeof U == "function" && (M = U, U = null), J(y, j, U, M);
    function J(R, I, P, S, $) {
      return n(R, I, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ar([J, [R, I, P, S], O, $ || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  var a = e.appendFile;
  a && (e.appendFile = o);
  function o(y, j, U, M) {
    return typeof U == "function" && (M = U, U = null), J(y, j, U, M);
    function J(R, I, P, S, $) {
      return a(R, I, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ar([J, [R, I, P, S], O, $ || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(y, j, U, M) {
    return typeof U == "function" && (M = U, U = 0), J(y, j, U, M);
    function J(R, I, P, S, $) {
      return s(R, I, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ar([J, [R, I, P, S], O, $ || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  var d = e.readdir;
  e.readdir = u;
  var c = /^v[0-5]\./;
  function u(y, j, U) {
    typeof j == "function" && (U = j, j = null);
    var M = c.test(process.version) ? function(I, P, S, $) {
      return d(I, J(
        I,
        P,
        S,
        $
      ));
    } : function(I, P, S, $) {
      return d(I, P, J(
        I,
        P,
        S,
        $
      ));
    };
    return M(y, j, U);
    function J(R, I, P, S) {
      return function($, O) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? ar([
          M,
          [R, I, P],
          $,
          S || Date.now(),
          Date.now()
        ]) : (O && O.sort && O.sort(), typeof P == "function" && P.call(this, $, O));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var p = Mp(e);
    b = p.ReadStream, F = p.WriteStream;
  }
  var g = e.ReadStream;
  g && (b.prototype = Object.create(g.prototype), b.prototype.open = _);
  var x = e.WriteStream;
  x && (F.prototype = Object.create(x.prototype), F.prototype.open = D), Object.defineProperty(e, "ReadStream", {
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
      return F;
    },
    set: function(y) {
      F = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var w = b;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return w;
    },
    set: function(y) {
      w = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var T = F;
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
  function b(y, j) {
    return this instanceof b ? (g.apply(this, arguments), this) : b.apply(Object.create(b.prototype), arguments);
  }
  function _() {
    var y = this;
    te(y.path, y.flags, y.mode, function(j, U) {
      j ? (y.autoClose && y.destroy(), y.emit("error", j)) : (y.fd = U, y.emit("open", U), y.read());
    });
  }
  function F(y, j) {
    return this instanceof F ? (x.apply(this, arguments), this) : F.apply(Object.create(F.prototype), arguments);
  }
  function D() {
    var y = this;
    te(y.path, y.flags, y.mode, function(j, U) {
      j ? (y.destroy(), y.emit("error", j)) : (y.fd = U, y.emit("open", U));
    });
  }
  function k(y, j) {
    return new e.ReadStream(y, j);
  }
  function H(y, j) {
    return new e.WriteStream(y, j);
  }
  var q = e.open;
  e.open = te;
  function te(y, j, U, M) {
    return typeof U == "function" && (M = U, U = null), J(y, j, U, M);
    function J(R, I, P, S, $) {
      return q(R, I, P, function(O, z) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ar([J, [R, I, P, S], O, $ || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  return e;
}
function ar(e) {
  Vt("ENQUEUE", e[0].name, e[1]), ce[_e].push(e), go();
}
var $n;
function vs() {
  for (var e = Date.now(), t = 0; t < ce[_e].length; ++t)
    ce[_e][t].length > 2 && (ce[_e][t][3] = e, ce[_e][t][4] = e);
  go();
}
function go() {
  if (clearTimeout($n), $n = void 0, ce[_e].length !== 0) {
    var e = ce[_e].shift(), t = e[0], r = e[1], n = e[2], i = e[3], a = e[4];
    if (i === void 0)
      Vt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Vt("TIMEOUT", t.name, r);
      var o = r.pop();
      typeof o == "function" && o.call(null, n);
    } else {
      var s = Date.now() - a, l = Math.max(a - i, 1), d = Math.min(l * 1.2, 100);
      s >= d ? (Vt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ce[_e].push(e);
    }
    $n === void 0 && ($n = setTimeout(go, 0));
  }
}
(function(e) {
  const t = Fe.fromCallback, r = $e, n = [
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
    return typeof a == "function" ? r.exists(i, a) : new Promise((o) => r.exists(i, o));
  }, e.read = function(i, a, o, s, l, d) {
    return typeof d == "function" ? r.read(i, a, o, s, l, d) : new Promise((c, u) => {
      r.read(i, a, o, s, l, (p, g, x) => {
        if (p) return u(p);
        c({ bytesRead: g, buffer: x });
      });
    });
  }, e.write = function(i, a, ...o) {
    return typeof o[o.length - 1] == "function" ? r.write(i, a, ...o) : new Promise((s, l) => {
      r.write(i, a, ...o, (d, c, u) => {
        if (d) return l(d);
        s({ bytesWritten: c, buffer: u });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, a, ...o) {
    return typeof o[o.length - 1] == "function" ? r.writev(i, a, ...o) : new Promise((s, l) => {
      r.writev(i, a, ...o, (d, c, u) => {
        if (d) return l(d);
        s({ bytesWritten: c, buffers: u });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(er);
var yo = {}, Pc = {};
const zp = ue;
Pc.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(zp.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const kc = er, { checkPath: Nc } = Pc, Fc = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
yo.makeDir = async (e, t) => (Nc(e), kc.mkdir(e, {
  mode: Fc(t),
  recursive: !0
}));
yo.makeDirSync = (e, t) => (Nc(e), kc.mkdirSync(e, {
  mode: Fc(t),
  recursive: !0
}));
const Hp = Fe.fromPromise, { makeDir: qp, makeDirSync: la } = yo, ca = Hp(qp);
var lt = {
  mkdirs: ca,
  mkdirsSync: la,
  // alias
  mkdirp: ca,
  mkdirpSync: la,
  ensureDir: ca,
  ensureDirSync: la
};
const Xp = Fe.fromPromise, $c = er;
function Wp(e) {
  return $c.access(e).then(() => !0).catch(() => !1);
}
var tr = {
  pathExists: Xp(Wp),
  pathExistsSync: $c.existsSync
};
const xr = $e;
function Vp(e, t, r, n) {
  xr.open(e, "r+", (i, a) => {
    if (i) return n(i);
    xr.futimes(a, t, r, (o) => {
      xr.close(a, (s) => {
        n && n(o || s);
      });
    });
  });
}
function Yp(e, t, r) {
  const n = xr.openSync(e, "r+");
  return xr.futimesSync(n, t, r), xr.closeSync(n);
}
var Lc = {
  utimesMillis: Vp,
  utimesMillisSync: Yp
};
const vr = er, xe = ue, Kp = ho;
function Jp(e, t, r) {
  const n = r.dereference ? (i) => vr.stat(i, { bigint: !0 }) : (i) => vr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, a]) => ({ srcStat: i, destStat: a }));
}
function Qp(e, t, r) {
  let n;
  const i = r.dereference ? (o) => vr.statSync(o, { bigint: !0 }) : (o) => vr.lstatSync(o, { bigint: !0 }), a = i(e);
  try {
    n = i(t);
  } catch (o) {
    if (o.code === "ENOENT") return { srcStat: a, destStat: null };
    throw o;
  }
  return { srcStat: a, destStat: n };
}
function Zp(e, t, r, n, i) {
  Kp.callbackify(Jp)(e, t, n, (a, o) => {
    if (a) return i(a);
    const { srcStat: s, destStat: l } = o;
    if (l) {
      if (dn(s, l)) {
        const d = xe.basename(e), c = xe.basename(t);
        return r === "move" && d !== c && d.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && wo(e, t) ? i(new Error(Ii(e, t, r))) : i(null, { srcStat: s, destStat: l });
  });
}
function eh(e, t, r, n) {
  const { srcStat: i, destStat: a } = Qp(e, t, n);
  if (a) {
    if (dn(i, a)) {
      const o = xe.basename(e), s = xe.basename(t);
      if (r === "move" && o !== s && o.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: a, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !a.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && a.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && wo(e, t))
    throw new Error(Ii(e, t, r));
  return { srcStat: i, destStat: a };
}
function Uc(e, t, r, n, i) {
  const a = xe.resolve(xe.dirname(e)), o = xe.resolve(xe.dirname(r));
  if (o === a || o === xe.parse(o).root) return i();
  vr.stat(o, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : dn(t, l) ? i(new Error(Ii(e, r, n))) : Uc(e, t, o, n, i));
}
function Mc(e, t, r, n) {
  const i = xe.resolve(xe.dirname(e)), a = xe.resolve(xe.dirname(r));
  if (a === i || a === xe.parse(a).root) return;
  let o;
  try {
    o = vr.statSync(a, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (dn(t, o))
    throw new Error(Ii(e, r, n));
  return Mc(e, t, a, n);
}
function dn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function wo(e, t) {
  const r = xe.resolve(e).split(xe.sep).filter((i) => i), n = xe.resolve(t).split(xe.sep).filter((i) => i);
  return r.reduce((i, a, o) => i && n[o] === a, !0);
}
function Ii(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Ar = {
  checkPaths: Zp,
  checkPathsSync: eh,
  checkParentPaths: Uc,
  checkParentPathsSync: Mc,
  isSrcSubdir: wo,
  areIdentical: dn
};
const Me = $e, Vr = ue, th = lt.mkdirs, rh = tr.pathExists, nh = Lc.utimesMillis, Yr = Ar;
function ih(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Yr.checkPaths(e, t, "copy", r, (i, a) => {
    if (i) return n(i);
    const { srcStat: o, destStat: s } = a;
    Yr.checkParentPaths(e, o, t, "copy", (l) => l ? n(l) : r.filter ? Bc(Ts, s, e, t, r, n) : Ts(s, e, t, r, n));
  });
}
function Ts(e, t, r, n, i) {
  const a = Vr.dirname(r);
  rh(a, (o, s) => {
    if (o) return i(o);
    if (s) return fi(e, t, r, n, i);
    th(a, (l) => l ? i(l) : fi(e, t, r, n, i));
  });
}
function Bc(e, t, r, n, i, a) {
  Promise.resolve(i.filter(r, n)).then((o) => o ? e(t, r, n, i, a) : a(), (o) => a(o));
}
function ah(e, t, r, n, i) {
  return n.filter ? Bc(fi, e, t, r, n, i) : fi(e, t, r, n, i);
}
function fi(e, t, r, n, i) {
  (n.dereference ? Me.stat : Me.lstat)(t, (o, s) => o ? i(o) : s.isDirectory() ? dh(s, e, t, r, n, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? oh(s, e, t, r, n, i) : s.isSymbolicLink() ? mh(e, t, r, n, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function oh(e, t, r, n, i, a) {
  return t ? sh(e, r, n, i, a) : jc(e, r, n, i, a);
}
function sh(e, t, r, n, i) {
  if (n.overwrite)
    Me.unlink(r, (a) => a ? i(a) : jc(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function jc(e, t, r, n, i) {
  Me.copyFile(t, r, (a) => a ? i(a) : n.preserveTimestamps ? lh(e.mode, t, r, i) : Ci(r, e.mode, i));
}
function lh(e, t, r, n) {
  return ch(e) ? uh(r, e, (i) => i ? n(i) : _s(e, t, r, n)) : _s(e, t, r, n);
}
function ch(e) {
  return (e & 128) === 0;
}
function uh(e, t, r) {
  return Ci(e, t | 128, r);
}
function _s(e, t, r, n) {
  fh(t, r, (i) => i ? n(i) : Ci(r, e, n));
}
function Ci(e, t, r) {
  return Me.chmod(e, t, r);
}
function fh(e, t, r) {
  Me.stat(e, (n, i) => n ? r(n) : nh(t, i.atime, i.mtime, r));
}
function dh(e, t, r, n, i, a) {
  return t ? Gc(r, n, i, a) : ph(e.mode, r, n, i, a);
}
function ph(e, t, r, n, i) {
  Me.mkdir(r, (a) => {
    if (a) return i(a);
    Gc(t, r, n, (o) => o ? i(o) : Ci(r, e, i));
  });
}
function Gc(e, t, r, n) {
  Me.readdir(e, (i, a) => i ? n(i) : zc(a, e, t, r, n));
}
function zc(e, t, r, n, i) {
  const a = e.pop();
  return a ? hh(e, a, t, r, n, i) : i();
}
function hh(e, t, r, n, i, a) {
  const o = Vr.join(r, t), s = Vr.join(n, t);
  Yr.checkPaths(o, s, "copy", i, (l, d) => {
    if (l) return a(l);
    const { destStat: c } = d;
    ah(c, o, s, i, (u) => u ? a(u) : zc(e, r, n, i, a));
  });
}
function mh(e, t, r, n, i) {
  Me.readlink(t, (a, o) => {
    if (a) return i(a);
    if (n.dereference && (o = Vr.resolve(process.cwd(), o)), e)
      Me.readlink(r, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Me.symlink(o, r, i) : i(s) : (n.dereference && (l = Vr.resolve(process.cwd(), l)), Yr.isSrcSubdir(o, l) ? i(new Error(`Cannot copy '${o}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Yr.isSrcSubdir(l, o) ? i(new Error(`Cannot overwrite '${l}' with '${o}'.`)) : gh(o, r, i)));
    else
      return Me.symlink(o, r, i);
  });
}
function gh(e, t, r) {
  Me.unlink(t, (n) => n ? r(n) : Me.symlink(e, t, r));
}
var yh = ih;
const Ie = $e, Kr = ue, wh = lt.mkdirsSync, xh = Lc.utimesMillisSync, Jr = Ar;
function Eh(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Jr.checkPathsSync(e, t, "copy", r);
  return Jr.checkParentPathsSync(e, n, t, "copy"), vh(i, e, t, r);
}
function vh(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Kr.dirname(r);
  return Ie.existsSync(i) || wh(i), Hc(e, t, r, n);
}
function Th(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Hc(e, t, r, n);
}
function Hc(e, t, r, n) {
  const a = (n.dereference ? Ie.statSync : Ie.lstatSync)(t);
  if (a.isDirectory()) return Rh(a, e, t, r, n);
  if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return _h(a, e, t, r, n);
  if (a.isSymbolicLink()) return Ph(e, t, r, n);
  throw a.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function _h(e, t, r, n, i) {
  return t ? bh(e, r, n, i) : qc(e, r, n, i);
}
function bh(e, t, r, n) {
  if (n.overwrite)
    return Ie.unlinkSync(r), qc(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function qc(e, t, r, n) {
  return Ie.copyFileSync(t, r), n.preserveTimestamps && Sh(e.mode, t, r), xo(r, e.mode);
}
function Sh(e, t, r) {
  return Ah(e) && Ih(r, e), Ch(t, r);
}
function Ah(e) {
  return (e & 128) === 0;
}
function Ih(e, t) {
  return xo(e, t | 128);
}
function xo(e, t) {
  return Ie.chmodSync(e, t);
}
function Ch(e, t) {
  const r = Ie.statSync(e);
  return xh(t, r.atime, r.mtime);
}
function Rh(e, t, r, n, i) {
  return t ? Xc(r, n, i) : Dh(e.mode, r, n, i);
}
function Dh(e, t, r, n) {
  return Ie.mkdirSync(r), Xc(t, r, n), xo(r, e);
}
function Xc(e, t, r) {
  Ie.readdirSync(e).forEach((n) => Oh(n, e, t, r));
}
function Oh(e, t, r, n) {
  const i = Kr.join(t, e), a = Kr.join(r, e), { destStat: o } = Jr.checkPathsSync(i, a, "copy", n);
  return Th(o, i, a, n);
}
function Ph(e, t, r, n) {
  let i = Ie.readlinkSync(t);
  if (n.dereference && (i = Kr.resolve(process.cwd(), i)), e) {
    let a;
    try {
      a = Ie.readlinkSync(r);
    } catch (o) {
      if (o.code === "EINVAL" || o.code === "UNKNOWN") return Ie.symlinkSync(i, r);
      throw o;
    }
    if (n.dereference && (a = Kr.resolve(process.cwd(), a)), Jr.isSrcSubdir(i, a))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);
    if (Ie.statSync(r).isDirectory() && Jr.isSrcSubdir(a, i))
      throw new Error(`Cannot overwrite '${a}' with '${i}'.`);
    return kh(i, r);
  } else
    return Ie.symlinkSync(i, r);
}
function kh(e, t) {
  return Ie.unlinkSync(t), Ie.symlinkSync(e, t);
}
var Nh = Eh;
const Fh = Fe.fromCallback;
var Eo = {
  copy: Fh(yh),
  copySync: Nh
};
const bs = $e, Wc = ue, ne = Ic, Qr = process.platform === "win32";
function Vc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || bs[r], r = r + "Sync", e[r] = e[r] || bs[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function vo(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), ne(e, "rimraf: missing path"), ne.strictEqual(typeof e, "string", "rimraf: path should be a string"), ne.strictEqual(typeof r, "function", "rimraf: callback function required"), ne(t, "rimraf: invalid options argument provided"), ne.strictEqual(typeof t, "object", "rimraf: options should be object"), Vc(t), Ss(e, t, function i(a) {
    if (a) {
      if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const o = n * 100;
        return setTimeout(() => Ss(e, t, i), o);
      }
      a.code === "ENOENT" && (a = null);
    }
    r(a);
  });
}
function Ss(e, t, r) {
  ne(e), ne(t), ne(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Qr)
      return As(e, t, n, r);
    if (i && i.isDirectory())
      return oi(e, t, n, r);
    t.unlink(e, (a) => {
      if (a) {
        if (a.code === "ENOENT")
          return r(null);
        if (a.code === "EPERM")
          return Qr ? As(e, t, a, r) : oi(e, t, a, r);
        if (a.code === "EISDIR")
          return oi(e, t, a, r);
      }
      return r(a);
    });
  });
}
function As(e, t, r, n) {
  ne(e), ne(t), ne(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (a, o) => {
      a ? n(a.code === "ENOENT" ? null : r) : o.isDirectory() ? oi(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Is(e, t, r) {
  let n;
  ne(e), ne(t);
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
  n.isDirectory() ? si(e, t, r) : t.unlinkSync(e);
}
function oi(e, t, r, n) {
  ne(e), ne(t), ne(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? $h(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function $h(e, t, r) {
  ne(e), ne(t), ne(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let a = i.length, o;
    if (a === 0) return t.rmdir(e, r);
    i.forEach((s) => {
      vo(Wc.join(e, s), t, (l) => {
        if (!o) {
          if (l) return r(o = l);
          --a === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function Yc(e, t) {
  let r;
  t = t || {}, Vc(t), ne(e, "rimraf: missing path"), ne.strictEqual(typeof e, "string", "rimraf: path should be a string"), ne(t, "rimraf: missing options"), ne.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Qr && Is(e, t, n);
  }
  try {
    r && r.isDirectory() ? si(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Qr ? Is(e, t, n) : si(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    si(e, t, n);
  }
}
function si(e, t, r) {
  ne(e), ne(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      Lh(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Lh(e, t) {
  if (ne(e), ne(t), t.readdirSync(e).forEach((r) => Yc(Wc.join(e, r), t)), Qr) {
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
var Uh = vo;
vo.sync = Yc;
const di = $e, Mh = Fe.fromCallback, Kc = Uh;
function Bh(e, t) {
  if (di.rm) return di.rm(e, { recursive: !0, force: !0 }, t);
  Kc(e, t);
}
function jh(e) {
  if (di.rmSync) return di.rmSync(e, { recursive: !0, force: !0 });
  Kc.sync(e);
}
var Ri = {
  remove: Mh(Bh),
  removeSync: jh
};
const Gh = Fe.fromPromise, Jc = er, Qc = ue, Zc = lt, eu = Ri, Cs = Gh(async function(t) {
  let r;
  try {
    r = await Jc.readdir(t);
  } catch {
    return Zc.mkdirs(t);
  }
  return Promise.all(r.map((n) => eu.remove(Qc.join(t, n))));
});
function Rs(e) {
  let t;
  try {
    t = Jc.readdirSync(e);
  } catch {
    return Zc.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = Qc.join(e, r), eu.removeSync(r);
  });
}
var zh = {
  emptyDirSync: Rs,
  emptydirSync: Rs,
  emptyDir: Cs,
  emptydir: Cs
};
const Hh = Fe.fromCallback, tu = ue, _t = $e, ru = lt;
function qh(e, t) {
  function r() {
    _t.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  _t.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const a = tu.dirname(e);
    _t.stat(a, (o, s) => {
      if (o)
        return o.code === "ENOENT" ? ru.mkdirs(a, (l) => {
          if (l) return t(l);
          r();
        }) : t(o);
      s.isDirectory() ? r() : _t.readdir(a, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Xh(e) {
  let t;
  try {
    t = _t.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = tu.dirname(e);
  try {
    _t.statSync(r).isDirectory() || _t.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") ru.mkdirsSync(r);
    else throw n;
  }
  _t.writeFileSync(e, "");
}
var Wh = {
  createFile: Hh(qh),
  createFileSync: Xh
};
const Vh = Fe.fromCallback, nu = ue, Tt = $e, iu = lt, Yh = tr.pathExists, { areIdentical: au } = Ar;
function Kh(e, t, r) {
  function n(i, a) {
    Tt.link(i, a, (o) => {
      if (o) return r(o);
      r(null);
    });
  }
  Tt.lstat(t, (i, a) => {
    Tt.lstat(e, (o, s) => {
      if (o)
        return o.message = o.message.replace("lstat", "ensureLink"), r(o);
      if (a && au(s, a)) return r(null);
      const l = nu.dirname(t);
      Yh(l, (d, c) => {
        if (d) return r(d);
        if (c) return n(e, t);
        iu.mkdirs(l, (u) => {
          if (u) return r(u);
          n(e, t);
        });
      });
    });
  });
}
function Jh(e, t) {
  let r;
  try {
    r = Tt.lstatSync(t);
  } catch {
  }
  try {
    const a = Tt.lstatSync(e);
    if (r && au(a, r)) return;
  } catch (a) {
    throw a.message = a.message.replace("lstat", "ensureLink"), a;
  }
  const n = nu.dirname(t);
  return Tt.existsSync(n) || iu.mkdirsSync(n), Tt.linkSync(e, t);
}
var Qh = {
  createLink: Vh(Kh),
  createLinkSync: Jh
};
const bt = ue, Hr = $e, Zh = tr.pathExists;
function em(e, t, r) {
  if (bt.isAbsolute(e))
    return Hr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = bt.dirname(t), i = bt.join(n, e);
    return Zh(i, (a, o) => a ? r(a) : o ? r(null, {
      toCwd: i,
      toDst: e
    }) : Hr.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), r(s)) : r(null, {
      toCwd: e,
      toDst: bt.relative(n, e)
    })));
  }
}
function tm(e, t) {
  let r;
  if (bt.isAbsolute(e)) {
    if (r = Hr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = bt.dirname(t), i = bt.join(n, e);
    if (r = Hr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Hr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: bt.relative(n, e)
    };
  }
}
var rm = {
  symlinkPaths: em,
  symlinkPathsSync: tm
};
const ou = $e;
function nm(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  ou.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function im(e, t) {
  let r;
  if (t) return t;
  try {
    r = ou.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var am = {
  symlinkType: nm,
  symlinkTypeSync: im
};
const om = Fe.fromCallback, su = ue, Ye = er, lu = lt, sm = lu.mkdirs, lm = lu.mkdirsSync, cu = rm, cm = cu.symlinkPaths, um = cu.symlinkPathsSync, uu = am, fm = uu.symlinkType, dm = uu.symlinkTypeSync, pm = tr.pathExists, { areIdentical: fu } = Ar;
function hm(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Ye.lstat(t, (i, a) => {
    !i && a.isSymbolicLink() ? Promise.all([
      Ye.stat(e),
      Ye.stat(t)
    ]).then(([o, s]) => {
      if (fu(o, s)) return n(null);
      Ds(e, t, r, n);
    }) : Ds(e, t, r, n);
  });
}
function Ds(e, t, r, n) {
  cm(e, t, (i, a) => {
    if (i) return n(i);
    e = a.toDst, fm(a.toCwd, r, (o, s) => {
      if (o) return n(o);
      const l = su.dirname(t);
      pm(l, (d, c) => {
        if (d) return n(d);
        if (c) return Ye.symlink(e, t, s, n);
        sm(l, (u) => {
          if (u) return n(u);
          Ye.symlink(e, t, s, n);
        });
      });
    });
  });
}
function mm(e, t, r) {
  let n;
  try {
    n = Ye.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const s = Ye.statSync(e), l = Ye.statSync(t);
    if (fu(s, l)) return;
  }
  const i = um(e, t);
  e = i.toDst, r = dm(i.toCwd, r);
  const a = su.dirname(t);
  return Ye.existsSync(a) || lm(a), Ye.symlinkSync(e, t, r);
}
var gm = {
  createSymlink: om(hm),
  createSymlinkSync: mm
};
const { createFile: Os, createFileSync: Ps } = Wh, { createLink: ks, createLinkSync: Ns } = Qh, { createSymlink: Fs, createSymlinkSync: $s } = gm;
var ym = {
  // file
  createFile: Os,
  createFileSync: Ps,
  ensureFile: Os,
  ensureFileSync: Ps,
  // link
  createLink: ks,
  createLinkSync: Ns,
  ensureLink: ks,
  ensureLinkSync: Ns,
  // symlink
  createSymlink: Fs,
  createSymlinkSync: $s,
  ensureSymlink: Fs,
  ensureSymlinkSync: $s
};
function wm(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const a = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + a;
}
function xm(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var To = { stringify: wm, stripBom: xm };
let Tr;
try {
  Tr = $e;
} catch {
  Tr = Pt;
}
const Di = Fe, { stringify: du, stripBom: pu } = To;
async function Em(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Tr, n = "throws" in t ? t.throws : !0;
  let i = await Di.fromCallback(r.readFile)(e, t);
  i = pu(i);
  let a;
  try {
    a = JSON.parse(i, t ? t.reviver : null);
  } catch (o) {
    if (n)
      throw o.message = `${e}: ${o.message}`, o;
    return null;
  }
  return a;
}
const vm = Di.fromPromise(Em);
function Tm(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Tr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = pu(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function _m(e, t, r = {}) {
  const n = r.fs || Tr, i = du(t, r);
  await Di.fromCallback(n.writeFile)(e, i, r);
}
const bm = Di.fromPromise(_m);
function Sm(e, t, r = {}) {
  const n = r.fs || Tr, i = du(t, r);
  return n.writeFileSync(e, i, r);
}
var Am = {
  readFile: vm,
  readFileSync: Tm,
  writeFile: bm,
  writeFileSync: Sm
};
const Ln = Am;
var Im = {
  // jsonfile exports
  readJson: Ln.readFile,
  readJsonSync: Ln.readFileSync,
  writeJson: Ln.writeFile,
  writeJsonSync: Ln.writeFileSync
};
const Cm = Fe.fromCallback, qr = $e, hu = ue, mu = lt, Rm = tr.pathExists;
function Dm(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = hu.dirname(e);
  Rm(i, (a, o) => {
    if (a) return n(a);
    if (o) return qr.writeFile(e, t, r, n);
    mu.mkdirs(i, (s) => {
      if (s) return n(s);
      qr.writeFile(e, t, r, n);
    });
  });
}
function Om(e, ...t) {
  const r = hu.dirname(e);
  if (qr.existsSync(r))
    return qr.writeFileSync(e, ...t);
  mu.mkdirsSync(r), qr.writeFileSync(e, ...t);
}
var _o = {
  outputFile: Cm(Dm),
  outputFileSync: Om
};
const { stringify: Pm } = To, { outputFile: km } = _o;
async function Nm(e, t, r = {}) {
  const n = Pm(t, r);
  await km(e, n, r);
}
var Fm = Nm;
const { stringify: $m } = To, { outputFileSync: Lm } = _o;
function Um(e, t, r) {
  const n = $m(t, r);
  Lm(e, n, r);
}
var Mm = Um;
const Bm = Fe.fromPromise, Ne = Im;
Ne.outputJson = Bm(Fm);
Ne.outputJsonSync = Mm;
Ne.outputJSON = Ne.outputJson;
Ne.outputJSONSync = Ne.outputJsonSync;
Ne.writeJSON = Ne.writeJson;
Ne.writeJSONSync = Ne.writeJsonSync;
Ne.readJSON = Ne.readJson;
Ne.readJSONSync = Ne.readJsonSync;
var jm = Ne;
const Gm = $e, za = ue, zm = Eo.copy, gu = Ri.remove, Hm = lt.mkdirp, qm = tr.pathExists, Ls = Ar;
function Xm(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Ls.checkPaths(e, t, "move", r, (a, o) => {
    if (a) return n(a);
    const { srcStat: s, isChangingCase: l = !1 } = o;
    Ls.checkParentPaths(e, s, t, "move", (d) => {
      if (d) return n(d);
      if (Wm(t)) return Us(e, t, i, l, n);
      Hm(za.dirname(t), (c) => c ? n(c) : Us(e, t, i, l, n));
    });
  });
}
function Wm(e) {
  const t = za.dirname(e);
  return za.parse(t).root === t;
}
function Us(e, t, r, n, i) {
  if (n) return ua(e, t, r, i);
  if (r)
    return gu(t, (a) => a ? i(a) : ua(e, t, r, i));
  qm(t, (a, o) => a ? i(a) : o ? i(new Error("dest already exists.")) : ua(e, t, r, i));
}
function ua(e, t, r, n) {
  Gm.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Vm(e, t, r, n) : n());
}
function Vm(e, t, r, n) {
  zm(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (a) => a ? n(a) : gu(e, n));
}
var Ym = Xm;
const yu = $e, Ha = ue, Km = Eo.copySync, wu = Ri.removeSync, Jm = lt.mkdirpSync, Ms = Ar;
function Qm(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: a = !1 } = Ms.checkPathsSync(e, t, "move", r);
  return Ms.checkParentPathsSync(e, i, t, "move"), Zm(t) || Jm(Ha.dirname(t)), e0(e, t, n, a);
}
function Zm(e) {
  const t = Ha.dirname(e);
  return Ha.parse(t).root === t;
}
function e0(e, t, r, n) {
  if (n) return fa(e, t, r);
  if (r)
    return wu(t), fa(e, t, r);
  if (yu.existsSync(t)) throw new Error("dest already exists.");
  return fa(e, t, r);
}
function fa(e, t, r) {
  try {
    yu.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return t0(e, t, r);
  }
}
function t0(e, t, r) {
  return Km(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), wu(e);
}
var r0 = Qm;
const n0 = Fe.fromCallback;
var i0 = {
  move: n0(Ym),
  moveSync: r0
}, kt = {
  // Export promiseified graceful-fs:
  ...er,
  // Export extra methods:
  ...Eo,
  ...zh,
  ...ym,
  ...jm,
  ...lt,
  ...i0,
  ..._o,
  ...tr,
  ...Ri
}, ht = {}, It = {}, Ee = {}, Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.CancellationError = Ct.CancellationToken = void 0;
const a0 = Cc;
class o0 extends a0.EventEmitter {
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
      return Promise.reject(new qa());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, a) => {
      let o = null;
      if (n = () => {
        try {
          o != null && (o(), o = null);
        } finally {
          a(new qa());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, a, (s) => {
        o = s;
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
Ct.CancellationToken = o0;
class qa extends Error {
  constructor() {
    super("cancelled");
  }
}
Ct.CancellationError = qa;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.newError = s0;
function s0(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var ke = {}, Xa = { exports: {} }, Un = { exports: {} }, da, Bs;
function l0() {
  if (Bs) return da;
  Bs = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, a = n * 365.25;
  da = function(c, u) {
    u = u || {};
    var p = typeof c;
    if (p === "string" && c.length > 0)
      return o(c);
    if (p === "number" && isFinite(c))
      return u.long ? l(c) : s(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function o(c) {
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
  function s(c) {
    var u = Math.abs(c);
    return u >= n ? Math.round(c / n) + "d" : u >= r ? Math.round(c / r) + "h" : u >= t ? Math.round(c / t) + "m" : u >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var u = Math.abs(c);
    return u >= n ? d(c, u, n, "day") : u >= r ? d(c, u, r, "hour") : u >= t ? d(c, u, t, "minute") : u >= e ? d(c, u, e, "second") : c + " ms";
  }
  function d(c, u, p, g) {
    var x = u >= p * 1.5;
    return Math.round(c / p) + " " + g + (x ? "s" : "");
  }
  return da;
}
var pa, js;
function xu() {
  if (js) return pa;
  js = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = d, n.disable = s, n.enable = a, n.enabled = l, n.humanize = l0(), n.destroy = c, Object.keys(t).forEach((u) => {
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
      let p, g = null, x, w;
      function T(...b) {
        if (!T.enabled)
          return;
        const _ = T, F = Number(/* @__PURE__ */ new Date()), D = F - (p || F);
        _.diff = D, _.prev = p, _.curr = F, p = F, b[0] = n.coerce(b[0]), typeof b[0] != "string" && b.unshift("%O");
        let k = 0;
        b[0] = b[0].replace(/%([a-zA-Z%])/g, (q, te) => {
          if (q === "%%")
            return "%";
          k++;
          const y = n.formatters[te];
          if (typeof y == "function") {
            const j = b[k];
            q = y.call(_, j), b.splice(k, 1), k--;
          }
          return q;
        }), n.formatArgs.call(_, b), (_.log || n.log).apply(_, b);
      }
      return T.namespace = u, T.useColors = n.useColors(), T.color = n.selectColor(u), T.extend = i, T.destroy = n.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (x !== n.namespaces && (x = n.namespaces, w = n.enabled(u)), w),
        set: (b) => {
          g = b;
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
    function o(u, p) {
      let g = 0, x = 0, w = -1, T = 0;
      for (; g < u.length; )
        if (x < p.length && (p[x] === u[g] || p[x] === "*"))
          p[x] === "*" ? (w = x, T = g, x++) : (g++, x++);
        else if (w !== -1)
          x = w + 1, T++, g = T;
        else
          return !1;
      for (; x < p.length && p[x] === "*"; )
        x++;
      return x === p.length;
    }
    function s() {
      const u = [
        ...n.names,
        ...n.skips.map((p) => "-" + p)
      ].join(",");
      return n.enable(""), u;
    }
    function l(u) {
      for (const p of n.skips)
        if (o(u, p))
          return !1;
      for (const p of n.names)
        if (o(u, p))
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
  return pa = e, pa;
}
var Gs;
function c0() {
  return Gs || (Gs = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = a, t.useColors = r, t.storage = o(), t.destroy = /* @__PURE__ */ (() => {
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
    function o() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = xu()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (d) {
        return "[UnexpectedJSONParseError]: " + d.message;
      }
    };
  }(Un, Un.exports)), Un.exports;
}
var Mn = { exports: {} }, ha, zs;
function u0() {
  return zs || (zs = 1, ha = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), ha;
}
var ma, Hs;
function f0() {
  if (Hs) return ma;
  Hs = 1;
  const e = Ai, t = Rc, r = u0(), { env: n } = process;
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
  function o(l, d) {
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
  function s(l) {
    const d = o(l, l && l.isTTY);
    return a(d);
  }
  return ma = {
    supportsColor: s,
    stdout: a(o(!0, t.isatty(1))),
    stderr: a(o(!0, t.isatty(2)))
  }, ma;
}
var qs;
function d0() {
  return qs || (qs = 1, function(e, t) {
    const r = Rc, n = ho;
    t.init = c, t.log = s, t.formatArgs = a, t.save = l, t.load = d, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const p = f0();
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
      const x = g.substring(6).toLowerCase().replace(/_([a-z])/g, (T, b) => b.toUpperCase());
      let w = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(w) ? w = !0 : /^(no|off|false|disabled)$/i.test(w) ? w = !1 : w === "null" ? w = null : w = Number(w), p[x] = w, p;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function a(p) {
      const { namespace: g, useColors: x } = this;
      if (x) {
        const w = this.color, T = "\x1B[3" + (w < 8 ? w : "8;5;" + w), b = `  ${T};1m${g} \x1B[0m`;
        p[0] = b + p[0].split(`
`).join(`
` + b), p.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        p[0] = o() + g + " " + p[0];
    }
    function o() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...p) {
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
      for (let x = 0; x < g.length; x++)
        p.inspectOpts[g[x]] = t.inspectOpts[g[x]];
    }
    e.exports = xu()(t);
    const { formatters: u } = e.exports;
    u.o = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, u.O = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts);
    };
  }(Mn, Mn.exports)), Mn.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Xa.exports = c0() : Xa.exports = d0();
var Eu = Xa.exports;
const Cr = /* @__PURE__ */ Cp(Eu);
var pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.ProgressCallbackTransform = void 0;
const p0 = un;
class h0 extends p0.Transform {
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
pn.ProgressCallbackTransform = h0;
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.DigestTransform = ke.HttpExecutor = ke.HttpError = void 0;
ke.createHttpError = Wa;
ke.parseJson = T0;
ke.configureRequestOptionsFromUrl = Tu;
ke.configureRequestUrl = So;
ke.safeGetHeader = Er;
ke.configureRequestOptions = hi;
ke.safeStringifyJson = mi;
const m0 = fn, g0 = Eu, y0 = Pt, w0 = un, vu = Sr, x0 = Ct, Xs = Ir, E0 = pn, $r = (0, g0.default)("electron-builder");
function Wa(e, t = null) {
  return new bo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + mi(e.headers), t);
}
const v0 = /* @__PURE__ */ new Map([
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
class bo extends Error {
  constructor(t, r = `HTTP error: ${v0.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
ke.HttpError = bo;
function T0(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class pi {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new x0.CancellationToken(), n) {
    hi(t);
    const i = n == null ? void 0 : JSON.stringify(n), a = i ? Buffer.from(i) : void 0;
    if (a != null) {
      $r(i);
      const { headers: o, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": a.length,
          ...o
        },
        ...s
      };
    }
    return this.doApiRequest(t, r, (o) => o.end(a));
  }
  doApiRequest(t, r, n, i = 0) {
    return $r.enabled && $r(`Request: ${mi(t)}`), r.createPromise((a, o, s) => {
      const l = this.createRequest(t, (d) => {
        try {
          this.handleResponse(d, t, r, a, o, i, n);
        } catch (c) {
          o(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, o, t.timeout), this.addRedirectHandlers(l, t, o, i, (d) => {
        this.doApiRequest(d, r, n, i).then(a).catch(o);
      }), n(l, o), s(() => l.abort());
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
  handleResponse(t, r, n, i, a, o, s) {
    var l;
    if ($r.enabled && $r(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${mi(r)}`), t.statusCode === 404) {
      a(Wa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const d = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = d >= 300 && d < 400, u = Er(t, "location");
    if (c && u != null) {
      if (o > this.maxRedirects) {
        a(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(pi.prepareRedirectUrlOptions(u, r), n, s, o).then(i).catch(a);
      return;
    }
    t.setEncoding("utf8");
    let p = "";
    t.on("error", a), t.on("data", (g) => p += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = Er(t, "content-type"), x = g != null && (Array.isArray(g) ? g.find((w) => w.includes("json")) != null : g.includes("json"));
          a(Wa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${x ? JSON.stringify(JSON.parse(p)) : p}
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
      const o = [], s = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      So(t, s), hi(s), this.doDownload(s, {
        destination: null,
        options: r,
        onCancel: a,
        callback: (l) => {
          l == null ? n(Buffer.concat(o)) : i(l);
        },
        responseHandler: (l, d) => {
          let c = 0;
          l.on("data", (u) => {
            if (c += u.length, c > 524288e3) {
              d(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            o.push(u);
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
      const o = Er(a, "location");
      if (o != null) {
        n < this.maxRedirects ? this.doDownload(pi.prepareRedirectUrlOptions(o, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? b0(r, a) : r.responseHandler(a, r.callback);
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
    const n = Tu(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const a = new vu.URL(t);
      (a.hostname.endsWith(".amazonaws.com") || a.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof bo && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
ke.HttpExecutor = pi;
function Tu(e, t) {
  const r = hi(t);
  return So(new vu.URL(e), r), r;
}
function So(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Va extends w0.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, m0.createHash)(r);
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
      throw (0, Xs.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Xs.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
ke.DigestTransform = Va;
function _0(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Er(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function b0(e, t) {
  if (!_0(Er(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const o = Er(t, "content-length");
    o != null && r.push(new E0.ProgressCallbackTransform(parseInt(o, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Va(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Va(e.options.sha2, "sha256", "hex"));
  const i = (0, y0.createWriteStream)(e.destination);
  r.push(i);
  let a = t;
  for (const o of r)
    o.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), a = a.pipe(o);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function hi(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function mi(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.MemoLazy = void 0;
class S0 {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && _u(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
Oi.MemoLazy = S0;
function _u(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), a = Object.keys(t);
    return i.length === a.length && i.every((o) => _u(e[o], t[o]));
  }
  return e === t;
}
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.githubUrl = A0;
Pi.getS3LikeProviderBaseUrl = I0;
function A0(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function I0(e) {
  const t = e.provider;
  if (t === "s3")
    return C0(e);
  if (t === "spaces")
    return R0(e);
  throw new Error(`Not supported provider: ${t}`);
}
function C0(e) {
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
  return bu(t, e.path);
}
function bu(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function R0(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return bu(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Ao = {};
Object.defineProperty(Ao, "__esModule", { value: !0 });
Ao.retry = Su;
const D0 = Ct;
async function Su(e, t, r, n = 0, i = 0, a) {
  var o;
  const s = new D0.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((o = a == null ? void 0 : a(l)) !== null && o !== void 0) || o) && t > 0 && !s.cancelled)
      return await new Promise((d) => setTimeout(d, r + n * i)), await Su(e, t - 1, r, n, i + 1, a);
    throw l;
  }
}
var Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
Io.parseDn = O0;
function O0(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const a = /* @__PURE__ */ new Map();
  for (let o = 0; o <= e.length; o++) {
    if (o === e.length) {
      r !== null && a.set(r, n);
      break;
    }
    const s = e[o];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        o++;
        const l = parseInt(e.slice(o, o + 2), 16);
        Number.isNaN(l) ? n += e[o] : (o++, n += String.fromCharCode(l));
        continue;
      }
      if (r === null && s === "=") {
        r = n, n = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        r !== null && a.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (n.length === 0)
        continue;
      if (o > i) {
        let l = o;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        o = i - 1;
        continue;
      }
    }
    n += s;
  }
  return a;
}
var _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.nil = _r.UUID = void 0;
const Au = fn, Iu = Ir, P0 = "options.name must be either a string or a Buffer", Ws = (0, Au.randomBytes)(16);
Ws[0] = Ws[0] | 1;
const li = {}, Q = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  li[t] = e, Q[e] = t;
}
class Qt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Qt.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return k0(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = N0(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (li[t[14] + t[15]] & 240) >> 4,
        variant: Vs((li[t[19] + t[20]] & 224) >> 5),
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
        variant: Vs((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Iu.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = li[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
_r.UUID = Qt;
Qt.OID = Qt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Vs(e) {
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
var Xr;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Xr || (Xr = {}));
function k0(e, t, r, n, i = Xr.ASCII) {
  const a = (0, Au.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Iu.newError)(P0, "ERR_INVALID_UUID_NAME");
  a.update(n), a.update(e);
  const s = a.digest();
  let l;
  switch (i) {
    case Xr.BINARY:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Xr.OBJECT:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = new Qt(s);
      break;
    default:
      l = Q[s[0]] + Q[s[1]] + Q[s[2]] + Q[s[3]] + "-" + Q[s[4]] + Q[s[5]] + "-" + Q[s[6] & 15 | r] + Q[s[7]] + "-" + Q[s[8] & 63 | 128] + Q[s[9]] + "-" + Q[s[10]] + Q[s[11]] + Q[s[12]] + Q[s[13]] + Q[s[14]] + Q[s[15]];
      break;
  }
  return l;
}
function N0(e) {
  return Q[e[0]] + Q[e[1]] + Q[e[2]] + Q[e[3]] + "-" + Q[e[4]] + Q[e[5]] + "-" + Q[e[6]] + Q[e[7]] + "-" + Q[e[8]] + Q[e[9]] + "-" + Q[e[10]] + Q[e[11]] + Q[e[12]] + Q[e[13]] + Q[e[14]] + Q[e[15]];
}
_r.nil = new Qt("00000000-0000-0000-0000-000000000000");
var hn = {}, Cu = {};
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
      var A = this;
      a(A), A.q = A.c = "", A.bufferCheckPosition = t.MAX_BUFFER_LENGTH, A.opt = f || {}, A.opt.lowercase = A.opt.lowercase || A.opt.lowercasetags, A.looseCase = A.opt.lowercase ? "toLowerCase" : "toUpperCase", A.tags = [], A.closed = A.closedRoot = A.sawRoot = !1, A.tag = A.error = null, A.strict = !!h, A.noscript = !!(h || A.opt.noscript), A.state = y.BEGIN, A.strictEntities = A.opt.strictEntities, A.ENTITIES = A.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), A.attribList = [], A.opt.xmlns && (A.ns = Object.create(w)), A.opt.unquotedAttributeValues === void 0 && (A.opt.unquotedAttributeValues = !h), A.trackPosition = A.opt.position !== !1, A.trackPosition && (A.position = A.line = A.column = 0), U(A, "onready");
    }
    Object.create || (Object.create = function(h) {
      function f() {
      }
      f.prototype = h;
      var A = new f();
      return A;
    }), Object.keys || (Object.keys = function(h) {
      var f = [];
      for (var A in h) h.hasOwnProperty(A) && f.push(A);
      return f;
    });
    function i(h) {
      for (var f = Math.max(t.MAX_BUFFER_LENGTH, 10), A = 0, v = 0, Z = r.length; v < Z; v++) {
        var ae = h[r[v]].length;
        if (ae > f)
          switch (r[v]) {
            case "textNode":
              J(h);
              break;
            case "cdata":
              M(h, "oncdata", h.cdata), h.cdata = "";
              break;
            case "script":
              M(h, "onscript", h.script), h.script = "";
              break;
            default:
              I(h, "Max buffer length exceeded: " + r[v]);
          }
        A = Math.max(A, ae);
      }
      var fe = t.MAX_BUFFER_LENGTH - A;
      h.bufferCheckPosition = fe + h.position;
    }
    function a(h) {
      for (var f = 0, A = r.length; f < A; f++)
        h[r[f]] = "";
    }
    function o(h) {
      J(h), h.cdata !== "" && (M(h, "oncdata", h.cdata), h.cdata = ""), h.script !== "" && (M(h, "onscript", h.script), h.script = "");
    }
    n.prototype = {
      end: function() {
        P(this);
      },
      write: et,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        o(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
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
      s.apply(this), this._parser = new n(h, f), this.writable = !0, this.readable = !0;
      var A = this;
      this._parser.onend = function() {
        A.emit("end");
      }, this._parser.onerror = function(v) {
        A.emit("error", v), A._parser.error = null;
      }, this._decoder = null, l.forEach(function(v) {
        Object.defineProperty(A, "on" + v, {
          get: function() {
            return A._parser["on" + v];
          },
          set: function(Z) {
            if (!Z)
              return A.removeAllListeners(v), A._parser["on" + v] = Z, Z;
            A.on(v, Z);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(s.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype.write = function(h) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(h)) {
        if (!this._decoder) {
          var f = vp.StringDecoder;
          this._decoder = new f("utf8");
        }
        h = this._decoder.write(h);
      }
      return this._parser.write(h.toString()), this.emit("data", h), !0;
    }, c.prototype.end = function(h) {
      return h && h.length && this.write(h), this._parser.end(), !0;
    }, c.prototype.on = function(h, f) {
      var A = this;
      return !A._parser["on" + h] && l.indexOf(h) !== -1 && (A._parser["on" + h] = function() {
        var v = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        v.splice(0, 0, h), A.emit.apply(A, v);
      }), s.prototype.on.call(A, h, f);
    };
    var u = "[CDATA[", p = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", x = "http://www.w3.org/2000/xmlns/", w = { xml: g, xmlns: x }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, b = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, _ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, F = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function D(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function k(h) {
      return h === '"' || h === "'";
    }
    function H(h) {
      return h === ">" || D(h);
    }
    function q(h, f) {
      return h.test(f);
    }
    function te(h, f) {
      return !q(h, f);
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
      var f = t.ENTITIES[h], A = typeof f == "number" ? String.fromCharCode(f) : f;
      t.ENTITIES[h] = A;
    });
    for (var j in t.STATE)
      t.STATE[t.STATE[j]] = j;
    y = t.STATE;
    function U(h, f, A) {
      h[f] && h[f](A);
    }
    function M(h, f, A) {
      h.textNode && J(h), U(h, f, A);
    }
    function J(h) {
      h.textNode = R(h.opt, h.textNode), h.textNode && U(h, "ontext", h.textNode), h.textNode = "";
    }
    function R(h, f) {
      return h.trim && (f = f.trim()), h.normalize && (f = f.replace(/\s+/g, " ")), f;
    }
    function I(h, f) {
      return J(h), h.trackPosition && (f += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), f = new Error(f), h.error = f, U(h, "onerror", f), h;
    }
    function P(h) {
      return h.sawRoot && !h.closedRoot && S(h, "Unclosed root tag"), h.state !== y.BEGIN && h.state !== y.BEGIN_WHITESPACE && h.state !== y.TEXT && I(h, "Unexpected end"), J(h), h.c = "", h.closed = !0, U(h, "onend"), n.call(h, h.strict, h.opt), h;
    }
    function S(h, f) {
      if (typeof h != "object" || !(h instanceof n))
        throw new Error("bad call to strictFail");
      h.strict && I(h, f);
    }
    function $(h) {
      h.strict || (h.tagName = h.tagName[h.looseCase]());
      var f = h.tags[h.tags.length - 1] || h, A = h.tag = { name: h.tagName, attributes: {} };
      h.opt.xmlns && (A.ns = f.ns), h.attribList.length = 0, M(h, "onopentagstart", A);
    }
    function O(h, f) {
      var A = h.indexOf(":"), v = A < 0 ? ["", h] : h.split(":"), Z = v[0], ae = v[1];
      return f && h === "xmlns" && (Z = "xmlns", ae = ""), { prefix: Z, local: ae };
    }
    function z(h) {
      if (h.strict || (h.attribName = h.attribName[h.looseCase]()), h.attribList.indexOf(h.attribName) !== -1 || h.tag.attributes.hasOwnProperty(h.attribName)) {
        h.attribName = h.attribValue = "";
        return;
      }
      if (h.opt.xmlns) {
        var f = O(h.attribName, !0), A = f.prefix, v = f.local;
        if (A === "xmlns")
          if (v === "xml" && h.attribValue !== g)
            S(
              h,
              "xml: prefix must be bound to " + g + `
Actual: ` + h.attribValue
            );
          else if (v === "xmlns" && h.attribValue !== x)
            S(
              h,
              "xmlns: prefix must be bound to " + x + `
Actual: ` + h.attribValue
            );
          else {
            var Z = h.tag, ae = h.tags[h.tags.length - 1] || h;
            Z.ns === ae.ns && (Z.ns = Object.create(ae.ns)), Z.ns[v] = h.attribValue;
          }
        h.attribList.push([h.attribName, h.attribValue]);
      } else
        h.tag.attributes[h.attribName] = h.attribValue, M(h, "onattribute", {
          name: h.attribName,
          value: h.attribValue
        });
      h.attribName = h.attribValue = "";
    }
    function Y(h, f) {
      if (h.opt.xmlns) {
        var A = h.tag, v = O(h.tagName);
        A.prefix = v.prefix, A.local = v.local, A.uri = A.ns[v.prefix] || "", A.prefix && !A.uri && (S(
          h,
          "Unbound namespace prefix: " + JSON.stringify(h.tagName)
        ), A.uri = v.prefix);
        var Z = h.tags[h.tags.length - 1] || h;
        A.ns && Z.ns !== A.ns && Object.keys(A.ns).forEach(function(Sn) {
          M(h, "onopennamespace", {
            prefix: Sn,
            uri: A.ns[Sn]
          });
        });
        for (var ae = 0, fe = h.attribList.length; ae < fe; ae++) {
          var ve = h.attribList[ae], Se = ve[0], mt = ve[1], he = O(Se, !0), We = he.prefix, Zi = he.local, bn = We === "" ? "" : A.ns[We] || "", Or = {
            name: Se,
            value: mt,
            prefix: We,
            local: Zi,
            uri: bn
          };
          We && We !== "xmlns" && !bn && (S(
            h,
            "Unbound namespace prefix: " + JSON.stringify(We)
          ), Or.uri = We), h.tag.attributes[Se] = Or, M(h, "onattribute", Or);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!f, h.sawRoot = !0, h.tags.push(h.tag), M(h, "onopentag", h.tag), f || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = y.SCRIPT : h.state = y.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function X(h) {
      if (!h.tagName) {
        S(h, "Weird empty close tag."), h.textNode += "</>", h.state = y.TEXT;
        return;
      }
      if (h.script) {
        if (h.tagName !== "script") {
          h.script += "</" + h.tagName + ">", h.tagName = "", h.state = y.SCRIPT;
          return;
        }
        M(h, "onscript", h.script), h.script = "";
      }
      var f = h.tags.length, A = h.tagName;
      h.strict || (A = A[h.looseCase]());
      for (var v = A; f--; ) {
        var Z = h.tags[f];
        if (Z.name !== v)
          S(h, "Unexpected close tag");
        else
          break;
      }
      if (f < 0) {
        S(h, "Unmatched closing tag: " + h.tagName), h.textNode += "</" + h.tagName + ">", h.state = y.TEXT;
        return;
      }
      h.tagName = A;
      for (var ae = h.tags.length; ae-- > f; ) {
        var fe = h.tag = h.tags.pop();
        h.tagName = h.tag.name, M(h, "onclosetag", h.tagName);
        var ve = {};
        for (var Se in fe.ns)
          ve[Se] = fe.ns[Se];
        var mt = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && fe.ns !== mt.ns && Object.keys(fe.ns).forEach(function(he) {
          var We = fe.ns[he];
          M(h, "onclosenamespace", { prefix: he, uri: We });
        });
      }
      f === 0 && (h.closedRoot = !0), h.tagName = h.attribValue = h.attribName = "", h.attribList.length = 0, h.state = y.TEXT;
    }
    function re(h) {
      var f = h.entity, A = f.toLowerCase(), v, Z = "";
      return h.ENTITIES[f] ? h.ENTITIES[f] : h.ENTITIES[A] ? h.ENTITIES[A] : (f = A, f.charAt(0) === "#" && (f.charAt(1) === "x" ? (f = f.slice(2), v = parseInt(f, 16), Z = v.toString(16)) : (f = f.slice(1), v = parseInt(f, 10), Z = v.toString(10))), f = f.replace(/^0+/, ""), isNaN(v) || Z.toLowerCase() !== f || v < 0 || v > 1114111 ? (S(h, "Invalid character entity"), "&" + h.entity + ";") : String.fromCodePoint(v));
    }
    function ge(h, f) {
      f === "<" ? (h.state = y.OPEN_WAKA, h.startTagPosition = h.position) : D(f) || (S(h, "Non-whitespace before first tag."), h.textNode = f, h.state = y.TEXT);
    }
    function G(h, f) {
      var A = "";
      return f < h.length && (A = h.charAt(f)), A;
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
        return P(f);
      typeof h == "object" && (h = h.toString());
      for (var A = 0, v = ""; v = G(h, A++), f.c = v, !!v; )
        switch (f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++), f.state) {
          case y.BEGIN:
            if (f.state = y.BEGIN_WHITESPACE, v === "\uFEFF")
              continue;
            ge(f, v);
            continue;
          case y.BEGIN_WHITESPACE:
            ge(f, v);
            continue;
          case y.TEXT:
            if (f.sawRoot && !f.closedRoot) {
              for (var ae = A - 1; v && v !== "<" && v !== "&"; )
                v = G(h, A++), v && f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++);
              f.textNode += h.substring(ae, A - 1);
            }
            v === "<" && !(f.sawRoot && f.closedRoot && !f.strict) ? (f.state = y.OPEN_WAKA, f.startTagPosition = f.position) : (!D(v) && (!f.sawRoot || f.closedRoot) && S(f, "Text data outside of root node."), v === "&" ? f.state = y.TEXT_ENTITY : f.textNode += v);
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
            else if (!D(v)) if (q(T, v))
              f.state = y.OPEN_TAG, f.tagName = v;
            else if (v === "/")
              f.state = y.CLOSE_TAG, f.tagName = "";
            else if (v === "?")
              f.state = y.PROC_INST, f.procInstName = f.procInstBody = "";
            else {
              if (S(f, "Unencoded <"), f.startTagPosition + 1 < f.position) {
                var Z = f.position - f.startTagPosition;
                v = new Array(Z).join(" ") + v;
              }
              f.textNode += "<" + v, f.state = y.TEXT;
            }
            continue;
          case y.SGML_DECL:
            if (f.sgmlDecl + v === "--") {
              f.state = y.COMMENT, f.comment = "", f.sgmlDecl = "";
              continue;
            }
            f.doctype && f.doctype !== !0 && f.sgmlDecl ? (f.state = y.DOCTYPE_DTD, f.doctype += "<!" + f.sgmlDecl + v, f.sgmlDecl = "") : (f.sgmlDecl + v).toUpperCase() === u ? (M(f, "onopencdata"), f.state = y.CDATA, f.sgmlDecl = "", f.cdata = "") : (f.sgmlDecl + v).toUpperCase() === p ? (f.state = y.DOCTYPE, (f.doctype || f.sawRoot) && S(
              f,
              "Inappropriately located doctype declaration"
            ), f.doctype = "", f.sgmlDecl = "") : v === ">" ? (M(f, "onsgmldeclaration", f.sgmlDecl), f.sgmlDecl = "", f.state = y.TEXT) : (k(v) && (f.state = y.SGML_DECL_QUOTED), f.sgmlDecl += v);
            continue;
          case y.SGML_DECL_QUOTED:
            v === f.q && (f.state = y.SGML_DECL, f.q = ""), f.sgmlDecl += v;
            continue;
          case y.DOCTYPE:
            v === ">" ? (f.state = y.TEXT, M(f, "ondoctype", f.doctype), f.doctype = !0) : (f.doctype += v, v === "[" ? f.state = y.DOCTYPE_DTD : k(v) && (f.state = y.DOCTYPE_QUOTED, f.q = v));
            continue;
          case y.DOCTYPE_QUOTED:
            f.doctype += v, v === f.q && (f.q = "", f.state = y.DOCTYPE);
            continue;
          case y.DOCTYPE_DTD:
            v === "]" ? (f.doctype += v, f.state = y.DOCTYPE) : v === "<" ? (f.state = y.OPEN_WAKA, f.startTagPosition = f.position) : k(v) ? (f.doctype += v, f.state = y.DOCTYPE_DTD_QUOTED, f.q = v) : f.doctype += v;
            continue;
          case y.DOCTYPE_DTD_QUOTED:
            f.doctype += v, v === f.q && (f.state = y.DOCTYPE_DTD, f.q = "");
            continue;
          case y.COMMENT:
            v === "-" ? f.state = y.COMMENT_ENDING : f.comment += v;
            continue;
          case y.COMMENT_ENDING:
            v === "-" ? (f.state = y.COMMENT_ENDED, f.comment = R(f.opt, f.comment), f.comment && M(f, "oncomment", f.comment), f.comment = "") : (f.comment += "-" + v, f.state = y.COMMENT);
            continue;
          case y.COMMENT_ENDED:
            v !== ">" ? (S(f, "Malformed comment"), f.comment += "--" + v, f.state = y.COMMENT) : f.doctype && f.doctype !== !0 ? f.state = y.DOCTYPE_DTD : f.state = y.TEXT;
            continue;
          case y.CDATA:
            for (var ae = A - 1; v && v !== "]"; )
              v = G(h, A++), v && f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++);
            f.cdata += h.substring(ae, A - 1), v === "]" && (f.state = y.CDATA_ENDING);
            continue;
          case y.CDATA_ENDING:
            v === "]" ? f.state = y.CDATA_ENDING_2 : (f.cdata += "]" + v, f.state = y.CDATA);
            continue;
          case y.CDATA_ENDING_2:
            v === ">" ? (f.cdata && M(f, "oncdata", f.cdata), M(f, "onclosecdata"), f.cdata = "", f.state = y.TEXT) : v === "]" ? f.cdata += "]" : (f.cdata += "]]" + v, f.state = y.CDATA);
            continue;
          case y.PROC_INST:
            v === "?" ? f.state = y.PROC_INST_ENDING : D(v) ? f.state = y.PROC_INST_BODY : f.procInstName += v;
            continue;
          case y.PROC_INST_BODY:
            if (!f.procInstBody && D(v))
              continue;
            v === "?" ? f.state = y.PROC_INST_ENDING : f.procInstBody += v;
            continue;
          case y.PROC_INST_ENDING:
            v === ">" ? (M(f, "onprocessinginstruction", {
              name: f.procInstName,
              body: f.procInstBody
            }), f.procInstName = f.procInstBody = "", f.state = y.TEXT) : (f.procInstBody += "?" + v, f.state = y.PROC_INST_BODY);
            continue;
          case y.OPEN_TAG:
            q(b, v) ? f.tagName += v : ($(f), v === ">" ? Y(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : (D(v) || S(f, "Invalid character in tag name"), f.state = y.ATTRIB));
            continue;
          case y.OPEN_TAG_SLASH:
            v === ">" ? (Y(f, !0), X(f)) : (S(
              f,
              "Forward-slash in opening tag not followed by >"
            ), f.state = y.ATTRIB);
            continue;
          case y.ATTRIB:
            if (D(v))
              continue;
            v === ">" ? Y(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : q(T, v) ? (f.attribName = v, f.attribValue = "", f.state = y.ATTRIB_NAME) : S(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME:
            v === "=" ? f.state = y.ATTRIB_VALUE : v === ">" ? (S(f, "Attribute without value"), f.attribValue = f.attribName, z(f), Y(f)) : D(v) ? f.state = y.ATTRIB_NAME_SAW_WHITE : q(b, v) ? f.attribName += v : S(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME_SAW_WHITE:
            if (v === "=")
              f.state = y.ATTRIB_VALUE;
            else {
              if (D(v))
                continue;
              S(f, "Attribute without value"), f.tag.attributes[f.attribName] = "", f.attribValue = "", M(f, "onattribute", {
                name: f.attribName,
                value: ""
              }), f.attribName = "", v === ">" ? Y(f) : q(T, v) ? (f.attribName = v, f.state = y.ATTRIB_NAME) : (S(f, "Invalid attribute name"), f.state = y.ATTRIB);
            }
            continue;
          case y.ATTRIB_VALUE:
            if (D(v))
              continue;
            k(v) ? (f.q = v, f.state = y.ATTRIB_VALUE_QUOTED) : (f.opt.unquotedAttributeValues || I(f, "Unquoted attribute value"), f.state = y.ATTRIB_VALUE_UNQUOTED, f.attribValue = v);
            continue;
          case y.ATTRIB_VALUE_QUOTED:
            if (v !== f.q) {
              v === "&" ? f.state = y.ATTRIB_VALUE_ENTITY_Q : f.attribValue += v;
              continue;
            }
            z(f), f.q = "", f.state = y.ATTRIB_VALUE_CLOSED;
            continue;
          case y.ATTRIB_VALUE_CLOSED:
            D(v) ? f.state = y.ATTRIB : v === ">" ? Y(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : q(T, v) ? (S(f, "No whitespace between attributes"), f.attribName = v, f.attribValue = "", f.state = y.ATTRIB_NAME) : S(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_VALUE_UNQUOTED:
            if (!H(v)) {
              v === "&" ? f.state = y.ATTRIB_VALUE_ENTITY_U : f.attribValue += v;
              continue;
            }
            z(f), v === ">" ? Y(f) : f.state = y.ATTRIB;
            continue;
          case y.CLOSE_TAG:
            if (f.tagName)
              v === ">" ? X(f) : q(b, v) ? f.tagName += v : f.script ? (f.script += "</" + f.tagName, f.tagName = "", f.state = y.SCRIPT) : (D(v) || S(f, "Invalid tagname in closing tag"), f.state = y.CLOSE_TAG_SAW_WHITE);
            else {
              if (D(v))
                continue;
              te(T, v) ? f.script ? (f.script += "</" + v, f.state = y.SCRIPT) : S(f, "Invalid tagname in closing tag.") : f.tagName = v;
            }
            continue;
          case y.CLOSE_TAG_SAW_WHITE:
            if (D(v))
              continue;
            v === ">" ? X(f) : S(f, "Invalid characters in closing tag");
            continue;
          case y.TEXT_ENTITY:
          case y.ATTRIB_VALUE_ENTITY_Q:
          case y.ATTRIB_VALUE_ENTITY_U:
            var fe, ve;
            switch (f.state) {
              case y.TEXT_ENTITY:
                fe = y.TEXT, ve = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                fe = y.ATTRIB_VALUE_QUOTED, ve = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                fe = y.ATTRIB_VALUE_UNQUOTED, ve = "attribValue";
                break;
            }
            if (v === ";") {
              var Se = re(f);
              f.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Se) ? (f.entity = "", f.state = fe, f.write(Se)) : (f[ve] += Se, f.entity = "", f.state = fe);
            } else q(f.entity.length ? F : _, v) ? f.entity += v : (S(f, "Invalid character in entity name"), f[ve] += "&" + f.entity + v, f.entity = "", f.state = fe);
            continue;
          default:
            throw new Error(f, "Unknown state: " + f.state);
        }
      return f.position >= f.bufferCheckPosition && i(f), f;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, f = Math.floor, A = function() {
        var v = 16384, Z = [], ae, fe, ve = -1, Se = arguments.length;
        if (!Se)
          return "";
        for (var mt = ""; ++ve < Se; ) {
          var he = Number(arguments[ve]);
          if (!isFinite(he) || // `NaN`, `+Infinity`, or `-Infinity`
          he < 0 || // not a valid Unicode code point
          he > 1114111 || // not a valid Unicode code point
          f(he) !== he)
            throw RangeError("Invalid code point: " + he);
          he <= 65535 ? Z.push(he) : (he -= 65536, ae = (he >> 10) + 55296, fe = he % 1024 + 56320, Z.push(ae, fe)), (ve + 1 === Se || Z.length > v) && (mt += h.apply(null, Z), Z.length = 0);
        }
        return mt;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: A,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = A;
    }();
  })(e);
})(Cu);
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.XElement = void 0;
hn.parseXml = U0;
const F0 = Cu, Bn = Ir;
class Ru {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Bn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!L0(t))
      throw (0, Bn.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Bn.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Bn.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (Ys(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Ys(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
hn.XElement = Ru;
const $0 = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function L0(e) {
  return $0.test(e);
}
function Ys(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function U0(e) {
  let t = null;
  const r = F0.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const a = new Ru(i.name);
    if (a.attributes = i.attributes, t === null)
      t = a;
    else {
      const o = n[n.length - 1];
      o.elements == null && (o.elements = []), o.elements.push(a);
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
  var t = Ct;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = Ir;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = ke;
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
  var i = Oi;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var a = pn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return a.ProgressCallbackTransform;
  } });
  var o = Pi;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return o.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return o.githubUrl;
  } });
  var s = Ao;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = Io;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var d = _r;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return d.UUID;
  } });
  var c = hn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function u(p) {
    return p == null ? [] : Array.isArray(p) ? p : [p];
  }
})(Ee);
var be = {}, Co = {}, Je = {};
function Du(e) {
  return typeof e > "u" || e === null;
}
function M0(e) {
  return typeof e == "object" && e !== null;
}
function B0(e) {
  return Array.isArray(e) ? e : Du(e) ? [] : [e];
}
function j0(e, t) {
  var r, n, i, a;
  if (t)
    for (a = Object.keys(t), r = 0, n = a.length; r < n; r += 1)
      i = a[r], e[i] = t[i];
  return e;
}
function G0(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function z0(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Je.isNothing = Du;
Je.isObject = M0;
Je.toArray = B0;
Je.repeat = G0;
Je.isNegativeZero = z0;
Je.extend = j0;
function Ou(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Zr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Ou(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Zr.prototype = Object.create(Error.prototype);
Zr.prototype.constructor = Zr;
Zr.prototype.toString = function(t) {
  return this.name + ": " + Ou(this, t);
};
var mn = Zr, jr = Je;
function ga(e, t, r, n, i) {
  var a = "", o = "", s = Math.floor(i / 2) - 1;
  return n - t > s && (a = " ... ", t = n - s + a.length), r - n > s && (o = " ...", r = n + s - o.length), {
    str: a + e.slice(t, r).replace(/\t/g, "→") + o,
    pos: n - t + a.length
    // relative position
  };
}
function ya(e, t) {
  return jr.repeat(" ", t - e.length) + e;
}
function H0(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], a, o = -1; a = r.exec(e.buffer); )
    i.push(a.index), n.push(a.index + a[0].length), e.position <= a.index && o < 0 && (o = n.length - 2);
  o < 0 && (o = n.length - 1);
  var s = "", l, d, c = Math.min(e.line + t.linesAfter, i.length).toString().length, u = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(o - l < 0); l++)
    d = ga(
      e.buffer,
      n[o - l],
      i[o - l],
      e.position - (n[o] - n[o - l]),
      u
    ), s = jr.repeat(" ", t.indent) + ya((e.line - l + 1).toString(), c) + " | " + d.str + `
` + s;
  for (d = ga(e.buffer, n[o], i[o], e.position, u), s += jr.repeat(" ", t.indent) + ya((e.line + 1).toString(), c) + " | " + d.str + `
`, s += jr.repeat("-", t.indent + c + 3 + d.pos) + `^
`, l = 1; l <= t.linesAfter && !(o + l >= i.length); l++)
    d = ga(
      e.buffer,
      n[o + l],
      i[o + l],
      e.position - (n[o] - n[o + l]),
      u
    ), s += jr.repeat(" ", t.indent) + ya((e.line + l + 1).toString(), c) + " | " + d.str + `
`;
  return s.replace(/\n$/, "");
}
var q0 = H0, Ks = mn, X0 = [
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
], W0 = [
  "scalar",
  "sequence",
  "mapping"
];
function V0(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function Y0(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (X0.indexOf(r) === -1)
      throw new Ks('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = V0(t.styleAliases || null), W0.indexOf(this.kind) === -1)
    throw new Ks('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Le = Y0, Lr = mn, wa = Le;
function Js(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(a, o) {
      a.tag === n.tag && a.kind === n.kind && a.multi === n.multi && (i = o);
    }), r[i] = n;
  }), r;
}
function K0() {
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
function Ya(e) {
  return this.extend(e);
}
Ya.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof wa)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Lr("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(a) {
    if (!(a instanceof wa))
      throw new Lr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (a.loadKind && a.loadKind !== "scalar")
      throw new Lr("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (a.multi)
      throw new Lr("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(a) {
    if (!(a instanceof wa))
      throw new Lr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Ya.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Js(i, "implicit"), i.compiledExplicit = Js(i, "explicit"), i.compiledTypeMap = K0(i.compiledImplicit, i.compiledExplicit), i;
};
var Pu = Ya, J0 = Le, ku = new J0("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Q0 = Le, Nu = new Q0("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Z0 = Le, Fu = new Z0("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), eg = Pu, $u = new eg({
  explicit: [
    ku,
    Nu,
    Fu
  ]
}), tg = Le;
function rg(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function ng() {
  return null;
}
function ig(e) {
  return e === null;
}
var Lu = new tg("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: rg,
  construct: ng,
  predicate: ig,
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
}), ag = Le;
function og(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function sg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function lg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Uu = new ag("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: og,
  construct: sg,
  predicate: lg,
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
}), cg = Je, ug = Le;
function fg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function dg(e) {
  return 48 <= e && e <= 55;
}
function pg(e) {
  return 48 <= e && e <= 57;
}
function hg(e) {
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
          if (!fg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!dg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!pg(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function mg(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function gg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !cg.isNegativeZero(e);
}
var Mu = new ug("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: hg,
  construct: mg,
  predicate: gg,
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
}), Bu = Je, yg = Le, wg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function xg(e) {
  return !(e === null || !wg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Eg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var vg = /^[-+]?[0-9]+e/;
function Tg(e, t) {
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
  else if (Bu.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), vg.test(r) ? r.replace("e", ".e") : r;
}
function _g(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Bu.isNegativeZero(e));
}
var ju = new yg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: xg,
  construct: Eg,
  predicate: _g,
  represent: Tg,
  defaultStyle: "lowercase"
}), Gu = $u.extend({
  implicit: [
    Lu,
    Uu,
    Mu,
    ju
  ]
}), zu = Gu, bg = Le, Hu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), qu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Sg(e) {
  return e === null ? !1 : Hu.exec(e) !== null || qu.exec(e) !== null;
}
function Ag(e) {
  var t, r, n, i, a, o, s, l = 0, d = null, c, u, p;
  if (t = Hu.exec(e), t === null && (t = qu.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (a = +t[4], o = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], u = +(t[11] || 0), d = (c * 60 + u) * 6e4, t[9] === "-" && (d = -d)), p = new Date(Date.UTC(r, n, i, a, o, s, l)), d && p.setTime(p.getTime() - d), p;
}
function Ig(e) {
  return e.toISOString();
}
var Xu = new bg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Sg,
  construct: Ag,
  instanceOf: Date,
  represent: Ig
}), Cg = Le;
function Rg(e) {
  return e === "<<" || e === null;
}
var Wu = new Cg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Rg
}), Dg = Le, Ro = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Og(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, a = Ro;
  for (r = 0; r < i; r++)
    if (t = a.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Pg(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, a = Ro, o = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)), o = o << 6 | a.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)) : r === 18 ? (s.push(o >> 10 & 255), s.push(o >> 2 & 255)) : r === 12 && s.push(o >> 4 & 255), new Uint8Array(s);
}
function kg(e) {
  var t = "", r = 0, n, i, a = e.length, o = Ro;
  for (n = 0; n < a; n++)
    n % 3 === 0 && n && (t += o[r >> 18 & 63], t += o[r >> 12 & 63], t += o[r >> 6 & 63], t += o[r & 63]), r = (r << 8) + e[n];
  return i = a % 3, i === 0 ? (t += o[r >> 18 & 63], t += o[r >> 12 & 63], t += o[r >> 6 & 63], t += o[r & 63]) : i === 2 ? (t += o[r >> 10 & 63], t += o[r >> 4 & 63], t += o[r << 2 & 63], t += o[64]) : i === 1 && (t += o[r >> 2 & 63], t += o[r << 4 & 63], t += o[64], t += o[64]), t;
}
function Ng(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Vu = new Dg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Og,
  construct: Pg,
  predicate: Ng,
  represent: kg
}), Fg = Le, $g = Object.prototype.hasOwnProperty, Lg = Object.prototype.toString;
function Ug(e) {
  if (e === null) return !0;
  var t = [], r, n, i, a, o, s = e;
  for (r = 0, n = s.length; r < n; r += 1) {
    if (i = s[r], o = !1, Lg.call(i) !== "[object Object]") return !1;
    for (a in i)
      if ($g.call(i, a))
        if (!o) o = !0;
        else return !1;
    if (!o) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function Mg(e) {
  return e !== null ? e : [];
}
var Yu = new Fg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Ug,
  construct: Mg
}), Bg = Le, jg = Object.prototype.toString;
function Gg(e) {
  if (e === null) return !0;
  var t, r, n, i, a, o = e;
  for (a = new Array(o.length), t = 0, r = o.length; t < r; t += 1) {
    if (n = o[t], jg.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    a[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function zg(e) {
  if (e === null) return [];
  var t, r, n, i, a, o = e;
  for (a = new Array(o.length), t = 0, r = o.length; t < r; t += 1)
    n = o[t], i = Object.keys(n), a[t] = [i[0], n[i[0]]];
  return a;
}
var Ku = new Bg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Gg,
  construct: zg
}), Hg = Le, qg = Object.prototype.hasOwnProperty;
function Xg(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (qg.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Wg(e) {
  return e !== null ? e : {};
}
var Ju = new Hg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Xg,
  construct: Wg
}), Do = zu.extend({
  implicit: [
    Xu,
    Wu
  ],
  explicit: [
    Vu,
    Yu,
    Ku,
    Ju
  ]
}), qt = Je, Qu = mn, Vg = q0, Yg = Do, Rt = Object.prototype.hasOwnProperty, gi = 1, Zu = 2, ef = 3, yi = 4, xa = 1, Kg = 2, Qs = 3, Jg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Qg = /[\x85\u2028\u2029]/, Zg = /[,\[\]\{\}]/, tf = /^(?:!|!!|![a-z\-]+!)$/i, rf = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Zs(e) {
  return Object.prototype.toString.call(e);
}
function ot(e) {
  return e === 10 || e === 13;
}
function Yt(e) {
  return e === 9 || e === 32;
}
function Be(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function pr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function ey(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function ty(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function ry(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function el(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function ny(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function nf(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var af = new Array(256), of = new Array(256);
for (var or = 0; or < 256; or++)
  af[or] = el(or) ? 1 : 0, of[or] = el(or);
function iy(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Yg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function sf(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Vg(r), new Qu(t, r);
}
function B(e, t) {
  throw sf(e, t);
}
function wi(e, t) {
  e.onWarning && e.onWarning.call(null, sf(e, t));
}
var tl = {
  YAML: function(t, r, n) {
    var i, a, o;
    t.version !== null && B(t, "duplication of %YAML directive"), n.length !== 1 && B(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && B(t, "ill-formed argument of the YAML directive"), a = parseInt(i[1], 10), o = parseInt(i[2], 10), a !== 1 && B(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = o < 2, o !== 1 && o !== 2 && wi(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, a;
    n.length !== 2 && B(t, "TAG directive accepts exactly two arguments"), i = n[0], a = n[1], tf.test(i) || B(t, "ill-formed tag handle (first argument) of the TAG directive"), Rt.call(t.tagMap, i) && B(t, 'there is a previously declared suffix for "' + i + '" tag handle'), rf.test(a) || B(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      a = decodeURIComponent(a);
    } catch {
      B(t, "tag prefix is malformed: " + a);
    }
    t.tagMap[i] = a;
  }
};
function St(e, t, r, n) {
  var i, a, o, s;
  if (t < r) {
    if (s = e.input.slice(t, r), n)
      for (i = 0, a = s.length; i < a; i += 1)
        o = s.charCodeAt(i), o === 9 || 32 <= o && o <= 1114111 || B(e, "expected valid JSON character");
    else Jg.test(s) && B(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function rl(e, t, r, n) {
  var i, a, o, s;
  for (qt.isObject(r) || B(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), o = 0, s = i.length; o < s; o += 1)
    a = i[o], Rt.call(t, a) || (nf(t, a, r[a]), n[a] = !0);
}
function hr(e, t, r, n, i, a, o, s, l) {
  var d, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), d = 0, c = i.length; d < c; d += 1)
      Array.isArray(i[d]) && B(e, "nested arrays are not supported inside keys"), typeof i == "object" && Zs(i[d]) === "[object Object]" && (i[d] = "[object Object]");
  if (typeof i == "object" && Zs(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(a))
      for (d = 0, c = a.length; d < c; d += 1)
        rl(e, t, a[d], r);
    else
      rl(e, t, a, r);
  else
    !e.json && !Rt.call(r, i) && Rt.call(t, i) && (e.line = o || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, B(e, "duplicated mapping key")), nf(t, i, a), delete r[i];
  return t;
}
function Oo(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : B(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function pe(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Yt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (ot(i))
      for (Oo(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && wi(e, "deficient indentation"), n;
}
function ki(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Be(r)));
}
function Po(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += qt.repeat(`
`, t - 1));
}
function ay(e, t, r) {
  var n, i, a, o, s, l, d, c, u = e.kind, p = e.result, g;
  if (g = e.input.charCodeAt(e.position), Be(g) || pr(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), Be(i) || r && pr(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", a = o = e.position, s = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Be(i) || r && pr(i))
        break;
    } else if (g === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Be(n))
        break;
    } else {
      if (e.position === e.lineStart && ki(e) || r && pr(g))
        break;
      if (ot(g))
        if (l = e.line, d = e.lineStart, c = e.lineIndent, pe(e, !1, -1), e.lineIndent >= t) {
          s = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = o, e.line = l, e.lineStart = d, e.lineIndent = c;
          break;
        }
    }
    s && (St(e, a, o, !1), Po(e, e.line - l), a = o = e.position, s = !1), Yt(g) || (o = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return St(e, a, o, !1), e.result ? !0 : (e.kind = u, e.result = p, !1);
}
function oy(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (St(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else ot(r) ? (St(e, n, i, !0), Po(e, pe(e, !1, t)), n = i = e.position) : e.position === e.lineStart && ki(e) ? B(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  B(e, "unexpected end of the stream within a single quoted scalar");
}
function sy(e, t) {
  var r, n, i, a, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return St(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (St(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), ot(s))
        pe(e, !1, t);
      else if (s < 256 && af[s])
        e.result += of[s], e.position++;
      else if ((o = ty(s)) > 0) {
        for (i = o, a = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (o = ey(s)) >= 0 ? a = (a << 4) + o : B(e, "expected hexadecimal character");
        e.result += ny(a), e.position++;
      } else
        B(e, "unknown escape sequence");
      r = n = e.position;
    } else ot(s) ? (St(e, r, n, !0), Po(e, pe(e, !1, t)), r = n = e.position) : e.position === e.lineStart && ki(e) ? B(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  B(e, "unexpected end of the stream within a double quoted scalar");
}
function ly(e, t) {
  var r = !0, n, i, a, o = e.tag, s, l = e.anchor, d, c, u, p, g, x = /* @__PURE__ */ Object.create(null), w, T, b, _;
  if (_ = e.input.charCodeAt(e.position), _ === 91)
    c = 93, g = !1, s = [];
  else if (_ === 123)
    c = 125, g = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), _ = e.input.charCodeAt(++e.position); _ !== 0; ) {
    if (pe(e, !0, t), _ = e.input.charCodeAt(e.position), _ === c)
      return e.position++, e.tag = o, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = s, !0;
    r ? _ === 44 && B(e, "expected the node content, but found ','") : B(e, "missed comma between flow collection entries"), T = w = b = null, u = p = !1, _ === 63 && (d = e.input.charCodeAt(e.position + 1), Be(d) && (u = p = !0, e.position++, pe(e, !0, t))), n = e.line, i = e.lineStart, a = e.position, br(e, t, gi, !1, !0), T = e.tag, w = e.result, pe(e, !0, t), _ = e.input.charCodeAt(e.position), (p || e.line === n) && _ === 58 && (u = !0, _ = e.input.charCodeAt(++e.position), pe(e, !0, t), br(e, t, gi, !1, !0), b = e.result), g ? hr(e, s, x, T, w, b, n, i, a) : u ? s.push(hr(e, null, x, T, w, b, n, i, a)) : s.push(w), pe(e, !0, t), _ = e.input.charCodeAt(e.position), _ === 44 ? (r = !0, _ = e.input.charCodeAt(++e.position)) : r = !1;
  }
  B(e, "unexpected end of the stream within a flow collection");
}
function cy(e, t) {
  var r, n, i = xa, a = !1, o = !1, s = t, l = 0, d = !1, c, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    n = !1;
  else if (u === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      xa === i ? i = u === 43 ? Qs : Kg : B(e, "repeat of a chomping mode identifier");
    else if ((c = ry(u)) >= 0)
      c === 0 ? B(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? B(e, "repeat of an indentation width identifier") : (s = t + c - 1, o = !0);
    else
      break;
  if (Yt(u)) {
    do
      u = e.input.charCodeAt(++e.position);
    while (Yt(u));
    if (u === 35)
      do
        u = e.input.charCodeAt(++e.position);
      while (!ot(u) && u !== 0);
  }
  for (; u !== 0; ) {
    for (Oo(e), e.lineIndent = 0, u = e.input.charCodeAt(e.position); (!o || e.lineIndent < s) && u === 32; )
      e.lineIndent++, u = e.input.charCodeAt(++e.position);
    if (!o && e.lineIndent > s && (s = e.lineIndent), ot(u)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === Qs ? e.result += qt.repeat(`
`, a ? 1 + l : l) : i === xa && a && (e.result += `
`);
      break;
    }
    for (n ? Yt(u) ? (d = !0, e.result += qt.repeat(`
`, a ? 1 + l : l)) : d ? (d = !1, e.result += qt.repeat(`
`, l + 1)) : l === 0 ? a && (e.result += " ") : e.result += qt.repeat(`
`, l) : e.result += qt.repeat(`
`, a ? 1 + l : l), a = !0, o = !0, l = 0, r = e.position; !ot(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    St(e, r, e.position, !1);
  }
  return !0;
}
function nl(e, t) {
  var r, n = e.tag, i = e.anchor, a = [], o, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, B(e, "tab characters must not be used in indentation")), !(l !== 45 || (o = e.input.charCodeAt(e.position + 1), !Be(o)))); ) {
    if (s = !0, e.position++, pe(e, !0, -1) && e.lineIndent <= t) {
      a.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, br(e, t, ef, !1, !0), a.push(e.result), pe(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      B(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function uy(e, t, r) {
  var n, i, a, o, s, l, d = e.tag, c = e.anchor, u = {}, p = /* @__PURE__ */ Object.create(null), g = null, x = null, w = null, T = !1, b = !1, _;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), _ = e.input.charCodeAt(e.position); _ !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, B(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), a = e.line, (_ === 63 || _ === 58) && Be(n))
      _ === 63 ? (T && (hr(e, u, p, g, x, null, o, s, l), g = x = w = null), b = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : B(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, _ = n;
    else {
      if (o = e.line, s = e.lineStart, l = e.position, !br(e, r, Zu, !1, !0))
        break;
      if (e.line === a) {
        for (_ = e.input.charCodeAt(e.position); Yt(_); )
          _ = e.input.charCodeAt(++e.position);
        if (_ === 58)
          _ = e.input.charCodeAt(++e.position), Be(_) || B(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (hr(e, u, p, g, x, null, o, s, l), g = x = w = null), b = !0, T = !1, i = !1, g = e.tag, x = e.result;
        else if (b)
          B(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = d, e.anchor = c, !0;
      } else if (b)
        B(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = d, e.anchor = c, !0;
    }
    if ((e.line === a || e.lineIndent > t) && (T && (o = e.line, s = e.lineStart, l = e.position), br(e, t, yi, !0, i) && (T ? x = e.result : w = e.result), T || (hr(e, u, p, g, x, w, o, s, l), g = x = w = null), pe(e, !0, -1), _ = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && _ !== 0)
      B(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && hr(e, u, p, g, x, null, o, s, l), b && (e.tag = d, e.anchor = c, e.kind = "mapping", e.result = u), b;
}
function fy(e) {
  var t, r = !1, n = !1, i, a, o;
  if (o = e.input.charCodeAt(e.position), o !== 33) return !1;
  if (e.tag !== null && B(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (r = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (n = !0, i = "!!", o = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      o = e.input.charCodeAt(++e.position);
    while (o !== 0 && o !== 62);
    e.position < e.length ? (a = e.input.slice(t, e.position), o = e.input.charCodeAt(++e.position)) : B(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; o !== 0 && !Be(o); )
      o === 33 && (n ? B(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), tf.test(i) || B(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), o = e.input.charCodeAt(++e.position);
    a = e.input.slice(t, e.position), Zg.test(a) && B(e, "tag suffix cannot contain flow indicator characters");
  }
  a && !rf.test(a) && B(e, "tag name cannot contain such characters: " + a);
  try {
    a = decodeURIComponent(a);
  } catch {
    B(e, "tag name is malformed: " + a);
  }
  return r ? e.tag = a : Rt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : B(e, 'undeclared tag handle "' + i + '"'), !0;
}
function dy(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && B(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Be(r) && !pr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && B(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function py(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Be(n) && !pr(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && B(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), Rt.call(e.anchorMap, r) || B(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], pe(e, !0, -1), !0;
}
function br(e, t, r, n, i) {
  var a, o, s, l = 1, d = !1, c = !1, u, p, g, x, w, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = o = s = yi === r || ef === r, n && pe(e, !0, -1) && (d = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; fy(e) || dy(e); )
      pe(e, !0, -1) ? (d = !0, s = a, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = d || i), (l === 1 || yi === r) && (gi === r || Zu === r ? w = t : w = t + 1, T = e.position - e.lineStart, l === 1 ? s && (nl(e, T) || uy(e, T, w)) || ly(e, w) ? c = !0 : (o && cy(e, w) || oy(e, w) || sy(e, w) ? c = !0 : py(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && B(e, "alias node should not have any properties")) : ay(e, w, gi === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && nl(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && B(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, p = e.implicitTypes.length; u < p; u += 1)
      if (x = e.implicitTypes[u], x.resolve(e.result)) {
        e.result = x.construct(e.result), e.tag = x.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Rt.call(e.typeMap[e.kind || "fallback"], e.tag))
      x = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (x = null, g = e.typeMap.multi[e.kind || "fallback"], u = 0, p = g.length; u < p; u += 1)
        if (e.tag.slice(0, g[u].tag.length) === g[u].tag) {
          x = g[u];
          break;
        }
    x || B(e, "unknown tag !<" + e.tag + ">"), e.result !== null && x.kind !== e.kind && B(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + x.kind + '", not "' + e.kind + '"'), x.resolve(e.result, e.tag) ? (e.result = x.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : B(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function hy(e) {
  var t = e.position, r, n, i, a = !1, o;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (o = e.input.charCodeAt(e.position)) !== 0 && (pe(e, !0, -1), o = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || o !== 37)); ) {
    for (a = !0, o = e.input.charCodeAt(++e.position), r = e.position; o !== 0 && !Be(o); )
      o = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && B(e, "directive name must not be less than one character in length"); o !== 0; ) {
      for (; Yt(o); )
        o = e.input.charCodeAt(++e.position);
      if (o === 35) {
        do
          o = e.input.charCodeAt(++e.position);
        while (o !== 0 && !ot(o));
        break;
      }
      if (ot(o)) break;
      for (r = e.position; o !== 0 && !Be(o); )
        o = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    o !== 0 && Oo(e), Rt.call(tl, n) ? tl[n](e, n, i) : wi(e, 'unknown document directive "' + n + '"');
  }
  if (pe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, pe(e, !0, -1)) : a && B(e, "directives end mark is expected"), br(e, e.lineIndent - 1, yi, !1, !0), pe(e, !0, -1), e.checkLineBreaks && Qg.test(e.input.slice(t, e.position)) && wi(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ki(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, pe(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    B(e, "end of the stream or a document separator is expected");
  else
    return;
}
function lf(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new iy(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, B(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    hy(r);
  return r.documents;
}
function my(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = lf(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, a = n.length; i < a; i += 1)
    t(n[i]);
}
function gy(e, t) {
  var r = lf(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new Qu("expected a single document in the stream, but found more");
  }
}
Co.loadAll = my;
Co.load = gy;
var cf = {}, Ni = Je, gn = mn, yy = Do, uf = Object.prototype.toString, ff = Object.prototype.hasOwnProperty, ko = 65279, wy = 9, en = 10, xy = 13, Ey = 32, vy = 33, Ty = 34, Ka = 35, _y = 37, by = 38, Sy = 39, Ay = 42, df = 44, Iy = 45, xi = 58, Cy = 61, Ry = 62, Dy = 63, Oy = 64, pf = 91, hf = 93, Py = 96, mf = 123, ky = 124, gf = 125, Re = {};
Re[0] = "\\0";
Re[7] = "\\a";
Re[8] = "\\b";
Re[9] = "\\t";
Re[10] = "\\n";
Re[11] = "\\v";
Re[12] = "\\f";
Re[13] = "\\r";
Re[27] = "\\e";
Re[34] = '\\"';
Re[92] = "\\\\";
Re[133] = "\\N";
Re[160] = "\\_";
Re[8232] = "\\L";
Re[8233] = "\\P";
var Ny = [
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
], Fy = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function $y(e, t) {
  var r, n, i, a, o, s, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, a = n.length; i < a; i += 1)
    o = n[i], s = String(t[o]), o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2)), l = e.compiledTypeMap.fallback[o], l && ff.call(l.styleAliases, s) && (s = l.styleAliases[s]), r[o] = s;
  return r;
}
function Ly(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new gn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + Ni.repeat("0", n - t.length) + t;
}
var Uy = 1, tn = 2;
function My(e) {
  this.schema = e.schema || yy, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Ni.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = $y(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? tn : Uy, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function il(e, t) {
  for (var r = Ni.repeat(" ", t), n = 0, i = -1, a = "", o, s = e.length; n < s; )
    i = e.indexOf(`
`, n), i === -1 ? (o = e.slice(n), n = s) : (o = e.slice(n, i + 1), n = i + 1), o.length && o !== `
` && (a += r), a += o;
  return a;
}
function Ja(e, t) {
  return `
` + Ni.repeat(" ", e.indent * t);
}
function By(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Ei(e) {
  return e === Ey || e === wy;
}
function rn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== ko || 65536 <= e && e <= 1114111;
}
function al(e) {
  return rn(e) && e !== ko && e !== xy && e !== en;
}
function ol(e, t, r) {
  var n = al(e), i = n && !Ei(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== df && e !== pf && e !== hf && e !== mf && e !== gf) && e !== Ka && !(t === xi && !i) || al(t) && !Ei(t) && e === Ka || t === xi && i
  );
}
function jy(e) {
  return rn(e) && e !== ko && !Ei(e) && e !== Iy && e !== Dy && e !== xi && e !== df && e !== pf && e !== hf && e !== mf && e !== gf && e !== Ka && e !== by && e !== Ay && e !== vy && e !== ky && e !== Cy && e !== Ry && e !== Sy && e !== Ty && e !== _y && e !== Oy && e !== Py;
}
function Gy(e) {
  return !Ei(e) && e !== xi;
}
function Gr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function yf(e) {
  var t = /^\n* /;
  return t.test(e);
}
var wf = 1, Qa = 2, xf = 3, Ef = 4, dr = 5;
function zy(e, t, r, n, i, a, o, s) {
  var l, d = 0, c = null, u = !1, p = !1, g = n !== -1, x = -1, w = jy(Gr(e, 0)) && Gy(Gr(e, e.length - 1));
  if (t || o)
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = Gr(e, l), !rn(d))
        return dr;
      w = w && ol(d, c, s), c = d;
    }
  else {
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = Gr(e, l), d === en)
        u = !0, g && (p = p || // Foldable line = too long, and not more-indented.
        l - x - 1 > n && e[x + 1] !== " ", x = l);
      else if (!rn(d))
        return dr;
      w = w && ol(d, c, s), c = d;
    }
    p = p || g && l - x - 1 > n && e[x + 1] !== " ";
  }
  return !u && !p ? w && !o && !i(e) ? wf : a === tn ? dr : Qa : r > 9 && yf(e) ? dr : o ? a === tn ? dr : Qa : p ? Ef : xf;
}
function Hy(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === tn ? '""' : "''";
    if (!e.noCompatMode && (Ny.indexOf(t) !== -1 || Fy.test(t)))
      return e.quotingType === tn ? '"' + t + '"' : "'" + t + "'";
    var a = e.indent * Math.max(1, r), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), s = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(d) {
      return By(e, d);
    }
    switch (zy(
      t,
      s,
      e.indent,
      o,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case wf:
        return t;
      case Qa:
        return "'" + t.replace(/'/g, "''") + "'";
      case xf:
        return "|" + sl(t, e.indent) + ll(il(t, a));
      case Ef:
        return ">" + sl(t, e.indent) + ll(il(qy(t, o), a));
      case dr:
        return '"' + Xy(t) + '"';
      default:
        throw new gn("impossible error: invalid scalar style");
    }
  }();
}
function sl(e, t) {
  var r = yf(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), a = i ? "+" : n ? "" : "-";
  return r + a + `
`;
}
function ll(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function qy(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var d = e.indexOf(`
`);
    return d = d !== -1 ? d : e.length, r.lastIndex = d, cl(e.slice(0, d), t);
  }(), i = e[0] === `
` || e[0] === " ", a, o; o = r.exec(e); ) {
    var s = o[1], l = o[2];
    a = l[0] === " ", n += s + (!i && !a && l !== "" ? `
` : "") + cl(l, t), i = a;
  }
  return n;
}
function cl(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, a, o = 0, s = 0, l = ""; n = r.exec(e); )
    s = n.index, s - i > t && (a = o > i ? o : s, l += `
` + e.slice(i, a), i = a + 1), o = s;
  return l += `
`, e.length - i > t && o > i ? l += e.slice(i, o) + `
` + e.slice(o + 1) : l += e.slice(i), l.slice(1);
}
function Xy(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Gr(e, i), n = Re[r], !n && rn(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || Ly(r);
  return t;
}
function Wy(e, t, r) {
  var n = "", i = e.tag, a, o, s;
  for (a = 0, o = r.length; a < o; a += 1)
    s = r[a], e.replacer && (s = e.replacer.call(r, String(a), s)), (pt(e, t, s, !1, !1) || typeof s > "u" && pt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function ul(e, t, r, n) {
  var i = "", a = e.tag, o, s, l;
  for (o = 0, s = r.length; o < s; o += 1)
    l = r[o], e.replacer && (l = e.replacer.call(r, String(o), l)), (pt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && pt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Ja(e, t)), e.dump && en === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = a, e.dump = i || "[]";
}
function Vy(e, t, r) {
  var n = "", i = e.tag, a = Object.keys(r), o, s, l, d, c;
  for (o = 0, s = a.length; o < s; o += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = a[o], d = r[l], e.replacer && (d = e.replacer.call(r, l, d)), pt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), pt(e, t, d, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function Yy(e, t, r, n) {
  var i = "", a = e.tag, o = Object.keys(r), s, l, d, c, u, p;
  if (e.sortKeys === !0)
    o.sort();
  else if (typeof e.sortKeys == "function")
    o.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new gn("sortKeys must be a boolean or a function");
  for (s = 0, l = o.length; s < l; s += 1)
    p = "", (!n || i !== "") && (p += Ja(e, t)), d = o[s], c = r[d], e.replacer && (c = e.replacer.call(r, d, c)), pt(e, t + 1, d, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && en === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, u && (p += Ja(e, t)), pt(e, t + 1, c, !0, u) && (e.dump && en === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p));
  e.tag = a, e.dump = i || "{}";
}
function fl(e, t, r) {
  var n, i, a, o, s, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, a = 0, o = i.length; a < o; a += 1)
    if (s = i[a], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (r ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, uf.call(s.represent) === "[object Function]")
          n = s.represent(t, l);
        else if (ff.call(s.represent, l))
          n = s.represent[l](t, l);
        else
          throw new gn("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function pt(e, t, r, n, i, a, o) {
  e.tag = null, e.dump = r, fl(e, r, !1) || fl(e, r, !0);
  var s = uf.call(e.dump), l = n, d;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", u, p;
  if (c && (u = e.duplicates.indexOf(r), p = u !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (i = !1), p && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (c && p && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), s === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (Yy(e, t, e.dump, i), p && (e.dump = "&ref_" + u + e.dump)) : (Vy(e, t, e.dump), p && (e.dump = "&ref_" + u + " " + e.dump));
    else if (s === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? ul(e, t - 1, e.dump, i) : ul(e, t, e.dump, i), p && (e.dump = "&ref_" + u + e.dump)) : (Wy(e, t, e.dump), p && (e.dump = "&ref_" + u + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && Hy(e, e.dump, t, a, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new gn("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (d = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? d = "!" + d : d.slice(0, 18) === "tag:yaml.org,2002:" ? d = "!!" + d.slice(18) : d = "!<" + d + ">", e.dump = d + " " + e.dump);
  }
  return !0;
}
function Ky(e, t) {
  var r = [], n = [], i, a;
  for (Za(e, r, n), i = 0, a = n.length; i < a; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(a);
}
function Za(e, t, r) {
  var n, i, a;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, a = e.length; i < a; i += 1)
        Za(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, a = n.length; i < a; i += 1)
        Za(e[n[i]], t, r);
}
function Jy(e, t) {
  t = t || {};
  var r = new My(t);
  r.noRefs || Ky(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), pt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
cf.dump = Jy;
var vf = Co, Qy = cf;
function No(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
be.Type = Le;
be.Schema = Pu;
be.FAILSAFE_SCHEMA = $u;
be.JSON_SCHEMA = Gu;
be.CORE_SCHEMA = zu;
be.DEFAULT_SCHEMA = Do;
be.load = vf.load;
be.loadAll = vf.loadAll;
be.dump = Qy.dump;
be.YAMLException = mn;
be.types = {
  binary: Vu,
  float: ju,
  map: Fu,
  null: Lu,
  pairs: Ku,
  set: Ju,
  timestamp: Xu,
  bool: Uu,
  int: Mu,
  merge: Wu,
  omap: Yu,
  seq: Nu,
  str: ku
};
be.safeLoad = No("safeLoad", "load");
be.safeLoadAll = No("safeLoadAll", "loadAll");
be.safeDump = No("safeDump", "dump");
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.Lazy = void 0;
class Zy {
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
Fi.Lazy = Zy;
var eo = { exports: {} };
const ew = "2.0.0", Tf = 256, tw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, rw = 16, nw = Tf - 6, iw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var $i = {
  MAX_LENGTH: Tf,
  MAX_SAFE_COMPONENT_LENGTH: rw,
  MAX_SAFE_BUILD_LENGTH: nw,
  MAX_SAFE_INTEGER: tw,
  RELEASE_TYPES: iw,
  SEMVER_SPEC_VERSION: ew,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const aw = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Li = aw;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = $i, a = Li;
  t = e.exports = {};
  const o = t.re = [], s = t.safeRe = [], l = t.src = [], d = t.safeSrc = [], c = t.t = {};
  let u = 0;
  const p = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [p, n]
  ], x = (T) => {
    for (const [b, _] of g)
      T = T.split(`${b}*`).join(`${b}{0,${_}}`).split(`${b}+`).join(`${b}{1,${_}}`);
    return T;
  }, w = (T, b, _) => {
    const F = x(b), D = u++;
    a(T, D, b), c[T] = D, l[D] = b, d[D] = F, o[D] = new RegExp(b, _ ? "g" : void 0), s[D] = new RegExp(F, _ ? "g" : void 0);
  };
  w("NUMERICIDENTIFIER", "0|[1-9]\\d*"), w("NUMERICIDENTIFIERLOOSE", "\\d+"), w("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${p}*`), w("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), w("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), w("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), w("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), w("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), w("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), w("BUILDIDENTIFIER", `${p}+`), w("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), w("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), w("FULL", `^${l[c.FULLPLAIN]}$`), w("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), w("LOOSE", `^${l[c.LOOSEPLAIN]}$`), w("GTLT", "((?:<|>)?=?)"), w("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), w("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), w("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), w("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), w("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), w("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), w("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), w("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), w("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), w("COERCERTL", l[c.COERCE], !0), w("COERCERTLFULL", l[c.COERCEFULL], !0), w("LONETILDE", "(?:~>?)"), w("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", w("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), w("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), w("LONECARET", "(?:\\^)"), w("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", w("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), w("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), w("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), w("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), w("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", w("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), w("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), w("STAR", "(<|>)?=?\\s*\\*"), w("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), w("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(eo, eo.exports);
var yn = eo.exports;
const ow = Object.freeze({ loose: !0 }), sw = Object.freeze({}), lw = (e) => e ? typeof e != "object" ? ow : e : sw;
var Fo = lw;
const dl = /^[0-9]+$/, _f = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = dl.test(e), n = dl.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, cw = (e, t) => _f(t, e);
var bf = {
  compareIdentifiers: _f,
  rcompareIdentifiers: cw
};
const jn = Li, { MAX_LENGTH: pl, MAX_SAFE_INTEGER: Gn } = $i, { safeRe: zn, t: Hn } = yn, uw = Fo, { compareIdentifiers: Ea } = bf;
let fw = class at {
  constructor(t, r) {
    if (r = uw(r), t instanceof at) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > pl)
      throw new TypeError(
        `version is longer than ${pl} characters`
      );
    jn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? zn[Hn.LOOSE] : zn[Hn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Gn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Gn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Gn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const a = +i;
        if (a >= 0 && a < Gn)
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
    if (jn("SemVer.compare", this.version, this.options, t), !(t instanceof at)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new at(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof at || (t = new at(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof at || (t = new at(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (jn("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Ea(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof at || (t = new at(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (jn("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Ea(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? zn[Hn.PRERELEASELOOSE] : zn[Hn.PRERELEASE]);
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
          n === !1 && (a = [r]), Ea(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ue = fw;
const hl = Ue, dw = (e, t, r = !1) => {
  if (e instanceof hl)
    return e;
  try {
    return new hl(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Rr = dw;
const pw = Rr, hw = (e, t) => {
  const r = pw(e, t);
  return r ? r.version : null;
};
var mw = hw;
const gw = Rr, yw = (e, t) => {
  const r = gw(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var ww = yw;
const ml = Ue, xw = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new ml(
      e instanceof ml ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var Ew = xw;
const gl = Rr, vw = (e, t) => {
  const r = gl(e, null, !0), n = gl(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const a = i > 0, o = a ? r : n, s = a ? n : r, l = !!o.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(o) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return r.major !== n.major ? c + "major" : r.minor !== n.minor ? c + "minor" : r.patch !== n.patch ? c + "patch" : "prerelease";
};
var Tw = vw;
const _w = Ue, bw = (e, t) => new _w(e, t).major;
var Sw = bw;
const Aw = Ue, Iw = (e, t) => new Aw(e, t).minor;
var Cw = Iw;
const Rw = Ue, Dw = (e, t) => new Rw(e, t).patch;
var Ow = Dw;
const Pw = Rr, kw = (e, t) => {
  const r = Pw(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Nw = kw;
const yl = Ue, Fw = (e, t, r) => new yl(e, r).compare(new yl(t, r));
var Qe = Fw;
const $w = Qe, Lw = (e, t, r) => $w(t, e, r);
var Uw = Lw;
const Mw = Qe, Bw = (e, t) => Mw(e, t, !0);
var jw = Bw;
const wl = Ue, Gw = (e, t, r) => {
  const n = new wl(e, r), i = new wl(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var $o = Gw;
const zw = $o, Hw = (e, t) => e.sort((r, n) => zw(r, n, t));
var qw = Hw;
const Xw = $o, Ww = (e, t) => e.sort((r, n) => Xw(n, r, t));
var Vw = Ww;
const Yw = Qe, Kw = (e, t, r) => Yw(e, t, r) > 0;
var Ui = Kw;
const Jw = Qe, Qw = (e, t, r) => Jw(e, t, r) < 0;
var Lo = Qw;
const Zw = Qe, ex = (e, t, r) => Zw(e, t, r) === 0;
var Sf = ex;
const tx = Qe, rx = (e, t, r) => tx(e, t, r) !== 0;
var Af = rx;
const nx = Qe, ix = (e, t, r) => nx(e, t, r) >= 0;
var Uo = ix;
const ax = Qe, ox = (e, t, r) => ax(e, t, r) <= 0;
var Mo = ox;
const sx = Sf, lx = Af, cx = Ui, ux = Uo, fx = Lo, dx = Mo, px = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return sx(e, r, n);
    case "!=":
      return lx(e, r, n);
    case ">":
      return cx(e, r, n);
    case ">=":
      return ux(e, r, n);
    case "<":
      return fx(e, r, n);
    case "<=":
      return dx(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var If = px;
const hx = Ue, mx = Rr, { safeRe: qn, t: Xn } = yn, gx = (e, t) => {
  if (e instanceof hx)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? qn[Xn.COERCEFULL] : qn[Xn.COERCE]);
  else {
    const l = t.includePrerelease ? qn[Xn.COERCERTLFULL] : qn[Xn.COERCERTL];
    let d;
    for (; (d = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), l.lastIndex = d.index + d[1].length + d[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", s = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return mx(`${n}.${i}.${a}${o}${s}`, t);
};
var yx = gx;
class wx {
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
var xx = wx, va, xl;
function Ze() {
  if (xl) return va;
  xl = 1;
  const e = /\s+/g;
  class t {
    constructor(I, P) {
      if (P = i(P), I instanceof t)
        return I.loose === !!P.loose && I.includePrerelease === !!P.includePrerelease ? I : new t(I.raw, P);
      if (I instanceof a)
        return this.raw = I.value, this.set = [[I]], this.formatted = void 0, this;
      if (this.options = P, this.loose = !!P.loose, this.includePrerelease = !!P.includePrerelease, this.raw = I.trim().replace(e, " "), this.set = this.raw.split("||").map((S) => this.parseRange(S.trim())).filter((S) => S.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const S = this.set[0];
        if (this.set = this.set.filter(($) => !w($[0])), this.set.length === 0)
          this.set = [S];
        else if (this.set.length > 1) {
          for (const $ of this.set)
            if ($.length === 1 && T($[0])) {
              this.set = [$];
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
          const P = this.set[I];
          for (let S = 0; S < P.length; S++)
            S > 0 && (this.formatted += " "), this.formatted += P[S].toString().trim();
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
      const S = ((this.options.includePrerelease && g) | (this.options.loose && x)) + ":" + I, $ = n.get(S);
      if ($)
        return $;
      const O = this.options.loose, z = O ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      I = I.replace(z, M(this.options.includePrerelease)), o("hyphen replace", I), I = I.replace(l[d.COMPARATORTRIM], c), o("comparator trim", I), I = I.replace(l[d.TILDETRIM], u), o("tilde trim", I), I = I.replace(l[d.CARETTRIM], p), o("caret trim", I);
      let Y = I.split(" ").map((G) => _(G, this.options)).join(" ").split(/\s+/).map((G) => U(G, this.options));
      O && (Y = Y.filter((G) => (o("loose invalid filter", G, this.options), !!G.match(l[d.COMPARATORLOOSE])))), o("range list", Y);
      const X = /* @__PURE__ */ new Map(), re = Y.map((G) => new a(G, this.options));
      for (const G of re) {
        if (w(G))
          return [G];
        X.set(G.value, G);
      }
      X.size > 1 && X.has("") && X.delete("");
      const ge = [...X.values()];
      return n.set(S, ge), ge;
    }
    intersects(I, P) {
      if (!(I instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((S) => b(S, P) && I.set.some(($) => b($, P) && S.every((O) => $.every((z) => O.intersects(z, P)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(I) {
      if (!I)
        return !1;
      if (typeof I == "string")
        try {
          I = new s(I, this.options);
        } catch {
          return !1;
        }
      for (let P = 0; P < this.set.length; P++)
        if (J(this.set[P], I, this.options))
          return !0;
      return !1;
    }
  }
  va = t;
  const r = xx, n = new r(), i = Fo, a = Mi(), o = Li, s = Ue, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: c,
    tildeTrimReplace: u,
    caretTrimReplace: p
  } = yn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: x } = $i, w = (R) => R.value === "<0.0.0-0", T = (R) => R.value === "", b = (R, I) => {
    let P = !0;
    const S = R.slice();
    let $ = S.pop();
    for (; P && S.length; )
      P = S.every((O) => $.intersects(O, I)), $ = S.pop();
    return P;
  }, _ = (R, I) => (R = R.replace(l[d.BUILD], ""), o("comp", R, I), R = H(R, I), o("caret", R), R = D(R, I), o("tildes", R), R = te(R, I), o("xrange", R), R = j(R, I), o("stars", R), R), F = (R) => !R || R.toLowerCase() === "x" || R === "*", D = (R, I) => R.trim().split(/\s+/).map((P) => k(P, I)).join(" "), k = (R, I) => {
    const P = I.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return R.replace(P, (S, $, O, z, Y) => {
      o("tilde", R, S, $, O, z, Y);
      let X;
      return F($) ? X = "" : F(O) ? X = `>=${$}.0.0 <${+$ + 1}.0.0-0` : F(z) ? X = `>=${$}.${O}.0 <${$}.${+O + 1}.0-0` : Y ? (o("replaceTilde pr", Y), X = `>=${$}.${O}.${z}-${Y} <${$}.${+O + 1}.0-0`) : X = `>=${$}.${O}.${z} <${$}.${+O + 1}.0-0`, o("tilde return", X), X;
    });
  }, H = (R, I) => R.trim().split(/\s+/).map((P) => q(P, I)).join(" "), q = (R, I) => {
    o("caret", R, I);
    const P = I.loose ? l[d.CARETLOOSE] : l[d.CARET], S = I.includePrerelease ? "-0" : "";
    return R.replace(P, ($, O, z, Y, X) => {
      o("caret", R, $, O, z, Y, X);
      let re;
      return F(O) ? re = "" : F(z) ? re = `>=${O}.0.0${S} <${+O + 1}.0.0-0` : F(Y) ? O === "0" ? re = `>=${O}.${z}.0${S} <${O}.${+z + 1}.0-0` : re = `>=${O}.${z}.0${S} <${+O + 1}.0.0-0` : X ? (o("replaceCaret pr", X), O === "0" ? z === "0" ? re = `>=${O}.${z}.${Y}-${X} <${O}.${z}.${+Y + 1}-0` : re = `>=${O}.${z}.${Y}-${X} <${O}.${+z + 1}.0-0` : re = `>=${O}.${z}.${Y}-${X} <${+O + 1}.0.0-0`) : (o("no pr"), O === "0" ? z === "0" ? re = `>=${O}.${z}.${Y}${S} <${O}.${z}.${+Y + 1}-0` : re = `>=${O}.${z}.${Y}${S} <${O}.${+z + 1}.0-0` : re = `>=${O}.${z}.${Y} <${+O + 1}.0.0-0`), o("caret return", re), re;
    });
  }, te = (R, I) => (o("replaceXRanges", R, I), R.split(/\s+/).map((P) => y(P, I)).join(" ")), y = (R, I) => {
    R = R.trim();
    const P = I.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return R.replace(P, (S, $, O, z, Y, X) => {
      o("xRange", R, S, $, O, z, Y, X);
      const re = F(O), ge = re || F(z), G = ge || F(Y), et = G;
      return $ === "=" && et && ($ = ""), X = I.includePrerelease ? "-0" : "", re ? $ === ">" || $ === "<" ? S = "<0.0.0-0" : S = "*" : $ && et ? (ge && (z = 0), Y = 0, $ === ">" ? ($ = ">=", ge ? (O = +O + 1, z = 0, Y = 0) : (z = +z + 1, Y = 0)) : $ === "<=" && ($ = "<", ge ? O = +O + 1 : z = +z + 1), $ === "<" && (X = "-0"), S = `${$ + O}.${z}.${Y}${X}`) : ge ? S = `>=${O}.0.0${X} <${+O + 1}.0.0-0` : G && (S = `>=${O}.${z}.0${X} <${O}.${+z + 1}.0-0`), o("xRange return", S), S;
    });
  }, j = (R, I) => (o("replaceStars", R, I), R.trim().replace(l[d.STAR], "")), U = (R, I) => (o("replaceGTE0", R, I), R.trim().replace(l[I.includePrerelease ? d.GTE0PRE : d.GTE0], "")), M = (R) => (I, P, S, $, O, z, Y, X, re, ge, G, et) => (F(S) ? P = "" : F($) ? P = `>=${S}.0.0${R ? "-0" : ""}` : F(O) ? P = `>=${S}.${$}.0${R ? "-0" : ""}` : z ? P = `>=${P}` : P = `>=${P}${R ? "-0" : ""}`, F(re) ? X = "" : F(ge) ? X = `<${+re + 1}.0.0-0` : F(G) ? X = `<${re}.${+ge + 1}.0-0` : et ? X = `<=${re}.${ge}.${G}-${et}` : R ? X = `<${re}.${ge}.${+G + 1}-0` : X = `<=${X}`, `${P} ${X}`.trim()), J = (R, I, P) => {
    for (let S = 0; S < R.length; S++)
      if (!R[S].test(I))
        return !1;
    if (I.prerelease.length && !P.includePrerelease) {
      for (let S = 0; S < R.length; S++)
        if (o(R[S].semver), R[S].semver !== a.ANY && R[S].semver.prerelease.length > 0) {
          const $ = R[S].semver;
          if ($.major === I.major && $.minor === I.minor && $.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return va;
}
var Ta, El;
function Mi() {
  if (El) return Ta;
  El = 1;
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
      c = c.trim().split(/\s+/).join(" "), o("comparator", c, u), this.options = u, this.loose = !!u.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(c) {
      const u = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], p = c.match(u);
      if (!p)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = p[1] !== void 0 ? p[1] : "", this.operator === "=" && (this.operator = ""), p[2] ? this.semver = new s(p[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (o("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new s(c, this.options);
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
  Ta = t;
  const r = Fo, { safeRe: n, t: i } = yn, a = If, o = Li, s = Ue, l = Ze();
  return Ta;
}
const Ex = Ze(), vx = (e, t, r) => {
  try {
    t = new Ex(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Bi = vx;
const Tx = Ze(), _x = (e, t) => new Tx(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var bx = _x;
const Sx = Ue, Ax = Ze(), Ix = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new Ax(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || i.compare(o) === -1) && (n = o, i = new Sx(n, r));
  }), n;
};
var Cx = Ix;
const Rx = Ue, Dx = Ze(), Ox = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new Dx(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || i.compare(o) === 1) && (n = o, i = new Rx(n, r));
  }), n;
};
var Px = Ox;
const _a = Ue, kx = Ze(), vl = Ui, Nx = (e, t) => {
  e = new kx(e, t);
  let r = new _a("0.0.0");
  if (e.test(r) || (r = new _a("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let a = null;
    i.forEach((o) => {
      const s = new _a(o.semver.version);
      switch (o.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!a || vl(s, a)) && (a = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || vl(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var Fx = Nx;
const $x = Ze(), Lx = (e, t) => {
  try {
    return new $x(e, t).range || "*";
  } catch {
    return null;
  }
};
var Ux = Lx;
const Mx = Ue, Cf = Mi(), { ANY: Bx } = Cf, jx = Ze(), Gx = Bi, Tl = Ui, _l = Lo, zx = Mo, Hx = Uo, qx = (e, t, r, n) => {
  e = new Mx(e, n), t = new jx(t, n);
  let i, a, o, s, l;
  switch (r) {
    case ">":
      i = Tl, a = zx, o = _l, s = ">", l = ">=";
      break;
    case "<":
      i = _l, a = Hx, o = Tl, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Gx(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const c = t.set[d];
    let u = null, p = null;
    if (c.forEach((g) => {
      g.semver === Bx && (g = new Cf(">=0.0.0")), u = u || g, p = p || g, i(g.semver, u.semver, n) ? u = g : o(g.semver, p.semver, n) && (p = g);
    }), u.operator === s || u.operator === l || (!p.operator || p.operator === s) && a(e, p.semver))
      return !1;
    if (p.operator === l && o(e, p.semver))
      return !1;
  }
  return !0;
};
var Bo = qx;
const Xx = Bo, Wx = (e, t, r) => Xx(e, t, ">", r);
var Vx = Wx;
const Yx = Bo, Kx = (e, t, r) => Yx(e, t, "<", r);
var Jx = Kx;
const bl = Ze(), Qx = (e, t, r) => (e = new bl(e, r), t = new bl(t, r), e.intersects(t, r));
var Zx = Qx;
const eE = Bi, tE = Qe;
var rE = (e, t, r) => {
  const n = [];
  let i = null, a = null;
  const o = e.sort((c, u) => tE(c, u, r));
  for (const c of o)
    eE(c, t, r) ? (a = c, i || (i = c)) : (a && n.push([i, a]), a = null, i = null);
  i && n.push([i, null]);
  const s = [];
  for (const [c, u] of n)
    c === u ? s.push(c) : !u && c === o[0] ? s.push("*") : u ? c === o[0] ? s.push(`<=${u}`) : s.push(`${c} - ${u}`) : s.push(`>=${c}`);
  const l = s.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const Sl = Ze(), jo = Mi(), { ANY: ba } = jo, Ur = Bi, Go = Qe, nE = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Sl(e, r), t = new Sl(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const a of t.set) {
      const o = aE(i, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, iE = [new jo(">=0.0.0-0")], Al = [new jo(">=0.0.0")], aE = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === ba) {
    if (t.length === 1 && t[0].semver === ba)
      return !0;
    r.includePrerelease ? e = iE : e = Al;
  }
  if (t.length === 1 && t[0].semver === ba) {
    if (r.includePrerelease)
      return !0;
    t = Al;
  }
  const n = /* @__PURE__ */ new Set();
  let i, a;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = Il(i, g, r) : g.operator === "<" || g.operator === "<=" ? a = Cl(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let o;
  if (i && a) {
    if (o = Go(i.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (i.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (i && !Ur(g, String(i), r) || a && !Ur(g, String(a), r))
      return null;
    for (const x of t)
      if (!Ur(g, String(x), r))
        return !1;
    return !0;
  }
  let s, l, d, c, u = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, p = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && a.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const g of t) {
    if (c = c || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", i) {
      if (p && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === p.major && g.semver.minor === p.minor && g.semver.patch === p.patch && (p = !1), g.operator === ">" || g.operator === ">=") {
        if (s = Il(i, g, r), s === g && s !== i)
          return !1;
      } else if (i.operator === ">=" && !Ur(i.semver, String(g), r))
        return !1;
    }
    if (a) {
      if (u && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === u.major && g.semver.minor === u.minor && g.semver.patch === u.patch && (u = !1), g.operator === "<" || g.operator === "<=") {
        if (l = Cl(a, g, r), l === g && l !== a)
          return !1;
      } else if (a.operator === "<=" && !Ur(a.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (a || i) && o !== 0)
      return !1;
  }
  return !(i && d && !a && o !== 0 || a && c && !i && o !== 0 || p || u);
}, Il = (e, t, r) => {
  if (!e)
    return t;
  const n = Go(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Cl = (e, t, r) => {
  if (!e)
    return t;
  const n = Go(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var oE = nE;
const Sa = yn, Rl = $i, sE = Ue, Dl = bf, lE = Rr, cE = mw, uE = ww, fE = Ew, dE = Tw, pE = Sw, hE = Cw, mE = Ow, gE = Nw, yE = Qe, wE = Uw, xE = jw, EE = $o, vE = qw, TE = Vw, _E = Ui, bE = Lo, SE = Sf, AE = Af, IE = Uo, CE = Mo, RE = If, DE = yx, OE = Mi(), PE = Ze(), kE = Bi, NE = bx, FE = Cx, $E = Px, LE = Fx, UE = Ux, ME = Bo, BE = Vx, jE = Jx, GE = Zx, zE = rE, HE = oE;
var Rf = {
  parse: lE,
  valid: cE,
  clean: uE,
  inc: fE,
  diff: dE,
  major: pE,
  minor: hE,
  patch: mE,
  prerelease: gE,
  compare: yE,
  rcompare: wE,
  compareLoose: xE,
  compareBuild: EE,
  sort: vE,
  rsort: TE,
  gt: _E,
  lt: bE,
  eq: SE,
  neq: AE,
  gte: IE,
  lte: CE,
  cmp: RE,
  coerce: DE,
  Comparator: OE,
  Range: PE,
  satisfies: kE,
  toComparators: NE,
  maxSatisfying: FE,
  minSatisfying: $E,
  minVersion: LE,
  validRange: UE,
  outside: ME,
  gtr: BE,
  ltr: jE,
  intersects: GE,
  simplifyRange: zE,
  subset: HE,
  SemVer: sE,
  re: Sa.re,
  src: Sa.src,
  tokens: Sa.t,
  SEMVER_SPEC_VERSION: Rl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Rl.RELEASE_TYPES,
  compareIdentifiers: Dl.compareIdentifiers,
  rcompareIdentifiers: Dl.rcompareIdentifiers
}, wn = {}, vi = { exports: {} };
vi.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, a = 2, o = 9007199254740991, s = "[object Arguments]", l = "[object Array]", d = "[object AsyncFunction]", c = "[object Boolean]", u = "[object Date]", p = "[object Error]", g = "[object Function]", x = "[object GeneratorFunction]", w = "[object Map]", T = "[object Number]", b = "[object Null]", _ = "[object Object]", F = "[object Promise]", D = "[object Proxy]", k = "[object RegExp]", H = "[object Set]", q = "[object String]", te = "[object Symbol]", y = "[object Undefined]", j = "[object WeakMap]", U = "[object ArrayBuffer]", M = "[object DataView]", J = "[object Float32Array]", R = "[object Float64Array]", I = "[object Int8Array]", P = "[object Int16Array]", S = "[object Int32Array]", $ = "[object Uint8Array]", O = "[object Uint8ClampedArray]", z = "[object Uint16Array]", Y = "[object Uint32Array]", X = /[\\^$.*+?()[\]{}|]/g, re = /^\[object .+?Constructor\]$/, ge = /^(?:0|[1-9]\d*)$/, G = {};
  G[J] = G[R] = G[I] = G[P] = G[S] = G[$] = G[O] = G[z] = G[Y] = !0, G[s] = G[l] = G[U] = G[c] = G[M] = G[u] = G[p] = G[g] = G[w] = G[T] = G[_] = G[k] = G[H] = G[q] = G[j] = !1;
  var et = typeof Pe == "object" && Pe && Pe.Object === Object && Pe, h = typeof self == "object" && self && self.Object === Object && self, f = et || h || Function("return this")(), A = t && !t.nodeType && t, v = A && !0 && e && !e.nodeType && e, Z = v && v.exports === A, ae = Z && et.process, fe = function() {
    try {
      return ae && ae.binding && ae.binding("util");
    } catch {
    }
  }(), ve = fe && fe.isTypedArray;
  function Se(m, E) {
    for (var C = -1, L = m == null ? 0 : m.length, oe = 0, V = []; ++C < L; ) {
      var de = m[C];
      E(de, C, m) && (V[oe++] = de);
    }
    return V;
  }
  function mt(m, E) {
    for (var C = -1, L = E.length, oe = m.length; ++C < L; )
      m[oe + C] = E[C];
    return m;
  }
  function he(m, E) {
    for (var C = -1, L = m == null ? 0 : m.length; ++C < L; )
      if (E(m[C], C, m))
        return !0;
    return !1;
  }
  function We(m, E) {
    for (var C = -1, L = Array(m); ++C < m; )
      L[C] = E(C);
    return L;
  }
  function Zi(m) {
    return function(E) {
      return m(E);
    };
  }
  function bn(m, E) {
    return m.has(E);
  }
  function Or(m, E) {
    return m == null ? void 0 : m[E];
  }
  function Sn(m) {
    var E = -1, C = Array(m.size);
    return m.forEach(function(L, oe) {
      C[++E] = [oe, L];
    }), C;
  }
  function pd(m, E) {
    return function(C) {
      return m(E(C));
    };
  }
  function hd(m) {
    var E = -1, C = Array(m.size);
    return m.forEach(function(L) {
      C[++E] = L;
    }), C;
  }
  var md = Array.prototype, gd = Function.prototype, An = Object.prototype, ea = f["__core-js_shared__"], Qo = gd.toString, tt = An.hasOwnProperty, Zo = function() {
    var m = /[^.]+$/.exec(ea && ea.keys && ea.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), es = An.toString, yd = RegExp(
    "^" + Qo.call(tt).replace(X, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ts = Z ? f.Buffer : void 0, In = f.Symbol, rs = f.Uint8Array, ns = An.propertyIsEnumerable, wd = md.splice, Ft = In ? In.toStringTag : void 0, is = Object.getOwnPropertySymbols, xd = ts ? ts.isBuffer : void 0, Ed = pd(Object.keys, Object), ta = nr(f, "DataView"), Pr = nr(f, "Map"), ra = nr(f, "Promise"), na = nr(f, "Set"), ia = nr(f, "WeakMap"), kr = nr(Object, "create"), vd = Ut(ta), Td = Ut(Pr), _d = Ut(ra), bd = Ut(na), Sd = Ut(ia), as = In ? In.prototype : void 0, aa = as ? as.valueOf : void 0;
  function $t(m) {
    var E = -1, C = m == null ? 0 : m.length;
    for (this.clear(); ++E < C; ) {
      var L = m[E];
      this.set(L[0], L[1]);
    }
  }
  function Ad() {
    this.__data__ = kr ? kr(null) : {}, this.size = 0;
  }
  function Id(m) {
    var E = this.has(m) && delete this.__data__[m];
    return this.size -= E ? 1 : 0, E;
  }
  function Cd(m) {
    var E = this.__data__;
    if (kr) {
      var C = E[m];
      return C === n ? void 0 : C;
    }
    return tt.call(E, m) ? E[m] : void 0;
  }
  function Rd(m) {
    var E = this.__data__;
    return kr ? E[m] !== void 0 : tt.call(E, m);
  }
  function Dd(m, E) {
    var C = this.__data__;
    return this.size += this.has(m) ? 0 : 1, C[m] = kr && E === void 0 ? n : E, this;
  }
  $t.prototype.clear = Ad, $t.prototype.delete = Id, $t.prototype.get = Cd, $t.prototype.has = Rd, $t.prototype.set = Dd;
  function ct(m) {
    var E = -1, C = m == null ? 0 : m.length;
    for (this.clear(); ++E < C; ) {
      var L = m[E];
      this.set(L[0], L[1]);
    }
  }
  function Od() {
    this.__data__ = [], this.size = 0;
  }
  function Pd(m) {
    var E = this.__data__, C = Rn(E, m);
    if (C < 0)
      return !1;
    var L = E.length - 1;
    return C == L ? E.pop() : wd.call(E, C, 1), --this.size, !0;
  }
  function kd(m) {
    var E = this.__data__, C = Rn(E, m);
    return C < 0 ? void 0 : E[C][1];
  }
  function Nd(m) {
    return Rn(this.__data__, m) > -1;
  }
  function Fd(m, E) {
    var C = this.__data__, L = Rn(C, m);
    return L < 0 ? (++this.size, C.push([m, E])) : C[L][1] = E, this;
  }
  ct.prototype.clear = Od, ct.prototype.delete = Pd, ct.prototype.get = kd, ct.prototype.has = Nd, ct.prototype.set = Fd;
  function Lt(m) {
    var E = -1, C = m == null ? 0 : m.length;
    for (this.clear(); ++E < C; ) {
      var L = m[E];
      this.set(L[0], L[1]);
    }
  }
  function $d() {
    this.size = 0, this.__data__ = {
      hash: new $t(),
      map: new (Pr || ct)(),
      string: new $t()
    };
  }
  function Ld(m) {
    var E = Dn(this, m).delete(m);
    return this.size -= E ? 1 : 0, E;
  }
  function Ud(m) {
    return Dn(this, m).get(m);
  }
  function Md(m) {
    return Dn(this, m).has(m);
  }
  function Bd(m, E) {
    var C = Dn(this, m), L = C.size;
    return C.set(m, E), this.size += C.size == L ? 0 : 1, this;
  }
  Lt.prototype.clear = $d, Lt.prototype.delete = Ld, Lt.prototype.get = Ud, Lt.prototype.has = Md, Lt.prototype.set = Bd;
  function Cn(m) {
    var E = -1, C = m == null ? 0 : m.length;
    for (this.__data__ = new Lt(); ++E < C; )
      this.add(m[E]);
  }
  function jd(m) {
    return this.__data__.set(m, n), this;
  }
  function Gd(m) {
    return this.__data__.has(m);
  }
  Cn.prototype.add = Cn.prototype.push = jd, Cn.prototype.has = Gd;
  function gt(m) {
    var E = this.__data__ = new ct(m);
    this.size = E.size;
  }
  function zd() {
    this.__data__ = new ct(), this.size = 0;
  }
  function Hd(m) {
    var E = this.__data__, C = E.delete(m);
    return this.size = E.size, C;
  }
  function qd(m) {
    return this.__data__.get(m);
  }
  function Xd(m) {
    return this.__data__.has(m);
  }
  function Wd(m, E) {
    var C = this.__data__;
    if (C instanceof ct) {
      var L = C.__data__;
      if (!Pr || L.length < r - 1)
        return L.push([m, E]), this.size = ++C.size, this;
      C = this.__data__ = new Lt(L);
    }
    return C.set(m, E), this.size = C.size, this;
  }
  gt.prototype.clear = zd, gt.prototype.delete = Hd, gt.prototype.get = qd, gt.prototype.has = Xd, gt.prototype.set = Wd;
  function Vd(m, E) {
    var C = On(m), L = !C && cp(m), oe = !C && !L && oa(m), V = !C && !L && !oe && hs(m), de = C || L || oe || V, ye = de ? We(m.length, String) : [], Te = ye.length;
    for (var se in m)
      tt.call(m, se) && !(de && // Safari 9 has enumerable `arguments.length` in strict mode.
      (se == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      oe && (se == "offset" || se == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      V && (se == "buffer" || se == "byteLength" || se == "byteOffset") || // Skip index properties.
      ip(se, Te))) && ye.push(se);
    return ye;
  }
  function Rn(m, E) {
    for (var C = m.length; C--; )
      if (us(m[C][0], E))
        return C;
    return -1;
  }
  function Yd(m, E, C) {
    var L = E(m);
    return On(m) ? L : mt(L, C(m));
  }
  function Nr(m) {
    return m == null ? m === void 0 ? y : b : Ft && Ft in Object(m) ? rp(m) : lp(m);
  }
  function os(m) {
    return Fr(m) && Nr(m) == s;
  }
  function ss(m, E, C, L, oe) {
    return m === E ? !0 : m == null || E == null || !Fr(m) && !Fr(E) ? m !== m && E !== E : Kd(m, E, C, L, ss, oe);
  }
  function Kd(m, E, C, L, oe, V) {
    var de = On(m), ye = On(E), Te = de ? l : yt(m), se = ye ? l : yt(E);
    Te = Te == s ? _ : Te, se = se == s ? _ : se;
    var je = Te == _, Ve = se == _, Ae = Te == se;
    if (Ae && oa(m)) {
      if (!oa(E))
        return !1;
      de = !0, je = !1;
    }
    if (Ae && !je)
      return V || (V = new gt()), de || hs(m) ? ls(m, E, C, L, oe, V) : ep(m, E, Te, C, L, oe, V);
    if (!(C & i)) {
      var He = je && tt.call(m, "__wrapped__"), qe = Ve && tt.call(E, "__wrapped__");
      if (He || qe) {
        var wt = He ? m.value() : m, ut = qe ? E.value() : E;
        return V || (V = new gt()), oe(wt, ut, C, L, V);
      }
    }
    return Ae ? (V || (V = new gt()), tp(m, E, C, L, oe, V)) : !1;
  }
  function Jd(m) {
    if (!ps(m) || op(m))
      return !1;
    var E = fs(m) ? yd : re;
    return E.test(Ut(m));
  }
  function Qd(m) {
    return Fr(m) && ds(m.length) && !!G[Nr(m)];
  }
  function Zd(m) {
    if (!sp(m))
      return Ed(m);
    var E = [];
    for (var C in Object(m))
      tt.call(m, C) && C != "constructor" && E.push(C);
    return E;
  }
  function ls(m, E, C, L, oe, V) {
    var de = C & i, ye = m.length, Te = E.length;
    if (ye != Te && !(de && Te > ye))
      return !1;
    var se = V.get(m);
    if (se && V.get(E))
      return se == E;
    var je = -1, Ve = !0, Ae = C & a ? new Cn() : void 0;
    for (V.set(m, E), V.set(E, m); ++je < ye; ) {
      var He = m[je], qe = E[je];
      if (L)
        var wt = de ? L(qe, He, je, E, m, V) : L(He, qe, je, m, E, V);
      if (wt !== void 0) {
        if (wt)
          continue;
        Ve = !1;
        break;
      }
      if (Ae) {
        if (!he(E, function(ut, Mt) {
          if (!bn(Ae, Mt) && (He === ut || oe(He, ut, C, L, V)))
            return Ae.push(Mt);
        })) {
          Ve = !1;
          break;
        }
      } else if (!(He === qe || oe(He, qe, C, L, V))) {
        Ve = !1;
        break;
      }
    }
    return V.delete(m), V.delete(E), Ve;
  }
  function ep(m, E, C, L, oe, V, de) {
    switch (C) {
      case M:
        if (m.byteLength != E.byteLength || m.byteOffset != E.byteOffset)
          return !1;
        m = m.buffer, E = E.buffer;
      case U:
        return !(m.byteLength != E.byteLength || !V(new rs(m), new rs(E)));
      case c:
      case u:
      case T:
        return us(+m, +E);
      case p:
        return m.name == E.name && m.message == E.message;
      case k:
      case q:
        return m == E + "";
      case w:
        var ye = Sn;
      case H:
        var Te = L & i;
        if (ye || (ye = hd), m.size != E.size && !Te)
          return !1;
        var se = de.get(m);
        if (se)
          return se == E;
        L |= a, de.set(m, E);
        var je = ls(ye(m), ye(E), L, oe, V, de);
        return de.delete(m), je;
      case te:
        if (aa)
          return aa.call(m) == aa.call(E);
    }
    return !1;
  }
  function tp(m, E, C, L, oe, V) {
    var de = C & i, ye = cs(m), Te = ye.length, se = cs(E), je = se.length;
    if (Te != je && !de)
      return !1;
    for (var Ve = Te; Ve--; ) {
      var Ae = ye[Ve];
      if (!(de ? Ae in E : tt.call(E, Ae)))
        return !1;
    }
    var He = V.get(m);
    if (He && V.get(E))
      return He == E;
    var qe = !0;
    V.set(m, E), V.set(E, m);
    for (var wt = de; ++Ve < Te; ) {
      Ae = ye[Ve];
      var ut = m[Ae], Mt = E[Ae];
      if (L)
        var ms = de ? L(Mt, ut, Ae, E, m, V) : L(ut, Mt, Ae, m, E, V);
      if (!(ms === void 0 ? ut === Mt || oe(ut, Mt, C, L, V) : ms)) {
        qe = !1;
        break;
      }
      wt || (wt = Ae == "constructor");
    }
    if (qe && !wt) {
      var Pn = m.constructor, kn = E.constructor;
      Pn != kn && "constructor" in m && "constructor" in E && !(typeof Pn == "function" && Pn instanceof Pn && typeof kn == "function" && kn instanceof kn) && (qe = !1);
    }
    return V.delete(m), V.delete(E), qe;
  }
  function cs(m) {
    return Yd(m, dp, np);
  }
  function Dn(m, E) {
    var C = m.__data__;
    return ap(E) ? C[typeof E == "string" ? "string" : "hash"] : C.map;
  }
  function nr(m, E) {
    var C = Or(m, E);
    return Jd(C) ? C : void 0;
  }
  function rp(m) {
    var E = tt.call(m, Ft), C = m[Ft];
    try {
      m[Ft] = void 0;
      var L = !0;
    } catch {
    }
    var oe = es.call(m);
    return L && (E ? m[Ft] = C : delete m[Ft]), oe;
  }
  var np = is ? function(m) {
    return m == null ? [] : (m = Object(m), Se(is(m), function(E) {
      return ns.call(m, E);
    }));
  } : pp, yt = Nr;
  (ta && yt(new ta(new ArrayBuffer(1))) != M || Pr && yt(new Pr()) != w || ra && yt(ra.resolve()) != F || na && yt(new na()) != H || ia && yt(new ia()) != j) && (yt = function(m) {
    var E = Nr(m), C = E == _ ? m.constructor : void 0, L = C ? Ut(C) : "";
    if (L)
      switch (L) {
        case vd:
          return M;
        case Td:
          return w;
        case _d:
          return F;
        case bd:
          return H;
        case Sd:
          return j;
      }
    return E;
  });
  function ip(m, E) {
    return E = E ?? o, !!E && (typeof m == "number" || ge.test(m)) && m > -1 && m % 1 == 0 && m < E;
  }
  function ap(m) {
    var E = typeof m;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? m !== "__proto__" : m === null;
  }
  function op(m) {
    return !!Zo && Zo in m;
  }
  function sp(m) {
    var E = m && m.constructor, C = typeof E == "function" && E.prototype || An;
    return m === C;
  }
  function lp(m) {
    return es.call(m);
  }
  function Ut(m) {
    if (m != null) {
      try {
        return Qo.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function us(m, E) {
    return m === E || m !== m && E !== E;
  }
  var cp = os(/* @__PURE__ */ function() {
    return arguments;
  }()) ? os : function(m) {
    return Fr(m) && tt.call(m, "callee") && !ns.call(m, "callee");
  }, On = Array.isArray;
  function up(m) {
    return m != null && ds(m.length) && !fs(m);
  }
  var oa = xd || hp;
  function fp(m, E) {
    return ss(m, E);
  }
  function fs(m) {
    if (!ps(m))
      return !1;
    var E = Nr(m);
    return E == g || E == x || E == d || E == D;
  }
  function ds(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= o;
  }
  function ps(m) {
    var E = typeof m;
    return m != null && (E == "object" || E == "function");
  }
  function Fr(m) {
    return m != null && typeof m == "object";
  }
  var hs = ve ? Zi(ve) : Qd;
  function dp(m) {
    return up(m) ? Vd(m) : Zd(m);
  }
  function pp() {
    return [];
  }
  function hp() {
    return !1;
  }
  e.exports = fp;
})(vi, vi.exports);
var qE = vi.exports;
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.DownloadedUpdateHelper = void 0;
wn.createTempUpdateFile = KE;
const XE = fn, WE = Pt, Ol = qE, zt = kt, Wr = ue;
class VE {
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
    return Wr.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Ol(this.versionInfo, r) && Ol(this.fileInfo.info, n.info) && await (0, zt.pathExists)(t) ? t : null;
    const a = await this.getValidCachedUpdateFile(n, i);
    return a === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = a, a);
  }
  async setDownloadedFile(t, r, n, i, a, o) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: a,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, o && await (0, zt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
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
    } catch (d) {
      let c = "No cached update info available";
      return d.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${d.message})`), r.info(c), null;
    }
    if (!((a == null ? void 0 : a.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== a.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${a.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Wr.join(this.cacheDirForPendingUpdate, a.fileName);
    if (!await (0, zt.pathExists)(s))
      return r.info("Cached update file doesn't exist"), null;
    const l = await YE(s);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = a, s);
  }
  getUpdateInfoFile() {
    return Wr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
wn.DownloadedUpdateHelper = VE;
function YE(e, t = "sha512", r = "base64", n) {
  return new Promise((i, a) => {
    const o = (0, XE.createHash)(t);
    o.on("error", a).setEncoding(r), (0, WE.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", a).on("end", () => {
      o.end(), i(o.read());
    }).pipe(o, { end: !1 });
  });
}
async function KE(e, t, r) {
  let n = 0, i = Wr.join(t, e);
  for (let a = 0; a < 3; a++)
    try {
      return await (0, zt.unlink)(i), i;
    } catch (o) {
      if (o.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${o}`), i = Wr.join(t, `${n++}-${e}`);
    }
  return i;
}
var ji = {}, zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
zo.getAppCacheDir = QE;
const Aa = ue, JE = Ai;
function QE() {
  const e = (0, JE.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Aa.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Aa.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Aa.join(e, ".cache"), t;
}
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.ElectronAppAdapter = void 0;
const Pl = ue, ZE = zo;
class ev {
  constructor(t = Jt.app) {
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
    return this.isPackaged ? Pl.join(process.resourcesPath, "app-update.yml") : Pl.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, ZE.getAppCacheDir)();
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
ji.ElectronAppAdapter = ev;
var Df = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = Ee;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return Jt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(a) {
      super(), this.proxyLoginCallback = a, this.cachedSession = null;
    }
    async download(a, o, s) {
      return await s.cancellationToken.createPromise((l, d, c) => {
        const u = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(a, u), (0, t.configureRequestOptions)(u), this.doDownload(u, {
          destination: o,
          options: s,
          onCancel: c,
          callback: (p) => {
            p == null ? l(o) : d(p);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(a, o) {
      a.headers && a.headers.Host && (a.host = a.headers.Host, delete a.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const s = Jt.net.request({
        ...a,
        session: this.cachedSession
      });
      return s.on("response", o), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(a, o, s, l, d) {
      a.on("redirect", (c, u, p) => {
        a.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : d(t.HttpExecutor.prepareRedirectUrlOptions(p, o));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(Df);
var xn = {}, Xe = {}, tv = "[object Symbol]", Of = /[\\^$.*+?()[\]{}|]/g, rv = RegExp(Of.source), nv = typeof Pe == "object" && Pe && Pe.Object === Object && Pe, iv = typeof self == "object" && self && self.Object === Object && self, av = nv || iv || Function("return this")(), ov = Object.prototype, sv = ov.toString, kl = av.Symbol, Nl = kl ? kl.prototype : void 0, Fl = Nl ? Nl.toString : void 0;
function lv(e) {
  if (typeof e == "string")
    return e;
  if (uv(e))
    return Fl ? Fl.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function cv(e) {
  return !!e && typeof e == "object";
}
function uv(e) {
  return typeof e == "symbol" || cv(e) && sv.call(e) == tv;
}
function fv(e) {
  return e == null ? "" : lv(e);
}
function dv(e) {
  return e = fv(e), e && rv.test(e) ? e.replace(Of, "\\$&") : e;
}
var pv = dv;
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.newBaseUrl = mv;
Xe.newUrlFromBase = to;
Xe.getChannelFilename = gv;
Xe.blockmapFiles = yv;
const Pf = Sr, hv = pv;
function mv(e) {
  const t = new Pf.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function to(e, t, r = !1) {
  const n = new Pf.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function gv(e) {
  return `${e}.yml`;
}
function yv(e, t, r) {
  const n = to(`${e.pathname}.blockmap`, e);
  return [to(`${e.pathname.replace(new RegExp(hv(r), "g"), t)}.blockmap`, e), n];
}
var me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.Provider = void 0;
me.findFile = Ev;
me.parseUpdateInfo = vv;
me.getFileList = kf;
me.resolveFiles = Tv;
const Dt = Ee, wv = be, $l = Xe;
class xv {
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
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Dt.configureRequestUrl)(t, n), n;
  }
}
me.Provider = xv;
function Ev(e, t, r) {
  if (e.length === 0)
    throw (0, Dt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((a) => i.url.pathname.toLowerCase().endsWith(`.${a}`))));
}
function vv(e, t, r) {
  if (e == null)
    throw (0, Dt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, wv.load)(e);
  } catch (i) {
    throw (0, Dt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function kf(e) {
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
  throw (0, Dt.newError)(`No files provided: ${(0, Dt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Tv(e, t, r = (n) => n) {
  const i = kf(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, Dt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Dt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, $l.newUrlFromBase)(r(s.url), t),
      info: s
    };
  }), a = e.packages, o = a == null ? null : a[process.arch] || a.ia32;
  return o != null && (i[0].packageInfo = {
    ...o,
    path: (0, $l.newUrlFromBase)(r(o.path), t).href
  }), i;
}
Object.defineProperty(xn, "__esModule", { value: !0 });
xn.GenericProvider = void 0;
const Ll = Ee, Ia = Xe, Ca = me;
class _v extends Ca.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, Ia.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Ia.getChannelFilename)(this.channel), r = (0, Ia.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Ca.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Ll.HttpError && i.statusCode === 404)
          throw (0, Ll.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((a, o) => {
            try {
              setTimeout(a, 1e3 * n);
            } catch (s) {
              o(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Ca.resolveFiles)(t, this.baseUrl);
  }
}
xn.GenericProvider = _v;
var Gi = {}, zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.BitbucketProvider = void 0;
const Ul = Ee, Ra = Xe, Da = me;
class bv extends Da.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: a } = t;
    this.baseUrl = (0, Ra.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Ul.CancellationToken(), r = (0, Ra.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Ra.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Da.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Ul.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Da.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
zi.BitbucketProvider = bv;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.GitHubProvider = Ot.BaseGitHubProvider = void 0;
Ot.computeReleaseNotes = Ff;
const ft = Ee, mr = Rf, Sv = Sr, gr = Xe, ro = me, Oa = /\/tag\/([^/]+)$/;
class Nf extends ro.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, gr.newBaseUrl)((0, ft.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, gr.newBaseUrl)((0, ft.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
Ot.BaseGitHubProvider = Nf;
class Av extends Nf {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, a;
    const o = new ft.CancellationToken(), s = await this.httpRequest((0, gr.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, o), l = (0, ft.parseXml)(s);
    let d = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = mr.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (T === null)
          c = Oa.exec(d.element("link").attribute("href"))[1];
        else
          for (const b of l.getElements("entry")) {
            const _ = Oa.exec(b.element("link").attribute("href"));
            if (_ === null)
              continue;
            const F = _[1], D = ((n = mr.prerelease(F)) === null || n === void 0 ? void 0 : n[0]) || null, k = !T || ["alpha", "beta"].includes(T), H = D !== null && !["alpha", "beta"].includes(String(D));
            if (k && !H && !(T === "beta" && D === "alpha")) {
              c = F;
              break;
            }
            if (D && D === T) {
              c = F;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(o);
        for (const T of l.getElements("entry"))
          if (Oa.exec(T.element("link").attribute("href"))[1] === c) {
            d = T;
            break;
          }
      }
    } catch (T) {
      throw (0, ft.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, ft.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let u, p = "", g = "";
    const x = async (T) => {
      p = (0, gr.getChannelFilename)(T), g = (0, gr.newUrlFromBase)(this.getBaseDownloadPath(String(c), p), this.baseUrl);
      const b = this.createRequestOptions(g);
      try {
        return await this.executor.request(b, o);
      } catch (_) {
        throw _ instanceof ft.HttpError && _.statusCode === 404 ? (0, ft.newError)(`Cannot find ${p} in the latest release artifacts (${g}): ${_.stack || _.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : _;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = mr.prerelease(c)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((a = mr.prerelease(c)) === null || a === void 0 ? void 0 : a[0]))), u = await x(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        u = await x(this.getDefaultChannelName());
      else
        throw T;
    }
    const w = (0, ro.parseUpdateInfo)(u, p, g);
    return w.releaseName == null && (w.releaseName = d.elementValueOrEmpty("title")), w.releaseNotes == null && (w.releaseNotes = Ff(this.updater.currentVersion, this.updater.fullChangelog, l, d)), {
      tag: c,
      ...w
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, gr.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Sv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, ft.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, ro.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
Ot.GitHubProvider = Av;
function Ml(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Ff(e, t, r, n) {
  if (!t)
    return Ml(n);
  const i = [];
  for (const a of r.getElements("entry")) {
    const o = /\/tag\/v?([^/]+)$/.exec(a.element("link").attribute("href"))[1];
    mr.lt(e, o) && i.push({
      version: o,
      note: Ml(a)
    });
  }
  return i.sort((a, o) => mr.rcompare(a.version, o.version));
}
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.KeygenProvider = void 0;
const Bl = Ee, Pa = Xe, ka = me;
class Iv extends ka.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Pa.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Bl.CancellationToken(), r = (0, Pa.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Pa.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, ka.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Bl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, ka.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
Hi.KeygenProvider = Iv;
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.PrivateGitHubProvider = void 0;
const sr = Ee, Cv = be, Rv = ue, jl = Sr, Gl = Xe, Dv = Ot, Ov = me;
class Pv extends Dv.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new sr.CancellationToken(), r = (0, Gl.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((s) => s.name === r);
    if (i == null)
      throw (0, sr.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const a = new jl.URL(i.url);
    let o;
    try {
      o = (0, Cv.load)(await this.httpRequest(a, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof sr.HttpError && s.statusCode === 404 ? (0, sr.newError)(`Cannot find ${r} in the latest release artifacts (${a}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return o.assets = n.assets, o;
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
    const i = (0, Gl.newUrlFromBase)(n, this.baseUrl);
    try {
      const a = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? a.find((o) => o.prerelease) || a[0] : a;
    } catch (a) {
      throw (0, sr.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${a.stack || a.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Ov.getFileList)(t).map((r) => {
      const n = Rv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((a) => a != null && a.name === n);
      if (i == null)
        throw (0, sr.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new jl.URL(i.url),
        info: r
      };
    });
  }
}
qi.PrivateGitHubProvider = Pv;
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.isUrlProbablySupportMultiRangeRequests = $f;
Gi.createClient = Lv;
const Wn = Ee, kv = zi, zl = xn, Nv = Ot, Fv = Hi, $v = qi;
function $f(e) {
  return !e.includes("s3.amazonaws.com");
}
function Lv(e, t, r) {
  if (typeof e == "string")
    throw (0, Wn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, a = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return a == null ? new Nv.GitHubProvider(i, t, r) : new $v.PrivateGitHubProvider(i, t, a, r);
    }
    case "bitbucket":
      return new kv.BitbucketProvider(e, t, r);
    case "keygen":
      return new Fv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new zl.GenericProvider({
        provider: "generic",
        url: (0, Wn.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new zl.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && $f(i.url)
      });
    }
    case "custom": {
      const i = e, a = i.updateProvider;
      if (!a)
        throw (0, Wn.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new a(i, t, r);
    }
    default:
      throw (0, Wn.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Xi = {}, En = {}, Dr = {}, rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.OperationKind = void 0;
rr.computeOperations = Uv;
var Wt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Wt || (rr.OperationKind = Wt = {}));
function Uv(e, t, r) {
  const n = ql(e.files), i = ql(t.files);
  let a = null;
  const o = t.files[0], s = [], l = o.name, d = n.get(l);
  if (d == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let u = 0;
  const { checksumToOffset: p, checksumToOldSize: g } = Bv(n.get(l), d.offset, r);
  let x = o.offset;
  for (let w = 0; w < c.checksums.length; x += c.sizes[w], w++) {
    const T = c.sizes[w], b = c.checksums[w];
    let _ = p.get(b);
    _ != null && g.get(b) !== T && (r.warn(`Checksum ("${b}") matches, but size differs (old: ${g.get(b)}, new: ${T})`), _ = void 0), _ === void 0 ? (u++, a != null && a.kind === Wt.DOWNLOAD && a.end === x ? a.end += T : (a = {
      kind: Wt.DOWNLOAD,
      start: x,
      end: x + T
      // oldBlocks: null,
    }, Hl(a, s, b, w))) : a != null && a.kind === Wt.COPY && a.end === _ ? a.end += T : (a = {
      kind: Wt.COPY,
      start: _,
      end: _ + T
      // oldBlocks: [checksum]
    }, Hl(a, s, b, w));
  }
  return u > 0 && r.info(`File${o.name === "file" ? "" : " " + o.name} has ${u} changed blocks`), s;
}
const Mv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Hl(e, t, r, n) {
  if (Mv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const a = [i.start, i.end, e.start, e.end].reduce((o, s) => o < s ? o : s);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${Wt[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - a} until ${i.end - a} and ${e.start - a} until ${e.end - a}`);
    }
  }
  t.push(e);
}
function Bv(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let a = t;
  for (let o = 0; o < e.checksums.length; o++) {
    const s = e.checksums[o], l = e.sizes[o], d = i.get(s);
    if (d === void 0)
      n.set(s, a), i.set(s, l);
    else if (r.debug != null) {
      const c = d === l ? "(same size)" : `(size: ${d}, this size: ${l})`;
      r.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    a += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function ql(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.DataSplitter = void 0;
Dr.copyData = Lf;
const Vn = Ee, jv = Pt, Gv = un, zv = rr, Xl = Buffer.from(`\r
\r
`);
var vt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(vt || (vt = {}));
function Lf(e, t, r, n, i) {
  const a = (0, jv.createReadStream)("", {
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
class Hv extends Gv.Writable {
  constructor(t, r, n, i, a, o) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = a, this.finishHandler = o, this.partIndex = -1, this.headerListBuffer = null, this.readState = vt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, Vn.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === vt.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = vt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === vt.BODY)
          this.readState = vt.INIT;
        else {
          this.partIndex++;
          let o = this.partIndexToTaskIndex.get(this.partIndex);
          if (o == null)
            if (this.isFinished)
              o = this.options.end;
            else
              throw (0, Vn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < o)
            await this.copyExistingData(s, o);
          else if (s > o)
            throw (0, Vn.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = vt.HEADER;
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
        const o = this.options.tasks[t];
        if (o.kind !== zv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Lf(o, this.out, this.options.oldFileFd, i, () => {
          t++, a();
        });
      };
      a();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(Xl, r);
    if (n !== -1)
      return n + Xl.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Vn.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((a, o) => {
      i.on("error", o), i.once("drain", () => {
        i.removeListener("error", o), a();
      });
    });
  }
}
Dr.DataSplitter = Hv;
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.executeTasksUsingMultipleRangeRequests = qv;
Wi.checkIsRangesSupported = io;
const no = Ee, Wl = Dr, Vl = rr;
function qv(e, t, r, n, i) {
  const a = (o) => {
    if (o >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const s = o + 1e3;
    Xv(e, {
      tasks: t,
      start: o,
      end: Math.min(t.length, s),
      oldFileFd: n
    }, r, () => a(s), i);
  };
  return a;
}
function Xv(e, t, r, n, i) {
  let a = "bytes=", o = 0;
  const s = /* @__PURE__ */ new Map(), l = [];
  for (let u = t.start; u < t.end; u++) {
    const p = t.tasks[u];
    p.kind === Vl.OperationKind.DOWNLOAD && (a += `${p.start}-${p.end - 1}, `, s.set(o, u), o++, l.push(p.end - p.start));
  }
  if (o <= 1) {
    const u = (p) => {
      if (p >= t.end) {
        n();
        return;
      }
      const g = t.tasks[p++];
      if (g.kind === Vl.OperationKind.COPY)
        (0, Wl.copyData)(g, r, t.oldFileFd, i, () => u(p));
      else {
        const x = e.createRequestOptions();
        x.headers.Range = `bytes=${g.start}-${g.end - 1}`;
        const w = e.httpExecutor.createRequest(x, (T) => {
          io(T, i) && (T.pipe(r, {
            end: !1
          }), T.once("end", () => u(p)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(w, i), w.end();
      }
    };
    u(t.start);
    return;
  }
  const d = e.createRequestOptions();
  d.headers.Range = a.substring(0, a.length - 2);
  const c = e.httpExecutor.createRequest(d, (u) => {
    if (!io(u, i))
      return;
    const p = (0, no.safeGetHeader)(u, "content-type"), g = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(p);
    if (g == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${p}"`));
      return;
    }
    const x = new Wl.DataSplitter(r, t, s, g[1] || g[2], l, n);
    x.on("error", i), u.pipe(x), u.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function io(e, t) {
  if (e.statusCode >= 400)
    return t((0, no.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, no.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.ProgressDifferentialDownloadCallbackTransform = void 0;
const Wv = un;
var yr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(yr || (yr = {}));
class Vv extends Wv.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = yr.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == yr.COPY) {
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
    this.operationType = yr.COPY;
  }
  beginRangeDownload() {
    this.operationType = yr.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
Vi.ProgressDifferentialDownloadCallbackTransform = Vv;
Object.defineProperty(En, "__esModule", { value: !0 });
En.DifferentialDownloader = void 0;
const Mr = Ee, Na = kt, Yv = Pt, Kv = Dr, Jv = Sr, Yn = rr, Yl = Wi, Qv = Vi;
class Zv {
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
    return (0, Mr.configureRequestUrl)(this.options.newUrl, t), (0, Mr.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Yn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let a = 0, o = 0;
    for (const l of i) {
      const d = l.end - l.start;
      l.kind === Yn.OperationKind.DOWNLOAD ? a += d : o += d;
    }
    const s = this.blockAwareFileInfo.size;
    if (a + o + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${a}, copySize: ${o}, newSize: ${s}`);
    return n.info(`Full: ${Kl(s)}, To download: ${Kl(a)} (${Math.round(a / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Na.close)(i.descriptor).catch((a) => {
      this.logger.error(`cannot close file "${i.path}": ${a}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((a) => {
      try {
        this.logger.error(`cannot close files: ${a}`);
      } catch (o) {
        try {
          console.error(o);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, Na.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Na.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const a = (0, Yv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((o, s) => {
      const l = [];
      let d;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const b = [];
        let _ = 0;
        for (const D of t)
          D.kind === Yn.OperationKind.DOWNLOAD && (b.push(D.end - D.start), _ += D.end - D.start);
        const F = {
          expectedByteCounts: b,
          grandTotal: _
        };
        d = new Qv.ProgressDifferentialDownloadCallbackTransform(F, this.options.cancellationToken, this.options.onProgress), l.push(d);
      }
      const c = new Mr.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), a.on("finish", () => {
        a.close(() => {
          r.splice(1, 1);
          try {
            c.validate();
          } catch (b) {
            s(b);
            return;
          }
          o(void 0);
        });
      }), l.push(a);
      let u = null;
      for (const b of l)
        b.on("error", s), u == null ? u = b : u = u.pipe(b);
      const p = l[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, Yl.executeTasksUsingMultipleRangeRequests)(this, t, p, n, s), g(0);
        return;
      }
      let x = 0, w = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", g = (b) => {
        var _, F;
        if (b >= t.length) {
          this.fileMetadataBuffer != null && p.write(this.fileMetadataBuffer), p.end();
          return;
        }
        const D = t[b++];
        if (D.kind === Yn.OperationKind.COPY) {
          d && d.beginFileCopy(), (0, Kv.copyData)(D, p, n, s, () => g(b));
          return;
        }
        const k = `bytes=${D.start}-${D.end - 1}`;
        T.headers.range = k, (F = (_ = this.logger) === null || _ === void 0 ? void 0 : _.debug) === null || F === void 0 || F.call(_, `download range: ${k}`), d && d.beginRangeDownload();
        const H = this.httpExecutor.createRequest(T, (q) => {
          q.on("error", s), q.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), q.statusCode >= 400 && s((0, Mr.createHttpError)(q)), q.pipe(p, {
            end: !1
          }), q.once("end", () => {
            d && d.endRangeDownload(), ++x === 100 ? (x = 0, setTimeout(() => g(b), 1e3)) : g(b);
          });
        });
        H.on("redirect", (q, te, y) => {
          this.logger.info(`Redirect to ${eT(y)}`), w = y, (0, Mr.configureRequestUrl)(new Jv.URL(w), T), H.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(H, s), H.end();
      }, g(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let a = 0;
    if (await this.request(i, (o) => {
      o.copy(n, a), a += o.length;
    }), a !== n.length)
      throw new Error(`Received data length ${a} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const a = this.httpExecutor.createRequest(t, (o) => {
        (0, Yl.checkIsRangesSupported)(o, i) && (o.on("error", i), o.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), o.on("data", r), o.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(a, i), a.end();
    });
  }
}
En.DifferentialDownloader = Zv;
function Kl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function eT(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.GenericDifferentialDownloader = void 0;
const tT = En;
class rT extends tT.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Xi.GenericDifferentialDownloader = rT;
var Nt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = Ee;
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
  function n(i, a, o) {
    i.on(a, o);
  }
})(Nt);
Object.defineProperty(It, "__esModule", { value: !0 });
It.NoOpLogger = It.AppUpdater = void 0;
const De = Ee, nT = fn, iT = Ai, aT = Cc, lr = kt, oT = be, Fa = Fi, Bt = ue, Ht = Rf, Jl = wn, sT = ji, Ql = Df, lT = xn, $a = Gi, cT = Dc, uT = Xe, fT = Xi, cr = Nt;
class Ho extends aT.EventEmitter {
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
        throw (0, De.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, De.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, Ql.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Uf();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Fa.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new cr.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (a) => this.checkIfUpdateSupported(a), this.clientPromise = null, this.stagingUserIdPromise = new Fa.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Fa.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (a) => {
      this._logger.error(`Error: ${a.stack || a.message}`);
    }), r == null ? (this.app = new sT.ElectronAppAdapter(), this.httpExecutor = new Ql.ElectronHttpExecutor((a, o) => this.emit("login", a, o))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Ht.parse)(n);
    if (i == null)
      throw (0, De.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = dT(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new lT.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, $a.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, $a.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = Ho.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new Jt.Notification(n).show();
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
    const i = await this.stagingUserIdPromise.value, o = De.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${o}, user id: ${i}`), o < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Ht.parse)(t.version);
    if (r == null)
      throw (0, De.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Ht.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const a = (0, Ht.gt)(r, n), o = (0, Ht.lt)(r, n);
    return a ? !0 : this.allowDowngrade && o;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, iT.release)();
    if (r)
      try {
        if ((0, Ht.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, $a.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    const n = new De.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, De.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new De.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, De.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof De.CancellationError))
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
    this.emit(cr.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, oT.load)(await (0, lr.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Bt.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, lr.readFile)(t, "utf-8");
      if (De.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = De.UUID.v5((0, nT.randomBytes)(4096), De.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, lr.outputFile)(t, r);
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
      const i = Bt.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Jl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(cr.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (_) => this.emit(cr.DOWNLOAD_PROGRESS, _));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, a = i.version, o = r.packageInfo;
    function s() {
      const _ = decodeURIComponent(t.fileInfo.url.pathname);
      return _.endsWith(`.${t.fileExtension}`) ? Bt.basename(_) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), d = l.cacheDirForPendingUpdate;
    await (0, lr.mkdir)(d, { recursive: !0 });
    const c = s();
    let u = Bt.join(d, c);
    const p = o == null ? null : Bt.join(d, `package-${a}${Bt.extname(o.path) || ".7z"}`), g = async (_) => (await l.setDownloadedFile(u, p, i, r, c, _), await t.done({
      ...i,
      downloadedFile: u
    }), p == null ? [u] : [u, p]), x = this._logger, w = await l.validateDownloadedPath(u, i, r, x);
    if (w != null)
      return u = w, await g(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, lr.unlink)(u).catch(() => {
    })), b = await (0, Jl.createTempUpdateFile)(`temp-${c}`, d, x);
    try {
      await t.task(b, n, p, T), await (0, De.retry)(() => (0, lr.rename)(b, u), 60, 500, 0, 0, (_) => _ instanceof Error && /^EBUSY:/.test(_.message));
    } catch (_) {
      throw await T(), _ instanceof De.CancellationError && (x.info("cancelled"), this.emit("update-cancelled", i)), _;
    }
    return x.info(`New version ${a} has been downloaded to ${u}`), await g(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, a) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const o = (0, uT.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${o[0]}", new: ${o[1]})`);
      const s = async (c) => {
        const u = await this.httpExecutor.downloadToBuffer(c, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (u == null || u.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, cT.gunzipSync)(u).toString());
        } catch (p) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${p}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: Bt.join(this.downloadedUpdateHelper.cacheDir, a),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(cr.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(cr.DOWNLOAD_PROGRESS, c));
      const d = await Promise.all(o.map((c) => s(c)));
      return await new fT.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(d[0], d[1]), !1;
    } catch (o) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), this._testOnlyOptions != null)
        throw o;
      return !0;
    }
  }
}
It.AppUpdater = Ho;
function dT(e) {
  const t = (0, Ht.prerelease)(e);
  return t != null && t.length > 0;
}
class Uf {
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
It.NoOpLogger = Uf;
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.BaseUpdater = void 0;
const Zl = Si, pT = It;
class hT extends pT.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Jt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
    } catch (o) {
      return this.dispatchError(o), !1;
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
    const i = (0, Zl.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: a, status: o, stdout: s, stderr: l } = i;
    if (a != null)
      throw this._logger.error(l), a;
    if (o != null && o !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${o}`);
    return s.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((a, o) => {
      try {
        const s = { stdio: i, env: n, detached: !0 }, l = (0, Zl.spawn)(t, r, s);
        l.on("error", (d) => {
          o(d);
        }), l.unref(), l.pid !== void 0 && a(!0);
      } catch (s) {
        o(s);
      }
    });
  }
}
ht.BaseUpdater = hT;
var nn = {}, vn = {};
Object.defineProperty(vn, "__esModule", { value: !0 });
vn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const ur = kt, mT = En, gT = Dc;
class yT extends mT.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Mf(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await wT(this.options.oldFile), i);
  }
}
vn.FileWithEmbeddedBlockMapDifferentialDownloader = yT;
function Mf(e) {
  return JSON.parse((0, gT.inflateRawSync)(e).toString());
}
async function wT(e) {
  const t = await (0, ur.open)(e, "r");
  try {
    const r = (await (0, ur.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, ur.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, ur.read)(t, i, 0, i.length, r - n.length - i.length), await (0, ur.close)(t), Mf(i);
  } catch (r) {
    throw await (0, ur.close)(t), r;
  }
}
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.AppImageUpdater = void 0;
const ec = Ee, tc = Si, xT = kt, ET = Pt, Br = ue, vT = ht, TT = vn, _T = me, rc = Nt;
class bT extends vT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, _T.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        const o = process.env.APPIMAGE;
        if (o == null)
          throw (0, ec.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, o, i, r, t)) && await this.httpExecutor.download(n.url, i, a), await (0, xT.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, a) {
    try {
      const o = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: a.requestHeaders,
        cancellationToken: a.cancellationToken
      };
      return this.listenerCount(rc.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(rc.DOWNLOAD_PROGRESS, s)), await new TT.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, o).download(), !1;
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, ec.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, ET.unlinkSync)(r);
    let n;
    const i = Br.basename(r), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Br.basename(a) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Br.join(Br.dirname(r), Br.basename(a)), (0, tc.execFileSync)("mv", ["-f", a, n]), n !== r && this.emit("appimage-filename-updated", n);
    const o = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], o) : (o.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, tc.execFileSync)(n, [], { env: o })), !0;
  }
}
nn.AppImageUpdater = bT;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.DebUpdater = void 0;
const ST = ht, AT = me, nc = Nt;
class IT extends ST.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, AT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(nc.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit(nc.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, a);
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
an.DebUpdater = IT;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.PacmanUpdater = void 0;
const CT = ht, ic = Nt, RT = me;
class DT extends CT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, RT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(ic.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit(ic.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, a);
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
on.PacmanUpdater = DT;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.RpmUpdater = void 0;
const OT = ht, ac = Nt, PT = me;
class kT extends OT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, PT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(ac.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit(ac.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, a);
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
    let o;
    return i ? o = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", a] : o = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", a], this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${o.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
sn.RpmUpdater = kT;
var ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.MacUpdater = void 0;
const oc = Ee, La = kt, NT = Pt, sc = ue, FT = Tp, $T = It, LT = me, lc = Si, cc = fn;
class UT extends $T.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = Jt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
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
      this.debug("Checking for macOS Rosetta environment"), a = (0, lc.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${a})`);
    } catch (u) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${u}`);
    }
    let o = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const p = (0, lc.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${p}`), o = o || p;
    } catch (u) {
      n.warn(`uname shell command to check for arm64 failed: ${u}`);
    }
    o = o || process.arch === "arm64" || a;
    const s = (u) => {
      var p;
      return u.url.pathname.includes("arm64") || ((p = u.info.url) === null || p === void 0 ? void 0 : p.includes("arm64"));
    };
    o && r.some(s) ? r = r.filter((u) => o === s(u)) : r = r.filter((u) => !s(u));
    const l = (0, LT.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, oc.newError)(`ZIP file not provided: ${(0, oc.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const d = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (u, p) => {
        const g = sc.join(this.downloadedUpdateHelper.cacheDir, c), x = () => (0, La.pathExistsSync)(g) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let w = !0;
        x() && (w = await this.differentialDownloadInstaller(l, t, u, d, c)), w && await this.httpExecutor.download(l.url, u, p);
      },
      done: async (u) => {
        if (!t.disableDifferentialDownload)
          try {
            const p = sc.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, La.copyFile)(u.downloadedFile, p);
          } catch (p) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${p.message}`);
          }
        return this.updateDownloaded(l, u);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, a = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, La.stat)(i)).size, o = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, FT.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      o.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (d) => {
      const c = d.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((d, c) => {
      const u = (0, cc.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), p = Buffer.from(`autoupdater:${u}`, "ascii"), g = `/${(0, cc.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (x, w) => {
        const T = x.url;
        if (o.info(`${T} requested`), T === "/") {
          if (!x.headers.authorization || x.headers.authorization.indexOf("Basic ") === -1) {
            w.statusCode = 401, w.statusMessage = "Invalid Authentication Credentials", w.end(), o.warn("No authenthication info");
            return;
          }
          const F = x.headers.authorization.split(" ")[1], D = Buffer.from(F, "base64").toString("ascii"), [k, H] = D.split(":");
          if (k !== "autoupdater" || H !== u) {
            w.statusCode = 401, w.statusMessage = "Invalid Authentication Credentials", w.end(), o.warn("Invalid authenthication credentials");
            return;
          }
          const q = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          w.writeHead(200, { "Content-Type": "application/json", "Content-Length": q.length }), w.end(q);
          return;
        }
        if (!T.startsWith(g)) {
          o.warn(`${T} requested, but not supported`), w.writeHead(404), w.end();
          return;
        }
        o.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let b = !1;
        w.on("finish", () => {
          b || (this.nativeUpdater.removeListener("error", c), d([]));
        });
        const _ = (0, NT.createReadStream)(i);
        _.on("error", (F) => {
          try {
            w.end();
          } catch (D) {
            o.warn(`cannot end response: ${D}`);
          }
          b = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${F}`));
        }), w.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": a
        }), _.pipe(w);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
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
ln.MacUpdater = UT;
var cn = {}, qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
qo.verifySignature = BT;
const uc = Ee, Bf = Si, MT = Ai, fc = ue;
function BT(e, t, r) {
  return new Promise((n, i) => {
    const a = t.replace(/'/g, "''");
    r.info(`Verifying signature ${a}`), (0, Bf.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${a}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (o, s, l) => {
      var d;
      try {
        if (o != null || l) {
          Ua(r, o, l, i), n(null);
          return;
        }
        const c = jT(s);
        if (c.Status === 0) {
          try {
            const x = fc.normalize(c.Path), w = fc.normalize(t);
            if (r.info(`LiteralPath: ${x}. Update Path: ${w}`), x !== w) {
              Ua(r, new Error(`LiteralPath of ${x} is different than ${w}`), l, i), n(null);
              return;
            }
          } catch (x) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(d = x.message) !== null && d !== void 0 ? d : x.stack}`);
          }
          const p = (0, uc.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const x of e) {
            const w = (0, uc.parseDn)(x);
            if (w.size ? g = Array.from(w.keys()).every((b) => w.get(b) === p.get(b)) : x === p.get("CN") && (r.warn(`Signature validated using only CN ${x}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              n(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (p, g) => p === "RawData" ? void 0 : g, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), n(u);
      } catch (c) {
        Ua(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function jT(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function Ua(e, t, r, n) {
  if (GT()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Bf.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function GT() {
  const e = MT.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.NsisUpdater = void 0;
const Kn = Ee, dc = ue, zT = ht, HT = vn, pc = Nt, qT = me, XT = kt, WT = qo, hc = Sr;
class VT extends zT.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, WT.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, qT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, a, o, s) => {
        const l = n.packageInfo, d = l != null && o != null;
        if (d && t.disableWebInstaller)
          throw (0, Kn.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !d && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Kn.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, a);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, Kn.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (d && await this.differentialDownloadWebPackage(t, l, o, r))
          try {
            await this.httpExecutor.download(new hc.URL(l.path), o, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (u) {
            try {
              await (0, XT.unlink)(o);
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
      this.spawnLog(dc.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((o) => this.dispatchError(o));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), a(), !0) : (this.spawnLog(r, n).catch((o) => {
      const s = o.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${o.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? a() : s === "ENOENT" ? Jt.shell.openPath(r).catch((l) => this.dispatchError(l)) : this.dispatchError(o);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const a = {
        newUrl: new hc.URL(r.path),
        oldFile: dc.join(this.downloadedUpdateHelper.cacheDir, Kn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(pc.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit(pc.DOWNLOAD_PROGRESS, o)), await new HT.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, a).download();
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "win32";
    }
    return !1;
  }
}
cn.NsisUpdater = VT;
(function(e) {
  var t = Pe && Pe.__createBinding || (Object.create ? function(T, b, _, F) {
    F === void 0 && (F = _);
    var D = Object.getOwnPropertyDescriptor(b, _);
    (!D || ("get" in D ? !b.__esModule : D.writable || D.configurable)) && (D = { enumerable: !0, get: function() {
      return b[_];
    } }), Object.defineProperty(T, F, D);
  } : function(T, b, _, F) {
    F === void 0 && (F = _), T[F] = b[_];
  }), r = Pe && Pe.__exportStar || function(T, b) {
    for (var _ in T) _ !== "default" && !Object.prototype.hasOwnProperty.call(b, _) && t(b, T, _);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = kt, i = ue;
  var a = ht;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return a.BaseUpdater;
  } });
  var o = It;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return o.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return o.NoOpLogger;
  } });
  var s = me;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = nn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var d = an;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return d.DebUpdater;
  } });
  var c = on;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var u = sn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return u.RpmUpdater;
  } });
  var p = ln;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return p.MacUpdater;
  } });
  var g = cn;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), r(Nt, e);
  let x;
  function w() {
    if (process.platform === "win32")
      x = new cn.NsisUpdater();
    else if (process.platform === "darwin")
      x = new ln.MacUpdater();
    else {
      x = new nn.AppImageUpdater();
      try {
        const T = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(T))
          return x;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const b = (0, n.readFileSync)(T).toString().trim();
        switch (console.info("Found package-type:", b), b) {
          case "deb":
            x = new an.DebUpdater();
            break;
          case "rpm":
            x = new sn.RpmUpdater();
            break;
          case "pacman":
            x = new on.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (T) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", T.message);
      }
    }
    return x;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => x || w()
  });
})(st);
const YT = "End-Of-Stream";
class Ce extends Error {
  constructor() {
    super(YT), this.name = "EndOfStreamError";
  }
}
class KT extends Error {
  constructor(t = "The operation was aborted") {
    super(t), this.name = "AbortError";
  }
}
class jf {
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
      throw new Ce();
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
        throw new KT();
      const i = await this.readFromStream(t.subarray(n), r);
      if (i === 0)
        break;
      n += i;
    }
    if (!r && n < t.length)
      throw new Ce();
    return n;
  }
}
class JT extends jf {
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
class QT extends JT {
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
class mc extends jf {
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
      throw new Ce();
    return n;
  }
  abort() {
    return this.interrupted = !0, this.reader.cancel();
  }
  async close() {
    await this.abort(), this.reader.releaseLock();
  }
}
function ZT(e) {
  try {
    const t = e.getReader({ mode: "byob" });
    return t instanceof ReadableStreamDefaultReader ? new mc(t) : new QT(t);
  } catch (t) {
    if (t instanceof TypeError)
      return new mc(e.getReader());
    throw t;
  }
}
class Yi {
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
      throw new Ce();
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
      throw new Ce();
    return t.get(n, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async readNumber(t) {
    if (await this.readBuffer(this.numBuffer, { length: t.len }) < t.len)
      throw new Ce();
    return t.get(this.numBuffer, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async peekNumber(t) {
    if (await this.peekBuffer(this.numBuffer, { length: t.len }) < t.len)
      throw new Ce();
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
const e_ = 256e3;
class t_ extends Yi {
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
      throw new Ce();
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
        const o = new Uint8Array(n.length + a);
        return i = await this.peekBuffer(o, { mayBeLess: n.mayBeLess }), t.set(o.subarray(a)), i - a;
      }
      if (a < 0)
        throw new Error("Cannot peek from a negative offset in a stream");
    }
    if (n.length > 0) {
      try {
        i = await this.streamReader.peek(t.subarray(0, n.length), n.mayBeLess);
      } catch (a) {
        if (r != null && r.mayBeLess && a instanceof Ce)
          return 0;
        throw a;
      }
      if (!n.mayBeLess && i < n.length)
        throw new Ce();
    }
    return i;
  }
  async ignore(t) {
    const r = Math.min(e_, t), n = new Uint8Array(r);
    let i = 0;
    for (; i < t; ) {
      const a = t - i, o = await this.readBuffer(n, { length: Math.min(r, a) });
      if (o < 0)
        return o;
      i += o;
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
class r_ extends Yi {
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
      throw new Ce();
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
class n_ extends Yi {
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
      throw new Ce();
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
function i_(e, t) {
  const r = ZT(e), n = t ?? {}, i = n.onClose;
  return n.onClose = async () => {
    if (await r.close(), i)
      return i();
  }, new t_(r, n);
}
function ao(e, t) {
  return new r_(e, t);
}
function a_(e, t) {
  return new n_(e, t);
}
class Xo extends Yi {
  /**
   * Create tokenizer from provided file path
   * @param sourceFilePath File path
   */
  static async fromFile(t) {
    const r = await xp(t, "r"), n = await r.stat();
    return new Xo(r, { fileInfo: { path: t, size: n.size } });
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
      throw new Ce();
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
      throw new Ce();
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
const o_ = Xo.fromFile;
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Ki = function(e, t, r, n, i) {
  var a, o, s = i * 8 - n - 1, l = (1 << s) - 1, d = l >> 1, c = -7, u = r ? i - 1 : 0, p = r ? -1 : 1, g = e[t + u];
  for (u += p, a = g & (1 << -c) - 1, g >>= -c, c += s; c > 0; a = a * 256 + e[t + u], u += p, c -= 8)
    ;
  for (o = a & (1 << -c) - 1, a >>= -c, c += n; c > 0; o = o * 256 + e[t + u], u += p, c -= 8)
    ;
  if (a === 0)
    a = 1 - d;
  else {
    if (a === l)
      return o ? NaN : (g ? -1 : 1) * (1 / 0);
    o = o + Math.pow(2, n), a = a - d;
  }
  return (g ? -1 : 1) * o * Math.pow(2, a - n);
}, Ji = function(e, t, r, n, i, a) {
  var o, s, l, d = a * 8 - i - 1, c = (1 << d) - 1, u = c >> 1, p = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, g = n ? 0 : a - 1, x = n ? 1 : -1, w = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, o = c) : (o = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -o)) < 1 && (o--, l *= 2), o + u >= 1 ? t += p / l : t += p * Math.pow(2, 1 - u), t * l >= 2 && (o++, l /= 2), o + u >= c ? (s = 0, o = c) : o + u >= 1 ? (s = (t * l - 1) * Math.pow(2, i), o = o + u) : (s = t * Math.pow(2, u - 1) * Math.pow(2, i), o = 0)); i >= 8; e[r + g] = s & 255, g += x, s /= 256, i -= 8)
    ;
  for (o = o << i | s, d += i; d > 0; e[r + g] = o & 255, g += x, o /= 256, d -= 8)
    ;
  e[r + g - x] |= w * 128;
};
const oo = {
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
for (const [e, t] of Object.entries(oo))
  ;
function s_(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8":
      return typeof globalThis.TextDecoder < "u" ? new globalThis.TextDecoder("utf-8").decode(e) : l_(e);
    case "utf-16le":
      return c_(e);
    case "ascii":
      return u_(e);
    case "latin1":
    case "iso-8859-1":
      return f_(e);
    case "windows-1252":
      return d_(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function l_(e) {
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
      const i = e[r++] & 63, a = e[r++] & 63, o = e[r++] & 63;
      let s = (n & 7) << 18 | i << 12 | a << 6 | o;
      s -= 65536, t += String.fromCharCode(55296 + (s >> 10 & 1023), 56320 + (s & 1023));
    }
  }
  return t;
}
function c_(e) {
  let t = "";
  for (let r = 0; r < e.length; r += 2)
    t += String.fromCharCode(e[r] | e[r + 1] << 8);
  return t;
}
function u_(e) {
  return String.fromCharCode(...e.map((t) => t & 127));
}
function f_(e) {
  return String.fromCharCode(...e);
}
function d_(e) {
  let t = "";
  for (const r of e)
    r >= 128 && r <= 159 && oo[r] ? t += oo[r] : t += String.fromCharCode(r);
  return t;
}
function W(e) {
  return new DataView(e.buffer, e.byteOffset);
}
const Kt = {
  len: 1,
  get(e, t) {
    return W(e).getUint8(t);
  },
  put(e, t, r) {
    return W(e).setUint8(t, r), t + 1;
  }
}, ie = {
  len: 2,
  get(e, t) {
    return W(e).getUint16(t, !0);
  },
  put(e, t, r) {
    return W(e).setUint16(t, r, !0), t + 2;
  }
}, Xt = {
  len: 2,
  get(e, t) {
    return W(e).getUint16(t);
  },
  put(e, t, r) {
    return W(e).setUint16(t, r), t + 2;
  }
}, Gf = {
  len: 3,
  get(e, t) {
    const r = W(e);
    return r.getUint8(t) + (r.getUint16(t + 1, !0) << 8);
  },
  put(e, t, r) {
    const n = W(e);
    return n.setUint8(t, r & 255), n.setUint16(t + 1, r >> 8, !0), t + 3;
  }
}, zf = {
  len: 3,
  get(e, t) {
    const r = W(e);
    return (r.getUint16(t) << 8) + r.getUint8(t + 2);
  },
  put(e, t, r) {
    const n = W(e);
    return n.setUint16(t, r >> 8), n.setUint8(t + 2, r & 255), t + 3;
  }
}, K = {
  len: 4,
  get(e, t) {
    return W(e).getUint32(t, !0);
  },
  put(e, t, r) {
    return W(e).setUint32(t, r, !0), t + 4;
  }
}, Ti = {
  len: 4,
  get(e, t) {
    return W(e).getUint32(t);
  },
  put(e, t, r) {
    return W(e).setUint32(t, r), t + 4;
  }
}, so = {
  len: 1,
  get(e, t) {
    return W(e).getInt8(t);
  },
  put(e, t, r) {
    return W(e).setInt8(t, r), t + 1;
  }
}, p_ = {
  len: 2,
  get(e, t) {
    return W(e).getInt16(t);
  },
  put(e, t, r) {
    return W(e).setInt16(t, r), t + 2;
  }
}, h_ = {
  len: 2,
  get(e, t) {
    return W(e).getInt16(t, !0);
  },
  put(e, t, r) {
    return W(e).setInt16(t, r, !0), t + 2;
  }
}, m_ = {
  len: 3,
  get(e, t) {
    const r = Gf.get(e, t);
    return r > 8388607 ? r - 16777216 : r;
  },
  put(e, t, r) {
    const n = W(e);
    return n.setUint8(t, r & 255), n.setUint16(t + 1, r >> 8, !0), t + 3;
  }
}, g_ = {
  len: 3,
  get(e, t) {
    const r = zf.get(e, t);
    return r > 8388607 ? r - 16777216 : r;
  },
  put(e, t, r) {
    const n = W(e);
    return n.setUint16(t, r >> 8), n.setUint8(t + 2, r & 255), t + 3;
  }
}, Hf = {
  len: 4,
  get(e, t) {
    return W(e).getInt32(t);
  },
  put(e, t, r) {
    return W(e).setInt32(t, r), t + 4;
  }
}, y_ = {
  len: 4,
  get(e, t) {
    return W(e).getInt32(t, !0);
  },
  put(e, t, r) {
    return W(e).setInt32(t, r, !0), t + 4;
  }
}, qf = {
  len: 8,
  get(e, t) {
    return W(e).getBigUint64(t, !0);
  },
  put(e, t, r) {
    return W(e).setBigUint64(t, r, !0), t + 8;
  }
}, w_ = {
  len: 8,
  get(e, t) {
    return W(e).getBigInt64(t, !0);
  },
  put(e, t, r) {
    return W(e).setBigInt64(t, r, !0), t + 8;
  }
}, x_ = {
  len: 8,
  get(e, t) {
    return W(e).getBigUint64(t);
  },
  put(e, t, r) {
    return W(e).setBigUint64(t, r), t + 8;
  }
}, E_ = {
  len: 8,
  get(e, t) {
    return W(e).getBigInt64(t);
  },
  put(e, t, r) {
    return W(e).setBigInt64(t, r), t + 8;
  }
}, v_ = {
  len: 2,
  get(e, t) {
    return Ki(e, t, !1, 10, this.len);
  },
  put(e, t, r) {
    return Ji(e, r, t, !1, 10, this.len), t + this.len;
  }
}, T_ = {
  len: 2,
  get(e, t) {
    return Ki(e, t, !0, 10, this.len);
  },
  put(e, t, r) {
    return Ji(e, r, t, !0, 10, this.len), t + this.len;
  }
}, __ = {
  len: 4,
  get(e, t) {
    return W(e).getFloat32(t);
  },
  put(e, t, r) {
    return W(e).setFloat32(t, r), t + 4;
  }
}, b_ = {
  len: 4,
  get(e, t) {
    return W(e).getFloat32(t, !0);
  },
  put(e, t, r) {
    return W(e).setFloat32(t, r, !0), t + 4;
  }
}, S_ = {
  len: 8,
  get(e, t) {
    return W(e).getFloat64(t);
  },
  put(e, t, r) {
    return W(e).setFloat64(t, r), t + 8;
  }
}, A_ = {
  len: 8,
  get(e, t) {
    return W(e).getFloat64(t, !0);
  },
  put(e, t, r) {
    return W(e).setFloat64(t, r, !0), t + 8;
  }
}, I_ = {
  len: 10,
  get(e, t) {
    return Ki(e, t, !1, 63, this.len);
  },
  put(e, t, r) {
    return Ji(e, r, t, !1, 63, this.len), t + this.len;
  }
}, C_ = {
  len: 10,
  get(e, t) {
    return Ki(e, t, !0, 63, this.len);
  },
  put(e, t, r) {
    return Ji(e, r, t, !0, 63, this.len), t + this.len;
  }
};
class R_ {
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
class Xf {
  constructor(t) {
    this.len = t;
  }
  get(t, r) {
    return t.subarray(r, r + this.len);
  }
}
class we {
  constructor(t, r) {
    this.len = t, this.encoding = r;
  }
  get(t, r = 0) {
    const n = t.subarray(r, r + this.len);
    return s_(n, this.encoding);
  }
}
class D_ extends we {
  constructor(t) {
    super(t, "windows-1252");
  }
}
const iA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnsiStringType: D_,
  Float16_BE: v_,
  Float16_LE: T_,
  Float32_BE: __,
  Float32_LE: b_,
  Float64_BE: S_,
  Float64_LE: A_,
  Float80_BE: I_,
  Float80_LE: C_,
  INT16_BE: p_,
  INT16_LE: h_,
  INT24_BE: g_,
  INT24_LE: m_,
  INT32_BE: Hf,
  INT32_LE: y_,
  INT64_BE: E_,
  INT64_LE: w_,
  INT8: so,
  IgnoreType: R_,
  StringType: we,
  UINT16_BE: Xt,
  UINT16_LE: ie,
  UINT24_BE: zf,
  UINT24_LE: Gf,
  UINT32_BE: Ti,
  UINT32_LE: K,
  UINT64_BE: x_,
  UINT64_LE: qf,
  UINT8: Kt,
  Uint8ArrayType: Xf
}, Symbol.toStringTag, { value: "Module" })), wr = {
  LocalFileHeader: 67324752,
  DataDescriptor: 134695760,
  CentralFileHeader: 33639248,
  EndOfCentralDirectory: 101010256
}, gc = {
  get(e) {
    return {
      signature: K.get(e, 0),
      compressedSize: K.get(e, 8),
      uncompressedSize: K.get(e, 12)
    };
  },
  len: 16
}, O_ = {
  get(e) {
    const t = ie.get(e, 6);
    return {
      signature: K.get(e, 0),
      minVersion: ie.get(e, 4),
      dataDescriptor: !!(t & 8),
      compressedMethod: ie.get(e, 8),
      compressedSize: K.get(e, 18),
      uncompressedSize: K.get(e, 22),
      filenameLength: ie.get(e, 26),
      extraFieldLength: ie.get(e, 28),
      filename: null
    };
  },
  len: 30
}, P_ = {
  get(e) {
    return {
      signature: K.get(e, 0),
      nrOfThisDisk: ie.get(e, 4),
      nrOfThisDiskWithTheStart: ie.get(e, 6),
      nrOfEntriesOnThisDisk: ie.get(e, 8),
      nrOfEntriesOfSize: ie.get(e, 10),
      sizeOfCd: K.get(e, 12),
      offsetOfStartOfCd: K.get(e, 16),
      zipFileCommentLength: ie.get(e, 20)
    };
  },
  len: 22
}, k_ = {
  get(e) {
    const t = ie.get(e, 8);
    return {
      signature: K.get(e, 0),
      minVersion: ie.get(e, 6),
      dataDescriptor: !!(t & 8),
      compressedMethod: ie.get(e, 10),
      compressedSize: K.get(e, 20),
      uncompressedSize: K.get(e, 24),
      filenameLength: ie.get(e, 28),
      extraFieldLength: ie.get(e, 30),
      fileCommentLength: ie.get(e, 32),
      relativeOffsetOfLocalHeader: K.get(e, 42),
      filename: null
    };
  },
  len: 46
};
function Wf(e) {
  const t = new Uint8Array(K.len);
  return K.put(t, 0, e), t;
}
const nt = Cr("tokenizer:inflate"), Ma = 256 * 1024, N_ = Wf(wr.DataDescriptor), Jn = Wf(wr.EndOfCentralDirectory);
class Wo {
  constructor(t) {
    this.tokenizer = t, this.syncBuffer = new Uint8Array(Ma);
  }
  async isZip() {
    return await this.peekSignature() === wr.LocalFileHeader;
  }
  peekSignature() {
    return this.tokenizer.peekToken(K);
  }
  async findEndOfCentralDirectoryLocator() {
    const t = this.tokenizer, r = Math.min(16 * 1024, t.fileInfo.size), n = this.syncBuffer.subarray(0, r);
    await this.tokenizer.readBuffer(n, { position: t.fileInfo.size - r });
    for (let i = n.length - 4; i >= 0; i--)
      if (n[i] === Jn[0] && n[i + 1] === Jn[1] && n[i + 2] === Jn[2] && n[i + 3] === Jn[3])
        return t.fileInfo.size - r + i;
    return -1;
  }
  async readCentralDirectory() {
    if (!this.tokenizer.supportsRandomAccess()) {
      nt("Cannot reading central-directory without random-read support");
      return;
    }
    nt("Reading central-directory...");
    const t = this.tokenizer.position, r = await this.findEndOfCentralDirectoryLocator();
    if (r > 0) {
      nt("Central-directory 32-bit signature found");
      const n = await this.tokenizer.readToken(P_, r), i = [];
      this.tokenizer.setPosition(n.offsetOfStartOfCd);
      for (let a = 0; a < n.nrOfEntriesOfSize; ++a) {
        const o = await this.tokenizer.readToken(k_);
        if (o.signature !== wr.CentralFileHeader)
          throw new Error("Expected Central-File-Header signature");
        o.filename = await this.tokenizer.readToken(new we(o.filenameLength, "utf-8")), await this.tokenizer.ignore(o.extraFieldLength), await this.tokenizer.ignore(o.fileCommentLength), i.push(o), nt(`Add central-directory file-entry: n=${a + 1}/${i.length}: filename=${i[a].filename}`);
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
      let o;
      if (await this.tokenizer.ignore(i.extraFieldLength), i.dataDescriptor && i.compressedSize === 0) {
        const s = [];
        let l = Ma;
        nt("Compressed-file-size unknown, scanning for next data-descriptor-signature....");
        let d = -1;
        for (; d < 0 && l === Ma; ) {
          l = await this.tokenizer.peekBuffer(this.syncBuffer, { mayBeLess: !0 }), d = F_(this.syncBuffer.subarray(0, l), N_);
          const c = d >= 0 ? d : l;
          if (a.handler) {
            const u = new Uint8Array(c);
            await this.tokenizer.readBuffer(u), s.push(u);
          } else
            await this.tokenizer.ignore(c);
        }
        nt(`Found data-descriptor-signature at pos=${this.tokenizer.position}`), a.handler && await this.inflate(i, $_(s), a.handler);
      } else
        a.handler ? (nt(`Reading compressed-file-data: ${i.compressedSize} bytes`), o = new Uint8Array(i.compressedSize), await this.tokenizer.readBuffer(o), await this.inflate(i, o, a.handler)) : (nt(`Ignoring compressed-file-data: ${i.compressedSize} bytes`), await this.tokenizer.ignore(i.compressedSize));
      if (nt(`Reading data-descriptor at pos=${this.tokenizer.position}`), i.dataDescriptor && (await this.tokenizer.readToken(gc)).signature !== 134695760)
        throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - gc.len}`);
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
          const o = new Uint8Array(n.compressedSize);
          await this.tokenizer.readBuffer(o), await this.inflate(a, o, i.handler);
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
    nt(`Decompress filename=${t.filename}, compressed-size=${r.length}`);
    const i = await Wo.decompressDeflateRaw(r);
    return n(i);
  }
  static async decompressDeflateRaw(t) {
    const r = new ReadableStream({
      start(a) {
        a.enqueue(t), a.close();
      }
    }), n = new DecompressionStream("deflate-raw"), i = r.pipeThrough(n);
    try {
      const o = await new Response(i).arrayBuffer();
      return new Uint8Array(o);
    } catch (a) {
      const o = a instanceof Error ? `Failed to deflate ZIP entry: ${a.message}` : "Unknown decompression error in ZIP entry";
      throw new TypeError(o);
    }
  }
  async readLocalFileHeader() {
    const t = await this.tokenizer.peekToken(K);
    if (t === wr.LocalFileHeader) {
      const r = await this.tokenizer.readToken(O_);
      return r.filename = await this.tokenizer.readToken(new we(r.filenameLength, "utf-8")), r;
    }
    if (t === wr.CentralFileHeader)
      return !1;
    throw t === 3759263696 ? new Error("Encrypted ZIP") : new Error("Unexpected signature");
  }
}
function F_(e, t) {
  const r = e.length, n = t.length;
  if (n > r)
    return -1;
  for (let i = 0; i <= r - n; i++) {
    let a = !0;
    for (let o = 0; o < n; o++)
      if (e[i + o] !== t[o]) {
        a = !1;
        break;
      }
    if (a)
      return i;
  }
  return -1;
}
function $_(e) {
  const t = e.reduce((i, a) => i + a.length, 0), r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    r.set(i, n), n += i.length;
  return r;
}
class L_ {
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
const U_ = Object.prototype.toString, M_ = "[object Uint8Array]";
function B_(e, t, r) {
  return e ? e.constructor === t ? !0 : U_.call(e) === r : !1;
}
function j_(e) {
  return B_(e, Uint8Array, M_);
}
function G_(e) {
  if (!j_(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
new globalThis.TextDecoder("utf8");
function z_(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
new globalThis.TextEncoder();
const H_ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function aA(e) {
  G_(e);
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += H_[e[r]];
  return t;
}
const yc = {
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
function oA(e) {
  if (z_(e), e.length % 2 !== 0)
    throw new Error("Invalid Hex string length.");
  const t = e.length / 2, r = new Uint8Array(t);
  for (let n = 0; n < t; n++) {
    const i = yc[e[n * 2]], a = yc[e[n * 2 + 1]];
    if (i === void 0 || a === void 0)
      throw new Error(`Invalid Hex character encountered at position ${n * 2}`);
    r[n] = i << 4 | a;
  }
  return r;
}
function lo(e) {
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
function q_(e, t) {
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
function X_(e, t = 0) {
  const r = Number.parseInt(new we(6).get(e, 148).replace(/\0.*$/, "").trim(), 8);
  if (Number.isNaN(r))
    return !1;
  let n = 8 * 32;
  for (let i = t; i < t + 148; i++)
    n += e[i];
  for (let i = t + 156; i < t + 512; i++)
    n += e[i];
  return r === n;
}
const W_ = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, V_ = [
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
], Y_ = [
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
], Ba = 4100;
async function Vf(e, t) {
  return new K_(t).fromBuffer(e);
}
function ja(e) {
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
function it(e, t, r) {
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
class K_ {
  constructor(t) {
    // Detections with a high degree of certainty in identifying the correct file type
    rt(this, "detectConfident", async (t) => {
      if (this.buffer = new Uint8Array(Ba), t.fileInfo.size === void 0 && (t.fileInfo.size = Number.MAX_SAFE_INTEGER), this.tokenizer = t, await t.peekBuffer(this.buffer, { length: 32, mayBeLess: !0 }), this.check([66, 77]))
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
        const n = new L_(t).inflate();
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
        const r = await t.readToken(W_);
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
        return await new Wo(t).unzip((n) => {
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
                  r = ja(a);
                },
                stop: !0
              };
            case "[Content_Types].xml":
              return {
                async handler(i) {
                  let a = new TextDecoder("utf-8").decode(i);
                  const o = a.indexOf('.main+xml"');
                  if (o === -1) {
                    const s = "application/vnd.ms-package.3dmanufacturing-3dmodel+xml";
                    a.includes(`ContentType="${s}"`) && (r = ja(s));
                  } else {
                    a = a.slice(0, Math.max(0, o));
                    const s = a.lastIndexOf('"'), l = a.slice(Math.max(0, s + 1));
                    r = ja(l);
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
          if (!(n instanceof Ce))
            throw n;
        }), r ?? {
          ext: "zip",
          mime: "application/zip"
        };
      }
      if (this.checkString("OggS")) {
        await t.ignore(28);
        const r = new Uint8Array(8);
        return await t.readBuffer(r), it(r, [79, 112, 117, 115, 72, 101, 97, 100]) ? {
          ext: "opus",
          mime: "audio/ogg; codecs=opus"
        } : it(r, [128, 116, 104, 101, 111, 114, 97]) ? {
          ext: "ogv",
          mime: "video/ogg"
        } : it(r, [1, 118, 105, 100, 101, 111, 0]) ? {
          ext: "ogm",
          mime: "video/ogg"
        } : it(r, [127, 70, 76, 65, 67]) ? {
          ext: "oga",
          mime: "audio/ogg"
        } : it(r, [83, 112, 101, 101, 120, 32, 32]) ? {
          ext: "spx",
          mime: "audio/ogg"
        } : it(r, [1, 118, 111, 114, 98, 105, 115]) ? {
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
          const s = await t.peekNumber(Kt);
          let l = 128, d = 0;
          for (; !(s & l) && l !== 0; )
            ++d, l >>= 1;
          const c = new Uint8Array(d + 1);
          return await t.readBuffer(c), c;
        }
        async function n() {
          const s = await r(), l = await r();
          l[0] ^= 128 >> l.length - 1;
          const d = Math.min(6, l.length), c = new DataView(s.buffer), u = new DataView(l.buffer, l.length - d, d);
          return {
            id: lo(c),
            len: lo(u)
          };
        }
        async function i(s) {
          for (; s > 0; ) {
            const l = await n();
            if (l.id === 17026)
              return (await t.readToken(new we(l.len))).replaceAll(/\00.*$/g, "");
            await t.ignore(l.len), --s;
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
        const r = new we(4, "latin1").get(this.buffer, 2);
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
        return await t.ignore(8), await t.readToken(new we(13, "ascii")) === "debian-binary" ? {
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
            length: await t.readToken(Hf),
            type: await t.readToken(new we(4, "latin1"))
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
        const r = new we(4, "latin1").get(this.buffer, 8).replace("\0", " ").trim();
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
            size: Number(await t.readToken(qf))
          };
        }
        for (await t.ignore(30); t.position + 24 < t.fileInfo.size; ) {
          const n = await r();
          let i = n.size - 24;
          if (it(n.id, [145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101])) {
            const a = new Uint8Array(16);
            if (i -= await t.readBuffer(a), it(a, [64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43]))
              return {
                ext: "asf",
                mime: "audio/x-ms-asf"
              };
            if (it(a, [192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43]))
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
        switch (await t.ignore(20), await t.readToken(new we(4, "ascii"))) {
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
      if (await t.peekBuffer(this.buffer, { length: Math.min(512, t.fileInfo.size), mayBeLess: !0 }), this.checkString("ustar", { offset: 257 }) && (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 })) || this.check([0, 0, 0, 0, 0, 0], { offset: 257 }) && X_(this.buffer))
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
    rt(this, "detectImprecise", async (t) => {
      if (this.buffer = new Uint8Array(Ba), await t.peekBuffer(this.buffer, { length: Math.min(8, t.fileInfo.size), mayBeLess: !0 }), this.check([0, 0, 1, 186]) || this.check([0, 0, 1, 179]))
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
      return this.fromTokenizer(ao(r, this.tokenizerOptions));
  }
  async fromBlob(t) {
    const r = a_(t, this.tokenizerOptions);
    try {
      return await this.fromTokenizer(r);
    } finally {
      await r.close();
    }
  }
  async fromStream(t) {
    const r = i_(t, this.tokenizerOptions);
    try {
      return await this.fromTokenizer(r);
    } finally {
      await r.close();
    }
  }
  async toDetectionStream(t, r) {
    const { sampleSize: n = Ba } = r;
    let i, a;
    const o = t.getReader({ mode: "byob" });
    try {
      const { value: d, done: c } = await o.read(new Uint8Array(n));
      if (a = d, !c && d)
        try {
          i = await this.fromBuffer(d.subarray(0, n));
        } catch (u) {
          if (!(u instanceof Ce))
            throw u;
          i = void 0;
        }
      a = d;
    } finally {
      o.releaseLock();
    }
    const s = new TransformStream({
      async start(d) {
        d.enqueue(a);
      },
      transform(d, c) {
        c.enqueue(d);
      }
    }), l = t.pipeThrough(s);
    return l.fileType = i, l;
  }
  check(t, r) {
    return it(this.buffer, t, r);
  }
  checkString(t, r) {
    return this.check(q_(t, r == null ? void 0 : r.encoding), r);
  }
  async readTiffTag(t) {
    const r = await this.tokenizer.readToken(t ? Xt : ie);
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
    const r = await this.tokenizer.readToken(t ? Xt : ie);
    for (let n = 0; n < r; ++n) {
      const i = await this.readTiffTag(t);
      if (i)
        return i;
    }
  }
  async readTiffHeader(t) {
    const r = (t ? Xt : ie).get(this.buffer, 2), n = (t ? Ti : K).get(this.buffer, 4);
    if (r === 42) {
      if (n >= 6) {
        if (this.checkString("CR", { offset: 8 }))
          return {
            ext: "cr2",
            mime: "image/x-canon-cr2"
          };
        if (n >= 8) {
          const a = (t ? Xt : ie).get(this.buffer, 8), o = (t ? Xt : ie).get(this.buffer, 10);
          if (a === 28 && o === 254 || a === 31 && o === 11)
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
new Set(V_);
new Set(Y_);
var Vo = {};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
var wc = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g, J_ = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/, Yf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/, Q_ = /\\([\u000b\u0020-\u00ff])/g, Z_ = /([\\"])/g, Kf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
Vo.format = eb;
Vo.parse = tb;
function eb(e) {
  if (!e || typeof e != "object")
    throw new TypeError("argument obj is required");
  var t = e.parameters, r = e.type;
  if (!r || !Kf.test(r))
    throw new TypeError("invalid type");
  var n = r;
  if (t && typeof t == "object")
    for (var i, a = Object.keys(t).sort(), o = 0; o < a.length; o++) {
      if (i = a[o], !Yf.test(i))
        throw new TypeError("invalid parameter name");
      n += "; " + i + "=" + nb(t[i]);
    }
  return n;
}
function tb(e) {
  if (!e)
    throw new TypeError("argument string is required");
  var t = typeof e == "object" ? rb(e) : e;
  if (typeof t != "string")
    throw new TypeError("argument string is required to be a string");
  var r = t.indexOf(";"), n = r !== -1 ? t.slice(0, r).trim() : t.trim();
  if (!Kf.test(n))
    throw new TypeError("invalid media type");
  var i = new ib(n.toLowerCase());
  if (r !== -1) {
    var a, o, s;
    for (wc.lastIndex = r; o = wc.exec(t); ) {
      if (o.index !== r)
        throw new TypeError("invalid parameter format");
      r += o[0].length, a = o[1].toLowerCase(), s = o[2], s.charCodeAt(0) === 34 && (s = s.slice(1, -1), s.indexOf("\\") !== -1 && (s = s.replace(Q_, "$1"))), i.parameters[a] = s;
    }
    if (r !== t.length)
      throw new TypeError("invalid parameter format");
  }
  return i;
}
function rb(e) {
  var t;
  if (typeof e.getHeader == "function" ? t = e.getHeader("content-type") : typeof e.headers == "object" && (t = e.headers && e.headers["content-type"]), typeof t != "string")
    throw new TypeError("content-type header is missing from object");
  return t;
}
function nb(e) {
  var t = String(e);
  if (Yf.test(t))
    return t;
  if (t.length > 0 && !J_.test(t))
    throw new TypeError("invalid parameter value");
  return '"' + t.replace(Z_, "\\$1") + '"';
}
function ib(e) {
  this.parameters = /* @__PURE__ */ Object.create(null), this.type = e;
}
/*!
 * media-typer
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
var ab = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/, ob = sb;
function sb(e) {
  if (!e)
    throw new TypeError("argument string is required");
  if (typeof e != "string")
    throw new TypeError("argument string is required to be a string");
  var t = ab.exec(e.toLowerCase());
  if (!t)
    throw new TypeError("invalid media type");
  var r = t[1], n = t[2], i, a = n.lastIndexOf("+");
  return a !== -1 && (i = n.substr(a + 1), n = n.substr(0, a)), new lb(r, n, i);
}
function lb(e, t, r) {
  this.type = e, this.subtype = t, this.suffix = r;
}
const sA = {
  10: "shot",
  20: "scene",
  30: "track",
  40: "part",
  50: "album",
  60: "edition",
  70: "collection"
}, dt = {
  video: 1,
  audio: 2,
  complex: 3,
  logo: 4,
  subtitle: 17,
  button: 18,
  control: 32
}, cb = {
  [dt.video]: "video",
  [dt.audio]: "audio",
  [dt.complex]: "complex",
  [dt.logo]: "logo",
  [dt.subtitle]: "subtitle",
  [dt.button]: "button",
  [dt.control]: "control"
}, Tn = (e) => class extends Error {
  constructor(r) {
    super(r), this.name = e;
  }
};
class Jf extends Tn("CouldNotDetermineFileTypeError") {
}
class Qf extends Tn("UnsupportedFileTypeError") {
}
class ub extends Tn("UnexpectedFileContentError") {
  constructor(t, r) {
    super(r), this.fileType = t;
  }
  // Override toString to include file type information.
  toString() {
    return `${this.name} (FileType: ${this.fileType}): ${this.message}`;
  }
}
class Yo extends Tn("FieldDecodingError") {
}
class Zf extends Tn("InternalParserError") {
}
const fb = (e) => class extends ub {
  constructor(t) {
    super(e, t);
  }
};
function zr(e, t, r) {
  return (e[t] & 1 << r) !== 0;
}
function xc(e, t, r, n) {
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
function db(e) {
  const t = e.indexOf("\0");
  return t === -1 ? e : e.substr(0, t);
}
function pb(e) {
  const t = e.length;
  if (t & 1)
    throw new Yo("Buffer length must be even");
  for (let r = 0; r < t; r += 2) {
    const n = e[r];
    e[r] = e[r + 1], e[r + 1] = n;
  }
  return e;
}
function co(e, t) {
  if (e[0] === 255 && e[1] === 254)
    return co(e.subarray(2), t);
  if (t === "utf-16le" && e[0] === 254 && e[1] === 255) {
    if (e.length & 1)
      throw new Yo("Expected even number of octets for 16-bit unicode string");
    return co(pb(e), t);
  }
  return new we(e.length, t).get(e, 0);
}
function cA(e) {
  return e = e.replace(/^\x00+/g, ""), e = e.replace(/\x00+$/g, ""), e;
}
function ed(e, t, r, n) {
  const i = t + ~~(r / 8), a = r % 8;
  let o = e[i];
  o &= 255 >> a;
  const s = 8 - a, l = n - s;
  return l < 0 ? o >>= 8 - a - n : l > 0 && (o <<= l, o |= ed(e, t, r + s, l)), o;
}
function uA(e, t, r) {
  return ed(e, t, r, 1) === 1;
}
function hb(e) {
  const t = [];
  for (let r = 0, n = e.length; r < n; r++) {
    const i = Number(e.charCodeAt(r)).toString(16);
    t.push(i.length === 1 ? `0${i}` : i);
  }
  return t.join(" ");
}
function mb(e) {
  return 10 * Math.log10(e);
}
function gb(e) {
  return 10 ** (e / 10);
}
function yb(e) {
  const t = e.split(" ").map((r) => r.trim().toLowerCase());
  if (t.length >= 1) {
    const r = Number.parseFloat(t[0]);
    return t.length === 2 && t[1] === "db" ? {
      dB: r,
      ratio: gb(r)
    } : {
      dB: mb(r),
      ratio: r
    };
  }
}
function fA(e) {
  if (e.length === 0)
    throw new Error("decodeUintBE: empty Uint8Array");
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength);
  return lo(t);
}
const dA = {
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
}, td = {
  lyrics: 1
}, rd = {
  notSynchronized: 0,
  milliseconds: 2
}, wb = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, pA = {
  len: 10,
  get: (e, t) => ({
    // ID3v2/file identifier   "ID3"
    fileIdentifier: new we(3, "ascii").get(e, t),
    // ID3v2 versionIndex
    version: {
      major: so.get(e, t + 3),
      revision: so.get(e, t + 4)
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
    size: wb.get(e, t + 6)
  })
}, hA = {
  len: 10,
  get: (e, t) => ({
    // Extended header size
    size: Ti.get(e, t),
    // Extended Flags
    extendedFlags: Xt.get(e, t + 4),
    // Size of padding
    sizeOfPadding: Ti.get(e, t + 6),
    // CRC data present
    crcDataPresent: zr(e, t + 4, 31)
  })
}, xb = {
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
}, Eb = {
  len: 4,
  get: (e, t) => ({
    encoding: xb.get(e, t),
    language: new we(3, "latin1").get(e, t + 1)
  })
}, mA = {
  len: 6,
  get: (e, t) => {
    const r = Eb.get(e, t);
    return {
      encoding: r.encoding,
      language: r.language,
      timeStampFormat: Kt.get(e, t + 4),
      contentType: Kt.get(e, t + 5)
    };
  }
}, N = {
  multiple: !1
}, _i = {
  year: N,
  track: N,
  disk: N,
  title: N,
  artist: N,
  artists: { multiple: !0, unique: !0 },
  albumartist: N,
  album: N,
  date: N,
  originaldate: N,
  originalyear: N,
  releasedate: N,
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
  grouping: N,
  subtitle: { multiple: !0 },
  discsubtitle: N,
  totaltracks: N,
  totaldiscs: N,
  compilation: N,
  rating: { multiple: !0 },
  bpm: N,
  mood: N,
  media: N,
  catalognumber: { multiple: !0, unique: !0 },
  tvShow: N,
  tvShowSort: N,
  tvSeason: N,
  tvEpisode: N,
  tvEpisodeId: N,
  tvNetwork: N,
  podcast: N,
  podcasturl: N,
  releasestatus: N,
  releasetype: { multiple: !0 },
  releasecountry: N,
  script: N,
  language: N,
  copyright: N,
  license: N,
  encodedby: N,
  encodersettings: N,
  gapless: N,
  barcode: N,
  isrc: { multiple: !0 },
  asin: N,
  musicbrainz_recordingid: N,
  musicbrainz_trackid: N,
  musicbrainz_albumid: N,
  musicbrainz_artistid: { multiple: !0 },
  musicbrainz_albumartistid: { multiple: !0 },
  musicbrainz_releasegroupid: N,
  musicbrainz_workid: N,
  musicbrainz_trmid: N,
  musicbrainz_discid: N,
  acoustid_id: N,
  acoustid_fingerprint: N,
  musicip_puid: N,
  musicip_fingerprint: N,
  website: N,
  "performer:instrument": { multiple: !0, unique: !0 },
  averageLevel: N,
  peakLevel: N,
  notes: { multiple: !0, unique: !1 },
  key: N,
  originalalbum: N,
  originalartist: N,
  discogs_artist_id: { multiple: !0, unique: !0 },
  discogs_release_id: N,
  discogs_label_id: N,
  discogs_master_release_id: N,
  discogs_votes: N,
  discogs_rating: N,
  replaygain_track_peak: N,
  replaygain_track_gain: N,
  replaygain_album_peak: N,
  replaygain_album_gain: N,
  replaygain_track_minmax: N,
  replaygain_album_minmax: N,
  replaygain_undo: N,
  description: { multiple: !0 },
  longDescription: N,
  category: { multiple: !0 },
  hdVideo: N,
  keywords: { multiple: !0 },
  movement: N,
  movementIndex: N,
  movementTotal: N,
  podcastId: N,
  showMovement: N,
  stik: N,
  playCounter: N
};
function vb(e) {
  return _i[e] && !_i[e].multiple;
}
function Tb(e) {
  return !_i[e].multiple || _i[e].unique || !1;
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
const _b = {
  title: "title",
  artist: "artist",
  album: "album",
  year: "year",
  comment: "comment",
  track: "track",
  genre: "genre"
};
class bb extends ze {
  constructor() {
    super(["ID3v1"], _b);
  }
}
class _n extends ze {
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
const Sb = {
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
class Ko extends _n {
  static toRating(t) {
    return {
      source: t.email,
      rating: t.rating > 0 ? (t.rating - 1) / 254 * ze.maxRatingScore : void 0
    };
  }
  constructor() {
    super(["ID3v2.3", "ID3v2.4"], Sb);
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
          n.owner_identifier === "http://musicbrainz.org" && (t.id += `:${n.owner_identifier}`, t.value = co(n.identifier, "latin1"));
        }
        break;
      case "PRIV":
        {
          const n = t.value;
          switch (n.owner_identifier) {
            case "AverageLevel":
            case "PeakValue":
              t.id += `:${n.owner_identifier}`, t.value = n.data.length === 4 ? K.get(n.data, 0) : null, t.value === null && r.addWarning("Failed to parse PRIV:PeakValue");
              break;
            default:
              r.addWarning(`Unknown PRIV owner-identifier: ${n.data}`);
          }
        }
        break;
      case "POPM":
        t.value = Ko.toRating(t.value);
        break;
    }
  }
}
const Ab = {
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
class Jo extends ze {
  static toRating(t) {
    return {
      rating: Number.parseFloat(t + 1) / 5
    };
  }
  constructor() {
    super(["asf"], Ab);
  }
  postMap(t) {
    switch (t.id) {
      case "WM/SharedUserRating": {
        const r = t.id.split(":");
        t.value = Jo.toRating(t.value), t.id = r[0];
        break;
      }
    }
  }
}
const Ib = {
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
class Cb extends _n {
  constructor() {
    super(["ID3v2.2"], Ib);
  }
}
const Rb = {
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
class Db extends _n {
  constructor() {
    super(["APEv2"], Rb);
  }
}
const Ob = {
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
}, Pb = "iTunes";
class Ec extends _n {
  constructor() {
    super([Pb], Ob);
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
const kb = {
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
class bi extends ze {
  static toRating(t, r, n) {
    return {
      source: t ? t.toLowerCase() : void 0,
      rating: Number.parseFloat(r) / n * ze.maxRatingScore
    };
  }
  constructor() {
    super(["vorbis"], kb);
  }
  postMap(t) {
    if (t.id === "RATING")
      t.value = bi.toRating(void 0, t.value, 100);
    else if (t.id.indexOf("RATING:") === 0) {
      const r = t.id.split(":");
      t.value = bi.toRating(r[1], t.value, 1), t.id = r[0];
    }
  }
}
const Nb = {
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
class Fb extends ze {
  constructor() {
    super(["exif"], Nb);
  }
}
const $b = {
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
class Lb extends _n {
  constructor() {
    super(["matroska"], $b);
  }
}
const Ub = {
  NAME: "title",
  AUTH: "artist",
  "(c) ": "copyright",
  ANNO: "comment"
};
class Mb extends ze {
  constructor() {
    super(["AIFF"], Ub);
  }
}
class Bb {
  constructor() {
    this.tagMappers = {}, [
      new bb(),
      new Cb(),
      new Ko(),
      new Ec(),
      new Ec(),
      new bi(),
      new Db(),
      new Jo(),
      new Fb(),
      new Lb(),
      new Mb()
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
    throw new Zf(`No generic tag mapper defined for tag-format: ${t}`);
  }
  registerTagMapper(t) {
    for (const r of t.tagTypes)
      this.tagMappers[r] = t;
  }
}
const uo = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;
function jb(e) {
  return uo.test(e) ? zb(e) : Gb(e);
}
function Gb(e) {
  return {
    contentType: td.lyrics,
    timeStampFormat: rd.notSynchronized,
    text: e.trim(),
    syncText: []
  };
}
function zb(e) {
  const t = e.split(`
`), r = [];
  for (const n of t) {
    const i = n.match(uo);
    if (i) {
      const a = Number.parseInt(i[1], 10), o = Number.parseInt(i[2], 10), s = i[3].length === 3 ? Number.parseInt(i[3], 10) : Number.parseInt(i[3], 10) * 10, l = (a * 60 + o) * 1e3 + s, d = n.replace(uo, "").trim();
      r.push({ timestamp: l, text: d });
    }
  }
  return {
    contentType: td.lyrics,
    timeStampFormat: rd.milliseconds,
    text: r.map((n) => n.text).join(`
`),
    syncText: r
  };
}
const jt = Cr("music-metadata:collector"), Hb = ["matroska", "APEv2", "vorbis", "ID3v2.4", "ID3v2.3", "ID3v2.2", "exif", "asf", "iTunes", "AIFF", "ID3v1"];
class qb {
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
    }, this.commonOrigin = {}, this.originPriority = {}, this.tagMapper = new Bb(), this.opts = t;
    let r = 1;
    for (const n of Hb)
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
    jt(`streamInfo: type=${t.type ? cb[t.type] : "?"}, codec=${t.codecName}`), this.format.trackInfo.push(t);
  }
  setFormat(t, r) {
    var n;
    jt(`format: ${t} = ${r}`), this.format[t] = r, (n = this.opts) != null && n.observer && this.opts.observer({ metadata: this, tag: { type: "format", id: t, value: r } });
  }
  setAudioOnly() {
    this.setFormat("hasAudio", !0), this.setFormat("hasVideo", !1);
  }
  async addTag(t, r, n) {
    jt(`tag ${t}.${r} = ${n}`), this.native[t] || (this.format.tagTypes.push(t), this.native[t] = []), this.native[t].push({ id: r, value: n }), await this.toCommon(t, r, n);
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
          const n = (this.common.artists || []).concat([r.value]), a = { id: "artist", value: Xb(n) };
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
        r.value = yb(r.value);
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
        typeof r.value == "string" && (r.value = jb(r.value));
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
        const r = await Vf(Uint8Array.from(t.data));
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
    jt(`common.${r.id} = ${r.value}`);
    const n = this.commonOrigin[r.id] || 1e3, i = this.originPriority[t];
    if (vb(r.id))
      if (i <= n)
        this.common[r.id] = r.value, this.commonOrigin[r.id] = i;
      else
        return jt(`Ignore native tag (singleton): ${t}.${r.id} = ${r.value}`);
    else if (i === n)
      !Tb(r.id) || this.common[r.id].indexOf(r.value) === -1 ? this.common[r.id].push(r.value) : jt(`Ignore duplicate value: ${t}.${r.id} = ${r.value}`);
    else if (i < n)
      this.common[r.id] = [r.value], this.commonOrigin[r.id] = i;
    else
      return jt(`Ignore native tag (list): ${t}.${r.id} = ${r.value}`);
    (a = this.opts) != null && a.observer && this.opts.observer({ metadata: this, tag: { type: "common", id: r.id, value: r.value } });
  }
}
function Xb(e) {
  return e.length > 2 ? `${e.slice(0, e.length - 1).join(", ")} & ${e[e.length - 1]}` : e.join(" & ");
}
const Wb = {
  parserType: "mpeg",
  extensions: [".mp2", ".mp3", ".m2a", ".aac", "aacp"],
  mimeTypes: ["audio/mpeg", "audio/mp3", "audio/aacs", "audio/aacp"],
  async load() {
    return (await import("./MpegParser-BscBIbMN.js")).MpegParser;
  }
}, Vb = {
  parserType: "apev2",
  extensions: [".ape"],
  mimeTypes: ["audio/ape", "audio/monkeys-audio"],
  async load() {
    return (await Promise.resolve().then(() => SS)).APEv2Parser;
  }
}, Yb = {
  parserType: "asf",
  extensions: [".asf"],
  mimeTypes: ["audio/ms-wma", "video/ms-wmv", "audio/ms-asf", "video/ms-asf", "application/vnd.ms-asf"],
  async load() {
    return (await import("./AsfParser-CcDiZtyr.js")).AsfParser;
  }
}, Kb = {
  parserType: "dsdiff",
  extensions: [".dff"],
  mimeTypes: ["audio/dsf", "audio/dsd"],
  async load() {
    return (await import("./DsdiffParser-B4E368J_.js")).DsdiffParser;
  }
}, Jb = {
  parserType: "aiff",
  extensions: [".aif", "aiff", "aifc"],
  mimeTypes: ["audio/aiff", "audio/aif", "audio/aifc", "application/aiff"],
  async load() {
    return (await import("./AiffParser-DPdbGyLr.js")).AIFFParser;
  }
}, Qb = {
  parserType: "dsf",
  extensions: [".dsf"],
  mimeTypes: ["audio/dsf"],
  async load() {
    return (await import("./DsfParser-Cb3sbTOT.js")).DsfParser;
  }
}, Zb = {
  parserType: "flac",
  extensions: [".flac"],
  mimeTypes: ["audio/flac"],
  async load() {
    return (await import("./FlacParser-y7fMqlqr.js").then((e) => e.d)).FlacParser;
  }
}, eS = {
  parserType: "matroska",
  extensions: [".mka", ".mkv", ".mk3d", ".mks", "webm"],
  mimeTypes: ["audio/matroska", "video/matroska", "audio/webm", "video/webm"],
  async load() {
    return (await import("./MatroskaParser-D7mB6Wt7.js")).MatroskaParser;
  }
}, tS = {
  parserType: "mp4",
  extensions: [".mp4", ".m4a", ".m4b", ".m4pa", "m4v", "m4r", "3gp", ".mov", ".movie", ".qt"],
  mimeTypes: ["audio/mp4", "audio/m4a", "video/m4v", "video/mp4", "video/quicktime"],
  async load() {
    return (await import("./MP4Parser-DI3YP-EC.js")).MP4Parser;
  }
}, rS = {
  parserType: "musepack",
  extensions: [".mpc"],
  mimeTypes: ["audio/musepack"],
  async load() {
    return (await import("./MusepackParser-B16L31T2.js")).MusepackParser;
  }
}, nS = {
  parserType: "ogg",
  extensions: [".ogg", ".ogv", ".oga", ".ogm", ".ogx", ".opus", ".spx"],
  mimeTypes: ["audio/ogg", "audio/opus", "audio/speex", "video/ogg"],
  // RFC 7845, RFC 6716, RFC 5574
  async load() {
    return (await import("./OggParser-DzlbE0x7.js")).OggParser;
  }
}, iS = {
  parserType: "wavpack",
  extensions: [".wv", ".wvp"],
  mimeTypes: ["audio/wavpack"],
  async load() {
    return (await import("./WavPackParser-Hp-0zpGB.js")).WavPackParser;
  }
}, aS = {
  parserType: "riff",
  extensions: [".wav", "wave", ".bwf"],
  mimeTypes: ["audio/vnd.wave", "audio/wav", "audio/wave"],
  async load() {
    return (await import("./WaveParser--SPS-7cq.js")).WaveParser;
  }
}, Gt = Cr("music-metadata:parser:factory");
function oS(e) {
  const t = Vo.parse(e), r = ob(t.type);
  return {
    type: r.type,
    subtype: r.subtype,
    suffix: r.suffix,
    parameters: t.parameters
  };
}
class sS {
  constructor() {
    this.parsers = [], [
      Zb,
      Wb,
      Vb,
      tS,
      eS,
      aS,
      nS,
      Yb,
      Jb,
      iS,
      rS,
      Qb,
      Kb
    ].forEach((t) => {
      this.registerParser(t);
    });
  }
  registerParser(t) {
    this.parsers.push(t);
  }
  async parse(t, r, n) {
    if (t.supportsRandomAccess() ? (Gt("tokenizer supports random-access, scanning for appending headers"), await RS(t, n)) : Gt("tokenizer does not support random-access, cannot scan for appending headers"), !r) {
      const s = new Uint8Array(4100);
      if (t.fileInfo.mimeType && (r = this.findLoaderForContentType(t.fileInfo.mimeType)), !r && t.fileInfo.path && (r = this.findLoaderForExtension(t.fileInfo.path)), !r) {
        Gt("Guess parser on content..."), await t.peekBuffer(s, { mayBeLess: !0 });
        const l = await Vf(s, { mpegOffsetTolerance: 10 });
        if (!l || !l.mime)
          throw new Jf("Failed to determine audio format");
        if (Gt(`Guessed file type is mime=${l.mime}, extension=${l.ext}`), r = this.findLoaderForContentType(l.mime), !r)
          throw new Qf(`Guessed MIME-type not supported: ${l.mime}`);
      }
    }
    Gt(`Loading ${r.parserType} parser...`);
    const i = new qb(n), a = await r.load(), o = new a(i, t, n ?? {});
    return Gt(`Parser ${r.parserType} loaded`), await o.parse(), i.format.trackInfo && (i.format.hasAudio === void 0 && i.setFormat("hasAudio", !!i.format.trackInfo.find((s) => s.type === dt.audio)), i.format.hasVideo === void 0 && i.setFormat("hasVideo", !!i.format.trackInfo.find((s) => s.type === dt.video))), i.toCommonMetadata();
  }
  /**
   * @param filePath - Path, filename or extension to audio file
   * @return Parser submodule name
   */
  findLoaderForExtension(t) {
    if (!t)
      return;
    const r = lS(t).toLocaleLowerCase() || t;
    return this.parsers.find((n) => n.extensions.indexOf(r) !== -1);
  }
  findLoaderForContentType(t) {
    let r;
    if (!t)
      return;
    try {
      r = oS(t);
    } catch {
      Gt(`Invalid HTTP Content-Type header value: ${t}`);
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
function lS(e) {
  const t = e.lastIndexOf(".");
  return t === -1 ? "" : e.substring(t);
}
class nd {
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
const id = {
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
}, ad = {};
for (const [e, t] of Object.entries(id))
  ad[t] = Number.parseInt(e, 10);
let Qn, Zn;
function cS() {
  if (!(typeof globalThis.TextDecoder > "u"))
    return Qn ?? (Qn = new globalThis.TextDecoder("utf-8"));
}
function uS() {
  if (!(typeof globalThis.TextEncoder > "u"))
    return Zn ?? (Zn = new globalThis.TextEncoder());
}
const Zt = 32 * 1024;
function Qi(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = cS();
      return r ? r.decode(e) : dS(e);
    }
    case "utf-16le":
      return pS(e);
    case "us-ascii":
    case "ascii":
      return hS(e);
    case "latin1":
    case "iso-8859-1":
      return mS(e);
    case "windows-1252":
      return gS(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function fS(e = "", t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = uS();
      return r ? r.encode(e) : yS(e);
    }
    case "utf-16le":
      return wS(e);
    case "us-ascii":
    case "ascii":
      return xS(e);
    case "latin1":
    case "iso-8859-1":
      return ES(e);
    case "windows-1252":
      return vS(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function dS(e) {
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
      const a = e[n++] & 63, o = e[n++] & 63;
      r += String.fromCharCode((i & 15) << 12 | a << 6 | o);
    } else {
      const a = e[n++] & 63, o = e[n++] & 63, s = e[n++] & 63;
      let l = (i & 7) << 18 | a << 12 | o << 6 | s;
      l -= 65536, r += String.fromCharCode(55296 + (l >> 10 & 1023), 56320 + (l & 1023));
    }
    r.length >= Zt && (t.push(r), r = "");
  }
  return r && t.push(r), t.join("");
}
function pS(e) {
  const t = e.length & -2;
  if (t === 0)
    return "";
  const r = [], n = Zt;
  for (let i = 0; i < t; ) {
    const a = Math.min(n, t - i >> 1), o = new Array(a);
    for (let s = 0; s < a; s++, i += 2)
      o[s] = e[i] | e[i + 1] << 8;
    r.push(String.fromCharCode.apply(null, o));
  }
  return r.join("");
}
function hS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Zt) {
    const n = Math.min(e.length, r + Zt), i = new Array(n - r);
    for (let a = r, o = 0; a < n; a++, o++)
      i[o] = e[a] & 127;
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function mS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Zt) {
    const n = Math.min(e.length, r + Zt), i = new Array(n - r);
    for (let a = r, o = 0; a < n; a++, o++)
      i[o] = e[a];
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function gS(e) {
  const t = [];
  let r = "";
  for (let n = 0; n < e.length; n++) {
    const i = e[n], a = i >= 128 && i <= 159 ? id[i] : void 0;
    r += a ?? String.fromCharCode(i), r.length >= Zt && (t.push(r), r = "");
  }
  return r && t.push(r), t.join("");
}
function yS(e) {
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
function wS(e) {
  const t = new Uint8Array(e.length * 2);
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r), i = r * 2;
    t[i] = n & 255, t[i + 1] = n >>> 8;
  }
  return t;
}
function xS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r) & 127;
  return t;
}
function ES(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r) & 255;
  return t;
}
function vS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++) {
    const n = e[r], i = n.charCodeAt(0);
    if (i <= 255) {
      t[r] = i;
      continue;
    }
    const a = ad[n];
    t[r] = a !== void 0 ? a : 63;
  }
  return t;
}
const TS = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/, od = {
  len: 4,
  get: (e, t) => {
    const r = Qi(e.subarray(t, t + od.len), "latin1");
    if (!r.match(TS))
      throw new Yo(`FourCC contains invalid characters: ${hb(r)} "${r}"`);
    return r;
  },
  put: (e, t, r) => {
    const n = fS(r, "latin1");
    if (n.length !== 4)
      throw new Zf("Invalid length");
    return e.set(n, t), t + 4;
  }
}, ei = {
  text_utf8: 0,
  binary: 1,
  external_info: 2,
  reserved: 3
}, vc = {
  len: 52,
  get: (e, t) => ({
    // should equal 'MAC '
    ID: od.get(e, t),
    // versionIndex number * 1000 (3.81 = 3810) (remember that 4-byte alignment causes this to take 4-bytes)
    version: K.get(e, t + 4) / 1e3,
    // the number of descriptor bytes (allows later expansion of this header)
    descriptorBytes: K.get(e, t + 8),
    // the number of header APE_HEADER bytes
    headerBytes: K.get(e, t + 12),
    // the number of header APE_HEADER bytes
    seekTableBytes: K.get(e, t + 16),
    // the number of header data bytes (from original file)
    headerDataBytes: K.get(e, t + 20),
    // the number of bytes of APE frame data
    apeFrameDataBytes: K.get(e, t + 24),
    // the high order number of APE frame data bytes
    apeFrameDataBytesHigh: K.get(e, t + 28),
    // the terminating data of the file (not including tag data)
    terminatingDataBytes: K.get(e, t + 32),
    // the MD5 hash of the file (see notes for usage... it's a little tricky)
    fileMD5: new Xf(16).get(e, t + 36)
  })
}, _S = {
  len: 24,
  get: (e, t) => ({
    // the compression level (see defines I.E. COMPRESSION_LEVEL_FAST)
    compressionLevel: ie.get(e, t),
    // any format flags (for future use)
    formatFlags: ie.get(e, t + 2),
    // the number of audio blocks in one frame
    blocksPerFrame: K.get(e, t + 4),
    // the number of audio blocks in the final frame
    finalFrameBlocks: K.get(e, t + 8),
    // the total number of frames
    totalFrames: K.get(e, t + 12),
    // the bits per sample (typically 16)
    bitsPerSample: ie.get(e, t + 16),
    // the number of channels (1 or 2)
    channel: ie.get(e, t + 18),
    // the sample rate (typically 44100)
    sampleRate: K.get(e, t + 20)
  })
}, Ge = {
  len: 32,
  get: (e, t) => ({
    // should equal 'APETAGEX'
    ID: new we(8, "ascii").get(e, t),
    // equals CURRENT_APE_TAG_VERSION
    version: K.get(e, t + 8),
    // the complete size of the tag, including this footer (excludes header)
    size: K.get(e, t + 12),
    // the number of fields in the tag
    fields: K.get(e, t + 16),
    // reserved for later use (must be zero),
    flags: sd(K.get(e, t + 20))
  })
}, Ga = {
  len: 8,
  get: (e, t) => ({
    // Length of assigned value in bytes
    size: K.get(e, t),
    // reserved for later use (must be zero),
    flags: sd(K.get(e, t + 4))
  })
};
function sd(e) {
  return {
    containsHeader: ti(e, 31),
    containsFooter: ti(e, 30),
    isHeader: ti(e, 29),
    readOnly: ti(e, 0),
    dataType: (e & 6) >> 1
  };
}
function ti(e, t) {
  return (e & 1 << t) !== 0;
}
const Et = Cr("music-metadata:parser:APEv2"), Tc = "APEv2", _c = "APETAGEX";
class ci extends fb("APEv2") {
}
function bS(e, t, r) {
  return new At(e, t, r).tryParseApeHeader();
}
class At extends nd {
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
    const n = new Uint8Array(Ge.len), i = t.position;
    if (r <= Ge.len) {
      Et(`Offset is too small to read APE footer: offset=${r}`);
      return;
    }
    if (r > Ge.len) {
      await t.readBuffer(n, { position: r - Ge.len }), t.setPosition(i);
      const a = Ge.get(n, 0);
      if (a.ID === "APETAGEX")
        return a.flags.isHeader ? Et(`APE Header found at offset=${r - Ge.len}`) : (Et(`APE Footer found at offset=${r - Ge.len}`), r -= a.size), { footer: a, offset: r };
    }
  }
  static parseTagFooter(t, r, n) {
    const i = Ge.get(r, r.length - Ge.len);
    if (i.ID !== _c)
      throw new ci("Unexpected APEv2 Footer ID preamble value");
    return ao(r), new At(t, ao(r), n).parseTags(i);
  }
  /**
   * Parse APEv1 / APEv2 header if header signature found
   */
  async tryParseApeHeader() {
    if (this.tokenizer.fileInfo.size && this.tokenizer.fileInfo.size - this.tokenizer.position < Ge.len) {
      Et("No APEv2 header found, end-of-file reached");
      return;
    }
    const t = await this.tokenizer.peekToken(Ge);
    if (t.ID === _c)
      return await this.tokenizer.ignore(Ge.len), this.parseTags(t);
    if (Et(`APEv2 header not found at offset=${this.tokenizer.position}`), this.tokenizer.fileInfo.size) {
      const r = this.tokenizer.fileInfo.size - this.tokenizer.position, n = new Uint8Array(r);
      return await this.tokenizer.readBuffer(n), At.parseTagFooter(this.metadata, n, this.options);
    }
  }
  async parse() {
    const t = await this.tokenizer.readToken(vc);
    if (t.ID !== "MAC ")
      throw new ci("Unexpected descriptor ID");
    this.ape.descriptor = t;
    const r = t.descriptorBytes - vc.len, n = await (r > 0 ? this.parseDescriptorExpansion(r) : this.parseHeader());
    return this.metadata.setAudioOnly(), await this.tokenizer.ignore(n.forwardBytes), this.tryParseApeHeader();
  }
  async parseTags(t) {
    const r = new Uint8Array(256);
    let n = t.size - Ge.len;
    Et(`Parse APE tags at offset=${this.tokenizer.position}, size=${n}`);
    for (let i = 0; i < t.fields; i++) {
      if (n < Ga.len) {
        this.metadata.addWarning(`APEv2 Tag-header: ${t.fields - i} items remaining, but no more tag data to read.`);
        break;
      }
      const a = await this.tokenizer.readToken(Ga);
      n -= Ga.len + a.size, await this.tokenizer.peekBuffer(r, { length: Math.min(r.length, n) });
      let o = xc(r, 0, r.length);
      const s = await this.tokenizer.readToken(new we(o, "ascii"));
      switch (await this.tokenizer.ignore(1), n -= s.length + 1, a.flags.dataType) {
        case ei.text_utf8: {
          const d = (await this.tokenizer.readToken(new we(a.size, "utf8"))).split(/\x00/g);
          await Promise.all(d.map((c) => this.metadata.addTag(Tc, s, c)));
          break;
        }
        case ei.binary:
          if (this.options.skipCovers)
            await this.tokenizer.ignore(a.size);
          else {
            const l = new Uint8Array(a.size);
            await this.tokenizer.readBuffer(l), o = xc(l, 0, l.length);
            const d = Qi(l.subarray(0, o), "utf-8"), c = l.subarray(o + 1);
            await this.metadata.addTag(Tc, s, {
              description: d,
              data: c
            });
          }
          break;
        case ei.external_info:
          Et(`Ignore external info ${s}`), await this.tokenizer.ignore(a.size);
          break;
        case ei.reserved:
          Et(`Ignore external info ${s}`), this.metadata.addWarning(`APEv2 header declares a reserved datatype for "${s}"`), await this.tokenizer.ignore(a.size);
          break;
      }
    }
  }
  async parseDescriptorExpansion(t) {
    return await this.tokenizer.ignore(t), this.parseHeader();
  }
  async parseHeader() {
    const t = await this.tokenizer.readToken(_S);
    if (this.metadata.setFormat("lossless", !0), this.metadata.setFormat("container", "Monkey's Audio"), this.metadata.setFormat("bitsPerSample", t.bitsPerSample), this.metadata.setFormat("sampleRate", t.sampleRate), this.metadata.setFormat("numberOfChannels", t.channel), this.metadata.setFormat("duration", At.calculateDuration(t)), !this.ape.descriptor)
      throw new ci("Missing APE descriptor");
    return {
      forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes
    };
  }
}
const SS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  APEv2Parser: At,
  ApeContentError: ci,
  tryParseApeHeader: bS
}, Symbol.toStringTag, { value: "Module" })), ri = Cr("music-metadata:parser:ID3v1"), bc = [
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
], ni = {
  len: 128,
  /**
   * @param buf Buffer possibly holding the 128 bytes ID3v1.1 metadata header
   * @param off Offset in buffer in bytes
   * @returns ID3v1.1 header if first 3 bytes equals 'TAG', otherwise null is returned
   */
  get: (e, t) => {
    const r = new fr(3).get(e, t);
    return r === "TAG" ? {
      header: r,
      title: new fr(30).get(e, t + 3),
      artist: new fr(30).get(e, t + 33),
      album: new fr(30).get(e, t + 63),
      year: new fr(4).get(e, t + 93),
      comment: new fr(28).get(e, t + 97),
      // ID3v1.1 separator for track
      zeroByte: Kt.get(e, t + 127),
      // track: ID3v1.1 field added by Michael Mutschler
      track: Kt.get(e, t + 126),
      genre: Kt.get(e, t + 127)
    } : null;
  }
};
class fr {
  constructor(t) {
    this.len = t, this.stringType = new we(t, "latin1");
  }
  get(t, r) {
    let n = this.stringType.get(t, r);
    return n = db(n), n = n.trim(), n.length > 0 ? n : void 0;
  }
}
class ld extends nd {
  constructor(t, r, n) {
    super(t, r, n), this.apeHeader = n.apeHeader;
  }
  static getGenre(t) {
    if (t < bc.length)
      return bc[t];
  }
  async parse() {
    if (!this.tokenizer.fileInfo.size) {
      ri("Skip checking for ID3v1 because the file-size is unknown");
      return;
    }
    this.apeHeader && (this.tokenizer.ignore(this.apeHeader.offset - this.tokenizer.position), await new At(this.metadata, this.tokenizer, this.options).parseTags(this.apeHeader.footer));
    const t = this.tokenizer.fileInfo.size - ni.len;
    if (this.tokenizer.position > t) {
      ri("Already consumed the last 128 bytes");
      return;
    }
    const r = await this.tokenizer.readToken(ni, t);
    if (r) {
      ri("ID3v1 header found at: pos=%s", this.tokenizer.fileInfo.size - ni.len);
      const n = ["title", "artist", "album", "comment", "track", "year"];
      for (const a of n)
        r[a] && r[a] !== "" && await this.addTag(a, r[a]);
      const i = ld.getGenre(r.genre);
      i && await this.addTag("genre", i);
    } else
      ri("ID3v1 header not found at: pos=%s", this.tokenizer.fileInfo.size - ni.len);
  }
  async addTag(t, r) {
    await this.metadata.addTag("ID3v1", t, r);
  }
}
async function AS(e) {
  if (e.fileInfo.size >= 128) {
    const t = new Uint8Array(3), r = e.position;
    return await e.readBuffer(t, { position: e.fileInfo.size - 128 }), e.setPosition(r), Qi(t, "latin1") === "TAG";
  }
  return !1;
}
const IS = "LYRICS200";
async function CS(e) {
  const t = e.fileInfo.size;
  if (t >= 143) {
    const r = new Uint8Array(15), n = e.position;
    await e.readBuffer(r, { position: t - 143 }), e.setPosition(n);
    const i = Qi(r, "latin1");
    if (i.substring(6) === IS)
      return Number.parseInt(i.substring(0, 6), 10) + 15;
  }
  return 0;
}
async function RS(e, t = {}) {
  let r = e.fileInfo.size;
  if (await AS(e)) {
    r -= 128;
    const n = await CS(e);
    r -= n;
  }
  t.apeHeader = await At.findApeFooterOffset(e, r);
}
const Sc = Cr("music-metadata:parser");
async function DS(e, t = {}) {
  Sc(`parseFile: ${e}`);
  const r = await o_(e), n = new sS();
  try {
    const i = n.findLoaderForExtension(e);
    i || Sc("Parser could not be determined by file extension");
    try {
      return await n.parse(r, i, t);
    } catch (a) {
      throw (a instanceof Jf || a instanceof Qf) && (a.message += `: ${e}`), a;
    }
  } finally {
    await r.close();
  }
}
class OS {
  constructor() {
    rt(this, "client", null);
    rt(this, "player", Sp());
    rt(this, "currentResource", null);
    rt(this, "currentConnection", null);
    rt(this, "isConnected", !1);
    rt(this, "currentGuildId", null);
    rt(this, "currentChannelId", null);
    this.player.on("error", (t) => {
      console.error("[DiscordBot] Audio Player Error:", t.message);
    }), this.player.on(ir.Playing, () => {
      console.log("[DiscordBot] Audio Player Playing");
    }), this.player.on(ir.Idle, () => {
      console.log("[DiscordBot] Audio Player Idle");
    });
  }
  async login(t) {
    return this.client && (await this.disconnect(), await this.client.destroy()), this.client = new bp({
      intents: [
        ys.Guilds,
        ys.GuildVoiceStates
      ]
    }), new Promise((r, n) => {
      if (!this.client) return n("Client init failed");
      const i = setTimeout(() => {
        n(new Error("Login timed out"));
      }, 1e4);
      this.client.once("ready", async (a) => {
        clearTimeout(i), console.log(`[DiscordBot] Ready! Logged in as ${a.user.tag}`), this.isConnected = !0, r({
          username: a.user.tag,
          avatar: a.user.avatarURL()
        });
      }), this.client.login(t).catch((a) => {
        clearTimeout(i), n(a);
      });
    });
  }
  getGuilds() {
    if (!this.client || !this.isConnected) throw new Error("Bot not connected");
    return this.client.guilds.cache.map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.iconURL(),
      memberCount: t.memberCount
    })).sort((t, r) => t.name.localeCompare(r.name));
  }
  getChannels(t) {
    if (!this.client || !this.isConnected) throw new Error("Bot not connected");
    const r = this.client.guilds.cache.get(t);
    if (!r) throw new Error("Guild not found");
    return r.channels.cache.filter((i) => i.type === ws.GuildVoice).map((i) => ({
      id: i.id,
      name: i.name,
      userLimit: i.userLimit,
      members: i.members.map((a) => a.user.tag)
      // Preview who is there
    })).sort((i, a) => i.name.localeCompare(a.name));
  }
  async joinChannel(t, r) {
    if (!this.client || !this.isConnected) throw new Error("Bot not connected");
    const n = this.client.guilds.cache.get(t);
    if (!n) throw new Error("Guild not found");
    const i = n.channels.cache.get(r);
    if (!i || i.type !== ws.GuildVoice) throw new Error("Invalid channel");
    try {
      return this.currentConnection = Ap({
        channelId: r,
        guildId: t,
        adapterCreator: n.voiceAdapterCreator
        // Type cast often needed with strict TS
      }), this.currentConnection.subscribe(this.player), this.currentGuildId = t, this.currentChannelId = r, console.log(`[DiscordBot] Joined channel ${i.name} in ${n.name}`), !0;
    } catch (a) {
      throw console.error("[DiscordBot] Join Error:", a), a;
    }
  }
  async leaveChannel() {
    return this.currentConnection ? (this.currentConnection.destroy(), this.currentConnection = null, this.currentGuildId = null, this.currentChannelId = null, !0) : !1;
  }
  async disconnect() {
    this.stop(), await this.leaveChannel(), this.client && (await this.client.destroy(), this.client = null, this.isConnected = !1);
  }
  getStatus() {
    var t, r, n, i, a, o, s, l, d;
    return {
      isConnected: this.isConnected,
      username: ((r = (t = this.client) == null ? void 0 : t.user) == null ? void 0 : r.tag) || null,
      avatar: ((i = (n = this.client) == null ? void 0 : n.user) == null ? void 0 : i.avatarURL()) || null,
      currentGuildId: this.currentGuildId,
      currentChannelId: this.currentChannelId,
      currentGuildName: ((o = (a = this.client) == null ? void 0 : a.guilds.cache.get(this.currentGuildId)) == null ? void 0 : o.name) || null,
      currentChannelName: ((d = (l = (s = this.client) == null ? void 0 : s.guilds.cache.get(this.currentGuildId)) == null ? void 0 : l.channels.cache.get(this.currentChannelId)) == null ? void 0 : d.name) || null
    };
  }
  // Play local file - using explicit FFmpeg spawn for reliability
  async playFile(t, r) {
    var n, i, a, o;
    try {
      if (console.log(`[DiscordBot] Playing file: ${t}`), !this.currentConnection)
        throw new Error("No active voice connection. Please join a channel first.");
      const s = this.currentConnection.state.status;
      if (console.log(`[DiscordBot] Connection state: ${s}`), s === "destroyed" || s === "disconnected")
        throw new Error(`Voice connection is ${s}. Cannot play audio.`);
      if (!r) {
        console.warn("[DiscordBot] No FFmpeg path provided, using fallback direct resource");
        const T = sa(t, {
          metadata: { title: t },
          inlineVolume: !0
        });
        this.currentResource = T, (n = T.volume) == null || n.setVolume(1), this.player.play(T);
        return;
      }
      const { spawn: l } = await import("node:child_process"), d = [
        "-i",
        t,
        "-analyzeduration",
        "0",
        "-loglevel",
        "0",
        "-f",
        "s16le",
        "-ar",
        "48000",
        "-ac",
        "2",
        "pipe:1"
      ];
      console.log(`[DiscordBot] Spawning FFmpeg: ${r} ${d.join(" ")}`);
      const c = l(r, d);
      let u = !1;
      c.on("error", (T) => {
        console.error("[DiscordBot] FFmpeg Spawn Error:", T);
      }), c.on("close", (T) => {
        console.log(`[DiscordBot] FFmpeg process exited with code ${T}`);
      }), (i = c.stderr) == null || i.on("data", (T) => {
        const b = T.toString();
        console.log(`[DiscordBot] FFmpeg: ${b}`);
      }), (a = c.stdout) == null || a.on("data", () => {
        u || (console.log("[DiscordBot] FFmpeg audio stream started"), u = !0);
      });
      const p = sa(c.stdout, {
        inputType: Ip.Raw,
        metadata: {
          title: t
        },
        inlineVolume: !0
      });
      this.currentResource = p, (o = p.volume) == null || o.setVolume(1), console.log("[DiscordBot] Audio resource created, starting playback"), this.player.play(p);
      const g = () => {
        console.log("[DiscordBot] ✓ Audio player is now playing");
      }, x = () => {
        console.log("[DiscordBot] Audio player became idle");
      }, w = (T) => {
        console.error("[DiscordBot] Audio player error:", T);
      };
      this.player.removeAllListeners(ir.Playing), this.player.removeAllListeners(ir.Idle), this.player.removeAllListeners("error"), this.player.once(ir.Playing, g), this.player.once(ir.Idle, x), this.player.once("error", w);
    } catch (s) {
      throw console.error("[DiscordBot] Play File Error:", s), s;
    }
  }
  // Play Stream (from ytdl for example)
  // Note: If resource is a Readable stream
  async playStream(t) {
    var r;
    try {
      console.log("[DiscordBot] Playing stream");
      const n = sa(t, {
        inlineVolume: !0
      });
      this.currentResource = n, (r = n.volume) == null || r.setVolume(1), this.player.play(n);
    } catch (n) {
      console.error("[DiscordBot] Play Stream Error:", n);
    }
  }
  pause() {
    this.player.pause();
  }
  resume() {
    this.player.unpause();
  }
  stop() {
    this.player.stop();
  }
  setVolume(t) {
    const r = Math.max(0, Math.min(100, t)) / 100;
    return console.log(`[DiscordBot] Setting volume to ${r}`), this.currentResource && this.currentResource.volume ? (this.currentResource.volume.setVolume(r), !0) : !1;
  }
}
const cd = ii(import.meta.url);
let fo = cd("ffmpeg-static");
Ke.isPackaged && (fo = fo.replace("app.asar", "app.asar.unpacked"));
function PS(e) {
  return new Promise((t) => {
    _p(`powershell -ExecutionPolicy Bypass -File "${e}"`, (r, n) => {
      if (r) {
        t("unknown");
        return;
      }
      t(n.trim());
    });
  });
}
st.autoUpdater.allowPrerelease = !0;
const kS = Ke.requestSingleInstanceLock();
kS ? Ke.on("second-instance", () => {
  ee && (ee.isMinimized() && ee.restore(), ee.focus());
}) : Ke.quit();
const ud = Oe.dirname(wp(import.meta.url));
process.env.APP_ROOT = Oe.join(ud, "..");
const po = process.env.VITE_DEV_SERVER_URL, gA = Oe.join(process.env.APP_ROOT, "dist-electron"), fd = Oe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = po ? Oe.join(process.env.APP_ROOT, "public") : fd;
let ee;
function dd() {
  ee = new Ac({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: Oe.join(process.env.VITE_PUBLIC, "logo.png"),
    titleBarStyle: "hidden",
    // Custom title bar for premium look
    titleBarOverlay: {
      color: "#00000000",
      symbolColor: "#ffffff",
      height: 30
    },
    webPreferences: {
      preload: Oe.join(ud, "preload.mjs"),
      webSecurity: !1,
      // simplified for local file access in dev
      backgroundThrottling: !1
    }
  }), ee.webContents.on("did-finish-load", () => {
    ee == null || ee.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), po ? ee.loadURL(po) : ee.loadFile(Oe.join(fd, "index.html"));
}
Ke.on("window-all-closed", () => {
  process.platform !== "darwin" && (Ke.quit(), ee = null);
});
Ke.on("activate", () => {
  Ac.getAllWindows().length === 0 && dd();
});
st.autoUpdater.on("checking-for-update", () => {
  ee == null || ee.webContents.send("update-status", { status: "checking" });
});
st.autoUpdater.on("update-available", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "available", info: e });
});
st.autoUpdater.on("update-not-available", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "not-available", info: e });
});
st.autoUpdater.on("error", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "error", error: e.message });
});
st.autoUpdater.on("download-progress", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "downloading", progress: e });
});
st.autoUpdater.on("update-downloaded", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "downloaded", info: e }), new yp({
    title: "NeonWave 更新",
    body: "新版本已下載完成，將於重啟後自動安裝。",
    icon: Oe.join(process.env.VITE_PUBLIC, "logo.png")
  }).show();
});
Ke.whenReady().then(() => {
  process.platform === "win32" && Ke.setAppUserModelId("NeonWave"), dd();
  const e = new OS();
  le.handle("discord:login", async (n, i) => await e.login(i)), le.handle("discord:getGuilds", () => e.getGuilds()), le.handle("discord:getChannels", (n, i) => e.getChannels(i)), le.handle("discord:join", async (n, i, a) => await e.joinChannel(i, a)), le.handle("discord:leave", async () => await e.leaveChannel()), le.handle("discord:play", async (n, i) => await e.playFile(i, fo)), le.handle("discord:stop", () => e.stop()), le.handle("discord:pause", () => e.pause()), le.handle("discord:resume", () => e.resume()), le.handle("discord:setVolume", (n, i) => e.setVolume(i)), le.handle("discord:status", () => e.getStatus()), le.handle("dialog:openDirectory", async () => {
    const { canceled: n, filePaths: i } = await gs.showOpenDialog(ee, {
      properties: ["openDirectory"]
    });
    return n ? null : i[0];
  }), le.handle("files:listMusic", async (n, i) => {
    if (!i) return [];
    try {
      const a = await Nn.readdir(i), o = [".mp3", ".wav", ".wma", ".m4a", ".flac", ".ogg", ".mp4", ".mov", ".wmv", ".avi"];
      return (await Promise.all(a.map(async (l) => {
        const d = Oe.join(i, l), c = Oe.extname(l).toLowerCase();
        if (!o.includes(c)) return null;
        try {
          const u = await Nn.stat(d);
          return {
            fullPath: d,
            mtime: u.mtime.getTime()
          };
        } catch {
          return null;
        }
      }))).filter((l) => l !== null).sort((l, d) => d.mtime - l.mtime).map((l) => l.fullPath);
    } catch (a) {
      return console.error("Error reading directory:", a), [];
    }
  }), le.handle("files:readBuffer", async (n, i) => {
    try {
      return await Nn.readFile(i);
    } catch (a) {
      return console.error("Error reading file:", a), null;
    }
  }), le.handle("files:getMetadata", async (n, i) => {
    try {
      const a = await DS(i);
      let o = null;
      if (a.common.picture && a.common.picture.length > 0) {
        const s = a.common.picture[0];
        o = `data:${s.format};base64,${Buffer.from(s.data).toString("base64")}`;
      }
      return {
        title: a.common.title,
        artist: a.common.artist,
        album: a.common.album,
        artwork: o,
        duration: a.format.duration,
        codec: a.format.codec,
        bitrate: a.format.bitrate,
        sampleRate: a.format.sampleRate
      };
    } catch {
      return null;
    }
  }), le.handle("app:active-window", async () => {
    const n = Oe.join(process.env.APP_ROOT, "scripts/get-active-window.ps1");
    return await PS(n);
  });
  const t = ii(import.meta.url)("yt-dlp-wrap").default, r = async () => {
    const n = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp", i = Oe.join(Ke.getPath("userData"), n);
    try {
      await Nn.access(i);
    } catch {
      console.log("Downloading yt-dlp binary..."), await t.downloadFromGithub(i), console.log("Downloaded yt-dlp to", i);
    }
    return new t(i);
  };
  le.handle("search:youtube", async (n, i) => {
    try {
      return (await (await r()).execPromise([
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
  }), le.handle("download:youtube", async (n, i, a, o) => {
    try {
      const s = await r(), l = ii(import.meta.url)("ffmpeg-static").replace("app.asar", "app.asar.unpacked");
      let d = a.replace(/[\\/:*?"<>|]/g, "_").trim();
      const { filePath: c } = await gs.showSaveDialog(ee, {
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
        o && (g.push("--parse-metadata", `${o}:%(artist)s`), g.push("--parse-metadata", `${o}:%(album_artist)s`)), a && g.push("--parse-metadata", `${a}:%(title)s`);
        const x = s.exec(g);
        x.on("progress", () => {
        }), x.on("error", (w) => {
          console.error("yt-dlp error:", w), p(new Error(`下載錯誤: ${w.message}`));
        }), x.on("close", () => {
          u(c);
        });
      }) : null;
    } catch (s) {
      throw console.error("Download fatal error:", s), new Error(s.message);
    }
  }), le.handle("search:artistImage", async (n, i) => {
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
      const o = `https://itunes.apple.com/search?term=${encodeURIComponent(i)}&media=music&entity=album&limit=1`, s = await fetch(o);
      if (s.ok) {
        const l = await s.json();
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
  }), le.handle("search:lyrics", async (n, i, a, o, s) => {
    try {
      const l = ii(import.meta.url)("get-artist-title");
      console.log(`[Lyrics] Search Request: Title="${i}", Artist="${a}", Duration=${s}`);
      const d = (D) => {
        if (!D) return "";
        let k = D;
        k = k.replace(/『[^』]*』/g, "").replace(/「[^」」]*」/g, "");
        const H = [
          "official",
          "music video",
          "preview",
          "trailer",
          "teaser",
          "lyric",
          "lyrics",
          "sub",
          "vietsub",
          "pinyin",
          "engsub",
          "動態歌詞",
          "动态歌词",
          "歌詞",
          "歌词",
          "字幕",
          "concert",
          "stage",
          "performance",
          "現場",
          "现场",
          "cover",
          "remix",
          "medley",
          "live",
          "version",
          "ver",
          "版",
          "翻唱",
          "原唱",
          "ost",
          "soundtrack",
          "theme song",
          "op",
          "ed",
          "hd",
          "hq",
          "sq",
          "4k",
          "1080p",
          "hi-res",
          "pure",
          "full",
          "complete",
          "純享",
          "纯享",
          "feat",
          "ft",
          "合唱",
          "prod",
          "presents",
          "好聲音",
          "好声音",
          "歌手",
          "聲生不息",
          "声生不息",
          "天賜的聲音",
          "天赐的声音",
          "蒙面唱將",
          "蒙面唱将",
          "我們的歌",
          "我们的歌",
          "時光音樂會",
          "时光音乐会",
          "mangotv",
          "call me by fire",
          "乘風破浪",
          "披荊斬棘"
        ], q = (U) => H.some((M) => U.toLowerCase().includes(M)), te = (U, M, J) => {
          const R = (P) => "\\" + P, I = new RegExp(`${R(M)}([^${R(J)}]*)?${R(J)}`, "gi");
          return U.replace(I, (P, S) => !S || q(S) ? " " : " " + S + " ");
        };
        return k = te(k, "(", ")"), k = te(k, "（", "）"), k = te(k, "[", "]"), k = te(k, "【", "】"), k = te(k, "{", "}"), k = te(k, "《", "》"), [
          "Official Music Video",
          "Official Lyric Video",
          "Official Video",
          "Official Audio",
          "Official MV",
          "Music Video",
          "Lyric Video",
          "Theme Song",
          "Ending Theme",
          "Opening Theme",
          "Dynamic Lyrics"
        ].forEach((U) => {
          const M = new RegExp(U.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          k = k.replace(M, " ");
        }), [
          "official",
          "mv",
          "lyric",
          "lyrics",
          "video",
          "hd",
          "hq",
          "sq",
          "4k",
          "live",
          "cover",
          "remix",
          "feat",
          "ft",
          "mangotv",
          "動態歌詞",
          "单纯",
          "純享",
          "纯享",
          "vietsub",
          "pinyin"
        ].forEach((U) => {
          /^[a-z0-9]+$/i.test(U) ? k = k.replace(new RegExp(`\\b${U}\\b`, "gi"), " ") : k = k.replace(new RegExp(U, "gi"), " ");
        }), k = k.replace(/[:"'_\|\.,!@#$%^&*+=?\/\\♪♫~`\-]/g, " "), k.replace(/\s+/g, " ").trim();
      }, c = (D, k) => k ? Math.abs(D - k) : 0, u = async (D, k) => {
        try {
          const H = `https://lrclib.net/api/search?q=${encodeURIComponent(D)}`, q = await fetch(H);
          if (!q.ok) return [];
          const te = await q.json();
          return Array.isArray(te) ? te.filter((y) => y.syncedLyrics && y.syncedLyrics.length > 0).map((y) => ({
            source: "LRCLib",
            id: y.id,
            track: y.trackName,
            artist: y.artistName,
            duration: y.duration,
            // in seconds
            lyrics: y.syncedLyrics,
            diff: k ? c(y.duration, k) : 0
          })) : [];
        } catch (H) {
          return console.error("LRCLib Error:", H), [];
        }
      }, p = async (D, k) => {
        try {
          const H = `https://music.163.com/api/search/get/web?s=${encodeURIComponent(D)}&type=1&offset=0&total=true&limit=5`, q = await fetch(H, {
            headers: { Referer: "https://music.163.com/", Cookie: "appver=2.0.2" }
          });
          if (!q.ok) return [];
          const te = await q.json();
          if (!te.result || !te.result.songs) return [];
          let y = te.result.songs.map((R) => {
            var I, P;
            return {
              id: R.id,
              track: R.name,
              artist: ((P = (I = R.artists) == null ? void 0 : I[0]) == null ? void 0 : P.name) || "Unknown",
              duration: R.duration / 1e3,
              // ms to s
              diff: k ? c(R.duration / 1e3, k) : 0
            };
          });
          if (k && (y = y.filter((R) => R.diff <= 5), y.sort((R, I) => R.diff - I.diff)), y.length === 0) return [];
          const j = y[0], U = `https://music.163.com/api/song/lyric?id=${j.id}&lv=1&kv=1&tv=-1`, J = await (await fetch(U, {
            headers: { Referer: "https://music.163.com/", Cookie: "appver=2.0.2" }
          })).json();
          if (J.lrc && J.lrc.lyric)
            return [{
              source: "Netease",
              id: j.id,
              track: j.track,
              artist: j.artist,
              duration: j.duration,
              lyrics: J.lrc.lyric,
              diff: j.diff
            }];
        } catch (H) {
          console.error("Netease Error:", H);
        }
        return [];
      }, g = (D) => {
        if (!D) return null;
        try {
          return cd("opencc-js").Converter({ from: "cn", to: "tw" })(D);
        } catch {
          return D;
        }
      };
      let x = [];
      if (i && a) {
        const D = `${i} ${a}`;
        console.log(`[Lyrics] Strategy A: ${D}`);
        const [k, H] = await Promise.all([
          u(D, s),
          p(D, s)
        ]);
        x.push(...k, ...H);
      }
      const w = d(i), T = d(a);
      if (w && (w !== i || T !== a)) {
        const D = `${w} ${T}`;
        console.log(`[Lyrics] Strategy B: ${D}`);
        const [k, H] = await Promise.all([
          u(D, s),
          p(D, s)
        ]);
        x.push(...k, ...H);
      }
      if (o) {
        let D = Oe.basename(o, Oe.extname(o));
        const k = D.match(/(.+?)《(.+?)》(.*)/);
        if (k) {
          const te = k[1], y = k[2], j = d(te).replace(/合唱/g, "").trim(), U = d(y);
          if (U) {
            const M = `${U} ${j}`;
            console.log(`[Lyrics] Strategy C-0 (Variety Pattern): ${M}`), x.push(...await u(M, s)), x.push(...await p(M, s)), j.length > 0 && (console.log(`[Lyrics] Strategy C-0 (Title + Duration): ${U}`), x.push(...await u(U, s)), x.push(...await p(U, s)));
          }
        }
        const H = l(D.replace(/_/g, " "));
        if (H && H.length === 2) {
          const [te, y] = H, j = `${y} ${te}`;
          console.log(`[Lyrics] Strategy C-1 (Parsed): ${j}`), x.push(...await u(j, s)), x.push(...await p(j, s));
        }
        const q = d(D);
        console.log(`[Lyrics] Strategy C-2 (Raw Cleaned): ${q}`), x.push(...await u(q, s)), x.push(...await p(q, s));
      }
      if (x.length === 0)
        return console.log("[Lyrics] No candidates found."), null;
      const b = /* @__PURE__ */ new Map();
      x.forEach((D) => {
        const k = `${D.source}-${D.id}`;
        b.has(k) || b.set(k, D);
      });
      let _ = Array.from(b.values());
      if (s && s > 0) {
        const D = _.filter((k) => k.diff <= 4);
        if (D.length > 0)
          console.log(`[Lyrics] Calibration: Found ${D.length} strict duration matches.`), _ = D;
        else {
          const k = _.filter((H) => H.diff <= 10);
          k.length > 0 ? (console.log(`[Lyrics] Calibration: Found ${k.length} lenient duration matches.`), _ = k) : console.log(`[Lyrics] Calibration: No duration matches found. Closest is ${Math.min(..._.map((H) => H.diff))}s off.`);
        }
      }
      _.sort((D, k) => Math.abs(D.diff - k.diff) > 0.5 ? D.diff - k.diff : 0);
      const F = _[0];
      return console.log(`[Lyrics] Selected: ${F.track} (${F.artist}) [${F.source}] Diff=${F.diff.toFixed(2)}s`), g(F.lyrics);
    } catch (l) {
      return console.error("Error fetching lyrics:", l), null;
    }
  }), le.handle("update:check", () => {
    st.autoUpdater.checkForUpdates();
  }), le.handle("update:install", () => {
    st.autoUpdater.quitAndInstall(!0, !0);
  }), le.handle("app:version", () => Ke.getVersion());
});
export {
  dA as A,
  nd as B,
  zf as C,
  iA as D,
  Ce as E,
  od as F,
  Qi as G,
  bc as H,
  p_ as I,
  bS as J,
  db as K,
  pA as L,
  ld as M,
  Gf as N,
  xb as O,
  xc as P,
  fA as Q,
  Eb as R,
  we as S,
  dt as T,
  Ti as U,
  mA as V,
  hA as W,
  wb as X,
  po as Y,
  gA as Z,
  fd as _,
  Xt as a,
  Kt as b,
  Cr as c,
  Xf as d,
  co as e,
  K as f,
  ed as g,
  oA as h,
  uA as i,
  qf as j,
  ie as k,
  zr as l,
  fb as m,
  E_ as n,
  ao as o,
  w_ as p,
  y_ as q,
  S_ as r,
  cA as s,
  __ as t,
  aA as u,
  x_ as v,
  sA as w,
  Hf as x,
  g_ as y,
  so as z
};
