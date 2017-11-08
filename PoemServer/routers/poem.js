/**
 * 作品服务器
 */
var express = require('express');
var router = express.Router();
var poemDao = require('../dao/poemDao');
var utils = require('../utils/utils'); 
var httputil = require('../utils/httputil'); 
var ru = require('../utils/routersutil');
var logger = require('../utils/log4jsutil').logger(__dirname+'/poem.js');
var {LoveExtend,CommentExtend,Message,MessageType} = require('../utils/module');
/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.send('poem');
});
/**
 * 添加作品
 */
router.post('/addpoem', function(req, res, next) {
	ru.logReq(req);
    var userid = req.body.userid;
    var title = req.body.title;
    var content = req.body.content;
    var time = utils.getTime();
    if(!title||!content||!userid){
		ru.resError(res,'参数错误');
    }else{
    	poemDao.addPoem(userid,title,content,time,function(err,result){
	    	if(err){
				ru.resError(res,err);
	    	}else{
	    		var poem = {};
	    		if(result.length > 0){
	    			poem = result[0];
	    		}
				ru.resSuccess(res,poem);
	    	}
	    })
    }

});
/**
 * 修改作品
 */
router.post('/uppoem', function(req, res, next) {
  	ru.logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    var title = req.body.title;
    var content = req.body.content;
    if(!title||!content||!id||!userid){
		ru.resError(res,'参数错误');
    }else{
    	poemDao.upPoem(id,userid,title,content,function(err,result){
	    	if(err){
	    		ru.resError(res,err);
	    	}else{
	    		var poem = {};
	    		if(result.length > 0){
	    			poem = result[0];
	    		}
				ru.resSuccess(res,poem);
	    	}
	    })
    }

});
/**
 * 删除作品
 */
router.post('/delpoem', function(req, res, next) {
	ru.logReq(req);
    var userid = req.body.userid;
    var id = req.body.id;
    if(!id||!userid){
    	ru.resError(res,'参数错误');
    }else{
    	poemDao.delPoem(id,userid,function(err,result){
	    	if(err){
	    		ru.resError(res,err);
	    	}else{
	    		var poem = {id:parseInt(id),userid:userid};
				ru.resSuccess(res,poem);
	    	}
	    })
    }
});

/**
 * 最新作品
 */
router.post('/newestpoem', function(req, res, next) {
	ru.logReq(req);
	var userid = req.body.userid;
    var id = req.body.id;
    if(!userid){
		ru.resError(res,'参数错误');
    }else{
    	 poemDao.queryNewestPoem(userid,id,function(err,poems){
	    	if(err){
	    	 	logger.error(err);
				ru.resError(res,err);
	    	}else{
	    		ru.resSuccess(res,poems);
	    	}
	    })
    }
});	
/**
 * 历史作品
 */
router.post('/historypoem', function(req, res, next) {
	ru.logReq(req)
	var userid = req.body.userid;
    var id = req.body.id;
    if(!userid){
    	resError(res,'参数错误');
    }else{
    	poemDao.queryHistoryPoem(userid,id,function(err,poems){
	    	if(err){
				ru.resError(res,err);
	    	}else{
	    		ru.resSuccess(res,poems);
	    	}
	    });
    }
});	
/**
 * 作品点赞数和评论数
 */
router.post('/lovecomment', function(req, res, next) {
	ru.logReq(req);
	var pid = req.body.pid;
	if(!pid){
		ru.resError(res,'参数错误');
	}else{
		poemDao.queryLoveComment(pid,function(err,result){
	    	if(err){
				ru.resError(res,err);
	    	}else{
	    		var poem = {};
	    		if(result.length > 0 ){
	    			poem = result[0];
	    		}
	    		ru.resSuccess(res,poem);
	    	}
	    });
	}
});	
/**
 * 最新作品集
 * [{
            "id": 58,
            "userid": "userid_13671172337",
            "title": "Gf",
            "content": "Gh",
            "lovenum": 0,
            "commentnum": 0,
            "head": "50fca5a28ff53e7b26338bc02d144c2d",
            "pseudonym": "136",
            "time": 1508306250,
            "mylove": 0
        }]
 */
router.post('/newestallpoem', function(req, res, next) {
	ru.logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    poemDao.queryNewestAllPoem(id,userid,function(err,poems){
    	if(err){
    		ru.resError(res,err);
    	}else{
    		ru.resSuccess(res,poems);
    	}
    })
});	
/**
 * 历史作品集
 * [{
            "id": 58,
            "userid": "userid_13671172337",
            "title": "Gf",
            "content": "Gh",
            "lovenum": 0,
            "commentnum": 0,
            "head": "50fca5a28ff53e7b26338bc02d144c2d",
            "pseudonym": "136",
            "time": 1508306250,
            "mylove": 0
        }]
 */
router.post('/historyallpoem', function(req, res, next) {
	ru.logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    poemDao.queryHistoryAllPoem(id,userid,function(err,poems){
    	if(err){
			ru.resError(res,err);
    	}else{
    		ru.resSuccess(res,poems);
    	}
    });
});	

/**
 * 评论作品
 */
