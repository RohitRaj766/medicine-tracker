import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Medicine } from '../types/index'
import { updateMedicine } from '../services/Storage'
import { colors } from '../styles/theme'

interface MedicineCardProps {
  medicine: Medicine
  selectedDate?: Date
  onUpdate: () => void
}

export default function MedicineCard({ medicine, selectedDate, onUpdate }: MedicineCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const markAsTaken = async () => {
    const checkDate = selectedDate || new Date()
    const dateString = checkDate.toISOString().split('T')[0] // YYYY-MM-DD format
    
    if (medicine.consumedDates && medicine.consumedDates.includes(dateString)) {
      Alert.alert('Already Taken', `This medicine has already been marked as taken on ${checkDate.toLocaleDateString()}.`)
      return
    }

    // Remove from missed dates if it was previously missed
    const updatedMissedDates = medicine.missedDates ? 
      medicine.missedDates.filter(date => date !== dateString) : []

    const updatedMedicine = {
      ...medicine,
      consumedDates: [...(medicine.consumedDates || []), dateString],
      missedDates: updatedMissedDates
    }

    const success = await updateMedicine(medicine.id, updatedMedicine)
    if (success) {
      Alert.alert('Success', 'Medicine marked as taken!')
      onUpdate()
    } else {
      Alert.alert('Error', 'Failed to update medicine status.')
    }
  }

  const markAsMissed = async () => {
    const checkDate = selectedDate || new Date()
    const dateString = checkDate.toISOString().split('T')[0]
    
    if (medicine.missedDates && medicine.missedDates.includes(dateString)) {
      Alert.alert('Already Missed', `This medicine has already been marked as missed on ${checkDate.toLocaleDateString()}.`)
      return
    }

    Alert.alert(
      'Mark as Missed',
      `Mark ${medicine.medicineName} as missed for ${checkDate.toLocaleDateString()}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Mark as Missed',
          style: 'destructive',
          onPress: async () => {
            // Remove from consumed dates if it was previously taken
            const updatedConsumedDates = medicine.consumedDates ? 
              medicine.consumedDates.filter(date => date !== dateString) : []

            const updatedMedicine = {
              ...medicine,
              missedDates: [...(medicine.missedDates || []), dateString],
              consumedDates: updatedConsumedDates
            }

            const success = await updateMedicine(medicine.id, updatedMedicine)
            if (success) {
              Alert.alert('Marked as Missed', 'Medicine marked as missed!')
              onUpdate()
            } else {
              Alert.alert('Error', 'Failed to update medicine status.')
            }
          },
        }
      ]
    )
  }

  const checkDate = selectedDate || new Date()
  const dateString = checkDate.toISOString().split('T')[0]
  const isTakenOnSelectedDate = medicine.consumedDates && medicine.consumedDates.includes(dateString)
  
  // Check if medicine was missed (assuming we'll track this in future)
  const isMissedOnSelectedDate = medicine.missedDates && medicine.missedDates.includes(dateString)
  
  // Check if medicine was edited/updated (only if changes were made)
  const isEditedOnSelectedDate = medicine.lastEditedDate === dateString && 
    (medicine.lastEditedChanges && medicine.lastEditedChanges.length > 0)
  
  // Determine medicine status
  const getMedicineStatus = () => {
    if (isTakenOnSelectedDate) return 'taken'
    if (isMissedOnSelectedDate) return 'missed'
    if (isEditedOnSelectedDate) return 'edited'
    return 'pending' // No action taken
  }
  
  const medicineStatus = getMedicineStatus()

  const getMedicineIcon = () => {
    // Return different icons based on medicine name or type
    if (medicine.medicineName.toLowerCase().includes('tablet') || 
        medicine.medicineName.toLowerCase().includes('pill')) {
      return 'medical-outline'
    } else if (medicine.medicineName.toLowerCase().includes('syrup') || 
               medicine.medicineName.toLowerCase().includes('liquid')) {
      return 'flask-outline'
    } else if (medicine.medicineName.toLowerCase().includes('capsule')) {
      return 'ellipse-outline'
    } else {
      return 'medical-outline'
    }
  }

  const getStatusIcon = () => {
    switch (medicineStatus) {
      case 'taken': return 'checkmark-circle'
      case 'missed': return 'close-circle'
      case 'edited': return 'create-circle'
      default: return 'ellipse-outline'
    }
  }

  const getStatusColor = () => {
    switch (medicineStatus) {
      case 'taken': return '#27ae60' // Green
      case 'missed': return '#e74c3c' // Red
      case 'edited': return '#3498db' // Blue
      default: return '#fffdf2' // yellow
    }
  }

  const getCardBackgroundColor = () => {
    switch (medicineStatus) {
      case 'taken': return '#f8fff8' // Light green
      case 'missed': return '#fff8f8' // Light red
      case 'edited': return '#f8fbff' // Light blue
      default: return '#fffbdd' // Light yellow
    }
  }

  const getCardBorderColor = () => {
    switch (medicineStatus) {
      case 'taken': return '#27ae60' // Green
      case 'missed': return '#e74c3c' // Red
      case 'edited': return '#3498db' // Blue
      default: return '#f39c12' // yellow
    }
  }

  const getMedicineIconColor = () => {
    switch (medicineStatus) {
      case 'taken': return '#27ae60' // Green
      case 'missed': return '#e74c3c' // Red
      case 'edited': return '#3498db' // Blue
      default: return "#f39c12" // yellow
    }
  }

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: getCardBackgroundColor(),
        borderLeftColor: getCardBorderColor(),
        borderLeftWidth: 4
      }
    ]}>
      <View style={styles.medicineInfo}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getMedicineIcon() as any} 
            size={32} 
            color={getMedicineIconColor()} 
          />
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Ionicons 
              name={getStatusIcon() as any} 
              size={12} 
              color="white" 
            />
          </View>
        </View>
        
        <View style={styles.medicineDetails}>
          <Text style={styles.medicineName}>{medicine.medicineName}</Text>
          <Text style={styles.medicineTiming}>{medicine.frequency}</Text>
          <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
        </View>
        
        <View style={styles.timeContainer}>
          <View style={styles.timeButton}>
            <Ionicons name={"time-outline" as any} size={16} color="#666" />
            <Text style={styles.timeText}>{medicine.time || 'No time set'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.takeButton, 
            medicineStatus === 'taken' && styles.disabledButton
          ]} 
          onPress={markAsTaken}
          disabled={medicineStatus === 'taken'}
        >
          <Ionicons 
            name={medicineStatus === 'taken' ? "checkmark" : "checkmark-circle-outline"} 
            size={16} 
            color="white" 
          />
          <Text style={styles.actionButtonText}>
            {medicineStatus === 'taken' ? 'Taken' : 'Take'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.missedButton,
            medicineStatus === 'missed' && styles.disabledButton
          ]} 
          onPress={markAsMissed}
          disabled={medicineStatus === 'missed'}
        >
          <Ionicons 
            name={medicineStatus === 'missed' ? "close" : "close-circle-outline"} 
            size={16} 
            color="white" 
          />
          <Text style={styles.actionButtonText}>
            {medicineStatus === 'missed' ? 'Missed' : 'Miss'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 15,
  },
  statusBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  medicineTiming: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  medicineDosage: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timeContainer: {
    marginLeft: 10,
  },
  timeButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  takeButton: {
    backgroundColor: colors.primary,
  },
  missedButton: {
    backgroundColor: '#e74c3c',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
})
