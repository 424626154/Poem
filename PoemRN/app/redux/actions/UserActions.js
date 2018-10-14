'use strict';
/**
 * User Actions
 * @flow
 */
import {
  Platform,
} from 'react-native';
import * as TYPES from './ActionTypes';
import{
      HttpUtil,
      MessageDao,
      ChatDao,
      Global,
      Storage,
    }from '../../AppUtil';
export function raMsgRead(){
  return (dispatch:any) => {
      let news_num = MessageDao.getUnreadNum();
      let chat_nume = ChatDao.getAllUnreadNum();
      let num = news_num + chat_nume;
      let action = {
        type:TYPES.MSGREAD,
        num:num,
      }
      console.log('---Redux Actions onMsgRead()')
      console.log(action)
      dispatch(action);
  }
}

export function raAutoLogin(userid:string){
  return (dispatch:any) => {
      let json = JSON.stringify({
        userid:userid ,
      });
      HttpUtil.post(HttpUtil.USER_INFO,json).then(res=>{
          // console.log('---- raAutoLogin res:',res)
          if(res.code == 0){
            let user = res.data;
            let action = {
              type:TYPES.AUTO_LOGIN,
              userid:user.userid,
              user:user,
            }
            Global.userid = userid;
      			Global.per = user.per;
            dispatch(action);
          }else{
            console.log('---Post User Info Code :',res.code);
          }
      }).catch(err=>{
        console.error(err);
      })
  }
}
/**
 * 更新用户头像昵称
 */
export function raUpInfo(userid:string,head:string,pseudonym:string){
  return (dispatch:any) => {
      let action = {
        type:TYPES.UP_USER_INFO,
        userid:userid,
        head:head,
        pseudonym:pseudonym,
      }
      dispatch(action);
  }
}
/**
 * 登录
 */
export function raLogin(userid:string,user:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.LOGIN,
        userid:userid,
        user:user,
      }
			Global.per = user.per;
      dispatch(action);
  }
}
/**
 * 退出登录
 */
export function raLogout(){
  return (dispatch:any) => {
      let action = {
        type:TYPES.LOGOUT,
        userid:'',
        user:{},
      }
      Global.userid = '';
      dispatch(action);
  }
}
/**
 * 上传pushid
 */
export function raPushId(userid:string,pushid:string){
  return (dispatch:any) => {
    if(!userid||!pushid){
      console.log('------_requestPushId error!');
      return;
    }
    var os = '';
    if(Platform.OS == 'ios'){
      os = 'ios';
    }
    if(Platform.OS == 'android'){
      os = 'android';
    }
    var json = JSON.stringify({
      userid:userid,
      pushid:pushid,
      os:os,
    })
    HttpUtil.post(HttpUtil.MESSAGE_PUSHID,json).then(res=>{
      if(res.code == 0){
        var user = res.data;
        Storage.saveUser(user.userid,{"pushid":user.pushid});
        let action = {
          type:TYPES.PUSHID,
          userid:user.userid,
          pushid:user.pushid,
        }
        dispatch(action);
      }else{
        console.log(res.errmsg);
      }
    }).catch(err=>{
      console.error(err);
    })
  }
}
/**
 * 修改权限
 */
export function rePermission(userid:string,per:number){
  return (dispatch:any) => {
      let action = {
        type:TYPES.PERMISSION,
        userid:userid,
        per:per,
      }
      Global.per = per;
      dispatch(action);
  }
}
/**
 * 刷新是否评论状态
 */
export function raRefComment(state:boolean){
  return (dispatch:any) => {
      let action = {
        type:TYPES.REFCOMMENT,
        state:state,
      }
      dispatch(action);
  }
}

export function raSetPushNews(push_news:boolean){
  return (dispatch:any) => {
      let action = {
        type:TYPES.SET_PUSH_NEWS,
        push_news:push_news,
      }
      dispatch(action);
  }
}

export function raSetPushChat(push_chat:boolean){
  return (dispatch:any) => {
      let action = {
        type:TYPES.SET_PUSH_CHAT,
        push_chat:push_chat,
      }
      dispatch(action);
  }
}

export function raSetChatUser(chatuser:string){
  return (dispatch:any) => {
      let action = {
        type:TYPES.SET_CHAT_USER,
        chatuser:chatuser,
      }
      dispatch(action);
  }
}

export function raSetPushChatUser(push_chat_user:boolean){
  return (dispatch:any) => {
      let action = {
        type:TYPES.SET_PUSH_CHAT_USER,
        push_chat_user:push_chat_user,
      }
      dispatch(action);
  }
}
