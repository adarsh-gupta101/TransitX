import React from 'react'
import {  View } from 'react-native'
import { TextInput,Button } from 'react-native-paper'

function SignUp() {
  return (
    <View style={{marginTop:125}}>

<TextInput mode="outlined" style={{padding:5,margin:15}} placeholder="Full Name"></TextInput>
<TextInput mode="outlined" style={{padding:5,margin:15}} placeholder="Student ID"></TextInput>
<TextInput mode="outlined" style={{padding:5,margin:15}} placeholder="Email"></TextInput>
<TextInput mode="outlined" style={{padding:5,margin:15}}       secureTextEntry
 placeholder="Password"></TextInput>
<Button style={{padding:5,margin:15}} icon="security" mode="contained" onPress={() => console.log('Sign In')}>
Sign Up  </Button>    
    </View>
  )
}

export default SignUp
