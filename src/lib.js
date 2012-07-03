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

	function def( item, name, desc ) {
		var args    = slice.call( arguments, 3 ),
			defined = got( item, name ), debug, mode, ntype, overwrite;

		switch ( nativeType( args[0] ) ) {
			case 'string'  : mode = modes[args.shift()]; break;
			case 'object'  : mode = args.shift();        break;
			default        :
				 ntype = nativeType( desc );
				 mode  = ntype != 'object' && defined ? Object.getOwnPropertyDescriptor( item, name ) : null;
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

	function empty( item ) { return !exists( item ) || ( !len( item ) && iter( item ) ) || false; }
	function exists( item ) { return !( item === null || item === UNDEF || ( typeof item == 'number' && isNaN( item ) ) ); }

	function expose( lib, name, mod ) {
		if ( typeof name != 'string' && lib[__name__] ) {
			mod = name; name = lib[__name__];
		}

		if ( ENV == 'commonjs' && is_mod( mod ) ) mod.exports = lib;
		else {
			mod || ( mod = root );
			var conflict = mod[name], desc = describe( { value : lib }, 'ew' );
			( conflict && iter( conflict ) )        // make sure if lib is already defined it's not a primitive value!
			? def( ( lib = conflict ), '__', desc ) // don't over-write what's there, just add lib to conflict as conflict.__
			: def( mod, name, desc );               // however, all properties will be added to conflict, not lib and
		}                                           // conflict will be returned instead of lib

		mod = obj(); mod[__name__] = name; mod[__type__] = 'library'; // make sure the exposed library has a type
		defs( lib, mod, 'w', true );                                  // of "library" and its name attached to it.

		return lib; // return the exposed library, if it already exists this will allow us to re-assign our internal copy
	}

	function fname( fn ) { return fn.name || fn.displayName || ( String( fn ).match( re_name ) || ['', ''] )[1].trim(); }

	function got( obj, key ) { return arguments.length > 2 ? hasSome( got, obj, Array.coerce( arguments, 1 ) ) : key in Object( obj ); }
	function has( obj, key ) { return arguments.length > 2 ? hasSome( has, obj, Array.coerce( arguments, 1 ) ) : OP.hasOwnProperty.call( obj, key ); }
	function hasSome( test, obj, keys ) { return keys.some( function( key ) { return test( obj, key ); } ); }

	function id( item, prefix ) { return item ? got( item, 'id' ) ? item.id : ( item.id = id_create( prefix ) ) : id_create( prefix ); }
	function id_create( prefix ) { return ( prefix || id_prefix ) + ( ++id_count ); }

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
		target[i] = merge( source );
		return target;
	}
	function merge_object( o, key ) {
		o.target[key] = merge( o.source[key] );
		return o;
	}

	function obj( props ) {
		var nobj = Object.create( null );
		return typeof props == 'object' ? copy( nobj, props ) : nobj;
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
		var ntype = tostr( item );
		if ( ntype in types ) return types[ntype]; // check the cached types first
		return ( types[ntype] = ntype.split( ' ' )[1].split( ']' )[0].replace( re_vendor, '$1' ).toLowerCase() );
	}
	function type( item ) {
		return item === null || item === UNDEF
			 ? false
			 : got( item, __type__ )
			 ? item[__type__]
			 : Object.getPrototypeOf( item ) === null
			 ? 'nullobject'
			 : UNDEF;
	}
