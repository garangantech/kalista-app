import React from "react";
import { useEffect } from "react";
import Navigation, { navigationRef } from "./Navigation";
import * as Notifications from "expo-notifications";
import { Platform, ScrollView } from "react-native";
import { scheduleNotification } from "./services/NotificationService";
import { SearchProvider } from "./utils/SearchContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "./screens/SplashScreen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function App() {
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log("Semua data berhasil dihapus dari AsyncStorage");
    } catch (e) {
      console.error("Gagal menghapus data:", e);
    }
  };
  useEffect(() => {
    // clearAllData();
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Izin notifikasi ditolak");
        return;
      }
      console.log("✅ Izin notifikasi diizinkan");
    };
    console.log("Ref ready?", navigationRef.isReady());
    setupNotifications();
  }, []);

  return (
    <SearchProvider>
      <Navigation />
    </SearchProvider>
  );
}
