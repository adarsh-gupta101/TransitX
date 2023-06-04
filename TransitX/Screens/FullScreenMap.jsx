import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Button } from "react-native-paper";
import { supabase } from "../supabase";
import * as Location from "expo-location";
import axios from "axios";

// const busLocations = {
//   "Bus 1": {
//     id: "123456",
//     driverName: "John Doe",
//     driverImage:
//       "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
//     cleanerName: "Jane Doe",
//     cleanerImage:
//       "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
//     path: [
//       { latitude: 10.7867, longitude: 76.6548 },
//       { latitude: 10.7961, longitude: 76.6433 },
//       { latitude: 10.8062, longitude: 76.6302 },
//       { latitude: 10.8184, longitude: 76.6168 },
//       { latitude: 10.8277, longitude: 76.6077 },
//     ],
//   },
//   "Bus 2": {
//     id: "654321",
//     driverName: "Jane Smith",
//     driverImage:
//       "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
//     cleanerName: "John Smith",
//     cleanerImage:
//       "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
//     path: [
//       { latitude: 10.7867, longitude: 76.6548 },
//       { latitude: 10.7895, longitude: 76.6665 },
//       { latitude: 10.7905, longitude: 76.6803 },
//       { latitude: 10.7903, longitude: 76.6939 },
//       { latitude: 10.7917, longitude: 76.7067 },
//     ],
//   },
// };

