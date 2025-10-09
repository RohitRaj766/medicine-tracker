import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TextInput as RNTextInput, View } from 'react-native'

interface TextInputProps {
  label: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  icon?: string
  required?: boolean
  error?: string
  disabled?: boolean
  multiline?: boolean
  numberOfLines?: number
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'
  returnKeyType?: 'done' | 'next' | 'search' | 'send'
  secureTextEntry?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  helpText?: string
}

export default function TextInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  required = false,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  returnKeyType = 'done',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  helpText
}: TextInputProps) {
  const inputStyle = multiline ? [styles.input, styles.multilineInput] : styles.input

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      <View style={[
        styles.inputWrapper,
        error && styles.errorBorder,
        disabled && styles.disabledWrapper,
        multiline && styles.multilineWrapper
      ]}>
        {icon && (
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={disabled ? '#bdc3c7' : '#666'} 
            style={styles.inputIcon}
          />
        )}
        
        <RNTextInput
          style={[
            inputStyle,
            disabled && styles.disabledText
          ]}
          placeholder={placeholder}
          placeholderTextColor="#95a5a6"
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
      
      {helpText && !error && (
        <Text style={styles.helpText}>{helpText}</Text>
      )}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
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
  multilineWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
  errorBorder: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  disabledWrapper: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e1e8ed',
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
  multilineInput: {
    minHeight: 100,
    paddingTop: 0,
    paddingVertical: 0,
  },
  disabledText: {
    color: '#bdc3c7',
  },
  helpText: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 5,
    marginLeft: 5,
  },
})
