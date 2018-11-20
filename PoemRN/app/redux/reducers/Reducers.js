'use strict';
/**
 * Reducers
 * @flow
 */
import { combineReducers } from 'redux';
import papp from './UserReducers';
import poems from './PoemsReducers';
import discuss from './DiscussReducers';
import navReducer from './NavigationReducer';

const rootReducer = combineReducers({
  nav: navReducer,
  papp,
  poems,
  discuss,
});
export default rootReducer;
