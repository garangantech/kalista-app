import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleNotification } from "../services/NotificationService";

export default function ImmunizationScreen() {
  const [age, setAge] = useState(""); // umur dalam bulan
  const [recommendations, setRecommendations] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem("@immunization_data");
      if (stored) {
        setList(JSON.parse(stored));
      }
    };
    loadData();
  }, []);

  const getRecommendation = (months) => {
    if (months < 1) return ["HB-0"];
    if (months <= 2) return ["BCG", "Polio 1", "DPT 1"];
    if (months <= 4) return ["DPT 2", "Polio 2"];
    if (months <= 6) return ["DPT 3", "Polio 3", "Hepatitis B"];
    if (months <= 9) return ["Campak"];
    if (months <= 18) return ["DPT Booster", "Polio Booster"];
    return ["Cek ulang ke posyandu"];
  };

  useEffect(() => {
    const bulan = parseInt(age);
    if (!isNaN(bulan)) {
      const list = getRecommendation(bulan);
      setRecommendations(list);
    } else {
      setRecommendations([]);
    }
  }, [age]);

  const formatTanggalIndonesia = (dateString) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short", // Sen, Sel, Rab, dst
      day: "2-digit", // 01, 02, dst
      month: "short", // Jan, Feb, dst
      year: "numeric",
    }).format(date);
  };

  const saveList = async (newList) => {
    setList(newList);
    await AsyncStorage.setItem("@immunization_data", JSON.stringify(newList));
  };

  const addItem = async () => {
    if (!name) {
      Alert.alert("Nama imunisasi wajib diisi.");
      return;
    }

    const newItem = {
      name,
      date: date.toISOString(),
      done: false,
    };

    const updated = [...list, newItem].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    await saveList(updated);
    setName("");
    setDate(new Date());

    const targetDate = new Date(newItem.date);

    // Jadwal notifikasi hari-H
    await scheduleNotification(
      targetDate,
      "Jadwal Imunisasi Anak",
      `Hari ini jadwal imunisasi untuk: ${newItem.name}`
    );

    // Notifikasi H-1
    const minus1 = new Date(targetDate);
    minus1.setDate(minus1.getDate() - 2);
    await scheduleNotification(
      minus1,
      "Pengingat Imunisasi",
      `Besok adalah jadwal imunisasi untuk: ${newItem.name}`
    );

    // Notifikasi H-3
    const minus3 = new Date(targetDate);
    minus3.setDate(minus3.getDate() - 4);
    await scheduleNotification(
      minus3,
      "Pengingat Imunisasi",
      `Imunisasi untuk ${newItem.name} dijadwalkan 3 hari lagi`
    );
  };

  const handleDelete = (index) => {
    Alert.alert(
      "Hapus Jadwal",
      "Apakah kamu yakin ingin menghapus jadwal ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            const updated = [...list];
            updated.splice(index, 1); // hapus 1 item di index
            await saveList(updated);
          },
        },
      ]
    );
  };

  const toggleDone = (index) => {
    const updated = [...list];
    updated[index].done = !updated[index].done;
    saveList(updated);
  };

  const renderItem = ({ item, index }) => {
    const itemStyle = item.done ? [styles.item, styles.itemDone] : styles.item;

    return (
      <View style={itemStyle}>
        {/* Teks Jadwal (klik untuk toggle done) */}
        <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleDone(index)}>
          <Text style={styles.itemText}>
            {item.name} - {formatTanggalIndonesia(item.date)}
          </Text>
        </TouchableOpacity>

        {/* Area kanan: centang (jika done) + tombol hapus */}
        <View style={styles.actionArea}>
          {item.done && <Text style={styles.check}>✓</Text>}
          <TouchableOpacity
            onPress={() => handleDelete(index)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jadwal Imunisasi Anak</Text>

      <Text>Umur Anak (bulan):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Contoh: 2"
        value={age}
        onChangeText={setAge}
      />

      {recommendations.length > 0 && (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            Rekomendasi Imunisasi:
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {recommendations.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chip}
                onPress={() => setName(item)}
              >
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <Text>Nama Imunisasi:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Contoh: DPT 1, Polio"
      />

      <Text>Tanggal Imunisasi:</Text>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setShowPicker(true)}
      >
        <Text>{formatTanggalIndonesia(date)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.addButtonText}>+ Tambah Jadwal</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <FlatList
          style={{ marginTop: 24 }}
          data={list}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: "15%",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#ffe6f0",
    borderColor: "#fe61ad",
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 13,
    color: "#fe61ad",
    fontWeight: "500",
  },
  input: {
    borderWidth: 0,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  dateBox: {
    padding: 12,
    backgroundColor: "#fdf6f9",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  addButton: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  actionArea: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  check: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginRight: 8,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 18,
    color: "red",
  },

  item: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // penting agar centang & tombol rata tengah
  },
  itemDone: {
    backgroundColor: "#d0f0d0",
  },
  itemText: {
    fontSize: 14,
  },
});
