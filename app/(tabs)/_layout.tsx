import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

import { getLocalStorage } from '@/service/Storage';

export default function _layout() {
  
  const router = useRouter();

  useEffect(()=>{
    getUserDetails();
  },[])

  const getUserDetails = async () => {
    const userInfo = await getLocalStorage('userDetails');
    if(!userInfo){
      router.replace('/login')
    }
    return userInfo;
  }

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