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
import edukasiData from "../data/edukasi.json";
import pranikahData from "../data/pranikah.json";

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

  const renderEdukasiCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.articleCard}
      onPress={() => navigation.navigate("EdukasiDetail", { item })}
    >
      <Text style={styles.articleTitle}>{item.title}</Text>
      {item.summary && (
        <Text style={styles.articleSummary} numberOfLines={2}>
          {item.summary}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderPranikahCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.articleCard}
      onPress={() => navigation.navigate("PranikahDetail", { item })}
    >
      <Text style={styles.articleTitle}>{item.title}</Text>
      {item.summary && (
        <Text style={styles.articleSummary} numberOfLines={2}>
          {item.summary}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {userName ? `Halo, ${userName} 👋` : "Selamat Datang di KALISTA"}
        </Text>
        {/* {userStatus && (
          <Text style={styles.statusText}>Status: {userStatus}</Text>
        )} */}
        <Text style={styles.statusText}>
          <Text style={{ color: "blue", fontWeight: "bold" }}>KALISTA</Text>{" "}
          Mobile
        </Text>
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.label}
        numColumns={3}
        contentContainerStyle={styles.menuGrid}
      />

      <Text style={styles.sectionTitle}>Artikel Edukasi</Text>
      <FlatList
        data={edukasiData}
        horizontal
        renderItem={({ item }) => renderEdukasiCard(item)}
        keyExtractor={(item) => `edukasi-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.articleList}
      />

      <Text style={styles.sectionTitle}>Tips Pranikah</Text>
      <FlatList
        data={pranikahData}
        horizontal
        renderItem={({ item }) => renderPranikahCard(item)}
        keyExtractor={(item) => `pranikah-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.articleList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    // backgroundColor: "yellow",
    marginTop: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 19,
    color: "#555",
  },
  menuGrid: {
    alignItems: "center",
    marginBottom: -30,
    paddingHorizontal: 12,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#F0F4F8",
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
