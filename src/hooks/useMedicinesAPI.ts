import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, AppDispatch } from '../store';
import { 
  createMedicine, 
  getMedicines, 
  getMedicineById, 
  updateMedicine, 
  deleteMedicine,
  getMedicinesForDate,
  getMedicineStats,
  getMedicineLogs,
  logMedicine
} from '../store/slices/medicineSlice';
import { medicineAPI } from '../services/apiService';
import { 
  CreateMedicineRequest, 
  UpdateMedicineRequest,
  MedicineLogRequest,
  MedicineQueryParams 
} from '@/types/api';

export const useMedicinesAPI = (params?: MedicineQueryParams) => {
  const dispatch = useDispatch<AppDispatch>();
  const { medicines, isLoading, error, pagination } = useSelector(
    (state: RootState) => state.medicine
  );

  const queryClient = useQueryClient();

  const medicinesQuery = useQuery({
    queryKey: ['medicines', params],
    queryFn: () => medicineAPI.getMedicines(params),
    onSuccess: (data) => {
      dispatch(getMedicines.fulfilled(data.data, 'getMedicines'));
    },
    onError: (error: any) => {
      dispatch(getMedicines.rejected(error));
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateMedicineRequest) => medicineAPI.createMedicine(data),
    onSuccess: (data) => {
      dispatch(createMedicine.fulfilled(data.data, 'createMedicine'));
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
    onError: (error: any) => {
      dispatch(createMedicine.rejected(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicineRequest }) => 
      medicineAPI.updateMedicine(id, data),
    onSuccess: (data) => {
      dispatch(updateMedicine.fulfilled(data.data, 'updateMedicine'));
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
    onError: (error: any) => {
      dispatch(updateMedicine.rejected(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => medicineAPI.deleteMedicine(id),
    onSuccess: (_, id) => {
      dispatch(deleteMedicine.fulfilled(id, 'deleteMedicine'));
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
    onError: (error: any) => {
      dispatch(deleteMedicine.rejected(error));
    },
  });

  const logMutation = useMutation({
    mutationFn: (data: MedicineLogRequest) => medicineAPI.logMedicine(data),
    onSuccess: (data) => {
      dispatch(logMedicine.fulfilled(data.data, 'logMedicine'));
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
    onError: (error: any) => {
      dispatch(logMedicine.rejected(error));
    },
  });

  return {
    medicines,
    isLoading: isLoading || medicinesQuery.isLoading,
    error: error || medicinesQuery.error,
    pagination,
    createMedicine: createMutation.mutate,
    updateMedicine: updateMutation.mutate,
    deleteMedicine: deleteMutation.mutate,
    logMedicine: logMutation.mutate,
    refetch: medicinesQuery.refetch,
  };
};

export const useMedicineByIdAPI = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMedicine, isLoading, error } = useSelector(
    (state: RootState) => state.medicine
  );

  const medicineQuery = useQuery({
    queryKey: ['medicine', id],
    queryFn: () => medicineAPI.getMedicineById(id),
    enabled: !!id,
    onSuccess: (data) => {
      dispatch(getMedicineById.fulfilled(data.data, 'getMedicineById'));
    },
    onError: (error: any) => {
      dispatch(getMedicineById.rejected(error));
    },
  });

  return {
    medicine: selectedMedicine,
    isLoading: isLoading || medicineQuery.isLoading,
    error: error || medicineQuery.error,
    refetch: medicineQuery.refetch,
  };
};

export const useMedicineStatsAPI = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, isLoading, error } = useSelector(
    (state: RootState) => state.medicine
  );

  const statsQuery = useQuery({
    queryKey: ['medicineStats'],
    queryFn: () => medicineAPI.getMedicineStats(),
    onSuccess: (data) => {
      dispatch(getMedicineStats.fulfilled(data.data, 'getMedicineStats'));
    },
    onError: (error: any) => {
      dispatch(getMedicineStats.rejected(error));
    },
  });

  return {
    stats,
    isLoading: isLoading || statsQuery.isLoading,
    error: error || statsQuery.error,
    refetch: statsQuery.refetch,
  };
};

export const useMedicinesForDateAPI = (date: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { medicines, isLoading, error } = useSelector(
    (state: RootState) => state.medicine
  );

  const medicinesQuery = useQuery({
    queryKey: ['medicines', 'date', date],
    queryFn: () => medicineAPI.getMedicinesForDate(date),
    enabled: !!date,
    onSuccess: (data) => {
      dispatch(getMedicinesForDate.fulfilled(data.data, 'getMedicinesForDate'));
    },
    onError: (error: any) => {
      dispatch(getMedicinesForDate.rejected(error));
    },
  });

  return {
    medicines,
    isLoading: isLoading || medicinesQuery.isLoading,
    error: error || medicinesQuery.error,
    refetch: medicinesQuery.refetch,
  };
};

export const useMedicineLogsAPI = (params?: { startDate?: string; endDate?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { medicineLogs, isLoading, error } = useSelector(
    (state: RootState) => state.medicine
  );

  const logsQuery = useQuery({
    queryKey: ['medicineLogs', params],
    queryFn: () => medicineAPI.getMedicineLogs(params),
    onSuccess: (data) => {
      dispatch(getMedicineLogs.fulfilled(data.data, 'getMedicineLogs'));
    },
    onError: (error: any) => {
      dispatch(getMedicineLogs.rejected(error));
    },
  });

  return {
    logs: medicineLogs,
    isLoading: isLoading || logsQuery.isLoading,
    error: error || logsQuery.error,
    refetch: logsQuery.refetch,
  };
};
