var express = require('express');
// 如何解析express.Router()方法？？express路由？？
// express.Router类创建模块化、可挂载的路由句柄。
// Router实列是一个完整的中间件和路由系统，因此常称其为一个"mini-app"
var router = express.Router();
var config = require('../config/config.js');


var editManager = require('./admin/editManager.js');
var deleteManager = require('./admin/deleteManager.js');
var shopManager = require('./shop/shopManager.js');
// 博客
var blogManager = require('./blog/blogManager.js');

// 权限设置
var userGroup = require('./userGroup/userGroup.js')
var authManager = require('../config/authManager.js');
var connection = require('../config/connectMysql.js')
// 请求的数据库模块
// var mysql   = require('mysql');

// 通过mysql.createConnection方法连接数据库。
// var connection = mysql.createConnection({
//   host     : config.mysqlHost, 
//   user     : config.username,
//   password : config.password,
//   database : config.database
// });
// connection.connect();




/* GET home page. */
// '/' 表示默认路径,表示的是主页面。
//检查用户是否已经登录,req.session.sign的含义？？(在登录界面中当判断req.session.sign=true)
// 如果存在，就渲染页面左导航页面index.html.
// 如果没有就重定向login.html登录页面
// 注：重定向后的是post和get请求的路径
// 渲染render是渲染那个页面html的路径。
// router.get('/', function(req, res, next) {
// 	// 判断req.session.sign表示如果登录成功了就进入index页面，没有登录就重定向login登录页面
// 	if (req.session.sign) {
//         res.render('admin/index',config)    
//     } else {
//     	res.redirect('/admin/login')
//     }
// });


// '/'='admin'路径，get请求执行两个函数，要想将函数执行完，需要中间函数的第三个参数的next参数的next()函数。才可以继续跳到下一个函数。
// 将1到10的数组作为参数传到函数authManager中.
router.get('/',authManager([1,2,3,4,5,6,7,8,9,10]),function(req,res,next){
	// 检查用户是否已经登录,如果登录，就将值作为参数传到index.html页面上。如果没有该用户就重定向到路径为login的get请求渲染login页面。
	if(req.session.sign){
		var obj = {
			hostname:config.hostname,
			title:config.title,
			// 可以从上一个中间件函数中传过来的req参数中获取到authValue的值。
			authValue:req.session.authValue
		}
		res.render('admin/index',obj);
	}else{
		res.redirect('/admin/login');
	}
});





// 登录成功后的主页面？？？如何直接渲染？？是谁发送了get请求I？？
// /index_v1.html 表示在admin的路径下的index_v1.html页面
// 还是不理解什么时候渲染的？？
// 直接请求admin下的index_v1.html页面，渲染出来。
router.get('/index_v1.html', function(req, res, next) {
	res.render('admin/index_v1.html',config)
});



//管理员列表页面
// /manager.html 表示在admin 文件夹下的manager.html 文件。
router.get('/manager.html', function(req, res, next) {
	connection.query('select * from elm_manager',function(error,results,fields){
		console.log("这是results的个数丫丫"+results.length);
		var obj = {
			hostname:config.hostname,
			page: parseInt(results.length/5)//这个是总共的页面数-1
		}
		console.log("这是总页面数page"+obj.page);
		if(req.query.pageNum){
			//从第5x条开始的后面5条信息
			connection.query(`select * from elm_manager limit ${req.query.pageNum*5},5`,function(error,results,fields){
				obj.listArr = results;
				console.log("这是listArr"+obj.listArr);
				obj.pageNum = req.query.pageNum;
				console.log("这是当前的页数吗pageNum？"+obj.pageNum);
				res.render('admin/manager.html',obj)
			})
			
		}else{
			//从第0条开始的后面5条
			connection.query(`select * from elm_manager limit 0,5`,function(error,results,fields){
				console.log(results);
				obj.listArr = results;
				obj.pageNum = 0;
				console.log("这是当前的页数吗？？？"+obj.pageNum);
				res.render('admin/manager.html',obj)
			})
			
		}
		
		
		
	})
	
	
	
	
	
});




//管理员添加页面
router.get('/addManager',function(req,res,next){
	res.render('admin/addManager.html',config);
})

router.post('/addManager',function(req,res,next){
	connection.query(`select * from elm_manager where username='${req.body.username}'`,function(error,results,fields){
		console.log(results);
		if(!results.length){
			connection.query(`insert into elm_manager (username,password) values ('${req.body.username}','${req.body.password}');`,function(error,results,fields){
				res.redirect('/admin/manager.html');
			})
			
			
		}else{
			res.send('有重复的用户名');
		}
	})
	
	
	
	
})



// 修改用户
editManager(router,connection,config);
// 用户删除
deleteManager(router,connection,config);

// 店铺管理
shopManager(router,connection,config);

//博客管理
blogManager(router,connection,config);
// 权限
userGroup(router,connection,config);



// 登录页面
// 为什么输入admin.js 的路径直接可以请求到login路径个get请求，渲染登录页面？？
// /login 表示admin路径下的login.html 文件，所以a标签发送http的get请求找到该路径，直接渲染出login文件夹下的login.html文件。
router.get('/login', function(req, res, next) {
	res.render('login/login',config);
});
// 在login.html的put输入密码和用户名，通过表单form(methd=post请求)发送请求，通过action="<%=hostname%>admin/login"%>
// 表示寻找hostname下的admin.js的路径是login的post请求
// (解析<%=hostname%>，项目用的是ejs的视图层模板，在<%= %>中可以解析js代码)
// 找到相对应的post请求后，通过connection.query()方法执行数据库语句。select * from elm_manager where username XX;
// 语句表示在elm_manager的数据表里找寻所有的数据，在所有的数据中寻找到唯一的username XX;
// (注：` ...` es6的模板字符串，变量在${}中进行js解析。req.body一定是post请求，req.body存有input传过来的数据。)
// 在数据库中找到唯一的username放置在参数results中，
// if判断results有值存在(results.length),如果存在，再判断输入的密码是否和查询到的数据库里的密码相对应。(results是一个数组)
// 如果判断密码相匹配，使true赋值给req.seesion.sign,表示reqf.session.sign的存在，将input输入的密码赋值给req.session.username;
// 然后重定向admin.js?????  登录后重定向路径admin，或许就是地址栏中的hash值一直都是admin的原因吧。？？
// 如果results中没有值，就渲染render页面login.html
router.post('/login',function(req,res,next){
	connection.query(`select * from elm_manager where username='${req.body.username}'`,function(error,results,fields){
		if(results.length){
			if(results[0].password==req.body.password){
				
				req.session.sign = true;
				req.session.username = req.body.username;
				// 登录后重定向路径admin，或许就是地址栏中的hash值一直都是admin的原因吧。？？
				res.redirect('/admin');
			}
		}else{

			res.render('login/login',config);
		}
	})
	
})


// 通过路由传给app.js

module.exports = router;
