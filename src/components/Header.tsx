import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getLocalStorage } from '../services/Storage'
import theme from '../styles/theme'

export default function Header() {
  const [user, setUser] = useState<any>()

  useEffect(() => {
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    const userInfo = await getLocalStorage('userDetails')
    console.log("userInfo ::: ", userInfo)
    setUser(userInfo)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getUserInitials = () => {
    const name = user?.displayName || user?.email || 'User'
    return name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getUserInitials()}</Text>
              </View>
            )}
            <View style={styles.onlineIndicator} />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {user?.displayName || user?.email || 'User'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <View style={styles.notificationButton}>
            <Ionicons name={'notifications' as any} size={22} color={theme.colors.textSecondary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>

          <View style={styles.settingsButton}>
            <Ionicons name={'settings' as any} size={22} color={theme.colors.textSecondary} />
          </View>
        </View>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Ionicons name={'medical' as any} size={16} color={theme.colors.success} />
          </View>
          <Text style={styles.statusText}>Healthy</Text>
        </View>

        <View style={styles.statusDivider} />

        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Ionicons name={'time' as any} size={16} color={theme.colors.info} />
          </View>
          <Text style={styles.statusText}>On Track</Text>
        </View>

        <View style={styles.statusDivider} />

        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Ionicons name={'calendar' as any} size={16} color={theme.colors.error} />
          </View>
          <Text style={styles.statusText}>2 Reminders</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.round,
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  avatarText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: 2,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  notificationButton: {
    position: 'relative',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.round,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
  badgeText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  settingsButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  statusDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
})
