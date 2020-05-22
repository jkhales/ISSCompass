import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import fetch from "node-fetch";

type ISSCoords = {
  latitude: string;
  longitude: string;
};
type ISSLocationType = {
  iss_position: ISSCoords;
  message: string;
  timestamp: string;
};
export function ISSRotationAngle() {
  const [location, setLocation] = useState<Location.LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ISSLocation, setISSLocation] = useState<ISSLocationType | null>(null);

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
      const response = await fetch("http://api.open-notify.org/iss-now.json");
      if (response.ok) {
        const data = (await response.json()) as any;
        setISSLocation(data);
      }
    }, 5000);

    return () => {
      clearInterval(handle);
    };
  }, []);

  let latitudeDelta = 0,
    longitudeDelta = 0;
  if (location && ISSLocation) {
    latitudeDelta =
      location?.coords.latitude -
        parseFloat(ISSLocation?.iss_position?.latitude) ?? 0;
    longitudeDelta =
      location?.coords.longitude -
        parseFloat(ISSLocation?.iss_position?.longitude) ?? 0;
  }

  const polarAngle = Math.atan2(
    90 - (location?.coords.latitude ?? 0),
    135 - (location?.coords.longitude ?? 0)
  );

  return Math.atan2(longitudeDelta, latitudeDelta) - polarAngle;
}
