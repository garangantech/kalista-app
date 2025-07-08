import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "../../services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";

export default function ForumChatPerawatScreen() {
  const [replies, setReplies] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { forum } = route.params;
  const navigation = useNavigation(); // langsung dari /forum/handle

  const getToken = async () => await AsyncStorage.getItem("@token");

  const fetchReplies = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`/forum/${forum.id}/replies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplies(res.data.data);
    } catch (err) {
      console.log("❌ Gagal fetch replies:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!message.trim()) return;
    try {
      const token = await getToken();
      await axios.post(
        "/forum/reply",
        { question_id: forum.id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("");
      setTimeout(fetchReplies, 500);
    } catch (err) {
      console.log("❌ Gagal kirim pesan:", err);
    }
  };

  const handleCloseForum = () => {
    Alert.alert("Konfirmasi", "Yakin ingin menutup forum ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Tutup",
        style: "destructive",
        onPress: () => confirmCloseForum(), // panggil fungsi terpisah
      },
    ]);
  };

  const confirmCloseForum = async () => {
    try {
      const token = await getToken();
      await axios.post(
        "/forum/close",
        { forum_id: forum.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigation.navigate("MainTabs");
    } catch (err) {
      console.log("❌ Gagal menutup forum:", err);
    }
  };

  useEffect(() => {
    fetchReplies();
    const interval = setInterval(fetchReplies, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fe61ad" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Pasien: {forum.user?.name}</Text>
        {replies.length > 0 && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseForum}
          >
            <Text style={styles.closeText}>Tutup Forum</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={{ paddingBottom: 90 + insets.bottom }}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* Pertanyaan awal */}
        {forum.title && (
          <View style={[styles.bubble, styles.left]}>
            <Text style={styles.sender}>{forum.user?.name}</Text>
            <Text style={styles.message}>{forum.title}</Text>
            <Text style={styles.timestamp}>(Pertanyaan awal)</Text>
          </View>
        )}

        {/* Balasan chat */}
        {replies.map((reply, index) => (
          <View
            key={index}
            style={[
              styles.bubble,
              reply.sender_role === "perawat" ? styles.right : styles.left,
            ]}
          >
            <Text style={styles.sender}>{reply.sender_name}</Text>
            <Text style={styles.message}>{reply.message}</Text>
            <Text style={styles.timestamp}>{reply.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      <View
        style={[styles.inputContainer, { paddingBottom: insets.bottom || 10 }]}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Tulis balasan..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={sendReply} style={styles.sendButton}>
          <Text style={styles.sendText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff0f5",
    borderBottomWidth: 1,
    borderBottomColor: "#fe61ad30",
  },
  headerText: { color: "#fe61ad", fontWeight: "bold" },
  chatContainer: { flex: 1, padding: 16 },
  bubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
  },
  left: { alignSelf: "flex-start", backgroundColor: "#fff0f5" },
  right: { alignSelf: "flex-end", backgroundColor: "#dcf8c6" },
  sender: { fontWeight: "bold", marginBottom: 4 },
  message: { fontSize: 15 },
  timestamp: { fontSize: 11, color: "#999", marginTop: 4 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendText: { color: "#fff", fontWeight: "bold" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    backgroundColor: "#999",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
