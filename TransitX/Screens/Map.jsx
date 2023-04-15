import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";

const MapScreen = () => {
  const mapViewRef = useRef(null);

  const [region, setRegion] = useState({
    latitude: 10.7874,
    longitude: 76.6548,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [location, setLocation] = useState({
    latitude: 10.7874,
    longitude: 76.6548,
  });

 
  useEffect(() => {
    const interval = setInterval(() => {
      // Update the region state with the bus's new position
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: prevRegion.latitude + 0.001,
        longitude: prevRegion.longitude + 0.001,
      }));

      // Animate the map to the new region
      mapViewRef.current.animateToRegion(region);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  
  //   </MapView>
  // </View>

  // );
  return "hi"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  map: {
    width: "100%",
    height: "90%",
  },
});

export default MapScreen;
