!function(root, Name) {
    "use strict";
    var ENV = typeof module != "undefined" && "exports" in module && typeof require == "function" ? "commonjs" : typeof navigator != "undefined" ? "browser" : "other", OP = Object.prototype, Module = ENV != "commonjs" ? null : require("module"), U, conflict, desc_lib, force = [ false, NaN, null, true, U ].reduce(function(o, v) {
        o[String(v)] = v;
        return o;
    }, obj()), htmcol = "htmlcollection", htmdoc = "htmldocument", id_count = 999, id_prefix = "anon__", modes = function() {
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
    }(), re_col = /htmlcollection|nodelist/, re_el = /^html\w+?element$/, re_global = /global|window/i, re_lib = new RegExp("^\\u005E?" + Name), re_name = /[\s\(]*function([^\(]+).*/, re_type = /\[[^\s]+\s([^\]]+)\]/, re_vendor = /^[Ww]ebkit|[Mm]oz|O|[Mm]s|[Kk]html(.*)$/, slice = Array.prototype.slice, types = {
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
    if (ENV != "commonjs") {
        Name || (Name = "m8");
        conflict = root[Name];
        desc_lib = describe({
            value : __lib__
        }, "ew");
        if (conflict) {
            Object.getOwnPropertyNames(__lib__).forEach(function(k) {
                this[k] = __lib__[k];
            }, conflict);
            def(conflict, Name, desc_lib);
            __lib__ = conflict;
        } else def(root, Name, desc_lib);
    } else module.exports = __lib__;
    function __lib__(o) {
        return o;
    }
    function copy(d, s, n) {
        n = n === true;
        s || (s = d, d = obj());
        for (var k in s) !has(s, k) || n && has(d, k) || (d[k] = s[k]);
        return d;
    }
    function def(item, name, desc, overwrite, debug) {
        var exists = got(item, name);
        !(desc.get || desc.set) || delete desc.writable;
        if (overwrite === true || !exists) Object.defineProperty(item, name, desc); else if (debug === true && exists) new Error(Name + ".def cannot overwrite existing property: " + name + ", in item type: " + type(item) + ".");
        return __lib__;
    }
    function defs(item, o, m, overwrite, debug) {
        m || (m = "cw");
        for (var k in o) !has(o, k) || def(item, k, describe(o[k], m), overwrite, debug);
        return __lib__;
    }
    function describe(v, m) {
        return copy(nativeType(v) == "object" ? v : {
            value : v
        }, nativeType(m) == "object" ? m : modes[m.toLowerCase()] || modes.cew);
    }
    function empty(o) {
        return !exists(o) || !len(o) && iter(o) || false;
    }
    function exists(o) {
        return !(o === null || o === U || typeof o == "number" && isNaN(o));
    }
    function fname(fn) {
        return fn.name || fn.displayName || (String(fn).match(re_name) || [ "", "" ])[1].trim();
    }
    function got(o, k) {
        return k in Object(o);
    }
    function has(o, k) {
        return OP.hasOwnProperty.call(o, k);
    }
    function iter(o) {
        return got(o, "length") || nativeType(o) == "object";
    }
    function len(o) {
        return ("length" in (o = Object(o)) ? o : Object.keys(o)).length;
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
        return t == htmdoc ? htmdoc : t == htmcol || t == "nodelist" ? htmcol : !t.indexOf("htm") && t.lastIndexOf("element") + 7 === t.length ? "htmlelement" : false;
    }
    function nativeType(o, t) {
        if ((t = tostr(o)) in types) return types[t];
        return types[t] = t.split(" ")[1].split("]")[0].toLowerCase().replace(re_vendor, "$1");
    }
    function type(o) {
        return o === null || o === U ? false : got(o, "__type__") ? o.__type__ : Object.getPrototypeOf(o) === null ? "nullobject" : U;
    }
    function _id(prefix) {
        return (prefix || id_prefix) + ++id_count;
    }
    function blessCTX(ctx) {
        return ENV == "commonjs" ? ctx ? ctx instanceof Module ? ctx.exports : ctx : module.exports : ctx || root;
    }
    typeof global == "undefined" || (root = global);
    defs(__lib__, {
        ENV : ENV,
        global : {
            value : root
        },
        modes : {
            value : modes
        },
        __name__ : Name,
        __type__ : "library",
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
            if (re_lib.test(ns[0])) {
                ctx = __lib__;
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
        iter : iter,
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
        slice.call(arguments).forEach(x_update);
        return __lib__;
    }
    def(x, "cache", describe(function(type, extender) {
        typeof type == "string" || (type = type.__name__ || fname(type));
        xcache[type] || (xcache[type] = []);
        xcache[type].push(extender);
        return __lib__;
    }, "w"));
    function x_extend(extender) {
        extender(this, __lib__);
    }
    function x_update(Type) {
        got(Type, xid) || def(Type, xid, describe(0, "w"));
        var o = xcache[Type.__name__ || fname(Type)];
        if (!o) return;
        o.slice(Type[xid]).forEach(x_extend, Type);
        Type[xid] = o.length;
    }
    x.cache("Array", function(Type) {
        def(Type, "coerce", describe(function(a, i, j) {
            if (!got(a, "length")) return [ a ];
            i = type(i) == "number" ? i > 0 ? i : 0 : 0;
            j = type(j) == "number" ? j > i ? j : j <= 0 ? a.length + j : i + j : a.length;
            return slice.call(a, i, j);
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
                    if (!this.__xname__) {
                        var fn = valof(this), m = fn !== this ? fn.__name__ !== "anonymous" ? fn.__name__ : null : null, n = m || fname(this);
                        def(this, "__xname__", describe(m || n || "anonymous", "w"));
                    }
                    return this.__xname__;
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
                return t || (nt == "object" && ctor && ctor.__type__ != "function" ? String(ctor.__name__).toLowerCase() || ctor.__type__ || nt : nt == "number" && isNaN(o) ? "nan" : nt);
            }
        }, modes.r));
        defs(Type, {
            reduce : function(o, fn, v) {
                return Type.keys(Type(o)).reduce(function(r, k, i) {
                    r = fn.call(o, r, o[k], k, o, i);
                    return r;
                }, v);
            },
            value : function(o, k) {
                if (isNaN(k)) {
                    if (got(o, k)) return o[k];
                    if (!!~k.indexOf(".")) {
                        var v;
                        k = k.split(".");
                        while (v = k.shift()) if ((o = Type.value(o, v)) === U) return o;
                        return o;
                    }
                }
                return empty(o) ? U : !empty(o[k]) ? o[k] : typeof o.get == "function" ? o.get(k) : typeof o.getAttribute == "function" ? o.getAttribute(k) : U;
            },
            values : function(o) {
                return Type.keys(Object(o)).map(function(k) {
                    return o[k];
                });
            }
        }, "w");
    });
    x(Object, Array, Boolean, Function);
}(this, "m8");