var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'elm'
});
 
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.query.info);
	connection.query(req.query.info,function(error,results,fields){
		/*console.log(error);
		console.log(results);
		console.log(fields);*/
		var obj = {error,results,fields}
		res.json(obj);
		
		
	})
	
	
    
   
	
});



module.exports = router;
