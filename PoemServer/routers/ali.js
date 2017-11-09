/**
 * 阿里组件
 */
var express = require('express');
var http = require('http');
var router = express.Router();
var utils = require('../utils/utils');
var sms = require('../utils/alisms'); 
var config = require('../conf/aliconf')
var qs = require('querystring');
var conf = require('../conf/config')
var server = conf.server;
var ResJson = function(){
	this.code;
	this.data;
	this.errmsg ;
}
// const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
//初始化sms_client
// let smsClient = new SMSClient({accessKeyId, secretAccessKey})
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
	console.log('url:'+req.originalUrl+' body:'+JSON.stringify(req.body));
}

router.get('/', function(req, res, next) {
  res.send('ali');
});
router.post('/sendcode', function(req, res, next) {
    logReq(req);
	var phone = req.body.phone; 
	var code = req.body.code;
	if (!code){
		resError(res,'验证码错误')
		return;
	}
	if(!phone){
		resError(res,'请输入手机号')
		return;
	}
	var isPhone = utils.isPoneAvailable(phone);
	if(!isPhone){
		resError(res,'手机号格式错误')
		return;
	}
	if(server.sms){
		var TemplateParam = {"code":code}
		sms.sendMessage(phone,config.SMS,TemplateParam,function(err,data){
			if(err){
				resError(res,err.message)
			}else{
				resSuccess(res,data);
			}
		});
	}else{
		var data = {
		    "code": 0,
		    "data": {
		        "Message": "OK",
		        "RequestId": "61C49724-B9F2-4116-9AAD-806B0FCF2561",
		        "BizId": "375612709009100568^0",
		        "Code": "OK"
		    }
		}
		resSuccess(res,data.data);
	}
});

module.exports = router;