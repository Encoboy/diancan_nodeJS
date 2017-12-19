var bodyParser = require('body-parser');
//加载bodyParser,用于 解析post提交的数据
var express = require('express');
var router = express.Router();

//生成解析的中间函数
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res, next) {
	
	res.render('post',{first_name:null,last_name:null});
	
});

router.post('/process_post',urlencodedParser, function(req, res, next) {
	console.log('post1')
	var response = {
       "first_name":req.body.hhh,
       "last_name":req.body.last_name
   	};
    console.log(response);
	res.render('post',response);
	
});



module.exports = router;