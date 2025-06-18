import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ImmunizationScreen() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem("@immunization_data");
      if (stored) {
        setList(JSON.parse(stored));
      }
    };
    loadData();
  }, []);

  const saveList = async (newList) => {
    setList(newList);
    await AsyncStorage.setItem("@immunization_data", JSON.stringify(newList));
  };

  const addItem = () => {
    if (!name) return;
    const newItem = {
      name,
      date: date.toISOString(),
      done: false,
    };
    const updated = [...list, newItem].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    saveList(updated);
    setName("");
    setDate(new Date());
  };

  const toggleDone = (index) => {
    const updated = [...list];
    updated[index].done = !updated[index].done;
    saveList(updated);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.item, item.done && styles.itemDone]}
      onPress={() => toggleDone(index)}
    >
      <Text style={styles.itemText}>
        {item.name} - {new Date(item.date).toDateString()}
      </Text>
      {item.done && <Text style={styles.check}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jadwal Imunisasi Anak</Text>

      <Text>Nama Imunisasi:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Contoh: DPT 1, Polio"
      />

      <Text>Tanggal Imunisasi:</Text>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setShowPicker(true)}
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Button title="Tambah Jadwal" onPress={addItem} />

      <FlatList
        style={{ marginTop: 24 }}
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
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
    marginBottom: 10,
    borderRadius: 6,
  },
  item: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#F0F4F8",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemDone: {
    backgroundColor: "#d0f0d0",
  },
  itemText: {
    fontSize: 14,
  },
  check: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
});
