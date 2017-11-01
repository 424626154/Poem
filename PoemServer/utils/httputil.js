var http = require('http');
module.exports = {
	/**
	 * 请求服务器
	 */
	requstPSPost:function(path,data,callback){
	    data = JSON.stringify(data);  
	    console.log('---requstPSPost path:'+path+' data:'+data);  
	    var opt = {  
	        method: "POST",  
	        host: 'localhost',  
	        port: 3000,  
	        path: path,  
	        headers: {  
	            "Content-Type": 'application/json;charset=utf-8',  
	            "Content-Length": Buffer.byteLength(data,'utf-8'),//data.length,
	        },
	    }; 
	    var req = http.request(opt, function (server) {  
	        if (server.statusCode == 200) {  
	            var body = "";  
	            server
	            .on('data', function (data) { 
	            	body += data; 
	            })  
	                          
	            .on('end', function () { 
	             	var result = JSON.parse(body);
	             	console.log('---response requstPSPost path:'+path+' result:'+body);
	             	if(result.code == 0){
	             		callback(null,result.data);   
	             	}else{
	             		callback(new Error(JSON.stringify(result)),null)  
	             	}     
	            });  
	        }  
	        else {  
	        	console.log('---response requstPSPost path:'+path+' err:'+server.statusCode);
	            callback(new Error(server.statusCode),null);   
	        }  
	    });  
	    req.write(data + "\n");  
	    req.end();  
	}
}