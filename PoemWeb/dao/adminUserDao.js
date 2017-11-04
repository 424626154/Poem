var pool = require('./dao');

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