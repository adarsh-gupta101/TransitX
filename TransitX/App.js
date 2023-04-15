import { Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Maps from "./Screens/Map.jsx";
import Home from "./Screens/Home.jsx";
import SignUp from "./Screens/SignUp.jsx";
import BusTrackingScreen from "./Screens/BusTrackingScreen.jsx";
import FullScreenMap from "./Screens/FullScreenMap.jsx";
import StudentLoginScreen from "./Screens/StudentLogin.jsx";
import GetStarted from "./Screens/GetStarted.jsx";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStack() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: "white" }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bowl" color={color} size={26} />
          ),
          tabBarVisible: false,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={BusTrackingScreen}
        options={{
          tabBarLabel: "Updates",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="battery" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={FullScreenMap}
        options={{
          tabBarLabel: "View Map",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeStack} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Map" component={Maps} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
