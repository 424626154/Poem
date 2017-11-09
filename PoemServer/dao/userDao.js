var pool = require('./dao');
var utils = require('../utils/utils');
var logger = require('../utils/log4jsutil').logger(__dirname+'/userDao.js');
const FOLLOW_TABLE = 'follow';//关注表
const USER_TABLE = 'user';
const VALIDATE_TABLE = 'validate';//验证码
module.exports = {
	// 查询用户
	queryUser:function(phone,callback){
		console.log("phone:",phone)
		var sql = 'SELECT * FROM user WHERE phone = ? LIMIT 1';
        pool.getConnection(function(err, connection) {
            try{
                connection.query(sql, phone, function(err, result) {
                    callback(err, result)
                    connection.release();
                });
            }catch(err){
                logger.error(err);
                callback(err,null);
            }
        });
	},
    queryUserFromId:function(userid,callback){
        var sql = 'SELECT * FROM user WHERE userid = ? LIMIT 1';
        pool.getConnection(function(err, connection) {
            connection.query(sql, userid, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    queryUserInfo:function(userid,callback){
        var userinfo = 'SELECT user.userid,user.head,user.pseudonym FROM '+USER_TABLE+' WHERE userid = "'+userid+'"';
        var myfollow = ' SELECT COUNT(*) AS count FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND fstate = 1';
        var followme = ' SELECT COUNT(*) AS count FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND tstate = 1';
        var sql = userinfo+';'+myfollow+';'+followme;
        console.log(sql);
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                if(err){
                  callback(err, result)
                  connection.release();  
                }else{
                  var user = {};
                  if(result[0].length > 0){
                     user = result[0][0];
                     user.myfollow = result[1][0].count;
                     user.followme = result[2][0].count;
                  }
                  callback(err, user)
                  connection.release();                  
                }

            });
        });
    },
    queryOtherInfo:function(myid,userid,callback){
        var userinfo = 'SELECT user.userid,user.head,user.pseudonym FROM '+USER_TABLE+' WHERE userid = "'+userid+'"';
        var myfollow = ' SELECT COUNT(*) AS count FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND fstate = 1';
        var followme = ' SELECT COUNT(*) AS count FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND tstate = 1';
        var follow = 'SELECT follow.fstate,follow.tstate FROM '+FOLLOW_TABLE+' WHERE userid = "'+myid+'" AND fansid = "'+userid+'"';
        var sql = userinfo+';'+myfollow+';'+followme+';'+follow;
        // console.log(sql);
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                if(err){
                  callback(err, result)
                  connection.release();  
                }else{
                  var user = {};
                  if(result[0].length > 0){
                     user = result[0][0];
                     user.myfollow = result[1][0].count;
                     user.followme = result[2][0].count;
                     user.fstate = 0;
                     user.tstate = 0;
                     if(result[3].length > 0){
                       user.fstate = result[3][0].fstate;
                       user.tstate = result[3][0].tstate;
                     }
                  }
                  callback(err, user)
                  connection.release();                  
                }

            });
        });
    },
    queryAllUserIdFromOs(os,callback){
        var sql = '';
        if(os == 'all'){
            sql = 'SELECT user.userid FROM '+USER_TABLE;
        }else if(os == 'android'||os == 'ios'){
            sql = 'SELECT user.userid FROM '+USER_TABLE+' WHERE os = "'+os+'"';
        }else{
            callback(new Error('os 参数错误'),null);
            return;
        }
        console.log(sql);
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
	addUser:function(userid,phone,password,os,callback){
		var sql = 'INSERT INTO user(userid,phone,password,os) VALUES(?,?,?,?)';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [userid,phone,password,os], function(err, result) {
            	if(err){
                    callback(err, result)
                    connection.release();                   
                }else{
                    var id = result.insertId;
                    sql = 'SELECT * FROM '+USER_TABLE+' WHERE id = ?';
                    connection.query(sql,[id],function(err, result){
                        callback(err, result)
                        connection.release();  
                    })
                }

            });
        });
	},
	// 查询验证 1注册验证码 2修改密码验证码
	queryValidate:function(phone,type,callback){
		var sql = 'SELECT * FROM validate WHERE phone = ? AND type = ?';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [phone,type], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	// 添加验证码
	addValidate:function(phone,type,code,time,callback){
		console.log('addValidate:'+code)
		var sql = 'INSERT INTO validate(phone,type,code,time) VALUES(?,?,?,?)';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [phone,type,code,time],function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	// 修改验证码
	updateValidate:function(phone,type,code,time,callback){
		console.log('updateValidate:'+code+'phone:'+phone)
		var sql = 'UPDATE validate SET code = ? , time = ? WHERE phone = ? AND type = ?';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [code,time,phone,type], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    updateAliSms:function(phone,type,RequestId,BizId,callback){
        var sql = 'UPDATE validate SET RequestId = ? , BizId = ? WHERE phone = ? AND type = ?';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [RequestId,BizId,phone,type], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    updateJPushSms:function(phone,type,msg_id,callback){
        var sql = 'UPDATE validate SET msg_id = ? WHERE phone = ? AND type = ?';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [msg_id,phone,type], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    updateUserInfo:function(userid,head,pseudonym,callback){
        var sql = 'UPDATE user SET head = ? , pseudonym = ? WHERE userid = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [head,pseudonym,userid], function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    var sql1 = 'SELECT * FROM user WHERE userid = ? ';
                    connection.query(sql1, [userid], function(err, result) {
                        callback(err, result)
                        connection.release();
                    });
                }
            });
        });
    },
    updateUserOs:function(userid,os,callback){
        var sql = 'UPDATE user SET os = ?  WHERE userid = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [os,userid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    updateUserPwd:function(phone,password,callback){
        var sql = 'UPDATE user SET password = ?  WHERE phone = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [password,phone], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    /**
     * 关注取关操作
     * return        {
              id: 50,
              userid: 'userid_13212345676',
              fansid: 'userid_13671172337',
              fstate: 1,
            }
     */
    upFollow:function(userid,fansid,op,callback){
        pool.getConnection(function(err, connection) {
            var sql0 = 'INSERT INTO '+FOLLOW_TABLE+' (userid,fansid,fstate) VALUES ("'+userid+'","'+fansid+'",'+op+') ON DUPLICATE KEY UPDATE fstate='+op;
            var sql1 = 'INSERT INTO '+FOLLOW_TABLE+' (userid,fansid,tstate) VALUES ("'+fansid+'","'+userid+'",'+op+') ON DUPLICATE KEY UPDATE tstate='+op;
            var sql = sql0+';'+sql1;
            console.log(sql);
            connection.query(sql,function(err,result){
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    sql = 'SELECT * FROM '+FOLLOW_TABLE+' WHERE userid = ? AND fansid = ?';
                    connection.query(sql,[userid,fansid],function(err,result){
                        var follow = {};
                        if(result.length > 0){
                            follow = result[0];
                        }
                        callback(err,follow);
                        connection.release();
                    });
                }
    
            });
        });
    },
    /**
     * 关注列表
     */
    queryFollow:function(userid,callback){
        pool.getConnection(function(err, connection) {
            var left_user = 'LEFT JOIN '+USER_TABLE+' ON follow.fansid = user.userid';
            var sql0 = 'SELECT * FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND fstate = 1';
            sql0 = 'SELECT follow.*,user.head,user.pseudonym FROM ('+sql0+') AS follow '+left_user;
            var sql1 = 'SELECT * FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND tstate = 1';
            sql1 = 'SELECT follow.*,user.head,user.pseudonym FROM ('+sql1+') AS follow '+left_user;
            var sql = sql0+';'+sql1;
            console.log(sql);
            connection.query(sql,function(err,result){
                callback(err, result)
                connection.release();
            });
        });
    },
    /**
     * 关注列表
     */
    queryFollowType:function(myid,userid,type,callback){
        pool.getConnection(function(err, connection) {
            var left_user = 'LEFT JOIN '+USER_TABLE+' ON follow.fansid = user.userid';
            var left_follow = 'LEFT JOIN '+FOLLOW_TABLE+' AS myfollow ON follows.fansid = myfollow.fansid AND myfollow.userid = "'+myid+'"';
            var sql0 = 'SELECT * FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND fstate = 1';
            sql0 = 'SELECT follow.*,user.head,user.pseudonym FROM ('+sql0+') AS follow '+left_user;
            if(myid != userid){
                 sql0 = 'SELECT follows.*,myfollow.fstate,myfollow.tstate FROM ('+sql0+') AS follows '+left_follow;
            }
            var sql1 = 'SELECT * FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND tstate = 1';
            sql1 = 'SELECT follow.*,user.head,user.pseudonym FROM ('+sql1+') AS follow '+left_user;
            if(myid != userid){
                 sql1 = 'SELECT follows.id,follows.userid,follows.fansid,follows.head,follows.pseudonym,IFNULL(myfollow.fstate,0) AS fstate,IFNULL(myfollow.tstate,0) AS tstate FROM ('+sql1+') AS follows '+left_follow;
            }
            var sql = sql0;
            if(type == 1){
                sql = sql1;
            }
            connection.query(sql,function(err,result){
                callback(err, result)
                connection.release();
            });
        });
    },

}