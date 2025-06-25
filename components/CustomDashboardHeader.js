import React from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function CustomDashboardHeader({ onPress }) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        {/* Kiri: Profil */}
        <MaterialCommunityIcons
          name="heart-multiple"
          size={33}
          color="#fe61ad"
        />

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Cari artikel..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        <Ionicons name="person-circle" size={35} color="#fe61ad" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    width: 34,
    height: 34,
    marginRight: 4,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  searchInput: {
    backgroundColor: "#f7f8fc",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    borderWidth: 0.5,
    borderColor: "#999",
  },
});
