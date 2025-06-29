import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EducationCard from "../components/EducationCard";
import ToolMenuItems from "../components/ToolMenuItems";
import edukasiData from "../data/edukasi.json";
import { useFocusEffect } from "@react-navigation/native";
import { SearchContext } from "../utils/SearchContext";

const CARD_SIZE = Dimensions.get("window").width / 3 - 24;
const imageMap = {
  "1.png": require("../assets/img-education/1.png"),
  "2.png": require("../assets/img-education/2.png"),
  "default.png": require("../assets/img-education/1.png"), // optional fallback
};

export default function DashboardScreen({ navigation }) {
  const { searchKeyword, setSearchKeyword } = useContext(SearchContext);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchKeyword(""); // reset saat keluar
      };
    }, [])
  );

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

  const toolItems = [
    {
      label: "BMI",
      icon: "fitness-outline",
      iconLib: "Ionicons",
      onPress: () => navigation.navigate("BMICalculator"),
    },
    {
      label: "Mood",
      icon: "emoticon-happy-outline",
      iconLib: "MaterialCommunityIcons",
      onPress: () => navigation.navigate("MoodTracker"),
    },
    {
      label: "Air",
      icon: "cup-water",
      iconLib: "MaterialCommunityIcons",
      onPress: () => navigation.navigate("WaterCalculator"),
    },
    {
      label: "Checklist",
      icon: "checkcircleo",
      iconLib: "AntDesign",
      onPress: () => navigation.navigate("ChecklistScreen"),
    },
  ];

  const filteredData = edukasiData.filter((item) =>
    item.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: "row",
        gap: 10,
      }}
      onPress={() => navigation.navigate("EdukasiDetail", { item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: "#888" }}>{item.category}</Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.title}</Text>
        <Text numberOfLines={2} style={{ color: "#444" }}>
          {item.summary}
        </Text>
      </View>
      <Image
        source={
          imageMap[item.image] || require("../assets/img-education/1.png")
        }
        style={{ width: 80, height: 80, borderRadius: 10 }}
      />
    </TouchableOpacity>
  );

  // ===== Conditional Rendering =====
  if (searchKeyword.trim() !== "") {
    return (
      <View style={{ flex: 1, padding: 15, backgroundColor: "#eaebf0" }}>
        <Text style={styles.sectionTitle}>Hasil Pencarian</Text>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
              Tidak ada hasil ditemukan.
            </Text>
          }
        />
      </View>
    );
  }

  return (
    <ScrollView
      showsHorizontalScrollIndicator={true}
      style={{ padding: 15, backgroundColor: "#eaebf0" }}
    >
      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.card}
            onPress={item.onPress}
          >
            <Ionicons name={item.icon} size={30} color="#fe61ad" />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Artikel Edukasi</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 160, marginBottom: 10 }}
      >
        {edukasiData.slice(0, 4).map((item, index) => (
          <EducationCard
            key={item.id}
            title={item.title}
            category={item.category}
            onPress={() => navigation.navigate("EdukasiDetail", { item })}
            image={
              imageMap[item.image] || require("../assets/img-education/1.png")
            }
          />
        ))}
      </ScrollView>
      <Text style={styles.sectionTitle}>Tools Menarik</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          backgroundColor: "#fff",
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <ToolMenuItems data={toolItems} />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },

  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 3,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  sectionTitle: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2d2d2d",
  },
});
