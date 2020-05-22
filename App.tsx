import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Compass } from "./components/MagnetometerSensor";

export default function App() {
  return (
    <View style={styles.container}>
      <Compass />
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
