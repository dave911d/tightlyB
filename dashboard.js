'use strict';
/*eslint-env node, mocha */
/*eslint quotes: [2, "single"], curly: 2, camelcase: 1, no-warning-comments:1 no-underscore-dangle:0*/
//These are for my eslint setup
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

//Google uses oAuth 2 while twitter uses oAuth1
//TODO: research .OAuth2Strategy
var express = require('express');

//requires express,our HTTP lib
var app = express();

//initiates express
var r = require('rethinkdb');

//our database
var googleConfig = require('./oAuth/configGoogle.js');
var twitterConfig = require('./oAuth/configTwitter.js');

//Googles ouath configuration
var rethinkConfig = require('./rethinkConfig/configRethinkDb.js');

//configures rethink
var session = require('express-session');

//required for twitter oAuth
require('./errorHandling/uncaughtException.js')(app);

//run if uncaughtException
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
app.engine('jade', require('jade').__express);

//sets jade,need this to display to browser
app.set('view engine', 'jade');
passport.initialize();
passport.session();
app.set('port', process.env.PORT || 3002);

//Designates port to run on
require('./oAuth/googleRoutes.js')(app);
require('./oAuth/twitterRoutes.js')(app);
//google oauth routes
require('./routes/routes.js')(app);

//sets locations for routes
//this needs to be here so it doesn't mess up passport, see:
//https://github.com/jaredhanson/passport/issues/51

r.connect(
    { host: rethinkConfig.ipRethink(),
        port: rethinkConfig.portRethink()},
    function(err, conn) {
        if(err){
            console.log(err.stack);
        }
        if (conn){
            console.log('Rethink is working :D');
        }
    });

//This is used for the configuration of passport in regards to Google.
  passport.use(new GoogleStrategy({
        clientID: googleConfig.idGoogle(),
        clientSecret: googleConfig.secretGoogle(),
        callbackURL: 'http://localhost:3002/auth/google/callback'
      },
      function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
      }
    ));

//This is used for the configuration of passport in regards to Twitter

//https://github.com/expressjs/session?_ga=1.35093665.1018356832.1426382569
//TODO:configure express sessions,useful and required for twitter oAuth


passport.use(new TwitterStrategy({
    consumerKey: twitterConfig.idTwitter(),
    consumerSecret: twitterConfig.secretTwitter(),
    callbackURL: 'localhost:3002/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate( function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
/*app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
app.use(function(req, res, next) {
  var sess = req.session;
});
//TODO: integrate sessions into Program
*/
app.listen(app.get('port'), function(err){
    if (err) {
          console.log(err.stack);
      }
          console.log('Express is running on http://localhost:' + app.get('port') + '; press Ctrl-c to end');

          //starts the server on specified port(app.get('port'))
          console.log('Have a pat on the back, its working.');
    });
