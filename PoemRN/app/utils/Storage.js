'use strict'
/**
 * 本地缓存数据
 * @flow
 */
import StorageDao from '../db/StorageDao';
import {StorageConfig} from '../Config'
var Storage = {

}
Storage.saveUserid =  function(userid:string){
  try {
      let value = StorageDao.setItem(StorageConfig.USERID,userid);
      console.log(value);
  } catch (error) {
      console.error(error);
  }
}

Storage.getUserid = function(){
  try {
      let userid = StorageDao.getItem(StorageConfig.USERID);
      return userid;
  } catch (error) {
      console.error(error);
  }
}

Storage.savePushId = function(pushid:string){
  try {
      let value = StorageDao.setItem(StorageConfig.PUSHIID,pushid);
      console.log(value)
  } catch (error) {
      console.error(error);
  }
}
Storage.getPushId = function(){
  try {
      let pushid = StorageDao.getItem(StorageConfig.PUSHIID);
      console.log('---Storage.getPushId : ' ,pushid);
      return pushid;
  } catch (error) {
      console.error(error);
  }
}

Storage.saveUser =  function(userid:string,user:Object){
  try {
    console.log('---Storage.saveUser :'+userid+ 'user:')
    console.log(user)
    var temp_user = StorageDao.getItem(userid);
    if (temp_user){
        temp_user = JSON.parse(temp_user)
        if(temp_user.userid == userid){
          for(var key in user){
               temp_user.key = user[key];
               console.log(key)
          }
          console.log(userid)
          console.log(temp_user)
          StorageDao.setItem(userid, JSON.stringify(user));
          console.log('saveUser success: ',user);
        }
    } else {
      user.userid = userid;
      StorageDao.setItem(userid, JSON.stringify(user));
      console.log('saveUser no user success: ',user);
    }
  } catch (error) {
      console.error(error);
  }
}

Storage.saveLastPhone = function(phone:string){
  console.log('---Storage.saveLastPhone: '+phone);
  try {
      let value = StorageDao.setItem(StorageConfig.LAST_PHONE,phone);
      console.log('saveLastPhone success: '+value);
  } catch (error) {
      console.error(error);
  }
}

Storage.getLastPhone = function(){
  try {
      let value = StorageDao.getItem(StorageConfig.LAST_PHONE);
      console.log('getLastPhone success: ' +value);
      return value;
  } catch (error) {
      console.error(error);
  }
}

export default Storage;
