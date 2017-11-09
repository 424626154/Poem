/**
 * 消息中心
 */
var express = require('express');
var router = express.Router();
var messageDao = require('../dao/messageDao');
var userDao = require('../dao/userDao');
var ru = require('../utils/routersutil');
var httputil = require('../utils/httputil');
var http = require('http');
var jpush = require('../push/jpush');
var logger = require('../utils/log4jsutil').logger(__dirname+'/message.js');
var {Message,MessageType,PushType} = require('../utils/module');


/**
 * 添加消息
 */
function addMessage(message,callback){
  userDao.queryUserFromId(message.userid,function(err,result){
    if(err){
      callback(err,null);
    }else{
      if(result.length > 0 ){
          messageDao.addMessage(message.type,message.userid,message.title,message.content,message.extend,function(err,result){
              if(err){
                  callback(err,null);
              }else{
                  var msgid = result.insertId;
                  jpush.sendPush(message.userid,msgid,message.title,message.content,PushType.NEWS,function(err,data){
                      if(err){
                        callback(err,null);
                      }else{
                        callback(null,data);
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
         messageDao.addMessages(MessageType.SYS_MSG,userids,title,content,{},function(err,result){
              jpush.sendAllPush(title,content,os,function(err,data){
                   if(err){
                     ru.resError(res,err);
                   }else{
                     ru.resSuccess(res,data);
                   }
                });
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
    var message = new Message(MessageType.SYS_MSG,userid,title,content);
    addMessage(message,function(err,result){
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

router.post('/actionmsg',function(req,res,next){
  ru.logReq(req);
  var type = req.body.type;
  var userid = req.body.userid;
  var title = req.body.title;
  var content = req.body.content;
  var extend = req.body.extend;
  if(!userid||!title||!content){
    ru.resError(res,'参数错误');
  }else{
    var message = new Message(type,userid,title,content,extend);
    addMessage(message,function(err,result){
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

/**
 * 意见反馈 
 */
router.post('/feedback',function(req,res,next){
  ru.logReq(req);
  var userid = req.body.userid;
  var feedback = req.body.feedback;
  var contacts = req.body.contacts;
  if(!feedback){
    ru.resError(res,'参数错误');
  }else{
   httputil.requstPAPost('/feedback/send',req.body,function(err,result){
      if(err){
        ru.resError(res,err);
      }else{
        ru.resSuccess(res,result);
      }
    }); 
  }
});




module.exports = router;