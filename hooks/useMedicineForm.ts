import { useState, useCallback } from 'react'
import { Medicine, MedicineFormData, UseMedicineFormReturn, ValidationError } from '@/types'
import { DEFAULT_MEDICINE_FORM } from '@/constants/medicineData'
import { validateMedicineForm } from '@/utils/validationUtils'
import { calculateEndDate, extractFrequencyCount, getTimesString } from '@/utils/dateUtils'
import { useMedicines } from './useMedicines'

export function useMedicineForm(initialData?: Partial<MedicineFormData>): UseMedicineFormReturn {
  const { addMedicine, updateMedicine } = useMedicines()
  
  const [formData, setFormData] = useState<MedicineFormData>({
    ...DEFAULT_MEDICINE_FORM,
    ...initialData
  })
  
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const updateField = useCallback((field: keyof MedicineFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-calculate end date when duration changes
      if (field === 'duration' && typeof value === 'string') {
        updated.endDate = calculateEndDate(updated.startDate, value)
      }
      
      // Auto-calculate end date when start date changes
      if (field === 'startDate' && value instanceof Date) {
        updated.endDate = calculateEndDate(value, updated.duration)
      }
      
      return updated
    })
    
    // Clear field-specific error when field is updated
    if (errors.length > 0) {
      setErrors(prev => prev.filter(error => error.field !== field))
    }
  }, [errors])

  const validateForm = useCallback(() => {
    const validation = validateMedicineForm(formData)
    setErrors(validation.errors)
    return validation
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_MEDICINE_FORM })
    setErrors([])
  }, [])

  const createMedicineFromForm = useCallback((): Medicine => {
    const frequencyCount = extractFrequencyCount(formData.frequency)
    const timeString = frequencyCount > 1 
      ? getTimesString(formData.selectedTimes || [])
      : formData.selectedTime 
        ? formData.selectedTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
        : ''

    const baseMedicine: Medicine = {
      id: Date.now().toString(),
      medicineName: formData.medicineName,
      dosage: formData.dosage,
      medicineType: formData.medicineType,
      frequency: formData.frequency,
      duration: formData.duration,
      startDate: formData.startDate.toISOString().split('T')[0],
      endDate: formData.endDate.toISOString().split('T')[0],
      time: timeString,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      consumedDates: [],
      missedDates: []
    }

    // If single dose, return single medicine
    if (frequencyCount === 1) {
      return baseMedicine
    }

    // For multiple doses, create parent medicine and individual dose medicines
    const parentId = Date.now().toString()
    const parentMedicine: Medicine = {
      ...baseMedicine,
      id: parentId,
      parentMedicineId: undefined, // This is the parent
      timeSlotIndex: undefined
    }

    return parentMedicine
  }, [formData])

  const createMultiDoseMedicines = useCallback((): Medicine[] => {
    const frequencyCount = extractFrequencyCount(formData.frequency)
    if (frequencyCount <= 1) return []

    const medicines: Medicine[] = []
    const parentId = Date.now().toString()
    const baseTime = new Date()

    for (let i = 0; i < frequencyCount; i++) {
      const selectedTime = formData.selectedTimes?.[i]
      const timeString = selectedTime 
        ? selectedTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
        : ''

      const medicine: Medicine = {
        id: `${parentId}_${i}`,
        medicineName: formData.medicineName,
        dosage: formData.dosage,
        medicineType: formData.medicineType,
        frequency: formData.frequency,
        duration: formData.duration,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0],
        time: timeString,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        consumedDates: [],
        missedDates: [],
        parentMedicineId: parentId,
        timeSlotIndex: i
      }

      medicines.push(medicine)
    }

    return medicines
  }, [formData])

  const saveMedicine = useCallback(async (isEdit: boolean = false, existingMedicineId?: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Validate form
      const validation = validateForm()
      if (!validation.isValid) {
        return false
      }

      const frequencyCount = extractFrequencyCount(formData.frequency)
      
      if (frequencyCount === 1) {
        // Single dose medicine
        const medicine = createMedicineFromForm()
        
        if (isEdit && existingMedicineId) {
          const updatedMedicine = { ...medicine, id: existingMedicineId }
          const success = await updateMedicine(updatedMedicine)
          if (success) {
            resetForm()
          }
          return success
        } else {
          const success = await addMedicine(medicine)
          if (success) {
            resetForm()
          }
          return success
        }
      } else {
        // Multiple dose medicines
        const medicines = createMultiDoseMedicines()
        
        if (isEdit && existingMedicineId) {
          // For editing, we need to handle this differently
          // This would require more complex logic to update all related medicines
          console.warn('Editing multi-dose medicines not fully implemented')
          return false
        } else {
          // Add all medicines
          let allSuccess = true
          for (const medicine of medicines) {
            const success = await addMedicine(medicine)
            if (!success) {
              allSuccess = false
              break
            }
          }
          
          if (allSuccess) {
            resetForm()
          }
          return allSuccess
        }
      }
    } catch (error) {
      console.error('Error saving medicine:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm, createMedicineFromForm, createMultiDoseMedicines, addMedicine, updateMedicine, resetForm])

  return {
    formData,
    errors,
    isLoading,
    updateField,
    validateForm,
    resetForm,
    saveMedicine
  }
}

// Hook for editing existing medicine
export function useEditMedicineForm(medicine: Medicine): UseMedicineFormReturn {
  const [initialFormData] = useState<MedicineFormData>(() => {
    // Parse existing medicine data into form format
    const selectedTimes: Date[] = []
    
    if (medicine.time) {
      if (medicine.time.includes(',')) {
        // Multiple times
        const timeStrings = medicine.time.split(', ')
        timeStrings.forEach(timeStr => {
          const [time, period] = timeStr.split(' ')
          const [hours, minutes] = time.split(':')
          let hour24 = parseInt(hours)
          if (period === 'PM' && hour24 !== 12) hour24 += 12
          if (period === 'AM' && hour24 === 12) hour24 = 0
          
          const timeDate = new Date()
          timeDate.setHours(hour24, parseInt(minutes), 0, 0)
          selectedTimes.push(timeDate)
        })
      } else {
        // Single time
        const [time, period] = medicine.time.split(' ')
        const [hours, minutes] = time.split(':')
        let hour24 = parseInt(hours)
        if (period === 'PM' && hour24 !== 12) hour24 += 12
        if (period === 'AM' && hour24 === 12) hour24 = 0
        
        const timeDate = new Date()
        timeDate.setHours(hour24, parseInt(minutes), 0, 0)
        selectedTimes.push(timeDate)
      }
    }

    return {
      medicineName: medicine.medicineName,
      dosage: medicine.dosage,
      medicineType: medicine.medicineType || '',
      frequency: medicine.frequency,
      duration: medicine.duration || '',
      startDate: medicine.startDate ? new Date(medicine.startDate) : new Date(),
      endDate: medicine.endDate ? new Date(medicine.endDate) : new Date(),
      notes: medicine.notes || '',
      selectedTime: selectedTimes[0],
      selectedTimes: selectedTimes
    }
  })

  const formHook = useMedicineForm(initialFormData)
  
  return formHook
}
