import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  ];

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem("@user_profile");
        if (stored) {
          const profile = JSON.parse(stored);
          setUserName(profile.name || "Pengguna");
          setUserStatus(profile.status || "-");
          console.log("🧠 Profil:", JSON.stringify(profile, null, 2));
        }
      } catch (error) {
        console.log("❌ Error:", error);
      }
    };

    loadUserProfile();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={item.onPress}>
      <Ionicons name={item.icon} size={30} color="#4A90E2" />
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {userName ? `Halo, ${userName} 👋` : "Selamat Datang di KALISTA"}
      </Text>
      {userStatus && (
        <Text style={styles.statusText}>Status: {userStatus}</Text>
      )}

      <Text style={styles.subtitle}>Akses cepat fitur utama:</Text>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.label}
        numColumns={3}
        contentContainerStyle={styles.menuGrid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  menuGrid: {
    alignItems: "center",
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#F0F4F8",
    borderRadius: 12,
    margin: 8,
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
});
