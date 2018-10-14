'use strict';
/**
 * Reducers
 * @flow
 */
import { combineReducers } from 'redux';
import papp from './UserReducers';
import poems from './PoemsReducers';
import navReducer from './NavigationReducer';

const rootReducer = combineReducers({
  nav: navReducer,
  papp,
  poems,
});
export default rootReducer;
