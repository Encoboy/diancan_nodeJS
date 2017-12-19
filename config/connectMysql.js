var config = require('./config.js');

var mysql = require('mysql');
var connection = mysql.createConnection({
	host:config.mysqlHost,
	user:config.username,
	password:config.password,
	database:config.database
});

connection.connect();


module.exports = connection;