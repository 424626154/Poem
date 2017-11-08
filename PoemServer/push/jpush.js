var JPush = require('jpush-sdk');
var jiguang = require('../conf/jiguang');
var client = JPush.buildClient(jiguang.appKey, jiguang.masterSecret);

var logger = require('../utils/log4jsutil').logger(__dirname+'/jpush.js');
var {PushType} = require('../utils/module');
var server = require('../conf/config').server;
var messageDao = require('../dao/messageDao');

module.exports = {
	sendAllPush:function(title,content,os,callback){
	  if(!server.push){
        callback(null,{sendno:'sendno',msg_id:'msg_id'});
        return
      } 
	  logger.info('---发送极光推送')
	  logger.info('---title:'+title)
	  logger.info('---content:'+content)
	  logger.info('---os:'+os)
	  var platform = JPush.ALL;
	  var extras = {
	    type:PushType.NEWS,
	  }
	  if(os == 'android'||os == 'ios'){
	      platform = os;
	      // if(os == 'ios'){
	      // 	notification = JPush.ios(content,'',1,true,extras);
	      // }else{
	      // 	notification = JPush.android(content,title,0,extras);
	      // }
	  }
	  // logger.info('---notification:'+notification)
		//easy push
		client.push().setPlatform(platform)
		    .setAudience(JPush.ALL)
		    .setNotification(content,
		    	JPush.ios(content,'',1,true,extras),
		    	JPush.android(content,title,0,extras))
	        // .setMessage(content,title,'text',extras)
		    .send(function(err, res) {
		        if (err) {
		        	logger.error(err);
		            callback(err,null);
		        } else {
		            callback(null,res);
		        }
		    });
	},
	/**
	 * 发送单个推送
	 */
	sendPush:function(userid,msgid,title,content,pushtype,callback){
      if(!server.push){
        callback(null,{sendno:'sendno',msg_id:'msg_id'});
        return
      }
      messageDao.getPush(userid,function(err,result){
        if(err){
            logger.error(err)
            callback(err,null);
        }else{
            if(result.length > 0){
              var push = result[0];
              var pushid =  push.pushid;
              var os = push.os;
              if(pushid){
              	  logger.info('---发送极光推送 msgid:'+msgid+' pushid:'+pushid+' os:'+os);
				  logger.info('---title:'+title);
				  logger.info('---content:'+content);
				  logger.info('---pushtype:'+pushtype);
				  // extras{
				  //   type:'news','chat',
				  // }
				  var extras = {
				    type:pushtype,
				  }
				  try{
				    var platform = JPush.ALL;
				    var notification = content;
				    if(os == 'ios'){
				        platform = 'ios';
				        notification = JPush.ios(content,'',1,true,extras);
				    }else if(os == 'android'){
				        platform = 'android';
				        notification = JPush.android(content,title,0,extras);
				    }
				    logger.info('---extras:');
				    logger.info(extras);
				    client.push().setPlatform(platform)
				      .setAudience(JPush.registration_id(pushid))
				      .setNotification(notification)
				      // .setMessage(content,title,'text',extras)
				      .send(function(err, res) {
				          console.error(err)
				          if (err) {
				          	logger.error(err);
				             callback(err,null);
				          } else {
				            callback(null,res);
				          }
				      });
				  }catch(err){
				      logger.error(err);
				      callback(err,null);
				  }
              } 
            }else{
              callback(new Error('获取用户pushid失败'),null);
            }
        }
      }); 
	}
}