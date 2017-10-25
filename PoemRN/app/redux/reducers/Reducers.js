'use strict';

import * as TYPES from '../actions/ActionTypes';
import { combineReducers } from 'redux';

const initialState = {
	love: {},
};


function love(state=initialState, action){
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
        love:love,
        nav: navReducer
    });
}
