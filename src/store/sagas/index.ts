import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import medicineSaga from './medicineSaga';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(medicineSaga)]);
}
