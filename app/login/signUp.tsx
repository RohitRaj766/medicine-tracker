import Colors from '@/constant/Colors'
import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'

export default function signUp() {
    const router = useRouter()
  return (
    <View style={styles?.container}>
    <Text style={styles?.textArea}>Create New Account</Text>

  <View style={styles?.inputContainer}>
      <Text style={styles?.inputLable}> Email </Text>
      <TextInput placeholder='jhondoe@gmail.com' style={styles?.textinput} />
  </View>

  <View style={styles?.inputContainer2} >
      <Text style={styles?.inputLable}> Password </Text>
      <TextInput placeholder='enter your password' style={styles?.textinput} secureTextEntry={true}/>
     
      <TouchableOpacity style={styles?.loginButton} >
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
        borderBlockColor:Colors.PRIMARY,
       },
       createButtonText:{
        color:Colors.PRIMARY,
        textAlign:'center',
        fontSize:16,
       },
})