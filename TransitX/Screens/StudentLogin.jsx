import React, { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import {Button} from "react-native-paper"
import { TextInput,  } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import UserCard from "./Component/StudentCard.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase.js";

export default function StudentLoginScreen({navigation}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [year, setYear] = useState("3");
  const [email, setEmail] = useState("");
  const [ID, setID] = useState()




  useEffect(() => {
    AsyncStorage.getItem("userData").then((res) => {
      const data = JSON.parse(res);
      setFirstName(data.name);
      setEmail(data.email);
      console.log(data);
      setID(data.id);
    });
  }, []);

  const handleFirstNameChange = (text) => {
    setFirstName(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleLastNameChange = (text) => {
    setLastName(text);
  };

  const handleDepartmentChange = (text) => {
    setDepartment(text);
  };

  const handleYearChange = (text) => {
    setYear(text);
  };

  const handleSubmit = async () => {
    // handle the submission of the form
    if(!ID){return alert("Please wait for the data to load")}
    alert("Your data has been submitted");
    
    await supabase.from("students").upsert([
      {
        id: ID, // Provide the ID of the record you want to update, or leave it empty to create a new record
        name: firstName,
        email: email,
        year: year,
        branch: department,
        college: "NSS",
      },
    ]).then((res) => {console.log(res);    alert("Your data has been submitted");
  }).catch((err) => {console.log(err)});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <UserCard
        firstName={firstName}
        lastName={lastName}
        department={department}
        branch={year}
      />
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="person"
          size={24}
          color="#757575"
          style={styles.icon}
        />
        <TextInput
          label="First Name"
          value={firstName}
          mode="outlined"
          onChangeText={handleFirstNameChange}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="person"
          size={24}
          color="#757575"
          style={styles.icon}
        />
        <TextInput
          label="Last Name"
          value={lastName}
          mode="outlined"
          onChangeText={handleLastNameChange}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="school"
          size={24}
          color="#757575"
          style={styles.icon}
        />
        <TextInput
          label="Department"
          value={department}
          mode="outlined"
          onChangeText={handleDepartmentChange}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="calendar-today"
          size={24}
          color="#757575"
          style={styles.icon}
        />
        <TextInput
          label="Year"
          value={year}
          mode="outlined"
          // condition only between 1 and 4

          maxLength={1}
          keyboardType="numeric"
          onChangeText={handleYearChange}
          style={styles.input}
        />
      </View>

      {/* university email */}
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="email"
          size={24}
          color="#757575"
          style={styles.icon}
        />
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          onChangeText={handleEmailChange}
          style={styles.input}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Submit
      </Button>

      {/* logout */}
      {/* <View style={styles.inputContainer}> */}
      
        <Button
          mode="contained"

          onPress={() => {
            AsyncStorage.removeItem("userData").then((res) => {
              console.log(res);
              navigation.navigate("SignUp");
            });
          }}
          style={styles.button}
          contentStyle={styles.buttonContent}
        > 
          Logout
        </Button>
      {/* </View> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    width: "80%",
    // backgroundColor: "#2196f3",
  },
  buttonContent: {
    height: 50,
  },
});
