// Commonjs Modules 1.1.1: http://wiki.commonjs.org/wiki/Modules/1.1.1
// notes section:          http://wiki.commonjs.org/wiki/Modules/ProposalForNativeExtension
// specifies the possibility of sandboxing JavaScript Natives in Modules in future versions
// this should future proof this all up in your mother's fudge!
	function x() {
		slice.call( arguments ).forEach( _x );
		return m8;
	}
	def( x, 'cache', describe( function( type, extender ) {
		xcache[type] || ( xcache[type] = [] );
		xcache[type].push( extender );
		return m8;
	}, 'w' ) );
	function _x( Type ) {
		got( Type, xid ) || def( Type, xid, describe( 0, 'w' ) ); // Type.__xid__ will be updated, everytime a Type is
		var o = xcache[Type.__name__ || Type.name];               // extended. This means unsandboxed environments will
		if ( !o ) return;                                         // not have to suffer repeated attempts to assign
		o.slice( Type[xid] ).forEach( x_, Type );                 // methods and properties which have already being
		Type[xid] = o.length;                                     // assigned every time m8.x() is called, and potentilly
	}                                                             // throwing overwrite errors.
	function x_( extend ) { extend( this, m8 ); }

	x.cache( 'Array', function( Type ) {
		def( Type, 'coerce', describe( function( a, i, j ) {
			if ( !got( a, 'length' ) ) return slice.call( arguments );
			i = parseInt( i, 10 );
			switch ( arguments.length ) {
				case 2 : isNaN( i ) || i >= 0 ? ( j = a.length ) : ( j = a.length + i, i = 0 );                      break;
				case 3 : j = isNaN( j = parseInt( j, 10 ) ) ? a.length : j > i ? j : j <= 0 ? a.length + j : i + j ; break;
			}
			return slice.call( a, i, j );
		}, 'w' ) );
		def( Type.prototype, 'find', describe( function( fn, ctx ) {
			var i = -1, l = this.length >>> 0;
		    ctx || ( ctx = this );
		    while ( ++i < l ) if ( !!fn.call( ctx, this[i], i, this ) ) return this[i];
		    return null;
		}, 'w' ) );
	} );
	x.cache( 'Boolean', function( Type ) {
		def( Type, 'coerce', describe( function( o ) {
			switch( type( o ) ) {
				case 'boolean' : return o;
				case 'nan'     : case false    : return false;
				case 'number'  : case 'string' : return !( o in force ? !force[o] : Number( o ) === 0 );
			}
			return true;
		}, 'w' ) );
	} );
	x.cache( 'Function', function( Type ) {
		defs( Type.prototype, {
			__name__  : { get : function() { // accessor property
				if ( !this.__m8name__ ) {
					var fn = valof( this ),
						m  = fn !== this ? fn.__name__ !== 'anonymous' ? fn.__name__ : null : null, // handles anonymous functions which are mimicking (see mimic below) named functions
						n  = m || this.name || this.displayName || ( String( this ).match( re_name ) || ['', ''] )[1].trim();
					def( this, '__m8name__', describe( ( m || n || 'anonymous' ), 'w' ) );
				}
				return this.__m8name__;
			} },
			mimic     : function( fn, name ) {  // method
				var v = valof( fn );
				defs( this, {
					displayName : ( name || fn.__name__ ),
					toString    : function() { return v.toString(); },
					valueOf     : function() { return v; }
				}, 'c', true );
				return this;
			}
		}, 'w' );
	} );
	x.cache( 'Object', function( Type ) {
// this is a special case which does not use m8.describe
// since it internally uses __type__ which is about to be set up here.
		def( Type.prototype, '__type__', copy( { get : function() {
			var o = this, ctor = o.constructor, nt = nativeType( o ),
				t = domType( nt ) || ( re_global.test( nt ) ? 'global' : false );
			return t || ( nt == 'object' && ctor.__type__ != 'function'
						? ctor.__name__.toLowerCase() || ctor.__type__ || nt
						: nt == 'number' && isNaN( o ) ? 'nan'
						: nt );
		} }, modes.r ) );

		defs( Type, {
			reduce : function( o, fn, v ) {
				return Type.keys( o ).reduce( function( r, k, i ) {
					r = fn.call( o, r, o[k], k, o, i );
					return r;
				}, v );
			},
			value  : function( o, k )  {
				if ( isNaN( k ) && !!~k.indexOf( '.' ) ) {
					var v;  k = k.split( '.' );
					while ( v = k.shift() ) if ( ( o = Type.value( o, v ) ) === U ) return o;
					return o;
				}
				return empty( o )
					 ? U                   : !empty( o[k] )
					 ? o[k]                : typeof o.get          == 'function'
					 ? o.get( k )          : typeof o.getAttribute == 'function'
					 ? o.getAttribute( k ) : U;
			},
			values : function( o ) { return Type.keys( Object( o ) ).map( function( k ) { return o[k]; } ); }
		}, 'w' );
	} );

	x( Object, Array, Boolean, Function );
