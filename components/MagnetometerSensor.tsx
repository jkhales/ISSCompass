import React from "react";
import { Magnetometer, ThreeAxisMeasurement } from "expo-sensors";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Subscription } from "@unimodules/core";
import { ISSRotationAngle } from "./Location";

export function Compass(props: { issRotationAngle: number }) {
  const [data, setData] = React.useState<ThreeAxisMeasurement>({
    x: 1,
    y: 1,
    z: 1,
  });
  const [subscription, setSubscription] = React.useState<Subscription | null>(
    null
  );

  React.useEffect(() => {
    _toggle();
    return () => {
      _unsubscribe();
    };
  }, []);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _slow = () => {
    Magnetometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Magnetometer.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((result) => {
        setData(result);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  let { x, y, z } = data;
  return (
    <View style={styles.sensor}>
      <Text>Location of the ISS (modulo compuation error...)</Text>
      <Animated.Image
        source={require("../assets/compass.jpg")}
        style={{
          height: 300,
          width: 300,
          transform: [
            {
              rotate: `${
                Math.atan2(x, y) - (Math.PI/2) + props.issRotationAngle
              }rad`,
            },
          ],
        }}
      ></Animated.Image>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={_toggle} style={styles.button}>
          <Text>Toggle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_slow}
          style={[styles.button, styles.middleButton]}
        >
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function round(n: number) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
