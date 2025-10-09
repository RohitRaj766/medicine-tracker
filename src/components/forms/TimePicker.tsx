import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatTime } from '../../utils/dateUtils'

interface TimePickerProps {
  label: string
  placeholder: string
  value: Date | null
  onChange: (date: Date | null) => void
  required?: boolean
  error?: string
  disabled?: boolean
}

export default function TimePicker({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  disabled = false
}: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false)

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false)
    }
    
    if (selectedTime) {
      onChange(selectedTime)
    }
  }

  const handlePress = () => {
    if (!disabled) {
      setShowPicker(true)
    }
  }

  const displayValue = value ? formatTime(value) : ''

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.timeButton,
          error && styles.errorBorder,
          disabled && styles.disabledButton
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
          !displayValue && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {displayValue || placeholder}
        </Text>
        
        <Ionicons 
          name={"chevron-down" as any} 
          size={20} 
          color={disabled ? '#bdc3c7' : '#666'} 
        />
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 5,
    marginLeft: 5,
  },
})
