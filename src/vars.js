// if ENV === commonjs we want root to be global
	typeof global == 'undefined' ? root : ( root = global );

	var __name__  = '__name__', __type__ = '__type__', __xid__ = '__xid__',
// it's a best guess as to whether the environment we're in is a browser, commonjs platform (like nodejs) or something else completely
		ENV       = typeof module != 'undefined' && 'exports' in module && typeof require == 'function' ? 'commonjs' : typeof navigator != 'undefined' ? 'browser' : 'other',
		OP        = Object.prototype, UNDEF,
// this will be used by the bless method to check if a context root is a commonjs module or not.
// this way we know whether to assign the namespace been blessed to module.exports or not.
		Module    = ENV != 'commonjs' ? null : require( 'module' ),
		force     = [false, NaN, null, true, UNDEF].reduce( function( res, val ) { res[String( val )] = val; return res; }, obj() ),
		htmcol    = 'htmlcollection', htmdoc = 'htmldocument', id_count  = 999, id_prefix = 'anon__',
// this is a Map of all the different combinations of permissions for assigning property descriptors using Object.defineProperty
		modes     = function() {
			var mode_combos = { ce : 'ec', cw : 'wc', ew : 'we', cew : 'cwe ecw ewc wce wec'.split( ' ' ) },
				prop_keys   = 'configurable enumerable writable'.split( ' ' ),
				prop_vals   = {
					c   : [true,  false, false], ce : [true,  true,  false],
					cew : [true,  true,  true],  cw : [true,  false, true],
					e   : [false, true,  false], ew : [false, true,  true],
					r   : [false, false, false], w  : [false, false, true]
				},
				modes       = Object.keys( prop_vals ).reduce( function( res, key ) {
					function assign( prop_val ) { res[prop_val] = res[key]; }

					var combo = mode_combos[key];

					res[key] = prop_keys.reduce( function( val, prop_key, i ) {
						val[prop_key] = prop_vals[key][i];
						return val;
					}, obj() );

					!combo || ( Array.isArray( combo ) ? combo.forEach( assign ) : assign( combo ) );

					return res;
				}, obj() );
			delete modes[UNDEF];
			return modes;
		}(),
		re_global = /global|window/i,            re_lib    = new RegExp( '^\\u005E?' + Name ),
		re_name   = /[\s\(]*function([^\(]+).*/, re_vendor = /^[Ww]ebkit|[Mm]oz|O|[Mm]s|[Kk]html(.*)$/,
		slice     = Array.prototype.slice,       types     = { '[object Object]' : 'object' },
		xcache    = {
			'Array'  : [], 'Boolean' : [], 'Date'   : [], 'Function' : [],
			'Number' : [], 'Object'  : [], 'RegExp' : [], 'String'   : []
		};
