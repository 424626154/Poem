'use strict';
import * as TYPES from '../actions/ActionTypes';

const initialState = {
	num:0,
	userid:'',
	user:{},
	homepoems:[],
	refcomment:false,
	push_news:false,
	push_chat:false,
	chatuser:'',
	push_chat_user:false,
};

export default function papp(state=initialState, action){
	switch(action.type){
		case TYPES.MSGREAD: // 初始状态
			// console.log('------papp')
			// console.log('----action')
			// console.log(action)
			return Object.assign({}, state, {
				num: action.num,
			});
		case TYPES.AUTO_LOGIN:
			// console.log('------papp')
			// console.log('----action')
			// console.log(action)
			return Object.assign({}, state, {
				userid: action.userid,
				user:action.user,
			});
		case TYPES.UP_USER_INFO:
			// console.log('------papp')
			// console.log('----action')
			// console.log(action)
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
			// console.log('------papp')
			// console.log('----action')
			// console.log(action)
			return Object.assign({}, state, {
				 userid:action.userid,
				 user:action.user,
			 });
		case TYPES.LOGOUT:
			// console.log('------papp')
			// console.log('----action')
			// console.log(action)
			return Object.assign({}, state, {
				 userid:action.userid,
				 user:action.user,
			 });
		case TYPES.PUSHID:
	 			// console.log('------papp')
	 			// console.log('----action')
	 			// console.log(action)
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
	 			// console.log('------papp')
	 			// console.log('----action')
	 			// console.log(action)
				if(state.userid == action.userid){
					let up_user = Object.assign({}, state.user, {
						per:action.per,
					});
					return Object.assign({}, state, {
					 user:up_user,
				 });
				}
	 			return state;
		case TYPES.REFCOMMENT:
				// console.log('------papp')
				// console.log('----action')
				// console.log(action)
				return Object.assign({}, state, {
					 refcomment:action.state,
				 });
		 case TYPES.SET_PUSH_NEWS:
					// console.log('------papp')
					// console.log('----action')
					// console.log(action)
					return Object.assign({}, state, {
						 push_news:action.push_news,
					 });
		 case TYPES.SET_PUSH_CHAT:
					// console.log('------papp')
					// console.log('----action')
					// console.log(action)
					return Object.assign({}, state, {
						 push_chat:action.push_chat,
					 });
		 case TYPES.SET_CHAT_USER:
					// console.log('------papp')
					// console.log('----action')
					// console.log(action)
					return Object.assign({}, state, {
						 chatuser:action.chatuser,
					 });
		 case TYPES.SET_PUSH_CHAT_USER:
					// console.log('------papp')
					// console.log('----action')
					// console.log(action)
					return Object.assign({}, state, {
						 push_chat_user:action.push_chat_user,
					 });
		default:
			return state;
	}
}
