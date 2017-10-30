/**
 * 用户服务器
 */
var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');
var utils = require('../utils/utils'); 
var ru = require('../utils/routersutil');
var http = require('http');
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
function sendAliSms(phone,code,callback){
	var data = {  
       phone:phone,
       code:code,
    };  
    data = JSON.stringify(data);  
    console.log(data);  
    var opt = {  
        method: "POST",  
        host: 'localhost',  
        port: 3000,  
        path: "/ali/sendcode",  
        headers: {  
            "Content-Type": 'application/json;charset=utf-8',  
            "Content-Length": data.length,
        },
    }; 
    var req = http.request(opt, function (serverAli) {  
        if (serverAli.statusCode == 200) {  
            var body = "";  
            serverAli
            .on('data', function (data) { 
            	body += data; 
            })  
                          
            .on('end', function () { 
             	// res.send(200, body); 
             	// console.log('请求sms')
             	var json_data = JSON.parse(body);
             	if(json_data.code == 0){
             		callback(null,json_data.data);   
             	}else{
             		callback(new Error(json_data.code),null)  
             	}     
            });  
        }  
        else {  
            // res.send(500, "error");  
            callback(new Error(serverAli.statusCode),null);   
        }  
    });  
    req.write(data + "\n");  
    req.end();  
}

function requstPoemPost(path,data,callback){
    data = JSON.stringify(data);  
    console.log('---requstPoemPost path:'+path+'data:'+data);  
    var opt = {  
        method: "POST",  
        host: 'localhost',  
        port: 3000,  
        path: path,  
        headers: {  
            "Content-Type": 'application/json;charset=utf-8',  
            "Content-Length": data.length,
        },
    }; 
    var req = http.request(opt, function (server) {  
        if (server.statusCode == 200) {  
            var body = "";  
            server
            .on('data', function (data) { 
            	body += data; 
            })  
                          
            .on('end', function () { 
             	var result = JSON.parse(body);
             	console.log('---requstPoemPost path:'+path+'result:'+result);
             	if(result.code == 0){
             		callback(null,result.data);   
             	}else{
             		callback(new Error(result.errmsg),null)  
             	}     
            });  
        }  
        else {  
            callback(new Error(server.statusCode),null);   
        }  
    });  
    req.write(data + "\n");  
    req.end();  
}
function sendRegisterMsg(data,callback){
	// console.log('---sendRegisterMsg---')
	// console.log(data)
	// console.log(callback)
	requstPoemPost('/message/register',data,callback);
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
					sendRegisterMsg({userid:user.userid},function(err,result){
						console.log('---发送注册消息')
						console.log(err)
						console.log(result)
						if(err){

						}else{

						}
					})
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
		resError(res,'参数错误');
	}else{
		var max_time = 60;//秒级
		userDao.queryValidate(phone,function(err,objs){
			if(err){
				resError(res,err.code);
			}else{
				console.log('验证码已经存在')
				var length = objs.length;
				if(length > 0 ){
					var validate = objs[0];
					var current_time = utils.getTime();
					var diff_time =  current_time - validate.time
					if( diff_time >= max_time){
						//重新生成
						console.log('重新生成验证码')
						var code = utils.getCode();
						userDao.updateValidate(phone,code,current_time,function(err,objs){
							if(err){
								resError(res,err.code);
							}else{
								var data = {phone:phone,code:code,time:max_time,max:max_time};
								resSuccess(res,data)
								console.log('------验证码为:'+code+'------')
							}
						})
						sendAliSms(phone,code,function(err,sms){
							if(!err){
								console.log('重新生成验证码/ali/sendcode2')
								userDao.updateValidateSms(phone,sms.RequestId,sms.BizId,function(err,result){

								})
							}
						})
					}else{
						validate.time = max_time-diff_time;
						validate.max = max_time,
						console.log('------验证码为:'+validate.code+'------')
						resSuccess(res,validate);
					}
				}else{
					console.log('初始生成验证码')
					//生成
					var code = utils.getCode();
					var current_time = utils.getTime();
					userDao.addValidate(phone,code,current_time,function(err,objs){
						console.log(err)
						if(err){
							resError(res,err.code);
						}else{
							console.log('初始生成验证码/ali/sendcode3')
							sendAliSms(phone,code,function(err,data){
								if(!err){
									userDao.updateValidateSms(phone,data.RequestId,data.BizId,function(err,result){

									})
								}
							})
							var validate ={
								phone:phone,
								code:code,
								time:max_time,
								max:max_time,
							}
							console.log('------验证码为:'+code+'------')
							resSuccess(res,validate)
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
 * 获取他人信息
 * */
router.post('/otherinfo',function(req,res,next){
	logReq(req);
	var userid = req.body.userid;
	var myid = req.body.myid;
	if(!userid){
		resError(res,'参数错误')
		return;
	}
	userDao.queryOtherInfo(myid,userid,function(err,result){
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
	logReq(req);
	var myid = req.body.myid;
	var userid = req.body.userid;
	var type = req.body.type;
	if(!userid){
		resError(res,'参数错误');
	}else{
		userDao.queryFollowType(myid,userid,type,function(err,result){
			if(err){
				resError(res,err);
			}else{
				resSuccess(res,result);
			}
		});
	}
});



module.exports = router;