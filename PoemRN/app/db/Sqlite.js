import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';
SQLiteStorage.DEBUG(true);
let database_name = "poem.db";
let database_version = "1.0";
var curVersion = 6;
var oldVersion = -1;//旧的数据库版本
var newVersion = -1;//新的数据库版本
let database_displayname = "poem";
let database_size = -1;
let database_location = '~/db/poem.db';
let db;

const VERSION_TABLE = 'version';//版本控制
const MYPOEM_TABLE = 'mypoem';//诗歌
const ALLPOEM_TABLE = 'allpoem';
const COMMENT_TABLE = 'comment';//评论
const LOVE_TABLE = 'love';//点赞
const MY_FOLLOW_TABLE = 'my_follow';//我的关注
const FOLLOW_ME_TABLE = 'follow_me';//关注我的

class SQLite extends React.Component{
  componentWillUnmount(){
		if(db){
			db.close();
		}
	}
  initDB(){
    var that = this;
    return new Promise(function(resolve, reject){
        db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            ()=>{
                that.populateDatabase(db,function(err,results){
                  if(err){
                    reject(err)
                  }else{
                    resolve();
                  }
                })
            },
            (err)=>{
                // console.log('数据库打开失败！,错误是：'+err);
                reject(err)
            });
    })
  }
  open(){
    db = SQLiteStorage.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
                ()=>{
                    console.log('数据库打开成功！');
                },
                (err)=>{
                    console.log('数据库打开失败！,错误是：'+err);
                });
  }

  close(){
      if(db){
          db.close();
          console.log('数据库成功关闭！');
      }else{
          console.log('数据库关闭失败!');
      }

      db = null;
  }
  /**
   * 数据库填充操作
   */
  populateDatabase(db,callback){
    // return new Promise(function(resolve, reject){
      var that = this;
      db.executeSql('SELECT * FROM '+VERSION_TABLE+' ORDER BY id DESC LIMIT 1', [], (results)=>{
          console.log(JSON.stringify(results));
          var len = results.rows.length;
          if(len > 0){
            let row = results.rows.item(0);
            oldVersion = row.newVersion;
            newVersion = curVersion;
          }
          if(newVersion > oldVersion){
            db.transaction(that.onUpgrade,(err)=>{
              // console.error(err)
              callback(err,null);
            },()=>{
              callback(null,null);
            });
          }else if(newVersion < oldVersion){
            db.transaction(that.onDowngrade,(err)=>{
              // console.error(err)
              callback(err,null);
            },()=>{
              callback(null,null);
            });
          }else if(newVersion == -1 && oldVersion == -1 ||newVersion == oldVersion){
            console.log(db);
            db.transaction(that.onCreate,(err)=>{
              // console.error(err)
              callback(err,null);
            },()=>{
              callback(null,null);
            });
          }else {
            var err = '版本异常 oldVersion:'+oldVersion+' newVersion:'+newVersion;
            // console.error(err);
            callback(err,null);
          }

      }, (err)=>{
          db.transaction(that.onCreate,(err)=>{
            // console.error(err)
            callback(err,null);
          },()=>{
            callback(null,null);
          });
      });
    // })
  }
  /**
   * 初次创建
   */
  onCreate(tx){
    console.log('@@@@@@数据库初始化');
    var create_version_sql = 'CREATE TABLE IF NOT EXISTS '+VERSION_TABLE+'( '+//版本控制
             'id INTEGER PRIMARY KEY NOT NULL,'+
             'oldVersion INTEGER DEFAULT(-1),'+
             'newVersion INTEGER DEFAULT(-1)'+
             '); ';
    var crate_mypoen_sql = 'CREATE TABLE IF NOT EXISTS ' + MYPOEM_TABLE + '(' +//作品
             'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
             'userid VARCHAR,' +
             'head VARCHAR,' +
             'pseudonym VARCHAR,' +
             'poem LONGTEXT,'+
             'lovenum INTEGER,'+
             'commentnum INTEGER,'+
             'time BIGINT(20)'
             + ');';
   var create_allpoem_sql = 'CREATE TABLE IF NOT EXISTS ' + ALLPOEM_TABLE + '(' +//图书列表
             'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
             'userid VARCHAR,' +
             'head VARCHAR,' +
             'pseudonym VARCHAR,' +
             'poem LONGTEXT,'+
             'lovenum INTEGER,'+
             'commentnum INTEGER,'+
             'time BIGINT(20)'
             + ');';
     var create_comment_sql = 'CREATE TABLE IF NOT EXISTS ' + COMMENT_TABLE + '(' +//评论列表
               'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
               'pid INT(11),'+
               'userid VARCHAR,' +
               'head VARCHAR,' +
               'pseudonym VARCHAR,' +
               'cid INT(11),'+
               'cuserid VARCHAR,'+
               'chead VARCHAR,' +
               'cpseudonym VARCHAR,' +
               'comment LONGTEXT,'+
               'time BIGINT(20)'
               + ');'  ;
       var create_love_sql = 'CREATE TABLE IF NOT EXISTS ' + LOVE_TABLE + '(' +//点赞列表
                   'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                   'pid INT(11),'+
                   'userid VARCHAR,' +
                   'head VARCHAR,' +
                   'pseudonym VARCHAR,' +
                   'love INTEGER,'+
                   'time BIGINT(20)'
                   + ');';
       var create_myfllow_sql = 'CREATE TABLE IF NOT EXISTS ' + MY_FOLLOW_TABLE + '(' +//我的关注列表
                 'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                 'userid VARCHAR,' +
                 'fansid VARCHAR,' +
                 'head VARCHAR,' +
                 'pseudonym VARCHAR,' +
                 'fstate INTEGER,'+
                 'tstate INTEGER,'+
                 'time BIGINT(20)'
                 + ');';
       var create_followme_sql = 'CREATE TABLE IF NOT EXISTS ' + FOLLOW_ME_TABLE + '(' +//关注我的列表
                 'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                 'userid VARCHAR,' +
                 'fansid VARCHAR,' +
                 'head VARCHAR,' +
                 'pseudonym VARCHAR,' +
                 'fstate INTEGER,'+
                 'tstate INTEGER,'+
                 'time BIGINT(20)'
                 + ');';
      tx.executeSql(create_version_sql, [],()=> {
                 console.log('@@@@@@创建verison成功');
               }, (err)=> {
                 console.error(err)
               });
       tx.executeSql(crate_mypoen_sql, [], ()=> {
                 console.log('@@@@@@创建mypoem成功');
               }, (err)=> {
                 console.error(err)
               });
       tx.executeSql(create_allpoem_sql, [], ()=> {
                   console.log('@@@@@@创建表allpoem成功');
                 }, (err)=> {
                   console.error(err)
                 });
       tx.executeSql(create_comment_sql, [], ()=> {
                   console.log('@@@@@@创建表comment成功');
                 }, (err)=> {
                   console.error(err)
                 });
       tx.executeSql(create_love_sql, [], ()=> {
                     console.log('@@@@@@创建表love成功');
                   }, (err)=> {
                     console.error(err)
                   });
       tx.executeSql(create_myfllow_sql, [], ()=> {
                   console.log('@@@@@@创建表myfllow成功');
                 }, (err)=> {
                   console.error(err)
                 });
       tx.executeSql(create_followme_sql, [], ()=> {
                   console.log('@@@@@@创建表followme成功');
                 }, (err)=> {
                   console.error(err)
                 });
      var inser_version_sql = 'INSERT INTO '+VERSION_TABLE+
        '(oldVersion,newVersion) VALUES (?,?)';
      if(newVersion == -1){
        tx.executeSql(inser_version_sql, [curVersion,curVersion], (results)=> {
                    console.log('@@@@@@插入版本信息'+JSON.stringify(results));
                  }, (err)=> {
                    console.error(err)
                  });
      }
  }
  /**
   * 数据库升级
   * @param   tx         [
   * @param  oldVersion 旧版本
   * @param   newVersion 新版本
   */
  onUpgrade(tx){
      console.log('@@@@@@数据库升级 oldVersion:'+oldVersion+' newVersion:'+newVersion);
      var inser_version_sql = 'INSERT INTO '+VERSION_TABLE+
        '(oldVersion,newVersion) VALUES (?,?)';
      tx.executeSql(inser_version_sql, [oldVersion,newVersion], (results)=> {
                  console.log('@@@@@@插入版本信息'+results);
                }, (err)=> {
                  console.error(err)
                });
  }
  /**
   * 数据库降级
   * @param   tx         [
   * @param  oldVersion 旧版本
   * @param   newVersion 新版本
   */
  onDowngrade(tx){
      console.log('@@@@@@数据库降级 oldVersion:'+oldVersion+' newVersion:'+newVersion);
      var inser_version_sql = 'INSERT INTO '+VERSION_TABLE+
        '(oldVersion,newVersion) VALUES (?,?)';
      tx.executeSql(inser_version_sql, [oldVersion,newVersion], (results)=> {
                  console.log('@@@@@@插入版本信息'+results);
                }, (err)=> {
                  console.error(err)
                });
  }
  // createTable(){  // 创建表
  //     // if(!db){
  //     //   this.open();
  //     // }
  //     // 创建列表
  //     db.transaction((tx)=>{
  //        var create_version_sql = 'CREATE TABLE IF NOT EXISTS '+VERSION_TABLE+'( '+//版本控制
  //                 'id INTEGER PRIMARY KEY NOT NULL,'+
  //                 'oldVersion INTEGER DEFAULT(-1),'+
  //                 'newVersion INTEGER DEFAULT(1)'+
  //                 '); ';
  //        var crate_mypoen_sql = 'CREATE TABLE IF NOT EXISTS ' + MYPOEM_TABLE + '(' +//作品
  //                 'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
  //                 'userid VARCHAR,' +
  //                 'head VARCHAR,' +
  //                 'pseudonym VARCHAR,' +
  //                 'poem LONGTEXT,'+
  //                 'lovenum INTEGER,'+
  //                 'commentnum INTEGER,'+
  //                 'time BIGINT(20)'
  //                 + ');';
  //       var create_allpoem_sql = 'CREATE TABLE IF NOT EXISTS ' + ALLPOEM_TABLE + '(' +//图书列表
  //                 'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
  //                 'userid VARCHAR,' +
  //                 'head VARCHAR,' +
  //                 'pseudonym VARCHAR,' +
  //                 'poem LONGTEXT,'+
  //                 'lovenum INTEGER,'+
  //                 'commentnum INTEGER,'+
  //                 'time BIGINT(20)'
  //                 + ');';
  //         var create_comment_sql = 'CREATE TABLE IF NOT EXISTS ' + COMMENT_TABLE + '(' +//评论列表
  //                   'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
  //                   'pid INT(11),'+
  //                   'userid VARCHAR,' +
  //                   'head VARCHAR,' +
  //                   'pseudonym VARCHAR,' +
  //                   'cid INT(11),'+
  //                   'cuserid VARCHAR,'+
  //                   'chead VARCHAR,' +
  //                   'cpseudonym VARCHAR,' +
  //                   'comment LONGTEXT,'+
  //                   'time BIGINT(20)'
  //                   + ');'  ;
  //           var create_love_sql = 'CREATE TABLE IF NOT EXISTS ' + LOVE_TABLE + '(' +//点赞列表
  //                       'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
  //                       'pid INT(11),'+
  //                       'userid VARCHAR,' +
  //                       'head VARCHAR,' +
  //                       'pseudonym VARCHAR,' +
  //                       'love INTEGER,'+
  //                       'time BIGINT(20)'
  //                       + ');';
  //           var create_myfllow_sql = 'CREATE TABLE IF NOT EXISTS ' + MY_FOLLOW_TABLE + '(' +//我的关注列表
  //                     'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
  //                     'userid VARCHAR,' +
  //                     'fansid VARCHAR,' +
  //                     'head VARCHAR,' +
  //                     'pseudonym VARCHAR,' +
  //                     'fstate INTEGER,'+
  //                     'tstate INTEGER,'+
  //                     'time BIGINT(20)'
  //                     + ');';
  //           var create_followme_sql = 'CREATE TABLE IF NOT EXISTS ' + FOLLOW_ME_TABLE + '(' +//关注我的列表
  //                     'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
  //                     'userid VARCHAR,' +
  //                     'fansid VARCHAR,' +
  //                     'head VARCHAR,' +
  //                     'pseudonym VARCHAR,' +
  //                     'fstate INTEGER,'+
  //                     'tstate INTEGER,'+
  //                     'time BIGINT(20)'
  //                     + ');';
  //          tx.executeSql(create_version_sql, [],()=> {
  //                     console.log('@@@@@@创建verison成功');
  //                   }, (err)=> {
  //                     console.error(err)
  //                   });
  //           tx.executeSql(crate_mypoen_sql, [], ()=> {
  //                     console.log('@@@@@@创建mypoem成功');
  //                   }, (err)=> {
  //                     console.error(err)
  //                   });
  //           tx.executeSql(create_allpoem_sql, [], ()=> {
  //                       console.log('@@@@@@创建表allpoem成功');
  //                     }, (err)=> {
  //                       console.error(err)
  //                     });
  //           tx.executeSql(create_comment_sql, [], ()=> {
  //                       console.log('@@@@@@创建表comment成功');
  //                     }, (err)=> {
  //                       console.error(err)
  //                     });
  //           tx.executeSql(create_love_sql, [], ()=> {
  //                         console.log('@@@@@@创建表love成功');
  //                       }, (err)=> {
  //                         console.error(err)
  //                       });
  //           tx.executeSql(create_myfllow_sql, [], ()=> {
  //                       console.log('@@@@@@创建表myfllow成功');
  //                     }, (err)=> {
  //                       console.error(err)
  //                     });
  //           tx.executeSql(create_followme_sql, [], ()=> {
  //                       console.log('@@@@@@创建表followme成功');
  //                     }, (err)=> {
  //                       console.error(err)
  //                     });
  //     }, (err) => {
  //       console.error('创建表失败 err:',err);
  //     } ,() => {
  //       console.log('创建表成功');
  //     })
  //   }
    savePoem(poem){
      return new Promise( (resolve,reject) => {
            if(db){
                db.executeSql(
                    'INSERT INTO '+ MYPOEM_TABLE +' (id,userid,head,pseudonym,poem,lovenum,commentnum,time) VALUES(?,?,?,?,?,?,?,?)',
                    [poem.id,poem.userid,poem.head,poem.pseudonym,poem.poem,poem.lovenum,poem.commentnum,poem.time],
                    ()=>{
                        resolve();
                    },
                    (err)=>{
                        reject(err);
                    })
            }else {
                reject('db not open');
            }
        } )
    }
    savePoems(poems){
      return new Promise( (resolve,reject) => {
        let len = poems.length;
        db.transaction((tx)=>{
            for(let i=0; i<len; i++){
             var poem = poems[i];
             let id= poem.id;
             let userid = poem.userid;
             let head = poem.head;
             let pseudonym = poem.pseudonym;
             let poem_str = poem.poem;
             let lovenum = poem.lovenum;
             let commentnum = poem.commentnum;
             let time = poem.time;
             console.log('poem:'+poem);
             console.log('time+'+time)
             let sql = 'INSERT INTO '+  +' (id,userid,head,pseudonym,poem,lovenum,commentnum,time) VALUES(?,?,?,?,?,?,?,?)';
             tx.executeSql(sql,[id,userid,head,pseudonym,poem_str,lovenum,commentnum,time],()=>{

               },(err)=>{
                 console.log(err);
               }
             );
           }
         },(error)=>{
           reject(error);
         },()=>{
           resolve(poems)
         });
      })
    }
  upgradeTables(tx) {
      console.log("Database running version "+database_current_version);
      if(database_current_version < 1) {

      }
  }

  updatePoem(poem){
      return new Promise( (resolve,reject) => {
            if(db){
                var sql = 'SELECT * FROM '+MYPOEM_TABLE+' WHERE id = ?';
                db.executeSql(sql,[poem.id],
                    (results)=>{
                        var len = results.rows.length;
                        console.log('sql updatePoem:'+len);
                        if(len > 0) {
                            var sql1 = 'UPDATE '+  +' SET poem = ? WHERE id = ? ';
                            db.executeSql(sql1,[poem.poem,poem.id],
                                (results)=>{
                                    console.log('updatePoem:'+JSON.stringify(results))
                                    resolve(results);
                                },
                                (err)=>{
                                    reject(err);
                                })
                        }else{
                          resolve(results)
                        }
                    },
                    (err)=>{
                        reject(err);
                    })
            }else {
                reject('db not open');
            }
        } )
    }

    queryPoems(userid){ // 查找缓存列表，找到所有需要展示的数据
       return new Promise((resolve, reject)=>{
           if(db){
              let sql = 'SELECT * FROM '+MYPOEM_TABLE+' WHERE userid = ? ORDER BY id DESC ';
               db.executeSql(sql,[userid],
                   (results)=>{
                       var len = results.rows.length;
                       var datas = [];
                       for(let i=0;i<len;i++){
                           datas.push(results.rows.item(i));
                       }
                       resolve(datas);
                   },(err)=>{
                       reject(err);
                   });
           }else {
               reject('db not open');
           }
       });
   }
   queryMaxPoems(fromid){
     var sql = 'SELECT * FROM '+MYPOEM_TABLE+' WHERE id>? ORDER BY id DESC ';//最新
     return new Promise((resolve, reject)=>{
         if(db){
             db.executeSql(sql,[fromid],
                 (results)=>{
                     var len = results.rows.length;
                     var datas = [];
                     for(let i=0;i<len;i++){
                         datas.push(results.rows.item(i));
                     }
                     resolve(datas);
                 },(err)=>{
                     reject(err);
                 });
         }else {
             reject('db not open');
         }
     });
   }
   queryMinPoems(fromid){
     var sql = 'SELECT * FROM '+MYPOEM_TABLE+' WHERE id<? ORDER BY id DESC ';//历史
     return new Promise((resolve, reject)=>{
         if(db){
             db.executeSql(sql,[fromid],
                 (results)=>{
                     var len = results.rows.length;
                     var datas = [];
                     for(let i=0;i<len;i++){
                         datas.push(results.rows.item(i));
                     }
                     resolve(datas);
                 },(err)=>{
                     reject(err);
                 });
         }else {
             reject('db not open');
         }
     });
   }
   queryPoem(id){
      return new Promise((resolve, reject)=>{
          if(db){
              db.executeSql('SELECT * FROM '+MYPOEM_TABLE+' WHERE id = ?  ',[id],
                  (results)=>{
                      var len = results.rows.length;
                      var data ;
                      if (len > 0){
                        data = results.rows.item(0);
                      }
                      resolve(data);
                  },(err)=>{
                      reject(err);
                  });
          }else {
              reject('db not open');
          }
      });
  }
  //查询我的作品数量
  queryPoemNum(poem){
    return new Promise( (resolve,reject) => {
          if(db){
              var sql = 'SELECT * FROM '+MYPOEM_TABLE+' WHERE id = ?';
              db.executeSql(sql,[poem.id],
                  (results)=>{
                      var len = results.rows.length;
                      resolve(len)
                  },
                  (err)=>{
                      reject(err);
                  })
          }else {
              reject('db not open');
          }
      } )
  }

  deletePoem(id){
    return new Promise((resolve,reject) => {
    		if(db){
    			db.executeSql('DELETE FROM ' +MYPOEM_TABLE+ ' WHERE id=? ',[id],
                    ()=>{
                        resolve();
                    },(err)=>{
                        reject(err);
                    }

    			)
    		}else{
    			reject()
    		}
    	});
  }

  saveAllPoems(poems){
    return new Promise( (resolve,reject) => {
      let len = poems.length;
      db.transaction((tx)=>{
          for(let i=0; i<len; i++){
           var poem = poems[i];
           let id= poem.id;
           let userid = poem.userid;
           let poem_str = poem.poem;
           let time = poem.time;
           let lovenum = poem.lovenum;
           let commentnum = poem.commentnum;
           let head = poem.head;
           let pseudonym = poem.pseudonym;
           let sql = 'INSERT INTO '+ ALLPOEM_TABLE +' (id,userid,poem,time,lovenum,commentnum,head,pseudonym) VALUES(?,?,?,?,?,?,?,?)';
           tx.executeSql(sql,[id,userid,poem_str,time,lovenum,commentnum,head,pseudonym],()=>{

             },(err)=>{
               console.log(err);
             }
           );
         }
       },(error)=>{
         reject(error);
       },()=>{
         resolve(poems)
       });
    })
  }
  updateAllPoem(poem){
      return new Promise( (resolve,reject) => {
            if(db){
                var sql = 'SELECT * FROM '+ALLPOEM_TABLE+' WHERE id = ?';
                db.executeSql(sql,[poem.id],
                    (results)=>{
                        var len = results.rows.length;
                        if(len > 0 ){
                            var sql1 = 'UPDATE '+ ALLPOEM_TABLE +' SET poem = ? WHERE id = ? ';
                            db.executeSql(sql1,[poem.poem,poem.id],
                                (results)=>{
                                    resolve(results);
                                },
                                (err)=>{
                                    reject(err);
                                })
                        }else{
                          resolve(results)
                        }
                    },
                    (err)=>{
                        reject(err);
                    })
            }else {
                reject('db not open');
            }
        } )
    }
  queryAllPoems(){
       return new Promise((resolve, reject)=>{
           if(db){
               db.executeSql('SELECT * FROM '+ALLPOEM_TABLE +' ORDER BY id DESC  ',[],
                   (results)=>{
                       var len = results.rows.length;
                       var datas = [];
                       for(let i=0;i<len;i++){
                           datas.push(results.rows.item(i));
                       }
                       resolve(datas);
                   },(err)=>{
                       reject(err);
                   });
           }else {
               reject('db not open');
           }
       });
   }
   //查询我的作品数量
   queryAllPoemNum(poem){
     return new Promise( (resolve,reject) => {
           if(db){
               var sql = 'SELECT * FROM '+ALLPOEM_TABLE+' WHERE id = ?';
               db.executeSql(sql,[poem.id],
                   (results)=>{
                       var len = results.rows.length;
                       resolve(len)
                   },
                   (err)=>{
                       reject(err);
                   })
           }else {
               reject('db not open');
           }
       } )
   }
   queryAllPoem(id){
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+ALLPOEM_TABLE +' WHERE id = ? ',[id],
                    (results)=>{
                        var len = results.rows.length;
                        var data ;
                        if (len > 0){
                          data = results.rows.item(0);
                        }
                        resolve(data);
                    },(err)=>{
                        reject(err);
                    });
            }else {
                reject('db not open');
            }
        });
    }
    deleteAllPoem(id){
      return new Promise((resolve,reject) => {
      		if(db){
      			db.executeSql('DELETE FROM ' + ALLPOEM_TABLE + ' WHERE id=? ',[id],
                      ()=>{
                          resolve();
                      },(err)=>{
                          reject(err);
                      }

      			)
      		}else{
      			reject()
      		}
      	});
    }

    saveComment(comment){
      return new Promise( (resolve,reject) => {
            if(db){
                db.executeSql(
                    'INSERT INTO '+ COMMENT_TABLE +' (id,pid,userid,head,pseudonym,cid,cuserid,chead,cpseudonym,comment,time) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
                    [comment.id,comment.pid,comment.userid,comment.head,comment.pseudonym,comment.cid,comment.cuserid,comment.chead,comment.cpseudonym,comment.comment,comment.time],
                    ()=>{
                        resolve();
                    },
                    (err)=>{
                        reject(err);
                    })
            }else {
                reject('db not open');
            }
        } )
    }
    saveComments(comments){
      return new Promise( (resolve,reject) => {
        let len = comments.length;
        db.transaction((tx)=>{
            for(let i=0; i<len; i++){
             var comment = comments[i];
             let id= comment.id;
             let pid = comment.pid;
             let userid = comment.userid;
             let head = comment.head;
             let pseudonym = comment.pseudonym;
             let cid = comment.cid;
             let cuserid = comment.cuserid;
             let chead = comment.chead;
             let cpseudonym = comment.cpseudonym;
             let comment_str = comment.comment;
             let time = comment.time;
             let sql = 'INSERT INTO '+ COMMENT_TABLE +' (id,pid,userid,head,pseudonym,cid,cuserid,chead,cpseudonym,comment,time) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
             tx.executeSql(sql,[id,pid,userid,head,pseudonym,cid,cuserid,chead,cpseudonym,comment_str,time],()=>{

               },(err)=>{
                 console.log(err);
               }
             );
           }
         },(error)=>{
           reject(error);
         },()=>{
           resolve(comments)
         });
      })
    }
    queryComments(pid){
      return new Promise((resolve, reject)=>{
          if(db){
            var sql = 'SELECT * FROM '+COMMENT_TABLE +' WHERE pid = ? ORDER BY id DESC ';
              db.executeSql(sql,[pid],
                  (results)=>{
                      var len = results.rows.length;
                      var datas = [];
                      for(let i=0;i<len;i++){
                          datas.push(results.rows.item(i));
                      }
                      resolve(datas);
                  },(err)=>{
                      reject(err);
                  });
          }else {
              reject('db not open');
          }
      });
    }

    /**
     * 保存点赞
     */
    saveLove(love){
      return new Promise( (resolve,reject) => {
        db.transaction((tx)=>{
          let sql = 'INSERT INTO '+ LOVE_TABLE +' (pid,userid,head,pseudonym,love,time) VALUES(?,?,?,?,?,?)';
          tx.executeSql(sql,[love.id,love.userid,love.head,love.pseudonym,love.love,love.time],()=>{

            },(err)=>{
              console.log(err);
            }
          );
         },(error)=>{
           reject(error);
         },()=>{
           resolve(poems)
         });
      })
    }
    /**
     * 保存点赞列表
     */
    saveLoves(loves){
        return new Promise( (resolve,reject) => {
          let len = loves.length;
          db.transaction((tx)=>{
              for(let i=0; i<len; i++){
               var love = loves[i];
               let pid= love.pid;
               let userid = love.userid;
               let head = love.head;
               let pseudonym = love.pseudonym;
               let love_str = love.love;
               let time = love.time;
               let sql = 'INSERT INTO '+ LOVE_TABLE +' (pid,userid,head,pseudonym,love,time) VALUES(?,?,?,?,?,?)';
               tx.executeSql(sql,[pid,userid,head,pseudonym,love_str,time],()=>{

                 },(err)=>{
                   console.log(err);
                 }
               );
             }
           },(error)=>{
             reject(error);
           },()=>{
             resolve(loves)
           });
        })
      }
    queryLove(pid,userid){
      return new Promise((resolve, reject)=>{
          if(db){
            var sql = 'SELECT * FROM '+LOVE_TABLE +' WHERE pid = ? AND userid = ? ORDER BY id DESC ';
              db.executeSql(sql,[pid,userid],
                  (results)=>{
                      var len = results.rows.length;
                      var datas = [];
                      for(let i=0;i<len;i++){
                          datas.push(results.rows.item(i));
                      }
                      resolve(datas);
                  },(err)=>{
                      reject(err);
                  });
          }else {
              reject('db not open');
          }
      });
    }

    queryLoves(pid){
      return new Promise((resolve, reject)=>{
          if(db){
            var sql = 'SELECT * FROM '+LOVE_TABLE +' WHERE pid = ? AND love = 1 ORDER BY id DESC ';
              db.executeSql(sql,[pid],
                  (results)=>{
                      var len = results.rows.length;
                      var datas = [];
                      for(let i=0;i<len;i++){
                          datas.push(results.rows.item(i));
                      }
                      resolve(datas);
                  },(err)=>{
                      reject(err);
                  });
          }else {
              reject('db not open');
          }
      });
    }
    /**
     * 添加点赞
     * @param 点赞对象
     */
    AddLove(love){
      return new Promise( (resolve,reject) => {
            if(db){
                var sql = 'SELECT * FROM '+LOVE_TABLE+' WHERE pid = ? AND userid = ?';
                db.executeSql(sql,[love.pid,love.userid],
                    (results)=>{
                        var len = results.rows.length;
                        if(len > 0 ){
                            var sql1 = 'UPDATE '+ ALLPOEM_TABLE +' SET poem = ? WHERE id = ? ';
                            db.executeSql(sql1,[poem.poem,poem.id],
                                (results)=>{
                                    resolve(results);
                                },
                                (err)=>{
                                    reject(err);
                                })
                        }else{
                          let sql2 = 'INSERT INTO '+ LOVE_TABLE +' (pid,userid,love,time) VALUES(?,?,?,?)';
                          db.executeSql(sql2,[love.pid,love.userid,love.love,love.time],()=>{
                                resolve(results);
                            },(err)=>{
                              reject(err);
                            }
                          );
                        }
                    },
                    (err)=>{
                        reject(err);
                    })
            }else {
                reject('db not open');
            }
        });
    }
    deleteLoves(){
      return new Promise((resolve,reject) => {
      		if(db){
      			db.executeSql('DELETE FROM ' + LOVE_TABLE ,[],
                      ()=>{
                          resolve();
                      },(err)=>{
                          reject(err);
                      }
      			)
      		}else{
      			reject()
      		}
      	});
    }
    /**
     * 保存我的关注
     */
    saveMeFollows(follows){
      return new Promise( (resolve,reject) => {
        let len = follows.length;
        db.transaction((tx)=>{
            for(let i=0; i<len; i++){
             var follow = follows[i];
             let id= follow.id;
             let userid = follow.userid;
             let fansid = follow.fansid;
             let head = follow.head;
             let pseudonym = follow.pseudonym;
             let fstate = follow.fstate;
             let tstate = follow.tstate;
             let sql = 'INSERT INTO '+ MY_FOLLOW_TABLE +' (id,userid,fansid,head,pseudonym,fstate,tstate) VALUES(?,?,?,?,?,?,?)';
             tx.executeSql(sql,[id,userid,fansid,head,pseudonym,fstate,tstate],()=>{

               },(err)=>{
                 console.log(err);
               }
             );
           }
         },(error)=>{
           reject(error);
         },()=>{
           resolve(follows)
         });
      })
    }
    /**
     * 查询我的关注
     */
    queryMeFollows(userid){
       return new Promise((resolve, reject)=>{
           if(db){
              let sql = 'SELECT * FROM '+MY_FOLLOW_TABLE +' WHERE userid = ? ORDER BY id DESC  ';
               db.executeSql(sql,[userid],
                   (results)=>{
                       var len = results.rows.length;
                       var datas = [];
                       for(let i=0;i<len;i++){
                           datas.push(results.rows.item(i));
                       }
                       resolve(datas);
                   },(err)=>{
                       reject(err);
                   });
           }else {
               reject('db not open');
           }
       });
   }

   /**
    * 保存关注我的
    */
   saveFollowMes(follows){
     return new Promise( (resolve,reject) => {
       let len = follows.length;
       db.transaction((tx)=>{
           for(let i=0; i<len; i++){
            var follow = follows[i];
            let id= follow.id;
            let userid = follow.userid;
            let fansid = follow.fansid;
            let head = follow.head;
            let pseudonym = follow.pseudonym;
            let fstate = follow.poem;
            let tstate = follow.lovenum;
            let sql = 'INSERT INTO '+ FOLLOW_ME_TABLE +' (id,userid,fansid,head,pseudonym,fstate,tstate) VALUES(?,?,?,?,?,?,?)';
            tx.executeSql(sql,[id,userid,fansid,head,pseudonym,fstate,tstate],()=>{

              },(err)=>{
                console.log(err);
              }
            );
          }
        },(error)=>{
          reject(error);
        },()=>{
          resolve(follows)
        });
     })
   }
   /**
    * 查询关注我的
    */
   queryFollowMes(userid){
      return new Promise((resolve, reject)=>{
          if(db){
             let sql = 'SELECT * FROM '+FOLLOW_ME_TABLE +' WHERE userid = ? ORDER BY id DESC  ';
              db.executeSql(sql,[userid],
                  (results)=>{
                      var len = results.rows.length;
                      var datas = [];
                      for(let i=0;i<len;i++){
                          datas.push(results.rows.item(i));
                      }
                      resolve(datas);
                  },(err)=>{
                      reject(err);
                  });
          }else {
              reject('db not open');
          }
      });
  }

}

export default SQLite;
