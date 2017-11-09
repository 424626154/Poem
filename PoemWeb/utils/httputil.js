var http = require('http');
var request = require('request');
var utils = require('./utils');
module.exports = {
  sendPost:function(path,data,callback){
      data = JSON.stringify(data); 
      console.log('---post server'+path+' body:'+data); 
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
        var req = http.request(opt, function (serverJG) {  
            if (serverJG.statusCode == 200) {  
                var body = "";  
                serverJG
                .on('data', function (data) { 
                  body += data; 
                  console.log(data.toString())
                })  
                              
                .on('end', function () { 
                  console.log('@@@@@@');
                  console.log(body);
                  var json_data = JSON.parse(body);
                  if(json_data.code == 0){
                    console.log('---response post server'+path+' err: null data:'+JSON.stringify(json_data.data)+'\n');
                    callback(null,json_data.data);   
                  }else{
                    console.log('---response post server'+path+' err:'+body+' data:null\n'); 
                    callback(new Error(JSON.stringify(json_data)),null)  
                  }     
                });  
            }  
            else {  
                // res.send(500, "error");  
                console.log('---response post server'+path+' err:'+serverJG.statusCode+' data:null\n'); 
                callback(new Error(serverJG.statusCode),null);   
            }  
        });  
        req.write(data + "\n");  
        req.end(); 
    },
}


