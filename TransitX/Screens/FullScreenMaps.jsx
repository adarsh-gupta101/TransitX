import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  Button,
  Avatar,
  Card,
  Text,
  TouchableRipple,
} from "react-native-paper";
import * as Location from "expo-location";
import BottomSheet from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../supabase"; // Replace './Supabase' with the correct path to your Supabase client file
import { ETA } from "../utils/utils";

const FullScreenMaps = () => {
  const [startingLocation, setStartingLocation] = useState({
    latitude: 10.7668,
    longitude: 76.6491,
  });
  const [endingLocation, setEndingLocation] = useState({
    latitude: 10.824,
    longitude: 76.6426,
  });
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [BusLocation, setBusLocation] = useState();
  const [Error, setError] = useState("");

  const [mapType, setMapType] = useState("standard");
  const [traffic, Settraffic] = useState(false);
  const [etaData, setEtaData] = useState(null);
  const [umminiData, setumminiData] = useState(null);

  //   get bus location from supabase
  const fetchUserLocations = async () => {
    console.log("Fetching location");
    try {
      // Fetch user locations from the 'user_locations' table
      let { data: user_locations, error } = await supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", 1);

      if (error) {
        setError(error.message);
      } else {
        // Update the user locations state
        setBusLocation({
          latitude: user_locations[0]?.lat,
          longitude: user_locations[0]?.long,
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchUserLocations();

    const interval = setInterval(fetchUserLocations, 1000); // Fetch every 10 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);
  // map

  const fetchEtaDatas = async (originCoordinates, destinationCoordinates) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
          params: {
            origins: `${originCoordinates?.latitude},${originCoordinates?.longitude}`,
            destinations: `${destinationCoordinates?.latitude},${destinationCoordinates?.longitude}`,
            key: "",
          },
        }
      );

      if (response.data.status === "OK") {
        const result = response.data.rows[0].elements[0];
        const distanceText = result?.distance?.text;
        const durationText = result?.duration?.text;
        // console.log(distanceText, durationText)
        setumminiData({ distanceText, durationText });
        return { distanceText, durationText };
      } else {
        console.log("Distance calculation failed");
        return null;
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      return null;
    }
  };

  useEffect(() => {
    const umminiDatas = fetchEtaDatas(BusLocation, {
      latitude: 10.82344,
      longitude: 76.63165,
    });
  });

  // console.log('ummirni',umminiData)

  useEffect(() => {
    const fetchEtaData = async () => {
      try {
        const response = await axios.get(
          "https://maps.googleapis.com/maps/api/distancematrix/json",
          {
            params: {
              origins: `${BusLocation?.latitude},${BusLocation?.longitude}`,
              destinations: "10.7973,76.6391",
              key: "-",
            },
          }
        );

        if (response.data.status === "OK") {
          const result = response.data.rows[0].elements[0];
          const distanceText = result.distance.text;
          const durationText = result.duration.text;
          setEtaData({ distanceText, durationText });
        } else {
          console.log("Distance calculation failed");
        }
      } catch (error) {
        console.error("Error calculating distance:", error);
      }
    };

    if (BusLocation) {
      fetchEtaData();
    }
  }, [BusLocation]);
  const calculateDistance = async (a, b) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
          params: {
            origins: `${a.latitude},${a.longitude}`,
            destinations: `${b.latitude},${b.longitude}`,
            key: "-",
          },
        }
      );

      if (response.data.status === "OK") {
        const result = response.data.rows[0].elements[0];
        // console.log(response.data);
        const distanceText = result.distance.text;
        const durationText = result.duration.text;

        // console.log(durationText);
        setDistance(distanceText);
        setDuration(durationText);
      } else {
        console.log("Distance calculation failed");
      }
    } catch (error) {
      //   console.error("Error calculating distance:", error);
    }
  };

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["5%", "25%", "50%"], []);
  const handleSheetChanges = useCallback((index) => {
    // console.log("handleSheetChanges", index);
  }, []);

  //   my location
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Fetch the starting and ending coordinates here
    const startingAddress = "Palakkad"; // Replace with the starting address
    const endingAddress = "NSS College of Engineering"; // Replace with the ending address

    const fetchCoordinates = async () => {
      try {
        const startingCoordinates = await getCoordinates(startingAddress);
        setStartingLocation(startingCoordinates);

        const endingCoordinates = await getCoordinates(endingAddress);
        setEndingLocation(endingCoordinates);

        const coordinates = await getRouteCoordinates(
          startingCoordinates,
          endingCoordinates
        );
        setRouteCoordinates(coordinates);
      } catch (error) {
        // console.error("Error:", error);
      }
    };

    fetchCoordinates();
  });

  useEffect(() => {
    (async () => {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // console.log("Permission to access location was denied");
        return;
      }

      // Retrieve current location
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
  }, []);

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: address,
            key: "AIzaSyDThYz-", // Replace with your Google Maps API key
          },
        }
      );

      if (response.data.status === "OK") {
        const result = response.data.results[0];
        const { lat, lng } = result.geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        // console.log("Geocoding API request failed");
      }
    } catch (error) {
      //   console.error("Error fetching coordinates:", error);
    }
  };

  const getRouteCoordinates = async (
    startingCoordinates,
    endingCoordinates
  ) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/directions/json",
        {
          params: {
            origin: `${startingCoordinates.latitude},${startingCoordinates.longitude}`,
            destination: `${endingCoordinates.latitude},${endingCoordinates.longitude}`,
            key: "AIzaSyDThYz-", // Replace with your Google Maps API key
            waypoints: "Olavakode",
          },
        }
      );

      if (response.data.status === "OK") {
        const route = response.data.routes[0];
        const coordinates = route.overview_polyline.points;
        return decodePolyline(coordinates);
      } else {
        // console.log("Directions API request failed");
      }
    } catch (error) {
      //   console.error("Error fetching route:", error);
    }
  };

  const decodePolyline = (polyline) => {
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
  };

  return (
    <View style={styles.container}>
      {1 && 1 && (
        <MapView
          mapType={mapType}
          style={styles.map}
          initialRegion={{
            latitude: 10.7668 || startingLocation.latitude || 10.7668,
            longitude: 76.6491 || startingLocation.longitude || 76.6491,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsBuildings={true}
          showsIndoorLevelPicker={true}
          showsMyLocationButton={true}
          showsScale={true}
          showsTraffic={traffic}
        >
          {/* Marker for the starting location */}

          {/* {BusLocation?.latitude && BusLocation?.longitude && (
            <Marker
              coordinate={{
                latitude: BusLocation?.latitude,
                longitude: BusLocation?.longitude,
              }}
              title="Starting Location"
              description="This is the starting location"
            >
              <Image
                source={{
                  uri: "https://freepngdownload.com/image/thumb/bus-png.png",
                }}
                style={{ width: 41, height: 41 }}
              />
            </Marker>
          )} */}

          {/* Marker for the ending location */}

          {/* <Marker
            coordinate={{
              latitude: startingLocation.latitude,
              longitude: startingLocation.longitude,
            }}
            title="Starting Location"
            description="This is the starting location"
          ></Marker> */}

          {/* { etaData && <Marker
            coordinate={{
              latitude: 10.7973,
              longitude: 76.6391,
            }}
            title="Olavakode Junction"
            description={
              etaData
                ? `Estimated Arrival - Distance: ${etaData.distanceText}, Duration: ${etaData.durationText}`
                : ""
            }
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/6395/6395324.png",
              }}
              style={{ width: 32, height: 32 }}
            />
          </Marker>} */}

          {/* {umminiData && (
            <Marker
              coordinate={{
                latitude: 10.82344,
                longitude: 76.63165,
              }}
              title="Ummini Junction"
              description={
                etaData
                  ? `Estimated Arrival - Distance: ${umminiData.distanceText}, Duration: ${umminiData.durationText}`
                  : ""
              }
            >
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/6395/6395324.png",
                }}
                style={{ width: 32, height: 32 }}
              />
            </Marker>
          )} */}

          {/* <Marker
            coordinate={{
              latitude: endingLocation.latitude,
              longitude: endingLocation.longitude,
            }}
            title="Ending Location"
            description="NSS College of Engineering"
          ></Marker> */}

          {/* Polyline representing the route */}
          {/* { routeCoordinates && <Polyline
            coordinates={routeCoordinates ? routeCoordinates : []}
            strokeWidth={4}
            strokeColor="hotpink"
          />} */}
        </MapView>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View
          style={{ display: "flex", flexDirection: "row", overflow: "scroll" }}
        >
          <TouchableOpacity style={styles.selectMap}>
            <Button
              style={styles.mapSelectorButton}
              labelStyle={styles.mapSelectorButtonText}
              onPress={() => Settraffic(!traffic)}
              mode="contained"
            >
              {traffic == false ? "Show Traffic" : " Hide Traffic"}{" "}
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const newMapType = mapType === "hybrid" ? "standard" : "hybrid";
              setMapType(newMapType);
            }}
            style={styles.selectMap}
          >
            <Button
              mode="contained"
              style={styles.mapSelectorButton}
              labelStyle={styles.mapSelectorButtonText}
            >
              {mapType === "hybrid" ? "Standard" : "Hybrid"}
            </Button>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <Card style={{ padding: 15, textAlign: "center", marginVertical: 5 }}>
            <Text
              variant="titleMedium"
              styles={[styles.BottomSheet, { textAlign: "center" }]}
            >
              <MaterialCommunityIcons
                name="road-variant"
                size={18}
                style={{ color: "black" }}
              />{" "}
              Your Bus is {""}
              {currentLocation &&
              startingLocation &&
              calculateDistance(currentLocation, startingLocation)
                ? distance + " ( " + duration + " )" + " away from you"
                : "0"}{" "}
            </Text>
          </Card>

          <Card style={{ padding: 15, textAlign: "center", marginVertical: 5 }}>
            <Text
              variant="titleMedium"
              styles={[styles.BottomSheet, { textAlign: "center", padding: 5 }]}
            >
              <MaterialCommunityIcons
                name="bus-stop-uncovered"
                size={18}
                style={{ color: "black" }}
              />{" "}
              Your Bus will reach OlavaKode Junction in {etaData?.durationText}{" "}
              {"("}
              {etaData?.distanceText}
              {")"}
            </Text>
          </Card>

          <Card style={{ padding: 15, textAlign: "center", marginVertical: 5 }}>
            <Text
              variant="titleMedium"
              styles={[styles.BottomSheet, { textAlign: "center", padding: 5 }]}
            >
              <MaterialCommunityIcons
                name="bus-stop-uncovered"
                size={18}
                style={{ color: "black" }}
              />{" "}
              Your Bus will reach Ummini Junction in {umminiData?.durationText}
            </Text>
          </Card>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  selectMap: {
    width: "45%",
    padding: 5,
    marginBottom: 20,
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
  contentContainer: {
    padding: 15,
    fontSize: 20,
  },
  BottomSheet: {
    fontSize: 15,
    padding: 5,
    textAlign: "center",
  },
});

export default FullScreenMaps;
