var mysql = require('mysql');
var $conf = require('../conf/db');
// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

const FOLLOW_TABLE = 'follow';//关注表
const USER_TABLE = 'user';

module.exports = {
	// 查询用户
	queryUser:function(phone,callback){
		console.log("phone:",phone)
		var sql = 'SELECT * FROM user WHERE phone = ? LIMIT 1';
        pool.getConnection(function(err, connection) {
            connection.query(sql, phone, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    queryUserInfo:function(userid,callback){
        var userinfo = 'SELECT * FROM '+USER_TABLE+' WHERE userid = "'+userid+'"';
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
	addUser:function(userid,phone,password,callback){
		var sql = 'INSERT INTO user(userid,phone,password) VALUES(?,?,?)';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [userid,phone,password], function(err, result) {
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
	// 查询验证
	queryValidate:function(phone,callback){
		var sql = 'SELECT * FROM validate WHERE phone = ?';
        pool.getConnection(function(err, connection) {
            connection.query(sql, phone, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	// 添加验证码
	addValidate:function(phone,code,time,callback){
		console.log('addValidate:'+code)
		var sql = 'INSERT INTO validate(phone,code,time) VALUES(?,?,?)';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [phone,code,time],function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	// 修改验证码
	updateValidate:function(phone,code,time,callback){
		console.log('updateValidate:'+code+'phone:'+phone)
		var sql = 'UPDATE validate SET code = ? , time = ? WHERE phone = ?';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [code,time,phone], function(err, result) {
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
    /**
     * 关注取关操作
     */
    upFollow:function(userid,fansid,op,callback){
        pool.getConnection(function(err, connection) {
            var sql0 = 'INSERT INTO '+FOLLOW_TABLE+' (userid,fansid,fstate) VALUES ("'+userid+'","'+fansid+'",'+op+') ON DUPLICATE KEY UPDATE fstate='+op;
            var sql1 = 'INSERT INTO '+FOLLOW_TABLE+' (userid,fansid,tstate) VALUES ("'+fansid+'","'+userid+'",'+op+') ON DUPLICATE KEY UPDATE tstate='+op;
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
    queryFollowType:function(userid,type,callback){
        pool.getConnection(function(err, connection) {
            var left_user = 'LEFT JOIN '+USER_TABLE+' ON follow.fansid = user.userid';
            var sql0 = 'SELECT * FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND fstate = 1';
            sql0 = 'SELECT follow.*,user.head,user.pseudonym FROM ('+sql0+') AS follow '+left_user;
            var sql1 = 'SELECT * FROM '+FOLLOW_TABLE+' WHERE userid = "'+userid+'" AND tstate = 1';
            sql1 = 'SELECT follow.*,user.head,user.pseudonym FROM ('+sql1+') AS follow '+left_user;
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