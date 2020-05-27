import React from "react";
import { Magnetometer, ThreeAxisMeasurement } from "expo-sensors";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Subscription } from "@unimodules/core";
import { ISSRotationAngle } from "./Location";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";

const DURATION = 1000;

export function Compass(props: { issRotationAngle: number }) {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const [subscription, setSubscription] = React.useState<Subscription | null>(
    null
  );
  React.useEffect(() => {
    _subscribe();
    return () => {
      _unsubscribe();
    };
  }, []);

  Magnetometer.setUpdateInterval(DURATION / 2);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((result) => {
        const toValue = Math.atan2(result.x, result.y);

        Animated.timing(spinValue, {
          toValue,
          duration: DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 2 * Math.PI],
    outputRange: [`0rad`, `${2 * Math.PI}rad`],
  });

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
              rotate: spin,
            },
          ],
        }}
      ></Animated.Image>
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
