import { ValidationResult, ValidationError, MedicineFormData } from '@/types'
import { VALIDATION_RULES, ERROR_MESSAGES } from '@/constants/medicineData'
import { extractFrequencyCount } from './dateUtils'

// Generic validation functions
export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return {
      field: fieldName,
      message: `${fieldName} is required`
    }
  }
  return null
}

export const validateMinLength = (value: string, minLength: number, fieldName: string): ValidationError | null => {
  if (value && value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters long`
    }
  }
  return null
}

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): ValidationError | null => {
  if (value && value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be no more than ${maxLength} characters long`
    }
  }
  return null
}

export const validatePattern = (value: string, pattern: RegExp, fieldName: string, errorMessage: string): ValidationError | null => {
  if (value && !pattern.test(value)) {
    return {
      field: fieldName,
      message: errorMessage
    }
  }
  return null
}

export const validateEmail = (email: string): ValidationError | null => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return validatePattern(email, emailPattern, 'email', ERROR_MESSAGES.INVALID_EMAIL)
}

export const validatePassword = (password: string): ValidationError | null => {
  if (password.length < 6) {
    return {
      field: 'password',
      message: ERROR_MESSAGES.PASSWORD_TOO_SHORT
    }
  }
  return null
}

// Medicine form validation
export const validateMedicineForm = (formData: MedicineFormData): ValidationResult => {
  const errors: ValidationError[] = []

  // Validate medicine name
  const nameError = validateRequired(formData.medicineName, 'Medicine Name')
  if (nameError) errors.push(nameError)
  else {
    const minLengthError = validateMinLength(formData.medicineName, VALIDATION_RULES.medicineName.minLength, 'Medicine Name')
    if (minLengthError) errors.push(minLengthError)
    
    const maxLengthError = validateMaxLength(formData.medicineName, VALIDATION_RULES.medicineName.maxLength, 'Medicine Name')
    if (maxLengthError) errors.push(maxLengthError)
  }

  // Validate dosage
  const dosageError = validateRequired(formData.dosage, 'Dosage')
  if (dosageError) errors.push(dosageError)
  else {
    const maxLengthError = validateMaxLength(formData.dosage, VALIDATION_RULES.dosage.maxLength, 'Dosage')
    if (maxLengthError) errors.push(maxLengthError)
  }

  // Validate medicine type
  const typeError = validateRequired(formData.medicineType, 'Medicine Type')
  if (typeError) errors.push(typeError)

  // Validate frequency
  const frequencyError = validateRequired(formData.frequency, 'Frequency')
  if (frequencyError) errors.push(frequencyError)

  // Validate duration
  const durationError = validateRequired(formData.duration, 'Duration')
  if (durationError) {
    errors.push(durationError)
  } else {
    const patternError = validatePattern(
      formData.duration,
      VALIDATION_RULES.duration.pattern,
      'Duration',
      ERROR_MESSAGES.INVALID_DURATION
    )
    if (patternError) errors.push(patternError)
  }

  // Validate dates
  if (!formData.startDate) {
    errors.push({
      field: 'startDate',
      message: ERROR_MESSAGES.START_DATE_REQUIRED
    })
  }

  if (!formData.endDate) {
    errors.push({
      field: 'endDate',
      message: ERROR_MESSAGES.END_DATE_REQUIRED
    })
  }

  // Validate date relationship
  if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
    errors.push({
      field: 'endDate',
      message: ERROR_MESSAGES.END_DATE_BEFORE_START
    })
  }

  // Validate notes
  if (formData.notes) {
    const maxLengthError = validateMaxLength(formData.notes, VALIDATION_RULES.notes.maxLength, 'Notes')
    if (maxLengthError) errors.push(maxLengthError)
  }

  // Validate time selection for single dose
  if (extractFrequencyCount(formData.frequency) === 1) {
    if (!formData.selectedTime) {
      errors.push({
        field: 'selectedTime',
        message: 'Reminder time is required'
      })
    }
  }

  // Validate multiple times for multi-dose
  if (extractFrequencyCount(formData.frequency) > 1) {
    const requiredTimes = extractFrequencyCount(formData.frequency)
    const selectedTimes = formData.selectedTimes?.filter(time => time !== undefined) || []
    
    if (selectedTimes.length !== requiredTimes) {
      errors.push({
        field: 'selectedTimes',
        message: `Please select all ${requiredTimes} dose times`
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// User form validation
export const validateUserForm = (formData: { email: string; password: string; displayName?: string }): ValidationResult => {
  const errors: ValidationError[] = []

  // Validate email
  const emailError = validateRequired(formData.email, 'Email')
  if (emailError) {
    errors.push(emailError)
  } else {
    const emailFormatError = validateEmail(formData.email)
    if (emailFormatError) errors.push(emailFormatError)
  }

  // Validate password
  const passwordError = validateRequired(formData.password, 'Password')
  if (passwordError) {
    errors.push(passwordError)
  } else {
    const passwordLengthError = validatePassword(formData.password)
    if (passwordLengthError) errors.push(passwordLengthError)
  }

  // Validate display name if provided
  if (formData.displayName) {
    const nameLengthError = validateMaxLength(formData.displayName, 50, 'Display Name')
    if (nameLengthError) errors.push(nameLengthError)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Search validation
export const validateSearchTerm = (searchTerm: string, minLength: number = 2): ValidationResult => {
  const errors: ValidationError[] = []

  if (searchTerm && searchTerm.length < minLength) {
    errors.push({
      field: 'search',
      message: `Please enter at least ${minLength} characters to search`
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Date validation
export const validateDateRange = (startDate: Date, endDate: Date): ValidationResult => {
  const errors: ValidationError[] = []

  if (startDate >= endDate) {
    errors.push({
      field: 'dateRange',
      message: 'End date must be after start date'
    })
  }

  const today = new Date()
  if (endDate < today) {
    errors.push({
      field: 'endDate',
      message: 'End date cannot be in the past'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Utility function to get field-specific error
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find(err => err.field === fieldName)
  return error ? error.message : null
}

// Utility function to check if field has error
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some(err => err.field === fieldName)
}

// Utility function to format validation errors for display
export const formatValidationErrors = (errors: ValidationError[]): string => {
  if (errors.length === 0) return ''
  
  if (errors.length === 1) {
    return errors[0].message
  }
  
  return `Please fix the following issues:\n• ${errors.map(err => err.message).join('\n• ')}`
}

// Utility function to create validation error
export const createValidationError = (field: string, message: string): ValidationError => ({
  field,
  message
})

// Utility function to create validation result
export const createValidationResult = (isValid: boolean, errors: ValidationError[]): ValidationResult => ({
  isValid,
  errors
})
