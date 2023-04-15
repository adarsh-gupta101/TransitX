import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import bus from "../assets/buslogo.png";
import { Button } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
  const [selectedRoute, setSelectedRoute] = useState("Bus 1");
  const routes = ["Bus 1", "Bus 2", "Bus 3"];

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const BusIcon = ({ route, isSelected }) => (
    <View style={[styles.busIcon, isSelected && styles.selectedBusIcon]}>
      <MaterialCommunityIcons name="bus" size={48} color="white" />
      <Text style={styles.routeText}>{route}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* User Avatar  */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("StudentLogin")}>
          <Image
            style={styles.avatar}
            source={require("../assets/avatar.png")}
          />
        </TouchableOpacity>
      </View>

      <Image source={require("../assets/buslogo.png")} style={styles.image} />
      <View styles={styles.textWrap}>
        <Text style={styles.SelectBus}>Select Your Bus</Text>
        <Text style={styles.SelectBusdesc}>
          By Selecting your bus you can see the route of your bus and you will
          get daily updates about your bus location.
        </Text>
        <Text style={styles.SelectBusdesc}>
          Note: You can change your route any time
        </Text>
      </View>

      <View style={styles.busContainer}>
        {routes.map((route) => (
          <TouchableOpacity
            key={route}
            style={styles.busButton}
            onPress={() => handleRouteSelect(route)}
          >
            <BusIcon route={route} isSelected={selectedRoute === route} />
          </TouchableOpacity>
        ))}
      </View>
      {selectedRoute && (
        <View style={styles.routeContainer}>
          <Text style={styles.routeTitle}>{selectedRoute} Route</Text>
          <Text style={styles.routeDescription}>
            Palakkad - Shekeripuram - pudperiyaram - Victoria college road -
            Mercy college road - Olavakkod - Thanav -Railiway Colony - Railway
            Hospital - Ummini - NSS College
          </Text>
          <TouchableOpacity style={styles.continueButton}>
            <Button style={styles.buttonText} mode="contained">Continue</Button>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  avatarContainer: {
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  busContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  SelectBusdesc: {
    textAlign: "center",
    padding: 10,
    fontWeight: "Medium",
  },
  busButton: {
    flex: 1,
    marginRight: 10,
  },
  busIcon: {
    backgroundColor: "#4cc9f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    color: "yellow",
    borderRadius: 10,
  },
  selectedBusIcon: {
    backgroundColor: "black",
  },
  routeText: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
  },
  routeContainer: {
    alignItems: "center",
  },
  SelectBus: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
  },
  routeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  routeDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 25,
    color: "gray",
  },
  continueButton: {
    // backgroundColor: "#7209b7",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 40,
    borderRadius: 10,
    marginBottom: 25,
    width: "95%",
  },
  buttonText: {
    // color: "white",
    fontWeight: "bold",
    // fontSize: 16,
    padding:5,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 100,
    alignSelf: "center",
    borderRadius: 100,
  },
});

export default HomeScreen;

// This demo is using a external compiler that will only work in Expo Snacks.
// You may see flashes of unstyled content, this will not occur under normal use!
// Please see the documentation to setup your application
// export default withExpoSnack(Home);
