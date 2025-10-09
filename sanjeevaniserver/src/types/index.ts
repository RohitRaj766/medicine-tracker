import { Request } from 'express';

// Type definitions
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface Medicine {
  id: string;
  userId: string;
  medicineName: string;
  dosage: string;
  medicineType: string | null;
  frequency: string;
  duration: string | null;
  startDate: Date;
  endDate: Date;
  time: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicineLog {
  id: string;
  userId: string;
  medicineId: string;
  date: Date;
  status: MedicineStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type MedicineStatus = 'TAKEN' | 'MISSED' | 'PENDING' | 'EDITED';

// Extended Request interface with user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password?: string; // For social login, password might be optional
}

export interface RegisterRequest {
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
  };
  token: string;
}

// Medicine types
export interface CreateMedicineRequest {
  medicineName: string;
  dosage: string;
  medicineType?: string;
  frequency: string;
  duration?: string;
  startDate: string;
  endDate: string;
  time?: string;
  notes?: string;
}

export interface UpdateMedicineRequest extends Partial<CreateMedicineRequest> {
  id: string;
}

export interface MedicineLogRequest {
  medicineId: string;
  date: string;
  status: MedicineStatus;
  notes?: string;
}

// Query parameters
export interface MedicineQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: MedicineStatus;
  search?: string;
}

export interface MedicineStatsResponse {
  totalMedicines: number;
  totalTaken: number;
  totalMissed: number;
  complianceRate: number;
  currentStreak: number;
  longestStreak: number;
  totalDaysTracked: number;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}
