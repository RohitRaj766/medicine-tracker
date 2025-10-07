import { FREQUENCY_COUNT_MAP } from '@/constants/medicineData'

// Date formatting utilities
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0] // YYYY-MM-DD format
}

export const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Time formatting utilities
export const formatTime = (date: Date | undefined): string => {
  if (!date) return ''
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

export const parseTimeString = (timeString: string): Date | null => {
  try {
    // Handle formats like "9:00 AM", "21:00", etc.
    const timeParts = timeString.split(':')
    if (timeParts.length !== 2) return null

    const hour = parseInt(timeParts[0])
    const minuteParts = timeParts[1].split(' ')
    const minute = parseInt(minuteParts[0])
    const ampm = minuteParts[1]?.toUpperCase()

    if (isNaN(hour) || isNaN(minute)) return null

    let hour24 = hour
    if (ampm === 'PM' && hour !== 12) hour24 += 12
    if (ampm === 'AM' && hour === 12) hour24 = 0

    const timeDate = new Date()
    timeDate.setHours(hour24, minute, 0, 0)
    return timeDate
  } catch (error) {
    console.error('Error parsing time string:', error)
    return null
  }
}

// Date calculation utilities
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7)
}

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export const calculateEndDate = (startDate: Date, duration: string): Date => {
  try {
    // Extract number and unit from duration (e.g., "7 days" -> 7, "days")
    const match = duration.match(/(\d+)\s*(days?|weeks?|months?|years?)?/i)
    if (!match) return startDate

    const amount = parseInt(match[1])
    const unit = match[2]?.toLowerCase() || 'days'

    switch (unit) {
      case 'day':
      case 'days':
        // For days, subtract 1 to make it inclusive of start date
        // If user says "3 days" starting from day 6, it should be 6,7,8 (end on day 8)
        return addDays(startDate, amount - 1)
      case 'week':
      case 'weeks':
        // For weeks, subtract 1 to make it inclusive of start date
        // If user says "2 weeks" starting from week 1, it should be week 1,2 (end on week 2)
        return addWeeks(startDate, amount - 1)
      case 'month':
      case 'months':
        // For months, subtract 1 to make it inclusive of start date
        // If user says "3 months" starting from January, it should be Jan,Feb,Mar (end on March)
        return addMonths(startDate, amount - 1)
      case 'year':
      case 'years':
        // For years, subtract 1 to make it inclusive of start date
        // If user says "2 years" starting from 2024, it should be 2024,2025 (end on 2025)
        return addMonths(startDate, (amount - 1) * 12)
      default:
        return addDays(startDate, amount - 1)
    }
  } catch (error) {
    console.error('Error calculating end date:', error)
    return startDate
  }
}

// Date comparison utilities
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDate(date1) === formatDate(date2)
}

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date())
}

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate
}

// Frequency utilities
export const extractFrequencyCount = (frequency: string): number => {
  // Handle numeric patterns like "2 times daily", "3 times daily"
  const numericMatch = frequency.match(/(\d+)\s*times?\s*daily/i)
  if (numericMatch) {
    return parseInt(numericMatch[1])
  }
  
  // Handle text patterns using the mapping
  const lowerFreq = frequency.toLowerCase().trim()
  return FREQUENCY_COUNT_MAP[lowerFreq] || 1
}

export const getTimesString = (times: (Date | undefined)[]): string => {
  return times
    .filter(time => time !== undefined)
    .map(time => formatTime(time!))
    .join(', ')
}

// Time slot utilities
export const createTimeSlots = (frequency: string): Date[] => {
  const count = extractFrequencyCount(frequency)
  return new Array(count).fill(undefined)
}

export const parseMultipleTimes = (timeString: string): Date[] => {
  if (!timeString.includes(',')) {
    const singleTime = parseTimeString(timeString)
    return singleTime ? [singleTime] : []
  }

  return timeString
    .split(', ')
    .map(timeStr => parseTimeString(timeStr))
    .filter(time => time !== null) as Date[]
}

// Date range utilities
export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const timeDiff = endDate.getTime() - startDate.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

// Calendar utilities
export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export const getStartOfWeek = (date: Date): Date => {
  const day = date.getDay()
  const diff = date.getDate() - day
  return new Date(date.setDate(diff))
}

export const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(new Date(date))
  return addDays(startOfWeek, 6)
}

// Time zone utilities
export const getCurrentTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const formatDateWithTimezone = (date: Date, timezone?: string): string => {
  return date.toLocaleDateString('en-US', {
    timeZone: timezone || getCurrentTimezone(),
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
