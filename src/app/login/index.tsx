import { Image } from 'expo-image'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { theme } from '../../styles/theme' 

export default function LoginScreen() {
  const router = useRouter()
  const { colors, spacing, typography, borderRadius } = theme

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('./../../assets/images/login.png')}
          style={styles.image}
        />
      </View>

      <View style={[styles.textContainer, { backgroundColor: colors.primary }]}>
        <Text
          style={[
            styles.textArea,
            {
              color: colors.textInverse,
              fontSize: typography.fontSize.xxl,
            },
          ]}
        >
          Stay on Track, Stay Healthy!
        </Text>

        <Text
          style={[
            styles.textArea2,
            {
              color: colors.textInverse,
              fontSize: typography.fontSize.md,
              opacity: 0.9,
            },
          ]}
        >
          Track your meds, take control of your health. Stay consistent, stay
          confident.
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.cardBackground,
              borderRadius: borderRadius.full,
            },
          ]}
          onPress={() => router.push('/login/signIn')}
        >
          <Text
            style={[
              styles.textArea3,
              {
                color: colors.primary,
                fontSize: typography.fontSize.lg,
              },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.textArea4,
            {
              color: colors.textInverse,
              fontSize: typography.fontSize.xs,
            },
          ]}
        >
          Note: By clicking Continue, you agree to our Terms and Conditions.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: 250,
    height: 450,
    borderRadius: 23,
  },
  textContainer: {
    padding: 25,
    height: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  textArea: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textArea2: {
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 15,
    marginTop: 30,
  },
  textArea3: {
    textAlign: 'center',
    fontWeight: '600',
  },
  textArea4: {
    textAlign: 'center',
    marginTop: 8,
  },
})