	function __lib__( val ) { return val; }

	function bless( ns, ctx ) {
		switch( nativeType( ns ) ) {
			case 'array'  :                       break;
			case 'string' : ns = ns.split( '.' ); break;
			default       : return bless_ctx( ctx );
		}

		if ( re_lib.test( ns[0] ) ) { ctx = __lib__; ns.shift(); }

		if ( !ns.length ) return bless_ctx( ctx );

		ns[0].indexOf( '^' ) || ( ctx || ns[0] == '^' ? ns.shift() : ns[0] = ns[0].substring( 1 ) );
		ctx = bless_ctx( ctx );

		var o; while ( o = ns.shift() ) ctx = ctx[o] || ( ctx[o] = obj() );

		return ctx;
	}
	function bless_ctx( ctx ) {
		return ENV == 'commonjs'
			? ( ctx ? is_mod( ctx ) ? ctx.exports : ctx : module.exports )
			: ctx || root;
	}

	function coerce( item ) {
		var num = Number( item ), str;
		return !isNaN( num ) ? num : ( str = String( item ) ) in force ? force[str] : item;
	}

	function copy( target, source, no_overwrite ) {
		no_overwrite = no_overwrite === true; source || ( source = target, target = obj() );
		for ( var key in source ) !has( source, key ) || ( no_overwrite && has( target, key ) ) || ( target[key] = source[key] );
		return target;
	}

	function cpdef( target, source, no_overwrite ) {
		no_overwrite = no_overwrite === true; source || ( source = target, target = obj() );
		return Object.getOwnPropertyNames( source ).reduce( function( o, key ) {
			( no_overwrite && has( o, key ) ) || def( o, key, description( source, key ) );
			return o;
		}, target );
	}

	function def( item, name, desc ) {
		var args    = slice.call( arguments, 3 ),
			defined = got( item, name ), debug, mode, ntype, overwrite;

		switch ( nativeType( args[0] ) ) {
			case 'string'  : mode = modes[args.shift()]; break;
			case 'object'  : mode = args.shift();        break;
			default        :
				 ntype = nativeType( desc );
				 mode  = ntype != 'object' && defined ? description( item, name ) : null;
				!mode || ( mode = ntype == 'function' ? modes.cw : modes.cew );
		}
		overwrite = args.shift() === true;
		debug     = args.shift() === true;

		if ( defined && !overwrite ) {
			if ( debug ) new Error( Name + '.def cannot overwrite existing property: ' + name + ', in item type: ' + type( item ) + '.' );
		}
		else {
			if ( ntype != 'object' && mode )
				desc = describe( desc, mode );
			if ( desc.get || desc.set )
				delete desc.writable; // <- ARGH!!! see: https://plus.google.com/117400647045355298632/posts/YTX1wMry8M2
			Object.defineProperty( item, name, desc )
		}
		return __lib__;
	}

	function defs( item, props, mode, overwrite, debug ) {
		mode || ( mode = 'cw' );
		for ( var key in props )
			!has( props, key ) || def( item, key, props[key], mode, overwrite, debug );
		return __lib__;
	}

	function describe( desc, mode ) {
		return copy( ( nativeType( desc ) == 'object' ? desc : { value : desc } ), ( nativeType( mode ) == 'object' ? mode : modes[String( mode ).toLowerCase()] || modes.cew ), true );
	}
	function description( item, property ) {
		return Object.getOwnPropertyDescriptor( item, property );
	}

	function empty( item ) { return !exists( item ) || ( !len( item ) && iter( item ) ) || false; }
	function exists( item ) { return !( item === null || item === UNDEF || ( typeof item == 'number' && isNaN( item ) ) ); }

	function expose( lib, name, mod ) {
		if ( typeof name != 'string' && lib[__name__] ) {
			mod  = name;
			name = lib[__name__];
		}

		var conflict, defaults = obj();                            // make sure the exposed library has a type
		defaults[__name__] = name; defaults[__type__] = 'library'; // of "library" and its name attached to it.

		if ( ENV == 'commonjs' && is_mod( mod ) )
			mod.exports = lib;
		else {
			mod || ( mod = root );

			if ( ( conflict = mod[name] ) && iter( conflict ) ) {
				conflict[name] = lib;
				lib            = cpdef( conflict, lib );
			}
			else
				def( mod, name, describe( { value : lib }, 'ew' ) );

			if ( ENV == 'browser' )
				typeof define != 'function' || !define.amd  || define( name, [], function() { return lib; } );
		}

		defs( lib, defaults, 'w', true );

		return lib; // return the exposed library, if it already exists this will allow us to re-assign our internal copy
	}

	function fname( fn ) { return fn.name || fn.displayName || ( String( fn ).match( re_name ) || ['', ''] )[1].trim(); }

	function format( str ) { return gsub( str, Array.coerce( arguments, 1 ) ); }

	function got( item, property ) {
		return String( property ) in Object( item );
	}

	function gsub( str, o, pattern ) {
		return String( str ).replace( ( pattern || re_gsub ), function( m, p ) { return o[p] || ''; } );
	}

	// credit for guid goes here: gist.github.com/2295777
	function guid() { return tpl_guid.replace( re_guid, guid_replace ); }
	function guid_replace( match ) {
		var num = ( randy() * 16 ) | 0;
		return ( match == 'x' ? num : ( num & 0x3 | 0x8 ) ).toString( 16 );
	}

	function has( item, property ) {
		return OP.hasOwnProperty.call( Object( item ), String( property ) );
	}

	function id( item, prefix ) { return item ? got( item, 'id' ) && !empty( item.id ) ? item.id : ( item.id = id_create( prefix ) ) : id_create( prefix ); }
	function id_create( prefix ) { return ( prefix || id_prefix ) + '-' + ( ++id_count ); }

	function is_mod( mod ) {
		if ( Module === null ) return false;
		try { return mod instanceof Module; }
		catch ( e ) { return false; }
	}

	function iter( item ) { return got( item, 'length' ) || nativeType( item ) == 'object'; }

	function len( item ) { return ( 'length' in ( item = Object( item ) ) ? item : Object.keys( item ) ).length; }
	
	function merge( target, source ) {
		var ntype;
		
		if ( !source ) {
			switch ( ntype = nativeType( target ) ) {
				case 'array' : case 'object' : 
					source = target; 
					target = new ( source.constructor || Object ); break;
				default      : return target;
			} 
		}
		else ntype = nativeType( source );
		
		switch ( ntype ) {
			case 'object' :
				return Object.keys( source ).reduce( merge_object, { source : source, target : target } ).target;
			case 'array'  : 
				target.length = source.length; // remove any extra items on the merged Array
				return source.reduce( merge_array, target );
			default       : return source;
		}
	}
	function merge_array( target, source, i ) {
		target[i] = nativeType( target[i] ) === nativeType( source ) ? merge( target[i], source ) : merge( source );
		return target;
	}
	function merge_object( o, key ) {
		o.target[key] = nativeType( o.target[key] ) === nativeType( o.source[key] ) ? merge( o.target[key], o.source[key] ) : merge( o.source[key] );
		return o;
	}

	function noop() {}

	function obj( props ) {
		var nobj = Object.create( null );
		return typeof props == 'object' ? copy( nobj, props ) : nobj;
	}

	function prop_exists( test, item, property ) {
		var key; property = String( property );

		if ( arguments.length > 3 ) {
			property = slice.call( arguments, 2 );

			while ( key = property.shift() )
				if ( prop_exists( test, item, key ) )
					return true;

			return false;
		}

		if ( test( item, property ) )
			return true;

		if ( typeof item != 'string' && !!~property.indexOf( '.' ) ) {
			property = property.split( '.' );

			while ( key = property.shift() ) {
				if ( !prop_exists( test, item, key ) )
					return false;

				item = item[key];
			}

			return true;
		}

		return false;
	}

	function range( i, j ) {
		var a = [i];
		while ( ++i <= j ) a.push( i );
		return a;
	}

	function remove( item, keys ) {
		keys = Array.isArray( keys ) ? keys : slice.call( arguments, 1 );
		var remove_ = Array.isArray( item ) ? remove_array : remove_object;
		keys.forEach( remove_, item );
		return item;
	}
	function remove_array( val ) {
		var i = this.indexOf( val );
		i = !!~i ? i : !isNaN( val ) && val in this ? val : i;
		i < 0 || this.splice( i, 1 );
	}
	function remove_object( key ) { delete this[key]; }

	function tostr( item ) { return OP.toString.call( item ); }
	function valof( item ) { return OP.valueOf.call( item ); }

