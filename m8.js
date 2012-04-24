!function(root) {
    "use strict";
    var ENV = typeof module != "undefined" && "exports" in module && typeof require == "function" ? "commonjs" : typeof navigator != "undefined" ? "browser" : "other", OP = Object.prototype, Module = ENV != "commonjs" ? null : require("module"), U, force = [ false, NaN, null, true, U ].reduce(function(o, v) {
        o[String(v)] = v;
        return o;
    }, obj()), id_count = 999, id_prefix = "anon__", modes = function() {
        var f = "configurable enumerable writable".split(" "), m = {
            ce : "ec",
            cw : "wc",
            ew : "we",
            cew : "cwe ecw ewc wce wec".split(" ")
        }, p = {
            c : [ true, false, false ],
            ce : [ true, true, false ],
            cew : [ true, true, true ],
            cw : [ true, false, true ],
            e : [ false, true, false ],
            ew : [ false, true, true ],
            r : [ false, false, false ],
            w : [ false, false, true ]
        }, v = Object.keys(p).reduce(function(o, k) {
            o[k] = f.reduce(function(v, f, i) {
                v[f] = p[k][i];
                return v;
            }, obj());
            !(k in m) || typeof m[k] == "string" ? o[m[k]] = o[k] : m[k].forEach(function(f) {
                o[f] = o[k];
            });
            return o;
        }, obj());
        delete v.undefined;
        return v;
    }(), re_col = /htmlcollection|nodelist/, re_el = /^html\w+?element$/, re_global = /global|window/i, re_m8 = /^\u005E?m8/, re_name = /[\s\(]*function([^\(]+).*/, re_type = /\[[^\s]+\s([^\]]+)\]/, re_vendor = /^[Ww]ebkit|[Mm]oz|O|[Mm]s|[Kk]html(.*)$/, slice = Array.prototype.slice, types = {
        "[object Object]" : "object"
    }, xcache = {
        Array : [],
        Boolean : [],
        Date : [],
        Function : [],
        Number : [],
        Object : [],
        RegExp : [],
        String : []
    }, xid = "__xid__";
    function copy(d, s, n) {
        n = n === true;
        s || (s = d, d = obj());
        for (var k in s) !has(s, k) || n && has(d, k) || (d[k] = s[k]);
        return d;
    }
    function def(item, name, desc, overwrite, debug) {
        var exists = got(item, name);
        !(desc.get || desc.set) || delete desc.writable;
        if (overwrite === true || !exists) Object.defineProperty(item, name, desc); else if (debug === true && exists) new Error("m8.def cannot overwrite existing property: " + name + ", in item type: " + type(item) + ".");
        return m8;
    }
    function defs(item, o, m, overwrite, debug) {
        m || (m = "cw");
        for (var k in o) !has(o, k) || def(item, k, describe(o[k], m), overwrite, debug);
        return m8;
    }
    function describe(v, m) {
        return copy(nativeType(v) == "object" ? v : {
            value : v
        }, nativeType(m) == "object" ? m : modes[m.toLowerCase()] || modes.cew);
    }
    function empty(o) {
        return !exists(o) || (iter(o) ? !len(o) : false);
    }
    function exists(o) {
        return (o = type(o)) !== false && o != "nan";
    }
    function got(o, k) {
        return k in Object(o);
    }
    function has(o, k) {
        return OP.hasOwnProperty.call(o, k);
    }
    function len(o) {
        return Object.keys(Object(o)).length;
    }
    function m8(o) {
        return o;
    }
    function obj(o, n) {
        return (n = Object.create(null)) && arguments.length >= 1 ? copy(n, o) : n;
    }
    function tostr(o) {
        return OP.toString.call(o);
    }
    function valof(o) {
        return OP.valueOf.call(o);
    }
    function domType(t) {
        return re_col.test(t) ? "htmlcollection" : re_el.test(t) ? "htmlelement" : false;
    }
    function nativeType(o, t) {
        if ((t = tostr(o)) in types) return types[t];
        return types[t] = t.toLowerCase().match(re_type)[1].replace(re_vendor, "$1");
    }
    function type(o) {
        return o === null || o === U ? false : got(o, "__type__") ? o.__type__ : Object.getPrototypeOf(o) === null ? null + "object" : U;
    }
    function _id(prefix) {
        return (prefix || id_prefix) + ++id_count;
    }
    function blessCTX(ctx) {
        return ENV == "commonjs" ? ctx ? ctx instanceof Module ? ctx.exports : ctx : module.exports : ctx || root;
    }
    function iter(o) {
        return "length" in Object(o) || nativeType(o) == "object";
    }
    typeof global == "undefined" || (root = global);
    defs(m8, {
        ENV : ENV,
        global : {
            value : root
        },
        modes : {
            value : modes
        },
        __type__ : "m8",
        bless : function(ns, ctx) {
            switch (nativeType(ns)) {
              case "array":
                break;
              case "string":
                ns = ns.split(".");
                break;
              default:
                return blessCTX(ctx);
            }
            if (re_m8.test(ns[0])) {
                ctx = m8;
                ns.shift();
            }
            if (!ns.length) return blessCTX(ctx);
            ns[0].indexOf("^") || (ctx || ns[0] == "^" ? ns.shift() : ns[0] = ns[0].substring(1));
            ctx = blessCTX(ctx);
            var o;
            while (o = ns.shift()) ctx = ctx[o] || (ctx[o] = obj());
            return ctx;
        },
        coerce : function(o, n, s) {
            return !isNaN(n = Number(o)) ? n : (s = String(o)) in force ? force[s] : o;
        },
        copy : copy,
        def : def,
        defs : defs,
        describe : describe,
        empty : empty,
        exists : exists,
        got : got,
        has : has,
        id : function(o, prefix) {
            return o ? got(o, "id") ? o.id : o.id = _id(prefix) : _id(prefix);
        },
        len : len,
        nativeType : nativeType,
        noop : function() {},
        obj : obj,
        range : function(i, j) {
            var a = [ i ];
            while (++i <= j) a.push(i);
            return a;
        },
        tostr : tostr,
        type : type,
        valof : valof,
        x : x
    }, "w");
    function x() {
        slice.call(arguments).forEach(_x);
        return m8;
    }
    def(x, "cache", describe(function(type, extender) {
        xcache[type] || (xcache[type] = []);
        xcache[type].push(extender);
        return m8;
    }, "w"));
    function _x(Type) {
        got(Type, xid) || def(Type, xid, describe(0, "w"));
        var o = xcache[Type.__name__ || Type.name];
        if (!o) return;
        o.slice(Type[xid]).forEach(x_, Type);
        Type[xid] = o.length;
    }
    function x_(extend) {
        extend(this, m8);
    }
    x.cache("Array", function(Type) {
        def(Type, "coerce", describe(function(a, i, j) {
            i = type(i) == "number" ? i > 0 ? i : 0 : 0;
            j = type(j) == "number" ? j > i ? j : j <= 0 ? a.length + j : i + j : a.length;
            return got(a, "length") ? slice.call(a, i, j) : [ a ];
        }, "w"));
        def(Type.prototype, "find", describe(function(fn, ctx) {
            var i = -1, l = this.length >>> 0;
            ctx || (ctx = this);
            while (++i < l) if (!!fn.call(ctx, this[i], i, this)) return this[i];
            return null;
        }, "w"));
    });
    x.cache("Boolean", function(Type) {
        def(Type, "coerce", describe(function(o) {
            switch (type(o)) {
              case "boolean":
                return o;
              case "nan":
              case false:
                return false;
              case "number":
              case "string":
                return !(o in force ? !force[o] : Number(o) === 0);
            }
            return true;
        }, "w"));
    });
    x.cache("Function", function(Type) {
        defs(Type.prototype, {
            __name__ : {
                get : function() {
                    if (!this.__m8name__) {
                        var fn = valof(this), m = fn !== this ? fn.__name__ !== "anonymous" ? fn.__name__ : null : null, n = m || this.name || this.displayName || (String(this).match(re_name) || [ "", "" ])[1].trim();
                        def(this, "__m8name__", describe(m || n || "anonymous", "w"));
                    }
                    return this.__m8name__;
                }
            },
            mimic : function(fn, name) {
                var v = valof(fn);
                defs(this, {
                    displayName : name || fn.__name__,
                    toString : function() {
                        return v.toString();
                    },
                    valueOf : function() {
                        return v;
                    }
                }, "c", true);
                return this;
            }
        }, "w");
    });
    x.cache("Object", function(Type) {
        def(Type.prototype, "__type__", copy({
            get : function() {
                var o = this, ctor = o.constructor, nt = nativeType(o), t = domType(nt) || (re_global.test(nt) ? "global" : false);
                return t || (nt == "object" && ctor.__type__ != "function" ? ctor.__name__.toLowerCase() || ctor.__type__ || nt : nt == "number" && isNaN(o) ? "nan" : nt);
            }
        }, modes.r));
        defs(Type, {
            reduce : function(o, fn, v) {
                return Type.keys(o).reduce(function(r, k, i) {
                    r = fn.call(o, r, o[k], k, o, i);
                    return r;
                }, v);
            },
            value : function(o, k) {
                if (isNaN(k) && !!~k.indexOf(".")) {
                    var v;
                    k = k.split(".");
                    while (v = k.shift()) if ((o = Type.value(o, v)) === U) return o;
                    return o;
                }
                return empty(o) ? U : !empty(o[k]) ? o[k] : nativeType(o.get) == "function" ? o.get(k) : nativeType(o.getAttribute) == "function" ? o.getAttribute(k) : U;
            },
            values : function(o) {
                return Type.keys(o).map(function(k) {
                    return o[k];
                });
            }
        }, "w");
    });
    x(Object, Array, Boolean, Function);
    ENV != "commonjs" ? def(root, "m8", describe({
        value : m8
    }, "r")) : module.exports = m8;
}(this);