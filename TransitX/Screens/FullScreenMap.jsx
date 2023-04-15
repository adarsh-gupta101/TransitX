import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Button } from "react-native-paper";
// import CustomButton from "./CustomButton";

const busLocations = {
  "Bus 1": {
    id: "123456",
    driverName: "John Doe",
    driverImage:
      "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
    cleanerName: "Jane Doe",
    cleanerImage:
      "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
    path: [
      { latitude: 10.7867, longitude: 76.6548 },
      { latitude: 10.7961, longitude: 76.6433 },
      { latitude: 10.8062, longitude: 76.6302 },
      { latitude: 10.8184, longitude: 76.6168 },
      { latitude: 10.8277, longitude: 76.6077 },
    ],
  },
  "Bus 2": {
    id: "654321",
    driverName: "Jane Smith",
    driverImage:
      "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
    cleanerName: "John Smith",
    cleanerImage:
      "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
    path: [
      { latitude: 10.7867, longitude: 76.6548 },
      { latitude: 10.7895, longitude: 76.6665 },
      { latitude: 10.7905, longitude: 76.6803 },
      { latitude: 10.7903, longitude: 76.6939 },
      { latitude: 10.7917, longitude: 76.7067 },
    ],
  },
};

const FullScreenMap = () => {
  const [selectedBus, setSelectedBus] = useState("Bus 1");
  const [latitude, setLatitude] = useState(10.7874);
  const [mapType, setMapType] = useState("standard");
  const [busLocations, setBusLocations] = useState({
    "Bus 1": {
      id: "123456",
      driverName: "John Doe",
      driverImage:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      cleanerName: "Jane Doe",
      cleanerImage:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      path: [
        { latitude: 10.7867, longitude: 76.6548 },
        { latitude: 10.7961, longitude: 76.6433 },
        { latitude: 10.8062, longitude: 76.6302 },
        { latitude: 10.8184, longitude: 76.6168 },
        { latitude: 10.8277, longitude: 76.6077 },
      ],
    },
    "Bus 2": {
      id: "654321",
      driverName: "Jane Smith",
      driverImage:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      cleanerName: "John Smith",
      cleanerImage:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      path: [
        { latitude: 10.7867, longitude: 76.6548 },
        { latitude: 10.7895, longitude: 76.6665 },
        { latitude: 10.7905, longitude: 76.6803 },
        { latitude: 10.7903, longitude: 76.6939 },
        { latitude: 10.7917, longitude: 76.7067 },
      ],
    },
  });

  const handleBusSelect = (value) => {
    setSelectedBus(value);
  };

  const bus = busLocations[selectedBus];

  const driverContact = `Driver: ${bus.driverName}\nID: ${bus.id}\nPhone: 1234567890`;
  const cleanerContact = `Cleaner: ${bus.cleanerName}\nID: ${bus.id}\nPhone: 1234567890`;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType={mapType}
        // mapType="standard"
        initialRegion={{
          latitude: 10.7867,
          longitude: 76.6548,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.00421,
        }}
      >
        <Polyline
          coordinates={bus.path}
          strokeWidth={5}
          strokeColor="hotpink"
        />

        <Marker
          coordinate={bus.path[bus.path.length - 1]}
          title={bus.driverName}
          description={bus.id}
          // image={bus.driverImage}
        />
        <Marker
          coordinate={bus.path[0]}
          title={bus.driverName}
          description={bus.id}
          // image={bus.driverImage}
        />
      </MapView>
      <View style={styles.contactsContainer}>
        <View style={styles.contact}>
          <Image source={bus.driverImage} style={styles.contactImage} />
          <Text style={styles.contactText}>{driverContact}</Text>
        </View>
        {/* <View style={styles.contact}>
          <Image source={bus.cleanerImage} style={styles.contactImage} />
          <Text style={styles.contactText}>{cleanerContact}</Text>
        </View> */}
      </View>
      <View >
        <TouchableOpacity onPress={()=>setMapType("hybrid")} style={styles.selectMap}>
          <Button mode="contained" style={styles.MapSelectorContainer} >Hybrid</Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setMapType("standard")} style={styles.selectMap}>
          <Button mode="contained" style={styles.MapSelectorContainer} >Standard</Button>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  selectMap:{
    width:"45%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  MapSelectorContainer: {
    color: "white",
    width: "85%",
    margin:25
  },
  contactsContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contact: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00c89b",

    padding: 10,
    width:"90%"
,    borderRadius: 20,
  },
  contactImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  contactText: {
    fontSize: 12,
    color: "white",
  },
  busSelectorContainer: {
    position: "absolute",
    top: 100,
    right: 20,
    flexDirection: "row",
  },
});

export default FullScreenMap;
