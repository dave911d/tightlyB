#TighltlyB
TightlyB- communities of two hundred together.
To run simply:
1.cd to the directory
2.run npm install (possibly as sudo or administrator if problems arise)
3.launch your rethinkdb server
4.define the port and IP of said redis server in your rethingConfig/configRethinkDb.js file.
5.run node dashboard.js

you also need to create a file in the oAuth folder called configGoogle.js that contains :
var exports = module.exports = {};

exports.idGoogle = function() {
return 'XXXXXXXXXXX';
}
exports.secretGoogle = function() {
return 'YYYYYYYYYY';
}

where X is your google id and y is your google secret.
