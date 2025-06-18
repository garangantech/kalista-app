import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

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
    const data = {
      lastPeriod: lastPeriod.toISOString(),
      duration: parseInt(duration),
      cycleLength: parseInt(cycle),
    };
    await AsyncStorage.setItem("@menstruation_data", JSON.stringify(data));
    calculatePrediction(lastPeriod, data.duration, data.cycleLength);
  };

  const calculatePrediction = (startDate, duration, cycleLength) => {
    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    const ovulation = new Date(nextPeriod);
    ovulation.setDate(ovulation.getDate() - 14); // Ovulasi 14 hari sebelum haid berikutnya

    const pmsStart = new Date(nextPeriod);
    pmsStart.setDate(pmsStart.getDate() - 5); // PMS 5 hari sebelum haid

    setPredictions({
      nextPeriod: nextPeriod.toDateString(),
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
      />

      <Text>Rata-rata Siklus (hari):</Text>
      <TextInput
        style={styles.input}
        value={cycle}
        onChangeText={setCycle}
        keyboardType="numeric"
      />

      <Button title="Simpan & Prediksi" onPress={saveData} />

      {predictions && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Hasil Prediksi:</Text>
          <Text>Haid Berikutnya: {predictions.nextPeriod}</Text>
          <Text>Masa Subur (Ovulasi): {predictions.ovulation}</Text>
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
