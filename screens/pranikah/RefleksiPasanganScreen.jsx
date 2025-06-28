import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const questions = [
  "Apa hal paling menyenangkan minggu ini bersama pasanganmu?",
  "Adakah hal yang ingin kamu perbaiki dalam komunikasi kalian?",
  "Apa satu hal kecil yang kamu syukuri dari pasanganmu hari ini?",
  "Bagaimana perasaanmu tentang hubungan kalian minggu ini?",
];

export default function RefleksiPasanganScreen() {
  const [answer, setAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [list, setList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stored = await AsyncStorage.getItem("@refleksi_pasangan");
    if (stored) {
      setList(JSON.parse(stored));
    }
  };

  const saveData = async (newList) => {
    setList(newList);
    await AsyncStorage.setItem("@refleksi_pasangan", JSON.stringify(newList));
  };

  const submit = async () => {
    if (!answer.trim()) {
      Alert.alert("Jawaban tidak boleh kosong.");
      return;
    }

    const entry = {
      question: selectedQuestion,
      answer,
      date: new Date().toISOString(),
    };

    const updated = [entry, ...list];
    await saveData(updated);
    setAnswer("");
    setSelectedQuestion(questions[0]);
    Alert.alert("✅ Disimpan", "Refleksi berhasil disimpan.");
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.date}>
        {new Date(item.date).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Text>
      <Text style={styles.q}>Q: {item.question}</Text>
      <Text style={styles.a}>A: {item.answer}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Refleksi Pasangan</Text>

      <Text style={styles.label}>Pertanyaan Refleksi:</Text>
      {questions.map((q) => (
        <TouchableOpacity
          key={q}
          style={[styles.qItem, selectedQuestion === q && styles.qItemSelected]}
          onPress={() => setSelectedQuestion(q)}
        >
          <Text style={styles.qText}>{q}</Text>
        </TouchableOpacity>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Tuliskan jawabanmu..."
        multiline
        value={answer}
        onChangeText={setAnswer}
      />

      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Simpan Refleksi</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 24 }}>
        {list.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.q}>Q: {item.question}</Text>
            <Text style={styles.a}>A: {item.answer}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fe61ad",
  },
  label: { fontWeight: "600", marginBottom: 8 },
  qItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  qItemSelected: {
    backgroundColor: "#feebf4",
    borderWidth: 1,
    borderColor: "#fe61ad",
  },
  qText: { fontSize: 14, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    minHeight: 100,
    padding: 10,
    marginTop: 10,
    textAlignVertical: "top",
  },
  btn: {
    backgroundColor: "#fe61ad",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  item: {
    backgroundColor: "#fdf1f7",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  date: {
    fontWeight: "bold",
    color: "#fe61ad",
    marginBottom: 4,
  },
  q: { fontWeight: "bold", color: "#333" },
  a: { marginTop: 4, color: "#555" },
});
