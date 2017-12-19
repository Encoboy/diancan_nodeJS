var express = require('express');
var router = express.Router();
var config = require('../config/config')

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.mysqlHost,
  user     : config.username,
  password : config.password,
  database : config.database
});
 
connection.connect();

/* GET home page. */
// res 表示的是服务器响应ServerResponse是一个对像，里面有许多的属性。req是从html模板引擎获取数据。 
router.get('/', function(req, res, next) {
	// 从数据库中得到的数据结果放在results中。
	connection.query('select * from elm_shoplist',function(error,results,fields){
		console.log(results);
		res.json(results);
		console.log(req);
		console.log(res);
	})
	
});


router.get('/foods', function(req, res, next) {
	
	connection.query('select * from elm_menulist',function(error,results,fields){
		console.log(results);
		res.json(results);
		console.log(req);
		console.log(res);
	})
	
});




module.exports = router;