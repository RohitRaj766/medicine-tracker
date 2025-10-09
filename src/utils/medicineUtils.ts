import { Medicine, MedicineStats, MedicineStatus } from '@/types'
import { 
  formatDate, 
  isSameDay, 
  isDateInRange, 
  parseMultipleTimes,
  getTimesString 
} from './dateUtils'

// Date utility functions
export const getMonthDates = (year: number, month: number): Date[] => {
  const dates = []
  const lastDay = new Date(year, month + 1, 0)
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    dates.push(new Date(year, month, day))
  }
  
  return dates
}

export const hasMedicinesOnDate = (medicines: Medicine[], date: Date): boolean => {
  return medicines.some(med => {
    if (med.startDate && med.endDate) {
      const startDate = new Date(med.startDate)
      const endDate = new Date(med.endDate)
      return date >= startDate && date <= endDate
    }
    return false
  })
}

// Medicine filtering utilities
export const filterMedicinesByDate = (medicines: Medicine[], date: Date): Medicine[] => {
  const dateString = formatDate(date)
  console.log('filterMedicinesByDate - filtering for date:', dateString)
  console.log('filterMedicinesByDate - total medicines:', medicines.length)
  
  const filtered = medicines.filter(medicine => {
    console.log('filterMedicinesByDate - medicine:', medicine.medicineName, 'start:', medicine.startDate, 'end:', medicine.endDate)
    // Check if medicine is active on this date
    if (medicine.startDate && medicine.startDate > dateString) return false
    if (medicine.endDate && medicine.endDate < dateString) return false
    
    return true
  })
  
  console.log('filterMedicinesByDate - filtered count:', filtered.length)
  return filtered
}

export const filterMedicinesByStatus = (medicines: Medicine[], status: MedicineStatus, date: Date): Medicine[] => {
  const dateString = formatDate(date)
  
  return medicines.filter(medicine => {
    switch (status) {
      case 'taken':
        return medicine.consumedDates?.includes(dateString) || false
      case 'missed':
        return medicine.missedDates?.includes(dateString) || false
      case 'pending':
        return !medicine.consumedDates?.includes(dateString) && 
               !medicine.missedDates?.includes(dateString)
      case 'edited':
        return medicine.lastEditedDate === dateString
      default:
        return true
    }
  })
}

export const filterMedicinesByType = (medicines: Medicine[], medicineType: string): Medicine[] => {
  if (!medicineType) return medicines
  return medicines.filter(medicine => 
    medicine.medicineType?.toLowerCase() === medicineType.toLowerCase()
  )
}

export const searchMedicines = (medicines: Medicine[], searchTerm: string): Medicine[] => {
  if (!searchTerm.trim()) return medicines
  
  const term = searchTerm.toLowerCase().trim()
  return medicines.filter(medicine =>
    medicine.medicineName.toLowerCase().includes(term) ||
    medicine.dosage.toLowerCase().includes(term) ||
    medicine.medicineType?.toLowerCase().includes(term) ||
    medicine.frequency.toLowerCase().includes(term)
  )
}

// Medicine status utilities
export const getMedicineStatus = (medicine: Medicine, date: Date): MedicineStatus => {
  const dateString = formatDate(date)
  
  if (medicine.consumedDates?.includes(dateString)) return 'taken'
  if (medicine.missedDates?.includes(dateString)) return 'missed'
  if (medicine.lastEditedDate === dateString) return 'edited'
  
  return 'pending'
}

export const isMedicineActive = (medicine: Medicine, date: Date): boolean => {
  const dateString = formatDate(date)
  
  if (medicine.startDate && medicine.startDate > dateString) return false
  if (medicine.endDate && medicine.endDate < dateString) return false
  
  return true
}

export const isMedicineDue = (medicine: Medicine, date: Date): boolean => {
  if (!isMedicineActive(medicine, date)) return false
  
  // Check if medicine has a time and if it's past that time today
  if (medicine.time) {
    const times = parseMultipleTimes(medicine.time)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    return times.some(time => {
      const medicineTime = new Date(today.getTime() + time.getTime())
      return now >= medicineTime && getMedicineStatus(medicine, date) === 'pending'
    })
  }
  
  return getMedicineStatus(medicine, date) === 'pending'
}

// Medicine statistics utilities
export const calculateMedicineStats = (medicines: Medicine[]): MedicineStats => {
  const totalMedicines = medicines.length
  const totalTaken = medicines.reduce((sum, med) => sum + (med.consumedDates?.length || 0), 0)
  const totalMissed = medicines.reduce((sum, med) => sum + (med.missedDates?.length || 0), 0)
  
  const totalEntries = totalTaken + totalMissed
  const complianceRate = totalEntries > 0 ? (totalTaken / totalEntries) * 100 : 0
  
  // Calculate streaks
  const { currentStreak, longestStreak, totalDaysTracked } = calculateStreaks(medicines)
  
  return {
    totalMedicines,
    totalTaken,
    totalMissed,
    complianceRate: Math.round(complianceRate * 100) / 100,
    currentStreak,
    longestStreak,
    totalDaysTracked
  }
}

