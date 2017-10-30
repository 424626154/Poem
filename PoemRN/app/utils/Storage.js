'use strict'
/**
 * 本地缓存数据
 */
import React, {
     AsyncStorage
}from 'react-native';
import {StorageConfig} from '../Config'
class Storage {

}
Storage.getUserid = async function(){
  try {// try catch 捕获异步执行的异常
      var value = await AsyncStorage.getItem(StorageConfig.USERID);
      if (value !== null){
          console.log('getUserid success: ' ,value);
      } else {
          console.log('getUserid no data');
      }
      return value;
  } catch (error) {
      console.error(error);
  }
}

Storage.savePushId =  async function(pushid){
  try {
      await AsyncStorage.setItem(StorageConfig.PUSHIID, pushid);
      console.log('savePushId success: ',pushid);
  } catch (error) {
      console.error(error);
  }
}
Storage.saveUser = async function(userid,user){
  try {
    var temp_user = await AsyncStorage.getItem(userid);
    if (temp_user !== null){
        temp_user = JSON.parse(temp_user)
        if(temp_user.userid == userid){
          for(var key in user){
               temp_user.key = userid[key];
               console.log(key)
          }
          console.log(temp_user)
          console.log(userid)
          await AsyncStorage.setItem(userid, JSON.stringify(user));
          console.log('saveUser success: ',user);
        }
    } else {
      user.userid = userid;
      await AsyncStorage.setItem(userid, JSON.stringify(user));
      console.log('saveUser no user success: ',user);
    }
  } catch (error) {
      console.error(error);
  }
}
export default Storage;
