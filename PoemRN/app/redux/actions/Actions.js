'use strict';
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
