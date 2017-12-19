var blogManager = function(router,connection,config){
	
	
//博客列表页面
router.get('/blogManager', function(req, res, next) {
	
	connection.query('select * from elm_blog',function(error,results,fields){
		var obj = {
			hostname:config.hostname,
			page: parseInt(results.length/5),//这个是总共的页面数-1
			allNum:results.length
		}
		
		if(req.query.pageNum){
			//从第5x条开始的后面5条信息
			connection.query(`select * from elm_blog limit ${req.query.pageNum*5},5`,function(error,results,fields){
				obj.listArr = results;
				obj.pageNum = req.query.pageNum;
				res.render('blog/blogManager.html',obj)
			})
			
		}else{
			//从第0条开始的后面5条
			connection.query(`select * from elm_blog limit 0,5`,function(error,results,fields){
				
				obj.listArr = results;
				obj.pageNum = 0;
				res.render('blog/blogManager.html',obj)
			})
			
		}
		
		
		
	})

});




//管理员添加页面
router.get('/addBlog',function(req,res,next){
	res.render('blog/addBlog',config);
})

router.post('/addBlog',function(req,res,next){
	
	connection.query(`insert into elm_blog (title,brief,tag,anthorname,time,content) values ('${req.body.title}','${req.body.brief}','${req.body.tag}','${req.body.anthorname}','${new Date().getTime()}','${req.body.content}');`,function(error,results,fields){
		console.log(error);
		res.redirect('/admin/blogManager');
	})
			
	

})	
	
	

	
//编辑博客	
	router.get('/editBlog',function(req,res,next){
		connection.query(`select * from elm_blog where id='${req.query.id}'`,function(error,results,fields){
			if(results.length){
				var obj={
					hostname:config.hostname,
					results:results
				}
				res.render('blog/editBlog',obj)
			}
			
			
		})
	})
	
	
	router.post('/editBlog',function(req,res,next){
		connection.query(`update elm_blog set title='${req.body.title}',brief='${req.body.brief}',tag='${req.body.tag}',anthorname='${req.body.anthorname}',content='${req.body.content}' where id='${req.body.id}'`,function(error,results,fields){
			console.log(error);
			res.redirect('/admin/blogManager');
		});
	})

}
module.exports = blogManager;