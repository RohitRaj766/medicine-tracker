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
import { getMedicines } from '../services/Storage'
import { theme, colors, spacing, shadows } from '../styles/theme'

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
    const medicineData = encodeURIComponent(JSON.stringify(medicine))
    router.push(`/EditMedicine?medicine=${medicineData}`)
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const getStatusText = (medicine: Medicine) => {
    const today = new Date().toISOString().split('T')[0]
    const isTakenToday = medicine.consumedDates?.includes(today)
    const isMissedToday = medicine.missedDates?.includes(today)

    if (isTakenToday) return 'Taken Today'
    if (isMissedToday) return 'Missed Today'
    return 'Pending'
  }

  const getStatusColor = (medicine: Medicine) => {
    const today = new Date().toISOString().split('T')[0]
    const isTakenToday = medicine.consumedDates?.includes(today)
    const isMissedToday = medicine.missedDates?.includes(today)

    if (isTakenToday) return colors.success
    if (isMissedToday) return colors.error
    return colors.text
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
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textInverse} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>All Medicines</Text>
            <Text style={styles.subtitle}>Manage your medications</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/AddNew')}
          >
            <Ionicons name="add" size={24} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>

      {/* MEDICINE LIST */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={80} color={colors.border} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No Medicines Added</Text>
            <Text style={styles.emptySubtitle}>
              Start tracking your medications by adding your first medicine
            </Text>
            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={() => router.push('/(tabs)/AddNew')}
            >
              <Ionicons name="add" size={20} color={colors.textInverse} />
              <Text style={styles.emptyAddButtonText}>Add Your First Medicine</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.medicinesContainer}>
            {medicines.map((medicine) => (
              <TouchableOpacity
                key={medicine.id}
                style={styles.medicineCard}
                onPress={() => handleEditMedicine(medicine)}
              >
                <View style={styles.medicineInfo}>
                  <View style={styles.medicineIcon}>
                    <Ionicons name="medical" size={32} color={colors.primary} />
                  </View>

                  <View style={styles.medicineDetails}>
                    <Text style={styles.medicineName}>{medicine.medicineName}</Text>

                    <View style={styles.detailsRow}>
                      <Ionicons name="fitness" size={16} color={colors.muted} />
                      <Text style={styles.detailLabel}>Dosage:</Text>
                      <Text style={styles.detailValue}>{medicine.dosage}</Text>
                    </View>

                    <View style={styles.detailsRow}>
                      <Ionicons name="time" size={16} color={colors.muted} />
                      <Text style={styles.detailLabel}>Frequency:</Text>
                      <Text style={styles.detailValue}>{medicine.frequency}</Text>
                    </View>

                    {medicine.duration && (
                      <View style={styles.detailsRow}>
                        <Ionicons name="calendar" size={16} color={colors.muted} />
                        <Text style={styles.detailLabel}>Duration:</Text>
                        <Text style={styles.detailValue}>{medicine.duration}</Text>
                      </View>
                    )}

                    {medicine.time && (
                      <View style={styles.detailsRow}>
                        <Ionicons name="alarm" size={16} color={colors.muted} />
                        <Text style={styles.detailLabel}>Time:</Text>
                        <Text style={styles.detailValue}>{medicine.time}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(medicine) }]}>
                      <Text style={styles.statusText}>{getStatusText(medicine)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                  </View>
                </View>

                <View style={styles.medicineFooter}>
                  <View style={styles.dateRow}>
                    <Ionicons name="add-circle" size={14} color={colors.muted} />
                    <Text style={styles.medicineDate}>Created: {formatDate(medicine.createdAt)}</Text>
                  </View>

                  {medicine.startDate && (
                    <View style={styles.dateRow}>
                      <Ionicons name="play-circle" size={14} color={colors.success} />
                      <Text style={styles.medicineDate}>Started: {formatDate(medicine.startDate)}</Text>
                    </View>
                  )}

                  {medicine.endDate && (
                    <View style={styles.dateRow}>
                      <Ionicons name="stop-circle" size={14} color={colors.error} />
                      <Text style={styles.medicineDate}>Until: {formatDate(medicine.endDate)}</Text>
                    </View>
                  )}

                  {medicine.lastEditedDate && (
                    <View style={styles.dateRow}>
                      <Ionicons name="create" size={14} color={colors.info} />
                      <Text style={styles.medicineEdited}>
                        Edited: {formatDate(medicine.lastEditedDate)}
                      </Text>
                    </View>
                  )}

                  {medicine.notes && (
                    <View style={styles.notesContainer}>
                      <Ionicons name="document-text" size={14} color={colors.muted} />
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
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: 50,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    ...shadows.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  titleContainer: {
    flex: 1,
  },
  addButton: {
    marginLeft: spacing.md,
    padding: spacing.xs,
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
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    color: colors.muted,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    marginTop: spacing.xxl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  emptyAddButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...shadows.md,
  },
  emptyAddButtonText: {
    color: colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: spacing.xs,
  },
  medicinesContainer: {
    padding: spacing.lg,
  },
  medicineCard: {
    backgroundColor: colors.cardBackground || '#fff',
    borderRadius: theme.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  medicineIcon: {
    marginRight: spacing.md,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.muted,
    fontWeight: theme.typography.fontWeight.semibold,
    marginHorizontal: spacing.xs,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: spacing.xs,
  },
  statusText: {
    color: colors.textInverse,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  medicineFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  medicineDate: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.muted,
    marginLeft: spacing.xs,
  },
  medicineEdited: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.info,
    marginLeft: spacing.xs,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
    marginTop: spacing.sm,
  },
  notesText: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text,
    marginLeft: spacing.xs,
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 16,
  },
})
