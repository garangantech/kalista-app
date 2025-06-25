import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EducationCard from "../components/EducationCard";

const CARD_SIZE = Dimensions.get("window").width / 3 - 24;

export default function DashboardScreen({ navigation }) {
  const [userName, setUserName] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  const menuItems = [
    {
      label: "Siklus Haid",
      icon: "water",
      onPress: () => navigation.navigate("Menstruation"),
    },
    {
      label: "Kehamilan",
      icon: "body",
      onPress: () => navigation.navigate("Pregnancy"),
    },
    {
      label: "Imunisasi",
      icon: "medkit",
      onPress: () => navigation.navigate("Immunization"),
    },
    {
      label: "Simulasi KB",
      icon: "female",
      onPress: () => navigation.navigate("KB"),
    },
    {
      label: "Pranikah",
      icon: "people",
      onPress: () => navigation.navigate("Pranikah"),
    },
    {
      label: "Edukasi",
      icon: "book",
      onPress: () => navigation.navigate("Edukasi"),
    },
  ];

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem("@user_profile");
        if (stored) {
          const profile = JSON.parse(stored);
          setUserName(profile.name || "Pengguna");
          setUserStatus(profile.status || "-");
          console.log("Profil:", JSON.stringify(profile, null, 2));
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    loadUserProfile();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={item.onPress}>
      <Ionicons name={item.icon} size={30} color="#fe61ad" />
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Menu Card */}
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.label}
        numColumns={3}
        contentContainerStyle={styles.menuGrid}
      />

      {/* Article */}
      <Text style={styles.sectionTitle}>Artikel Edukasi</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <EducationCard
          title="Nano Medicine"
          category="Health Tech"
          image={require("../assets/img-education/1.png")}
        />

        <EducationCard
          title="Nanobots in Medicine"
          category="Health Tech"
          image={require("../assets/img-education/2.png")}
        />

        <EducationCard
          title="Nanobots in Medicine"
          category="Health Tech"
          image={require("../assets/img-education/2.png")}
        />
      </ScrollView>
      <Text style={styles.sectionTitle}>Tools Tambahan</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={{ backgroundColor: "#fff", height: 100 }}
      ></ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  menuGrid: {
    alignItems: "center",
    marginBottom: -30,
    paddingHorizontal: 12,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  articleList: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 20,
  },
  articleCard: {
    width: 280,
    backgroundColor: "#E8F0FE",
    borderRadius: 10,
    padding: 12,
    marginLeft: -5,
    marginRight: 12,
    elevation: 2,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },
  articleSummary: {
    fontSize: 13,
    color: "#444",
  },
});
