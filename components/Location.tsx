import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import fetch from "node-fetch";

export function LocationComponent() {
  const [location, setLocation] = useState<Location.LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ISSLocation, setISSLocation] = useState<any>("START");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  });

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  useEffect(() => {
    const handle = setInterval(async () => {
      setISSLocation(await fetch("http://api.open-notify.org/iss-now.json"));
    }, 5000);

    return () => {
      clearInterval(handle);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <Text>ISS DATA: {JSON.stringify(ISSLocation)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
