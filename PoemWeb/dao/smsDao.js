var pool = require('./dao');
var utils = require('../utils/utils');

module.exports = {
	addFeedback:function(feedback,userid,contact,callback){
		var time = utils.getTime();
		var sql = 'INSERT INTO admin_feedback (userid,feedback,contact,time) VALUES (?,?,?,?)';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [userid,feedback,contact,time], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	querySms(usetype,callback){
		var sql = 'SELECT * FROM admin_jpush_sms WHERE usetype = ? AND del = 0 ORDER BY id DESC';
        pool.getConnection(function(err, connection) {
            connection.query(sql,[usetype], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    delFeedback(id,callback){
        var sql = 'UPDATE admin_feedback SET del = 1 WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, id, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    }
}