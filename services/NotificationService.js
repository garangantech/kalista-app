import * as Notifications from "expo-notifications";

/**
 * Jadwalkan notifikasi berdasarkan tanggal
 * @param {Date} date - Waktu notifikasi akan muncul
 * @param {string} title - Judul notifikasi
 * @param {string} body - Isi pesan
 */
export async function scheduleNotification(date, title, body) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: date,
  });

  console.log("🔔 Notifikasi dijadwalkan:", id, date.toString());
  return id;
}
