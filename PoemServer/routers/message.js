/**
 * 消息中心
 */
var express = require('express');
var router = express.Router();
var messageDao = require('../dao/messageDao');
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

function sendPush(msgid,pushid,os,title,content,callback){
  console.log('---发送极光推送')
  console.log('---msgid:'+msgid)
  console.log('---pushid:'+pushid)
  console.log('---os:'+os)
  console.log('---title:'+title)
  console.log('---content:'+content)
  client.push().setPlatform(os)
      .setAudience(JPush.registration_id(pushid))
      .setNotification(content, JPush.ios(content,title,msgid))
      .send(function(err, res) {
          if (err) {
              callback(err,null)
          } else {
              callback(null,res)
          }
      });
  
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


/**
 * 上传pushid
 * @param  userid 
 * @param pushid
 * @return 
 */
router.post('/pushid',function(req,res,next){
  ru.logReq(req);
  var userid = req.body.userid;
  var pushid = req.body.pushid;
  var os = req.body.os||'all';
  if(!userid||!pushid){
    ru.resError(res,'参数错误');
  }else{
    messageDao.addPushId(userid,pushid,os,function(err,result){
      if(err){
        ru.resError(res,err);
      }else{
        var obj = {
          userid:userid,
          pushid:pushid,
          os:os,
        }
        ru.resSuccess(res,obj);
      }
    });
  }
});

router.post('/register',function(req,res,next){
  ru.logReq(req);
  var userid = req.body.userid;
  if(!userid){
    ru.resError(res,'参数错误');
  }else{
    var title = '注册成功';
    var content = '欢迎来到Poem！';
    messageDao.addMessage(userid,title,content,0,'',function(err,result){
        if(err){
            ru.resError(res,err);
        }else{
            var msgid = result.insertId;
            messageDao.getPush(userid,function(err,result){
                if(err){
                  ru.resError(res,err);
                }else{
                  if(result.length > 0){
                    var push =  result[0];
                    sendPush(msgid,push.pushid,push.os,title,content,function(err,result){
                      if(err){
                        ru.resError(res,err);
                      }else{
                        ru.resSuccess(res,result);
                      }
                    }); 
                  }else{
                    ru.resSuccess(res,result);
                  }
                  // console.log(result[0])
                  // ru.resSuccess(res,result);
                }
            });
        }    
    });
  }
});

router.post('/messages',function(req,res,next){
  ru.logReq(req);
  var userid = req.body.userid;
  if(!userid){
    ru.resError(res,'参数错误');
  }else{
    messageDao.getMessages(userid,function(err,result){
      if(err){
        ru.resError(res,err);
      }else{
        ru.resSuccess(res,result);
      }
    });
  }
});

router.post('/read',function(req,res,next){
  ru.logReq(req);
  var userid = req.body.userid;
  var reads = req.body.reads;
  if(!userid||!reads){
    ru.resError(res,'参数错误');
  }else{
    // reads = JSON.parse(reads);
    console.log(reads)
    messageDao.setMessageRead(userid,reads,function(err,result){
      if(err){
        ru.resError(res,err);
      }else{
        ru.resSuccess(res,result);
      }
    });
  }
});

module.exports = router;