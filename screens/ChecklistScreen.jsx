import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialData = {
  melahirkan: [
    { label: "Buku KIA", done: false },
    { label: "Popok Bayi", done: false },
    { label: "Pakaian Bayi", done: false },
    { label: "Vitamin Ibu Hamil", done: false },
  ],
  menikah: [
    { label: "KTP & Fotokopi", done: false },
    { label: "Akta Nikah", done: false },
    { label: "Buku Nikah", done: false },
    { label: "Persiapan Mental", done: false },
  ],
};

export default function ChecklistScreen() {
  const [selectedCategory, setSelectedCategory] = useState("melahirkan");
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    const stored = await AsyncStorage.getItem(`@checklist_${selectedCategory}`);
    if (stored) {
      setChecklist(JSON.parse(stored));
    } else {
      setChecklist(initialData[selectedCategory]);
    }
  };

  const saveData = async (updatedList) => {
    setChecklist(updatedList);
    await AsyncStorage.setItem(
      `@checklist_${selectedCategory}`,
      JSON.stringify(updatedList)
    );
  };

  const toggleItem = async (index) => {
    const updated = [...checklist];
    updated[index].done = !updated[index].done;
    saveData(updated);
  };

  const deleteItem = async (index) => {
    const updated = [...checklist];
    updated.splice(index, 1);
    saveData(updated);
  };

  const addItem = async () => {
    if (!newItem.trim()) return;
    const updated = [...checklist, { label: newItem.trim(), done: false }];
    setNewItem("");
    saveData(updated);
  };

  const getProgress = () => {
    if (checklist.length === 0) return 0;
    const doneCount = checklist.filter((item) => item.done).length;
    return Math.round((doneCount / checklist.length) * 100);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemRow}>
      <TouchableOpacity
        style={[styles.item, item.done && styles.itemDone]}
        onPress={() => toggleItem(index)}
      >
        <Text style={styles.itemText}>
          {item.done ? "✅ " : "⬜ "} {item.label}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteItem(index)}>
        <Text style={styles.deleteText}>🗑</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checklist Persiapan</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setSelectedCategory("melahirkan")}
          style={[
            styles.categoryButton,
            selectedCategory === "melahirkan" && styles.selectedCategory,
          ]}
        >
          <Text style={styles.categoryText}>Melahirkan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedCategory("menikah")}
          style={[
            styles.categoryButton,
            selectedCategory === "menikah" && styles.selectedCategory,
          ]}
        >
          <Text style={styles.categoryText}>Menikah</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${getProgress()}%` }]} />
      </View>
      <Text style={styles.progressText}>{getProgress()}% selesai</Text>

      <View>
        <FlatList
          data={checklist}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        <View style={{ marginBottom: 16 }}>
          <TextInput
            style={styles.input}
            placeholder="Tambah item baru"
            value={newItem}
            onChangeText={setNewItem}
          />
          <TouchableOpacity style={styles.button} onPress={addItem}>
            <Text style={styles.buttonText}>Tambah</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginHorizontal: 8,
  },
  selectedCategory: {
    backgroundColor: "#fe61ad",
  },
  categoryText: {
    color: "#000",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  item: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 6,
  },
  itemDone: {
    backgroundColor: "#d0f5d0",
  },
  itemText: {
    fontSize: 14,
  },
  deleteText: {
    fontSize: 18,
    color: "#ff5555",
    marginLeft: 10,
  },
  inputRow: {
    marginTop: 16,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 12,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 12,
    width: "100%",
  },
  button: {
    backgroundColor: "#fe61ad",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  progressContainer: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginBottom: 8,
    marginTop: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#4cd964",
  },
  progressText: {
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
});
