import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Picker } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../supabase";

const BusTrackingScreen = ({navigation}) => {
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

  const [BusLocation, setBusLocation] = useState({ latitude: 10.8544341, longitude: 76.4428138 });

  useEffect(() => {
    const fetchbus = async () => {
      try {
        await supabase
          .from("user_locations")
          .select("*")
          .eq("user_id", 1)
          .then((res) => {
            setBusLocation({ latitiude: res.lat, longitude: res.long });
          });
      } catch (err){console.log(err)}
    };
  }, []);

  // useEffect(() => {
  //   const fetchUserLocations = async () => {
  //     try {
  //       const interval = setInterval(async () => {
  //         // Fetch user locations from the 'user_locations' table
  //         let { data: user_locations, error } = await supabase
  //           .from("user_locations")
  //           .select("*")
  //           .eq("user_id", 1);

  //         if (error) {
  //           // console.log(error);
  //           setError(error.message);
  //         } else {
  //           // Update the user locations state
  //           console.log("_________", user_locations[0].lat);

  //           setBusLocation({
  //             latitude: user_locations[0]?.lat,
  //             longitude: user_locations[0].long,
  //           });

  //           // console.log(typeof user_locations);
  //         }
  //       }, 10000); // Fetch every 10 seconds

  //       // Clean up the interval when the component unmounts
  //       return () => {
  //         clearInterval(interval);
  //       };
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   fetchUserLocations();
  // }, []);

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
        <Text style={styles.busLocationTitle}>Current Location:{" NSS College of Engineering, near railway road"} </Text>
       
        <TouchableOpacity style={styles.viewScheduleButton}>
          <Text style={styles.viewScheduleButtonText}>View Bus Schedule</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: BusLocation?.latitude,
          longitude: BusLocation?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={busLocations[selectedBus]} />
      </MapView>
      <TouchableOpacity style={styles.trackButton}>
        <Text style={styles.trackButtonText} onPress={()=>navigation.navigate("Maps")}>Tap to Track</Text>
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
  busSelectorWrapper: {
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
  nextBus: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    backgroundColor: "white",
    width: 150,
    padding: 5,
    borderRadius: 10,
  },
  nextBusTime: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",

    width: 150,
    padding: 5,
    borderRadius: 10,
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
