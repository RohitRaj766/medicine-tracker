// src/app/(tabs)/_layout.tsx  (or wherever your tabs layout is)
import  { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import { getLocalStorage } from '../../services/Storage';

export default function TabsLayout() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const userInfo = await getLocalStorage('userDetails');
      if (!userInfo) {
        router.replace('/login');
      }
    })();
  }, []);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="AddNew"
        options={{
          tabBarLabel: 'Add New',
          tabBarIcon: ({ color }) => <FontAwesome name="plus-square" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
