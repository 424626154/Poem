var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');
var utils = require('../utils/utils'); 
/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.send('users');
});


var ResJson = function(){
	this.code;
	this.data;
	this.errmsg ;
}
//登录
router.post('/login',function(req,res,next){
	var phone = req.body.phone; 
	var password = req.body.password;
	userDao.queryUser(phone,function(err,users){
		if(err){
			var resjson = new ResJson();
			resjson.code = 1;
			resjson.errmsg = err.code;
			res.json(resjson)
		}else{
			var length = users.length;
			if(length > 0 ){
				var user = users[0];
				if(user.password == password){
					var resjson = new ResJson();
					resjson.code = 0;
					resjson.data = user;
					res.json(resjson)
				}else{
					var resjson = new ResJson();
					resjson.code = 2;
					resjson.errmsg = '密码错误';
					res.json(resjson)
				}
			}else{
				var resjson = new ResJson();
				resjson.code = 2;
				resjson.errmsg = '用户未注册';
				res.json(resjson)
			}
		}
	})
});

//请求验证码
router.post('/validate',function(req,res,next){
	var phone = req.body.phone; 
	if(!phone){
		var resjson = new ResJson();
		resjson.code = 1;
		resjson.errmsg = '参数错误';
		res.json(resjson)
	}else{
		userDao.queryValidate(phone,function(err,objs){
			if(err){
				var resjson = new ResJson();
				resjson.code = 1;
				resjson.errmsg = err.code;
				res.json(resjson)
			}else{
				var length = objs.length;
				if(length > 0 ){
					var validate = objs[0];
					var current_time = utils.getTime();
					if(current_time - validate.time > 300){
						//重新生成
						var code = utils.getCode();
						userDao.updateValidate(phone,code,current_time,function(err,objs){
							if(err){
								var resjson = new ResJson();
								resjson.code = 1;
								resjson.errmsg = err.code;
								res.json(resjson)
							}else{
								var resjson = new ResJson();
								resjson.code = 0;
								resjson.data = {phone:phone,code:code,time:current_time};
								res.json(resjson)	
								console.log('验证码生成成功 code:'+code)
							}
						})
					}else{
						var resjson = new ResJson();
						resjson.code = 0;
						resjson.data = validate;
						res.json(resjson)	
						console.log('验证码生成成功 code:'+code)
					}
				}else{
					//生成
					var code = utils.getCode();
					var current_time = utils.getTime();
					userDao.addValidate(phone,code,current_time,function(err,objs){
						console.log(err)
						if(err){
							var resjson = new ResJson();
							resjson.code = 1;
							resjson.errmsg = err.code;
							res.json(resjson)
						}else{
							var resjson = new ResJson();
							resjson.code = 0;
							resjson.data = {phone:phone,code:code,time:current_time};
							res.json(resjson)	
							console.log('验证码生成成功 code:'+code)
						}
					})
				}
			}
		})		
	}

});
//注册
router.post('/register',function(req,res,next){
	var phone = req.body.phone; 
	var password = req.body.password;
	var code = req.body.code;
	var userid = utils.getUserid(phone)
	userDao.queryValidate(phone,function(err,objs){
		if(err){
			var resjson = new ResJson();
			resjson.code = 1;
			resjson.errmsg = err.code;
			res.json(resjson)
		}else{
			var length = objs.length;
			// console.log(objs)
			if(length > 0 ){
				var validate = objs[0];
				// console.log('validate.phone:'+validate.phone)
				if(validate.phone == phone && validate.code == code){
						userDao.addUser(userid,phone,password,function(err,objs){
							if(err){
								var resjson = new ResJson();
								resjson.code = 1;
								resjson.errmsg = err.code;
								res.json(resjson)
							}else{
								var resjson = new ResJson();
								resjson.code = 0;
								resjson.data = {phone:phone,password:password,userid:userid};
								res.json(resjson)
							}
						});
				}else{
					var resjson = new ResJson();
					resjson.code = 1;
					resjson.errmsg = '验证码错误';
					res.json(resjson)
				}
			}else{
				var resjson = new ResJson();
				resjson.code = 1;
				resjson.errmsg = '验证码错误';
				res.json(resjson)
			}
		}
	});
})


module.exports = router;