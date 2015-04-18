'use strict';
/*eslint-env node, mocha */
/*eslint quotes: [2, "single"], curly: 2, camelcase: 1, no-warning-comments:1 no-underscore-dangle:0*/
//These are for my eslint setup
module.exports = function (app) {

var passport = require('passport');

app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/badLogin' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
};
//TODO check if failureRedirect is called if a failureRedirect happens
