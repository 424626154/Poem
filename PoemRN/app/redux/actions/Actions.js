'use strict';
import {
  Platform,
} from 'react-native';
import * as TYPES from './ActionTypes';
import{
      HttpUtil,
      MessageDao,
      ChatDao,
    }from '../../AppUtil';
export function onLike(body){
  return (dispatch) => {
    HttpUtil.post(HttpUtil.POEM_LOVEPOEM,body).then((result)=>{
        let type = body.onlove == 0 ? TYPES.LIKE : TYPES.CANCEL_LIKE;
        if(result.code == 0){
          dispatch({type:type,love:result.data})
        }else{
          dispatch({type:type})
        }
    }).catch((err)=>{
      console.error(err);
    })
  }
}
export function onMsgRead(){
  return (dispatch) => {
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

export function setUserId(userid){
  return (dispatch) => {
      let action = {
        type:TYPES.SET_USERID,
        userid:userid,
      }
      console.log('---Redux Actions setUserId()')
      console.log(action)
      dispatch(action);
  }
}

export function raAutoLogin(userid){
  return (dispatch) => {
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
export function raUpInfo(userid,head,pseudonym){
  return (dispatch) => {
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
export function reLogin(userid,user){
  return (dispatch) => {
      let action = {
        type:TYPES.LOGIN,
        userid:userid,
        user:user,
      }
      dispatch(action);
  }
}
/**
 * 退出登录
 */
export function reLogout(userid,head,pseudonym){
  return (dispatch) => {
      let action = {
        type:TYPES.LOGOUT,
        userid:'',
        user:{},
      }
      dispatch(action);
  }
}
/**
 * 上传pushid
 */
export function raPushId(userid,pushid){
  return (dispatch) => {
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
export function rePermission(userid,per){
  return (dispatch) => {
      let action = {
        type:TYPES.PERMISSION,
        userid:userid,
        per:per,
      }
      dispatch(action);
  }
}
