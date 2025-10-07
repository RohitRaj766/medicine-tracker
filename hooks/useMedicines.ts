import { useState, useEffect, useCallback } from 'react'
import { Medicine, UseMedicinesReturn } from '@/types'
import { getLocalStorage, setLocalStorage } from '@/service/Storage'
import { filterMedicinesByDate, calculateMedicineStats } from '@/utils/medicineUtils'

const MEDICINES_STORAGE_KEY = 'medicines'

export function useMedicines(): UseMedicinesReturn {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMedicines = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('useMedicines - starting to load medicines...')
      
      const storedMedicines = await getLocalStorage(MEDICINES_STORAGE_KEY)
      console.log('useMedicines - loaded medicines:', storedMedicines?.length || 0)
      if (storedMedicines) {
        setMedicines(storedMedicines)
        console.log('useMedicines - medicines set successfully')
      } else {
        setMedicines([])
        console.log('useMedicines - no medicines found, set empty array')
      }
    } catch (err) {
      setError('Failed to load medicines')
      console.error('Error loading medicines:', err)
    } finally {
      setIsLoading(false)
      console.log('useMedicines - loading completed, isLoading set to false')
    }
  }, [])

  const saveMedicines = useCallback(async (newMedicines: Medicine[]) => {
    try {
      await setLocalStorage(MEDICINES_STORAGE_KEY, newMedicines)
      setMedicines(newMedicines)
    } catch (err) {
      setError('Failed to save medicines')
      console.error('Error saving medicines:', err)
      throw err
    }
  }, [])

  const getMedicinesForDate = useCallback((date: Date) => {
    return filterMedicinesByDate(medicines, date)
  }, [medicines])

  const markAsTaken = useCallback(async (medicineId: string, date: Date) => {
    try {
      const dateString = date.toISOString().split('T')[0]
      const updatedMedicines = medicines.map(medicine => {
        if (medicine.id === medicineId) {
          const consumedDates = medicine.consumedDates || []
          const missedDates = medicine.missedDates || []
          
          // Remove from missed dates if present
          const updatedMissedDates = missedDates.filter(d => d !== dateString)
          
          // Add to consumed dates if not already present
          const updatedConsumedDates = consumedDates.includes(dateString)
            ? consumedDates
            : [...consumedDates, dateString]
          
          return {
            ...medicine,
            consumedDates: updatedConsumedDates,
            missedDates: updatedMissedDates
          }
        }
        return medicine
      })
      
      await saveMedicines(updatedMedicines)
      return true
    } catch (err) {
      console.error('Error marking medicine as taken:', err)
      return false
    }
  }, [medicines, saveMedicines])

  const markAsMissed = useCallback(async (medicineId: string, date: Date) => {
    try {
      const dateString = date.toISOString().split('T')[0]
      const updatedMedicines = medicines.map(medicine => {
        if (medicine.id === medicineId) {
          const consumedDates = medicine.consumedDates || []
          const missedDates = medicine.missedDates || []
          
          // Remove from consumed dates if present
          const updatedConsumedDates = consumedDates.filter(d => d !== dateString)
          
          // Add to missed dates if not already present
          const updatedMissedDates = missedDates.includes(dateString)
            ? missedDates
            : [...missedDates, dateString]
          
          return {
            ...medicine,
            consumedDates: updatedConsumedDates,
            missedDates: updatedMissedDates
          }
        }
        return medicine
      })
      
      await saveMedicines(updatedMedicines)
      return true
    } catch (err) {
      console.error('Error marking medicine as missed:', err)
      return false
    }
  }, [medicines, saveMedicines])

  const deleteMedicine = useCallback(async (medicineId: string) => {
    try {
      const updatedMedicines = medicines.filter(medicine => medicine.id !== medicineId)
      await saveMedicines(updatedMedicines)
      return true
    } catch (err) {
      console.error('Error deleting medicine:', err)
      return false
    }
  }, [medicines, saveMedicines])

  const updateMedicine = useCallback(async (updatedMedicine: Medicine) => {
    try {
      const updatedMedicines = medicines.map(medicine =>
        medicine.id === updatedMedicine.id ? updatedMedicine : medicine
      )
      await saveMedicines(updatedMedicines)
      return true
    } catch (err) {
      console.error('Error updating medicine:', err)
      return false
    }
  }, [medicines, saveMedicines])

  const addMedicine = useCallback(async (newMedicine: Medicine) => {
    try {
      const updatedMedicines = [...medicines, newMedicine]
      await saveMedicines(updatedMedicines)
      return true
    } catch (err) {
      console.error('Error adding medicine:', err)
      return false
    }
  }, [medicines, saveMedicines])

  // Load medicines on mount
  useEffect(() => {
    loadMedicines()
  }, [loadMedicines])

  return {
    medicines,
    isLoading,
    error,
    loadMedicines,
    getMedicinesForDate,
    markAsTaken,
    markAsMissed,
    deleteMedicine,
    updateMedicine,
    addMedicine
  }
}

// Hook for medicine statistics
export function useMedicineStats() {
  const { medicines } = useMedicines()
  
  const stats = calculateMedicineStats(medicines)
  
  return {
    ...stats,
    isLoading: false
  }
}

// Hook for filtered medicines
export function useFilteredMedicines() {
  const { medicines, getMedicinesForDate } = useMedicines()
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const updateFilteredMedicines = useCallback(() => {
    const filtered = getMedicinesForDate(selectedDate)
    console.log('useFilteredMedicines - filtering for date:', selectedDate)
    console.log('useFilteredMedicines - filtered count:', filtered.length)
    setFilteredMedicines(filtered)
  }, [getMedicinesForDate, selectedDate])

  useEffect(() => {
    updateFilteredMedicines()
  }, [updateFilteredMedicines])

  const setDate = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  return {
    filteredMedicines,
    selectedDate,
    setDate,
    refresh: updateFilteredMedicines
  }
}
