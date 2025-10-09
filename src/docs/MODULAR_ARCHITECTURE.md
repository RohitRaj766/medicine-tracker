# Modular Architecture Documentation

## Overview

This document outlines the modular architecture implemented in the Sanjeevani medicine tracking app. The codebase has been restructured to improve maintainability, reusability, and scalability.

## Directory Structure

```
src/
├── types/                 # TypeScript type definitions
├── constants/             # Application constants and data
├── utils/                 # Utility functions
├── hooks/                 # Custom React hooks
├── components/            # Reusable UI components
│   ├── forms/            # Form-specific components
│   ├── Header.tsx        # Header component
│   └── MedicineCard.tsx  # Medicine card component
├── styles/               # Shared styles and theme
└── docs/                 # Documentation
```

## Core Modules

### 1. Types (`types/index.ts`)

Centralized TypeScript definitions for the entire application:

- **Medicine**: Core medicine data structure
- **MedicineFormData**: Form data structure
- **User**: User information structure
- **ValidationResult**: Validation response structure
- **Theme**: Theme configuration structure
- **NavigationParams**: Navigation parameter types

**Usage:**
```typescript
import { Medicine, MedicineFormData, ValidationResult } from '@/types'
```

### 2. Constants (`constants/medicineData.ts`)

Centralized data and configuration:

- **MEDICINE_DICTIONARY**: Comprehensive list of medicines
- **DOSAGE_OPTIONS**: Predefined dosage options
- **MEDICINE_TYPES**: Medicine type categories
- **FREQUENCY_OPTIONS**: Frequency selection options
- **VALIDATION_RULES**: Form validation rules
- **ERROR_MESSAGES**: Standardized error messages

**Usage:**
```typescript
import { MEDICINE_DICTIONARY, DOSAGE_OPTIONS, VALIDATION_RULES } from '@/constants'
```

### 3. Utilities

#### Date Utilities (`utils/dateUtils.ts`)
- Date formatting and parsing functions
- Time calculation utilities
- Frequency parsing functions
- Date range utilities

#### Medicine Utilities (`utils/medicineUtils.ts`)
- Medicine filtering and sorting
- Statistics calculation
- Status management
- Import/export functionality

#### Validation Utilities (`utils/validationUtils.ts`)
- Form validation functions
- Field-specific validation
- Error message formatting

**Usage:**
```typescript
import { formatDate, filterMedicinesByDate, validateMedicineForm } from '@/utils'
```

### 4. Custom Hooks (`hooks/`)

#### useMedicines
Manages medicine data and operations:
```typescript
const { medicines, loadMedicines, markAsTaken, deleteMedicine } = useMedicines()
```

#### useMedicineForm
Handles form state and validation:
```typescript
const { formData, errors, updateField, saveMedicine } = useMedicineForm()
```

#### useEditMedicineForm
Specialized hook for editing existing medicines:
```typescript
const formHook = useEditMedicineForm(medicine)
```

**Usage:**
```typescript
import { useMedicines, useMedicineForm } from '@/hooks'
```

### 5. Reusable Components (`components/forms/`)

#### Form Components
- **DropdownInput**: Generic dropdown input
- **TextInput**: Enhanced text input with validation
- **Modal**: Reusable modal component
- **SearchableDropdown**: Dropdown with search functionality
- **DatePicker**: Date selection component
- **TimePicker**: Time selection component
- **MultiTimeSelector**: Multi-dose time selection

**Usage:**
```typescript
import { DropdownInput, TextInput, Modal } from '@/components'
```

### 6. Theme System (`styles/theme.ts`)

Centralized styling system:
- **Colors**: Consistent color palette
- **Typography**: Font sizes, weights, and line heights
- **Spacing**: Standard spacing scale
- **Shadows**: Shadow definitions
- **Common Styles**: Reusable style objects

**Usage:**
```typescript
import { theme, colors, spacing } from '@/styles/theme'
```

## Benefits of Modular Architecture

### 1. **Reusability**
- Components can be used across multiple screens
- Utilities eliminate code duplication
- Consistent styling through theme system

### 2. **Maintainability**
- Clear separation of concerns
- Easy to locate and modify specific functionality
- Centralized type definitions prevent inconsistencies

### 3. **Scalability**
- Easy to add new features without affecting existing code
- Modular structure supports team development
- Clear patterns for extending functionality

### 4. **Testing**
- Individual modules can be tested in isolation
- Mock implementations are easier to create
- Better test coverage and reliability

### 5. **Performance**
- Code splitting opportunities
- Lazy loading of components
- Optimized bundle sizes

