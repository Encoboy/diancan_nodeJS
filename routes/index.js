var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	
	
	console.log(req.cookies)
	if (req.cookies.isVisit) {
        //console.log(req.cookies);
        res.send("你好呀");
    } else {
        res.cookie('isVisit', 1, {maxAge: 60 * 1000});
        res.send("你好呀");
    }
	
	
});



module.exports = router;
