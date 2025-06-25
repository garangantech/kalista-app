// components/ToolMenuItems.js

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ToolMenuItems({ data, onItemPress }) {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.toolItem}
          onPress={() => onItemPress?.(item)}
        >
          <View style={styles.iconCircle}>
            {item.image ? (
              <Image source={item.image} style={styles.iconImage} />
            ) : (
              <Ionicons name={item.icon} size={28} color="#fe61ad" />
            )}
          </View>
          <Text style={styles.toolLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  toolItem: {
    alignItems: "center",
    marginRight: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffe6f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  iconImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  toolLabel: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
});
