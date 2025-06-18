import React from "react";
import { View } from "react-native";
import Svg, { Circle, Rect, Text } from "react-native-svg";

const SvgExample = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Svg height="200" width="200">
        <Rect x="0" y="0" width="200" height="200" fill="lightblue" />
        <Circle cx="100" cy="100" r="80" fill="skyblue" />
        <Text
          x="100"
          y="110"
          fontSize="20"
          fill="white"
          fontWeight="bold"
          textAnchor="middle"
        >
          Hello SVG
        </Text>
      </Svg>
    </View>
  );
};

export default SvgExample;
