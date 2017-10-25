import {fork} from 'redux-saga/effects';

import {watchRequestStory} from './story';

export default function* rootSaga() {
    yield [
        fork(watchRequestStory),
    ];
}
