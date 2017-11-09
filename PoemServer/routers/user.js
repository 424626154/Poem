/**
 * 用户服务器
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var userDao = require('../dao/userDao');
var utils = require('../utils/utils'); 
var httputil = require('../utils/httputil'); 
var ru = require('../utils/routersutil');
var logger = require('../utils/log4jsutil').logger(__dirname+'/user.js');
var {FollowExtend,Message,MessageType} = require('../utils/module');
var jpush = require('../push/jpush');
var conf_validate = require('../conf/config').server.validate;
var conf_sms = require('../conf/config').server.sms;
console.log(conf_validate)
/* GET user listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.send('user');
});

function sendCodeSms(type,phone,code,callback){
	logger.info('---发送短信验证码 type:'+type+' phone:'+phone+' code:'+code);
	if(conf_sms == 'jpush'){
		jpush.sendCodeSms(phone,code,function(err,result){
				if(!err){
					logger.info(err)
					userDao.updateJPushSms(phone,type,result.msg_id,function(err,result){

					})
				}else{
					logger.error(err)
				}
				callback(err,result)
		});
		// jpush.sendTemplates(callback);
	}else if(conf_sms == 'ali'){
		httputil.sendAliSms(phone,code,function(err,result){
				if(!err){
					logger.info(err)
					userDao.updateAliSms(phone,type,result.RequestId,result.BizId,function(err,result){

					})
				}else{
					logger.error(err)
				}
				callback(err,result)
		})
	}else{
		callback(conf_sms,'')
	}
}

/**
 * 登录
 */
router.post('/login',function(req,res,next){
	ru.logReq(req);
	var phone = req.body.phone; 
	var password = req.body.password;
	var os = req.body.os;
	userDao.queryUser(phone,function(err,users){
		if(err){
			ru.resError(res,err);
		}else{
			var length = users.length;
			if(length > 0 ){
				var user = users[0];
				if(user.password == password){
					if(user.os != os){
						userDao.updateUserOs(user.userid,os,function(err,result){

						})
					}
					ru.resSuccess(res,user);
				}else{
					ru.resError(res,'密码错误');
				}
			}else{
				ru.resError(res,'用户未注册');
			}
		}
	})
});

/**
 * 请求验证码
 */
