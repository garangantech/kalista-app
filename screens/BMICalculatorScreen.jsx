import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";

export default function BMICalculatorScreen() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;

    if (!w || !h) return;

    const result = w / (h * h);
    setBmi(result.toFixed(1));

    if (result < 18.5) setCategory("Underweight");
    else if (result < 25) setCategory("Normal");
    else if (result < 30) setCategory("Overweight");
    else setCategory("Obese");
  };

  const getCategoryColor = () => {
    if (category === "Underweight") return "#f39c12";
    if (category === "Normal") return "#27ae60";
    if (category === "Overweight") return "#e67e22";
    if (category === "Obese") return "#c0392b";
    return "#333";
  };

  const getEmoji = (category) => {
    switch (category) {
      case "Underweight":
        return "🍃";
      case "Normal":
        return "✅";
      case "Overweight":
        return "⚠️";
      case "Obese":
        return "🔥";
      default:
        return "";
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Kalkulator BMI</Text>

      <TextInput
        style={styles.input}
        placeholder="Berat Badan (kg)"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Tinggi Badan (cm)"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Hitung BMI</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>BMI: {bmi}</Text>
          <Text style={[styles.categoryText, { color: getCategoryColor() }]}>
            <Text style={styles.resultText}>
              {getEmoji(category)} {category}
            </Text>
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: "#fef6f9",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fe61ad",
  },
  categoryText: {
    fontSize: 16,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
