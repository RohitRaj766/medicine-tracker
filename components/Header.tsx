import { getLocalStorage } from '@/service/Storage'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
export default function Header() {

    const [user,setUser]=useState<any>()

    useEffect(()=>{
        getUserDetails()
    },[])

    const getUserDetails=async()=>{
        const userInfo=await getLocalStorage('userDetails')
        console.log("userInfo ::: ", userInfo)
        setUser(userInfo)
    }

  return (
    <View>
      <View>
        <Image source={require('./../assets/images/smiley.png')}
        style={{
            width:45,
            height:45,
        }}
        />
        <Text>
          Hello  {user?.displayName || user?.email || 'User'}
        </Text>
      </View>
    </View>
  )
}