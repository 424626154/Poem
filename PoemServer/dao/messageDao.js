var pool = require('./dao');
var utils = require('../utils/utils'); 
var logger = require('../utils/log4jsutil').logger(__dirname+'/messageDao.js');

const PUSH_TABLE = 'push'; 
const MESSAGE_TABLE = 'message'; 
module.exports = {
	addPushId:function(userid,pushid,os,callback){
		var time = utils.getTime();
        var sql = 'INSERT INTO '+PUSH_TABLE+' (userid,pushid,os,time) VALUES ("'+userid+'","'+pushid+'","'+os+'",'+time+') ON DUPLICATE KEY UPDATE pushid="'+pushid+'",os="'+os+'",time='+time;
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},
	getPush:function(userid,callback){
		var sql = 'SELECT * FROM '+PUSH_TABLE+' WHERE userid = "'+userid+'"';
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},
	addMessage:function(type,userid,title,content,extend,callback){
		if(extend instanceof Object){
            extend = JSON.stringify(extend);
        }
        logger.debug(typeof(extend));
        logger.debug(extend);
        var time = utils.getTime();
        var sql = 'INSERT INTO '+MESSAGE_TABLE+' (userid,title,content,type,extend,time) VALUES ("'+userid+'","'+title+'","'+content+'",'+type+',\''+extend+'\','+time+')';
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},
    addMessages:function(type,userids,title,content,extend,callback){
        if(extend instanceof Object){
            extend = JSON.stringify(extend);
        }
        logger.debug(extend);
        if(userids.length == 0 ){
            callback(new Error('userids 参数错误'), null);
            return;
        }
        var time = utils.getTime();
        var sql = 'INSERT INTO '+MESSAGE_TABLE+' (userid,title,content,type,extend,time) VALUES ';
        for(var i = 0 ; i < userids.length ; i ++){
            sql = sql+'("'+userids[i]+'","'+title+'","'+content+'",'+type+',\''+extend+'\','+time+'),';
        }
        sql = sql.substr(0,sql.length-1)
        console.log(sql);
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
	getMessage:function(msgid,callback){
		var sql = 'SELECT * FROM '+MESSAGE_TABLE+' WHERE id = '+msgid;
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},
	getMessages:function(userid,callback){
		var sql = 'SELECT * FROM '+MESSAGE_TABLE+' WHERE userid = "'+userid+'" AND state = 0  ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},
	setMessageRead:function(userid,reads,callback){
// 		INSERT INTO t_member (id, name, email) VALUES
//     (1, 'nick', 'nick@126.com'),
//     (4, 'angel','angel@163.com'),
//     (7, 'brank','ba198@126.com')
// ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email)
		var sql = 'INSERT INTO '+MESSAGE_TABLE+' (id,state) VALUES '
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