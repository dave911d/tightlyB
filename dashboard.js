'use strict';
/*eslint-env node, mocha */
/*eslint quotes: [2, "single"], curly: 2, camelcase: 1, no-warning-comments:1 no-underscore-dangle:0*/
//These are for my eslint setup
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var TwitterStrategy = require(''); //TODO setup this
//TODO: research .OAuth2Strategy
var express = require('express');
 //requires express,our HTTP lib
var app = express();
//initiates express
var r = require('rethinkdb');
//our database
var googleConfig = require('./oAuth/configGoogle.js');
//Googles ouath configuration
var rethinkConfig = require('./rethinkConfig/configRethinkDb.js');
//configures rethink
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


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.listen(app.get('port'), function(err){
    if (err) {
          console.log(err.stack);
      }
          console.log('Express is running on http://localhost:' + app.get('port') + '; press Ctrl-c to end');

          //starts the server on specified port(app.get('port'))
          console.log('Have a pat on the back, its working.');
    });
