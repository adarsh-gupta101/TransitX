import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect,useRef,useMemo,useCallback } from "react";
import { supabase } from "../supabase";
import axios from "axios";
import geolib from "geolib";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  Button,
  Avatar,
  Card,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as Location from "expo-location";




// maps
import MapView, { Marker, Polyline } from "react-native-maps";

const FullScreenMap = () => {


  const [currentLocation, setCurrentLocation] = useState(null);
  const [etaData, setEtaData] = useState(null);
  const [umminiData, setumminiData] = useState({"distanceInKilometers": 27.0443, "durationInMinutes": 28.5283});
const [OlavaKodeData,setOlavaKodeData]=useState()



// 
const bottomSheetRef = useRef(null);
const snapPoints = useMemo(() => ["5%", "25%", "50%"], []);
const handleSheetChanges = useCallback((index) => {
  // console.log("handleSheetChanges", index);
}, []);

  const [mapType, setMapType] = useState("standard");
  const [traffic, Settraffic] = useState(false);

  // Error
  const [Error, setError] = useState("");

  // Bus
  const [BusLocation, setBusLocation] = useState({
    latitude: 10.7668,
    longitude: 76.6491,
  });
 const [startingLocation, setStartingLocation] = useState({
    latitude: 10.7668,
    longitude: 76.6491,
  });

  const [endingLocation, setEndingLocation] = useState({
    latitude: 10.824,
    longitude: 76.6426,
  });

  const [userLocation,SetUserLocation]=useState();
  const [FootWalkingCoordinate, setFootWalkingCoordinate] = useState(null);

  // find user coordinates using expo-location
  useEffect(() => {
    // Request location permission
    Location.requestForegroundPermissionsAsync().then((data) => {
      if (data.status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      
      // Retrieve current location
      Location.getCurrentPositionAsync({}).then((locationData) => {
        const { latitude, longitude } = locationData.coords;
        console.log("Location:", latitude, longitude);
        
        // Set the user location state
        SetUserLocation({ latitude, longitude });
        fetchEtaDatas(BusLocation,  userLocation ).then((data) => {
          console.log("data",data);
          SetBusDistanceFromYou(data)
        
        })
      });
    });
  }, []);
  

  const [BusDistanceFromYou,SetBusDistanceFromYou]=useState(0)

  const [routeCoordinates, setRouteCoordinates] = useState(null);
  // useEffects
  useEffect(() => {
    FetchBusLocation();
  }, []);

  const FetchBusLocation = async () => {
    console.log("Fetching location");
    try {
      // Fetch user locations from the 'user_locations' table
      supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", 1)
        .then((response) => {
          let { data: user_locations, error } = response;

          console.log("User locations:", user_locations)

          if (error) {
            setError(error.message);
            console.log(error);
          } else {
            // Update the user locations state
            setBusLocation({
              latitude: user_locations[0]?.lat,
              longitude: user_locations[0]?.long,
            });

            console.log("Bus Location is is ", BusLocation);
          }
        });
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  const getRouteCoordinates = async (
    startingCoordinates,
    endingCoordinates
  ) => {
    try {
      const waypoints = [
        [76.63165, 10.82344], // Ummini Junction coordinates
      ];
      const response = await axios.get(
        "https://api.openrouteservice.org/v2/directions/driving-hgv",
        {
          params: {
            api_key: process.env.ORS, // Replace with your OpenRouteService API key
            start: `${startingCoordinates.longitude},${startingCoordinates.latitude}`,
            end: `${endingCoordinates.longitude},${endingCoordinates.latitude}`,
            // end: `${76.63165},${10.82344}`,
            geometry_format: "geojson",
            alternatives:true,
            
            
            // waypoints: waypoints.map(([longitude, latitude]) => `${longitude},${latitude}`).join("|"),
            // longitude: 76.63165,
            // latitude: 10.82344,
          },
        }
      );

      console.log(1);

      if (response.data) {
        const coordinates = response.data.features[0].geometry.coordinates;
        // return coordinates.map(([longitude, latitude]) => ({
        //   latitude,
        //   longitude,
        // }));
        const transformedCoordinates = coordinates.map(([longitude, latitude]) => ({
          latitude,
          longitude,
        }));

        setRouteCoordinates(transformedCoordinates);
        // console.log("111", decodePolyline(coordinates));
        console.log("------------------------"); //
        console.log(response.data.features.length )
        console.log("------------------------"); //
      } else {
        console.log("Route request failed");
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const FootWalkingCoordinates = async (
    startingCoordinates,
    endingCoordinates
  ) => {
    try {
      const waypoints = [
        [76.63165, 10.82344], // Ummini Junction coordinates
      ];
      const response = await axios.get(
        "https://api.openrouteservice.org/v2/directions/foot-walking",
        {
          params: {
            api_key: process.env.ORS, // Replace with your OpenRouteService API key
            start: `${startingCoordinates.longitude},${startingCoordinates.latitude}`,
            end: `${endingCoordinates.longitude},${endingCoordinates.latitude}`,
            // end: `${76.63165},${10.82344}`,
            geometry_format: "geojson",
            alternatives:true,
            
            
            // waypoints: waypoints.map(([longitude, latitude]) => `${longitude},${latitude}`).join("|"),
            // longitude: 76.63165,
            // latitude: 10.82344,
          },
        }
      );

      console.log(1);

      if (response.data) {
        const coordinates = response.data.features[0].geometry.coordinates;
        // return coordinates.map(([longitude, latitude]) => ({
        //   latitude,
        //   longitude,
        // }));
        const transformedCoordinates = coordinates.map(([longitude, latitude]) => ({
          latitude,
          longitude,
        }));
        console.log("transformedCoordinates-------",transformedCoordinates)

        setFootWalkingCoordinate(transformedCoordinates);
        // console.log("111", decodePolyline(coordinates));
        console.log("------------------------"); //
        console.log(response.data.features.length )
        console.log("------------------------"); //
      } else {
        console.log("Route request failed");
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };


  
    
  

    const fetchEtaDatas = async (originCoordinates, destinationCoordinates) => {
      try {
        const response = await axios.get(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            params: {
              api_key: process.env.ORS, // Replace with your OpenRouteService API key
              start: `${originCoordinates?.longitude},${originCoordinates?.latitude}`,
              end: `${destinationCoordinates?.longitude},${destinationCoordinates?.latitude}`,
            },
          }
        );
    
        if (response.data) {
          // console.log("distance",response.data.features.length,response.data.features[0].properties.summary.distance,response.data.features[0].properties.summary)
          // const result = response.data.routes[0];
          console.log("result",1)
          const distanceInKilometers= (response.data.features[0].properties.summary.distance/1000).toFixed(2);
          const durationInMinutes = (response.data.features[0].properties.summary.duration/60).toFixed(2);
          // const distanceText = result?.summary?.distance;
          // const durationText = result?.summary?.duration;
          // setumminiData({ distanceText, durationText });
          return { distanceInKilometers, durationInMinutes };
        } else {
          console.log("Distance calculation failed");
          return null;
        }
      } catch (error) {
        console.error("Error calculating distance::", error);
        return null;
      }
    };
    
    useEffect(() => {
      const umminiDatas = fetchEtaDatas(BusLocation, {
        latitude: 10.82344,
        longitude: 76.63165,
      }).then((data) => {
        console.log(data);
        setumminiData(data);
    });


    fetchEtaDatas(BusLocation, {
      latitude:10.7995,
      longitude:76.6427,
    }).then((data) => {
      console.log(data);
      setOlavaKodeData(data);
    })

{userLocation && fetchEtaDatas(BusLocation,  userLocation ).then((data) => {
  console.log("data",data);
  SetBusDistanceFromYou(data)

})}

  },[])
  useEffect(() => {
    // Fetch the starting and ending coordinates here
    const startingAddress = "Palakkad"; // Replace with the starting address
    const endingAddress = "NSS College of Engineering"; // Replace with the ending address

    const fetchCoordinates = async () => {
      try {
        // const startingCoordinates = await getCoordinates(startingAddress);
        // setStartingLocation(startingCoordinates);

        // const endingCoordinates = await getCoordinates(endingAddress);
        // setEndingLocation(endingCoordinates);

        const coordinates = await getRouteCoordinates(
          startingLocation,
          endingLocation
        );
        FootWalkingCoordinates(startingLocation,endingLocation)
        console.log("coordinates", coordinates);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCoordinates();
  }, []);

  return (
    <View style={styles.container}>
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
        {BusLocation?.latitude && (
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
        )}

        <Marker
          coordinate={{
            latitude: startingLocation?.latitude,
            longitude: startingLocation?.longitude,
          }}
          title="Palakkad Town"
          description="This is the starting location"
        ></Marker>

        <Marker
          coordinate={{
            latitude: 10.824,
            longitude: 76.6426,
          }}
          title="NSS College of Engineering"
          description="Final Destination"
        ></Marker>

        {routeCoordinates && (
          <Polyline
            coordinates={routeCoordinates ? routeCoordinates : []}
            strokeWidth={4}
            strokeColor="red"
            strokeOpacity={1}
            strokeCap="round"
            
          />
        )}

{
  FootWalkingCoordinate && (
    <Polyline
      coordinates={FootWalkingCoordinate ? FootWalkingCoordinate : []}
      strokeWidth={4}
      strokeColor="blue"
      strokeOpacity={1}
      strokeCap="round"
      />
  )
}

{umminiData && (
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
              ></Marker>
            )}


  {OlavaKodeData && (
            <Marker
              coordinate={{
                latitude: 10.7993,
                longitude: 76.634,
              }}
              title="OlavaKode Junction"
              description={
                OlavaKodeData
                  ? `Estimated Arrival - Distance: ${OlavaKodeData.distanceInKilometers}, Duration: ${OlavaKodeData.durationInMinutes}`
                  : ""
              }
            ></Marker>
          )

              }          
      </MapView>

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
              Your Bus is{" "}
              {
              BusDistanceFromYou?.distanceInKilometers?BusDistanceFromYou.distanceInKilometers:0
              } km away from you

              
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
              Your Bus will reach OlavaKode Junction in {OlavaKodeData?.durationInMinutes}{" "}
              Minutes {"("}
              {OlavaKodeData?.distanceInKilometers} km {")"}
              
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
              Your Bus will reach Ummini Junction in {umminiData?.durationInMinutes} minutes {"("} {umminiData?.distanceInKilometers} km {")"}
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

export default FullScreenMap;
