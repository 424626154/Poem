'use strict';
import * as TYPES from './ActionTypes';
/**
 * 更新列表
 */
export function raUpHomePoems(homepoems){
  return (dispatch) => {
      let action = {
        type:TYPES.UP_HOME_POEMS,
        homepoems:homepoems,
      }
      dispatch(action);
  }
}
export function raUpMyPoems(mypoems){
  return (dispatch) => {
      let action = {
        type:TYPES.UP_MY_POEMS,
        mypoems:mypoems,
      }
      dispatch(action);
  }
}
export function raAddPoem(poem){
  return (dispatch) => {
      let action = {
        type:TYPES.ADDPOEM,
        poem:poem,
      }
      dispatch(action);
  }
}

export function raUpPoemInfo(poem){
  return (dispatch) => {
      let action = {
        type:TYPES.UP_POEM_INFO,
        poem:poem,
      }
      dispatch(action);
  }
}
export function raSetPoem(poem){
  return (dispatch) => {
      let action = {
        type:TYPES.SETPOEM,
        poem:poem,
      }
      dispatch(action);
  }
}
export function raLoveMe(poem){
  return (dispatch) => {
      let action = {
        type:TYPES.LOVEME,
        poem:poem,
      }
      dispatch(action);
  }
}

export function raUpPoemLC(poem){
  return (dispatch) => {
      let action = {
        type:TYPES.UP_POEM_LC,
        poem:poem,
      }
      dispatch(action);
  }
}

export function raDelPoem(poem){
  return (dispatch) => {
      let action = {
        type:TYPES.DELPOEM,
        poem:poem,
      }
      dispatch(action);
  }
}
