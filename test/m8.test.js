typeof m8     !== 'undefined' || ( m8     = require( 'm8' ) );
typeof expect !== 'undefined' || ( expect = require( 'expect.js' ) );

suite( 'm8', function() {
	test( '<static> m8', function( done ) {
		var expected = { one : 1, three : 3, five : 5 };

		expect( m8( true ) ).to.be( true );
		expect( m8( expected ) ).to.be( expected );

		done();
	} );
	
	test( '<static> m8.bless', function( done ) {
		var expected = { foo : { bar : 'hello' } };

		expect( m8.bless( 'foo.bar' ) ).to.be.an( 'object' );

		if ( m8.ENV == 'commonjs' ) {
			expect( m8.bless( 'foo.bar',   module ) ).to.be( module.exports.foo.bar );
			module.exports.expected = expected;
			expect( m8.bless( '^.foo.bar', module.exports.expected ) ).to.be( expected.foo.bar );
		}
		else {
			expect( m8.bless( '^foo.bar', expected ) ).to.be( expected.bar );
			expect( m8.bless( '^.bar'    ) ).to.be( m8.global.bar );
		}

		expect( m8.bless( 'foo.bar', expected ) ).to.equal( 'hello' );

		done();
	} );
	
	test( '<static> m8.coerce', function( done ) {
		expect( m8.coerce( 'false'     ) ).to.be( false );
		expect( m8.coerce( 'null'      ) ).to.be( null );
		expect( m8.coerce( 'true'      ) ).to.be( true );
		expect( m8.coerce( 'undefined' ) ).to.be( undefined );
		expect( isNaN( m8.coerce( 'NaN' ) ) ).to.be( true );
		expect( m8.coerce( '1' ) ).to.be( 1 );
		expect( m8.coerce( '12' ) ).to.be( 12 );
		expect( m8.coerce( '123' ) ).to.be( 123 );
		expect( m8.coerce( '123.4' ) ).to.be( 123.4 );
		expect( m8.coerce( '123.45' ) ).to.be( 123.45 );
		expect( m8.coerce( '123.456' ) ).to.be( 123.456 );
		expect( m8.coerce( '1e10' ) ).to.be( 10000000000 );
		expect( m8.coerce( '.0000000001e10' ) ).to.be( 1 );

		done();
	} );
	
	test( '<static> m8.copy', function( done ) {
		var expected = { foo : { bar : 'hello' } };
		
		expect( m8.copy( {}, expected ) ).to.eql( expected );
		expect( m8.copy( expected, { foo : { bar : 'goodbye' } }, true ) ).to.eql( expected );
		expect( m8.copy( { foo : { bar : 'goodbye' } }, expected ) ).to.eql( expected );

		done();
	} );
	
	test( '<static> m8.def', function( done ) {
		var o = {};

		m8.def( o, 'foo', m8.describe( 'bar', 'r' ) );
		m8.def( o, 'bar', m8.describe( { value : { boo : 'baz' } }, 'c' ) );

		expect( o.foo ).to.equal( 'bar' );
		expect( o.bar ).to.eql( { boo : 'baz' } );
		expect( Object.keys( o ) ).to.eql( [] );
		expect( delete o.foo ).to.be( false );
		expect( delete o.bar ).to.be( true );

		done();
	} );
	
	test( '<static> m8.defs', function( done ) {
		var o = {};

		m8.defs( o, {
			foo : 'bar',
			bar : { value : { boo : 'baz' } }
		}, 'c' );

		expect( o.foo ).to.equal( 'bar' );
		expect( o.bar ).to.eql( { boo : 'baz' } );
		expect( Object.keys( o ) ).to.eql( [] );
		expect( delete o.foo ).to.be( true );
		expect( delete o.bar ).to.be( true );

		done();
	} );
	
	test( '<static> m8.describe', function( done ) {
		function getter() {} function setter() {}
		
		expect( m8.describe( 'foo', 'r' ) ).to.eql( { configurable : false, enumerable : false, value : 'foo', writable : false } );
		expect( m8.describe( { value : 'bar' }, 'cw' ) ).to.eql( { configurable : true, enumerable : false, value : 'bar', writable : true } );
		expect( m8.describe( { get : getter, set : setter }, m8.modes.c ) ).to.eql( { configurable : true, enumerable : false, get : getter, set : setter, writable : false } );
		expect( m8.describe( getter, m8.modes.e ) ).to.eql( { configurable : false, enumerable : true, value : getter, writable : false } );

		done();
	} );
	
	test( '<static> m8.empty', function( done ) {
		expect( m8.empty( '' ) ).to.be( true );
		expect( m8.empty( [] ) ).to.be( true );
		expect( m8.empty( NaN ) ).to.be( true );
		expect( m8.empty( {} ) ).to.be( true );
		expect( m8.empty( null ) ).to.be( true );
		expect( m8.empty( undefined ) ).to.be( true );
		expect( m8.empty() ).to.be( true );
		expect( m8.empty( 0 ) ).to.be( false );
		expect( m8.empty( ' ' ) ).to.be( false );
		expect( m8.empty( [''] ) ).to.be( false );
		expect( m8.empty( { foo : '' } ) ).to.be( false );

		done();
	} );
	
	test( '<static> m8.exists', function( done ) {
		expect( m8.exists( 0 ) ).to.be( true );
		expect( m8.exists( false ) ).to.be( true );
		expect( m8.exists( '' ) ).to.be( true );
		expect( m8.exists( NaN ) ).to.be( false );
		expect( m8.exists( null ) ).to.be( false );
		expect( m8.exists( undefined ) ).to.be( false );

		done();
	} );
	
	test( '<static> m8.got', function( done ) {
		function Test( val ) { this.value = val; } Test.prototype = { foo : 'bar', baz : 'bam' };
		
		expect( m8.got( { foo : 'bar' }, 'foo' ) ).to.be( true );
		expect( m8.got( [1, 2, 3], 'length' ) ).to.be( true );
		expect( m8.got( { foo : 'bar' }, 'bar' ) ).to.be( false );
		expect( m8.got( { foo : 'bar', baz : 'bam' }, 'foo', 'baz' ) ).to.be( true );
		expect( m8.got( new Test(), 'foo', 'baz' ) ).to.be( true );
		expect( m8.got( new Test(), 'baz', 'bam' ) ).to.be( true );
		expect( m8.got( new Test( 'val' ), 'foo', 'bam', 'val' ) ).to.be( true );

		done();
	} );
	
	test( '<static> m8.has', function( done ) {
		function Test( val ) { this.value = val; } Test.prototype = { foo : 'bar', baz : 'bam' };
		
		expect( m8.has( { foo : 'bar' }, 'foo' ) ).to.be( true );
		expect( m8.has( [1, 2, 3], 'length' ) ).to.be( true );
		expect( m8.has( { foo : 'bar' }, 'bar' ) ).to.be( false );
		expect( m8.has( { foo : 'bar', baz : 'bam' }, 'foo', 'baz' ) ).to.be( true );
		expect( m8.has( new Test(), 'foo', 'baz' ) ).to.be( false );
		expect( m8.has( new Test(), 'bar', 'bam' ) ).to.be( false );
		expect( m8.has( new Test( 'value' ), 'foo', 'bam', 'value' ) ).to.be( true );

		done();
	} );
	
	test( '<static> m8.id', function( done ) {
		var expected = { id : 'foo' }, empty_obj = {};

		expect( m8.id( expected ) ).to.equal( 'foo' );
		expect( empty_obj.id ).to.be( undefined );
		expect( m8.id( empty_obj ) ).to.equal( empty_obj.id );

		done();
	} );
	
	test( '<static> m8.iter', function( done ) {
		expect( m8.iter( [] ) ).to.be( true );
		expect( m8.iter( {} ) ).to.be( true );
		expect( m8.iter( m8.obj() ) ).to.be( true );
		expect( m8.iter( '' ) ).to.be( true );
		expect( m8.iter( null ) ).to.be( false );
		expect( m8.iter( 3 ) ).to.be( false );
		expect( m8.iter( new Date() ) ).to.be( false );

		done();
	} );

	test( '<static> m8.len', function( done ) {
		expect( m8.len( { foo : 'bar' } ) ).to.equal( 1 );
		expect( m8.len( ['foo', 'bar'] ) ).to.equal( 2 );

		done();
	} );

	test( '<static> m8.merge', function( done ) {
		var expected = { foo : 'bar', items : [{ value : 1 }, { items : [{ value : 1 }, { items : [{ value : 1 }, { value : 2 }, { value : 3 }], value : 2 }, { value : 3 }], value : 2 }, { value : 3 }]},
			returned = m8.merge( m8.obj(), expected );

		expect( returned ).not.to.be( expected );
		expect( returned ).to.eql( expected );
		expect( returned.items ).not.to.be( expected.items );
		expect( returned.items[1].items[1] ).not.to.be( expected.items[1].items[1] );

		done();
	} );

	test( '<static> m8.nativeType', function( done ) {
		expect( m8.nativeType( null ) ).to.equal( 'null' );
		expect( m8.nativeType( undefined ) ).to.equal( 'undefined' );
		expect( m8.nativeType( [] ) ).to.equal( 'array' );
		expect( m8.nativeType( true ) ).to.equal( 'boolean' );
		expect( m8.nativeType( new Date() ) ).to.equal( 'date' );
		expect( m8.nativeType( function() {} ) ).to.equal( 'function' );
		expect( m8.nativeType( 0 ) ).to.equal( 'number' );
		expect( m8.nativeType( NaN ) ).to.equal( 'number' );
		expect( m8.nativeType( {} ) ).to.equal( 'object' );
		expect( m8.nativeType( Object.create( null ) ) ).to.equal( 'object' );
		expect( m8.nativeType( /.*/ ) ).to.equal( 'regexp' );
		expect( m8.nativeType( '' ) ).to.equal( 'string' );

		done();
	} );

	test( '<static> m8.obj', function( done ) {
		var expected = { foo : 'bar', items : [1, 2, 3] }, returned = m8.obj( expected );

		expect( returned ).to.eql( expected );
		expect( m8.type( returned ) ).to.eql( 'nullobject' );
		expect( Object.getPrototypeOf( returned ) ).to.be( null );
		expect( m8.nativeType( returned ) ).to.equal( 'object' );
		expect( m8.nativeType( returned ) ).not.to.equal( 'nullobject' );
		expect( m8.type( returned ) ).not.to.equal( 'object' );

		done();
	} );

	test( '<static> m8.range', function( done ) {
		var returned = m8.range( 1, 10 );

		expect( returned ).to.eql( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] );
		expect( returned ).to.be.an( 'array' );

		done();
	} );

	test( '<static> m8.remove', function( done ) {
		var expected = { one : 1, three : 3, five : 5 };
		
		expect( m8.remove( { one : 1, two : 2, three : 3, four : 4, five : 5 }, 'two', 'four' ) ).to.eql( expected );
		expect( m8.remove( { one : 1, two : 2, three : 3, four : 4, five : 5 }, ['two', 'four'] ) ).to.eql( expected );

		done();
	} );

	test( '<static> m8.tostr', function( done ) {
		expect( m8.tostr( {} ) ).to.equal( '[object Object]' );
		expect( m8.tostr( [] ) ).to.equal( '[object Array]' );

		done();
	} );

	test( '<static> m8.type', function( done ) {
		expect( m8.type( null ) ).to.equal( false );
		expect( m8.type( undefined ) ).to.equal( false );
		expect( m8.type( [] ) ).to.equal( 'array' );
		expect( m8.type( true ) ).to.equal( 'boolean' );
		expect( m8.type( new Date() ) ).to.equal( 'date' );
		expect( m8.type( function() {} ) ).to.equal( 'function' );
		expect( m8.type( 0 ) ).to.equal( 'number' );
		expect( m8.type( NaN ) ).to.equal( 'nan' );
		expect( m8.type( {} ) ).to.equal( 'object' );
		expect( m8.type( Object.create( null ) ) ).to.equal( 'nullobject' );
		expect( m8.type( /.*/ ) ).to.equal( 'regexp' );
		expect( m8.type( '' ) ).to.equal( 'string' );

		done();
	} );

	test( '<static> Array.coerce returns an Array based on the passed item', function( done ) {
		expect( Array.coerce( [1, 2, 3] ) ).to.eql( [1, 2, 3] );
		expect( Array.coerce( { foo : 'bar' } ) ).to.eql( [{ foo : 'bar' }] );
		expect( Array.coerce( function() { return arguments; }( 1, 2, 3 ) ) ).to.eql( [1, 2, 3] );

		done();
	} );

	test( '<static> Boolean.coerce: returns true for true like Strings', function( done ) {
		expect( Boolean.coerce( true ) ).to.be( true );
		expect( Boolean.coerce( 'true' ) ).to.be( true );
		expect( Boolean.coerce( 1 ) ).to.be( true );
		expect( Boolean.coerce( '1' ) ).to.be( true );
		expect( Boolean.coerce( 'some random string of text' ) ).to.be( true );
		expect( Boolean.coerce( -1 ) ).to.be( true );

		done();

	} );

	test( '<static> Boolean.coerce: returns false for false like Strings', function( done ) {
		expect( Boolean.coerce( false ) ).to.be( false );     expect( Boolean.coerce( 'false' ) ).to.be( false );
		expect( Boolean.coerce( 0 ) ).to.be( false );         expect( Boolean.coerce( '0' ) ).to.be( false );
		expect( Boolean.coerce( NaN ) ).to.be( false );       expect( Boolean.coerce( 'NaN' ) ).to.be( false );
		expect( Boolean.coerce( null ) ).to.be( false );      expect( Boolean.coerce( 'null' ) ).to.be( false );
		expect( Boolean.coerce( undefined ) ).to.be( false ); expect( Boolean.coerce( 'undefined' ) ).to.be( false );
		expect( Boolean.coerce() ).to.be( false );            expect( Boolean.coerce( '' ) ).to.be( false );

		done();
	} );

	test( 'Function.prototype.__name__', function( done ) {
		function Test() {}
		Test.prototype = {
			get : function get() {}, set : function set() {}, test : function() {}
		};
		
		expect( function( one ){}.__name__ ).to.equal( 'anonymous' );
		expect( function foo( one, two, three ){}.__name__ ).to.equal( 'foo' );
		expect( m8.obj.__name__ ).to.equal( 'obj' );
		expect( m8.nativeType.__name__ ).to.equal( 'nativeType' );
		expect( Test.__name__ ).to.equal( 'Test' );
		expect( Test.prototype.get.__name__ ).to.equal( 'get' );
		expect( Test.prototype.set.__name__ ).to.equal( 'set' );
		expect( Test.prototype.test.__name__ ).to.equal( 'anonymous' );

		done();
	} );

	test( 'Function.prototype.mimic', function( done ) {
		function one() {}
		function two() {}
		two.mimic( one );
		
		expect( one ).not.to.be(  two );
		expect( one ).not.to.equal( two );
		expect( one.valueOf()  ).to.equal( two.valueOf()  );
		expect( one.toString() ).to.equal( two.toString() );

		done();
	} );

	test( '<static> Object.key', function( done ) {
		expect( Object.key( { foo : 'bar' }, 'bar' ) ).to.equal( 'foo' );
		expect( Object.key( { foo : 'bar' }, 'foo' ) ).to.be( null );

		done();
	} );

	test( '<static> Object.reduce', function( done ) {
		expect( Object.reduce( { one : 1, two : 2, three : 3, four : 4, five : 5 }, function( res, v, k, o ) {
			return res += v;
		}, 0 ) ).to.equal( 15 );

		done();
	} );

	test( '<static> Object.value', function( done ) {
		var d = { one : { two : { three : true, four : [1, 2, 3, 4] } } };
		
		expect( Object.value( d, 'one' ) ).to.eql( d.one );
		expect( Object.value( d, 'one.two' ) ).to.eql( d.one.two );
		expect( Object.value( d, 'one.two.three' ) ).to.eql( d.one.two.three );
		expect( Object.value( d, 'one.two.four' ) ).to.eql( d.one.two.four );
		expect( Object.value( d, 'one.two.four.2' ) ).to.eql( d.one.two.four[2] );
		expect( Object.value( d, 'one.three.four.2' ) ).to.be( undefined );
		expect( Object.value( d, 'one.two.beep.7' ) ).to.be( undefined );
		expect( Object.value( d, 'one.two.four.7' ) ).to.be( undefined );

		done();
	} );

	test( '<static> Object.values', function( done ) {
		expect( Object.values( { one : 1, two : 2, three : 3, four : 4, five : 5 } ) ).to.eql( [1, 2, 3, 4, 5] );
		expect( Object.values( [1, 2, 3, 4, 5] ) ).to.eql( [1, 2, 3, 4, 5] );

		done();
	} );

} );
