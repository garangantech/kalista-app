import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CARD_SIZE = Dimensions.get("window").width / 2 - 30;

export default function MenuScreen({ navigation }) {
  const menuItems = [
    {
      label: "Siklus Haid",
      icon: "water",
      onPress: () => navigation.navigate("Menstruation"),
    },
    {
      label: "Program Hamil",
      icon: "heart",
      onPress: () => navigation.navigate("PregnancyPlan"),
    },
    {
      label: "Kehamilan",
      icon: "body",
      onPress: () => navigation.navigate("Pregnancy"),
    },
    {
      label: "Imunisasi Anak",
      icon: "medkit",
      onPress: () => navigation.navigate("Immunization"),
    },
    {
      label: "Edukasi",
      icon: "book",
      onPress: () => navigation.navigate("Edukasi"),
    },
    {
      label: "Pranikah",
      icon: "people",
      onPress: () => navigation.navigate("Pranikah"),
    },
  ];
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={item.onPress}>
      <Ionicons name={item.icon} size={36} color="#4A90E2" />
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Semua Menu Fitur</Text>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.label}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    alignItems: "center",
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: 10,
    backgroundColor: "#F0F4F8",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
