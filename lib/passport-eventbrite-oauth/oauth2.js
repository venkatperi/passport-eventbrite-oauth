/**
 * Module dependencies.
 */
var util = require( 'util' );
var OAuth2Strategy = require( 'passport-oauth' ).OAuth2Strategy;
var InternalOAuthError = require( 'passport-oauth' ).InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Eventbrite authentication strategy authenticates requests by delegating to
 * Eventbrite using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Eventbrite application's client id
 *   - `clientSecret`  your Eventbrite application's client secret
 *   - `callbackURL`   URL to which Eventbrite will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new EventbriteStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/eventbrite/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy( options, verify ) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.eventbrite.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://www.eventbrite.com/oauth/token';

  OAuth2Strategy.call( this, options, verify );
  this.name = 'eventbrite';
  this._oauth2.useAuthorizationHeaderforGET( true );
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits( Strategy, OAuth2Strategy );

/**
 * Retrieve user profile from Eventbrite.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `eventbrite`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function ( accessToken, done ) {
  this._oauth2.get( 'https://www.eventbrite.com/json/user_get', accessToken, function ( err, body, res ) {
    if ( err ) {
      return done( new InternalOAuthError( 'failed to fetch user profile', err ) );
    }

    try {
      var json = JSON.parse( body );
      var profile = { provider : 'eventbrite' };
      profile.id = json.user.user_id;
      profile.displayName = json.user.first_name + ' ' + json.user.last_name;
      profile.name = { familyName : json.user.last_name,
        givenName : json.user.first_name };
      profile.emails = [
        { value : json.user.email }
      ];

      profile._raw = body;
      profile._json = json;

      return done( null, profile );
    }
    catch ( e ) {
      return done( e );
    }
  } );
};

/**
 * Return extra Eventbrite-specific parameters to be included in the authorization
 * request.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function ( options ) {
  var params = {};
  params['app_key'] = this._oauth2._clientId;
  return params;
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
