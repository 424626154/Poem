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

function resultToDatas(result){
   var len = result.length;
   var datas = [];
   for(let i=0;i<len;i++){
       datas.push(result[i]);
   }
   console.log('---results to datas---:'+JSON.stringify(datas));
   return datas;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.send('poem');
});
// 添加作品
router.post('/addpoem', function(req, res, next) {
  //res.send('respond with a resource');
    var userid = req.body.userid;
    var poem = req.body.poem;
    var time = utils.getTime();
    if(!poem||!userid){
    	var resjson = new ResJson();
		resjson.code = 1;
		resjson.errmsg = '参数错误';
		res.json(resjson)
    }else{
    	poemDao.addPoem(userid,poem,time,function(err,result){
	    	if(err){
	    		var resjson = new ResJson();
				resjson.code = 1;
				resjson.errmsg = err;
				res.json(resjson)
	    	}else{
	    		var resjson = new ResJson();
				resjson.code = 0;
				resjson.data = {id:result.insertId,userid:userid,poem:poem,time:time};
				res.json(resjson)
	    	}
	    })
    }

});
// 修改作品
router.post('/uppoem', function(req, res, next) {
  	console.log('req poem/uppoem')
    var id = req.body.id;
    var userid = req.body.userid;
    var poem = req.body.poem;
    if(!poem||!id||!userid){
    	var resjson = new ResJson();
		resjson.code = 1;
		resjson.errmsg = '参数错误';
		res.json(resjson)
    }else{
    	poemDao.upPoem(id,userid,poem,function(err,result){
	    	if(err){
	    		var resjson = new ResJson();
				resjson.code = 1;
				resjson.errmsg = err;
				res.json(resjson)
	    	}else{
	    		var resjson = new ResJson();
				resjson.code = 0;
				resjson.data = {id:parseInt(id),userid:userid,poem:poem};
				res.json(resjson)
	    	}
	    })
    }

});
//删除作品
router.post('/delpoem', function(req, res, next) {
    var userid = req.body.userid;
    var id = req.body.id;
    if(!id||!userid){
    	var resjson = new ResJson();
		resjson.code = 1;
		resjson.errmsg = '参数错误';
		res.json(resjson)
    }else{
    	poemDao.delPoem(id,userid,function(err,result){
    		console.log(result);
	    	if(err){
	    		var resjson = new ResJson();
				resjson.code = 1;
				resjson.errmsg = err;
				res.json(resjson)
	    	}else{
	    		var resjson = new ResJson();
				resjson.code = 0;
				resjson.data = {id:parseInt(id),userid:userid};
				res.json(resjson)
	    	}
	    })
    }
});

//新作品
router.post('/newestpoem', function(req, res, next) {
	console.log('req /poem/newestpoem body:'+JSON.stringify(req.body))
	var userid = req.body.userid;
    var id = req.body.id;
    if(!userid){
    	var resjson = new ResJson();
		resjson.code = 1;
		resjson.errmsg = '参数错误';
		res.json(resjson)
    }else{
    	 poemDao.queryNewestPoem(userid,id,function(err,poems){
    	 	console.log(err)
	    	if(err){
	    		var resjson = new ResJson();
				resjson.code = 1;
				resjson.errmsg = err;
				res.json(resjson)
	    	}else{
	    		var resjson = new ResJson();
				resjson.code = 0;
				resjson.data = poems;
				res.json(resjson)
	    	}
	    })
    }
});	
// 历史作品
router.post('/historypoem', function(req, res, next) {
	console.log('req /poem/historypoem body:'+JSON.stringify(req.body));
	var userid = req.body.userid;
    var id = req.body.id;
    if(!id||!userid){
    	var resjson = new ResJson();
		resjson.code = 1;
		resjson.errmsg = '参数错误';
		res.json(resjson)
    }else{
    	poemDao.queryHistoryPoem(userid,id,function(err,poems){
	    	if(err){
	    		var resjson = new ResJson();
				resjson.code = 1;
				resjson.errmsg = err;
				res.json(resjson)
	    	}else{
	    		var resjson = new ResJson();
				resjson.code = 0;
				resjson.data = poems;
				res.json(resjson)
	    	}
	    })
    }
});	

// 新所有作品
router.post('/newestallpoem', function(req, res, next) {
	console.log('req /poem/newestallpoem body:'+req.body)
    var id = req.body.id;
	 poemDao.queryNewestAllPoem(id,function(err,poems){
	 	console.log(err)
    	if(err){
    		var resjson = new ResJson();
			resjson.code = 1;
			resjson.errmsg = err;
			res.json(resjson)
    	}else{
    		var resjson = new ResJson();
			resjson.code = 0;
			resjson.data = poems;
			res.json(resjson)
    	}
    })

});	
// 历史所有作品
router.post('/historyallpoem', function(req, res, next) {
	console.log('req /poem/historyallpoem body:'+req.body)
    var id = req.body.id;
	 poemDao.queryHistoryAllPoem(id,function(err,poems){
	 	console.log(err)
    	if(err){
    		var resjson = new ResJson();
			resjson.code = 1;
			resjson.errmsg = err;
			res.json(resjson)
    	}else{
    		var resjson = new ResJson();
			resjson.code = 0;
			resjson.data = poems;
			res.json(resjson)
    	}
    })
});	

// 评论作品
router.post('/commentpoem', function(req, res, next) {
	console.log('req /poem/commentpoem body:'+JSON.stringify(req.body))
    var id = req.body.id;
    var userid = req.body.userid;
    var replyid = req.body.replyid;
    var comment = req.body.comment;
    var time = utils.getTime();
	if(!id||!userid||!comment){
		var resjson = new ResJson();
		resjson.code = 1;
		resjson.errmsg = '参数错误';
		res.json(resjson)
	}else{
		 poemDao.addPoemComment(id,userid,replyid,comment,time,function(err,comment){
		 	console.log(err)
	    	if(err){
	    		var resjson = new ResJson();
				resjson.code = 1;
				resjson.errmsg = err;
				res.json(resjson)
	    	}else{
	    		var resjson = new ResJson();
				resjson.code = 0;
				resjson.data = comment;
				res.json(resjson)
	    	}
	    })
		poemDao.addCommentNum(id,function(err,comment){})
	}
});	

//拉取新评论
router.post('/newestcomment', function(req, res, next) {
	console.log('req /poem/newestcomment body:'+JSON.stringify(req.body));
    var id = req.body.id;
    var pid = req.body.pid;
    if(!pid){
    	resError(res,'参数错误');
    }else{
    	poemDao.queryNewestComment(id,pid,function(err,comments){
		 	console.error(err)
	    	if(err){
				resError(res,err);
	    	}else{
				resSuccess(res,comments);
	    	}
	    })
    }

});	
//拉取历史评论
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
	console.log('req /poem/getloves body:'+JSON.stringify(req.body))
	var pid = req.body.id;
	if(!pid){
		resError(res,'参数错误')
	}else{
		poemDao.queryLoves(pid,function(err,result){
			if(err){
	    		resError(res,err)
	    	}else{
	    		var loves = resultToDatas(result)
	    		resSuccess(res,loves);
	    	}
		});
	}
});
/**
 *我的点赞
 */
router.post('/mylove', function(req, res, next) {
	console.log('req /poem/mylove body:'+JSON.stringify(req.body))
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

module.exports = router;
