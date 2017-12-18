var pool = require('./dao');
var utils = require('../utils/utils'); 

const OPOEM_TABLE = 'opoem'; 

module.exports = {
	querySearchOPoem(author,callback){ 
		var sql = 'SELECT * FROM '+OPOEM_TABLE+' WHERE author = "'+author+'" ORDER BY id DESC LIMIT 10';
		pool.getConnection(function(err, connection) {
            connection.query(sql,function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
}