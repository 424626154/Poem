'use strict';
import * as TYPES from './ActionTypes';
import HttpUtil from '../../utils/HttpUtil';
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
