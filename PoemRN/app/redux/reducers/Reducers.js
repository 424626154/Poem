'use strict';

import * as TYPES from '../actions/ActionTypes';
import { combineReducers } from 'redux';

const initialState = {
	love: {},
	num:0,
};


function papp(state=initialState, action){
	console.log('~~~~~~~~~~~~~~~papp');
	console.log(action);
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
			return Object.assign({}, state, {
				num: action.num,
			});
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
