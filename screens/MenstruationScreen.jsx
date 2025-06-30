import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { scheduleNotification } from "../services/NotificationService";

export default function MenstruationScreen() {
  const [lastPeriod, setLastPeriod] = useState(new Date());
  const [duration, setDuration] = useState("5");
  const [cycle, setCycle] = useState("28");
  const [showPicker, setShowPicker] = useState(false);
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem("@menstruation_data");
      if (stored) {
        const data = JSON.parse(stored);
        setLastPeriod(new Date(data.lastPeriod));
        setDuration(data.duration.toString());
        setCycle(data.cycleLength.toString());
        calculatePrediction(
          new Date(data.lastPeriod),
          data.duration,
          data.cycleLength
        );
      }
    };
    loadData();
  }, []);

  const formatTanggalIndonesia = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const saveData = async () => {
    const dur = parseInt(duration);
    const cyc = parseInt(cycle);
    if (isNaN(dur) || isNaN(cyc)) {
      Alert.alert("Input tidak valid", "Durasi dan Siklus harus berupa angka.");
      return;
    }

    const data = {
      lastPeriod: lastPeriod.toString(),
      duration: dur,
      cycleLength: cyc,
    };
    await AsyncStorage.setItem("@menstruation_data", JSON.stringify(data));
    calculatePrediction(lastPeriod, dur, cyc);

    // ⏰ Jadwal notifikasi haid berikutnya
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cyc);
    await scheduleNotification(
      nextPeriod,
      "Pengingat Haid",
      "Hari ini kamu diperkirakan mulai haid."
    );

    Alert.alert(
      "Berhasil",
      "Data siklus haid disimpan dan prediksi diperbarui."
    );
  };

  const calculatePrediction = (startDate, duration, cycleLength) => {
    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    const ovulation = new Date(nextPeriod);
    ovulation.setDate(ovulation.getDate() - 14);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 2);

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 2);

    const pmsStart = new Date(nextPeriod);
    pmsStart.setDate(pmsStart.getDate() - 5);

    setPredictions({
      nextPeriod: formatTanggalIndonesia(nextPeriod),
      fertileRange: `${formatTanggalIndonesia(
        fertileStart
      )} - ${formatTanggalIndonesia(fertileEnd)}`,
      ovulation: formatTanggalIndonesia(ovulation),
      pms: formatTanggalIndonesia(pmsStart),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Siklus Menstruasi</Text>

      <Text>Tanggal Haid Terakhir:</Text>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setShowPicker(true)}
      >
        <Text>{formatTanggalIndonesia(lastPeriod)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={lastPeriod}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowPicker(false);
            if (date) setLastPeriod(date);
          }}
        />
      )}

      <Text>Durasi Haid (hari):</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="Misal 5"
      />

      <Text>Rata-rata Siklus (hari):</Text>
      <TextInput
        style={styles.input}
        value={cycle}
        onChangeText={setCycle}
        keyboardType="numeric"
        placeholder="Misal 28"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveData}>
        <Text style={styles.saveButtonText}>Simpan & Prediksi</Text>
      </TouchableOpacity>

      {predictions && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Hasil Prediksi:</Text>
          <Text>Haid Berikutnya: {predictions.nextPeriod}</Text>
          <Text>Masa Subur: {predictions.fertileRange}</Text>
          <Text>Ovulasi: {predictions.ovulation}</Text>
          <Text>Perkiraan PMS: {predictions.pms}</Text>
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
  input: {
    backgroundColor: "#fff",
    borderWidth: 0,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dateBox: {
    backgroundColor: "#fdf6f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
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
  saveButton: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
