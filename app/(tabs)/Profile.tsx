import { Auth } from '@/config/FirebaseConfig'
import Colors from '@/constant/Colors'
import { clearLocalStorage, getLocalStorage, getMedicines } from '@/service/Storage'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [medicines, setMedicines] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalMedicines: 0,
    activeMedicines: 0,
    takenToday: 0,
    missedToday: 0,
    // Lifetime metrics
    totalTakenCount: 0,
    totalMissedCount: 0,
    totalDaysTracked: 0,
    complianceRate: 0,
    longestStreak: 0,
    currentStreak: 0
  })

  useEffect(() => {
    getUserDetails()
    loadMedicines()
  }, [])

  const getUserDetails = async () => {
    try {
      const userInfo = await getLocalStorage('userDetails')
      setUser(userInfo)
    } catch (error) {
      console.log('Error getting user details:', error)
    }
  }

  const loadMedicines = async () => {
    try {
      const savedMedicines = await getMedicines()
      setMedicines(savedMedicines)
      calculateStats(savedMedicines)
    } catch (error) {
      console.log('Error loading medicines:', error)
    }
  }

  const calculateStats = (medicines: any[]) => {
    const today = new Date().toISOString().split('T')[0]
    const total = medicines.length
    const active = medicines.filter(med => 
      (!med.endDate || new Date(med.endDate) >= new Date()) &&
      (!med.startDate || new Date(med.startDate) <= new Date())
    ).length
    const taken = medicines.filter(med => 
      med.consumedDates && med.consumedDates.includes(today)
    ).length
    const missed = medicines.filter(med => 
      med.missedDates && med.missedDates.includes(today)
    ).length

    // Calculate lifetime metrics
    const totalTakenCount = medicines.reduce((sum, med) => 
      sum + (med.consumedDates ? med.consumedDates.length : 0), 0
    )
    const totalMissedCount = medicines.reduce((sum, med) => 
      sum + (med.missedDates ? med.missedDates.length : 0), 0
    )

    // Calculate total days tracked
    const allDates = new Set<string>()
    medicines.forEach(med => {
      if (med.consumedDates) med.consumedDates.forEach((date: string) => allDates.add(date))
      if (med.missedDates) med.missedDates.forEach((date: string) => allDates.add(date))
    })
    const totalDaysTracked = allDates.size

    // Calculate compliance rate
    const totalActions = totalTakenCount + totalMissedCount
    const complianceRate = totalActions > 0 ? Math.round((totalTakenCount / totalActions) * 100) : 0

    // Calculate streaks (simplified - based on consecutive days with any medicine taken)
    const { longestStreak, currentStreak } = calculateStreaks(medicines)

    setStats({ 
      totalMedicines: total, 
      activeMedicines: active, 
      takenToday: taken, 
      missedToday: missed,
      totalTakenCount,
      totalMissedCount,
      totalDaysTracked,
      complianceRate,
      longestStreak,
      currentStreak
    })
  }

  const calculateStreaks = (medicines: any[]) => {
    // Get all unique dates when any medicine was taken
    const allTakenDates = new Set<string>()
    medicines.forEach(med => {
      if (med.consumedDates) {
        med.consumedDates.forEach((date: string) => allTakenDates.add(date))
      }
    })

    // Sort dates
    const sortedDates = Array.from(allTakenDates).sort()
    
    if (sortedDates.length === 0) return { longestStreak: 0, currentStreak: 0 }

    let longestStreak = 1
    let currentStreak = 1
    let tempStreak = 1

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffTime = currDate.getTime() - prevDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }

    // Calculate current streak (from most recent date)
    const today = new Date()
    const mostRecentDate = new Date(sortedDates[sortedDates.length - 1])
    const daysSinceLastTaken = Math.ceil((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceLastTaken <= 1) {
      // Calculate current streak backwards from most recent date
      currentStreak = 1
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const prevDate = new Date(sortedDates[i])
        const currDate = new Date(sortedDates[i + 1])
        const diffTime = currDate.getTime() - prevDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          currentStreak++
        } else {
          break
        }
      }
    } else {
      currentStreak = 0
    }

    return { longestStreak, currentStreak }
  }

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
                <Ionicons name={"person" as any} size={40} color={Colors.PRIMARY} />
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
          <View style={[styles.statCard, { backgroundColor: '#e8f5e8' }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name={"checkmark-circle" as any} size={24} color="#27ae60" />
            </View>
            <Text style={styles.statNumber}>{stats.takenToday}</Text>
            <Text style={styles.statLabel}>Taken Today</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#ffeaea' }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name={"close-circle" as any} size={24} color="#e74c3c" />
            </View>
            <Text style={styles.statNumber}>{stats.missedToday}</Text>
            <Text style={styles.statLabel}>Missed Today</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name={"medical" as any} size={24} color="#2196f3" />
            </View>
            <Text style={styles.statNumber}>{stats.activeMedicines}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#f3e5f5' }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name={"list" as any} size={24} color="#9c27b0" />
            </View>
            <Text style={styles.statNumber}>{stats.totalMedicines}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Lifetime Metrics */}
      <View style={styles.lifetimeContainer}>
        <Text style={styles.sectionTitle}>Lifetime Metrics</Text>
        <View style={styles.lifetimeGrid}>
          <View style={[styles.lifetimeCard, { backgroundColor: '#e8f8f5' }]}>
            <View style={styles.lifetimeIconContainer}>
              <Ionicons name={"trophy" as any} size={28} color="#27ae60" />
            </View>
            <Text style={styles.lifetimeNumber}>{stats.totalTakenCount}</Text>
            <Text style={styles.lifetimeLabel}>Total Taken</Text>
            <Text style={styles.lifetimeSubtext}>All time</Text>
          </View>
          
          <View style={[styles.lifetimeCard, { backgroundColor: '#fef9e7' }]}>
            <View style={styles.lifetimeIconContainer}>
              <Ionicons name={"analytics" as any} size={28} color="#f39c12" />
            </View>
            <Text style={styles.lifetimeNumber}>{stats.complianceRate}%</Text>
            <Text style={styles.lifetimeLabel}>Compliance</Text>
            <Text style={styles.lifetimeSubtext}>Success rate</Text>
          </View>
        </View>
        
        <View style={styles.lifetimeGrid}>
          <View style={[styles.lifetimeCard, { backgroundColor: '#e3f2fd' }]}>
            <View style={styles.lifetimeIconContainer}>
              <Ionicons name={"calendar" as any} size={28} color="#2196f3" />
            </View>
            <Text style={styles.lifetimeNumber}>{stats.totalDaysTracked}</Text>
            <Text style={styles.lifetimeLabel}>Days Tracked</Text>
            <Text style={styles.lifetimeSubtext}>Total active days</Text>
          </View>
          
          <View style={[styles.lifetimeCard, { backgroundColor: '#f3e5f5' }]}>
            <View style={styles.lifetimeIconContainer}>
              <Ionicons name={"flame" as any} size={28} color="#e91e63" />
            </View>
            <Text style={styles.lifetimeNumber}>{stats.longestStreak}</Text>
            <Text style={styles.lifetimeLabel}>Best Streak</Text>
            <Text style={styles.lifetimeSubtext}>Longest run</Text>
          </View>
        </View>

        {/* Current Streak Card - Full Width */}
        <View style={styles.currentStreakContainer}>
          <View style={[styles.currentStreakCard, { backgroundColor: stats.currentStreak > 0 ? '#e8f5e8' : '#f5f5f5' }]}>
            <View style={styles.currentStreakContent}>
              <View style={styles.currentStreakLeft}>
                <View style={styles.currentStreakIconContainer}>
                  <Ionicons 
                    name={stats.currentStreak > 0 ? "flame" as any : "flame-outline" as any} 
                    size={32} 
                    color={stats.currentStreak > 0 ? "#27ae60" : "#bdc3c7"} 
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
                <Text style={[styles.currentStreakNumber, { color: stats.currentStreak > 0 ? "#27ae60" : "#bdc3c7" }]}>
                  {stats.currentStreak}
                </Text>
                <Text style={[styles.currentStreakUnit, { color: stats.currentStreak > 0 ? "#27ae60" : "#bdc3c7" }]}>
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
              <Ionicons name={"add-circle" as any} size={32} color={Colors.PRIMARY} />
            </View>
            <Text style={styles.actionTitle}>Add Medicine</Text>
            <Text style={styles.actionSubtitle}>Track new medication</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/MedicineList')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name={"list-circle" as any} size={32} color="#ff9800" />
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
            <View style={[styles.settingIcon, { backgroundColor: '#e3f2fd' }]}>
              <Ionicons name={"person-circle" as any} size={24} color="#2196f3" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Profile Settings</Text>
              <Text style={styles.settingSubtitle}>Update your information</Text>
            </View>
          </View>
          <Ionicons name={"chevron-forward" as any} size={20} color="#bdc3c7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: '#e8f5e8' }]}>
              <Ionicons name={"notifications" as any} size={24} color="#27ae60" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>Manage reminders</Text>
            </View>
          </View>
          <Ionicons name={"chevron-forward" as any} size={20} color="#bdc3c7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: '#fff3e0' }]}>
              <Ionicons name={"help-circle" as any} size={24} color="#ff9800" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingSubtitle}>Get assistance</Text>
            </View>
          </View>
          <Ionicons name={"chevron-forward" as any} size={20} color="#bdc3c7" />
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: Colors.PRIMARY,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
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
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#27ae60',
    borderWidth: 3,
    borderColor: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27ae60',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '600',
  },
  lifetimeContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lifetimeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lifetimeCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lifetimeIconContainer: {
    marginBottom: 8,
  },
  lifetimeNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  lifetimeLabel: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  lifetimeSubtext: {
    fontSize: 10,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  currentStreakContainer: {
    marginTop: 8,
  },
  currentStreakCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginRight: 16,
  },
  currentStreakInfo: {
    flex: 1,
  },
  currentStreakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  currentStreakSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 16,
  },
  currentStreakRight: {
    alignItems: 'center',
  },
  currentStreakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  currentStreakUnit: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutIconContainer: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})