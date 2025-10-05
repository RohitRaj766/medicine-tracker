import { Button } from '@react-navigation/elements'
import { Redirect } from 'expo-router'
import { signOut } from 'firebase/auth'
import React from 'react'
import { Text, View } from 'react-native'
import { Auth } from '@/config/FirebaseConfig'

export default function HomeScreen() {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button onPress={() => signOut(Auth)}>Sign Out</Button>
    </View>
  )
}