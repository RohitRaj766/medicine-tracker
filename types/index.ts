import { TextStyle, ViewStyle } from 'react-native'

// Medicine related types
export interface Medicine {
  id: string
  medicineName: string
  dosage: string
  medicineType?: string
  frequency: string
  duration?: string
  startDate?: string
  endDate?: string
  time?: string
  notes?: string
  createdAt: string
  consumedDates: string[]
  missedDates?: string[]
  lastEditedDate?: string
  lastEditedChanges?: string[]
  parentMedicineId?: string
  timeSlotIndex?: number
}

// Form related types
export interface MedicineFormData {
  medicineName: string
  dosage: string
  medicineType: string
  frequency: string
  duration: string
  startDate: Date
  endDate: Date
  notes: string
  selectedTime?: Date
  selectedTimes?: Date[]
}

// User related types
export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  emailVerified: boolean
  createdAt?: string
  lastLoginAt?: string
}

// Component prop types
export interface MedicineCardProps {
  medicine: Medicine
  selectedDate?: Date
  onUpdate: () => void
}

export interface DropdownOption {
  label: string
  value: string
  icon?: string
}

export interface ModalProps {
  visible: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

// Validation types
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// API/Storage types
export interface StorageResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Hook types
export interface UseMedicineFormReturn {
  formData: MedicineFormData
  errors: ValidationError[]
  isLoading: boolean
  updateField: (field: keyof MedicineFormData, value: any) => void
  validateForm: () => ValidationResult
  resetForm: () => void
  saveMedicine: () => Promise<boolean>
}

export interface UseMedicinesReturn {
  medicines: Medicine[]
  isLoading: boolean
  error: string | null
  loadMedicines: () => Promise<void>
  getMedicinesForDate: (date: Date) => Medicine[]
  markAsTaken: (medicineId: string, date: Date) => Promise<boolean>
  markAsMissed: (medicineId: string, date: Date) => Promise<boolean>
  deleteMedicine: (medicineId: string) => Promise<boolean>
}

// Theme types
export interface Theme {
  colors: {
    primary: string
    secondary: string
    success: string
    warning: string
    error: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    shadow: string
  }
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
  }
  typography: {
    h1: TextStyle
    h2: TextStyle
    h3: TextStyle
    body: TextStyle
    caption: TextStyle
    button: TextStyle
  }
  borderRadius: {
    sm: number
    md: number
    lg: number
    xl: number
  }
  shadows: {
    sm: ViewStyle
    md: ViewStyle
    lg: ViewStyle
  }
}

// Navigation types
export interface NavigationParams {
  medicine?: string
  [key: string]: any
}

// Statistics types
export interface MedicineStats {
  totalMedicines: number
  totalTaken: number
  totalMissed: number
  complianceRate: number
  currentStreak: number
  longestStreak: number
  totalDaysTracked: number
}

// Date/Time types
export interface DateRange {
  startDate: Date
  endDate: Date
}

export interface TimeSlot {
  id: string
  time: Date
  isCompleted: boolean
  isMissed: boolean
}
