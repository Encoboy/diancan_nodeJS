var editManager = function(router,connection,config){
	// get请求editManager页面，点中谁就选择谁，然后将editManager页面渲染出来。
	router.get('/editManager',function(req,res,next){
		connection.query(`select * from elm_manager where id='${req.query.id}'`,function(error,results,fields){
			if(results.length){
				var obj={
					hostname:config.hostname,
					results:results
				}
				res.render('admin/editManager',obj)
			}
			
			
		})
	})
	
	// post请求editManager页面，更改信息后，重定向manager页面
	router.post('/editManager',function(req,res,next){
		
		connection.query(`update elm_manager set password='${req.body.password}' where username='${req.body.username}'`,function(error,results,fields){
			res.redirect('/admin/manager');
		});

	})

}
module.exports = editManager;