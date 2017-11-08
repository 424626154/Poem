/**
 * 私信
 */
var express = require('express');
var router = express.Router();
var chatDao = require('../dao/chatDao');
var ru = require('../utils/routersutil');
var logger = require('../utils/log4jsutil').logger(__dirname+'/chat.js');
var jpush = require('../push/jpush');
var {PushType} = require('../utils/module');

router.get('/', function(req, res, next) {
	ru.logReq(req);
    res.send('chat');
});
/**
 * 发送私信
 */
router.post('/send', function(req, res, next) {
	ru.logReq(req);
	var body = req.body;
	var type = body.type;
	var fuserid = body.fuserid;
	var tuserid = body.tuserid;
	var msg = body.msg;
	var checkid = body.checkid;
	var extend = {};
	if(!fuserid||!tuserid||!msg||!checkid){
		ru.resError(res,'参数错误');
	}else{
		chatDao.addChat(type,fuserid,tuserid,msg,extend,function(err,result){
			if(err){
				ru.resError(res,err);
				logger.error(err);
			}else{
				var data = {
					id:result.insertId,
					type:type,
					fuserid:fuserid,
					tuserid:tuserid,
					msg:msg,
					extend:extend,
					checkid:checkid,
				}
				ru.resSuccess(res,data);
				jpush.sendPush(tuserid,data.id,'您有一条私信',msg,PushType.CHAT,function(err,data){
	                if(err){

	                }else{

	                }
	              });
			}
		});
	}
});
/**
 * 获得未读私信列表
 * userid 用户id
 * fuserid 与指定用户的id 不存在则返回所有
 */
router.post('/chats', function(req, res, next) {
	ru.logReq(req);
	var userid = req.body.userid;
	var fuserid = req.body.fuserid;
	if(!userid){
		ru.resError(res,'参数错误');
	}else{
		if(fuserid){
			chatDao.queryFidChats(userid,fuserid,function(err,result){
				if(err){
					ru.resError(res,err);
					logger.error(err);
				}else{
					ru.resSuccess(res,result);
				}
			});
		}else{
			chatDao.queryChats(userid,function(err,result){
				if(err){
					ru.resError(res,err);
					logger.error(err);
				}else{
					ru.resSuccess(res,result);
				}
			});
		}
	}

});
/**
 * 设置已读
 */
router.post('/read', function(req, res, next) {
  ru.logReq(req);
  var userid = req.body.userid;
  var reads = req.body.reads;
  if(!userid||!reads){
    ru.resError(res,'参数错误');
  }else{
    chatDao.setChatRead(userid,reads,function(err,result){
      if(err){
        ru.resError(res,err);
      }else{
        ru.resSuccess(res,result);
      }
    });
  }
});


module.exports = router;