// NotificationService.js
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Atur bagaimana notifikasi akan muncul saat app sedang aktif
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Izin notifikasi tidak diberikan!");
    return false;
  }

  // Android: wajib membuat notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

export async function scheduleLocalNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Waktunya Istirahat!",
      body: "Jangan lupa rehat sebentar ya.",
    },
    trigger: { seconds: 5 }, // dalam 5 detik
  });
}
