var shopManager = function(router,connection,config){
	
	
	//店铺列表页面
router.get('/shopManager', function(req, res, next) {
	connection.query('select * from elm_shoplist',function(error,results,fields){
		var obj = {
			// 要传给html模板中。
			hostname:config.hostname,
			// 总共的页面数取整
			page: parseInt(results.length/5),//这个是总共的页面数-1
			// 所有的栏数据
			allNum:results.length
		}
		// req.query是从html模板中传过来的参数拿到pageNum，当前页。
		if(req.query.pageNum){
			//显示从第5x条开始的后面5条信息
			connection.query(`select * from elm_shoplist limit ${req.query.pageNum*5},5`,function(error,results,fields){
				obj.listArr = results;
				obj.pageNum = req.query.pageNum;
				res.render('shop/shopManager',obj)
			})
			
		}else{
			//从第0条开始的后面5条，一开始就渲染的。
			connection.query(`select * from elm_shoplist limit 0,5`,function(error,results,fields){
				console.log(results);
				obj.listArr = results;
				obj.pageNum = 0;
				res.render('shop/shopManager',obj)
			})
			
		}
		
		
		
	})
	
});




//添加店铺页面
router.get('/addShop',function(req,res,next){
	res.render('shop/addShop',config);
})

router.post('/addShop',function(req,res,next){
	
	connection.query(`insert into elm_shoplist (shopname,shopstar,shopvolumn) values ('${req.body.shopname}','${req.body.shopstar}','${req.body.shopvolumn}');`,function(error,results,fields){
				res.redirect('/admin/shopManager');
	})
	
})
	

//编辑店铺
router.get('/editShopinfo',function(req,res,next){
		connection.query(`select * from elm_shoplist where id='${req.query.id}'`,function(error,results,fields){
			if(results.length){
				var obj={
					hostname:config.hostname,
					results:results,
					id:req.query.id
				}
				res.render('shop/editShop',obj)
			}
			
			
		})
	})
	
	
router.post('/editShopinfo',function(req,res,next){
		connection.query(`update elm_shoplist set shopname='${req.body.shopname}',shopstar='${req.body.shopstar}',shopvolumn='${req.body.shopvolumn}' where id='${req.query.id}'`,function(error,results,fields){
			res.redirect('/admin/shopManager');
		});
})





//菜单列表页面
router.get('/editMenuList', function(req, res, next) {
	
	connection.query(`select * from elm_shoplist where id='${req.query.shopId}'`,function(error,results,fields){
		var shopname = results[0].shopname;
	
	
	connection.query(`select * from elm_menulist where shopId='${req.query.shopId}'`,function(error,results,fields){
		console.log(error);
		var obj = {
			hostname:config.hostname,
			page: parseInt(results.length/5),//这个是总共的页面数-1
			allNum:results.length,
			shopname:shopname,
			shopId:req.query.shopId
			
		}
		
		if(req.query.pageNum){
			//从第5x条开始的后面5条信息
			connection.query(`select * from elm_menulist where shopId='${req.query.shopId}' limit ${req.query.pageNum*5},5`,function(error,results,fields){
				obj.listArr = results;
				obj.pageNum = req.query.pageNum;
				res.render('shop/menuList',obj)
			})
			
		}else{
			//从第0条开始的后面5条
			connection.query(`select * from elm_menulist where shopId='${req.query.shopId}' limit 0,5`,function(error,results,fields){
				//console.log(results);
				obj.listArr = results;
				obj.pageNum = 0;
				res.render('shop/menuList',obj)
			})
			
		}
		
		
		
	})
	
	
	})
	
});//菜单列表页面end




//添加菜单页面
// 上传非文本使用个模块
var multer = require('multer')
// 在public的路径下，upload上传图片
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	    cb(null, 'public/upload')
	},
	filename: function (req, file, cb) {
	  
	    cb(null, new Date().getTime()+file.originalname)
	}
})
var upload = multer({storage:storage});


// 请求渲染菜单页面
router.get('/addMenu',function(req,res,next){
	//console.log(123)
	var obj = {
		hostname:config.hostname,
		shopId:req.query.shopId
	}
	res.render('shop/addMenu',obj);
})
// 菜单插入数据
router.post('/addMenu',upload.single('menuimg'),function(req,res,next){
	connection.query(`insert into elm_menulist (menuname,menubrief,menuprice,menuimg,shopId) values ('${req.body.menuname}','${req.body.menubrief}','${req.body.menuprice}','${req.file.filename}','${req.body.shopId}');`,function(error,results,fields){
				res.redirect(`/admin/editMenuList?shopId=${req.body.shopId}`);
	})
	
})

	
	
	

//修改菜单
router.get('/editMenu',function(req,res,next){
		connection.query(`select * from elm_menuList where id='${req.query.id}'`,function(error,results,fields){
			if(results.length){
				var obj={
					hostname:config.hostname,
					results:results
				}
				//console.log(obj);
				res.render('shop/editMenu',obj)
			}
			
			
		})
	})
	
	
router.post('/editMenu',upload.single('menuimg'),function(req,res,next){
		connection.query(`update elm_menuList set menuname='${req.body.menuname}',menubrief='${req.body.menubrief}',menuprice='${req.body.menuprice}',menuimg='${req.file.filename}' where id='${req.body.id}'`,function(error,results,fields){
			res.redirect(`/admin/editMenuList?shopId=${req.body.shopId}`);
		});
})

	
	
	

}
module.exports = shopManager;