import Colors from '@/constant/Colors'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Auth } from '@/config/FirebaseConfig'

export default function SignIn() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const OnSignInClick=()=>{

        if(!email || !password){
            Alert.alert("Please fill all details")
            return

        }
        signInWithEmailAndPassword(Auth,email,password).then((useCredential)=>{
            const user = useCredential.user
            console.log("Users ::: ", user)
            router.replace("/(tabs)")
        }).catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            if(error=='auth/invalid-credential'){

                console.log(errorCode, errorMessage)
                Alert.alert("Invalid email or password")
            }
        })
    }
  return (
    <View style={styles?.container}>
      <Text style={styles?.textArea}>Let's Sing In</Text>

    <View style={styles?.inputContainer}>
        <Text style={styles?.inputLable}> Email </Text>
        <TextInput placeholder='jhondoe@gmail.com' style={styles?.textinput} onChangeText={(text)=>{setEmail(text)}}/>
    </View>

    <View style={styles?.inputContainer2} >
        <Text style={styles?.inputLable}> Password </Text>
        <TextInput placeholder='enter your password' style={styles?.textinput} secureTextEntry={true} onChangeText={(text)=>{setPassword(text)}}/>
        <TouchableOpacity style={styles?.loginButton} onPress={OnSignInClick}>
            <Text style={styles?.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles?.createButton} onPress={() => router.push('/login/signUp')}>
            <Text style={styles?.createButtonText}>Create Account</Text>
        </TouchableOpacity>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        marginTop:40,
    },
    textArea:{
        fontSize:24,
        fontWeight:'bold',
        color: 'black',
        textAlign:'center',
        marginTop:20,
        marginBottom:20,
    },
    inputContainer:{
        padding:20,
        paddingTop:0,
    },
    inputContainer2:{
        padding:20,
        paddingTop:0,
        marginTop:-20,
    },
    inputLable:{
      fontSize:16,
      color: 'black',
      marginTop:20,
    },

   textinput:{
        marginTop:10,
        padding:10,
        borderWidth:1,
        borderColor: Colors.Gray,
        borderRadius:10,
        width:'100%',
        height:40,
        color: Colors.Gray,
        backgroundColor:'white',
       },
       loginButton:{
        backgroundColor:Colors.PRIMARY,
        padding:15,
        marginTop:30,
        borderRadius:5,
       },
       loginButtonText:{
        color:'white',
        textAlign:'center',
        fontSize:16,
       },
       createButton:{
        backgroundColor:'white',
        padding:15,
        marginTop:30,
        borderRadius:5,
        borderWidth:1,
        borderColor:Colors.PRIMARY,
       },
       createButtonText:{
        color:Colors.PRIMARY,
        textAlign:'center',
        fontSize:16,
       },
})