var express = require('express');
var router = express.Router();
var smsDao = require('../dao/smsDao')
var logger = require('../utils/log4jsutil').logger(__dirname+'/sms.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var httputil = require('../utils/httputil');

router.get('/', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	res.render('sms', { user: user});
});

router.get('/register', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	smsDao.querySms(1,function(err,result){
		if(err){
			res.render('sms_register', { user: user,err:err});
		}else{
			let temp_id = 0;
			if(result.length > 0){
				temp_id = result[0].temp_id;
			}
			console.log('temp_id:'+temp_id)
			res.render('sms_register', { user: user,err:'',temp_id:temp_id});
		}
	})
});
router.post('/register',multipartMiddleware, function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	console.log(req.body)
	// 查询模板 API
	
});

module.exports = router;