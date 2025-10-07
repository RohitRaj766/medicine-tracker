import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Animated,
  Alert
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

// Modular imports
import { MedicineCard } from '@/components'
import { useMedicines, useFilteredMedicines, useMedicineStats } from '@/hooks'
import { theme, colors, spacing, shadows } from '@/styles/theme'
import { Medicine } from '@/types'
import { formatDateDisplay, isToday as checkIsToday } from '@/utils/dateUtils'
import { getMonthDates, hasMedicinesOnDate } from '@/utils/medicineUtils'

const { width: screenWidth } = Dimensions.get('window')

export default function HomeScreen() {
  const router = useRouter()
  const { medicines, isLoading, loadMedicines, error, addMedicine } = useMedicines()
  const { filteredMedicines, selectedDate, setDate } = useFilteredMedicines()
  const stats = useMedicineStats()
  
  // Debug logging
  console.log('HomeScreen - medicines:', medicines.length)
  console.log('HomeScreen - filteredMedicines:', filteredMedicines.length)
  console.log('HomeScreen - selectedDate:', selectedDate)
  console.log('HomeScreen - isLoading:', isLoading)
  console.log('HomeScreen - error:', error)
  
  // Add sample data for testing when no medicines exist
  useEffect(() => {
    const addSampleData = async () => {
      if (medicines.length === 0 && !isLoading && !error) {
        console.log('No medicines found, adding sample data for testing...')
        
        const sampleMedicine = {
          id: 'sample-1',
          medicineName: 'Paracetamol',
          dosage: '500mg',
          medicineType: 'Pain Relief',
          frequency: 'Twice daily',
          duration: '7',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '9:00 AM, 9:00 PM',
          notes: 'Take with food',
          createdAt: new Date().toISOString(),
          consumedDates: [],
          missedDates: []
        }
        
        try {
          await addMedicine(sampleMedicine)
          console.log('Sample medicine added successfully')
        } catch (err) {
          console.log('Failed to add sample medicine:', err)
        }
      }
    }
    
    addSampleData()
  }, [medicines, isLoading, error, addMedicine])
  
  // State management
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { getLocalStorage } = await import('@/service/Storage')
        const userData = await getLocalStorage('userDetails')
        setUser(userData)
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }
    loadUser()
  }, [])

  // Load medicines on mount
  useEffect(() => {
    loadMedicines()
  }, [loadMedicines])

  // Animate on load
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true)
    await loadMedicines()
    setRefreshing(false)
  }

  // Date utilities
  const monthDates = getMonthDates(currentYear, currentMonth)

  const isSelectedDate = (date: Date) => {
    const date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const date2 = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    return date1.getTime() === date2.getTime()
  }

  const isToday = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return checkDate.getTime() === today.getTime()
  }


  const handleDateSelect = (date: Date) => {
    setDate(date)
  }

  const handleMonthYearChange = (month: number, year: number) => {
    setCurrentMonth(month)
    setCurrentYear(year)
    setShowMonthYearPicker(false)
    
    const newMonthFirstDay = new Date(year, month, 1)
    if (selectedDate.getMonth() !== month || selectedDate.getFullYear() !== year) {
      setDate(newMonthFirstDay)
    }
  }

  const goToToday = () => {
    const now = new Date()
    // Create a date with only date components (no time)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setDate(today)
  }

  const getCurrentMonthYear = () => {
    return new Date(currentYear, currentMonth).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Get today's specific stats
  const getTodaysStats = () => {
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    
    const takenToday = medicines.filter(med => 
      med.consumedDates?.includes(todayString)
    ).length
    
    const missedToday = medicines.filter(med => 
      med.missedDates?.includes(todayString)
    ).length
    
    const pendingToday = filteredMedicines.length - takenToday - missedToday
    
    return { takenToday, missedToday, pendingToday }
  }

  const todaysStats = getTodaysStats()
  const monthYearOptions = getMonthYearOptions()

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name={"medical" as any} size={48} color={colors.primary} />
          <Text style={styles.loadingText}>Loading your medicines...</Text>
          <Text style={styles.loadingSubtext}>Please wait while we fetch your data</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name={"warning" as any} size={48} color={colors.error} />
          <Text style={styles.loadingText}>Error Loading Medicines</Text>
          <Text style={styles.loadingSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMedicines}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
            <Text style={styles.dateDisplay}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>

          {/* Today's Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.takenCard]}>
              <Ionicons name={"checkmark-circle" as any} size={24} color={colors.success} />
              <Text style={styles.statNumber}>{todaysStats.takenToday}</Text>
              <Text style={styles.statLabel}>Taken</Text>
            </View>
            <View style={[styles.statCard, styles.missedCard]}>
              <Ionicons name={"close-circle" as any} size={24} color={colors.error} />
              <Text style={styles.statNumber}>{todaysStats.missedToday}</Text>
              <Text style={styles.statLabel}>Missed</Text>
            </View>
            <View style={[styles.statCard, styles.pendingCard]}>
              <Ionicons name={"time" as any} size={24} color={colors.warning} />
              <Text style={styles.statNumber}>{todaysStats.pendingToday}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>Calendar</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
                <Ionicons name={"today" as any} size={16} color={colors.textInverse} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.monthYearButton}
                onPress={() => setShowMonthYearPicker(true)}
              >
                <Text style={styles.monthYearText}>{getCurrentMonthYear()}</Text>
                <Ionicons name={"chevron-down" as any} size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Picker */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datePickerContainer}
          >
            {monthDates.map((date, index) => {
              const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
              const dateDisplay = {
                day: days[date.getDay()],
                date: date.getDate().toString()
              }
              const selected = isSelectedDate(date)
              const isTodayDate = isToday(date)
              const hasMedicines = hasMedicinesOnDate(medicines, date)
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    selected && styles.selectedDateCard,
                    hasMedicines && !selected && styles.hasMedicinesCard,
                    isTodayDate && !selected && styles.todayCard
                  ]}
                  onPress={() => handleDateSelect(date)}
                  activeOpacity={0.7}
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
                    <View style={[
                      styles.medicineIndicator,
                      selected && styles.selectedIndicator
                    ]} />
                  )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Medicines List */}
        <View style={styles.medicinesSection}>
          <View style={styles.medicinesHeader}>
            <Text style={styles.medicinesTitle}>
               {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/(tabs)/AddNew')}
            >
              <Ionicons name={"add" as any} size={20} color={colors.textInverse} />
            </TouchableOpacity>
          </View>

          {filteredMedicines.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name={"medical-outline" as any} size={64} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No medicines scheduled</Text>
              <Text style={styles.emptySubtitle}>
                {isToday(selectedDate) 
                  ? "You're all caught up for today!"
                  : "No medicines scheduled for this date"
                }
              </Text>
              <TouchableOpacity 
                style={styles.emptyActionButton}
                onPress={() => router.push('/(tabs)/AddNew')}
              >
                <Ionicons name={"add-circle" as any} size={20} color={colors.textInverse} />
                <Text style={styles.emptyActionText}>Add Medicine</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.medicinesList}>
              {filteredMedicines.map((medicine, index) => (
                <Animated.View
                  key={medicine.id}
                  style={[
                    styles.medicineCardContainer,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 50 + (index * 10)],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <MedicineCard
                    medicine={medicine}
                    selectedDate={selectedDate}
                    onUpdate={loadMedicines}
                  />
                </Animated.View>
              ))}
            </View>
          )}
        </View>
        </Animated.View>
      </ScrollView>

      {/* Month/Year Picker Modal */}
      {showMonthYearPicker && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowMonthYearPicker(false)}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Month & Year</Text>
              <TouchableOpacity onPress={() => setShowMonthYearPicker(false)}>
                <Ionicons name={"close" as any} size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContainer}>
              <ScrollView style={styles.monthsList}>
                {monthYearOptions.months.map((month, index) => (
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
              
              <ScrollView style={styles.yearsList}>
                {monthYearOptions.years.map((year) => (
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
    backgroundColor: colors.background,
    paddingTop: 15, // Safe area for status bar
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: spacing.md,
  },
  retryButtonText: {
    color: colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  headerSection: {
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  dateDisplay: {
    fontSize: theme.typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },

  statsContainer: {
    marginBottom: spacing.lg,
  },
  statsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  takenCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  missedCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  calendarSection: {
    marginBottom: spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  calendarTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: theme.borderRadius.lg,
    marginRight: spacing.md,
    ...shadows.sm,
  },
  todayButtonText: {
    color: colors.textInverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: spacing.xs,
  },
  monthYearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthYearText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: colors.text,
    marginRight: spacing.xs,
  },
  datePickerContainer: {
    paddingHorizontal: spacing.sm,
  },
  dateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 70,
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  selectedDateCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.md,
  },
  hasMedicinesCard: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  todayCard: {
    borderColor: colors.border,
    borderWidth: 1,
  },
  dateDay: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dateNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
  },
  selectedDateText: {
    color: colors.textInverse,
  },
  hasMedicinesText: {
    color: colors.success,
  },
  todayText: {
    color: colors.text,
  },
  todayIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  medicineIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  selectedIndicator: {
    backgroundColor: colors.textInverse,
  },
  medicinesSection: {
    flex: 1,
  },
  medicinesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  medicinesTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: colors.text,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...shadows.sm,
  },
  addButtonText: {
    color: colors.textInverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: spacing.xs,
  },
  medicinesList: {
    paddingBottom: spacing.xl,
  },
  medicineCardContainer: {
    marginBottom: spacing.md,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: spacing.lg,
    ...shadows.md,
  },
  emptyActionText: {
    color: colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '60%',
    ...shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
  },
  pickerContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
  },
  monthsList: {
    flex: 1,
    marginRight: spacing.md,
  },
  yearsList: {
    flex: 1,
    marginLeft: spacing.md,
  },
  pickerItem: {
    padding: spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: spacing.sm,
  },
  selectedPickerItem: {
    backgroundColor: colors.primaryLight,
  },
  pickerItemText: {
    fontSize: theme.typography.fontSize.md,
    color: colors.text,
    textAlign: 'center',
  },
  selectedPickerItemText: {
    color: colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
})