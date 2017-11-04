var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var httputil = require('../utils/httputil');
/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.cookies.user;
  if(!user){
    res.redirect("/login");
    return ;
  }
  res.render('message',{ user: user });
});

router.get('/send',function(req, res, next){
  console.log('---get '+req.originalUrl+' body:'+JSON.stringify(req.body));
  var user = req.cookies.user;
  if(!user){
    res.redirect("/login");
    return ;
  }
	res.render('sendmsg',{ user: user,err:'',success:''});
});

router.post('/send',multipartMiddleware,function(req, res, next){
  console.log('---post /message/send body:'+JSON.stringify(req.body));
  var user = req.cookies.user;
  if(!user){
    res.redirect("/login");
    return ;
  }
  var body = req.body;
  var userid = body.userid;
	var title = body.title;
	var content = body.content;
	if(!userid||!title||!content){
      err = "参数错误!";
      res.render('sendmsg',{ user: user,err:err,success:'' });
      return;
	}else{
      httputil.sendPost('/admin/pushuser',body,function(err,data){
       if(err){
          res.render('sendmsg',{ user: user,err:err.message,success:'' });
       }else{
          // res.redirect("/message");
          var success = {
            userid:userid,
            title:title,
            content:content,
            sendno:data.sendno,
            msg_id:data.msg_id,
          }
          res.render('sendmsg',{ user: user,err:'',success:JSON.stringify(success)});
       }
      });
  }
});


router.get('/sendall',function(req, res, next){
  var user = req.cookies.user;
  if(!user){
    res.redirect("/login");
    return ;
  }
  console.log('get sendall');
  res.render('sendall',{ user: user,err:'',success:'' });
});

router.post('/sendall',multipartMiddleware,function(req, res, next){
  var user = req.cookies.user;
  if(!user){
    res.redirect("/login");
    return ;
  }
  console.log('post sendall');
  // res.send('sendmsg');
  console.log(req.body);
  var body = req.body;
  var title = body.title;
  var content = body.content;
  var os = body.os;
  var err = "";
  if(!title||!content||!os){
    err = "参数错误!";
    res.render('sendall',{ user: user,err:err,success:'' });
  }else{
      httputil.sendPost('/admin/pushall',body,function(err,data){
       if(err){
          res.render('sendall',{ user: user,err:err,success:'' });
       }else{
          // res.redirect("/message");
          var success = {
            title:title,
            content:content,
            sendno:data.sendno,
            msg_id:data.msg_id,
          }
          res.render('sendall',{ user: user,err:'',success:JSON.stringify(success)});
       }
      });
  }
});



module.exports = router;