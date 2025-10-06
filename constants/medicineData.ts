// Comprehensive Medicine Dictionary
export const MEDICINE_DICTIONARY = [
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

// Predefined dosage options
export const DOSAGE_OPTIONS = [
  '5mg', '10mg', '20mg', '25mg', '50mg', '100mg', '200mg', '250mg', '500mg', '1000mg',
  '0.5ml', '1ml', '2ml', '5ml', '10ml', '15ml', '20ml',
  '1 tablet', '2 tablets', '3 tablets', '1/2 tablet', '1/4 tablet',
  '1 capsule', '2 capsules', '3 capsules',
  '1 drop', '2 drops', '3 drops', '5 drops',
  '1 spoon', '1/2 spoon', '1 teaspoon', '1 tablespoon',
  'Custom'
]

// Medicine types
export const MEDICINE_TYPES = [
  'Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Cream', 'Ointment', 
  'Gel', 'Patch', 'Inhaler', 'Powder', 'Liquid', 'Spray', 'Suppository',
  'Eye Drops', 'Ear Drops', 'Nasal Spray', 'Other'
]

// Frequency options
export const FREQUENCY_OPTIONS = [
  'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
  'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'Every 24 hours',
  'As needed', 'Weekly', 'Monthly'
]

// Duration units
export const DURATION_UNITS = [
  'days', 'weeks', 'months', 'years'
]

// Medicine status types
export const MEDICINE_STATUS = {
  TAKEN: 'taken',
  MISSED: 'missed',
  PENDING: 'pending',
  EDITED: 'edited'
} as const

export type MedicineStatus = typeof MEDICINE_STATUS[keyof typeof MEDICINE_STATUS]

// Frequency to count mapping
export const FREQUENCY_COUNT_MAP: Record<string, number> = {
  'once daily': 1,
  'once a day': 1,
  'twice daily': 2,
  'two times daily': 2,
  'three times daily': 3,
  'thrice daily': 3,
  'four times daily': 4,
  'every 6 hours': 4,
  'every 8 hours': 3,
  'every 12 hours': 2,
  'every 24 hours': 1,
  'as needed': 1,
  'weekly': 1,
  'monthly': 1
}

// Default form values
export const DEFAULT_MEDICINE_FORM = {
  medicineName: '',
  dosage: '',
  medicineType: '',
  frequency: '',
  duration: '',
  startDate: new Date(),
  endDate: new Date(),
  notes: '',
  selectedTime: new Date(),
  selectedTimes: []
}

// Validation rules
export const VALIDATION_RULES = {
  medicineName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  dosage: {
    required: true,
    maxLength: 50
  },
  medicineType: {
    required: true
  },
  frequency: {
    required: true
  },
  duration: {
    required: true,
    pattern: /^\d+\s*(days?|weeks?|months?|years?)?$/i
  },
  startDate: {
    required: true
  },
  endDate: {
    required: true
  },
  notes: {
    maxLength: 500
  }
}

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  INVALID_DURATION: 'Please enter a valid duration (e.g., 7 days)',
  START_DATE_REQUIRED: 'Start date is required',
  END_DATE_REQUIRED: 'End date is required',
  END_DATE_BEFORE_START: 'End date must be after start date',
  MEDICINE_ALREADY_EXISTS: 'This medicine is already added',
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNKNOWN_ERROR: 'An unknown error occurred'
}

// Success messages
export const SUCCESS_MESSAGES = {
  MEDICINE_ADDED: 'Medicine added successfully!',
  MEDICINE_UPDATED: 'Medicine updated successfully!',
  MEDICINE_DELETED: 'Medicine deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!'
}
