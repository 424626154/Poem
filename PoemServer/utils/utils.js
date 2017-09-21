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
		console.log(time);
		return time;
	},
	getUserid:function(phone){
		var userid = 'userid_'+phone;
		return userid;
	}
}