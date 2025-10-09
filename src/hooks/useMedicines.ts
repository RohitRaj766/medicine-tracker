import { useState, useEffect, useCallback } from 'react'
import { Medicine } from '../types/index'
import { getLocalStorage, setLocalStorage } from '../services/Storage'
import { useMedicinesAPI } from './useMedicinesAPI'

export interface UseMedicinesReturn {
  medicines: Medicine[]
  isLoading: boolean
  error: string | null
  loadMedicines: () => Promise<void>
  addMedicine: (medicine: Medicine) => Promise<boolean>
  updateMedicine: (updatedMedicine: Medicine) => Promise<boolean>
  deleteMedicine: (id: string) => Promise<boolean>
  getMedicineById: (id: string) => Medicine | undefined
}

export const useMedicines = (): UseMedicinesReturn => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use the API hook
  const {
    medicines: apiMedicines,
    isLoading: apiLoading,
    error: apiError,
    createMedicine: apiCreateMedicine,
    updateMedicine: apiUpdateMedicine,
    deleteMedicine: apiDeleteMedicine,
    refetch: apiRefetch
  } = useMedicinesAPI()

  // Load medicines from API
  const loadMedicines = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      await apiRefetch()
    } catch (err) {
      setError('Failed to load medicines')
      console.error('Error loading medicines:', err)
    } finally {
      setIsLoading(false)
    }
  }, [apiRefetch])

  // Add medicine
  const addMedicine = useCallback(async (medicine: Medicine): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Convert to API format
      const apiMedicine = {
        medicineName: medicine.medicineName,
        dosage: medicine.dosage,
        medicineType: medicine.medicineType,
        frequency: medicine.frequency,
        duration: medicine.duration,
        startDate: medicine.startDate,
        endDate: medicine.endDate,
        time: medicine.time,
        notes: medicine.notes
      }
      
      await apiCreateMedicine(apiMedicine)
      return true
    } catch (err) {
      setError('Failed to add medicine')
      console.error('Error adding medicine:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [apiCreateMedicine])

  // Update medicine
  const updateMedicine = useCallback(async (updatedMedicine: Medicine): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Convert to API format
      const apiMedicine = {
        id: updatedMedicine.id,
        medicineName: updatedMedicine.medicineName,
        dosage: updatedMedicine.dosage,
        medicineType: updatedMedicine.medicineType,
        frequency: updatedMedicine.frequency,
        duration: updatedMedicine.duration,
        startDate: updatedMedicine.startDate,
        endDate: updatedMedicine.endDate,
        time: updatedMedicine.time,
        notes: updatedMedicine.notes
      }
      
      await apiUpdateMedicine({ id: updatedMedicine.id, data: apiMedicine })
      return true
    } catch (err) {
      setError('Failed to update medicine')
      console.error('Error updating medicine:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [apiUpdateMedicine])

  // Delete medicine
  const deleteMedicine = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      await apiDeleteMedicine(id)
      return true
    } catch (err) {
      setError('Failed to delete medicine')
      console.error('Error deleting medicine:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [apiDeleteMedicine])

  // Get medicine by ID
  const getMedicineById = useCallback((id: string): Medicine | undefined => {
    return medicines.find(medicine => medicine.id === id)
  }, [medicines])

  // Update local state when API state changes
  useEffect(() => {
    if (apiMedicines) {
      setMedicines(apiMedicines)
    }
  }, [apiMedicines])

  // Update loading state
  useEffect(() => {
    setIsLoading(apiLoading)
  }, [apiLoading])

  // Update error state
  useEffect(() => {
    if (apiError) {
      setError(apiError)
    }
  }, [apiError])

  // Load medicines on mount
  useEffect(() => {
    loadMedicines()
  }, [loadMedicines])

  return {
    medicines,
    isLoading,
    error,
    loadMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getMedicineById
  }
}