// type methods
	function domType( dtype ) {
		return dtype == htmdoc ? htmdoc : ( dtype == htmcol || dtype == 'nodelist' ) ? htmcol : ( !dtype.indexOf( 'htm' ) && ( dtype.lastIndexOf( 'element' ) + 7 === dtype.length ) ) ? 'htmlelement' : false;
	}
	function nativeType( item ) {
		var native_type = tostr( item );
		if ( native_type in ntype_cache ) return ntype_cache[native_type]; // check the ntype_cache first
		return ( ntype_cache[native_type] = native_type.split( ' ' )[1].split( ']' )[0].replace( re_vendor, '$1' ).toLowerCase() );
	}
	function type( item ) {
		if ( item === null || item === UNDEF )
			return false;

		var t = got( item, __type__ )
			  ? item[__type__] : Object.getPrototypeOf( item ) === null
			  ? 'nullobject'   : UNDEF;

		return t !== 'object'
			 ? t
			 : ( prop_exists( has, item, 'configurable', 'enumerable', 'writable' ) && has( item, 'value' )
			 ||  prop_exists( has, item, 'get', 'set' ) )
			 ? 'descriptor'
			 : t;
	}

	function update( target, source ) {
		if ( !source ) return merge( target );

		switch ( nativeType( source ) ) {
			case 'object' : return Object.keys( source ).reduce( update_object, { source : source, target : target } ).target;
			case 'array'  : return source.reduce( update_array, target );
			default       : return target;
		}
	}

	function update_array( target, source, i ) {
		target[i] = !got( target, i )
				  ?  merge( source )
				  :  nativeType( target[i] ) == nativeType( source )
				  ?  update( target[i], source )
				  :  target[i];
		return target;
	}

	function update_object( o, key ) {
		o.target[key] = !got( o.target, key )
					  ?  merge( o.source[key] )
					  :  nativeType( o.target[key] ) == nativeType( o.source[key] )
					  ?  update( o.target[key], o.source[key] )
					  :  o.target[key];
		return o;
	}
