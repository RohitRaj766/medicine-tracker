import Colors from '@/constant/Colors'
import { getMedicines } from '@/service/Storage'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

interface Medicine {
  id: string
  medicineName: string
  dosage: string
  frequency: string
  duration?: string
  startDate?: string
  endDate?: string
  time?: string
  notes?: string
  createdAt: string
  consumedDates: string[]
  missedDates?: string[]
  lastEditedDate?: string
}

export default function MedicineList() {
  const router = useRouter()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    try {
      const savedMedicines = await getMedicines()
      setMedicines(savedMedicines)
    } catch (error) {
      console.log('Error loading medicines:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadMedicines()
    setRefreshing(false)
  }

  const handleEditMedicine = (medicine: Medicine) => {
    // Navigate to EditMedicine page with medicine data
    const medicineData = encodeURIComponent(JSON.stringify(medicine))
    router.push(`/EditMedicine?medicine=${medicineData}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusText = (medicine: Medicine) => {
    const today = new Date().toISOString().split('T')[0]
    const isTakenToday = medicine.consumedDates && medicine.consumedDates.includes(today)
    const isMissedToday = medicine.missedDates && medicine.missedDates.includes(today)
    
    if (isTakenToday) return 'Taken Today'
    if (isMissedToday) return 'Missed Today'
    return 'Pending'
  }

  const getStatusColor = (medicine: Medicine) => {
    const today = new Date().toISOString().split('T')[0]
    const isTakenToday = medicine.consumedDates && medicine.consumedDates.includes(today)
    const isMissedToday = medicine.missedDates && medicine.missedDates.includes(today)
    
    if (isTakenToday) return '#27ae60' // Green
    if (isMissedToday) return '#e74c3c' // Red
    return '#2c3e50' // Black
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading medicines...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name={"arrow-back" as any} size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>All Medicines</Text>
            <Text style={styles.subtitle}>Manage your medications</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/AddNew')}
          >
            <Ionicons name={"add" as any} size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name={"medical-outline" as any} size={80} color="#bdc3c7" />
            </View>
            <Text style={styles.emptyTitle}>No Medicines Added</Text>
            <Text style={styles.emptySubtitle}>
              Start tracking your medications by adding your first medicine
            </Text>
            <TouchableOpacity 
              style={styles.emptyAddButton}
              onPress={() => router.push('/(tabs)/AddNew')}
            >
              <Ionicons name={"add" as any} size={20} color="white" />
              <Text style={styles.emptyAddButtonText}>Add Your First Medicine</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.medicinesContainer}>
            {medicines.map(medicine => (
              <TouchableOpacity
                key={medicine.id}
                style={styles.medicineCard}
                onPress={() => handleEditMedicine(medicine)}
              >
                <View style={styles.medicineInfo}>
                  <View style={styles.medicineIcon}>
                    <Ionicons name={"medical" as any} size={32} color={Colors.PRIMARY} />
                  </View>
                  <View style={styles.medicineDetails}>
                    <Text style={styles.medicineName}>{medicine.medicineName}</Text>
                    
                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <Ionicons name={"fitness" as any} size={16} color="#666" />
                        <Text style={styles.detailLabel}>Dosage:</Text>
                        <Text style={styles.detailValue}>{medicine.dosage}</Text>
                      </View>
                    </View>

                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <Ionicons name={"time" as any} size={16} color="#666" />
                        <Text style={styles.detailLabel}>Frequency:</Text>
                        <Text style={styles.detailValue}>{medicine.frequency}</Text>
                      </View>
                    </View>

                    {medicine.duration && (
                      <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                          <Ionicons name={"calendar" as any} size={16} color="#666" />
                          <Text style={styles.detailLabel}>Duration:</Text>
                          <Text style={styles.detailValue}>{medicine.duration}</Text>
                        </View>
                      </View>
                    )}

                    {medicine.time && (
                      <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                          <Ionicons name={"alarm" as any} size={16} color="#666" />
                          <Text style={styles.detailLabel}>Time:</Text>
                          <Text style={styles.detailValue}>{medicine.time}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(medicine) }]}>
                      <Text style={styles.statusText}>{getStatusText(medicine)}</Text>
                    </View>
                    <Ionicons name={"chevron-forward" as any} size={20} color="#bdc3c7" />
                  </View>
                </View>

                <View style={styles.medicineFooter}>
                  <View style={styles.dateInfo}>
                    <View style={styles.dateRow}>
                      <Ionicons name={"add-circle" as any} size={14} color="#95a5a6" />
                      <Text style={styles.medicineDate}>
                        Created: {formatDate(medicine.createdAt)}
                      </Text>
                    </View>
                    
                    {medicine.startDate && (
                      <View style={styles.dateRow}>
                        <Ionicons name={"play-circle" as any} size={14} color="#27ae60" />
                        <Text style={styles.medicineDate}>
                          Started: {formatDate(medicine.startDate)}
                        </Text>
                      </View>
                    )}
                    
                    {medicine.endDate && (
                      <View style={styles.dateRow}>
                        <Ionicons name={"stop-circle" as any} size={14} color="#e74c3c" />
                        <Text style={styles.medicineDate}>
                          Until: {formatDate(medicine.endDate)}
                        </Text>
                      </View>
                    )}
                    
                    {medicine.lastEditedDate && (
                      <View style={styles.dateRow}>
                        <Ionicons name={"create" as any} size={14} color="#3498db" />
                        <Text style={styles.medicineEdited}>
                          Edited: {formatDate(medicine.lastEditedDate)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {medicine.notes && (
                    <View style={styles.notesContainer}>
                      <Ionicons name={"document-text" as any} size={14} color="#95a5a6" />
                      <Text style={styles.notesText} numberOfLines={2}>
                        {medicine.notes}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  titleContainer: {
    flex: 1,
  },
  addButton: {
    marginLeft: 15,
    padding: 5,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  emptyAddButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  medicinesContainer: {
    padding: 20,
  },
  medicineCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicineIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  detailsRow: {
    marginBottom: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 6,
    minWidth: 65,
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
  },
  statusContainer: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  medicineFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    paddingTop: 12,
  },
  dateInfo: {
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicineDate: {
    fontSize: 12,
    color: '#95a5a6',
    marginLeft: 6,
  },
  medicineEdited: {
    fontSize: 12,
    color: '#3498db',
    marginLeft: 6,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  notesText: {
    fontSize: 12,
    color: '#2c3e50',
    marginLeft: 6,
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 16,
  },
})
