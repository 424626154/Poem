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
  res.render('user', { user: user,err:'',userid:'',phone:'' });
});

router.post('/',multipartMiddleware, function(req, res, next) {
  var user = req.cookies.user;
  if(!user){
    res.redirect("/login");
    return ;
  }
  console.log(req.body)
  var userid = req.body.userid;
  var phone = req.body.phone;
  var body = {};
  if(userid ||phone){
    if(userid){
      body.op = 'userid';
      body.userid = userid;
    }else if(phone){
      body.op = 'phone';
      body.phone = phone;
    }
    httputil.sendPost('/admin/user',body,function(err,data){
      console.log('abc')
      console.log(err)
      console.log(data)
     if(err){
        res.render('user',{ user: user,err:err,userid:'',phone:'' });
     }else{
        res.render('user', { user: user,err:'',userid:data.userid,phone:data.phone });
     }
    });
  }else{
    res.render('user', { user: user,err:'参数错误',userid:'',phone:'' });
  }
});

module.exports = router;
