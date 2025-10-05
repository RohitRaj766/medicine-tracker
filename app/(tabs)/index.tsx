import { Redirect } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function HomeScreen() {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Redirect href={"/login"}/>
    </View>
  )
}