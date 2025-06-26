import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const moods = [
  { icon: "😊", label: "Senang" },
  { icon: "😐", label: "Biasa" },
  { icon: "😞", label: "Stres" },
];

export default function MoodTrackerScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    const stored = await AsyncStorage.getItem("@mood_history");
    if (stored) {
      setMoodHistory(JSON.parse(stored));
    }
  };

  const formatIndoDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const saveMood = async (mood) => {
    const today = new Date().toDateString();
    const updated = [
      { date: today, mood },
      ...moodHistory.filter((m) => m.date !== today),
    ].slice(0, 7); // keep last 7

    setMoodHistory(updated);
    await AsyncStorage.setItem("@mood_history", JSON.stringify(updated));
    setSelectedMood(mood);
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>
        📅 {formatIndoDate(item.date)} – {item.mood.icon} {item.mood.label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Tracker Harian</Text>
      <Text style={styles.subtitle}>Bagaimana perasaanmu hari ini?</Text>

      <View style={styles.moodRow}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.label}
            style={[
              styles.moodButton,
              selectedMood?.label === mood.label && styles.moodSelected,
            ]}
            onPress={() => saveMood(mood)}
          >
            <Text style={styles.moodIcon}>{mood.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Riwayat 7 Hari Terakhir</Text>
      <FlatList
        data={moodHistory}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  moodButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  moodSelected: {
    backgroundColor: "#fe61ad",
  },
  moodIcon: {
    fontSize: 32,
  },
  historyItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  historyText: {
    fontSize: 15,
    color: "#333",
  },
});
