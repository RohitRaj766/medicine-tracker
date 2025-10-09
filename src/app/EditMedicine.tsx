import { updateMedicine } from '../services/Storage'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
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
import theme from '../styles/theme'

export default function EditMedicine() {
  const router = useRouter()
  const { medicine } = useLocalSearchParams()
  
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
  const [hasStartDate, setHasStartDate] = useState(false)
  const [hasEndDate, setHasEndDate] = useState(false)
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [hasSelectedTime, setHasSelectedTime] = useState(false)
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null)
  
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

  useEffect(() => {
    if (medicine) {
      try {
        const medicineData = JSON.parse(decodeURIComponent(medicine as string))
        setMedicineName(medicineData.medicineName || '')
        setDosage(medicineData.dosage || '')
        setMedicineType(medicineData.medicineType || '')
        setFrequency(medicineData.frequency || '')
        setDuration(medicineData.duration || '')
        setNotes(medicineData.notes || '')
        setEditingMedicineId(medicineData.id)
        
        // Set dates
        if (medicineData.startDate) {
          setStartDate(new Date(medicineData.startDate))
          setHasStartDate(true)
        }
        if (medicineData.endDate) {
          setEndDate(new Date(medicineData.endDate))
          setHasEndDate(true)
        }
        
        // Set time - handle both single time and multiple times
        if (medicineData.time) {
          // Check if it's a multiple time string (contains comma)
          if (medicineData.time.includes(',')) {
            // Multiple times - parse each time
            const timeStrings = medicineData.time.split(', ')
            const times = timeStrings.map((timeStr: string) => {
              const timeParts = timeStr.split(':')
              const hour = parseInt(timeParts[0])
              const minuteParts = timeParts[1].split(' ')
              const minute = parseInt(minuteParts[0])
              const ampm = minuteParts[1]
              
              let hour24 = hour
              if (ampm === 'PM' && hour !== 12) hour24 += 12
              if (ampm === 'AM' && hour === 12) hour24 = 0
              
              const timeDate = new Date()
              timeDate.setHours(hour24, minute, 0, 0)
              return timeDate
            })
            setSelectedTimes(times)
            setHasSelectedTime(true)
            setFrequencyCount(times.length)
          } else {
            // Single time
            const timeParts = medicineData.time.split(':')
            const hour = parseInt(timeParts[0])
            const minuteParts = timeParts[1].split(' ')
            const minute = parseInt(minuteParts[0])
            const ampm = minuteParts[1]
            
            let hour24 = hour
            if (ampm === 'PM' && hour !== 12) hour24 += 12
            if (ampm === 'AM' && hour === 12) hour24 = 0
            
            const timeDate = new Date()
            timeDate.setHours(hour24, minute, 0, 0)
            setSelectedTime(timeDate)
            setHasSelectedTime(true)
            setFrequencyCount(1)
          }
        }
      } catch (error) {
        console.log('Error parsing medicine data:', error)
        Alert.alert('Error', 'Failed to load medicine data')
        router.back()
      }
    }
  }, [medicine])

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


  const handleUpdateMedicine = async () => {
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
    
    // Check if there are actual changes
    const originalMedicine = JSON.parse(decodeURIComponent(medicine as string))
    const hasChanges = 
      originalMedicine.medicineName !== medicineName.trim() ||
      originalMedicine.dosage !== dosage.trim() ||
      originalMedicine.medicineType !== medicineType.trim() ||
      originalMedicine.frequency !== frequency.trim() ||
      originalMedicine.duration !== duration.trim() ||
      originalMedicine.notes !== notes.trim() ||
      (originalMedicine.startDate || '') !== (hasStartDate ? formatDate(startDate) : '') ||
      (originalMedicine.endDate || '') !== (hasEndDate ? formatDate(endDate) : '') ||
      (originalMedicine.time || '') !== getTimesString()
    
    const updatedMedicine = {
      id: editingMedicineId,
      medicineName: medicineName.trim(),
      dosage: dosage.trim(),
      medicineType: medicineType.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
      startDate: hasStartDate ? formatDate(startDate) : '',
      endDate: hasEndDate ? formatDate(endDate) : '',
      time: getTimesString(),
      notes: notes.trim(),
      ...(hasChanges && {
        lastEditedDate: new Date().toISOString().split('T')[0],
        lastEditedChanges: ['Updated medicine details']
      })
    }

    try {
      const success = await updateMedicine(editingMedicineId!, updatedMedicine)
      
      if (success) {
        Alert.alert('Success', 'Medicine updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              router.back()
            }
          }
        ])
      } else {
        Alert.alert('Error', 'Failed to update medicine. Please try again.')
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating medicine.')
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name={"arrow-back" as any} size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Edit Medicine</Text>
              <Text style={styles.subtitle}>Update your medication details</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name={"create" as any} size={40} color="white" />
            </View>
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
            style={[styles.updateButton, isLoading && styles.disabledButton]} 
            onPress={handleUpdateMedicine}
            disabled={isLoading}
          >
            <Ionicons name={"checkmark" as any} size={20} color="white" />
            <Text style={styles.updateButtonText}>
              {isLoading ? 'Updating...' : 'Update Medicine'}
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
                          color={selectedTimes[index] !== undefined ? "white" : theme.colors.primary} 
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
                      <Ionicons name={"checkmark" as any} size={20} color={theme.colors.primary} />
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
                      <Ionicons name={"checkmark" as any} size={20} color={theme.colors.primary} />
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
                    <Ionicons name={"checkmark" as any} size={20} color={theme.colors.primary} />
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
                      <Ionicons name={"checkmark" as any} size={20} color={theme.colors.primary} />
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


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  titleContainer: {
    flex: 1,
  },
  headerIcon: {
    marginLeft: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textInverse,
    opacity: 0.9,
  },
  form: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    paddingLeft: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  inputIcon: {
    marginRight: theme.spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  notesWrapper: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  notesIcon: {
    marginBottom: theme.spacing.sm,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 0,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  dateButton: {
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
  dateText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  placeholderText: {
    color: theme.colors.textTertiary,
  },
  autoCalculatedText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.success,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
  timeButton: {
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
  timeText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  helpText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.info,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
  updateButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  disabledButton: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: theme.spacing.sm,
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
  dropdownText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  multipleTimesContainer: {
    marginTop: theme.spacing.sm,
  },
  timeChip: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeChipLabel: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    marginRight: theme.spacing.xs,
    opacity: 0.9,
  },
  timeChipText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  progressText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.warning,
    marginTop: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  multiTimeNotification: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.warningLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.warning,
    padding: theme.spacing.lg,
  },
  multiTimeNotificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiTimeNotificationText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  multiTimeNotificationTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#856404',
    marginBottom: 2,
  },
  multiTimeNotificationSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: '#856404',
  },
  setTimesButton: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.sm,
  },
  setTimesButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  timeButtonHighlight: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primaryLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
    ...theme.shadows.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  modalItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  searchContainer: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  noResultsText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  noResultsSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.lineHeight.md,
  },
  customMedicineButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
  },
  customMedicineButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  doseSelectorContainer: {
    padding: theme.spacing.lg,
  },
  doseSelectorSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  doseOption: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  doseOptionCompleted: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.successLight,
  },
  doseOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  doseOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doseIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  doseIconCompleted: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  doseOptionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  doseOptionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  doseOptionTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

