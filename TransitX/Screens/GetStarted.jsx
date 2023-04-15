import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper";

const GetStarted = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/TRansitx.png")} style={styles.image} />
      <Text style={styles.title}>Why Worried?</Text>
      <Text style={styles.slogan}>
        Get to your destination with ease with just a matter of clicks .
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      >
        <Button style={styles.buttonText} mode="contained">Get Started</Button>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  slogan: {
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 32,
  },
  button: {
    // backgroundColor: "purple",
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding:5
  },
  image: {
    width: 400,
    height: 400,
  },
});

export default GetStarted;
