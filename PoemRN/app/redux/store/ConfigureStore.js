'use strict';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
// import { persistStore, autoRehydrate } from 'redux-persist';
// import { AsyncStorage } from 'react-native';
// import rootReducer from '../reducers/Reducers';

const logger = store => next => action => {
	console.log('@@@@@@@@@ logger:'+JSON.stringify(action))
	if(typeof action === 'function') console.log('dispatching a function');
	else console.log('dispatching', action);
	let result = next(action);
	console.log('next state', store.getState());
	return result;
}

let middlewares = [
	logger,
	thunk
];

let createAppStore = applyMiddleware(...middlewares)(createStore);

// export default function configureStore(onComplete: ()=>void){
// 	// const store = autoRehydrate()(createAppStore)(reducers);
// 	// let opt = {
// 	// 	storage: AsyncStorage,
// 	// 	transform: [],
// 	// 	//whitelist: ['userStore'],
// 	// };
// 	// persistStore(store, opt, onComplete);
// 	return store;
// }

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
// export default function configureStore(initialState) {
//     const store = createStoreWithMiddleware(rootReducer, initialState);
// 		return store;
// }


// import { createStore, applyMiddleware } from 'redux';
// import promiseMiddleware from 'redux-promise';

import getReducers from '../reducers/Reducers';
//promiseMiddleware 是异步action的一个中间件，本例子中暂时没有使用
export default function getStore(navReducer) {
    // return createStore(
    //     getReducers(navReducer),
    //     undefined,
    //     applyMiddleware(middlewares)
    // );
	    const store = createAppStore(getReducers(navReducer));
			return store;
}
