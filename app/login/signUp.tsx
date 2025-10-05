import { Auth } from '@/config/FirebaseConfig';
import Colors from '@/constant/Colors';
import { setLocalStorage } from '@/service/Storage';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

export default function signUp() {
    const router = useRouter()


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const OnCreateAccount = async () => {
        try {
            if(!name || !email || !password){
                ToastAndroid.show( 'Please fill all details', ToastAndroid.BOTTOM)
                Alert.alert("Please fill all details")
                return
            }
            const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
            const user = userCredential.user;
            await updateProfile(user,{
                displayName:name
            })
            console.log(user)
            // Store only the necessary user details as a string
          await setLocalStorage('userDetails', user)    
            router.push("/(tabs)")
        } catch (error: any) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // Show error to user or handle accordingly
           console.log(errorCode, errorMessage)
           if(errorCode=='auth/email-already-in-use'){
            ToastAndroid.show( 'Email already in use', ToastAndroid.BOTTOM)
            Alert.alert("Email already in use")
        }

        }
    }
  return (
    <View style={styles?.container}>
    <Text style={styles?.textArea}>Create New Account</Text>

    <View style={styles?.inputContainer0}>
      <Text style={styles?.inputLable}> Full Name </Text>
       <TextInput placeholder='enter your name ' style={styles?.textinput} value={name} onChangeText={setName} />
  </View>

  <View style={styles?.inputContainer1}>
      <Text style={styles?.inputLable}> Email </Text>
      <TextInput placeholder='jhondoe@gmail.com' style={styles?.textinput} value={email} onChangeText={setEmail} />
  </View>

  <View style={styles?.inputContainer2} >
      <Text style={styles?.inputLable}> Password </Text>
      <TextInput placeholder='enter your password' style={styles?.textinput} secureTextEntry={true} value={password} onChangeText={setPassword} />
     
      <TouchableOpacity style={styles?.loginButton} onPress={OnCreateAccount}>
          <Text style={styles?.loginButtonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles?.createButton} onPress={() => router.push('/login/signIn')}>
          <Text style={styles?.createButtonText}>Login</Text>
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
    inputContainer0:{
        padding:20,
        paddingTop:0,
        marginTop:-20,
    },
    
    inputContainer1:{
        padding:20,
        paddingTop:0,
        marginTop:-20,
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