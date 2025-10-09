import { takeEvery, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  createMedicine, 
  updateMedicine, 
  deleteMedicine,
  logMedicine 
} from '../slices/medicineSlice';
import { setError, setSuccess } from '../slices/uiSlice';

function* handleCreateMedicine(action: PayloadAction<any>) {
  try {
    yield put(setSuccess('Medicine created successfully'));
  } catch (error) {
    yield put(setError('Failed to create medicine'));
  }
}

function* handleUpdateMedicine(action: PayloadAction<any>) {
  try {
    yield put(setSuccess('Medicine updated successfully'));
  } catch (error) {
    yield put(setError('Failed to update medicine'));
  }
}

function* handleDeleteMedicine(action: PayloadAction<any>) {
  try {
    yield put(setSuccess('Medicine deleted successfully'));
  } catch (error) {
    yield put(setError('Failed to delete medicine'));
  }
}

function* handleLogMedicine(action: PayloadAction<any>) {
  try {
    yield put(setSuccess('Medicine logged successfully'));
  } catch (error) {
    yield put(setError('Failed to log medicine'));
  }
}

export default function* medicineSaga() {
  yield takeEvery(createMedicine.fulfilled, handleCreateMedicine);
  yield takeEvery(updateMedicine.fulfilled, handleUpdateMedicine);
  yield takeEvery(deleteMedicine.fulfilled, handleDeleteMedicine);
  yield takeEvery(logMedicine.fulfilled, handleLogMedicine);
}
