import React from "react";
import { useEffect } from "react";
import Navigation from "./Navigation";
import * as Notifications from "expo-notifications";
import { Platform, ScrollView } from "react-native";
import { scheduleNotification } from "./services/NotificationService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Izin notifikasi ditolak");
        return;
      }
      console.log("✅ Izin notifikasi diizinkan");
    };

    setupNotifications();
  }, []);

  return <Navigation />;
}
