var pool = require('./dao');

const OPLABEL_TABLE = 'oplabel'; 

module.exports = {
    queryAuthors(callback){
        var sql = 'SELECT * FROM '+OPLABEL_TABLE+' WHERE del = 0 ORDER BY id';
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result);
                connection.release();
            });
        });
    }
}