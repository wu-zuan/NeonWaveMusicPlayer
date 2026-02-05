var gp = Object.defineProperty;
var yp = (e, t, r) => t in e ? gp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Ke = (e, t, r) => yp(e, typeof t != "symbol" ? t + "" : t, r);
import Jt, { app as Xe, BrowserWindow as Ic, Notification as wp, ipcMain as re, dialog as go } from "electron";
import { createRequire as ii } from "node:module";
import { fileURLToPath as xp } from "node:url";
import Ie from "node:path";
import Pn, { open as Ep } from "node:fs/promises";
import kt from "fs";
import vp from "constants";
import cn from "stream";
import ps from "util";
import Cc from "assert";
import ue from "path";
import Ai from "child_process";
import Rc from "events";
import un from "crypto";
import Oc from "tty";
import Ii from "os";
import br from "url";
import Tp from "string_decoder";
import Dc from "zlib";
import _p from "http";
import { exec as bp } from "node:child_process";
import { Client as Sp, GatewayIntentBits as yo, ChannelType as wo } from "discord.js";
import { createAudioPlayer as Ap, joinVoiceChannel as Ip, createAudioResource as Nn, StreamType as la } from "@discordjs/voice";
import { PassThrough as Cp } from "node:stream";
var ke = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Rp(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ot = {}, er = {}, Fe = {};
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
var xt = vp, Op = process.cwd, ai = null, Dp = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return ai || (ai = Op.call(process)), ai;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var xo = process.chdir;
  process.chdir = function(e) {
    ai = null, xo.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, xo);
}
var kp = Pp;
function Pp(e) {
  xt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = a(e.chown), e.fchown = a(e.fchown), e.lchown = a(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = o(e.stat), e.fstat = o(e.fstat), e.lstat = o(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, u, p) {
    p && process.nextTick(p);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, u, p, m) {
    m && process.nextTick(m);
  }, e.lchownSync = function() {
  }), Dp === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function u(p, m, E) {
      var w = Date.now(), T = 0;
      c(p, m, function b(_) {
        if (_ && (_.code === "EACCES" || _.code === "EPERM" || _.code === "EBUSY") && Date.now() - w < 6e4) {
          setTimeout(function() {
            e.stat(m, function(N, $) {
              N && N.code === "ENOENT" ? c(p, m, b) : E(_);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        E && E(_);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function u(p, m, E, w, T, b) {
      var _;
      if (b && typeof b == "function") {
        var N = 0;
        _ = function($, B, k) {
          if ($ && $.code === "EAGAIN" && N < 10)
            return N++, c.call(e, p, m, E, w, T, _);
          b.apply(this, arguments);
        };
      }
      return c.call(e, p, m, E, w, T, _);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(u, p, m, E, w) {
      for (var T = 0; ; )
        try {
          return c.call(e, u, p, m, E, w);
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
    c.lchmod = function(u, p, m) {
      c.open(
        u,
        xt.O_WRONLY | xt.O_SYMLINK,
        p,
        function(E, w) {
          if (E) {
            m && m(E);
            return;
          }
          c.fchmod(w, p, function(T) {
            c.close(w, function(b) {
              m && m(T || b);
            });
          });
        }
      );
    }, c.lchmodSync = function(u, p) {
      var m = c.openSync(u, xt.O_WRONLY | xt.O_SYMLINK, p), E = !0, w;
      try {
        w = c.fchmodSync(m, p), E = !1;
      } finally {
        if (E)
          try {
            c.closeSync(m);
          } catch {
          }
        else
          c.closeSync(m);
      }
      return w;
    };
  }
  function r(c) {
    xt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(u, p, m, E) {
      c.open(u, xt.O_SYMLINK, function(w, T) {
        if (w) {
          E && E(w);
          return;
        }
        c.futimes(T, p, m, function(b) {
          c.close(T, function(_) {
            E && E(b || _);
          });
        });
      });
    }, c.lutimesSync = function(u, p, m) {
      var E = c.openSync(u, xt.O_SYMLINK), w, T = !0;
      try {
        w = c.futimesSync(E, p, m), T = !1;
      } finally {
        if (T)
          try {
            c.closeSync(E);
          } catch {
          }
        else
          c.closeSync(E);
      }
      return w;
    }) : c.futimes && (c.lutimes = function(u, p, m, E) {
      E && process.nextTick(E);
    }, c.lutimesSync = function() {
    });
  }
  function n(c) {
    return c && function(u, p, m) {
      return c.call(e, u, p, function(E) {
        d(E) && (E = null), m && m.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(u, p) {
      try {
        return c.call(e, u, p);
      } catch (m) {
        if (!d(m)) throw m;
      }
    };
  }
  function a(c) {
    return c && function(u, p, m, E) {
      return c.call(e, u, p, m, function(w) {
        d(w) && (w = null), E && E.apply(this, arguments);
      });
    };
  }
  function s(c) {
    return c && function(u, p, m) {
      try {
        return c.call(e, u, p, m);
      } catch (E) {
        if (!d(E)) throw E;
      }
    };
  }
  function o(c) {
    return c && function(u, p, m) {
      typeof p == "function" && (m = p, p = null);
      function E(w, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), m && m.apply(this, arguments);
      }
      return p ? c.call(e, u, p, E) : c.call(e, u, E);
    };
  }
  function l(c) {
    return c && function(u, p) {
      var m = p ? c.call(e, u, p) : c.call(e, u);
      return m && (m.uid < 0 && (m.uid += 4294967296), m.gid < 0 && (m.gid += 4294967296)), m;
    };
  }
  function d(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var u = !process.getuid || process.getuid() !== 0;
    return !!(u && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var Eo = cn.Stream, Np = Fp;
function Fp(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Eo.call(this);
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
    Eo.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var $p = Up, Lp = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Up(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Lp(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ce = kt, Mp = kp, Bp = Np, jp = $p, Fn = ps, _e, ui;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (_e = Symbol.for("graceful-fs.queue"), ui = Symbol.for("graceful-fs.previous")) : (_e = "___graceful-fs.queue", ui = "___graceful-fs.previous");
function zp() {
}
function kc(e, t) {
  Object.defineProperty(e, _e, {
    get: function() {
      return t;
    }
  });
}
var Vt = zp;
Fn.debuglog ? Vt = Fn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Vt = function() {
  var e = Fn.format.apply(Fn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ce[_e]) {
  var Gp = ke[_e] || [];
  kc(ce, Gp), ce.close = function(e) {
    function t(r, n) {
      return e.call(ce, r, function(i) {
        i || vo(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, ui, {
      value: e
    }), t;
  }(ce.close), ce.closeSync = function(e) {
    function t(r) {
      e.apply(ce, arguments), vo();
    }
    return Object.defineProperty(t, ui, {
      value: e
    }), t;
  }(ce.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Vt(ce[_e]), Cc.equal(ce[_e].length, 0);
  });
}
ke[_e] || kc(ke, ce[_e]);
var $e = hs(jp(ce));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ce.__patched && ($e = hs(ce), ce.__patched = !0);
function hs(e) {
  Mp(e), e.gracefulify = hs, e.createReadStream = B, e.createWriteStream = k;
  var t = e.readFile;
  e.readFile = r;
  function r(y, M, j) {
    return typeof M == "function" && (j = M, M = null), U(y, M, j);
    function U(Y, R, S, D) {
      return t(Y, R, function(A) {
        A && (A.code === "EMFILE" || A.code === "ENFILE") ? ir([U, [Y, R, S], A, D || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(y, M, j, U) {
    return typeof j == "function" && (U = j, j = null), Y(y, M, j, U);
    function Y(R, S, D, A, F) {
      return n(R, S, D, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([Y, [R, S, D, A], O, F || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var a = e.appendFile;
  a && (e.appendFile = s);
  function s(y, M, j, U) {
    return typeof j == "function" && (U = j, j = null), Y(y, M, j, U);
    function Y(R, S, D, A, F) {
      return a(R, S, D, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([Y, [R, S, D, A], O, F || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var o = e.copyFile;
  o && (e.copyFile = l);
  function l(y, M, j, U) {
    return typeof j == "function" && (U = j, j = 0), Y(y, M, j, U);
    function Y(R, S, D, A, F) {
      return o(R, S, D, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([Y, [R, S, D, A], O, F || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var d = e.readdir;
  e.readdir = u;
  var c = /^v[0-5]\./;
  function u(y, M, j) {
    typeof M == "function" && (j = M, M = null);
    var U = c.test(process.version) ? function(S, D, A, F) {
      return d(S, Y(
        S,
        D,
        A,
        F
      ));
    } : function(S, D, A, F) {
      return d(S, D, Y(
        S,
        D,
        A,
        F
      ));
    };
    return U(y, M, j);
    function Y(R, S, D, A) {
      return function(F, O) {
        F && (F.code === "EMFILE" || F.code === "ENFILE") ? ir([
          U,
          [R, S, D],
          F,
          A || Date.now(),
          Date.now()
        ]) : (O && O.sort && O.sort(), typeof D == "function" && D.call(this, F, O));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var p = Bp(e);
    b = p.ReadStream, N = p.WriteStream;
  }
  var m = e.ReadStream;
  m && (b.prototype = Object.create(m.prototype), b.prototype.open = _);
  var E = e.WriteStream;
  E && (N.prototype = Object.create(E.prototype), N.prototype.open = $), Object.defineProperty(e, "ReadStream", {
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
      return N;
    },
    set: function(y) {
      N = y;
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
  function b(y, M) {
    return this instanceof b ? (m.apply(this, arguments), this) : b.apply(Object.create(b.prototype), arguments);
  }
  function _() {
    var y = this;
    ae(y.path, y.flags, y.mode, function(M, j) {
      M ? (y.autoClose && y.destroy(), y.emit("error", M)) : (y.fd = j, y.emit("open", j), y.read());
    });
  }
  function N(y, M) {
    return this instanceof N ? (E.apply(this, arguments), this) : N.apply(Object.create(N.prototype), arguments);
  }
  function $() {
    var y = this;
    ae(y.path, y.flags, y.mode, function(M, j) {
      M ? (y.destroy(), y.emit("error", M)) : (y.fd = j, y.emit("open", j));
    });
  }
  function B(y, M) {
    return new e.ReadStream(y, M);
  }
  function k(y, M) {
    return new e.WriteStream(y, M);
  }
  var G = e.open;
  e.open = ae;
  function ae(y, M, j, U) {
    return typeof j == "function" && (U = j, j = null), Y(y, M, j, U);
    function Y(R, S, D, A, F) {
      return G(R, S, D, function(O, q) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? ir([Y, [R, S, D, A], O, F || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  return e;
}
function ir(e) {
  Vt("ENQUEUE", e[0].name, e[1]), ce[_e].push(e), ms();
}
var $n;
function vo() {
  for (var e = Date.now(), t = 0; t < ce[_e].length; ++t)
    ce[_e][t].length > 2 && (ce[_e][t][3] = e, ce[_e][t][4] = e);
  ms();
}
function ms() {
  if (clearTimeout($n), $n = void 0, ce[_e].length !== 0) {
    var e = ce[_e].shift(), t = e[0], r = e[1], n = e[2], i = e[3], a = e[4];
    if (i === void 0)
      Vt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Vt("TIMEOUT", t.name, r);
      var s = r.pop();
      typeof s == "function" && s.call(null, n);
    } else {
      var o = Date.now() - a, l = Math.max(a - i, 1), d = Math.min(l * 1.2, 100);
      o >= d ? (Vt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ce[_e].push(e);
    }
    $n === void 0 && ($n = setTimeout(ms, 0));
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
      r.read(i, a, s, o, l, (p, m, E) => {
        if (p) return u(p);
        c({ bytesRead: m, buffer: E });
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
var gs = {}, Pc = {};
const Hp = ue;
Pc.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Hp.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Nc = er, { checkPath: Fc } = Pc, $c = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
gs.makeDir = async (e, t) => (Fc(e), Nc.mkdir(e, {
  mode: $c(t),
  recursive: !0
}));
gs.makeDirSync = (e, t) => (Fc(e), Nc.mkdirSync(e, {
  mode: $c(t),
  recursive: !0
}));
const qp = Fe.fromPromise, { makeDir: Xp, makeDirSync: ca } = gs, ua = qp(Xp);
var lt = {
  mkdirs: ua,
  mkdirsSync: ca,
  // alias
  mkdirp: ua,
  mkdirpSync: ca,
  ensureDir: ua,
  ensureDirSync: ca
};
const Wp = Fe.fromPromise, Lc = er;
function Vp(e) {
  return Lc.access(e).then(() => !0).catch(() => !1);
}
var tr = {
  pathExists: Wp(Vp),
  pathExistsSync: Lc.existsSync
};
const wr = $e;
function Yp(e, t, r, n) {
  wr.open(e, "r+", (i, a) => {
    if (i) return n(i);
    wr.futimes(a, t, r, (s) => {
      wr.close(a, (o) => {
        n && n(s || o);
      });
    });
  });
}
function Kp(e, t, r) {
  const n = wr.openSync(e, "r+");
  return wr.futimesSync(n, t, r), wr.closeSync(n);
}
var Uc = {
  utimesMillis: Yp,
  utimesMillisSync: Kp
};
const Er = er, xe = ue, Jp = ps;
function Qp(e, t, r) {
  const n = r.dereference ? (i) => Er.stat(i, { bigint: !0 }) : (i) => Er.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, a]) => ({ srcStat: i, destStat: a }));
}
function Zp(e, t, r) {
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
function eh(e, t, r, n, i) {
  Jp.callbackify(Qp)(e, t, n, (a, s) => {
    if (a) return i(a);
    const { srcStat: o, destStat: l } = s;
    if (l) {
      if (fn(o, l)) {
        const d = xe.basename(e), c = xe.basename(t);
        return r === "move" && d !== c && d.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: o, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (o.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!o.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return o.isDirectory() && ys(e, t) ? i(new Error(Ci(e, t, r))) : i(null, { srcStat: o, destStat: l });
  });
}
function th(e, t, r, n) {
  const { srcStat: i, destStat: a } = Zp(e, t, n);
  if (a) {
    if (fn(i, a)) {
      const s = xe.basename(e), o = xe.basename(t);
      if (r === "move" && s !== o && s.toLowerCase() === o.toLowerCase())
        return { srcStat: i, destStat: a, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !a.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && a.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && ys(e, t))
    throw new Error(Ci(e, t, r));
  return { srcStat: i, destStat: a };
}
function Mc(e, t, r, n, i) {
  const a = xe.resolve(xe.dirname(e)), s = xe.resolve(xe.dirname(r));
  if (s === a || s === xe.parse(s).root) return i();
  Er.stat(s, { bigint: !0 }, (o, l) => o ? o.code === "ENOENT" ? i() : i(o) : fn(t, l) ? i(new Error(Ci(e, r, n))) : Mc(e, t, s, n, i));
}
function Bc(e, t, r, n) {
  const i = xe.resolve(xe.dirname(e)), a = xe.resolve(xe.dirname(r));
  if (a === i || a === xe.parse(a).root) return;
  let s;
  try {
    s = Er.statSync(a, { bigint: !0 });
  } catch (o) {
    if (o.code === "ENOENT") return;
    throw o;
  }
  if (fn(t, s))
    throw new Error(Ci(e, r, n));
  return Bc(e, t, a, n);
}
function fn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function ys(e, t) {
  const r = xe.resolve(e).split(xe.sep).filter((i) => i), n = xe.resolve(t).split(xe.sep).filter((i) => i);
  return r.reduce((i, a, s) => i && n[s] === a, !0);
}
function Ci(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Sr = {
  checkPaths: eh,
  checkPathsSync: th,
  checkParentPaths: Mc,
  checkParentPathsSync: Bc,
  isSrcSubdir: ys,
  areIdentical: fn
};
const Me = $e, Wr = ue, rh = lt.mkdirs, nh = tr.pathExists, ih = Uc.utimesMillis, Vr = Sr;
function ah(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Vr.checkPaths(e, t, "copy", r, (i, a) => {
    if (i) return n(i);
    const { srcStat: s, destStat: o } = a;
    Vr.checkParentPaths(e, s, t, "copy", (l) => l ? n(l) : r.filter ? jc(To, o, e, t, r, n) : To(o, e, t, r, n));
  });
}
function To(e, t, r, n, i) {
  const a = Wr.dirname(r);
  nh(a, (s, o) => {
    if (s) return i(s);
    if (o) return fi(e, t, r, n, i);
    rh(a, (l) => l ? i(l) : fi(e, t, r, n, i));
  });
}
function jc(e, t, r, n, i, a) {
  Promise.resolve(i.filter(r, n)).then((s) => s ? e(t, r, n, i, a) : a(), (s) => a(s));
}
function sh(e, t, r, n, i) {
  return n.filter ? jc(fi, e, t, r, n, i) : fi(e, t, r, n, i);
}
function fi(e, t, r, n, i) {
  (n.dereference ? Me.stat : Me.lstat)(t, (s, o) => s ? i(s) : o.isDirectory() ? ph(o, e, t, r, n, i) : o.isFile() || o.isCharacterDevice() || o.isBlockDevice() ? oh(o, e, t, r, n, i) : o.isSymbolicLink() ? gh(e, t, r, n, i) : o.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : o.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function oh(e, t, r, n, i, a) {
  return t ? lh(e, r, n, i, a) : zc(e, r, n, i, a);
}
function lh(e, t, r, n, i) {
  if (n.overwrite)
    Me.unlink(r, (a) => a ? i(a) : zc(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function zc(e, t, r, n, i) {
  Me.copyFile(t, r, (a) => a ? i(a) : n.preserveTimestamps ? ch(e.mode, t, r, i) : Ri(r, e.mode, i));
}
function ch(e, t, r, n) {
  return uh(e) ? fh(r, e, (i) => i ? n(i) : _o(e, t, r, n)) : _o(e, t, r, n);
}
function uh(e) {
  return (e & 128) === 0;
}
function fh(e, t, r) {
  return Ri(e, t | 128, r);
}
function _o(e, t, r, n) {
  dh(t, r, (i) => i ? n(i) : Ri(r, e, n));
}
function Ri(e, t, r) {
  return Me.chmod(e, t, r);
}
function dh(e, t, r) {
  Me.stat(e, (n, i) => n ? r(n) : ih(t, i.atime, i.mtime, r));
}
function ph(e, t, r, n, i, a) {
  return t ? Gc(r, n, i, a) : hh(e.mode, r, n, i, a);
}
function hh(e, t, r, n, i) {
  Me.mkdir(r, (a) => {
    if (a) return i(a);
    Gc(t, r, n, (s) => s ? i(s) : Ri(r, e, i));
  });
}
function Gc(e, t, r, n) {
  Me.readdir(e, (i, a) => i ? n(i) : Hc(a, e, t, r, n));
}
function Hc(e, t, r, n, i) {
  const a = e.pop();
  return a ? mh(e, a, t, r, n, i) : i();
}
function mh(e, t, r, n, i, a) {
  const s = Wr.join(r, t), o = Wr.join(n, t);
  Vr.checkPaths(s, o, "copy", i, (l, d) => {
    if (l) return a(l);
    const { destStat: c } = d;
    sh(c, s, o, i, (u) => u ? a(u) : Hc(e, r, n, i, a));
  });
}
function gh(e, t, r, n, i) {
  Me.readlink(t, (a, s) => {
    if (a) return i(a);
    if (n.dereference && (s = Wr.resolve(process.cwd(), s)), e)
      Me.readlink(r, (o, l) => o ? o.code === "EINVAL" || o.code === "UNKNOWN" ? Me.symlink(s, r, i) : i(o) : (n.dereference && (l = Wr.resolve(process.cwd(), l)), Vr.isSrcSubdir(s, l) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Vr.isSrcSubdir(l, s) ? i(new Error(`Cannot overwrite '${l}' with '${s}'.`)) : yh(s, r, i)));
    else
      return Me.symlink(s, r, i);
  });
}
function yh(e, t, r) {
  Me.unlink(t, (n) => n ? r(n) : Me.symlink(e, t, r));
}
var wh = ah;
const Ce = $e, Yr = ue, xh = lt.mkdirsSync, Eh = Uc.utimesMillisSync, Kr = Sr;
function vh(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Kr.checkPathsSync(e, t, "copy", r);
  return Kr.checkParentPathsSync(e, n, t, "copy"), Th(i, e, t, r);
}
function Th(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Yr.dirname(r);
  return Ce.existsSync(i) || xh(i), qc(e, t, r, n);
}
function _h(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return qc(e, t, r, n);
}
function qc(e, t, r, n) {
  const a = (n.dereference ? Ce.statSync : Ce.lstatSync)(t);
  if (a.isDirectory()) return Oh(a, e, t, r, n);
  if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return bh(a, e, t, r, n);
  if (a.isSymbolicLink()) return Ph(e, t, r, n);
  throw a.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function bh(e, t, r, n, i) {
  return t ? Sh(e, r, n, i) : Xc(e, r, n, i);
}
function Sh(e, t, r, n) {
  if (n.overwrite)
    return Ce.unlinkSync(r), Xc(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function Xc(e, t, r, n) {
  return Ce.copyFileSync(t, r), n.preserveTimestamps && Ah(e.mode, t, r), ws(r, e.mode);
}
function Ah(e, t, r) {
  return Ih(e) && Ch(r, e), Rh(t, r);
}
function Ih(e) {
  return (e & 128) === 0;
}
function Ch(e, t) {
  return ws(e, t | 128);
}
function ws(e, t) {
  return Ce.chmodSync(e, t);
}
function Rh(e, t) {
  const r = Ce.statSync(e);
  return Eh(t, r.atime, r.mtime);
}
function Oh(e, t, r, n, i) {
  return t ? Wc(r, n, i) : Dh(e.mode, r, n, i);
}
function Dh(e, t, r, n) {
  return Ce.mkdirSync(r), Wc(t, r, n), ws(r, e);
}
function Wc(e, t, r) {
  Ce.readdirSync(e).forEach((n) => kh(n, e, t, r));
}
function kh(e, t, r, n) {
  const i = Yr.join(t, e), a = Yr.join(r, e), { destStat: s } = Kr.checkPathsSync(i, a, "copy", n);
  return _h(s, i, a, n);
}
function Ph(e, t, r, n) {
  let i = Ce.readlinkSync(t);
  if (n.dereference && (i = Yr.resolve(process.cwd(), i)), e) {
    let a;
    try {
      a = Ce.readlinkSync(r);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Ce.symlinkSync(i, r);
      throw s;
    }
    if (n.dereference && (a = Yr.resolve(process.cwd(), a)), Kr.isSrcSubdir(i, a))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);
    if (Ce.statSync(r).isDirectory() && Kr.isSrcSubdir(a, i))
      throw new Error(`Cannot overwrite '${a}' with '${i}'.`);
    return Nh(i, r);
  } else
    return Ce.symlinkSync(i, r);
}
function Nh(e, t) {
  return Ce.unlinkSync(t), Ce.symlinkSync(e, t);
}
var Fh = vh;
const $h = Fe.fromCallback;
var xs = {
  copy: $h(wh),
  copySync: Fh
};
const bo = $e, Vc = ue, ne = Cc, Jr = process.platform === "win32";
function Yc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || bo[r], r = r + "Sync", e[r] = e[r] || bo[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Es(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), ne(e, "rimraf: missing path"), ne.strictEqual(typeof e, "string", "rimraf: path should be a string"), ne.strictEqual(typeof r, "function", "rimraf: callback function required"), ne(t, "rimraf: invalid options argument provided"), ne.strictEqual(typeof t, "object", "rimraf: options should be object"), Yc(t), So(e, t, function i(a) {
    if (a) {
      if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const s = n * 100;
        return setTimeout(() => So(e, t, i), s);
      }
      a.code === "ENOENT" && (a = null);
    }
    r(a);
  });
}
function So(e, t, r) {
  ne(e), ne(t), ne(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Jr)
      return Ao(e, t, n, r);
    if (i && i.isDirectory())
      return si(e, t, n, r);
    t.unlink(e, (a) => {
      if (a) {
        if (a.code === "ENOENT")
          return r(null);
        if (a.code === "EPERM")
          return Jr ? Ao(e, t, a, r) : si(e, t, a, r);
        if (a.code === "EISDIR")
          return si(e, t, a, r);
      }
      return r(a);
    });
  });
}
function Ao(e, t, r, n) {
  ne(e), ne(t), ne(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (a, s) => {
      a ? n(a.code === "ENOENT" ? null : r) : s.isDirectory() ? si(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Io(e, t, r) {
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
  n.isDirectory() ? oi(e, t, r) : t.unlinkSync(e);
}
function si(e, t, r, n) {
  ne(e), ne(t), ne(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Lh(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Lh(e, t, r) {
  ne(e), ne(t), ne(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let a = i.length, s;
    if (a === 0) return t.rmdir(e, r);
    i.forEach((o) => {
      Es(Vc.join(e, o), t, (l) => {
        if (!s) {
          if (l) return r(s = l);
          --a === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function Kc(e, t) {
  let r;
  t = t || {}, Yc(t), ne(e, "rimraf: missing path"), ne.strictEqual(typeof e, "string", "rimraf: path should be a string"), ne(t, "rimraf: missing options"), ne.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Jr && Io(e, t, n);
  }
  try {
    r && r.isDirectory() ? oi(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Jr ? Io(e, t, n) : oi(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    oi(e, t, n);
  }
}
function oi(e, t, r) {
  ne(e), ne(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      Uh(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Uh(e, t) {
  if (ne(e), ne(t), t.readdirSync(e).forEach((r) => Kc(Vc.join(e, r), t)), Jr) {
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
var Mh = Es;
Es.sync = Kc;
const di = $e, Bh = Fe.fromCallback, Jc = Mh;
function jh(e, t) {
  if (di.rm) return di.rm(e, { recursive: !0, force: !0 }, t);
  Jc(e, t);
}
function zh(e) {
  if (di.rmSync) return di.rmSync(e, { recursive: !0, force: !0 });
  Jc.sync(e);
}
var Oi = {
  remove: Bh(jh),
  removeSync: zh
};
const Gh = Fe.fromPromise, Qc = er, Zc = ue, eu = lt, tu = Oi, Co = Gh(async function(t) {
  let r;
  try {
    r = await Qc.readdir(t);
  } catch {
    return eu.mkdirs(t);
  }
  return Promise.all(r.map((n) => tu.remove(Zc.join(t, n))));
});
function Ro(e) {
  let t;
  try {
    t = Qc.readdirSync(e);
  } catch {
    return eu.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = Zc.join(e, r), tu.removeSync(r);
  });
}
var Hh = {
  emptyDirSync: Ro,
  emptydirSync: Ro,
  emptyDir: Co,
  emptydir: Co
};
const qh = Fe.fromCallback, ru = ue, _t = $e, nu = lt;
function Xh(e, t) {
  function r() {
    _t.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  _t.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const a = ru.dirname(e);
    _t.stat(a, (s, o) => {
      if (s)
        return s.code === "ENOENT" ? nu.mkdirs(a, (l) => {
          if (l) return t(l);
          r();
        }) : t(s);
      o.isDirectory() ? r() : _t.readdir(a, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Wh(e) {
  let t;
  try {
    t = _t.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = ru.dirname(e);
  try {
    _t.statSync(r).isDirectory() || _t.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") nu.mkdirsSync(r);
    else throw n;
  }
  _t.writeFileSync(e, "");
}
var Vh = {
  createFile: qh(Xh),
  createFileSync: Wh
};
const Yh = Fe.fromCallback, iu = ue, Tt = $e, au = lt, Kh = tr.pathExists, { areIdentical: su } = Sr;
function Jh(e, t, r) {
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
      if (a && su(o, a)) return r(null);
      const l = iu.dirname(t);
      Kh(l, (d, c) => {
        if (d) return r(d);
        if (c) return n(e, t);
        au.mkdirs(l, (u) => {
          if (u) return r(u);
          n(e, t);
        });
      });
    });
  });
}
function Qh(e, t) {
  let r;
  try {
    r = Tt.lstatSync(t);
  } catch {
  }
  try {
    const a = Tt.lstatSync(e);
    if (r && su(a, r)) return;
  } catch (a) {
    throw a.message = a.message.replace("lstat", "ensureLink"), a;
  }
  const n = iu.dirname(t);
  return Tt.existsSync(n) || au.mkdirsSync(n), Tt.linkSync(e, t);
}
var Zh = {
  createLink: Yh(Jh),
  createLinkSync: Qh
};
const bt = ue, Gr = $e, em = tr.pathExists;
function tm(e, t, r) {
  if (bt.isAbsolute(e))
    return Gr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = bt.dirname(t), i = bt.join(n, e);
    return em(i, (a, s) => a ? r(a) : s ? r(null, {
      toCwd: i,
      toDst: e
    }) : Gr.lstat(e, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), r(o)) : r(null, {
      toCwd: e,
      toDst: bt.relative(n, e)
    })));
  }
}
function rm(e, t) {
  let r;
  if (bt.isAbsolute(e)) {
    if (r = Gr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = bt.dirname(t), i = bt.join(n, e);
    if (r = Gr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Gr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: bt.relative(n, e)
    };
  }
}
var nm = {
  symlinkPaths: tm,
  symlinkPathsSync: rm
};
const ou = $e;
function im(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  ou.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function am(e, t) {
  let r;
  if (t) return t;
  try {
    r = ou.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var sm = {
  symlinkType: im,
  symlinkTypeSync: am
};
const om = Fe.fromCallback, lu = ue, Je = er, cu = lt, lm = cu.mkdirs, cm = cu.mkdirsSync, uu = nm, um = uu.symlinkPaths, fm = uu.symlinkPathsSync, fu = sm, dm = fu.symlinkType, pm = fu.symlinkTypeSync, hm = tr.pathExists, { areIdentical: du } = Sr;
function mm(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Je.lstat(t, (i, a) => {
    !i && a.isSymbolicLink() ? Promise.all([
      Je.stat(e),
      Je.stat(t)
    ]).then(([s, o]) => {
      if (du(s, o)) return n(null);
      Oo(e, t, r, n);
    }) : Oo(e, t, r, n);
  });
}
function Oo(e, t, r, n) {
  um(e, t, (i, a) => {
    if (i) return n(i);
    e = a.toDst, dm(a.toCwd, r, (s, o) => {
      if (s) return n(s);
      const l = lu.dirname(t);
      hm(l, (d, c) => {
        if (d) return n(d);
        if (c) return Je.symlink(e, t, o, n);
        lm(l, (u) => {
          if (u) return n(u);
          Je.symlink(e, t, o, n);
        });
      });
    });
  });
}
function gm(e, t, r) {
  let n;
  try {
    n = Je.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const o = Je.statSync(e), l = Je.statSync(t);
    if (du(o, l)) return;
  }
  const i = fm(e, t);
  e = i.toDst, r = pm(i.toCwd, r);
  const a = lu.dirname(t);
  return Je.existsSync(a) || cm(a), Je.symlinkSync(e, t, r);
}
var ym = {
  createSymlink: om(mm),
  createSymlinkSync: gm
};
const { createFile: Do, createFileSync: ko } = Vh, { createLink: Po, createLinkSync: No } = Zh, { createSymlink: Fo, createSymlinkSync: $o } = ym;
var wm = {
  // file
  createFile: Do,
  createFileSync: ko,
  ensureFile: Do,
  ensureFileSync: ko,
  // link
  createLink: Po,
  createLinkSync: No,
  ensureLink: Po,
  ensureLinkSync: No,
  // symlink
  createSymlink: Fo,
  createSymlinkSync: $o,
  ensureSymlink: Fo,
  ensureSymlinkSync: $o
};
function xm(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const a = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + a;
}
function Em(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var vs = { stringify: xm, stripBom: Em };
let vr;
try {
  vr = $e;
} catch {
  vr = kt;
}
const Di = Fe, { stringify: pu, stripBom: hu } = vs;
async function vm(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || vr, n = "throws" in t ? t.throws : !0;
  let i = await Di.fromCallback(r.readFile)(e, t);
  i = hu(i);
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
const Tm = Di.fromPromise(vm);
function _m(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || vr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = hu(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function bm(e, t, r = {}) {
  const n = r.fs || vr, i = pu(t, r);
  await Di.fromCallback(n.writeFile)(e, i, r);
}
const Sm = Di.fromPromise(bm);
function Am(e, t, r = {}) {
  const n = r.fs || vr, i = pu(t, r);
  return n.writeFileSync(e, i, r);
}
var Im = {
  readFile: Tm,
  readFileSync: _m,
  writeFile: Sm,
  writeFileSync: Am
};
const Ln = Im;
var Cm = {
  // jsonfile exports
  readJson: Ln.readFile,
  readJsonSync: Ln.readFileSync,
  writeJson: Ln.writeFile,
  writeJsonSync: Ln.writeFileSync
};
const Rm = Fe.fromCallback, Hr = $e, mu = ue, gu = lt, Om = tr.pathExists;
function Dm(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = mu.dirname(e);
  Om(i, (a, s) => {
    if (a) return n(a);
    if (s) return Hr.writeFile(e, t, r, n);
    gu.mkdirs(i, (o) => {
      if (o) return n(o);
      Hr.writeFile(e, t, r, n);
    });
  });
}
function km(e, ...t) {
  const r = mu.dirname(e);
  if (Hr.existsSync(r))
    return Hr.writeFileSync(e, ...t);
  gu.mkdirsSync(r), Hr.writeFileSync(e, ...t);
}
var Ts = {
  outputFile: Rm(Dm),
  outputFileSync: km
};
const { stringify: Pm } = vs, { outputFile: Nm } = Ts;
async function Fm(e, t, r = {}) {
  const n = Pm(t, r);
  await Nm(e, n, r);
}
var $m = Fm;
const { stringify: Lm } = vs, { outputFileSync: Um } = Ts;
function Mm(e, t, r) {
  const n = Lm(t, r);
  Um(e, n, r);
}
var Bm = Mm;
const jm = Fe.fromPromise, Ne = Cm;
Ne.outputJson = jm($m);
Ne.outputJsonSync = Bm;
Ne.outputJSON = Ne.outputJson;
Ne.outputJSONSync = Ne.outputJsonSync;
Ne.writeJSON = Ne.writeJson;
Ne.writeJSONSync = Ne.writeJsonSync;
Ne.readJSON = Ne.readJson;
Ne.readJSONSync = Ne.readJsonSync;
var zm = Ne;
const Gm = $e, Ha = ue, Hm = xs.copy, yu = Oi.remove, qm = lt.mkdirp, Xm = tr.pathExists, Lo = Sr;
function Wm(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Lo.checkPaths(e, t, "move", r, (a, s) => {
    if (a) return n(a);
    const { srcStat: o, isChangingCase: l = !1 } = s;
    Lo.checkParentPaths(e, o, t, "move", (d) => {
      if (d) return n(d);
      if (Vm(t)) return Uo(e, t, i, l, n);
      qm(Ha.dirname(t), (c) => c ? n(c) : Uo(e, t, i, l, n));
    });
  });
}
function Vm(e) {
  const t = Ha.dirname(e);
  return Ha.parse(t).root === t;
}
function Uo(e, t, r, n, i) {
  if (n) return fa(e, t, r, i);
  if (r)
    return yu(t, (a) => a ? i(a) : fa(e, t, r, i));
  Xm(t, (a, s) => a ? i(a) : s ? i(new Error("dest already exists.")) : fa(e, t, r, i));
}
function fa(e, t, r, n) {
  Gm.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Ym(e, t, r, n) : n());
}
function Ym(e, t, r, n) {
  Hm(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (a) => a ? n(a) : yu(e, n));
}
var Km = Wm;
const wu = $e, qa = ue, Jm = xs.copySync, xu = Oi.removeSync, Qm = lt.mkdirpSync, Mo = Sr;
function Zm(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: a = !1 } = Mo.checkPathsSync(e, t, "move", r);
  return Mo.checkParentPathsSync(e, i, t, "move"), e0(t) || Qm(qa.dirname(t)), t0(e, t, n, a);
}
function e0(e) {
  const t = qa.dirname(e);
  return qa.parse(t).root === t;
}
function t0(e, t, r, n) {
  if (n) return da(e, t, r);
  if (r)
    return xu(t), da(e, t, r);
  if (wu.existsSync(t)) throw new Error("dest already exists.");
  return da(e, t, r);
}
function da(e, t, r) {
  try {
    wu.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return r0(e, t, r);
  }
}
function r0(e, t, r) {
  return Jm(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), xu(e);
}
var n0 = Zm;
const i0 = Fe.fromCallback;
var a0 = {
  move: i0(Km),
  moveSync: n0
}, Pt = {
  // Export promiseified graceful-fs:
  ...er,
  // Export extra methods:
  ...xs,
  ...Hh,
  ...wm,
  ...zm,
  ...lt,
  ...a0,
  ...Ts,
  ...tr,
  ...Oi
}, ht = {}, It = {}, Ee = {}, Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.CancellationError = Ct.CancellationToken = void 0;
const s0 = Rc;
class o0 extends s0.EventEmitter {
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
      return Promise.reject(new Xa());
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
          a(new Xa());
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
Ct.CancellationToken = o0;
class Xa extends Error {
  constructor() {
    super("cancelled");
  }
}
Ct.CancellationError = Xa;
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.newError = l0;
function l0(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Pe = {}, Wa = { exports: {} }, Un = { exports: {} }, pa, Bo;
function c0() {
  if (Bo) return pa;
  Bo = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, a = n * 365.25;
  pa = function(c, u) {
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
        var p = parseFloat(u[1]), m = (u[2] || "ms").toLowerCase();
        switch (m) {
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
  function d(c, u, p, m) {
    var E = u >= p * 1.5;
    return Math.round(c / p) + " " + m + (E ? "s" : "");
  }
  return pa;
}
var ha, jo;
function Eu() {
  if (jo) return ha;
  jo = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = d, n.disable = o, n.enable = a, n.enabled = l, n.humanize = c0(), n.destroy = c, Object.keys(t).forEach((u) => {
      n[u] = t[u];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(u) {
      let p = 0;
      for (let m = 0; m < u.length; m++)
        p = (p << 5) - p + u.charCodeAt(m), p |= 0;
      return n.colors[Math.abs(p) % n.colors.length];
    }
    n.selectColor = r;
    function n(u) {
      let p, m = null, E, w;
      function T(...b) {
        if (!T.enabled)
          return;
        const _ = T, N = Number(/* @__PURE__ */ new Date()), $ = N - (p || N);
        _.diff = $, _.prev = p, _.curr = N, p = N, b[0] = n.coerce(b[0]), typeof b[0] != "string" && b.unshift("%O");
        let B = 0;
        b[0] = b[0].replace(/%([a-zA-Z%])/g, (G, ae) => {
          if (G === "%%")
            return "%";
          B++;
          const y = n.formatters[ae];
          if (typeof y == "function") {
            const M = b[B];
            G = y.call(_, M), b.splice(B, 1), B--;
          }
          return G;
        }), n.formatArgs.call(_, b), (_.log || n.log).apply(_, b);
      }
      return T.namespace = u, T.useColors = n.useColors(), T.color = n.selectColor(u), T.extend = i, T.destroy = n.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (E !== n.namespaces && (E = n.namespaces, w = n.enabled(u)), w),
        set: (b) => {
          m = b;
        }
      }), typeof n.init == "function" && n.init(T), T;
    }
    function i(u, p) {
      const m = n(this.namespace + (typeof p > "u" ? ":" : p) + u);
      return m.log = this.log, m;
    }
    function a(u) {
      n.save(u), n.namespaces = u, n.names = [], n.skips = [];
      const p = (typeof u == "string" ? u : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const m of p)
        m[0] === "-" ? n.skips.push(m.slice(1)) : n.names.push(m);
    }
    function s(u, p) {
      let m = 0, E = 0, w = -1, T = 0;
      for (; m < u.length; )
        if (E < p.length && (p[E] === u[m] || p[E] === "*"))
          p[E] === "*" ? (w = E, T = m, E++) : (m++, E++);
        else if (w !== -1)
          E = w + 1, T++, m = T;
        else
          return !1;
      for (; E < p.length && p[E] === "*"; )
        E++;
      return E === p.length;
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
  return ha = e, ha;
}
var zo;
function u0() {
  return zo || (zo = 1, function(e, t) {
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
    e.exports = Eu()(t);
    const { formatters: o } = e.exports;
    o.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (d) {
        return "[UnexpectedJSONParseError]: " + d.message;
      }
    };
  }(Un, Un.exports)), Un.exports;
}
var Mn = { exports: {} }, ma, Go;
function f0() {
  return Go || (Go = 1, ma = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), ma;
}
var ga, Ho;
function d0() {
  if (Ho) return ga;
  Ho = 1;
  const e = Ii, t = Oc, r = f0(), { env: n } = process;
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
  return ga = {
    supportsColor: o,
    stdout: a(s(!0, t.isatty(1))),
    stderr: a(s(!0, t.isatty(2)))
  }, ga;
}
var qo;
function p0() {
  return qo || (qo = 1, function(e, t) {
    const r = Oc, n = ps;
    t.init = c, t.log = o, t.formatArgs = a, t.save = l, t.load = d, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const p = d0();
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
    t.inspectOpts = Object.keys(process.env).filter((p) => /^debug_/i.test(p)).reduce((p, m) => {
      const E = m.substring(6).toLowerCase().replace(/_([a-z])/g, (T, b) => b.toUpperCase());
      let w = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(w) ? w = !0 : /^(no|off|false|disabled)$/i.test(w) ? w = !1 : w === "null" ? w = null : w = Number(w), p[E] = w, p;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function a(p) {
      const { namespace: m, useColors: E } = this;
      if (E) {
        const w = this.color, T = "\x1B[3" + (w < 8 ? w : "8;5;" + w), b = `  ${T};1m${m} \x1B[0m`;
        p[0] = b + p[0].split(`
`).join(`
` + b), p.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        p[0] = s() + m + " " + p[0];
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
      const m = Object.keys(t.inspectOpts);
      for (let E = 0; E < m.length; E++)
        p.inspectOpts[m[E]] = t.inspectOpts[m[E]];
    }
    e.exports = Eu()(t);
    const { formatters: u } = e.exports;
    u.o = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, u.O = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts);
    };
  }(Mn, Mn.exports)), Mn.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Wa.exports = u0() : Wa.exports = p0();
var vu = Wa.exports;
const Ir = /* @__PURE__ */ Rp(vu);
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.ProgressCallbackTransform = void 0;
const h0 = cn;
class m0 extends h0.Transform {
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
dn.ProgressCallbackTransform = m0;
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.DigestTransform = Pe.HttpExecutor = Pe.HttpError = void 0;
Pe.createHttpError = Va;
Pe.parseJson = _0;
Pe.configureRequestOptionsFromUrl = _u;
Pe.configureRequestUrl = bs;
Pe.safeGetHeader = xr;
Pe.configureRequestOptions = hi;
Pe.safeStringifyJson = mi;
const g0 = un, y0 = vu, w0 = kt, x0 = cn, Tu = br, E0 = Ct, Xo = Ar, v0 = dn, Fr = (0, y0.default)("electron-builder");
function Va(e, t = null) {
  return new _s(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + mi(e.headers), t);
}
const T0 = /* @__PURE__ */ new Map([
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
class _s extends Error {
  constructor(t, r = `HTTP error: ${T0.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Pe.HttpError = _s;
function _0(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class pi {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new E0.CancellationToken(), n) {
    hi(t);
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
    return Fr.enabled && Fr(`Request: ${mi(t)}`), r.createPromise((a, s, o) => {
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
    if (Fr.enabled && Fr(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${mi(r)}`), t.statusCode === 404) {
      a(Va(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const d = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = d >= 300 && d < 400, u = xr(t, "location");
    if (c && u != null) {
      if (s > this.maxRedirects) {
        a(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(pi.prepareRedirectUrlOptions(u, r), n, o, s).then(i).catch(a);
      return;
    }
    t.setEncoding("utf8");
    let p = "";
    t.on("error", a), t.on("data", (m) => p += m), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const m = xr(t, "content-type"), E = m != null && (Array.isArray(m) ? m.find((w) => w.includes("json")) != null : m.includes("json"));
          a(Va(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${E ? JSON.stringify(JSON.parse(p)) : p}
          `));
        } else
          i(p.length === 0 ? null : p);
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
      bs(t, o), hi(o), this.doDownload(o, {
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
      const s = xr(a, "location");
      if (s != null) {
        n < this.maxRedirects ? this.doDownload(pi.prepareRedirectUrlOptions(s, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? S0(r, a) : r.responseHandler(a, r.callback);
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
    const n = _u(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const a = new Tu.URL(t);
      (a.hostname.endsWith(".amazonaws.com") || a.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof _s && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Pe.HttpExecutor = pi;
function _u(e, t) {
  const r = hi(t);
  return bs(new Tu.URL(e), r), r;
}
function bs(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Ya extends x0.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, g0.createHash)(r);
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
      throw (0, Xo.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Xo.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Pe.DigestTransform = Ya;
function b0(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function xr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function S0(e, t) {
  if (!b0(xr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const s = xr(t, "content-length");
    s != null && r.push(new v0.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Ya(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Ya(e.options.sha2, "sha256", "hex"));
  const i = (0, w0.createWriteStream)(e.destination);
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
function hi(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function mi(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.MemoLazy = void 0;
class A0 {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && bu(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
ki.MemoLazy = A0;
function bu(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), a = Object.keys(t);
    return i.length === a.length && i.every((s) => bu(e[s], t[s]));
  }
  return e === t;
}
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.githubUrl = I0;
Pi.getS3LikeProviderBaseUrl = C0;
function I0(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function C0(e) {
  const t = e.provider;
  if (t === "s3")
    return R0(e);
  if (t === "spaces")
    return O0(e);
  throw new Error(`Not supported provider: ${t}`);
}
function R0(e) {
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
  return Su(t, e.path);
}
function Su(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function O0(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Su(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Ss = {};
Object.defineProperty(Ss, "__esModule", { value: !0 });
Ss.retry = Au;
const D0 = Ct;
async function Au(e, t, r, n = 0, i = 0, a) {
  var s;
  const o = new D0.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((s = a == null ? void 0 : a(l)) !== null && s !== void 0) || s) && t > 0 && !o.cancelled)
      return await new Promise((d) => setTimeout(d, r + n * i)), await Au(e, t - 1, r, n, i + 1, a);
    throw l;
  }
}
var As = {};
Object.defineProperty(As, "__esModule", { value: !0 });
As.parseDn = k0;
function k0(e) {
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
const Iu = un, Cu = Ar, P0 = "options.name must be either a string or a Buffer", Wo = (0, Iu.randomBytes)(16);
Wo[0] = Wo[0] | 1;
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
    return N0(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = F0(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (li[t[14] + t[15]] & 240) >> 4,
        variant: Vo((li[t[19] + t[20]] & 224) >> 5),
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
        variant: Vo((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Cu.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
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
Tr.UUID = Qt;
Qt.OID = Qt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Vo(e) {
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
function N0(e, t, r, n, i = qr.ASCII) {
  const a = (0, Iu.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Cu.newError)(P0, "ERR_INVALID_UUID_NAME");
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
function F0(e) {
  return Q[e[0]] + Q[e[1]] + Q[e[2]] + Q[e[3]] + "-" + Q[e[4]] + Q[e[5]] + "-" + Q[e[6]] + Q[e[7]] + "-" + Q[e[8]] + Q[e[9]] + "-" + Q[e[10]] + Q[e[11]] + Q[e[12]] + Q[e[13]] + Q[e[14]] + Q[e[15]];
}
Tr.nil = new Qt("00000000-0000-0000-0000-000000000000");
var pn = {}, Ru = {};
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
      var I = this;
      a(I), I.q = I.c = "", I.bufferCheckPosition = t.MAX_BUFFER_LENGTH, I.opt = f || {}, I.opt.lowercase = I.opt.lowercase || I.opt.lowercasetags, I.looseCase = I.opt.lowercase ? "toLowerCase" : "toUpperCase", I.tags = [], I.closed = I.closedRoot = I.sawRoot = !1, I.tag = I.error = null, I.strict = !!h, I.noscript = !!(h || I.opt.noscript), I.state = y.BEGIN, I.strictEntities = I.opt.strictEntities, I.ENTITIES = I.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), I.attribList = [], I.opt.xmlns && (I.ns = Object.create(w)), I.opt.unquotedAttributeValues === void 0 && (I.opt.unquotedAttributeValues = !h), I.trackPosition = I.opt.position !== !1, I.trackPosition && (I.position = I.line = I.column = 0), j(I, "onready");
    }
    Object.create || (Object.create = function(h) {
      function f() {
      }
      f.prototype = h;
      var I = new f();
      return I;
    }), Object.keys || (Object.keys = function(h) {
      var f = [];
      for (var I in h) h.hasOwnProperty(I) && f.push(I);
      return f;
    });
    function i(h) {
      for (var f = Math.max(t.MAX_BUFFER_LENGTH, 10), I = 0, v = 0, Z = r.length; v < Z; v++) {
        var se = h[r[v]].length;
        if (se > f)
          switch (r[v]) {
            case "textNode":
              Y(h);
              break;
            case "cdata":
              U(h, "oncdata", h.cdata), h.cdata = "";
              break;
            case "script":
              U(h, "onscript", h.script), h.script = "";
              break;
            default:
              S(h, "Max buffer length exceeded: " + r[v]);
          }
        I = Math.max(I, se);
      }
      var fe = t.MAX_BUFFER_LENGTH - I;
      h.bufferCheckPosition = fe + h.position;
    }
    function a(h) {
      for (var f = 0, I = r.length; f < I; f++)
        h[r[f]] = "";
    }
    function s(h) {
      Y(h), h.cdata !== "" && (U(h, "oncdata", h.cdata), h.cdata = ""), h.script !== "" && (U(h, "onscript", h.script), h.script = "");
    }
    n.prototype = {
      end: function() {
        D(this);
      },
      write: tt,
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
      var I = this;
      this._parser.onend = function() {
        I.emit("end");
      }, this._parser.onerror = function(v) {
        I.emit("error", v), I._parser.error = null;
      }, this._decoder = null, l.forEach(function(v) {
        Object.defineProperty(I, "on" + v, {
          get: function() {
            return I._parser["on" + v];
          },
          set: function(Z) {
            if (!Z)
              return I.removeAllListeners(v), I._parser["on" + v] = Z, Z;
            I.on(v, Z);
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
          var f = Tp.StringDecoder;
          this._decoder = new f("utf8");
        }
        h = this._decoder.write(h);
      }
      return this._parser.write(h.toString()), this.emit("data", h), !0;
    }, c.prototype.end = function(h) {
      return h && h.length && this.write(h), this._parser.end(), !0;
    }, c.prototype.on = function(h, f) {
      var I = this;
      return !I._parser["on" + h] && l.indexOf(h) !== -1 && (I._parser["on" + h] = function() {
        var v = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        v.splice(0, 0, h), I.emit.apply(I, v);
      }), o.prototype.on.call(I, h, f);
    };
    var u = "[CDATA[", p = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", E = "http://www.w3.org/2000/xmlns/", w = { xml: m, xmlns: E }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, b = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, _ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, N = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function $(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function B(h) {
      return h === '"' || h === "'";
    }
    function k(h) {
      return h === ">" || $(h);
    }
    function G(h, f) {
      return h.test(f);
    }
    function ae(h, f) {
      return !G(h, f);
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
      var f = t.ENTITIES[h], I = typeof f == "number" ? String.fromCharCode(f) : f;
      t.ENTITIES[h] = I;
    });
    for (var M in t.STATE)
      t.STATE[t.STATE[M]] = M;
    y = t.STATE;
    function j(h, f, I) {
      h[f] && h[f](I);
    }
    function U(h, f, I) {
      h.textNode && Y(h), j(h, f, I);
    }
    function Y(h) {
      h.textNode = R(h.opt, h.textNode), h.textNode && j(h, "ontext", h.textNode), h.textNode = "";
    }
    function R(h, f) {
      return h.trim && (f = f.trim()), h.normalize && (f = f.replace(/\s+/g, " ")), f;
    }
    function S(h, f) {
      return Y(h), h.trackPosition && (f += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), f = new Error(f), h.error = f, j(h, "onerror", f), h;
    }
    function D(h) {
      return h.sawRoot && !h.closedRoot && A(h, "Unclosed root tag"), h.state !== y.BEGIN && h.state !== y.BEGIN_WHITESPACE && h.state !== y.TEXT && S(h, "Unexpected end"), Y(h), h.c = "", h.closed = !0, j(h, "onend"), n.call(h, h.strict, h.opt), h;
    }
    function A(h, f) {
      if (typeof h != "object" || !(h instanceof n))
        throw new Error("bad call to strictFail");
      h.strict && S(h, f);
    }
    function F(h) {
      h.strict || (h.tagName = h.tagName[h.looseCase]());
      var f = h.tags[h.tags.length - 1] || h, I = h.tag = { name: h.tagName, attributes: {} };
      h.opt.xmlns && (I.ns = f.ns), h.attribList.length = 0, U(h, "onopentagstart", I);
    }
    function O(h, f) {
      var I = h.indexOf(":"), v = I < 0 ? ["", h] : h.split(":"), Z = v[0], se = v[1];
      return f && h === "xmlns" && (Z = "xmlns", se = ""), { prefix: Z, local: se };
    }
    function q(h) {
      if (h.strict || (h.attribName = h.attribName[h.looseCase]()), h.attribList.indexOf(h.attribName) !== -1 || h.tag.attributes.hasOwnProperty(h.attribName)) {
        h.attribName = h.attribValue = "";
        return;
      }
      if (h.opt.xmlns) {
        var f = O(h.attribName, !0), I = f.prefix, v = f.local;
        if (I === "xmlns")
          if (v === "xml" && h.attribValue !== m)
            A(
              h,
              "xml: prefix must be bound to " + m + `
Actual: ` + h.attribValue
            );
          else if (v === "xmlns" && h.attribValue !== E)
            A(
              h,
              "xmlns: prefix must be bound to " + E + `
Actual: ` + h.attribValue
            );
          else {
            var Z = h.tag, se = h.tags[h.tags.length - 1] || h;
            Z.ns === se.ns && (Z.ns = Object.create(se.ns)), Z.ns[v] = h.attribValue;
          }
        h.attribList.push([h.attribName, h.attribValue]);
      } else
        h.tag.attributes[h.attribName] = h.attribValue, U(h, "onattribute", {
          name: h.attribName,
          value: h.attribValue
        });
      h.attribName = h.attribValue = "";
    }
    function K(h, f) {
      if (h.opt.xmlns) {
        var I = h.tag, v = O(h.tagName);
        I.prefix = v.prefix, I.local = v.local, I.uri = I.ns[v.prefix] || "", I.prefix && !I.uri && (A(
          h,
          "Unbound namespace prefix: " + JSON.stringify(h.tagName)
        ), I.uri = v.prefix);
        var Z = h.tags[h.tags.length - 1] || h;
        I.ns && Z.ns !== I.ns && Object.keys(I.ns).forEach(function(bn) {
          U(h, "onopennamespace", {
            prefix: bn,
            uri: I.ns[bn]
          });
        });
        for (var se = 0, fe = h.attribList.length; se < fe; se++) {
          var ve = h.attribList[se], Se = ve[0], mt = ve[1], he = O(Se, !0), Ve = he.prefix, ea = he.local, _n = Ve === "" ? "" : I.ns[Ve] || "", Or = {
            name: Se,
            value: mt,
            prefix: Ve,
            local: ea,
            uri: _n
          };
          Ve && Ve !== "xmlns" && !_n && (A(
            h,
            "Unbound namespace prefix: " + JSON.stringify(Ve)
          ), Or.uri = Ve), h.tag.attributes[Se] = Or, U(h, "onattribute", Or);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!f, h.sawRoot = !0, h.tags.push(h.tag), U(h, "onopentag", h.tag), f || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = y.SCRIPT : h.state = y.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function X(h) {
      if (!h.tagName) {
        A(h, "Weird empty close tag."), h.textNode += "</>", h.state = y.TEXT;
        return;
      }
      if (h.script) {
        if (h.tagName !== "script") {
          h.script += "</" + h.tagName + ">", h.tagName = "", h.state = y.SCRIPT;
          return;
        }
        U(h, "onscript", h.script), h.script = "";
      }
      var f = h.tags.length, I = h.tagName;
      h.strict || (I = I[h.looseCase]());
      for (var v = I; f--; ) {
        var Z = h.tags[f];
        if (Z.name !== v)
          A(h, "Unexpected close tag");
        else
          break;
      }
      if (f < 0) {
        A(h, "Unmatched closing tag: " + h.tagName), h.textNode += "</" + h.tagName + ">", h.state = y.TEXT;
        return;
      }
      h.tagName = I;
      for (var se = h.tags.length; se-- > f; ) {
        var fe = h.tag = h.tags.pop();
        h.tagName = h.tag.name, U(h, "onclosetag", h.tagName);
        var ve = {};
        for (var Se in fe.ns)
          ve[Se] = fe.ns[Se];
        var mt = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && fe.ns !== mt.ns && Object.keys(fe.ns).forEach(function(he) {
          var Ve = fe.ns[he];
          U(h, "onclosenamespace", { prefix: he, uri: Ve });
        });
      }
      f === 0 && (h.closedRoot = !0), h.tagName = h.attribValue = h.attribName = "", h.attribList.length = 0, h.state = y.TEXT;
    }
    function te(h) {
      var f = h.entity, I = f.toLowerCase(), v, Z = "";
      return h.ENTITIES[f] ? h.ENTITIES[f] : h.ENTITIES[I] ? h.ENTITIES[I] : (f = I, f.charAt(0) === "#" && (f.charAt(1) === "x" ? (f = f.slice(2), v = parseInt(f, 16), Z = v.toString(16)) : (f = f.slice(1), v = parseInt(f, 10), Z = v.toString(10))), f = f.replace(/^0+/, ""), isNaN(v) || Z.toLowerCase() !== f || v < 0 || v > 1114111 ? (A(h, "Invalid character entity"), "&" + h.entity + ";") : String.fromCodePoint(v));
    }
    function ge(h, f) {
      f === "<" ? (h.state = y.OPEN_WAKA, h.startTagPosition = h.position) : $(f) || (A(h, "Non-whitespace before first tag."), h.textNode = f, h.state = y.TEXT);
    }
    function H(h, f) {
      var I = "";
      return f < h.length && (I = h.charAt(f)), I;
    }
    function tt(h) {
      var f = this;
      if (this.error)
        throw this.error;
      if (f.closed)
        return S(
          f,
          "Cannot write after close. Assign an onready handler."
        );
      if (h === null)
        return D(f);
      typeof h == "object" && (h = h.toString());
      for (var I = 0, v = ""; v = H(h, I++), f.c = v, !!v; )
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
              for (var se = I - 1; v && v !== "<" && v !== "&"; )
                v = H(h, I++), v && f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++);
              f.textNode += h.substring(se, I - 1);
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
            else if (!$(v)) if (G(T, v))
              f.state = y.OPEN_TAG, f.tagName = v;
            else if (v === "/")
              f.state = y.CLOSE_TAG, f.tagName = "";
            else if (v === "?")
              f.state = y.PROC_INST, f.procInstName = f.procInstBody = "";
            else {
              if (A(f, "Unencoded <"), f.startTagPosition + 1 < f.position) {
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
            f.doctype && f.doctype !== !0 && f.sgmlDecl ? (f.state = y.DOCTYPE_DTD, f.doctype += "<!" + f.sgmlDecl + v, f.sgmlDecl = "") : (f.sgmlDecl + v).toUpperCase() === u ? (U(f, "onopencdata"), f.state = y.CDATA, f.sgmlDecl = "", f.cdata = "") : (f.sgmlDecl + v).toUpperCase() === p ? (f.state = y.DOCTYPE, (f.doctype || f.sawRoot) && A(
              f,
              "Inappropriately located doctype declaration"
            ), f.doctype = "", f.sgmlDecl = "") : v === ">" ? (U(f, "onsgmldeclaration", f.sgmlDecl), f.sgmlDecl = "", f.state = y.TEXT) : (B(v) && (f.state = y.SGML_DECL_QUOTED), f.sgmlDecl += v);
            continue;
          case y.SGML_DECL_QUOTED:
            v === f.q && (f.state = y.SGML_DECL, f.q = ""), f.sgmlDecl += v;
            continue;
          case y.DOCTYPE:
            v === ">" ? (f.state = y.TEXT, U(f, "ondoctype", f.doctype), f.doctype = !0) : (f.doctype += v, v === "[" ? f.state = y.DOCTYPE_DTD : B(v) && (f.state = y.DOCTYPE_QUOTED, f.q = v));
            continue;
          case y.DOCTYPE_QUOTED:
            f.doctype += v, v === f.q && (f.q = "", f.state = y.DOCTYPE);
            continue;
          case y.DOCTYPE_DTD:
            v === "]" ? (f.doctype += v, f.state = y.DOCTYPE) : v === "<" ? (f.state = y.OPEN_WAKA, f.startTagPosition = f.position) : B(v) ? (f.doctype += v, f.state = y.DOCTYPE_DTD_QUOTED, f.q = v) : f.doctype += v;
            continue;
          case y.DOCTYPE_DTD_QUOTED:
            f.doctype += v, v === f.q && (f.state = y.DOCTYPE_DTD, f.q = "");
            continue;
          case y.COMMENT:
            v === "-" ? f.state = y.COMMENT_ENDING : f.comment += v;
            continue;
          case y.COMMENT_ENDING:
            v === "-" ? (f.state = y.COMMENT_ENDED, f.comment = R(f.opt, f.comment), f.comment && U(f, "oncomment", f.comment), f.comment = "") : (f.comment += "-" + v, f.state = y.COMMENT);
            continue;
          case y.COMMENT_ENDED:
            v !== ">" ? (A(f, "Malformed comment"), f.comment += "--" + v, f.state = y.COMMENT) : f.doctype && f.doctype !== !0 ? f.state = y.DOCTYPE_DTD : f.state = y.TEXT;
            continue;
          case y.CDATA:
            for (var se = I - 1; v && v !== "]"; )
              v = H(h, I++), v && f.trackPosition && (f.position++, v === `
` ? (f.line++, f.column = 0) : f.column++);
            f.cdata += h.substring(se, I - 1), v === "]" && (f.state = y.CDATA_ENDING);
            continue;
          case y.CDATA_ENDING:
            v === "]" ? f.state = y.CDATA_ENDING_2 : (f.cdata += "]" + v, f.state = y.CDATA);
            continue;
          case y.CDATA_ENDING_2:
            v === ">" ? (f.cdata && U(f, "oncdata", f.cdata), U(f, "onclosecdata"), f.cdata = "", f.state = y.TEXT) : v === "]" ? f.cdata += "]" : (f.cdata += "]]" + v, f.state = y.CDATA);
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
            v === ">" ? (U(f, "onprocessinginstruction", {
              name: f.procInstName,
              body: f.procInstBody
            }), f.procInstName = f.procInstBody = "", f.state = y.TEXT) : (f.procInstBody += "?" + v, f.state = y.PROC_INST_BODY);
            continue;
          case y.OPEN_TAG:
            G(b, v) ? f.tagName += v : (F(f), v === ">" ? K(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : ($(v) || A(f, "Invalid character in tag name"), f.state = y.ATTRIB));
            continue;
          case y.OPEN_TAG_SLASH:
            v === ">" ? (K(f, !0), X(f)) : (A(
              f,
              "Forward-slash in opening tag not followed by >"
            ), f.state = y.ATTRIB);
            continue;
          case y.ATTRIB:
            if ($(v))
              continue;
            v === ">" ? K(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : G(T, v) ? (f.attribName = v, f.attribValue = "", f.state = y.ATTRIB_NAME) : A(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME:
            v === "=" ? f.state = y.ATTRIB_VALUE : v === ">" ? (A(f, "Attribute without value"), f.attribValue = f.attribName, q(f), K(f)) : $(v) ? f.state = y.ATTRIB_NAME_SAW_WHITE : G(b, v) ? f.attribName += v : A(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME_SAW_WHITE:
            if (v === "=")
              f.state = y.ATTRIB_VALUE;
            else {
              if ($(v))
                continue;
              A(f, "Attribute without value"), f.tag.attributes[f.attribName] = "", f.attribValue = "", U(f, "onattribute", {
                name: f.attribName,
                value: ""
              }), f.attribName = "", v === ">" ? K(f) : G(T, v) ? (f.attribName = v, f.state = y.ATTRIB_NAME) : (A(f, "Invalid attribute name"), f.state = y.ATTRIB);
            }
            continue;
          case y.ATTRIB_VALUE:
            if ($(v))
              continue;
            B(v) ? (f.q = v, f.state = y.ATTRIB_VALUE_QUOTED) : (f.opt.unquotedAttributeValues || S(f, "Unquoted attribute value"), f.state = y.ATTRIB_VALUE_UNQUOTED, f.attribValue = v);
            continue;
          case y.ATTRIB_VALUE_QUOTED:
            if (v !== f.q) {
              v === "&" ? f.state = y.ATTRIB_VALUE_ENTITY_Q : f.attribValue += v;
              continue;
            }
            q(f), f.q = "", f.state = y.ATTRIB_VALUE_CLOSED;
            continue;
          case y.ATTRIB_VALUE_CLOSED:
            $(v) ? f.state = y.ATTRIB : v === ">" ? K(f) : v === "/" ? f.state = y.OPEN_TAG_SLASH : G(T, v) ? (A(f, "No whitespace between attributes"), f.attribName = v, f.attribValue = "", f.state = y.ATTRIB_NAME) : A(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_VALUE_UNQUOTED:
            if (!k(v)) {
              v === "&" ? f.state = y.ATTRIB_VALUE_ENTITY_U : f.attribValue += v;
              continue;
            }
            q(f), v === ">" ? K(f) : f.state = y.ATTRIB;
            continue;
          case y.CLOSE_TAG:
            if (f.tagName)
              v === ">" ? X(f) : G(b, v) ? f.tagName += v : f.script ? (f.script += "</" + f.tagName, f.tagName = "", f.state = y.SCRIPT) : ($(v) || A(f, "Invalid tagname in closing tag"), f.state = y.CLOSE_TAG_SAW_WHITE);
            else {
              if ($(v))
                continue;
              ae(T, v) ? f.script ? (f.script += "</" + v, f.state = y.SCRIPT) : A(f, "Invalid tagname in closing tag.") : f.tagName = v;
            }
            continue;
          case y.CLOSE_TAG_SAW_WHITE:
            if ($(v))
              continue;
            v === ">" ? X(f) : A(f, "Invalid characters in closing tag");
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
              var Se = te(f);
              f.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Se) ? (f.entity = "", f.state = fe, f.write(Se)) : (f[ve] += Se, f.entity = "", f.state = fe);
            } else G(f.entity.length ? N : _, v) ? f.entity += v : (A(f, "Invalid character in entity name"), f[ve] += "&" + f.entity + v, f.entity = "", f.state = fe);
            continue;
          default:
            throw new Error(f, "Unknown state: " + f.state);
        }
      return f.position >= f.bufferCheckPosition && i(f), f;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, f = Math.floor, I = function() {
        var v = 16384, Z = [], se, fe, ve = -1, Se = arguments.length;
        if (!Se)
          return "";
        for (var mt = ""; ++ve < Se; ) {
          var he = Number(arguments[ve]);
          if (!isFinite(he) || // `NaN`, `+Infinity`, or `-Infinity`
          he < 0 || // not a valid Unicode code point
          he > 1114111 || // not a valid Unicode code point
          f(he) !== he)
            throw RangeError("Invalid code point: " + he);
          he <= 65535 ? Z.push(he) : (he -= 65536, se = (he >> 10) + 55296, fe = he % 1024 + 56320, Z.push(se, fe)), (ve + 1 === Se || Z.length > v) && (mt += h.apply(null, Z), Z.length = 0);
        }
        return mt;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: I,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = I;
    }();
  })(e);
})(Ru);
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.XElement = void 0;
pn.parseXml = M0;
const $0 = Ru, Bn = Ar;
class Ou {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Bn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!U0(t))
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
      if (Yo(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Yo(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
pn.XElement = Ou;
const L0 = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function U0(e) {
  return L0.test(e);
}
function Yo(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function M0(e) {
  let t = null;
  const r = $0.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const a = new Ou(i.name);
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
  var n = Pe;
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
  var i = ki;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var a = dn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return a.ProgressCallbackTransform;
  } });
  var s = Pi;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } });
  var o = Ss;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return o.retry;
  } });
  var l = As;
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
var be = {}, Is = {}, Qe = {};
function Du(e) {
  return typeof e > "u" || e === null;
}
function B0(e) {
  return typeof e == "object" && e !== null;
}
function j0(e) {
  return Array.isArray(e) ? e : Du(e) ? [] : [e];
}
function z0(e, t) {
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
function H0(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Qe.isNothing = Du;
Qe.isObject = B0;
Qe.toArray = j0;
Qe.repeat = G0;
Qe.isNegativeZero = H0;
Qe.extend = z0;
function ku(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Qr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = ku(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Qr.prototype = Object.create(Error.prototype);
Qr.prototype.constructor = Qr;
Qr.prototype.toString = function(t) {
  return this.name + ": " + ku(this, t);
};
var hn = Qr, Br = Qe;
function ya(e, t, r, n, i) {
  var a = "", s = "", o = Math.floor(i / 2) - 1;
  return n - t > o && (a = " ... ", t = n - o + a.length), r - n > o && (s = " ...", r = n + o - s.length), {
    str: a + e.slice(t, r).replace(/\t/g, "→") + s,
    pos: n - t + a.length
    // relative position
  };
}
function wa(e, t) {
  return Br.repeat(" ", t - e.length) + e;
}
function q0(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], a, s = -1; a = r.exec(e.buffer); )
    i.push(a.index), n.push(a.index + a[0].length), e.position <= a.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var o = "", l, d, c = Math.min(e.line + t.linesAfter, i.length).toString().length, u = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(s - l < 0); l++)
    d = ya(
      e.buffer,
      n[s - l],
      i[s - l],
      e.position - (n[s] - n[s - l]),
      u
    ), o = Br.repeat(" ", t.indent) + wa((e.line - l + 1).toString(), c) + " | " + d.str + `
` + o;
  for (d = ya(e.buffer, n[s], i[s], e.position, u), o += Br.repeat(" ", t.indent) + wa((e.line + 1).toString(), c) + " | " + d.str + `
`, o += Br.repeat("-", t.indent + c + 3 + d.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++)
    d = ya(
      e.buffer,
      n[s + l],
      i[s + l],
      e.position - (n[s] - n[s + l]),
      u
    ), o += Br.repeat(" ", t.indent) + wa((e.line + l + 1).toString(), c) + " | " + d.str + `
`;
  return o.replace(/\n$/, "");
}
var X0 = q0, Ko = hn, W0 = [
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
], V0 = [
  "scalar",
  "sequence",
  "mapping"
];
function Y0(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function K0(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (W0.indexOf(r) === -1)
      throw new Ko('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Y0(t.styleAliases || null), V0.indexOf(this.kind) === -1)
    throw new Ko('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Le = K0, $r = hn, xa = Le;
function Jo(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(a, s) {
      a.tag === n.tag && a.kind === n.kind && a.multi === n.multi && (i = s);
    }), r[i] = n;
  }), r;
}
function J0() {
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
function Ka(e) {
  return this.extend(e);
}
Ka.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof xa)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new $r("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(a) {
    if (!(a instanceof xa))
      throw new $r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (a.loadKind && a.loadKind !== "scalar")
      throw new $r("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (a.multi)
      throw new $r("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(a) {
    if (!(a instanceof xa))
      throw new $r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Ka.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Jo(i, "implicit"), i.compiledExplicit = Jo(i, "explicit"), i.compiledTypeMap = J0(i.compiledImplicit, i.compiledExplicit), i;
};
var Pu = Ka, Q0 = Le, Nu = new Q0("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Z0 = Le, Fu = new Z0("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), eg = Le, $u = new eg("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), tg = Pu, Lu = new tg({
  explicit: [
    Nu,
    Fu,
    $u
  ]
}), rg = Le;
function ng(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function ig() {
  return null;
}
function ag(e) {
  return e === null;
}
var Uu = new rg("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: ng,
  construct: ig,
  predicate: ag,
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
}), sg = Le;
function og(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function lg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function cg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Mu = new sg("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: og,
  construct: lg,
  predicate: cg,
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
}), ug = Qe, fg = Le;
function dg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function pg(e) {
  return 48 <= e && e <= 55;
}
function hg(e) {
  return 48 <= e && e <= 57;
}
function mg(e) {
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
          if (!dg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!pg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!hg(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function gg(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function yg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !ug.isNegativeZero(e);
}
var Bu = new fg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: mg,
  construct: gg,
  predicate: yg,
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
}), ju = Qe, wg = Le, xg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Eg(e) {
  return !(e === null || !xg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function vg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var Tg = /^[-+]?[0-9]+e/;
function _g(e, t) {
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
  else if (ju.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), Tg.test(r) ? r.replace("e", ".e") : r;
}
function bg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || ju.isNegativeZero(e));
}
var zu = new wg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Eg,
  construct: vg,
  predicate: bg,
  represent: _g,
  defaultStyle: "lowercase"
}), Gu = Lu.extend({
  implicit: [
    Uu,
    Mu,
    Bu,
    zu
  ]
}), Hu = Gu, Sg = Le, qu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Xu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Ag(e) {
  return e === null ? !1 : qu.exec(e) !== null || Xu.exec(e) !== null;
}
function Ig(e) {
  var t, r, n, i, a, s, o, l = 0, d = null, c, u, p;
  if (t = qu.exec(e), t === null && (t = Xu.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (a = +t[4], s = +t[5], o = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], u = +(t[11] || 0), d = (c * 60 + u) * 6e4, t[9] === "-" && (d = -d)), p = new Date(Date.UTC(r, n, i, a, s, o, l)), d && p.setTime(p.getTime() - d), p;
}
function Cg(e) {
  return e.toISOString();
}
var Wu = new Sg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Ag,
  construct: Ig,
  instanceOf: Date,
  represent: Cg
}), Rg = Le;
function Og(e) {
  return e === "<<" || e === null;
}
var Vu = new Rg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Og
}), Dg = Le, Cs = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function kg(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, a = Cs;
  for (r = 0; r < i; r++)
    if (t = a.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Pg(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, a = Cs, s = 0, o = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (o.push(s >> 16 & 255), o.push(s >> 8 & 255), o.push(s & 255)), s = s << 6 | a.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (o.push(s >> 16 & 255), o.push(s >> 8 & 255), o.push(s & 255)) : r === 18 ? (o.push(s >> 10 & 255), o.push(s >> 2 & 255)) : r === 12 && o.push(s >> 4 & 255), new Uint8Array(o);
}
function Ng(e) {
  var t = "", r = 0, n, i, a = e.length, s = Cs;
  for (n = 0; n < a; n++)
    n % 3 === 0 && n && (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]), r = (r << 8) + e[n];
  return i = a % 3, i === 0 ? (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]) : i === 2 ? (t += s[r >> 10 & 63], t += s[r >> 4 & 63], t += s[r << 2 & 63], t += s[64]) : i === 1 && (t += s[r >> 2 & 63], t += s[r << 4 & 63], t += s[64], t += s[64]), t;
}
function Fg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Yu = new Dg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: kg,
  construct: Pg,
  predicate: Fg,
  represent: Ng
}), $g = Le, Lg = Object.prototype.hasOwnProperty, Ug = Object.prototype.toString;
function Mg(e) {
  if (e === null) return !0;
  var t = [], r, n, i, a, s, o = e;
  for (r = 0, n = o.length; r < n; r += 1) {
    if (i = o[r], s = !1, Ug.call(i) !== "[object Object]") return !1;
    for (a in i)
      if (Lg.call(i, a))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function Bg(e) {
  return e !== null ? e : [];
}
var Ku = new $g("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Mg,
  construct: Bg
}), jg = Le, zg = Object.prototype.toString;
function Gg(e) {
  if (e === null) return !0;
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1) {
    if (n = s[t], zg.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    a[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function Hg(e) {
  if (e === null) return [];
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1)
    n = s[t], i = Object.keys(n), a[t] = [i[0], n[i[0]]];
  return a;
}
var Ju = new jg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Gg,
  construct: Hg
}), qg = Le, Xg = Object.prototype.hasOwnProperty;
function Wg(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (Xg.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Vg(e) {
  return e !== null ? e : {};
}
var Qu = new qg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Wg,
  construct: Vg
}), Rs = Hu.extend({
  implicit: [
    Wu,
    Vu
  ],
  explicit: [
    Yu,
    Ku,
    Ju,
    Qu
  ]
}), qt = Qe, Zu = hn, Yg = X0, Kg = Rs, Rt = Object.prototype.hasOwnProperty, gi = 1, ef = 2, tf = 3, yi = 4, Ea = 1, Jg = 2, Qo = 3, Qg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Zg = /[\x85\u2028\u2029]/, ey = /[,\[\]\{\}]/, rf = /^(?:!|!!|![a-z\-]+!)$/i, nf = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Zo(e) {
  return Object.prototype.toString.call(e);
}
function st(e) {
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
function ty(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function ry(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function ny(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function el(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function iy(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function af(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var sf = new Array(256), of = new Array(256);
for (var ar = 0; ar < 256; ar++)
  sf[ar] = el(ar) ? 1 : 0, of[ar] = el(ar);
function ay(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Kg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function lf(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Yg(r), new Zu(t, r);
}
function z(e, t) {
  throw lf(e, t);
}
function wi(e, t) {
  e.onWarning && e.onWarning.call(null, lf(e, t));
}
var tl = {
  YAML: function(t, r, n) {
    var i, a, s;
    t.version !== null && z(t, "duplication of %YAML directive"), n.length !== 1 && z(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && z(t, "ill-formed argument of the YAML directive"), a = parseInt(i[1], 10), s = parseInt(i[2], 10), a !== 1 && z(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && wi(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, a;
    n.length !== 2 && z(t, "TAG directive accepts exactly two arguments"), i = n[0], a = n[1], rf.test(i) || z(t, "ill-formed tag handle (first argument) of the TAG directive"), Rt.call(t.tagMap, i) && z(t, 'there is a previously declared suffix for "' + i + '" tag handle'), nf.test(a) || z(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      a = decodeURIComponent(a);
    } catch {
      z(t, "tag prefix is malformed: " + a);
    }
    t.tagMap[i] = a;
  }
};
function St(e, t, r, n) {
  var i, a, s, o;
  if (t < r) {
    if (o = e.input.slice(t, r), n)
      for (i = 0, a = o.length; i < a; i += 1)
        s = o.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || z(e, "expected valid JSON character");
    else Qg.test(o) && z(e, "the stream contains non-printable characters");
    e.result += o;
  }
}
function rl(e, t, r, n) {
  var i, a, s, o;
  for (qt.isObject(r) || z(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), s = 0, o = i.length; s < o; s += 1)
    a = i[s], Rt.call(t, a) || (af(t, a, r[a]), n[a] = !0);
}
function pr(e, t, r, n, i, a, s, o, l) {
  var d, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), d = 0, c = i.length; d < c; d += 1)
      Array.isArray(i[d]) && z(e, "nested arrays are not supported inside keys"), typeof i == "object" && Zo(i[d]) === "[object Object]" && (i[d] = "[object Object]");
  if (typeof i == "object" && Zo(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(a))
      for (d = 0, c = a.length; d < c; d += 1)
        rl(e, t, a[d], r);
    else
      rl(e, t, a, r);
  else
    !e.json && !Rt.call(r, i) && Rt.call(t, i) && (e.line = s || e.line, e.lineStart = o || e.lineStart, e.position = l || e.position, z(e, "duplicated mapping key")), af(t, i, a), delete r[i];
  return t;
}
function Os(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : z(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function pe(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Yt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (st(i))
      for (Os(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && wi(e, "deficient indentation"), n;
}
function Ni(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Be(r)));
}
function Ds(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += qt.repeat(`
`, t - 1));
}
function sy(e, t, r) {
  var n, i, a, s, o, l, d, c, u = e.kind, p = e.result, m;
  if (m = e.input.charCodeAt(e.position), Be(m) || dr(m) || m === 35 || m === 38 || m === 42 || m === 33 || m === 124 || m === 62 || m === 39 || m === 34 || m === 37 || m === 64 || m === 96 || (m === 63 || m === 45) && (i = e.input.charCodeAt(e.position + 1), Be(i) || r && dr(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", a = s = e.position, o = !1; m !== 0; ) {
    if (m === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Be(i) || r && dr(i))
        break;
    } else if (m === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Be(n))
        break;
    } else {
      if (e.position === e.lineStart && Ni(e) || r && dr(m))
        break;
      if (st(m))
        if (l = e.line, d = e.lineStart, c = e.lineIndent, pe(e, !1, -1), e.lineIndent >= t) {
          o = !0, m = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = d, e.lineIndent = c;
          break;
        }
    }
    o && (St(e, a, s, !1), Ds(e, e.line - l), a = s = e.position, o = !1), Yt(m) || (s = e.position + 1), m = e.input.charCodeAt(++e.position);
  }
  return St(e, a, s, !1), e.result ? !0 : (e.kind = u, e.result = p, !1);
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
    else st(r) ? (St(e, n, i, !0), Ds(e, pe(e, !1, t)), n = i = e.position) : e.position === e.lineStart && Ni(e) ? z(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  z(e, "unexpected end of the stream within a single quoted scalar");
}
function ly(e, t) {
  var r, n, i, a, s, o;
  if (o = e.input.charCodeAt(e.position), o !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (o = e.input.charCodeAt(e.position)) !== 0; ) {
    if (o === 34)
      return St(e, r, e.position, !0), e.position++, !0;
    if (o === 92) {
      if (St(e, r, e.position, !0), o = e.input.charCodeAt(++e.position), st(o))
        pe(e, !1, t);
      else if (o < 256 && sf[o])
        e.result += of[o], e.position++;
      else if ((s = ry(o)) > 0) {
        for (i = s, a = 0; i > 0; i--)
          o = e.input.charCodeAt(++e.position), (s = ty(o)) >= 0 ? a = (a << 4) + s : z(e, "expected hexadecimal character");
        e.result += iy(a), e.position++;
      } else
        z(e, "unknown escape sequence");
      r = n = e.position;
    } else st(o) ? (St(e, r, n, !0), Ds(e, pe(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Ni(e) ? z(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  z(e, "unexpected end of the stream within a double quoted scalar");
}
function cy(e, t) {
  var r = !0, n, i, a, s = e.tag, o, l = e.anchor, d, c, u, p, m, E = /* @__PURE__ */ Object.create(null), w, T, b, _;
  if (_ = e.input.charCodeAt(e.position), _ === 91)
    c = 93, m = !1, o = [];
  else if (_ === 123)
    c = 125, m = !0, o = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), _ = e.input.charCodeAt(++e.position); _ !== 0; ) {
    if (pe(e, !0, t), _ = e.input.charCodeAt(e.position), _ === c)
      return e.position++, e.tag = s, e.anchor = l, e.kind = m ? "mapping" : "sequence", e.result = o, !0;
    r ? _ === 44 && z(e, "expected the node content, but found ','") : z(e, "missed comma between flow collection entries"), T = w = b = null, u = p = !1, _ === 63 && (d = e.input.charCodeAt(e.position + 1), Be(d) && (u = p = !0, e.position++, pe(e, !0, t))), n = e.line, i = e.lineStart, a = e.position, _r(e, t, gi, !1, !0), T = e.tag, w = e.result, pe(e, !0, t), _ = e.input.charCodeAt(e.position), (p || e.line === n) && _ === 58 && (u = !0, _ = e.input.charCodeAt(++e.position), pe(e, !0, t), _r(e, t, gi, !1, !0), b = e.result), m ? pr(e, o, E, T, w, b, n, i, a) : u ? o.push(pr(e, null, E, T, w, b, n, i, a)) : o.push(w), pe(e, !0, t), _ = e.input.charCodeAt(e.position), _ === 44 ? (r = !0, _ = e.input.charCodeAt(++e.position)) : r = !1;
  }
  z(e, "unexpected end of the stream within a flow collection");
}
function uy(e, t) {
  var r, n, i = Ea, a = !1, s = !1, o = t, l = 0, d = !1, c, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    n = !1;
  else if (u === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      Ea === i ? i = u === 43 ? Qo : Jg : z(e, "repeat of a chomping mode identifier");
    else if ((c = ny(u)) >= 0)
      c === 0 ? z(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? z(e, "repeat of an indentation width identifier") : (o = t + c - 1, s = !0);
    else
      break;
  if (Yt(u)) {
    do
      u = e.input.charCodeAt(++e.position);
    while (Yt(u));
    if (u === 35)
      do
        u = e.input.charCodeAt(++e.position);
      while (!st(u) && u !== 0);
  }
  for (; u !== 0; ) {
    for (Os(e), e.lineIndent = 0, u = e.input.charCodeAt(e.position); (!s || e.lineIndent < o) && u === 32; )
      e.lineIndent++, u = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > o && (o = e.lineIndent), st(u)) {
      l++;
      continue;
    }
    if (e.lineIndent < o) {
      i === Qo ? e.result += qt.repeat(`
`, a ? 1 + l : l) : i === Ea && a && (e.result += `
`);
      break;
    }
    for (n ? Yt(u) ? (d = !0, e.result += qt.repeat(`
`, a ? 1 + l : l)) : d ? (d = !1, e.result += qt.repeat(`
`, l + 1)) : l === 0 ? a && (e.result += " ") : e.result += qt.repeat(`
`, l) : e.result += qt.repeat(`
`, a ? 1 + l : l), a = !0, s = !0, l = 0, r = e.position; !st(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    St(e, r, e.position, !1);
  }
  return !0;
}
function nl(e, t) {
  var r, n = e.tag, i = e.anchor, a = [], s, o = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, z(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !Be(s)))); ) {
    if (o = !0, e.position++, pe(e, !0, -1) && e.lineIndent <= t) {
      a.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, _r(e, t, tf, !1, !0), a.push(e.result), pe(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      z(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return o ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function fy(e, t, r) {
  var n, i, a, s, o, l, d = e.tag, c = e.anchor, u = {}, p = /* @__PURE__ */ Object.create(null), m = null, E = null, w = null, T = !1, b = !1, _;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), _ = e.input.charCodeAt(e.position); _ !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, z(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), a = e.line, (_ === 63 || _ === 58) && Be(n))
      _ === 63 ? (T && (pr(e, u, p, m, E, null, s, o, l), m = E = w = null), b = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : z(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, _ = n;
    else {
      if (s = e.line, o = e.lineStart, l = e.position, !_r(e, r, ef, !1, !0))
        break;
      if (e.line === a) {
        for (_ = e.input.charCodeAt(e.position); Yt(_); )
          _ = e.input.charCodeAt(++e.position);
        if (_ === 58)
          _ = e.input.charCodeAt(++e.position), Be(_) || z(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (pr(e, u, p, m, E, null, s, o, l), m = E = w = null), b = !0, T = !1, i = !1, m = e.tag, E = e.result;
        else if (b)
          z(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = d, e.anchor = c, !0;
      } else if (b)
        z(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = d, e.anchor = c, !0;
    }
    if ((e.line === a || e.lineIndent > t) && (T && (s = e.line, o = e.lineStart, l = e.position), _r(e, t, yi, !0, i) && (T ? E = e.result : w = e.result), T || (pr(e, u, p, m, E, w, s, o, l), m = E = w = null), pe(e, !0, -1), _ = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && _ !== 0)
      z(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && pr(e, u, p, m, E, null, s, o, l), b && (e.tag = d, e.anchor = c, e.kind = "mapping", e.result = u), b;
}
function dy(e) {
  var t, r = !1, n = !1, i, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && z(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (r = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (n = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (a = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : z(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !Be(s); )
      s === 33 && (n ? z(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), rf.test(i) || z(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    a = e.input.slice(t, e.position), ey.test(a) && z(e, "tag suffix cannot contain flow indicator characters");
  }
  a && !nf.test(a) && z(e, "tag name cannot contain such characters: " + a);
  try {
    a = decodeURIComponent(a);
  } catch {
    z(e, "tag name is malformed: " + a);
  }
  return r ? e.tag = a : Rt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : z(e, 'undeclared tag handle "' + i + '"'), !0;
}
function py(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && z(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Be(r) && !dr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && z(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function hy(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Be(n) && !dr(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && z(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), Rt.call(e.anchorMap, r) || z(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], pe(e, !0, -1), !0;
}
function _r(e, t, r, n, i) {
  var a, s, o, l = 1, d = !1, c = !1, u, p, m, E, w, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = s = o = yi === r || tf === r, n && pe(e, !0, -1) && (d = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; dy(e) || py(e); )
      pe(e, !0, -1) ? (d = !0, o = a, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : o = !1;
  if (o && (o = d || i), (l === 1 || yi === r) && (gi === r || ef === r ? w = t : w = t + 1, T = e.position - e.lineStart, l === 1 ? o && (nl(e, T) || fy(e, T, w)) || cy(e, w) ? c = !0 : (s && uy(e, w) || oy(e, w) || ly(e, w) ? c = !0 : hy(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && z(e, "alias node should not have any properties")) : sy(e, w, gi === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = o && nl(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && z(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, p = e.implicitTypes.length; u < p; u += 1)
      if (E = e.implicitTypes[u], E.resolve(e.result)) {
        e.result = E.construct(e.result), e.tag = E.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Rt.call(e.typeMap[e.kind || "fallback"], e.tag))
      E = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (E = null, m = e.typeMap.multi[e.kind || "fallback"], u = 0, p = m.length; u < p; u += 1)
        if (e.tag.slice(0, m[u].tag.length) === m[u].tag) {
          E = m[u];
          break;
        }
    E || z(e, "unknown tag !<" + e.tag + ">"), e.result !== null && E.kind !== e.kind && z(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + E.kind + '", not "' + e.kind + '"'), E.resolve(e.result, e.tag) ? (e.result = E.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : z(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function my(e) {
  var t = e.position, r, n, i, a = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (pe(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (a = !0, s = e.input.charCodeAt(++e.position), r = e.position; s !== 0 && !Be(s); )
      s = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && z(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; Yt(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !st(s));
        break;
      }
      if (st(s)) break;
      for (r = e.position; s !== 0 && !Be(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    s !== 0 && Os(e), Rt.call(tl, n) ? tl[n](e, n, i) : wi(e, 'unknown document directive "' + n + '"');
  }
  if (pe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, pe(e, !0, -1)) : a && z(e, "directives end mark is expected"), _r(e, e.lineIndent - 1, yi, !1, !0), pe(e, !0, -1), e.checkLineBreaks && Zg.test(e.input.slice(t, e.position)) && wi(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Ni(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, pe(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    z(e, "end of the stream or a document separator is expected");
  else
    return;
}
function cf(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new ay(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, z(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    my(r);
  return r.documents;
}
function gy(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = cf(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, a = n.length; i < a; i += 1)
    t(n[i]);
}
function yy(e, t) {
  var r = cf(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new Zu("expected a single document in the stream, but found more");
  }
}
Is.loadAll = gy;
Is.load = yy;
var uf = {}, Fi = Qe, mn = hn, wy = Rs, ff = Object.prototype.toString, df = Object.prototype.hasOwnProperty, ks = 65279, xy = 9, Zr = 10, Ey = 13, vy = 32, Ty = 33, _y = 34, Ja = 35, by = 37, Sy = 38, Ay = 39, Iy = 42, pf = 44, Cy = 45, xi = 58, Ry = 61, Oy = 62, Dy = 63, ky = 64, hf = 91, mf = 93, Py = 96, gf = 123, Ny = 124, yf = 125, Oe = {};
Oe[0] = "\\0";
Oe[7] = "\\a";
Oe[8] = "\\b";
Oe[9] = "\\t";
Oe[10] = "\\n";
Oe[11] = "\\v";
Oe[12] = "\\f";
Oe[13] = "\\r";
Oe[27] = "\\e";
Oe[34] = '\\"';
Oe[92] = "\\\\";
Oe[133] = "\\N";
Oe[160] = "\\_";
Oe[8232] = "\\L";
Oe[8233] = "\\P";
var Fy = [
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
], $y = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Ly(e, t) {
  var r, n, i, a, s, o, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, a = n.length; i < a; i += 1)
    s = n[i], o = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && df.call(l.styleAliases, o) && (o = l.styleAliases[o]), r[s] = o;
  return r;
}
function Uy(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new mn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + Fi.repeat("0", n - t.length) + t;
}
var My = 1, en = 2;
function By(e) {
  this.schema = e.schema || wy, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Fi.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Ly(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? en : My, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function il(e, t) {
  for (var r = Fi.repeat(" ", t), n = 0, i = -1, a = "", s, o = e.length; n < o; )
    i = e.indexOf(`
`, n), i === -1 ? (s = e.slice(n), n = o) : (s = e.slice(n, i + 1), n = i + 1), s.length && s !== `
` && (a += r), a += s;
  return a;
}
function Qa(e, t) {
  return `
` + Fi.repeat(" ", e.indent * t);
}
function jy(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Ei(e) {
  return e === vy || e === xy;
}
function tn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== ks || 65536 <= e && e <= 1114111;
}
function al(e) {
  return tn(e) && e !== ks && e !== Ey && e !== Zr;
}
function sl(e, t, r) {
  var n = al(e), i = n && !Ei(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== pf && e !== hf && e !== mf && e !== gf && e !== yf) && e !== Ja && !(t === xi && !i) || al(t) && !Ei(t) && e === Ja || t === xi && i
  );
}
function zy(e) {
  return tn(e) && e !== ks && !Ei(e) && e !== Cy && e !== Dy && e !== xi && e !== pf && e !== hf && e !== mf && e !== gf && e !== yf && e !== Ja && e !== Sy && e !== Iy && e !== Ty && e !== Ny && e !== Ry && e !== Oy && e !== Ay && e !== _y && e !== by && e !== ky && e !== Py;
}
function Gy(e) {
  return !Ei(e) && e !== xi;
}
function jr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function wf(e) {
  var t = /^\n* /;
  return t.test(e);
}
var xf = 1, Za = 2, Ef = 3, vf = 4, fr = 5;
function Hy(e, t, r, n, i, a, s, o) {
  var l, d = 0, c = null, u = !1, p = !1, m = n !== -1, E = -1, w = zy(jr(e, 0)) && Gy(jr(e, e.length - 1));
  if (t || s)
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = jr(e, l), !tn(d))
        return fr;
      w = w && sl(d, c, o), c = d;
    }
  else {
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = jr(e, l), d === Zr)
        u = !0, m && (p = p || // Foldable line = too long, and not more-indented.
        l - E - 1 > n && e[E + 1] !== " ", E = l);
      else if (!tn(d))
        return fr;
      w = w && sl(d, c, o), c = d;
    }
    p = p || m && l - E - 1 > n && e[E + 1] !== " ";
  }
  return !u && !p ? w && !s && !i(e) ? xf : a === en ? fr : Za : r > 9 && wf(e) ? fr : s ? a === en ? fr : Za : p ? vf : Ef;
}
function qy(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === en ? '""' : "''";
    if (!e.noCompatMode && (Fy.indexOf(t) !== -1 || $y.test(t)))
      return e.quotingType === en ? '"' + t + '"' : "'" + t + "'";
    var a = e.indent * Math.max(1, r), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), o = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(d) {
      return jy(e, d);
    }
    switch (Hy(
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
      case Za:
        return "'" + t.replace(/'/g, "''") + "'";
      case Ef:
        return "|" + ol(t, e.indent) + ll(il(t, a));
      case vf:
        return ">" + ol(t, e.indent) + ll(il(Xy(t, s), a));
      case fr:
        return '"' + Wy(t) + '"';
      default:
        throw new mn("impossible error: invalid scalar style");
    }
  }();
}
function ol(e, t) {
  var r = wf(e) ? String(t) : "", n = e[e.length - 1] === `
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
function Xy(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var d = e.indexOf(`
`);
    return d = d !== -1 ? d : e.length, r.lastIndex = d, cl(e.slice(0, d), t);
  }(), i = e[0] === `
` || e[0] === " ", a, s; s = r.exec(e); ) {
    var o = s[1], l = s[2];
    a = l[0] === " ", n += o + (!i && !a && l !== "" ? `
` : "") + cl(l, t), i = a;
  }
  return n;
}
function cl(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, a, s = 0, o = 0, l = ""; n = r.exec(e); )
    o = n.index, o - i > t && (a = s > i ? s : o, l += `
` + e.slice(i, a), i = a + 1), s = o;
  return l += `
`, e.length - i > t && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function Wy(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = jr(e, i), n = Oe[r], !n && tn(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || Uy(r);
  return t;
}
function Vy(e, t, r) {
  var n = "", i = e.tag, a, s, o;
  for (a = 0, s = r.length; a < s; a += 1)
    o = r[a], e.replacer && (o = e.replacer.call(r, String(a), o)), (pt(e, t, o, !1, !1) || typeof o > "u" && pt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function ul(e, t, r, n) {
  var i = "", a = e.tag, s, o, l;
  for (s = 0, o = r.length; s < o; s += 1)
    l = r[s], e.replacer && (l = e.replacer.call(r, String(s), l)), (pt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && pt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Qa(e, t)), e.dump && Zr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = a, e.dump = i || "[]";
}
function Yy(e, t, r) {
  var n = "", i = e.tag, a = Object.keys(r), s, o, l, d, c;
  for (s = 0, o = a.length; s < o; s += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = a[s], d = r[l], e.replacer && (d = e.replacer.call(r, l, d)), pt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), pt(e, t, d, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function Ky(e, t, r, n) {
  var i = "", a = e.tag, s = Object.keys(r), o, l, d, c, u, p;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new mn("sortKeys must be a boolean or a function");
  for (o = 0, l = s.length; o < l; o += 1)
    p = "", (!n || i !== "") && (p += Qa(e, t)), d = s[o], c = r[d], e.replacer && (c = e.replacer.call(r, d, c)), pt(e, t + 1, d, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && Zr === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, u && (p += Qa(e, t)), pt(e, t + 1, c, !0, u) && (e.dump && Zr === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p));
  e.tag = a, e.dump = i || "{}";
}
function fl(e, t, r) {
  var n, i, a, s, o, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, a = 0, s = i.length; a < s; a += 1)
    if (o = i[a], (o.instanceOf || o.predicate) && (!o.instanceOf || typeof t == "object" && t instanceof o.instanceOf) && (!o.predicate || o.predicate(t))) {
      if (r ? o.multi && o.representName ? e.tag = o.representName(t) : e.tag = o.tag : e.tag = "?", o.represent) {
        if (l = e.styleMap[o.tag] || o.defaultStyle, ff.call(o.represent) === "[object Function]")
          n = o.represent(t, l);
        else if (df.call(o.represent, l))
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
  e.tag = null, e.dump = r, fl(e, r, !1) || fl(e, r, !0);
  var o = ff.call(e.dump), l = n, d;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = o === "[object Object]" || o === "[object Array]", u, p;
  if (c && (u = e.duplicates.indexOf(r), p = u !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (i = !1), p && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (c && p && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), o === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (Ky(e, t, e.dump, i), p && (e.dump = "&ref_" + u + e.dump)) : (Yy(e, t, e.dump), p && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? ul(e, t - 1, e.dump, i) : ul(e, t, e.dump, i), p && (e.dump = "&ref_" + u + e.dump)) : (Vy(e, t, e.dump), p && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object String]")
      e.tag !== "?" && qy(e, e.dump, t, a, l);
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
function Jy(e, t) {
  var r = [], n = [], i, a;
  for (es(e, r, n), i = 0, a = n.length; i < a; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(a);
}
function es(e, t, r) {
  var n, i, a;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, a = e.length; i < a; i += 1)
        es(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, a = n.length; i < a; i += 1)
        es(e[n[i]], t, r);
}
function Qy(e, t) {
  t = t || {};
  var r = new By(t);
  r.noRefs || Jy(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), pt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
uf.dump = Qy;
var Tf = Is, Zy = uf;
function Ps(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
be.Type = Le;
be.Schema = Pu;
be.FAILSAFE_SCHEMA = Lu;
be.JSON_SCHEMA = Gu;
be.CORE_SCHEMA = Hu;
be.DEFAULT_SCHEMA = Rs;
be.load = Tf.load;
be.loadAll = Tf.loadAll;
be.dump = Zy.dump;
be.YAMLException = hn;
be.types = {
  binary: Yu,
  float: zu,
  map: $u,
  null: Uu,
  pairs: Ju,
  set: Qu,
  timestamp: Wu,
  bool: Mu,
  int: Bu,
  merge: Vu,
  omap: Ku,
  seq: Fu,
  str: Nu
};
be.safeLoad = Ps("safeLoad", "load");
be.safeLoadAll = Ps("safeLoadAll", "loadAll");
be.safeDump = Ps("safeDump", "dump");
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.Lazy = void 0;
class ew {
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
$i.Lazy = ew;
var ts = { exports: {} };
const tw = "2.0.0", _f = 256, rw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, nw = 16, iw = _f - 6, aw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Li = {
  MAX_LENGTH: _f,
  MAX_SAFE_COMPONENT_LENGTH: nw,
  MAX_SAFE_BUILD_LENGTH: iw,
  MAX_SAFE_INTEGER: rw,
  RELEASE_TYPES: aw,
  SEMVER_SPEC_VERSION: tw,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const sw = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ui = sw;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = Li, a = Ui;
  t = e.exports = {};
  const s = t.re = [], o = t.safeRe = [], l = t.src = [], d = t.safeSrc = [], c = t.t = {};
  let u = 0;
  const p = "[a-zA-Z0-9-]", m = [
    ["\\s", 1],
    ["\\d", i],
    [p, n]
  ], E = (T) => {
    for (const [b, _] of m)
      T = T.split(`${b}*`).join(`${b}{0,${_}}`).split(`${b}+`).join(`${b}{1,${_}}`);
    return T;
  }, w = (T, b, _) => {
    const N = E(b), $ = u++;
    a(T, $, b), c[T] = $, l[$] = b, d[$] = N, s[$] = new RegExp(b, _ ? "g" : void 0), o[$] = new RegExp(N, _ ? "g" : void 0);
  };
  w("NUMERICIDENTIFIER", "0|[1-9]\\d*"), w("NUMERICIDENTIFIERLOOSE", "\\d+"), w("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${p}*`), w("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), w("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), w("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), w("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), w("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), w("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), w("BUILDIDENTIFIER", `${p}+`), w("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), w("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), w("FULL", `^${l[c.FULLPLAIN]}$`), w("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), w("LOOSE", `^${l[c.LOOSEPLAIN]}$`), w("GTLT", "((?:<|>)?=?)"), w("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), w("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), w("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), w("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), w("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), w("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), w("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), w("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), w("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), w("COERCERTL", l[c.COERCE], !0), w("COERCERTLFULL", l[c.COERCEFULL], !0), w("LONETILDE", "(?:~>?)"), w("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", w("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), w("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), w("LONECARET", "(?:\\^)"), w("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", w("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), w("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), w("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), w("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), w("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", w("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), w("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), w("STAR", "(<|>)?=?\\s*\\*"), w("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), w("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(ts, ts.exports);
var gn = ts.exports;
const ow = Object.freeze({ loose: !0 }), lw = Object.freeze({}), cw = (e) => e ? typeof e != "object" ? ow : e : lw;
var Ns = cw;
const dl = /^[0-9]+$/, bf = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = dl.test(e), n = dl.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, uw = (e, t) => bf(t, e);
var Sf = {
  compareIdentifiers: bf,
  rcompareIdentifiers: uw
};
const jn = Ui, { MAX_LENGTH: pl, MAX_SAFE_INTEGER: zn } = Li, { safeRe: Gn, t: Hn } = gn, fw = Ns, { compareIdentifiers: va } = Sf;
let dw = class at {
  constructor(t, r) {
    if (r = fw(r), t instanceof at) {
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
    const n = t.trim().match(r.loose ? Gn[Hn.LOOSE] : Gn[Hn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > zn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > zn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > zn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const a = +i;
        if (a >= 0 && a < zn)
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
      return va(n, i);
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
      return va(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Gn[Hn.PRERELEASELOOSE] : Gn[Hn.PRERELEASE]);
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
          n === !1 && (a = [r]), va(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ue = dw;
const hl = Ue, pw = (e, t, r = !1) => {
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
var Cr = pw;
const hw = Cr, mw = (e, t) => {
  const r = hw(e, t);
  return r ? r.version : null;
};
var gw = mw;
const yw = Cr, ww = (e, t) => {
  const r = yw(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var xw = ww;
const ml = Ue, Ew = (e, t, r, n, i) => {
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
var vw = Ew;
const gl = Cr, Tw = (e, t) => {
  const r = gl(e, null, !0), n = gl(t, null, !0), i = r.compare(n);
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
var _w = Tw;
const bw = Ue, Sw = (e, t) => new bw(e, t).major;
var Aw = Sw;
const Iw = Ue, Cw = (e, t) => new Iw(e, t).minor;
var Rw = Cw;
const Ow = Ue, Dw = (e, t) => new Ow(e, t).patch;
var kw = Dw;
const Pw = Cr, Nw = (e, t) => {
  const r = Pw(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Fw = Nw;
const yl = Ue, $w = (e, t, r) => new yl(e, r).compare(new yl(t, r));
var Ze = $w;
const Lw = Ze, Uw = (e, t, r) => Lw(t, e, r);
var Mw = Uw;
const Bw = Ze, jw = (e, t) => Bw(e, t, !0);
var zw = jw;
const wl = Ue, Gw = (e, t, r) => {
  const n = new wl(e, r), i = new wl(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Fs = Gw;
const Hw = Fs, qw = (e, t) => e.sort((r, n) => Hw(r, n, t));
var Xw = qw;
const Ww = Fs, Vw = (e, t) => e.sort((r, n) => Ww(n, r, t));
var Yw = Vw;
const Kw = Ze, Jw = (e, t, r) => Kw(e, t, r) > 0;
var Mi = Jw;
const Qw = Ze, Zw = (e, t, r) => Qw(e, t, r) < 0;
var $s = Zw;
const ex = Ze, tx = (e, t, r) => ex(e, t, r) === 0;
var Af = tx;
const rx = Ze, nx = (e, t, r) => rx(e, t, r) !== 0;
var If = nx;
const ix = Ze, ax = (e, t, r) => ix(e, t, r) >= 0;
var Ls = ax;
const sx = Ze, ox = (e, t, r) => sx(e, t, r) <= 0;
var Us = ox;
const lx = Af, cx = If, ux = Mi, fx = Ls, dx = $s, px = Us, hx = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return lx(e, r, n);
    case "!=":
      return cx(e, r, n);
    case ">":
      return ux(e, r, n);
    case ">=":
      return fx(e, r, n);
    case "<":
      return dx(e, r, n);
    case "<=":
      return px(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Cf = hx;
const mx = Ue, gx = Cr, { safeRe: qn, t: Xn } = gn, yx = (e, t) => {
  if (e instanceof mx)
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
  const n = r[2], i = r[3] || "0", a = r[4] || "0", s = t.includePrerelease && r[5] ? `-${r[5]}` : "", o = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return gx(`${n}.${i}.${a}${s}${o}`, t);
};
var wx = yx;
class xx {
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
var Ex = xx, Ta, xl;
function et() {
  if (xl) return Ta;
  xl = 1;
  const e = /\s+/g;
  class t {
    constructor(S, D) {
      if (D = i(D), S instanceof t)
        return S.loose === !!D.loose && S.includePrerelease === !!D.includePrerelease ? S : new t(S.raw, D);
      if (S instanceof a)
        return this.raw = S.value, this.set = [[S]], this.formatted = void 0, this;
      if (this.options = D, this.loose = !!D.loose, this.includePrerelease = !!D.includePrerelease, this.raw = S.trim().replace(e, " "), this.set = this.raw.split("||").map((A) => this.parseRange(A.trim())).filter((A) => A.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const A = this.set[0];
        if (this.set = this.set.filter((F) => !w(F[0])), this.set.length === 0)
          this.set = [A];
        else if (this.set.length > 1) {
          for (const F of this.set)
            if (F.length === 1 && T(F[0])) {
              this.set = [F];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let S = 0; S < this.set.length; S++) {
          S > 0 && (this.formatted += "||");
          const D = this.set[S];
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
    parseRange(S) {
      const A = ((this.options.includePrerelease && m) | (this.options.loose && E)) + ":" + S, F = n.get(A);
      if (F)
        return F;
      const O = this.options.loose, q = O ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      S = S.replace(q, U(this.options.includePrerelease)), s("hyphen replace", S), S = S.replace(l[d.COMPARATORTRIM], c), s("comparator trim", S), S = S.replace(l[d.TILDETRIM], u), s("tilde trim", S), S = S.replace(l[d.CARETTRIM], p), s("caret trim", S);
      let K = S.split(" ").map((H) => _(H, this.options)).join(" ").split(/\s+/).map((H) => j(H, this.options));
      O && (K = K.filter((H) => (s("loose invalid filter", H, this.options), !!H.match(l[d.COMPARATORLOOSE])))), s("range list", K);
      const X = /* @__PURE__ */ new Map(), te = K.map((H) => new a(H, this.options));
      for (const H of te) {
        if (w(H))
          return [H];
        X.set(H.value, H);
      }
      X.size > 1 && X.has("") && X.delete("");
      const ge = [...X.values()];
      return n.set(A, ge), ge;
    }
    intersects(S, D) {
      if (!(S instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((A) => b(A, D) && S.set.some((F) => b(F, D) && A.every((O) => F.every((q) => O.intersects(q, D)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(S) {
      if (!S)
        return !1;
      if (typeof S == "string")
        try {
          S = new o(S, this.options);
        } catch {
          return !1;
        }
      for (let D = 0; D < this.set.length; D++)
        if (Y(this.set[D], S, this.options))
          return !0;
      return !1;
    }
  }
  Ta = t;
  const r = Ex, n = new r(), i = Ns, a = Bi(), s = Ui, o = Ue, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: c,
    tildeTrimReplace: u,
    caretTrimReplace: p
  } = gn, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: E } = Li, w = (R) => R.value === "<0.0.0-0", T = (R) => R.value === "", b = (R, S) => {
    let D = !0;
    const A = R.slice();
    let F = A.pop();
    for (; D && A.length; )
      D = A.every((O) => F.intersects(O, S)), F = A.pop();
    return D;
  }, _ = (R, S) => (R = R.replace(l[d.BUILD], ""), s("comp", R, S), R = k(R, S), s("caret", R), R = $(R, S), s("tildes", R), R = ae(R, S), s("xrange", R), R = M(R, S), s("stars", R), R), N = (R) => !R || R.toLowerCase() === "x" || R === "*", $ = (R, S) => R.trim().split(/\s+/).map((D) => B(D, S)).join(" "), B = (R, S) => {
    const D = S.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return R.replace(D, (A, F, O, q, K) => {
      s("tilde", R, A, F, O, q, K);
      let X;
      return N(F) ? X = "" : N(O) ? X = `>=${F}.0.0 <${+F + 1}.0.0-0` : N(q) ? X = `>=${F}.${O}.0 <${F}.${+O + 1}.0-0` : K ? (s("replaceTilde pr", K), X = `>=${F}.${O}.${q}-${K} <${F}.${+O + 1}.0-0`) : X = `>=${F}.${O}.${q} <${F}.${+O + 1}.0-0`, s("tilde return", X), X;
    });
  }, k = (R, S) => R.trim().split(/\s+/).map((D) => G(D, S)).join(" "), G = (R, S) => {
    s("caret", R, S);
    const D = S.loose ? l[d.CARETLOOSE] : l[d.CARET], A = S.includePrerelease ? "-0" : "";
    return R.replace(D, (F, O, q, K, X) => {
      s("caret", R, F, O, q, K, X);
      let te;
      return N(O) ? te = "" : N(q) ? te = `>=${O}.0.0${A} <${+O + 1}.0.0-0` : N(K) ? O === "0" ? te = `>=${O}.${q}.0${A} <${O}.${+q + 1}.0-0` : te = `>=${O}.${q}.0${A} <${+O + 1}.0.0-0` : X ? (s("replaceCaret pr", X), O === "0" ? q === "0" ? te = `>=${O}.${q}.${K}-${X} <${O}.${q}.${+K + 1}-0` : te = `>=${O}.${q}.${K}-${X} <${O}.${+q + 1}.0-0` : te = `>=${O}.${q}.${K}-${X} <${+O + 1}.0.0-0`) : (s("no pr"), O === "0" ? q === "0" ? te = `>=${O}.${q}.${K}${A} <${O}.${q}.${+K + 1}-0` : te = `>=${O}.${q}.${K}${A} <${O}.${+q + 1}.0-0` : te = `>=${O}.${q}.${K} <${+O + 1}.0.0-0`), s("caret return", te), te;
    });
  }, ae = (R, S) => (s("replaceXRanges", R, S), R.split(/\s+/).map((D) => y(D, S)).join(" ")), y = (R, S) => {
    R = R.trim();
    const D = S.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return R.replace(D, (A, F, O, q, K, X) => {
      s("xRange", R, A, F, O, q, K, X);
      const te = N(O), ge = te || N(q), H = ge || N(K), tt = H;
      return F === "=" && tt && (F = ""), X = S.includePrerelease ? "-0" : "", te ? F === ">" || F === "<" ? A = "<0.0.0-0" : A = "*" : F && tt ? (ge && (q = 0), K = 0, F === ">" ? (F = ">=", ge ? (O = +O + 1, q = 0, K = 0) : (q = +q + 1, K = 0)) : F === "<=" && (F = "<", ge ? O = +O + 1 : q = +q + 1), F === "<" && (X = "-0"), A = `${F + O}.${q}.${K}${X}`) : ge ? A = `>=${O}.0.0${X} <${+O + 1}.0.0-0` : H && (A = `>=${O}.${q}.0${X} <${O}.${+q + 1}.0-0`), s("xRange return", A), A;
    });
  }, M = (R, S) => (s("replaceStars", R, S), R.trim().replace(l[d.STAR], "")), j = (R, S) => (s("replaceGTE0", R, S), R.trim().replace(l[S.includePrerelease ? d.GTE0PRE : d.GTE0], "")), U = (R) => (S, D, A, F, O, q, K, X, te, ge, H, tt) => (N(A) ? D = "" : N(F) ? D = `>=${A}.0.0${R ? "-0" : ""}` : N(O) ? D = `>=${A}.${F}.0${R ? "-0" : ""}` : q ? D = `>=${D}` : D = `>=${D}${R ? "-0" : ""}`, N(te) ? X = "" : N(ge) ? X = `<${+te + 1}.0.0-0` : N(H) ? X = `<${te}.${+ge + 1}.0-0` : tt ? X = `<=${te}.${ge}.${H}-${tt}` : R ? X = `<${te}.${ge}.${+H + 1}-0` : X = `<=${X}`, `${D} ${X}`.trim()), Y = (R, S, D) => {
    for (let A = 0; A < R.length; A++)
      if (!R[A].test(S))
        return !1;
    if (S.prerelease.length && !D.includePrerelease) {
      for (let A = 0; A < R.length; A++)
        if (s(R[A].semver), R[A].semver !== a.ANY && R[A].semver.prerelease.length > 0) {
          const F = R[A].semver;
          if (F.major === S.major && F.minor === S.minor && F.patch === S.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ta;
}
var _a, El;
function Bi() {
  if (El) return _a;
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
  _a = t;
  const r = Ns, { safeRe: n, t: i } = gn, a = Cf, s = Ui, o = Ue, l = et();
  return _a;
}
const vx = et(), Tx = (e, t, r) => {
  try {
    t = new vx(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var ji = Tx;
const _x = et(), bx = (e, t) => new _x(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var Sx = bx;
const Ax = Ue, Ix = et(), Cx = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new Ix(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === -1) && (n = s, i = new Ax(n, r));
  }), n;
};
var Rx = Cx;
const Ox = Ue, Dx = et(), kx = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new Dx(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === 1) && (n = s, i = new Ox(n, r));
  }), n;
};
var Px = kx;
const ba = Ue, Nx = et(), vl = Mi, Fx = (e, t) => {
  e = new Nx(e, t);
  let r = new ba("0.0.0");
  if (e.test(r) || (r = new ba("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let a = null;
    i.forEach((s) => {
      const o = new ba(s.semver.version);
      switch (s.operator) {
        case ">":
          o.prerelease.length === 0 ? o.patch++ : o.prerelease.push(0), o.raw = o.format();
        case "":
        case ">=":
          (!a || vl(o, a)) && (a = o);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), a && (!r || vl(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var $x = Fx;
const Lx = et(), Ux = (e, t) => {
  try {
    return new Lx(e, t).range || "*";
  } catch {
    return null;
  }
};
var Mx = Ux;
const Bx = Ue, Rf = Bi(), { ANY: jx } = Rf, zx = et(), Gx = ji, Tl = Mi, _l = $s, Hx = Us, qx = Ls, Xx = (e, t, r, n) => {
  e = new Bx(e, n), t = new zx(t, n);
  let i, a, s, o, l;
  switch (r) {
    case ">":
      i = Tl, a = Hx, s = _l, o = ">", l = ">=";
      break;
    case "<":
      i = _l, a = qx, s = Tl, o = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Gx(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const c = t.set[d];
    let u = null, p = null;
    if (c.forEach((m) => {
      m.semver === jx && (m = new Rf(">=0.0.0")), u = u || m, p = p || m, i(m.semver, u.semver, n) ? u = m : s(m.semver, p.semver, n) && (p = m);
    }), u.operator === o || u.operator === l || (!p.operator || p.operator === o) && a(e, p.semver))
      return !1;
    if (p.operator === l && s(e, p.semver))
      return !1;
  }
  return !0;
};
var Ms = Xx;
const Wx = Ms, Vx = (e, t, r) => Wx(e, t, ">", r);
var Yx = Vx;
const Kx = Ms, Jx = (e, t, r) => Kx(e, t, "<", r);
var Qx = Jx;
const bl = et(), Zx = (e, t, r) => (e = new bl(e, r), t = new bl(t, r), e.intersects(t, r));
var eE = Zx;
const tE = ji, rE = Ze;
var nE = (e, t, r) => {
  const n = [];
  let i = null, a = null;
  const s = e.sort((c, u) => rE(c, u, r));
  for (const c of s)
    tE(c, t, r) ? (a = c, i || (i = c)) : (a && n.push([i, a]), a = null, i = null);
  i && n.push([i, null]);
  const o = [];
  for (const [c, u] of n)
    c === u ? o.push(c) : !u && c === s[0] ? o.push("*") : u ? c === s[0] ? o.push(`<=${u}`) : o.push(`${c} - ${u}`) : o.push(`>=${c}`);
  const l = o.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const Sl = et(), Bs = Bi(), { ANY: Sa } = Bs, Lr = ji, js = Ze, iE = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Sl(e, r), t = new Sl(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const a of t.set) {
      const s = sE(i, a, r);
      if (n = n || s !== null, s)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, aE = [new Bs(">=0.0.0-0")], Al = [new Bs(">=0.0.0")], sE = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Sa) {
    if (t.length === 1 && t[0].semver === Sa)
      return !0;
    r.includePrerelease ? e = aE : e = Al;
  }
  if (t.length === 1 && t[0].semver === Sa) {
    if (r.includePrerelease)
      return !0;
    t = Al;
  }
  const n = /* @__PURE__ */ new Set();
  let i, a;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? i = Il(i, m, r) : m.operator === "<" || m.operator === "<=" ? a = Cl(a, m, r) : n.add(m.semver);
  if (n.size > 1)
    return null;
  let s;
  if (i && a) {
    if (s = js(i.semver, a.semver, r), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const m of n) {
    if (i && !Lr(m, String(i), r) || a && !Lr(m, String(a), r))
      return null;
    for (const E of t)
      if (!Lr(m, String(E), r))
        return !1;
    return !0;
  }
  let o, l, d, c, u = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, p = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && a.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const m of t) {
    if (c = c || m.operator === ">" || m.operator === ">=", d = d || m.operator === "<" || m.operator === "<=", i) {
      if (p && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === p.major && m.semver.minor === p.minor && m.semver.patch === p.patch && (p = !1), m.operator === ">" || m.operator === ">=") {
        if (o = Il(i, m, r), o === m && o !== i)
          return !1;
      } else if (i.operator === ">=" && !Lr(i.semver, String(m), r))
        return !1;
    }
    if (a) {
      if (u && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === u.major && m.semver.minor === u.minor && m.semver.patch === u.patch && (u = !1), m.operator === "<" || m.operator === "<=") {
        if (l = Cl(a, m, r), l === m && l !== a)
          return !1;
      } else if (a.operator === "<=" && !Lr(a.semver, String(m), r))
        return !1;
    }
    if (!m.operator && (a || i) && s !== 0)
      return !1;
  }
  return !(i && d && !a && s !== 0 || a && c && !i && s !== 0 || p || u);
}, Il = (e, t, r) => {
  if (!e)
    return t;
  const n = js(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Cl = (e, t, r) => {
  if (!e)
    return t;
  const n = js(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var oE = iE;
const Aa = gn, Rl = Li, lE = Ue, Ol = Sf, cE = Cr, uE = gw, fE = xw, dE = vw, pE = _w, hE = Aw, mE = Rw, gE = kw, yE = Fw, wE = Ze, xE = Mw, EE = zw, vE = Fs, TE = Xw, _E = Yw, bE = Mi, SE = $s, AE = Af, IE = If, CE = Ls, RE = Us, OE = Cf, DE = wx, kE = Bi(), PE = et(), NE = ji, FE = Sx, $E = Rx, LE = Px, UE = $x, ME = Mx, BE = Ms, jE = Yx, zE = Qx, GE = eE, HE = nE, qE = oE;
var Of = {
  parse: cE,
  valid: uE,
  clean: fE,
  inc: dE,
  diff: pE,
  major: hE,
  minor: mE,
  patch: gE,
  prerelease: yE,
  compare: wE,
  rcompare: xE,
  compareLoose: EE,
  compareBuild: vE,
  sort: TE,
  rsort: _E,
  gt: bE,
  lt: SE,
  eq: AE,
  neq: IE,
  gte: CE,
  lte: RE,
  cmp: OE,
  coerce: DE,
  Comparator: kE,
  Range: PE,
  satisfies: NE,
  toComparators: FE,
  maxSatisfying: $E,
  minSatisfying: LE,
  minVersion: UE,
  validRange: ME,
  outside: BE,
  gtr: jE,
  ltr: zE,
  intersects: GE,
  simplifyRange: HE,
  subset: qE,
  SemVer: lE,
  re: Aa.re,
  src: Aa.src,
  tokens: Aa.t,
  SEMVER_SPEC_VERSION: Rl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Rl.RELEASE_TYPES,
  compareIdentifiers: Ol.compareIdentifiers,
  rcompareIdentifiers: Ol.rcompareIdentifiers
}, yn = {}, vi = { exports: {} };
vi.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, a = 2, s = 9007199254740991, o = "[object Arguments]", l = "[object Array]", d = "[object AsyncFunction]", c = "[object Boolean]", u = "[object Date]", p = "[object Error]", m = "[object Function]", E = "[object GeneratorFunction]", w = "[object Map]", T = "[object Number]", b = "[object Null]", _ = "[object Object]", N = "[object Promise]", $ = "[object Proxy]", B = "[object RegExp]", k = "[object Set]", G = "[object String]", ae = "[object Symbol]", y = "[object Undefined]", M = "[object WeakMap]", j = "[object ArrayBuffer]", U = "[object DataView]", Y = "[object Float32Array]", R = "[object Float64Array]", S = "[object Int8Array]", D = "[object Int16Array]", A = "[object Int32Array]", F = "[object Uint8Array]", O = "[object Uint8ClampedArray]", q = "[object Uint16Array]", K = "[object Uint32Array]", X = /[\\^$.*+?()[\]{}|]/g, te = /^\[object .+?Constructor\]$/, ge = /^(?:0|[1-9]\d*)$/, H = {};
  H[Y] = H[R] = H[S] = H[D] = H[A] = H[F] = H[O] = H[q] = H[K] = !0, H[o] = H[l] = H[j] = H[c] = H[U] = H[u] = H[p] = H[m] = H[w] = H[T] = H[_] = H[B] = H[k] = H[G] = H[M] = !1;
  var tt = typeof ke == "object" && ke && ke.Object === Object && ke, h = typeof self == "object" && self && self.Object === Object && self, f = tt || h || Function("return this")(), I = t && !t.nodeType && t, v = I && !0 && e && !e.nodeType && e, Z = v && v.exports === I, se = Z && tt.process, fe = function() {
    try {
      return se && se.binding && se.binding("util");
    } catch {
    }
  }(), ve = fe && fe.isTypedArray;
  function Se(g, x) {
    for (var C = -1, L = g == null ? 0 : g.length, oe = 0, V = []; ++C < L; ) {
      var de = g[C];
      x(de, C, g) && (V[oe++] = de);
    }
    return V;
  }
  function mt(g, x) {
    for (var C = -1, L = x.length, oe = g.length; ++C < L; )
      g[oe + C] = x[C];
    return g;
  }
  function he(g, x) {
    for (var C = -1, L = g == null ? 0 : g.length; ++C < L; )
      if (x(g[C], C, g))
        return !0;
    return !1;
  }
  function Ve(g, x) {
    for (var C = -1, L = Array(g); ++C < g; )
      L[C] = x(C);
    return L;
  }
  function ea(g) {
    return function(x) {
      return g(x);
    };
  }
  function _n(g, x) {
    return g.has(x);
  }
  function Or(g, x) {
    return g == null ? void 0 : g[x];
  }
  function bn(g) {
    var x = -1, C = Array(g.size);
    return g.forEach(function(L, oe) {
      C[++x] = [oe, L];
    }), C;
  }
  function hd(g, x) {
    return function(C) {
      return g(x(C));
    };
  }
  function md(g) {
    var x = -1, C = Array(g.size);
    return g.forEach(function(L) {
      C[++x] = L;
    }), C;
  }
  var gd = Array.prototype, yd = Function.prototype, Sn = Object.prototype, ta = f["__core-js_shared__"], Js = yd.toString, rt = Sn.hasOwnProperty, Qs = function() {
    var g = /[^.]+$/.exec(ta && ta.keys && ta.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Zs = Sn.toString, wd = RegExp(
    "^" + Js.call(rt).replace(X, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), eo = Z ? f.Buffer : void 0, An = f.Symbol, to = f.Uint8Array, ro = Sn.propertyIsEnumerable, xd = gd.splice, Ft = An ? An.toStringTag : void 0, no = Object.getOwnPropertySymbols, Ed = eo ? eo.isBuffer : void 0, vd = hd(Object.keys, Object), ra = nr(f, "DataView"), Dr = nr(f, "Map"), na = nr(f, "Promise"), ia = nr(f, "Set"), aa = nr(f, "WeakMap"), kr = nr(Object, "create"), Td = Ut(ra), _d = Ut(Dr), bd = Ut(na), Sd = Ut(ia), Ad = Ut(aa), io = An ? An.prototype : void 0, sa = io ? io.valueOf : void 0;
  function $t(g) {
    var x = -1, C = g == null ? 0 : g.length;
    for (this.clear(); ++x < C; ) {
      var L = g[x];
      this.set(L[0], L[1]);
    }
  }
  function Id() {
    this.__data__ = kr ? kr(null) : {}, this.size = 0;
  }
  function Cd(g) {
    var x = this.has(g) && delete this.__data__[g];
    return this.size -= x ? 1 : 0, x;
  }
  function Rd(g) {
    var x = this.__data__;
    if (kr) {
      var C = x[g];
      return C === n ? void 0 : C;
    }
    return rt.call(x, g) ? x[g] : void 0;
  }
  function Od(g) {
    var x = this.__data__;
    return kr ? x[g] !== void 0 : rt.call(x, g);
  }
  function Dd(g, x) {
    var C = this.__data__;
    return this.size += this.has(g) ? 0 : 1, C[g] = kr && x === void 0 ? n : x, this;
  }
  $t.prototype.clear = Id, $t.prototype.delete = Cd, $t.prototype.get = Rd, $t.prototype.has = Od, $t.prototype.set = Dd;
  function ct(g) {
    var x = -1, C = g == null ? 0 : g.length;
    for (this.clear(); ++x < C; ) {
      var L = g[x];
      this.set(L[0], L[1]);
    }
  }
  function kd() {
    this.__data__ = [], this.size = 0;
  }
  function Pd(g) {
    var x = this.__data__, C = Cn(x, g);
    if (C < 0)
      return !1;
    var L = x.length - 1;
    return C == L ? x.pop() : xd.call(x, C, 1), --this.size, !0;
  }
  function Nd(g) {
    var x = this.__data__, C = Cn(x, g);
    return C < 0 ? void 0 : x[C][1];
  }
  function Fd(g) {
    return Cn(this.__data__, g) > -1;
  }
  function $d(g, x) {
    var C = this.__data__, L = Cn(C, g);
    return L < 0 ? (++this.size, C.push([g, x])) : C[L][1] = x, this;
  }
  ct.prototype.clear = kd, ct.prototype.delete = Pd, ct.prototype.get = Nd, ct.prototype.has = Fd, ct.prototype.set = $d;
  function Lt(g) {
    var x = -1, C = g == null ? 0 : g.length;
    for (this.clear(); ++x < C; ) {
      var L = g[x];
      this.set(L[0], L[1]);
    }
  }
  function Ld() {
    this.size = 0, this.__data__ = {
      hash: new $t(),
      map: new (Dr || ct)(),
      string: new $t()
    };
  }
  function Ud(g) {
    var x = Rn(this, g).delete(g);
    return this.size -= x ? 1 : 0, x;
  }
  function Md(g) {
    return Rn(this, g).get(g);
  }
  function Bd(g) {
    return Rn(this, g).has(g);
  }
  function jd(g, x) {
    var C = Rn(this, g), L = C.size;
    return C.set(g, x), this.size += C.size == L ? 0 : 1, this;
  }
  Lt.prototype.clear = Ld, Lt.prototype.delete = Ud, Lt.prototype.get = Md, Lt.prototype.has = Bd, Lt.prototype.set = jd;
  function In(g) {
    var x = -1, C = g == null ? 0 : g.length;
    for (this.__data__ = new Lt(); ++x < C; )
      this.add(g[x]);
  }
  function zd(g) {
    return this.__data__.set(g, n), this;
  }
  function Gd(g) {
    return this.__data__.has(g);
  }
  In.prototype.add = In.prototype.push = zd, In.prototype.has = Gd;
  function gt(g) {
    var x = this.__data__ = new ct(g);
    this.size = x.size;
  }
  function Hd() {
    this.__data__ = new ct(), this.size = 0;
  }
  function qd(g) {
    var x = this.__data__, C = x.delete(g);
    return this.size = x.size, C;
  }
  function Xd(g) {
    return this.__data__.get(g);
  }
  function Wd(g) {
    return this.__data__.has(g);
  }
  function Vd(g, x) {
    var C = this.__data__;
    if (C instanceof ct) {
      var L = C.__data__;
      if (!Dr || L.length < r - 1)
        return L.push([g, x]), this.size = ++C.size, this;
      C = this.__data__ = new Lt(L);
    }
    return C.set(g, x), this.size = C.size, this;
  }
  gt.prototype.clear = Hd, gt.prototype.delete = qd, gt.prototype.get = Xd, gt.prototype.has = Wd, gt.prototype.set = Vd;
  function Yd(g, x) {
    var C = On(g), L = !C && up(g), oe = !C && !L && oa(g), V = !C && !L && !oe && ho(g), de = C || L || oe || V, ye = de ? Ve(g.length, String) : [], Te = ye.length;
    for (var le in g)
      rt.call(g, le) && !(de && // Safari 9 has enumerable `arguments.length` in strict mode.
      (le == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      oe && (le == "offset" || le == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      V && (le == "buffer" || le == "byteLength" || le == "byteOffset") || // Skip index properties.
      ap(le, Te))) && ye.push(le);
    return ye;
  }
  function Cn(g, x) {
    for (var C = g.length; C--; )
      if (co(g[C][0], x))
        return C;
    return -1;
  }
  function Kd(g, x, C) {
    var L = x(g);
    return On(g) ? L : mt(L, C(g));
  }
  function Pr(g) {
    return g == null ? g === void 0 ? y : b : Ft && Ft in Object(g) ? np(g) : cp(g);
  }
  function ao(g) {
    return Nr(g) && Pr(g) == o;
  }
  function so(g, x, C, L, oe) {
    return g === x ? !0 : g == null || x == null || !Nr(g) && !Nr(x) ? g !== g && x !== x : Jd(g, x, C, L, so, oe);
  }
  function Jd(g, x, C, L, oe, V) {
    var de = On(g), ye = On(x), Te = de ? l : yt(g), le = ye ? l : yt(x);
    Te = Te == o ? _ : Te, le = le == o ? _ : le;
    var je = Te == _, Ye = le == _, Ae = Te == le;
    if (Ae && oa(g)) {
      if (!oa(x))
        return !1;
      de = !0, je = !1;
    }
    if (Ae && !je)
      return V || (V = new gt()), de || ho(g) ? oo(g, x, C, L, oe, V) : tp(g, x, Te, C, L, oe, V);
    if (!(C & i)) {
      var He = je && rt.call(g, "__wrapped__"), qe = Ye && rt.call(x, "__wrapped__");
      if (He || qe) {
        var wt = He ? g.value() : g, ut = qe ? x.value() : x;
        return V || (V = new gt()), oe(wt, ut, C, L, V);
      }
    }
    return Ae ? (V || (V = new gt()), rp(g, x, C, L, oe, V)) : !1;
  }
  function Qd(g) {
    if (!po(g) || op(g))
      return !1;
    var x = uo(g) ? wd : te;
    return x.test(Ut(g));
  }
  function Zd(g) {
    return Nr(g) && fo(g.length) && !!H[Pr(g)];
  }
  function ep(g) {
    if (!lp(g))
      return vd(g);
    var x = [];
    for (var C in Object(g))
      rt.call(g, C) && C != "constructor" && x.push(C);
    return x;
  }
  function oo(g, x, C, L, oe, V) {
    var de = C & i, ye = g.length, Te = x.length;
    if (ye != Te && !(de && Te > ye))
      return !1;
    var le = V.get(g);
    if (le && V.get(x))
      return le == x;
    var je = -1, Ye = !0, Ae = C & a ? new In() : void 0;
    for (V.set(g, x), V.set(x, g); ++je < ye; ) {
      var He = g[je], qe = x[je];
      if (L)
        var wt = de ? L(qe, He, je, x, g, V) : L(He, qe, je, g, x, V);
      if (wt !== void 0) {
        if (wt)
          continue;
        Ye = !1;
        break;
      }
      if (Ae) {
        if (!he(x, function(ut, Mt) {
          if (!_n(Ae, Mt) && (He === ut || oe(He, ut, C, L, V)))
            return Ae.push(Mt);
        })) {
          Ye = !1;
          break;
        }
      } else if (!(He === qe || oe(He, qe, C, L, V))) {
        Ye = !1;
        break;
      }
    }
    return V.delete(g), V.delete(x), Ye;
  }
  function tp(g, x, C, L, oe, V, de) {
    switch (C) {
      case U:
        if (g.byteLength != x.byteLength || g.byteOffset != x.byteOffset)
          return !1;
        g = g.buffer, x = x.buffer;
      case j:
        return !(g.byteLength != x.byteLength || !V(new to(g), new to(x)));
      case c:
      case u:
      case T:
        return co(+g, +x);
      case p:
        return g.name == x.name && g.message == x.message;
      case B:
      case G:
        return g == x + "";
      case w:
        var ye = bn;
      case k:
        var Te = L & i;
        if (ye || (ye = md), g.size != x.size && !Te)
          return !1;
        var le = de.get(g);
        if (le)
          return le == x;
        L |= a, de.set(g, x);
        var je = oo(ye(g), ye(x), L, oe, V, de);
        return de.delete(g), je;
      case ae:
        if (sa)
          return sa.call(g) == sa.call(x);
    }
    return !1;
  }
  function rp(g, x, C, L, oe, V) {
    var de = C & i, ye = lo(g), Te = ye.length, le = lo(x), je = le.length;
    if (Te != je && !de)
      return !1;
    for (var Ye = Te; Ye--; ) {
      var Ae = ye[Ye];
      if (!(de ? Ae in x : rt.call(x, Ae)))
        return !1;
    }
    var He = V.get(g);
    if (He && V.get(x))
      return He == x;
    var qe = !0;
    V.set(g, x), V.set(x, g);
    for (var wt = de; ++Ye < Te; ) {
      Ae = ye[Ye];
      var ut = g[Ae], Mt = x[Ae];
      if (L)
        var mo = de ? L(Mt, ut, Ae, x, g, V) : L(ut, Mt, Ae, g, x, V);
      if (!(mo === void 0 ? ut === Mt || oe(ut, Mt, C, L, V) : mo)) {
        qe = !1;
        break;
      }
      wt || (wt = Ae == "constructor");
    }
    if (qe && !wt) {
      var Dn = g.constructor, kn = x.constructor;
      Dn != kn && "constructor" in g && "constructor" in x && !(typeof Dn == "function" && Dn instanceof Dn && typeof kn == "function" && kn instanceof kn) && (qe = !1);
    }
    return V.delete(g), V.delete(x), qe;
  }
  function lo(g) {
    return Kd(g, pp, ip);
  }
  function Rn(g, x) {
    var C = g.__data__;
    return sp(x) ? C[typeof x == "string" ? "string" : "hash"] : C.map;
  }
  function nr(g, x) {
    var C = Or(g, x);
    return Qd(C) ? C : void 0;
  }
  function np(g) {
    var x = rt.call(g, Ft), C = g[Ft];
    try {
      g[Ft] = void 0;
      var L = !0;
    } catch {
    }
    var oe = Zs.call(g);
    return L && (x ? g[Ft] = C : delete g[Ft]), oe;
  }
  var ip = no ? function(g) {
    return g == null ? [] : (g = Object(g), Se(no(g), function(x) {
      return ro.call(g, x);
    }));
  } : hp, yt = Pr;
  (ra && yt(new ra(new ArrayBuffer(1))) != U || Dr && yt(new Dr()) != w || na && yt(na.resolve()) != N || ia && yt(new ia()) != k || aa && yt(new aa()) != M) && (yt = function(g) {
    var x = Pr(g), C = x == _ ? g.constructor : void 0, L = C ? Ut(C) : "";
    if (L)
      switch (L) {
        case Td:
          return U;
        case _d:
          return w;
        case bd:
          return N;
        case Sd:
          return k;
        case Ad:
          return M;
      }
    return x;
  });
  function ap(g, x) {
    return x = x ?? s, !!x && (typeof g == "number" || ge.test(g)) && g > -1 && g % 1 == 0 && g < x;
  }
  function sp(g) {
    var x = typeof g;
    return x == "string" || x == "number" || x == "symbol" || x == "boolean" ? g !== "__proto__" : g === null;
  }
  function op(g) {
    return !!Qs && Qs in g;
  }
  function lp(g) {
    var x = g && g.constructor, C = typeof x == "function" && x.prototype || Sn;
    return g === C;
  }
  function cp(g) {
    return Zs.call(g);
  }
  function Ut(g) {
    if (g != null) {
      try {
        return Js.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function co(g, x) {
    return g === x || g !== g && x !== x;
  }
  var up = ao(/* @__PURE__ */ function() {
    return arguments;
  }()) ? ao : function(g) {
    return Nr(g) && rt.call(g, "callee") && !ro.call(g, "callee");
  }, On = Array.isArray;
  function fp(g) {
    return g != null && fo(g.length) && !uo(g);
  }
  var oa = Ed || mp;
  function dp(g, x) {
    return so(g, x);
  }
  function uo(g) {
    if (!po(g))
      return !1;
    var x = Pr(g);
    return x == m || x == E || x == d || x == $;
  }
  function fo(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= s;
  }
  function po(g) {
    var x = typeof g;
    return g != null && (x == "object" || x == "function");
  }
  function Nr(g) {
    return g != null && typeof g == "object";
  }
  var ho = ve ? ea(ve) : Zd;
  function pp(g) {
    return fp(g) ? Yd(g) : ep(g);
  }
  function hp() {
    return [];
  }
  function mp() {
    return !1;
  }
  e.exports = dp;
})(vi, vi.exports);
var XE = vi.exports;
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.DownloadedUpdateHelper = void 0;
yn.createTempUpdateFile = JE;
const WE = un, VE = kt, Dl = XE, Gt = Pt, Xr = ue;
class YE {
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
      return Dl(this.versionInfo, r) && Dl(this.fileInfo.info, n.info) && await (0, Gt.pathExists)(t) ? t : null;
    const a = await this.getValidCachedUpdateFile(n, i);
    return a === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = a, a);
  }
  async setDownloadedFile(t, r, n, i, a, s) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: a,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, Gt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Gt.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, Gt.pathExists)(n))
      return null;
    let a;
    try {
      a = await (0, Gt.readJson)(n);
    } catch (d) {
      let c = "No cached update info available";
      return d.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${d.message})`), r.info(c), null;
    }
    if (!((a == null ? void 0 : a.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== a.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${a.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const o = Xr.join(this.cacheDirForPendingUpdate, a.fileName);
    if (!await (0, Gt.pathExists)(o))
      return r.info("Cached update file doesn't exist"), null;
    const l = await KE(o);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = a, o);
  }
  getUpdateInfoFile() {
    return Xr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
yn.DownloadedUpdateHelper = YE;
function KE(e, t = "sha512", r = "base64", n) {
  return new Promise((i, a) => {
    const s = (0, WE.createHash)(t);
    s.on("error", a).setEncoding(r), (0, VE.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", a).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function JE(e, t, r) {
  let n = 0, i = Xr.join(t, e);
  for (let a = 0; a < 3; a++)
    try {
      return await (0, Gt.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${s}`), i = Xr.join(t, `${n++}-${e}`);
    }
  return i;
}
var zi = {}, zs = {};
Object.defineProperty(zs, "__esModule", { value: !0 });
zs.getAppCacheDir = ZE;
const Ia = ue, QE = Ii;
function ZE() {
  const e = (0, QE.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Ia.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Ia.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Ia.join(e, ".cache"), t;
}
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.ElectronAppAdapter = void 0;
const kl = ue, ev = zs;
class tv {
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
    return this.isPackaged ? kl.join(process.resourcesPath, "app-update.yml") : kl.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, ev.getAppCacheDir)();
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
zi.ElectronAppAdapter = tv;
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
var wn = {}, We = {}, rv = "[object Symbol]", kf = /[\\^$.*+?()[\]{}|]/g, nv = RegExp(kf.source), iv = typeof ke == "object" && ke && ke.Object === Object && ke, av = typeof self == "object" && self && self.Object === Object && self, sv = iv || av || Function("return this")(), ov = Object.prototype, lv = ov.toString, Pl = sv.Symbol, Nl = Pl ? Pl.prototype : void 0, Fl = Nl ? Nl.toString : void 0;
function cv(e) {
  if (typeof e == "string")
    return e;
  if (fv(e))
    return Fl ? Fl.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function uv(e) {
  return !!e && typeof e == "object";
}
function fv(e) {
  return typeof e == "symbol" || uv(e) && lv.call(e) == rv;
}
function dv(e) {
  return e == null ? "" : cv(e);
}
function pv(e) {
  return e = dv(e), e && nv.test(e) ? e.replace(kf, "\\$&") : e;
}
var hv = pv;
Object.defineProperty(We, "__esModule", { value: !0 });
We.newBaseUrl = gv;
We.newUrlFromBase = rs;
We.getChannelFilename = yv;
We.blockmapFiles = wv;
const Pf = br, mv = hv;
function gv(e) {
  const t = new Pf.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function rs(e, t, r = !1) {
  const n = new Pf.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function yv(e) {
  return `${e}.yml`;
}
function wv(e, t, r) {
  const n = rs(`${e.pathname}.blockmap`, e);
  return [rs(`${e.pathname.replace(new RegExp(mv(r), "g"), t)}.blockmap`, e), n];
}
var me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.Provider = void 0;
me.findFile = vv;
me.parseUpdateInfo = Tv;
me.getFileList = Nf;
me.resolveFiles = _v;
const Ot = Ee, xv = be, $l = We;
class Ev {
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
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Ot.configureRequestUrl)(t, n), n;
  }
}
me.Provider = Ev;
function vv(e, t, r) {
  if (e.length === 0)
    throw (0, Ot.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((a) => i.url.pathname.toLowerCase().endsWith(`.${a}`))));
}
function Tv(e, t, r) {
  if (e == null)
    throw (0, Ot.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, xv.load)(e);
  } catch (i) {
    throw (0, Ot.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Nf(e) {
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
  throw (0, Ot.newError)(`No files provided: ${(0, Ot.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function _v(e, t, r = (n) => n) {
  const i = Nf(e).map((o) => {
    if (o.sha2 == null && o.sha512 == null)
      throw (0, Ot.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Ot.safeStringifyJson)(o)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, $l.newUrlFromBase)(r(o.url), t),
      info: o
    };
  }), a = e.packages, s = a == null ? null : a[process.arch] || a.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, $l.newUrlFromBase)(r(s.path), t).href
  }), i;
}
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.GenericProvider = void 0;
const Ll = Ee, Ca = We, Ra = me;
class bv extends Ra.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, Ca.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Ca.getChannelFilename)(this.channel), r = (0, Ca.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Ra.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Ll.HttpError && i.statusCode === 404)
          throw (0, Ll.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, Ra.resolveFiles)(t, this.baseUrl);
  }
}
wn.GenericProvider = bv;
var Gi = {}, Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.BitbucketProvider = void 0;
const Ul = Ee, Oa = We, Da = me;
class Sv extends Da.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: a } = t;
    this.baseUrl = (0, Oa.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Ul.CancellationToken(), r = (0, Oa.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Oa.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
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
Hi.BitbucketProvider = Sv;
var Dt = {};
Object.defineProperty(Dt, "__esModule", { value: !0 });
Dt.GitHubProvider = Dt.BaseGitHubProvider = void 0;
Dt.computeReleaseNotes = $f;
const ft = Ee, hr = Of, Av = br, mr = We, ns = me, ka = /\/tag\/([^/]+)$/;
class Ff extends ns.Provider {
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
Dt.BaseGitHubProvider = Ff;
class Iv extends Ff {
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
          c = ka.exec(d.element("link").attribute("href"))[1];
        else
          for (const b of l.getElements("entry")) {
            const _ = ka.exec(b.element("link").attribute("href"));
            if (_ === null)
              continue;
            const N = _[1], $ = ((n = hr.prerelease(N)) === null || n === void 0 ? void 0 : n[0]) || null, B = !T || ["alpha", "beta"].includes(T), k = $ !== null && !["alpha", "beta"].includes(String($));
            if (B && !k && !(T === "beta" && $ === "alpha")) {
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
          if (ka.exec(T.element("link").attribute("href"))[1] === c) {
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
    let u, p = "", m = "";
    const E = async (T) => {
      p = (0, mr.getChannelFilename)(T), m = (0, mr.newUrlFromBase)(this.getBaseDownloadPath(String(c), p), this.baseUrl);
      const b = this.createRequestOptions(m);
      try {
        return await this.executor.request(b, s);
      } catch (_) {
        throw _ instanceof ft.HttpError && _.statusCode === 404 ? (0, ft.newError)(`Cannot find ${p} in the latest release artifacts (${m}): ${_.stack || _.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : _;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = hr.prerelease(c)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((a = hr.prerelease(c)) === null || a === void 0 ? void 0 : a[0]))), u = await E(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        u = await E(this.getDefaultChannelName());
      else
        throw T;
    }
    const w = (0, ns.parseUpdateInfo)(u, p, m);
    return w.releaseName == null && (w.releaseName = d.elementValueOrEmpty("title")), w.releaseNotes == null && (w.releaseNotes = $f(this.updater.currentVersion, this.updater.fullChangelog, l, d)), {
      tag: c,
      ...w
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, mr.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Av.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
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
    return (0, ns.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
Dt.GitHubProvider = Iv;
function Ml(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function $f(e, t, r, n) {
  if (!t)
    return Ml(n);
  const i = [];
  for (const a of r.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(a.element("link").attribute("href"))[1];
    hr.lt(e, s) && i.push({
      version: s,
      note: Ml(a)
    });
  }
  return i.sort((a, s) => hr.rcompare(a.version, s.version));
}
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.KeygenProvider = void 0;
const Bl = Ee, Pa = We, Na = me;
class Cv extends Na.Provider {
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
      return (0, Na.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Bl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Na.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
qi.KeygenProvider = Cv;
var Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.PrivateGitHubProvider = void 0;
const sr = Ee, Rv = be, Ov = ue, jl = br, zl = We, Dv = Dt, kv = me;
class Pv extends Dv.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new sr.CancellationToken(), r = (0, zl.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((o) => o.name === r);
    if (i == null)
      throw (0, sr.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const a = new jl.URL(i.url);
    let s;
    try {
      s = (0, Rv.load)(await this.httpRequest(a, this.configureHeaders("application/octet-stream"), t));
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
    const i = (0, zl.newUrlFromBase)(n, this.baseUrl);
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
    return (0, kv.getFileList)(t).map((r) => {
      const n = Ov.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((a) => a != null && a.name === n);
      if (i == null)
        throw (0, sr.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new jl.URL(i.url),
        info: r
      };
    });
  }
}
Xi.PrivateGitHubProvider = Pv;
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.isUrlProbablySupportMultiRangeRequests = Lf;
Gi.createClient = Uv;
const Wn = Ee, Nv = Hi, Gl = wn, Fv = Dt, $v = qi, Lv = Xi;
function Lf(e) {
  return !e.includes("s3.amazonaws.com");
}
function Uv(e, t, r) {
  if (typeof e == "string")
    throw (0, Wn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, a = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return a == null ? new Fv.GitHubProvider(i, t, r) : new Lv.PrivateGitHubProvider(i, t, a, r);
    }
    case "bitbucket":
      return new Nv.BitbucketProvider(e, t, r);
    case "keygen":
      return new $v.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Gl.GenericProvider({
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
      return new Gl.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Lf(i.url)
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
var Wi = {}, xn = {}, Rr = {}, rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.OperationKind = void 0;
rr.computeOperations = Mv;
var Wt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Wt || (rr.OperationKind = Wt = {}));
function Mv(e, t, r) {
  const n = ql(e.files), i = ql(t.files);
  let a = null;
  const s = t.files[0], o = [], l = s.name, d = n.get(l);
  if (d == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let u = 0;
  const { checksumToOffset: p, checksumToOldSize: m } = jv(n.get(l), d.offset, r);
  let E = s.offset;
  for (let w = 0; w < c.checksums.length; E += c.sizes[w], w++) {
    const T = c.sizes[w], b = c.checksums[w];
    let _ = p.get(b);
    _ != null && m.get(b) !== T && (r.warn(`Checksum ("${b}") matches, but size differs (old: ${m.get(b)}, new: ${T})`), _ = void 0), _ === void 0 ? (u++, a != null && a.kind === Wt.DOWNLOAD && a.end === E ? a.end += T : (a = {
      kind: Wt.DOWNLOAD,
      start: E,
      end: E + T
      // oldBlocks: null,
    }, Hl(a, o, b, w))) : a != null && a.kind === Wt.COPY && a.end === _ ? a.end += T : (a = {
      kind: Wt.COPY,
      start: _,
      end: _ + T
      // oldBlocks: [checksum]
    }, Hl(a, o, b, w));
  }
  return u > 0 && r.info(`File${s.name === "file" ? "" : " " + s.name} has ${u} changed blocks`), o;
}
const Bv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Hl(e, t, r, n) {
  if (Bv && t.length !== 0) {
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
function jv(e, t, r) {
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
function ql(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.DataSplitter = void 0;
Rr.copyData = Uf;
const Vn = Ee, zv = kt, Gv = cn, Hv = rr, Xl = Buffer.from(`\r
\r
`);
var vt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(vt || (vt = {}));
function Uf(e, t, r, n, i) {
  const a = (0, zv.createReadStream)("", {
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
class qv extends Gv.Writable {
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
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Vn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const o = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (o < s)
            await this.copyExistingData(o, s);
          else if (o > s)
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
        const s = this.options.tasks[t];
        if (s.kind !== Hv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Uf(s, this.out, this.options.oldFileFd, i, () => {
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
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((a, s) => {
      i.on("error", s), i.once("drain", () => {
        i.removeListener("error", s), a();
      });
    });
  }
}
Rr.DataSplitter = qv;
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.executeTasksUsingMultipleRangeRequests = Xv;
Vi.checkIsRangesSupported = as;
const is = Ee, Wl = Rr, Vl = rr;
function Xv(e, t, r, n, i) {
  const a = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const o = s + 1e3;
    Wv(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, o),
      oldFileFd: n
    }, r, () => a(o), i);
  };
  return a;
}
function Wv(e, t, r, n, i) {
  let a = "bytes=", s = 0;
  const o = /* @__PURE__ */ new Map(), l = [];
  for (let u = t.start; u < t.end; u++) {
    const p = t.tasks[u];
    p.kind === Vl.OperationKind.DOWNLOAD && (a += `${p.start}-${p.end - 1}, `, o.set(s, u), s++, l.push(p.end - p.start));
  }
  if (s <= 1) {
    const u = (p) => {
      if (p >= t.end) {
        n();
        return;
      }
      const m = t.tasks[p++];
      if (m.kind === Vl.OperationKind.COPY)
        (0, Wl.copyData)(m, r, t.oldFileFd, i, () => u(p));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${m.start}-${m.end - 1}`;
        const w = e.httpExecutor.createRequest(E, (T) => {
          as(T, i) && (T.pipe(r, {
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
    if (!as(u, i))
      return;
    const p = (0, is.safeGetHeader)(u, "content-type"), m = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(p);
    if (m == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${p}"`));
      return;
    }
    const E = new Wl.DataSplitter(r, t, o, m[1] || m[2], l, n);
    E.on("error", i), u.pipe(E), u.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function as(e, t) {
  if (e.statusCode >= 400)
    return t((0, is.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, is.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.ProgressDifferentialDownloadCallbackTransform = void 0;
const Vv = cn;
var gr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(gr || (gr = {}));
class Yv extends Vv.Transform {
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
Yi.ProgressDifferentialDownloadCallbackTransform = Yv;
Object.defineProperty(xn, "__esModule", { value: !0 });
xn.DifferentialDownloader = void 0;
const Ur = Ee, Fa = Pt, Kv = kt, Jv = Rr, Qv = br, Yn = rr, Yl = Vi, Zv = Yi;
class eT {
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
    const n = this.logger, i = (0, Yn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let a = 0, s = 0;
    for (const l of i) {
      const d = l.end - l.start;
      l.kind === Yn.OperationKind.DOWNLOAD ? a += d : s += d;
    }
    const o = this.blockAwareFileInfo.size;
    if (a + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== o)
      throw new Error(`Internal error, size mismatch: downloadSize: ${a}, copySize: ${s}, newSize: ${o}`);
    return n.info(`Full: ${Kl(o)}, To download: ${Kl(a)} (${Math.round(a / (o / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Fa.close)(i.descriptor).catch((a) => {
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
    const n = await (0, Fa.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Fa.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const a = (0, Kv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, o) => {
      const l = [];
      let d;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const b = [];
        let _ = 0;
        for (const $ of t)
          $.kind === Yn.OperationKind.DOWNLOAD && (b.push($.end - $.start), _ += $.end - $.start);
        const N = {
          expectedByteCounts: b,
          grandTotal: _
        };
        d = new Zv.ProgressDifferentialDownloadCallbackTransform(N, this.options.cancellationToken, this.options.onProgress), l.push(d);
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
      let m;
      if (this.options.isUseMultipleRangeRequest) {
        m = (0, Yl.executeTasksUsingMultipleRangeRequests)(this, t, p, n, o), m(0);
        return;
      }
      let E = 0, w = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", m = (b) => {
        var _, N;
        if (b >= t.length) {
          this.fileMetadataBuffer != null && p.write(this.fileMetadataBuffer), p.end();
          return;
        }
        const $ = t[b++];
        if ($.kind === Yn.OperationKind.COPY) {
          d && d.beginFileCopy(), (0, Jv.copyData)($, p, n, o, () => m(b));
          return;
        }
        const B = `bytes=${$.start}-${$.end - 1}`;
        T.headers.range = B, (N = (_ = this.logger) === null || _ === void 0 ? void 0 : _.debug) === null || N === void 0 || N.call(_, `download range: ${B}`), d && d.beginRangeDownload();
        const k = this.httpExecutor.createRequest(T, (G) => {
          G.on("error", o), G.on("aborted", () => {
            o(new Error("response has been aborted by the server"));
          }), G.statusCode >= 400 && o((0, Ur.createHttpError)(G)), G.pipe(p, {
            end: !1
          }), G.once("end", () => {
            d && d.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => m(b), 1e3)) : m(b);
          });
        });
        k.on("redirect", (G, ae, y) => {
          this.logger.info(`Redirect to ${tT(y)}`), w = y, (0, Ur.configureRequestUrl)(new Qv.URL(w), T), k.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(k, o), k.end();
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
        (0, Yl.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", r), s.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(a, i), a.end();
    });
  }
}
xn.DifferentialDownloader = eT;
function Kl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function tT(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.GenericDifferentialDownloader = void 0;
const rT = xn;
class nT extends rT.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Wi.GenericDifferentialDownloader = nT;
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
const De = Ee, iT = un, aT = Ii, sT = Rc, or = Pt, oT = be, $a = $i, Bt = ue, Ht = Of, Jl = yn, lT = zi, Ql = Df, cT = wn, La = Gi, uT = Dc, fT = We, dT = Wi, lr = Nt;
class Gs extends sT.EventEmitter {
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
    this._logger = t ?? new Mf();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new $a.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new lr.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (a) => this.checkIfUpdateSupported(a), this.clientPromise = null, this.stagingUserIdPromise = new $a.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new $a.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (a) => {
      this._logger.error(`Error: ${a.stack || a.message}`);
    }), r == null ? (this.app = new lT.ElectronAppAdapter(), this.httpExecutor = new Ql.ElectronHttpExecutor((a, s) => this.emit("login", a, s))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Ht.parse)(n);
    if (i == null)
      throw (0, De.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = pT(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new cT.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, La.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, La.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = Gs.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
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
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, aT.release)();
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
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, La.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, oT.load)(await (0, or.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const r = De.UUID.v5((0, iT.randomBytes)(4096), De.UUID.OID);
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
    const p = s == null ? null : Bt.join(d, `package-${a}${Bt.extname(s.path) || ".7z"}`), m = async (_) => (await l.setDownloadedFile(u, p, i, r, c, _), await t.done({
      ...i,
      downloadedFile: u
    }), p == null ? [u] : [u, p]), E = this._logger, w = await l.validateDownloadedPath(u, i, r, E);
    if (w != null)
      return u = w, await m(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, or.unlink)(u).catch(() => {
    })), b = await (0, Jl.createTempUpdateFile)(`temp-${c}`, d, E);
    try {
      await t.task(b, n, p, T), await (0, De.retry)(() => (0, or.rename)(b, u), 60, 500, 0, 0, (_) => _ instanceof Error && /^EBUSY:/.test(_.message));
    } catch (_) {
      throw await T(), _ instanceof De.CancellationError && (E.info("cancelled"), this.emit("update-cancelled", i)), _;
    }
    return E.info(`New version ${a} has been downloaded to ${u}`), await m(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, a) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, fT.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const o = async (c) => {
        const u = await this.httpExecutor.downloadToBuffer(c, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (u == null || u.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, uT.gunzipSync)(u).toString());
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
      return await new dT.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(d[0], d[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
It.AppUpdater = Gs;
function pT(e) {
  const t = (0, Ht.prerelease)(e);
  return t != null && t.length > 0;
}
class Mf {
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
It.NoOpLogger = Mf;
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.BaseUpdater = void 0;
const Zl = Ai, hT = It;
class mT extends hT.AppUpdater {
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
    const i = (0, Zl.spawnSync)(t, r, {
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
        const o = { stdio: i, env: n, detached: !0 }, l = (0, Zl.spawn)(t, r, o);
        l.on("error", (d) => {
          s(d);
        }), l.unref(), l.pid !== void 0 && a(!0);
      } catch (o) {
        s(o);
      }
    });
  }
}
ht.BaseUpdater = mT;
var rn = {}, En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
En.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const cr = Pt, gT = xn, yT = Dc;
class wT extends gT.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Bf(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await xT(this.options.oldFile), i);
  }
}
En.FileWithEmbeddedBlockMapDifferentialDownloader = wT;
function Bf(e) {
  return JSON.parse((0, yT.inflateRawSync)(e).toString());
}
async function xT(e) {
  const t = await (0, cr.open)(e, "r");
  try {
    const r = (await (0, cr.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, cr.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, cr.read)(t, i, 0, i.length, r - n.length - i.length), await (0, cr.close)(t), Bf(i);
  } catch (r) {
    throw await (0, cr.close)(t), r;
  }
}
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.AppImageUpdater = void 0;
const ec = Ee, tc = Ai, ET = Pt, vT = kt, Mr = ue, TT = ht, _T = En, bT = me, rc = Nt;
class ST extends TT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, bT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, ec.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, s, i, r, t)) && await this.httpExecutor.download(n.url, i, a), await (0, ET.chmod)(i, 493);
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
      return this.listenerCount(rc.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(rc.DOWNLOAD_PROGRESS, o)), await new _T.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, ec.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, vT.unlinkSync)(r);
    let n;
    const i = Mr.basename(r), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Mr.basename(a) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Mr.join(Mr.dirname(r), Mr.basename(a)), (0, tc.execFileSync)("mv", ["-f", a, n]), n !== r && this.emit("appimage-filename-updated", n);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, tc.execFileSync)(n, [], { env: s })), !0;
  }
}
rn.AppImageUpdater = ST;
var nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.DebUpdater = void 0;
const AT = ht, IT = me, nc = Nt;
class CT extends AT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, IT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
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
    const a = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
nn.DebUpdater = CT;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.PacmanUpdater = void 0;
const RT = ht, ic = Nt, OT = me;
class DT extends RT.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, OT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
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
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const a = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
an.PacmanUpdater = DT;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.RpmUpdater = void 0;
const kT = ht, ac = Nt, PT = me;
class NT extends kT.BaseUpdater {
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
        this.listenerCount(ac.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(ac.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
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
sn.RpmUpdater = NT;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.MacUpdater = void 0;
const sc = Ee, Ua = Pt, FT = kt, oc = ue, $T = _p, LT = It, UT = me, lc = Ai, cc = un;
class MT extends LT.AppUpdater {
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
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const p = (0, lc.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const l = (0, UT.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, sc.newError)(`ZIP file not provided: ${(0, sc.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const d = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (u, p) => {
        const m = oc.join(this.downloadedUpdateHelper.cacheDir, c), E = () => (0, Ua.pathExistsSync)(m) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let w = !0;
        E() && (w = await this.differentialDownloadInstaller(l, t, u, d, c)), w && await this.httpExecutor.download(l.url, u, p);
      },
      done: async (u) => {
        if (!t.disableDifferentialDownload)
          try {
            const p = oc.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Ua.copyFile)(u.downloadedFile, p);
          } catch (p) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${p.message}`);
          }
        return this.updateDownloaded(l, u);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, a = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Ua.stat)(i)).size, s = this._logger, o = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${o})`), this.server = (0, $T.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${o})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${o})`);
    });
    const l = (d) => {
      const c = d.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((d, c) => {
      const u = (0, cc.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), p = Buffer.from(`autoupdater:${u}`, "ascii"), m = `/${(0, cc.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (E, w) => {
        const T = E.url;
        if (s.info(`${T} requested`), T === "/") {
          if (!E.headers.authorization || E.headers.authorization.indexOf("Basic ") === -1) {
            w.statusCode = 401, w.statusMessage = "Invalid Authentication Credentials", w.end(), s.warn("No authenthication info");
            return;
          }
          const N = E.headers.authorization.split(" ")[1], $ = Buffer.from(N, "base64").toString("ascii"), [B, k] = $.split(":");
          if (B !== "autoupdater" || k !== u) {
            w.statusCode = 401, w.statusMessage = "Invalid Authentication Credentials", w.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const G = Buffer.from(`{ "url": "${l(this.server)}${m}" }`);
          w.writeHead(200, { "Content-Type": "application/json", "Content-Length": G.length }), w.end(G);
          return;
        }
        if (!T.startsWith(m)) {
          s.warn(`${T} requested, but not supported`), w.writeHead(404), w.end();
          return;
        }
        s.info(`${m} requested by Squirrel.Mac, pipe ${i}`);
        let b = !1;
        w.on("finish", () => {
          b || (this.nativeUpdater.removeListener("error", c), d([]));
        });
        const _ = (0, FT.createReadStream)(i);
        _.on("error", (N) => {
          try {
            w.end();
          } catch ($) {
            s.warn(`cannot end response: ${$}`);
          }
          b = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${N}`));
        }), w.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": a
        }), _.pipe(w);
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
on.MacUpdater = MT;
var ln = {}, Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.verifySignature = jT;
const uc = Ee, jf = Ai, BT = Ii, fc = ue;
function jT(e, t, r) {
  return new Promise((n, i) => {
    const a = t.replace(/'/g, "''");
    r.info(`Verifying signature ${a}`), (0, jf.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${a}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, o, l) => {
      var d;
      try {
        if (s != null || l) {
          Ma(r, s, l, i), n(null);
          return;
        }
        const c = zT(o);
        if (c.Status === 0) {
          try {
            const E = fc.normalize(c.Path), w = fc.normalize(t);
            if (r.info(`LiteralPath: ${E}. Update Path: ${w}`), E !== w) {
              Ma(r, new Error(`LiteralPath of ${E} is different than ${w}`), l, i), n(null);
              return;
            }
          } catch (E) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(d = E.message) !== null && d !== void 0 ? d : E.stack}`);
          }
          const p = (0, uc.parseDn)(c.SignerCertificate.Subject);
          let m = !1;
          for (const E of e) {
            const w = (0, uc.parseDn)(E);
            if (w.size ? m = Array.from(w.keys()).every((b) => w.get(b) === p.get(b)) : E === p.get("CN") && (r.warn(`Signature validated using only CN ${E}. Please add your full Distinguished Name (DN) to publisherNames configuration`), m = !0), m) {
              n(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (p, m) => p === "RawData" ? void 0 : m, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), n(u);
      } catch (c) {
        Ma(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function zT(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function Ma(e, t, r, n) {
  if (GT()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, jf.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function GT() {
  const e = BT.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.NsisUpdater = void 0;
const Kn = Ee, dc = ue, HT = ht, qT = En, pc = Nt, XT = me, WT = Pt, VT = Hs, hc = br;
class YT extends HT.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, VT.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, XT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, a, s, o) => {
        const l = n.packageInfo, d = l != null && s != null;
        if (d && t.disableWebInstaller)
          throw (0, Kn.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !d && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Kn.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, a);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await o(), (0, Kn.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (d && await this.differentialDownloadWebPackage(t, l, s, r))
          try {
            await this.httpExecutor.download(new hc.URL(l.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (u) {
            try {
              await (0, WT.unlink)(s);
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
      this.spawnLog(dc.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((s) => this.dispatchError(s));
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
        newUrl: new hc.URL(r.path),
        oldFile: dc.join(this.downloadedUpdateHelper.cacheDir, Kn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(pc.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(pc.DOWNLOAD_PROGRESS, s)), await new qT.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, a).download();
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "win32";
    }
    return !1;
  }
}
ln.NsisUpdater = YT;
(function(e) {
  var t = ke && ke.__createBinding || (Object.create ? function(T, b, _, N) {
    N === void 0 && (N = _);
    var $ = Object.getOwnPropertyDescriptor(b, _);
    (!$ || ("get" in $ ? !b.__esModule : $.writable || $.configurable)) && ($ = { enumerable: !0, get: function() {
      return b[_];
    } }), Object.defineProperty(T, N, $);
  } : function(T, b, _, N) {
    N === void 0 && (N = _), T[N] = b[_];
  }), r = ke && ke.__exportStar || function(T, b) {
    for (var _ in T) _ !== "default" && !Object.prototype.hasOwnProperty.call(b, _) && t(b, T, _);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = Pt, i = ue;
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
  var m = ln;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return m.NsisUpdater;
  } }), r(Nt, e);
  let E;
  function w() {
    if (process.platform === "win32")
      E = new ln.NsisUpdater();
    else if (process.platform === "darwin")
      E = new on.MacUpdater();
    else {
      E = new rn.AppImageUpdater();
      try {
        const T = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(T))
          return E;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const b = (0, n.readFileSync)(T).toString().trim();
        switch (console.info("Found package-type:", b), b) {
          case "deb":
            E = new nn.DebUpdater();
            break;
          case "rpm":
            E = new sn.RpmUpdater();
            break;
          case "pacman":
            E = new an.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (T) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", T.message);
      }
    }
    return E;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => E || w()
  });
})(ot);
const KT = "End-Of-Stream";
class Re extends Error {
  constructor() {
    super(KT), this.name = "EndOfStreamError";
  }
}
class JT extends Error {
  constructor(t = "The operation was aborted") {
    super(t), this.name = "AbortError";
  }
}
class zf {
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
      throw new Re();
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
        throw new JT();
      const i = await this.readFromStream(t.subarray(n), r);
      if (i === 0)
        break;
      n += i;
    }
    if (!r && n < t.length)
      throw new Re();
    return n;
  }
}
class QT extends zf {
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
class ZT extends QT {
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
class mc extends zf {
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
      throw new Re();
    return n;
  }
  abort() {
    return this.interrupted = !0, this.reader.cancel();
  }
  async close() {
    await this.abort(), this.reader.releaseLock();
  }
}
function e_(e) {
  try {
    const t = e.getReader({ mode: "byob" });
    return t instanceof ReadableStreamDefaultReader ? new mc(t) : new ZT(t);
  } catch (t) {
    if (t instanceof TypeError)
      return new mc(e.getReader());
    throw t;
  }
}
class Ki {
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
      throw new Re();
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
      throw new Re();
    return t.get(n, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async readNumber(t) {
    if (await this.readBuffer(this.numBuffer, { length: t.len }) < t.len)
      throw new Re();
    return t.get(this.numBuffer, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async peekNumber(t) {
    if (await this.peekBuffer(this.numBuffer, { length: t.len }) < t.len)
      throw new Re();
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
const t_ = 256e3;
class r_ extends Ki {
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
      throw new Re();
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
        if (r != null && r.mayBeLess && a instanceof Re)
          return 0;
        throw a;
      }
      if (!n.mayBeLess && i < n.length)
        throw new Re();
    }
    return i;
  }
  async ignore(t) {
    const r = Math.min(t_, t), n = new Uint8Array(r);
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
class n_ extends Ki {
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
      throw new Re();
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
class i_ extends Ki {
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
      throw new Re();
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
function a_(e, t) {
  const r = e_(e), n = t ?? {}, i = n.onClose;
  return n.onClose = async () => {
    if (await r.close(), i)
      return i();
  }, new r_(r, n);
}
function ss(e, t) {
  return new n_(e, t);
}
function s_(e, t) {
  return new i_(e, t);
}
class qs extends Ki {
  /**
   * Create tokenizer from provided file path
   * @param sourceFilePath File path
   */
  static async fromFile(t) {
    const r = await Ep(t, "r"), n = await r.stat();
    return new qs(r, { fileInfo: { path: t, size: n.size } });
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
      throw new Re();
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
      throw new Re();
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
const o_ = qs.fromFile;
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Ji = function(e, t, r, n, i) {
  var a, s, o = i * 8 - n - 1, l = (1 << o) - 1, d = l >> 1, c = -7, u = r ? i - 1 : 0, p = r ? -1 : 1, m = e[t + u];
  for (u += p, a = m & (1 << -c) - 1, m >>= -c, c += o; c > 0; a = a * 256 + e[t + u], u += p, c -= 8)
    ;
  for (s = a & (1 << -c) - 1, a >>= -c, c += n; c > 0; s = s * 256 + e[t + u], u += p, c -= 8)
    ;
  if (a === 0)
    a = 1 - d;
  else {
    if (a === l)
      return s ? NaN : (m ? -1 : 1) * (1 / 0);
    s = s + Math.pow(2, n), a = a - d;
  }
  return (m ? -1 : 1) * s * Math.pow(2, a - n);
}, Qi = function(e, t, r, n, i, a) {
  var s, o, l, d = a * 8 - i - 1, c = (1 << d) - 1, u = c >> 1, p = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, m = n ? 0 : a - 1, E = n ? 1 : -1, w = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (o = isNaN(t) ? 1 : 0, s = c) : (s = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -s)) < 1 && (s--, l *= 2), s + u >= 1 ? t += p / l : t += p * Math.pow(2, 1 - u), t * l >= 2 && (s++, l /= 2), s + u >= c ? (o = 0, s = c) : s + u >= 1 ? (o = (t * l - 1) * Math.pow(2, i), s = s + u) : (o = t * Math.pow(2, u - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + m] = o & 255, m += E, o /= 256, i -= 8)
    ;
  for (s = s << i | o, d += i; d > 0; e[r + m] = s & 255, m += E, s /= 256, d -= 8)
    ;
  e[r + m - E] |= w * 128;
};
const os = {
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
for (const [e, t] of Object.entries(os))
  ;
function l_(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8":
      return typeof globalThis.TextDecoder < "u" ? new globalThis.TextDecoder("utf-8").decode(e) : c_(e);
    case "utf-16le":
      return u_(e);
    case "ascii":
      return f_(e);
    case "latin1":
    case "iso-8859-1":
      return d_(e);
    case "windows-1252":
      return p_(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function c_(e) {
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
function u_(e) {
  let t = "";
  for (let r = 0; r < e.length; r += 2)
    t += String.fromCharCode(e[r] | e[r + 1] << 8);
  return t;
}
function f_(e) {
  return String.fromCharCode(...e.map((t) => t & 127));
}
function d_(e) {
  return String.fromCharCode(...e);
}
function p_(e) {
  let t = "";
  for (const r of e)
    r >= 128 && r <= 159 && os[r] ? t += os[r] : t += String.fromCharCode(r);
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
}, Hf = {
  len: 3,
  get(e, t) {
    const r = W(e);
    return (r.getUint16(t) << 8) + r.getUint8(t + 2);
  },
  put(e, t, r) {
    const n = W(e);
    return n.setUint16(t, r >> 8), n.setUint8(t + 2, r & 255), t + 3;
  }
}, J = {
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
}, ls = {
  len: 1,
  get(e, t) {
    return W(e).getInt8(t);
  },
  put(e, t, r) {
    return W(e).setInt8(t, r), t + 1;
  }
}, h_ = {
  len: 2,
  get(e, t) {
    return W(e).getInt16(t);
  },
  put(e, t, r) {
    return W(e).setInt16(t, r), t + 2;
  }
}, m_ = {
  len: 2,
  get(e, t) {
    return W(e).getInt16(t, !0);
  },
  put(e, t, r) {
    return W(e).setInt16(t, r, !0), t + 2;
  }
}, g_ = {
  len: 3,
  get(e, t) {
    const r = Gf.get(e, t);
    return r > 8388607 ? r - 16777216 : r;
  },
  put(e, t, r) {
    const n = W(e);
    return n.setUint8(t, r & 255), n.setUint16(t + 1, r >> 8, !0), t + 3;
  }
}, y_ = {
  len: 3,
  get(e, t) {
    const r = Hf.get(e, t);
    return r > 8388607 ? r - 16777216 : r;
  },
  put(e, t, r) {
    const n = W(e);
    return n.setUint16(t, r >> 8), n.setUint8(t + 2, r & 255), t + 3;
  }
}, qf = {
  len: 4,
  get(e, t) {
    return W(e).getInt32(t);
  },
  put(e, t, r) {
    return W(e).setInt32(t, r), t + 4;
  }
}, w_ = {
  len: 4,
  get(e, t) {
    return W(e).getInt32(t, !0);
  },
  put(e, t, r) {
    return W(e).setInt32(t, r, !0), t + 4;
  }
}, Xf = {
  len: 8,
  get(e, t) {
    return W(e).getBigUint64(t, !0);
  },
  put(e, t, r) {
    return W(e).setBigUint64(t, r, !0), t + 8;
  }
}, x_ = {
  len: 8,
  get(e, t) {
    return W(e).getBigInt64(t, !0);
  },
  put(e, t, r) {
    return W(e).setBigInt64(t, r, !0), t + 8;
  }
}, E_ = {
  len: 8,
  get(e, t) {
    return W(e).getBigUint64(t);
  },
  put(e, t, r) {
    return W(e).setBigUint64(t, r), t + 8;
  }
}, v_ = {
  len: 8,
  get(e, t) {
    return W(e).getBigInt64(t);
  },
  put(e, t, r) {
    return W(e).setBigInt64(t, r), t + 8;
  }
}, T_ = {
  len: 2,
  get(e, t) {
    return Ji(e, t, !1, 10, this.len);
  },
  put(e, t, r) {
    return Qi(e, r, t, !1, 10, this.len), t + this.len;
  }
}, __ = {
  len: 2,
  get(e, t) {
    return Ji(e, t, !0, 10, this.len);
  },
  put(e, t, r) {
    return Qi(e, r, t, !0, 10, this.len), t + this.len;
  }
}, b_ = {
  len: 4,
  get(e, t) {
    return W(e).getFloat32(t);
  },
  put(e, t, r) {
    return W(e).setFloat32(t, r), t + 4;
  }
}, S_ = {
  len: 4,
  get(e, t) {
    return W(e).getFloat32(t, !0);
  },
  put(e, t, r) {
    return W(e).setFloat32(t, r, !0), t + 4;
  }
}, A_ = {
  len: 8,
  get(e, t) {
    return W(e).getFloat64(t);
  },
  put(e, t, r) {
    return W(e).setFloat64(t, r), t + 8;
  }
}, I_ = {
  len: 8,
  get(e, t) {
    return W(e).getFloat64(t, !0);
  },
  put(e, t, r) {
    return W(e).setFloat64(t, r, !0), t + 8;
  }
}, C_ = {
  len: 10,
  get(e, t) {
    return Ji(e, t, !1, 63, this.len);
  },
  put(e, t, r) {
    return Qi(e, r, t, !1, 63, this.len), t + this.len;
  }
}, R_ = {
  len: 10,
  get(e, t) {
    return Ji(e, t, !0, 63, this.len);
  },
  put(e, t, r) {
    return Qi(e, r, t, !0, 63, this.len), t + this.len;
  }
};
class O_ {
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
class Wf {
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
    return l_(n, this.encoding);
  }
}
class D_ extends we {
  constructor(t) {
    super(t, "windows-1252");
  }
}
const aA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnsiStringType: D_,
  Float16_BE: T_,
  Float16_LE: __,
  Float32_BE: b_,
  Float32_LE: S_,
  Float64_BE: A_,
  Float64_LE: I_,
  Float80_BE: C_,
  Float80_LE: R_,
  INT16_BE: h_,
  INT16_LE: m_,
  INT24_BE: y_,
  INT24_LE: g_,
  INT32_BE: qf,
  INT32_LE: w_,
  INT64_BE: v_,
  INT64_LE: x_,
  INT8: ls,
  IgnoreType: O_,
  StringType: we,
  UINT16_BE: Xt,
  UINT16_LE: ie,
  UINT24_BE: Hf,
  UINT24_LE: Gf,
  UINT32_BE: Ti,
  UINT32_LE: J,
  UINT64_BE: E_,
  UINT64_LE: Xf,
  UINT8: Kt,
  Uint8ArrayType: Wf
}, Symbol.toStringTag, { value: "Module" })), yr = {
  LocalFileHeader: 67324752,
  DataDescriptor: 134695760,
  CentralFileHeader: 33639248,
  EndOfCentralDirectory: 101010256
}, gc = {
  get(e) {
    return {
      signature: J.get(e, 0),
      compressedSize: J.get(e, 8),
      uncompressedSize: J.get(e, 12)
    };
  },
  len: 16
}, k_ = {
  get(e) {
    const t = ie.get(e, 6);
    return {
      signature: J.get(e, 0),
      minVersion: ie.get(e, 4),
      dataDescriptor: !!(t & 8),
      compressedMethod: ie.get(e, 8),
      compressedSize: J.get(e, 18),
      uncompressedSize: J.get(e, 22),
      filenameLength: ie.get(e, 26),
      extraFieldLength: ie.get(e, 28),
      filename: null
    };
  },
  len: 30
}, P_ = {
  get(e) {
    return {
      signature: J.get(e, 0),
      nrOfThisDisk: ie.get(e, 4),
      nrOfThisDiskWithTheStart: ie.get(e, 6),
      nrOfEntriesOnThisDisk: ie.get(e, 8),
      nrOfEntriesOfSize: ie.get(e, 10),
      sizeOfCd: J.get(e, 12),
      offsetOfStartOfCd: J.get(e, 16),
      zipFileCommentLength: ie.get(e, 20)
    };
  },
  len: 22
}, N_ = {
  get(e) {
    const t = ie.get(e, 8);
    return {
      signature: J.get(e, 0),
      minVersion: ie.get(e, 6),
      dataDescriptor: !!(t & 8),
      compressedMethod: ie.get(e, 10),
      compressedSize: J.get(e, 20),
      uncompressedSize: J.get(e, 24),
      filenameLength: ie.get(e, 28),
      extraFieldLength: ie.get(e, 30),
      fileCommentLength: ie.get(e, 32),
      relativeOffsetOfLocalHeader: J.get(e, 42),
      filename: null
    };
  },
  len: 46
};
function Vf(e) {
  const t = new Uint8Array(J.len);
  return J.put(t, 0, e), t;
}
const nt = Ir("tokenizer:inflate"), Ba = 256 * 1024, F_ = Vf(yr.DataDescriptor), Jn = Vf(yr.EndOfCentralDirectory);
class Xs {
  constructor(t) {
    this.tokenizer = t, this.syncBuffer = new Uint8Array(Ba);
  }
  async isZip() {
    return await this.peekSignature() === yr.LocalFileHeader;
  }
  peekSignature() {
    return this.tokenizer.peekToken(J);
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
        const s = await this.tokenizer.readToken(N_);
        if (s.signature !== yr.CentralFileHeader)
          throw new Error("Expected Central-File-Header signature");
        s.filename = await this.tokenizer.readToken(new we(s.filenameLength, "utf-8")), await this.tokenizer.ignore(s.extraFieldLength), await this.tokenizer.ignore(s.fileCommentLength), i.push(s), nt(`Add central-directory file-entry: n=${a + 1}/${i.length}: filename=${i[a].filename}`);
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
        let l = Ba;
        nt("Compressed-file-size unknown, scanning for next data-descriptor-signature....");
        let d = -1;
        for (; d < 0 && l === Ba; ) {
          l = await this.tokenizer.peekBuffer(this.syncBuffer, { mayBeLess: !0 }), d = $_(this.syncBuffer.subarray(0, l), F_);
          const c = d >= 0 ? d : l;
          if (a.handler) {
            const u = new Uint8Array(c);
            await this.tokenizer.readBuffer(u), o.push(u);
          } else
            await this.tokenizer.ignore(c);
        }
        nt(`Found data-descriptor-signature at pos=${this.tokenizer.position}`), a.handler && await this.inflate(i, L_(o), a.handler);
      } else
        a.handler ? (nt(`Reading compressed-file-data: ${i.compressedSize} bytes`), s = new Uint8Array(i.compressedSize), await this.tokenizer.readBuffer(s), await this.inflate(i, s, a.handler)) : (nt(`Ignoring compressed-file-data: ${i.compressedSize} bytes`), await this.tokenizer.ignore(i.compressedSize));
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
    nt(`Decompress filename=${t.filename}, compressed-size=${r.length}`);
    const i = await Xs.decompressDeflateRaw(r);
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
    const t = await this.tokenizer.peekToken(J);
    if (t === yr.LocalFileHeader) {
      const r = await this.tokenizer.readToken(k_);
      return r.filename = await this.tokenizer.readToken(new we(r.filenameLength, "utf-8")), r;
    }
    if (t === yr.CentralFileHeader)
      return !1;
    throw t === 3759263696 ? new Error("Encrypted ZIP") : new Error("Unexpected signature");
  }
}
function $_(e, t) {
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
function L_(e) {
  const t = e.reduce((i, a) => i + a.length, 0), r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    r.set(i, n), n += i.length;
  return r;
}
class U_ {
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
const M_ = Object.prototype.toString, B_ = "[object Uint8Array]";
function j_(e, t, r) {
  return e ? e.constructor === t ? !0 : M_.call(e) === r : !1;
}
function z_(e) {
  return j_(e, Uint8Array, B_);
}
function G_(e) {
  if (!z_(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
new globalThis.TextDecoder("utf8");
function H_(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
new globalThis.TextEncoder();
const q_ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function sA(e) {
  G_(e);
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += q_[e[r]];
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
  if (H_(e), e.length % 2 !== 0)
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
function cs(e) {
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
function X_(e, t) {
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
function W_(e, t = 0) {
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
const V_ = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, Y_ = [
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
], K_ = [
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
], ja = 4100;
async function Yf(e, t) {
  return new J_(t).fromBuffer(e);
}
function za(e) {
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
class J_ {
  constructor(t) {
    // Detections with a high degree of certainty in identifying the correct file type
    Ke(this, "detectConfident", async (t) => {
      if (this.buffer = new Uint8Array(ja), t.fileInfo.size === void 0 && (t.fileInfo.size = Number.MAX_SAFE_INTEGER), this.tokenizer = t, await t.peekBuffer(this.buffer, { length: 32, mayBeLess: !0 }), this.check([66, 77]))
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
        const n = new U_(t).inflate();
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
        const r = await t.readToken(V_);
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
        return await new Xs(t).unzip((n) => {
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
                  r = za(a);
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
                    a.includes(`ContentType="${o}"`) && (r = za(o));
                  } else {
                    a = a.slice(0, Math.max(0, s));
                    const o = a.lastIndexOf('"'), l = a.slice(Math.max(0, o + 1));
                    r = za(l);
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
          if (!(n instanceof Re))
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
            id: cs(c),
            len: cs(u)
          };
        }
        async function i(o) {
          for (; o > 0; ) {
            const l = await n();
            if (l.id === 17026)
              return (await t.readToken(new we(l.len))).replaceAll(/\00.*$/g, "");
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
            length: await t.readToken(qf),
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
            size: Number(await t.readToken(Xf))
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
      if (await t.peekBuffer(this.buffer, { length: Math.min(512, t.fileInfo.size), mayBeLess: !0 }), this.checkString("ustar", { offset: 257 }) && (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 })) || this.check([0, 0, 0, 0, 0, 0], { offset: 257 }) && W_(this.buffer))
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
    Ke(this, "detectImprecise", async (t) => {
      if (this.buffer = new Uint8Array(ja), await t.peekBuffer(this.buffer, { length: Math.min(8, t.fileInfo.size), mayBeLess: !0 }), this.check([0, 0, 1, 186]) || this.check([0, 0, 1, 179]))
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
      return this.fromTokenizer(ss(r, this.tokenizerOptions));
  }
  async fromBlob(t) {
    const r = s_(t, this.tokenizerOptions);
    try {
      return await this.fromTokenizer(r);
    } finally {
      await r.close();
    }
  }
  async fromStream(t) {
    const r = a_(t, this.tokenizerOptions);
    try {
      return await this.fromTokenizer(r);
    } finally {
      await r.close();
    }
  }
  async toDetectionStream(t, r) {
    const { sampleSize: n = ja } = r;
    let i, a;
    const s = t.getReader({ mode: "byob" });
    try {
      const { value: d, done: c } = await s.read(new Uint8Array(n));
      if (a = d, !c && d)
        try {
          i = await this.fromBuffer(d.subarray(0, n));
        } catch (u) {
          if (!(u instanceof Re))
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
    return it(this.buffer, t, r);
  }
  checkString(t, r) {
    return this.check(X_(t, r == null ? void 0 : r.encoding), r);
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
    const r = (t ? Xt : ie).get(this.buffer, 2), n = (t ? Ti : J).get(this.buffer, 4);
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
new Set(Y_);
new Set(K_);
var Ws = {};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
var wc = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g, Q_ = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/, Kf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/, Z_ = /\\([\u000b\u0020-\u00ff])/g, eb = /([\\"])/g, Jf = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
Ws.format = tb;
Ws.parse = rb;
function tb(e) {
  if (!e || typeof e != "object")
    throw new TypeError("argument obj is required");
  var t = e.parameters, r = e.type;
  if (!r || !Jf.test(r))
    throw new TypeError("invalid type");
  var n = r;
  if (t && typeof t == "object")
    for (var i, a = Object.keys(t).sort(), s = 0; s < a.length; s++) {
      if (i = a[s], !Kf.test(i))
        throw new TypeError("invalid parameter name");
      n += "; " + i + "=" + ib(t[i]);
    }
  return n;
}
function rb(e) {
  if (!e)
    throw new TypeError("argument string is required");
  var t = typeof e == "object" ? nb(e) : e;
  if (typeof t != "string")
    throw new TypeError("argument string is required to be a string");
  var r = t.indexOf(";"), n = r !== -1 ? t.slice(0, r).trim() : t.trim();
  if (!Jf.test(n))
    throw new TypeError("invalid media type");
  var i = new ab(n.toLowerCase());
  if (r !== -1) {
    var a, s, o;
    for (wc.lastIndex = r; s = wc.exec(t); ) {
      if (s.index !== r)
        throw new TypeError("invalid parameter format");
      r += s[0].length, a = s[1].toLowerCase(), o = s[2], o.charCodeAt(0) === 34 && (o = o.slice(1, -1), o.indexOf("\\") !== -1 && (o = o.replace(Z_, "$1"))), i.parameters[a] = o;
    }
    if (r !== t.length)
      throw new TypeError("invalid parameter format");
  }
  return i;
}
function nb(e) {
  var t;
  if (typeof e.getHeader == "function" ? t = e.getHeader("content-type") : typeof e.headers == "object" && (t = e.headers && e.headers["content-type"]), typeof t != "string")
    throw new TypeError("content-type header is missing from object");
  return t;
}
function ib(e) {
  var t = String(e);
  if (Kf.test(t))
    return t;
  if (t.length > 0 && !Q_.test(t))
    throw new TypeError("invalid parameter value");
  return '"' + t.replace(eb, "\\$1") + '"';
}
function ab(e) {
  this.parameters = /* @__PURE__ */ Object.create(null), this.type = e;
}
/*!
 * media-typer
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
var sb = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/, ob = lb;
function lb(e) {
  if (!e)
    throw new TypeError("argument string is required");
  if (typeof e != "string")
    throw new TypeError("argument string is required to be a string");
  var t = sb.exec(e.toLowerCase());
  if (!t)
    throw new TypeError("invalid media type");
  var r = t[1], n = t[2], i, a = n.lastIndexOf("+");
  return a !== -1 && (i = n.substr(a + 1), n = n.substr(0, a)), new cb(r, n, i);
}
function cb(e, t, r) {
  this.type = e, this.subtype = t, this.suffix = r;
}
const lA = {
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
}, ub = {
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
class Qf extends vn("CouldNotDetermineFileTypeError") {
}
class Zf extends vn("UnsupportedFileTypeError") {
}
class fb extends vn("UnexpectedFileContentError") {
  constructor(t, r) {
    super(r), this.fileType = t;
  }
  // Override toString to include file type information.
  toString() {
    return `${this.name} (FileType: ${this.fileType}): ${this.message}`;
  }
}
class Vs extends vn("FieldDecodingError") {
}
class ed extends vn("InternalParserError") {
}
const db = (e) => class extends fb {
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
function pb(e) {
  const t = e.indexOf("\0");
  return t === -1 ? e : e.substr(0, t);
}
function hb(e) {
  const t = e.length;
  if (t & 1)
    throw new Vs("Buffer length must be even");
  for (let r = 0; r < t; r += 2) {
    const n = e[r];
    e[r] = e[r + 1], e[r + 1] = n;
  }
  return e;
}
function us(e, t) {
  if (e[0] === 255 && e[1] === 254)
    return us(e.subarray(2), t);
  if (t === "utf-16le" && e[0] === 254 && e[1] === 255) {
    if (e.length & 1)
      throw new Vs("Expected even number of octets for 16-bit unicode string");
    return us(hb(e), t);
  }
  return new we(e.length, t).get(e, 0);
}
function uA(e) {
  return e = e.replace(/^\x00+/g, ""), e = e.replace(/\x00+$/g, ""), e;
}
function td(e, t, r, n) {
  const i = t + ~~(r / 8), a = r % 8;
  let s = e[i];
  s &= 255 >> a;
  const o = 8 - a, l = n - o;
  return l < 0 ? s >>= 8 - a - n : l > 0 && (s <<= l, s |= td(e, t, r + o, l)), s;
}
function fA(e, t, r) {
  return td(e, t, r, 1) === 1;
}
function mb(e) {
  const t = [];
  for (let r = 0, n = e.length; r < n; r++) {
    const i = Number(e.charCodeAt(r)).toString(16);
    t.push(i.length === 1 ? `0${i}` : i);
  }
  return t.join(" ");
}
function gb(e) {
  return 10 * Math.log10(e);
}
function yb(e) {
  return 10 ** (e / 10);
}
function wb(e) {
  const t = e.split(" ").map((r) => r.trim().toLowerCase());
  if (t.length >= 1) {
    const r = Number.parseFloat(t[0]);
    return t.length === 2 && t[1] === "db" ? {
      dB: r,
      ratio: yb(r)
    } : {
      dB: gb(r),
      ratio: r
    };
  }
}
function dA(e) {
  if (e.length === 0)
    throw new Error("decodeUintBE: empty Uint8Array");
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength);
  return cs(t);
}
const pA = {
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
}, rd = {
  lyrics: 1
}, nd = {
  notSynchronized: 0,
  milliseconds: 2
}, xb = {
  get: (e, t) => e[t + 3] & 127 | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
  len: 4
}, hA = {
  len: 10,
  get: (e, t) => ({
    // ID3v2/file identifier   "ID3"
    fileIdentifier: new we(3, "ascii").get(e, t),
    // ID3v2 versionIndex
    version: {
      major: ls.get(e, t + 3),
      revision: ls.get(e, t + 4)
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
    size: xb.get(e, t + 6)
  })
}, mA = {
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
}, Eb = {
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
}, vb = {
  len: 4,
  get: (e, t) => ({
    encoding: Eb.get(e, t),
    language: new we(3, "latin1").get(e, t + 1)
  })
}, gA = {
  len: 6,
  get: (e, t) => {
    const r = vb.get(e, t);
    return {
      encoding: r.encoding,
      language: r.language,
      timeStampFormat: Kt.get(e, t + 4),
      contentType: Kt.get(e, t + 5)
    };
  }
}, P = {
  multiple: !1
}, _i = {
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
function Tb(e) {
  return _i[e] && !_i[e].multiple;
}
function _b(e) {
  return !_i[e].multiple || _i[e].unique || !1;
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
const bb = {
  title: "title",
  artist: "artist",
  album: "album",
  year: "year",
  comment: "comment",
  track: "track",
  genre: "genre"
};
class Sb extends Ge {
  constructor() {
    super(["ID3v1"], bb);
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
const Ab = {
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
class Ys extends Tn {
  static toRating(t) {
    return {
      source: t.email,
      rating: t.rating > 0 ? (t.rating - 1) / 254 * Ge.maxRatingScore : void 0
    };
  }
  constructor() {
    super(["ID3v2.3", "ID3v2.4"], Ab);
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
          n.owner_identifier === "http://musicbrainz.org" && (t.id += `:${n.owner_identifier}`, t.value = us(n.identifier, "latin1"));
        }
        break;
      case "PRIV":
        {
          const n = t.value;
          switch (n.owner_identifier) {
            case "AverageLevel":
            case "PeakValue":
              t.id += `:${n.owner_identifier}`, t.value = n.data.length === 4 ? J.get(n.data, 0) : null, t.value === null && r.addWarning("Failed to parse PRIV:PeakValue");
              break;
            default:
              r.addWarning(`Unknown PRIV owner-identifier: ${n.data}`);
          }
        }
        break;
      case "POPM":
        t.value = Ys.toRating(t.value);
        break;
    }
  }
}
const Ib = {
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
class Ks extends Ge {
  static toRating(t) {
    return {
      rating: Number.parseFloat(t + 1) / 5
    };
  }
  constructor() {
    super(["asf"], Ib);
  }
  postMap(t) {
    switch (t.id) {
      case "WM/SharedUserRating": {
        const r = t.id.split(":");
        t.value = Ks.toRating(t.value), t.id = r[0];
        break;
      }
    }
  }
}
const Cb = {
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
class Rb extends Tn {
  constructor() {
    super(["ID3v2.2"], Cb);
  }
}
const Ob = {
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
class Db extends Tn {
  constructor() {
    super(["APEv2"], Ob);
  }
}
const kb = {
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
class Ec extends Tn {
  constructor() {
    super([Pb], kb);
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
const Nb = {
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
class bi extends Ge {
  static toRating(t, r, n) {
    return {
      source: t ? t.toLowerCase() : void 0,
      rating: Number.parseFloat(r) / n * Ge.maxRatingScore
    };
  }
  constructor() {
    super(["vorbis"], Nb);
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
const Fb = {
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
class $b extends Ge {
  constructor() {
    super(["exif"], Fb);
  }
}
const Lb = {
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
class Ub extends Tn {
  constructor() {
    super(["matroska"], Lb);
  }
}
const Mb = {
  NAME: "title",
  AUTH: "artist",
  "(c) ": "copyright",
  ANNO: "comment"
};
class Bb extends Ge {
  constructor() {
    super(["AIFF"], Mb);
  }
}
class jb {
  constructor() {
    this.tagMappers = {}, [
      new Sb(),
      new Rb(),
      new Ys(),
      new Ec(),
      new Ec(),
      new bi(),
      new Db(),
      new Ks(),
      new $b(),
      new Ub(),
      new Bb()
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
    throw new ed(`No generic tag mapper defined for tag-format: ${t}`);
  }
  registerTagMapper(t) {
    for (const r of t.tagTypes)
      this.tagMappers[r] = t;
  }
}
const fs = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;
function zb(e) {
  return fs.test(e) ? Hb(e) : Gb(e);
}
function Gb(e) {
  return {
    contentType: rd.lyrics,
    timeStampFormat: nd.notSynchronized,
    text: e.trim(),
    syncText: []
  };
}
function Hb(e) {
  const t = e.split(`
`), r = [];
  for (const n of t) {
    const i = n.match(fs);
    if (i) {
      const a = Number.parseInt(i[1], 10), s = Number.parseInt(i[2], 10), o = i[3].length === 3 ? Number.parseInt(i[3], 10) : Number.parseInt(i[3], 10) * 10, l = (a * 60 + s) * 1e3 + o, d = n.replace(fs, "").trim();
      r.push({ timestamp: l, text: d });
    }
  }
  return {
    contentType: rd.lyrics,
    timeStampFormat: nd.milliseconds,
    text: r.map((n) => n.text).join(`
`),
    syncText: r
  };
}
const jt = Ir("music-metadata:collector"), qb = ["matroska", "APEv2", "vorbis", "ID3v2.4", "ID3v2.3", "ID3v2.2", "exif", "asf", "iTunes", "AIFF", "ID3v1"];
class Xb {
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
    }, this.commonOrigin = {}, this.originPriority = {}, this.tagMapper = new jb(), this.opts = t;
    let r = 1;
    for (const n of qb)
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
    jt(`streamInfo: type=${t.type ? ub[t.type] : "?"}, codec=${t.codecName}`), this.format.trackInfo.push(t);
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
          const n = (this.common.artists || []).concat([r.value]), a = { id: "artist", value: Wb(n) };
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
        r.value = wb(r.value);
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
        typeof r.value == "string" && (r.value = zb(r.value));
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
        const r = await Yf(Uint8Array.from(t.data));
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
    if (Tb(r.id))
      if (i <= n)
        this.common[r.id] = r.value, this.commonOrigin[r.id] = i;
      else
        return jt(`Ignore native tag (singleton): ${t}.${r.id} = ${r.value}`);
    else if (i === n)
      !_b(r.id) || this.common[r.id].indexOf(r.value) === -1 ? this.common[r.id].push(r.value) : jt(`Ignore duplicate value: ${t}.${r.id} = ${r.value}`);
    else if (i < n)
      this.common[r.id] = [r.value], this.commonOrigin[r.id] = i;
    else
      return jt(`Ignore native tag (list): ${t}.${r.id} = ${r.value}`);
    (a = this.opts) != null && a.observer && this.opts.observer({ metadata: this, tag: { type: "common", id: r.id, value: r.value } });
  }
}
function Wb(e) {
  return e.length > 2 ? `${e.slice(0, e.length - 1).join(", ")} & ${e[e.length - 1]}` : e.join(" & ");
}
const Vb = {
  parserType: "mpeg",
  extensions: [".mp2", ".mp3", ".m2a", ".aac", "aacp"],
  mimeTypes: ["audio/mpeg", "audio/mp3", "audio/aacs", "audio/aacp"],
  async load() {
    return (await import("./MpegParser-D6zqD6eS.js")).MpegParser;
  }
}, Yb = {
  parserType: "apev2",
  extensions: [".ape"],
  mimeTypes: ["audio/ape", "audio/monkeys-audio"],
  async load() {
    return (await Promise.resolve().then(() => AS)).APEv2Parser;
  }
}, Kb = {
  parserType: "asf",
  extensions: [".asf"],
  mimeTypes: ["audio/ms-wma", "video/ms-wmv", "audio/ms-asf", "video/ms-asf", "application/vnd.ms-asf"],
  async load() {
    return (await import("./AsfParser-Bnhlp7pZ.js")).AsfParser;
  }
}, Jb = {
  parserType: "dsdiff",
  extensions: [".dff"],
  mimeTypes: ["audio/dsf", "audio/dsd"],
  async load() {
    return (await import("./DsdiffParser-Dl6Ah65L.js")).DsdiffParser;
  }
}, Qb = {
  parserType: "aiff",
  extensions: [".aif", "aiff", "aifc"],
  mimeTypes: ["audio/aiff", "audio/aif", "audio/aifc", "application/aiff"],
  async load() {
    return (await import("./AiffParser-CrATvAqK.js")).AIFFParser;
  }
}, Zb = {
  parserType: "dsf",
  extensions: [".dsf"],
  mimeTypes: ["audio/dsf"],
  async load() {
    return (await import("./DsfParser-C3swQxEV.js")).DsfParser;
  }
}, eS = {
  parserType: "flac",
  extensions: [".flac"],
  mimeTypes: ["audio/flac"],
  async load() {
    return (await import("./FlacParser-GBltNXx6.js").then((e) => e.d)).FlacParser;
  }
}, tS = {
  parserType: "matroska",
  extensions: [".mka", ".mkv", ".mk3d", ".mks", "webm"],
  mimeTypes: ["audio/matroska", "video/matroska", "audio/webm", "video/webm"],
  async load() {
    return (await import("./MatroskaParser-B-OGtH_i.js")).MatroskaParser;
  }
}, rS = {
  parserType: "mp4",
  extensions: [".mp4", ".m4a", ".m4b", ".m4pa", "m4v", "m4r", "3gp", ".mov", ".movie", ".qt"],
  mimeTypes: ["audio/mp4", "audio/m4a", "video/m4v", "video/mp4", "video/quicktime"],
  async load() {
    return (await import("./MP4Parser-BtKgbnFa.js")).MP4Parser;
  }
}, nS = {
  parserType: "musepack",
  extensions: [".mpc"],
  mimeTypes: ["audio/musepack"],
  async load() {
    return (await import("./MusepackParser-_5tgiWRj.js")).MusepackParser;
  }
}, iS = {
  parserType: "ogg",
  extensions: [".ogg", ".ogv", ".oga", ".ogm", ".ogx", ".opus", ".spx"],
  mimeTypes: ["audio/ogg", "audio/opus", "audio/speex", "video/ogg"],
  // RFC 7845, RFC 6716, RFC 5574
  async load() {
    return (await import("./OggParser-BqcCZsLe.js")).OggParser;
  }
}, aS = {
  parserType: "wavpack",
  extensions: [".wv", ".wvp"],
  mimeTypes: ["audio/wavpack"],
  async load() {
    return (await import("./WavPackParser-BMoULB69.js")).WavPackParser;
  }
}, sS = {
  parserType: "riff",
  extensions: [".wav", "wave", ".bwf"],
  mimeTypes: ["audio/vnd.wave", "audio/wav", "audio/wave"],
  async load() {
    return (await import("./WaveParser-aYaEdDXc.js")).WaveParser;
  }
}, zt = Ir("music-metadata:parser:factory");
function oS(e) {
  const t = Ws.parse(e), r = ob(t.type);
  return {
    type: r.type,
    subtype: r.subtype,
    suffix: r.suffix,
    parameters: t.parameters
  };
}
class lS {
  constructor() {
    this.parsers = [], [
      eS,
      Vb,
      Yb,
      rS,
      tS,
      sS,
      iS,
      Kb,
      Qb,
      aS,
      nS,
      Zb,
      Jb
    ].forEach((t) => {
      this.registerParser(t);
    });
  }
  registerParser(t) {
    this.parsers.push(t);
  }
  async parse(t, r, n) {
    if (t.supportsRandomAccess() ? (zt("tokenizer supports random-access, scanning for appending headers"), await OS(t, n)) : zt("tokenizer does not support random-access, cannot scan for appending headers"), !r) {
      const o = new Uint8Array(4100);
      if (t.fileInfo.mimeType && (r = this.findLoaderForContentType(t.fileInfo.mimeType)), !r && t.fileInfo.path && (r = this.findLoaderForExtension(t.fileInfo.path)), !r) {
        zt("Guess parser on content..."), await t.peekBuffer(o, { mayBeLess: !0 });
        const l = await Yf(o, { mpegOffsetTolerance: 10 });
        if (!l || !l.mime)
          throw new Qf("Failed to determine audio format");
        if (zt(`Guessed file type is mime=${l.mime}, extension=${l.ext}`), r = this.findLoaderForContentType(l.mime), !r)
          throw new Zf(`Guessed MIME-type not supported: ${l.mime}`);
      }
    }
    zt(`Loading ${r.parserType} parser...`);
    const i = new Xb(n), a = await r.load(), s = new a(i, t, n ?? {});
    return zt(`Parser ${r.parserType} loaded`), await s.parse(), i.format.trackInfo && (i.format.hasAudio === void 0 && i.setFormat("hasAudio", !!i.format.trackInfo.find((o) => o.type === dt.audio)), i.format.hasVideo === void 0 && i.setFormat("hasVideo", !!i.format.trackInfo.find((o) => o.type === dt.video))), i.toCommonMetadata();
  }
  /**
   * @param filePath - Path, filename or extension to audio file
   * @return Parser submodule name
   */
  findLoaderForExtension(t) {
    if (!t)
      return;
    const r = cS(t).toLocaleLowerCase() || t;
    return this.parsers.find((n) => n.extensions.indexOf(r) !== -1);
  }
  findLoaderForContentType(t) {
    let r;
    if (!t)
      return;
    try {
      r = oS(t);
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
function cS(e) {
  const t = e.lastIndexOf(".");
  return t === -1 ? "" : e.substring(t);
}
class id {
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
const ad = {
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
}, sd = {};
for (const [e, t] of Object.entries(ad))
  sd[t] = Number.parseInt(e, 10);
let Qn, Zn;
function uS() {
  if (!(typeof globalThis.TextDecoder > "u"))
    return Qn ?? (Qn = new globalThis.TextDecoder("utf-8"));
}
function fS() {
  if (!(typeof globalThis.TextEncoder > "u"))
    return Zn ?? (Zn = new globalThis.TextEncoder());
}
const Zt = 32 * 1024;
function Zi(e, t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = uS();
      return r ? r.decode(e) : pS(e);
    }
    case "utf-16le":
      return hS(e);
    case "us-ascii":
    case "ascii":
      return mS(e);
    case "latin1":
    case "iso-8859-1":
      return gS(e);
    case "windows-1252":
      return yS(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function dS(e = "", t = "utf-8") {
  switch (t.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const r = fS();
      return r ? r.encode(e) : wS(e);
    }
    case "utf-16le":
      return xS(e);
    case "us-ascii":
    case "ascii":
      return ES(e);
    case "latin1":
    case "iso-8859-1":
      return vS(e);
    case "windows-1252":
      return TS(e);
    default:
      throw new RangeError(`Encoding '${t}' not supported`);
  }
}
function pS(e) {
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
function hS(e) {
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
function mS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Zt) {
    const n = Math.min(e.length, r + Zt), i = new Array(n - r);
    for (let a = r, s = 0; a < n; a++, s++)
      i[s] = e[a] & 127;
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function gS(e) {
  const t = [];
  for (let r = 0; r < e.length; r += Zt) {
    const n = Math.min(e.length, r + Zt), i = new Array(n - r);
    for (let a = r, s = 0; a < n; a++, s++)
      i[s] = e[a];
    t.push(String.fromCharCode.apply(null, i));
  }
  return t.join("");
}
function yS(e) {
  const t = [];
  let r = "";
  for (let n = 0; n < e.length; n++) {
    const i = e[n], a = i >= 128 && i <= 159 ? ad[i] : void 0;
    r += a ?? String.fromCharCode(i), r.length >= Zt && (t.push(r), r = "");
  }
  return r && t.push(r), t.join("");
}
function wS(e) {
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
function xS(e) {
  const t = new Uint8Array(e.length * 2);
  for (let r = 0; r < e.length; r++) {
    const n = e.charCodeAt(r), i = r * 2;
    t[i] = n & 255, t[i + 1] = n >>> 8;
  }
  return t;
}
function ES(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r) & 127;
  return t;
}
function vS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r) & 255;
  return t;
}
function TS(e) {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++) {
    const n = e[r], i = n.charCodeAt(0);
    if (i <= 255) {
      t[r] = i;
      continue;
    }
    const a = sd[n];
    t[r] = a !== void 0 ? a : 63;
  }
  return t;
}
const _S = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/, od = {
  len: 4,
  get: (e, t) => {
    const r = Zi(e.subarray(t, t + od.len), "latin1");
    if (!r.match(_S))
      throw new Vs(`FourCC contains invalid characters: ${mb(r)} "${r}"`);
    return r;
  },
  put: (e, t, r) => {
    const n = dS(r, "latin1");
    if (n.length !== 4)
      throw new ed("Invalid length");
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
    version: J.get(e, t + 4) / 1e3,
    // the number of descriptor bytes (allows later expansion of this header)
    descriptorBytes: J.get(e, t + 8),
    // the number of header APE_HEADER bytes
    headerBytes: J.get(e, t + 12),
    // the number of header APE_HEADER bytes
    seekTableBytes: J.get(e, t + 16),
    // the number of header data bytes (from original file)
    headerDataBytes: J.get(e, t + 20),
    // the number of bytes of APE frame data
    apeFrameDataBytes: J.get(e, t + 24),
    // the high order number of APE frame data bytes
    apeFrameDataBytesHigh: J.get(e, t + 28),
    // the terminating data of the file (not including tag data)
    terminatingDataBytes: J.get(e, t + 32),
    // the MD5 hash of the file (see notes for usage... it's a little tricky)
    fileMD5: new Wf(16).get(e, t + 36)
  })
}, bS = {
  len: 24,
  get: (e, t) => ({
    // the compression level (see defines I.E. COMPRESSION_LEVEL_FAST)
    compressionLevel: ie.get(e, t),
    // any format flags (for future use)
    formatFlags: ie.get(e, t + 2),
    // the number of audio blocks in one frame
    blocksPerFrame: J.get(e, t + 4),
    // the number of audio blocks in the final frame
    finalFrameBlocks: J.get(e, t + 8),
    // the total number of frames
    totalFrames: J.get(e, t + 12),
    // the bits per sample (typically 16)
    bitsPerSample: ie.get(e, t + 16),
    // the number of channels (1 or 2)
    channel: ie.get(e, t + 18),
    // the sample rate (typically 44100)
    sampleRate: J.get(e, t + 20)
  })
}, ze = {
  len: 32,
  get: (e, t) => ({
    // should equal 'APETAGEX'
    ID: new we(8, "ascii").get(e, t),
    // equals CURRENT_APE_TAG_VERSION
    version: J.get(e, t + 8),
    // the complete size of the tag, including this footer (excludes header)
    size: J.get(e, t + 12),
    // the number of fields in the tag
    fields: J.get(e, t + 16),
    // reserved for later use (must be zero),
    flags: ld(J.get(e, t + 20))
  })
}, Ga = {
  len: 8,
  get: (e, t) => ({
    // Length of assigned value in bytes
    size: J.get(e, t),
    // reserved for later use (must be zero),
    flags: ld(J.get(e, t + 4))
  })
};
function ld(e) {
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
const Et = Ir("music-metadata:parser:APEv2"), Tc = "APEv2", _c = "APETAGEX";
class ci extends db("APEv2") {
}
function SS(e, t, r) {
  return new At(e, t, r).tryParseApeHeader();
}
class At extends id {
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
    const n = new Uint8Array(ze.len), i = t.position;
    if (r <= ze.len) {
      Et(`Offset is too small to read APE footer: offset=${r}`);
      return;
    }
    if (r > ze.len) {
      await t.readBuffer(n, { position: r - ze.len }), t.setPosition(i);
      const a = ze.get(n, 0);
      if (a.ID === "APETAGEX")
        return a.flags.isHeader ? Et(`APE Header found at offset=${r - ze.len}`) : (Et(`APE Footer found at offset=${r - ze.len}`), r -= a.size), { footer: a, offset: r };
    }
  }
  static parseTagFooter(t, r, n) {
    const i = ze.get(r, r.length - ze.len);
    if (i.ID !== _c)
      throw new ci("Unexpected APEv2 Footer ID preamble value");
    return ss(r), new At(t, ss(r), n).parseTags(i);
  }
  /**
   * Parse APEv1 / APEv2 header if header signature found
   */
  async tryParseApeHeader() {
    if (this.tokenizer.fileInfo.size && this.tokenizer.fileInfo.size - this.tokenizer.position < ze.len) {
      Et("No APEv2 header found, end-of-file reached");
      return;
    }
    const t = await this.tokenizer.peekToken(ze);
    if (t.ID === _c)
      return await this.tokenizer.ignore(ze.len), this.parseTags(t);
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
    let n = t.size - ze.len;
    Et(`Parse APE tags at offset=${this.tokenizer.position}, size=${n}`);
    for (let i = 0; i < t.fields; i++) {
      if (n < Ga.len) {
        this.metadata.addWarning(`APEv2 Tag-header: ${t.fields - i} items remaining, but no more tag data to read.`);
        break;
      }
      const a = await this.tokenizer.readToken(Ga);
      n -= Ga.len + a.size, await this.tokenizer.peekBuffer(r, { length: Math.min(r.length, n) });
      let s = xc(r, 0, r.length);
      const o = await this.tokenizer.readToken(new we(s, "ascii"));
      switch (await this.tokenizer.ignore(1), n -= o.length + 1, a.flags.dataType) {
        case ei.text_utf8: {
          const d = (await this.tokenizer.readToken(new we(a.size, "utf8"))).split(/\x00/g);
          await Promise.all(d.map((c) => this.metadata.addTag(Tc, o, c)));
          break;
        }
        case ei.binary:
          if (this.options.skipCovers)
            await this.tokenizer.ignore(a.size);
          else {
            const l = new Uint8Array(a.size);
            await this.tokenizer.readBuffer(l), s = xc(l, 0, l.length);
            const d = Zi(l.subarray(0, s), "utf-8"), c = l.subarray(s + 1);
            await this.metadata.addTag(Tc, o, {
              description: d,
              data: c
            });
          }
          break;
        case ei.external_info:
          Et(`Ignore external info ${o}`), await this.tokenizer.ignore(a.size);
          break;
        case ei.reserved:
          Et(`Ignore external info ${o}`), this.metadata.addWarning(`APEv2 header declares a reserved datatype for "${o}"`), await this.tokenizer.ignore(a.size);
          break;
      }
    }
  }
  async parseDescriptorExpansion(t) {
    return await this.tokenizer.ignore(t), this.parseHeader();
  }
  async parseHeader() {
    const t = await this.tokenizer.readToken(bS);
    if (this.metadata.setFormat("lossless", !0), this.metadata.setFormat("container", "Monkey's Audio"), this.metadata.setFormat("bitsPerSample", t.bitsPerSample), this.metadata.setFormat("sampleRate", t.sampleRate), this.metadata.setFormat("numberOfChannels", t.channel), this.metadata.setFormat("duration", At.calculateDuration(t)), !this.ape.descriptor)
      throw new ci("Missing APE descriptor");
    return {
      forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes
    };
  }
}
const AS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  APEv2Parser: At,
  ApeContentError: ci,
  tryParseApeHeader: SS
}, Symbol.toStringTag, { value: "Module" })), ri = Ir("music-metadata:parser:ID3v1"), bc = [
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
    this.len = t, this.stringType = new we(t, "latin1");
  }
  get(t, r) {
    let n = this.stringType.get(t, r);
    return n = pb(n), n = n.trim(), n.length > 0 ? n : void 0;
  }
}
class cd extends id {
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
      const i = cd.getGenre(r.genre);
      i && await this.addTag("genre", i);
    } else
      ri("ID3v1 header not found at: pos=%s", this.tokenizer.fileInfo.size - ni.len);
  }
  async addTag(t, r) {
    await this.metadata.addTag("ID3v1", t, r);
  }
}
async function IS(e) {
  if (e.fileInfo.size >= 128) {
    const t = new Uint8Array(3), r = e.position;
    return await e.readBuffer(t, { position: e.fileInfo.size - 128 }), e.setPosition(r), Zi(t, "latin1") === "TAG";
  }
  return !1;
}
const CS = "LYRICS200";
async function RS(e) {
  const t = e.fileInfo.size;
  if (t >= 143) {
    const r = new Uint8Array(15), n = e.position;
    await e.readBuffer(r, { position: t - 143 }), e.setPosition(n);
    const i = Zi(r, "latin1");
    if (i.substring(6) === CS)
      return Number.parseInt(i.substring(0, 6), 10) + 15;
  }
  return 0;
}
async function OS(e, t = {}) {
  let r = e.fileInfo.size;
  if (await IS(e)) {
    r -= 128;
    const n = await RS(e);
    r -= n;
  }
  t.apeHeader = await At.findApeFooterOffset(e, r);
}
const Sc = Ir("music-metadata:parser");
async function Ac(e, t = {}) {
  Sc(`parseFile: ${e}`);
  const r = await o_(e), n = new lS();
  try {
    const i = n.findLoaderForExtension(e);
    i || Sc("Parser could not be determined by file extension");
    try {
      return await n.parse(r, i, t);
    } catch (a) {
      throw (a instanceof Qf || a instanceof Zf) && (a.message += `: ${e}`), a;
    }
  } finally {
    await r.close();
  }
}
class DS {
  constructor() {
    Ke(this, "client", null);
    Ke(this, "player", Ap());
    Ke(this, "currentResource", null);
    Ke(this, "currentConnection", null);
    Ke(this, "streamInput", null);
    Ke(this, "isConnected", !1);
    Ke(this, "currentGuildId", null);
    Ke(this, "currentChannelId", null);
    this.player.on("error", (t) => {
      console.error("[DiscordBot] Audio Player Error:", t.message);
    });
  }
  async login(t) {
    return this.client && (await this.disconnect(), await this.client.destroy()), this.client = new Sp({
      intents: [
        yo.Guilds,
        yo.GuildVoiceStates
      ]
    }), new Promise((r, n) => {
      if (!this.client) return n("Client init failed");
      const i = setTimeout(() => {
        n(new Error("Login timed out"));
      }, 1e4);
      this.client.once("ready", async (a) => {
        clearTimeout(i), this.isConnected = !0, r({
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
    return r.channels.cache.filter((i) => i.type === wo.GuildVoice).map((i) => ({
      id: i.id,
      name: i.name,
      userLimit: i.userLimit,
      members: i.members.map((a) => a.user.tag)
    })).sort((i, a) => i.name.localeCompare(a.name));
  }
  async joinChannel(t, r) {
    if (!this.client || !this.isConnected) throw new Error("Bot not connected");
    const n = this.client.guilds.cache.get(t);
    if (!n) throw new Error("Guild not found");
    const i = n.channels.cache.get(r);
    if (!i || i.type !== wo.GuildVoice) throw new Error("Invalid channel");
    try {
      return this.currentConnection = Ip({
        channelId: r,
        guildId: t,
        adapterCreator: n.voiceAdapterCreator
      }), this.currentConnection.subscribe(this.player), this.currentGuildId = t, this.currentChannelId = r, !0;
    } catch (a) {
      throw a;
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
  async playFile(t, r) {
    var n, i, a;
    try {
      if (!this.currentConnection)
        throw new Error("No active voice connection. Please join a channel first.");
      const s = this.currentConnection.state.status;
      if (s === "destroyed" || s === "disconnected")
        throw new Error(`Voice connection is ${s}. Cannot play audio.`);
      if (!r) {
        const p = Nn(t, {
          metadata: { title: t },
          inlineVolume: !0
        });
        this.currentResource = p, (n = p.volume) == null || n.setVolume(1), this.player.play(p);
        return;
      }
      const { spawn: o } = await import("node:child_process"), d = o(r, [
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
      ]);
      let c = !1;
      d.on("error", (p) => {
        console.error("[DiscordBot] FFmpeg Spawn Error:", p);
      }), d.on("close", () => {
      }), (i = d.stdout) == null || i.on("data", () => {
        c || (c = !0);
      });
      const u = Nn(d.stdout, {
        inputType: la.Raw,
        metadata: {
          title: t
        },
        inlineVolume: !0
      });
      this.currentResource = u, (a = u.volume) == null || a.setVolume(1), this.player.play(u);
    } catch (s) {
      throw s;
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
    return this.currentResource && this.currentResource.volume ? (this.currentResource.volume.setVolume(r), !0) : !1;
  }
  async playReceiverStream(t) {
    var r, n;
    if (!this.currentConnection) throw new Error("Not connected");
    if (this.streamInput = new Cp(), t) {
      const { spawn: i } = await import("node:child_process"), s = i(t, [
        "-i",
        "pipe:0",
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
      ]);
      s.stdin.on("error", () => {
      }), this.streamInput.pipe(s.stdin), this.streamInput.on("error", () => {
      }), s.on("error", () => {
        this.streamInput && this.streamInput.destroy();
      }), s.on("close", () => {
        this.streamInput && this.streamInput.destroy();
      });
      const o = Nn(s.stdout, {
        inputType: la.Raw,
        inlineVolume: !0
      });
      this.currentResource = o, (r = o.volume) == null || r.setVolume(1), this.player.play(o);
    } else {
      const i = Nn(this.streamInput, {
        inputType: la.WebmOpus,
        inlineVolume: !0
      });
      this.currentResource = i, (n = i.volume) == null || n.setVolume(1), this.player.play(i);
    }
    return !0;
  }
  writeAudioChunk(t) {
    if (this.streamInput && !this.streamInput.destroyed)
      try {
        this.streamInput.write(t);
      } catch {
      }
  }
}
const ud = ii(import.meta.url);
let Si = ud("ffmpeg-static");
Xe.isPackaged && (Si = Si.replace("app.asar", "app.asar.unpacked"));
function kS(e) {
  return new Promise((t) => {
    bp(`powershell -ExecutionPolicy Bypass -File "${e}"`, (r, n) => {
      if (r) {
        t("unknown");
        return;
      }
      t(n.trim());
    });
  });
}
ot.autoUpdater.allowPrerelease = !0;
const PS = Xe.requestSingleInstanceLock();
PS ? Xe.on("second-instance", () => {
  ee && (ee.isMinimized() && ee.restore(), ee.focus());
}) : Xe.quit();
const fd = Ie.dirname(xp(import.meta.url));
process.env.APP_ROOT = Ie.join(fd, "..");
const ds = process.env.VITE_DEV_SERVER_URL, yA = Ie.join(process.env.APP_ROOT, "dist-electron"), dd = Ie.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = ds ? Ie.join(process.env.APP_ROOT, "public") : dd;
let ee;
function pd() {
  ee = new Ic({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: Ie.join(process.env.VITE_PUBLIC, "logo.png"),
    titleBarStyle: "hidden",
    // Custom title bar for premium look
    titleBarOverlay: {
      color: "#00000000",
      symbolColor: "#ffffff",
      height: 30
    },
    webPreferences: {
      preload: Ie.join(fd, "preload.mjs"),
      webSecurity: !1,
      // simplified for local file access in dev
      backgroundThrottling: !1
    }
  }), ee.webContents.on("did-finish-load", () => {
    ee == null || ee.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), ds ? ee.loadURL(ds) : ee.loadFile(Ie.join(dd, "index.html"));
}
Xe.on("window-all-closed", () => {
  process.platform !== "darwin" && (Xe.quit(), ee = null);
});
Xe.on("activate", () => {
  Ic.getAllWindows().length === 0 && pd();
});
ot.autoUpdater.on("checking-for-update", () => {
  ee == null || ee.webContents.send("update-status", { status: "checking" });
});
ot.autoUpdater.on("update-available", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "available", info: e });
});
ot.autoUpdater.on("update-not-available", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "not-available", info: e });
});
ot.autoUpdater.on("error", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "error", error: e.message });
});
ot.autoUpdater.on("download-progress", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "downloading", progress: e });
});
ot.autoUpdater.on("update-downloaded", (e) => {
  ee == null || ee.webContents.send("update-status", { status: "downloaded", info: e }), new wp({
    title: "NeonWave 更新",
    body: "新版本已下載完成，將於重啟後自動安裝。",
    icon: Ie.join(process.env.VITE_PUBLIC, "logo.png")
  }).show();
});
Xe.whenReady().then(() => {
  process.platform === "win32" && Xe.setAppUserModelId("NeonWave"), pd();
  const e = new DS();
  re.handle("discord:login", async (i, a) => await e.login(a)), re.handle("discord:getGuilds", () => e.getGuilds()), re.handle("discord:getChannels", (i, a) => e.getChannels(a)), re.handle("discord:join", async (i, a, s) => await e.joinChannel(a, s)), re.handle("discord:leave", async () => await e.leaveChannel()), re.handle("discord:disconnect", async () => await e.disconnect()), re.handle("discord:play", async (i, a) => await e.playFile(a, Si)), re.handle("discord:stop", () => e.stop()), re.handle("discord:pause", () => e.pause()), re.handle("discord:resume", () => e.resume()), re.handle("discord:setVolume", (i, a) => e.setVolume(a)), re.handle("discord:status", () => e.getStatus()), re.handle("discord:startStreamMode", async () => await e.playReceiverStream(Si)), re.on("discord:audio-chunk", (i, a) => {
    e.writeAudioChunk(new Uint8Array(a));
  }), re.handle("dialog:openDirectory", async () => {
    const { canceled: i, filePaths: a } = await go.showOpenDialog(ee, {
      properties: ["openDirectory"]
    });
    return i ? null : a[0];
  }), re.handle("files:listMusic", async (i, a) => {
    if (!a) return [];
    try {
      const s = await Pn.readdir(a), o = [".mp3", ".wav", ".wma", ".m4a", ".flac", ".ogg", ".mp4", ".mov", ".wmv", ".avi"];
      return (await Promise.all(s.map(async (d) => {
        const c = Ie.join(a, d), u = Ie.extname(d).toLowerCase();
        if (!o.includes(u)) return null;
        try {
          const p = await Pn.stat(c);
          return {
            fullPath: c,
            mtime: p.mtime.getTime()
          };
        } catch {
          return null;
        }
      }))).filter((d) => d !== null).sort((d, c) => c.mtime - d.mtime).map((d) => d.fullPath);
    } catch (s) {
      return console.error("Error reading directory:", s), [];
    }
  }), re.handle("files:readBuffer", async (i, a) => {
    try {
      return await Pn.readFile(a);
    } catch (s) {
      return console.error("Error reading file:", s), null;
    }
  }), re.handle("files:getArtwork", async (i, a) => {
    try {
      const s = await Ac(a, { skipCovers: !1 });
      if (s.common.picture && s.common.picture.length > 0) {
        const o = s.common.picture[0];
        return `data:${o.format};base64,${Buffer.from(o.data).toString("base64")}`;
      }
      return null;
    } catch {
      return null;
    }
  }), re.handle("files:getMetadata", async (i, a, s = { loadArtwork: !0 }) => {
    try {
      const o = s.loadArtwork ? {} : { skipCovers: !0 }, l = await Ac(a, o);
      let d = null;
      if (s.loadArtwork && l.common.picture && l.common.picture.length > 0) {
        const c = l.common.picture[0];
        d = `data:${c.format};base64,${Buffer.from(c.data).toString("base64")}`;
      }
      return {
        title: l.common.title,
        artist: l.common.artist,
        album: l.common.album,
        artwork: d,
        duration: l.format.duration,
        codec: l.format.codec,
        bitrate: l.format.bitrate,
        sampleRate: l.format.sampleRate
      };
    } catch {
      return null;
    }
  }), re.handle("app:active-window", async () => {
    const i = Ie.join(process.env.APP_ROOT, "scripts/get-active-window.ps1");
    return await kS(i);
  });
  const t = ii(import.meta.url)("yt-dlp-wrap").default, r = async () => {
    const i = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp", a = Ie.join(Xe.getPath("userData"), i);
    try {
      const s = new t(a);
      console.log("[Main] Checking for yt-dlp updates in background..."), await s.execPromise(["-U"]), console.log("[Main] yt-dlp updated successfully.");
    } catch (s) {
      console.warn("[Main] Failed to update yt-dlp (background):", s.message);
    }
  }, n = async () => {
    const i = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp", a = Ie.join(Xe.getPath("userData"), i);
    try {
      await Pn.access(a);
    } catch {
      console.log("Downloading yt-dlp binary..."), await t.downloadFromGithub(a), console.log("Downloaded yt-dlp to", a);
    }
    return new t(a);
  };
  r(), re.handle("search:youtube", async (i, a) => {
    try {
      return (await (await n()).execPromise([
        `ytsearch12:${a}`,
        "--dump-json",
        "--flat-playlist",
        "--js-runtimes",
        "node"
      ])).trim().split(`
`).map((d) => {
        try {
          return JSON.parse(d);
        } catch {
          return null;
        }
      }).filter((d) => d && d.id).map((d) => ({
        id: d.id,
        title: d.title,
        artist: d.channel || d.uploader || "Unknown",
        duration: d.duration,
        thumbnail: `https://i.ytimg.com/vi/${d.id}/hqdefault.jpg`,
        // yt-dlp flat-playlist sometimes misses thumbs
        url: d.url || `https://www.youtube.com/watch?v=${d.id}`
      }));
    } catch (s) {
      return console.error("Yt-dlp search error:", s), [];
    }
  }), re.handle("download:youtube", async (i, a, s, o) => {
    try {
      const l = await n(), d = ii(import.meta.url)("ffmpeg-static").replace("app.asar", "app.asar.unpacked");
      let c = s.replace(/[\\/:*?"<>|]/g, "_").trim();
      const { filePath: u } = await go.showSaveDialog(ee, {
        title: "下載歌曲",
        defaultPath: `${c}.m4a`,
        // Force m4a for best playback
        filters: [{ name: "Audio (m4a)", extensions: ["m4a"] }]
      });
      return u ? new Promise((p, m) => {
        const E = [
          a,
          "-f",
          "bestaudio[ext=m4a]",
          "--js-runtimes",
          "node",
          "--ffmpeg-location",
          d,
          "--add-metadata",
          "--embed-thumbnail",
          "-o",
          u
        ];
        o && (E.push("--parse-metadata", `${o}:%(artist)s`), E.push("--parse-metadata", `${o}:%(album_artist)s`)), s && E.push("--parse-metadata", `${s}:%(title)s`);
        const w = l.exec(E);
        w.on("progress", () => {
        }), w.on("error", (T) => {
          console.error("yt-dlp error:", T), m(new Error(`下載錯誤: ${T.message}`));
        }), w.on("close", () => {
          p(u);
        });
      }) : null;
    } catch (l) {
      throw console.error("Download fatal error:", l), new Error(l.message);
    }
  }), re.handle("search:artistImage", async (i, a) => {
    try {
      const s = `https://api.deezer.com/search/artist?q=${encodeURIComponent(a)}&limit=1`;
      try {
        const d = await fetch(s);
        if (d.ok) {
          const c = await d.json();
          if (c && c.data && c.data.length > 0) {
            const u = c.data[0].picture_medium || c.data[0].picture_big;
            if (u) return u;
          }
        }
      } catch {
      }
      const o = `https://itunes.apple.com/search?term=${encodeURIComponent(a)}&media=music&entity=album&limit=1`, l = await fetch(o);
      if (l.ok) {
        const d = await l.json();
        if (d && d.results && d.results.length > 0) {
          const c = d.results[0].artworkUrl100;
          if (c)
            return c.replace("100x100bb", "600x600bb");
        }
      }
      try {
        const d = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(a)}`, c = await fetch(d);
        if (c.ok) {
          const u = await c.json();
          if (u && u.artists && u.artists.length > 0) {
            const p = u.artists[0], m = p.strArtistThumb || p.strArtistFanart;
            if (m) return m;
          }
        }
      } catch {
      }
      return null;
    } catch (s) {
      return console.error("Error fetching artist image:", s), null;
    }
  }), re.handle("search:lyrics", async (i, a, s, o, l) => {
    try {
      const d = ii(import.meta.url)("get-artist-title");
      console.log(`[Lyrics] Search Request: Title="${a}", Artist="${s}", Duration=${l}`);
      const c = (B) => {
        if (!B) return "";
        let k = B;
        k = k.replace(/『[^』]*』/g, "").replace(/「[^」」]*」/g, "");
        const G = [
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
        ], ae = (U) => G.some((Y) => U.toLowerCase().includes(Y)), y = (U, Y, R) => {
          const S = (A) => "\\" + A, D = new RegExp(`${S(Y)}([^${S(R)}]*)?${S(R)}`, "gi");
          return U.replace(D, (A, F) => !F || ae(F) ? " " : " " + F + " ");
        };
        return k = y(k, "(", ")"), k = y(k, "（", "）"), k = y(k, "[", "]"), k = y(k, "【", "】"), k = y(k, "{", "}"), k = y(k, "《", "》"), [
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
          const Y = new RegExp(U.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          k = k.replace(Y, " ");
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
      }, u = (B, k) => k ? Math.abs(B - k) : 0, p = async (B, k) => {
        try {
          const G = `https://lrclib.net/api/search?q=${encodeURIComponent(B)}`, ae = await fetch(G);
          if (!ae.ok) return [];
          const y = await ae.json();
          return Array.isArray(y) ? y.filter((M) => M.syncedLyrics && M.syncedLyrics.length > 0).map((M) => ({
            source: "LRCLib",
            id: M.id,
            track: M.trackName,
            artist: M.artistName,
            duration: M.duration,
            // in seconds
            lyrics: M.syncedLyrics,
            diff: k ? u(M.duration, k) : 0
          })) : [];
        } catch (G) {
          return console.error("LRCLib Error:", G), [];
        }
      }, m = async (B, k) => {
        try {
          const G = `https://music.163.com/api/search/get/web?s=${encodeURIComponent(B)}&type=1&offset=0&total=true&limit=5`, ae = await fetch(G, {
            headers: { Referer: "https://music.163.com/", Cookie: "appver=2.0.2" }
          });
          if (!ae.ok) return [];
          const y = await ae.json();
          if (!y.result || !y.result.songs) return [];
          let M = y.result.songs.map((S) => {
            var D, A;
            return {
              id: S.id,
              track: S.name,
              artist: ((A = (D = S.artists) == null ? void 0 : D[0]) == null ? void 0 : A.name) || "Unknown",
              duration: S.duration / 1e3,
              // ms to s
              diff: k ? u(S.duration / 1e3, k) : 0
            };
          });
          if (k && (M = M.filter((S) => S.diff <= 5), M.sort((S, D) => S.diff - D.diff)), M.length === 0) return [];
          const j = M[0], U = `https://music.163.com/api/song/lyric?id=${j.id}&lv=1&kv=1&tv=-1`, R = await (await fetch(U, {
            headers: { Referer: "https://music.163.com/", Cookie: "appver=2.0.2" }
          })).json();
          if (R.lrc && R.lrc.lyric)
            return [{
              source: "Netease",
              id: j.id,
              track: j.track,
              artist: j.artist,
              duration: j.duration,
              lyrics: R.lrc.lyric,
              diff: j.diff
            }];
        } catch (G) {
          console.error("Netease Error:", G);
        }
        return [];
      }, E = (B) => {
        if (!B) return null;
        try {
          return ud("opencc-js").Converter({ from: "cn", to: "tw" })(B);
        } catch {
          return B;
        }
      };
      let w = [];
      if (a && s) {
        const B = `${a} ${s}`;
        console.log(`[Lyrics] Strategy A: ${B}`);
        const [k, G] = await Promise.all([
          p(B, l),
          m(B, l)
        ]);
        w.push(...k, ...G);
      }
      const T = c(a), b = c(s);
      if (T && (T !== a || b !== s)) {
        const B = `${T} ${b}`;
        console.log(`[Lyrics] Strategy B: ${B}`);
        const [k, G] = await Promise.all([
          p(B, l),
          m(B, l)
        ]);
        w.push(...k, ...G);
      }
      if (o) {
        let B = Ie.basename(o, Ie.extname(o));
        const k = B.match(/(.+?)《(.+?)》(.*)/);
        if (k) {
          const y = k[1], M = k[2], j = c(y).replace(/合唱/g, "").trim(), U = c(M);
          if (U) {
            const Y = `${U} ${j}`;
            console.log(`[Lyrics] Strategy C-0 (Variety Pattern): ${Y}`), w.push(...await p(Y, l)), w.push(...await m(Y, l)), j.length > 0 && (console.log(`[Lyrics] Strategy C-0 (Title + Duration): ${U}`), w.push(...await p(U, l)), w.push(...await m(U, l)));
          }
        }
        const G = d(B.replace(/_/g, " "));
        if (G && G.length === 2) {
          const [y, M] = G, j = `${M} ${y}`;
          console.log(`[Lyrics] Strategy C-1 (Parsed): ${j}`), w.push(...await p(j, l)), w.push(...await m(j, l));
        }
        const ae = c(B);
        console.log(`[Lyrics] Strategy C-2 (Raw Cleaned): ${ae}`), w.push(...await p(ae, l)), w.push(...await m(ae, l));
      }
      if (w.length === 0)
        return console.log("[Lyrics] No candidates found."), null;
      const _ = /* @__PURE__ */ new Map();
      w.forEach((B) => {
        const k = `${B.source}-${B.id}`;
        _.has(k) || _.set(k, B);
      });
      let N = Array.from(_.values());
      if (l && l > 0) {
        const B = N.filter((k) => k.diff <= 4);
        if (B.length > 0)
          console.log(`[Lyrics] Calibration: Found ${B.length} strict duration matches.`), N = B;
        else {
          const k = N.filter((G) => G.diff <= 10);
          k.length > 0 ? (console.log(`[Lyrics] Calibration: Found ${k.length} lenient duration matches.`), N = k) : console.log(`[Lyrics] Calibration: No duration matches found. Closest is ${Math.min(...N.map((G) => G.diff))}s off.`);
        }
      }
      N.sort((B, k) => Math.abs(B.diff - k.diff) > 0.5 ? B.diff - k.diff : 0);
      const $ = N[0];
      return console.log(`[Lyrics] Selected: ${$.track} (${$.artist}) [${$.source}] Diff=${$.diff.toFixed(2)}s`), E($.lyrics);
    } catch (d) {
      return console.error("Error fetching lyrics:", d), null;
    }
  }), re.handle("update:check", () => {
    ot.autoUpdater.checkForUpdates();
  }), re.handle("update:install", () => {
    ot.autoUpdater.quitAndInstall(!0, !0);
  }), re.handle("app:version", () => Xe.getVersion());
});
export {
  pA as A,
  id as B,
  Hf as C,
  aA as D,
  Re as E,
  od as F,
  Zi as G,
  bc as H,
  h_ as I,
  SS as J,
  pb as K,
  hA as L,
  cd as M,
  Gf as N,
  Eb as O,
  xc as P,
  dA as Q,
  vb as R,
  we as S,
  dt as T,
  Ti as U,
  gA as V,
  mA as W,
  xb as X,
  ds as Y,
  yA as Z,
  dd as _,
  Xt as a,
  Kt as b,
  Ir as c,
  Wf as d,
  us as e,
  J as f,
  td as g,
  oA as h,
  fA as i,
  Xf as j,
  ie as k,
  zr as l,
  db as m,
  v_ as n,
  ss as o,
  x_ as p,
  w_ as q,
  A_ as r,
  uA as s,
  b_ as t,
  sA as u,
  E_ as v,
  lA as w,
  qf as x,
  y_ as y,
  ls as z
};
