// import { useEffect, useRef } from "react";
// import { Platform } from "react-native";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { supabase } from "../supabase";

// export function initializeNotifications() {
//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) => {
//       if (Platform.OS === "android") {
//         Notifications.setNotificationChannelAsync("default", {
//           name: "default",
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: "#FF231F7C",
//         });
//       }
//     });

//     const notificationListener = Notifications.addNotificationReceivedListener(
//       (notification) => {
//         handleNotification(notification);
//       }
//     );

//     const responseListener =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log(response);
//       });

//     const subscription = supabase
//       .from("messages")
//       .on("INSERT", (payload) => {
//         const newMessage = payload.new;
//         sendPushNotification(newMessage.message);
//       })
//       .subscribe();

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener);
//       Notifications.removeNotificationSubscription(responseListener);
//       subscription.unsubscribe();
//     };
//   }, []);
// }

// function sendPushNotification(message) {
//   Notifications.scheduleNotificationAsync({
//     content: {
//       title: "New Message",
//       body: message,
//       ios: {
//         sound: true,
//       },
//       android: {
//         sound: true,
//         priority: "high",
//         sticky: false,
//         vibrate: true,
//         alert: true,
//       },
//     },
//     trigger: null,
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   return token;
// }

import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { supabase } from "../supabase";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("driver_alerts")
          .select("id, message, timestamp")
          .order("timestamp", { ascending: false });

        if (error) {
          console.log(error);
        } else {
          setNotifications(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, []);

  const renderNotification = ({ item }) => {
    return (
      <View style={styles.notification}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifications</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      ) : (
        <Text style={styles.emptyMessage}>No notifications yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    width: "100%",
  },
  notification: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
  },
  emptyMessage: {
    fontSize: 18,
    color: "#666",
  },
});
