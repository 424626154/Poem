'use strict'
/**
 * 本地缓存数据
 * @flow
 */
import StorageDao from '../db/StorageDao';
// import {StorageConfig} from '../Config';
var StorageConfig = {

};
StorageConfig.USERID = 'userid';
StorageConfig.PUSHIID = 'pushid';
StorageConfig.LAST_PHONE = 'last_phone';//上次登录手机号
StorageConfig.LABEL_HISTORY = 'label_history';//标签历史
StorageConfig.FontFamily = 'fontFamily';
StorageConfig.FontSize = 'fontSize';
StorageConfig.FontAlignment = 'fontAlignment'
StorageConfig.LineHeight = 'lineHeight';
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

Storage.getLabelHistory = function(){
  try {
      let label_history = StorageDao.getItem(StorageConfig.LABEL_HISTORY);
      return label_history;
  } catch (error) {
      console.error(error);
  }
}

Storage.saveLabelHistory = function(label_history:string){
  try {
      let value = StorageDao.setItem(StorageConfig.LABEL_HISTORY,label_history);
      console.log(value)
  } catch (error) {
      console.error(error);
  }
}

Storage.getFontFamily = function(){
  try {
      let label_history = StorageDao.getItem(StorageConfig.FontFamily);
      return label_history||'HYZhongSongJ';
  } catch (error) {
      console.error(error);
  }
}

Storage.saveFontFamily = function(fontFamily:string){
  try {
      let value = StorageDao.setItem(StorageConfig.FontFamily,fontFamily);
      console.log(value)
  } catch (error) {
      console.error(error);
  }
}

Storage.getFontSize = function():number{
  let size = 1;
  try {
      let value = StorageDao.getItem(StorageConfig.FontSize);
      if(!isNaN(parseInt(value))){
        size = parseInt(value);
      }
  } catch (error) {
      console.error(error);
  }finally{
    return size;
  }
}

Storage.saveFontSize = function(fontSize:number){
  try {
      let value = StorageDao.setItem(StorageConfig.FontSize,fontSize+'');
      console.log(value)
  } catch (error) {
      console.error(error);
  }
}


Storage.getFontAlignment = function(){
  try {
      let value = StorageDao.getItem(StorageConfig.FontAlignment);
      console.log('------getFontAlignment')
      let align = 'center';
      if(value == 'center'||value == 'left'){
        align = value;
      }
      console.log(align)
      return align;
  } catch (error) {
      console.error(error);
  }
}

Storage.saveFontAlignment = function(fontAlignment:string){
  try {
      let value = StorageDao.setItem(StorageConfig.FontAlignment,fontAlignment);
      console.log(value)
  } catch (error) {
      console.error(error);
  }
}

Storage.getLineHeight = function():number{
  let lineHeight = 22;
  try {
      let value = StorageDao.getItem(StorageConfig.LineHeight);
      if(!isNaN(parseInt(value))){
        lineHeight = parseInt(value);
      }
  } catch (error) {
      console.error(error);
  }finally{
    return lineHeight;
  }
}

Storage.saveLineHeight = function(lineHeight:number){
  try {
      let value = StorageDao.setItem(StorageConfig.LineHeight,lineHeight+'');
      console.log(value)
  } catch (error) {
      console.error(error);
  }
}

export default Storage;
