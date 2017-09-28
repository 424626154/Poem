var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');
var utils = require('../utils/utils'); 
/* GET user listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.send('user');
});


var ResJson = function(){
	this.code;
	this.data;
	this.errmsg ;
}
/**
 * 返回错误
 */
function resError(res,err){
	console.error(err)
	var resjson = new ResJson();
	resjson.code = 1;
	resjson.errmsg = err;
	res.json(resjson)
}
/**
 * 返回成功
 */
function resSuccess(res,data){
	var resjson = new ResJson();
	resjson.code = 0;
	resjson.data = data;
	console.log('---res succes--- data:',data)
	res.json(resjson)
}

function logReq(req){
	console.log('url:/user'+req.originalUrl+' body:'+JSON.stringify(req.body));
}

/**
 * 登录
 */
router.post('/login',function(req,res,next){
	logReq(req);
	var phone = req.body.phone; 
	var password = req.body.password;
	userDao.queryUser(phone,function(err,users){
		if(err){
			resError(res,err);
		}else{
			var length = users.length;
			if(length > 0 ){
				var user = users[0];
				if(user.password == password){
					resSuccess(res,user);
				}else{
					resError(res,'密码错误');
				}
			}else{
				resError(res,'用户未注册');
			}
		}
	})
});

/**
 * 请求验证码
 */
router.post('/validate',function(req,res,next){
	logReq(req);
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
/**
 * 注册
 */
router.post('/register',function(req,res,next){
	logReq(req);
	var phone = req.body.phone; 
	var password = req.body.password;
	var code = req.body.code;
	var userid = utils.getUserid(phone)
	if(!phone||!password||!code){
		resError(res,err);
	}else{
		userDao.queryUser(phone,function(err,result){
			if(err){
				resError(res,err)
			}else{
				if(result.length >0){
					resError(res,'用户已经注册')
				}else{
						userDao.queryValidate(phone,function(err,objs){
							if(err){
								resError(res,err);
							}else{
								var length = objs.length;
								if(length > 0 ){
									var validate = objs[0];
									if(validate.phone == phone && validate.code == code){
											userDao.addUser(userid,phone,password,function(err,result){
												if(err){
													resError(res,err);
												}else{
													var user = result.length > 0 ?result[0]:{};
													resSuccess(res,user);
												}
											});
									}else{
										resError(res,'验证码错误');
									}
								}else{
									resError(res,'验证码错误');
								}
							}
						});
				}
			}
		});
	}
})
/**
 * 修改用户信息
 */
router.post('/upinfo',function(req,res,next){
	logReq(req);
	var userid = req.body.userid;
	var head = req.body.head||'';
	var pseudonym = req.body.pseudonym||'';
	if(!userid){
		resError(res,'参数错误')
		return;
	}
	userDao.updateUserInfo(userid,head,pseudonym,function(err,result){
		if(err){
			resError(res,err);
		}else{
			var user = {};
			if(result.length > 0){
				user = result[0];
			}
			resSuccess(res,user);
		}
	})
});

/**
 * 获取用户信息
 */
router.post('/info',function(req,res,next){
	logReq(req);
	var userid = req.body.userid;
	if(!userid){
		resError(res,'参数错误')
		return;
	}
	userDao.queryUserInfo(userid,function(err,result){
		if(err){
			resError(res,err);
		}else{
			resSuccess(res,result);
		}
	})
});
/**
 * 关注
 * @param op 1 关注 0 取消关注
 */
router.post('/follow',function(req,res,next){
	logReq(req);
	var userid = req.body.userid;
	var fansid = req.body.fansid;
	var op = req.body.op;
	if(!userid||!fansid){
		resError(res,'参数错误');
	}else{
		userDao.upFollow(userid,fansid,op,function(err,result){
			if(err){
				resError(res,err);
			}else{
				resSuccess(res,result);
			}
		});
	}
});

router.post('/getfollows',function(req,res,next){
	logReq(req);
	var userid = req.body.userid;
	if(!userid){
		resError(res,'参数错误');
	}else{
		userDao.queryFollow(userid,function(err,result){
			if(err){
				resError(res,err);
			}else{
				resSuccess(res,result);
			}
		});
	}
});
/**
 * 关注列表
 * @param  0我的关注1关注我的
 */
router.post('/follows',function(req,res,next){
	logReq(req);
	var userid = req.body.userid;
	var type = req.body.type;
	if(!userid){
		resError(res,'参数错误');
	}else{
		userDao.queryFollowType(userid,type,function(err,result){
			if(err){
				resError(res,err);
			}else{
				resSuccess(res,result);
			}
		});
	}
});

module.exports = router;