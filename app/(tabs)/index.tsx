import MedicineCard from '@/components/MedicineCard'
import Colors from '@/constant/Colors'
import { getMedicines } from '@/service/Storage'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface Medicine {
  id: string
  medicineName: string
  dosage: string
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
  medicineType?: string
}

export default function HomeScreen() {
  const router = useRouter()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)

  useEffect(() => {
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    try {
      const savedMedicines = await getMedicines()
      console.log('Loaded medicines from storage:', savedMedicines.length)
      savedMedicines.forEach((med: Medicine, index: number) => {
        console.log(`Loaded Medicine ${index + 1}:`, {
          id: med.id,
          name: med.medicineName,
          frequency: med.frequency,
          time: med.time,
          timeSlotIndex: med.timeSlotIndex,
          parentMedicineId: med.parentMedicineId
        })
      })
      setMedicines(savedMedicines)
    } catch (error) {
      console.log('Error loading medicines:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadMedicines()
    setRefreshing(false)
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getMedicinesForSelectedDate = () => {
    const selectedDateString = getDateString(selectedDate)
    const selectedDateObj = new Date(selectedDate)
    
    const filteredMedicines = medicines.filter(medicine => {
      // Check if medicine has start and end dates
      if (medicine.startDate && medicine.endDate) {
        const startDate = new Date(medicine.startDate)
        const endDate = new Date(medicine.endDate)
        
        // Check if selected date is within the medicine's date range
        return selectedDateObj >= startDate && selectedDateObj <= endDate
      }
      
      // If no date range specified, don't show the medicine
      return false
    })
    
    // Debug logging
    console.log('Total medicines:', medicines.length)
    console.log('Filtered medicines for selected date:', filteredMedicines.length)
    console.log('Selected date:', selectedDateString)
    filteredMedicines.forEach((med: Medicine, index: number) => {
      console.log(`Medicine ${index + 1}:`, {
        id: med.id,
        name: med.medicineName,
        frequency: med.frequency,
        time: med.time,
        timeSlotIndex: med.timeSlotIndex
      })
    })
    
    return filteredMedicines
  }

  const getMonthDates = () => {
    const dates = []
    
    // Get first day of current month
    const firstDay = new Date(currentYear, currentMonth, 1)
    // Get last day of current month
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    
    // Add dates from first day to last day of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day)
      dates.push(date)
    }
    
    return dates
  }

  const formatDateDisplay = (date: Date) => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    return {
      day: days[date.getDay()],
      date: date.getDate().toString()
    }
  }

  const isSelectedDate = (date: Date) => {
    return getDateString(date) === getDateString(selectedDate)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }


  const handleMonthYearChange = (month: number, year: number) => {
    setCurrentMonth(month)
    setCurrentYear(year)
    setShowMonthYearPicker(false)
    
    // Update selected date to first day of new month if current selection is outside
    const newMonthFirstDay = new Date(year, month, 1)
    if (selectedDate.getMonth() !== month || selectedDate.getFullYear() !== year) {
      setSelectedDate(newMonthFirstDay)
    }
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDate(today)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const getMonthYearOptions = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    const years = []
    const currentYearNum = new Date().getFullYear()
    for (let year = currentYearNum - 1; year <= currentYearNum + 2; year++) {
      years.push(year)
    }
    
    return { months, years }
  }

  const selectedDateMedicines = getMedicinesForSelectedDate()
  const monthDates = getMonthDates()
  
  const getCurrentMonthYear = () => {
    return new Date(currentYear, currentMonth).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading medicines...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <View style={styles.calendarTitleContainer}>
          <Text style={styles.calendarTitle}>{getCurrentMonthYear()}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.todayButton}
              onPress={goToToday}
            >
              <Ionicons name={"today" as any} size={16} color="white" />
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.monthYearButton}
              onPress={() => setShowMonthYearPicker(true)}
            >
              <Ionicons name={"chevron-down" as any} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datePickerContainer}
        >
          {monthDates.map((date, index) => {
            const dateDisplay = formatDateDisplay(date)
            const selected = isSelectedDate(date)
            const isTodayDate = isToday(date)
            const hasMedicines = medicines.some(med => {
              if (med.startDate && med.endDate) {
                const startDate = new Date(med.startDate)
                const endDate = new Date(med.endDate)
                return date >= startDate && date <= endDate
              }
              return false
            })
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard, 
                  selected && styles.selectedDateCard,
                  hasMedicines && !selected && styles.hasMedicinesCard,
                  isTodayDate && !selected && styles.todayCard
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[
                  styles.dateDay, 
                  selected && styles.selectedDateText,
                  hasMedicines && !selected && styles.hasMedicinesText,
                  isTodayDate && !selected && styles.todayText
                ]}>
                  {dateDisplay.day}
                </Text>
                <Text style={[
                  styles.dateNumber, 
                  selected && styles.selectedDateText,
                  hasMedicines && !selected && styles.hasMedicinesText,
                  isTodayDate && !selected && styles.todayText
                ]}>
                  {dateDisplay.date}
                </Text>
                {isTodayDate && !selected && (
                  <View style={styles.todayIndicator} />
                )}
                {hasMedicines && (
                  <View style={[styles.medicineIndicator, selected && styles.selectedIndicator]} />
                )}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name={"medical-outline" as any} size={80} color="#bdc3c7" />
            </View>
            <Text style={styles.emptyTitle}>No Medicines Added</Text>
            <Text style={styles.emptySubtitle}>
              Start tracking your medications by adding your first medicine
            </Text>
            <TouchableOpacity 
              style={styles.emptyAddButton}
              onPress={() => router.push('/(tabs)/AddNew')}
            >
              <Ionicons name={"add" as any} size={20} color="white" />
              <Text style={styles.emptyAddButtonText}>Add Your First Medicine</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {selectedDateMedicines.length > 0 ? (
              <View style={styles.medicinesContainer}>
                {selectedDateMedicines.map(medicine => (
                  <MedicineCard 
                    key={medicine.id} 
                    medicine={medicine} 
                    selectedDate={selectedDate}
                    onUpdate={loadMedicines}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.noMedicinesContainer}>
                <Ionicons name={"calendar-outline" as any} size={60} color="#bdc3c7" />
                <Text style={styles.noMedicinesTitle}>No Medicines for This Date</Text>
                <Text style={styles.noMedicinesSubtitle}>
                  No medicines were taken on {selectedDate.toLocaleDateString()}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {medicines.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => router.push('/(tabs)/AddNew')}
        >
          <Ionicons name={"add" as any} size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* Month/Year Picker Modal */}
      {showMonthYearPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Month & Year</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowMonthYearPicker(false)}
              >
                <Ionicons name={"close" as any} size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContent}>
              <ScrollView style={styles.monthsScrollView}>
                {getMonthYearOptions().months.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      currentMonth === index && styles.selectedPickerItem
                    ]}
                    onPress={() => handleMonthYearChange(index, currentYear)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      currentMonth === index && styles.selectedPickerItemText
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <ScrollView style={styles.yearsScrollView}>
                {getMonthYearOptions().years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      currentYear === year && styles.selectedPickerItem
                    ]}
                    onPress={() => handleMonthYearChange(currentMonth, year)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      currentYear === year && styles.selectedPickerItemText
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  calendarHeader: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  calendarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  todayButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  todayButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  monthYearButton: {
    padding: 4,
  },
  datePickerContainer: {
    paddingHorizontal: 10,
  },
  dateCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedDateCard: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  selectedDateText: {
    color: 'white',
  },
  hasMedicinesCard: {
    backgroundColor: '#e8f5e8',
    borderColor: '#27ae60',
  },
  hasMedicinesText: {
    color: '#27ae60',
    fontWeight: '600',
  },
  medicineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27ae60',
    marginTop: 2,
  },
  selectedIndicator: {
    backgroundColor: 'white',
  },
  todayCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
    borderWidth: 2,
  },
  todayText: {
    color: '#856404',
    fontWeight: 'bold',
  },
  todayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffc107',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  emptyAddButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  medicinesContainer: {
    padding: 20,
  },
  noMedicinesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  noMedicinesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  noMedicinesSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pickerModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxHeight: '70%',
    minWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 5,
  },
  pickerContent: {
    flexDirection: 'row',
    gap: 20,
  },
  monthsScrollView: {
    flex: 1,
    maxHeight: 300,
  },
  yearsScrollView: {
    flex: 1,
    maxHeight: 300,
  },
  pickerItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 2,
    backgroundColor: '#f8f9fa',
  },
  selectedPickerItem: {
    backgroundColor: Colors.PRIMARY,
  },
  pickerItemText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  selectedPickerItemText: {
    color: 'white',
    fontWeight: '600',
  },
})