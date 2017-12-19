var express = require('express');
var router = express.Router();
var config = require('../config/config');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.mysqlHost,
  user     : config.username,
  password : config.password,
  database : config.database
});
 
connection.connect(); 

/* GET home page. */
router.get('/', function(req, res, next) {
	
	connection.query('select * from elm_blog',function(error,results,fields){
		console.log(results);
		var obj = {
			hostname:config.hostname,
			results:results
		}
		
		
		res.render('qd_blog/index.html',obj);
	})
	
	
});



/* GET home page. */
router.get('/content', function(req, res, next) {
	
	connection.query(`select * from elm_blog where id=${req.query.id}`,function(error,results,fields){
		console.log(results);
		var obj = {
			hostname:config.hostname,
			results:results
		}
		
		
		res.render('qd_blog/content',obj);
	})
	
	
});



module.exports = router;
