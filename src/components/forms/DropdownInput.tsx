import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import theme from '../../styles/theme'

interface DropdownInputProps {
  label: string
  placeholder: string
  value: string
  onPress: () => void
  icon?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

export default function DropdownInput({
  label,
  placeholder,
  value,
  onPress,
  icon = 'chevron-down',
  required = false,
  error,
  disabled = false
}: DropdownInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error && styles.errorBorder,
          disabled && styles.disabledButton
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={icon as any} 
          size={20} 
          color={disabled ? theme.colors.textDisabled : theme.colors.textSecondary} 
        />
        
        <Text style={[
          styles.dropdownText,
          !value && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {value || placeholder}
        </Text>
        
        <Ionicons 
          name={"chevron-down" as any} 
          size={20} 
          color={disabled ? theme.colors.textDisabled : theme.colors.textSecondary} 
        />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  required: {
    color: theme.colors.error,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.sm,
  },
  errorBorder: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  disabledButton: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.border,
  },
  dropdownText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  placeholderText: {
    color: theme.colors.textTertiary,
  },
  disabledText: {
    color: theme.colors.textDisabled,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
})
