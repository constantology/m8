	var ENV       = typeof module != 'undefined' && 'exports' in module && typeof require == 'function' ? 'commonjs' : typeof navigator != 'undefined' ? 'browser' : 'other',
		OP        = Object.prototype, Module = ENV != 'commonjs' ? null : require( 'module' ), U,
		force     = [false, NaN, null, true, U].reduce( function( o, v ) { o[String( v )] = v; return o; }, obj() ),
		id_count  = 999, id_prefix = 'anon__',
		modes     = function() {  // this is a Map of all the different combinations of permissions for assigning
			var f = 'configurable enumerable writable'.split( ' ' ), // property descriptors using Object.defineProperty
				m = { ce : 'ec', cw : 'wc', ew : 'we', cew : 'cwe ecw ewc wce wec'.split( ' ' ) },
				p = {
					c   : [true,  false, false], ce : [true,  true,  false],
					cew : [true,  true,  true],  cw : [true,  false, true],
					e   : [false, true,  false], ew : [false, true,  true],
					r   : [false, false, false], w  : [false, false, true]
				},
				v = Object.keys( p ).reduce( function( o, k ) {
					o[k] = f.reduce( function( v, f, i ) { v[f] = p[k][i]; return v; }, obj() );
					!( k in m ) || typeof m[k] == 'string' ? ( o[m[k]] = o[k] ) : m[k].forEach( function( f ) { o[f] = o[k]; } );
					return o;
				}, obj() );
			delete v.undefined;
			return v;
		}(),
		re_col    = /htmlcollection|nodelist/,   re_el   = /^html\w+?element$/,
		re_global = /global|window/i,            re_m8   = /^\u005E?m8/,
		re_name   = /[\s\(]*function([^\(]+).*/, re_type = /\[[^\s]+\s([^\]]+)\]/,
		re_vendor = /^[Ww]ebkit|[Mm]oz|O|[Mm]s|[Kk]html(.*)$/,
		slice     = Array.prototype.slice,       types   = { '[object Object]' : 'object' },
		xcache    = {
			'Array'  : [], 'Boolean' : [], 'Date'   : [], 'Function' : [],
			'Number' : [], 'Object'  : [], 'RegExp' : [], 'String'   : []
		},   xid  = '__xid__';
