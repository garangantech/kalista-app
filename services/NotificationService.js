import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fungsi menyimpan ke riwayat notifikasi
async function saveNotificationToStorage(title, body) {
  const key = "@notification_history";
  const now = new Date().toISOString();
  const newNotif = { id: now, title, body, time: now };

  const existing = await AsyncStorage.getItem(key);
  const parsed = existing ? JSON.parse(existing) : [];
  const updated = [newNotif, ...parsed].slice(0, 30);
  await AsyncStorage.setItem(key, JSON.stringify(updated));
}

// Fungsi menjadwalkan notifikasi
export async function scheduleNotification(date, title, body) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      console.warn("❌ Izin notifikasi ditolak");
      return null;
    }
  }

  const triggerTime = date.getTime();
  if (isNaN(triggerTime) || triggerTime <= Date.now()) {
    console.warn("⏰ Waktu notifikasi tidak valid atau sudah lewat.");
    return null;
  }

  const trigger = { date };

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger,
    });

    await saveNotificationToStorage(title, body);

    console.log("🔔 Notifikasi dijadwalkan:", id, date.toString());
    return id;
  } catch (err) {
    console.error("Gagal menjadwalkan notifikasi:", err);
    return null;
  }
}
