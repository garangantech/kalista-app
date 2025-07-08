import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import axios from "../../services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ForumEntryRedirect() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToForum = async () => {
      try {
        // Bisa juga dicek token jika mau
        const token = await AsyncStorage.getItem("@token");

        // Validasi token ada
        if (!token) {
          Alert.alert("Sesi Habis", "Silakan login ulang");
          return;
        }

        // Langsung redirect ke ForumChat (biar logika ditangani di dalam sana)
        navigation.replace("ForumChat");
      } catch (err) {
        console.log("❌ Error redirect forum:", err);
        Alert.alert("Gagal", "Gagal mengakses forum.");
      } finally {
        setLoading(false);
      }
    };

    redirectToForum();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fe61ad" />
      </View>
    );
  }

  return null;
}
