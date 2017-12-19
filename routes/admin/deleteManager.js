var deleteManager = function(router,connection,config){
    router.get('/manager',function(req,res,next){
        connection.query(`delete from elm_manager where id='${req.query.id}'`,function(error,results,fields){
            
            console.log('我的'+error);
            console.log('它的'+results);
           
            // 重定向刷新
            res.redirect('/admin/manager.html');
        });
    });
}

module.exports = deleteManager;