router.post('/commentpoem', function(req, res, next) {
	ru.logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    var cid = req.body.cid;
    var comment_str = req.body.comment;
    var time = utils.getTime();
	if(!id||!userid||!comment_str){
		ru.resError(res,'参数错误');
	}else{
		 poemDao.addPoemComment(id,userid,cid,comment_str,time,function(err,comment){
	    	if(err){
	    		ru.resError(res,err);
	    	}else{
	    		poemDao.queryOpPoem(id,userid,function(err,poem){
    				if(userid != poem.userid){//自己点赞自己不发消息
						var op_srt = '评论';
						if(cid > 0){
							op_srt = '回复';
						}
						var title = '有人'+op_srt+'了你的作品';
					    var content = poem.oppseudonym+op_srt+':'+comment_str;
					    var commentExtend = new CommentExtend(poem.title,poem.opuser,
					    	poem.ophead,poem.oppseudonym,id,cid,comment_str);
					    var message = new Message(MessageType.COMMENT_MSG,poem.userid,title,content,commentExtend);
				    	httputil.requstPSPost('/message/actionmsg',message,function(err,result){
				    		logger.debug(err);
				    		logger.debug(result);
				    	}); 
				    	if(cid > 0 ){
				    		poemDao.queryCommentUserid(cid,function(err,result){
				    			if(err){
				    				logger.error(err);
				    			}else{
	
				    				var comment_userid = result.length > 0?result[0].userid:0;
				    				if(comment_userid&&comment_userid != userid&&comment_userid != poem.userid){// 屏蔽回复自己跟作者本身
				    					title = '有人'+op_srt+'了['+poem.title+']';
							    		var message1 = new Message(MessageType.COMMENT_MSG,comment_userid,title,content,commentExtend);
								    	httputil.requstPSPost('/message/actionmsg',message1,function(err,result){
								    		logger.debug(err);
								    		logger.debug(result);
								    	});
				    				}
				    			}
				    		})
				    	}
    				}
		    	});
	    		ru.resSuccess(res,comment);
	    	}
	    })
		poemDao.addCommentNum(id,function(err,comment){})
	}
});	

/**
 * 最新评论
 */
router.post('/newestcomment', function(req, res, next) {
	ru.logReq(req);
    var id = req.body.id;
    var pid = req.body.pid;
    if(!pid){
    	resError(res,'参数错误');
    }else{
    	poemDao.queryNewestComment(id,pid,function(err,comments){
	    	if(err){
				ru.resError(res,err);
	    	}else{
				ru.resSuccess(res,comments);
	    	}
	    })
    }

});	
/**
 * 历史评论
 */
router.post('/historycomment', function(req, res, next) {
	ru.logReq(req);
    var id = req.body.id;
    var pid = req.body.pid;
    if(!pid){
    	resError(res,'参数错误');
    }else{
    	poemDao.queryHistoryComment(id,pid,function(err,comments){
		 	logger.error(err)
	    	if(err){
	    		ru.resError(res,err);
	    	}else{
	    		ru.resSuccess(res,comments);
	    	}
	    })
    }
});	

/**
 * 点赞
 */
router.post('/lovepoem', function(req, res, next) {
	ru.logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    var love = req.body.love;
    var time = utils.getTime();
    if(!id||!userid){
    	ru.resError(res,'参数错误');
    	return ;
    }
    poemDao.lovePoem(id,userid,love,function(err,love){  	
		if(err){
    		ru.resError(res,err);
    	}else{
    		if(love.love == 1){
    			poemDao.queryOpPoem(id,userid,function(err,poem){
    				if(userid != poem.userid){//自己点赞自己不发消息
						var title = '有人赞了你的作品';
					    var content = poem.oppseudonym+'赞了['+poem.title+']';
						var loveExtend = new LoveExtend(poem.title,poem.opuser,
					    	poem.ophead,poem.oppseudonym,id);
					    var message = new Message(MessageType.LOVE_MSG,poem.userid,title,content,loveExtend);
				    	httputil.requstPSPost('/message/actionmsg',message,function(err,result){
				    		logger.debug(err);
				    		logger.debug(result);
				    	}); 
    				}
		    	});
    		}
    		ru.resSuccess(res,love);
    	}
    });
});	
/**
 * 获取点赞列表
 */
router.post('/getloves', function(req, res, next) {
	ru.logReq(req);
	var pid = req.body.id;
	if(!pid){
		resError(res,'参数错误')
	}else{
		poemDao.queryLoves(pid,function(err,result){
			if(err){
	    		ru.resError(res,err)
	    	}else{
	    		ru.resSuccess(res,result);
	    	}
		});
	}
});
/**
 *我的点赞
 */
router.post('/mylove', function(req, res, next) {
	ru.logReq(req);
	var pid = req.body.id;
	var userid = req.body.userid;
	if(!pid){
		ru.resError(res,'参数错误')
	}else{
		poemDao.queryLovePoem(pid,userid,function(err,result){
			if(err){
	    		ru.resError(res,err)
	    	}else{
	    		var love = {id:0};
	    		if(result.length){
	    			love = result[0];
	    		}
	    		ru.resSuccess(res,love);
	    	}
		});
	}
});
/**
 * 作品详情
 */
router.post('/info', function(req, res, next) {
	ru.logReq(req);
	var pid = req.body.pid;
	var userid = req.body.userid;
	if(!pid){
		resError(res,'参数错误')
	}else{
		poemDao.queryPoemInfo(pid,userid,function(err,result){
			if(err){
	    		ru.resError(res,err)
	    	}else{
	    		ru.resSuccess(res,result);
	    	}
		});
	}
});



module.exports = router;
