import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';
SQLiteStorage.DEBUG(false);
let database_name = "poem.db";
let database_version = "1.0";
let database_displayname = "poem";
let database_size = -1;
let database_location = '~/db/poem.db';
let db;

const MYPOEM_TABLE = 'mypoem';//诗歌
const ALLPOEM_TABLE = 'allpoem';

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
                    'livenum INTEGER,'+
                    'commentnum INTEGER,'+
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
                    'INSERT INTO '+ MYPOEM_TABLE +' (id,userid,poem,time) VALUES(?,?,?,?)',
                    [poem.id,poem.userid,poem.poem,poem.time],
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
             let time = poem.time;
             console.log('poem:'+poem);
             console.log('time+'+time)
             let sql = 'INSERT INTO '+ MYPOEM_TABLE +' (id,userid,poem,time) VALUES(?,?,?,?)';
             tx.executeSql(sql,[id,userid,poem_str,time],()=>{

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
  deletePoem(id){
    return new Promise((resolve,reject) => {
    		if(db){
    			db.executeSql('DELETE FROM ' + MYPOEM_TABLE + ' WHERE id=? ',[id],
                    ()=>{
                        resolve();
                        console.log('成功删除本条记录 id:'+id);
                    },(err)=>{
                        reject(err);
                    }

    			)
    		}else{
    			reject()
    		}
    	});
  }

  updatePoem(poem){
    return new Promise( (resolve,reject) => {
          if(db){
              db.executeSql(
                  'UPDATE '+ POEMS_TABLE +' SET poem = ? WHERE id = ? ',
                  [poem.getPoem(),poem.getId()],

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
           let livenum = poem.livenum;
           let commentnum = poem.commentnum;
           console.log('poem:'+poem);
           console.log('time+'+time)
           let sql = 'INSERT INTO '+ ALLPOEM_TABLE +' (id,userid,poem,time,livenum,commentnum) VALUES(?,?,?,?,?,?)';
           tx.executeSql(sql,[id,userid,poem_str,time,livenum,commentnum],()=>{

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

   queryAllPoem(id){ // 查找缓存列表，找到所有需要展示的数据
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

}

export default SQLite;
