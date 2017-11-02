var mysql = require('mysql');
var $conf = require('../conf/db');
var mysqldb = require('../conf/config').server.mysqldb;
var utils = require('../utils/utils');
var logger = require('../utils/log4jsutil').logger(__dirname+'/dao.js');



var dbconf = $conf.mysql;
if(mysqldb == 'docker'){
	dbconf = $conf.docker_mysql;
}
logger.info('---连接数据库 类型:'+mysqldb+' 参数:'+JSON.stringify(dbconf));
// 使用连接池，提升性能
var pool  = mysql.createPool(dbconf);
pool.getConnection(function(err, connection) {
  // connected! (unless `err` is set)
  if(err){
  	 logger.error(err)  
  }
});

module.exports = pool;