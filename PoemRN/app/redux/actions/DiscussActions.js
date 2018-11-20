'use strict';
/**
 * Discuss Actions
 * @flow
 */
import * as TYPES from './ActionTypes';

export function raAddDiscuss(temp:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.ADDDISCUSS,
        temp:temp,
      }
      dispatch(action);
  }
}
export function raDelDiscuss(temp:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.DELDISCUSS,
        temp:temp,
      }
      dispatch(action);
  }
}
export function raHeadDiscuss(temps:Array<Object>,count:number){
  return (dispatch:any) => {
      let action = {
        type:TYPES.HEAD_DISCUSS,
        temps:temps,
        count:count,
      }
      dispatch(action);
  }
}
export function raFooterDiscuss(temps:Array<Object>,count:number){
  return (dispatch:any) => {
      let action = {
        type:TYPES.FOOTER_DISCUSS,
        temps:temps,
        count:count,
      }
      dispatch(action);
  }
}
/**
 * 更新列表
 */
export function raUpDiscuss(temps:Array<Object>){
  return (dispatch:any) => {
      let action = {
        type:TYPES.UP_DISCUSS,
        temps:temps,
      }
      dispatch(action);
  }
}

export function raDLoveMe(temp:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.DLOVEME,
        temp:temp,
      }
      dispatch(action);
  }
}

export function raSetDiscuss(temp:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.SETDISCUSS,
        temp:temp,
      }
      dispatch(action);
  }
}

export function raUpCommNum(id:number,commentnum:number){
  return (dispatch:any) => {
      let action = {
        type:TYPES.UPDCOMMNUM,
        id:id,
        commentnum:commentnum,
      }
      dispatch(action);
  }
}

export function raUpStart(sid:number,star:number){
  return (dispatch:any) => {
      let action = {
        type:TYPES.UPDSTAR,
        sid:sid,
        star:star,
      }
      dispatch(action);
  }
}
