import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatTime } from '../../utils/dateUtils'
import { extractFrequencyCount } from '../../utils/dateUtils'
import theme from '../../styles/theme'

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
      if (newTimes.every(time => time !== undefined)) {
        setShowTimePicker(false)
        Alert.alert('Success', `All ${frequencyCount} doses scheduled!`)
      } else {
        setShowTimePicker(false)
        setTimeout(() => setShowDoseSelector(true), 300)
      }
    } else {
      setShowTimePicker(false)
    }
  }

  const handlePress = () => {
    if (!disabled) {
      if (frequencyCount > 1) setShowDoseSelector(true)
      else setShowTimePicker(true)
    }
  }

  const getDisplayText = () => {
    if (frequencyCount > 1) {
      if (selectedCount > 0) return `Selected ${selectedCount}/${frequencyCount} doses`
      return `Select ${frequencyCount} doses`
    } else {
      return selectedTimes[0] ? formatTime(selectedTimes[0]) : 'Select reminder time'
    }
  }

  const renderTimeChips = () => {
    if (frequencyCount <= 1) return null
    return (
      <View style={styles.timeChipsContainer}>
        {selectedTimes.map((time, index) => time && (
          <View key={index} style={styles.timeChip}>
            <Text style={styles.timeChipLabel}>Dose {index + 1}:</Text>
            <Text style={styles.timeChipText}>{formatTime(time)}</Text>
          </View>
        ))}
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
          <Ionicons name={"time" as any} size={20} color={theme.colors.warning} />
          <View style={styles.multiTimeNotificationText}>
            <Text style={styles.multiTimeNotificationTitle}>
              Multiple Doses Required
            </Text>
            <Text style={styles.multiTimeNotificationSubtitle}>
              You need to select {frequencyCount} different times for each dose
            </Text>
          </View>
          <TouchableOpacity style={styles.setTimesButton} onPress={() => setShowDoseSelector(true)}>
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
        <Ionicons name={"time-outline" as any} size={20} color={disabled ? theme.colors.disabled : theme.colors.textSecondary} />
        <Text style={[
          styles.timeText,
          !selectedTimes.some(time => time) && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {getDisplayText()}
        </Text>
        <Ionicons name={"chevron-down" as any} size={20} color={disabled ? theme.colors.disabled : theme.colors.textSecondary} />
      </TouchableOpacity>

      {renderMultiTimeNotification()}
      {renderTimeChips()}
      {renderProgressText()}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Dose Selector Modal */}
      {showDoseSelector && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowDoseSelector(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Dose to Schedule</Text>
              <TouchableOpacity onPress={() => setShowDoseSelector(false)}>
                <Ionicons name={"close" as any} size={24} color={theme.colors.textSecondary} />
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
                    selectedTimes[index] && styles.doseOptionCompleted
                  ]}
                  onPress={() => handleDoseSelect(index)}
                >
                  <View style={styles.doseOptionContent}>
                    <View style={styles.doseOptionLeft}>
                      <View style={[
                        styles.doseIcon,
                        selectedTimes[index] && styles.doseIconCompleted
                      ]}>
                        <Ionicons 
                          name={selectedTimes[index] ? "checkmark" as any : "time" as any} 
                          size={20} 
                          color={selectedTimes[index] ? theme.colors.successText : theme.colors.primary} 
                        />
                      </View>
                      <View>
                        <Text style={styles.doseOptionTitle}>Dose {index + 1}</Text>
                        {selectedTimes[index] ? (
                          <Text style={styles.doseOptionTime}>Scheduled: {formatTime(selectedTimes[index]!)} </Text>
                        ) : (
                          <Text style={styles.doseOptionSubtitle}>Tap to set time</Text>
                        )}
                      </View>
                    </View>
                    {selectedTimes[index] ? (
                      <Ionicons name={"checkmark-circle" as any} size={24} color={theme.colors.success} />
                    ) : (
                      <Ionicons name={"chevron-forward" as any} size={20} color={theme.colors.disabled} />
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
  container: { marginBottom: theme.spacing.lg },
  label: { fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text, marginBottom: theme.spacing.sm },
  required: { color: theme.colors.danger },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.sm,
  },
  highlightButton: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primaryLight,
  },
  errorBorder: { borderColor: theme.colors.danger, borderWidth: 2 },
  disabledButton: { backgroundColor: theme.colors.disabledBg, borderColor: theme.colors.border },
  timeText: { flex: 1, fontSize: theme.typography.fontSize.md, color: theme.colors.text, marginLeft: theme.spacing.sm },
  placeholderText: { color: theme.colors.placeholder },
  disabledText: { color: theme.colors.disabled },
  timeChipsContainer: { marginTop: theme.spacing.sm },
  timeChip: { backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.full, marginBottom: theme.spacing.sm, flexDirection: 'row', alignItems: 'center' },
  timeChipLabel: { color: theme.colors.onPrimary, fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.semibold, marginRight: 6, opacity: 0.9 },
  timeChipText: { color: theme.colors.onPrimary, fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold },
  progressText: { fontSize: theme.typography.fontSize.sm, color: theme.colors.warning, marginTop: theme.spacing.sm, fontWeight: theme.typography.fontWeight.semibold },
  multiTimeNotification: { marginTop: theme.spacing.md, backgroundColor: theme.colors.warningLight, borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.warning, padding: theme.spacing.md },
  multiTimeNotificationContent: { flexDirection: 'row', alignItems: 'center' },
  multiTimeNotificationText: { flex: 1, marginLeft: theme.spacing.md },
  multiTimeNotificationTitle: { fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.warningText, marginBottom: 2 },
  multiTimeNotificationSubtitle: { fontSize: theme.typography.fontSize.xs, color: theme.colors.warningText },
  setTimesButton: { backgroundColor: theme.colors.warning, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, borderRadius: theme.borderRadius.sm, marginLeft: theme.spacing.md },
  setTimesButtonText: { color: theme.colors.onWarning, fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.bold },
  errorText: { fontSize: theme.typography.fontSize.xs, color: theme.colors.danger, marginTop: theme.spacing.xs, marginLeft: theme.spacing.xs },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.colors.overlay, justifyContent: 'flex-end', zIndex: 1000 },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  modalContent: { backgroundColor: theme.colors.background, borderTopLeftRadius: theme.borderRadius.xl, borderTopRightRadius: theme.borderRadius.xl, maxHeight: '80%', ...theme.shadows.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  modalTitle: { fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text },
  doseSelectorContainer: { padding: theme.spacing.lg },
  doseSelectorSubtitle: { fontSize: theme.typography.fontSize.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.md, textAlign: 'center' },
  doseOption: { backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.md, ...theme.shadows.sm },
  doseOptionCompleted: { borderColor: theme.colors.success, backgroundColor: theme.colors.successLight },
  doseOptionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.md },
  doseOptionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  doseIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md, borderWidth: 2, borderColor: theme.colors.primary },
  doseIconCompleted: { backgroundColor: theme.colors.success, borderColor: theme.colors.success },
  doseOptionTitle: { fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text, marginBottom: 2 },
  doseOptionSubtitle: { fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary },
  doseOptionTime: { fontSize: theme.typography.fontSize.sm, color: theme.colors.success, fontWeight: theme.typography.fontWeight.semibold },
})
