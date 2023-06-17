import { Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import React, { useState, useEffect, useRef } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Maps from "./Screens/FullScreenMap.jsx";
import Home from "./Screens/Home.jsx";
import SignUp from "./Screens/SignUp.jsx";
import BusTrackingScreen from "./Screens/BusTrackingScreen.jsx";
import FullScreenMap from "./Screens/FullScreenMap.jsx";
import StudentLoginScreen from "./Screens/StudentLogin.jsx";
import GetStarted from "./Screens/GetStarted.jsx";
import NotificationList from "./Screens/Notification.jsx";
import Push, { sendPushNotifications } from "./pushnotify.js";
import BusSchedule from "./Screens/BusSchedule.jsx";
import { supabase } from "./supabase.js";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Swipe = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Swipe.Navigator style={{ marginTop: 20 }}>
      <Swipe.Screen name="College Bus" component={BusSchedule} />
      <Swipe.Screen name="Line Bus" component={BusSchedule} />
    </Swipe.Navigator>
  );
}

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
        name="Notification"
        component={NotificationList}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Notificationssection"
        component={Push}
        options={{
          tabBarLabel: "Notificationss",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      /> */}

      <Tab.Screen
        name="FullScreenMap"
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
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);

      if (Platform.OS == "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    // Subscribe to Supabase real-time changes
    // const subscription = supabase
    //   .from('messages')
    //   .on('INSERT', (payload) => {
    //     const newMessage = payload.new;
    //     sendPushNotification(newMessage);
    //   })
    //   .subscribe();

    const subscription = supabase
      .channel("table_notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "driver_alerts" },
        (payload) => {
          // doing
          console.log(payload);
          sendPushNotification(payload.new.message);
        }
      )
      .subscribe();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      subscription.unsubscribe();
    };
  }, []);
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const sendPushNotification = async (message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your Driver Just Sent You a Message",
        body: message,
        sound: true,
        vibrate: true,
        subtitle: "TransitX",

        data: {
          date: new Date(),
        },

        ios: {
          sound: true,
        },
        android: {
          sound: true,
          priority: "high",
          sticky: true,
          vibrate: true,
          alert: true,
        },

        attachments: [
          {
            identifier: "image",
            url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
            thumbnailClipArea: { x: 0, y: 0, width: 200, height: 200 },
            hideThumbnail: true,
          },
        ],
        color: "MAGENTA",
        autoDismiss: true,
        badge: true,
        launchImageName: "splash",
        launchImage: {
          uri: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        },
        priority: 1,
      },
      trigger: null,
    });
  };

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="BusSchedule" component={MyTabs} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeStack} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Maps" component={Maps} labelled={false} />
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
