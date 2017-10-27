/**
 * 消息中心
 */
var express = require('express');
var router = express.Router();
var JPush = require('jpush-sdk');
var jiguang = require('../conf/jiguang');
var ru = require('../utils/routersutil');

var client = JPush.buildClient(jiguang.appKey, jiguang.masterSecret);

function sendAllPush(title,content,callback){
	console.log('---发送极光推送')
	console.log('---title:'+title)
	console.log('---content:'+content)
	//easy push
	client.push().setPlatform(JPush.ALL)
	    .setAudience(JPush.ALL)
	    .setNotification(content, JPush.ios(content,title, 5))
	    .send(function(err, res) {
	        if (err) {
	            // console.log(err.message)
	            callback(err,null)
	        } else {
	            // console.log('Sendno: ' + res.sendno)
	            // console.log('Msg_id: ' + res.msg_id)
	            callback(null,res)
	        }
	    });
	 // client.push().setPlatform('ios', 'android')
  //   .setAudience(JPush.tag('555', '666'), JPush.alias('666,777'))
  //   .setNotification(title, JPush.ios(content), JPush.android(content, null, 1))
  //   .setMessage(content)
  //   .setOptions(null, 60)
  //   .send(function(err, res) {
  //       if (err) {
  //           // console.log(err.message)
  //           callback(err,null)
  //       } else {
  //           // console.log('Sendno: ' + res.sendno)
  //           // console.log('Msg_id: ' + res.msg_id)
  //           callback(null,res)
  //       }
  //   });   
}


router.get('/', function(req, res, next) {
	ru.logReq(req);
    res.send('message');
});

router.post('/sendall', function(req, res, next) {
  //res.send('respond with a resource');
  ru.logReq(req);
  var title = req.body.title;
  var content = req.body.content;
  console.log(title)
  console.log(content)
  if(!title||!content){
  	ru.resError(res,'参数错误');
  	return;
  }
  sendAllPush(title,content,function(err,data){
  		if(err){
  			ru.resError(res,err);
  		}else{
  			ru.resSuccess(res,data);
  		}
  });
    
});


module.exports = router;