## Implementation Examples

### Using Form Components

```typescript
import { SearchableDropdown, DatePicker, MultiTimeSelector } from '@/components'
import { MEDICINE_DICTIONARY, FREQUENCY_OPTIONS } from '@/constants'

function MedicineForm() {
  return (
    <View>
      <SearchableDropdown
        label="Medicine Name"
        options={MEDICINE_DICTIONARY}
        value={medicineName}
        onSelect={setMedicineName}
        required
      />
      
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={setStartDate}
        required
      />
      
      <MultiTimeSelector
        label="Reminder Time"
        frequency={frequency}
        selectedTimes={selectedTimes}
        onTimesChange={setSelectedTimes}
        required
      />
    </View>
  )
}
```

### Using Custom Hooks

```typescript
import { useMedicines, useMedicineForm } from '@/hooks'

function AddMedicineScreen() {
  const { addMedicine } = useMedicines()
  const { formData, errors, updateField, saveMedicine } = useMedicineForm()
  
  const handleSave = async () => {
    const success = await saveMedicine()
    if (success) {
      // Navigate back or show success message
    }
  }
  
  return (
    // Form UI using formData and updateField
  )
}
```

### Using Utilities

```typescript
import { formatDate, filterMedicinesByDate, validateMedicineForm } from '@/utils'

function MedicineList() {
  const medicines = filterMedicinesByDate(allMedicines, selectedDate)
  const validation = validateMedicineForm(formData)
  
  return (
    // Render filtered medicines
  )
}
```

## Migration Guide

### Before (Monolithic)
```typescript
// All logic in one component
function AddNew() {
  const [medicineName, setMedicineName] = useState('')
  const [dosage, setDosage] = useState('')
  // ... many more states
  
  const handleSave = () => {
    // Complex validation logic
    // Save logic
    // Error handling
  }
  
  return (
    // Large JSX with inline styles
  )
}
```

### After (Modular)
```typescript
import { useMedicineForm } from '@/hooks'
import { SearchableDropdown, DatePicker } from '@/components'
import { MEDICINE_DICTIONARY } from '@/constants'

function AddNew() {
  const { formData, errors, updateField, saveMedicine } = useMedicineForm()
  
  return (
    <View>
      <SearchableDropdown
        label="Medicine Name"
        options={MEDICINE_DICTIONARY}
        value={formData.medicineName}
        onSelect={(value) => updateField('medicineName', value)}
        error={errors.find(e => e.field === 'medicineName')?.message}
      />
      {/* More components */}
    </View>
  )
}
```

## Best Practices

### 1. **Import Organization**
```typescript
// External libraries
import React from 'react'
import { View, Text } from 'react-native'

// Internal modules
import { useMedicines } from '@/hooks'
import { SearchableDropdown } from '@/components'
import { MEDICINE_DICTIONARY } from '@/constants'
import { validateMedicineForm } from '@/utils'
```

### 2. **Component Composition**
```typescript
// Compose smaller components into larger ones
function MedicineForm() {
  return (
    <View>
      <MedicineBasicInfo />
      <MedicineSchedule />
      <MedicineNotes />
    </View>
  )
}
```

### 3. **Hook Usage**
```typescript
// Use custom hooks for complex logic
function MedicineScreen() {
  const { medicines, isLoading } = useMedicines()
  const { formData, saveMedicine } = useMedicineForm()
  
  // Component logic
}
```

### 4. **Error Handling**
```typescript
// Centralized error handling
try {
  const result = await saveMedicine()
  if (!result) {
    Alert.alert('Error', 'Failed to save medicine')
  }
} catch (error) {
  console.error('Unexpected error:', error)
  Alert.alert('Error', 'An unexpected error occurred')
}
```

## Future Enhancements

### 1. **State Management**
- Consider Redux or Zustand for complex state
- Implement optimistic updates
- Add offline support

### 2. **Performance**
- Implement React.memo for expensive components
- Add virtualization for large lists
- Optimize bundle splitting

### 3. **Testing**
- Add unit tests for utilities
- Component testing with React Native Testing Library
- Integration tests for hooks

### 4. **Accessibility**
- Add accessibility labels
- Implement screen reader support
- Keyboard navigation support

## Conclusion

The modular architecture provides a solid foundation for the Sanjeevani app, making it easier to maintain, extend, and test. The clear separation of concerns and reusable components will significantly improve development velocity and code quality.

For questions or suggestions about the modular architecture, please refer to the individual module documentation or contact the development team.
