'use strict';
import { combineReducers } from 'redux';
import papp from './UserReducers';
import poems from './PoemsReducers';

export default function getReducers(navReducer) {
    return combineReducers({
        nav: navReducer,
				papp,
				poems,
    });
}