router.post('/validate',function(req,res,next){
	ru.logReq(req);
	var phone = req.body.phone;
	var type =  req.body.type;
	if(!phone||!type){
		ru.resError(res,'参数错误');
	}else if(!utils.checkPhone(phone)){
		ru.resError(res,'请填写正确的手机号格式');
	}else{
		var max_time = 60;//秒级
		userDao.queryValidate(phone,type,function(err,objs){
			if(err){
				ru.resError(res,err.code);
			}else{
				logger.debug('验证码已经存在')
				var length = objs.length;
				if(length > 0 ){
					var validate = objs[0];
					var current_time = utils.getTime();
					var diff_time =  current_time - validate.time
					if( diff_time >= max_time){
						//重新生成
						logger.debug('重新生成验证码')
						var code = utils.getCode();
						userDao.updateValidate(phone,type,code,current_time,function(err,objs){
							if(err){
								ru.resError(res,err.code);
							}else{
								var data = {phone:phone,type:type,code:code,time:max_time,max:max_time};
								ru.resSuccess(res,data)
								logger.debug('------验证码为:'+code+'------')
								sendCodeSms(type,phone,code,function(err,sms){
							
								})
							}
						})
					}else{
						validate.time = max_time-diff_time;
						validate.max = max_time,
						logger.debug('------验证码为:'+validate.code+'------')
						ru.resSuccess(res,validate);
					}
				}else{
					logger.debug('初始生成验证码')
					//生成
					var code = utils.getCode();
					var current_time = utils.getTime();
					userDao.addValidate(phone,type,code,current_time,function(err,objs){
						logger.debug(err)
						if(err){
							ru.resError(res,err.code);
						}else{
							logger.debug('初始生成验证码/ali/sendcode3')
							var validate ={
								phone:phone,
								code:code,
								time:max_time,
								max:max_time,
								type:type,
							}
							console.log('------验证码为:'+code+'------')
							ru.resSuccess(res,validate)
							sendCodeSms(type,phone,code,function(err,data){
				
							})
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
	ru.logReq(req);
	var phone = req.body.phone; 
	var password = req.body.password;
	var code = req.body.code;
	var os = req.body.os;
	var userid = utils.getUserid(phone);
	if(!phone||!password||!code){
		ru.resError(res,err);
	}else if(!utils.checkPhone(phone)){
		ru.resError(res,'请填写正确的手机号格式');
	}else{
		userDao.queryUser(phone,function(err,result){
			if(err){
				ru.resError(res,err)
			}else{
				if(result.length >0){
					ru.resError(res,'用户已经注册')
				}else{
					if(conf_validate){
						userDao.queryValidate(phone,function(err,objs){
							if(err){
								ru.resError(res,err);
							}else{
								var length = objs.length;
								if(length > 0 ){
									var validate = objs[0];
									if(validate.phone == phone && validate.code == code){
											userDao.addUser(userid,phone,password,os,function(err,result){
												if(err){
													ru.resError(res,err);
												}else{
													var title = '注册成功';
												    var content = '欢迎来到Poem！';
													var data = {
														type:0,
														userid:userid,
														title:title,
														content:content,
														extend:{},
														};
													httputil.requstPSPost('/message/actionmsg',data,function(err,result){
														if(err){
															logger.error(err)
														}
													})
													var user = result.length > 0 ?result[0]:{};
													ru.resSuccess(res,user);
												}
											});
									}else{
										ru.resError(res,'验证码错误');
									}
								}else{
									ru.resError(res,'验证码错误');
								}
							}
						});
					}else{
						userDao.addUser(userid,phone,password,os,function(err,result){
							if(err){
								ru.resError(res,err);
							}else{
								var title = '注册成功';
							    var content = '欢迎来到Poem！';
								var data = {
									type:0,
									userid:userid,
									title:title,
									content:content,
									extend:{},
									};
								httputil.requstPSPost('/message/actionmsg',data,function(err,result){
									if(err){
										logger.error(err)
									}
								})
								var user = result.length > 0 ?result[0]:{};
								ru.resSuccess(res,user);
							}
						});
					}
				}
			}
		});
	}
});

/**
 * 忘记密码
 */
router.post('/forget',function(req,res,next){
	ru.logReq(req);
	var phone = req.body.phone; 
	var password = req.body.password;
	var code = req.body.code;
	// var os = req.body.os;
	// var userid = utils.getUserid(phone);
	if(!phone||!password||!code){
		ru.resError(res,err);
	}else{
		userDao.queryUser(phone,function(err,result){
			if(err){
				ru.resError(res,err)
			}else{
				if(result.length >0){
					if(conf_validate){
						userDao.queryValidate(phone,2,function(err,objs){
							if(err){
								ru.resError(res,err);
							}else{
								var length = objs.length;
								if(length > 0 ){
									var validate = objs[0];
									if(validate.phone == phone && validate.code == code){
											userDao.updateUserPwd(phone,password,function(err,result){
												if(err){
													ru.resError(res,err);
												}else{
													var data = {
														phone:phone,
														passwrod:password,
													}
													ru.resSuccess(res,data);
												}
											});
									}else{
										ru.resError(res,'验证码错误');
									}
								}else{
									ru.resError(res,'验证码错误');
								}
							}
						});
					}else{
						userDao.updateUserPwd(phone,password,function(err,result){
							if(err){
								ru.resError(res,err);
							}else{
								var data = {
									phone:phone,
									passwrod:password,
								}
								ru.resSuccess(res,data);
							}
						});
					}
				}else{
					resError(res,'用户未注册')	
				}
			}
		});
	}
});
/**
 * 修改用户信息
 */
router.post('/upinfo',function(req,res,next){
	ru.logReq(req);
	var userid = req.body.userid;
	var head = req.body.head||'';
	var pseudonym = req.body.pseudonym||'';
	if(!userid){
		ru.resError(res,'参数错误')
		return;
	}
	userDao.updateUserInfo(userid,head,pseudonym,function(err,result){
		if(err){
			ru.resError(res,err);
		}else{
			var user = {};
			if(result.length > 0){
				user = result[0];
			}
			ru.resSuccess(res,user);
		}
	})
});

/**
 * 获取用户信息
 */
router.post('/info',function(req,res,next){
	ru.logReq(req);
	var userid = req.body.userid;
	if(!userid){
		resError(res,'参数错误')
		return;
	}
	userDao.queryUserInfo(userid,function(err,result){
		if(err){
			ru.resError(res,err);
		}else{
			logger.info('------用户信息------')
			logger.info(result)
			logger.info('------用户信息------')
			ru.resSuccess(res,result);
		}
	})
});
/**
 * 获取他人信息
 * */
router.post('/otherinfo',function(req,res,next){
	ru.logReq(req);
	var userid = req.body.userid;
	var myid = req.body.myid;
	if(!userid){
		ru.resError(res,'参数错误')
		return;
	}
	userDao.queryOtherInfo(myid,userid,function(err,result){
		if(err){
			ru.resError(res,err);
		}else{
			ru.resSuccess(res,result);
		}
	})
});
/**
 * 关注
 * @param op 1 关注 0 取消关注
 */
router.post('/follow',function(req,res,next){
	ru.logReq(req);
	var userid = req.body.userid;
	var fansid = req.body.fansid;
	var op = req.body.op;
	if(!userid||!fansid){
		ru.resError(res,'参数错误');
	}else{
		userDao.upFollow(userid,fansid,op,function(err,result){
			if(err){
				ru.resError(res,err);
			}else{
				ru.resSuccess(res,result);
				if(result.fstate == 1){
					userDao.queryUserFromId(userid,function(err,result){
						if(err){

						}else{
							if(result&&result.length > 0 ){
								var user = result[0];
								var title = '有人关注了你';
							    var content = user.pseudonym+'关注了你';
								var followExtend = new FollowExtend(user.userid,user.head,user.pseudonym);
							    var message = new Message(MessageType.FOLLOW_MSG,fansid,title,content,followExtend);
						    	httputil.requstPSPost('/message/actionmsg',message,function(err,result){
						    		logger.debug(err);
						    		logger.debug(result);
						    	}); 
							}
						}
					})

				}
			}
		});
	}
});

// router.post('/getfollows',function(req,res,next){
// 	logReq(req);
// 	var userid = req.body.userid;
// 	if(!userid){
// 		resError(res,'参数错误');
// 	}else{
// 		userDao.queryFollow(userid,function(err,result){
// 			if(err){
// 				resError(res,err);
// 			}else{
// 				resSuccess(res,result);
// 			}
// 		});
// 	}
// });
/**
 * 关注列表
 * @param  myid 我的id
 * @param  userid 用户的id
 * @param  0我的关注1关注我的
 */
router.post('/follows',function(req,res,next){
	ru.logReq(req);
	var myid = req.body.myid;
	var userid = req.body.userid;
	var type = req.body.type;
	if(!userid){
		resError(res,'参数错误');
	}else{
		userDao.queryFollowType(myid,userid,type,function(err,result){
			if(err){
				ru.resError(res,err);
			}else{
				ru.resSuccess(res,result);
			}
		});
	}
});
/**
 * 查询
 */
router.post('/query',function(req,res,next){
	ru.logReq(req);
	var op = req.body.op;
	if(!op){
		resError(res,'参数错误');
	}else{
		if(op == 'userid'){
			var userid = req.body.userid;
			userDao.queryUserFromId(userid,function(err,result){
			if(err){
				ru.resError(res,err);
			}else{
				if(result.length >0){
					var data = {
						op:'userid',
						phone:result[0].phone,
					}
					ru.resSuccess(res,data);
				}else{
					ru.resError(res,'用户ID不存在');
				}
				
			}
		});
		}else if(op == 'phone'){
			var phone = req.body.phone;
			userDao.queryUser(phone,function(err,result){
				if(err){
					ru.resError(res,err);
				}else{
					if(result.length >0){
						var data = {
							op:'phone',
							userid:result[0].userid,
						}
						ru.resSuccess(res,data);
					}else{
						ru.resError(res,'手机号未组成');
					}
				}
			});
		}else{
			ru.resError(res,'操作类型错误');	
		}
	}
});


module.exports = router;