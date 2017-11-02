var mysql = require('mysql');
var config = require('../conf/config').config;
var $conf = require('../conf/db');
var dbconf = $conf.mysql;
if(config.mysqldb == 'docker'){
	dbconf = $conf.docker_mysql;
}
console.log(dbconf);
// 使用连接池，提升性能
var pool  = mysql.createPool(dbconf);
pool.getConnection(function(err, connection) {
  // connected! (unless `err` is set)
  console.error(err)
});
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