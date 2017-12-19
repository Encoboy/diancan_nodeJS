var userGroup = function(router,connection,config){
	router.get('/userGroup',function(req,res,next){
		connection.query('select * from elm_user_group',function(error,results,fields){
			var obj = {
				hostname:config.hostname,
				page:parseInt(results.length/5),//这个是总共页面数-1？？
				// 总共的条数
				allNum:results.length
			}
			// 判断是否有pageNum存在。存在就执行第一个计算，不存在就执行else条件。pageNum参数是从list.html传过来的
			if(req.query.pageNum){
				// 从第5x条开始的后面5条信息
				connection.query(`select * from elm_user_grounp limit ${req.query.pageNum*5},5`,function(error,results,fields){
					obj.listArr = results;
					obj.page.Num = req.query.pageNum;
					res.render('user_group/list.html',obj);
				})
			}else{
				// 一开始没有pageNum的存在执行的逻辑
				connection.query(`select * from elm_user_grounp limit 0,5`,function(error,results,fields){
					console.log(results);
					obj.listArr = results;
					// 将pageNum参数传给list.html的页面
					obj.pageNum = 0;
					res.render('user_group/list.html',obj);
				})
			}
		});
	})

	router.get('/addUserGroup',function(req,res,next){
		connection.query('select * from elm_authlist',function(error,results,fields){
			var obj = {
				hostname:config.hostname,
				results:results
			}
			res.render('user_group/addUserGroup',obj);
		});
	});

	router.post('/addUserGroup',function(req,res,next){
		connection.query(`insert into elm_user_grounp (group_name,auth_value) values ('${req.body.group_name}','${req.body.auth_value}');`,function(error,results,fields){
			res.redirect('/admin/userGroup');
		});
	});
}

module.exports = userGroup;