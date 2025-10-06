import Colors from '@/constant/Colors'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatTime } from '@/utils/dateUtils'
import { extractFrequencyCount, getTimesString } from '@/utils/dateUtils'

interface MultiTimeSelectorProps {
  label: string
  frequency: string
  selectedTimes: (Date | undefined)[]
  onTimesChange: (times: (Date | undefined)[]) => void
  required?: boolean
  error?: string
  disabled?: boolean
}

export default function MultiTimeSelector({
  label,
  frequency,
  selectedTimes,
  onTimesChange,
  required = false,
  error,
  disabled = false
}: MultiTimeSelectorProps) {
  const [showDoseSelector, setShowDoseSelector] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [currentDoseIndex, setCurrentDoseIndex] = useState(0)

  const frequencyCount = extractFrequencyCount(frequency)
  const selectedCount = selectedTimes.filter(time => time !== undefined).length

  const handleDoseSelect = (doseIndex: number) => {
    setCurrentDoseIndex(doseIndex)
    setShowDoseSelector(false)
    setTimeout(() => setShowTimePicker(true), 100)
  }

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      const newTimes = [...selectedTimes]
      newTimes[currentDoseIndex] = selectedTime
      onTimesChange(newTimes)
      
      // Check if all doses have times set
      if (newTimes.every(time => time !== undefined)) {
        setShowTimePicker(false)
        Alert.alert('Success', `All ${frequencyCount} doses have been scheduled!`)
      } else {
        setShowTimePicker(false)
        // Show dose selector for next dose
        setTimeout(() => setShowDoseSelector(true), 300)
      }
    } else {
      setShowTimePicker(false)
    }
  }

  const handlePress = () => {
    if (!disabled) {
      if (frequencyCount > 1) {
        setShowDoseSelector(true)
      } else {
        setShowTimePicker(true)
      }
    }
  }

  const getDisplayText = () => {
    if (frequencyCount > 1) {
      if (selectedCount > 0) {
        return `Selected ${selectedCount}/${frequencyCount} doses`
      }
      return `Select ${frequencyCount} doses`
    } else {
      return selectedTimes[0] ? formatTime(selectedTimes[0]) : 'Select reminder time'
    }
  }

  const renderTimeChips = () => {
    if (frequencyCount <= 1) return null

    return (
      <View style={styles.timeChipsContainer}>
        {selectedTimes.map((time, index) => {
          if (!time) return null
          return (
            <View key={index} style={styles.timeChip}>
              <Text style={styles.timeChipLabel}>Dose {index + 1}:</Text>
              <Text style={styles.timeChipText}>{formatTime(time)}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  const renderProgressText = () => {
    if (frequencyCount <= 1 || selectedCount >= frequencyCount) return null
    
    const remaining = frequencyCount - selectedCount
    return (
      <Text style={styles.progressText}>
        📋 Please select {remaining} more dose{remaining > 1 ? 's' : ''}
      </Text>
    )
  }

  const renderMultiTimeNotification = () => {
    if (frequencyCount <= 1 || selectedCount > 0) return null

    return (
      <View style={styles.multiTimeNotification}>
        <View style={styles.multiTimeNotificationContent}>
          <Ionicons name={"time" as any} size={20} color="#f39c12" />
          <View style={styles.multiTimeNotificationText}>
            <Text style={styles.multiTimeNotificationTitle}>
              Multiple Doses Required
            </Text>
            <Text style={styles.multiTimeNotificationSubtitle}>
              You need to select {frequencyCount} different times for each dose
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.setTimesButton}
            onPress={() => setShowDoseSelector(true)}
          >
            <Text style={styles.setTimesButtonText}>Set Doses</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
        {frequencyCount > 1 && ` (${selectedCount}/${frequencyCount})`}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.timeButton,
          error && styles.errorBorder,
          disabled && styles.disabledButton,
          frequencyCount > 1 && selectedCount === 0 && styles.highlightButton
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={"time-outline" as any} 
          size={20} 
          color={disabled ? '#bdc3c7' : '#666'} 
        />
        
        <Text style={[
          styles.timeText,
          !selectedTimes.some(time => time !== undefined) && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {getDisplayText()}
        </Text>
        
        <Ionicons 
          name={"chevron-down" as any} 
          size={20} 
          color={disabled ? '#bdc3c7' : '#666'} 
        />
      </TouchableOpacity>

      {renderMultiTimeNotification()}
      {renderTimeChips()}
      {renderProgressText()}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Dose Selector Modal */}
      {showDoseSelector && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowDoseSelector(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Dose to Schedule</Text>
              <TouchableOpacity onPress={() => setShowDoseSelector(false)}>
                <Ionicons name={"close" as any} size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.doseSelectorContainer}>
              <Text style={styles.doseSelectorSubtitle}>
                Choose which dose you want to schedule:
              </Text>
              {Array.from({ length: frequencyCount }, (_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.doseOption,
                    selectedTimes[index] !== undefined && styles.doseOptionCompleted
                  ]}
                  onPress={() => handleDoseSelect(index)}
                >
                  <View style={styles.doseOptionContent}>
                    <View style={styles.doseOptionLeft}>
                      <View style={[
                        styles.doseIcon,
                        selectedTimes[index] !== undefined && styles.doseIconCompleted
                      ]}>
                        <Ionicons 
                          name={selectedTimes[index] !== undefined ? "checkmark" as any : "time" as any} 
                          size={20} 
                          color={selectedTimes[index] !== undefined ? "white" : Colors.PRIMARY} 
                        />
                      </View>
                      <View>
                        <Text style={styles.doseOptionTitle}>Dose {index + 1}</Text>
                        {selectedTimes[index] ? (
                          <Text style={styles.doseOptionTime}>
                            Scheduled: {formatTime(selectedTimes[index]!)}
                          </Text>
                        ) : (
                          <Text style={styles.doseOptionSubtitle}>
                            Tap to set time
                          </Text>
                        )}
                      </View>
                    </View>
                    {selectedTimes[index] !== undefined ? (
                      <Ionicons name={"checkmark-circle" as any} size={24} color="#27ae60" />
                    ) : (
                      <Ionicons name={"chevron-forward" as any} size={20} color="#bdc3c7" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTimes[currentDoseIndex] || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  required: {
    color: '#e74c3c',
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
  highlightButton: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    backgroundColor: '#f8f9ff',
  },
  errorBorder: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  disabledButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e1e8ed',
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  placeholderText: {
    color: '#95a5a6',
  },
  disabledText: {
    color: '#bdc3c7',
  },
  timeChipsContainer: {
    marginTop: 10,
  },
  timeChip: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeChipLabel: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 6,
    opacity: 0.9,
  },
  timeChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 12,
    color: '#f39c12',
    marginTop: 8,
    fontWeight: '600',
  },
  multiTimeNotification: {
    marginTop: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    padding: 15,
  },
  multiTimeNotificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiTimeNotificationText: {
    flex: 1,
    marginLeft: 12,
  },
  multiTimeNotificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 2,
  },
  multiTimeNotificationSubtitle: {
    fontSize: 12,
    color: '#856404',
  },
  setTimesButton: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  setTimesButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 5,
    marginLeft: 5,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  doseSelectorContainer: {
    padding: 20,
  },
  doseSelectorSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  doseOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  doseOptionCompleted: {
    borderColor: '#27ae60',
    backgroundColor: '#f8fff8',
  },
  doseOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  doseOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  doseIconCompleted: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  doseOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  doseOptionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  doseOptionTime: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
  },
})
