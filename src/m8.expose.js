	if ( ENV != 'commonjs' ) {
		Name || ( Name = 'm8' );
		conflict = root[Name];
		desc_lib = describe( { value : __lib__ }, 'ew' );
		if ( conflict ) {
			Object.getOwnPropertyNames( __lib__ ).forEach( function( k ) {
				this[k] = __lib__[k];
			}, conflict );
			def( conflict, Name, desc_lib );
			__lib__ = conflict;
		}
		else def( root,  Name, desc_lib );
	}
	else module.exports = __lib__;
