import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import Timeline from "react-native-timeline-flatlist";
import { Button } from "react-native-paper";

const BusSchedule = ({ navigation }) => {
  const data1 = [
    {
      time: "8.10",
      title: "Initial Position",
      description: "Palakkad Main Bus stop",
    },
    {
      time: "8.15",
      title: "Mercy College",
      description: "Bus will wait for 15 mins here",
    },
    {
      time: "8.30",
      title: "Olavakod Junction",
      description: " Bus will wait for 5 mins",
    },
    { time: "8.40", title: "Ummini", description: "Ummini Junction" },
    { time: "8.50", title: "College", description: "Off Boarding" },
  ];

  const data2 = [
    {
      time: "8.15",
      title: "Initial Position",
      description: "Palakkad Main Bus stop",
      icon: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Victoria_bus_logo.svg/512px-Victoria_bus_logo.svg.png",
    },
    {
      time: "8.25",
      title: "Chandranagar",
      description: "Bus will wait for 15 mins here",
    },
    {
      time: "8.35",
      title: "Olavakod Junction",
      description: " Bus will wait for 5 mins",
    },
    { time: "8.45", title: "Ummini", description: "Ummini Junction" },
    { time: "8.55", title: "College", description: "Off Boarding" },
  ];
  const data3 = [
    {
      time: "8.15",
      title: "Initial Position",
      description: "Palakkad KSRTC Bus stop",
    },
    {
      time: "8.25",
      title: "Chandranagar",
      description: "Bus will wait for 15 mins here",
    },
    {
      time: "8.35",
      title: "Olavakod Junction",
      description: " Bus will wait for 5 mins",
    },
    { time: "8.45", title: "Ummini", description: "Ummini Junction" },
    { time: "8.55", title: "College", description: "Off Boarding" },
  ];
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(data1);

  const handleButtonPress = (buttonName) => {
    setSelectedButton(buttonName);
    // if selecton button=1 set selected route to data1 and so on
    console.log(buttonName);
    if (buttonName === "Bus 1") {
      setSelectedRoute(data1);
    } else if (buttonName === "Bus 2") {
      setSelectedRoute(data2);
    } else if (buttonName === "Bus 3") {
      setSelectedRoute(data3);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 5 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: 5,
          marginBottom: 25,
        }}
      >
        <Button
          mode={selectedButton === "Bus 1" ? "contained" : "outlined"}
          onPress={() => handleButtonPress("Bus 1")}
          style={{ margin: 5 }}
        >
          Bus 1
        </Button>
        <Button
          mode={selectedButton === "Bus 2" ? "contained" : "outlined"}
          onPress={() => handleButtonPress("Bus 2")}
          style={{ margin: 5 }}
        >
          Bus 2
        </Button>
        <Button
          mode={selectedButton === "Bus 3" ? "contained" : "outlined"}
          onPress={() => handleButtonPress("Bus 3")}
          style={{ margin: 5 }}
        >
          Bus 3
        </Button>
      </View>

      {/* <Timeline
        data={selectedRoute}
        circleColor="rgb(45,156,219)"
        lineColor="rgb(45,156,219)"
        innerCircle={"icon"}
        timeStyle={{
          textAlign: "center",
          backgroundColor: "purple",
          color: "white",
          padding: 5,
          borderRadius: 13,
        }}
      /> */}
      <View style={{ flex: 1, padding: 10 }}>
        <Timeline
          data={selectedRoute}
          circleColor="#FFC107" // Set a custom color for the circle
          lineColor="#FFC107" // Set a custom color for the line
          innerCircle={"icon"} // Use an icon instead of a solid circle
          timeStyle={{
            textAlign: "center",
            backgroundColor: "purple", // Set a custom background color for the time
            color: "white", // Set a custom text color for the time
            padding: 5,
            borderRadius: 13,
            fontWeight: "bold", // Add bold font weight to the time
          }}
          titleStyle={{
            color: "#333", // Set a custom text color for the title
            fontWeight: "bold", // Add bold font weight to the title
          }}
          descriptionStyle={{
            color: "green", // Set a custom text color for the description
          }}
          renderDetail={(rowData, sectionID, rowID) => {
            return (
              <View style={{ padding: 15 }}>
                <Text style={{ fontWeight: "bold" }}>{rowData.title}</Text>
                <Text>{rowData.description}</Text>
              </View>
            );
          }}
        />
      </View>
      <Button
        mode="contained"
        style={{ margin: 15 }}
        onPress={() => navigation.navigate("FullScreenMap")}
      >
        {" "}
        Track Your Bus
      </Button>
    </View>
  );
};

export default BusSchedule;
