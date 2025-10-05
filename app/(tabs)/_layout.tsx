import React, { useEffect, useState } from 'react'
import { Tabs, useRouter } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@/config/FirebaseConfig';

export default function _layout() {
  
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  onAuthStateChanged(Auth, (user) => {
    if (user) {
      const uid = user.uid;
      setAuthenticated(true);
    } else {
      setAuthenticated(false)
      router?.push('/login')
    }
  })

  useEffect(()=>{
      if(authenticated==false){
        router?.push('/login')
      }

  },[authenticated])


  return (
    <Tabs screenOptions={{
        headerShown: false,
    }}>
    <Tabs.Screen name="index"
    options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
        <FontAwesome name="home" size={24} color={color} />
    )
    }}
    />
    <Tabs.Screen name="AddNew"
       options={{
        tabBarLabel: 'Add New',
        tabBarIcon: ({ color, size }) => (
        <FontAwesome name="plus-square" size={24} color={color} />
    )
    }}
    />
    <Tabs.Screen name="Profile"
       options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
        <FontAwesome name="user" size={24} color={color} />
    )
    }}
    />
    </Tabs>
  )
}