export const calculateStreaks = (medicines: Medicine[]) => {
  const allDates = new Set<string>()
  
  medicines.forEach(medicine => {
    medicine.consumedDates?.forEach(date => allDates.add(date))
  })
  
  const sortedDates = Array.from(allDates).sort().reverse()
  
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  let lastDate: Date | null = null
  
  sortedDates.forEach(dateStr => {
    const currentDate = new Date(dateStr)
    
    if (lastDate === null) {
      tempStreak = 1
      currentStreak = isSameDay(currentDate, new Date()) ? 1 : 0
    } else {
      const daysDiff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        tempStreak++
        if (isSameDay(currentDate, new Date())) {
          currentStreak = tempStreak
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    
    lastDate = currentDate
  })
  
  longestStreak = Math.max(longestStreak, tempStreak)
  
  return {
    currentStreak,
    longestStreak,
    totalDaysTracked: allDates.size
  }
}

// Medicine sorting utilities
export const sortMedicinesByName = (medicines: Medicine[]): Medicine[] => {
  return [...medicines].sort((a, b) => 
    a.medicineName.localeCompare(b.medicineName)
  )
}

export const sortMedicinesByTime = (medicines: Medicine[]): Medicine[] => {
  return [...medicines].sort((a, b) => {
    if (!a.time && !b.time) return 0
    if (!a.time) return 1
    if (!b.time) return -1
    
    const aTimes = parseMultipleTimes(a.time)
    const bTimes = parseMultipleTimes(b.time)
    
    if (aTimes.length === 0 && bTimes.length === 0) return 0
    if (aTimes.length === 0) return 1
    if (bTimes.length === 0) return -1
    
    return aTimes[0].getTime() - bTimes[0].getTime()
  })
}

export const sortMedicinesByCreatedDate = (medicines: Medicine[]): Medicine[] => {
  return [...medicines].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// Medicine validation utilities
export const validateMedicineData = (medicine: Partial<Medicine>): string[] => {
  const errors: string[] = []
  
  if (!medicine.medicineName?.trim()) {
    errors.push('Medicine name is required')
  }
  
  if (!medicine.dosage?.trim()) {
    errors.push('Dosage is required')
  }
  
  if (!medicine.frequency?.trim()) {
    errors.push('Frequency is required')
  }
  
  if (!medicine.startDate) {
    errors.push('Start date is required')
  }
  
  if (!medicine.endDate) {
    errors.push('End date is required')
  }
  
  if (medicine.startDate && medicine.endDate && medicine.startDate > medicine.endDate) {
    errors.push('End date must be after start date')
  }
  
  return errors
}

// Medicine grouping utilities
export const groupMedicinesByType = (medicines: Medicine[]): Record<string, Medicine[]> => {
  return medicines.reduce((groups, medicine) => {
    const type = medicine.medicineType || 'Other'
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(medicine)
    return groups
  }, {} as Record<string, Medicine[]>)
}

export const groupMedicinesByFrequency = (medicines: Medicine[]): Record<string, Medicine[]> => {
  return medicines.reduce((groups, medicine) => {
    const frequency = medicine.frequency
    if (!groups[frequency]) {
      groups[frequency] = []
    }
    groups[frequency].push(medicine)
    return groups
  }, {} as Record<string, Medicine[]>)
}

// Medicine export utilities
export const exportMedicinesToCSV = (medicines: Medicine[]): string => {
  const headers = [
    'Medicine Name',
    'Dosage',
    'Medicine Type',
    'Frequency',
    'Duration',
    'Start Date',
    'End Date',
    'Time',
    'Notes',
    'Created At'
  ]
  
  const rows = medicines.map(medicine => [
    medicine.medicineName,
    medicine.dosage,
    medicine.medicineType || '',
    medicine.frequency,
    medicine.duration || '',
    medicine.startDate || '',
    medicine.endDate || '',
    medicine.time || '',
    medicine.notes || '',
    medicine.createdAt
  ])
  
  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')
}

// Medicine import utilities
export const parseCSVToMedicines = (csvContent: string): Partial<Medicine>[] => {
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''))
  const medicines: Partial<Medicine>[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, ''))
    const medicine: Partial<Medicine> = {}
    
    headers.forEach((header, index) => {
      const value = values[index]
      switch (header.toLowerCase()) {
        case 'medicine name':
          medicine.medicineName = value
          break
        case 'dosage':
          medicine.dosage = value
          break
        case 'medicine type':
          medicine.medicineType = value
          break
        case 'frequency':
          medicine.frequency = value
          break
        case 'duration':
          medicine.duration = value
          break
        case 'start date':
          medicine.startDate = value
          break
        case 'end date':
          medicine.endDate = value
          break
        case 'time':
          medicine.time = value
          break
        case 'notes':
          medicine.notes = value
          break
      }
    })
    
    if (medicine.medicineName) {
      medicines.push(medicine)
    }
  }
  
  return medicines
}
