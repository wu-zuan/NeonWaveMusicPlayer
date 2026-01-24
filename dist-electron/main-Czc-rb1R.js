var mp = Object.defineProperty;
var gp = (e, t, r) => t in e ? mp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var ut = (e, t, r) => gp(e, typeof t != "symbol" ? t + "" : t, r);
import Jt, { app as Ke, BrowserWindow as Ac, Notification as yp, ipcMain as de, dialog as po } from "electron";
import { createRequire as ni } from "node:module";
import { fileURLToPath as xp } from "node:url";
import Oe from "node:path";
import kn, { open as wp } from "node:fs/promises";
import Pt from "fs";
import Ep from "constants";
import cn from "stream";
import us from "util";
import Ic from "assert";
import ce from "path";
import bi from "child_process";
import Cc from "events";
import un from "crypto";
import Rc from "tty";
import Si from "os";
import br from "url";
import vp from "string_decoder";
import Dc from "zlib";
import Tp from "http";
import { exec as _p } from "node:child_process";
import { Client as bp, GatewayIntentBits as ho, ChannelType as mo } from "discord.js";
import { createAudioPlayer as Sp, AudioPlayerStatus as go, joinVoiceChannel as Ap, createAudioResource as yo } from "@discordjs/voice";
var Pe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ip(e) {
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
var wt = Ep, Cp = process.cwd, ii = null, Rp = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return ii || (ii = Cp.call(process)), ii;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var xo = process.chdir;
  process.chdir = function(e) {
    ii = null, xo.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, xo);
}
var Dp = Op;
function Op(e) {
  wt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = a(e.chown), e.fchown = a(e.fchown), e.lchown = a(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = o(e.stat), e.fstat = o(e.fstat), e.lstat = o(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, u, p) {
    p && process.nextTick(p);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, u, p, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), Rp === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function u(p, g, w) {
      var x = Date.now(), T = 0;
      c(p, g, function b(_) {
        if (_ && (_.code === "EACCES" || _.code === "EPERM" || _.code === "EBUSY") && Date.now() - x < 6e4) {
          setTimeout(function() {
            e.stat(g, function(F, D) {
              F && F.code === "ENOENT" ? c(p, g, b) : w(_);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        w && w(_);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function u(p, g, w, x, T, b) {
      var _;
      if (b && typeof b == "function") {
        var F = 0;
        _ = function(D, k, H) {
          if (D && D.code === "EAGAIN" && F < 10)
            return F++, c.call(e, p, g, w, x, T, _);
          b.apply(this, arguments);
        };
      }
      return c.call(e, p, g, w, x, T, _);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(u, p, g, w, x) {
      for (var T = 0; ; )
        try {
          return c.call(e, u, p, g, w, x);
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
        wt.O_WRONLY | wt.O_SYMLINK,
        p,
        function(w, x) {
          if (w) {
            g && g(w);
            return;
          }
          c.fchmod(x, p, function(T) {
            c.close(x, function(b) {
              g && g(T || b);
            });
          });
        }
      );
    }, c.lchmodSync = function(u, p) {
      var g = c.openSync(u, wt.O_WRONLY | wt.O_SYMLINK, p), w = !0, x;
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
    wt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(u, p, g, w) {
      c.open(u, wt.O_SYMLINK, function(x, T) {
        if (x) {
          w && w(x);
          return;
        }
        c.futimes(T, p, g, function(b) {
          c.close(T, function(_) {
            w && w(b || _);
          });
        });
      });
    }, c.lutimesSync = function(u, p, g) {
      var w = c.openSync(u, wt.O_SYMLINK), x, T = !0;
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
var wo = cn.Stream, Pp = kp;
function kp(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    wo.call(this);
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
    wo.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var Np = $p, Fp = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function $p(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Fp(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var le = Pt, Lp = Dp, Up = Pp, Mp = Np, Nn = us, _e, ci;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (_e = Symbol.for("graceful-fs.queue"), ci = Symbol.for("graceful-fs.previous")) : (_e = "___graceful-fs.queue", ci = "___graceful-fs.previous");
function Bp() {
}
function Oc(e, t) {
  Object.defineProperty(e, _e, {
    get: function() {
      return t;
    }
  });
}
var Vt = Bp;
Nn.debuglog ? Vt = Nn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Vt = function() {
  var e = Nn.format.apply(Nn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!le[_e]) {
  var jp = Pe[_e] || [];
  Oc(le, jp), le.close = function(e) {
    function t(r, n) {
      return e.call(le, r, function(i) {
        i || Eo(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, ci, {
      value: e
    }), t;
  }(le.close), le.closeSync = function(e) {
    function t(r) {
      e.apply(le, arguments), Eo();
    }
    return Object.defineProperty(t, ci, {
      value: e
    }), t;
  }(le.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Vt(le[_e]), Ic.equal(le[_e].length, 0);
  });
}
Pe[_e] || Oc(Pe, le[_e]);
var $e = fs(Mp(le));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !le.__patched && ($e = fs(le), le.__patched = !0);
function fs(e) {
  Lp(e), e.gracefulify = fs, e.createReadStream = k, e.createWriteStream = H;
  var t = e.readFile;
  e.readFile = r;
  function r(y, j, U) {
    return typeof j == "function" && (U = j, j = null), M(y, j, U);
    function M(J, R, I, P) {
      return t(J, R, function(S) {
        S && (S.code === "EMFILE" || S.code === "ENFILE") ? ir([M, [J, R, I], S, P || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(y, j, U, M) {
    return typeof U == "function" && (M = U, U = null), J(y, j, U, M);
    function J(R, I, P, S, $) {
      return n(R, I, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([J, [R, I, P, S], O, $ || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  var a = e.appendFile;
  a && (e.appendFile = s);
  function s(y, j, U, M) {
    return typeof U == "function" && (M = U, U = null), J(y, j, U, M);
    function J(R, I, P, S, $) {
      return a(R, I, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([J, [R, I, P, S], O, $ || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  var o = e.copyFile;
  o && (e.copyFile = l);
  function l(y, j, U, M) {
    return typeof U == "function" && (M = U, U = 0), J(y, j, U, M);
    function J(R, I, P, S, $) {
      return o(R, I, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([J, [R, I, P, S], O, $ || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
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
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? ir([
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
    var p = Up(e);
    b = p.ReadStream, F = p.WriteStream;
  }
  var g = e.ReadStream;
  g && (b.prototype = Object.create(g.prototype), b.prototype.open = _);
  var w = e.WriteStream;
  w && (F.prototype = Object.create(w.prototype), F.prototype.open = D), Object.defineProperty(e, "ReadStream", {
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
    return this instanceof F ? (w.apply(this, arguments), this) : F.apply(Object.create(F.prototype), arguments);
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
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([J, [R, I, P, S], O, $ || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  return e;
}
function ir(e) {
  Vt("ENQUEUE", e[0].name, e[1]), le[_e].push(e), ds();
}
var Fn;
function Eo() {
  for (var e = Date.now(), t = 0; t < le[_e].length; ++t)
    le[_e][t].length > 2 && (le[_e][t][3] = e, le[_e][t][4] = e);
  ds();
}
function ds() {
  if (clearTimeout(Fn), Fn = void 0, le[_e].length !== 0) {
    var e = le[_e].shift(), t = e[0], r = e[1], n = e[2], i = e[3], a = e[4];
    if (i === void 0)
      Vt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Vt("TIMEOUT", t.name, r);
      var s = r.pop();
      typeof s == "function" && s.call(null, n);
    } else {
      var o = Date.now() - a, l = Math.max(a - i, 1), d = Math.min(l * 1.2, 100);
      o >= d ? (Vt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : le[_e].push(e);
    }
    Fn === void 0 && (Fn = setTimeout(ds, 0));
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
})(er);
var ps = {}, Pc = {};
const Gp = ce;
Pc.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Gp.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const kc = er, { checkPath: Nc } = Pc, Fc = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
ps.makeDir = async (e, t) => (Nc(e), kc.mkdir(e, {
  mode: Fc(t),
  recursive: !0
}));
ps.makeDirSync = (e, t) => (Nc(e), kc.mkdirSync(e, {
  mode: Fc(t),
  recursive: !0
}));
const zp = Fe.fromPromise, { makeDir: Hp, makeDirSync: sa } = ps, oa = zp(Hp);
var ot = {
  mkdirs: oa,
  mkdirsSync: sa,
  // alias
  mkdirp: oa,
  mkdirpSync: sa,
  ensureDir: oa,
  ensureDirSync: sa
};
const qp = Fe.fromPromise, $c = er;
function Xp(e) {
  return $c.access(e).then(() => !0).catch(() => !1);
}
var tr = {
  pathExists: qp(Xp),
  pathExistsSync: $c.existsSync
};
const xr = $e;
function Wp(e, t, r, n) {
  xr.open(e, "r+", (i, a) => {
    if (i) return n(i);
    xr.futimes(a, t, r, (s) => {
      xr.close(a, (o) => {
        n && n(s || o);
      });
    });
  });
}
function Vp(e, t, r) {
  const n = xr.openSync(e, "r+");
  return xr.futimesSync(n, t, r), xr.closeSync(n);
}
var Lc = {
  utimesMillis: Wp,
  utimesMillisSync: Vp
};
const Er = er, we = ce, Yp = us;
function Kp(e, t, r) {
  const n = r.dereference ? (i) => Er.stat(i, { bigint: !0 }) : (i) => Er.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, a]) => ({ srcStat: i, destStat: a }));
}
function Jp(e, t, r) {
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
function Qp(e, t, r, n, i) {
  Yp.callbackify(Kp)(e, t, n, (a, s) => {
    if (a) return i(a);
    const { srcStat: o, destStat: l } = s;
    if (l) {
      if (fn(o, l)) {
        const d = we.basename(e), c = we.basename(t);
        return r === "move" && d !== c && d.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: o, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (o.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!o.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return o.isDirectory() && hs(e, t) ? i(new Error(Ai(e, t, r))) : i(null, { srcStat: o, destStat: l });
  });
}
function Zp(e, t, r, n) {
  const { srcStat: i, destStat: a } = Jp(e, t, n);
  if (a) {
    if (fn(i, a)) {
      const s = we.basename(e), o = we.basename(t);
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
    throw new Error(Ai(e, t, r));
  return { srcStat: i, destStat: a };
}
function Uc(e, t, r, n, i) {
  const a = we.resolve(we.dirname(e)), s = we.resolve(we.dirname(r));
  if (s === a || s === we.parse(s).root) return i();
  Er.stat(s, { bigint: !0 }, (o, l) => o ? o.code === "ENOENT" ? i() : i(o) : fn(t, l) ? i(new Error(Ai(e, r, n))) : Uc(e, t, s, n, i));
}
function Mc(e, t, r, n) {
  const i = we.resolve(we.dirname(e)), a = we.resolve(we.dirname(r));
  if (a === i || a === we.parse(a).root) return;
  let s;
  try {
    s = Er.statSync(a, { bigint: !0 });
  } catch (o) {
    if (o.code === "ENOENT") return;
    throw o;
  }
  if (fn(t, s))
    throw new Error(Ai(e, r, n));
  return Mc(e, t, a, n);
}
function fn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function hs(e, t) {
  const r = we.resolve(e).split(we.sep).filter((i) => i), n = we.resolve(t).split(we.sep).filter((i) => i);
  return r.reduce((i, a, s) => i && n[s] === a, !0);
}
function Ai(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Sr = {
  checkPaths: Qp,
  checkPathsSync: Zp,
  checkParentPaths: Uc,
  checkParentPathsSync: Mc,
  isSrcSubdir: hs,
  areIdentical: fn
};
const Me = $e, Wr = ce, eh = ot.mkdirs, th = tr.pathExists, rh = Lc.utimesMillis, Vr = Sr;
function nh(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Vr.checkPaths(e, t, "copy", r, (i, a) => {
    if (i) return n(i);
    const { srcStat: s, destStat: o } = a;
    Vr.checkParentPaths(e, s, t, "copy", (l) => l ? n(l) : r.filter ? Bc(vo, o, e, t, r, n) : vo(o, e, t, r, n));
  });
}
function vo(e, t, r, n, i) {
  const a = Wr.dirname(r);
  th(a, (s, o) => {
    if (s) return i(s);
    if (o) return ui(e, t, r, n, i);
    eh(a, (l) => l ? i(l) : ui(e, t, r, n, i));
  });
}
function Bc(e, t, r, n, i, a) {
  Promise.resolve(i.filter(r, n)).then((s) => s ? e(t, r, n, i, a) : a(), (s) => a(s));
}
function ih(e, t, r, n, i) {
  return n.filter ? Bc(ui, e, t, r, n, i) : ui(e, t, r, n, i);
}
function ui(e, t, r, n, i) {
  (n.dereference ? Me.stat : Me.lstat)(t, (s, o) => s ? i(s) : o.isDirectory() ? fh(o, e, t, r, n, i) : o.isFile() || o.isCharacterDevice() || o.isBlockDevice() ? ah(o, e, t, r, n, i) : o.isSymbolicLink() ? hh(e, t, r, n, i) : o.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : o.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function ah(e, t, r, n, i, a) {
  return t ? sh(e, r, n, i, a) : jc(e, r, n, i, a);
}
function sh(e, t, r, n, i) {
  if (n.overwrite)
    Me.unlink(r, (a) => a ? i(a) : jc(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function jc(e, t, r, n, i) {
  Me.copyFile(t, r, (a) => a ? i(a) : n.preserveTimestamps ? oh(e.mode, t, r, i) : Ii(r, e.mode, i));
}
function oh(e, t, r, n) {
  return lh(e) ? ch(r, e, (i) => i ? n(i) : To(e, t, r, n)) : To(e, t, r, n);
}
function lh(e) {
  return (e & 128) === 0;
}
function ch(e, t, r) {
  return Ii(e, t | 128, r);
}
function To(e, t, r, n) {
  uh(t, r, (i) => i ? n(i) : Ii(r, e, n));
}
function Ii(e, t, r) {
  return Me.chmod(e, t, r);
}
function uh(e, t, r) {
  Me.stat(e, (n, i) => n ? r(n) : rh(t, i.atime, i.mtime, r));
}
function fh(e, t, r, n, i, a) {
  return t ? Gc(r, n, i, a) : dh(e.mode, r, n, i, a);
}
function dh(e, t, r, n, i) {
  Me.mkdir(r, (a) => {
    if (a) return i(a);
    Gc(t, r, n, (s) => s ? i(s) : Ii(r, e, i));
  });
}
function Gc(e, t, r, n) {
  Me.readdir(e, (i, a) => i ? n(i) : zc(a, e, t, r, n));
}
function zc(e, t, r, n, i) {
  const a = e.pop();
  return a ? ph(e, a, t, r, n, i) : i();
}
function ph(e, t, r, n, i, a) {
  const s = Wr.join(r, t), o = Wr.join(n, t);
  Vr.checkPaths(s, o, "copy", i, (l, d) => {
    if (l) return a(l);
    const { destStat: c } = d;
    ih(c, s, o, i, (u) => u ? a(u) : zc(e, r, n, i, a));
  });
}
function hh(e, t, r, n, i) {
  Me.readlink(t, (a, s) => {
    if (a) return i(a);
    if (n.dereference && (s = Wr.resolve(process.cwd(), s)), e)
      Me.readlink(r, (o, l) => o ? o.code === "EINVAL" || o.code === "UNKNOWN" ? Me.symlink(s, r, i) : i(o) : (n.dereference && (l = Wr.resolve(process.cwd(), l)), Vr.isSrcSubdir(s, l) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Vr.isSrcSubdir(l, s) ? i(new Error(`Cannot overwrite '${l}' with '${s}'.`)) : mh(s, r, i)));
    else
      return Me.symlink(s, r, i);
  });
}
function mh(e, t, r) {
  Me.unlink(t, (n) => n ? r(n) : Me.symlink(e, t, r));
}
var gh = nh;
const Ie = $e, Yr = ce, yh = ot.mkdirsSync, xh = Lc.utimesMillisSync, Kr = Sr;
function wh(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Kr.checkPathsSync(e, t, "copy", r);
  return Kr.checkParentPathsSync(e, n, t, "copy"), Eh(i, e, t, r);
}
function Eh(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Yr.dirname(r);
  return Ie.existsSync(i) || yh(i), Hc(e, t, r, n);
}
function vh(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Hc(e, t, r, n);
}
function Hc(e, t, r, n) {
  const a = (n.dereference ? Ie.statSync : Ie.lstatSync)(t);
  if (a.isDirectory()) return Ch(a, e, t, r, n);
  if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return Th(a, e, t, r, n);
  if (a.isSymbolicLink()) return Oh(e, t, r, n);
  throw a.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Th(e, t, r, n, i) {
  return t ? _h(e, r, n, i) : qc(e, r, n, i);
}
function _h(e, t, r, n) {
  if (n.overwrite)
    return Ie.unlinkSync(r), qc(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function qc(e, t, r, n) {
  return Ie.copyFileSync(t, r), n.preserveTimestamps && bh(e.mode, t, r), ms(r, e.mode);
}
function bh(e, t, r) {
  return Sh(e) && Ah(r, e), Ih(t, r);
}
function Sh(e) {
  return (e & 128) === 0;
}
function Ah(e, t) {
  return ms(e, t | 128);
}
function ms(e, t) {
  return Ie.chmodSync(e, t);
}
function Ih(e, t) {
  const r = Ie.statSync(e);
  return xh(t, r.atime, r.mtime);
}
function Ch(e, t, r, n, i) {
  return t ? Xc(r, n, i) : Rh(e.mode, r, n, i);
}
function Rh(e, t, r, n) {
  return Ie.mkdirSync(r), Xc(t, r, n), ms(r, e);
}
function Xc(e, t, r) {
  Ie.readdirSync(e).forEach((n) => Dh(n, e, t, r));
}
function Dh(e, t, r, n) {
  const i = Yr.join(t, e), a = Yr.join(r, e), { destStat: s } = Kr.checkPathsSync(i, a, "copy", n);
  return vh(s, i, a, n);
}
function Oh(e, t, r, n) {
  let i = Ie.readlinkSync(t);
  if (n.dereference && (i = Yr.resolve(process.cwd(), i)), e) {
    let a;
    try {
      a = Ie.readlinkSync(r);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Ie.symlinkSync(i, r);
      throw s;
    }
    if (n.dereference && (a = Yr.resolve(process.cwd(), a)), Kr.isSrcSubdir(i, a))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);
    if (Ie.statSync(r).isDirectory() && Kr.isSrcSubdir(a, i))
      throw new Error(`Cannot overwrite '${a}' with '${i}'.`);
    return Ph(i, r);
  } else
    return Ie.symlinkSync(i, r);
}
function Ph(e, t) {
  return Ie.unlinkSync(t), Ie.symlinkSync(e, t);
}
var kh = wh;
const Nh = Fe.fromCallback;
var gs = {
  copy: Nh(gh),
  copySync: kh
};
const _o = $e, Wc = ce, ne = Ic, Jr = process.platform === "win32";
function Vc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || _o[r], r = r + "Sync", e[r] = e[r] || _o[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function ys(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), ne(e, "rimraf: missing path"), ne.strictEqual(typeof e, "string", "rimraf: path should be a string"), ne.strictEqual(typeof r, "function", "rimraf: callback function required"), ne(t, "rimraf: invalid options argument provided"), ne.strictEqual(typeof t, "object", "rimraf: options should be object"), Vc(t), bo(e, t, function i(a) {
    if (a) {
      if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const s = n * 100;
        return setTimeout(() => bo(e, t, i), s);
      }
      a.code === "ENOENT" && (a = null);
    }
    r(a);
  });
}
function bo(e, t, r) {
  ne(e), ne(t), ne(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Jr)
      return So(e, t, n, r);
    if (i && i.isDirectory())
      return ai(e, t, n, r);
    t.unlink(e, (a) => {
      if (a) {
        if (a.code === "ENOENT")
          return r(null);
        if (a.code === "EPERM")
          return Jr ? So(e, t, a, r) : ai(e, t, a, r);
        if (a.code === "EISDIR")
          return ai(e, t, a, r);
      }
      return r(a);
    });
  });
}
function So(e, t, r, n) {
  ne(e), ne(t), ne(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (a, s) => {
      a ? n(a.code === "ENOENT" ? null : r) : s.isDirectory() ? ai(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Ao(e, t, r) {
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
function ai(e, t, r, n) {
  ne(e), ne(t), ne(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Fh(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Fh(e, t, r) {
  ne(e), ne(t), ne(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let a = i.length, s;
    if (a === 0) return t.rmdir(e, r);
    i.forEach((o) => {
      ys(Wc.join(e, o), t, (l) => {
        if (!s) {
          if (l) return r(s = l);
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
    n.code === "EPERM" && Jr && Ao(e, t, n);
  }
  try {
    r && r.isDirectory() ? si(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Jr ? Ao(e, t, n) : si(e, t, n);
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
      $h(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function $h(e, t) {
  if (ne(e), ne(t), t.readdirSync(e).forEach((r) => Yc(Wc.join(e, r), t)), Jr) {
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
var Lh = ys;
ys.sync = Yc;
const fi = $e, Uh = Fe.fromCallback, Kc = Lh;
function Mh(e, t) {
  if (fi.rm) return fi.rm(e, { recursive: !0, force: !0 }, t);
  Kc(e, t);
}
function Bh(e) {
  if (fi.rmSync) return fi.rmSync(e, { recursive: !0, force: !0 });
  Kc.sync(e);
}
var Ci = {
  remove: Uh(Mh),
  removeSync: Bh
};
const jh = Fe.fromPromise, Jc = er, Qc = ce, Zc = ot, eu = Ci, Io = jh(async function(t) {
  let r;
  try {
    r = await Jc.readdir(t);
  } catch {
    return Zc.mkdirs(t);
  }
  return Promise.all(r.map((n) => eu.remove(Qc.join(t, n))));
});
function Co(e) {
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
var Gh = {
  emptyDirSync: Co,
  emptydirSync: Co,
  emptyDir: Io,
  emptydir: Io
};
const zh = Fe.fromCallback, tu = ce, _t = $e, ru = ot;
function Hh(e, t) {
  function r() {
    _t.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  _t.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const a = tu.dirname(e);
    _t.stat(a, (s, o) => {
      if (s)
        return s.code === "ENOENT" ? ru.mkdirs(a, (l) => {
          if (l) return t(l);
          r();
        }) : t(s);
      o.isDirectory() ? r() : _t.readdir(a, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function qh(e) {
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
var Xh = {
  createFile: zh(Hh),
  createFileSync: qh
};
const Wh = Fe.fromCallback, nu = ce, Tt = $e, iu = ot, Vh = tr.pathExists, { areIdentical: au } = Sr;
function Yh(e, t, r) {
  function n(i, a) {
    Tt.link(i, a, (s) => {
      if (s) return r(s);
      r(null);
    });
  }
  Tt.lstat(t, (i, a) => {
    Tt.lstat(e, (s, o) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), r(s);
      if (a && au(o, a)) return r(null);
      const l = nu.dirname(t);
      Vh(l, (d, c) => {
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
function Kh(e, t) {
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
var Jh = {
  createLink: Wh(Yh),
  createLinkSync: Kh
};
const bt = ce, zr = $e, Qh = tr.pathExists;
function Zh(e, t, r) {
  if (bt.isAbsolute(e))
    return zr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = bt.dirname(t), i = bt.join(n, e);
    return Qh(i, (a, s) => a ? r(a) : s ? r(null, {
      toCwd: i,
      toDst: e
    }) : zr.lstat(e, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), r(o)) : r(null, {
      toCwd: e,
      toDst: bt.relative(n, e)
    })));
  }
}
function em(e, t) {
  let r;
  if (bt.isAbsolute(e)) {
    if (r = zr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = bt.dirname(t), i = bt.join(n, e);
    if (r = zr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = zr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: bt.relative(n, e)
    };
  }
}
var tm = {
  symlinkPaths: Zh,
  symlinkPathsSync: em
};
const su = $e;
function rm(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  su.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function nm(e, t) {
  let r;
  if (t) return t;
  try {
    r = su.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var im = {
  symlinkType: rm,
  symlinkTypeSync: nm
};
const am = Fe.fromCallback, ou = ce, Ye = er, lu = ot, sm = lu.mkdirs, om = lu.mkdirsSync, cu = tm, lm = cu.symlinkPaths, cm = cu.symlinkPathsSync, uu = im, um = uu.symlinkType, fm = uu.symlinkTypeSync, dm = tr.pathExists, { areIdentical: fu } = Sr;
function pm(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Ye.lstat(t, (i, a) => {
    !i && a.isSymbolicLink() ? Promise.all([
      Ye.stat(e),
      Ye.stat(t)
    ]).then(([s, o]) => {
      if (fu(s, o)) return n(null);
      Ro(e, t, r, n);
    }) : Ro(e, t, r, n);
  });
}
function Ro(e, t, r, n) {
  lm(e, t, (i, a) => {
    if (i) return n(i);
    e = a.toDst, um(a.toCwd, r, (s, o) => {
      if (s) return n(s);
      const l = ou.dirname(t);
      dm(l, (d, c) => {
        if (d) return n(d);
        if (c) return Ye.symlink(e, t, o, n);
        sm(l, (u) => {
          if (u) return n(u);
          Ye.symlink(e, t, o, n);
        });
      });
    });
  });
}
function hm(e, t, r) {
  let n;
  try {
    n = Ye.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const o = Ye.statSync(e), l = Ye.statSync(t);
    if (fu(o, l)) return;
  }
  const i = cm(e, t);
  e = i.toDst, r = fm(i.toCwd, r);
  const a = ou.dirname(t);
  return Ye.existsSync(a) || om(a), Ye.symlinkSync(e, t, r);
}
var mm = {
  createSymlink: am(pm),
  createSymlinkSync: hm
};
const { createFile: Do, createFileSync: Oo } = Xh, { createLink: Po, createLinkSync: ko } = Jh, { createSymlink: No, createSymlinkSync: Fo } = mm;
var gm = {
  // file
  createFile: Do,
  createFileSync: Oo,
  ensureFile: Do,
  ensureFileSync: Oo,
  // link
  createLink: Po,
  createLinkSync: ko,
  ensureLink: Po,
  ensureLinkSync: ko,
  // symlink
  createSymlink: No,
  createSymlinkSync: Fo,
  ensureSymlink: No,
  ensureSymlinkSync: Fo
};
function ym(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const a = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + a;
}
function xm(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var xs = { stringify: ym, stripBom: xm };
let vr;
try {
  vr = $e;
} catch {
  vr = Pt;
}
const Ri = Fe, { stringify: du, stripBom: pu } = xs;
async function wm(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || vr, n = "throws" in t ? t.throws : !0;
  let i = await Ri.fromCallback(r.readFile)(e, t);
  i = pu(i);
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
const Em = Ri.fromPromise(wm);
function vm(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || vr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = pu(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Tm(e, t, r = {}) {
  const n = r.fs || vr, i = du(t, r);
  await Ri.fromCallback(n.writeFile)(e, i, r);
}
const _m = Ri.fromPromise(Tm);
function bm(e, t, r = {}) {
  const n = r.fs || vr, i = du(t, r);
  return n.writeFileSync(e, i, r);
}
var Sm = {
  readFile: Em,
  readFileSync: vm,
  writeFile: _m,
  writeFileSync: bm
};
const $n = Sm;
var Am = {
  // jsonfile exports
  readJson: $n.readFile,
  readJsonSync: $n.readFileSync,
  writeJson: $n.writeFile,
  writeJsonSync: $n.writeFileSync
};
const Im = Fe.fromCallback, Hr = $e, hu = ce, mu = ot, Cm = tr.pathExists;
function Rm(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = hu.dirname(e);
  Cm(i, (a, s) => {
    if (a) return n(a);
    if (s) return Hr.writeFile(e, t, r, n);
    mu.mkdirs(i, (o) => {
      if (o) return n(o);
      Hr.writeFile(e, t, r, n);
    });
  });
}
function Dm(e, ...t) {
  const r = hu.dirname(e);
  if (Hr.existsSync(r))
    return Hr.writeFileSync(e, ...t);
  mu.mkdirsSync(r), Hr.writeFileSync(e, ...t);
}
var ws = {
  outputFile: Im(Rm),
  outputFileSync: Dm
};
const { stringify: Om } = xs, { outputFile: Pm } = ws;
async function km(e, t, r = {}) {
  const n = Om(t, r);
  await Pm(e, n, r);
}
var Nm = km;
const { stringify: Fm } = xs, { outputFileSync: $m } = ws;
function Lm(e, t, r) {
  const n = Fm(t, r);
  $m(e, n, r);
}
var Um = Lm;
const Mm = Fe.fromPromise, Ne = Am;
Ne.outputJson = Mm(Nm);
Ne.outputJsonSync = Um;
Ne.outputJSON = Ne.outputJson;
Ne.outputJSONSync = Ne.outputJsonSync;
Ne.writeJSON = Ne.writeJson;
Ne.writeJSONSync = Ne.writeJsonSync;
Ne.readJSON = Ne.readJson;
Ne.readJSONSync = Ne.readJsonSync;
var Bm = Ne;
const jm = $e, ja = ce, Gm = gs.copy, gu = Ci.remove, zm = ot.mkdirp, Hm = tr.pathExists, $o = Sr;
function qm(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  $o.checkPaths(e, t, "move", r, (a, s) => {
    if (a) return n(a);
    const { srcStat: o, isChangingCase: l = !1 } = s;
    $o.checkParentPaths(e, o, t, "move", (d) => {
      if (d) return n(d);
      if (Xm(t)) return Lo(e, t, i, l, n);
      zm(ja.dirname(t), (c) => c ? n(c) : Lo(e, t, i, l, n));
    });
  });
}
function Xm(e) {
  const t = ja.dirname(e);
  return ja.parse(t).root === t;
}
function Lo(e, t, r, n, i) {
  if (n) return la(e, t, r, i);
  if (r)
    return gu(t, (a) => a ? i(a) : la(e, t, r, i));
  Hm(t, (a, s) => a ? i(a) : s ? i(new Error("dest already exists.")) : la(e, t, r, i));
}
function la(e, t, r, n) {
  jm.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Wm(e, t, r, n) : n());
}
function Wm(e, t, r, n) {
  Gm(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (a) => a ? n(a) : gu(e, n));
}
var Vm = qm;
const yu = $e, Ga = ce, Ym = gs.copySync, xu = Ci.removeSync, Km = ot.mkdirpSync, Uo = Sr;
function Jm(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: a = !1 } = Uo.checkPathsSync(e, t, "move", r);
  return Uo.checkParentPathsSync(e, i, t, "move"), Qm(t) || Km(Ga.dirname(t)), Zm(e, t, n, a);
}
function Qm(e) {
  const t = Ga.dirname(e);
  return Ga.parse(t).root === t;
}
function Zm(e, t, r, n) {
  if (n) return ca(e, t, r);
  if (r)
    return xu(t), ca(e, t, r);
  if (yu.existsSync(t)) throw new Error("dest already exists.");
  return ca(e, t, r);
}
function ca(e, t, r) {
  try {
    yu.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return e0(e, t, r);
  }
}
function e0(e, t, r) {
  return Ym(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), xu(e);
}
var t0 = Jm;
const r0 = Fe.fromCallback;
var n0 = {
  move: r0(Vm),
  moveSync: t0
}, kt = {
  // Export promiseified graceful-fs:
  ...er,
  // Export extra methods:
  ...gs,
  ...Gh,
  ...gm,
  ...Bm,
  ...ot,
  ...n0,
  ...ws,
  ...tr,
  ...Ci
}, ht = {}, It = {}, Ee = {}, Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.CancellationError = Ct.CancellationToken = void 0;
const i0 = Cc;
class a0 extends i0.EventEmitter {
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
      return Promise.reject(new za());
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
          a(new za());
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
Ct.CancellationToken = a0;
class za extends Error {
  constructor() {
    super("cancelled");
  }
}
Ct.CancellationError = za;
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.newError = s0;
function s0(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var ke = {}, Ha = { exports: {} }, Ln = { exports: {} }, ua, Mo;
function o0() {
  if (Mo) return ua;
  Mo = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, a = n * 365.25;
  ua = function(c, u) {
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
  return ua;
}
var fa, Bo;
function wu() {
  if (Bo) return fa;
  Bo = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = d, n.disable = o, n.enable = a, n.enabled = l, n.humanize = o0(), n.destroy = c, Object.keys(t).forEach((u) => {
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
        get: () => g !== null ? g : (w !== n.namespaces && (w = n.namespaces, x = n.enabled(u)), x),
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
  return fa = e, fa;
}
var jo;
function l0() {
  return jo || (jo = 1, function(e, t) {
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
    e.exports = wu()(t);
    const { formatters: o } = e.exports;
    o.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (d) {
        return "[UnexpectedJSONParseError]: " + d.message;
      }
    };
  }(Ln, Ln.exports)), Ln.exports;
}
var Un = { exports: {} }, da, Go;
function c0() {
  return Go || (Go = 1, da = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), da;
}
var pa, zo;
function u0() {
  if (zo) return pa;
  zo = 1;
  const e = Si, t = Rc, r = c0(), { env: n } = process;
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
  return pa = {
    supportsColor: o,
    stdout: a(s(!0, t.isatty(1))),
    stderr: a(s(!0, t.isatty(2)))
  }, pa;
}
var Ho;
function f0() {
  return Ho || (Ho = 1, function(e, t) {
    const r = Rc, n = us;
    t.init = c, t.log = o, t.formatArgs = a, t.save = l, t.load = d, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const p = u0();
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
      const w = g.substring(6).toLowerCase().replace(/_([a-z])/g, (T, b) => b.toUpperCase());
      let x = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(x) ? x = !0 : /^(no|off|false|disabled)$/i.test(x) ? x = !1 : x === "null" ? x = null : x = Number(x), p[w] = x, p;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function a(p) {
      const { namespace: g, useColors: w } = this;
      if (w) {
        const x = this.color, T = "\x1B[3" + (x < 8 ? x : "8;5;" + x), b = `  ${T};1m${g} \x1B[0m`;
        p[0] = b + p[0].split(`
`).join(`
` + b), p.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
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
    e.exports = wu()(t);
    const { formatters: u } = e.exports;
    u.o = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, u.O = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts);
    };
  }(Un, Un.exports)), Un.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Ha.exports = l0() : Ha.exports = f0();
var Eu = Ha.exports;
const Ir = /* @__PURE__ */ Ip(Eu);
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.ProgressCallbackTransform = void 0;
const d0 = cn;
class p0 extends d0.Transform {
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
dn.ProgressCallbackTransform = p0;
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.DigestTransform = ke.HttpExecutor = ke.HttpError = void 0;
ke.createHttpError = qa;
ke.parseJson = v0;
ke.configureRequestOptionsFromUrl = Tu;
ke.configureRequestUrl = vs;
ke.safeGetHeader = wr;
ke.configureRequestOptions = pi;
ke.safeStringifyJson = hi;
const h0 = un, m0 = Eu, g0 = Pt, y0 = cn, vu = br, x0 = Ct, qo = Ar, w0 = dn, Fr = (0, m0.default)("electron-builder");
function qa(e, t = null) {
  return new Es(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + hi(e.headers), t);
}
const E0 = /* @__PURE__ */ new Map([
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
  constructor(t, r = `HTTP error: ${E0.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
ke.HttpError = Es;
function v0(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class di {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new x0.CancellationToken(), n) {
    pi(t);
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
    return Fr.enabled && Fr(`Request: ${hi(t)}`), r.createPromise((a, s, o) => {
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
    if (Fr.enabled && Fr(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${hi(r)}`), t.statusCode === 404) {
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
      this.doApiRequest(di.prepareRedirectUrlOptions(u, r), n, o, s).then(i).catch(a);
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
      vs(t, o), pi(o), this.doDownload(o, {
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
        n < this.maxRedirects ? this.doDownload(di.prepareRedirectUrlOptions(s, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? _0(r, a) : r.responseHandler(a, r.callback);
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
        if (n < r && (i instanceof Es && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
ke.HttpExecutor = di;
function Tu(e, t) {
  const r = pi(t);
  return vs(new vu.URL(e), r), r;
}
function vs(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Xa extends y0.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, h0.createHash)(r);
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
      throw (0, qo.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, qo.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
ke.DigestTransform = Xa;
function T0(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function wr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function _0(e, t) {
  if (!T0(wr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const s = wr(t, "content-length");
    s != null && r.push(new w0.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Xa(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Xa(e.options.sha2, "sha256", "hex"));
  const i = (0, g0.createWriteStream)(e.destination);
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
function pi(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function hi(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.MemoLazy = void 0;
class b0 {
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
Di.MemoLazy = b0;
function _u(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), a = Object.keys(t);
    return i.length === a.length && i.every((s) => _u(e[s], t[s]));
  }
  return e === t;
}
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.githubUrl = S0;
Oi.getS3LikeProviderBaseUrl = A0;
function S0(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function A0(e) {
  const t = e.provider;
  if (t === "s3")
    return I0(e);
  if (t === "spaces")
    return C0(e);
  throw new Error(`Not supported provider: ${t}`);
}
function I0(e) {
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
function C0(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return bu(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.retry = Su;
const R0 = Ct;
async function Su(e, t, r, n = 0, i = 0, a) {
  var s;
  const o = new R0.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((s = a == null ? void 0 : a(l)) !== null && s !== void 0) || s) && t > 0 && !o.cancelled)
      return await new Promise((d) => setTimeout(d, r + n * i)), await Su(e, t - 1, r, n, i + 1, a);
    throw l;
  }
}
var _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.parseDn = D0;
function D0(e) {
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
const Au = un, Iu = Ar, O0 = "options.name must be either a string or a Buffer", Xo = (0, Au.randomBytes)(16);
Xo[0] = Xo[0] | 1;
const oi = {}, Q = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  oi[t] = e, Q[e] = t;
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
    return P0(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = k0(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (oi[t[14] + t[15]] & 240) >> 4,
        variant: Wo((oi[t[19] + t[20]] & 224) >> 5),
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
        variant: Wo((t[r + 8] & 224) >> 5),
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
      r[i] = oi[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
Tr.UUID = Qt;
Qt.OID = Qt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Wo(e) {
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
function P0(e, t, r, n, i = qr.ASCII) {
  const a = (0, Au.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Iu.newError)(O0, "ERR_INVALID_UUID_NAME");
  a.update(n), a.update(e);
  const o = a.digest();
  let l;
  switch (i) {
    case qr.BINARY:
      o[6] = o[6] & 15 | r, o[8] = o[8] & 63 | 128, l = o;
      break;
    case qr.OBJECT:
      o[6] = o[6] & 15 | r, o[8] = o[8] & 63 | 128, l = new Qt(o);
      break;
    default:
      l = Q[o[0]] + Q[o[1]] + Q[o[2]] + Q[o[3]] + "-" + Q[o[4]] + Q[o[5]] + "-" + Q[o[6] & 15 | r] + Q[o[7]] + "-" + Q[o[8] & 63 | 128] + Q[o[9]] + "-" + Q[o[10]] + Q[o[11]] + Q[o[12]] + Q[o[13]] + Q[o[14]] + Q[o[15]];
      break;
  }
  return l;
}
function k0(e) {
  return Q[e[0]] + Q[e[1]] + Q[e[2]] + Q[e[3]] + "-" + Q[e[4]] + Q[e[5]] + "-" + Q[e[6]] + Q[e[7]] + "-" + Q[e[8]] + Q[e[9]] + "-" + Q[e[10]] + Q[e[11]] + Q[e[12]] + Q[e[13]] + Q[e[14]] + Q[e[15]];
}
Tr.nil = new Qt("00000000-0000-0000-0000-000000000000");
var pn = {}, Cu = {};
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
      a(A), A.q = A.c = "", A.bufferCheckPosition = t.MAX_BUFFER_LENGTH, A.opt = f || {}, A.opt.lowercase = A.opt.lowercase || A.opt.lowercasetags, A.looseCase = A.opt.lowercase ? "toLowerCase" : "toUpperCase", A.tags = [], A.closed = A.closedRoot = A.sawRoot = !1, A.tag = A.error = null, A.strict = !!h, A.noscript = !!(h || A.opt.noscript), A.state = y.BEGIN, A.strictEntities = A.opt.strictEntities, A.ENTITIES = A.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), A.attribList = [], A.opt.xmlns && (A.ns = Object.create(x)), A.opt.unquotedAttributeValues === void 0 && (A.opt.unquotedAttributeValues = !h), A.trackPosition = A.opt.position !== !1, A.trackPosition && (A.position = A.line = A.column = 0), U(A, "onready");
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
      var ue = t.MAX_BUFFER_LENGTH - A;
      h.bufferCheckPosition = ue + h.position;
    }
    function a(h) {
      for (var f = 0, A = r.length; f < A; f++)
        h[r[f]] = "";
    }
    function s(h) {
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
    c.prototype = Object.create(o.prototype, {
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
      }), o.prototype.on.call(A, h, f);
    };
    var u = "[CDATA[", p = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", w = "http://www.w3.org/2000/xmlns/", x = { xml: g, xmlns: w }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, b = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, _ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, F = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
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
          else if (v === "xmlns" && h.attribValue !== w)
            S(
              h,
              "xmlns: prefix must be bound to " + w + `
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
        A.ns && Z.ns !== A.ns && Object.keys(A.ns).forEach(function(bn) {
          M(h, "onopennamespace", {
            prefix: bn,
            uri: A.ns[bn]
          });
        });
        for (var ae = 0, ue = h.attribList.length; ae < ue; ae++) {
          var ve = h.attribList[ae], Se = ve[0], mt = ve[1], he = O(Se, !0), We = he.prefix, Qi = he.local, _n = We === "" ? "" : A.ns[We] || "", Dr = {
            name: Se,
            value: mt,
            prefix: We,
            local: Qi,
            uri: _n
          };
          We && We !== "xmlns" && !_n && (S(
            h,
            "Unbound namespace prefix: " + JSON.stringify(We)
          ), Dr.uri = We), h.tag.attributes[Se] = Dr, M(h, "onattribute", Dr);
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
        var ue = h.tag = h.tags.pop();
        h.tagName = h.tag.name, M(h, "onclosetag", h.tagName);
        var ve = {};
        for (var Se in ue.ns)
          ve[Se] = ue.ns[Se];
        var mt = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && ue.ns !== mt.ns && Object.keys(ue.ns).forEach(function(he) {
          var We = ue.ns[he];
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
            var ue, ve;
            switch (f.state) {
              case y.TEXT_ENTITY:
                ue = y.TEXT, ve = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                ue = y.ATTRIB_VALUE_QUOTED, ve = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                ue = y.ATTRIB_VALUE_UNQUOTED, ve = "attribValue";
                break;
            }
            if (v === ";") {
              var Se = re(f);
              f.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Se) ? (f.entity = "", f.state = ue, f.write(Se)) : (f[ve] += Se, f.entity = "", f.state = ue);
            } else q(f.entity.length ? F : _, v) ? f.entity += v : (S(f, "Invalid character in entity name"), f[ve] += "&" + f.entity + v, f.entity = "", f.state = ue);
            continue;
          default:
            throw new Error(f, "Unknown state: " + f.state);
        }
      return f.position >= f.bufferCheckPosition && i(f), f;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, f = Math.floor, A = function() {
        var v = 16384, Z = [], ae, ue, ve = -1, Se = arguments.length;
        if (!Se)
          return "";
        for (var mt = ""; ++ve < Se; ) {
          var he = Number(arguments[ve]);
          if (!isFinite(he) || // `NaN`, `+Infinity`, or `-Infinity`
          he < 0 || // not a valid Unicode code point
          he > 1114111 || // not a valid Unicode code point
          f(he) !== he)
            throw RangeError("Invalid code point: " + he);
          he <= 65535 ? Z.push(he) : (he -= 65536, ae = (he >> 10) + 55296, ue = he % 1024 + 56320, Z.push(ae, ue)), (ve + 1 === Se || Z.length > v) && (mt += h.apply(null, Z), Z.length = 0);
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
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.XElement = void 0;
pn.parseXml = L0;
const N0 = Cu, Mn = Ar;
class Ru {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Mn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!$0(t))
      throw (0, Mn.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Mn.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Mn.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (Vo(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Vo(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
pn.XElement = Ru;
const F0 = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function $0(e) {
  return F0.test(e);
}
function Vo(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function L0(e) {
  let t = null;
  const r = N0.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const a = new Ru(i.name);
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
  var t = Ct;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = Ar;
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
  var i = Di;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var a = dn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return a.ProgressCallbackTransform;
  } });
  var s = Oi;
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
})(Ee);
var be = {}, bs = {}, Je = {};
function Du(e) {
  return typeof e > "u" || e === null;
}
function U0(e) {
  return typeof e == "object" && e !== null;
}
function M0(e) {
  return Array.isArray(e) ? e : Du(e) ? [] : [e];
}
function B0(e, t) {
  var r, n, i, a;
  if (t)
    for (a = Object.keys(t), r = 0, n = a.length; r < n; r += 1)
      i = a[r], e[i] = t[i];
  return e;
}
function j0(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function G0(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Je.isNothing = Du;
Je.isObject = U0;
Je.toArray = M0;
Je.repeat = j0;
Je.isNegativeZero = G0;
Je.extend = B0;
function Ou(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Qr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Ou(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Qr.prototype = Object.create(Error.prototype);
Qr.prototype.constructor = Qr;
Qr.prototype.toString = function(t) {
  return this.name + ": " + Ou(this, t);
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
function z0(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], a, s = -1; a = r.exec(e.buffer); )
    i.push(a.index), n.push(a.index + a[0].length), e.position <= a.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var o = "", l, d, c = Math.min(e.line + t.linesAfter, i.length).toString().length, u = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(s - l < 0); l++)
    d = ha(
      e.buffer,
      n[s - l],
      i[s - l],
      e.position - (n[s] - n[s - l]),
      u
    ), o = Br.repeat(" ", t.indent) + ma((e.line - l + 1).toString(), c) + " | " + d.str + `
` + o;
  for (d = ha(e.buffer, n[s], i[s], e.position, u), o += Br.repeat(" ", t.indent) + ma((e.line + 1).toString(), c) + " | " + d.str + `
`, o += Br.repeat("-", t.indent + c + 3 + d.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++)
    d = ha(
      e.buffer,
      n[s + l],
      i[s + l],
      e.position - (n[s] - n[s + l]),
      u
    ), o += Br.repeat(" ", t.indent) + ma((e.line + l + 1).toString(), c) + " | " + d.str + `
`;
  return o.replace(/\n$/, "");
}
var H0 = z0, Yo = hn, q0 = [
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
], X0 = [
  "scalar",
  "sequence",
  "mapping"
];
function W0(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function V0(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (q0.indexOf(r) === -1)
      throw new Yo('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = W0(t.styleAliases || null), X0.indexOf(this.kind) === -1)
    throw new Yo('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Le = V0, $r = hn, ga = Le;
function Ko(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(a, s) {
      a.tag === n.tag && a.kind === n.kind && a.multi === n.multi && (i = s);
    }), r[i] = n;
  }), r;
}
function Y0() {
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
    throw new $r("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(a) {
    if (!(a instanceof ga))
      throw new $r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (a.loadKind && a.loadKind !== "scalar")
      throw new $r("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (a.multi)
      throw new $r("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(a) {
    if (!(a instanceof ga))
      throw new $r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Wa.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Ko(i, "implicit"), i.compiledExplicit = Ko(i, "explicit"), i.compiledTypeMap = Y0(i.compiledImplicit, i.compiledExplicit), i;
};
var Pu = Wa, K0 = Le, ku = new K0("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), J0 = Le, Nu = new J0("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Q0 = Le, Fu = new Q0("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Z0 = Pu, $u = new Z0({
  explicit: [
    ku,
    Nu,
    Fu
  ]
}), eg = Le;
function tg(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function rg() {
  return null;
}
function ng(e) {
  return e === null;
}
var Lu = new eg("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: tg,
  construct: rg,
  predicate: ng,
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
}), ig = Le;
function ag(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function sg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function og(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Uu = new ig("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: ag,
  construct: sg,
  predicate: og,
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
}), lg = Je, cg = Le;
function ug(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function fg(e) {
  return 48 <= e && e <= 55;
}
function dg(e) {
  return 48 <= e && e <= 57;
}
function pg(e) {
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
          if (!ug(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!fg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!dg(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function hg(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function mg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !lg.isNegativeZero(e);
}
var Mu = new cg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: pg,
  construct: hg,
  predicate: mg,
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
}), Bu = Je, gg = Le, yg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function xg(e) {
  return !(e === null || !yg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function wg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var Eg = /^[-+]?[0-9]+e/;
function vg(e, t) {
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
  return r = e.toString(10), Eg.test(r) ? r.replace("e", ".e") : r;
}
function Tg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Bu.isNegativeZero(e));
}
var ju = new gg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: xg,
  construct: wg,
  predicate: Tg,
  represent: vg,
  defaultStyle: "lowercase"
}), Gu = $u.extend({
  implicit: [
    Lu,
    Uu,
    Mu,
    ju
  ]
}), zu = Gu, _g = Le, Hu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), qu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function bg(e) {
  return e === null ? !1 : Hu.exec(e) !== null || qu.exec(e) !== null;
}
function Sg(e) {
  var t, r, n, i, a, s, o, l = 0, d = null, c, u, p;
  if (t = Hu.exec(e), t === null && (t = qu.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (a = +t[4], s = +t[5], o = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], u = +(t[11] || 0), d = (c * 60 + u) * 6e4, t[9] === "-" && (d = -d)), p = new Date(Date.UTC(r, n, i, a, s, o, l)), d && p.setTime(p.getTime() - d), p;
}
function Ag(e) {
  return e.toISOString();
}
var Xu = new _g("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: bg,
  construct: Sg,
  instanceOf: Date,
  represent: Ag
}), Ig = Le;
function Cg(e) {
  return e === "<<" || e === null;
}
var Wu = new Ig("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Cg
}), Rg = Le, Ss = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Dg(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, a = Ss;
  for (r = 0; r < i; r++)
    if (t = a.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Og(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, a = Ss, s = 0, o = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (o.push(s >> 16 & 255), o.push(s >> 8 & 255), o.push(s & 255)), s = s << 6 | a.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (o.push(s >> 16 & 255), o.push(s >> 8 & 255), o.push(s & 255)) : r === 18 ? (o.push(s >> 10 & 255), o.push(s >> 2 & 255)) : r === 12 && o.push(s >> 4 & 255), new Uint8Array(o);
}
function Pg(e) {
  var t = "", r = 0, n, i, a = e.length, s = Ss;
  for (n = 0; n < a; n++)
    n % 3 === 0 && n && (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]), r = (r << 8) + e[n];
  return i = a % 3, i === 0 ? (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]) : i === 2 ? (t += s[r >> 10 & 63], t += s[r >> 4 & 63], t += s[r << 2 & 63], t += s[64]) : i === 1 && (t += s[r >> 2 & 63], t += s[r << 4 & 63], t += s[64], t += s[64]), t;
}
function kg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Vu = new Rg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Dg,
  construct: Og,
  predicate: kg,
  represent: Pg
}), Ng = Le, Fg = Object.prototype.hasOwnProperty, $g = Object.prototype.toString;
function Lg(e) {
  if (e === null) return !0;
  var t = [], r, n, i, a, s, o = e;
  for (r = 0, n = o.length; r < n; r += 1) {
    if (i = o[r], s = !1, $g.call(i) !== "[object Object]") return !1;
    for (a in i)
      if (Fg.call(i, a))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function Ug(e) {
  return e !== null ? e : [];
}
var Yu = new Ng("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Lg,
  construct: Ug
}), Mg = Le, Bg = Object.prototype.toString;
function jg(e) {
  if (e === null) return !0;
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1) {
    if (n = s[t], Bg.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    a[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function Gg(e) {
  if (e === null) return [];
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1)
    n = s[t], i = Object.keys(n), a[t] = [i[0], n[i[0]]];
  return a;
}
var Ku = new Mg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: jg,
  construct: Gg
}), zg = Le, Hg = Object.prototype.hasOwnProperty;
function qg(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (Hg.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Xg(e) {
  return e !== null ? e : {};
}
var Ju = new zg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: qg,
  construct: Xg
}), As = zu.extend({
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
}), qt = Je, Qu = hn, Wg = H0, Vg = As, Rt = Object.prototype.hasOwnProperty, mi = 1, Zu = 2, ef = 3, gi = 4, ya = 1, Yg = 2, Jo = 3, Kg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Jg = /[\x85\u2028\u2029]/, Qg = /[,\[\]\{\}]/, tf = /^(?:!|!!|![a-z\-]+!)$/i, rf = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Qo(e) {
  return Object.prototype.toString.call(e);
}
function at(e) {
  return e === 10 || e === 13;
}
function Yt(e) {
  return e === 9 || e === 32;
}
function Be(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function dr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Zg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function ey(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function ty(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Zo(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function ry(e) {
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
var af = new Array(256), sf = new Array(256);
for (var ar = 0; ar < 256; ar++)
  af[ar] = Zo(ar) ? 1 : 0, sf[ar] = Zo(ar);
function ny(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Vg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function of(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Wg(r), new Qu(t, r);
}
function B(e, t) {
  throw of(e, t);
}
function yi(e, t) {
  e.onWarning && e.onWarning.call(null, of(e, t));
}
var el = {
  YAML: function(t, r, n) {
    var i, a, s;
    t.version !== null && B(t, "duplication of %YAML directive"), n.length !== 1 && B(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && B(t, "ill-formed argument of the YAML directive"), a = parseInt(i[1], 10), s = parseInt(i[2], 10), a !== 1 && B(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && yi(t, "unsupported YAML version of the document");
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
  var i, a, s, o;
  if (t < r) {
    if (o = e.input.slice(t, r), n)
      for (i = 0, a = o.length; i < a; i += 1)
        s = o.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || B(e, "expected valid JSON character");
    else Kg.test(o) && B(e, "the stream contains non-printable characters");
    e.result += o;
  }
}
function tl(e, t, r, n) {
  var i, a, s, o;
  for (qt.isObject(r) || B(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), s = 0, o = i.length; s < o; s += 1)
    a = i[s], Rt.call(t, a) || (nf(t, a, r[a]), n[a] = !0);
}
function pr(e, t, r, n, i, a, s, o, l) {
  var d, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), d = 0, c = i.length; d < c; d += 1)
      Array.isArray(i[d]) && B(e, "nested arrays are not supported inside keys"), typeof i == "object" && Qo(i[d]) === "[object Object]" && (i[d] = "[object Object]");
  if (typeof i == "object" && Qo(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(a))
      for (d = 0, c = a.length; d < c; d += 1)
        tl(e, t, a[d], r);
    else
      tl(e, t, a, r);
  else
    !e.json && !Rt.call(r, i) && Rt.call(t, i) && (e.line = s || e.line, e.lineStart = o || e.lineStart, e.position = l || e.position, B(e, "duplicated mapping key")), nf(t, i, a), delete r[i];
  return t;
}
function Is(e) {
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
    if (at(i))
      for (Is(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && yi(e, "deficient indentation"), n;
}
function Pi(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Be(r)));
}
function Cs(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += qt.repeat(`
`, t - 1));
}
function iy(e, t, r) {
  var n, i, a, s, o, l, d, c, u = e.kind, p = e.result, g;
  if (g = e.input.charCodeAt(e.position), Be(g) || dr(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), Be(i) || r && dr(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", a = s = e.position, o = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Be(i) || r && dr(i))
        break;
    } else if (g === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Be(n))
        break;
    } else {
      if (e.position === e.lineStart && Pi(e) || r && dr(g))
        break;
      if (at(g))
        if (l = e.line, d = e.lineStart, c = e.lineIndent, pe(e, !1, -1), e.lineIndent >= t) {
          o = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = d, e.lineIndent = c;
          break;
        }
    }
    o && (St(e, a, s, !1), Cs(e, e.line - l), a = s = e.position, o = !1), Yt(g) || (s = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return St(e, a, s, !1), e.result ? !0 : (e.kind = u, e.result = p, !1);
}
function ay(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (St(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else at(r) ? (St(e, n, i, !0), Cs(e, pe(e, !1, t)), n = i = e.position) : e.position === e.lineStart && Pi(e) ? B(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  B(e, "unexpected end of the stream within a single quoted scalar");
}
function sy(e, t) {
  var r, n, i, a, s, o;
  if (o = e.input.charCodeAt(e.position), o !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (o = e.input.charCodeAt(e.position)) !== 0; ) {
    if (o === 34)
      return St(e, r, e.position, !0), e.position++, !0;
    if (o === 92) {
      if (St(e, r, e.position, !0), o = e.input.charCodeAt(++e.position), at(o))
        pe(e, !1, t);
      else if (o < 256 && af[o])
        e.result += sf[o], e.position++;
      else if ((s = ey(o)) > 0) {
        for (i = s, a = 0; i > 0; i--)
          o = e.input.charCodeAt(++e.position), (s = Zg(o)) >= 0 ? a = (a << 4) + s : B(e, "expected hexadecimal character");
        e.result += ry(a), e.position++;
      } else
        B(e, "unknown escape sequence");
      r = n = e.position;
    } else at(o) ? (St(e, r, n, !0), Cs(e, pe(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Pi(e) ? B(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  B(e, "unexpected end of the stream within a double quoted scalar");
}
function oy(e, t) {
  var r = !0, n, i, a, s = e.tag, o, l = e.anchor, d, c, u, p, g, w = /* @__PURE__ */ Object.create(null), x, T, b, _;
  if (_ = e.input.charCodeAt(e.position), _ === 91)
    c = 93, g = !1, o = [];
  else if (_ === 123)
    c = 125, g = !0, o = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), _ = e.input.charCodeAt(++e.position); _ !== 0; ) {
    if (pe(e, !0, t), _ = e.input.charCodeAt(e.position), _ === c)
      return e.position++, e.tag = s, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = o, !0;
    r ? _ === 44 && B(e, "expected the node content, but found ','") : B(e, "missed comma between flow collection entries"), T = x = b = null, u = p = !1, _ === 63 && (d = e.input.charCodeAt(e.position + 1), Be(d) && (u = p = !0, e.position++, pe(e, !0, t))), n = e.line, i = e.lineStart, a = e.position, _r(e, t, mi, !1, !0), T = e.tag, x = e.result, pe(e, !0, t), _ = e.input.charCodeAt(e.position), (p || e.line === n) && _ === 58 && (u = !0, _ = e.input.charCodeAt(++e.position), pe(e, !0, t), _r(e, t, mi, !1, !0), b = e.result), g ? pr(e, o, w, T, x, b, n, i, a) : u ? o.push(pr(e, null, w, T, x, b, n, i, a)) : o.push(x), pe(e, !0, t), _ = e.input.charCodeAt(e.position), _ === 44 ? (r = !0, _ = e.input.charCodeAt(++e.position)) : r = !1;
  }
  B(e, "unexpected end of the stream within a flow collection");
}
function ly(e, t) {
  var r, n, i = ya, a = !1, s = !1, o = t, l = 0, d = !1, c, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    n = !1;
  else if (u === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      ya === i ? i = u === 43 ? Jo : Yg : B(e, "repeat of a chomping mode identifier");
    else if ((c = ty(u)) >= 0)
      c === 0 ? B(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? B(e, "repeat of an indentation width identifier") : (o = t + c - 1, s = !0);
    else
      break;
  if (Yt(u)) {
    do
      u = e.input.charCodeAt(++e.position);
    while (Yt(u));
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
      i === Jo ? e.result += qt.repeat(`
`, a ? 1 + l : l) : i === ya && a && (e.result += `
`);
      break;
    }
    for (n ? Yt(u) ? (d = !0, e.result += qt.repeat(`
`, a ? 1 + l : l)) : d ? (d = !1, e.result += qt.repeat(`
`, l + 1)) : l === 0 ? a && (e.result += " ") : e.result += qt.repeat(`
`, l) : e.result += qt.repeat(`
`, a ? 1 + l : l), a = !0, s = !0, l = 0, r = e.position; !at(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    St(e, r, e.position, !1);
  }
  return !0;
}
function rl(e, t) {
  var r, n = e.tag, i = e.anchor, a = [], s, o = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, B(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !Be(s)))); ) {
    if (o = !0, e.position++, pe(e, !0, -1) && e.lineIndent <= t) {
      a.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, _r(e, t, ef, !1, !0), a.push(e.result), pe(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      B(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return o ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function cy(e, t, r) {
  var n, i, a, s, o, l, d = e.tag, c = e.anchor, u = {}, p = /* @__PURE__ */ Object.create(null), g = null, w = null, x = null, T = !1, b = !1, _;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), _ = e.input.charCodeAt(e.position); _ !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, B(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), a = e.line, (_ === 63 || _ === 58) && Be(n))
      _ === 63 ? (T && (pr(e, u, p, g, w, null, s, o, l), g = w = x = null), b = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : B(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, _ = n;
    else {
      if (s = e.line, o = e.lineStart, l = e.position, !_r(e, r, Zu, !1, !0))
        break;
      if (e.line === a) {
        for (_ = e.input.charCodeAt(e.position); Yt(_); )
          _ = e.input.charCodeAt(++e.position);
        if (_ === 58)
          _ = e.input.charCodeAt(++e.position), Be(_) || B(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (pr(e, u, p, g, w, null, s, o, l), g = w = x = null), b = !0, T = !1, i = !1, g = e.tag, w = e.result;
        else if (b)
          B(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = d, e.anchor = c, !0;
      } else if (b)
        B(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = d, e.anchor = c, !0;
    }
    if ((e.line === a || e.lineIndent > t) && (T && (s = e.line, o = e.lineStart, l = e.position), _r(e, t, gi, !0, i) && (T ? w = e.result : x = e.result), T || (pr(e, u, p, g, w, x, s, o, l), g = w = x = null), pe(e, !0, -1), _ = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && _ !== 0)
      B(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && pr(e, u, p, g, w, null, s, o, l), b && (e.tag = d, e.anchor = c, e.kind = "mapping", e.result = u), b;
}
function uy(e) {
  var t, r = !1, n = !1, i, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && B(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (r = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (n = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (a = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : B(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !Be(s); )
      s === 33 && (n ? B(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), tf.test(i) || B(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    a = e.input.slice(t, e.position), Qg.test(a) && B(e, "tag suffix cannot contain flow indicator characters");
  }
  a && !rf.test(a) && B(e, "tag name cannot contain such characters: " + a);
  try {
    a = decodeURIComponent(a);
  } catch {
    B(e, "tag name is malformed: " + a);
  }
  return r ? e.tag = a : Rt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : B(e, 'undeclared tag handle "' + i + '"'), !0;
}
function fy(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && B(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Be(r) && !dr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && B(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function dy(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Be(n) && !dr(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && B(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), Rt.call(e.anchorMap, r) || B(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], pe(e, !0, -1), !0;
}
function _r(e, t, r, n, i) {
  var a, s, o, l = 1, d = !1, c = !1, u, p, g, w, x, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = s = o = gi === r || ef === r, n && pe(e, !0, -1) && (d = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; uy(e) || fy(e); )
      pe(e, !0, -1) ? (d = !0, o = a, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : o = !1;
  if (o && (o = d || i), (l === 1 || gi === r) && (mi === r || Zu === r ? x = t : x = t + 1, T = e.position - e.lineStart, l === 1 ? o && (rl(e, T) || cy(e, T, x)) || oy(e, x) ? c = !0 : (s && ly(e, x) || ay(e, x) || sy(e, x) ? c = !0 : dy(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && B(e, "alias node should not have any properties")) : iy(e, x, mi === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = o && rl(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && B(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, p = e.implicitTypes.length; u < p; u += 1)
      if (w = e.implicitTypes[u], w.resolve(e.result)) {
        e.result = w.construct(e.result), e.tag = w.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Rt.call(e.typeMap[e.kind || "fallback"], e.tag))
      w = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (w = null, g = e.typeMap.multi[e.kind || "fallback"], u = 0, p = g.length; u < p; u += 1)
        if (e.tag.slice(0, g[u].tag.length) === g[u].tag) {
          w = g[u];
          break;
        }
    w || B(e, "unknown tag !<" + e.tag + ">"), e.result !== null && w.kind !== e.kind && B(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + w.kind + '", not "' + e.kind + '"'), w.resolve(e.result, e.tag) ? (e.result = w.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : B(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function py(e) {
  var t = e.position, r, n, i, a = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (pe(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (a = !0, s = e.input.charCodeAt(++e.position), r = e.position; s !== 0 && !Be(s); )
      s = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && B(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; Yt(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !at(s));
        break;
      }
      if (at(s)) break;
      for (r = e.position; s !== 0 && !Be(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    s !== 0 && Is(e), Rt.call(el, n) ? el[n](e, n, i) : yi(e, 'unknown document directive "' + n + '"');
  }
  if (pe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, pe(e, !0, -1)) : a && B(e, "directives end mark is expected"), _r(e, e.lineIndent - 1, gi, !1, !0), pe(e, !0, -1), e.checkLineBreaks && Jg.test(e.input.slice(t, e.position)) && yi(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Pi(e)) {
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
  var r = new ny(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, B(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    py(r);
  return r.documents;
}
function hy(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = lf(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, a = n.length; i < a; i += 1)
    t(n[i]);
}
function my(e, t) {
  var r = lf(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new Qu("expected a single document in the stream, but found more");
  }
}
bs.loadAll = hy;
bs.load = my;
var cf = {}, ki = Je, mn = hn, gy = As, uf = Object.prototype.toString, ff = Object.prototype.hasOwnProperty, Rs = 65279, yy = 9, Zr = 10, xy = 13, wy = 32, Ey = 33, vy = 34, Va = 35, Ty = 37, _y = 38, by = 39, Sy = 42, df = 44, Ay = 45, xi = 58, Iy = 61, Cy = 62, Ry = 63, Dy = 64, pf = 91, hf = 93, Oy = 96, mf = 123, Py = 124, gf = 125, Re = {};
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
var ky = [
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
], Ny = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Fy(e, t) {
  var r, n, i, a, s, o, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, a = n.length; i < a; i += 1)
    s = n[i], o = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && ff.call(l.styleAliases, o) && (o = l.styleAliases[o]), r[s] = o;
  return r;
}
function $y(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new mn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + ki.repeat("0", n - t.length) + t;
}
var Ly = 1, en = 2;
function Uy(e) {
  this.schema = e.schema || gy, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ki.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Fy(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? en : Ly, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function nl(e, t) {
  for (var r = ki.repeat(" ", t), n = 0, i = -1, a = "", s, o = e.length; n < o; )
    i = e.indexOf(`
`, n), i === -1 ? (s = e.slice(n), n = o) : (s = e.slice(n, i + 1), n = i + 1), s.length && s !== `
` && (a += r), a += s;
  return a;
}
function Ya(e, t) {
  return `
` + ki.repeat(" ", e.indent * t);
}
function My(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function wi(e) {
  return e === wy || e === yy;
}
function tn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Rs || 65536 <= e && e <= 1114111;
}
function il(e) {
  return tn(e) && e !== Rs && e !== xy && e !== Zr;
}
function al(e, t, r) {
  var n = il(e), i = n && !wi(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== df && e !== pf && e !== hf && e !== mf && e !== gf) && e !== Va && !(t === xi && !i) || il(t) && !wi(t) && e === Va || t === xi && i
  );
}
function By(e) {
  return tn(e) && e !== Rs && !wi(e) && e !== Ay && e !== Ry && e !== xi && e !== df && e !== pf && e !== hf && e !== mf && e !== gf && e !== Va && e !== _y && e !== Sy && e !== Ey && e !== Py && e !== Iy && e !== Cy && e !== by && e !== vy && e !== Ty && e !== Dy && e !== Oy;
}
function jy(e) {
  return !wi(e) && e !== xi;
}
function jr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function yf(e) {
  var t = /^\n* /;
  return t.test(e);
}
var xf = 1, Ka = 2, wf = 3, Ef = 4, fr = 5;
function Gy(e, t, r, n, i, a, s, o) {
  var l, d = 0, c = null, u = !1, p = !1, g = n !== -1, w = -1, x = By(jr(e, 0)) && jy(jr(e, e.length - 1));
  if (t || s)
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = jr(e, l), !tn(d))
        return fr;
      x = x && al(d, c, o), c = d;
    }
  else {
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = jr(e, l), d === Zr)
        u = !0, g && (p = p || // Foldable line = too long, and not more-indented.
        l - w - 1 > n && e[w + 1] !== " ", w = l);
      else if (!tn(d))
        return fr;
      x = x && al(d, c, o), c = d;
    }
    p = p || g && l - w - 1 > n && e[w + 1] !== " ";
  }
  return !u && !p ? x && !s && !i(e) ? xf : a === en ? fr : Ka : r > 9 && yf(e) ? fr : s ? a === en ? fr : Ka : p ? Ef : wf;
}
function zy(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === en ? '""' : "''";
    if (!e.noCompatMode && (ky.indexOf(t) !== -1 || Ny.test(t)))
      return e.quotingType === en ? '"' + t + '"' : "'" + t + "'";
    var a = e.indent * Math.max(1, r), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), o = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(d) {
      return My(e, d);
    }
    switch (Gy(
      t,
      o,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case xf:
        return t;
      case Ka:
        return "'" + t.replace(/'/g, "''") + "'";
      case wf:
        return "|" + sl(t, e.indent) + ol(nl(t, a));
      case Ef:
        return ">" + sl(t, e.indent) + ol(nl(Hy(t, s), a));
      case fr:
        return '"' + qy(t) + '"';
      default:
        throw new mn("impossible error: invalid scalar style");
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
function ol(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function Hy(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var d = e.indexOf(`
`);
    return d = d !== -1 ? d : e.length, r.lastIndex = d, ll(e.slice(0, d), t);
  }(), i = e[0] === `
` || e[0] === " ", a, s; s = r.exec(e); ) {
    var o = s[1], l = s[2];
    a = l[0] === " ", n += o + (!i && !a && l !== "" ? `
` : "") + ll(l, t), i = a;
  }
  return n;
}
function ll(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, a, s = 0, o = 0, l = ""; n = r.exec(e); )
    o = n.index, o - i > t && (a = s > i ? s : o, l += `
` + e.slice(i, a), i = a + 1), s = o;
  return l += `
`, e.length - i > t && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function qy(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = jr(e, i), n = Re[r], !n && tn(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || $y(r);
  return t;
}
function Xy(e, t, r) {
  var n = "", i = e.tag, a, s, o;
  for (a = 0, s = r.length; a < s; a += 1)
    o = r[a], e.replacer && (o = e.replacer.call(r, String(a), o)), (pt(e, t, o, !1, !1) || typeof o > "u" && pt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function cl(e, t, r, n) {
  var i = "", a = e.tag, s, o, l;
  for (s = 0, o = r.length; s < o; s += 1)
    l = r[s], e.replacer && (l = e.replacer.call(r, String(s), l)), (pt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && pt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Ya(e, t)), e.dump && Zr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = a, e.dump = i || "[]";
}
function Wy(e, t, r) {
  var n = "", i = e.tag, a = Object.keys(r), s, o, l, d, c;
  for (s = 0, o = a.length; s < o; s += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = a[s], d = r[l], e.replacer && (d = e.replacer.call(r, l, d)), pt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), pt(e, t, d, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function Vy(e, t, r, n) {
  var i = "", a = e.tag, s = Object.keys(r), o, l, d, c, u, p;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new mn("sortKeys must be a boolean or a function");
  for (o = 0, l = s.length; o < l; o += 1)
    p = "", (!n || i !== "") && (p += Ya(e, t)), d = s[o], c = r[d], e.replacer && (c = e.replacer.call(r, d, c)), pt(e, t + 1, d, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && Zr === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, u && (p += Ya(e, t)), pt(e, t + 1, c, !0, u) && (e.dump && Zr === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p));
  e.tag = a, e.dump = i || "{}";
}
function ul(e, t, r) {
  var n, i, a, s, o, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, a = 0, s = i.length; a < s; a += 1)
    if (o = i[a], (o.instanceOf || o.predicate) && (!o.instanceOf || typeof t == "object" && t instanceof o.instanceOf) && (!o.predicate || o.predicate(t))) {
      if (r ? o.multi && o.representName ? e.tag = o.representName(t) : e.tag = o.tag : e.tag = "?", o.represent) {
        if (l = e.styleMap[o.tag] || o.defaultStyle, uf.call(o.represent) === "[object Function]")
          n = o.represent(t, l);
        else if (ff.call(o.represent, l))
          n = o.represent[l](t, l);
        else
          throw new mn("!<" + o.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function pt(e, t, r, n, i, a, s) {
  e.tag = null, e.dump = r, ul(e, r, !1) || ul(e, r, !0);
  var o = uf.call(e.dump), l = n, d;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = o === "[object Object]" || o === "[object Array]", u, p;
  if (c && (u = e.duplicates.indexOf(r), p = u !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (i = !1), p && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (c && p && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), o === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (Vy(e, t, e.dump, i), p && (e.dump = "&ref_" + u + e.dump)) : (Wy(e, t, e.dump), p && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? cl(e, t - 1, e.dump, i) : cl(e, t, e.dump, i), p && (e.dump = "&ref_" + u + e.dump)) : (Xy(e, t, e.dump), p && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object String]")
      e.tag !== "?" && zy(e, e.dump, t, a, l);
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
function Yy(e, t) {
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
function Ky(e, t) {
  t = t || {};
  var r = new Uy(t);
  r.noRefs || Yy(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), pt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
cf.dump = Ky;
var vf = bs, Jy = cf;
function Ds(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
be.Type = Le;
be.Schema = Pu;
be.FAILSAFE_SCHEMA = $u;
be.JSON_SCHEMA = Gu;
be.CORE_SCHEMA = zu;
be.DEFAULT_SCHEMA = As;
be.load = vf.load;
be.loadAll = vf.loadAll;
be.dump = Jy.dump;
be.YAMLException = hn;
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
be.safeLoad = Ds("safeLoad", "load");
be.safeLoadAll = Ds("safeLoadAll", "loadAll");
be.safeDump = Ds("safeDump", "dump");
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.Lazy = void 0;
class Qy {
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
Ni.Lazy = Qy;
var Qa = { exports: {} };
const Zy = "2.0.0", Tf = 256, ex = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, tx = 16, rx = Tf - 6, nx = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Fi = {
  MAX_LENGTH: Tf,
  MAX_SAFE_COMPONENT_LENGTH: tx,
  MAX_SAFE_BUILD_LENGTH: rx,
  MAX_SAFE_INTEGER: ex,
  RELEASE_TYPES: nx,
  SEMVER_SPEC_VERSION: Zy,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const ix = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var $i = ix;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = Fi, a = $i;
  t = e.exports = {};
  const s = t.re = [], o = t.safeRe = [], l = t.src = [], d = t.safeSrc = [], c = t.t = {};
  let u = 0;
  const p = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [p, n]
  ], w = (T) => {
    for (const [b, _] of g)
      T = T.split(`${b}*`).join(`${b}{0,${_}}`).split(`${b}+`).join(`${b}{1,${_}}`);
    return T;
  }, x = (T, b, _) => {
    const F = w(b), D = u++;
    a(T, D, b), c[T] = D, l[D] = b, d[D] = F, s[D] = new RegExp(b, _ ? "g" : void 0), o[D] = new RegExp(F, _ ? "g" : void 0);
  };
  x("NUMERICIDENTIFIER", "0|[1-9]\\d*"), x("NUMERICIDENTIFIERLOOSE", "\\d+"), x("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${p}*`), x("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), x("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), x("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), x("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), x("BUILDIDENTIFIER", `${p}+`), x("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), x("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), x("FULL", `^${l[c.FULLPLAIN]}$`), x("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), x("LOOSE", `^${l[c.LOOSEPLAIN]}$`), x("GTLT", "((?:<|>)?=?)"), x("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), x("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), x("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), x("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), x("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), x("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), x("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), x("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), x("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), x("COERCERTL", l[c.COERCE], !0), x("COERCERTLFULL", l[c.COERCEFULL], !0), x("LONETILDE", "(?:~>?)"), x("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", x("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), x("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), x("LONECARET", "(?:\\^)"), x("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", x("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), x("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), x("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), x("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), x("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", x("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), x("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), x("STAR", "(<|>)?=?\\s*\\*"), x("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), x("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Qa, Qa.exports);
var gn = Qa.exports;
const ax = Object.freeze({ loose: !0 }), sx = Object.freeze({}), ox = (e) => e ? typeof e != "object" ? ax : e : sx;
var Os = ox;
const fl = /^[0-9]+$/, _f = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = fl.test(e), n = fl.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, lx = (e, t) => _f(t, e);
var bf = {
  compareIdentifiers: _f,
  rcompareIdentifiers: lx
};
const Bn = $i, { MAX_LENGTH: dl, MAX_SAFE_INTEGER: jn } = Fi, { safeRe: Gn, t: zn } = gn, cx = Os, { compareIdentifiers: xa } = bf;
let ux = class it {
  constructor(t, r) {
    if (r = cx(r), t instanceof it) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > dl)
      throw new TypeError(
        `version is longer than ${dl} characters`
      );
    Bn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Gn[zn.LOOSE] : Gn[zn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > jn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > jn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > jn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const a = +i;
        if (a >= 0 && a < jn)
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
    if (Bn("SemVer.compare", this.version, this.options, t), !(t instanceof it)) {
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
      if (Bn("prerelease compare", r, n, i), n === void 0 && i === void 0)
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
      if (Bn("build compare", r, n, i), n === void 0 && i === void 0)
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
        const i = `-${r}`.match(this.options.loose ? Gn[zn.PRERELEASELOOSE] : Gn[zn.PRERELEASE]);
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
var Ue = ux;
const pl = Ue, fx = (e, t, r = !1) => {
  if (e instanceof pl)
    return e;
  try {
    return new pl(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Cr = fx;
const dx = Cr, px = (e, t) => {
  const r = dx(e, t);
  return r ? r.version : null;
};
var hx = px;
const mx = Cr, gx = (e, t) => {
  const r = mx(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var yx = gx;
const hl = Ue, xx = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new hl(
      e instanceof hl ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var wx = xx;
const ml = Cr, Ex = (e, t) => {
  const r = ml(e, null, !0), n = ml(t, null, !0), i = r.compare(n);
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
var vx = Ex;
const Tx = Ue, _x = (e, t) => new Tx(e, t).major;
var bx = _x;
const Sx = Ue, Ax = (e, t) => new Sx(e, t).minor;
var Ix = Ax;
const Cx = Ue, Rx = (e, t) => new Cx(e, t).patch;
var Dx = Rx;
const Ox = Cr, Px = (e, t) => {
  const r = Ox(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var kx = Px;
const gl = Ue, Nx = (e, t, r) => new gl(e, r).compare(new gl(t, r));
var Qe = Nx;
const Fx = Qe, $x = (e, t, r) => Fx(t, e, r);
var Lx = $x;
const Ux = Qe, Mx = (e, t) => Ux(e, t, !0);
var Bx = Mx;
const yl = Ue, jx = (e, t, r) => {
  const n = new yl(e, r), i = new yl(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Ps = jx;
const Gx = Ps, zx = (e, t) => e.sort((r, n) => Gx(r, n, t));
var Hx = zx;
const qx = Ps, Xx = (e, t) => e.sort((r, n) => qx(n, r, t));
var Wx = Xx;
const Vx = Qe, Yx = (e, t, r) => Vx(e, t, r) > 0;
var Li = Yx;
const Kx = Qe, Jx = (e, t, r) => Kx(e, t, r) < 0;
var ks = Jx;
const Qx = Qe, Zx = (e, t, r) => Qx(e, t, r) === 0;
var Sf = Zx;
const ew = Qe, tw = (e, t, r) => ew(e, t, r) !== 0;
var Af = tw;
const rw = Qe, nw = (e, t, r) => rw(e, t, r) >= 0;
var Ns = nw;
const iw = Qe, aw = (e, t, r) => iw(e, t, r) <= 0;
var Fs = aw;
const sw = Sf, ow = Af, lw = Li, cw = Ns, uw = ks, fw = Fs, dw = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return sw(e, r, n);
    case "!=":
      return ow(e, r, n);
    case ">":
      return lw(e, r, n);
    case ">=":
      return cw(e, r, n);
    case "<":
      return uw(e, r, n);
    case "<=":
      return fw(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var If = dw;
const pw = Ue, hw = Cr, { safeRe: Hn, t: qn } = gn, mw = (e, t) => {
  if (e instanceof pw)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Hn[qn.COERCEFULL] : Hn[qn.COERCE]);
  else {
    const l = t.includePrerelease ? Hn[qn.COERCERTLFULL] : Hn[qn.COERCERTL];
    let d;
    for (; (d = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), l.lastIndex = d.index + d[1].length + d[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", a = r[4] || "0", s = t.includePrerelease && r[5] ? `-${r[5]}` : "", o = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return hw(`${n}.${i}.${a}${s}${o}`, t);
};
var gw = mw;
class yw {
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
var xw = yw, wa, xl;
function Ze() {
  if (xl) return wa;
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
        if (this.set = this.set.filter(($) => !x($[0])), this.set.length === 0)
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
      const S = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + I, $ = n.get(S);
      if ($)
        return $;
      const O = this.options.loose, z = O ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      I = I.replace(z, M(this.options.includePrerelease)), s("hyphen replace", I), I = I.replace(l[d.COMPARATORTRIM], c), s("comparator trim", I), I = I.replace(l[d.TILDETRIM], u), s("tilde trim", I), I = I.replace(l[d.CARETTRIM], p), s("caret trim", I);
      let Y = I.split(" ").map((G) => _(G, this.options)).join(" ").split(/\s+/).map((G) => U(G, this.options));
      O && (Y = Y.filter((G) => (s("loose invalid filter", G, this.options), !!G.match(l[d.COMPARATORLOOSE])))), s("range list", Y);
      const X = /* @__PURE__ */ new Map(), re = Y.map((G) => new a(G, this.options));
      for (const G of re) {
        if (x(G))
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
          I = new o(I, this.options);
        } catch {
          return !1;
        }
      for (let P = 0; P < this.set.length; P++)
        if (J(this.set[P], I, this.options))
          return !0;
      return !1;
    }
  }
  wa = t;
  const r = xw, n = new r(), i = Os, a = Ui(), s = $i, o = Ue, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: c,
    tildeTrimReplace: u,
    caretTrimReplace: p
  } = gn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = Fi, x = (R) => R.value === "<0.0.0-0", T = (R) => R.value === "", b = (R, I) => {
    let P = !0;
    const S = R.slice();
    let $ = S.pop();
    for (; P && S.length; )
      P = S.every((O) => $.intersects(O, I)), $ = S.pop();
    return P;
  }, _ = (R, I) => (R = R.replace(l[d.BUILD], ""), s("comp", R, I), R = H(R, I), s("caret", R), R = D(R, I), s("tildes", R), R = te(R, I), s("xrange", R), R = j(R, I), s("stars", R), R), F = (R) => !R || R.toLowerCase() === "x" || R === "*", D = (R, I) => R.trim().split(/\s+/).map((P) => k(P, I)).join(" "), k = (R, I) => {
    const P = I.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return R.replace(P, (S, $, O, z, Y) => {
      s("tilde", R, S, $, O, z, Y);
      let X;
      return F($) ? X = "" : F(O) ? X = `>=${$}.0.0 <${+$ + 1}.0.0-0` : F(z) ? X = `>=${$}.${O}.0 <${$}.${+O + 1}.0-0` : Y ? (s("replaceTilde pr", Y), X = `>=${$}.${O}.${z}-${Y} <${$}.${+O + 1}.0-0`) : X = `>=${$}.${O}.${z} <${$}.${+O + 1}.0-0`, s("tilde return", X), X;
    });
  }, H = (R, I) => R.trim().split(/\s+/).map((P) => q(P, I)).join(" "), q = (R, I) => {
    s("caret", R, I);
    const P = I.loose ? l[d.CARETLOOSE] : l[d.CARET], S = I.includePrerelease ? "-0" : "";
    return R.replace(P, ($, O, z, Y, X) => {
      s("caret", R, $, O, z, Y, X);
      let re;
      return F(O) ? re = "" : F(z) ? re = `>=${O}.0.0${S} <${+O + 1}.0.0-0` : F(Y) ? O === "0" ? re = `>=${O}.${z}.0${S} <${O}.${+z + 1}.0-0` : re = `>=${O}.${z}.0${S} <${+O + 1}.0.0-0` : X ? (s("replaceCaret pr", X), O === "0" ? z === "0" ? re = `>=${O}.${z}.${Y}-${X} <${O}.${z}.${+Y + 1}-0` : re = `>=${O}.${z}.${Y}-${X} <${O}.${+z + 1}.0-0` : re = `>=${O}.${z}.${Y}-${X} <${+O + 1}.0.0-0`) : (s("no pr"), O === "0" ? z === "0" ? re = `>=${O}.${z}.${Y}${S} <${O}.${z}.${+Y + 1}-0` : re = `>=${O}.${z}.${Y}${S} <${O}.${+z + 1}.0-0` : re = `>=${O}.${z}.${Y} <${+O + 1}.0.0-0`), s("caret return", re), re;
    });
  }, te = (R, I) => (s("replaceXRanges", R, I), R.split(/\s+/).map((P) => y(P, I)).join(" ")), y = (R, I) => {
    R = R.trim();
    const P = I.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return R.replace(P, (S, $, O, z, Y, X) => {
      s("xRange", R, S, $, O, z, Y, X);
      const re = F(O), ge = re || F(z), G = ge || F(Y), et = G;
      return $ === "=" && et && ($ = ""), X = I.includePrerelease ? "-0" : "", re ? $ === ">" || $ === "<" ? S = "<0.0.0-0" : S = "*" : $ && et ? (ge && (z = 0), Y = 0, $ === ">" ? ($ = ">=", ge ? (O = +O + 1, z = 0, Y = 0) : (z = +z + 1, Y = 0)) : $ === "<=" && ($ = "<", ge ? O = +O + 1 : z = +z + 1), $ === "<" && (X = "-0"), S = `${$ + O}.${z}.${Y}${X}`) : ge ? S = `>=${O}.0.0${X} <${+O + 1}.0.0-0` : G && (S = `>=${O}.${z}.0${X} <${O}.${+z + 1}.0-0`), s("xRange return", S), S;
    });
  }, j = (R, I) => (s("replaceStars", R, I), R.trim().replace(l[d.STAR], "")), U = (R, I) => (s("replaceGTE0", R, I), R.trim().replace(l[I.includePrerelease ? d.GTE0PRE : d.GTE0], "")), M = (R) => (I, P, S, $, O, z, Y, X, re, ge, G, et) => (F(S) ? P = "" : F($) ? P = `>=${S}.0.0${R ? "-0" : ""}` : F(O) ? P = `>=${S}.${$}.0${R ? "-0" : ""}` : z ? P = `>=${P}` : P = `>=${P}${R ? "-0" : ""}`, F(re) ? X = "" : F(ge) ? X = `<${+re + 1}.0.0-0` : F(G) ? X = `<${re}.${+ge + 1}.0-0` : et ? X = `<=${re}.${ge}.${G}-${et}` : R ? X = `<${re}.${ge}.${+G + 1}-0` : X = `<=${X}`, `${P} ${X}`.trim()), J = (R, I, P) => {
    for (let S = 0; S < R.length; S++)
      if (!R[S].test(I))
        return !1;
    if (I.prerelease.length && !P.includePrerelease) {
      for (let S = 0; S < R.length; S++)
        if (s(R[S].semver), R[S].semver !== a.ANY && R[S].semver.prerelease.length > 0) {
          const $ = R[S].semver;
          if ($.major === I.major && $.minor === I.minor && $.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return wa;
}
var Ea, wl;
function Ui() {
  if (wl) return Ea;
  wl = 1;
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
  Ea = t;
  const r = Os, { safeRe: n, t: i } = gn, a = If, s = $i, o = Ue, l = Ze();
  return Ea;
}
const ww = Ze(), Ew = (e, t, r) => {
  try {
    t = new ww(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Mi = Ew;
const vw = Ze(), Tw = (e, t) => new vw(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var _w = Tw;
const bw = Ue, Sw = Ze(), Aw = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new Sw(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === -1) && (n = s, i = new bw(n, r));
  }), n;
};
var Iw = Aw;
const Cw = Ue, Rw = Ze(), Dw = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new Rw(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === 1) && (n = s, i = new Cw(n, r));
  }), n;
};
var Ow = Dw;
const va = Ue, Pw = Ze(), El = Li, kw = (e, t) => {
  e = new Pw(e, t);
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
          (!a || El(o, a)) && (a = o);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), a && (!r || El(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var Nw = kw;
const Fw = Ze(), $w = (e, t) => {
  try {
    return new Fw(e, t).range || "*";
  } catch {
    return null;
  }
};
var Lw = $w;
const Uw = Ue, Cf = Ui(), { ANY: Mw } = Cf, Bw = Ze(), jw = Mi, vl = Li, Tl = ks, Gw = Fs, zw = Ns, Hw = (e, t, r, n) => {
  e = new Uw(e, n), t = new Bw(t, n);
  let i, a, s, o, l;
  switch (r) {
    case ">":
      i = vl, a = Gw, s = Tl, o = ">", l = ">=";
      break;
    case "<":
      i = Tl, a = zw, s = vl, o = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (jw(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const c = t.set[d];
    let u = null, p = null;
    if (c.forEach((g) => {
      g.semver === Mw && (g = new Cf(">=0.0.0")), u = u || g, p = p || g, i(g.semver, u.semver, n) ? u = g : s(g.semver, p.semver, n) && (p = g);
    }), u.operator === o || u.operator === l || (!p.operator || p.operator === o) && a(e, p.semver))
      return !1;
    if (p.operator === l && s(e, p.semver))
      return !1;
  }
  return !0;
};
var $s = Hw;
const qw = $s, Xw = (e, t, r) => qw(e, t, ">", r);
var Ww = Xw;
const Vw = $s, Yw = (e, t, r) => Vw(e, t, "<", r);
var Kw = Yw;
const _l = Ze(), Jw = (e, t, r) => (e = new _l(e, r), t = new _l(t, r), e.intersects(t, r));
var Qw = Jw;
const Zw = Mi, eE = Qe;
var tE = (e, t, r) => {
  const n = [];
  let i = null, a = null;
  const s = e.sort((c, u) => eE(c, u, r));
  for (const c of s)
    Zw(c, t, r) ? (a = c, i || (i = c)) : (a && n.push([i, a]), a = null, i = null);
  i && n.push([i, null]);
  const o = [];
  for (const [c, u] of n)
    c === u ? o.push(c) : !u && c === s[0] ? o.push("*") : u ? c === s[0] ? o.push(`<=${u}`) : o.push(`${c} - ${u}`) : o.push(`>=${c}`);
  const l = o.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const bl = Ze(), Ls = Ui(), { ANY: Ta } = Ls, Lr = Mi, Us = Qe, rE = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new bl(e, r), t = new bl(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const a of t.set) {
      const s = iE(i, a, r);
      if (n = n || s !== null, s)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, nE = [new Ls(">=0.0.0-0")], Sl = [new Ls(">=0.0.0")], iE = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Ta) {
    if (t.length === 1 && t[0].semver === Ta)
      return !0;
    r.includePrerelease ? e = nE : e = Sl;
  }
  if (t.length === 1 && t[0].semver === Ta) {
    if (r.includePrerelease)
      return !0;
    t = Sl;
  }
  const n = /* @__PURE__ */ new Set();
  let i, a;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = Al(i, g, r) : g.operator === "<" || g.operator === "<=" ? a = Il(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let s;
  if (i && a) {
    if (s = Us(i.semver, a.semver, r), s > 0)
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
        if (o = Al(i, g, r), o === g && o !== i)
          return !1;
      } else if (i.operator === ">=" && !Lr(i.semver, String(g), r))
        return !1;
    }
    if (a) {
      if (u && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === u.major && g.semver.minor === u.minor && g.semver.patch === u.patch && (u = !1), g.operator === "<" || g.operator === "<=") {
        if (l = Il(a, g, r), l === g && l !== a)
          return !1;
      } else if (a.operator === "<=" && !Lr(a.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (a || i) && s !== 0)
      return !1;
  }
  return !(i && d && !a && s !== 0 || a && c && !i && s !== 0 || p || u);
}, Al = (e, t, r) => {
  if (!e)
    return t;
  const n = Us(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Il = (e, t, r) => {
  if (!e)
    return t;
  const n = Us(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var aE = rE;
const _a = gn, Cl = Fi, sE = Ue, Rl = bf, oE = Cr, lE = hx, cE = yx, uE = wx, fE = vx, dE = bx, pE = Ix, hE = Dx, mE = kx, gE = Qe, yE = Lx, xE = Bx, wE = Ps, EE = Hx, vE = Wx, TE = Li, _E = ks, bE = Sf, SE = Af, AE = Ns, IE = Fs, CE = If, RE = gw, DE = Ui(), OE = Ze(), PE = Mi, kE = _w, NE = Iw, FE = Ow, $E = Nw, LE = Lw, UE = $s, ME = Ww, BE = Kw, jE = Qw, GE = tE, zE = aE;
var Rf = {
  parse: oE,
  valid: lE,
  clean: cE,
  inc: uE,
  diff: fE,
  major: dE,
  minor: pE,
  patch: hE,
  prerelease: mE,
  compare: gE,
  rcompare: yE,
  compareLoose: xE,
  compareBuild: wE,
  sort: EE,
  rsort: vE,
  gt: TE,
  lt: _E,
  eq: bE,
  neq: SE,
  gte: AE,
  lte: IE,
  cmp: CE,
  coerce: RE,
  Comparator: DE,
  Range: OE,
  satisfies: PE,
  toComparators: kE,
  maxSatisfying: NE,
  minSatisfying: FE,
  minVersion: $E,
  validRange: LE,
  outside: UE,
  gtr: ME,
  ltr: BE,
  intersects: jE,
  simplifyRange: GE,
  subset: zE,
  SemVer: sE,
  re: _a.re,
  src: _a.src,
  tokens: _a.t,
  SEMVER_SPEC_VERSION: Cl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Cl.RELEASE_TYPES,
  compareIdentifiers: Rl.compareIdentifiers,
  rcompareIdentifiers: Rl.rcompareIdentifiers
}, yn = {}, Ei = { exports: {} };
Ei.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, a = 2, s = 9007199254740991, o = "[object Arguments]", l = "[object Array]", d = "[object AsyncFunction]", c = "[object Boolean]", u = "[object Date]", p = "[object Error]", g = "[object Function]", w = "[object GeneratorFunction]", x = "[object Map]", T = "[object Number]", b = "[object Null]", _ = "[object Object]", F = "[object Promise]", D = "[object Proxy]", k = "[object RegExp]", H = "[object Set]", q = "[object String]", te = "[object Symbol]", y = "[object Undefined]", j = "[object WeakMap]", U = "[object ArrayBuffer]", M = "[object DataView]", J = "[object Float32Array]", R = "[object Float64Array]", I = "[object Int8Array]", P = "[object Int16Array]", S = "[object Int32Array]", $ = "[object Uint8Array]", O = "[object Uint8ClampedArray]", z = "[object Uint16Array]", Y = "[object Uint32Array]", X = /[\\^$.*+?()[\]{}|]/g, re = /^\[object .+?Constructor\]$/, ge = /^(?:0|[1-9]\d*)$/, G = {};
  G[J] = G[R] = G[I] = G[P] = G[S] = G[$] = G[O] = G[z] = G[Y] = !0, G[o] = G[l] = G[U] = G[c] = G[M] = G[u] = G[p] = G[g] = G[x] = G[T] = G[_] = G[k] = G[H] = G[q] = G[j] = !1;
  var et = typeof Pe == "object" && Pe && Pe.Object === Object && Pe, h = typeof self == "object" && self && self.Object === Object && self, f = et || h || Function("return this")(), A = t && !t.nodeType && t, v = A && !0 && e && !e.nodeType && e, Z = v && v.exports === A, ae = Z && et.process, ue = function() {
    try {
      return ae && ae.binding && ae.binding("util");
    } catch {
    }
  }(), ve = ue && ue.isTypedArray;
  function Se(m, E) {
    for (var C = -1, L = m == null ? 0 : m.length, se = 0, V = []; ++C < L; ) {
      var fe = m[C];
      E(fe, C, m) && (V[se++] = fe);
    }
    return V;
  }
  function mt(m, E) {
    for (var C = -1, L = E.length, se = m.length; ++C < L; )
      m[se + C] = E[C];
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
  function Qi(m) {
    return function(E) {
      return m(E);
    };
  }
  function _n(m, E) {
    return m.has(E);
  }
  function Dr(m, E) {
    return m == null ? void 0 : m[E];
  }
  function bn(m) {
    var E = -1, C = Array(m.size);
    return m.forEach(function(L, se) {
      C[++E] = [se, L];
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
  var md = Array.prototype, gd = Function.prototype, Sn = Object.prototype, Zi = f["__core-js_shared__"], Vs = gd.toString, tt = Sn.hasOwnProperty, Ys = function() {
    var m = /[^.]+$/.exec(Zi && Zi.keys && Zi.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), Ks = Sn.toString, yd = RegExp(
    "^" + Vs.call(tt).replace(X, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Js = Z ? f.Buffer : void 0, An = f.Symbol, Qs = f.Uint8Array, Zs = Sn.propertyIsEnumerable, xd = md.splice, Ft = An ? An.toStringTag : void 0, eo = Object.getOwnPropertySymbols, wd = Js ? Js.isBuffer : void 0, Ed = pd(Object.keys, Object), ea = nr(f, "DataView"), Or = nr(f, "Map"), ta = nr(f, "Promise"), ra = nr(f, "Set"), na = nr(f, "WeakMap"), Pr = nr(Object, "create"), vd = Ut(ea), Td = Ut(Or), _d = Ut(ta), bd = Ut(ra), Sd = Ut(na), to = An ? An.prototype : void 0, ia = to ? to.valueOf : void 0;
  function $t(m) {
    var E = -1, C = m == null ? 0 : m.length;
    for (this.clear(); ++E < C; ) {
      var L = m[E];
      this.set(L[0], L[1]);
    }
  }
  function Ad() {
    this.__data__ = Pr ? Pr(null) : {}, this.size = 0;
  }
  function Id(m) {
    var E = this.has(m) && delete this.__data__[m];
    return this.size -= E ? 1 : 0, E;
  }
  function Cd(m) {
    var E = this.__data__;
    if (Pr) {
      var C = E[m];
      return C === n ? void 0 : C;
    }
    return tt.call(E, m) ? E[m] : void 0;
  }
  function Rd(m) {
    var E = this.__data__;
    return Pr ? E[m] !== void 0 : tt.call(E, m);
  }
  function Dd(m, E) {
    var C = this.__data__;
    return this.size += this.has(m) ? 0 : 1, C[m] = Pr && E === void 0 ? n : E, this;
  }
  $t.prototype.clear = Ad, $t.prototype.delete = Id, $t.prototype.get = Cd, $t.prototype.has = Rd, $t.prototype.set = Dd;
  function lt(m) {
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
    var E = this.__data__, C = Cn(E, m);
    if (C < 0)
      return !1;
    var L = E.length - 1;
    return C == L ? E.pop() : xd.call(E, C, 1), --this.size, !0;
  }
  function kd(m) {
    var E = this.__data__, C = Cn(E, m);
    return C < 0 ? void 0 : E[C][1];
  }
  function Nd(m) {
    return Cn(this.__data__, m) > -1;
  }
  function Fd(m, E) {
    var C = this.__data__, L = Cn(C, m);
    return L < 0 ? (++this.size, C.push([m, E])) : C[L][1] = E, this;
  }
  lt.prototype.clear = Od, lt.prototype.delete = Pd, lt.prototype.get = kd, lt.prototype.has = Nd, lt.prototype.set = Fd;
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
      map: new (Or || lt)(),
      string: new $t()
    };
  }
  function Ld(m) {
    var E = Rn(this, m).delete(m);
    return this.size -= E ? 1 : 0, E;
  }
  function Ud(m) {
    return Rn(this, m).get(m);
  }
  function Md(m) {
    return Rn(this, m).has(m);
  }
  function Bd(m, E) {
    var C = Rn(this, m), L = C.size;
    return C.set(m, E), this.size += C.size == L ? 0 : 1, this;
  }
  Lt.prototype.clear = $d, Lt.prototype.delete = Ld, Lt.prototype.get = Ud, Lt.prototype.has = Md, Lt.prototype.set = Bd;
  function In(m) {
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
  In.prototype.add = In.prototype.push = jd, In.prototype.has = Gd;
  function gt(m) {
    var E = this.__data__ = new lt(m);
    this.size = E.size;
  }
  function zd() {
    this.__data__ = new lt(), this.size = 0;
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
    if (C instanceof lt) {
      var L = C.__data__;
      if (!Or || L.length < r - 1)
        return L.push([m, E]), this.size = ++C.size, this;
      C = this.__data__ = new Lt(L);
    }
    return C.set(m, E), this.size = C.size, this;
  }
  gt.prototype.clear = zd, gt.prototype.delete = Hd, gt.prototype.get = qd, gt.prototype.has = Xd, gt.prototype.set = Wd;
  function Vd(m, E) {
    var C = Dn(m), L = !C && cp(m), se = !C && !L && aa(m), V = !C && !L && !se && uo(m), fe = C || L || se || V, ye = fe ? We(m.length, String) : [], Te = ye.length;
    for (var oe in m)
      tt.call(m, oe) && !(fe && // Safari 9 has enumerable `arguments.length` in strict mode.
      (oe == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      se && (oe == "offset" || oe == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      V && (oe == "buffer" || oe == "byteLength" || oe == "byteOffset") || // Skip index properties.
      ip(oe, Te))) && ye.push(oe);
    return ye;
  }
  function Cn(m, E) {
    for (var C = m.length; C--; )
      if (so(m[C][0], E))
        return C;
    return -1;
  }
  function Yd(m, E, C) {
    var L = E(m);
    return Dn(m) ? L : mt(L, C(m));
  }
  function kr(m) {
    return m == null ? m === void 0 ? y : b : Ft && Ft in Object(m) ? rp(m) : lp(m);
  }
  function ro(m) {
    return Nr(m) && kr(m) == o;
  }
  function no(m, E, C, L, se) {
    return m === E ? !0 : m == null || E == null || !Nr(m) && !Nr(E) ? m !== m && E !== E : Kd(m, E, C, L, no, se);
  }
  function Kd(m, E, C, L, se, V) {
    var fe = Dn(m), ye = Dn(E), Te = fe ? l : yt(m), oe = ye ? l : yt(E);
    Te = Te == o ? _ : Te, oe = oe == o ? _ : oe;
    var je = Te == _, Ve = oe == _, Ae = Te == oe;
    if (Ae && aa(m)) {
      if (!aa(E))
        return !1;
      fe = !0, je = !1;
    }
    if (Ae && !je)
      return V || (V = new gt()), fe || uo(m) ? io(m, E, C, L, se, V) : ep(m, E, Te, C, L, se, V);
    if (!(C & i)) {
      var He = je && tt.call(m, "__wrapped__"), qe = Ve && tt.call(E, "__wrapped__");
      if (He || qe) {
        var xt = He ? m.value() : m, ct = qe ? E.value() : E;
        return V || (V = new gt()), se(xt, ct, C, L, V);
      }
    }
    return Ae ? (V || (V = new gt()), tp(m, E, C, L, se, V)) : !1;
  }
  function Jd(m) {
    if (!co(m) || sp(m))
      return !1;
    var E = oo(m) ? yd : re;
    return E.test(Ut(m));
  }
  function Qd(m) {
    return Nr(m) && lo(m.length) && !!G[kr(m)];
  }
  function Zd(m) {
    if (!op(m))
      return Ed(m);
    var E = [];
    for (var C in Object(m))
      tt.call(m, C) && C != "constructor" && E.push(C);
    return E;
  }
  function io(m, E, C, L, se, V) {
    var fe = C & i, ye = m.length, Te = E.length;
    if (ye != Te && !(fe && Te > ye))
      return !1;
    var oe = V.get(m);
    if (oe && V.get(E))
      return oe == E;
    var je = -1, Ve = !0, Ae = C & a ? new In() : void 0;
    for (V.set(m, E), V.set(E, m); ++je < ye; ) {
      var He = m[je], qe = E[je];
      if (L)
        var xt = fe ? L(qe, He, je, E, m, V) : L(He, qe, je, m, E, V);
      if (xt !== void 0) {
        if (xt)
          continue;
        Ve = !1;
        break;
      }
      if (Ae) {
        if (!he(E, function(ct, Mt) {
          if (!_n(Ae, Mt) && (He === ct || se(He, ct, C, L, V)))
            return Ae.push(Mt);
        })) {
          Ve = !1;
          break;
        }
      } else if (!(He === qe || se(He, qe, C, L, V))) {
        Ve = !1;
        break;
      }
    }
    return V.delete(m), V.delete(E), Ve;
  }
  function ep(m, E, C, L, se, V, fe) {
    switch (C) {
      case M:
        if (m.byteLength != E.byteLength || m.byteOffset != E.byteOffset)
          return !1;
        m = m.buffer, E = E.buffer;
      case U:
        return !(m.byteLength != E.byteLength || !V(new Qs(m), new Qs(E)));
      case c:
      case u:
      case T:
        return so(+m, +E);
      case p:
        return m.name == E.name && m.message == E.message;
      case k:
      case q:
        return m == E + "";
      case x:
        var ye = bn;
      case H:
        var Te = L & i;
        if (ye || (ye = hd), m.size != E.size && !Te)
          return !1;
        var oe = fe.get(m);
        if (oe)
          return oe == E;
        L |= a, fe.set(m, E);
        var je = io(ye(m), ye(E), L, se, V, fe);
        return fe.delete(m), je;
      case te:
        if (ia)
          return ia.call(m) == ia.call(E);
    }
    return !1;
  }
  function tp(m, E, C, L, se, V) {
    var fe = C & i, ye = ao(m), Te = ye.length, oe = ao(E), je = oe.length;
    if (Te != je && !fe)
      return !1;
    for (var Ve = Te; Ve--; ) {
      var Ae = ye[Ve];
      if (!(fe ? Ae in E : tt.call(E, Ae)))
        return !1;
    }
    var He = V.get(m);
    if (He && V.get(E))
      return He == E;
    var qe = !0;
    V.set(m, E), V.set(E, m);
    for (var xt = fe; ++Ve < Te; ) {
      Ae = ye[Ve];
      var ct = m[Ae], Mt = E[Ae];
      if (L)
        var fo = fe ? L(Mt, ct, Ae, E, m, V) : L(ct, Mt, Ae, m, E, V);
      if (!(fo === void 0 ? ct === Mt || se(ct, Mt, C, L, V) : fo)) {
        qe = !1;
        break;
      }
      xt || (xt = Ae == "constructor");
    }
    if (qe && !xt) {
      var On = m.constructor, Pn = E.constructor;
      On != Pn && "constructor" in m && "constructor" in E && !(typeof On == "function" && On instanceof On && typeof Pn == "function" && Pn instanceof Pn) && (qe = !1);
    }
    return V.delete(m), V.delete(E), qe;
  }
  function ao(m) {
    return Yd(m, dp, np);
  }
  function Rn(m, E) {
    var C = m.__data__;
    return ap(E) ? C[typeof E == "string" ? "string" : "hash"] : C.map;
  }
  function nr(m, E) {
    var C = Dr(m, E);
    return Jd(C) ? C : void 0;
  }
  function rp(m) {
    var E = tt.call(m, Ft), C = m[Ft];
    try {
      m[Ft] = void 0;
      var L = !0;
    } catch {
    }
    var se = Ks.call(m);
    return L && (E ? m[Ft] = C : delete m[Ft]), se;
  }
  var np = eo ? function(m) {
    return m == null ? [] : (m = Object(m), Se(eo(m), function(E) {
      return Zs.call(m, E);
    }));
  } : pp, yt = kr;
  (ea && yt(new ea(new ArrayBuffer(1))) != M || Or && yt(new Or()) != x || ta && yt(ta.resolve()) != F || ra && yt(new ra()) != H || na && yt(new na()) != j) && (yt = function(m) {
    var E = kr(m), C = E == _ ? m.constructor : void 0, L = C ? Ut(C) : "";
    if (L)
      switch (L) {
        case vd:
          return M;
        case Td:
          return x;
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
    return E = E ?? s, !!E && (typeof m == "number" || ge.test(m)) && m > -1 && m % 1 == 0 && m < E;
  }
  function ap(m) {
    var E = typeof m;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? m !== "__proto__" : m === null;
  }
  function sp(m) {
    return !!Ys && Ys in m;
  }
  function op(m) {
    var E = m && m.constructor, C = typeof E == "function" && E.prototype || Sn;
    return m === C;
  }
  function lp(m) {
    return Ks.call(m);
  }
  function Ut(m) {
    if (m != null) {
      try {
        return Vs.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function so(m, E) {
    return m === E || m !== m && E !== E;
  }
  var cp = ro(/* @__PURE__ */ function() {
    return arguments;
  }()) ? ro : function(m) {
    return Nr(m) && tt.call(m, "callee") && !Zs.call(m, "callee");
  }, Dn = Array.isArray;
  function up(m) {
    return m != null && lo(m.length) && !oo(m);
  }
  var aa = wd || hp;
  function fp(m, E) {
    return no(m, E);
  }
  function oo(m) {
    if (!co(m))
      return !1;
    var E = kr(m);
    return E == g || E == w || E == d || E == D;
  }
  function lo(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= s;
  }
  function co(m) {
    var E = typeof m;
    return m != null && (E == "object" || E == "function");
  }
  function Nr(m) {
    return m != null && typeof m == "object";
  }
  var uo = ve ? Qi(ve) : Qd;
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
})(Ei, Ei.exports);
var HE = Ei.exports;
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.DownloadedUpdateHelper = void 0;
yn.createTempUpdateFile = YE;
const qE = un, XE = Pt, Dl = HE, zt = kt, Xr = ce;
class WE {
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
      return Dl(this.versionInfo, r) && Dl(this.fileInfo.info, n.info) && await (0, zt.pathExists)(t) ? t : null;
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
    } catch (d) {
      let c = "No cached update info available";
      return d.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${d.message})`), r.info(c), null;
    }
    if (!((a == null ? void 0 : a.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== a.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${a.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const o = Xr.join(this.cacheDirForPendingUpdate, a.fileName);
    if (!await (0, zt.pathExists)(o))
      return r.info("Cached update file doesn't exist"), null;
    const l = await VE(o);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = a, o);
  }
  getUpdateInfoFile() {
    return Xr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
yn.DownloadedUpdateHelper = WE;
function VE(e, t = "sha512", r = "base64", n) {
  return new Promise((i, a) => {
    const s = (0, qE.createHash)(t);
    s.on("error", a).setEncoding(r), (0, XE.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", a).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function YE(e, t, r) {
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
var Bi = {}, Ms = {};
Object.defineProperty(Ms, "__esModule", { value: !0 });
Ms.getAppCacheDir = JE;
const ba = ce, KE = Si;
function JE() {
  const e = (0, KE.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || ba.join(e, "AppData", "Local") : process.platform === "darwin" ? t = ba.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || ba.join(e, ".cache"), t;
}
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.ElectronAppAdapter = void 0;
const Ol = ce, QE = Ms;
class ZE {
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
    return this.isPackaged ? Ol.join(process.resourcesPath, "app-update.yml") : Ol.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, QE.getAppCacheDir)();
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
Bi.ElectronAppAdapter = ZE;
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
      const o = Jt.net.request({
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
})(Df);
var xn = {}, Xe = {}, ev = "[object Symbol]", Of = /[\\^$.*+?()[\]{}|]/g, tv = RegExp(Of.source), rv = typeof Pe == "object" && Pe && Pe.Object === Object && Pe, nv = typeof self == "object" && self && self.Object === Object && self, iv = rv || nv || Function("return this")(), av = Object.prototype, sv = av.toString, Pl = iv.Symbol, kl = Pl ? Pl.prototype : void 0, Nl = kl ? kl.toString : void 0;
function ov(e) {
  if (typeof e == "string")
    return e;
  if (cv(e))
    return Nl ? Nl.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function lv(e) {
  return !!e && typeof e == "object";
}
function cv(e) {
  return typeof e == "symbol" || lv(e) && sv.call(e) == ev;
}
function uv(e) {
  return e == null ? "" : ov(e);
}
function fv(e) {
  return e = uv(e), e && tv.test(e) ? e.replace(Of, "\\$&") : e;
}
var dv = fv;
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.newBaseUrl = hv;
Xe.newUrlFromBase = Za;
Xe.getChannelFilename = mv;
Xe.blockmapFiles = gv;
const Pf = br, pv = dv;
function hv(e) {
  const t = new Pf.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Za(e, t, r = !1) {
  const n = new Pf.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function mv(e) {
  return `${e}.yml`;
}
function gv(e, t, r) {
  const n = Za(`${e.pathname}.blockmap`, e);
  return [Za(`${e.pathname.replace(new RegExp(pv(r), "g"), t)}.blockmap`, e), n];
}
var me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.Provider = void 0;
me.findFile = wv;
me.parseUpdateInfo = Ev;
me.getFileList = kf;
me.resolveFiles = vv;
const Dt = Ee, yv = be, Fl = Xe;
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
function wv(e, t, r) {
  if (e.length === 0)
    throw (0, Dt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((a) => i.url.pathname.toLowerCase().endsWith(`.${a}`))));
}
function Ev(e, t, r) {
  if (e == null)
    throw (0, Dt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, yv.load)(e);
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
function vv(e, t, r = (n) => n) {
  const i = kf(e).map((o) => {
    if (o.sha2 == null && o.sha512 == null)
      throw (0, Dt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Dt.safeStringifyJson)(o)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Fl.newUrlFromBase)(r(o.url), t),
      info: o
    };
  }), a = e.packages, s = a == null ? null : a[process.arch] || a.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, Fl.newUrlFromBase)(r(s.path), t).href
  }), i;
}
Object.defineProperty(xn, "__esModule", { value: !0 });
xn.GenericProvider = void 0;
const $l = Ee, Sa = Xe, Aa = me;
class Tv extends Aa.Provider {
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
        if (i instanceof $l.HttpError && i.statusCode === 404)
          throw (0, $l.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
xn.GenericProvider = Tv;
var ji = {}, Gi = {};
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.BitbucketProvider = void 0;
const Ll = Ee, Ia = Xe, Ca = me;
class _v extends Ca.Provider {
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
    const t = new Ll.CancellationToken(), r = (0, Ia.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Ia.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Ca.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Ll.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
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
Gi.BitbucketProvider = _v;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.GitHubProvider = Ot.BaseGitHubProvider = void 0;
Ot.computeReleaseNotes = Ff;
const ft = Ee, hr = Rf, bv = br, mr = Xe, es = me, Ra = /\/tag\/([^/]+)$/;
class Nf extends es.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, mr.newBaseUrl)((0, ft.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, mr.newBaseUrl)((0, ft.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
Ot.BaseGitHubProvider = Nf;
class Sv extends Nf {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, a;
    const s = new ft.CancellationToken(), o = await this.httpRequest((0, mr.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), l = (0, ft.parseXml)(o);
    let d = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = hr.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (T === null)
          c = Ra.exec(d.element("link").attribute("href"))[1];
        else
          for (const b of l.getElements("entry")) {
            const _ = Ra.exec(b.element("link").attribute("href"));
            if (_ === null)
              continue;
            const F = _[1], D = ((n = hr.prerelease(F)) === null || n === void 0 ? void 0 : n[0]) || null, k = !T || ["alpha", "beta"].includes(T), H = D !== null && !["alpha", "beta"].includes(String(D));
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
        c = await this.getLatestTagName(s);
        for (const T of l.getElements("entry"))
          if (Ra.exec(T.element("link").attribute("href"))[1] === c) {
            d = T;
            break;
          }
      }
    } catch (T) {
      throw (0, ft.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${o}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, ft.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let u, p = "", g = "";
    const w = async (T) => {
      p = (0, mr.getChannelFilename)(T), g = (0, mr.newUrlFromBase)(this.getBaseDownloadPath(String(c), p), this.baseUrl);
      const b = this.createRequestOptions(g);
      try {
        return await this.executor.request(b, s);
      } catch (_) {
        throw _ instanceof ft.HttpError && _.statusCode === 404 ? (0, ft.newError)(`Cannot find ${p} in the latest release artifacts (${g}): ${_.stack || _.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : _;
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
    return x.releaseName == null && (x.releaseName = d.elementValueOrEmpty("title")), x.releaseNotes == null && (x.releaseNotes = Ff(this.updater.currentVersion, this.updater.fullChangelog, l, d)), {
      tag: c,
      ...x
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, mr.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new bv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
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
    return (0, es.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
Ot.GitHubProvider = Sv;
function Ul(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Ff(e, t, r, n) {
  if (!t)
    return Ul(n);
  const i = [];
  for (const a of r.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(a.element("link").attribute("href"))[1];
    hr.lt(e, s) && i.push({
      version: s,
      note: Ul(a)
    });
  }
  return i.sort((a, s) => hr.rcompare(a.version, s.version));
}
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.KeygenProvider = void 0;
const Ml = Ee, Da = Xe, Oa = me;
class Av extends Oa.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Da.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Ml.CancellationToken(), r = (0, Da.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Da.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Oa.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Ml.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
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
zi.KeygenProvider = Av;
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.PrivateGitHubProvider = void 0;
const sr = Ee, Iv = be, Cv = ce, Bl = br, jl = Xe, Rv = Ot, Dv = me;
class Ov extends Rv.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new sr.CancellationToken(), r = (0, jl.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((o) => o.name === r);
    if (i == null)
      throw (0, sr.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const a = new Bl.URL(i.url);
    let s;
    try {
      s = (0, Iv.load)(await this.httpRequest(a, this.configureHeaders("application/octet-stream"), t));
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
    const i = (0, jl.newUrlFromBase)(n, this.baseUrl);
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
    return (0, Dv.getFileList)(t).map((r) => {
      const n = Cv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((a) => a != null && a.name === n);
      if (i == null)
        throw (0, sr.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Bl.URL(i.url),
        info: r
      };
    });
  }
}
Hi.PrivateGitHubProvider = Ov;
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.isUrlProbablySupportMultiRangeRequests = $f;
ji.createClient = $v;
const Xn = Ee, Pv = Gi, Gl = xn, kv = Ot, Nv = zi, Fv = Hi;
function $f(e) {
  return !e.includes("s3.amazonaws.com");
}
function $v(e, t, r) {
  if (typeof e == "string")
    throw (0, Xn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, a = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return a == null ? new kv.GitHubProvider(i, t, r) : new Fv.PrivateGitHubProvider(i, t, a, r);
    }
    case "bitbucket":
      return new Pv.BitbucketProvider(e, t, r);
    case "keygen":
      return new Nv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Gl.GenericProvider({
        provider: "generic",
        url: (0, Xn.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Gl.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && $f(i.url)
      });
    }
    case "custom": {
      const i = e, a = i.updateProvider;
      if (!a)
        throw (0, Xn.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new a(i, t, r);
    }
    default:
      throw (0, Xn.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var qi = {}, wn = {}, Rr = {}, rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.OperationKind = void 0;
rr.computeOperations = Lv;
var Wt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Wt || (rr.OperationKind = Wt = {}));
function Lv(e, t, r) {
  const n = Hl(e.files), i = Hl(t.files);
  let a = null;
  const s = t.files[0], o = [], l = s.name, d = n.get(l);
  if (d == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let u = 0;
  const { checksumToOffset: p, checksumToOldSize: g } = Mv(n.get(l), d.offset, r);
  let w = s.offset;
  for (let x = 0; x < c.checksums.length; w += c.sizes[x], x++) {
    const T = c.sizes[x], b = c.checksums[x];
    let _ = p.get(b);
    _ != null && g.get(b) !== T && (r.warn(`Checksum ("${b}") matches, but size differs (old: ${g.get(b)}, new: ${T})`), _ = void 0), _ === void 0 ? (u++, a != null && a.kind === Wt.DOWNLOAD && a.end === w ? a.end += T : (a = {
      kind: Wt.DOWNLOAD,
      start: w,
      end: w + T
      // oldBlocks: null,
    }, zl(a, o, b, x))) : a != null && a.kind === Wt.COPY && a.end === _ ? a.end += T : (a = {
      kind: Wt.COPY,
      start: _,
      end: _ + T
      // oldBlocks: [checksum]
    }, zl(a, o, b, x));
  }
  return u > 0 && r.info(`File${s.name === "file" ? "" : " " + s.name} has ${u} changed blocks`), o;
}
const Uv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function zl(e, t, r, n) {
  if (Uv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const a = [i.start, i.end, e.start, e.end].reduce((s, o) => s < o ? s : o);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${Wt[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - a} until ${i.end - a} and ${e.start - a} until ${e.end - a}`);
    }
  }
  t.push(e);
}
function Mv(e, t, r) {
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
function Hl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.DataSplitter = void 0;
Rr.copyData = Lf;
const Wn = Ee, Bv = Pt, jv = cn, Gv = rr, ql = Buffer.from(`\r
\r
`);
var vt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(vt || (vt = {}));
function Lf(e, t, r, n, i) {
  const a = (0, Bv.createReadStream)("", {
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
class zv extends jv.Writable {
  constructor(t, r, n, i, a, s) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = a, this.finishHandler = s, this.partIndex = -1, this.headerListBuffer = null, this.readState = vt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, Wn.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
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
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Wn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const o = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (o < s)
            await this.copyExistingData(o, s);
          else if (o > s)
            throw (0, Wn.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
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
        const s = this.options.tasks[t];
        if (s.kind !== Gv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Lf(s, this.out, this.options.oldFileFd, i, () => {
          t++, a();
        });
      };
      a();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(ql, r);
    if (n !== -1)
      return n + ql.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Wn.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
Rr.DataSplitter = zv;
var Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.executeTasksUsingMultipleRangeRequests = Hv;
Xi.checkIsRangesSupported = rs;
const ts = Ee, Xl = Rr, Wl = rr;
function Hv(e, t, r, n, i) {
  const a = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const o = s + 1e3;
    qv(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, o),
      oldFileFd: n
    }, r, () => a(o), i);
  };
  return a;
}
function qv(e, t, r, n, i) {
  let a = "bytes=", s = 0;
  const o = /* @__PURE__ */ new Map(), l = [];
  for (let u = t.start; u < t.end; u++) {
    const p = t.tasks[u];
    p.kind === Wl.OperationKind.DOWNLOAD && (a += `${p.start}-${p.end - 1}, `, o.set(s, u), s++, l.push(p.end - p.start));
  }
  if (s <= 1) {
    const u = (p) => {
      if (p >= t.end) {
        n();
        return;
      }
      const g = t.tasks[p++];
      if (g.kind === Wl.OperationKind.COPY)
        (0, Xl.copyData)(g, r, t.oldFileFd, i, () => u(p));
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
    const w = new Xl.DataSplitter(r, t, o, g[1] || g[2], l, n);
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
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.ProgressDifferentialDownloadCallbackTransform = void 0;
const Xv = cn;
var gr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(gr || (gr = {}));
class Wv extends Xv.Transform {
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
Wi.ProgressDifferentialDownloadCallbackTransform = Wv;
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.DifferentialDownloader = void 0;
const Ur = Ee, Pa = kt, Vv = Pt, Yv = Rr, Kv = br, Vn = rr, Vl = Xi, Jv = Wi;
class Qv {
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
    const n = this.logger, i = (0, Vn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let a = 0, s = 0;
    for (const l of i) {
      const d = l.end - l.start;
      l.kind === Vn.OperationKind.DOWNLOAD ? a += d : s += d;
    }
    const o = this.blockAwareFileInfo.size;
    if (a + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== o)
      throw new Error(`Internal error, size mismatch: downloadSize: ${a}, copySize: ${s}, newSize: ${o}`);
    return n.info(`Full: ${Yl(o)}, To download: ${Yl(a)} (${Math.round(a / (o / 100))}%)`), this.downloadFile(i);
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
    const a = (0, Vv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, o) => {
      const l = [];
      let d;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const b = [];
        let _ = 0;
        for (const D of t)
          D.kind === Vn.OperationKind.DOWNLOAD && (b.push(D.end - D.start), _ += D.end - D.start);
        const F = {
          expectedByteCounts: b,
          grandTotal: _
        };
        d = new Jv.ProgressDifferentialDownloadCallbackTransform(F, this.options.cancellationToken, this.options.onProgress), l.push(d);
      }
      const c = new Ur.DigestTransform(this.blockAwareFileInfo.sha512);
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
      const p = l[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, Vl.executeTasksUsingMultipleRangeRequests)(this, t, p, n, o), g(0);
        return;
      }
      let w = 0, x = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", g = (b) => {
        var _, F;
        if (b >= t.length) {
          this.fileMetadataBuffer != null && p.write(this.fileMetadataBuffer), p.end();
          return;
        }
        const D = t[b++];
        if (D.kind === Vn.OperationKind.COPY) {
          d && d.beginFileCopy(), (0, Yv.copyData)(D, p, n, o, () => g(b));
          return;
        }
        const k = `bytes=${D.start}-${D.end - 1}`;
        T.headers.range = k, (F = (_ = this.logger) === null || _ === void 0 ? void 0 : _.debug) === null || F === void 0 || F.call(_, `download range: ${k}`), d && d.beginRangeDownload();
        const H = this.httpExecutor.createRequest(T, (q) => {
          q.on("error", o), q.on("aborted", () => {
            o(new Error("response has been aborted by the server"));
          }), q.statusCode >= 400 && o((0, Ur.createHttpError)(q)), q.pipe(p, {
            end: !1
          }), q.once("end", () => {
            d && d.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => g(b), 1e3)) : g(b);
          });
        });
        H.on("redirect", (q, te, y) => {
          this.logger.info(`Redirect to ${Zv(y)}`), x = y, (0, Ur.configureRequestUrl)(new Kv.URL(x), T), H.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(H, o), H.end();
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
        (0, Vl.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", r), s.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(a, i), a.end();
    });
  }
}
wn.DifferentialDownloader = Qv;
function Yl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Zv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.GenericDifferentialDownloader = void 0;
const eT = wn;
class tT extends eT.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
qi.GenericDifferentialDownloader = tT;
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
  function n(i, a, s) {
    i.on(a, s);
  }
})(Nt);
Object.defineProperty(It, "__esModule", { value: !0 });
It.NoOpLogger = It.AppUpdater = void 0;
const De = Ee, rT = un, nT = Si, iT = Cc, or = kt, aT = be, ka = Ni, Bt = ce, Ht = Rf, Kl = yn, sT = Bi, Jl = Df, oT = xn, Na = ji, lT = Dc, cT = Xe, uT = qi, lr = Nt;
class Bs extends iT.EventEmitter {
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
    return (0, Jl.getNetSession)();
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new lr.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (a) => this.checkIfUpdateSupported(a), this.clientPromise = null, this.stagingUserIdPromise = new ka.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new ka.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (a) => {
      this._logger.error(`Error: ${a.stack || a.message}`);
    }), r == null ? (this.app = new sT.ElectronAppAdapter(), this.httpExecutor = new Jl.ElectronHttpExecutor((a, s) => this.emit("login", a, s))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Ht.parse)(n);
    if (i == null)
      throw (0, De.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = fT(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new oT.GenericProvider({ provider: "generic", url: t }, this, {
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
    const i = await this.stagingUserIdPromise.value, s = De.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${s}, user id: ${i}`), s < n;
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
    const a = (0, Ht.gt)(r, n), s = (0, Ht.lt)(r, n);
    return a ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, nT.release)();
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
    this.emit(lr.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, aT.load)(await (0, or.readFile)(this._appUpdateConfigPath, "utf-8"));
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
      const n = await (0, or.readFile)(t, "utf-8");
      if (De.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = De.UUID.v5((0, rT.randomBytes)(4096), De.UUID.OID);
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
      const i = Bt.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Kl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(lr.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (_) => this.emit(lr.DOWNLOAD_PROGRESS, _));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, a = i.version, s = r.packageInfo;
    function o() {
      const _ = decodeURIComponent(t.fileInfo.url.pathname);
      return _.endsWith(`.${t.fileExtension}`) ? Bt.basename(_) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), d = l.cacheDirForPendingUpdate;
    await (0, or.mkdir)(d, { recursive: !0 });
    const c = o();
    let u = Bt.join(d, c);
    const p = s == null ? null : Bt.join(d, `package-${a}${Bt.extname(s.path) || ".7z"}`), g = async (_) => (await l.setDownloadedFile(u, p, i, r, c, _), await t.done({
      ...i,
      downloadedFile: u
    }), p == null ? [u] : [u, p]), w = this._logger, x = await l.validateDownloadedPath(u, i, r, w);
    if (x != null)
      return u = x, await g(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, or.unlink)(u).catch(() => {
    })), b = await (0, Kl.createTempUpdateFile)(`temp-${c}`, d, w);
    try {
      await t.task(b, n, p, T), await (0, De.retry)(() => (0, or.rename)(b, u), 60, 500, 0, 0, (_) => _ instanceof Error && /^EBUSY:/.test(_.message));
    } catch (_) {
      throw await T(), _ instanceof De.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), _;
    }
    return w.info(`New version ${a} has been downloaded to ${u}`), await g(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, a) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, cT.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const o = async (c) => {
        const u = await this.httpExecutor.downloadToBuffer(c, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (u == null || u.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, lT.gunzipSync)(u).toString());
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
      this.listenerCount(lr.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(lr.DOWNLOAD_PROGRESS, c));
      const d = await Promise.all(s.map((c) => o(c)));
      return await new uT.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(d[0], d[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
It.AppUpdater = Bs;
function fT(e) {
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
const Ql = bi, dT = It;
class pT extends dT.AppUpdater {
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
    const i = (0, Ql.spawnSync)(t, r, {
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
        const o = { stdio: i, env: n, detached: !0 }, l = (0, Ql.spawn)(t, r, o);
        l.on("error", (d) => {
          s(d);
        }), l.unref(), l.pid !== void 0 && a(!0);
      } catch (o) {
        s(o);
      }
    });
  }
}
ht.BaseUpdater = pT;
var rn = {}, En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
En.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const cr = kt, hT = wn, mT = Dc;
class gT extends hT.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Mf(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await yT(this.options.oldFile), i);
  }
}
En.FileWithEmbeddedBlockMapDifferentialDownloader = gT;
function Mf(e) {
  return JSON.parse((0, mT.inflateRawSync)(e).toString());
}
async function yT(e) {
  const t = await (0, cr.open)(e, "r");
  try {
    const r = (await (0, cr.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, cr.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, cr.read)(t, i, 0, i.length, r - n.length - i.length), await (0, cr.close)(t), Mf(i);
  } catch (r) {
    throw await (0, cr.close)(t), r;
  }
}
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.AppImageUpdater = void 0;
const Zl = Ee, ec = bi, xT = kt, wT = Pt, Mr = ce, ET = ht, vT = En, TT = me, tc = Nt;
class _T extends ET.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, TT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, Zl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, s, i, r, t)) && await this.httpExecutor.download(n.url, i, a), await (0, xT.chmod)(i, 493);
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
      return this.listenerCount(tc.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(tc.DOWNLOAD_PROGRESS, o)), await new vT.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Zl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, wT.unlinkSync)(r);
    let n;
    const i = Mr.basename(r), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Mr.basename(a) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Mr.join(Mr.dirname(r), Mr.basename(a)), (0, ec.execFileSync)("mv", ["-f", a, n]), n !== r && this.emit("appimage-filename-updated", n);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, ec.execFileSync)(n, [], { env: s })), !0;
  }
}
rn.AppImageUpdater = _T;
var nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.DebUpdater = void 0;
const bT = ht, ST = me, rc = Nt;
class AT extends bT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, ST.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(rc.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(rc.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
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
nn.DebUpdater = AT;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.PacmanUpdater = void 0;
const IT = ht, nc = Nt, CT = me;
class RT extends IT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, CT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(nc.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(nc.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
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
an.PacmanUpdater = RT;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.RpmUpdater = void 0;
const DT = ht, ic = Nt, OT = me;
class PT extends DT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, OT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(ic.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(ic.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
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
sn.RpmUpdater = PT;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.MacUpdater = void 0;
const ac = Ee, Fa = kt, kT = Pt, sc = ce, NT = Tp, FT = It, $T = me, oc = bi, lc = un;
class LT extends FT.AppUpdater {
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
      this.debug("Checking for macOS Rosetta environment"), a = (0, oc.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${a})`);
    } catch (u) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${u}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const p = (0, oc.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const l = (0, $T.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, ac.newError)(`ZIP file not provided: ${(0, ac.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const d = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (u, p) => {
        const g = sc.join(this.downloadedUpdateHelper.cacheDir, c), w = () => (0, Fa.pathExistsSync)(g) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let x = !0;
        w() && (x = await this.differentialDownloadInstaller(l, t, u, d, c)), x && await this.httpExecutor.download(l.url, u, p);
      },
      done: async (u) => {
        if (!t.disableDifferentialDownload)
          try {
            const p = sc.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Fa.copyFile)(u.downloadedFile, p);
          } catch (p) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${p.message}`);
          }
        return this.updateDownloaded(l, u);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, a = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Fa.stat)(i)).size, s = this._logger, o = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${o})`), this.server = (0, NT.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${o})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${o})`);
    });
    const l = (d) => {
      const c = d.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((d, c) => {
      const u = (0, lc.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), p = Buffer.from(`autoupdater:${u}`, "ascii"), g = `/${(0, lc.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, x) => {
        const T = w.url;
        if (s.info(`${T} requested`), T === "/") {
          if (!w.headers.authorization || w.headers.authorization.indexOf("Basic ") === -1) {
            x.statusCode = 401, x.statusMessage = "Invalid Authentication Credentials", x.end(), s.warn("No authenthication info");
            return;
          }
          const F = w.headers.authorization.split(" ")[1], D = Buffer.from(F, "base64").toString("ascii"), [k, H] = D.split(":");
          if (k !== "autoupdater" || H !== u) {
            x.statusCode = 401, x.statusMessage = "Invalid Authentication Credentials", x.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const q = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          x.writeHead(200, { "Content-Type": "application/json", "Content-Length": q.length }), x.end(q);
          return;
        }
        if (!T.startsWith(g)) {
          s.warn(`${T} requested, but not supported`), x.writeHead(404), x.end();
          return;
        }
        s.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let b = !1;
        x.on("finish", () => {
          b || (this.nativeUpdater.removeListener("error", c), d([]));
        });
        const _ = (0, kT.createReadStream)(i);
        _.on("error", (F) => {
          try {
            x.end();
          } catch (D) {
            s.warn(`cannot end response: ${D}`);
          }
          b = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${F}`));
        }), x.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": a
        }), _.pipe(x);
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
on.MacUpdater = LT;
var ln = {}, js = {};
Object.defineProperty(js, "__esModule", { value: !0 });
js.verifySignature = MT;
const cc = Ee, Bf = bi, UT = Si, uc = ce;
function MT(e, t, r) {
  return new Promise((n, i) => {
    const a = t.replace(/'/g, "''");
    r.info(`Verifying signature ${a}`), (0, Bf.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${a}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, o, l) => {
      var d;
      try {
        if (s != null || l) {
          $a(r, s, l, i), n(null);
          return;
        }
        const c = BT(o);
        if (c.Status === 0) {
          try {
            const w = uc.normalize(c.Path), x = uc.normalize(t);
            if (r.info(`LiteralPath: ${w}. Update Path: ${x}`), w !== x) {
              $a(r, new Error(`LiteralPath of ${w} is different than ${x}`), l, i), n(null);
              return;
            }
          } catch (w) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(d = w.message) !== null && d !== void 0 ? d : w.stack}`);
          }
          const p = (0, cc.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const w of e) {
            const x = (0, cc.parseDn)(w);
            if (x.size ? g = Array.from(x.keys()).every((b) => x.get(b) === p.get(b)) : w === p.get("CN") && (r.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              n(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (p, g) => p === "RawData" ? void 0 : g, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), n(u);
      } catch (c) {
        $a(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function BT(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function $a(e, t, r, n) {
  if (jT()) {
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
function jT() {
  const e = UT.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.NsisUpdater = void 0;
const Yn = Ee, fc = ce, GT = ht, zT = En, dc = Nt, HT = me, qT = kt, XT = js, pc = br;
class WT extends GT.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, XT.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, HT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, a, s, o) => {
        const l = n.packageInfo, d = l != null && s != null;
        if (d && t.disableWebInstaller)
          throw (0, Yn.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !d && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Yn.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, a);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await o(), (0, Yn.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (d && await this.differentialDownloadWebPackage(t, l, s, r))
          try {
            await this.httpExecutor.download(new pc.URL(l.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (u) {
            try {
              await (0, qT.unlink)(s);
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
      this.spawnLog(fc.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), a(), !0) : (this.spawnLog(r, n).catch((s) => {
      const o = s.code;
      this._logger.info(`Cannot run installer: error code: ${o}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), o === "UNKNOWN" || o === "EACCES" ? a() : o === "ENOENT" ? Jt.shell.openPath(r).catch((l) => this.dispatchError(l)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const a = {
        newUrl: new pc.URL(r.path),
        oldFile: fc.join(this.downloadedUpdateHelper.cacheDir, Yn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(dc.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(dc.DOWNLOAD_PROGRESS, s)), await new zT.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, a).download();
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "win32";
    }
    return !1;
  }
}
ln.NsisUpdater = WT;
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
  const n = kt, i = ce;
  var a = ht;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return a.BaseUpdater;
  } });
  var s = It;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var o = me;
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
  } }), r(Nt, e);
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
const VT = "End-Of-Stream";
class Ce extends Error {
  constructor() {
    super(VT), this.name = "EndOfStreamError";
  }
}
class YT extends Error {
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
        throw new YT();
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
class KT extends jf {
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
class JT extends KT {
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
class hc extends jf {
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
function QT(e) {
  try {
    const t = e.getReader({ mode: "byob" });
    return t instanceof ReadableStreamDefaultReader ? new hc(t) : new JT(t);
  } catch (t) {
    if (t instanceof TypeError)
      return new hc(e.getReader());
    throw t;
  }
}
class Vi {
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
const ZT = 256e3;
class e_ extends Vi {
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
    const r = Math.min(ZT, t), n = new Uint8Array(r);
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
class t_ extends Vi {
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
class r_ extends Vi {
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
function n_(e, t) {
  const r = QT(e), n = t ?? {}, i = n.onClose;
  return n.onClose = async () => {
    if (await r.close(), i)
      return i();
  }, new e_(r, n);
}
function ns(e, t) {
  return new t_(e, t);
}
function i_(e, t) {
  return new r_(e, t);
}
class Gs extends Vi {
  /**
   * Create tokenizer from provided file path
   * @param sourceFilePath File path
   */
  static async fromFile(t) {
    const r = await wp(t, "r"), n = await r.stat();
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
const a_ = Gs.fromFile;
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Yi = function(e, t, r, n, i) {
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
}, Ki = function(e, t, r, n, i, a) {
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
function s_(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8":
      return typeof globalThis.TextDecoder < "u" ? new globalThis.TextDecoder("utf-8").decode(e) : o_(e);
    case "utf-16le":
      return l_(e);
    case "ascii":
      return c_(e);
    case "latin1":
    case "iso-8859-1":
      return u_(e);
    case "windows-1252":
      return f_(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function o_(e) {
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
function l_(e) {
  let t = "";
  for (let r = 0; r < e.length; r += 2)
    t += String.fromCharCode(e[r] | e[r + 1] << 8);
  return t;
}
function c_(e) {
  return String.fromCharCode(...e.map((t) => t & 127));
}
function u_(e) {
  return String.fromCharCode(...e);
}
function f_(e) {
  let t = "";
  for (const r of e)
    r >= 128 && r <= 159 && is[r] ? t += is[r] : t += String.fromCharCode(r);
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
}, vi = {
  len: 4,
  get(e, t) {
    return W(e).getUint32(t);
  },
  put(e, t, r) {
    return W(e).setUint32(t, r), t + 4;
  }
}, as = {
  len: 1,
  get(e, t) {
    return W(e).getInt8(t);
  },
  put(e, t, r) {
    return W(e).setInt8(t, r), t + 1;
  }
}, d_ = {
  len: 2,
  get(e, t) {
    return W(e).getInt16(t);
  },
  put(e, t, r) {
    return W(e).setInt16(t, r), t + 2;
  }
}, p_ = {
  len: 2,
  get(e, t) {
    return W(e).getInt16(t, !0);
  },
  put(e, t, r) {
    return W(e).setInt16(t, r, !0), t + 2;
  }
}, h_ = {
  len: 3,
  get(e, t) {
    const r = Gf.get(e, t);
    return r > 8388607 ? r - 16777216 : r;
  },
  put(e, t, r) {
    const n = W(e);
    return n.setUint8(t, r & 255), n.setUint16(t + 1, r >> 8, !0), t + 3;
  }
}, m_ = {
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
}, g_ = {
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
}, y_ = {
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
}, w_ = {
  len: 8,
  get(e, t) {
    return W(e).getBigInt64(t);
  },
  put(e, t, r) {
    return W(e).setBigInt64(t, r), t + 8;
  }
}, E_ = {
  len: 2,
  get(e, t) {
    return Yi(e, t, !1, 10, this.len);
  },
  put(e, t, r) {
    return Ki(e, r, t, !1, 10, this.len), t + this.len;
  }
}, v_ = {
  len: 2,
  get(e, t) {
    return Yi(e, t, !0, 10, this.len);
  },
  put(e, t, r) {
    return Ki(e, r, t, !0, 10, this.len), t + this.len;
  }
}, T_ = {
  len: 4,
  get(e, t) {
    return W(e).getFloat32(t);
  },
  put(e, t, r) {
    return W(e).setFloat32(t, r), t + 4;
  }
}, __ = {
  len: 4,
  get(e, t) {
    return W(e).getFloat32(t, !0);
  },
  put(e, t, r) {
    return W(e).setFloat32(t, r, !0), t + 4;
  }
}, b_ = {
  len: 8,
  get(e, t) {
    return W(e).getFloat64(t);
  },
  put(e, t, r) {
    return W(e).setFloat64(t, r), t + 8;
  }
}, S_ = {
  len: 8,
  get(e, t) {
    return W(e).getFloat64(t, !0);
  },
  put(e, t, r) {
    return W(e).setFloat64(t, r, !0), t + 8;
  }
}, A_ = {
  len: 10,
  get(e, t) {
    return Yi(e, t, !1, 63, this.len);
  },
  put(e, t, r) {
    return Ki(e, r, t, !1, 63, this.len), t + this.len;
  }
}, I_ = {
  len: 10,
  get(e, t) {
    return Yi(e, t, !0, 63, this.len);
  },
  put(e, t, r) {
    return Ki(e, r, t, !0, 63, this.len), t + this.len;
  }
};
class C_ {
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
class xe {
  constructor(t, r) {
    this.len = t, this.encoding = r;
  }
  get(t, r = 0) {
    const n = t.subarray(r, r + this.len);
    return s_(n, this.encoding);
  }
}
class R_ extends xe {
  constructor(t) {
    super(t, "windows-1252");
  }
}
const nA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnsiStringType: R_,
  Float16_BE: E_,
  Float16_LE: v_,
  Float32_BE: T_,
  Float32_LE: __,
  Float64_BE: b_,
  Float64_LE: S_,
  Float80_BE: A_,
  Float80_LE: I_,
  INT16_BE: d_,
  INT16_LE: p_,
  INT24_BE: m_,
  INT24_LE: h_,
  INT32_BE: Hf,
  INT32_LE: g_,
  INT64_BE: w_,
  INT64_LE: y_,
  INT8: as,
  IgnoreType: C_,
  StringType: xe,
  UINT16_BE: Xt,
  UINT16_LE: ie,
  UINT24_BE: zf,
  UINT24_LE: Gf,
  UINT32_BE: vi,
  UINT32_LE: K,
  UINT64_BE: x_,
  UINT64_LE: qf,
  UINT8: Kt,
  Uint8ArrayType: Xf
}, Symbol.toStringTag, { value: "Module" })), yr = {
  LocalFileHeader: 67324752,
  DataDescriptor: 134695760,
  CentralFileHeader: 33639248,
  EndOfCentralDirectory: 101010256
}, mc = {
  get(e) {
    return {
      signature: K.get(e, 0),
      compressedSize: K.get(e, 8),
      uncompressedSize: K.get(e, 12)
    };
  },
  len: 16
}, D_ = {
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
}, O_ = {
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
}, P_ = {
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
const rt = Ir("tokenizer:inflate"), La = 256 * 1024, k_ = Wf(yr.DataDescriptor), Kn = Wf(yr.EndOfCentralDirectory);
class zs {
  constructor(t) {
    this.tokenizer = t, this.syncBuffer = new Uint8Array(La);
  }
  async isZip() {
    return await this.peekSignature() === yr.LocalFileHeader;
  }
  peekSignature() {
    return this.tokenizer.peekToken(K);
  }
  async findEndOfCentralDirectoryLocator() {
    const t = this.tokenizer, r = Math.min(16 * 1024, t.fileInfo.size), n = this.syncBuffer.subarray(0, r);
    await this.tokenizer.readBuffer(n, { position: t.fileInfo.size - r });
    for (let i = n.length - 4; i >= 0; i--)
      if (n[i] === Kn[0] && n[i + 1] === Kn[1] && n[i + 2] === Kn[2] && n[i + 3] === Kn[3])
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
      const n = await this.tokenizer.readToken(O_, r), i = [];
      this.tokenizer.setPosition(n.offsetOfStartOfCd);
      for (let a = 0; a < n.nrOfEntriesOfSize; ++a) {
        const s = await this.tokenizer.readToken(P_);
        if (s.signature !== yr.CentralFileHeader)
          throw new Error("Expected Central-File-Header signature");
        s.filename = await this.tokenizer.readToken(new xe(s.filenameLength, "utf-8")), await this.tokenizer.ignore(s.extraFieldLength), await this.tokenizer.ignore(s.fileCommentLength), i.push(s), rt(`Add central-directory file-entry: n=${a + 1}/${i.length}: filename=${i[a].filename}`);
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
        let d = -1;
        for (; d < 0 && l === La; ) {
          l = await this.tokenizer.peekBuffer(this.syncBuffer, { mayBeLess: !0 }), d = N_(this.syncBuffer.subarray(0, l), k_);
          const c = d >= 0 ? d : l;
          if (a.handler) {
            const u = new Uint8Array(c);
            await this.tokenizer.readBuffer(u), o.push(u);
          } else
            await this.tokenizer.ignore(c);
        }
        rt(`Found data-descriptor-signature at pos=${this.tokenizer.position}`), a.handler && await this.inflate(i, F_(o), a.handler);
      } else
        a.handler ? (rt(`Reading compressed-file-data: ${i.compressedSize} bytes`), s = new Uint8Array(i.compressedSize), await this.tokenizer.readBuffer(s), await this.inflate(i, s, a.handler)) : (rt(`Ignoring compressed-file-data: ${i.compressedSize} bytes`), await this.tokenizer.ignore(i.compressedSize));
      if (rt(`Reading data-descriptor at pos=${this.tokenizer.position}`), i.dataDescriptor && (await this.tokenizer.readToken(mc)).signature !== 134695760)
        throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - mc.len}`);
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
    const i = await zs.decompressDeflateRaw(r);
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
    const t = await this.tokenizer.peekToken(K);
    if (t === yr.LocalFileHeader) {
      const r = await this.tokenizer.readToken(D_);
      return r.filename = await this.tokenizer.readToken(new xe(r.filenameLength, "utf-8")), r;
    }
    if (t === yr.CentralFileHeader)
      return !1;
    throw t === 3759263696 ? new Error("Encrypted ZIP") : new Error("Unexpected signature");
  }
}
function N_(e, t) {
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
function F_(e) {
  const t = e.reduce((i, a) => i + a.length, 0), r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    r.set(i, n), n += i.length;
  return r;
}
class $_ {
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
const L_ = Object.prototype.toString, U_ = "[object Uint8Array]";
function M_(e, t, r) {
  return e ? e.constructor === t ? !0 : L_.call(e) === r : !1;
}
function B_(e) {
  return M_(e, Uint8Array, U_);
}
function j_(e) {
  if (!B_(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
new globalThis.TextDecoder("utf8");
function G_(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
new globalThis.TextEncoder();
const z_ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function iA(e) {
  j_(e);
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += z_[e[r]];
  return t;
}
const gc = {
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
function aA(e) {
  if (G_(e), e.length % 2 !== 0)
    throw new Error("Invalid Hex string length.");
  const t = e.length / 2, r = new Uint8Array(t);
  for (let n = 0; n < t; n++) {
    const i = gc[e[n * 2]], a = gc[e[n * 2 + 1]];
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
function H_(e, t) {
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
function q_(e, t = 0) {
  const r = Number.parseInt(new xe(6).get(e, 148).replace(/\0.*$/, "").trim(), 8);
  if (Number.isNaN(r))
    return !1;
  let n = 8 * 32;
  for (let i = t; i < t + 148; i++)
    n += e[i];
  for (let i = t + 156; i < t + 512; i++)
    n += e[i];
  return r === n;
}
const X_ = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, W_ = [
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
], V_ = [
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
async function Vf(e, t) {
  return new Y_(t).fromBuffer(e);
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
class Y_ {
  constructor(t) {
    // Detections with a high degree of certainty in identifying the correct file type
    ut(this, "detectConfident", async (t) => {
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
        const n = new $_(t).inflate();
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
        const r = await t.readToken(X_);
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
        return await new zs(t).unzip((n) => {
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
          const o = await t.peekNumber(Kt);
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
              return (await t.readToken(new xe(l.len))).replaceAll(/\00.*$/g, "");
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
        const r = new xe(4, "latin1").get(this.buffer, 2);
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
        return await t.ignore(8), await t.readToken(new xe(13, "ascii")) === "debian-binary" ? {
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
            type: await t.readToken(new xe(4, "latin1"))
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
        const r = new xe(4, "latin1").get(this.buffer, 8).replace("\0", " ").trim();
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
        switch (await t.ignore(20), await t.readToken(new xe(4, "ascii"))) {
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
      if (await t.peekBuffer(this.buffer, { length: Math.min(512, t.fileInfo.size), mayBeLess: !0 }), this.checkString("ustar", { offset: 257 }) && (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 })) || this.check([0, 0, 0, 0, 0, 0], { offset: 257 }) && q_(this.buffer))
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
    ut(this, "detectImprecise", async (t) => {
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
    const r = i_(t, this.tokenizerOptions);
    try {
      return await this.fromTokenizer(r);
    } finally {
      await r.close();
    }
  }
  async fromStream(t) {
    const r = n_(t, this.tokenizerOptions);
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
      const { value: d, done: c } = await s.read(new Uint8Array(n));
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
    return this.check(H_(t, r == null ? void 0 : r.encoding), r);
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
    const r = (t ? Xt : ie).get(this.buffer, 2), n = (t ? vi : K).get(this.buffer, 4);
    if (r === 42) {
      if (n >= 6) {
        if (this.checkString("CR", { offset: 8 }))
          return {
            ext: "cr2",
            mime: "image/x-canon-cr2"
          };
        if (n >= 8) {
          const a = (t ? Xt : ie).get(this.buffer, 8), s = (t ? Xt : ie).get(this.buffer, 10);
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
new Set(W_);
new Set(V_);
var Hs = {};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
var yc = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g, K_ = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/, Yf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/, J_ = /\\([\u000b\u0020-\u00ff])/g, Q_ = /([\\"])/g, Kf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
Hs.format = Z_;
Hs.parse = eb;
function Z_(e) {
  if (!e || typeof e != "object")
    throw new TypeError("argument obj is required");
  var t = e.parameters, r = e.type;
  if (!r || !Kf.test(r))
    throw new TypeError("invalid type");
  var n = r;
  if (t && typeof t == "object")
    for (var i, a = Object.keys(t).sort(), s = 0; s < a.length; s++) {
      if (i = a[s], !Yf.test(i))
        throw new TypeError("invalid parameter name");
      n += "; " + i + "=" + rb(t[i]);
    }
  return n;
}
function eb(e) {
  if (!e)
    throw new TypeError("argument string is required");
  var t = typeof e == "object" ? tb(e) : e;
  if (typeof t != "string")
    throw new TypeError("argument string is required to be a string");
  var r = t.indexOf(";"), n = r !== -1 ? t.slice(0, r).trim() : t.trim();
  if (!Kf.test(n))
    throw new TypeError("invalid media type");
  var i = new nb(n.toLowerCase());
  if (r !== -1) {
    var a, s, o;
    for (yc.lastIndex = r; s = yc.exec(t); ) {
      if (s.index !== r)
        throw new TypeError("invalid parameter format");
      r += s[0].length, a = s[1].toLowerCase(), o = s[2], o.charCodeAt(0) === 34 && (o = o.slice(1, -1), o.indexOf("\\") !== -1 && (o = o.replace(J_, "$1"))), i.parameters[a] = o;
    }
    if (r !== t.length)
      throw new TypeError("invalid parameter format");
  }
  return i;
}
function tb(e) {
  var t;
  if (typeof e.getHeader == "function" ? t = e.getHeader("content-type") : typeof e.headers == "object" && (t = e.headers && e.headers["content-type"]), typeof t != "string")
    throw new TypeError("content-type header is missing from object");
  return t;
}
function rb(e) {
  var t = String(e);
  if (Yf.test(t))
    return t;
  if (t.length > 0 && !K_.test(t))
    throw new TypeError("invalid parameter value");
  return '"' + t.replace(Q_, "\\$1") + '"';
}
function nb(e) {
  this.parameters = /* @__PURE__ */ Object.create(null), this.type = e;
}
/*!
 * media-typer
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
var ib = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/, ab = sb;
function sb(e) {
  if (!e)
    throw new TypeError("argument string is required");
  if (typeof e != "string")
    throw new TypeError("argument string is required to be a string");
  var t = ib.exec(e.toLowerCase());
  if (!t)
    throw new TypeError("invalid media type");
  var r = t[1], n = t[2], i, a = n.lastIndexOf("+");
  return a !== -1 && (i = n.substr(a + 1), n = n.substr(0, a)), new ob(r, n, i);
}
function ob(e, t, r) {
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
}, lb = {
  [dt.video]: "video",
  [dt.audio]: "audio",
  [dt.complex]: "complex",
  [dt.logo]: "logo",
  [dt.subtitle]: "subtitle",
  [dt.button]: "button",
  [dt.control]: "control"
}, vn = (e) => class extends Error {
  constructor(r) {
    super(r), this.name = e;
  }
};
class Jf extends vn("CouldNotDetermineFileTypeError") {
}
class Qf extends vn("UnsupportedFileTypeError") {
}
class cb extends vn("UnexpectedFileContentError") {
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
class Zf extends vn("InternalParserError") {
}
const ub = (e) => class extends cb {
  constructor(t) {
    super(e, t);
  }
};
function Gr(e, t, r) {
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
function fb(e) {
  const t = e.indexOf("\0");
  return t === -1 ? e : e.substr(0, t);
}
function db(e) {
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
    return os(db(e), t);
  }
  return new xe(e.length, t).get(e, 0);
}
function lA(e) {
  return e = e.replace(/^\x00+/g, ""), e = e.replace(/\x00+$/g, ""), e;
}
function ed(e, t, r, n) {
  const i = t + ~~(r / 8), a = r % 8;
  let s = e[i];
  s &= 255 >> a;
  const o = 8 - a, l = n - o;
  return l < 0 ? s >>= 8 - a - n : l > 0 && (s <<= l, s |= ed(e, t, r + o, l)), s;
}
function cA(e, t, r) {
  return ed(e, t, r, 1) === 1;
}
function pb(e) {
  const t = [];
  for (let r = 0, n = e.length; r < n; r++) {
    const i = Number(e.charCodeAt(r)).toString(16);
    t.push(i.length === 1 ? `0${i}` : i);
  }
  return t.join(" ");
}
function hb(e) {
  return 10 * Math.log10(e);
}
function mb(e) {
  return 10 ** (e / 10);
}
function gb(e) {
  const t = e.split(" ").map((r) => r.trim().toLowerCase());
  if (t.length >= 1) {
    const r = Number.parseFloat(t[0]);
    return t.length === 2 && t[1] === "db" ? {
      dB: r,
      ratio: mb(r)
    } : {
      dB: hb(r),
      ratio: r
    };
  }
}
function uA(e) {
  if (e.length === 0)
    throw new Error("decodeUintBE: empty Uint8Array");
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength);
  return ss(t);
}
const fA = {
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
}, yb = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, dA = {
  len: 10,
  get: (e, t) => ({
    // ID3v2/file identifier   "ID3"
    fileIdentifier: new xe(3, "ascii").get(e, t),
    // ID3v2 versionIndex
    version: {
      major: as.get(e, t + 3),
      revision: as.get(e, t + 4)
    },
    // ID3v2 flags
    flags: {
      // Unsynchronisation
      unsynchronisation: Gr(e, t + 5, 7),
      // Extended header
      isExtendedHeader: Gr(e, t + 5, 6),
      // Experimental indicator
      expIndicator: Gr(e, t + 5, 5),
      footer: Gr(e, t + 5, 4)
    },
    size: yb.get(e, t + 6)
  })
}, pA = {
  len: 10,
  get: (e, t) => ({
    // Extended header size
    size: vi.get(e, t),
    // Extended Flags
    extendedFlags: Xt.get(e, t + 4),
    // Size of padding
    sizeOfPadding: vi.get(e, t + 6),
    // CRC data present
    crcDataPresent: Gr(e, t + 4, 31)
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
}, wb = {
  len: 4,
  get: (e, t) => ({
    encoding: xb.get(e, t),
    language: new xe(3, "latin1").get(e, t + 1)
  })
}, hA = {
  len: 6,
  get: (e, t) => {
    const r = wb.get(e, t);
    return {
      encoding: r.encoding,
      language: r.language,
      timeStampFormat: Kt.get(e, t + 4),
      contentType: Kt.get(e, t + 5)
    };
  }
}, N = {
  multiple: !1
}, Ti = {
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
function Eb(e) {
  return Ti[e] && !Ti[e].multiple;
}
function vb(e) {
  return !Ti[e].multiple || Ti[e].unique || !1;
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
const Tb = {
  title: "title",
  artist: "artist",
  album: "album",
  year: "year",
  comment: "comment",
  track: "track",
  genre: "genre"
};
class _b extends ze {
  constructor() {
    super(["ID3v1"], Tb);
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
const bb = {
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
    super(["ID3v2.3", "ID3v2.4"], bb);
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
              t.id += `:${n.owner_identifier}`, t.value = n.data.length === 4 ? K.get(n.data, 0) : null, t.value === null && r.addWarning("Failed to parse PRIV:PeakValue");
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
const Sb = {
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
    super(["asf"], Sb);
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
const Ab = {
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
class Ib extends Tn {
  constructor() {
    super(["ID3v2.2"], Ab);
  }
}
const Cb = {
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
class Rb extends Tn {
  constructor() {
    super(["APEv2"], Cb);
  }
}
const Db = {
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
}, Ob = "iTunes";
class wc extends Tn {
  constructor() {
    super([Ob], Db);
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
const Pb = {
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
class _i extends ze {
  static toRating(t, r, n) {
    return {
      source: t ? t.toLowerCase() : void 0,
      rating: Number.parseFloat(r) / n * ze.maxRatingScore
    };
  }
  constructor() {
    super(["vorbis"], Pb);
  }
  postMap(t) {
    if (t.id === "RATING")
      t.value = _i.toRating(void 0, t.value, 100);
    else if (t.id.indexOf("RATING:") === 0) {
      const r = t.id.split(":");
      t.value = _i.toRating(r[1], t.value, 1), t.id = r[0];
    }
  }
}
const kb = {
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
class Nb extends ze {
  constructor() {
    super(["exif"], kb);
  }
}
const Fb = {
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
class $b extends Tn {
  constructor() {
    super(["matroska"], Fb);
  }
}
const Lb = {
  NAME: "title",
  AUTH: "artist",
  "(c) ": "copyright",
  ANNO: "comment"
};
class Ub extends ze {
  constructor() {
    super(["AIFF"], Lb);
  }
}
class Mb {
  constructor() {
    this.tagMappers = {}, [
      new _b(),
      new Ib(),
      new Xs(),
      new wc(),
      new wc(),
      new _i(),
      new Rb(),
      new Ws(),
      new Nb(),
      new $b(),
      new Ub()
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
const ls = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;
function Bb(e) {
  return ls.test(e) ? Gb(e) : jb(e);
}
function jb(e) {
  return {
    contentType: td.lyrics,
    timeStampFormat: rd.notSynchronized,
    text: e.trim(),
    syncText: []
  };
}
function Gb(e) {
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
    contentType: td.lyrics,
    timeStampFormat: rd.milliseconds,
    text: r.map((n) => n.text).join(`
`),
    syncText: r
  };
}
const jt = Ir("music-metadata:collector"), zb = ["matroska", "APEv2", "vorbis", "ID3v2.4", "ID3v2.3", "ID3v2.2", "exif", "asf", "iTunes", "AIFF", "ID3v1"];
class Hb {
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
    }, this.commonOrigin = {}, this.originPriority = {}, this.tagMapper = new Mb(), this.opts = t;
    let r = 1;
    for (const n of zb)
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
    jt(`streamInfo: type=${t.type ? lb[t.type] : "?"}, codec=${t.codecName}`), this.format.trackInfo.push(t);
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
          const n = (this.common.artists || []).concat([r.value]), a = { id: "artist", value: qb(n) };
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
        r.value = gb(r.value);
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
        typeof r.value == "string" && (r.value = Bb(r.value));
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
    if (Eb(r.id))
      if (i <= n)
        this.common[r.id] = r.value, this.commonOrigin[r.id] = i;
      else
        return jt(`Ignore native tag (singleton): ${t}.${r.id} = ${r.value}`);
    else if (i === n)
      !vb(r.id) || this.common[r.id].indexOf(r.value) === -1 ? this.common[r.id].push(r.value) : jt(`Ignore duplicate value: ${t}.${r.id} = ${r.value}`);
    else if (i < n)
      this.common[r.id] = [r.value], this.commonOrigin[r.id] = i;
    else
      return jt(`Ignore native tag (list): ${t}.${r.id} = ${r.value}`);
    (a = this.opts) != null && a.observer && this.opts.observer({ metadata: this, tag: { type: "common", id: r.id, value: r.value } });
  }
}
function qb(e) {
  return e.length > 2 ? `${e.slice(0, e.length - 1).join(", ")} & ${e[e.length - 1]}` : e.join(" & ");
}
const Xb = {
  parserType: "mpeg",
  extensions: [".mp2", ".mp3", ".m2a", ".aac", "aacp"],
  mimeTypes: ["audio/mpeg", "audio/mp3", "audio/aacs", "audio/aacp"],
  async load() {
    return (await import("./MpegParser-DE8kb57n.js")).MpegParser;
  }
}, Wb = {
  parserType: "apev2",
  extensions: [".ape"],
  mimeTypes: ["audio/ape", "audio/monkeys-audio"],
  async load() {
    return (await Promise.resolve().then(() => bS)).APEv2Parser;
  }
}, Vb = {
  parserType: "asf",
  extensions: [".asf"],
  mimeTypes: ["audio/ms-wma", "video/ms-wmv", "audio/ms-asf", "video/ms-asf", "application/vnd.ms-asf"],
  async load() {
    return (await import("./AsfParser-WFrmwUIP.js")).AsfParser;
  }
}, Yb = {
  parserType: "dsdiff",
  extensions: [".dff"],
  mimeTypes: ["audio/dsf", "audio/dsd"],
  async load() {
    return (await import("./DsdiffParser-BdbH8WQD.js")).DsdiffParser;
  }
}, Kb = {
  parserType: "aiff",
  extensions: [".aif", "aiff", "aifc"],
  mimeTypes: ["audio/aiff", "audio/aif", "audio/aifc", "application/aiff"],
  async load() {
    return (await import("./AiffParser-Cqh5Ch9_.js")).AIFFParser;
  }
}, Jb = {
  parserType: "dsf",
  extensions: [".dsf"],
  mimeTypes: ["audio/dsf"],
  async load() {
    return (await import("./DsfParser-BGDULnqQ.js")).DsfParser;
  }
}, Qb = {
  parserType: "flac",
  extensions: [".flac"],
  mimeTypes: ["audio/flac"],
  async load() {
    return (await import("./FlacParser-BeRxslM-.js").then((e) => e.d)).FlacParser;
  }
}, Zb = {
  parserType: "matroska",
  extensions: [".mka", ".mkv", ".mk3d", ".mks", "webm"],
  mimeTypes: ["audio/matroska", "video/matroska", "audio/webm", "video/webm"],
  async load() {
    return (await import("./MatroskaParser-BNOI8Ej6.js")).MatroskaParser;
  }
}, eS = {
  parserType: "mp4",
  extensions: [".mp4", ".m4a", ".m4b", ".m4pa", "m4v", "m4r", "3gp", ".mov", ".movie", ".qt"],
  mimeTypes: ["audio/mp4", "audio/m4a", "video/m4v", "video/mp4", "video/quicktime"],
  async load() {
    return (await import("./MP4Parser-D7T1P6L2.js")).MP4Parser;
  }
}, tS = {
  parserType: "musepack",
  extensions: [".mpc"],
  mimeTypes: ["audio/musepack"],
  async load() {
    return (await import("./MusepackParser-yTraNREv.js")).MusepackParser;
  }
}, rS = {
  parserType: "ogg",
  extensions: [".ogg", ".ogv", ".oga", ".ogm", ".ogx", ".opus", ".spx"],
  mimeTypes: ["audio/ogg", "audio/opus", "audio/speex", "video/ogg"],
  // RFC 7845, RFC 6716, RFC 5574
  async load() {
    return (await import("./OggParser-D8jlyw6C.js")).OggParser;
  }
}, nS = {
  parserType: "wavpack",
  extensions: [".wv", ".wvp"],
  mimeTypes: ["audio/wavpack"],
  async load() {
    return (await import("./WavPackParser-CeA4ybys.js")).WavPackParser;
  }
}, iS = {
  parserType: "riff",
  extensions: [".wav", "wave", ".bwf"],
  mimeTypes: ["audio/vnd.wave", "audio/wav", "audio/wave"],
  async load() {
    return (await import("./WaveParser-BSDhPaNg.js")).WaveParser;
  }
}, Gt = Ir("music-metadata:parser:factory");
function aS(e) {
  const t = Hs.parse(e), r = ab(t.type);
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
      Qb,
      Xb,
      Wb,
      eS,
      Zb,
      iS,
      rS,
      Vb,
      Kb,
      nS,
      tS,
      Jb,
      Yb
    ].forEach((t) => {
      this.registerParser(t);
    });
  }
  registerParser(t) {
    this.parsers.push(t);
  }
  async parse(t, r, n) {
    if (t.supportsRandomAccess() ? (Gt("tokenizer supports random-access, scanning for appending headers"), await CS(t, n)) : Gt("tokenizer does not support random-access, cannot scan for appending headers"), !r) {
      const o = new Uint8Array(4100);
      if (t.fileInfo.mimeType && (r = this.findLoaderForContentType(t.fileInfo.mimeType)), !r && t.fileInfo.path && (r = this.findLoaderForExtension(t.fileInfo.path)), !r) {
        Gt("Guess parser on content..."), await t.peekBuffer(o, { mayBeLess: !0 });
        const l = await Vf(o, { mpegOffsetTolerance: 10 });
        if (!l || !l.mime)
          throw new Jf("Failed to determine audio format");
        if (Gt(`Guessed file type is mime=${l.mime}, extension=${l.ext}`), r = this.findLoaderForContentType(l.mime), !r)
          throw new Qf(`Guessed MIME-type not supported: ${l.mime}`);
      }
    }
    Gt(`Loading ${r.parserType} parser...`);
    const i = new Hb(n), a = await r.load(), s = new a(i, t, n ?? {});
    return Gt(`Parser ${r.parserType} loaded`), await s.parse(), i.format.trackInfo && (i.format.hasAudio === void 0 && i.setFormat("hasAudio", !!i.format.trackInfo.find((o) => o.type === dt.audio)), i.format.hasVideo === void 0 && i.setFormat("hasVideo", !!i.format.trackInfo.find((o) => o.type === dt.video))), i.toCommonMetadata();
  }
  /**
   * @param filePath - Path, filename or extension to audio file
   * @return Parser submodule name
   */
  findLoaderForExtension(t) {
    if (!t)
      return;
    const r = oS(t).toLocaleLowerCase() || t;
    return this.parsers.find((n) => n.extensions.indexOf(r) !== -1);
  }
  findLoaderForContentType(t) {
    let r;
    if (!t)
      return;
    try {
      r = aS(t);
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
function oS(e) {
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
let Jn, Qn;
function lS() {
  if (!(typeof globalThis.TextDecoder > "u"))
    return Jn ?? (Jn = new globalThis.TextDecoder("utf-8"));
}
function cS() {
  if (!(typeof globalThis.TextEncoder > "u"))
    return Qn ?? (Qn = new globalThis.TextEncoder());
}
const Zt = 32 * 1024;
function Ji(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = lS();
      return r ? r.decode(e) : fS(e);
    }
    case "utf-16le":
      return dS(e);
    case "us-ascii":
    case "ascii":
      return pS(e);
    case "latin1":
    case "iso-8859-1":
      return hS(e);
    case "windows-1252":
      return mS(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function uS(e = "", t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = cS();
      return r ? r.encode(e) : gS(e);
    }
    case "utf-16le":
      return yS(e);
    case "us-ascii":
    case "ascii":
      return xS(e);
    case "latin1":
    case "iso-8859-1":
      return wS(e);
    case "windows-1252":
      return ES(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function fS(e) {
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
    r.length >= Zt && (t.push(r), r = "");
  }
  return r && t.push(r), t.join("");
}
function dS(e) {
  const t = e.length & -2;
  if (t === 0)
    return "";
  const r = [], n = Zt;
  for (let i = 0; i < t; ) {
    const a = Math.min(n, t - i >> 1), s = new Array(a);
    for (let o = 0; o < a; o++, i += 2)
      s[o] = e[i] | e[i + 1] << 8;
    r.push(String.fromCharCode.apply(null, s));
  }
  return r.join("");
}
function pS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Zt) {
    const n = Math.min(e.length, r + Zt), i = new Array(n - r);
    for (let a = r, s = 0; a < n; a++, s++)
      i[s] = e[a] & 127;
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function hS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Zt) {
    const n = Math.min(e.length, r + Zt), i = new Array(n - r);
    for (let a = r, s = 0; a < n; a++, s++)
      i[s] = e[a];
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function mS(e) {
  const t = [];
  let r = "";
  for (let n = 0; n < e.length; n++) {
    const i = e[n], a = i >= 128 && i <= 159 ? id[i] : void 0;
    r += a ?? String.fromCharCode(i), r.length >= Zt && (t.push(r), r = "");
  }
  return r && t.push(r), t.join("");
}
function gS(e) {
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
function yS(e) {
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
function wS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r) & 255;
  return t;
}
function ES(e) {
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
const vS = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/, sd = {
  len: 4,
  get: (e, t) => {
    const r = Ji(e.subarray(t, t + sd.len), "latin1");
    if (!r.match(vS))
      throw new qs(`FourCC contains invalid characters: ${pb(r)} "${r}"`);
    return r;
  },
  put: (e, t, r) => {
    const n = uS(r, "latin1");
    if (n.length !== 4)
      throw new Zf("Invalid length");
    return e.set(n, t), t + 4;
  }
}, Zn = {
  text_utf8: 0,
  binary: 1,
  external_info: 2,
  reserved: 3
}, Ec = {
  len: 52,
  get: (e, t) => ({
    // should equal 'MAC '
    ID: sd.get(e, t),
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
}, TS = {
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
    ID: new xe(8, "ascii").get(e, t),
    // equals CURRENT_APE_TAG_VERSION
    version: K.get(e, t + 8),
    // the complete size of the tag, including this footer (excludes header)
    size: K.get(e, t + 12),
    // the number of fields in the tag
    fields: K.get(e, t + 16),
    // reserved for later use (must be zero),
    flags: od(K.get(e, t + 20))
  })
}, Ba = {
  len: 8,
  get: (e, t) => ({
    // Length of assigned value in bytes
    size: K.get(e, t),
    // reserved for later use (must be zero),
    flags: od(K.get(e, t + 4))
  })
};
function od(e) {
  return {
    containsHeader: ei(e, 31),
    containsFooter: ei(e, 30),
    isHeader: ei(e, 29),
    readOnly: ei(e, 0),
    dataType: (e & 6) >> 1
  };
}
function ei(e, t) {
  return (e & 1 << t) !== 0;
}
const Et = Ir("music-metadata:parser:APEv2"), vc = "APEv2", Tc = "APETAGEX";
class li extends ub("APEv2") {
}
function _S(e, t, r) {
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
    if (i.ID !== Tc)
      throw new li("Unexpected APEv2 Footer ID preamble value");
    return ns(r), new At(t, ns(r), n).parseTags(i);
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
    if (t.ID === Tc)
      return await this.tokenizer.ignore(Ge.len), this.parseTags(t);
    if (Et(`APEv2 header not found at offset=${this.tokenizer.position}`), this.tokenizer.fileInfo.size) {
      const r = this.tokenizer.fileInfo.size - this.tokenizer.position, n = new Uint8Array(r);
      return await this.tokenizer.readBuffer(n), At.parseTagFooter(this.metadata, n, this.options);
    }
  }
  async parse() {
    const t = await this.tokenizer.readToken(Ec);
    if (t.ID !== "MAC ")
      throw new li("Unexpected descriptor ID");
    this.ape.descriptor = t;
    const r = t.descriptorBytes - Ec.len, n = await (r > 0 ? this.parseDescriptorExpansion(r) : this.parseHeader());
    return this.metadata.setAudioOnly(), await this.tokenizer.ignore(n.forwardBytes), this.tryParseApeHeader();
  }
  async parseTags(t) {
    const r = new Uint8Array(256);
    let n = t.size - Ge.len;
    Et(`Parse APE tags at offset=${this.tokenizer.position}, size=${n}`);
    for (let i = 0; i < t.fields; i++) {
      if (n < Ba.len) {
        this.metadata.addWarning(`APEv2 Tag-header: ${t.fields - i} items remaining, but no more tag data to read.`);
        break;
      }
      const a = await this.tokenizer.readToken(Ba);
      n -= Ba.len + a.size, await this.tokenizer.peekBuffer(r, { length: Math.min(r.length, n) });
      let s = xc(r, 0, r.length);
      const o = await this.tokenizer.readToken(new xe(s, "ascii"));
      switch (await this.tokenizer.ignore(1), n -= o.length + 1, a.flags.dataType) {
        case Zn.text_utf8: {
          const d = (await this.tokenizer.readToken(new xe(a.size, "utf8"))).split(/\x00/g);
          await Promise.all(d.map((c) => this.metadata.addTag(vc, o, c)));
          break;
        }
        case Zn.binary:
          if (this.options.skipCovers)
            await this.tokenizer.ignore(a.size);
          else {
            const l = new Uint8Array(a.size);
            await this.tokenizer.readBuffer(l), s = xc(l, 0, l.length);
            const d = Ji(l.subarray(0, s), "utf-8"), c = l.subarray(s + 1);
            await this.metadata.addTag(vc, o, {
              description: d,
              data: c
            });
          }
          break;
        case Zn.external_info:
          Et(`Ignore external info ${o}`), await this.tokenizer.ignore(a.size);
          break;
        case Zn.reserved:
          Et(`Ignore external info ${o}`), this.metadata.addWarning(`APEv2 header declares a reserved datatype for "${o}"`), await this.tokenizer.ignore(a.size);
          break;
      }
    }
  }
  async parseDescriptorExpansion(t) {
    return await this.tokenizer.ignore(t), this.parseHeader();
  }
  async parseHeader() {
    const t = await this.tokenizer.readToken(TS);
    if (this.metadata.setFormat("lossless", !0), this.metadata.setFormat("container", "Monkey's Audio"), this.metadata.setFormat("bitsPerSample", t.bitsPerSample), this.metadata.setFormat("sampleRate", t.sampleRate), this.metadata.setFormat("numberOfChannels", t.channel), this.metadata.setFormat("duration", At.calculateDuration(t)), !this.ape.descriptor)
      throw new li("Missing APE descriptor");
    return {
      forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes
    };
  }
}
const bS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  APEv2Parser: At,
  ApeContentError: li,
  tryParseApeHeader: _S
}, Symbol.toStringTag, { value: "Module" })), ti = Ir("music-metadata:parser:ID3v1"), _c = [
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
], ri = {
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
      zeroByte: Kt.get(e, t + 127),
      // track: ID3v1.1 field added by Michael Mutschler
      track: Kt.get(e, t + 126),
      genre: Kt.get(e, t + 127)
    } : null;
  }
};
class ur {
  constructor(t) {
    this.len = t, this.stringType = new xe(t, "latin1");
  }
  get(t, r) {
    let n = this.stringType.get(t, r);
    return n = fb(n), n = n.trim(), n.length > 0 ? n : void 0;
  }
}
class ld extends nd {
  constructor(t, r, n) {
    super(t, r, n), this.apeHeader = n.apeHeader;
  }
  static getGenre(t) {
    if (t < _c.length)
      return _c[t];
  }
  async parse() {
    if (!this.tokenizer.fileInfo.size) {
      ti("Skip checking for ID3v1 because the file-size is unknown");
      return;
    }
    this.apeHeader && (this.tokenizer.ignore(this.apeHeader.offset - this.tokenizer.position), await new At(this.metadata, this.tokenizer, this.options).parseTags(this.apeHeader.footer));
    const t = this.tokenizer.fileInfo.size - ri.len;
    if (this.tokenizer.position > t) {
      ti("Already consumed the last 128 bytes");
      return;
    }
    const r = await this.tokenizer.readToken(ri, t);
    if (r) {
      ti("ID3v1 header found at: pos=%s", this.tokenizer.fileInfo.size - ri.len);
      const n = ["title", "artist", "album", "comment", "track", "year"];
      for (const a of n)
        r[a] && r[a] !== "" && await this.addTag(a, r[a]);
      const i = ld.getGenre(r.genre);
      i && await this.addTag("genre", i);
    } else
      ti("ID3v1 header not found at: pos=%s", this.tokenizer.fileInfo.size - ri.len);
  }
  async addTag(t, r) {
    await this.metadata.addTag("ID3v1", t, r);
  }
}
async function SS(e) {
  if (e.fileInfo.size >= 128) {
    const t = new Uint8Array(3), r = e.position;
    return await e.readBuffer(t, { position: e.fileInfo.size - 128 }), e.setPosition(r), Ji(t, "latin1") === "TAG";
  }
  return !1;
}
const AS = "LYRICS200";
async function IS(e) {
  const t = e.fileInfo.size;
  if (t >= 143) {
    const r = new Uint8Array(15), n = e.position;
    await e.readBuffer(r, { position: t - 143 }), e.setPosition(n);
    const i = Ji(r, "latin1");
    if (i.substring(6) === AS)
      return Number.parseInt(i.substring(0, 6), 10) + 15;
  }
  return 0;
}
async function CS(e, t = {}) {
  let r = e.fileInfo.size;
  if (await SS(e)) {
    r -= 128;
    const n = await IS(e);
    r -= n;
  }
  t.apeHeader = await At.findApeFooterOffset(e, r);
}
const bc = Ir("music-metadata:parser");
async function RS(e, t = {}) {
  bc(`parseFile: ${e}`);
  const r = await a_(e), n = new sS();
  try {
    const i = n.findLoaderForExtension(e);
    i || bc("Parser could not be determined by file extension");
    try {
      return await n.parse(r, i, t);
    } catch (a) {
      throw (a instanceof Jf || a instanceof Qf) && (a.message += `: ${e}`), a;
    }
  } finally {
    await r.close();
  }
}
class DS {
  constructor() {
    ut(this, "client", null);
    ut(this, "player", Sp());
    ut(this, "currentConnection", null);
    ut(this, "isConnected", !1);
    ut(this, "currentGuildId", null);
    ut(this, "currentChannelId", null);
    this.player.on("error", (t) => {
      console.error("[DiscordBot] Audio Player Error:", t.message);
    }), this.player.on(go.Playing, () => {
      console.log("[DiscordBot] Audio Player Playing");
    }), this.player.on(go.Idle, () => {
      console.log("[DiscordBot] Audio Player Idle");
    });
  }
  async login(t) {
    return this.client && (await this.disconnect(), await this.client.destroy()), this.client = new bp({
      intents: [
        ho.Guilds,
        ho.GuildVoiceStates
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
    return r.channels.cache.filter((i) => i.type === mo.GuildVoice).map((i) => ({
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
    if (!i || i.type !== mo.GuildVoice) throw new Error("Invalid channel");
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
    var t, r, n, i, a, s, o, l, d;
    return {
      isConnected: this.isConnected,
      username: ((r = (t = this.client) == null ? void 0 : t.user) == null ? void 0 : r.tag) || null,
      avatar: ((i = (n = this.client) == null ? void 0 : n.user) == null ? void 0 : i.avatarURL()) || null,
      currentGuildId: this.currentGuildId,
      currentChannelId: this.currentChannelId,
      currentGuildName: ((s = (a = this.client) == null ? void 0 : a.guilds.cache.get(this.currentGuildId)) == null ? void 0 : s.name) || null,
      currentChannelName: ((d = (l = (o = this.client) == null ? void 0 : o.guilds.cache.get(this.currentGuildId)) == null ? void 0 : l.channels.cache.get(this.currentChannelId)) == null ? void 0 : d.name) || null
    };
  }
  // Play local file
  async playFile(t) {
    try {
      console.log(`[DiscordBot] Playing file: ${t}`);
      const r = yo(t, {
        metadata: {
          title: t
        }
      });
      this.player.play(r);
    } catch (r) {
      console.error("[DiscordBot] Play File Error:", r);
    }
  }
  // Play Stream (from ytdl for example)
  // Note: If resource is a Readable stream
  async playStream(t) {
    try {
      console.log("[DiscordBot] Playing stream");
      const r = yo(t);
      this.player.play(r);
    } catch (r) {
      console.error("[DiscordBot] Play Stream Error:", r);
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
}
const cd = ni(import.meta.url);
let Sc = cd("ffmpeg-static");
Ke.isPackaged && (Sc = Sc.replace("app.asar", "app.asar.unpacked"));
function OS(e) {
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
const PS = Ke.requestSingleInstanceLock();
PS ? Ke.on("second-instance", () => {
  ee && (ee.isMinimized() && ee.restore(), ee.focus());
}) : Ke.quit();
const ud = Oe.dirname(xp(import.meta.url));
process.env.APP_ROOT = Oe.join(ud, "..");
const cs = process.env.VITE_DEV_SERVER_URL, mA = Oe.join(process.env.APP_ROOT, "dist-electron"), fd = Oe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = cs ? Oe.join(process.env.APP_ROOT, "public") : fd;
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
  }), cs ? ee.loadURL(cs) : ee.loadFile(Oe.join(fd, "index.html"));
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
  const e = new DS();
  de.handle("discord:login", async (n, i) => await e.login(i)), de.handle("discord:getGuilds", () => e.getGuilds()), de.handle("discord:getChannels", (n, i) => e.getChannels(i)), de.handle("discord:join", async (n, i, a) => await e.joinChannel(i, a)), de.handle("discord:leave", async () => await e.leaveChannel()), de.handle("discord:play", async (n, i) => await e.playFile(i)), de.handle("discord:stop", () => e.stop()), de.handle("discord:pause", () => e.pause()), de.handle("discord:resume", () => e.resume()), de.handle("discord:status", () => e.getStatus()), de.handle("dialog:openDirectory", async () => {
    const { canceled: n, filePaths: i } = await po.showOpenDialog(ee, {
      properties: ["openDirectory"]
    });
    return n ? null : i[0];
  }), de.handle("files:listMusic", async (n, i) => {
    if (!i) return [];
    try {
      const a = await kn.readdir(i), s = [".mp3", ".wav", ".wma", ".m4a", ".flac", ".ogg", ".mp4", ".mov", ".wmv", ".avi"];
      return (await Promise.all(a.map(async (l) => {
        const d = Oe.join(i, l), c = Oe.extname(l).toLowerCase();
        if (!s.includes(c)) return null;
        try {
          const u = await kn.stat(d);
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
  }), de.handle("files:readBuffer", async (n, i) => {
    try {
      return await kn.readFile(i);
    } catch (a) {
      return console.error("Error reading file:", a), null;
    }
  }), de.handle("files:getMetadata", async (n, i) => {
    try {
      const a = await RS(i);
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
  }), de.handle("app:active-window", async () => {
    const n = Oe.join(process.env.APP_ROOT, "scripts/get-active-window.ps1");
    return await OS(n);
  });
  const t = ni(import.meta.url)("yt-dlp-wrap").default, r = async () => {
    const n = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp", i = Oe.join(Ke.getPath("userData"), n);
    try {
      await kn.access(i);
    } catch {
      console.log("Downloading yt-dlp binary..."), await t.downloadFromGithub(i), console.log("Downloaded yt-dlp to", i);
    }
    return new t(i);
  };
  de.handle("search:youtube", async (n, i) => {
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
  }), de.handle("download:youtube", async (n, i, a, s) => {
    try {
      const o = await r(), l = ni(import.meta.url)("ffmpeg-static").replace("app.asar", "app.asar.unpacked");
      let d = a.replace(/[\\/:*?"<>|]/g, "_").trim();
      const { filePath: c } = await po.showSaveDialog(ee, {
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
  }), de.handle("search:artistImage", async (n, i) => {
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
  }), de.handle("search:lyrics", async (n, i, a, s, o) => {
    try {
      const l = ni(import.meta.url)("get-artist-title");
      console.log(`[Lyrics] Search Request: Title="${i}", Artist="${a}", Duration=${o}`);
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
      let w = [];
      if (i && a) {
        const D = `${i} ${a}`;
        console.log(`[Lyrics] Strategy A: ${D}`);
        const [k, H] = await Promise.all([
          u(D, o),
          p(D, o)
        ]);
        w.push(...k, ...H);
      }
      const x = d(i), T = d(a);
      if (x && (x !== i || T !== a)) {
        const D = `${x} ${T}`;
        console.log(`[Lyrics] Strategy B: ${D}`);
        const [k, H] = await Promise.all([
          u(D, o),
          p(D, o)
        ]);
        w.push(...k, ...H);
      }
      if (s) {
        let D = Oe.basename(s, Oe.extname(s));
        const k = D.match(/(.+?)《(.+?)》(.*)/);
        if (k) {
          const te = k[1], y = k[2], j = d(te).replace(/合唱/g, "").trim(), U = d(y);
          if (U) {
            const M = `${U} ${j}`;
            console.log(`[Lyrics] Strategy C-0 (Variety Pattern): ${M}`), w.push(...await u(M, o)), w.push(...await p(M, o)), j.length > 0 && (console.log(`[Lyrics] Strategy C-0 (Title + Duration): ${U}`), w.push(...await u(U, o)), w.push(...await p(U, o)));
          }
        }
        const H = l(D.replace(/_/g, " "));
        if (H && H.length === 2) {
          const [te, y] = H, j = `${y} ${te}`;
          console.log(`[Lyrics] Strategy C-1 (Parsed): ${j}`), w.push(...await u(j, o)), w.push(...await p(j, o));
        }
        const q = d(D);
        console.log(`[Lyrics] Strategy C-2 (Raw Cleaned): ${q}`), w.push(...await u(q, o)), w.push(...await p(q, o));
      }
      if (w.length === 0)
        return console.log("[Lyrics] No candidates found."), null;
      const b = /* @__PURE__ */ new Map();
      w.forEach((D) => {
        const k = `${D.source}-${D.id}`;
        b.has(k) || b.set(k, D);
      });
      let _ = Array.from(b.values());
      if (o && o > 0) {
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
  }), de.handle("update:check", () => {
    st.autoUpdater.checkForUpdates();
  }), de.handle("update:install", () => {
    st.autoUpdater.quitAndInstall(!0, !0);
  }), de.handle("app:version", () => Ke.getVersion());
});
export {
  fA as A,
  nd as B,
  zf as C,
  nA as D,
  Ce as E,
  sd as F,
  Ji as G,
  _c as H,
  d_ as I,
  _S as J,
  fb as K,
  dA as L,
  ld as M,
  Gf as N,
  xb as O,
  xc as P,
  uA as Q,
  wb as R,
  xe as S,
  dt as T,
  vi as U,
  hA as V,
  pA as W,
  yb as X,
  cs as Y,
  mA as Z,
  fd as _,
  Xt as a,
  Kt as b,
  Ir as c,
  Xf as d,
  os as e,
  K as f,
  ed as g,
  aA as h,
  cA as i,
  qf as j,
  ie as k,
  Gr as l,
  ub as m,
  w_ as n,
  ns as o,
  y_ as p,
  g_ as q,
  b_ as r,
  lA as s,
  T_ as t,
  iA as u,
  x_ as v,
  sA as w,
  Hf as x,
  m_ as y,
  as as z
};
