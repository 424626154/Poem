import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';
SQLiteStorage.DEBUG(true);
let database_name = "poem.db";
let database_version = "1.0";
let database_displayname = "poem";
let database_size = -1;
let database_location = '~/db/poem.db';
let db;

const MYPOEM_TABLE = 'mypoem';//诗歌
const ALLPOEM_TABLE = 'allpoem';
const COMMENT_TABLE = 'comment';//评论
const LOVE_TABLE = 'love';//点赞
class SQLite extends React.Component{
  componentWillUnmount(){
		if(db){
			db.close();
		}
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
  createTable(){  // 创建表
      if(!db){
        this.open();
      }
      console.log(db)
      console.log('----------------')
      // 创建列表
      db.transaction((tx)=>{
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + MYPOEM_TABLE + '(' +//图书列表
                  'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                  'userid VARCHAR,' +
                  'poem LONGTEXT,'+
                  'lovenum INTEGER,'+
                  'commentnum INTEGER,'+
                  'time BIGINT(20)'
                  + ');'
                  , [], ()=> {
                  }, (err)=> {
                    console.log(err)
                  });
          tx.executeSql('CREATE TABLE IF NOT EXISTS ' + ALLPOEM_TABLE + '(' +//图书列表
                    'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                    'userid VARCHAR,' +
                    'poem LONGTEXT,'+
                    'lovenum INTEGER,'+
                    'commentnum INTEGER,'+
                    'time BIGINT(20)'
                    + ');'
                    , [], ()=> {
                    }, (err)=> {
                      console.log(err)
                    });
          tx.executeSql('CREATE TABLE IF NOT EXISTS ' + COMMENT_TABLE + '(' +//评论列表
                    'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                    'pid INT(11),'+
                    'userid VARCHAR,' +
                    'replyid INT(11),'+
                    'replyuser VARCHAR,'+
                    'comment LONGTEXT,'+
                    'time BIGINT(20)'
                    + ');'
                    , [], ()=> {
                    }, (err)=> {
                      console.log(err)
                    });
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + LOVE_TABLE + '(' +//点赞列表
                      'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                      'pid INT(11),'+
                      'userid VARCHAR,' +
                      'love INTEGER,'+
                      'time BIGINT(20)'
                      + ');'
                      , [], ()=> {
                      }, (err)=> {
                        console.log(err)
                      });
      }, (err) => {
        console.log('创建表失败 err:',err);
      } ,() => {
        console.log('创建表成功');
      })
    }
    savePoem(poem){
      return new Promise( (resolve,reject) => {
            if(db){
                db.executeSql(
                    'INSERT INTO '+ MYPOEM_TABLE +' (id,userid,poem,lovenum,commentnum,time) VALUES(?,?,?,?,?,?)',
                    [poem.id,poem.userid,poem.poem,poem.lovenum,poem.commentnum,poem.time],
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
             let poem_str = poem.poem;
             let lovenum = poem.lovenum;
             let commentnum = poem.commentnum;
             let time = poem.time;
             console.log('poem:'+poem);
             console.log('time+'+time)
             let sql = 'INSERT INTO '+ MYPOEM_TABLE +' (id,userid,poem,lovenum,commentnum,time) VALUES(?,?,?,?,?,?)';
             tx.executeSql(sql,[id,userid,poem_str,lovenum,commentnum,time],()=>{

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

  updatePoem(poem){
      return new Promise( (resolve,reject) => {
            if(db){
                var sql = 'SELECT * FROM '+MYPOEM_TABLE+' WHERE id = ?';
                db.executeSql(sql,[poem.id],
                    (results)=>{
                        var len = results.rows.length;
                        console.log('sql updatePoem:'+len);
                        if(len > 0) {
                            var sql1 = 'UPDATE '+ MYPOEM_TABLE +' SET poem = ? WHERE id = ? ';
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

    queryPoems(){ // 查找缓存列表，找到所有需要展示的数据
       return new Promise((resolve, reject)=>{
           if(db){
               db.executeSql('SELECT * FROM '+MYPOEM_TABLE +' ORDER BY id DESC LIMIT '+20,[],
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
     var sql = 'SELECT * FROM '+MYPOEM_TABLE+' WHERE id>? ORDER BY id DESC LIMIT 20';//最新
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
     var sql = 'SELECT * FROM '+MYPOEM_TABLE+' WHERE id<? ORDER BY id DESC LIMIT 20';//历史
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
              db.executeSql('SELECT * FROM '+MYPOEM_TABLE +' WHERE id = ? LIMIT '+80,[id],
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
    			db.executeSql('DELETE FROM ' + MYPOEM_TABLE + ' WHERE id=? ',[id],
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
           let sql = 'INSERT INTO '+ ALLPOEM_TABLE +' (id,userid,poem,time,lovenum,commentnum) VALUES(?,?,?,?,?,?)';
           tx.executeSql(sql,[id,userid,poem_str,time,lovenum,commentnum],()=>{

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
               db.executeSql('SELECT * FROM '+ALLPOEM_TABLE +' ORDER BY id DESC LIMIT '+20,[],
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
                db.executeSql('SELECT * FROM '+ALLPOEM_TABLE +' WHERE id = ? LIMIT '+80,[id],
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
                    'INSERT INTO '+ COMMENT_TABLE +' (id,pid,userid,replyid,replyuser,comment,time) VALUES(?,?,?,?,?,?,?)',
                    [comment.id,comment.pid,comment.userid,comment.replyid,comment.replyuser,comment.comment,comment.time],
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
             let replyid = comment.replyid;
             let replyuser = comment.replyuser;
             let comment_str = comment.comment;
             let time = comment.time;
             let sql = 'INSERT INTO '+ MYPOEM_TABLE +' (id,pid,userid,replyid,replyuser,comment,time) VALUES(?,?,?,?,?,?,?)';
             tx.executeSql(sql,[id,pid,userid,replyid,replyuser,comment_str,time],()=>{

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


    saveLove(love){
      return new Promise( (resolve,reject) => {
        db.transaction((tx)=>{
          let sql = 'INSERT INTO '+ LOVE_TABLE +' (pid,userid,love,time) VALUES(?,?,?,?)';
          tx.executeSql(sql,[love.id,love.userid,love.love,love.time],()=>{

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

    saveLoves(loves){
        return new Promise( (resolve,reject) => {
          let len = loves.length;
          db.transaction((tx)=>{
              for(let i=0; i<len; i++){
               var love = loves[i];
               let pid= love.pid;
               let userid = love.userid;
               let love_str = love.love;
               let time = love.time;
               let sql = 'INSERT INTO '+ LOVE_TABLE +' (pid,userid,love,time) VALUES(?,?,?,?)';
               tx.executeSql(sql,[pid,userid,love_str,time],()=>{

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

}

export default SQLite;
