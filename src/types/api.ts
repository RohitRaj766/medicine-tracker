// API Request/Response types
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
  password?: string;
}

export interface RegisterRequest {
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
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

export interface Medicine {
  id: string;
  userId: string;
  medicineName: string;
  dosage: string;
  medicineType?: string;
  frequency: string;
  duration?: string;
  startDate: string;
  endDate: string;
  time?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineLog {
  id: string;
  userId: string;
  medicineId: string;
  date: string;
  status: MedicineStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  medicine?: Medicine;
}

export type MedicineStatus = 'TAKEN' | 'MISSED' | 'PENDING' | 'EDITED';

export interface MedicineLogRequest {
  medicineId: string;
  date: string;
  status: MedicineStatus;
  notes?: string;
}

export interface MedicineQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: MedicineStatus;
  search?: string;
}

export interface MedicineStats {
  totalMedicines: number;
  totalTaken: number;
  totalMissed: number;
  complianceRate: number;
  currentStreak: number;
  longestStreak: number;
  totalDaysTracked: number;
}

// Error types
export interface ApiError {
  message: string;
  error: string;
  statusCode?: number;
}
