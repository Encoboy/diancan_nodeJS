var express = require('express');
var router = express.Router();//初始化一个路由模块




// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
  console.log("shop路由中间件");
  next();
});

router.use('/user/:id', function(req, res, next) {
  console.log('user/Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('user/Request Type:', req.method);
  next();
},function(req,res,next){
	if(req.params.id==123){
		//res.send("这是123的页面");
	  res.render('index.html',{title:'Hello--->123页面'});
}
	next();
});


/* GET users listing. */
router.get('/', function(req, res, next) {
	//res.send("这是第一个函数");
  //req.query.name = 'abc'
  next();
},function(req,res,next){
	console.log(req.cookies);
	if(req.cookies.isVisit){
		res.cookie('isVisit',1,{maxAge:0});
		res.send("已经登录");
			
	}else{
		console.log('wdl');
		res.send("未登录")
	}

});

router.get('/list',function(req,res,next){
	var obj = {
		name:"列表页",
		arr:['苹果','雪梨','香蕉']
	}
	//res.send('shop下面的列表页')
	
	res.json(obj);
	
})

module.exports = router;
