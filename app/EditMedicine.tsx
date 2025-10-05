import Colors from '@/constant/Colors'
import { updateMedicine } from '@/service/Storage'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

export default function EditMedicine() {
  const router = useRouter()
  const { medicine } = useLocalSearchParams()
  
  const [medicineName, setMedicineName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [duration, setDuration] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [hasStartDate, setHasStartDate] = useState(false)
  const [hasEndDate, setHasEndDate] = useState(false)
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [hasSelectedTime, setHasSelectedTime] = useState(false)
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null)

  useEffect(() => {
    if (medicine) {
      try {
        const medicineData = JSON.parse(decodeURIComponent(medicine as string))
        setMedicineName(medicineData.medicineName || '')
        setDosage(medicineData.dosage || '')
        setFrequency(medicineData.frequency || '')
        setDuration(medicineData.duration || '')
        setNotes(medicineData.notes || '')
        setEditingMedicineId(medicineData.id)
        
        // Set dates
        if (medicineData.startDate) {
          setStartDate(new Date(medicineData.startDate))
          setHasStartDate(true)
        }
        if (medicineData.endDate) {
          setEndDate(new Date(medicineData.endDate))
          setHasEndDate(true)
        }
        
        // Set time
        if (medicineData.time) {
          // Parse time string (e.g., "9:00 PM") to Date object
          const timeParts = medicineData.time.split(':')
          const hour = parseInt(timeParts[0])
          const minuteParts = timeParts[1].split(' ')
          const minute = parseInt(minuteParts[0])
          const ampm = minuteParts[1]
          
          let hour24 = hour
          if (ampm === 'PM' && hour !== 12) hour24 += 12
          if (ampm === 'AM' && hour === 12) hour24 = 0
          
          const timeDate = new Date()
          timeDate.setHours(hour24, minute, 0, 0)
          setSelectedTime(timeDate)
          setHasSelectedTime(true)
        }
      } catch (error) {
        console.log('Error parsing medicine data:', error)
        Alert.alert('Error', 'Failed to load medicine data')
        router.back()
      }
    }
  }, [medicine])

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false)
    if (selectedDate) {
      setStartDate(selectedDate)
      setHasStartDate(true)
      
      // Auto-calculate end date if duration is provided
      if (duration.trim()) {
        calculateEndDate(selectedDate, duration.trim())
      }
    }
  }

  const calculateEndDate = (startDate: Date, durationText: string) => {
    try {
      // Extract number from duration text (e.g., "4 days" -> 4)
      const durationMatch = durationText.match(/(\d+)/)
      if (durationMatch) {
        const days = parseInt(durationMatch[1])
        const calculatedEndDate = new Date(startDate)
        calculatedEndDate.setDate(startDate.getDate() + days)
        
        setEndDate(calculatedEndDate)
        setHasEndDate(true)
      }
    } catch (error) {
      console.log('Error calculating end date:', error)
    }
  }

  const handleDurationChange = (text: string) => {
    setDuration(text)
    
    // Auto-calculate end date if start date is already selected
    if (hasStartDate && text.trim()) {
      calculateEndDate(startDate, text.trim())
    }
  }

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false)
    if (selectedDate) {
      setEndDate(selectedDate)
      setHasEndDate(true)
    }
  }

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false)
    if (selectedTime) {
      setSelectedTime(selectedTime)
      setHasSelectedTime(true)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleUpdateMedicine = async () => {
    if (!medicineName.trim() || !dosage.trim() || !frequency.trim()) {
      Alert.alert('Error', 'Please fill in medicine name, dosage, and frequency')
      return
    }

    setIsLoading(true)
    
    // Check if there are actual changes
    const originalMedicine = JSON.parse(decodeURIComponent(medicine as string))
    const hasChanges = 
      originalMedicine.medicineName !== medicineName.trim() ||
      originalMedicine.dosage !== dosage.trim() ||
      originalMedicine.frequency !== frequency.trim() ||
      originalMedicine.duration !== duration.trim() ||
      originalMedicine.notes !== notes.trim() ||
      (originalMedicine.startDate || '') !== (hasStartDate ? formatDate(startDate) : '') ||
      (originalMedicine.endDate || '') !== (hasEndDate ? formatDate(endDate) : '') ||
      (originalMedicine.time || '') !== (hasSelectedTime ? formatTime(selectedTime) : '')
    
    const updatedMedicine = {
      id: editingMedicineId,
      medicineName: medicineName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
      startDate: hasStartDate ? formatDate(startDate) : '',
      endDate: hasEndDate ? formatDate(endDate) : '',
      time: hasSelectedTime ? formatTime(selectedTime) : '',
      notes: notes.trim(),
      ...(hasChanges && {
        lastEditedDate: new Date().toISOString().split('T')[0],
        lastEditedChanges: ['Updated medicine details']
      })
    }

    try {
      const success = await updateMedicine(editingMedicineId!, updatedMedicine)
      
      if (success) {
        Alert.alert('Success', 'Medicine updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              router.back()
            }
          }
        ])
      } else {
        Alert.alert('Error', 'Failed to update medicine. Please try again.')
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating medicine.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name={"arrow-back" as any} size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Edit Medicine</Text>
              <Text style={styles.subtitle}>Update your medication details</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name={"create" as any} size={40} color="white" />
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Medicine Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name={"medkit" as any} size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Paracetamol"
                  value={medicineName}
                  onChangeText={setMedicineName}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dosage *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name={"fitness" as any} size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 500mg"
                  value={dosage}
                  onChangeText={setDosage}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Frequency *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name={"time" as any} size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 2 times daily"
                  value={frequency}
                  onChangeText={setFrequency}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Duration</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name={"calendar" as any} size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 7 days"
                  value={duration}
                  onChangeText={handleDurationChange}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowStartDatePicker(true)}
              >
                <Ionicons name={"calendar-outline" as any} size={20} color="#666" />
                <Text style={[styles.dateText, !hasStartDate && styles.placeholderText]}>
                  {hasStartDate ? startDate.toLocaleDateString() : 'Select start date'}
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowEndDatePicker(true)}
              >
                <Ionicons name={"calendar-outline" as any} size={20} color="#666" />
                <Text style={[styles.dateText, !hasEndDate && styles.placeholderText]}>
                  {hasEndDate ? endDate.toLocaleDateString() : 'Select end date'}
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
              {hasEndDate && hasStartDate && duration.trim() && (
                <Text style={styles.autoCalculatedText}>
                  ✨ Auto-calculated from duration
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reminder Time</Text>
              <TouchableOpacity 
                style={styles.timeButton} 
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name={"time-outline" as any} size={20} color="#666" />
                <Text style={[styles.timeText, !hasSelectedTime && styles.placeholderText]}>
                  {hasSelectedTime ? formatTime(selectedTime) : 'Select reminder time'}
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
              {hasSelectedTime && (
                <Text style={styles.helpText}>
                  💡 You'll be reminded at this time daily
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes</Text>
              <View style={styles.notesWrapper}>
                <Ionicons name={"document-text" as any} size={20} color="#666" style={styles.notesIcon} />
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Additional notes about the medicine"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.updateButton, isLoading && styles.disabledButton]} 
            onPress={handleUpdateMedicine}
            disabled={isLoading}
          >
            <Ionicons name={"checkmark" as any} size={20} color="white" />
            <Text style={styles.updateButtonText}>
              {isLoading ? 'Updating...' : 'Update Medicine'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date and Time Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  titleContainer: {
    flex: 1,
  },
  headerIcon: {
    marginLeft: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  form: {
    padding: 20,
    paddingTop: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  notesWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notesIcon: {
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  placeholderText: {
    color: '#95a5a6',
  },
  autoCalculatedText: {
    fontSize: 12,
    color: '#27ae60',
    marginTop: 8,
    fontStyle: 'italic',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  helpText: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 8,
    fontStyle: 'italic',
  },
  updateButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
})
