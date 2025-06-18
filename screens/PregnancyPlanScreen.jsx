import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PregnancyPlanScreen() {
  const [lastPeriod, setLastPeriod] = useState(new Date());
  const [cycleLength, setCycleLength] = useState("28");
  const [showPicker, setShowPicker] = useState(false);
  const [fertileWindow, setFertileWindow] = useState(null);
  const [ovulationDay, setOvulationDay] = useState(null);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("@pregnancy_plan_data");
      if (stored) {
        const data = JSON.parse(stored);
        setLastPeriod(new Date(data.lastPeriod));
        setCycleLength(data.cycleLength.toString());
        calculateFertility(
          new Date(data.lastPeriod),
          parseInt(data.cycleLength)
        );
      }
    };
    load();
  }, []);

  const save = async () => {
    const data = {
      lastPeriod: lastPeriod.toISOString(),
      cycleLength: parseInt(cycleLength),
    };
    await AsyncStorage.setItem("@pregnancy_plan_data", JSON.stringify(data));
    calculateFertility(lastPeriod, parseInt(cycleLength));
  };

  const calculateFertility = (periodDate, cycle) => {
    const ovulation = new Date(periodDate);
    ovulation.setDate(ovulation.getDate() + (cycle - 14)); // ovulasi 14 hari sebelum haid berikutnya

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 5);

    setFertileWindow({
      from: fertileStart.toDateString(),
      to: ovulation.toDateString(),
    });

    setOvulationDay(ovulation.toDateString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Program Hamil</Text>

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
          onChange={(e, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setLastPeriod(selectedDate);
          }}
        />
      )}

      <Text>Panjang Siklus (hari):</Text>
      <TextInput
        style={styles.input}
        value={cycleLength}
        onChangeText={setCycleLength}
        keyboardType="numeric"
      />

      <Button title="Simpan & Hitung" onPress={save} />

      {fertileWindow && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Perkiraan Masa Subur:</Text>
          <Text>
            {fertileWindow.from} s.d {fertileWindow.to}
          </Text>
          <Text>Hari Ovulasi: {ovulationDay}</Text>
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
