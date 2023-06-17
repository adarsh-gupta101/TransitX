import React, { useState, useEffect, useRef } from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { supabase } from "..//supabase";
import Lottie from "lottie-react-native";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
    animationRef.current?.play(30, 120);
  }, []);
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
    const formattedDate = new Date(item.timestamp);
    const formattedDateString = formattedDate.toLocaleDateString();
    const formattedTimeString = formattedDate.toLocaleTimeString();
    return (
      <View style={styles.notification}>
        <View style={styles.content}>
          {/* <Image
            source={require("../path/to/notification-image.png")}
            style={styles.image}
          /> */}
          <Lottie
            ref={animationRef}
            source={require("../assets/bus.json")}
            style={{ width: 50, height: 50 }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>
              {formattedDateString} {formattedTimeString}
            </Text>
          </View>
        </View>
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
    backgroundColor: "#f1f1f1",
    margin: 20,
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
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    margin: 5,
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
