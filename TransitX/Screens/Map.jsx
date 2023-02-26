import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker
image="https://freepngdownload.com/image/bus-png.png"          coordinate={location}
          title={'Current Location'}
          description={'This is my current location'}
        />

<Marker
          coordinate={location}
          title={'Current Location'}
          description={'This is my current location'}
        />
      </MapView>
      <Text style={{backgroundColor:"black",color:"white",padding:5}}>Your Bus is at</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    width: '100%',
    height: '75%',
  },
});

export default MapScreen;
