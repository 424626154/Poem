/**
 * 消息中心
 */
var express = require('express');
var router = express.Router();
var messageDao = require('../dao/messageDao');
var userDao = require('../dao/userDao');
var JPush = require('jpush-sdk');
var jiguang = require('../conf/jiguang');
var ru = require('../utils/routersutil');
var conf = require('../conf/config')
var server = conf.server;
var http = require('http');
var logger = require('../utils/log4jsutil').logger(__dirname+'/message.js');

var client = JPush.buildClient(jiguang.appKey, jiguang.masterSecret);

function sendAllPush(title,content,os,callback){
	logger.info('---发送极光推送')
	logger.info('---title:'+title)
	logger.info('---content:'+content)
  logger.info('---os:'+os)
  var platform = JPush.ALL;
  if(os == 'andoid'||os == 'ios'){
      platform = os;
  }
	//easy push
	client.push().setPlatform(platform)
	    .setAudience(JPush.ALL)
	    .setNotification(content)
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
/**
 * 发送单个推送
 */
function sendPush(msgid,pushid,os,title,content,callback){
  logger.info('---发送极光推送 msgid:'+msgid+' pushid:'+pushid+' os:'+os);
  logger.info('---title:'+title);
  logger.info('---content:'+content);
  try{
    var platform = JPush.ALL;
    console.log(typeof os);
    console.log(os == 'android');
    console.log(os === 'android');
    console.log(os);
    console.log('android');
    if(os == 'ios'){
        platform = 'ios';
    }else if(os == 'android'){
        platform = 'android';
    }
    console.log(platform);
    client.push().setPlatform(platform)
      .setAudience(JPush.registration_id(pushid))
      .setNotification(content)
      .send(function(err, res) {
          console.error(err)
          if (err) {
              callback(err,null)
          } else {
              callback(null,res)
          }
      });
  }catch(err){
      logger.error(err);
      callback(err,null);
  }
}

/**
 * 添加消息
 */
function addMessage(userid,title,content,callback){
  userDao.queryUserFromId(userid,function(err,result){
    if(err){
      callback(err,null);
    }else{
      if(result.length > 0 ){
          messageDao.addMessage(userid,title,content,0,'',function(err,result){
              if(err){
                  callback(err,null);
              }else{
                  var msgid = result.insertId;
                  messageDao.getPush(userid,function(err,result){
                      if(err){
                        callback(err,null);
                      }else{
                        if(result.length > 0){
                          var push =  result[0];
                          if(server.push){
                            sendPush(msgid,push.pushid,push.os,title,content,function(err,data){
                                 if(err){
                                   callback(err,null);
                                 }else{
                                  callback(null,data);
                                 }
                            });
                          }else{
                            callback(null,{sendno:'sendno',msg_id:'msg_id'});
                          } 
                        }else{
                          callback('获取用户pushid失败',null);
                        }
                        // console.log(result[0])
                        // ru.resSuccess(res,result);
                      }
                  });
              }    
          });
      }else{
        callback('用户不存在',null);
      }
    }
  })
}


router.get('/', function(req, res, next) {
	ru.logReq(req);
    res.send('message');
});

router.post('/pushall', function(req, res, next) {
  ru.logReq(req);
  var title = req.body.title;
  var content = req.body.content;
  var os = req.body.os;
  if(!title||!content||!os){
  	ru.resError(res,'参数错误');
  	return;
  }
  userDao.queryAllUserIdFromOs(os,function(err,result){
    if(err){
      ru.resError(res,err);
    }else{
      if(result.length > 0){
        var userids = [];
        for(var i = 0 ; i < result.length;i++){
          userids[i]= result[i].userid;
        }
         messageDao.addMessages(userids,title,content,0,'',function(err,result){
              if(server.push){
                sendAllPush(title,content,os,function(err,data){
                   if(err){
                     ru.resError(res,err);
                   }else{
                     ru.resSuccess(res,data);
                   }
                });
              }else{
                ru.resSuccess(res,{sendno:'sendno',msg_id:'msg_id'}); 
              }
         })
      }else{
        ru.resError(res,'无可推送用户');
      }
    }
  });
});
router.post('/pushuser', function(req, res, next) {
  ru.logReq(req);
  var body = req.body;
  var userid = body.userid;
  var title = body.title;
  var content = body.content;
  if(!userid||!title||!content){
    ru.resError(res,'参数错误');
  }else{
    addMessage(userid,title,content,function(err,result){
        if(err){
          ru.resError(res,err);
        }else{
          ru.resSuccess(res,result);
        }
    });
  }
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
    addMessage(userid,title,content,function(err,result){
        if(err){
          ru.resError(res,err);
        }else{
          ru.resSuccess(res,result);
        }
    });
  }
});
/**
 * 获得消息列表
 */
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
/**
 * 设置消息已读
 */
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