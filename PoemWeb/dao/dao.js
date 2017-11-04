var mysql = require('mysql');
var config = require('../conf/config').config;
var $conf = require('../conf/db');
var logger = require('../utils/log4jsutil').logger(__dirname+'/dao.js');

var dbconf = $conf.mysql;
if(config.mysqldb == 'docker'){
	dbconf = $conf.docker_mysql;
}
console.log(dbconf);
// 使用连接池，提升性能
var pool  = mysql.createPool(dbconf);
pool.getConnection(function(err, connection) {
  // connected! (unless `err` is set)
  if(err){
  	  logger.error(err)
  }
});

module.exports = pool;