import React, { useState, useEffect } from "react";
import edukasiData from "../../data/edukasi.json";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

const emojis = ["😊", "😐", "😞", "🥰", "😠", "😭"];

export default function JurnalPribadiScreen() {
  const navigation = useNavigation();
  const [entry, setEntry] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [list, setList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const pranikahArticles = edukasiData.filter((item) =>
    item.category.toLowerCase().includes("pranikah")
  );

  const loadEntries = async () => {
    const stored = await AsyncStorage.getItem("@jurnal_pribadi");
    if (stored) {
      setList(JSON.parse(stored));
    }
  };

  const saveToStorage = async (updatedList) => {
    setList(updatedList);
    await AsyncStorage.setItem("@jurnal_pribadi", JSON.stringify(updatedList));
  };

  const saveEntry = async () => {
    if (!entry.trim()) {
      Alert.alert("Isi jurnal tidak boleh kosong.");
      return;
    }
    if (!emoji) {
      Alert.alert("Pilih emoji yang menggambarkan perasaanmu.");
      return;
    }

    const newItem = {
      date: new Date().toISOString(),
      content: entry,
      emoji,
    };

    const updatedList =
      editIndex !== null
        ? list.map((item, index) => (index === editIndex ? newItem : item))
        : [newItem, ...list];

    await saveToStorage(updatedList);

    setEntry("");
    setEmoji(null);
    setEditIndex(null);
    setModalVisible(false);
  };

  const handleEdit = (index) => {
    const item = list[index];
    setEntry(item.content);
    setEmoji(item.emoji);
    setEditIndex(index);
    setModalVisible(true);
  };

  const handleDelete = (index) => {
    Alert.alert("Hapus Jurnal", "Yakin ingin menghapus entri ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          const updated = list.filter((_, i) => i !== index);
          await saveToStorage(updated);
        },
      },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.date}>
          {item.emoji}{" "}
          {new Date(item.date).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleEdit(index)}>
            <Text style={styles.editBtn}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(index)}>
            <Text style={styles.deleteBtn}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Tambah Jurnal</Text>
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.journalWrapper}>
          <FlatList
            data={list}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 12 }}>
                Belum ada jurnal
              </Text>
            }
          />
        </View>
        <Text style={styles.subheading}>Baca Artikel Pranikah</Text>
        {pranikahArticles.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate("EdukasiDetail", { item })}
          >
            <View style={styles.articleCard}>
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text style={styles.articleSummary} numberOfLines={2}>
                {item.summary}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editIndex !== null ? "Edit Jurnal" : "Jurnal Baru"}
          </Text>
          <TextInput
            placeholder="Tuliskan isi jurnalmu..."
            style={styles.input}
            value={entry}
            onChangeText={setEntry}
            multiline
          />
          <View style={styles.emojiRow}>
            {emojis.map((e) => (
              <TouchableOpacity
                key={e}
                style={[styles.emojiBtn, emoji === e && styles.emojiSelected]}
                onPress={() => setEmoji(e)}
              >
                <Text style={{ fontSize: 24 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.modalButtons}>
            <Button title="Simpan" onPress={saveEntry} />
            <Button
              title="Batal"
              color="gray"
              onPress={() => {
                setModalVisible(false);
                setEntry("");
                setEmoji(null);
                setEditIndex(null);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#fe61ad",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    // margin: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#fdf1f7",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontWeight: "bold",
    color: "#fe61ad",
  },
  content: {
    marginTop: 6,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  editBtn: { fontSize: 16, marginHorizontal: 4 },
  deleteBtn: { fontSize: 16, marginHorizontal: 4 },

  modalContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    minHeight: 100,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  emojiRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  emojiBtn: {
    padding: 8,
    marginRight: 10,
    borderRadius: 6,
  },
  emojiSelected: {
    backgroundColor: "#feebf4",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  articleCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#eee",
    borderWidth: 1,
  },

  articleTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },

  articleSummary: {
    fontSize: 12,
    color: "#666",
  },

  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    color: "#fe61ad",
  },
  journalWrapper: {
    marginTop: 10,
    paddingTop: 15,
    minHeight: 150,
    // marginHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 10,
  },
});
