import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { authAPI } from '../../services/apiService'
import { setAuthToken } from '../../config/api'
import { setLocalStorage } from '../../services/Storage'
import theme from '../../styles/theme' // import your theme file

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSignIn = async () => {
    if (!email) {
      Alert.alert('Please enter your email')
      return
    }
    setLoading(true)
    try {
      const res = await authAPI.login({ email, password })
      const { token, user } = res.data.data
      await setAuthToken(token)
      await setLocalStorage('userDetails', user)
      router.replace('/(tabs)')
    } catch (e: any) {
      Alert.alert('Login failed', e?.response?.data?.message || 'Please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[theme.styles.container, styles.container]}>
      <Text style={[theme.styles.heading3, styles.textArea]}>Let's Sign In</Text>

      <View style={styles.inputContainer}>
        <Text style={theme.styles.label}>Email</Text>
        <TextInput
          placeholder="jhondoe@gmail.com"
          placeholderTextColor={theme.colors.textSecondary}
          style={[theme.styles.input, styles.textInput]}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={theme.styles.label}>Password</Text>
        <TextInput
          placeholder="enter your password"
          placeholderTextColor={theme.colors.textSecondary}
          style={[theme.styles.input, styles.textInput]}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[theme.styles.button, styles.loginButton]}
          onPress={onSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.textInverse} />
          ) : (
            <Text style={[theme.styles.body, styles.loginButtonText]}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[theme.styles.button, theme.styles.buttonSecondary, styles.createButton]}
          onPress={() => router.push('/login/signUp')}
        >
          <Text style={[theme.styles.body, styles.createButtonText]}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.xl,
  },
  textArea: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  textInput: {
    marginTop: theme.spacing.sm,
  },
  loginButton: {
    marginTop: theme.spacing.xl,
  },
  loginButtonText: {
    color: theme.colors.textInverse,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
  createButton: {
    marginTop: theme.spacing.lg,
  },
  createButtonText: {
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
})
