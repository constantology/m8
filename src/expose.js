	iter( PACKAGE ) || ( PACKAGE = ENV == 'commonjs' ? module : root );

	defs( ( __lib__ = expose( __lib__, Name, PACKAGE ) ), {
	// properties
		ENV      : ENV,      global      : { value : root },             modes  : { value : modes },
	// methods
		bless    : bless,    coerce      : coerce,      copy   : copy,   def    : def,    defs       : defs,
		describe : describe, description : description, empty  : empty,  exists : exists, expose     : expose,
		got      : property_exists.bind( null, got ),   guid   : guid,   has    : property_exists.bind( null, has ),
		id       : id,       iter        : iter,        len    : len,    merge  : merge,  nativeType : nativeType,
		noop     : noop,     ntype       : nativeType,  obj    : obj,    range  : range,  remove     : remove,
		tostr    : tostr,    type        : type,        update : update, valof  : valof,  x          : x
	}, 'w' );

	x( Object, Array, Boolean, Function );
