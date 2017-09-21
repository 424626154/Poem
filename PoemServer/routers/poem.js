var express = require('express');
var router = express.Router();
var poemDao = require('../dao/poemDao');
var utils = require('../utils/utils'); 
var ResJson = function(){
	this.code;
	this.data;
	this.errmsg ;
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.send('poem');
});
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

router.post('/newestpoem', function(req, res, next) {
	console.log('req /poem/newestpoem body:'+req.body)
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

router.post('/historypoem', function(req, res, next) {
	console.log('req /poem/historypoem body:'+req.body)
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

router.post('/historyallpoem', function(req, res, next) {
	console.log('req /poem/historyallpoem body:'+req.body)
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


module.exports = router;
