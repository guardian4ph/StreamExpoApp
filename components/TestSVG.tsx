import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const TestSvg = () => (
  <View>
    <Svg height="100" width="100">
      <Circle
        cx="50"
        cy="50"
        r="40"
        stroke="black"
        strokeWidth="2"
        fill="red"
      />
    </Svg>
  </View>
);

export default TestSvg;
