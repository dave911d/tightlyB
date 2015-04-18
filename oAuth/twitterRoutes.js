'use strict';
/*eslint-env node, mocha */
/*eslint quotes: [2, "single"], curly: 2, camelcase: 1, no-warning-comments:1 no-underscore-dangle:0*/
//These are for my eslint setup

module.exports = function (app) {
var passport = require('passport');
    app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.

    app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/',
    failureRedirect: '/badLogin' }));
  };
//TODO check if failureRedirect is called if a failureRedirect happens
