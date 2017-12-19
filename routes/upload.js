var express = require('express');
var router = express.Router();
//文件上传的中间件
var multer = require('multer')


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		//console.log(__dirname);
	    cb(null, 'public/')
	},
	filename: function (req, file, cb) {
	  	//console.log(file.originalname)
	    cb(null, file.originalname)
	}
})
var upload = multer({storage:storage});

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('upload')
	res.render('upload/index');
	next();
});


router.post('/',upload.single('uploadfile'),function(req,res,next){
	console.log(req.body);
	console.log(req.file);
	res.render('upload/uploadSuccess',req.file);
	next();
})





module.exports = router;
