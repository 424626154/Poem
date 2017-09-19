import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';
SQLiteStorage.DEBUG(true);
let database_name = "poem.db";
let database_version = "1.0";
let database_displayname = "poem";
let database_size = -1;
let database_location = '~/db/poem.db';
let db;

const POEMS_TABLE = 'poems';//诗歌

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
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + POEMS_TABLE + '(' +//图书列表
                  'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                  'author VARCHAR,' +
                  'poem VARCHAR,'+
                  'time TIME'
                  + ');'
                  , [], ()=> {
                      // this._successCB('收藏executeSql');
                  }, (err)=> {
                    console.log(err)
                      // this._errorCB('收藏executeSql', err);
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
                    'INSERT INTO '+ POEMS_TABLE +' (author,poem,time) VALUES(?,?,?)',
                    [poem.getAuthor(),poem.getPoem(),poem.getTime()],

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

    queryPoems(){ // 查找缓存列表，找到所有需要展示的数据
       return new Promise((resolve, reject)=>{
           if(db){
               db.executeSql('SELECT * FROM '+POEMS_TABLE +' LIMIT '+80,[],
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
