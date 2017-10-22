var express = require('express');
var router = express.Router();
var poemDao = require('../dao/poemDao');
var utils = require('../utils/utils'); 
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
	console.log(err);
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
	console.log('url:/poem'+req.originalUrl+' body:'+JSON.stringify(req.body));
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.send('poem');
});
/**
 * 添加作品
 */
router.post('/addpoem', function(req, res, next) {
	logReq(req);
    var userid = req.body.userid;
    var title = req.body.title;
    var content = req.body.content;
    var time = utils.getTime();
    if(!title||!content||!userid){
		resError(res,'参数错误');
    }else{
    	poemDao.addPoem(userid,title,content,time,function(err,result){
	    	if(err){
				resError(res,err);
	    	}else{
	    		var poem = {};
	    		if(result.length > 0){
	    			poem = result[0];
	    		}
				resSuccess(res,poem);
	    	}
	    })
    }

});
/**
 * 修改作品
 */
router.post('/uppoem', function(req, res, next) {
  	logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    var title = req.body.title;
    var content = req.body.content;
    if(!title||!content||!id||!userid){
		resError(res,'参数错误');
    }else{
    	poemDao.upPoem(id,userid,title,content,function(err,result){
	    	if(err){
	    		resError(res,err);
	    	}else{
	    		var poem = {};
	    		if(result.length > 0){
	    			poem = result[0];
	    		}
				resSuccess(res,poem);
	    	}
	    })
    }

});
/**
 * 删除作品
 */
router.post('/delpoem', function(req, res, next) {
	logReq(req);
    var userid = req.body.userid;
    var id = req.body.id;
    if(!id||!userid){
    	resError(res,'参数错误');
    }else{
    	poemDao.delPoem(id,userid,function(err,result){
	    	if(err){
	    		resError(res,err);
	    	}else{
	    		var poem = {id:parseInt(id),userid:userid};
				resSuccess(res,poem);
	    	}
	    })
    }
});

/**
 * 最新作品
 */
router.post('/newestpoem', function(req, res, next) {
	logReq(req);
	var userid = req.body.userid;
    var id = req.body.id;
    if(!userid){
		resError(res,'参数错误');
    }else{
    	 poemDao.queryNewestPoem(userid,id,function(err,poems){
    	 	console.log(err)
	    	if(err){
				resError(res,err);
	    	}else{
	    		resSuccess(res,poems);
	    	}
	    })
    }
});	
/**
 * 历史作品
 */
router.post('/historypoem', function(req, res, next) {
	console.log('req /poem/historypoem body:'+JSON.stringify(req.body));
	var userid = req.body.userid;
    var id = req.body.id;
    if(!userid){
    	resError(res,'参数错误');
    }else{
    	poemDao.queryHistoryPoem(userid,id,function(err,poems){
	    	if(err){
				resError(res,err);
	    	}else{
	    		resSuccess(res,poems);
	    	}
	    });
    }
});	
/**
 * 作品点赞数和评论数
 */
