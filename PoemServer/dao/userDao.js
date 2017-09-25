var mysql = require('mysql');
var $conf = require('../conf/db');
// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res,err, ret) {
	if(err){
		res.json({
            code:'1',
            msg: err
        });
	}else if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
	// 查询用户
	queryUser:function(phone,callback){
		console.log("phone:",phone)
		var sql = 'SELECT * FROM user WHERE phone = ?';
        pool.getConnection(function(err, connection) {
            connection.query(sql, phone, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    queryUserInfo:function(userid,callback){
        var sql = 'SELECT * FROM user WHERE userid = ?';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [userid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
	addUser:function(userid,phone,password,callback){
		var sql = 'INSERT INTO user(userid,phone,password) VALUES(?,?,?)';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [userid,phone,password], function(err, result) {
            	callback(err, result)
                connection.release();
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
    }



}