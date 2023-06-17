// import React, { useState, useEffect, useRef } from "react";
// import { Text, View, Button, Platform } from "react-native";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { supabase } from "./supabase";
// // Initialize Supabase client

// export default function Push() {
//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: true,
//       shouldSetBadge: false,
//     }),
//   });
//   const [expoPushToken, setExpoPushToken] = useState("");
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) => {
//       setExpoPushToken(token);

//       if (Platform.OS === "android") {
//         Notifications.setNotificationChannelAsync("default", {
//           name: "default",
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: "#FF231F7C",
//         });
//       }
//     });

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         setNotification(notification);
//       });

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log(response);
//       });

//     // Subscribe to Supabase real-time changes
//     // const subscription = supabase
//     //   .from('messages')
//     //   .on('INSERT', (payload) => {
//     //     const newMessage = payload.new;
//     //     sendPushNotification(newMessage);
//     //   })
//     //   .subscribe();

//     const subscription = supabase
//       .channel("table_notifications")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "driver_alerts" },
//         (payload) => {
//           // doing
//           console.log(payload);
//           sendPushNotification(payload.new.message);
//         }
//       )
//       .subscribe();

//     return () => {
//       Notifications.removeNotificationSubscription(
//         notificationListener.current
//       );
//       Notifications.removeNotificationSubscription(responseListener.current);
//       subscription.unsubscribe();
//     };
//   }, []);

//   const sendPushNotification = async (message) => {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "TransitX",
//         body: message,
//         color: "MAGENTA",
//         ios: {
//           sound: true,
//         },
//         android: {
//           sound: true,
//           priority: "high",
//           sticky: false,
//           vibrate: true,

//           alert: true,
//         },
//       },
//       trigger: null,
//     });
//   };

//   async function schedulePushNotification() {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "You've got mail! 📬",
//         body: "Here is the notification body",
//         data: { data: "goes here" },
//       },
//       trigger: null,
//     });
//   }

//   async function registerForPushNotificationsAsync() {
//     let token;

//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#FF231F7C",
//       });
//     }

//     if (Device.isDevice) {
//       const { status: existingStatus } =
//         await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }
//       if (finalStatus !== "granted") {
//         alert("Failed to get push token for push notification!");
//         return;
//       }
//       token = (await Notifications.getExpoPushTokenAsync()).data;
//       console.log(token);
//     } else {
//       alert("Must use physical device for Push Notifications");
//     }

//     return token;
//   }

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "space-around",
//       }}
//     >
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: "center", justifyContent: "center" }}>
//         <Text>
//           Title: {notification && notification.request.content.title}{" "}
//         </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>
//           Data:{" "}
//           {notification && JSON.stringify(notification.request.content.data)}
//         </Text>
//       </View>
//       <Button
//         title="Press to schedule a notification"
//         onPress={async () => {
//           await schedulePushNotification();
//         }}
//       />
//     </View>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { supabase } from "./supabase";
// Initialize Supabase client

export default Push;

export const sendPushNotifications = async (message) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your Driver Just Sent You a Message",
      body: message,
      // Rest of the notification content...
    },
    trigger: null,
  }).catch((error) => console.log(error));
};

function Push() {
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

  // return (
  //   <View
  //     style={{
  //       flex: 1,
  //       alignItems: "center",
  //       justifyContent: "space-around",
  //     }}
  //   >
  //     <Text>Your expo push token: {expoPushToken}</Text>
  //     <View style={{ alignItems: "center", justifyContent: "center" }}>
  //       <Text>
  //         Title: {notification && notification.request.content.title}{" "}
  //       </Text>
  //       <Text>Body: {notification && notification.request.content.body}</Text>
  //       <Text>
  //         Data:{" "}
  //         {notification && JSON.stringify(notification.request.content.data)}
  //       </Text>
  //     </View>
  //     <Button
  //       title="Press to schedule a notification"
  //       onPress={async () => {
  //         await schedulePushNotification();
  //       }}
  //     />
  //   </View>
  // );
}
