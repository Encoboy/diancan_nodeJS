var connection = require('./connectMysql.js');
var config = require('./config.js');

var authManager = function(auth_arr){
	return function(req,res,next){
		console.log(req.session.username)
		// req.session.username 存在，表示有用户登录。
		//用户界面用if(req.session.user)来判断是否登入
		if(req.session.username){
			console.log('123456');
			// 通过用户登录的名字去用户表中去寻找设置的userGroupId，可以设置多个，然后匹配给权限表中唯一的id，就可以得到该用户的权限是什么。
			connection.query(`select * from elm_user_group where id=(select userGroupId from elm_manager where username='${req.session.username}')`,function(error,results,fields){
				// results {id：1, group_name:'超级用户',auth_value:'1,2,3,4,5,6,....'}
				
				// 查找到的结果存放在results中,results是一个数组对象，results.length表示查找到结果，有设置这个用户的权限存在。
				if(results.length){
					// 权限值保存在req.session.authValue;是一个字符串
					//创建一个数据结构以存储用户的登录信息，这个结构也叫做session。
					req.session.authValue = results[0].auth_value;
					// 设置一个条件，一般都是给if判断语句用的
					var isAuth = false;
					// auth_arr 参数表示的是什么 表示的是auth_value中的数字，是一个数组。这个参数是从admin执行的get请求在这个函数中传过来的参数
					for(var i=0;i<auth_arr.length;i++){
						console.log(results[0].auth_value.indexOf(auth_arr[i]));
						// indexOf字符串字符的查询，返回的是查询到的字符，找不到返回-1;
						if(results[0].auth_value.indexOf(auth_arr[i])!=-1){
							isAuth = true;
						}
					}
					// 判断isAuth如果是false，表示在for循环中没有匹配到相应的权限。则！isAuth是true，渲染出alert.html页面
					// 判断isAuth如果是true，表示匹配到了权限，则！isAuth是false，则执行next()函数。跳到下一个中间函数执行
					if(!isAuth){
						var obj = {
							hostname:config.hostname,
							info:'未有权限访问，请联系管理'
						}
						// 当时默认路径的渲染，要带后缀名.html
						res.render('alert.html',obj);
					}else{
						// 简单理解就是跳到同一个请求中这个函数的下一个中间件函数。
						// 并且将该函数的参数req，res，next经过函数执行过后的参数，这三个参数作为参数传给下一个函数。
						next();
					}
					// 没有这个结果results {id：1, group_name:'超级用户',auth_value:'1,2,3,4,5,6,....'};就是用户没有权限
				}else{
					var obj = {
						hostname:config.hostname,
						info:'未定义权限，请联系管理员'
					}
					res.render('alert.html',obj);
				}
			});
			// 没有这个用户，或者密码错误，就是没有登入，重定向login这个路径的get请求。渲染login.html这个页面。
		}else{
			res.redirect('/admin/login');
		}
	}
}


module.exports = authManager;