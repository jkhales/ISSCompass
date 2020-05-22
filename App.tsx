import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Compass } from "./components/MagnetometerSensor";
import { ISSRotationAngle } from "./components/Location";

export default function App() {
  const issRotationAngle = ISSRotationAngle();
  return (
    <View style={styles.container}>
      <Compass issRotationAngle={issRotationAngle} />
    </View>
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
