var express = require('express');
var router = express.Router();
var ru = require('../utils/routersutil');
var httputil = require('../utils/httputil');


router.get('/', function(req, res, next) {
	ru.logReq(req);
    res.send('admin');
});

router.post('/user', function(req, res, next) {
	ru.logReq(req);
	var body = req.body;
	httputil.requstPSPost('/user/query',body,function(err,result){
		if(err){
			ru.resError(res,err)
		}else{
			ru.resSuccess(res,result);
		}
	});
});


router.post('/pushall', function(req, res, next) {
	ru.logReq(req);
	var body = req.body;
	httputil.requstPSPost('/message/pushall',body,function(err,result){
		if(err){
			ru.resError(res,err)
		}else{
			ru.resSuccess(res,result);
		}
	});
});

router.post('/pushuser', function(req, res, next) {
	ru.logReq(req);
	var body = req.body;
	httputil.requstPSPost('/message/pushuser',body,function(err,result){
		if(err){
			ru.resError(res,err.message)
		}else{
			ru.resSuccess(res,result);
		}
	});
});

module.exports = router;