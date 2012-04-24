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
			new Error( 'm8.def cannot overwrite existing property: ' + name + ', in item type: ' + type( item ) + '.' );
		return m8;
	}
	function defs( item, o, m, overwrite, debug ) {
		m || ( m = 'cw' );
		for ( var k in o ) !has( o, k ) || def( item, k, describe( o[k], m ), overwrite, debug );
		return m8;
	}
	function describe( v, m ) { return copy( ( nativeType( v ) == 'object' ? v : { value : v } ), ( nativeType( m ) == 'object' ? m : modes[m.toLowerCase()] || modes.cew ) ); }

	function empty( o ) { return !exists( o ) || ( iter( o ) ? !len( o ) : false ); }
	function exists( o ) { return ( o = type( o ) ) !== false && o != 'nan'; }

	function got( o, k ) { return k in Object( o ); }
	function has( o, k ) { return OP.hasOwnProperty.call( o, k ); }

	function len( o ) { return Object.keys( Object( o ) ).length; }

	function m8( o ) { return o; }

	function obj( o, n ) { return ( n = Object.create( null ) ) && arguments.length >= 1 ? copy( n, o ) : n; }

	function tostr( o ) { return OP.toString.call( o ); }
	function valof( o ) { return OP.valueOf.call( o ); }

// type methods
	function domType( t ) { return re_col.test( t ) ? 'htmlcollection' : re_el.test( t ) ? 'htmlelement' : false; }
	function nativeType( o, t ) {
		if ( ( t = tostr( o ) ) in types ) return types[t]; // check the cached types first
		return ( types[t] = t.toLowerCase().match( re_type )[1].replace( re_vendor, '$1' ) );
	}
	function type( o ) { return o === null || o === U ? false : got( o, '__type__' ) ? o.__type__ : Object.getPrototypeOf( o ) === null ? null + "object" : U; }

// internals
	function _id( prefix ) { return ( prefix || id_prefix ) + ( ++id_count ); }
	function blessCTX( ctx ) {
		return ENV == 'commonjs'
			 ? ctx ? ctx instanceof Module ? ctx.exports : ctx : module.exports
			 : ctx || root;
	}
	function iter( o ) { return 'length' in Object( o ) || nativeType( o ) == 'object'; }

// if ENV === commonjs we want root to be global
	typeof global == 'undefined' || ( root = global );

	defs( m8, {
// properties
		ENV    : ENV, global : { value : root }, modes : { value : modes }, __type__ : 'm8',
// methods
		bless  : function( ns, ctx ) {
			switch( nativeType( ns ) ) {
				case 'array'  :                       break;
				case 'string' : ns = ns.split( '.' ); break;
				default       : return blessCTX( ctx );
			}

			if ( re_m8.test( ns[0] ) ) { ctx = m8; ns.shift(); }

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
		len     : len, nativeType : nativeType, noop  : function() {}, obj : obj,
		range   : function ( i, j ) {
			var a = [i];
			while ( ++i <= j ) a.push( i );
			return a;
		},
		tostr   : tostr, type   : type,   valof : valof, x : x
	}, 'w' );
