import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function GrowthChartScreen() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("@growth_data");
      if (stored) setData(JSON.parse(stored));
    };
    load();
  }, []);

  const handleAdd = async () => {
    if (!date || !weight || !height) return;
    const entry = {
      date,
      weight: parseFloat(weight),
      height: parseFloat(height),
    };
    const newData = [...data, entry];
    setData(newData);
    await AsyncStorage.setItem("@growth_data", JSON.stringify(newData));
    setDate("");
    setWeight("");
    setHeight("");
  };

  const weightChart = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        data: data.map((d) => d.weight),
        strokeWidth: 2,
        color: () => "#4A90E2",
      },
    ],
  };

  const heightChart = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        data: data.map((d) => d.height),
        strokeWidth: 2,
        color: () => "#50E3C2",
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tumbuh Kembang Anak</Text>

      <TextInput
        placeholder="Tanggal (YYYY-MM-DD)"
        placeholderTextColor="gray"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        placeholder="Berat (kg)"
        placeholderTextColor="gray"
        style={styles.input}
        value={weight}
        keyboardType="decimal-pad"
        onChangeText={setWeight}
      />
      <TextInput
        placeholder="Tinggi (cm)"
        placeholderTextColor="gray"
        style={styles.input}
        value={height}
        keyboardType="decimal-pad"
        onChangeText={setHeight}
      />
      <Button title="Tambah Data" onPress={handleAdd} />

      {data.length > 0 && (
        <>
          <Text style={styles.chartTitle}>Grafik Berat Badan (kg)</Text>
          <LineChart
            data={weightChart}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>Grafik Tinggi Badan (cm)</Text>
          <LineChart
            data={heightChart}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </>
      )}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
  labelColor: () => "#333",
  strokeWidth: 2,
  decimalPlaces: 1,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  chartTitle: {
    marginTop: 24,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
    marginBottom: 16,
  },
});
