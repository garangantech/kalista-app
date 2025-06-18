import React from "react";
import { View, StyleSheet } from "react-native";
import SvgExample from "./SvgExample";

export default function App() {
  return (
    <View style={styles.container}>
      <SvgExample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
