var express = require('express');
var router = express.Router();
var feedbackDao = require('../dao/feedbackDao');
var logger = require('../utils/log4jsutil').logger(__dirname+'/feedback.js');

router.get('/', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	var op = req.query.op;
	if(op == 'del'){
		var id = req.query.id;
		if(id){
			feedbackDao.delFeedback(id,function(err,result){
				if(err){
					res.render('feedback', { user: user,err:err,objs:[]});
				}else{
					res.redirect('/feedback');
					
				}
			})
		}
		return 
	}
	feedbackDao.queryFeedbacks(function(err,result){
		if(err){
		 	res.render('feedback', { user: user,err:err,objs:[]});
		}else{
		   res.render('feedback', { user: user,err:'',objs:result});
		}
	});
});


router.post('/send',function(req, res, next){
	var body = req.body;
	var feedback = body.feedback||'';
	var userid = body.userid||'';
	var contact = body.contact||'';
	if(!feedback){
		res.json({code:1,errmsg:'参数错误'});
	}else{
		feedbackDao.addFeedback(feedback,userid,contact,function(err,result){
			if(err){
				res.json({code:1,errmsg:err});
			}else{
				res.json({code:0,data:result});
			}
		});
	}
});

module.exports = router;