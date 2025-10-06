import Colors from '@/constant/Colors'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Modal from './Modal'

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
          color={disabled ? '#bdc3c7' : '#666'} 
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
          color={disabled ? '#bdc3c7' : '#666'} 
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
            <Ionicons name={"search" as any} size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name={"close-circle" as any} size={20} color="#666" />
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
                  <Ionicons name={"checkmark" as any} size={20} color={Colors.PRIMARY} />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name={"search" as any} size={48} color="#bdc3c7" />
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
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
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
  dropdownText: {
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
  searchContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
    marginRight: 10,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  modalItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  customButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
