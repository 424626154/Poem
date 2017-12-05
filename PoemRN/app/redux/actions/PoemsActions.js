'use strict';
/**
 * Poem Actions
 * @flow
 */
import * as TYPES from './ActionTypes';
/**
 * 更新列表
 */
export function raUpHomePoems(homepoems:Array<Object>){
  return (dispatch:any) => {
      let action = {
        type:TYPES.UP_HOME_POEMS,
        homepoems:homepoems,
      }
      dispatch(action);
  }
}
export function raHeadHomePoems(temps:Array<Object>){
  return (dispatch:any) => {
      let action = {
        type:TYPES.HEAD_HOME_POEMS,
        temps:temps,
      }
      dispatch(action);
  }
}
export function raFooterHomePoems(temps:Array<Object>){
  return (dispatch:any) => {
      let action = {
        type:TYPES.FOOTER_HOME_POEMS,
        temps:temps,
      }
      dispatch(action);
  }
}
export function raUpMyPoems(mypoems:Array<Object>){
  return (dispatch:any) => {
      let action = {
        type:TYPES.UP_MY_POEMS,
        mypoems:mypoems,
      }
      dispatch(action);
  }
}
export function raAddPoem(poem:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.ADDPOEM,
        poem:poem,
      }
      dispatch(action);
  }
}
/**
*修改作品信息
*/
export function raUpPoemInfo(poem:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.UP_POEM_INFO,
        poem:poem,
      }
      dispatch(action);
  }
}
export function raSetPoem(poem:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.SETPOEM,
        poem:poem,
      }
      dispatch(action);
  }
}
export function raLoveMe(poem:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.LOVEME,
        poem:poem,
      }
      dispatch(action);
  }
}

export function raUpPoemLC(poem:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.UP_POEM_LC,
        poem:poem,
      }
      dispatch(action);
  }
}

export function raDelPoem(poem:Object){
  return (dispatch:any) => {
      let action = {
        type:TYPES.DELPOEM,
        poem:poem,
      }
      dispatch(action);
  }
}
export function raUpFont(){
  return (dispatch:any) => {
      let action = {
        type:TYPES.UPFONT,
      }
      dispatch(action);
  }
}
