'use strict';
/*eslint-env node, mocha */
/*eslint quotes: [2, "single"], curly: 2, camelcase: 1*/
module.exports = function (app) {

  //the main page
  app.get('/', function(req, res){
    res.render('index');

  });

//the 404 page
  app.use(function(req, res){
    res.status(404);
    res.render('404');
  });

//the 500 page
app.use(function(err, req, res){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


};