const FullScreenMap = () => {
  const [selectedBus, setSelectedBus] = useState("Bus 1");
  const [latitude, setLatitude] = useState(10.7874);
  const [BusLongitude, setBusLongitude] = useState(null);
  const [BusLatitude, setBusLatitude] = useState(null);
  const [mapType, setMapType] = useState("standard");
  // const [startingLocation, SetstartingLocation] = useState({
  //   latitude:10.7867303,longitude:76.6547932
  // });
  // const [endingLocation, SetendingLocation] = useState({
  //   latitude: 10.8240189,
  //   longitude: 76.64259679999999,
  // });

  const [startingLocation, setstartingLocation] = useState("");
  const [endingLocation, setEndingLocation] = useState("null");
  const [routeCoordinates, setRouteCoordinates] = useState([]);

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

  const [Mylocation, setMyLocation] = useState({});

  const interval = async () => {
    // if (!location) return;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    const { coords } = await Location.getCurrentPositionAsync({});
    setMyLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  

  async function fetchData() {
    try {
      //  get whole data from user_location table

      const { data: user_locations, error } = await supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", 1);
      // console.log(user_locations)
      setBusLatitude(user_locations[0].lat);
      setBusLongitude(user_locations[0].long);
      console.log(BusLatitude, BusLongitude, "<<<");
    } catch (error) {
      console.error(error);
    }
  }

  // setInterval(() => fetchData(), 100000);

  const handleBusSelect = (value) => {
    setSelectedBus(value);
  };

  const bus = busLocations[selectedBus];

  useEffect(() => {
    // Fetch the starting and ending coordinates here
    const startingAddress = "Palakkad"; // Replace with the starting address
    const endingAddress = "NSS College of engineering"; // Replace with the ending address

    getCoordinates(startingAddress)
      .then((startingCoordinates) => {
        setstartingLocation(startingCoordinates);
        return getCoordinates(endingAddress);
      })
      .then((endingCoordinates) => {
        setEndingLocation(endingCoordinates);
        return getRouteCoordinates(startingCoordinates, endingCoordinates);
      })
      .then((coordinates) => {
        setRouteCoordinates(coordinates);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  async function getCoordinates(address) {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: address,
            key: "AIzaSyDThYz", // Replace with your Google Maps API key
          },
        }
      );

      if (response.data.status === "OK") {
        const result = response.data.results[0];
        const { lat, lng } = result.geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error("Geocoding API request failed");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      throw error;
    }
  }

  async function getRouteCoordinates(startingCoordinates, endingCoordinates) {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/directions/json",
        {
          params: {
            origin: `${startingCoordinates.latitude},${startingCoordinates.longitude}`,
            destination: `${endingCoordinates.latitude},${endingCoordinates.longitude}`,
            key: "AIzaSyDThYz-", // Replace with your Google Maps API key
          },
        }
      );

      if (response.data.status === "OK") {
        const route = response.data.routes[0];
        const coordinates = route.overview_polyline.points;
        return decodePolyline(coordinates);
      } else {
        throw new Error("Directions API request failed");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      throw error;
    }
  }

  function decodePolyline(polyline) {
    const points = [];
    let index = 0,
      latitude = 0,
      longitude = 0;

    while (index < polyline.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      latitude += dlat;

      shift = 0;
      result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      longitude += dlng;

      points.push({
        latitude: latitude / 1e5,
        longitude: longitude / 1e5,
      });
    }
    return points;
  }

  const driverContact = `Driver: ${bus.driverName}\nID: ${bus.id}\nPhone: 1234567890`;
  const cleanerContact = `Cleaner: ${bus.cleanerName}\nID: ${bus.id}\nPhone: 1234567890`;

  return (
    <View style={styles.container}>
      {/* <MapView
        style={styles.map}
        mapType={mapType}
        // mapType="standard"
        initialRegion={{
          latitude: BusLatitude || 10.7867,
          longitude: BusLongitude || 76.6548,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.00421,
        }}
      >
        <Polyline coordinates={bus.path} strokeWidth={5} strokeColor="red" />

        <Marker
          coordinate={{
            latitude: BusLatitude || 10.7867,
            longitude: BusLongitude || 76.6548,
          }}
          title={bus.driverName}
          description={bus.id}
          // image={bus.driverImage}
        />
        <Marker
          // coordinate={bus.path[0]}
          coordinate={{
            latitude: BusLatitude || 10.7867,
            longitude: BusLongitude || 76.6548,
          }}
          title={bus.driverName}
          description={bus.id}
          // image={bus.driverImage}
        />
      </MapView> */}

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: startingLocation?.latitude,
          longitude: startingLocation?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marker for the starting location */}
        <Marker
          coordinate={{
            latitude: startingLocation?.latitude,
            longitude: startingLocation?.longitude,
          }}
          title="Starting Location"
          description="This is the starting location"
        />

        {/* Marker for the ending location */}
        <Marker
          coordinate={{
            latitude: endingLocation?.latitude,
            longitude: endingLocation?.longitude,
          }}
          title="Ending Location"
          description="This is the ending location"
        />

        {/* Polyline between the starting and ending locations */}
        <Polyline
          coordinates={[
            {
              latitude: startingLocation?.latitude,
              longitude: startingLocation?.longitude,
            },
            {
              latitude: endingLocation?.latitude,
              longitude: endingLocation?.longitude,
            },
          ]}
          strokeWidth={3}
          strokeColor="blue"
        />
      </MapView>

      {/* <MapView
  style={styles.map}
  mapType={mapType}
  initialRegion={{
    latitude: BusLatitude || 10.7867,
    longitude: BusLongitude || 76.6548,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.00421,
  }}
>
  <Polyline coordinates={bus.path} strokeWidth={5} strokeColor="hotpink" />

  {Mylocation.latitude && Mylocation.longitude && (
    <Marker
      coordinate={Mylocation}
      title="My Location"
      description="This is my location"
      // image={require("path to image")}
    />
  )}

  {BusLatitude && BusLongitude && (
    <Marker
      coordinate={{ latitude: BusLatitude, longitude: BusLongitude }}
      title={bus.driverName}
      description={bus.id}
      // image={"https://www.pngmart.com/files/22/User-Avatar-Profile-PNG.png"}
      style={{ width: 50, height: 50 }}
    >
      <Image
        source={{
          uri: "https://www.transparentpng.com/thumb/school-bus/real-chauffeur-school-bus-free-transparent--rVkA4z.png",
        }}
        style={{ width: 50, height: 50 }}
      />
      </Marker>
  )}
</MapView> */}

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
      <View>
        <TouchableOpacity
          onPress={() => setMapType("hybrid")}
          style={styles.selectMap}
        >
          <Button mode="contained" style={styles.MapSelectorContainer}>
            Hybrid
          </Button>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMapType("standard")}
          style={styles.selectMap}
        >
          <Button mode="contained" style={styles.MapSelectorContainer}>
            Standard
          </Button>
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
  selectMap: {
    width: "45%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  MapSelectorContainer: {
    color: "white",
    width: "85%",
    margin: 25,
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
    width: "90%",
    borderRadius: 20,
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
