// expose m8: JavaScript Natives are exposed by default, as such we do not need to worry about adding them to module.exports
//	ENV != 'commonjs' ? def( root, 'm8', describe( { value : m8 }, 'r' ) ) : ( module.exports = m8 );

}( this, 'm8' );
