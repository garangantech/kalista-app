import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PregnancyScreen() {
  const [hpl, setHpl] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [ageInWeeks, setAgeInWeeks] = useState(null);
  const [trimester, setTrimester] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem("@pregnancy_data");
      if (stored) {
        const data = JSON.parse(stored);
        const hplDate = new Date(data.hpl);
        setHpl(hplDate);
        calculatePregnancy(hplDate);
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem(
      "@pregnancy_data",
      JSON.stringify({ hpl: hpl.toISOString() })
    );
    calculatePregnancy(hpl);
  };

  const calculatePregnancy = (hplDate) => {
    const today = new Date();
    const estimatedConception = new Date(hplDate);
    estimatedConception.setDate(estimatedConception.getDate() - 280); // Kehamilan 40 minggu

    const diff = today - estimatedConception;
    const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    setAgeInWeeks(week);

    if (week < 13) setTrimester("Trimester 1");
    else if (week < 27) setTrimester("Trimester 2");
    else setTrimester("Trimester 3");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kehamilan</Text>

      <Text>Hari Perkiraan Lahir (HPL):</Text>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setShowPicker(true)}
      >
        <Text>{hpl ? hpl.toDateString() : "Pilih Tanggal"}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={hpl || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setHpl(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Simpan & Hitung</Text>
      </TouchableOpacity>

      {ageInWeeks !== null && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Hasil Perhitungan:</Text>
          <Text>Usia Kehamilan: Minggu ke-{ageInWeeks}</Text>
          <Text>Trimester: {trimester}</Text>
          <Text>HPL: {hpl.toDateString()}</Text>
        </View>
      )}
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
    marginBottom: 16,
  },
  dateBox: {
    backgroundColor: "#fdf6f9",
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
    elevation: 1,
  },
  button: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  result: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#ffeef5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fe61ad40",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  resultTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
});
