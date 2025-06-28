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

  const formatTanggalIndonesia = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

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
    ovulation.setDate(ovulation.getDate() + (cycle - 14));

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 5);

    setFertileWindow({
      from: formatTanggalIndonesia(fertileStart),
      to: formatTanggalIndonesia(ovulation),
    });

    setOvulationDay(formatTanggalIndonesia(ovulation));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Program Hamil</Text>

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

      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Simpan & Hitung</Text>
      </TouchableOpacity>

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
    borderColor: "#fe61ad50",
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff0f7",
    fontSize: 15,
  },
  dateBox: {
    padding: 12,
    backgroundColor: "#fff0f7",
    borderColor: "#fe61ad40",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  result: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#fff0f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fe61ad30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#fe61ad",
  },
});
