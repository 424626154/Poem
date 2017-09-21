var mysql = require('mysql');
var $conf = require('../conf/db');
// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);
module.exports = {

	addPoem:function(userid,poem,time,callback){
		var sql = 'INSERT INTO mypoem(userid,poem,time) VALUES(?,?,?)';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [userid,poem,time], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	queryNewestPoem(userid,fromid,callback){
		var sql = 'SELECT * FROM mypoem WHERE id>? AND userid = ? ORDER BY id DESC LIMIT 20';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,userid], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},

	queryHistoryPoem(userid,fromid,callback){
		var sql = 'SELECT * FROM mypoem WHERE id<? AND userid = ? ORDER BY id DESC LIMIT 20';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,userid], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	queryNewestAllPoem(fromid,callback){
		var sql = 'SELECT * FROM mypoem WHERE id>?  ORDER BY id DESC LIMIT 20';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},

	queryHistoryAllPoem(fromid,callback){
		var sql = 'SELECT * FROM mypoem WHERE id<?  ORDER BY id DESC LIMIT 20';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
}