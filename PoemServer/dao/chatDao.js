var pool = require('./dao');
var utils = require('../utils/utils'); 
var logger = require('../utils/log4jsutil').logger(__dirname+'/messageDao.js');

const CHAT_TABLE = 'chat'; 
const USER_TABLE = 'user';

module.exports = {
	/**
	 * 添加聊天
	 */
	addChat(type,fuserid,tuserid,msg,extend,callback){
		if(extend instanceof Object){
            extend = JSON.stringify(extend);
        }
        logger.debug(extend);
		var time = utils.getTime();
        var sql = 'INSERT INTO '+CHAT_TABLE+' (type,fuserid,tuserid,msg,extend,time) VALUES (?,?,?,?,?,?)';
        pool.getConnection(function(err, connection) {
            connection.query(sql,[type,fuserid,tuserid,msg,extend,time], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},
	/**
	 * 查询未读消息
	 */
	queryChats(userid,callback){
		var sql = 'SELECT * FROM '+CHAT_TABLE+' WHERE tuserid = "'+userid+'" AND state = 0 ';
        sql = 'SELECT chat.*,user.head,user.pseudonym FROM ('+sql+') AS chat LEFT JOIN '+USER_TABLE+' ON chat.fuserid = user.userid ORDER BY time ASC';
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},
	/**
	 * 查询指定未读消息
	 */
	queryFidChats(userid,fuserid,callback){
		var sql = 'SELECT * FROM '+CHAT_TABLE+' WHERE fuserid = "'+fuserid+'" AND tuserid = "'+userid+'" AND state = 0  ';
        sql = 'SELECT chat.*,user.head,user.pseudonym FROM ('+sql+') AS chat LEFT JOIN '+USER_TABLE+' ON chat.fuserid = user.userid ORDER BY time ASC';
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},
	/**
	 * 设置已读
	 */
	setChatRead:function(userid,reads,callback){
		var sql = 'INSERT INTO '+CHAT_TABLE+' (id,state) VALUES '
		for(var i = 0 ; i < reads.length ; i ++){
		sql = sql + '('+reads[i]+',1),'
		}
		sql = sql.substr(0,sql.length-1)
		sql = sql + ' ON DUPLICATE KEY UPDATE state = VALUES(state)';
		console.log(sql);
		pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	}

}

