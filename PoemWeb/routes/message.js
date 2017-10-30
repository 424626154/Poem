var express = require('express');
var router = express.Router();
var http = require('http');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
function sendAllPush(title,content,callback){
	var data = {
		title:title,
		content:content,
	}
	data = JSON.stringify(data);  
	var opt = {  
        method: "POST",  
        host: 'localhost',  
        port: 3000,  
        path: "/message/sendall",  
        headers: {  
            "Content-Type": 'application/json;charset=utf-8',  
            "Content-Length": data.length,
        },
    }; 
    var req = http.request(opt, function (serverJG) {  
        if (serverJG.statusCode == 200) {  
            var body = "";  
            serverJG
            .on('data', function (data) { 
            	body += data; 
            })  
                          
            .on('end', function () { 
             	var json_data = JSON.parse(body);
             	if(json_data.code == 0){
             		callback(null,json_data.data);   
             	}else{
             		callback(new Error(json_data.code),null)  
             	}     
            });  
        }  
        else {  
            // res.send(500, "error");  
            callback(new Error(serverJG.statusCode),null);   
        }  
    });  
    req.write(data + "\n");  
    req.end(); 
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('message');
});

router.get('/send',function(req, res, next){
  console.log('get send');
	res.render('sendmsg');
});

router.post('/send',multipartMiddleware,function(req, res, next){
	console.log('post send');
	// res.send('sendmsg');
	console.log(req.body);
	var title = req.body.title;
	var content = req.body.info;
	if(title&&content){
    sendAllPush(title,content,function(err,data){
       if(err){

       }else{

       }
       console.log(err);
       console.log(data);
    });
	}
  res.redirect(303, '/message'); 
});

module.exports = router;