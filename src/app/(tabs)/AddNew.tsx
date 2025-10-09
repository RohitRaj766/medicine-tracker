// External libraries
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

// Internal modules
import { useMedicineForm } from '../../hooks'
import { 
  SearchableDropdown, 
  TextInput, 
  DatePicker, 
  MultiTimeSelector 
} from '../../components'
import { 
  MEDICINE_DICTIONARY, 
  DOSAGE_OPTIONS, 
  MEDICINE_TYPES, 
  FREQUENCY_OPTIONS 
} from '../../constants'
import { theme, colors, spacing, shadows } from '../../styles/theme'

export default function AddNew() {
  const router = useRouter()
  const { formData, errors, isLoading, updateField, saveMedicine } = useMedicineForm()

  // Helper function to get error for a specific field
  const getFieldError = (field: string) => {
    return errors.find((error: any) => error.field === field)?.message
  }

  // Handle saving medicine
  const handleSaveMedicine = async () => {
    const success = await saveMedicine()
    if (success) {
      Alert.alert('Success', 'Medicine added successfully!', [
          {
            text: 'OK',
          onPress: () => router.back()
          }
        ])
      } else {
      Alert.alert('Error', 'Failed to save medicine. Please check all required fields.')
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
            <Text style={styles.title}>Add New Medicine</Text>
            <Text style={styles.subtitle}>Track your medications with ease</Text>
    </View>
          <View style={styles.headerIcon}>
            <Ionicons name={"medical" as any} size={40} color={colors.textInverse} />
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <SearchableDropdown
              label="Medicine Name"
              placeholder="Select or search medicine"
              value={formData.medicineName}
              onSelect={(value) => updateField('medicineName', value)}
              options={MEDICINE_DICTIONARY}
              required
              error={getFieldError('medicineName')}
              allowCustom
              customLabel="Custom Medicine"
              onCustomSelect={(value) => {
                if (value === 'Custom Medicine') {
                  Alert.prompt(
                    'Custom Medicine', 
                    'Enter the medicine name:', 
                    (text) => {
                      if (text && text.trim()) {
                        updateField('medicineName', text.trim())
                      }
                    }
                  )
                }
              }}
            />

            <SearchableDropdown
              label="Medicine Type"
              placeholder="Select medicine type"
              value={formData.medicineType}
              onSelect={(value) => updateField('medicineType', value)}
              options={MEDICINE_TYPES}
              required
              error={getFieldError('medicineType')}
            />

            <SearchableDropdown
              label="Dosage"
              placeholder="Select dosage"
              value={formData.dosage}
              onSelect={(value:number) => updateField('dosage', value)}
              options={DOSAGE_OPTIONS}
              required
              error={getFieldError('dosage')}
              allowCustom
              customLabel="Custom"
              onCustomSelect={(value:string) => {
                if (value === 'Custom') {
                  Alert.prompt('Custom Dosage', 'Enter custom dosage:', (text) => {
                    if (text && text.trim()) {
                      updateField('dosage', text.trim())
                    }
                  })
                }
              }}
            />

            <SearchableDropdown
              label="Frequency"
              placeholder="Select frequency"
              value={formData.frequency}
              onSelect={(value) => updateField('frequency', value)}
              options={FREQUENCY_OPTIONS}
              required
              error={getFieldError('frequency')}
            />

                <TextInput
              label="Duration"
                  placeholder="e.g., 7 (days)"
              value={formData.duration}
              onChangeText={(text) => updateField('duration', text)}
              icon="calendar"
              required
              error={getFieldError('duration')}
                  keyboardType="numeric"
              helpText="💡 Enter number of days (e.g., 7, 14, 30)"
                />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            
            <DatePicker
              label="Start Date"
              placeholder="Select start date"
              value={formData.startDate}
              onChange={(date) => updateField('startDate', date)}
              required
              error={getFieldError('startDate')}
            />

            <DatePicker
              label="End Date"
              placeholder="Select end date"
              value={formData.endDate}
              onChange={(date) => updateField('endDate', date)}
              required
              error={getFieldError('endDate')}
            />

            <MultiTimeSelector
              label="Reminder Time"
              frequency={formData.frequency}
              selectedTimes={formData.selectedTimes || []}
              onTimesChange={(times) => updateField('selectedTimes', times)}
              required
              error={getFieldError('selectedTimes')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            
                <TextInput
              label="Notes"
                  placeholder="Additional notes about the medicine"
              value={formData.notes}
              onChangeText={(text) => updateField('notes', text)}
              icon="document-text"
                  multiline
                  numberOfLines={4}
              error={getFieldError('notes')}
                />
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.disabledButton]} 
            onPress={handleSaveMedicine}
            disabled={isLoading}
          >
            <Ionicons name={"save" as any} size={20} color={colors.textInverse} />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Medicine'}
            </Text>
          </TouchableOpacity>
    </View>
      </ScrollView>

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // HEADER
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    ...shadows.lg,
  },
  headerContent: {
    flex: 1,
  },
  headerIcon: {
    marginLeft: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 8,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: colors.textInverse,
    opacity: 0.85,
  },

  // FORM
  form: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  // SECTIONS
  section: {
    marginBottom: spacing.xxl,
    backgroundColor: colors.cardBackground || '#fff',
    borderRadius: theme.borderRadius.md,
    padding: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.sm,
  },

  // BUTTON
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    ...shadows.md,
  },
  saveButtonText: {
    color: colors.textInverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: spacing.sm,
  },
  disabledButton: {
    opacity: 0.6,
  },
})
