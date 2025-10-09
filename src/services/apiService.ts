import apiClient from '../config/api';
import { 
  LoginRequest, 
  RegisterRequest, 
  CreateMedicineRequest, 
  UpdateMedicineRequest,
  MedicineLogRequest,
  MedicineQueryParams 
} from '../types/api';

// Auth API
export const authAPI = {
  login: (data: LoginRequest) => 
    apiClient.post('/auth/login', data),
  
  register: (data: RegisterRequest) => 
    apiClient.post('/auth/register', data),
  
  getProfile: () => 
    apiClient.get('/auth/profile'),
  
  updateProfile: (data: Partial<RegisterRequest>) => 
    apiClient.put('/auth/profile', data),
};

// Medicine API
export const medicineAPI = {
  // CRUD operations
  createMedicine: (data: CreateMedicineRequest) => 
    apiClient.post('/medicines', data),
  
  getMedicines: (params?: MedicineQueryParams) => 
    apiClient.get('/medicines', { params }),
  
  getMedicineById: (id: string) => 
    apiClient.get(`/medicines/${id}`),
  
  updateMedicine: (id: string, data: UpdateMedicineRequest) => 
    apiClient.put(`/medicines/${id}`, data),
  
  deleteMedicine: (id: string) => 
    apiClient.delete(`/medicines/${id}`),
  
  // Specialized endpoints
  getMedicinesForDate: (date: string) => 
    apiClient.get(`/medicines/date/${date}`),
  
  getMedicineStats: () => 
    apiClient.get('/medicines/stats'),
  
  getMedicineLogs: (params?: { startDate?: string; endDate?: string }) => 
    apiClient.get('/medicines/logs', { params }),
  
  logMedicine: (data: MedicineLogRequest) => 
    apiClient.post('/medicines/log', data),
};

// Health check
export const healthAPI = {
  check: () => 
    apiClient.get('/health'),
};

export default {
  auth: authAPI,
  medicine: medicineAPI,
  health: healthAPI,
};
