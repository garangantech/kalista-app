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

  const saveData = async () => {
    const dur = parseInt(duration);
    const cyc = parseInt(cycle);
    if (isNaN(dur) || isNaN(cyc)) {
      Alert.alert("Input tidak valid", "Durasi dan Siklus harus berupa angka.");
      return;
    }

    const data = {
      lastPeriod: lastPeriod.toISOString(),
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
      nextPeriod: nextPeriod.toDateString(),
      fertileRange: `${fertileStart.toDateString()} - ${fertileEnd.toDateString()}`,
      ovulation: ovulation.toDateString(),
      pms: pmsStart.toDateString(),
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
        <Text>{lastPeriod.toDateString()}</Text>
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

      <Button title="Simpan & Prediksi" onPress={saveData} />

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
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
  dateBox: {
    padding: 10,
    backgroundColor: "#eee",
    marginVertical: 8,
    borderRadius: 6,
  },
  result: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#F0F4F8",
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
});
