'use strict'
 /**
  * 自定义模块集合
  * @flow
  */
import {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  ImageConfig,
  Permission,
  UIName,
} from './Config';
import HttpUtil from './utils/HttpUtil';
import Emitter from './utils/Emitter';//监听
import Global from './Global';//全局数据
import pstyles from './style/PStyles';//公共样式
import Storage from './utils/Storage';
import UIUtil from './utils/UIUtil';
import MessageDao from './db/MessageDao';
import HomePoemDao from './db/HomePoemDao';
import ChatDao from './db/ChatDao';
import PImage from './custom/PImage';
import BitSet from './utils/BitSet';
import Toast from 'react-native-root-toast';
var Utils = {};

Utils.dateStr = function(date:number){
  //获取js 时间戳
  var time=new Date().getTime();
  //去掉 js 时间戳后三位，与php 时间戳保持一致
  time=parseInt((time-date*1000)/1000);

  //存储转换值
  var s;
  if(time<60*10){//十分钟内
      return '刚刚';
  }else if((time<60*60)&&(time>=60*10)){
      //超过十分钟少于1小时
      s = Math.floor(time/60);
      return  s+"分钟前";
  }else if((time<60*60*24)&&(time>=60*60)){
      //超过1小时少于24小时
      s = Math.floor(time/60/60);
      return  s+"小时前";
  }else if((time<60*60*24*3)&&(time>=60*60*24)){
      //超过1天少于3天内
      s = Math.floor(time/60/60/24);
      return s+"天前";
  }else{
      //超过3天
      var date1= new Date(parseInt(date) * 1000);
      return date1.getFullYear()+"/"+(date1.getMonth()+1)+"/"+date1.getDate();
  }
}
Utils.log = function(key:string,value:string){
  console.log('~~~~~~'+key+':'+JSON.stringify(value)+'~~~~~');
}

/**
 * 头像处理
 * @param  {[string]} head [头像地址]
 * @return {[object]}      [处理后的头像地址]
 */
Utils.getHead = function(head:string){
  let headurl = head?{uri:HttpUtil.getHeadurl(head)}:ImageConfig.nothead;
  return headurl
}

Utils.getPhoto = function(photo:string){
  let photourl = photo?{uri:HttpUtil.getHeadurl(photo)}:ImageConfig.notphoto;
  return photourl
}
/**
 * 判断登录
 */
Utils.isLogin = function(navigation:any){
  let {navigate,state} = navigation;
  var isLogin = false;
  let userid = Storage.getUserid();
  if(userid){
    isLogin = true;
  }else{
    navigate(UIName.LoginUI)
  }
  return isLogin;
}
/**
 * 获取时间
 */
Utils.getTime = function(){
  return new Date().getTime()/1000;
}
/**
 * 获取字符串长度
 */
Utils.strlen = function(str:string){
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var a = str.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
        }
        else {
            len += 1;
        }
    }
    return len;
}

Utils.getPermission = function(per_key:number,per:number){
  let bitset = new BitSet(per);
  bitset.init();
  console.log(per_key)
  console.log(bitset.getBit(per_key))
  return bitset.getBit(per_key);
}
Utils.setPermission = function(per_key:number,per_bool:boolean,per:number){
  let bitset = new BitSet(per);
  bitset.init();
  bitset.setBit(per_key,per_bool);
  return bitset.getLon();
}
Utils.getExtend = function(item:Object):Object{
  let extend = {}
  if(item.extend){
    extend = JSON.parse(item.extend);
  }
  // console.log('------_getExtend')
  // console.log(extend)
  return extend;
}
Utils.wp = function(percentage:number) {
    const value = (percentage * Global.width) / 100;
    return Math.round(value);
}
/**
 * 跳转个人页面
 */
export function goPersonalUI(navigate:any,userid:string){
    var routeName = UIName.PersonalUI;
    let myuserid = Storage.getUserid();
    if(myuserid == userid){
      return;
    }
    if(navigate){
      navigate(routeName,{userid:userid});
    }
  }


export function showToast(tips:string){
  let toast = Toast.show(tips, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
  });
}

// export function copyArray(forarry:Array<Object>):Array<Object>{
//   console.log('------copyArray')
//   return typeof(forarry) === "undefined"&&forarry.constructor === Array&&forarry?[...forarry]:[];
// }


const hasOwn = Object.prototype.hasOwnProperty

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export function shallowEqual(objA:any, objB:any) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}

export {
  StyleConfig,
  HeaderConfig,
  StorageConfig,
  ImageConfig,
  Permission,
  UIName,
  Utils,
  HttpUtil,
  Emitter,
  Global,
  pstyles,
  Storage,
  UIUtil,
  MessageDao,
  HomePoemDao,
  ChatDao,
  PImage,
}
