import React, { useState ,useEffect} from "react";
import { View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { supabase } from "../supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';



function SignInSignUp({ navigation }) {

  // navigation.navigate("Map")
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          navigation.navigate("HomeScreen");
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserData();
  }, []);

  const handleSignUp = async () => {
    try {
      // Save the user data to the users table in Supabase
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name: firstName + lastName,
            email: email,
            password: password,
            role: "student",
          },
        ]);

      if (error) {
        console.error(error);
        return;
      }

      console.log("User data saved:", data);
      setIsSignUp(false)

      // Navigate to the home screen or perform any other actions
      // navigation.navigate("HomeScreen");
    } catch (error) {
      // Handle any other errors
      console.error(error);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .eq('password', password)
        .single();
  
      if (error) {
        console.error(error);
        return;
      }
  
      if (data) {
        console.log('User signed in:', data);
        try{

          await AsyncStorage.setItem('userData', JSON.stringify(data));
        }
        catch(err){
console.log(err)
        }
        // Redirect the user to the home screen or perform any other actions
        navigation.navigate("HomeScreen");
      } else {
        console.log('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/Journey.png")}
        style={{ width: 200, height: 200 }}
      />

      <View>
        <Text style={styles.header}>
          {isSignUp
            ? "Please Sign Up, If You Dont Have An Account"
            : "Please Sign In, If You Have An Account"}
        </Text>
        <Text style={styles.header_support}>
          Enter your registered college Email ID
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode={isSignUp ? "text" : "contained"}
          onPress={() => setIsSignUp(false)}
        >
          Sign In
        </Button>
        <Button
          style={styles.button}
          mode={isSignUp ? "contained" : "text"}
          onPress={() => setIsSignUp(true)}
        >
          Sign Up
        </Button>
      </View>
      {isSignUp ? (
        <>
          <TextInput
            mode="outlined"
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            mode="outlined"
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </>
      ) : null}
      <TextInput
        mode="outlined"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        mode="outlined"
        style={styles.input}
        secureTextEntry
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button
        style={styles.button}
        icon="security"
        mode="contained"
        onPress={isSignUp ? handleSignUp : handleSignIn}
        // onPressIn={()=>navigation.navigate("HomeScreen")}
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // marginHorizontal: 16,
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    // PaddingBottom:55
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  header_support: {
    fontSize: 14,
    textAlign: "center",
    color: "#757575",
  },
  button: {
    // flex: 1,
    width: "40%",
    padding: 5,

    marginHorizontal: 8,
    marginTop: 18,
    marginBottom: 50,
  },
  input: {
    padding: 5,
    marginVertical: 8,
    width: "100%",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
});

export default SignInSignUp;
