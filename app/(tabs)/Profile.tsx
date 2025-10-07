// External libraries
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Internal modules
import { Auth } from '@/config/FirebaseConfig'
import { useMedicines, useMedicineStats } from '@/hooks'
import { clearLocalStorage, getLocalStorage } from '@/service/Storage'
import { theme, colors, spacing, shadows } from '@/styles/theme'
import { User } from '@/types'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const { medicines, isLoading } = useMedicines()
  const stats = useMedicineStats()

  useEffect(() => {
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    try {
      const userInfo = await getLocalStorage('userDetails')
      setUser(userInfo)
    } catch (error) {
      console.log('Error getting user details:', error)
    }
  }

  // Calculate today's specific stats
  const getTodaysStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const takenToday = medicines.filter(med => 
      med.consumedDates?.includes(today)
    ).length
    const missedToday = medicines.filter(med => 
      med.missedDates?.includes(today)
    ).length
    const activeMedicines = medicines.filter(med => 
      (!med.endDate || new Date(med.endDate) >= new Date()) &&
      (!med.startDate || new Date(med.startDate) <= new Date())
    ).length

    return {
      takenToday,
      missedToday,
      activeMedicines,
      totalMedicines: medicines.length
    }
  }

  const todaysStats = getTodaysStats()

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    )
  }

  const performLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(Auth)
      
      // Clear local storage
      await clearLocalStorage()
      
      // Redirect to login
      router.replace('/login')
    } catch (error) {
      console.log('Logout error:', error)
      Alert.alert('Error', 'Failed to logout. Please try again.')
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Modern Header with Gradient-like Effect */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name={"person" as any} size={40} color={colors.primary} />
              </View>
              <View style={styles.statusIndicator} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.displayName || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.userStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.successLight }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name={"checkmark-circle" as any} size={24} color={colors.success} />
            </View>
            <Text style={styles.statNumber}>{todaysStats.takenToday}</Text>
            <Text style={styles.statLabel}>Taken Today</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.errorLight }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name={"close-circle" as any} size={24} color={colors.error} />
            </View>
            <Text style={styles.statNumber}>{todaysStats.missedToday}</Text>
            <Text style={styles.statLabel}>Missed Today</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.infoLight }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name={"medical" as any} size={24} color={colors.info} />
            </View>
            <Text style={styles.statNumber}>{todaysStats.activeMedicines}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name={"list" as any} size={24} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>{todaysStats.totalMedicines}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Lifetime Metrics */}
      <View style={styles.lifetimeContainer}>
        <Text style={styles.sectionTitle}>Lifetime Metrics</Text>
        <View style={styles.lifetimeGrid}>
          <View style={[styles.lifetimeCard, { backgroundColor: colors.successLight }]}>
            <View style={styles.lifetimeIconContainer}>
              <Ionicons name={"trophy" as any} size={28} color={colors.success} />
            </View>
            <Text style={styles.lifetimeNumber}>{stats.totalTaken}</Text>
            <Text style={styles.lifetimeLabel}>Total Taken</Text>
            <Text style={styles.lifetimeSubtext}>All time</Text>
          </View>
          
          <View style={[styles.lifetimeCard, { backgroundColor: colors.warningLight }]}>
            <View style={styles.lifetimeIconContainer}>
              <Ionicons name={"analytics" as any} size={28} color={colors.warning} />
            </View>
            <Text style={styles.lifetimeNumber}>{Math.round(stats.complianceRate)}%</Text>
            <Text style={styles.lifetimeLabel}>Compliance</Text>
            <Text style={styles.lifetimeSubtext}>Success rate</Text>
          </View>
        </View>
        
        <View style={styles.lifetimeGrid}>
          <View style={[styles.lifetimeCard, { backgroundColor: colors.infoLight }]}>
            <View style={styles.lifetimeIconContainer}>
              <Ionicons name={"calendar" as any} size={28} color={colors.info} />
            </View>
            <Text style={styles.lifetimeNumber}>{stats.totalDaysTracked}</Text>
            <Text style={styles.lifetimeLabel}>Days Tracked</Text>
            <Text style={styles.lifetimeSubtext}>Total active days</Text>
          </View>
          
          <View style={[styles.lifetimeCard, { backgroundColor: colors.primaryLight }]}>
            <View style={styles.lifetimeIconContainer}>
              <Ionicons name={"flame" as any} size={28} color={colors.primary} />
            </View>
            <Text style={styles.lifetimeNumber}>{stats.longestStreak}</Text>
            <Text style={styles.lifetimeLabel}>Best Streak</Text>
            <Text style={styles.lifetimeSubtext}>Longest run</Text>
          </View>
        </View>

        {/* Current Streak Card - Full Width */}
        <View style={styles.currentStreakContainer}>
          <View style={[styles.currentStreakCard, { backgroundColor: stats.currentStreak > 0 ? colors.successLight : colors.surface }]}>
            <View style={styles.currentStreakContent}>
              <View style={styles.currentStreakLeft}>
                <View style={styles.currentStreakIconContainer}>
                  <Ionicons 
                    name={stats.currentStreak > 0 ? "flame" as any : "flame-outline" as any} 
                    size={32} 
                    color={stats.currentStreak > 0 ? colors.success : colors.textTertiary} 
                  />
                </View>
                <View style={styles.currentStreakInfo}>
                  <Text style={styles.currentStreakTitle}>
                    {stats.currentStreak > 0 ? 'Current Streak' : 'No Active Streak'}
                  </Text>
                  <Text style={styles.currentStreakSubtitle}>
                    {stats.currentStreak > 0 
                      ? `Keep it going! ${stats.currentStreak} day${stats.currentStreak > 1 ? 's' : ''} strong`
                      : 'Take your medicine to start a new streak'
                    }
                  </Text>
                </View>
              </View>
              <View style={styles.currentStreakRight}>
                <Text style={[styles.currentStreakNumber, { color: stats.currentStreak > 0 ? colors.success : colors.textTertiary }]}>
                  {stats.currentStreak}
                </Text>
                <Text style={[styles.currentStreakUnit, { color: stats.currentStreak > 0 ? colors.success : colors.textTertiary }]}>
                  days
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/AddNew')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name={"add-circle" as any} size={32} color={colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Add Medicine</Text>
            <Text style={styles.actionSubtitle}>Track new medication</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/MedicineList')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name={"list-circle" as any} size={32} color={colors.secondary} />
            </View>
            <Text style={styles.actionTitle}>Manage All</Text>
            <Text style={styles.actionSubtitle}>View & edit medicines</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings & Account */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Account & Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.infoLight }]}>
              <Ionicons name={"person-circle" as any} size={24} color={colors.info} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Profile Settings</Text>
              <Text style={styles.settingSubtitle}>Update your information</Text>
            </View>
          </View>
          <Ionicons name={"chevron-forward" as any} size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.successLight }]}>
              <Ionicons name={"notifications" as any} size={24} color={colors.success} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>Manage reminders</Text>
            </View>
          </View>
          <Ionicons name={"chevron-forward" as any} size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.warningLight }]}>
              <Ionicons name={"help-circle" as any} size={24} color={colors.warning} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingSubtitle}>Get assistance</Text>
            </View>
          </View>
          <Ionicons name={"chevron-forward" as any} size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Logout Section */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutIconContainer}>
            <Ionicons name={"log-out" as any} size={24} color="white" />
          </View>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadows.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.textInverse,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.textInverse,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.md,
    color: colors.textInverse,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.textInverse,
    opacity: 0.9,
  },
  statsContainer: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.textInverse,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  statIconContainer: {
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.semibold,
  },
  lifetimeContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  lifetimeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  lifetimeCard: {
    width: '48%',
    backgroundColor: colors.textInverse,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  lifetimeIconContainer: {
    marginBottom: spacing.sm,
  },
  lifetimeNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lifetimeLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.text,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 2,
  },
  lifetimeSubtext: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  currentStreakContainer: {
    marginTop: spacing.sm,
  },
  currentStreakCard: {
    backgroundColor: colors.textInverse,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  currentStreakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentStreakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currentStreakIconContainer: {
    marginRight: spacing.md,
  },
  currentStreakInfo: {
    flex: 1,
  },
  currentStreakTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  currentStreakSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  currentStreakRight: {
    alignItems: 'center',
  },
  currentStreakNumber: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 2,
  },
  currentStreakUnit: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  actionsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.textInverse,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionIconContainer: {
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  settingsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  settingItem: {
    backgroundColor: colors.textInverse,
    borderRadius: theme.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: colors.textSecondary,
  },
  logoutContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: theme.borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  logoutIconContainer: {
    marginRight: spacing.sm,
  },
  logoutButtonText: {
    color: colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
})