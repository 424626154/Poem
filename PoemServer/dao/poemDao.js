var mysql = require('mysql');
var $conf = require('../conf/db');
// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);
module.exports = {
    //添加作品
	addPoem:function(userid,poem,time,callback){
		var sql = 'INSERT INTO mypoem(userid,poem,time) VALUES(?,?,?)';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [userid,poem,time], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    //修改
    upPoem:function(id,userid,poem,callback){
        var sql = 'UPDATE mypoem SET poem = ? WHERE id = ? AND userid = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [poem,id,userid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    // 删除
    delPoem:function(id,userid,callback){
        var sql = 'UPDATE mypoem SET del = 1 WHERE id = ? AND userid = ?';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [id,userid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
	queryNewestPoem(userid,fromid,callback){
		var sql = 'SELECT * FROM mypoem WHERE id>? AND userid = ? AND del = 0 ORDER BY id DESC LIMIT 20';
		console.log('queryNewestPoem sql:'+sql);
        pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,userid], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},

	queryHistoryPoem(userid,fromid,callback){
		var sql = 'SELECT * FROM mypoem WHERE id<? AND userid = ? AND del = 0  ORDER BY id DESC LIMIT 20';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,userid], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	queryNewestAllPoem(fromid,callback){
		var sql = 'SELECT * FROM mypoem WHERE id>?  AND del = 0  ORDER BY id DESC LIMIT 20';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},

	queryHistoryAllPoem(fromid,callback){
		var sql = 'SELECT * FROM mypoem WHERE id<?  AND del = 0 ORDER BY id DESC LIMIT 20';
		pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    //添加作品评论
    addPoemComment(id,userid,replyid,comment,time,callback){
        pool.getConnection(function(err, connection) {
            var comment_data = {
                pid:id,
                userid:userid,
                replyid:0,
                replyuser:'',
                comment:comment,
                time:time,
            }
            if(replyid > 0 ){//回复评论的评论
                var sql = 'SELECT * FROM comment WHERE id = ?';
                connection.query(sql, [replyid], function(err, result) {
                     if(err){
                        callback(err, result)
                        connection.release();
                     }else{
                        var replyuser = result[0].userid;
                        console.log('------result:'+result+'replyuser:'+replyuser)
                        var sql1 = 'INSERT INTO comment(pid,userid,replyid,replyuser,comment,time) VALUES(?,?,?,?,?,?)'
                        connection.query(sql1, [id,userid,replyid,replyuser,comment,time], function(err, result) {
                            if(err){
                                callback(err, result);
                            }else{
                                comment_data.id = result.insertId;
                                comment_data.replyid = replyid;
                                comment_data.replyuser = replyuser;
                                callback(err, comment_data);     
                            }
                            connection.release();
                        });
                     }   
                });
            }else{
                var sql1 = 'INSERT INTO comment(pid,userid,replyid,replyuser,comment,time) VALUES(?,?,?,?,?,?)'
                connection.query(sql1, [id,userid,0,'',comment,time], function(err, result) {
                    if(err){
                        callback(err, result);
                    }else{
                        comment_data.id = result.insertId;
                        callback(err, comment_data)
                    }
                    connection.release();
                });
            }
        });
    },
    //查询最新评论
    queryNewestComment(fromid,pid,callback){
        var sql = 'SELECT * FROM comment WHERE id>?  AND pid = ? AND del = 0  ORDER BY id DESC LIMIT 20';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,pid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    
    /**
     * 查询历史评论
     * @param  {[type]}
     * @param  {[type]}
     * @param  {Function}
     * @return {[type]}
     */
    queryHistoryComment(fromid,pid,callback){
        var sql = 'SELECT * FROM comment WHERE id<?  AND pid = ? AND del = 0 ORDER BY id DESC LIMIT 20';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,pid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    //添加点赞
    addLovePoem(id,userid,love,time,callback){
        var sql = 'INSERT INTO appreciate(pid,userid,love,time) VALUES (?,?,?,?)';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [id,userid,love,time], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    // 修改点赞
    updateLovePoem(id,userid,love,time,callback){
        var sql = 'UPDATE appreciate SET love = ?,time = ?  WHERE id = ? AND userid = ?';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [love,time,id,userid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    // 查询点赞
    queryLovePoem(pid,userid,callback){
        var sql = 'SELECT * FROM appreciate WHERE pid = ? AND userid = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [pid,userid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    /**
     * 点赞列表
     * @param  作品id
     * @param 回调
     */
    queryLoves(pid,callback){
        var sql = 'SELECT * FROM appreciate WHERE pid = ? AND love = 1';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [pid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    /**
     * 添加点赞数量
     */
    addLoveNum(pid,callback){
        pool.getConnection(function(err, connection) {
            var sql = 'SELECT * FROM mypoem WHERE id = ?'
            connection.query(sql, [pid], function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    if(result.length > 0){
                        var id = result[0].id;
                        var lovenum = result[0].lovenum + 1;
                        var sql1 = 'UPDATE mypoem SET lovenum = ? WHERE id = ?'
                        connection.query(sql1, [lovenum,id], function(err, result) {
                            callback(err, result)
                            connection.release();
                        })
                    }
                }
            });
        });
    },
    /**
     * 取消点赞
     */
    reduceLoveNum(pid,callback){
        pool.getConnection(function(err, connection) {
            var sql = 'SELECT * FROM mypoem WHERE id = ?'
            connection.query(sql, [pid], function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    if(result.length > 0){
                        var id = result[0].id;
                        if(result[0].lovenum > 0){
                            var lovenum = result[0].lovenum - 1;
                            var sql1 = 'UPDATE mypoem SET lovenum = ? WHERE id = ?'
                            connection.query(sql1, [lovenum,id], function(err, result) {
                                callback(err, result)
                                connection.release();
                            })
                        }else{
                            callback(err, result)
                            connection.release();
                        }
                    }else{
                       callback(err, result)
                       connection.release(); 
                    }
                }
            });
        });
    },
    /**
     * 添加评论数量
     */
    addCommentNum(pid,callback){
        pool.getConnection(function(err, connection) {
            var sql = 'SELECT * FROM mypoem WHERE id = ?'
            connection.query(sql, [pid], function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    if(result.length > 0){
                        var id = result[0].id;
                        var commentnum = result[0].commentnum + 1;
                        var sql1 = 'UPDATE mypoem SET commentnum = ? WHERE id = ?'
                        connection.query(sql1, [commentnum,id], function(err, result) {
                            callback(err, result)
                            connection.release();
                        })
                    }
                }
            });
        });
    },
    /**
     * 减少评论数量
     */
    reduceCommentNum(pid,callback){
        pool.getConnection(function(err, connection) {
            var sql = 'SELECT * FROM mypoem WHERE id = ?'
            connection.query(sql, [pid], function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    if(result.length > 0){
                        var id = result[0].id;
                        if(result[0].commentnum > 0){
                            var commentnum = result[0].commentnum - 1;
                            var sql1 = 'UPDATE mypoem SET commentnum = ? WHERE id = ?'
                            connection.query(sql1, [commentnum,id], function(err, result) {
                                callback(err, result)
                                connection.release();
                            })
                        }else{
                            callback(err, result)
                            connection.release();
                        }
                    }else{
                       callback(err, result)
                       connection.release(); 
                    }
                }
            });
        });
    }
}