'use strict';

import * as TYPES from '../actions/ActionTypes';
import { combineReducers } from 'redux';

const initialState = {
	love: {},
	num:0,
	userid:'',
	user:{},
};


function papp(state=initialState, action){
	switch(action.type){
		case TYPES.LIKE:

			return {
				...state,
				love: action.love
			};

		case TYPES.CANCEL_LIKE:
			return {
				...state,
  			love: action.love
			};
		case TYPES.MSGREAD: // 初始状态
			console.log('------papp')
			console.log('----action')
			console.log(action)
			return Object.assign({}, state, {
				num: action.num,
			});
		case TYPES.AUTO_LOGIN:
			console.log('------papp')
			console.log('----action')
			console.log(action)
			return Object.assign({}, state, {
				userid: action.userid,
				user:action.user,
			});
		case TYPES.UP_USER_INFO:
			console.log('------papp')
			console.log('----action')
			console.log(action)
			if(state.userid == action.userid){
				let up_user = Object.assign({}, state.user, {
					head:action.head,
					pseudonym:action.pseudonym,
				});
				return Object.assign({}, state, {
				 user:up_user,
			 });
			}
			return state;
		case TYPES.LOGIN:
			console.log('------papp')
			console.log('----action')
			console.log(action)
			return Object.assign({}, state, {
				 userid:action.userid,
				 user:action.user,
			 });
		case TYPES.LOGOUT:
			console.log('------papp')
			console.log('----action')
			console.log(action)
			return Object.assign({}, state, {
				 userid:action.userid,
				 user:action.user,
			 });
		case TYPES.PUSHID:
	 			console.log('------papp')
	 			console.log('----action')
	 			console.log(action)
				if(state.userid == action.userid){
					let up_user = Object.assign({}, state.user, {
						pushid:action.pushid,
					});
					return Object.assign({}, state, {
					 user:up_user,
				 });
				}
	 			return state;
		case TYPES.PERMISSION:
	 			console.log('------papp')
	 			console.log('----action')
	 			console.log(action)
				if(state.userid == action.userid){
					let up_user = Object.assign({}, state.user, {
						per:action.per,
					});
					return Object.assign({}, state, {
					 user:up_user,
				 });
				}
	 			return state;
		default:
			return state;
	}
}

// export default combineReducers({
// 	userStore: love,
// });
// const rootReducer = combineReducers({
//   love:love,
// });
//
// export default rootReducer;
export default function getReducers(navReducer) {
    return combineReducers({
				papp:papp,
        nav: navReducer
    });
}
