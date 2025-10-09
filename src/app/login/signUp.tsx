import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authAPI } from '../../services/apiService';
import { setAuthToken } from '../../config/api';
import theme from '../../styles/theme'; // 👈 import your centralized theme

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreateAccount = async () => {
    if (!name || !email || !password) {
      ToastAndroid.show('Please fill all details', ToastAndroid.BOTTOM);
      Alert.alert('Please fill all details');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.register({ email, displayName: name, password });
      const { token } = res.data.data;
      await setAuthToken(token);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Sign up failed', error?.response?.data?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[theme.styles.container, { padding: theme.spacing.lg }]}>
      <Text style={[theme.styles.heading2, { textAlign: 'center', marginVertical: theme.spacing.lg }]}>
        Create New Account
      </Text>

      {/* Name */}
      <View style={styles.inputGroup}>
        <Text style={theme.styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          placeholderTextColor={theme.colors.textTertiary}
          style={theme.styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={theme.styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={theme.colors.textTertiary}
          style={theme.styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <Text style={theme.styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={theme.colors.textTertiary}
          style={theme.styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[theme.styles.button, loading && theme.styles.buttonDisabled]}
        onPress={onCreateAccount}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.textInverse} />
        ) : (
          <Text style={[theme.styles.body, { color: theme.colors.textInverse, fontWeight: '600' }]}>
            Create Account
          </Text>
        )}
      </TouchableOpacity>

      {/* Already have an account */}
      <TouchableOpacity
        style={[theme.styles.button, theme.styles.buttonSecondary, { marginTop: theme.spacing.md }]}
        onPress={() => router.push('/login/signIn')}
      >
        <Text style={[theme.styles.body, { color: theme.colors.primary, fontWeight: '600' }]}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
});
