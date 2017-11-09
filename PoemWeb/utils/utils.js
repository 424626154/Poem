var config = require('../conf/config').config;
module.exports = {
	getTime:function(){
		var time = parseInt(Date.now()/1000)
		return time;
	},
	getJPushAuthorization:function(){
		let author = '';
		author = config.jappkey+':'+config.jmasterSecret;
		console.log('author :'+author);
		author = new Buffer(author).toString('base64');
		console.log('author base64:'+author);
		return author;
	}
}