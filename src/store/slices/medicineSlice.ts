import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { medicineAPI } from '../../services/apiService';
import { 
  Medicine, 
  CreateMedicineRequest, 
  UpdateMedicineRequest,
  MedicineLogRequest,
  MedicineQueryParams,
  MedicineStats,
  MedicineLog 
} from '../../types/api';

interface MedicineState {
  medicines: Medicine[];
  medicineLogs: MedicineLog[];
  stats: MedicineStats | null;
  selectedMedicine: Medicine | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: MedicineState = {
  medicines: [],
  medicineLogs: [],
  stats: null,
  selectedMedicine: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const createMedicine = createAsyncThunk(
  'medicine/createMedicine',
  async (medicineData: CreateMedicineRequest, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.createMedicine(medicineData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create medicine');
    }
  }
);

export const getMedicines = createAsyncThunk(
  'medicine/getMedicines',
  async (params?: MedicineQueryParams, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.getMedicines(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get medicines');
    }
  }
);

export const getMedicineById = createAsyncThunk(
  'medicine/getMedicineById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.getMedicineById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get medicine');
    }
  }
);

export const updateMedicine = createAsyncThunk(
  'medicine/updateMedicine',
  async ({ id, data }: { id: string; data: UpdateMedicineRequest }, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.updateMedicine(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update medicine');
    }
  }
);

export const deleteMedicine = createAsyncThunk(
  'medicine/deleteMedicine',
  async (id: string, { rejectWithValue }) => {
    try {
      await medicineAPI.deleteMedicine(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete medicine');
    }
  }
);

export const getMedicinesForDate = createAsyncThunk(
  'medicine/getMedicinesForDate',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.getMedicinesForDate(date);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get medicines for date');
    }
  }
);

export const getMedicineStats = createAsyncThunk(
  'medicine/getMedicineStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.getMedicineStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get medicine stats');
    }
  }
);

export const getMedicineLogs = createAsyncThunk(
  'medicine/getMedicineLogs',
  async (params?: { startDate?: string; endDate?: string }, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.getMedicineLogs(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get medicine logs');
    }
  }
);

export const logMedicine = createAsyncThunk(
  'medicine/logMedicine',
  async (logData: MedicineLogRequest, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.logMedicine(logData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to log medicine');
    }
  }
);

const medicineSlice = createSlice({
  name: 'medicine',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedMedicine: (state, action: PayloadAction<Medicine | null>) => {
      state.selectedMedicine = action.payload;
    },
    clearMedicines: (state) => {
      state.medicines = [];
      state.medicineLogs = [];
      state.stats = null;
      state.selectedMedicine = null;
    },
  },
  extraReducers: (builder) => {
    // Create Medicine
    builder
      .addCase(createMedicine.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMedicine.fulfilled, (state, action: PayloadAction<Medicine>) => {
        state.isLoading = false;
        state.medicines.unshift(action.payload);
        state.error = null;
      })
      .addCase(createMedicine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Medicines
    builder
      .addCase(getMedicines.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMedicines.fulfilled, (state, action: PayloadAction<{ data: Medicine[]; pagination: any }>) => {
        state.isLoading = false;
        state.medicines = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getMedicines.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Medicine by ID
    builder
      .addCase(getMedicineById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMedicineById.fulfilled, (state, action: PayloadAction<Medicine>) => {
        state.isLoading = false;
        state.selectedMedicine = action.payload;
        state.error = null;
      })
      .addCase(getMedicineById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Medicine
    builder
      .addCase(updateMedicine.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMedicine.fulfilled, (state, action: PayloadAction<Medicine>) => {
        state.isLoading = false;
        const index = state.medicines.findIndex(med => med.id === action.payload.id);
        if (index !== -1) {
          state.medicines[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMedicine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Medicine
    builder
      .addCase(deleteMedicine.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMedicine.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.medicines = state.medicines.filter(med => med.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Medicine Stats
    builder
      .addCase(getMedicineStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMedicineStats.fulfilled, (state, action: PayloadAction<MedicineStats>) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getMedicineStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Medicine Logs
    builder
      .addCase(getMedicineLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMedicineLogs.fulfilled, (state, action: PayloadAction<MedicineLog[]>) => {
        state.isLoading = false;
        state.medicineLogs = action.payload;
        state.error = null;
      })
      .addCase(getMedicineLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Log Medicine
    builder
      .addCase(logMedicine.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logMedicine.fulfilled, (state, action: PayloadAction<MedicineLog>) => {
        state.isLoading = false;
        state.medicineLogs.unshift(action.payload);
        state.error = null;
      })
      .addCase(logMedicine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedMedicine, clearMedicines } = medicineSlice.actions;
export default medicineSlice.reducer;
