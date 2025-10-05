import { Image } from 'expo-image'
import React from 'react'
import { View,Text,TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native'
import Colors from '@/constant/Colors'
import { useRouter } from 'expo-router'

export default function LoginScreen() {

    const router = useRouter()

  return (
    <View>
     <View style={styles?.container}>
        <Image source={require('./../../assets/images/login.png')} 
        style={styles?.image}
        />
        
     </View>

     <View style={styles?.textContainer}>
        <Text style={styles?.textArea}> Stay on Track, Stay healthy!</Text>
        <Text style={styles?.textArea2}>Track your meds, take control of your health. stay consitent, stay confident</Text>
        <TouchableOpacity style={styles?.Button} onPress={() => router.push('/login/signIn')}>
                <Text style={styles?.textArea3}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles?.textArea4}>
            Note: By Clicking Continue button, you will agree our terms and conditions.
        </Text>
     </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:40
    },
    image:{
        width:250,
        height:450,
        borderRadius:23,
    },
    textContainer:{
        padding:25,
        backgroundColor:Colors.PRIMARY,
        height:'100%',
    },
    textArea:{
        fontSize:30,
        fontWeight:'bold',
        color:'white',
        textAlign:'center'
    },
    textArea2:{
        fontSize:17,
        color:'white',
        textAlign:'center',
        marginTop:20
    },
    Button:{
        backgroundColor:'white',
        padding:15,
        borderRadius:99,
        marginTop:30,
    },
    textArea3:{
        fontSize:16,
        color: Colors.PRIMARY,
        textAlign:'center',
    },
    textArea4:{
        fontSize:10,
        color: 'white',
        textAlign:'center',
        marginTop:4
    },
})