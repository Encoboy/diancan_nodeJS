var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : config.mysqlHost,
  user     : config.username,
  password : config.password,
  database : config.database
});
connection.connect();


router.get('/', function(req, res, next) {
	// 默认路径渲染html需要后缀名。？？
	res.render('blogs/default.html',config);
});

router.get('/shouye',function(req,res,next){
	res.render('blogs/default',config);
});

router.get('/archives',function(req,res,next){
	res.render('blogs/archives',config);
});

router.get('/tags',function(req,res,next){
	res.render('blogs/tags',config);
});

router.get('/about',function(req,res,next){
	res.render('blogs/about',config);
});

router.get('/invite',function(req,res,next){
	res.render('blogs/invite',config);
});
module.exports = router;