import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const iconLibraries = {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome6,
  Entypo,
  AntDesign,
  Feather,
};

export default function ToolMenuItems({ data }) {
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const IconComponent = item.iconLib
          ? iconLibraries[item.iconLib] || Ionicons
          : Ionicons;

        return (
          <TouchableOpacity
            key={index}
            style={styles.toolItem}
            onPress={item.onPress}
          >
            <View style={styles.iconCircle}>
              {item.image ? (
                <Image source={item.image} style={styles.iconImage} />
              ) : (
                <IconComponent name={item.icon} size={28} color="#fe61ad" />
              )}
            </View>
            <Text style={styles.toolLabel}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
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
