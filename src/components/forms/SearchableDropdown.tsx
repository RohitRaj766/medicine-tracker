import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Modal from './Modal'
import theme from '../../styles/theme'

interface SearchableDropdownProps {
  label: string
  placeholder: string
  value: string
  onSelect: (value: string) => void
  options: string[]
  searchPlaceholder?: string
  noResultsText?: string
  allowCustom?: boolean
  customLabel?: string
  onCustomSelect?: (value: string) => void
  required?: boolean
  error?: string
  disabled?: boolean
}

export default function SearchableDropdown({
  label,
  placeholder,
  value,
  onSelect,
  options,
  searchPlaceholder = 'Type to search...',
  noResultsText = 'No options found',
  allowCustom = false,
  customLabel = 'Custom',
  onCustomSelect,
  required = false,
  error,
  disabled = false
}: SearchableDropdownProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [searchText, setSearchText] = useState('')

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === customLabel && allowCustom && onCustomSelect) {
      onCustomSelect(selectedValue)
    } else {
      onSelect(selectedValue)
    }
    setIsVisible(false)
    setSearchText('')
  }

  const handleClose = () => {
    setIsVisible(false)
    setSearchText('')
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error && styles.errorBorder,
          disabled && styles.disabledButton
        ]}
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={"search" as any} 
          size={20} 
          color={disabled ? theme.colors.disabled : theme.colors.textSecondary} 
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
          color={disabled ? theme.colors.disabled : theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        onClose={handleClose}
        title={label}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name={"search" as any} size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor={theme.colors.placeholder}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name={"close-circle" as any} size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Options List */}
        <ScrollView style={styles.modalList}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => handleSelect(option)}
              >
                <Text style={styles.modalItemText}>{option}</Text>
                {value === option && (
                  <Ionicons name={"checkmark" as any} size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name={"search" as any} size={48} color={theme.colors.disabled} />
              <Text style={styles.noResultsText}>{noResultsText}</Text>
              <Text style={styles.noResultsSubtext}>
                Try typing a few letters to search
              </Text>
              {allowCustom && onCustomSelect && (
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => handleSelect(customLabel)}
                >
                  <Text style={styles.customButtonText}>Add Custom Option</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  errorBorder: { borderColor: theme.colors.danger, borderWidth: 2 },
  disabledButton: { backgroundColor: theme.colors.disabledBg, borderColor: theme.colors.border },
  dropdownText: { flex: 1, fontSize: theme.typography.fontSize.md, color: theme.colors.text, marginLeft: theme.spacing.sm },
  placeholderText: { color: theme.colors.placeholder },
  disabledText: { color: theme.colors.disabled },
  searchContainer: { padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.inputBg, borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border },
  searchInput: { flex: 1, fontSize: theme.typography.fontSize.md, color: theme.colors.text, marginLeft: theme.spacing.sm, marginRight: theme.spacing.sm },
  modalList: { maxHeight: 400 },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  modalItemText: { fontSize: theme.typography.fontSize.md, color: theme.colors.text },
  noResultsContainer: { alignItems: 'center', padding: theme.spacing.xl },
  noResultsText: { fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.textSecondary, marginTop: theme.spacing.md, marginBottom: theme.spacing.sm },
  noResultsSubtext: { fontSize: theme.typography.fontSize.sm, color: theme.colors.placeholder, textAlign: 'center', marginBottom: theme.spacing.lg, lineHeight: 20 },
  customButton: { backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.full },
  customButtonText: { color: theme.colors.onPrimary, fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.semibold },
})
