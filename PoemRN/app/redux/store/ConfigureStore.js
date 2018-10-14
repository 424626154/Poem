'use strict';
/**
 * 创建Store,整合Provider
 * Songlcy create by 2017-01-10
 * @flow
 */
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import {middleware} from '../../AppNavigator';
import rootReducer from '../reducers/Reducers';
// import {NavigationActions} from 'react-navigation';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
// const navReducer = (state,action) => {
//     const newState = AppNavigator.router.getStateForAction(action, state);
//     return newState || state;
// }

const logger = store => next => action => {
	// console.log('@@@@@@@@@ logger:'+JSON.stringify(action))
	console.log('@@@@@@@@@ logger:')
  console.log(action)
	if(typeof action === 'function') console.log('dispatching a function');
	else console.log('dispatching', action);
	let result = next(action);
	console.log('next state', store.getState());
	return result;
}
const middlewares = [logger,thunk.withExtraArgument(),middleware];
const new_middleware = applyMiddleware(...middlewares);
let store = createStore(rootReducer,new_middleware);

export default store;
