import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import UserCard from "./Component/StudentCard.jsx";

export default function StudentLoginScreen() {
  const [firstName, setFirstName] = useState("Adarsh");
  const [lastName, setLastName] = useState("Gupta");
  const [department, setDepartment] = useState("CSE");
  const [year, setYear] = useState("3");
  const [email, setEmail] = useState("20bxxx@nssce.ac.in")

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

  const handleSubmit = () => {
    // handle the submission of the form
    console.log("Form submitted!");
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
    backgroundColor: "#2196f3",
  },
  buttonContent: {
    height: 50,
  },
});
