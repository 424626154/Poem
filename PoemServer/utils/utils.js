var crypto = require('crypto');
module.exports = {
	getCode:function(){
		var code=''; 
		for(var i=0;i<6;i++) 
		{ 
		  code+=Math.floor(Math.random()*10); 
		} 
		return  code;
	},
	getTime:function(){
		var time = parseInt(Date.now()/1000)
		return time;
	},
	getUserid:function(phone){
		var userid = 'userid_'+phone;
		return userid;
	},
	/**
	 * 随机数
	 */
	getNonce:function(length){
		var nonce=''; 
		for(var i=0;i<length;i++) 
		{ 
		  nonce+=Math.floor(Math.random()*10); 
		} 
		return  nonce;
	},
	/**
	 * 当前UTC时间戳，从1970年1月1日0点0 分0 秒开始到现在的秒数(String)
	 */
	getCurTimeStr:function(){
		var time = parseInt(Date.now()/1000)
		return time+'';
	},
	/**
	 * 计算CheckSum
	 * @param  {String} appSecret 网易生成
	 * @param  {String} nonce     随机数（最大长度128个字符）
	 * @param  {String} curTime   当前UTC时间戳，从1970年1月1日0点0 分0 秒开始到现在的秒数(String)
	 * @return {[type]}                  [description]
	 */
	getCheckSum:function(appSecret ,nonce, curTime) {
        // return encode("sha1", appSecret + nonce + curTime);
		var str = appSecret + nonce + curTime;
		var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
	    sha1.update(str);
	    var checkSum = sha1.digest("hex");  //加密后的值d
	    // console.log('appSecret:'+appSecret+'\nnonce:'+nonce+'\ncurTime:'+curTime);
	    // console.log('checkSum:'+checkSum)
	    return checkSum;
    },
    /**
     * 判断是否为手机号  
     */
	 isPoneAvailable:function(pone){  
	   var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;  
	   if (!myreg.test(pone)) {  
	     return false;  
	   } else {  
	     return true;  
	   }  
	 }
}