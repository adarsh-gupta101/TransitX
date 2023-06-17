import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { supabase } from "../supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Toast, { BaseToast } from "react-native-toast-message";

// this is the line that needs to be added

// WebBrowser.maybeCompleteAuthSession();

function SignInSignUp({ navigation }) {
  // navigation.navigate("Map")
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const showToast = (type, message, m2) => {
    Toast.show({
      type: type,
      text1: message,
      text2: m2, text1NumberOfLines: 2, // Increase the number of lines for the title part
      text2NumberOfLines: 5, // Increase the number of lines for the error message part
  

      shadow: true,
      animation: true,
      hideOnPress: true,
    });
  };

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      androidClientId:
        "727706260584-h3s098mc46tee9gmo84enkclkb0rf5m6.apps.googleusercontent.com",
      expoClientId:
        "727706260584-4o24f5v2jlurcrk2pn2bg7i1bhjime8e.apps.googleusercontent.com",
      // redirectUriOptions: { useProxy: true},
    },
    {
      projectNameForProxy: "adarsh_gupta/TransitX",

      useProxy: true,
    }
  );

  // console.log( response);
  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
      console.error(error);
    }
  };

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
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

      const data12 = await supabase.auth
        .signUp({
          email: email,
          password: password,
        })
        .then((res) => {
          console.log(res);
          if(res.error!=null){
            showToast("error", res.error.message, res.error.message);
            return
          }
          supabase
            .from("users")
            .upsert([
              {
                name: firstName + " " + lastName,
                email: res.data.user.email,
                role: "student",
                id: res.data.user.id,
              },
            ])
            .then((res) => {
              console.log("res", res);
              if (res.error != null) {
                const errorMessage = res.error.details.match(/[^:]*$/)[0];
               
                showToast("error", errorMessage, null);
                return;
              }
              showToast(
                "success",
                "Account Created Successfully",
                "Please Login to Continue and We have send you a confirmation link"
              );
                setIsSignUp(false);

            });
        })
        .catch((err) => console.error("err", err));
      console.log("data12", data12);

      // const { data, error } = await supabase.from("users").upsert([
      //   {
      //     name: data12.user.name,
      //     email: data12.user.email,
      //     password: password,
      //     role: "student",
      //   },
      // ]);

      // if (error) {
      //   console.error(error);
      //   return;
      // }

      // console.log("User data saved:", data);

      // setIsSignUp(false);
      // Navigate to the home screen or perform any other actions
      // navigation.navigate("HomeScreen");
    } catch (error) {
      // Handle any other errors
      console.error(error);
    }
  };

  const handleSignIn = async () => {
    try {
      // const { data, error } = await supabase
      //   .from("users")
      //   .select()
      //   .eq("email", email)
      //   .eq("password", password)
      //   .single();

      // if (error) {
      //   console.error(error);
      //   return;
      // }

      // if (data) {
      //   console.log("User signed in:", data);
      //   try {
      //     await AsyncStorage.setItem("userData", JSON.stringify(data));
      //   } catch (err) {
      //     console.log(err);
      //   }
      //   // Redirect the user to the home screen or perform any other actions
      //   // navigation.navigate("HomeScreen");
      // } else {
      //   console.log("Invalid email or password");
      // }

      await supabase.auth
        .signInWithPassword({
          email: email,
          password: password,
        })
        .then(async (res) => {
          // console.log(res.data.user);

          await supabase
            .from("users")
            .select("*")
            .eq("id", res.data.user.id)
            .then(async (res) => {
              console.log(res.data[0]);
              showToast("success", "Login Successfull", "Welcome Back");

              await AsyncStorage.setItem(
                "userData",
                JSON.stringify(res.data[0])
              ).then(()=>{
                navigation.navigate("HomeScreen");
              });
            });
        });
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
      <View style={{ zIndex: 50 }}>
        <Toast
          config={BaseToast({ text1NumberOfLines: 5, text2NumberOfLines: 5 })}
        />
      </View>

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

      {userInfo === null ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          mode="contained"
          onPress={() => {
            promptAsync({ useProxy: false, showInRecents: true });
          }}
        >
          Sign in with Google
        </Button>
      ) : (
        <Text style={styles.text}>{"test"}</Text>
      )}
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
