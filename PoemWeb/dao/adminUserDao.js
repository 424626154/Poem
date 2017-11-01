var mysql = require('mysql');
var $conf = require('../conf/db');
// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

module.exports = {
	queryAdminUser:function(account,callback){
		var sql = 'SELECT * FROM admin_user WHERE account = ? LIMIT 1';
        pool.getConnection(function(err, connection) {
            connection.query(sql, account, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
}