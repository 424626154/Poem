/**
 * 网易相关
 */
var express = require('express');
var http = require('http');
var router = express.Router();
var utils = require('../utils/utils'); 
var config = require('../conf/wy');
var qs = require('querystring');
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

function logReq(req){
	console.log('url:/wx'+req.originalUrl+' body:'+JSON.stringify(req.body));
}

router.get('/', function(req, res, next) {
  res.send('wy');
});

router.post('/sendcode', function(req, res, next) {
	logReq(req);
	var phone = req.body.phone; 
	if(!phone){
		resError(res,'请输入手机号')
		return;
	}
	var isPhone = utils.isPoneAvailable(phone);
	if(!isPhone){
		resError(res,'手机号格式错误')
		return;
	}
	sendCode(req,res,phone);
  // res.send(checkSum);
});


function sendCode(req, res,mobile){
  	var AppKey = config.AppKey;
  	var AppSecret = config.AppSecret;
  	var node = utils.getNonce(6);
  	var CurTime = utils.getCurTimeStr()
  	var checkSum = utils.getCheckSum(AppSecret,node,CurTime);
	var data = {  
       templateid:'',
       mobile:mobile,
       codeLen:config.CODELEN,
    };  
  	// console.log(config)
    // data = JSON.stringify(data);  
    data = qs.stringify(data);  
    console.log(data);  
    var SendCodeUrl = config.SendCodeUrl;
    var opt = {  
        method: "POST",  
        host: 'api.netease.im',  
        // port: 80,  
        path: "/sms/sendcode.action",  
        headers: {  
            "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8',  
            "Content-Length": data.length,
            "AppKey": AppKey,  
	        "Nonce": node,
	        "CurTime":CurTime,
	        "CheckSum":checkSum,   
        },
    }; 
    console.log(opt)
    var req = http.request(opt, function (serverWy) {  
        if (serverWy.statusCode == 200) {  
            var body = "";  
            serverWy
            .on('data', function (data) { 
            	body += data; 
            })  
                          
            .on('end', function () { 
             	res.send(200, body);             
            });  
        }  
        else {  
            res.send(500, "error");  
        }  
    });  
    req.write(data + "\n");  
    req.end();  
}

module.exports = router;