import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Picker } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BusTrackingScreen = () => {
  const [selectedBus, setSelectedBus] = useState("Bus 1");
  const busLocations = {
    "Bus 1": {
      latitude: 37.78825,
      longitude: -122.4324,
    },
    "Bus 2": {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    "Bus 3": {
      latitude: 37.7895,
      longitude: -122.4063,
    },
  };

  const BusIcon = ({ route, isSelected }) => (
    <View style={[styles.busIcon, isSelected && styles.selectedBusIcon]}>
      <MaterialCommunityIcons name="bus" size={50} color="white" />
      <Text style={styles.routeText}>{route}</Text>
    </View>
  );

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
  };

  return (
    <View style={styles.container}>
      <View style={styles.busSelectorWrapper}>
        <View style={styles.busSelectorContainer}>
          <BusIcon isSelected={true} />
          <Text style={styles.busSelectorTitle}>Bus 1</Text>

        </View>
        <Text style={styles.nextBus}>Next bus time</Text>
        <Text style={styles.nextBusTime}>Bus 2: 08:20 AM</Text>
        <Text style={styles.nextBusTime}>Bus 3: 08:30 AM</Text>



      </View>
      <View style={styles.busLocationContainer}>
        <Text style={styles.busLocationTitle}>Current Location:</Text>
        <Text style={styles.busLocationCoordinates}>
          {busLocations[selectedBus].latitude.toFixed(4)},
          {busLocations[selectedBus].longitude.toFixed(4)}
        </Text>
        <TouchableOpacity style={styles.viewScheduleButton}>
          <Text style={styles.viewScheduleButtonText}>View Bus Schedule</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: busLocations[selectedBus].latitude,
          longitude: busLocations[selectedBus].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={busLocations[selectedBus]} />
      </MapView>
      <TouchableOpacity style={styles.trackButton}>
        <Text style={styles.trackButtonText}>Tap to Track</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  busSelectorWrapper:{
    backgroundColor: "#2292A4",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    color: "white",

  },

  busSelectorContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 15,
    width: "100%",
    backgroundColor: "#2292A4",
  },
  busSelectorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  nextBus:{

    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    backgroundColor:"white",
    width:150,
    padding:5,
    borderRadius:10,

  },
  nextBusTime:{
    color:"white",
    fontSize: 18,
    fontWeight: "bold",
   
    width:150,
    padding:5,
    borderRadius:10,
    
  },
  busSelector: {
    flex: 1,
  },
  busLocationContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  busLocationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  busLocationCoordinates: {
    fontSize: 16,
    marginBottom: 20,
  },
  viewScheduleButton: {
    backgroundColor: "#0B5563",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  viewScheduleButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    width: 300,
    textAlign: "center",
  },
  map: {
    flex: 1,
  },
  trackButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    width: 200,
    paddingVertical: 10,
    borderRadius: 10,
    position: "absolute",
    bottom: 40,
    // left: 20,
    right: 40,
    alignItems: "center",
  },
  trackButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  busIcon: {
    // alignItems: "center",
    // justifyContent: "center",
    padding: 0,
    borderRadius: 0,
  },
  selectedBusIcon: {
    // backgroundColor: "white",
  },
});

export default BusTrackingScreen;
