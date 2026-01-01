import er, { app as Pt, BrowserWindow as kl, ipcMain as Wt, dialog as $f } from "electron";
import { fileURLToPath as If } from "node:url";
import wt from "node:path";
import jo from "node:fs/promises";
import kt from "fs";
import Of from "constants";
import gn from "stream";
import Qa from "util";
import Ml from "assert";
import we from "path";
import mi from "child_process";
import Bl from "events";
import vn from "crypto";
import jl from "tty";
import gi from "os";
import Ir from "url";
import Rf from "string_decoder";
import Hl from "zlib";
import Df from "http";
var je = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Pf(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var dt = {}, rr = {}, Ge = {};
Ge.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, a) => i != null ? n(i) : r(a)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Ge.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var Ct = Of, Nf = process.cwd, Zn = null, xf = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Zn || (Zn = Nf.call(process)), Zn;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Ho = process.chdir;
  process.chdir = function(e) {
    Zn = null, Ho.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Ho);
}
var Ff = Lf;
function Lf(e) {
  Ct.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = a(e.chown), e.fchown = a(e.fchown), e.lchown = a(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = o(e.chownSync), e.fchownSync = o(e.fchownSync), e.lchownSync = o(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(u, f, p) {
    p && process.nextTick(p);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(u, f, p, y) {
    y && process.nextTick(y);
  }, e.lchownSync = function() {
  }), xf === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(u) {
    function f(p, y, w) {
      var d = Date.now(), T = 0;
      u(p, y, function A(b) {
        if (b && (b.code === "EACCES" || b.code === "EPERM" || b.code === "EBUSY") && Date.now() - d < 6e4) {
          setTimeout(function() {
            e.stat(y, function(M, B) {
              M && M.code === "ENOENT" ? u(p, y, A) : w(b);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        w && w(b);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, u), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(u) {
    function f(p, y, w, d, T, A) {
      var b;
      if (A && typeof A == "function") {
        var M = 0;
        b = function(B, Q, ve) {
          if (B && B.code === "EAGAIN" && M < 10)
            return M++, u.call(e, p, y, w, d, T, b);
          A.apply(this, arguments);
        };
      }
      return u.call(e, p, y, w, d, T, b);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, u), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(u) {
    return function(f, p, y, w, d) {
      for (var T = 0; ; )
        try {
          return u.call(e, f, p, y, w, d);
        } catch (A) {
          if (A.code === "EAGAIN" && T < 10) {
            T++;
            continue;
          }
          throw A;
        }
    };
  }(e.readSync);
  function t(u) {
    u.lchmod = function(f, p, y) {
      u.open(
        f,
        Ct.O_WRONLY | Ct.O_SYMLINK,
        p,
        function(w, d) {
          if (w) {
            y && y(w);
            return;
          }
          u.fchmod(d, p, function(T) {
            u.close(d, function(A) {
              y && y(T || A);
            });
          });
        }
      );
    }, u.lchmodSync = function(f, p) {
      var y = u.openSync(f, Ct.O_WRONLY | Ct.O_SYMLINK, p), w = !0, d;
      try {
        d = u.fchmodSync(y, p), w = !1;
      } finally {
        if (w)
          try {
            u.closeSync(y);
          } catch {
          }
        else
          u.closeSync(y);
      }
      return d;
    };
  }
  function r(u) {
    Ct.hasOwnProperty("O_SYMLINK") && u.futimes ? (u.lutimes = function(f, p, y, w) {
      u.open(f, Ct.O_SYMLINK, function(d, T) {
        if (d) {
          w && w(d);
          return;
        }
        u.futimes(T, p, y, function(A) {
          u.close(T, function(b) {
            w && w(A || b);
          });
        });
      });
    }, u.lutimesSync = function(f, p, y) {
      var w = u.openSync(f, Ct.O_SYMLINK), d, T = !0;
      try {
        d = u.futimesSync(w, p, y), T = !1;
      } finally {
        if (T)
          try {
            u.closeSync(w);
          } catch {
          }
        else
          u.closeSync(w);
      }
      return d;
    }) : u.futimes && (u.lutimes = function(f, p, y, w) {
      w && process.nextTick(w);
    }, u.lutimesSync = function() {
    });
  }
  function n(u) {
    return u && function(f, p, y) {
      return u.call(e, f, p, function(w) {
        g(w) && (w = null), y && y.apply(this, arguments);
      });
    };
  }
  function i(u) {
    return u && function(f, p) {
      try {
        return u.call(e, f, p);
      } catch (y) {
        if (!g(y)) throw y;
      }
    };
  }
  function a(u) {
    return u && function(f, p, y, w) {
      return u.call(e, f, p, y, function(d) {
        g(d) && (d = null), w && w.apply(this, arguments);
      });
    };
  }
  function o(u) {
    return u && function(f, p, y) {
      try {
        return u.call(e, f, p, y);
      } catch (w) {
        if (!g(w)) throw w;
      }
    };
  }
  function s(u) {
    return u && function(f, p, y) {
      typeof p == "function" && (y = p, p = null);
      function w(d, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), y && y.apply(this, arguments);
      }
      return p ? u.call(e, f, p, w) : u.call(e, f, w);
    };
  }
  function l(u) {
    return u && function(f, p) {
      var y = p ? u.call(e, f, p) : u.call(e, f);
      return y && (y.uid < 0 && (y.uid += 4294967296), y.gid < 0 && (y.gid += 4294967296)), y;
    };
  }
  function g(u) {
    if (!u || u.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (u.code === "EINVAL" || u.code === "EPERM"));
  }
}
var qo = gn.Stream, Uf = kf;
function kf(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    qo.call(this);
    var a = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var o = Object.keys(i), s = 0, l = o.length; s < l; s++) {
      var g = o[s];
      this[g] = i[g];
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
    e.open(this.path, this.flags, this.mode, function(u, f) {
      if (u) {
        a.emit("error", u), a.readable = !1;
        return;
      }
      a.fd = f, a.emit("open", f), a._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    qo.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var Mf = jf, Bf = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function jf(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Bf(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var Ee = kt, Hf = Ff, qf = Uf, Gf = Mf, Ln = Qa, xe, ni;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (xe = Symbol.for("graceful-fs.queue"), ni = Symbol.for("graceful-fs.previous")) : (xe = "___graceful-fs.queue", ni = "___graceful-fs.previous");
function Vf() {
}
function ql(e, t) {
  Object.defineProperty(e, xe, {
    get: function() {
      return t;
    }
  });
}
var Qt = Vf;
Ln.debuglog ? Qt = Ln.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Qt = function() {
  var e = Ln.format.apply(Ln, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!Ee[xe]) {
  var Wf = je[xe] || [];
  ql(Ee, Wf), Ee.close = function(e) {
    function t(r, n) {
      return e.call(Ee, r, function(i) {
        i || Go(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, ni, {
      value: e
    }), t;
  }(Ee.close), Ee.closeSync = function(e) {
    function t(r) {
      e.apply(Ee, arguments), Go();
    }
    return Object.defineProperty(t, ni, {
      value: e
    }), t;
  }(Ee.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Qt(Ee[xe]), Ml.equal(Ee[xe].length, 0);
  });
}
je[xe] || ql(je, Ee[xe]);
var Ve = Za(Gf(Ee));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !Ee.__patched && (Ve = Za(Ee), Ee.__patched = !0);
function Za(e) {
  Hf(e), e.gracefulify = Za, e.createReadStream = Q, e.createWriteStream = ve;
  var t = e.readFile;
  e.readFile = r;
  function r(E, J, K) {
    return typeof J == "function" && (K = J, J = null), Y(E, J, K);
    function Y(ne, N, I, L) {
      return t(ne, N, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? cr([Y, [ne, N, I], $, L || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(E, J, K, Y) {
    return typeof K == "function" && (Y = K, K = null), ne(E, J, K, Y);
    function ne(N, I, L, $, k) {
      return n(N, I, L, function(x) {
        x && (x.code === "EMFILE" || x.code === "ENFILE") ? cr([ne, [N, I, L, $], x, k || Date.now(), Date.now()]) : typeof $ == "function" && $.apply(this, arguments);
      });
    }
  }
  var a = e.appendFile;
  a && (e.appendFile = o);
  function o(E, J, K, Y) {
    return typeof K == "function" && (Y = K, K = null), ne(E, J, K, Y);
    function ne(N, I, L, $, k) {
      return a(N, I, L, function(x) {
        x && (x.code === "EMFILE" || x.code === "ENFILE") ? cr([ne, [N, I, L, $], x, k || Date.now(), Date.now()]) : typeof $ == "function" && $.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(E, J, K, Y) {
    return typeof K == "function" && (Y = K, K = 0), ne(E, J, K, Y);
    function ne(N, I, L, $, k) {
      return s(N, I, L, function(x) {
        x && (x.code === "EMFILE" || x.code === "ENFILE") ? cr([ne, [N, I, L, $], x, k || Date.now(), Date.now()]) : typeof $ == "function" && $.apply(this, arguments);
      });
    }
  }
  var g = e.readdir;
  e.readdir = f;
  var u = /^v[0-5]\./;
  function f(E, J, K) {
    typeof J == "function" && (K = J, J = null);
    var Y = u.test(process.version) ? function(I, L, $, k) {
      return g(I, ne(
        I,
        L,
        $,
        k
      ));
    } : function(I, L, $, k) {
      return g(I, L, ne(
        I,
        L,
        $,
        k
      ));
    };
    return Y(E, J, K);
    function ne(N, I, L, $) {
      return function(k, x) {
        k && (k.code === "EMFILE" || k.code === "ENFILE") ? cr([
          Y,
          [N, I, L],
          k,
          $ || Date.now(),
          Date.now()
        ]) : (x && x.sort && x.sort(), typeof L == "function" && L.call(this, k, x));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var p = qf(e);
    A = p.ReadStream, M = p.WriteStream;
  }
  var y = e.ReadStream;
  y && (A.prototype = Object.create(y.prototype), A.prototype.open = b);
  var w = e.WriteStream;
  w && (M.prototype = Object.create(w.prototype), M.prototype.open = B), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return A;
    },
    set: function(E) {
      A = E;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return M;
    },
    set: function(E) {
      M = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var d = A;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return d;
    },
    set: function(E) {
      d = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var T = M;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return T;
    },
    set: function(E) {
      T = E;
    },
    enumerable: !0,
    configurable: !0
  });
  function A(E, J) {
    return this instanceof A ? (y.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
  }
  function b() {
    var E = this;
    ge(E.path, E.flags, E.mode, function(J, K) {
      J ? (E.autoClose && E.destroy(), E.emit("error", J)) : (E.fd = K, E.emit("open", K), E.read());
    });
  }
  function M(E, J) {
    return this instanceof M ? (w.apply(this, arguments), this) : M.apply(Object.create(M.prototype), arguments);
  }
  function B() {
    var E = this;
    ge(E.path, E.flags, E.mode, function(J, K) {
      J ? (E.destroy(), E.emit("error", J)) : (E.fd = K, E.emit("open", K));
    });
  }
  function Q(E, J) {
    return new e.ReadStream(E, J);
  }
  function ve(E, J) {
    return new e.WriteStream(E, J);
  }
  var te = e.open;
  e.open = ge;
  function ge(E, J, K, Y) {
    return typeof K == "function" && (Y = K, K = null), ne(E, J, K, Y);
    function ne(N, I, L, $, k) {
      return te(N, I, L, function(x, W) {
        x && (x.code === "EMFILE" || x.code === "ENFILE") ? cr([ne, [N, I, L, $], x, k || Date.now(), Date.now()]) : typeof $ == "function" && $.apply(this, arguments);
      });
    }
  }
  return e;
}
function cr(e) {
  Qt("ENQUEUE", e[0].name, e[1]), Ee[xe].push(e), eo();
}
var Un;
function Go() {
  for (var e = Date.now(), t = 0; t < Ee[xe].length; ++t)
    Ee[xe][t].length > 2 && (Ee[xe][t][3] = e, Ee[xe][t][4] = e);
  eo();
}
function eo() {
  if (clearTimeout(Un), Un = void 0, Ee[xe].length !== 0) {
    var e = Ee[xe].shift(), t = e[0], r = e[1], n = e[2], i = e[3], a = e[4];
    if (i === void 0)
      Qt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Qt("TIMEOUT", t.name, r);
      var o = r.pop();
      typeof o == "function" && o.call(null, n);
    } else {
      var s = Date.now() - a, l = Math.max(a - i, 1), g = Math.min(l * 1.2, 100);
      s >= g ? (Qt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : Ee[xe].push(e);
    }
    Un === void 0 && (Un = setTimeout(eo, 0));
  }
}
(function(e) {
  const t = Ge.fromCallback, r = Ve, n = [
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
  }, e.read = function(i, a, o, s, l, g) {
    return typeof g == "function" ? r.read(i, a, o, s, l, g) : new Promise((u, f) => {
      r.read(i, a, o, s, l, (p, y, w) => {
        if (p) return f(p);
        u({ bytesRead: y, buffer: w });
      });
    });
  }, e.write = function(i, a, ...o) {
    return typeof o[o.length - 1] == "function" ? r.write(i, a, ...o) : new Promise((s, l) => {
      r.write(i, a, ...o, (g, u, f) => {
        if (g) return l(g);
        s({ bytesWritten: u, buffer: f });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, a, ...o) {
    return typeof o[o.length - 1] == "function" ? r.writev(i, a, ...o) : new Promise((s, l) => {
      r.writev(i, a, ...o, (g, u, f) => {
        if (g) return l(g);
        s({ bytesWritten: u, buffers: f });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(rr);
var to = {}, Gl = {};
const Yf = we;
Gl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Yf.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Vl = rr, { checkPath: Wl } = Gl, Yl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
to.makeDir = async (e, t) => (Wl(e), Vl.mkdir(e, {
  mode: Yl(t),
  recursive: !0
}));
to.makeDirSync = (e, t) => (Wl(e), Vl.mkdirSync(e, {
  mode: Yl(t),
  recursive: !0
}));
const zf = Ge.fromPromise, { makeDir: Xf, makeDirSync: ia } = to, aa = zf(Xf);
var ht = {
  mkdirs: aa,
  mkdirsSync: ia,
  // alias
  mkdirp: aa,
  mkdirpSync: ia,
  ensureDir: aa,
  ensureDirSync: ia
};
const Kf = Ge.fromPromise, zl = rr;
function Jf(e) {
  return zl.access(e).then(() => !0).catch(() => !1);
}
var nr = {
  pathExists: Kf(Jf),
  pathExistsSync: zl.existsSync
};
const Tr = Ve;
function Qf(e, t, r, n) {
  Tr.open(e, "r+", (i, a) => {
    if (i) return n(i);
    Tr.futimes(a, t, r, (o) => {
      Tr.close(a, (s) => {
        n && n(o || s);
      });
    });
  });
}
function Zf(e, t, r) {
  const n = Tr.openSync(e, "r+");
  return Tr.futimesSync(n, t, r), Tr.closeSync(n);
}
var Xl = {
  utimesMillis: Qf,
  utimesMillisSync: Zf
};
const Ar = rr, Oe = we, ed = Qa;
function td(e, t, r) {
  const n = r.dereference ? (i) => Ar.stat(i, { bigint: !0 }) : (i) => Ar.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, a]) => ({ srcStat: i, destStat: a }));
}
function rd(e, t, r) {
  let n;
  const i = r.dereference ? (o) => Ar.statSync(o, { bigint: !0 }) : (o) => Ar.lstatSync(o, { bigint: !0 }), a = i(e);
  try {
    n = i(t);
  } catch (o) {
    if (o.code === "ENOENT") return { srcStat: a, destStat: null };
    throw o;
  }
  return { srcStat: a, destStat: n };
}
function nd(e, t, r, n, i) {
  ed.callbackify(td)(e, t, n, (a, o) => {
    if (a) return i(a);
    const { srcStat: s, destStat: l } = o;
    if (l) {
      if (yn(s, l)) {
        const g = Oe.basename(e), u = Oe.basename(t);
        return r === "move" && g !== u && g.toLowerCase() === u.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && ro(e, t) ? i(new Error(vi(e, t, r))) : i(null, { srcStat: s, destStat: l });
  });
}
function id(e, t, r, n) {
  const { srcStat: i, destStat: a } = rd(e, t, n);
  if (a) {
    if (yn(i, a)) {
      const o = Oe.basename(e), s = Oe.basename(t);
      if (r === "move" && o !== s && o.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: a, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !a.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && a.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && ro(e, t))
    throw new Error(vi(e, t, r));
  return { srcStat: i, destStat: a };
}
function Kl(e, t, r, n, i) {
  const a = Oe.resolve(Oe.dirname(e)), o = Oe.resolve(Oe.dirname(r));
  if (o === a || o === Oe.parse(o).root) return i();
  Ar.stat(o, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : yn(t, l) ? i(new Error(vi(e, r, n))) : Kl(e, t, o, n, i));
}
function Jl(e, t, r, n) {
  const i = Oe.resolve(Oe.dirname(e)), a = Oe.resolve(Oe.dirname(r));
  if (a === i || a === Oe.parse(a).root) return;
  let o;
  try {
    o = Ar.statSync(a, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (yn(t, o))
    throw new Error(vi(e, r, n));
  return Jl(e, t, a, n);
}
function yn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function ro(e, t) {
  const r = Oe.resolve(e).split(Oe.sep).filter((i) => i), n = Oe.resolve(t).split(Oe.sep).filter((i) => i);
  return r.reduce((i, a, o) => i && n[o] === a, !0);
}
function vi(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Or = {
  checkPaths: nd,
  checkPathsSync: id,
  checkParentPaths: Kl,
  checkParentPathsSync: Jl,
  isSrcSubdir: ro,
  areIdentical: yn
};
const Xe = Ve, en = we, ad = ht.mkdirs, od = nr.pathExists, sd = Xl.utimesMillis, tn = Or;
function ld(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), tn.checkPaths(e, t, "copy", r, (i, a) => {
    if (i) return n(i);
    const { srcStat: o, destStat: s } = a;
    tn.checkParentPaths(e, o, t, "copy", (l) => l ? n(l) : r.filter ? Ql(Vo, s, e, t, r, n) : Vo(s, e, t, r, n));
  });
}
function Vo(e, t, r, n, i) {
  const a = en.dirname(r);
  od(a, (o, s) => {
    if (o) return i(o);
    if (s) return ii(e, t, r, n, i);
    ad(a, (l) => l ? i(l) : ii(e, t, r, n, i));
  });
}
function Ql(e, t, r, n, i, a) {
  Promise.resolve(i.filter(r, n)).then((o) => o ? e(t, r, n, i, a) : a(), (o) => a(o));
}
function ud(e, t, r, n, i) {
  return n.filter ? Ql(ii, e, t, r, n, i) : ii(e, t, r, n, i);
}
function ii(e, t, r, n, i) {
  (n.dereference ? Xe.stat : Xe.lstat)(t, (o, s) => o ? i(o) : s.isDirectory() ? gd(s, e, t, r, n, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? cd(s, e, t, r, n, i) : s.isSymbolicLink() ? Ed(e, t, r, n, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function cd(e, t, r, n, i, a) {
  return t ? fd(e, r, n, i, a) : Zl(e, r, n, i, a);
}
function fd(e, t, r, n, i) {
  if (n.overwrite)
    Xe.unlink(r, (a) => a ? i(a) : Zl(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Zl(e, t, r, n, i) {
  Xe.copyFile(t, r, (a) => a ? i(a) : n.preserveTimestamps ? dd(e.mode, t, r, i) : yi(r, e.mode, i));
}
function dd(e, t, r, n) {
  return hd(e) ? pd(r, e, (i) => i ? n(i) : Wo(e, t, r, n)) : Wo(e, t, r, n);
}
function hd(e) {
  return (e & 128) === 0;
}
function pd(e, t, r) {
  return yi(e, t | 128, r);
}
function Wo(e, t, r, n) {
  md(t, r, (i) => i ? n(i) : yi(r, e, n));
}
function yi(e, t, r) {
  return Xe.chmod(e, t, r);
}
function md(e, t, r) {
  Xe.stat(e, (n, i) => n ? r(n) : sd(t, i.atime, i.mtime, r));
}
function gd(e, t, r, n, i, a) {
  return t ? eu(r, n, i, a) : vd(e.mode, r, n, i, a);
}
function vd(e, t, r, n, i) {
  Xe.mkdir(r, (a) => {
    if (a) return i(a);
    eu(t, r, n, (o) => o ? i(o) : yi(r, e, i));
  });
}
function eu(e, t, r, n) {
  Xe.readdir(e, (i, a) => i ? n(i) : tu(a, e, t, r, n));
}
function tu(e, t, r, n, i) {
  const a = e.pop();
  return a ? yd(e, a, t, r, n, i) : i();
}
function yd(e, t, r, n, i, a) {
  const o = en.join(r, t), s = en.join(n, t);
  tn.checkPaths(o, s, "copy", i, (l, g) => {
    if (l) return a(l);
    const { destStat: u } = g;
    ud(u, o, s, i, (f) => f ? a(f) : tu(e, r, n, i, a));
  });
}
function Ed(e, t, r, n, i) {
  Xe.readlink(t, (a, o) => {
    if (a) return i(a);
    if (n.dereference && (o = en.resolve(process.cwd(), o)), e)
      Xe.readlink(r, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Xe.symlink(o, r, i) : i(s) : (n.dereference && (l = en.resolve(process.cwd(), l)), tn.isSrcSubdir(o, l) ? i(new Error(`Cannot copy '${o}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && tn.isSrcSubdir(l, o) ? i(new Error(`Cannot overwrite '${l}' with '${o}'.`)) : wd(o, r, i)));
    else
      return Xe.symlink(o, r, i);
  });
}
function wd(e, t, r) {
  Xe.unlink(t, (n) => n ? r(n) : Xe.symlink(e, t, r));
}
var _d = ld;
const Ue = Ve, rn = we, Td = ht.mkdirsSync, Sd = Xl.utimesMillisSync, nn = Or;
function Ad(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = nn.checkPathsSync(e, t, "copy", r);
  return nn.checkParentPathsSync(e, n, t, "copy"), bd(i, e, t, r);
}
function bd(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = rn.dirname(r);
  return Ue.existsSync(i) || Td(i), ru(e, t, r, n);
}
function Cd(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return ru(e, t, r, n);
}
function ru(e, t, r, n) {
  const a = (n.dereference ? Ue.statSync : Ue.lstatSync)(t);
  if (a.isDirectory()) return Nd(a, e, t, r, n);
  if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return $d(a, e, t, r, n);
  if (a.isSymbolicLink()) return Ld(e, t, r, n);
  throw a.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function $d(e, t, r, n, i) {
  return t ? Id(e, r, n, i) : nu(e, r, n, i);
}
function Id(e, t, r, n) {
  if (n.overwrite)
    return Ue.unlinkSync(r), nu(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function nu(e, t, r, n) {
  return Ue.copyFileSync(t, r), n.preserveTimestamps && Od(e.mode, t, r), no(r, e.mode);
}
function Od(e, t, r) {
  return Rd(e) && Dd(r, e), Pd(t, r);
}
function Rd(e) {
  return (e & 128) === 0;
}
function Dd(e, t) {
  return no(e, t | 128);
}
function no(e, t) {
  return Ue.chmodSync(e, t);
}
function Pd(e, t) {
  const r = Ue.statSync(e);
  return Sd(t, r.atime, r.mtime);
}
function Nd(e, t, r, n, i) {
  return t ? iu(r, n, i) : xd(e.mode, r, n, i);
}
function xd(e, t, r, n) {
  return Ue.mkdirSync(r), iu(t, r, n), no(r, e);
}
function iu(e, t, r) {
  Ue.readdirSync(e).forEach((n) => Fd(n, e, t, r));
}
function Fd(e, t, r, n) {
  const i = rn.join(t, e), a = rn.join(r, e), { destStat: o } = nn.checkPathsSync(i, a, "copy", n);
  return Cd(o, i, a, n);
}
function Ld(e, t, r, n) {
  let i = Ue.readlinkSync(t);
  if (n.dereference && (i = rn.resolve(process.cwd(), i)), e) {
    let a;
    try {
      a = Ue.readlinkSync(r);
    } catch (o) {
      if (o.code === "EINVAL" || o.code === "UNKNOWN") return Ue.symlinkSync(i, r);
      throw o;
    }
    if (n.dereference && (a = rn.resolve(process.cwd(), a)), nn.isSrcSubdir(i, a))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);
    if (Ue.statSync(r).isDirectory() && nn.isSrcSubdir(a, i))
      throw new Error(`Cannot overwrite '${a}' with '${i}'.`);
    return Ud(i, r);
  } else
    return Ue.symlinkSync(i, r);
}
function Ud(e, t) {
  return Ue.unlinkSync(t), Ue.symlinkSync(e, t);
}
var kd = Ad;
const Md = Ge.fromCallback;
var io = {
  copy: Md(_d),
  copySync: kd
};
const Yo = Ve, au = we, he = Ml, an = process.platform === "win32";
function ou(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Yo[r], r = r + "Sync", e[r] = e[r] || Yo[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function ao(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), he(e, "rimraf: missing path"), he.strictEqual(typeof e, "string", "rimraf: path should be a string"), he.strictEqual(typeof r, "function", "rimraf: callback function required"), he(t, "rimraf: invalid options argument provided"), he.strictEqual(typeof t, "object", "rimraf: options should be object"), ou(t), zo(e, t, function i(a) {
    if (a) {
      if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const o = n * 100;
        return setTimeout(() => zo(e, t, i), o);
      }
      a.code === "ENOENT" && (a = null);
    }
    r(a);
  });
}
function zo(e, t, r) {
  he(e), he(t), he(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && an)
      return Xo(e, t, n, r);
    if (i && i.isDirectory())
      return ei(e, t, n, r);
    t.unlink(e, (a) => {
      if (a) {
        if (a.code === "ENOENT")
          return r(null);
        if (a.code === "EPERM")
          return an ? Xo(e, t, a, r) : ei(e, t, a, r);
        if (a.code === "EISDIR")
          return ei(e, t, a, r);
      }
      return r(a);
    });
  });
}
function Xo(e, t, r, n) {
  he(e), he(t), he(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (a, o) => {
      a ? n(a.code === "ENOENT" ? null : r) : o.isDirectory() ? ei(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Ko(e, t, r) {
  let n;
  he(e), he(t);
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
  n.isDirectory() ? ti(e, t, r) : t.unlinkSync(e);
}
function ei(e, t, r, n) {
  he(e), he(t), he(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Bd(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Bd(e, t, r) {
  he(e), he(t), he(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let a = i.length, o;
    if (a === 0) return t.rmdir(e, r);
    i.forEach((s) => {
      ao(au.join(e, s), t, (l) => {
        if (!o) {
          if (l) return r(o = l);
          --a === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function su(e, t) {
  let r;
  t = t || {}, ou(t), he(e, "rimraf: missing path"), he.strictEqual(typeof e, "string", "rimraf: path should be a string"), he(t, "rimraf: missing options"), he.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && an && Ko(e, t, n);
  }
  try {
    r && r.isDirectory() ? ti(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return an ? Ko(e, t, n) : ti(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    ti(e, t, n);
  }
}
function ti(e, t, r) {
  he(e), he(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      jd(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function jd(e, t) {
  if (he(e), he(t), t.readdirSync(e).forEach((r) => su(au.join(e, r), t)), an) {
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
var Hd = ao;
ao.sync = su;
const ai = Ve, qd = Ge.fromCallback, lu = Hd;
function Gd(e, t) {
  if (ai.rm) return ai.rm(e, { recursive: !0, force: !0 }, t);
  lu(e, t);
}
function Vd(e) {
  if (ai.rmSync) return ai.rmSync(e, { recursive: !0, force: !0 });
  lu.sync(e);
}
var Ei = {
  remove: qd(Gd),
  removeSync: Vd
};
const Wd = Ge.fromPromise, uu = rr, cu = we, fu = ht, du = Ei, Jo = Wd(async function(t) {
  let r;
  try {
    r = await uu.readdir(t);
  } catch {
    return fu.mkdirs(t);
  }
  return Promise.all(r.map((n) => du.remove(cu.join(t, n))));
});
function Qo(e) {
  let t;
  try {
    t = uu.readdirSync(e);
  } catch {
    return fu.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = cu.join(e, r), du.removeSync(r);
  });
}
var Yd = {
  emptyDirSync: Qo,
  emptydirSync: Qo,
  emptyDir: Jo,
  emptydir: Jo
};
const zd = Ge.fromCallback, hu = we, Ot = Ve, pu = ht;
function Xd(e, t) {
  function r() {
    Ot.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  Ot.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const a = hu.dirname(e);
    Ot.stat(a, (o, s) => {
      if (o)
        return o.code === "ENOENT" ? pu.mkdirs(a, (l) => {
          if (l) return t(l);
          r();
        }) : t(o);
      s.isDirectory() ? r() : Ot.readdir(a, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Kd(e) {
  let t;
  try {
    t = Ot.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = hu.dirname(e);
  try {
    Ot.statSync(r).isDirectory() || Ot.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") pu.mkdirsSync(r);
    else throw n;
  }
  Ot.writeFileSync(e, "");
}
var Jd = {
  createFile: zd(Xd),
  createFileSync: Kd
};
const Qd = Ge.fromCallback, mu = we, It = Ve, gu = ht, Zd = nr.pathExists, { areIdentical: vu } = Or;
function eh(e, t, r) {
  function n(i, a) {
    It.link(i, a, (o) => {
      if (o) return r(o);
      r(null);
    });
  }
  It.lstat(t, (i, a) => {
    It.lstat(e, (o, s) => {
      if (o)
        return o.message = o.message.replace("lstat", "ensureLink"), r(o);
      if (a && vu(s, a)) return r(null);
      const l = mu.dirname(t);
      Zd(l, (g, u) => {
        if (g) return r(g);
        if (u) return n(e, t);
        gu.mkdirs(l, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function th(e, t) {
  let r;
  try {
    r = It.lstatSync(t);
  } catch {
  }
  try {
    const a = It.lstatSync(e);
    if (r && vu(a, r)) return;
  } catch (a) {
    throw a.message = a.message.replace("lstat", "ensureLink"), a;
  }
  const n = mu.dirname(t);
  return It.existsSync(n) || gu.mkdirsSync(n), It.linkSync(e, t);
}
var rh = {
  createLink: Qd(eh),
  createLinkSync: th
};
const Rt = we, Kr = Ve, nh = nr.pathExists;
function ih(e, t, r) {
  if (Rt.isAbsolute(e))
    return Kr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = Rt.dirname(t), i = Rt.join(n, e);
    return nh(i, (a, o) => a ? r(a) : o ? r(null, {
      toCwd: i,
      toDst: e
    }) : Kr.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), r(s)) : r(null, {
      toCwd: e,
      toDst: Rt.relative(n, e)
    })));
  }
}
function ah(e, t) {
  let r;
  if (Rt.isAbsolute(e)) {
    if (r = Kr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = Rt.dirname(t), i = Rt.join(n, e);
    if (r = Kr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Kr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Rt.relative(n, e)
    };
  }
}
var oh = {
  symlinkPaths: ih,
  symlinkPathsSync: ah
};
const yu = Ve;
function sh(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  yu.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function lh(e, t) {
  let r;
  if (t) return t;
  try {
    r = yu.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var uh = {
  symlinkType: sh,
  symlinkTypeSync: lh
};
const ch = Ge.fromCallback, Eu = we, at = rr, wu = ht, fh = wu.mkdirs, dh = wu.mkdirsSync, _u = oh, hh = _u.symlinkPaths, ph = _u.symlinkPathsSync, Tu = uh, mh = Tu.symlinkType, gh = Tu.symlinkTypeSync, vh = nr.pathExists, { areIdentical: Su } = Or;
function yh(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, at.lstat(t, (i, a) => {
    !i && a.isSymbolicLink() ? Promise.all([
      at.stat(e),
      at.stat(t)
    ]).then(([o, s]) => {
      if (Su(o, s)) return n(null);
      Zo(e, t, r, n);
    }) : Zo(e, t, r, n);
  });
}
function Zo(e, t, r, n) {
  hh(e, t, (i, a) => {
    if (i) return n(i);
    e = a.toDst, mh(a.toCwd, r, (o, s) => {
      if (o) return n(o);
      const l = Eu.dirname(t);
      vh(l, (g, u) => {
        if (g) return n(g);
        if (u) return at.symlink(e, t, s, n);
        fh(l, (f) => {
          if (f) return n(f);
          at.symlink(e, t, s, n);
        });
      });
    });
  });
}
function Eh(e, t, r) {
  let n;
  try {
    n = at.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const s = at.statSync(e), l = at.statSync(t);
    if (Su(s, l)) return;
  }
  const i = ph(e, t);
  e = i.toDst, r = gh(i.toCwd, r);
  const a = Eu.dirname(t);
  return at.existsSync(a) || dh(a), at.symlinkSync(e, t, r);
}
var wh = {
  createSymlink: ch(yh),
  createSymlinkSync: Eh
};
const { createFile: es, createFileSync: ts } = Jd, { createLink: rs, createLinkSync: ns } = rh, { createSymlink: is, createSymlinkSync: as } = wh;
var _h = {
  // file
  createFile: es,
  createFileSync: ts,
  ensureFile: es,
  ensureFileSync: ts,
  // link
  createLink: rs,
  createLinkSync: ns,
  ensureLink: rs,
  ensureLinkSync: ns,
  // symlink
  createSymlink: is,
  createSymlinkSync: as,
  ensureSymlink: is,
  ensureSymlinkSync: as
};
function Th(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const a = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + a;
}
function Sh(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var oo = { stringify: Th, stripBom: Sh };
let br;
try {
  br = Ve;
} catch {
  br = kt;
}
const wi = Ge, { stringify: Au, stripBom: bu } = oo;
async function Ah(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || br, n = "throws" in t ? t.throws : !0;
  let i = await wi.fromCallback(r.readFile)(e, t);
  i = bu(i);
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
const bh = wi.fromPromise(Ah);
function Ch(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || br, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = bu(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function $h(e, t, r = {}) {
  const n = r.fs || br, i = Au(t, r);
  await wi.fromCallback(n.writeFile)(e, i, r);
}
const Ih = wi.fromPromise($h);
function Oh(e, t, r = {}) {
  const n = r.fs || br, i = Au(t, r);
  return n.writeFileSync(e, i, r);
}
var Rh = {
  readFile: bh,
  readFileSync: Ch,
  writeFile: Ih,
  writeFileSync: Oh
};
const kn = Rh;
var Dh = {
  // jsonfile exports
  readJson: kn.readFile,
  readJsonSync: kn.readFileSync,
  writeJson: kn.writeFile,
  writeJsonSync: kn.writeFileSync
};
const Ph = Ge.fromCallback, Jr = Ve, Cu = we, $u = ht, Nh = nr.pathExists;
function xh(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = Cu.dirname(e);
  Nh(i, (a, o) => {
    if (a) return n(a);
    if (o) return Jr.writeFile(e, t, r, n);
    $u.mkdirs(i, (s) => {
      if (s) return n(s);
      Jr.writeFile(e, t, r, n);
    });
  });
}
function Fh(e, ...t) {
  const r = Cu.dirname(e);
  if (Jr.existsSync(r))
    return Jr.writeFileSync(e, ...t);
  $u.mkdirsSync(r), Jr.writeFileSync(e, ...t);
}
var so = {
  outputFile: Ph(xh),
  outputFileSync: Fh
};
const { stringify: Lh } = oo, { outputFile: Uh } = so;
async function kh(e, t, r = {}) {
  const n = Lh(t, r);
  await Uh(e, n, r);
}
var Mh = kh;
const { stringify: Bh } = oo, { outputFileSync: jh } = so;
function Hh(e, t, r) {
  const n = Bh(t, r);
  jh(e, n, r);
}
var qh = Hh;
const Gh = Ge.fromPromise, qe = Dh;
qe.outputJson = Gh(Mh);
qe.outputJsonSync = qh;
qe.outputJSON = qe.outputJson;
qe.outputJSONSync = qe.outputJsonSync;
qe.writeJSON = qe.writeJson;
qe.writeJSONSync = qe.writeJsonSync;
qe.readJSON = qe.readJson;
qe.readJSONSync = qe.readJsonSync;
var Vh = qe;
const Wh = Ve, Fa = we, Yh = io.copy, Iu = Ei.remove, zh = ht.mkdirp, Xh = nr.pathExists, os = Or;
function Kh(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  os.checkPaths(e, t, "move", r, (a, o) => {
    if (a) return n(a);
    const { srcStat: s, isChangingCase: l = !1 } = o;
    os.checkParentPaths(e, s, t, "move", (g) => {
      if (g) return n(g);
      if (Jh(t)) return ss(e, t, i, l, n);
      zh(Fa.dirname(t), (u) => u ? n(u) : ss(e, t, i, l, n));
    });
  });
}
function Jh(e) {
  const t = Fa.dirname(e);
  return Fa.parse(t).root === t;
}
function ss(e, t, r, n, i) {
  if (n) return oa(e, t, r, i);
  if (r)
    return Iu(t, (a) => a ? i(a) : oa(e, t, r, i));
  Xh(t, (a, o) => a ? i(a) : o ? i(new Error("dest already exists.")) : oa(e, t, r, i));
}
function oa(e, t, r, n) {
  Wh.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Qh(e, t, r, n) : n());
}
function Qh(e, t, r, n) {
  Yh(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (a) => a ? n(a) : Iu(e, n));
}
var Zh = Kh;
const Ou = Ve, La = we, ep = io.copySync, Ru = Ei.removeSync, tp = ht.mkdirpSync, ls = Or;
function rp(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: a = !1 } = ls.checkPathsSync(e, t, "move", r);
  return ls.checkParentPathsSync(e, i, t, "move"), np(t) || tp(La.dirname(t)), ip(e, t, n, a);
}
function np(e) {
  const t = La.dirname(e);
  return La.parse(t).root === t;
}
function ip(e, t, r, n) {
  if (n) return sa(e, t, r);
  if (r)
    return Ru(t), sa(e, t, r);
  if (Ou.existsSync(t)) throw new Error("dest already exists.");
  return sa(e, t, r);
}
function sa(e, t, r) {
  try {
    Ou.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return ap(e, t, r);
  }
}
function ap(e, t, r) {
  return ep(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), Ru(e);
}
var op = rp;
const sp = Ge.fromCallback;
var lp = {
  move: sp(Zh),
  moveSync: op
}, Mt = {
  // Export promiseified graceful-fs:
  ...rr,
  // Export extra methods:
  ...io,
  ...Yd,
  ..._h,
  ...Vh,
  ...ht,
  ...lp,
  ...so,
  ...nr,
  ...Ei
}, Tt = {}, Nt = {}, Re = {}, xt = {};
Object.defineProperty(xt, "__esModule", { value: !0 });
xt.CancellationError = xt.CancellationToken = void 0;
const up = Bl;
class cp extends up.EventEmitter {
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
      return Promise.reject(new Ua());
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
          a(new Ua());
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
xt.CancellationToken = cp;
class Ua extends Error {
  constructor() {
    super("cancelled");
  }
}
xt.CancellationError = Ua;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.newError = fp;
function fp(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var He = {}, ka = { exports: {} }, Mn = { exports: {} }, la, us;
function dp() {
  if (us) return la;
  us = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, a = n * 365.25;
  la = function(u, f) {
    f = f || {};
    var p = typeof u;
    if (p === "string" && u.length > 0)
      return o(u);
    if (p === "number" && isFinite(u))
      return f.long ? l(u) : s(u);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(u)
    );
  };
  function o(u) {
    if (u = String(u), !(u.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        u
      );
      if (f) {
        var p = parseFloat(f[1]), y = (f[2] || "ms").toLowerCase();
        switch (y) {
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
  function s(u) {
    var f = Math.abs(u);
    return f >= n ? Math.round(u / n) + "d" : f >= r ? Math.round(u / r) + "h" : f >= t ? Math.round(u / t) + "m" : f >= e ? Math.round(u / e) + "s" : u + "ms";
  }
  function l(u) {
    var f = Math.abs(u);
    return f >= n ? g(u, f, n, "day") : f >= r ? g(u, f, r, "hour") : f >= t ? g(u, f, t, "minute") : f >= e ? g(u, f, e, "second") : u + " ms";
  }
  function g(u, f, p, y) {
    var w = f >= p * 1.5;
    return Math.round(u / p) + " " + y + (w ? "s" : "");
  }
  return la;
}
var ua, cs;
function Du() {
  if (cs) return ua;
  cs = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = g, n.disable = s, n.enable = a, n.enabled = l, n.humanize = dp(), n.destroy = u, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let p = 0;
      for (let y = 0; y < f.length; y++)
        p = (p << 5) - p + f.charCodeAt(y), p |= 0;
      return n.colors[Math.abs(p) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let p, y = null, w, d;
      function T(...A) {
        if (!T.enabled)
          return;
        const b = T, M = Number(/* @__PURE__ */ new Date()), B = M - (p || M);
        b.diff = B, b.prev = p, b.curr = M, p = M, A[0] = n.coerce(A[0]), typeof A[0] != "string" && A.unshift("%O");
        let Q = 0;
        A[0] = A[0].replace(/%([a-zA-Z%])/g, (te, ge) => {
          if (te === "%%")
            return "%";
          Q++;
          const E = n.formatters[ge];
          if (typeof E == "function") {
            const J = A[Q];
            te = E.call(b, J), A.splice(Q, 1), Q--;
          }
          return te;
        }), n.formatArgs.call(b, A), (b.log || n.log).apply(b, A);
      }
      return T.namespace = f, T.useColors = n.useColors(), T.color = n.selectColor(f), T.extend = i, T.destroy = n.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => y !== null ? y : (w !== n.namespaces && (w = n.namespaces, d = n.enabled(f)), d),
        set: (A) => {
          y = A;
        }
      }), typeof n.init == "function" && n.init(T), T;
    }
    function i(f, p) {
      const y = n(this.namespace + (typeof p > "u" ? ":" : p) + f);
      return y.log = this.log, y;
    }
    function a(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const p = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const y of p)
        y[0] === "-" ? n.skips.push(y.slice(1)) : n.names.push(y);
    }
    function o(f, p) {
      let y = 0, w = 0, d = -1, T = 0;
      for (; y < f.length; )
        if (w < p.length && (p[w] === f[y] || p[w] === "*"))
          p[w] === "*" ? (d = w, T = y, w++) : (y++, w++);
        else if (d !== -1)
          w = d + 1, T++, y = T;
        else
          return !1;
      for (; w < p.length && p[w] === "*"; )
        w++;
      return w === p.length;
    }
    function s() {
      const f = [
        ...n.names,
        ...n.skips.map((p) => "-" + p)
      ].join(",");
      return n.enable(""), f;
    }
    function l(f) {
      for (const p of n.skips)
        if (o(f, p))
          return !1;
      for (const p of n.names)
        if (o(f, p))
          return !0;
      return !1;
    }
    function g(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function u() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return ua = e, ua;
}
var fs;
function hp() {
  return fs || (fs = 1, function(e, t) {
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
      const g = "color: " + this.color;
      l.splice(1, 0, g, "color: inherit");
      let u = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (p) => {
        p !== "%%" && (u++, p === "%c" && (f = u));
      }), l.splice(f, 0, g);
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
    e.exports = Du()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (g) {
        return "[UnexpectedJSONParseError]: " + g.message;
      }
    };
  }(Mn, Mn.exports)), Mn.exports;
}
var Bn = { exports: {} }, ca, ds;
function pp() {
  return ds || (ds = 1, ca = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), ca;
}
var fa, hs;
function mp() {
  if (hs) return fa;
  hs = 1;
  const e = gi, t = jl, r = pp(), { env: n } = process;
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
  function o(l, g) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (l && !g && i === void 0)
      return 0;
    const u = i || 0;
    if (n.TERM === "dumb")
      return u;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in n) || n.CI_NAME === "codeship" ? 1 : u;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const f = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : u;
  }
  function s(l) {
    const g = o(l, l && l.isTTY);
    return a(g);
  }
  return fa = {
    supportsColor: s,
    stdout: a(o(!0, t.isatty(1))),
    stderr: a(o(!0, t.isatty(2)))
  }, fa;
}
var ps;
function gp() {
  return ps || (ps = 1, function(e, t) {
    const r = jl, n = Qa;
    t.init = u, t.log = s, t.formatArgs = a, t.save = l, t.load = g, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const p = mp();
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
    t.inspectOpts = Object.keys(process.env).filter((p) => /^debug_/i.test(p)).reduce((p, y) => {
      const w = y.substring(6).toLowerCase().replace(/_([a-z])/g, (T, A) => A.toUpperCase());
      let d = process.env[y];
      return /^(yes|on|true|enabled)$/i.test(d) ? d = !0 : /^(no|off|false|disabled)$/i.test(d) ? d = !1 : d === "null" ? d = null : d = Number(d), p[w] = d, p;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function a(p) {
      const { namespace: y, useColors: w } = this;
      if (w) {
        const d = this.color, T = "\x1B[3" + (d < 8 ? d : "8;5;" + d), A = `  ${T};1m${y} \x1B[0m`;
        p[0] = A + p[0].split(`
`).join(`
` + A), p.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        p[0] = o() + y + " " + p[0];
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
    function g() {
      return process.env.DEBUG;
    }
    function u(p) {
      p.inspectOpts = {};
      const y = Object.keys(t.inspectOpts);
      for (let w = 0; w < y.length; w++)
        p.inspectOpts[y[w]] = t.inspectOpts[y[w]];
    }
    e.exports = Du()(t);
    const { formatters: f } = e.exports;
    f.o = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts).split(`
`).map((y) => y.trim()).join(" ");
    }, f.O = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts);
    };
  }(Bn, Bn.exports)), Bn.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? ka.exports = hp() : ka.exports = gp();
var vp = ka.exports, En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
En.ProgressCallbackTransform = void 0;
const yp = gn;
class Ep extends yp.Transform {
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
En.ProgressCallbackTransform = Ep;
Object.defineProperty(He, "__esModule", { value: !0 });
He.DigestTransform = He.HttpExecutor = He.HttpError = void 0;
He.createHttpError = Ma;
He.parseJson = $p;
He.configureRequestOptionsFromUrl = Nu;
He.configureRequestUrl = uo;
He.safeGetHeader = Sr;
He.configureRequestOptions = si;
He.safeStringifyJson = li;
const wp = vn, _p = vp, Tp = kt, Sp = gn, Pu = Ir, Ap = xt, ms = Rr, bp = En, qr = (0, _p.default)("electron-builder");
function Ma(e, t = null) {
  return new lo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + li(e.headers), t);
}
const Cp = /* @__PURE__ */ new Map([
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
class lo extends Error {
  constructor(t, r = `HTTP error: ${Cp.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
He.HttpError = lo;
function $p(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class oi {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Ap.CancellationToken(), n) {
    si(t);
    const i = n == null ? void 0 : JSON.stringify(n), a = i ? Buffer.from(i) : void 0;
    if (a != null) {
      qr(i);
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
    return qr.enabled && qr(`Request: ${li(t)}`), r.createPromise((a, o, s) => {
      const l = this.createRequest(t, (g) => {
        try {
          this.handleResponse(g, t, r, a, o, i, n);
        } catch (u) {
          o(u);
        }
      });
      this.addErrorAndTimeoutHandlers(l, o, t.timeout), this.addRedirectHandlers(l, t, o, i, (g) => {
        this.doApiRequest(g, r, n, i).then(a).catch(o);
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
    if (qr.enabled && qr(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${li(r)}`), t.statusCode === 404) {
      a(Ma(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const g = (l = t.statusCode) !== null && l !== void 0 ? l : 0, u = g >= 300 && g < 400, f = Sr(t, "location");
    if (u && f != null) {
      if (o > this.maxRedirects) {
        a(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(oi.prepareRedirectUrlOptions(f, r), n, s, o).then(i).catch(a);
      return;
    }
    t.setEncoding("utf8");
    let p = "";
    t.on("error", a), t.on("data", (y) => p += y), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const y = Sr(t, "content-type"), w = y != null && (Array.isArray(y) ? y.find((d) => d.includes("json")) != null : y.includes("json"));
          a(Ma(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${w ? JSON.stringify(JSON.parse(p)) : p}
          `));
        } else
          i(p.length === 0 ? null : p);
      } catch (y) {
        a(y);
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
      uo(t, s), si(s), this.doDownload(s, {
        destination: null,
        options: r,
        onCancel: a,
        callback: (l) => {
          l == null ? n(Buffer.concat(o)) : i(l);
        },
        responseHandler: (l, g) => {
          let u = 0;
          l.on("data", (f) => {
            if (u += f.length, u > 524288e3) {
              g(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            o.push(f);
          }), l.on("end", () => {
            g(null);
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
      const o = Sr(a, "location");
      if (o != null) {
        n < this.maxRedirects ? this.doDownload(oi.prepareRedirectUrlOptions(o, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? Op(r, a) : r.responseHandler(a, r.callback);
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
    const n = Nu(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const a = new Pu.URL(t);
      (a.hostname.endsWith(".amazonaws.com") || a.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof lo && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
He.HttpExecutor = oi;
function Nu(e, t) {
  const r = si(t);
  return uo(new Pu.URL(e), r), r;
}
function uo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Ba extends Sp.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, wp.createHash)(r);
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
      throw (0, ms.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, ms.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
He.DigestTransform = Ba;
function Ip(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Sr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function Op(e, t) {
  if (!Ip(Sr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const o = Sr(t, "content-length");
    o != null && r.push(new bp.ProgressCallbackTransform(parseInt(o, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Ba(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Ba(e.options.sha2, "sha256", "hex"));
  const i = (0, Tp.createWriteStream)(e.destination);
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
function si(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function li(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.MemoLazy = void 0;
class Rp {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && xu(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
_i.MemoLazy = Rp;
function xu(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), a = Object.keys(t);
    return i.length === a.length && i.every((o) => xu(e[o], t[o]));
  }
  return e === t;
}
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.githubUrl = Dp;
Ti.getS3LikeProviderBaseUrl = Pp;
function Dp(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Pp(e) {
  const t = e.provider;
  if (t === "s3")
    return Np(e);
  if (t === "spaces")
    return xp(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Np(e) {
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
  return Fu(t, e.path);
}
function Fu(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function xp(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Fu(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
co.retry = Lu;
const Fp = xt;
async function Lu(e, t, r, n = 0, i = 0, a) {
  var o;
  const s = new Fp.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((o = a == null ? void 0 : a(l)) !== null && o !== void 0) || o) && t > 0 && !s.cancelled)
      return await new Promise((g) => setTimeout(g, r + n * i)), await Lu(e, t - 1, r, n, i + 1, a);
    throw l;
  }
}
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
fo.parseDn = Lp;
function Lp(e) {
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
var Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.nil = Cr.UUID = void 0;
const Uu = vn, ku = Rr, Up = "options.name must be either a string or a Buffer", gs = (0, Uu.randomBytes)(16);
gs[0] = gs[0] | 1;
const ri = {}, re = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  ri[t] = e, re[e] = t;
}
class tr {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = tr.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return kp(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Mp(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (ri[t[14] + t[15]] & 240) >> 4,
        variant: vs((ri[t[19] + t[20]] & 224) >> 5),
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
        variant: vs((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, ku.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = ri[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
Cr.UUID = tr;
tr.OID = tr.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function vs(e) {
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
var Qr;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Qr || (Qr = {}));
function kp(e, t, r, n, i = Qr.ASCII) {
  const a = (0, Uu.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, ku.newError)(Up, "ERR_INVALID_UUID_NAME");
  a.update(n), a.update(e);
  const s = a.digest();
  let l;
  switch (i) {
    case Qr.BINARY:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Qr.OBJECT:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = new tr(s);
      break;
    default:
      l = re[s[0]] + re[s[1]] + re[s[2]] + re[s[3]] + "-" + re[s[4]] + re[s[5]] + "-" + re[s[6] & 15 | r] + re[s[7]] + "-" + re[s[8] & 63 | 128] + re[s[9]] + "-" + re[s[10]] + re[s[11]] + re[s[12]] + re[s[13]] + re[s[14]] + re[s[15]];
      break;
  }
  return l;
}
function Mp(e) {
  return re[e[0]] + re[e[1]] + re[e[2]] + re[e[3]] + "-" + re[e[4]] + re[e[5]] + "-" + re[e[6]] + re[e[7]] + "-" + re[e[8]] + re[e[9]] + "-" + re[e[10]] + re[e[11]] + re[e[12]] + re[e[13]] + re[e[14]] + re[e[15]];
}
Cr.nil = new tr("00000000-0000-0000-0000-000000000000");
var wn = {}, Mu = {};
(function(e) {
  (function(t) {
    t.parser = function(m, c) {
      return new n(m, c);
    }, t.SAXParser = n, t.SAXStream = u, t.createStream = g, t.MAX_BUFFER_LENGTH = 64 * 1024;
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
    function n(m, c) {
      if (!(this instanceof n))
        return new n(m, c);
      var C = this;
      a(C), C.q = C.c = "", C.bufferCheckPosition = t.MAX_BUFFER_LENGTH, C.opt = c || {}, C.opt.lowercase = C.opt.lowercase || C.opt.lowercasetags, C.looseCase = C.opt.lowercase ? "toLowerCase" : "toUpperCase", C.tags = [], C.closed = C.closedRoot = C.sawRoot = !1, C.tag = C.error = null, C.strict = !!m, C.noscript = !!(m || C.opt.noscript), C.state = E.BEGIN, C.strictEntities = C.opt.strictEntities, C.ENTITIES = C.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), C.attribList = [], C.opt.xmlns && (C.ns = Object.create(d)), C.opt.unquotedAttributeValues === void 0 && (C.opt.unquotedAttributeValues = !m), C.trackPosition = C.opt.position !== !1, C.trackPosition && (C.position = C.line = C.column = 0), K(C, "onready");
    }
    Object.create || (Object.create = function(m) {
      function c() {
      }
      c.prototype = m;
      var C = new c();
      return C;
    }), Object.keys || (Object.keys = function(m) {
      var c = [];
      for (var C in m) m.hasOwnProperty(C) && c.push(C);
      return c;
    });
    function i(m) {
      for (var c = Math.max(t.MAX_BUFFER_LENGTH, 10), C = 0, h = 0, S = r.length; h < S; h++) {
        var O = m[r[h]].length;
        if (O > c)
          switch (r[h]) {
            case "textNode":
              ne(m);
              break;
            case "cdata":
              Y(m, "oncdata", m.cdata), m.cdata = "";
              break;
            case "script":
              Y(m, "onscript", m.script), m.script = "";
              break;
            default:
              I(m, "Max buffer length exceeded: " + r[h]);
          }
        C = Math.max(C, O);
      }
      var P = t.MAX_BUFFER_LENGTH - C;
      m.bufferCheckPosition = P + m.position;
    }
    function a(m) {
      for (var c = 0, C = r.length; c < C; c++)
        m[r[c]] = "";
    }
    function o(m) {
      ne(m), m.cdata !== "" && (Y(m, "oncdata", m.cdata), m.cdata = ""), m.script !== "" && (Y(m, "onscript", m.script), m.script = "");
    }
    n.prototype = {
      end: function() {
        L(this);
      },
      write: ae,
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
    var l = t.EVENTS.filter(function(m) {
      return m !== "error" && m !== "end";
    });
    function g(m, c) {
      return new u(m, c);
    }
    function u(m, c) {
      if (!(this instanceof u))
        return new u(m, c);
      s.apply(this), this._parser = new n(m, c), this.writable = !0, this.readable = !0;
      var C = this;
      this._parser.onend = function() {
        C.emit("end");
      }, this._parser.onerror = function(h) {
        C.emit("error", h), C._parser.error = null;
      }, this._decoder = null, l.forEach(function(h) {
        Object.defineProperty(C, "on" + h, {
          get: function() {
            return C._parser["on" + h];
          },
          set: function(S) {
            if (!S)
              return C.removeAllListeners(h), C._parser["on" + h] = S, S;
            C.on(h, S);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    u.prototype = Object.create(s.prototype, {
      constructor: {
        value: u
      }
    }), u.prototype.write = function(m) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(m)) {
        if (!this._decoder) {
          var c = Rf.StringDecoder;
          this._decoder = new c("utf8");
        }
        m = this._decoder.write(m);
      }
      return this._parser.write(m.toString()), this.emit("data", m), !0;
    }, u.prototype.end = function(m) {
      return m && m.length && this.write(m), this._parser.end(), !0;
    }, u.prototype.on = function(m, c) {
      var C = this;
      return !C._parser["on" + m] && l.indexOf(m) !== -1 && (C._parser["on" + m] = function() {
        var h = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        h.splice(0, 0, m), C.emit.apply(C, h);
      }), s.prototype.on.call(C, m, c);
    };
    var f = "[CDATA[", p = "DOCTYPE", y = "http://www.w3.org/XML/1998/namespace", w = "http://www.w3.org/2000/xmlns/", d = { xml: y, xmlns: w }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, b = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, M = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function B(m) {
      return m === " " || m === `
` || m === "\r" || m === "	";
    }
    function Q(m) {
      return m === '"' || m === "'";
    }
    function ve(m) {
      return m === ">" || B(m);
    }
    function te(m, c) {
      return m.test(c);
    }
    function ge(m, c) {
      return !te(m, c);
    }
    var E = 0;
    t.STATE = {
      BEGIN: E++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: E++,
      // leading whitespace
      TEXT: E++,
      // general stuff
      TEXT_ENTITY: E++,
      // &amp and such.
      OPEN_WAKA: E++,
      // <
      SGML_DECL: E++,
      // <!BLARG
      SGML_DECL_QUOTED: E++,
      // <!BLARG foo "bar
      DOCTYPE: E++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: E++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: E++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: E++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: E++,
      // <!-
      COMMENT: E++,
      // <!--
      COMMENT_ENDING: E++,
      // <!-- blah -
      COMMENT_ENDED: E++,
      // <!-- blah --
      CDATA: E++,
      // <![CDATA[ something
      CDATA_ENDING: E++,
      // ]
      CDATA_ENDING_2: E++,
      // ]]
      PROC_INST: E++,
      // <?hi
      PROC_INST_BODY: E++,
      // <?hi there
      PROC_INST_ENDING: E++,
      // <?hi "there" ?
      OPEN_TAG: E++,
      // <strong
      OPEN_TAG_SLASH: E++,
      // <strong /
      ATTRIB: E++,
      // <a
      ATTRIB_NAME: E++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: E++,
      // <a foo _
      ATTRIB_VALUE: E++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: E++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: E++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: E++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: E++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: E++,
      // <foo bar=&quot
      CLOSE_TAG: E++,
      // </a
      CLOSE_TAG_SAW_WHITE: E++,
      // </a   >
      SCRIPT: E++,
      // <script> ...
      SCRIPT_ENDING: E++
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
    }, Object.keys(t.ENTITIES).forEach(function(m) {
      var c = t.ENTITIES[m], C = typeof c == "number" ? String.fromCharCode(c) : c;
      t.ENTITIES[m] = C;
    });
    for (var J in t.STATE)
      t.STATE[t.STATE[J]] = J;
    E = t.STATE;
    function K(m, c, C) {
      m[c] && m[c](C);
    }
    function Y(m, c, C) {
      m.textNode && ne(m), K(m, c, C);
    }
    function ne(m) {
      m.textNode = N(m.opt, m.textNode), m.textNode && K(m, "ontext", m.textNode), m.textNode = "";
    }
    function N(m, c) {
      return m.trim && (c = c.trim()), m.normalize && (c = c.replace(/\s+/g, " ")), c;
    }
    function I(m, c) {
      return ne(m), m.trackPosition && (c += `
Line: ` + m.line + `
Column: ` + m.column + `
Char: ` + m.c), c = new Error(c), m.error = c, K(m, "onerror", c), m;
    }
    function L(m) {
      return m.sawRoot && !m.closedRoot && $(m, "Unclosed root tag"), m.state !== E.BEGIN && m.state !== E.BEGIN_WHITESPACE && m.state !== E.TEXT && I(m, "Unexpected end"), ne(m), m.c = "", m.closed = !0, K(m, "onend"), n.call(m, m.strict, m.opt), m;
    }
    function $(m, c) {
      if (typeof m != "object" || !(m instanceof n))
        throw new Error("bad call to strictFail");
      m.strict && I(m, c);
    }
    function k(m) {
      m.strict || (m.tagName = m.tagName[m.looseCase]());
      var c = m.tags[m.tags.length - 1] || m, C = m.tag = { name: m.tagName, attributes: {} };
      m.opt.xmlns && (C.ns = c.ns), m.attribList.length = 0, Y(m, "onopentagstart", C);
    }
    function x(m, c) {
      var C = m.indexOf(":"), h = C < 0 ? ["", m] : m.split(":"), S = h[0], O = h[1];
      return c && m === "xmlns" && (S = "xmlns", O = ""), { prefix: S, local: O };
    }
    function W(m) {
      if (m.strict || (m.attribName = m.attribName[m.looseCase]()), m.attribList.indexOf(m.attribName) !== -1 || m.tag.attributes.hasOwnProperty(m.attribName)) {
        m.attribName = m.attribValue = "";
        return;
      }
      if (m.opt.xmlns) {
        var c = x(m.attribName, !0), C = c.prefix, h = c.local;
        if (C === "xmlns")
          if (h === "xml" && m.attribValue !== y)
            $(
              m,
              "xml: prefix must be bound to " + y + `
Actual: ` + m.attribValue
            );
          else if (h === "xmlns" && m.attribValue !== w)
            $(
              m,
              "xmlns: prefix must be bound to " + w + `
Actual: ` + m.attribValue
            );
          else {
            var S = m.tag, O = m.tags[m.tags.length - 1] || m;
            S.ns === O.ns && (S.ns = Object.create(O.ns)), S.ns[h] = m.attribValue;
          }
        m.attribList.push([m.attribName, m.attribValue]);
      } else
        m.tag.attributes[m.attribName] = m.attribValue, Y(m, "onattribute", {
          name: m.attribName,
          value: m.attribValue
        });
      m.attribName = m.attribValue = "";
    }
    function Z(m, c) {
      if (m.opt.xmlns) {
        var C = m.tag, h = x(m.tagName);
        C.prefix = h.prefix, C.local = h.local, C.uri = C.ns[h.prefix] || "", C.prefix && !C.uri && ($(
          m,
          "Unbound namespace prefix: " + JSON.stringify(m.tagName)
        ), C.uri = h.prefix);
        var S = m.tags[m.tags.length - 1] || m;
        C.ns && S.ns !== C.ns && Object.keys(C.ns).forEach(function(de) {
          Y(m, "onopennamespace", {
            prefix: de,
            uri: C.ns[de]
          });
        });
        for (var O = 0, P = m.attribList.length; O < P; O++) {
          var F = m.attribList[O], U = F[0], q = F[1], H = x(U, !0), X = H.prefix, ue = H.local, ce = X === "" ? "" : C.ns[X] || "", pe = {
            name: U,
            value: q,
            prefix: X,
            local: ue,
            uri: ce
          };
          X && X !== "xmlns" && !ce && ($(
            m,
            "Unbound namespace prefix: " + JSON.stringify(X)
          ), pe.uri = X), m.tag.attributes[U] = pe, Y(m, "onattribute", pe);
        }
        m.attribList.length = 0;
      }
      m.tag.isSelfClosing = !!c, m.sawRoot = !0, m.tags.push(m.tag), Y(m, "onopentag", m.tag), c || (!m.noscript && m.tagName.toLowerCase() === "script" ? m.state = E.SCRIPT : m.state = E.TEXT, m.tag = null, m.tagName = ""), m.attribName = m.attribValue = "", m.attribList.length = 0;
    }
    function z(m) {
      if (!m.tagName) {
        $(m, "Weird empty close tag."), m.textNode += "</>", m.state = E.TEXT;
        return;
      }
      if (m.script) {
        if (m.tagName !== "script") {
          m.script += "</" + m.tagName + ">", m.tagName = "", m.state = E.SCRIPT;
          return;
        }
        Y(m, "onscript", m.script), m.script = "";
      }
      var c = m.tags.length, C = m.tagName;
      m.strict || (C = C[m.looseCase]());
      for (var h = C; c--; ) {
        var S = m.tags[c];
        if (S.name !== h)
          $(m, "Unexpected close tag");
        else
          break;
      }
      if (c < 0) {
        $(m, "Unmatched closing tag: " + m.tagName), m.textNode += "</" + m.tagName + ">", m.state = E.TEXT;
        return;
      }
      m.tagName = C;
      for (var O = m.tags.length; O-- > c; ) {
        var P = m.tag = m.tags.pop();
        m.tagName = m.tag.name, Y(m, "onclosetag", m.tagName);
        var F = {};
        for (var U in P.ns)
          F[U] = P.ns[U];
        var q = m.tags[m.tags.length - 1] || m;
        m.opt.xmlns && P.ns !== q.ns && Object.keys(P.ns).forEach(function(H) {
          var X = P.ns[H];
          Y(m, "onclosenamespace", { prefix: H, uri: X });
        });
      }
      c === 0 && (m.closedRoot = !0), m.tagName = m.attribValue = m.attribName = "", m.attribList.length = 0, m.state = E.TEXT;
    }
    function ie(m) {
      var c = m.entity, C = c.toLowerCase(), h, S = "";
      return m.ENTITIES[c] ? m.ENTITIES[c] : m.ENTITIES[C] ? m.ENTITIES[C] : (c = C, c.charAt(0) === "#" && (c.charAt(1) === "x" ? (c = c.slice(2), h = parseInt(c, 16), S = h.toString(16)) : (c = c.slice(1), h = parseInt(c, 10), S = h.toString(10))), c = c.replace(/^0+/, ""), isNaN(h) || S.toLowerCase() !== c || h < 0 || h > 1114111 ? ($(m, "Invalid character entity"), "&" + m.entity + ";") : String.fromCodePoint(h));
    }
    function Te(m, c) {
      c === "<" ? (m.state = E.OPEN_WAKA, m.startTagPosition = m.position) : B(c) || ($(m, "Non-whitespace before first tag."), m.textNode = c, m.state = E.TEXT);
    }
    function V(m, c) {
      var C = "";
      return c < m.length && (C = m.charAt(c)), C;
    }
    function ae(m) {
      var c = this;
      if (this.error)
        throw this.error;
      if (c.closed)
        return I(
          c,
          "Cannot write after close. Assign an onready handler."
        );
      if (m === null)
        return L(c);
      typeof m == "object" && (m = m.toString());
      for (var C = 0, h = ""; h = V(m, C++), c.c = h, !!h; )
        switch (c.trackPosition && (c.position++, h === `
` ? (c.line++, c.column = 0) : c.column++), c.state) {
          case E.BEGIN:
            if (c.state = E.BEGIN_WHITESPACE, h === "\uFEFF")
              continue;
            Te(c, h);
            continue;
          case E.BEGIN_WHITESPACE:
            Te(c, h);
            continue;
          case E.TEXT:
            if (c.sawRoot && !c.closedRoot) {
              for (var O = C - 1; h && h !== "<" && h !== "&"; )
                h = V(m, C++), h && c.trackPosition && (c.position++, h === `
` ? (c.line++, c.column = 0) : c.column++);
              c.textNode += m.substring(O, C - 1);
            }
            h === "<" && !(c.sawRoot && c.closedRoot && !c.strict) ? (c.state = E.OPEN_WAKA, c.startTagPosition = c.position) : (!B(h) && (!c.sawRoot || c.closedRoot) && $(c, "Text data outside of root node."), h === "&" ? c.state = E.TEXT_ENTITY : c.textNode += h);
            continue;
          case E.SCRIPT:
            h === "<" ? c.state = E.SCRIPT_ENDING : c.script += h;
            continue;
          case E.SCRIPT_ENDING:
            h === "/" ? c.state = E.CLOSE_TAG : (c.script += "<" + h, c.state = E.SCRIPT);
            continue;
          case E.OPEN_WAKA:
            if (h === "!")
              c.state = E.SGML_DECL, c.sgmlDecl = "";
            else if (!B(h)) if (te(T, h))
              c.state = E.OPEN_TAG, c.tagName = h;
            else if (h === "/")
              c.state = E.CLOSE_TAG, c.tagName = "";
            else if (h === "?")
              c.state = E.PROC_INST, c.procInstName = c.procInstBody = "";
            else {
              if ($(c, "Unencoded <"), c.startTagPosition + 1 < c.position) {
                var S = c.position - c.startTagPosition;
                h = new Array(S).join(" ") + h;
              }
              c.textNode += "<" + h, c.state = E.TEXT;
            }
            continue;
          case E.SGML_DECL:
            if (c.sgmlDecl + h === "--") {
              c.state = E.COMMENT, c.comment = "", c.sgmlDecl = "";
              continue;
            }
            c.doctype && c.doctype !== !0 && c.sgmlDecl ? (c.state = E.DOCTYPE_DTD, c.doctype += "<!" + c.sgmlDecl + h, c.sgmlDecl = "") : (c.sgmlDecl + h).toUpperCase() === f ? (Y(c, "onopencdata"), c.state = E.CDATA, c.sgmlDecl = "", c.cdata = "") : (c.sgmlDecl + h).toUpperCase() === p ? (c.state = E.DOCTYPE, (c.doctype || c.sawRoot) && $(
              c,
              "Inappropriately located doctype declaration"
            ), c.doctype = "", c.sgmlDecl = "") : h === ">" ? (Y(c, "onsgmldeclaration", c.sgmlDecl), c.sgmlDecl = "", c.state = E.TEXT) : (Q(h) && (c.state = E.SGML_DECL_QUOTED), c.sgmlDecl += h);
            continue;
          case E.SGML_DECL_QUOTED:
            h === c.q && (c.state = E.SGML_DECL, c.q = ""), c.sgmlDecl += h;
            continue;
          case E.DOCTYPE:
            h === ">" ? (c.state = E.TEXT, Y(c, "ondoctype", c.doctype), c.doctype = !0) : (c.doctype += h, h === "[" ? c.state = E.DOCTYPE_DTD : Q(h) && (c.state = E.DOCTYPE_QUOTED, c.q = h));
            continue;
          case E.DOCTYPE_QUOTED:
            c.doctype += h, h === c.q && (c.q = "", c.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            h === "]" ? (c.doctype += h, c.state = E.DOCTYPE) : h === "<" ? (c.state = E.OPEN_WAKA, c.startTagPosition = c.position) : Q(h) ? (c.doctype += h, c.state = E.DOCTYPE_DTD_QUOTED, c.q = h) : c.doctype += h;
            continue;
          case E.DOCTYPE_DTD_QUOTED:
            c.doctype += h, h === c.q && (c.state = E.DOCTYPE_DTD, c.q = "");
            continue;
          case E.COMMENT:
            h === "-" ? c.state = E.COMMENT_ENDING : c.comment += h;
            continue;
          case E.COMMENT_ENDING:
            h === "-" ? (c.state = E.COMMENT_ENDED, c.comment = N(c.opt, c.comment), c.comment && Y(c, "oncomment", c.comment), c.comment = "") : (c.comment += "-" + h, c.state = E.COMMENT);
            continue;
          case E.COMMENT_ENDED:
            h !== ">" ? ($(c, "Malformed comment"), c.comment += "--" + h, c.state = E.COMMENT) : c.doctype && c.doctype !== !0 ? c.state = E.DOCTYPE_DTD : c.state = E.TEXT;
            continue;
          case E.CDATA:
            for (var O = C - 1; h && h !== "]"; )
              h = V(m, C++), h && c.trackPosition && (c.position++, h === `
` ? (c.line++, c.column = 0) : c.column++);
            c.cdata += m.substring(O, C - 1), h === "]" && (c.state = E.CDATA_ENDING);
            continue;
          case E.CDATA_ENDING:
            h === "]" ? c.state = E.CDATA_ENDING_2 : (c.cdata += "]" + h, c.state = E.CDATA);
            continue;
          case E.CDATA_ENDING_2:
            h === ">" ? (c.cdata && Y(c, "oncdata", c.cdata), Y(c, "onclosecdata"), c.cdata = "", c.state = E.TEXT) : h === "]" ? c.cdata += "]" : (c.cdata += "]]" + h, c.state = E.CDATA);
            continue;
          case E.PROC_INST:
            h === "?" ? c.state = E.PROC_INST_ENDING : B(h) ? c.state = E.PROC_INST_BODY : c.procInstName += h;
            continue;
          case E.PROC_INST_BODY:
            if (!c.procInstBody && B(h))
              continue;
            h === "?" ? c.state = E.PROC_INST_ENDING : c.procInstBody += h;
            continue;
          case E.PROC_INST_ENDING:
            h === ">" ? (Y(c, "onprocessinginstruction", {
              name: c.procInstName,
              body: c.procInstBody
            }), c.procInstName = c.procInstBody = "", c.state = E.TEXT) : (c.procInstBody += "?" + h, c.state = E.PROC_INST_BODY);
            continue;
          case E.OPEN_TAG:
            te(A, h) ? c.tagName += h : (k(c), h === ">" ? Z(c) : h === "/" ? c.state = E.OPEN_TAG_SLASH : (B(h) || $(c, "Invalid character in tag name"), c.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            h === ">" ? (Z(c, !0), z(c)) : ($(
              c,
              "Forward-slash in opening tag not followed by >"
            ), c.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (B(h))
              continue;
            h === ">" ? Z(c) : h === "/" ? c.state = E.OPEN_TAG_SLASH : te(T, h) ? (c.attribName = h, c.attribValue = "", c.state = E.ATTRIB_NAME) : $(c, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            h === "=" ? c.state = E.ATTRIB_VALUE : h === ">" ? ($(c, "Attribute without value"), c.attribValue = c.attribName, W(c), Z(c)) : B(h) ? c.state = E.ATTRIB_NAME_SAW_WHITE : te(A, h) ? c.attribName += h : $(c, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME_SAW_WHITE:
            if (h === "=")
              c.state = E.ATTRIB_VALUE;
            else {
              if (B(h))
                continue;
              $(c, "Attribute without value"), c.tag.attributes[c.attribName] = "", c.attribValue = "", Y(c, "onattribute", {
                name: c.attribName,
                value: ""
              }), c.attribName = "", h === ">" ? Z(c) : te(T, h) ? (c.attribName = h, c.state = E.ATTRIB_NAME) : ($(c, "Invalid attribute name"), c.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (B(h))
              continue;
            Q(h) ? (c.q = h, c.state = E.ATTRIB_VALUE_QUOTED) : (c.opt.unquotedAttributeValues || I(c, "Unquoted attribute value"), c.state = E.ATTRIB_VALUE_UNQUOTED, c.attribValue = h);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (h !== c.q) {
              h === "&" ? c.state = E.ATTRIB_VALUE_ENTITY_Q : c.attribValue += h;
              continue;
            }
            W(c), c.q = "", c.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            B(h) ? c.state = E.ATTRIB : h === ">" ? Z(c) : h === "/" ? c.state = E.OPEN_TAG_SLASH : te(T, h) ? ($(c, "No whitespace between attributes"), c.attribName = h, c.attribValue = "", c.state = E.ATTRIB_NAME) : $(c, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!ve(h)) {
              h === "&" ? c.state = E.ATTRIB_VALUE_ENTITY_U : c.attribValue += h;
              continue;
            }
            W(c), h === ">" ? Z(c) : c.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (c.tagName)
              h === ">" ? z(c) : te(A, h) ? c.tagName += h : c.script ? (c.script += "</" + c.tagName, c.tagName = "", c.state = E.SCRIPT) : (B(h) || $(c, "Invalid tagname in closing tag"), c.state = E.CLOSE_TAG_SAW_WHITE);
            else {
              if (B(h))
                continue;
              ge(T, h) ? c.script ? (c.script += "</" + h, c.state = E.SCRIPT) : $(c, "Invalid tagname in closing tag.") : c.tagName = h;
            }
            continue;
          case E.CLOSE_TAG_SAW_WHITE:
            if (B(h))
              continue;
            h === ">" ? z(c) : $(c, "Invalid characters in closing tag");
            continue;
          case E.TEXT_ENTITY:
          case E.ATTRIB_VALUE_ENTITY_Q:
          case E.ATTRIB_VALUE_ENTITY_U:
            var P, F;
            switch (c.state) {
              case E.TEXT_ENTITY:
                P = E.TEXT, F = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                P = E.ATTRIB_VALUE_QUOTED, F = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                P = E.ATTRIB_VALUE_UNQUOTED, F = "attribValue";
                break;
            }
            if (h === ";") {
              var U = ie(c);
              c.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(U) ? (c.entity = "", c.state = P, c.write(U)) : (c[F] += U, c.entity = "", c.state = P);
            } else te(c.entity.length ? M : b, h) ? c.entity += h : ($(c, "Invalid character in entity name"), c[F] += "&" + c.entity + h, c.entity = "", c.state = P);
            continue;
          default:
            throw new Error(c, "Unknown state: " + c.state);
        }
      return c.position >= c.bufferCheckPosition && i(c), c;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var m = String.fromCharCode, c = Math.floor, C = function() {
        var h = 16384, S = [], O, P, F = -1, U = arguments.length;
        if (!U)
          return "";
        for (var q = ""; ++F < U; ) {
          var H = Number(arguments[F]);
          if (!isFinite(H) || // `NaN`, `+Infinity`, or `-Infinity`
          H < 0 || // not a valid Unicode code point
          H > 1114111 || // not a valid Unicode code point
          c(H) !== H)
            throw RangeError("Invalid code point: " + H);
          H <= 65535 ? S.push(H) : (H -= 65536, O = (H >> 10) + 55296, P = H % 1024 + 56320, S.push(O, P)), (F + 1 === U || S.length > h) && (q += m.apply(null, S), S.length = 0);
        }
        return q;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: C,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = C;
    }();
  })(e);
})(Mu);
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.XElement = void 0;
wn.parseXml = qp;
const Bp = Mu, jn = Rr;
class Bu {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, jn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Hp(t))
      throw (0, jn.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, jn.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, jn.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (ys(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => ys(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
wn.XElement = Bu;
const jp = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Hp(e) {
  return jp.test(e);
}
function ys(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function qp(e) {
  let t = null;
  const r = Bp.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const a = new Bu(i.name);
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
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = xt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = Rr;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = He;
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
  var i = _i;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var a = En;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return a.ProgressCallbackTransform;
  } });
  var o = Ti;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return o.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return o.githubUrl;
  } });
  var s = co;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = fo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var g = Cr;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return g.UUID;
  } });
  var u = wn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return u.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return u.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(p) {
    return p == null ? [] : Array.isArray(p) ? p : [p];
  }
})(Re);
var Fe = {}, ho = {}, ot = {};
function ju(e) {
  return typeof e > "u" || e === null;
}
function Gp(e) {
  return typeof e == "object" && e !== null;
}
function Vp(e) {
  return Array.isArray(e) ? e : ju(e) ? [] : [e];
}
function Wp(e, t) {
  var r, n, i, a;
  if (t)
    for (a = Object.keys(t), r = 0, n = a.length; r < n; r += 1)
      i = a[r], e[i] = t[i];
  return e;
}
function Yp(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function zp(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
ot.isNothing = ju;
ot.isObject = Gp;
ot.toArray = Vp;
ot.repeat = Yp;
ot.isNegativeZero = zp;
ot.extend = Wp;
function Hu(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function on(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Hu(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
on.prototype = Object.create(Error.prototype);
on.prototype.constructor = on;
on.prototype.toString = function(t) {
  return this.name + ": " + Hu(this, t);
};
var _n = on, zr = ot;
function da(e, t, r, n, i) {
  var a = "", o = "", s = Math.floor(i / 2) - 1;
  return n - t > s && (a = " ... ", t = n - s + a.length), r - n > s && (o = " ...", r = n + s - o.length), {
    str: a + e.slice(t, r).replace(/\t/g, "→") + o,
    pos: n - t + a.length
    // relative position
  };
}
function ha(e, t) {
  return zr.repeat(" ", t - e.length) + e;
}
function Xp(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], a, o = -1; a = r.exec(e.buffer); )
    i.push(a.index), n.push(a.index + a[0].length), e.position <= a.index && o < 0 && (o = n.length - 2);
  o < 0 && (o = n.length - 1);
  var s = "", l, g, u = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + u + 3);
  for (l = 1; l <= t.linesBefore && !(o - l < 0); l++)
    g = da(
      e.buffer,
      n[o - l],
      i[o - l],
      e.position - (n[o] - n[o - l]),
      f
    ), s = zr.repeat(" ", t.indent) + ha((e.line - l + 1).toString(), u) + " | " + g.str + `
` + s;
  for (g = da(e.buffer, n[o], i[o], e.position, f), s += zr.repeat(" ", t.indent) + ha((e.line + 1).toString(), u) + " | " + g.str + `
`, s += zr.repeat("-", t.indent + u + 3 + g.pos) + `^
`, l = 1; l <= t.linesAfter && !(o + l >= i.length); l++)
    g = da(
      e.buffer,
      n[o + l],
      i[o + l],
      e.position - (n[o] - n[o + l]),
      f
    ), s += zr.repeat(" ", t.indent) + ha((e.line + l + 1).toString(), u) + " | " + g.str + `
`;
  return s.replace(/\n$/, "");
}
var Kp = Xp, Es = _n, Jp = [
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
], Qp = [
  "scalar",
  "sequence",
  "mapping"
];
function Zp(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function em(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Jp.indexOf(r) === -1)
      throw new Es('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Zp(t.styleAliases || null), Qp.indexOf(this.kind) === -1)
    throw new Es('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var We = em, Gr = _n, pa = We;
function ws(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(a, o) {
      a.tag === n.tag && a.kind === n.kind && a.multi === n.multi && (i = o);
    }), r[i] = n;
  }), r;
}
function tm() {
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
function ja(e) {
  return this.extend(e);
}
ja.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof pa)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Gr("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(a) {
    if (!(a instanceof pa))
      throw new Gr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (a.loadKind && a.loadKind !== "scalar")
      throw new Gr("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (a.multi)
      throw new Gr("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(a) {
    if (!(a instanceof pa))
      throw new Gr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(ja.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = ws(i, "implicit"), i.compiledExplicit = ws(i, "explicit"), i.compiledTypeMap = tm(i.compiledImplicit, i.compiledExplicit), i;
};
var qu = ja, rm = We, Gu = new rm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), nm = We, Vu = new nm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), im = We, Wu = new im("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), am = qu, Yu = new am({
  explicit: [
    Gu,
    Vu,
    Wu
  ]
}), om = We;
function sm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function lm() {
  return null;
}
function um(e) {
  return e === null;
}
var zu = new om("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: sm,
  construct: lm,
  predicate: um,
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
}), cm = We;
function fm(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function dm(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function hm(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Xu = new cm("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: fm,
  construct: dm,
  predicate: hm,
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
}), pm = ot, mm = We;
function gm(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function vm(e) {
  return 48 <= e && e <= 55;
}
function ym(e) {
  return 48 <= e && e <= 57;
}
function Em(e) {
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
          if (!gm(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!vm(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!ym(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function wm(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function _m(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !pm.isNegativeZero(e);
}
var Ku = new mm("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Em,
  construct: wm,
  predicate: _m,
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
}), Ju = ot, Tm = We, Sm = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Am(e) {
  return !(e === null || !Sm.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function bm(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var Cm = /^[-+]?[0-9]+e/;
function $m(e, t) {
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
  else if (Ju.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), Cm.test(r) ? r.replace("e", ".e") : r;
}
function Im(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Ju.isNegativeZero(e));
}
var Qu = new Tm("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Am,
  construct: bm,
  predicate: Im,
  represent: $m,
  defaultStyle: "lowercase"
}), Zu = Yu.extend({
  implicit: [
    zu,
    Xu,
    Ku,
    Qu
  ]
}), ec = Zu, Om = We, tc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), rc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Rm(e) {
  return e === null ? !1 : tc.exec(e) !== null || rc.exec(e) !== null;
}
function Dm(e) {
  var t, r, n, i, a, o, s, l = 0, g = null, u, f, p;
  if (t = tc.exec(e), t === null && (t = rc.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (a = +t[4], o = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (u = +t[10], f = +(t[11] || 0), g = (u * 60 + f) * 6e4, t[9] === "-" && (g = -g)), p = new Date(Date.UTC(r, n, i, a, o, s, l)), g && p.setTime(p.getTime() - g), p;
}
function Pm(e) {
  return e.toISOString();
}
var nc = new Om("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Rm,
  construct: Dm,
  instanceOf: Date,
  represent: Pm
}), Nm = We;
function xm(e) {
  return e === "<<" || e === null;
}
var ic = new Nm("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: xm
}), Fm = We, po = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Lm(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, a = po;
  for (r = 0; r < i; r++)
    if (t = a.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Um(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, a = po, o = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)), o = o << 6 | a.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)) : r === 18 ? (s.push(o >> 10 & 255), s.push(o >> 2 & 255)) : r === 12 && s.push(o >> 4 & 255), new Uint8Array(s);
}
function km(e) {
  var t = "", r = 0, n, i, a = e.length, o = po;
  for (n = 0; n < a; n++)
    n % 3 === 0 && n && (t += o[r >> 18 & 63], t += o[r >> 12 & 63], t += o[r >> 6 & 63], t += o[r & 63]), r = (r << 8) + e[n];
  return i = a % 3, i === 0 ? (t += o[r >> 18 & 63], t += o[r >> 12 & 63], t += o[r >> 6 & 63], t += o[r & 63]) : i === 2 ? (t += o[r >> 10 & 63], t += o[r >> 4 & 63], t += o[r << 2 & 63], t += o[64]) : i === 1 && (t += o[r >> 2 & 63], t += o[r << 4 & 63], t += o[64], t += o[64]), t;
}
function Mm(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var ac = new Fm("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Lm,
  construct: Um,
  predicate: Mm,
  represent: km
}), Bm = We, jm = Object.prototype.hasOwnProperty, Hm = Object.prototype.toString;
function qm(e) {
  if (e === null) return !0;
  var t = [], r, n, i, a, o, s = e;
  for (r = 0, n = s.length; r < n; r += 1) {
    if (i = s[r], o = !1, Hm.call(i) !== "[object Object]") return !1;
    for (a in i)
      if (jm.call(i, a))
        if (!o) o = !0;
        else return !1;
    if (!o) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function Gm(e) {
  return e !== null ? e : [];
}
var oc = new Bm("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: qm,
  construct: Gm
}), Vm = We, Wm = Object.prototype.toString;
function Ym(e) {
  if (e === null) return !0;
  var t, r, n, i, a, o = e;
  for (a = new Array(o.length), t = 0, r = o.length; t < r; t += 1) {
    if (n = o[t], Wm.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    a[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function zm(e) {
  if (e === null) return [];
  var t, r, n, i, a, o = e;
  for (a = new Array(o.length), t = 0, r = o.length; t < r; t += 1)
    n = o[t], i = Object.keys(n), a[t] = [i[0], n[i[0]]];
  return a;
}
var sc = new Vm("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Ym,
  construct: zm
}), Xm = We, Km = Object.prototype.hasOwnProperty;
function Jm(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (Km.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Qm(e) {
  return e !== null ? e : {};
}
var lc = new Xm("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Jm,
  construct: Qm
}), mo = ec.extend({
  implicit: [
    nc,
    ic
  ],
  explicit: [
    ac,
    oc,
    sc,
    lc
  ]
}), Kt = ot, uc = _n, Zm = Kp, eg = mo, Ft = Object.prototype.hasOwnProperty, ui = 1, cc = 2, fc = 3, ci = 4, ma = 1, tg = 2, _s = 3, rg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, ng = /[\x85\u2028\u2029]/, ig = /[,\[\]\{\}]/, dc = /^(?:!|!!|![a-z\-]+!)$/i, hc = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Ts(e) {
  return Object.prototype.toString.call(e);
}
function ft(e) {
  return e === 10 || e === 13;
}
function Zt(e) {
  return e === 9 || e === 32;
}
function Ke(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function vr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function ag(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function og(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function sg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Ss(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function lg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function pc(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var mc = new Array(256), gc = new Array(256);
for (var fr = 0; fr < 256; fr++)
  mc[fr] = Ss(fr) ? 1 : 0, gc[fr] = Ss(fr);
function ug(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || eg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function vc(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Zm(r), new uc(t, r);
}
function G(e, t) {
  throw vc(e, t);
}
function fi(e, t) {
  e.onWarning && e.onWarning.call(null, vc(e, t));
}
var As = {
  YAML: function(t, r, n) {
    var i, a, o;
    t.version !== null && G(t, "duplication of %YAML directive"), n.length !== 1 && G(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && G(t, "ill-formed argument of the YAML directive"), a = parseInt(i[1], 10), o = parseInt(i[2], 10), a !== 1 && G(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = o < 2, o !== 1 && o !== 2 && fi(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, a;
    n.length !== 2 && G(t, "TAG directive accepts exactly two arguments"), i = n[0], a = n[1], dc.test(i) || G(t, "ill-formed tag handle (first argument) of the TAG directive"), Ft.call(t.tagMap, i) && G(t, 'there is a previously declared suffix for "' + i + '" tag handle'), hc.test(a) || G(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      a = decodeURIComponent(a);
    } catch {
      G(t, "tag prefix is malformed: " + a);
    }
    t.tagMap[i] = a;
  }
};
function Dt(e, t, r, n) {
  var i, a, o, s;
  if (t < r) {
    if (s = e.input.slice(t, r), n)
      for (i = 0, a = s.length; i < a; i += 1)
        o = s.charCodeAt(i), o === 9 || 32 <= o && o <= 1114111 || G(e, "expected valid JSON character");
    else rg.test(s) && G(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function bs(e, t, r, n) {
  var i, a, o, s;
  for (Kt.isObject(r) || G(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), o = 0, s = i.length; o < s; o += 1)
    a = i[o], Ft.call(t, a) || (pc(t, a, r[a]), n[a] = !0);
}
function yr(e, t, r, n, i, a, o, s, l) {
  var g, u;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), g = 0, u = i.length; g < u; g += 1)
      Array.isArray(i[g]) && G(e, "nested arrays are not supported inside keys"), typeof i == "object" && Ts(i[g]) === "[object Object]" && (i[g] = "[object Object]");
  if (typeof i == "object" && Ts(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(a))
      for (g = 0, u = a.length; g < u; g += 1)
        bs(e, t, a[g], r);
    else
      bs(e, t, a, r);
  else
    !e.json && !Ft.call(r, i) && Ft.call(t, i) && (e.line = o || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, G(e, "duplicated mapping key")), pc(t, i, a), delete r[i];
  return t;
}
function go(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : G(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Ae(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Zt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (ft(i))
      for (go(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && fi(e, "deficient indentation"), n;
}
function Si(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Ke(r)));
}
function vo(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Kt.repeat(`
`, t - 1));
}
function cg(e, t, r) {
  var n, i, a, o, s, l, g, u, f = e.kind, p = e.result, y;
  if (y = e.input.charCodeAt(e.position), Ke(y) || vr(y) || y === 35 || y === 38 || y === 42 || y === 33 || y === 124 || y === 62 || y === 39 || y === 34 || y === 37 || y === 64 || y === 96 || (y === 63 || y === 45) && (i = e.input.charCodeAt(e.position + 1), Ke(i) || r && vr(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", a = o = e.position, s = !1; y !== 0; ) {
    if (y === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ke(i) || r && vr(i))
        break;
    } else if (y === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Ke(n))
        break;
    } else {
      if (e.position === e.lineStart && Si(e) || r && vr(y))
        break;
      if (ft(y))
        if (l = e.line, g = e.lineStart, u = e.lineIndent, Ae(e, !1, -1), e.lineIndent >= t) {
          s = !0, y = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = o, e.line = l, e.lineStart = g, e.lineIndent = u;
          break;
        }
    }
    s && (Dt(e, a, o, !1), vo(e, e.line - l), a = o = e.position, s = !1), Zt(y) || (o = e.position + 1), y = e.input.charCodeAt(++e.position);
  }
  return Dt(e, a, o, !1), e.result ? !0 : (e.kind = f, e.result = p, !1);
}
function fg(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (Dt(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else ft(r) ? (Dt(e, n, i, !0), vo(e, Ae(e, !1, t)), n = i = e.position) : e.position === e.lineStart && Si(e) ? G(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  G(e, "unexpected end of the stream within a single quoted scalar");
}
function dg(e, t) {
  var r, n, i, a, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return Dt(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (Dt(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), ft(s))
        Ae(e, !1, t);
      else if (s < 256 && mc[s])
        e.result += gc[s], e.position++;
      else if ((o = og(s)) > 0) {
        for (i = o, a = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (o = ag(s)) >= 0 ? a = (a << 4) + o : G(e, "expected hexadecimal character");
        e.result += lg(a), e.position++;
      } else
        G(e, "unknown escape sequence");
      r = n = e.position;
    } else ft(s) ? (Dt(e, r, n, !0), vo(e, Ae(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Si(e) ? G(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  G(e, "unexpected end of the stream within a double quoted scalar");
}
function hg(e, t) {
  var r = !0, n, i, a, o = e.tag, s, l = e.anchor, g, u, f, p, y, w = /* @__PURE__ */ Object.create(null), d, T, A, b;
  if (b = e.input.charCodeAt(e.position), b === 91)
    u = 93, y = !1, s = [];
  else if (b === 123)
    u = 125, y = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), b = e.input.charCodeAt(++e.position); b !== 0; ) {
    if (Ae(e, !0, t), b = e.input.charCodeAt(e.position), b === u)
      return e.position++, e.tag = o, e.anchor = l, e.kind = y ? "mapping" : "sequence", e.result = s, !0;
    r ? b === 44 && G(e, "expected the node content, but found ','") : G(e, "missed comma between flow collection entries"), T = d = A = null, f = p = !1, b === 63 && (g = e.input.charCodeAt(e.position + 1), Ke(g) && (f = p = !0, e.position++, Ae(e, !0, t))), n = e.line, i = e.lineStart, a = e.position, $r(e, t, ui, !1, !0), T = e.tag, d = e.result, Ae(e, !0, t), b = e.input.charCodeAt(e.position), (p || e.line === n) && b === 58 && (f = !0, b = e.input.charCodeAt(++e.position), Ae(e, !0, t), $r(e, t, ui, !1, !0), A = e.result), y ? yr(e, s, w, T, d, A, n, i, a) : f ? s.push(yr(e, null, w, T, d, A, n, i, a)) : s.push(d), Ae(e, !0, t), b = e.input.charCodeAt(e.position), b === 44 ? (r = !0, b = e.input.charCodeAt(++e.position)) : r = !1;
  }
  G(e, "unexpected end of the stream within a flow collection");
}
function pg(e, t) {
  var r, n, i = ma, a = !1, o = !1, s = t, l = 0, g = !1, u, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      ma === i ? i = f === 43 ? _s : tg : G(e, "repeat of a chomping mode identifier");
    else if ((u = sg(f)) >= 0)
      u === 0 ? G(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? G(e, "repeat of an indentation width identifier") : (s = t + u - 1, o = !0);
    else
      break;
  if (Zt(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Zt(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!ft(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (go(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!o || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!o && e.lineIndent > s && (s = e.lineIndent), ft(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === _s ? e.result += Kt.repeat(`
`, a ? 1 + l : l) : i === ma && a && (e.result += `
`);
      break;
    }
    for (n ? Zt(f) ? (g = !0, e.result += Kt.repeat(`
`, a ? 1 + l : l)) : g ? (g = !1, e.result += Kt.repeat(`
`, l + 1)) : l === 0 ? a && (e.result += " ") : e.result += Kt.repeat(`
`, l) : e.result += Kt.repeat(`
`, a ? 1 + l : l), a = !0, o = !0, l = 0, r = e.position; !ft(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    Dt(e, r, e.position, !1);
  }
  return !0;
}
function Cs(e, t) {
  var r, n = e.tag, i = e.anchor, a = [], o, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, G(e, "tab characters must not be used in indentation")), !(l !== 45 || (o = e.input.charCodeAt(e.position + 1), !Ke(o)))); ) {
    if (s = !0, e.position++, Ae(e, !0, -1) && e.lineIndent <= t) {
      a.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, $r(e, t, fc, !1, !0), a.push(e.result), Ae(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      G(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function mg(e, t, r) {
  var n, i, a, o, s, l, g = e.tag, u = e.anchor, f = {}, p = /* @__PURE__ */ Object.create(null), y = null, w = null, d = null, T = !1, A = !1, b;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), b = e.input.charCodeAt(e.position); b !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, G(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), a = e.line, (b === 63 || b === 58) && Ke(n))
      b === 63 ? (T && (yr(e, f, p, y, w, null, o, s, l), y = w = d = null), A = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : G(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, b = n;
    else {
      if (o = e.line, s = e.lineStart, l = e.position, !$r(e, r, cc, !1, !0))
        break;
      if (e.line === a) {
        for (b = e.input.charCodeAt(e.position); Zt(b); )
          b = e.input.charCodeAt(++e.position);
        if (b === 58)
          b = e.input.charCodeAt(++e.position), Ke(b) || G(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (yr(e, f, p, y, w, null, o, s, l), y = w = d = null), A = !0, T = !1, i = !1, y = e.tag, w = e.result;
        else if (A)
          G(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = g, e.anchor = u, !0;
      } else if (A)
        G(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = g, e.anchor = u, !0;
    }
    if ((e.line === a || e.lineIndent > t) && (T && (o = e.line, s = e.lineStart, l = e.position), $r(e, t, ci, !0, i) && (T ? w = e.result : d = e.result), T || (yr(e, f, p, y, w, d, o, s, l), y = w = d = null), Ae(e, !0, -1), b = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && b !== 0)
      G(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && yr(e, f, p, y, w, null, o, s, l), A && (e.tag = g, e.anchor = u, e.kind = "mapping", e.result = f), A;
}
function gg(e) {
  var t, r = !1, n = !1, i, a, o;
  if (o = e.input.charCodeAt(e.position), o !== 33) return !1;
  if (e.tag !== null && G(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (r = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (n = !0, i = "!!", o = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      o = e.input.charCodeAt(++e.position);
    while (o !== 0 && o !== 62);
    e.position < e.length ? (a = e.input.slice(t, e.position), o = e.input.charCodeAt(++e.position)) : G(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; o !== 0 && !Ke(o); )
      o === 33 && (n ? G(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), dc.test(i) || G(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), o = e.input.charCodeAt(++e.position);
    a = e.input.slice(t, e.position), ig.test(a) && G(e, "tag suffix cannot contain flow indicator characters");
  }
  a && !hc.test(a) && G(e, "tag name cannot contain such characters: " + a);
  try {
    a = decodeURIComponent(a);
  } catch {
    G(e, "tag name is malformed: " + a);
  }
  return r ? e.tag = a : Ft.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : G(e, 'undeclared tag handle "' + i + '"'), !0;
}
function vg(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && G(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ke(r) && !vr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && G(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function yg(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ke(n) && !vr(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && G(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), Ft.call(e.anchorMap, r) || G(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], Ae(e, !0, -1), !0;
}
function $r(e, t, r, n, i) {
  var a, o, s, l = 1, g = !1, u = !1, f, p, y, w, d, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = o = s = ci === r || fc === r, n && Ae(e, !0, -1) && (g = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; gg(e) || vg(e); )
      Ae(e, !0, -1) ? (g = !0, s = a, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = g || i), (l === 1 || ci === r) && (ui === r || cc === r ? d = t : d = t + 1, T = e.position - e.lineStart, l === 1 ? s && (Cs(e, T) || mg(e, T, d)) || hg(e, d) ? u = !0 : (o && pg(e, d) || fg(e, d) || dg(e, d) ? u = !0 : yg(e) ? (u = !0, (e.tag !== null || e.anchor !== null) && G(e, "alias node should not have any properties")) : cg(e, d, ui === r) && (u = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (u = s && Cs(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && G(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, p = e.implicitTypes.length; f < p; f += 1)
      if (w = e.implicitTypes[f], w.resolve(e.result)) {
        e.result = w.construct(e.result), e.tag = w.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Ft.call(e.typeMap[e.kind || "fallback"], e.tag))
      w = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (w = null, y = e.typeMap.multi[e.kind || "fallback"], f = 0, p = y.length; f < p; f += 1)
        if (e.tag.slice(0, y[f].tag.length) === y[f].tag) {
          w = y[f];
          break;
        }
    w || G(e, "unknown tag !<" + e.tag + ">"), e.result !== null && w.kind !== e.kind && G(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + w.kind + '", not "' + e.kind + '"'), w.resolve(e.result, e.tag) ? (e.result = w.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : G(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || u;
}
function Eg(e) {
  var t = e.position, r, n, i, a = !1, o;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (o = e.input.charCodeAt(e.position)) !== 0 && (Ae(e, !0, -1), o = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || o !== 37)); ) {
    for (a = !0, o = e.input.charCodeAt(++e.position), r = e.position; o !== 0 && !Ke(o); )
      o = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && G(e, "directive name must not be less than one character in length"); o !== 0; ) {
      for (; Zt(o); )
        o = e.input.charCodeAt(++e.position);
      if (o === 35) {
        do
          o = e.input.charCodeAt(++e.position);
        while (o !== 0 && !ft(o));
        break;
      }
      if (ft(o)) break;
      for (r = e.position; o !== 0 && !Ke(o); )
        o = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    o !== 0 && go(e), Ft.call(As, n) ? As[n](e, n, i) : fi(e, 'unknown document directive "' + n + '"');
  }
  if (Ae(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Ae(e, !0, -1)) : a && G(e, "directives end mark is expected"), $r(e, e.lineIndent - 1, ci, !1, !0), Ae(e, !0, -1), e.checkLineBreaks && ng.test(e.input.slice(t, e.position)) && fi(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Si(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Ae(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    G(e, "end of the stream or a document separator is expected");
  else
    return;
}
function yc(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new ug(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, G(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    Eg(r);
  return r.documents;
}
function wg(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = yc(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, a = n.length; i < a; i += 1)
    t(n[i]);
}
function _g(e, t) {
  var r = yc(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new uc("expected a single document in the stream, but found more");
  }
}
ho.loadAll = wg;
ho.load = _g;
var Ec = {}, Ai = ot, Tn = _n, Tg = mo, wc = Object.prototype.toString, _c = Object.prototype.hasOwnProperty, yo = 65279, Sg = 9, sn = 10, Ag = 13, bg = 32, Cg = 33, $g = 34, Ha = 35, Ig = 37, Og = 38, Rg = 39, Dg = 42, Tc = 44, Pg = 45, di = 58, Ng = 61, xg = 62, Fg = 63, Lg = 64, Sc = 91, Ac = 93, Ug = 96, bc = 123, kg = 124, Cc = 125, ke = {};
ke[0] = "\\0";
ke[7] = "\\a";
ke[8] = "\\b";
ke[9] = "\\t";
ke[10] = "\\n";
ke[11] = "\\v";
ke[12] = "\\f";
ke[13] = "\\r";
ke[27] = "\\e";
ke[34] = '\\"';
ke[92] = "\\\\";
ke[133] = "\\N";
ke[160] = "\\_";
ke[8232] = "\\L";
ke[8233] = "\\P";
var Mg = [
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
], Bg = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function jg(e, t) {
  var r, n, i, a, o, s, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, a = n.length; i < a; i += 1)
    o = n[i], s = String(t[o]), o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2)), l = e.compiledTypeMap.fallback[o], l && _c.call(l.styleAliases, s) && (s = l.styleAliases[s]), r[o] = s;
  return r;
}
function Hg(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new Tn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + Ai.repeat("0", n - t.length) + t;
}
var qg = 1, ln = 2;
function Gg(e) {
  this.schema = e.schema || Tg, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Ai.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = jg(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? ln : qg, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function $s(e, t) {
  for (var r = Ai.repeat(" ", t), n = 0, i = -1, a = "", o, s = e.length; n < s; )
    i = e.indexOf(`
`, n), i === -1 ? (o = e.slice(n), n = s) : (o = e.slice(n, i + 1), n = i + 1), o.length && o !== `
` && (a += r), a += o;
  return a;
}
function qa(e, t) {
  return `
` + Ai.repeat(" ", e.indent * t);
}
function Vg(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function hi(e) {
  return e === bg || e === Sg;
}
function un(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== yo || 65536 <= e && e <= 1114111;
}
function Is(e) {
  return un(e) && e !== yo && e !== Ag && e !== sn;
}
function Os(e, t, r) {
  var n = Is(e), i = n && !hi(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== Tc && e !== Sc && e !== Ac && e !== bc && e !== Cc) && e !== Ha && !(t === di && !i) || Is(t) && !hi(t) && e === Ha || t === di && i
  );
}
function Wg(e) {
  return un(e) && e !== yo && !hi(e) && e !== Pg && e !== Fg && e !== di && e !== Tc && e !== Sc && e !== Ac && e !== bc && e !== Cc && e !== Ha && e !== Og && e !== Dg && e !== Cg && e !== kg && e !== Ng && e !== xg && e !== Rg && e !== $g && e !== Ig && e !== Lg && e !== Ug;
}
function Yg(e) {
  return !hi(e) && e !== di;
}
function Xr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function $c(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Ic = 1, Ga = 2, Oc = 3, Rc = 4, gr = 5;
function zg(e, t, r, n, i, a, o, s) {
  var l, g = 0, u = null, f = !1, p = !1, y = n !== -1, w = -1, d = Wg(Xr(e, 0)) && Yg(Xr(e, e.length - 1));
  if (t || o)
    for (l = 0; l < e.length; g >= 65536 ? l += 2 : l++) {
      if (g = Xr(e, l), !un(g))
        return gr;
      d = d && Os(g, u, s), u = g;
    }
  else {
    for (l = 0; l < e.length; g >= 65536 ? l += 2 : l++) {
      if (g = Xr(e, l), g === sn)
        f = !0, y && (p = p || // Foldable line = too long, and not more-indented.
        l - w - 1 > n && e[w + 1] !== " ", w = l);
      else if (!un(g))
        return gr;
      d = d && Os(g, u, s), u = g;
    }
    p = p || y && l - w - 1 > n && e[w + 1] !== " ";
  }
  return !f && !p ? d && !o && !i(e) ? Ic : a === ln ? gr : Ga : r > 9 && $c(e) ? gr : o ? a === ln ? gr : Ga : p ? Rc : Oc;
}
function Xg(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === ln ? '""' : "''";
    if (!e.noCompatMode && (Mg.indexOf(t) !== -1 || Bg.test(t)))
      return e.quotingType === ln ? '"' + t + '"' : "'" + t + "'";
    var a = e.indent * Math.max(1, r), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), s = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(g) {
      return Vg(e, g);
    }
    switch (zg(
      t,
      s,
      e.indent,
      o,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Ic:
        return t;
      case Ga:
        return "'" + t.replace(/'/g, "''") + "'";
      case Oc:
        return "|" + Rs(t, e.indent) + Ds($s(t, a));
      case Rc:
        return ">" + Rs(t, e.indent) + Ds($s(Kg(t, o), a));
      case gr:
        return '"' + Jg(t) + '"';
      default:
        throw new Tn("impossible error: invalid scalar style");
    }
  }();
}
function Rs(e, t) {
  var r = $c(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), a = i ? "+" : n ? "" : "-";
  return r + a + `
`;
}
function Ds(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function Kg(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var g = e.indexOf(`
`);
    return g = g !== -1 ? g : e.length, r.lastIndex = g, Ps(e.slice(0, g), t);
  }(), i = e[0] === `
` || e[0] === " ", a, o; o = r.exec(e); ) {
    var s = o[1], l = o[2];
    a = l[0] === " ", n += s + (!i && !a && l !== "" ? `
` : "") + Ps(l, t), i = a;
  }
  return n;
}
function Ps(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, a, o = 0, s = 0, l = ""; n = r.exec(e); )
    s = n.index, s - i > t && (a = o > i ? o : s, l += `
` + e.slice(i, a), i = a + 1), o = s;
  return l += `
`, e.length - i > t && o > i ? l += e.slice(i, o) + `
` + e.slice(o + 1) : l += e.slice(i), l.slice(1);
}
function Jg(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Xr(e, i), n = ke[r], !n && un(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || Hg(r);
  return t;
}
function Qg(e, t, r) {
  var n = "", i = e.tag, a, o, s;
  for (a = 0, o = r.length; a < o; a += 1)
    s = r[a], e.replacer && (s = e.replacer.call(r, String(a), s)), (_t(e, t, s, !1, !1) || typeof s > "u" && _t(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function Ns(e, t, r, n) {
  var i = "", a = e.tag, o, s, l;
  for (o = 0, s = r.length; o < s; o += 1)
    l = r[o], e.replacer && (l = e.replacer.call(r, String(o), l)), (_t(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && _t(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += qa(e, t)), e.dump && sn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = a, e.dump = i || "[]";
}
function Zg(e, t, r) {
  var n = "", i = e.tag, a = Object.keys(r), o, s, l, g, u;
  for (o = 0, s = a.length; o < s; o += 1)
    u = "", n !== "" && (u += ", "), e.condenseFlow && (u += '"'), l = a[o], g = r[l], e.replacer && (g = e.replacer.call(r, l, g)), _t(e, t, l, !1, !1) && (e.dump.length > 1024 && (u += "? "), u += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), _t(e, t, g, !1, !1) && (u += e.dump, n += u));
  e.tag = i, e.dump = "{" + n + "}";
}
function e0(e, t, r, n) {
  var i = "", a = e.tag, o = Object.keys(r), s, l, g, u, f, p;
  if (e.sortKeys === !0)
    o.sort();
  else if (typeof e.sortKeys == "function")
    o.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Tn("sortKeys must be a boolean or a function");
  for (s = 0, l = o.length; s < l; s += 1)
    p = "", (!n || i !== "") && (p += qa(e, t)), g = o[s], u = r[g], e.replacer && (u = e.replacer.call(r, g, u)), _t(e, t + 1, g, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && sn === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, f && (p += qa(e, t)), _t(e, t + 1, u, !0, f) && (e.dump && sn === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p));
  e.tag = a, e.dump = i || "{}";
}
function xs(e, t, r) {
  var n, i, a, o, s, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, a = 0, o = i.length; a < o; a += 1)
    if (s = i[a], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (r ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, wc.call(s.represent) === "[object Function]")
          n = s.represent(t, l);
        else if (_c.call(s.represent, l))
          n = s.represent[l](t, l);
        else
          throw new Tn("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function _t(e, t, r, n, i, a, o) {
  e.tag = null, e.dump = r, xs(e, r, !1) || xs(e, r, !0);
  var s = wc.call(e.dump), l = n, g;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var u = s === "[object Object]" || s === "[object Array]", f, p;
  if (u && (f = e.duplicates.indexOf(r), p = f !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (i = !1), p && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (u && p && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (e0(e, t, e.dump, i), p && (e.dump = "&ref_" + f + e.dump)) : (Zg(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? Ns(e, t - 1, e.dump, i) : Ns(e, t, e.dump, i), p && (e.dump = "&ref_" + f + e.dump)) : (Qg(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && Xg(e, e.dump, t, a, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Tn("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (g = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? g = "!" + g : g.slice(0, 18) === "tag:yaml.org,2002:" ? g = "!!" + g.slice(18) : g = "!<" + g + ">", e.dump = g + " " + e.dump);
  }
  return !0;
}
function t0(e, t) {
  var r = [], n = [], i, a;
  for (Va(e, r, n), i = 0, a = n.length; i < a; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(a);
}
function Va(e, t, r) {
  var n, i, a;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, a = e.length; i < a; i += 1)
        Va(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, a = n.length; i < a; i += 1)
        Va(e[n[i]], t, r);
}
function r0(e, t) {
  t = t || {};
  var r = new Gg(t);
  r.noRefs || t0(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), _t(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
Ec.dump = r0;
var Dc = ho, n0 = Ec;
function Eo(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Fe.Type = We;
Fe.Schema = qu;
Fe.FAILSAFE_SCHEMA = Yu;
Fe.JSON_SCHEMA = Zu;
Fe.CORE_SCHEMA = ec;
Fe.DEFAULT_SCHEMA = mo;
Fe.load = Dc.load;
Fe.loadAll = Dc.loadAll;
Fe.dump = n0.dump;
Fe.YAMLException = _n;
Fe.types = {
  binary: ac,
  float: Qu,
  map: Wu,
  null: zu,
  pairs: sc,
  set: lc,
  timestamp: nc,
  bool: Xu,
  int: Ku,
  merge: ic,
  omap: oc,
  seq: Vu,
  str: Gu
};
Fe.safeLoad = Eo("safeLoad", "load");
Fe.safeLoadAll = Eo("safeLoadAll", "loadAll");
Fe.safeDump = Eo("safeDump", "dump");
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.Lazy = void 0;
class i0 {
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
bi.Lazy = i0;
var Wa = { exports: {} };
const a0 = "2.0.0", Pc = 256, o0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, s0 = 16, l0 = Pc - 6, u0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Ci = {
  MAX_LENGTH: Pc,
  MAX_SAFE_COMPONENT_LENGTH: s0,
  MAX_SAFE_BUILD_LENGTH: l0,
  MAX_SAFE_INTEGER: o0,
  RELEASE_TYPES: u0,
  SEMVER_SPEC_VERSION: a0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const c0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var $i = c0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = Ci, a = $i;
  t = e.exports = {};
  const o = t.re = [], s = t.safeRe = [], l = t.src = [], g = t.safeSrc = [], u = t.t = {};
  let f = 0;
  const p = "[a-zA-Z0-9-]", y = [
    ["\\s", 1],
    ["\\d", i],
    [p, n]
  ], w = (T) => {
    for (const [A, b] of y)
      T = T.split(`${A}*`).join(`${A}{0,${b}}`).split(`${A}+`).join(`${A}{1,${b}}`);
    return T;
  }, d = (T, A, b) => {
    const M = w(A), B = f++;
    a(T, B, A), u[T] = B, l[B] = A, g[B] = M, o[B] = new RegExp(A, b ? "g" : void 0), s[B] = new RegExp(M, b ? "g" : void 0);
  };
  d("NUMERICIDENTIFIER", "0|[1-9]\\d*"), d("NUMERICIDENTIFIERLOOSE", "\\d+"), d("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${p}*`), d("MAINVERSION", `(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})`), d("MAINVERSIONLOOSE", `(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})`), d("PRERELEASEIDENTIFIER", `(?:${l[u.NONNUMERICIDENTIFIER]}|${l[u.NUMERICIDENTIFIER]})`), d("PRERELEASEIDENTIFIERLOOSE", `(?:${l[u.NONNUMERICIDENTIFIER]}|${l[u.NUMERICIDENTIFIERLOOSE]})`), d("PRERELEASE", `(?:-(${l[u.PRERELEASEIDENTIFIER]}(?:\\.${l[u.PRERELEASEIDENTIFIER]})*))`), d("PRERELEASELOOSE", `(?:-?(${l[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[u.PRERELEASEIDENTIFIERLOOSE]})*))`), d("BUILDIDENTIFIER", `${p}+`), d("BUILD", `(?:\\+(${l[u.BUILDIDENTIFIER]}(?:\\.${l[u.BUILDIDENTIFIER]})*))`), d("FULLPLAIN", `v?${l[u.MAINVERSION]}${l[u.PRERELEASE]}?${l[u.BUILD]}?`), d("FULL", `^${l[u.FULLPLAIN]}$`), d("LOOSEPLAIN", `[v=\\s]*${l[u.MAINVERSIONLOOSE]}${l[u.PRERELEASELOOSE]}?${l[u.BUILD]}?`), d("LOOSE", `^${l[u.LOOSEPLAIN]}$`), d("GTLT", "((?:<|>)?=?)"), d("XRANGEIDENTIFIERLOOSE", `${l[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), d("XRANGEIDENTIFIER", `${l[u.NUMERICIDENTIFIER]}|x|X|\\*`), d("XRANGEPLAIN", `[v=\\s]*(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:${l[u.PRERELEASE]})?${l[u.BUILD]}?)?)?`), d("XRANGEPLAINLOOSE", `[v=\\s]*(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:${l[u.PRERELEASELOOSE]})?${l[u.BUILD]}?)?)?`), d("XRANGE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAIN]}$`), d("XRANGELOOSE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAINLOOSE]}$`), d("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), d("COERCE", `${l[u.COERCEPLAIN]}(?:$|[^\\d])`), d("COERCEFULL", l[u.COERCEPLAIN] + `(?:${l[u.PRERELEASE]})?(?:${l[u.BUILD]})?(?:$|[^\\d])`), d("COERCERTL", l[u.COERCE], !0), d("COERCERTLFULL", l[u.COERCEFULL], !0), d("LONETILDE", "(?:~>?)"), d("TILDETRIM", `(\\s*)${l[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", d("TILDE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAIN]}$`), d("TILDELOOSE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAINLOOSE]}$`), d("LONECARET", "(?:\\^)"), d("CARETTRIM", `(\\s*)${l[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", d("CARET", `^${l[u.LONECARET]}${l[u.XRANGEPLAIN]}$`), d("CARETLOOSE", `^${l[u.LONECARET]}${l[u.XRANGEPLAINLOOSE]}$`), d("COMPARATORLOOSE", `^${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]})$|^$`), d("COMPARATOR", `^${l[u.GTLT]}\\s*(${l[u.FULLPLAIN]})$|^$`), d("COMPARATORTRIM", `(\\s*)${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]}|${l[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", d("HYPHENRANGE", `^\\s*(${l[u.XRANGEPLAIN]})\\s+-\\s+(${l[u.XRANGEPLAIN]})\\s*$`), d("HYPHENRANGELOOSE", `^\\s*(${l[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[u.XRANGEPLAINLOOSE]})\\s*$`), d("STAR", "(<|>)?=?\\s*\\*"), d("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), d("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Wa, Wa.exports);
var Sn = Wa.exports;
const f0 = Object.freeze({ loose: !0 }), d0 = Object.freeze({}), h0 = (e) => e ? typeof e != "object" ? f0 : e : d0;
var wo = h0;
const Fs = /^[0-9]+$/, Nc = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Fs.test(e), n = Fs.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, p0 = (e, t) => Nc(t, e);
var xc = {
  compareIdentifiers: Nc,
  rcompareIdentifiers: p0
};
const Hn = $i, { MAX_LENGTH: Ls, MAX_SAFE_INTEGER: qn } = Ci, { safeRe: Gn, t: Vn } = Sn, m0 = wo, { compareIdentifiers: ga } = xc;
let g0 = class ct {
  constructor(t, r) {
    if (r = m0(r), t instanceof ct) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ls)
      throw new TypeError(
        `version is longer than ${Ls} characters`
      );
    Hn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Gn[Vn.LOOSE] : Gn[Vn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > qn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > qn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > qn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const a = +i;
        if (a >= 0 && a < qn)
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
    if (Hn("SemVer.compare", this.version, this.options, t), !(t instanceof ct)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ct(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ct || (t = new ct(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof ct || (t = new ct(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (Hn("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return ga(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ct || (t = new ct(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (Hn("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return ga(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Gn[Vn.PRERELEASELOOSE] : Gn[Vn.PRERELEASE]);
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
          n === !1 && (a = [r]), ga(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ye = g0;
const Us = Ye, v0 = (e, t, r = !1) => {
  if (e instanceof Us)
    return e;
  try {
    return new Us(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Dr = v0;
const y0 = Dr, E0 = (e, t) => {
  const r = y0(e, t);
  return r ? r.version : null;
};
var w0 = E0;
const _0 = Dr, T0 = (e, t) => {
  const r = _0(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var S0 = T0;
const ks = Ye, A0 = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new ks(
      e instanceof ks ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var b0 = A0;
const Ms = Dr, C0 = (e, t) => {
  const r = Ms(e, null, !0), n = Ms(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const a = i > 0, o = a ? r : n, s = a ? n : r, l = !!o.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(o) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const u = l ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var $0 = C0;
const I0 = Ye, O0 = (e, t) => new I0(e, t).major;
var R0 = O0;
const D0 = Ye, P0 = (e, t) => new D0(e, t).minor;
var N0 = P0;
const x0 = Ye, F0 = (e, t) => new x0(e, t).patch;
var L0 = F0;
const U0 = Dr, k0 = (e, t) => {
  const r = U0(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var M0 = k0;
const Bs = Ye, B0 = (e, t, r) => new Bs(e, r).compare(new Bs(t, r));
var st = B0;
const j0 = st, H0 = (e, t, r) => j0(t, e, r);
var q0 = H0;
const G0 = st, V0 = (e, t) => G0(e, t, !0);
var W0 = V0;
const js = Ye, Y0 = (e, t, r) => {
  const n = new js(e, r), i = new js(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var _o = Y0;
const z0 = _o, X0 = (e, t) => e.sort((r, n) => z0(r, n, t));
var K0 = X0;
const J0 = _o, Q0 = (e, t) => e.sort((r, n) => J0(n, r, t));
var Z0 = Q0;
const ev = st, tv = (e, t, r) => ev(e, t, r) > 0;
var Ii = tv;
const rv = st, nv = (e, t, r) => rv(e, t, r) < 0;
var To = nv;
const iv = st, av = (e, t, r) => iv(e, t, r) === 0;
var Fc = av;
const ov = st, sv = (e, t, r) => ov(e, t, r) !== 0;
var Lc = sv;
const lv = st, uv = (e, t, r) => lv(e, t, r) >= 0;
var So = uv;
const cv = st, fv = (e, t, r) => cv(e, t, r) <= 0;
var Ao = fv;
const dv = Fc, hv = Lc, pv = Ii, mv = So, gv = To, vv = Ao, yv = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return dv(e, r, n);
    case "!=":
      return hv(e, r, n);
    case ">":
      return pv(e, r, n);
    case ">=":
      return mv(e, r, n);
    case "<":
      return gv(e, r, n);
    case "<=":
      return vv(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Uc = yv;
const Ev = Ye, wv = Dr, { safeRe: Wn, t: Yn } = Sn, _v = (e, t) => {
  if (e instanceof Ev)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Wn[Yn.COERCEFULL] : Wn[Yn.COERCE]);
  else {
    const l = t.includePrerelease ? Wn[Yn.COERCERTLFULL] : Wn[Yn.COERCERTL];
    let g;
    for (; (g = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || g.index + g[0].length !== r.index + r[0].length) && (r = g), l.lastIndex = g.index + g[1].length + g[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", s = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return wv(`${n}.${i}.${a}${o}${s}`, t);
};
var Tv = _v;
class Sv {
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
var Av = Sv, va, Hs;
function lt() {
  if (Hs) return va;
  Hs = 1;
  const e = /\s+/g;
  class t {
    constructor(I, L) {
      if (L = i(L), I instanceof t)
        return I.loose === !!L.loose && I.includePrerelease === !!L.includePrerelease ? I : new t(I.raw, L);
      if (I instanceof a)
        return this.raw = I.value, this.set = [[I]], this.formatted = void 0, this;
      if (this.options = L, this.loose = !!L.loose, this.includePrerelease = !!L.includePrerelease, this.raw = I.trim().replace(e, " "), this.set = this.raw.split("||").map(($) => this.parseRange($.trim())).filter(($) => $.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const $ = this.set[0];
        if (this.set = this.set.filter((k) => !d(k[0])), this.set.length === 0)
          this.set = [$];
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
          const L = this.set[I];
          for (let $ = 0; $ < L.length; $++)
            $ > 0 && (this.formatted += " "), this.formatted += L[$].toString().trim();
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
      const $ = ((this.options.includePrerelease && y) | (this.options.loose && w)) + ":" + I, k = n.get($);
      if (k)
        return k;
      const x = this.options.loose, W = x ? l[g.HYPHENRANGELOOSE] : l[g.HYPHENRANGE];
      I = I.replace(W, Y(this.options.includePrerelease)), o("hyphen replace", I), I = I.replace(l[g.COMPARATORTRIM], u), o("comparator trim", I), I = I.replace(l[g.TILDETRIM], f), o("tilde trim", I), I = I.replace(l[g.CARETTRIM], p), o("caret trim", I);
      let Z = I.split(" ").map((V) => b(V, this.options)).join(" ").split(/\s+/).map((V) => K(V, this.options));
      x && (Z = Z.filter((V) => (o("loose invalid filter", V, this.options), !!V.match(l[g.COMPARATORLOOSE])))), o("range list", Z);
      const z = /* @__PURE__ */ new Map(), ie = Z.map((V) => new a(V, this.options));
      for (const V of ie) {
        if (d(V))
          return [V];
        z.set(V.value, V);
      }
      z.size > 1 && z.has("") && z.delete("");
      const Te = [...z.values()];
      return n.set($, Te), Te;
    }
    intersects(I, L) {
      if (!(I instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some(($) => A($, L) && I.set.some((k) => A(k, L) && $.every((x) => k.every((W) => x.intersects(W, L)))));
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
      for (let L = 0; L < this.set.length; L++)
        if (ne(this.set[L], I, this.options))
          return !0;
      return !1;
    }
  }
  va = t;
  const r = Av, n = new r(), i = wo, a = Oi(), o = $i, s = Ye, {
    safeRe: l,
    t: g,
    comparatorTrimReplace: u,
    tildeTrimReplace: f,
    caretTrimReplace: p
  } = Sn, { FLAG_INCLUDE_PRERELEASE: y, FLAG_LOOSE: w } = Ci, d = (N) => N.value === "<0.0.0-0", T = (N) => N.value === "", A = (N, I) => {
    let L = !0;
    const $ = N.slice();
    let k = $.pop();
    for (; L && $.length; )
      L = $.every((x) => k.intersects(x, I)), k = $.pop();
    return L;
  }, b = (N, I) => (N = N.replace(l[g.BUILD], ""), o("comp", N, I), N = ve(N, I), o("caret", N), N = B(N, I), o("tildes", N), N = ge(N, I), o("xrange", N), N = J(N, I), o("stars", N), N), M = (N) => !N || N.toLowerCase() === "x" || N === "*", B = (N, I) => N.trim().split(/\s+/).map((L) => Q(L, I)).join(" "), Q = (N, I) => {
    const L = I.loose ? l[g.TILDELOOSE] : l[g.TILDE];
    return N.replace(L, ($, k, x, W, Z) => {
      o("tilde", N, $, k, x, W, Z);
      let z;
      return M(k) ? z = "" : M(x) ? z = `>=${k}.0.0 <${+k + 1}.0.0-0` : M(W) ? z = `>=${k}.${x}.0 <${k}.${+x + 1}.0-0` : Z ? (o("replaceTilde pr", Z), z = `>=${k}.${x}.${W}-${Z} <${k}.${+x + 1}.0-0`) : z = `>=${k}.${x}.${W} <${k}.${+x + 1}.0-0`, o("tilde return", z), z;
    });
  }, ve = (N, I) => N.trim().split(/\s+/).map((L) => te(L, I)).join(" "), te = (N, I) => {
    o("caret", N, I);
    const L = I.loose ? l[g.CARETLOOSE] : l[g.CARET], $ = I.includePrerelease ? "-0" : "";
    return N.replace(L, (k, x, W, Z, z) => {
      o("caret", N, k, x, W, Z, z);
      let ie;
      return M(x) ? ie = "" : M(W) ? ie = `>=${x}.0.0${$} <${+x + 1}.0.0-0` : M(Z) ? x === "0" ? ie = `>=${x}.${W}.0${$} <${x}.${+W + 1}.0-0` : ie = `>=${x}.${W}.0${$} <${+x + 1}.0.0-0` : z ? (o("replaceCaret pr", z), x === "0" ? W === "0" ? ie = `>=${x}.${W}.${Z}-${z} <${x}.${W}.${+Z + 1}-0` : ie = `>=${x}.${W}.${Z}-${z} <${x}.${+W + 1}.0-0` : ie = `>=${x}.${W}.${Z}-${z} <${+x + 1}.0.0-0`) : (o("no pr"), x === "0" ? W === "0" ? ie = `>=${x}.${W}.${Z}${$} <${x}.${W}.${+Z + 1}-0` : ie = `>=${x}.${W}.${Z}${$} <${x}.${+W + 1}.0-0` : ie = `>=${x}.${W}.${Z} <${+x + 1}.0.0-0`), o("caret return", ie), ie;
    });
  }, ge = (N, I) => (o("replaceXRanges", N, I), N.split(/\s+/).map((L) => E(L, I)).join(" ")), E = (N, I) => {
    N = N.trim();
    const L = I.loose ? l[g.XRANGELOOSE] : l[g.XRANGE];
    return N.replace(L, ($, k, x, W, Z, z) => {
      o("xRange", N, $, k, x, W, Z, z);
      const ie = M(x), Te = ie || M(W), V = Te || M(Z), ae = V;
      return k === "=" && ae && (k = ""), z = I.includePrerelease ? "-0" : "", ie ? k === ">" || k === "<" ? $ = "<0.0.0-0" : $ = "*" : k && ae ? (Te && (W = 0), Z = 0, k === ">" ? (k = ">=", Te ? (x = +x + 1, W = 0, Z = 0) : (W = +W + 1, Z = 0)) : k === "<=" && (k = "<", Te ? x = +x + 1 : W = +W + 1), k === "<" && (z = "-0"), $ = `${k + x}.${W}.${Z}${z}`) : Te ? $ = `>=${x}.0.0${z} <${+x + 1}.0.0-0` : V && ($ = `>=${x}.${W}.0${z} <${x}.${+W + 1}.0-0`), o("xRange return", $), $;
    });
  }, J = (N, I) => (o("replaceStars", N, I), N.trim().replace(l[g.STAR], "")), K = (N, I) => (o("replaceGTE0", N, I), N.trim().replace(l[I.includePrerelease ? g.GTE0PRE : g.GTE0], "")), Y = (N) => (I, L, $, k, x, W, Z, z, ie, Te, V, ae) => (M($) ? L = "" : M(k) ? L = `>=${$}.0.0${N ? "-0" : ""}` : M(x) ? L = `>=${$}.${k}.0${N ? "-0" : ""}` : W ? L = `>=${L}` : L = `>=${L}${N ? "-0" : ""}`, M(ie) ? z = "" : M(Te) ? z = `<${+ie + 1}.0.0-0` : M(V) ? z = `<${ie}.${+Te + 1}.0-0` : ae ? z = `<=${ie}.${Te}.${V}-${ae}` : N ? z = `<${ie}.${Te}.${+V + 1}-0` : z = `<=${z}`, `${L} ${z}`.trim()), ne = (N, I, L) => {
    for (let $ = 0; $ < N.length; $++)
      if (!N[$].test(I))
        return !1;
    if (I.prerelease.length && !L.includePrerelease) {
      for (let $ = 0; $ < N.length; $++)
        if (o(N[$].semver), N[$].semver !== a.ANY && N[$].semver.prerelease.length > 0) {
          const k = N[$].semver;
          if (k.major === I.major && k.minor === I.minor && k.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return va;
}
var ya, qs;
function Oi() {
  if (qs) return ya;
  qs = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, f) {
      if (f = r(f), u instanceof t) {
        if (u.loose === !!f.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), o("comparator", u, f), this.options = f, this.loose = !!f.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(u) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], p = u.match(f);
      if (!p)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = p[1] !== void 0 ? p[1] : "", this.operator === "=" && (this.operator = ""), p[2] ? this.semver = new s(p[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (o("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new s(u, this.options);
        } catch {
          return !1;
        }
      return a(u, this.operator, this.semver, this.options);
    }
    intersects(u, f) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(u.value, f).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new l(this.value, f).test(u.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || a(this.semver, "<", u.semver, f) && this.operator.startsWith(">") && u.operator.startsWith("<") || a(this.semver, ">", u.semver, f) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  ya = t;
  const r = wo, { safeRe: n, t: i } = Sn, a = Uc, o = $i, s = Ye, l = lt();
  return ya;
}
const bv = lt(), Cv = (e, t, r) => {
  try {
    t = new bv(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ri = Cv;
const $v = lt(), Iv = (e, t) => new $v(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var Ov = Iv;
const Rv = Ye, Dv = lt(), Pv = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new Dv(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || i.compare(o) === -1) && (n = o, i = new Rv(n, r));
  }), n;
};
var Nv = Pv;
const xv = Ye, Fv = lt(), Lv = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new Fv(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || i.compare(o) === 1) && (n = o, i = new xv(n, r));
  }), n;
};
var Uv = Lv;
const Ea = Ye, kv = lt(), Gs = Ii, Mv = (e, t) => {
  e = new kv(e, t);
  let r = new Ea("0.0.0");
  if (e.test(r) || (r = new Ea("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let a = null;
    i.forEach((o) => {
      const s = new Ea(o.semver.version);
      switch (o.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!a || Gs(s, a)) && (a = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Gs(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var Bv = Mv;
const jv = lt(), Hv = (e, t) => {
  try {
    return new jv(e, t).range || "*";
  } catch {
    return null;
  }
};
var qv = Hv;
const Gv = Ye, kc = Oi(), { ANY: Vv } = kc, Wv = lt(), Yv = Ri, Vs = Ii, Ws = To, zv = Ao, Xv = So, Kv = (e, t, r, n) => {
  e = new Gv(e, n), t = new Wv(t, n);
  let i, a, o, s, l;
  switch (r) {
    case ">":
      i = Vs, a = zv, o = Ws, s = ">", l = ">=";
      break;
    case "<":
      i = Ws, a = Xv, o = Vs, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Yv(e, t, n))
    return !1;
  for (let g = 0; g < t.set.length; ++g) {
    const u = t.set[g];
    let f = null, p = null;
    if (u.forEach((y) => {
      y.semver === Vv && (y = new kc(">=0.0.0")), f = f || y, p = p || y, i(y.semver, f.semver, n) ? f = y : o(y.semver, p.semver, n) && (p = y);
    }), f.operator === s || f.operator === l || (!p.operator || p.operator === s) && a(e, p.semver))
      return !1;
    if (p.operator === l && o(e, p.semver))
      return !1;
  }
  return !0;
};
var bo = Kv;
const Jv = bo, Qv = (e, t, r) => Jv(e, t, ">", r);
var Zv = Qv;
const ey = bo, ty = (e, t, r) => ey(e, t, "<", r);
var ry = ty;
const Ys = lt(), ny = (e, t, r) => (e = new Ys(e, r), t = new Ys(t, r), e.intersects(t, r));
var iy = ny;
const ay = Ri, oy = st;
var sy = (e, t, r) => {
  const n = [];
  let i = null, a = null;
  const o = e.sort((u, f) => oy(u, f, r));
  for (const u of o)
    ay(u, t, r) ? (a = u, i || (i = u)) : (a && n.push([i, a]), a = null, i = null);
  i && n.push([i, null]);
  const s = [];
  for (const [u, f] of n)
    u === f ? s.push(u) : !f && u === o[0] ? s.push("*") : f ? u === o[0] ? s.push(`<=${f}`) : s.push(`${u} - ${f}`) : s.push(`>=${u}`);
  const l = s.join(" || "), g = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < g.length ? l : t;
};
const zs = lt(), Co = Oi(), { ANY: wa } = Co, Vr = Ri, $o = st, ly = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new zs(e, r), t = new zs(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const a of t.set) {
      const o = cy(i, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, uy = [new Co(">=0.0.0-0")], Xs = [new Co(">=0.0.0")], cy = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === wa) {
    if (t.length === 1 && t[0].semver === wa)
      return !0;
    r.includePrerelease ? e = uy : e = Xs;
  }
  if (t.length === 1 && t[0].semver === wa) {
    if (r.includePrerelease)
      return !0;
    t = Xs;
  }
  const n = /* @__PURE__ */ new Set();
  let i, a;
  for (const y of e)
    y.operator === ">" || y.operator === ">=" ? i = Ks(i, y, r) : y.operator === "<" || y.operator === "<=" ? a = Js(a, y, r) : n.add(y.semver);
  if (n.size > 1)
    return null;
  let o;
  if (i && a) {
    if (o = $o(i.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (i.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const y of n) {
    if (i && !Vr(y, String(i), r) || a && !Vr(y, String(a), r))
      return null;
    for (const w of t)
      if (!Vr(y, String(w), r))
        return !1;
    return !0;
  }
  let s, l, g, u, f = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, p = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && a.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const y of t) {
    if (u = u || y.operator === ">" || y.operator === ">=", g = g || y.operator === "<" || y.operator === "<=", i) {
      if (p && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === p.major && y.semver.minor === p.minor && y.semver.patch === p.patch && (p = !1), y.operator === ">" || y.operator === ">=") {
        if (s = Ks(i, y, r), s === y && s !== i)
          return !1;
      } else if (i.operator === ">=" && !Vr(i.semver, String(y), r))
        return !1;
    }
    if (a) {
      if (f && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === f.major && y.semver.minor === f.minor && y.semver.patch === f.patch && (f = !1), y.operator === "<" || y.operator === "<=") {
        if (l = Js(a, y, r), l === y && l !== a)
          return !1;
      } else if (a.operator === "<=" && !Vr(a.semver, String(y), r))
        return !1;
    }
    if (!y.operator && (a || i) && o !== 0)
      return !1;
  }
  return !(i && g && !a && o !== 0 || a && u && !i && o !== 0 || p || f);
}, Ks = (e, t, r) => {
  if (!e)
    return t;
  const n = $o(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Js = (e, t, r) => {
  if (!e)
    return t;
  const n = $o(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var fy = ly;
const _a = Sn, Qs = Ci, dy = Ye, Zs = xc, hy = Dr, py = w0, my = S0, gy = b0, vy = $0, yy = R0, Ey = N0, wy = L0, _y = M0, Ty = st, Sy = q0, Ay = W0, by = _o, Cy = K0, $y = Z0, Iy = Ii, Oy = To, Ry = Fc, Dy = Lc, Py = So, Ny = Ao, xy = Uc, Fy = Tv, Ly = Oi(), Uy = lt(), ky = Ri, My = Ov, By = Nv, jy = Uv, Hy = Bv, qy = qv, Gy = bo, Vy = Zv, Wy = ry, Yy = iy, zy = sy, Xy = fy;
var Mc = {
  parse: hy,
  valid: py,
  clean: my,
  inc: gy,
  diff: vy,
  major: yy,
  minor: Ey,
  patch: wy,
  prerelease: _y,
  compare: Ty,
  rcompare: Sy,
  compareLoose: Ay,
  compareBuild: by,
  sort: Cy,
  rsort: $y,
  gt: Iy,
  lt: Oy,
  eq: Ry,
  neq: Dy,
  gte: Py,
  lte: Ny,
  cmp: xy,
  coerce: Fy,
  Comparator: Ly,
  Range: Uy,
  satisfies: ky,
  toComparators: My,
  maxSatisfying: By,
  minSatisfying: jy,
  minVersion: Hy,
  validRange: qy,
  outside: Gy,
  gtr: Vy,
  ltr: Wy,
  intersects: Yy,
  simplifyRange: zy,
  subset: Xy,
  SemVer: dy,
  re: _a.re,
  src: _a.src,
  tokens: _a.t,
  SEMVER_SPEC_VERSION: Qs.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Qs.RELEASE_TYPES,
  compareIdentifiers: Zs.compareIdentifiers,
  rcompareIdentifiers: Zs.rcompareIdentifiers
}, An = {}, pi = { exports: {} };
pi.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, a = 2, o = 9007199254740991, s = "[object Arguments]", l = "[object Array]", g = "[object AsyncFunction]", u = "[object Boolean]", f = "[object Date]", p = "[object Error]", y = "[object Function]", w = "[object GeneratorFunction]", d = "[object Map]", T = "[object Number]", A = "[object Null]", b = "[object Object]", M = "[object Promise]", B = "[object Proxy]", Q = "[object RegExp]", ve = "[object Set]", te = "[object String]", ge = "[object Symbol]", E = "[object Undefined]", J = "[object WeakMap]", K = "[object ArrayBuffer]", Y = "[object DataView]", ne = "[object Float32Array]", N = "[object Float64Array]", I = "[object Int8Array]", L = "[object Int16Array]", $ = "[object Int32Array]", k = "[object Uint8Array]", x = "[object Uint8ClampedArray]", W = "[object Uint16Array]", Z = "[object Uint32Array]", z = /[\\^$.*+?()[\]{}|]/g, ie = /^\[object .+?Constructor\]$/, Te = /^(?:0|[1-9]\d*)$/, V = {};
  V[ne] = V[N] = V[I] = V[L] = V[$] = V[k] = V[x] = V[W] = V[Z] = !0, V[s] = V[l] = V[K] = V[u] = V[Y] = V[f] = V[p] = V[y] = V[d] = V[T] = V[b] = V[Q] = V[ve] = V[te] = V[J] = !1;
  var ae = typeof je == "object" && je && je.Object === Object && je, m = typeof self == "object" && self && self.Object === Object && self, c = ae || m || Function("return this")(), C = t && !t.nodeType && t, h = C && !0 && e && !e.nodeType && e, S = h && h.exports === C, O = S && ae.process, P = function() {
    try {
      return O && O.binding && O.binding("util");
    } catch {
    }
  }(), F = P && P.isTypedArray;
  function U(v, _) {
    for (var R = -1, j = v == null ? 0 : v.length, me = 0, ee = []; ++R < j; ) {
      var _e = v[R];
      _(_e, R, v) && (ee[me++] = _e);
    }
    return ee;
  }
  function q(v, _) {
    for (var R = -1, j = _.length, me = v.length; ++R < j; )
      v[me + R] = _[R];
    return v;
  }
  function H(v, _) {
    for (var R = -1, j = v == null ? 0 : v.length; ++R < j; )
      if (_(v[R], R, v))
        return !0;
    return !1;
  }
  function X(v, _) {
    for (var R = -1, j = Array(v); ++R < v; )
      j[R] = _(R);
    return j;
  }
  function ue(v) {
    return function(_) {
      return v(_);
    };
  }
  function ce(v, _) {
    return v.has(_);
  }
  function pe(v, _) {
    return v == null ? void 0 : v[_];
  }
  function de(v) {
    var _ = -1, R = Array(v.size);
    return v.forEach(function(j, me) {
      R[++_] = [me, j];
    }), R;
  }
  function be(v, _) {
    return function(R) {
      return v(_(R));
    };
  }
  function D(v) {
    var _ = -1, R = Array(v.size);
    return v.forEach(function(j) {
      R[++_] = j;
    }), R;
  }
  var se = Array.prototype, le = Function.prototype, fe = Object.prototype, De = c["__core-js_shared__"], ut = le.toString, Se = fe.hasOwnProperty, St = function() {
    var v = /[^.]+$/.exec(De && De.keys && De.keys.IE_PROTO || "");
    return v ? "Symbol(src)_1." + v : "";
  }(), ze = fe.toString, pt = RegExp(
    "^" + ut.call(Se).replace(z, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), jt = S ? c.Buffer : void 0, Me = c.Symbol, Ze = c.Uint8Array, ar = fe.propertyIsEnumerable, Nr = se.splice, Ce = Me ? Me.toStringTag : void 0, In = Object.getOwnPropertySymbols, Mi = jt ? jt.isBuffer : void 0, Bi = be(Object.keys, Object), xr = ur(c, "DataView"), mt = ur(c, "Map"), Fr = ur(c, "Promise"), Lr = ur(c, "Set"), or = ur(c, "WeakMap"), Ht = ur(Object, "create"), ji = Gt(xr), Hi = Gt(mt), qi = Gt(Fr), Gi = Gt(Lr), Vi = Gt(or), Ur = Me ? Me.prototype : void 0, sr = Ur ? Ur.valueOf : void 0;
  function gt(v) {
    var _ = -1, R = v == null ? 0 : v.length;
    for (this.clear(); ++_ < R; ) {
      var j = v[_];
      this.set(j[0], j[1]);
    }
  }
  function Wi() {
    this.__data__ = Ht ? Ht(null) : {}, this.size = 0;
  }
  function Yi(v) {
    var _ = this.has(v) && delete this.__data__[v];
    return this.size -= _ ? 1 : 0, _;
  }
  function qt(v) {
    var _ = this.__data__;
    if (Ht) {
      var R = _[v];
      return R === n ? void 0 : R;
    }
    return Se.call(_, v) ? _[v] : void 0;
  }
  function zi(v) {
    var _ = this.__data__;
    return Ht ? _[v] !== void 0 : Se.call(_, v);
  }
  function Xi(v, _) {
    var R = this.__data__;
    return this.size += this.has(v) ? 0 : 1, R[v] = Ht && _ === void 0 ? n : _, this;
  }
  gt.prototype.clear = Wi, gt.prototype.delete = Yi, gt.prototype.get = qt, gt.prototype.has = zi, gt.prototype.set = Xi;
  function Pe(v) {
    var _ = -1, R = v == null ? 0 : v.length;
    for (this.clear(); ++_ < R; ) {
      var j = v[_];
      this.set(j[0], j[1]);
    }
  }
  function On() {
    this.__data__ = [], this.size = 0;
  }
  function Rn(v) {
    var _ = this.__data__, R = Dn(_, v);
    if (R < 0)
      return !1;
    var j = _.length - 1;
    return R == j ? _.pop() : Nr.call(_, R, 1), --this.size, !0;
  }
  function Ki(v) {
    var _ = this.__data__, R = Dn(_, v);
    return R < 0 ? void 0 : _[R][1];
  }
  function Ji(v) {
    return Dn(this.__data__, v) > -1;
  }
  function Qi(v, _) {
    var R = this.__data__, j = Dn(R, v);
    return j < 0 ? (++this.size, R.push([v, _])) : R[j][1] = _, this;
  }
  Pe.prototype.clear = On, Pe.prototype.delete = Rn, Pe.prototype.get = Ki, Pe.prototype.has = Ji, Pe.prototype.set = Qi;
  function vt(v) {
    var _ = -1, R = v == null ? 0 : v.length;
    for (this.clear(); ++_ < R; ) {
      var j = v[_];
      this.set(j[0], j[1]);
    }
  }
  function Zi() {
    this.size = 0, this.__data__ = {
      hash: new gt(),
      map: new (mt || Pe)(),
      string: new gt()
    };
  }
  function ea(v) {
    var _ = Pn(this, v).delete(v);
    return this.size -= _ ? 1 : 0, _;
  }
  function kr(v) {
    return Pn(this, v).get(v);
  }
  function Mr(v) {
    return Pn(this, v).has(v);
  }
  function ta(v, _) {
    var R = Pn(this, v), j = R.size;
    return R.set(v, _), this.size += R.size == j ? 0 : 1, this;
  }
  vt.prototype.clear = Zi, vt.prototype.delete = ea, vt.prototype.get = kr, vt.prototype.has = Mr, vt.prototype.set = ta;
  function lr(v) {
    var _ = -1, R = v == null ? 0 : v.length;
    for (this.__data__ = new vt(); ++_ < R; )
      this.add(v[_]);
  }
  function ra(v) {
    return this.__data__.set(v, n), this;
  }
  function Je(v) {
    return this.__data__.has(v);
  }
  lr.prototype.add = lr.prototype.push = ra, lr.prototype.has = Je;
  function nt(v) {
    var _ = this.__data__ = new Pe(v);
    this.size = _.size;
  }
  function Br() {
    this.__data__ = new Pe(), this.size = 0;
  }
  function tf(v) {
    var _ = this.__data__, R = _.delete(v);
    return this.size = _.size, R;
  }
  function rf(v) {
    return this.__data__.get(v);
  }
  function nf(v) {
    return this.__data__.has(v);
  }
  function af(v, _) {
    var R = this.__data__;
    if (R instanceof Pe) {
      var j = R.__data__;
      if (!mt || j.length < r - 1)
        return j.push([v, _]), this.size = ++R.size, this;
      R = this.__data__ = new vt(j);
    }
    return R.set(v, _), this.size = R.size, this;
  }
  nt.prototype.clear = Br, nt.prototype.delete = tf, nt.prototype.get = rf, nt.prototype.has = nf, nt.prototype.set = af;
  function of(v, _) {
    var R = Nn(v), j = !R && _f(v), me = !R && !j && na(v), ee = !R && !j && !me && Mo(v), _e = R || j || me || ee, Ie = _e ? X(v.length, String) : [], Ne = Ie.length;
    for (var ye in v)
      Se.call(v, ye) && !(_e && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ye == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      me && (ye == "offset" || ye == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      ee && (ye == "buffer" || ye == "byteLength" || ye == "byteOffset") || // Skip index properties.
      gf(ye, Ne))) && Ie.push(ye);
    return Ie;
  }
  function Dn(v, _) {
    for (var R = v.length; R--; )
      if (Fo(v[R][0], _))
        return R;
    return -1;
  }
  function sf(v, _, R) {
    var j = _(v);
    return Nn(v) ? j : q(j, R(v));
  }
  function jr(v) {
    return v == null ? v === void 0 ? E : A : Ce && Ce in Object(v) ? pf(v) : wf(v);
  }
  function Do(v) {
    return Hr(v) && jr(v) == s;
  }
  function Po(v, _, R, j, me) {
    return v === _ ? !0 : v == null || _ == null || !Hr(v) && !Hr(_) ? v !== v && _ !== _ : lf(v, _, R, j, Po, me);
  }
  function lf(v, _, R, j, me, ee) {
    var _e = Nn(v), Ie = Nn(_), Ne = _e ? l : At(v), ye = Ie ? l : At(_);
    Ne = Ne == s ? b : Ne, ye = ye == s ? b : ye;
    var Qe = Ne == b, it = ye == b, Le = Ne == ye;
    if (Le && na(v)) {
      if (!na(_))
        return !1;
      _e = !0, Qe = !1;
    }
    if (Le && !Qe)
      return ee || (ee = new nt()), _e || Mo(v) ? No(v, _, R, j, me, ee) : df(v, _, Ne, R, j, me, ee);
    if (!(R & i)) {
      var et = Qe && Se.call(v, "__wrapped__"), tt = it && Se.call(_, "__wrapped__");
      if (et || tt) {
        var bt = et ? v.value() : v, yt = tt ? _.value() : _;
        return ee || (ee = new nt()), me(bt, yt, R, j, ee);
      }
    }
    return Le ? (ee || (ee = new nt()), hf(v, _, R, j, me, ee)) : !1;
  }
  function uf(v) {
    if (!ko(v) || yf(v))
      return !1;
    var _ = Lo(v) ? pt : ie;
    return _.test(Gt(v));
  }
  function cf(v) {
    return Hr(v) && Uo(v.length) && !!V[jr(v)];
  }
  function ff(v) {
    if (!Ef(v))
      return Bi(v);
    var _ = [];
    for (var R in Object(v))
      Se.call(v, R) && R != "constructor" && _.push(R);
    return _;
  }
  function No(v, _, R, j, me, ee) {
    var _e = R & i, Ie = v.length, Ne = _.length;
    if (Ie != Ne && !(_e && Ne > Ie))
      return !1;
    var ye = ee.get(v);
    if (ye && ee.get(_))
      return ye == _;
    var Qe = -1, it = !0, Le = R & a ? new lr() : void 0;
    for (ee.set(v, _), ee.set(_, v); ++Qe < Ie; ) {
      var et = v[Qe], tt = _[Qe];
      if (j)
        var bt = _e ? j(tt, et, Qe, _, v, ee) : j(et, tt, Qe, v, _, ee);
      if (bt !== void 0) {
        if (bt)
          continue;
        it = !1;
        break;
      }
      if (Le) {
        if (!H(_, function(yt, Vt) {
          if (!ce(Le, Vt) && (et === yt || me(et, yt, R, j, ee)))
            return Le.push(Vt);
        })) {
          it = !1;
          break;
        }
      } else if (!(et === tt || me(et, tt, R, j, ee))) {
        it = !1;
        break;
      }
    }
    return ee.delete(v), ee.delete(_), it;
  }
  function df(v, _, R, j, me, ee, _e) {
    switch (R) {
      case Y:
        if (v.byteLength != _.byteLength || v.byteOffset != _.byteOffset)
          return !1;
        v = v.buffer, _ = _.buffer;
      case K:
        return !(v.byteLength != _.byteLength || !ee(new Ze(v), new Ze(_)));
      case u:
      case f:
      case T:
        return Fo(+v, +_);
      case p:
        return v.name == _.name && v.message == _.message;
      case Q:
      case te:
        return v == _ + "";
      case d:
        var Ie = de;
      case ve:
        var Ne = j & i;
        if (Ie || (Ie = D), v.size != _.size && !Ne)
          return !1;
        var ye = _e.get(v);
        if (ye)
          return ye == _;
        j |= a, _e.set(v, _);
        var Qe = No(Ie(v), Ie(_), j, me, ee, _e);
        return _e.delete(v), Qe;
      case ge:
        if (sr)
          return sr.call(v) == sr.call(_);
    }
    return !1;
  }
  function hf(v, _, R, j, me, ee) {
    var _e = R & i, Ie = xo(v), Ne = Ie.length, ye = xo(_), Qe = ye.length;
    if (Ne != Qe && !_e)
      return !1;
    for (var it = Ne; it--; ) {
      var Le = Ie[it];
      if (!(_e ? Le in _ : Se.call(_, Le)))
        return !1;
    }
    var et = ee.get(v);
    if (et && ee.get(_))
      return et == _;
    var tt = !0;
    ee.set(v, _), ee.set(_, v);
    for (var bt = _e; ++it < Ne; ) {
      Le = Ie[it];
      var yt = v[Le], Vt = _[Le];
      if (j)
        var Bo = _e ? j(Vt, yt, Le, _, v, ee) : j(yt, Vt, Le, v, _, ee);
      if (!(Bo === void 0 ? yt === Vt || me(yt, Vt, R, j, ee) : Bo)) {
        tt = !1;
        break;
      }
      bt || (bt = Le == "constructor");
    }
    if (tt && !bt) {
      var xn = v.constructor, Fn = _.constructor;
      xn != Fn && "constructor" in v && "constructor" in _ && !(typeof xn == "function" && xn instanceof xn && typeof Fn == "function" && Fn instanceof Fn) && (tt = !1);
    }
    return ee.delete(v), ee.delete(_), tt;
  }
  function xo(v) {
    return sf(v, Af, mf);
  }
  function Pn(v, _) {
    var R = v.__data__;
    return vf(_) ? R[typeof _ == "string" ? "string" : "hash"] : R.map;
  }
  function ur(v, _) {
    var R = pe(v, _);
    return uf(R) ? R : void 0;
  }
  function pf(v) {
    var _ = Se.call(v, Ce), R = v[Ce];
    try {
      v[Ce] = void 0;
      var j = !0;
    } catch {
    }
    var me = ze.call(v);
    return j && (_ ? v[Ce] = R : delete v[Ce]), me;
  }
  var mf = In ? function(v) {
    return v == null ? [] : (v = Object(v), U(In(v), function(_) {
      return ar.call(v, _);
    }));
  } : bf, At = jr;
  (xr && At(new xr(new ArrayBuffer(1))) != Y || mt && At(new mt()) != d || Fr && At(Fr.resolve()) != M || Lr && At(new Lr()) != ve || or && At(new or()) != J) && (At = function(v) {
    var _ = jr(v), R = _ == b ? v.constructor : void 0, j = R ? Gt(R) : "";
    if (j)
      switch (j) {
        case ji:
          return Y;
        case Hi:
          return d;
        case qi:
          return M;
        case Gi:
          return ve;
        case Vi:
          return J;
      }
    return _;
  });
  function gf(v, _) {
    return _ = _ ?? o, !!_ && (typeof v == "number" || Te.test(v)) && v > -1 && v % 1 == 0 && v < _;
  }
  function vf(v) {
    var _ = typeof v;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? v !== "__proto__" : v === null;
  }
  function yf(v) {
    return !!St && St in v;
  }
  function Ef(v) {
    var _ = v && v.constructor, R = typeof _ == "function" && _.prototype || fe;
    return v === R;
  }
  function wf(v) {
    return ze.call(v);
  }
  function Gt(v) {
    if (v != null) {
      try {
        return ut.call(v);
      } catch {
      }
      try {
        return v + "";
      } catch {
      }
    }
    return "";
  }
  function Fo(v, _) {
    return v === _ || v !== v && _ !== _;
  }
  var _f = Do(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Do : function(v) {
    return Hr(v) && Se.call(v, "callee") && !ar.call(v, "callee");
  }, Nn = Array.isArray;
  function Tf(v) {
    return v != null && Uo(v.length) && !Lo(v);
  }
  var na = Mi || Cf;
  function Sf(v, _) {
    return Po(v, _);
  }
  function Lo(v) {
    if (!ko(v))
      return !1;
    var _ = jr(v);
    return _ == y || _ == w || _ == g || _ == B;
  }
  function Uo(v) {
    return typeof v == "number" && v > -1 && v % 1 == 0 && v <= o;
  }
  function ko(v) {
    var _ = typeof v;
    return v != null && (_ == "object" || _ == "function");
  }
  function Hr(v) {
    return v != null && typeof v == "object";
  }
  var Mo = F ? ue(F) : cf;
  function Af(v) {
    return Tf(v) ? of(v) : ff(v);
  }
  function bf() {
    return [];
  }
  function Cf() {
    return !1;
  }
  e.exports = Sf;
})(pi, pi.exports);
var Ky = pi.exports;
Object.defineProperty(An, "__esModule", { value: !0 });
An.DownloadedUpdateHelper = void 0;
An.createTempUpdateFile = tE;
const Jy = vn, Qy = kt, el = Ky, zt = Mt, Zr = we;
class Zy {
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
    return Zr.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return el(this.versionInfo, r) && el(this.fileInfo.info, n.info) && await (0, zt.pathExists)(t) ? t : null;
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
    } catch (g) {
      let u = "No cached update info available";
      return g.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), u += ` (error on read: ${g.message})`), r.info(u), null;
    }
    if (!((a == null ? void 0 : a.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== a.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${a.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Zr.join(this.cacheDirForPendingUpdate, a.fileName);
    if (!await (0, zt.pathExists)(s))
      return r.info("Cached update file doesn't exist"), null;
    const l = await eE(s);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = a, s);
  }
  getUpdateInfoFile() {
    return Zr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
An.DownloadedUpdateHelper = Zy;
function eE(e, t = "sha512", r = "base64", n) {
  return new Promise((i, a) => {
    const o = (0, Jy.createHash)(t);
    o.on("error", a).setEncoding(r), (0, Qy.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", a).on("end", () => {
      o.end(), i(o.read());
    }).pipe(o, { end: !1 });
  });
}
async function tE(e, t, r) {
  let n = 0, i = Zr.join(t, e);
  for (let a = 0; a < 3; a++)
    try {
      return await (0, zt.unlink)(i), i;
    } catch (o) {
      if (o.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${o}`), i = Zr.join(t, `${n++}-${e}`);
    }
  return i;
}
var Di = {}, Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
Io.getAppCacheDir = nE;
const Ta = we, rE = gi;
function nE() {
  const e = (0, rE.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Ta.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Ta.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Ta.join(e, ".cache"), t;
}
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.ElectronAppAdapter = void 0;
const tl = we, iE = Io;
class aE {
  constructor(t = er.app) {
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
    return this.isPackaged ? tl.join(process.resourcesPath, "app-update.yml") : tl.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, iE.getAppCacheDir)();
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
Di.ElectronAppAdapter = aE;
var Bc = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = Re;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return er.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(a) {
      super(), this.proxyLoginCallback = a, this.cachedSession = null;
    }
    async download(a, o, s) {
      return await s.cancellationToken.createPromise((l, g, u) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(a, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: o,
          options: s,
          onCancel: u,
          callback: (p) => {
            p == null ? l(o) : g(p);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(a, o) {
      a.headers && a.headers.Host && (a.host = a.headers.Host, delete a.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const s = er.net.request({
        ...a,
        session: this.cachedSession
      });
      return s.on("response", o), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(a, o, s, l, g) {
      a.on("redirect", (u, f, p) => {
        a.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : g(t.HttpExecutor.prepareRedirectUrlOptions(p, o));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(Bc);
var bn = {}, rt = {}, oE = "[object Symbol]", jc = /[\\^$.*+?()[\]{}|]/g, sE = RegExp(jc.source), lE = typeof je == "object" && je && je.Object === Object && je, uE = typeof self == "object" && self && self.Object === Object && self, cE = lE || uE || Function("return this")(), fE = Object.prototype, dE = fE.toString, rl = cE.Symbol, nl = rl ? rl.prototype : void 0, il = nl ? nl.toString : void 0;
function hE(e) {
  if (typeof e == "string")
    return e;
  if (mE(e))
    return il ? il.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function pE(e) {
  return !!e && typeof e == "object";
}
function mE(e) {
  return typeof e == "symbol" || pE(e) && dE.call(e) == oE;
}
function gE(e) {
  return e == null ? "" : hE(e);
}
function vE(e) {
  return e = gE(e), e && sE.test(e) ? e.replace(jc, "\\$&") : e;
}
var yE = vE;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.newBaseUrl = wE;
rt.newUrlFromBase = Ya;
rt.getChannelFilename = _E;
rt.blockmapFiles = TE;
const Hc = Ir, EE = yE;
function wE(e) {
  const t = new Hc.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Ya(e, t, r = !1) {
  const n = new Hc.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function _E(e) {
  return `${e}.yml`;
}
function TE(e, t, r) {
  const n = Ya(`${e.pathname}.blockmap`, e);
  return [Ya(`${e.pathname.replace(new RegExp(EE(r), "g"), t)}.blockmap`, e), n];
}
var $e = {};
Object.defineProperty($e, "__esModule", { value: !0 });
$e.Provider = void 0;
$e.findFile = bE;
$e.parseUpdateInfo = CE;
$e.getFileList = qc;
$e.resolveFiles = $E;
const Lt = Re, SE = Fe, al = rt;
class AE {
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
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Lt.configureRequestUrl)(t, n), n;
  }
}
$e.Provider = AE;
function bE(e, t, r) {
  if (e.length === 0)
    throw (0, Lt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((a) => i.url.pathname.toLowerCase().endsWith(`.${a}`))));
}
function CE(e, t, r) {
  if (e == null)
    throw (0, Lt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, SE.load)(e);
  } catch (i) {
    throw (0, Lt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function qc(e) {
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
  throw (0, Lt.newError)(`No files provided: ${(0, Lt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function $E(e, t, r = (n) => n) {
  const i = qc(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, Lt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Lt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, al.newUrlFromBase)(r(s.url), t),
      info: s
    };
  }), a = e.packages, o = a == null ? null : a[process.arch] || a.ia32;
  return o != null && (i[0].packageInfo = {
    ...o,
    path: (0, al.newUrlFromBase)(r(o.path), t).href
  }), i;
}
Object.defineProperty(bn, "__esModule", { value: !0 });
bn.GenericProvider = void 0;
const ol = Re, Sa = rt, Aa = $e;
class IE extends Aa.Provider {
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
        if (i instanceof ol.HttpError && i.statusCode === 404)
          throw (0, ol.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, Aa.resolveFiles)(t, this.baseUrl);
  }
}
bn.GenericProvider = IE;
var Pi = {}, Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.BitbucketProvider = void 0;
const sl = Re, ba = rt, Ca = $e;
class OE extends Ca.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: a } = t;
    this.baseUrl = (0, ba.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new sl.CancellationToken(), r = (0, ba.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, ba.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Ca.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, sl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
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
Ni.BitbucketProvider = OE;
var Ut = {};
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.GitHubProvider = Ut.BaseGitHubProvider = void 0;
Ut.computeReleaseNotes = Vc;
const Et = Re, Er = Mc, RE = Ir, wr = rt, za = $e, $a = /\/tag\/([^/]+)$/;
class Gc extends za.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, wr.newBaseUrl)((0, Et.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, wr.newBaseUrl)((0, Et.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
Ut.BaseGitHubProvider = Gc;
class DE extends Gc {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, a;
    const o = new Et.CancellationToken(), s = await this.httpRequest((0, wr.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, o), l = (0, Et.parseXml)(s);
    let g = l.element("entry", !1, "No published versions on GitHub"), u = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Er.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (T === null)
          u = $a.exec(g.element("link").attribute("href"))[1];
        else
          for (const A of l.getElements("entry")) {
            const b = $a.exec(A.element("link").attribute("href"));
            if (b === null)
              continue;
            const M = b[1], B = ((n = Er.prerelease(M)) === null || n === void 0 ? void 0 : n[0]) || null, Q = !T || ["alpha", "beta"].includes(T), ve = B !== null && !["alpha", "beta"].includes(String(B));
            if (Q && !ve && !(T === "beta" && B === "alpha")) {
              u = M;
              break;
            }
            if (B && B === T) {
              u = M;
              break;
            }
          }
      } else {
        u = await this.getLatestTagName(o);
        for (const T of l.getElements("entry"))
          if ($a.exec(T.element("link").attribute("href"))[1] === u) {
            g = T;
            break;
          }
      }
    } catch (T) {
      throw (0, Et.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (u == null)
      throw (0, Et.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, p = "", y = "";
    const w = async (T) => {
      p = (0, wr.getChannelFilename)(T), y = (0, wr.newUrlFromBase)(this.getBaseDownloadPath(String(u), p), this.baseUrl);
      const A = this.createRequestOptions(y);
      try {
        return await this.executor.request(A, o);
      } catch (b) {
        throw b instanceof Et.HttpError && b.statusCode === 404 ? (0, Et.newError)(`Cannot find ${p} in the latest release artifacts (${y}): ${b.stack || b.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : b;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = Er.prerelease(u)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((a = Er.prerelease(u)) === null || a === void 0 ? void 0 : a[0]))), f = await w(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        f = await w(this.getDefaultChannelName());
      else
        throw T;
    }
    const d = (0, za.parseUpdateInfo)(f, p, y);
    return d.releaseName == null && (d.releaseName = g.elementValueOrEmpty("title")), d.releaseNotes == null && (d.releaseNotes = Vc(this.updater.currentVersion, this.updater.fullChangelog, l, g)), {
      tag: u,
      ...d
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, wr.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new RE.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Et.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, za.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
Ut.GitHubProvider = DE;
function ll(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Vc(e, t, r, n) {
  if (!t)
    return ll(n);
  const i = [];
  for (const a of r.getElements("entry")) {
    const o = /\/tag\/v?([^/]+)$/.exec(a.element("link").attribute("href"))[1];
    Er.lt(e, o) && i.push({
      version: o,
      note: ll(a)
    });
  }
  return i.sort((a, o) => Er.rcompare(a.version, o.version));
}
var xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.KeygenProvider = void 0;
const ul = Re, Ia = rt, Oa = $e;
class PE extends Oa.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Ia.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new ul.CancellationToken(), r = (0, Ia.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Ia.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Oa.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, ul.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
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
xi.KeygenProvider = PE;
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.PrivateGitHubProvider = void 0;
const dr = Re, NE = Fe, xE = we, cl = Ir, fl = rt, FE = Ut, LE = $e;
class UE extends FE.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new dr.CancellationToken(), r = (0, fl.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((s) => s.name === r);
    if (i == null)
      throw (0, dr.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const a = new cl.URL(i.url);
    let o;
    try {
      o = (0, NE.load)(await this.httpRequest(a, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof dr.HttpError && s.statusCode === 404 ? (0, dr.newError)(`Cannot find ${r} in the latest release artifacts (${a}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
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
    const i = (0, fl.newUrlFromBase)(n, this.baseUrl);
    try {
      const a = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? a.find((o) => o.prerelease) || a[0] : a;
    } catch (a) {
      throw (0, dr.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${a.stack || a.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, LE.getFileList)(t).map((r) => {
      const n = xE.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((a) => a != null && a.name === n);
      if (i == null)
        throw (0, dr.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new cl.URL(i.url),
        info: r
      };
    });
  }
}
Fi.PrivateGitHubProvider = UE;
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.isUrlProbablySupportMultiRangeRequests = Wc;
Pi.createClient = HE;
const zn = Re, kE = Ni, dl = bn, ME = Ut, BE = xi, jE = Fi;
function Wc(e) {
  return !e.includes("s3.amazonaws.com");
}
function HE(e, t, r) {
  if (typeof e == "string")
    throw (0, zn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, a = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return a == null ? new ME.GitHubProvider(i, t, r) : new jE.PrivateGitHubProvider(i, t, a, r);
    }
    case "bitbucket":
      return new kE.BitbucketProvider(e, t, r);
    case "keygen":
      return new BE.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new dl.GenericProvider({
        provider: "generic",
        url: (0, zn.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new dl.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Wc(i.url)
      });
    }
    case "custom": {
      const i = e, a = i.updateProvider;
      if (!a)
        throw (0, zn.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new a(i, t, r);
    }
    default:
      throw (0, zn.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Li = {}, Cn = {}, Pr = {}, ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.OperationKind = void 0;
ir.computeOperations = qE;
var Jt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Jt || (ir.OperationKind = Jt = {}));
function qE(e, t, r) {
  const n = pl(e.files), i = pl(t.files);
  let a = null;
  const o = t.files[0], s = [], l = o.name, g = n.get(l);
  if (g == null)
    throw new Error(`no file ${l} in old blockmap`);
  const u = i.get(l);
  let f = 0;
  const { checksumToOffset: p, checksumToOldSize: y } = VE(n.get(l), g.offset, r);
  let w = o.offset;
  for (let d = 0; d < u.checksums.length; w += u.sizes[d], d++) {
    const T = u.sizes[d], A = u.checksums[d];
    let b = p.get(A);
    b != null && y.get(A) !== T && (r.warn(`Checksum ("${A}") matches, but size differs (old: ${y.get(A)}, new: ${T})`), b = void 0), b === void 0 ? (f++, a != null && a.kind === Jt.DOWNLOAD && a.end === w ? a.end += T : (a = {
      kind: Jt.DOWNLOAD,
      start: w,
      end: w + T
      // oldBlocks: null,
    }, hl(a, s, A, d))) : a != null && a.kind === Jt.COPY && a.end === b ? a.end += T : (a = {
      kind: Jt.COPY,
      start: b,
      end: b + T
      // oldBlocks: [checksum]
    }, hl(a, s, A, d));
  }
  return f > 0 && r.info(`File${o.name === "file" ? "" : " " + o.name} has ${f} changed blocks`), s;
}
const GE = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function hl(e, t, r, n) {
  if (GE && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const a = [i.start, i.end, e.start, e.end].reduce((o, s) => o < s ? o : s);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${Jt[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - a} until ${i.end - a} and ${e.start - a} until ${e.end - a}`);
    }
  }
  t.push(e);
}
function VE(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let a = t;
  for (let o = 0; o < e.checksums.length; o++) {
    const s = e.checksums[o], l = e.sizes[o], g = i.get(s);
    if (g === void 0)
      n.set(s, a), i.set(s, l);
    else if (r.debug != null) {
      const u = g === l ? "(same size)" : `(size: ${g}, this size: ${l})`;
      r.debug(`${s} duplicated in blockmap ${u}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    a += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function pl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.DataSplitter = void 0;
Pr.copyData = Yc;
const Xn = Re, WE = kt, YE = gn, zE = ir, ml = Buffer.from(`\r
\r
`);
var $t;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})($t || ($t = {}));
function Yc(e, t, r, n, i) {
  const a = (0, WE.createReadStream)("", {
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
class XE extends YE.Writable {
  constructor(t, r, n, i, a, o) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = a, this.finishHandler = o, this.partIndex = -1, this.headerListBuffer = null, this.readState = $t.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      if (this.readState === $t.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = $t.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === $t.BODY)
          this.readState = $t.INIT;
        else {
          this.partIndex++;
          let o = this.partIndexToTaskIndex.get(this.partIndex);
          if (o == null)
            if (this.isFinished)
              o = this.options.end;
            else
              throw (0, Xn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < o)
            await this.copyExistingData(s, o);
          else if (s > o)
            throw (0, Xn.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = $t.HEADER;
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
        if (o.kind !== zE.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Yc(o, this.out, this.options.oldFileFd, i, () => {
          t++, a();
        });
      };
      a();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(ml, r);
    if (n !== -1)
      return n + ml.length;
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
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((a, o) => {
      i.on("error", o), i.once("drain", () => {
        i.removeListener("error", o), a();
      });
    });
  }
}
Pr.DataSplitter = XE;
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.executeTasksUsingMultipleRangeRequests = KE;
Ui.checkIsRangesSupported = Ka;
const Xa = Re, gl = Pr, vl = ir;
function KE(e, t, r, n, i) {
  const a = (o) => {
    if (o >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const s = o + 1e3;
    JE(e, {
      tasks: t,
      start: o,
      end: Math.min(t.length, s),
      oldFileFd: n
    }, r, () => a(s), i);
  };
  return a;
}
function JE(e, t, r, n, i) {
  let a = "bytes=", o = 0;
  const s = /* @__PURE__ */ new Map(), l = [];
  for (let f = t.start; f < t.end; f++) {
    const p = t.tasks[f];
    p.kind === vl.OperationKind.DOWNLOAD && (a += `${p.start}-${p.end - 1}, `, s.set(o, f), o++, l.push(p.end - p.start));
  }
  if (o <= 1) {
    const f = (p) => {
      if (p >= t.end) {
        n();
        return;
      }
      const y = t.tasks[p++];
      if (y.kind === vl.OperationKind.COPY)
        (0, gl.copyData)(y, r, t.oldFileFd, i, () => f(p));
      else {
        const w = e.createRequestOptions();
        w.headers.Range = `bytes=${y.start}-${y.end - 1}`;
        const d = e.httpExecutor.createRequest(w, (T) => {
          Ka(T, i) && (T.pipe(r, {
            end: !1
          }), T.once("end", () => f(p)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(d, i), d.end();
      }
    };
    f(t.start);
    return;
  }
  const g = e.createRequestOptions();
  g.headers.Range = a.substring(0, a.length - 2);
  const u = e.httpExecutor.createRequest(g, (f) => {
    if (!Ka(f, i))
      return;
    const p = (0, Xa.safeGetHeader)(f, "content-type"), y = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(p);
    if (y == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${p}"`));
      return;
    }
    const w = new gl.DataSplitter(r, t, s, y[1] || y[2], l, n);
    w.on("error", i), f.pipe(w), f.on("end", () => {
      setTimeout(() => {
        u.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(u, i), u.end();
}
function Ka(e, t) {
  if (e.statusCode >= 400)
    return t((0, Xa.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, Xa.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.ProgressDifferentialDownloadCallbackTransform = void 0;
const QE = gn;
var _r;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(_r || (_r = {}));
class ZE extends QE.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = _r.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == _r.COPY) {
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
    this.operationType = _r.COPY;
  }
  beginRangeDownload() {
    this.operationType = _r.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
ki.ProgressDifferentialDownloadCallbackTransform = ZE;
Object.defineProperty(Cn, "__esModule", { value: !0 });
Cn.DifferentialDownloader = void 0;
const Wr = Re, Ra = Mt, ew = kt, tw = Pr, rw = Ir, Kn = ir, yl = Ui, nw = ki;
class iw {
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
    return (0, Wr.configureRequestUrl)(this.options.newUrl, t), (0, Wr.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Kn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let a = 0, o = 0;
    for (const l of i) {
      const g = l.end - l.start;
      l.kind === Kn.OperationKind.DOWNLOAD ? a += g : o += g;
    }
    const s = this.blockAwareFileInfo.size;
    if (a + o + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${a}, copySize: ${o}, newSize: ${s}`);
    return n.info(`Full: ${El(s)}, To download: ${El(a)} (${Math.round(a / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Ra.close)(i.descriptor).catch((a) => {
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
    const n = await (0, Ra.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Ra.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const a = (0, ew.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((o, s) => {
      const l = [];
      let g;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const A = [];
        let b = 0;
        for (const B of t)
          B.kind === Kn.OperationKind.DOWNLOAD && (A.push(B.end - B.start), b += B.end - B.start);
        const M = {
          expectedByteCounts: A,
          grandTotal: b
        };
        g = new nw.ProgressDifferentialDownloadCallbackTransform(M, this.options.cancellationToken, this.options.onProgress), l.push(g);
      }
      const u = new Wr.DigestTransform(this.blockAwareFileInfo.sha512);
      u.isValidateOnEnd = !1, l.push(u), a.on("finish", () => {
        a.close(() => {
          r.splice(1, 1);
          try {
            u.validate();
          } catch (A) {
            s(A);
            return;
          }
          o(void 0);
        });
      }), l.push(a);
      let f = null;
      for (const A of l)
        A.on("error", s), f == null ? f = A : f = f.pipe(A);
      const p = l[0];
      let y;
      if (this.options.isUseMultipleRangeRequest) {
        y = (0, yl.executeTasksUsingMultipleRangeRequests)(this, t, p, n, s), y(0);
        return;
      }
      let w = 0, d = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", y = (A) => {
        var b, M;
        if (A >= t.length) {
          this.fileMetadataBuffer != null && p.write(this.fileMetadataBuffer), p.end();
          return;
        }
        const B = t[A++];
        if (B.kind === Kn.OperationKind.COPY) {
          g && g.beginFileCopy(), (0, tw.copyData)(B, p, n, s, () => y(A));
          return;
        }
        const Q = `bytes=${B.start}-${B.end - 1}`;
        T.headers.range = Q, (M = (b = this.logger) === null || b === void 0 ? void 0 : b.debug) === null || M === void 0 || M.call(b, `download range: ${Q}`), g && g.beginRangeDownload();
        const ve = this.httpExecutor.createRequest(T, (te) => {
          te.on("error", s), te.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), te.statusCode >= 400 && s((0, Wr.createHttpError)(te)), te.pipe(p, {
            end: !1
          }), te.once("end", () => {
            g && g.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => y(A), 1e3)) : y(A);
          });
        });
        ve.on("redirect", (te, ge, E) => {
          this.logger.info(`Redirect to ${aw(E)}`), d = E, (0, Wr.configureRequestUrl)(new rw.URL(d), T), ve.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(ve, s), ve.end();
      }, y(0);
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
        (0, yl.checkIsRangesSupported)(o, i) && (o.on("error", i), o.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), o.on("data", r), o.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(a, i), a.end();
    });
  }
}
Cn.DifferentialDownloader = iw;
function El(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function aw(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.GenericDifferentialDownloader = void 0;
const ow = Cn;
class sw extends ow.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Li.GenericDifferentialDownloader = sw;
var Bt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = Re;
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
})(Bt);
Object.defineProperty(Nt, "__esModule", { value: !0 });
Nt.NoOpLogger = Nt.AppUpdater = void 0;
const Be = Re, lw = vn, uw = gi, cw = Bl, hr = Mt, fw = Fe, Da = bi, Yt = we, Xt = Mc, wl = An, dw = Di, _l = Bc, hw = bn, Pa = Pi, pw = Hl, mw = rt, gw = Li, pr = Bt;
class Oo extends cw.EventEmitter {
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
        throw (0, Be.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Be.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, _l.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new zc();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Da.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new pr.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (a) => this.checkIfUpdateSupported(a), this.clientPromise = null, this.stagingUserIdPromise = new Da.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Da.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (a) => {
      this._logger.error(`Error: ${a.stack || a.message}`);
    }), r == null ? (this.app = new dw.ElectronAppAdapter(), this.httpExecutor = new _l.ElectronHttpExecutor((a, o) => this.emit("login", a, o))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Xt.parse)(n);
    if (i == null)
      throw (0, Be.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = vw(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new hw.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Pa.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Pa.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = Oo.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new er.Notification(n).show();
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
    const i = await this.stagingUserIdPromise.value, o = Be.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${o}, user id: ${i}`), o < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Xt.parse)(t.version);
    if (r == null)
      throw (0, Be.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Xt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const a = (0, Xt.gt)(r, n), o = (0, Xt.lt)(r, n);
    return a ? !0 : this.allowDowngrade && o;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, uw.release)();
    if (r)
      try {
        if ((0, Xt.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Pa.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    const n = new Be.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Be.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Be.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Be.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Be.CancellationError))
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
    this.emit(pr.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, fw.load)(await (0, hr.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Yt.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, hr.readFile)(t, "utf-8");
      if (Be.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Be.UUID.v5((0, lw.randomBytes)(4096), Be.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, hr.outputFile)(t, r);
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
      const i = Yt.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new wl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(pr.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (b) => this.emit(pr.DOWNLOAD_PROGRESS, b));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, a = i.version, o = r.packageInfo;
    function s() {
      const b = decodeURIComponent(t.fileInfo.url.pathname);
      return b.endsWith(`.${t.fileExtension}`) ? Yt.basename(b) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), g = l.cacheDirForPendingUpdate;
    await (0, hr.mkdir)(g, { recursive: !0 });
    const u = s();
    let f = Yt.join(g, u);
    const p = o == null ? null : Yt.join(g, `package-${a}${Yt.extname(o.path) || ".7z"}`), y = async (b) => (await l.setDownloadedFile(f, p, i, r, u, b), await t.done({
      ...i,
      downloadedFile: f
    }), p == null ? [f] : [f, p]), w = this._logger, d = await l.validateDownloadedPath(f, i, r, w);
    if (d != null)
      return f = d, await y(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, hr.unlink)(f).catch(() => {
    })), A = await (0, wl.createTempUpdateFile)(`temp-${u}`, g, w);
    try {
      await t.task(A, n, p, T), await (0, Be.retry)(() => (0, hr.rename)(A, f), 60, 500, 0, 0, (b) => b instanceof Error && /^EBUSY:/.test(b.message));
    } catch (b) {
      throw await T(), b instanceof Be.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), b;
    }
    return w.info(`New version ${a} has been downloaded to ${f}`), await y(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, a) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const o = (0, mw.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${o[0]}", new: ${o[1]})`);
      const s = async (u) => {
        const f = await this.httpExecutor.downloadToBuffer(u, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (f == null || f.length === 0)
          throw new Error(`Blockmap "${u.href}" is empty`);
        try {
          return JSON.parse((0, pw.gunzipSync)(f).toString());
        } catch (p) {
          throw new Error(`Cannot parse blockmap "${u.href}", error: ${p}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: Yt.join(this.downloadedUpdateHelper.cacheDir, a),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(pr.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (u) => this.emit(pr.DOWNLOAD_PROGRESS, u));
      const g = await Promise.all(o.map((u) => s(u)));
      return await new gw.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(g[0], g[1]), !1;
    } catch (o) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), this._testOnlyOptions != null)
        throw o;
      return !0;
    }
  }
}
Nt.AppUpdater = Oo;
function vw(e) {
  const t = (0, Xt.prerelease)(e);
  return t != null && t.length > 0;
}
class zc {
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
Nt.NoOpLogger = zc;
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.BaseUpdater = void 0;
const Tl = mi, yw = Nt;
class Ew extends yw.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      er.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
    const i = (0, Tl.spawnSync)(t, r, {
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
        const s = { stdio: i, env: n, detached: !0 }, l = (0, Tl.spawn)(t, r, s);
        l.on("error", (g) => {
          o(g);
        }), l.unref(), l.pid !== void 0 && a(!0);
      } catch (s) {
        o(s);
      }
    });
  }
}
Tt.BaseUpdater = Ew;
var cn = {}, $n = {};
Object.defineProperty($n, "__esModule", { value: !0 });
$n.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const mr = Mt, ww = Cn, _w = Hl;
class Tw extends ww.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Xc(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await Sw(this.options.oldFile), i);
  }
}
$n.FileWithEmbeddedBlockMapDifferentialDownloader = Tw;
function Xc(e) {
  return JSON.parse((0, _w.inflateRawSync)(e).toString());
}
async function Sw(e) {
  const t = await (0, mr.open)(e, "r");
  try {
    const r = (await (0, mr.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, mr.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, mr.read)(t, i, 0, i.length, r - n.length - i.length), await (0, mr.close)(t), Xc(i);
  } catch (r) {
    throw await (0, mr.close)(t), r;
  }
}
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.AppImageUpdater = void 0;
const Sl = Re, Al = mi, Aw = Mt, bw = kt, Yr = we, Cw = Tt, $w = $n, Iw = $e, bl = Bt;
class Ow extends Cw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Iw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        const o = process.env.APPIMAGE;
        if (o == null)
          throw (0, Sl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, o, i, r, t)) && await this.httpExecutor.download(n.url, i, a), await (0, Aw.chmod)(i, 493);
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
      return this.listenerCount(bl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(bl.DOWNLOAD_PROGRESS, s)), await new $w.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, o).download(), !1;
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Sl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, bw.unlinkSync)(r);
    let n;
    const i = Yr.basename(r), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Yr.basename(a) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Yr.join(Yr.dirname(r), Yr.basename(a)), (0, Al.execFileSync)("mv", ["-f", a, n]), n !== r && this.emit("appimage-filename-updated", n);
    const o = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], o) : (o.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Al.execFileSync)(n, [], { env: o })), !0;
  }
}
cn.AppImageUpdater = Ow;
var fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.DebUpdater = void 0;
const Rw = Tt, Dw = $e, Cl = Bt;
class Pw extends Rw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Dw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(Cl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit(Cl.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, a);
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
fn.DebUpdater = Pw;
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.PacmanUpdater = void 0;
const Nw = Tt, $l = Bt, xw = $e;
class Fw extends Nw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, xw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount($l.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit($l.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, a);
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
dn.PacmanUpdater = Fw;
var hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.RpmUpdater = void 0;
const Lw = Tt, Il = Bt, Uw = $e;
class kw extends Lw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Uw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(Il.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit(Il.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, a);
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
hn.RpmUpdater = kw;
var pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.MacUpdater = void 0;
const Ol = Re, Na = Mt, Mw = kt, Rl = we, Bw = Df, jw = Nt, Hw = $e, Dl = mi, Pl = vn;
class qw extends jw.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = er.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
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
      this.debug("Checking for macOS Rosetta environment"), a = (0, Dl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${a})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let o = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const p = (0, Dl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${p}`), o = o || p;
    } catch (f) {
      n.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    o = o || process.arch === "arm64" || a;
    const s = (f) => {
      var p;
      return f.url.pathname.includes("arm64") || ((p = f.info.url) === null || p === void 0 ? void 0 : p.includes("arm64"));
    };
    o && r.some(s) ? r = r.filter((f) => o === s(f)) : r = r.filter((f) => !s(f));
    const l = (0, Hw.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Ol.newError)(`ZIP file not provided: ${(0, Ol.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const g = t.updateInfoAndProvider.provider, u = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, p) => {
        const y = Rl.join(this.downloadedUpdateHelper.cacheDir, u), w = () => (0, Na.pathExistsSync)(y) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let d = !0;
        w() && (d = await this.differentialDownloadInstaller(l, t, f, g, u)), d && await this.httpExecutor.download(l.url, f, p);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const p = Rl.join(this.downloadedUpdateHelper.cacheDir, u);
            await (0, Na.copyFile)(f.downloadedFile, p);
          } catch (p) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${p.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, a = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Na.stat)(i)).size, o = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, Bw.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      o.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (g) => {
      const u = g.address();
      return typeof u == "string" ? u : `http://127.0.0.1:${u == null ? void 0 : u.port}`;
    };
    return await new Promise((g, u) => {
      const f = (0, Pl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), p = Buffer.from(`autoupdater:${f}`, "ascii"), y = `/${(0, Pl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, d) => {
        const T = w.url;
        if (o.info(`${T} requested`), T === "/") {
          if (!w.headers.authorization || w.headers.authorization.indexOf("Basic ") === -1) {
            d.statusCode = 401, d.statusMessage = "Invalid Authentication Credentials", d.end(), o.warn("No authenthication info");
            return;
          }
          const M = w.headers.authorization.split(" ")[1], B = Buffer.from(M, "base64").toString("ascii"), [Q, ve] = B.split(":");
          if (Q !== "autoupdater" || ve !== f) {
            d.statusCode = 401, d.statusMessage = "Invalid Authentication Credentials", d.end(), o.warn("Invalid authenthication credentials");
            return;
          }
          const te = Buffer.from(`{ "url": "${l(this.server)}${y}" }`);
          d.writeHead(200, { "Content-Type": "application/json", "Content-Length": te.length }), d.end(te);
          return;
        }
        if (!T.startsWith(y)) {
          o.warn(`${T} requested, but not supported`), d.writeHead(404), d.end();
          return;
        }
        o.info(`${y} requested by Squirrel.Mac, pipe ${i}`);
        let A = !1;
        d.on("finish", () => {
          A || (this.nativeUpdater.removeListener("error", u), g([]));
        });
        const b = (0, Mw.createReadStream)(i);
        b.on("error", (M) => {
          try {
            d.end();
          } catch (B) {
            o.warn(`cannot end response: ${B}`);
          }
          A = !0, this.nativeUpdater.removeListener("error", u), u(new Error(`Cannot pipe "${i}": ${M}`));
        }), d.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": a
        }), b.pipe(d);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${p.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", u), this.nativeUpdater.checkForUpdates()) : g([]);
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
pn.MacUpdater = qw;
var mn = {}, Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
Ro.verifySignature = Vw;
const Nl = Re, Kc = mi, Gw = gi, xl = we;
function Vw(e, t, r) {
  return new Promise((n, i) => {
    const a = t.replace(/'/g, "''");
    r.info(`Verifying signature ${a}`), (0, Kc.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${a}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (o, s, l) => {
      var g;
      try {
        if (o != null || l) {
          xa(r, o, l, i), n(null);
          return;
        }
        const u = Ww(s);
        if (u.Status === 0) {
          try {
            const w = xl.normalize(u.Path), d = xl.normalize(t);
            if (r.info(`LiteralPath: ${w}. Update Path: ${d}`), w !== d) {
              xa(r, new Error(`LiteralPath of ${w} is different than ${d}`), l, i), n(null);
              return;
            }
          } catch (w) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(g = w.message) !== null && g !== void 0 ? g : w.stack}`);
          }
          const p = (0, Nl.parseDn)(u.SignerCertificate.Subject);
          let y = !1;
          for (const w of e) {
            const d = (0, Nl.parseDn)(w);
            if (d.size ? y = Array.from(d.keys()).every((A) => d.get(A) === p.get(A)) : w === p.get("CN") && (r.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), y = !0), y) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(u, (p, y) => p === "RawData" ? void 0 : y, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (u) {
        xa(r, u, null, i), n(null);
        return;
      }
    });
  });
}
function Ww(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function xa(e, t, r, n) {
  if (Yw()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Kc.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function Yw() {
  const e = Gw.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.NsisUpdater = void 0;
const Jn = Re, Fl = we, zw = Tt, Xw = $n, Ll = Bt, Kw = $e, Jw = Mt, Qw = Ro, Ul = Ir;
class Zw extends zw.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, Qw.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, Kw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, a, o, s) => {
        const l = n.packageInfo, g = l != null && o != null;
        if (g && t.disableWebInstaller)
          throw (0, Jn.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !g && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (g || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Jn.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, a);
        const u = await this.verifySignature(i);
        if (u != null)
          throw await s(), (0, Jn.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${u}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (g && await this.differentialDownloadWebPackage(t, l, o, r))
          try {
            await this.httpExecutor.download(new Ul.URL(l.path), o, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, Jw.unlink)(o);
            } catch {
            }
            throw f;
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
      this.spawnLog(Fl.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((o) => this.dispatchError(o));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), a(), !0) : (this.spawnLog(r, n).catch((o) => {
      const s = o.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${o.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? a() : s === "ENOENT" ? er.shell.openPath(r).catch((l) => this.dispatchError(l)) : this.dispatchError(o);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const a = {
        newUrl: new Ul.URL(r.path),
        oldFile: Fl.join(this.downloadedUpdateHelper.cacheDir, Jn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Ll.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit(Ll.DOWNLOAD_PROGRESS, o)), await new Xw.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, a).download();
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "win32";
    }
    return !1;
  }
}
mn.NsisUpdater = Zw;
(function(e) {
  var t = je && je.__createBinding || (Object.create ? function(T, A, b, M) {
    M === void 0 && (M = b);
    var B = Object.getOwnPropertyDescriptor(A, b);
    (!B || ("get" in B ? !A.__esModule : B.writable || B.configurable)) && (B = { enumerable: !0, get: function() {
      return A[b];
    } }), Object.defineProperty(T, M, B);
  } : function(T, A, b, M) {
    M === void 0 && (M = b), T[M] = A[b];
  }), r = je && je.__exportStar || function(T, A) {
    for (var b in T) b !== "default" && !Object.prototype.hasOwnProperty.call(A, b) && t(A, T, b);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = Mt, i = we;
  var a = Tt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return a.BaseUpdater;
  } });
  var o = Nt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return o.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return o.NoOpLogger;
  } });
  var s = $e;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = cn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var g = fn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return g.DebUpdater;
  } });
  var u = dn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return u.PacmanUpdater;
  } });
  var f = hn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var p = pn;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return p.MacUpdater;
  } });
  var y = mn;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return y.NsisUpdater;
  } }), r(Bt, e);
  let w;
  function d() {
    if (process.platform === "win32")
      w = new mn.NsisUpdater();
    else if (process.platform === "darwin")
      w = new pn.MacUpdater();
    else {
      w = new cn.AppImageUpdater();
      try {
        const T = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(T))
          return w;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const A = (0, n.readFileSync)(T).toString().trim();
        switch (console.info("Found package-type:", A), A) {
          case "deb":
            w = new fn.DebUpdater();
            break;
          case "rpm":
            w = new hn.RpmUpdater();
            break;
          case "pacman":
            w = new dn.PacmanUpdater();
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
    get: () => w || d()
  });
})(dt);
function Qn(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Jc = { exports: {} };
(function(e, t) {
  (function(r) {
    e.exports = r();
  })(function() {
    return (/* @__PURE__ */ function() {
      function r(n, i, a) {
        function o(g, u) {
          if (!i[g]) {
            if (!n[g]) {
              var f = typeof Qn == "function" && Qn;
              if (!u && f) return f(g, !0);
              if (s) return s(g, !0);
              var p = new Error("Cannot find module '" + g + "'");
              throw p.code = "MODULE_NOT_FOUND", p;
            }
            var y = i[g] = { exports: {} };
            n[g][0].call(y.exports, function(w) {
              var d = n[g][1][w];
              return o(d || w);
            }, y, y.exports, r, n, i, a);
          }
          return i[g].exports;
        }
        for (var s = typeof Qn == "function" && Qn, l = 0; l < a.length; l++) o(a[l]);
        return o;
      }
      return r;
    }())({ 1: [function(r, n, i) {
      function a(h) {
        "@babel/helpers - typeof";
        return a = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(S) {
          return typeof S;
        } : function(S) {
          return S && typeof Symbol == "function" && S.constructor === Symbol && S !== Symbol.prototype ? "symbol" : typeof S;
        }, a(h);
      }
      var o = r("cheerio"), s = r("dasu");
      r("async.parallellimit"), s.follow = !0, s.debug = !1;
      var l = r("./util.js"), g = l._getScripts, u = l._findLine, f = l._between, p = 3, y = 333, w = r("jsonpath-plus").JSONPath, d = {};
      d.query = function(h, S) {
        var O = {
          path: S,
          json: h,
          resultType: "value"
        };
        return w(O);
      }, d.value = function(h, S) {
        var O = {
          path: S,
          json: h,
          resultType: "value"
        }, P = w(O)[0];
        return P;
      };
      var T = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (yt-search; https://www.npmjs.com/package/yt-search)", A = T, b = r("url"), M = {};
      Object.keys(process.env).forEach(function(h) {
        var S = process.env[h];
        if (S == "0" || S == "false" || !S)
          return M[h] = !1;
        M[h.toLowerCase()] = S;
      });
      var B = M.debug;
      function Q() {
        B && (console.log("DEBUGGING"), console.log.apply(this, arguments));
      }
      var ve = r("querystring"), te = r("human-time"), ge = {
        YT: "https://youtube.com",
        SEARCH_MOBILE: "https://m.youtube.com/results",
        SEARCH_DESKTOP: "https://www.youtube.com/results"
      };
      n.exports = function(h, S) {
        return E(h, S);
      }, n.exports.search = E, n.exports._parseSearchResultInitialData = L, n.exports._parseVideoInitialData = k, n.exports._parsePlaylistInitialData = W, n.exports._videoFilter = J, n.exports._playlistFilter = K, n.exports._channelFilter = Y, n.exports._liveFilter = ne, n.exports._allFilter = N, n.exports._parseNumbers = V, n.exports._parsePlaylistLastUpdateTime = Z;
      function E(h, S) {
        if (!S)
          return new Promise(function(q, H) {
            E(h, function(X, ue) {
              if (X) return H(X);
              q(ue);
            });
          });
        var O;
        typeof h == "string" ? O = {
          query: h
        } : O = h, O._attempts = (O._attempts || 0) + 1;
        var P = Object.assign({}, O);
        function F(q, H) {
          if (q) {
            if (O._attempts > (O.MAX_RETRY_ATTEMPTS || p))
              return S(q, H);
            Q(" === "), Q(" RETRYING: " + O._attempts), Q(" === ");
            var X = O._attempts, ue = Math.pow(2, X - 1) * (O.RETRY_INTERVAL || y);
            setTimeout(function() {
              E(P, S);
            }, ue);
          } else
            return S(q, H);
        }
        if (O.userAgent && (A = O.userAgent), O.search = O.query || O.search, O.original_search = O.search, O.videoId)
          return $(O, F);
        if (O.listId)
          return x(O, F);
        if (!O.search)
          return S(Error("yt-search: no query given"));
        U();
        function U() {
          I(O, F);
        }
      }
      function J(h, S, O) {
        if (h.type !== "video") return !1;
        var P = h.videoId, F = O.findIndex(function(U) {
          return P === U.videoId;
        });
        return F === S;
      }
      function K(h, S, O) {
        if (h.type !== "list") return !1;
        var P = h.listId, F = O.findIndex(function(U) {
          return P === U.listId;
        });
        return F === S;
      }
      function Y(h, S, O) {
        if (h.type !== "channel") return !1;
        var P = h.url, F = O.findIndex(function(U) {
          return P === U.url;
        });
        return F === S;
      }
      function ne(h, S, O) {
        if (h.type !== "live") return !1;
        var P = h.videoId, F = O.findIndex(function(U) {
          return P === U.videoId;
        });
        return F === S;
      }
      function N(h, S, O) {
        switch (h.type) {
          case "video":
          case "list":
          case "channel":
          case "live":
            break;
          default:
            return !1;
        }
        var P = h.url, F = O.findIndex(function(U) {
          return P === U.url;
        });
        return F === S;
      }
      function I(h, S) {
        var O = ve.escape(h.search).split(/\s+/), P = h.hl || "en", F = h.gl || "US", U = h.category || "", q = Number(h.pageStart) || 1, H = Number(h.pageEnd) || Number(h.pages) || 1;
        q <= 0 && (q = 1, H >= 1 && (H += 1)), Number.isNaN(H) && S("error: pageEnd must be a number"), h.pageStart = q, h.pageEnd = H, h.currentPage = h.currentPage || q;
        var X = "?";
        X += "search_query=" + O.join("+"), X.indexOf("&hl=") === -1 && (X += "&hl=" + P), X.indexOf("&gl=") === -1 && (X += "&gl=" + F), U && (X += "&category=" + U), h.sp && (X += "&sp=" + h.sp);
        var ue = ge.SEARCH_DESKTOP + X, ce = b.parse(ue);
        ce.headers = {
          "user-agent": A,
          accept: "text/html",
          "accept-encoding": "gzip",
          "accept-language": "en-US"
        }, Q(ce), Q("getting results: " + h.currentPage), s.req(ce, function(pe, de, be) {
          if (pe)
            S(pe);
          else {
            if (de.status !== 200)
              return S("http status: " + de.status);
            if (B) {
              var D = r("fs");
              r("path"), D.writeFileSync("dasu.response", de.responseText, "utf8");
            }
            try {
              L(be, function(se, le) {
                if (se) return S(se);
                var fe = le, De = fe.filter(J), ut = fe.filter(K), Se = fe.filter(Y), St = fe.filter(ne), ze = fe.filter(N);
                h._data = h._data || {}, h._data.videos = h._data.videos || [], h._data.playlists = h._data.playlists || [], h._data.channels = h._data.channels || [], h._data.live = h._data.live || [], h._data.all = h._data.all || [], De.forEach(function(Ce) {
                  h._data.videos.push(Ce);
                }), ut.forEach(function(Ce) {
                  h._data.playlists.push(Ce);
                }), Se.forEach(function(Ce) {
                  h._data.channels.push(Ce);
                }), St.forEach(function(Ce) {
                  h._data.live.push(Ce);
                }), ze.forEach(function(Ce) {
                  h._data.all.push(Ce);
                }), h.currentPage++;
                var pt = h.currentPage <= h.pageEnd;
                if (pt && le._sp)
                  h.sp = le._sp, setTimeout(function() {
                    I(h, S);
                  }, 2500);
                else {
                  var jt = h._data.videos.filter(J), Me = h._data.playlists.filter(K), Ze = h._data.channels.filter(Y), ar = h._data.live.filter(ne), Nr = h._data.all.slice(N);
                  S(null, {
                    all: Nr,
                    videos: jt,
                    live: ar,
                    playlists: Me,
                    lists: Me,
                    accounts: Ze,
                    channels: Ze
                  });
                }
              });
            } catch (se) {
              S(se);
            }
          }
        });
      }
      function L(h, S) {
        var O = /{.*}/, P = o.load(h), F = P("div#initial-data").html() || "";
        if (F = O.exec(F) || "", !F)
          for (var U = P("script"), q = 0; q < U.length; q++) {
            var H = P(U[q]).html(), X = H.split(`
`);
            X.forEach(function(Je) {
              for (var nt; (nt = Je.indexOf("ytInitialData")) >= 0; ) {
                Je = Je.slice(nt + 13);
                var Br = O.exec(Je);
                Br && Br.length > F.length && (F = Br);
              }
            });
          }
        if (!F)
          return S("could not find inital data in the html document");
        var ue = [], ce = [], pe = JSON.parse(F[0]), de = d.query(pe, "$..itemSectionRenderer..contents.*");
        d.query(pe, "$..primaryContents..contents.*").forEach(function(Je) {
          de.push(Je);
        }), Q("items.length: " + de.length);
        for (var be = 0; be < de.length; be++) {
          var D = de[be], se = void 0, le = "unknown", fe = d.value(D, "$..compactPlaylistRenderer") || d.value(D, "$..playlistRenderer") || d.value(D, '$..lockupViewModel..metadata..metadataRows[0]..metadataParts[1]..text.[?(@property == "content" && @ == "Playlist")]'), De = d.value(D, "$..compactChannelRenderer") || d.value(D, "$..channelRenderer"), ut = d.value(D, "$..compactVideoRenderer") || d.value(D, "$..videoRenderer"), Se = fe && d.value(D, "$..watchEndpoint..playlistId"), St = De && d.value(D, "$..channelId"), ze = ut && d.value(D, "$..videoId"), pt = d.query(D, "$..viewCountText..text").join(""), jt = (
            // if scheduled livestream (has not started yet)
            d.query(D, "$..thumbnailOverlayTimeStatusRenderer..style").join("").toUpperCase().trim() === "UPCOMING"
          ), Me = pt.indexOf("watching") >= 0 || d.query(D, "$..badges..label").join("").toUpperCase().trim() === "LIVE NOW" || d.query(D, "$..thumbnailOverlayTimeStatusRenderer..text").join("").toUpperCase().trim() === "LIVE" || jt;
          ze && (le = "video"), St && (le = "channel"), Se && (le = "list"), Me && (le = "live");
          try {
            switch (le) {
              case "video":
                {
                  var Ze = ae(d.value(D, "$..thumbnail..url")) || ae(d.value(D, "$..thumbnails..url")) || ae(d.value(D, "$..thumbnails")), ar = d.value(D, "$..title..text") || d.value(D, "$..title..simpleText"), Nr = d.value(D, "$..shortBylineText..text") || d.value(D, "$..longBylineText..text"), Ce = d.value(D, "$..shortBylineText..url") || d.value(D, "$..longBylineText..url"), In = d.value(D, "$..publishedTimeText..text") || d.value(D, "$..publishedTimeText..simpleText"), Mi = d.value(D, "$..viewCountText..text") || d.value(D, "$..viewCountText..simpleText") || "0", Bi = Number(Mi.split(/\s+/)[0].split(/[,.]/).join("").trim()), xr = d.value(D, "$..lengthText..text") || d.value(D, "$..lengthText..simpleText"), mt = ie(xr || "0:00"), Fr = d.query(D, "$..detailedMetadataSnippets..snippetText..text").join("") || d.query(D, "$..description..text").join("") || d.query(D, "$..descriptionSnippet..text").join(""), Lr = ge.YT + "/watch?v=" + ze;
                  se = {
                    type: "video",
                    videoId: ze,
                    url: Lr,
                    title: ar.trim(),
                    description: Fr,
                    image: Ze,
                    thumbnail: Ze,
                    seconds: Number(mt.seconds),
                    timestamp: mt.timestamp,
                    duration: mt,
                    ago: In,
                    views: Number(Bi),
                    author: {
                      name: Nr,
                      url: ge.YT + Ce
                    }
                  };
                }
                break;
              case "list":
                {
                  var or = ae(d.value(D, "$..primaryThumbnail..url")) || ae(d.value(D, "$..thumbnail..url")) || // DEPRECATED?
                  ae(d.value(D, "$..thumbnails..url")) || // DEPRECATED
                  ae(d.value(D, "$..thumbnails")), Ht = d.value(D, "$..metadata..title..content") || d.value(D, "$..title..text") || // DEPRECATED?
                  d.value(D, "$..title..simpleText"), ji = d.value(D, "$..metadataParts[0]..text..content") || d.value(D, "$..shortBylineText..text") || // DEPRECATED?
                  d.value(D, "$..shortBylineText..text") || // DEPRECATED?
                  d.value(D, "$..longBylineText..text") || // DEPRECATED?
                  d.value(D, "$..shortBylineText..simpleText") || // DEPRECATED?
                  d.value(D, "$..longBylineText..simpleTextn") || "YouTube", Hi = d.value(D, "$..metadataParts[0]..url") || d.value(D, "$..shortBylineText..url") || // DEPRECATED?
                  d.value(D, "$..longBylineText..url") || "", qi = d.value(D, "$..overlays..thumbnailBadges..text"), Gi = d.value(D, "$..videoCountShortText..text") || // DEPRECATED?
                  d.value(D, "$..videoCountText..text") || // DEPRECATED?
                  d.value(D, "$..videoCountShortText..simpleText") || // DEPRECATED?
                  d.value(D, "$..videoCountText..simpleText") || // DEPRECATED?
                  d.value(D, "$..thumbnailText..text") || // DEPRECATED?
                  d.value(D, "$..thumbnailText..simpleText"), Vi = ge.YT + "/playlist?list=" + Se;
                  se = {
                    type: "list",
                    listId: Se,
                    url: Vi,
                    title: Ht.trim(),
                    image: or,
                    thumbnail: or,
                    videoCount: Number(V(qi)[0]) || Gi,
                    author: {
                      name: ji,
                      url: ge.YT + Hi
                    }
                  };
                }
                break;
              case "channel":
                {
                  var Ur = ae(d.value(D, "$..thumbnail..url")) || ae(d.value(D, "$..thumbnails..url")) || ae(d.value(D, "$..thumbnails")), sr = d.value(D, "$..title..text") || d.value(D, "$..title..simpleText") || d.value(D, "$..displayName..text"), gt = d.value(D, "$..channelRenderer..channelId") || "", Wi = d.value(D, "$..shortBylineText..text") || d.value(D, "$..longBylineText..text") || d.value(D, "$..displayName..text") || d.value(D, "$..displayName..simpleText"), Yi = d.query(D, "$..channelRenderer..descriptionSnippet..text").join("") || "", qt = d.value(D, "$..videoCountText..simpleText") || d.value(D, "$..videoCountText..label") || d.value(D, "$..videoCountText..text") || "0", zi = d.value(D, "$..channelRenderer..ownerBadges..style") || d.value(D, "$..channelRenderer..ownerBadges..tooltip") || d.value(D, "$..channelRenderer..ownerBadges..label") || "", Xi = (
                    // has "verified" or "_verified" text in it
                    zi.toLowerCase().trim().search(/[\s_]?verified/) >= 0
                  ), Pe = d.value(D, "$..subscriberCountText..simpleText") || d.value(D, "$..subscriberCountText..text") || "0";
                  typeof Pe == "string" && (Pe.indexOf("subscribe") < 1 && qt.indexOf("subscribe") > 0 && (Pe = qt, qt = "-1"), Pe = Pe.split(/\s+/).filter(function(Je) {
                    return Je.match(/\d/);
                  })[0]);
                  var On = d.value(D, "$..navigationEndpoint..url") || d.value(D, "$..browseEndpoint..canonicalBaseUrl") || d.value(D, "$..browseEndpoint..url") || "/user/" + sr;
                  se = {
                    type: "channel",
                    name: Wi,
                    url: ge.YT + On,
                    baseUrl: On,
                    id: gt,
                    title: sr.trim(),
                    about: Yi,
                    image: Ur,
                    thumbnail: Ur,
                    videoCount: Number(V(qt)[0]),
                    videoCountLabel: qt,
                    verified: Xi,
                    subCount: Te(Pe),
                    subCountLabel: Pe
                  };
                }
                break;
              case "live":
                {
                  var Rn = ae(d.value(D, "$..thumbnail..url")) || ae(d.value(D, "$..thumbnails..url")) || ae(d.value(D, "$..thumbnails")), Ki = d.value(D, "$..title..text") || d.value(D, "$..title..simpleText"), Ji = d.value(D, "$..shortBylineText..text") || d.value(D, "$..longBylineText..text"), Qi = d.value(D, "$..shortBylineText..url") || d.value(D, "$..longBylineText..url"), vt = d.query(D, "$..viewCountText..text").join("") || d.query(D, "$..viewCountText..simpleText").join("") || "0", Zi = Number(vt.split(/\s+/)[0].split(/[,.]/).join("").trim()), ea = d.query(D, "$..detailedMetadataSnippets..snippetText..text").join("") || d.query(D, "$..description..text").join("") || d.query(D, "$..descriptionSnippet..text").join(""), kr = d.value(D, "$..upcomingEventData..startTime"), Mr = Date.now() > kr ? kr * 1e3 : kr, ta = z(Mr), lr = ge.YT + "/watch?v=" + ze;
                  se = {
                    type: "live",
                    videoId: ze,
                    url: lr,
                    title: Ki.trim(),
                    description: ea,
                    image: Rn,
                    thumbnail: Rn,
                    watching: Number(Zi),
                    author: {
                      name: Ji,
                      url: ge.YT + Qi
                    }
                  }, Mr ? (se.startTime = Mr, se.startDate = ta, se.status = "UPCOMING") : se.status = "LIVE";
                }
                break;
              default:
            }
            se && ce.push(se);
          } catch (Je) {
            Q(Je), ue.push(Je);
          }
        }
        var ra = d.value(pe, "$..continuation");
        return ce._ctoken = ra, ue.length ? S(ue.pop(), ce) : S(null, ce);
      }
      function $(h, S) {
        Q("fn: getVideoMetaData");
        var O;
        typeof h == "string" && (O = h), a(h) === "object" && (O = h.videoId);
        var P = h.hl, F = P === void 0 ? "en" : P, U = h.gl, q = U === void 0 ? "US" : U, H = "https://www.youtube.com/watch?hl=".concat(F, "&gl=").concat(q, "&v=").concat(O), X = b.parse(H);
        X.headers = {
          "user-agent": A,
          accept: "text/html",
          "accept-encoding": "gzip",
          "accept-language": "".concat(F, "-").concat(q)
        }, X.headers["user-agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15", s.req(X, function(ue, ce, pe) {
          if (ue)
            S(ue);
          else {
            if (ce.status !== 200)
              return S("http status: " + ce.status);
            if (B) {
              var de = r("fs");
              r("path"), de.writeFileSync("dasu.response", ce.responseText, "utf8");
            }
            try {
              k(pe, S);
            } catch (be) {
              S(be);
            }
          }
        });
      }
      function k(h, S) {
        Q("_parseVideoInitialData"), h = g(h);
        var O = f(u(/ytInitialData.*=\s*{/, h), "{", "}");
        if (!O)
          return S("could not find inital data in the html document");
        var P = f(u(/ytInitialPlayerResponse.*=\s*{/, h), "{", "}");
        if (!P)
          return S("could not find inital player data in the html document");
        var F = JSON.parse(O), U = JSON.parse(P), q = d.value(F, "$..currentVideoEndpoint..videoId");
        if (!q || d.value(U, "$..status") === "ERROR" || d.value(U, "$..reason") === "Video unavailable")
          return S("video unavailable");
        var H = c(F), X = d.query(F, "$..detailedMetadataSnippets..snippetText..text").join("") || d.query(F, "$..description..text").join("") || d.query(U, "$..description..simpleText").join("") || d.query(U, "$..microformat..description..simpleText").join("") || d.query(U, "$..videoDetails..shortDescription").join(""), ue = d.value(F, "$..owner..title..text") || d.value(F, "$..owner..title..simpleText"), ce = d.value(F, "$..owner..navigationEndpoint..url") || d.value(F, "$..owner..title..url"), pe = "https://i.ytimg.com/vi/" + q + "/hqdefault.jpg", de = Number(d.value(U, "$..videoDetails..lengthSeconds")), be = m(de * 1e3), D = ie(be), se = d.value(F, "$..uploadDate") || d.value(F, "$..dateText..simpleText"), le = se && te(new Date(se)) || "", fe = {
          title: H,
          description: X,
          url: ge.YT + "/watch?v=" + q,
          videoId: q,
          seconds: Number(D.seconds),
          timestamp: D.timestamp,
          duration: D,
          views: Number(d.value(U, "$..videoDetails..viewCount")),
          genre: (d.value(U, "$..category") || "").toLowerCase(),
          uploadDate: z(se),
          ago: le,
          // ex: 10 years ago
          image: pe,
          thumbnail: pe,
          author: {
            name: ue,
            url: ge.YT + ce
          }
        };
        if (!fe.description || !fe.timestamp || !fe.seconds || !fe.views) {
          Q("in video metadata backup to fill in missing data");
          var De = "".concat(fe.title);
          for (Q("q (before): " + De); De && De[0].match(/[-]/); ) De = De.slice(1);
          Q("q (after) : " + De), setTimeout(function() {
            E({
              query: De,
              options: {
                RETRY_INTERVAL: 1e3
              }
            }, function(ut, Se) {
              if (ut) return S(ut);
              if (!Se.videos) return S(null, fe);
              for (var St = function() {
                var Me = Se.videos[pt];
                if (!Me) return 0;
                if (fe.videoId != null && fe.videoId === (Me == null ? void 0 : Me.videoId))
                  return Object.keys(fe).forEach(function(Ze) {
                    fe[Ze] = Me[Ze] || fe[Ze];
                  }), 1;
              }, ze, pt = 0; pt < Se.videos.length && (ze = St(), !(ze !== 0 && ze === 1)); pt++)
                ;
              S(ut, fe);
            });
          }, 1500);
        } else
          S(null, fe);
      }
      function x(h, S) {
        Q("fn: getPlaylistMetaData");
        var O;
        typeof h == "string" && (O = h), a(h) === "object" && (O = h.listId || h.playlistId);
        var P = h.hl, F = P === void 0 ? "en" : P, U = h.gl, q = U === void 0 ? "US" : U, H = "https://www.youtube.com/playlist?hl=".concat(F, "&gl=").concat(q, "&list=").concat(O), X = b.parse(H);
        X.headers = {
          "user-agent": A,
          accept: "text/html",
          "accept-encoding": "gzip",
          "accept-language": "".concat(F, "-").concat(q)
        }, s.req(X, function(ue, ce, pe) {
          if (ue)
            S(ue);
          else {
            if (ce.status !== 200)
              return S("http status: " + ce.status);
            if (B) {
              var de = r("fs");
              r("path"), de.writeFileSync("dasu.response", ce.responseText, "utf8");
            }
            try {
              W(pe, S);
            } catch (be) {
              S(be);
            }
          }
        });
      }
      function W(h, S) {
        Q("fn: parsePlaylistBody"), h = g(h);
        var O = h.match(/ytInitialData.*=\s*({.*});/)[1];
        if (!O)
          throw new Error("failed to parse ytInitialData json data");
        var P = JSON.parse(O), F = d.value(P, "$..alerts..alertRenderer");
        if (F && typeof F.type == "string" && F.type.toLowerCase() === "error") {
          var U = "playlist error, not found?";
          throw a(F.text) === "object" && (U = d.query(F.text, "$..text").join("")), typeof F.text == "string" && (U = F.text), new Error("playlist error: " + U);
        }
        var q = "";
        d.query(P, "$..alerts..text").forEach(function(se) {
          if (typeof se == "string" && (q += se), a(se) === "object") {
            var le = d.value(se, "$..simpleText");
            le && (q += le);
          }
        });
        var H = d.value(P, "$..microformat..urlCanonical").split("=")[1], X = 0;
        try {
          var ue = d.value(P, "$..sidebar.playlistSidebarRenderer.items[0]..stats[1].simpleText");
          ue.toLowerCase() === "no views" ? X = 0 : X = ue.match(/\d+/g).join("");
        } catch {
        }
        var ce = (d.value(P, "$..sidebar.playlistSidebarRenderer.items[0]..stats[0].simpleText") || d.query(P, "$..sidebar.playlistSidebarRenderer.items[0]..stats[0]..text").join("")).match(/\d+/g).join(""), pe = d.query(P, "$..playlistVideoListRenderer..contents")[0];
        a(pe[pe.length - 1].continuationItemRenderer);
        var de = [];
        pe.forEach(function(se) {
          if (se.playlistVideoRenderer) {
            var le = se, fe = ie(d.value(le, "$..lengthText..simpleText") || d.value(le, "$..thumbnailOverlayTimeStatusRenderer..simpleText") || d.query(le, "$..lengthText..text").join("") || d.query(le, "$..thumbnailOverlayTimeStatusRenderer..text").join("")), De = {
              title: d.value(le, "$..title..simpleText") || d.value(le, "$..title..text") || d.query(le, "$..title..text").join(""),
              videoId: d.value(le, "$..videoId"),
              listId: H,
              thumbnail: ae(d.value(le, "$..thumbnail..url")) || ae(d.value(le, "$..thumbnails..url")) || ae(d.value(le, "$..thumbnails")),
              // ref: issue #35 https://github.com/talmobi/yt-search/issues/35
              duration: fe,
              author: {
                name: d.value(le, "$..shortBylineText..runs[0]..text"),
                url: "https://youtube.com" + d.value(le, "$..shortBylineText..runs[0]..url")
              }
            };
            de.push(De);
          }
        });
        var be = ae(d.value(P, "$..microformat..thumbnail..url")) || ae(d.value(P, "$..microformat..thumbnails..url")) || ae(d.value(P, "$..microformat..thumbnails")), D = {
          title: d.value(P, "$..microformat..title"),
          listId: H,
          url: "https://youtube.com/playlist?list=" + H,
          size: Number(ce),
          views: Number(X),
          // lastUpdate: lastUpdate,
          date: Z(d.value(P, "$..sidebar.playlistSidebarRenderer.items[0]..stats[2]..simpleText") || d.query(P, "$..sidebar.playlistSidebarRenderer.items[0]..stats[2]..text").join("") || ""),
          image: be || de[0].thumbnail,
          thumbnail: be || de[0].thumbnail,
          // playlist items/videos
          videos: de,
          alertInfo: q,
          author: {
            name: d.value(P, "$..videoOwner..title..runs[0]..text"),
            url: "https://youtube.com" + d.value(P, "$..videoOwner..navigationEndpoint..url")
          }
        };
        S && S(null, D);
      }
      function Z(h) {
        Q("fn: _parsePlaylistLastUpdateTime");
        var S = 1e3 * 60 * 60 * 24;
        try {
          var O = h.toLowerCase().trim().split(/[\s.-]+/);
          if (O.length > 0) {
            var P = O[O.length - 1].toLowerCase();
            if (P === "yesterday") {
              var F = Date.now() - S, U = new Date(F);
              if (U.toString() !== "Invalid Date") return z(U);
            }
          }
          if (O.length >= 2 && O[0] === "updated" && O[2].slice(0, 3) === "day") {
            var q = Date.now() - S * O[1], H = new Date(q);
            if (H.toString() !== "Invalid Date") return z(H);
          }
          for (var X = 0; X < O.length; X++) {
            var ue = O.slice(X), ce = ue.join(" "), pe = ue.reverse().join(" "), de = new Date(ce), be = new Date(pe);
            if (de.toString() !== "Invalid Date") return z(de);
            if (be.toString() !== "Invalid Date") return z(be);
          }
          return "";
        } catch {
          return "";
        }
      }
      function z(h) {
        return h = new Date(h), Q("fn: _toInternalDateString"), h.getFullYear() + "-" + (h.getMonth() + 1) + "-" + // january gives 0
        h.getDate();
      }
      function ie(h) {
        var S = h.split(/\s+/), O = S[S.length - 1], P = O.replace(/[^:.\d]/g, "");
        if (!P) return {
          toString: function() {
            return S[0];
          },
          seconds: 0,
          timestamp: 0
        };
        for (; (F = P[P.length - 1]) !== null && F !== void 0 && F.match(/\D/); ) {
          var F;
          P = P.slice(0, -1);
        }
        P = P.replace(/\./g, ":");
        for (var U = P.split(/[:.]/), q = 0, H = 0, X = U.length - 1; X >= 0; X--)
          if (!(U[X].length <= 0)) {
            var ue = U[X].replace(/\D/g, "");
            if (q += parseInt(ue) * (H > 0 ? Math.pow(60, H) : 1), H++, H > 2) break;
          }
        return {
          toString: function() {
            return q + " seconds (" + P + ")";
          },
          seconds: q,
          timestamp: P
        };
      }
      function Te(h) {
        if (h) {
          var S = h.split(/\s+/).filter(function(q) {
            return q.match(/\d/);
          })[0].toLowerCase(), O = S.match(/\d+(\.\d+)?/);
          if (O && O[0]) {
            var P = Number(O[0]), F = 1e3, U = F * F;
            return S.indexOf("m") >= 0 ? U * P : S.indexOf("k") >= 0 ? F * P : P;
          }
        }
      }
      function V(h) {
        if (!h) return [];
        var S = h.split(/\s+/).filter(function(P) {
          return P.match(/\d/);
        }).map(function(P) {
          return P.toLowerCase();
        }), O = [];
        return S.forEach(function(P) {
          var F = P.match(/[-]?\d+(\.\d+)?/);
          if (F && F[0]) {
            var U = Number(F[0]), q = 1e3, H = q * q;
            P.indexOf("m") >= 0 && (U = H * U), P.indexOf("k") >= 0 && (U = q * U), O.push(U);
          }
        }), O;
      }
      function ae(h) {
        if (h) {
          var S;
          if (typeof h == "string")
            S = h;
          else
            return h.length ? (S = h[0], ae(S)) : void 0;
          return S = S.split("?")[0], S = S.split("/default.jpg").join("/hqdefault.jpg"), S = S.split("/default.jpeg").join("/hqdefault.jpeg"), S.indexOf("//") === 0 ? "https://" + S.slice(2) : S.split("http://").join("https://");
        }
      }
      function m(h) {
        var S = "", O = 36e5, P = 1e3 * 60, F = 1e3, U = Math.floor(h / O), q = Math.floor(h / P) % 60, H = Math.floor(h / F) % 60;
        return U && (S += U + ":"), U && String(q).length < 2 && (S += "0"), S += q + ":", String(H).length < 2 && (S += "0"), S += H, S;
      }
      function c(h) {
        var S = d.query(h, "$..videoPrimaryInfoRenderer.title..text").join("") || d.query(h, "$..videoPrimaryInfoRenderer.title..simpleText").join("") || d.query(h, "$..videoPrimaryRenderer.title..text").join("") || d.query(h, "$..videoPrimaryRenderer.title..simpleText").join("") || d.value(h, "$..title..text") || d.value(h, "$..title..simpleText");
        return S.replace(/[\u0000-\u001F\u007F-\u009F\u200b]/g, "");
      }
      r.main === n && C("王菲 Faye Wong");
      function C(h) {
        console.log("test: doing list search");
        var S = {
          query: h,
          pageEnd: 1
        };
        E(S, function(O, P) {
          if (O) throw O;
          var F = P.videos, U = P.playlists, q = P.channels, H = q[0];
          console.log("videos: " + F.length), console.log("playlists: " + U.length), console.log("channels: " + q.length), console.log("topChannel.name: " + H.name), console.log("topChannel.baseUrl: " + H.baseUrl), console.log("topChannel.id: " + H.id), console.log("topChannel.about: " + H.about), console.log("topChannel.verified: " + H.verified), console.log("topChannel.videoCount: " + H.videoCount), console.log("topChannel.subCount: " + H.subCount), console.log("topChannel.subCountLabel: " + H.subCountLabel);
        });
      }
    }, { "./util.js": 2, "async.parallellimit": void 0, cheerio: void 0, dasu: void 0, fs: void 0, "human-time": void 0, "jsonpath-plus": void 0, path: void 0, querystring: void 0, url: void 0 }], 2: [function(r, n, i) {
      var a = r("cheerio"), o = {};
      n.exports = o, o._getScripts = s, o._findLine = l, o._between = g;
      function s(u) {
        for (var f = a.load(u), p = f("script"), y = "", w = 0; w < p.length; w++) {
          var d = p[w], T = d && d.children[0], A = T && T.data;
          A && (y += A + `
`);
        }
        return y;
      }
      function l(u, f) {
        var p = l.cache || {};
        l.cache = p, p[f] = p[f] || {};
        var y = p[f].lines || f.split(`
`);
        p[f].lines = y, clearTimeout(p[f].timeout), p[f].timeout = setTimeout(function() {
          delete p[f];
        }, 100);
        for (var w = 0; w < y.length; w++) {
          var d = y[w];
          if (u.test(d)) return d;
        }
        return "";
      }
      function g(u, f, p) {
        var y = u.indexOf(f), w = u.lastIndexOf(p);
        return y < 0 || w < 0 ? "" : u.slice(y, w + 1);
      }
    }, { cheerio: void 0 }] }, {}, [1])(1);
  });
})(Jc);
var e_ = Jc.exports;
const t_ = /* @__PURE__ */ Pf(e_);
dt.autoUpdater.allowPrerelease = !0;
const r_ = Pt.requestSingleInstanceLock();
r_ ? Pt.on("second-instance", () => {
  oe && (oe.isMinimized() && oe.restore(), oe.focus());
}) : Pt.quit();
const Qc = wt.dirname(If(import.meta.url));
process.env.APP_ROOT = wt.join(Qc, "..");
const Ja = process.env.VITE_DEV_SERVER_URL, T_ = wt.join(process.env.APP_ROOT, "dist-electron"), Zc = wt.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Ja ? wt.join(process.env.APP_ROOT, "public") : Zc;
let oe;
function ef() {
  oe = new kl({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hidden",
    // Custom title bar for premium look
    titleBarOverlay: {
      color: "#00000000",
      symbolColor: "#ffffff",
      height: 30
    },
    webPreferences: {
      preload: wt.join(Qc, "preload.mjs"),
      webSecurity: !1,
      // simplified for local file access in dev
      backgroundThrottling: !1
    }
  }), oe.webContents.on("did-finish-load", () => {
    oe == null || oe.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Ja ? oe.loadURL(Ja) : oe.loadFile(wt.join(Zc, "index.html"));
}
Pt.on("window-all-closed", () => {
  process.platform !== "darwin" && (Pt.quit(), oe = null);
});
Pt.on("activate", () => {
  kl.getAllWindows().length === 0 && ef();
});
dt.autoUpdater.on("checking-for-update", () => {
  oe == null || oe.webContents.send("update-status", { status: "checking" });
});
dt.autoUpdater.on("update-available", (e) => {
  oe == null || oe.webContents.send("update-status", { status: "available", info: e });
});
dt.autoUpdater.on("update-not-available", (e) => {
  oe == null || oe.webContents.send("update-status", { status: "not-available", info: e });
});
dt.autoUpdater.on("error", (e) => {
  oe == null || oe.webContents.send("update-status", { status: "error", error: e.message });
});
dt.autoUpdater.on("download-progress", (e) => {
  oe == null || oe.webContents.send("update-status", { status: "downloading", progress: e });
});
dt.autoUpdater.on("update-downloaded", (e) => {
  oe == null || oe.webContents.send("update-status", { status: "downloaded", info: e });
});
Pt.whenReady().then(() => {
  ef(), Wt.handle("dialog:openDirectory", async () => {
    const { canceled: e, filePaths: t } = await $f.showOpenDialog(oe, {
      properties: ["openDirectory"]
    });
    return e ? null : t[0];
  }), Wt.handle("files:listMusic", async (e, t) => {
    if (!t) return [];
    try {
      const r = await jo.readdir(t), n = [".mp3", ".wav", ".wma", ".m4a", ".flac", ".ogg", ".mp4", ".mov", ".wmv", ".avi"];
      return r.filter((i) => n.includes(wt.extname(i).toLowerCase())).map((i) => wt.join(t, i));
    } catch (r) {
      return console.error("Error reading directory:", r), [];
    }
  }), Wt.handle("files:readBuffer", async (e, t) => {
    try {
      return await jo.readFile(t);
    } catch (r) {
      return console.error("Error reading file:", r), null;
    }
  }), Wt.handle("search:youtube", async (e, t) => {
    try {
      return (await t_(t)).videos.slice(0, 20).map((n) => ({
        id: n.videoId,
        title: n.title,
        artist: n.author.name,
        duration: n.seconds,
        thumbnail: n.thumbnail,
        url: n.url
      }));
    } catch (r) {
      return console.error(r), [];
    }
  }), Wt.handle("update:check", () => {
    dt.autoUpdater.checkForUpdatesAndNotify();
  }), Wt.handle("update:install", () => {
    dt.autoUpdater.quitAndInstall(!0, !0);
  }), Wt.handle("app:version", () => Pt.getVersion());
});
export {
  T_ as MAIN_DIST,
  Zc as RENDERER_DIST,
  Ja as VITE_DEV_SERVER_URL
};