router.post('/lovecomment', function(req, res, next) {
	logReq(req);
	var pid = req.body.pid;
	if(!pid){
		resError(res,'参数错误');
	}else{
		poemDao.queryLoveComment(pid,function(err,result){
	    	if(err){
				resError(res,err);
	    	}else{
	    		var poem = {};
	    		if(result.length > 0 ){
	    			poem = result[0];
	    		}
	    		resSuccess(res,poem);
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
	console.log('req /poem/newestallpoem body:'+JSON.stringify(req.body));
    var id = req.body.id;
    var userid = req.body.userid;
    poemDao.queryNewestAllPoem(id,userid,function(err,poems){
    	if(err){
    		resError(res,err);
    	}else{
    		resSuccess(res,poems);
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
	console.log('req /poem/historyallpoem body:'+JSON.stringify(req.body));
    var id = req.body.id;
    var userid = req.body.userid;
    poemDao.queryHistoryAllPoem(id,userid,function(err,poems){
    	if(err){
			resError(res,err);
    	}else{
    		resSuccess(res,poems);
    	}
    });
});	

/**
 * 评论作品
 */
router.post('/commentpoem', function(req, res, next) {
	logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    var cid = req.body.cid;
    var comment = req.body.comment;
    var time = utils.getTime();
	if(!id||!userid||!comment){
		resError(res,'参数错误');
	}else{
		 poemDao.addPoemComment(id,userid,cid,comment,time,function(err,comment){
	    	if(err){
	    		resError(res,err);
	    	}else{
	    		resSuccess(res,comment);
	    	}
	    })
		poemDao.addCommentNum(id,function(err,comment){})
	}
});	

/**
 * 最新评论
 */
router.post('/newestcomment', function(req, res, next) {
	logReq(req);
    var id = req.body.id;
    var pid = req.body.pid;
    if(!pid){
    	resError(res,'参数错误');
    }else{
    	poemDao.queryNewestComment(id,pid,function(err,comments){
	    	if(err){
				resError(res,err);
	    	}else{
				resSuccess(res,comments);
	    	}
	    })
    }

});	
/**
 * 历史评论
 */
router.post('/historycomment', function(req, res, next) {
	console.log('req /poem/historycomment body:'+JSON.stringify(req.body));
    var id = req.body.id;
    var pid = req.body.pid;
    if(!pid){
    	resError(res,'参数错误');
    }else{
    	poemDao.queryHistoryComment(id,pid,function(err,comments){
		 	console.log(err)
	    	if(err){
	    		resError(res,err);
	    	}else{
	    		resSuccess(res,comments);
	    	}
	    })
    }
});	

/**
 * 点赞
 */
router.post('/lovepoem', function(req, res, next) {
	console.log('req /poem/lovepoem body:'+JSON.stringify(req.body))
    var id = req.body.id;
    var userid = req.body.userid;
    var love = req.body.love;
    var time = utils.getTime();
    if(!id||!userid){
    	resError(res,'参数错误');
    	return ;
    }
	 poemDao.queryLovePoem(id,userid,function(err,loves){
    	if(err){
    		resError(res,err)
    	}else{
    		if(loves.length > 0 ){
    			var loveid = loves[0].id
    			poemDao.updateLovePoem(loveid,userid,love,time,function(err,result){
    				if(err){
			    		resError(res,err);
			    	}else{
			    		var lovejson = {id:loveid,pid:parseInt(id),userid:userid,love:parseInt(love),time:time}
			    		resSuccess(res,lovejson);
			    	}
    			})
    		}else{
    			poemDao.addLovePoem(id,userid,love,time,function(err,result){
    				if(err){
			    		resError(res,err)
			    	}else{
			    		var lovejson = {id:result.insertId,pid:parseInt(id),userid:userid,love:parseInt(love),time:time}
			    		resSuccess(res,lovejson);
			    	}
    			})
    		}
    		if(love == 1){
    			poemDao.addLoveNum(id,function(err,result){

    			})
    		}else{
    			poemDao.reduceLoveNum(id,function(err,result){

    			})
    		}

    	}
    })
});	
/**
 * 获取点赞列表
 */
router.post('/getloves', function(req, res, next) {
	logReq(req);
	var pid = req.body.id;
	if(!pid){
		resError(res,'参数错误')
	}else{
		poemDao.queryLoves(pid,function(err,result){
			if(err){
	    		resError(res,err)
	    	}else{
	    		resSuccess(res,result);
	    	}
		});
	}
});
/**
 *我的点赞
 */
router.post('/mylove', function(req, res, next) {
	logReq(req);
	var pid = req.body.id;
	var userid = req.body.userid;
	if(!pid){
		resError(res,'参数错误')
	}else{
		poemDao.queryLovePoem(pid,userid,function(err,result){
			if(err){
	    		resError(res,err)
	    	}else{
	    		var love = {id:0};
	    		if(result.length){
	    			love = result[0];
	    		}
	    		resSuccess(res,love);
	    	}
		});
	}
});
/**
 * 作品详情
 */
router.post('/info', function(req, res, next) {
	logReq(req);
	var pid = req.body.pid;
	var userid = req.body.userid;
	if(!pid){
		resError(res,'参数错误')
	}else{
		poemDao.queryPoemInfo(pid,userid,function(err,result){
			if(err){
	    		resError(res,err)
	    	}else{
	    		resSuccess(res,result);
	    	}
		});
	}
});



module.exports = router;
