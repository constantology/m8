!function(root, Name) {
    "use strict";
    typeof global == "undefined" ? root : root = global;
    var __name__ = "__name__", __type__ = "__type__", __xid__ = "__xid__", ENV = typeof module != "undefined" && "exports" in module && typeof require == "function" ? "commonjs" : typeof navigator != "undefined" ? "browser" : "other", OP = Object.prototype, UNDEF, Module = ENV != "commonjs" ? null : require("module"), force = [ false, NaN, null, true, UNDEF ].reduce(function(res, val) {
        res[String(val)] = val;
        return res;
    }, obj()), htmcol = "htmlcollection", htmdoc = "htmldocument", id_count = 999, id_prefix = "anon__", modes = function() {
        var mode_combos = {
            ce : "ec",
            cw : "wc",
            ew : "we",
            cew : "cwe ecw ewc wce wec".split(" ")
        }, prop_keys = "configurable enumerable writable".split(" "), prop_vals = {
            c : [ true, false, false ],
            ce : [ true, true, false ],
            cew : [ true, true, true ],
            cw : [ true, false, true ],
            e : [ false, true, false ],
            ew : [ false, true, true ],
            r : [ false, false, false ],
            w : [ false, false, true ]
        }, modes = Object.keys(prop_vals).reduce(function(res, key) {
            function assign(prop_val) {
                res[prop_val] = res[key];
            }
            var combo = mode_combos[key];
            res[key] = prop_keys.reduce(function(val, prop_key, i) {
                val[prop_key] = prop_vals[key][i];
                return val;
            }, obj());
            !combo || (Array.isArray(combo) ? combo.forEach(assign) : assign(combo));
            return res;
        }, obj());
        delete modes[UNDEF];
        return modes;
    }(), re_global = /global|window/i, re_lib = new RegExp("^\\u005E?" + Name), re_name = /[\s\(]*function([^\(]+).*/, re_vendor = /^[Ww]ebkit|[Mm]oz|O|[Mm]s|[Kk]html(.*)$/, slice = Array.prototype.slice, types = {
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
    };
    function __lib__(val) {
        return val;
    }
    function bless(ns, ctx) {
        switch (nativeType(ns)) {
          case "array":
            break;
          case "string":
            ns = ns.split(".");
            break;
          default:
            return bless_ctx(ctx);
        }
        if (re_lib.test(ns[0])) {
            ctx = __lib__;
            ns.shift();
        }
        if (!ns.length) return bless_ctx(ctx);
        ns[0].indexOf("^") || (ctx || ns[0] == "^" ? ns.shift() : ns[0] = ns[0].substring(1));
        ctx = bless_ctx(ctx);
        var o;
        while (o = ns.shift()) ctx = ctx[o] || (ctx[o] = obj());
        return ctx;
    }
    function bless_ctx(ctx) {
        return ENV == "commonjs" ? ctx ? ctx instanceof Module ? ctx.exports : ctx : module.exports : ctx || root;
    }
    function coerce(item) {
        var num = Number(item), str;
        return !isNaN(num) ? num : (str = String(item)) in force ? force[str] : item;
    }
    function copy(target, source, no_overwrite) {
        no_overwrite = no_overwrite === true;
        source || (source = target, target = obj());
        for (var key in source) !has(source, key) || no_overwrite && has(target, key) || (target[key] = source[key]);
        return target;
    }
    function def(item, name, desc) {
        var args = slice.call(arguments, 3), defined = got(item, name), debug, mode, ntype, overwrite;
        switch (nativeType(args[0])) {
          case "string":
            mode = modes[args.shift()];
            break;
          case "object":
            mode = args.shift();
            break;
          default:
            ntype = nativeType(desc);
            mode = ntype != "object" && defined ? Object.getOwnPropertyDescriptor(item, name) : null;
            !mode || (mode = ntype == "function" ? modes.cw : modes.cew);
        }
        overwrite = args.shift() === true;
        debug = args.shift() === true;
        if (defined && !overwrite) {
            if (debug) new Error(Name + ".def cannot overwrite existing property: " + name + ", in item type: " + type(item) + ".");
        } else {
            if (ntype != "object" && mode) desc = describe(desc, mode);
            if (desc.get || desc.set) delete desc.writable;
            Object.defineProperty(item, name, desc);
        }
        return __lib__;
    }
    function defs(item, props, mode, overwrite, debug) {
        mode || (mode = "cw");
        for (var key in props) !has(props, key) || def(item, key, props[key], mode, overwrite, debug);
        return __lib__;
    }
    function describe(desc, mode) {
        return copy(nativeType(desc) == "object" ? desc : {
            value : desc
        }, nativeType(mode) == "object" ? mode : modes[String(mode).toLowerCase()] || modes.cew, true);
    }
    function empty(item) {
        return !exists(item) || !len(item) && iter(item) || false;
    }
    function exists(item) {
        return !(item === null || item === UNDEF || typeof item == "number" && isNaN(item));
    }
    function expose(lib, name, mod) {
        if (typeof name != "string" && lib[__name__]) {
            mod = name;
            name = lib[__name__];
        }
        if (ENV == "commonjs" && is_mod(mod)) mod.exports = lib; else {
            mod || (mod = root);
            var conflict = mod[name], desc = describe({
                value : lib
            }, "ew");
            conflict && iter(conflict) ? def(lib = conflict, "__", desc) : def(mod, name, desc);
        }
        if (!lib[__name__] && lib[__type__] !== "library") {
            mod = obj();
            mod[__name__] = name;
            mod[__type__] = "library";
            defs(lib, mod, "w");
        }
        return lib;
    }
    function fname(fn) {
        return fn.name || fn.displayName || (String(fn).match(re_name) || [ "", "" ])[1].trim();
    }
    function got(obj, key) {
        return arguments > 2 ? hasSome(got, obj, Array.coerce(arguments, 1)) : key in Object(obj);
    }
    function has(obj, key) {
        return arguments > 2 ? hasSome(has, obj, Array.coerce(arguments, 1)) : OP.hasOwnProperty.call(obj, key);
    }
    function hasSome(test, obj, keys) {
        return keys.some(function(key) {
            return test(obj, key);
        });
    }
    function id(item, prefix) {
        return item ? got(item, "id") ? item.id : item.id = id_create(prefix) : id_create(prefix);
    }
    function id_create(prefix) {
        return (prefix || id_prefix) + ++id_count;
    }
    function is_mod(mod) {
        if (Module === null) return false;
        try {
            return mod instanceof Module;
        } catch (e) {
            return false;
        }
    }
    function iter(item) {
        return got(item, "length") || nativeType(item) == "object";
    }
    function len(item) {
        return ("length" in (item = Object(item)) ? item : Object.keys(item)).length;
    }
    function merge(target, source) {
        var ntype;
        if (!source) {
            switch (ntype = nativeType(target)) {
              case "array":
              case "object":
                source = target;
                target = new (source.constructor || Object);
                break;
              default:
                return target;
            }
        } else ntype = nativeType(source);
        switch (ntype) {
          case "object":
            return Object.keys(source).reduce(merge_object, {
                source : source,
                target : target
            }).target;
          case "array":
            target.length = source.length;
            return source.reduce(merge_array, target);
          default:
            return source;
        }
    }
    function merge_array(target, source, i) {
        target[i] = merge(source);
        return target;
    }
    function merge_object(o, key) {
        o.target[key] = merge(o.source[key]);
        return o;
    }
    function obj(props) {
        var nobj = Object.create(null);
        return typeof props == "object" ? copy(nobj, props) : nobj;
    }
    function range(i, j) {
        var a = [ i ];
        while (++i <= j) a.push(i);
        return a;
    }
    function remove(item, keys) {
        keys = Array.isArray(keys) ? keys : slice.call(arguments, 1);
        var remove_ = Array.isArray(item) ? remove_array : remove_object;
        keys.forEach(remove_, item);
        return item;
    }
    function remove_array(val) {
        var i = this.indexOf(val);
        i = !!~i ? i : !isNaN(val) && val in this ? val : i;
        i < 0 || this.splice(i, 1);
    }
    function remove_object(key) {
        delete this[key];
    }
    function tostr(item) {
        return OP.toString.call(item);
    }
    function valof(item) {
        return OP.valueOf.call(item);
    }
    function domType(dtype) {
        return dtype == htmdoc ? htmdoc : dtype == htmcol || dtype == "nodelist" ? htmcol : !dtype.indexOf("htm") && dtype.lastIndexOf("element") + 7 === dtype.length ? "htmlelement" : false;
    }
    function nativeType(item) {
        var ntype = tostr(item);
        if (ntype in types) return types[ntype];
        return types[ntype] = ntype.split(" ")[1].split("]")[0].replace(re_vendor, "$1").toLowerCase();
    }
    function type(item) {
        return item === null || item === UNDEF ? false : got(item, __type__) ? item[__type__] : Object.getPrototypeOf(item) === null ? "nullobject" : UNDEF;
    }
    defs(__lib__ = expose(__lib__, Name, ENV == "commonjs" ? module : root), {
        ENV : ENV,
        global : {
            value : root
        },
        modes : {
            value : modes
        },
        bless : bless,
        coerce : coerce,
        copy : copy,
        def : def,
        defs : defs,
        describe : describe,
        empty : empty,
        exists : exists,
        expose : expose,
        got : got,
        has : has,
        id : id,
        iter : iter,
        len : len,
        merge : merge,
        nativeType : nativeType,
        noop : function() {},
        obj : obj,
        range : range,
        remove : remove,
        tostr : tostr,
        type : type,
        valof : valof,
        x : x
    }, "w");
    function x() {
        slice.call(arguments).forEach(x_update);
        return __lib__;
    }
    def(x, "cache", function(type, extender) {
        typeof type == "string" || (type = type[__name__] || fname(type));
        xcache[type] || (xcache[type] = []);
        xcache[type].push(extender);
        return __lib__;
    }, "w");
    function x_extend(extend_type) {
        extend_type(this, __lib__);
    }
    function x_update(Type) {
        got(Type, __xid__) || def(Type, __xid__, 0, "w");
        var extenders = xcache[Type[__name__] || fname(Type)];
        if (!extenders) return;
        extenders.slice(Type[__xid__]).forEach(x_extend, Type);
        Type[__xid__] = extenders.length;
    }
    x.cache("Array", function(Type) {
        def(Type, "coerce", function(a, i, j) {
            if (!got(a, "length")) return [ a ];
            i = type(i) == "number" ? i > 0 ? i : 0 : 0;
            j = type(j) == "number" ? j > i ? j : j <= 0 ? a.length + j : i + j : a.length;
            return slice.call(a, i, j);
        }, "w");
        def(Type.prototype, "find", function(fn, ctx) {
            var i = -1, l = this.length >>> 0;
            ctx || (ctx = this);
            while (++i < l) if (!!fn.call(ctx, this[i], i, this)) return this[i];
            return null;
        }, "w");
    });
    x.cache("Boolean", function(Type) {
        def(Type, "coerce", function(item) {
            switch (type(item)) {
              case "boolean":
                return item;
              case "nan":
              case false:
                return false;
              case "number":
              case "string":
                return !(item in force ? !force[item] : Number(item) === 0);
            }
            return true;
        }, "w");
    });
    x.cache("Function", function(Type) {
        function anon(name) {
            return !name || name in anon_list;
        }
        function toString() {
            return this.toString();
        }
        function valueOf() {
            return this;
        }
        var __xname__ = "__xname__", anon_list = {
            Anonymous : true,
            anonymous : true
        }, desc = {
            mimic : function(fn, name) {
                var fn_val = fn.valueOf();
                defs(this, {
                    displayName : name || fname(fn_val),
                    toString : toString.bind(fn_val),
                    valueOf : valueOf.bind(fn_val)
                }, "c", true);
                return this;
            }
        };
        desc[__name__] = {
            get : function() {
                if (!this[__xname__]) {
                    var fn = this.valueOf(), name_m = fn !== this ? !anon(fn[__name__]) ? fn[__name__] : null : null, name = name_m || fname(this);
                    !anon(name) || anon(this.displayName) || (name = this.displayName);
                    def(this, __xname__, name || "anonymous", "w");
                }
                return this[__xname__];
            }
        };
        defs(Type.prototype, desc, "w");
        def(Type, "anon_list", {
            value : anon_list
        }, "w");
    });
    x.cache("Object", function(Type) {
        def(Type.prototype, __type__, copy({
            get : function() {
                var _type_, item = this, ctor = item.constructor, ntype = nativeType(item), dtype = domType(ntype) || (re_global.test(ntype) ? "global" : false);
                if (dtype) return dtype;
                if (ntype == "number") return isNaN(item) ? "nan" : "number";
                if (ntype == "object" && typeof ctor == "function") {
                    if (ctor[__type__] != "function") {
                        _type_ = String(ctor[__name__]).toLowerCase();
                        return !_type_ || _type_ == "anonymous" ? ctor[__type__] || ntype : _type_;
                    }
                }
                return ntype;
            }
        }, modes.r));
        defs(Type, {
            key : function(item, val) {
                return Type.keys(Type(item)).find(function(key) {
                    return item[key] === val;
                });
            },
            reduce : function(item, fn, val) {
                return Type.keys(Type(item)).reduce(function(res, key, i) {
                    res = fn.call(item, res, item[key], key, item, i);
                    return res;
                }, val);
            },
            value : function(item, key) {
                if (isNaN(key)) {
                    if (got(item, key)) return item[key];
                    if (!!~key.indexOf(".")) {
                        var val;
                        key = key.split(".");
                        while (val = key.shift()) if ((item = Type.value(item, val)) === UNDEF) break;
                        return item;
                    }
                }
                return empty(item) ? UNDEF : exists(item[key]) ? item[key] : typeof item.get == "function" ? item.get(key) : typeof item.getAttribute == "function" ? item.getAttribute(key) : UNDEF;
            },
            values : function(item) {
                return Type.keys(Object(item)).map(function(key) {
                    return item[key];
                });
            }
        }, "w");
    });
    x(Object, Array, Boolean, Function);
}(this, "m8");