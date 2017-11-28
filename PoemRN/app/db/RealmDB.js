'use strict'
/**
 * realm db
 * @flow
 */
import React from 'react';
// const Realm = require('realm');
import Realm from 'realm';
import RealmName from './RealmName';

let SchemaVersion = 2;//数据库版本
// const MessageName = 'message';
// let realm;

const Message = {
    name:RealmName.Message,
    primaryKey: 'rid',
    properties:{
      rid:{type: 'string', default: ''},//本地存储id
      id:'int',
      account:{type: 'string', default: ''},
      title:'string',
      content:'string',
      type:'int',
      extend:'string',
      state:'int',
      userid:'string',
      time:'int',
    }
}

const HomePoem = {
    name:RealmName.HomePoem,
    primaryKey: 'rid',
    properties:{
      rid:{type: 'string', default: ''},//本地存储id
      id:'int',
      account:{type: 'string', default: ''},
      userid:{type: 'string', default: ''},
      head:{type: 'string', default: ''},
      pseudonym:{type: 'string', default: ''},
      title:{type: 'string', default: ''},
      content:{type: 'string', default: ''},
      extend:{type: 'string', default: ''},
      lovenum:{type: 'int', default: 0},
      commentnum:{type: 'int', default: 0},
      mylove:{type: 'int', default: 0},
      del: {type: 'int', default: 0},
      time:{type: 'int', default: 0},
    }
}
const Chat = {
  name:RealmName.Chat,
  primaryKey: 'rid',
  properties:{
    rid:{type: 'string', default: ''},//本地存储id
    id:{type: 'int', default: 0},
    account:{type: 'string', default: ''},
    chatuid:{type: 'string', default: ''},
    fuserid:{type: 'string', default: ''},
    tuserid:{type: 'string', default: ''},
    msg:{type: 'string', default: ''},
    extend:{type: 'string', default: ''},
    style:{type: 'int', default: 0},//0左 ，1 右
    send:{type: 'int', default: 0}, //发送状态 0 开始发送
    read:{type: 'int', default: 0},//0 未读 1已读
    time:{type: 'int', default: 0},
  }
}

const ChatList = {
  name:RealmName.ChatList,
  primaryKey: 'rid',
  properties:{
    rid:{type: 'string', default: ''},//本地存储id
    id:{type: 'int', default: 0},
    account:{type: 'string', default: ''},
    chatuid:{type: 'string', default: ''},
    fuserid:{type: 'string', default: ''},
    tuserid:{type: 'string', default: ''},
    head:{type: 'string', default: ''},
    pseudonym:{type: 'string', default: ''},
    msg:{type: 'string', default: ''},
    extend:{type: 'string', default: ''},
    num:{type: 'int', default: 0},
    time:{type: 'int', default: 0},
  }
}

const Storage = {
  name:RealmName.Storage,
  primaryKey: 'rid',
  properties:{
    rid:{type: 'string', default: ''},
    key:{type: 'string', default: ''},
    value:{type: 'string', default: ''},
  }
}

const schema1 = [Message,HomePoem,Chat,ChatList,Storage];
const migrationFunction1 =  (oldRealm, newRealm) => {
  console.log('---Realm  migration oldRealm.schemaVersion:'+oldRealm.schemaVersion +' newRealm.schemaVersion:' +newRealm.schemaVersion);

  // if (oldRealm.schemaVersion < [待处理版本]) {
  //   name 变动的表名
  //   const oldObjects = oldRealm.objects(name);
  //   const newObjects = newRealm.objects(name);
  //   // loop through all objects and set the name property in the new schema
  //   for (let i = 0; i < oldObjects.length; i++) {
  //       newObjects[i].[新加字段] = [处理值]
  //   }
  // }
  if (oldRealm.schemaVersion < 1) {

  }
}
const schema2 = [Message,HomePoem,Chat,ChatList,Storage];
const migrationFunction2 =  (oldRealm, newRealm) => {
  console.log('---Realm  migration oldRealm.schemaVersion:'+oldRealm.schemaVersion +' newRealm.schemaVersion:' +newRealm.schemaVersion);
  if (oldRealm.schemaVersion < 1) {

  }
}
const schemas = [
  { schema: schema1, schemaVersion: 1, migration: migrationFunction1 },
  { schema: schema2, schemaVersion: 2, migration: migrationFunction2 },
]

// the first schema to update to is the current schema version
// since the first schema in our array is at
// let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);
// https://github.com/realm/realm-js/issues/1410
let nextSchemaIndex = Math.max(0, Realm.schemaVersion(Realm.defaultPath));
while (nextSchemaIndex < schemas.length) {
  const migratedRealm = new Realm(schemas[nextSchemaIndex++]);
  migratedRealm.close();
}

// open the Realm with the latest schema
const realm = null;

// Realm.open(schemas[schemas.length-1]).then(realm=>{
//     realm = realm;
//     console.log('------Realm ');
//     console.log(realm);
// }).catch(err=>{
//   console.error(err)
// })

export default new Realm(schemas[schemas.length-1]);

// export default new Realm({
//     schema: schemas,
//     schemaVersion: SchemaVersion,
//     migration: (oldRealm, newRealm) => {
//       // only apply this change if upgrading to schemaVersion 1
//       console.log('------Realm  migration');
//       console.log('oldRealm.schemaVersion:'+oldRealm.schemaVersion);
//       console.log('newRealm.schemaVersion:'+newRealm.schemaVersion);
//       if (oldRealm.schemaVersion < newRealm.schemaVersion) {
//         for(let j = 0; j < schemas.length ;j++){
//           console.log('schema_name:'+schema_name);
//           let schema_name = schemas[j];
//           const oldObjects = oldRealm.objects(schema_name);
//           const newObjects = newRealm.objects(schema_name);
//           // loop through all objects and set the name property in the new schema
//           for (let i = 0; i < oldObjects.length; i++) {
//             newObjects[i].name = oldObjects[i].firstName + ' ' + oldObjects[i].lastName;
//             console.log(newObjects[i].name);
//           }
//         }
//       }
//     }
// });

// class RealmDB extends React.Component{
//       componentWillMount(){
//
//       }
//       open(){
//         console.log('!!!!!!Relam open');
//         return new Promise(function(resolve, reject){
//           Realm.open({
//             schema: [Message],
//             schemaVersion: SchemaVersion,
//             migration: (oldRealm, newRealm) => {
//               // only apply this change if upgrading to schemaVersion 1
//               if (oldRealm.schemaVersion < 1) {
//                 const oldObjects = oldRealm.objects(MESSAGE);
//                 const newObjects = newRealm.objects(MESSAGE);
//                 console.log(oldObjects);
//                 console.log(newObjects);
//                 // loop through all objects and set the name property in the new schema
//                 // for (let i = 0; i < oldObjects.length; i++) {
//                 //   newObjects[i].name = oldObjects[i].firstName + ' ' + oldObjects[i].lastName;
//                 // }
//               }
//             }
//           }).then(realm => {
//               // console.log(realm.objects(MESSAGE));
//               realm = realm;
//               // console.log(prealm);
//               resolve(realm);
//           }).catch(err=>{
//             // console.error(err);
//             reject(err);
//           });
//         });
//       }
//
//       saveMessages(){
//         if(realm){
//           try {
//             realm.write(() => {
//                 realm.create('Car', {make: 'Honda', model: 'Accord', drive: 'awd'});
//               });
//             } catch (e) {
//               console.log("Error on creation");
//             }
//           }
//       }
// }
//
// export default RealmDB;
