import React from 'react';
// const Realm = require('realm');
import Realm from 'realm';
import RealmName from './RealmName';

let SchemaVersion = 8;//数据库版本
// const MessageName = 'message';
// let realm;

const Message = {
    name:RealmName.Message,
    primaryKey: 'id',
    properties:{
      id:'int',
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
    primaryKey: 'id',
    properties:{
      id:'int',
      userid:{type: 'string', default: ''},
      head:{type: 'string', default: ''},
      pseudonym:{type: 'string', default: ''},
      title:{type: 'string', default: ''},
      content:{type: 'string', default: ''},
      lovenum:{type: 'int', default: 0},
      commentnum:{type: 'int', default: 0},
      mylove:{type: 'int', default: 0},
      del: {type: 'int', default: 0},
      time:{type: 'int', default: 0},
    }
}

export default new Realm({
    schema: [Message,HomePoem],
    schemaVersion: SchemaVersion,
});

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
