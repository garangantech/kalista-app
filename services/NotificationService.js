import * as Notifications from "expo-notifications";

/**
 * Minta izin dan jadwalkan notifikasi berdasarkan tanggal
 * @param {Date} date - Waktu notifikasi akan muncul
 * @param {string} title - Judul notifikasi
 * @param {string} body - Isi pesan
 */
export async function scheduleNotification(date, title, body) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      console.warn("❌ Izin notifikasi ditolak");
      return null;
    }
  }

  // Pastikan date valid dan tidak di masa lalu
  const triggerTime = date.getTime();
  if (isNaN(triggerTime) || triggerTime <= Date.now()) {
    console.warn("⏰ Waktu notifikasi tidak valid atau sudah lewat.");
    return null;
  }

  const trigger = {
    date, // langsung Date object, aman di Expo SDK 48+
  };

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger,
    });
    console.log("🔔 Notifikasi dijadwalkan:", id, date.toString());
    return id;
  } catch (err) {
    console.error("Gagal menjadwalkan notifikasi:", err);
    return null;
  }
}
