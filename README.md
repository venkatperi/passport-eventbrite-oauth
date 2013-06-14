# Passport-Eventbrite-OAuth

[Passport](http://passportjs.org/) strategies for authenticating with [Eventbrite](http://www.eventbrite.com/)
using OAuth 2.0.

This module lets you authenticate using Eventbrite in your Node.js applications.
By plugging into Passport, Eventbrite authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-eventbrite-oauth

## Usage of OAuth 2.0

#### Configure Strategy

The Eventbrite OAuth 2.0 authentication strategy authenticates users using a Eventbrite
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    var EventbriteStrategy = require('passport-eventbrite-oauth').OAuth2Strategy;

    passport.use(new EventbriteStrategy({
        clientID: EVENTBRITE_CLIENT_ID,
        clientSecret: EVENTBRITE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/eventbrite/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ eventbriteId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'eventbrite'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/eventbrite',
      passport.authenticate('eventbrite'));

    app.get('/auth/eventbrite/callback', 
      passport.authenticate('eventbrite', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [OAuth 2.0 example](https://github.com/venkatperi/passport-eventbrite-oauth/tree/master/examples/oauth2).

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/venkatperi/passport-eventbrite-oauth.png)](http://travis-ci.org/venkatperi/passport-eventbrite-oauth)

## Credits

  - [Venkat Peri](http://github.com/venkatperi)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Venkat Peri<[http://vperi.com/](http://vperi.com/)>
