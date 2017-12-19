var express = require('express');
var router = express.Router();


/* GET home page. */

router.get('/', function(req, res, next) {

	
	console.log(req.cookies)
	

	
	if (req.cookies.isVisit) {
    
    //console.log(req.cookies);
     
   var num = req.cookies.numPage;
      
  num++;
       
 res.cookie('numPage',num,{maxAge:25*60*60*1000});
   
     res.send("欢迎再次访问,你已访问本页面"+num+"次");
  
  } else {
     
   res.cookie('isVisit', 1, {maxAge: 60 * 1000});
     
   res.cookie('numPage',1,{maxAge:25*60*60*1000});
   
     res.send("欢迎第一次访问");
    }
	

	//var arr = ['<span>苹果</span>','<span>雪梨</span>','<span>香蕉</span>']
	
//res.render('index', { title: '这是首页',arrList:arr,switchWord:"mode2",ifMod:false});
	

	//调用渲染模板的方式，res.render,render有两个参数，第一个是模板的路径，第二个是传入到模板的数据。

	
});



module.exports = router;
