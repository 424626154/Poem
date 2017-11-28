'use strict';
/**
 * Reducers
 * @flow
 */
import { combineReducers } from 'redux';
import papp from './UserReducers';
import poems from './PoemsReducers';

export default function getReducers(navReducer:any) {
    return combineReducers({
        nav: navReducer,
				papp,
				poems,
    });
}
