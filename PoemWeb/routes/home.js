var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var adminUserDao = require('../dao/adminUserDao');
/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.cookies.user;
  if(!user){
  	res.redirect("/login");
  	return ;
  }
  var op = req.query.op;
  if(op == 'logout'){
  	res.clearCookie('user');
  	res.redirect("/login");
  	return;
  }
  res.render('home', { user: user });
});

router.get('/login', function(req, res, next) {
  // console.log(req.cookies.user)
  res.render('login',{err:''});
});

router.post('/login',multipartMiddleware, function(req, res, next) {
  console.log(req.body)
  var user = req.body.user;
  var password = req.body.password;
  var autologin = req.body.autologin;
  if(!user||!password){
    res.render('login',{err:'参数错误'});
    return;
  }
  var maxAge = 10;
  if(autologin){
  	 maxAge = 1<<31 - 1;
  }
  adminUserDao.queryAdminUser(user,function(err,result){
      if(err){
        res.render('login',{err:err});
      }else{
        if(result.length > 0){
          var user = result[0];
          console.log(result)
          if(user.password == password){
              res.cookie('user',user.account, {maxAge:maxAge});
              res.redirect("/");
          }else{
            res.render('login',{err:'密码错误'});
          }
        }else{
          res.render('login',{err:'用户名错误'});
        }
      }
  });
  // console.log(maxAge)
  // res.render('login');
});

module.exports = router;
