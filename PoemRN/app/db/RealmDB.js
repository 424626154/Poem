import React from 'react';
// const Realm = require('realm');
import Realm from 'realm';
import RealmName from './RealmName';

let SchemaVersion = 3;//数据库版本
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

export default new Realm({
    schema: [Message],
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
