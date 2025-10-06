import Colors from '@/constant/Colors'
import { saveMedicine } from '@/service/Storage'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

export default function AddNew() {
  const router = useRouter()
  
  const [medicineName, setMedicineName] = useState('')
  const [dosage, setDosage] = useState('')
  const [medicineType, setMedicineType] = useState('')
  const [frequency, setFrequency] = useState('')
  const [duration, setDuration] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  
  // Debug log for time picker state
  console.log('showTimePicker state:', showTimePicker)
  const [hasStartDate, setHasStartDate] = useState(false)
  const [hasEndDate, setHasEndDate] = useState(false)
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [hasSelectedTime, setHasSelectedTime] = useState(false)
  
  // New states for enhanced features
  const [showDosageModal, setShowDosageModal] = useState(false)
  const [showMedicineTypeModal, setShowMedicineTypeModal] = useState(false)
  const [showFrequencyModal, setShowFrequencyModal] = useState(false)
  const [showMedicineNameModal, setShowMedicineNameModal] = useState(false)
  const [selectedTimes, setSelectedTimes] = useState<Date[]>([])
  const [frequencyCount, setFrequencyCount] = useState(1)
  const [medicineSearchText, setMedicineSearchText] = useState('')
  const [medicineTypeSearchText, setMedicineTypeSearchText] = useState('')
  const [dosageSearchText, setDosageSearchText] = useState('')
  const [currentDoseIndex, setCurrentDoseIndex] = useState(0)
  const [showDoseSelector, setShowDoseSelector] = useState(false)

  // Ensure only one overlay/modal is active at a time
  const closeAllModals = () => {
    try {
      setShowFrequencyModal(false)
      setShowMedicineTypeModal(false)
      setShowMedicineNameModal(false)
      setShowDosageModal(false)
      setShowDoseSelector(false)
      setShowTimePicker(false)
      setShowStartDatePicker(false)
      setShowEndDatePicker(false)
    } catch {}
  }


  // Comprehensive Medicine Dictionary
  const medicineDictionary = [
    // Pain Relief & Fever
    'Paracetamol', 'Acetaminophen', 'Aspirin', 'Ibuprofen', 'Naproxen', 'Diclofenac', 'Meloxicam', 'Celecoxib',
    'Tramadol', 'Morphine', 'Codeine', 'Oxycodone', 'Hydrocodone', 'Fentanyl',
    
    // Antibiotics
    'Amoxicillin', 'Azithromycin', 'Cephalexin', 'Ciprofloxacin', 'Doxycycline', 'Levofloxacin', 'Metronidazole',
    'Penicillin', 'Tetracycline', 'Trimethoprim', 'Sulfamethoxazole', 'Clindamycin', 'Vancomycin',
    
    // Cardiovascular
    'Atorvastatin', 'Simvastatin', 'Lisinopril', 'Metoprolol', 'Amlodipine', 'Losartan', 'Valsartan',
    'Carvedilol', 'Digoxin', 'Warfarin', 'Aspirin', 'Clopidogrel', 'Nitroglycerin',
    
    // Diabetes
    'Metformin', 'Insulin', 'Glipizide', 'Glyburide', 'Pioglitazone', 'Sitagliptin', 'Canagliflozin',
    'Empagliflozin', 'Dapagliflozin', 'Liraglutide', 'Semaglutide',
    
    // Gastrointestinal
    'Omeprazole', 'Lansoprazole', 'Pantoprazole', 'Ranitidine', 'Famotidine', 'Metoclopramide',
    'Ondansetron', 'Loperamide', 'Senna', 'Bisacodyl', 'Lactulose', 'Polyethylene Glycol',
    
    // Respiratory
    'Albuterol', 'Salmeterol', 'Fluticasone', 'Budesonide', 'Montelukast', 'Theophylline',
    'Prednisolone', 'Dexamethasone', 'Methylprednisolone',
    
    // Antidepressants & Mental Health
    'Sertraline', 'Fluoxetine', 'Paroxetine', 'Citalopram', 'Escitalopram', 'Venlafaxine',
    'Duloxetine', 'Bupropion', 'Trazodone', 'Mirtazapine', 'Lorazepam', 'Diazepam',
    'Alprazolam', 'Clonazepam', 'Quetiapine', 'Risperidone', 'Olanzapine',
    
    // Thyroid
    'Levothyroxine', 'Liothyronine', 'Methimazole', 'Propylthiouracil',
    
    // Vitamins & Supplements
    'Vitamin D', 'Vitamin B12', 'Folic Acid', 'Iron', 'Calcium', 'Magnesium', 'Zinc',
    'Multivitamin', 'Omega-3', 'Probiotics', 'Coenzyme Q10',
    
    // Eye & Ear
    'Timolol', 'Latanoprost', 'Brimonidine', 'Dorzolamide', 'Artificial Tears',
    'Neomycin', 'Polymyxin', 'Ciprofloxacin Drops',
    
    // Skin
    'Hydrocortisone', 'Betamethasone', 'Clobetasol', 'Mupirocin', 'Clotrimazole',
    'Terbinafine', 'Benzoyl Peroxide', 'Salicylic Acid',
    
    // Sleep & Anxiety
    'Melatonin', 'Diphenhydramine', 'Doxylamine', 'Zolpidem', 'Eszopiclone',
    'Buspirone', 'Hydroxyzine',
    
    // Blood Pressure
    'Hydrochlorothiazide', 'Furosemide', 'Spironolactone', 'Chlorthalidone',
    'Diltiazem', 'Verapamil', 'Propranolol', 'Atenolol',
    
    // Antihistamines
    'Loratadine', 'Cetirizine', 'Fexofenadine', 'Chlorpheniramine', 'Diphenhydramine',
    
    // Muscle Relaxants
    'Cyclobenzaprine', 'Methocarbamol', 'Carisoprodol', 'Tizanidine',
    
    // Migraine
    'Sumatriptan', 'Rizatriptan', 'Eletriptan', 'Topiramate', 'Propranolol',
    
    // Custom option
    'Custom Medicine'
  ]

  // Predefined options
  const dosageOptions = [
    '5mg', '10mg', '20mg', '25mg', '50mg', '100mg', '200mg', '250mg', '500mg', '1000mg',
    '0.5ml', '1ml', '2ml', '5ml', '10ml', '15ml', '20ml',
    '1 tablet', '2 tablets', '3 tablets', '1/2 tablet', '1/4 tablet',
    '1 capsule', '2 capsules', '3 capsules',
    '1 drop', '2 drops', '3 drops', '5 drops',
    '1 spoon', '1/2 spoon', '1 teaspoon', '1 tablespoon',
    'Custom'
  ]

  const medicineTypes = [
    'Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Cream', 'Ointment', 
    'Gel', 'Patch', 'Inhaler', 'Powder', 'Liquid', 'Spray', 'Suppository',
    'Eye Drops', 'Ear Drops', 'Nasal Spray', 'Other'
  ]

  const frequencyOptions = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'Every 24 hours',
    'As needed', 'Weekly', 'Monthly'
  ]

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  const formatTime = (date: Date | undefined) => {
    if (!date) return ''
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Extract frequency count from frequency string
  const extractFrequencyCount = (freq: string) => {
    // Handle numeric patterns like "2 times daily", "3 times daily"
    const numericMatch = freq.match(/(\d+)\s*times?\s*daily/i)
    if (numericMatch) {
      return parseInt(numericMatch[1])
    }
    
    // Handle text patterns
    const lowerFreq = freq.toLowerCase()
    if (lowerFreq.includes('once daily') || lowerFreq.includes('once a day')) {
      return 1
    } else if (lowerFreq.includes('twice daily') || lowerFreq.includes('two times daily')) {
      return 2
    } else if (lowerFreq.includes('three times daily') || lowerFreq.includes('thrice daily')) {
      return 3
    } else if (lowerFreq.includes('four times daily')) {
      return 4
    } else if (lowerFreq.includes('every 6 hours')) {
      return 4 // 24/6 = 4 times daily
    } else if (lowerFreq.includes('every 8 hours')) {
      return 3 // 24/8 = 3 times daily
    } else if (lowerFreq.includes('every 12 hours')) {
      return 2 // 24/12 = 2 times daily
    } else if (lowerFreq.includes('every 24 hours')) {
      return 1 // 24/24 = 1 time daily
    } else if (lowerFreq.includes('as needed') || lowerFreq.includes('weekly') || lowerFreq.includes('monthly')) {
      return 1
    }
    
    // Default to 1 if no pattern matches
    return 1
  }

  // Handle frequency selection
  const handleFrequencySelect = (selectedFreq: string) => {
    setFrequency(selectedFreq)
    setShowFrequencyModal(false)
    
    const count = extractFrequencyCount(selectedFreq)
    setFrequencyCount(count)
    
    if (count > 1) {
      // Show dose selector for multiple doses
      setSelectedTimes(new Array(count))
      setHasSelectedTime(false)
      setCurrentDoseIndex(0)
      closeAllModals()
      requestAnimationFrame(() => setShowDoseSelector(true))
    } else {
      // Single dose - go directly to time picker
      setSelectedTime(new Date())
      setHasSelectedTime(false)
      closeAllModals()
      setShowTimePicker(true)
    }
  }

  // Handle dose selection
  const handleDoseSelect = (doseIndex: number) => {
    console.log('Dose selected:', doseIndex + 1)
    setCurrentDoseIndex(doseIndex)
    setShowDoseSelector(false)
    
    // Ensure selectedTime is set for the time picker
    if (!selectedTime) {
      setSelectedTime(new Date())
    }
    
    // Small delay to ensure modal closes before time picker opens
    setTimeout(() => {
      console.log('Opening time picker for dose:', doseIndex + 1)
      setShowTimePicker(true)
    }, 100)
  }

  // Handle time selection for specific dose
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      if (frequencyCount > 1) {
        // Handle multiple time selection for specific dose
        const newTimes = [...selectedTimes]
        newTimes[currentDoseIndex] = selectedTime
        setSelectedTimes(newTimes)
        
        // Check if all doses have times set
        if (newTimes.every(time => time !== undefined)) {
          setHasSelectedTime(true)
          setShowTimePicker(false)
          Alert.alert('Success', `All ${frequencyCount} doses have been scheduled!`)
        } else {
          setShowTimePicker(false)
          // Show dose selector for next dose
          setTimeout(() => {
            setShowDoseSelector(true)
          }, 300)
        }
      } else {
        // Single time selection
        setSelectedTime(selectedTime)
        setHasSelectedTime(true)
        setShowTimePicker(false)
      }
    } else {
      setShowTimePicker(false)
    }
  }

  // Get formatted times string
  const getTimesString = () => {
    if (frequencyCount > 1 && selectedTimes.filter(time => time !== undefined).length > 0) {
      return selectedTimes
        .filter(time => time !== undefined)
        .map(time => formatTime(time))
        .join(', ')
    } else if (hasSelectedTime && selectedTime) {
      return formatTime(selectedTime)
    }
    return ''
  }

  // Filter medicines based on search text
  const getFilteredMedicines = () => {
    if (!medicineSearchText.trim()) {
      return medicineDictionary
    }
    
    const searchLower = medicineSearchText.toLowerCase().trim()
    return medicineDictionary.filter(medicine => 
      medicine.toLowerCase().includes(searchLower)
    )
  }

  // Filter medicine types based on search text
  const getFilteredMedicineTypes = () => {
    if (!medicineTypeSearchText.trim()) {
      return medicineTypes
    }
    
    const searchLower = medicineTypeSearchText.toLowerCase().trim()
    return medicineTypes.filter(type => 
      type.toLowerCase().includes(searchLower)
    )
  }

  // Filter dosage options based on search text
  const getFilteredDosages = () => {
    if (!dosageSearchText.trim()) {
      return dosageOptions
    }
    
    const searchLower = dosageSearchText.toLowerCase().trim()
    return dosageOptions.filter(dosage => 
      dosage.toLowerCase().includes(searchLower)
    )
  }

  // Handle medicine name selection
  const handleMedicineNameSelect = (selectedMedicine: string) => {
    if (selectedMedicine === 'Custom Medicine') {
      setShowMedicineNameModal(false)
      Alert.prompt(
        'Custom Medicine', 
        'Enter the medicine name:', 
        (text) => {
          if (text && text.trim()) {
            setMedicineName(text.trim())
          }
        }
      )
    } else {
      setMedicineName(selectedMedicine)
      setShowMedicineNameModal(false)
      setMedicineSearchText('')
    }
  }

  // Handle medicine type selection
  const handleMedicineTypeSelect = (selectedType: string) => {
    setMedicineType(selectedType)
    setShowMedicineTypeModal(false)
    setMedicineTypeSearchText('')
  }

  // Handle dosage selection
  const handleDosageSelect = (selectedDosage: string) => {
    if (selectedDosage === 'Custom') {
      setShowDosageModal(false)
      Alert.prompt('Custom Dosage', 'Enter custom dosage:', (text) => {
        if (text && text.trim()) {
          setDosage(text.trim())
        }
      })
    } else {
      setDosage(selectedDosage)
      setShowDosageModal(false)
      setDosageSearchText('')
    }
  }

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false)
    if (selectedDate) {
      setStartDate(selectedDate)
      setHasStartDate(true)
      
      // Auto-calculate end date if duration is provided
      if (duration.trim()) {
        calculateEndDate(selectedDate, duration.trim())
      }
    }
  }

  const calculateEndDate = (startDate: Date, durationText: string) => {
    try {
      // Extract number from duration text (e.g., "4 days" -> 4)
      const durationMatch = durationText.match(/(\d+)/)
      if (durationMatch) {
        const days = parseInt(durationMatch[1])
        const calculatedEndDate = new Date(startDate)
        calculatedEndDate.setDate(startDate.getDate() + days)
        
        setEndDate(calculatedEndDate)
        setHasEndDate(true)
      }
    } catch (error) {
      console.log('Error calculating end date:', error)
    }
  }

  const handleDurationChange = (text: string) => {
    // Only allow numbers and common duration units
    const numericText = text.replace(/[^0-9\s]/g, '')
    setDuration(numericText)
    
    // Auto-calculate end date if start date is already selected
    if (hasStartDate && numericText.trim()) {
      calculateEndDate(startDate, numericText.trim())
    }
  }

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false)
    if (selectedDate) {
      setEndDate(selectedDate)
      setHasEndDate(true)
    }
  }


  const handleSaveMedicine = async () => {
    // Validate all required fields
    const missingFields = []
    
    if (!medicineName.trim()) missingFields.push('Medicine Name')
    if (!dosage.trim()) missingFields.push('Dosage')
    if (!medicineType.trim()) missingFields.push('Medicine Type')
    if (!frequency.trim()) missingFields.push('Frequency')
    if (!duration.trim()) missingFields.push('Duration')
    if (!hasStartDate) missingFields.push('Start Date')
    if (!hasEndDate) missingFields.push('End Date')
    if (!hasSelectedTime && frequencyCount === 1) missingFields.push('Reminder Time')
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Required Fields', 
        `Please fill in the following fields:\n• ${missingFields.join('\n• ')}`,
        [{ text: 'OK' }]
      )
      return
    }

    if (frequencyCount > 1 && selectedTimes.filter(time => time !== undefined).length !== frequencyCount) {
      Alert.alert('Error', `Please select all ${frequencyCount} doses for this frequency`)
      return
    }

    setIsLoading(true)
    
    // Create separate medicine entries for each time slot
    const medicines = []
    
    if (frequencyCount > 1 && selectedTimes.filter(time => time !== undefined).length > 0) {
      // Create separate medicine for each time slot
      selectedTimes.filter(time => time !== undefined).forEach((time, index) => {
        medicines.push({
          id: `${Date.now()}_${index}`,
          medicineName: medicineName.trim(),
          dosage: dosage.trim(),
          medicineType: medicineType.trim(),
          frequency: `${frequency.trim()} - Dose ${index + 1}`,
          duration: duration.trim(),
          startDate: hasStartDate ? formatDate(startDate) : '',
          endDate: hasEndDate ? formatDate(endDate) : '',
          time: formatTime(time),
          notes: notes.trim(),
          createdAt: new Date().toISOString(),
          consumedDates: [], // Track when medicine was taken
          parentMedicineId: Date.now().toString(), // Link related medicines
          timeSlotIndex: index
        })
      })
    } else {
      // Single medicine entry
      medicines.push({
        id: Date.now().toString(),
        medicineName: medicineName.trim(),
        dosage: dosage.trim(),
        medicineType: medicineType.trim(),
        frequency: frequency.trim(),
        duration: duration.trim(),
        startDate: hasStartDate ? formatDate(startDate) : '',
        endDate: hasEndDate ? formatDate(endDate) : '',
        time: getTimesString(),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
        consumedDates: [] // Track when medicine was taken
      })
    }

    try {
      // Debug logging
      console.log('Saving medicines:', medicines.length)
      medicines.forEach((med: any, index: number) => {
        console.log(`Medicine ${index + 1}:`, {
          id: med.id,
          name: med.medicineName,
          frequency: med.frequency,
          time: med.time,
          timeSlotIndex: med.timeSlotIndex,
          parentMedicineId: med.parentMedicineId
        })
      })
      
      // Save all medicine entries
      let allSuccess = true
      for (const medicine of medicines) {
        const success = await saveMedicine(medicine)
        if (!success) {
          allSuccess = false
          break
        }
      }
      
      if (allSuccess) {
        const message = frequencyCount > 1 
          ? `${frequencyCount} medicine reminders created successfully!`
          : 'Medicine added successfully!'
        
        Alert.alert('Success', message, [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setMedicineName('')
              setDosage('')
              setMedicineType('')
              setFrequency('')
              setDuration('')
              setStartDate(new Date())
              setEndDate(new Date())
              setNotes('')
              setHasStartDate(false)
              setHasEndDate(false)
              setSelectedTime(new Date())
              setHasSelectedTime(false)
              setSelectedTimes([])
              setFrequencyCount(1)
              setMedicineSearchText('')
            }
          }
        ])
      } else {
        Alert.alert('Error', 'Failed to save medicine. Please try again.')
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving medicine.')
    } finally {
      setIsLoading(false)
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
            <Ionicons name={"medical" as any} size={40} color="white" />
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Medicine Name *</Text>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => setShowMedicineNameModal(true)}
              >
                <Ionicons name={"medkit" as any} size={20} color="#666" />
                <Text style={[styles.dropdownText, !medicineName && styles.placeholderText]}>
                  {medicineName || 'Select or search medicine'}
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Medicine Type *</Text>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => setShowMedicineTypeModal(true)}
              >
                <Ionicons name={"medical" as any} size={20} color="#666" />
                <Text style={[styles.dropdownText, !medicineType && styles.placeholderText]}>
                  {medicineType || 'Select medicine type'}
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dosage *</Text>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => setShowDosageModal(true)}
              >
                <Ionicons name={"fitness" as any} size={20} color="#666" />
                <Text style={[styles.dropdownText, !dosage && styles.placeholderText]}>
                  {dosage || 'Select dosage'}
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Frequency *</Text>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => setShowFrequencyModal(true)}
              >
                <Ionicons name={"time" as any} size={20} color="#666" />
                <Text style={[styles.dropdownText, !frequency && styles.placeholderText]}>
                  {frequency || 'Select frequency'}
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Duration *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name={"calendar" as any} size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 7 (days)"
                  value={duration}
                  onChangeText={handleDurationChange}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
              <Text style={styles.helpText}>
                💡 Enter number of days (e.g., 7, 14, 30)
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Start Date *</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowStartDatePicker(true)}
              >
                <Ionicons name={"calendar-outline" as any} size={20} color="#666" />
                <Text style={[styles.dateText, !hasStartDate && styles.placeholderText]}>
                  {hasStartDate ? startDate.toLocaleDateString() : 'Select start date'}
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>End Date *</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowEndDatePicker(true)}
              >
                <Ionicons name={"calendar-outline" as any} size={20} color="#666" />
                <Text style={[styles.dateText, !hasEndDate && styles.placeholderText]}>
                  {hasEndDate ? endDate.toLocaleDateString() : 'Select end date'}
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
              {hasEndDate && hasStartDate && duration.trim() && (
                <Text style={styles.autoCalculatedText}>
                  ✨ Auto-calculated from duration
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Reminder Time *{frequencyCount > 1 ? ` (${selectedTimes.filter(time => time !== undefined).length}/${frequencyCount})` : ''}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.timeButton,
                  frequencyCount > 1 && selectedTimes.length === 0 && styles.timeButtonHighlight
                ]} 
                onPress={() => {
                  if (frequencyCount > 1) {
                    setShowDoseSelector(true)
                  } else {
                    setShowTimePicker(true)
                  }
                }}
              >
                <Ionicons name={"time-outline" as any} size={20} color="#666" />
                <Text style={[styles.timeText, !hasSelectedTime && styles.placeholderText]}>
                  {frequencyCount > 1 
                    ? selectedTimes.filter(time => time !== undefined).length > 0 
                      ? `Selected ${selectedTimes.filter(time => time !== undefined).length}/${frequencyCount} doses`
                      : `Select ${frequencyCount} doses`
                    : hasSelectedTime 
                      ? getTimesString() 
                      : 'Select reminder time'
                  }
                </Text>
                <Ionicons name={"chevron-down" as any} size={20} color="#666" />
              </TouchableOpacity>
              
              {frequencyCount > 1 && selectedTimes.filter(time => time !== undefined).length === 0 && (
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
              )}
              
              {frequencyCount > 1 && selectedTimes.filter(time => time !== undefined).length > 0 && (
                <View style={styles.multipleTimesContainer}>
                  {selectedTimes.map((time, index) => {
                    if (!time) return null
                    return (
                      <View key={index} style={styles.timeChip}>
                        <Text style={styles.timeChipLabel}>
                          Dose {index + 1}:
                        </Text>
                        <Text style={styles.timeChipText}>{formatTime(time)}</Text>
    </View>
  )
                  })}
                </View>
              )}
              
              {frequencyCount > 1 && selectedTimes.filter(time => time !== undefined).length < frequencyCount && (
                <Text style={styles.progressText}>
                  📋 Please select {frequencyCount - selectedTimes.filter(time => time !== undefined).length} more dose{frequencyCount - selectedTimes.filter(time => time !== undefined).length > 1 ? 's' : ''}
                </Text>
              )}
              
              {hasSelectedTime && (
                <Text style={styles.helpText}>
                  💡 {frequencyCount > 1 
                    ? `You'll get ${frequencyCount} separate reminders each day` 
                    : 'You\'ll be reminded at this time daily'
                  }
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes</Text>
              <View style={styles.notesWrapper}>
                <Ionicons name={"document-text" as any} size={20} color="#666" style={styles.notesIcon} />
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Additional notes about the medicine"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.disabledButton]} 
            onPress={handleSaveMedicine}
            disabled={isLoading}
          >
            <Ionicons name={"save" as any} size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Medicine'}
            </Text>
          </TouchableOpacity>
          
      
    </View>
      </ScrollView>

      {/* Date and Time Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Dose Selector Modal */}
      <Modal
        visible={showDoseSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDoseSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowDoseSelector(false)} />
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
                            Scheduled: {formatTime(selectedTimes[index])}
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
      </Modal>


      {/* Medicine Type Modal */}
      <Modal
        visible={showMedicineTypeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMedicineTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Medicine Type</Text>
              <TouchableOpacity onPress={() => {
                setShowMedicineTypeModal(false)
                setMedicineTypeSearchText('')
              }}>
                <Ionicons name={"close" as any} size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Ionicons name={"search" as any} size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Type to search medicine types..."
                  value={medicineTypeSearchText}
                  onChangeText={setMedicineTypeSearchText}
                  autoFocus={true}
                />
                {medicineTypeSearchText.length > 0 && (
                  <TouchableOpacity onPress={() => setMedicineTypeSearchText('')}>
                    <Ionicons name={"close-circle" as any} size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <ScrollView style={styles.modalList}>
              {getFilteredMedicineTypes().length > 0 ? (
                getFilteredMedicineTypes().map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalItem}
                    onPress={() => handleMedicineTypeSelect(type)}
                  >
                    <Text style={styles.modalItemText}>{type}</Text>
                    {medicineType === type && (
                      <Ionicons name={"checkmark" as any} size={20} color={Colors.PRIMARY} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Ionicons name={"search" as any} size={48} color="#bdc3c7" />
                  <Text style={styles.noResultsText}>No medicine types found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try typing a few letters of the medicine type
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Dosage Modal */}
      <Modal
        visible={showDosageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDosageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Dosage</Text>
              <TouchableOpacity onPress={() => {
                setShowDosageModal(false)
                setDosageSearchText('')
              }}>
                <Ionicons name={"close" as any} size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Ionicons name={"search" as any} size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Type to search dosages..."
                  value={dosageSearchText}
                  onChangeText={setDosageSearchText}
                  autoFocus={true}
                />
                {dosageSearchText.length > 0 && (
                  <TouchableOpacity onPress={() => setDosageSearchText('')}>
                    <Ionicons name={"close-circle" as any} size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <ScrollView style={styles.modalList}>
              {getFilteredDosages().length > 0 ? (
                getFilteredDosages().map((dosageOption, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalItem}
                    onPress={() => handleDosageSelect(dosageOption)}
                  >
                    <Text style={styles.modalItemText}>{dosageOption}</Text>
                    {dosage === dosageOption && (
                      <Ionicons name={"checkmark" as any} size={20} color={Colors.PRIMARY} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Ionicons name={"search" as any} size={48} color="#bdc3c7" />
                  <Text style={styles.noResultsText}>No dosages found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try typing a few letters or numbers
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Frequency Modal */}
      <Modal
        visible={showFrequencyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFrequencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Frequency</Text>
              <TouchableOpacity onPress={() => setShowFrequencyModal(false)}>
                <Ionicons name={"close" as any} size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {frequencyOptions.map((freq, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => handleFrequencySelect(freq)}
                >
                  <Text style={styles.modalItemText}>{freq}</Text>
                  {frequency === freq && (
                    <Ionicons name={"checkmark" as any} size={20} color={Colors.PRIMARY} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Medicine Name Modal with Search */}
      <Modal
        visible={showMedicineNameModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMedicineNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Medicine</Text>
              <TouchableOpacity onPress={() => {
                setShowMedicineNameModal(false)
                setMedicineSearchText('')
              }}>
                <Ionicons name={"close" as any} size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Ionicons name={"search" as any} size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Type 2-3 letters to search..."
                  value={medicineSearchText}
                  onChangeText={setMedicineSearchText}
                  autoFocus={true}
                />
                {medicineSearchText.length > 0 && (
                  <TouchableOpacity onPress={() => setMedicineSearchText('')}>
                    <Ionicons name={"close-circle" as any} size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Medicine List */}
            <ScrollView style={styles.modalList}>
              {getFilteredMedicines().length > 0 ? (
                getFilteredMedicines().map((medicine, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalItem}
                    onPress={() => handleMedicineNameSelect(medicine)}
                  >
                    <Text style={styles.modalItemText}>{medicine}</Text>
                    {medicineName === medicine && (
                      <Ionicons name={"checkmark" as any} size={20} color={Colors.PRIMARY} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Ionicons name={"search" as any} size={48} color="#bdc3c7" />
                  <Text style={styles.noResultsText}>No medicines found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try typing 2-3 letters of the medicine name
                  </Text>
                  <TouchableOpacity
                    style={styles.customMedicineButton}
                    onPress={() => handleMedicineNameSelect('Custom Medicine')}
                  >
                    <Text style={styles.customMedicineButtonText}>Add Custom Medicine</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
    </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerIcon: {
    marginLeft: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  form: {
    padding: 20,
    paddingTop: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  notesWrapper: {
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
  notesIcon: {
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  dateButton: {
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
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  placeholderText: {
    color: '#95a5a6',
  },
  autoCalculatedText: {
    fontSize: 12,
    color: '#27ae60',
    marginTop: 8,
    fontStyle: 'italic',
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
  timeButtonHighlight: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    backgroundColor: '#f8f9ff',
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  helpText: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 8,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dropdownButton: {
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
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  multipleTimesContainer: {
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
  multiTimeHint: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 8,
    fontWeight: '500',
    fontStyle: 'italic',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
  customMedicineButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  customMedicineButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  timePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  timePickerModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  timePickerClose: {
    padding: 5,
  },
  timePickerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontStyle: 'italic',
  },
  timePicker: {
    alignSelf: 'center',
    marginTop: 10,
  },
  customTimePicker: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timePickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  timePickerSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxHeight: 120,
  },
  timePickerOption: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  timePickerOptionSelected: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  timePickerOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  timePickerOptionTextSelected: {
    color: 'white',
  },
  ampmSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  ampmButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e1e8ed',
  },
  ampmButtonSelected: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  ampmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  ampmButtonTextSelected: {
    color: 'white',
  },
  timePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timePreviewText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  confirmTimeButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmTimeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  manualSetupContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  manualSetupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 12,
    textAlign: 'center',
  },
  manualSetupButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  manualSetupButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  timePickerProgress: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 4,
  },
  selectedTimesPreview: {
    marginTop: 15,
  },
  selectedTimesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  selectedTimeChip: {
    backgroundColor: '#e8f5e8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 6,
  },
  selectedTimeChipText: {
    color: '#27ae60',
    fontSize: 12,
    fontWeight: '600',
  },
  removeTimeButton: {
    padding: 4,
  },
  timePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  addTimeButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
  },
  addTimeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  nextButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#95a5a6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
})