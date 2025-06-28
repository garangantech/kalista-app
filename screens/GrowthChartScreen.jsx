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
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";

const screenWidth = Dimensions.get("window").width;

export default function GrowthChartScreen() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("@growth_data");
      if (stored) setData(JSON.parse(stored));
    };
    load();
  }, []);

  const formatDateIndo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

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

  const chartWidth = Math.max(screenWidth, data.length * 60);

  const weightChart = {
    labels: data.map((d) =>
      new Date(d.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    ),
    datasets: [
      {
        data: data.map((d) => d.weight),
        strokeWidth: 2,
        color: () => "#4A90E2",
      },
    ],
  };

  const heightChart = {
    labels: data.map((d) =>
      new Date(d.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    ),
    datasets: [
      {
        data: data.map((d) => d.height),
        strokeWidth: 2,
        color: () => "#50E3C2",
      },
    ],
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: "40%" }}
    >
      <Text style={styles.title}>Tumbuh Kembang Anak</Text>

      <View style={styles.formContainer}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateBox}
        >
          <Text style={{ color: date ? "#000" : "#999" }}>
            {date ? formatDateIndo(date) : "Pilih tanggal pengukuran"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={date ? new Date(date) : new Date()}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate.toISOString().split("T")[0]);
              }
            }}
          />
        )}

        <TextInput
          placeholder="Berat (kg)"
          placeholderTextColor="#999"
          style={styles.input}
          value={weight}
          keyboardType="decimal-pad"
          onChangeText={setWeight}
        />

        <TextInput
          placeholder="Tinggi (cm)"
          placeholderTextColor="#999"
          style={styles.input}
          value={height}
          keyboardType="decimal-pad"
          onChangeText={setHeight}
        />

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Tambah Data</Text>
        </TouchableOpacity>
      </View>

      {data.length > 0 && (
        <>
          <Text style={styles.chartTitle}>Grafik Berat Badan (kg)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={weightChart}
              width={chartWidth} // Auto-scale by data
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </ScrollView>

          <Text style={styles.chartTitle}>Grafik Tinggi Badan (cm)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={heightChart}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </ScrollView>
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
  formContainer: {
    backgroundColor: "#fff0f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#fe61ad30",
  },
  button: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fe61ad",
    marginBottom: 20,
    textAlign: "center",
  },
  chartTitle: {
    marginTop: 16,
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  container: {
    padding: 20,
    backgroundColor: "#fffafc",
    paddingBottom: 100,
  },
  dateBox: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    backgroundColor: "#fdf6f9",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
});
