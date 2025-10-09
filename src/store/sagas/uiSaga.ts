import { takeEvery, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { setError, setSuccess } from '../slices/uiSlice';

function* handleError(action: PayloadAction<string>) {
  // Additional error handling logic can be added here
  // For example, logging errors to analytics
  console.log('Error occurred:', action.payload);
}

function* handleSuccess(action: PayloadAction<string>) {
  // Additional success handling logic can be added here
  // For example, showing toast notifications
  console.log('Success:', action.payload);
}

export default function* uiSaga() {
  yield takeEvery(setError, handleError);
  yield takeEvery(setSuccess, handleSuccess);
}
