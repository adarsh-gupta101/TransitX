export const ETA = async (a, b) => {
    try {
      // console.log(a, b);
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
          params: {
            origins: `${a.latitude},${a.longitude}`,
            destinations: `${b.latitude},${b.longitude}`,
            key: "AIzaSyDThYz-OiPXBmsRkLt4GyVlzvBbTQSu5Jo",
          },
        }
      );

      if (response.data.status === "OK") {
        const result = response.data.rows[0].elements[0];
        // console.log(response.data);
        const distanceText = result.distance.text;
        const durationText = result.duration.text;

        return [distanceText, durationText];
      } else {
        // console.log("Distance calculation failed");
      }
    } catch (error) {
      //   console.error("Error calculating distance:", error);
    }
  };
