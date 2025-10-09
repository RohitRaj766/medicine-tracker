import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // for local storage

// Internal modules
import { useMedicines, useMedicineStats } from '../../hooks';
import { clearLocalStorage, getLocalStorage } from '../../services/Storage';
import { theme, colors, spacing, shadows, borderRadius } from '../../styles/theme';
import { User } from '../../types';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { medicines, isLoading } = useMedicines();
  const stats = useMedicineStats();

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userDetails');  // Fetch user details from AsyncStorage
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.log('Error getting user details:', error);
    }
  };

  // Calculate today's specific stats
  const getTodaysStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const takenToday = medicines.filter(med =>
      med.consumedDates?.includes(today)
    ).length;
    const missedToday = medicines.filter(med =>
      med.missedDates?.includes(today)
    ).length;
    const activeMedicines = medicines.filter(med =>
      (!med.endDate || new Date(med.endDate) >= new Date()) &&
      (!med.startDate || new Date(med.startDate) <= new Date())
    ).length;

    return {
      takenToday,
      missedToday,
      activeMedicines,
      totalMedicines: medicines.length
    };
  };

  const todaysStats = getTodaysStats();

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
    );
  };

  const performLogout = async () => {
    try {
      // Clear local storage
      await AsyncStorage.clear();

      // Redirect to login
      router.replace('/login');
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

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
                      ? `Keep it going! ${stats.currentStreak} day${stats.currentStreak > 1 ? 's' : ''}`
                      : 'Track your medicine daily to build a streak.'
                    }
                  </Text>
                </View>
              </View>
              <Text style={styles.currentStreakNumber}>{stats.currentStreak}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: spacing.xl,
    borderBottomRightRadius: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: colors.surface,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userInfo: {
    marginLeft: spacing.md,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textInverse,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: 12,
    color: colors.textInverse,
  },
  statsContainer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  statIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 24,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: spacing.sm,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lifetimeContainer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  lifetimeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  lifetimeCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  lifetimeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 24,
  },
  lifetimeNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: spacing.sm,
  },
  lifetimeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lifetimeSubtext: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  currentStreakContainer: {
    marginTop: spacing.lg,
  },
  currentStreakCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  currentStreakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  currentStreakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentStreakIconContainer: {
    marginRight: spacing.sm,
  },
  currentStreakInfo: {
    maxWidth: '75%',
  },
  currentStreakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  currentStreakSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  currentStreakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  logoutButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.error,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  logoutText: {
    fontSize: 16,
    color: colors.textInverse,
    fontWeight: '600',
  },
});
