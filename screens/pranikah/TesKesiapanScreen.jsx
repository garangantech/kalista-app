import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

const questions = [
  {
    id: 1,
    text: "Apakah kamu merasa siap secara emosional untuk berkomitmen seumur hidup?",
    options: ["Tidak siap", "Kurang yakin", "Siap"],
    score: [0, 1, 2],
  },
  {
    id: 2,
    text: "Apakah kamu dan pasangan memiliki visi hidup yang serupa?",
    options: ["Tidak", "Sedikit", "Ya"],
    score: [0, 1, 2],
  },
  {
    id: 3,
    text: "Sudahkah kamu dan pasangan terbuka soal keuangan?",
    options: ["Belum", "Sebagian", "Sudah"],
    score: [0, 1, 2],
  },
  {
    id: 4,
    text: "Seberapa baik komunikasi antara kamu dan pasangan?",
    options: ["Kurang baik", "Cukup", "Baik sekali"],
    score: [0, 1, 2],
  },
  {
    id: 5,
    text: "Apakah kamu siap menghadapi konflik tanpa kekerasan?",
    options: ["Belum siap", "Kadang", "Siap"],
    score: [0, 1, 2],
  },
];

export default function TesKesiapanScreen() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const hitungHasil = () => {
    if (Object.keys(answers).length < questions.length) {
      Alert.alert("Lengkapi semua jawaban terlebih dahulu.");
      return;
    }

    let total = 0;
    questions.forEach((q) => {
      const idx = answers[q.id];
      total += q.score[idx];
    });

    let message = "";
    if (total >= 9) {
      message =
        "✅ Kamu tampak sangat siap untuk menikah. Pertahankan komunikasi dan keterbukaan!";
    } else if (total >= 6) {
      message =
        "⚠️ Kamu cukup siap, namun perlu berdiskusi lebih lanjut dengan pasanganmu.";
    } else {
      message =
        "❌ Masih banyak yang perlu dipersiapkan. Jangan terburu-buru, evaluasi kembali dengan jujur.";
    }

    setResult({ total, message });
  };

  const renderQuestion = ({ item }) => (
    <View style={styles.questionBox}>
      <Text style={styles.questionText}>{item.text}</Text>
      {item.options.map((opt, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionBtn,
            answers[item.id] === index && styles.optionSelected,
          ]}
          onPress={() => handleSelect(item.id, index)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tes Kesiapan Menikah</Text>

      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={hitungHasil}>
        <Text style={styles.submitText}>Lihat Hasil</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultScore}>Skor: {result.total}</Text>
          <Text style={styles.resultMessage}>{result.message}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: "40%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fe61ad",
  },
  questionBox: {
    marginBottom: 20,
  },
  questionText: {
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  optionBtn: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    marginBottom: 6,
  },
  optionSelected: {
    backgroundColor: "#fe61ad30",
    borderColor: "#fe61ad",
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    color: "#444",
  },
  submitBtn: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#fef1f6",
    borderRadius: 10,
    borderColor: "#fe61ad50",
    borderWidth: 1,
  },
  resultScore: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#fe61ad",
  },
  resultMessage: {
    fontSize: 14,
    color: "#333",
  },
});
