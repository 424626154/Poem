var ResJson = function(){
	this.code;
	this.data;
	this.errmsg ;
}
module.exports ={
	/**
	 * 返回错误
	 */
	resError:function(res,err){
		console.error(err)
		var resjson = new ResJson();
		resjson.code = 1;
		resjson.errmsg = err;
		res.json(resjson)
	},
	/**
	 * 返回成功
	 */
	resSuccess:function(res,data){
		var resjson = new ResJson();
		resjson.code = 0;
		resjson.data = data;
		console.log('---res succes--- data:',data)
		res.json(resjson)
	},
	/**
	 * 打印
	 */
	logReq:function(req){
		console.log('url:'+req.originalUrl+' body:'+JSON.stringify(req.body));
	}
}