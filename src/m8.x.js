// Commonjs Modules 1.1.1: http://wiki.commonjs.org/wiki/Modules/1.1.1
// notes section:          http://wiki.commonjs.org/wiki/Modules/ProposalForNativeExtension
// specifies the possibility of sandboxing JavaScript Natives in Modules in future versions
// this should future proof this all up in your mother's fudge!
	function x() {
		slice.call( arguments ).forEach( x_update );
		return __lib__;
	}
	def( x, 'cache', describe( function( type, extender ) {
		typeof type == 'string' || ( type = type.__name__ || fname( type ) );
		xcache[type] || ( xcache[type] = [] );
		xcache[type].push( extender );
		return __lib__;
	}, 'w' ) );
	function x_extend( extender ) { extender( this, __lib__ ); }
	function x_update( Type ) {
		got( Type, xid ) || def( Type, xid, describe( 0, 'w' ) ); // Type.__xid__ will be updated, everytime a Type is
		var o = xcache[Type.__name__ || fname( Type )];           // extended. This means unsandboxed environments will
		if ( !o ) return;                                         // not have to suffer repeated attempts to assign
		o.slice( Type[xid] ).forEach( x_extend, Type );           // methods and properties which have already being
		Type[xid] = o.length;                                     // assigned every time __lib__.x() is called, and potentilly
	}                                                             // throwing overwrite errors.

	x.cache( 'Array', function( Type ) {
		def( Type, 'coerce', describe( function( a, i, j ) {
			if ( !got( a, 'length' ) ) return [a];
			i = type( i ) == 'number' ? i > 0 ? i : 0 : 0;
			j = type( j ) == 'number' ? j > i ? j : j <= 0 ? a.length + j : i + j : a.length;
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
				if ( !this.__xname__ ) {
					var fn = valof( this ),
						m  = fn !== this ? fn.__name__ !== 'anonymous' ? fn.__name__ : null : null, // handles anonymous functions which are mimicking (see mimic below) named functions
						n  = m || fname( this );
					def( this, '__xname__', describe( ( m || n || 'anonymous' ), 'w' ) );
				}
				return this.__xname__;
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
// this is a special case which does not use __lib__.describe
// since it internally uses __type__ which is about to be set up here.
		def( Type.prototype, '__type__', copy( { get : function() {
			var o = this, ctor = o.constructor, nt = nativeType( o ),
				t = domType( nt ) || ( re_global.test( nt ) ? 'global' : false );
			return t || ( nt == 'object' && ( ctor && ctor.__type__ != 'function' )
						? String( ctor.__name__ ).toLowerCase() || ctor.__type__ || nt
						: nt == 'number' && isNaN( o ) ? 'nan'
						: nt );
		} }, modes.r ) );

		defs( Type, {
			reduce : function( o, fn, v ) {
				return Type.keys( Type( o ) ).reduce( function( r, k, i ) {
					r = fn.call( o, r, o[k], k, o, i );
					return r;
				}, v );
			},
			value  : function( o, k )  {
				if ( isNaN( k ) ) {
					if ( got( o, k ) ) return o[k];
					if ( !!~k.indexOf( '.' ) ) {
						var v;  k = k.split( '.' );
						while ( v = k.shift() ) if ( ( o = Type.value( o, v ) ) === U ) return o;
						return o;
					}
				}
				return empty( o )
					 ? U                   : !empty( o[k] )
					 ? o[k]                :  typeof o.get          == 'function'
					 ? o.get( k )          :  typeof o.getAttribute == 'function'
					 ? o.getAttribute( k ) : U;
			},
			values : function( o ) { return Type.keys( Object( o ) ).map( function( k ) { return o[k]; } ); }
		}, 'w' );
	} );

	x( Object, Array, Boolean, Function );
