import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

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

  //   useEffect(() => {
  //     // Simulate changing location every 3 seconds
  //     const interval = setInterval(() => {
  //       setLocation({
  //         latitude: location.latitude + 0.0005,
  //         longitude: location.longitude + 0.0005,
  //       });
  //     }, 500);

  //     return () => clearInterval(interval);
  //   }, [location]);
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

  return (
    <View style={styles.container}>
    <MapView
      ref={mapViewRef}
      style={styles.map}
      initialRegion={region}
    >
      <Marker coordinate={region} />
      <Polyline
      strokeWidth={2}
      strokeColor="red"
        coordinates={[
          {   latitude: 10.7874,
            longitude: 76.6548},
          { latitude: 15.784, longitude: 76.6548 },
          
        ]}
      />
    </MapView>
  </View>

  );
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
