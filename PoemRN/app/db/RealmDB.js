import React from 'react';
const Realm = require('realm');

let SchemaVersion = 1;//数据库版本
const MYPOEM = 'mypoem';
let prealm;

const MypoemSchema = {
    name:MYPOEM,
    primaryKey: 'id',
    properties:{
      id:'int',
      userid:'string',
      head:'string',
      pseudonym:'string',
      poem:'string',
      lovenum:'int',
      commentnum:'int',
      time:'int',
    }
}
class RealmDB extends React.Component{
      componentWillMount(){
        console.log('!!!!!!componentWillMount');
      }
      initRealm(){
        console.log('!!!!!!initRealm');
        Realm.open({
          schema: [MypoemSchema],
          schemaVersion: SchemaVersion,
          migration: (oldRealm, newRealm) => {
            // only apply this change if upgrading to schemaVersion 1
            if (oldRealm.schemaVersion < 1) {
              const oldObjects = oldRealm.objects(MYPOEM);
              const newObjects = newRealm.objects(MYPOEM);
              console.log(oldObjects);
              console.log(newObjects);
              // loop through all objects and set the name property in the new schema
              // for (let i = 0; i < oldObjects.length; i++) {
              //   newObjects[i].name = oldObjects[i].firstName + ' ' + oldObjects[i].lastName;
              // }
            }
          }
        }).then(realm => {
            console.log(realm.objects(MYPOEM));
            prealm = realm;
            console.log(prealm);
        }).catch(err=>{
          console.error(err);
        });
      }
}

export default RealmDB;
