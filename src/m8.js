	function __lib__( o ) { return o; }

	function copy( d, s, n ) {
		n = n === true; s || ( s = d, d = obj() );
		for ( var k in s ) !has( s, k ) || ( n && has( d, k ) ) || ( d[k] = s[k] );
		return d;
	}

	function def( item, name, desc, overwrite, debug ) {
		var exists = got( item, name );
		!( desc.get || desc.set ) || delete desc.writable; // <- ARGH!!! see: https://plus.google.com/117400647045355298632/posts/YTX1wMry8M2
		if ( overwrite === true || !exists ) Object.defineProperty( item, name, desc );
		else if ( debug === true && exists )
			new Error( Name + '.def cannot overwrite existing property: ' + name + ', in item type: ' + type( item ) + '.' );
		return __lib__;
	}
	function defs( item, o, m, overwrite, debug ) {
		m || ( m = 'cw' );
		for ( var k in o ) !has( o, k ) || def( item, k, describe( o[k], m ), overwrite, debug );
		return __lib__;
	}
	function describe( v, m ) { return copy( ( nativeType( v ) == 'object' ? v : { value : v } ), ( nativeType( m ) == 'object' ? m : modes[m.toLowerCase()] || modes.cew ) ); }

	function empty( o ) { return !exists( o ) || ( !len( o ) && iter( o ) ) || false; }
//	function exists( o ) { return ( o = type( o ) ) !== false && o != 'nan'; }
	function exists( o ) { return !( o === null || o === U || ( typeof o == 'number' && isNaN( o ) ) ); }

	function fname( fn ) { return fn.name || fn.displayName || ( String( fn ).match( re_name ) || ['', ''] )[1].trim(); }

	function got( o, k ) { return k in Object( o ); }
	function has( o, k ) { return OP.hasOwnProperty.call( o, k ); }

	function iter( o ) { return got( o, 'length' ) || nativeType( o ) == 'object'; }
	function len( o ) { return ( 'length' in ( o = Object( o ) ) ? o : Object.keys( o ) ).length; }

	function obj( o, n ) { return ( n = Object.create( null ) ) && arguments.length >= 1 ? copy( n, o ) : n; }

	function tostr( o ) { return OP.toString.call( o ); }
	function valof( o ) { return OP.valueOf.call( o ); }

// type methods
	function domType( t ) {
//		return re_col.test( t ) ? 'htmlcollection' : re_el.test( t ) ? 'htmlelement' : false;
		return t == htmdoc ? htmdoc : ( t == htmcol || t == 'nodelist' ) ? htmcol : ( !t.indexOf( 'htm' ) && ( t.lastIndexOf( 'element' ) + 7 === t.length ) ) ? 'htmlelement' : false;
	}
	function nativeType( o, t ) {
		if ( ( t = tostr( o ) ) in types ) return types[t]; // check the cached types first
//		return ( types[t] = t.toLowerCase().match( re_type )[1].replace( re_vendor, '$1' ) );
		return ( types[t] = t.split( ' ' )[1].split( ']' )[0].toLowerCase().replace( re_vendor, '$1' ) );
	}
	function type( o ) { return o === null || o === U ? false : got( o, '__type__' ) ? o.__type__ : Object.getPrototypeOf( o ) === null ? 'nullobject' : U; }

// internals
	function _id( prefix ) { return ( prefix || id_prefix ) + ( ++id_count ); }
	function blessCTX( ctx ) {
		return ENV == 'commonjs'
			 ? ctx ? ctx instanceof Module ? ctx.exports : ctx : module.exports
			 : ctx || root;
	}

// if ENV === commonjs we want root to be global
	typeof global == 'undefined' || ( root = global );

	defs( __lib__, {
// properties
		ENV    : ENV, global : { value : root }, modes : { value : modes }, __name__ : Name, __type__ : 'library',
// methods
		bless  : function( ns, ctx ) {
			switch( nativeType( ns ) ) {
				case 'array'  :                       break;
				case 'string' : ns = ns.split( '.' ); break;
				default       : return blessCTX( ctx );
			}

			if ( re_lib.test( ns[0] ) ) { ctx = __lib__; ns.shift(); }

			if ( !ns.length ) return blessCTX( ctx );

			ns[0].indexOf( '^' ) || ( ctx || ns[0] == '^' ? ns.shift() : ns[0] = ns[0].substring( 1 ) );
			ctx = blessCTX( ctx );

			var o; while ( o = ns.shift() ) ctx = ctx[o] || ( ctx[o] = obj() );

			return ctx;
		},
		coerce : function( o, n, s ) { return !isNaN( ( n = Number( o ) ) ) ? n : ( s = String( o ) ) in force ? force[s] : o; },
		copy    : copy,  def    : def,    defs  : defs, describe : describe,
		empty   : empty, exists : exists, got   : got,  has      : has,
		id      : function( o, prefix ) { return o ? got( o, 'id' ) ? o.id : ( o.id = _id( prefix ) ) : _id( prefix ); },
		iter    : iter,
		len     : len, nativeType : nativeType, noop  : function() {}, obj : obj,
		range   : function ( i, j ) {
			var a = [i];
			while ( ++i <= j ) a.push( i );
			return a;
		},
		tostr   : tostr, type   : type,   valof : valof, x : x
	}, 'w' );
