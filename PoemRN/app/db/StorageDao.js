'use strict'
/**
 * 本地存储DAO
 */
import realm from './RealmDB';
import RealmName from './RealmName';
import uuid from 'uuid';

class StorageDao {
  setItem(key,value){
    let temp_value = '';
    console.log('------setItem key:'+key+' value:'+value)
    try {
      if(key == undefined ||value == undefined){
        return temp_value;
      }
      realm.write(() => {
        let filtered = 'key = "'+key+'"';
        let items = realm.objects(RealmName.Storage).filtered(filtered).slice();
        console.log(items)
        console.log(key)
        console.log(value)
        if(items.length > 0){
            let new_item = {
                rid:items[0].rid,
                value:value,
            };
            realm.create(RealmName.Storage, new_item,true);
            temp_value = value;
            console.log('update')
            console.log(new_item)
        }else{
            let new_item = {
                rid:uuid.v1(),
                key:key,
                value:value,
            };
            realm.create(RealmName.Storage, new_item);
            temp_value = value;
            console.log('add')
            console.log(new_item)
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
       return temp_value;
    }
  }
  getItem(key){
    let value = '';
    try {
      realm.write(() => {
        let filtered = 'key = "'+key+'"';
        let items = realm.objects(RealmName.Storage).filtered(filtered).slice();
        if(items.length > 0){
          value = items[0].value;
          console.log('-------getItem')
          console.log(items)
          console.log(value)
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      return value;
    }
  }

}

export default new StorageDao();
