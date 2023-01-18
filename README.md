# passport-onshape

[![Build](https://travis-ci.org/onshape/passport-onshape.svg?branch=master)](https://travis-ci.org/onshape/passport-onshape)


Onshape authentication strategy for [Passport](http://passportjs.org/).

This module lets you authenticate with Onshape using OAuth 2.0 in your
Node.js applications.
By plugging into Passport, OAuth 2.0 authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-onshape

## Usage

#### Configure Strategy

The Onshape authentication strategy authenticates users using a third-party
account and OAuth 2.0 tokens.

- The Onshape OAuth application client identifer and secret
are specified as options.
- The authentication strategy requires a `verify` callback,
which receives an access token and profile, and calls `done` providing a user.

    passport.use(new OnshapeStrategy({
      clientID: oauth_clientid, //the client ID string that you got when registering the app with Onshape
      clientSecret: oauth_clent_secret, //The secret string
      callbackURL: oauth_callback, //The Oauth Callback URL ex: /oauthRedirect
      authorizationURL: oauthurl, //https://oauth.onshape.com/oauth/authorize
      tokenURL: oauthtokenurl, //https://oauth.onshape.com/oauth/token
      userProfileURL: userprofileurl //https://cad.onshape.com/api/users/sessioninfo
    },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ exampleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'oauth2'` strategy, to
authenticate requests.

Authentication options include:
- `failureRedirect` - string; A  redirect destination if the grant is denied or revoked
- `failureMessage` - boolean; Whether or not to add an informative message to the session
about why authentication failed which can then be displayed to the user
- `passReqToCallback` - boolean; Whether or not to pass the request object to the
`verify` callback as the first parameter. This can be useful for accessing params
passed through the Oauth flow, such as `state`

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/example',
      passport.authenticate('onshape'));

    app.get('/auth/example/callback',
      passport.authenticate('onshape', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Related Modules

- [passport-oauth2](https://github.com/jaredhanson/passport-oauth2) — OAuth 2.0 authentication strategy
- [OAuth2orize](https://github.com/jaredhanson/oauth2orize) — OAuth 2.0 authorization server toolkit

## Tests

    $ npm install
    $ npm test

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) Onshape Inc <[http://onshape.com/](http://onshape.com/)>
