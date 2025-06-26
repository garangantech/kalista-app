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

export default function WaterCalculatorScreen() {
  const [weight, setWeight] = useState("");
  const [waterNeed, setWaterNeed] = useState(null);

  const calculateWater = () => {
    const w = parseFloat(weight);
    if (!w) return;

    const ml = w * 30;
    const liter = (ml / 1000).toFixed(2);
    setWaterNeed(liter);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Kalkulator Kebutuhan Air</Text>

      <TextInput
        style={styles.input}
        placeholder="Berat Badan (kg)"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TouchableOpacity style={styles.button} onPress={calculateWater}>
        <Text style={styles.buttonText}>Hitung</Text>
      </TouchableOpacity>

      {waterNeed && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Kamu disarankan minum sekitar:</Text>
          <Text style={styles.liter}>{waterNeed} liter / hari 💧</Text>
        </View>
      )}
      <Text style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
        Tips: minum 8–10 gelas per hari
      </Text>
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
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 12,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
  liter: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 8,
  },
});
