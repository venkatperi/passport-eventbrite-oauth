var vows = require( 'vows' );
var assert = require( 'assert' );
var util = require( 'util' );
var eventbrite = require( 'passport-eventbrite-oauth' );

vows.describe( 'passport-eventbrite-oauth' ).addBatch( {

  'module' : {
    'should report a version' : function ( x ) {
      assert.isString( eventbrite.version );
    },
    'should export OAuth 2.0 strategy' : function ( x ) {
      assert.isFunction( eventbrite.OAuth2Strategy );
    }
  }
} ).export( module );
