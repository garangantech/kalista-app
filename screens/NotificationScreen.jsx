import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("@notification_history");
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("@notification_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(
          "📦 Notifikasi ditemukan:\n",
          JSON.stringify(parsed, null, 2)
        );
        setNotifications(parsed);
      } else {
        console.log("📭 Tidak ada notifikasi yang tersimpan.");
      }
    };
    load();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.body}</Text>
      <Text style={styles.time}>
        {new Date(item.time).toLocaleString("id-ID")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: "#aaa" }}>
              Tidak ada notifikasi yang tersimpan.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fe61ad",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    backgroundColor: "#fff0f5",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fe61ad",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    fontStyle: "italic",
  },
});
